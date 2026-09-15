import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EpisodesList from "@/components/EpisodesList";

const Episodes = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="py-2 sm:py-4">
      <EpisodesList
        eyebrow="Archive"
        heading="Every episode to date"
      />
    </main>
    <Footer />
  </div>
);

export default Episodes;
