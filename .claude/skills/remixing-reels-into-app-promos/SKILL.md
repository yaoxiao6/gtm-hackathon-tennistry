---
name: remixing-reels-into-app-promos
description: Use when turning a downloaded Instagram/TikTok/YouTube short into a promo for an app - swapping the people in the footage with AI video editing (hypit / Seedance), adding a branded call-to-action end card (Remotion), and joining them into one vertical video. Also use when a downloaded .mp4 plays audio only with a black picture in QuickTime.
---

# Remixing Reels into App Promos

## Overview

Pipeline: **download → fix codec → AI subject swap (hypit) → end card (Remotion) → normalize + concat**.
Each stage outputs an ordinary MP4. Check every output by looking at frames before moving on.

## Quick Reference

| Stage | Tool | Output |
| --- | --- | --- |
| 1. Download | `yt-dlp -S "vcodec:h264,acodec:aac" <url>` | source.mp4 |
| 2. Codec fix (if needed) | ffmpeg → H.264 | source_h264.mp4 |
| 3. Subject swap | hypit + Seedance 2.5 source edit (HypiHub, paid) | swap.mp4 (silent) |
| 3b. Restore sound | ffmpeg remux of the original audio | swap_audio.mp4 |
| 4. End card | Remotion composition, 1080x1920 @30fps | endcard.mp4 (silent) |
| 5. Join | ffmpeg scale/fps + `anullsrc` + `concat` | final.mp4 |

Frame check, used after every stage:
```bash
ffmpeg -v error -y -i in.mp4 -vf "fps=1,scale=270:-1,tile=5x2" -frames:v 1 grid.png
```

## 1–2. Download and codec

yt-dlp often picks **VP9 inside .mp4**. QuickTime cannot decode VP9, so it plays the **audio only**.
Check with `ffprobe -show_entries stream=codec_name`; if it says `vp9` or `av1`, re-encode:
```bash
ffmpeg -i in.mp4 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -movflags +faststart out_h264.mp4
```

## 3. Subject swap with hypit

Setup, run once per project from the project root:
```bash
npm install --save-dev @hypit/hypit        # call it as ./node_modules/.bin/hypit
# package.json needs  "hypit": { "project": true }
./node_modules/.bin/hypit runtime init
./node_modules/.bin/hypit auth login hypihub.default --from ./token-file   # never print the token
```
`hypit vocabulary <pkg>` needs the exact npm name (`@hypit/seedance`, not `@hypit/seedance@1`).

Source (`authors/swap.svml`). This is a **strict source edit**: `model="2.5"`, `duration="-1"`, `aspect-ratio="adaptive"`:
```xml
<?svml using="@hypit/markup@1"?>
<svml>
  <import as="media" from="@hypit/media@1"/>
  <import as="text" from="@hypit/text@1"/>
  <import as="seedance" from="@hypit/seedance@1"/>
  <media:Video id="source" src="../../../source_h264.mp4"/>
  <text:Value id="direction">
    Edit this video. Keep camera, framing, light, setting, on-screen text and every movement exactly.
    Change only: [who becomes whom, with hair, clothing, build, position].
  </text:Value>
  <seedance:ReferenceVideo id="edit" model="2.5" prompt={direction}
    duration="-1" aspect-ratio="adaptive" resolution="480p">
    <seedance:Reference video={source} person-reference="true"/>
  </seedance:ReferenceVideo>
</svml>
```
The Run file (`runs/swap.svrun`) targets `edit.video`.

Execute in this order: `check` → `plan` → `pricing` → **get the user's spend approval** → `build` → `status <id> --watch` → `get <id> --output edit.video --to out.mp4`.

Price is per second, charged for **both the input and the output** seconds. For a 9 s clip that is about 18 billable seconds: 480p ≈ $1.50, 720p ≈ $3.60, 1080p ≈ $8.
Record the approved spend in `BRIEF.md`.
To pay less than HypiHub, or to run more steps on the local machine, see `COST-PLAN.md`.

## 4. End card with Remotion

Install the Remotion skills by cloning `remotion-dev/skills` and copying `skills/*` into `~/.claude/skills/`.
Then follow `remotion-create`: scaffold with `npx create-video@latest --yes --blank --no-tailwind <subdir>` into a subfolder.

- Match the main video: 1080x1920, 30fps, about 6 s (180 frames).
- Build the palette from the app icon. Put the icon in `public/` and load it with `staticFile()`.
- Use `Interactive.Div` with inline `interpolate()` for animation; CSS animations don't render.
- Order the content: icon → name + tagline → value prop → stat → **Download CTA** → **Subscribe/Follow**.
- Make the creator handle a `defaultProps` value so it can be filled in later.
- Render stills (`npx remotion still <Comp> out/f.png --frame=N`) to check the layout, then render the video.

## 5. Normalize and concat

```bash
ffmpeg -i swap_audio.mp4 -i endcard.mp4 -f lavfi -t 6 -i anullsrc=r=44100:cl=stereo \
 -filter_complex "[0:v]scale=1080:1920:flags=lanczos,setsar=1,fps=30,format=yuv420p[v0];\
[1:v]setsar=1,fps=30,format=yuv420p[v1];[0:a]afade=t=out:st=<dur-0.5>:d=0.5[a0];\
[v0][a0][v1][2:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" \
 -c:v libx264 -crf 18 -c:a aac -movflags +faststart final.mp4
```

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| Picture is black, only audio plays | VP9 file: re-encode to H.264 (stage 2) |
| Storing the hypit command in a shell variable (`H="npm exec ..."`) | zsh treats the whole string as one command; call `./node_modules/.bin/hypit` |
| "No Hypit project was found" | Add `"hypit": {"project": true}` to package.json |
| The swap result has no sound | Expected when `generate-audio` is off: remux the original audio |
| Running a paid build without approval | Run `plan` and `pricing` first; show the price per resolution; ask |
| Background person is unreadable | 480p is a draft; use 1080p for the final |
| Concat fails or drifts out of sync | Inputs differ in size or fps; the silent end card needs `anullsrc` |
| Marketing claim not in the brand brief ("Free") | Use only facts the client documented |
| A tappable link inside the video | Videos can't hold links; put the tracking link in the caption or bio |

## Before Publishing

- **Music:** the original reel's music may be licensed to someone else; swap in licensed or royalty-free music for ads.
- **Brand approval:** get the brand's approval if their brief requires it.
- **Handle:** fill in the real creator handle; don't leave the generic text.
