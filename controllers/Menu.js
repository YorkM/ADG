var visto_sol_ing=0;
var int_noti='';

const CargarItems=async ()=>{
    
    resp =await enviarPeticion({ op: "CargarModulos",link     : "../models/Menu.php",});
    resp.forEach(item=>{
        $('#'+item.numero.slice(0,2)).show();
    })

  }

const ListarEvento =async (op)=>{
	
	var depId = $.trim($("#DepId").val());

	$(".n_eventos_comerciales").hide();
	$(".n_eventos_comerciales").html(0)

    try{
       

		if(depId != '11' //Tranferencistas Internas
			&& depId != '13' //Tranferencistas Esternas
			&& depId != '9' //Proveedores
			&& depId != '2' //Logistica){
		)
		{
			const data={
				op   : "S_EVENTO_LISTA",
				org  : $("#org").val(),
				ofi  : $("#TxtOficina").val(),
				tipo : $("#selTipos").val(),
				link : "../models/Eventos.php"
			}
	
			$("#ModalBody").html(`
				<div class="alert alert-primary alert-dismissible fade show" role="alert">
					<i class="bi bi-star me-1"></i>
					Cargando información!
					<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
				</div>
			`);
	
			resp =await enviarPeticion(data);
		
	
			if(resp.data.length==0){
				return;
			}
		
			if(resp.data.length > 0){
	
				$(".n_eventos_comerciales").show();
				$(".n_eventos_comerciales").html(resp.data.length)
	
				var detalle = `
				
				`;
				var contDesc = 0;
				var contBoni = 0;
				resp.data.forEach(function(d,i){
					 var tipo = 'BONIFICADO';
					 var img = '<i class="fa-solid fa-gifts"></i>';
					 if(d.TIPO == 'DES'){
						 tipo = 'DESCUENTO';
						 img = `<i class="fa fa-tags" style="--fa-primary-color: #e83211; --fa-secondary-color: #e8ec09;"></i>`;
						 contDesc++;
					 }else{
						 contBoni++;
					 }
					 detalle += `<div class="panel panel-default">
									<div class="panel-heading">
									  <div class="row mb-3">
										<div class="col">${img} ${tipo}</div>
										<div class="col">${d.GRUPO_ARTICULO} - ${d.GRUPO_DESCRIPCION}</div>
										<div class="col">
											<button type="button" class="btn btn-success" onClick="AddEvento('${d.GRUPO_ARTICULO}','${d.TIPO}');">
											 <i class="fa-solid fa-circle-plus"></i> Compra aquí!
											</button>
										</div>
									 </div>									 
									</div>
								</div>`;
				});
				$("#ModalBody").html(detalle);
				$("#CantDesc").val(contDesc);
				$("#CantBoni").val(contBoni);
			   
				//$("#filtroEvento").val('');
				$('#ModalEventosPromociones').modal('show'); 
					/*
	*/
				   
			}else{
				$("#ModalBody").html(`<div class="alert alert-danger" role="alert">
										<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
										<span class="sr-only">Error:</span>  No existen resultados para las condiciones seleccionadas
									 </div>`);
				$("#CantDesc").val(0);
				$("#CantBoni").val(0);
				//$("#filtroEvento").val('')
				$('#ModalEventosPromociones').modal('show'); 
			}

		}else{

		}
        /*const validos =[11,13,9,2,7,18,1,3,12,6,5,10];

        if (!validos.includes(parseInt(depId))) {
            return;
        }*/

    }catch(e){
        console.error(e)
    }

}


const  AddEvento = (grupo,tipo)=>{
	window.location="../views/Contenido.php?mod=01&eve="+grupo+"&tipoeve="+tipo;
}


const imagenesDtosMes=async ()=>{
	
	rol=$("#Rol").val();
	org=$("#org").val();
	
	try{
		
		data={
			org,
			op:'S_PUBLICIDAD_DTOS_MES',
			link:"../models/ImagenesPublicitarias.php"
		}

		const resp=await enviarPeticion(data);
		
		if(resp.length>0){
			
			const mostrar =(rol==10 || rol==1) && org==2000 ? true:false;

			if(mostrar){
				$("#modal_dtos_exclusivos").modal("show");
				$("#img-descuentos-mes").attr("src","https://www.pwmultiroma.com/ImagenesPublicitarias/"+resp[0].URL_IMG+".png");
			 }

		}else{
			$("#modal_dtos_exclusivos").modal("hide");
		}		
		
		
	}catch(e){ console.error(e)
		$("#modal_dtos_exclusivos").modal("hide");
	}
	
}

