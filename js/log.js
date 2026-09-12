// log.js
// Historial visible de decisiones: cada vez que el usuario acepta o
// descarta una transacción, queda registrada aquí. No decide nada,
// solo lleva la bitácora — refuerza la idea de "cero caja negra".

const ActivityLog = (function () {
  const listEl = document.getElementById("logList");

  function add(tx, included) {
    const empty = listEl.querySelector(".log-empty");
    if (empty) empty.remove();

    const row = document.createElement("div");
    row.className = "log-item";
    row.innerHTML =
      '<div class="log-left">' +
        '<span class="log-tag ' + (included ? "included" : "excluded") + '">' +
          (included ? "GUARDADO" : "DESCARTADO") +
        "</span>" +
        "<span>" + tx.merchant + "</span>" +
      "</div>" +
      "<span>" + formatMoney(tx.amount) + "</span>";
    listEl.insertBefore(row, listEl.firstChild);
  }

  return { add: add };
})();