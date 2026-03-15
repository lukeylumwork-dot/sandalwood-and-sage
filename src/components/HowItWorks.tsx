const steps = [
  {
    number: "01",
    title: "One question",
    description: "Each episode starts with a single, clearly stated question — no ambiguity, no bait.",
  },
  {
    number: "02",
    title: "Two perspectives",
    description: "Two sides make their strongest case, drawing on research, data, and reasoned argument.",
  },
  {
    number: "03",
    title: "You decide",
    description: "Claims are examined on merit. Sources are cited. The listener decides what holds up.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="mx-auto max-w-4xl px-5 py-20">
    <p className="text-xs font-medium uppercase tracking-widest text-section-label mb-2">
      How it Works
    </p>
    <h2 className="text-2xl md:text-3xl text-foreground mb-8">
      Evidence first. Always.
    </h2>
    <div className="grid gap-6 md:grid-cols-3">
      {steps.map((step) => (
        <div key={step.number} className="rounded-xl border bg-card p-6">
          <span className="text-xs font-semibold text-primary tracking-wide">
            {step.number}
          </span>
          <h3 className="mt-3 text-lg text-card-foreground">{step.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorks;