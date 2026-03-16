import { useEffect, useRef, useState } from "react";

type EditableCvTitleProps = {
  title: string;
  onSave: (newTitle: string) => Promise<void>;
};

export function EditableCvTitle({ title, onSave }: EditableCvTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleFinish = () => {
    setIsEditing(false);
    const trimmed = value.trim() || "Untitled CV";
    setValue(trimmed);
    if (trimmed !== title) {
      void onSave(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFinish();
    }
    if (e.key === "Escape") {
      setValue(title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xl leading-tight font-semibold text-slate-800 outline-none focus:border-blue-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleFinish}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100"
      onClick={() => setIsEditing(true)}
    >
      <h2 className="text-xl leading-tight font-semibold text-slate-800">
        {title}
      </h2>
      <span className="text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </span>
    </button>
  );
}
