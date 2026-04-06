# Vercel integrace

Tento dokument je zdrojem pravdy pro backlogovou polozku **F0-06: Vercel integrace**.

Jeho cilem je:

- popsat, co ma byt commitnute primo v repozitari pro Vercel deployment,
- uzavrit mapovani `preview` a `production` prostredi,
- zapsat konkretni matici environment variables pro Vercel,
- popsat minimalni rollback a diagnostiku bez nutnosti dalsi infrastruktury.

## Co je soucasti repozitare

F0-06 commitnute artefakty:

- `vercel.json` - zakladni staticka konfigurace projektu pro Vercel,
- `scripts/validate-vercel-config.mjs` - validace commitnute Vercel konfigurace v CI,
- rozsirena diagnostika v `app/page.tsx` a `lib/env.ts`,
- tento runbook pro nastaveni preview a production deploymentu.

## Co zustava mimo repozitar

Nektere kroky nelze spolehlive uzavrit jen commitem, protoze patri do Vercel dashboardu:

- propojeni repozitare s konkretnim Vercel projektem,
- volba produkcni vetve,
- zalozeni preview a production environment variables,
- zapnuti volby **Automatically expose System Environment Variables**,
- pripadne navazani vlastni produkcni domeny.

Repozitar proto obsahuje:

- konvenci a validaci toho, co ma byt nastaveno,
- diagnostiku pro rychle odhaleni spatneho mapovani,
- dokumentovany postup pro preview a production prostredi.

## Repo-side konfigurace Vercelu

