import React from "react";

const metrics = [
  {
    icon: "📈",
    name: "수익률 (Return %)",
    desc: "투자 시작 시점 대비 가격 상승률을 의미합니다.",
    good: "높을수록 좋습니다",
    color: "text-emerald-600"
  },
  {
    icon: "⚡",
    name: "변동성 (Volatility %)",
    desc: "가격 변동의 불안정성을 나타냅니다.",
    good: "낮을수록 안정적입니다",
    color: "text-rose-600"
  },
  {
    icon: "📉",
    name: "최대낙폭 (Max Drawdown %)",
    desc: "고점 대비 하락 폭을 의미합니다.",
    good: "낮을수록 좋습니다",
    color: "text-rose-600"
  },
  {
    icon: "🧭",
    name: "효율성 (Efficiency)",
    desc: "가격 변동 중 실제 상승이 얼마나 효율적인지를 나타냅니다.",
    good: "높을수록 좋습니다",
    color: "text-emerald-600"
  },
  {
    icon: "⚖️",
    name: "리스크 대비 효율 (Risk Adjusted)",
    desc: "수익률을 변동성으로 나눈 값입니다.",
    good: "높을수록 효율적입니다",
    color: "text-emerald-600"
  },
];

const HelpPanel: React.FC = () => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-4 border border-indigo-100">
      <h2 className="text-lg font-bold text-indigo-700 mb-3 text-center">
        📘 지표 도움말
      </h2>

      <div className="space-y-2">
        {metrics.map((m) => (
          <div
            key={m.name}
            className="p-2 rounded-lg hover:bg-indigo-50 transition"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-gray-800">
                {m.icon} {m.name}
              </div>
              <div className={`text-xs font-semibold ${m.color}`}>
                {m.good}
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-1">{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpPanel;
