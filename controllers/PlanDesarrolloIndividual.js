var datosObs={};
var activo=0;
var arrayPendientes =[];
var coloresEvaluados =['success','info','warning','danger','primary','secondary']


function enviarPeticionesHttpPost(data,url){
	
	return new Promise((resolve,reject)=>{
		
		$.ajax({
				url			: url,
				type		: "POST",
				dataType 	: "json",
				 data		: (data),
				async    	: true,
				success		: function(data){resolve(data);}
			}).fail(function(data){reject(data);});		
	 });
}

//
function enviarPeticionesHttpGet(url){
	
	return new Promise((resolve,reject)=>{
		
		$.ajax({
				url			: url,
				type		: "GET",
				dataType 	: "json",
				async    	: true,
				success		: function(data){resolve(data);}
			}).fail(function(data){reject(data);});		
	 });
	
}

async function personasEvaluadasPropias(data){ console.log(data)
	return await  enviarPeticionesHttpPost(data,'../models/planDesarrollo.php');
}

async function guardarPlanDesarrollo(data){
	return await enviarPeticionesHttpPost(data,url_api+'plandesarrollo/create/');
}

async function editarPlanDesarrollo(data){
	return await enviarPeticionesHttpPost(data,url_api+'plandesarrollo/update/');
}
//
async function seguimientoPlanDesarrollo(id,fecha_ini,fecha_fin){
	return await enviarPeticionesHttpGet(url_api+'plandesarrollo/seguimientos/'+id+"/"+fecha_ini+"/"+fecha_fin);
}
//
async function getPlanPorId(id){
	return await enviarPeticionesHttpGet(url_api+'plandesarrollo/getPlanPorId/'+id) ;
}

async function addObservaciones(data){
 return await  	enviarPeticionesHttpPost( data , url_api+'plandesarrollo/addObservaciones');	
}

 const cargarRoles =async()=>{
	
	 try{
		 
		const data={
			link	:url_api+'rolesestrategicos/search/1',
			metodo	:'GET'
		}
		const resp= await enviarPeticion(data);
		 p='<option value="0">Todos</option>'
		 console.log(resp)
		 resp.forEach(item=>{
		
			p+=`<option value="${item.ID}">${item.ROL}</option>`  
			
		 })

		 $("#seg_roles").html(p);

	 }catch(e){
		 console.error(e)
	 }

}
 
  const cargarCargos =async()=>{
	
	 try{
		 
		const data={
			link	:url_api+'cargos/search',
			metodo	:'GET'
		}
		const resp= await enviarPeticion(data);
		 p='<option value="0">Todos</option>'
		
		 resp.forEach(item=>{
		
			p+=`<option value="${item.id}">${item.cargo}</option>`  
			
		 })

		 $("#seg_cargos").html(p);

	 }catch(e){
		 console.error(e)
	 }

}
 
const limpiarCamposAddPlan =()=>{
	
 $("#acciones_add_plan").val("");
 $("#tiempo_entrega_add_plan").val("");
 $("#recursos_add_plan").val("");
 $("#id_usuario_add_plan").val(0);
 $("#id_evaluacion_add_plan").val(0) ;
 $("#id_comportamiento_add_plan").val(0) ;
 $("#id_competencia_add_plan").val(0);
 $("#des_comportamiento_add_plan").text("");
 $("#des_competencia_add_plan").text("");
 $("#id_plan").val(0);
 $("#resultados_plan").val("").attr("disabled",false);
 $("#evidencias_plan").val("");
 $(".tr_upload_file").show();
 $(".tr_download_file").hide();
 $("#descargar_evidencias").prop("href","#");
 $("#id_det_enc").val("");
 $("#email_evaluado").val("");
 $("#observacion_accion_plan").val("")
 $("#observacion_fecha_plan").val("") 
 $("#observacion_recurso_plan").val("")
 $("#input_observacion_fecha_plan").hide();
 $("#estado_final").attr("disabled",true);
 $("#id_evaluado_add_plan").val("") ;
	
 $("#obs_general_gh").val("");
 $("#obs_general_jefe").val("");
	
 if($("#Rol").val()==8){
	$("#obs_general_gh").attr("disabled",false);
 }	

}


function insertarPlan(ob){
	
  fila=	$(ob).parent().parent();
  let acciones			=capitalizarPrimeraLetra($.trim($("#acciones_add_plan").val() ));
  let tiempo			=$.trim($("#tiempo_entrega_add_plan").val());
  let recursos			=capitalizarPrimeraLetra($.trim($("#recursos_add_plan").val() ));
  //let id_usuario    	=$.trim($("#id_usuario_add_plan").val() );
  const id_usuario		=$("#UsrId").val();
  let id_evaluacion    	=$.trim($("#id_evaluacion_add_plan").val() );
  let id_comportamiento	=$.trim($("#id_comportamiento_add_plan").val() );
  let id_competencia   	=$.trim( $("#id_competencia_add_plan").val());
  let des_comportamiento	=$.trim( $("#des_comportamiento_add_plan").text());
  let des_competencia		=$.trim( $("#des_competencia_add_plan").text());
  const id_evaluado  =$.trim( $("#id_evaluado_add_plan").val()  );
  let estado='G';
  
	
  let valido= acciones !='' &&  tiempo!='' && recursos!='';  
  const  id =$("#id_plan").val();
	
  if($("#id_plan").val()>0){
	  
	  resultados =$("#resultados_plan").val();
	  evidencia  =$("#evidencias_plan").val();
	  estado     =$("#estado_final").val();
	  
	  let datos={
					  id,
					  id_usuario,
		  			  id_evaluado,
					  id_evaluacion,
					  id_comportamiento,
					  id_competencia,
					  acciones,
					  tiempo,
					  recursos,
					  resultados,
					  estado,
					  des_comportamiento,
					  des_competencia
				 }		  
	  
	  //valido si hay comentarios de observacion del jefe directo
	 
	  if($("#observacion_accion_plan").is(":visible") ||
		 $("#observacion_fecha_plan").is(":visible") || 
		 $("#observacion_recurso_plan").is(":visible")
		){
		  
		    if($("#observacion_accion_plan").is(":visible")){
			   if($("#observacion_accion_plan").val()==''){
				   Swal.fire("Validación","Debe digitar las observacion para la acción tomada por el evaluado","warning");
				  return ;  
			   }
			}
		    if($("#observacion_fecha_plan").is(":visible")){
			   if($("#observacion_fecha_plan").val()==''){
				   Swal.fire("Validación","Debe digitar la fecha sugerida ","warning");
				  return ;  
			   }
			}
		    if($("#observacion_recurso_plan").is(":visible")){
			   if($("#observacion_recurso_plan").val()==''){
				   Swal.fire("Validación","Debe digitar la observación de recurso sugerido por el evaluado ","warning");
				  return ;  
			   }
			}
			const tipo			='';
			const id_plan 		=$("#id_plan").val();
			const id_det_enc	=$("#id_det_enc").val();
			const email 		=$.trim($("#email_evaluado").val());
  
			  datosObs={
				  id_plan,
				  id_evaluado,
				  id_usuario,
				  id_det_enc,
				  email,
				  obs_accion  : $.trim($("#observacion_accion_plan").val()),
				  obs_fecha   : $.trim($("#observacion_fecha_plan").val()),
				  obs_recurso : $.trim($("#observacion_recurso_plan").val())
			  }
			  $("input,select,a,textarea").attr("disabled",true)
			  addObservaciones(datosObs)
			  .then(resp=>{ 
				    $("input,select,a,textarea").attr("disabled",false)
				    limpiarFormModalObs();
				    Swal.fire("Ok","Se actualziaron correctamente los datos","success");
					$("#modalAddComment").modal("hide");
				    listarObservacionesPlan(id_plan,'accion')
				    listarObservacionesPlan(id_plan,'fecha')
				    listarObservacionesPlan(id_plan,'recurso')
			  })
			  .catch(e=>{
				  console.error(e)
				  $(".formularioObs").show();
			  	  $(".update_obs").hide();
				  $("input,select,a,textarea").attr("disabled",false)
			  })		  
		  
		 }
	  
	  
	  editarPlanDesarrollo(datos)
	  .then(resp=>{
		
			Swal.fire("Ok","Se actualizo correctamente los datos!","success");
		  
		    if($("#evidencias_plan").val()!=''){
			   uploadSoporte();
			}
		    $("#modalIniciarPlan").modal("hide");
		    limpiarCamposAddPlan();
	   })
	   .catch(err=>{
				console.error(err);
				Swal.fire("Ok","Error al guardar los datos","error");
	  });
	  
	 //lista 
	  $(".nav-tabs li button.active").trigger("click");
	 return ;
  }	
	
	
  if(valido){
	  	
		let data={acciones,
				  tiempo,
				  recursos,
				  id_usuario,
				  id_evaluacion,
				  id_evaluado,
				  id_comportamiento,
				  id_competencia,
				  estado,
				  des_comportamiento,
				  des_competencia};
	  	
	  	$("textarea,button,input").attr("disabled",true);
		 guardarPlanDesarrollo(data)
		 .then(resp=>{
			 
			 $("textarea,button,input").attr("disabled",false);
			 
			 if(resp.id>0){
				  
					Swal.fire({
					  position: 'top-end',
					  icon: 'success',
					  title: 'Se guardo correctamente el registro!',
					  showConfirmButton: false,
					  timer: 1500
					});
				 	
				  fila.remove().fadeOut();
				  limpiarCamposAddPlan();
				  $("#modalIniciarPlan").modal("hide");
				  $(".nav-tabs li button.active").trigger("click");
			 }
		 })
		  .catch(e=>{
			 console.error(e);
			  Swal.fire("Error",e.responseText,"error");
			 	$("textarea,button,input").attr("disabled",false);
		 });
	  }else if(acciones==''){
		  Swal.fire("Error","Debe digitar las acciones a tomar","error");
		  	$("textarea,button,input").attr("disabled",false);
		  return;
		  
	  }
	else if(tiempo==''){
				  Swal.fire("Error","Debe digitar la fecha en la que realizara las acciones","error");
				 	$("textarea,button,input").attr("disabled",false);
					return;
			}
	else if(recursos==''){
			  Swal.fire("Error","Debe describir los recursos que necesitara","error");
					$("textarea,button,input").attr("disabled",false);
				return;
			}
	
}

