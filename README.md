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

## Live URL

The callback page is live on Vercel:

**https://elderly-care-match.vercel.app**

The project is named `elderly-care-match` under the **business assistant** team. Production
environment variables connect the form to Family Care Leads, and Vercel Authentication is
disabled so families can open it without logging in.

Put this URL in Google Business Profile, Instagram bio, 211/listing copy, ads, and hospital-desk
cards.

The homepage is a five-step guided callback form. Submissions go to Family Care Leads.

[www.elderlycarematch.com](https://www.elderlycarematch.com/) stays as-is. This page is only the
capture funnel into Family Care Leads.

## Connect Notion

Until this is done, submissions save to `.data/leads.json` and do **not** appear in Notion.

1. Create an internal integration at [notion.so/my-integrations](https://www.notion.so/my-integrations) and copy the token (starts with `ntn_` or `secret_`).
2. Open the [Family Care Leads](https://www.notion.so/86e4fdfe81964fbf80a521e0f8176afc) database, then use the `···` menu → **Connections** → **Connect to** → your integration. The API cannot see a database that has not been shared with it.
3. Put the token in `.env.local`:

```bash
NOTION_TOKEN=ntn_...
NOTION_DATABASE_ID=86e4fdfe81964fbf80a521e0f8176afc
```

4. Restart the dev server.

New submissions now create a row with name, phone, city, state, ZIP, care type, timeline, and consent.

### Backfill leads captured before setup

Nothing captured during setup is lost. With the dev server running:

```bash
npm run sync:notion
```

That pushes every local lead that has no `syncedAt` into Notion and marks it synced, so re-running it will not create duplicates.

## What this is not

This is a callback page, not the full [elderlycarematch.com](https://www.elderlycarematch.com/) application portal. It is also not [eldercarematch.com](https://eldercarematch.com/), which is a different company.
