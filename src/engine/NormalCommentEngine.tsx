import { useEffect } from "react";
import { useCommentStore } from "../store/useCommentStore";
import { useMarketStore } from "../hooks/useMarketStore";
import { getRandomCommunityComments } from "../logic/stockComments";

export function useNormalCommentEngine() {
  useEffect(() => {
    const { addComment } = useCommentStore.getState(); // ✅ getState() 내부에서만 사용
    const { assets } = useMarketStore.getState(); // ✅ 상태 구독 없이 직접 접근 (렌더 안 일어남)
    const tickers = Object.keys(assets);

    if (tickers.length === 0) return;

    let isRunning = true;
    let timer: ReturnType<typeof setTimeout>;

    const postRandomComment = () => {
      if (!isRunning) return;

      const ticker = tickers[Math.floor(Math.random() * tickers.length)];
      const comments = getRandomCommunityComments(ticker, 1);

      if (comments.length > 0) {
        addComment(`💭 [${ticker}] ${comments[0]}`, "left");
      }

      // ✅ 3~7초 간격
      const nextDelay = 3000 + Math.random() * 4000;
      timer = setTimeout(postRandomComment, nextDelay);
    };

    postRandomComment();

    return () => {
      isRunning = false;
      clearTimeout(timer);
    };
  }, []); // ✅ 의존성 배열 비움 — 절대 다시 실행 안 됨
}