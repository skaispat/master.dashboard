import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import hero2 from '../assets/hero2.png';
import hero1 from '../assets/hero1.png';
import billet from '../assets/billet.png';

const products = [
  { id: 1, name: "Fe-500 D", tag: "TMT Bar", image: hero2, gradient: "from-red-900/20 to-transparent" },
  { id: 2, name: "Fe-550 D", tag: "TMT Bar", image: hero2, gradient: "from-blue-900/20 to-transparent" },
  { id: 4, name: "Billets", tag: "Semi-Finished", image: billet, gradient: "from-black/20 to-transparent" }
];

const Products = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let requestRef;
    let lastTime = performance.now();
    let isInteracting = false;
    let interactionTimer;
    let scrollPos = container.scrollLeft;

    const scroll = (time) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      if (!isInteracting) {
        scrollPos += 0.04 * deltaTime;
        const halfWidth = container.scrollWidth / 2;
        if (scrollPos >= halfWidth) {
          scrollPos -= halfWidth;
        }
        container.scrollLeft = scrollPos;
      }
      requestRef = requestAnimationFrame(scroll);
    };

    const handleStart = () => {
      isInteracting = true;
      clearTimeout(interactionTimer);
    };

    const handleEnd = () => {
      interactionTimer = setTimeout(() => {
        isInteracting = false;
        scrollPos = container.scrollLeft;
      }, 2000);
    };

    const handleManualScroll = () => {
      if (isInteracting) {
        scrollPos = container.scrollLeft;
      }
    };

    container.addEventListener('mousedown', handleStart);
    container.addEventListener('touchstart', handleStart);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    container.addEventListener('scroll', handleManualScroll);

    requestRef = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(requestRef);
      container.removeEventListener('mousedown', handleStart);
      container.removeEventListener('touchstart', handleStart);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
      container.removeEventListener('scroll', handleManualScroll);
      clearTimeout(interactionTimer);
    };
  }, []);

  return (
    <section id="products" className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 text-center md:text-left"
          >
            OUR <span className="text-primary-red">PRODUCTS</span>
          </motion.h2>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide select-none cursor-grab active:cursor-grabbing pb-4"
          >
            {[...products, ...products].map((p, i) => (
              <div
                key={`${p.id}-${i}`}
                className="w-[260px] md:w-[320px] flex-shrink-0 group relative bg-white rounded-3xl p-3 transition-all duration-500"
              >
                <div className="relative h-[180px] md:h-[240px] w-full overflow-hidden rounded-2xl mb-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    draggable="false"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${p.gradient}`} />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                    {p.tag}
                  </div>
                </div>

                <div className="px-1 pb-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">{p.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
