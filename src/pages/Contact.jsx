import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 flex justify-center items-center">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#e8d5dc] dark:border-white/10 backdrop-blur-md text-xs font-mono font-bold tracking-widest text-[#8a3854] dark:text-[#e4a8b8] uppercase mb-4 shadow-sm">
            <MessageSquare className="w-3.5 h-3.5" />
            Get In Touch
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#2b141d] dark:text-[#f7eef1] mb-3">
            Let’s Start a <span className="text-[#8a3854] dark:text-[#c47790]">Conversation</span>
          </h1>

          <p className="text-sm md:text-base text-[#634852] dark:text-[#b8959f] max-w-md mx-auto font-medium">
            Have questions about your order or need product recommendations? We’re always here to help.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
          
            <div className="p-5 rounded-[28px] bg-white/80 dark:bg-black/35 backdrop-blur-2xl border border-[#e8d5dc] dark:border-white/10 shadow-xl shadow-black/5 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#8a3854] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-[#8a3854]/25">
                <Mail className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8a3854] dark:text-[#e4a8b8]">
                  Email Us
                </h4>
                <p className="text-sm font-bold text-[#2b141d] dark:text-[#f7eef1] truncate">
                  support@omnivault.com
                </p>
                <span className="text-[11px] text-[#634852] dark:text-[#b8959f] font-medium">Online 24/7</span>
              </div>
            </div>
            <div className="p-5 rounded-[28px] bg-white/80 dark:bg-black/35 backdrop-blur-2xl border border-[#e8d5dc] dark:border-white/10 shadow-xl shadow-black/5 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#8a3854] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-[#8a3854]/25">
                <Phone className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8a3854] dark:text-[#e4a8b8]">
                  Call Us
                </h4>
                <p className="text-sm font-bold text-[#2b141d] dark:text-[#f7eef1]">
                  +880 1800-000000
                </p>
                <span className="text-[11px] text-[#634852] dark:text-[#b8959f] font-medium">Mon - Fri, 9am - 8pm</span>
              </div>
            </div>
            <div className="p-5 rounded-[28px] bg-white/80 dark:bg-black/35 backdrop-blur-2xl border border-[#e8d5dc] dark:border-white/10 shadow-xl shadow-black/5 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#8a3854] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-[#8a3854]/25">
                <MapPin className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8a3854] dark:text-[#e4a8b8]">
                  Our Studio
                </h4>
                <p className="text-sm font-bold text-[#2b141d] dark:text-[#f7eef1] truncate">
                  Chattogram, Bangladesh
                </p>
                <span className="text-[11px] text-[#634852] dark:text-[#b8959f] font-medium">Omnivault HQ</span>
              </div>
            </div>

          </div>
          <div className="lg:col-span-7 bg-white/85 dark:bg-black/35 backdrop-blur-2xl rounded-[32px] md:rounded-[36px] border border-[#e8d5dc] dark:border-white/10 shadow-2xl shadow-black/5 p-6 md:p-8">
            
            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-[#8a3854]/15 text-[#8a3854] dark:text-[#c47790] flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-[#2b141d] dark:text-[#f7eef1] mb-1">
                  Message Sent!
                </h3>
                <p className="text-xs md:text-sm text-[#634852] dark:text-[#b8959f] font-medium">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5a3240] dark:text-[#cfb0ba] mb-1.5 px-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="ABC DEF"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#fdfafb] dark:bg-white/5 border border-[#e3cad2] dark:border-white/10 rounded-2xl text-sm font-semibold text-[#2b141d] dark:text-[#f7eef1] placeholder-[#8c6772]/60 dark:placeholder-[#b8959f]/50 outline-none focus:ring-2 focus:ring-[#8a3854]/40 focus:border-[#8a3854] transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5a3240] dark:text-[#cfb0ba] mb-1.5 px-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="ABC@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#fdfafb] dark:bg-white/5 border border-[#e3cad2] dark:border-white/10 rounded-2xl text-sm font-semibold text-[#2b141d] dark:text-[#f7eef1] placeholder-[#8c6772]/60 dark:placeholder-[#b8959f]/50 outline-none focus:ring-2 focus:ring-[#8a3854]/40 focus:border-[#8a3854] transition"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5a3240] dark:text-[#cfb0ba] mb-1.5 px-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-[#fdfafb] dark:bg-white/5 border border-[#e3cad2] dark:border-white/10 rounded-2xl text-sm font-semibold text-[#2b141d] dark:text-[#f7eef1] placeholder-[#8c6772]/60 dark:placeholder-[#b8959f]/50 outline-none focus:ring-2 focus:ring-[#8a3854]/40 focus:border-[#8a3854] transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5a3240] dark:text-[#cfb0ba] mb-1.5 px-1">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#fdfafb] dark:bg-white/5 border border-[#e3cad2] dark:border-white/10 rounded-2xl text-sm font-semibold text-[#2b141d] dark:text-[#f7eef1] placeholder-[#8c6772]/60 dark:placeholder-[#b8959f]/50 outline-none focus:ring-2 focus:ring-[#8a3854]/40 focus:border-[#8a3854] transition resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#8a3854] hover:bg-[#732c44] text-white text-sm font-semibold shadow-lg shadow-[#8a3854]/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 stroke-[2]" />
                  <span>Send Message</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;