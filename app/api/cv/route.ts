import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const createCvSchema = z.object({
  title: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cvs = await prisma.cv.findMany({
    where: { user: { email: session.user.email } },
    select: { id: true, title: true, createdAt: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(cvs);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createCvSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const cv = await prisma.cv.create({
    data: {
      title: parsed.data.title,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: parsed.data.data as any,
      user: { connect: { email: session.user.email } },
    },
  });

  return NextResponse.json(cv, { status: 201 });
}
