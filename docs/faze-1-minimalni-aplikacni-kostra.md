# Detailní implementační plán: Fáze 1 - Minimální aplikační kostra

## Účel dokumentu

Tento dokument rozpracovává **Fázi 1** z [plánu implementace](plan-implementace.md) do podoby, podle které lze připravit konkrétní backlog, navázat na dokončenou delivery základnu z fáze 0 a dodat první opravdu použitelnou verzi aplikace.

Nejde ještě o finální architekturu celé domény. Dokument popisuje:

- co má být ve fázi 1 skutečně dodáno,
- co naopak ještě zůstává mimo rozsah,
- v jakém pořadí mají práce probíhat,
- jaké artefakty a rozhodnutí musí vzniknout,
- jak poznat, že je fáze 1 opravdu uzavřená.

## Návaznost na kanonické dokumenty

Tento plán vychází z těchto závazných podkladů:

- [Základní zadání](zadani-zakladni.md)
- [Use journeys a uživatelské požadavky](scenare-pouziti.md)
- [Návrh implementačního plánu](plan-implementace.md)
- [Detailní implementační plán: Fáze 0 - Základ repozitáře a delivery pipeline](faze-0-zaklad-repozitare-a-delivery-pipeline.md)

Při implementaci musí zůstat zachované zejména tyto principy:

- frontend je hostovaný na **Vercel.com**,
- data jsou uložená v **Supabase.com**,
- autentizace používá **OIDC/OAuth** s výchozím poskytovatelem **Supabase**,
- vývoj a automatizace probíhají přes **GitHub**,
- preview a produkční režim jsou zřetelně oddělené v konfiguraci i v UI,
- preview data zůstávají izolovaná od produkčních dat.

## Vstupní stav do fáze 1

Fáze 1 nenavazuje na prázdný repozitář. Po fázi 0 už má být k dispozici minimálně tento základ:

- minimální Next.js aplikace s App Routerem,
- lint a build v GitHub CI,
- repo-side Vercel konfigurace pro preview a production,
- základní runtime diagnostika prostředí a health endpoint,
- provozní dokumentace pro lokální start, konfiguraci prostředí a smoke ověření,
- verzované Supabase artefakty jako základ pro další databázové změny.

Hodnota fáze 1 spočívá v tom, že se tento technický základ změní na první **použitelný aplikační shell**, do kterého se Uživatel umí přihlásit a ve kterém pozná, kde se nachází a jaké části aplikace budou následovat.

## Cíl fáze 1

Na konci fáze 1 má existovat nasaditelná aplikace, která:

- umožní Uživateli přihlášení přes potvrzený OIDC/OAuth tok,
- oddělí veřejnou a chráněnou část aplikace,
- po přihlášení zobrazí základní aplikační layout a navigaci,
- udrží zřetelné odlišení `local`, `preview` a `production` režimu i v přihlášené části,
- zavede nejmenší použitelný základ oprávnění alespoň pro role `admin` a `člen`,
- připraví prázdné nebo jednoduché obrazovky pro budoucí moduly bez nutnosti hned implementovat plnou doménu.

Fáze 1 ještě nemusí dodávat plnohodnotný seznam Akcí, detail Akce ani práci s reálnými Přiřazeními. Jejím cílem je dodat stabilní vstupní bod pro všechny další uživatelské funkce.

## Rozsah fáze 1

### Co do fáze 1 patří

- integrace přihlášení a odhlášení Uživatele,
- zavedení session nebo ekvivalentního přihlášeného stavu v aplikaci,
- rozdělení aplikace na veřejnou a chráněnou zónu,
- základní aplikační layout po přihlášení,
- hlavní navigace pro budoucí moduly,
- minimální model aplikačních rolí `admin` a `člen`,
- základní autorizační guardy pro skrytí nebo zpřístupnění vybraných částí UI,
- placeholder nebo empty-state obrazovky pro budoucí moduly,
- zachování environment banneru, diagnostiky a zřetelného označení preview režimu i po přihlášení,
- provozní a vývojářská dokumentace pro lokální, preview a produkční ověření přihlášení.

