/**
 * 트레이딩 및 포트폴리오 자산 관리 엔진
 */
class TradingAccount {
  constructor(initialCapital = 10000000) {
    this.initialCapital = initialCapital;
    this.cash = initialCapital;
    
    // 보유 종목 맵: { stockId: { stockId, symbol, name, quantity, avgPrice, totalCost } }
    this.holdings = {};
    
    // 체결 내역 히스토리: [{ id, timeStr, stockId, stockName, type: 'BUY'|'SELL', price, quantity, amount, fee }]
    this.orderHistory = [];
    
    // 거래 수수료율 (0.015%), 매도시 증권거래세 (0.18%)
    this.feeRate = 0.00015;
    this.taxRate = 0.0018;

    // 실현 손익
    this.realizedPnL = 0;
  }

  // 매수 주문 실행
  buy(stock, quantity, simDateStr) {
    if (quantity <= 0) return { success: false, message: "매수 수량을 1주 이상 입력해주세요." };
    
    const price = stock.currentPrice;
    const grossAmount = price * quantity;
    const fee = Math.floor(grossAmount * this.feeRate);
    const totalCost = grossAmount + fee;

    if (totalCost > this.cash) {
      return { 
        success: false, 
        message: `현금 잔고가 부족합니다. (필요: ${totalCost.toLocaleString()}원, 보유: ${Math.floor(this.cash).toLocaleString()}원)` 
      };
    }

    // 현금 차감
    this.cash -= totalCost;

    // 보유 종목 업데이트 (이동평균 매입단가 계산)
    if (!this.holdings[stock.id]) {
      this.holdings[stock.id] = {
        stockId: stock.id,
        symbol: stock.symbol,
        name: stock.name,
        category: stock.category,
        quantity: quantity,
        avgPrice: price,
        totalCost: grossAmount
      };
    } else {
      const h = this.holdings[stock.id];
      const newTotalCost = h.totalCost + grossAmount;
      const newQuantity = h.quantity + quantity;
      h.avgPrice = Math.round(newTotalCost / newQuantity);
      h.quantity = newQuantity;
      h.totalCost = newTotalCost;
    }

    // 주문 히스토리 추가
    const orderRecord = {
      id: "ORD_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      timeStr: simDateStr || new Date().toLocaleTimeString(),
      stockId: stock.id,
      stockName: stock.name,
      type: "BUY",
      price: price,
      quantity: quantity,
      amount: grossAmount,
      fee: fee
    };
    this.orderHistory.unshift(orderRecord);

    this.playAudioEffect("buy");

    return {
      success: true,
      message: `${stock.name} ${quantity.toLocaleString()}주 매수 체결 완료 (${Math.round(price).toLocaleString()}원)`
    };
  }

  // 매도 주문 실행
  sell(stock, quantity, simDateStr) {
    if (quantity <= 0) return { success: false, message: "매도 수량을 1주 이상 입력해주세요." };
    
    const h = this.holdings[stock.id];
    if (!h || h.quantity < quantity) {
      const currentQty = h ? h.quantity : 0;
      return { 
        success: false, 
        message: `보유 수량이 부족합니다. (보유: ${currentQty.toLocaleString()}주)` 
      };
    }

    const price = stock.currentPrice;
    const grossAmount = price * quantity;
    const fee = Math.floor(grossAmount * this.feeRate);
    const tax = Math.floor(grossAmount * this.taxRate);
    const netProceeds = grossAmount - fee - tax;

    // 실현 손익 계산
    const costBasis = h.avgPrice * quantity;
    const tradePnL = netProceeds - costBasis;
    this.realizedPnL += tradePnL;

    // 현금 입금
    this.cash += netProceeds;

    // 보유 수량 차감
    h.quantity -= quantity;
    h.totalCost = h.avgPrice * h.quantity;

    if (h.quantity === 0) {
      delete this.holdings[stock.id];
    }

    // 주문 히스토리 추가
    const orderRecord = {
      id: "ORD_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      timeStr: simDateStr || new Date().toLocaleTimeString(),
      stockId: stock.id,
      stockName: stock.name,
      type: "SELL",
      price: price,
      quantity: quantity,
      amount: grossAmount,
      fee: fee + tax,
      pnl: tradePnL
    };
    this.orderHistory.unshift(orderRecord);

    this.playAudioEffect("sell");

    return {
      success: true,
      message: `${stock.name} ${quantity.toLocaleString()}주 매도 체결 완료 (${tradePnL >= 0 ? '+' : ''}${Math.round(tradePnL).toLocaleString()}원 손익)`
    };
  }

  // 포트폴리오 및 전체 자산 가치 계산
  getSummary(stocksMap) {
    let stockValuation = 0;
    let totalCost = 0;
    const enrichedHoldings = [];

    Object.values(this.holdings).forEach(h => {
      const currentStock = stocksMap[h.stockId];
      const currentPrice = currentStock ? currentStock.currentPrice : h.avgPrice;
      const evalAmount = currentPrice * h.quantity;
      const profitLoss = evalAmount - (h.avgPrice * h.quantity);
      const returnRate = ((currentPrice - h.avgPrice) / h.avgPrice) * 100;

      stockValuation += evalAmount;
      totalCost += (h.avgPrice * h.quantity);

      enrichedHoldings.push({
        ...h,
        currentPrice,
        evalAmount,
        profitLoss,
        returnRate
      });
    });

    const totalAssets = this.cash + stockValuation;
    const totalPnL = totalAssets - this.initialCapital;
    const totalReturnRate = ((totalAssets - this.initialCapital) / this.initialCapital) * 100;

    return {
      initialCapital: this.initialCapital,
      cash: this.cash,
      stockValuation,
      totalAssets,
      totalPnL,
      totalReturnRate,
      unrealizedPnL: stockValuation - totalCost,
      realizedPnL: this.realizedPnL,
      holdings: enrichedHoldings,
      holdingCount: enrichedHoldings.length,
      orderCount: this.orderHistory.length
    };
  }

  // 간단한 Web Audio 사운드 효과
  playAudioEffect(type) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "buy") {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "sell") {
        osc.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.18); // C6
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      }
    } catch (e) {
      // AudioContext 정책상 사용자 인터랙션 전 차단 무시
    }
  }
}

if (typeof window !== "undefined") {
  window.TradingAccount = TradingAccount;
}
