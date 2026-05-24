import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const updateCvSchema = z.object({
  title: z.string().min(1).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

async function getOwnedCv(id: string, userEmail: string) {
  const cv = await prisma.cv.findUnique({
    where: { id },
    include: { user: { select: { email: true } } },
  });

  if (!cv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (cv.user.email !== userEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return cv;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const result = await getOwnedCv(id, session.user.email);
  if (result instanceof NextResponse) return result;

  return NextResponse.json(result);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateCvSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await getOwnedCv(id, session.user.email);
  if (result instanceof NextResponse) return result;

  const updated = await prisma.cv.update({
    where: { id },
    data: {
      ...(parsed.data.title && { title: parsed.data.title }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(parsed.data.data && { data: parsed.data.data as any }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const result = await getOwnedCv(id, session.user.email);
  if (result instanceof NextResponse) return result;

  await prisma.cv.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
