import type { TickerKey } from "../hooks/useMarketStore";
import { useMarketStore } from "../hooks/useMarketStore";
import type { NewsEvent } from "../store/useNewsStore";

interface NewsTemplate {
  id: string;
  press: string;
  title: string;
  duration: [number, number];
  impacts: Partial<Record<TickerKey, [number, number]>>;
}

export const NEWS_TEMPLATES: NewsTemplate[] = [
  {
    id: "oil-expansion",
    press: "한국경제 신문",
    title: "분쟁 확대 [속보] 국경 긴장 고조… 전 세계 증시 ‘리스크 모드’ 전환",
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
    press: "한국경제 신문",
    title: "휴전/완화 [긴급] 휴전 소식에 시장 안도 랠리… 위험자산 회복세",
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
    press: "트렌드투데이",
    title: "공급차질 [속보] 공급망 붕괴 우려 확산… 제조·화학 업종 강세",
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
    press: "트렌드투데이",
    title: "증산/완화 [단신] 증산 소식에 유가 급락… 인플레 완화 기대감 확산",
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
    press: "머니투데이마켓",
    title: "대형 해킹 [속보] 글로벌 해킹 사태 발생… 보안주 폭등, 금융권 타격",
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
    press: "머니투데이마켓",
    title: "금리 인하 [긴급] 기준금리 전격 인하… 증시 전반 상승 전환",
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
    press: "테크노미뉴스",
    title: "금리 인상 [속보] 금리 인상 단행… 증시 급락, 투자심리 얼어붙어",
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
    press: "테크노미뉴스",
    title: "밈 폭발 [속보] ‘밈 주식’ 광풍… 단타 세력 대규모 진입",
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
    press: "이코노믹데일리",
    title: "인플루언서 탄생 [속보] 슈퍼 인플루언서 등장… SNS주 폭등세",
    duration: [5, 10],
    impacts: {
      SCM: [5, 15],
      TPL: [5, 15],
      HSG: [30, 70],
    },
  },
  {
    id: "foreign-investment",
    press: "이코노믹데일리",
    title: "물류 차질 [단신] 항만 마비·운송 중단… 공급망 위기 재점화",
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
    press: "오늘의핫이슈",
    title: "AI 호황 뉴스 [속보] AI 산업 폭발적 성장세… 기술주 일제 강세",
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
    press: "오늘의핫이슈",
    title: "AI 부작용/반발 [속보] AI 규제 강화 논의… 기술 섹터 급락세",
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
    press: template.press || "뉴스", 
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