### Co do fáze 1 nepatří

- plné doménové obrazovky pro seznam a detail Akcí,
- editace Akcí, Úkolů nebo Přiřazení,
- plnohodnotný workflow Feature requestů v aplikaci,
- hlasování, testovací připomínky a nasazovací workflow uvnitř UI,
- notifikace, kalendářové integrace a další provozní doplňky,
- jemnozrnný model oprávnění nad všemi budoucími entitami,
- široká automatizace databázového preview workflow nad novými doménovými tabulkami.

## Výstupy, které mají po fázi 1 existovat

Po uzavření fáze 1 mají být k dispozici minimálně tyto artefakty:

1. **Veřejný vstup do aplikace**
   - zřetelně oddělená nepřihlášená část,
   - jasná výzva k přihlášení,
   - zachovaná diagnostika prostředí a odlišení preview od production.

2. **Přihlášení a odhlášení Uživatele**
   - funkční OIDC/OAuth tok přes potvrzený Supabase setup,
   - návrat zpět do aplikace po úspěšném přihlášení,
   - srozumitelný stav při selhání nebo chybějícím oprávnění,
   - možnost bezpečně ukončit session.

3. **Chráněný aplikační shell**
   - layout pro přihlášenou část,
   - horní nebo boční navigace,
   - základní domovská stránka po přihlášení,
   - viditelná identita přihlášeného Uživatele alespoň v minimálním rozsahu.

4. **Základ oprávnění**
   - nejmenší použitelný model rolí `admin` a `člen`,
   - guardy pro chráněné routy,
   - srozumitelná reakce při nepovoleném přístupu,
   - minimálně jedna část UI viditelná pouze pro `admin`.

5. **Placeholder moduly**
   - připravené routy nebo sekce pro budoucí doménové části,
   - prázdné stavy vysvětlující, že funkcionalita bude doplněna v dalších fázích,
   - jednotný layout a navigační struktura, na kterou mohou navazovat Fáze 2 a Fáze 3.

6. **Dokumentované ověření**
   - aktualizovaný popis lokálního startu,
   - doplněná dokumentace proměnných prostředí a redirect URL,
   - minimální checklist pro ověření přihlášení v preview a produkci.

## Předpoklady a vstupy před zahájením implementace

Implementaci fáze 1 lze spustit až ve chvíli, kdy jsou dostupné tyto vstupy:

- funkční local, preview a production prostředí z fáze 0,
- nakonfigurovaný Supabase projekt pro autentizaci,
- zapsané redirect URL pro local, preview i production běh,
- známá sada proměnných prostředí potřebných pro auth integraci,
- alespoň jedna testovací identita pro roli `admin` a jedna pro roli `člen`, nebo dokumentovaný postup jejich vytvoření,
- rozhodnutí, odkud se v minimální verzi bere aplikační role Uživatele.

## Otevřená rozhodnutí, která je nutné uzavřít na začátku

Následující body nejsou v dosavadní dokumentaci uzavřené do plné implementační podoby. Proto je potřeba je na začátku fáze 1 výslovně potvrdit, aby se zbytek prací neopíral o nejasné předpoklady.

### 1. Konkrétní podoba prvního přihlášení

Potvrzené je, že autentizace bude přes **OIDC/OAuth** a výchozí identitní vrstvu poskytne **Supabase**. Před implementací je ale ještě potřeba uzavřít:

- který konkrétní provider nebo skupina providerů bude v první verzi aktivní,
- jak má vypadat první přihlašovací obrazovka,
- jak se budou řešit chybové a návratové stavy po redirectu.

Bez tohoto rozhodnutí nelze spolehlivě dokončit redirecty, testovací identity ani smoke checklist pro preview.

### 2. Zdroj aplikační role `admin` / `člen`

Fáze 1 potřebuje nejmenší možný, ale důvěryhodný model oprávnění. Je nutné potvrdit, odkud se role bere:

