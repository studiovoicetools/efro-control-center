import type { HealthStatus } from "@/lib/types";

const COLOR_MAP: Record<HealthStatus, { text: string; color: string }> = {
  gruen: { text: "Grün", color: "var(--good)" },
  gelb: { text: "Gelb", color: "var(--warn)" },
  rot: { text: "Rot", color: "var(--bad)" }
};

export function StatusPill({ status }: { status: HealthStatus }) {
  const config = COLOR_MAP[status];

  return (
    <span className="status-pill">
      <span className="status-dot" style={{ background: config.color }} />
      {config.text}
    </span>
  );
}
