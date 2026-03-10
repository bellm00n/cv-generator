import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CvEditorPage } from "@/components/CvEditorPage";
import { parseImportedCv } from "@/schemas/cvImportSchema";
import { createDefaultCvFormValues } from "@/schemas/formSchema";

type PageProps = { params: Promise<{ id: string }> };

export default async function CvPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const { id } = await params;

  const cv = await prisma.cv.findFirst({
    where: { id, user: { email: session.user.email } },
  });

  if (!cv) {
    notFound();
  }

  const initialFormValues =
    parseImportedCv(cv.data) ?? createDefaultCvFormValues();

  return <CvEditorPage cvId={id} cvTitle={cv.title} initialFormValues={initialFormValues} />;
}
