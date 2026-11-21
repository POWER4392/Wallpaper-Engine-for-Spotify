import os
import json

JUNK_KEYWORDS = (
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

INTRO_KEYWORDS = (
    '入场', '拉镜', '转场', '开场', '前奏', 'intro', 'open', 'start', 'entrance', 'transition', 'splash'
)

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

