# AB MASSIVHAUS - scroll-scrub homepage (custom files)

These are the files written for the site. The scroll engine
(`src/components/scroll-scrub/scroll-scrub.tsx` + `.css`) and the project scaffold
(React 19 + TanStack Start, Cloudflare Worker) come from the Higgsfield "scroll-scrub"
website template and are not included here.

Copy these files over the same paths in the template project:

- src/scroll-scrub-scenes.ts      brand tokens + the one film scene
- src/ab-chapters.ts              chapter copy + scroll windows
- src/ab-massivhaus.css           all site styling
- src/components/ab/*.tsx         header + chapter overlay
- src/routes/index.tsx            the page
- src/app-meta.json, public/favicon.svg

Also required:
1. src/lib/security-headers.server.ts: change `media-src 'self' https:` to
   `media-src 'self' blob: https:` (the engine plays the film from Blob URLs).
2. Put the encoded film assets in public/assets/world/ (see ENCODING below) and a
   still of the final frame at public/assets/final-home.jpg.

## ENCODING (ffmpeg)
Source film (8 s, 1280x704): trim the baked-in text at both ends, then encode.

  ffmpeg -y -ss 0.95 -t 6.05 -i film.mp4 -an -c:v libx264 -crf 14 -pix_fmt yuv420p trimmed.mp4
  ffmpeg -y -i trimmed.mp4 -an -vf "crop=396:704:520:0" -c:v libx264 -crf 14 -pix_fmt yuv420p trimmed_m.mp4

  # desktop
  ffmpeg -y -i trimmed.mp4 -an -vf "unsharp=5:5:0.8:5:5:0.0" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart public/assets/world/scene-01.mp4
  # mobile
  ffmpeg -y -i trimmed_m.mp4 -an -vf "scale=-2:'min(720,ih)',unsharp=5:5:0.6:5:5:0.0" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart public/assets/world/scene-01-mobile.mp4
  # posters (exact first frame of each encoded clip)
  ffmpeg -y -ss 0 -i public/assets/world/scene-01.mp4 -frames:v 1 -q:v 2 public/assets/world/scene-01-poster.png
  ffmpeg -y -ss 0 -i public/assets/world/scene-01-mobile.mp4 -frames:v 1 -q:v 2 public/assets/world/scene-01-mobile-poster.png
  # final still
  ffmpeg -y -ss 7.0 -i film.mp4 -frames:v 1 -q:v 3 public/assets/final-home.jpg

Source film URL:
https://d8j0ntlcm91z4.cloudfront.net/user_3B2vgjrUTIIhYq9hybnh0xHXDjx/hf_20261008_010002_20bef952-d0ba-43f3-9748-b81a3222090d.mp4
