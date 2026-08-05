"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Grid3x3 } from "lucide-react";
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
  initialCvs: CvListItem[];
};

const stripJsonExtension = (name: string) => name.replace(/\.json$/i, "");

export function CvListPage({ user, initialCvs }: CvListPageProps) {
  const router = useRouter();
  const [cvs, setCvs] = useState<CvListItem[]>(initialCvs);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            data-testid="cv-list-open-menu"
            className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
          >
            <Grid3x3 className="size-5" />
          </button>
          <NewCvButton
            onCreate={() => void handleCreate()}
            onUpload={(file) => void handleUpload(file)}
          />
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold text-slate-800">
                My resumes
              </h1>
              <NewCvButton
                className="hidden lg:block"
                onCreate={() => void handleCreate()}
                onUpload={(file) => void handleUpload(file)}
              />
            </div>

            {cvs.length === 0 ? (
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
        </div>
      </main>

      <AppSideMenu
        variant="overlay"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
      />
    </div>
  );
}
