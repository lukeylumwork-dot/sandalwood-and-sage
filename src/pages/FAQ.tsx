import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { faqItems } from "@/data/faq";

const FAQ = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-5 sm:py-12">
      <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.22em] text-section-label mb-2">
        FAQ
      </p>
      <h1
        className="text-2xl sm:text-3xl text-foreground mb-3 leading-tight font-normal"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        Frequently asked questions
      </h1>
      <p className="text-sm sm:text-[0.95rem] text-muted-foreground mb-10 sm:mb-12 max-w-lg leading-relaxed">
        Everything you need to know about Sandalwood &amp; Sage.
      </p>

      <div className="divide-y divide-border/70">
        {faqItems.map((item, i) => (
          <div key={i} className="py-6 sm:py-7">
            <h2 className="text-[0.95rem] sm:text-base font-semibold text-foreground mb-2 leading-snug" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {item.q}
            </h2>
            <p className="text-sm sm:text-[0.95rem] text-muted-foreground leading-[1.7] max-w-2xl">
              {item.a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-border/60">
        <p className="text-sm text-muted-foreground">
          Still have a question?{" "}
          <a href="mailto:hello@sandalwoodandsage.com" className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">
            Get in touch
          </a>
          {" "}or{" "}
          <a href="/#suggest" className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">
            suggest a topic
          </a>.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default FAQ;
