import type { Asset } from "../hooks/useMarketStore";

export type ResultData = {
  key: string;
  name: string;
  changePct: number;
  vol: number;
  comment: string;
  high: number;
  low: number;
};

function calcVolatility(arr: number[]) {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b) / arr.length;
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function genComment(change: number, vol: number) {
  if (change > 3) return "🚀 폭발적 상승세! 투자자들의 환호!";
  if (change > 1) return "📈 안정적 상승세 유지 중.";
  if (change > 0) return "🙂 미세한 상승, 시장은 낙관적.";
  if (change < -3) return "⚠ 급락! AI도 놀랐어요.";
  if (change < 0) return "📉 조정세 진입, 신중한 접근 필요.";
  return "😐 변동 없음.";
}

export function analyzeResults(
  beforeAssets: Record<string, Asset>,
  afterAssets: Record<string, Asset>
): ResultData[] {
  const keys = Object.keys(afterAssets);
  const results: ResultData[] = keys.map((k) => {
    const before = beforeAssets[k].price;
    const after = afterAssets[k].price;
    const history = afterAssets[k].history.slice(-20);
    const high = Math.max(...history);
    const low = Math.min(...history);
    const changePct = ((after - before) / before) * 100;
    const vol = calcVolatility(history);
    const comment = genComment(changePct, vol);
    return { key: k, name: afterAssets[k].name, changePct, vol, comment, high, low };
  });

  return results.sort((a, b) => b.changePct - a.changePct);
}
