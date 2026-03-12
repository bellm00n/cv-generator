import Link from "next/link";

const FEATURES = [
  {
    icon: (
      <svg
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    ),
    title: "Intuitive Editor",
    description:
      "Fill in your details with a clean, structured form — no formatting headaches.",
  },
  {
    icon: (
      <svg
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.573-3.007-9.963-7.178z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Live PDF Preview",
    description:
      "See exactly how your CV looks as a PDF while you type — what you see is what you get.",
  },
  {
    icon: (
      <svg
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    ),
    title: "One-Click Export",
    description:
      "Download a polished, print-ready PDF in seconds — ready to send to any recruiter.",
  },
  {
    icon: (
      <svg
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
    title: "Private & Secure",
    description:
      "Your data stays yours — sign in with GitHub and keep your CVs safely stored.",
  },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-blue-500">
          Free &amp; Open Source
        </p>
        <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-slate-800">
          Build a stunning CV
          <br />
          <span className="text-blue-500">in minutes</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-500">
          A minimal, distraction-free CV builder with a live PDF preview. Fill
          in your details, see the result instantly, and download a
          professional&nbsp;PDF.
        </p>
        <Link
          href="/cv-list"
          className="mt-10 inline-flex min-h-11 items-center justify-center rounded-md border border-blue-500 bg-blue-500 px-8 text-sm font-medium text-white transition-all hover:brightness-95"
        >
          Get Started
        </Link>
      </section>
      <section className="border-t border-slate-300 bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-slate-800">
            Why CV&nbsp;Generator?
          </h2>
          <div className="grid gap-10 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-slate-300 px-6 py-8">
        <p className="text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} CV Generator.
        </p>
      </footer>
    </main>
  );
}
