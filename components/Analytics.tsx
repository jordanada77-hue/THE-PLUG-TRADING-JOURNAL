import React, { useMemo } from 'react';
import { Trade, TradeStatus, Market } from '../types';
// FIX: Removed 'PlusMinus' from lucide-react import as it is not an exported member.
import { DollarSign, Target, TrendingUp, TrendingDown, Hash, ShieldCheck, Award, ThumbsDown } from 'lucide-react';

interface AnalyticsProps {
  trades: Trade[];
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; colorClass?: string; }> = ({ title, value, icon, colorClass = 'text-slate-100' }) => (
    <div className="bg-neutral-900 p-5 rounded-lg shadow-lg flex items-center gap-4">
        <div className="p-3 bg-neutral-800/50 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-neutral-400">{title}</p>
            <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        </div>
    </div>
);


const Analytics: React.FC<AnalyticsProps> = ({ trades }) => {
    const stats = useMemo(() => {
        const closedTrades = trades.filter(t => t.status === TradeStatus.Closed && t.pnl && !isNaN(parseFloat(t.pnl)));

        if (closedTrades.length === 0) {
            return null;
        }

        const pnls = closedTrades.map(t => parseFloat(t.pnl));
        const winningTrades = closedTrades.filter(t => parseFloat(t.pnl) > 0);
        const losingTrades = closedTrades.filter(t => parseFloat(t.pnl) < 0);

        const totalPnl = pnls.reduce((sum, pnl) => sum + pnl, 0);
        const winRate = (winningTrades.length / closedTrades.length) * 100;

        const grossProfit = winningTrades.reduce((sum, t) => sum + parseFloat(t.pnl), 0);
        const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + parseFloat(t.pnl), 0));
        
        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : Infinity;

        const bestTrade = Math.max(...pnls);
        const worstTrade = Math.min(...pnls);

        const avgWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
        const avgLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;

        const setupPerformance = closedTrades.reduce((acc, trade) => {
            const setup = trade.setup || 'Uncategorized';
            if (!acc[setup]) {
                acc[setup] = { trades: 0, wins: 0, totalPnl: 0 };
            }
            const pnl = parseFloat(trade.pnl);
            acc[setup].trades++;
            acc[setup].totalPnl += pnl;
            if (pnl > 0) acc[setup].wins++;
            return acc;
        }, {} as Record<string, { trades: number; wins: number; totalPnl: number }>);
        
        const marketPerformance = closedTrades.reduce((acc, trade) => {
            const market = trade.market || 'Uncategorized';
            if (!acc[market]) {
                acc[market] = { trades: 0, wins: 0, totalPnl: 0 };
            }
            const pnl = parseFloat(trade.pnl);
            acc[market].trades++;
            acc[market].totalPnl += pnl;
            if (pnl > 0) acc[market].wins++;
            return acc;
        }, {} as Record<string, { trades: number; wins: number; totalPnl: number }>);

        return {
            totalTrades: closedTrades.length,
            totalPnl,
            winRate,
            profitFactor,
            bestTrade,
            worstTrade,
            avgWin,
            avgLoss,
            setupPerformance,
            marketPerformance
        };
    }, [trades]);

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-neutral-900 rounded-lg min-h-[400px]">
                <h2 className="text-2xl font-bold text-white mb-2">No Trade Data Available</h2>
                <p className="text-neutral-400">Log some closed trades with P/L values to see your performance analytics.</p>
            </div>
        );
    }
    
    const formatCurrency = (value: number) => {
        return `${value >= 0 ? '+' : ''}$${Math.abs(value).toFixed(2)}`;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total P&L" value={formatCurrency(stats.totalPnl)} icon={<DollarSign size={22} className="text-amber-400"/>} colorClass={stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'} />
                <StatCard title="Win Rate" value={`${stats.winRate.toFixed(1)}%`} icon={<Target size={22} className="text-amber-400"/>} />
                <StatCard title="Total Trades" value={stats.totalTrades.toString()} icon={<Hash size={22} className="text-amber-400"/>} />
                <StatCard title="Profit Factor" value={isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : '∞'} icon={<ShieldCheck size={22} className="text-amber-400"/>} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard title="Best Trade" value={formatCurrency(stats.bestTrade)} icon={<Award size={22} className="text-green-400"/>} colorClass="text-green-400" />
                 <StatCard title="Worst Trade" value={formatCurrency(stats.worstTrade)} icon={<ThumbsDown size={22} className="text-red-400"/>} colorClass="text-red-400" />
                 <StatCard title="Average Win" value={formatCurrency(stats.avgWin)} icon={<TrendingUp size={22} className="text-green-400"/>} colorClass="text-green-400" />
                 <StatCard title="Average Loss" value={`-${formatCurrency(stats.avgLoss).substring(2)}`} icon={<TrendingDown size={22} className="text-red-400"/>} colorClass="text-red-400" />
            </div>

            {/* Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance by Setup */}
                <div className="bg-neutral-900 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Performance by Setup</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-neutral-700">
                                    <th className="p-2 text-sm text-neutral-400">Setup</th>
                                    <th className="p-2 text-sm text-neutral-400 text-center">Trades</th>
                                    <th className="p-2 text-sm text-neutral-400 text-center">Win %</th>
                                    <th className="p-2 text-sm text-neutral-400 text-right">Total P&L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(stats.setupPerformance).map((setup) => {
                                    const data = stats.setupPerformance[setup];
                                    return (
                                    <tr key={setup} className="border-b border-neutral-700/50">
                                        <td className="p-2 font-medium">{setup}</td>
                                        <td className="p-2 text-center">{data.trades}</td>
                                        <td className="p-2 text-center">{((data.wins / data.trades) * 100).toFixed(0)}%</td>
                                        <td className={`p-2 text-right font-mono ${data.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(data.totalPnl)}</td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance by Market */}
                 <div className="bg-neutral-900 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Performance by Market</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-neutral-700">
                                    <th className="p-2 text-sm text-neutral-400">Market</th>
                                    <th className="p-2 text-sm text-neutral-400 text-center">Trades</th>
                                    <th className="p-2 text-sm text-neutral-400 text-center">Win %</th>
                                    <th className="p-2 text-sm text-neutral-400 text-right">Total P&L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(stats.marketPerformance).map((market) => {
                                    const data = stats.marketPerformance[market];
                                    return (
                                    <tr key={market} className="border-b border-neutral-700/50">
                                        <td className="p-2 font-medium">{market}</td>
                                        <td className="p-2 text-center">{data.trades}</td>
                                        <td className="p-2 text-center">{((data.wins / data.trades) * 100).toFixed(0)}%</td>
                                        <td className={`p-2 text-right font-mono ${data.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(data.totalPnl)}</td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;