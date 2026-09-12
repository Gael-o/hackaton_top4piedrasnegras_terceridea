const PredictModel = (function () {
  let savedData = [];
  let previousPrediction = null;

  const predictionEl = document.getElementById("modelPrediction");
  const subEl = document.getElementById("modelSub");
  const emptyMsgEl = document.getElementById("emptyModelMsg");
  const adjustRowEl = document.getElementById("adjustRow");
  const adjustArrowEl = document.getElementById("adjustArrow");
  const adjustValEl = document.getElementById("adjustVal");

  function computeRecommendedBuffer() {
    const n = savedData.length;
    // Cambiado: Ahora saca el promedio de TODOS los gastos guardados (ya no hay filtros de categoría)
    const avgGeneral = n > 0 
      ? savedData.reduce(function (s, t) { return s + t.amount; }, 0) / n 
      : 0;

    const weeklyPrediction = avgGeneral * 5;
    const recommendedBuffer = weeklyPrediction * 3;
    return { weeklyPrediction: weeklyPrediction, recommendedBuffer: recommendedBuffer };
  }

  function renderAdjustment(recommendedBuffer) {
    if (previousPrediction === null) {
      adjustRowEl.className = "adjust-row flat";
      adjustArrowEl.textContent = "";
      adjustValEl.textContent = "primer cálculo";
      return;
    }
    const delta = recommendedBuffer - previousPrediction;
    if (Math.abs(delta) < 1) {
      adjustRowEl.className = "adjust-row flat";
      adjustArrowEl.textContent = "";
      adjustValEl.textContent = "sin cambios";
    } else if (delta > 0) {
      adjustRowEl.className = "adjust-row up";
      adjustArrowEl.textContent = "▲";
      adjustValEl.textContent = "+" + formatMoney(delta);
    } else {
      adjustRowEl.className = "adjust-row down";
      adjustArrowEl.textContent = "▼";
      adjustValEl.textContent = "\u2212" + formatMoney(Math.abs(delta));
    }
  }

  function recalc() {
    const n = savedData.length;

    if (n === 0) {
      predictionEl.textContent = "—";
      subEl.textContent = "Colchón recomendado para tus gastos, según tu historial."; // Texto ajustado
      emptyMsgEl.style.display = "block";
      adjustRowEl.className = "adjust-row flat";
      adjustArrowEl.textContent = "";
      adjustValEl.textContent = "sin datos aún";
      previousPrediction = null;
      return;
    }
    emptyMsgEl.style.display = "none";

    const result = computeRecommendedBuffer();

    predictionEl.textContent = formatMoney(result.recommendedBuffer);
    predictionEl.classList.remove("settling");
    void predictionEl.offsetWidth; 
    predictionEl.classList.add("settling");

    // Cambiado: Texto ajustado para no mencionar "trabajo"
    subEl.textContent =
      "Colchón sugerido (~3 semanas), calculado con " + n + " dato" + (n === 1 ? "" : "s") +
      " de gasto. Predicción semanal: " + formatMoney(result.weeklyPrediction) + ".";

    renderAdjustment(result.recommendedBuffer);
    previousPrediction = result.recommendedBuffer;
  }

  function addDataPoint(tx) {
    savedData.push(tx);
    recalc();
  }

  recalc();

  return { addDataPoint: addDataPoint };
})();