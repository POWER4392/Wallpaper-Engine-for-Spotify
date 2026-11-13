import sys, os, json, math, struct, re, subprocess, shutil
import numpy as np
from PIL import Image, ImageChops

sys.stdout.reconfigure(encoding='utf-8', errors='backslashreplace')

def parse_vec(val, default):
    if isinstance(val, dict):
        anim = val.get('animation')
        base_vec = parse_vec(val.get('value', ''), default)
        if isinstance(anim, dict):
            opts = anim.get('options', {})
            if isinstance(opts, dict) and str(opts.get('mode', '')).lower() == 'single':
                is_rel = bool(anim.get('relative', False))
                out = list(base_vec)
                for i in range(min(len(out), 3)):
                    frames = anim.get(f'c{i}')
                    if isinstance(frames, list) and frames:
                        last_kf = max(frames, key=lambda kf: kf.get('frame', 0) if isinstance(kf, dict) else 0)
                        if isinstance(last_kf, dict) and 'value' in last_kf:
                            try:
                                fv = float(last_kf['value'])
                                out[i] = (base_vec[i] + fv) if is_rel else fv
                            except:
                                pass
                return out
        return base_vec
    if isinstance(val, (int, float)):
        out = list(default)
        if out:
            out[0] = float(val)
        return out
    if not isinstance(val, str):
        return list(default)
    parts = val.replace(',', ' ').split()
    out = list(default)
    for i in range(min(len(parts), len(default))):
        try:
            out[i] = float(parts[i])
        except:
            pass
    return out

def is_obj_visible(obj):
    vis = obj.get('visible', True)
    if vis is False:
        return False
    if isinstance(vis, dict) and vis.get('value') is False:
        return False
    return True

def get_obj_alpha(obj):
    alpha = obj.get('alpha', 1.0)
    if isinstance(alpha, dict):
        return max(0.0, min(1.0, parse_vec(alpha, (1.0,))[0]))
    try:
        return max(0.0, min(1.0, float(alpha)))
    except:
        return 1.0

def load_json_safe(path):
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            return json.load(f)
    except:
        return None

def extract_embedded_tex_images(cache_dir):
    png_sig = b'\x89PNG\r\n\x1a\n'
    png_end = b'IEND\xaeB`\x82'
    ftyp_sig = b'ftyp'
    for f in os.listdir(cache_dir):
        if not f.lower().endswith('.tex'):
            continue
        base = f[:-4]
        has_img = any(os.path.exists(os.path.join(cache_dir, base + ext)) for ext in ('.png', '.jpg', '.jpeg', '.webp', '.mp4'))
        if has_img:
            continue
        tex_path = os.path.join(cache_dir, f)
        try:
            with open(tex_path, 'rb') as tf:
                data = tf.read()
            f_pos = data.find(ftyp_sig, 0, 256)
            if f_pos >= 4:
                mp4_start = f_pos - 4
                out_mp4 = os.path.join(cache_dir, base + '.mp4')
                with open(out_mp4, 'wb') as of:
                    of.write(data[mp4_start:])
                continue
            p_start = data.find(png_sig)
            if p_start != -1:
                p_end = data.find(png_end, p_start)
                if p_end != -1:
                    out_png = os.path.join(cache_dir, base + '.png')
                    with open(out_png, 'wb') as of:
                        of.write(data[p_start:p_end + len(png_end)])
                    continue
            j_start = data.find(b'\xff\xd8\xff', 0, 256)
            if j_start != -1:
                j_end = data.rfind(b'\xff\xd9')
                if j_end != -1 and j_end > j_start:
                    out_jpg = os.path.join(cache_dir, base + '.jpg')
                    with open(out_jpg, 'wb') as of:
                        of.write(data[j_start:j_end + 2])
        except:
            pass

