# Lokální start projektu

Tento dokument popisuje minimální postup pro spuštění aplikační kostry připravené v rámci backlogové položky **F0-02: Založení minimální aplikace**.

## Předpoklady

- Node.js 20 nebo novější
- npm 10 nebo novější

## Install

```bash
npm install
```

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

Tato etapa záměrně řeší pouze minimální spustitelný základ. Konfigurace prostředí, `.env.example`, Supabase baseline a CI workflow patří do navazujících backlogových položek F0-03 až F0-05.