function uploadSoporte(){
	
	id=$("#id_plan").val();
	
	if(id>0){
		
		archivo = document.getElementById("evidencias_plan");
		let file      = archivo.files[0];
		let data      = new FormData();
		data.append('archivo',file);
		data.append('op','UploadSuport');
		data.append('id',id);
		
	 $.ajax({
			url        : "../models/planDesarrollo.php",
			type       : 'POST',
			contentType: false,
			data       : data,
			processData: false,  
			cache      : false,
			async	   :true,
			beforeSend : function(){
				$("input,button,a").attr("selected", true);
			},
			dataType : "json",
		    success    : function(data){console.log(data)
				if(data.ok){
				  $(".tr_download_file").show();
				  $("#descargar_evidencias").attr("href","../resources/SuportPlanDesarrollo/"+data.nombre_archivo);
				}
		    }
	 }).fail(function(error){
		 console.error(error);
	 })
   }	
}


function editarPlan(ob,id){
	

	fila=	$(ob).parent().parent();
	 let acciones			=capitalizarPrimeraLetra($.trim( fila.find("td").eq(3).html() ));
	 let tiempo				=$.trim( fila.find("td").eq(4).html() );
	 let recursos			=capitalizarPrimeraLetra($.trim( fila.find("td").eq(5).html() ));
	 let id_usuario    		=$.trim( fila.find("td").eq(9).html() );
	 let id_evaluacion    	=$.trim( fila.find("td").eq(11).html() );
     let id_comportamiento	=$.trim( fila.find("td").eq(8).html() );
     let id_competencia   	=$.trim( fila.find("td").eq(10).html() );
     let des_comportamiento	=$.trim( fila.find("td").eq(2).html() );
     let des_competencia	=$.trim( fila.find("td").eq(1).html() );
	 let estado				='G';
     let Ahref				=$.trim(fila.find("td").eq(13).find("div.i_src").find("a").attr("href"));
	 
	 let resultados			=capitalizarPrimeraLetra( $.trim( fila.find("td").eq(6).find("textarea").val() ));
	 
	if(resultados!='' && Ahref!=''){
	   estado	='R';
	 }

	let data={
			  id,
			  id_usuario,
			  id_evaluacion,
			  id_comportamiento,
			  id_competencia,
			  acciones,
			  tiempo,
			  recursos,
			  resultados,
			  estado,
			  des_comportamiento,
			  des_competencia
			  
			 }
	
	editarPlanDesarrollo(data)
	.then(resp=>{
		console.log(resp);
		if(estado=='R'){
		   Swal.fire("Ok","Se actualizo correctamente los datos!","success");
		 }
		
	})
	.catch(err=>{
		console.error(err);
		Swal.fire("Ok","Error al guardar los datos","error");
	});
	 
	
}

function addNotaJefeDirecto(ob,id){
	

	fila=	$(ob).parent().parent();
	 let acciones			=$.trim( fila.find("td").eq(3).html() );
	 let tiempo				=$.trim( fila.find("td").eq(4).html() );
	 let recursos			=$.trim( fila.find("td").eq(5).html() );
	 let id_usuario    		=$.trim( fila.find("td").eq(9).html() );
	 let id_evaluacion    	=$.trim( fila.find("td").eq(11).html() );
     let id_comportamiento	=$.trim( fila.find("td").eq(8).html() );
     let id_competencia   	=$.trim( fila.find("td").eq(10).html() );
     let des_comportamiento	=$.trim( fila.find("td").eq(2).html() );
     let des_competencia	=$.trim( fila.find("td").eq(1).html() );
	 let resultados			=$.trim( fila.find("td").eq(6).find("textarea").val() );
	 let estado='T';
	 let fecha_seg_jefe_inmediato  = $.trim( fila.find("td").eq(14).html() );
	 let obs_jefe_inmediato    	   = $.trim( fila.find("td").eq(15).find("textarea").val() );
	 let fecha_seg_g_humana   	   = $.trim( fila.find("td").eq(16).html() );
	 let obs_g_humana    	       = $.trim( fila.find("td").eq(17).find("textarea").val() );
	
	 let rol=$("#Rol").val();
	
	 if(rol==8 ){
		sw=obs_g_humana!='';
     }else{
		 sw = obs_jefe_inmediato!='';
	 }
	
	
	if(sw){
	
	   let data={
				  id,
				  id_usuario,
				  id_evaluacion,
				  id_comportamiento,
				  id_competencia,
				  acciones,
				  tiempo,
				  recursos,
				  resultados,
				  estado,
				  des_comportamiento,
				  des_competencia,
				  fecha_seg_jefe_inmediato,
				  obs_jefe_inmediato,
				  fecha_seg_g_humana,
				  obs_g_humana
		 };
		editarPlanDesarrollo(data)
		.then(resp=>{

			  Swal.fire({
						  position: 'top-end',
						  icon: 'success',
						  title: 'Se guardo correctamente el registro!',
						  showConfirmButton: false,
						  timer: 1100
				});

		})
		.catch(err=>{
			console.error(err);
			Swal.fire("Ok","Error al guardar los datos","error");
		});
	 } 	
	
}