Soubor `vercel.json` udrzuje minimalni, ale deterministicky zaklad:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "npm ci",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  }
}
```

Tato konfigurace zajistuje, ze:

- Vercel pouziva potvrzeny Next.js preset,
- instalace na Vercelu odpovida `package-lock.json`,
- build i lokalni Vercel dev rezim pouzivaji stejne npm skripty jako zbytek repozitare,
- branch `main` neni omylem vyrazena z automatickych deploymentu.

Poznamka:

- produkcni branch jako takovou repo nevnucuje, protoze je to nastaveni konkretniho Vercel projektu,
- `git.deploymentEnabled` zde slouzi jen jako ochrana proti nechtenemu vypnuti deploymentu pro `main`.

## Pozadovane Vercel project settings

Po propojeni repozitare s Vercel projektem ma byt nastaveno:

1. **Production Branch**
   - `main`
2. **Git integration**
   - preview deployment pro kazdy relevantni pull request nebo branch push mimo `main`
3. **Automatically expose System Environment Variables**
   - zapnuto

Posledni bod je dulezity, protoze aplikace vyuziva systemove promene pro diagnostiku:

- `VERCEL_ENV`
- `VERCEL_TARGET_ENV`
- `VERCEL_URL`
- `VERCEL_BRANCH_URL`
- `VERCEL_PROJECT_PRODUCTION_URL`
- `VERCEL_GIT_COMMIT_SHA`
- `VERCEL_GIT_COMMIT_REF`

## Mapovani prostredi

Kanonicne plati:

- `main` -> **production**
- pull request a ostatni neprodukci vetve -> **preview**

Lokalni prostredi zustava oddelene:

- lokalni vyvoj -> **local**

V aplikaci ma stale prednost explicitni `NEXT_PUBLIC_APP_ENV`. To umoznuje:

- lokalne simulovat preview bez Vercelu,
- mit citelny badge a diagnostiku i mimo Vercel,
- odhalit rozpor mezi explicitni hodnotou a systemovym prostredim Vercelu.

## Matice environment variables pro Vercel

### Preview

Do Vercel **Preview** environment nastavte minimalne:

| Promenna | Hodnota | Poznamka |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | `preview` | Povinna explicitni identifikace prostredi. |
| `NEXT_PUBLIC_APP_BASE_URL` | preview URL aktualniho deploymentu | Ma odpovidat URL, na ktere preview opravdu bezi. |
| `NEXT_PUBLIC_SUPABASE_URL` | neprodukci Supabase URL | Preview nesmi mirit do produkcniho projektu bez vyslovneho duvodu. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | neprodukci anon key | Verejna cast preview konfigurace. |
| `SUPABASE_SERVICE_ROLE_KEY` | neprodukci service role key | Neverejna cast preview konfigurace. |
| `SUPABASE_PREVIEW_SCHEMA_PREFIX` | `preview_` | Prefix pro schema-per-feature. |
| `SMOKE_BASE_URL` | preview URL | Pro navazujici smoke kontroly. |

### Production

Do Vercel **Production** environment nastavte minimalne:

| Promenna | Hodnota | Poznamka |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | `production` | Povinna explicitni identifikace prostredi. |
| `NEXT_PUBLIC_APP_BASE_URL` | produkcni domena | Ma odpovidat realne produkcni URL. |
| `NEXT_PUBLIC_SUPABASE_URL` | produkcni Supabase URL | Produkce nesmi pouzivat preview data. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | produkcni anon key | Verejna cast produkcni konfigurace. |
| `SUPABASE_SERVICE_ROLE_KEY` | produkcni service role key | Neverejna cast produkcni konfigurace. |
| `SUPABASE_PREVIEW_SCHEMA_PREFIX` | `preview_` | Konzistentni naming pro navazujici preview workflow. |
| `SMOKE_BASE_URL` | produkcni URL | Pro navazujici smoke kontroly. |

## Doporucene hodnoty pro URL promene

Vercel umi automaticky dodat systemove hostname, ale konkretni mapovani `NEXT_PUBLIC_APP_BASE_URL` a `SMOKE_BASE_URL` je potreba potvrdit per project.

Doporuceni:

- **preview**
  - nastavte hodnotu odpovidajici branch nebo deployment URL podle zvoleneho provozniho modelu,
  - po deployi overte na strance aplikace, ze `Zakladni URL` a `Deployment URL` davaji smysl pro preview.
- **production**
  - nastavte kanonickou produkcni domenu,
  - pokud aplikace bezi jen na `*.vercel.app`, pouzijte produkcni hostname daneho projektu.

Pokud project settings neumi nebo neumite bezpecne spravovat dynamicke odvozeni preview URL, je prijatelne pouzit:

- `NEXT_PUBLIC_APP_BASE_URL` jako stabilni preview branch URL,
- a runtime diagnostiku z `VERCEL_URL` a `VERCEL_BRANCH_URL` jako zdroj pravdy pro konkretni deployment.

## Jak overit spravne mapovani

Po deploymentu otevrete domovskou stranku aplikace a zkontrolujte:

1. badge prostredi,
2. `Zdroj detekce`,
3. `Zakladni URL`,
4. `Deployment URL`,
5. `Produkci URL projektu`,
6. `Git ref`,
7. sekci **Vercel integrace**.

Bezpecny stav:

- preview ukazuje `preview`,
- production ukazuje `production`,
- preview nepouziva produkcni base URL,
- production nepouziva preview host,
- v sekci **Kontrola mapovani** neni chyba.

## Smoke scenar F0-07

F0-07 navazuje na vizualni diagnostiku i strojove citelnym endpointem:

- `GET /api/health` vraci JSON s poli `ok`, `status`, `environment`, `commitSha`, `baseUrl` a `checks`,
- pri konzistentnim nasazeni vraci HTTP `200`,
- pri nalezene nekonzistenci vraci HTTP `503`, aby slo problem odhalit i bez otevreni homepage.

Minimalni smoke scenar po preview nebo production deployi:

1. nastavte `SMOKE_BASE_URL` na URL nasazene aplikace,
2. spustte `npm run smoke`,
3. overte, ze skript uspesne zavola `/api/health`,
4. overte, ze homepage obsahuje F0-07 diagnostiku a odkaz na zdravotni endpoint.

Smoke skript zamerne neprovadi zapis do databaze ani autentizovane kroky. V teto etape overuje:

- dostupnost bezici aplikace,
- konzistenci runtime diagnostiky prostredi,
- dohledatelnost commitu a base URL,
- pritomnost hlavni diagnosticke plochy v UI.

## Chovani aplikace pri nekonzistenci

Diagnostika v aplikaci umi zachytit zejmena:

- rozpor mezi `NEXT_PUBLIC_APP_ENV` a `VERCEL_ENV` nebo `VERCEL_TARGET_ENV`,
- preview s base URL smerujici na produkcni domenu,
- production s base URL smerujici na vercel preview host,
- chybejici `NEXT_PUBLIC_APP_BASE_URL` v preview nebo production.

To neumozni automaticky opravit projektova nastaveni, ale zkracuje cas potrebny k odhaleni chybne konfigurace.

## Minimalni rollback postup

F0-06 zavadi minimalni rollback pro aplikacni vrstvu:

1. V Vercelu identifikujte posledni zdravy deployment podle commitu a URL.
2. Pro aplikacni rollback znovu promovte nebo redeployte posledni funkcni produkcni deployment.
3. Pokud je problem v konfiguraci:
   - opravte environment variables,
   - vytvorte novy deployment,
   - zkontrolujte diagnostickou stranku.
4. Pokud je problem v databazove zmene, postupujte podle navazujiciho provozniho postupu pro migrace a preview schema cleanup.

Tento dokument zamerne neresi automatizovane rollbacky databaze. To patri do navazujicich etap, kde uz bude zavedena plnejsi migracni a smoke disciplina.

## Vazba na dalsi etapy

- **F0-07** doplnuje realny smoke scenar nad preview a production deploymentem,
- **F0-08** overi zkusebni delivery pruchod pres PR a merge,
- **F1** doplni autentizaci a navazujici secret management.
