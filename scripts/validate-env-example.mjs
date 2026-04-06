import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "..");

const envExamplePath = path.join(workspaceRoot, ".env.example");

const requiredKeys = [
  "NEXT_PUBLIC_APP_ENV",
  "NEXT_PUBLIC_APP_BASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_PREVIEW_SCHEMA_PREFIX",
  "SMOKE_BASE_URL",
  "SUPABASE_AUTH_REDIRECT_PATH",
];

function parseEnvKeys(contents) {
  return contents
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => {
      const separatorIndex = line.indexOf("=");

      if (separatorIndex === -1) {
        throw new Error(`Invalid .env entry without "=" separator: ${line}`);
      }

      return line.slice(0, separatorIndex).trim();
    });
}

function assertNoDuplicateKeys(keys) {
  const seen = new Set();
  const duplicates = [];

  for (const key of keys) {
    if (seen.has(key)) {
      duplicates.push(key);
      continue;
    }

    seen.add(key);
  }

  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate keys in .env.example: ${Array.from(new Set(duplicates)).join(", ")}`,
    );
  }
}

function assertRequiredKeys(keys) {
  const missingKeys = requiredKeys.filter((key) => !keys.includes(key));

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required keys in .env.example: ${missingKeys.join(", ")}`,
    );
  }
}

function assertAppEnvironmentDefault(contents) {
  const match = contents.match(/^NEXT_PUBLIC_APP_ENV=(.+)$/mu);

  if (!match) {
    throw new Error("NEXT_PUBLIC_APP_ENV entry was not found in .env.example.");
  }

  if (match[1].trim() !== "local") {
    throw new Error(
      `NEXT_PUBLIC_APP_ENV must default to "local" in .env.example, got "${match[1].trim()}".`,
    );
  }
}

function assertPreviewPrefixDefault(contents) {
  const match = contents.match(/^SUPABASE_PREVIEW_SCHEMA_PREFIX=(.+)$/mu);

  if (!match) {
    throw new Error(
      "SUPABASE_PREVIEW_SCHEMA_PREFIX entry was not found in .env.example.",
    );
  }

  if (match[1].trim() !== "preview_") {
    throw new Error(
      `SUPABASE_PREVIEW_SCHEMA_PREFIX must default to "preview_", got "${match[1].trim()}".`,
    );
  }
}

async function main() {
  const contents = await readFile(envExamplePath, "utf8");
  const keys = parseEnvKeys(contents);

  assertNoDuplicateKeys(keys);
  assertRequiredKeys(keys);
  assertAppEnvironmentDefault(contents);
  assertPreviewPrefixDefault(contents);

  console.log(
    `.env.example validation passed for ${requiredKeys.length} required keys.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