def render_puppet_mdl_layer(mdl_path, tex_path):
    try:
        with open(mdl_path, 'rb') as f:
            b = f.read()
        p = b.find(b'.json\x00')
        if p == -1:
            return None, 0.0, 0.0
        pos_after = p + 6
        vbytes, vstart = 0, 0
        scan_end = min(len(b) - 8, pos_after + 64)
        for off in range(pos_after, scan_end):
            if b[off + 2:off + 4] in (b'\x80\x01', b'\x81\x01', b'\x80\x00', b'\x81\x00'):
                cand_vb = struct.unpack_from('<I', b, off + 4)[0]
                cand_vs = off + 8
                cand_ip = cand_vs + cand_vb
                if cand_vb > 0 and cand_ip + 4 <= len(b):
                    cand_ib = struct.unpack_from('<I', b, cand_ip)[0]
                    if cand_ib > 0 and cand_ip + 4 + cand_ib <= len(b):
                        vbytes, vstart = cand_vb, cand_vs
                        break
        if vbytes == 0:
            vbytes = struct.unpack_from('<I', b, pos_after + 4)[0]
            vstart = pos_after + 8
        idx_pos = vstart + vbytes
        if idx_pos + 4 > len(b):
            return None, 0.0, 0.0
        ibytes = struct.unpack_from('<I', b, idx_pos)[0]
        if ibytes <= 0 or idx_pos + 4 + ibytes > len(b):
            return None, 0.0, 0.0
        tris = np.ndarray((ibytes // 6, 3), dtype='<u2', buffer=b, offset=idx_pos + 4)
        max_idx = int(tris.max()) if len(tris) > 0 else 0
        stride = 0
        for s in (80, 84, 52, 76, 88, 92, 64, 48):
            if vbytes % s == 0 and vbytes // s == max_idx + 1:
                stride = s
                break
        if stride == 0:
            for s in (80, 84, 52, 76, 88, 92, 64, 48):
                if vbytes % s == 0 and vbytes // s > max_idx:
                    stride = s
                    break
        if stride == 0:
            return None, 0.0, 0.0
        nverts = vbytes // stride
        verts = np.ndarray((nverts, stride // 4), dtype='<f4', buffer=b, offset=vstart)
        pos = verts[:, 0:2]
        uv = verts[:, -2:]
        tex = np.asarray(Image.open(tex_path).convert('RGBA'))
        th, tw = tex.shape[:2]
        xmin_f, xmax_f = float(pos[:, 0].min()), float(pos[:, 0].max())
        ymin_f, ymax_f = float(pos[:, 1].min()), float(pos[:, 1].max())
        bw = max(1, int(math.ceil(xmax_f - xmin_f)))
        bh = max(1, int(math.ceil(ymax_f - ymin_f)))
        if bw > 8192 or bh > 8192:
            return None, 0.0, 0.0
        sx = pos[:, 0] - xmin_f
        sy = ymax_f - pos[:, 1]
        out = np.zeros((bh, bw, 4), dtype=np.uint8)
        for i0, i1, i2 in tris:
            x0, y0 = sx[i0], sy[i0]
            x1, y1 = sx[i1], sy[i1]
            x2, y2 = sx[i2], sy[i2]
            x_lo = max(0, int(min(x0, x1, x2)))
            x_hi = min(bw - 1, int(max(x0, x1, x2)) + 1)
            y_lo = max(0, int(min(y0, y1, y2)))
            y_hi = min(bh - 1, int(max(y0, y1, y2)) + 1)
            if x_lo > x_hi or y_lo > y_hi:
                continue
            den = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2)
            if abs(den) < 1e-6:
                continue
            yy, xx = np.mgrid[y_lo:y_hi + 1, x_lo:x_hi + 1]
            w0 = ((y1 - y2) * (xx - x2) + (x2 - x1) * (yy - y2)) / den
            w1 = ((y2 - y0) * (xx - x2) + (x0 - x2) * (yy - y2)) / den
            w2 = 1.0 - w0 - w1
            m = (w0 >= -1e-4) & (w1 >= -1e-4) & (w2 >= -1e-4)
            if not m.any():
                continue
            u = w0[m] * uv[i0, 0] + w1[m] * uv[i1, 0] + w2[m] * uv[i2, 0]
            v = w0[m] * uv[i0, 1] + w1[m] * uv[i1, 1] + w2[m] * uv[i2, 1]
            tx = np.clip((u * (tw - 1)).astype(np.int32), 0, tw - 1)
            ty = np.clip((v * (th - 1)).astype(np.int32), 0, th - 1)
            src = tex[ty, tx]
            dst = out[yy[m], xx[m]]
            sa = src[:, 3:4].astype(np.float32) / 255.0
            da = dst[:, 3:4].astype(np.float32) / 255.0
            oa = sa + da * (1.0 - sa)
            rgb = np.where(oa > 1e-5, (src[:, :3] * sa + dst[:, :3] * da * (1.0 - sa)) / np.maximum(oa, 1e-5), 0)
            out[yy[m], xx[m], :3] = np.clip(rgb, 0, 255).astype(np.uint8)
            out[yy[m], xx[m], 3] = np.clip(oa[:, 0] * 255.0, 0, 255).astype(np.uint8)
        cx_local = (xmin_f + xmax_f) / 2.0
        cy_local = (ymin_f + ymax_f) / 2.0
        return Image.fromarray(out), cx_local, cy_local
    except Exception as e:
        print(f"[PuppetMDL] {e}")
        return None, 0.0, 0.0

def render_balatro_shader(width, height, c1, c2, c3, contrast=1.0, spin_amount=0.0, pixel_amount=700.0):
    scale_factor = max(1, int(round(max(width, height) / max(240.0, min(700.0, float(pixel_amount))))))
    sw = max(64, width // scale_factor)
    sh = max(64, height // scale_factor)
    im = Image.new("RGBA", (sw, sh))
    px = im.load()
    diag = math.hypot(sw, sh)
    t = 1.5
    speed = t * (spin_amount * 0.2 + 0.2) + 302.2
    c_mod = (0.25 * contrast + 0.5 * spin_amount + 1.2)
    for y in range(sh):
        fy = (y - 0.5 * sh) / diag
        for x in range(sw):
            fx = (x - 0.5 * sw) / diag
            uv_len = math.hypot(fx, fy)
            angle = math.atan2(fy, fx) - speed * 0.4 + (spin_amount * uv_len * 10.0 if spin_amount else 0.0)
            ux = uv_len * math.cos(angle) * 30.0
            uy = uv_len * math.sin(angle) * 30.0
            uv2x = ux + uy
            uv2y = ux + uy
            for _ in range(5):
                s_val = math.sin(max(ux, uy))
                uv2x += s_val + ux
                uv2y += s_val + uy
                ux += 0.5 * math.cos(5.1123314 + 0.353 * uv2y + speed * 0.131121)
                uy += 0.5 * math.sin(uv2x - 0.113 * speed)
                d_val = math.cos(ux + uy) - math.sin(ux * 0.711 - uy)
                ux -= d_val
                uy -= d_val
            paint_res = min(2.0, max(0.0, math.hypot(ux, uy) * 0.035 * c_mod))
            c1p = max(0.0, 1.0 - c_mod * abs(1.0 - paint_res))
            c2p = max(0.0, 1.0 - c_mod * abs(paint_res))
            c3p = 1.0 - min(1.0, c1p + c2p)
            r = (0.3 / max(0.2, contrast)) * c1[0] + (1.0 - 0.3 / max(0.2, contrast)) * (c1[0] * c1p + c2[0] * c2p + c3[0] * c3p)
            g = (0.3 / max(0.2, contrast)) * c1[1] + (1.0 - 0.3 / max(0.2, contrast)) * (c1[1] * c1p + c2[1] * c2p + c3[1] * c3p)
            b = (0.3 / max(0.2, contrast)) * c1[2] + (1.0 - 0.3 / max(0.2, contrast)) * (c1[2] * c1p + c2[2] * c2p + c3[2] * c3p)
            px[x, y] = (
                max(0, min(255, int(round(r * 255)))),
                max(0, min(255, int(round(g * 255)))),
                max(0, min(255, int(round(b * 255)))),
                255
            )
    if (sw, sh) != (width, height):
        im = im.resize((width, height), Image.Resampling.NEAREST)
    return im

def score_video_candidate(vpath, objects=None):
    bname = os.path.basename(vpath).lower()
    score = float(os.path.getsize(vpath))
    neg_kw = ('intro', 'open', 'opening', 'start', 'enter', 'entrance', 'transition', 'trans', 'splash', 'logo', 'preview', 'ruchang', '入场', '拉镜', '转场', '开场', '前奏', 'switch', 'button', 'btn', 'test', 'sample', '蓝幕', '绿幕', 'chroma', 'colorkey', 'greenscreen', 'bluescreen')
    pos_kw = ('main', 'loop', 'bg', 'wallpaper', 'origin', 'base', '原版', '带水印', '无水印', '循环', '背景', 'chara', 'character', 'body')
    for nk in neg_kw:
        if nk in bname:
            score -= 1000000000.0
    for pk in pos_kw:
        if pk in bname:
            score += 1000000000.0
    if objects:
        for obj in objects:
            img = str(obj.get('image', '')).lower()
            name = str(obj.get('name', '')).lower()
            vstem = os.path.splitext(os.path.basename(vpath))[0].lower()
            if vstem in img or vstem in name:
                effs = obj.get('effects', [])
                if any('colorkey' in str(ef.get('file', '')).lower() for ef in effs):
                    score -= 2000000000.0
                vis = obj.get('visible')
                if isinstance(vis, dict):
                    scr = str(vis.get('script', '')).lower()
                    if 'stopped' in scr or 'hidestopped' in scr or 'fadingout' in scr:
                        score -= 2000000000.0
                for nk in neg_kw:
                    if nk in name:
                        score -= 1000000000.0
                for pk in pos_kw:
                    if pk in name:
                        score += 1000000000.0
    return score

def get_model_and_material_info(cache_dir, img_ref):
    info = {
        'is_puppet': False,
        'puppet_file': None,
        'is_spritesheet': False,
        'blending': 'normal',
        'tex_file': None,
        'is_utility': False,
        'is_solid': False,
    }
    if not img_ref:
        return info

    low_ref = img_ref.lower()
    if 'composelayer' in low_ref or 'fullscreenlayer' in low_ref:
        info['is_utility'] = True
        return info
    if 'solidlayer' in low_ref or 'solid_instance_model' in low_ref:
        info['is_solid'] = True

    base = os.path.splitext(os.path.basename(img_ref))[0]
    mat_base = None
    model_candidates = [
        os.path.join(cache_dir, base + '.json'),
        os.path.join(cache_dir, 'models', base + '.json'),
        os.path.join(cache_dir, img_ref.replace('/', os.sep)),
    ]

    mat_candidates = [
        os.path.join(cache_dir, 'materials', base + '.json'),
        os.path.join(cache_dir, base + '.json'),
    ]

    for mc in model_candidates:
        if os.path.exists(mc):
            mdata = load_json_safe(mc)
            if isinstance(mdata, dict):
                if 'puppet' in mdata:
                    info['is_puppet'] = True
                    p_base = os.path.basename(str(mdata['puppet']))
                    for pc in (os.path.join(cache_dir, p_base), os.path.join(cache_dir, 'models', p_base)):
                        if os.path.exists(pc):
                            info['puppet_file'] = pc
                            break
                if 'material' in mdata:
                    mat_base = os.path.splitext(os.path.basename(mdata['material']))[0]
                    mat_candidates.insert(0, os.path.join(cache_dir, 'materials', mat_base + '.json'))
                    mat_candidates.insert(1, os.path.join(cache_dir, mat_base + '.json'))
                    for ext in ('.png', '.jpg', '.jpeg', '.webp', '.mp4', '.webm'):
                        tp = os.path.join(cache_dir, mat_base + ext)
                        if os.path.exists(tp) and not info['tex_file']:
                            info['tex_file'] = tp
                if 'passes' in mdata:
                    mat_candidates.insert(0, mc)
            break

    for ext in ('.png', '.jpg', '.jpeg', '.webp', '.mp4', '.webm'):
        p = os.path.join(cache_dir, base + ext)
        if os.path.exists(p):
            info['tex_file'] = p
            break

    if not info['is_puppet']:
        for cand_stem in (base, mat_base):
            if not cand_stem:
                continue
            for cand_dir in (cache_dir, os.path.join(cache_dir, 'models')):
                pf = os.path.join(cand_dir, cand_stem + '_puppet.mdl')
                if os.path.exists(pf):
                    info['is_puppet'] = True
                    info['puppet_file'] = pf
                    break
            if info['is_puppet']:
                break

    for mat_c in mat_candidates:
        if os.path.exists(mat_c):
            mat_data = load_json_safe(mat_c)
            if isinstance(mat_data, dict):
                passes = mat_data.get('passes', [])
                if passes and isinstance(passes, list):
                    first_pass = passes[0]
                    if isinstance(first_pass, dict):
                        blend = str(first_pass.get('blending', 'normal')).lower()
                        info['blending'] = blend
                        combos = first_pass.get('combos', {})
                        if isinstance(combos, dict) and (combos.get('spritesheet') == 1 or combos.get('SPRITESHEET') == 1):
                            info['is_spritesheet'] = True
                        tex_list = first_pass.get('textures', [])
                        if isinstance(tex_list, list) and tex_list and str(tex_list[0]).lower() == 'util/white':
                            info['is_solid'] = True
                        if not info['tex_file']:
                            for tname in tex_list:
                                if not tname:
                                    continue
                                t_base = os.path.splitext(os.path.basename(tname))[0]
                                for ext in ('.png', '.jpg', '.jpeg', '.webp', '.mp4', '.webm'):
                                    tp = os.path.join(cache_dir, t_base + ext)
                                    if os.path.exists(tp):
                                        info['tex_file'] = tp
                                        break
                                if info['tex_file']:
                                    break
                break

    if not info['tex_file']:
        target_prefixes = []
        for p in (mat_base, base):
            if not p:
                continue
            target_prefixes.append(p)
            cleaned = re.sub(r'[\d_\s]+(帧|fps)?$', '', p, flags=re.IGNORECASE).strip()
            if cleaned and cleaned not in target_prefixes:
                target_prefixes.append(cleaned)
        prefix_cands = []
        for pref in target_prefixes:
            for f in os.listdir(cache_dir):
                if f.startswith(pref) and f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.mp4', '.webm')):
                    low_f = f.lower()
                    if not any(k in low_f for k in ('intro', '入场', '拉镜', '转场', '开场', '前奏', 'logo', 'button', 'switch')):
                        prefix_cands.append(os.path.join(cache_dir, f))
        if prefix_cands:
            best_cand = max(prefix_cands, key=lambda c: score_video_candidate(c) if c.lower().endswith(('.mp4', '.webm')) else os.path.getsize(c))
            info['tex_file'] = best_cand

    if info['tex_file']:
        t_base = os.path.splitext(os.path.basename(info['tex_file']))[0]
        tj_path = os.path.join(cache_dir, t_base + '.tex-json')
        if os.path.exists(tj_path):
            tj_data = load_json_safe(tj_path)
            if isinstance(tj_data, dict) and 'spritesheetsequences' in tj_data:
                info['is_spritesheet'] = True

    return info

def apply_colorkey(layer_im, key_rgb, tolerance=0.35, fuzziness=0.1):
    try:
        import numpy as np
        arr = np.array(layer_im)
        rgb = arr[:, :, :3].astype(np.float32) / 255.0
        key = np.array(key_rgb, dtype=np.float32)
        dist = np.linalg.norm(rgb - key, axis=2)
        t0 = max(0.0, float(tolerance) - float(fuzziness))
        t1 = max(t0 + 0.001, float(tolerance) + float(fuzziness))
        factor = np.clip((dist - t0) / (t1 - t0), 0.0, 1.0)
        arr[:, :, 3] = (arr[:, :, 3].astype(np.float32) * factor).astype(np.uint8)
        return Image.fromarray(arr, "RGBA")
    except:
        return layer_im

def apply_layer_effects_and_tint(layer_im, obj, cache_dir):
    cr, cg, cb = 1.0, 1.0, 1.0
    if 'color' in obj and obj['color'] is not None:
        cvec = parse_vec(obj['color'], (1.0, 1.0, 1.0))
        cr, cg, cb = cvec[0], cvec[1], cvec[2]

    extra_alpha = 1.0
    opacity_masks = []
    tint_passes = []

    for eff in obj.get('effects', []):
        if not is_obj_visible(eff):
            continue
        efile = str(eff.get('file', '')).lower()
        if 'tint' in efile:
            for pas in eff.get('passes', []):
                vals = pas.get('constantshadervalues', {})
                if isinstance(vals, dict) and 'color' in vals:
                    cvec = parse_vec(vals['color'], (1.0, 1.0, 1.0))
                    t_alpha = 1.0
                    if 'alpha' in vals:
                        t_alpha = max(0.0, min(1.0, parse_vec(vals['alpha'], (1.0,))[0]))
                    texs = pas.get('textures', [])
                    t_mask = None
                    if isinstance(texs, list) and len(texs) >= 2 and texs[1]:
                        m_base = os.path.splitext(os.path.basename(str(texs[1])))[0]
                        for ext in ('.png', '.jpg', '.jpeg', '.webp'):
                            mp = os.path.join(cache_dir, m_base + ext)
                            if os.path.exists(mp):
                                t_mask = mp
                                break
                    tint_passes.append((cvec[:3], t_alpha, t_mask))
        elif 'opacity' in efile:
            for pas in eff.get('passes', []):
                vals = pas.get('constantshadervalues', {})
                if isinstance(vals, dict) and 'alpha' in vals:
                    avec = parse_vec(vals['alpha'], (1.0,))
                    extra_alpha *= max(0.0, min(1.0, avec[0]))
                texs = pas.get('textures', [])
                if isinstance(texs, list) and len(texs) >= 2 and texs[1]:
                    m_base = os.path.splitext(os.path.basename(str(texs[1])))[0]
                    for ext in ('.png', '.jpg', '.jpeg', '.webp'):
                        mp = os.path.join(cache_dir, m_base + ext)
                        if os.path.exists(mp):
                            opacity_masks.append(mp)
                            break
        elif 'colorkey' in efile:
            for pas in eff.get('passes', []):
                vals = pas.get('constantshadervalues', {})
                if isinstance(vals, dict):
                    ck_col = parse_vec(vals.get('color', '0 0 1'), (0.00392, 0.23529, 1.0))[:3]
                    ck_tol = parse_vec(vals.get('tolerance', 0.35), (0.35,))[0]
                    ck_fuzz = parse_vec(vals.get('fuzziness', 0.1), (0.1,))[0]
                    layer_im = apply_colorkey(layer_im, ck_col, ck_tol, ck_fuzz)

    if obj.get('name', '').lower() == 'shadow' and 'color' not in obj:
        cr, cg, cb = 0.0, 0.0, 0.0
        extra_alpha *= 0.35

    r, g, b, a = layer_im.split()
    if abs(cr - 1.0) > 0.004 or abs(cg - 1.0) > 0.004 or abs(cb - 1.0) > 0.004:
        r = r.point(lambda p: max(0, min(255, int(round(p * cr)))))
        g = g.point(lambda p: max(0, min(255, int(round(p * cg)))))
        b = b.point(lambda p: max(0, min(255, int(round(p * cb)))))

    if tint_passes:
        arr = np.asarray(Image.merge("RGBA", (r, g, b, a))).astype(np.float32)
        for tcol, t_alpha, t_mask in tint_passes:
            if t_mask:
                try:
                    with Image.open(t_mask) as mim:
                        ml = mim.convert("L")
                        if ml.size != layer_im.size:
                            ml = ml.resize(layer_im.size, Image.Resampling.LANCZOS)
                        m_arr = (np.asarray(ml, dtype=np.float32) / 255.0) * t_alpha
                except:
                    m_arr = np.full((layer_im.size[1], layer_im.size[0]), t_alpha, dtype=np.float32)
            else:
                m_arr = np.full((layer_im.size[1], layer_im.size[0]), t_alpha, dtype=np.float32)
            m3 = m_arr[:, :, None]
            tc = np.array([tcol[0] * 255.0, tcol[1] * 255.0, tcol[2] * 255.0], dtype=np.float32)
            arr[:, :, :3] = arr[:, :, :3] * (1.0 - m3) + tc * m3
        tinted = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")
        r, g, b, a = tinted.split()

    for mp in opacity_masks:
        try:
            with Image.open(mp) as mim:
                ml = mim.convert("L")
                if ml.size != layer_im.size:
                    ml = ml.resize(layer_im.size, Image.Resampling.LANCZOS)
                a = ImageChops.multiply(a, ml)
        except:
            pass

    if extra_alpha < 0.999:
        a = a.point(lambda p: int(round(p * extra_alpha)))

    return Image.merge("RGBA", (r, g, b, a))

def composite_layer(canvas, crop_layer, lx, ly, blending, color_blend_mode):
    cbm = int(color_blend_mode) if color_blend_mode is not None else 0
    is_add = (blending == 'additive') or (cbm in (9, 31))
    if not is_add and cbm in (0, 14, 17, 22, 23, 25, 30):
        canvas.alpha_composite(crop_layer, (lx, ly))
        return
    lw, lh = crop_layer.size
    base_crop = canvas.crop((lx, ly, lx + lw, ly + lh))
    dst = np.asarray(base_crop, dtype=np.float32)
    src = np.asarray(crop_layer, dtype=np.float32)
    sa = src[:, :, 3:4] / 255.0
    drgb = dst[:, :, :3] / 255.0
    srgb = src[:, :, :3] / 255.0
    if is_add:
        blended = np.clip(drgb + srgb * sa, 0.0, 1.0)
    elif cbm == 7:
        screen = 1.0 - (1.0 - drgb) * (1.0 - srgb)
        blended = drgb * (1.0 - sa) + screen * sa
    elif cbm == 6:
        lighten = np.maximum(drgb, srgb)
        blended = drgb * (1.0 - sa) + lighten * sa
    elif cbm == 1:
        darken = np.minimum(drgb, srgb)
        blended = drgb * (1.0 - sa) + darken * sa
    elif cbm == 2:
        mult = drgb * srgb
        blended = drgb * (1.0 - sa) + mult * sa
    elif cbm == 11:
        ov = np.where(drgb < 0.5, 2.0 * drgb * srgb, 1.0 - 2.0 * (1.0 - drgb) * (1.0 - srgb))
        blended = drgb * (1.0 - sa) + ov * sa
    else:
        canvas.alpha_composite(crop_layer, (lx, ly))
        return
    out = np.empty_like(dst, dtype=np.uint8)
    out[:, :, :3] = np.clip(blended * 255.0, 0, 255).astype(np.uint8)
    out[:, :, 3] = np.clip(dst[:, :, 3], 0, 255).astype(np.uint8)
    canvas.paste(Image.fromarray(out, "RGBA"), (lx, ly))

def extract_video_frame_to_jpg(video_path, out_jpg):
    tools_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ffmpeg_exe = os.path.join(tools_dir, "ffmpeg", "ffmpeg.exe")
    if os.path.exists(ffmpeg_exe):
        import subprocess
        for ss in ("00:00:03", "00:00:02", "00:00:01", "00:00:00"):
            subprocess.run([ffmpeg_exe, "-y", "-ss", ss, "-i", video_path, "-frames:v", "1", "-q:v", "1", out_jpg], capture_output=True)
            if os.path.exists(out_jpg) and os.path.getsize(out_jpg) > 5000:
                return True
    return False

def get_video_duration(vpath):
    ff_cand = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'ffmpeg', 'ffmpeg.exe'))
    ff = ff_cand if os.path.exists(ff_cand) else (shutil.which('ffmpeg') or 'ffmpeg')
    try:
        res = subprocess.run([ff, '-i', vpath], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8', errors='ignore', timeout=8)
        m = re.search(r'Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)', res.stderr)
        if m:
            h, mi, s = int(m.group(1)), int(m.group(2)), float(m.group(3))
            return h * 3600.0 + mi * 60.0 + s
    except:
        pass
    return 0.0

def analyze_scene_videos(cache_dir, sdata=None):
    meta_path = os.path.join(cache_dir, "video_meta.json")
    vids = [f for f in os.listdir(cache_dir) if f.lower().endswith(('.mp4', '.webm')) and not f.startswith(('video_wallpaper', 'test_stitched', 'preview'))]
    if not vids:
        meta = {'hasVideo': False, 'hasIntro': False, 'mainFile': None, 'introFile': None, 'introDuration': 0.0}
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)
        return meta

    objects = sdata.get('objects', []) if isinstance(sdata, dict) else []
    colorkey_targets = set()
    for o in objects:
        effs = o.get('effects', [])
        has_ck = any(any(k in str(e.get('file', '')).lower() for k in ['colorkey', 'chroma', 'keying']) for e in effs)
        if has_ck:
            img = str(o.get('image', '')).lower()
            name = str(o.get('name', '')).lower()
            if img:
                colorkey_targets.add(os.path.splitext(os.path.basename(img))[0])
            if name:
                colorkey_targets.add(name)

    filtered_vids = []
    for v in vids:
        v_low = v.lower()
        base_low = os.path.splitext(v_low)[0]
        if any(ct in base_low or base_low in ct for ct in colorkey_targets if ct):
            continue
        filtered_vids.append(v)

    if not filtered_vids:
        meta = {'hasVideo': False, 'hasIntro': False, 'mainFile': None, 'introFile': None, 'introDuration': 0.0}
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)
        return meta

    intro_keywords = ('intro', 'open', 'start', 'enter', 'entrance', 'transition', 'splash', 'ruchang', '入场', '拉镜', '转场', '开场', '前奏', 'preview', 'chuchang', '出场')
    main_keywords = ('main', 'loop', 'bg', 'wallpaper', 'origin', 'base', 'cycle', 'xunhuan', '循环', '原版', '原', '正片', '带水印', '无水印', '4k', '1080p')

    if len(filtered_vids) == 1:
        v = filtered_vids[0]
        v_low = v.lower()
        if any(k in v_low for k in ('蓝幕', '绿幕', 'chroma', 'colorkey')):
            meta = {'hasVideo': False, 'hasIntro': False, 'mainFile': None, 'introFile': None, 'introDuration': 0.0}
        else:
            meta = {'hasVideo': True, 'hasIntro': False, 'mainFile': v, 'introFile': None, 'introDuration': 0.0}
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)
        return meta

    scored = []
    for v in filtered_vids:
        v_low = v.lower()
        sz = os.path.getsize(os.path.join(cache_dir, v))
        intro_score = 0
        main_score = math.log(max(1024, sz))
        duration_from_script = 0.0

        if any(k in v_low for k in intro_keywords):
            intro_score += 15
            main_score -= 30
        if any(k in v_low for k in main_keywords):
            main_score += 15

        for o in objects:
            img = str(o.get('image', '')).lower()
            name = str(o.get('name', '')).lower()
            vis = o.get('visible')
            base_v = os.path.splitext(v_low)[0]
            if base_v in img or base_v in name or os.path.splitext(os.path.basename(img))[0] in base_v:
                if any(k in name for k in intro_keywords):
                    intro_score += 15
                    main_score -= 30
                if any(k in name for k in main_keywords):
                    main_score += 15
                if isinstance(vis, dict) and 'script' in vis:
                    scr = str(vis['script'])
                    if any(sk in scr.lower() for sk in ['stopped', 'hidestopped', 'fadingout', 'currenttime - starttime']):
                        intro_score += 25
                        main_score -= 50
                    m = re.search(r'(?:currentTime\s*-\s*startTime|videoFadeOutTriggerTime|duration|timeout)\s*(?:>=|[:=])\s*(\d+)', scr)
                    if m:
                        duration_from_script = float(m.group(1)) / 1000.0

        scored.append({
            'file': v,
            'intro_score': intro_score,
            'main_score': main_score,
            'script_dur': duration_from_script,
            'size': sz
        })

    intro_cands = [x for x in scored if x['intro_score'] > 0]
    if intro_cands:
        intro_best = max(intro_cands, key=lambda x: x['intro_score'])
        main_cands = [x for x in scored if x['file'] != intro_best['file'] and x['main_score'] > 0]
        if main_cands:
            main_best = max(main_cands, key=lambda x: x['main_score'])
            dur = intro_best['script_dur']
            if dur <= 0:
                dur = get_video_duration(os.path.join(cache_dir, intro_best['file']))
            meta = {
                'hasVideo': True,
                'hasIntro': True,
                'introFile': intro_best['file'],
                'mainFile': main_best['file'],
                'introDuration': round(dur, 2)
            }
            with open(meta_path, 'w', encoding='utf-8') as f:
                json.dump(meta, f, ensure_ascii=False, indent=2)
            return meta

    best_main = max(scored, key=lambda x: x['main_score'])
    if best_main['main_score'] <= 0:
        meta = {'hasVideo': False, 'hasIntro': False, 'mainFile': None, 'introFile': None, 'introDuration': 0.0}
    else:
        meta = {'hasVideo': True, 'hasIntro': False, 'mainFile': best_main['file'], 'introFile': None, 'introDuration': 0.0}
    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    return meta

def resolve_scene(cache_dir):
    final_output = os.path.join(cache_dir, "resolved_wallpaper.jpg")
    primary_video_ref = os.path.join(cache_dir, "primary_video.txt")
    extract_embedded_tex_images(cache_dir)

    scene_json = None
    for sname in ("scene.json", "gifscene.json"):
        cand = os.path.join(cache_dir, sname)
        if os.path.exists(cand):
            scene_json = cand
            break

    video_files = [os.path.join(cache_dir, f) for f in os.listdir(cache_dir) if f.lower().endswith(('.mp4', '.webm')) and not f.lower().endswith('.tmp.webm') and os.path.basename(f).lower() != 'video_wallpaper.webm']
    if video_files and not scene_json:
        meta = analyze_scene_videos(cache_dir, None)
        if meta.get('hasVideo') and meta.get('mainFile'):
            vpath = os.path.join(cache_dir, meta['mainFile'])
            with open(primary_video_ref, 'w', encoding='utf-8') as pf:
                pf.write(vpath)
            frame_jpg = os.path.join(cache_dir, "video_frame.jpg")
            if extract_video_frame_to_jpg(vpath, frame_jpg):
                im = Image.open(frame_jpg).convert("RGB")
                im.save(final_output, quality=96)
                print(f"RESOLVED_VIDEO: {os.path.basename(vpath)} -> {final_output} ({im.size[0]}x{im.size[1]})")
                return final_output

    if scene_json:
        try:
            sdata = load_json_safe(scene_json) or {}
            objects = sdata.get('objects', [])
            meta = analyze_scene_videos(cache_dir, sdata)
            if meta.get('hasVideo') and meta.get('mainFile'):
                with open(primary_video_ref, 'w', encoding='utf-8') as pf:
                    pf.write(os.path.join(cache_dir, meta['mainFile']))
            elif os.path.exists(primary_video_ref):
                try:
                    os.remove(primary_video_ref)
                except:
                    pass
            proj = sdata.get('general', {}).get('orthogonalprojection', {})

            cw = int(proj.get('width', 0)) if proj else 0
            ch = int(proj.get('height', 0)) if proj else 0
            if cw <= 0 or ch <= 0:
                for vo in objects:
                    if vo.get('size'):
                        sw, sh = parse_vec(vo['size'], (0, 0))
                        if sw > cw: cw = int(round(sw))
                        if sh > ch: ch = int(round(sh))
            if cw <= 0 or ch <= 0:
                cw, ch = 1920, 1080

            obj_by_id = {o['id']: o for o in objects if 'id' in o}
            parent_ids = {o.get('parent') for o in objects if o.get('parent') is not None}

            def resolve_world_transform(obj):
                chain = []
                cur = obj
                seen = set()
                while cur is not None:
                    oid = cur.get('id')
                    if oid is not None:
                        if oid in seen:
                            break
                        seen.add(oid)
                    chain.append(cur)
                    pid = cur.get('parent')
                    cur = obj_by_id.get(pid) if pid is not None else None
                chain.reverse()

                wx, wy = 0.0, 0.0
                wsx, wsy = 1.0, 1.0
                wroll = 0.0
                walpha = 1.0

                for idx, node in enumerate(chain):
                    if not is_obj_visible(node):
                        return None

                    default_origin = (cw / 2.0, ch / 2.0, 0.0) if idx == 0 and 'origin' not in node else (0.0, 0.0, 0.0)
                    lx, ly, _ = parse_vec(node.get('origin'), default_origin)
                    lsx, lsy, _ = parse_vec(node.get('scale'), (1.0, 1.0, 1.0))
                    _, _, lroll = parse_vec(node.get('angles'), (0.0, 0.0, 0.0))

                    sx_lx = lx * wsx
                    sy_ly = ly * wsy
                    if abs(wroll) > 1e-4:
                        rad = wroll if abs(wroll) < 6.283 else math.radians(wroll)
                        cos_r = math.cos(rad)
                        sin_r = math.sin(rad)
                        rx = sx_lx * cos_r - sy_ly * sin_r
                        ry = sx_lx * sin_r + sy_ly * cos_r
                        wx += rx
                        wy += ry
                    else:
                        wx += sx_lx
                        wy += sy_ly

                    wsx *= lsx
                    wsy *= lsy
                    wroll += lroll

                walpha = get_obj_alpha(obj)
                if walpha <= 0.01:
                    return None

                return {
                    'cx': wx,
                    'cy': wy,
                    'sx': wsx,
                    'sy': wsy,
                    'roll': wroll,
                    'alpha': walpha,
                }

            model_cache = {}
            for o in objects:
                iref = o.get('image', '')
                if iref and iref not in model_cache:
                    model_cache[iref] = get_model_and_material_info(cache_dir, iref)

            cc_str = sdata.get('general', {}).get('clearcolor', '0.07 0.07 0.07')
            try:
                cc_parts = [int(float(c) * 255) for c in parse_vec(cc_str, (0.07, 0.07, 0.07))]
                bg_col = (cc_parts[0], cc_parts[1], cc_parts[2], 255)
            except:
                bg_col = (18, 18, 18, 255)

            canvas = Image.new("RGBA", (cw, ch), bg_col)
            rendered_layers = 0
            matte_top = 0
            matte_bottom = ch

            junk_keywords = (
                '赞助', 'donate', 'sponsor', 'qrcode', 'qr',
                '开关', 'switch', 'button', 'btn', 'toggle',
                'launcher', 'dock', 'appdock', 'widget', 'fps',
                'bilibili', 'weibo', 'tiktok', 'qq',
                'custom_user_texture', 'frame_builder',
                '提示', '提示框', 'prompt', 'promptbox', 'notice',
                '作者', '有话说', '说明', '教程', 'guide', 'help',
                'readme', 'instruction', '网盘', 'quark', 'pan',
                'link', 'download', 'announcement', 'msg', 'message',
                'box', 'dialog'
            )
            intro_keywords = (
                '入场', '拉镜', '转场', '开场', '前奏', 'intro', 'open', 'start', 'entrance', 'transition', 'splash'
            )

            for obj in objects:
                obj_name = str(obj.get('name', '')).lower()
                img_ref = obj.get('image', '')
                img_ref_low = str(img_ref).lower()
                vis = obj.get('visible')

                if any(k in obj_name for k in junk_keywords) or any(k in img_ref_low for k in junk_keywords):
                    continue

                if any(k in obj_name for k in intro_keywords):
                    continue

                effs = obj.get('effects', [])
                if any(any(ak in str(eff.get('file', '')).lower() for ak in ('audio_bars', 'simple_audio_bars', 'audiovisualizer', 'spectrum', 'equalizer')) for eff in effs):
                    continue

                if any(ak in obj_name for ak in ('audio bar', 'audiobars', 'spectrum', 'equalizer', '音频条', '音频感应')):
                    continue

                tr = resolve_world_transform(obj)
                if not tr:
                    continue

                if 'text' in obj and not obj.get('image'):
                    continue

                img_ref = obj.get('image', '')
                if not img_ref:
                    continue

                minfo = model_cache.get(img_ref) or get_model_and_material_info(cache_dir, img_ref)
                if minfo['is_utility']:
                    continue

                inst = obj.get('instance')
                if isinstance(inst, dict):
                    inst_texs = inst.get('textures', [])
                    if isinstance(inst_texs, list) and inst_texs and str(inst_texs[0]).lower() == 'util/white':
                        minfo = dict(minfo, is_solid=True)

                if minfo['is_puppet']:
                    if minfo.get('puppet_file') and minfo.get('tex_file') and os.path.exists(minfo['puppet_file']) and os.path.exists(minfo['tex_file']):
                        pup_im, pcx, pcy = render_puppet_mdl_layer(minfo['puppet_file'], minfo['tex_file'])
                        if pup_im is not None:
                            pup_im = apply_layer_effects_and_tint(pup_im, obj, cache_dir)
                            sx_eff, sy_eff = abs(tr['sx']), abs(tr['sy'])
                            pw = max(1, int(round(pup_im.size[0] * sx_eff)))
                            ph = max(1, int(round(pup_im.size[1] * sy_eff)))
                            if pup_im.size != (pw, ph):
                                pup_im = pup_im.resize((pw, ph), Image.Resampling.LANCZOS)
                            if tr['sx'] < 0:
                                pup_im = pup_im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
                            if tr['sy'] < 0:
                                pup_im = pup_im.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
                            if tr['alpha'] < 0.999:
                                r, g, b, a = pup_im.split()
                                a = a.point(lambda p: int(p * tr['alpha']))
                                pup_im = Image.merge("RGBA", (r, g, b, a))
                            wcx = tr['cx'] + pcx * tr['sx']
                            wcy = tr['cy'] + pcy * tr['sy']
                            px = int(round(wcx - pw / 2.0))
                            py = int(round(ch - (wcy + ph / 2.0)))
                            lx = max(0, px)
                            ly = max(0, py)
                            lw = min(pup_im.size[0] - (lx - px), cw - lx)
                            lh = min(pup_im.size[1] - (ly - py), ch - ly)
                            if lw > 0 and lh > 0:
                                composite_layer(canvas, pup_im.crop((lx - px, ly - py, lx - px + lw, ly - py + lh)), lx, ly, minfo.get('blending', 'normal'), obj.get('colorBlendMode', 0))
                                rendered_layers += 1
                    continue

                if obj.get('size'):
                    sw, sh = parse_vec(obj['size'], (0.0, 0.0))
                elif minfo['tex_file'] and os.path.exists(minfo['tex_file']):
                    try:
                        with Image.open(minfo['tex_file']) as tim:
                            sw, sh = float(tim.size[0]), float(tim.size[1])
                    except:
                        continue
                else:
                    continue

                if sw <= 0 or sh <= 0:
                    continue

                sx_eff, sy_eff = abs(tr['sx']), abs(tr['sy'])
                cx, cy = tr['cx'], tr['cy']
                align = str(obj.get('alignment', 'center')).lower()
                if 'left' in align:
                    cx += (sw * sx_eff) / 2.0
                elif 'right' in align:
                    cx -= (sw * sx_eff) / 2.0
                if 'top' in align:
                    cy -= (sh * sy_eff) / 2.0
                elif 'bottom' in align:
                    cy += (sh * sy_eff) / 2.0

                if abs(sw - cw) <= 4 and abs(sh - ch) <= 4 and 1.0 < sx_eff <= 1.12 and 1.0 < sy_eff <= 1.12 and abs(cx - cw / 2.0) <= cw * 0.05 and abs(cy - ch / 2.0) <= ch * 0.05 and abs(tr['roll']) < 0.01:
                    sx_eff, sy_eff = 1.0, 1.0
                    cx, cy = cw / 2.0, ch / 2.0

                iw = max(1, int(round(sw * sx_eff)))
                ih = max(1, int(round(sh * sy_eff)))
                x = int(round(cx - iw / 2.0))
                y = int(round(ch - (cy + ih / 2.0)))

                if x >= cw or y >= ch or (x + iw) <= 0 or (y + ih) <= 0:
                    continue

                low_ref = img_ref.lower()
                if 'projectlayer' in low_ref or minfo.get('is_solid'):
                    effects = obj.get('effects', [])
                    shader_rendered = False
                    for eff in effects:
                        if not is_obj_visible(eff):
                            continue
                        for pas in eff.get('passes', []):
                            vals = pas.get('constantshadervalues', {})
                            if isinstance(vals, dict) and 'Color1' in vals and 'Color2' in vals:
                                c1 = parse_vec(vals.get('Color1'), (0.19, 0.41, 0.29))
                                c2 = parse_vec(vals.get('Color2'), (0.40, 0.67, 0.56))
                                c3 = parse_vec(vals.get('Color3'), c1)
                                contrast = parse_vec(vals.get('Contrast', 1.0), (1.0,))[0]
                                spin_amt = parse_vec(vals.get('SpinAmount', 0.0), (0.0,))[0]
                                pix_amt = parse_vec(vals.get('PixelAmount', 700.0), (700.0,))[0]
                                proc_im = render_balatro_shader(iw, ih, c1, c2, c3, contrast, spin_amt, pix_amt)
                                lx = max(0, x)
                                ly = max(0, y)
                                lw = min(proc_im.size[0] - (lx - x), cw - lx)
                                lh = min(proc_im.size[1] - (ly - y), ch - ly)
                                if lw > 0 and lh > 0:
                                    canvas.alpha_composite(proc_im.crop((lx - x, ly - y, lx - x + lw, ly - y + lh)), (lx, ly))
                                    rendered_layers += 1
                                shader_rendered = True
                                break
                        if shader_rendered:
                            break
                    if shader_rendered or 'projectlayer' in low_ref:
                        continue

                    if obj.get('id') in parent_ids and 'color' not in obj:
                        continue

                    if (iw < cw * 0.85 or ih < ch * 0.85) and (iw * ih) < (cw * ch * 0.35):
                        if iw >= cw * 0.95 and ih <= ch * 0.15:
                            if y <= 10 and (y + ih) < ch * 0.2:
                                matte_top = max(matte_top, y + ih)
                            elif (y + ih) >= ch - 10 and y > ch * 0.8:
                                matte_bottom = min(matte_bottom, y)
                        elif not ('solid_instance_model' in low_ref and 'color' in obj and obj.get('id') not in parent_ids and iw >= 128 and ih >= 128):
                            continue

                    allowed_solid_effects = ('tint', 'opacity', 'blur')
                    has_procedural_effect = any(
                        not any(ae in str(eff.get('file', '')).lower() for ae in allowed_solid_effects)
                        for eff in effects
                        if is_obj_visible(eff)
                    )
                    if has_procedural_effect:
                        continue

                    rgb_vec = parse_vec(obj.get('color', '0 0 0'), (0.0, 0.0, 0.0))
                    for eff in effects:
                        if not is_obj_visible(eff):
                            continue
                        for pas in eff.get('passes', []):
                            vals = pas.get('constantshadervalues', {})
                            if isinstance(vals, dict) and 'color' in vals:
                                rgb_vec = parse_vec(vals['color'], rgb_vec)
                    rgb = [max(0, min(255, int(round(c * 255)))) for c in rgb_vec[:3]]
                    alpha_byte = int(round(255 * tr['alpha']))
                    solid_im = Image.new("RGBA", (iw, ih), (rgb[0], rgb[1], rgb[2], alpha_byte))

                    if abs(tr['roll']) > 0.01:
                        deg = math.degrees(tr['roll']) if abs(tr['roll']) < 6.283 else tr['roll']
                        pad_scale = 2 if (iw >= cw * 0.9 and ih >= ch * 0.9) else 1
                        solid_im = Image.new("RGBA", (iw * pad_scale, ih), (rgb[0], rgb[1], rgb[2], alpha_byte))
                        solid_im = solid_im.rotate(deg, resample=Image.Resampling.BICUBIC, expand=True)
                        rw, rh = solid_im.size
                        x = int(round(cx - rw / 2.0))
                        y = int(round(ch - (cy + rh / 2.0)))

                    lx = max(0, x)
                    ly = max(0, y)
                    lw = min(solid_im.size[0] - (lx - x), cw - lx)
                    lh = min(solid_im.size[1] - (ly - y), ch - ly)
                    if lw > 0 and lh > 0:
                        crop_layer = solid_im.crop((lx - x, ly - y, lx - x + lw, ly - y + lh))
                        canvas.alpha_composite(crop_layer, (lx, ly))
                        rendered_layers += 1
                    continue

                tex_file = minfo['tex_file']
                if not tex_file or not os.path.exists(tex_file):
                    ow, oh = int(round(sw)), int(round(sh))
                    for f in os.listdir(cache_dir):
                        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')) and not f.startswith(('resolved', 'test_', 'preview')):
                            fp = os.path.join(cache_dir, f)
                            try:
                                with Image.open(fp) as im:
                                    if im.size == (ow, oh):
                                        tex_file = fp
                                        break
                            except:
                                pass

                if tex_file and os.path.exists(tex_file):
                    try:
                        if tex_file.lower().endswith(('.mp4', '.webm')):
                            tex_bname = os.path.basename(tex_file).lower()
                            if any(k in tex_bname for k in intro_keywords):
                                continue
                            vframe_jpg = os.path.join(cache_dir, f"vlayer_{obj.get('id', 0)}.jpg")
                            if not os.path.exists(vframe_jpg):
                                extract_video_frame_to_jpg(tex_file, vframe_jpg)
                            if not os.path.exists(vframe_jpg):
                                continue
                            layer_im = Image.open(vframe_jpg).convert("RGBA")
                        else:
                            layer_im = Image.open(tex_file).convert("RGBA")

                        ow, oh = max(1, int(round(sw))), max(1, int(round(sh)))
                        if (minfo.get('is_spritesheet') or (layer_im.size[0] >= ow * 2 and layer_im.size[1] >= oh * 2 and layer_im.size[0] % ow == 0 and layer_im.size[1] % oh == 0)) and layer_im.size != (ow, oh):
                            layer_im = layer_im.crop((0, 0, min(ow, layer_im.size[0]), min(oh, layer_im.size[1])))

                        for eff in obj.get('effects', []):
                            if not is_obj_visible(eff):
                                continue
                            if 'transform' in str(eff.get('file', '')).lower():
                                for pas in eff.get('passes', []):
                                    vals = pas.get('constantshadervalues', {})
                                    if isinstance(vals, dict) and 'scale' in vals:
                                        tx_tile, ty_tile = parse_vec(vals['scale'], (1.0, 1.0))[:2]
                                        nx, ny = max(1, int(round(tx_tile))), max(1, int(round(ty_tile)))
                                        if (nx > 1 or ny > 1) and nx <= 16 and ny <= 16:
                                            tw_t, th_t = layer_im.size
                                            tiled = Image.new("RGBA", (tw_t * nx, th_t * ny))
                                            for iy in range(ny):
                                                for ix in range(nx):
                                                    tiled.paste(layer_im, (ix * tw_t, iy * th_t))
                                            layer_im = tiled

                        layer_im = apply_layer_effects_and_tint(layer_im, obj, cache_dir)

                        if layer_im.size != (iw, ih):
                            layer_im = layer_im.resize((iw, ih), Image.Resampling.LANCZOS)

                        if tr['sx'] < 0:
                            layer_im = layer_im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
                        if tr['sy'] < 0:
                            layer_im = layer_im.transpose(Image.Transpose.FLIP_TOP_BOTTOM)

                        if tr['alpha'] < 0.999:
                            r, g, b, a = layer_im.split()
                            a = a.point(lambda p: int(p * tr['alpha']))
                            layer_im = Image.merge("RGBA", (r, g, b, a))

                        if abs(tr['roll']) > 0.01:
                            deg = math.degrees(tr['roll']) if abs(tr['roll']) < 6.283 else tr['roll']
                            layer_im = layer_im.rotate(deg, resample=Image.Resampling.BICUBIC, expand=True)
                            rw, rh = layer_im.size
                            x = int(round(cx - rw / 2.0))
                            y = int(round(ch - (cy + rh / 2.0)))

                        lx = max(0, x)
                        ly = max(0, y)
                        lw = min(layer_im.size[0] - (lx - x), cw - lx)
                        lh = min(layer_im.size[1] - (ly - y), ch - ly)
                        if lw > 0 and lh > 0:
                            crop_layer = layer_im.crop((lx - x, ly - y, lx - x + lw, ly - y + lh))
                            composite_layer(canvas, crop_layer, lx, ly, minfo.get('blending', 'normal'), obj.get('colorBlendMode', 0))
                            rendered_layers += 1
                    except Exception as err:
                        print(f"[LayerCompositeError] {obj.get('name')}: {err}")

            if rendered_layers > 0:
                if (matte_top > 0 or matte_bottom < ch) and (matte_bottom - matte_top) >= int(ch * 0.7):
                    canvas = canvas.crop((0, matte_top, cw, matte_bottom))
                canvas.convert("RGB").save(final_output, quality=96)
                print(f"RESOLVED_SCENE_TREE: {final_output} (canvas: {canvas.size[0]}x{canvas.size[1]}, {rendered_layers} layers)")
                return final_output
        except Exception as e:
            print(f"SCENE_TREE_ERROR: {e}")

    imgs = []
    mask_patterns = ('mask', 'particle', 'sprite', 'noise', 'brush', 'distortion', 'normal', 'opacitymap', 'text_', 'font', 'clipping')
    for f in os.listdir(cache_dir):
        if f.startswith(('resolved_', 'test_', 'preview_')):
            continue
        ext = os.path.splitext(f)[1].lower()
        if ext in ('.png', '.jpg', '.jpeg', '.webp'):
            low = f.lower()
            if any(p in low for p in mask_patterns):
                continue
            fp = os.path.join(cache_dir, f)
            try:
                with Image.open(fp) as im:
                    rgba = im.convert("RGBA") if im.mode in ('P', 'LA', 'RGBA') else im
                    zero_alpha_ratio = 0.0
                    if 'A' in rgba.mode:
                        alpha = rgba.split()[3]
                        zero_alpha_ratio = alpha.histogram()[0] / (rgba.size[0] * rgba.size[1])

                    imgs.append({
                        'path': fp,
                        'name': f,
                        'width': im.size[0],
                        'height': im.size[1],
                        'pixels': im.size[0] * im.size[1],
                        'size_bytes': os.path.getsize(fp),
                        'zero_alpha_ratio': zero_alpha_ratio,
                        'is_opaque': (zero_alpha_ratio < 0.05)
                    })
            except:
                pass

    if not imgs:
        print("NO_ARTWORK_IMAGES")
        return None

    for x in sorted(imgs, key=lambda i: i['pixels'], reverse=True):
        bname = os.path.splitext(x['name'])[0].lower()
        if any(k in bname for k in ('原', 'wallpaper', 'main', 'background', 'cover', 'full', 'base', '图层 0', '图层0', 'layer 0', 'layer0', '拷贝', 'copy')) and x['is_opaque']:
            im = Image.open(x['path']).convert("RGB")
            im.save(final_output, quality=96)
            print(f"RESOLVED_ORIGINAL_IMAGE: {x['name']} -> {final_output} ({im.size[0]}x{im.size[1]})")
            return final_output

    opaque_bases = [x for x in imgs if x['is_opaque']]

    if opaque_bases:
        base_info = max(opaque_bases, key=lambda x: (x['pixels'], x['size_bytes']))
        base_im = Image.open(base_info['path']).convert("RGBA")
        base_size = base_im.size

        large_overlays = [x for x in imgs if not x['is_opaque'] and x['pixels'] >= base_info['pixels'] * 0.70]
        for t in sorted(large_overlays, key=lambda x: x['size_bytes']):
            try:
                layer_im = Image.open(t['path'])
                if layer_im.size != base_size:
                    layer_im = layer_im.resize(base_size, Image.Resampling.LANCZOS)
                base_im.alpha_composite(layer_im.convert("RGBA"))
            except:
                pass

        base_im.convert("RGB").save(final_output, quality=96)
        print(f"RESOLVED_CANVAS_COMPOSITE: {final_output} (base: {base_info['name']}, overlays: {len(large_overlays)})")
        return final_output

    best = max(imgs, key=lambda x: (1 if x['is_opaque'] else 0, x['pixels'], x['size_bytes']))
    im = Image.open(best['path']).convert("RGB")
    im.save(final_output, quality=96)
    print(f"RESOLVED_BEST_IMAGE: {best['name']} -> {final_output} ({im.size[0]}x{im.size[1]})")
    return final_output

if __name__ == "__main__":
    if len(sys.argv) > 1:
        res = resolve_scene(sys.argv[1])
        if res and os.path.exists(res):
            print("FINAL_RESULT:" + res)
        else:
            print("FINAL_RESULT:FAILED")
