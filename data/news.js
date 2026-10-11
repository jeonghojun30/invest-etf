/**
 * 2025년 9월 ~ 2026년 9월 타임라인 뉴스 이벤트 데이터
 * 진행 시점(monthIndex: 0~12 또는 timeProgress: 0.0~1.0)에 맞춰 발생
 */
const NEWS_EVENTS = [
  {
    id: "NEWS_01",
    date: "2025-09-12",
    progress: 0.03,
    headline: "글로벌 빅테크 차세대 6세대 HBM 독점 공급 계약 체결",
    summary: "국내 선두 반도체 기업이 빅테크 기업과 차세대 초고대역폭 메모리 공급 계약을 성사시키며 실적 가시성을 확보했습니다.",
    impacts: {
      "ETF_SEMI": 0.065,
      "ETF_BIGTECH": 0.032,
      "ETF_KOSPI": 0.021
    },
    category: "반도체/IT",
    importance: "HIGH"
  },
  {
    id: "NEWS_02",
    date: "2025-09-28",
    progress: 0.07,
    headline: "미국 연준(Fed) FOMC 기준금리 0.25%p 인하 단행",
    summary: "인플레이션 둔화와 고용 안정에 힘입어 연준이 완화적 통화정책 사이클을 재확인했습니다.",
    impacts: {
      "ETF_BOND": 0.045,
      "ETF_NASDAQ": 0.028,
      "ETF_REITS": 0.038,
      "ETF_CRYPTO": 0.055
    },
    category: "거시경제",
    importance: "HIGH"
  },
  {
    id: "NEWS_03",
    date: "2025-10-15",
    progress: 0.12,
    headline: "카타르 및 유럽발 초대형 친환경 LNG선 12척 패키지 수주 잭팟",
    summary: "K-조선사들이 압도적인 기술 격차를 바탕으로 고부가가치 선박을 독식하며 3년치 건조 독(Dock)을 가득 채웠습니다.",
    impacts: {
      "ETF_SHIP": 0.082,
      "ETF_KOSPI": 0.018
    },
    category: "조선/중공업",
    importance: "HIGH"
  },
  {
    id: "NEWS_04",
    date: "2025-11-02",
    progress: 0.16,
    headline: "동유럽 및 중동 국가, K-방산 차세대 자주포 및 유도무기 5조원대 계약",
    summary: "우수한 가성비와 신속한 납기 경쟁력을 앞세워 글로벌 방산 시장 점유율 4위권 도약에 청신호가 켜졌습니다.",
    impacts: {
      "ETF_DEFENSE": 0.075,
      "ETF_KOSPI": 0.015
    },
    category: "방위산업",
    importance: "HIGH"
  },
  {
    id: "NEWS_05",
    date: "2025-11-20",
    progress: 0.21,
    headline: "글로벌 전기차 판매 성장세 둔화 우려... 배터리 원자재 재고 조정",
    summary: "유럽 및 북미 보조금 축소와 얼리어답터 수요 포화로 인해 단기적인 캐즘(Chasm) 우려가 고조되었습니다.",
    impacts: {
      "ETF_BATTERY": -0.065,
      "ETF_CLEAN": -0.035
    },
    category: "2차전지",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_06",
    date: "2025-12-08",
    progress: 0.26,
    headline: "오픈AI & 빅테크 진영, 차세대 자율형 AI 에이전트 전격 발표",
    summary: "스스로 코딩하고 업무를 완수하는 범용 인공지능(AGI) 초기 모델이 상용화되면서 테크주 전반에 강력한 매수세가 유입되었습니다.",
    impacts: {
      "ETF_BIGTECH": 0.072,
      "ETF_NASDAQ": 0.048,
      "ETF_ROBOT": 0.055
    },
    category: "AI/소프트웨어",
    importance: "HIGH"
  },
  {
    id: "NEWS_07",
    date: "2025-12-24",
    progress: 0.31,
    headline: "체코 및 폴란드 후속 원전 본계약 최종 서명 완료",
    summary: "유럽 원전 르네상스 국면에서 Team Korea가 압도적 공기 준수 역량을 인정받으며 최종 수주를 확정지었습니다.",
    impacts: {
      "ETF_NUCLEAR": 0.095,
      "ETF_KOSPI": 0.024
    },
    category: "원자력/인프라",
    importance: "HIGH"
  },
  {
    id: "NEWS_08",
    date: "2026-01-14",
    progress: 0.36,
    headline: "글로벌 비트코인 현물 ETF 기관 자금 유입 사상 최대치 돌파",
    summary: "연기금과 헤지펀드의 대체자산 포트폴리오 편입이 가속화되며 디지털 자산 시장이 전고점을 돌파했습니다.",
    impacts: {
      "ETF_CRYPTO": 0.125,
      "ETF_NASDAQ": 0.022
    },
    category: "가상자산",
    importance: "HIGH"
  },
  {
    id: "NEWS_09",
    date: "2026-01-29",
    progress: 0.40,
    headline: "K-바이오 차세대 비만치료제 글로벌 임상 3상 성공적 중간결과 발표",
    summary: "부작용을 대폭 낮추고 지속 기간을 늘린 국산 파이프라인의 조단위 기술수출(L/O) 기대감이 폭발했습니다.",
    impacts: {
      "ETF_BIO": 0.088
    },
    category: "바이오/헬스",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_10",
    date: "2026-02-18",
    progress: 0.45,
    headline: "인도 GDP 성장률 7.8% 기록... 글로벌 제조 허브로 급부상",
    summary: "글로벌 공급망 다변화 정책 수혜로 인도 시장에 외국인 직접투자(FDI)가 쏟아지고 있습니다.",
    impacts: {
      "ETF_INDIA": 0.058
    },
    category: "신흥국",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_11",
    date: "2026-03-05",
    progress: 0.50,
    headline: "중동 지역 지정학적 긴장 고조... 안전자산 금(Gold) 사상 최고가 경신",
    summary: "원자재 공급망 불안과 화폐 가치 방어 심리로 인해 금과 구리 등 실물 자산으로 자금이 집중되고 있습니다.",
    impacts: {
      "ETF_GOLD": 0.072,
      "ETF_COPPER": 0.045,
      "ETF_NASDAQ": -0.025,
      "ETF_SP500": -0.018
    },
    category: "원자재/지정학",
    importance: "HIGH"
  },
  {
    id: "NEWS_12",
    date: "2026-03-22",
    progress: 0.55,
    headline: "국내 기업 밸류업 프로그램 2단계 세제 혜택 법안 국회 통과",
    summary: "배당소득 분리과세와 자사주 소각 유도 정책이 본격화되며 고배당주와 금융 지주사들이 재평가받고 있습니다.",
    impacts: {
      "ETF_DIVIDEND": 0.068,
      "ETF_KOSPI": 0.035
    },
    category: "국내증시",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_13",
    date: "2026-04-10",
    progress: 0.60,
    headline: "글로벌 완성차 메이저, 테슬라와 레벨4 자율주행 라이선스 제휴",
    summary: "휴머노이드 로봇과 무인 로보택시 상용화 일정이 앞당겨지며 로봇 및 모빌리티 생태계에 자금이 쏠렸습니다.",
    impacts: {
      "ETF_ROBOT": 0.084,
      "ETF_BIGTECH": 0.038
    },
    category: "로봇/AI",
    importance: "HIGH"
  },
  {
    id: "NEWS_14",
    date: "2026-04-28",
    progress: 0.65,
    headline: "AI 데이터센터 전력난 심화... 구리 및 전력망 기기 공급 품귀 현상",
    summary: "데이터센터 전력 인프라 교체 주기와 맞물려 닥터 코퍼 가격이 가파른 상승세를 보이고 있습니다.",
    impacts: {
      "ETF_COPPER": 0.092,
      "ETF_NUCLEAR": 0.045
    },
    category: "원자재",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_15",
    date: "2026-05-15",
    progress: 0.70,
    headline: "K-POP 대표 걸그룹/보이그룹 월드투어 전석 매진 및 스타디움 투어 확대",
    summary: "글로벌 음원 스트리밍 매출과 MD 굿즈 판매량이 역대 분기 최고치를 달성했습니다.",
    impacts: {
      "ETF_ENTER": 0.078
    },
    category: "엔터/미디어",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_16",
    date: "2026-06-02",
    progress: 0.75,
    headline: "2차전지 전고체 배터리 파일럿 라인 가동... 기술 혁신 본격화",
    summary: "화재 위험을 근본적으로 차단하고 에너지 밀도를 획기적으로 높인 차세대 배터리가 시운전에 돌입했습니다.",
    impacts: {
      "ETF_BATTERY": 0.089,
      "ETF_CLEAN": 0.034
    },
    category: "2차전지",
    importance: "HIGH"
  },
  {
    id: "NEWS_17",
    date: "2026-06-25",
    progress: 0.81,
    headline: "미국 및 유럽 상업용 데이터센터 리츠 임대료 20% 인상 발표",
    summary: "AI 워크로드 증가로 고성능 데이터센터 공간 임대 수요가 공급을 크게 초과하고 있습니다.",
    impacts: {
      "ETF_REITS": 0.052,
      "ETF_BIGTECH": -0.012
    },
    category: "리츠/부동산",
    importance: "LOW"
  },
  {
    id: "NEWS_18",
    date: "2026-07-18",
    progress: 0.87,
    headline: "글로벌 기상이변에 따른 친환경 에너지 의무화 정책 강화",
    summary: "유럽연합 탄소국경조정제도(CBAM) 전면 시행으로 태양광 및 해상풍력 프로젝트 투자가 급증했습니다.",
    impacts: {
      "ETF_CLEAN": 0.082
    },
    category: "친환경",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_19",
    date: "2026-08-08",
    progress: 0.93,
    headline: "미국 대선 전후 불확실성 완화 및 경제 연착륙(Soft Landing) 공식 선언",
    summary: "소비 지표 호조와 물가 안정에 힘입어 글로벌 증시가 동반 사상 최고치를 향해 랠리를 펼치고 있습니다.",
    impacts: {
      "ETF_SP500": 0.042,
      "ETF_NASDAQ": 0.051,
      "ETF_KOSPI": 0.038
    },
    category: "글로벌거시",
    importance: "HIGH"
  },
  {
    id: "NEWS_20",
    date: "2026-08-28",
    progress: 0.98,
    headline: "1년 결산: 한국 및 미국 혁신 기술주 ETF 연간 수익률 대축제",
    summary: "반도체, AI, 방산, 조선 등 실적이 뒷받침된 주도 섹터들이 2025~2026 시장을 완벽하게 주도했습니다.",
    impacts: {
      "ETF_SEMI": 0.035,
      "ETF_SHIP": 0.031,
      "ETF_DEFENSE": 0.030,
      "ETF_BIGTECH": 0.028
    },
    category: "결산종합",
    importance: "HIGH"
  }
];

if (typeof window !== "undefined") {
  NEWS_EVENTS.sort((a, b) => a.progress - b.progress);
  window.NEWS_EVENTS = NEWS_EVENTS;
}
