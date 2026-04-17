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

const credo = [
  "Democratic citizenship thrives on deliberation.",
  "Deliberation is the process of generative debate.",
  "Deliberation serves democracy when it is easily accessible.",
  "Generative debate is a process of discovery through argument.",
  "We build Arguments by organising evidence.",
  "We communicate clearly so that they are easily accessible.",
  "We make our Arguments and Judgements transparently.",
  "We listen attentively to other points of view.",
  "We look for common ground even if there's not much of it to be found.",
  "We sometimes change our minds.",
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

    <div className="mt-12">
      <p className="text-xs font-medium uppercase tracking-widest text-section-label mb-2">
        Our Credo
      </p>
      <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
        What we believe.
      </h3>
      <div className="rounded-xl border bg-card p-6 md:p-8">
        <ul className="space-y-3">
          {credo.map((line, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm md:text-base text-card-foreground leading-relaxed"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default HowItWorks;