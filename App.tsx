// FIX: Removed stray 'aistudio.log' from the import statement.
import React, { useState, useEffect } from 'react';
import { Trade, TradeStatus } from './types';
import Header from './components/Header';
import TradeList from './components/TradeList';
import JournalForm from './components/JournalForm';
import TradeDetail from './components/TradeDetail';
import Analytics from './components/Analytics';
import Community from './components/Community';
import { PlusCircle, BarChart, BookOpen, Users } from 'lucide-react';

type View = 'journal' | 'analytics' | 'community';

const App: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('journal');

  useEffect(() => {
    try {
      const storedTrades = localStorage.getItem('plug_trades');
      if (storedTrades) {
        setTrades(JSON.parse(storedTrades));
      } else {
        // On first load, show the community page
        setCurrentView('community');
      }
    } catch (error) {
      console.error("Failed to parse trades from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('plug_trades', JSON.stringify(trades));
    } catch (error) {
      console.error("Failed to save trades to localStorage", error);
    }
  }, [trades]);

  const handleSaveTrade = (trade: Trade) => {
    const existingTradeIndex = trades.findIndex(t => t.id === trade.id);
    if (existingTradeIndex > -1) {
      const updatedTrades = [...trades];
      updatedTrades[existingTradeIndex] = trade;
      setTrades(updatedTrades);
    } else {
      setTrades(prevTrades => [trade, ...prevTrades]);
    }
    setIsFormOpen(false);
    setSelectedTrade(trade);
    setCurrentView('journal');
  };

  const handleDeleteTrade = (tradeId: string) => {
    if (window.confirm("Are you sure you want to delete this trade journal?")) {
        setTrades(prev => prev.filter(t => t.id !== tradeId));
        if (selectedTrade?.id === tradeId) {
            setSelectedTrade(null);
        }
    }
  }

  const handleSelectTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsFormOpen(false);
  };

  const handleOpenForm = (trade?: Trade) => {
    setSelectedTrade(trade || null);
    setIsFormOpen(true);
  };
  
  const NavButton: React.FC<{view: View, label: string, icon: React.ReactNode}> = ({ view, label, icon }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-black ${
        currentView === view
          ? 'bg-amber-500 text-black'
          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const getWelcomeMessage = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-neutral-900/50 rounded-lg">
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold text-white tracking-tight">THE PLUG</h2>
        <h3 className="text-2xl font-semibold text-amber-400 tracking-widest">TRADING JOURNAL</h3>
      </div>
      <p className="text-neutral-300 text-lg max-w-md mb-8">Your system for connected growth. <br/> Track your trades to find your edge.</p>
      <button
        onClick={() => handleOpenForm()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-bold rounded-lg shadow-md hover:bg-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-black"
      >
        <PlusCircle size={20} />
        Add First Journal Entry
      </button>
    </div>
  );

  const renderJournalView = () => (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <div className="bg-neutral-900 rounded-lg shadow-lg p-4 h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Trade Logs</h2>
                <button
                onClick={() => handleOpenForm()}
                className="p-2 rounded-full text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
                aria-label="Add new trade"
                >
                <PlusCircle size={22} />
                </button>
            </div>
            <TradeList trades={trades} onSelectTrade={handleSelectTrade} selectedTradeId={selectedTrade?.id} />
            </div>
        </div>

        <div className="lg:col-span-2 min-h-[600px]">
            {isFormOpen ? (
            <JournalForm
                tradeToEdit={selectedTrade}
                onSave={handleSaveTrade}
                onCancel={() => setIsFormOpen(false)}
                nextPlugId={`#PLUG-${String(trades.length + 1).padStart(3, '0')}`}
            />
            ) : selectedTrade ? (
            <TradeDetail 
                trade={selectedTrade} 
                onEdit={() => handleOpenForm(selectedTrade)}
                onDelete={() => handleDeleteTrade(selectedTrade.id)} 
            />
            ) : (
            getWelcomeMessage()
            )}
        </div>
    </div>
  );
  
  const renderContent = () => {
    switch (currentView) {
        case 'journal':
            return renderJournalView();
        case 'analytics':
            return <Analytics trades={trades} />;
        case 'community':
            return <Community />;
        default:
            return renderJournalView();
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-white">
                {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            </h1>
            <div className="flex items-center gap-2 p-1 bg-neutral-900 rounded-lg w-full sm:w-auto">
              <NavButton view="journal" label="Journal" icon={<BookOpen size={18} />} />
              <NavButton view="analytics" label="Analytics" icon={<BarChart size={18} />} />
              <NavButton view="community" label="Community" icon={<Users size={18} />} />
            </div>
        </div>
        
        {renderContent()}

      </main>
       <footer className="text-center py-6 text-neutral-600 text-sm font-semibold">
        Created by JJA
      </footer>
    </div>
  );
};

export default App;