import os
from PIL import Image

def resolve_fallback_image(cache_dir, final_output):
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

