import type { TickerKey } from "../hooks/useMarketStore";
import { useMarketStore } from "../hooks/useMarketStore";
import type { NewsEvent } from "../store/useNewsStore";

interface NewsTemplate {
  id: string;
  title: string;
  duration: [number, number];
  impacts: Partial<Record<TickerKey, [number, number]>>;
}

export const NEWS_TEMPLATES: NewsTemplate[] = [
  {
    id: "oil-expansion",
    title: "분쟁 확대",
    duration: [10, 30],
    impacts: {
      SCM: [10, 25],
      TPL: [25, 45],
      HSC: [5, 15],
      HFN: [-35, -25],
      HSG: [-20, -10],
    },
  },
  {
    id: "won-rate",
    title: "휴전/완화",
    duration: [20, 60],
    impacts: {
      SCM: [-10, -5],
      TPL: [-20, -10],
      HSC: [-10, -5],
      HFN: [20, 35],
      HSG: [10, 25],
    },
  },
  {
    id: "supply-issue",
    title: "공급 차질",
    duration: [10, 20],
    impacts: {
      SCM: [5, 15],
      TPL: [15, 30],
      HFN: [-20, -10],
      HSG: [-15, -5],
    },
  },
  {
    id: "won-weak",
    title: "증산/완화",
    duration: [10, 10],
    impacts: {
      SCM: [-20, -10],
      TPL: [-30, -15],
      HFN: [10, 20],
      HSG: [5, 15],
    },
  },
  {
    id: "cyber-attack",
    title: "대형 해킹",
    duration: [5, 10],
    impacts: {
      SCM: [-10, -5],
      TPL: [-10, -5],
      HSC: [25, 50],
      HFN: [-40, -20],
      HSG: [-25, -10],
    },
  },
  {
    id: "rate-cut",
    title: "금리 인하",
    duration: [15, 25],
    impacts: {
      SCM: [10, 20],
      TPL: [5, 10],
      HSC: [5, 10],
      HFN: [25, 40],
      HSG: [10, 20],
    },
  },
  {
    id: "rate-hike",
    title: "금리 인상",
    duration: [10, 20],
    impacts: {
      SCM: [-20, -10],
      TPL: [-15, -10],
      HFN: [-50, -30],
      HSG: [-20, -10],
    },
  },
  {
    id: "factory-explosion",
    title: "밈 폭발",
    duration: [5, 10],
    impacts: {
      SCM: [20, 40],
      TPL: [10, 25],
      HSC: [5, 10],
      HFN: [-25, -10],
      HSG: [40, 80],
    },
  },
  {
    id: "influencer-crackdown",
    title: "인플루언서 탄생",
    duration: [5, 10],
    impacts: {
      SCM: [5, 15],
      TPL: [5, 15],
      HSG: [30, 70],
    },
  },
  {
    id: "foreign-investment",
    title: "물류 차질",
    duration: [6, 10],
    impacts: {
      SCM: [10, 25],
      TPL: [10, 25],
      HFN: [-30, -15],
      HSG: [-20, -10],
    },
  },
  {
    id: "ai-boom",
    title: "AI 호황 뉴스",
    duration: [10, 15],
    impacts: {
      SCM: [15, 30],
      TPL: [5, 10],
      HSC: [10, 20],
      HFN: [10, 20],
      HSG: [25, 50],
    },
  },
  {
    id: "ai-issue",
    title: "AI 부작용/반발",
    duration: [10, 15],
    impacts: {
      SCM: [-20, -10],
      TPL: [-10, -5],
      HSC: [-15, -10],
      HFN: [-25, -15],
      HSG: [-50, -30],
    },
  },
];

function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function createRandomNewsEvent(): NewsEvent {
  const template = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)];
  const duration = random(template.duration[0], template.duration[1]);
  const now = Date.now();

  return {
    id: `${template.id}-${now}`,
    title: template.title,
    duration: duration,
    impacts: template.impacts,
    startTime: now,
    endTime: now + duration * 1000,
  };
}

export function applyNewsEvent(event: NewsEvent): void {
  const { setAsset } = useMarketStore.getState();

  Object.entries(event.impacts).forEach(([key, range]) => {
    if (range) {
      const impact = random(range[0], range[1]);
      const ticker = key as TickerKey;
      const asset = useMarketStore.getState().assets[ticker];

      const newDrift = asset.baseDrift * (1 + impact / 100);
      setAsset(ticker, { drift: newDrift });
    }
  });
}

export function removeNewsEvent(event: NewsEvent): void {
  const { setAsset } = useMarketStore.getState();

  Object.keys(event.impacts).forEach((key) => {
    const ticker = key as TickerKey;
    const asset = useMarketStore.getState().assets[ticker];
    setAsset(ticker, { drift: asset.baseDrift });
  });
}
