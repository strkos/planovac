# Uživatelské požadavky pro spolkovou aplikaci formou use journeys

## Účel dokumentu
Tento dokument shrnuje uživatelské požadavky na spolkovou aplikaci formou **use journeys** pro typické situace, které mají členové spolku, organizátoři a správci při běžném provozu.

Cílem aplikace je:
- správa členů spolku,
- plánování akcí,
- zajištění obsazení akcí,
- plánování brigád a dalších činností,
- samoobslužná koordinace mezi členy,
- postupný rozvoj aplikace samotnými členy pomocí AI asistovaného workflow.

---

# 1. Role uživatelů

## 1.1 Běžný člen
Používá aplikaci pro:
- přehled akcí,
- přihlašování na akce,
- zapisování se na konkrétní role nebo práce,
- potvrzování účasti, pokud ho přihlásil někdo jiný,
- hlasování o nových funkcích,
- testování preview verzí aplikace.

## 1.2 Organizátor / správce akce
Používá aplikaci pro:
- zakládání akcí,
- vytváření a správu úkolů pro akce,
- sledování obsazenosti,
- ruční přiřazování členů,
- povyšování náhradníků,
- komunikaci změn.

## 1.3 Administrátor aplikace
Používá aplikaci pro:
- správu členů a oprávnění,
- správu typů akcí a šablon,
- dohled nad vývojem aplikace,
- schvalovací proces nových funkcí,
- dohled nad produkční a preview verzí.

## 1.4 Navrhující člen
Používá aplikaci pro:
- zadání návrhu nové funkcionality,
- sledování stavu návrhu,
- testování preview verze,
- prezentaci návrhu ostatním členům,
- vyvolání hlasování o nasazení změny.

---

# 2. Základní principy chování systému

Aplikace má být:
- jednoduchá,
- samoobslužná,
- srozumitelná i pro méně technické členy,
- použitelná z webového prohlížeče bez nutnosti instalace,
- přehledná v tom, co je ostrý provoz a co je testovací preview.

Každý uživatel musí vždy rozumět:
- jaké akce existují,
- co je potřeba zajistit,
- zda je na něco přihlášen,
- zda jde o produkční nebo testovací verzi aplikace.

---

# 3. Use journeys pro běžný provoz spolku

## 3.1 Člen chce zjistit, jaké akce se chystají
### Cíl
Člen potřebuje rychle zjistit, jaké akce se blíží, co se na nich děje a zda je potřeba jeho pomoc.

### Výchozí situace
Člen se přihlásí do aplikace.

### Průběh
1. Člen otevře domovskou stránku nebo přehled akcí.
2. Vidí seznam budoucích akcí.
3. U každé akce vidí základní informace:
   - název,
   - datum a čas,
   - místo,
   - stručný popis,
   - aktuální stav obsazení.
4. Klikne na detail vybrané akce.
5. V detailu vidí:
   - co je cílem akce,
   - jaké role nebo práce je potřeba zajistit,
   - kdo je již přihlášen,
   - kde chybí lidé.

### Očekávaný přínos
Člen bez složitého hledání zjistí, co se chystá a kde může pomoci.

---

## 3.2 Organizátor zakládá novou akci podle typu akce
### Cíl
Organizátor chce rychle založit akci bez toho, aby pokaždé ručně zadával všechny potřebné role a úkoly.

### Výchozí situace
Organizátor má právo vytvářet akce.

### Průběh
1. Organizátor klikne na „Nová akce“.
2. Vyplní základní údaje:
   - název,
   - datum a čas,
   - místo,
   - popis.
3. Vybere typ akce.
4. Systém podle vybrané šablony automaticky vytvoří seznam potřebných úkolů a rolí.
5. Organizátor případně upraví počty nebo doplní další úkoly.
6. Akci uloží.
7. Členové dostanou notifikaci o nové akci.

### Očekávaný přínos
Zakládání akcí je rychlé, konzistentní a odpovídá reálným potřebám různých typů akcí.

---

## 3.3 Člen se hlásí na konkrétní roli v rámci akce
### Cíl
Člen se chce přihlásit ne jen „na akci obecně“, ale na konkrétní roli nebo práci.

### Výchozí situace
Existuje akce s definovanými rolemi a úkoly.

