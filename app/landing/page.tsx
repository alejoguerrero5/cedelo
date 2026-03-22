import Benefits from "@/components/landing/Benefits";
import Calculator from "@/components/landing/Calculator";
import FAQ from "@/components/landing/FAQ";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import RegistrationForm from "@/components/landing/RegistrationForm";
import Testimonials from "@/components/landing/Testimonials";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <HowItWorks />
      <Benefits />
      <Calculator />
      <Testimonials />
      <FAQ />
      <RegistrationForm />
    </div>
  );
};

export default Landing;
