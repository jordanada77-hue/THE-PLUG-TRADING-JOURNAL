
export enum Market {
  Forex = 'Forex',
  Crypto = 'Crypto',
  Stocks = 'Stocks',
  Indices = 'Indices',
}

export enum MarketContext {
  Bullish = 'Bullish',
  Bearish = 'Bearish',
  Ranging = 'Ranging',
}

export enum Direction {
  Long = 'LONG',
  Short = 'SHORT',
}

export enum ExitReason {
  TP = 'Hit TP',
  SL = 'Stopped Out',
  Manual = 'Manual Close',
}

export enum TradeStatus {
    Planned = 'PLANNED',
    Live = 'LIVE',
    Closed = 'CLOSED'
}

export interface Trade {
  id: string; // e.g., #PLUG-001
  date: string;
  status: TradeStatus;

  // A. PRE-PLUG
  instrument: string;
  market: Market;
  marketContext: MarketContext;
  setup: string;
  rationale: string;
  direction: Direction;
  entryPrice: string;
  stopLossPrice: string;
  takeProfitTargets: string;
  riskRewardRatio: string;
  riskPercent: string;

  // B. LIVE PLUG
  actualEntryPrice: string;
  pnl: string;
  exitReason: ExitReason | '';
  chartScreenshot?: string; // base64 data URL

  // C. POST-PLUG
  psychology: string;
  planAdherence: boolean | null;
  deviationReason: string;
  whatWentRight: string;
  whatWentWrong: string;
  keyTakeaway: string;
}
