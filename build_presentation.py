#!/usr/bin/env python3
"""
Build script for Magna Inmobiliaria investor presentation.
Adds logo and project images to the PPTX.

Run after adding images to assets/projects/:
  python3 build_presentation.py
"""

from pptx import Presentation
from pptx.util import Inches
from pptx.oxml.ns import qn
from PIL import Image
import numpy as np
import io
import os

ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets')
INPUT_PPTX = os.path.join(ASSETS, '78ac3d79-Portafolio_Inversion_Magna_2026.pptx')
OUTPUT_PPTX = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           'Portafolio_Inversion_Magna_2026_MAGNA.pptx')
LOGO_PATH = '/root/.claude/uploads/6a51981a-d0dc-5bb1-9f3b-b48cd73e9a38/d83f015d-65750E6E79A64F0E833E89565B8E8B6D.png'
PROJ = os.path.join(ASSETS, 'projects')

# ─── Project render registry ───────────────────────────────────────────────────
# key: slide index (0-based)
# value: list of {shape_name, path, left, top, width, height}
#        left/top/width/height in inches — use None to keep original geometry
# Slides that still need renders are commented-out (will be added once images arrive).

PROJECT_RENDERS = {
    # Slide 1 — Cover: large top = Santa Elena strip center; bottom = Vive Radal
    0: [
        dict(shape='Image 0', path=os.path.join(PROJ, 'santa_elena_strip.jpeg')),
        dict(shape='Image 1', path=os.path.join(PROJ, 'vive_radal_amenities.jpeg')),
        dict(shape='Image 2', path=os.path.join(PROJ, 'vive_radal_edificio.jpeg')),
    ],
    # Slide 6 — Vive Radal: replace main render (already full-size in original)
    5: [
        dict(shape='Image 1', path=os.path.join(PROJ, 'vive_radal_edificio.jpeg')),
    ],
    # Slide 7 — Santa Elena (Talca): placeholder is 1.10"×1.10" → expand to full frame
    6: [
        dict(shape='Image 1', path=os.path.join(PROJ, 'santa_elena.jpeg'),
             left=0.62, top=2.78, width=4.55, height=2.45,
             clear_text='Text 12'),          # removes "Imagen referencial · render por incorporar"
    ],
    # Slide 8 — Alto Serena VI (La Serena): same layout as Santa Elena
    7: [
        dict(shape='Image 1', path=os.path.join(PROJ, 'alto_serena.jpeg'),
             left=0.62, top=2.78, width=4.55, height=2.45,
             clear_text='Text 12'),
    ],
    # Slide 10 — Lo Curro: square frame (4.10"×4.10")
    9: [
        dict(shape='Image 1', path=os.path.join(PROJ, 'lo_curro.jpeg'),
             left=0.62, top=2.60, width=4.10, height=4.10,
             clear_text='Text 8'),
    ],
}


# ─── Helpers ──────────────────────────────────────────────────────────────────

def make_logo_transparent(logo_path: str) -> io.BytesIO:
    """Convert black-background logo PNG to RGBA with transparent background."""
    img = Image.open(logo_path).convert('RGBA')
    data = np.array(img, dtype=np.uint8)
    r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]
    black_mask = (r.astype(int) + g.astype(int) + b.astype(int)) < 60
    data[:, :, 3] = np.where(black_mask, 0, 255)
    result = Image.fromarray(data, 'RGBA')
    buf = io.BytesIO()
    result.save(buf, format='PNG')
    buf.seek(0)
    return buf


def replace_image_blob(slide, shape_name: str, new_path: str,
                       left=None, top=None, width=None, height=None) -> bool:
    """Replace image data in an existing picture shape; optionally reposition/resize."""
    for shape in slide.shapes:
        if shape.name != shape_name or shape.shape_type != 13:
            continue
        blip = shape.element.find('.//' + qn('a:blip'))
        if blip is None:
            continue
        r_id = blip.get(qn('r:embed'))
        img_part = slide.part.related_part(r_id)

        ext = os.path.splitext(new_path)[1].lower()
        content_type = 'image/jpeg' if ext in ('.jpg', '.jpeg') else 'image/png'

        with open(new_path, 'rb') as f:
            img_part._blob = f.read()
        img_part._content_type = content_type

        if left is not None:
            shape.left = Inches(left)
        if top is not None:
            shape.top = Inches(top)
        if width is not None:
            shape.width = Inches(width)
        if height is not None:
            shape.height = Inches(height)
        return True
    return False


def clear_shape_text(slide, shape_name: str):
    """Set all text runs in a shape to empty string."""
    for shape in slide.shapes:
        if shape.name == shape_name and shape.has_text_frame:
            for para in shape.text_frame.paragraphs:
                for run in para.runs:
                    run.text = ''
            return True
    return False


def add_logo(slide, logo_buf: io.BytesIO, left: float, top: float,
             width: float, height: float):
    logo_buf.seek(0)
    slide.shapes.add_picture(logo_buf, Inches(left), Inches(top),
                             Inches(width), Inches(height))


# ─── Build ────────────────────────────────────────────────────────────────────

def build():
    prs = Presentation(INPUT_PPTX)

    print('Processing logo ...')
    logo_buf = make_logo_transparent(LOGO_PATH)

    # Cover slide — large logo top-left
    add_logo(prs.slides[0], logo_buf, left=0.55, top=0.08, width=1.80, height=1.20)

    # All other slides — small logo top-right
    for idx in range(1, len(prs.slides)):
        add_logo(prs.slides[idx], logo_buf, left=11.82, top=0.06,
                 width=1.40, height=0.93)

    # Project renders
    for slide_idx, renders in PROJECT_RENDERS.items():
        slide = prs.slides[slide_idx]
        for cfg in renders:
            path = cfg['path']
            if not os.path.exists(path):
                print(f'  Slide {slide_idx + 1} — SKIP (file missing): {path}')
                continue

            ok = replace_image_blob(
                slide,
                cfg['shape'],
                path,
                left=cfg.get('left'),
                top=cfg.get('top'),
                width=cfg.get('width'),
                height=cfg.get('height'),
            )
            status = '✓ replaced' if ok else '✗ shape not found'
            print(f'  Slide {slide_idx + 1} {cfg["shape"]}: {status}')

            # Clear placeholder caption text if requested
            if ok and cfg.get('clear_text'):
                clear_shape_text(slide, cfg['clear_text'])

    prs.save(OUTPUT_PPTX)
    print(f'\n✓ Saved → {OUTPUT_PPTX}')


if __name__ == '__main__':
    build()
