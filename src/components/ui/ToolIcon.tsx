import { Wrench } from "lucide-react";
import { readableHex, toolIcon } from "@/lib/toolIcons";
import { cn } from "@/lib/cn";

/** Brand glyph for a tool; generic wrench when the tool has no known logo. */
export function ToolGlyph({ name, className }: { name: string; className?: string }) {
  const icon = toolIcon(name);
  if (!icon) return <Wrench className={cn("text-ssu-cream/50", className)} aria-hidden />;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill={readableHex(icon.hex)}>
      <path d={icon.path} />
    </svg>
  );
}

/** Icon + label pill used for tool stacks. */
export function ToolChip({ name, tone = "dark" }: { name: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium",
        tone === "dark"
          ? "text-ssu-cream/85 border-white/10 bg-white/[0.04]"
          : "border-ssu-ink/10 text-ssu-ink/80 bg-white",
      )}
    >
      {toolIcon(name) && <ToolGlyph name={name} className="size-3.5 shrink-0" />}
      {name}
    </span>
  );
}
