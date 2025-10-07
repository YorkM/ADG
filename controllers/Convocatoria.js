let   eventosActivo =[];
let DiasFinTerrestre,
DiasFinAereo,
DiasFinConvocatoria;

const modulo ='0614';
let listadosZonas=[];
 
const datosModulo =(numero)=>{

	enviarPeticion({
		link:'../models/Servicios.php',
		op:'getInfoModule',
		numero
	})
	.then(resp=>{ console.warn(resp)
		resp=resp[0]
		//$("#des_modulo").html(`${resp.nombre_grupo}/<span>${resp.numero} ${resp.titulo} </span><span class="fs-6 float-end ">V 1.0.0</span>`)
		$("#des_modulo").html(`
				<nav aria-label="breadcrumb p-1">
				  <ol class="breadcrumb">
					<li class="breadcrumb-item" ><a href="#" >${resp.nombre_grupo}</a></li>
					<li class="breadcrumb-item active" aria-current="page">${resp.numero} ${resp.titulo} V 1.0.0</li>
				  </ol>
				</nav>`)
	})
	.catch(e=>{
		console.error(e)
	})
}

const departamentos=async (codigo)=>{

	try{
		const data={
			link:url_api+'departamentos/listar',
			codigo
		}
		const respuesta = await enviarPeticion(data);
		
		let  p='<option value=""></option>';
		
		
		if(respuesta.length>0){
			respuesta.forEach(item=>{
				p+=`<option value="${item.departamento}">${item.descripcion.toUpperCase()}</option>`   
			})
		}
		
		$("#departamentos").html(p);
		ciudades($("#departamentos").val());
		
		
	}catch(e){
		console.error(e)
	}

}

const ciudades=async (departamento)=>{

	try{
		const data={
			link:url_api+'ciudades/listar',
			departamento
		}
	
		const respuesta = await enviarPeticion(data);
		
		let  p='<option value=""></option>';
		
		
		if(respuesta.length>0){
			respuesta.forEach(item=>{
				p+=`<option value="${item.ciudad}">${item.descripcion.toUpperCase()}</option>`   
			})
		}
		
		$("#ciudades").html(p);
		
	}catch(e){
		console.error(e)
	}

}

const enevetosActivos =async (org)=>{
	
	try{
		const data={
			link:url_api+'eventoscomerciales/activos',
			org,
			metodo:'GET'
		}
	
		const respuesta =await enviarPeticion(data);
		console.log(respuesta);
		
		if(respuesta.length>0){
				
		    eventosActivo=respuesta;
			p='';
			
			respuesta.forEach(item=>{
				p+=`<option value="${item.id}">${item.descripcion.toUpperCase()}</option>`
			});
			
			$("#eventos").html(p);
			
			id_evento=$("#eventos").val();
			
			id_evento_cierre =respuesta.filter(i=> i.id == id_evento)
			$("#fecha_maxima_convocatoria").val( id_evento_cierre[0].fecha_fin_convocatoria );
			$("#presupuesto_viajero_aereo").val( formatNumberES(id_evento_cierre[0].presupuesto_aereo,0,'$') );
			$("#presupuesto_viajero_terrestre").val( formatNumberES(id_evento_cierre[0].presupuesto_terrestre,0,'$') );
			if(id_evento_cierre[0].id_evento_cierre>0){
			   listarEventosCierres(id_evento_cierre[0].id_evento_cierre);
			   
		    }else{
				$("#id_evento_cierre").attr("disabled",true);
				$("#id_evento_cierre").html(`<option value="0">No hay evento de cierre</option>`);
			}
			//
			
			validarFechasTiquetes(id_evento_cierre[0].dias_fin_aereo,id_evento_cierre[0].dias_fin_terrestre,id_evento_cierre[0].dias_fin_convocatoria);
		}
	}catch(e){
		console.error(e)
	}
}


const buscarEventoPorId=async (id)=>{
	
	try{
		data={
			link:url_api+'eventoscomerciales/searchid',
			id,
			metodo:'GET'
		}
		const resp=await enviarPeticion(data);
		console.log(resp)
		if(resp.length>0){
		   item=resp[0];

		   $("#modal_info_lugar").val(item.info_lugar);
		   $("#modal_info_direccion").val(item.info_direccion);
		   $("#modal_info_premios").val(item.info_premios);
		   $("#modal_info_fecha_fin_terrestre").val(item.fecha_fin_terrestre);
		   $("#modal_info_fecha_fin_aereo").val(item.fecha_fin_aereo);
		   $("#modal_info_evento_cierre").val(item.evento_cierre);
		}		
	}catch(e){
		console.error(e)
	}
}

const listarLaboratoriosParticipantes =async (id_evento)=>{
	
	try{
		data={
			link :url_api+'laboratoriosconvocatoria/buscarporevento',
			id_evento
		}
		$("#list-lab").html(`<div class="alert alert-primary d-flex align-items-center" role="alert">
									  <i class="fa-solid fa-circle-notch fa-spin"></i>
									  <div>
										Cargando...
									  </div>
									</div>`);
		const resp=await enviarPeticion(data);
			console.log(resp)
		if(resp.length>0){

			let tabla=`<table class="table table-sm table-borderer">
						<thead>
						  <tr>
							<th>Nombre</th>
							<th>Monto</th>
							<th>Patrocinador</th>
						  </tr>
						</thead>
						<tbody>`;

				resp.forEach(item=>{

					patrocinador=''
					if(item.patrocinador==1){
					   patrocinador='<i class="fa-solid fa-check text-success"></i>';   
					}

					tabla+=`<tr>
								<td>${item.nombres}</td>
								<td>${formatNumberES(item.monto,0,'')}</td>
								<td class="text-center">${patrocinador}</td>
							</tr>`
				});

				tabla+=`</tbody></table>`;

				$("#list-lab").html(tabla)
			}else{
				$("#list-lab").html(`<div class="alert alert-warning d-flex align-items-center" role="alert">
									    <i class="fa-solid fa-circle-exclamation m-1"></i>
									  <div>
										No se encontraron resultados
									  </div>
									</div>`)
			}		
		
		
		
	}catch(e){
		$("#list-lab").html(`<div class="alert alert-danger d-flex align-items-center" role="alert">
								  <i class="fa-solid fa-face-dizzy m-1"></i>
								  <div>
									Se genero un error 
								  </div>
								</div>`);
	}
	
}

const validarFechasTiquetes=(dias_dias_aereos,dias_fin_terrestre,dias_fin_convocatoria)=>{
	
	DiasFinTerrestre	=dias_fin_terrestre;
	DiasFinAereo		=dias_dias_aereos;
	DiasFinConvocatoria = dias_fin_convocatoria;
     $(".form input,select,textarea,button" ).attr("disabled",false)
	$("#msj_alertas").html('').hide() ;
	
       ul=`<ul class="list-group table-danger border-danger w-100">`
	   
	   if(dias_fin_convocatoria<0){
		   div=`<div class="alert alert-danger text-danger p-1 w-100">
					<h5><i class="fa-regular fa-face-sad-cry"></i><span>Recuerda que ya no es posible confirmar clientes </span></h5></div>`
		
		   $("#msj_alertas").show() ;
		   $("#msj_alertas").html(div);
		   $(".form input,select,textarea,button" )
		   .not("#eventos")
		   .not("#consultar_convocados")
		   .not("#filtros_oficina_ventas")
		   .not("#exportar_detallado")
		   .not("#exportar")
		   .not("#nav-profile-tab").attr("disabled",true)
		  return ;
	   }	   
	   
	   if(dias_dias_aereos<0){
		   ul+=`<li class="list-group-item table-danger text-danger p-0"><i class="fa fa-warning m-1"></i><span>Recuerda que ya no es posible confirmar clientes para tiquetes aéreos</span></li>`
	
	   }
	   if(dias_fin_terrestre<0){
		   ul+=`<li class="list-group-item table-danger text-danger p-0"><i class="fa fa-warning m-1"></i><span>Recuerda que ya no es posible confirmar clientes para tiquetes terrestre</span></li>`
	
	   }
	   ul+=`</ul>`

	 
	  if(dias_dias_aereos<=0 || dias_fin_terrestre<=0){
		 $("#msj_alertas").show()
		 $("#msj_alertas").html(ul);
	  }else{ console.log("hideeee")
		  $("#msj_alertas").hide() 
	  }
   	
}

/*
const buscarFechasLimitesTiquetes =(id)=>{
	
	const evento =eventosActivo.filter(item=> item.id==id)
	
	fecha_fin_terrestre =evento[0].fecha_fin_terrestre
	fecha_fin_aereo     =evento[0].fecha_fin_aereo
}*/

