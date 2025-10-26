/** =========================
 *  코멘트 DB
 *  ========================= */
export const stockCommentDatabase = {
  "성규화학": {
    normal: [
      "이놈은 진짜 지하실에 공장 차렸냐…",
      "화학주는 그냥 인내력 테스트임",
      "유가만 오르면 덩달아 좀 올라라 제발",
      "오늘도 단 한 틱의 감동이 없네 성규야 뒤져라",
    ],
    events: {
      "분쟁 확대": "전쟁 터지면 화학주 달린다 ㅋㅋ 폭탄 원료 수요급등각",
      "휴전/완화": "평화 오니까 화학 녹는중… 평화가 죄냐",
      "공급차질": "원자재 품귀 뉴스 떴다, 화학 줄줄이 상한가각",
      "증산/완화": "생산량 늘린다니까 바로 떡락, 시장은 냉정하다",
    },
  },

  "태호석유": {
    normal: [
      "국제유가가 내 주식보다 안정적임",
      "WTI 떨어지면 내 계좌도 떨어짐",
      "기름값 오를 땐 반응 없고 내릴 땐 하락각 뭐냐",
    ],
    events: {
      "분쟁 확대": "중동에서 총성! 유가 미쳤다!! 석유 풀스로틀 간다",
      "휴전/완화": "평화 = 유가 급락 = 내 계좌 장례식",
      "공급차질": "오펙이 또 감산 ㅋㅋ 석유 불장 오나?",
      "증산/완화": "증산 발표 = 하루만에 급락 완성형 주식",
    },
  },

  "효림시큐리티": {
    normal: [
      "이 종목은 뉴스 안 터지면 관짝임",
      "해킹 한 번만 더 터져라 제발…",
      "실적 좋아도 관심이 없음, 이게 현실",
    ],
    events: {
      "대형 해킹": "해킹 터졌다!!! 보안주들 오늘이 국룰상한가",
      "금리 인하": "돈 풀리면 사이버 보안 투자도 늘겠지?",
      "AI 호황 뉴스": "AI도 결국 해킹당함ㅋㅋ 보안주 필수",
      "AI 부작용/반발": "AI 규제 들어가면 보안 솔루션 진짜 뜰듯",
    },
  },

  "현빈금융": {
    normal: [
      "배당은 좋지만 주가가 문제다",
      "이래서 금융주는 장기투자 하는 게 아님",
      "시장 하락하면 금융부터 맞는다 진짜 고정픽임",
    ],
    events: {
      "금리 인하": "와 드디어 금리 내렸다!! 은행주 다시 숨쉬냐?",
      "금리 인상": "이자 장사 좋을 줄 알았더니 주가는 반대네",
      "분쟁 확대": "전쟁터 열리면 금융주 먼저 박살남",
      "휴전/완화": "시장심리 살아나니 금융도 드디어 기지개",
    },
  },

  "한스타그램": {
    normal: [
      "이건 밈주지 기업이 아님",
      "앱 업데이트보다 주가 업데이트가 느림",
      "트렌드만 타면 잠깐 반짝하고 끝",
    ],
    events: {
      "밈 폭발": "ㅋㅋㅋㅋ 이게 진짜 밈주야!! 장전 전쟁이다",
      "인플루언서 탄생": "OO이 언급했대ㅋㅋ 바로 상한가 실화냐",
      "AI 호황 뉴스": "AI 기능 넣는다고 주가도 AI급 상승",
      "AI 부작용/반발": "AI 규제 뉴스 나오니까 바로 추락하네;;",
    },
  },
} as const;

type KnownStock = keyof typeof stockCommentDatabase;

/** =========================
 *  티커/이벤트 매핑 (유연 대응)
 *  ========================= */

/** 티커코드/별칭 → DB키 매핑 (필요시 자유롭게 추가) */
const tickerToStockMap: Record<string, KnownStock> = {
  // 한국어 자체를 넣어주는 경우
  "SCM": "성규화학",
  "TPL": "태호석유",
  "HSC": "효림시큐리티",
  "HFN": "현빈금융",
  "HSG": "한스타그램",

  // 코드/별칭(예상되는 과거 코드들) → 한국어명
  "SHG": "성규화학",     // (chemicals)
  "BGE": "태호석유",     // (energy/oil)
  "CSI": "효림시큐리티", // (cyber security)
  "HBF": "현빈금융",     // (finance) 필요시 수정
  "MWS": "한스타그램",   // (social/media)
};

