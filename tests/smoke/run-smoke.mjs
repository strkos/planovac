const DEFAULT_TIMEOUT_MS = 15_000;
const requiredHomePageMarkers = [
  "planovac / F1-01",
  "planovac / F0-07",
  "Smoke scenar a diagnostika maji byt dohledatelne z aplikace i runtime endpointu.",
  "Zdravotni endpoint",
];

function getBaseUrl() {
  const value = process.env.SMOKE_BASE_URL?.trim();

  if (!value) {
    throw new Error("SMOKE_BASE_URL is not set. Provide a deployment URL or localhost base URL.");
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
}

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      headers: {
        accept: "application/json, text/html;q=0.9",
        ...(init.headers ?? {}),
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function assertResponseOk(response, label) {
  if (!response.ok) {
    throw new Error(`${label} returned HTTP ${response.status}.`);
  }
}

async function validateHealth(baseUrl) {
  const healthUrl = `${baseUrl}/api/health`;
  const response = await fetchWithTimeout(healthUrl);

  assertResponseOk(response, "Health endpoint");

  const payload = await response.json();

  if (payload.app !== "planovac") {
    throw new Error(`Health endpoint returned unexpected app identifier: ${payload.app}`);
  }

  if (payload.phase !== "F0-07") {
    throw new Error(`Health endpoint returned unexpected phase identifier: ${payload.phase}`);
  }

  if (typeof payload.ok !== "boolean") {
    throw new Error("Health endpoint did not return boolean field ok.");
  }

  if (!["local", "preview", "production"].includes(payload.environment)) {
    throw new Error(
      `Health endpoint returned unexpected environment value: ${payload.environment}`,
    );
  }

  if (!Array.isArray(payload.checks) || payload.checks.length === 0) {
    throw new Error("Health endpoint did not return environment checks.");
  }

  if (!payload.auth || payload.auth.provider !== "supabase-auth") {
    throw new Error("Health endpoint did not return F1-01 auth metadata.");
  }

  if (!Array.isArray(payload.auth.checks) || payload.auth.checks.length === 0) {
    throw new Error("Health endpoint did not return auth checks.");
  }

  return payload;
}

async function validateHomePage(baseUrl) {
  const homeUrl = `${baseUrl}/`;
  const response = await fetchWithTimeout(homeUrl, {
    headers: {
      accept: "text/html",
    },
  });

  assertResponseOk(response, "Home page");

  const html = await response.text();

  for (const marker of requiredHomePageMarkers) {
    if (!html.includes(marker)) {
      throw new Error(`Home page is missing expected marker: "${marker}"`);
    }
  }
}

async function main() {
  const baseUrl = getBaseUrl();

  console.log(`Running smoke checks against ${baseUrl}`);

  const health = await validateHealth(baseUrl);
  await validateHomePage(baseUrl);

  console.log("Smoke checks passed.");
  console.log(
    JSON.stringify(
      {
        baseUrl,
        healthStatus: health.status,
        environment: health.environment,
        source: health.source,
        checks: health.checks.map((check) => ({
          id: check.id,
          status: check.status,
        })),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(`Smoke checks failed: ${error.message}`);
  process.exitCode = 1;
});