const listarEventosCierres=async (descripcion)=>{

	try{
		const data={
			link:url_api+'eventoscierre/search',
			descripcion
		}
		const respuesta = await enviarPeticion(data);
	
		let  p='<option value="0">No</option>';
		
		
		if(respuesta.length>0){
			respuesta.forEach(item=>{
				p+=`<option value="${item.ID}">${item.DESCRIPCION.toUpperCase()}</option>`   
			})
		}
		
		$("#id_evento_cierre").html(p);
		
	}catch(e){
		console.error(e)
	}

}


const busquedaCliente = async (org,dato)=>{
	
	try{
		return await enviarPeticion({
			link:url_api+'terceros/buscarporcriterios',
			org,
			criterio:dato,
			metodo:'GET'
		});		
	}catch(e){
		console.error(e)
	}

}

const validarCargaCliente =()=>{
	codigo_sap=$("#codigo_sap").val();
	sw=codigo_sap.length==0;
	HabilitarDeshabilitarForm(sw);
	validarViajero();
}

const HabilitarDeshabilitarForm=(sw)=>{
	
	$(".post-load-sap:not([id='busqueda'])").attr("disabled",sw)
	
	
	
	if(DiasFinAereo<0){
	     $("#viaja_aire").attr("disabled",true)
	 }
	if(DiasFinTerrestre<0){
	     $("#viaja_tierra").attr("disabled",true)
	 }
	
	 if(DiasFinAereo<0 && DiasFinTerrestre<0){
		$("#viaja_aire,#viaja_tierra,input[name='viajero']").attr("disabled",true)
     }
	
}

const validarViajero =()=>{
	/*
	if(DiasFinAereo<=0 && DiasFinTerrestre<=0){
	   $("input[name='viajero']").attr("disabled",true);
	   $("input[name='medio_transporte']").attr("disabled",true);
	   $("#nota_transporte").val("").attr("disabled",true); 
	   $("#tipo_transporte").val(1).attr("disabled",true); 
	   $("#email").attr("required",false);
	   return;
	}
	
	esViajero=$("input[name='viajero']:checked").val()
	
	if(esViajero=='0'){
	  $("input[name='medio_transporte']").attr("disabled",true)
	  $("#tipo_transporte").attr("disabled",true).val(1);
	  $("#nota_transporte").val("").attr("disabled",true); 
	}else{
	  $("input[name='medio_transporte']").attr("disabled",false);
	  $("#tipo_transporte").attr("disabled",false); 
	  $("#nota_transporte").val("").attr("disabled",true); 
	}
	
	if($("#tipo_transporte").val()==2){
		 $("#nota_transporte").attr("disabled",false);  
	}else{
		 $("#nota_transporte").attr("disabled",true);  
	}
	*/
}



const crearTablaViajeros =(npersonas,limpiar=0)=>{
	
 medio = $("input[name='medio_transporte']:checked").val();	

 if(limpiar==1){
	 $("#divTablaViajeros").html('');	
 }
 if(isNaN(parseInt(npersonas)) || npersonas==0 ){
	   $("#divTablaViajeros").html('');	
	   return ;
  }
	
  //valido si tiene datos la tabla	
  nFilas=$(".tabla-viajeros tbody tr").length;
  

  personasadd=npersonas-nFilas;	
	console.log({
		nFilas,npersonas,personasadd
	})
  //console.log(npersonas)
  let fechaActual = new Date();
  fechaActual.setDate(fechaActual.getDate());
  let fechaMinima = fechaActual.toISOString().split('T')[0];

  let tabla='';	

   if(nFilas==0){
	   
	  if(medio=='a'){
		tabla= `
 					<h4>Datos personales de los asistentes</h4>
				   <table class="table table-hover tabla-sm table-bordered tabla-viajeros table-responsive">
					 <thead class="bg-primary text-white">
					   <tr>
						<th>Cédula</th>
						<th>Nombres completos</th>
						<th>Fecha nacimiento</th>
						<th>Genero</th>
						<th>Fecha salida</th>
						<th>Fecha regreso</th>
						<th></th>
					   </tr>
					 </thead>
				   <tbody>`;	  
	   }else{
		tabla= `
 				<h4>Datos personales de los asistentes</h4>
				   <table class="table table-hover tabla-sm table-bordered tabla-viajeros table-responsive">
					 <thead class="bg-primary text-white">
					   <tr>
						<th>Cédula</th>
						<th>Nombres completos</th>
						<th>Genero</th>
						<th></th>
					   </tr>
					 </thead>
				   <tbody>`;	   
	   }

   	}
	
	//debo agregar 
	
	if(personasadd>0){
	  
      for (let i = 1; i <= personasadd; i += 1) {
		
		if(medio=='a'){
	    	tabla+=`<tr>
					<td style="display:none"></td>
					<td><input class="form-control form-control-sm" size="11" minlength="5" maxlength="11"  value="" onkeypress="return vnumeros(event)" required name="cedula"></td>
					<td><input class="form-control form-control-sm" value="" required minlength="10" maxlength="50" name="nombres" ></td>
					<td><input class="form-control form-control-sm" value="" size="10" type="date" required name="fecha_n" ></td>
					<td>
   						<select class="form-select form-select-sm" name="genero" required>
							<option value="F">Femenino</option>
							<option value="M">Masculino</option>
							<option value="O">Otro</option>
						</select>
					</td>
					<td><input class="form-control form-control-sm" value="" name="fecha_s" min="${fechaMinima}" size="10" type="date" required onchange="establecerFechaMinima(this)"></td>
					<td><input class="form-control form-control-sm fecha_regreso" name="fecha_r" value="" min="${fechaMinima}" size="10" type="date" required></td> `;
			//`<td><button class="btn btn-sm btn-danger" onclick="eliminarAsistente(this,0)"><i class="fa-regular fa-trash-can"></i></button></td>`
			if(i>1 || nFilas>0){
			   tabla+=`<td><button class="btn btn-sm btn-danger" onclick="eliminarAsistente(this,0)"><i class="fa-regular fa-trash-can"></i></button></td>`;
			 }
			
			
			 tabla+=`</tr>`	 
		}else{
	    	tabla+=`<tr>
					<td style="display:none"></td>
					<td><input class="form-control form-control-sm" size="11" minlength="5" maxlength="11"  value="" onkeypress="return vnumeros(event)" required name="cedula"></td>
					<td><input class="form-control form-control-sm" value="" required minlength="10" maxlength="50" name="nombres" ></td>
					<td>
   						<select class="form-select form-select-sm" name="genero" required>
							<option value="F">Femenino</option>
							<option value="M">Masculino</option>
							<option value="O">Otro</option>
						</select>
					</td>`;
			if(i>1 || nFilas>0){
			   tabla+=`<td><button class="btn btn-sm btn-danger" onclick="eliminarAsistente(this,0)"><i class="fa-regular fa-trash-can"></i></button></td>`;
			 }
			
			tabla+=`
				</tr>`
		}

	}
	

	 if(nFilas==0){
		 tabla+=`</tbody>
			</table>`
		 $("#divTablaViajeros").html(tabla);
		 return ;
	 }
	 $(".tabla-viajeros tbody").append(tabla);
		
	}else{
		//
		 $(".tabla-viajeros tr:gt("+(npersonas)+")").remove();
	}
	
/*
	
	if(nFilas>0){
	   $(".tabla-viajeros").append(tabla);
	}else{
		$("#divTablaViajeros").html(tabla);
	}*/
	
}


function establecerFechaMinima(ob) {
  // Obtener la fecha actual y agregar un día para establecer la fecha mínima
  var fechaActual = new Date();
  fechaActual.setDate(fechaActual.getDate());

  // Formatear la fecha mínima como YYYY-MM-DD (el formato requerido para el campo de entrada de tipo date)
  var fechaMinima = fechaActual.toISOString().split('T')[0];

  td = $(ob).parent()
	
  next_input =td.next().find("input");
  $(next_input).attr("min","")
  $(next_input).attr("min",fechaMinima)
}

const validacionDiasRestantesTiquetes=()=>{
	
	esViajero=$("input[name='viajero']:checked").val()
	if(esViajero=='0'){
	  $("input[name='medio_transporte']").attr("disabled",true)
	  $("#tipo_transporte").attr("disabled",true).val(1);
	  $("#nota_transporte").val("0").attr("disabled",true);
	  $("#email").attr("required",false)
	  return ;
	}
	if(DiasFinTerrestre<0 || DiasFinAereo<0 ){ console.log("bloquea todo trasporte")
	   $("input[name='medio_transporte']").attr("disabled",true)
	 }
	if(DiasFinTerrestre<0){
	   $("#viaja_aire").attr({"checked":true})
	   $("#tipo_transporte").val(1).attr("disabled",true);
	   $("#nota_transporte").val("0").attr("disabled",true);
	   $("#email").attr("required",true)
	}
	if(DiasFinAereo<0){
	   $("#viaja_tierra").attr({"checked":true});
	   $("#tipo_transporte").val(1).attr("disabled",false);
	   $("#nota_transporte").val("0").attr("disabled",false);
	}	
	
	
}

