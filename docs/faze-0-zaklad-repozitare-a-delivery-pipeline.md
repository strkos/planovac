# Detailní implementační plán: Fáze 0 - Základ repozitáře a delivery pipeline

## Účel dokumentu

Tento dokument rozpracovává **Fázi 0** z [plánu implementace](plan-implementace.md) do podoby, podle které lze založit konkrétní backlog, připravit první issues a spustit implementaci bez nutnosti znovu domýšlet pořadí prací.

Nejde o finální technickou architekturu celé aplikace. Dokument popisuje:

- co má být ve fázi 0 skutečně dodáno,
- v jakém pořadí mají práce probíhat,
- jaké artefakty a rozhodnutí musí vzniknout,
- jak poznat, že je fáze 0 opravdu dokončená,
- co je ještě otevřené a musí být výslovně potvrzené.

## Návaznost na kanonické dokumenty

Tento plán vychází z těchto závazných podkladů:

- [Základní zadání](zadani-zakladni.md)
- [Use journeys a uživatelské požadavky](scenare-pouziti.md)
- [Návrh implementačního plánu](plan-implementace.md)

Při implementaci musí zůstat zachované zejména tyto principy:

- frontend je hostovaný na **Vercel.com**,
- data jsou uložená v **Supabase.com**,
- autentizace používá **OIDC/OAuth** s výchozím poskytovatelem **Supabase**,
- vývoj a automatizace probíhají přes **GitHub**,
- preview data jsou oddělená od produkce a pracují v režimu **schema-per-feature**,
- preview data se nikdy nevracejí zpět do produkčních dat.

## Cíl fáze 0

Na konci fáze 0 má existovat technický základ, který umožní bezpečně spustit implementaci dalších fází:

- repozitář obsahuje nasaditelnou minimální aplikaci,
- pull requesty se automaticky validují,
- pull request má automatické preview nasazení,
- merge do `main` vede k automatickému produkčnímu nasazení,
- databázové změny mají verzovaný a opakovatelný postup,
- lokální, preview a produkční prostředí mají popsané a oddělené konfigurace,
- existují seed nebo demo data pro vývoj a základní smoke ověření.

Fáze 0 ještě nemusí dodávat výrazné doménové funkce. Její hodnota je v tom, že vytvoří spolehlivý základ pro všechny další změny.

## Rozsah fáze 0

### Co do fáze 0 patří

- založení základní aplikační kostry,
- definice struktury repozitáře a vývojových konvencí,
- propojení s Vercel projektem,
- příprava Supabase prostředí a migrací,
- správa proměnných prostředí a secretů,
- GitHub CI workflow a pravidla pro merge,
- seed nebo demo data pro lokální běh a smoke scénáře,
- minimální provozní dokumentace pro vývojáře a budoucí agenty.

### Co do fáze 0 nepatří

- plné doménové obrazovky pro Akce, Úkoly a Přiřazení,
- pokročilý model oprávnění,
- hlasování o funkcích,
- workflow feature requestů v aplikaci,
- notifikace, kalendáře a provozní doplňky,
- plná automatizace preview databázových snapshotů pro každou feature, pokud ještě není připravený základ migrací, prostředí a identifikace preview větve.

## Výstupy, které mají po fázi 0 existovat

Po uzavření fáze 0 mají být k dispozici minimálně tyto artefakty:

1. **Nasaditelný repozitář**
   - minimální webová aplikace s funkčním buildem,
   - základní struktura adresářů,
   - dokumentované lokální spuštění.

2. **CI validace v GitHubu**
   - automatické spuštění na pull request,
   - minimálně install, build a základní validace,
   - čitelné selhání při chybě konfigurace.

3. **Preview a produkční deployment**
   - preview nasazení pro pull request,
   - produkční nasazení po merge do `main`,
   - dohledatelnost, jaký commit běží v jakém prostředí.

4. **Supabase základ**
   - verzované migrace,
   - opakovatelný postup jejich aplikace,
   - seed nebo demo data,
   - popsané oddělení lokálního, preview a produkčního režimu.

5. **Provozní dokumentace**
   - jak založit a napojit prostředí,
   - jak pracovat s proměnnými prostředí,
   - jak vytvářet migrace,
   - jak ověřit základní smoke scénář po deployi.

