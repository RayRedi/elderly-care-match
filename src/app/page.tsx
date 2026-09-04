import { GuidedWizard } from "@/components/guided-wizard";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <div>
      <GuidedWizard />
      <div className="h-16 sm:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur sm:hidden">
        <a
          href={site.phoneHref}
          className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-border text-sm font-medium"
        >
          Call {site.phone}
        </a>
      </div>
    </div>
  );
}
