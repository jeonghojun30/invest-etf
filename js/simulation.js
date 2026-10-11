/**
 * 주식 시장 시뮬레이션 엔진 (Geometric Brownian Motion + Jump Diffusion)
 * 2025.09.01 ~ 2026.09.01 (1년)의 주가 흐름을 30분(1800초) 동안 실시간 생성
 */
class MarketSimulation {
  constructor(stockData, newsEvents) {
    this.rawStocks = stockData;
    this.newsEvents = newsEvents || [];
    
    // 시뮬레이션 설정
    this.totalDurationSec = 1800; // 30분 (초)
    this.startDate = new Date(2025, 8, 1, 9, 0, 0); // 2025-09-01 09:00:00
    this.endDate = new Date(2026, 8, 1, 15, 30, 0);   // 2026-09-01 15:30:00
    this.totalTimeSpanMs = this.endDate.getTime() - this.startDate.getTime();
    
    // 상태 변수
    this.isRunning = false;
    this.isPaused = false;
    this.elapsedSec = 0;
    this.speedMultiplier = 1; // 기본 1배속 (30분)
    this.timerInterval = null;
    this.tickIntervalMs = 1000; // 1초마다 1틱
    
    // 종목별 런타임 상태
    this.stocks = {};
    this.newsHistory = [];
    this.triggeredNewsIds = new Set();
    this.marketSentiment = 0.0; // 시장 전반 심리 (-0.1 ~ +0.1)
    
    // 콜백
    this.onTickCallbacks = [];
    this.onNewsCallbacks = [];
    this.onCompleteCallbacks = [];
    
    this.initStocks();
  }

  initStocks() {
    this.stocks = {};
    const dt = 1 / 250 / (1800 / 250); // 1틱당 delta T (연단위)

    this.rawStocks.forEach(s => {
      this.stocks[s.id] = {
        ...s,
        currentPrice: s.basePrice,
        openPrice: s.basePrice,
        prevClosePrice: s.basePrice,
        highPrice: s.basePrice,
        lowPrice: s.basePrice,
        volume: Math.floor(Math.random() * 50000 + 20000),
        tradeCount: Math.floor(Math.random() * 1200 + 300),
        changeAmount: 0,
        changeRate: 0,
        totalReturnRate: 0,
        // 차트용 시계열 데이터
        priceHistory: [{
          time: new Date(this.startDate),
          price: s.basePrice,
          dateStr: this.formatDate(this.startDate)
        }],
        // 일별 캔들 데이터 (OHLCV)
        candles: [{
          time: new Date(this.startDate),
          dateStr: this.formatDate(this.startDate),
          open: s.basePrice,
          high: s.basePrice,
          low: s.basePrice,
          close: s.basePrice,
          volume: Math.floor(Math.random() * 50000 + 20000)
        }],
        orderBook: this.generateOrderBook(s.basePrice),
        activeNewsMomentum: 0.0 // 뉴스 충격 잔여 모멘텀
      };
    });
  }

