# GitHub CI

Tento dokument je zdrojem pravdy pro backlogovou polozku **F0-05: GitHub CI** a navazujici minimum z **F0-07: Smoke test a diagnostika**.

Jeho cilem je:

- popsat workflow spoustene pro pull requesty a zmeny v `main`,
- vymezit minimalni povinne status checks pro merge do `main`,
- zapsat, jake validace repo aktualne provadi nad konfiguraci, Vercel integraci a databazovymi artefakty,
- popsat, jak na workflow navazuje manualne spoustene smoke overeni proti nasazene URL.

## Umisteni workflow

GitHub Actions workflow je ulozene v:

- `.github/workflows/ci.yml`

Workflow se spousti:

- na `pull_request` do vetve `main`,
- na `push` do vetve `main`.

## Minimalni status checks

Pro fazi 0 jsou povinne tyto kontroly:

- `install`
- `lint`
- `build`
- `validate-supabase`

Prvni tri kontroly odpovidaji potvrzenemu minimu delivery pipeline. Doplnena kontrola `validate-supabase` kryje databazove artefakty a nekompletni konfiguraci, ktere by jinak nemusely selhat dostatecne citelne uz pri samotnem buildu.

## Co workflow overuje

### install

- checkout repozitare,
- nastaveni Node.js 20,
- instalaci zavislosti pomoci `npm ci`.

Tento job slouzi jako samostatny status check, aby slo v branch protection primo vyzadovat uspesnou deterministickou instalaci podle `package-lock.json`.

### lint

- checkout repozitare,
- `npm ci`,
- `npm run lint`.

Lint je povinna staticka validace aplikacni kostry.

### build

- checkout repozitare,
- `npm ci`,
- `npm run ci:validate`,
- vytvoreni `.env.local` z `.env.example`,
- `npm run build`.

Build job navic explicitne hlida, ze commitovana konfigurace zustava opakovatelna i v cistem CI prostredi bez lokalnich secretu.

### validate-supabase

- checkout repozitare,
- `npm ci`,
- `npm run validate:env-example`,
- `npm run validate:supabase`.

Tento job dava samostatny status check pro repozitarove artefakty, ktere jsou dulezite pro navazujici preview a databazove iterace.

## Validace Vercel konfigurace

Skript `scripts/validate-vercel-config.mjs` overuje, ze:

- `vercel.json` existuje v rootu repozitare,
- je navazany na aktualni Vercel schema,
- pouziva `nextjs` framework preset,
- instalace probiha pres `npm ci`,
- build a dev rezim pouzivaji standardni npm skripty repozitare,
- branch `main` neni omylem vyradena z automatickych deploymentu.

Tato validace nenahrazuje skutecne propojeni s Vercel projektem, ale hlida, aby commitnuta cast F0-06 zustala konzistentni.

## Validace `.env.example`

Skript `scripts/validate-env-example.mjs` overuje, ze:

- `.env.example` obsahuje vsechny klice potrebne od F0-03 a F0-04,
- zadny klic neni v sablone duplicitne,
- `NEXT_PUBLIC_APP_ENV` ma vychozi hodnotu `local`,
- `SUPABASE_PREVIEW_SCHEMA_PREFIX` ma vychozi hodnotu `preview_`,
- `SMOKE_BASE_URL` je pritomna jako vstup pro smoke scenar F0-07.

To pomaha zachytit nekompletni nebo rozbitou sablonu konfigurace driv, nez se zmena projevi az pri spousteni aplikace nebo preview prostredi.

## Validace Supabase artefaktu

Skript `scripts/validate-supabase-artifacts.mjs` overuje, ze:

- `supabase/migrations/` obsahuje alespon jednu verzovanou SQL migraci,
- nazvy migraci pouzivaji format `YYYYMMDDHHMMSS_popis.sql`,
- prvni baseline migrace stale obsahuje klicove tabulky pro feature requesty a preview metadata,
- `supabase/seed/` obsahuje `seed.sql`,
- `seed.sql` obsahuje demo data pro Uzivatele, feature requesty a registry preview schemat.

Nejde jeste o plne spousteni migraci v CI. Cilem F0-05 je minimalni a citelna kontrola, ze repozitar nadale obsahuje konzistentni databazovy baseline pro dalsi delivery faze.

## Navazujici smoke overeni z F0-07

F0-07 doplnuje do repozitare:

- endpoint `GET /api/health` s JSON diagnostikou prostredi,
- skript `npm run smoke`, ktery pouziva `SMOKE_BASE_URL`,
- overeni homepage i health endpointu proti bezici lokalni, preview nebo production URL.

Smoke overeni zatim neni samostatnym povinnym GitHub status checkem, protoze:

- preview URL nevznika primo v GitHub Actions workflow tohoto repozitare,
- prvni end-to-end deploy se ma nejprve overit provozne nad realnym Vercel prostredim,
- F0-08 ma navazat zkusebnim delivery pruchodem pres PR a merge.

Minimalni manualni provozni postup po deployi:

1. ziskejte preview nebo production URL z Vercelu,
2. nastavte `SMOKE_BASE_URL=https://<nasazena-url>`,
3. spustte `npm run smoke`,
4. pri chybe zkontrolujte homepage diagnostiku a JSON vystup z `/api/health`.

## Nastaveni v GitHubu

Mimo repozitar je potreba v GitHub nastaveni potvrdit:

- branch protection pro `main`,
- povinne status checks odpovidajici nazvum jobu z workflow,
- zakaz primeho push do `main`,
- merge pouze pres pull request,
- vychozi `squash merge`.

Pokud budou v dalsich fazich pribyvat dalsi workflow nebo preview deployment kontroly, ma se tento dokument rozsirit tak, aby zustalo jasne, ktere status checks jsou povinne a proc.
