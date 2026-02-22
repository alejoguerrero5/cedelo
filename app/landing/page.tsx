import Navbar from "@/components/common/Navbar";
import Hero from "@/components/landing/Hero";
/* import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import Calculator from '@/components/Calculator';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import RegistrationForm from '@/components/RegistrationForm';
import Footer from '@/components/Footer'; */

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      {/*  <HowItWorks />
      <Benefits />
      <Calculator />
      <Testimonials />
      <FAQ />
      <RegistrationForm />
      <Footer /> */}
    </div>
  );
};

export default Landing;