function modalObservaciones(id){
	
   limpiarFormModalObs();
	
   getPlanPorId(id)
   .then(resp=>{
	  
	 resp=resp[0]; console.log(resp);
	 $("#modalCompetencia").html( resp.des_competencia );
	 $("#modalComportamiento").html(resp.des_comportamiento);  
	 $("#modalAccion").val(resp.acciones); 
	 $("#modalFechaEntrega").val(resp.tiempo);
	 $("#modalRecursos").val(resp.recursos);
	 $("#modalObsId").val(resp.id);
	 $("#modalObsAccion").val(resp.obs_acciones);
	 $("#modalFechaSugerida").val(resp.fecha_sugerida);
	 $("#modalRecursosSugeridos").val(resp.obs_recursos);
	 $("#modalObsJefeDirecto").val(resp.obs_jefe_inmediato);
	 $("#modalObservaciones").modal("show")
	 let rol= $("#Rol").val();
		 
	 if(rol!=8){  //si es administrador o la persona evaluada

		if(resp.id_usuario==$("#UsrId").val()){
			$("#modalObsJefeDirecto").prop("disabled",true)
		}else{
			$("#modalObsJefeDirecto").prop("disabled",false)
		}
			
	  }else{
			$("#modalObsJefeDirecto").prop("disabled",true);
		 }
	   
	 if(resp.con_obs==1){$(".obs").prop("disabled",true);}
	   
   })
	.catch(e=>{
	   console.error(e);
   })
}

function capitalizarPrimeraLetra(str) {
	
	sw = str && str.length>0;
	if(sw){
		str= str.toLocaleLowerCase();
		str= str.charAt(0).toUpperCase() + str.slice(1);	   
	 }
  return str;
}

 function viewSeguimientos(datos){
	
   let html='';
	
    $("#n_seguimientos").text(datos.length);
	
	
	 html+=`<table class="datos_list" border="1" cellpadding="1" cellspasing="0" >
			  <thead>
				<tr class="alert-primary" >
						<th ></th>
						<th class="text-left" style="padding:2px"><b>Competencia</b></th>
						<th class="text-left" style="padding:2px"><b>Compotamiento</b></th>
						<th class="text-left" style="padding:2px"><b>Acciones a tomar</b></th>
						<th class="text-left" style="padding:2px"><b>Fecha de entrega</b></th>
						<th class="text-left" style="padding:2px"><b>Recursos necesarios</b></th>
						<th class="text-left" style="padding:2px"><b>RESULTADOS</b></th>
						<th class="text-left" style="padding:2px"><b>EVIDENCIAS</b></th>
						<th class="text-left" style="padding:2px"><b>Fecha&nbsp;Seguimiento Jefe Inmediato</b></th>
						<th class="text-left" style="padding:2px"><b>Observaciones&nbsp;Jefe &nbsp;Inmediato</b></th>
						<th class="text-left" style="padding:2px"><b>Fecha&nbsp;Seguimiento&nbsp;Gestión Humana</b></th>
						<th class="text-left" style="padding:2px"><b>Observaciones&nbsp;Gestión Humana</b></th>
						<th class="text-left" style="padding:2px">Dias a vencer</th>
					</tr>
				</thead>
			 <tbody>
			`;
	
	 id_usuario=0;
	 
	 datos.forEach((item,index)=>{
		
		 if(item.fecha_seg_jefe_inmediato=='1900-01-01'){
			item.fecha_seg_jefe_inmediato='';
		 }
		 if(item.fecha_seg_g_humana=='1900-01-01'){
			item.fecha_seg_g_humana='';
		 }
		 
		 if(id_usuario!= item.id_usuario){
		   
			 html+=`<tr>
						<td colspan="13"><div class="alert bg-dark text-white"><b>${item.usuario}</b>-EVALUACION ${item.id_evaluacion}</div></td>
					</tr>`;
			 id_usuario=item.id_usuario;
	     }

		html+=`<tr > `
		 
		html+=` <td><button class="btn btn-ligth "  onclick="modalObservaciones(${item.id})" ><i class="fa-regular fa-comment-dots text-info"></i></button></td>
				<td>${item.des_competencia}</td>
				<td>${capitalizarPrimeraLetra(item.des_comportamiento)}</td>`;
		 
		if(item.con_obs==1){
			
		  html+=`<td>${capitalizarPrimeraLetra(item.acciones)}</td>`;
		  html+=`<td>${item.tiempo}</td>`;
		  html+=`<td>${capitalizarPrimeraLetra(item.recursos)}</td>`;
		  	
		}else{
			html+=`<td>${capitalizarPrimeraLetra(item.acciones)}</td>`;
			html+=`<td>${item.tiempo}</td>`;
			html+=`<td>${capitalizarPrimeraLetra(item.recursos)}</td>`;
		}

		
		html+=`
			<td><textarea readonly  class="form-control alert-warning" rows="3" cols="4">${capitalizarPrimeraLetra(item.resultados)}</textarea></td> 
			<td style="display:none">${item.peor_calificacion}</td>
			<td style="display:none">${item.id_comportamiento}</td>
			<td style="display:none">${item.id_usuario}</td>
			<td style="display:none">${item.id_competencia}</td>
			<td style="display:none">${item.id_evaluacion}</td>
			<td style="display:none">${item.id}</td>`
		 
			 if(item.evidencia!=''){
				 href='../resources/SuportPlanDesarrollo/'+item.evidencia;
				 color='success';
				 display='';
			 }else{
				href=''; 
				color='dark';
				display='none';
			 }
			
			 html+=`<td class="text-align">
						<div class="row">
							<lable style="display:${display}">Descargar</lable>
							<a style="display:${display}" class="btn btn-sm" href="${href}"  download>
									<i class="fa fa-download text-${color}"  style="font-size:18px;"></i>
							</a>
						</div>
				   </td>`;
		 //VALIDO EL ROL SI ES GESTION HUMANA HABILITO LAS CASILLAS DE OBSERVACION DE ESE ROL 
		 rol= $("#Rol").val();
		 
		 if(rol!=8){  //si es administrador o la persona evaluada
		    db_inputs_gh='disabled';
			 
			 if(item.id_usuario!=$("#UsrId").val()){
				db_jefe_directo='';
			 }else{
				db_jefe_directo='disabled';
			}
			
	     }else{
			db_inputs_gh='';
			db_jefe_directo='disabled';
		 }
		 
		 if(item.dias_vencidos>0){
		   item.dias_vencidos=0; 	
	     }
		 //<textarea onblur="addNotaJefeDirecto(this,${item.id})" ${db_jefe_directo} class="form-control alert-warning"  rows="3"></textarea>
		 html+= ` 	<td class="text-center">${item.fecha_seg_jefe_inmediato} </td>
					<td>${capitalizarPrimeraLetra(item.obs_jefe_inmediato)} </td>
					<td class="text-center">${capitalizarPrimeraLetra(item.fecha_seg_g_humana)}</td>
					<td><textarea class="form-control alert-warning" ${db_inputs_gh} onblur="addNotaJefeDirecto(this,${item.id})"  rows="3">${capitalizarPrimeraLetra(item.obs_g_humana)}</textarea> </td>
					<td style="display:none">${item.id}</td>
					<td>${ Math.abs(item.dias_vencidos) }</td>`	
		html+=`</tr>`;
		 
		if(item.obs_accion!=''){
			
			
		    html+=  `<tr>
  						<td class="alert-danger"></td>
						<td class="alert-danger"></td>
						<td class="alert-danger"></td>
						<td class="alert-danger">${capitalizarPrimeraLetra(item.obs_acciones)}</td>
						<td class="alert-danger">${capitalizarPrimeraLetra(item.obs_recursos)}</td>
						<td class="alert-danger">${capitalizarPrimeraLetra(item.fecha_sugerida)}</td>
						<td colspan="7" class="alert-danger"></td>
					 </tr>` 
		}
		 
	 });
	 
	$("#seguimientos").html(html);
	
}
/*
function mostrarComportamientosMalos(data){
	
	 $("#pendientes").show();
	
	 $("#pendientes").html('<div class="alert alert-warning m-2" > <i class="fa-solid fa-spinner fa-spin-pulse"></i> Cargando...</div>');
	 $("#btnPendientes").attr("disabled",true)
	 listarComportamientosCalificados(data)
	 .then(resp=>{

		 arrayPendientes=resp;
		 viewPlanesPendientes(resp);
		 $("#btn_back_mis_evaluaciones").show();
		 $("#mis_evaluaciones").hide();
		 $("#btnPendientes").attr("disabled",false)
	 })
	.catch(e=>{
		 $("#btnPendientes").attr("disabled",false)
		 $("#pendientes").html('<div class="alert alert-danger" > <i class="fa fa-remove"></i> Error interno ... </div>');
		 console.error(e)
		 arrayPendientes=[];
	 });	
	
}*/


