import { CloseIcon } from "./Icons";

type ChipProps = {
  value: string;
  onRemove: () => void;
};

export function Chip({ value, onRemove }: ChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-blue-500/10 px-2 py-0.5 text-sm text-slate-800">
      {value}
      <button
        type="button"
        aria-label={`Remove ${value}`}
        className="ml-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-blue-500/20 hover:text-slate-800"
        onClick={onRemove}
      >
        <CloseIcon />
      </button>
    </span>
  );
}
