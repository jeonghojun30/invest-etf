/**
 * 12개 핵심 ETF 종목 데이터 및 시뮬레이션 설정
 * UI 표시 이름 업데이트 (코스피 ETF, 반도체 ETF, 나스닥 ETF 등 직관적 명칭)
 */
const STOCK_DATA = [
  {
    id: "ETF_KOSPI200",
    symbol: "069500",
    name: "코스피 ETF",
    category: "국내대표지수",
    basePrice: 36500,
    volatility: 0.17,      // 연간 변동성 17%
    baseDrift: 0.08,       // 연간 기대수익률 8%
    description: "대한민국 유가증권시장(KOSPI)을 대표하는 핵심 200대 우량 기업에 분산 투자하는 대표 지수 ETF",
    tags: ["코스피", "시장대표", "대형주", "밸류업"],
    color: "#10b981",
    icon: "fa-chart-line"
  },
  {
    id: "ETF_SEMI",
    symbol: "091160",
    name: "반도체 ETF",
    category: "반도체/IT",
    basePrice: 38500,
    volatility: 0.32,
    baseDrift: 0.18,
    description: "삼성전자, SK하이닉스 등 국내 대표 반도체 소부장 및 메모리 밸류체인에 집중 투자하는 ETF",
    tags: ["HBM", "AI가속기", "소부장", "메모리슈퍼사이클"],
    color: "#3b82f6",
    icon: "fa-microchip"
  },
  {
    id: "ETF_NASDAQ",
    symbol: "133690",
    name: "나스닥 ETF",
    category: "해외지수/빅테크",
    basePrice: 98000,
    volatility: 0.24,
    baseDrift: 0.15,
    description: "미국 나스닥 시장의 글로벌 기술주 및 혁신 성장 기업 200개 종목에 분산 투자하는 대표 ETF",
    tags: ["글로벌테크", "AI", "클라우드", "혁신성장"],
    color: "#6366f1",
    icon: "fa-globe"
  },
  {
    id: "ETF_BIGTECH",
    symbol: "472150",
    name: "빅테크 ETF",
    category: "글로벌AI/테크",
    basePrice: 19500,
    volatility: 0.26,
    baseDrift: 0.20,
    description: "엔비디아, 마이크로소프트, 애플, 알파벳, 아마존, 메타 등 매그니피센트7(M7) 집중 투자 ETF",
    tags: ["M7", "생성형AI", "GPU", "클라우드"],
    color: "#8b5cf6",
    icon: "fa-network-wired"
  },
  {
    id: "ETF_SHIP",
    symbol: "444450",
    name: "조선 ETF",
    category: "조선/중공업",
    basePrice: 16800,
    volatility: 0.35,
    baseDrift: 0.22,
    description: "HD현대중공업, 한화오션, 삼성중공업 등 친환경 LNG선 및 초대형 선박 수주 슈퍼사이클 수혜 ETF",
    tags: ["LNG선", "친환경선박", "조선수주", "해운운임"],
    color: "#0ea5e9",
    icon: "fa-ship"
  },
  {
    id: "ETF_DEFENSE",
    symbol: "449450",
    name: "방산 ETF",
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
    id: "ETF_NUCLEAR",
    symbol: "433870",
    name: "원자력 ETF",
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
    id: "ETF_ROBOT",
    symbol: "449180",
    name: "인공지능 ETF",
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
    id: "ETF_BIO",
    symbol: "364960",
    name: "바이오 ETF",
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
    id: "ETF_ENTER",
    symbol: "228820",
    name: "K POP ETF",
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
    name: "친환경에너지 ETF",
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
    id: "ETF_BOND",
    symbol: "453850",
    name: "미 국채 ETF",
    category: "채권/안전자산",
    basePrice: 8950,
    volatility: 0.17,
    baseDrift: 0.06,
    description: "미국 연준(Fed) 기준금리 인하 사이클에 따른 자본차익과 월분배금을 추구하는 장기채 ETF",
    tags: ["금리인하", "안전자산", "듀레이션", "월배당"],
    color: "#64748b",
    icon: "fa-file-invoice-dollar"
  }
];

if (typeof window !== "undefined") {
  window.STOCK_DATA = STOCK_DATA;
}
