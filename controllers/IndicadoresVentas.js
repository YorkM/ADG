
var objetivos={
	'2100':{
		fidelizados:600
	},
	'2200':{
		fidelizados:600
	},
	'2300':{
		fidelizados:600
	},
	'2400':{
		fidelizados:600
	}
}
async function obtenerMesesAnio(){
	
	return new Promise((resolve,reject)=>{

	   $.ajax({     
			    url		: "../models/comparativoIndCarter.php",
				type	: "POST",
				data 	: ({op:"MES_ANO"}),
				dataType: "json",
				async:true,
				success: function(data)
				{ 
					resolve(data);
				}
			}).fail(function(data){
		   		reject(data);
	   });	
		
	});	
	
}


//DATA 
async function getData(oficina,ano,mes){

	return new Promise((resolve,reject)=>{
		
	   $.ajax({     
			    url		: "../models/IndicadoresVentas.php",
				type	: "POST",
				data 	: ({op:"C",oficina:oficina,ano:ano,mes:mes}),
				dataType: "json",
				async:true,
				success: function(data)
				{ 
					resolve(data); 
				}
			}).fail(function(data){
		   		reject(data);
	   });			
		
	});
	
}
/*
const formatNumberES = (n, d=0) => {
    n=new Intl.NumberFormat("es-ES").format(parseFloat(n).toFixed(d))
    if (d>0) {
        // Obtenemos la cantidad de decimales que tiene el numero
        const decimals=n.indexOf(",")>-1 ? n.length-1-n.indexOf(",") : 0;
 
        // añadimos los ceros necesios al numero
        n = (decimals==0) ? n+","+"0".repeat(d) : n+"0".repeat(d-decimals);
    }
    return n;
}*/

/**/
//pasa las ventas del dia a t_facturacion_sap en adg
const insertarInfoSap =async ()=>{
	
	try{
		data={
			oficina :$("#oficina").val(),
			mes 	:$("#mes").val(),
			ano		:$("#ano").val(),
			op		:'I_DATA_SAP',
			link :'../models/IndicadoresVentas.php'
		}

		resp =await enviarPeticion(data);

		console.log(resp);		
	}catch(e){
		console.error(e)
	}

}

const EjcutarProcedureIndicadores =async ()=>{
	
	try{
		data={
			oficina :$("#oficina").val(),
			mes 	:$("#mes").val(),
			ano		:$("#ano").val(),
			op		:'G_SP_IND_VENTAS',
			link :'../models/IndicadoresVentas.php'
		}

		resp =await enviarPeticion(data);

		console.log(resp);		
	}catch(e){
		console.error(e)
	}

}



