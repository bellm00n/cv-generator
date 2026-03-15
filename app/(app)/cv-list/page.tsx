"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type CvListItem = {
  id: string;
  title: string;
  updatedAt: string;
};

export default function CvListPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CvListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cv")
      .then((res) => res.json())
      .then((data: CvListItem[]) => setCvs(data))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled CV", data: {} }),
    });

    if (!res.ok) return;

    const cv = (await res.json()) as CvListItem;
    router.push(`/cv/${cv.id}`);
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
          <Button variant="outlined" onClick={() => void handleCreate()}>
            New +
          </Button>
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
                    onClick={() => router.push(`/cv/${cv.id}`)}
                  >
                    <span className="text-sm font-medium text-slate-800 group-hover:text-blue-500">
                      {cv.title}
                    </span>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        color="destructive"
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
