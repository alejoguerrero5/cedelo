import Navbar from "@/components/common/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      {/*<Benefits />
      <Calculator />
      <Testimonials />
      <FAQ />
      <RegistrationForm />
      <Footer /> */}
    </div>
  );
};

export default Landing;