## Předpoklady a vstupy před zahájením implementace

Implementaci fáze 0 lze spustit až ve chvíli, kdy jsou dostupné tyto vstupy:

- GitHub repozitář na aktivní větvi pro implementaci,
- přístup do Vercel týmu nebo účtu, kde vznikne projekt,
- přístup do Supabase organizace nebo účtu,
- možnost nastavovat secrets v GitHubu a proměnné prostředí ve Vercelu,
- jasně určený vlastník produkčních secretů a vlastník neprodukčních secretů.

## Otevřená rozhodnutí, která je nutné uzavřít hned na začátku

Následující body nejsou v dosavadní dokumentaci explicitně uzavřené. Proto musí být v prvním implementačním kroku potvrzené jako **návrh rozhodnutí**, aby se zbytek fáze 0 neopíral o nejasné předpoklady.

### 1. Konkrétní frontend stack - uzavřeno

Pro fázi 0 je potvrzený následující výchozí frontend stack:

- **Next.js**
- **TypeScript**
- **React** jako aplikační runtime v rámci Next.js
- **Next.js App Router** pro základní aplikační kostru
- **ESLint** jako povinné minimum statické validace v CI

Součástí tohoto rozhodnutí je i to, že:

- povinné minimum validace ve fázi 0 tvoří alespoň `install`, `lint` a `build`,
- širší frontend tooling není blokátorem fáze 0,
- detailnější volby jako komponentová knihovna, pokročilý state management nebo form knihovna se zatím neuzavírají a mohou být doplněné až podle potřeb MVP.

#### Odůvodnění

Tento stack má nejlepší kompatibilitu s hostováním na Vercelu a zároveň minimalizuje integrační práci v etapě, která je zaměřená hlavně na build, CI/CD a bezpečné rozlišení prostředí. Současně dává stabilní základ pro navazující fázi 1, kde bude potřeba přihlášení Uživatele, chráněná část aplikace a základní shell aplikace.

### 2. Model neprodukčních databázových prostředí - uzavřeno

Pro fázi 0 je potvrzený následující model databázových prostředí:

- **1 produkční Supabase projekt** pro ostrý provoz,
- **1 sdílený neprodukční Supabase projekt** pro preview a další neprodukční potřeby,
- **local** běží odděleně v lokálním opakovatelném vývojovém setupu,
- preview data jsou v neprodukčním projektu oddělená přes schémata `preview_<identifikator>`,
- identifikátor preview schema má být navázaný na stabilní identifikátor změny, přednostně na **PR číslo**.

Součástí tohoto rozhodnutí je i to, že model **schema-per-feature** se používá právě uvnitř sdíleného neprodukčního Supabase projektu, ne v produkční databázi a ne formou zakládání samostatného Supabase projektu pro každé preview.

#### Odůvodnění

Tento model zachovává bezpečné oddělení produkce od preview, respektuje požadavek na **schema-per-feature** a současně drží nízkou provozní náročnost. Je tedy vhodný pro menší spolek i pro ranou delivery fázi, kde je důležitější jednoduchý a opakovatelný provoz než maximalistická infrastruktura.

### 3. Pravidla práce s produkčními daty v preview - uzavřeno

Pro fázi 0 se potvrzuje tento model preview snapshotů:

- preview používá **anonymizovaný snapshot produkčních dat**, ne plný surový snapshot,
- minimálně kontaktní údaje Uživatelů, jako jsou jméno, email a telefon, se do preview nepřenášejí v produkční podobě,
- u vybraných Uživatelů jsou anonymizované údaje mapované **stabilně** na konkrétní neprodukční identity,
- toto stabilní mapování je uložené v **produkční databázi** jako řízená technická konfigurace pro generování neprodukčních snapshotů,
- pro ostatní Uživatele lze použít standardní anonymizaci bez požadavku na dlouhodobě stabilní identitu,
- preview aplikace pracuje výhradně s daty uvnitř schema `preview_<identifikator>`,
- cleanup preview schemat probíhá po merge, po uzavření pull requestu bez merge a zároveň existuje expirační fallback pro případ selhání standardního úklidu.

#### Odůvodnění

