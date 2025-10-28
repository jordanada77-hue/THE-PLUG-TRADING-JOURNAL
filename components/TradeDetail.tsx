import React from 'react';
import { Trade } from '../types';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface TradeDetailProps {
  trade: Trade;
  onEdit: () => void;
  onDelete: () => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-bold text-amber-400 border-b-2 border-amber-500/30 pb-2 mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const DetailItem: React.FC<{ label: string; value: React.ReactNode; fullWidth?: boolean }> = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? 'col-span-2' : ''}>
    <p className="text-sm text-neutral-400">{label}</p>
    <p className="text-md text-slate-100 font-medium break-words">{value || 'N/A'}</p>
  </div>
);

const TradeDetail: React.FC<TradeDetailProps> = ({ trade, onEdit, onDelete }) => {
  const pnlValue = parseFloat(trade.pnl);
  const pnlColor = isNaN(pnlValue) ? 'text-slate-100' : pnlValue >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-neutral-900 rounded-lg shadow-lg p-6 h-full flex flex-col">
       <div className="flex justify-between items-start mb-4">
        <div>
           <div className="flex items-center gap-3">
             {trade.direction === 'LONG' ? (
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-green-500/10">
                    <TrendingUp className="text-green-400" size={20} />
                </span>
             ) : (
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-red-500/10">
                    <TrendingDown className="text-red-400" size={20} />
                </span>
             )}
            <div>
                 <h2 className="text-2xl font-bold text-white">{trade.instrument} <span className="text-neutral-500 font-normal">({trade.id})</span></h2>
                 <p className="text-neutral-400">{trade.setup}</p>
            </div>
           </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={onEdit} className="p-2 rounded-full text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors" aria-label="Edit trade">
                <Edit size={18} />
            </button>
            <button onClick={onDelete} className="p-2 rounded-full text-red-500/80 hover:bg-red-500/20 hover:text-red-400 transition-colors" aria-label="Delete trade">
                <Trash2 size={18} />
            </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2">
        {/* PRE-PLUG */}
        <DetailSection title="🔌 PRE-PLUG: The Connection Plan">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DetailItem label="Date" value={trade.date} />
            <DetailItem label="Market" value={trade.market} />
            <DetailItem label="Market Context" value={trade.marketContext} />
            <DetailItem label="Direction" value={trade.direction} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DetailItem label="Entry Price" value={trade.entryPrice} />
            <DetailItem label="Stop-Loss" value={trade.stopLossPrice} />
            <DetailItem label="Risk/Reward" value={trade.riskRewardRatio} />
            <DetailItem label="% Risk" value={trade.riskPercent} />
          </div>
           <DetailItem label="Take Profit Targets" value={trade.takeProfitTargets} fullWidth/>
           <DetailItem label="Rationale" value={<p className="whitespace-pre-wrap">{trade.rationale}</p>} fullWidth/>
        </DetailSection>

        {/* LIVE PLUG */}
        <DetailSection title="📈 LIVE PLUG: The Trade Log">
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <DetailItem label="Actual Entry" value={trade.actualEntryPrice} />
            <DetailItem label="P/L" value={<span className={`font-bold ${pnlColor}`}>{trade.pnl}</span>} />
            <DetailItem label="Exit Reason" value={trade.exitReason} />
          </div>
          {trade.chartScreenshot && (
             <div>
                <p className="text-sm text-neutral-400 mb-2">Chart Screenshot</p>
                <img src={trade.chartScreenshot} alt="Chart screenshot" className="rounded-lg max-h-80 w-auto" />
             </div>
          )}
        </DetailSection>

        {/* POST-PLUG */}
        <DetailSection title="📊 POST-PLUG: The Performance Review">
          <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Psychology" value={trade.psychology} />
              <DetailItem label="Plan Adherence" value={trade.planAdherence === null ? 'N/A' : trade.planAdherence ? 'Yes' : 'No'} />
          </div>
          {trade.planAdherence === false && <DetailItem label="Reason for Deviation" value={<p className="whitespace-pre-wrap">{trade.deviationReason}</p>} fullWidth/>}
          <DetailItem label="✅ What Went Right?" value={<p className="whitespace-pre-wrap">{trade.whatWentRight}</p>} fullWidth/>
          <DetailItem label="❌ What Went Wrong?" value={<p className="whitespace-pre-wrap">{trade.whatWentWrong}</p>} fullWidth/>
          <DetailItem label="Key Takeaway" value={<p className="font-semibold italic text-amber-300 whitespace-pre-wrap">{trade.keyTakeaway}</p>} fullWidth/>
        </DetailSection>
      </div>
    </div>
  );
};

export default TradeDetail;