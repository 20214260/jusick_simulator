import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Metrics } from "../engine/skillScorer_temp";

interface Props {
  results: Metrics[];
  selectedKey: string | null;
  onClose: () => void;
}

const ResultPopup: React.FC<Props> = ({ results, selectedKey, onClose }) => {
  const winner = results[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-[720px] max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-4">
            🏁 결과 발표 — 종합 점수 랭킹
          </h2>

          <div className="mb-4 text-center text-sm text-gray-500">
            수익성, 안정성, 효율성, 최대낙폭, 리스크대비효율을 종합 평가했습니다.
          </div>

          {results.map((r, i) => {
            const isSelected = r.key === selectedKey;
            const isWinner = i === 0;
            return (
              <div
                key={r.key}
                className={`flex items-center justify-between p-3 mb-2 rounded-lg border
                  ${isWinner ? "bg-yellow-50 border-yellow-300" : "bg-gray-50 border-gray-200"}
                  ${isSelected ? "ring-2 ring-indigo-400" : ""}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold w-10 text-center">{i + 1}위</span>
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-gray-500">
                      총점 <b>{r.score.toFixed(1)}</b> · 수익률 {r.returnPct >= 0 ? "▲" : "▼"} {r.returnPct.toFixed(2)}% ·
                      변동성 {r.volatilityPct.toFixed(2)}% · 낙폭 {r.maxDrawdownPct.toFixed(2)}% ·
                      일관성 {(r.trendStability * 100).toFixed(0)}% · 효율성 {(r.efficiency * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">리스크대비효율</div>
                  <div className="font-bold text-emerald-600">{r.riskAdjusted.toFixed(2)}</div>
                </div>
              </div>
            );
          })}

          <div className="mt-6 text-center">
            {selectedKey ? (
              results[0]?.key === selectedKey ? (
                <div className="text-emerald-700 font-semibold mb-3">🎉 축하합니다! 당신의 선택이 1등입니다!</div>
              ) : (
                <div className="text-rose-700 font-semibold mb-3">아쉽네요! 다음에는 더 나은 판단을… 🔁</div>
              )
            ) : (
              <div className="text-gray-600 font-semibold mb-3">선택이 없었습니다.</div>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              다시 하기
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultPopup;
