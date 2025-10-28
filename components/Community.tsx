import React from 'react';
import { MessageCircle, LineChart, Lightbulb } from 'lucide-react';

// A simple, inline SVG for the WhatsApp icon to avoid adding new dependencies/files
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.12c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42s2.42 3.62 2.42 5.82c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.2c-.25-.12-1.47-.72-1.7-.82s-.39-.12-.56.12c-.17.25-.64.82-.79.99s-.29.19-.54.06c-.25-.12-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73s-.15-.39 0-.51c.14-.11.31-.29.47-.44s.21-.25.31-.42.05-.31-.02-.42c-.08-.12-.56-1.34-.76-1.84s-.4-.42-.56-.42h-.5c-.17 0-.44.06-.67.31s-.86.84-.86 2.05c0 1.21.88 2.37 1 2.54s1.75 2.67 4.23 3.74c.59.25 1.05.4 1.41.51.61.2 1.17.18 1.62.11.5-.08 1.47-.6 1.68-1.18s.21-1.09.14-1.18c-.05-.09-.2-.14-.44-.26z" />
  </svg>
);


const Community: React.FC = () => {
    const whatsappLink = "https://chat.whatsapp.com/DCDlUjSPAGL861GRU03Qte";
  
    const FeatureCard: React.FC<{icon: React.ReactNode, title: string, text: string}> = ({icon, title, text}) => (
        <div className="bg-neutral-900 p-6 rounded-lg text-center flex flex-col items-center">
            <div className="text-amber-400 mb-3">{icon}</div>
            <h4 className="font-bold text-lg text-white mb-1">{title}</h4>
            <p className="text-neutral-400 text-sm">{text}</p>
        </div>
    );
    
    const StatItem: React.FC<{value: string, label: string}> = ({value, label}) => (
        <div className="text-center">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm text-neutral-500 uppercase tracking-wider">{label}</p>
        </div>
    );

  return (
    <div className="space-y-12 animate-fade-in">
      {/* LUXURY HEADER */}
      <div className="text-center pt-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          THE PLUG
        </h2>
        <h3 className="text-2xl md:text-3xl font-semibold text-amber-400">
          TRADING JOURNAL
        </h3>
        <p className="mt-3 text-neutral-400 max-w-2xl mx-auto">
          Learn & grow together in the markets
        </p>
      </div>

      <hr className="border-t-2 border-amber-500/20 max-w-sm mx-auto" />

      {/* JOIN COMMUNITY CTA */}
      <div className="max-w-2xl mx-auto bg-neutral-900 rounded-xl shadow-2xl p-8 text-center" style={{ boxShadow: '0 0 35px rgba(255, 215, 0, 0.1)' }}>
        <WhatsAppIcon className="text-green-500 h-12 w-12 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-3">Join Our WhatsApp Group</h3>
        <p className="text-neutral-300 mb-6">
          Connect with 500+ traders in real-time, share live trade ideas, 
          and get instant feedback. Our WhatsApp community is where the real 
          conversations happen!
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition-all transform hover:scale-105"
        >
          <WhatsAppIcon />
          <span>JOIN WHATSAPP GROUP</span>
        </a>
        <p className="text-xs text-neutral-500 mt-4">Free to join • 500+ traders • Active daily</p>
        <p className="text-xs text-neutral-600 mt-2 font-semibold">Created by JJA</p>
      </div>

      {/* COMMUNITY FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <FeatureCard icon={<MessageCircle size={32} />} title="Live Chat" text="Real-time trade discussions" />
        <FeatureCard icon={<LineChart size={32} />} title="Trade Ideas" text="Share & analyze setups" />
        <FeatureCard icon={<Lightbulb size={32} />} title="Learning" text="Grow your skills together" />
      </div>
      
      {/* QUICK STATS */}
      <div className="bg-neutral-900/50 rounded-lg p-6 max-w-3xl mx-auto">
          <div className="flex justify-around items-center">
              <StatItem value="500+" label="Traders" />
              <div className="h-12 w-px bg-neutral-700"></div>
              <StatItem value="24/7" label="Active" />
              <div className="h-12 w-px bg-neutral-700"></div>
              <StatItem value="Free" label="To Join" />
          </div>
      </div>
      
      {/* MARKETS COVERED */}
      <div className="text-center">
         <h3 className="text-xl font-bold text-white mb-4">Markets We Trade</h3>
         <div className="flex flex-wrap justify-center items-center gap-3">
            <span className="bg-neutral-800 text-amber-300 px-4 py-1.5 rounded-full text-sm font-semibold">Forex</span>
            <span className="bg-neutral-800 text-amber-300 px-4 py-1.5 rounded-full text-sm font-semibold">Crypto</span>
            <span className="bg-neutral-800 text-amber-300 px-4 py-1.5 rounded-full text-sm font-semibold">Stocks</span>
            <span className="bg-neutral-800 text-amber-300 px-4 py-1.5 rounded-full text-sm font-semibold">Indices</span>
         </div>
      </div>
    </div>
  );
};

export default Community;