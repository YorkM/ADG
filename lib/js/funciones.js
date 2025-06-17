// JavaScript Document
var id_post=0;//id del usuario de sesion, guardado en el cliente
var session_id=0;
var GoogleKeyApis = 'AIzaSyAiEVx_nyyrkNci_hWB_fMuUAkKn_OH_b8';
var GoogleArrayMaps = new Array();

function ObtenerCoordenadas(){	
	var codigo = {};
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(objPosition){
			var lon = objPosition.coords.longitude;
			var lat = objPosition.coords.latitude;
            codigo.tipo = 0;
			codigo.lat  = lat;
			codigo.lon  = lon;
			codigo.respuesta = "Exitoso.";
			GoogleArrayMaps.push(codigo);
		}, function(objPositionError){
			switch (objPositionError.code){
				case objPositionError.PERMISSION_DENIED:
				    codigo.tipo = 1;
					codigo.lat  = 0;
			        codigo.lon  = 0;
					codigo.respuesta = "No se ha permitido el acceso a la posición del usuario.";
					GoogleArrayMaps.push(codigo);
				break;
				case objPositionError.POSITION_UNAVAILABLE:
				    codigo.tipo = 2;
					codigo.lat  = 0;
			        codigo.lon  = 0;
					codigo.respuesta = "No se ha podido acceder a la información de su posición.";
					GoogleArrayMaps.push(codigo);
				break;
				case objPositionError.TIMEOUT:
				    codigo.tipo = 3;
					codigo.lat  = 0;
			        codigo.lon  = 0;
					codigo.respuesta = "El servicio ha tardado demasiado tiempo en responder.";
					GoogleArrayMaps.push(codigo);
				break;
				default:
				    codigo.tipo = 4;
					codigo.lat  = 0;
			        codigo.lon  = 0;
					codigo.respuesta = "Error desconocido.";
					GoogleArrayMaps.push(codigo);
			}
		}, {
			maximumAge: 75000,
			timeout: 15000
	 });
	}else{
		codigo.tipo = 5;
		codigo.lat  = 0;
		codigo.lon  = 0;
		codigo.respuesta = "Su navegador no soporta la API de geolocalización.";
		GoogleArrayMaps.push(codigo);
	}
	return GoogleArrayMaps;
}
function BuscarTop(valor){
	
	valor=valor.toUpperCase();
	if(valor.length>0){
		
		$(".content-box div[class='project-item']").each(function(index, element) {
            
			 zona    =$(this).find("div[class='name']").text();
			 vendedor=$(this).find("div[class='created']").text();
			// alert(zona+'  '+vendedor);
			 if(zona.indexOf(valor)!=-1 || vendedor.indexOf(valor)!=-1){
				 $(this).show(); 
			 }else{
				 $(this).hide();  
			 }
        });
	}else{
		$(".content-box div[class='project-item']").show();
	}
}
function Top(){
	
	div='';
		$.ajax({
				   type    : "POST",
				   url     : "../models/Convocatoria.php",
				   dataType: "json",
				   async   : true,
				   data    : {op   : "top"},
				  success  : function(data){
					  
					  if(data.length>0){
						  
						    cuota=30;
							 
							  div='<div class="row">'+
									   '<div class="col-sm-12 col-md-12">'+
										   '<div class="resp-avatars">'+
											   '<div class="btn-circle_sm circle_info    pull-left">Meta</div>'+
											   '<div class="btn-circle_sm circle_success pull-left">Confirmados</div>'+
											 
										  '</div>'+
									   '</div>'+
									'</div>'+
									'<div class="projects-search">'+
									  '<input type="text" class="search-input" placeholder="Buscar" onkeyup="BuscarTop(this.value)">'+
									  
									'</div>';
						  for(var i=0;i<data.length;i++){
							   d=data[i];
	                           pcj=(d.cant/cuota)*100;
							   pcj=Math.round(pcj);
							   
							   if(pcj<=40){
								  barra_class='danger' ; 
							   }
							   if(pcj>=41 && pcj<=70){
								  barra_class='warning' ;
							   }
							   if(pcj>=71){
								 barra_class='success' ;  
							   }
							   div+='<div class="row">'+
										'<div class="col-md-12 col-lg-12">'+
										  '<div class="content-box project-wrapper">'+
											'<div class="project-item">'+
											   '<div class="row ">'+
									
												   '<div class="col-sm-2 col-md-2">'+
													   '<div class="pull-left text-center">'+
														  '<div class="resp-avatars">'+
															 '<div class="btn-circle circle_count  pull-right">'+(i+1)+'</div>'+
														  '</div>'+
														'</div>'+
												   '</div>'+
												  
												   '<div class="col-sm-3 col-md-3" >'+
														'<div class="project-name pull-left">'+
														  '<div class="name"><b>'+d.zona+'</b></div>'+
														  '<div class="created">'+d.usuario+'</span></div>'+
														'</div>'+                   
												   '</div>'+
											
												   '<div class="col-sm-4 col-md-4 " >'+
														'<div class="project-progress pull-left"  style="width:100%">'+
														  '<span class="task-title"><span>'+pcj+'%</span></span>'+
														  '<div class="progress">'+
															'<div class="progress-bar progress-bar-striped progress-bar-'+barra_class+'" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="'+pcj+'" style="width:'+pcj+'%;">'+
															'</div>'+
														  '</div>'+
														'</div> '+                     
												   '</div> '+                
										             
												   '<div class="col-sm-3 col-md-3">'+
													   '<div class="pull-right text-center">'+
														  '<div class="resp-avatars">'+

															  '<div class="btn-circle  circle_info img-circle pull-right">'+cuota+'</div>'+
															  
															  '<div class="btn-circle circle_success img-circle pull-right">'+d.cant+'</div>'+
														  '</div>'+
														'</div> '+                  
												   '</div>'+
											   '</div>'+
											  '</div>'+
											'</div>'+
										  '</div>'+
										'</div>';
						  }//for
						  
					  }
				  }
		}).fail(function(data){
			console.error(data);
		});
		return div;
}


function GetSessionId(){
	
	 $.ajax({     
		    url      : "../models/Menu.php",
			global   : false,
			type     : "POST",
			data     : ({
						  op   : "getSessionId"
					}),
			dataType : "html",
			async    : false,
			success  : function(data){
				if(session_id==0){
					session_id=data;
				}
				
			}
	 });
}

GetSessionId();



function Consecutivo(num){
	
   num=String(num);
   n_ceros=3-num.length;
   c="0";
   cadena="";
   for(var i=0;i<n_ceros;i++){
	   cadena=cadena+c;
	   
   }
   return cadena+num;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, ' '); 
}



function ListarErrorUpload(err)
{
  msj="";
  switch ($.trim(err)){
	case "na":
	  msj=" no se encontro el archivo adjunto";
	break;
	case "n_pdf":
	  msj=" el formato del archivo debe ser pdf";
	break; 
	default :
	  msj=err;
	break; 
  }
  return msj;
}

function Round(num, decimales) {
    var signo = (num >= 0 ? 1 : -1);
    num = num * signo;
    if (decimales === 0) //con 0 decimales
        return signo * Math.round(num);
    // round(x * 10 ^ decimales)
    num = num.toString().split('e');
    num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
    // x * 10 ^ (-decimales)
    num = num.toString().split('e');
    return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : - decimales));
}
function wordwrap( str, width, brk, cut ) {
 
    brk = brk || 'n';
    width = width || 75;
    cut = cut || false;
 
    if (!str) { return str; }
 
    var regex = '.{1,' +width+ '}(\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\S+?(\s|$)');
 
    return str.match( RegExp(regex, 'g') ).join( brk );
 
}

function exclusion(e){
 tecla = (document.all) ? e.keyCode : e.which; 
  patron =/\'/; // Solo acepta letras
    te = String.fromCharCode(tecla); // 5
    if(patron.test(te)) return false; 
}
function vnumeros(e) {// solo numeros sin espacios con keypress
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 || tecla==0 ) return true; // 3
    patron =/[0-9]/; // Solo acepta números
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
} 
function vnumeros_puntocoma(e) {// solo numeros sin espacios con keypress
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 || tecla==0 ) return true; // 3
    patron =/[0-9;.]/; // Solo acepta números
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}

