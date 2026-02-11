import { Button } from "@/components/ui/button";

const Hero = () => (
  <section className="mx-auto max-w-4xl px-5 py-20 md:py-28 text-center">
    <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl text-foreground leading-tight">
      Two Sides. One Question.
    </h1>
    <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
      Short, structured debates grounded in evidence — not opinion. Each episode tackles one question from two perspectives in around fifteen minutes.
    </p>
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
      <Button asChild>
        <a href="#featured">Listen to the Latest</a>
      </Button>
      <Button variant="outline" asChild>
        <a href="#episodes">Browse Episodes</a>
      </Button>
    </div>
  </section>
);

export default Hero;
