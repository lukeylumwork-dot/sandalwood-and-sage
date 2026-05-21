import { Rss, Youtube } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";

const navLinks = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Latest Episode", href: "#featured" },
  { label: "All Episodes", href: "#episodes" },
  { label: "Subscribe", href: "#subscribe" },
];

const faq = [
  {
    q: "How often are new episodes released?",
    a: "New episodes drop regularly, covering current affairs, politics, society, and sport. Subscribe to the mailing list or RSS feed to get notified.",
  },
  {
    q: "Are the debates AI-generated?",
    a: "Yes. Each episode uses AI to research and produce balanced, well-argued cases for both sides of a topic — so you can hear the strongest version of each position.",
  },
  {
    q: "Can I suggest a topic?",
    a: "Absolutely. Use the topic submission form on the home page to pitch your debate idea. We read every suggestion.",
  },
  {
    q: "Where can I listen?",
    a: "Episodes are available on YouTube now, with Spotify and Apple Podcasts coming soon. You can also subscribe via RSS feed or the mailing list.",
  },
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
          <div className="flex items-center gap-3 mt-1">
            <a
              href="https://www.youtube.com/@SandalwoodAndSage"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Youtube size={16} />
            </a>
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RSS Feed"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Rss size={16} />
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
          <p className="text-[10px] font-semibold text-section-label uppercase tracking-[0.18em] mb-1">
            FAQ
          </p>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
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
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-border/60 text-[0.65rem] sm:text-[0.7rem] text-muted-foreground">
        © {new Date().getFullYear()} Sandalwood &amp; Sage. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
