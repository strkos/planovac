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

### 1. Konkrétní frontend stack

Potvrzené je pouze to, že frontend bude hostovaný na Vercelu. Je potřeba výslovně zvolit:

- framework nebo runtime,
- způsob buildování,
- základní testovací a linting nástroje,
- formát základní aplikační kostry.

Bez tohoto rozhodnutí nelze korektně dokončit build pipeline.

### 2. Model neprodukčních databázových prostředí

Je třeba potvrdit, zda bude neprodukční provoz řešen:

- jedním sdíleným neprodukčním Supabase projektem,
- nebo více oddělenými Supabase projekty.

Současně je nutné potvrdit, kde přesně bude použit model `schema-per-feature` pro preview data.

### 3. Pravidla práce s produkčními daty v preview

Z use journeys vyplývá, že preview má pracovat se snapshotem produkčních dat. Před implementací je potřeba potvrdit:

- zda preview používá plný snapshot,
- zda se některé osobní údaje anonymizují,
- kdo a kdy snapshot vytváří,
- kdy a jak se preview schema uklízí.

### 4. Minimální merge politika

Je nutné potvrdit:

- zda je merge do `main` povolen jen přes pull request,
- které CI kontroly budou povinné,
- zda je dovoleno squash merge, merge commit nebo rebase merge,
- kdo může obejít ochranu branch pravidel.

## Doporučený cílový obraz pro fázi 0

Následující část je **návrh technického směru**, který je kompatibilní se stávajícím zadáním a dává dobrý základ pro další fáze.

### Prostředí

Doporučené minimální rozdělení prostředí:

- **local** - lokální vývoj,
- **preview** - automaticky vznikající preview nasazení k pull requestům,
- **production** - ostré prostředí po merge do `main`.

### Datový model prostředí

Doporučený výchozí model:

- produkce běží na produkčním Supabase prostředí,
- lokální vývoj používá lokální Supabase nebo jiný opakovatelný neprodukční setup,
- preview prostředí používá neprodukční Supabase kontext,
- data pro jednotlivé preview verze jsou oddělena ve schématech `preview_<identifikator>`.

Tento návrh respektuje požadavek na **schema-per-feature** a současně nevyžaduje, aby každé preview zakládalo nový samostatný produkční projekt.

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

## Pracovní proudy fáze 0

Fáze 0 má být rozdělena do samostatných pracovních proudů, které lze převést na samostatné issues nebo malé pull requesty.

## Proud A: Základ repozitáře a konvence

### Cíl

Založit minimální aplikační kostru a sjednotit pravidla, podle kterých bude repozitář růst.

### Konkrétní kroky

1. Zvolit a potvrdit frontend stack kompatibilní s Vercel.
2. Založit minimální aplikaci, která projde buildem a umí se nasadit.
3. Zavést základní strukturu adresářů pro:
   - aplikaci,
   - sdílené utility,
   - testy nebo smoke ověření,
   - databázové migrace a seed data,
   - provozní dokumentaci.
4. Přidat základní konvence pro:
   - pojmenování souborů,
   - způsob konfigurace prostředí,
   - přípravu skriptů pro build a validaci.
5. Přidat dokument s lokálním startem projektu.

### Výstupy

- první minimální aplikace v repozitáři,
- jednotná struktura složek,
- dokumentovaný postup `install -> run -> build`.

### Definition of Done

- nový vývojář nebo agent zvládne repozitář spustit podle dokumentace,
- build proběhne bez ručních kroků mimo popsaný setup,
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
6. Navrhnout naming konvenci pro preview schema:
   - například podle feature branch nebo PR čísla,
   - s pravidlem pro cleanup.
7. Popsat, jak bude v budoucnu vznikat snapshot produkčních dat do preview, i pokud samotná automatizace ještě nebude v první iteraci plně hotová.

### Výstupy

- verzované migrace v repozitáři,
- seed data pro lokální a preview ověření,
- dokumentovaný lifecycle preview schema.

### Definition of Done

- databázovou změnu lze vytvořit a přenést do dalšího prostředí standardním postupem,
- seed data lze opakovaně nahrát bez ruční improvizace,
- je jasné, jak se bude jmenovat a uklízet preview schema.

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
   - lint nebo jinou statickou validaci,
   - případně kontrolu databázových artefaktů.
3. Připravit selhání při:
   - chybějících proměnných,
   - nevalidním buildu,
   - nekompatibilní databázové změně.
4. Sepsat pravidla merge politiky:
   - merge jen přes pull request,
   - povinné status checks,
   - minimální požadavky na review, pokud budou používány.
5. Nastavit ochranu větve `main` tak, aby odpovídala dokumentaci.

### Výstupy

- GitHub workflow pro CI,
- popsaná merge politika,
- základ branch protection pravidel.

### Definition of Done

- pull request nelze považovat za připravený bez zeleného CI,
- `main` je chráněná proti obcházení standardního toku,
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
   - popis preview schema konvence.

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

- uzavřít stack,
- uzavřít model prostředí,
- uzavřít merge politiku,
- zapsat rozhodnutí do dokumentace.

### F0-02: Založení minimální aplikace

- vytvořit nasaditelný app shell,
- doplnit základní build skripty,
- ověřit lokální běh.

### F0-03: Konfigurace prostředí a secretů

- doplnit `.env.example`,
- sepsat matici proměnných,
- doplnit rozlišení prostředí v aplikaci.

### F0-04: Supabase baseline

- založit migrace,
- připravit seed data,
- popsat preview schema naming a cleanup.

### F0-05: GitHub CI

- vytvořit workflow,
- zavést minimální validace,
- nastavit povinné status checks.

### F0-06: Vercel integrace

- propojit repozitář a Vercel,
- nastavit preview a production,
- doplnit environment variables.

### F0-07: Smoke test a diagnostika

- definovat smoke scénář,
- doplnit status nebo environment indikaci,
- ověřit první end-to-end deploy.

### F0-08: Zkušební delivery průchod

- vytvořit malou nefunkční nebo minimální změnu,
- ověřit PR pipeline,
- ověřit merge do `main`,
- potvrdit, že fáze 0 je skutečně připravená pro fázi 1.

## Checklist před spuštěním implementace

Před prvním kódovým PR mají být potvrzené tyto body:

- [ ] je potvrzený frontend stack,
- [ ] je potvrzený model local / preview / production,
- [ ] je určený vlastník Vercel projektu,
- [ ] je určený vlastník Supabase prostředí,
- [ ] je jasné, kdo spravuje produkční secrety,
- [ ] je potvrzená merge politika do `main`,
- [ ] je rozhodnuto, jak se bude identifikovat preview schema,
- [ ] je určeno, zda preview data používají plný nebo anonymizovaný snapshot,
- [ ] je jasné, jak bude probíhat cleanup preview schemat,
- [ ] je schválené minimální CI minimum: install, build, validace.

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