function vnumeros_guion(e) {// solo numeros sin espacios con keypress
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 || tecla==0 ) return true; // 3
    patron =/[0-9]|\-/; // Solo acepta números
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
} 

function vletras_numeros_esp_guion(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 ||tecla==0 || tecla==32 || tecla==45) return true; // 3
    patron =/[a-zA-Z0-9]+|\_/; // Solo acepta letras
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}
function vletras_numeros(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
	if (tecla==8 ||tecla==0 ) return true; // 3
    patron =/^[0-9a-zA-Z]+$/; // Solo acepta letras
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}
function vletras_espacios(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 || tecla==0 || tecla==32) return true; // 3
    patron =/^[a-zA-Z]/; // Solo acepta letras
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}



function SoloNum(cadena){//Valida que en una caja de texto solo se puedan digitar numeros
 var ob = $(cadena);
  var patron = /^\d+$/;                                     
   if(!patron.test(ob.val())){
	   $(ob.attr('id','name')).val("");
   }
}
function formatNum(num,prefix){//Da formato moneda a un numero
    prefix = prefix || '';
    num += '';
    var splitStr = num.split('.');
    var splitLeft = splitStr[0];
    var splitRight = splitStr.length > 1 ? ',' + splitStr[1] : '';
    var regx = /(\d+)(\d{3})/;
    while (regx.test(splitLeft)){
       splitLeft = splitLeft.replace(regx, '$1' + '.' + '$2');
    }
    return prefix + splitLeft + splitRight;
}

function unformatNum(num) {//Quita formato moneda a un numero
	if(num!=''){
      return num.replace(/([^0-9\,\-])/g,'')*1;
    }else{
	  return num;
	}
} 
function Formatear(ob){//Invoca a la funcion formatear numeros efectiva al momento de utilizar onkeyup
  var num = unformatNum($(ob).val());
  if(num!='' || num!=0){
    $(ob).val(formatNum(parseFloat(num)));
  }
  else{
    $(ob).val(0);
  }
}
function ValidateNum(obj){ //valuna que el campo solo se puedan digitar numeros
   var ob  = $(obj);
   var num = ob.val(); 
   if(isNaN(num)){
     ob.val('');
   }
}
function AbrirDialog(div,titulo,bloqueo,ancho,alto){//Crea un dialog o ventana
 $("#"+div).dialog({ 
			   title: titulo,
		  	   modal:bloqueo,
		 	   width: ancho,
		 	   height: alto,
		 	   resizable : true});
}
function CerrarDialog(div){//Cierra un dialog o ventana
   $("#"+div).dialog('close');
}
function Block(div){//Loading
	var contenido = '<div class="mensaje" id="BlockMessage">'+
					  '<div id="circularG">'+
						'<div id="circularG_1" class="circularG"></div>'+
						'<div id="circularG_2" class="circularG"></div>'+
						'<div id="circularG_3" class="circularG"></div>'+
						'<div id="circularG_4" class="circularG"></div>'+
						'<div id="circularG_5" class="circularG"></div>'+
						'<div id="circularG_6" class="circularG"></div>'+
						'<div id="circularG_7" class="circularG"></div>'+
						'<div id="circularG_8" class="circularG"></div>'+
					   '</div>'+
					'</div>';
	var entorno ='<div class="block" id="BlockBackground"></div>';
    $("#"+div).append(entorno);
	$('#BlockBackground').append(contenido);
	$('#BlockMessage').show('fast')
   
}
function UnBlock(){//Cerrar Loading
 $("#BlockMessage").remove();
 $("#BlockBackground").remove();
}
function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '-' + info[1] + '-' + info[0];
}

function FechaActual2(){
    var hoy = new Date();
	var dd = hoy.getDate();
	var mm = hoy.getMonth()+1; //hoy es 0!
	var yyyy = hoy.getFullYear();
	
	if(dd<10) {
		dd='0'+dd
	} 
	if(mm<10) {
		mm='0'+mm
	} 
	hoy = yyyy+'-'+mm+'-'+dd;
	return hoy;
}
function FechaActual(){
	var hoy = new Date();
	var dd = hoy.getDate();
	var mm = hoy.getMonth()+1; //hoy es 0!
	var yyyy = hoy.getFullYear();
	
	if(dd<10) {
		dd='0'+dd
	} 
	if(mm<10) {
		mm='0'+mm
	} 
	hoy = dd+'-'+mm+'-'+yyyy;
	return hoy;
}
function FechaActualAmd(){
	var hoy = new Date();
	var dd = hoy.getDate();
	var mm = hoy.getMonth()+1; //hoy es 0!
	var yyyy = hoy.getFullYear();
	
	if(dd<10) {
		dd='0'+dd
	} 
	if(mm<10) {
		mm='0'+mm
	} 
	hoy = yyyy+'-'+mm+'-'+dd;
	return hoy;
}
function carga_anios(ob){ 
   var anio_actual = new Date().getFullYear();
   var option = '';
   for(var i=anio_actual; i>=2008; i--){
      if(anio_actual == i){
		 option += "<option value='"+i+"' selected='selected'>"+i+"</option>";
	  }else{
		 option += '<option value="'+i+'">'+i+'</option>';
	  }
   }
   $("#"+ob).html(option);
}
function carga_mes(ob){
	var meses = new Array('','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre');
	var mes_actual = new Date().getMonth()+1;
	var option = '';
	for(var i=1; i<=12; i++){
		 if(mes_actual == i){
			option += "<option value='"+i+"' selected='selected'>"+meses[i]+" (Actual)</option>";
		 }else{ 
		   option += '<option value="'+i+'">'+meses[i]+'</option>';
		 }						 
	}
	$("#"+ob).html(option);
}
function carga_dias(ob, mes, ano){
	var option = '';
	var dias = new Date(ano, mes, 0).getDate();

	for(var i=1; i<=dias; i++){
	  option += '<option value="'+i+'">Dia '+i+'</option>';
	}
    $("#"+ob).html(option);
}
//Funcion que exporta la informacion a excel
function Exportar(div,e){
  if($("#"+div).html()!=''){
   window.open('data:application/vnd.ms-excel,' + encodeURIComponent($("#"+div).html()));
   e.preventDefault(); 	
  }else{
   swal('Oops..!','No hay nada que exportar','warning');
  }
}

//Nueva funcion de exportacion de excel

function fnExcelReport(IdDiv)
{
    var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange; var j=0;
    tab = document.getElementById(IdDiv); // id of table

    for(j = 0 ; j < tab.rows.length ; j++) 
    {     
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus(); 
        sa=txtArea1.document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
    }  
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
	

    return (sa);
}

function ObtenerMes(n){
	
	switch (parseInt(n)){
		case 1:des="Enero";break;
		case 2:des="Febrero";break;
		case 3:des="Marzo";break;
		case 4:des="Abril";break;
		case 5:des="Mayo";break;
		case 6:des="Junio";break;
		case 7: des="Julio";break;
		case 8:des="Agosto";break;
		case 9:des="Septiembre";break;
		case 10: des="Octubre";  break;
		case 11: des="Noviembre"; break;
		case 12: des="Diciembre"; break;
	}
	return des;
}
function Fromatofecha(hora){
	
	if($.trim(hora)=="n"){
		return "";
	}else{
			h=hora.split(":");
			m=h[1];
			f="p.m.";
			switch (h[0]){
				case "13":
				  h="01";
				break;
				case "14":
				  h="02";
				break;
				case "15":
				  h="03";
				break;
				case "16":
				  h="04";
				break;
				case "17":
				  h="05";
				break;
				case "18":
				  h="06";
				break;
				case "19":
				  h="07";
				break;
				case "20":
				  h="08";
				break;
				case "21":
				  h="09";
				break;
				case "22":
				  h="10";
				break;
				case "23":
				  h="11";
				break;
				case "24":
				  h="12";
				break;
				case "00":
				  h="01:00";
				break;

				default:
				  f="a.m.";
				  h=h[0];
				break;
			}
			return h+":"+m+" "+f;
	}
}

