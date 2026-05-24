"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { AppSideMenu } from "@/components/AppSideMenu";
import { CvListCard } from "@/components/cv-list/CvListCard";
import { NewCvButton } from "@/components/cv-list/NewCvButton";
import { downloadCvPdfById } from "@/components/preview/downloadCvPdf";
import { parseImportedCv } from "@/schemas/cvImportSchema";

type CvListItem = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

type CvListPageProps = {
  user: Session["user"] | null;
};

const stripJsonExtension = (name: string) => name.replace(/\.json$/i, "");

export function CvListPage({ user }: CvListPageProps) {
  const router = useRouter();
  const [cvs, setCvs] = useState<CvListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cv")
      .then((res) => (res.ok ? (res.json() as Promise<CvListItem[]>) : []))
      .then((data) => {
        if (!cancelled) setCvs(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
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

  const handleUpload = async (file: File) => {
    let raw: unknown;
    try {
      const text = await file.text();
      raw = JSON.parse(text);
    } catch {
      window.alert("Could not read the selected file as JSON.");
      return;
    }

    const parsed = parseImportedCv(raw);
    if (!parsed) {
      window.alert("The selected file is not a valid CV JSON.");
      return;
    }

    const title = stripJsonExtension(file.name) || "Imported CV";

    const res = await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, data: parsed }),
    });

    if (!res.ok) {
      window.alert("Failed to import CV.");
      return;
    }

    const cv = (await res.json()) as CvListItem;
    router.push(`/cv/${cv.id}`);
  };

  const handleCopy = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/cv/${id}/copy`, { method: "POST" });
      if (!res.ok) return;

      const cv = (await res.json()) as CvListItem;
      setCvs((prev) => [cv, ...prev]);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Delete "${title}"?`);
    if (!confirmed) return;

    setBusyId(id);
    try {
      const res = await fetch(`/api/cv/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setCvs((prev) => prev.filter((cv) => cv.id !== id));
    } finally {
      setBusyId(null);
    }
  };

  const handleDownloadPdf = async (id: string) => {
    setBusyId(id);
    try {
      await downloadCvPdfById(id);
    } catch {
      window.alert("Failed to download PDF.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden lg:contents">
        <AppSideMenu variant="static" user={user} />
      </div>

      <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-slate-800">
              My resumes
            </h1>
            <NewCvButton
              onCreate={() => void handleCreate()}
              onUpload={(file) => void handleUpload(file)}
            />
          </div>

          {isLoading ? (
            <p className="text-slate-500">Loading...</p>
          ) : cvs.length === 0 ? (
            <p className="text-slate-500">
              No resumes yet — click{" "}
              <span className="font-medium text-slate-700">New +</span> to
              create one.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cvs.map((cv) => (
                <li key={cv.id}>
                  <CvListCard
                    cv={cv}
                    isBusy={busyId === cv.id}
                    onDownloadPdf={() => void handleDownloadPdf(cv.id)}
                    onCopy={() => void handleCopy(cv.id)}
                    onRemove={() => void handleDelete(cv.id, cv.title)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