const validarSesion =()=>{
	
	if(isNaN(parseInt($("#usuario_id").val())) ){
	   $("body").html(`<br><br>
			<div class="alert alert-danger container p-5" role="alert">
			  <h4 class="alert-heading">Lo sentimos!</h4>
			  <p>Al parecer la sesión del navegador ha caducado.</p>
			  <hr>
			  <p class="mb-0">Por favor, sal y vuelve a ingresar a ADG.<a href="Login.php">Iniciar sesión</a></p>
			</div>`)
	}
}



const guardarDatosViajeros= (id_data_pri)=>{
		
  if($("#divTablaViajeros").html()!='' ){

	try{
			medio= $("input[name='medio_transporte']:checked").val();
		
			if( isNaN( parseInt($("#npersonas").val()) )){
				throw('Se debe digitar la cantidad de personas') 
			}
			
			$("#divTablaViajeros table tr:gt(0)").each(function(item,idx){
				
				if(medio=='a'){
					id		=$.trim($(this).find("td").eq(0).html());
					cedula  =$.trim($(this).find("td").eq(1).find("input").val());
					nombres =$.trim($(this).find("td").eq(2).find("input").val());
					fecha_n =$.trim($(this).find("td").eq(3).find("input").val());
					genero  =$.trim($(this).find("td").eq(4).find("select option:selected").val());
					fecha_s =$.trim($(this).find("td").eq(5).find("input").val());
					fecha_r =$.trim($(this).find("td").eq(6).find("input").val());

					if(id>0){
					link =url_api+'clientesviajeros/editar'
					}else{
						link =url_api+'clientesviajeros/create'
					}

					d={
						id,
						id_data_pri,
						cedula,
						nombres,
						fecha_n,
						genero,
						fecha_s,
						fecha_r,
						link
					}
					console.log({
						d
					})
					enviarPeticion(d);	
				}else{
					id  =$.trim($(this).find("td").eq(0).html());
					cedula  =$.trim($(this).find("td").eq(1).find("input").val());
					nombres =$.trim($(this).find("td").eq(2).find("input").val());
					fecha_n ='01-01-1900';
					genero  =$.trim($(this).find("td").eq(3).find("select option:selected").val());
					fecha_s ='01-01-1900';
					fecha_r ='01-01-1900';

					if(id>0){
					link =url_api+'clientesviajeros/editar'
					}else{
						link =url_api+'clientesviajeros/create'
					}

					d={
						id,
						id_data_pri,
						cedula,
						nombres,
						fecha_n,
						genero,
						fecha_s,
						fecha_r,
						link
					}
					enviarPeticion(d);		
				}

			})	
	}catch(e){
		console.error(e)
	}
  
  }
}


const eliminarEvento=async (id)=>{
	
	data={
		link :url_api+'eventoscomerciales/delete',
		id
	}
	
    resp =await enviarPeticion(data);
	
	if(resp.ok>0){
	   $("#id_confirmado").val(0);
	}
	
}

const limpiarCampos =()=>{
	
	$("#id_confirmado").val(0);
	$("#busqueda").val("");
	$("#codigo_sap").val("");
	$("#cliente").val("");
	$("#npersonas").val("1");
	$("#telefono").val("");
	$("#presupuesto").val("0");
	$("#divTablaViajeros").html('');
	$("#btnradio2").attr("checked",true);
	$("#departamentos").val("");
	$("#ciudades").val("");
	$("#viaja_tierra").attr("checked",true);
	$("#tipo_transporte").val(0).attr("disabled",true);
	$("#nota_transporte").val(0).attr("disabled",true);
	$("#email").val("");
	$("#id_evento_cierre").val("0");
	$("#observacion").val("");
	$("#habitacion").val(0);
	form.classList.remove("was-validated");
	vlr_hab=0;
	$("#tmp").val("");
}

const listarZonasVentas =async ()=>{
	
	try{
		data={
			link 	:url_api+'datosmaestros/zonasventas',
			rol	 	:$("#rol_ses").val(),
			usuario :$("#usuario_id").val(),
			org     :$("#org_ses").val(),
			metodo:'GET'
		}

		resp =await enviarPeticion(data);

		if(resp.length==0){
			return ;
		}
		p='<option value="">Todas</option>';
		resp.forEach(zona=>{
			p+=`<option value="${zona.zona_ventas}">${zona.zona_ventas}-${zona.zona_descripcion}</option>`;
		});
		$("#zonas_ventas").html(p);	
	
	}catch(e){
		console.error(e)
	}

}

const listarOficinasVentas=async ()=>{
	
	try{
		data={
			link 	:url_api+'datosmaestros/oficinas',
			rol	 	:$("#rol_ses").val(),
			usuario :$("#usuario_id").val(),
			org     :$("#org_ses").val(),
			metodo:'GET'
		}
		
		resp =await enviarPeticion(data);

		
		if(resp.length==0){
			return ;
		}
		p='<option value="">Todas</option>';
		resp.forEach(oficina=>{
			p+=`<option value="${oficina.oficina_ventas}">${oficina.oficina_ventas}-${oficina.descripcion}</option>`;
		});
		$("#filtros_oficina_ventas").html(p);	
		
	}catch(e){
		console.error(e)
	}

}

const subirTiquete=async (input,id)=>{
	console.log({
		input,id
	})
	try{
		
		valor_tiquete= prompt('Digite el valor del tiquete');
		
		if(isNaN(parseInt(valor_tiquete)) || valor_tiquete==0){
			$(input).val('')
		  return;   
		}
		
		showLoadingSwalAlert2('Subiendo archivo',false)
		$(".swal2-title").html('<span><i class="fa-solid fa-cloud-arrow-up fa-flip m-1"></i> Subiendo archivo adjunto</span>'); 
		//let inputFileImage = document.getElementById('archivo');
		
		setTimeout(async function(){
			let archivo = input.files[0];

			UploadFile=await   subirArchivos(archivo,{ 
											validateSize:false,
											maxSize:0, 
											validateExt:false,
											typesFile:{},
											ruta:'/web/convocatoriaeventos/tiquetes'
								}, 
								params={nuevo_nombre:'tiquete-aereo-'+id} )

			NombreArchivo ='tiquete-aereo-'+id;
			
			if(UploadFile.ok){
			   await enviarPeticion({
				 nombre:UploadFile.nombre_archivo,
				 id,
				 valor_tiquete,
				 link	: url_api+'clientesconvocatoria/updatenamefile',
			   });   
				
			   $(input).parent().html(`
				  <a class="btn btn-sm btn-outline-secodnary" download target="_blank" href="${UploadFile.archivo}"><i class="fa-solid fa-file-pdf text-danger"></i></a>
				  <button class="btn btn-sm btn-ligth" onclick="eliminarAdjunto(${id},'${UploadFile.nombre_archivo}',this)"><i class="fa-solid fa-xmark text-danger m-1"></i></button>
				`);
			   $(input).remove();
			    
			}
			dissminSwal();	
			clientesConfirmados();
		},1000)
		
	}catch(e){
		console.error(e)
		dissminSwal();
	}

}

const eliminarAdjunto=async (id,ruta,ob)=>{
	
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success m-1",
    cancelButton: "btn btn-danger m-1"
  },
  buttonsStyling: false
});
swalWithBootstrapButtons.fire({
  title: "¿Estás seguro que deseas eliminar el archivo?",
  text: "Esta acción eliminará el archivo de forma permanente!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Si, eliminarlo!",
  cancelButtonText: "No, cancelar!",
  reverseButtons: true
}).then(async (result) => {
  if (result.value) {
      //acualizo el campo tiquete 
	  
	  try{
		  
	  resp1=await enviarPeticion({
			link	: url_api+'clientesconvocatoria/eliminartiquete',
			id  
	  })

	  if(resp1.ok){
		    del=await enviarPeticion({
				 link :'../models/ServiceDeleteFtp.php',
				 ruta :ruta
			 });

		    if(del.ok){
			  Swal.fire("Ok","Se elimino correctamente el registro ","success")   
			}else{
				Swal.fire("Ups","No se puedo eliminar el archivo","error")   
			}
		  
		   $(ob).parent().html(`
			<input type="file" onchange="subirTiquete(this,${id})" class="form-file" >
			`);
	   }else{
		   Swal.fire("Ups","No se puedo actualziar el registro","error")   
	   }
	  clientesConfirmados();	  
		  
	  }catch(e){
		  console.error(e)
	  }

  } else if (
    /* Read more about handling dismissals below */
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire({
      title: "Cnacelado",
      text: "No se hicieron cambios",
      icon: "error"
    });
  }
});
}

