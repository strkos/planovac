# Supabase baseline a preview schema workflow

Tento dokument je zdrojem pravdy pro backlogovou položku **F0-04: Supabase baseline**.

Jeho cílem je:

- popsat první verzovaný databázový baseline v repozitáři,
- určit naming konvenci preview schémat ve sdíleném neprodukčním Supabase projektu,
- popsat lifecycle preview schémat včetně cleanupu,
- vysvětlit anonymizovaný snapshot produkčních dat,
- určit mechanismus stabilního mapování vybraných Uživatelů na neprodukční kontaktní údaje.

## Obsah baseline

F0-04 zavádí do repozitáře tyto databázové artefakty:

- `supabase/migrations/20260331120000_f0_04_supabase_baseline.sql` - první verzovaná migrace,
- `supabase/seed/seed.sql` - demo dataset pro lokální vývoj a další neprodukční ověření.

Migrace zakládá:

- doménové tabulky `app_users`, `events`, `tasks` a `task_assignments`,
- technickou tabulku `feature_requests` pro navazující workflow rozvoje aplikace,
- schéma `app_private` pro provozní metadata potřebná k preview snapshotům,
- tabulky `app_private.preview_schema_registry` a `app_private.preview_contact_identity_map`.

## Datový baseline

### Doménové tabulky

První baseline drží pouze minimum potřebné pro navazující etapy:

- **Uživatel**
  - jméno,
  - email,
  - telefon,
  - role `admin` nebo `clen`,
  - stav `active` nebo `inactive`.
- **Akce**
  - název,
  - datum a čas,
  - místo,
  - popis,
  - typ akce.
- **Úkol**
  - název,
  - popis,
  - typ `role` nebo `work`,
  - požadovaný počet lidí,
  - volitelná vazba na Akci.
- **Přiřazení**
  - vazba na Uživatele a Úkol,
  - typ `main` nebo `substitute`,
  - stav `pending`, `confirmed` nebo `rejected`,
  - informace, kdo přiřazení vytvořil.

### Provozní tabulky

Schéma `app_private` zůstává technické a neslouží jako uživatelský modul. Jeho role je:

- evidovat vznik preview schémat,
- držet jejich stav a expirační informace,
- evidovat stabilní mapování vybraných produkčních Uživatelů na neprodukční identitu.

## Naming konvence preview schémat

Preview schémata vznikají ve **sdíleném neprodukčním Supabase projektu**.

Výchozí naming konvence je:

```text
preview_<identifikator>
```

Preferovaný identifikátor je:

1. číslo pull requestu,
2. pokud není k dispozici, jiný stabilní identifikátor změny.

Praktický příklad:

```text
preview_128
preview_451
```

Prefix je konfigurovatelný přes:

```dotenv
SUPABASE_PREVIEW_SCHEMA_PREFIX=preview_
```

Tato hodnota má zůstat neveřejná a řízená na serverové straně, aby klientská část aplikace neobsahovala provozní rozhodnutí o databázových schématech.

## Lifecycle preview schématu

Každé preview schéma má projít tímto životním cyklem:

1. změna získá stabilní identifikátor, přednostně PR číslo,
2. ve sdíleném neprodukčním projektu vznikne schéma `preview_<identifikator>`,
3. do `app_private.preview_schema_registry` se uloží metadata o vzniku schématu,
4. do preview schématu se nahraje anonymizovaný snapshot produkčních dat,
5. preview aplikace používá výhradně toto schéma,
6. po merge nebo po zavření PR bez merge se schéma odstraní,
7. pokud standardní cleanup selže, schéma se odstraní expiračním fallbackem.

### Metadata preview schématu

Tabulka `app_private.preview_schema_registry` drží minimálně:

- `schema_name`,
- `source_identifier`,
- `source_number`,
- `source_branch_ref`,
- `cleanup_status`,
- `snapshot_taken_at`,
- `expires_at`,
- auditní časová razítka a případný důvod cleanupu.

Stavy jsou:

- `active`,
- `cleanup_pending`,
- `cleaned`,
- `expired`.

### Cleanup pravidla

Preview schéma se uklízí ve třech situacích:

