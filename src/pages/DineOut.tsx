import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, MapPin, Star, Award } from "lucide-react";
import { motion } from "framer-motion";

const venues = [
  { name: "Café Mocha", type: "Café", location: "Connaught Place", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop", capacity: "2-8", rating: 4.5, points: 25 },
  { name: "The Grand Pavilion", type: "Fine Dining", location: "Hauz Khas", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop", capacity: "2-20", rating: 4.8, points: 40 },
  { name: "Skyline Lounge", type: "Rooftop Bar", location: "Aerocity", image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop", capacity: "4-15", rating: 4.6, points: 35 },
  { name: "The Spice Route", type: "Multi-Cuisine", location: "Karol Bagh", image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop", capacity: "2-12", rating: 4.3, points: 20 },
  { name: "Brewtiful Café", type: "Café", location: "Saket", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop", capacity: "2-6", rating: 4.4, points: 15 },
  { name: "Emperor's Court", type: "Fine Dining", location: "Chandni Chowk", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", capacity: "4-30", rating: 4.9, points: 50 },
];

const DineOut = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display font-bold mb-2">DineOut</h1>
          <p className="text-muted-foreground mb-8">Book tables at top restaurants & cafés, earn loyalty points with every reservation</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/20 transition-all group cursor-pointer"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-accent-foreground">{v.type}</div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3.5 h-3.5 text-loyalty fill-loyalty" />{v.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg mb-2">{v.name}</h3>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{v.location}</span>
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" />{v.capacity} guests</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs font-semibold text-loyalty">
                      <Award className="w-3.5 h-3.5" /> Earn {v.points} pts
                    </span>
                    <Button variant="hero" size="sm"><CalendarDays className="w-4 h-4 mr-1" /> Book Table</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default DineOut;