const mostrarDetalle=async (id)=>{
	
	$("#tipo_habitacion_modal").text('');
	$("#icon_tipo_habitacion_modal").html('');
	$("#list_viajeros_modal").html('')
	$("#medio_transporte_modal").text('');
	$("#icon_medio_transporte_modal").html('');
	$("#presupuesto_modal").text("");
	$("#email_modal").text('');
	
	
	try{
		const data={
			link	: url_api+'clientesconvocatoria/clientesconfirmadosdet',
			id   
		}

		resp= await enviarPeticion(data);
		
		general = resp.generales[0];
		medio_transporte=$.trim(general.medio_transporte);
		
		if(general.habitacion!=0){
		    if(general.habitacion==1){
			   $("#tipo_habitacion_modal").text("Habitación sencilla")
			   $("#icon_tipo_habitacion_modal").html(` 
				  <i class="fa-solid fa-bed text-primary m-1 fa-2x"></i>
				`);
			}else{
				$("#tipo_habitacion_modal").text("Habitación doble")
				$("#icon_tipo_habitacion_modal").html(`
				  <i class="fa-solid fa-bed text-primary m-1 fa-2x"></i>
				  <i class="fa-solid fa-bed text-primary m-1 fa-2x"></i>
				`);
			}
		}else{
			$("#tipo_habitacion_modal").text("No necesita hotel")
		    $("#icon_tipo_habitacion_modal").html(`
				 <i class="fa-regular fa-handshake text-primary m-1 fa-2x"></i>
				`);
		}
		
		$("#presupuesto_modal").text(formatNumberES(general.presupuesto),0,'');
		$("#email_modal").text(general.email);		
		$("#obs_modal").val("");
		$("#obs_modal").val(general.obs);
		
		if(general.viajero=='1'){
		  
			if(medio_transporte=='a'){
				   $("#medio_transporte_modal").text("Aereo")
				   $("#icon_medio_transporte_modal").html(`
					  <i class="fa-solid fa-plane text-primary m-1 fa-2x"></i>
					`);
			}else{
				   $("#medio_transporte_modal").text("Terrestre")
				   $("#icon_medio_transporte_modal").html(`
					  <i class="fa-solid fa-bus text-primary m-1 fa-2x"></i>
					`);	
			}
			
		viajeros=resp.viajeros;
		
		if(viajeros.length>0){
			
			if(medio_transporte=='t'){
				tb =`<table class="table table-sm">
						<thead>
							<tr>
								<th>Cédula</th>
								<th>Nombres</th>
								<th>Genero</th>
							</tr>
						</thead>
						<tbody>`
			}else{
			 tb =`<table class="table table-sm">
					<thead>
						<tr>
							<th>Cédula</th>
							<th>Nombres</th>
							<th>Fecha de nacimiento</th>
							<th>Genero</th>
							<th>Fecha salida</th>
							<th>Fecha regreso</th>
							<th></th>
						</tr>
					</thead>
					<tbody>`
			   }

			viajeros.forEach(item=>{
			   	
			   genero = item.genero =='m' ? 'Masculino':'Femenino';
			   
			   if(medio_transporte=='a'){
				  tb+=`<tr>
						<td>${item.cedula}</td>
						<td>${item.nombres}</td>
						<td>${item.fecha_n}</td>
						<td>${genero}</td>
						<td>${item.fecha_s}</td>
						<td>${item.fecha_r}</td>`;
				   
				   if(item.tiquete!=''){
						 tb+=`<td>  
							<a class="btn btn-sm btn-outline-secodnary" download target="_blank" href="https://app.pwmultiroma.com${item.tiquete}"><i class="fa-solid fa-file-pdf text-danger"></i></a>`;
					   if($("#rol_ses").val()!=1  && $("#rol_ses").val()!=6 && $("#rol_ses").val()!=118 ){
						 tb+=`<td></td>`;
					   }else{
					     tb+=`
							<button class="btn btn-sm btn-ligth" onclick="eliminarAdjunto(${item.id},'${item.tique}',this)"><i class="fa-solid fa-xmark text-danger m-1"></i></button></td>`;						   
					   }

					}else{
						if($("#rol_ses").val()==1  || $("#rol_ses").val()==6 || $("#rol_ses").val()==118 ){
							tb+=`<td><input type="file" onchange="subirTiquete(this,${item.id})" class="form-file" ></td>`;
						}else{
							tb+=`<td></td>`;
						}
						
					}
				   
				   tb+=`</tr>`
			   }else{
					  tb+=`<tr>
						<td>${item.cedula}</td>
						<td>${item.nombres}</td>
						<td>${genero}</td>
					   </tr>` 
			   }
			})//foreach
			
			tb+=`</tbody>
				</table>`
			$("#list_viajeros_modal").html(tb)
		}//if(general.viajero=='1'){
		
		
	  }else{
		  	$("#medio_transporte_modal").text("No es viajero")
			 $("#icon_medio_transporte_modal").html(`
				<i class="fa-regular fa-face-smile text-primary m-1 fa-2x"></i>
	
			 `);
	  }

	  $("#modal_det_convocado").modal("show")		
	}catch(e){
		console.error(e)
	}

}

const EliminarClienteConfirmado =(id)=>{
	
	const swalWithBootstrapButtons = Swal.mixin({
	  customClass: {
		confirmButton: "btn btn-success m-1",
		cancelButton: "btn btn-danger m-1"
	  },
	  buttonsStyling: false
	});
swalWithBootstrapButtons.fire({
  title: "¿Estás seguro que deseas eliminar este cliente de los confirmados?",
  text: "Esta acción no se puede deshacer!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Si, eliminarlo!",
  cancelButtonText: "No, cancelar!",
  reverseButtons: true
}).then(async (result) => {
  if (result.value) {
      //acualizo el campo tiquete 
	  try{
		  
		 resp=await enviarPeticion({
			id,
			link	: url_api+'clientesconvocatoria/eliminarconfirmado',
		 })
	     if(resp.ok){
			 Swal.fire("Ok","Se elimino correctamente el registro","success");
			 //
	     }else{
			 Swal.fire("Error","No se puedo eliminar el cliente","error");
		 }	
		  clientesConfirmados();	
	  }catch(e){
		  console.error(e)
	  }

  } else if (
    /* Read more about handling dismissals below */
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire({
      title: "Cnacelado",
      text: "No se hicieron cambios",
      icon: "error"
    });
  }
});
	
}

const aprobarCompra =(id)=>{

	Swal.fire({
		title: "Autorizo la compra de tiquetes aereos",
		input: "text",
		inputAttributes: {
		  autocapitalize: "off",
		  placeholder:'Observacion'
		},
		showCancelButton: true,
		confirmButtonText: "Autorizar",
		cancelButtonText: "No autorizar", // Cambio del nombre del botón Cancelar
		showLoaderOnConfirm: true,
		preConfirm: async (login) => {
		  try {
		
			const response = await enviarPeticion({
				link	: url_api+'clientesconvocatoria/aprobarcompraticket',
				id
			});
			if (!response.ok) {
				Swal.fire("Error","No se puedo aprobar","error")
			}
			
			Swal.fire("Ok","Aprobado","success")

		  } catch (error) {
			Swal.showValidationMessage(`
			  Request failed: ${error}
			`);
		  }
		},
		allowOutsideClick: () => !Swal.isLoading()
	  }).then((result) => {
		if (result.isConfirmed) {
		  Swal.fire({
			title: `${result.value.login}'s avatar`,
			imageUrl: result.value.avatar_url
		  });
		}
	  });


}

