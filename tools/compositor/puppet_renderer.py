import math
import struct
import numpy as np
from PIL import Image

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

