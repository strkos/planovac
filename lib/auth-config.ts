import { type AppEnvironment, type EnvironmentCheck, getEnvironmentConfig } from "@/lib/env";

export type AuthConfig = {
  provider: "supabase-auth";
  signInMethod: "email-magic-link";
  externalIdentityProvider: false;
  accountProvisioning: "pre-provisioned-only";
  roleSource: "supabase-server-side-access-table";
  redirectPath: string | null;
  callbackUrl: string | null;
  failureReturnUrl: string;
  recommendedRedirects: Record<AppEnvironment, string>;
  checks: EnvironmentCheck[];
  isReady: boolean;
  status: "pass" | "warning";
};

function getTrimmedValue(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function isConfiguredValue(value: string | null, placeholders: string[]): boolean {
  if (!value) {
    return false;
  }

  return !placeholders.includes(value);
}

function isValidRedirectPath(value: string | null): value is string {
  if (!value) {
    return false;
  }

  return value.startsWith("/");
}

function buildCallbackUrl(baseUrl: string | null, redirectPath: string | null): string | null {
  if (!baseUrl || !isValidRedirectPath(redirectPath)) {
    return null;
  }

  try {
    return new URL(redirectPath, baseUrl).toString();
  } catch {
    return null;
  }
}

function buildRecommendedRedirects(redirectPath: string | null): Record<AppEnvironment, string> {
  const normalizedPath = isValidRedirectPath(redirectPath) ? redirectPath : "/auth/callback";

  return {
    local: `http://localhost:3000${normalizedPath}`,
    preview: `https://<preview-host>${normalizedPath}`,
    production: `https://<produkcni-domena>${normalizedPath}`,
  };
}

function buildChecks(
  supabaseUrl: string | null,
  anonKey: string | null,
  redirectPath: string | null,
  callbackUrl: string | null,
): EnvironmentCheck[] {
  return [
    {
      id: "auth-provider",
      label: "Prvni auth vrstva zustava v Supabase Auth",
      status: "pass",
      detail:
        "F1-01 potvrzuje Supabase Auth jako jedinou auth branu bez externiho poskytovatele identity.",
    },
    {
      id: "auth-sign-in-method",
      label: "Prvni prihlaseni pouziva email a magic link",
      status: "pass",
      detail:
        "Aplikace ma pro Fazi 1 pripravovat login pres email + magic link misto hesla nebo federovane identity.",
    },
    {
      id: "auth-account-provisioning",
      label: "Prvni ucty se zakladaji rizene",
      status: "pass",
      detail:
        "F1-01 pocita jen s predem pripravenymi ucty v Supabase Auth; samoobsluzna registrace zatim nepatri do rozsahu.",
    },
    isConfiguredValue(supabaseUrl, ["https://your-project.supabase.co"])
      ? {
          id: "auth-supabase-url",
          label: "NEXT_PUBLIC_SUPABASE_URL je pripraveno pro auth",
          status: "pass",
          detail: `Klientske auth volani mohou mirit na ${supabaseUrl}.`,
        }
      : {
          id: "auth-supabase-url",
          label: "NEXT_PUBLIC_SUPABASE_URL chybi nebo je jen placeholder",
          status: "warning",
          detail:
            "Pro F1-02 bude potreba doplnit skutecnou Supabase URL do .env.local a do Vercel env vars.",
        },
    isConfiguredValue(anonKey, ["your-anon-key"])
      ? {
          id: "auth-anon-key",
          label: "NEXT_PUBLIC_SUPABASE_ANON_KEY je pripraveny",
          status: "pass",
          detail: "Klientska cast muze bezpecne pouzit anon key pro prvni auth tok.",
        }
      : {
          id: "auth-anon-key",
          label: "NEXT_PUBLIC_SUPABASE_ANON_KEY chybi nebo je jen placeholder",
          status: "warning",
          detail:
            "Bez realneho anon key nepujde ve F1-02 odeslat magic link ani precist session z klienta.",
        },
    isValidRedirectPath(redirectPath)
      ? {
          id: "auth-redirect-path",
          label: "SUPABASE_AUTH_REDIRECT_PATH je validni",
          status: redirectPath === "/auth/callback" ? "pass" : "warning",
          detail:
            redirectPath === "/auth/callback"
              ? "Callback route odpovida doporucenemu path /auth/callback."
              : `Callback route je nastavena na ${redirectPath}. Pokud to neni zamer, vratte se na /auth/callback.`,
        }
      : {
          id: "auth-redirect-path",
          label: "SUPABASE_AUTH_REDIRECT_PATH neni validni path",
          status: "warning",
          detail:
            "Promenna musi zacinat lomitkem, aby slo jednoznacne odvodit callback URL pro local, preview i production.",
        },
    callbackUrl
      ? {
          id: "auth-callback-url",
          label: "Aktualni runtime umi odvodit callback URL",
          status: "pass",
          detail: `V tomto prostredi callback smeruje na ${callbackUrl}.`,
        }
      : {
          id: "auth-callback-url",
          label: "Callback URL nejde v runtime odvodit",
          status: "warning",
          detail:
            "Zkontrolujte NEXT_PUBLIC_APP_BASE_URL a SUPABASE_AUTH_REDIRECT_PATH, jinak nebude mozne spolehlive zapsat redirecty do Supabase Auth.",
        },
    {
      id: "auth-role-source",
      label: "Role admin a clen maji jit pres server-side lookup",
      status: "pass",
      detail:
        "F1-01 potvrzuje minimalni access tabulku v Supabase jako zdroj role mimo klientskou session.",
    },
  ];
}

export function getAuthConfig(): AuthConfig {
  const environment = getEnvironmentConfig();
  const supabaseUrl = getTrimmedValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = getTrimmedValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const redirectPath = getTrimmedValue(process.env.SUPABASE_AUTH_REDIRECT_PATH);
  const callbackUrl = buildCallbackUrl(environment.baseUrl, redirectPath);
  const checks = buildChecks(supabaseUrl, anonKey, redirectPath, callbackUrl);
  const isReady = checks.every((check) => check.status === "pass");

  return {
    provider: "supabase-auth",
    signInMethod: "email-magic-link",
    externalIdentityProvider: false,
    accountProvisioning: "pre-provisioned-only",
    roleSource: "supabase-server-side-access-table",
    redirectPath,
    callbackUrl,
    failureReturnUrl: "/",
    recommendedRedirects: buildRecommendedRedirects(redirectPath),
    checks,
    isReady,
    status: isReady ? "pass" : "warning",
  };
}
