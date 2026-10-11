/**
 * 메인 애플리케이션 컨트롤러
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. 핵심 객체 인스턴스화
  const simulation = new MarketSimulation(window.STOCK_DATA, window.NEWS_EVENTS);
  const account = new TradingAccount(10000000); // 1,000만원
  const chart = new StockChart("mainStockChart");

  // 상태
  let selectedStockId = window.STOCK_DATA[0].id;
  let currentTab = "portfolio"; // "portfolio" | "news" | "history"
  let orderType = "BUY"; // "BUY" | "SELL"

  // 2. DOM 요소 캐싱
  const elStartBtn = document.getElementById("btnStartSim");
  const elPauseBtn = document.getElementById("btnPauseSim");
  const elSpeedSelect = document.getElementById("selectSpeed");
  const elSimDate = document.getElementById("currentSimDate");
  const elTimerDisplay = document.getElementById("timerDisplay");
  const elTimeProgressBar = document.getElementById("timeProgressBar");

  // 상단 자산 표시
  const elTotalAssets = document.getElementById("totalAssets");
  const elTotalPnL = document.getElementById("totalPnL");
  const elTotalReturnRate = document.getElementById("totalReturnRate");
  const elAvailableCash = document.getElementById("availableCash");
  const elStockValuation = document.getElementById("stockValuation");

  // 종목 리스트
  const elStockList = document.getElementById("stockListContainer");
  const elStockSearch = document.getElementById("stockSearchInput");
  const elCategoryFilter = document.getElementById("categoryFilter");

  // 중앙 차트 헤더
  const elSelectedStockName = document.getElementById("selectedStockName");
  const elSelectedStockSymbol = document.getElementById("selectedStockSymbol");
  const elSelectedStockCategory = document.getElementById("selectedStockCategory");
  const elSelectedStockPrice = document.getElementById("selectedStockPrice");
  const elSelectedStockChange = document.getElementById("selectedStockChange");
  const elSelectedStockHigh = document.getElementById("selectedStockHigh");
  const elSelectedStockLow = document.getElementById("selectedStockLow");
  const elSelectedStockVol = document.getElementById("selectedStockVol");

  // 차트 제어 버튼
  const elBtnCandle = document.getElementById("btnChartCandle");
  const elBtnLine = document.getElementById("btnChartLine");

  // 호가창 & 주문창
  const elOrderBookAsks = document.getElementById("orderBookAsks");
  const elOrderBookBids = document.getElementById("orderBookBids");
  const elTabBuy = document.getElementById("tabBuy");
  const elTabSell = document.getElementById("tabSell");
  const elOrderQuantity = document.getElementById("orderQuantity");
  const elOrderTotalEstimate = document.getElementById("orderTotalEstimate");
  const elBtnExecuteOrder = document.getElementById("btnExecuteOrder");
  const elOrderAvailableText = document.getElementById("orderAvailableText");

  // 비중 버튼 (10%, 25%, 50%, 75%, 100%)
  const elPercentBtns = document.querySelectorAll(".btn-order-percent");

  // 하단 탭
  const elTabPortfolio = document.getElementById("tabBtnPortfolio");
  const elTabNews = document.getElementById("tabBtnNews");
  const elTabHistory = document.getElementById("tabBtnHistory");
  const elPortfolioContent = document.getElementById("portfolioTabContent");
  const elNewsContent = document.getElementById("newsTabContent");
  const elHistoryContent = document.getElementById("historyTabContent");
  const elNewsBadge = document.getElementById("newsBadge");

  // 토스트 & 모달
  const elToastContainer = document.getElementById("toastContainer");
  const elSettlementModal = document.getElementById("settlementModal");
  const elBtnRestart = document.getElementById("btnRestartModal");

  // 3. UI 렌더링 함수들
  function renderStockList() {
    const searchTerm = elStockSearch.value.trim().toLowerCase();
    const selectedCat = elCategoryFilter.value;

    const filtered = Object.values(simulation.stocks).filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm) || s.symbol.includes(searchTerm) || s.tags.some(t => t.toLowerCase().includes(searchTerm));
      const matchCat = selectedCat === "ALL" || s.category.includes(selectedCat);
      return matchSearch && matchCat;
    });

    elStockList.innerHTML = filtered.map(s => {
      const isSelected = s.id === selectedStockId;
      const isUp = s.changeRate > 0;
      const isDown = s.changeRate < 0;
      const colorClass = isUp ? "text-danger" : (isDown ? "text-primary" : "text-muted");
      const sign = isUp ? "+" : "";

      // 보유 여부 표시
      const holding = account.holdings[s.id];
      const holdingBadge = holding ? `<span class="badge-holding">${holding.quantity}주 보유</span>` : "";

      return `
        <div class="stock-item ${isSelected ? 'active' : ''}" data-id="${s.id}">
          <div class="stock-item-left">
            <div class="stock-title-row">
              <span class="stock-name">${s.name}</span>
              ${holdingBadge}
            </div>
            <div class="stock-meta-row">
              <span class="stock-symbol">${s.symbol}</span>
              <span class="stock-cat-pill">${s.category}</span>
            </div>
          </div>
          <div class="stock-item-right text-right">
            <div class="stock-price">${Math.round(s.currentPrice).toLocaleString()}원</div>
            <div class="stock-change ${colorClass}">
              ${sign}${s.changeRate.toFixed(2)}%
            </div>
          </div>
        </div>
      `;
    }).join("");

    // 클릭 이벤트
    elStockList.querySelectorAll(".stock-item").forEach(item => {
      item.addEventListener("click", () => {
        selectedStockId = item.getAttribute("data-id");
        updateSelectedStockUI();
        renderStockList();
      });
    });
  }

  function updateSelectedStockUI() {
    const stock = simulation.stocks[selectedStockId];
    if (!stock) return;

    elSelectedStockName.textContent = stock.name;
    elSelectedStockSymbol.textContent = stock.symbol;
    elSelectedStockCategory.textContent = stock.category;
    
    const isUp = stock.changeRate > 0;
    const isDown = stock.changeRate < 0;
    const colorClass = isUp ? "text-danger" : (isDown ? "text-primary" : "text-muted");
    const sign = isUp ? "+" : "";

    elSelectedStockPrice.textContent = `${Math.round(stock.currentPrice).toLocaleString()}원`;
    elSelectedStockPrice.className = `stat-huge ${colorClass}`;
    
    elSelectedStockChange.innerHTML = `${sign}${Math.round(stock.changeAmount).toLocaleString()}원 (${sign}${stock.changeRate.toFixed(2)}%)`;
    elSelectedStockChange.className = `stat-change ${colorClass}`;

    elSelectedStockHigh.textContent = `${Math.round(stock.highPrice).toLocaleString()}원`;
    elSelectedStockLow.textContent = `${Math.round(stock.lowPrice).toLocaleString()}원`;
    elSelectedStockVol.textContent = `${stock.volume.toLocaleString()}주`;

    // 차트 업데이트
    chart.updateData(stock);

    // 호가창 업데이트
    renderOrderBook(stock);

    // 주문 입력창 상태 업데이트
    updateOrderPanel();
  }

  function renderOrderBook(stock) {
    if (!stock || !stock.orderBook) return;
    const ob = stock.orderBook;

    elOrderBookAsks.innerHTML = ob.asks.map(a => `
      <div class="ob-row ask-row" data-price="${a.price}">
        <span class="ob-price text-danger">${a.price.toLocaleString()}</span>
        <span class="ob-amount">${a.amount}</span>
      </div>
    `).join("");

    elOrderBookBids.innerHTML = ob.bids.map(b => `
      <div class="ob-row bid-row" data-price="${b.price}">
        <span class="ob-price text-primary">${b.price.toLocaleString()}</span>
        <span class="ob-amount">${b.amount}</span>
      </div>
    `).join("");

    // 호가 클릭 시 주문창 자동 반영
    elOrderBookAsks.querySelectorAll(".ob-row").forEach(r => {
      r.addEventListener("click", () => {
        // 매수 탭으로 전환
        setOrderType("BUY");
      });
    });
    elOrderBookBids.querySelectorAll(".ob-row").forEach(r => {
      r.addEventListener("click", () => {
        // 매도 탭으로 전환
        setOrderType("SELL");
      });
    });
  }

  function updateOrderPanel() {
    const stock = simulation.stocks[selectedStockId];
    if (!stock) return;

    const qty = parseInt(elOrderQuantity.value) || 0;
    const price = stock.currentPrice;
    const estimate = price * qty;
    const fee = Math.floor(estimate * account.feeRate);
    const tax = orderType === "SELL" ? Math.floor(estimate * account.taxRate) : 0;
    const finalAmount = orderType === "BUY" ? (estimate + fee) : (estimate - fee - tax);

    elOrderTotalEstimate.textContent = `${Math.round(finalAmount).toLocaleString()}원`;

    if (orderType === "BUY") {
      const maxAffordable = Math.floor(account.cash / (price * (1 + account.feeRate)));
      elOrderAvailableText.textContent = `매수 가능: ${maxAffordable.toLocaleString()}주 (현금: ${Math.floor(account.cash).toLocaleString()}원)`;
      elBtnExecuteOrder.textContent = "시장가 매수 주문";
      elBtnExecuteOrder.className = "btn-order-execute btn-buy";
    } else {
      const holding = account.holdings[selectedStockId];
      const maxSellable = holding ? holding.quantity : 0;
      elOrderAvailableText.textContent = `매도 가능: ${maxSellable.toLocaleString()}주`;
      elBtnExecuteOrder.textContent = "시장가 매도 주문";
      elBtnExecuteOrder.className = "btn-order-execute btn-sell";
    }
  }

  function setOrderType(type) {
    orderType = type;
    if (type === "BUY") {
      elTabBuy.classList.add("active");
      elTabSell.classList.remove("active");
    } else {
      elTabSell.classList.add("active");
      elTabBuy.classList.remove("active");
    }
    updateOrderPanel();
  }

  function renderDashboard(state) {
    // 1. 타이머 및 가상 날짜
    const mins = Math.floor(state.remainingSec / 60);
    const secs = state.remainingSec % 60;
    elTimerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    elSimDate.textContent = state.dateStr;
    elTimeProgressBar.style.width = `${(state.progress * 100).toFixed(2)}%`;

    // 2. 자산 요약
    const summary = account.getSummary(simulation.stocks);
    elTotalAssets.textContent = `${Math.round(summary.totalAssets).toLocaleString()}원`;
    
    const isProfitable = summary.totalPnL >= 0;
    const pnlSign = isProfitable ? "+" : "";
    const pnlColorClass = isProfitable ? "text-danger" : "text-primary";
    
    elTotalPnL.textContent = `${pnlSign}${Math.round(summary.totalPnL).toLocaleString()}원`;
    elTotalPnL.className = `val-pnl ${pnlColorClass}`;

    elTotalReturnRate.textContent = `${pnlSign}${summary.totalReturnRate.toFixed(2)}%`;
    elTotalReturnRate.className = `val-rate ${pnlColorClass}`;

    elAvailableCash.textContent = `${Math.floor(summary.cash).toLocaleString()}원`;
    elStockValuation.textContent = `${Math.round(summary.stockValuation).toLocaleString()}원`;

    // 3. 종목 리스트 & 현재 선택 종목 UI 갱신
    renderStockList();
    updateSelectedStockUI();

    // 4. 하단 탭 갱신
    if (currentTab === "portfolio") renderPortfolioTab(summary);
    else if (currentTab === "history") renderHistoryTab();
  }

  function renderPortfolioTab(summary) {
    if (!summary) summary = account.getSummary(simulation.stocks);

    if (summary.holdings.length === 0) {
      elPortfolioContent.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-wallet fa-2x"></i>
          <p>현재 보유 중인 주식 ETF가 없습니다. 좌측 종목에서 매수를 진행해보세요!</p>
        </div>
      `;
      return;
    }

    const rows = summary.holdings.map(h => {
      const isUp = h.profitLoss >= 0;
      const sign = isUp ? "+" : "";
      const color = isUp ? "text-danger" : "text-primary";
      return `
        <tr>
          <td class="font-bold cursor-pointer" onclick="window.selectStock('${h.stockId}')">${h.name}</td>
          <td>${h.quantity.toLocaleString()}주</td>
          <td>${Math.round(h.avgPrice).toLocaleString()}원</td>
          <td>${Math.round(h.currentPrice).toLocaleString()}원</td>
          <td>${Math.round(h.evalAmount).toLocaleString()}원</td>
          <td class="${color}">${sign}${Math.round(h.profitLoss).toLocaleString()}원</td>
          <td class="${color} font-bold">${sign}${h.returnRate.toFixed(2)}%</td>
          <td>
            <button class="btn-table-sell" onclick="window.quickSell('${h.stockId}')">전량매도</button>
          </td>
        </tr>
      `;
    }).join("");

    elPortfolioContent.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>종목명</th>
            <th>보유수량</th>
            <th>평균단가</th>
            <th>현재가</th>
            <th>평가금액</th>
            <th>평가손익</th>
            <th>수익률</th>
            <th>빠른주문</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }

  function renderNewsTab() {
    if (simulation.newsHistory.length === 0) {
      elNewsContent.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-newspaper fa-2x"></i>
          <p>시뮬레이션이 진행되면 2025.09~2026.09 동안의 실시간 시장 뉴스가 발행됩니다.</p>
        </div>
      `;
      return;
    }

    elNewsContent.innerHTML = simulation.newsHistory.map(n => `
      <div class="news-card ${n.importance.toLowerCase()}">
        <div class="news-card-header">
          <span class="news-date">${n.triggerDateStr}</span>
          <span class="news-category">${n.category}</span>
          <span class="news-badge-importance">${n.importance}</span>
        </div>
        <h4 class="news-headline">${n.headline}</h4>
        <p class="news-summary">${n.summary}</p>
      </div>
    `).join("");
  }

  function renderHistoryTab() {
    if (account.orderHistory.length === 0) {
      elHistoryContent.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-clock-rotate-left fa-2x"></i>
          <p>체결된 매수/매도 주문 내역이 없습니다.</p>
        </div>
      `;
      return;
    }

    const rows = account.orderHistory.map(o => {
      const isBuy = o.type === "BUY";
      const typeBadge = isBuy ? `<span class="badge-buy">매수</span>` : `<span class="badge-sell">매도</span>`;
      return `
        <tr>
          <td>${o.timeStr}</td>
          <td>${typeBadge}</td>
          <td>${o.stockName}</td>
          <td>${Math.round(o.price).toLocaleString()}원</td>
          <td>${o.quantity.toLocaleString()}주</td>
          <td>${Math.round(o.amount).toLocaleString()}원</td>
          <td>${Math.round(o.fee).toLocaleString()}원</td>
        </tr>
      `;
    }).join("");

    elHistoryContent.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>체결일시</th>
            <th>구분</th>
            <th>종목명</th>
            <th>체결가격</th>
            <th>수량</th>
            <th>체결금액</th>
            <th>수수료/세금</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }

  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fa-solid ${type === 'news' ? 'fa-bolt' : (type === 'success' ? 'fa-check' : 'fa-info-circle')}"></i>
      </div>
      <div class="toast-content">${message}</div>
    `;
    elToastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 250);
    }, 1000);
  }

  // 4. 이벤트 바인딩
  elStartBtn.addEventListener("click", () => {
    if (!simulation.isRunning) {
      simulation.start();
      elStartBtn.style.display = "none";
      elPauseBtn.style.display = "inline-flex";
      showToast("모의 주식 투자가 시작되었습니다! (2025.09 ~ 2026.09 / 30분)", "success");
    }
  });

  elPauseBtn.addEventListener("click", () => {
    if (simulation.isPaused) {
      simulation.resume();
      elPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> 일시정지`;
      showToast("시뮬레이션 재개", "info");
    } else {
      simulation.pause();
      elPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i> 계속하기`;
      showToast("시뮬레이션 일시정지됨", "info");
    }
  });

  elSpeedSelect.addEventListener("change", (e) => {
    const speed = parseFloat(e.target.value);
    simulation.setSpeed(speed);
    showToast(`시뮬레이션 배속이 ${speed}배속으로 변경되었습니다.`, "info");
  });

  // 검색 & 필터
  elStockSearch.addEventListener("input", renderStockList);
  elCategoryFilter.addEventListener("change", renderStockList);

  // 차트 타입 토글
  elBtnCandle.addEventListener("click", () => {
    chart.setChartType("candle");
    elBtnCandle.classList.add("active");
    elBtnLine.classList.remove("active");
  });
  elBtnLine.addEventListener("click", () => {
    chart.setChartType("line");
    elBtnLine.classList.add("active");
    elBtnCandle.classList.remove("active");
  });

  // 매수 / 매도 탭
  elTabBuy.addEventListener("click", () => setOrderType("BUY"));
  elTabSell.addEventListener("click", () => setOrderType("SELL"));

  elOrderQuantity.addEventListener("input", updateOrderPanel);

  // 비중 버튼 (10%, 25%, 50%, 75%, 100%)
  elPercentBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const pct = parseFloat(btn.getAttribute("data-pct")) / 100;
      const stock = simulation.stocks[selectedStockId];
      if (!stock) return;

      if (orderType === "BUY") {
        const totalAffordableCash = account.cash * pct;
        const maxQty = Math.floor(totalAffordableCash / (stock.currentPrice * (1 + account.feeRate)));
        elOrderQuantity.value = Math.max(0, maxQty);
      } else {
        const holding = account.holdings[selectedStockId];
        const maxQty = holding ? holding.quantity : 0;
        elOrderQuantity.value = Math.floor(maxQty * pct);
      }
      updateOrderPanel();
    });
  });

  // 주문 실행
  elBtnExecuteOrder.addEventListener("click", () => {
    const stock = simulation.stocks[selectedStockId];
    if (!stock) return;

    const qty = parseInt(elOrderQuantity.value) || 0;
    const simDateStr = simulation.getCurrentSimDate().toISOString().split('T')[0];

    if (orderType === "BUY") {
      const res = account.buy(stock, qty, simDateStr);
      if (res.success) {
        showToast(res.message, "success");
        elOrderQuantity.value = "";
        updateOrderPanel();
        renderDashboard({
          remainingSec: simulation.totalDurationSec - simulation.elapsedSec,
          progress: simulation.elapsedSec / simulation.totalDurationSec,
          dateStr: simulation.formatDate(simulation.getCurrentSimDate())
        });
      } else {
        showToast(res.message, "error");
      }
    } else {
      const res = account.sell(stock, qty, simDateStr);
      if (res.success) {
        showToast(res.message, "success");
        elOrderQuantity.value = "";
        updateOrderPanel();
        renderDashboard({
          remainingSec: simulation.totalDurationSec - simulation.elapsedSec,
          progress: simulation.elapsedSec / simulation.totalDurationSec,
          dateStr: simulation.formatDate(simulation.getCurrentSimDate())
        });
      } else {
        showToast(res.message, "error");
      }
    }
  });

  // 하단 탭 전환
  elTabPortfolio.addEventListener("click", () => {
    currentTab = "portfolio";
    elTabPortfolio.classList.add("active");
    elTabNews.classList.remove("active");
    elTabHistory.classList.remove("active");
    elPortfolioContent.style.display = "block";
    elNewsContent.style.display = "none";
    elHistoryContent.style.display = "none";
    renderPortfolioTab();
  });

  elTabNews.addEventListener("click", () => {
    currentTab = "news";
    elTabNews.classList.add("active");
    elTabPortfolio.classList.remove("active");
    elTabHistory.classList.remove("active");
    elPortfolioContent.style.display = "none";
    elNewsContent.style.display = "grid";
    elHistoryContent.style.display = "none";
    elNewsBadge.style.display = "none";
    renderNewsTab();
  });

  elTabHistory.addEventListener("click", () => {
    currentTab = "history";
    elTabHistory.classList.add("active");
    elTabPortfolio.classList.remove("active");
    elTabNews.classList.remove("active");
    elPortfolioContent.style.display = "none";
    elNewsContent.style.display = "none";
    elHistoryContent.style.display = "block";
    renderHistoryTab();
  });

  // 전역 헬퍼 함수
  window.selectStock = (stockId) => {
    selectedStockId = stockId;
    updateSelectedStockUI();
    renderStockList();
  };

  window.quickSell = (stockId) => {
    selectedStockId = stockId;
    setOrderType("SELL");
    const holding = account.holdings[stockId];
    if (holding) {
      elOrderQuantity.value = holding.quantity;
      updateOrderPanel();
    }
  };

  // 5. 시뮬레이션 이벤트 구독
  simulation.onTick((state) => {
    renderDashboard(state);
  });

  simulation.onNews((newsItem) => {
    showToast(`[속보] ${newsItem.headline}`, "news");
    elNewsBadge.style.display = "inline-block";
    elNewsBadge.textContent = "NEW";
    if (currentTab === "news") {
      renderNewsTab();
    }
  });

  simulation.onComplete((finalState) => {
    showFinalSettlement(finalState);
  });

  // 6. 최종 정산 리포트 모달 표시
  function showFinalSettlement(finalState) {
    const summary = account.getSummary(simulation.stocks);
    
    document.getElementById("settleTotalAssets").textContent = `${Math.round(summary.totalAssets).toLocaleString()}원`;
    
    const isUp = summary.totalPnL >= 0;
    const sign = isUp ? "+" : "";
    const colorClass = isUp ? "text-danger" : "text-primary";
    
    const elSettlePnL = document.getElementById("settlePnL");
    elSettlePnL.textContent = `${sign}${Math.round(summary.totalPnL).toLocaleString()}원 (${sign}${summary.totalReturnRate.toFixed(2)}%)`;
    elSettlePnL.className = `settle-stat-value ${colorClass}`;

    // 시장 지수 벤치마크 (KOSPI 200, 나스닥 200)
    const kospiStock = simulation.stocks["ETF_KOSPI200"] || simulation.stocks["ETF_KOSPI100"];
    const nasdaqStock = simulation.stocks["ETF_NASDAQ"];
    const kospiReturn = kospiStock ? kospiStock.changeRate : 8.5;
    const nasdaqReturn = nasdaqStock ? nasdaqStock.changeRate : 15.2;

    document.getElementById("settleKospiReturn").textContent = `${kospiReturn >= 0 ? '+' : ''}${kospiReturn.toFixed(2)}%`;
    document.getElementById("settleNasdaqReturn").textContent = `${nasdaqReturn >= 0 ? '+' : ''}${nasdaqReturn.toFixed(2)}%`;

    // 투자 성향 및 타이틀 판정
    let investorType = "전략적 밸런스 투자자";
    let investorDesc = "안정적인 자산배분과 적절한 매매 타이밍으로 시장을 무난하게 방어했습니다.";

    if (summary.totalReturnRate >= 30) {
      investorType = "🔥 전설의 슈퍼 그로스 트레이더";
      investorDesc = "탁월한 시장 통찰력과 과감한 주도 테마주 집중 투자로 벤치마크를 압도하는 경이적인 수익을 달성했습니다!";
    } else if (summary.totalReturnRate >= 15) {
      investorType = "🚀 스마트 알파 제너레이터";
      investorDesc = "시장 주도 섹터(반도체, AI, 방산, 조선 등)의 상승 사이클을 적시에 포착하여 안정적인 고수익을 거두었습니다.";
    } else if (summary.totalReturnRate >= 0) {
      investorType = "🛡️ 리스크 매니지먼트 마스터";
      investorDesc = "변동성 장세에서도 원금을 안전하게 지키며 잃지 않는 투자의 정석을 보여주었습니다.";
    } else {
      investorType = "📚 성장하는 미래의 워런 버핏";
      investorDesc = "모의 투자를 통해 변동성 관리와 분산 투자의 소중한 교훈을 얻었습니다. 다음 번엔 더욱 정교한 포트폴리오로 승리해보세요!";
    }

    document.getElementById("settleInvestorType").textContent = investorType;
    document.getElementById("settleInvestorDesc").textContent = investorDesc;

    // 모달 표시
    elSettlementModal.classList.add("show");
  }

  elBtnRestart.addEventListener("click", () => {
    window.location.reload();
  });

  // 초기 렌더링
  renderStockList();
  updateSelectedStockUI();
  renderDashboard({
    remainingSec: 1800,
    progress: 0,
    dateStr: "2025.09.01"
  });
});
