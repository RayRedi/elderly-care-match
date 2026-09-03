"use client";

import { useLeadSelection } from "@/components/lead-context";
import { careTypes } from "@/lib/site";

export function CareTypeCard({ item }: { item: (typeof careTypes)[number] }) {
  const { careType, selectCareType } = useLeadSelection();
  const selected = careType === item.id;

  return (
    <button
      type="button"
      aria-pressed={selected}
      className="rounded-3xl bg-card p-5 text-left ring-1 ring-foreground/10 transition-colors hover:bg-accent aria-pressed:ring-primary/40"
      onClick={() => selectCareType(item.id)}
    >
      <h3 className="font-heading text-xl text-foreground">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.blurb}</p>
      <p className="mt-4 text-sm font-medium text-primary">
        {selected ? "Selected in the form" : "Ask about this →"}
      </p>
    </button>
  );
}
