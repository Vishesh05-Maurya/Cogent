"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";

export function Header() {
  const { isSignedIn } = useAuth();
  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-50">
        {/* Full-width backdrop blur layer */}
        <div className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60" />

        {/* Subtle gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/70 dark:via-emerald-500/60 to-transparent" />

        {/* Main header row */}
        <div className="relative flex items-center justify-between w-full px-6 md:px-10 lg:px-16 h-[72px]">

          {/* ── LEFT: Logo + Nav ── */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-emerald-400/20 dark:bg-emerald-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src="/logo2.png"
                  alt="Logo"
                  height={44}
                  width={44}
                  className="relative rounded-xl"
                />
              </div>
              <span className="hidden sm:block font-black text-[15px] tracking-widest uppercase text-zinc-900 dark:text-zinc-100 letter-spacing-widest">
                A Coding Agent
              </span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

            {/* Desktop Nav Links */}
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/docs/components/background-paths"
                className="relative px-3 py-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              >
                Docs
              </Link>

              {/* <Link
                href="https://codesnippetui.pro/templates?utm_source=codesnippetui.com&utm_medium=header"
                target="_blank"
                className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              >
                API
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  New
                </span>
              </Link> */}

              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              >
                Dashboard
              </Link>

              <Link
                href="/features"
                className="px-3 py-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              >
                Features
              </Link>

              <Link
                href="/snippets"
                className="px-3 py-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              >
                Snippets
              </Link>
            </nav>
          </div>

          {/* ── RIGHT: Actions ── */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors duration-200 shadow-sm">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>

          {/* ── MOBILE Nav ── */}
          <div className="flex sm:hidden items-center gap-3">
            <Link
              href="/docs/components/action-search-bar"
              className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Docs
            </Link>

            <Link
              href="/snippets"
              className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Snippets
            </Link>
            
            <ThemeToggle />
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="text-sm font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1.5 rounded-lg">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}