Anonymizace chrání osobní údaje a současně zachovává realistický tvar dat pro testování. Stabilní mapování vybraných Uživatelů na konkrétní neprodukční identity usnadňuje testování funkcí navázaných na kontaktní údaje, protože stejné testovací identity zůstávají konzistentní napříč více preview snapshoty. Uložení mapování do produkční databáze umožňuje řízenou, auditovatelnou a opakovatelnou tvorbu snapshotů bez ruční improvizace.

### 4. Minimální merge politika - uzavřeno

Pro fázi 0 se potvrzuje tato minimální merge politika:

- merge do `main` je povolen **pouze přes pull request**,
- přímý push do `main` je zakázaný,
- pull request musí projít povinnými status checks, minimálně `install`, `lint` a `build`,
- změny zasahující databázové artefakty musí navíc projít odpovídající kontrolou migrací nebo databázových artefaktů,
- výchozí merge režim je **squash merge**,
- `merge commit` ani `rebase merge` se pro fázi 0 nepoužívají,
- branch protection mohou obejít pouze určení správci repozitáře.

#### Odůvodnění

Tato pravidla zajišťují, že se cíl fáze 0 opravdu promítne do reálné práce s repozitářem. Pull request jako jediná cesta do `main` přirozeně váže dohromady CI, preview nasazení a review změny. Povinné kontroly `install`, `lint` a `build` odpovídají minimálnímu technickému základu této etapy a **squash merge** současně udržuje historii `main` čitelnou i při rychlých iteracích.

## Doporučený cílový obraz pro fázi 0

Následující část je **návrh technického směru**, který je kompatibilní se stávajícím zadáním a dává dobrý základ pro další fáze.

### Frontend stack

Pro výchozí implementaci fáze 0 je potvrzený tento směr:

- aplikace bude založená na **Next.js**,
- kód bude psaný v **TypeScriptu**,
- základ aplikační kostry bude stavět na **Next.js App Router**,
- minimální CI validace bude obsahovat alespoň `lint` a `build`,
- styling a širší UI vrstva nejsou v této fázi samostatným blokujícím rozhodnutím.

### Prostředí

Doporučené minimální rozdělení prostředí:

- **local** - lokální vývoj,
- **preview** - automaticky vznikající preview nasazení k pull requestům,
- **production** - ostré prostředí po merge do `main`.

### Datový model prostředí

Pro výchozí implementaci fáze 0 je potvrzený tento model:

- produkce běží v samostatném produkčním Supabase projektu,
- lokální vývoj používá lokální Supabase nebo jiný opakovatelný lokální neprodukční setup,
- preview prostředí používá sdílený neprodukční Supabase projekt,
- data pro jednotlivé preview verze jsou v tomto neprodukčním projektu oddělena ve schématech `preview_<identifikator>`,
- identifikátor preview schema je navázaný na stabilní identifikátor změny, přednostně PR číslo.

Tento model respektuje požadavek na **schema-per-feature**, zachovává čistou hranici vůči produkci a současně nevyžaduje zakládání samostatného Supabase projektu pro každé preview.

### Pravidla práce s produkčními daty v preview

Pro výchozí implementaci fáze 0 se potvrzuje tento model preview snapshotů:

- preview používá **anonymizovaný snapshot produkčních dat**, ne plný surový snapshot,
- minimálně kontaktní údaje Uživatelů, jako jsou jméno, email a telefon, se do preview nepřenášejí v produkční podobě,
- u vybraných Uživatelů jsou anonymizované údaje mapované **stabilně** na konkrétní neprodukční údaje, aby se stejný Uživatel v různých preview snapshotch zobrazoval konzistentně,
- toto stabilní mapování je uložené v **produkční databázi** jako řízená technická konfigurace pro generování neprodukčních snapshotů,
- pro ostatní Uživatele lze použít standardní anonymizaci bez požadavku na dlouhodobě stabilní identitu,
- preview aplikace pracuje výhradně s daty uvnitř schema `preview_<identifikator>`.

#### Odůvodnění

Anonymizace chrání osobní údaje a současně zachovává realistický tvar dat pro testování. Stabilní mapování vybraných Uživatelů na konkrétní neprodukční identity navíc usnadňuje testování funkcí navázaných na kontaktní údaje, protože stejné testovací identity zůstávají konzistentní napříč více preview snapshoty. Uložení mapování do produkční databáze umožňuje řízenou, auditovatelnou a opakovatelnou tvorbu snapshotů bez ruční improvizace.