function back_mis_evaluaciones(){
	 $("#mis_evaluaciones").show();
	 $("#pendientes").hide();	
}

function filtarPendientes(valor,e){
	
	tecla = (document.all) ? e.keyCode : e.which; 
	
	Liactivo=$(".nav-tabs").find("li button.active").attr("id");
	
	
	switch(Liactivo){
		case "pendientes-tab": tabla='pendientes'; div ='pendientes' ; break;
		case "en-curso-tab"  : tabla='en-curso';   div ='gestionados';   break;
		case "vencidas-tab"  : tabla='vencidas';   div ='vencidas'; break;
		case "finalizadas-tab"  : tabla='finalizados';  div ='finalizados';  break;	
	}
	
	let usuariosFiltrados=[];
	
	if(tecla==13){
		
		if(valor.length==0){
		   $(".datos_list-"+tabla+" tbody tr").show();
			usuariosFiltrados=arrayPendientes; 
		}else{
			 usuariosFiltrados = arrayPendientes.filter(usuario => {
			  // Convierte el nombre de usuario a minúsculas y compara con la letra deseada
			  return usuario.usuario.toLowerCase().includes(valor.toLowerCase());
			});
		}
		


		switch(div){
			case "pendientes":
				viewHtmlPlanesPendientes(usuariosFiltrados,div)
			break;
			case "gestionados":
				viewPlanesGestionados(usuariosFiltrados,div)
			break;
			case "vencidas":
				viewPlanesGestionados(usuariosFiltrados,div)
			break;
			case "finalizados":
				viewHtmlPlanesFinalizados(usuariosFiltrados,div)
			break;
	    }
	}

}
	 
var selectUsuarios='';
var op_usuarios='';

function listarNotaClificacion(cadena){

	ul='<ol>'
	if($.trim(cadena)!=''){
	  	cadena=cadena.split('*')
		cadena.forEach(c=>{
			if(c.trim()!=''){
			   ul+=`<li style="  text-align: justify;">${c}</li>`
			 }
		})
	}
    ul+='</ol>'; 
	
	return ul;
}

const modalAddComment =(sw,accion)=>{
	
	$("#modalAddComment").modal("show");
	$("#sw").val(sw);
	$("#descripcion_comentario").html("");
	$("#descripcion_gestion_plan").val("");
	$(".fecha_sugerida").hide();
	$("#fecha_sugerida").val("");
	$("#text_obs").show();
	$("#text_obs").val("");
	if(sw==1){
	   $("#descripcion_comentario").html("Observación para la acción a tomar");
	   $("#descripcion_gestion_plan").val($("#acciones_add_plan").val());
	}
	if(sw==2){
	   $("#descripcion_comentario").html("Observación para la fecha de entrega ");
	   $("#descripcion_gestion_plan").val($("#tiempo_entrega_add_plan").val());
	   $("#text_obs").hide();
	   $(".fecha_sugerida").show();
	}
	if(sw==3){
	   $("#descripcion_comentario").html("Observación para los recursos requeridos ");
	   $("#descripcion_gestion_plan").val($("#recursos_add_plan").val());
	}
}

const listarObservacionesPlan =async (id_plan,tipo)=>{
	
	const data={
		link :url_api+'plandesarrollo/listarobservaciones',
		tipo ,
		id_plan,
		metodo:'GET'
	}
	const resp =await enviarPeticion(data);

	divNoResult =`<div class="alert  d-flex align-items-center border-light border-1" role="alert">
  					<i class="fa-solid fa-triangle-exclamation text-danger"></i>
					<div class="text-danger">
					   &nbsp;No se encontrarón ${tipo} sugeridas por el jefe directo
					</div>
				</div>`

		switch(tipo){
		  case 'accion':
				idDiv ='listado_obs_acciones';	
		  break;
		  case 'fecha':
				idDiv ='listado_obs_fechas';
		  break;
		  case 'recurso':
				idDiv ='listado_obs_recursos';
		  break;
	    }  
	if(resp.length==0){

		$("#"+idDiv).html(divNoResult);
		return ;
	}
	
	list ='<ol class="list-group list-group-'+tipo+'"> ';
	
	resp.forEach(obs=>{
		//list+=`<li class="list-group-item">${obs.observacion}</li>`
		list+=`
			  <li id="list-group-${tipo}-${obs.id}" 
				class=" list-group-item 
						d-flex alert-warning 
						justify-content-between 
						align-items-start ">
				<div class="ms-2 me-auto">
				   ${obs.observacion}
				</div>
				<span >${obs.fecha_creacion.substring(0,16)}</span>
			  </li>`
	})
	list+=`</ol>`

	$("#"+idDiv).html(list);
}

const getDataObsList =()=>{
	
	let ids =[];
	
	$(".list-group-accion li").each(function(){
		if(!$(this).hasClass("visto")){
			id =$(this).attr("id").split("-").pop();
			ids.push(id);
		}
	})
	$(".list-group-fecha li").each(function(){
		if(!$(this).hasClass("visto")){
		  id =$(this).attr("id").split("-").pop();
		  ids.push(id);
		}
	})
	$(".list-group-recurso li").each(function(){
		if(!$(this).hasClass("visto")){
		  id =$(this).attr("id").split("-").pop();
		  ids.push(id);
		}
	})
	
   return ids;
}

