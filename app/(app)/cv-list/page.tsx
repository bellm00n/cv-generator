import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CvListPage } from "@/components/cv-list/CvListPage";

export default async function CvListRoutePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/signin?callbackUrl=/cv-list");
  }

  return <CvListPage user={session.user} />;
}