### Správa databázových změn

Doporučené pravidlo:

- každá změna datového modelu vzniká jako verzovaná migrace v repozitáři,
- žádná strukturální změna produkční databáze se neprovádí ručně bez odpovídající migrace,
- opravy databáze po chybné migraci se řeší novou opravnou migrací, ne nezdokumentovaným SQL zásahem.

### Správa secretů a konfigurace

Doporučené pravidlo:

- repozitář obsahuje jen šablony a dokumentaci proměnných,
- skutečné secrety jsou uložené mimo git,
- každé prostředí má vlastní sadu hodnot,
- server-side citlivé klíče se nikdy nepoužijí v klientské části aplikace.

### Merge politika a ochrana větví

Pro výchozí implementaci fáze 0 je potvrzený tento režim:

- `main` přijímá změny pouze přes pull request,
- povinné status checks jsou minimálně `install`, `lint` a `build`,
- změny zasahující databázové artefakty musí mít i odpovídající databázovou kontrolu,
- výchozí merge režim je **squash merge**,
- přímý push do `main` je zakázaný,
- branch protection mohou obejít pouze určení správci repozitáře.

## Pracovní proudy fáze 0

Fáze 0 má být rozdělena do samostatných pracovních proudů, které lze převést na samostatné issues nebo malé pull requesty.

## Proud A: Základ repozitáře a konvence

### Cíl

Založit minimální aplikační kostru a sjednotit pravidla, podle kterých bude repozitář růst.

### Konkrétní kroky

1. Zvolit a potvrdit frontend stack kompatibilní s Vercel.
2. Založit minimální aplikaci v potvrzeném stacku Next.js + TypeScript, která projde buildem a umí se nasadit.
3. Zavést základní strukturu adresářů pro:
   - aplikaci,
   - sdílené utility,
   - testy nebo smoke ověření,
   - databázové migrace a seed data,
   - provozní dokumentaci.
4. Přidat základní konvence pro:
   - pojmenování souborů,
   - způsob konfigurace prostředí,
   - přípravu skriptů pro `lint` a `build`.
5. Přidat dokument s lokálním startem projektu.

### Výstupy

- první minimální aplikace v repozitáři,
- jednotná struktura složek,
- dokumentovaný postup `install -> run -> lint -> build`.

### Definition of Done

- nový vývojář nebo agent zvládne repozitář spustit podle dokumentace,
- build proběhne bez ručních kroků mimo popsaný setup,
- lint proběhne bez ručních kroků mimo popsaný setup,
- repozitář má jasné místo pro aplikaci, databázi i provozní dokumentaci.

## Proud B: Správa prostředí a proměnných

### Cíl

Jasně oddělit konfiguraci pro local, preview a production tak, aby nebylo možné omylem zaměnit prostředí.

### Konkrétní kroky

1. Sepsat seznam všech proměnných prostředí potřebných pro:
   - běh aplikace,
   - autentizaci,
   - připojení k databázi,
   - identifikaci prostředí,
   - build a smoke testy.
2. Rozdělit proměnné na:
   - veřejné,
   - server-side neveřejné,
   - čistě CI nebo deployment hodnoty.
3. Připravit šablonu `.env.example` nebo obdobný dokumentovaný ekvivalent.
4. Popsat, kde se která hodnota spravuje:
   - lokálně,
   - v GitHub secrets,
   - ve Vercel environment variables,
   - případně v Supabase konfiguraci.
5. Zavést povinnou identifikaci prostředí v aplikaci, aby bylo z UI i logiky zřejmé, zda jde o preview nebo produkci.

### Výstupy

- matice proměnných prostředí,
- dokumentované vlastnictví secretů,
- konzistentní naming prostředí.

### Definition of Done

- existuje jediný zdroj pravdy pro konfiguraci prostředí,
- preview a produkce se nedají zaměnit jen kvůli chybějící proměnné,
- build pipeline umí selhat srozumitelně při nekompletní konfiguraci.

## Proud C: Supabase základ, migrace a seed data

### Cíl

Připravit opakovatelný základ pro databázové změny tak, aby další fáze mohly bezpečně přidávat tabulky a doménové entity.