const abrirModalIniciarPlan=async (ob,proceso)=>{
	
   try{
	
	const fila    			= $(ob).parent().parent();
	const id_plan 			= fila.find("td").eq(13).html();
	const id_evaluado 		= fila.find("td").eq(7).html()
	const n_obs_acciones		= parseInt(fila.find("td").eq(10).html());
	const n_obs_fecha_entrega	= parseInt(fila.find("td").eq(11).html());
	const n_obs_recursos		= parseInt(fila.find("td").eq(12).html());
	const dias_vencidos         = parseInt(fila.find("td").eq(24).html());
	
	resultados =fila.find("td").eq(19).html();
	evidencia  =fila.find("td").eq(20).html();

	limpiarCamposAddPlan();
	$("#acciones_add_plan").attr("disabled",true);
	$("#tiempo_entrega_add_plan").attr("disabled",false);
	$("#recursos_add_plan").attr("disabled",true);	
	$("#resultados_plan").attr("disabled",true);	
	$("#evidencias_plan").attr("disabled",true);
	$("#obs_general_gh").attr("disabled",true);
	
	$(".proceso-1").hide();
	$("#id_usuario_add_plan").val($("#UsrId").val());
	$("#id_evaluacion_add_plan").val(fila.find("td").eq(9).html());
	$("#id_comportamiento_add_plan").val(fila.find("td").eq(6).html());
	$("#id_competencia_add_plan").val(fila.find("td").eq(8).html());
	$("#id_det_enc").val(fila.find("td").eq(21).html());
	$("#nombre_evaluado").text(fila.find("td").eq(22).html());
	$("#email_evaluado").val(fila.find("td").eq(23).html());
	$("#id_evaluado_add_plan").val(id_evaluado);

	$("#des_competencia_add_plan").html(fila.find("td").eq(14).html());
	$("#des_comportamiento_add_plan").html(fila.find("td").eq(15).html()); 
	
	if((id_plan==0 || id_plan =='') && proceso==1 ){
	  Swal.fire("Alerta","No se detecto el identificador del plan de mejora","warning");
	  return;
	}
	
	$("#id_plan").val(id_plan);
	console.log({
		id_plan
	})
	if( $("#id_plan").val()>0 ){
		//
		$(".proceso-1").show();
		await listarObservacionesPlan($("#id_plan").val(),'accion');
		await listarObservacionesPlan($("#id_plan").val(),'fecha');
		await listarObservacionesPlan($("#id_plan").val(),'recurso');
		
		//marco como visto los comentarios
		const idsObs =await getDataObsList();
		console.log({idsObs});
		if(idsObs.length>0){
			
			$("#div_obs_vistas").html('');
			// VALIDO QUE SEA EL EVALUADO QUIEN PUEDA HACER LA ACTUALIZACION 
			if(id_evaluado==$("#UsrId").val()){
			
			dataSend ={
				link  :url_api+'plandesarrollo/marcarvisto',
				ids   :idsObs
			}
			
			const respuesta =await enviarPeticion(dataSend);
			
			if(respuesta.ok){
			   $("#div_obs_vistas").show().html(`		  
					   <i class="fa-solid fa-triangle-exclamation"></i> 
		  				<div>
							${respuesta.mensaje}
		  				</div>`).addClass("alert-success");   
			}else{
				   $("#div_obs_vistas").show().html(`		  
					   <i class="fa-solid fa-triangle-exclamation"></i> 
		  				<div>
							${respuesta.mensaje}
		  				</div>`).addClass("alert-warning");   
			}				
				
			}
			setTimeout(function(){
				$("#div_obs_vistas").hide();
			},3000)
		}else{
			$("#div_obs_vistas").hide(); 
		}
		

		$("#acciones_add_plan").val(fila.find("td").eq(16).html()).attr("disabled",false);
		$("#tiempo_entrega_add_plan").val(fila.find("td").eq(17).html()).attr("disabled",false);
		$("#recursos_add_plan").val(fila.find("td").eq(18).html()).attr("disabled",false);

		if(id_evaluado!=$("#UsrId").val()){
			console.log({
				id_evaluado,
				id_usuario:$("#UsrId").val()
			})
			 $("#add_comment_acciones_add_plan").show();
			 $("#add_comment_fecha_add_plan").show();
			 $("#add_comment_recursos_add_plan").show();
			 $("#acciones_add_plan").attr("disabled",true);
			 $("#tiempo_entrega_add_plan").attr("disabled",true);//modificar fecha
			 $("#recursos_add_plan").attr("disabled",true);
			 $("#resultados_plan").attr("disabled",true);
			 $("#evidencias_plan").attr("disabled",true);
			 $("#estado_final").attr("disabled",false);
		}else{
			 //esta opcion es si es el evaluado quien abre el plan de gestion 
			 $("#add_comment_acciones_add_plan").hide();
			 $("#add_comment_fecha_add_plan").hide();
			 $("#add_comment_recursos_add_plan").hide();
			//debe bloquear obs jefe inmediato y de gestion humana
			$("#obs_general_jefe").attr("disabled",true);
			
			$("#resultados_plan").attr("disabled",false);
			$("#evidencias_plan").attr("disabled",false); 
		}
		
		//verifico si ya existe resultados 
		if(resultados!=''){$("#resultados_plan").val(resultados)}
	
		if(evidencia!=''){
			$(".tr_download_file").show();
			$("#descargar_evidencias").attr("href","../resources/SuportPlanDesarrollo/"+evidencia);
		}else{
			 $(".tr_download_file").hide();
		}
	   
	}else{
		console.log("aqui")
		$("#des_competencia_add_plan").html(fila.find("td").eq(1).html());
	    $("#des_comportamiento_add_plan").html(fila.find("td").eq(2).html());
		//deshabilito las observaciones generales solo para administradores y jefes directos 
		$("#obs_general_jefe").attr("disabled",true);
		
		if(id_evaluado!=$("#UsrId").val()){
			 $("#acciones_add_plan").attr("disabled",true);
			 $("#tiempo_entrega_add_plan").attr("disabled",true);
			 $("#recursos_add_plan").attr("disabled",true);
			 $("#resultados_plan").attr("disabled",true);
			 $("#evidencias_plan").attr("disabled",true);
		
		}else{
			 $("#acciones_add_plan").attr("disabled",false);
			 $("#tiempo_entrega_add_plan").attr("disabled",false);
			 $("#recursos_add_plan").attr("disabled",false);
			 $("#resultados_plan").attr("disabled",false);
			 $("#evidencias_plan").attr("disabled",false);
		}		
		
	}
	
	
	if(dias_vencidos>0){
		if(id_evaluado!=$("#UsrId").val()){
			//$(".modal-body-gestion").find("input:not(#tiempo_entrega_add_plan), select:not(#tiempo_entrega_add_plan), textarea:not(#tiempo_entrega_add_plan), button:not(#tiempo_entrega_add_plan)").prop("disabled", true);
			$("#acciones_add_plan").attr("disabled",true);
			$("#tiempo_entrega_add_plan").attr("disabled",false);
			$("#recursos_add_plan").attr("disabled",true);
			$("#resultados_plan").attr("disabled",true);
			$("#evidencias_plan").attr("disabled",true);
		}else{
			$(".modal-body-gestion").find("input,select,textarea,button").attr("disabled",true);
		}
	  
	}else{
		// $(".modal-body-gestion").find("input,select,textarea,button").attr("disabled",false);
	}	   
	   
	   
	   
   }catch(e){
	   console.error(e)
   }	
	
	$("#modalIniciarPlan").modal("show");
}


 function viewPlanesGestionados(datos,idDiv){
	
   let html='';
   
   let color_fila='';
	
    $("#n_"+idDiv).text(datos.length);
	
	if(datos.length===0){
	    //datosDocument.Divpendients.innerHTML+=datosDocument.divAlert;	
		 $("#"+idDiv).html('<div class="alert alert-danger" > <i class="fa fa-remove"></i> Sin resultados ... </div>');
		 return;
     } 	
   
	 
	html+=`<table class="table datos_list-pendientes" > `;
	 
	 
	html+=`<thead class="table-primary p-3 encabezados ">
				<tr>
					<th class="text-left" ><b>Acciones a tomar</b></th>
					<th class="text-left" ><b>Fecha de entrega</b></th>
					<th class="text-left" ><b>Recursos necesarios</b></th>
					<th class="text-left" ><b>Fecha creación</b></th>
					<th>Gestionar</th>
					<th>Fecha seg. jefe </th>
					<th>Fecha seg. GH</th>
				</tr>
			</thead>
		<tbody>`
	  id_evaluado  = 0;
	  indiceColor  = 0;
	 
	  datos.forEach((item,index)=>{
		
		if(id_evaluado!=item.id_evaluado){
			
		  html+=`<tr class="encabezados">
				  <th colspan="7">
					<div class="alert alert-primary d-flex align-items-center" role="alert">
  						<i class="fa-solid fa-user"></i>
  					    <div class="p-1"> ${item.usuario} </div>
                    </div>
				   </th>
				  </tr>`;
			
			id_evaluado=item.id_evaluado;
	   
	       if(indiceColor>coloresEvaluados.length-1){
			 indiceColor=0;
		   }	   
		   indiceColor++;			
			
		}
		  
		if(item.fecha_seg_jefe_inmediato=='1900-01-01'){
			item.fecha_seg_jefe_inmediato=''
		} 
		if(item.fecha_seg_g_humana=='1900-01-01'){
			item.fecha_seg_g_humana=''
		}
		span='';
		iButton =`<i class="fa-regular fa-pen-to-square"></i>`  
		  
		
		if(idDiv=='gestionados'){
			if(item.n_obs_acciones>0 || item.n_obs_fecha_entrega>0 || item.n_obs_recursos>0){
				 span=` <span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
						<span class="visually-hidden">5</span>
						  </span>` 
			}
			proceso =1;
		}
		 if(idDiv=='vencidas'){
			iButton =`<i class="fa-regular fa-eye"></i>` 
			proceso =3;
	     }
		  
		html+=`
				<tr>
					<td>${item.acciones}</td>
					<td>${item.tiempo}</td>	
					<td>${item.recursos}</td>
					<td>${item.fecha_creacion}</td>
					<td>
                        <button class="btn btn-outline-primary position-relative" onclick="abrirModalIniciarPlan(this,${proceso})">	
							${iButton}
							${span}
						</button>
				    </td>
					<td style="display:none">${item.peor_calificacion}</td>
					<td style="display:none">${item.id_comportamiento}</td>
					<td style="display:none">${item.id_evaluado}</td>
					<td style="display:none">${item.id_competencia}</td>
					<td style="display:none">${item.id_evaluacion}</td>
					<td style="display:none">${item.n_obs_acciones}</td>
					<td style="display:none">${item.n_obs_fecha_entrega}</td>
					<td style="display:none">${item.n_obs_recursos}</td>
					<td style="display:none">${item.id_plan}</td>
					<td style="display:none">${item.competencia}</td>
					<td style="display:none">${item.comportamiento}</td>
					<td style="display:none">${item.acciones}</td>
					<td style="display:none">${item.tiempo}</td>
					<td style="display:none">${item.recursos}</td>
					<td style="display:none">${item.resultados}</td>
					<td style="display:none">${item.evidencia}</td>
					<td style="display:none">${item.id_det_enc}</td>
					<td style="display:none">${item.usuario}</td>
					<td style="display:none">${item.email}</td>
					<td style="display:none">${item.dias_vencidos}</td>
					<td ><div class="badge rounded-pill bg-danger p-2">${item.fecha_seg_jefe_inmediato}</div></td>
					<td ><div class="badge rounded-pill bg-success p-2">${item.fecha_seg_g_humana}</div></td>
				</tr>`
	  });
	 
	html+=`</tbody>
		</table>`
	$("#"+idDiv).html(html);
	
}

