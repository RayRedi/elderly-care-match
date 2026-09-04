"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

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
type Source =
  | "example-guided"
  | "example-quick"
  | "example-conversation"
  | "example-checklist";

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

function useCallbackDraft(source: Source) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  async function submit(overrides: Partial<Draft> = {}) {
    const data = { ...draft, ...overrides };
    setStatus("saving");
    setError(null);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "We could not send your request.");
      }
      setStatus("success");
      return true;
    } catch (submitError) {
      setStatus("idle");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not send your request. Please call us instead.",
      );
      return false;
    }
  }

  return { draft, update, status, error, setError, submit };
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
      <legend className="mb-3 text-lg font-semibold text-foreground">{legend}</legend>
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
                  selected ? "border-white bg-white text-primary" : "border-slate-400",
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
  includeEmail = true,
}: {
  draft: Draft;
  update: <K extends keyof Draft>(key: K, value: Draft[K]) => void;
  includeEmail?: boolean;
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
      <Field label="Best phone number" htmlFor="phone" hint="We will only use it to help with care options.">
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
      {includeEmail ? (
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
      ) : null}
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

function FormError({ error }: { error: string | null }) {
  return error ? (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {error}
    </p>
  ) : null;
}

function SuccessPanel() {
  return (
    <div className="rounded-3xl border border-primary/20 bg-white p-8 text-center shadow-sm">
      <CheckCircle2 className="mx-auto size-12 text-primary" aria-hidden />
      <h2 className="font-heading mt-4 text-3xl">Your callback is requested.</h2>
      <p className="mx-auto mt-3 max-w-md text-lg leading-7 text-muted-foreground">
        A real person from Elderly Care Match will call during business hours.
      </p>
      <a href={site.phoneHref} className={cn(primaryButton, "mt-6")}>
        <Phone className="mr-2 size-5" aria-hidden />
        Call now instead
      </a>
    </div>
  );
}

function ExampleIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <a
        href="/examples"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All onboarding examples
      </a>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">{eyebrow}</p>
        <h1 className="font-heading mt-2 text-4xl leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

const whoOptions = whoNeedsCare.map((id) => ({ id, label: id }));
const careOptions = careTypes.map((care) => ({
  id: care.id,
  label: care.title,
  description: care.blurb,
}));
const timelineOptions = timelines.map((item) => ({ id: item.id, label: item.label }));

function validateContact(draft: Draft) {
  if (draft.name.trim().length < 2) return "Enter your name so we know who to ask for.";
  if (draft.phone.replace(/\D/g, "").length < 10) return "Enter a 10-digit phone number.";
  if (!draft.consent) return "Check the permission box so we can call you.";
  return null;
}

function validateLocation(draft: Draft) {
  if (draft.city.trim().length < 2) return "Enter the city where care is needed.";
  if (!/^\d{5}(-\d{4})?$/.test(draft.zip.trim())) return "Enter a 5-digit ZIP code.";
  return null;
}

export function GuidedWizard() {
  const form = useCallbackDraft("example-guided");
  const [step, setStep] = useState(0);
  const steps = ["Person", "Care", "Timing", "Location", "Contact"];

  if (form.status === "success") return <ExampleIntro eyebrow="Example 1" title="Guided wizard" description="One clear decision at a time."><SuccessPanel /></ExampleIntro>;

  function continueStep() {
    let error: string | null = null;
    if (step === 0 && !form.draft.whoNeedsCare) error = "Choose who needs care.";
    if (step === 1 && !form.draft.careType) error = "Choose a care type, or choose “Not sure yet.”";
    if (step === 2 && !form.draft.timeline) error = "Choose the timing that feels closest.";
    if (step === 3) error = validateLocation(form.draft);
    if (error) return form.setError(error);
    form.setError(null);
    setStep((current) => current + 1);
  }

  async function finish() {
    const error = validateContact(form.draft);
    if (error) return form.setError(error);
    await form.submit();
  }

  return (
    <ExampleIntro
      eyebrow="Example 1 · Recommended baseline"
      title="Guided wizard"
      description="One focused question per screen, with a clear finish line and a back button that never erases answers."
    >
      <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border bg-white shadow-lg shadow-primary/5">
        <div className="border-b border-border bg-secondary/70 px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Step {step + 1} of {steps.length}</span>
            <span className="text-muted-foreground">About 1 minute</span>
          </div>
          <div className="mt-3 flex gap-2" aria-label={`Step ${step + 1} of ${steps.length}`}>
            {steps.map((label, index) => (
              <div key={label} className="flex-1">
                <div className={cn("h-2 rounded-full", index <= step ? "bg-primary" : "bg-primary/15")} />
                <span className="sr-only">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 sm:p-8">
          {step === 0 ? <ChoiceGroup legend="Who needs care?" value={form.draft.whoNeedsCare} options={whoOptions} onChange={(value) => form.update("whoNeedsCare", value)} /> : null}
          {step === 1 ? <ChoiceGroup legend="What kind of care are you considering?" value={form.draft.careType} options={careOptions} onChange={(value) => form.update("careType", value)} large /> : null}
          {step === 2 ? <ChoiceGroup legend="How soon might care be needed?" value={form.draft.timeline} options={timelineOptions} onChange={(value) => form.update("timeline", value)} /> : null}
          {step === 3 ? <><h2 className="mb-5 text-2xl font-semibold">Where is care needed?</h2><LocationFields draft={form.draft} update={form.update} /></> : null}
          {step === 4 ? <div className="grid gap-5"><h2 className="text-2xl font-semibold">How can we reach you?</h2><ContactFields draft={form.draft} update={form.update} /><Consent checked={form.draft.consent} onChange={(value) => form.update("consent", value)} /></div> : null}
          <div className="mt-6"><FormError error={form.error} /></div>
          <div className="mt-6 flex gap-3">
            {step > 0 ? <button type="button" className={secondaryButton} onClick={() => { form.setError(null); setStep((current) => current - 1); }}>Back</button> : null}
            {step < steps.length - 1 ? <button type="button" className={cn(primaryButton, "flex-1")} onClick={continueStep}>Continue</button> : <button type="button" className={cn(primaryButton, "flex-1")} disabled={form.status === "saving"} onClick={finish}>{form.status === "saving" ? "Sending…" : "Request my callback"}</button>}
          </div>
        </div>
      </div>
    </ExampleIntro>
  );
}

export function QuickCallback() {
  const form = useCallbackDraft("example-quick");
  if (form.status === "success") return <ExampleIntro eyebrow="Example 2" title="Callback first" description="The minimum useful information."><SuccessPanel /></ExampleIntro>;

  async function finish() {
    const error =
      (!form.draft.whoNeedsCare && "Choose who needs care.") ||
      validateLocation(form.draft) ||
      validateContact(form.draft);
    if (error) return form.setError(error);
    await form.submit({ careType: "Not sure", timeline: "Just looking" });
  }

  return (
    <ExampleIntro
      eyebrow="Example 2 · Lowest friction"
      title="Callback first"
      description="For visitors who do not know the terminology and just want a person to call. Care type and timing can be discussed later."
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-3xl bg-[#042f2e] p-7 text-white">
          <Phone className="size-9 text-teal-300" aria-hidden />
          <h2 className="font-heading mt-5 text-3xl">You do not need to have the answers yet.</h2>
          <p className="mt-4 text-base leading-7 text-white/75">
            Tell us who and where. We will ask about care needs during the call.
          </p>
          <ul className="mt-7 grid gap-4 text-sm">
            {["Free for families", "No account", "No pressure to choose a building"].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="size-5 shrink-0 text-teal-300" />{item}</li>)}
          </ul>
        </aside>
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-5">
            <ChoiceGroup legend="Who needs care?" value={form.draft.whoNeedsCare} options={whoOptions} onChange={(value) => form.update("whoNeedsCare", value)} />
            <LocationFields draft={form.draft} update={form.update} />
            <ContactFields draft={form.draft} update={form.update} includeEmail={false} />
            <Consent checked={form.draft.consent} onChange={(value) => form.update("consent", value)} />
            <FormError error={form.error} />
            <button type="button" className={primaryButton} disabled={form.status === "saving"} onClick={finish}>{form.status === "saving" ? "Requesting…" : "Call me about care options"}</button>
            <p className="text-center text-sm text-muted-foreground">Prefer not to fill this out? <a href={site.phoneHref} className="font-semibold text-foreground underline">{site.phone}</a></p>
          </div>
        </div>
      </div>
    </ExampleIntro>
  );
}

const situations: readonly {
  id: string;
  label: string;
  description: string;
  careType: CareType;
  timeline: Timeline;
}[] = [
  { id: "urgent", label: "A discharge or urgent change", description: "Care may be needed right away.", careType: "Not sure", timeline: "ASAP" },
  { id: "memory", label: "Memory or safety concerns", description: "Dementia, wandering, or increasing supervision.", careType: "Memory care", timeline: "Within a month" },
  { id: "support", label: "More help with daily life", description: "Meals, bathing, medicines, or mobility.", careType: "Assisted living", timeline: "1-3 months" },
  { id: "exploring", label: "I am starting to explore", description: "I want to understand the options first.", careType: "Not sure", timeline: "Just looking" },
];

export function ConversationOnboarding() {
  const form = useCallbackDraft("example-conversation");
  const [screen, setScreen] = useState(0);
  const [situation, setSituation] = useState("");
  if (form.status === "success") return <ExampleIntro eyebrow="Example 3" title="Conversation starter" description="Plain-language triage."><SuccessPanel /></ExampleIntro>;

  function pickSituation(id: string) {
    const match = situations.find((item) => item.id === id);
    if (!match) return;
    setSituation(id);
    form.update("careType", match.careType);
    form.update("timeline", match.timeline);
    setTimeout(() => setScreen(1), 180);
  }

  async function next() {
    let error: string | null = null;
    if (screen === 1 && !form.draft.whoNeedsCare) error = "Choose who you are helping.";
    if (screen === 2) error = validateLocation(form.draft);
    if (error) return form.setError(error);
    form.setError(null);
    setScreen((current) => current + 1);
  }

  async function finish() {
    const error = validateContact(form.draft);
    if (error) return form.setError(error);
    await form.submit();
  }

  return (
    <ExampleIntro
      eyebrow="Example 3 · Plain-language triage"
      title="Conversation starter"
      description="Starts with the family’s situation instead of industry terms, then quietly translates the answer into useful call context."
    >
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-[#f4f7f6] p-4 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white"><MessageCircle className="size-5" /></div>
          <div className="max-w-xl rounded-3xl rounded-tl-md bg-white px-5 py-4 shadow-sm">
            <p className="text-lg leading-7">
              {screen === 0 && "What is happening with care right now?"}
              {screen === 1 && "Thanks. Who are you helping?"}
              {screen === 2 && "Where should we look for care?"}
              {screen === 3 && "Last step — where can a care adviser reach you?"}
            </p>
          </div>
        </div>
        <div className="ml-0 mt-5 grid gap-3 sm:ml-13">
          {screen === 0 ? situations.map((item) => <button key={item.id} type="button" onClick={() => pickSituation(item.id)} className={cn("rounded-2xl border bg-white p-4 text-left transition hover:border-primary hover:bg-secondary", situation === item.id && "border-primary bg-secondary")}><span className="block text-base font-semibold">{item.label}</span><span className="mt-1 block text-sm text-muted-foreground">{item.description}</span></button>) : null}
          {screen === 1 ? <ChoiceGroup legend="Who needs care?" value={form.draft.whoNeedsCare} options={whoOptions} onChange={(value) => form.update("whoNeedsCare", value)} /> : null}
          {screen === 2 ? <LocationFields draft={form.draft} update={form.update} /> : null}
          {screen === 3 ? <><ContactFields draft={form.draft} update={form.update} includeEmail={false} /><Consent checked={form.draft.consent} onChange={(value) => form.update("consent", value)} /></> : null}
          <FormError error={form.error} />
          {screen > 0 ? <div className="flex gap-3"><button type="button" className={secondaryButton} onClick={() => { form.setError(null); setScreen((current) => current - 1); }}>Back</button>{screen < 3 ? <button type="button" className={cn(primaryButton, "flex-1")} onClick={next}>Continue</button> : <button type="button" className={cn(primaryButton, "flex-1")} disabled={form.status === "saving"} onClick={finish}>{form.status === "saving" ? "Sending…" : "Request my callback"}</button>}</div> : null}
        </div>
      </div>
    </ExampleIntro>
  );
}

export function CalmChecklist() {
  const form = useCallbackDraft("example-checklist");
  if (form.status === "success") return <ExampleIntro eyebrow="Example 4" title="Calm checklist" description="Everything visible and reviewable."><SuccessPanel /></ExampleIntro>;

  async function finish() {
    const error =
      (!form.draft.whoNeedsCare && "Choose who needs care.") ||
      (!form.draft.careType && "Choose a care type, or choose “Not sure yet.”") ||
      (!form.draft.timeline && "Choose when care may be needed.") ||
      validateLocation(form.draft) ||
      validateContact(form.draft);
    if (error) return form.setError(error);
    await form.submit();
  }

  return (
    <ExampleIntro
      eyebrow="Example 4 · Maximum transparency"
      title="Calm checklist"
      description="All questions are visible from the start for people who prefer to scan, prepare, and complete the form at their own pace."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_19rem]">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-8">
            <section><p className="mb-4 text-sm font-bold text-primary uppercase">1 · Care situation</p><div className="grid gap-6"><ChoiceGroup legend="Who needs care?" value={form.draft.whoNeedsCare} options={whoOptions} onChange={(value) => form.update("whoNeedsCare", value)} /><ChoiceGroup legend="What kind of care?" value={form.draft.careType} options={careOptions} onChange={(value) => form.update("careType", value)} large /><ChoiceGroup legend="When might care be needed?" value={form.draft.timeline} options={timelineOptions} onChange={(value) => form.update("timeline", value)} /></div></section>
            <hr className="border-border" />
            <section><p className="mb-4 text-sm font-bold text-primary uppercase">2 · Location</p><LocationFields draft={form.draft} update={form.update} /></section>
            <hr className="border-border" />
            <section><p className="mb-4 text-sm font-bold text-primary uppercase">3 · Your callback</p><div className="grid gap-5"><ContactFields draft={form.draft} update={form.update} /><Consent checked={form.draft.consent} onChange={(value) => form.update("consent", value)} /></div></section>
            <FormError error={form.error} />
            <button type="button" className={primaryButton} disabled={form.status === "saving"} onClick={finish}>{form.status === "saving" ? "Sending…" : "Request a callback"}</button>
          </div>
        </div>
        <aside className="h-fit rounded-3xl bg-secondary p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">What happens next</h2>
          <ol className="mt-5 grid gap-5">
            {[["Today", "Your request goes to our family care team."], ["Next", "A real person calls to understand the situation."], ["Then", "We explain relevant licensed options."]].map(([label, text], index) => <li key={label} className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{index + 1}</span><span><strong className="block">{label}</strong><span className="text-sm leading-6 text-muted-foreground">{text}</span></span></li>)}
          </ol>
          <div className="mt-6 border-t border-primary/15 pt-5 text-sm text-muted-foreground"><ShieldCheck className="mb-2 size-5 text-primary" /><strong className="text-foreground">Free for families.</strong> We do not push a particular building.</div>
          <div className="mt-4 flex items-center gap-2 text-sm"><Clock3 className="size-4 text-primary" />About 2 minutes</div>
        </aside>
      </div>
    </ExampleIntro>
  );
}
