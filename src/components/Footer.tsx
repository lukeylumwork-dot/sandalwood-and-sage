import { Rss, Youtube, Podcast } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import { faqItems } from "@/data/faq";

const SpotifyIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const navLinks = [
  { label: "Latest Episode", href: "/#featured" },
  { label: "All Episodes", href: "/#episodes" },
  { label: "Subscribe", href: "/#subscribe" },
  { label: "Suggest a Topic", href: "/#suggest" },
  { label: "How it Works", href: "/#how-it-works" },
];

const Footer = () => (
  <footer className="border-t mt-6 sm:mt-8">
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-5 sm:py-12">
      <div className="grid gap-10 sm:gap-8 md:grid-cols-3">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <a href="/" aria-label="Sandalwood & Sage home">
            <img src={logoDark} alt="Sandalwood & Sage" className="h-7 w-auto block dark:hidden" />
            <img src={logoLight} alt="Sandalwood & Sage" className="h-7 w-auto hidden dark:block" />
          </a>
          <p className="text-[0.7rem] sm:text-xs text-muted-foreground leading-relaxed max-w-[18ch]">
            Two sides. One question. You decide.
          </p>
          <div className="flex items-center gap-3.5 mt-1">
            <a
              href="https://www.youtube.com/@SandalwoodAndSage"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Youtube size={15} />
            </a>
            <a
              href="https://open.spotify.com/show/033ei3X7wU9mMlqFKDQUWs?si=8c163ebf934b487c"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Spotify"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SpotifyIcon size={15} />
            </a>
            <a
              href="https://podcasts.apple.com/gb/podcast/sandalwood-sage-what-were-arguing-about-this-week/id1896168647"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Apple Podcasts"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Podcast size={15} />
            </a>
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RSS Feed"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Rss size={15} />
            </a>
          </div>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold text-section-label uppercase tracking-[0.18em] mb-1">
            Navigate
          </p>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
            >
              {link.label}
            </a>
          ))}
          <a
            href="mailto:hello@sandalwoodandsage.com"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5 mt-1"
          >
            hello@sandalwoodandsage.com
          </a>
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-section-label uppercase tracking-[0.18em]">
              FAQ
            </p>
            <Link
              to="/faq"
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              See all →
            </Link>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.slice(0, 4).map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/60">
                <AccordionTrigger className="text-xs text-muted-foreground hover:text-foreground py-3 text-left leading-snug hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[0.7rem] sm:text-xs text-muted-foreground leading-relaxed pb-3">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Link
            to="/faq"
            className="inline-block mt-3 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            View all FAQs →
          </Link>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-border/60 text-[0.65rem] sm:text-[0.7rem] text-muted-foreground">
        © {new Date().getFullYear()} Sandalwood &amp; Sage. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