- po merge pull requestu,
- po uzavření pull requestu bez merge,
- při dosažení `expires_at`, pokud selhal běžný cleanup.

Expirační fallback chrání sdílený neprodukční projekt před dlouhodobě opuštěnými schématy.

## Anonymizovaný snapshot produkčních dat

Preview nepoužívá plný surový snapshot produkčních dat.

Při tvorbě snapshotu platí tato pravidla:

- produkční kontaktní údaje Uživatelů se do preview nepřenášejí v původní podobě,
- minimálně `full_name`, `email` a `phone` jsou anonymizované nebo nahrazené neprodukční hodnotou,
- preview data zůstávají uvnitř konkrétního schématu `preview_<identifikator>`,
- změny provedené v preview se nikdy nevracejí do produkce.

### Co se anonymizuje vždy

Ve F0-04 je povinné anonymizovat alespoň:

- jméno Uživatele,
- email Uživatele,
- telefon Uživatele.

Obsah popisů Akcí nebo Úkolů může zůstat zachovaný, pokud neobsahuje osobní údaje. Pokud by produktová data obsahovala další citlivé identifikátory, musí se při implementaci snapshotu rozšířit i anonymizační pravidla.

## Stabilní mapování vybraných Uživatelů

Pro vybrané Uživatele nestačí náhodná anonymizace, protože při testování je užitečné, aby se stejná testovací osoba zobrazovala konzistentně napříč více preview verzemi.

Proto F0-04 zavádí tabulku:

```text
app_private.preview_contact_identity_map
```

Tato tabulka se vede v **produkční databázi** a funguje jako řízená technická konfigurace.

### Uložené informace

Pro každý mapovaný produkční účet se eviduje:

- `production_user_id`,
- `preview_full_name`,
- `preview_email`,
- `preview_phone`,
- `is_active`,
- poznámka a auditní časová razítka.

### Použití při tvorbě snapshotu

Při generování anonymizovaného snapshotu:

1. se zkopírují strukturální data potřebná pro preview,
2. pro každého Uživatele se ověří, zda existuje aktivní záznam v `app_private.preview_contact_identity_map`,
3. pokud existuje, použijí se předem určené neprodukční kontaktní údaje,
4. pokud neexistuje, použije se standardní anonymizační strategie,
5. výsledná preview data se zapíší pouze do cílového preview schématu.

### Kteří Uživatelé mají mít stabilní mapování

Stabilní mapování má být rezervované hlavně pro:

- administrátory,
- klíčové organizátory,
- referenční testovací identity používané ve smoke a regresních scénářích.

Nejde o požadavek, aby každý produkční Uživatel měl vlastní fixní preview identitu.

## Seed data pro lokální vývoj

Soubor `supabase/seed/seed.sql` zavádí malý demo dataset:

- několik Uživatelů,
- dvě ukázkové Akce,
- navázané Úkoly,
- ukázková Přiřazení,
- jeden vzorový Feature request,
- dvě stabilní preview identity v `app_private.preview_contact_identity_map`.

Tento seed slouží pro:

- lokální vývoj,
- budoucí smoke ověření,
- rychlé ruční ověření navazujících iterací.

Nejde o produkční snapshot a nesmí být zaměňován za skutečný preview export z produkce.

## Vazba na další dokumentaci

F0-04 rozšiřuje dřívější dokumenty takto:

- [Konfigurace prostředí](konfigurace-prostredi.md) zůstává zdrojem pravdy pro proměnné a správu secretů,
- [Lokální start projektu](lokalni-start.md) popisuje lokální práci s repozitářem,
- [Základní zadání](../zadani-zakladni.md) a [Use journeys](../scenare-pouziti.md) zůstávají zdrojem pravdy pro doménu a očekávané chování preview režimu.

## Co F0-04 ještě záměrně neřeší

Tato etapa zatím neobsahuje:

- plně automatizované spouštění migrací přes CI,
- produkční nebo preview deployment workflow,
- hotovou implementaci snapshot orchestrace,
- aplikační napojení na Supabase klienta,
- hotovou autentizační politiku pro přihlášeného Uživatele.

Tyto kroky patří hlavně do navazujících etap F0-05, F0-06 a F1.
