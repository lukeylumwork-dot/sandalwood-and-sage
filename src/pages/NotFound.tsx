import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-20 sm:px-5 sm:py-28">
        <p className="text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.22em] text-section-label mb-2">
          404
        </p>
        <h1 className="font-display font-normal text-2xl sm:text-3xl text-heading mb-3 leading-tight">
          We can&apos;t find that page.
        </h1>
        <p className="font-serif text-sm sm:text-[0.95rem] text-muted-foreground mb-8 max-w-lg leading-relaxed">
          The link may be out of date, or the episode may have moved. Every
          episode we have published is still in the archive.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link to="/episodes">Browse all episodes</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to the latest</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
