import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[oklch(0.08_0.02_270)] to-[oklch(0.08_0.02_270)_/_0] backdrop-blur-md border-b border-[oklch(0.2_0.02_270)]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.7_0.25_180)] flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-bold text-lg text-white hidden sm:inline">ScreenLab</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-[oklch(0.7_0.02_0)] hover:text-[oklch(0.7_0.25_180)] transition-colors">
            Home
          </Link>
          <Link href="/settings" className="text-sm text-[oklch(0.7_0.02_0)] hover:text-[oklch(0.7_0.25_180)] transition-colors">
            Settings
          </Link>
          <div className="relative group">
            <button className="text-sm text-[oklch(0.7_0.02_0)] hover:text-[oklch(0.7_0.25_180)] transition-colors flex items-center gap-1">
              Tools
              <span className="text-xs">▼</span>
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-[oklch(0.12_0.02_270)] border border-[oklch(0.2_0.02_270)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
              <Link href="/white-screen" className="block px-4 py-2 text-sm text-[oklch(0.7_0.02_0)] hover:bg-[oklch(0.2_0.02_270)] rounded transition-colors">
                White Screen
              </Link>
              <Link href="/color-screen" className="block px-4 py-2 text-sm text-[oklch(0.7_0.02_0)] hover:bg-[oklch(0.2_0.02_270)] rounded transition-colors">
                Color Screen
              </Link>
              <Link href="/ring-light" className="block px-4 py-2 text-sm text-[oklch(0.7_0.02_0)] hover:bg-[oklch(0.2_0.02_270)] rounded transition-colors">
                Ring Light
              </Link>
              <Link href="/pomodoro" className="block px-4 py-2 text-sm text-[oklch(0.7_0.02_0)] hover:bg-[oklch(0.2_0.02_270)] rounded transition-colors">
                Pomodoro
              </Link>
            </div>
          </div>
        </div>

        {/* Sticky CTA Button */}
        <Link href="/white-screen" className="hidden lg:block">
          <Button className="bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.7_0.25_180)] text-white px-6 py-2 text-sm hover:opacity-90 transition-opacity font-semibold">
            Try Now
          </Button>
        </Link>

        {/* Auth & Mobile Menu */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-[oklch(0.7_0.02_0)] hidden sm:inline">{user?.name}</span>
              <Button
                onClick={() => logout()}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              size="sm"
              className="bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.7_0.25_180)] text-white hover:opacity-90 text-xs"
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[oklch(0.7_0.02_0)] hover:text-[oklch(0.7_0.25_180)]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[oklch(0.12_0.02_270)] border-t border-[oklch(0.2_0.02_270)] p-4 space-y-2">
          <Link href="/" className="block px-4 py-2 text-sm text-[oklch(0.7_0.02_0)] hover:bg-[oklch(0.2_0.02_270)] rounded transition-colors">
            Home
          </Link>
          <Link href="/white-screen" className="block px-4 py-2 text-sm text-[oklch(0.7_0.02_0)] hover:bg-[oklch(0.2_0.02_270)] rounded transition-colors">
            White Screen
          </Link>
          <Link href="/color-screen" className="block px-4 py-2 text-sm text-[oklch(0.7_0.02_0)] hover:bg-[oklch(0.2_0.02_270)] rounded transition-colors">
            Color Screen
          </Link>
          <Link href="/ring-light" className="block px-4 py-2 text-sm text-[oklch(0.7_0.02_0)] hover:bg-[oklch(0.2_0.02_270)] rounded transition-colors">
            Ring Light
          </Link>
          <Link href="/pomodoro" className="block px-4 py-2 text-sm text-[oklch(0.7_0.02_0)] hover:bg-[oklch(0.2_0.02_270)] rounded transition-colors">
            Pomodoro
          </Link>
        </div>
      )}
    </nav>
  );
}