- zda z aplikačních dat v Supabase,
- zda z mapování navázaného na identitu po přihlášení,
- nebo z jiného řízeného server-side zdroje.

Role nemá být určována pouze klientským stavem nebo ručně skrytým prvkem v UI.

### 3. Bootstrap prvních neprodukčních identit

Je potřeba potvrdit:

- kdo založí první testovací identity,
- kde bude vedený seznam účelových neprodukčních účtů,
- jak se zajistí, aby preview a local šly ověřit bez improvizace.

Bez tohoto bodu bude i minimální kontrola přihlášení obtížně opakovatelná.

## Doporučený cílový obraz pro fázi 1

Následující část je **návrh technického směru**, který je kompatibilní se stávajícím zadáním a dává dobrý základ pro další fáze. Pokud se tým rozhodne jinak, je potřeba změnu zapsat do dokumentace.

### Veřejná a chráněná zóna

Doporučené minimální rozdělení aplikace:

- **veřejná zóna**:
  - landing nebo vstupní stránka,
  - informace o prostředí,
  - vstup do přihlášení,
- **chráněná zóna**:
  - domovská stránka po přihlášení,
  - navigace na budoucí moduly,
  - zobrazení identity a role Uživatele,
  - viditelné odlišení preview a production režimu.

Toto rozdělení má být zřetelné i ve struktuře rout a layoutů, aby se další fáze nemusely zpětně přestavovat.

### Návrh minimální informační architektury

Pro fázi 1 je vhodný například tento minimální směr:

- `/` - veřejná vstupní stránka,
- `/app` - chráněná domovská stránka po přihlášení,
- `/app/akce` - placeholder pro budoucí práci s Akcemi,
- `/app/moje-prirazeni` - placeholder pro budoucí osobní přehled,
- `/app/feature-requesty` - placeholder pro budoucí samoobslužný rozvoj aplikace,
- `/app/administrace` - minimální `admin` sekce nebo placeholder dostupný jen pro `admin`.

Nejde o závazný kontrakt URL. Je to návrh, jak už ve fázi 1 připravit čitelnou mapu aplikace.

### Minimální profil přihlášeného Uživatele

Po přihlášení má aplikace znát alespoň:

- stabilní identifikátor Uživatele,
- zobrazitelné jméno nebo fallback identifikátor,
- email, pokud je k dispozici,
- aplikační roli `admin` nebo `člen`,
- informaci, v jakém prostředí Uživatel právě pracuje.

Pokud role chybí nebo identita není validně namapovaná, aplikace má selhat bezpečně:

- nesmí omylem zpřístupnit chráněné části,
- musí zobrazit srozumitelnou informaci, co chybí,
- musí být zřejmé, že nejde o pád aplikace, ale o neúplné oprávnění.

### Pravidla pro zobrazení prostředí

Environment badge nebo banner zavedený ve fázi 0 má zůstat viditelný i po přihlášení. Minimálně má platit:

- `preview` je zřetelně odlišené od `production`,
- přihlášený Uživatel vidí, že jde o testovací prostředí,
- diagnostické informace zůstávají dohledatelné bez nutnosti otevírat interní nástroje.

### Přístup k datům v této fázi

Fáze 1 má zůstat úzká. Proto je vhodné:

- neimplementovat ještě čtení širokých doménových seznamů Akcí,
- využít pouze minimum dat potřebných pro identitu, roli a layout,
- placeholder obrazovky držet bez zbytečně předčasných datových kontraktů.

Tím se sníží riziko, že se autentizace, layout i budoucí doménové obrazovky budou rozpracovávat zároveň a navzájem si blokovat změny.

## Pracovní proudy fáze 1

Fáze 1 má být rozdělena do samostatných pracovních proudů, které lze převést na malé pull requesty nebo backlogové položky.

## Proud A: Auth integrace a session

### Cíl

Zavést první funkční přihlášení Uživatele a bezpečné ukončení session.

### Konkrétní kroky