function AjustarObjeto(wmax,hmax,id,idRestW,idRestH){
 	
 if(idRestH!=""){Hrest=$("#"+idRestH).height(); }else{Hrest=0;}	

 if($("#"+idRestW).is(":visible")){
	if(idRestW!=""){Wrest=$("#"+idRestW).width(); }else{Wrest=0;} 
 }else{
	Wrest=0;   
 }
 //$("#"+id).width(wmax-Wrest);
 $("#"+id).height(hmax-Hrest);	
}
//
function CambiarOrganizacion(org){

  $.ajax({
		url: "../models/Menu.php",
		global: false,
		type: "POST",
		data : ({ 
		op: "CambiarOrg",org:org
		}),
		dataType: "html",
		async:false,
		success: function(data){ //alert(data);
		     $("#org").val(data);
		}
  });	
	
}
//
function cambiarOrg(org,ob,op){

	if(op==1){
	   $("#i_org1").hide();
	   $("#i_org2").hide();
   
	   if(org==1000){
		 $("#Org_select").html(" CM");
		 $("#i_org1").show();
		 $("#org").val(1000);
		 CambiarOrganizacion(1000);
	   }else{
		 $("#Org_select").html(" ROMA");
		 $("#i_org2").show();
		 $("#org").val(2000);
		 CambiarOrganizacion(2000);
	   } 
	}else{
			$("#div_bog1").css("background-color","white");
			$("#div_bog2").css("background-color","white");
		   
			if(org==1000){
			  $("#Org_select").text("CM");
			  $("#div_bog1").css("background-color","#52BCD3");
			  CambiarOrganizacion(1000);
			 
			}else{
				$("#Org_select").text("ROMA"); 
				$("#div_bog2").css("background-color","#52BCD3");
				CambiarOrganizacion(2000);
			   
			}
			 
		   
	   }
	  $("#change_bodega").modal("hide");
	 // $("#change_bodega")	
	 location.reload();
   }
//

function CerrasSesion(){
	swal({title : "Desea cerrar ADG?",   
	      text  : "Despues de aceptar no podra reversar la operacion!",   
	      type  : "warning",   
			 showCancelButton: true,   
			 confirmButtonColor: "#82ED81",   
			 cancelButtonColor: "#FFA3A4",
			 confirmButtonText: "Aceptar",   
			 cancelButtonText : "Cancelar",   
			 closeOnConfirm: true,   
			 closeOnCancel: false }, 
	     function(isConfirm){  
			 if(isConfirm){
	              $.ajax({
						url: "../models/Menu.php",
						global: false,
						type: "POST",
						data : ({  op: "Csesion"}),
						dataType: "html",
						async:true,
						success: function(data){
						   if(data>0){
							   window.location = '../models/Logout.php'; 
						   }
						}
                  });		
			 }else{
			     swal("Cancelado", "La operacion ha sido cancelada!", "error");  
			 }
		 });
}
//

//***********************************
//FUNCIONES DE ALERTAS DE TAREAS
//************************************


function prueba_notificacion(titulo,mensaje,opc) {
	$("#miAudio").remove();

	if (Notification) {
			if (Notification.permission !== "granted") {
			   Notification.requestPermission()
			}
	var title = titulo
    var icono="";
	
	switch(parseInt(opc)){
	    case 0: icono="tar_iniciada" ;  	break;
		case 1: icono="tar_visto" ;  	 	break;
		case 2: icono="tar_ejecucion" ;  	break;
		case 3: icono="tar_pausa" ;  		break;
		case 4: icono="tar_renaudar" ;  	break;
		case 5: icono="tar_terminado" ;  	break;
		case 6: icono="tar_rechazo" ;  		break;
		case 7: icono="tar_calificado" ;  	break;
	}
		
	var extra = {
				icon: "../resources/icons/"+icono+".png",
				body: mensaje,
	}
    
	var noti = new Notification( title, extra);
	//
	var audio='<audio id="miAudio"   >'+
				  ' <source src="../resources/sound/iphone-notificacion.mp3" onPlay="true" ></source>'+
				'</audio>';
				$("body").append(audio);
	$("#miAudio").attr("autoplay",true);	

	noti.onclick = function(){
	// Al hacer click
	   
	}
	noti.onclose = {
	// Al cerrar
	}
	setTimeout( function() { noti.close() }, 10000)
	}
}


function actualizar_noti(id){
	
	$.ajax({
		 url     : "../models/sys/Tareas.php",
		 global  : false,
		type     : "POST",
		data     : ({ op: "UP_NOTI",id:id}),
		dataType : "html",
		error    : function (xhr, status, err) {
           console.error(this.props.url, status, err.toString());
        },
		async    : true,
		success  : function(data){
			
		}
	});
}



//************************************
//FIN : FUNCIONES DE ALERTAS DE TAREAS
//**************************************

async function validarUrl(url1, url2) {
    try {
        const response = await fetch(url1, { method: 'HEAD' });
        if (response.ok) {
            return url1; // La primera URL existe
        } else {
            const response2 = await fetch(url2, { method: 'HEAD' });
            if (response2.ok) {
                return url2; // La segunda URL existe
            } else {
                throw new Error('Ninguna de las URLs existe');
            }
        }
    } catch (error) {
        console.error(error);
        return null; // Manejo de errores
    }
}

let alertShown = false;

const VerificarSession =async ()=>{
	//

	if(session_id==0 && !alertShown){
		//me traigo el id de la session que inicio
		resp_id =await enviarPeticion({
			op   : "getSessionId",
			link:"../models/Menu.php"
		});

		Swal.fire({
			title: 'Alerta ADG',
			text: 'No se pudo detectar el inicio de sesión',
			icon: 'info',
			allowOutsideClick: false, // No se puede cerrar haciendo clic fuera del alerta
			allowEscapeKey: false,    // No se puede cerrar con la tecla Escape
			allowEnterKey: false,     // No se puede cerrar con la tecla Enter
			confirmButtonText: 'Volver a iniciar sesión', // Texto del botón de confirmación
			confirmButtonColor: '#3085d6' // Color del botón de confirmación
		}).then((result) => {
			if (result.isConfirmed) {
				window.location.href = '../models/Logout.php'; // Redirige al usuario a logout.php cuando se cierra el alerta
			}
		});
		session_id=resp_id;
		return ;
	}

    const url1 = '../models/Menu.php';
    //const url2 = '../../models/Menu.php';
    //const urlValida = await validarUrl(url1, url2);

	 const data={
		op   : "VSesion",
		session_id,
		link: url1
	 }
	 resp =await enviarPeticion(data);
	 
	 if(!resp.ok &&  !alertShown){
		alertShown=true;
            Swal.fire({
                title: 'Alerta ADG',
                text: resp.message+'. Cerraré automáticamente en 20 segundos.',
                icon: 'info',
                allowOutsideClick: false, // No se puede cerrar haciendo clic fuera del alerta
                allowEscapeKey: false,    // No se puede cerrar con la tecla Escape
                allowEnterKey: false,     // No se puede cerrar con la tecla Enter
                confirmButtonText: 'Volver a iniciar sesión', // Texto del botón de confirmación
                confirmButtonColor: '#3085d6' // Color del botón de confirmación
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '../models/Logout.php'; // Redirige al usuario a logout.php cuando se cierra el alerta
                }
            });

            // Redirige automáticamente después de 20 segundos si el usuario no cierra el alert
            setTimeout(() => {
                Swal.close(); // Cierra el alerta
                window.location.href = '../models/Logout.php'; // Redirige al usuario a logout.php
            }, 20000); // 20000 milisegundos = 20 segundos
			return ;

	 }

}


