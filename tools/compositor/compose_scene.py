import sys, os, json, re, math
import ctypes
from ctypes import wintypes
from PIL import Image, ImageChops

sys.stdout.reconfigure(encoding='utf-8', errors='backslashreplace')

def get_target_screen_metrics(target_index=0):
    try:
        user32 = ctypes.windll.user32
        user32.SetProcessDPIAware()
        monitors = []
        def _cb(hmon, hdc, lprect, lparam):
            r = lprect.contents
            monitors.append((r.right - r.left, r.bottom - r.top))
            return 1
        MONITORENUMPROC = ctypes.WINFUNCTYPE(ctypes.c_int, wintypes.HMONITOR, wintypes.HDC, ctypes.POINTER(wintypes.RECT), wintypes.LPARAM)
        user32.EnumDisplayMonitors(None, None, MONITORENUMPROC(_cb), 0)
        if monitors and 0 <= target_index < len(monitors):
            return monitors[target_index]
        w = user32.GetSystemMetrics(0)
        h = user32.GetSystemMetrics(1)
        if w > 0 and h > 0:
            return (w, h)
    except Exception as e:
        print(f"[ScreenMetrics] Fallback: {e}")
    return (1920, 1080)

def frame_to_screen_aspect(image, screen_w, screen_h):
    if not image or screen_w <= 0 or screen_h <= 0:
        return image

    iw, ih = image.size
    target_aspect = float(screen_w) / float(screen_h)
    img_aspect = float(iw) / float(ih)

    if abs(target_aspect - img_aspect) < 0.005:
        return image

    if target_aspect > img_aspect:
        new_w = iw
        new_h = int(round(float(iw) / target_aspect))
        left = 0
        top = int(round(float(ih - new_h) / 2.0))
        right = iw
        bottom = top + new_h
    else:
        new_h = ih
        new_w = int(round(float(ih) * target_aspect))
        left = int(round(float(iw - new_w) / 2.0))
        top = 0
        right = left + new_w
        bottom = ih

    left = max(0, min(left, iw - 1))
    top = max(0, min(top, ih - 1))
    right = max(left + 1, min(right, iw))
    bottom = max(top + 1, min(bottom, ih))

    cropped = image.crop((left, top, right, bottom))
    print(f"[AspectFraming] Canvas: {iw}x{ih} ({img_aspect:.4f}) -> Framed: {cropped.size[0]}x{cropped.size[1]} ({target_aspect:.4f}) for screen {screen_w}x{screen_h}")
    return cropped

def parse_vec(val, default):
    if isinstance(val, dict):
        val = val.get('value', '')
    if not isinstance(val, str):
        return list(default)
    parts = val.split()
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
        alpha = alpha.get('value', 1.0)
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

def get_model_and_material_info(cache_dir, img_ref):
    info = {
        'is_puppet': False,
        'blending': 'normal',
        'tex_file': None,
        'is_utility': False,
    }
    if not img_ref:
        return info

    low_ref = img_ref.lower()
    if 'composelayer' in low_ref or 'fullscreenlayer' in low_ref:
        info['is_utility'] = True
        return info

    base = os.path.splitext(os.path.basename(img_ref))[0]
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
                if 'material' in mdata:
                    mat_base = os.path.splitext(os.path.basename(mdata['material']))[0]
                    mat_candidates.insert(0, os.path.join(cache_dir, 'materials', mat_base + '.json'))
                    mat_candidates.insert(1, os.path.join(cache_dir, mat_base + '.json'))
                    for ext in ('.png', '.jpg', '.jpeg', '.webp'):
                        tp = os.path.join(cache_dir, mat_base + ext)
                        if os.path.exists(tp) and not info['tex_file']:
                            info['tex_file'] = tp
                if 'passes' in mdata:
                    mat_candidates.insert(0, mc)
            break

    for ext in ('.png', '.jpg', '.jpeg', '.webp'):
        p = os.path.join(cache_dir, base + ext)
        if os.path.exists(p):
            info['tex_file'] = p
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
                        if not info['tex_file']:
                            for tname in first_pass.get('textures', []):
                                if not tname:
                                    continue
                                t_base = os.path.splitext(os.path.basename(tname))[0]
                                for ext in ('.png', '.jpg', '.jpeg', '.webp'):
                                    tp = os.path.join(cache_dir, t_base + ext)
                                    if os.path.exists(tp):
                                        info['tex_file'] = tp
                                        break
                                if info['tex_file']:
                                    break
                break

    return info

