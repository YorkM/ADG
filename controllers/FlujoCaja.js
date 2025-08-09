const URL = "../models/FlujoCaja.php";
// FUNCIÓN CONFIRMAR ACCIONES
const confirmAlert = async (title, text) => {
   const result = await Swal.fire({
      title: `${title}`,
      text: `${text}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
   });
   return result;
}
// DICCIONARIO DE MESES
const meses = {
   "01": "ENERO",
   "02": "FEBRERO",
   "03": "MARZO",
   "04": "ABRIL",
   "05": "MAYO",
   "06": "JUNIO",
   "07": "JULIO",
   "08": "AGOSTO",
   "09": "SEPTIEMBRE",
   "10": "OCTUBRE",
   "11": "NOVIEMBRE",
   "12": "DICIEMBRE"
}
// FUNCIÓN PARA FILTRAR TABLAS
const filtrar = (filtro, idTabla) => {
   const filas = document.querySelectorAll(`#${idTabla} tbody tr`);
   filas.forEach(fila => {
      const celdas = fila.querySelectorAll('td');
      const coincide = Array.from(celdas).some(td => td.textContent.toLowerCase().includes(filtro));
      fila.style.display = coincide ? '' : 'none';
   });
}
// SETEAR FECHA ACTUAL A CAMPOS FILTROS
const setearFechas = () => {
   const fecha = new Date();
   return fecha.toISOString().split('T')[0];
}
// FUNCIÓN PARA CARGAR LOS CONCEPTOS
const getConceptos = async () => {
   try {
      const { data } = await enviarPeticion({ op: "G_CONCEPTOS", link: URL });
      if (data.length) {
         let conceptos = `<option value="">-- Seleccione el concepto --</option>`;
         data.forEach(item => conceptos += `<option value="${item.ID}">${item.TEXTO}</option>`);
         $('#concepto').html(conceptos);
      }
   } catch (error) {
      console.log(error);
   }
}
// FUNCIÓN PARA OBTENER LOS INGRESOS Y EGRESOS DE SAP
const getMovimientosAutomaticos = async () => {
   let fecha = new Date();
   fecha = fecha.toISOString().split('T')[0];
   const FC = fecha.split('-');
   const dia = FC[2];
   const mes = FC[1];
   const anio = FC[0];
   const organizacion = $('#numOrg').val();
   const usuario = $('#login_user').val();

   try {
      const { data: vericarSaldosBancos } = await enviarPeticion({
         op: "V_SALDOS_BANCOS", 
         link: URL,
         organizacion
      });

      if (!vericarSaldosBancos.length) { 
         const { data: saldosBancos } = await enviarPeticion({ 
            op: "G_SALDOS_BANCOS", 
            link: URL,
            fechaSAP: `${anio}${mes}${dia}`,
            organizacion,
            anio,
         });

         if (saldosBancos.length) {
            const montoIngresoSaldoBanco = saldosBancos[0].IMPORTE;
            const montoEgresoSaldoBanco = saldosBancos[1].IMPORTE;
   
            const data = await enviarPeticion({
               op: "I_MOVIMIENTO_AUTO", 
               link: URL,
               montoIngresoSaldoBanco,
               montoEgresoSaldoBanco,
               organizacion,
               usuario,
               fecha,
               anio,
               mes,
               dia
            });
   
            if (data.ok) {
               showToastr("success", "Los saldos en bancos fueron cargados correctamente");
            }
         } else {
            showToastr("warning", "Saldos en bancos no disponibles");
         }
      }

   } catch (error) {
      console.log(error);
   }
}
// FUNCIÓN PARA AGREGAR UN NUEVO CONCEPTO
const guardarConcepto = async () => {
   const concepto = $('#newConcepto').val();
   if (!concepto) {
      Swal.fire("Agregar concepto", "El campo concepto es obligatorio", "error");
      return;
   }

   try {
      const resp = await enviarPeticion({ op: "I_CONCEPTO", link: URL, concepto });
      if (resp.ok) {
         $('#agregarConcepto').modal("hide");
         $('#newConcepto').val("");
         getConceptos();
         Swal.fire("Agregar concepto", "El concepto ha sido agregado correctamente", "success");
      }
   } catch (error) {
      console.log(error);
   }
}
// FUNCIÓN PARA AGREGAR UN NUEVO CONCEPTO
const guardarMovimiento = async () => {
   const fecha = $('#fechaM').val();
   const FC = fecha.split('-');
   const dia = FC[2];
   const mes = FC[1];
   const anio = FC[0];
   const organizacion = $('#numOrg').val();
   const usuario = $('#login_user').val();
   const tipoM = $('#tipoM').val();
   const tipoP = $('#tipoP').val();
   const concepto = $('#concepto').val();
   const monto = $('#monto').val().replace(/^\$|\.|,/g, "");
   const descripcion = $('#descripcion').val();

   if (!fecha || !tipoM || !tipoP || !concepto || !monto) {
      Swal.fire("Guardar movimiento", "Los campos... Fecha Movimiento - Tipo Movimiento - Tipo Presupuesto - Concepto - Monto/Valor, son obligatorios", "error");
      return;
   }

   const result = await confirmAlert("Guardar movimiento", "Se guardarán los datos ingresados en los campos... ¿Han sido verificados antes?");
   if (!result.isConfirmed) return;

   try {
      const resp = await enviarPeticion({ 
         op: "I_MOVIMIENTO", 
         link: URL,
         organizacion,
         descripcion: descripcion || "-",
         concepto,
         usuario, 
         fecha,
         tipoM,
         tipoP, 
         monto,
         anio,
         mes,
         dia
      });

      if (resp.ok) {
         $('#fechaM').val("");       
         $('#tipoM').val("");       
         $('#tipoMP').val("");       
         $('#concepto').val("");       
         $('#monto').val("");       
         $('#descripcion').val(""); 
         getMovimientos();
         getDiaFlujoCaja();
         getBimestreFlujoCaja();
         getRealProyectado();      
         Swal.fire("Agregar movimiento", "El movimiento ha sido agregado correctamente", "success");
      }     
   } catch (error) {
      console.log(error);
   }
}
// FUNCIÓN PARA OBTENER LOS MOVIMIENTOS
const getMovimientos = async () => {
   const organizacion = $('#numOrg').val();
   const fechaInicio = $('#fechaInicio').val();
   const fechaFinal = $('#fechaFinal').val();
   try {
      const { data } =  await enviarPeticion({ 
         op: "G_MOVIMIENTOS", 
         link: URL,
         organizacion,
         fechaInicio,
         fechaFinal 
      });

      let elementos = ``;
      let textColor = "";
      let textColor2 = "";
      let signo = "";
      if (data.length) {
         data.forEach(item => {
            textColor = (item.TIPO_M === "INGRESO") ? "success" : "danger";
            textColor2 = (item.TIPO_M === "INGRESO") ? "#198754 " : "#dc3545 ";
            signo = (item.TIPO_M === "INGRESO") ? "+" : "-";

            if (parseInt(item.DIA) < 10) item.DIA = `0${item.DIA}`;
            if (parseInt(item.MES) < 10) item.MES = `0${item.MES}`;
            
            elementos += `
            <tr>
               <td class="vertical no-wrap size-14 text-center">${item.DIA}</td>
               <td class="vertical no-wrap size-13 text-center">${meses[item.MES]}</td>
               <td class="vertical no-wrap size-14 text-center">${item.ANIO}</td>
               <td class="vertical no-wrap size-14 text-center">${item.ORGANIZACION}</td>
               <td class="vertical no-wrap text-center"><span style="font-size: 10px; background-color: ${textColor2}; color: white; padding: 3px 6px; border-radius: 4px; display: inline-block; width: 4rem; font-weight: bold;">${item.TIPO_M}</span></td>
               <td class="vertical no-wrap size-13">${item.TEXTO}</td>
               <td class="vertical no-wrap text-center size-15 fw-bold text-${textColor}">${signo} ${formatNum(item.VALOR, "$")}</td>
               <td class="vertical no-wrap size-13">${item.DESCRIPCION}</td>
               <td class="vertical no-wrap text-center"><button class="btn btn-warning btn-sm shadow-sm editar" title="Editar movimiento"><i class="fa-solid fa-pen-to-square"></i></button></td>
            </tr>`;
         }); 

         $('#tablaProyeccion').on('click', '.editar', function () {
            console.log($(this).parent());
         });
      } else {
         elementos = `<td colspan="9" class="lead text-center">No hay movimientos guardados relacionados a las fechas seleccionadas</td>`;
      }      
      $('#tablaProyeccion tbody').html(elementos);
   } catch (error) {
      console.log(error);
   }
}
// FUNCIÓN PARA OBTENER LOS MOVIMIENTOS
const getBimestreFlujoCaja = async () => {
   const anio = new Date().getFullYear();
   try {
      const { data } =  await enviarPeticion({ op: "G_BIMESTRES", link: URL, anio });
      let elementos = ``;
      let textColor = "";
      if (data.length) {
         data.forEach(item => {    
            textColor = (item.FLUJO_CAJA_NETO  < 0) ? "text-danger fw-bold" : "";        
            elementos += `
            <tr>
               <td class="vertical size-13 text-center no-wrap">${item.BIMESTRE}</td>
               <td class="vertical size-14 text-center no-wrap">${formatNum(item.TOTAL_INGRESOS, "$")}</td>
               <td class="vertical size-14 text-center no-wrap">${formatNum(item.TOTAL_EGRESOS, "$")}</td>
               <td class="vertical size-14 text-center no-wrap ${textColor}">${formatNum(item.FLUJO_CAJA_NETO, "$")}</td>
               <td class="vertical size-14 text-center no-wrap">${formatNum(item.PROM_INGRESOS_DIA, "$")}</td>
               <td class="vertical size-14 text-center no-wrap">${formatNum(item.PROM_EGRESOS_DIA, "$")}</td>
               <td class="vertical size-14 text-center no-wrap">${item.DIAS_CON_MOVIMIENTO}</td>
               <td class="vertical size-14 text-center no-wrap">${item.NUM_INGRESOS}</td>
               <td class="vertical size-14 text-center no-wrap">${item.NUM_EGRESOS}</td>
               <td class="vertical size-14 text-center no-wrap">${item.PORCENTAJE_EGRESOS_SOBRE_INGRE}%</td>
            </tr>`;
         }); 
      } else {
         elementos = `<td colspan="10" class="lead text-center">No hay datos disponibles</td>`;
      }      
      $('#tablaProyeccion2 tbody').html(elementos);
   } catch (error) {
      console.log(error);
   }
}

const getDiaFlujoCaja = async () => {
   const anio = new Date().getFullYear();
   try {
      const { data } =  await enviarPeticion({ op: "G_DIAS", link: URL, anio });
      let elementos = ``;
      let textColor = "";
      if (data.length) {
         data.forEach(item => {    
            textColor = (item.FLUJO_CAJA_NETO  < 0) ? "text-danger fw-bold" : "";        
            elementos += `
            <tr>
               <td class="vertical size-13 text-center no-wrap">${item.DIA}</td>
               <td class="vertical size-14 text-center no-wrap">${formatNum(item.TOTAL_INGRESOS, "$")}</td>
               <td class="vertical size-14 text-center no-wrap">${formatNum(item.TOTAL_EGRESOS, "$")}</td>
               <td class="vertical size-14 text-center no-wrap ${textColor}">${formatNum(item.FLUJO_CAJA_NETO, "$")}</td>
               <td class="vertical size-14 text-center no-wrap">${item.NUM_INGRESOS}</td>
               <td class="vertical size-14 text-center no-wrap">${item.NUM_EGRESOS}</td>
               <td class="vertical size-14 text-center no-wrap">${item.PORCENTAJE_EGRESOS_SOBRE_INGRE}%</td>
            </tr>`;
         }); 
      } else {
         elementos = `<td colspan="10" class="lead text-center">No hay datos disponibles</td>`;
      }      
      $('#tablaProyeccionDia tbody').html(elementos);
   } catch (error) {
      console.log(error);
   }
}

const getRealProyectado = async () => {
   const anio = new Date().getFullYear();
   try {
      const { data } =  await enviarPeticion({ op: "G_REAL_PROYECTADO", link: URL, anio });
      let elementos = ``;
      let textColor = "";
      if (data.length) {
         data.forEach(item => {    
            // textColor = (item.DIFERENCIA  < 0) ? "text-danger fw-bold" : "";        
            elementos += `
            <tr>
               <td class="vertical size-14 text-center no-wrap">${item.FECHA}</td>
               <td class="vertical size-14 text-center no-wrap">${formatNum(item.INGRESO_REAL, "$")}</td>
               <td class="vertical size-14 text-center no-wrap">${formatNum(item.INGRESO_PROYECTADO, "$")}</td>
               <td class="vertical size-14 text-center no-wrap">${formatNum(item.EGRESO_REAL, "$")}</td>
               <td class="vertical size-14 text-center no-wrap">${formatNum(item.EGRESO_PROYECTADO, "$")}</td>
            </tr>`;
         }); 
      } else {
         elementos = `<td colspan="10" class="lead text-center">No hay datos disponibles</td>`;
      }      
      $('#tablaProyeccionRP tbody').html(elementos);

      graficasIngresosEgresos(data);
   } catch (error) {
      console.log(error);
   }
}

const graficasIngresosEgresos = (data) => {
   let graficaFlujo = null;
   let graficaEgresos = null;
   const fechas = data.map(item => item.FECHA);
   const ingresosReales = data.map(item => item.INGRESO_REAL);
   const ingresosProyectados = data.map(item => item.INGRESO_PROYECTADO);
   const egresosReales = data.map(item => item.EGRESO_REAL);
   const egresosProyectados = data.map(item => item.EGRESO_PROYECTADO);

   if (graficaFlujo) {
      graficaFlujo.destroy();
   }

   if (graficaEgresos) {
      graficaEgresos.destroy();
   }

   const ctx = document.getElementById('graficaFlujoCaja').getContext('2d');
      graficaFlujo = new Chart(ctx, {
      type: 'bar',
      data: {
         labels: fechas,
         datasets: [
            {
               label: 'Ingreso Real',
               data: ingresosReales,
               backgroundColor: 'rgba(54, 162, 235, 0.7)'
            },
            {
               label: 'Ingreso Proyectado',
               data: ingresosProyectados,
               backgroundColor: 'rgba(255, 206, 86, 0.7)'
            }
         ]
      },
      options: {
         responsive: true,
         scales: {
            y: {
               beginAtZero: true,
               ticks: {
                  callback: function (value) {
                     return formatNum(value, "$");
                  }
               },
               title: {
                  display: true,
                  text: 'Valor en Pesos'
               }
            },
            x: {
               title: {
                  display: true,
                  text: 'Fecha'
               }
            }
         },
         plugins: {
            title: {
               display: true,
               text: 'Comparativo Ingresos Reales vs Proyectados por Día'
            },
            tooltip: {
               callbacks: {
                  label: function (context) {
                     return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                  }
               }
            }
         }
      }
   });

   const ctxEgresos = document.getElementById('graficaEgresos').getContext('2d');
      graficaEgresos = new Chart(ctxEgresos, {
      type: 'bar',
      data: {
         labels: fechas,
         datasets: [
            {
               label: 'Egreso Real',
               data: egresosReales,
               backgroundColor: 'rgba(255, 99, 132, 0.7)'
            },
            {
               label: 'Egreso Proyectado',
               data: egresosProyectados,
               backgroundColor: 'rgba(153, 102, 255, 0.7)'
            }
         ]
      },
      options: {
         responsive: true,
         scales: {
            y: {
               beginAtZero: true,
               ticks: {
                  callback: function (value) {
                     // return '$' + value.toLocaleString();
                     return formatNum(value, "$");
                  }
               },
               title: {
                  display: true,
                  text: 'Valor en Pesos'
               }
            },
            x: {
               title: {
                  display: true,
                  text: 'Fecha'
               }
            }
         },
         plugins: {
            title: {
               display: true,
               text: 'Comparativo Egresos Reales vs Proyectados por Día'
            },
            tooltip: {
               callbacks: {
                  label: function (context) {
                     return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                  }
               }
            }
         }
      }
   });
}

// EJECUCIÓN DE LAS FUNCIONALIDADES AL CARGAR EL DOM
$(async function () {
   $('#fechaInicio, #fechaInicio2, #fechaFinal, #fechaFinal2').val(setearFechas());

   $('#fechaInicio, #fechaFinal').change(function () {
      getMovimientos();
   });

   $('#fechaInicio2, #fechaFinal2').change(function () {
      console.log("Ahí está...");
   });

   await getMovimientosAutomaticos();

   getConceptos();

   getMovimientos();

   getDiaFlujoCaja();

   getBimestreFlujoCaja();

   getRealProyectado();

   $('#btnConcepto').click(function () {
      $('#agregarConcepto').modal("show");
   });

   $('#btnGuardar').click(function () {
      guardarMovimiento();
   });

   $('#newConcepto, #descripcion').on('input', function () {
      this.value = this.value.toUpperCase();
   });

   $('#monto').on('input', function () {
      let value = $(this).val().replace(/[^0-9]/g, '');
      if (value) value = parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 0 });
      if (value) $(this).val("$" + value);
      else $(this).val("");
   });

   $('#guardarConcepto').click(function () {     
      guardarConcepto();
   });

   $('#filtroBusqueda').keyup(function () {
      const filtro = this.value.toLowerCase();
      filtrar(filtro, "tablaProyeccion");
   });

   $('#filtroBusqueda2').keyup(function () {
      const filtro = this.value.toLowerCase();
      filtrar(filtro, "tablaProyeccionDia");
   });
});