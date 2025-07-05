const porcentajeFDV = 88;
const porcentajeMercadeo = 5;
const porcentajeGerComer = 3;
const porcentajeCoorContac = 2;
const porcentajeCoorComer = 2;
let coordinadores;
let gerenteMercadeo;
let gerenteVentas;
let coordContact;
let zonasParejas;

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

// FUNCIÓN LIMPIAR
const limpiar = () => {
   const oficinas = OficinasVentas('S');
   $("#oficina").html(oficinas);
   getGruposArticulos();
   $('#cuotaValores').val("");
   $('#cuotaImpactos').val("");
   $('#seguimiento').val("");
   seteoFechas();
}
// FUNCIÓN SETEO DE FECHAS ACTUALES
const seteoFechas = () => {
   $('#fechaInicial, #fechaFinal').datepicker({
      autoclose: true,
      multidate: false,
      changeMonth: true,
      changeYear: true,
      useCurrent: true,
      dateFormat: 'yy-mm-dd'
   }).datepicker("setDate", new Date());
}
// OBTENER LOS GRUPOS DE ARTICULOS
const getGruposArticulos = async () => {
   const resp = await enviarPeticion({
      op: "G_GRUPOS_ARTICULOS",
      link: "../models/SeguimientoIncentivos.php"
   });

   let grupos = `<option value="">0000 - TODOS</option>`;
   resp.data.forEach(item => {
      grupos += `<option value="${item.GRUPO_ARTICULO.trim()}">${item.GRUPO_ARTICULO} - ${item.DESCRIPCION1}</option>`;
   });
   $('#proveedor').html(grupos);
}
// FUNCIÓN OBTENER LOS BENEFICARIOS DE LA NOTA
const getBeneficiarios = async (oficina) => {
   const resp = await enviarPeticion({
      op: "G_BENEFICIARIOS",
      link: "../models/SeguimientoIncentivos.php",
      oficina
   });
   gerenteMercadeo = resp.data.filter(item => item.ROL === "118");
   coordinadores = resp.data.filter(item => item.ROL === "44");
   gerenteVentas = resp.data.filter(item => item.ROL === "3");
   coordContact = resp.data.filter(item => item.ROL === "13");
}

