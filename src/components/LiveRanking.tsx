// src/components/LiveRanking.tsx
import React from "react";
import type { Asset } from "../hooks/useMarketStore";

interface Props {
  assets: Asset[];
  topKey: string | null;
}

const LiveRanking: React.FC<Props> = ({ assets, topKey }) => {
  const ranked = [...assets]
    .sort((a, b) => b.riskEfficiency - a.riskEfficiency)
    .slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-3 animate-fade-in">
      <h2 className="text-md font-bold mb-2 text-indigo-700 flex items-center gap-2">
        📊 실시간 종목 순위
      </h2>
      <div className="space-y-2 transition-all duration-500">
        {ranked.map((a, i) => {
          const isTop = a.key === topKey;

          return (
            <div
              key={a.key}
              className={`flex justify-between items-center px-4 py-2 rounded-lg shadow-sm
                transition-all duration-300 transform
                ${isTop
                  ? "bg-yellow-100 scale-105 animate-shake ring-2 ring-yellow-300"
                  : "bg-gray-50"}
              `}
            >
              <span className={`font-medium ${isTop ? "text-yellow-800" : "text-gray-800"}`}>
                {i + 1}. {a.name}
              </span>
              <span className={`text-sm font-semibold ${a.riskEfficiency >= 0 ? "text-green-600" : "text-red-500"}`}>
                {a.riskEfficiency.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveRanking;