//FUNCION QUE VERIFICA SI LA SESION SIGUE ACTIVA ,
function VerificarSession_(){
	
    $.ajax({
		url   : "../models/Menu.php",
		global: false,
		type  : "POST",
		data  : ({ 
		         op        : "VSesion",
				 id_post   : id_post,
				 session_id: session_id
		}),
		dataType: "json",
		async   :true,
		success : function(data){//alert(data);		  
		  for(var i=0;i<data.length;i++){
			  d=data[0];
			
			  if(d.id_usuario==0){
				  //la sesion caduco
				   //alert('Su sesión ha terminado,por favor ingrese nuevamente!');
  						swal({
						  title: "Alerta",
						  text: "La sesión a expirado!",
						  type: "warning",
						  showCancelButton: false,
						  confirmButtonClass: "btn-success",
						  confirmButtonText: "Aceptar!",
						  closeOnConfirm: false,
						  onClose:function(){  window.location="../models/Logout.php?id_get="+id_post+"&session_id="+session_id;}
						},
						function(){
						 // swal("Deleted!", "Your imaginary file has been deleted.", "success");
						  window.location="../models/Logout.php?id_get="+id_post+"&session_id="+session_id;
						});
				   //window.location="../models/Logout.php?id_get"+$("#IdUser").val();
			  }
			  if(d.id_usuario>0){//sesion activa 
			      
				  id_post=d.id_usuario;
				 
				  
				  //verifico estado de conexion
				  
				  if(d.session_id==0){
					  swal({
						  title: "Alerta",
						  text: "Se detecto que otra persona esta accediendo con este usuario  !",
						  type: "warning",
						  showCancelButton: false,
						  showConfirmButton: false,
						  closeOnConfirm: false,
						  onClose:function(){  
						   window.location="../models/Logout.php?id_get="+id_post+"&session_id="+session_id;
						  }
						}); 
					 setTimeout(function(){
						  window.location="../models/Logout.php?id_get="+id_post+"&session_id="+session_id;
					  },3000);
				  }
			  }
			  
			  //VERIFICO LOS DATOS DE ALERTAS DE TAREAS
			  alerta=d.data_alerta;
			 
			  for(j=0;j<alerta.length;j++){
				  r=alerta[i];
				  prueba_notificacion(r.accion,r.tar_descripcion,r.tipo_accion);
				  actualizar_noti(r.id);
				  return false;
			  }
			  
		  }//
		  /* if(data==0){
			   alert('Su sesión ha terminado,por favor ingrese nuevamente!');
		       window.location="../models/Logout.php";
		   }*/
		}
  }).fail(function(data){
	   console.error(data);
	  
  });
   	
}
//
//
async function CargarPagina(url,ob){
  //$(ob).parent().addClass("div_items_menu_click");
  $("#fullscreenModal").modal("show");
  await $('#MyIframe').attr('src', url);	

  //vh-100 z-5 fixed-top bg-danger mt-xl-4"

}
//
load_cat=0;
function CargarCategoria(mod){
   load_cat=1;
	window.location='Contenido.php?mod='+mod;
}
//
function CargarModulos_(){
  var grupo = $('#grupo').val();
  
  $.ajax({
		url: "../models/Menu.php",
		global: false,
		type: "POST",
		data : ({ 
		op: "CargarModulos",
		grupo:grupo
		}),
		dataType: "json",
		error: function (xhr, status, err) {
           console.error(this.props.url, status, err.toString());
        },
		async:false,
		success: function(data){
		//alert(data);return false;
	   // var li='<li><a href="Menu.php"> <i class="fa fa-home"></i> Menu </a></li>';
		//html='<div class="dropdown-divider" style="background-color:#eeee"></div>';
		var items=new Array("fa-tags","fa-cogs","fa-shopping-cart","fa-money","fa-truck","fa-bar-chart","fa-users");
		log_i="";
		var colores =new Array("blue","color","light-red","green","light-orange","purple");
		des="";
		 switch ($.trim($("#grupo").val())){
	   
			   case "01":
				  des="01-VENTAS";
				  cl="blue";
				  log_i=items[0];
			   break;
			   case "02":
				 des="02-SISTEMAS";
				 cl="color";
				 log_i=items[1];
			   break;
			   case "03":
				 des="03-COMPRAS";
				 cl="light-red";
				 log_i=items[2];
			   break;
			   case "04":
				 des="04-CARTERA";
				 cl="green";
				 log_i=items[3];
			   break;
			   case "05":
				 des="05-LOGISTICA";
				 cl="light-orange";
				 log_i=items[4];
			   break;
			   case "06":
				 des="06-MERCADEO";
				 cl="purple";
				 log_i=items[5];
			   break;
			   case "07":
				 des="07-REPORTES";
				 cl="amarrillo";
				 log_i=items[6];
			   break;
			   case "08":
				 des="08-PLANTA TELEFONICA";
				 cl="amarrillo";
				 log_i=items[6];
			   break;
			   case "09":
				 des="09-CANAL LAF";
				 cl="amarrillo";
				 log_i=items[7];
			   break;
			   case "10":
				 des="10-HUMANA & CALIDAD";
				 cl="amarrillo";
				 log_i=items[9];
			   break;
			   case "11":
				 des="11-GESTIÓN INTEGRADA";
				 cl="amarrillo";
				 log_i=items[10];
			   break;
			   default:
			      swal('Error!','No se encontro un grupo de modulos!','warning');
				  window.location='Menu.php';
			   break;
		   }

		html="<div class='mainbody-section text-center container-fluid'>";
	    

		 for(var i=0; i<=data.length-1; i++){
			 var fila = data[i];

		cl="";
		html+='<button class="div_items_menu2" id="'+fila.NUMERO+'" href="#iframe" data-toggle="modal" onclick="CargarPagina(\''+fila.ARCHIVO+'.php\',this)" >'+
			   '<a>'+
				  '<div class="numero_modulo">'+fila.NUMERO+'</div>'+
				  '<div class="img_modulo"><img src="../resources/icons_modulos/'+$("#grupo").val()+'/'+fila.NUMERO+'.png" align="center" width="80" height="80" /></div>'+ 
				   '<div class="titulo_modulo">'+fila.TITULO+'</div>'+
			   '</a>'+
		      '</button>';
				
		}//for
		
html+="</div>";
		  
		  $("#carrusel").html(html);
		    
		  $(".mod_select").html(des.slice(0,13)+'...');

		}
  }).fail(function(data){
	   console.error(data);
  });
}


const ChangePass =async()=>{

	try{
		$("button,input,select").attr("disabled",true)
		const data={
			link :"../models/Usuarios.php",
			op: "9",
			clave:$("#passnew").val(),
			id:$("#IdUser").val()
		}

		resp = await enviarPeticion(data);

		if(!resp.ok){
			Swal.fire("Error",resp.mensaje,"error");
			return;
		}
		
		//Swal.fire("Ok",resp.mensaje,"success");
		showLoadingSwalAlert2('Datos guardados correctamente! <br> <small>Cerrando sesión, por favor espere!</small>',false,false)
		$("#passact").val("");
		$("#passnew").val("");
		$("#passconf").val("");
		setTimeout(function(){
			window.location='../models/Logout.php'	
		},3000)
		
	}catch(e){
		console.error(e)
		Swal.fire("Error","Ha ocurrido un error al intentar actualizar la clave","error")
		$("button,input,select").attr("disabled",false)
	}


}

//SESIONES , USUARIOS
function ChangePass_(){
	
	 $.ajax({
				url: "../models/Usuarios.php",
				global: false,
				type: "POST",
				data : ({ op: "9",clave:$("#passnew").val(),id:$("#IdUser").val()}),
				dataType: "html",
				async:false,
				success: function(data){
					//alert(data);
				  if(data=="1"){
					  swal("Correcto", "Contraseña actualizada!", "success"); 
					  $("#passact").val("");
					  $("#passnew").val("");
					  $("#passconf").val("");
					  $(".err_conf").hide();
					  $(".err_conf").text("");
					  $.ajax({
								url: "../models/Menu.php",
								global: false,
								type: "POST",
								data : ({  op: "Csesion"}),
								dataType: "html",
								async:true,
								success: function(data){
								   if(data>0){
									   window.location = 'Login.php'; 
								   }
						         }
                          });		
				  }else{
					 swal("Error", "No se puedo actualizar la contraseña!", "error"); 
				  }
				}
	 });
}


