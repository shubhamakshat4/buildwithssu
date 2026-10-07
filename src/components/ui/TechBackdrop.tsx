import { cn } from "@/lib/cn";

/** Deterministic pseudo-random so server and client render identical particles. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seeded(42);
const PARTICLES = Array.from({ length: 26 }, () => ({
  left: rand() * 100,
  top: rand() * 100,
  size: 1 + rand() * 2.5,
  dur: 14 + rand() * 18,
  delay: -rand() * 20,
  dx: (rand() - 0.5) * 120,
  dy: (rand() - 0.5) * 120,
}));

/** Animated gold grid + drifting particles + glows for ink sections. Pure CSS. */
export function TechBackdrop({
  particles = true,
  glow = "gold",
  className,
}: {
  particles?: boolean;
  glow?: "gold" | "cyan" | "both";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="bg-grid bg-grid-animated absolute inset-0" />
      {(glow === "gold" || glow === "both") && (
        <div className="bg-ssu-gold/10 absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full blur-3xl" />
      )}
      {(glow === "cyan" || glow === "both") && (
        <div className="bg-tech-cyan/10 absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full blur-3xl" />
      )}
      <div className="bg-ssu-maroon/30 absolute top-1/3 right-1/4 h-72 w-72 rounded-full blur-3xl" />
      {particles &&
        PARTICLES.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={
              {
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                "--dur": `${p.dur}s`,
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
              } as React.CSSProperties
            }
          />
        ))}
    </div>
  );
}
