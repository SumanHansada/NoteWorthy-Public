import { shot } from "./data";
import { useTheme } from "./theme";

/**
 * A screenshot sitting inside a real iPhone mockup.
 *
 * The mockups have a genuinely transparent screen, so the screenshot goes
 * *behind* the PNG and shows through the hole. No masking, no clip path, and
 * the bezel highlights stay on top where they belong.
 *
 * The rectangles below were measured off the PNGs rather than eyeballed:
 * `Tools/`-style scripts walked each row looking for a transparent run with
 * opaque pixels either side, which is the screen and nothing else. Both files
 * were also cropped to the phone itself, cutting away the supplier's
 * "Background Removed" watermark that sat underneath.
 */
const MOCKS = {
  front: { src: "mockups/iphone-front.png", ratio: 1632 / 3337, left: 4.84, top: 2.04, width: 89.77, height: 95.77, radius: "11%" },
  side: { src: "mockups/iphone-side.png", ratio: 1164 / 3265, left: 3.78, top: 2.63, width: 81.36, height: 96.97, radius: "9%" },
  hand: { src: "mockups/iphone-hand.png", ratio: 2648 / 3648, left: 7.63, top: 0.16, width: 70.73, height: 90.08, radius: "10%" },
  ipad: { src: "mockups/ipad-front.png", ratio: 2250 / 2937, left: 4.133, top: 3.235, width: 91.733, height: 93.701, radius: "2.5%" },
} as const;

export type MockKind = keyof typeof MOCKS;

export function DeviceMock({
  name,
  alt,
  kind = "front",
  device = kind === "ipad" ? "ipad" : "iphone",
  className = "",
}: {
  name: string;
  alt: string;
  kind?: MockKind;
  device?: "iphone" | "ipad";
  className?: string;
}) {
  const { scheme } = useTheme();
  const m = MOCKS[kind];

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: m.ratio }}>
      {/* Behind: the screenshot, positioned into the screen hole. */}
      <img
        src={shot(scheme, name, device)}
        alt={alt}
        loading="lazy"
        className="absolute object-cover"
        style={{
          left: `${m.left}%`,
          top: `${m.top}%`,
          width: `${m.width}%`,
          height: `${m.height}%`,
          borderRadius: m.radius,
        }}
      />
      {/* In front: the device itself, screen transparent. */}
      <img
        src={m.src}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}