const verificarPassAct=async (id,clave)=>{
	try{
		
		data={
			link : '../models/Usuarios.php',
			op:8,
			clave,
			id
		}

		resp= await enviarPeticion(data);
		if(!resp.existe){
			Swal.fire("Error","La clave actual digitada no es valida","error")
			return;
		}
	}catch(e){
		console.error(e)
		return;
	}

}
//
function verificarPassAct_(){
	
   passact=$.trim($("#passact").val());
   id=$("#IdUser").val();
   if(passact!=""){
	   
	   $.ajax({
				url: "../models/Usuarios.php",
				global: false,
				type: "POST",
				data : ({ 
				op: "8",clave:passact,id:id
				}),
				dataType: "json",
				error: function (xhr, status, err) {
					console.error(this.props.url, status, err.toString());
				  },
				async:false,
				success: function(data){
		           if(data.length>0){
					   sw=true;
				   }else{
					 sw=false;   
				   }
				}
		  }).fail(function(e){
			console.error(e)
		  });	 
   }else{
         MensajeErroor(1,'Digite la contraseña actual!','S') ;
		 sw=false;
   }
   return sw;
}
//
function MensajeErroor(id,text,ef){
	if(ef=='S'){
		$("#err"+id).text(text).show();
	}else{
		$("#err"+id).text('').hide();
	}
	
}
/*
$.fn.datepicker.dates['es'] = {
    days: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
    daysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    today: "Hoy",
    clear: "Limpiar",
    format: "mm/dd/yyyy",
    titleFormat: "MM yyyy", 
    weekStart: 0
};*/

//Nueva funcion para obtener las oficinas de ventas 2021-02-27
function OficinasVentas(op){
//La variable op recibe S o N esto con el fin de saber si quiere que aparezca la opcion de todas las oficinas 
  var tmp = '';
  var ofc = '';
  var org = ''; 
	$.ajax({
		url: "../models/Usuarios.php",
		global: false,
		type: "POST",
		data : ({ 
		op: "11"
		}),
		dataType: "json",
		async:false,
		success: function(data){
			
			  for(var i=0; i<=data.length-1; i++){
				org  =  data[i].ORGANIZACION_VENTAS;
				tmp += '<option value="'+data[i].OFICINA_VENTAS+'">'+data[i].OFICINA_VENTAS+' - '+data[i].DESCRIPCION+'</option>';
			  } 
			  //Agregar todas las oficinas
			  if(op == 'S'){
				ofc = '<option value="'+org+'">'+org+' - TODAS</option>';
				ofc += tmp;
			  }else{
		        ofc += tmp;
			  }		  
		}
	}).fail(function(data){
		console.error(data);
	});	 
	return ofc;
}
//
function OficinasVentasAll(op){ 
//La variable op recibe S o N esto con el fin de saber si quiere que aparezca la opcion de todas las oficinas 
  var tmp = '';
  var ofc = '';
  var org = ''; 
	$.ajax({
		url: "../models/Usuarios.php",
		global: false,
		type: "POST",
		data : ({ 
		op: "18"
		}),
		dataType: "json",
		error: function (xhr, status, err) {
			console.error(err);
		  },
		async:false,
		success: function(data){
			  for(var i=0; i<=data.length-1; i++){
				org  =  data[i].ORGANIZACION_VENTAS;
				tmp += '<option value="'+data[i].OFICINA_VENTAS+'">'+data[i].OFICINA_VENTAS+' - '+data[i].DESCRIPCION+'</option>';
			  } 
			  //Agregar todas las oficinas
			  if(op == 'S'){
				ofc = '<option value="0">TODAS</option>';
				ofc += tmp;
			  }else{
		        ofc += tmp;
			  }		  
		}
	});	 
	return ofc;
}

function Almacenes(ofc = ''){ 
//La variable op recibe S o N esto con el fin de saber si quiere que aparezca la opcion de todas las oficinas 
  var tmp = '';
  var alm = '';
  var org = ''; 
	$.ajax({
		url: "../models/Usuarios.php",
		global: false,
		type: "POST",
		data : ({ 
		   op: "12"
		}),
		dataType: "json",
		error: function (xhr, status, err) {
			console.error(err);
		  },
		async:false,
		success: function(data){
			  for(var i=0; i<=data.length-1; i++){
				  if(ofc == ''){
					alm += '<option value="'+$.trim(data[i].ALMACEN)+'">'+$.trim(data[i].ALMACEN)+' - '+data[i].DESCRIPCION+'</option>';
				  }else{
				     if($.trim(data[i].OFICINA_VENTAS) == ofc){
					    alm += '<option value="'+$.trim(data[i].ALMACEN)+'">'+$.trim(data[i].ALMACEN)+' - '+data[i].DESCRIPCION+'</option>';
					 }
				  }
			  } 	
			  
		}
	});	 
	return alm;
}





function _tsk_CargarTiposTareas(){
	
	    if(sw_sub_dir){// verifica si estoy en vistas de sistemas 
			url="../../models/sys/SoporteTecnico.php";
		}else{
			url="../models/sys/SoporteTecnico.php";
		}
	
   $.ajax({     
		    url		: 	url,
			global	: 	false,
			type	: 	"POST",
			data 	: 	({op:"C_TP"}),
			dataType: 	"json",
			async	:	true,
			success	: function(data)
			{  
			   var p='<option value="0">Seleccione</option>';
				
               for(var i=0;i<data.length;i++){
				   var cadena=data[i];
 				  p+="<option  value='"+cadena.id+"'>"+cadena.tipo+"</option>";
			   }//for
				
			   $("._tsk_tipo_tarea").html(p); 
			}
		}).fail(function(data){
	       console.error(data);
   		});		
	
}


function _tsk_Subtipos(id){
	
	$("._tsk_prioridad").val(0);
	
		if(sw_sub_dir){
			url="../../models/sys/SoporteTecnico.php";
		}else{
			url="../models/sys/SoporteTecnico.php";
		}
		
   $.ajax({     
		    url		: 	url,
			global	: 	false,
			type	: 	"POST",
			data 	: 	({op:"SC_TP",id:id}),
			dataType: 	"json",
			async	:	true,
			success	: function(data)
			{ 
			   
			  var p='<option value="0" selected>Seleccionar</option>'; 
				
		       for(var i=0;i<data.length;i++){
				   
				   var cadena=data[i];
 				  p+='<option  value="'+cadena.id+'" title="'+cadena.tipo+'" onclick="_tsk_GetPrioridad('+cadena.id+')" >- '+cadena.tipo+'</option>';
				   
			   }//for
				
			   $("._tsk_sub_tipo_tarea").html(p);
				
			}
   }).fail(function(data){
	   console.error(data);
   });
}



function AddTicket(){
	

	var id_tipo		=$("._tsk_tipo_tarea").val();
	var id_sub_tipo	=$("._tsk_sub_tipo_tarea").val();
	var nota		=$("._tsk_mensaje").val();
	var prioridad	=$("._tsk_prioridad").val();
	
		if(sw_sub_dir){
			url="../../models/sys/SoporteTecnico.php";
		}else{
			url="../models/sys/SoporteTecnico.php";
		}
	
	
	   $.ajax({     
		    url		: 	url,
			global	: 	false,
			type	: 	"POST",
			data 	: 	({op:"SOP_TEC_I",
						  
						  id_tipo		:id_tipo,
						  id_sub_tipo	:id_sub_tipo,
						  oficina		:0,
						  dpto			:0,
						  nota			:nota,
						  prioridad		:prioridad,
						  usuario		:0,
						  emp_id		:0,
						  fecha_ini		:' ',
						  fecha_fin		:' '
						 }),
			dataType: 	"json",
			async	:	true,
			success	: function(data)
			{
				
				if(data.length>0){
					
					if(!data[0].error){
						
						_tsk_limpiar();
						Swal.fire('Ok','Solicitud enviada <br> ticket <h4><b>#'+data[0].id+'</b></h4>','success');
						
					}else{
						Swal.fire('Error','No se puedo enviar la solicitud, por favor intente nuevamente!','error');
					}
					
				}
			}
	   }).fail(function(data){
		   console.error(data);
	   });
	
}

function _tsk_limpiar(){
	
	$("._tsk_tipo_tarea").html(""); 
	$("._tsk_sub_tipo_tarea").html("");
	$("._tsk_mensaje").val("");
	$("._tsk_prioridad").val("0");
	_tsk_CargarTiposTareas();
	$("._tsk_btn_enviar").attr("disabled",true);
	$("._tsk_sub_tipo_tarea").attr("disabled",true);
	$("._tsk_mensaje").attr("disabled",true);
	
}


