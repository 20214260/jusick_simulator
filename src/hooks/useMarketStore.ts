import { create } from "zustand";

// 종목 키 타입
export type TickerKey = "WTM" | "BGE" | "CSI" | "SHG" | "MWS";

// 자산(종목) 데이터 타입 정의
export type Asset = {
  key: TickerKey;
  name: string;
  price: number;
  baseDrift: number;
  baseVol: number;
  drift: number;
  vol: number;
  history: number[];

  // 실시간 계산 지표
  returnPct: number;      // 수익률 (%)
  volatility: number;     // 변동성
  drawdown: number;       // 최대낙폭 (%)
  efficiency: number;     // 효율성 (수익률 / 변동성)
  riskEfficiency: number; // 리스크 대비 효율성
};

// 상태 타입 정의
export interface MarketState {
  assets: Record<TickerKey, Asset>;
  tickMs: number;
  maxHistory: number;
  lastUpdatedAt: number;
  setAsset: (key: TickerKey, partial: Partial<Asset>) => void;
  pushPrice: (key: TickerKey, price: number) => void;
  resetAll: () => void;
}

// 초기 종목 데이터
const initialAssets: Record<TickerKey, Asset> = {
  WTM: {
    key: "WTM",
    name: "성규 화학",
    price: 100,
    baseDrift: 0.001,
    baseVol: 0.08,
    drift: 0.001,
    vol: 0.08,
    history: Array(120).fill(100),
    returnPct: 0,
    volatility: 0,
    drawdown: 0,
    efficiency: 0,
    riskEfficiency: 0,
  },
  BGE: {
    key: "BGE",
    name: "태호 석유",
    price: 80,
    baseDrift: 0.0008,
    baseVol: 0.07,
    drift: 0.0008,
    vol: 0.07,
    history: Array(120).fill(80),
    returnPct: 0,
    volatility: 0,
    drawdown: 0,
    efficiency: 0,
    riskEfficiency: 0,
  },
  CSI: {
    key: "CSI",
    name: "효림 시큐리티",
    price: 60,
    baseDrift: 0.0012,
    baseVol: 0.09,
    drift: 0.0012,
    vol: 0.09,
    history: Array(120).fill(60),
    returnPct: 0,
    volatility: 0,
    drawdown: 0,
    efficiency: 0,
    riskEfficiency: 0,
  },
  SHG: {
    key: "SHG",
    name: "현빈 금융",
    price: 120,
    baseDrift: 0.0006,
    baseVol: 0.05,
    drift: 0.0006,
    vol: 0.05,
    history: Array(120).fill(120),
    returnPct: 0,
    volatility: 0,
    drawdown: 0,
    efficiency: 0,
    riskEfficiency: 0,
  },
  MWS: {
    key: "MWS",
    name: "한스타그램",
    price: 40,
    baseDrift: 0.0015,
    baseVol: 0.12,
    drift: 0.0015,
    vol: 0.12,
    history: Array(120).fill(40),
    returnPct: 0,
    volatility: 0,
    drawdown: 0,
    efficiency: 0,
    riskEfficiency: 0,
  },
};

// Zustand 스토어 생성
export const useMarketStore = create<MarketState>((set, get) => ({
  assets: initialAssets,
  tickMs: 500,
  maxHistory: 600,
  lastUpdatedAt: Date.now(),

  // 개별 자산 수정
  setAsset: (key, partial) => {
    const current = get().assets[key];
    set({
      assets: { ...get().assets, [key]: { ...current, ...partial } },
    });
  },

  // 가격 업데이트 (0.5초 단위 시뮬레이션)
  pushPrice: (key, price) => {
    const a = get().assets[key];
    const history = [...a.history, price];
    const trimmed =
      history.length > get().maxHistory
        ? history.slice(history.length - get().maxHistory)
        : history;

    // ----- 실시간 통계 계산 -----
    const returns = ((price - trimmed[0]) / trimmed[0]) * 100;
    const mean = trimmed.reduce((s, v) => s + v, 0) / trimmed.length;
    const variance =
      trimmed.reduce((s, v) => s + (v - mean) ** 2, 0) / trimmed.length;
    const volatility = Math.sqrt(variance);
    const drawdown =
      ((Math.min(...trimmed) - Math.max(...trimmed)) /
        Math.max(...trimmed)) *
      100;
    const efficiency = returns / (volatility || 1);
    const riskEfficiency = efficiency - Math.abs(drawdown * 0.1);

    // 업데이트 적용
    set({
      assets: {
        ...get().assets,
        [key]: {
          ...a,
          price,
          history: trimmed,
          returnPct: returns,
          volatility,
          drawdown,
          efficiency,
          riskEfficiency,
        },
      },
    });
  },

  // 초기화
  resetAll: () => {
    set({
      assets: Object.fromEntries(
        Object.entries(initialAssets).map(([k, v]) => [
          k,
          {
            ...v,
            price: v.history[0],
            drift: v.baseDrift,
            vol: v.baseVol,
            history: Array(120).fill(v.history[0]),
            returnPct: 0,
            volatility: 0,
            drawdown: 0,
            efficiency: 0,
            riskEfficiency: 0,
          },
        ])
      ) as Record<TickerKey, Asset>,
      lastUpdatedAt: Date.now(),
    });
  },
}));

export default useMarketStore;