//funciones de consultas 
const clientesConfirmados =async ()=>{
	
	$("#result_convocados").html('');
	$("#n_terrestres_modal").val(0);
	$("#n_aereos_modal").val(0);
	$("#p_valor_tiquetes_modal").val( formatNumberES(0,0,'') )
	$("#datos_por_oficina").html('')
	$("#zonas_sin_confirmados").html('')	
	
	try{
		data={
			link	: url_api+'clientesconvocatoria/clientesconfirmados',
			filtro	:$("#filtro").val(),
			rol		:$("#rol_ses").val(),
			org		:$("#org_ses").val(),
			oficina	:$("#filtros_oficina_ventas").val(),
			usuario :$("#usuario_id").val(),
			medio_transporte:$("#filtros_medio_transporte").val(),
			evento :$("#eventos").val()
		}

		showLoadingSwalAlert2('Consultando informacion',false);
		resp 		= await enviarPeticion(data);
		respuesta	= resp.respuesta;
		resumen 	= resp.resumen;
		datos_zonas = resp.datos_zonas;
		zona_ 		= $("#filtros_oficina_ventas").val().substring(0,2);
		datos_zonas	=  datos_zonas.filter(item=> item.zona_ventas.substring(0,2)==zona_ );
		
		
		if(respuesta.length==0){
		  $("#result_convocados").html(`
				<div class="alert alert-warning d-flex align-items-center" role="alert">
				<i class="fa-solid fa-triangle-exclamation"></i>
				  <div>
					Sin resultados!
				  </div>
				</div>
			`);  
			dissminSwal();
			return ;
		}
		
		tabla=`<table class="table table-sm datos-convocados" id="datos-convocados">
				  <thead class="table-primary text-dark">
					<tr>
						<th>Codigo sap</th>
						<th>Oficina</th>
						<th>Cliente</th>
						<th>Ciudad</th>
						<th>Presupuesto</th>
						<th>Vendedor</th>
						<th>Televendedor</th>
						<th>Medio t.</th>
						<th>Valor tiquetes.</th>
						<th>N° tiquetes</th>
						<th>N° personas</th>
						<th>Info</th>
						<th></th>
						<th></th>
						<th></th>
					  </tr>
					</thead>
			<tbody>`
		
		n_terrestres = 0;
		n_aereos 	 = 0;
		valor_total_tiquetes =0;
		n_no_viajeros_modal=0;
		respuesta.forEach(item=>{
			
		 medio_='<span class="badge bg-secondary">No viajero</span>'
		 
			if(item.viajero=='1'){
				if(item.medio=='Terrestre'){
				   n_terrestres=n_terrestres+1;
				 }else if(item.medio=='Aereo'){
					 n_aereos=n_aereos+1;
				 }

				valor_total_tiquetes=valor_total_tiquetes+parseFloat(item.valor_tiquetes);
				medio_= item.medio =='Terrestre' ? '<span class="badge bg-success">Terrestre</span>'  :'<span class="badge bg-danger">Aereo</span>' ;
			 }else{
				n_no_viajeros_modal=n_no_viajeros_modal+1;
			 }
			 flash=""
			 if(item.obs!=''){
				flash="fa-beat text-danger";
			 }

			tabla+=`<tr>
						<td>${item.codigo_sap}</td>
						<td>${item.oficina_ventas}</td>
						<td>${item.nombres} <br><small class="text-primary">${item.razon_comercial}</small></td>
						<td>${item.ciudad}</td>
						<td>${formatNumberES(item.presupuesto,0,'$')}</td>
						<td>${item.vendedor}</td>
						<td>${item.televendedor}</td>
						<td class="text-center">${medio_}</td>
						<td class="text-right"><b>${formatNumberES(item.valor_tiquetes,0,'$')}</b></td>
						<td class="text-center">${item.n_tiquetes}</td>
						<td class="text-center"><span class="badge bg-dark">${item.n_personas}</span></td>
						<td><button class="btn btn-sm btn-ligth"  onclick="mostrarDetalle(${item.id})"><i class="fa-solid fa-circle-info text-primary ${flash}"></i></button></td>`;
				
			if(($("#rol_ses").val()==1 
			|| $("#rol_ses").val()==6 
			|| $("#rol_ses").val()==118
			|| $("#rol_ses").val()==14
			|| $("#rol_ses").val()==12)
			){
			   tabla+=`<td><button class="btn btn-sm btn-ligth"  onclick="EliminarClienteConfirmado(${item.id})">
								<i class="fa-regular fa-trash-can text-danger"></i>
							</button>
						</td>`
			}
			tabla+=`<td></td>`;

			if($("#rol_ses").val()==1 || $("#rol_ses").val()==3){

				if(item.medio=='Aereo'){
					tabla+=`<td><button onclick="aprobarCompra(${item.id})" class="btn btn-sm btn-outline-success"><i class="fa-regular fa-thumbs-up"></i></button></td>`
				}else{
					tabla+=`<td></td>`
				}
				
			}else{
				tabla+=`<td></td>`
			}

			tabla+=`</tr>`
		})
		tabla+=`</tbody>
				</table>`
		
		$("#result_convocados").html(tabla);
		$("#n_terrestres_modal").val(n_terrestres);
		$("#n_aereos_modal").val(n_aereos);
		$("#n_no_viajeros_modal").val(n_no_viajeros_modal);
		$("#p_valor_tiquetes_modal").val( formatNumberES(valor_total_tiquetes,0,'$') )
		//datos por oficinas
		tabla2=`<table class="table table-sm">
				 <thead>
					<tr>
						<th>Oficina</th>
						<th>Confirmados</th>
						<th>Pre.</th>
						<th>Per.</th>
					</tr>
				  </thead>
			<tbody>`
		
		confirmados=0;
		total_presupuesto=0;

		resumen.forEach(item=>{
			confirmados=confirmados+parseInt(item.n);
			total_presupuesto=total_presupuesto+parseInt(item.presupuesto)
			tabla2+=`<tr>
						<td>${item.oficina_ventas}</td>
						<td>${item.n}</td>
						<td>${formatNumberES(item.presupuesto,0,'$')}</td>
						<td>${item.presonas}</td>
					 </tr>`
		})
		tabla2+=`<tr>
					<td></td>
					<td>${confirmados}</td>
					<td>${formatNumberES(total_presupuesto,0,'$')}</td>
				 </tr>`
		
		tabla2+=`</tbody>
				</table>`
		$("#datos_por_oficina").html(tabla2);
		
		//datos zonas
		
		zonas_sin_confirmar =datos_zonas.filter(item=>item.clientes>0)
		ul='<ul>';
		zonas_sin_confirmar.forEach(zona=>{
		 ul+=`<li><span class="badge alert-danger">${zona.clientes}</span> ${zona.zona_ventas}-${zona.zona_descripcion} </li>`	
		})
		ul+=`</ul>`
		$("#zonas_sin_confirmados").html(ul);
		dissminSwal();
		console.log(resp)
	}catch(e){
		console.error(e);
		dissminSwal();
	}

}

const validarFilasViajeros =()=>{

	if($("#id_confirmado").val()>0){
	   nFilas=$(".tabla-viajeros tbody tr").length;
	  if(nFilas==0){
		  
		  enviarPeticion({
			  id_data_pri:$("#id_confirmado").val(),
			  link :url_api+'clientesviajeros/resetdateviejero'
		  })
		  .then(resp=>{ 
			  console.log({resp})
			  if(resp.ok){
				  $("#btnradio2").attr("checked",true);
				  $("#divTablaViajeros").html('');	
				  $("input[name='medio_transporte']").val('t')
				  $("input[name='vieajero']").val('0')
				  $("#habitacion").val("0");				 
			   }else{
				   Swal.fire("Error","No se pudo actualizar la informacion","error")
			   }
		  })
		  .catch(e=>{
			  console.error(e)
		  })

		return ; 
	 }
    }
}

const eliminarAsistente=(obj,id,id_data_pri)=>{

	if(id>0){
	   
	 const swalWithBootstrapButtons = Swal.mixin({
	  	customClass: {
		confirmButton: "btn btn-success m-1",
		cancelButton: "btn btn-danger m-1"
	   },
	   buttonsStyling: false
	 });
		swalWithBootstrapButtons.fire({
		  title: "¿Estás seguro que deseas eliminar este cliente de los confirmados?",
		  text: "Esta acción no se puede deshacer!",
		  icon: "warning",
		  showCancelButton: true,
		  confirmButtonText: "Si, eliminarlo!",
		  cancelButtonText: "No, cancelar!",
		  reverseButtons: true
		}).then(async (result) => {
		  if (result.value) {
			  //acualizo el campo tiquete 
			  try{

				 resp=await enviarPeticion({
					id,
					link	: url_api+'clientesviajeros/eliminarviajero',
					id_data_pri 
				 })
		
				 if(resp.ok){
					 
					Swal.fire("Ok","Se elimino correctamente el registro","success");
					$(obj).parent().parent().remove();
					nFilas= $("#divTablaViajeros tbody tr").length;
					
					if(nFilas==0){
					  // 
					  crearTablaViajeros($("#npersonas").val(),1)
					}
					 
					//validarFilasViajeros();
				 }else{
					 Swal.fire("Error","No se puedo eliminar el cliente","error");
				 }	
				  	
			  }catch(e){
				  console.error(e)
			  }

		  } else if (
			/* Read more about handling dismissals below */
			result.dismiss === Swal.DismissReason.cancel
		  ) {
			swalWithBootstrapButtons.fire({
			  title: "Cnacelado",
			  text: "No se hicieron cambios",
			  icon: "error"
			});
		  }
		});		
		
		
	}else{
		$(obj).parent().parent().remove();
		nFilas=$(".tabla-viajeros tbody tr").length;
		
		if(nFilas==0){
		   $("#npersonas").val(1);
		   $("#divTablaViajeros").html('');	
		   return ; 
		}
		
		$("#npersonas").val(nFilas);
	}

}


