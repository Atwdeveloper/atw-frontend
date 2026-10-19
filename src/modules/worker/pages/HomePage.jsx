import TestimonialsSection from "./TestimonialsSection";
import PricingSection from "./PricingSection";
import ComplianceSection from "./ComplianceSection";
import FAQSection from "./FaqSectin";
import DownloadAppSection from "./DownloadAppSection";
import HeroSection from "./HeroSection";
import AboutUs from "./AboutusSection";
import LandingHeader from "./LeandingHeader";
import LeadingFooter from "./LeandingFooter";
const HomePage = () => {
  return (
    <>
      <LandingHeader />
      <div className="min-h-screen bg-white">
        <HeroSection />

        <div id="about">
          <AboutUs />
        </div>

        <ComplianceSection />

        <div id="pricing">
          <PricingSection />
        </div>

        <TestimonialsSection />

        <div id="faq">
          <FAQSection />
        </div>

        <div id="contact">
          <DownloadAppSection />
        </div>
      </div>
      <LeadingFooter />
    </>
  );
};

export default HomePage;