def find_master_artwork(cache_dir, min_pixels=0):
    master_keywords = ('原', 'orig', 'original', 'wallpaper', 'full', 'complete', 'all')
    mask_patterns = ('mask', 'particle', 'sprite', 'noise', 'brush', 'distortion', 'normal', 'opacitymap', 'text_', 'font', 'clipping')
    candidates = []
    for f in os.listdir(cache_dir):
        if f.startswith(('resolved_', 'test_', 'preview_')):
            continue
        ext = os.path.splitext(f)[1].lower()
        if ext not in ('.png', '.jpg', '.jpeg', '.webp'):
            continue
        low = f.lower()
        if any(p in low for p in mask_patterns):
            continue
        bname = os.path.splitext(f)[0].lower()
        if not any(k in bname for k in master_keywords):
            continue
        fp = os.path.join(cache_dir, f)
        try:
            with Image.open(fp) as im:
                w, h = im.size
                pixels = w * h
                if pixels < min_pixels:
                    continue
                zero_alpha_ratio = 0.0
                if 'A' in im.mode:
                    alpha = im.split()[3]
                    zero_alpha_ratio = alpha.histogram()[0] / pixels
                if zero_alpha_ratio < 0.05:
                    candidates.append((pixels, os.path.getsize(fp), fp, f))
        except:
            pass
    if candidates:
        candidates.sort(reverse=True)
        return candidates[0][2], candidates[0][3]
    return None, None

