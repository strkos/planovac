# planovac

Repozitář aktuálně obsahuje produktovou a požadavkovou dokumentaci k aplikaci pro správu spolku a také minimální aplikační kostru pro implementaci fáze 0 včetně prvního Supabase baseline.

## Minimální aplikace

V repozitáři je připravený základ aplikace v potvrzeném stacku:

- Next.js
- TypeScript
- App Router
- ESLint

Současně repozitář nově obsahuje i první databázové artefakty pro F0-04:

- verzovanou migraci v `supabase/migrations/`
- demo seed data v `supabase/seed/`
- provozní popis preview schémat a anonymizovaných snapshotů

Lokální spuštění a ověření je popsané v dokumentu [Lokální start projektu](docs/provoz/lokalni-start.md).

Pro cloud agenty je v repozitáři připravený idempotentní bootstrap skript `scripts/bootstrap-cloud-agent.sh`, který podle `package-lock.json` zajistí instalaci závislostí přes `npm ci` bez nutnosti ručního `npm install`.

### Rychlý start

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Dokumentace

- [Základní zadání](docs/zadani-zakladni.md)
- [Use journeys a uživatelské požadavky](docs/scenare-pouziti.md)
- [Návrh implementačního plánu](docs/plan-implementace.md)
- [Detailní implementační plán fáze 0](docs/faze-0-zaklad-repozitare-a-delivery-pipeline.md)
- [Lokální start projektu](docs/provoz/lokalni-start.md)
- [Cloud agent environment pro Node/npm](docs/provoz/cloud-agent-environment.md)
- [Konfigurace prostředí](docs/provoz/konfigurace-prostredi.md)
- [Supabase baseline a preview schema workflow](docs/provoz/supabase-baseline-a-preview-schema.md)
