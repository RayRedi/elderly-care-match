import { Home, PhoneCall, ShieldCheck } from "lucide-react";

import { CareTypeCard } from "@/components/care-type-card";
import { LeadForm } from "@/components/lead-form";
import { careTypes, site } from "@/lib/site";

const steps = [
  {
    title: "You tell us what is going on",
    body: "Who needs care, where they live, and how soon you need help. Two minutes is enough.",
  },
  {
    title: "We call you back",
    body: "A person, not a chatbot. During a discharge, say so — we start from there.",
  },
  {
    title: "You compare licensed places",
    body: "Adult family homes, assisted living, memory care, and nursing homes. We do not steer you to one building.",
  },
];

const faqs = [
  {
    q: "Does this cost the family anything?",
    a: "No. Elderly Care Match is free for families. We do not push a particular building.",
  },
  {
    q: "Where do you help?",
    a: `${site.serviceArea}. If you are outside those counties, still call — we work statewide.`,
  },
  {
    q: "What if I already know the kind of care?",
    a: "Choose it on the form. If you are not sure, choose “Not sure yet.” That is a normal starting point.",
  },
  {
    q: "Are you the same as eldercarematch.com?",
    a: "No. We are Elderly Care Match, with the extra “ly,” at elderlycarematch.com. If you landed on the other site, call us and we will confirm you have the right team.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid w-full max-w-6xl items-start gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="pt-2">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Washington families · Free to call
          </p>
          <h1 className="font-heading mt-3 max-w-xl text-4xl leading-[1.15] text-foreground sm:text-5xl">
            Find senior care without the runaround.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Elderly Care Match helps you compare licensed adult family homes,
            assisted living, memory care, and nursing homes. We do not charge
            families, and we do not push a building.
          </p>
          <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
            <li className="flex items-start gap-2 rounded-2xl bg-card/80 px-3 py-3 ring-1 ring-foreground/8">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>Free for families</span>
            </li>
            <li className="flex items-start gap-2 rounded-2xl bg-card/80 px-3 py-3 ring-1 ring-foreground/8">
              <Home className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>Licensed WA options</span>
            </li>
            <li className="flex items-start gap-2 rounded-2xl bg-card/80 px-3 py-3 ring-1 ring-foreground/8">
              <PhoneCall className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>A real callback</span>
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            In a hospital discharge today? Call{" "}
            <a href={site.phoneHref} className="font-medium text-foreground underline underline-offset-2">
              {site.phone}
            </a>{" "}
            and say so.
          </p>
        </div>
        <LeadForm />
      </section>

      <section className="border-y border-border/70 bg-card/55">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title}>
              <p className="text-sm font-medium text-primary">0{index + 1}</p>
              <h2 className="font-heading mt-2 text-2xl text-foreground">{step.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-heading text-3xl text-foreground">What we help you compare</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          Tap the one that sounds closest. It fills the form for you. If none fit, choose “Not sure yet.”
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {careTypes.map((item) => (
            <CareTypeCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="font-heading text-3xl text-foreground">Questions families ask first</h2>
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10">
          {faqs.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none text-base font-medium text-foreground [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-muted-foreground group-open:hidden">+</span>
                  <span className="hidden text-muted-foreground group-open:inline">−</span>
                </span>
              </summary>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="h-16 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl gap-2">
          <a
            href={site.phoneHref}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-border text-sm font-medium"
          >
            Call {site.phone}
          </a>
          <a
            href="#get-help"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground"
          >
            Request a callback
          </a>
        </div>
      </div>
    </div>
  );
}

