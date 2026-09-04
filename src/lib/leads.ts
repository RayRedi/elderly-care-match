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
  city: z.string().trim().min(2, "Please enter the city where care is needed.").max(80),
  state: z.string().trim().length(2, "Please choose a state."),
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
  source: z.enum(["landing"]).optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export type StoredLead = Omit<LeadInput, "source"> & {
  leadId: string;
  phone: string;
  email?: string;
  consentText: string;
  source: string;
  capturedAt: string;
  syncedAt?: string;
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
    source: input.source ?? "landing",
    capturedAt: new Date().toISOString(),
  };
}

const localFile = path.join(
  process.env.VERCEL ? "/tmp" : process.cwd(),
  process.env.VERCEL ? "ecm-leads.json" : path.join(".data", "leads.json")
);

export async function readLocalLeads(): Promise<StoredLead[]> {
  try {
    return JSON.parse(await readFile(localFile, "utf8")) as StoredLead[];
  } catch {
    return [];
  }
}

async function writeLocalLeads(leads: StoredLead[]) {
  await mkdir(path.dirname(localFile), { recursive: true });
  await writeFile(localFile, JSON.stringify(leads, null, 2));
}

async function saveLocalLead(lead: StoredLead) {
  const existing = await readLocalLeads();
  existing.unshift(lead);
  await writeLocalLeads(existing);
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
  const token = process.env.NOTION_TOKEN || process.env.ECM_NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID ?? defaultNotionDatabaseId;
  if (!token) {
    return false;
  }

  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: lead.name } }] },
    Phone: { phone_number: formatPhone(lead.phone) },
    City: textProp(lead.city),
    State: textProp(lead.state),
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
      if (!process.env.VERCEL) {
        await saveLocalLead({ ...lead, syncedAt: new Date().toISOString() });
      }
      return { destination: "notion" };
    }
  } catch (error) {
    console.error(error);
    if (!process.env.VERCEL) {
      await saveLocalLead(lead);
    }
    throw new Error(
      "We could not reach Notion. Please call us and we will take your information over the phone."
    );
  }

  if (process.env.VERCEL) {
    throw new Error(
      "This page is not connected to our lead list yet. Please call us and we will help from there."
    );
  }

  await saveLocalLead(lead);
  return { destination: "local" };
}

export type SyncResult = {
  sent: number;
  alreadySynced: number;
  failed: { leadId: string; name: string; error: string }[];
};

export async function syncPendingLeads(): Promise<SyncResult> {
  if (!process.env.NOTION_TOKEN) {
    throw new Error(
      "NOTION_TOKEN is not set. Add it to .env.local and restart the dev server."
    );
  }

  const leads = await readLocalLeads();
  const result: SyncResult = { sent: 0, alreadySynced: 0, failed: [] };

  for (const lead of leads) {
    if (lead.syncedAt) {
      result.alreadySynced += 1;
      continue;
    }
    try {
      await saveNotionLead(lead);
      lead.syncedAt = new Date().toISOString();
      result.sent += 1;
    } catch (error) {
      result.failed.push({
        leadId: lead.leadId,
        name: lead.name,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  await writeLocalLeads(leads);
  return result;
}
