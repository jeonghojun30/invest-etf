/**
 * 고성능 인터랙티브 주식 차트 엔진 (Canvas 2D)
 * - 캔들스틱(봉차트) 및 라인 차트 지원
 * - 이동평균선(MA5, MA20) 오버레이
 * - 하단 거래량(Volume) 서브차트
 * - 마우스 호버 크로스헤어 & 실시간 툴팁
 */
class StockChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    
    this.chartType = "candle"; // "candle" | "line"
    this.data = []; // [{time, dateStr, open, high, low, close, volume}]
    this.currentStock = null;
    
    this.mouseX = -1;
    this.mouseY = -1;
    this.isHovering = false;
    
    this.padding = { top: 20, right: 75, bottom: 35, left: 15 };
    this.volumeHeightRatio = 0.22; // 하단 22%는 거래량
    
    this.initEvents();
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  initEvents() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      this.isHovering = true;
      this.render();
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.isHovering = false;
      this.mouseX = -1;
      this.mouseY = -1;
      this.render();
    });
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = (rect.height || 420) * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height || 420}px`;
    
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height || 420;
    
    this.render();
  }

  setChartType(type) {
    this.chartType = type;
    this.render();
  }

  updateData(stock) {
    this.currentStock = stock;
    if (!stock || !stock.candles) return;
    this.data = stock.candles;
    this.render();
  }

  render() {
    if (!this.ctx || !this.data || this.data.length === 0) {
      this.renderEmpty();
      return;
    }

    const { ctx, width, height, padding } = this;
    ctx.clearRect(0, 0, width, height);

    // 차트 영역 계산
    const chartWidth = width - padding.left - padding.right;
    const totalChartHeight = height - padding.top - padding.bottom;
    const mainHeight = totalChartHeight * (1 - this.volumeHeightRatio) - 10;
    const volumeHeight = totalChartHeight * this.volumeHeightRatio;
    const volumeTop = padding.top + mainHeight + 10;

    // 표시할 데이터 슬라이스 (최대 60개 캔들)
    const visibleData = this.data.slice(-60);
    if (visibleData.length === 0) return;

    // 가격 min/max 계산
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = 0;

    visibleData.forEach(d => {
      if (d.low < minPrice) minPrice = d.low;
      if (d.high > maxPrice) maxPrice = d.high;
      if (d.volume > maxVolume) maxVolume = d.volume;
    });

    // 상하 여백 5%
    const priceMargin = (maxPrice - minPrice) * 0.05 || maxPrice * 0.02;
    minPrice = Math.max(0, minPrice - priceMargin);
    maxPrice = maxPrice + priceMargin;
    const priceRange = maxPrice - minPrice || 1;

    // 1. 배경 그리드 및 가격 축 라벨
    this.drawGrid(padding.left, padding.top, chartWidth, mainHeight, volumeTop, volumeHeight, minPrice, maxPrice, maxVolume);

    // 2. 거래량 차트 그리기
    const barWidth = Math.max(2, (chartWidth / visibleData.length) * 0.7);
    const stepX = chartWidth / visibleData.length;

    visibleData.forEach((d, i) => {
      const x = padding.left + i * stepX + stepX / 2;
      const isUp = d.close >= d.open;
      const vH = (d.volume / (maxVolume || 1)) * volumeHeight;
      const vY = volumeTop + volumeHeight - vH;

      ctx.fillStyle = isUp ? "rgba(239, 68, 68, 0.35)" : "rgba(59, 130, 246, 0.35)";
      ctx.fillRect(x - barWidth / 2, vY, barWidth, vH);
    });

    // 3. 이동평균선(MA5, MA20) 계산 및 렌더링
    this.drawMovingAverage(visibleData, 5, "#f59e0b", padding, stepX, minPrice, priceRange, mainHeight);
    this.drawMovingAverage(visibleData, 20, "#a855f7", padding, stepX, minPrice, priceRange, mainHeight);

    // 4. 주가 메인 차트 (캔들스틱 or 라인)
    if (this.chartType === "line") {
      this.drawLineChart(visibleData, padding, stepX, minPrice, priceRange, mainHeight);
    } else {
      this.drawCandleStick(visibleData, padding, stepX, barWidth, minPrice, priceRange, mainHeight);
    }

    // 5. 날짜 축 라벨
    this.drawTimeLabels(visibleData, padding, stepX, height - 10);

    // 6. 마우스 호버 크로스헤어 및 툴팁
    if (this.isHovering && this.mouseX >= padding.left && this.mouseX <= width - padding.right) {
      this.drawCrosshairAndTooltip(visibleData, padding, stepX, minPrice, priceRange, mainHeight, height);
    }
  }

  drawGrid(left, top, w, h, vTop, vH, minPrice, maxPrice, maxVolume) {
    const { ctx, width } = this;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    ctx.font = "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "left";

    // 메인 가격선 (4개)
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
      const y = top + (h / gridCount) * i;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(left + w, y);
      ctx.stroke();

      const price = maxPrice - ((maxPrice - minPrice) / gridCount) * i;
      ctx.fillText(Math.round(price).toLocaleString() + "원", left + w + 8, y + 4);
    }

    // 거래량 상단선
    ctx.beginPath();
    ctx.moveTo(left, vTop);
    ctx.lineTo(left + w, vTop);
    ctx.stroke();
    ctx.fillText("Vol " + Math.round(maxVolume).toLocaleString(), left + w + 8, vTop + 12);
  }

  drawCandleStick(data, padding, stepX, barWidth, minPrice, priceRange, mainHeight) {
    const { ctx } = this;
    
    data.forEach((d, i) => {
      const x = padding.left + i * stepX + stepX / 2;
      const isUp = d.close >= d.open;
      const color = isUp ? "#ef4444" : "#3b82f6"; // 한국 증시: 상승 빨강, 하락 파랑
      
      const yOpen = padding.top + (1 - (d.open - minPrice) / priceRange) * mainHeight;
      const yClose = padding.top + (1 - (d.close - minPrice) / priceRange) * mainHeight;
      const yHigh = padding.top + (1 - (d.high - minPrice) / priceRange) * mainHeight;
      const yLow = padding.top + (1 - (d.low - minPrice) / priceRange) * mainHeight;

      // 꼬리선 (High - Low)
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // 몸통 (Body)
      ctx.fillStyle = color;
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
      ctx.fillRect(x - barWidth / 2, bodyTop, barWidth, bodyHeight);
    });
  }

  drawLineChart(data, padding, stepX, minPrice, priceRange, mainHeight) {
    const { ctx, height } = this;
    if (data.length === 0) return;

    const points = data.map((d, i) => ({
      x: padding.left + i * stepX + stepX / 2,
      y: padding.top + (1 - (d.close - minPrice) / priceRange) * mainHeight
    }));

    // 그라디언트 채우기
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + mainHeight);
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.4)");
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + mainHeight);
    points.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + mainHeight);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // 메인 라인
    ctx.beginPath();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    points.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
  }

  drawMovingAverage(data, period, color, padding, stepX, minPrice, priceRange, mainHeight) {
    const { ctx } = this;
    if (data.length < period) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    let hasMoved = false;

    for (let i = period - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      const ma = sum / period;
      const x = padding.left + i * stepX + stepX / 2;
      const y = padding.top + (1 - (ma - minPrice) / priceRange) * mainHeight;

      if (!hasMoved) {
        ctx.moveTo(x, y);
        hasMoved = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  drawTimeLabels(data, padding, stepX, y) {
    const { ctx } = this;
    ctx.fillStyle = "#64748b";
    ctx.font = "10px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";

    const labelInterval = Math.max(1, Math.floor(data.length / 5));
    for (let i = 0; i < data.length; i += labelInterval) {
      const x = padding.left + i * stepX + stepX / 2;
      ctx.fillText(data[i].dateStr, x, y);
    }
  }

  drawCrosshairAndTooltip(data, padding, stepX, minPrice, priceRange, mainHeight, totalHeight) {
    const { ctx, mouseX, mouseY, width } = this;
    
    // 마우스 위치에 가장 가까운 캔들 인덱스 검색
    const index = Math.min(
      data.length - 1,
      Math.max(0, Math.floor((mouseX - padding.left) / stepX))
    );
    const d = data[index];
    if (!d) return;

    const x = padding.left + index * stepX + stepX / 2;
    const y = padding.top + (1 - (d.close - minPrice) / priceRange) * mainHeight;

    // 크로스헤어 점선 그리기
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;

    // 세로선
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, totalHeight - padding.bottom);
    ctx.stroke();

    // 가로선
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.restore();

    // 툴팁 박스 렌더링
    const isUp = d.close >= d.open;
    const rate = (((d.close - d.open) / d.open) * 100).toFixed(2);
    const lines = [
      `일자: ${d.dateStr}`,
      `시가: ${Math.round(d.open).toLocaleString()}원`,
      `고가: ${Math.round(d.high).toLocaleString()}원`,
      `저가: ${Math.round(d.low).toLocaleString()}원`,
      `종가: ${Math.round(d.close).toLocaleString()}원 (${isUp ? '+' : ''}${rate}%)`,
      `거래량: ${d.volume.toLocaleString()}주`
    ];

    const tooltipWidth = 160;
    const tooltipHeight = 110;
    let tooltipX = mouseX + 15;
    if (tooltipX + tooltipWidth > width - padding.right) {
      tooltipX = mouseX - tooltipWidth - 15;
    }
    let tooltipY = Math.max(10, Math.min(mouseY - 40, totalHeight - tooltipHeight - 30));

    // 툴팁 배경 (Glassmorphic dark card)
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
    ctx.fill();
    ctx.stroke();

    // 툴팁 텍스트
    ctx.textAlign = "left";
    ctx.font = "11px -apple-system, BlinkMacSystemFont, sans-serif";
    lines.forEach((line, idx) => {
      if (idx === 0) ctx.fillStyle = "#94a3b8";
      else if (idx === 4) ctx.fillStyle = isUp ? "#ef4444" : "#3b82f6";
      else ctx.fillStyle = "#e2e8f0";
      ctx.fillText(line, tooltipX + 10, tooltipY + 18 + idx * 16);
    });
  }

  renderEmpty() {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#64748b";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("종목을 선택하거나 시뮬레이션을 시작해주세요.", width / 2, height / 2);
  }
}

if (typeof window !== "undefined") {
  window.StockChart = StockChart;
}
