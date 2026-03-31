import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const migrationsDir = path.join(repoRoot, "supabase", "migrations");
const seedDir = path.join(repoRoot, "supabase", "seed");
const requiredMigrationPattern = /^\d{14}_.+\.sql$/;
const requiredPreviewPrefix = "preview_";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function sortedSqlFiles(entries) {
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

async function readDirectory(directoryPath) {
  try {
    return await readdir(directoryPath, { withFileTypes: true });
  } catch (error) {
    fail(
      `Adresar ${path.relative(repoRoot, directoryPath)} neni dostupny: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function readRequiredFile(relativePath) {
  try {
    return await readFile(path.join(repoRoot, relativePath), "utf8");
  } catch (error) {
    fail(
      `Soubor ${relativePath} neni dostupny: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function assertIncludes(content, expectedSnippet, fileLabel) {
  assert(
    content.includes(expectedSnippet),
    `${fileLabel} musi obsahovat retezec: ${expectedSnippet}`,
  );
}

async function validateMigrations() {
  const entries = await readDirectory(migrationsDir);
  const migrationFiles = sortedSqlFiles(entries);

  assert(
    migrationFiles.length > 0,
    "Adresar supabase/migrations musi obsahovat alespon jednu verzovanou SQL migraci.",
  );

  for (const fileName of migrationFiles) {
    assert(
      requiredMigrationPattern.test(fileName),
      `Migrace ${fileName} nema ocekavany tvar YYYYMMDDHHMMSS_popis.sql.`,
    );
  }

  const firstMigrationContent = await readRequiredFile(
    path.join("supabase", "migrations", migrationFiles[0]),
  );

  assertIncludes(firstMigrationContent, "create table public.feature_requests", migrationFiles[0]);
  assertIncludes(
    firstMigrationContent,
    "create table app_private.preview_schema_registry",
    migrationFiles[0],
  );
  assertIncludes(firstMigrationContent, "alter table public.feature_requests enable row level security;", migrationFiles[0]);
}

async function validateSeed() {
  const entries = await readDirectory(seedDir);
  const seedFiles = sortedSqlFiles(entries);

  assert(
    seedFiles.length > 0,
    "Adresar supabase/seed musi obsahovat alespon jeden SQL seed nebo demo dataset.",
  );

  assert(
    seedFiles.includes("seed.sql"),
    "Adresar supabase/seed musi obsahovat kanonicky soubor seed.sql.",
  );

  const seedContent = await readRequiredFile(path.join("supabase", "seed", "seed.sql"));

  assertIncludes(seedContent, "insert into public.app_users", "seed.sql");
  assertIncludes(seedContent, "insert into public.feature_requests", "seed.sql");
  assertIncludes(seedContent, "insert into app_private.preview_schema_registry", "seed.sql");
  assertIncludes(seedContent, requiredPreviewPrefix, "seed.sql");
}

await validateMigrations();
await validateSeed();

console.log("Supabase migrace a demo seed data prosly validaci.");
