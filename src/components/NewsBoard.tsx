import { useEffect } from "react";
import {
  createRandomNewsEvent,
  applyNewsEvent,
  removeNewsEvent,
} from "../logic/eventScheduler";
import { useNewsStore } from "../store/useNewsStore";
import { getEventComment } from "../logic/stockComments";
import type { TickerKey } from "../hooks/useMarketStore";

export default function NewsBoard() {
  const { currentEvent, setCurrentEvent, newsHistory, addToHistory, updateHistoryTime } =
    useNewsStore();

  // 랜덤 간격으로 뉴스 생성 (15~45초)
  useEffect(() => {
    const scheduleNextNews = () => {
      const delay = (5 + Math.random() * 30) * 1000;
      setTimeout(() => {
        const event = createRandomNewsEvent();
        setCurrentEvent(event);
        applyNewsEvent(event);
        addToHistory(event);
      }, delay);
    };

    // 초기 뉴스 스케줄링
    if (!currentEvent) {
      scheduleNextNews();
    }
  }, [currentEvent, setCurrentEvent, addToHistory]);

  // 타이머 및 이벤트 종료 처리
  useEffect(() => {
    if (!currentEvent) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, currentEvent.endTime - Date.now());

      if (remaining <= 0) {
        removeNewsEvent(currentEvent);
        setCurrentEvent(null);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentEvent, setCurrentEvent]);

  // 히스토리 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      updateHistoryTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateHistoryTime]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-green-600 mb-3 flex items-center gap-2">
        <span className="bg-green-500 text-white px-2 py-0.5 text-sm rounded">Live</span>
        <span className="bg-green-500 text-white px-2 py-0.5 text-sm rounded">News</span>
        <span className="text-gray-600 text-base ml-2">실시간 속보 뉴스</span>
      </h2>

      {newsHistory.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          뉴스 대기 중...
        </div>
      )}

      {newsHistory.map((item, index) => {
        const event = item.event;
        const eventId = event.id.split("-")[0];

        // 올라간/내려간 종목 분류
        const upStocks = Object.entries(event.impacts)
          .filter(([, range]) => range && range[0] >= 0)
          .map(([ticker]) => ticker as TickerKey);

        const downStocks = Object.entries(event.impacts)
          .filter(([, range]) => range && range[0] < 0)
          .map(([ticker]) => ticker as TickerKey);

        // 대표 코멘트 가져오기 (첫 번째 영향받는 종목의 코멘트)
        const mainTicker = upStocks[0] || downStocks[0];
        const comment = mainTicker ? getEventComment(eventId, mainTicker) : null;

        return (
          <div
            key={`${event.id}-${index}`}
            className="border border-gray-200 p-3 rounded-lg mb-3 shadow-sm bg-gray-50 hover:bg-white transition-all"
          >
            {/* 헤더 */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">
                  뉴스 · {item.timeAgo}초 전
                </div>
                <div className="font-bold text-gray-800">{event.title}</div>
              </div>
              {upStocks.length > 0 && (
                <div className="ml-2 text-right">
                  <span className="text-xs text-gray-500">관련</span>
                  <div className="text-lg">
                    {upStocks.length > 0 ? "📈" : "📉"}
                  </div>
                </div>
              )}
            </div>

            {/* 뉴스 내용 (코멘트) */}
            {comment && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-2 mb-2 rounded">
                <p className="text-sm text-gray-700 italic">"{comment}"</p>
              </div>
            )}

            {/* 영향받는 종목 */}
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
          </div>
        );
      })}
    </div>
  );
}