const modalInfoFinalizado =(ob)=>{
	
	const fila =$(ob).parent().parent();
	
	const competencia	=fila.find("td").eq(1).html();
	const comportamiento=fila.find("td").eq(2).html();
	const evaluado     =fila.find("td").eq(17).html();
	
	const acciones     =fila.find("td").eq(5).html();
	const obs_acciones =fila.find("td").eq(7).html();
	
	const recursos     =fila.find("td").eq(8).html();
	const obs_recursos =fila.find("td").eq(9).html();
	const fecha        =fila.find("td").eq(10).html();
	const obs_fecha    =fila.find("td").eq(11).html();
	const evidencia    =$.trim(fila.find("td").eq(13).html());
	
	const obs_jefe_directo =$.trim(fila.find("td").eq(18).html());
	const obs_g_humana     =$.trim(fila.find("td").eq(19).html())
	
	const obs_estado_final = $.trim(fila.find("td").eq(4).html())
	
	$("#info-competencia").html(competencia);
	$("#info-comportamiento").html(comportamiento);
	$("#info-evaluado").html(evaluado);
	$("#info-acciones").html(acciones);
	$("#info-obs-acciones").html($.trim(obs_acciones));
	$("#info-recursos").html(recursos);
	$("#info-obs-recursos").html($.trim(obs_recursos));
	$("#info-fecha").html(fecha);
	$("#info-obs-fecha").html($.trim(obs_fecha));
	
	$("#info-obs-jefe-directo").text(obs_jefe_directo);
	$("#info-obs-g-humana").text(obs_g_humana);

	if(evidencia!=''){
	   $("#info-evidencia").attr("href","../resources/SuportPlanDesarrollo/"+evidencia);
	   $("#info-evidencia").attr("disabled",false)
	}else{
		$("#info-evidencia").attr("disabled",true)
	}
	
	$("#info-estado-final").html(obs_estado_final);
	$("#modalInfoFinalizado").modal("show");
}


function viewHtmlPlanesFinalizados(datos,idDiv){
	
 let html='';
	
  $("#n_"+idDiv).text(datos.length);
	
	if(datos.length===0){
	    //datosDocument.Divpendients.innerHTML+=datosDocument.divAlert;	
		 $("#"+idDiv).html('<div class="alert alert-danger" > <i class="fa fa-remove"></i> Sin resultados ... </div>');
		 return;
     }
	
	html+=`<table  class="table datos_list-finalizados" id="table-finalizados"  >
			 <tbody>`
   let id_evaluado =0; 
   let indiceColor=	0;

   let cont_estado_f =0;
   let cont_estado_m =0;
   let cont_estado_n =0;
	
	
   datos.forEach((item,index)=>{
	    
		if(id_evaluado!=item.id_evaluado){
			
		 html+=`<thead class="encabezados">

					<tr class="bg-primary text-white">
					 <th colspan="16"><div >${item.usuario}</div></th>
					</tr>
					<tr class="alert-primary ">
						<th ></th>
						<th class="text-left" valign="top"><b>COMPETENCIA</b></th>
						<th class="text-left"><b>COMPORTAMIENTO</b><br>¿Que tengo que mejorar?</th>
						<th><h5><i class="fa-regular fa-comment-dots"></i> Comentarios</h5></th>
						<th>Estado</th>
						<th>Acciones</th>
						<th></th>
						<th style="display:none">Observaciones(Acciones)</th>
						<th style="display:none">Recursos</th>
						<th style="display:none">Observaciones(Recursos)</th>
						<th style="display:none">Fecha de entrega</th>
						<th style="display:none">Observaciones(Fecha)</th>
						<th style="display:none">Resultados</td>
						<th style="display:none">Evidencia</td>
						<th style="display:none">Oficina</th>
						<th style="display:none">Rol</th>
						<th style="display:none">Cargo</th>
						<th style="display:none">Usuario</th>
					</tr>
				 </thead>`;
			id_evaluado=item.id_evaluado;

	       if(indiceColor>coloresEvaluados.length-1){
			 indiceColor=0;
		   }	   
		   indiceColor++;			
			
		}
 		color_nota='warning';
			   
		if(item.nota_autoevaluado=='1'){
			color_nota='danger'
	    }
	    estado='';
	   
	    if(item.estado=='N'){ cont_estado_n++;
		   estado ='<div  class="badge bg-danger m-1 text-white p-1" style="padding:10px">No finalizado</div>';   
		}else if( item.estado=='M'){ cont_estado_m++;
		   estado ='<div  class="badge bg-warning m-1 text-white p-1" >Parcialmente finalizado</div>';  
		}else if(item.estado=='F'){ cont_estado_f++;
		   estado ='<div  class="badge bg-success m-1 text-white p-1" >Finalizado</div>';  		 
		}
	   
 		html+=`
			<tr>
				<td valign="middle"><h3>${index+1}</h3></td>
				<td valign="middle" ><h5>${capitalizarPrimeraLetra(item.competencia)}</h5></td>
				<td width="20%">${capitalizarPrimeraLetra(item.comportamiento)}</td>
				<td><div class="alert alert-warning overflow-auto" style="height:170px">${listarNotaClificacion(item.observaciones)}</div></td>
				<td>${estado}</td>
				<td>${item.acciones}</td>
				<td valign="middle"><button class="btn btn-sm btn-secondary" onclick="modalInfoFinalizado(this)"><i class="fa-solid fa-circle-info"></i></button></td>
				<td style="display:none"><div class="alert alert-warning overflow-auto" style="height:170px">${listarNotaClificacion(item.recomendaciones_acciones)}</div></td>
				<td style="display:none">${item.recursos}</td>
				<td style="display:none"><div class="alert alert-warning overflow-auto" style="height:170px">${listarNotaClificacion(item.recomendaciones_recursos)}</div></td>
				<td style="display:none">${item.fecha_entrega}</td>
				<td style="display:none"><div class="alert alert-warning overflow-auto" style="height:170px">${listarNotaClificacion(item.recomendaciones_fecha)}</div></td>
				<td style="display:none">${item.resultados}</td>
				<td style="display:none">${item.evidencia}</td>
				<td style="display:none">${item.oficina_ventas}</td>
				<td style="display:none">${item.rol}</td>
				<td style="display:none">${item.cargo}</td>
				<td style="display:none">${item.usuario}</td>
				<td style="display:none">${item.obs_jefe_inmediato}</td>
				<td style="display:none">${item.obs_g_humana}</td>
			</tr>`;
	   
	});
	
 	html+=`</tbody>
			</table>`	
	// datosDocument.Divpendients.innerHTML +=html ;	
	$("#"+idDiv).html(html);
	$("#cont_estado_f").text(cont_estado_f);
	$("#cont_estado_m").text(cont_estado_m);
	$("#cont_estado_n").text(cont_estado_n);
	
}


