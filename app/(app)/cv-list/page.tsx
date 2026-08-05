import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CvListPage } from "@/components/cv-list/CvListPage";
import { prisma } from "@/lib/prisma";

export default async function CvListRoutePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/signin?callbackUrl=/cv-list");
  }

  const cvs = await prisma.cv.findMany({
    where: { user: { email: session.user.email } },
    select: { id: true, title: true, createdAt: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const initialCvs = cvs.map((cv) => ({
    ...cv,
    createdAt: cv.createdAt.toISOString(),
    updatedAt: cv.updatedAt.toISOString(),
  }));

  return <CvListPage user={session.user} initialCvs={initialCvs} />;
}
