# Specifikace aplikace pro správu spolku (rozšířená)

## 🎯 Cíl aplikace
Aplikace slouží pro:
- evidenci členů spolku
- plánování akcí
- organizaci účasti a rolí
- plánování brigád a činností
- jednoduchou koordinaci mezi členy
- samoobslužný rozvoj funkcionality pomocí AI

---

## 🧩 Hlavní doménové entity

### 👤 Uživatel (User)
- jméno
- email
- telefon
- role (admin / člen)
- stav (aktivní / neaktivní)

---

### 📅 Akce (Event)
- název
- datum a čas
- místo
- popis
- typ akce (pro šablony)

---

### 🛠️ Úkol (Task)
- název
- popis
- typ:
  - role (např. rozhodčí)
  - práce (např. oprava plotu)
- požadovaný počet lidí (`required_count`)
- vazba na akci (volitelná)

---

### ✅ Přiřazení (Task Assignment)
- uživatel
- úkol
- vytvořil (`created_by`)
- typ:
  - main
  - substitute
- stav:
  - pending
  - confirmed
  - rejected

---

## 🤖 Samoobslužný rozvoj aplikace

### Feature request
- název
- popis
- vytvořil
- status

---

### Workflow
1. návrh funkce
2. AI implementace
3. preview verze
4. testování
5. hlasování
6. nasazení

---

## 🧠 Práce s daty

### Schema-per-feature

```
public
preview_123
preview_124
```

### Vytvoření
- CREATE SCHEMA preview_X
- kopie dat z public

### Vlastnosti
- izolovaná data
- snapshot
- žádný návrat dat

### Cleanup
- DROP SCHEMA preview_X

---

## 🧠 Shrnutí

Systém umožňuje:
- správu spolku
- plánování akcí
- samoobslužný vývoj funkcí
