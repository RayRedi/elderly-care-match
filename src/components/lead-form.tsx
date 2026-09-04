"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2Icon } from "lucide-react";

import { ChoiceChips } from "@/components/choice-chips";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import {
  careTypes,
  consentText,
  site,
  states,
  timelines,
  whoNeedsCare,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type Who = (typeof whoNeedsCare)[number];
type Timeline = (typeof timelines)[number]["id"];
type CareType = (typeof careTypes)[number]["id"];

type FormState = {
  name: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  whoNeedsCare: Who | "";
  careType: CareType | "";
  timeline: Timeline | "";
  consent: boolean;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  city: "",
  state: "WA",
  zip: "",
  email: "",
  whoNeedsCare: "",
  careType: "",
  timeline: "",
  consent: false,
};

const fieldClass = "h-11 bg-background text-base md:text-base";

export function LeadForm({ className }: { className?: string }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle"
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
    setError(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = form;
    const selectedCare = form.careType;

    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (next.name.trim().length < 2) nextErrors.name = "Please enter your name.";
    if (next.phone.replace(/\D/g, "").length < 10) {
      nextErrors.phone = "Use a 10-digit phone number.";
    }
    if (next.city.trim().length < 2) {
      nextErrors.city = "Please enter the city where care is needed.";
    }
    if (!next.state) nextErrors.state = "Please choose a state.";
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Free callback
          </p>
          <h2 className="font-heading mt-1 text-2xl text-foreground sm:text-3xl">
            {step === 1 && "What kind of help do you need?"}
            {step === 2 && "Where is care needed?"}
            {step === 3 && "How can we reach you?"}
          </h2>
        </div>
        <p className="shrink-0 pt-1 text-sm font-medium text-muted-foreground">
          {step} of 3
        </p>
      </div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        No account needed. Your answers stay here as you move between steps.
      </p>

      <input type="hidden" name="whoNeedsCare" value={form.whoNeedsCare} />
      <input type="hidden" name="careType" value={form.careType} />
      <input type="hidden" name="timeline" value={form.timeline} />

      <div className="mt-6 grid gap-5">
        {step === 1 ? (
          <>
            <ChoiceChips
              legend="Who needs care?"
              value={form.whoNeedsCare}
              onChange={(value) => update("whoNeedsCare", value)}
              options={whoNeedsCare.map((id) => ({ id, label: id }))}
              error={fieldErrors.whoNeedsCare}
            />
            <ChoiceChips
              legend="What kind of care?"
              value={form.careType}
              onChange={(value) => update("careType", value)}
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
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="grid gap-2">
              <Label htmlFor="city">City where care is needed</Label>
              <Input
                id="city"
                name="city"
                autoComplete="address-level2"
                value={form.city}
                onChange={(event) => update("city", event.target.value)}
                aria-invalid={Boolean(fieldErrors.city)}
                className={fieldClass}
                placeholder="Seattle"
              />
              {fieldErrors.city ? (
                <p className="text-sm text-destructive">{fieldErrors.city}</p>
              ) : null}
            </div>
            <div className="grid grid-cols-[1fr_1fr] gap-4">
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <select
                  id="state"
                  name="state"
                  autoComplete="address-level1"
                  value={form.state}
                  onChange={(event) => update("state", event.target.value)}
                  className={cn(fieldClass, "w-full rounded-lg border border-input px-3 outline-none focus:border-ring focus:ring-3 focus:ring-ring/20")}
                >
                  {states.map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
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
                  placeholder="98101"
                />
                {fieldErrors.zip ? (
                  <p className="text-sm text-destructive">{fieldErrors.zip}</p>
                ) : null}
              </div>
            </div>
            <div className="rounded-2xl bg-secondary p-4 text-sm leading-6 text-secondary-foreground">
              We currently specialize in Washington. If you choose another state,
              we will still call and point you in the right direction.
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
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
          </>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <div className="flex gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep((current) => current - 1);
              }}
              className={cn(buttonVariants({ variant: "outline" }), "h-12 px-5 text-base")}
            >
              Back
            </button>
          ) : null}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                const stepErrors: typeof fieldErrors = {};
                if (step === 1) {
                  if (!form.whoNeedsCare) stepErrors.whoNeedsCare = "Tell us who needs care.";
                  if (!form.careType) stepErrors.careType = "Choose the kind of care you are considering.";
                  if (!form.timeline) stepErrors.timeline = "Choose a timeline.";
                } else {
                  if (form.city.trim().length < 2) stepErrors.city = "Please enter the city where care is needed.";
                  if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim())) stepErrors.zip = "Use a 5-digit ZIP code.";
                }
                if (Object.keys(stepErrors).length) {
                  setFieldErrors((current) => ({ ...current, ...stepErrors }));
                  return;
                }
                setError(null);
                setStep((current) => current + 1);
              }}
              className={cn(buttonVariants({ variant: "default" }), "h-12 flex-1 text-base")}
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === "saving"}
              className={cn(buttonVariants({ variant: "default" }), "h-12 flex-1 text-base")}
            >
              {status === "saving" ? "Sending…" : "Request a callback"}
            </button>
          )}
        </div>
        <p className="text-center text-base text-muted-foreground">
          Prefer to talk now?{" "}
          <a href={site.phoneHref} className="font-medium text-foreground underline underline-offset-2">
            {site.phone}
          </a>
        </p>
      </div>
    </form>
  );
}
