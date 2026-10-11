/**
 * 20개 주요 ETF 종목 데이터 및 시뮬레이션 설정
 */
const STOCK_DATA = [
  {
    id: "ETF_SEMI",
    symbol: "091160",
    name: "KODEX 반도체",
    category: "반도체/IT",
    basePrice: 38500,
    volatility: 0.32,      // 연간 변동성 32%
    baseDrift: 0.18,       // 연간 기대수익률 18%
    description: "삼성전자, SK하이닉스 등 국내 대표 반도체 소부장 및 메모리 밸류체인에 집중 투자하는 ETF",
    tags: ["HBM", "AI가속기", "소부장", "메모리슈퍼사이클"],
    color: "#3b82f6",
    icon: "fa-microchip"
  },
  {
    id: "ETF_NASDAQ",
    symbol: "133690",
    name: "TIGER 미국나스닥200",
    category: "해외지수/빅테크",
    basePrice: 98000,
    volatility: 0.24,
    baseDrift: 0.15,
    description: "미국 나스닥 시장의 기술주 및 대표 혁신기업 200개 종목에 분산 투자하는 대표 ETF",
    tags: ["글로벌테크", "AI", "클라우드", "혁신성장"],
    color: "#6366f1",
    icon: "fa-globe"
  },
  {
    id: "ETF_KOSPI",
    symbol: "069500",
    name: "KODEX 코스피100",
    category: "국내대표지수",
    basePrice: 28500,
    volatility: 0.18,
    baseDrift: 0.08,
    description: "대한민국 유가증권시장(KOSPI) 대형주 100종목으로 구성된 대한민국 대표 지수 ETF",
    tags: ["대형주", "코스피", "시장대표", "밸류업"],
    color: "#10b981",
    icon: "fa-chart-line"
  },
  {
    id: "ETF_SHIP",
    symbol: "444450",
    name: "SOL K-조선해운",
    category: "조선/중공업",
    basePrice: 16800,
    volatility: 0.35,
    baseDrift: 0.22,
    description: "HD현대중공업, 한화오션, 삼성중공업 등 LNG운반선 및 친환경 선박 수주 슈퍼사이클 수혜 ETF",
    tags: ["LNG선", "친환경선박", "조선수주", "해운운임"],
    color: "#0ea5e9",
    icon: "fa-ship"
  },
  {
    id: "ETF_BATTERY",
    symbol: "305540",
    name: "TIGER 2차전지TOP10",
    category: "2차전지/배터리",
    basePrice: 21500,
    volatility: 0.42,
    baseDrift: 0.10,
    description: "LG에너지솔루션, POSCO홀딩스, 에코프로비엠 등 배터리 셀 및 핵심 양극재/음극재 기업 투자",
    tags: ["EV배터리", "양극재", "캐즘극복", "에너지저장(ESS)"],
    color: "#f59e0b",
    icon: "fa-bolt"
  },
  {
    id: "ETF_DEFENSE",
    symbol: "449450",
    name: "PLUS K-방산",
    category: "방위산업",
    basePrice: 32000,
    volatility: 0.28,
    baseDrift: 0.25,
    description: "한화에어로스페이스, 현대로템, KAI 등 K-방산 무기체계 글로벌 수출 랠리 수혜 ETF",
    tags: ["K9자주포", "K2전차", "수출수주", "지정학수혜"],
    color: "#ef4444",
    icon: "fa-shield-halved"
  },
  {
    id: "ETF_BIGTECH",
    symbol: "472150",
    name: "ACE 글로벌빅테크TOP7",
    category: "글로벌AI/테크",
    basePrice: 19500,
    volatility: 0.26,
    baseDrift: 0.20,
    description: "엔비디아, 마이크로소프트, 애플, 알파벳, 아마존, 메타 등 매그니피센트7 집중 투자 ETF",
    tags: ["M7", "생성형AI", "GPU", "클라우드"],
    color: "#8b5cf6",
    icon: "fa-network-wired"
  },
  {
    id: "ETF_BIO",
    symbol: "364960",
    name: "TIGER 바이오TOP10",
    category: "바이오/헬스케어",
    basePrice: 14200,
    volatility: 0.38,
    baseDrift: 0.14,
    description: "삼성바이오로직스, 셀트리온, 유한양행, 알테오젠 등 K-바이오시밀러 및 신약개발 파이프라인 ETF",
    tags: ["바이오시밀러", "ADC", "비만치료제", "FDA승인"],
    color: "#ec4899",
    icon: "fa-dna"
  },
  {
    id: "ETF_NUCLEAR",
    symbol: "433870",
    name: "ACE 원자력&SMR",
    category: "원자력/전력인프라",
    basePrice: 18400,
    volatility: 0.34,
    baseDrift: 0.24,
    description: "두산에너빌리티, 현대건설 등 체코 원전 수주 및 AI 데이터센터 전력 수요 폭증 수혜 ETF",
    tags: ["체코원전", "SMR", "AI전력망", "변압기"],
    color: "#14b8a6",
    icon: "fa-atom"
  },
  {
    id: "ETF_DIVIDEND",
    symbol: "161510",
    name: "ARIRANG 고배당주",
    category: "배당/가치주",
    basePrice: 15600,
    volatility: 0.14,
    baseDrift: 0.09,
    description: "국내 고배당 대표 기업 및 금융지주사에 투자하여 안정적 배당 수익과 밸류업을 추구하는 ETF",
    tags: ["월배당", "금융지주", "밸류업프로그램", "저변동성"],
    color: "#84cc16",
    icon: "fa-coins"
  },
  {
    id: "ETF_INDIA",
    symbol: "453850",
    name: "TIGER 인도니프티50",
    category: "신흥국/인도",
    basePrice: 17300,
    volatility: 0.20,
    baseDrift: 0.16,
    description: "세계 1위 인구 대국이자 고성장 신흥 경제 대국인 인도의 Nifty 50 지수 추종 ETF",
    tags: ["인도경제", "모디노믹스", "제조업부흥", "신흥국성장"],
    color: "#f97316",
    icon: "fa-landmark"
  },
  {
    id: "ETF_SP500",
    symbol: "360200",
    name: "ACE 미국S&P500",
    category: "미국대형지수",
    basePrice: 18900,
    volatility: 0.16,
    baseDrift: 0.12,
    description: "미국 시장을 대표하는 500개 우량 대기업에 분산 투자하는 글로벌 스탠다드 ETF",
    tags: ["미국우량주", "자산배분", "안정성장", "달러자산"],
    color: "#2563eb",
    icon: "fa-flag-usa"
  },
  {
    id: "ETF_BOND",
    symbol: "453850",
    name: "ACE 미국30년국채액티브",
    category: "채권/안전자산",
    basePrice: 8950,
    volatility: 0.17,
    baseDrift: 0.06,
    description: "미국 연준(Fed) 기준금리 인하 사이클에 따른 자본차익과 월분배금을 추구하는 장기채 ETF",
    tags: ["금리인하", "안전자산", "듀레이션", "월배당"],
    color: "#64748b",
    icon: "fa-file-invoice-dollar"
  },
  {
    id: "ETF_GOLD",
    symbol: "132030",
    name: "KODEX 골드선물(H)",
    category: "원자재/안전자산",
    basePrice: 15400,
    volatility: 0.19,
    baseDrift: 0.11,
    description: "글로벌 지정학적 리스크 및 인플레이션 헤지 수단인 국제 금 선물 가격을 추종하는 ETF",
    tags: ["금", "인플레이션헤지", "안전자산", "지정학헤지"],
    color: "#eab308",
    icon: "fa-gem"
  },
  {
    id: "ETF_ROBOT",
    symbol: "449180",
    name: "KODEX 로봇&인공지능",
    category: "로봇/오토메이션",
    basePrice: 13800,
    volatility: 0.36,
    baseDrift: 0.17,
    description: "레인보우로보틱스, 두산로보틱스 등 휴머노이드, 협동로봇 및 스마트 팩토리 핵심주 ETF",
    tags: ["휴머노이드", "협동로봇", "스마트팩토리", "자동화"],
    color: "#a855f7",
    icon: "fa-robot"
  },
  {
    id: "ETF_ENTER",
    symbol: "228820",
    name: "TIGER K-엔터테인먼트",
    category: "콘텐츠/미디어",
    basePrice: 7800,
    volatility: 0.33,
    baseDrift: 0.11,
    description: "하이브, SM, JYP, 와이지 등 글로벌 K-POP 팬덤 및 K-드라마 글로벌 플랫폼 진출 수혜 ETF",
    tags: ["K-POP", "월드투어", "음원수익", "팬덤플랫폼"],
    color: "#f43f5e",
    icon: "fa-music"
  },
  {
    id: "ETF_CLEAN",
    symbol: "377990",
    name: "KODEX 친환경에너지",
    category: "신재생/기후테크",
    basePrice: 11200,
    volatility: 0.39,
    baseDrift: 0.07,
    description: "태양광, 풍력, 수소 등 글로벌 친환경 에너지 전환 정책 및 인프라 구축 관련 기업 ETF",
    tags: ["풍력", "태양광", "그린수소", "기후협약"],
    color: "#22c55e",
    icon: "fa-leaf"
  },
  {
    id: "ETF_REITS",
    symbol: "182490",
    name: "TIGER 미국MSCI리츠",
    category: "부동산/리츠",
    basePrice: 12600,
    volatility: 0.15,
    baseDrift: 0.08,
    description: "미국 통신타워, 데이터센터, 물류창고 등 상업용 부동산 리츠에 투자하는 월배당 ETF",
    tags: ["데이터센터리츠", "부동산배당", "인프라", "금리수혜"],
    color: "#059669",
    icon: "fa-building"
  },
  {
    id: "ETF_COPPER",
    symbol: "138910",
    name: "TIGER 구리실물",
    category: "원자재/금속",
    basePrice: 9400,
    volatility: 0.27,
    baseDrift: 0.13,
    description: "AI 데이터센터 전력망 및 전기차 충전 인프라의 필수 핵심 원자재인 닥터 코퍼(구리) 실물 추종 ETF",
    tags: ["닥터코퍼", "전력망수요", "구리공급부족", "원자재슈퍼사이클"],
    color: "#d97706",
    icon: "fa-cubes"
  },
  {
    id: "ETF_CRYPTO",
    symbol: "475580",
    name: "TIGER 디지털자산테마",
    category: "가상자산/블록체인",
    basePrice: 16500,
    volatility: 0.55,      // 고변동성 55%
    baseDrift: 0.26,
    description: "미국 비트코인/이더리움 현물 ETF 승인 생태계 및 채굴/블록체인 인프라 혁신 기업 ETF",
    tags: ["비트코인", "반감기효과", "디지털금", "기관자금유입"],
    color: "#f59e0b",
    icon: "fa-bitcoin-sign"
  }
];

if (typeof window !== "undefined") {
  window.STOCK_DATA = STOCK_DATA;
}
