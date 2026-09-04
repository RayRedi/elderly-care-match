import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckSquare2,
  ListChecks,
  MessageCircle,
  MousePointerClick,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Callback onboarding concepts",
  description: "Four senior-friendly callback onboarding concepts for Elderly Care Match.",
};

const concepts = [
  {
    href: "/examples/guided",
    number: "01",
    title: "Guided wizard",
    label: "Recommended baseline",
    description:
      "One focused question at a time, five visible steps, and easy backtracking without losing answers.",
    icon: ListChecks,
    strength: "Best balance of clarity and useful call context",
  },
  {
    href: "/examples/quick",
    number: "02",
    title: "Callback first",
    label: "Lowest friction",
    description:
      "Only asks who, where, name, and phone. The adviser sorts out care type and timing on the call.",
    icon: MousePointerClick,
    strength: "Best for urgent or terminology-averse visitors",
  },
  {
    href: "/examples/conversation",
    number: "03",
    title: "Conversation starter",
    label: "Plain-language triage",
    description:
      "Begins with what is happening, not industry categories, and converts the answer into call context.",
    icon: MessageCircle,
    strength: "Best emotional framing for uncertain families",
  },
  {
    href: "/examples/checklist",
    number: "04",
    title: "Calm checklist",
    label: "Maximum transparency",
    description:
      "Shows the whole form and what happens afterward for people who want to scan before starting.",
    icon: CheckSquare2,
    strength: "Best for deliberate users who dislike hidden steps",
  },
] as const;

const findings = [
  {
    title: "Ask less",
    detail:
      "W3C recommends requiring as little information as possible, accepting flexible formats, and preventing errors before they happen.",
  },
  {
    title: "Use one clear decision at a time",
    detail:
      "GOV.UK starts with one question per page so people can focus. It also recommends a back link, specific headings, and a Continue button.",
  },
  {
    title: "Design for older eyes and hands",
    detail:
      "The National Institute on Aging recommends at least 14-point text, generous spacing, brief questionnaires, and alternatives when forms are difficult.",
  },
  {
    title: "Keep a visible human route",
    detail:
      "Senior-care visitors may be stressed or time-constrained. Every concept keeps click-to-call visible and explains what happens after submission.",
  },
] as const;

export default function ExamplesPage() {
  return (
    <div className="bg-[#f7faf9]">
      <section className="border-b border-border bg-[#042f2e] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-teal-200 uppercase">
            <Sparkles className="size-4" aria-hidden />
            CTO concept review
          </div>
          <h1 className="font-heading mt-4 max-w-4xl text-4xl leading-tight sm:text-6xl">
            Four easier ways to request senior-care help.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">
            These are working onboarding prototypes for adult children, older adults,
            and families under time pressure. Each uses the same callback service but
            reduces a different kind of friction.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold tracking-wide text-primary uppercase">
              Interactive prototypes
            </p>
            <h2 className="font-heading mt-2 text-3xl sm:text-4xl">
              Try each approach
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Forms are connected to the live callback pipeline. Use clearly marked test
            details during internal review.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {concepts.map((concept) => {
            const Icon = concept.icon;
            return (
              <Link
                key={concept.href}
                href={concept.href}
                className="group flex min-h-72 flex-col rounded-3xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-muted-foreground">
                    {concept.number}
                  </span>
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                </div>
                <p className="mt-6 text-sm font-semibold text-primary">{concept.label}</p>
                <h3 className="font-heading mt-1 text-3xl">{concept.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {concept.description}
                </p>
                <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                  <p className="max-w-xs text-sm font-medium">{concept.strength}</p>
                  <ArrowRight className="size-5 shrink-0 text-primary transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-bold tracking-wide text-primary uppercase">
              Research translated into design
            </p>
            <h2 className="font-heading mt-2 text-3xl">
              What all four concepts have in common
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              No pattern is universally best. The recommendation is to compare the
              guided wizard against callback-first, then measure starts, step drop-off,
              completed callbacks, and qualified conversations.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {findings.map((finding) => (
              <article key={finding.title} className="rounded-2xl bg-muted p-5">
                <h3 className="font-semibold">{finding.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {finding.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-lg font-semibold">Research references</h2>
        <ul className="mt-4 grid gap-3 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
          <li>
            <a className="underline hover:text-foreground" href="https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p04-supportive-forms/">
              W3C: Design forms to prevent mistakes
            </a>
          </li>
          <li>
            <a className="underline hover:text-foreground" href="https://design-system.service.gov.uk/patterns/question-pages/">
              GOV.UK: Question-page pattern
            </a>
          </li>
          <li>
            <a className="underline hover:text-foreground" href="https://www.nia.nih.gov/health/health-care-professionals-information/talking-your-older-patients">
              National Institute on Aging: communicating with older adults
            </a>
          </li>
          <li>
            <a className="underline hover:text-foreground" href="https://www.w3.org/TR/coga-usable/">
              W3C: Cognitive accessibility guidance
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
