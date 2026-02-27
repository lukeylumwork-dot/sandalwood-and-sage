import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedEpisode from "@/components/FeaturedEpisode";
import HowItWorks from "@/components/HowItWorks";
import EpisodesList from "@/components/EpisodesList";

import TopicSubmission from "@/components/TopicSubmission";
import DebateGenerator from "@/components/DebateGenerator";
import Subscribe from "@/components/Subscribe";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedEpisode />
        <HowItWorks />
        <EpisodesList />
        
        <DebateGenerator />
        <TopicSubmission />
        <Subscribe />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
