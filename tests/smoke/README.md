# Smoke overeni

Tato slozka obsahuje minimalni smoke scenar pro backlogovou polozku **F0-07: Smoke test a diagnostika**.

## Co smoke scenar kontroluje

Skript `run-smoke.mjs` overuje proti URL z `SMOKE_BASE_URL`:

- dostupnost domovske stranky `/`,
- dostupnost strojove citelneho endpointu `/api/health`,
- pritomnost markeru F0-07 v HTML homepage,
- JSON payload s identifikaci aplikace `planovac`,
- hodnotu `phase=F0-07`,
- platnou identifikaci prostredi `local`, `preview` nebo `production`,
- seznam environment kontrol vracenych z runtime diagnostiky.

## Jak smoke scenar spustit

Lokalne po startu vyvojoveho serveru:

```bash
SMOKE_BASE_URL=http://localhost:3000 npm run smoke
```

Nad preview nebo production deploymentem:

```bash
SMOKE_BASE_URL=https://<nasazena-url> npm run smoke
```

## Co smoke scenar zamerne neresi

F0-07 zatim nekontroluje:

- prihlaseni Uzivatele,
- databazove migrace aplikovane proti zive instanci,
- integraci na Supabase API,
- automaticke spousteni po kazdem deployi.

Tyto oblasti budou navazovat az v dalsich iteracich, az bude existovat realna datova vrstva a plnejsi delivery workflow.
