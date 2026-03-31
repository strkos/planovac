# Smoke overeni

Tato slozka je rezervovana pro jednoducha smoke overeni ve fazi 0 a navazujicich iteracich.

Aktualne baseline repozitare overuje:

- lokalni start aplikace,
- pruchod `npm run lint`,
- pruchod `npm run build`,
- pruchod `npm run ci:validate`,
- pritomnost verzovanych Supabase migraci,
- pritomnost demo seed dat pro neprodukcni overeni.

Navazujici iterace F0-05 az F0-07 maji doplnit:

- prvni realny smoke scenar nad preview deploymentem,
- diagnostiku vazby mezi buildem, prostredim a preview schematem.
