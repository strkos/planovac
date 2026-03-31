# Lokální start projektu

Tento dokument popisuje minimální postup pro spuštění aplikační kostry rozšířené v rámci backlogových položek **F0-02: Založení minimální aplikace**, **F0-03: Konfigurace prostředí a secretů**, **F0-04: Supabase baseline**, **F0-05: GitHub CI** a **F0-06: Vercel integrace**.

## Předpoklady

- Node.js 20 nebo novější
- npm 10 nebo novější

## Install

```bash
npm install
```

Pro cloud agenty je vhodné použít místo ručního `npm install` bootstrap skript v repozitáři:

```bash
./scripts/bootstrap-cloud-agent.sh
```

Skript:

- očekává rootový `package-lock.json`,
- používá `npm ci`, aby instalace odpovídala uzamčeným verzím,
- je idempotentní a při nezměněném lockfilu zbytečně neinstaluje znovu,
- připraví repozitář tak, aby po startu šlo rovnou spustit `npm run lint` a `npm run build`.

Pro cloud agent environment je doporučený startup krok:

```bash
if [ -f package-lock.json ]; then ./scripts/bootstrap-cloud-agent.sh; fi
```

## Konfigurace prostředí

Před prvním spuštěním si zkopírujte vzorový soubor prostředí:

```bash
cp .env.example .env.local
```

Pro lokální běh zůstává výchozí hodnota:

```dotenv
NEXT_PUBLIC_APP_ENV=local
```

Přehled všech proměnných, jejich významu a správy je popsaný v dokumentu [Konfigurace prostředí](konfigurace-prostredi.md). Repo-side nastavení Vercelu, mapování preview a production prostředí a postup ověření jsou popsané v dokumentu [Vercel integrace](vercel-integrace.md).

Pokud chcete lokálně připravit i databázové artefakty pro navazující iterace, použijte:

- `supabase/migrations/20260331120000_f0_04_supabase_baseline.sql` jako první verzovanou migraci,
- `supabase/seed/seed.sql` jako demo dataset,
- [Supabase baseline a preview schema workflow](supabase-baseline-a-preview-schema.md) jako provozní popis preview schémat a anonymizovaného snapshotu.

## Run

Vývojový server:

```bash
npm run dev
```

Aplikace bude dostupná na `http://localhost:3000`.

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```

## Repo validace

```bash
npm run ci:validate
```

Tento krok lokálně ověří stejnou minimální vrstvu commitovaných artefaktů, kterou používá i GitHub CI:

- přítomnost a výchozí hodnoty důležitých klíčů v `.env.example`,
- přítomnost verzovaných Supabase migrací,
- přítomnost demo seed dat v `supabase/seed/seed.sql`,
- přítomnost minimální repo-side Vercel konfigurace v `vercel.json`.

## Co je součástí minimální kostry

- `app/` - minimální Next.js App Router aplikace
- `components/` - sdílené UI komponenty
- `lib/` - sdílené utility
- `tests/smoke/` - místo pro smoke ověření
- `supabase/migrations/` - místo pro databázové migrace
- `supabase/seed/` - místo pro seed nebo demo data
- `docs/provoz/` - provozní dokumentace
- `.github/workflows/` - GitHub CI workflow a navazující delivery automatizace

## Co přidává F0-04 az F0-06

### F0-04

- první verzovaný databázový baseline pro Supabase,
- demo seed data pro lokální a neprodukční ověření,
- provozní pravidla pro preview schémata `preview_<identifikator>`,
- popis stabilního mapování vybraných Uživatelů na neprodukční kontaktní údaje.

### F0-05

- GitHub Actions workflow v `.github/workflows/ci.yml`,
- samostatné CI kontroly `install`, `lint`, `build` a `validate-supabase`,
- validaci `.env.example` proti minimální konfiguraci prostředí,
- validaci přítomnosti a základního obsahu verzovaných migrací a demo seed dat,
- provozní dokument [GitHub CI](github-ci.md) se seznamem status checks a validací.

### F0-06

- repo-side konfiguraci Vercelu v `vercel.json`,
- validaci Vercel konfigurace v `scripts/validate-vercel-config.mjs`,
- diagnostiku preview a production prostredi v domovske strance aplikace,
- provozni dokument [Vercel integrace](vercel-integrace.md) s mapovanim env promennych a rollback postupem.

## Omezení této etapy

Tato etapa stale zamerne neresi plne automatizovane nasazovani databazovych zmen ani orchestraci preview snapshotu. F0-06 uz uzavira repo-side pripravu Vercel preview a production konfigurace, ale realny smoke scenar a zkusebni end-to-end delivery pruchod patri az do navazujicich polozek F0-07 a F0-08.