1. Potvrdit konkrétní auth vstupy pro local, preview a production.
2. Doplnit potřebné proměnné prostředí a jejich dokumentaci.
3. Připravit veřejnou vstupní stránku s možností přihlášení.
4. Implementovat návrat do aplikace po úspěšném přihlášení.
5. Přidat odhlášení a bezpečný návrat do veřejné zóny.
6. Ošetřit selhání přihlášení, neplatný callback a chybějící konfiguraci.

### Výstupy

- funkční login a logout tok,
- popsané redirect URL,
- srozumitelné chybové stavy při neúspěchu.

### Definition of Done

- Uživatel se umí přihlásit v local i preview,
- po přihlášení je session rozpoznaná server-side nebo jiným důvěryhodným mechanismem,
- odhlášení vrátí Uživatele do veřejné zóny,
- při chybě konfigurace nevzniká tichá nebo zavádějící chyba.

## Proud B: Chráněný aplikační shell

### Cíl

Vytvořit jednotný základ pro přihlášenou část aplikace, na který mohou navazovat další fáze.

### Konkrétní kroky

1. Rozdělit layouty na veřejnou a chráněnou část.
2. Připravit domovskou stránku přihlášeného Uživatele.
3. Zavést hlavní navigaci pro budoucí moduly.
4. Zobrazit základní identitu přihlášeného Uživatele.
5. Zajistit konzistentní chování při přímém otevření chráněné routy bez přihlášení.

### Výstupy

- chráněný layout,
- jednotná navigace,
- základní dashboard nebo home po přihlášení.

### Definition of Done

- nepřihlášený Uživatel se do chráněné části nedostane,
- přihlášený Uživatel vždy vidí stejný shell a navigaci,
- shell nevytváří dojem, že už jsou hotové doménové funkce, pokud jde jen o placeholdery.

## Proud C: Minimální role a autorizace

### Cíl

Zavést nejmenší důvěryhodný model oprávnění, který odliší `admin` a `člen`.

### Konkrétní kroky

1. Potvrdit zdroj role na server-side vrstvě.
2. Zavést mapování identity na aplikační roli.
3. Omezit přístup do vybrané části UI jen pro `admin`.
4. Přidat stav pro Uživatele bez platné role nebo bez přiřazeného přístupu.
5. Dopsat popis role modelu do dokumentace.

### Výstupy

- role `admin` a `člen`,
- minimální authorizační guardy,
- srozumitelná unauthorized obrazovka nebo stav.

### Definition of Done

- role neovlivňuje jen vzhled, ale i skutečný přístup do chráněných částí,
- `admin` vidí minimálně jednu sekci navíc oproti `člen`,
- Uživatel bez role nedostane přístup omylem.

## Proud D: Placeholder moduly a prázdné stavy

### Cíl

Připravit čitelnou mapu budoucí aplikace bez nutnosti hned implementovat doménové toky.

### Konkrétní kroky

1. Vytvořit placeholder routy nebo sekce pro budoucí moduly.
2. Každou obrazovku vybavit krátkým vysvětlením, co v ní později přibude.
3. Dodržet konzistentní terminologii:
   - Akce,
   - Úkoly,
   - Přiřazení,
   - Feature request,
   - Preview verze.
4. U `admin` sekce odlišit, že jde o správu nebo provozní pohled.

### Výstupy

- připravená navigace na budoucí moduly,
- empty-state texty kompatibilní s produktovou dokumentací,
- stabilní struktura pro další fáze.

### Definition of Done

- reviewer bez znalosti repozitáře pozná, jaké hlavní části aplikace budou následovat,
- placeholdery nejsou slepé nebo matoucí,
- budoucí fáze mohou doplňovat obsah bez bourání layoutu a navigace.

## Proud E: Prostředí, diagnostika a preview upozornění

### Cíl

Zajistit, aby Uživatel ani po přihlášení neztratil přehled o tom, v jakém prostředí pracuje.

### Konkrétní kroky

1. Zachovat nebo rozšířit environment badge v přihlášené části.
2. Zobrazit preview upozornění i uvnitř chráněného layoutu.
3. Zachovat přístup k diagnostice commitu, prostředí a runtime.
4. Ověřit, že preview a production používají odlišné konfigurace a že je to patrné i v UI.

