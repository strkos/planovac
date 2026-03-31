#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCKFILE="$ROOT_DIR/package-lock.json"
NODE_MODULES_DIR="$ROOT_DIR/node_modules"
STAMP_FILE="$NODE_MODULES_DIR/.package-lock.hash"

if [[ ! -f "$LOCKFILE" ]]; then
  echo "package-lock.json was not found in $ROOT_DIR" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not available in PATH" >&2
  exit 1
fi

lock_hash="$(sha256sum "$LOCKFILE" | awk '{print $1}')"
installed_hash=""

if [[ -f "$STAMP_FILE" ]]; then
  installed_hash="$(<"$STAMP_FILE")"
fi

if [[ -d "$NODE_MODULES_DIR" && "$installed_hash" == "$lock_hash" ]]; then
  echo "Dependencies already match package-lock.json, skipping npm ci."
  exit 0
fi

echo "Installing dependencies from package-lock.json with npm ci..."
(
  cd "$ROOT_DIR"
  npm ci
)

printf '%s\n' "$lock_hash" >"$STAMP_FILE"
echo "Dependency bootstrap finished."
