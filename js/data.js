// data.js
// Datos compartidos: el pool de transacciones simuladas (como si vinieran
// de la API de Nessie) y utilidades de formato usadas por el resto de la app.

const TRANSACTION_POOL = [
  { merchant: "Gasolinera Pemex", category: "trabajo", amount: 280 },
  { merchant: "Refaccionaria El Tornillo", category: "trabajo", amount: 450 },
  { merchant: "Comisión plataforma DiDi", category: "trabajo", amount: 65 },
  { merchant: "AutoZone — accesorios", category: "trabajo", amount: 320 },
  { merchant: "Taller mecánico Hnos. Ruiz", category: "trabajo", amount: 600 },
  { merchant: "Farmacia Guadalajara", category: "personal", amount: 150 },
  { merchant: "OXXO", category: "personal", amount: 85 },
  { merchant: "Renta mensual", category: "personal", amount: 2500 },
  { merchant: "Súper Soriana", category: "personal", amount: 365 },
  { merchant: "Telmex — internet", category: "personal", amount: 399 }
];

function formatMoney(n) {
  return "$" + Math.round(n).toLocaleString("es-MX");
}

function categoryLabel(cat) {
  return cat === "trabajo" ? "🔧 Trabajo" : "🏠 Personal";
}

function pickRandomTransaction() {
  return TRANSACTION_POOL[Math.floor(Math.random() * TRANSACTION_POOL.length)];
}