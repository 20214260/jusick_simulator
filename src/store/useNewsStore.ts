import { create } from "zustand";
import type { TickerKey } from "../hooks/useMarketStore";

export interface NewsEvent {
  id: string;
  title: string;
  duration: number; // 초
  impacts: Partial<Record<TickerKey, [number, number]>>; // [min%, max%]
  startTime: number;
  endTime: number;
}

export interface NewsHistoryItem {
  event: NewsEvent;
  timeAgo: number; // 몇 초 전
}

interface NewsItem {
  title: string;
  source: string;
  timeAgo: number;
  icon?: string;
}

interface NewsState {
  news: NewsItem[];
  comments: string[];
  currentEvent: NewsEvent | null;
  newsHistory: NewsHistoryItem[];
  addNews: (item: NewsItem) => void;
  addComment: (text: string) => void;
  setCurrentEvent: (event: NewsEvent | null) => void;
  addToHistory: (event: NewsEvent) => void;
  updateHistoryTime: () => void;
}

export const useNewsStore = create<NewsState>((set) => ({
  news: [],
  comments: [],
  currentEvent: null,
  newsHistory: [],
  addNews: (item) =>
    set((state) => ({
      news: [{ ...item, timeAgo: 0 }, ...state.news.slice(0, 10)],
    })),
  addComment: (text) =>
    set((state) => ({
      comments: [text, ...state.comments.slice(0, 20)],
    })),
  setCurrentEvent: (event) =>
    set(() => ({
      currentEvent: event,
    })),
  addToHistory: (event) =>
    set((state) => ({
      newsHistory: [
        { event, timeAgo: 0 },
        ...state.newsHistory.slice(0, 9), // 최대 10개 유지
      ],
    })),
  updateHistoryTime: () =>
    set((state) => ({
      newsHistory: state.newsHistory.map((item) => ({
        ...item,
        timeAgo: Math.floor((Date.now() - item.event.startTime) / 1000),
      })),
    })),
}));
