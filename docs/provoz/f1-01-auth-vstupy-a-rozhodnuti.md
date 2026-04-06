# F1-01: Auth vstupy a rozhodnutí

Tento dokument uzavírá backlogovou položku **F1-01: Auth vstupy a rozhodnutí** pro fázi 1.

Jeho cílem je:

- potvrdit první auth směr pro aplikaci,
- zapsat redirect URL pro `local`, `preview` a `production`,
- rozhodnout režim vytváření prvních účtů,
- potvrdit zdroj role `admin` a `člen`,
- popsat bootstrap testovacích identit a základní provozní vlastnictví.

## Potvrzený auth model pro fázi 1

Pro první implementaci platí tento závazný směr:

- autentizace běží přes **Supabase Auth**,
- nepoužívá se externí poskytovatel identity,
- první přihlášení používá **email + magic link**,
- po úspěšném dokončení callbacku má být výchozí návrat do chráněné části na `/app`,
- při chybě, expirovaném nebo již použitém magic linku se Uživatel vrací do veřejné zóny.

F1-01 tím záměrně ještě neimplementuje samotný login formulář ani callback route. Uzavírá ale vstupy, na kterých má navazovat F1-02 až F1-04.

## Redirect URL

Pro Supabase Auth musí být před implementací login toku připravené minimálně tyto callback URL:

| Prostředí | Base URL aplikace | Callback URL |
| --- | --- | --- |
| `local` | `http://localhost:3000` | `http://localhost:3000/auth/callback` |
| `preview` | `https://<preview-host>` | `https://<preview-host>/auth/callback` |
| `production` | `https://<produkční-doména>` | `https://<produkční-doména>/auth/callback` |

Současně platí:

- commitovaná výchozí hodnota `SUPABASE_AUTH_REDIRECT_PATH` je `/auth/callback`,
- pokud bude v další iteraci zavedena samostatná chybová route, musí se její návratové chování dopsat i sem,
- základní fallback při auth chybě zůstává návrat do veřejné zóny na `/`.

## Režim vytváření prvních účtů

Pro fázi 1 je potvrzen tento minimální provozní režim:

- první účty se zakládají **řízeně** přímo v Supabase Auth,
- samoobslužná registrace se v této fázi nepovoluje,
- přihlášení je určeno jen pro předem připravené identity,
- odpovědnost za vytvoření účtů má správce daného Supabase projektu.

Důvod:

- zůstává úzký rozsah první auth iterace,
- nevzniká předčasně veřejná registrace,
- lze opakovatelně ověřovat `admin`, `člen` i unauthorized scénář.

## Zdroj role `admin` a `člen`

Pro fázi 1 je potvrzený tento směr:

- zdrojem pravdy pro aplikační oprávnění není klientská session,
- role se čte **server-side** z minimální access vrstvy v Supabase,
- bootstrap identifikátorem je normalizovaný email z ověřené auth identity,
- po prvním úspěšném loginu je vhodné uložit i vazbu na `auth_user_id`, ale není to podmínka F1-01.

Minimální access vrstva má v navazující implementaci obsahovat alespoň:

- normalizovaný email,
- roli `admin` nebo `člen`,
- příznak aktivního přístupu,
- volitelně navázaný `auth_user_id`.

Tento dokument potvrzuje směr, nikoliv finální název tabulky nebo finální databázovou migraci. To patří do navazující implementace role a autorizace.

## Bootstrap testovacích identit

Pro každé prostředí mají být připravené tyto ověřovací scénáře:

1. testovací identita s rolí `admin`,
2. testovací identita s rolí `člen`,
3. unauthorized scénář s autentizovanou identitou bez aktivního access záznamu.

Pravidla bootstrapu:

- identity jsou účelové, ne osobní účty implementátorů nebo reviewerů,
- skutečný přístup k mailboxu nebo magic linku se nikdy neukládá do gitu,
- v neveřejném provozním seznamu se vede alespoň:
  - email nebo jiný provozní identifikátor účtu,
  - očekávaná role,
  - prostředí, kde má být účet použitelný,
- access vrstva musí mít odpovídající záznamy pro `admin` a `člen`,
- unauthorized scénář je validní i bez samostatné třetí role; stačí chybějící nebo neaktivní access záznam.

## Vlastnictví konfigurace

Dokud nejsou potvrzení konkrétní jmenovití vlastníci, platí toto rozdělení odpovědnosti:

- **lokální `.env.local`** spravuje každý vývojář nebo agent ve svém prostředí,
- **preview a production veřejné proměnné** spravuje Vercel environment konfigurace,
- **Supabase Auth nastavení** jako email login, redirect allowlist a magic link šablony spravuje správce daného Supabase projektu,
- **neveřejný seznam testovacích identit** zůstává mimo git a spravuje ho stejná provozní role, která spravuje dané auth prostředí,
- **neveřejné klíče** se drží v odpovídajícím prostředí tak, aby preview a production nesdílely tajné hodnoty bez výslovného důvodu.

## Co je commitované v repozitáři

F1-01 v repozitáři přímo doplňuje:

- validaci `SUPABASE_AUTH_REDIRECT_PATH` v `.env.example`,
- runtime diagnostiku auth vstupů na homepage,
- rozšířený payload `/api/health` o sekci `auth`,
- tento provozní dokument jako zdroj pravdy pro rozhodnutí F1-01.

## Výstup F1-01

F1-01 lze považovat za uzavřené, pokud platí:

- [x] Supabase Auth bez externího poskytovatele identity je potvrzený jako první auth vrstva,
- [x] email + magic link je potvrzený jako první přihlašovací tok,
- [x] redirect URL jsou zapsané pro `local`, `preview` a `production`,
- [x] režim vytváření prvních účtů je rozhodnutý jako řízený bootstrap v Supabase Auth,
- [x] zdroj role `admin` a `člen` je potvrzený jako server-side access lookup v Supabase,
- [x] bootstrap testovacích identit a unauthorized scénáře je zdokumentovaný,
- [x] je popsané minimální vlastnictví auth konfigurace mezi `.env.local`, Vercel a Supabase.
