"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-red-600">
          Retro
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-red-600 transition-colors">
              Admin
            </Link>
          )}
          <Link href="/movies" className="hover:text-red-600 transition-colors">
            Movies
          </Link>
          {!isLoading && user ? (
            <>
              <Link
                href="/profile"
                className="hover:text-red-600 transition-colors"
              >
                {user.name ?? user.email}
              </Link>
              <Link
                href="/settings"
                className="hover:text-red-600 transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            !isLoading && (
              <Link
                href="/login"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sign In
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
