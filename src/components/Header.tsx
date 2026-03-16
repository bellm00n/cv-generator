import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export async function Header() {
  const session = await auth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-300 bg-white px-6">
      <Link
        href="/"
        className="text-sm font-semibold text-slate-800 hover:text-blue-500"
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
            <span className="text-sm text-slate-500">{session.user.name}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" color="secondary" variant="outlined">
                Log Out
              </Button>
            </form>
          </>
        ) : (
          <Link href="/signin?callbackUrl=/cv-list">
            <Button color="secondary" variant="outlined">
              Log In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
