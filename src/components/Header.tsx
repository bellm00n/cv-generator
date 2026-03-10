import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export async function Header() {
  const session = await auth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-app-border bg-app-surface px-6">
      <Link
        href="/"
        className="text-sm font-semibold text-app-text hover:text-app-accent"
      >
        CV Generator
      </Link>

      <div className="flex items-center gap-3">
        {session?.user ? (
          <>
            {session.user.image && (
              <Image
                src={session.user.image}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span className="text-sm text-app-muted">{session.user.name}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="secondary">
                Log Out
              </Button>
            </form>
          </>
        ) : (
          <Link href="/api/auth/signin?callbackUrl=/cv-list">
            <Button variant="secondary">Log In</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
