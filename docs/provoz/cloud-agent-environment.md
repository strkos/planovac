# Cloud agent environment pro Node/npm

Tento dokument popisuje doporučené nastavení cloud agent environmentu pro repozitář **planovac**, aby byl po startu připravený na:

- `npm run lint`
- `npm run build`

bez ručního `npm install`.

## Kontext repozitáře

Repozitář obsahuje rootový **Next.js** projekt se soubory:

- `package.json`
- `package-lock.json`
- `next.config.ts`

Závislosti jsou tedy potřeba instalovat deterministicky podle lockfilu, ne volným `npm install`.

## Doporučený runtime

Cloud agent image nebo startup prostředí má mít minimálně:

- **Node.js 20.9+**
- **npm 10+**

Tyto požadavky jsou zapsané i v `package.json` v poli `engines`.

## Doporučený startup krok

Po otevření workspace má cloud agent automaticky spustit:

```bash
./scripts/bootstrap-cloud-agent.sh
```

Skript:

- ověří přítomnost `npm` a `package-lock.json`,
- spočítá hash `package-lock.json`,
- porovná jej s poslední úspěšnou instalací v `node_modules/.package-lock.hash`,
- při změně lockfilu nebo chybějícím `node_modules` provede `npm ci`,
- jinak instalaci přeskočí.

Tím je zajištěno, že:

- agent po startu nemusí ručně spouštět `npm install`,
- závislosti odpovídají přesně `package-lock.json`,
- při opakovaném startu se zbytečně neinstaluje znovu.

## Proč `npm ci` místo `npm install`

Pro tento repozitář je vhodnější `npm ci`, protože:

- respektuje existující `package-lock.json`,
- dává opakovatelný výsledek pro agenty i CI,
- snižuje riziko, že `lint` nebo `build` poběží nad jinou sadou závislostí než lokálně nebo v pipeline.

## Doporučení pro env setup agenta

Pokud se cloud agent environment nastavuje přes startup script nebo post-checkout hook, použijte logiku:

```bash
if [ -f package-lock.json ]; then
  ./scripts/bootstrap-cloud-agent.sh
fi
```

Tato podmínka je vhodná i do sdíleného environmentu pro více repozitářů, protože bootstrap spustí jen tam, kde je skutečně Node/npm projekt s lockfilem.

## Ověření po startu

Po proběhnutí bootstrapu má v rootu repozitáře projít:

```bash
npm run ci:validate
npm run lint
npm run build
```

Pokud by v budoucnu vznikl monorepo layout nebo více `package.json`, musí se tento dokument a bootstrap skript odpovídajícím způsobem upravit.
