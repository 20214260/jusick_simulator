import React, { useEffect, useState } from "react";
import { useMarketStore, type Asset } from "../hooks/useMarketStore";
import { analyzeAsset } from "../engine/analysis";

interface Props {
  focus: Asset;
}

const badgeColor: Record<"green" | "yellow" | "red", string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-rose-500",
};

const AiReportBox: React.FC<Props> = ({ focus }) => {
  const [insight, setInsight] = useState(() => analyzeAsset(focus));

  useEffect(() => {
    const interval = setInterval(() => {
      const liveAsset = useMarketStore .getState().assets[focus.key];
      setInsight(analyzeAsset(liveAsset));
    }, 500);
    return () => clearInterval(interval);
  }, [focus.key]);

  return (
    <div
      className={`p-4 rounded-xl text-white shadow-lg transition-all duration-300 bg-gradient-to-br from-indigo-500 to-purple-600 space-y-2`}
    >
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 text-xs rounded ${badgeColor[insight.color]}`}>
          {insight.signal}
        </span>
        <h2 className="text-lg font-bold">AI 분석 리포트 (베타)</h2>
      </div>

      <p className="text-sm">
        <strong>{focus.name}</strong>는 현재{" "}
        <strong>{focus.price.toFixed(2)}</strong> 포인트로 거래 중입니다.
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/10 rounded p-2">
          <div className="opacity-70">최대낙폭</div>
          <div className="font-semibold">{insight.drawdownPct.toFixed(2)}%</div>
        </div>
        <div className="bg-white/10 rounded p-2">
          <div className="opacity-70">거래량</div>
          <div className="font-semibold">{insight.volume.toFixed(2)}</div>
        </div>
      </div>

      <p className="text-sm leading-6">
        {insight.comment} (리스크: <b>{insight.risk}</b>)
      </p>

      <p className="text-[11px] opacity-80">
        * 최근 20‒40틱 데이터를 기반으로 간단한 통계 분석을 수행합니다.
      </p>
    </div>
  );
};

export default AiReportBox;
