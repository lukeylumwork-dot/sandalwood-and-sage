import { useState } from "react";
import { Menu, X, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";

const rssUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rss-feed`;

const navLinks = [
  { label: "Latest", href: "#featured" },
  { label: "Episodes", href: "#episodes" },
  { label: "How it Works", href: "#how-it-works" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
        <a href="#" aria-label="Sandalwood & Sage home" className="flex items-center">
          <img
            src={logoDark}
            alt="Sandalwood & Sage"
            className="h-10 w-auto block dark:hidden"
          />
          <img
            src={logoLight}
            alt="Sandalwood & Sage"
            className="h-10 w-auto hidden dark:block"
          />
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a href={rssUrl} target="_blank" rel="noopener noreferrer" aria-label="RSS Feed" className="text-muted-foreground hover:text-foreground transition-colors">
            <Rss size={16} />
          </a>
          <ThemeToggle />
          <Button size="sm" asChild>
            <a href="#subscribe">Subscribe</a>
          </Button>
        </nav>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t px-5 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground py-1"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3 mt-1">
              <ThemeToggle />
              <Button size="sm" className="w-fit" asChild>
                <a href="#subscribe" onClick={() => setMobileOpen(false)}>Subscribe</a>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
