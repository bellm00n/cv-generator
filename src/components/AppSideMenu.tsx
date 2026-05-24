"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, Home, Mail, User } from "lucide-react";
import type { Session } from "next-auth";
import { Dropdown } from "@/components/ui/Dropdown";
import { SideMenu } from "@/components/ui/SideMenu";
import { signOutAction } from "@/lib/auth-actions";
import { cn } from "@/lib/cn";

const GITHUB_URL = "https://github.com/bellm00n/cv-generator";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

type NavRowProps = {
  href?: string;
  icon: ReactNode;
  label: string;
  disabled?: boolean;
};

function NavRow({ href, icon, label, disabled }: NavRowProps) {
  const inner = (
    <span
      className={cn(
        "flex items-center gap-3 rounded px-3 py-2 text-sm",
        disabled
          ? "cursor-not-allowed text-slate-400"
          : "text-slate-700 hover:bg-slate-100",
      )}
    >
      {icon}
      {label}
    </span>
  );

  if (disabled || !href) {
    return (
      <div aria-disabled={disabled} data-testid={`navrow-${label}`}>
        {inner}
      </div>
    );
  }

  return (
    <Link href={href} data-testid={`navrow-${label}`}>
      {inner}
    </Link>
  );
}

type SessionUser = Session["user"] | null | undefined;

type AppSideMenuProps = {
  user: SessionUser;
  variant: "overlay" | "static";
  open?: boolean;
  onClose?: () => void;
};

export function AppSideMenu({
  user,
  variant,
  open,
  onClose,
}: AppSideMenuProps) {
  const displayName = user?.name ?? user?.email ?? "Guest";

  return (
    <SideMenu variant={variant} open={open} onClose={onClose}>
      <div className="flex h-full flex-col">
        <Link
          href="/"
          className="border-b border-slate-200 px-4 py-4 text-base font-semibold text-slate-800 hover:text-blue-500"
        >
          CV Generator
        </Link>

        {user ? (
          <div className="border-b border-slate-200 px-2 py-3">
            <Dropdown
              align="left"
              menuClassName="min-w-[14rem]"
              trigger={
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded px-2 py-1.5 text-left hover:bg-slate-100"
                  data-testid="user-row"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                      <User className="size-4" aria-hidden />
                    </span>
                  )}
                  <span className="truncate text-sm text-slate-800">
                    {displayName}
                  </span>
                </button>
              }
              items={[
                {
                  label: "Log Out",
                  onSelect: () => {
                    void signOutAction();
                  },
                },
              ]}
            />
          </div>
        ) : (
          <Link
            href="/signin?callbackUrl=/cv-list"
            className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
          >
            Log In
          </Link>
        )}

        <nav className="flex flex-col gap-0.5 px-2 py-3">
          <NavRow href="/" icon={<Home className="size-4" />} label="Main" />
          <NavRow
            href="/cv-list"
            icon={<FileText className="size-4" />}
            label="My Resumes"
          />
          <NavRow
            icon={<Mail className="size-4" />}
            label="Cover Letters"
            disabled
          />
        </nav>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800"
          data-testid="github-link"
        >
          <GithubIcon className="size-4" />
          <span>GitHub</span>
        </a>
      </div>
    </SideMenu>
  );
}