### Průběh
1. Člen otevře detail akce.
2. Vidí seznam úkolů a rolí.
3. U každé role vidí:
   - požadovaný počet lidí,
   - aktuální obsazení,
   - případné náhradníky.
4. U vybrané role klikne na „Přihlásit se“.
5. Systém ho zapíše mezi hlavní účastníky.
6. Člen ihned vidí, že je role částečně nebo plně obsazena.
7. Systém mu odešle potvrzení a kalendářovou událost.

### Očekávaný přínos
Člen ví přesně, k čemu se zavázal, a organizátor okamžitě vidí stav obsazení.

---

## 3.4 Člen se hlásí jako náhradník
### Cíl
Člen chce nabídnout pomoc, ale nechce být započítán do povinného minima nebo může přijít jen v případě potřeby.

### Výchozí situace
Role už může být plná nebo člen chce být veden jako záloha.

### Průběh
1. Člen otevře detail úkolu nebo role.
2. Klikne na „Přihlásit se jako náhradník“.
3. Systém ho přidá mezi náhradníky.
4. V přehledu role je zřetelně oddělen:
   - hlavní účastníci,
   - náhradníci.
5. Organizátor může v případě potřeby náhradníka povýšit na hlavního účastníka.
6. Po povýšení dostane člen potvrzení o změně.

### Očekávaný přínos
Spolek lépe zvládá nejistotu a výpadky lidí bez komplikovaného plánování.

---

## 3.5 Člen přihlásí jiného člena a ten to potvrdí
### Cíl
Člen nebo organizátor chce zapsat jiného člena na konkrétní roli, ale výsledná účast musí být potvrzena dotyčným členem.

### Výchozí situace
Přihlašovaný člen ještě není na roli potvrzen.

### Průběh
1. Uživatel otevře detail akce a vybere úkol.
2. Zvolí možnost „Přihlásit jiného člena“.
3. Vybere konkrétního člena.
4. Systém vytvoří přiřazení ve stavu „čeká na potvrzení“.
5. Přihlášenému členovi odejde notifikace.
6. Tento člen otevře detail oznámení nebo detail akce.
7. Vidí, kdo ho přihlásil, na jakou roli a na jakou akci.
8. Zvolí:
   - potvrdit,
   - odmítnout.
9. Systém podle volby aktualizuje stav.
10. Původní navrhující člen vidí výsledek.

### Očekávaný přínos
Lze efektivně domlouvat účast mezi členy, ale nikdo není přihlášen bez svého vědomí.

---

## 3.6 Organizátor sleduje obsazenost akce
### Cíl
Organizátor chce rychle zjistit, co ještě není zajištěno.

### Výchozí situace
Akce existuje a členové se již začali zapisovat.

### Průběh
1. Organizátor otevře detail akce.
2. Vidí souhrnný přehled:
   - které role jsou plně obsazené,
   - které role jsou částečně obsazené,
   - kde chybí lidé,
   - kolik je náhradníků.
3. U problémových rolí může:
   - přidat člena ručně,
   - oslovit členy,
   - upravit požadovaný počet,
   - povýšit náhradníka.

### Očekávaný přínos
Organizátor nemusí ručně dohledávat stav a může se soustředit na skutečné mezery v zajištění akce.

---

## 3.7 Spolek plánuje brigádu nebo pracovní činnost
### Cíl
Spolek potřebuje evidovat a plánovat i činnosti, které nejsou klasickou akcí, ale je potřeba je udělat a obsadit.

### Výchozí situace
Je potřeba zorganizovat brigádu, údržbu nebo opravu zařízení.

### Průběh
1. Organizátor vytvoří novou brigádu nebo činnost.
2. Zadá:
   - název,
   - termín,
   - místo,
   - popis práce,
   - seznam úkolů.
3. U každého úkolu určí:
   - kolik lidí je potřeba,
   - případně kdo má vhodné schopnosti.
4. Členové se zapisují na jednotlivé práce podobně jako u akcí.
5. Organizátor sleduje obsazenost a dokončení.

### Očekávaný přínos
Aplikace pokrývá nejen akce pro veřejnost nebo členy, ale i provozní a údržbové potřeby spolku.

---

## 3.8 Člen dostane akci do svého kalendáře
### Cíl
Člen nechce na přihlášenou akci zapomenout a chce mít termín ve svém běžném kalendáři.

