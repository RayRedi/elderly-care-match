import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import { consentText, defaultNotionDatabaseId } from "@/lib/site";

const careTypeValues = [
  "Adult family home",
  "Assisted living",
  "Memory care",
  "Nursing home",
  "Not sure",
] as const;

const whoValues = ["Parent", "Spouse", "Self", "Other"] as const;
const timelineValues = [
  "ASAP",
  "Within a month",
  "1-3 months",
  "Just looking",
] as const;

export const leadInputSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z.string().trim().min(1, "Please enter a phone number."),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Use a 5-digit ZIP code."),
  careType: z.enum(careTypeValues, {
    error: "Choose the kind of care you are considering.",
  }),
  whoNeedsCare: z.enum(whoValues, {
    error: "Tell us who needs care.",
  }),
  timeline: z.enum(timelineValues, {
    error: "Choose a timeline.",
  }),
  email: z
    .string()
    .trim()
    .email("That email does not look right.")
    .optional()
    .or(z.literal("")),
  consent: z.literal(true, {
    error: "Please check the box so we can call you back.",
  }),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export type StoredLead = LeadInput & {
  leadId: string;
  phone: string;
  email?: string;
  consentText: string;
  source: string;
  capturedAt: string;
};

export type LeadDestination = "notion" | "local";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizePhone(value: string) {
  const digits = digitsOnly(value);
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }
  return digits;
}

export function parseLeadInput(raw: unknown) {
  const parsed = leadInputSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Please check the form.";
    return { ok: false as const, error: first };
  }

  const phone = normalizePhone(parsed.data.phone);
  if (phone.length !== 10) {
    return {
      ok: false as const,
      error: "Use a 10-digit U.S. phone number.",
    };
  }

  const email = parsed.data.email?.trim();
  return {
    ok: true as const,
    data: {
      ...parsed.data,
      phone,
      email: email || undefined,
    },
  };
}

function formatPhone(phone: string) {
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
}

export function buildStoredLead(input: Omit<LeadInput, "email"> & { email?: string }): StoredLead {
  return {
    ...input,
    leadId: `ecm_${crypto.randomUUID()}`,
    consentText,
    source: "landing",
    capturedAt: new Date().toISOString(),
  };
}

const localFile = path.join(process.cwd(), ".data", "leads.json");

async function saveLocalLead(lead: StoredLead) {
  await mkdir(path.dirname(localFile), { recursive: true });
  let existing: StoredLead[] = [];
  try {
    existing = JSON.parse(await readFile(localFile, "utf8")) as StoredLead[];
  } catch {
    existing = [];
  }
  existing.unshift(lead);
  await writeFile(localFile, JSON.stringify(existing, null, 2));
}

function notionHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
  };
}

function textProp(content: string) {
  return { rich_text: [{ text: { content } }] };
}

async function saveNotionLead(lead: StoredLead) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID ?? defaultNotionDatabaseId;
  if (!token) {
    return false;
  }

  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: lead.name } }] },
    Phone: { phone_number: formatPhone(lead.phone) },
    ZIP: textProp(lead.zip),
    "Care type": { select: { name: lead.careType } },
    "Who needs care": { select: { name: lead.whoNeedsCare } },
    Timeline: { select: { name: lead.timeline } },
    Consent: { checkbox: true },
    "Consent text": textProp(lead.consentText),
    Status: { status: { name: "Not started" } },
    Source: textProp(lead.source),
    "Lead ID": textProp(lead.leadId),
    Captured: { date: { start: lead.capturedAt } },
  };

  if (lead.email) {
    properties.Email = { email: lead.email };
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: notionHeaders(token),
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Notion did not accept the lead (${response.status}): ${detail}`);
  }

  return true;
}

export async function captureLead(input: Omit<LeadInput, "email"> & { email?: string }): Promise<{
  destination: LeadDestination;
}> {
  const lead = buildStoredLead(input);

  try {
    const wroteToNotion = await saveNotionLead(lead);
    if (wroteToNotion) {
      return { destination: "notion" };
    }
  } catch (error) {
    console.error(error);
    await saveLocalLead(lead);
    throw new Error(
      "We could not reach Notion. Your note was saved on this server so it is not lost — try again or call us."
    );
  }

  await saveLocalLead(lead);
  return { destination: "local" };
}
