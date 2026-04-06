# Lokální start projektu

 Tento dokument popisuje minimální postup pro spuštění aplikační kostry rozšířené v rámci backlogových položek **F0-02: Založení minimální aplikace**, **F0-03: Konfigurace prostředí a secretů**, **F0-04: Supabase baseline**, **F0-05: GitHub CI**, **F0-06: Vercel integrace** a **F0-07: Smoke test a diagnostika**.

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

Pro navazující Fázi 1 se jako výchozí návrh počítá s tím, že:

- první přihlášení poběží přes **Supabase Auth** a právě jeden externí OAuth provider, doporučeně Google,
- local bude používat callback `http://localhost:3000/auth/callback`,
- preview bude používat callback `https://<preview-host>/auth/callback`,
- production bude používat callback `https://<produkční-doména>/auth/callback`,
- minimální role `admin` a `člen` budou načítané server-side z aplikační tabulky v Supabase,
- pro ověření budou připravené dvě účelové identity: jedna `admin`, jedna `člen`.

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

## Smoke overeni

Vychozi lokalni smoke scenar pouziva `SMOKE_BASE_URL` z `.env.local`. Pro lokalni beh tak staci, aby aplikace bezela na `http://localhost:3000`:

```bash
npm run dev
```

V druhem terminalu potom spustte:

```bash
npm run smoke
```

Smoke skript overi:

- `GET /api/health` vracejici JSON diagnostiku prostredi,
- HTTP 200 z domovske stranky,
- pritomnost markeru F0-07 na homepage,
- navrat informaci o prostredi, zdroji detekce a seznamu kontrol.

Pro preview nebo production deployment staci pred spustenim prepsat `SMOKE_BASE_URL`, napriklad:

```bash
SMOKE_BASE_URL=https://<preview-host> npm run smoke
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

## Co pridava F0-04 az F0-07

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

### F0-07

- route handler `app/api/health/route.ts` pro strojove citelnou diagnostiku deploymentu,
- smoke runner `tests/smoke/run-smoke.mjs`,
- `npm run smoke` pro lokalni, preview i production overeni nad `SMOKE_BASE_URL`,
- rozsireni homepage o viditelny smoke scenar a navaznost na runtime endpoint.

## Omezení této etapy

Tato etapa stale zamerne neresi plne automatizovane nasazovani databazovych zmen ani orchestraci preview snapshotu. F0-07 uz doplnuje zakladni smoke scenar nad nasazenou aplikaci, ale zkusebni end-to-end delivery pruchod pres pull request a merge patri az do navazujici polozky F0-08.
