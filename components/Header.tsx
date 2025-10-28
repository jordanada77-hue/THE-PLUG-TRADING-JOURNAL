import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-10 border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-24 text-center">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">THE PLUG</h1>
            <h2 className="text-lg font-semibold text-amber-400 tracking-widest">TRADING JOURNAL</h2>
            <p className="text-sm text-neutral-400 mt-1">Learn & grow together in the markets</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;