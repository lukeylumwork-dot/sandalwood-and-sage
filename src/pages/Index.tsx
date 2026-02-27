const Section = ({
  label,
  title,
  description,
  links,
}: {
  label?: string;
  title: string;
  description: string;
  links: { text: string; href: string }[];
}) => (
  <section className="border-t border-border py-10">
    {label && (
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
        {label}
      </p>
    )}
    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-lg">
      {description}
    </p>
    <div className="mt-5 flex flex-col gap-2.5 sm:max-w-xs">
      {links.map((l) => (
        <a
          key={l.text}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary text-center"
        >
          {l.text}
        </a>
      ))}
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-xl px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Gareth Cadwallader
          </h1>
          <p className="mt-1.5 text-sm font-medium text-muted-foreground">
            Business Leader. Non Executive Director. Founder Coach.
          </p>
          <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-lg">
            Thirty plus years building and scaling technology businesses across
            telecoms, software, cloud infrastructure and insurtech. Twenty eight
            board and advisory appointments. Now focused on supporting ambitious
            SaaS founders.
          </p>
        </header>

        {/* The Founders Way */}
        <Section
          title="The Founders Way"
          description="Coaching and development for SaaS founders and founding teams. Built around real operating experience and designed for growth stage businesses."
          links={[
            { text: "Founder Coaching and Advisory", href: "#" },
            { text: "Scaling Academy", href: "#" },
            { text: "Founder Conversations", href: "#" },
            { text: "Join the Mailing List", href: "#" },
          ]}
        />

        {/* Facing */}
        <Section
          label="Structured Debate"
          title="Facing"
          description="Fifteen minute debates grounded in evidence and reasoned argument."
          links={[
            { text: "Listen on Spotify", href: "#" },
            { text: "Watch on YouTube", href: "#" },
            { text: "Subscribe", href: "#" },
          ]}
        />

        {/* Audio Fiction */}
        <Section
          label="Serialised Audio Fiction"
          title="Audio Fiction"
          description="Long form audio novels exploring the future role of technology in sport."
          links={[
            { text: "Listen on Audible", href: "#" },
            { text: "Official Series Site", href: "#" },
          ]}
        />

        {/* Connect */}
        <section className="border-t border-border py-10">
          <h2 className="text-lg font-semibold text-foreground">Connect</h2>
          <div className="mt-5 sm:max-w-xs">
            <a
              href="https://www.linkedin.com/in/garethcadwallader/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary text-center"
            >
              Connect on LinkedIn
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 pb-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Gareth Cadwallader
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
