
import React from 'react';
import { Trade, TradeStatus } from '../types';
import { TrendingUp, TrendingDown, Clock, CheckCircle, FileText } from 'lucide-react';

interface TradeListProps {
  trades: Trade[];
  onSelectTrade: (trade: Trade) => void;
  selectedTradeId?: string | null;
}

const TradeList: React.FC<TradeListProps> = ({ trades, onSelectTrade, selectedTradeId }) => {

  const getStatusIndicator = (status: TradeStatus) => {
    switch (status) {
      case TradeStatus.Planned:
        return <div className="flex items-center gap-1.5 text-xs text-amber-400"><FileText size={14} /> Planned</div>;
      case TradeStatus.Live:
        return <div className="flex items-center gap-1.5 text-xs text-cyan-400 animate-pulse"><Clock size={14} /> Live</div>;
      case TradeStatus.Closed:
        return <div className="flex items-center gap-1.5 text-xs text-neutral-400"><CheckCircle size={14} /> Closed</div>;
    }
  };

  const getPnlColor = (pnl: string) => {
    const pnlValue = parseFloat(pnl);
    if (isNaN(pnlValue)) return 'text-neutral-400';
    return pnlValue >= 0 ? 'text-green-400' : 'text-red-400';
  }

  if (trades.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-neutral-400">No trades logged yet.</p>
        <p className="text-sm text-neutral-500">Click the '+' icon to add your first trade.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3 h-[calc(100vh-180px)] overflow-y-auto pr-2">
      {trades.map((trade) => (
        <li key={trade.id}>
          <button
            onClick={() => onSelectTrade(trade)}
            className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
              selectedTradeId === trade.id ? 'bg-amber-500/20' : 'bg-neutral-800/50 hover:bg-neutral-800'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                 {trade.direction === 'LONG' ? (
                  <TrendingUp className="text-green-500 flex-shrink-0" size={20} />
                ) : (
                  <TrendingDown className="text-red-500 flex-shrink-0" size={20} />
                )}
                <div>
                  <p className="font-semibold text-white">{trade.instrument}</p>
                  <p className="text-sm text-neutral-400">{trade.setup}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                  {trade.status === TradeStatus.Closed ? (
                    <p className={`font-mono font-semibold ${getPnlColor(trade.pnl)}`}>
                      {parseFloat(trade.pnl) > 0 && '+'}{trade.pnl}
                    </p>
                  ) : (
                    getStatusIndicator(trade.status)
                  )}
                 <p className="text-xs text-neutral-500 mt-1">{trade.date}</p>
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TradeList;