function LoadImg(texto) {
   const html = `
   <center>
      <figure><img src="../resources/icons/preloader.gif" class="img-responsive"/></figure>
      <figcaption>${texto}</figcaption>'
   </center>`;
   $(".centrado-porcentual").html(html);
   $(".form-control").attr("disabled", true);
   $(".centrado-porcentual").show();
   $("#Bloquear").show();
}

function UnloadImg() {
   $("#Bloquear").hide();
   $(".centrado-porcentual").hide();
   $(".form-control").attr("disabled", false);
}

function permisosZonas() {
   let rol = $("#Rol").val();
   let sw = 0;
   $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      async: false,
      dataType: "json",
      data: {
         op: "S_PERMISO_ZONA",
         rol
      },
      success: function (data) {
         if (data.length > 0) sw = 1
      }
   }).fail(function (data) {
      console.error(data);
   });
   return sw;
}

function zonasVentas(oficina) {
   let sw = permisosZonas();
   let idUsr = $("#TxtIdu").val();

   $.ajax({
      type: "POST",
      url: "../models/Presupuesto.php",
      async: false,
      dataType: "json",
      data: {
         op: "S_ZONAS_VENTA",
         sw,
         idUsr,
         oficina
      },
      success: function (data) {
         let zonas = '';
         if (data.length > 0) {
            if (sw == 1) zonas = `<option value="0">000000 - TODAS</option>`;

            for (let i = 0; i < data.length; i++) {
               zonas += `<option value="${data[i].zona}">${data[i].zona} - ${data[i].descripcion}</option>`;
            }
         } else {
            zonas = `<option value="999999">NO TIENE ZONA ASIGNADA SOLICITAR AL ADMINISTRADOR</option>`;
         }
         $("#txtZonas2").html(zonas);
      }
   }).fail(function (data) {
      console.error(data);
   });
}

function CargarDate() {
   $.ajax({
      url: "../models/Presupuesto.php",
      global: false,
      type: "POST",
      data: ({ op: "l_date" }),
      dataType: "html",
      async: false,
      success: function (data) {
         if (data != "") {
            let datos = data.split("%&");

            let max_a = parseInt(datos[1]);
            let max_m = parseInt(datos[0]);

            for (let i = max_a; i >= 2008; i--) {
               $("#ano").append(`<option value="${i}">${i}</option>`);
            }

            for (let j = 1; j <= 12; j++) {
               if (j == max_m) $("#meses").append(`<option value="${j}" selected>${ObtenerMes(j)}(Actual)</option>`);
               else $("#meses").append(`<option value="${j}">${ObtenerMes(j)}</option>`);
            }
         }
      }
   });
}

function sortJSON(data, key, orden) {
   return data.sort(function (a, b) {
      let x = a[key];
      let y = b[key];

      if (orden === 'asc') return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      if (orden === 'desc') return ((x > y) ? -1 : ((x < y) ? 1 : 0));
   });
}

