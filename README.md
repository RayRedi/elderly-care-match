# Elderly Care Match

A simple landing page for Washington families looking for senior care. The form sends each inquiry to a Notion database called **Family Care Leads**. If Notion is not configured, leads are saved locally in `.data/leads.json` so nothing is lost.

Free for families. Adult family homes, assisted living, memory care, and nursing homes. We do not push a particular building.

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

## Connect Notion

1. Open the private [Family Care Leads](https://www.notion.so/86e4fdfe81964fbf80a521e0f8176afc) database.
2. Create an internal integration at [notion.so/my-integrations](https://www.notion.so/my-integrations) and copy the token.
3. Share the database with that integration.
4. Put the token in `.env.local`:

```bash
NOTION_TOKEN=secret_...
NOTION_DATABASE_ID=86e4fdfe81964fbf80a521e0f8176afc
```

Restart the dev server. New form submissions appear as rows with name, phone, ZIP, care type, timeline, and consent.

## What this is not

This is a callback page, not the full [elderlycarematch.com](https://www.elderlycarematch.com/) application portal. It is also not [eldercarematch.com](https://eldercarematch.com/), which is a different company.
