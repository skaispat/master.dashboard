import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Zap } from 'lucide-react';

const Services = () => {
  return (
    <section id="services" className="py-12 bg-white overflow-visible">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text Side (Now on the Left) */}
          <div className="order-2 lg:order-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tighter text-gray-900"
            >
              <span className="text-primary-red">Quality</span> In Every Bar
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg mb-10 leading-relaxed font-medium"
            >
              At SKA Ispat, quality isn't just a parameter; it's our promise. Our TMT bars are ensuring superior bond strength and unmatched durability for generations to come.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-6"
            >
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                <div className="text-primary-red mt-1"><Award size={20} /></div>
                <div>
                  <h4 className="font-black text-gray-900 mb-1">Certified</h4>
                  <p className="text-gray-500 text-xs font-bold leading-relaxed">ISO 45001:2018</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                <div className="text-primary-red mt-1"><Award size={20} /></div>
                <div>
                  <h4 className="font-black text-gray-900 mb-1">Certified</h4>
                  <p className="text-gray-500 text-xs font-bold leading-relaxed">ISO 9001:2015</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                <div className="text-primary-red mt-1"><Award size={20} /></div>
                <div>
                  <h4 className="font-black text-gray-900 mb-1">Certified</h4>
                  <p className="text-gray-500 text-xs font-bold leading-relaxed">ISO 14001:2015</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image Side (Now on the Right and smaller/higher) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2 flex justify-center lg:justify-end -mt-12 md:-mt-24 lg:-mt-32"
          >
            <div className="relative max-w-[320px] md:max-w-[400px]">
              <img
                src="/tmtMan.png"
                alt="Quality Excellence"
                className="relative z-10 w-full h-auto"
              />

              {/* Certificate Badge (Smaller and repositioned) */}
              {/* <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-lg z-20 border border-gray-100 scale-90 md:scale-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-gold/20 rounded-full flex items-center justify-center text-primary-gold">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Certified</p>
                    <p className="text-sm font-black text-gray-900">IS:1786 Standard</p>
                  </div>
                </div>
              </div> */}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Services;
