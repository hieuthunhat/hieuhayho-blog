import Hero from '@/components/home/hero';
import Stats from '@/components/home/stats';
import WorkGrid from '@/components/home/work-grid';
import ToolsCard from '@/components/home/tools-card';
import ContactCTA from '@/components/home/contact-cta';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <WorkGrid />
      <ToolsCard />
      <ContactCTA />
    </>
  );
}
