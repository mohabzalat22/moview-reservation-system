import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-primary uppercase"
            >
              Retro
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Experience cinema like never before. Book your tickets for the
              latest blockbusters with our sleek reservation system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/movies"
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/reservations"
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  My Tickets
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Account
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-muted-foreground/60 cursor-default">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground/60 cursor-default">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground/60 cursor-default">
                  Cookie Policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Retro Cinema. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/40">
            Built with Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
