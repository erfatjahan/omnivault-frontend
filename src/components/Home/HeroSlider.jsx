import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: "Electronics Collection",
      title: "Sound & Studio Innovation",
      description: "Explore industry-leading audio devices engineered for clarity and everyday comfort.",
      image: "./electronics.jpg",
      cta: "Shop Now",
      url: "/products?category=Electronics",
    },
    {
      id: 2,
      tag: "Seasonal Fashion",
      title: "Contemporary Wardrobe",
      description: "Clean silhouettes and premium fabrics designed for effortless modern living.",
      image: "./fashion.jpg",
      cta: "Explore Fashion",
      url: "/products?category=Fashion",
    },
    {
      id: 3,
      tag: "Interior & Decor",
      title: "Modern Living Spaces",
      description: "Thoughtfully crafted furniture and subtle home accents to elevate your sanctuary.",
      image: "./furniture.jpg",
      cta: "Discover Collection",
      url: `/products?category=Home & Garden`,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] md:h-[500px] rounded-3xl overflow-hidden select-none group border border-slate-200/80 dark:border-white/10 shadow-lg shadow-black/5">
      {/* Background Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Clean Contrast Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Slide Content */}
            <div className="relative h-full max-w-5xl mx-auto px-6 sm:px-12 flex items-center">
              <div className="max-w-xl space-y-4 text-left text-white">
                <span className="text-xs font-semibold tracking-wider uppercase text-rose-200/90">
                  {slide.tag}
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  {slide.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed">
                  {slide.description}
                </p>

                <div className="pt-2">
                  <Link
                    to={slide.url}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#9c5b6f] hover:bg-[#854b5d] active:scale-95 transition-all duration-200 shadow-md shadow-[#9c5b6f]/30"
                  >
                    <span>{slide.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-[#9c5b6f] text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-[#9c5b6f] text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Minimal Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Slide ${index + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide
                ? "w-6 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;