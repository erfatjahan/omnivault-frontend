import React from "react";
import { Users, Target, Award, Heart, Sparkles, ShieldCheck } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make starts with empathy and care for your ultimate shopping delight."
    },
    {
      icon: Award,
      title: "Curated Quality",
      description: "We handpick every essential to guarantee premium craftsmanship and enduring reliability."
    },
    {
      icon: Users,
      title: "Vibrant Community",
      description: "Cultivating lasting bonds and genuine trust across our growing family of creators and shoppers."
    },
    {
      icon: Target,
      title: "Modern Innovation",
      description: "Continuously refining our seamless digital studio to make your browsing fluid and effortless."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 flex justify-center items-center">
      <div className="w-full max-w-5xl">
        
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#e8d5dc] dark:border-white/10 backdrop-blur-md text-xs font-mono font-bold tracking-widest text-[#8a3854] dark:text-[#e4a8b8] uppercase mb-4 shadow-sm">
            Our Essence & Philosophy
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#2b141d] dark:text-[#f7eef1] mb-4">
            About <span className="text-[#8a3854] dark:text-[#c47790]">Omnivault</span>
          </h1>

          <p className="text-sm md:text-base text-[#634852] dark:text-[#b8959f] max-w-2xl mx-auto leading-relaxed font-medium">
            Your destination for elevated living—crafting a serene, design-led marketplace tailored to quality, aesthetics, and simplicity.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-[28px] bg-white/75 dark:bg-black/35 backdrop-blur-2xl border border-[#e8d5dc] dark:border-white/10 shadow-xl shadow-black/5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#8a3854]/40 dark:hover:border-[#9c5b6f]/40 hover:shadow-2xl"
              >
                <div className="w-14 h-14 mb-4 rounded-2xl bg-[#f7edf1] dark:bg-white/10 text-[#8a3854] dark:text-[#e4a8b8] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 border border-[#edd7df] dark:border-white/10">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-[#2b141d] dark:text-[#f7eef1] mb-2">
                  {value.title}
                </h3>
                <p className="text-xs text-[#634852] dark:text-[#b8959f] leading-relaxed font-medium">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
        <div className="relative rounded-[32px] md:rounded-[36px] bg-white/75 dark:bg-black/35 backdrop-blur-2xl border border-[#e8d5dc] dark:border-white/10 shadow-2xl shadow-black/5 p-7 md:p-10 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between pb-6 mb-6 border-b border-[#ebd7df] dark:border-white/10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8a3854] dark:text-[#e4a8b8]">
                Behind the Brand
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2b141d] dark:text-[#f7eef1] mt-1">
                The Story of Omnivault
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 dark:bg-white/10 border border-[#e8d5dc] dark:border-white/10 text-xs font-semibold text-[#5a3240] dark:text-[#cfb0ba] self-start md:self-auto shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#8a3854] dark:text-[#c47790]" />
              Authentic & Trusted
            </div>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-[#5a3240] dark:text-[#d4bcc4] leading-relaxed font-medium">
            <p>
              Born from a pursuit of minimalist beauty and transparent digital shopping, Omnivault was established to connect thoughtful lifestyle essentials with design-conscious individuals. We replace clutter with curated purpose.
            </p>
            <p>
              Every collection in our catalog is rigorously verified for ethical craft and lasting utility, ensuring an effortless, tactile online experience from initial discovery to doorstep arrival.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;