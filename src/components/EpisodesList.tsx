import { useState, useEffect, useMemo } from "react";
import { Clock, Zap, Share2, Link, Twitter, Video, Search } from "lucide-react";
import AudioPlayer, { type AudioSegment } from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import SidesSplit from "@/components/SidesSplit";
import { VOICES } from "@/lib/voices";
import { useCachedEpisodes } from "@/hooks/use-cached-episodes";
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
    summary: "This episode examines the case for and against government oversight of artificial intelligence research and deployment, drawing on recent proposals from the EU, US, and China.",
    forArgument: "Governments must regulate AI development now. Unchecked artificial intelligence poses existential risks, from autonomous weapons to mass surveillance and algorithmic discrimination. The EU AI Act demonstrates that proportionate regulation is possible. Without guardrails, a handful of corporations will shape society's future with no democratic accountability. History shows that industries left to self-regulate — tobacco, financial derivatives, social media — cause enormous harm before corrective action arrives.",
    againstArgument: "Government regulation of AI at this stage would be premature and counterproductive. Innovation moves faster than legislation, and rigid rules will lock in today's understanding of a rapidly evolving technology. Heavy regulation drives talent and investment to less cautious jurisdictions, weakening the very countries trying to lead responsibly. Voluntary commitments and industry standards are more adaptive. We should foster innovation first and regulate specific harms as they emerge, not strangle a transformative technology in its infancy.",
    keyPoints: [
      "Proponents cite existential risk, labour displacement, and algorithmic bias as grounds for regulation.",
      "Opponents argue that heavy-handed rules slow progress and shift advantage to less regulated jurisdictions.",
      "Both sides reference the EU AI Act and voluntary industry commitments.",
    ],
    side_a_label: "For Regulation",
    side_b_label: "Against Regulation",
    side_a_summary: "Unchecked AI development poses systemic risks that only coordinated government oversight can address before the technology outpaces democratic control.",
    side_b_summary: "Premature regulation entrenches incumbents, stifles innovation, and cannot keep pace with a technology that moves faster than any legislature.",
  },
  {
    title: "Is Universal Basic Income Inevitable?",
    category: "Money",
    duration: "13 min",
    premise: "Exploring whether automation demands a new social contract.",
    question: "Will technological unemployment make UBI a necessity, or are there better ways to adapt?",
    summary: "A structured look at whether rising automation makes universal basic income unavoidable, or whether existing welfare and retraining systems can evolve fast enough.",
    forArgument: "Universal basic income is becoming inevitable as automation accelerates. Millions of jobs in transport, retail, and administration face elimination within a decade. Existing welfare systems are too fragmented and stigmatising to cope. UBI trials in Finland and Stockton, California showed improvements in wellbeing, health, and even entrepreneurship. A floor of economic security would free people to retrain, care for families, and contribute in ways the market does not value.",
    againstArgument: "Universal basic income is a blunt and fiscally reckless response to automation. Targeted retraining programmes and earned income tax credits address displacement without the enormous cost of paying everyone regardless of need. UBI trials have been small and short-lived, telling us little about long-term effects on inflation, work incentive, and public finances. We should strengthen existing safety nets and invest in education, not abandon the principle that work and contribution are central to social cohesion.",
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
    forArgument: "Social media platforms should enforce meaningful age limits. The evidence linking heavy social media use to anxiety, depression, and body image issues in adolescents is substantial and growing. Children lack the cognitive development to navigate algorithmic manipulation, cyberbullying, and predatory content. Age verification technology exists and is improving. Just as we restrict alcohol, driving, and gambling by age, we should protect young minds from platforms designed to maximise engagement at the expense of wellbeing.",
    againstArgument: "Imposing age limits on social media is an overreach that will not solve the underlying problems. Age verification raises serious privacy concerns and is easily circumvented. Banning young people from platforms removes them from essential social spaces where they learn, connect, and express themselves. The better approach is digital literacy education, platform design regulation, and parental tools — not blanket exclusions that treat all young people as incapable and all online interaction as harmful.",
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
    forArgument: "Nuclear energy is essential to solving the climate crisis. It provides reliable, carbon-free baseload power that wind and solar cannot yet match. France decarbonised its grid in two decades using nuclear. Modern designs and small modular reactors promise safer, faster, cheaper deployment. Ruling out nuclear on ideological grounds while the planet warms is irresponsible. We need every proven low-carbon technology working together, and nuclear has the strongest track record of any of them.",
    againstArgument: "Nuclear energy is too slow, too expensive, and too risky to be the answer to climate change. New reactors take a decade or more to build and routinely exceed budgets by billions. Wind and solar are already cheaper per megawatt-hour and deploying at scale. Small modular reactors remain largely theoretical. The risks of accidents, waste storage, and weapons proliferation have not gone away. Every pound spent on nuclear is a pound not spent on renewables and storage, which are ready now.",
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
    forArgument: "Legacy admissions should be abolished. They entrench privilege by giving an unearned advantage to applicants who are already disproportionately wealthy and white. Studies show legacy applicants are admitted at two to five times the rate of non-legacy peers at elite institutions. This undermines the promise of meritocracy and reduces social mobility. Universities claim to value diversity and equal opportunity — legacy preferences contradict both. Financial support from alumni should not come at the cost of fairness.",
    againstArgument: "Legacy admissions serve a legitimate institutional purpose that benefits all students. Alumni loyalty and giving fund scholarships, facilities, and research that would otherwise go unfunded. Abolishing legacy preferences would reduce donations and harm the very students reformers claim to help. Legacy applicants also contribute to institutional culture and community continuity. The admissions process already weighs many factors beyond grades — geographic diversity, extracurriculars, personal circumstances — and legacy is simply one more.",
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
    forArgument: "Remote work is better for productivity. Multiple studies show that workers are more focused, take fewer sick days, and report higher satisfaction when working from home. Eliminating commutes returns hours to employees and reduces stress. Companies save on office costs while accessing a global talent pool. The tools for remote collaboration have matured enormously. Forcing people back to offices is driven by managerial preference, not evidence, and risks losing top talent to more flexible competitors.",
    againstArgument: "Remote work erodes the conditions that drive long-term productivity. Spontaneous collaboration, mentorship, and the transmission of organisational culture all suffer when teams are distributed. Studies showing productivity gains often measure individual output on routine tasks, not the creative and strategic work that drives innovation. New employees struggle to learn and integrate remotely. Hybrid models create coordination overhead and two-tier cultures. The office exists for good reasons, and abandoning it wholesale is a mistake.",
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
    forArgument: "Professional sport should embrace AI officiating. Human referees make costly errors that decide matches, careers, and millions in revenue. Goal-line technology and VAR have already proven that technology improves accuracy. AI can process data in milliseconds with no bias, fatigue, or home-crowd pressure. The integrity of competition should rest on correct decisions, not on the lottery of human fallibility. Fans want fair outcomes, and AI delivers them more reliably than any human can.",
    againstArgument: "Full AI officiating would strip sport of the human judgement that makes it compelling. Many decisions require contextual interpretation — intent, advantage, spirit of the game — that algorithms cannot replicate. VAR has already shown that technology introduces its own controversies, delays, and frustrations. Fans value the drama, debate, and imperfection that human officials bring. Sport is a human endeavour, and replacing referees with machines would sterilise it. Better training and accountability for officials is the right path.",
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
    forArgument: "Voting should be compulsory. In Australia, where it is mandatory, turnout consistently exceeds ninety per cent, producing governments with genuine popular mandates. Compulsory voting reduces the influence of money spent on voter mobilisation and diminishes the power of extreme fringes who are disproportionately motivated to vote. It reinforces the idea that citizenship carries responsibilities, not just rights. Low turnout distorts democracy — compulsory participation is the simplest and most proven corrective.",
    againstArgument: "Compulsory voting violates individual freedom. The right to vote must include the right not to vote — forcing participation is coercion, not democracy. Mandatory voting inflates turnout with uninformed and disengaged voters, diluting the quality of democratic choice. It also masks the real problem: people do not vote because they feel unrepresented, and compelling them to the ballot box does nothing to fix that. Democracies should earn participation through better candidates and policies, not enforce it through penalties.",
    keyPoints: [
      "Countries with compulsory voting typically see turnout above 90 per cent.",
      "Supporters argue it reduces the influence of money and extreme mobilisation.",
      "Opponents see it as a restriction on liberty and question the value of uninformed votes.",
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

function buildSegments(ep: Episode): AudioSegment[] {
  return [
    { text: `${ep.title}. ${ep.question}`, voiceId: VOICES.HOST },
    { text: `The case for. ${ep.forArgument}`, voiceId: VOICES.FOR },
    { text: `The case against. ${ep.againstArgument}`, voiceId: VOICES.AGAINST },
  ];
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
  const cachedSet = useCachedEpisodes(allEpisodes);

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
        {filtered.map((ep, i) => {
          const globalIndex = allEpisodes.indexOf(ep);
          const isCached = cachedSet.has(globalIndex);
          return (
            <button
              key={i}
              onClick={() => setSelectedEpisode(ep)}
              className="flex flex-col gap-1 rounded-lg border bg-card p-5 text-left transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">{ep.category}</span>
                  {isCached && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      <Zap size={10} /> Instant
                    </span>
                  )}
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
              <p className="mt-2 flex shrink-0 items-center gap-1 text-xs text-muted-foreground sm:mt-0">
                <Clock size={13} /> {ep.duration}
              </p>
            </button>
          );
        })}
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
                {/* Video player if available */}
                {selectedEpisode.video_url && (
                  <VideoPlayer
                    url={selectedEpisode.video_url}
                    title={selectedEpisode.title}
                  />
                )}

                {/* Pro | Con sides split */}
                {selectedEpisode.side_a_label && selectedEpisode.side_b_label && (
                  <SidesSplit
                    sideALabel={selectedEpisode.side_a_label}
                    sideBLabel={selectedEpisode.side_b_label}
                    sideASummary={selectedEpisode.side_a_summary}
                    sideBSummary={selectedEpisode.side_b_summary}
                  />
                )}

                {/* Audio player */}
                <div className="pt-2">
                  <AudioPlayer
                    label={selectedEpisode.title}
                    segments={buildSegments(selectedEpisode)}
                  />
                </div>

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

                {/* Share buttons */}
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
