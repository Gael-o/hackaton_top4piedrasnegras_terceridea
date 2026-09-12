// interaction.js
// Orquesta el flujo de "Notificación": simula el GET a Nessie, muestra la
// tarjeta de transacción arrastrable, y reparte el resultado del swipe
// entre BankAccount, PredictModel y ActivityLog. Este es el único módulo
// que conoce el gesto de swipe.

const NotificationFlow = (function () {
  let active = null;
  let dragging = false;
  let startX = 0;
  let currentX = 0;

  const stageArea = document.getElementById("stageArea");
  const placeholderText = document.getElementById("placeholderText");
  const notifBtn = document.getElementById("notifBtn");
  const notifBtnText = document.getElementById("notifBtnText");
  const notifDot = document.getElementById("notifDot");

  // 1. TARJETA SIMPLIFICADA: Solo renderiza el monto y un texto genérico
  function buildTxCard(tx) {
    const card = document.createElement("div");
    card.className = "tx-card";
    card.innerHTML =
      '<div class="stamp save">GUARDAR</div>' +
      '<div class="stamp discard">DESCARTAR</div>' +
      '<div class="tx-top">' +
        '<div>' +
          '<p class="tx-merchant">Nuevo Gasto Detectado</p>' + // Texto fijo en lugar de tx.merchant
          '<p class="tx-date">Vía Nessie API</p>' +
        '</div>' +
        '<span class="tx-amt">&minus;' + formatMoney(tx.amount) + '</span>' +
      '</div>' +
      // Eliminamos el <span> de la categoría que estaba aquí
      '<div class="tx-hint"><span>&larr; guardar en el modelo</span><span>descartar &rarr;</span></div>' +
      '<div class="actions">' +
        '<button class="action-btn save-btn" data-action="save">&larr; Guardar</button>' +
        '<button class="action-btn discard-btn" data-action="discard">Descartar &rarr;</button>' +
      '</div>';
    return card;
  }

  // Las funciones de arrastre (drag) se quedan exactamente igual
  function attachDrag(card) {
    card.addEventListener("pointerdown", function (e) {
      dragging = true;
      startX = e.clientX;
      card.setPointerCapture(e.pointerId);
    });

    card.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      currentX = e.clientX - startX;
      card.style.transform = "translateX(" + currentX + "px) rotate(" + (currentX / 18) + "deg)";
      const saveStamp = card.querySelector(".stamp.save");
      const discardStamp = card.querySelector(".stamp.discard");
      const t = Math.min(Math.abs(currentX) / 90, 1);
      if (currentX < 0) {
        saveStamp.style.opacity = t;
        discardStamp.style.opacity = 0;
      } else {
        discardStamp.style.opacity = t;
        saveStamp.style.opacity = 0;
      }
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      if (currentX < -90) {
        resolveTx(true);
      } else if (currentX > 90) {
        resolveTx(false);
      } else {
        card.style.transition = "transform .25s ease";
        card.style.transform = "translateX(0) rotate(0)";
        setTimeout(function () { card.style.transition = ""; }, 250);
      }
      currentX = 0;
    }

    card.addEventListener("pointerup", endDrag);
    card.addEventListener("pointercancel", endDrag);
  }

  function resolveTx(saved) {
    if (!active) return;
    const tx = active.tx;
    const card = active.el;
    active = null;

    card.style.transition = "transform .3s ease, opacity .3s ease";
    card.style.transform = "translateX(" + (saved ? "-160%" : "160%") + ") rotate(" + (saved ? -14 : 14) + "deg)";
    card.style.opacity = "0";

    if (saved) {
      PredictModel.addDataPoint(tx);
    }
    ActivityLog.add(tx, saved);

    setTimeout(function () {
      card.remove();
      placeholderText.style.display = "block";
    }, 300);
  }

  // 2. FUNCIÓN START ASÍNCRONA: Obtiene solo el costo
  async function start() {
    if (active) return;
    notifBtn.disabled = true;
    notifDot.style.display = "inline-block";
    notifBtnText.textContent = "Consultando Nessie…";

    try {
      const API_KEY = "TU_API_KEY"; // Tu llave
      const ACCOUNT_ID = "ID_DE_LA_CUENTA"; // Tu cuenta de prueba
      const url = `http://api.reimaginebanking.com/accounts/${ACCOUNT_ID}/purchases?key=${API_KEY}`;
      
      const respuesta = await fetch(url);
      const comprasNessie = await respuesta.json();

      if (comprasNessie.length > 0) {
        const compraAlAzar = comprasNessie[Math.floor(Math.random() * comprasNessie.length)];
        
        // 3. OBJETO LIMPIO: Solo pasamos el monto
        const tx = { 
          amount: compraAlAzar.amount 
        };

        BankAccount.charge(tx);
        placeholderText.style.display = "none";
        
        const card = buildTxCard(tx);
        stageArea.appendChild(card);
        active = { tx: tx, el: card };
        attachDrag(card);

        card.querySelectorAll(".action-btn").forEach(function (btn) {
          btn.addEventListener("click", function () {
            resolveTx(btn.getAttribute("data-action") === "save");
          });
        });
      } else {
        console.warn("No hay compras registradas en Nessie aún.");
      }
    } catch (error) {
      console.error("Error al consultar la API de Nessie:", error);
    } finally {
      notifDot.style.display = "none";
      notifBtnText.textContent = "Notificación";
      notifBtn.disabled = false;
    }
  }

  return { start: start };
})();