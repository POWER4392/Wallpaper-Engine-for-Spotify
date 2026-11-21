import sys
import os
import math

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding='utf-8', errors='backslashreplace')

from PIL import Image
from scene_utils import (
    JUNK_KEYWORDS,
    INTRO_KEYWORDS,
    parse_vec,
    is_obj_visible,
    get_obj_alpha,
    load_json_safe,
    extract_embedded_tex_images,
)
from video_analyzer import extract_video_frame_to_jpg, analyze_scene_videos
from material_resolver import get_model_and_material_info
from puppet_renderer import render_puppet_mdl_layer
from effects_blend import (
    render_balatro_shader,
    apply_layer_effects_and_tint,
    composite_layer,
)
from scene_fallback import resolve_fallback_image

def resolve_world_transform(obj, obj_by_id, cw, ch):
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
            wx += sx_lx * cos_r - sy_ly * sin_r
            wy += sx_lx * sin_r + sy_ly * cos_r
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
                        if sw > cw:
                            cw = int(round(sw))
                        if sh > ch:
                            ch = int(round(sh))
            if cw <= 0 or ch <= 0:
                cw, ch = 1920, 1080

            obj_by_id = {o['id']: o for o in objects if 'id' in o}
            parent_ids = {o.get('parent') for o in objects if o.get('parent') is not None}

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

            for obj in objects:
                obj_name = str(obj.get('name', '')).lower()
                img_ref = obj.get('image', '')
                img_ref_low = str(img_ref).lower()

                if any(k in obj_name for k in JUNK_KEYWORDS) or any(k in img_ref_low for k in JUNK_KEYWORDS):
                    continue

                if any(k in obj_name for k in INTRO_KEYWORDS):
                    continue

                effs = obj.get('effects', [])
                if any(any(ak in str(eff.get('file', '')).lower() for ak in ('audio_bars', 'simple_audio_bars', 'audiovisualizer', 'spectrum', 'equalizer')) for eff in effs):
                    continue

                if any(ak in obj_name for ak in ('audio bar', 'audiobars', 'spectrum', 'equalizer', '音频条', '音频感应')):
                    continue

                tr = resolve_world_transform(obj, obj_by_id, cw, ch)
                if not tr:
                    continue

                if 'text' in obj and not obj.get('image'):
                    continue

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
                            if any(k in tex_bname for k in INTRO_KEYWORDS):
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

    return resolve_fallback_image(cache_dir, final_output)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        res = resolve_scene(sys.argv[1])
        if res and os.path.exists(res):
            print("FINAL_RESULT:" + res)
        else:
            print("FINAL_RESULT:FAILED")
