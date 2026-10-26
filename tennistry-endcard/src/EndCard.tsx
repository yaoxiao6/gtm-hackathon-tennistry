import { loadFont } from "@remotion/google-fonts/Poppins";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
});

const BALL = "#EEF5A6";
const BALL_DEEP = "#D9EA5B";
const INK = "#1C1D20";
const BLUSH = "#F6A5B6";

export type EndCardProps = {
  readonly creatorHandle: string;
};

const rise = (frame: number, start: number, fps: number) => ({
  opacity: interpolate(frame, [start, start + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
  translate: interpolate(
    frame,
    [start, start + 0.6 * fps],
    ["0px 60px", "0px 0px"],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  ),
});

const DownloadGlyph = () => (
  <svg width="58" height="58" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3v12m0 0l-5-5m5 5l5-5M4 19h16"
      stroke={INK}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BellGlyph = () => (
  <svg width="54" height="54" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15L6 16zM10 20a2 2 0 004 0"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EndCard = ({ creatorHandle }: EndCardProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        color: "white",
        alignItems: "center",
        background: `radial-gradient(circle at 50% 30%, #4A4B50 0%, #26272B 45%, ${INK} 100%)`,
      }}
    >
      <Img
        name="Tennistry icon"
        src={staticFile("tennistry-icon.png")}
        style={{
          position: "absolute",
          top: 190,
          width: 460,
          height: 460,
          borderRadius: 104,
          boxShadow: `0 30px 90px rgba(238, 245, 166, 0.25)`,
          scale: interpolate(frame, [0, 0.7 * fps], [0.4, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0, 0.25 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          rotate: interpolate(frame, [0, 0.7 * fps], ["-12deg", "0deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
          }),
        }}
      />

      <Interactive.Div
        name="Wordmark"
        style={{
          position: "absolute",
          top: 690,
          fontSize: 148,
          fontWeight: 800,
          letterSpacing: -3,
          color: BALL,
          ...rise(frame, 0.35 * fps, fps),
        }}
      >
        Tennistry
      </Interactive.Div>

      <Interactive.Div
        name="Tagline"
        style={{
          position: "absolute",
          top: 885,
          fontSize: 56,
          fontWeight: 400,
          color: "rgba(255,255,255,0.85)",
          ...rise(frame, 0.6 * fps, fps),
        }}
      >
        Your Tennis Life
      </Interactive.Div>

      <Interactive.Div
        name="Value prop"
        style={{
          position: "absolute",
          top: 1040,
          width: 900,
          textAlign: "center",
          fontSize: 62,
          fontWeight: 600,
          lineHeight: 1.25,
          ...rise(frame, 1.0 * fps, fps),
        }}
      >
        Find players at your level.
        <br />
        Play real matches.
      </Interactive.Div>

      <Interactive.Div
        name="Stats"
        style={{
          position: "absolute",
          top: 1225,
          fontSize: 46,
          fontWeight: 400,
          color: BLUSH,
          ...rise(frame, 1.4 * fps, fps),
        }}
      >
        3,700+ players · 1,700+ matches
      </Interactive.Div>

      <Interactive.Div
        name="Download CTA"
        style={{
          position: "absolute",
          top: 1360,
          display: "flex",
          alignItems: "center",
          gap: 28,
          padding: "34px 64px",
          borderRadius: 999,
          backgroundColor: BALL_DEEP,
          color: INK,
          boxShadow: "0 20px 60px rgba(217, 234, 91, 0.35)",
          opacity: interpolate(frame, [2 * fps, 2.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(
            frame,
            [2 * fps, 2.6 * fps, 3.6 * fps, 4 * fps, 4.4 * fps],
            [0.6, 1, 1, 1.06, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
              output: "perceptual-scale",
            },
          ),
        }}
      >
        <DownloadGlyph />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05 }}>
            Download Tennistry
          </div>
          <div style={{ fontSize: 40, fontWeight: 600, opacity: 0.8 }}>
            on the iOS App Store
          </div>
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Subscribe"
        style={{
          position: "absolute",
          top: 1620,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "24px 52px",
          borderRadius: 999,
          border: "3px solid rgba(255,255,255,0.9)",
          fontSize: 50,
          fontWeight: 600,
          ...rise(frame, 3 * fps, fps),
        }}
      >
        <div
          style={{
            display: "flex",
            transformOrigin: "50% 10%",
            rotate: interpolate(
              frame,
              [3.6 * fps, 3.8 * fps, 4 * fps, 4.2 * fps, 4.4 * fps],
              ["0deg", "18deg", "-16deg", "10deg", "0deg"],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          <BellGlyph />
        </div>
        {creatorHandle
          ? `Subscribe to ${creatorHandle}`
          : "Subscribe for more tennis"}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
