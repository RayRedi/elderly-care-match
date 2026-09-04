export function NotionSetupNotice() {
  if (process.env.NODE_ENV === "production" || process.env.NOTION_TOKEN) {
    return null;
  }

  return (
    <div className="border-b border-amber-300/60 bg-amber-100/70 text-amber-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-2.5 text-sm sm:px-6">
        <span className="font-medium">Notion is not connected yet.</span>{" "}
        Submissions are being saved to <code>.data/leads.json</code> on this
        server, not to the Family Care Leads database. Add{" "}
        <code>NOTION_TOKEN</code> to <code>.env.local</code>, restart, then run{" "}
        <code>npm run sync:notion</code> to backfill.
      </div>
    </div>
  );
}
