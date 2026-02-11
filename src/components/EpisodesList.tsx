import { Clock } from "lucide-react";

const episodes = [
  { title: "Should Governments Regulate AI Development?", category: "Technology", duration: "14 min", premise: "Weighing innovation against systemic risk in the age of machine intelligence." },
  { title: "Is Universal Basic Income Inevitable?", category: "Economics", duration: "13 min", premise: "Exploring whether automation demands a new social contract." },
  { title: "Should Social Media Have Age Limits?", category: "Society", duration: "15 min", premise: "Balancing youth protection with digital participation rights." },
  { title: "Can Nuclear Energy Solve the Climate Crisis?", category: "Environment", duration: "14 min", premise: "Assessing nuclear power's role in a net-zero transition." },
  { title: "Should Universities Abolish Legacy Admissions?", category: "Education", duration: "12 min", premise: "Merit versus tradition in higher education access." },
  { title: "Is Remote Work Better for Productivity?", category: "Work", duration: "13 min", premise: "Examining the evidence on flexibility, output, and collaboration." },
];

const EpisodesList = () => (
  <section id="episodes" className="mx-auto max-w-4xl px-5 py-16">
    <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">
      Episodes
    </p>
    <div className="grid gap-4">
      {episodes.map((ep, i) => (
        <div
          key={i}
          className="flex flex-col gap-1 rounded-lg border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <span className="text-xs font-medium text-primary">{ep.category}</span>
            <h3 className="text-sm font-semibold text-card-foreground mt-0.5 leading-snug">
              {ep.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{ep.premise}</p>
          </div>
          <p className="mt-2 flex shrink-0 items-center gap-1 text-xs text-muted-foreground sm:mt-0">
            <Clock size={13} /> {ep.duration}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default EpisodesList;