$(function(){
	

	$("#oficina").html(OficinasVentasAll('S'));
	
	if($("#rol").val()!='1'){
	   $("#oficina").attr("disabled",true);
	   $("#oficina").val($("#Ofi").val());
	}
	
	obtenerMesesAnio()
	.then(resp=>{ 

		anio_req=resp.anio;
		mes		=resp.mes;

		string_anios='';
		string_meses='';

		anio_req.forEach(item=>{
			string_anios+=`<option class="${item}">${item}</option> `
		});

		$("#mes").val(mes);
		$("#ano").html(string_anios);	
	})
	.catch(e=>{
		console.error(e);
	});
	
	$("#consultar").click(async function(){

		try{

			anio	=parseInt($("#ano").val());
			mes		=parseInt($("#mes").val());
			oficina	=$("#oficina").val();
			mes_text=$("#mes option:selected").text();

			$("#result_1000,#result_2000").html('');
			if(oficina=='0'){
				Swal.fire("Validación","Debe seleccionar una oficina","warning");
				return ;
			}
			if(oficina!='0'){
				$("#result_1000").parent().removeClass("col-md-6").addClass("col-md-12");
				$("#result_2000").parent().removeClass("col-md-6").addClass("col-md-12");
			}else{
				$("#result_1000").parent().removeClass("col-md-12").addClass("col-md-6");
				$("#result_2000").parent().removeClass("col-md-12").addClass("col-md-6");			
			}
			showLoadingSwalAlert2('Consultando informacion desde SAP',false);
			$("#result_1000,#result_2000").html(`<div class="alert alert-warning"><i class=" m-1 spinner-grow spinner-grow-sm"></i> Cargando</div>`);
		
			$(".swal2-title").text("Consultando informacion en ADG");

			resp = await enviarPeticion({
				link	: "../models/IndicadoresVentas.php",
				op		:"S_DATA_SAP",
				oficina	:oficina,
				ano		:anio,
				mes		:mes
			});

			console.log({resp})

			if(mes==1){
				mes_ant=12;
			}else{
				mes_ant=mes-1;
			}

			if(mes_ant==1){
				mes_ant_ant =12;
			}else{
				mes_ant_ant=mes_ant-1;
			}
			//PRESUPUESTO MES A MES 
			arr_presupuesto_venta_mes_actual 		=  resp.presupuesto.filter(item=>item.mes == mes)
			arr_presupuesto_venta_mes_anterior 		=  resp.presupuesto.filter(item=>item.mes == mes_ant)
			arr_presupuesto_venta_mes_anterior_ant 	=  resp.presupuesto.filter(item=>item.mes == mes_ant_ant)

			const valor_presupuesto_venta_mes_actual =  arr_presupuesto_venta_mes_actual.reduce((acc, item) => acc + parseFloat(item.presupuesto), 0);
			const valor_presupuesto_venta_mes_anterior =  arr_presupuesto_venta_mes_anterior.reduce((acc, item) => acc + parseFloat(item.presupuesto), 0);
			const valor_presupuesto_venta_mes_anterior_ant =  arr_presupuesto_venta_mes_anterior_ant.reduce((acc, item) => acc + parseFloat(item.presupuesto), 0);

			const variacion1_presupuesto =(((valor_presupuesto_venta_mes_anterior/valor_presupuesto_venta_mes_anterior_ant)-1)*100).toFixed(2)
			const variacion2_presupuesto =(((valor_presupuesto_venta_mes_actual/valor_presupuesto_venta_mes_anterior)-1)*100).toFixed(2)

		

			
			//VALORES MES A MES 
			let arr_ventas_mes_actual   	=  resp.ventas.filter(item=> parseInt(item.MES) == mes );
			let arr_ventas_mes_anterior 	=  resp.ventas.filter(item=> parseInt(item.MES) == mes_ant );
			let arr_ventas_mes_anterior_ant =  resp.ventas.filter(item=> parseInt(item.MES) == mes_ant_ant );

			let valor_ventas_mes_actual 		= arr_ventas_mes_actual.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);
			let valor_ventas_mes_anterior 		= arr_ventas_mes_anterior.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);
			let valor_ventas_mes_anterior_ant 	= arr_ventas_mes_anterior_ant.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);

			const variacion1_venta = (((valor_ventas_mes_anterior/valor_ventas_mes_anterior_ant)-1)*100).toFixed(2);
			const variacion2_venta = (((valor_ventas_mes_actual/valor_ventas_mes_anterior)-1)*100).toFixed(2);

			//VENTA MES A MES AÑO ANTERIOR
			let arr_ventas_anio_ant_mes_actual   	 =  resp.ventas_anio_ant.filter(item=> parseInt(item.MES) == mes );
			let arr_ventas_anio_ant_mes_anterior 	 =  resp.ventas_anio_ant.filter(item=> parseInt(item.MES) == mes_ant );
			let arr_ventas_anio_ant_mes_anterior_ant =  resp.ventas_anio_ant.filter(item=> parseInt(item.MES) == mes_ant_ant );

			const filtro_venta_anio_ant_mes_actual 		  = arr_ventas_anio_ant_mes_actual.filter(item=> parseInt(item.MES) == mes );
			const filtro_venta_anio_ant_mes_anterior 	  = arr_ventas_anio_ant_mes_anterior.filter(item=> parseInt(item.MES) == mes_ant );
			const filtro_ventas_anio_ant_mes_anterior_ant  = arr_ventas_anio_ant_mes_anterior_ant.filter(item=> parseInt(item.MES) == mes_ant_ant );

			const valor_venta_anio_ant_mes_actual  = filtro_venta_anio_ant_mes_actual.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);
			const valor_venta_anio_ant_mes_anterior = filtro_venta_anio_ant_mes_anterior.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);
			const valor_ventas_anio_ant_mes_anterior_ant  = filtro_ventas_anio_ant_mes_anterior_ant.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);

			const variacion1_venta_anio_ant = (((valor_venta_anio_ant_mes_anterior/valor_ventas_anio_ant_mes_anterior_ant)-1)*100).toFixed(2)
			const variacion2_venta_anio_ant = (((valor_venta_anio_ant_mes_actual/valor_venta_anio_ant_mes_anterior)-1)*100).toFixed(2);

			//CUMPLIMIENTOS DE PRESUPUESTO
			const cumplimiento_presupuesto_mes_actual 		= ((valor_ventas_mes_actual/valor_presupuesto_venta_mes_actual)*100).toFixed(2)
			const cumplimiento_presupuesto_mes_anterior 	= ((valor_ventas_mes_anterior/valor_presupuesto_venta_mes_anterior)*100).toFixed(2)
			const cumplimiento_presupuesto_mes_anterior_ant = ((valor_ventas_mes_anterior_ant/valor_presupuesto_venta_mes_anterior_ant)*100).toFixed(2)

			//INCEREMENTO
			const incremento_venta_mes_actual = (((valor_ventas_mes_actual/valor_venta_anio_ant_mes_actual)-1)*100).toFixed(2);
			const incremento_venta_mes_anterior = (((valor_ventas_mes_anterior/valor_venta_anio_ant_mes_anterior)-1)*100).toFixed(2);
			const incremento_venta_mes_anterior_ant = (((valor_ventas_mes_anterior_ant/valor_ventas_anio_ant_mes_anterior_ant)-1)*100).toFixed(2);


			//ACUMULADOS

			//presupuesto
			const valor_presupuesto_ac_mes_actual = resp.presupuesto_ac_mes_actual.reduce((acc, item) => acc + parseFloat(item.presupuesto), 0);
			const valor_presupuesto_ac_mes_anterior = resp.presupuesto_ac_mes_anterior.reduce((acc, item) => acc + parseFloat(item.presupuesto), 0);
			const valor_presupuesto_ac_mes_anterior_ant = resp.presupuesto_ac_mes_anterior_ant.reduce((acc, item) => acc + parseFloat(item.presupuesto), 0);

			const variacion1_presupuesto_ac = (((valor_presupuesto_ac_mes_anterior/valor_presupuesto_ac_mes_anterior_ant)-1)*100).toFixed(2)
			const variacion2_presupuesto_ac = (((valor_presupuesto_ac_mes_actual/valor_presupuesto_ac_mes_anterior)-1)*100).toFixed(2)

			//ventas
			const valor_venta_ac_mes_actual 		= resp.ventas_ac_anio_actual.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);
			const valor_venta_ac_mes_antrtior 		= resp.ventas_ac_anio_anterior.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);
			const valor_venta_ac_mes_anterior_ant 	= resp.ventas_ac_anio_aanterior_ant.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);


			const variacion1_venta_ac = (((valor_venta_ac_mes_antrtior/valor_venta_ac_mes_anterior_ant)-1)*100).toFixed(2);
			const variacion2_venta_ac = (((valor_venta_ac_mes_actual/valor_venta_ac_mes_antrtior)-1)*100).toFixed(2);

			//ZONAS DE VENTAS
			// Contar ocurrencias de cada zona
			/*
			zonas_ventas = await enviarPeticion({
				op:'cantidad_zonas',
				link:'../models/IndicadoresVentas.php',
				oficina,
				mes,
				anio
			});
			console.log({
				zonas_ventas
			})*/
			zonas_ventas =resp.datos_fijos;



			const arr_zonas_ventas_mes_anterior 		= zonas_ventas.filter(item=> parseInt(item.MES_REAL) == mes_ant);
			const arr_zonas_ventas_mes_actual 			= zonas_ventas.filter(item=> parseInt(item.MES_REAL) == mes);
			const arr_zonas_ventas_mes_anterior_ant 	= zonas_ventas.filter(item=> parseInt(item.MES_REAL) == mes_ant_ant);
			
			const cantidad_zonas_ventas_mes_actual 		 = parseInt(arr_zonas_ventas_mes_actual.length);
			const cantidad_zonas_ventas_mes_anterior 	 = parseInt(arr_zonas_ventas_mes_anterior.length);
			const cantidad_zonas_ventas_mes_anterior_ant = parseInt(arr_zonas_ventas_mes_anterior_ant.length);

			const variacion1_cant_zonas = (((cantidad_zonas_ventas_mes_anterior/cantidad_zonas_ventas_mes_anterior_ant)-1)*100).toFixed(2)
			const variacion2_cant_zonas = (((cantidad_zonas_ventas_mes_actual/cantidad_zonas_ventas_mes_anterior)-1)*100).toFixed(2)

			const valor_promedio_venta_zona_anterior = (valor_ventas_mes_anterior/cantidad_zonas_ventas_mes_anterior).toFixed(2);
			const valor_promedio_venta_zona_actual   = (valor_ventas_mes_actual/cantidad_zonas_ventas_mes_actual).toFixed(2);
			const valor_promedio_venta_zona_anterior_ant = (valor_ventas_mes_anterior_ant/cantidad_zonas_ventas_mes_anterior_ant).toFixed(2);

			const variacion1_promedio_venta_zona = (((valor_promedio_venta_zona_anterior/valor_promedio_venta_zona_anterior_ant)-1)*100).toFixed(2);
			const variacion2_promedio_venta_zona = (((valor_promedio_venta_zona_actual/valor_promedio_venta_zona_anterior)-1)*100).toFixed(2);


			televendores = await enviarPeticion({
				op:'cantidad_televendedores',
				link:'../models/IndicadoresVentas.php',
				oficina,
				mes,
				anio
			});
			const cantidad_televendedores_mes_actual 		= parseInt(televendores.televendedores_mes_actual);
			const cantidad_televendedores_mes_anterior 	 	= parseInt(televendores.televendedores_mes_anterior);
			const cantidad_televendedores_mes_anterior_ant  = parseInt(televendores.televendedores_mes_anterior_ant);

			const variacion1_cant_televendedores = (((cantidad_televendedores_mes_anterior/cantidad_televendedores_mes_anterior_ant)-1)*100).toFixed(2)
			const variacion2_cant_televendedores = (((cantidad_televendedores_mes_actual/cantidad_televendedores_mes_anterior)-1)*100).toFixed(2)


			const valor_promedio_venta_televendedor_mes_actual   = (valor_ventas_mes_actual/cantidad_televendedores_mes_actual).toFixed(2)
			const valor_promedio_venta_televendedor_mes_anterior = (valor_ventas_mes_anterior/cantidad_televendedores_mes_anterior).toFixed(2);
			const valor_promedio_venta_televendedor_mes_anterior_ant = (valor_ventas_anio_ant_mes_anterior_ant/cantidad_televendedores_mes_anterior_ant).toFixed(2); 
			
			const variacion1_promedio_venta_televendedor = (((valor_promedio_venta_televendedor_mes_anterior/valor_promedio_venta_televendedor_mes_anterior_ant)-1)*100).toFixed(2);
			const variacion2_promedio_venta_televendedor = (((valor_promedio_venta_televendedor_mes_actual/valor_promedio_venta_televendedor_mes_anterior)-1)*100).toFixed(2);

			//PANEL DE CLIENTES
			anio_filtro=anio;

			if(mes_ant==12){
				anio_filtro =anio-1;
			}
			if(mes_ant==12){
				anio_filtro=anio-1
			}

			console.log({
				anio_filtro,
				mes_ant
			})

			const  arr_panel_cliente_mes_anterior 		= resp.datos_fijos.filter(item=>parseInt(item.MES_REAL)==mes_ant    );
			const  arr_panel_cliente_mes_actual 		= resp.datos_fijos.filter(item=>parseInt(item.MES_REAL)==mes 	    );
			const  arr_panel_cliente_mes_anterior_ant 	= resp.datos_fijos.filter(item=>parseInt(item.MES_REAL)==mes_ant_ant);

			const cantidad_panel_cliente_mes_anterior = arr_panel_cliente_mes_anterior.reduce((acc, item) => acc + parseInt(item.PANEL), 0);
			const cantidad_panel_cliente_mes_actual = arr_panel_cliente_mes_actual.reduce((acc, item) => acc + parseInt(item.PANEL), 0);
			const cantidad_panel_cliente_mes_anterior_ant = arr_panel_cliente_mes_anterior_ant.reduce((acc, item) => acc + parseInt(item.PANEL), 0);

			const variacion1_panel_cliente = (((cantidad_panel_cliente_mes_anterior/cantidad_panel_cliente_mes_anterior_ant)-1)*100).toFixed(2);
			const variacion2_panel_cliente = (((cantidad_panel_cliente_mes_actual/cantidad_panel_cliente_mes_anterior)-1)*100).toFixed(2);


			//DEVOLUCIONES 
			const arr_devoluciones_mes_anterior 		=  arr_ventas_mes_anterior.filter(item		=> item.SW=='2');
			const arr_devoluciones_mes_actual   		=  arr_ventas_mes_actual.filter(item		=> item.SW=='2');
			const arr_devoluciones_mes_anterior_ant     =  arr_ventas_mes_anterior_ant.filter(item	=> item.SW=='2');

			const arr_clientes_codigo_sap_devoluciones_mes_anterior = new Set(arr_devoluciones_mes_anterior.map(item => item.CODIGO_CLIENTE ));
			const cantidad_clientes_devoluciones_mes_anterior = arr_clientes_codigo_sap_devoluciones_mes_anterior.size;

			const arr_clientes_codigo_sap_devoluciones_mes_actual = new Set(arr_devoluciones_mes_actual.map(item => item.CODIGO_CLIENTE ));
			const cantidad_clientes_devoluciones_mes_actual = arr_clientes_codigo_sap_devoluciones_mes_actual.size;

			const arr_clientes_codigo_sap_devoluciones_mes_anterior_ant = new Set(arr_devoluciones_mes_anterior_ant.map(item => item.CODIGO_CLIENTE ));
			const cantidad_clientes_devoluciones_mes_anterior_ant = arr_clientes_codigo_sap_devoluciones_mes_anterior_ant.size;

			const participacion_n_clientes_dev_mes_anterior = ((cantidad_clientes_devoluciones_mes_anterior/cantidad_panel_cliente_mes_anterior)*100).toFixed(2)
			const participacion_n_clientes_dev_mes_actual =  ((cantidad_clientes_devoluciones_mes_actual/cantidad_panel_cliente_mes_actual)*100).toFixed(2)
			const participacion_n_clientes_dev_mes_anterior_ant = ((cantidad_clientes_devoluciones_mes_anterior_ant/cantidad_panel_cliente_mes_anterior_ant)*100).toFixed(2)

			const varacion1_part_n_clientes_dev= (((participacion_n_clientes_dev_mes_anterior/participacion_n_clientes_dev_mes_anterior_ant)-1)*100).toFixed(2)
			const varacion2_part_n_clientes_dev= (((participacion_n_clientes_dev_mes_actual/participacion_n_clientes_dev_mes_anterior)-1)*100).toFixed(2)

			console.log({
				cantidad_clientes_devoluciones_mes_anterior,
				cantidad_panel_cliente_mes_anterior
			})
			
			const valor_devoluciones_mes_anterior		= arr_devoluciones_mes_anterior.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);
			const valor_devoluciones_mes_actual			= arr_devoluciones_mes_actual.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);
			const valor_devoluciones_mes_anterior_ant 	= arr_devoluciones_mes_anterior_ant.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);

			const variacion1_valor_devolucion    = ((((valor_devoluciones_mes_anterior/valor_devoluciones_mes_anterior_ant)*-1)-1)*100).toFixed(2);
			const variacion2_valor_devolucion    = ((((valor_devoluciones_mes_actual/valor_devoluciones_mes_anterior)*-1)-1)*100).toFixed(2);

			//participacion dev en la venta
			const participacion_devolucion_mes_anterior = (((valor_devoluciones_mes_anterior*-1/ valor_ventas_mes_anterior))*100).toFixed(2);
			const participacion_devolucion_mes_actual = (((valor_devoluciones_mes_actual*-1/ valor_ventas_mes_actual))*100).toFixed(2);
			const participacion_devolucion_mes_anterior_ant = (((valor_devoluciones_mes_anterior_ant*-1/ valor_ventas_mes_anterior_ant))*100).toFixed(2);

			const variacion1_participacion_devolucion = (((participacion_devolucion_mes_anterior/participacion_devolucion_mes_anterior_ant)-1)*100).toFixed(2);
			const variacion2_participacion_devolucion = (((participacion_devolucion_mes_actual/participacion_devolucion_mes_anterior)-1)*100).toFixed(2);


			
			console.log({
				valor_ventas_mes_anterior,  valor_devoluciones_mes_anterior
			})

			//participacion de clientes con dev en el panel
			const part_clientes_dev_mes_anterior = cantidad_panel_cliente_mes_anterior

			//resp.datos_fijos.reduce((acc, item) => acc + parseFloat(item.ANEL), 0);
			console.log({
				arr_panel_cliente_mes_anterior,
				arr_panel_cliente_mes_actual,
				arr_panel_cliente_mes_anterior_ant
			})
			//clientes con devoluciones 

			//IMPACTOS 
			const  arr_clientes_impactados_mes_anterior		= arr_ventas_mes_anterior.filter(item=> item.SW =='1');
			const  arr_clientes_impactados_mes_actual  		= arr_ventas_mes_actual.filter(item=> item.SW =='1');
			const  arr_clientes_impactados_mes_anterior_ant	= arr_ventas_mes_anterior_ant.filter(item=> item.SW =='1');

			 //cant_clientes_impactados_mes_anterior 	= arr_clientes_impactados_mes_anterior.length;
			 //cant_clientes_impactados_mes_actual 		= arr_clientes_impactados_mes_actual.length;
			// cant_clientes_impactados_mes_anterior_ant = arr_clientes_impactados_mes_anterior_ant.length;

			const filtro_clientes_impactados_mes_anterior = new Set(arr_clientes_impactados_mes_anterior.map(item => item.CODIGO_CLIENTE ));
			const cant_clientes_impactados_mes_anterior = filtro_clientes_impactados_mes_anterior.size;

			const filtro_clientes_impactados_mes_actual = new Set(arr_clientes_impactados_mes_actual.map(item => item.CODIGO_CLIENTE ));
			const cant_clientes_impactados_mes_actual = filtro_clientes_impactados_mes_actual.size;

			const filtro_clientes_impactados_mes_anterior_ant = new Set(arr_clientes_impactados_mes_anterior_ant.map(item => item.CODIGO_CLIENTE ));
			const cant_clientes_impactados_mes_anterior_ant = filtro_clientes_impactados_mes_anterior_ant.size;

			const variacion1_cant_clientes_imp = (((cant_clientes_impactados_mes_anterior/cant_clientes_impactados_mes_anterior_ant)-1)*100).toFixed(2)
			const variacion2_cant_clientes_imp = (((cant_clientes_impactados_mes_actual/cant_clientes_impactados_mes_anterior)-1)*100).toFixed(2)

			const porcentaje_clientes_imp_mes_anterior = ((cant_clientes_impactados_mes_anterior/cantidad_panel_cliente_mes_anterior)*100).toFixed(2)
			const porcentaje_clientes_imp_mes_actual   = ((cant_clientes_impactados_mes_actual/cantidad_panel_cliente_mes_actual)*100).toFixed(2)
			const porcentaje_clientes_imp_mes_anterior_ant = ((cant_clientes_impactados_mes_anterior_ant/cantidad_panel_cliente_mes_anterior_ant)*100).toFixed(2)

			const variacion1_porcentaje_clientes_imp = (((porcentaje_clientes_imp_mes_anterior/porcentaje_clientes_imp_mes_anterior_ant)-1)*100).toFixed(2)
			const variacion2_porcentaje_clientes_imp = (((porcentaje_clientes_imp_mes_actual/porcentaje_clientes_imp_mes_anterior)-1)*100).toFixed(2)

			const cant_clientes_sin_impacto_mes_anterior 	 = cantidad_panel_cliente_mes_anterior-cant_clientes_impactados_mes_anterior;
			const cant_clientes_sin_impacto_mes_actual   	 = cantidad_panel_cliente_mes_actual-cant_clientes_impactados_mes_actual;
			const cant_clientes_sin_impacto_mes_anterior_ant = cantidad_panel_cliente_mes_anterior_ant-cant_clientes_impactados_mes_anterior_ant;

			const variacion1_clientes_sin_impacto = (((cant_clientes_sin_impacto_mes_anterior/cant_clientes_sin_impacto_mes_anterior_ant)-1)*100).toFixed(2)
			const variacion2_clientes_sin_impacto = (((cant_clientes_sin_impacto_mes_actual/cant_clientes_sin_impacto_mes_anterior)-1)*100).toFixed(2)

			//CLIENTES NUEVOS 
			const arr_clientes_nuevos_anterior 		= resp.clientes_nuevos.filter(item=>item.mes == mes_ant);
			const arr_clientes_nuevos_actual 		= resp.clientes_nuevos.filter(item=>item.mes == mes);
			const arr_clientes_nuevos_anterior_ant 	= resp.clientes_nuevos.filter(item=>item.mes == mes_ant_ant);

			const cant_clientes_nuevos_anterior 	= arr_clientes_nuevos_anterior.length;
			const cant_clientes_nuevos_actual   	= arr_clientes_nuevos_actual.length;
			const cant_clientes_nuevos_anterior_ant = arr_clientes_nuevos_anterior_ant.length;

			const variacion1_clientes_nuevos		= (((cant_clientes_nuevos_anterior/cant_clientes_nuevos_anterior_ant)-1)*100).toFixed(2)
			const variacion2_clientes_nuevos		= (((cant_clientes_nuevos_actual/cant_clientes_nuevos_anterior)-1)*100).toFixed(2)

			//venta clientes nuevos

			const codigosSAP_clientes_nuevos_anterior 	  = arr_clientes_nuevos_anterior.map(cliente => cliente.codigo_sap);

			const arr_ventas_clientes_nuevos_mes_anterior = arr_ventas_mes_anterior.filter(venta => 
				codigosSAP_clientes_nuevos_anterior.includes(venta.CODIGO_CLIENTE)
			);
			
			const valor_venta_clientes_nuevos_mes_anterior		= arr_ventas_clientes_nuevos_mes_anterior.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);

			//*********************************************** */
			const codigosSAP_clientes_nuevos_actual 	  = arr_clientes_nuevos_actual.map(cliente => cliente.codigo_sap);
			const arr_ventas_clientes_nuevos_mes_actual = arr_ventas_mes_actual.filter(venta => 
				codigosSAP_clientes_nuevos_actual.includes(venta.CODIGO_CLIENTE)
			);
			const valor_venta_clientes_nuevos_mes_actual		= arr_ventas_clientes_nuevos_mes_actual.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);

			//********************************************* */
			const codigosSAP_clientes_nuevos_anterior_ant 	  = arr_clientes_nuevos_anterior_ant.map(cliente => cliente.codigo_sap);
			const arr_ventas_clientes_nuevos_mes_anterior_ant = arr_ventas_mes_anterior_ant.filter(venta => 
				codigosSAP_clientes_nuevos_anterior_ant.includes(venta.CODIGO_CLIENTE)
			);
			const valor_venta_clientes_nuevos_mes_anterior_ant		= arr_ventas_clientes_nuevos_mes_anterior_ant.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO),0)
			
			const variacion1_venta_clientes_nuevos = (((valor_venta_clientes_nuevos_mes_anterior/valor_venta_clientes_nuevos_mes_anterior_ant)-1)*100).toFixed(2)
			const variacion2_venta_clientes_nuevos = (((valor_venta_clientes_nuevos_mes_actual/valor_venta_clientes_nuevos_mes_anterior)-1)*100).toFixed(2)
		
			//PROMEDIO DE VENTAS DE CLIENTES NUEVOS 
			const promedio_venta_clientes_nuevos_anterior = (valor_venta_clientes_nuevos_mes_anterior/cant_clientes_nuevos_anterior).toFixed(2)
			const promedio_venta_clientes_nuevos_actual = (valor_venta_clientes_nuevos_mes_actual/cant_clientes_nuevos_actual).toFixed(2)
			const promedio_venta_clientes_nuevos_anterior_ant = (valor_venta_clientes_nuevos_mes_anterior_ant/cant_clientes_nuevos_anterior_ant).toFixed(2)

			const variacion1_prom_ventas_clientes_nuevos = ((promedio_venta_clientes_nuevos_anterior/promedio_venta_clientes_nuevos_anterior_ant)-1).toFixed(2);
			const variacion2_prom_ventas_clientes_nuevos = ((promedio_venta_clientes_nuevos_actual/promedio_venta_clientes_nuevos_anterior)-1).toFixed(2);

			//PARTICIPACION DE CLIENTES NUEVOS EN LA VENTA
			const participacion_venta_clientes_nuevos_anterior = ((promedio_venta_clientes_nuevos_anterior/valor_ventas_mes_anterior)*100).toFixed(2);
			const participacion_venta_clientes_nuevos_actual = ((promedio_venta_clientes_nuevos_actual/valor_ventas_mes_actual)*100).toFixed(2);
			const participacion_venta_clientes_nuevos_anterior_ant = ((promedio_venta_clientes_nuevos_anterior_ant/valor_ventas_mes_anterior_ant)*100).toFixed(2);

			const variacion1_participacion_venta_clientes_nuevos = (((participacion_venta_clientes_nuevos_anterior/participacion_venta_clientes_nuevos_anterior_ant)-1)*100).toFixed(2);
			const variacion2_participacion_venta_clientes_nuevos = (((participacion_venta_clientes_nuevos_actual/participacion_venta_clientes_nuevos_anterior)-1)*100).toFixed(2);

			const arr_clientes_fidelizados_actual = resp.arr_clientes_fidelizados_mes_actual;
			const arr_clientes_fidelizados_anterior = resp.arr_clientes_fidelizados_mes_anterior; 
			const arr_clientes_fidelizados_anterior_ant = resp.arr_clientes_fidelizados_mes_anterior_ant;

		   //codigos sap clientes fidelizados mes actual
			const codigosSAP_clientes_fidelizados_actual 	  = arr_clientes_fidelizados_actual.map(cliente => cliente.codigo_sap);

			const arr_ventas_clientes_fidelizados_mes_actual = arr_ventas_mes_actual.filter(venta => 
				codigosSAP_clientes_fidelizados_actual.includes(venta.CODIGO_CLIENTE)
			);
			const valor_venta_clientes_fidelizados_mes_actual		= arr_ventas_clientes_fidelizados_mes_actual.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);
			
			//codigo sap clientes fidelizados mes anterior 
			const codigosSAP_clientes_fidelizados_anterior 	  = arr_clientes_fidelizados_anterior.map(cliente => cliente.codigo_sap);
			const arr_ventas_clientes_fidelizados_mes_anterior = arr_ventas_mes_anterior.filter(venta => 
				codigosSAP_clientes_fidelizados_anterior.includes(venta.CODIGO_CLIENTE)
			);
			const valor_venta_clientes_fidelizados_mes_anterior		= arr_ventas_clientes_fidelizados_mes_anterior.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);
			//codigo sap clientes fidelizados anterior ant 
			const codigosSAP_clientes_fidelizados_anterior_ant 	  = arr_clientes_fidelizados_anterior_ant.map(cliente => cliente.codigo_sap);
			const arr_ventas_clientes_fidelizados_mes_anterior_ant = arr_ventas_mes_anterior_ant.filter(venta => 
				codigosSAP_clientes_fidelizados_anterior_ant.includes(venta.CODIGO_CLIENTE)
			);
			const valor_venta_clientes_fidelizados_mes_anterior_ant		= arr_ventas_clientes_fidelizados_mes_anterior_ant.reduce((acc, item) => acc + parseFloat(item.VALOR_NETO), 0);
			//
			const variacion1_venta_clientes_fidelizados = valor_venta_clientes_fidelizados_mes_anterior_ant>0 ? (((valor_venta_clientes_fidelizados_mes_anterior/valor_venta_clientes_fidelizados_mes_anterior_ant)-1)*100).toFixed(2):0;
			const variacion2_venta_clientes_fidelizados = valor_venta_clientes_fidelizados_mes_anterior>0 ?(((valor_venta_clientes_fidelizados_mes_actual/valor_venta_clientes_fidelizados_mes_anterior)-1)*100).toFixed(2):0;	
			
		   const cant_clientes_fidelizados_anterior	 	=codigosSAP_clientes_fidelizados_anterior.length;
		   const cant_clientes_fidelizados_actual   	=codigosSAP_clientes_fidelizados_actual.length;
		   const cant_clientes_fidelizados_anterior_ant	=codigosSAP_clientes_fidelizados_anterior_ant.length;

		   const variacion1_clientes_fidelizados   = (((cant_clientes_fidelizados_actual/cant_clientes_fidelizados_anterior_ant)-1)*100).toFixed(2);
		   const variacion2_clientes_fidelizados   = (((cant_clientes_fidelizados_anterior/cant_clientes_fidelizados_actual)-1)*100).toFixed(2);


		   //PROMDIOS DE VENTAS CLIENTES FIDELIZADOS

		   const promedio_venta_clientes_fidelizados_anterior = (valor_venta_clientes_fidelizados_mes_anterior/cant_clientes_fidelizados_anterior).toFixed(2);
		   const promedio_venta_clientes_fidelizados_actual = (valor_venta_clientes_fidelizados_mes_actual/cant_clientes_fidelizados_actual).toFixed(2);
		   const promedio_venta_clientes_fidelizados_anterior_ant = (valor_venta_clientes_fidelizados_mes_anterior_ant/cant_clientes_fidelizados_anterior_ant).toFixed(2);
		   
		   const variacion1_venta_prom_cli_fidelizados = (((promedio_venta_clientes_fidelizados_anterior/promedio_venta_clientes_fidelizados_anterior_ant)-1)*100).toFixed(2);
		   const variacion2_venta_prom_cli_fidelizados = (((promedio_venta_clientes_fidelizados_actual/promedio_venta_clientes_fidelizados_anterior)-1)*100).toFixed(2);

		   //PARTICIPACION DE LA VENTA DE CLIENTES FIDELIZADOS VS VENTA GENERAL
		   const participacion_venta_fidelizados_anterior = (valor_venta_clientes_fidelizados_mes_anterior/valor_ventas_mes_anterior).toFixed(2);
		   const participacion_venta_fidelizados_actual   = (valor_venta_clientes_fidelizados_mes_actual/valor_ventas_mes_actual).toFixed(2);
		   const participacion_venta_fidelizados_anterior_ant   = (valor_venta_clientes_fidelizados_mes_anterior_ant/valor_ventas_mes_anterior_ant).toFixed(2);

		   const variacion1_part_venta_fidelizados =	(((participacion_venta_fidelizados_anterior/participacion_venta_fidelizados_anterior_ant)-1)*100).toFixed(2);
		   const variacion2_part_venta_fidelizados =	(((participacion_venta_fidelizados_actual/participacion_venta_fidelizados_anterior)-1)*100).toFixed(2);

		    //crecimiento 

			arr_obj_fidelizado = resp.objetivos.filter(item=>parseInt(item.oficina_ventas)==oficina && item.codigo==4);

			filtrado		= arr_obj_fidelizado.filter(item=>item.anio==anio)

			obj_mes_anterior= filtrado[0].valor;
			obj_mes_actual	= filtrado[0].valor;
			obj_mes_anterior_ant= filtrado[0].valor;

			if(mes==1 || mes==2){
				filtrado				 = arr_obj_fidelizado.filter(item=>item.anio==anio-1)
				obj_mes_anterior		 = filtrado[0].valor;
				obj_mes_anterior_ant	 = filtrado[0].valor;
			}
			

			const crecimiento_cli_fidelizados_mes_anterior 		=((cant_clientes_fidelizados_anterior/obj_mes_anterior)*100).toFixed(2);
			const crecimiento_cli_fidelizados_mes_actual   		=((cant_clientes_fidelizados_actual/obj_mes_actual)*100).toFixed(2);
			const crecimiento_cli_fidelizados_mes_anterior_ant 	=((cant_clientes_fidelizados_anterior_ant/obj_mes_anterior_ant)*100).toFixed(2);

			 const variacion1_crecimiento_fidelizados =  (((crecimiento_cli_fidelizados_mes_anterior/crecimiento_cli_fidelizados_mes_anterior_ant)-1)*100).toFixed(2);
			 const variacion2_crecimiento_fidelizados =  (((crecimiento_cli_fidelizados_mes_actual/crecimiento_cli_fidelizados_mes_anterior)-1)*100).toFixed(2);


			 //clientes nuevos acumulados 
			 const ac_clientes_nuevos_anterior 	  	=  resp.ac_clientes_nuevos_anterior.length;
			 const ac_clientes_nuevos_actual 	  	=  resp.ac_clientes_nuevos_actual.length;
			 const ac_clientes_nuevos_anterior_ant  =  resp.ac_clientes_nuevos_anterior_ant.length; 

			 const variacion1_ac_clientes_nuevos = (((ac_clientes_nuevos_anterior/ac_clientes_nuevos_anterior_ant)-1)*100).toFixed(2)
			 const variacion2_ac_clientes_nuevos = (((ac_clientes_nuevos_actual/ac_clientes_nuevos_anterior)-1)*100).toFixed(2)

			 //clientes nuevos no visitados 
			// VISITAS MES ACTUAL 	
			const visitas_mes_anterior 		= resp.visitas.filter(item=>item.mes==mes_ant);
			const visitas_mes_anterior_ant 	= resp.visitas.filter(item=>item.mes==mes_ant_ant);
			const visitas_mes_actual        = resp.visitas.filter(item=>item.mes==mes);

			const visitas_c_mes_anterior =visitas_mes_anterior.filter(item=>item.estado=='C');
		    const codigosSAP_cli_nuevos_no_visitados_anterior = arr_clientes_nuevos_anterior.filter(obj1 => 
				!visitas_c_mes_anterior.some(obj2 => obj2.codigo === obj1.codigo_sap)
			);

			const visitas_c_mes_actual =visitas_mes_actual.filter(item=>item.estado=='C');
		    const codigosSAP_cli_nuevos_no_visitados_actual = arr_clientes_nuevos_actual.filter(obj1 => 
				!visitas_c_mes_actual.some(obj2 => obj2.codigo === obj1.codigo_sap)
			);

			const visitas_c_mes_anterior_ant =visitas_mes_aanterior_ant.filter(item=>item.estado=='C');
		    const codigosSAP_cli_nuevos_no_visitados_anterior_ant = arr_clientes_nuevos_aterior_ant.filter(obj1 => 
				!visitas_c_mes_anterior_an.some(obj2 => obj2.codigo === obj1.codigo_sap)
			);

	
			console.log({ 
				valor_ventas_mes_actual,
				valor_ventas_mes_anterior,
				valor_ventas_mes_anterior_ant,
				valor_venta_anio_ant_mes_actual,
				valor_venta_anio_ant_mes_anterior,
				valor_ventas_anio_ant_mes_anterior_ant,
				valor_presupuesto_venta_mes_actual,
				valor_presupuesto_venta_mes_anterior,
				valor_presupuesto_venta_mes_anterior_ant,
				cumplimiento_presupuesto_mes_anterior,
				cumplimiento_presupuesto_mes_anterior_ant,
				valor_presupuesto_ac_mes_actual,
				valor_presupuesto_ac_mes_anterior,
				valor_presupuesto_ac_mes_anterior_ant,
				valor_venta_ac_mes_actual,
				valor_venta_ac_mes_antrtior,
				valor_venta_ac_mes_anterior_ant,
				valor_devoluciones_mes_anterior,
				valor_devoluciones_mes_actual,
				valor_devoluciones_mes_anterior_ant,
				cant_clientes_nuevos_anterior,
				cant_clientes_nuevos_actual,
				cant_clientes_nuevos_anterior_ant,
				participacion_venta_clientes_nuevos_anterior,
				participacion_venta_clientes_nuevos_actual,
				participacion_venta_clientes_nuevos_anterior_ant
			})
			logo=oficina.substring(0,1)=='1' ?'logo_cm2.jpg': 'logo_roma.jpg';

			tabla =`
			<table class="table table-sm table-bordered">
			  <thead>
				 <tr>
					<th><img src="../resources/images/${logo}" height="60" width="120" ></th>
					<th colspan="6" valign="top"><h4>Informe integral de ventas</h4></th>
				</tr> 
				 <tr>
					<td cospan="7">Oficina</td>
				</tr> 
				<tr  class="head_indicadores">
					<td class="text-start">${mes_text} de ${anio}</td>
					<td class="bg-dark text-white">${ObtenerMes(mes_ant)}</td>
					<td class="bg-dark text-white">Variacion vs mes ant.</td>
					<td class="bg-dark text-white">${ObtenerMes(mes)}</td>
					<td class="bg-dark text-white">Variacion vs mes ant.</td>
					<td class="bg-dark text-white">Puntos %</td>
					<td class="bg-dark text-white"></td>
				</tr>
				
			</thead>
		`
		tabla+=`<tr>
			<td colspan="7" class="p-2 table-primary">PRESUPUESTOS DE VENTAS</td>
		</tr>
		<tr>
			<td colspan="7" class="table-primary">META CUMP PRE. 100% CREC 12%</td>
		</tr>
		<tr>
			<td >VALOR PRESUPUESTO</td>
			<td class="text-end">${formatNumberES(valor_presupuesto_venta_mes_anterior,0,'$')}</td>
			<td class="text-end">${variacion1_presupuesto}%&nbsp;
			<i class="fa fa-info-circle text-primary"
			data-toggle="tooltip" data-placement="top" title="(((${formatNumberES(valor_presupuesto_venta_mes_anterior,0,'$')}/${formatNumberES(valor_presupuesto_venta_mes_anterior_ant,0,'$')})-1)*100)"
			></i>
			</td>
			<td class="text-end">${formatNumberES(valor_presupuesto_venta_mes_actual,0,'$')}</td>
			<td class="text-end" title="">${variacion2_presupuesto}%&nbsp; 
			<i class="fa fa-info-circle text-primary"
			data-toggle="tooltip" data-placement="top" title="(((${formatNumberES(valor_presupuesto_venta_mes_actual,0,'$')}/${formatNumberES(valor_presupuesto_venta_mes_anterior,0,'$')})-1)*100)"
			></i>
			</td>
			<td class="text-end">${(variacion2_presupuesto-variacion1_presupuesto).toFixed(2)}%</td>
		</tr>
		<tr>
			<td>VALOR VENTA</td>
			<td class="text-end">${formatNumberES(valor_ventas_mes_anterior,0,'$')}</td>
			<td class="text-end">${variacion1_venta}%&nbsp;
			<i class="fa fa-info-circle text-primary"
			data-toggle="tooltip" data-placement="top" title="(((${formatNumberES(valor_ventas_mes_anterior,0,'$')}/${formatNumberES(valor_ventas_mes_anterior_ant,0,'$')})-1)*100)"
			></i>
			</td>
			<td class="text-end">${formatNumberES(valor_ventas_mes_actual,0,'$')}</td>
			<td class="text-end">${variacion2_venta}%&nbsp;
			<i class="fa fa-info-circle text-primary"
			data-toggle="tooltip" data-placement="top" title=" (((${formatNumberES(valor_ventas_mes_actual,0,'$')}/${formatNumberES(valor_ventas_mes_anterior,0,'$')})-1)*100)"
			></i>
			</td>
			<td class="text-end">${(variacion2_venta-variacion1_venta).toFixed(2)}%</td>
		</tr>
		<tr>
			<td>CUMPLIMIENTO PPTO%</td>
			<td class="text-end">${cumplimiento_presupuesto_mes_anterior}%</td>
			<td class="text-end"></td>
			<td class="text-end">${cumplimiento_presupuesto_mes_actual}%</td>
			<td class="text-end"></td>
			<td class="text-end"></td>
		</tr>
		<tr>
			<td>VALOR VENTA AÑO ANTERIOR</td>
			<td class="text-end">${ formatNumberES(valor_venta_anio_ant_mes_anterior,0,'$') }</td>
			<td class="text-end">${variacion1_venta_anio_ant}%&nbsp;
			   <i class="fa fa-info-circle text-primary"
			   data-toggle="tooltip" data-placement="top" title="(((${formatNumberES(valor_venta_anio_ant_mes_anterior,0,'$')}/${formatNumberES(valor_ventas_anio_ant_mes_anterior_ant,0,'$')})-1)*100)"  
			   ></i>
			</td>
			<td class="text-end">${ formatNumberES(valor_venta_anio_ant_mes_actual,0,'$') }</td>
			<td class="text-end">${variacion2_venta_anio_ant}%&nbsp;
			  <i class="fa fa-info-circle text-primary"
			   data-toggle="tooltip" data-placement="top" title="(((${formatNumberES(valor_venta_anio_ant_mes_actual,0,'$')}/${formatNumberES(valor_venta_anio_ant_mes_anterior,0,'$')})-1)*100)" 
			  ></i>
			</td>
			<td class="text-end"></td>
		</tr>
		<tr>    
			<td>INCREMENTO VS AÑO ANTERIOR</td>
			<td class="text-end">${incremento_venta_mes_anterior}%</td>
			<td class="text-end"></td>
			<td class="text-end">${incremento_venta_mes_actual}%</td>
			<td class="text-end"></td>
			<td class="text-end"></td>
		</tr>
		<tr>
			<td>ACUMULADO AÑO: VALOR PRESUPUESTO DE VENTAS</td>  
			<td class="text-end">${formatNumberES(valor_presupuesto_ac_mes_anterior,0,'$')}</td>
			<td class="text-end">${variacion1_presupuesto_ac}%&nbsp;
			<i class="fa fa-info-circle text-primary"
			   data-toggle="tooltip" data-placement="top" title="(((${formatNumberES(valor_presupuesto_ac_mes_anterior,0,'$')}/${formatNumberES(valor_presupuesto_ac_mes_anterior_ant,0,'$')})-1)*100)"
			></i>
			</td>
			<td class="text-end">${formatNumberES(valor_presupuesto_ac_mes_actual,0,'$')}</td>
			<td class="text-end">${variacion2_presupuesto_ac}%&nbsp;
			 <i class="fa fa-info-circle text-primary"
			 data-toggle="tooltip" data-placement="top" title="(((${formatNumberES(valor_presupuesto_ac_mes_actual,0,'$')}/${formatNumberES(valor_presupuesto_ac_mes_anterior,0,'$')})-1)*100)"
			 ></i>
			 </td>
			<td class="text-end">${(variacion2_presupuesto_ac-variacion1_presupuesto_ac).toFixed(2)}%</td>
		</tr>
		<tr>
			<td  class="text-end">ACUMULADO AÑO: VALOR VENTAS </td>
			<td  class="text-end">${ formatNumberES(valor_venta_ac_mes_antrtior,0,'$') }</td>
			<td  class="text-end">${variacion1_venta_ac}%&nbsp;
			<i class="fa fa-info-circle text-primary"
			   data-toggle="tooltip" data-placement="top" title="(((${formatNumberES(valor_venta_ac_mes_antrtior,0,'$')}/${formatNumberES(valor_venta_ac_mes_anterior_ant,0,'$')})-1)*100)"
			  ></i>
			</td>
			<td  class="text-end">${ formatNumberES( valor_venta_ac_mes_actual,0,'$') }</td>
			<td  class="text-end">${variacion2_venta_ac}%&nbsp;
			   <i class="fa fa-info-circle text-primary"
			   data-toggle="tooltip" data-placement="top" title="(((${formatNumberES(valor_venta_ac_mes_actual,0,'$')}/${formatNumberES(valor_venta_ac_mes_antrtior,0,'$')})-1)*100)"
			   ></i>
			</td>
			<td  class="text-end">${(variacion2_venta_ac-variacion1_venta_ac).toFixed(2)}%</td>
		</tr>
		<tr>
			<td>ACUMULADO AÑO: CUMPLIMIENTO PRESUPUESTO VENTAS</td>
			<td class="text-end">${ ((((valor_venta_ac_mes_antrtior/valor_presupuesto_ac_mes_anterior)-1))*100).toFixed(2) }</td>
			<td class="text-end"></td>
			<td class="text-end">${ ((((valor_venta_ac_mes_actual/valor_presupuesto_ac_mes_actual)-1))*100).toFixed(2) }</td>
			<td class="text-end"></td>
			<td class="text-end"></td>
		</tr>	
		<tr>
			<td>ACUMULADO AÑO: INCREMENTO VENTAS VS AÑO ANTERIOR</td>
			<td class="text-end"></td>
			<td class="text-end"></td>
			<td class="text-end"></td>
			<td class="text-end"></td>
			<td class="text-end"></td>
		</tr>
		<tr>
			<td>DEFICIT</td>
			<td class="text-end"></td>
			<td class="text-end"></td>
			<td class="text-end"></td>
			<td class="text-end"></td>
			<td class="text-end"></td>
		</tr>
		<tr>
		    <td colspan="7" class="p-2 table-primary">ZONAS DE VENTAS </td>
		</tr>
		<tr>
			<td >TOTAL CANTIDAD DE ZONAS</td>
			<td class="text-end">${cantidad_zonas_ventas_mes_anterior}</td>
			<td class="text-end">${variacion1_cant_zonas}%</td>
			<td class="text-end">${cantidad_zonas_ventas_mes_actual}</td>
			<td class="text-end">${variacion2_cant_zonas}%</td>
			<td class="text-end">${(variacion2_cant_zonas-variacion1_cant_zonas).toFixed(2)}</td>
		</tr>
		<tr>
			<td>PROMEDIO DE VENTA POR ZONA</td>
			<td class="text-end">${formatNumberES(valor_promedio_venta_zona_anterior,0,'$')}</td>
			<td class="text-end">${variacion1_promedio_venta_zona}%</td>
			<td class="text-end">${formatNumberES(valor_promedio_venta_zona_actual,0,'$')}</td>
			<td class="text-end">${variacion2_promedio_venta_zona}%</td>
			<td class="text-end">${(variacion2_promedio_venta_zona-variacion1_promedio_venta_zona).toFixed(2)}%</td>
		</tr>
		<tr>
			<td>CANTIDAD DE TELEVENDEDORES</td>
			<td class="text-end">${cantidad_televendedores_mes_anterior}</td>
			<td class="text-end">${variacion1_cant_televendedores}%</td>
			<td class="text-end">${cantidad_televendedores_mes_actual}</td>
			<td class="text-end">${variacion2_cant_televendedores}%</td>
			<td class="text-end">${(variacion2_cant_televendedores-variacion1_cant_televendedores).toFixed(2)}%</td>
		</tr>
		<tr>
			<td>PROMEDIO DE VENTA POR TELEVENDEDORES</td>
			<td class="text-end">${ formatNumberES(valor_promedio_venta_televendedor_mes_anterior,0,'$') }</td>
			<td class="text-end">${variacion1_promedio_venta_televendedor}%</td>
			<td class="text-end">${ formatNumberES( valor_promedio_venta_televendedor_mes_actual,0,'$') }</td>
			<td class="text-end">${ variacion2_promedio_venta_televendedor }%</td>
			<td class="text-end">${(variacion2_promedio_venta_televendedor-variacion1_promedio_venta_televendedor).toFixed(2)}%</td>
		</tr>
		<tr>
		    <td colspan="7" class="p-2 table-primary">DEVOLUCIONES </td>
		</tr>
		<tr>
		    <td colspan="7" class=" table-primary">META <1% </td>
		</tr>
		<tr>
	      	<td class="text-end">VALOR DEVOLUCIONES</td>
			<td class="text-end text-danger">${formatNumberES(valor_devoluciones_mes_anterior,0,'$')}</td>
			<td class="text-end">${variacion1_valor_devolucion}</td>
			<td class="text-end text-danger">${formatNumberES(valor_devoluciones_mes_actual,0,'$')}</td>
			<td class="text-end">${variacion2_valor_devolucion}</td>
			<td class="text-end">${(variacion2_valor_devolucion-variacion1_valor_devolucion).toFixed(2)}</td>
		</tr>
		<tr>
			<td  class="text-end">PARTICIPACIÓN % DEVOLUCIONES  / VENTAS</td>
			<td  class="text-end">${participacion_devolucion_mes_anterior}%<br> <small style="font-size:9px">(${formatNumberES(valor_devoluciones_mes_anterior,0,'$')}/ ${formatNumberES(valor_ventas_mes_anterior,0,'$')})</small></td>
			<td  class="text-end">${variacion1_participacion_devolucion}% <br><small style="font-size:9px">${participacion_devolucion_mes_anterior}/${participacion_devolucion_mes_anterior_ant}</small></td>
			<td  class="text-end">${participacion_devolucion_mes_actual}%</td>
			<td  class="text-end">${variacion2_participacion_devolucion}%</td>
			<td  class="text-end">${(variacion2_participacion_devolucion-variacion1_participacion_devolucion).toFixed(2)}%</td>
			<td  class="text-end"></td>
		</tr>
		<tr>
			<td>PORCENTAJE (%) DE CLIENTES IMPACTADOS</td>
			<td class="text-end">${participacion_n_clientes_dev_mes_anterior}<br><small style="font-size:9px">${cantidad_clientes_devoluciones_mes_anterior}/${cantidad_panel_cliente_mes_anterior}</small></td>
			<td class="text-end">${varacion1_part_n_clientes_dev}%</td>
			<td class="text-end">${participacion_n_clientes_dev_mes_actual}<br><small style="font-size:9px">${cantidad_clientes_devoluciones_mes_actual}/${cantidad_panel_cliente_mes_actual}</small></td>
			<td class="text-end">${varacion2_part_n_clientes_dev}%</td>
			<td class="text-end">${(varacion2_part_n_clientes_dev-varacion1_part_n_clientes_dev).toFixed(2)}%</td>
		</tr>
		<tr>
		   <td colspan="7"  class=" table-primary">IMPACTOS (cantidad de clientes impactados)</td>
		</tr>
		<tr>
			<td colspan="7" class=" table-primary">META: CLIENTES PROMEDIO MENSUAL: 70%  --  1450</td>
		</tr>
		<tr>
			<td>CANTIDAD DE CLIENTES DEL PANEL</td>
			<td  class="text-end">${cantidad_panel_cliente_mes_anterior}</td>
			<td  class="text-end">${variacion1_panel_cliente}%</td>
			<td  class="text-end">${cantidad_panel_cliente_mes_actual}</td>
			<td  class="text-end">${variacion2_panel_cliente}%</td>
			<td  class="text-end">${(variacion2_panel_cliente-variacion1_panel_cliente).toFixed(2)}</td>
		</tr>
		<tr>
			<td>CANTIDAD DE CLIENTES IMPACTADOS</td>
			<td  class="text-end">${cant_clientes_impactados_mes_anterior}</td>
			<td  class="text-end">${variacion1_cant_clientes_imp}% <br><small style="font-size:9px">${cant_clientes_impactados_mes_anterior}/${cant_clientes_impactados_mes_anterior_ant}</small></td>
			<td  class="text-end">${cant_clientes_impactados_mes_actual}</td>
			<td  class="text-end">${variacion2_cant_clientes_imp}% <br><small style="font-size:9px">${cant_clientes_impactados_mes_actual}/${cant_clientes_impactados_mes_anterior}</smal></td>
			<td  class="text-end">${(variacion2_cant_clientes_imp-variacion1_cant_clientes_imp).toFixed(2)}%</td>
		</tr>
		<tr>
			<td>PORCENTAJE (%) DE CLIENTES IMPACTADOS</td>
			<td  class="text-end">${porcentaje_clientes_imp_mes_anterior}%</td>
			<td  class="text-end">${variacion1_porcentaje_clientes_imp}%</td>
			<td  class="text-end">${porcentaje_clientes_imp_mes_actual}%</td>
			<td  class="text-end">${variacion2_porcentaje_clientes_imp}%</td>
			<td  class="text-end">${(variacion2_porcentaje_clientes_imp-variacion1_porcentaje_clientes_imp).toFixed(2)}%</td>
		</tr>
		<tr>
			<td>CANTIDAD DE CLIENTES SIN IMPACTO </td>
			<td class="text-end">${cant_clientes_sin_impacto_mes_anterior}</td>
			<td class="text-end">${variacion1_clientes_sin_impacto}%</td>
			<td class="text-end">${cant_clientes_sin_impacto_mes_actual}</td>
			<td class="text-end">${variacion2_clientes_sin_impacto}%</td>
			<td class="text-end">${(variacion2_clientes_sin_impacto-variacion1_clientes_sin_impacto).toFixed(2)}>%</td>
		</tr>
		<tr>
			<td  colspan="7"  class=" table-primary" >CLIENTES FIDELIZADOS (compras todos los meses)</td>
		</tr>
		<tr>
			<td   colspan="7"  class=" table-success">META: 600</td>
		</tr>
		<tr>
			<td>VALOR VENTA A CLIENTES FIDELIZADOS</td>
			<td class="text-end">${formatNumberES(valor_venta_clientes_fidelizados_mes_anterior,0,'$')}</td>
			<td class="text-end">${variacion1_venta_clientes_fidelizados}%<br><small style="font-size:9px">${formatNumberES(valor_venta_clientes_fidelizados_mes_anterior,0,'$')}/${formatNumberES(valor_venta_clientes_fidelizados_mes_anterior_ant,0,'$')}</small></td>
			<td class="text-end">${formatNumberES(valor_venta_clientes_fidelizados_mes_actual,0,'$')}</td>
			<td class="text-end">${variacion2_venta_clientes_fidelizados}%</td>
			<td class="text-end">${(variacion2_venta_clientes_fidelizados-variacion1_venta_clientes_fidelizados)}%</td>
		</tr>
		<tr>
			<td>CLIENTES FIDELIZADOS</td>
			<td class="text-end">${cant_clientes_fidelizados_anterior}</td>
			<td class="text-end">${variacion1_clientes_fidelizados}% <br><small style="font-size:9px">${cant_clientes_fidelizados_anterior}/${cant_clientes_fidelizados_anterior_ant}</small></td>
			<td class="text-end">${cant_clientes_fidelizados_actual}</td>
			<td class="text-end">${variacion2_clientes_fidelizados}%</td>
			<td class="text-end">${(variacion2_clientes_fidelizados-variacion1_clientes_fidelizados).toFixed(0)}%</td>
		</tr>
		<tr>
			<td>PROMEDIO VENTA POR CLIENTE</td>
			<td class="text-end">${formatNumberES(promedio_venta_clientes_fidelizados_anterior,0,'$')}</td>
			<td class="text-end">${variacion1_venta_prom_cli_fidelizados}% <br><small style="font-size:9px">${formatNumberES(promedio_venta_clientes_fidelizados_anterior,0,'$')}/${formatNumberES(promedio_venta_clientes_fidelizados_anterior_ant,0,'$')}</small> </td>
			<td class="text-end">${formatNumberES(promedio_venta_clientes_fidelizados_actual,0,'$')}</td>
			<td class="text-end">${variacion2_venta_clientes_fidelizados}%</td>
			<td class="text-end">${(variacion2_venta_prom_cli_fidelizados-variacion2_venta_prom_cli_fidelizados).toFixed(2)}%</td>
		</tr>
		<tr>
			<td>PARTICIPACIÓN % FIDELIZADOS/VENTA TOTAL</td>
			<td class="text-end">${participacion_venta_fidelizados_anterior}%</td>
			<td class="text-end">${variacion1_part_venta_fidelizados}% <br><small style="font-size:9px">${participacion_venta_fidelizados_anterior}/${participacion_venta_fidelizados_anterior_ant}</small></td>
			<td class="text-end">${participacion_venta_fidelizados_actual}</td>
			<td class="text-end">${variacion2_part_venta_fidelizados}</td>
			<td class="text-end">${(variacion2_part_venta_fidelizados-variacion1_part_venta_fidelizados)}%</td>
		</tr>
		<tr>
			<td>CRECIMIENTO % VS OBJETIVO DE 600 CLIENTES</td>
			<td class="text-end">${crecimiento_cli_fidelizados_mes_anterior}%</td>
			<td class="text-end">${variacion1_crecimiento_fidelizados}%  <br><small style="font-size:9px">${crecimiento_cli_fidelizados_mes_anterior}/${crecimiento_cli_fidelizados_mes_anterior_ant}</small></td>
			<td class="text-end">${crecimiento_cli_fidelizados_mes_actual}%</td>
			<td class="text-end">${variacion2_crecimiento_fidelizados}</td>
			<td class="text-end">${(variacion2_crecimiento_fidelizados-variacion1_crecimiento_fidelizados).toFixed(2)}</td>
		</tr>
		<tr>
		   <td colspan="7"  class=" table-primary">CLIENTES NUEVOS</td>
		</tr>
		<tr>
			<td colspan="7" class=" table-primary">META: 480</td>
		</tr>
		<tr>
			<td>CANTIDAD DE CLIENTES NUEVOS</td>
			<td class="text-end">${cant_clientes_nuevos_anterior}</td>
			<td class="text-end">${variacion1_clientes_nuevos}%</td>
			<td class="text-end">${cant_clientes_nuevos_actual}</td>
			<td class="text-end">${variacion2_clientes_nuevos}</td>
			<td class="text-end">${(variacion2_clientes_nuevos-variacion1_clientes_nuevos).toFixed(2)}%</td>
		</tr>
		<tr>
			<td>VALOR VENTA CLIENTES NUEVOS </td>
			<td  class="text-end">${formatNumberES(valor_venta_clientes_nuevos_mes_anterior,0,'$')}</td>
			<td  class="text-end">${variacion1_venta_clientes_nuevos}% <br> <small style="font-size:9px">${formatNumberES(valor_venta_clientes_nuevos_mes_anterior,0,'$')}/${formatNumberES(valor_venta_clientes_nuevos_mes_anterior_ant,0,'$')}</small></td>
			<td  class="text-end">${formatNumberES(valor_venta_clientes_nuevos_mes_actual,0,'$')}</td>
			<td  class="text-end">${variacion2_venta_clientes_nuevos}%</td>
			<td  class="text-end">${(variacion2_venta_clientes_nuevos-variacion1_venta_clientes_nuevos).toFixed(2)}%</td>
		</tr>
		<tr>
			<td>PROMEDIO VENTA POR CLIENTE</td>
			<td class="text-end">${formatNumberES(promedio_venta_clientes_nuevos_anterior,0,'$')}</td>
			<td class="text-end">${variacion1_prom_ventas_clientes_nuevos}%<br><small style="font-size:9px">${formatNumberES(promedio_venta_clientes_nuevos_anterior,0,'$')}/${formatNumberES(promedio_venta_clientes_nuevos_anterior_ant,0,'$')}</small></td>
			<td class="text-end">${formatNumberES(promedio_venta_clientes_nuevos_actual,0,'$')}</td>
			<td class="text-end">${(variacion2_prom_ventas_clientes_nuevos)}%</td>
			<td class="text-end">${(variacion2_prom_ventas_clientes_nuevos-variacion1_prom_ventas_clientes_nuevos).toFixed(2)}</td>
		</tr>
		<tr>
			<td>PARTICIPACION % VENTA NUEVOS / VENTA TOTAL</td>
			<td class="text-end">${participacion_venta_clientes_nuevos_anterior}%</td>
			<td class="text-end">${variacion1_participacion_venta_clientes_nuevos}%<br><small style="font-size:9px">${participacion_venta_clientes_nuevos_anterior}/${participacion_venta_clientes_nuevos_anterior_ant}</small></td>
			<td class="text-end">${participacion_venta_clientes_nuevos_actual}%</td>
			<td class="text-end">${variacion2_participacion_venta_clientes_nuevos}%</td>
			<td class="text-end">${(variacion2_participacion_venta_clientes_nuevos-variacion1_participacion_venta_clientes_nuevos).toFixed(2)}%</td>
		</tr>
		<tr>
			<td>CUMPLIMIENTO ACUM CLIENTES NUEVOS</td>
			<td class="text-end">${ac_clientes_nuevos_anterior}</td>
			<td class="text-end">${variacion1_ac_clientes_nuevos}%<br><small style="font-size:9px">${ac_clientes_nuevos_anterior}/${ac_clientes_nuevos_anterior_ant}</small></td>
			<td class="text-end">${ac_clientes_nuevos_actual}</td>
			<td class="text-end">${variacion2_ac_clientes_nuevos}%</td>
			<td class="text-end">${(variacion2_ac_clientes_nuevos-variacion1_ac_clientes_nuevos).toFixed(2)}%</td>
		</tr>
		<tr>
			<td>TOTAL CLIENTES NO VISITADOS</td>
			<td></td>
		</tr>
		`
			//TOTAL CLIENTES NO VISITADOS
		tabla+=`</table>`
			//ACUMULADOS AÑO 
		
			//console.log(tabla)
			$("#result").html(tabla)
			$('i').tooltip('show')
			$('i').tooltip('hide')
			dissminSwal()
		}catch(e){
			console.error(e)
	
			$("#result").html(`
			<div class="alert alert-danger alert-dismissible fade show" role="alert">
				<i class="bi bi-exclamation-octagon me-1"></i>
				 Ocurrio un error al generar los datos!
			
				<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
			</div>
			`)
			dissminSwal()
		}


	})

	$("#consultar_ant").click(async function(){
	
		anio	=$("#ano").val();
		mes		=$("#mes").val();
		oficina	=$("#oficina").val();
		mes_text=$("#mes option:selected").text();
		$("#result_1000,#result_2000").html('');
		if(oficina=='0'){
		    Swal.fire("Validación","Debe seleccionar una oficina","warning");
			return ;
		}
		sw=true;
		//
		if(anio!=parseInt($("#ano_actual").val())){
		  sw=false;   
		}

		if(mes!=parseInt($("#mes_actual").val())){
		   sw=false;
		}
		//valido si inserto la info 
		/*
		if(sw){
		   $("#consultar").attr("disabled",true);
		   $("#cargado-info").html(`		
			<div class="alert alert-warning d-flex align-items-center" role="alert">
		     	<i class="fa-solid fa-circle-notch fa-spin"></i>
		  		<div>
					 INSERTANDO INFORMACION DESDE SAP... esta accion puede tardar 
		  		</div>
			</div>`).show();
		   showLoadingSwalAlert2('Consultando informacion desde SAP',false);

		  // await insertarInfoSap(); 
		  
			$("#cargado-info").html(`		
				<div class="alert alert-success d-flex align-items-center" role="alert">
				<i class="fa-solid fa-circle-notch fa-spin"></i>
					<div>
						 CALCULANDO INDICADORES... esta accion puede tardar 
					</div>
				</div>`).show();
			//ejecuto el procedimiento 
			$(".swal2-title").text("Calculando los indicadores de ventas");
			await EjcutarProcedureIndicadores();
			$("#cargado-info").html('').hide();
			$("#columnas").show();
			$("#consultar").attr("disabled",false);
			$(".swal2-title").text("");
		 }else{
			  showLoadingSwalAlert2('Consultando informacion desde ADG',false);
			  $("#cargado-info").html(`		
			<div class="alert alert-warning d-flex align-items-center" role="alert">
		     	<i class="fa-solid fa-circle-notch fa-spin"></i>
		  		<div>
					 Consultando información 
		  		</div>
			</div>`).show();
			$("#columnas").show();
			$("#consultar").attr("disabled",false);
		 }*/

		
		if(oficina!='0'){
		  $("#result_1000").parent().removeClass("col-md-6").addClass("col-md-12");
		  $("#result_2000").parent().removeClass("col-md-6").addClass("col-md-12");
		}else{
		  $("#result_1000").parent().removeClass("col-md-12").addClass("col-md-6");
		  $("#result_2000").parent().removeClass("col-md-12").addClass("col-md-6");			
		}
		
		$("#result_1000,#result_2000").html(`<div class="alert alert-warning"><i class=" m-1 spinner-grow spinner-grow-sm"></i> Cargando</div>`);
	
		$(".swal2-title").text("Consultando informacion en ADG");
		getData(oficina,anio,mes)
		.then(resp=>{ console.warn({resp})
			dissminSwal();
			
			$("#result_1000,#result_2000").html('');
			
			resp.forEach(item=>{
				
				oficinaSub=item.oficina.substr(0,1);
				
				if(oficinaSub=='1'){
				   color_ofcina='warning';
				}else{
					color_ofcina='info';
				}
			
				tabla=`

					<div class=" mb-3 p-1 shadow row">
					 <div class="col-md-9">
 					 <table class="table table-hover table-sm">
						<thead >
							<tr class="oficinas">
								<th colspan="3" class="text-center bg-${color_ofcina} p-3 rounded text-white"><i class="fa-regular fa-building p-1"></i> OFICINA ${item.oficina}</th>	
							</tr>
							<tr><td colspan="3"></td></tr>
							<tr>
								<th class="bg-dark text-white"> <i class="fa-solid fa-chart-line p-1"></i> PRESUPUESTO VENTAS</th>
								<th class="bg-dark text-white">MES ${mes_text.toUpperCase()}</th>
								<th class="bg-dark text-white">VARIAC % vs MES ANT</th>
							</tr>
							<tr>
								<th  class="alert-danger">META: CUMP PPTP 100%,CREC 10%</th>
								<th colspan="2" class="alert-danger"></th>
							</tr>
						</thead>
						 <tbody>
							<tr>
								<td>VALOR PRESUPUESTO</td>
								<td>${formatNumberES(item.valor_presupuesto,0,'$')}</td>
								<td>${item.var_valor_presupuesto}</td>
							</tr>
							<tr>
							    <td>VALOR VENTA</td>
								<td>${formatNumberES(item.valor_venta,0,'$')}</td>
								<td>${item.var_valor_venta}</td>
							</tr>
							<tr>
							    <td>CUMPLIMIENTO PPTO %</td>
								<td>${formatNumberES(item.cumplimiento,2,'%')}</td>
								<td>${item.var_cumplimiento}</td>
							</tr>
							<tr>
							    <td>VENTA AÑO ANTERIOR</td>
								<td>${formatNumberES(item.venta_anio_anterior,0,'$')}</td>
								<td>${item.var_ventas_anio_ant}</td>
							</tr>
							<tr>
							    <td>INCREMENTO VS AÑO ANTERIOR</td>
								<td>${ formatNumberES(item.incremento_anio_anterior,2,'%')}</td>
								<td></td>
							</tr>
							<tr>
							    <td>ACUMULADO AÑO: VALOR PRESUPUESTO DE VENTAS</td>
								<td>${formatNumberES(item.valor_presupuesto_venta_ac,0,'$')}</td>
								<td></td>
							</tr>
							<tr>
							    <td>ACUMULADO AÑO: VALOR VENTAS </td>
								<td>${formatNum(item.valor_venta_ac,'$')}</td>
								<td></td>
							</tr>
							<tr>
							    <td>ACUMULADO AÑO: CUMPLIMIENTO PRESUPUESTO VENTAS</td>
								<td>${formatNumberES (item.cumplimiento_presupuesto_ac,2,'%')}</td>
								<td></td>
							</tr>
							<tr>
							    <td>ACUMULADO AÑO: INCREMENTO VENTAS VS AÑO ANTERIOR</td>
								<td>${formatNumberES(item.incremento_ventas_anio_ant,2,'%')}</td>
								<td></td>
							</tr>
						  </tbody>
					   </table>
						</div>
						<div class=" shadow p-1 border border-1 border-primary col-md-3 position-relative" >
						<canvas id="general" style="max-height: 400px;"></canvas>
						<div class="rounded-circle alert bg-light  border border-4 border-danger position-absolute top-0 start-100 translate-middle p-2 " style="width:70px;heigth:70px;">
							<h4>${formatNumberES(item.cumplimiento,2,'%')}</h4></div>
						</div>
					</div>`; 
			    //ZONA DE VENTAS
				
			
			  if(oficinaSub=='1'){
				  	 $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
			   tabla=`
				<div class="card mb-3 p-1 shadow">
					<table class="table table-sm ">
						<thead>
							<tr>
								<th colspan="3" class="bg-dark text-white"><i class="fa-regular fa-map p-1"></i> ZONAS </th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>TOTAL CANTIDAD DE ZONAS</td>
								<td>${item.total_zona}</td>
								<td>${item.var_total_zonas}</td>
							</tr>
							<tr>
							    <td>PROMEDIO DE VENTA POR ZONA</td>
								<td>${formatNumberES(item.promedio_venta_zona,0,'$')}</td>
								<td>${item.var_prom_venta_zonas}</td>
							</tr>
							<tr>
							    <td>CANTIDAD DE TELEVENDEDORES</td>
								<td>${item.cantidad_televendedores}</td>
								<td>${item.var_total_televendores}</td>
							</tr>
						<tr>
								<td>PROMEDIO DE VENTA POR TELEVENDEDOR</td>
								<td>${formatNumberES(item.promedio_ventas_tel,0,'$')}</td>
								<td>${item.var_prom_ventas_tel}</td>
							</tr>
						</tbody>
					  </table>
					</div>`;
				
			  if(oficinaSub=='1'){
 				  $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
			  //DEVOLUCIONES 
			  tabla=`
				<div class=" mb-3 p-1 shadow rounded row">
					<div class="col-md-9">
					 <table class="table table-sm table-hover">
						<thead>
							<tr>
								<th colspan="3" class="bg-dark text-white"><i class="fa-solid fa-right-left P-1"></i> DEVOLUCIONES </th>
							</tr>
							<tr>
								<th class="alert-danger" colspan="3">MÁXIMO 1% - Objetivo 0,60%</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>VR DEVOLUCIONES</td>
								<td>${formatNumberES(item.devoluciones,0,'$')}</td>
								<td>${item.var_valor_devoluciones}</td>
							</tr>
							<tr>
								<td>PARTICIPACIÓN % DEVOLUCIONES/VENTAS</td>
								<td>${formatNumberES(item.participacion_devolucion,2,'%') }</td>
								<td>${formatNumberES(item.var_participacion_dev,2,'%')}</td>
							</tr>
						</tbody>
					 </table>
					</div>
						<div class=" shadow p-1 border border-1 border-primary col-md-3 position-relative" >
						    <div class="progress" role="progressbar" aria-label="Success example" aria-valuenow="${item.participacion_devolucion}" aria-valuemin="0" aria-valuemax="100" style="height:40px">
								
							  <div class="progress-bar bg-danger" style="width:${item.participacion_devolucion*100}%"><h3>${item.participacion_devolucion}%</h3></div>
							</div>
						</div>
					</div>
					`;
				
			   if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
			   //IMPACTOS 	
		tabla=`
				<div class=" mb-3 p-1 shadow row">
				   <div class="col-md-9">
					<table class="table table-sm">
						<thead>
							<tr>
								<th colspan="3" class="bg-dark text-white p-1" > <i class="fa-regular fa-handshake p-1"></i> IMPACTOS</th>
							</tr>
							<tr>
								<th class="alert-danger" colspan="3"> META: CLIENTES PROMEDIO MENSUAL: 86% </th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>CANTIDAD DE CLIENTES DEL PANEL</td>
								<td>${item.cantidad_clientes_panel}</td>
								<td>${item.var_cantidad_clientes_panel}</td>
							</tr>
							<tr>
								<td>CANTIDAD DE CLIENTES IMPACTADOS</td>
								<td>${item.cantidad_clientes_impactado}</td>
								<td>${item.var_cantidad_clientes_impactados}</td>
							</tr>
							<tr>
								<td>PORCENTAJE (%) DE CLIENTES IMPACTADOS</td>
								<td>${item.pcj_clientes_impactados}</td>
								<td>${item.var_pcj_clientes_impactados}</td>
							</tr>
						</tbody>
					  </table>
					  </div>
					  <div class="col-md-3">
						  <canvas id="gfx_impactos" style="max-height: 400px;"></canvas>
					  </div>
					</div>
					`;	
				if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
			   //CLIENTES FIDELIZADOS
			   tabla= `
				<div class="card mb-3 p-1 shadow">
					<table class="table table-sm ">
						<thead>
							<tr>
								<th colspan="3" class="bg-dark text-white p-1" >CLIENTES FIDELIZADOS (compras todos los meses)</th>
							</tr>
							<tr>
								<th colspan="3" class="alert-danger" >META: CRECIMIENTO DEL 15% (781 CLIENTES) --- Objetivo  815</th>
							<tr>
						</thead>
						<tbody>
							<tr>
								<td>VALOR VENTA A CLIENTES FIDELIZADOS</td>
								<td>${formatNumberES(item.venta_clientes_fidelizados,0,'$')}</td>
								<td></td>
							</tr>
							<tr>
								<td>CLIENTES FIDELIZADOS</td>
								<td>${item.cant_clientes_fidelizados}</td>
								<td></td>
							</tr>
							<tr>
								<td>PROMEDIO VENTA POR CLIENTE</td>
								<td>${formatNumberES(item.prom_venta_clientes_fidelizados,0,'$')}</td>
								<td></td>
							</tr>
							<tr>
								<td>PARTICIPACIÓN % FIDELIZADOS/VENTA TOTAL</td>
								<td>${formatNumberES(item.participacion_fidelizados,2,'%')}</td>
								<td></td>
							</tr>
							<tr>
								<td>CRECIMIENTO % VS OBJETIVO DE 815 CLIENTES</td>
								<td>${formatNumberES(item.crecimiento_clientes_fidelizados,2,'%')}</td>
								<td></td>
							</tr>
						</tbody>
					   </table>
				</div>
					  `;
				if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
			   //	CLIENTES NUEVOS 
			   tabla=`
					<div class="card mb-3 p-1 shadow">
						<table class="table table-sm">
						   <thead>
							<tr>
								<th   colspan="3" class="bg-dark text-white p-1"> <i class="fa-solid fa-users-between-lines m-1"></i> CLIENTES NUEVOS </th>
							</tr>
							<tr>
								<th  colspan="3" class="alert-danger p-1">META: CRECIMIENTO DEL 3% (OBJ 540 CLIENTES)</th>
							</tr>
						   </thead>
						   <tbody>
							  <tr>
								 <td>CANTIDAD DE CLIENTES NUEVOS</td>
								 <td>${item.cant_cli_nuevos}</td>
								 <td></td>
							  </tr>
							  <tr>
								 <td>VALOR VENTA CLIENTES NUEVOS</td>
								 <td>${formatNumberES(item.venta_cli_nuevos,0,'$')}</td>
								 <td></td>
							  </tr>
							  <tr>
								 <td>PROMEDIO VENTA POR CLIENTE</td>
								 <td>${formatNumberES(item.prom_venta_cli_nuevos,0,'$')}</td>
								 <td></td>
							  </tr>
							  <tr>
								 <td>PARTICIPACION % VENTA NUEVOS / VENTA TOTAL</td>
								 <td>${formatNumberES(item.part_venta_cli_nuevos,2,'%')}</td>
								 <td></td>
							  </tr>
						   </tbody>
					  </table>
					</div>
					`;
				
			  if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
				prog_total = item.total_cli_prog + item.total_cli_gestionados + item.total_cli_contactados;
				
				cobertura_c=Math.round(  ((item.total_cli_contactados/prog_total)*100)*100 )/100 ;
				cobertura_v=Math.round(  ((item.total_cli_gestionados/prog_total)*100)*100 )/100 ;
				cobertura_p=Math.round(  ((item.total_cli_prog /prog_total)*100)*100 )/100 ;
				cobertura_g=Math.round(  (((item.total_cli_gestionados+item.total_cli_contactados)/prog_total)*100)*100 )/100 ;
				
				
				tabla=`<table class="table table-sm">
						  <thead>
							<tr>
								<th colspan="3" class="bg-dark text-white p-1" ><i class="fa-solid fa-business-time p-1 "></i>CLIENTES VISITADOS POR EJECUTIVOS</th>
							</tr>
							<tr>
								<th colspan="3" class="alert-danger p-1">OBJETIVOS: COBERTURA %: 100%  PROGRAMAC %: 99% OCUPACIÓN RUTAS %: 95%</th>
							</tr>
						  </thead>
						  <tbody>
							<tr>
								<td>TOTAL PANEL DE CLIENTES</td>
								<td>${item.cantidad_clientes_panel}</td>
								<td></td>
							</tr>
							<tr>
								<td class="text-center" colspan="3">
									<table class="table table-bordered">
										<tr>
											<td colspan="4" class="alert alert-info">GESTION VISITAS</td>
										</tr>
										<tr>
											<td >P</td>
											<td >V</td>
											<td >C</td>	
											<td>TOTAL</td>
										</tr>
										<tr>
											<td>${item.total_cli_prog}</td>
											<td>${item.total_cli_gestionados}</td>
											<td>${item.total_cli_contactados}</td>
											<td>${prog_total}</td>
										</tr>
										<tr>
											<td></td>
											<td  class="table-success" colspan="2">${item.total_cli_gestionados+item.total_cli_contactados} -> ${formatNumberES(cobertura_g,2,'%')}</td>
										</tr>
										<tr>
											<td>${formatNumberES(cobertura_p,2,"%")}</td>
											<td>${formatNumberES(cobertura_v,2,"%")}</td>
											<td>${formatNumberES(cobertura_c,2,"%")}</td>
											<td></td>
										</tr>
									</table>
									
								</td>
							</tr>
							<tr>
								<td>COBERTURA % DE CLIENTES</td>
								<td>${formatNumberES(item.cobertura_cli_visitas,2,'%')}</td>
								<td></td>
							</tr>
						  </tbody>
					   </table>`
				
			   if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				//FRECUENCIA DE VISITAS
				
				tabla=`<table class="table-sm table">
						<thead>	
							<tr>
								<th  class="bg-dark text-white p-1" colspan="3"><i class="fa-solid fa-arrow-trend-up P-1"></i> FRECUENCIA DE VISITAS - Promedio por cliente: 3<br>
									Objetivo: # 10</th>
							</tr>						
						</thead>
						<tbody>
							<tr>
								<td>PROMEDIO FRECUENCIA DE VISITAS POR CLIENTE:</td>
								<td>${item.frec_visita_cli}</td>
								<td></td>
							</tr>
							<tr>
								<td>CANTIDAD DE VISITAS PROMEDIO POR EJECUTIVO</td>
								<td>${ item.prom_visita_ejecutivo}</td>
								<td></td>
							</tr>
							<tr>
								<td>TOTAL VISITAS PROGRAMADAS</td>
								<td>${item.total_visitas_prog}</td>
								<td></td>
							</tr>
							<tr>
								<td>% CUMPLIMIENTO DE PROGRAMACIÓN</td>
								<td>${ formatNumberES(item.pcj_cump_prog,2,'%')}</td>
								<td></td>
							</tr>
							<tr>
								<td>OCUPACIÓN (RUTAS PRODUCTIVAS) CIUDAD</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>OCUPACIÓN (RUTAS PRODUCTIVAS) POBLACION</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>VISITAS ACOMPAÑAMIENTO DE GERENCIA COMERCIAL</td> 
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>VISITAS ACOMPAÑAMIENTO DE COORDINADOR VENTAS</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>VISITAS ACOMPAÑAMIENTO COORDINADOR VENTAS 2</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>REPORTE VISITAS ADG TOTAL CARTAGENA</td>
								<td></td>
								<td></td>
							</tr>
						</tbody>
					   `
			   if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
				//PRESUPUESTO DE VENTAS
				
				pcj_clientes_pp 	      = formatNumberES(Math.round( ((item.cli_con_presupuesto/item.cantidad_clientes_panel)*100)*100)/100,2,'%');

				pcj_clientes_pp_venta	  = formatNumberES(Math.round( ((item.cli_pp_venta/item.cli_con_presupuesto)*100)*100 )/100,2,'%');
				
				pcj_clientes_pp_sin_venta =formatNumberES(Math.round( ((item.cli_pp_no_venta/item.cli_con_presupuesto)*100) *100 )/100,2,'%');

				part_cli_sin_ven_pp=formatNumberES(Math.round(((item.cli_pp_no_venta/item.valor_venta)*100)*100)/100,2,'%');
				//5363750540
				//995814854
				tabla=`<table class="table table-sm table-bordered" >
						 <thead>
							<tr>
								<th  colspan="3" class="bg-dark text-white p-1" ><i class="fa-solid fa-sack-dollar m-2"></i>PRESUPUESTOS DE VENTAS EN ADG - CANT CLIENTES</th>
							</tr>
							<tr>
								<th>TOTAL CLIENTES CON PPTO: 92%</th>
								<th>${ formatNumberES(pcj_clientes_pp,2,'%')}</th>
								<th></th>
							</tr>
							<tr>
								<th>CLIENTES CON PPTO Y VENTA:  84%</th>
								<th>${formatNumberES(pcj_clientes_pp_venta,2,'%')}</th>
								<th></th>
							</tr>
							<tr>
								<th>PARTICIPACION % CLIENTES SIN VENTA CON PPTO:  10%</th>
								<th>${formatNumberES(pcj_clientes_pp_sin_venta,2,'%')}</th>
								<th></th>
							</tr>
						 </thead>
						<tbody>
							<tr>
								<td>TOTAL PANEL</td>
								<td>${item.cantidad_clientes_panel}</td>
								<td></td>
							</tr>
							<tr>
								<td>TOTAL CLIENTES CON PPTO</td>
								<td>${item.cli_con_presupuesto}</td>
								<td></td>
							</tr>
							<tr>
								<td>CLIENTES CON PPTO Y VENTA</td>
								<td>${item.cli_pp_venta}</td>
								<td></td>
							</tr>
							<tr>
								<td>CLIENTES CON PPTO Y NO VENTA</td>
								<td>${item.cli_pp_no_venta}</td>
								<td></td>
							</tr>
							<tr>
								<td>TOTAL CLIENTES SIN PPTO</td>
								<td>${item.cli_sin_pp}</td>
								<td></td>
							</tr>
							<tr>
								<td>CLIENTES SIN PPTO Y CON VENTA</td>
								<td>${item.cli_sin_pp_venta}</td>
								<td></td>
							</tr>
							<tr>
								<td>CLIENTES SIN PPTO Y SIN VENTA</td>
								<td>${item.cli_sin_pp_sin_venta}</td>
								<td></td>
							</tr>
							<tr>
								<td>PARTICIPACION % CLIENTES SIN VENTA CON PPTO</td>
								<td>${ formatNumberES( pcj_clientes_pp_sin_venta ,2,'%')}</td>
								<td></td>
							</tr>
						</tbody>
					   </table>
						`;
			   if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
			  //CLIENTES PARETO 
				tabla=`<table class="table table-sm table-striped">
						 <tr>
 							<thead>
								<th colspan="3" class="bg-dark text-white p-1"><i class="fa-regular fa-id-badge m-2"></i> CLIENTES PARETO (hacen el 50% de la venta)</th>
							</thead>
							<tbody>
								<tr>
									<td>VALOR VENTA TOTAL A CLIENTES PARETO</td>
									<td>${formatNumberES(item.valor_cli_paretos,0,'$')}</td>
									<td></td>
								</tr>
								<tr>
									<td>CANTIDAD DE CLIENTES PARETO</td>
									<td>${item.cant_cli_paretos}</td>
									<td></td>
								</tr>
								<tr>
									<td>VALOR PROMEDIO VENTA MENSUAL POR CLIENTE PARETO</td>
									<td>${formatNumberES(item.prom_venta_cli_pareto,0,'$')}</td>
									<td></td>
								</tr>
								<tr>
									<td>CANTIDAD CLIENTES PARETO QUE DECRECEN VS MES ANTERIOR</td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						 </tr>
					   </table>
						<hr>
						`
			  
			  if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
			   //ACUERDOS COMERCIALES	
			   tabla=`<br><table class="table table-sm table-bordered">
						<thead>
							<tr>
								<th colspan="3" class="bg-dark text-white p-1"><i class="fa-solid fa-file-contract m-2"></i>ACUERDOS COMERCIALES</th>
							</tr>
							<tr>
								<th colspan="3" class="alert-danger text-dark" >OBJETIVOS: CANT CLIENTES CON ACUERDOS #: 188        PARTICIPACIÓN % VR ACUERDOS / VR VENTAS:  29,04%</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>VALOR TOTAL ACUMULADOS ACUERDOS DEFINIDOS</td>
								<td id="vlr_acuerdos">${formatNumberES(item.vlr_acuerdos,0,'$')}</td>
								<td></td>
							</tr>
							<tr>
								<td>CANTIDAD DE CLIENTES CON ACUERDOS</td>
								<td>${item.cant_acuerdos}</td>
								<td></td>
							</tr>
							<tr>
								<td>PROMEDIO MES VALOR ACUERDOS</td>
								<td>${ formatNumberES(item.promedio_acuerdos ,0,'$')}</td>
								<td></td>
							</tr>
							<tr>
								<td>PARTICIPACIÓN % ACUERDOS PROM MES / VENTAS</td>
								<td>${formatNumberES(item.part_acuerdos ,0,'$')}</td>
								<td></td>
							</tr>
						</tbody>
					  </table>` 
			  	
				
			   	if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
			   
			   //PROVEEDORES	
			   tabla=`<table class="table table-sm table-bordered">
						<thead>
							<tr>
								<th colspan="3" class="bg-dark text-white p-1"><i class="fa-solid fa-truck-field-un m-2"></i>PROVEEDORES</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>CANTIDAD DIVISIONES QUE HACEN EL 50% DE LA VENTA</td>
								<td>${item.cant_part_grp}</td>
								<td></td>
							</tr>
							<tr>
								<td>VALOR DIVISIONES QUE HACEN EL 50% DE LA VENTA</td>
								<td>${formatNumberES(item.vlr_part_grp_art,0,'$')}</td>
								<td></td>
							</tr>
						</tbody>
					  </table>`	
							
			   	if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }	
				
				//REFERENCIAS
				tabla=`<table class="table table-sm table-bordered">
						<thead>
						   <tr>
							 <th colspan="3" class="bg-dark text-white p-1"><i class="fa-solid fa-box-open m-2"></i>REFERENCIAS</th>
						   </tr>
						   <tr>
							 <th colspan="3" class="alert-danger text-dark" >OBJETIVO: CANT REFERENCIAS FACTURADAS: 6784
            					  VR PROM FACT POR PRODUCTO: $ 6784
							 </th>
						   </tr>
						</thead>
						<tbody>
							<tr>
							   <td>CANTIDAD DE REFERENCIAS FACTURADAS</td>
							   <td>${item.cant_ref_facturas}</td>
							   <td></td>
							</tr>
							<tr>
							   <td>CANTIDAD DE PRODUCTOS (unidades) FACTURADOS</td>
							   <td>${ item.cant_und_facturas}</td>
							   <td></td>
							</tr>
							<tr>
								<td>VALOR PROMEDIO FACTURADO POR PRODUCTO</td>
								<td>${item.prom_ref_fact}</td>
								<td></td>
							</tr>
							<tr>
								<td>CANTIDAD DE REFERENCIAS QUE HACEN EL 50% DE LA VENTA</td>
								<td>${item.cant_ref_hacen_50}</td>
								<td></td>
							</tr>
						</tbody>
					   </table>`;
				
			   	if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
			   tabla=` <table class="table table-sm table-bordered">
						<thead>
							<tr>
								<th colspan="3" class="bg-dark text-white p-1"><i class="fa-solid fa-copyright m-2"></i>CATEGORIAS TIPO DE PRODUCTOS POR PROVEEDOR </th>
							</tr>
							<tr>
								<td>FARMA</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>FARMA PARTICIPACION %</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>GENERICOS</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>GENERICOS PARTICIPACION %</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>OTC</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>OTC PARTICIPACION %</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>POPULARES</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>POPULARES PARTICIPACION %</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>NUTRICIONAL</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>NUTRICIONALES PARTICIPACION %</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>NATURALES</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>NATURALES PARTICIPACION %</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>COSMETICOS</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>COSMETICOS PARTICIPACION %</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>TINTES</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>TINTES PARTICIPACION %</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>HOSPITALARIO</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>HOSPITALARIO PARTICIPACION %</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>INSTITUCIONAL</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>INSTITUCIONAL PARTICIPACION %</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>SIN CLASIFICAR</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>SIN CLASIFICAR PARTICIPACIÓN</td>
								<td></td>
								<td></td>
							</tr>

						</thead>
					   </table>`
			   
		       if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
			  //CIFRAS TELEVENTAS
			  tabla=`<table class="table table-sm table-bordered">
						<thead>
							<tr>
							   <th colspan="3" class="bg-dark text-white m-2"><i class="fa-solid fa-headset p-1"></i> CIFRAS TELEVENTAS</th>
							</tr>
							<tr>
								<th colspan="3" class="alert-danger text-dark" >OBJETIVOS:<br> 
									PARTIC % DE LA VENTA: 60 %     CUMPLIM PROG %: 100%     COBERTURA %: 90% <br>   PROM TIEMPO AIRE %: 60%<br>       
									CANT PEDIDOS X TELEV: 13  #
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
							   <td>Valor venta total televendedores</td>
							   <td>${formatNum( item.valor_venta_tel ,'$') }</td>
							   <td></td>
							</tr>
							<tr>
							   <td>Cantidad de televendedores</td>
							   <td>${item.cant_televendedores}</td>
							   <td></td>
							</tr>
							<tr>
							   <td>Participación % de la venta total</td>
							   <td>${ formatNumberES(item.part_venta_tel,2,'%')}</td>
							   <td></td>
							</tr>
							<tr>
							   <td>Venta por televendedor</td>
							   <td>${ formatNum(item.venta_por_tele ,'$')  }</td>
							   <td></td>
							</tr>
							<tr>
							   <td>Cumplimiento de la programación (C y V)</td>
							   <td>${formatNumberES(item.cump_prog_tel,2,"%")}</td>
							   <td></td>
							</tr>
							<tr>
							   <td>Cumplimiento de la programación (C )</td>
							   <td>${formatNumberES(item.cump_prog_tel_c,2,"%")}</td>
							   <td></td>
							</tr>
							<tr>
							   <td>Cobertura del panel de clientes</td>
							   <td>${ formatNumberES(item.cobertura_panel_tel ,2,"%") }</td>
							   <td></td>
							</tr>
							<tr>
							   <td>Promedio % de Tiempo al aire</td>
							   <td>${ formatNumberES(item.prom_tiempo_aire_tel,2,"%") }</td>
							   <td></td>
							</tr>
							<tr>
							   <td>Promedio Cantidad de pedidos por televendedor</td>
							   <td>${ item.prom_pedidos_tel }</td>
							   <td></td>
							</tr>
						</tbody>
					 </table>`;
				
		       if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
				tabla=`<table class="table table-sm table-bordered">
						<thead>
							<tr>
							   <th colspan="3" class="bg-dark text-white m-2"> <i class="fa-solid fa-tty m-2"></i>CIFRAS TRANSFERENCISTA</th>
							</tr>
							<tr>
								<th colspan="3" class="alert-danger text-dark" >OBJETIVOS: <BR>
										PARTIC % DE LA VENTA TOTAL: 8 % <BR>   
										CUMPLIM PROGRAMAC %:  100%     PROM TIEMPO AIRE %:   60%
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Valor venta total teletransfrencistas</td>
								<td>${formatNumberES(item.venta_transfer,2,'$')}</td>
								<td></td>
							</tr>
							<tr>
								<td>Cantidad de teletransferencistas internos</td>
								<td>${item.cant_transfer}</td>
								<td></td>
							</tr>
                           	<tr>
								<td>Participación % de la venta total</td>
								<td>${formatNumberES(item.part_venta_tra,2,"%")}</td>
								<td></td>
							</tr>
							<tr>
								<td>Venta por teletransferencista</td>
								<td>${formatNumberES(item.venta_por_tra,2,'$')}</td>
								<td></td>
							</tr>
							<tr>
								<td>Cumplimiento de la programación</td>
								<td>${formatNumberES(item.cump_prog_tra,2,"%")}</td>
								<td></td>
							</tr>
							<tr>
								<td> Promedio % de Tiempo al aire</td>
								<td>${formatNumberES(item.prom_tiempo_aire_tra,2,"%")}</td>
								<td></td>
							</tr>
						</tbody>
					   </table>
					`;
			  if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
			  /*CIFRAS PW*/
			  tabla=`<table class="table table-sm table-bordered">
						<thead>
							<tr>
								<th colspan="3" class="bg-dark text-white m-2"><i class="fa-solid fa-globe m-2"></i> CIFRAS CANAL WEB</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><b>PRESUPUESTO TOTAL CW</b></td>
								<td>${formatNumberES(item.presupuesto_total_cw,2,'$')}</td>
								<td></td>
							</tr>
							<tr>
								<td><b>TOTAL VENTA CW</b></td>
								<td>${formatNumberES(item.total_venta_cw,2,'$')}</td>
								<td></td>
							</tr>
							<tr>
								<td><b>CUMPLIMIENTO PPTO %</b></td>
								<td>${formatNumberES(item.cumplimiento_cw,2,"%")}</td>
								<td></td>
							</tr>
							<tr>
								<td><b>INCREMENTO VS AÑO ANTERIOR CW</b></td>
								<td>0</td>
								<td></td>
							</tr>
							<tr>
								<td colspan="3"><hr></td>
							</tr>
							<tr>
								<td>VALOR PRESUPUESTO CW CLIENTES</td>
								<td>${formatNumberES(item.presupuesto_cw_cli,2,'$')}</td>
								<td></td>
							</tr>
							<tr>
								<td>VALOR VENTA CLIENTES</td>
								<td>${formatNumberES(item.total_venta_cw_cli,2,'$')}</td>	
								<td></td>
							</tr>
							<tr>
								<td>CUMPLIMIENTO PPTO %</td>
								<td>${formatNumberES(item.cump_ppt_cw_cli,2,"%")}</td>	
								<td></td>
							</tr>
							<tr>
								<td>INCREMENTO VS AÑO ANTERIOR</td>
								<td>${ formatNumberES(item.incremento_cw_cli,2,"%") }</td>
								<td></td>
							</tr>
							<tr>
								<td colspan="3"><hr></td>
							</tr>
							<tr>
								<td>VALOR PRESUPUESTO CW TRANSFERENCISTAS</td>
								<td>${formatNumberES(item.presupuesto_cw_tra,2,'$')}</td>
								<td></td>
							</tr>
							<tr>
								<td>VALOR VENTA TRANSFERENCISTAS</td>
								<td>${formatNumberES(item.total_venta_cw_tra,0,'$')}</td>	
								<td></td>
							</tr>
							<tr>
								<td>CUMPLIMIENTO PPTO %</td>
								<td>${formatNumberES(item.cump_ppt_cw_tra,2,"%")}</td>	
								<td></td>
							</tr>
							<tr>
								<td>INCREMENTO VS AÑO ANTERIOR</td>
								<td>${ formatNumberES(item.incremento_cw_tra,2,"%" )}</td>
								<td></td>
							</tr>
							<tr>
								<td><hr></td>
							</tr>
							<tr>
								<td>VALOR PRESUPUESTO EJECUTIVOS</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>VALOR VENTA EJECUTIVOS</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>CUMPLIMIENTO PPTO %</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>INCREMENTO VS AÑO ANTERIOR</td>
								<td></td>
								<td></td>
							</tr>
						</tbody>
					 </table>`
			  
			   if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
				tabla=`<table class="table">
						  <thead>
							<tr>
								<td colspan="3" class="bg-dark text-white m-2"><b>CLIENTES CW</b></td>
							</tr>
							<tr>
								<td colspan="3" class="alert-danger text-dark m-1"><b>META 30% CRECIMIENTO - Y 43 % DE PARTICIPACIÓN</b></td>
							</tr>
						  </thead>
							<tr>
								<td>Valor venta clientes PW</td>
								<td>${formatNum(item.total_venta_cw_cli,'$')}</td>	
								<td></td>
							</tr>
							<tr>
								<td>Cantidad de clientes con compras en PW</td>
								<td>${item.cant_cli_venta_pw}</td>
								<td></td>
							</tr>
							<tr>
								<td>Participación % venta clientes PW de la venta total</td>
								<td>${formatNumberES(item.part_cwc_venta_total,2,"%")}</td>
								<td></td>
							</tr>
							<tr>
								<td>Promedio de venta por cliente PW</td>
								<td>${formatNum(item.prom_ven_cli_cw,'$')}</td>
								<td></td>
							</tr>
							<tr>
								<td>Participación % venta clientes PW de la venta PW total</td>
								<td>${formatNumberES(item.part_cwc_venta_cw,2,"%")}</td>
								<td></td>
							</tr>
						</table>`
				
			 if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
				
			   tabla=`<table class="table">
						  <thead>
							<tr>
								<td colspan="3" class="bg-dark text-white m-2"><b>TRANSFERENCISTAS CW</b></td>
							</tr>
							<tr>
								<td colspan="3" class="alert-danger text-dark m-1"><b>META 30% META 5% CRECIMIENTO - Y 24 % DE PARTICIPACIÓN</b></td>
							</tr>
						  </thead>
							<tr>
								<td>Valor venta clientes PW</td>
								<td>${formatNum(item.total_venta_cw_tra,'$')}</td>	
								<td></td>
							</tr>
							<tr>
								<td>Cantidad de clientes con compras en PW</td>
								<td>${item.cant_tra_venta_pw}</td>
								<td></td>
							</tr>
							<tr>
								<td>Participación % venta clientes PW de la venta total</td>
								<td>${formatNumberES(item.part_cwt_venta_total,2,"%")}</td>
								<td></td>
							</tr>
							<tr>
								<td>Promedio de venta por cliente PW</td>
								<td>${formatNum(item.prom_ven_tra_cw,'$')}</td>
								<td></td>
							</tr>
							<tr>
								<td>Participación % venta clientes PW de la venta PW total</td>
								<td>${formatNumberES(item.part_cwt_venta_cw,2,"%")}</td>
								<td></td>
							</tr>
						</table>`
				
			 if(oficinaSub=='1'){
				   $("#result_1000").append(tabla);
			   }else{
				   $("#result_2000").append(tabla);
			   }
				
			  //rangos de ventas
			  tabla=`<table class="table table-sm">
						<thead>
						   <th colspan="2"  class="bg-dark text-white m-2" >RANGOS DE VENTAS A CLIENTES - Cantidad de clientes por rango</th>
						</thead>
						<tbody>
						  <tr>
							<td>Más de $100 millones</td>
							<td>${item.venta_100}</td>
						  </tr>
						  <tr>
							<td>Entre $50 a $99,9 millones</td>
							<td>${item.venta_50_99_9}</td>
						  </tr>
						  <tr>
							<td>Entre $30 a $49,9 millones</td>
							<td>${item.venta_30_49_9}</td>
						  </tr>
						  <tr>
							<td>Entre $20 a $29,9 millones</td>
							<td>${item.venta_20_29_9}</td>
						  </tr>
						  <tr>
							<td>Entre $15 a $19,9 millones</td>
							<td>${item.venta_15_19_9}</td>
						  </tr>
						  <tr>
							<td>Entre $10 a $14,9 millones</td>
							<td>${item.venta_10_14_9}</td>
						  </tr>
						  <tr>
							<td>Entre $5 a $9,9 millones</td>
							<td>${item.venta_5_9_9}</td>
						  </tr>
						  <tr>
							<td>Entre $2 a $4,9 millones</td>
							<td>${item.venta_2_4_9}</td>
						  </tr>
						  <tr>
							<td>Entre $1 a $1,9 millones</td>
							<td>${item.venta_1_1_9}</td>
						  </tr>
						  <tr>
							<td>Entre $0,5 a $0,99 millones</td>
							<td>${item.venta_05_0_99}</td>
						  </tr>
						  <tr>
							<td>Menos de $0,5 millones</td>
							<td>${item.venta_m_05}</td>
						  </tr>
						  <tr>
							<td>Con cero compra</td>
							<td>${item.venta_0}</td>
						  </tr>
						  <tr>
							<td>Menores que 0$</td>
							<td>${item.venta_m_0}</td>
						  </tr>

						</tbody>
					</table>`

			 if(oficinaSub=='1'){
				   $("#result_1000").append(tabla).show();
			   }else{
				   $("#result_2000").append(tabla).show();
			   }
				
					new Chart(document.querySelector('#general'), {
								type: 'pie',
								data: {
								  labels: [
									'Presupuesto',
									'Cumplimiento'
								  ],
								  datasets: [{
									label: 'Cumplimiento de presupuesto',
									data: [
									((item.valor_venta/item.valor_presupuesto)*100).toFixed(2),
									(((item.valor_presupuesto- item.valor_venta)/item.valor_presupuesto)*100).toFixed(2)
									],
									backgroundColor: [
									  'rgb(255, 99, 132)',
									  'rgb(255, 205, 86)'
									],
									hoverOffset: 4
								  }]
								}
							  });
					new Chart(document.querySelector('#gfx_impactos'), {
								type: 'pie',
								data: {
								  labels: [
									'Impactados',
									'Panel de clientes'
									
								  ],
								  datasets: [{
									label: 'Impactos',
									data: [
								    
									  item.cantidad_clientes_impactado,
									  item.cantidad_clientes_panel
									],
									backgroundColor: [
									  'rgb(255, 99, 132)',
									  'rgb(255, 205, 86)'
									],
									hoverOffset: 4
								  }]
								}
							  });
				
			});
		})
		.catch(e=>{
			dissminSwal();
			console.error(e);
			 $("#consultar").attr("disabled",false);
			if(e.message!=undefined){
			   $("#result_1000,#result_2000").html(`<div class="alert alert-danger"><i class="fa-solid fa-message-exclamation m-1"></i>${e.message}</div>`);
			 }else{
				 $("#result_1000,#result_2000").html(`<div class="alert alert-danger"><i class="fa-solid fa-message-exclamation m-1"></i>${e.responseText}</div>`);
			 }
			
		})
	});
	

	
	
	
	
});