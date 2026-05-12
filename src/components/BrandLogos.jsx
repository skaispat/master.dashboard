import React from 'react';
import { motion } from 'framer-motion';

const BrandLogos = () => {
  const brands = [
    { name: 'SKA', logo: '/ska.png' },
    { name: 'SKA TMT', logo: '/skatmt2.png' }
  ];

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="h-24 md:h-32 w-auto overflow-hidden rounded-2xl p-4 bg-gray-50/50 border border-gray-100 flex items-center justify-center transition-all duration-500 group-hover:shadow-xl group-hover:bg-white group-hover:border-red-100">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