async function procesar(){
		

	
			var id_tipo		=$("._tsk_tipo_tarea").val();
			var id_sub_tipo	=$("._tsk_sub_tipo_tarea").val();
			var nota		=$("._tsk_mensaje").val();
			var prioridad	=$("._tsk_prioridad").val();
			//canvas=$("#mycanvas");
			const $canvas = document.querySelector("#mycanvas");
	
			// Convertir la imagen a Base64 y ponerlo en el enlace
			const data = $canvas.toDataURL("image/png");

			const fd = new FormData();

	
		if(sw_sub_dir){
			url="../../models/sys/SoporteTecnico.php";
		}else{
			url="../models/sys/SoporteTecnico.php";
		}
	
		$.ajax({     
		    url		: 	url,
			global	: 	false,
			type	: 	"POST",
			data 	: 	({op:"SOP_TEC_I",
						  imagen		:data,
						  id_tipo		:id_tipo,
						  id_sub_tipo	:id_sub_tipo,
						  oficina		:0,
						  dpto			:0,
						  nota			:nota ,
						  prioridad	:prioridad,
						  usuario		:0,
						  emp_id		:0,
						  sw_cargo_img	:sw_cargo_img,
						  fecha_ini:'',
						  fecha_fin:''
						 }),
			dataType: 	"json",
			async	:	true,
			success	: function(data)
			{ 
					var item=data[0];

					if(item.error){
						//Swal.fire("Error","Error al intentar guardar el ticket . Consulte el administrador. ","error");	
						swal("Error","Error al intentar guardar el ticket . Consulte el administrador. ","error");	
					}else{
							BorrarImg();
							$("._tsk_tipo_tarea").val(0);
							$("._tsk_sub_tipo_tarea").html("");
							$("._tsk_mensaje").val("");
							$("._tsk_prioridad").val(0);
							//Swal.fire("Ok","Ticket generado #"+item.id,"success");	
							swal("Ok","Ticket generado #"+item.id,"success");	
							$(".buttom-btn").removeClass('buttom-btn-hide');
							$(".contact-form-page").removeClass('show-profile');
							$(".contact-form-page").height($(window).height()*0);

					}
			}
		   }).fail(function(data){
			   console.error(data);
		   });
			
}



function CalificarTarea(ob,id){
	
	calificacion=$(ob).find("option:selected").val();
	obs=$.trim($(ob).parent().parent().find("td").eq(5).find("textarea").val());

	
	 if(confirm("Esta seguro que desea calificar la atrea?")){
	
		$.ajax({     
				url		: 	url,
				global	: 	false,
				type	: 	"POST",
				data 	: 	({op:"UP_CAL",id:id,calificacion:calificacion,obs:obs }),
				dataType: 	"json",
				async	:	true,
				beforeSend:function(){
					$("select,textarea").attr("disabled",true);
				},
				success	: function(data)
				{ 
					
					$("select,textarea").attr("disabled",false);
					tr=$(ob).parent().parent();
					tr.find("td").eq(5).find("textarea").attr("disabled",true);
					$(ob).attr("disabled",true);
				}
				}).fail(function(data){
					console.error(data);
					$("select,textarea").attr("disabled",false);
				});		 
		 
	 }else{
		 $(ob).val(0);
	 }
	
}

function _tsk_ticketTerminados(){

	var n=0;
	
		if(sw_sub_dir){
			url="../../models/sys/SoporteTecnico.php";
		}else{
			url="../models/sys/SoporteTecnico.php";
		}	
	
   $.ajax({     
		    url		: 	url,
			type	: 	"POST",
			data 	: 	({op:"T_PENDIENTES"}),
			dataType: 	"html",
			async	:	true,
		    beforeSend:function(){
				
			},
			success	: function(data)
			{ 
				n=data
			}
		}).fail(function(data){
			console.error(data);
		}).then(function(data){
	   			n=data;
	   
	   			if(n>0){
					$(".n_tickets_alert").html(n);
					
					 if(abierto==false){
						$(".n_tickets_alert").show();
					 }
					
				}else{
					$(".n_tickets_alert").hide();
				}
				
   		});	
	
	return n;
	
}

function TicketVistos(ids){
	
	  if(sw_sub_dir){
			url="../../models/sys/SoporteTecnico.php";
		}else{
			url="../models/sys/SoporteTecnico.php";
		}	
	    $.ajax({     
		    url		: 	url,
			type	: 	"POST",
			data 	: 	({op:"M_VISTOS",ids:ids}),
			dataType: 	"HTML",
			async	:	true,
			success	: function(data)
			{ 	
				
			}
		}).fail(function(data){
			console.error(data);
		});
	
	
}


function CargarTickets(){
	
		if(sw_sub_dir){
			url="../../models/sys/SoporteTecnico.php";
		}else{
			url="../models/sys/SoporteTecnico.php";
		}
	
	   $("._tsk_list_tickets").html("");
	
	    $.ajax({     
		    url		: 	url,
			global	: 	false,
			type	: 	"POST",
			data 	: 	({op:"S_SP_TECNICOS_HIST",id:0,fecha_ini:'',fecha_fin:'',estado:'P', sw_cal:0 ,top:10,tipo:'',visto:'0' ,order:'estado'}),
			dataType: 	"json",
			async	:	false,
		    beforeSend:function(){
				$("._tsk_list_tickets").html('<div class="alert alert-info">Cargando...</div>');	
			},
			success	: function(data)
			{ 
				if(data.length>0){
					
					tb='<table class="table " width="90%">'+
							'<thead>'+
								'<tr>'+
									'<th width=>#</th>'+
									'<th>Tipo</th>'+
									'<th>Inicio</th>'+
									'<th>Fin</th>'+
									'<th>Respuesta</th>'+
									'<th >Observacion</th>'+
									/*'<th >Cal</th>'+*/
									
								'</tr>'+
							'</thead>'+
						'<tbody>';
					
					var ticket_vistos=new Array();
					
					for(var i=0;i<data.length;i++){
						
						var d=data[i];
						
						calificacion='';
						color_fila	='';
						
						
						if(d.tipo_resp=='S'){
							color_fila="success";
						}
						
						if(d.tipo_resp=='R'){
							color_fila="danger";
						}

						if(d.fecha_hora_resp === null ||  d.fecha_hora_resp === 'null'){
							d.fecha_hora_resp='';
						}
						
						ticket_vistos.push(d.id);
						
						
						tb+='<tr>'+
								'<td class="table-'+color_fila+'">'+d.id+'</td>'+
								'<td class="table-'+color_fila+'">'+d.tipo+'</td>'+
								'<td class="table-'+color_fila+'">'+d.fecha_sol+'</td>'+
								'<td class="table-'+color_fila+'">'+d.fecha_hora_resp+'</td>'+
								'<td class="table-'+color_fila+'">'+d.respuesta+'</td>';
							
						
						
							selected='';
							dis		='';
						
							if(d.calificacion>0){
								dis="disabled";
							}
						
						
						   if(d.calificacion==0 && d.fecha_hora_resp!=''){
								
								
								tb+='<td class="table-'+color_fila+'"><textarea class="form-control alert-warning" maxlength="500" row="2"></textarea></td>';
								//tb+='<td class="table-'+color_fila+'"><select class="form-control" '+dis+' onchange="CalificarTarea(this,'+d.id+')" >';

								tb+='<option value="0">Calificar</option>';

								for(var j=1;j<=5;j++){

									if(j==d.calificacion){
										selected="selected";
									}

									tb+='<option value="'+j+'"  '+selected+' >'+j+'</option>';
								}
								tb+='</select></td>';
								
							}else{
								
								tb+='<td class="table-'+color_fila+'"><textarea class="form-control alert-warning" maxlength="500" readonly row="2"></textarea></td>';
								//tb+='<td class="table-'+color_fila+'"><input type="text" class="form-control" value="'+d.calificacion+'"  readonly ></td>';
							}

					//	tb+='</td>';
						
						//tb+='<td><textarea class="form-control alert-warning" '+dis+' row="2"></textarea></td>';
						
						tb+='</tr>';
					}
					
					tb+='</tbody>'+
						'</table>';
					
					
					$("._tsk_list_tickets").html(tb);
					
				//	TicketVistos(ticket_vistos);
					
					
				}else{
					$("._tsk_list_tickets").html('<div class="alert alert-danger">No hay tickets !</div>');
				}
				
			}
	   }).fail(function(data){
		   console.error(data);
	   });
	
}


