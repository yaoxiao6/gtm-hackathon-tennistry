# Cheapest plan without HypiHub

How much one promo costs (a 9 s reel with a people swap, plus a 6 s end card) when you avoid
Hypit's hosted HypiHub service and run as much as possible on your own machine.

> **Prices** were read from public pages in **October 2026**. They change often; check them before
> you spend. Prices from resellers are marked as such.
> **Hardware assumed:** this Mac, an Apple M3 with 16 GB of memory. It has no NVIDIA GPU, so
> "local GPU" here means Apple's Metal/MLX.

## Bottom line

| Plan | Swap at 480p (draft) | Swap at 1080p (final) | Everything else |
| --- | --- | --- | --- |
| **What we used:** HypiHub | ≈ $1.52 | ≈ $7.88 | $0 |
| **Cheapest API:** Segmind video-to-video | **≈ $1.21** | **≈ $6.69** | $0 |
| Official ByteDance API (BytePlus) | ≈ $1.85 | ≈ $10.25 | $0 |
| Open-source swap on a rented GPU (Wan 2.2 Animate) | ≈ $1–2 the first time, then ≈ $0.50 | not practical | $0 |

**Recommendation:** use **Segmind at 480p** for drafts (≈ $1.21) and Segmind at 1080p only for the
final (≈ $6.69). Every other step runs on your Mac for free. That saves about 15–20 % compared with
HypiHub. The catch: hypit has no ready-made Segmind connection (see "Connecting Segmind" below).

## Step-by-step costs

| Step | Cheapest option | Runs where | Cost |
| --- | --- | --- | --- |
| Download | yt-dlp | Mac | $0 |
| Fix the format | ffmpeg | Mac | $0 |
| **Swap the people** | **Seedance 2.5 video-to-video on Segmind** | Cloud API | **$1.21 (480p) / $6.69 (1080p)** |
| Put the sound back | ffmpeg | Mac | $0 |
| Speech-to-text *(only if added)* | Whisper on MLX (`mlx-whisper`), or WhisperX on CPU | Mac | $0 |
| Text-to-speech *(only if added)* | Qwen3-TTS 0.6B, 8-bit, via `mlx-audio` | Mac (Metal) | $0 |
| End card | Remotion | Mac | $0 (free for teams of up to 3 people) |
| Join | ffmpeg | Mac | $0 |
| **Total per promo** | | | **≈ $1.21 draft / ≈ $6.69 final** |

The current promo uses **no speech-to-text or text-to-speech**, so those rows cost nothing today.
They are listed for a voiceover or captions later.

## How the swap price is calculated

A video edit bills **both the seconds you send in and the seconds you get back**.

- **Segmind:** billed seconds = output + the larger of the input length and ⅔ of the output.
  For us that is 9 + 9.1 ≈ **19 s**.
  - 480p: $0.0637/s × 19 ≈ **$1.21**
  - 720p: $0.1429/s × 19 ≈ $2.72
  - 1080p: $0.3519/s × 19 ≈ **$6.69**
- **HypiHub:** (9 s output + 9.1 s input) ≈ 18 s.
  - 480p: $0.084/s → ≈ $1.52
  - 720p: $0.1975/s → ≈ $3.56
  - 1080p: $0.438/s → ≈ $7.88
- **BytePlus (official):** bills tokens on input + output seconds. At its standard per-second rates
  (480p $0.1028, 1080p $0.5686), 18 s comes to ≈ $1.85 / ≈ $10.25. This is an estimate, because
  BytePlus's rate for requests with a video input wasn't published separately.

"Cheapest model for Seedance 2.5" means **480p video-to-video**. The cheaper Seedance variants
(2.0 Fast or Mini) can't do a strict edit of existing footage, and only 2.5 keeps the original motion.

## Fully local swap: not possible on this Mac

The open-source alternative to Seedance for replacing a character is **Wan 2.2 Animate-14B**. Its
official requirements put it in the 80 GB GPU class, with a ~72 GB download. A 16 GB M3 can't run it.

The cheapest workaround is a **rented cloud GPU** on RunPod:

| GPU | ≈ $/hour | Fits Animate-14B? |
| --- | --- | --- |
| RTX 4090 (24 GB) | $0.34 | Only heavily compressed versions, with lower quality |
| A100 80 GB | $0.89–1.49 | Yes |
| H100 80 GB | $1.99–2.89 | Yes, fastest |

For a 9 s clip: setup and the model download take about 20–40 minutes on the first run, then each
clip takes about 10–20 minutes. That works out to **≈ $1–2 the first time, ≈ $0.50 per clip after
that**, if you shut the GPU down between uses. These are estimates, not measurements.

Downsides:
- You must supply a picture of each new person yourself (one more image step).
- It replaces one person per pass, so this promo needs two passes.
- Quality is below Seedance 2.5's, especially for the small player in the background.

It only pays off if you make **many** promos.

## Local speech tools on this Mac (free)

- **Speech-to-text:** `mlx-whisper` runs Whisper on the Metal GPU. WhisperX, which hypit's local
  connection uses, runs on the CPU on a Mac, which is fine for short reels.
  Hypit ships a local WhisperX connection (`@hypit/provider-whisperx-local`).
- **Text-to-speech:** "Qwen 0.8B" is **Qwen3-TTS 0.6B**. It runs through `mlx-audio`; the 8-bit
  version is about 1.9 GB on disk. Hypit has no Qwen TTS connection, so generate the WAV with
  `mlx-audio` and bring it in as an `asset:Audio` file.

## Connecting Segmind

Hypit's optional add-on connections are TokenDance, HiAPI, BeatAPI and Monid (all serve Seedance 2.5)
and Pollo (no Seedance). Segmind is not among them. Two ways to use it:

1. **Easiest:** call Segmind's API directly with the source clip. Download the result, then continue
   with ffmpeg and Remotion as before. Hypit isn't needed for this step.
2. **Stay inside hypit:** write a small project connection, following hypit's
   `examples/provider-package`, that maps Seedance 2.5 video edit to Segmind's API.

Prices for TokenDance, HiAPI, BeatAPI and Monid weren't published in a form I could read. Check them
too: if one beats Segmind, it plugs straight into hypit with `npm install @hypit/provider-<name>`.

## Sources

- [Segmind: Seedance 2.5 pricing](https://www.segmind.com/models/seedance-2.5/pricing) (video-to-video rates and billing formula)
- [ArgoLink: Seedance 2.5 API pricing, 6 providers compared](https://argolink.io/en/blog/seedance-2-5-api-pricing) (BytePlus, OpenRouter, Atlas, Kie, fal; reseller)
- HypiHub rates: `hypit pricing` output, from <https://hypit.ai/v1/pricing?model=seedance-2.5>
- [Wan 2.2 local requirements](https://computingforgeeks.com/run-wan-video-generation-locally/) and [RunPod Wan 2.2 guide](https://www.runpod.io/articles/guides/comfyui-wan-2-2)
- [RunPod pricing](https://www.runpod.io/gpu-cloud/pricing) and [Hivenet RunPod price guide](https://hivenet.com/post/runpod-pricing-complete-guide-to-gpu-cloud-costs)
- [qwen3-tts-mlx](https://github.com/suckerfish/qwen3-tts-mlx) (Qwen3-TTS on Apple Silicon through mlx-audio)
- Hypit's service partners page: `docs/guide/service-partners.md` in the hypit-ai/hypit repo
