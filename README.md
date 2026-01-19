# Fund4 MVP

Lokales MVP fuer vier Produkte mit Chart, Holdings und Sparplan-Simulation.

## Setup

```bash
cd fund4
```

1) Abhaengigkeiten installieren

```bash
pnpm install
```

2) .env anlegen

```bash
cp .env.example .env
```

3) Datenbank migrieren und seeden

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

4) App starten

```bash
pnpm dev
```

## Login

- Admin: `admin@example.com` / `Admin123!`
- User: `user@example.com` / `User123!`

## Environment

Kopiere `.env.example` nach `.env` und passe bei Bedarf an. SQLite nutzt die Datei `dev.db` im Projekt-Root.

## Datenpflege

- Produktdaten: `data/products.json`
- Preise (CSV): `data/prices/*.csv`
- Holdings (JSON): `data/holdings/*.json`

CSV Format:

```
date,close
2021-01-31,100.12
```

Holdings Schema:

```
{
  "slug": "...",
  "type": "equity_companies",
  "asOfDate": "YYYY-MM-DD",
  "items": [
    { "name": "...", "weightPct": 12.34, "meta": { "ticker": "..." } }
  ]
}
```
