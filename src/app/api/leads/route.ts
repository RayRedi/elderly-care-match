import { captureLead, parseLeadInput } from "@/lib/leads";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Please try again." }, { status: 400 });
  }

  const parsed = parseLeadInput(body);
  if (!parsed.ok) {
    return Response.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  try {
    const result = await captureLead(parsed.data);
    return Response.json({ ok: true, destination: result.destination });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please call us and we will help from there.";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