### Výstupy

- environment indikace v public i protected zóně,
- přístupná diagnostika nasazené verze,
- konzistentní preview označení.

### Definition of Done

- po přihlášení nelze přehlédnout, že jde o preview,
- `production` a `preview` se z UI nedají snadno zaměnit,
- diagnostika release je dohledatelná bez zásahu do interních nástrojů.

## Proud F: Neprodukční ověření a dokumentace

### Cíl

Mít opakovatelný postup, jak fázi 1 ověřit lokálně, v preview i po merge.

### Konkrétní kroky

1. Dopsat auth proměnné a redirect URL do provozní dokumentace.
2. Popsat vytvoření nebo správu testovacích identit.
3. Doplnit manuální checklist pro přihlášení:
   - local,
   - preview,
   - production.
4. Rozhodnout, zda pro fázi 1 stačí manuální auth checklist, nebo zda má vzniknout i automatizovaný smoke krok.
5. Ověřit chování pro `admin`, `člen` a chybějící roli.

### Výstupy

- aktualizovaný runbook,
- přihlašovací checklist,
- dokumentované testovací identity nebo jejich bootstrap.

### Definition of Done

- nový vývojář nebo agent ví, jak přihlášení ověřit bez domýšlení,
- preview lze ověřit opakovatelně,
- produkční kontrola nevyžaduje improvizaci ani znalost nezdokumentovaných účtů.

## Doporučené pořadí implementace

Níže je doporučené pořadí tak, aby se co nejdříve dostavil použitelný přihlášený shell bez zbytečného rozpracování domény:

1. **Uzavřít auth vstupy a otevřená rozhodnutí**
   - provider a redirecty,
   - zdroj rolí,
   - testovací identity.

2. **Doplnit konfiguraci prostředí pro autentizaci**
   - proměnné prostředí,
   - dokumentaci local, preview a production hodnot,
   - kontrolu chybějících konfigurací.

3. **Zprovoznit veřejný vstup a login/logout tok**
   - landing,
   - přihlášení,
   - callback,
   - odhlášení.

4. **Přidat chráněný shell**
   - oddělený layout,
   - dashboard,
   - navigaci.

5. **Zavést minimální role**
   - mapování identity,
   - `admin` sekci,
   - unauthorized stav.

6. **Doplnit placeholder moduly**
   - Akce,
   - moje Přiřazení,
   - Feature requesty,
   - administrace.

7. **Dopsat ověřovací runbook**
   - local login,
   - preview login,
   - production kontrola po merge.

8. **Provést zkušební průchod přes PR a merge**
   - ověřit preview,
   - ověřit roli `admin` a `člen`,
   - potvrdit, že shell funguje i mimo lokální běh.

## Doporučené rozpadnutí do backlogu

Pro praktické spuštění implementace je vhodné rozdělit fázi 1 minimálně na následující položky:

### F1-01: Auth vstupy a rozhodnutí

- potvrdit první auth provider nebo sadu providerů,
- zapsat redirect URL pro local, preview a production,
- potvrdit zdroj role `admin` / `člen`,
- zapsat způsob bootstrapu testovacích identit.

### F1-02: Veřejný vstup a login/logout

- upravit landing page pro nepřihlášeného Uživatele,
- doplnit přihlášení a odhlášení,
- ošetřit callback a chybové stavy,
- zachovat environment indikaci.

### F1-03: Chráněný layout a session

- vytvořit oddělenou přihlášenou zónu,
- doplnit dashboard po přihlášení,
- zajistit redirect nebo guard při nepřihlášeném přístupu.

### F1-04: Role a autorizace

- zavést minimální roli `admin` a `člen`,
- omezit přístup do `admin` části,
- doplnit unauthorized stav a dokumentaci modelu rolí.

### F1-05: Navigace a placeholder moduly