const cargarClienteRegistrado =async (codigo_sap,evento)=>{
	
	limpiarCampos();
	const data={
		link	: url_api+'clientesconvocatoria/dataconfirmados', 
		codigo_sap,
		evento
	}
	resp =await enviarPeticion(data);
	
	data_cliente=resp.datos_cliente[0];
	data_viajero=resp.viajeros;
	generos = [{genero:'F',descripcion:'Femenino' },{genero:'M',descripcion:'Masculino' },{genero:'O',descripcion:'Otro' }]
	
	
    $("#id_confirmado").val(data_cliente.id);
	$("#codigo_sap").val(data_cliente.codigo_sap);
	validarCargaCliente()
	$("#busqueda").val(data_cliente.codigo_sap+' '+data_cliente.cliente);
	$("#cliente").val(data_cliente.cliente);
	$("#npersonas").val(data_cliente.npersonas);
	$("#telefono").val(data_cliente.telefono);
	$("#presupuesto").val( formatNumberES( data_cliente.presupuesto,0,'$'));
		
	if(data_cliente.viajero!='0'){ //es viajero
		console.log(data_cliente)
		
		  $("#btnradio1").attr("checked",true);
		  
		  $("input[name='medio_transporte']").attr("disabled",false);
		  
		   if(data_cliente.medio_transporte=='a'){
			  $("#viaja_aire").attr("checked",true);
			  if(DiasFinAereo<0){
				 $("#viaja_aire").attr("disabled",true);
			  }
		   }
		   if(data_cliente.medio_transporte=='t'){
			  $("#viaja_tierra").attr("checked",true);
			  if(DiasFinTerrestre<0){
				 $("#viaja_tierra").attr("disabled",true);
			  }
		   }
		
		   if(DiasFinAereo<0 && DiasFinTerrestre<0){
			  $("#viaja_tierra,#viaja_aire").attr("disabled",true);
		   }
		   
	   }else{
		  // $("input[name='medio_transporte']").attr("disabled",true);
		   $("#btnradio2").prop("checked",true);
	   }
		
	   $("#departamentos").val(data_cliente.departamento);
	   $("#departamentos").trigger("change");
	   setTimeout(function(){
		  $("#ciudades").val(data_cliente.ciudad);
	   },200)


	   $("#tipo_transporte").val(data_cliente.tipo_transporte);
	   $("#nota_transporte").val(formatNumberES(data_cliente.nota_transporte,0,'$'));
	   $("#habitacion").val(data_cliente.habitacion);
	   $("#email").val(data_cliente.email);
	   $("#id_evento_cierre").val(data_cliente.id_evento_cierre);
	   $("#observacion").val(data_cliente.observacion);
	   $("#id_confirmado").val(data_cliente.id);
	
	if($("#tipo_transporte").val()=='1'){//por la empresa
	   //bloquea nota
		 $("#nota_transporte").attr("disabled",true);
	}else{
		$("#nota_transporte").attr("disabled",false);
	}

	if(data_viajero.length>0){
	   /*
	   	  if(medio=='a'){
		tabla= `
 				<h4>Datos personales de los asistentes</h4>
				   <table class="table table-hover tabla-sm table-bordered tabla-viajeros table-responsive">
					 <thead class="bg-primary text-white">
					   <tr>
						<th>Cédula</th>
						<th>Nombres completos</th>
						<th>Fecha nacimiento</th>
						<th>Genero</th>
						<th>Fecha salida</th>
						<th>Fecha regreso</th>
						<th></th>
					   </tr>
					 </thead>
				   <tbody>`;	  
	   }else{
		tabla= `
 				<h4>Datos personales de los asistentes</h4>
				   <table class="table table-hover tabla-sm table-bordered tabla-viajeros table-responsive">
					 <thead class="bg-primary text-white">
					   <tr>
						<th>Cédula</th>
						<th>Nombres completos</th>
						<th>Genero</th>
						<th></th>
					   </tr>
					 </thead>
				   <tbody>`;	   
	   }*/ 
		if(data_cliente.medio_transporte=='a'){
			tabla= `
 				   <h5 class="text-center">Datos personales de los asistentes</h5>
				   <table class="table table-hover tabla-sm table-bordered tabla-viajeros table-responsive">
					 <thead class="bg-primary text-white">
					   <tr>
						<th>Cédula</th>
						<th>Nombres completos</th>
						<th>Fecha nacimiento</th>
						<th>Genero</th>
						<th>Fecha salida</th>
						<th>Fecha regreso</th>
						<th></th>
						<th></th>
						<th></th>
					   </tr>
					 </thead>
				   <tbody>`;
		}
		
		if(data_cliente.medio_transporte=='t'){
		  tabla= `
 				   <h5 class="text-center">Datos personales de los asistentes</h5>
				   <table class="table table-hover tabla-sm table-bordered tabla-viajeros table-responsive">
					 <thead class="bg-primary text-white">
					   <tr>
						<th>Cédula</th>
						<th>Nombres completos</th>
						<th>Genero</th>
						<th></th>	
						<th></th>
						<th></th>
					   </tr>
					 </thead>
				   <tbody>`; 
		}
	
	  data_viajero.forEach(item=>{
		  p='';
		  generos.forEach(sexo=>{
			  selected =  sexo.genero==item.genero ? 'selected':'';
			  p+=`<option value="${sexo.genero}" ${selected} >${sexo.descripcion}</option>`  
		  })
			  disabled='';
			  if(item.tiquete!=''){
			  	disabled='disabled';
			  }		  
		  
		  if(data_cliente.medio_transporte=='a'){

		   tabla+=`<tr>
					<td style="display:none">${item.id}</td>
					<td>
						<input 
							class="form-control form-control-sm" 
							size="11" 
							minlength="5" 
							maxlength="11" 
							${disabled}
							value="${item.cedula}" 
							onkeypress="return vnumeros(event)" 
							required name="cedula">
					</td>
					<td>
						<input 
							class="form-control form-control-sm" 
							value="${item.nombres}" 
							required
							${disabled}
							minlength="10" 
							maxlength="50" 
							name="nombres" >
					</td>
					<td>
						<input 
							class="form-control form-control-sm" 
							value="${item.fecha_n}" 
							${disabled}
							size="10" 
							type="date" 
							required 
							name="fecha_n" >
					</td>
					<td>
   						<select class="form-select form-select-sm" name="genero" ${disabled} required>
							${p}
						</select>
					</td>
					<td>
						<input 
							class="form-control form-control-sm" 
							value="${item.fecha_s}" 
							name="fecha_s"
							size="10" 
							type="date"
							${disabled}
							required 
							onchange="establecerFechaMinima(this)">
					</td>
					<td>
						<input 
							class="form-control form-control-sm fecha_regreso" 
							name="fecha_r" 
							value="${item.fecha_r}" 
							${disabled}
							size="10" 
							type="date" 
							required>
					</td>
					<td>
						<button class="btn btn-sm btn-danger"
								${disabled}
								onclick="eliminarAsistente(this,${item.id},${data_cliente.id})">
							  <i class="fa-regular fa-trash-can"></i>
							</button>
					</td>`;
			  
			  if(item.tiquete!=''){
				 
				 tabla+=`
						 <td>${formatNumberES(item.valor_tiquete,0,'$')}</td>
				         <td><a 
								class="btn btn-sm btn-outline-secodnary" 
								download target="_blank" 
								href="https://app.pwmultiroma.com${item.tiquete}"><i class="fa-solid fa-file-pdf text-danger"></i>
							 </a>
						 </td>`
			  }
			  tabla+=`</tr>`	 
		  }else if($.trim(data_cliente.medio_transporte)=='t'){
	    	tabla+=`<tr>
					<td style="display:none">${item.id}</td>
					<td>
						<input class="form-control form-control-sm" 
						size="15" 
						minlength="5" 
						maxlength="11" 
						value="${item.cedula}" 
						onkeypress="return vnumeros(event)" 
						required 
						name="cedula">
					</td>
					<td>
						<input 
							class="form-control form-control-sm" 
							value="${item.nombres}" 
							required 
							minlength="10" 
							maxlength="50" 
							name="nombres" >
					</td>
					<td>
   						<select class="form-select form-select-sm" name="genero" required>
							${p}
						</select>
					</td>
					<td>
						<button 
							${disabled}
							class="btn btn-sm btn-danger" 
							onclick="eliminarAsistente(this,${item.id},${data_cliente.id})">
							<i class="fa-regular fa-trash-can"></i>
						</button>
					</td>
				</tr>`  
		  }
		
	  })
	  $("#divTablaViajeros").html(tabla);
		
	   //bloqueo restar 
		$("#btn-restar-clientes").prop("disabled",true);
		//$("input[name='viajero']").prop("disabled",true);
		
	}else{
		if(item.habitacion>0){
			crearTablaViajeros($("#npersonas").val(),1);
		}
		
	}
}