function ConsultarPresupuesto() {	
	let ClasePedido = $("#txtClasePedido").val();
	let Oficina = $("#SlcOficina").val();
	let zona = $("#txtZonas2").val();
	let mes = $("#meses").val();
	let anio = $("#ano").val();

	$.ajax({     
		url: "../models/FidelizacionAcida.php",
		global: false,
		type: "POST",
		data: {
         op:"S_CUMPLIMIENTO_ACIDO" ,
         mes: mes,
         anio: anio,
         zona: zona,
         Oficina: Oficina,
         ClasePedido: ClasePedido
      },
      dataType : "json",
      beforeSend: function() {
         LoadImg('Consultando Información');
         $('#TableView tbody').empty();
      },
      async: true,
      success: function(resp){ 
         UnloadImg(); 			  
         let data = resp.datos;
         let vlr_total_trimestre = resp.vlr_total_trimestre;			  
         sortJSON(data, 'prom_venta_3mes', 'desc');
			    
         if(data.length) {
            let s_total_pre = 0;
            let s_total_eje = 0;
            let s_total_v = 0;
            let s_total_t = 0;
            let s_total_pcj = 0;
            let t_total_pre = 0;
            let t_total_pcj = 0;
            let t_total_eje = 0;
            let t_total_t = 0;
            let t_total_v = 0;
            let paginas_total = 0;
            let sum_prom_vta_3 = 0;
            let sum_prom_vta_6 = 0;
            let total_trimestre = 0;
            let total_presupuesto_cartera = 0;
            let total_recaudo = 0;
            let suma_part = 0;

            let NewArray = [];
            let NewArrayReal = [];
					
            let venta100 = 0;
            let venta75 = 0;
            let venta50 = 0;
            let venta25 = 0;
            let ventaTot = 0;
            
            let cliente100 = 0;
            let cliente75 = 0;
            let cliente50 = 0;
            let cliente25 = 0;
            let cliente0 = 0; 
            let clienteTot = 0;
            let pcj = 0;

            for(let i = 0; i < data.length; i++) {							
               let d = data[i];

               if (d.valor_presupuesto > 0) {
                  pcj = (d.ejecutado * 100) / parseFloat(d.valor_presupuesto);
                  pcj = Math.round(pcj * 100) / 100;
               } else {
                  pcj=0; 
               }

               let fecha = new Date();
               let diaActual = fecha.getDate();
               let variacion = 0;

               if (d.prom_venta_3mes > 0) {
                  variacion = d.ejecutado/((d.prom_venta_3mes/30)*diaActual);
                  variacion = Math.round(variacion*100)/100;
               }						   
						 
               let vlr_participacion = Math.round(((d.prom_venta_3mes / vlr_total_trimestre) * 100) * 100) / 100;
		
               let det = {
                  n_filas: d.n_filas,
                  codigo_sap: d.codigo_sap,
                  nit: d.nit,
                  nombres: d.nombres,
                  razon_comercial: d.razon_comercial,
                  departamento: d.departamento,
                  ciudad: d.ciudad,
                  valor_presupuesto: d.valor_presupuesto,
                  ejecutado: d.ejecutado,
                  pcj_cumplimiento: pcj,
                  pre_cartera: d.presupuesto_cartera,
                  recaudo: d.recaudo,
                  recaudo_real: d.recaudo_real,
                  vis_vendedor: d.vis_vendedor,
                  vis_televendedor: d.vis_televendedor,
                  vendedor: d.vendedor,
                  televendedor: d.televendedor,
                  prom_venta_3mes: d.prom_venta_3mes,
                  prom_venta_6mes: d.prom_venta_6mes,
                  oficina_ventas: d.oficina_ventas,
                  variacion: variacion,
                  participacion: vlr_participacion,
                  zona_ventas: d.zona_ventas,
                  zona_descripcion: d.zona_descripcion,
                  // Acides semanal
                  ventas_dias_1_7: d.ventas_dias_1_7,
                  ventas_dias_8_14: d.ventas_dias_8_14,
                  ventas_dias_15_21: d.ventas_dias_15_21,
                  ventas_dias_22_31: d.ventas_dias_22_31
               }

               NewArray.push(det);
               s_total_pre = s_total_pre + parseFloat(d.valor_presupuesto);
               s_total_eje = s_total_eje + parseFloat(d.ejecutado);
               s_total_v = s_total_v   + parseInt(d.vis_vendedor);
               s_total_t = s_total_t   + parseInt(d.vis_televendedor);
               sum_prom_vta_3 = sum_prom_vta_3 + parseFloat(d.prom_venta_3mes); 
               sum_prom_vta_6 = sum_prom_vta_6 + parseFloat(d.prom_venta_6mes); 
               t_total_pre = 0;
               t_total_eje = 0;
               t_total_t = 0;
               t_total_v = 0;
               total_presupuesto_cartera = total_presupuesto_cartera + parseFloat(d.presupuesto_cartera);
               total_recaudo=total_recaudo+parseFloat(d.recaudo);							    
            } 
					
            // Recaulculando participacion y tipo					
            for(let x = 0; x <= NewArray.length-1; x++) {						
               let d = NewArray[x];
               let Cla = '';
						
               suma_part = suma_part + parseFloat(d.participacion);
               suma_part = Math.round(suma_part * 100) / 100;
               Cla = CalcularClasificacion(suma_part, d.prom_venta_3mes);
						
               let SlcClasifica = $("#Clasificaciones").val();
						
					let sem1 = 0;
					let sem2 = 0;
					let sem3 = 0;
					let sem4 = 0;
					let fidelizacion = 0;
					let frecuencia   = 0;

               if(parseFloat(d.ventas_dias_1_7)   > 0){sem1 = 1;}
               if(parseFloat(d.ventas_dias_8_14)  > 0){sem2 = 1;}
               if(parseFloat(d.ventas_dias_15_21) > 0){sem3 = 1;}
               if(parseFloat(d.ventas_dias_22_31) > 0){sem4 = 1;}
                  
               frecuencia   = parseInt(sem1)+parseInt(sem2)+parseInt(sem3)+parseInt(sem4);
               fidelizacion = (frecuencia/4);
               fidelizacion = Math.round(fidelizacion*100)+'%';
					
               switch (frecuencia) {
                  case 4: { venta100 += parseFloat(d.ejecutado); cliente100++; } break;//100%
                  case 3: { venta75 += parseFloat(d.ejecutado); cliente75++; } break;//75%
                  case 2: { venta50 += parseFloat(d.ejecutado); cliente50++; } break;//50%
                  case 1: { venta25 += parseFloat(d.ejecutado); cliente25++; } break;//25%
                  case 0: { cliente0++; } break;//25%
               }
               
               clienteTot = (cliente100 + cliente75 + cliente50 + cliente25 + cliente0);
               ventaTot = (venta100 + venta75 + venta50 + venta25);
						
               let det = {
                  n_filas: d.n_filas,
                  codigo_sap: d.codigo_sap,
                  nit: d.nit,
                  nombres: d.nombres,
                  razon_comercial: d.razon_comercial,
                  departamento: d.departamento,
                  ciudad: d.ciudad,
                  valor_presupuesto: parseFloat(d.valor_presupuesto),
                  ejecutado: d.ejecutado,
                  pcj_cumplimiento: d.pcj_cumplimiento,
                  pre_cartera: d.pre_cartera,
                  recaudo: d.recaudo,
                  recaudo_real: d.recaudo_real,
                  vis_vendedor: d.vis_vendedor,
                  vis_televendedor: d.vis_televendedor,
                  vendedor: d.vendedor,
                  televendedor: d.televendedor,
                  prom_venta_3mes: parseFloat(d.prom_venta_3mes),
                  prom_venta_6mes: d.prom_venta_6mes,
                  oficina_ventas: d.oficina_ventas,
                  variacion: d.variacion,
                  participacion: d.participacion,
                  ac_participacion: suma_part,
                  tipo: Cla,
                  zona_ventas: d.zona_ventas,
                  zona_descripcion: d.zona_descripcion,
                  // Acides semanal
                  ventas_dias_1_7: d.ventas_dias_1_7,
                  ventas_dias_8_14: d.ventas_dias_8_14,
                  ventas_dias_15_21: d.ventas_dias_15_21,
                  ventas_dias_22_31: d.ventas_dias_22_31,
                  frecuencia: frecuencia,
                  fidelizacion: fidelizacion
               };

               if (SlcClasifica != '-') {
                  if (Cla == SlcClasifica) NewArrayReal.push(det);   
               } else {
                  NewArrayReal.push(det);
               }						
            }					
			        
            $("#p_pres_cartera").html(formatNum(total_presupuesto_cartera,''));
            $("#p_cump_cartera").html(formatNum(total_recaudo,'$'));
            $("#p_cump_venta").html(formatNum(s_total_eje,'$'));
            $("#p_pres_venta").html(formatNum(s_total_pre,'$'));

            if ($.fn.DataTable.isDataTable('#TableView')) {
               table.destroy();
               $('#TableView').empty();
            }

            table=$('#TableView').DataTable({						
               data: NewArrayReal,
               dom: `<"top-section d-flex justify-content-between mb-3"<"buttons-group"B><"search-group"f>>rt
               <"bottom-section d-flex justify-content-between mt-3"<"info-group"i><"pagination-group"p>>`,						
               deferRender: true,
               pageLength: 1000,
               scrollX: true, 
               scrollCollapse: true,
               scrollY: "70vh", 
               ordering: false,
               language: {
                  info: '[ _START_ A _END_ ] De _TOTAL_ Registros',
                  infoEmpty: '0 A 0 De 0 ',
                  infoFiltered: '( Total _MAX_ )',
                  zeroRecords: 'No se encontraron registros',
                  paginate: {
                        first: 'Prr<span>T</span>',
                        last: 'Ult',
                        next: 'Sig',
                        previous: 'Ant'
                  },
                  processing: "Procesando...",						
               },
               buttons: [
                  { extend: 'copy', className: 'btn btn-secondary' },
                  { extend: 'csv', className: 'btn btn-danger' },
                  { extend: 'excel', className: 'btn btn-success' }
               ],
               footerCallback: function ( row, data, start, end, display ) {
                  let api = this.api(), data;
                  console.log(api);
                  let intVal = function (i) {
                     return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                  };

                  let TotalPresupuestoVentas = api.column(7).data().reduce((a, b) => intVal(a) + intVal(b), 0 );							
						let TotalCumplimientoVentas = api.column(8).data().reduce((a, b) => intVal(a) + intVal(b), 0 );							
                  let TotalPresupuestoCartera = api.column(10).data().reduce((a, b) => intVal(a) + intVal(b), 0 );
					   let TotalCumplimientoCartera = api.column(11).data().reduce((a, b) => intVal(a) + intVal(b), 0 );
						let TotalPendienteCartera = api.column(12).data().reduce((a, b) => intVal(a) + intVal(b), 0 );
						let TotalVisTeleventas = api.column(13).data().reduce((a, b) => intVal(a) + intVal(b), 0 );
						let TotalVisVentas = api.column(14).data().reduce((a, b) => intVal(a) + intVal(b), 0 );
						let Total_3mes = api.column(17).data().reduce((a, b) => intVal(a) + intVal(b), 0 );
						let Total_6mes = api.column(18).data().reduce((a, b) => intVal(a) + intVal(b), 0 );
							
                  let s_total_pcj = 0;
                  if(TotalPresupuestoVentas > 0) {
                     s_total_pcj = ((s_total_eje * 100) / s_total_pre);
                     s_total_pcj = Math.round(s_total_pcj * 100) / 100;
                  }
               },
               columns: [
                  { data: 'n_filas', title: 'FILAS' },
                  { data: 'codigo_sap', title: 'CODIGO' },
                  { data: 'nit', title: 'NIT' },
                  { data: 'nombres', title: 'CLIENTE' },
                  { data: 'razon_comercial', title: 'RAZON' },
                  { data: 'departamento', title: 'DEPARTAMENTO' },
                  { data: 'ciudad', title: 'CIUDAD' },
                  { data: 'valor_presupuesto', title : 'PROYECTADO', render: $.fn.dataTable.render.number(',', '.', 0, '$') },
                  { data: 'ejecutado', title: 'EJECUTADO', render: $.fn.dataTable.render.number(',', '.', 0, '$') },
                  { data: 'pcj_cumplimiento', title: '%CUMPLIMIENTO' },                  
                  { data: 'fidelizacion', title: 'FRECUENCIA_ACIDA', className: 'alert-success' },
                  { data: 'ventas_dias_1_7', title: 'SEMANA 1 (1-7)', render: $.fn.dataTable.render.number(',', '.', 0, '$'), className: 'alert-warning' },
                  { data: 'ventas_dias_8_14', title: 'SEMANA 2 (8-14)', render: $.fn.dataTable.render.number(',', '.', 0, '$'), className: 'alert-warning' },
                  { data: 'ventas_dias_15_21', title: 'SEMANA 3 (15-21)', render: $.fn.dataTable.render.number(',', '.', 0, '$'), className: 'alert-warning' },
                  { data: 'ventas_dias_22_31', title: 'SEMANA 4 (22-FIN)', render: $.fn.dataTable.render.number(',', '.', 0, '$'), className: 'alert-warning' },
                  { data: 'frecuencia', title: 'FRECUENCIA_COMPRA', className: 'alert-success' },                  
                  { data: 'pre_cartera', title: 'PRESUPUESTO CARTERA', render: $.fn.dataTable.render.number(',', '.', 0, '$') },
                  { data: 'recaudo', title: 'RECAUDO', render: $.fn.dataTable.render.number(',', '.', 0, '$') },
                  { data: 'recaudo_real', title: 'PENDIENTE RECAUDO', render: $.fn.dataTable.render.number(',', '.', 0, '$') },
                  { data: 'vis_vendedor', title: 'V.PROGRAMADA' },
                  { data: 'vis_televendedor', title: 'T.PROGRAMADA' },
                  { data: 'vendedor', title: 'VENDEDOR' },
                  { data: 'televendedor', title: 'TELEVENDEDOR' },
                  { data: 'prom_venta_3mes', title: 'PROM VTA 3 MESES', render : $.fn.dataTable.render.number(',', '.', 0, '$') },
                  { data: 'prom_venta_6mes', title: 'PROM VTA 6 MESES', render : $.fn.dataTable.render.number(',', '.', 0, '$') },
                  { data: 'oficina_ventas', title: 'OFICINA' },
                  { data: 'variacion', title: 'VARIACION VS PROMEDIO' },
                  { data: 'participacion', title: 'PARTICIPACION' },
                  { data: 'ac_participacion', title: 'ACUM. PARTICIPACION' },
                  { data : 'tipo', title: 'TIPO CLIENTE' },
                  { data : 'zona_ventas', title: 'ZONA' },
                  { data : 'zona_descripcion', title: 'ZONA DESCRIPCION' }
               ]
					 
            });					
					 
            let tablaAcidez = `
            <div class="card tabla-estilo-wrapper" style="max-height: 70vh"> 
               <table width="100%" class="table tabla-estilo mb-0">
                  <thead>
                     <tr>
                        <th colspan="7" scope="row" style="background-color: #CFF4FC !important; color: #055160;"> REPORTE FIDELIZACION ACIDA </th>
                     <tr>
                  </thead>
                  <tbody>
                     <tr>
                        <th class="text-green size-13" scope="row"> PORCENTAJE DE FIDELIZACION ACIDA </th>
                        <th class="text-green">100%</th>
                        <th class="text-green">75%</th>
                        <th class="text-green">50%</th>
                        <th class="text-green">25%</th>
                        <th class="text-green">0%</th>
                        <th class="text-green">TOTALES</th>
                     </tr>
                     <tr>
                        <th class="text-green size-13" scope="row"> CANT DE CLIENTES </th>
                        <td>${cliente100}</td>
                        <td>${cliente75}</td>
                        <td>${cliente50}</td>
                        <td>${cliente25}</td>
                        <td>${cliente0}</td>
                        <td>${clienteTot}</td>
                     </tr>
                     <tr>
                        <th class="text-green size-13" scope="row"> PARTICIPACION CLIENTES % </th>
                        <td>${Math.round(((cliente100 / clienteTot) * 100) * 100) / 100}</td>
                        <td>${Math.round(((cliente75 / clienteTot) * 100) * 100) / 100}</td>
                        <td>${Math.round(((cliente50 / clienteTot) * 100) * 100) / 100}</td>
                        <td>${Math.round(((cliente25 / clienteTot) * 100) * 100) / 100}</td>
                        <td>${Math.round(((cliente0 / clienteTot) * 100) * 100) / 100}</td>
                        <td>100%</td>
                     </tr>
                     <tr>
                        <th class="text-green size-13" scope="row"> VALOR VENTA </th>
                        <td>${formatNum(venta100, '$')}</td>
                        <td>${formatNum(venta75, '$')}</td>
                        <td>${formatNum(venta50, '$')}</td>
                        <td>${formatNum(venta25, '$')}</td>
                        <td>${formatNum(0, '$')}</td>
                        <td>${formatNum(ventaTot, '$')}</td>
                     </tr>
                     <tr>
                        <th class="text-green size-13" scope="row"> PARTICIPACION VENTAS % </th>
                        <td>${Math.round(((venta100 / ventaTot) * 100) * 100) /100}</td>
                        <td>${Math.round(((venta75 / ventaTot) * 100) * 100) /100}</td>
                        <td>${Math.round(((venta50 / ventaTot) * 100) * 100) /100}</td>
                        <td>${Math.round(((venta25 / ventaTot) * 100) * 100) /100}</td>
                        <td>${Math.round(((0 / ventaTot) * 100) * 100) /100}</td>
                        <td>100%</td>
                     </tr>
                  </tbody>
               </table>
            </div>`;

            $("#result").html("");
            $("#FilaTotales").show();
            $("#ConsolidadoAcidez").html(tablaAcidez);

         } else {
            table = $('#TableView').DataTable(); 
            table.clear().draw().destroy();								
            $("#result").html("<div class='alert alert-danger'>NO SE ENCONTRARON REGISTROS...</div>");
            $("#Paginacion").html(""); 
            $("#FilaTotales").hide();
            $("#ConsolidadoAcidez").html('');
         }
      }
   }).fail(function(data) {
      console.error(data);
      UnloadImg();
      $("#result").html("<div class='alert alert-danger'>LA CONSULTA HA TARDADO DEMASIADO, SALGA Y VUELVA A INTENTARLO...</div>");
   });
}