var sw_sub_dir		=false;
var sw_cargar_task	=false;


var css=document.getElementsByTagName('link');

for(j=0;j<css.length;j++){
		
	item=css[j];

	url_base=item.ownerDocument.documentElement.baseURI;

	split_string=url_base.split("/");

	if(split_string.indexOf("calidad")!=-1 || split_string.indexOf("sys")!=-1 || 	split_string.indexOf("humana")!=-1){
			sw_sub_dir=true;
	}

}	//for




function PermisosTask(){

	
  var grupo = $('#grupo').val();
	
	
  if(sw_sub_dir){
	  url='../../models/Menu.php';
  }	else{
	  url='../models/Menu.php';
  }
  
  $.ajax({
		url		: url,
		global	: true,
		type	: "POST",
		data 	: ({ op	: "CargarModulos2",grupo:grupo}),
		dataType: "json",
		async	:true,
		success: function(data){
		
		 for(var i=0; i<=data.length-1; i++){
			 
			 var fila = data[i];
			 
			 if(fila.NUMERO=='0209'){
				
		$(document).ready(function(){
			$(document).on('visibilitychange', function() {
				if (document.visibilityState === 'visible') {
				  // La pestaña se ha vuelto visible
				  Listar_estado_actual();
				} else {
				  // La pestaña se ha vuelto invisible
				}
			  });
			  $("#i_org1").hide();
			  $("#i_org2").hide();

	if($("#org").val==1000){
 	  $("#i_org1").show();
  	}else{
		$("#i_org2").show();
 	} 
			/*setInterval(function() {
				// Código del evento que deseas ejecutar cada 10 segundos
				Listar_estado_actual();
			  }, 10000);*/			
			  abierto=false;

				setInterval(function(){
					//parseInt(_tsk_ticketTerminados());
				},8000);


				var cssId = 'myCss';  // you could encode the css path itself to generate id..

				if (!document.getElementById(cssId))
				{
						var head  = document.getElementsByTagName('head')[0];

						var link  = document.createElement('link');
						link.id   = cssId;
						link.rel  = 'stylesheet';
						link.type = 'text/css';

						if(sw_sub_dir){
							link.href = '../../resources/css/CssBtnTask.css';
						}else{
							link.href = '../resources/css/CssBtnTask.css';
						}

						link.media = 'all';

					try{
						add=head.appendChild(link);
					} catch(err) {

						}


				}


				$("body div.wrapper").remove();

				div='<div id="icono_gay1" class="n_tickets_resultos n_tickets_alert" style="display:none"></div><div class="wrapper window_task" >'+
						'<input type="hidden" class="_tsk_prioridad" readonly  value="0">'+
						'<div id="icono_gay3" class="contact-form-page"  >'+
						   '<h5 style="color:black"><b>Montar ticket</b></h5><br>'+
							'<div class="form-group" style="display:">'+
								'<label for="">Tipo</label>'+
								'<select class="form-control _tsk_tipo_tarea "  ></select>'+
							'</div>'+
							'<div class="form-group" style="display:">'+
								'<label for="">Tipo</label>'+
								'<select class="form-control _tsk_sub_tipo_tarea" multiple style="height:80px" disabled ></select>'+
							'</div>'+
							'<div class="form-group" style="display:">'+
								'<label for="mensaje">Descripción</label>'+
								'<textarea class="form-control _tsk_mensaje alert-warning" maxleght="500"  rows="4" disabled  required="required"></textarea>'+
							'</div>'+
							'<div class="form-group" style="display:">'+
								'<canvas class="_tsk_mycanvas" style="border:1px solid grey;height:100px; width:100%" id="mycanvas" title="PRESIONA CTRL+V">'+

							'</div>'+
							'<button   class="btn btn-sm btn-info _tsk_btn_enviar" disabled>Enviar</button>'+
							'<button   class="btn btn-sm btn-danger" id="btn-borrar-canvas" style="display:none" onclick="BorrarImg()">Eliminar imagen</button>'+
							'<button   class="btn btn-sm btn-danger top-btn2 " ><b>X</b></button>'+
							'-<button   class="btn btn-sm _tsk_btn_mis_tsk btn-danger" style="border:1px solid black;margin-right:3px; border-radius:5px" >Tickets pendientes <span class="badge bg-danger n_tickets_alert" style="display:none"></span></button>'+

						'</div>';

				  if(sw_sub_dir){
					  div+= '<a   class="buttom-btn btn_tsk" href="#"><img src="../../resources/icons/soporte-ticket.png" width="35" height="35"></a>';
				  }else{
					  div+='<a   class="buttom-btn btn_tsk" href="#"><img src="../resources/icons/soporte-ticket.png" width="35" height="35"></a>';
				  }


				  div+='</div> ';

				$("body").append(div);
				_tsk_CargarTiposTareas();

			   // $( ".btn_tsk,._tsk_btn_enviar,.contact-form-page" ).draggable();

				$(window).resize(function(){
					//$(".buttom-btn").trigger("click");
				});		  

				 $(window).scroll(function() {


						if ($(window).scrollTop() <100) { 
						  $(".btn_tsk,.window_task").fadeIn();//.fadeOut();
						} else {
						  $(".btn_tsk,.window_task").fadeOut();//.fadeIn();
						}
				  });

				$("._tsk_btn_mis_tsk").click(function(){

					$("._tsk_modal_tickets").remove();

					h_s=$(window).height()*0.8;

					var dialog='<div class="modal fade _tsk_modal_tickets" id="_tsk_modal_tickets" tabindex="-1" role="dialog"   >'+
									'<div class="modal-dialog modal-lg" style="width:80%" >'+
									  '<div class="modal-content">'+
										'<div class="modal-header">'+
										  '<button type="button" class="close" data-dismiss="modal">'+
											'<span aria-hidden="true">×</span><span class="sr-only">Cerrar</span>'+
										  '</button>'+
										  '<h4 class="modal-title" id="">MIS TICKETS PENDIENTES</h4>'+
										'</div>'+
										'<div class="modal-body">'+
										  '<div class="row"  >'+
											 '<div class="_tsk_list_tickets" style="overflow:scroll;padding:10px"></div>'+               
										  '</div>'+
										'</div>'+
										'<div class="modal-footer">'+
										  '<button  class="btn btn-default _tsk_cerrar_dialog" data-dismiss="modal"  >Cerrar</button>'+
										'</div>'+
									  '</div>'+
									'</div>'+
								  '</div>';

					$("body").append(dialog);
					$("._tsk_modal_tickets").modal("show");
					h_dialog=$("._tsk_modal_tickets").height();
					//h_body_dialog=h_dialog*0.8;//altura del dialog
					//$("._tsk_list_tickets").height(h_body_dialog);
					CargarTickets();

				});


				$("._tsk_cerrar_dialog").click(function(){
					$("#_tsk_modal_tickets").modal("destroy");
				});


				$(".buttom-btn").click(function(){

					$(".top-btn2").addClass('top-btn-show');
					$(".contact-form-page").addClass('show-profile');
					$(this).addClass('buttom-btn-hide')
					$(".contact-form-page").height($(window).height()*0.80);
					abierto=true;
				});

				$(".top-btn2").click(function(){
					$(".buttom-btn").removeClass('buttom-btn-hide');
					$(".contact-form-page").removeClass('show-profile');
					$(".contact-form-page").height($(window).height()*0);
					$(".n_tickets_resultos").show();
					abierto=false;
				});	

				$("._tsk_tipo_tarea").change(function(){

					_tsk_Subtipos($(this).val());

				});


				$("._tsk_mensaje").keyup(function(){

					var mensaje=$.trim($(this).val());

					if(mensaje.length>5){

						$("._tsk_btn_enviar").attr("disabled",false);
					}

				});

				$(".btn_tsk").click(function(){


					if($(".contact-form-page").is(":visible")){

					   $(".n_tickets_resultos").hide();

					}else{
						$(".n_tickets_resultos").show();
					}
				});


				$("._tsk_tipo_tarea,._tsk_sub_tipo_tarea,._tsk_mensaje").change(function(e){

					if($("._tsk_tipo_tarea").val()>0){

						$("._tsk_sub_tipo_tarea").attr("disabled",false);

						if($("._tsk_sub_tipo_tarea").val()>0){

							$("._tsk_mensaje").attr("disabled",false);
							var mensaje=$.trim($("._tsk_mensaje").val());

							if(mensaje.length>5){

								$("._tsk_btn_enviar").attr("disabled",false);

							}

						}else{
							$("._tsk_mensaje").attr("disabled",true);
						}

					}else{
						$("._tsk_sub_tipo_tarea").attr("disabled",true);
						$("._tsk_mensaje").attr("disabled",true);
						$("._tsk_sub_tipo_tarea").html("");
					}

				});

					$(".wrapper").bind("contextmenu",function(e){
						return false;
					});

					$(".wrapper").click(function(){
						$(this).css("border-color","black");
					});

					$("#mycanvas").click(function(){
						$(this).css("border-color","blue");
					});

						//$btnEnviar=$("._tsk_btn_enviar");	
					btnEnviar=$("._tsk_btn_enviar");

					btnEnviar.click( procesar );				 

				});
		
			}
		 }//for

	 }
  }).fail(function(data){
	  console.error(data);
  });
		
}
//PermisosTask();

