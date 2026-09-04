import { Home, PhoneCall, ShieldCheck } from "lucide-react";

import { LeadForm } from "@/components/lead-form";
import { site } from "@/lib/site";

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
