import { useState } from "react";
import { Clock } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Episode {
  title: string;
  category: string;
  duration: string;
  premise: string;
  question: string;
  summary: string;
  keyPoints: string[];
}

const episodes: Episode[] = [
  {
    title: "Should Governments Regulate AI Development?",
    category: "Tech",
    duration: "14 min",
    premise: "Weighing innovation against systemic risk in the age of machine intelligence.",
    question: "Is state-level regulation of AI necessary to prevent harm, or does it risk doing more damage than it prevents?",
    summary: "This episode examines the case for and against government oversight of artificial intelligence research and deployment, drawing on recent proposals from the EU, US, and China.",
    keyPoints: [
      "Proponents cite existential risk, labour displacement, and algorithmic bias as grounds for regulation.",
      "Opponents argue that heavy-handed rules slow progress and shift advantage to less regulated jurisdictions.",
      "Both sides reference the EU AI Act and voluntary industry commitments.",
    ],
  },
  {
    title: "Is Universal Basic Income Inevitable?",
    category: "Money",
    duration: "13 min",
    premise: "Exploring whether automation demands a new social contract.",
    question: "Will technological unemployment make UBI a necessity, or are there better ways to adapt?",
    summary: "A structured look at whether rising automation makes universal basic income unavoidable, or whether existing welfare and retraining systems can evolve fast enough.",
    keyPoints: [
      "UBI trials in Finland, Kenya, and Stockton, California offer mixed but instructive results.",
      "Critics warn of inflation, reduced work incentive, and fiscal unsustainability.",
      "Supporters argue that targeted programmes cannot keep pace with the speed of displacement.",
    ],
  },
  {
    title: "Should Social Media Have Age Limits?",
    category: "Society",
    duration: "15 min",
    premise: "Balancing youth protection with digital participation rights.",
    question: "Is restricting young people's access to social media a proportionate safeguard, or an overreach?",
    summary: "This episode considers proposals to impose minimum age requirements on social media platforms, examining evidence on adolescent mental health alongside arguments about digital literacy and rights.",
    keyPoints: [
      "Studies link heavy social media use to increased anxiety and depression in teenagers.",
      "Age verification raises privacy and enforcement challenges.",
      "Some researchers argue that digital literacy education is more effective than blanket bans.",
    ],
  },
  {
    title: "Can Nuclear Energy Solve the Climate Crisis?",
    category: "Tech",
    duration: "14 min",
    premise: "Assessing nuclear power's role in a net-zero transition.",
    question: "Is nuclear energy an essential part of decarbonisation, or an expensive distraction from renewables?",
    summary: "A balanced assessment of whether nuclear power should feature prominently in climate strategy, or whether investment is better directed towards wind, solar, and storage.",
    keyPoints: [
      "Nuclear provides reliable baseload power with near-zero emissions.",
      "Construction timelines and cost overruns remain persistent challenges.",
      "Small modular reactors may change the economics, but remain largely unproven at scale.",
    ],
  },
  {
    title: "Should Universities Abolish Legacy Admissions?",
    category: "Society",
    duration: "12 min",
    premise: "Merit versus tradition in higher education access.",
    question: "Do legacy admissions undermine fairness, or do they serve a legitimate institutional purpose?",
    summary: "This episode examines whether preferential treatment for the children of alumni is compatible with meritocratic admissions standards.",
    keyPoints: [
      "Legacy applicants are admitted at significantly higher rates at many elite institutions.",
      "Defenders argue that alumni giving supports financial aid for other students.",
      "Critics point to entrenched socioeconomic inequality and reduced social mobility.",
    ],
  },
  {
    title: "Is Remote Work Better for Productivity?",
    category: "Work",
    duration: "13 min",
    premise: "Examining the evidence on flexibility, output, and collaboration.",
    question: "Does remote work make people more productive, or does it erode the benefits of in-person collaboration?",
    summary: "A look at the growing body of evidence on remote and hybrid work arrangements, weighing measured productivity gains against concerns about culture, mentorship, and innovation.",
    keyPoints: [
      "Several studies show modest productivity gains for remote workers in focused tasks.",
      "Managers report concerns about coordination, onboarding, and spontaneous idea exchange.",
      "Hybrid models are emerging as the most common compromise, though optimal ratios remain unclear.",
    ],
  },
  {
    title: "Should Professional Sport Embrace AI Officiating?",
    category: "Sport",
    duration: "14 min",
    premise: "Testing whether algorithms can replace human judgement on the pitch.",
    question: "Would AI officials improve fairness in sport, or undermine the human element that fans value?",
    summary: "This episode explores the growing use of technology in sports officiating and asks whether full AI-driven decision-making is desirable or practical.",
    keyPoints: [
      "Goal-line technology and VAR have reduced clear errors but introduced new controversies.",
      "Proponents argue that AI removes bias and inconsistency from high-stakes decisions.",
      "Critics contend that marginal calls and interpretive judgements require human context.",
    ],
  },
  {
    title: "Should Voting Be Compulsory?",
    category: "Politics",
    duration: "13 min",
    premise: "Debating whether democratic participation should be a duty, not a choice.",
    question: "Does compulsory voting strengthen democracy, or does it violate individual freedom?",
    summary: "A structured exchange on whether making voting mandatory — as practised in Australia, Belgium, and elsewhere — leads to better democratic outcomes.",
    keyPoints: [
      "Countries with compulsory voting typically see turnout above 90 per cent.",
      "Supporters argue it reduces the influence of money and extreme mobilisation.",
      "Opponents see it as a restriction on liberty and question the value of uninformed votes.",
    ],
  },
];

const categories = ["All", "Tech", "Work", "Society", "Money", "Sport", "Politics"];

const EpisodesList = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const filtered = activeFilter === "All"
    ? episodes
    : episodes.filter((ep) => ep.category === activeFilter);

  return (
    <section id="episodes" className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">
        Episodes
      </p>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeFilter === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Episode list */}
      <div className="grid gap-4">
        {filtered.map((ep, i) => (
          <button
            key={i}
            onClick={() => setSelectedEpisode(ep)}
            className="flex flex-col gap-1 rounded-lg border bg-card p-5 text-left transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
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
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">No episodes in this category yet.</p>
        )}
      </div>

      {/* Episode detail modal */}
      <Dialog open={!!selectedEpisode} onOpenChange={() => setSelectedEpisode(null)}>
        <DialogContent className="max-w-lg">
          {selectedEpisode && (
            <>
              <DialogHeader>
                <span className="text-xs font-medium text-primary mb-1 block">
                  {selectedEpisode.category}
                </span>
                <DialogTitle className="text-lg leading-snug">
                  {selectedEpisode.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    The question
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedEpisode.question}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Summary
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedEpisode.summary}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Key points
                  </p>
                  <ul className="space-y-1.5">
                    {selectedEpisode.keyPoints.map((point, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <AudioPlayer label={selectedEpisode.title} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EpisodesList;
