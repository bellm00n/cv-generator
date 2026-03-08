import { CloseIcon } from "./Icons";

type ChipProps = {
  value: string;
  onRemove: () => void;
};

export function Chip({ value, onRemove }: ChipProps) {
  return (
    <span className="bg-app-accent/10 inline-flex items-center gap-1 rounded-md border border-app-border px-2 py-0.5 text-sm text-app-text">
      {value}
      <button
        type="button"
        aria-label={`Remove ${value}`}
        className="hover:bg-app-accent/20 ml-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full text-app-muted transition-colors hover:text-app-text"
        onClick={onRemove}
      >
        <CloseIcon />
      </button>
    </span>
  );
}