/** 이벤트ID/영문/별칭 → 한국어 이벤트 라벨 매핑 */
const eventIdToTitleMap: Record<string, string> = {
  // 분쟁/휴전
  "WAR_EXPAND": "분쟁 확대",
  "WAR-EXPAND": "분쟁 확대",
  "분쟁": "분쟁 확대",
  "분쟁 확대": "분쟁 확대",
  "TRUCE": "휴전/완화",
  "CEASEFIRE": "휴전/완화",
  "휴전": "휴전/완화",
  "완화": "휴전/완화",
  "휴전/완화": "휴전/완화",

  // 공급/증산
  "SUPPLY_SHOCK": "공급차질",
  "SUPPLY-ISSUE": "공급차질",
  "공급차질": "공급차질",
  "PRODUCTION_UP": "증산/완화",
  "증산": "증산/완화",
  "증산/완화": "증산/완화",

  // 보안/AI/금리/밈
  "MEGA_HACK": "대형 해킹",
  "대형 해킹": "대형 해킹",
  "AI_BOOM": "AI 호황 뉴스",
  "AI 호황 뉴스": "AI 호황 뉴스",
  "AI_PUSHBACK": "AI 부작용/반발",
  "AI 부작용/반발": "AI 부작용/반발",
  "RATE_CUT": "금리 인하",
  "금리 인하": "금리 인하",
  "RATE_HIKE": "금리 인상",
  "금리 인상": "금리 인상",
  "MEME_BOOM": "밈 폭발",
  "밈 폭발": "밈 폭발",
  "INFLUENCER": "인플루언서 탄생",
  "인플루언서 탄생": "인플루언서 탄생",
};

/** 입력 티커를 DB 키로 정규화 */
function resolveStockKey(input: string | undefined | null): KnownStock | null {
  if (!input) return null;
  // 1) 정확 일치(한국어)
  if ((stockCommentDatabase as any)[input]) return input as KnownStock;
  // 2) 매핑 표
  const upper = input.toUpperCase();
  if (tickerToStockMap[input]) return tickerToStockMap[input];
  if (tickerToStockMap[upper]) return tickerToStockMap[upper];
  return null;
}

/** 입력 이벤트ID/제목을 한국어 라벨로 정규화 */
function resolveEventTitle(input: string | undefined | null): string | null {
  if (!input) return null;

  if (eventIdToTitleMap[input]) return eventIdToTitleMap[input];
  const upper = input.toUpperCase();
  if (eventIdToTitleMap[upper]) return eventIdToTitleMap[upper];

  const normalized = input.replace(/\[.*?\]/g, "").trim();
  for (const [key, label] of Object.entries(eventIdToTitleMap)) {
    if (normalized.includes(key)) {
      return label;
    }
  }

  if (normalized.includes("인플루언서")) return "인플루언서 탄생";
  if (normalized.includes("AI") && normalized.includes("규제")) return "AI 부작용/반발";
  if (normalized.includes("휴전") || normalized.includes("완화")) return "휴전/완화";
  if (normalized.includes("공급")) return "공급차질";
  if (normalized.includes("증산")) return "증산/완화";
  if (normalized.includes("분쟁")) return "분쟁 확대";
  if (normalized.includes("금리 인하")) return "금리 인하";
  if (normalized.includes("금리 인상")) return "금리 인상";
  if (normalized.includes("밈")) return "밈 폭발";

  return null;
}

/** =========================
 *  공개 API
 *  ========================= */

/** 상황(옵션)에 맞는 코멘트 1개 반환 */
export function getStockComment(ticker: string, eventTitle?: string): string {
  const stockKey = resolveStockKey(ticker);
  if (!stockKey) return "관련 코멘트 없음";

  const stock = stockCommentDatabase[stockKey];

  // 이벤트 멘트 우선
  const title = resolveEventTitle(eventTitle || "");
  if (title && stock.events[title as keyof typeof stock.events]) {
    return stock.events[title as keyof typeof stock.events];
  }

  // 평상시 멘트 랜덤
  const normals = stock.normal;
  if (!normals || normals.length as number === 0) return "관련 코멘트 없음";
  return normals[Math.floor(Math.random() * normals.length)];
}

/**
 * ✅ 호환용: 기존 NewsBoard.tsx가 쓰는 시그니처
 *  getEventComment(eventId, ticker) 유지
 *  - eventId: "WAR_EXPAND" / "공급차질" / 등등
 *  - ticker: "BGE" / "성규화학" / 등등
 */
export function getEventComment(eventId: string, ticker: string): string {
  const title = resolveEventTitle(eventId);
  return getStockComment(ticker, title || undefined);
}

/** (선택) 여러 개의 평상시 코멘트를 랜덤 뽑아서 반환 */
export function getRandomCommunityComments(ticker: string, count = 3): string[] {
  const stockKey = resolveStockKey(ticker);
  if (!stockKey) return [];
  const normals = stockCommentDatabase[stockKey].normal;
  if (!normals?.length) return [];
  const clamp = Math.max(1, Math.min(count, normals.length));
  const result: string[] = [];
  for (let i = 0; i < clamp; i++) {
    result.push(normals[Math.floor(Math.random() * normals.length)]);
  }
  return result;
}