function CalcularClasificacion(valor, prom_3_mes) {
   let cl = "";

   if (valor >= 0 && valor <= 30) cl = "AA";
   if (valor > 30 && valor <= 50) cl = "A";
   if (valor > 50 && valor <= 80) cl = "B";

   if (valor > 80) {
      if (parseFloat(prom_3_mes) >= 2000000) cl = "C";
      else if (parseFloat(prom_3_mes) >= 500000 && parseFloat(prom_3_mes) < 2000000) cl = "D";
      else if (parseFloat(prom_3_mes) < 500000) cl = "E";
   }

   return cl;
}

function Exportar() {
   let mes = $("#meses").val();
   let ano = $("#ano").val();
   let zona = $("#txtZonas2").val();
   let oficina = $("#SlcOficina").val();
   window.open(`../resources/Excel/ExcelCumplimientoPresupuesto.php?ano=${ano}&mes=${mes}&zona=${zona}&oficina=${oficina}`, "_self");
}

function ExportExcel(e) {
   window.open('data:application/vnd.ms-excel;base64,' + $.base64.encode($("#result").html()));
   e.preventDefault();
}

function exportTableToExcel(tableID, filename = '') {
   let downloadLink;
   let dataType = 'application/vnd.ms-excel;base64';
   let tableSelect = document.getElementById(tableID);
   let tableHTML = $.base64.encode(tableSelect.outerHTML.replace(/ /g, '%20'));

   filename = filename ? filename + '.xls' : 'excel_data.xls';
   downloadLink = document.createElement("a");
   document.body.appendChild(downloadLink);

   if (navigator.msSaveOrOpenBlob) {
      let blob = new Blob(['ufeff', tableHTML], {
         type: dataType
      });
      navigator.msSaveOrOpenBlob(blob, filename);
   } else {
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
      downloadLink.download = filename;
      downloadLink.click();
   }
}

