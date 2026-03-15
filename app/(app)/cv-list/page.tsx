"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type CvListItem = {
  id: string;
  title: string;
  updatedAt: string;
};

export default function CvListPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CvListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const newlyCreatedIdRef = useRef<string | null>(null);
  const shouldRedirectRef = useRef(false);

  useEffect(() => {
    fetch("/api/cv")
      .then((res) => res.json())
      .then((data: CvListItem[]) => setCvs(data))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  const handleCreate = async () => {
    const res = await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled CV", data: {} }),
    });

    if (!res.ok) return;

    const cv = (await res.json()) as CvListItem;
    setCvs((prev) => [cv, ...prev]);
    newlyCreatedIdRef.current = cv.id;
    setEditingId(cv.id);
    setEditingTitle("");
  };

  const handleEditStart = (cv: CvListItem) => {
    setEditingId(cv.id);
    setEditingTitle(cv.title);
  };

  const handleEditSave = async (id: string) => {
    const title = editingTitle.trim() || "Untitled CV";
    await fetch(`/api/cv/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setCvs((prev) => prev.map((cv) => (cv.id === id ? { ...cv, title } : cv)));
    setEditingId(null);
    if (shouldRedirectRef.current && newlyCreatedIdRef.current === id) {
      shouldRedirectRef.current = false;
      newlyCreatedIdRef.current = null;
      router.push(`/cv/${id}`);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      if (newlyCreatedIdRef.current === id) shouldRedirectRef.current = true;
      void handleEditSave(id);
    }
    if (e.key === "Escape") setEditingId(null);
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Delete "${title}"?`);
    if (!confirmed) return;

    await fetch(`/api/cv/${id}`, { method: "DELETE" });
    setCvs((prev) => prev.filter((cv) => cv.id !== id));
  };

  return (
    <main className="min-h-screen py-10">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">My CVs</h1>
          <Button onClick={() => void handleCreate()}>New +</Button>
        </div>

        {isLoading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <>
            {cvs.length > 0 && (
              <ul className="flex flex-col gap-2">
                {cvs.map((cv) => (
                  <li
                    key={cv.id}
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 hover:bg-slate-50"
                    onClick={() => {
                      if (editingId !== cv.id) router.push(`/cv/${cv.id}`);
                    }}
                  >
                    {editingId === cv.id ? (
                      <Input
                        ref={editInputRef}
                        id={`edit-cv-title-${cv.id}`}
                        label="CV name"
                        hideLabel
                        value={editingTitle}
                        placeholder="Type your CV title..."
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, cv.id)}
                        onBlur={() => void handleEditSave(cv.id)}
                      />
                    ) : (
                      <span className="text-sm font-medium text-slate-800 group-hover:text-blue-500">
                        {cv.title}
                      </span>
                    )}
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStart(cv);
                        }}
                      >
                        Edit name
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleDelete(cv.id, cv.title);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </main>
  );
}
