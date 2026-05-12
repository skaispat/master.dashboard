import React, { useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useAnimationFrame, useTransform, wrap } from 'framer-motion';

const clientData = [
  { name: "Ministry of Power", logo: "/power_logo.png" },
  { name: "Ministry of Defence", logo: "/defence_logo.png" },
  { name: "BHEL", logo: "/bhel_logo.png" },
  { name: "Coal India", logo: "/coal_india_logo.png" },
  { name: "BRO India", logo: "/bro_logo.png" },
];

// Repeating the list to fill the view
const marqueeItems = [...clientData, ...clientData, ...clientData, ...clientData];

const Clients = () => {
  const baseX = useMotionValue(0);
  const scrollRef = useRef(null);

  // Speed of the auto-scroll
  const speed = -1.5;

  // The wrap point (width of one set of 5 logos)
  const setWidth = 5 * 288; // 1440px

  useAnimationFrame((t, delta) => {
    let moveBy = speed * (delta / 16);
    baseX.set(baseX.get() + moveBy);
  });

  // Wrap the X value seamlessly
  const x = useTransform(baseX, (v) => `${wrap(-setWidth, 0, v)}px`);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = 'block';
    }
  };

  return (
    <section id="clients" className="py-16 bg-white overflow-hidden relative" aria-label="Our Trusted Clients">
      <div className="container mx-auto px-6 relative z-10 mb-12">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-8 md:w-12 bg-primary-red/30" />
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter text-center">
            Our <span className="text-primary-red">Clients</span>
          </h2>
          <div className="h-px w-8 md:w-12 bg-primary-red/30" />
        </div>
      </div>

      <div className="relative flex overflow-hidden group cursor-grab active:cursor-grabbing select-none">
        <motion.div
          style={{ x }}
          drag="x"
          onDrag={(e, info) => {
            // Update the base X value by the drag delta
            baseX.set(baseX.get() + info.delta.x);
          }}
          className="flex gap-0 whitespace-nowrap items-start"
        >
          {marqueeItems.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex flex-col items-center justify-center w-72 group/item"
            >
              <div className="flex-shrink-0 h-36 w-full flex items-center justify-center hover:-translate-y-1 transition-transform duration-500 p-2">
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  className="max-w-full max-h-full object-contain mix-blend-multiply"
                  onError={handleImageError}
                  loading="lazy"
                />
                <span className="hidden text-xs font-bold text-gray-300 uppercase">{client.name}</span>
              </div>
              <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-primary-red transition-colors duration-500 text-center mt-1">
                {client.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Clients;