const restarPersonas=()=>{
	npersonas=$("#npersonas").val();
	if(npersonas==1){
	  return;   
	}
	npersonas--;
	$("#npersonas").val(npersonas);
	  sw= $("input[name='viajero']:checked").val();
	   
	  if((sw=='1' && $("#habitacion").val()!='0') || $("input[name='medio_transporte']:checked").val()=='a'){
		 crearTablaViajeros(npersonas);
	  }
}

const sumaPersonas=()=>{
	npersonas=$("#npersonas").val();
	npersonas++;
	$("#npersonas").val(npersonas);
	  sw= $("input[name='viajero']:checked").val();
	   
	  if((sw=='1' && $("#habitacion").val()!='0') || $("input[name='medio_transporte']:checked").val()=='a'){
		 crearTablaViajeros(npersonas);
	  }
}

const unformatNumber=(valor)=>{
	return  valor.replace(/[$.]/g, '');
}
$(function(){
	parent.$(".floating-button").remove();
	HabilitarDeshabilitarForm(true);
	listarZonasVentas();
	listarOficinasVentas();
	//$("#zonas_ventas").select2();
	setInterval(function(){
		validarSesion();
	},2000)
	enevetosActivos( $("#org_ses").val() );
	departamentos();
	
	$("#floatingButton").remove();


	
datosModulo(modulo);
	
	$("#exportar").click(function(){
		fnExcelReport('datos-convocados');
	})	
	$("#exportar_detallado").click(function(){
		window.open('../resources/Excel/Convocatoria.php?id='+$("#eventos").val()+"&medio"+$("#filtros_medio_transporte").val()+"&oficina="+$("#filtros_oficina_ventas").val());
	})

	$(".format-number").keyup(function(){
		numeroLimpio  = $(this).val().replace(/[$.]/g, '') ;
		if(!isNaN(numeroLimpio) && $(this).val().length>0){
		  $(this).val(formatNumberES(numeroLimpio,0,'$'));
		}
	})
	
	$(".format-number").focus(function(){
		
		numeroLimpio  = $(this).val().replace(/[$.]/g, '');
		$(this).val(numeroLimpio);
		
		if($("#id_confirmado").val()>0){
		   $("#tmp").val(numeroLimpio);
		}
		
		$(this).select()
	})
	$(".format-number").focusout(function(){
		
		id =$(this).attr("id");
		let viajero =$("input[name='viajero']:checked").val();
		let medio 	=$("input[name='medio_transporte']:checked").val();
		let pre_aereo =parseFloat( unformatNumber($("#presupuesto_viajero_aereo").val()) );
		let pre_terrestre =parseFloat( unformatNumber($("#presupuesto_viajero_terrestre").val()));	
		
		
		if($(this).val().length==0){
		   $(this).val(0)
		}
		numeroLimpio  = parseFloat($(this).val().replace(/[$.]/g, ''));
		
		if(id=='presupuesto'){
			console.warn({
				viajero,medio,pre_aereo,numeroLimpio,pre_terrestre
			})
			if(viajero!='0'){
			   if(medio=='a'){
				  if(pre_aereo>numeroLimpio){
					  Swal.fire("Validación","El valor minimo de presupuesto es "+formatNumberES(pre_aereo,0,'$'),"warning"); 
					 
					  if($("#id_confirmado").val()>0){
						  numeroLimpio=$("#tmp").val()
					  }else{
						  numeroLimpio=0
					  }
				  } 
			   }else{
				  if(pre_terrestre>numeroLimpio){
					  Swal.fire("Validación","El valor minimo de presupuesto es "+formatNumberES(pre_terrestre,0,'$'),"warning"); 
					  if($("#id_confirmado").val()>0){
						  numeroLimpio=$("#tmp").val()
					  }else{
						  numeroLimpio=0
					  }
				  }   
			   }   
			}  
		}
		
		$(this).val(formatNumberES(numeroLimpio,0,'$'));
	})	
	
	
	$("#departamentos").change(function(){
	   ciudades($(this).val());						   
    });
	
   $("#btn-info-evento").click(function(){
	   $("#modal_info_evento").modal("show");
	   buscarEventoPorId($("#eventos").val());
	   listarLaboratoriosParticipantes($("#eventos").val());
   })
	
  $("#consultar_convocados").click(function(){
	  clientesConfirmados();
  });

  $("#eventos").change(function(){

	id_evento=$(this).val();
			
	id_evento_cierre =eventosActivo.filter(i=> i.id == id_evento)
	
	$("#fecha_maxima_convocatoria").val( id_evento_cierre[0].fecha_fin_convocatoria );
	$("#presupuesto_viajero_aereo").val( formatNumberES(id_evento_cierre[0].presupuesto_aereo,0,'$') );
	$("#presupuesto_viajero_terrestre").val( formatNumberES(id_evento_cierre[0].presupuesto_terrestre,0,'$') );	  
	  
	listarEventosCierres(id_evento_cierre[0].id_evento_cierre);
	validarFechasTiquetes(id_evento_cierre[0].dias_fin_aereo,
						  id_evento_cierre[0].dias_fin_terrestre,
						  id_evento_cierre[0].dias_fin_convocatoria);
  })	
	/*
  $("input[name='viajero']").change(function(){
	  validarViajero();
	  //valido si dias restantes para confirmacion de tiquetes aereos y terrestres
	   validacionDiasRestantesTiquetes();
  })
	*/	
	
   $("#tipo_transporte").change(function(){
		if($(this).val()==2){
			 $("#nota_transporte").attr("disabled",false);
		}else{
			 $("#nota_transporte").attr("disabled",true);
			 $("#nota_transporte").val("0").attr("disabled",true);;
		}
   })
	vlr_hab =0;
	$("#habitacion").focus(function(){
		vlr_hab=$(this).val();
	})
	
	$("#habitacion").change( async function(){
		
		valor =$(this).val();
		
	  	confirmado =$("#id_confirmado").val();
	  
		if($("input[name='viajero']:checked").val()=='0'){
		   Swal.fire("Ups","Solo los marcados como VIAJEROS, pueden reservar hotel","warning")   ;
		   $(this).val(0);
		   return;
		}
		if(confirmado>0){
			try{
				 resp=await enviarPeticion({
					link		: url_api+'clientesviajeros/updatehabitacion',
					id_data_pri :$("#id_confirmado").val(),
					habitacion	:valor
				});
				
				if(resp.ok){
					$("#divTablaViajeros").html('');

				}else{
					$(this).val(vlr_hab);
				}				
				
			}catch(e){
				console.error(e);
				$(this).val(vlr_hab);
			}
		}
		if(valor!='0' || $("input[name='medio_transporte']:checked").val()=='a'){
		   crearTablaViajeros($("#npersonas").val(),1);   
		   
		}else{
			 $("#divTablaViajeros").html('')
		}
  });

  $("input[name='medio_transporte']").change( async function(){	 
	   confirmado =$("#id_confirmado").val();
	   valor=$(this).val();
	  if(confirmado>0){

			try{
				 resp=await enviarPeticion({
					link		: url_api+'clientesviajeros/updatemedio',
					id_data_pri :$("#id_confirmado").val(),
					medio		:valor
				});
				
				if(resp.ok){
					$("#divTablaViajeros").html('');
					$("#btnradio1").prop("checked",true)
				}else{
					if(valor=='t'){
					   $("input[name='medio_transporte']").val('a');
					}else{
					   $("input[name='medio_transporte']").val('t')
					}
				}				
				
			}catch(e){
				console.error(e);
					if(valor=='t'){
					   $("input[name='medio_transporte']").val('a');
					}else{
					   $("input[name='medio_transporte']").val('t')
					}
			}
	  }
	
	 if(valor=="a"){
	    $("#tipo_transporte").val(1)
		$("#btnradio1").prop("checked",true)
		crearTablaViajeros($("#npersonas").val(),1);
		$("#tipo_transporte").attr("disabled",false)
		
		//$("#tipo_transporte").html(`<option value="2" >Transporte propio</option>`);
     }else{
		  $("#email").prop("required",false)
		  if($("#habitacion").val()!='0'){
			 crearTablaViajeros($("#npersonas").val(),1);
		  }else{
			  $("#divTablaViajeros").html('')
		  }
		  $("#tipo_transporte").attr("disabled",false)
		/* $("#tipo_transporte").html(`<option value="1" selected>Transporte empresa</option>
					  <option value="2" >Transporte propio</option>`);*/
	 }
	
  })
	
  $("input[name='viajero']").change(async function(){

	  confirmado =$("#id_confirmado").val();
	  valor =$(this).val();
	  console.log({
		valor
	  })
	  if(confirmado>0){
		try{

			 resp=await enviarPeticion({
				link	: url_api+'clientesviajeros/updateviajero',
				id_data_pri :$("#id_confirmado").val(),
				viajero:valor
			})
						 
			if(resp.ok){
				if(valor=='0'){
				  $("#viaja_tierra").prop("checked",true);   
				}
				$("#divTablaViajeros").html('');	
				$("#habitacion").val(0);
							
			}else{
				 Swal.fire("Error","No se puedo actualizar el registro","error");
				 if($("input[name='viajero']:checked").val()=='0'){
				   	$("#btnradio1").prop("checked",true);
			     }else{
					 $("#btnradio2").prop("checked",true);
				 }
				return ;
			}	

		}catch(e){ console.error(e)
				 Swal.fire("Error","No se puedo actualizar el registro","error");
				 if($("input[name='viajero']:checked").val()=='0'){
				   	$("#btnradio1").prop("checked",true);
			     }else{
					 $("#btnradio2").prop("checked",true);
				 } 
				  return ;
		}
	  }
	  	  	  
	  if($(this).val()=='1'){//es viajero
		  if($("#habitacion").val()>0){
			crearTablaViajeros($("#npersonas").val());  
		  }else{
			$("#divTablaViajeros").html('');  
		  }
		  $("#tipo_transporte").attr("disabled",false);
		  $("#tipo_transporte").val("1");
		  $("#nota_transporte").val("$0").attr("disabled",false);;
		  $("input[name='medio_transporte']").attr("disabled",false)
	  }else{
		  $("#viaja_tierra").prop("checked",true)
		  $("#divTablaViajeros").html(''); 
		  $("#habitacion").val(0);
		  $("#tipo_transporte").val("1");
		  $("#tipo_transporte").attr("disabled",true);
		  $("#nota_transporte").val("$0").attr("disabled",true);;
		  $("input[name='medio_transporte']").attr("disabled",true)
	  }

  })
	
  $('#busqueda').autocomplete({
    source:async (request,response)=>{
	  $("#i-search-cliente").html(`<i class="fa-solid fa-sync fa-spin"></i> `)
		
	  await $.ajax({
			type: "GET",
			url: url_api+'terceros/buscarporcriterios',
			dataType: "json",
			data: {
			  criterio: request.term,
			  org: $("#org_ses").val(),
			  id_evento:$("#eventos").val()
			},
			success: function (data) { //alert(data);
			 
			  response(data);
			  $("#i-search-cliente").html(`<i class="fa fa-search"></i>`)
			}
		  }).fail(function(){
			 $("#i-search-cliente").html(`<i class="fa fa-warning text-danger">Ha ocurrido un error</i>`)
	      });
	},
    minLength: 3,
	focus:function(event,ui){ console.log(ui.item.value)
		
	},
    search: function (ui) {},
    open  : function () {},
    select: function (event, ui){console.log(ui)
      //ConsultarFacturas(ui.item.CODIGO_MATERIAL);
								 
	  if(ui.item.registrado>0){

		const swalWithBootstrapButtons = Swal.mixin({
		  customClass: {
			confirmButton: "btn btn-success m-1",
			cancelButton: "btn btn-danger m-1"
		  },
		  buttonsStyling: false
		});
		swalWithBootstrapButtons.fire({
		  title: "El cliente ya está registrado, desea cargarlo?",
		  text: "",
		  icon: "warning",
		  showCancelButton: true,
		  confirmButtonText: "Si, cargarlo!",
		  cancelButtonText: "No, cancelar!",
		  reverseButtons: true
		}).then((result) => {
		  if (result.value) {

			  cargarClienteRegistrado(ui.item.codigo_sap,$("#eventos").val());
			  
		  } else if (
			/* Read more about handling dismissals below */
			result.dismiss === Swal.DismissReason.cancel
		  ) {
			swalWithBootstrapButtons.fire({
			  title: "Acción cancelada",
			  text: "",
			  icon: "error"
			});
		  }
		});		  
		  
	  }else{
		  
		  $("#codigo_sap").val(ui.item.codigo_sap);
		  $("#cliente").val(ui.item.razon_comercial+' '+ui.item.nombres);
		  $("#telefono").val(ui.item.telefonos);
		  $("#email").val(ui.item.email);
		  validarCargaCliente();
		  $("#npersonas").focus();  
	  }

    }
  });
  
  $("#busqueda").keyup(function(){
	  if($(this).val().length==0){
	     $("#codigo_sap").val('');
	     $("#cliente").val(' ');
		 $("#i-search-cliente").html(`<i class="fa fa-search"></i>`).addClass("text-primary")
		 validarCargaCliente() ;
		 limpiarCampos();
	  }
  })
/*
$("#form").on('submit',async function(e){

 try{
	     form= document.getElementById("form");
	 	console.log(e)
		if (!form.checkValidity()) {
			e.preventDefault()
			e.stopPropagation();
			return;
		}
 }catch(e){
	 console.error(e)
 }
});*/

  $.fn.serializeArrayAll = function () {
	 var obj = [];
	 $(':disabled[name]', this).each(function () {
			obj.push({name: this.name, value: $(this).val()});
	 });
	return this.serializeArray().concat(obj);
  };	
	
  var form = document.getElementById("form");
  //var form2 = document.getElementById("form2");
  var guardarBtn = document.getElementById("guardar");
  var id_
  guardarBtn.addEventListener("click", async function(event) {
	event.preventDefault();
    try{
		
		// Realizar la validación manual de campos requeridos
		if (!form.checkValidity()) {
		  // Si hay campos inválidos, evitar que el formulario se envíe y mostrar los mensajes de validación
		  event.preventDefault();
		  event.stopPropagation();
		  // Agregar la clase "was-validated" para mostrar los mensajes de validación en campos inválidos
		  form.classList.add("was-validated");
		  return ;
		}
		
		//quito los formatos numeros 
		 Inputumumber = document.querySelectorAll('.format-number');
		
		Inputumumber.forEach(input=>{
			input.value= input.value.replace(/[$.]/g, '')
		})
		
		const data = $("#form").serializeArrayAll();

		let tour   = $("#id_evento_cierre").val()>0 ? 'S':'N';
		
		const dataRequest = formatearArrayRequest(data);
		if(dataRequest.nota_transporte==''){
		   dataRequest.nota_transporte=0;
		}
		//valido si se va a editar o insertar
		
		if($("#id_confirmado").val()>0){
		   dataRequest.link=url_api+'clientesconvocatoria/editar';
		   dataRequest.id=$("#id_confirmado").val()
		}else{
		   dataRequest.link=url_api+'clientesconvocatoria/create';	
		}

		dataRequest.estado='P';
		dataRequest.tour=tour;
		dataRequest.id_evento=$("#eventos").val();

		showLoadingSwalAlert2('Guardando unformacion',false);
		viajero =$('input:radio[name=viajero]:checked').val();
		//dataRequest.medio_transporte=$('input:radio[name=viajero]:checked').val();
		
		if(viajero=='0'){
		  dataRequest.medio_transporte='n' 
		}
		const respuesta=await enviarPeticion(dataRequest);
		console.log({
			respuesta
		})
		if(respuesta.id>0){
			//$("#id_confirmado").val(respuesta.id);
			//data a enviar para edicion 
			guardarDatosViajeros(respuesta.id);
			dissminSwal();
			limpiarCampos();
			Swal.fire("Ok","Se guardaron correctamente los registros","success");
		}else{
			dissminSwal();
			Swal.fire("Error","Error interno en el servidor","error");
		}
		
	}catch(e){
		console.error(e)
		dissminSwal();
		Swal.fire("Error","Error interno en el servidor","error");
		if($("#id_confirmado").val()>0){
		   //eliminarEvento();
		}
		
	}
	
  });
  $("#busqueda").focus();
// window.parent.$(".floating-button").remove()
})

