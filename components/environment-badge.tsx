import { getEnvironmentLabel } from "@/lib/env";

export function EnvironmentBadge() {
  const label = getEnvironmentLabel();

  return (
    <span className="badge" aria-label={`Prostredi: ${label}`}>
      {label}
    </span>
  );
}
