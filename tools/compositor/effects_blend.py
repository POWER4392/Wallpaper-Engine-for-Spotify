import os
import math
import numpy as np
from PIL import Image, ImageChops
from scene_utils import parse_vec, is_obj_visible

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

def apply_colorkey(layer_im, key_rgb, tolerance=0.35, fuzziness=0.1):
    try:
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