### Konkrétní kroky

1. Potvrdit model neprodukčního a produkčního Supabase prostředí.
2. Založit databázový adresář nebo ekvivalentní strukturu pro:
   - migrace,
   - seed data,
   - případné pomocné skripty.
3. Zvolit a popsat standardní workflow migrací:
   - vytvoření nové migrace,
   - lokální aplikace migrace,
   - kontrola v CI,
   - aplikace v preview,
   - aplikace v produkci.
4. Připravit první baseline migraci nebo výchozí databázový základ podle zvoleného nástroje.
5. Připravit seed nebo demo data pro minimální smoke scénář.
6. Zavést naming konvenci pro preview schema:
   - ve tvaru `preview_<identifikator>`,
   - kde identifikátor odpovídá přednostně PR číslu,
   - s pravidlem pro cleanup.
7. Popsat, jak bude vznikat anonymizovaný snapshot produkčních dat do preview:
   - které údaje jsou vždy anonymizované,
   - kteří Uživatelé mají stabilní mapování na konkrétní neprodukční identity,
   - kde je toto mapování uložené v produkční databázi,
   - jak se mapování používá při generování preview snapshotu.
8. Popsat lifecycle preview dat:
   - vytvoření schema při vzniku preview,
   - použití snapshotu pouze v rámci daného preview,
   - cleanup po merge, po uzavření PR bez merge a přes expirační fallback.

### Výstupy

- verzované migrace v repozitáři,
- seed data pro lokální a preview ověření,
- dokumentovaný lifecycle preview schema,
- dokumentovaný postup stabilní anonymizace vybraných Uživatelů v preview snapshotu.

### Definition of Done

- databázovou změnu lze vytvořit a přenést do dalšího prostředí standardním postupem,
- seed data lze opakovaně nahrát bez ruční improvizace,
- je jasné, jak se bude jmenovat a uklízet preview schema ve sdíleném neprodukčním projektu,
- je popsané, jak vzniká anonymizovaný preview snapshot a jak se u vybraných Uživatelů používá stabilní mapování neprodukčních kontaktních údajů.

## Proud D: Vercel projekt a deployment

### Cíl

Zajistit, aby každá změna měla automatické preview nasazení a aby `main` vedla na produkční deployment.

### Konkrétní kroky

1. Vytvořit nebo napojit Vercel projekt na repozitář.
2. Nastavit mapování branch a prostředí:
   - pull requesty -> preview,
   - `main` -> production.
3. Nastavit potřebné environment variables ve Vercelu.
4. Ověřit, že preview deployment dostává správnou konfiguraci prostředí.
5. Ověřit, že produkční deployment nepoužívá preview konfiguraci ani preview data.
6. Popsat minimální rollback postup:
   - rollback aplikace,
   - postup při chybné migraci.
7. Doplnit dohledatelnost verze:
   - commit SHA,
   - název prostředí,
   - případně build timestamp v diagnostice nebo status stránce.

### Výstupy

- funkční preview deployment,
- funkční produkční deployment,
- dokumentovaný rollback a dohledatelnost verze.

### Definition of Done

- pull request automaticky vytvoří preview verzi,
- merge do `main` vede na produkční verzi bez ručního skládání kroků,
- z nasazené aplikace lze zjistit, jaký build nebo commit běží.

## Proud E: GitHub CI a pravidla práce s větvemi

### Cíl

Nastavit takovou kontrolní vrstvu, aby se rozbitá nebo neúplná změna nedostala do `main`.

### Konkrétní kroky

1. Připravit CI workflow spouštěné na pull request.
2. Zařadit do minimálního běhu:
   - instalaci závislostí,
   - build,
   - lint jako povinnou statickou validaci,
   - případně kontrolu databázových artefaktů.
3. Připravit selhání při:
   - chybějících proměnných,
   - nevalidním buildu,
   - nekompatibilní databázové změně.
4. Sepsat pravidla merge politiky:
   - merge jen přes pull request,
   - povinné status checks `install`, `lint` a `build`,
   - databázovou kontrolu pro změny databázových artefaktů,
   - výchozí použití `squash merge`,
   - omezení bypassu branch protection jen na určené správce repozitáře.
5. Nastavit ochranu větve `main` tak, aby odpovídala dokumentaci.