- připravit routy pro budoucí moduly,
- doplnit jednotné empty-state texty,
- zkontrolovat konzistenci terminologie s produktovými dokumenty.

### F1-06: Diagnostika přihlášené části

- zachovat badge prostředí i po přihlášení,
- zpřístupnit commit a release diagnostiku,
- zviditelnit preview upozornění v chráněném layoutu.

### F1-07: Ověření identit a runbook

- připravit testovací `admin` a `člen` identitu,
- dopsat lokální a preview checklist,
- rozhodnout o rozsahu automatizovaného smoke ověření pro auth vrstvu.

### F1-08: Zkušební průchod fáze 1

- otevřít PR s autentizací a shellem,
- ověřit preview login,
- po merge potvrdit production chování,
- uzavřít dokumentační a provozní dluhy před zahájením Fáze 2.

## Checklist před spuštěním implementace

Před prvním kódovým PR mají být potvrzené tyto body:

- [ ] je potvrzený konkrétní auth provider nebo sada providerů pro první verzi,
- [ ] jsou zapsané redirect URL pro local, preview a production,
- [ ] je rozhodnutý zdroj role `admin` / `člen`,
- [ ] existuje alespoň jedna testovací identita `admin`,
- [ ] existuje alespoň jedna testovací identita `člen`,
- [ ] je jasné, kdo spravuje auth konfiguraci v Supabase a ve Vercelu,
- [ ] je doplněná dokumentace potřebných proměnných prostředí.

## Checklist uzavření fáze 1

Fázi 1 lze považovat za dokončenou teprve tehdy, když platí vše níže:

- [ ] Uživatel se umí přihlásit v local, preview i production,
- [ ] nepřihlášený přístup do chráněné části je bezpečně blokovaný,
- [ ] přihlášený Uživatel vidí jednotný aplikační shell,
- [ ] `preview` a `production` jsou zřetelně odlišené i po přihlášení,
- [ ] existuje minimální role `admin`,
- [ ] existuje minimální role `člen`,
- [ ] aspoň jedna sekce je skutečně omezená jen pro `admin`,
- [ ] pro budoucí moduly existují placeholder nebo empty-state obrazovky,
- [ ] runbook popisuje, jak přihlášení a role ověřit,
- [ ] tým může bez improvizace zahájit Fázi 2 nebo Fázi 3.

## Rizika specifická pro fázi 1

### Riziko: autentizace funguje jen v jednom prostředí

Pokud bude login odladěný jen lokálně nebo jen v produkci, velmi rychle se rozpadne preview workflow. Redirecty a callbacky proto musí být ověřené ve všech třech režimech: `local`, `preview`, `production`.

### Riziko: role jsou jen kosmetické

Pokud `admin` a `člen` ovlivní jen to, co je vidět v navigaci, ale ne skutečný přístup, vznikne falešný pocit bezpečí a další fáze budou stavět na nespolehlivém základu.

### Riziko: příliš brzké rozpracování domény

Pokud se do stejné iterace přimíchá plnohodnotný seznam Akcí, detail Akce a první práce s Přiřazeními, rozpadne se fokus fáze 1 a zkomplikuje se diagnostika problémů mezi autentizací, layoutem a datovou vrstvou.

### Riziko: ztráta odlišení preview po přihlášení

Je časté, že nepřihlášená landing page výrazně označuje preview, ale chráněná část už ne. To by bylo v rozporu s produktovým zadáním i use journeys, kde má být vždy zřejmé, zda jde o testovací nebo ostré prostředí.

## Doporučení pro navazující fázi 2

Fáze 2 by měla začít až ve chvíli, kdy:

- přihlášení funguje stabilně v local, preview i production,
- existuje chráněná část aplikace s jasnou navigací,
- Uživatel vidí prostředí i po přihlášení,
- role `admin` a `člen` mají alespoň minimální, ale skutečný význam,
- ověřovací runbook neobsahuje nejasné ruční kroky.

Teprve pak má smysl přidávat první skutečný doménový tok nad Akcemi nebo další ověřovací přírůstek pro práci s daty.
