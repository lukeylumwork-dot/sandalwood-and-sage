import { useState, useEffect, useMemo } from "react";
import { Clock, Share2, Link, Twitter, Video, Search } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import SidesSplit from "@/components/SidesSplit";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
  forArgument: string;
  againstArgument: string;
  keyPoints: string[];
  video_url?: string;
  audio_url?: string;
  cover_image_url?: string;
  side_a_label?: string;
  side_b_label?: string;
  side_a_summary?: string;
  side_b_summary?: string;
  _isFromDb?: boolean;
}

const episodes: Episode[] = [
  {
    title: "Should Governments Regulate AI Development?",
    category: "Tech",
    duration: "14 min",
    premise: "Weighing innovation against systemic risk in the age of machine intelligence.",
    question: "Is state-level regulation of AI necessary to prevent harm, or does it risk doing more damage than it prevents?",
    summary: "This episode examines the case for and against government oversight of artificial intelligence research and deployment.",
    forArgument: "Governments must regulate AI development now. Unchecked artificial intelligence poses existential risks.",
    againstArgument: "Government regulation of AI at this stage would be premature and counterproductive.",
    keyPoints: [
      "Proponents cite existential risk, labour displacement, and algorithmic bias.",
      "Opponents argue heavy-handed rules slow progress.",
      "Both sides reference the EU AI Act.",
    ],
    side_a_label: "For Regulation",
    side_b_label: "Against Regulation",
    side_a_summary: "Unchecked AI development poses systemic risks that only coordinated government oversight can address.",
    side_b_summary: "Premature regulation entrenches incumbents and stifles innovation.",
  },
  {
    title: "Is Universal Basic Income Inevitable?",
    category: "Money",
    duration: "13 min",
    premise: "Exploring whether automation demands a new social contract.",
    question: "Will technological unemployment make UBI a necessity?",
    summary: "A structured look at whether rising automation makes universal basic income unavoidable.",
    forArgument: "Universal basic income is becoming inevitable as automation accelerates.",
    againstArgument: "Universal basic income is a blunt and fiscally reckless response to automation.",
    keyPoints: [
      "UBI trials offer mixed but instructive results.",
      "Critics warn of inflation and reduced work incentive.",
      "Supporters argue targeted programmes cannot keep pace.",
    ],
  },
  {
    title: "Should Social Media Have Age Limits?",
    category: "Society",
    duration: "15 min",
    premise: "Balancing youth protection with digital participation rights.",
    question: "Is restricting young people's access to social media a proportionate safeguard?",
    summary: "This episode considers proposals to impose minimum age requirements on social media platforms.",
    forArgument: "Social media platforms should enforce meaningful age limits.",
    againstArgument: "Imposing age limits on social media is an overreach.",
    keyPoints: [
      "Studies link heavy social media use to increased anxiety in teenagers.",
      "Age verification raises privacy challenges.",
      "Digital literacy education may be more effective.",
    ],
  },
  {
    title: "Can Nuclear Energy Solve the Climate Crisis?",
    category: "Tech",
    duration: "14 min",
    premise: "Assessing nuclear power's role in a net-zero transition.",
    question: "Is nuclear energy essential to decarbonisation?",
    summary: "A balanced assessment of whether nuclear power should feature prominently in climate strategy.",
    forArgument: "Nuclear energy is essential to solving the climate crisis.",
    againstArgument: "Nuclear energy is too slow, too expensive, and too risky.",
    keyPoints: [
      "Nuclear provides reliable baseload power with near-zero emissions.",
      "Construction timelines and cost overruns remain persistent challenges.",
      "Small modular reactors may change the economics.",
    ],
  },
  {
    title: "Should Universities Abolish Legacy Admissions?",
    category: "Society",
    duration: "12 min",
    premise: "Merit versus tradition in higher education access.",
    question: "Do legacy admissions undermine fairness?",
    summary: "This episode examines whether preferential treatment for children of alumni is compatible with meritocracy.",
    forArgument: "Legacy admissions should be abolished.",
    againstArgument: "Legacy admissions serve a legitimate institutional purpose.",
    keyPoints: [
      "Legacy applicants are admitted at significantly higher rates.",
      "Defenders argue alumni giving supports financial aid.",
      "Critics point to entrenched socioeconomic inequality.",
    ],
  },
  {
    title: "Is Remote Work Better for Productivity?",
    category: "Work",
    duration: "13 min",
    premise: "Examining the evidence on flexibility, output, and collaboration.",
    question: "Does remote work make people more productive?",
    summary: "A look at the growing body of evidence on remote and hybrid work arrangements.",
    forArgument: "Remote work is better for productivity.",
    againstArgument: "Remote work erodes the conditions that drive long-term productivity.",
    keyPoints: [
      "Several studies show modest productivity gains for remote workers.",
      "Managers report concerns about coordination and onboarding.",
      "Hybrid models are emerging as the most common compromise.",
    ],
  },
  {
    title: "Should Professional Sport Embrace AI Officiating?",
    category: "Sport",
    duration: "14 min",
    premise: "Testing whether algorithms can replace human judgement on the pitch.",
    question: "Would AI officials improve fairness in sport?",
    summary: "This episode explores the growing use of technology in sports officiating.",
    forArgument: "Professional sport should embrace AI officiating.",
    againstArgument: "Full AI officiating would strip sport of the human judgement that makes it compelling.",
    keyPoints: [
      "Goal-line technology and VAR have reduced clear errors.",
      "Proponents argue AI removes bias and inconsistency.",
      "Critics contend marginal calls require human context.",
    ],
  },
  {
    title: "Should Voting Be Compulsory?",
    category: "Politics",
    duration: "13 min",
    premise: "Debating whether democratic participation should be a duty, not a choice.",
    question: "Does compulsory voting strengthen democracy?",
    summary: "A structured exchange on whether making voting mandatory leads to better democratic outcomes.",
    forArgument: "Voting should be compulsory.",
    againstArgument: "Compulsory voting violates individual freedom.",
    keyPoints: [
      "Countries with compulsory voting typically see turnout above 90%.",
      "Supporters argue it reduces the influence of money.",
      "Opponents see it as a restriction on liberty.",
    ],
  },
];