### Výstupy

- GitHub workflow pro CI,
- popsaná merge politika,
- základ branch protection pravidel.

### Definition of Done

- pull request nelze považovat za připravený bez zelených povinných kontrol `install`, `lint` a `build`,
- `main` je chráněná proti obcházení standardního toku a nepřijímá přímý push,
- pravidla v GitHubu odpovídají tomu, co je napsané v dokumentaci.

## Proud F: Smoke ověření a minimální provozní rutina

### Cíl

Mít jednoduchý, opakovatelný způsob ověření, že deploy skutečně funguje i mimo samotný build.

### Konkrétní kroky

1. Definovat minimální smoke scénář pro aplikaci po nasazení.
2. Scénář má ověřit alespoň:
   - že aplikace odpovídá,
   - že je zřejmé prostředí,
   - že funguje základní přístup ke konfiguraci,
   - případně že je dostupné napojení na databázi nebo seed data.
3. Rozhodnout, zda bude smoke test:
   - manuální checklist,
   - automatizovaný script,
   - nebo kombinace obojího.
4. Zapsat postup, kdo a kdy smoke ověření spouští.

### Výstupy

- minimální smoke checklist nebo skript,
- dokumentovaný krok po preview a po produkčním deployi.

### Definition of Done

- po deployi existuje krátký, opakovatelný postup ověření,
- tým nemusí improvizovat, co vlastně po nasazení zkontrolovat.

## Doporučené pořadí implementace

Níže je doporučené pořadí tak, aby se co nejdříve dostavil funkční technický základ:

1. **Uzavřít otevřená rozhodnutí**
   - frontend stack,
   - model neprodukčních databázových prostředí,
   - merge politika,
   - práce s produkčními snapshoty pro preview.

2. **Založit aplikační kostru**
   - minimální app,
   - build,
   - základní README nebo runbook pro spuštění.

3. **Zavést konfiguraci prostředí**
   - matice proměnných,
   - `.env.example`,
   - rozlišení local, preview a production.

4. **Přidat databázový základ**
   - migrace,
   - seed data,
   - popis preview schema konvence,
   - popis anonymizovaného preview snapshotu a stabilního mapování vybraných Uživatelů.

5. **Zprovoznit CI v GitHubu**
   - install,
   - build,
   - validace.

6. **Napojit Vercel preview a production**
   - repo integrace,
   - proměnné,
   - mapování branch.

7. **Dopsat smoke ověření a rollback postup**
   - manuální checklist nebo skript,
   - status nebo diagnostická obrazovka,
   - základní provozní dokumentace.

8. **Provést zkušební průchod malou změnou**
   - otevřít testovací pull request,
   - nechat proběhnout CI,
   - ověřit preview,
   - po merge ověřit produkční deployment.

## Doporučené rozpadnutí do backlogu

Pro praktické spuštění implementace je vhodné rozdělit fázi 0 minimálně na následující položky:

### F0-01: Potvrzení technických rozhodnutí

- potvrdit a zapsat stack Next.js + TypeScript + App Router + ESLint,
- uzavřít model prostředí,
- uzavřít merge politiku,
- zapsat rozhodnutí do dokumentace.

### F0-02: Založení minimální aplikace

- vytvořit nasaditelný app shell v Next.js App Router,
- doplnit základní skripty pro `lint` a `build`,
- ověřit lokální běh.

### F0-03: Konfigurace prostředí a secretů

- doplnit `.env.example`,
- sepsat matici proměnných,
- doplnit rozlišení prostředí v aplikaci.

### F0-04: Supabase baseline

- založit migrace,
- připravit seed data,
- popsat preview schema naming a cleanup ve sdíleném neprodukčním projektu,
- navrhnout a popsat mechanismus stabilního mapování vybraných Uživatelů na neprodukční kontaktní údaje,
- popsat uložení tohoto mapování v produkční databázi a jeho použití při tvorbě snapshotu.

### F0-05: GitHub CI

- vytvořit workflow v `.github/workflows/ci.yml`,
- zavést minimální validace `install`, `lint`, `build` a `validate-supabase`,
- zkontrolovat `.env.example`, verzované migrace a demo seed data,
- nastavit povinné status checks v GitHub branch protection pro `main`.

