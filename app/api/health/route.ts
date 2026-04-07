import { NextResponse } from "next/server";

import { getAuthConfig } from "@/lib/auth-config";
import { getEnvironmentHealth } from "@/lib/env";

export function GET() {
  const health = getEnvironmentHealth();
  const auth = getAuthConfig();

  return NextResponse.json(
    {
      ...health,
      auth,
    },
    {
      status: health.ok ? 200 : 503,
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
