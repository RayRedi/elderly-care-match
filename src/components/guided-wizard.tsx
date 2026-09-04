"use client";

import { useState, type ReactNode } from "react";
import { Check, CheckCircle2, Phone } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  careTypes,
  consentText,
  site,
  timelines,
  whoNeedsCare,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type Who = (typeof whoNeedsCare)[number];
type CareType = (typeof careTypes)[number]["id"];
type Timeline = (typeof timelines)[number]["id"];

type Draft = {
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  zip: string;
  whoNeedsCare: Who | "";
  careType: CareType | "";
  timeline: Timeline | "";
  consent: boolean;
};

const emptyDraft: Draft = {
  name: "",
  phone: "",
  email: "",
  city: "",
  state: "WA",
  zip: "",
  whoNeedsCare: "",
  careType: "",
  timeline: "",
  consent: false,
};

const primaryButton =
  "inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButton =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-white px-5 text-base font-semibold text-foreground transition hover:bg-muted";
const inputClass = "h-12 bg-white px-3 text-base md:text-base";

const whoOptions = whoNeedsCare.map((id) => ({ id, label: id }));
const careOptions = careTypes.map((care) => ({
  id: care.id,
  label: care.title,
  description: care.blurb,
}));
const timelineOptions = timelines.map((item) => ({
  id: item.id,
  label: item.label,
}));

