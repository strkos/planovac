export type AppEnvironment = "local" | "preview" | "production";

export type EnvironmentSource = "NEXT_PUBLIC_APP_ENV" | "VERCEL_ENV" | "NODE_ENV";

export type EnvironmentConfig = {
  environment: AppEnvironment;
  label: AppEnvironment;
  description: string;
  source: EnvironmentSource;
  sourceValue: string;
  baseUrl: string | null;
  deploymentUrl: string | null;
  commitSha: string | null;
};

function isAppEnvironment(value: string | undefined): value is AppEnvironment {
  return value === "local" || value === "preview" || value === "production";
}

function getExplicitEnvironmentValue(): AppEnvironment | null {
  const explicitEnvironment = process.env.NEXT_PUBLIC_APP_ENV;

  if (explicitEnvironment === undefined) {
    return null;
  }

  if (!isAppEnvironment(explicitEnvironment)) {
    throw new Error(
      "Invalid NEXT_PUBLIC_APP_ENV value. Expected one of: local, preview, production.",
    );
  }

  return explicitEnvironment;
}

function getEnvironmentDescription(environment: AppEnvironment): string {
  switch (environment) {
    case "production":
      return "Ostre prostredi po merge do main. Musi pouzivat produkcni konfiguraci a produkcni data.";
    case "preview":
      return "Testovaci preview pro pull request. Ma byt zretelne oddelene od produkce i od lokalniho vyvoje.";
    default:
      return "Lokalni vyvojove prostredi pro opakovatelne overeni zmen pred odeslanim do repozitare.";
  }
}

function buildEnvironmentConfig(
  environment: AppEnvironment,
  source: EnvironmentSource,
  sourceValue: string,
): EnvironmentConfig {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_BASE_URL ??
    (environment === "local" ? "http://localhost:3000" : null);

  if ((environment === "preview" || environment === "production") && !baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_APP_BASE_URL for preview or production environment.",
    );
  }

  return {
    environment,
    label: environment,
    description: getEnvironmentDescription(environment),
    source,
    sourceValue,
    baseUrl,
    deploymentUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    commitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? null,
  };
}

export function getEnvironmentConfig(): EnvironmentConfig {
  const explicitEnvironment = getExplicitEnvironmentValue();

  if (explicitEnvironment) {
    return buildEnvironmentConfig(
      explicitEnvironment,
      "NEXT_PUBLIC_APP_ENV",
      explicitEnvironment,
    );
  }

  if (process.env.VERCEL_ENV === "production") {
    return buildEnvironmentConfig("production", "VERCEL_ENV", "production");
  }

  if (process.env.VERCEL_ENV === "preview") {
    return buildEnvironmentConfig("preview", "VERCEL_ENV", "preview");
  }

  return buildEnvironmentConfig("local", "NODE_ENV", process.env.NODE_ENV ?? "development");
}

export function getAppEnvironment(): AppEnvironment {
  return getEnvironmentConfig().environment;
}

export function getEnvironmentBadgeVariant(): AppEnvironment {
  return getEnvironmentConfig().environment;
}

export function getEnvironmentLabel(): string {
  return getEnvironmentConfig().label;
}
