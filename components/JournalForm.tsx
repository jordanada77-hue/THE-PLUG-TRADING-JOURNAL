import React, { useState, useEffect } from 'react';
import { Trade, Market, MarketContext, Direction, ExitReason, TradeStatus } from '../types';
import { Camera, Save, X } from 'lucide-react';

interface JournalFormProps {
  tradeToEdit?: Trade | null;
  onSave: (trade: Trade) => void;
  onCancel: () => void;
  nextPlugId: string;
}

const initialState: Trade = {
  id: '',
  date: new Date().toISOString().split('T')[0],
  status: TradeStatus.Planned,
  instrument: '',
  market: Market.Forex,
  marketContext: MarketContext.Ranging,
  setup: '',
  rationale: '',
  direction: Direction.Long,
  entryPrice: '',
  stopLossPrice: '',
  takeProfitTargets: '',
  riskRewardRatio: '',
  riskPercent: '',
  actualEntryPrice: '',
  pnl: '',
  exitReason: '',
  chartScreenshot: undefined,
  psychology: '',
  planAdherence: null,
  deviationReason: '',
  whatWentRight: '',
  whatWentWrong: '',
  keyTakeaway: '',
};

const JournalForm: React.FC<JournalFormProps> = ({ tradeToEdit, onSave, onCancel, nextPlugId }) => {
  const [trade, setTrade] = useState<Trade>(initialState);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (tradeToEdit) {
      setTrade(tradeToEdit);
    } else {
      setTrade({ ...initialState, id: nextPlugId, date: new Date().toISOString().split('T')[0] });
    }
  }, [tradeToEdit, nextPlugId]);
  
  useEffect(() => {
    const entry = parseFloat(trade.entryPrice);
    const sl = parseFloat(trade.stopLossPrice);
    const tpTargetString = (trade.takeProfitTargets || '').split(',')[0].trim();
    const tpTarget = parseFloat(tpTargetString);

    if (isNaN(entry) || isNaN(sl) || isNaN(tpTarget)) {
      setTrade(prev => ({ ...prev, riskRewardRatio: '' }));
      return;
    }

    let risk: number;
    let reward: number;

    if (trade.direction === Direction.Long) {
      risk = entry - sl;
      reward = tpTarget - entry;
    } else { // Direction.Short
      risk = sl - entry;
      reward = entry - tpTarget;
    }

    if (risk > 0 && reward > 0) {
      const ratio = reward / risk;
      const newRatio = `1:${ratio.toFixed(2)}`;
      setTrade(prev => ({ ...prev, riskRewardRatio: newRatio }));
    } else {
      setTrade(prev => ({ ...prev, riskRewardRatio: '' }));
    }
  }, [trade.entryPrice, trade.stopLossPrice, trade.takeProfitTargets, trade.direction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTrade(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: any) => {
    setTrade(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTrade(prev => ({ ...prev, chartScreenshot: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(trade);
  };
  
  const renderStepIndicator = () => (
    <div className="flex justify-center items-center mb-6 border-b border-neutral-700">
      <button type="button" onClick={() => setCurrentStep(1)} className={`py-3 px-4 text-sm font-medium border-b-2 ${currentStep === 1 ? 'border-amber-500 text-amber-400' : 'border-transparent text-neutral-400 hover:text-white'}`}>🔌 PRE-PLUG</button>
      <button type="button" onClick={() => setCurrentStep(2)} className={`py-3 px-4 text-sm font-medium border-b-2 ${currentStep === 2 ? 'border-amber-500 text-amber-400' : 'border-transparent text-neutral-400 hover:text-white'}`}>📈 LIVE PLUG</button>
      <button type="button" onClick={() => setCurrentStep(3)} className={`py-3 px-4 text-sm font-medium border-b-2 ${currentStep === 3 ? 'border-amber-500 text-amber-400' : 'border-transparent text-neutral-400 hover:text-white'}`}>📊 POST-PLUG</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 rounded-lg shadow-lg p-6 space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-start">
        <div>
           <h2 className="text-2xl font-bold text-white">{tradeToEdit ? `Edit ${trade.id}` : 'Create New Plug'}</h2>
           <p className="text-neutral-400">Fill out the journal to track your trade.</p>
        </div>
        <button type="button" onClick={onCancel} className="p-2 rounded-full text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors">
            <X size={20} />
        </button>
      </div>
      
      {renderStepIndicator()}
      
      <div className="flex-grow overflow-y-auto pr-2 space-y-6">
        {currentStep === 1 && (
            // PRE-PLUG
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-neutral-400 text-sm">Plug ID</span>
                  <input type="text" name="id" value={trade.id} readOnly className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2 text-neutral-300" />
                </label>
                <label className="block">
                  <span className="text-neutral-400 text-sm">Date</span>
                  <input type="date" name="date" value={trade.date} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2" />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-neutral-400 text-sm">Instrument</span>
                  <input type="text" name="instrument" value={trade.instrument} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2" placeholder="e.g., BTC/USD" />
                </label>
                <label className="block">
                  <span className="text-neutral-400 text-sm">Market</span>
                  <select name="market" value={trade.market} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2">
                    {Object.values(Market).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </label>
              </div>
               <div>
                    <span className="text-neutral-400 text-sm">Market Context</span>
                    <div className="mt-2 flex space-x-4">
                        {Object.values(MarketContext).map(mc => (
                             <label key={mc} className="flex items-center">
                                <input type="radio" name="marketContext" value={mc} checked={trade.marketContext === mc} onChange={() => handleRadioChange('marketContext', mc)} className="h-4 w-4 text-amber-500 border-neutral-600 bg-neutral-900 focus:ring-amber-500"/>
                                <span className="ml-2 text-sm">{mc}</span>
                            </label>
                        ))}
                    </div>
                </div>
              <label className="block">
                <span className="text-neutral-400 text-sm">THE PLUG Setup</span>
                <input type="text" name="setup" value={trade.setup} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2" placeholder="e.g., Support Bounce" />
              </label>
              <label className="block">
                <span className="text-neutral-400 text-sm">Trade Rationale (The "Why")</span>
                <textarea name="rationale" value={trade.rationale} onChange={handleChange} rows={2} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2" placeholder="Your analysis in 1-2 sentences."></textarea>
              </label>
              <div>
                    <span className="text-neutral-400 text-sm">Direction</span>
                    <div className="mt-2 flex space-x-4">
                        {Object.values(Direction).map(d => (
                             <label key={d} className="flex items-center">
                                <input type="radio" name="direction" value={d} checked={trade.direction === d} onChange={() => handleRadioChange('direction', d)} className="h-4 w-4 text-amber-500 border-neutral-600 bg-neutral-900 focus:ring-amber-500"/>
                                <span className="ml-2 text-sm">{d}</span>
                            </label>
                        ))}
                    </div>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input type="text" name="entryPrice" value={trade.entryPrice} onChange={handleChange} placeholder="Entry Price" className="block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2"/>
                  <input type="text" name="stopLossPrice" value={trade.stopLossPrice} onChange={handleChange} placeholder="Stop-Loss" className="block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2"/>
                  <input type="text" name="riskRewardRatio" value={trade.riskRewardRatio} readOnly onChange={handleChange} placeholder="R:R Ratio" className="block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2 text-neutral-300"/>
                  <input type="text" name="riskPercent" value={trade.riskPercent} onChange={handleChange} placeholder="% Risk" className="block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2"/>
              </div>
               <label className="block">
                <span className="text-neutral-400 text-sm">Take-Profit Targets</span>
                <input type="text" name="takeProfitTargets" value={trade.takeProfitTargets} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2" placeholder="TP1, TP2..." />
              </label>
            </div>
        )}

        {currentStep === 2 && (
            // LIVE PLUG
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-neutral-400 text-sm">Actual Entry Price</span>
                    <input type="text" name="actualEntryPrice" value={trade.actualEntryPrice} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2"/>
                  </label>
                  <label className="block">
                    <span className="text-neutral-400 text-sm">P/L</span>
                    <input type="text" name="pnl" value={trade.pnl} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2" placeholder="e.g., +150.75 or -50.20"/>
                  </label>
              </div>
                <label className="block">
                    <span className="text-neutral-400 text-sm">Reason for Exit</span>
                    <select name="exitReason" value={trade.exitReason} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2">
                        <option value="">Select Reason</option>
                        {Object.values(ExitReason).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </label>
                <div>
                     <span className="text-neutral-400 text-sm">Chart Screenshot</span>
                     <div className="mt-2 flex items-center justify-center w-full">
                         <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-neutral-700 border-dashed rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700/50">
                             {trade.chartScreenshot ? (
                                <img src={trade.chartScreenshot} alt="Chart screenshot" className="object-contain h-full w-full rounded-lg" />
                             ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Camera className="w-10 h-10 mb-3 text-neutral-500" />
                                    <p className="mb-2 text-sm text-neutral-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-neutral-500">PNG, JPG or GIF</p>
                                </div>
                             )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                         </label>
                     </div>
                </div>
                 <div>
                    <span className="text-neutral-400 text-sm">Status</span>
                    <div className="mt-2 flex space-x-4">
                        {Object.values(TradeStatus).map(s => (
                             <label key={s} className="flex items-center">
                                <input type="radio" name="status" value={s} checked={trade.status === s} onChange={() => handleRadioChange('status', s)} className="h-4 w-4 text-amber-500 border-neutral-600 bg-neutral-900 focus:ring-amber-500"/>
                                <span className="ml-2 text-sm">{s}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {currentStep === 3 && (
            // POST-PLUG
            <div className="space-y-4 animate-fade-in">
                <label className="block">
                    <span className="text-neutral-400 text-sm">Psychology Check</span>
                    <input type="text" name="psychology" value={trade.psychology} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2" placeholder="Confident, Anxious, FOMO, Greedy" />
                </label>
                 <div>
                    <span className="text-neutral-400 text-sm">Did you follow your plan?</span>
                    <div className="mt-2 flex space-x-4">
                        <label className="flex items-center">
                            <input type="radio" name="planAdherence" checked={trade.planAdherence === true} onChange={() => handleRadioChange('planAdherence', true)} className="h-4 w-4 text-amber-500 border-neutral-600 bg-neutral-900 focus:ring-amber-500"/>
                            <span className="ml-2 text-sm">Yes</span>
                        </label>
                         <label className="flex items-center">
                            <input type="radio" name="planAdherence" checked={trade.planAdherence === false} onChange={() => handleRadioChange('planAdherence', false)} className="h-4 w-4 text-amber-500 border-neutral-600 bg-neutral-900 focus:ring-amber-500"/>
                            <span className="ml-2 text-sm">No</span>
                        </label>
                    </div>
                </div>
                {trade.planAdherence === false && (
                    <label className="block animate-fade-in">
                        <span className="text-neutral-400 text-sm">If NO, why did you deviate?</span>
                        <textarea name="deviationReason" value={trade.deviationReason} onChange={handleChange} rows={2} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2"></textarea>
                    </label>
                )}
                <label className="block">
                    <span className="text-neutral-400 text-sm">✅ What Was A Strong Connection? (What went right?)</span>
                    <textarea name="whatWentRight" value={trade.whatWentRight} onChange={handleChange} rows={3} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2"></textarea>
                </label>
                <label className="block">
                    <span className="text-neutral-400 text-sm">❌ Where Was The Signal Lost? (What went wrong?)</span>
                    <textarea name="whatWentWrong" value={trade.whatWentWrong} onChange={handleChange} rows={3} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2"></textarea>
                </label>
                <label className="block">
                    <span className="text-neutral-400 text-sm">Key Takeaway</span>
                    <textarea name="keyTakeaway" value={trade.keyTakeaway} onChange={handleChange} rows={3} className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2" placeholder="The one lesson you're taking from this trade."></textarea>
                </label>
            </div>
        )}
      </div>

      <div className="flex justify-end items-center gap-4 pt-4 border-t border-neutral-700">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-neutral-300 rounded-md hover:bg-neutral-700 transition-colors">Cancel</button>
        <button type="submit" className="inline-flex items-center gap-2 px-6 py-2 bg-amber-500 text-black font-bold rounded-lg shadow-md hover:bg-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-black">
          <Save size={18}/>
          Save Plug
        </button>
      </div>
    </form>
  );
};

export default JournalForm;