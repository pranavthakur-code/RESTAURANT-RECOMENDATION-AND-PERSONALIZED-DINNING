import { Button } from "@/components/ui/button";
import { CalendarDays, Users, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import BookingDialog from "@/components/BookingDialog";

const venues = [
  {
    name: "Café Mocha",
    type: "Café",
    location: "Connaught Place",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
    capacity: "2-8",
    points: 25,
  },
  {
    name: "The Grand Pavilion",
    type: "Fine Dining",
    location: "Hauz Khas",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    capacity: "2-20",
    points: 40,
  },
  {
    name: "Skyline Lounge",
    type: "Rooftop Bar",
    location: "Aerocity",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop",
    capacity: "4-15",
    points: 35,
  },
];

const DineOutSection = () => {
  const [selectedVenue, setSelectedVenue] = useState<typeof venues[0] | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">DineOut Experiences</h2>
            <p className="text-muted-foreground">Book a table & earn loyalty points</p>
          </div>
          <Link to="/dineout">
            <Button variant="ghost" className="text-primary gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {venues.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/20 transition-all group cursor-pointer"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-accent-foreground">
                  {v.type}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-lg mb-2">{v.name}</h3>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{v.location}</span>
                  <span className="flex items-center gap-2"><Users className="w-4 h-4" />{v.capacity} guests</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-loyalty">Earn {v.points} pts</span>
                  <Button variant="hero" size="sm" onClick={() => { setSelectedVenue(v); setOpen(true); }}>
                    <CalendarDays className="w-4 h-4 mr-1" /> Book
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <BookingDialog open={open} onOpenChange={setOpen} venue={selectedVenue} />
    </section>
  );
};

export default DineOutSection;
