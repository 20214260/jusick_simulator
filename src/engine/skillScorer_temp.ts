// 종합 지표 계산 & 스코어링
import type { Asset, TickerKey } from "../hooks/useMarketStore";

export type Metrics = {
  key: string;
  name: string;
  returnPct: number;        // 수익률 %
  volatilityPct: number;    // 변동성(틱 수익률 표준편차, %)
  maxDrawdownPct: number;   // 최대낙폭 %
  trendStability: number;   // 추세 일관성(0~1)
  efficiency: number;       // 효율성 (0~1, 높을수록 좋음)
  riskAdjusted: number;     // 리스크 대비 효율(수익/변동성)
  score: number;            // 최종 점수
};

function pct(a: number, b: number) {
  if (b === 0) return 0;
  return ((a - b) / b) * 100;
}

function stddev(arr: number[]) {
  if (arr.length < 2) return 0;
  const m = arr.reduce((s, v) => s + v, 0) / arr.length;
  const v = arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(v);
}

function calcMaxDrawdownPct(xs: number[]) {
  if (xs.length < 2) return 0;
  let peak = xs[0];
  let worst = 0;
  for (const v of xs) {
    peak = Math.max(peak, v);
    const dd = pct(v, peak); // 음수(하락)일수록 큼
    if (dd < worst) worst = dd;
  }
  return Math.abs(worst);
}

function calcTrendStability(slice: number[]) {
  if (slice.length < 2) return 0.5;
  let pos = 0;
  for (let i = 1; i < slice.length; i++) {
    if (slice[i] > slice[i - 1]) pos++;
  }
  return pos / (slice.length - 1); // 0~1
}

function calcEfficiency(slice: number[], start: number, end: number) {
  if (slice.length === 0) return 0;
  const hi = Math.max(...slice);
  const lo = Math.min(...slice);
  const denom = Math.max(1e-9, hi - lo);
  return Math.min(1, Math.max(0, Math.abs(end - start) / denom)); // 0~1
}

function scoreFromMetrics(m: Omit<Metrics, "score">): number {
  // 스케일을 서로 다르게 가져서 가중치로 균형 잡음
  // returnPct(%)는 0.4배, riskAdjusted는 20배(대략 스케일 맞춤),
  // stability/efficiency는 0~1 → 20~25점 스케일로 반영,
  // drawdown은 낮을수록 가산(+), volatility는 간접적으로 riskAdjusted에 반영됨.
  const ret = m.returnPct * 0.4;
  const ra  = m.riskAdjusted * 20;
  const stab = m.trendStability * 20;
  const eff  = m.efficiency * 25;
  const dd   = (100 - Math.min(100, m.maxDrawdownPct)) * 0.1; // 낙폭 작을수록 +
  return ret + ra + stab + eff + dd;
}

export function scoreSinceSelection(
  startPrices: Record<string, number>,
  startLens: Record<string, number>,
  assets: Record<string, Asset>
): Metrics[] {
  const keys = Object.keys(assets) as TickerKey[];

  const results: Metrics[] = keys.map((k) => {
    const a = assets[k];
    const startPrice = startPrices[k];
    const slice = a.history.slice(startLens[k]);      // 선택 시점 이후 구간
    const endPrice = slice.length ? slice[slice.length - 1] : a.price;

    // % 수익률 시퀀스
    const rets: number[] = [];
    for (let i = 1; i < slice.length; i++) {
      rets.push(pct(slice[i], slice[i - 1]));
    }

    const returnPct = pct(endPrice, startPrice);
    const volatilityPct = stddev(rets);
    const maxDrawdownPct = calcMaxDrawdownPct(slice);
    const trendStability = calcTrendStability(slice);
    const efficiency = calcEfficiency(slice, startPrice, endPrice);
    const riskAdjusted = returnPct / Math.max(1e-6, volatilityPct);

    const base: Omit<Metrics, "score"> = {
      key: a.key,
      name: a.name,
      returnPct,
      volatilityPct,
      maxDrawdownPct,
      trendStability,
      efficiency,
      riskAdjusted,
    };

    const score = scoreFromMetrics(base);
    return { ...base, score };
  });

  return results.sort((a, b) => b.score - a.score);
}
