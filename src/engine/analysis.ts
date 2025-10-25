import type { Asset } from "../hooks/useMarketStore";

export type Insight = {
  momentumPct: number;
  volPct: number;
  drawdownPct: number;
  volume: number;
  signal: "매수우세" | "중립" | "경계";
  risk: "낮음" | "보통" | "높음";
  comment: string;
  color: "green" | "yellow" | "red";
};

export function analyzeAsset(a: Asset): Insight {
  const N = 40;
  const h = a.history.slice(-N);
  const base = h[0] ?? a.price;
  const last = h[h.length - 1] ?? a.price;

  const momentumPct = ((last - base) / base) * 100;

  const rets: number[] = [];
  for (let i = 1; i < h.length; i++) {
    rets.push(((h[i] - h[i - 1]) / h[i - 1]) * 100);
  }

  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const volPct = Math.sqrt(rets.reduce((s, v) => s + (v - mean) ** 2, 0) / (rets.length || 1));

  let peak = h[0] ?? a.price;
  let dd = 0;
  for (const v of h) {
    peak = Math.max(peak, v);
    dd = Math.min(dd, ((v - peak) / peak) * 100);
  }
  const drawdownPct = Math.abs(dd);

  let volume = 0;
  for (let i = 1; i < h.length; i++) {
    volume += Math.abs(h[i] - h[i - 1]);
  }

  let signal: Insight["signal"] = "중립";
  if (momentumPct > 2 && a.drift >= 0) signal = "매수우세";
  if (momentumPct < -2 || drawdownPct > 4) signal = "경계";

  let risk: Insight["risk"] = "보통";
  if (volPct < 1.2) risk = "낮음";
  if (volPct > 2.8) risk = "높음";

  const color: Insight["color"] =
    signal === "매수우세" ? "green" : signal === "중립" ? "yellow" : "red";

  const commentParts: string[] = [];
  if (signal === "매수우세") commentParts.push("단기 상승 추세가 뚜렷합니다.");
  if (signal === "경계") commentParts.push("급격한 조정 가능성에 유의하세요.");
  if (risk === "높음") commentParts.push("시장 변동성이 큰 구간입니다.");
  if (risk === "낮음") commentParts.push("안정적인 흐름입니다.");

  const comment = commentParts.join(" ") || "뚜렷한 추세가 없어 관망이 유리합니다.";

  return { momentumPct, volPct, drawdownPct, volume, signal, risk, comment, color };
}
