import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Facebook = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Linkedin = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const Youtube = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.45 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const Footer = () => {
  return (
    <footer id="footer" className="bg-[#050505] text-white pt-20 pb-12 relative overflow-hidden font-outfit">
      {/* Dynamic Background Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-red/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
          {/* Logo */}
          <div className="w-40 md:w-56 h-20 overflow-hidden flex items-center justify-center">
            <img src="/logo3.jpg" alt="SKA ISPAT" className="w-full h-full object-contain" />
          </div>

          {/* Connect */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-primary-gold font-black uppercase tracking-widest text-[10px] mb-6">Connect With Us</h4>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, url: 'https://www.facebook.com/share/1DsrZyfzWB/', color: 'hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10' },
                { Icon: Instagram, url: 'https://www.instagram.com/sarthak.tmt?igsh=MXV6cXN5NXBwOXlu', color: 'hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10' },
                { Icon: Linkedin, url: 'https://www.linkedin.com/company/sarthaktmtsk', color: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10' },
                { Icon: Youtube, url: 'https://www.youtube.com/@sarthaktmtcg', color: 'hover:text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10' }
              ].map(({ Icon, url, color }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-500 ${color}`}
                >
                  <Icon className="w-5 h-5 md:w-5.5 md:h-5.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="pt-12 border-t border-white/10">
          <div className="flex flex-wrap justify-center md:justify-between gap-8 text-gray-400 font-bold text-sm tracking-wider">
            <span className="flex items-center gap-3 hover:text-white transition-colors cursor-default">
              <MapPin size={22} className="text-primary-red flex-shrink-0" /> Plot No. 1,2,3,11,12 CSIDC GROWTH CENTRE, Industrial Area Siltara Phase-2, Raipur (CG)- 493221.
            </span>
            <span className="flex items-center gap-3 hover:text-white transition-colors cursor-default">
              <Phone size={20} className="text-primary-red flex-shrink-0" /> +91 98765 43210
            </span>
            <span className="flex items-center gap-3 hover:text-white transition-colors cursor-default">
              <Mail size={20} className="text-primary-red flex-shrink-0" /> sales@skaispat.com
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
          &copy; {new Date().getFullYear()} SKA ISPAT PRIVATE LIMITED. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
