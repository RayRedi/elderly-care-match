import { syncPendingLeads } from "@/lib/leads";

export async function POST() {
  try {
    const result = await syncPendingLeads();
    return Response.json({ ok: true, ...result });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Sync failed.",
      },
      { status: 500 }
    );
  }
}
