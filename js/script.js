function calcularPagos() {
    const monto = parseInt(document.getElementById("monto").value);
    const cuotas = parseInt(document.getElementById("cuotas").value);
  
    if (isNaN(monto) || isNaN(cuotas) || monto <= 0 || cuotas <= 0) {
      console.log("Ingrese un monto y número de cuotas válidos.");
      return;
    }
  
    const intereses = obtenerIntereses(cuotas);
    const totalConIntereses = calcularTotalConIntereses(monto, intereses);
    const cuotaMensual = calcularCuotaMensual(totalConIntereses, cuotas);
  
    mostrarResultados(totalConIntereses, cuotaMensual, cuotas);
  }
  
  function obtenerIntereses(cuotas) {
    switch (cuotas) {
      case 3:
      case 6:
      case 12:
      case 18:
      case 24:
        return 0.93; // 59% de intereses
      default:
        return 0;
    }
  }
  
  function calcularTotalConIntereses(monto, intereses) {
    return monto * (1 + intereses);
  }
  
  function calcularCuotaMensual(totalConIntereses, cuotas) {
    return totalConIntereses / cuotas;
  }
  
  function mostrarResultados(totalConIntereses, cuotaMensual, cuotas) {
    console.log(`Monto total a pagar: $${totalConIntereses.toFixed(2)}`);
    console.log(`Cuota mensual: $${cuotaMensual.toFixed(2)}`);
  
    for (let i = 1; i <= cuotas; i++) {
      console.log(`Cuota ${i}: $${cuotaMensual.toFixed(2)}`);
    }
  }