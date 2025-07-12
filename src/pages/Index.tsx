
import ThreeBackground from '@/components/ThreeBackground';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Education from '@/components/Education';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import DataPreloader from '@/components/DataPreloader';

const Index = () => {
  return (
    <div className="min-h-screen">
      <DataPreloader />
      <ThreeBackground />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
