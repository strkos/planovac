# Lokální start projektu

Tento dokument popisuje minimální postup pro spuštění aplikační kostry rozšířené v rámci backlogových položek **F0-02: Založení minimální aplikace** a **F0-03: Konfigurace prostředí a secretů**.

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

## Omezení této etapy

Tato etapa záměrně řeší pouze minimální spustitelný základ a základní rozlišení prostředí. Supabase baseline a CI workflow patří do navazujících backlogových položek F0-04 a F0-05.