### Výchozí situace
Člen se přihlásil na akci nebo mu byla potvrzena účast.

### Průběh
1. Po potvrzení účasti systém připraví kalendářovou událost.
2. Člen dostane email s informací o akci.
3. Součástí emailu je `.ics` příloha nebo odkaz pro přidání události.
4. Člen si událost otevře ve svém kalendáři.
5. Událost si uloží.
6. V kalendáři vidí:
   - název akce,
   - čas,
   - místo,
   - případně svou roli.

### Očekávaný přínos
Člen má termíny v běžně používaném nástroji a zvyšuje se pravděpodobnost skutečné účasti.

---

# 4. Use journeys pro samoobslužný rozvoj aplikace

## 4.1 Člen navrhuje novou funkcionalitu
### Cíl
Člen chce navrhnout vylepšení aplikace bez nutnosti přímo komunikovat s vývojářem.

### Výchozí situace
Člen při používání aplikace zjistí, že mu chybí konkrétní funkce.

### Průběh
1. Člen otevře sekci „Návrhy funkcí“.
2. Klikne na „Navrhnout novou funkcionalitu“.
3. Vyplní formulář:
   - název návrhu,
   - popis problému,
   - popis očekávaného chování,
   - důvod, proč je funkce potřebná.
4. Návrh odešle.
5. Systém návrh uloží a označí ho jako nový.
6. Návrh je viditelný ostatním členům.

### Očekávaný přínos
Nápady na rozvoj aplikace vznikají přímo od uživatelů a jsou zachyceny strukturovaně.

---

## 4.2 AI agent analyzuje návrh a připraví implementaci
### Cíl
Navržená funkce se má automatizovaně převést do technického návrhu a implementace.

### Výchozí situace
Existuje nový feature request.

### Průběh
1. AI agent přečte návrh funkcionality.
2. Provede analýzu:
   - co má být cílem změny,
   - které části aplikace budou dotčeny,
   - zda je potřeba změna datového modelu,
   - jaké UI bude potřeba přidat nebo upravit.
3. Připraví návrh implementace.
4. Vytvoří branch v repozitáři.
5. Vygeneruje nebo upraví potřebný kód.
6. Připraví migrace pro preview verzi databáze.
7. Spustí vytvoření preview verze aplikace.

### Očekávaný přínos
Zadání od člena se může změnit na testovatelný prototyp bez ručního vývojového zásahu při každém kroku.

---

## 4.3 Vznikne preview verze aplikace s oddělenými daty
### Cíl
Novou funkčnost je možné bezpečně testovat bez dopadu na ostrý provoz.

### Výchozí situace
Pro feature request již existuje branch a implementace.

### Průběh
1. Systém vytvoří preview nasazení aplikace.
2. Zároveň vytvoří samostatné databázové schema pro tuto feature.
3. Do tohoto schema zkopíruje aktuální produkční data jako snapshot.
4. Preview verze aplikace používá pouze toto schema.
5. Uživatelé testují novou funkci v odděleném prostředí.
6. Ve všech obrazovkách preview verze je jasně uvedeno, že jde o testovací prostředí.
7. Data zadaná v preview se nepropisují do produkční databáze.

### Očekávaný přínos
Členové mohou testovat nad realistickými daty, ale bez rizika znehodnocení ostrého provozu.

---

## 4.4 Navrhující člen testuje svou funkcionalitu
### Cíl
Člen, který funkci navrhl, si ji chce osobně vyzkoušet a ověřit, že řeší jeho problém.

### Výchozí situace
Preview verze je připravena.

### Průběh
1. Člen otevře detail svého návrhu.
2. Vidí stav návrhu a odkaz na preview verzi.
3. Otevře preview.
4. Vyzkouší typické scénáře použití.
5. Zapíše připomínky nebo potvrdí, že řešení odpovídá původnímu záměru.
6. Ostatní členové mohou preview také otevřít a vyzkoušet.

### Očekávaný přínos
Navrhující člen má přímou kontrolu nad tím, zda implementace odpovídá jeho potřebě.

---

## 4.5 Členové hlasují o nasazení nové funkce
### Cíl
Spolek chce rozhodnout, zda se nová funkcionalita stane součástí hlavní verze aplikace.

### Výchozí situace
Preview verze je dostupná a otestovaná.

