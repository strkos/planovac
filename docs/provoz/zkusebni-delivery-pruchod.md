# Zkusebni delivery pruchod

Tento dokument je zdrojem pravdy pro backlogovou polozku **F0-08: Zkusebni delivery pruchod**.

Jeho cilem je:

- popsat, jak overit malou nefunkcni nebo minimalni zmenu pres pull request,
- zapsat, jake dukazy ma dodat preview deployment pred mergem,
- potvrdit, co je potreba overit po merge do `main`,
- uzavrit fazi 0 az ve chvili, kdy je delivery retezec dohledatelny od pull requestu po production.

## Kontext navaznosti

F0-08 navazuje na drivejsi vystupy faze 0:

- **F0-05** poskytuje GitHub CI workflow a povinne status checks,
- **F0-06** pripravuje repo-side Vercel integraci a runtime diagnostiku prostredi,
- **F0-07** doplnuje smoke scenar a zakladni provozni diagnostiku.

F0-08 sam o sobe nema pridavat novou domenovou funkcionalitu. Ma potvrdit, ze i mala zmena umi projit stejnym delivery retezcem, ktery se pozdeji pouzije pro realne funkcni iterace.

## Minimalni zmena v repozitari

Pro F0-08 je vhodna takova zmena, ktera:

- je zamerne mala a nema menit domenove chovani systemu,
- umi se citelne projevit v preview i production deploymentu,
- pomuze reviewerovi dohledat branch ref, commit a URL bez dalsich nastroju.

V tomto repozitari tuto roli plni:

- doplneny evidence panel F0-08 na domovske strance v `app/page.tsx`,
- navazujici provozni runbook v tomto dokumentu.

## Co ma overit pull request

Pred mergem do `main` ma reviewer nebo organizator potvrdit tyto body:

1. Pull request spustil CI workflow.
2. Prosly status checks:
   - `install`,
   - `lint`,
   - `build`,
   - `validate-supabase`.
3. Ve Vercelu vznikla preview verze pro danou vetev nebo pull request.
4. Preview verze zobrazuje:
   - branch ref,
   - commit SHA,
   - preview URL,
   - produkcni URL projektu pro porovnani,
   - odliseni preview a production rezimu.
5. Pokud existuje smoke scenar z F0-07, probehl i nad preview verzi.

## Co ma overit merge do `main`

Po merge do `main` je potreba potvrdit:

1. GitHub nebo Vercel spustily navazujici production deployment.
2. Production verze zobrazuje:
   - badge `production`,
   - produkcni URL,
   - commit SHA odpovidajici mergnute zmene.
3. Je mozne porovnat, ze preview i production ukazuji stejny commit nebo navazujici merge commit podle zvolene merge politiky.
4. Runtime diagnostika stale umoznuje dohledat, jaka verze aplikace bezi v production.

Teprve po tomto kroku lze tvrdit, ze F0-08 opravdu probehlo end-to-end. Samotny otevreny pull request potvrzuje jen cast retezce do preview.

## Doporucene dukazy do PR

Do pull requestu nebo jeho popisu je vhodne vlozit:

- odkaz na preview deployment,
- vypis uspesnych status checks,
- kratkou poznamku, jaky commit se zobrazuje v runtime diagnostice,
- po merge take potvrzeni production URL a odpovidajiciho commitu.

Pokud merge jeste neprobehlo, ma byt v PR explicitne uvedeno, ze production cast overeni zustava otevrena.

## Vazba na uzavreni faze 0

F0-08 neuzavira checklist faze 0 automaticky samotnym commitem.

Za uzavreni lze povazovat az stav, kdy je v praxi potvrzene, ze:

- pull request automaticky spousti CI,
- preview deployment vznika automaticky,
- merge do `main` spousti production deployment,
- preview a production jsou zretelne oddelene,
- z obou prostredi je dohledatelny commit.

Pokud nektery z techto bodu stale neni overeny realnym pruchodem, ma zustat v checklistu faze 0 neodskrtnuty.
