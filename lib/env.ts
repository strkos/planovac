export type AppEnvironment = "local" | "preview" | "production";

export type EnvironmentSource =
  | "NEXT_PUBLIC_APP_ENV"
  | "VERCEL_TARGET_ENV"
  | "VERCEL_ENV"
  | "NODE_ENV";

export type EnvironmentBaseUrlSource =
  | "NEXT_PUBLIC_APP_BASE_URL"
  | "VERCEL_BRANCH_URL"
  | "VERCEL_PROJECT_PRODUCTION_URL"
  | "VERCEL_URL"
  | "local-default"
  | "unavailable";

export type EnvironmentCheck = {
  id: string;
  label: string;
  status: "pass" | "warning";
  detail: string;
};

export type EnvironmentConfig = {
  environment: AppEnvironment;
  label: AppEnvironment;
  description: string;
  source: EnvironmentSource;
  sourceValue: string;
  targetEnvironment: string | null;
  vercelEnvironment: string | null;
  baseUrl: string | null;
  baseUrlSource: EnvironmentBaseUrlSource;
  deploymentUrl: string | null;
  branchUrl: string | null;
  productionUrl: string | null;
  gitCommitRef: string | null;
  commitSha: string | null;
  checks: EnvironmentCheck[];
  isConsistent: boolean;
};

function isAppEnvironment(value: string | undefined | null): value is AppEnvironment {
  return value === "local" || value === "preview" || value === "production";
}

function normalizeUrl(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return null;
  }

  if (trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}

function getComparableHostname(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).hostname;
  } catch {
    return value;
  }
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
      return "Ostre prostredi po merge do main. Musi pouzivat produkcni konfiguraci, produkcni URL a nikdy nesmi sahat do preview dat.";
    case "preview":
      return "Testovaci preview pro pull request. Ma byt zretelne oddelene od produkce, mit vlastni URL a cist neprodukcni konfiguraci.";
    default:
      return "Lokalni vyvojove prostredi pro opakovatelne overeni zmen pred odeslanim do repozitare i pred preview deploymentem.";
  }
}

function getBaseUrl(
  environment: AppEnvironment,
): { value: string | null; source: EnvironmentBaseUrlSource } {
  const explicitBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL?.trim();

  if (explicitBaseUrl) {
    return {
      value: explicitBaseUrl,
      source: "NEXT_PUBLIC_APP_BASE_URL",
    };
  }

  const branchUrl = normalizeUrl(process.env.VERCEL_BRANCH_URL);
  const productionUrl = normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  const deploymentUrl = normalizeUrl(process.env.VERCEL_URL);

  if (environment === "preview" && branchUrl) {
    return {
      value: branchUrl,
      source: "VERCEL_BRANCH_URL",
    };
  }

  if (environment === "production" && productionUrl) {
    return {
      value: productionUrl,
      source: "VERCEL_PROJECT_PRODUCTION_URL",
    };
  }

  if (environment !== "local" && deploymentUrl) {
    return {
      value: deploymentUrl,
      source: "VERCEL_URL",
    };
  }

  if (environment === "local") {
    return {
      value: "http://localhost:3000",
      source: "local-default",
    };
  }

  return {
    value: null,
    source: "unavailable",
  };
}

