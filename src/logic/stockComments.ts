import type { TickerKey } from "../hooks/useMarketStore";

export const NORMAL_COMMENTS: Record<TickerKey, string[]> = {
  SCM: [
    "이놈은 진짜 지하실에 공장 차렸냐...",
    "화학주는 그냥 인내력 테스트임",
    "유가만 오르면 덩달아 좀 올라라 제발",
    "오늘도 단 한 틱의 감동이 없네",
  ],
  TPL: [
    "국제유가가 내 주식보다 안정적임",
    "WTI 떨어지면 내 계좌도 떨어짐",
    "기름값 오를 땐 반응 없고 내릴 땐 하락각 뭐냐",
  ],
  HSC: [
    "이 종목은 뉴스 안 터지면 관짝임",
    "해킹 한 번만 더 터져라 제발...",
    "실적 좋아도 관심이 없음, 이게 현실",
  ],
  HFN: [
    "배당은 좋지만 주가가 문제다",
    "이래서 금융주는 장기투자 하는 게 아님",
    "시장 하락하면 금융부터 맞는다 진짜 고정픽임",
  ],
  HSG: [
    "이건 밈주지 기업이 아님",
    "앱 업데이트보다 주가 업데이트가 느림",
    "트렌드만 타면 잠깐 반짝하고 끝",
  ],
};

export const EVENT_COMMENTS: Record<string, Partial<Record<TickerKey, string>>> = {
  "oil-expansion": {
    SCM: "전쟁 터지면 화학주 달린다 ㅋㅋ 폭탄 원료 수요급등각",
    TPL: "중동에서 총성! 유가 미쳤다!! 석유 풀스로틀 간다",
  },
  "won-rate": {
    HFN: "시장심리 살아나니 금융도 드디어 기지개",
  },
  "supply-issue": {
    SCM: "원자재 품귀 뉴스 떴다, 화학 줄줄이 상한가각",
    TPL: "오펙이 또 감산 ㅋㅋ 석유 불장 오나?",
  },
  "won-weak": {
    SCM: "평화 오니까 화학 녹는중... 평화가 죄냐",
    TPL: "평화 = 유가 급락 = 내 계좌 장례식",
  },
  "cyber-attack": {
    HSC: "해킹 터졌다!!! 보안주들 오늘이 국룰상한가",
  },
  "rate-cut": {
    HSC: "돈 풀리면 사이버 보안 투자도 늘겠지?",
    HFN: "와 드디어 금리 내렸다!! 은행주 다시 숨쉬냐?",
  },
  "rate-hike": {
    HFN: "이자 장사 좋을 줄 알았더니 주가는 반대네",
  },
  "factory-explosion": {
    TPL: "증산 발표 = 하루만에 급락 완성형 주식",
    HSG: "ㅋㅋㅋㅋ 이게 진짜 밈주야!! 장전 전쟁이다",
  },
  "influencer-crackdown": {
    HSG: "OO이 언급했대ㅋㅋ 바로 상한가 실화냐",
  },
  "foreign-investment": {
    HFN: "전쟁터 열리면 금융주 먼저 박살남",
  },
  "ai-boom": {
    HSC: "AI도 결국 해킹당함ㅋㅋ 보안주 필수",
    HSG: "AI 기능 넣는다고 주가도 AI급 상승",
  },
  "ai-issue": {
    HSC: "AI 규제 들어가면 보안 솔루션 진짜 뜰듯",
    HSG: "AI 규제 뉴스 나오니까 바로 추락하네;;",
  },
};

export function getRandomComment(ticker: TickerKey): string {
  const comments = NORMAL_COMMENTS[ticker];
  return comments[Math.floor(Math.random() * comments.length)];
}

export function getEventComment(eventId: string, ticker: TickerKey): string | null {
  const eventComments = EVENT_COMMENTS[eventId];
  return eventComments?.[ticker] || null;
}
