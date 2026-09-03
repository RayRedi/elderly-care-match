import { cn } from "@/lib/utils";

type ChoiceChipsProps<T extends string> = {
  legend: string;
  value: T | "";
  onChange: (value: T) => void;
  options: readonly { id: T; label: string }[];
  error?: string;
};

export function ChoiceChips<T extends string>({
  legend,
  value,
  onChange,
  options,
  error,
}: ChoiceChipsProps<T>) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-foreground">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "rounded-full border px-3.5 py-2 text-sm transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </fieldset>
  );
}
