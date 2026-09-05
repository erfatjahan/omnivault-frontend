import { useState } from "react";
import { Link } from "react-router-dom"; 
import { Mail, Send, Package } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail("");
  };

  return (
    <section className="py-16">
      <div className="glass-panel text-center p-6 md:p-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link
              to="/products"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9c5b6f] hover:bg-[#854b5d] text-white text-xs md:text-sm font-bold shadow-lg shadow-[#9c5b6f]/25 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <Package className="w-4 h-4 stroke-[2]" />
              <span>Explore All Products</span>
            </Link>
          </div>

          <div className="w-16 h-16 mx-auto mb-6 bg-[#9c5b6f]/15 dark:bg-white/10 rounded-full flex items-center justify-center text-[#9c5b6f] dark:text-[#e4a8b8]">
            <Mail className="w-8 h-8 stroke-[1.8]" />
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-4">
            Stay in the Loop
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Subscribe to our newsletter and be the first to know about exclusive
            deals, new arrivals, and special offers.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c5b6f] text-foreground placeholder-muted-foreground"
                required
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-[#9c5b6f] hover:bg-[#854b5d] text-white rounded-lg font-semibold flex items-center justify-center space-x-2 transition cursor-pointer active:scale-95 shadow-md"
            >
              <Send className="w-5 h-5" />
              <span>Subscribe</span>
            </button>
          </form>

          <p className="text-sm text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;