function MostrarImagenPromocion(){
	
	rol=$("#Rol").val();
	org=$("#org").val();
	//const mostrar =(rol==10 || rol==1) && org==2000 ? $("#modal_dtos_exclusivos").modal("show") :false;
	imagenesDtosMes();
}



const eventosRecientes =async()=>{

	try{
		data={
			link 	:'../models/ProgramacionReuniones.php',
			op		:'evento_proceso',
			top		:5,
			proximos:7//dias
		}
		resp=await enviarPeticion(data);
		$(".n_eventos_reuniones").text(resp.length);
	
        if(resp.length>0){
			
            $(".n_eventos_reuniones").show();
            $(".li_eventos_reuniones").show();
        }else{ 
            $(".n_eventos_reuniones").hide()
            $(".li_eventos_reuniones").hide();
			return;
        }
	
		let li=''
		resp.forEach(item=>{
	
			clase=''
		  if(item.min_trasncurridos==0){
			 clase="text-danger alert-danger"
	      }
	
				li+=`<li class="${clase} p-2">
				    <a class=" pe-0 " >
                    	<i class="${item.icono} fa-1x text-left m-1" ></i>
                    	<b>${item.tipo.substr(0,30)}...</b><br>
                    	<small>${item.tema}</small>
                    	<br><small class="text-rigth">${item.fecha_reunion} empieza a las ${ item.hora_inicial.substr(0,5)}</small>
                    </a>
                </li>`
		})
	
		  $(".list-eventos-adg").html(li)
	}catch(e){
		console.error(e)
	}

}

const cargarGruposModulos =async ()=>{

	try{
		data={
			link :"../models/Menu.php",
			op:'CargarModulos'
		}
	
		resp =await enviarPeticion(data);

		newarr = resp.map(item=>({
			grupo: item.numero.substr(0,2),
			nombre: item.nombre_grupo
		})) 

		const seen = new Set();
		const uniquePropiedades = newarr.filter(item => {
			const key = `${item.grupo}-${item.nombre}`;
		
			if (seen.has(key)) {
				return false;
			} else {
				seen.add(key);
				return true;
			}
		}); 

		btn =``
	    uniquePropiedades.forEach(item=>{
			btn+=`<button  id="m${item.grupo}" onClick="CargarCategoria('${item.grupo}')"  class="col mb-3 border border-1 border-ligth  rounded-2 shadow d-flex align-items-center justify-content-center">
					<div class="text-center btn-menu ">
					<p class="p-numeros mb-3"><b>${item.grupo}</b></p>
					<img src="../resources/icons_modulos/${item.grupo}/${item.grupo}.png" class="img-fluid mb-2" width="70" height="70" alt="Icon">
					<p class="mb-0">${item.nombre}</p>
					</div>
				</button>`
		})
		
		$("#list-grupos").html(btn)

	}catch(e){
		console.error(e)
	}

}
$(function(){
	$('#filtroEvento').keyup(function() {

		var filtro = $(this).val().toLowerCase();
		// Iterar sobre los paneles y ocultar/mostrar según el filtro
		$('.panel-default').each(function() {
		  var textoGrupo = $(this).find('.col:eq(1)').text().toLowerCase();
		  if (textoGrupo.includes(filtro)) {
			$(this).show();
		  } else {
			$(this).hide();
		  }
		});
	  });
})

