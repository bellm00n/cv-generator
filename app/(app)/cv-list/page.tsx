"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type CvListItem = {
  id: string;
  title: string;
  updatedAt: string;
};

export default function CvListPage() {
  const [cvs, setCvs] = useState<CvListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

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
    setCvs((prev) => [...prev, cv]);
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
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") void handleEditSave(id);
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
        <h1 className="mb-6 text-2xl font-semibold text-slate-800">My CVs</h1>

        {isLoading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <>
            {cvs.length > 0 && (
              <ul className="mb-2 flex flex-col gap-2">
                {cvs.map((cv) => (
                  <li
                    key={cv.id}
                    className="flex items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3"
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
                      <Link
                        href={`/cv/${cv.id}`}
                        className="text-sm font-medium text-slate-800 hover:text-blue-500"
                      >
                        {cv.title}
                      </Link>
                    )}
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleEditStart(cv)}
                      >
                        Edit name
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(cv.id, cv.title)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Button onClick={() => void handleCreate()}>Create CV</Button>
          </>
        )}
      </div>
    </main>
  );
}
