#!/usr/bin/env bash
# Procesa un video: formato, audio normalizado, compresión, logo y subtítulos opcionales.
# Uso: scripts/procesar_video.sh <video> [reels|youtube|cuadrado]
set -euo pipefail

entrada="$1"
formato="${2:-reels}"
raiz="$(cd "$(dirname "$0")/.." && pwd)"
salida_dir="$raiz/videos/salida"
nombre="$(basename "${entrada%.*}")"
salida="$salida_dir/${nombre}_${formato}.mp4"
logo="$raiz/marca/logo.png"
srt="${entrada%.*}.srt"

case "$formato" in
  reels)    w=1080; h=1920 ;;
  youtube)  w=1920; h=1080 ;;
  cuadrado) w=1080; h=1080 ;;
  *) echo "Formato desconocido: $formato (usa reels, youtube o cuadrado)"; exit 1 ;;
esac

# Fondo desenfocado + video centrado, para que nada quede recortado
filtro="[0:v]split[a][b];[a]scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},boxblur=20[fondo];[b]scale=${w}:${h}:force_original_aspect_ratio=decrease[frente];[fondo][frente]overlay=(W-w)/2:(H-h)/2"
entradas=(-i "$entrada")

if [[ -f "$logo" ]]; then
  entradas+=(-i "$logo")
  filtro="$filtro[base];[1:v]scale=${w}/6:-1[logo];[base][logo]overlay=W-w-40:40"
fi
if [[ -f "$srt" ]]; then
  srt_esc="${srt//:/\\:}"
  filtro="$filtro,subtitles='${srt_esc}':force_style='FontSize=14,Outline=2,MarginV=60'"
fi
filtro="$filtro,format=yuv420p[v]"

mkdir -p "$salida_dir"
ffmpeg -y -hide_banner -loglevel error "${entradas[@]}" \
  -filter_complex "$filtro" -map "[v]" -map "0:a?" \
  -c:v libx264 -preset medium -crf 23 -r 30 \
  -c:a aac -b:a 160k -af loudnorm=I=-14:TP=-1.5:LRA=11 \
  -movflags +faststart "$salida"

echo "Listo: $salida"
