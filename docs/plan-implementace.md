# Návrh implementačního plánu aplikace planovac

## Účel dokumentu

Tento dokument popisuje **návrh pořadí implementace** aplikace tak, aby co nejdříve vznikla:

1. technicky funkční kostra aplikace,
2. spolehlivé CI/CD pro automatické nasazování,
3. teprve poté minimální sada uživatelských funkcí,
4. a až následně širší doménové a samoobslužné workflow.

Dokument je záměrně orientovaný na **inkrementální dodávku**. Nejde o úplnou technickou architekturu, ale o pracovní plán, podle kterého lze aplikaci budovat po malých, ověřitelných krocích.

## Východiska a závazná omezení

Plán vychází z již potvrzených voleb v repozitáři:

- frontend bude hostovaný na **Vercel.com**,
- data budou uložená v **Supabase.com**,
- autentizace bude přes **OIDC/OAuth** s výchozím poskytovatelem **Supabase**,
- zdrojový kód a automatizace poběží přes **GitHub**.

Současně respektuje produktové zadání:

- aplikace má pokrývat správu **Uživatelů**, **Akcí**, **Úkolů** a **Přiřazení**,
- rozvoj nové funkcionality probíhá přes workflow:
  1. návrh funkce,
  2. AI implementace,
  3. preview verze,
  4. testování,
  5. hlasování,
  6. nasazení,
- preview data musí zůstat oddělená od produkce modelem **schema-per-feature**.

## Hlavní implementační zásada

Pořadí prací má být následující:

1. **nejdřív zprovoznit CI/CD a automatické nasazování,**
2. **poté ověřit, že umíme bezpečně doručovat malé změny,**
3. **až pak rozšiřovat uživatelské funkce.**

To znamená, že v prvních přírůstcích je správné dodat i velmi malou aplikaci, pokud:

- jde automaticky nasadit,
- má jasně oddělené prostředí,
- umí projít kontrolami v CI,
- a má základní dohledatelnost změn.

## Cílový stav první funkční kostry

Za první opravdu použitelný milník se považuje stav, kdy:

- existuje nasaditelná webová aplikace s minimálním UI,
- každá změna v pull requestu má automatickou kontrolu a preview nasazení,
- merge do `main` automaticky vyvolá produkční nasazení,
- databázové změny mají řízený způsob aplikace,
- aplikace umí rozlišit produkční a preview režim,
- přihlášený Uživatel vidí alespoň základní přehled budoucích Akcí.

Tento milník je důležitější než šíře funkcí.

---

## Fáze implementace

## Fáze 0: Základ repozitáře a delivery pipeline

### Cíl
Nejdřív připravit technický základ, aby každá další změna šla bezpečně ověřit a nasadit.

### Detailní rozpad fáze

Podrobný prováděcí plán této etapy je rozepsaný v dokumentu
[Detailní implementační plán: Fáze 0 - Základ repozitáře a delivery pipeline](faze-0-zaklad-repozitare-a-delivery-pipeline.md).

### Obsah

- založit základní strukturu aplikace a konvence repozitáře,
- připojit repozitář k Vercel projektu,
- připravit Supabase projekt a rozdělení prostředí,
- zavést správu proměnných prostředí pro lokální běh, preview a produkci,
- připravit základní GitHub workflow pro automatické kontroly,
- nastavit pravidla pro práci s větvemi a merge do `main`,
- definovat způsob verzování databázových změn,
- doplnit základní seed nebo demo data pro vývoj a smoke testy.

### Minimum hotovo

- pull request spouští CI,
- CI umí minimálně build a základní validace,
- Vercel vytváří preview nasazení k pull requestům,
- merge do `main` vede k automatickému produkčnímu nasazení,
- existuje popsaný a opakovatelný postup pro databázové migrace.

### Poznámka k prioritě

V této fázi je v pořádku, pokud aplikace ještě neumí skoro žádné doménové scénáře. Důležitější je, že změny tečou spolehlivě přes pipeline.

---

## Fáze 1: Minimální aplikační kostra

### Cíl
Mít nasaditelnou aplikaci, do které je možné se přihlásit a která jasně ukazuje stav prostředí.

### Obsah