function viewHtmlPlanesPendientes(datos,idDiv){
	
 let html='';
	
  $("#n_"+idDiv).text(datos.length);
	
	if(datos.length===0){
	    //datosDocument.Divpendients.innerHTML+=datosDocument.divAlert;	
		 $("#pendientes").html('<div class="alert alert-danger" > <i class="fa fa-remove"></i> Sin resultados ... </div>');
		 $("#btnPendientes").attr("disabled",false)
		 return;
     }
	
	html+=`<table class=" datos_list table datos_list-en-curso" border="1" style="width:100%" >
			 <tbody>`
	id_evaluado =0;
	       
   indiceColor=	0;
   datos.forEach((item,index)=>{

		if(id_evaluado!=item.id_evaluado){
		   html+=`<thead class="encabezados">
					  <tr class="bg-primary p-1 text-white">
						<th colspan="5"><div">${item.usuario}</div></th>
					  </tr>
					<tr class="alert-primary">
						<th width="7%"></th>
						<th class="text-left" ><b>COMPETENCIA</b></th>
						<th class="text-left"><b>COMPORTAMIENTO</b> ¿Que tengo que mejorar?</th>
						<th><h5><i class="fa-regular fa-comment-dots"></i> Comentarios</h5></th>
						<th width="15%"></th>
					</tr>
				 </thead>`;
			id_evaluado=item.id_evaluado;

		 indiceColor++;	
			
	     if(indiceColor>coloresEvaluados.length-1){
		   indiceColor=0;
		 }	   
		   		
		}
 		color_nota='warning';
			   
		if(item.nota_autoevaluado=='1'){
			color_nota='danger'
	    }
	   
	   if(id_evaluado!=$("#UsrId").val()){
		  disabled_btn_insert_plan='disabled'; 
	   }else{
		   disabled_btn_insert_plan=''; 
	   }
	   
 		html+=`
			<tr>
				<td>${index+1}</td>
				<td class="text-"><h5>${capitalizarPrimeraLetra(item.competencia)}</h5></td>
				<td>${capitalizarPrimeraLetra(item.comportamiento)}</td>
				<td><div class="alert alert-warning">${listarNotaClificacion(item.observaciones)}</div></td>
				<td class="align-middle text-center">
					<button 
						${disabled_btn_insert_plan}
						data-toggle="modal" 
						data-target="#modalIniciarPlan" 
						onclick="abrirModalIniciarPlan(this,0)" 
						class="btn btn-outline-primary">
					   <i class="fa fa-play" aria-hidden="true"></i>
					</button>
				</td>
				<td style="display:none">${item.peor_calificacion}</td>
				<td style="display:none">${item.id_comportamiento}</td>
				<td style="display:none">${item.id_evaluado}</td>
				<td style="display:none">${item.id_competencia}</td>
				<td style="display:none">${item.id_evaluacion}</td>
				<td style="display:none">${item.n_obs_acciones}</td>
				<td style="display:none">${item.n_obs_fecha_entrega}</td>
				<td style="display:none">${item.n_obs_recursos}</td>
				<td style="display:none">${item.id_plan}</td>
				<td style="display:none">${item.competencia}</td>
				<td style="display:none">${item.comportamiento}</td>
				<td style="display:none">${item.acciones}</td>
				<td style="display:none">${item.tiempo}</td>
				<td style="display:none">${item.recursos}</td>
				<td style="display:none">${item.resultados}</td>
				<td style="display:none">${item.evidencia}</td>
				<td style="display:none">${item.id_det_enc}</td>
				<td style="display:none">${item.usuario}</td>
				<td style="display:none">${item.email}</td>
			</tr>`;
	   
	});
	
 	html+=`</tbody>
			</table>`	
	// datosDocument.Divpendients.innerHTML +=html ;	
	$("#pendientes").html(html);
	
}

function validateFormObs(){
	
	let valido=false;
	const obs_acciones		=$.trim($("#modalObsAccion").val());
	const obs_fecha_sugerida=$.trim($("#modalFechaSugerida").val());
	const obs_recursos		=$.trim($("#modalRecursosSugeridos").val());
	const obs_jefe_inmediato=$.trim($("#modalObsJefeDirecto").val());
	const usuario_modifica	=$("#UsrId").val();
	
	valido =obs_acciones !='' || obs_fecha_sugerida!='' || obs_recursos!='' || obs_jefe_inmediato!='';
	datosObs.id=$("#modalObsId").val();
	datosObs.obs_acciones		=obs_acciones;
	datosObs.obs_fecha_sugerida	=obs_fecha_sugerida;
	datosObs.obs_recursos		=obs_recursos;
	datosObs.obs_jefe_inmediato	=obs_jefe_inmediato;
	datosObs.usuario_modifica	=usuario_modifica;
	return valido;
}


function limpiarFormModalObs(){
    $("#sw").val(0);
    $("#text_obs").val("");
	$("#descripcion_comentario").text("");
	$("#descripcion_gestion_plan").val("");
	$("#fecha_sugerida").val(""); 
}


const cargarOficinas =async ()=>{
	
	try{
		const resp =await listarOficinas('../models/Usuarios.php');

		if(resp.length>0){
			p='<option value="">Seleccionar</option>';
			resp.forEach(oficina=>{
				p+='<option value="'+oficina.OFICINA_VENTAS+'">'+oficina.DESCRIPCION+'</option>';  
			})
			$("#oficinas").html(p);
			$("#oficina_seg").html(p);
			 if($("#Rol").val()!=1){
			   //$("#oficinas").attr("disabled",true);
			  // $("#oficinas").val($("#Ofc").val());
			   $("#oficina_seg").val($("#Ofc").val()).attr("disabled",true);
			 }
		}		
	}catch(e){
		console.error(e)
	}

}

