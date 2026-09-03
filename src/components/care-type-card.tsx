"use client";

import { careTypes } from "@/lib/site";

export function CareTypeCard({ item }: { item: (typeof careTypes)[number] }) {
  return (
    <button
      type="button"
      className="rounded-3xl bg-card p-5 text-left ring-1 ring-foreground/10 transition-colors hover:bg-accent"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("pick-care", { detail: item.id }));
      }}
    >
      <h3 className="font-heading text-xl text-foreground">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.blurb}</p>
      <p className="mt-4 text-sm font-medium text-primary">Ask about this →</p>
    </button>
  );
}