### Průběh
1. Členové otevřou detail návrhu funkce.
2. Vidí:
   - popis funkce,
   - důvod vzniku,
   - stav implementace,
   - odkaz na preview,
   - případné shrnutí dopadů.
3. Každý oprávněný člen hlasuje:
   - pro nasazení,
   - proti nasazení.
4. Po dosažení definované podmínky systém návrh:
   - schválí,
   - nebo zamítne.

### Očekávaný přínos
O vývoji aplikace rozhoduje spolek transparentně a na základě reálného vyzkoušení.

---

## 4.6 Schválená funkce je nasazena do hlavní verze
### Cíl
Schválená změna má bezpečně přejít do ostrého provozu.

### Výchozí situace
Návrh byl schválen hlasováním.

### Průběh
1. Systém nebo AI agent připraví merge do hlavní větve aplikace.
2. Produkční databázové změny se provedou standardní migrací.
3. Aplikace se nasadí do produkce.
4. Preview schema a preview prostředí se po dokončení odstraní.
5. Členové jsou informováni, že funkce je nyní součástí hlavní verze.

### Očekávaný přínos
Nové funkce se dostávají do produkce kontrolovaně, až po otestování a souhlasu členů.

---

# 5. Use journeys pro práci s testovacími daty

## 5.1 Člen chápe, že v preview zadává testovací data
### Cíl
Uživatel se nesmí domnívat, že v preview pracuje s ostrým systémem.

### Výchozí situace
Člen otevřel preview verzi.

### Průběh
1. Po otevření preview verze systém zobrazí zřetelné upozornění.
2. Uživatel vidí, že se nachází v testovací verzi.
3. Před provedením důležitých akcí může být znovu upozorněn, že data jsou pouze testovací.
4. Po návratu do produkční verze uživatel zřetelně pozná rozdíl.

### Očekávaný přínos
Snižuje se riziko nedorozumění a chybných očekávání.

---

## 5.2 Preview verze pracuje s kopií produkčních dat
### Cíl
Testování má probíhat nad realistickým stavem spolkové agendy.

### Výchozí situace
V produkční verzi již existují členové, akce a přiřazení.

### Průběh
1. Při vytvoření preview feature systém vytvoří nové databázové schema.
2. Do něj zkopíruje produkční data ve stavu v okamžiku vzniku preview.
3. Preview pak pracuje pouze s tímto snapshotem.
4. Pozdější změny v produkci se do preview automaticky nepřenášejí.
5. Změny v preview se nevracejí zpět do produkce.

### Očekávaný přínos
Testování je věrné reálnému stavu, ale přitom oddělené a bezpečné.

---

# 6. Ne-funkční očekávání vyplývající z use journeys

## 6.1 Jednoduchost
Běžný člen musí zvládnout:
- najít akci,
- přihlásit se na roli,
- potvrdit účast,
- otevřít preview funkce,
bez potřeby technických znalostí.

## 6.2 Přehlednost
Stav obsazení, stav potvrzení i stav návrhu funkcionality musí být vždy srozumitelný na první pohled.

## 6.3 Bezpečnost provozu
Preview prostředí musí být oddělené od produkce jak aplikačně, tak datově.

## 6.4 Dohledatelnost
U návrhů funkcí musí být jasné:
- kdo je navrhl,
- v jakém jsou stavu,
- kdo hlasoval,
- zda už byly nasazeny.

## 6.5 Nízká provozní náročnost
Řešení má být provozně jednoduché, vhodné pro menší spolek a nemá vyžadovat složitou správu infrastruktury.

---

# 7. Shrnutí

Spolková aplikace má řešit dvě hlavní oblasti:

## 7.1 Provoz spolku
- členy,
- akce,
- role,
- brigády,
- potvrzování účasti,
- náhradníky,
- kalendářové notifikace.

## 7.2 Rozvoj aplikace samotné
- člen navrhne funkcionalitu,
- AI připraví implementaci,
- vznikne preview verze,
- členové funkci vyzkouší,
- hlasováním rozhodnou o nasazení,
- schválená změna přejde do produkce.

Tím vzniká aplikace, která nejen podporuje provoz spolku, ale zároveň umožňuje spolku řídit a rozvíjet vlastní digitální nástroj průběžně a samoobslužně.