// EJECUCIÓN DE LAS FUNCIONALIDADES AL CARGAR EL DOM
$(function () {	
	$("#btn_exportar").click(function () {
		d = new Date();
		fnExcelReport('tdPresupuesto');
	});
	
	$("#fhIni, #fhFin").val(FechaActual2());

	$("#fhIni, #fhFin").datepicker({
      changeMonth: true,
      changeYear: true,
      monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio', 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      dateFormat: 'yy-mm-dd',
      width:100,
      heigth:100
   });

   if ($("#FiltroFechas").val() == 'N') {
      $("#fhIni").attr('disabled', true);
      $("#fhFin").attr('disabled', true);
   } else {
      $("#fhIni").attr('disabled', false);
      $("#fhFin").attr('disabled', false);
   }

   $("#FiltroFechas").change(function () {
      if ($("#FiltroFechas").val() == 'N') {
         $("#fhIni").attr('disabled', true);
         $("#fhFin").attr('disabled', true);
      } else {
         $("#fhIni").attr('disabled', false);
         $("#fhFin").attr('disabled', false);
      }
   });

   $("#Clasificaciones").change(function () {
		$(".tdPresupuesto tr:gt(0)").show();
      
      let filas = $(".tdPresupuesto tr:gt(0)").length;
      let Cla = $.trim($(this).val());

      if (filas > 0) {
         $(".tdPresupuesto tr:gt(0)").each(function () {
            let tmp = $(this).find("td").eq(20).html();
            if ($("#Clasificaciones").val() != '-') {
               if (Cla == tmp) $(this).show();
               else $(this).hide();
            } else {
               $(this).show();
            }
         });
		 } else {
         $(".tdPresupuesto tr:gt(0)").show();
      }
	});

   $("#SlcOficina").html(OficinasVentas('S'));

   $("#SlcOficina").change(function () {
      zonasVentas($(this).val());
   });

   zonasVentas($("#Organizacion").val());

   CargarDate();

   $("#btn_consultar").click(function () {
      ConsultarPresupuesto();
   });
});