const categories = ["All", "Tech", "Work", "Society", "Money", "Sport", "Politics"];

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getShareUrl(ep: Episode): string {
  return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/share-episode?episode=${toSlug(ep.title)}`;
}

const EpisodesList = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [dbEpisodes, setDbEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    supabase
      .from("generated_debates")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        const mapped: Episode[] = data.map((d: any) => ({
          title: d.title,
          category: d.category,
          duration: "",
          premise: d.summary?.slice(0, 120) + (d.summary?.length > 120 ? "…" : "") || "",
          question: d.question,
          summary: d.summary,
          forArgument: d.for_argument,
          againstArgument: d.against_argument,
          keyPoints: Array.isArray(d.key_points) ? d.key_points : [],
          video_url: d.video_url || undefined,
          audio_url: d.audio_url || undefined,
          cover_image_url: d.cover_image_url || undefined,
          side_a_label: d.side_a_label || undefined,
          side_b_label: d.side_b_label || undefined,
          side_a_summary: d.side_a_summary || undefined,
          side_b_summary: d.side_b_summary || undefined,
          _isFromDb: true,
        }));
        setDbEpisodes(mapped);
      });
  }, []);

  const allEpisodes = [...dbEpisodes, ...episodes];

  const filtered = useMemo(() => {
    let result = activeFilter === "All"
      ? allEpisodes
      : allEpisodes.filter((ep) => ep.category === activeFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (ep) =>
          ep.title.toLowerCase().includes(q) ||
          ep.premise.toLowerCase().includes(q) ||
          ep.question.toLowerCase().includes(q) ||
          ep.summary.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allEpisodes, activeFilter, searchQuery]);

  return (
    <section id="episodes" className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-xs font-medium uppercase tracking-widest text-section-label mb-4">
        Episodes
      </p>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search episodes…"
          className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

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

      <div className="grid gap-4">
        {filtered.map((ep, i) => (
          <button
            key={i}
            onClick={() => setSelectedEpisode(ep)}
            className="flex flex-col gap-1 rounded-lg border bg-card p-5 text-left transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary">{ep.category}</span>
                {ep.video_url && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                    <Video size={10} /> Video Debate
                  </span>
                )}
                {ep._isFromDb && (
                  <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    New
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-card-foreground mt-0.5 leading-snug">
                {ep.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{ep.premise}</p>
            </div>
            {ep.duration && (
              <p className="mt-2 flex shrink-0 items-center gap-1 text-xs text-muted-foreground sm:mt-0">
                <Clock size={13} /> {ep.duration}
              </p>
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">No episodes in this category yet.</p>
        )}
      </div>

      <Dialog open={!!selectedEpisode} onOpenChange={() => setSelectedEpisode(null)}>
        <DialogContent className="max-w-lg dark bg-background border-border">
          {selectedEpisode && (
            <>
              <DialogHeader>
                <span className="text-xs font-medium text-primary mb-1 block">
                  {selectedEpisode.category}
                </span>
                <DialogTitle className="text-lg leading-snug text-foreground">
                  {selectedEpisode.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {selectedEpisode.video_url && (
                  <VideoPlayer
                    url={selectedEpisode.video_url}
                    title={selectedEpisode.title}
                  />
                )}

                {selectedEpisode.side_a_label && selectedEpisode.side_b_label && (
                  <SidesSplit
                    sideALabel={selectedEpisode.side_a_label}
                    sideBLabel={selectedEpisode.side_b_label}
                    sideASummary={selectedEpisode.side_a_summary}
                    sideBSummary={selectedEpisode.side_b_summary}
                  />
                )}

                {selectedEpisode.audio_url && (
                  <div className="pt-2">
                    <AudioPlayer
                      label={selectedEpisode.title}
                      src={selectedEpisode.audio_url}
                    />
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-1">
                    The question
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedEpisode.question}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-1">
                    Summary
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedEpisode.summary}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-1">
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

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground mr-1">Share</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      navigator.clipboard.writeText(getShareUrl(selectedEpisode));
                      toast.success("Link copied to clipboard!");
                    }}
                    aria-label="Copy share link"
                  >
                    <Link size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                  >
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedEpisode.title + " — Split Decision")}&url=${encodeURIComponent(getShareUrl(selectedEpisode))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Twitter"
                    >
                      <Twitter size={14} />
                    </a>
                  </Button>
                  {typeof navigator !== "undefined" && "share" in navigator && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        navigator.share({
                          title: selectedEpisode.title,
                          text: selectedEpisode.premise,
                          url: getShareUrl(selectedEpisode),
                        }).catch(() => {});
                      }}
                      aria-label="Share via system"
                    >
                      <Share2 size={14} />
                    </Button>
                  )}
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
