#!/usr/bin/env bash
# Procesa todos los videos de videos/entrada que aún no tengan versión en videos/salida.
# Uso: scripts/procesar_todo.sh [reels|youtube|cuadrado]
set -euo pipefail

formato="${1:-reels}"
raiz="$(cd "$(dirname "$0")/.." && pwd)"
shopt -s nullglob nocaseglob

for video in "$raiz"/videos/entrada/*.{mp4,mov,mkv,avi,webm,m4v}; do
  nombre="$(basename "${video%.*}")"
  if [[ -f "$raiz/videos/salida/${nombre}_${formato}.mp4" ]]; then
    echo "Ya procesado: $nombre"
    continue
  fi
  echo "Procesando: $nombre"
  "$raiz/scripts/procesar_video.sh" "$video" "$formato"
done
