// creditBridge.js
// El "puente de crédito": no calcula nada del colchón, solo observa el
// resultado de PredictModel. Si el colchón se mantiene por varios ajustes
// seguidos sobre una meta, desbloquea una línea de crédito simulada
// (como si Capital One la pre-aprobara con base en ese historial).

const CreditBridge = (function () {
  const GOAL_BUFFER = 4000;   // meta de colchón de trabajo
  const STREAK_TARGET = 3;    // ajustes seguidos que se necesitan sobre la meta

  let streak = 0;
  let unlocked = false;

  const cardEl = document.getElementById("creditCard");
  const statusEl = document.getElementById("creditStatus");
  const headlineEl = document.getElementById("creditHeadline");
  const fillEl = document.getElementById("creditProgressFill");
  const labelEl = document.getElementById("creditProgressLabel");
  const unlockedEl = document.getElementById("creditUnlocked");
  const amountEl = document.getElementById("creditAmount");

  function render() {
    const pct = Math.min(100, Math.round((streak / STREAK_TARGET) * 100));
    fillEl.style.width = pct + "%";
    labelEl.textContent =
      streak + " / " + STREAK_TARGET + " ajustes con colchón sobre la meta (" + formatMoney(GOAL_BUFFER) + ")";
  }

  function unlock(buffer) {
    unlocked = true;
    cardEl.classList.remove("locked");
    cardEl.classList.add("unlocked");
    statusEl.textContent = "Desbloqueado";
    headlineEl.textContent = "Tu colchón de trabajo se mantuvo estable. Esto es lo que Capital One te pre-aprueba.";
    unlockedEl.style.display = "block";

    const preApproved = buffer * 0.6; // línea simulada como fracción del colchón sostenido
    amountEl.textContent = formatMoney(preApproved);
  }

  // Único punto de entrada: se llama cada vez que el modelo recalcula el
  // colchón (es decir, cada vez que se guarda un dato nuevo).
  function evaluate(buffer) {
    if (unlocked || buffer === null || buffer === undefined) return;

    if (buffer >= GOAL_BUFFER) {
      streak += 1;
    } else {
      streak = 0;
    }

    render();

    if (streak >= STREAK_TARGET) {
      unlock(buffer);
    }
  }

  render();

  return { evaluate: evaluate };
})();