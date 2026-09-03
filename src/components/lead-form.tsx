"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2Icon } from "lucide-react";

import { ChoiceChips } from "@/components/choice-chips";
import { useLeadSelection, type CareType } from "@/components/lead-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import {
  careTypes,
  consentText,
  site,
  timelines,
  whoNeedsCare,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type Who = (typeof whoNeedsCare)[number];
type Timeline = (typeof timelines)[number]["id"];

type FormState = {
  name: string;
  phone: string;
  zip: string;
  email: string;
  whoNeedsCare: Who | "";
  timeline: Timeline | "";
  consent: boolean;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  zip: "",
  email: "",
  whoNeedsCare: "",
  timeline: "",
  consent: false,
};

const fieldClass = "h-11 bg-background text-base md:text-base";

export function LeadForm({ className }: { className?: string }) {
  const { careType, setCareType } = useLeadSelection();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormState | "careType", string>>
  >({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle"
  );

  useEffect(() => {
    if (!careType) return;
    setFieldErrors((current) =>
      current.careType ? { ...current, careType: undefined } : current
    );
  }, [careType]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
    setError(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = {
      name: String(data.get("name") ?? form.name),
      phone: String(data.get("phone") ?? form.phone),
      zip: String(data.get("zip") ?? form.zip),
      email: String(data.get("email") ?? form.email),
      whoNeedsCare: (String(data.get("whoNeedsCare") || form.whoNeedsCare) ||
        "") as Who | "",
      timeline: (String(data.get("timeline") || form.timeline) ||
        "") as Timeline | "",
      consent: data.get("consent") === "on" || form.consent,
    };
    const selectedCare = (String(data.get("careType") || careType) ||
      "") as CareType | "";

    setForm(next);
    if (selectedCare) {
      setCareType(selectedCare);
    }

    const nextErrors: Partial<Record<keyof FormState | "careType", string>> = {};
    if (next.name.trim().length < 2) nextErrors.name = "Please enter your name.";
    if (next.phone.replace(/\D/g, "").length < 10) {
      nextErrors.phone = "Use a 10-digit phone number.";
    }
    if (!/^\d{5}(-\d{4})?$/.test(next.zip.trim())) {
      nextErrors.zip = "Use a 5-digit ZIP code.";
    }
    if (!next.whoNeedsCare) nextErrors.whoNeedsCare = "Tell us who needs care.";
    if (!selectedCare) {
      nextErrors.careType = "Choose the kind of care you are considering.";
    }
    if (!next.timeline) nextErrors.timeline = "Choose a timeline.";
    if (!next.consent) {
      nextErrors.consent = "Please check the box so we can call you back.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setStatus("error");
      setError("A few fields still need your attention.");
      return;
    }

    setStatus("saving");
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...next,
          careType: selectedCare,
          consent: true,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "We could not send that. Please call us.");
      }
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please call us and we will help from there."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        id="get-help"
        className={cn(
          "scroll-mt-24 rounded-3xl bg-card p-6 shadow-sm ring-1 ring-foreground/10 sm:p-8",
          className
        )}
      >
        <CheckCircle2Icon className="size-10 text-primary" aria-hidden />
        <h2 className="font-heading mt-4 text-2xl text-foreground">
          Thank you. We have your note.
        </h2>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Someone from Elderly Care Match will call you back during business hours.
          If this is a hospital discharge today, call us now.
        </p>
        <a
          href={site.phoneHref}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-5 text-base font-medium text-primary-foreground"
        >
          Call {site.phone}
        </a>
      </div>
    );
  }

  return (
    <form
      id="get-help"
      onSubmit={onSubmit}
      noValidate
      className={cn(
        "scroll-mt-24 rounded-3xl bg-card p-6 shadow-sm ring-1 ring-foreground/10 sm:p-8",
        className
      )}
    >
      <p className="text-sm font-medium tracking-wide text-primary uppercase">
        Free callback
      </p>
      <h2 className="font-heading mt-1 text-2xl text-foreground sm:text-3xl">
        Tell us the situation. We will call you.
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        No account needed. We do not push a particular building.
      </p>

      <input type="hidden" name="whoNeedsCare" value={form.whoNeedsCare} />
      <input type="hidden" name="careType" value={careType} />
      <input type="hidden" name="timeline" value={form.timeline} />

      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            className={fieldClass}
          />
          {fieldErrors.name ? (
            <p className="text-sm text-destructive">{fieldErrors.name}</p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              aria-invalid={Boolean(fieldErrors.phone)}
              className={fieldClass}
            />
            {fieldErrors.phone ? (
              <p className="text-sm text-destructive">{fieldErrors.phone}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zip">ZIP code</Label>
            <Input
              id="zip"
              name="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              value={form.zip}
              onChange={(event) => update("zip", event.target.value)}
              aria-invalid={Boolean(fieldErrors.zip)}
              className={fieldClass}
            />
            {fieldErrors.zip ? (
              <p className="text-sm text-destructive">{fieldErrors.zip}</p>
            ) : null}
          </div>
        </div>

        <ChoiceChips
          legend="Who needs care?"
          value={form.whoNeedsCare}
          onChange={(value) => update("whoNeedsCare", value)}
          options={whoNeedsCare.map((id) => ({ id, label: id }))}
          error={fieldErrors.whoNeedsCare}
        />

        <ChoiceChips
          legend="What kind of care?"
          value={careType}
          onChange={(value) => setCareType(value)}
          options={careTypes.map((item) => ({ id: item.id, label: item.title }))}
          error={fieldErrors.careType}
        />

        <ChoiceChips
          legend="How soon?"
          value={form.timeline}
          onChange={(value) => update("timeline", value)}
          options={timelines}
          error={fieldErrors.timeline}
        />

        <div className="grid gap-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className={fieldClass}
          />
        </div>

        <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={(event) => update("consent", event.target.checked)}
            aria-invalid={Boolean(fieldErrors.consent)}
            className="mt-1 size-4 shrink-0 rounded border-input accent-primary"
          />
          <span>
            {consentText}{" "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              Privacy
            </a>
          </span>
        </label>
        {fieldErrors.consent ? (
          <p className="-mt-3 text-sm text-destructive">{fieldErrors.consent}</p>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "saving"}
          className={cn(buttonVariants({ variant: "default" }), "h-12 w-full text-base")}
        >
          {status === "saving" ? "Sending…" : "Request a callback"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Prefer to talk now?{" "}
          <a href={site.phoneHref} className="font-medium text-foreground underline underline-offset-2">
            {site.phone}
          </a>
        </p>
      </div>
    </form>
  );
}
