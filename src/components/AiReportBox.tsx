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
  // ✅ 기존 기능 유지: 분석값 상태로 보관
  const [insight, setInsight] = useState(() => analyzeAsset(focus));

  // ✅ 기존 기능 유지: 0.5초마다 실시간 자산값으로 재분석
  useEffect(() => {
    const interval = setInterval(() => {
      const liveAsset = useMarketStore.getState().assets[focus.key];
      setInsight(analyzeAsset(liveAsset));
    }, 500);
    return () => clearInterval(interval);
  }, [focus.key]);

  // ✅ 디자인만 변경: AI가 말하는 말풍선 + 헤더
  return (
    <div
      className={`
        relative p-4 rounded-2xl text-white shadow-lg transition-all duration-300
        bg-gradient-to-br from-indigo-500 to-purple-600 space-y-2 border border-white/10
      `}
    >
      {/* 말풍선 꼬리 */}
      <div
        className="
          absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0
          border-l-[10px] border-l-transparent
          border-r-[10px] border-r-transparent
          border-t-[10px] border-t-purple-600/85
        "
      />

      {/* 상단: AI Assistant 배지 + 신호 뱃지 */}
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 text-xs rounded-full bg-white/30 backdrop-blur-sm">
          🤖 <b>AI Assistant</b>
        </span>
        <span className={`px-2 py-1 text-xs rounded ${badgeColor[insight.color]}`}>
          {insight.signal}
        </span>
        <h2 className="ml-auto text-sm font-semibold opacity-90">AI 분석 리포트 (베타)</h2>
      </div>

      {/* 현재가 문장 */}
      <p className="text-sm">
        “<strong>{focus.name}</strong>는 현재{" "}
        <strong className="text-yellow-200">{focus.price.toFixed(2)}</strong> 포인트로 거래
        중입니다.”
      </p>

      {/* 메트릭 카드 */}
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

      {/* 코멘트 */}
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