$(document).ready( function(){
 
 cargarRoles();
 cargarCargos();
 cargarOficinas();

	$("#filtro-estado-final").change(function(){
		// $("#finalizados table thead tr").
	});
	
$("#exportar").click(function(){
	fnExcelReport("table-finalizados");
});	
	
$("button").hover(function() {
        if ($(this).prop("disabled")) {
            $("#miDiv").fadeIn(300);
			return ;
        }
    }, function() {
        $("#miDiv").fadeOut(100);
	return ;
 });
	
$(".filter_fechas").datepicker({dateFormat: "dd-mm-yy",setDate: new Date() });

$(".filter_fechas").datepicker('setDate', new Date());
$("#fecha_ini_pendientes").datepicker('setDate','01-01-2023');		
$("#evaluados").select2();	
	
 
 $(".fechas").datepicker({dateFormat: "dd-mm-yy",minDate: new Date()  });
 $(".fechas").datepicker('setDate',new Date());	
 
 $("#fecha_final_filtro_p,#fecha_ini_filtro_p").datepicker({dateFormat: "dd-mm-yy" });
 $("#fecha_ini_filtro_p").val('01-01-2023')
 $("#fecha_final_filtro_p").val('')
	
  if($("#Rol").val()!=1){
     //selecciono la oficina 
	// $("#seg_roles").attr("disabled",true);
	// $("#seg_cargos").attr("disabled",true);
  }	
	
  $("#add_comment_acciones_add_plan").click(function(){
	  $("#observacion_accion_plan").toggle();
  });
	
  $("#add_comment_fecha_add_plan").click(function(){
	  $("#input_observacion_fecha_plan").toggle();
  });
	
  $("#add_comment_recursos_add_plan").click(function(){
	  $("#observacion_recurso_plan").toggle();
  })
	
	
var  datosDocument={
	idSessionUser		:document.getElementById('UsrId').value,
	Divpendients		:document.getElementById('pendientes'),
	divAlert:'<div class="alert alert-danger m-2" > <i class="fa-solid fa-face-eyes-xmarks"></i> Sin resultados ... </div>'
};

 $(".nav > .nav-item").prop("disabled",true);
	
 $("#fecha_final_filtro_p,#fecha_ini_filtro_p,#oficina_seg,#seg_cargos,#seg_roles").change(function(){
	 
	 personasEvaluadasPropias(
		 {op:'list_evaluados',
		  fecha_ini:$("#fecha_ini_filtro_p").val(),
		  fecha_fin:$("#fecha_final_filtro_p").val(),
		  oficina :$("#oficina_seg").val(),
		  rol:$("#seg_roles").val(),
		  cargo:$("#seg_cargos").val()
		 }
	 )
	 .then(resp=>{ 
		 console.log(resp);
	   $(".nav > .nav-item").prop("disabled",false);
		if(!resp.error){

			resp=resp.data;
			p='<option value="0">Seleccione</option>';

			resp.forEach((item,index)=>{
				 p+=`<option value="${item.id}">${item.usuario}</option>`;
			});

		   $("#evaluados").html(p);	
		   $("#seguimientos").html("");
		   $("#pendientes").html("");

		}//if(!resp.error){

	  }).catch(err=>{console.error(err);
				 $(".nav > .nav-item").prop("disabled",false);	
			     $("#seguimientos").html("");
			  });	 
	 
 })	
	
	

$("#btnAddObs").click(function(){
	
	let   valido 	=false;
	const id_usuario=$("#UsrId").val();
	const id_det_enc=$("#id_det_enc").val();
	const email 	=$.trim($("#email_evaluado").val());
	valido = $.trim($("#text_obs").val()).length>0 ?  true:false;
	const sw=$("#sw").val();
	
	if(sw==2){
		valido = $.trim($("#fecha_sugerida").val()).length>0 ?  true:false;
	}
	 //si es valido actualizo
	if(valido){
	  
		Swal.fire({
		  title: 'Esta seguro que desea guardar?',
		  text: "Despúes de guardar no podra hacer cambios sobre los datos!",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Si!'
		}).then((result) => {
	
		  if (result.value) {
			  tipo			='';
			  id_plan 		=$("#id_plan").val();
			  id_evaluado 	=$("#id_evaluacion_add_plan").val()
			  
			  switch( parseInt(sw)){
				  case 1: tipo ='accion' ; obs =$("#text_obs").val();  break;
				  case 2: tipo ='fecha'  ; obs =$("#fecha_sugerida").val();  break;
				  case 3: tipo ='recurso'; obs =$("#text_obs").val();  break;
			  }
			  
			  datosObs={
				  tipo,
				  obs,
				  id_plan,
				  id_evaluado,
				  id_usuario,
				  id_det_enc,
				  email
			  }
			  $("input,select,a,textarea").attr("disabled",true)
			  addObservaciones(datosObs)
			  .then(resp=>{ 
				    $("input,select,a,textarea").attr("disabled",false)
				    limpiarFormModalObs();
				    Swal.fire("Ok","Se actualziaron correctamente los datos","success");
					$("#modalAddComment").modal("hide");
				    listarObservacionesPlan(id_plan,'accion')
				    listarObservacionesPlan(id_plan,'fecha')
				    listarObservacionesPlan(id_plan,'recurso')
			  })
			  .catch(e=>{
				  console.error(e)
				  $(".formularioObs").show();
			  	  $(".update_obs").hide();
				  $("input,select,a,textarea").attr("disabled",false)
			  })
		  }
			
		});		

	}
})

$(".nav-tabs li").click(async function(){
	
	
	id=$(this).attr("id");
	let fecha_ini=$("#fecha_ini_filtro_p").val();
	let fecha_fin=$("#fecha_final_filtro_p").val();		  	
	data={
			link	:url_api+'plandesarrollo/seguimientos',
			id_evaluado	:$("#evaluados").val(),
			id_usuario :$("#UsrId").val(),
			rol     :$("#Rol").val(),
			fecha_ini,
			fecha_fin,
			rol_est	:$("#seg_roles").val(),
			cargo   :$("#seg_cargos").val(),
			oficina  :$("#oficina_seg").val(),
			vencidos:0,
			metodo:'GET'
	}
	console.log(data);
	switch(id){
		case "li_filtros":
			return;
		break;
		case "li_pendientes":
			data.link=url_api+'plandesarrollo/pendientes'
			idDiv='pendientes'
			contId ='n_pendientes';
		break;
		case "li_en_cuerso":
			data.link=url_api+'plandesarrollo/gestionados'
			idDiv='gestionados'
			data.vencidos=0;
			contId ='n_gestionados';
		break;
		case "li_vencidas":
			data.link=url_api+'plandesarrollo/gestionados'
			data.vencidos=1;
			idDiv='vencidas';
			contId ='n_vencidas';
		break;
		case "li_finalizados":
			data.link=url_api+'plandesarrollo/finalizados'
			idDiv='finalizados'
			contId ='n_finalizados';
		break;
    }
	$("#"+idDiv).html('<div class="alert alert-warning m-2" ><i class="fa-solid fa-spinner fa-spin-pulse"></i> Cargando...</div>');
	$("#"+contId).html('<i class="fa-solid fa-spinner fa-spin-pulse"></i>');
	try{
	
	resp = await enviarPeticion(data);
	console.log({resp})
	$("#"+contId).html(resp.length);
	arrayPendientes=resp;
		
	if(resp.length==0){
			//datosDocument.Divpendients.innerHTML+=datosDocument.divAlert;	
			$("#"+idDiv).html('<div class="alert alert-danger" > <i class="fa fa-remove"></i> Sin resultados ... </div>');
			return;
	 }
	
	 switch(id){
		case "li_en_cuerso":
			viewPlanesGestionados( resp,'gestionados' ); 
		break;
		case "li_pendientes":
			 viewHtmlPlanesPendientes( resp,'pendientes' );
		break;
		case "li_vencidas":
			 viewPlanesGestionados( resp,'vencidas' ); 
		break;
		case "li_finalizados":
			  viewHtmlPlanesFinalizados(resp,'finalizados');
		break;
     }		
		
	}catch(e){ console.log(e)
		$("#"+idDiv).html('<div class="alert alert-danger" > <i class="fa fa-remove"></i> Error interno</div>');
		$("#"+contId).html(0);
		arrayPendientes=[];
		
	}

})
	
$("#fecha_ini_filtro_p,#fecha_final_filtro_p").change(function(){
	
	if($("#fecha_ini_filtro_p").val()!='' && $("#fecha_final_filtro_p").val()!=''){
	   $(".nav-tabs li > button").prop("disabled",false);
	}
});
	

$("#consultar").click(async function(){
	
	try{

		rolRoot= $("#Rol").val() == 8 ||  $("#Rol").val() == 1 ;

		if( $("#evaluados").val()=='' && !rolRoot ){
			  $("#seguimientos").html('<div class="alert alert-danger m-2" > <i class="fa fa-remove p-1"></i>No tienes valuados asociados</div>');  return;
		}

		$("#seguimientos").html('<div class="alert alert-danger m-2" > <i class="fa fa-repeat"></i> Cargando...</div>');
		let fecha_ini=$("#filter_fecha_ini").val();
		let fecha_fin=$("#filter_fecha_fin").val();		  	
		data={
			link	:url_api+'plandesarrollo/seguimientos',
			id		:$("#evaluados").val(),
			fecha_ini,
			fecha_fin,
			rol		:$("#seg_roles").val(),
			cargo   :$("#seg_cargos").val(),
			metodo:'GET'
		}
		const resp=await enviarPeticion( data )	

		if(resp.length==0){
			//datosDocument.Divpendients.innerHTML+=datosDocument.divAlert;	
			$("#seguimientos").html('<div class="alert alert-danger" > <i class="fa fa-remove"></i> Sin resultados ... </div>');
			return;
		}else{
			   viewSeguimientos(resp);
			}		
		
	}catch(e){
		console.error(e)
	}
	
});
	
});