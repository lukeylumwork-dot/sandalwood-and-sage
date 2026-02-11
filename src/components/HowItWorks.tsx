const steps = [
  {
    number: "1",
    title: "One question",
    description: "Each episode is framed around a single, clearly stated question.",
  },
  {
    number: "2",
    title: "Two perspectives",
    description: "Two sides present their strongest case, grounded in research and reasoning.",
  },
  {
    number: "3",
    title: "Evidence-led exchange",
    description: "Arguments are weighed on merit, with sources cited and claims examined.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="mx-auto max-w-4xl px-5 py-16">
    <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">
      How it Works
    </p>
    <div className="grid gap-6 md:grid-cols-3">
      {steps.map((step) => (
        <div key={step.number} className="rounded-lg border bg-card p-6">
          <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {step.number}
          </span>
          <h3 className="mt-2 text-base font-semibold text-card-foreground">
            {step.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorks;
