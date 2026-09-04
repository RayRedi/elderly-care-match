import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  CalmChecklist,
  ConversationOnboarding,
  GuidedWizard,
  QuickCallback,
} from "@/components/onboarding-templates";

const templates = {
  guided: {
    title: "Guided wizard",
    description: "A one-question-at-a-time callback flow for senior-care families.",
    component: GuidedWizard,
  },
  quick: {
    title: "Callback first",
    description: "A low-friction callback request for senior-care families.",
    component: QuickCallback,
  },
  conversation: {
    title: "Conversation starter",
    description: "A plain-language callback flow based on the family’s situation.",
    component: ConversationOnboarding,
  },
  checklist: {
    title: "Calm checklist",
    description: "A transparent, all-at-once callback form for senior-care families.",
    component: CalmChecklist,
  },
} as const;

type TemplateName = keyof typeof templates;

export function generateStaticParams() {
  return Object.keys(templates).map((template) => ({ template }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ template: string }>;
}): Promise<Metadata> {
  const { template } = await params;
  const concept = templates[template as TemplateName];
  if (!concept) return {};
  return {
    title: `${concept.title} callback concept`,
    description: concept.description,
    robots: { index: false, follow: false },
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template } = await params;
  const concept = templates[template as TemplateName];
  if (!concept) notFound();

  const Template = concept.component;
  return <Template />;
}
