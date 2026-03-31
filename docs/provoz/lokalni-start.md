# Lokální start projektu

Tento dokument popisuje minimální postup pro spuštění aplikační kostry rozšířené v rámci backlogových položek **F0-02: Založení minimální aplikace**, **F0-03: Konfigurace prostředí a secretů** a **F0-04: Supabase baseline**.

## Předpoklady

- Node.js 20 nebo novější
- npm 10 nebo novější

## Install

```bash
npm install
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

Přehled všech proměnných, jejich významu a správy je popsaný v dokumentu [Konfigurace prostředí](konfigurace-prostredi.md).

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

## Co je součástí minimální kostry

- `app/` - minimální Next.js App Router aplikace
- `components/` - sdílené UI komponenty
- `lib/` - sdílené utility
- `tests/smoke/` - místo pro smoke ověření
- `supabase/migrations/` - místo pro databázové migrace
- `supabase/seed/` - místo pro seed nebo demo data
- `docs/provoz/` - provozní dokumentace

## Co přidává F0-04

- první verzovaný databázový baseline pro Supabase,
- demo seed data pro lokální a neprodukční ověření,
- provozní pravidla pro preview schémata `preview_<identifikator>`,
- popis stabilního mapování vybraných Uživatelů na neprodukční kontaktní údaje.

## Omezení této etapy

Tato etapa stále záměrně neřeší plně automatizované nasazování databázových změn ani orchestrace preview snapshotů. GitHub CI a deployment workflow patří do navazujících backlogových položek F0-05 a F0-06.