const getBeneficiarios2 = async (oficina = "2100") => {
   const resp = await enviarPeticion({
      op: "G_BENEFICIARIOS_2",
      link: "../models/SeguimientoIncentivos.php",
      oficina
   });

   const zonasConsolidado = {};
   resp.data.forEach(item => {
      const zona = item.ZONA_VENTAS?.trim();
      if (!zona) return;

      if (!zonasConsolidado[zona]) {
         zonasConsolidado[zona] = [];
      }
      
      const existe = zonasConsolidado[zona].some(persona => persona.ID === item.ID);
      if (!existe) {
         zonasConsolidado[zona].push({
            ID: item.ID,
            IDENTIFICACION: item.IDENTIFICACION,
            NOMBRE: item.NOMBRE,
            ROL: item.ROL
         });
      }
   });

   const resultadoFinal = Object.entries(zonasConsolidado).map(([zona, integrantes]) => ({
      zona,
      integrantes
   }));

   zonasParejas = resultadoFinal.filter(item => item.integrantes.length == 2);
}
// OBTENER Y CALCULAR DATOS COORDINADORES
const resumenDatosCoordinadores = (zonas, cuotaActual, valorNota) => {
   const zonasPorCoordinador = {};
   const resumen = [];

   coordinadores.forEach(item => {
      if (!zonasPorCoordinador[item.ID]) {
         zonasPorCoordinador[item.ID] = {
            ID: item.ID,
            NOMBRE: item.NOMBRE,
            IDENTIFICACION: item.IDENTIFICACION,
            ZONAS: new Set(),
         };
      }
      zonasPorCoordinador[item.ID].ZONAS.add(item.ZONA_VENTAS);
   });

   for (const idCoordinador in zonasPorCoordinador) {
      const datosUsuario = zonasPorCoordinador[idCoordinador];
      let cantidad = 0, valorNeto = 0, costoInterno = 0, impactos = 0;

      datosUsuario.ZONAS.forEach(zona => {
         const datosZona = zonas.find(z => z.ZONA === zona);
         if (datosZona) {
            cantidad += parseInt(datosZona.CANTIDAD);
            valorNeto += parseInt(datosZona.VALOR_NETO);
            costoInterno += parseInt(datosZona.COSTO_INTERNO);
            impactos += parseInt(datosZona.IMPACTOS);
         }
      });

      let pcz = (costoInterno * 100) / cuotaActual;
      let pnz = (valorNeto * 100) / cuotaActual;
      let valorPorcentaNotaC = (valorNota * pcz) / 100;
      let valorPorcentaNotaN = (valorNota * pnz) / 100;
      let totalNotaCoordinadorC = (valorPorcentaNotaC * 2) / 100;
      let totalNotaCoordinadorN = (valorPorcentaNotaN * 2) / 100;

      resumen.push({
         ID: datosUsuario.ID,
         NOMBRE: datosUsuario.NOMBRE,
         IDENTIFICACION: datosUsuario.IDENTIFICACION,
         TOTAL_CANTIDAD: cantidad,
         TOTAL_VALOR_NETO: valorNeto,
         TOTAL_COSTO_INTERNO: costoInterno,
         TOTAL_IMPACTOS: impactos,
         PORCENTAJE_COSTO_ZONAS: pcz.toFixed(2),
         PORCENTAJE_NETO_ZONAS: pnz.toFixed(2),
         VALOR_PORCENTAJE_NOTA_C: Math.round(valorPorcentaNotaC),
         VALOR_PORCENTAJE_NOTA_N: Math.round(valorPorcentaNotaN),
         TOTAL_NOTA_COORD_C: Math.round(totalNotaCoordinadorC),
         TOTAL_NOTA_COORD_N: Math.round(totalNotaCoordinadorN),
      });
   }

   return resumen;
}
// FUNCIÓN GUARDAR DATOS BASE
const guardarDatosBase = async () => {
   const orgVentas = $('#numOrg').val();
   const oficinaVentas = $('#oficina').val();
   const proveedorDos = $('#proveedor').val().join('-');
   const proveedor = proveedorDos.split("-")[0];
   const cuotaValor = $('#cuotaValores').val().replace(/^\$|\.|,/g, "");
   const cuotaImpactos = $('#cuotaImpactos').val();
   const tipoSeguimiento = $('#seguimiento').val();
   const fechaInicio = $('#fechaInicial').val();
   const fechaFinal = $('#fechaFinal').val();

   if (oficinaVentas === "2000" || !proveedor || !cuotaValor || !cuotaImpactos || !tipoSeguimiento) {
      Swal.fire("Campos requeridos", "Se deben diligenciar todos los campos para guardar", "error");
      return;
   }

   const result = await confirmAlert("Guardar Datos", "Se guardarán los datos diligenciados... ¿Han sido verificados y confirmados?");
   if (!result.isConfirmed) return;

   const resp = await enviarPeticion({
      op: "I_DATOS_BASE",
      link: "../models/SeguimientoIncentivos.php",
      orgVentas,
      oficinaVentas,
      proveedor,
      proveedorDos,
      cuotaValor,
      cuotaImpactos,
      tipoSeguimiento,
      fechaInicio,
      fechaFinal
   });

   if (resp.ok) {
      Swal.fire("Guardar Datos", "Se guardaron los datos correctamente", "success");
      getDatosBase();
      limpiar();
   }
}
// FUNCIÓN PARA OBTENER RESUMEN INCETIVOS
const getResumenIncentivos = async () => {
   const organizacion = $('#numOrg').val();

   const resp = await enviarPeticion({
      op: "G_RESUMEN",
      link: "../models/SeguimientoIncentivos.php",
      organizacion
   });

   if (resp.data.length) {
      let tablaResumen = `
      <table class="table table-bordered table-hover table-sm mx-auto" id="tablaResumen2" style="width: 60%;">
            <thead class="table-info">        
               <tr>
                  <th>LABORATORIO</th>
                  <th>CONCEPTO</th>
                  <th>DOCUMENTO</th>
                  <th>VALOR FINAL</th>                       
               </tr>
            </thead>
            <tbody>`;

      const totalValorFinal = resp.data.reduce((acumulado, item) => acumulado + parseFloat(item.VALOR_FINAL), 0);

      resp.data.forEach(item => {
         let mes = (parseInt(item.MES) < 10) ? `0${item.MES}` : `${item.MES}`;
         const concepto = `INCENTIVO FDV ${meses[mes]} ${item.ANIO}`;
         tablaResumen += `
         <tr>
            <td class="custom-td">${item.LABORATORIO}</td>
            <td class="custom-td">${concepto}</td>
            <td class="custom-td-2">${item.DOCUMENTO}</td>
            <td class="custom-td-2">${formatNum(item.VALOR_FINAL, "$")}</td>                        
         </tr>`;
      });
      tablaResumen += `
            </tbody>
            <tfoot class="table-info">        
               <tr>
                  <td class="text-green" colspan="3">TOTAL</td>
                  <td class="text-green">${formatNum(totalValorFinal, "$")}</td>                                                  
               </tr>
            </tfoot>                       
      </table>`;
      $('#contenedorTablaResumen').html(tablaResumen);
   } else {
      const texto = `<p class="lead text-center">Resumen no disponible, Aún no se registra incentivo!!!</p>`;
      $('#contenedorTablaResumen').html(texto);
   }
}
// FUNCIÓN PARA OBTENER LOS DATOS BASE
const getDatosBase = async () => {
   const organizacion = $('#numOrg').val();
   const resp = await enviarPeticion({
      op: "G_DATOS_BASE",
      link: "../models/SeguimientoIncentivos.php",
      organizacion
   });

   let elementos = ``;
   resp.data.forEach(item => {
      elementos += `
      <tr>
         <td class="custom-td-2">${item.ID}</td>
         <td class="custom-td">${item.OFICINA_VENTAS} - ${item.CIUDAD}</td>
         <td class="custom-td">${item.PROVEEDOR}</td>
         <td class="custom-td">${item.PROVEEDOR_2}</td>
         <td class="custom-td">${item.DESCRIPCION1}</td>
         <td class="custom-td-2">${formatNum(item.CUOTA_VALOR, "$")}</td>
         <td class="custom-td-2">${item.CUOTA_IMPACTOS}</td>
         <td class="custom-td">${item.TIPO_SEGUIMIENTO}</td>
         <td class="custom-td-2">${item.FECHA_INICIO}</td>
         <td class="custom-td-2">${item.FECHA_FINAL}</td>
         <td><button class="btn btn-success custom-btn seguimiento"><i class="fa-solid fa-eye custom-fa"></i></button></td>
         <td><button class="btn btn-warning custom-btn editar"><i class="fa-solid fa-pen-to-square custom-fa"></i></button></td>              
      </tr>`;
   });
   $('#tablaIncentivos tbody').html(elementos);

   getResumenIncentivos();

   $('#tablaIncentivos').on('click', '.seguimiento', function () {
      const fila = $(this).closest('tr').find('td');
      const item = {
         organizacion: $('#numOrg').val(),
         idSeguimiento: fila.eq(0).text(),
         oficina: fila.eq(1).text().split('-')[0].trim(),
         grupoArticulo: fila.eq(2).text(),
         grupoArticulo2: fila.eq(3).text(),
         descProveedor: fila.eq(4).text(),
         cuota: fila.eq(5).text(),
         impacto: fila.eq(6).text(),
         tipoSeguimiento: fila.eq(7).text(),
         fechaInicio: fila.eq(8).text(),
         fechaFinal: fila.eq(9).text()
      }

      sessionStorage.ItemSeguimiento = JSON.stringify(item);
      getBeneficiarios(item.oficina);
      gestionarSeguimiento(item);
   });

   $('#tablaIncentivos').on('click', '.editar', function () {
      const fila = $(this).closest('tr').find('td');

      const item = {
         idSeguimiento: fila.eq(0).text(),
         cuota: fila.eq(5).text(),
         impacto: fila.eq(6).text(),
         fechaInicio: fila.eq(8).text(),
         fechaFinal: fila.eq(9).text()
      }

      sessionStorage.ItemActualizar = JSON.stringify(item);

      $('#cuotaValor').val(item.cuota);
      $('#cuotaImpacto').val(item.impacto);
      $('#fechaInicioEdi').val(item.fechaInicio);
      $('#fechaFinalEdi').val(item.fechaFinal);
      $('#modalSeguimiento').modal('show');
   });
}
// FUNCIÓN PARA GESTIONAR SEGUIMIENTO
const gestionarSeguimiento = async (item) => {
   try {
      showLoadingSwalAlert2("Cargando los datos... Espere un momento", false, true);

      const { idSeguimiento, organizacion, oficina, grupoArticulo2, descProveedor, cuota, impacto, tipoSeguimiento, fechaInicio, fechaFinal } = item;
      let zona = oficina.substring(0, 2);
      let fechaRappelsMes = fechaInicio.split("-")[1];
      let fechaRappelsAnio = fechaInicio.split("-")[0];

      let fechaInicioSTR = fechaInicio.split('-');
      let fechaFinalSTR = fechaFinal.split('-');
      fechaInicioSTR = `${fechaInicioSTR[0]}${fechaInicioSTR[1]}${fechaInicioSTR[2]}`;
      fechaFinalSTR = `${fechaFinalSTR[0]}${fechaFinalSTR[1]}${fechaFinalSTR[2]}`;

      let grupoArray = grupoArticulo2.split("-");
      let grupoArrayIN = grupoArray.map(item => `'${item}'`).join(", ");

      $('#seguimientoOculto').val(idSeguimiento);

      const resp = await enviarPeticion({
         op: "G_DATOS_SEGUIMIENTO",
         link: "../models/SeguimientoIncentivos.php",
         organizacion,
         zona,
         grupoArticulo: grupoArrayIN,
         fechaInicio: fechaInicioSTR,
         fechaFinal: fechaFinalSTR
      });

      const cuotaLimpia = parseFloat(cuota.replace(/^\$|\.|,/g, ""));
      let cuotaActual = 0;
      if (tipoSeguimiento === "VALOR NETO") cuotaActual = resp.data.reduce((acumulado, item) => acumulado + parseFloat(item.VALOR_NETO), 0);
      else cuotaActual = resp.data.reduce((acumulado, item) => acumulado + parseFloat(item.COSTO_INTERNO), 0);
      const impactoActual = resp.data.reduce((acumulado, item) => acumulado + parseFloat(item.IMPACTOS), 0);
      const cantidadActual = resp.data.reduce((acumulado, item) => acumulado + parseFloat(item.CANTIDAD), 0);
      let difCuota = 0;
      let difImpacto = 0;
      let signo = "";
      let signo2 = "";

      if (cuotaLimpia > cuotaActual) {
         difCuota = cuotaLimpia - cuotaActual;
         signo = "Menos";
      } else {
         difCuota = cuotaActual - cuotaLimpia;
         signo = "Mas";
      }

      if (parseInt(impacto) > impactoActual) {
         difImpacto = parseInt(impacto) - impactoActual;
         signo2 = "Menos";
      } else {
         difImpacto = impactoActual - parseInt(impacto);
         signo2 = "Mas";
      }

      const porcCuota = cuotaActual * 100 / cuotaLimpia;
      const porcImpacto = impactoActual * 100 / parseInt(impacto);

      $('#nav-profile-tab').attr('disabled', false);
      $('#nav-profile-tab-2').attr('disabled', false);
      $('#nav-profile-tab').click();

      $('#cuota').text(cuota);
      $('#cuotaActual').text(formatNum(cuotaActual, "$"));
      $('#difCuota').text(`${signo}: ${formatNum(difCuota, "$")}`);
      $('#porcCuota').text(porcCuota.toFixed(2) + "%");
      $('#impacto').text(impacto);
      $('#impactoActual').text(impactoActual);
      $('#porcImpacto').text(porcImpacto.toFixed(2) + "%");
      $('#difImpacto').text(`${signo2}: ${difImpacto}`);

      let datosResumen = ``;
      resp.data.forEach(item => {
         let VN = formatNum(item.VALOR_NETO, "$");
         let CI = formatNum(item.COSTO_INTERNO, "$");
         datosResumen += `
         <tr>
            <td class="custom-td-2">${item.ZONA}</td>
            <td class="custom-td">${item.ZONA_DESCRIPCION}</td>
            <td class="custom-td-2">${item.CANTIDAD}</td>
            <td class="custom-td-2">${item.IMPACTOS}</td>
            <td class="custom-td-2">${(tipoSeguimiento === "VALOR NETO") ? VN : CI}</td>
         </tr>`;
      });
      $('#tablaResumen tbody').html(datosResumen);
      $('#totalResumen').text(formatNum(cuotaActual, "$"));
      $('#totalImpactos').text(impactoActual);
      $('#totalCantidad').text(cantidadActual);
      $('#descProveedor').text(descProveedor);
      $('#contenedorTablaLiquidacion').html(``);
      $('#contenedorTablaLiquidacionZonas').html(``);
      $('#numeroNota').val("");
      $('#valorNota').val("");

      const resp2 = await enviarPeticion({
         op: "G_DATOS_NOTAS",
         link: "../models/SeguimientoIncentivos.php",
         idSeguimiento
      });

      const { NUMERO_NOTA, VALOR_NOTA } = resp2.data[0];

      if (NUMERO_NOTA !== "0" || VALOR_NOTA !== "0") {
         $('#numeroNota').val(NUMERO_NOTA);
         $('#valorNota').val(formatNum(VALOR_NOTA, "$"));

         const resumen = resumenDatosCoordinadores(resp.data, cuotaActual, VALOR_NOTA);
         let totalCoordinadores = 0;
         if (tipoSeguimiento === "VALOR NETO") totalCoordinadores = resumen.reduce((acumulado, item) => acumulado + item.TOTAL_NOTA_COORD_N, 0);
         else totalCoordinadores = resumen.reduce((acumulado, item) => acumulado + item.TOTAL_NOTA_COORD_C, 0);
         const mercadeo = (parseFloat(VALOR_NOTA) * porcentajeMercadeo) / 100;
         const gerenciaC = (parseFloat(VALOR_NOTA) * porcentajeGerComer) / 100;
         const coordCont = (parseFloat(VALOR_NOTA) * porcentajeCoorContac) / 100;
         const liquidacG = parseFloat(VALOR_NOTA) - mercadeo - gerenciaC - coordCont - totalCoordinadores;

         let thCoords = ``;
         let tdCoords = ``;
         let tdCoords2 = ``;

         const renderTemplatesCoords = (identificacion, nombre, valorNota) => `
            <tr>
               <td class="custom-td-2">${identificacion}</td>
               <td class="custom-td">${nombre}</td>
               <td class="custom-td-2">${formatNum(Math.round(valorNota), "$")}</td>                    
               <td class="custom-td">${descProveedor} ${meses[fechaRappelsMes]} ${fechaRappelsAnio}</td>                    
               <td class="custom-td">CONSIGNACIÓN</td>                    
            </tr>`;

         const renderTemplatesCoords2 = (id1, id2, name1, name2, valor1) => `
            <tr>
               <td class="${(id1) ? 'custom-td-2' : 'custom-td text-danger'}">${id1 || "NO DISPONIBLE"}</td>
               <td class="custom-td ${(name1) ? '' : 'text-danger'}">${name1 || "NO DISPONIBLE"}</td>
               <td class="custom-td-2">${formatNum(Math.round(valor1), "$")}</td>                    
               <td class="custom-td">${descProveedor} ${meses[fechaRappelsMes]} ${fechaRappelsAnio}</td>                    
               <td class="custom-td">CONSIGNACIÓN</td>                    
            </tr>
            <tr>
               <td class="${(id2) ? 'custom-td-2' : 'custom-td text-danger'}">${id2 || "NO DISPONIBLE"}</td>
               <td class="custom-td ${(name2) ? '' : 'text-danger'}">${name2 || "NO DISPONIBLE"}</td>
               <td class="custom-td-2">${formatNum(Math.round(valor1), "$")}</td>                    
               <td class="custom-td">${descProveedor} ${meses[fechaRappelsMes]} ${fechaRappelsAnio}</td>                    
               <td class="custom-td">CONSIGNACIÓN</td>                    
            </tr>`;

         if (resumen.length) {
            resumen.forEach((item, index) => {
               const neto = item.TOTAL_NOTA_COORD_N;
               const costo = item.TOTAL_NOTA_COORD_C;
               thCoords += `<th>COORDINADOR COMERCIAL ${index + 1} (${porcentajeCoorComer}%)</th>`;
               tdCoords += `
               <td>
                  <div class="d-flex gap-2 align-items-center">
                     <p class="m-0">${item.NOMBRE.split(' ')[0]}:</p>
                     <p class="m-0">${formatNum(Math.round((tipoSeguimiento === "VALOR NETO") ? neto : costo), "$")}</p>
                  </div>
               </td>`;

               tdCoords2 += renderTemplatesCoords(item.IDENTIFICACION, item.NOMBRE, item.TOTAL_NOTA_COORD_N);
            });
         }

         const tablaLiquidacion = `
         <table class="table table-bordered table-sm mx-auto" id="tablaLiquidacion" style="width: 100%;">
            <thead class="table-info">
               <tr>
                  <th>VALOR NOTA</th>
                  <th>NÚMERO NOTA</th>
                  <th>LIQUIDACIÓN FDV (${porcentajeFDV}%)</th>                      
                  <th>MERCADEO (${porcentajeMercadeo}%)</th>
                  <th>GERENCIA COMERCIAL (${porcentajeGerComer}%)</th>
                  <th>COORDINADOR CONTACT CENTER (${porcentajeCoorContac}%)</th>
                  ${thCoords}
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td>${formatNum(VALOR_NOTA, "$")}</td>
                  <td>${NUMERO_NOTA}</td>
                  <td>${formatNum(Math.round(liquidacG), "$")}</td>
                  <td>${formatNum(Math.round(mercadeo), "$")}</td>
                  <td>${formatNum(Math.round(gerenciaC), "$")}</td>
                  <td>${formatNum(Math.round(coordCont), "$")}</td>
                  ${tdCoords}
               </tr>
            </tbody>                       
         </table>`;
         $('#contenedorTablaLiquidacion').html(tablaLiquidacion);        

         let tablaLiquidacionZonas = `
         <table class="table table-bordered table-hover table-sm mx-auto" id="tablaLiquidacionZonas" style="width: 60%;">
            <thead class="table-info">
               <tr>
                  <th colspan="4">RAPPELS</th>
                  <th class="custom-td" colspan="4">${descProveedor} ${meses[fechaRappelsMes]} ${fechaRappelsAnio}</th>                           
               </tr>
               <tr>
                  <th colspan="8" style="background-color: white;"></th>                            
               </tr>
               <tr>
                  <th>ZONA</th>
                  <th>NOMBRE ZONA</th>
                  <th>VALORES</th>
                  <th>% LIQUIDACIÓN</th>                            
                  <th>VALOR ZONA</th>
                  <th>VALOR X CADA UNO</th>                            
               </tr>
            </thead>
            <tbody>`;

         let tablaLiquidacionConsolidados = `
         <h5 class="text-center text-green mb-3">CONSOLIDADO BENEFICIARIOS - LIQUIDACIÓN</h5>
         <table class="table table-bordered table-hover table-sm mx-auto" id="tablaLiquidacionZonas" style="width: 60%;">
            <thead class="table-info">
               <tr>
                  <th>CEDULA</th>
                  <th>BENEFICIARIO</th>
                  <th>VALOR INCENTIVO</th>
                  <th>NOTA</th>                            
                  <th>MEDIO</th>
               </tr>
            </thead>
            <tbody> 
            ${renderTemplatesCoords(gerenteMercadeo[0]?.IDENTIFICACION, gerenteMercadeo[0]?.NOMBRE, mercadeo)}
            ${renderTemplatesCoords(gerenteVentas[0]?.IDENTIFICACION, gerenteVentas[0]?.NOMBRE, gerenciaC)}
            ${renderTemplatesCoords(coordContact[0]?.IDENTIFICACION, coordContact[0]?.NOMBRE, coordCont)}
            ${tdCoords2}`;

         if (tipoSeguimiento === "VALOR NETO") {
            resp.data.forEach(item => {
               const ZI = zonasParejas.filter(itemPareja => itemPareja.zona === item.ZONA);
               const i1 = ZI[0]?.integrantes[0] || "";
               const i2 = ZI[0]?.integrantes[1] || "";
               const porcentajeVenta = (parseInt(item.VALOR_NETO) / cuotaActual) * 100;
               const incentivoZona = (liquidacG * porcentajeVenta) / 100;
               const valorCadaVendedor = incentivoZona / 2;

               tablaLiquidacionZonas += `
               <tr>
                  <td class="custom-td-2">${item.ZONA}</td>
                  <td class="custom-td">${item.ZONA_DESCRIPCION}</td>
                  <td class="custom-td-2">${formatNum(item.VALOR_NETO, "$")}</td>
                  <td class="custom-td-2">${porcentajeVenta.toFixed(2)}%</td>
                  <td class="custom-td-2">${formatNum(Math.round(incentivoZona), "$")}</td>
                  <td class="custom-td-2">${formatNum(Math.round(valorCadaVendedor), "$")}</td>                               
               </tr>`;

               tablaLiquidacionConsolidados += renderTemplatesCoords2(i1.IDENTIFICACION, i2.IDENTIFICACION, i1.NOMBRE, i2.NOMBRE, valorCadaVendedor);
            });
            tablaLiquidacionZonas += `
               </tbody>                       
            </table>`;
            $('#contenedorTablaLiquidacionZonas').html(tablaLiquidacionZonas);

            tablaLiquidacionConsolidados += `
               </tbody>                       
            </table>`;
            $('#contenedorTablaLiquidacionConsolidados').html(tablaLiquidacionConsolidados);
         } else {
            resp.data.forEach(item => {
               const ZI = zonasParejas.filter(itemPareja => itemPareja.zona === item.ZONA);
               const i1 = ZI[0]?.integrantes[0] || "";
               const i2 = ZI[0]?.integrantes[1] || "";
               const porcentajeVenta = (parseFloat(item.COSTO_INTERNO) / cuotaActual) * 100;
               const incentivoZona = (liquidacG * porcentajeVenta) / 100;
               const valorCadaVendedor = incentivoZona / 2;

               tablaLiquidacionZonas += `
               <tr>
                  <td class="custom-td-2">${item.ZONA}</td>
                  <td class="custom-td">${item.ZONA_DESCRIPCION}</td>
                  <td class="custom-td-2">${formatNum(item.COSTO_INTERNO, "$")}</td>
                  <td class="custom-td-2">${porcentajeVenta.toFixed(2)}%</td>
                  <td class="custom-td-2">${formatNum(Math.round(incentivoZona), "$")}</td>
                  <td class="custom-td-2">${formatNum(Math.round(valorCadaVendedor), "$")}</td>                            
               </tr>`;

               tablaLiquidacionConsolidados += renderTemplatesCoords2(i1.IDENTIFICACION, i2.IDENTIFICACION, i1.NOMBRE, i2.NOMBRE, valorCadaVendedor);
            });
            tablaLiquidacionZonas += `
               </tbody>                       
            </table>`;
            $('#contenedorTablaLiquidacionZonas').html(tablaLiquidacionZonas);

            tablaLiquidacionConsolidados += `
               </tbody>                       
            </table>`;
            $('#contenedorTablaLiquidacionConsolidados').html(tablaLiquidacionConsolidados);
         }
      } else {
         const texto = `<p class="lead text-center">Liquidación no disponible, aún no se fija el valor de la nota!!!</p>`;
         $('#contenedorTablaLiquidacion').html(texto);
      }

   } catch (error) {
      console.error(error);
   } finally {
      dissminSwal();
   }
}
// FUNCIÓN PARA GESTONAR DATOS DE LA NOTA
const gestionarDatosNota = async () => {
   const idSeguimiento = $('#seguimientoOculto').val();
   const numeroNota = $('#numeroNota').val();
   const valorNota = $('#valorNota').val().replace(/^\$|\.|,/g, "");

   const item = JSON.parse(sessionStorage.ItemSeguimiento);

   if (!numeroNota || !valorNota) {
      Swal.fire("Campos requeridos", "Se debe diligenciar el número y valor de la nota", "error");
      return;
   }

   const resp = await enviarPeticion({
      op: "G_DATOS_NOTAS",
      link: "../models/SeguimientoIncentivos.php",
      idSeguimiento
   });

   const { NUMERO_NOTA, VALOR_NOTA } = resp.data[0];

   if (NUMERO_NOTA === "0" || VALOR_NOTA === "0") {
      const result = await confirmAlert("Asignar Datos Nota", "Se asignará al seguimiento los datos relacionados a la nota");
      if (!result.isConfirmed) return;

      const confirmUpdate = await enviarPeticion({
         op: "U_DATOS_NOTA",
         link: "../models/SeguimientoIncentivos.php",
         idSeguimiento,
         numeroNota,
         valorNota
      });
      if (confirmUpdate.ok) {
         $('#numeroNota').val("");
         $('#valorNota').val("");
         Swal.fire("Asignar Datos Nota", "Se asignaron los datos de la nota correctamente", "success");
         gestionarSeguimiento(item);
      }
   } else {
      const result = await confirmAlert("Actualizar Datos Nota", "Ya existe número y valor de la nota, ¿Está seguro(a) de realizar el cambio de los datos asignados?");
      if (!result.isConfirmed) return;

      const confirmUpdate = await enviarPeticion({
         op: "U_DATOS_NOTA",
         link: "../models/SeguimientoIncentivos.php",
         idSeguimiento,
         numeroNota,
         valorNota
      });
      if (confirmUpdate.ok) {
         $('#numeroNota').val("");
         $('#valorNota').val("");
         Swal.fire("Actualizar Datos Nota", "Se actualizaron los datos de la nota correctamente", "success");
         gestionarSeguimiento(item);
      }
   }

   getResumenIncentivos();
}
// FUNCIÓN PARA ACTUALIZAR LOS DATOS BASE
const actualizarDatos = async () => {
   let { idSeguimiento, cuota, impacto, fechaInicio, fechaFinal } = JSON.parse(sessionStorage.ItemActualizar);
   cuota = cuota.replace(/^\$|\.|,/g, "");
   const cuotaValor = $('#cuotaValor').val().replace(/^\$|\.|,/g, "");
   const cuotaImpacto = $('#cuotaImpacto').val();
   const fechaInicioEdi = $('#fechaInicioEdi').val();
   const fechaFinalEdi = $('#fechaFinalEdi').val();

   console.log({ cuota, cuotaValor, impacto, cuotaImpacto, fechaInicio, fechaInicioEdi, fechaFinal, fechaFinalEdi });

   if (cuota === cuotaValor && impacto === cuotaImpacto && fechaInicio === fechaInicioEdi && fechaFinal === fechaFinalEdi) {
      $('#modalSeguimiento').modal('hide');
      return;
   }

   const result = await confirmAlert("Actualizar Datos", "Se actualizarán los datos... ¿Desea continuar?");
   if (!result.isConfirmed) return;

   const resp = await enviarPeticion({
      op: "U_DATOS_BASE",
      link: "../models/SeguimientoIncentivos.php",
      idSeguimiento,
      cuotaValor,
      cuotaImpacto,
      fechaInicioEdi,
      fechaFinalEdi
   });

   if (resp.ok) {
      Swal.fire("Actualizar Datos", "Los datos se actualizaron correctamente", "success");
      getDatosBase();
      $('#nav-profile-tab').attr('disabled', true);
      $('#nav-profile-tab-2').attr('disabled', true);
      $('#modalSeguimiento').modal('hide');
   }
}

// EJECUCIÓN DE FUNCIONALIDADES
$(function () {
   getDatosBase();

   setTimeout(() => {
      $("#oficina").select2();
      $('#proveedor').select2({
         placeholder: "Seleccione uno o varios grupo de articulos",
         allowClear: true
      });
   }, 500);

   const oficinas = OficinasVentas('S');
   $("#oficina").html(oficinas);

   seteoFechas();

   getGruposArticulos();  
   
   getBeneficiarios2();

   $('#cuotaValores, #valorNota, #cuotaValor').on('input', function () {
      let value = $(this).val().replace(/[^0-9]/g, '');
      if (value) value = parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 0 });
      if (value) $(this).val("$" + value);
      else $(this).val("");
   });

   $("#cuotaImpactos, #numeroNota, #cuotaImpacto").on("input", function () {
      this.value = this.value.replace(/\D/g, "");
   });

   $('#nav-profile-tab').attr('disabled', true);
   $('#nav-profile-tab-2').attr('disabled', true);

   $('#guardarDatos').click(function () {
      guardarDatosBase();
   });

   $('#guardarNota').click(function () {
      gestionarDatosNota();
   });

   $('#actualizarDatos').click(function () {
      actualizarDatos();
   });
});