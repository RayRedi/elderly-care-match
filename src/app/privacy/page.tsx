import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Elderly Care Match uses the information you share on this page.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          Home
        </Link>
      </p>
      <h1 className="font-heading mt-3 text-4xl text-foreground">Privacy</h1>
      <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
        <p>
          This page collects only what we need to call you back about senior care
          in Washington: your name, phone, city, state, ZIP code, the kind of
          care you are considering, timing, and optional email.
        </p>
        <p>
          We store that inquiry in our Family Care Leads list so we can follow
          up. We do not sell your information. We do not ask for Social Security
          numbers, Medicare numbers, or medical records here.
        </p>
        <p>
          If you check the consent box, you agree that {site.name} may contact
          you by phone, text, or email about senior care options. You can ask us
          to stop anytime.
        </p>
        <p>
          Questions:{" "}
          <a href={site.emailHref} className="text-foreground underline underline-offset-2">
            {site.email}
          </a>{" "}
          or{" "}
          <a href={site.phoneHref} className="text-foreground underline underline-offset-2">
            {site.phone}
          </a>
          .
        </p>
      </div>
    </article>
  );
}
