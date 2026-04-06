# planovac

Repozitář aktuálně obsahuje produktovou a požadavkovou dokumentaci k aplikaci pro správu spolku a také minimální aplikační kostru pro implementaci fáze 0 včetně prvního Supabase baseline, GitHub CI validací, repo-side Vercel integrace a základního smoke scénáře nad nasazenou aplikací.

## Minimální aplikace

V repozitáři je připravený základ aplikace v potvrzeném stacku:

- Next.js
- TypeScript
- App Router
- ESLint

Současně repozitář obsahuje výstupy etap F0-04 až F0-07:

- verzovanou migraci v `supabase/migrations/`
- demo seed data v `supabase/seed/`
- provozní popis preview schémat a anonymizovaných snapshotů
- GitHub Actions workflow v `.github/workflows/ci.yml`
- validační skripty pro `.env.example`, Supabase artefakty a Vercel konfiguraci v `scripts/`
- základní `vercel.json` pro preview a production deployment
- diagnostiku prostředí, URL a commitu na domovské stránce aplikace
- health endpoint `app/api/health/route.ts` pro strojově čitelnou runtime diagnostiku
- smoke runner `npm run smoke` nad `SMOKE_BASE_URL`

Lokální spuštění a ověření je popsané v dokumentu [Lokální start projektu](docs/provoz/lokalni-start.md).

Pro cloud agenty je v repozitáři připravený idempotentní bootstrap skript `scripts/bootstrap-cloud-agent.sh`, který podle `package-lock.json` zajistí instalaci závislostí přes `npm ci` bez nutnosti ručního `npm install`.

### Rychlý start

```bash
npm install
npm run dev
npm run lint
npm run ci:validate
npm run smoke
npm run build
```

## Dokumentace

- [Základní zadání](docs/zadani-zakladni.md)
- [Use journeys a uživatelské požadavky](docs/scenare-pouziti.md)
- [Návrh implementačního plánu](docs/plan-implementace.md)
- [Detailní implementační plán fáze 0](docs/faze-0-zaklad-repozitare-a-delivery-pipeline.md)
- [Lokální start projektu](docs/provoz/lokalni-start.md)
- [Cloud agent environment pro Node/npm](docs/provoz/cloud-agent-environment.md)
- [GitHub CI](docs/provoz/github-ci.md)
- [Konfigurace prostředí](docs/provoz/konfigurace-prostredi.md)
- [Vercel integrace](docs/provoz/vercel-integrace.md)
- [Supabase baseline a preview schema workflow](docs/provoz/supabase-baseline-a-preview-schema.md)
