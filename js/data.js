// data.js
// Datos compartidos: el pool de transacciones simuladas (como si vinieran
// de la API de Nessie) y utilidades de formato usadas por el resto de la app.

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