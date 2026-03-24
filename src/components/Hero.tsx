import { Button } from "@/components/ui/button";

const Hero = () => (
  <section className="mx-auto max-w-3xl px-5 py-24 md:py-32 text-center">
    <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">
      Short-form debate podcast
    </p>
    <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl text-foreground leading-[1.1]">
      Two sides. One question.
      <br className="hidden sm:block" />
      <span className="text-primary">Fifteen minutes.</span>
    </h1>
    <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
      Sandalwood & Sage tackles the questions that matter — with structured arguments, 
      cited evidence, and zero filler. Built for curious minds with limited time.
    </p>
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
      <Button size="lg" asChild>
        <a href="#featured">Listen to the latest episode</a>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <a href="#episodes">Browse all episodes</a>
      </Button>
    </div>
  </section>
);

export default Hero;