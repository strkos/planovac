# AGENTS.md

## Účel repozitáře

Tento repozitář aktuálně obsahuje především produktovou a požadavkovou dokumentaci k projektu **planovac**, tedy aplikaci pro správu spolku.

Repozitář je v této fázi primárně dokumentační:

- `README.md` - stručný vstupní bod projektu
- `docs/zadani-zakladni.md` - základní specifikace domény, workflow a práce s preview prostředím
- `docs/scenare-pouziti.md` - use journeys, role uživatelů a nefunkční očekávání

Nepředpokládej, že někde mimo tyto soubory existuje hotová implementace. Pokud v repozitáři nejsou uvedeny konkrétní technické detaily, považuj je za **nerozhodnuté**, ne za implicitně dané.

## Hlavní zdroje pravdy

Při změnách ber jako kanonické tyto dokumenty:

1. `docs/zadani-zakladni.md`
   - definuje cíl aplikace, hlavní entity, workflow feature requestů a model preview dat
2. `docs/scenare-pouziti.md`
   - definuje role, očekávané chování systému, detailní use journeys a provozní očekávání

Pokud změna zasahuje jak obecnou specifikaci, tak chování z pohledu uživatele, promítni ji do obou dokumentů tak, aby si neodporovaly.

## Jazyk a styl psaní

- Pro dokumentaci preferuj **češtinu**, pokud uživatel výslovně nepožaduje angličtinu.
- Udržuj jednotnou terminologii napříč soubory.
- Piš srozumitelně pro organizátory, běžné členy i budoucí implementační agenty.
- Upřednostňuj strukturovaný Markdown: nadpisy, seznamy a krátké odstavce místo dlouhé souvislé prózy.

## Potvrzené technologické volby

Následující technologická rozhodnutí jsou v tomto repozitáři již potvrzená a další agenti je mají považovat za závazná, nikoli za otevřené návrhy:

- Hosting frontendu: **Vercel.com**
- Uložení dat: **Supabase.com**
- Autentizace: **Supabase Auth**, přičemž výchozí přihlášení pro první verzi používá **email + magic link** bez externího poskytovatele identity
- Vývoj a spolupráce: **GitHub**, a to včetně samoobslužného rozvoje aplikace

Pokud budou budoucí dokumenty popisovat technickou architekturu, deployment nebo vývojový workflow, musí z těchto voleb vycházet.

## Kanonická terminologie domény

Následující pojmy zachovej, pokud uživatel výslovně nepožádá o změnu domény:

- **Uživatel**
- **Akce**
- **Úkol**
- **Přiřazení**
- **Feature request**
- **Preview verze**

Důležitá pravidla, která už dnes v dokumentaci existují:

- Úkol může reprezentovat roli i pracovní činnost.
- Přiřazení rozlišuje `main` a `substitute`.
- Stav přiřazení může být `pending`, `confirmed` nebo `rejected`.
- Rozvoj nové funkcionality probíhá v krocích:
  1. návrh funkce
  2. AI implementace
  3. preview verze
  4. testování
  5. hlasování
  6. nasazení
- Preview data jsou izolovaná přístupem **schema-per-feature** a nesmí se vracet zpět do produkčních dat.

## Pokyny pro budoucí agenty

### Při úpravách požadavků

- `docs/zadani-zakladni.md` drž jako stabilní specifikaci entit, workflow a systémových pravidel.
- `docs/scenare-pouziti.md` drž jako popis rolí, use journeys a očekávaného chování z pohledu uživatelů.
- Při přidání nové funkcionality vždy popiš:
  - kdo ji používá,
  - jaký problém řeší,
  - jak mění stávající workflow,
  - zda zasahuje do preview, testování nebo nasazení.

### Při doplňování implementačních detailů

- Nevymýšlej nové konkrétní frameworky, databázové technologie, hosting nebo API kontrakty, pokud to uživatel výslovně nechce.
- Respektuj už potvrzené technologické volby v tomto souboru: Vercel pro frontend hosting, Supabase pro data, Supabase Auth s výchozím přihlášením přes email + magic link bez externího poskytovatele identity a GitHub jako vývojovou platformu.
- Pokud je potřeba navrhnout technické řešení, označ ho jasně jako **návrh** nebo ho odděl do samostatného návrhového dokumentu.

### Při přidávání nových souborů

- Produktovou dokumentaci ukládej přednostně do `docs/`.
- Pro uživatelsky nebo produktově orientované dokumenty preferuj popisné české názvy souborů.
- Kořen repozitáře udržuj čistý; root-level soubory přidávej jen tehdy, když slouží celému repozitáři.

## Kontrolní seznam konzistence

Před dokončením změny ověř:

- že je terminologie konzistentní ve všech upravených dokumentech,
- že názvy rolí a kroky workflow stále odpovídají zdrojovým dokumentům,
- že preview režim zůstává jasně oddělený od produkčního režimu,
- že si vysoká specifikace a use journeys neodporují,
- že nové předpoklady jsou výslovně označené jako návrhy.

## Cursor Cloud specific instructions

### Service overview

**planovac** is currently a minimal Next.js 16 + TypeScript scaffold (App Router). There is one runnable service — the Next.js dev server. No database connection, auth, or API routes are wired up yet; the Supabase SQL migrations/seeds exist as documentation artifacts for future phases.

### Quick-start commands

Standard commands are documented in the README and `docs/provoz/lokalni-start.md`:

- `npm install` — install dependencies
- `cp .env.example .env.local` — create local env config (only needed once; already done in VM snapshot)
- `npm run dev` — start dev server on `http://localhost:3000`
- `npm run lint` — ESLint
- `npm run build` — production build

### Non-obvious caveats

- The project uses `package-lock.json` (npm). Do **not** use pnpm or yarn.
- `.env.local` must exist before `npm run dev` or `npm run build` (copy from `.env.example`). The file is git-ignored, so it will not be present after a fresh clone — the update script handles this.
- There are no automated tests yet (`tests/smoke/` contains only a placeholder README).
- The `supabase/` directory has SQL files but no `config.toml` and no Supabase CLI integration — these are purely versioned migration artifacts.
