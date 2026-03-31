import { NextResponse } from "next/server";

import { getEnvironmentHealth } from "@/lib/env";

export function GET() {
  const health = getEnvironmentHealth();

  return NextResponse.json(health, {
    status: health.ok ? 200 : 503,
    headers: {
      "cache-control": "no-store",
    },
  });
}
