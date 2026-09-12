// bank.js
// Estado y render de la cuenta bancaria simulada. Es la única parte de la
// app que sabe de "saldo" — el resto del código le pide a este módulo que
// cargue un gasto y confía en que actualice la pantalla.

const BankAccount = (function () {
  let balance = 8450;
  let txCount = 0;

  const balanceEl = document.getElementById("bankBalance");
  const lastMoveEl = document.getElementById("lastMove");
  const txCountEl = document.getElementById("txCount");

  function render() {
    balanceEl.textContent = formatMoney(balance);
    txCountEl.textContent = txCount;
  }

  function flash() {
    balanceEl.classList.add("flash");
    setTimeout(function () {
      balanceEl.classList.remove("flash");
    }, 150);
  }

  // Se llama cuando llega una transacción nueva desde la "API".
  // Siempre se resta del saldo, sin importar si luego el usuario
  // decide guardarla o descartarla para el modelo.
  function charge(tx) {
    balance -= tx.amount;
    txCount += 1;
    lastMoveEl.textContent = tx.merchant;
    render();
    flash();
  }

  render();

  return { charge: charge, getBalance: function () { return balance; } };
})();