/**
 * 2025년 9월 ~ 2026년 9월 타임라인 뉴스 이벤트 데이터 (30개)
 * 초등학생 고학년도 바로 이해할 수 있는 쉽고 재미있는 뉴스 표현
 */
const NEWS_EVENTS = [
  {
    id: "NEWS_01",
    date: "2025-09-08",
    progress: 0.02,
    headline: "우리나라 AI 반도체, 세계 1등 기업에 엄청난 양 수출 계약!",
    summary: "세계에서 가장 유명한 IT 기업이 우리나라가 만든 똑똑한 AI 반도체를 잔뜩 사 가기로 도장을 찍었습니다.",
    impacts: { "ETF_SEMI": 0.075, "ETF_BIGTECH": 0.035, "ETF_KOSPI200": 0.025 },
    category: "반도체",
    importance: "HIGH"
  },
  {
    id: "NEWS_02",
    date: "2025-09-18",
    progress: 0.05,
    headline: "미국 은행이 이자를 낮춰서 기업들이 돈 빌리기 쉬워졌어요!",
    summary: "미국 중앙은행이 금리를 내리면서, 기업들이 새로운 기술 개발에 돈을 더 많이 쓸 수 있게 되었습니다.",
    impacts: { "ETF_BOND": 0.050, "ETF_NASDAQ": 0.035, "ETF_KOSPI200": 0.020 },
    category: "경제",
    importance: "HIGH"
  },
  {
    id: "NEWS_03",
    date: "2025-10-02",
    progress: 0.09,
    headline: "바다 건너 유럽에서 한국 조선소에 거대한 친환경 배 10척 주문!",
    summary: "바다를 오염시키지 않는 한국의 첨단 가스 운반선이 세계 최고 인기를 끌며 3년 치 일감이 꽉 찼습니다.",
    impacts: { "ETF_SHIP": 0.085, "ETF_KOSPI200": 0.022 },
    category: "조선",
    importance: "HIGH"
  },
  {
    id: "NEWS_04",
    date: "2025-10-18",
    progress: 0.12,
    headline: "튼튼하고 빠른 한국산 탱크와 자주포, 유럽 국가와 대형 계약!",
    summary: "품질도 좋고 약속한 날짜에 바로 배달해 주는 한국의 방산 무기들이 외국에서 큰 인기를 얻고 있습니다.",
    impacts: { "ETF_DEFENSE": 0.080, "ETF_KOSPI200": 0.018 },
    category: "방산",
    importance: "HIGH"
  },
  {
    id: "NEWS_05",
    date: "2025-11-01",
    progress: 0.16,
    headline: "사람처럼 말하고 스스로 공부하는 똑똑한 AI 로봇 비서 출시!",
    summary: "숙제도 도와주고 복잡한 컴퓨터 코딩도 1초 만에 해내는 인공지능이 나와서 전 세계가 깜짝 놀랐습니다.",
    impacts: { "ETF_BIGTECH": 0.070, "ETF_NASDAQ": 0.045, "ETF_ROBOT": 0.060 },
    category: "인공지능",
    importance: "HIGH"
  },
  {
    id: "NEWS_06",
    date: "2025-11-15",
    progress: 0.19,
    headline: "전기 절약하는 착한 태양광·바람 발전소에 전 세계 지원금 펑펑!",
    summary: "지구 온난화를 막기 위해 깨끗한 햇빛과 바람으로 전기를 만드는 친환경 에너지에 정부들이 큰돈을 지원합니다.",
    impacts: { "ETF_CLEAN": 0.075 },
    category: "친환경",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_07",
    date: "2025-12-01",
    progress: 0.23,
    headline: "유럽 체코에 안전하고 깨끗한 한국형 원자력 발전소 짓기로 최종 결정!",
    summary: "세계 여러 나라와 치열하게 경쟁한 끝에, 한국이 원자력 발전소를 가장 잘 짓는 나라로 인정받았습니다.",
    impacts: { "ETF_NUCLEAR": 0.095, "ETF_KOSPI200": 0.024 },
    category: "원자력",
    importance: "HIGH"
  },
  {
    id: "NEWS_08",
    date: "2025-12-16",
    progress: 0.26,
    headline: "살 쏙 빠지고 몸 건강해지는 마법 같은 한국 비만 치료 약 소식!",
    summary: "부작용이 거의 없이 건강하게 체중을 줄여주는 신약이 시험에서 대성공하여 전 세계 병원들의 관심을 받고 있습니다.",
    impacts: { "ETF_BIO": 0.088 },
    category: "바이오",
    importance: "HIGH"
  },
  {
    id: "NEWS_09",
    date: "2026-01-05",
    progress: 0.30,
    headline: "K-POP 인기 아이돌 그룹, 미국 스타디움 월드투어 티켓 1분 매진!",
    summary: "전 세계 팬들이 몰려 콘서트 표가 순식간에 다 팔렸고, 음원 사이트 1위를 휩쓸며 엄청난 돈을 벌어들였습니다.",
    impacts: { "ETF_ENTER": 0.085 },
    category: "K-POP",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_10",
    date: "2026-01-20",
    progress: 0.33,
    headline: "공장에서 물건 척척 나르는 휴머노이드 로봇, 대량 생산 시작!",
    summary: "두 발로 걷고 사람 손처럼 물건을 집는 똑똑한 로봇들이 자동차와 전자제품 공장에 일꾼으로 투입됩니다.",
    impacts: { "ETF_ROBOT": 0.082, "ETF_SEMI": 0.035 },
    category: "로봇",
    importance: "HIGH"
  },
  {
    id: "NEWS_11",
    date: "2026-02-05",
    progress: 0.37,
    headline: "전 세계 나라들이 '가장 안전한 미국 국채 사 모으자' 열풍!",
    summary: "경제 불안을 피하려는 큰손 투자자들이 미국 정부가 보증하는 안전한 채권을 마구 사들이고 있습니다.",
    impacts: { "ETF_BOND": 0.055, "ETF_NASDAQ": 0.025 },
    category: "채권",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_12",
    date: "2026-02-20",
    progress: 0.40,
    headline: "한국의 대표 200대 기업들, 주주들에게 보너스 배당 듬뿍 준다 발표!",
    summary: "기업들이 돈을 많이 벌어서 주식을 가진 사람들에게 보너스를 나눠주겠다고 약속하자 주식 시장에 돈이 몰렸습니다.",
    impacts: { "ETF_KOSPI200": 0.050, "ETF_SEMI": 0.030 },
    category: "코스피",
    importance: "HIGH"
  },
  {
    id: "NEWS_13",
    date: "2026-03-05",
    progress: 0.44,
    headline: "세계적인 컴퓨터 클라우드 서버에 한국산 초고속 메모리 필수 장착!",
    summary: "유튜브와 넷플릭스를 빠르게 돌리려면 한국 반도체가 꼭 필요하다는 소식에 주문이 밀려들고 있습니다.",
    impacts: { "ETF_SEMI": 0.070, "ETF_BIGTECH": 0.032 },
    category: "반도체",
    importance: "HIGH"
  },
  {
    id: "NEWS_14",
    date: "2026-03-18",
    progress: 0.47,
    headline: "바다 바람으로 만드는 거대 해상풍력 발전소, 전 세계 바다에 건설!",
    summary: "기름을 태우지 않고 바닷바람만으로 깨끗한 전기를 만들어내는 친환경 터빈이 곳곳에 세워지고 있습니다.",
    impacts: { "ETF_CLEAN": 0.072 },
    category: "친환경",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_15",
    date: "2026-04-01",
    progress: 0.50,
    headline: "한국 조선소의 용접·조립 기술력 세계 최고! 배 만드는 값 껑충 상승!",
    summary: "다른 나라 조선소보다 배를 훨씬 튼튼하고 빠르게 만들어 비싼 값을 주고도 한국에 배를 만들어달라고 줄을 섭니다.",
    impacts: { "ETF_SHIP": 0.080, "ETF_KOSPI200": 0.020 },
    category: "조선",
    importance: "HIGH"
  },
  {
    id: "NEWS_16",
    date: "2026-04-15",
    progress: 0.54,
    headline: "세계 7대 거대 빅테크 기업들, 깜짝 놀랄 분기 실적 발표!",
    summary: "애플, 구글, 마이크로소프트 등이 역대 가장 많은 돈을 벌었다고 발표하면서 기술주 주가가 힘차게 뛰었습니다.",
    impacts: { "ETF_BIGTECH": 0.075, "ETF_NASDAQ": 0.052 },
    category: "빅테크",
    importance: "HIGH"
  },
  {
    id: "NEWS_17",
    date: "2026-05-01",
    progress: 0.57,
    headline: "인공지능 컴퓨터가 전기를 너무 많이 먹어요! 작고 안전한 '미니 원전' 뜬다!",
    summary: "AI 데이터센터에 24시간 끊김 없이 깨끗한 전기를 줄 수 있는 작은 모듈형 원자력 발전소(SMR)가 큰 인기입니다.",
    impacts: { "ETF_NUCLEAR": 0.085, "ETF_BIGTECH": 0.025 },
    category: "원자력",
    importance: "HIGH"
  },
  {
    id: "NEWS_18",
    date: "2026-05-15",
    progress: 0.60,
    headline: "한국산 미사일 요격 방어 시스템, 중동 국가에 수출 대박!",
    summary: "하늘에서 날아오는 위협을 정확하게 맞추는 국산 방공 무기가 해외 시험 평가에서 만점을 받았습니다.",
    impacts: { "ETF_DEFENSE": 0.075, "ETF_KOSPI200": 0.018 },
    category: "방산",
    importance: "HIGH"
  },
  {
    id: "NEWS_19",
    date: "2026-05-28",
    progress: 0.64,
    headline: "한국 제약회사가 만든 암 치료 신약, 미국 FDA 허가 통과 임박!",
    summary: "암세포만 쏙쏙 찾아가서 없애주는 똑똑한 치료제 연구가 막바지 단계에 접어들며 희망을 주고 있습니다.",
    impacts: { "ETF_BIO": 0.082, "ETF_KOSPI200": 0.015 },
    category: "바이오",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_20",
    date: "2026-06-10",
    progress: 0.67,
    headline: "식당과 병원에서 사람 대신 서빙하고 안내하는 귀여운 AI 로봇 급증!",
    summary: "우리 생활 주변에서 로봇을 마주치는 일이 자연스러워지면서 로봇 서비스 산업이 빠르게 커지고 있습니다.",
    impacts: { "ETF_ROBOT": 0.076 },
    category: "로봇",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_21",
    date: "2026-06-22",
    progress: 0.71,
    headline: "K-드라마와 예능, 글로벌 OTT 1위 싹쓸이... K-콘텐츠 열풍!",
    summary: "전 세계 사람들이 한국 음악을 듣고 한국 드라마를 보면서 K-컬처 관련 회사들의 수입이 크게 늘어났습니다.",
    impacts: { "ETF_ENTER": 0.078 },
    category: "K-POP",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_22",
    date: "2026-07-05",
    progress: 0.74,
    headline: "차세대 HBM4 초고속 반도체 완성! '속도가 2배 빨라졌어요'",
    summary: "우리나라 연구원들이 세계에서 가장 빠른 반도체를 만들어내며 2등과의 기술 차이를 더 크게 벌렸습니다.",
    impacts: { "ETF_SEMI": 0.082, "ETF_KOSPI200": 0.035 },
    category: "반도체",
    importance: "HIGH"
  },
  {
    id: "NEWS_23",
    date: "2026-07-16",
    progress: 0.78,
    headline: "한국 조선사, 미래형 수소 운반선 세계 최초 계약 따냈다!",
    summary: "화석연료 대신 미래 청정에너지인 수소를 싣고 달리는 최첨단 배를 한국이 세계에서 제일 먼저 만듭니다.",
    impacts: { "ETF_SHIP": 0.074, "ETF_CLEAN": 0.030 },
    category: "조선",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_24",
    date: "2026-07-28",
    progress: 0.81,
    headline: "미국 나스닥 기술주들, 사상 최고 기록 깨며 파죽지세 랠리!",
    summary: "인공지능과 자율주행, 로봇을 만드는 미국 첨단 혁신 기업들에 전 세계 투자자들의 돈이 쏟아지고 있습니다.",
    impacts: { "ETF_NASDAQ": 0.055, "ETF_BIGTECH": 0.045 },
    category: "나스닥",
    importance: "HIGH"
  },
  {
    id: "NEWS_25",
    date: "2026-08-05",
    progress: 0.85,
    headline: "기후 협약 강화로 석탄 발전소 줄이고 햇빛·바람 전기 사용 의무화!",
    summary: "지구를 지키기 위해 석탄 대신 친환경 전기를 꼭 써야 한다는 약속이 정해지며 친환경 발전 기업들이 활짝 웃었습니다.",
    impacts: { "ETF_CLEAN": 0.076 },
    category: "친환경",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_26",
    date: "2026-08-12",
    progress: 0.88,
    headline: "세계적인 평화 유지 위해 한국산 장갑차와 헬기 추가 주문 줄이어!",
    summary: "성능이 뛰어나고 고장도 잘 안 나는 한국의 방산 장비들이 전 세계 국방 전시회에서 최고 인기 스타가 되었습니다.",
    impacts: { "ETF_DEFENSE": 0.072, "ETF_KOSPI200": 0.020 },
    category: "방산",
    importance: "HIGH"
  },
  {
    id: "NEWS_27",
    date: "2026-08-18",
    progress: 0.91,
    headline: "원자력 발전소 부품 만드는 한국 중소기업들, 공장 24시간 풀가동!",
    summary: "해외에서 원전 공사 주문이 쏟아져 들어오면서 전선, 변압기, 밸브를 만드는 공장들이 쉴 틈 없이 돌아갑니다.",
    impacts: { "ETF_NUCLEAR": 0.080, "ETF_KOSPI200": 0.025 },
    category: "원자력",
    importance: "MEDIUM"
  },
  {
    id: "NEWS_28",
    date: "2026-08-23",
    progress: 0.94,
    headline: "물가 걱정 끝! 세계 경제가 무사히 안정권에 들어섰어요!",
    summary: "물건 가격이 오르는 속도가 안정되고 일자리가 풍부해지면서 주식 시장 전반에 활기가 돌고 있습니다.",
    impacts: { "ETF_KOSPI200": 0.042, "ETF_NASDAQ": 0.045, "ETF_BOND": 0.030 },
    category: "경제",
    importance: "HIGH"
  },
  {
    id: "NEWS_29",
    date: "2026-08-27",
    progress: 0.96,
    headline: "한국 주식 시장의 날개! 코스피 우량 기업들 연간 실적 대풍년!",
    summary: "반도체, 조선, 방산, 인공지능이 모두 좋은 성적표를 받으면서 코스피 지수가 힘차게 치솟았습니다.",
    impacts: { "ETF_KOSPI200": 0.048, "ETF_SEMI": 0.040, "ETF_SHIP": 0.035 },
    category: "코스피",
    importance: "HIGH"
  },
  {
    id: "NEWS_30",
    date: "2026-08-31",
    progress: 0.99,
    headline: "1년 동안의 모의투자 결산: 똑똑한 미래 기술에 투자한 사람이 승자!",
    summary: "지난 1년 동안 실력이 튼튼하고 미래를 바꿀 기술을 가진 ETF에 투자한 투자자들이 큰 기쁨을 맛보았습니다.",
    impacts: { "ETF_KOSPI200": 0.030, "ETF_BIGTECH": 0.035, "ETF_SEMI": 0.030, "ETF_ROBOT": 0.030 },
    category: "결산",
    importance: "HIGH"
  }
];

if (typeof window !== "undefined") {
  NEWS_EVENTS.sort((a, b) => a.progress - b.progress);
  window.NEWS_EVENTS = NEWS_EVENTS;
}
