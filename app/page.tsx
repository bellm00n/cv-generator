import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-app-text">CV Generator</h1>
      <Link
        href="/cv-list"
        className="text-app-accent underline underline-offset-4 hover:brightness-75"
      >
        Go to app
      </Link>
    </main>
  );
}