function buildChecks(config: Omit<EnvironmentConfig, "checks" | "isConsistent">): EnvironmentCheck[] {
  const checks: EnvironmentCheck[] = [];
  const vercelEnvironment =
    config.targetEnvironment && isAppEnvironment(config.targetEnvironment)
      ? config.targetEnvironment
      : config.vercelEnvironment && isAppEnvironment(config.vercelEnvironment)
        ? config.vercelEnvironment
        : null;

  if (config.source === "NEXT_PUBLIC_APP_ENV" && vercelEnvironment) {
    checks.push(
      config.environment === vercelEnvironment
        ? {
            id: "explicit-env-match",
            label: "Explicitni rezim souhlasi s Vercel runtime",
            status: "pass",
            detail: `NEXT_PUBLIC_APP_ENV=${config.environment} odpovida Vercel prostredi ${vercelEnvironment}.`,
          }
        : {
            id: "explicit-env-match",
            label: "Explicitni rezim nesouhlasi s Vercel runtime",
            status: "warning",
            detail: `NEXT_PUBLIC_APP_ENV=${config.environment}, ale Vercel hlasi ${vercelEnvironment}. Zkontrolujte environment variables ve Vercelu.`,
          },
    );
  }

  if (config.environment !== "local") {
    checks.push(
      config.baseUrl
        ? {
            id: "base-url-present",
            label: "Nasazeni ma kanonickou zakladni URL",
            status: "pass",
            detail: `${config.baseUrlSource} poskytuje ${config.baseUrl}.`,
          }
        : {
            id: "base-url-present",
            label: "Chybi kanonicka zakladni URL",
            status: "warning",
            detail:
              "Preview ani production nemaji bez zakladni URL spolehlivou diagnostiku ani stabilni odkazy.",
          },
    );

    checks.push(
      config.commitSha
        ? {
            id: "commit-present",
            label: "Deploy je dohledatelny na commit",
            status: "pass",
            detail: `Commit ${config.commitSha.slice(0, 7)} je k dispozici v runtime diagnostice.`,
          }
        : {
            id: "commit-present",
            label: "Chybi commit SHA",
            status: "warning",
            detail:
              "Z nasazene aplikace neni poznat, jaky commit bezi. Zapnete system environment variables nebo doplnte fallback.",
          },
    );
  }

  if (config.environment === "preview") {
    const baseHostname = getComparableHostname(config.baseUrl);
    const productionHostname = getComparableHostname(config.productionUrl);

    checks.push(
      config.gitCommitRef
        ? {
            id: "preview-branch-ref",
            label: "Preview zna zdrojovou vetev",
            status: "pass",
            detail: `Deployment je navazany na vetev ${config.gitCommitRef}.`,
          }
        : {
            id: "preview-branch-ref",
            label: "Preview nema k dispozici branch ref",
            status: "warning",
            detail:
              "Branch ref chybi, takze je horsi dohledatelnost, z jake vetve preview vzniklo.",
          },
    );

    checks.push(
      baseHostname && productionHostname && baseHostname !== productionHostname
        ? {
            id: "preview-vs-production-url",
            label: "Preview je oddelene od produkcni URL",
            status: "pass",
            detail: `Preview bezi na ${baseHostname}, produkce na ${productionHostname}.`,
          }
        : {
            id: "preview-vs-production-url",
            label: "Preview neni jasne oddelene od produkce",
            status: "warning",
            detail:
              "Base URL preview by mela byt jina nez produkcni domena. Zkontrolujte NEXT_PUBLIC_APP_BASE_URL a Vercel env vars.",
          },
    );
  }

  if (config.environment === "production") {
    const baseHostname = getComparableHostname(config.baseUrl);
    const productionHostname = getComparableHostname(config.productionUrl);

    checks.push(
      baseHostname && productionHostname && baseHostname === productionHostname
        ? {
            id: "production-url-match",
            label: "Production pouziva produkcni domenu",
            status: "pass",
            detail: `Base URL ${baseHostname} odpovida produkcni domene projektu.`,
          }
        : {
            id: "production-url-match",
            label: "Production nema potvrzenou produkcni domenu",
            status: "warning",
            detail:
              "V runtime chybi shoda mezi base URL a produkcni domenou projektu. Zkontrolujte NEXT_PUBLIC_APP_BASE_URL a produkcni domeny ve Vercelu.",
          },
    );
  }

  return checks;
}

function buildEnvironmentConfig(
  environment: AppEnvironment,
  source: EnvironmentSource,
  sourceValue: string,
): EnvironmentConfig {
  const baseUrl = getBaseUrl(environment);
  const configWithoutChecks = {
    environment,
    label: environment,
    description: getEnvironmentDescription(environment),
    source,
    sourceValue,
    targetEnvironment: process.env.VERCEL_TARGET_ENV ?? null,
    vercelEnvironment: process.env.VERCEL_ENV ?? null,
    baseUrl: baseUrl.value,
    baseUrlSource: baseUrl.source,
    deploymentUrl: normalizeUrl(process.env.VERCEL_URL),
    branchUrl: normalizeUrl(process.env.VERCEL_BRANCH_URL),
    productionUrl: normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL),
    gitCommitRef: process.env.VERCEL_GIT_COMMIT_REF ?? null,
    commitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? null,
  } satisfies Omit<EnvironmentConfig, "checks" | "isConsistent">;
  const checks = buildChecks(configWithoutChecks);

  return {
    ...configWithoutChecks,
    checks,
    isConsistent: checks.every((check) => check.status === "pass"),
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

  if (isAppEnvironment(process.env.VERCEL_TARGET_ENV)) {
    return buildEnvironmentConfig(
      process.env.VERCEL_TARGET_ENV,
      "VERCEL_TARGET_ENV",
      process.env.VERCEL_TARGET_ENV,
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