export function GuidedWizard() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const steps = ["Person", "Care", "Timing", "Location", "Contact"];

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  function continueStep() {
    let nextError: string | null = null;
    if (step === 0 && !draft.whoNeedsCare) nextError = "Choose who needs care.";
    if (step === 1 && !draft.careType) {
      nextError = "Choose a care type, or choose “Not sure yet.”";
    }
    if (step === 2 && !draft.timeline) {
      nextError = "Choose the timing that feels closest.";
    }
    if (step === 3) {
      if (draft.city.trim().length < 2) {
        nextError = "Enter the city where care is needed.";
      } else if (!/^\d{5}(-\d{4})?$/.test(draft.zip.trim())) {
        nextError = "Enter a 5-digit ZIP code.";
      }
    }
    if (nextError) {
      setError(nextError);
      return;
    }
    setError(null);
    setStep((current) => current + 1);
  }

  async function finish() {
    if (draft.name.trim().length < 2) {
      setError("Enter your name so we know who to ask for.");
      return;
    }
    if (draft.phone.replace(/\D/g, "").length < 10) {
      setError("Enter a 10-digit phone number.");
      return;
    }
    if (!draft.consent) {
      setError("Check the permission box so we can call you.");
      return;
    }

    setStatus("saving");
    setError(null);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, source: "landing" }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "We could not send your request.");
      }
      setStatus("success");
    } catch (submitError) {
      setStatus("idle");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not send your request. Please call us instead.",
      );
    }
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Washington families · Free to call
        </p>
        <h1 className="font-heading mt-2 text-4xl leading-tight sm:text-5xl">
          Find senior care without the runaround.
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Answer a few short questions. We will call you back and help you
          compare licensed adult family homes, assisted living, memory care, and
          nursing homes. We do not charge families, and we do not push a
          building.
        </p>
      </div>

      {status === "success" ? (
        <div
          id="get-help"
          className="mx-auto max-w-2xl rounded-3xl border border-primary/20 bg-white p-8 text-center shadow-sm"
        >
          <CheckCircle2 className="mx-auto size-12 text-primary" aria-hidden />
          <h2 className="font-heading mt-4 text-3xl">Your callback is requested.</h2>
          <p className="mx-auto mt-3 max-w-md text-lg leading-7 text-muted-foreground">
            Someone from Elderly Care Match will call during business hours. If
            this is a hospital discharge today, call us now.
          </p>
          <a href={site.phoneHref} className={cn(primaryButton, "mt-6")}>
            <Phone className="mr-2 size-5" aria-hidden />
            Call {site.phone}
          </a>
        </div>
      ) : (
        <div
          id="get-help"
          className="mx-auto max-w-2xl scroll-mt-24 overflow-hidden rounded-3xl border border-border bg-white shadow-lg shadow-primary/5"
        >
          <div className="border-b border-border bg-secondary/70 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>
                Step {step + 1} of {steps.length}
              </span>
              <span className="text-muted-foreground">About 1 minute</span>
            </div>
            <div
              className="mt-3 flex gap-2"
              aria-label={`Step ${step + 1} of ${steps.length}`}
            >
              {steps.map((label, index) => (
                <div key={label} className="flex-1">
                  <div
                    className={cn(
                      "h-2 rounded-full",
                      index <= step ? "bg-primary" : "bg-primary/15",
                    )}
                  />
                  <span className="sr-only">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 sm:p-8">
            {step === 0 ? (
              <ChoiceGroup
                legend="Who needs care?"
                value={draft.whoNeedsCare}
                options={whoOptions}
                onChange={(value) => update("whoNeedsCare", value)}
              />
            ) : null}
            {step === 1 ? (
              <ChoiceGroup
                legend="What kind of care are you considering?"
                value={draft.careType}
                options={careOptions}
                onChange={(value) => update("careType", value)}
                large
              />
            ) : null}
            {step === 2 ? (
              <ChoiceGroup
                legend="How soon might care be needed?"
                value={draft.timeline}
                options={timelineOptions}
                onChange={(value) => update("timeline", value)}
              />
            ) : null}
            {step === 3 ? (
              <>
                <h2 className="mb-5 text-2xl font-semibold">Where is care needed?</h2>
                <LocationFields draft={draft} update={update} />
              </>
            ) : null}
            {step === 4 ? (
              <div className="grid gap-5">
                <h2 className="text-2xl font-semibold">How can we reach you?</h2>
                <ContactFields draft={draft} update={update} />
                <Consent
                  checked={draft.consent}
                  onChange={(value) => update("consent", value)}
                />
              </div>
            ) : null}
            {error ? (
              <p
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {error}
              </p>
            ) : null}
            <div className="mt-6 flex gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  className={secondaryButton}
                  onClick={() => {
                    setError(null);
                    setStep((current) => current - 1);
                  }}
                >
                  Back
                </button>
              ) : null}
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  className={cn(primaryButton, "flex-1")}
                  onClick={continueStep}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  className={cn(primaryButton, "flex-1")}
                  disabled={status === "saving"}
                  onClick={finish}
                >
                  {status === "saving" ? "Sending…" : "Request my callback"}
                </button>
              )}
            </div>
            <p className="mt-5 text-center text-base text-muted-foreground">
              Prefer to talk now?{" "}
              <a
                href={site.phoneHref}
                className="font-medium text-foreground underline underline-offset-2"
              >
                {site.phone}
              </a>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function ChoiceGroup<T extends string>({
  legend,
  value,
  options,
  onChange,
  large = false,
}: {
  legend: string;
  value: T | "";
  options: readonly { id: T; label: string; description?: string }[];
  onChange: (value: T) => void;
  large?: boolean;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-lg font-semibold text-foreground">
        {legend}
      </legend>
      <div className={cn("grid gap-3", large && "sm:grid-cols-2")}>
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-xl border px-4 py-3 text-left text-base transition",
                selected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-white text-foreground hover:border-primary/50 hover:bg-secondary",
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border",
                  selected
                    ? "border-white bg-white text-primary"
                    : "border-slate-400",
                )}
              >
                {selected ? <Check className="size-3.5" aria-hidden /> : null}
              </span>
              <span>
                <span className="block font-medium">{option.label}</span>
                {option.description ? (
                  <span
                    className={cn(
                      "mt-0.5 block text-sm leading-5",
                      selected ? "text-white/85" : "text-muted-foreground",
                    )}
                  >
                    {option.description}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ContactFields({
  draft,
  update,
}: {
  draft: Draft;
  update: <K extends keyof Draft>(key: K, value: Draft[K]) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="Your name" htmlFor="name">
        <Input
          id="name"
          autoComplete="name"
          value={draft.name}
          onChange={(event) => update("name", event.target.value)}
          className={inputClass}
        />
      </Field>
      <Field
        label="Best phone number"
        htmlFor="phone"
        hint="We will only use it to help with care options."
      >
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={draft.phone}
          onChange={(event) => update("phone", event.target.value)}
          className={inputClass}
          placeholder="(206) 555-0123"
        />
      </Field>
      <Field label="Email (optional)" htmlFor="email">
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={draft.email}
          onChange={(event) => update("email", event.target.value)}
          className={inputClass}
        />
      </Field>
    </div>
  );
}

function LocationFields({
  draft,
  update,
}: {
  draft: Draft;
  update: <K extends keyof Draft>(key: K, value: Draft[K]) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
      <Field label="City where care is needed" htmlFor="city">
        <Input
          id="city"
          autoComplete="address-level2"
          value={draft.city}
          onChange={(event) => update("city", event.target.value)}
          className={inputClass}
          placeholder="Seattle"
        />
      </Field>
      <Field label="ZIP code" htmlFor="zip">
        <Input
          id="zip"
          inputMode="numeric"
          autoComplete="postal-code"
          value={draft.zip}
          onChange={(event) => update("zip", event.target.value)}
          className={inputClass}
          placeholder="98101"
        />
      </Field>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={htmlFor} className="text-base font-semibold text-foreground">
        {label}
      </label>
      {hint ? <p className="-mt-1 text-sm text-muted-foreground">{hint}</p> : null}
      {children}
    </div>
  );
}

function Consent({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-5 shrink-0 accent-primary"
      />
      <span>
        {consentText}{" "}
        <a href="/privacy" className="font-medium text-foreground underline">
          Privacy
        </a>
      </span>
    </label>
  );
}
