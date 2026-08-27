import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState({ 0: true });

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our curated collection, choose your desired items, and add them to your bag. Follow the smooth checkout steps to finalize your order with secure payment options."
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We support all major debit/credit cards, mobile banking, PayPal, and encrypted secure payment gateways for a seamless shopping experience."
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard delivery typically takes 3–5 business days. Express shipping is also available during checkout if you need your essentials faster."
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer an easy 30-day hassle-free return policy. Products must be unused, unwashed, and in their original packaging with tags intact."
    }
  ];

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-6 flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#e8d5dc] dark:border-white/10 backdrop-blur-md text-xs font-mono font-bold tracking-widest text-[#8a3854] dark:text-[#e4a8b8] uppercase mb-4 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5" />
            Support & Help
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#2b141d] dark:text-[#f7eef1] mb-3">
            Frequently Asked <span className="text-[#8a3854] dark:text-[#c47790]">Questions</span>
          </h1>
          
          <p className="text-sm md:text-base text-[#634852] dark:text-[#b8959f] max-w-md mx-auto font-medium">
            Everything you need to know about our products, orders, shipping, and seamless checkout.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = !!openItems[index];

            return (
              <div
                key={index}
                className={`transition-all duration-300 rounded-[24px] md:rounded-[28px] border backdrop-blur-2xl overflow-hidden shadow-xl shadow-black/5 ${
                  isOpen
                    ? "bg-white/85 dark:bg-black/45 border-[#e8d5dc] dark:border-white/15 shadow-2xl"
                    : "bg-white/70 dark:bg-black/25 border-[#ebd7df] dark:border-white/5 hover:bg-white/80 dark:hover:bg-black/35"
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 transition select-none group"
                >
                  <span
                    className={`text-sm md:text-base font-bold transition-colors duration-200 ${
                      isOpen
                        ? "text-[#2b141d] dark:text-[#f7eef1]"
                        : "text-[#5a3240] dark:text-[#cfb0ba] group-hover:text-[#2b141d] dark:group-hover:text-white"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-[#8a3854] text-white rotate-180 shadow-md shadow-[#8a3854]/25"
                        : "bg-[#f7edf1] dark:bg-white/10 text-[#8a3854] dark:text-[#b8959f] group-hover:bg-[#f0dfe5] dark:group-hover:bg-white/20"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-[#5a3240] dark:text-[#d4bcc4] leading-relaxed border-t border-[#ebd7df] dark:border-white/5 animate-in fade-in duration-300 font-medium">
                    <p className="pt-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center p-6 rounded-[28px] bg-white/75 dark:bg-white/5 border border-[#e8d5dc] dark:border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-black/5">
          <div className="text-left">
            <h4 className="text-sm font-bold text-[#2b141d] dark:text-[#f7eef1]">
              Still have questions?
            </h4>
            <p className="text-xs text-[#634852] dark:text-[#b8959f] font-medium">
              We’re here to help you anytime.
            </p>
          </div>
          <a
            href="/contact"
            className="px-5 py-2.5 rounded-2xl bg-[#8a3854] hover:bg-[#732c44] text-white text-xs font-semibold shadow-md shadow-[#8a3854]/20 transition active:scale-95 whitespace-nowrap"
          >
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
};

export default FAQ;