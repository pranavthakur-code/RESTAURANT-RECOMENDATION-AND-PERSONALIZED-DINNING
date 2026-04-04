import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Pizza", emoji: "🍕", search: "Pizza" },
  { name: "Burgers", emoji: "🍔", search: "Burger" },
  { name: "Biryani", emoji: "🍛", search: "Biryani" },
  { name: "Sushi", emoji: "🍣", search: "Sushi" },
  { name: "Chinese", emoji: "🥡", search: "Chinese" },
  { name: "Desserts", emoji: "🍰", search: "Dessert" },
  { name: "Healthy", emoji: "🥗", search: "Healthy" },
  { name: "Coffee", emoji: "☕", search: "Coffee" },
];

const CategorySection = () => {
  const navigate = useNavigate();

  const handleClick = (search: string) => {
    navigate(`/restaurants?search=${encodeURIComponent(search)}`);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-display font-bold mb-8">What are you craving?</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleClick(cat.search)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors cursor-pointer"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-medium text-muted-foreground">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
