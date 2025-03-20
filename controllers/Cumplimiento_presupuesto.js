let table = null;
function LoadImg(texto) {
	const html = `<img src="../resources/icons/preloader.gif" class="img-fluid "/><div>${texto}</div>`;
	$(".centrado-porcentual").html(html);
	$(".form-control").attr("disabled", true);
	$(".centrado-porcentual").show();
	$("#Bloquear").show();
}
//
function UnloadImg(){
	$("#Bloquear").hide();
	$(".centrado-porcentual").hide();
	$(".form-control").attr("disabled", false);
}
// FUNCIÓN PARA CARGA DE ZONAS DE VENTAS PARA CONSULTA DE PEDIDOS
function PermisosZonas() {
	const rol = $("#Rol").val();
	let sw  = 0;	
	$.ajax({
		type     : "POST",
		encoding : "UTF-8",
		url      : "../models/PW-SAP.php",
		async    : false,
		dataType : "json",
		error    : function(OBJ, ERROR, JQERROR) {
		},
		beforeSend : function() {
		},
		data: {
			op: "S_PERMISO_ZONA",
			rol
		},
		success: function(data) {
			if (data.length > 0) sw = 1;
		}
	}).fail(function(data) {
		console.error(data);
	});
	return sw;
}
//
function ZonasVentas(oficina) {	
	const sw = PermisosZonas();
	const idUsr = $("#TxtIdu").val();
    $.ajax({
		type    : "POST",
		url     : "../models/Presupuesto.php",
		async   : false,
		dataType: "json",
		beforeSend: function() {
		},
		data: {
			op: "S_ZONAS_VENTA",
			sw,
			idUsr,
			oficina
		},
		success: function(data) {
			let zonas = '';
			if (data.length) {
				if (sw == 1) zonas = '<option value="0">000000 - TODAS</option>';
				for(let i = 0; i < data.length; i++) {
					zonas += `<option value="${data[i].zona}">${data[i].zona} - ${data[i].descripcion}</option>`;
				}//for	
			} else {
				zonas = '<option value="999999">NO TIENE ZONA ASIGNADA SOLICITAR AL ADMINISTRADOR</option>';
			}
			$("#txtZonas").html(zonas);
		}
	}).fail(function(data){
		console.error(data);
	});
}
//
function CargarDate() {	
	$.ajax({     
		url      : "../models/Presupuesto.php",
		global   : false,
		type     : "POST",
		data     : {op: "l_date"},
		dataType : "html",
		async    : false,
		success  : function(data) {
			if (data) {
				let datos = data.split("%&");			
				const max_a = parseInt(datos[1]);
				const max_m = parseInt(datos[0]);
				
				for(let i = max_a; i >= 2008; i--) {
					$("#ano").append(`<option value="${i}">${i}</option>`);
				}

				for(let j = 1; j <= 12; j++) {					
					if (j == max_m) {
						$("#meses").append(`<option value="${j}" selected>${ObtenerMes(j)} (Actual)</option>`);
					} else {
						$("#meses").append(`<option value="${j}">${ObtenerMes(j)}</option>`);
					}				
				}				
			}
		}
	});	
}
//
function sortJSON(data, key, orden) {
    return data.sort(function (a, b) {
        let x = a[key];
        let y = b[key];

        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}
//
function ConsultarPresupuesto(pag) {	
  let mes = $("#meses").val();
  let anio = $("#ano").val();
  let zona = $("#txtZonas").val();
  let Oficina = $("#SlcOficina").val();	
  let ClasePedido = $("#txtClasePedido").val();
  
  $.ajax({     
		url: "../models/Cumplimiento_presupuesto.php",
		global: false,
		type: "POST",
		data: {
				op: "S_CUMPLIMIENTO_VENTA" ,
				mes,
				anio,
				zona,
				Oficina,
				ClasePedido
			},
		dataType: "json",
		beforeSend: function() {
			LoadImg('CONSULTANDO INFORMACIÓN...');
			$('#TableView tbody').empty();
		},
		async: true,
		success: function(resp) {
			UnloadImg();  
			data        = resp.datos;
			data_grupos = resp.venta_grupo;		
			data_tipos  = resp.venta_tipo;		
			//---Ventas por grupos				
			if(data_grupos.length > 0){
				var td_grupo = `<table width="100%" border="0" class="form" align="center">
								<thead>
									<tr>
									<th colspan="5">VENTAS POR GRUPO DE CLIENTES</th>
									</tr>
									<tr>
									<th>Grupo</th>
									<th>Venta Trimestre</th>
									<th>Venta actual</th>
									<th>Clientes</th>
									<th>Participación</th>
									</tr>
								</thead>
								<tbody>`;
					let vlr_total_trimestre = 0;
					let vlt_total_venta     = 0;
					let total_clientes      = 0;
					let total_participacion = 0;
					for(var i=0;i<data_grupos.length;i++){
						vlr_total_trimestre += parseFloat(data_grupos[i].vlr_venta_trimestre);
						vlt_total_venta     += parseFloat(data_grupos[i].vlr_venta_actual);
						total_clientes      += parseInt(data_grupos[i].n_clientes);
					}
					for(var i=0;i<data_grupos.length;i++){
						 d = data_grupos[i];
						 participacion = (parseFloat(d.vlr_venta_trimestre)/parseFloat(vlr_total_trimestre))*100;
						 total_participacion += participacion;
						 
						 td_grupo+= `<tr>
										<td>${d.grupo}</td>
										<td>${formatNum(d.vlr_venta_trimestre,'$')}</td>
										<td>${formatNum(d.vlr_venta_actual,'$')}</td>
										<td>${d.n_clientes}</td>
										<td>${formatNumberES(participacion,2,'%')}</td>
									  </tr>`;
						
					} 					
					
					td_grupo+=`<tr>
								<td><b>TOTAL</b></td>
								<td>${formatNum(vlr_total_trimestre,'$')}</td>
								<td>${formatNum(vlt_total_venta,'$')}</td>
								<td>${total_clientes}</td>
								<td>${formatNumberES(total_participacion,2,'%')}</td>
                               </tr>
                               </tbody>
                               </table>`;
					$("#td_venta_grupo").html(td_grupo);
				}else{
					
				}
			    //---Ventas por tipos
			    if(data_tipos.length > 0){
					var td_tipo = `<table width="100%" border="0" class="form" align="center">
                                    <thead>
                                      <tr>
									   <th colspan="5">VENTAS POR TIPO DE CLIENTES</th>
									  </tr>
                                      <tr>
									   <th>Clasificación</th>
									   <th>Venta Trimestre</th>
                                       <th>Venta actual</th>
									   <th>Clientes</th>
                                       <th>Participación</th>
									  </tr>
                                    </thead>
                                    <tbody>`;
					let vlr_total_trimestre = 0;
					let vlt_total_venta     = 0;
					let total_clientes      = 0;
					let total_participacion = 0;
					for(var i=0;i<data_tipos.length;i++){
						vlr_total_trimestre += parseFloat(data_tipos[i].vlr_venta_trimestre);
						vlt_total_venta     += parseFloat(data_tipos[i].vlr_venta_actual);
						total_clientes      += parseInt(data_tipos[i].n_clientes);
					}
					for(var i=0;i<data_tipos.length;i++){
						 d = data_tipos[i];
						 participacion = (parseFloat(d.vlr_venta_trimestre)/parseFloat(vlr_total_trimestre))*100;
						 total_participacion += participacion;
						 
						 td_tipo+= `<tr>
										<td>${d.clasificacion}</td>
										<td>${formatNum(d.vlr_venta_trimestre,'$')}</td>
										<td>${formatNum(d.vlr_venta_actual,'$')}</td>
										<td>${d.n_clientes}</td>
										<td>${formatNumberES(participacion,2,'%')}</td>
									  </tr>`;
						
					} 					
					
					td_tipo+=`<tr>
								<td><b>TOTAL</b></td>
								<td>${formatNum(vlr_total_trimestre,'$')}</td>
								<td>${formatNum(vlt_total_venta,'$')}</td>
								<td>${total_clientes}</td>
								<td>${formatNumberES(total_participacion,2,'%')}</td>
                               </tr>
                               </tbody>
                               </table>`;
					$("#td_venta_tipo").html(td_tipo);
				}else{
					
				}
			    if(data.length>0){
					sortJSON(data,'prom_venta_3mes','desc');
					//variables 
					let presupuesto_zona           = resp.presupuesto_zona[0].valor_presupuesto;
					let s_total_pre                = 0;
					let s_total_eje                = 0;	
					let s_total_v                  = 0;
					let s_total_t                  = 0;
					let s_total_pcj                = 0;	
				    let t_total_pre                = 0;
					let t_total_pcj                = 0;
					let t_total_eje                = 0;
					let t_total_t                  = 0;
					let t_total_v                  = 0;
					let paginas_total              = 0;
					let sum_prom_vta_3             = 0;
					let sum_prom_vta_6             = 0;
					let total_trimestre            = 0;
					let total_presupuesto_cartera  = 0;
					let total_recaudo              = 0;  
					let suma_part                  = 0;
					let DiasLaborales              = 0;
					let DiasLaboralesTranscurridos = 0;
					//let vlr_participacion		   = 0;
					let PromDiaVentas              = 0;
				    let PromDiaTeleVentas          = 0;
					let NewArray                   = [];
					let NewArrayReal               = [];
					//--------
					let cli_panel = 0;
					let cli_imp   = 0;					
					//Potencial de compra variables					
					let ClientesCumplenPPTO = 0;
					let SumaPotencial       = 0;
					let SumaPromedio3mes    = 0;
					let SumaPromedio6mes    = 0;
					
					for(var i=0;i<data.length;i++){						 
						 d = data[i];
						 if(d.valor_presupuesto>0){
							 pcj=(d.ejecutado*100)/parseFloat(d.valor_presupuesto);
						     pcj=Math.round(pcj*100)/100;
						 }else{
							 pcj=0; 
						 }
						 let fecha = new Date();
						 let diaActual = fecha.getDate();
				
						 let variacion = 0;
						
						 if(d.prom_venta_3mes>0){
						 //Calculo anterior
						 // variacion = d.ejecutado/((d.prom_venta_3mes/30)*diaActual);
						 // variacion = Math.round(variacion*100)/100;
						 //2023-10-09 se ajusta calculo por solicitud de raul gomez.
						    variacion = ((d.prom_venta_3mes/d.prom_venta_6mes)-1)*100;
							variacion = Math.round(variacion*100)/100;
						 }						  
						 
						
						let v_optimas = 0;
						let t_optimas = 0;

						let v_pcj_cum = 0;
						let t_pcj_cum = 0;
						let pcj_potencial = 0;
						switch(d.clasificacion){
							case 'AA':{ v_optimas = d.v_aa; t_optimas = d.t_aa; }break;
							case 'A' :{ v_optimas = d.v_a; t_optimas = d.t_a; }break;
							case 'B' :{ v_optimas = d.v_b; t_optimas = d.t_b; }break;
							case 'C' :{ v_optimas = d.v_c; t_optimas = d.t_c; }break;
							case 'D' :{ v_optimas = d.v_d; t_optimas = d.t_d; }break;
							case 'E' :{ v_optimas = d.v_e; t_optimas = d.t_e; }break;
							default  :{ v_optimas = 0; t_optimas = 0; }break;
						}						
						
						suma_part = suma_part+parseFloat(d.participacion);
						suma_part = Math.round(suma_part*100)/100;
						
						if(parseFloat(d.potencial) >= 3000000){//potencial mayor a 3 millones solicitado por Raul Gomez 2023-07-28
							pcj_potencial = (parseFloat(d.prom_venta_3mes)/parseFloat(d.potencial))*100;
						}
				
						if(parseInt(v_optimas) < parseInt(d.objetivo_ventas)){
							v_optimas = d.objetivo_ventas;
						}	
						
						if(parseInt(t_optimas) < parseInt(d.objetivo_televentas)){
							t_optimas = d.objetivo_televentas;
						}	
						
						if(v_optimas > 0){v_pcj_cum = Math.round(((d.vis_vendedor_c/v_optimas)*100)*100)/100;}
						if(t_optimas > 0){t_pcj_cum = Math.round(((d.vis_televendedor_c/t_optimas)*100)*100)/100;}						
						
					    SlcClasifica = $("#Clasificaciones").val();
						
                        PromDiaVentas     += v_optimas;
						PromDiaTeleVentas += t_optimas;
						//Potencial de compra
						if(pcj >= 100){
							ClientesCumplenPPTO++;
						}
						SumaPotencial    += parseFloat(d.potencial);
						SumaPromedio3mes += parseFloat(d.prom_venta_3mes);
					    SumaPromedio6mes += parseFloat(d.prom_venta_6mes);
		
						  let  det ={
									   'n_filas'           : d.n_filas,
									   'codigo_sap'        : d.codigo_sap,
									   'nit'               : d.nit,
									   'nombres'           : d.nombres,
									   'razon_comercial'   : d.razon_comercial,
									   'departamento'      : d.departamento,
									   'ciudad'            : d.ciudad,
									   'valor_presupuesto' : parseFloat(d.valor_presupuesto),
									   'ejecutado'         : d.ejecutado,
									   'pcj_cumplimiento'  : pcj,
									   'vis_vendedor'      : d.vis_vendedor,
									   'vis_televendedor'  : d.vis_televendedor,
									   'vis_vendedor_c'    : d.vis_vendedor_c,
									   'vis_televendedor_c': d.vis_televendedor_c,
									   'vendedor'          : d.vendedor,
									   'televendedor'      : d.televendedor,
									   'prom_venta_3mes'   : parseFloat(d.prom_venta_3mes),
									   'prom_venta_6mes'   : parseFloat(d.prom_venta_6mes),
									   'oficina_ventas'    : d.oficina_ventas,
									   'variacion'         : variacion,
									   'participacion' 	   : d.participacion,
									   'zona_ventas' 	   : d.zona_ventas,
									   'zona_descripcion'  : d.zona_descripcion,
									   't_aa'              : d.t_aa,
									   't_a'               : d.t_a, 
									   't_b'               : d.t_b, 
									   't_c'               : d.t_c, 
									   't_d'               : d.t_d, 
									   't_e'               : d.t_e, 
									   'v_aa'              : d.v_aa, 
									   'v_a'               : d.v_a, 
									   'v_b'               : d.v_b, 
									   'v_c'               : d.v_c, 
									   'v_d'               : d.v_d, 
									   'v_e'               : d.v_e,
									   'obj_televentas'    : d.objetivo_televentas,
									   'obj_ventas'        : d.objetivo_ventas,
									   'grupo1'            : d.grupo1,
									   'desc_grupo1'       : d.desc_grupo1,
									   'grupo2'            : d.grupo2,
									   'potencial'         : d.potencial,
							           'pcj_potencial'     : pcj_potencial,
							           'ac_participacion'  : suma_part,
							           'tipo'  			   : d.clasificacion,
							           'v_optimas'         : v_optimas,
						               't_optimas'         : t_optimas,
							           'v_pcj_cum'         : v_pcj_cum,
							           't_pcj_cum'         : t_pcj_cum
							  
						   }//det={
						  
						  
							if(SlcClasifica != '-'){
							if(Cla == SlcClasifica){
								NewArray.push(det);	
							}   
							}else{
								NewArray.push(det);
							}
							cli_panel++;
							if(d.ejecutado > 0){
							cli_imp++;
							}


							s_total_pre    = s_total_pre + parseFloat(d.valor_presupuesto);
							s_total_eje    = s_total_eje + parseFloat(d.ejecutado);
							s_total_v      = s_total_v   + parseInt(d.vis_vendedor);
							s_total_t      = s_total_t   + parseInt(d.vis_televendedor);
							sum_prom_vta_3 = sum_prom_vta_3 + parseFloat(d.prom_venta_3mes); 
							sum_prom_vta_6 = sum_prom_vta_6 + parseFloat(d.prom_venta_6mes); 
							DiasLaborales  = (d.DiasLaborales);
							DiasLaboralesTranscurridos = (d.DiasLaboralesTranscurridos);
				
							
							    
					    }// for
					
					
		            var data = resp.grafico_prod;
					var pluginArrayArg = new Array();
					for(var i=0; i<=data.length-1; i++){
					 var dato = new Object();
						 dato.name = data[i].descripcion;
						 dato.y    = Math.round(data[i].cantidad);
						 pluginArrayArg.push(dato);
					}
					jsonArray = JSON.parse(JSON.stringify(pluginArrayArg));
					// Create the chart
					Highcharts.chart('DivGrafico', {
					chart: {
						type: 'column'
					},
					title: {
						text: 'TOP 10 DE PRODUCTOS MAS VENDIDOS'
					},
					/*subtitle: {
						text: 'Frecuencia de compra mensual '
					},*/
					accessibility: {
						announceNewData: {
							enabled: true
						}
					},
					xAxis: {
						type: 'category'
					},
					yAxis: {
						title: {
							text: 'Cantidad de compra'
						}

					},
					legend: {
						enabled: false
					},
					plotOptions: {
						series: {
							borderWidth: 0,
							dataLabels: {
								enabled: true,
								format: '{point.y:f}'
							}
						}
					},

					tooltip: {
						headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
						pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:f}</b> <br/>'
					},

					series: [
						{
							name: "Browsers",
							colorByPoint: true,
							data: jsonArray
						}
					]

					});
					
					/******************************************************************************************************************/
					var datos_array = resp.grafico_lab;
					var pluginArrayArg2 = new Array();
					for(var i=0; i<datos_array.length; i++){
						
					 var dato = new Object();
					
						
						 dato.name  =  datos_array[i].lab;
						 dato.y     = parseFloat(datos_array[i].total);
							// dato.sw    = datos_array[i].sw;
						 pluginArrayArg2.push(dato);
					}
				
					
					var jsonArray2 = JSON.parse(JSON.stringify(pluginArrayArg2));
					Highcharts.chart('DivGraficoLab', {

						chart: {
							styledMode: true,
							type: 'variablepie'
						},
 						subtitle: {
							text: ''
						},
						accessibility: {
							announceNewData: {
								enabled: true
							},
							point: {
								valueSuffix: '%'
							}
						 },
						 plotOptions: {
								series: {
									dataLabels: {
										enabled: true,
										format: '{point.name}'
										//format: '{point.name}: {point.y:.1f}% - {point.y}'
									}
								}
							},

							tooltip: {
								headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
								pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>${point.y:.,0f}</b><br/>'
							},

						title: {
							text: 'LABORATORIOS MAS VENDIDOS'
						},

						xAxis: {
							categories:'' 
						},

						series: [{
							type: 'pie',
							allowPointSelect: true,
							keys: ['name', 'y', 'selected', 'sliced'],
							data:jsonArray2,
							showInLegend: true
						}]
					});
		const sum_v_contactadas= Object.values(NewArray).reduce((t, n) =>t + (n.vis_vendedor_c), 0);
		const sum_t_contactadas= Object.values(NewArray).reduce((t, n) =>t + (n.vis_televendedor_c), 0);
		const sum_v_optimas= Object.values(NewArray).reduce((t, n) =>t + (n.v_optimas), 0);
		const sum_t_optimas= Object.values(NewArray).reduce((t, n) =>t + (n.t_optimas), 0);		
					

		//Presupuesto x cliente			
		$("#p_cump_venta").html(formatNum(s_total_eje,'$'));
		$("#p_pres_venta").html(formatNum(s_total_pre,'$'));
		$("#p_pcj_venta").html((Math.round(((s_total_eje/s_total_pre)*100)*100)/100)+'%');
		//Presupuesto x zona						
		$("#p_cump_venta_zona").html(formatNum(s_total_eje,'$'));
		$("#p_pres_venta_zona").html(formatNum(presupuesto_zona,'$'));
		$("#p_pcj_venta_zona").html((Math.round(((s_total_eje/presupuesto_zona)*100)*100)/100)+'%');
		
		$("#p_panel_cliente").html(cli_panel);	
		$("#p_imp_cliente").html(cli_imp);
		$("#p_pend_cliente").html(cli_panel-cli_imp);
					
		//Objetivo visitas y llamadas			
		$("#p_optimas_ventas").html(PromDiaVentas);
		$("#p_optimas_televentas").html(PromDiaTeleVentas);	
		//Programado visitas y llamadas			
		$("#p_cump_ventas_v").html(s_total_v);
		$("#p_cump_ventas_t").html(s_total_t);		
		//Contactadas visitas y llamadas
		$("#sum_v_contactadas").text( sum_v_contactadas );
		$("#sum_t_contactadas").text( sum_t_contactadas );
		
		$("#pcj_sum_v_contactadas").text( (Math.round(((sum_v_contactadas/s_total_v)*100)*100)/100)+'%' );
		$("#pcj_sum_t_contactadas").text( (Math.round(((sum_t_contactadas/s_total_t)*100)*100)/100)+'%' );
					
					
		//-------------------------------------------------------------------------------------------------
		$("#p_dias_laborales").html(DiasLaborales);
		$("#p_dias_transcurridos").html(DiasLaboralesTranscurridos);
		$("#p_dias_restantes").html(parseFloat(DiasLaborales)-parseFloat(DiasLaboralesTranscurridos));			
		//-------------------------------------------------------------------------------------------------
					
		//Promedio de visitas contactadas entre los dias transcurridos
		$("#p_promdia_v_contactado").text( formatNumberES((sum_v_contactadas/DiasLaboralesTranscurridos),2,'') );			
		$("#p_promdia_t_contactado").text( formatNumberES((sum_t_contactadas/DiasLaboralesTranscurridos),2,'') );
		//Promedio de llamadas contactadas entre los dias transcurridos			
		$("#p_promdia_v_programado").text( formatNumberES((s_total_v/DiasLaboralesTranscurridos),2,'') );		
		$("#p_promdia_t_programado").text( formatNumberES((s_total_t/DiasLaboralesTranscurridos),2,'') );
					
					
		//Cumplimiento de clientes y potencial de compra
		$("#potencial_clientes_cumplen").text(ClientesCumplenPPTO);	
		$("#potencial_valor_total").text(formatNum(SumaPotencial,'$'));
		$("#potencial_suma_3mes").text(formatNum(SumaPromedio3mes,'$'));
		$("#potencial_suma_6mes").text(formatNum(SumaPromedio6mes,'$'));
		$("#potencial_participacion_3mes").text(formatNumberES( (SumaPromedio3mes/SumaPotencial)*100,2,'%'));
		$("#potencial_variacion").text(formatNumberES( ((SumaPromedio3mes/SumaPromedio6mes)-1)*100,2,'%') );
	
					
		if ( $.fn.dataTable.isDataTable( '#TableView' ) ) {
			table.destroy();	
		 }
					table=$('#TableView').DataTable({
						data: NewArray,
						dom: 'Bfrtip',
						processing: true,
						deferRender: true,
						pageLength: 1000,
						scrollX: true, 
						scrollCollapse: true,  
						scrollY: "54vh", 
						fixedHeader: true,
						ordering: false,
						language: {
									info: '[ _START_ A _END_ ] De _TOTAL_ Registros',
									infoEmpty:      '0 A 0 De 0 ',
									infoFiltered:   '( Total _MAX_ )',
									zeroRecords:    'No se encontraron registros',
									paginate: {
											first:      'Prr<span>T</span>',
											last:       'Ult',
											next:       'Sig',
											previous:   'Ant'
									},
									processing:     "Procesando...",						
						 },
						buttons: [
							//'copy', 'csv', 'excel' //, 'pdf', 'print'
							$.extend(true, {}, {
										extend: 'excel',
										text: 'Descargar Excel',
										title: 'Cumplimiento Presupuesto Ventas',
								        exportOptions: {
											columns: [0,1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34],
											format: {
												body: function (data, row, column, node) {

													if (column >= 10 && column<12) {

														var html = $.parseHTML(data);
														var celda = "";
														$.each(html, function (i, elemento) {
															celda = elemento.value;
														});									

														return data = celda;

													} else {
														return data;
													}
												}
											}
										}
									}),
							$.extend(true, {}, {
										extend: 'copy',
										text: 'Portapapeles'								
									})
						],
						footerCallback: function ( row, data, start, end, display ) {
                            var api = this.api(), data;
						 
							 // converting to interger to find total
							var intVal = function ( i ) {
								return typeof i === 'string' ?
									i.replace(/[\$,]/g, '')*1 :
									typeof i === 'number' ?
										i : 0;
							};
							// computing column Total of the complete result 
							var TotalPresupuestoVentas = api
								.column( 7 )
								.data()
								.reduce( function (a, b) {
									return intVal(a) + intVal(b);
								}, 0 );
							
							var TotalCumplimientoVentas = api
								.column( 8 )
								.data()
								.reduce( function (a, b) {
									return intVal(a) + intVal(b);
								}, 0 );
							
							var TotalPresupuestoCartera = api
								.column( 10 )
								.data()
								.reduce( function (a, b) {
									return intVal(a) + intVal(b);
								}, 0 );
							var TotalCumplimientoCartera = api
								.column( 11 )
								.data()
								.reduce( function (a, b) {
									return intVal(a) + intVal(b);
								}, 0 );
							var TotalPendienteCartera = api
								.column( 12 )
								.data()
								.reduce( function (a, b) {
									return intVal(a) + intVal(b);
								}, 0 );
							var TotalVisTeleventas = api
								.column( 13 )
								.data()
								.reduce( function (a, b) {
									return intVal(a) + intVal(b);
								}, 0 );
							var TotalVisVentas = api
								.column( 14 )
								.data()
								.reduce( function (a, b) {
									return intVal(a) + intVal(b);
								}, 0 );
							var Total_3mes = api
								.column( 17 )
								.data()
								.reduce( function (a, b) {
									return intVal(a) + intVal(b);
								}, 0 );
							var Total_6mes = api
								.column( 18 )
								.data()
								.reduce( function (a, b) {
									return intVal(a) + intVal(b);
								}, 0 );
							
							        //$( api.column( 0 ).footer() ).html('Total');
							var s_total_pcj = 0;
							if(TotalPresupuestoVentas>0){
								s_total_pcj=((s_total_eje*100)/s_total_pre);
								s_total_pcj=Math.round(s_total_pcj*100)/100;
							}
							
						},
						columns: [
							{  
							   data      : 'n_filas',
							   title     : 'FILAS' ,
							   className : ''//,
							   //render	 : $.fn.dataTable.render.number('.', ',', 0, '$')

							},
							{ 
								data : 'codigo_sap',
								title: 'CODIGO' 
							},
							{ 
								data : 'nit',
								title: 'NIT' 
							},
							{ 
								data : 'nombres',
								title: 'CLIENTE' 
							},
							{ 
								data : 'razon_comercial',
								title: 'RAZON' 
							},
							{ 
								data : 'departamento',
								title: 'DEPARTAMENTO' 
							},
							{ 
								data  : 'ciudad', 
								title : 'CIUDAD' 
							},
							//Nuevo cambio de raul 2022-11-19
							{
								data : 'tipo',
								title: 'TIPO CLIENTE' 
							},
							{
								data : 'v_optimas',
								title: 'V.OPTIMAS', 
								className : 'optimas'
							},
							{
								data : 't_optimas',
								title: 'T.OPTIMAS',
								className : 'optimas'
							},
							{
								data : 'v_optimas',
								title: 'V.OBJETIVO', 
								render: function (data, type, row) {
									  return '<input type="number" onKeyPress="return vnumeros(event)" onBlur="AddObjVisita(this,this.value,\'V\')" class="form-control" value="'+data+'">';
								  }
							},
							{
								data : 't_optimas',
								title: 'T.OBJETIVO',
								render: function (data, type, row) {
									  return '<input type="number" onKeyPress="return vnumeros(event)" onBlur="AddObjVisita(this,this.value,\'T\')"  class="form-control" value="'+data+'">';
								}
							},
							{ 
								data : 'vis_vendedor',
								title: 'V.PROGRAMADA' , 
							    className : 'programadas'
							},
							{ 
								data : 'vis_televendedor',
								title: 'T.PROGRAMADA' ,
								className : 'programadas'
							}
							,
							{ 
								data : 'vis_vendedor_c',
								title: 'V.CONTACTADA', 
								className : 'contactadas' 
							},
							{ 
								data : 'vis_televendedor_c',
								title: 'T.CONTACTADA',
								className : 'contactadas' 
							},
							//--------cumplimiento----------------------------
							{ 
								data : 'v_pcj_cum',
								title: 'V.CUMPLIMIENTO%', 
								className : 'cumplimiento',
								render : $.fn.dataTable.render.number('.', ',', 2,'', '%')
							},
							{ 
								data : 't_pcj_cum',
								title: 'T.CUMPLIMIENTO%',
								className : 'cumplimiento',
								render : $.fn.dataTable.render.number('.', ',', 2,'', '%')
							},
							//Nuevo cambio de raul 2022-11-19
							{ 
								data  : 'valor_presupuesto', //7
								title : 'PROYECTADO',
								render: $.fn.dataTable.render.number('.', ',', 2, '$')
							},
							{ 
								data  : 'ejecutado',//8
								title : 'EJECUTADO',
								render: $.fn.dataTable.render.number('.', ',', 2, '$')
							},
							{ 
								data : 'pcj_cumplimiento', //9
								title: '%CUMPLIMIENTO',
								render : $.fn.dataTable.render.number('.', ',', 2,'', '%')
							},
							
							{ 
								data : 'vendedor',//15
								title: 'VENDEDOR' 
							},
							{ 
								data : 'televendedor',//16
								title: 'TELEVENDEDOR' 
							},
							{ 
								data : 'potencial',//16
								title: 'POTENCIAL',
								render : $.fn.dataTable.render.number('.', ',', 2, '$')
							},
							{ 
								data : 'pcj_potencial',//16
								title: 'PARTICIPACION CLIENTE',
								render : $.fn.dataTable.render.number('.', ',', 2,'', '%')
							},
							{ 
								data   : 'prom_venta_3mes',//17
								title  : 'PROM VTA 3 MESES',
								render : $.fn.dataTable.render.number('.', ',', 2, '$')
							},
							{ 
								data   : 'prom_venta_6mes',//18
								title  : 'PROM VTA 6 MESES',
								render : $.fn.dataTable.render.number('.', ',', 2, '$')
							},
							{ 
								data : 'oficina_ventas',
								title: 'OFICINA' 
							},
							{ 
								data : 'variacion',
								title: 'VARIACION VS PROMEDIO',
								render : $.fn.dataTable.render.number('.', ',', 2,'', '%')
							},
							{
								data : 'participacion',
								title: 'PARTICIPACION ',
								render : $.fn.dataTable.render.number('.', ',', 2,'', '%')
							},
							{
								data : 'ac_participacion',
								title: 'ACUM. PARTICIPACION',
								render : $.fn.dataTable.render.number('.', ',', 2,'', '%')
							},
							
							{
								data : 'zona_ventas',
								title: 'ZONA' 
							}
							,
							{
								data : 'zona_descripcion',
								title: 'ZONA DESCRIPCION' 
							},
							{ 
								data : 'grupo1',
								title: 'GRUPO1' 
							},
							{ 
								data : 'desc_grupo1',
								title: 'GRUPO1 DESCRIPCION' 
							},


						]
					 
					});
					
					 $("#result").html("");
					 $("#FilaTotales").show();

				 }else{
					 
					 table = $('#TableView').DataTable(); 
                     table.clear().draw().destroy();						
					 $("#result").html("<div class='alert alert-danger'>NO SE ENCONTRARON REGISTROS...</div>");
				 	 $("#Paginacion").html(""); 
					 $("#FilaTotales").hide();
				 }
			}
	}).fail(function(data){
		console.log(data);
		UnloadImg();// return false;
		$("#result").html("<div class='alert alert-danger'>LA CONSULTA HA TARDADO DEMASIADO, SALGA Y VUELVA A INTENTARLO...</div>");
	});
}

function AddObjVisita(ob, valor, tipo) {  
  let codigo_sap = $.trim($(ob).parent().parent().find('td').eq(1).html());
  let oficina    = $.trim($(ob).parent().parent().find('td').eq(27).html());
  let org        = $.trim($("#Organizacion").val());
  let RolId      = $.trim($("#TxtRolId").val());
  const fecha    = new Date();
  const hoy      = fecha.getDate();

  if (parseInt(hoy) <= 6) {
		if(RolId == 1 || RolId == 3 || RolId == 13 ) {
			$.ajax({     
				url      : "../models/Presupuesto.php",
				global   : false,
				type     : "POST",
				data: {
					op: "u_terceros_visita_objetivos",
					codigo_sap,
					oficina,
					org,
					valor,
					tipo
				},
				dataType : "json",
				async    : false,
				success  : function(data){
					console.log(data);
				}
			});
		  } else {
			  Swal.fire('Oops', 'No está autorizado a modificar esto', 'error');
		  }
	} else {
	  Swal.fire('Oops','No es posible modificarlo en esta fecha  / Solo se permite el primer día de cada mes','error');
	}
}

function Exportar() {
  const mes = $("#meses").val();
  const ano = $("#ano").val();
  const zona = $("#txtZonas").val(); 
  const oficina = $("#SlcOficina").val();
  window.open(`../resources/Excel/ExcelCumplimientoPresupuesto.php?ano="${ano}"&mes="${mes}"&zona="${zona}"&oficina="${oficina},"_self`);
}

function ExportExcel(e) {
	window.open('data:application/vnd.ms-excel;base64,' + $.base64.encode($("#result").html()));
	e.preventDefault(); 	
}

function exportTableToExcel(tableID, filename = '') {
    let downloadLink;
    const dataType = 'application/vnd.ms-excel;base64';
    const tableSelect = document.getElementById(tableID);
    const tableHTML = $.base64.encode(tableSelect.outerHTML.replace(/ /g, '%20'));
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';    
    // Create download link element
    downloadLink = document.createElement("a");    
    document.body.appendChild(downloadLink);
    
    if (navigator.msSaveOrOpenBlob) {
        const blob = new Blob(['ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;    
        // Setting the file name
        downloadLink.download = filename;        
        //triggering the function
        downloadLink.click();
    }
}

function Meta_volante_zona() {
	let pmeta1 = 0;	let pmeta2 = 0;	let pmeta3 = 0;
	let venta1 = 0;	let venta2 = 0;	let venta3 = 0;
	let v_meta1 = 0; let v_meta2 = 0; let v_meta3 = 0;
	let cum_meta1 = 0; let cum_meta2 = 0; let cum_meta3 = 0;
	const mes = $("#meses").val();
	const ano = $("#ano").val();
	const zona = $("#txtZonas").val(); 
	const org = $("#SlcOficina").val();

	$.ajax({
		type: "POST",
		encoding:"UTF-8",
		url: "../models/Presupuesto.php",
		dataType: "json",
		error: function(OBJ, ERROR, JQERROR){
		 alert(JQERROR+"   ");
		},
		data: {
			op: "Meta_volante_zona" ,
			org: org.toString()[0]+'000',
			zona,
			ano,
			mes
		},
		async: true,
		success: function(data) {
		   for(let i = 0; i < data.length; i++) {
		        const obj = data[i];  
				let presupuesto = parseFloat(obj.PRESUPUESTO);
				pmeta1 = parseFloat(obj.META1);
				pmeta2 = parseFloat(obj.META2);
				pmeta3 = parseFloat(obj.META3);
				venta1 = parseFloat(obj.c_ventas_1_7);
				venta2 = parseFloat(obj.c_ventas_8_14);
				venta3 = parseFloat(obj.c_ventas_15_21);
				v_meta1 = (presupuesto / 100) * pmeta1;
				v_meta2 = (presupuesto / 100) * pmeta2;
				v_meta3 = (presupuesto / 100) * pmeta3;
				cum_meta1 = ((venta1 / v_meta1) * 100);
				cum_meta2 = ((venta2 / v_meta2) * 100);
				cum_meta3 = ((venta3 / v_meta3) * 100);
				$("#vmeta_volante_1").html(formatNum(v_meta1, '$'));
				$("#venta_corte_1").html(formatNum(venta1, '$'));
				$("#cumplimiento_meta_1").html(cum_meta1.toFixed(2) + '%');
				$("#vmeta_volante_2").html(formatNum(v_meta2, '$'));
				$("#venta_corte_2").html(formatNum(venta2, '$'));
				$("#cumplimiento_meta_2").html(cum_meta2.toFixed(2) + '%');
				$("#vmeta_volante_3").html(formatNum(v_meta3, '$'));
				$("#venta_corte_3").html(formatNum(venta3, '$'));
				$("#cumplimiento_meta_3").html(cum_meta3.toFixed(2) + '%');		
 		   }		   
			$("#contenedor_cvolante1").show();
			$("#contenedor_cvolante2").show();
			$("#contenedor_cvolante3").show();
		}		
	}).fail(function(data){
		console.log(data);
	});
}
//
$(document).ready(function(e) {	
	$("#btn_exportar").click(function(e) {
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
	  $("#fhIni").attr('disabled',true);
	  $("#fhFin").attr('disabled',true);
	} else {
	  $("#fhIni").attr('disabled', false);
	  $("#fhFin").attr('disabled', false);
	}

	$("#FiltroFechas").change(function() {
		if ($("#FiltroFechas").val() == 'N') {
		  $("#fhIni").attr('disabled',true);
		  $("#fhFin").attr('disabled',true);
		} else {
		  $("#fhIni").attr('disabled',false);
		  $("#fhFin").attr('disabled',false);
		}	
	});

    $("#Clasificaciones").change(function() {
		$(".tdPresupuesto tr:gt(0)").show();
		 let filas = $(".tdPresupuesto tr:gt(0)").length;
		 let Cla = $.trim($(this).val());
		 if (filas > 0) {
			 $(".tdPresupuesto tr:gt(0)").each(function(index, element) {
				 let tmp = $(this).find("td").eq(20).html();
				 if ($("#Clasificaciones").val() != '-') {
				   if (Cla==tmp) {
						$(this).show();
				   } else {
							$(this).hide();	
						}
				 } else {
						$(this).show();
				 }
            });
		 } else {
			 $(".tdPresupuesto tr:gt(0)").show();
		 }
	});

   $("#SlcOficina").html(OficinasVentas('S'));

   $("#SlcOficina").change(function() {
	 ZonasVentas( $(this).val() );
   });

   ZonasVentas($("#Organizacion").val());   
   CargarDate();

   $("#btn_consultar").click(function() {
		$("#contenedor_cvolante1").hide();
		$("#contenedor_cvolante2").hide();
		$("#contenedor_cvolante3").hide();
		if ($("#txtZonas").val() !=0 ) {
			Meta_volante_zona();
		}	
		ConsultarPresupuesto(1);
   });
});