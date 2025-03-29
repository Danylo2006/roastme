"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b mb-6">
      <div className="container max-w-4xl mx-auto p-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600"
        >
          RegretBot™
        </Link>

        <nav>
          <ul className="flex gap-4">
            <li>
              <Link
                href="/"
                className={`text-sm ${
                  pathname === "/"
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground transition-colors"
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/mock-checkout"
                className={`text-sm ${
                  pathname === "/mock-checkout"
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground transition-colors"
                }`}
              >
                Demo Checkout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