$(async function(){

	  MostrarImagenPromocion();	
	  cargarGruposModulos();

	/*setInterval(function(){
		pedidosPendientes()
	},14000)*/

	inicio =await leerElemento('data_adg');

	if(!inicio){
		showLoadingSwalAlert2('Espera mientras preparamos ADG, para tí',false)
		await crearElemento('data_adg',1);
	}
	
	 datosPerfil();

	 //await visualizarSolicitudesIngresos();
     depId = $.trim($("#DepId").val());
     validos =[11,13,9,2,7,18];
	
	 if (depId != '11' //Tranferencistas Internas
		&& depId != '13' //Tranferencistas Esternas
		&& depId != '9' //Proveedores
		&& depId != '2' //Logistica
	  ) {
		
        const data={
            op   : "S_EVENTO_LISTA",
            org  : $("#org").val(),
            ofi  : $("#TxtOficina").val(),
            tipo : $("#selTipos").val(),
            link : "../models/Eventos.php",
            depId
        }

        resp =await enviarPeticion(data);
        if(resp.data.length==0){
            return;
        }
   
        if(resp.data.length > 0){
    
            $(".n_eventos_comerciales").show();
            $(".n_eventos_comerciales").html(resp.data.length)
        }else{
			$(".n_eventos_comerciales").hide();
            $(".n_eventos_comerciales").html(0)
		}
		//ListarEvento(0)
    }


	eventosRecientes();
	/*setInterval(function(){
		eventosRecientes();
	},10000);*/
	
	//$(document).snow({ SnowImage: "../resources/images/snow.gif" });	
    //MostrarImagenPromocion(); 

 //viewListEvaluacionesPendientes();	

  CargarItems();
  //--------------------------------
    $("#a_cerrar_all").click(function(){
	  id=$("#IdUser").val();
	  window.location="../models/Logout.php?id_get="+id;
    });
  
  
  //-------------validacion de visualizacion de eventos de mercadeo
  var depId = $.trim($("#DepId").val());
  var org   = $.trim($("#org").val());

 //-------------------------------------------- 
 //EVENTOS CLICK
 $(".cont_bodega").click(function(){
	///$("#change_bodega").trigger("click");
 });
 //
 $(".InputG").focus(function(){
	$(".err_conf").text(""); 
	$(".err_conf").hide(); 
 });
 //
 $("#change_pass").click(function(){
	 
	 	$("#CambiarCont").modal('show');
		$("#passact").val("");
		$("#passnew").val("");
		$("#passconf").val("");
		$(".err_conf").hide();
		$(".err_conf").text("");
 });
 //
 $("#selTipos").change(function(){
   ListarEvento();
 });

 $("#guardarpass").click(async function(){
	showLoadingSwalAlert2('Guardando cambios',false)
	id=$("#IdUser").val();
	passact	=$.trim($("#passact").val());
   
     if(isNaN(parseInt(id)) || id==0){
		Swal.fire("Error","No se detecto una sesión activa","error")
		return;
	 }
	 

	 if(passact==''){
		Swal.fire("Ups","Debe digitar la clave actual","warning")
		return;
	 }

	//verifico que la nueva contraseña no sea vacia
	if($.trim($("#passnew").val())==""){
		dissminSwal()
		Swal.fire("Ups","Debe digitar la nueva clave","warning")
		return;
	}

	if($.trim($("#passconf").val())==""){
		dissminSwal()
		Swal.fire("Ups","Debe digitar confirmar la nueva clave","warning")
		return;
	}


	if($("#passnew").val()!=$("#passconf").val()){
		dissminSwal()
		Swal.fire("Ups","La nueva clave es diferente a la clave de confirmacion","warning")
	  return;
	}

	await verificarPassAct(id,passact);

	ChangePass();			 
	dissminSwal()			
 });
 	
	
	setInterval('VerificarSession()',6000);
	
	id_rol=$("#Rol").val();
	
	if(id_rol!=10 && id_rol!=9 && id_rol!=11){
	   id_user=$("#IdUser").val();
	  viewListEvaluacionesPendientes(10,id_user);
 	}	
	
	/*if($("#Rol").val()==12 || $("#Rol").val()==1){

		SrcFechaHoraActual().then(resp=>{

			fechaActual=resp[0].fecha_actual;
			//llamo el servicio que muestra las alertas

			int_noti=setInterval(eventoNoti,30000);

		}).catch(error=>{
			console.error(error);
			fechaActual='';
		});		   
	 }*/
	
if($("#Rol").val()==5 || $("#Rol").val()==5){


	SolicitudesIngresosPendientes()
	.then(resp=>{
		visto_sol_ing=1
		visualizarSolicitudesIngresos(resp);
			 
	})
	.catch(error=>{
		console.error(error)
	})  
	
	$("#li_solicitudes_ing a").click(function(){
		
		SolicitudesIngresosPendientes()
		.then(resp=>{
			visto_sol_ing=1
			visualizarSolicitudesIngresos(resp);

		})
		.catch(error=>{
			console.error(error)
		}) 	
		
	})
}
dissminSwal()

})

function guardar_registro_transferencista() {
	var formData = new FormData($('#register-trans-form')[0]);
    formData.append('op', 'guardar_registro_transferencista'); // Añadir el campo adicional
    
    $.ajax({
      url: '../models/Login.php',
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      success: function(response) {
        alert('Registro guardado exitosamente.');
        $('#ModalRegistro_puntos').modal('hide');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('Error al guardar el registro: ' + textStatus);
      }
    });
  }
/*
	function Registrarse_puntos_transferencista(){
    $("#ModalRegistro_puntos").modal('show');
    };*/