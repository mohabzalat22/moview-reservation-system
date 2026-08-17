"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { href: "/movies", label: "Movies" },
  { href: "/reservations", label: "My Tickets" },
];

export function SiteHeader() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function handleLogout() {
    logout();
    router.push("/login");
    setMenuOpen(false);
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-primary uppercase select-none"
        >
          Retro
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/admin")
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:text-white hover:bg-white/10"
              }`}
            >
              Admin
            </Link>
          )}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 mx-2" />

          {!isLoading && user ? (
            <>
              <Link
                href="/profile"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/profile")
                    ? "bg-white/10 text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                }`}
              >
                {user.name ?? user.email}
              </Link>
              <Link
                href="/settings"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/settings")
                    ? "bg-white/10 text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                }`}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            !isLoading && (
              <Link
                href="/login"
                className="ml-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Sign In
              </Link>
            )
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-[5px] cursor-pointer"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-[2px] bg-foreground rounded transition-all duration-300 ${
              menuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-foreground rounded transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-foreground rounded transition-all duration-300 ${
              menuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[500px] border-t border-border" : "max-h-0"
        }`}
      >
        <div className="px-4 py-4 space-y-1 bg-background">
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive("/admin")
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:text-white hover:bg-white/10"
              }`}
            >
              Admin Dashboard
            </Link>
          )}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-white/[0.06] my-2" />

          {!isLoading && user ? (
            <>
              <Link
                href="/profile"
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/profile")
                    ? "bg-white/10 text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                }`}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/settings")
                    ? "bg-white/10 text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                }`}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full mt-2 px-4 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer text-center"
              >
                Sign Out
              </button>
            </>
          ) : (
            !isLoading && (
              <Link
                href="/login"
                className="block mt-2 px-4 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors text-center"
              >
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
