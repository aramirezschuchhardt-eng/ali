# Videos

Flujo de edición automática de videos con Claude + FFmpeg.

## Estructura

```
videos/entrada/   ← aquí van los videos originales (y su .srt si tiene subtítulos)
videos/salida/    ← aquí aparecen los videos listos para publicar
marca/logo.png    ← (opcional) si existe, se pone en la esquina superior derecha
scripts/          ← los scripts que hacen la edición
```

Los archivos de video **no se guardan en git** (pesan demasiado; ver `.gitignore`).
Solo se versionan los scripts y la configuración.

## Uso

```bash
# Procesar todos los videos nuevos de entrada/ (por defecto formato Reels/TikTok 9:16)
scripts/procesar_todo.sh

# Otros formatos
scripts/procesar_todo.sh youtube    # 16:9, 1920x1080
scripts/procesar_todo.sh cuadrado   # 1:1, 1080x1080

# Un solo video
scripts/procesar_video.sh videos/entrada/mi_video.mp4 reels
```

Los videos que ya están procesados se saltan, así que se puede correr cuantas veces quieras.

## Qué hace a cada video

- Lo adapta al formato elegido sin recortar: el video queda centrado sobre un fondo desenfocado.
- Normaliza el volumen al estándar de redes sociales (-14 LUFS).
- Lo comprime en H.264/AAC a 30 fps, listo para subir.
- Si hay `marca/logo.png`, le pone el logo.
- Si hay un `.srt` con el mismo nombre que el video (ej. `mi_video.srt`), le quema los subtítulos.
