import { useEffect, useState } from "react";
import {
  createRandomNewsEvent,
  applyNewsEvent,
  removeNewsEvent,
} from "../logic/eventScheduler";
import { useNewsStore } from "../store/useNewsStore";
import { useCommentStore } from "../store/useCommentStore"; 
import { getEventComment } from "../logic/stockComments";
import type { TickerKey } from "../hooks/useMarketStore";

function resolveEventKeyword(title: string): string {
  const keywords = [
    "분쟁 확대",
    "휴전/완화",
    "공급차질",
    "증산/완화",
    "금리 인하",
    "금리 인상",
    "밈 폭발",
    "AI 호황 뉴스",
    "AI 부작용/반발",
    "대형 해킹",
  ];
  for (const key of keywords) {
    if (title.includes(key)) return key;
  }
  return ""; // 매칭 없으면 빈 문자열
}

export default function NewsBoard() {
  const { currentEvent, setCurrentEvent, newsHistory, addToHistory, updateHistoryTime } =
    useNewsStore();
  const [endingEventId, setEndingEventId] = useState<string | null>(null); // 종료 표시용 ID 저장

  const { addComment } = useCommentStore.getState();

  // 뉴스 자동 생성
  useEffect(() => {
    const scheduleNextNews = () => {
      const delay = (5 + Math.random() * 30) * 1000;
      setTimeout(() => {
        const event = createRandomNewsEvent();
        setCurrentEvent(event);
        applyNewsEvent(event);
        addToHistory(event);

        const { addComment } = useCommentStore.getState();
        const impactedTickers = Object.keys(event.impacts);

        impactedTickers.forEach((ticker,index) => {
          const eventKey = resolveEventKeyword(event.title);
          const comment = getEventComment(eventKey, ticker);
          setTimeout(() => {
            addComment(`💬 [${ticker}] ${comment}`, "left");
          },index * 800);
        });

        const nextDelay = event.duration * 1000 + 2000;
        setTimeout(() => {
          setCurrentEvent(null);
        }, nextDelay);
      }, delay);
    };

    if (!currentEvent) scheduleNextNews();
  }, [currentEvent, setCurrentEvent, addToHistory]);

  // 타이머 및 이벤트 종료 처리
  useEffect(() => {
    if (!currentEvent) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, currentEvent.endTime - Date.now());

      if (remaining <= 0) {
        // ✅ 1️⃣ 오버레이 표시
        setEndingEventId(currentEvent.id);

        

        // ✅ 2️⃣ 2초 뒤 제거
        setTimeout(() => {
          const { removeFromHistory } = useNewsStore.getState();
          removeFromHistory(currentEvent.id);
          removeNewsEvent(currentEvent);
          setEndingEventId(null);
          setCurrentEvent(null);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentEvent, setCurrentEvent]);

  // 히스토리 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => updateHistoryTime(), 1000);
    return () => clearInterval(interval);
  }, [updateHistoryTime]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-[420px] overflow-y-auto">
      <h2 className="text-xl font-bold text-green-600 mb-3 flex items-center gap-2">
        <span className="bg-green-500 text-white px-2 py-0.5 text-sm rounded">Live</span>
        <span className="bg-green-500 text-white px-2 py-0.5 text-sm rounded">News</span>
        <span className="text-gray-600 text-base ml-2">실시간 속보 뉴스</span>
      </h2>

      {newsHistory.length === 0 && (
        <div className="text-center text-gray-400 py-8">뉴스 대기 중...</div>
      )}

      {newsHistory.map((item, index) => {
        const event = item.event;
        const eventId = event.id.split("-")[0];
        const press = event.press || "뉴스";

        const upStocks = Object.entries(event.impacts)
          .filter(([, range]) => range && range[0] >= 0)
          .map(([ticker]) => ticker as TickerKey);
        const downStocks = Object.entries(event.impacts)
          .filter(([, range]) => range && range[0] < 0)
          .map(([ticker]) => ticker as TickerKey);

        const mainTicker = upStocks[0] || downStocks[0];
        const comment = mainTicker ? getEventComment(eventId, mainTicker) : null;

        return (
          <div
            key={`${event.id}-${index}`}
            className={`relative border border-gray-200 p-3 rounded-lg mb-3 shadow-sm bg-gray-50 hover:bg-white transition-all duration-500 ${
              endingEventId === event.id ? "fade-out-down" : ""
            }`}
          >
            {/* 기본 뉴스 내용 */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">
                  [{press}] · {item.timeAgo}초 전
                </div>
                <div className="font-bold text-gray-800">{event.title}</div>
              </div>
            </div>

            {comment && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-2 mb-2 rounded">
                <p className="text-sm text-gray-700 italic">"{comment}"</p>
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {upStocks.map((ticker) => (
                <span
                  key={ticker}
                  className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold"
                >
                  {ticker} ▲
                </span>
              ))}
              {downStocks.map((ticker) => (
                <span
                  key={ticker}
                  className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold"
                >
                  {ticker} ▼
                </span>
              ))}
            </div>

            {/* ✅ 강화된 오버레이 (상황 종료 표시) */}
            {endingEventId === event.id && (
              <div className="absolute inset-0 flex flex-col items-center justify-center 
                              rounded-lg bg-orange-500/90 animate-blink z-20">
                <div className="text-white font-extrabold text-3xl animate-pulseText drop-shadow-lg">
                  상황 종료
                </div>
                <div className="text-white text-sm mt-2 opacity-90 tracking-widest">
                  EVENT ENDED
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
