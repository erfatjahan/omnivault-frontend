import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success("Thank you for subscribing to our newsletter!");
    setNewsletterEmail("");
  };

  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Our Products", path: "/products" },
      { name: "FAQ", path: "/faq" },
      { name: "Contact Us", path: "/contact" },
    ],
    customer: [
      { name: "Shopping Bag", path: "/cart" },
      { name: "My Orders", path: "/orders" },
      { name: "Shipping Information", path: "/faq" },
      { name: "Track Delivery", path: "/orders" },
    ],
    legal: [
      { name: "Privacy Policy", path: "#" },
      { name: "Terms of Service", path: "#" },
      { name: "Return & Refund", path: "#" },
      { name: "Payment Security", path: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Safe & lightning fast shipping",
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      desc: "100% encrypted & protected",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      desc: "30-day hassle-free policy",
    },
  ];

  return (
    <footer className="relative mt-20 border-t border-[#e8d5dc] dark:border-white/10 bg-white/40 dark:bg-black/30 backdrop-blur-2xl transition-colors duration-300">
      {/* Features banner */}
      <div className="border-b border-[#e8d5dc]/60 dark:border-white/5 py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-sm backdrop-blur-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 text-[#8a3854] dark:text-[#e4a8b8] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2b141d] dark:text-[#f7eef1]">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-[#8c6772] dark:text-[#b8959f] mt-0.5">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 pt-12 pb-24 md:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-12">
          <div className="sm:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1 font-mono text-xl font-black tracking-widest text-[#2b141d] dark:text-[#f7eef1] uppercase"
            >
              Omnivault
            </Link>
            <p className="text-xs leading-relaxed text-[#8c6772] dark:text-[#b8959f] max-w-sm">
              Discover curated luxury essentials and handcrafted lifestyle collections.
              Elevating everyday elegance with seamless online shopping experiences.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-[#66424e] dark:text-[#cfb0ba]">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#9c5b6f] flex-shrink-0" />
                <span>support@omnivault.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#9c5b6f] flex-shrink-0" />
                <span>+880 1800 000000</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#9c5b6f] flex-shrink-0" />
                <span>Chattogram, Bangladesh</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2b141d] dark:text-[#f7eef1] mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#8c6772] hover:text-[#9c5b6f] dark:text-[#b8959f] dark:hover:text-[#f7eef1] transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2b141d] dark:text-[#f7eef1] mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.customer.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#8c6772] hover:text-[#9c5b6f] dark:text-[#b8959f] dark:hover:text-[#f7eef1] transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2b141d] dark:text-[#f7eef1] mb-4">
              Legal & Terms
            </h3>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#8c6772] hover:text-[#9c5b6f] dark:text-[#b8959f] dark:hover:text-[#f7eef1] transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-8 mb-10 bg-gradient-to-r from-[#9c5b6f]/15 via-white/50 to-[#9c5b6f]/10 dark:from-white/5 dark:via-white/10 dark:to-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-lg shadow-black/5">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9c5b6f]/10 text-[#8a3854] dark:text-[#e4a8b8] text-[11px] font-bold">
              <span>Newsletter</span>
            </div>
            <h3 className="text-base sm:text-xl font-bold text-[#2b141d] dark:text-[#f7eef1]">
              Stay ahead with curated releases & private sales
            </h3>
            <p className="text-xs text-[#8c6772] dark:text-[#b8959f]">
              Be the first to know about new collection launches and limited discounts.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-center gap-2 pt-2 max-w-md mx-auto"
            >
              <div className="relative w-full">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c6772] dark:text-[#b8959f]" />
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-white/5 border border-[#e8d5dc] dark:border-white/10 rounded-2xl text-xs font-semibold text-[#2b141d] dark:text-[#f7eef1] placeholder-[#8c6772]/60 outline-none focus:ring-2 focus:ring-[#9c5b6f]/40 transition"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#9c5b6f] hover:bg-[#854b5d] text-white text-xs font-bold shadow-md shadow-[#9c5b6f]/20 transition active:scale-95 flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e8d5dc]/70 dark:border-white/10 text-xs">
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 text-[#8c6772] hover:text-[#9c5b6f] hover:bg-white dark:text-[#b8959f] dark:hover:text-[#f7eef1] dark:hover:bg-white/10 transition active:scale-90"
                >
                  <Icon className="w-4 h-4 stroke-[2]" />
                </a>
              );
            })}
          </div>

          <div className="text-center sm:text-right space-y-1">
            <p className="text-[#8c6772] dark:text-[#b8959f]">
              © {new Date().getFullYear()} <span className="font-bold text-[#2b141d] dark:text-[#f7eef1]">Omnivault</span>. All rights reserved.
            </p>
            <p className="text-[11px] text-[#8c6772]/80 dark:text-[#b8959f]/80 flex items-center justify-center sm:justify-end gap-1">
              <span>Crafted with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
              <span>by <strong className="text-[#2b141d] dark:text-[#f7eef1]">Erfat</strong></span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;