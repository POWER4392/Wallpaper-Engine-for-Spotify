import os
import re
import json
import math
import shutil
import subprocess

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

def extract_video_frame_to_jpg(video_path, out_jpg):
    tools_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ffmpeg_exe = os.path.join(tools_dir, "ffmpeg", "ffmpeg.exe")
    if os.path.exists(ffmpeg_exe):
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

