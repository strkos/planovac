import { getEnvironmentBadgeVariant, getEnvironmentLabel } from "@/lib/env";

export function EnvironmentBadge() {
  const label = getEnvironmentLabel();
  const variant = getEnvironmentBadgeVariant();

  return (
    <span className="badge" data-variant={variant} aria-label={`Prostredi: ${label}`}>
      {label}
    </span>
  );
}
