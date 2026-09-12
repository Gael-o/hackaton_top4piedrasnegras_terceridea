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

  function charge(tx) {
    balance -= tx.amount;
    txCount += 1;
    // Cambiado: Quitamos tx.merchant
    lastMoveEl.textContent = "Compra reciente"; 
    render();
    flash();
  }

  render();

  return { charge: charge, getBalance: function () { return balance; } };
})();