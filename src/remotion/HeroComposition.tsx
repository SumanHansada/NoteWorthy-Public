import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * The pitch, in motion. A messy jotted line becomes a structured note (AI
 * Format), then collapses to a sentence (AI Summarize), files itself, and never
 * touches the network.
 *
 * Drawn entirely in code, with no images or web fonts, so the player starts
 * instantly and cannot show a half-loaded frame. On a page whose whole claim is
 * "no network", that felt like the right constraint.
 *
 * Colours arrive as props rather than being hard-coded: the page picks one of
 * the app's six note tints at random and the animation has to follow it. They
 * are read from the live CSS variables, so these are the same values
 * `NoteTint.swift` defines.
 */

const DURATION = 420; // 14s at 30fps
const RAW = "roof quote from priya, slate before winter, 2 weeks, over budget";

const STRUCTURED = [
  { kind: "h", text: "Roof Quote" },
  { kind: "t", text: "Slate replacement before winter" },
  { kind: "t", text: "Two weeks of work" },
  { kind: "b", text: "Over the March budget" },
] as const;

const SUMMARY =
  "Priya quoted a slate roof before winter. Two weeks, over the March budget.";

export type HeroProps = {
  cardTop: string;
  cardBottom: string;
  cardFg: string;
  accent: string;
  accentInk: string;
  scheme: "light" | "dark";
};

/** A silicon die. Drawn rather than an emoji, so it can wear the note tint. */
function SiliconIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
    >
      <rect x="7" y="7" width="10" height="10" rx="2.5" />
      <rect x="10.5" y="10.5" width="3" height="3" rx="1" fill="currentColor" stroke="none" />
      <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
    </svg>
  );
}

