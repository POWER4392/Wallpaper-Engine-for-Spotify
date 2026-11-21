import os
import re
from scene_utils import load_json_safe
from video_analyzer import score_video_candidate

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