- přihlášení Uživatele přes zvolený OIDC/OAuth tok,
- základní aplikační layout,
- navigace pro hlavní sekce,
- prázdné nebo jednoduché obrazovky pro budoucí moduly,
- zřetelné označení, zda jde o produkční nebo preview verzi,
- základní stránka se stavem aplikace a případně diagnostikou prostředí,
- základní model oprávnění alespoň pro role `admin` a `člen`.

### Minimum hotovo

- Uživatel se umí přihlásit,
- po přihlášení se dostane do chráněné části aplikace,
- preview režim je v UI jasně odlišený,
- aplikace je stále plně nasaditelná přes existující CI/CD.

### Proč tato fáze předchází uživatelským funkcím

Bez funkční identity, rozlišení prostředí a stabilního shellu by se i jednoduché doménové funkce implementovaly dvakrát nebo nekonzistentně.

---

## Fáze 2: Ověření CI/CD na malém reálném toku

### Cíl
Ještě před širší implementací ověřit, že pipeline zvládá i změnu, která zasahuje UI, data i nasazení.

### Doporučený ověřovací přírůstek

Jako první skutečný průchod přes celý řetězec dodat:

- jednoduchý přehled budoucích Akcí,
- napojení na databázi,
- seed ukázkových dat,
- základní smoke test po nasazení.

### Minimum hotovo

- změna projde přes pull request,
- vznikne preview nasazení,
- v preview jde ověřit napojení na data,
- po merge se stejná změna dostane do produkce bez ručního zásahu,
- tým má jistotu, že delivery řetězec funguje na reálné funkci, ne jen na prázdném shellu.

---

## Fáze 3: Minimální uživatelské MVP

### Cíl
Po ověření CI/CD dodat nejnutnější scénáře pro běžného člena a základní provoz spolku.

### Prioritní scénáře

1. **Člen vidí seznam budoucích Akcí**
2. **Člen otevře detail Akce**
3. **Člen vidí Úkoly a stav obsazení**
4. **Člen se přihlásí na Úkol jako `main` nebo `substitute`**
5. **Člen vidí své vlastní Přiřazení**

### Co je vhodné záměrně odložit

Do této fáze není nutné za každou cenu zahrnout:

- šablony typů akcí,
- hlasování o funkcích,
- kalendářové integrace,
- notifikace více kanály,
- pokročilé administrační obrazovky,
- plně samoobslužný workflow feature requestů.

### Doporučený implementační přístup

Aby se první verze dodala rychle:

- zakládání Akcí může být zpočátku řešeno jednoduchým administrativním formulářem nebo seed daty,
- není nutné hned pokrýt všechny role uživatelů stejně hluboko,
- důležitější je uzavřít jeden funkční tok end-to-end než rozdělat více polovičních modulů.

### Minimum hotovo

- běžný člen se přihlásí,
- vidí relevantní Akce,
- v detailu chápe obsazení Úkolů,
- dokáže se přihlásit na konkrétní Úkol,
- změna se propíše do přehledu obsazenosti.

---

## Fáze 4: Základ organizace a potvrzování účasti

### Cíl
Rozšířit MVP o scénáře, které dělají systém použitelný i pro organizátora.

### Priorita funkcí

- organizátor založí novou Akci,
- organizátor přidá nebo upraví Úkoly,
- organizátor sleduje souhrnnou obsazenost,
- organizátor přihlásí jiného člena,
- přihlášený člen potvrdí nebo odmítne Přiřazení,
- organizátor umí povýšit `substitute` na `main`.

### Minimum hotovo

- vedle samoobslužného přihlášení funguje i řízené přiřazování,
- systém pracuje se stavy `pending`, `confirmed`, `rejected`,
- organizátor má rychlý přehled o neobsazených místech.

---

## Fáze 5: Provozní doplnění pro běžné používání

### Cíl
Doplnit funkce, které zvyšují použitelnost v běžném provozu spolku.

### Kandidátní rozsah

- šablony typů Akcí,
- brigády a pracovní činnosti jako plnohodnotný scénář,
- kalendářové pozvánky a `.ics`,
- základní notifikace,
- evidence členů a správa jejich stavu,
- jemnější oprávnění a administrační nástroje.

### Poznámka

