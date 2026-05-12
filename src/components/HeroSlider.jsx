import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';

const slides = [
  {
    image: hero1,
    title: "The Backbone of Infrastructure",
    desc: "Forging the future with high-performance structural steel that defines resilience and innovation."
  },
  {
    image: hero2,
    title: "Gold Standard TMT Solutions",
    desc: "Experience the pinnacle of earthquake-resistant steel technology engineered for ultimate safety."
  },
  {
    image: "/slide03.jpg",
    title: "Innovating Industrial Excellence",
    desc: "Deploying advanced metallurgy and cutting-edge manufacturing to lead the steel industry."
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[100dvh] w-full bg-black overflow-hidden font-outfit -top-[1px] mb-[-1px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          </div>

          <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10">
            <div className="max-w-4xl">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {/* {slides[current].tag} */}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-white md:leading-[1.1] tracking-tighter mb-8"
              >
                {slides[current].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-base md:text-xl text-gray-300 max-w-2xl mb-12 leading-relaxed font-medium"
              >
                {slides[current].desc}
              </motion.p>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress & Navigation */}
      <div className="absolute bottom-12 left-6 md:left-auto md:right-12 flex items-center gap-8 z-20">
        <div className="flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-16 bg-primary-gold' : 'w-4 bg-white/20'}`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={prev} className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <ChevronLeft size={28} />
          </button>
          <button onClick={next} className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
