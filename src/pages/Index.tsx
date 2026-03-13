import { motion } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedEpisode from "@/components/FeaturedEpisode";
import HowItWorks from "@/components/HowItWorks";
import EpisodesList from "@/components/EpisodesList";
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
        {[FeaturedEpisode, EpisodesList, HowItWorks].map((Section, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={section}
          >
            <Section />
          </motion.div>
        ))}
        {[TopicSubmission, Subscribe].map((Section, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={section}
          >
            <Section />
          </motion.div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