export const HeroComposition: React.FC<HeroProps> = ({
  cardTop = "#FCEFB4",
  cardBottom = "#F9E48F",
  cardFg = "#4A3B00",
  accent = "#C79400",
  accentInk = "#896600",
  scheme = "dark",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isPortrait = height > width || width < 750;
  const dark = scheme === "dark";

  // 0–90    the raw line types itself
  // 90      AI Format is pressed
  // 110–150 the line gives way to structure
  // 190     it files itself
  // 250     AI Summarize is pressed
  // 270–310 the structure collapses to one sentence
  const typed = Math.floor(
    interpolate(frame, [10, 80], [0, RAW.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const formatPress = spring({ frame: frame - 90, fps, config: { damping: 14 } });
  const morph = interpolate(frame, [110, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const filed = spring({ frame: frame - 190, fps, config: { damping: 16 } });
  const summarizePress = spring({ frame: frame - 250, fps, config: { damping: 14 } });
  const summarized = interpolate(frame, [270, 310], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const planeFlyProgress = interpolate(frame, [5, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  // Short enough that the plane no longer crosses the chip opposite.
  const planeStartDist = -260;
  const planeX = interpolate(planeFlyProgress, [0, 1], [planeStartDist, 0]);

  const onCard = cardFg;
  const subtle = (a: number) => `${cardFg}${Math.round(a * 255).toString(16).padStart(2, "0")}`;

  const cardWidth = isPortrait ? Math.min(480, width - 40) : 640;

  const chip: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: isPortrait ? 8 : 10,
    padding: isPortrait ? "6px 12px" : "10px 18px",
    borderRadius: 999,
    border: `1px solid ${accent}66`,
    background: `${accent}1f`,
    color: accentInk,
    fontSize: isPortrait ? 15 : 20,
    fontWeight: 600,
    whiteSpace: "nowrap",
  };

  const chipIconIn = interpolate(frame, [5, 55], [0.55, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: dark
          ? `radial-gradient(120% 100% at 20% 0%, ${cardBottom}22 0%, #0d0b06 62%)`
          : `radial-gradient(120% 100% at 20% 0%, #ffffff 0%, ${cardBottom}66 100%)`,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: isPortrait ? 64 : 0,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      }}
    >
      {/* The two claims, stated once and left up. Portrait takes the card's own
          width so the pair sits on its edges rather than bunched mid-frame. */}
      <div
        style={{
          position: "absolute",
          top: isPortrait ? 20 : 40,
          ...(isPortrait
            ? {
                left: "50%",
                transform: "translateX(-50%)",
                width: cardWidth,
              }
            : { left: 48, right: 48 }),
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={chip}>
          <span
            style={{
              display: "flex",
              transform: `scale(${chipIconIn})`,
            }}
          >
            <SiliconIcon size={isPortrait ? 17 : 22} />
          </span>
          Uses Apple Intelligence
        </div>

        <div style={chip}>
          <span
            style={{
              fontSize: isPortrait ? 17 : 22,
              display: "inline-block",
              transform: `translateX(${planeX}px)`,
            }}
          >
            ✈
          </span>
          No Internet Required
        </div>
      </div>

      <div
        style={{
          width: cardWidth,
          background: `linear-gradient(180deg, ${cardTop} 0%, ${cardBottom} 100%)`,
          borderRadius: 26,
          padding: isPortrait ? "20px 22px" : "24px 30px",
          color: onCard,
          boxShadow: dark
            ? "0 30px 60px rgba(0,0,0,.55)"
            : "0 30px 60px rgba(60,50,20,.22)",
        }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: isPortrait ? 16 : 20 }}>
          {["#F9E48F", "#C7DBF8", "#F7C4D2", "#BFE6CE", "#DACFF6", "#E2E2E7"].map((c) => (
            <div
              key={c}
              style={{
                width: isPortrait ? 20 : 24,
                height: isPortrait ? 20 : 24,
                borderRadius: 999,
                background: c,
                border:
                  c.toUpperCase() === cardBottom.toUpperCase()
                    ? `2.5px solid ${subtle(0.65)}`
                    : "1px solid rgba(0,0,0,.14)",
              }}
            />
          ))}
        </div>

        <div style={{ position: "relative", minHeight: isPortrait ? 180 : 200 }}>
          {/* Raw */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 1 - morph,
              fontSize: isPortrait ? 21 : 26,
              lineHeight: 1.45,
            }}
          >
            {RAW.slice(0, typed)}
            {/* A real caret rather than the "▌" block glyph: block-drawing
                characters render at wildly different widths per font, and the
                heavy bar read as a highlight rather than as an insertion point. */}
            {frame < 85 && frame % 16 < 8 ? (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: isPortrait ? 22 : 27,
                  marginLeft: 3,
                  background: onCard,
                  verticalAlign: "text-bottom",
                }}
              />
            ) : null}
          </div>

          {/* Structured: fades in on Format, back out on Summarize */}
          <div style={{ position: "absolute", inset: 0, opacity: morph * (1 - summarized) }}>
            {STRUCTURED.map((row, i) => {
              const appear = spring({
                frame: frame - 118 - i * 9,
                fps,
                config: { damping: 15 },
              });
              return (
                <div
                  key={row.text}
                  style={{
                    opacity: appear,
                    transform: `translateX(${(1 - appear) * 18}px)`,
                    marginBottom: isPortrait ? 10 : 13,
                    fontSize: row.kind === "h" ? (isPortrait ? 26 : 33) : (isPortrait ? 20 : 24),
                    fontWeight: row.kind === "h" ? 700 : 500,
                    display: "flex",
                    alignItems: "center",
                    gap: isPortrait ? 9 : 12,
                  }}
                >
                  {row.kind === "t" && (
                    <span
                      style={{
                        width: isPortrait ? 18 : 21,
                        height: isPortrait ? 18 : 21,
                        borderRadius: 5,
                        border: `2.5px solid ${subtle(0.6)}`,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {row.kind === "b" && <span style={{ fontSize: isPortrait ? 20 : 24 }}>•</span>}
                  <span>{row.text}</span>
                </div>
              );
            })}
          </div>

          {/* Summary: one sentence */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: summarized,
              transform: `translateY(${(1 - summarized) * 14}px)`,
            }}
          >
            <div style={{ fontSize: isPortrait ? 13 : 15, fontWeight: 700, letterSpacing: 1.4, opacity: 0.6 }}>
              ✦ SUMMARY
            </div>
            <div style={{ marginTop: isPortrait ? 10 : 14, fontSize: isPortrait ? 21 : 27, lineHeight: 1.4, fontWeight: 500 }}>
              {SUMMARY}
            </div>
          </div>
        </div>

        <div style={{ marginTop: isPortrait ? 12 : 16, display: "flex", alignItems: "center", gap: isPortrait ? 7 : 10, flexWrap: isPortrait ? "wrap" : "nowrap" }}>
          <span style={{ fontSize: isPortrait ? 15 : 17, opacity: 0.72 }}>✦ Files under</span>
          {["Tasks", "Ideas", "Info"].map((name) => {
            const isPick = name === "Tasks";
            return (
              <span
                key={name}
                style={{
                  fontSize: isPortrait ? 15 : 17,
                  fontWeight: isPick ? 700 : 500,
                  padding: isPortrait ? "4px 11px" : "6px 14px",
                  borderRadius: 999,
                  border: `1px solid ${subtle(0.25)}`,
                  background: isPick ? subtle(0.1 + filed * 0.12) : "transparent",
                  transform: isPick ? `scale(${1 + filed * 0.06})` : undefined,
                }}
              >
                {name}
                {isPick && filed > 0.5 ? " ✦" : ""}
              </span>
            );
          })}
        </div>
      </div>

      {/* AI chips */}
      <div style={{ marginTop: isPortrait ? 20 : 26, display: "flex", gap: isPortrait ? 10 : 14 }}>
        {[
          { label: "✦ AI Format", press: formatPress, active: frame >= 90 && frame < 250 },
          { label: "✦ AI Summarize", press: summarizePress, active: frame >= 250 },
        ].map((chip) => (
          <div
            key={chip.label}
            style={{
              padding: isPortrait ? "10px 18px" : "13px 24px",
              borderRadius: 999,
              background: chip.active ? `${accent}33` : `${accent}14`,
              border: `1px solid ${accent}${chip.active ? "aa" : "44"}`,
              color: accentInk,
              fontSize: isPortrait ? 17 : 21,
              fontWeight: 600,
              transform: `scale(${1 - chip.press * 0.05 + (chip.active ? 0.05 : 0)})`,
              opacity: chip.active ? 1 : 0.55,
            }}
          >
            {chip.label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const heroDuration = DURATION;
