# GitHub CI

Tento dokument je zdrojem pravdy pro backlogovou polozku **F0-05: GitHub CI**.

Jeho cilem je:

- popsat workflow spoustene pro pull requesty a zmeny v `main`,
- vymezit minimalni povinne status checks pro merge do `main`,
- zapsat, jake validace repo aktualne provadi nad konfiguraci a databazovymi artefakty.

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

## Validace `.env.example`

Skript `scripts/validate-env-example.mjs` overuje, ze:

- `.env.example` obsahuje vsechny klice potrebne od F0-03 a F0-04,
- zadny klic neni v sablone duplicitne,
- `NEXT_PUBLIC_APP_ENV` ma vychozi hodnotu `local`,
- `SUPABASE_PREVIEW_SCHEMA_PREFIX` ma vychozi hodnotu `preview_`.

To pomaha zachytit nekompletni nebo rozbitou sablonu konfigurace driv, nez se zmena projevi az pri spousteni aplikace nebo preview prostredi.

## Validace Supabase artefaktu

Skript `scripts/validate-supabase-artifacts.mjs` overuje, ze:

- `supabase/migrations/` obsahuje alespon jednu verzovanou SQL migraci,
- nazvy migraci pouzivaji format `YYYYMMDDHHMMSS_popis.sql`,
- prvni baseline migrace stale obsahuje klicove tabulky pro feature requesty a preview metadata,
- `supabase/seed/` obsahuje `seed.sql`,
- `seed.sql` obsahuje demo data pro Uzivatele, feature requesty a registry preview schemat.

Nejde jeste o plne spousteni migraci v CI. Cilem F0-05 je minimalni a citelna kontrola, ze repozitar nadale obsahuje konzistentni databazovy baseline pro dalsi delivery faze.

## Nastaveni v GitHubu

Mimo repozitar je potreba v GitHub nastaveni potvrdit:

- branch protection pro `main`,
- povinne status checks odpovidajici nazvum jobu z workflow,
- zakaz primeho push do `main`,
- merge pouze pres pull request,
- vychozi `squash merge`.

Pokud budou v dalsich fazich pribyvat dalsi workflow nebo preview deployment kontroly, ma se tento dokument rozsirit tak, aby zustalo jasne, ktere status checks jsou povinne a proc.
