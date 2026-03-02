import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedRestaurants from "@/components/FeaturedRestaurants";
import DineOutSection from "@/components/DineOutSection";
import LoyaltySection from "@/components/LoyaltySection";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <FeaturedRestaurants />
      <DineOutSection />
      <LoyaltySection />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
