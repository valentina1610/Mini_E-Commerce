// === ESTADÍSTICAS: Medidas de Tendencia Central y Dispersión ===

function calcularTotal(ventas) {
    return ventas.reduce((acc, v) => acc + Number(v.total || 0), 0);
}

function calcularPromedio(ventas) {
    if (ventas.length === 0) return 0;
    return calcularTotal(ventas) / ventas.length;
}

function calcularDesviacion(ventas) {
    if (ventas.length === 0) return 0;

    const prom = calcularPromedio(ventas);

    const suma = ventas.reduce((acc, v) => {
        const diff = Number(v.total) - prom;
        return acc + diff * diff;
    }, 0);

    return Math.sqrt(suma / ventas.length); 
}

// === COEFICIENTE DE CORRELACIÓN DE PEARSON (Precio Unitario vs. Cantidad Vendida) ===

function calcularCorrelacionPearson(ventas) {
    if (ventas.length < 2) return 0;
    
    const x = ventas.map(v => Number(v.precioUnitario)); // Precio
    const y = ventas.map(v => Number(v.cantidad));      // Cantidad
    const n = ventas.length;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const avgX = sumX / n;
    const avgY = sumY / n;

    let numerador = 0;
    let sumDiffX2 = 0; 
    let sumDiffY2 = 0; 

    for (let i = 0; i < n; i++) {
        const diffX = x[i] - avgX;
        const diffY = y[i] - avgY;
        
        numerador += diffX * diffY;
        sumDiffX2 += diffX * diffX;
        sumDiffY2 += diffY * diffY;
    }

    const denominador = Math.sqrt(sumDiffX2 * sumDiffY2);
    
    return denominador === 0 ? 0 : numerador / denominador;
}

// === AGRUPACIÓN DE DATOS (Para los gráficos) ===

function agruparPorProducto(ventas) {
    const obj = {};

    ventas.forEach(v => {
        const nombre = v.Producto || "Sin nombre";
        obj[nombre] = (obj[nombre] || 0) + Number(v.total);
    });

    return obj;
}

function agruparPorFecha(ventas) {
    const obj = {};

    ventas.forEach(v => {
        const f = v.fecha || "Sin fecha";
        obj[f] = (obj[f] || 0) + Number(v.total);
    });

    return obj;
}