// src/components/LiveRanking.tsx
import React from "react";
import type { Asset } from "../hooks/useMarketStore";

interface Props {
  assets: Asset[];
  selectedKey: string | null;
}

const LiveRanking: React.FC<Props> = ({ assets, selectedKey }) => {
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
          const isSelected = a.key === selectedKey;

          return (
            <div
              key={a.key}
              className={`flex justify-between items-center px-4 py-2 rounded-lg shadow-sm
                transition-all duration-300 transform
                ${isSelected
                  ? "bg-gradient-to-r from-blue-100 to-indigo-100 scale-105 animate-pulse ring-2 ring-indigo-400"
                  : "bg-gray-50"}
              `}
            >
              <span className={`font-medium ${isSelected ? "text-indigo-800 font-bold" : "text-gray-800"}`}>
                {i + 1}. {a.name} {isSelected && "⭐"}
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
