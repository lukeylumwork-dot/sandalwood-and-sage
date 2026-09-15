import { motion } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedEpisode from "@/components/FeaturedEpisode";
import HowItWorks from "@/components/HowItWorks";
import EpisodesList, { HOMEPAGE_EPISODE_LIMIT } from "@/components/EpisodesList";
import TopicSubmission from "@/components/TopicSubmission";
import Subscribe from "@/components/Subscribe";
import Footer from "@/components/Footer";

const section = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <motion.div initial="hidden" animate="visible" variants={section}>
          <Hero />
        </motion.div>
        {[
          <FeaturedEpisode key="featured" />,
          <EpisodesList
            key="episodes"
            limit={HOMEPAGE_EPISODE_LIMIT}
            showFilters={false}
            eyebrow="Episodes"
            heading="Latest episodes"
          />,
          <Subscribe key="subscribe" />,
          <TopicSubmission key="suggest" />,
          <HowItWorks key="how" />,
        ].map((Section, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={section}
          >
            {Section}
          </motion.div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
