function LoadImg(texto) {
	html = '<center>'
	  + '<figure><img src="../resources/icons/preloader.gif" class="img-responsive"/></figure>'
	  + '<figcaption>' + texto + '</figcaption>'
	  + '</center>';
	$(".centrado-porcentual").html(html);
	$(".form-control").attr("disabled", true);
	$(".centrado-porcentual").show();
	$("#Bloquear").show();
  }
function UnloadImg(){
	$("#Bloquear").hide();
	$(".centrado-porcentual").hide();
	$(".form-control").attr("disabled",false);
}

//Funcion para carga de zonas de ventas para consulta de pedidos
function permisosZonas(){
	var rol = $("#Rol").val();
	var sw  = 0;
	$.ajax({
		type    : "POST",
		encoding: "UTF-8",
		url     : "../models/PW-SAP.php",
		async   : false,
		dataType: "json",
		error   : function(OBJ, ERROR, JQERROR){
		},
		beforeSend : function(){
		},
		data: {
			op  : "S_PERMISO_ZONA",
			rol : rol
		},
		success: function(data){
			if(data.length > 0){sw = 1}
		}
	}).fail(function(data){
	console.error(data);
	});
	return sw;
}
function zonasVentas(oficina){
	
	var sw    = permisosZonas();

	var idUsr = $("#TxtIdu").val();
    $.ajax({
			type    : "POST",
			url     : "../models/Presupuesto.php",
			async   : false,
			dataType: "json",
			beforeSend : function(){
			},
			data: {
				op    : "S_ZONAS_VENTA",
				sw    : sw,
				idUsr : idUsr,
				oficina:oficina
			},
			success: function(data){
			   var zonas = '';
			   if(data.length > 0){
				   if(sw == 1){
					 zonas = '<option value="0">000000 - TODAS</option>'; 
				   }
				   for(var i=0;i<data.length;i++){
					   zonas+='<option value="'+data[i].zona+'">'+data[i].zona+' - '+data[i].descripcion+'</option>';
				   }//for	
			   }else{
			     zonas = '<option value="999999">NO TIENE ZONA ASIGNADA SOLICITAR AL ADMINISTRADOR</option>';
			   }
			   $("#txtZonas").html(zonas);
			}
	}).fail(function(data){
		console.error(data);
	});
}
//
function CargarDate(){
	
	 $.ajax({     
		  url      : "../models/Presupuesto.php",
		  global   : false,
		  type     : "POST",
		  data     : ({op:"l_date"}),
		  dataType : "html",
		  async    : false,
		  success  : function(data)
			{
			   if(data!=""){
				   datos=data.split("%&");
				
				   max_a=parseInt(datos[1]);
		           max_m=parseInt(datos[0]);
		
				   for(var i=max_a;i>=2008 ;i--){
	
					   $("#ano").append('<option value="'+i+'">'+i+'</option>');
				   }
				  for(var j=1;j<=12;j++){
					 
					if(j==max_m){
						$("#meses").append('<option value="'+j+'" selected>'+ObtenerMes(j)+' (Actual)</option>');
					}else{
						$("#meses").append('<option value="'+j+'">'+ObtenerMes(j)+'</option>');
					}
					
					
				  }
				   
			   }
			}
		});
	
}
//
function sortJSON(data, key, orden) {
    return data.sort(function (a, b) {
        var x = a[key],
        y = b[key];

        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

//
function ConsultarPresupuesto(){
	
  var mes         = $("#meses").val();
  var anio        = $("#ano").val();
  var zona        = $("#txtZonas").val();
  var Oficina     = $("#SlcOficina").val();	
  var ClasePedido = $("#txtClasePedido").val();

		$.ajax({     
		  url      : "../models/FidelizacionAcida.php",
		  global   : false,
		  type     : "POST",
		  data     : ({op:"S_CUMPLIMIENTO_ACIDO" ,
					   mes         : mes,
					   anio        : anio,
					   zona        : zona,
					   Oficina     : Oficina,
					   ClasePedido : ClasePedido
					 }),
		  dataType : "json",
		  beforeSend: function(){
			 LoadImg('Consultando Información');
			  $('#TableView tbody').empty();
		  },
		  async    : true,
		  success  : function(resp){ 
			    UnloadImg(); 			  
			    data=resp.datos;
			    vlr_total_trimestre=resp.vlr_total_trimestre;
			  
				sortJSON(data,'prom_venta_3mes','desc');
			  

			    
			    if(data.length>0){
					//variables 
					
					s_total_pre               = 0;
					s_total_eje               = 0;	
					s_total_v                 = 0;
					s_total_t                 = 0;
					s_total_pcj               = 0;	
				    t_total_pre               = 0;
					t_total_pcj               = 0;
					t_total_eje               = 0;
					t_total_t                 = 0;
					t_total_v                 = 0;
					paginas_total             = 0;
					sum_prom_vta_3            = 0;
					sum_prom_vta_6            = 0;
					total_trimestre           = 0;
					total_presupuesto_cartera = 0;
					total_recaudo             = 0;  
					suma_part=0;
					
					NewArray                  = [];
					NewArrayReal              = [];
					
					//-----------------------------
					venta100  = 0;
					venta75   = 0;
					venta50   = 0;
					venta25   = 0;
					ventaTot  = 0;
					
					cliente100 = 0;
					cliente75  = 0;
					cliente50  = 0;
					cliente25  = 0;
					cliente0   = 0; 
					clienteTot = 0;
					//-----------------------------
					for(var i=0;i<data.length;i++){
							
							d = data[i];
							if(d.valor_presupuesto>0){
								pcj=(d.ejecutado*100)/parseFloat(d.valor_presupuesto);
								pcj=Math.round(pcj*100)/100;
							}else{
								pcj=0; 
							}
							var fecha = new Date();
							var diaActual = fecha.getDate();
							var variacion = 0;
							if(d.prom_venta_3mes>0){
							variacion = d.ejecutado/((d.prom_venta_3mes/30)*diaActual);
							variacion = Math.round(variacion*100)/100;

						}						   
						 
						   vlr_participacion =Math.round(   ((d.prom_venta_3mes/vlr_total_trimestre)*100) *100)/100;
		
							det ={
								'n_filas'           : d.n_filas,
								'codigo_sap'        : d.codigo_sap,
								'nit'               : d.nit,
								'nombres'           : d.nombres,
								'razon_comercial'   : d.razon_comercial,
								'departamento'      : d.departamento,
								'ciudad'            : d.ciudad,
								'valor_presupuesto' : d.valor_presupuesto,
								'ejecutado'         : d.ejecutado,
								'pcj_cumplimiento'  : pcj,
								'pre_cartera'       : d.presupuesto_cartera,
								'recaudo'           : d.recaudo,
								'recaudo_real'      : d.recaudo_real,
								'vis_vendedor'      : d.vis_vendedor,
								'vis_televendedor'  : d.vis_televendedor,
								'vendedor'          : d.vendedor,
								'televendedor'      : d.televendedor,
								'prom_venta_3mes'   : d.prom_venta_3mes,
								'prom_venta_6mes'   : d.prom_venta_6mes,
								'oficina_ventas'    : d.oficina_ventas,
								'variacion'         : variacion,
								'participacion' 	   : vlr_participacion,
								'zona_ventas' 	   : d.zona_ventas,
								'zona_descripcion'  : d.zona_descripcion,
								//Acides semanal
								'ventas_dias_1_7'   : d.ventas_dias_1_7,
								'ventas_dias_8_14'  : d.ventas_dias_8_14,
								'ventas_dias_15_21' : d.ventas_dias_15_21,
								'ventas_dias_22_31' : d.ventas_dias_22_31
							}//det={
							NewArray.push(det);
								//paginas_total=d.total_reg;
								s_total_pre    = s_total_pre + parseFloat(d.valor_presupuesto);
								s_total_eje    = s_total_eje + parseFloat(d.ejecutado);
								s_total_v      = s_total_v   + parseInt(d.vis_vendedor);
								s_total_t      = s_total_t   + parseInt(d.vis_televendedor);
								sum_prom_vta_3 = sum_prom_vta_3 + parseFloat(d.prom_venta_3mes); 
								sum_prom_vta_6 = sum_prom_vta_6 + parseFloat(d.prom_venta_6mes); 
								t_total_pre    = 0;
								t_total_eje    = 0;
								t_total_t      = 0;
								t_total_v      = 0;
								total_presupuesto_cartera=total_presupuesto_cartera+parseFloat(d.presupuesto_cartera);
								total_recaudo=total_recaudo+parseFloat(d.recaudo);
							    
					    }// for
					
					//Recaulculando participacion y tipo
					
					for(var x=0; x<=NewArray.length-1; x++){
						
						d         = NewArray[x];
						Cla='';
						
						suma_part = suma_part+parseFloat(d.participacion);
						suma_part = Math.round(suma_part*100)/100;
						Cla       = CalcularClasificacion(suma_part,d.prom_venta_3mes);
						
					    SlcClasifica = $("#Clasificaciones").val();
						
						var sem1 = 0;
						var sem2 = 0;
						var sem3 = 0;
						var sem4 = 0;
						var fidelizacion = 0;
						var frecuencia   = 0;
						if(parseFloat(d.ventas_dias_1_7)   > 0){sem1 = 1;}
						if(parseFloat(d.ventas_dias_8_14)  > 0){sem2 = 1;}
						if(parseFloat(d.ventas_dias_15_21) > 0){sem3 = 1;}
						if(parseFloat(d.ventas_dias_22_31) > 0){sem4 = 1;}
					    
						frecuencia   = parseInt(sem1)+parseInt(sem2)+parseInt(sem3)+parseInt(sem4);
						fidelizacion = (frecuencia/4);
						fidelizacion = Math.round(fidelizacion*100)+'%';
						//-----------------------------------------------
						switch(frecuencia){
							    case 4 : {venta100+=parseFloat(d.ejecutado); cliente100++;}break;//100%
								case 3 : {venta75+= parseFloat(d.ejecutado); cliente75++;}break;//75%
								case 2 : {venta50+= parseFloat(d.ejecutado); cliente50++;}break;//50%
								case 1 : {venta25+= parseFloat(d.ejecutado); cliente25++;}break;//25%
								case 0 : {cliente0++;}break;//25%
						}
						clienteTot = (cliente100+cliente75+cliente50+cliente25+cliente0);
						ventaTot   = (venta100+venta75+venta50+venta25);
						//-----------------------------------------------
						
							det = {
								'n_filas'           : d.n_filas,
								'codigo_sap'        : d.codigo_sap,
								'nit'               : d.nit,
								'nombres'           : d.nombres,
								'razon_comercial'   : d.razon_comercial,
								'departamento'      : d.departamento,
								'ciudad'            : d.ciudad,
								'valor_presupuesto' : parseFloat(d.valor_presupuesto),
								'ejecutado'         : d.ejecutado,
								'pcj_cumplimiento'  : d.pcj_cumplimiento,
								'pre_cartera'       : d.pre_cartera,
								'recaudo'           : d.recaudo,
								'recaudo_real'      : d.recaudo_real,
								'vis_vendedor'      : d.vis_vendedor,
								'vis_televendedor'  : d.vis_televendedor,
								'vendedor'          : d.vendedor,
								'televendedor'      : d.televendedor,
								'prom_venta_3mes'   : parseFloat(d.prom_venta_3mes),
								'prom_venta_6mes'   : d.prom_venta_6mes,
								'oficina_ventas'    : d.oficina_ventas,
								'variacion'         : d.variacion,
								'participacion' 	   : d.participacion,
								'ac_participacion'  : suma_part,
								'tipo'  			   : Cla,
								'zona_ventas' 	   : d.zona_ventas,
								'zona_descripcion'  : d.zona_descripcion,
								//Acides semanal
								'ventas_dias_1_7'   : d.ventas_dias_1_7,
								'ventas_dias_8_14'  : d.ventas_dias_8_14,
								'ventas_dias_15_21' : d.ventas_dias_15_21,
								'ventas_dias_22_31' : d.ventas_dias_22_31,
								'frecuencia'        : frecuencia,
								'fidelizacion'      : fidelizacion
							};
						if(SlcClasifica != '-'){
							if(Cla == SlcClasifica){
								NewArrayReal.push(det);	
							}   
						}else{
								NewArrayReal.push(det);
						}
						
						
					}
					//Fin del recalculo					
					
			        
					$("#p_cump_cartera").html(formatNum(total_recaudo,'$'));
					$("#p_cump_venta").html(formatNum(s_total_eje,'$'));
					$("#p_pres_cartera").html(formatNum(total_presupuesto_cartera,''));
					$("#p_pres_venta").html(formatNum(s_total_pre,'$'));
					if ($.fn.DataTable.isDataTable('#TableView')) {
						table.destroy();
						$('#TableView').empty(); // Limpiar el HTML de la tabla
					}
					table=$('#TableView').DataTable({
						
						data: NewArrayReal,
						dom: `
						<"top-section d-flex justify-content-between mb-3"<"buttons-group"B><"search-group"f>>
						rt
						<"bottom-section d-flex justify-content-between mt-3"<"info-group"i><"pagination-group"p>>
						`,						
						deferRender: true,
						pageLength: 1000,
						scrollX: true, 
						scrollCollapse: true,  
						scrollY: "70vh", 
						// fixedHeader: true,
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
							{
								extend: 'copy',
								className: 'btn btn-secondary'
							},
							{
								extend: 'csv',
								className: 'btn btn-danger'
							},
							{
								extend: 'excel',
								className: 'btn btn-success'
							}
						],
						footerCallback: function ( row, data, start, end, display ) {
                            var api = this.api(), data;
						    console.log(api);
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
							
							/*$( api.column( 7 ).footer() ).html(formatNum(TotalPresupuestoVentas,'$'));
							$( api.column( 8 ).footer() ).html(formatNum(TotalCumplimientoVentas,'$'));
							$( api.column( 9 ).footer() ).html(s_total_pcj+'%');
							$( api.column( 10 ).footer() ).html(formatNum(TotalPresupuestoCartera,'$'));
							$( api.column( 11 ).footer() ).html(formatNum(TotalCumplimientoCartera,'$'));
							$( api.column( 12 ).footer() ).html(formatNum(TotalPendienteCartera,'$'));
							$( api.column( 13 ).footer() ).html(TotalVisTeleventas);
							$( api.column( 14 ).footer() ).html(TotalVisVentas);
							$( api.column( 17 ).footer() ).html(formatNum(Total_3mes,'$'));
							$( api.column( 18 ).footer() ).html(formatNum(Total_6mes,'$'));*/
							
							
								
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
							{ 
								data  : 'valor_presupuesto', //7
								title : 'PROYECTADO',
								render: $.fn.dataTable.render.number(',', '.', 0, '$')
							},
							{ 
								data  : 'ejecutado',//8
								title : 'EJECUTADO',
								render: $.fn.dataTable.render.number(',', '.', 0, '$')
							},
							{ 
								data : 'pcj_cumplimiento', //9
								title: '%CUMPLIMIENTO' 
							},
							//-------------------------------------------------------------
							
							{ 
								data : 'fidelizacion', //9
								title: 'FRECUENCIA_ACIDA',
								className: 'alert-success'
							},
							{ 
								data : 'ventas_dias_1_7', //9
								title: 'SEMANA 1 (1-7)',
								render: $.fn.dataTable.render.number(',', '.', 0, '$'),
								className: 'alert-warning'
							},
							{ 
								data : 'ventas_dias_8_14', //9
								title: 'SEMANA 2 (8-14)',
								render: $.fn.dataTable.render.number(',', '.', 0, '$'),
								className: 'alert-warning'
							},
							{ 
								data : 'ventas_dias_15_21', //9
								title: 'SEMANA 3 (15-21)',
								render: $.fn.dataTable.render.number(',', '.', 0, '$'),
								className: 'alert-warning'
							},
							{ 
								data : 'ventas_dias_22_31', //9
								title: 'SEMANA 4 (22-FIN)',
								render: $.fn.dataTable.render.number(',', '.', 0, '$'),
								className: 'alert-warning'
							},
							{ 
								data : 'frecuencia', //9
								title: 'FRECUENCIA_COMPRA',
								className: 'alert-success'
							},
							
							//-------------------------------------------------------------
							{ 
								data   : 'pre_cartera',//10
								title  : 'PRESUPUESTO CARTERA',
								render: $.fn.dataTable.render.number(',', '.', 0, '$')
							},
							{ 
								data   : 'recaudo',//11
								title  : 'RECAUDO',
								render: $.fn.dataTable.render.number(',', '.', 0, '$')
							},
							{ 
								data   : 'recaudo_real',//12
								title  : 'PENDIENTE RECAUDO',
								render: $.fn.dataTable.render.number(',', '.', 0, '$')
							},
							{ 
								data : 'vis_vendedor',//13
								title: 'V.PROGRAMADA' 
							},
							{ 
								data : 'vis_televendedor',//14
								title: 'T.PROGRAMADA' 
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
								data   : 'prom_venta_3mes',//17
								title  : 'PROM VTA 3 MESES',
								render : $.fn.dataTable.render.number(',', '.', 0, '$')
							},
							{ 
								data   : 'prom_venta_6mes',//18
								title  : 'PROM VTA 6 MESES',
								render : $.fn.dataTable.render.number(',', '.', 0, '$')
							},
							{ 
								data : 'oficina_ventas',
								title: 'OFICINA' 
							},
							{ 
								data : 'variacion',
								title: 'VARIACION VS PROMEDIO' 
							},
							{
								data : 'participacion',
								title: 'PARTICIPACION ' 
							},
							{
								data : 'ac_participacion',
								title: 'ACUM. PARTICIPACION ' 
							},
							{
								data : 'tipo',
								title: 'TIPO CLIENTE' 
							},
							{
								data : 'zona_ventas',
								title: 'ZONA' 
							}
							,
							{
								data : 'zona_descripcion',
								title: 'ZONA DESCRIPCION' 
							}
							


						]
					 
					});
					
					 
					 /**/
					   var tablaAcidez ='<div class="card tabla-estilo-wrapper" style="max-height: 70vh">'+ 
					   					'<table width="100%" class="table tabla-estilo">'+
										  '<thead>'+
											'<tr>'+
												'<th colspan="7" scope="row" style="background-color: #CFF4FC !important; color: #055160;"> REPORTE FIDELIZACION ACIDA </th>'+
											'<tr>'+
										  '</thead>'+
										  '<tbody>'+	
											'<tr>'+
											  '<th scope="row"> PORCENTAJE DE FIDELIZACION ACIDA </th>'+
											  '<th>100%</th>'+
											  '<th>75%</th>'+
											  '<th>50%</th>'+
											  '<th>25%</th>'+
											  '<th>0%</th>'+
											  '<th>TOTALES</th>'+
											'</tr>'+
											'<tr>'+
											  '<th scope="row"> CANT DE CLIENTES </th>'+
											  '<td>'+cliente100+'</td>'+
											  '<td>'+cliente75+'</td>'+
											  '<td>'+cliente50+'</td>'+
											  '<td>'+cliente25+'</td>'+
											  '<td>'+cliente0+'</td>'+
											  '<td>'+clienteTot+'</td>'+
											'</tr>'+
											'<tr>'+
											  '<th scope="row"> PARTICIPACION CLIENTES % </th>'+
											  '<td>'+Math.round(((cliente100/clienteTot)*100)*100)/100+'</td>'+
											  '<td>'+Math.round(((cliente75/clienteTot)*100)*100)/100+'</td>'+
											  '<td>'+Math.round(((cliente50/clienteTot)*100)*100)/100+'</td>'+
											  '<td>'+Math.round(((cliente25/clienteTot)*100)*100)/100+'</td>'+
											  '<td>'+Math.round(((cliente0/clienteTot)*100)*100)/100+'</td>'+
											  '<td>100%</td>'+
											'</tr>'+
											'<tr>'+
											  '<th scope="row"> VALOR VENTA </th>'+
											  '<td>'+formatNum(venta100,'$')+'</td>'+
											  '<td>'+formatNum(venta75,'$')+'</td>'+
											  '<td>'+formatNum(venta50,'$')+'</td>'+
											  '<td>'+formatNum(venta25,'$')+'</td>'+
											  '<td>'+formatNum(0,'$')+'</td>'+
											  '<td>'+formatNum(ventaTot,'$')+'</td>'+
											'</tr>'+
											'<tr>'+
											  '<th scope="row"> PARTICIPACION VENTAS % </th>'+
											  '<td>'+Math.round(((venta100/ventaTot)*100)*100)/100+'</td>'+
											  '<td>'+Math.round(((venta75/ventaTot)*100)*100)/100+'</td>'+
											  '<td>'+Math.round(((venta50/ventaTot)*100)*100)/100+'</td>'+
											  '<td>'+Math.round(((venta25/ventaTot)*100)*100)/100+'</td>'+
											  '<td>'+Math.round(((0/ventaTot)*100)*100)/100+'</td>'+
											  '<td>100%</td>'+
											'</tr>'+
										  '</tbody>'+
										'</table></div>';
					 /**/
					$("#result").html("");
					$("#FilaTotales").show();
			        $("#ConsolidadoAcidez").html(tablaAcidez);
				 }else{
					 table = $('#TableView').DataTable(); 
                     table.clear().draw().destroy();								
					 $("#result").html("<div class='alert alert-danger'>NO SE ENCONTRARON REGISTROS...</div>");
				 	 $("#Paginacion").html(""); 
					 $("#FilaTotales").hide();
					 $("#ConsolidadoAcidez").html('');
				 }
			}
	   }).fail(function(data){
		   console.error(data);
	 	   UnloadImg();// return false;
	       $("#result").html("<div class='alert alert-danger'>LA CONSULTA HA TARDADO DEMASIADO, SALGA Y VUELVA A INTENTARLO...</div>");
	   });
}

function CalcularClasificacion(valor,prom_3_mes){
	cl="";
	
	if(valor>=0 && valor<=30){
		cl="AA";
	}
	if(valor>30 && valor<=50){
		cl="A";
	}
	if(valor>50 && valor<=80){
		cl="B";
	}
	if(valor>80){
		if(parseFloat(prom_3_mes) >= 2000000){
			cl="C";
		}else if(parseFloat(prom_3_mes) >= 500000 && parseFloat(prom_3_mes) < 2000000){
			cl="D";	 
	    }else if(parseFloat(prom_3_mes) < 500000){
			cl="E";	 
		}
		
	}
	return cl;
}
function Exportar(){
  var mes = $("#meses").val();
  var ano = $("#ano").val();
  var zona = $("#txtZonas").val(); 
  var oficina = $("#SlcOficina").val();
  window.open("../resources/Excel/ExcelCumplimientoPresupuesto.php?ano="+ano+"&mes="+mes+"&zona="+zona+"&oficina="+oficina,"_self");
 
}

function ExportExcel(e){
	window.open('data:application/vnd.ms-excel;base64,' + $.base64.encode($("#result").html()));
    e.preventDefault(); 	
}


function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel;base64';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = $.base64.encode(tableSelect.outerHTML.replace(/ /g, '%20'));
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}

//
$(document).ready(function(e){
	
	$("#btn_exportar").click(function(e){
		d=new Date();
		fnExcelReport('tdPresupuesto');
	});
	
	$("#fhIni,#fhFin").val(FechaActual2());
	$("#fhIni,#fhFin").datepicker({
			 changeMonth: true,
			 changeYear: true,
			 monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio', 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
			 monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
			 dateFormat: 'yy-mm-dd',
			 width:100,
			 heigth:100
	 });
	if($("#FiltroFechas").val() == 'N'){
	  $("#fhIni").attr('disabled',true);
	  $("#fhFin").attr('disabled',true);
	}else{
	  $("#fhIni").attr('disabled',false);
	  $("#fhFin").attr('disabled',false);
	}
	$("#FiltroFechas").change(function(){
		if($("#FiltroFechas").val() == 'N'){
		  $("#fhIni").attr('disabled',true);
		  $("#fhFin").attr('disabled',true);
		}else{
		  $("#fhIni").attr('disabled',false);
		  $("#fhFin").attr('disabled',false);
		}	
	})
    $("#Clasificaciones").change(function(){
		$(".tdPresupuesto tr:gt(0)").show();
		 filas=$(".tdPresupuesto tr:gt(0)").length;
		 Cla=$.trim($(this).val());
		 if(filas>0){
			 $(".tdPresupuesto tr:gt(0)").each(function(index, element) {
				 tmp=$(this).find("td").eq(20).html();
				 if($("#Clasificaciones").val()!='-'){
				   if(Cla==tmp){
						$(this).show();
				   }else{
						  $(this).hide();	
						}
				 }else{
					 $(this).show();
				 }
            });
		 }else{
			 $(".tdPresupuesto tr:gt(0)").show();
		 }
	});
   $("#SlcOficina").html(OficinasVentas('S'));
   $("#SlcOficina").change(function(){
	 zonasVentas( $(this).val() );
   })
   zonasVentas($("#Organizacion").val());
   CargarDate();
   $("#btn_consultar").click(function(){
	 ConsultarPresupuesto();
   });
	 //LoadImg('Prueba de texto ...');
});