const  Boton_estados =()=>{

$(function(){
	Listar_estado_disponibles();
	Listar_estado_actual();
	$("#Guarda_estado").click(function(){
		Guardar_estado();   
	});
});

	/*
	var modal=`<div id="ModalEstado" class="modal fade bd-example-modal-lg" role="dialog">
	<div class="modal-dialog modal-lg">
	  <div class="modal-content">
		<div class="modal-header">
		  <button type="button" class="close" data-dismiss="modal">&times;</button>
		  <h4 class="modal-title">FUNCION ACTUAL -- Seleccione el nuevo estado de sus labores ---</h4>
		</div>
		<div class="modal-body d-flex" id="ContenidoEstado">
  		  		<div id="body_estados" class="card-icon-content" ></div>
		</div>
		<div class="modal-footer">
		<button type="button" class="btn btn-success" data-dismiss="modal" id="Guarda_estado">Guardar</button>
 		</div>
	  </div>
	</div>
  </div>
  <div id=.floatingButton" class="floating-button">
  </div>`;
  
  $("body").append(modal);
 
   $(function(){
		$("#estadoButtonset").buttonset();

		var .floatingButton = $('.floatingButton');
		.floatingButton.draggable({
			containment: 'window'
		});

		$(".floatingButton").click(function(){
			Listar_estado_disponibles();
			$('#ModalEstado').modal('show'); 
		});
		$("#Guarda_estado").click(function(){
			Guardar_estado();   
		});
		Listar_estado_actual();		   
	   
   })
   $(".floatingButton").hide();
   if ($("#Rol").val() == '1' ||  
   		$("#Rol").val() == '70' || 
   		$("#Rol").val() == '11' || 
   		$("#Rol").val() == '12' || 
   		$("#Rol").val() == '13' || 
   		$("#Rol").val() == '48' || 
   		$("#Rol").val() == '21' || 
   		$("#Rol").val() == '14')
	{	$(".floatingButton").show();
} */
}
  
const  Listar_estado_actual =()=>{
  
	$.ajax({
		   url     : "../models/Menu.php",
		   global  : false,
		  type     : "POST",
		  data     : ({ op: "Listar_estado_actual",
		  idusuario : $('#IdUser').val()}),
		  dataType : "json",
		  async    : true,
		  success  : function(data){
			if(data.length>0){
			for(var i=0; i<=data.length-1; i++){
			   var fila = data[i];
		
 			   $('.floatingButton').html(fila.ICONO+'<span>Actividad Actual</span>');
			   //$('.floatingButton').css('background-color', fila.COLOR);
 			}//for
		}
		else
		{
			$('.floatingButton').html('<i class="fas fa-door-open"></i>');
			//$('.floatingButton').css('background-color', '#333');	
		}
		  }
	}).fail(function(error){
		//console.error(error)
	});
  }
  const Listar_estado_disponibles =()=>{
	var tabla="";

	$.ajax({
		   url     : "../models/Menu.php",
		   global  : false,
		  type     : "POST",
		  data     : ({ op: "Listar_estados_disponibles",
		  idusuario : $('#IdUser').val()}),
		  dataType : "json",
		  async    : false,
		  success  : function(data){
	
			for(var i=0; i<=data.length-1; i++){
			   var fila = data[i]; 

				tabla+=` <div id="id_estado_${fila.ID_ESTADO}" class=" text-center card-icon-items"  >
							${fila.ICONO}
							<h4>${fila.ESTADO}</h4>
						</div>`
				
  			}

			  $('#body_estados').html(tabla);
			    var items= document.querySelectorAll(".card-icon-items");
				const removeClass=()=>{

					 items.forEach(elemento=>{
						 elemento.classList.remove('card-icon-item-selected');
					 }) 	
				}

				items.forEach(item=>{
					item.addEventListener('click',function(){
						removeClass();
						item.classList.add('card-icon-item-selected');
					})
				})  	  
		  		
		  }
	});
  }
const  Guardar_estado =()=>{

  	let estado='';
	
  $("#body_estados div").each(function(){
	  
	  let div = $(this);
	  let isSelected=div.hasClass("card-icon-item-selected")
	  
	  
	  if(isSelected){
		 estado =$(this).attr("id").split("_").pop();
      }
  })	
  $.ajax({
	url     : "../models/Menu.php",
   type     : "POST",
   data      : ({ op: "Guardar_estado",
   idusuario : $('#IdUser').val(),
   estado    
}),
   dataType : "json",
   async    : false,
   success  : function(data){ 
	   if(data.ok){
		  Listar_estado_actual();  
		  $("#ModalActividades").modal("hide") 
	   }else{
		   swal("Error","Ha ocurrido un error!","error");
	   }
	
}
}).fail(function(error){
	   swal("Error","Ha ocurrido un error!","error");
	  console.error(error)
  });
}
const  AddLibraryJqueryAndUi =()=>{
	/*archivos=[
		{url:'../resources/fontawesome/css/all.min',ext:'css'},
   ]
   for(let archivo of archivos){
	   
	   if(archivo.ext=='js'){
			etiqueta = document.createElement("script");
			etiqueta.src= archivo.url+"."+archivo.ext;
	   }else{
			etiqueta = document.createElement("link");
			etiqueta.href= archivo.url+"."+archivo.ext;
	   }
	  
	  let body =document.getElementsByTagName("body")[0];
	  body.appendChild(etiqueta);
	   
   }*/
}
//AddLibraryJqueryAndUi();
Boton_estados();

const formatNumberES = (n, d=0, signo = '$') => {
    n=new Intl.NumberFormat("es-ES").format(parseFloat(n).toFixed(d))
    if (d>0) {
        // Obtenemos la cantidad de decimales que tiene el numero
        const decimals=n.indexOf(",")>-1 ? n.length-1-n.indexOf(",") : 0;
 
        // aÃ±adimos los ceros necesios al numero
        n = (decimals==0) ? n+","+"0".repeat(d) : n+"0".repeat(d-decimals);
    }
	if(signo == '$'){
		n = signo+n;
	}else{
		n = n+signo;
	}
    return n;
}
function formatNum2(num,prefix){//Da formato moneda a un numero
    prefix = prefix || '';
    num += '';
    var splitStr = num.split('.');
    var splitLeft = splitStr[0];
    var splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '';
    var regx = /(\d+)(\d{3})/;
    while (regx.test(splitLeft)){
       splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
    }
    return prefix + splitLeft + splitRight;
}


  $.fn.serializeArrayAll = function () {
	 var obj = [];
	 $(':disabled[name]', this).each(function () {
			obj.push({name: this.name, value: $(this).val()});
	 });
	return this.serializeArray().concat(obj);
  };

function showToastr(type, message, title = '') {
	toastr.options = {
		"closeButton": true,
		"progressBar": true,
		"positionClass": "toast-top-right",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showDuration": "300",
		"hideDuration": "1000",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};

	switch (type) {
		case 'success':
			toastr.success(message, title);
			break;
		case 'info':
			toastr.info(message, title);
			break;
		case 'warning':
			toastr.warning(message, title);
			break;
		case 'error':
			toastr.error(message, title);
			break;
		default:
			toastr.info(message, title);
	}
}