def resolve_scene(cache_dir, target_w=None, target_h=None):
    final_output = os.path.join(cache_dir, "resolved_wallpaper.jpg")

    if target_w and target_h and int(target_w) > 0 and int(target_h) > 0:
        screen_w, screen_h = int(target_w), int(target_h)
    else:
        screen_w, screen_h = get_target_screen_metrics()
    print(f"[TargetScreen] {screen_w}x{screen_h} (Aspect: {screen_w/screen_h:.4f})")

    for f in os.listdir(cache_dir):
        if f.lower().endswith(('.mp4', '.webm')):
            video_path = os.path.join(cache_dir, f)
            tools_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            ffmpeg_exe = os.path.join(tools_dir, "ffmpeg", "ffmpeg.exe")
            frame_jpg = os.path.join(cache_dir, "video_frame.jpg")
            if os.path.exists(ffmpeg_exe):
                import subprocess
                subprocess.run([ffmpeg_exe, "-y", "-ss", "00:00:01", "-i", video_path, "-frames:v", "1", "-q:v", "1", frame_jpg], capture_output=True)
                if os.path.exists(frame_jpg) and os.path.getsize(frame_jpg) > 10000:
                    im = Image.open(frame_jpg).convert("RGBA")
                    im = frame_to_screen_aspect(im, screen_w, screen_h)
                    im.convert("RGB").save(final_output, quality=96)
                    print(f"RESOLVED_VIDEO: {f} -> {final_output}")
                    return final_output
            shellthumb = os.path.join(tools_dir, "shellthumb", "ShellThumb.exe")
            frame_png = os.path.join(cache_dir, "video_frame.png")
            if os.path.exists(shellthumb):
                import subprocess
                subprocess.run([shellthumb, video_path, frame_png], capture_output=True)
                if os.path.exists(frame_png):
                    im = Image.open(frame_png).convert("RGBA")
                    im = frame_to_screen_aspect(im, screen_w, screen_h)
                    im.convert("RGB").save(final_output, quality=96)
                    print(f"RESOLVED_VIDEO: {f} -> {final_output}")
                    return final_output

    scene_json = os.path.join(cache_dir, "scene.json")
    if os.path.exists(scene_json):
        try:
            sdata = load_json_safe(scene_json) or {}
            objects = sdata.get('objects', [])
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

                for node in chain:
                    if not is_obj_visible(node):
                        return None
                    walpha *= get_obj_alpha(node)
                    if walpha <= 0.01:
                        return None

                    lx, ly, _ = parse_vec(node.get('origin'), (0.0, 0.0, 0.0))
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

                return {
                    'cx': wx,
                    'cy': wy,
                    'sx': wsx,
                    'sy': wsy,
                    'roll': wroll,
                    'alpha': walpha,
                }

            model_cache = {}
            has_puppet = False
            for o in objects:
                iref = o.get('image', '')
                if iref and iref not in model_cache:
                    minfo = get_model_and_material_info(cache_dir, iref)
                    model_cache[iref] = minfo
                    if minfo['is_puppet'] and is_obj_visible(o):
                        has_puppet = True

            if has_puppet:
                master_path, master_name = find_master_artwork(cache_dir, min_pixels=int(cw * ch * 0.65))
                if master_path:
                    im = Image.open(master_path).convert("RGBA")
                    framed = frame_to_screen_aspect(im, screen_w, screen_h)
                    framed.convert("RGB").save(final_output, quality=96)
                    print(f"RESOLVED_MASTER_FOR_PUPPET: {master_name} -> {final_output} (Framed: {framed.size[0]}x{framed.size[1]})")
                    return final_output

            cc_str = sdata.get('general', {}).get('clearcolor', '0.07 0.07 0.07')
            try:
                cc_parts = [int(float(c) * 255) for c in cc_str.split()[:3]]
                bg_col = (cc_parts[0], cc_parts[1], cc_parts[2], 255)
            except:
                bg_col = (18, 18, 18, 255)

            canvas = Image.new("RGBA", (cw, ch), bg_col)
            rendered_layers = 0

            for obj in objects:
                img_ref = obj.get('image', '')
                if not img_ref:
                    continue

                minfo = model_cache.get(img_ref) or get_model_and_material_info(cache_dir, img_ref)
                if minfo['is_utility'] or minfo['is_puppet']:
                    continue

                tr = resolve_world_transform(obj)
                if not tr:
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

                iw = max(1, int(round(sw * abs(tr['sx']))))
                ih = max(1, int(round(sh * abs(tr['sy']))))
                cx, cy = tr['cx'], tr['cy']
                x = int(round(cx - iw / 2.0))
                y = int(round(ch - (cy + ih / 2.0)))

                if x >= cw or y >= ch or (x + iw) <= 0 or (y + ih) <= 0:
                    continue

                if 'solidlayer' in img_ref.lower():
                    effects = obj.get('effects', [])
                    allowed_solid_effects = ('tint', 'opacity', 'blur')
                    has_procedural_effect = any(
                        not any(ae in str(eff.get('file', '')).lower() for ae in allowed_solid_effects)
                        for eff in effects
                        if is_obj_visible(eff)
                    )
                    if has_procedural_effect:
                        continue
                    col_str = obj.get('color', '0 0 0')
                    try:
                        rgb = [int(float(c) * 255) for c in col_str.split()[:3]]
                    except:
                        rgb = [0, 0, 0]
                    for eff in effects:
                        if not is_obj_visible(eff):
                            continue
                        for pas in eff.get('passes', []):
                            vals = pas.get('constantshadervalues', {})
                            if isinstance(vals, dict) and 'color' in vals:
                                cval = vals['color']
                                if isinstance(cval, dict):
                                    cval = cval.get('value', '')
                                if isinstance(cval, str):
                                    try:
                                        rgb = [int(float(c) * 255) for c in cval.split()[:3]]
                                    except:
                                        pass
                    alpha_byte = int(round(255 * tr['alpha']))
                    solid_im = Image.new("RGBA", (iw, ih), (rgb[0], rgb[1], rgb[2], alpha_byte))

                    if abs(tr['roll']) > 0.01:
                        deg = math.degrees(tr['roll']) if abs(tr['roll']) < 6.283 else tr['roll']
                        solid_im = solid_im.rotate(-deg, resample=Image.Resampling.BICUBIC, expand=True)
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
                        layer_im = Image.open(tex_file).convert("RGBA")
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
                            layer_im = layer_im.rotate(-deg, resample=Image.Resampling.BICUBIC, expand=True)
                            rw, rh = layer_im.size
                            x = int(round(cx - rw / 2.0))
                            y = int(round(ch - (cy + rh / 2.0)))

                        lx = max(0, x)
                        ly = max(0, y)
                        lw = min(layer_im.size[0] - (lx - x), cw - lx)
                        lh = min(layer_im.size[1] - (ly - y), ch - ly)
                        if lw > 0 and lh > 0:
                            crop_layer = layer_im.crop((lx - x, ly - y, lx - x + lw, ly - y + lh))
                            if minfo['blending'] == 'additive':
                                base_crop = canvas.crop((lx, ly, lx + lw, ly + lh))
                                added = ImageChops.add(base_crop.convert("RGB"), crop_layer.convert("RGB"))
                                base_alpha = base_crop.split()[3]
                                added_rgba = Image.merge("RGBA", (*added.split(), base_alpha))
                                canvas.paste(added_rgba, (lx, ly))
                            else:
                                canvas.alpha_composite(crop_layer, (lx, ly))
                            rendered_layers += 1
                    except Exception as err:
                        print(f"[LayerCompositeError] {obj.get('name')}: {err}")

            if rendered_layers > 0:
                framed_canvas = frame_to_screen_aspect(canvas, screen_w, screen_h)
                framed_canvas.convert("RGB").save(final_output, quality=96)
                print(f"RESOLVED_SCENE_TREE: {final_output} (canvas: {cw}x{ch}, framed: {framed_canvas.size[0]}x{framed_canvas.size[1]}, {rendered_layers} layers)")
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
                im = Image.open(fp)
                zero_alpha_ratio = 0.0
                if 'A' in im.mode:
                    alpha = im.split()[3]
                    zero_alpha_ratio = alpha.histogram()[0] / (im.size[0] * im.size[1])

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
        if any(k in bname for k in ('原', 'wallpaper', 'main', 'background', 'cover', 'full', 'base')) and x['is_opaque']:
            im = Image.open(x['path'])
            im = frame_to_screen_aspect(im.convert("RGBA"), screen_w, screen_h)
            im.convert("RGB").save(final_output, quality=96)
            print(f"RESOLVED_ORIGINAL_IMAGE: {x['name']} -> {final_output} (Framed: {im.size[0]}x{im.size[1]})")
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

        framed = frame_to_screen_aspect(base_im, screen_w, screen_h)
        framed.convert("RGB").save(final_output, quality=96)
        print(f"RESOLVED_CANVAS_COMPOSITE: {final_output} (base: {base_info['name']}, overlays: {len(large_overlays)})")
        return final_output

    best = max(imgs, key=lambda x: (1 if x['is_opaque'] else 0, x['pixels'], x['size_bytes']))
    im = Image.open(best['path']).convert("RGBA")
    framed = frame_to_screen_aspect(im, screen_w, screen_h)
    framed.convert("RGB").save(final_output, quality=96)
    print(f"RESOLVED_BEST_IMAGE: {best['name']} -> {final_output}")
    return final_output

if __name__ == "__main__":
    if len(sys.argv) > 1:
        tw = sys.argv[2] if len(sys.argv) > 2 else None
        th = sys.argv[3] if len(sys.argv) > 3 else None
        res = resolve_scene(sys.argv[1], target_w=tw, target_h=th)
        if res and os.path.exists(res):
            print("FINAL_RESULT:" + res)
        else:
            print("FINAL_RESULT:FAILED")
