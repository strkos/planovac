import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "..");

const vercelConfigPath = path.join(workspaceRoot, "vercel.json");

function assertStringField(config, key, expectedValue) {
  if (config[key] !== expectedValue) {
    throw new Error(
      `vercel.json field "${key}" must be "${expectedValue}", got "${String(config[key])}".`,
    );
  }
}

function assertDeploymentEnabled(config) {
  const deploymentEnabled = config.git?.deploymentEnabled;

  if (
    !deploymentEnabled ||
    typeof deploymentEnabled !== "object" ||
    Array.isArray(deploymentEnabled)
  ) {
    throw new Error(
      'vercel.json must define "git.deploymentEnabled" as an object.',
    );
  }

  if (deploymentEnabled.main !== true) {
    throw new Error(
      'vercel.json must explicitly enable deployments for branch "main".',
    );
  }
}

async function main() {
  const contents = await readFile(vercelConfigPath, "utf8");
  const parsed = JSON.parse(contents);

  assertStringField(parsed, "$schema", "https://openapi.vercel.sh/vercel.json");
  assertStringField(parsed, "framework", "nextjs");
  assertStringField(parsed, "installCommand", "npm ci");
  assertStringField(parsed, "buildCommand", "npm run build");
  assertStringField(parsed, "devCommand", "npm run dev");
  assertDeploymentEnabled(parsed);

  console.log("vercel.json validation passed.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