  // 박스-뮬러 변환 (표준정규분포 난수 N(0, 1) 생성)
  generateGaussianNoise() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  // 5단계 호가창 생성
  generateOrderBook(currentPrice) {
    const tickUnit = currentPrice > 50000 ? 100 : (currentPrice > 10000 ? 50 : 10);
    const roundedPrice = Math.round(currentPrice / tickUnit) * tickUnit;
    
    const asks = []; // 매도호가 (위)
    const bids = []; // 매수호가 (아래)
    
    for (let i = 5; i >= 1; i--) {
      asks.push({
        price: roundedPrice + (i * tickUnit),
        amount: Math.floor(Math.random() * 1500 + 300),
        type: 'ask'
      });
    }
    
    for (let i = 1; i <= 5; i++) {
      bids.push({
        price: roundedPrice - (i * tickUnit),
        amount: Math.floor(Math.random() * 1500 + 300),
        type: 'bid'
      });
    }

    return { asks, bids, tickUnit };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    
    const startTime = Date.now() - (this.elapsedSec * 1000 / this.speedMultiplier);
    
    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;
      
      this.elapsedSec += 1 * this.speedMultiplier;
      
      if (this.elapsedSec >= this.totalDurationSec) {
        this.elapsedSec = this.totalDurationSec;
        this.stepSimulation();
        this.stop();
        this.triggerComplete();
        return;
      }
      
      this.stepSimulation();
    }, 1000 / Math.min(this.speedMultiplier, 10));
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  stop() {
    this.isRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
    if (this.isRunning && !this.isPaused) {
      this.stop();
      this.start();
    }
  }

  // 현재 가상 시뮬레이션 날짜 계산
  getCurrentSimDate() {
    const progress = Math.min(1.0, this.elapsedSec / this.totalDurationSec);
    const currentMs = this.startDate.getTime() + (this.totalTimeSpanMs * progress);
    return new Date(currentMs);
  }

  stepSimulation() {
    const progress = this.elapsedSec / this.totalDurationSec;
    const simDate = this.getCurrentSimDate();
    const dt = (1 / 250) * (365 / 1800) * this.speedMultiplier; // 1틱당 가상 시간 증가율

    // 1. 시장 전체 공통 노이즈 (매크로 팩터)
    const marketNoise = this.generateGaussianNoise() * 0.008;
    this.marketSentiment = this.marketSentiment * 0.95 + marketNoise * 0.05;

    // 2. 뉴스 이벤트 확인 및 트리거
    this.checkNewsEvents(progress, simDate);

    // 3. 각 종목별 가격 업데이트 (GBM + Jump)
    Object.values(this.stocks).forEach(stock => {
      const stockNoise = this.generateGaussianNoise();
      
      // 개별 종목 드리프트 & 변동성
      const annualVol = stock.volatility;
      const annualDrift = stock.baseDrift + this.marketSentiment;
      
      // 뉴스 모멘텀 감쇠
      const newsShock = stock.activeNewsMomentum;
      stock.activeNewsMomentum *= 0.88; // 지수 감쇠
      
      // GBM 증분 계산
      const driftTerm = (annualDrift - 0.5 * annualVol * annualVol) * dt;
      const diffusionTerm = annualVol * Math.sqrt(dt) * (0.4 * marketNoise + 0.6 * stockNoise);
      const totalReturn = driftTerm + diffusionTerm + (newsShock * 0.15);
      
      let newPrice = stock.currentPrice * Math.exp(totalReturn);
      // 최소 호가 단위 라운딩
      const tickUnit = newPrice > 50000 ? 100 : (newPrice > 10000 ? 50 : 10);
      newPrice = Math.max(100, Math.round(newPrice / tickUnit) * tickUnit);
      
      stock.currentPrice = newPrice;
      stock.changeAmount = newPrice - stock.basePrice;
      stock.changeRate = ((newPrice - stock.basePrice) / stock.basePrice) * 100;
      stock.totalReturnRate = stock.changeRate;
      
      if (newPrice > stock.highPrice) stock.highPrice = newPrice;
      if (newPrice < stock.lowPrice) stock.lowPrice = newPrice;
      
      // 거래량 증가
      const volumeDelta = Math.floor(Math.abs(stockNoise) * 300 + Math.abs(newsShock) * 2000 + 50);
      stock.volume += volumeDelta;
      stock.tradeCount += Math.floor(volumeDelta / 30) + 1;

      // 호가창 갱신
      stock.orderBook = this.generateOrderBook(newPrice);

      // 시계열 히스토리 기록 (최대 300개 유지)
      stock.priceHistory.push({
        time: new Date(simDate),
        price: newPrice,
        dateStr: this.formatDate(simDate)
      });
      if (stock.priceHistory.length > 300) {
        stock.priceHistory.shift();
      }

      // 캔들스틱 데이터 생성/업데이트 (가상 1일 또는 특정 틱 단위로 캔들 분할)
      const lastCandle = stock.candles[stock.candles.length - 1];
      const simDateStr = this.formatDate(simDate);
      
      if (lastCandle && lastCandle.dateStr === simDateStr) {
        lastCandle.high = Math.max(lastCandle.high, newPrice);
        lastCandle.low = Math.min(lastCandle.low, newPrice);
        lastCandle.close = newPrice;
        lastCandle.volume += volumeDelta;
      } else {
        stock.candles.push({
          time: new Date(simDate),
          dateStr: simDateStr,
          open: newPrice,
          high: newPrice,
          low: newPrice,
          close: newPrice,
          volume: volumeDelta
        });
        if (stock.candles.length > 120) {
          stock.candles.shift();
        }
      }
    });

    // 4. OnTick 콜백 실행
    const state = {
      elapsedSec: this.elapsedSec,
      totalDurationSec: this.totalDurationSec,
      remainingSec: Math.max(0, this.totalDurationSec - this.elapsedSec),
      progress: progress,
      currentSimDate: simDate,
      dateStr: this.formatDate(simDate),
      stocks: this.stocks,
      speedMultiplier: this.speedMultiplier
    };

    this.onTickCallbacks.forEach(cb => cb(state));
  }

  checkNewsEvents(progress, simDate) {
    this.newsEvents.forEach(news => {
      if (!this.triggeredNewsIds.has(news.id) && progress >= news.progress) {
        this.triggeredNewsIds.add(news.id);
        
        // 종목별 충격 주입
        if (news.impacts) {
          Object.entries(news.impacts).forEach(([stockId, impact]) => {
            if (this.stocks[stockId]) {
              this.stocks[stockId].activeNewsMomentum += impact;
            }
          });
        }
        
        const newsItem = {
          ...news,
          triggerDate: simDate,
          triggerDateStr: this.formatDate(simDate)
        };
        
        this.newsHistory.unshift(newsItem);
        this.onNewsCallbacks.forEach(cb => cb(newsItem));
      }
    });
  }

  formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  }

  onTick(callback) {
    this.onTickCallbacks.push(callback);
  }

  onNews(callback) {
    this.onNewsCallbacks.push(callback);
  }

  onComplete(callback) {
    this.onCompleteCallbacks.push(callback);
  }

  triggerComplete() {
    const finalState = {
      simEndDate: this.endDate,
      stocks: this.stocks,
      newsHistory: this.newsHistory
    };
    this.onCompleteCallbacks.forEach(cb => cb(finalState));
  }
}

if (typeof window !== "undefined") {
  window.MarketSimulation = MarketSimulation;
}