### F0-06: Vercel integrace

- propojit repozitář a Vercel,
- nastavit preview a production,
- doplnit environment variables,
- commitnout repo-side `vercel.json`, validační skript a diagnostiku prostředí,
- dopsat provozní runbook pro mapování preview a production proměnných ve Vercelu.

### F0-07: Smoke test a diagnostika

- definovat smoke scénář,
- doplnit status nebo environment indikaci,
- ověřit první end-to-end deploy.

### F0-08: Zkušební delivery průchod

- vytvořit malou nefunkční nebo minimální změnu,
- ověřit PR pipeline,
- ověřit merge do `main`,
- potvrdit, že fáze 0 je skutečně připravená pro fázi 1.

Pro tuto backlogovou položku má vzniknout i stručný provozní runbook, který oddělí:

- co lze potvrdit už v preview verzi otevřeného pull requestu,
- co je potřeba ověřit až po merge do `main`,
- jaké důkazy mají zůstat dohledatelné v aplikaci nebo v delivery nástrojích.

## Checklist před spuštěním implementace

Před prvním kódovým PR mají být potvrzené tyto body:

- [x] je potvrzený frontend stack: Next.js + TypeScript + App Router + ESLint,
- [x] je potvrzený model local / preview / production,
- [ ] je určený vlastník Vercel projektu,
- [ ] je určený vlastník Supabase prostředí,
- [ ] je jasné, kdo spravuje produkční secrety,
- [x] je potvrzená merge politika do `main`,
- [x] je rozhodnuto, jak se bude identifikovat preview schema, přednostně pomocí PR čísla,
- [x] je určeno, že preview data používají anonymizovaný snapshot místo plného surového snapshotu,
- [x] je rozhodnuto, kteří Uživatelé mají stabilní mapování na konkrétní neprodukční kontaktní údaje,
- [x] je určeno, že mapování anonymizovaných identit je uložené v produkční databázi,
- [x] je jasné, jak bude probíhat cleanup preview schemat,
- [x] je schválené minimální CI minimum: install, lint, build a odpovídající databázová kontrola pro změny databázových artefaktů.

## Checklist uzavření fáze 0

Fázi 0 lze považovat za dokončenou teprve tehdy, když platí vše níže:

- [ ] repozitář obsahuje minimální nasaditelnou aplikaci,
- [ ] lokální spuštění je popsané a opakovatelné,
- [ ] databázové změny jsou verzované v repozitáři,
- [ ] existuje seed nebo demo dataset pro vývoj a smoke scénář,
- [ ] pull request automaticky spouští CI,
- [ ] preview deployment vzniká automaticky,
- [ ] merge do `main` spouští produkční deployment,
- [ ] preview a production jsou zřetelně oddělené,
- [ ] existuje základní smoke ověření po deployi,
- [ ] existuje dokumentovaný rollback postup pro aplikaci i databázové změny,
- [ ] je možné dohledat, jaký commit běží v preview a produkci.

## Rizika specifická pro fázi 0

### Riziko: příliš brzký výběr detailních technologií bez dokumentace

Pokud se stack zvolí implicitně jen podle prvního implementačního kroku a nepropíše se do dokumentace, další agenti mohou předpoklady rozbít nebo obejít.

### Riziko: preview bez jasného datového modelu

Pokud se preview deployment rozběhne dřív, než je rozhodnuté, jak fungují preview schema a jejich cleanup, vznikne technický dluh dřív, než začne přinášet hodnotu.

### Riziko: ruční databázové zásahy mimo migrace

Jakmile se jednou dovolí ruční změny bez verzovaného postupu, velmi rychle se rozpadne opakovatelnost prostředí.

### Riziko: záměna preview a produkce

Pokud nebude prostředí rozlišeno v konfiguraci i v UI, už ve fázi 1 vznikne vysoké riziko chybné práce s daty.

## Doporučení pro navazující fázi 1

Fáze 1 by měla začít až po zkušebním end-to-end průchodu přes:

- pull request,
- CI,
- preview deployment,
- základní smoke ověření,
- merge do `main`,
- produkční deployment.

Teprve v této chvíli má smysl přidávat přihlášení Uživatele, chráněnou část aplikace a rozlišení rolí v aplikačním shellu.
