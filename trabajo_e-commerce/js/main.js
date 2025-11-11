const API_URL = "https://6904ddaf6b8dabde49656b9b.mockapi.io/ventas"; // Url de la api

// Cuando carga la página, traemos las ventas existentes
document.addEventListener("DOMContentLoaded", cargarVentas);

// Función para traer todas las ventas desde la API (GET)
async function cargarVentas() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener ventas");
    const ventas = await response.json();
    mostrarVentas(ventas);
  } catch (error) {
    console.error("Error al cargar ventas:", error);
  }
}

// Mostrar las ventas en la tabla
function mostrarVentas(ventas) {
  const tbody = document.querySelector("#tablaVentas tbody");
  tbody.innerHTML = "";

  ventas.forEach((venta) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${venta.id}</td>
      <td>${venta.fecha}</td>
      <td>${venta.Cliente}</td>
      <td>${venta.Producto}</td>
      <td>${venta.cantidad}</td>
      <td>$${venta.precioUnitario}</td>
      <td>$${venta.total}</td>
      <td>${venta.metodoPago}</td>
    `;
    tbody.appendChild(fila);
  });
}

// Capturar formulario
const form = document.getElementById("ventaForm");
form.addEventListener("submit", async (e) => {
  // se ejecuta al enviar el formulario
  e.preventDefault(); // Evita que el formulario recargue la página al enviarse

  // Tomar valores del formulario
  const fechaInput = document.getElementById("fecha").value;
  const cliente = document.getElementById("cliente").value;
  const producto = document.getElementById("producto").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const precioUnitario = parseFloat(
    document.getElementById("precioUnitario").value
  );
  const metodoPago = document.getElementById("metodoPago").value;

  // Calcular total automáticamente
  const total = cantidad * precioUnitario;

  // Crear objeto de venta
  const nuevaVenta = {
    fecha: fechaInput,
    Cliente: cliente,
    Producto: producto,
    cantidad,
    precioUnitario,
    metodoPago,
    total,
  };

  try { // Enviar venta a la API
    const response = await fetch(API_URL, {
      method: "POST", // Método POST para crear
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaVenta),
    });

    if (!response.ok) throw new Error("Error al guardar la venta");

    alert("Venta registrada correctamente");
    form.reset(); // Limpiar formulario
    cargarVentas(); // Recargar tabla
  } catch (error) {
    console.error("Error al enviar venta:", error);
    alert("Hubo un error al registrar la venta");
  }
});
