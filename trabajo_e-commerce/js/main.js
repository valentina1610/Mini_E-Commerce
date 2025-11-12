const API_URL = "https://6904ddaf6b8dabde49656b9b.mockapi.io/ventas";

document.addEventListener("DOMContentLoaded", cargarVentas);

// === GRÁFICOS: Variables de instancia ===
let grafico1 = null; 
let grafico2 = null; 
let grafico3 = null; 

// =====================================
// === 1. CARGA DE DATOS Y ACTUALIZACIÓN ===
// =====================================

async function cargarVentas() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener ventas");
        const ventas = await response.json();
        
        mostrarVentas(ventas);
        actualizarDashboard(ventas); 
    } catch (error) {
        console.error("Error al cargar ventas:", error);
        actualizarDashboard([]); 
    }
}

function mostrarVentas(ventas) {
    const tbody = document.querySelector("#tablaVentas tbody");
    tbody.innerHTML = "";

    ventas.forEach((venta) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${venta.id || 'N/A'}</td>
            <td>${venta.fecha}</td>
            <td>${venta.Cliente}</td>
            <td>${venta.Producto}</td>
            <td>${venta.cantidad}</td>
            <td>$${Number(venta.precioUnitario).toFixed(2)}</td>
            <td>$${Number(venta.total).toFixed(2)}</td>
            <td>${venta.metodoPago}</td>
        `;
        tbody.appendChild(fila);
    });
}


// =====================================
// === 2. ACTUALIZACIÓN DEL DASHBOARD (DOM) ===
// =====================================

function actualizarDashboard(ventas) {
    // Las funciones de cálculo (calcularTotal, calcularPromedio, etc.)
    // deben estar definidas en stats.js y cargadas antes que este archivo.
    const total = calcularTotal(ventas);
    const promedio = calcularPromedio(ventas);
    const desviacion = calcularDesviacion(ventas);
    const correlacion = calcularCorrelacionPearson(ventas); 

    // Actualiza las tarjetas (DOM)
    document.getElementById("total").textContent = "$ " + total.toFixed(2);
    document.getElementById("promedio").textContent = "$ " + promedio.toFixed(2);
    document.getElementById("desviacion").textContent = desviacion.toFixed(2);
    document.getElementById("correlacion").textContent = correlacion.toFixed(4); 

    // Actualiza gráficos
    dibujarGraficoProductos(agruparPorProducto(ventas));
    dibujarGraficoFechas(agruparPorFecha(ventas));
    dibujarGraficoCorrelacion(ventas);
}


// =====================================
// === 3. MANEJO DEL FORMULARIO (DOM y API POST) ===
// =====================================

const form = document.getElementById("ventaForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fecha = document.getElementById("fecha").value;
    const cliente = document.getElementById("cliente").value;
    const producto = document.getElementById("producto").value;
    const cantidad = Number(document.getElementById("cantidad").value);
    const precioUnitario = Number(document.getElementById("precioUnitario").value);
    const metodoPago = document.getElementById("metodoPago").value;

    const total = cantidad * precioUnitario; 

    const nuevaVenta = {
        fecha,
        Cliente: cliente, 
        Producto: producto, 
        cantidad,
        precioUnitario,
        metodoPago,
        total,
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaVenta),
        });

        if (!res.ok) throw new Error("Error guardando venta");

        alert("Venta registrada correctamente ✅");
        form.reset();
        cargarVentas(); 
    } catch (error) {
        alert("Error al guardar la venta");
        console.error(error);
    }
});


// =====================================
// === 4. FUNCIONES DE DIBUJO DE GRÁFICOS ===
// =====================================

function dibujarGraficoProductos(data) {
    if (grafico1) grafico1.destroy();

    grafico1 = new Chart(document.getElementById("graficoVentas"), {
        type: "bar",
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: "Ventas por producto ($)",
                data: Object.values(data),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}

function dibujarGraficoFechas(data) {
    if (grafico2) grafico2.destroy();
    
    const sortedKeys = Object.keys(data).sort();
    const sortedValues = sortedKeys.map(key => data[key]);

    grafico2 = new Chart(document.getElementById("graficoFechas"), {
        type: "line",
        data: {
            labels: sortedKeys,
            datasets: [{
                label: "Ventas por día ($)",
                data: sortedValues,
                tension: 0.3,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}

function dibujarGraficoCorrelacion(ventas) {
    if (grafico3) grafico3.destroy();

    const scatterData = ventas.map(v => ({
        x: Number(v.precioUnitario), 
        y: Number(v.cantidad)       
    }));

    grafico3 = new Chart(document.getElementById("graficoDispersión"), {
        type: "scatter",
        data: {
            datasets: [{
                label: 'Relación Precio/Cantidad',
                data: scatterData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: { display: true, text: 'Precio Unitario ($)' }
                },
                y: {
                    title: { display: true, text: 'Cantidad Vendida' }
                }
            }
        }
    });
}