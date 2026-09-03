import Link from "next/link";

import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-heading text-lg tracking-tight text-foreground">
          {site.name}
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <a
            href={site.phoneHref}
            className="hidden font-medium text-foreground underline-offset-4 hover:underline sm:inline"
          >
            {site.phone}
          </a>
          <a
            href="#get-help"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-3.5 font-medium text-primary-foreground"
          >
            Get help
          </a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-heading text-base text-foreground">{site.name}</p>
          <p className="mt-1 max-w-md leading-6">
            Free matching help for Washington families. We are not a care home,
            not DSHS, and we do not push a particular building.
          </p>
        </div>
        <div className="space-y-1">
          <p>
            <a href={site.phoneHref} className="text-foreground hover:underline">
              {site.phone}
            </a>
          </p>
          <p>
            <a href={site.emailHref} className="hover:underline">
              {site.email}
            </a>
          </p>
          <p>{site.hours}</p>
          <p>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
