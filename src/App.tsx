import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketStore } from "./hooks/useMarketStore";
import { startEngine, stopEngine } from "./engine/marketEngine";
import ChartPanel from "./components/ChartPanel";
import TickerCard from "./components/TickerCard";
import AiReportBox from "./components/AiReportBox";
import ResultPopup from "./components/ResultPopup";
import HelpPanel from "./components/HelpPanel";
import LiveRanking from "./components/LiveRanking";
import NewsBoard from "./components/NewsBoard";
import LiquidAICharacter from "./components/LiquidAICharacter";
import AIMemoryEnvironment from "./components/AIMemoryEnvironment";
import MobileCommentPanel from "./components/MobileCommentPanel";
import { useCommentStore } from "./store/useCommentStore";
import { useNormalCommentEngine } from "./engine/NormalCommentEngine";
import type { Asset, TickerKey } from "./hooks/useMarketStore";
import { scoreSinceSelection } from "./engine/skillScorer_temp";

export default function App() {
  useNormalCommentEngine();
  const { assets } = useMarketStore();
  const list = Object.values(assets);
  const [focus, setFocus] = useState<Asset | null>(list[0] || null);
  const [aiReact, setAiReact] = useState(false);

  const [phase, setPhase] =
    useState<"analysis" | "thinking" | "evaluating" | "result">("analysis");
  const [countdown, setCountdown] = useState(0);
  const [selected, setSelected] = useState<TickerKey | null>(null);
  const [evalStartPrices, setEvalStartPrices] = useState<Record<string, number> | null>(null);
  const [evalStartLens, setEvalStartLens] = useState<Record<string, number> | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isEvaluating] = useState(false);
  const [topKey, setTopKey] = useState<TickerKey | null>(null);
  const [showSelectMessage, setShowSelectMessage] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showIntroOverlay, setShowIntroOverlay] = useState(false);
  const [winnerKey, setWinnerKey] = useState<TickerKey | null>(null);

  // ✅ 시작 페이지 상태
  const [started, setStarted] = useState(false);
  const [fadeOutStart, setFadeOutStart] = useState(false);

  const { addComment } = useCommentStore();
  useEffect(() => {
    addComment("💬 오픈채팅 TH 주식갤러리에 입장하였습니다.", "left");
  }, []);

  useEffect(() => {
    startEngine();
    return () => stopEngine();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  useEffect(() => {
    if (phase === "thinking" && countdown === 0) {
      if (!selected) {
        setPhase("analysis");
        return;
      }
      if (!evalStartPrices || !evalStartLens) captureEvalStartNow();
      setPhase("evaluating");
      setCountdown(20);
      return;
    }

    if (phase === "evaluating" && countdown === 0) {
      if (evalStartPrices && evalStartLens) {
        const scored = scoreSinceSelection(
          evalStartPrices,
          evalStartLens,
          useMarketStore.getState().assets
        );
        setResults(scored);
        if (scored.length > 0) setWinnerKey(scored[0].key as TickerKey);
      } else setResults([]);
      setPhase("result");
    }
  }, [phase, countdown]);

  useEffect(() => {
    if (phase !== "evaluating") return;
    const interval = setInterval(() => {
      const assetList = Object.values(assets);
      if (assetList.length === 0) return;
      const best = assetList.reduce((prev, curr) =>
        curr.riskEfficiency > prev.riskEfficiency ? curr : prev
      );
      setFocus(best);
      setTopKey(best.key);
    }, 300);
    return () => clearInterval(interval);
  }, [phase, assets]);

  const startThinking = () => {
    setSelected(null);
    setPhase("thinking");
    setCountdown(5);
    setShowSelectMessage(true);
    setFadeOut(false);
    setShowIntroOverlay(true);
    setTimeout(() => setShowIntroOverlay(false), 2000);
    setTimeout(() => setFadeOut(true), 1500);
    setTimeout(() => setShowSelectMessage(false), 2000);
  };

  const captureEvalStartNow = () => {
    const curr = useMarketStore.getState().assets;
    const startP: Record<string, number> = {};
    const startL: Record<string, number> = {};
    Object.keys(curr).forEach((k) => {
      startP[k] = curr[k as TickerKey].price;
      startL[k] = curr[k as TickerKey].history.length;
    });
    setEvalStartPrices(startP);
    setEvalStartLens(startL);
  };

  const handleCardClick = (a: Asset) => {
    setFocus({ ...a });
    setAiReact(true);
    setTimeout(() => setAiReact(false), 1200);
    if (phase === "thinking") {
      setSelected(a.key);
      captureEvalStartNow();
      setPhase("evaluating");
      setCountdown(20);
    }
  };

  const restart = () => {
    setPhase("analysis");
    setCountdown(0);
    setSelected(null);
    setEvalStartPrices(null);
    setEvalStartLens(null);
    setResults([]);
    setFocus(list[0] || null);
    setWinnerKey(null);
  };

  // ✅ 시작 버튼 클릭 → fade-out 후 메인화면 진입
  const handleStart = () => {
    setFadeOutStart(true);
    setTimeout(() => setStarted(true), 1000);
  };

  // ✅ 시작화면 (여기만 교체)
  if (!started) {
    return (
      <motion.div
        className="fixed inset-0 overflow-hidden flex justify-center items-center bg-gradient-to-b from-[#f2e9dc] to-[#d6c7b5]"
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOutStart ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        {/* 벽/바닥 */}
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 bg-[#f9f3eb]" />
          <div className="h-1/3 bg-[#d8c9b3] shadow-inner" />
        </div>

        {/* 창문 */}
        <div className="absolute top-[15%] left-[15%] w-[220px] h-[150px] rounded-lg bg-[#bcd6f5] border-[5px] border-[#aab9d2] shadow-[inset_0_0_40px_rgba(255,255,255,0.6)]">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/40 mix-blend-overlay" />
        </div>

        {/* 천장 조명 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[90px] bg-yellow-100 rounded-b-full shadow-[0_10px_40px_rgba(255,230,140,0.7)] opacity-90" />

        {/* 책상 + 모니터 + 캐릭터 */}
        <div className="absolute bottom-[15%] flex items-end gap-4">
          {/* 책상 */}
          <div className="w-[420px] h-[120px] bg-[#b29b7f] rounded-t-lg shadow-lg relative">
            {/* 모니터 */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-[120px] w-[150px] h-[95px] bg-[#1a1d23] rounded-md shadow-[0_0_20px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#1f1f2b] to-[#151820]" />
              <div className="absolute inset-0 bg-cyan-300/20 blur-2xl animate-pulse" />
            </div>
          </div>

          {/* 캐릭터 + 의자  👉 여기만 수정 */}
          <div className="relative -ml-[90px] w-[170px] h-[270px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]">
            {/* LiquidAICharacter는 expression/className props가 없음 */}
            <LiquidAICharacter aiReact={false} phase="analysis" />
            <div className="absolute bottom-0 left-0 w-[150px] h-[42px] bg-[#695e52] rounded-t-xl shadow-inner" />
          </div>
        </div>

        {/* 장식 */}
        <div className="absolute right-[12%] top-[25%] w-[110px] h-[150px] bg-[#c2d8b2] rounded-lg shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]">
          <div className="absolute bottom-0 w-full h-[32px] bg-[#7b5e3c] rounded-t-md" />
        </div>
        <div className="absolute right-[25%] top-[10%] w-[130px] h-[76px] bg-white rounded-md border-[3px] border-[#d5c4a1] flex items-center justify-center text-[#8a7763] font-semibold shadow-md">
          Poster
        </div>

        {/* 타이틀 + 시작 버튼 */}
        <div className="absolute top-[12%] flex flex-col items-center space-y-4 text-center text-[#4a3c2a]">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">TH 주식 시뮬레이터</h1>
          <motion.button
            onClick={handleStart}
            className="mt-6 px-10 py-4 bg-[#4b5563] text-white text-xl rounded-2xl shadow-lg hover:bg-[#2d3748] transition"
            whileHover={{ scale: 1.05 }}
          >
            시작하기 ▶
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ✅ 메인화면
  return (
    <div
      className={`min-h-screen p-6 flex flex-col ${
        phase === "evaluating"
          ? "animate-bg-transition"
          : "bg-gradient-to-br from-indigo-100 via-sky-100 to-purple-100 transition-all duration-700"
      }`}
    >
      {/* 오버레이 연출 */}
      <AnimatePresence>
        {showIntroOverlay && (
          <motion.div
            key="introOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="scale-125 mb-6">
                <LiquidAICharacter aiReact={true} phase="thinking" />
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-4xl font-bold tracking-wide text-center drop-shadow-lg"
              >
                지금부터 종목을 골라봐
                <br />
                행운을 빌게!
              </motion.h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 기존 메인 UI */}
      <header className="flex items-center justify-between mb-5 px-4">
        <h1 className="text-3xl font-bold text-indigo-700"></h1>
        <div className="flex items-center gap-3">
          {phase === "analysis" && (
            <button
              onClick={startThinking}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"
            >
              예측 확정하기 ▶ (3초)
            </button>
          )}
          {phase === "thinking" && (
            <div className="text-lg font-semibold text-indigo-700">
              🎯 선택 대기 중... 남은 시간 {countdown}s
            </div>
          )}
          {phase === "evaluating" && (
            <div className="text-lg font-semibold text-rose-700">
              ⏱ 평가 중... {countdown}s
            </div>
          )}
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 flex gap-6 overflow-hidden">
        <section className="flex-1">
          <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 auto-rows-max">
            {list.map((a) => (
              <div
                key={a.key}
                onClick={() => {
                  if (!isEvaluating) handleCardClick(a);
                }}
                className={`transition-all duration-300 cursor-pointer ${
                  focus?.key === a.key ? "scale-105 z-10 shadow-xl" : "scale-100 opacity-90"
                }`}
              >
                <TickerCard a={a} focusKey={focus?.key} topKey={topKey} />
                <ChartPanel label={a.name} data={a.history} />
              </div>
            ))}

            <div className="col-span-2 h-64">
              <NewsBoard />
            </div>

            <div className="col-span-3 flex items-start gap-[20px] mt-[14px]">
              <div className="flex-1 h-[400px]">
                <MobileCommentPanel />
              </div>

              <div className="w-[400px] h-[440px] shrink-0">
                {phase === "analysis" && <HelpPanel />}
                {(phase === "thinking" || phase === "evaluating") && (
                  <LiveRanking assets={list} selectedKey={selected} />
                )}
              </div>
            </div>
          </div>
        </section>

        <aside className="w-[420px] shrink-0 flex flex-col gap-4 transition-all duration-500">
          {focus && <AiReportBox focus={focus} />}
          <div className="relative mt-2 flex-1 min-h-[510px] max-h-[550px] rounded-2xl overflow-visible shadow-xl bg-transparent">
            <div className="absolute inset-0 z-0">
              <AIMemoryEnvironment />
            </div>
            <div className="absolute inset-0 flex justify-center items-center z-[9999] pointer-events-none">
              <LiquidAICharacter
                aiReact={aiReact}
                phase={phase}
                key={aiReact ? "reacting" : "idle"}
                isWinner={winnerKey === selected}
              />
            </div>
          </div>
        </aside>
      </main>

      {phase === "result" && (
        <ResultPopup results={results} selectedKey={selected} onClose={restart} />
      )}
    </div>
  );
}
