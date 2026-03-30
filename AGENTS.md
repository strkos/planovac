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

- Nevymýšlej konkrétní framework, databázovou technologii, hosting ani API kontrakt, pokud to uživatel výslovně nechce.
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
