// data.js
// Datos compartidos: el pool de transacciones simuladas (como si vinieran
// de la API de Nessie) y utilidades de formato usadas por el resto de la app.

function formatMoney(amount) {
  return "$" + Math.round(amount).toLocaleString("es-MX");
}

// category aquí es solo referencia oculta (para quien presenta sepa hacia
// qué lado conviene deslizar); no se muestra en la tarjeta. La clasificación
// real de "trabajo" o "no trabajo" la hace la persona con el swipe.
const TRANSACTION_POOL = [
  { merchant: "DISTRIBUIDORA GONZALEZ SA", amount: 1200, category: "trabajo" },
  { merchant: "COCACOLA FEMSA CDMX", amount: 650, category: "trabajo" },
  { merchant: "GRUPO BIMBO SA CV", amount: 420, category: "trabajo" },
  { merchant: "CFE SUMINISTRADORA", amount: 380, category: "trabajo" },
  { merchant: "GAS EXPRESS NIETO", amount: 300, category: "trabajo" },
  { merchant: "SABRITAS PEPSICO MX", amount: 540, category: "trabajo" },
  { merchant: "BARCEL SA DE CV", amount: 275, category: "trabajo" },
  { merchant: "OXXO", amount: 56, category: "personal" },
  { merchant: "FARMACIAS GDL 4521", amount: 150, category: "personal" },
  { merchant: "TELCEL RECARGA", amount: 250, category: "personal" },
  { merchant: "CINEPOLIS PLAZA", amount: 220, category: "personal" },
  { merchant: "WALMART EXPRESS 118", amount: 380, category: "personal" }
];

function pickRandomTransaction() {
  return TRANSACTION_POOL[Math.floor(Math.random() * TRANSACTION_POOL.length)];
}

async function obtenerCostoDesdeAPI() {
  const API_KEY = "c00f92404ea15abb8e2af20d656af627";
  const ACCOUNT_ID = "ID_DE_LA_CUENTA"; 
  const url = `http://api.reimaginebanking.com/accounts/${ACCOUNT_ID}/purchases?key=${API_KEY}`;

  try {
    const respuesta = await fetch(url);
    const comprasNessie = await respuesta.json();

    if (comprasNessie.length > 0) {
      // Elegimos una compra al azar
      const compraAlAzar = comprasNessie[Math.floor(Math.random() * comprasNessie.length)];
      
      // Retornamos EXCLUSIVAMENTE el costo (amount)
      return compraAlAzar.amount; 
    }
    
    return null; // Si no hay compras
  } catch (error) {
    console.error("Error al obtener el costo:", error);
    return null;
  }
}