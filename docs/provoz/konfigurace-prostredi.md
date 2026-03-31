# Konfigurace prostředí

Tento dokument je zdrojem pravdy pro backlogovou položku **F0-03: Konfigurace prostředí a secretů**.

Jeho cílem je:

- popsat rozlišení prostředí `local`, `preview` a `production`,
- sepsat proměnné prostředí používané aplikační kostrou,
- určit, které hodnoty jsou veřejné a které musí zůstat neveřejné,
- popsat, kde se mají jednotlivé hodnoty spravovat.

## Model prostředí

Repozitář v této fázi rozlišuje tři režimy:

- **local** - lokální vývoj na stanici vývojáře nebo agenta,
- **preview** - testovací nasazení navázané na pull request,
- **production** - ostré nasazení po merge do `main`.

Aplikace má prostředí rozpoznávat přednostně pomocí explicitní proměnné `NEXT_PUBLIC_APP_ENV`. Pokud není nastavena, může si vynutit fallback z platformních proměnných, zejména `VERCEL_ENV`.

Toto pravidlo je důležité proto, aby:

- šlo prostředí čitelně zobrazit v UI,
- bylo možné lokálně simulovat preview režim bez závislosti na Vercelu,
- bylo menší riziko záměny preview a production konfigurace.

## Matice proměnných prostředí

| Proměnná | Typ | Viditelnost | Povinná od | Použití | Správa |
| --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | `local \| preview \| production` | veřejná | F0-03 | Explicitní identifikace prostředí v UI i aplikační logice. | lokální `.env.local`, Vercel env vars |
| `NEXT_PUBLIC_APP_BASE_URL` | URL | veřejná | F0-03 | Kanonická URL běžící aplikace pro odkazy, diagnostiku a budoucí smoke ověření. | lokální `.env.local`, Vercel env vars |
| `VERCEL_ENV` | `development \| preview \| production` | platformní | F0-03 | Fallback detekce prostředí při běhu na Vercelu. | nastavuje Vercel |
| `VERCEL_URL` | hostname | platformní | F0-03 | Diagnostická informace o aktuálním preview nebo deployment hostu. | nastavuje Vercel |
| `VERCEL_GIT_COMMIT_SHA` | SHA | platformní | F0-03 | Dohledatelnost běžící verze v preview nebo production. | nastavuje Vercel |
| `GITHUB_SHA` | SHA | CI | F0-03 | Fallback identifikace commitu mimo Vercel runtime. | nastavuje GitHub Actions |
| `NEXT_PUBLIC_SUPABASE_URL` | URL | veřejná | F0-04 | Klientská komunikace s veřejným Supabase API po doplnění autentizace a datové vrstvy. | lokální `.env.local`, Vercel env vars |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | token | veřejná | F0-04 | Veřejný anon klíč pro klientské napojení na Supabase. | lokální `.env.local`, Vercel env vars |
| `SUPABASE_SERVICE_ROLE_KEY` | token | neveřejná | F0-04 | Serverové operace, migrace, seed a práce s preview snapshoty. Nikdy nesmí být vystavena klientovi. | lokální neveřejný `.env.local`, GitHub secrets, Vercel env vars |
| `SUPABASE_PREVIEW_SCHEMA_PREFIX` | string | neveřejná | F0-04 | Prefix pro naming preview schémat, očekávaně `preview_`. | lokální neveřejný `.env.local`, GitHub secrets, Vercel env vars |
| `OIDC_ISSUER_URL` | URL | neveřejná | F1 | Konfigurace OIDC/OAuth poskytovatele, výchozí Supabase Auth. | lokální neveřejný `.env.local`, GitHub secrets, Vercel env vars |
| `OIDC_CLIENT_ID` | string | neveřejná | F1 | Identifikátor klienta pro přihlášení Uživatele. | lokální neveřejný `.env.local`, Vercel env vars |
| `OIDC_CLIENT_SECRET` | secret | neveřejná | F1 | Tajný klíč pro serverovou část přihlašovacího toku. | lokální neveřejný `.env.local`, GitHub secrets, Vercel env vars |

## Zásady práce s proměnnými

### Veřejné proměnné

Proměnné s prefixem `NEXT_PUBLIC_` se mohou dostat do klientského bundlu. Proto smějí obsahovat jen:

- identifikaci prostředí,
- veřejnou URL aplikace,
- případně další hodnoty, které nejsou tajné.

Do veřejných proměnných nepatří:

- service role klíče,
- klientská secret metadata,
- přístupové údaje pro administrativní operace.

### Neveřejné proměnné

Neveřejné hodnoty se v repozitáři nikdy necommitují. Lokálně patří do souboru jako `.env.local`, který zůstává ignorovaný v Gitu.

Typicky sem patří:

- serverové Supabase klíče,
- client secret pro OIDC,
- budoucí integrační tokeny pro CI nebo deployment.

### Platformní proměnné

Hodnoty jako `VERCEL_ENV`, `VERCEL_URL` nebo `GITHUB_SHA` se nespravují ručně jako produktové secrety. Jsou poskytované platformou a aplikace je používá jen jako diagnostický a fallback vstup.

## Doporučené hodnoty podle prostředí

### local

- `NEXT_PUBLIC_APP_ENV=local`
- `NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000`

Lokální prostředí je výchozí pro vývoj a má být snadno opakovatelné bez napojení na preview deployment.

### preview

- `NEXT_PUBLIC_APP_ENV=preview`
- `NEXT_PUBLIC_APP_BASE_URL=https://<preview-host>`

Preview musí být jasně oddělené od produkce v UI i konfiguraci. Pro databázi má v navazující fázi používat sdílený neprodukční Supabase projekt a schéma `preview_<identifikator>`.

### production

- `NEXT_PUBLIC_APP_ENV=production`
- `NEXT_PUBLIC_APP_BASE_URL=https://<produkční-doména>`

Produkční prostředí nesmí používat preview data ani preview secrety.

## Vlastnictví a místa správy

V této fázi ještě nejsou jmenovitě určení vlastníci produkčního Vercel a Supabase projektu. Do doby jejich potvrzení platí tato pravidla:

- **lokální hodnoty** spravuje každý vývojář nebo agent ve svém neveřejném `.env.local`,
- **preview a production veřejné proměnné** se mají spravovat ve Vercel environment variables,
- **CI-only neveřejné hodnoty** se mají spravovat v GitHub secrets,
- **Supabase integrační hodnoty** se mají držet v odpovídajícím prostředí tak, aby preview a production neměly sdílené tajné klíče bez jasného důvodu.

Jakmile budou potvrzeni vlastníci prostředí, má se tento dokument doplnit o konkrétní odpovědnost za:

- produkční secrety,
- neprodukční secrety,
- rotaci klíčů,
- incidentní změny konfigurace.

## Vazba na další fáze

F0-03 zavedlo základ konfigurace prostředí a F0-04 na něj navázalo databázovým baseline:

- **F0-04** doplnilo první Supabase migrace, seed data, preview schema workflow a samostatný dokument [Supabase baseline a preview schema workflow](supabase-baseline-a-preview-schema.md),
- **F0-05** doplní CI validace nekompletní konfigurace a databázových artefaktů,
- **F0-06** doplní konkrétní mapování proměnných do Vercel preview a production prostředí,
- **F1** doplní proměnné pro autentizaci Uživatele.
