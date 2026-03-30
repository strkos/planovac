export type AppEnvironment = "local" | "preview" | "production";

export function getAppEnvironment(): AppEnvironment {
  if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
    return "production";
  }

  if (process.env.VERCEL_ENV === "preview") {
    return "preview";
  }

  return "local";
}

export function getEnvironmentLabel(): string {
  const environment = getAppEnvironment();

  switch (environment) {
    case "production":
      return "production";
    case "preview":
      return "preview";
    default:
      return "local";
  }
}