Pořadí uvnitř této fáze se má řídit reálným používáním MVP. Co nepálí v prvním provozu, nemá předběhnout stabilitu a jednoduchost.

---

## Fáze 6: Samoobslužný rozvoj aplikace

### Cíl
Teprve po stabilizaci základního provozu implementovat celý workflow rozvoje aplikace samotné.

### Prioritní části

1. evidence **Feature requestů**,
2. stavový tok návrhu od zadání po nasazení,
3. zobrazení odkazu na preview verzi,
4. workflow testování a připomínek,
5. hlasování o nasazení,
6. úklid preview prostředí a preview dat po dokončení.

### Zásadní technická podmínka

Tato fáze má smysl až tehdy, když je spolehlivě zvládnuté:

- preview nasazení aplikace,
- práce s odděleným databázovým schematem,
- správa migrací,
- dohledatelnost změny od větve až po nasazení.

Bez toho by produktová část samoobslužného rozvoje vznikla dřív než její skutečný technický základ.

---

## Doporučené pořadí konkrétních přírůstků

## Přírůstek A: Delivery foundation

- repozitářová struktura,
- CI workflow,
- preview deployment,
- produkční deployment,
- základ databázových migrací.

## Přírůstek B: App shell

- přihlášení,
- chráněná aplikace,
- navigace,
- indikace prostředí,
- health/status obrazovka.

## Přírůstek C: První reálná funkce pro ověření pipeline

- seznam Akcí,
- detail Akce,
- seed dat,
- smoke test po nasazení.

## Přírůstek D: Minimální samoobsluha člena

- přihlášení na Úkol,
- rozlišení `main` a `substitute`,
- přehled vlastních Přiřazení.

## Přírůstek E: Organizátorské minimum

- vytvoření Akce,
- správa Úkolů,
- přihlášení jiného člena,
- potvrzení nebo odmítnutí Přiřazení.

## Přírůstek F: Rozšíření provozu

- brigády,
- notifikace,
- kalendáře,
- šablony Akcí.

## Přírůstek G: Samoobslužný rozvoj aplikace

- Feature request,
- preview workflow,
- testování,
- hlasování,
- řízené nasazení.

---

## Co má být hotové dřív než širší funkcionalita

Následující body mají vyšší prioritu než většina uživatelských modulů:

- automatická kontrola každé změny v pull requestu,
- automatické preview nasazení,
- jasné oddělení preview a produkce,
- opakovatelné databázové migrace,
- základní smoke test po nasazení,
- dohledatelnost verze a prostředí.

Pokud bude potřeba volit mezi:

- „ještě jedna uživatelská obrazovka navíc“
- a „stabilnější nasazení a ověřitelná změna“,

má přednost druhá možnost.

## Návrh Definition of Done pro první etapy

## Pro CI/CD etapy

Hotovo znamená:

- změna projde automatickými kontrolami,
- existuje preview verze,
- aplikace jde otevřít a základně ověřit,
- produkční nasazení je opakovatelné bez ručního skládání kroků.

## Pro první uživatelské etapy

Hotovo znamená:

- scénář je dokončený end-to-end,
- funguje v produkci i preview,
- není nejasné, v jakém prostředí Uživatel pracuje,
- data odpovídají základním doménovým pravidlům ze zadání.

## Rizika a doporučení

### Riziko: příliš brzká šíře funkcí

Pokud se začne rozsáhle implementovat doména dřív než pipeline, vznikne tlak na ruční nasazování a obtížné opravování chyb.

### Riziko: předčasné řešení samoobslužného vývoje

Workflow Feature request -> preview -> hlasování je pro produkt důležité, ale technicky závisí na tom, že už funguje deployment, migrace a oddělení preview dat.

### Riziko: příliš široké první MVP

První MVP má být úzké. Není cílem pokrýt všechny use journeys najednou, ale potvrdit, že aplikace umí bezpečně růst.

## Doporučená implementační priorita v jedné větě

Nejdřív zprovoznit **spolehlivou delivery pipeline a nasaditelnou kostru**, potom dodat **úzké MVP pro Akce, Úkoly a Přiřazení**, a teprve následně rozšiřovat organizátorské funkce, provozní doplňky a samoobslužný rozvoj aplikace.
