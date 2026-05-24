import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const source = await prisma.cv.findUnique({
    where: { id },
    include: { user: { select: { email: true } } },
  });

  if (!source) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (source.user.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const copy = await prisma.cv.create({
    data: {
      title: `${source.title} copy`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: source.data as any,
      user: { connect: { email: session.user.email } },
    },
  });

  return NextResponse.json(copy, { status: 201 });
}
