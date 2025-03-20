$(function(){
	/*$("#tabs").tabs({
	    activate: function (event, ui) { 
		var activeTab = $('#tabs').tabs('option', 'active');
		switch(activeTab){
			case 1:{ConsultarSolicitudes();}break;
			case 2:{}break;
			case 3:{}break;
		}
	  }
	});*/
	$("#libtn2").on('click',function(){
	  ConsultarSolicitudes();
	});
	$("#libtn3").on('click',function(){
	  ConsultarSolicitudesFechas();
	});
	Limpiar();
	//Evento de cambio de departamento para actualizar las ciudades
    $("#dpto").on('change',function(){
	  Ciudades();
    });
	//-------------------------
	  carga_anios('anio');
	  carga_mes('meses');
	//-------------------------
	  carga_anios('anio_f');
	  carga_mes('meses_f');
	//-------------------------
	$("#anio,#meses,#estados,#Oficinas").on('change',function(){
	   ConsultarSolicitudes();
	});	
	//-------------------------
	$("#anio_f,#meses_f,#Oficinas_f").on('change',function(){
	   ConsultarSolicitudesFechas();
	});	
	//-------------------------
	$("#opcodeudor").on('change',function(){
	  if($(this).val() == 'S'){
	    $("#trCodeudor").show();
	  }else{
	    $("#trCodeudor").hide();
	  }
	});
	
});
function Departamentos(){
 $.ajax({
		type: "POST",
		encoding:"UTF-8",
		url: "../models/Solicitudes.php",
		async:true,
		dataType: "json",
		error: function(OBJ, ERROR, JQERROR){
		 alert(JQERROR);
		},
		beforeSend: function(){},
		data: {
		   op:'B_DEPARTAMENTOS'
		},
		success: function(data){
			option ='';
			for(var i=0; i<=data.length-1; i++){
				option +='<option value="'+data[i].DEPARTAMENTO+'">'+data[i].DESCRIPCION+'</option>';
			}
			$("#dpto").html(option);
			Ciudades();
		}
 });
}
function Ciudades(){
 $.ajax({
		type: "POST",
		encoding:"UTF-8",
		url: "../models/Solicitudes.php",
		async:true,
		dataType: "json",
		error: function(OBJ, ERROR, JQERROR){
		 alert(JQERROR);
		},
		beforeSend: function(){},
		data: {
		   op:'B_CIUDADES',
		   dpto:$("#dpto").val()
		},
		success: function(data){
			option ='';
			for(var i=0; i<=data.length-1; i++){
				option +='<option value="'+data[i].CIUDAD+'">'+data[i].DESCRIPCION+'</option>';
			}
			$("#mpio").html(option);
		}
 });
}
function CargarEjecutivos(){//alert($("#Organizacion").val());
	$.ajax({
		url: "../models/Solicitudes.php",
		global: false,
		type: "POST",
		data : ({ 
			op    : 'VENDEDOR',
			org   : $("#Organizacion").val()	
		}),
		dataType: "json",
		async		: false,	
		success: function(data){//alert(data); return false;
		     var lista='';
			 for(var i=0;i<data.length;i++){
				 lista +='<option value="'+data[i].ID+'">'+data[i].NOMBRES+'</option>';
			 }
			 $("#vendedorAprob").html(lista);
	   	}
	}).responseText;
}
function Limpiar(){
	$("#Organizacion").val(parent.parent.$("#org").val());
	var option = OficinasVentas('N');
	
	var listas = '';
	for(var i=1; i<100; i++){
	  var ln = (String(i)).length;
	  var op = '';  
	  if(ln == 1){op='0'+String(i);}else{op=i;}
	  listas += '<option value="'+op+'">'+op+'</option>';
	}
	$("#lista,#listaAprob").html(listas);
	$("#bodega").html(option);
	$("#Oficinas").html(option);
	$("#Oficinas_f").html(option);
	$("#nit").val('');
	$("#r_social").val('');
	$("#r_legal").val('');
	$("#cedula").val('');
	$("#dir").val('');
	$("#tel").val('');
	$("#email").val('');
	$("#dias").val('');
	$("#lista").val('');
	$("#cupo").val('');
	$("#GestionSolicitudes").hide();
	Departamentos();
	$("#trCodeudor").hide();
	CargarEjecutivos();
	
}
function NombreFichero(fic) {
  fic = fic.split('\\');
  return fic[fic.length-1];
}

//

function ReiniciarSol(id){
   
	$.ajax({
		type: "POST",
		encoding:"UTF-8",
		url: "../models/Solicitudes.php",
		async:false,
		dataType: "html",
		error: function(OBJ, ERROR, JQERROR){
		 alert(JQERROR);
		},
		beforeSend: function(){},
		data: {
		   op:'R_SOL',
		   id:id
		},
		success: function(data){
			if(data>0){
				ConsultarSolicitudes();
			    swal("Excelente!", "Solicitud guardada satisfactoriamente", "success");
			 }else{
				  swal("Excelente!", "Error al enviar los datos", "error");
			 }
		}
	});
}


function EliminarSol(id){
		$.ajax({
		type: "POST",
		encoding:"UTF-8",
		url: "../models/Solicitudes.php",
		async:false,
		dataType: "html",
		error: function(OBJ, ERROR, JQERROR){
		 alert(JQERROR);
		},
		beforeSend: function(){},
		data: {
		   op:'D_SOL',
		   id:id
		},
		success: function(data){
			if(data>0){
				ConsultarSolicitudes();
			    swal("Excelente!", "Solicitud eliminada satisfactoriamente", "success");
			   }else{
				    swal("Excelente!", "No se puedo eliminar", "error");
			   }
		}
	});
}
//
function DesError(d){
	err="";
	switch (d){
		case "es":
		   err="Error al enviar el archivo por FTP";
		break;
		case "nv":
		   err="Error en el formato del archivo";
		break;
		case "el":
		   err="Error en la autenticación del FTP";
		break;
		case "ec":
		   err="Error al establecer conexión con el FTP";
		break;
		default :
		   err=d;
		break;
	}
	return " <"+err+"> ";
}
//
function Insertar(){
var nit           = $.trim($("#nit").val());
var razon         = $.trim($("#r_social").val());
var representante = $.trim($("#r_legal").val());
var cedula        = $.trim($("#cedula").val());
var direccion     = $.trim($("#dir").val());
var dpto          = $.trim($("#dpto").val());
var mpio          = $.trim($("#mpio").val());
var tel           = $.trim($("#tel").val());
var email         = $.trim($("#email").val());
var dias          = $.trim($("#dias").val());
var cupo          = $.trim($("#cupo").val());
var lista         = $.trim($("#lista").val());
var bodega        = $.trim($("#bodega").val());
var org           = $.trim($("#Organizacion").val());
var Adjunto       = $.trim(NombreFichero($("#Docs").val()));
var IdAdjunto     = $.trim($("#Docs").attr('id'));
if(nit!='' && razon!='' && representante!='' && cedula!='' && direccion!='' &&  tel!='' && email!='' && dias!='' && cupo!='' && lista!='' && bodega!='' && org!='' && Adjunto!=''){
/*********************************SUBIENDO LA IMAGEN***********************************************/
  if(Adjunto!=''){
	  var inputFile = document.getElementById(IdAdjunto);
	  var file = inputFile.files[0];
	  var data = new FormData();
	  data.append('archivo',file);
	  $.ajax({
			url: "../models/SubirArchivo.php",
			type:'POST',
			contentType:false,
			data:data,
			processData:false,  
			cache:false,
			beforeSend: function(){
			   $("#dvNueva table tr td >input,select").attr("disabled",true);
			},
			success: function(data){
				
				if(data=="s"){
				   
				
					$.ajax({
							type: "POST",
							encoding:"UTF-8",
							url: "../models/Solicitudes.php",
							async:false,
							dataType: "html",
							error: function(OBJ, ERROR, JQERROR){
							 alert(JQERROR);
							},
							beforeSend: function(){},
							data: {
							   op:'I_SOLICITUD_CREDITO',
							   nit:nit,
							   razon:razon,
							   representante:representante,
							   cedula:cedula,
							   direccion:direccion,
							   dpto:dpto,
							   mpio:mpio,
							   tel:tel,
							   email:email,
							   dias:dias,
							   cupo:cupo,
							   lista:lista,
							   org:org,
							   Adjunto:Adjunto,
							   bodega:bodega
							},
							success: function(data){
								if(data=='ok'){
								 swal("Excelente!", "Solicitud guardada satisfactoriamente", "success");
								 $("#dvNueva table tr td >input,select").attr("disabled",false);
								 Limpiar();
								 
								}else{
								 swal("Oops..!", "Error al recibir respuesta :\n"+data, "error");
								 $("#dvNueva table tr td >input,select").attr("disabled",false);
								 return false;
								}
							}
					 });
				}else{
				   alert("No se pudo cargar el archivo ."+DesError(data)+" \n Por favor intente nuevamente!");
				   $("#dvNueva table tr td >input,select").attr("disabled",false);	
				}
			}
	  }).always(function(data){
		  console.log(data);
		  $("#dvNueva table tr td >input,select").attr("disabled",false);
	  });
  }
 /*
*/
 }else{
   swal('Error','Existen campos obligatorios vacios!\nVerifique e intente nuevamente','error');	
 }
}

function ConsultarSolicitudes(){
 $.ajax({
		type: "POST",
		encoding:"UTF-8",
		url: "../models/Solicitudes.php",
		async:false,
		dataType: "json",
		error: function(OBJ, ERROR, JQERROR){
		 alert(JQERROR);
		},
		beforeSend: function(){},
		data: {
		   op     : 'S_SOLICITUD_CREDITO',
		   org    : $("#Organizacion").val(),
		   ofc    : $("#Oficinas").val(),
		   mes    : $("#meses").val(),
		   anio   : $("#anio").val(),
		   estado : $("#estados").val(),
		   dpto   : $("#Dpto").val()
		},
		success: function(data){
			if(data!='' && data !=null){
				    var idRol = $("#rol").val();
					var tabla = '<table class="table" width="100%" id="table_result">'+
								  '<thead>'+
									'<tr>'+
									 '<th>OFICINA</th>'+
									 '<th>FECHA</th>'+
									 '<th>NIT</th>'+
									 '<th>RAZON</th>'+
									 '<th>CEDULA</th>'+
									 '<th>REPRESENTANTE</th>'+
									 '<th>ESTADO</th>'+
									 '<th>SOLICITA</th>'+
									 '<th>CUPO SUG.</th>'+
									 '<th>DIAS SUG.</th>'+
									 '<th>LISTA SUG.</th>'+
									 '<th>CUPO APROB.</th>'+
									 '<th>DIAS APROB.</th>'+
									 '<th>LISTA APROB.</th>'+
									 '<th>DOCS</th>'+
									 '<th>GESTION</th>'+
						             '<th>REST</th>';
							if(idRol == 48 || idRol == 1 || idRol == 17){
						      tabla+='<th>DEL</th>';
							}
							tabla+='</tr>'+
								  '</thead>'+
								  '<tbody>';
				   for(var i=0; i<=data.length-1; i++){
					     tabla+='<tr>'+
						          /*0*/  '<td>'+data[i].oficina_desc+'</td>'+
						          /*1*/  '<td>'+data[i].fecha+'</td>'+
								  /*2*/  '<td>'+data[i].sol_nit+'</td>'+
								  /*3*/  '<td>'+data[i].sol_razon+'</td>'+
								  /*4*/  '<td>'+data[i].sol_nit_representante+'</td>'+
								  /*5*/  '<td>'+data[i].sol_representante+'</td>'+
								  /*6*/  '<td>'+data[i].estado+'</td>'+ 
								  /*7*/  '<td>'+data[i].usuario+'</td>'+
								  /*8*/  '<td>'+formatNum(data[i].sol_cupo,'$')+'</td>'+
								  /*9*/  '<td>'+data[i].sol_dias+'</td>'+ 
								  /*10*/ '<td>'+data[i].sol_lista+'</td>'+ 
								  /*11*/ '<td>'+formatNum(data[i].sol_cupo_aprobado,'$')+'</td>'+
								  /*12*/ '<td>'+data[i].sol_dias_aprobado+'</td>'+
								  /*13*/ '<td>'+data[i].sol_lista_aprobado+'</td>'+						
								  /*14*/ '<td align="center">'+											
											  '<a href="'+$.trim(data[i].sol_documentos)+'" download>'+ 
											    '<button type="button" class="btn btn-default" aria-label="Left Align">'+
											      '<span class="glyphicon glyphicon-download-alt" aria-hidden="true">'+'</span>'+
												'</button>'+
											  '</a>'+
										 '</td>'+								  
								  /*15*/ '<td align="center" onClick="AbrirGestion(this);">'+
											'<button type="button" class="btn btn-default" aria-label="Left Align" >'+
											  '<span class="glyphicon glyphicon-send" aria-hidden="true">'+'</span>'+
											'</button>'+
										 '</td>'+
								  /*16*/ '<td style="display:none;">'+data[i].sol_id+'</td>'+ 
								  /*17*/ '<td style="display:none;">'+data[i].sol_estado+'</td>'+ 
								 '<td align="center" onClick="ReiniciarSol('+data[i].sol_id+');">'+
												'<button type="button" class="btn btn-default" aria-label="Left Align" >'+
												  '<span class="glyphicon glyphicon-refresh" aria-hidden="true">'+'</span>'+
												'</button>';
								if(idRol == 48 || idRol == 1 || idRol == 17 || idRol == 72){
								 tabla+='<td align="center" onClick="EliminarSol('+data[i].sol_id+',this);">'+
												'<button type="button" class="btn btn-default" aria-label="Left Align" >'+
												  '<span class="glyphicon glyphicon-trash" aria-hidden="true">'+'</span>'+
												'</button>';
								}
								  /*18 '<td align="center" onClick="AbrirGestion(this);">'+
											'<button type="button" class="btn btn-default" aria-label="Left Align" >'+
											  '<span class="glyphicon glyphicon-info-sign" aria-hidden="true">'+'</span>'+
											'</button>'+
										 '</td>'+*/
								  tabla+='</tr>'; 
				   }
				   tabla+='</tbody></table>';
				   $("#dvResultSolicitudes").html(tabla);
				   theTable = $("#table_result");
					$("#filtro").keyup(function() {
					  $.uiTableFilter(theTable, this.value);
					});
			}else{
			   $("#dvResultSolicitudes").html('<h3>No existen registros para las condiciones seleccionadas</h3>');
			}
		}
 });
}


function ConsultarSolicitudesFechas(){
 $.ajax({
		type: "POST",
		encoding:"UTF-8",
		url: "../models/Solicitudes.php",
		async:false,
		dataType: "json",
		error: function(OBJ, ERROR, JQERROR){
		 alert(JQERROR);
		},
		beforeSend: function(){},
		data: {
		   op     : 'S_SOLICITUD_CREDITO_FECHAS',
		   org    : $("#Organizacion").val(),
		   ofc    : $("#Oficinas_f").val(),
		   mes    : $("#meses_f").val(),
		   anio   : $("#anio_f").val(),
		   dpto   : $("#Dpto").val()
		},
		success: function(data){
			if(data!='' && data !=null){
				    var idRol = $("#rol").val();
					var tabla = '<table class="table" width="100%" id="table_result2">'+
								  '<thead>'+
									'<tr>'+
									 '<th>ID</th>'+
									 '<th>RAZON</th>'+
									 '<th>NIT</th>'+	
									 '<th>ENVIO</th>'+
									 '<th>REVISADA</th>'+
									 '<th>ESTUDIO</th>'+
									 '<th>APROBADO</th>'+
									 '<th>RECHAZADO</th>'+								 				 
									 '<th>APLAZADO</th>'+
									'</tr>'+
								  '</thead>'+
								  '<tbody>';
				   for(var i=0; i<=data.length-1; i++){
					     tabla+='<tr>'+
						  /*0*/  '<td>'+data[i].sol_id+'</td>'+
						  /*1*/  '<td>'+data[i].sol_razon+'</td>'+
						  /*2*/  '<td>'+data[i].sol_nit+'</td>'+
						  /*3*/  '<td>'+data[i].sol_fecha_envio+'</td>'+
						  /*4*/  '<td>'+data[i].sol_fecha_revision+'</td>'+
						  /*5*/  '<td>'+data[i].sol_fecha_estudio+'</td>'+
						  /*6*/  '<td>'+data[i].sol_fecha_aprueba+'</td>'+ 
						  /*7*/  '<td>'+data[i].sol_fecha_rechaza+'</td>'+
						  /*13*/ '<td>'+data[i].sol_fecha_aplaza+'</td>';
						 tabla+='</tr>'; 
				   }
				   tabla+='</tbody></table>';
				   $("#dvResultSolicitudesFechas").html(tabla);
				   theTable = $("#table_result2");
					$("#filtro_f").keyup(function() {
					  $.uiTableFilter(theTable, this.value);
					});
			}else{
			   $("#dvResultSolicitudesFechas").html('<h3>No existen registros para las condiciones seleccionadas</h3>');
			}
		}
 });
}
function AbrirDoc(pagina){ 
 window.open("192.168.1.243/calidad/resources/Documentos/"+pagina ,'_self','width=400,height=100','scrollbars=yes');
}
/*
function AbrirFtp(archivo){
 window.open('../models/Descargar_ftp.php?archivo='+archivo ,'popup','width=400,height=100','scrollbars=yes');	
}*/
function AbrirGestion(obj){
	var ob = $(obj).parent();
	//alert(ob.html());
	//return false;
	$("#tdCliente").html(ob.find('td').eq(3).html());
	$("#tdEstado").html(ob.find('td').eq(6).html());
	$("#tdFecha").html(ob.find('td').eq(1).html());
	$("#tdId").html(ob.find('td').eq(16).html());
	$("#tdIdEstado").html(ob.find('td').eq(17).html());
	$("#tdUserSolicita").html(ob.find('td').eq(7).html());
	MostrarObservacion($.trim(ob.find('td').eq(16).html()));
	$("#AddComentario").focus();
	$("#trOp").html('');
	//alert(ob.find('td').eq(17).html());
	if(ob.find('td').eq(17).html() !='A' && ob.find('td').eq(17).html() !='D'){
		if($("#Dpto").val() == 1 || $("#Dpto").val() == 7){
		  if(ob.find('td').eq(17).html()!='P'){
		    $("#trOp").html('<input type="button" class="btn btn-warning" value="Siguiente Estado" onClick="CambiarEstado();">&nbsp;'+ 
		                    '<input type="button" class="btn btn-success" value="Aplazar" id="btnAplazar" onClick="ActualizarSolicitud(\''+ob.find('td').eq(16).html()+'\',\''+ob.find('td').eq(17).html()+'\',\'P\')">');
		  }else{
		   $("#trOp").html('<input type="button" class="btn btn-warning" value="Siguiente Estado" onClick="CambiarEstado();">');
		  }
		  
		}
	}else if(ob.find('td').eq(17).html() !='D'){
      ConsultarAprobacion(ob.find('td').eq(16).html());
	}
	$("#GestionSolicitudes").modal("show");
	
}
function ConsultarAprobacion(id){
  $.ajax({
		type: "POST",
		encoding:"UTF-8",
		url: "../models/Solicitudes.php",
		async:true,
		dataType: "json",
		error: function(OBJ, ERROR, JQERROR){
		 alert(JQERROR);
		},
		beforeSend: function(){},
		data: {
		   op:'S_SOLICITUD_CREDITO_APROB',
		   id:id
		},
		success: function(data){//alert(data);
			var table = '<table class="form" width="100%">'+
			              '<thead>'+
						   '<tr>'+
						    '<th colspan="2">Datos de Aprobacion</th>'+
						   '</tr>'+
						   '<tr>'+
						     '<th width="20%">Cupo Aprobado</th>'+
							 '<td>'+formatNum(data[0].sol_cupo_aprobado,'$')+'</td>'+
						   '<tr>'+
							 '<th>Dias Aprobados</th>'+
							 '<td>'+data[0].sol_dias_aprobado+'</td>'+
						   '</tr>'+
						   '<tr>'+
							 '<th>Lista Aprobada</th>'+
							 '<td>'+data[0].sol_lista_aprobado+'</td>'+
						   '</tr>'+
						   '<tr>'+
							 '<th>Vendedor Asignado</th>'+
							 '<td>'+data[0].vendedor+'</td>'+
						   '</tr>'+
						   '<tr>'+
							 '<th>Codeudor</th>'+
							 '<td>'+data[0].nombre_codeudor+'</td>'+
						   '</tr>'+
						   '<tr>'+
							 '<th>Telefono</th>'+
							 '<td>'+data[0].telefono_codeudor+'</td>'+
						   '</tr>'+
						   '<tr>'+
							 '<th>Direccion</th>'+
							 '<td>'+data[0].direccion_codeudor+'</td>'+
						   '</tr>'+
						   '<tr>'+
							 '<th>Ocupacion</th>'+
							 '<td>'+data[0].ocupacion_codeudor+'</td>'+
						   '</tr>'+
						   '<tr>'+
							 '<th>Fecha Aprobacion</th>'+
							 '<td>'+data[0].sol_fecha_aprueba+'</td>'+
						   '</tr>'+
						   '<tr>'+
							 '<td colspan="2" align="center"><input type="button" value="Generar Carta" class="btn btn-info" onClick="VisulizarCarta(\''+id+'\')"></td>'+
						   '</tr>'+
						  '</thead>'+
						 '</table>';
			$("#trOp").html(table);
		}
	});
}
function VisulizarCarta(id){
	$("#GestionSolicitudes").modal("hide");
	$("#ContenidoPDF").html('<embed src="../resources/tcpdf/CartaAprobacion.php?id='+id+'" frameborder="0" width="100%" height="400px">');
	$("#ModalPDF").modal("show");
}
function MostrarObservacion(id){//alert('Id : '+id);
  $.ajax({
		type: "POST",
		encoding:"UTF-8",
		url: "../models/Solicitudes.php",
		async:true,
		dataType: "json",
		error: function(OBJ, ERROR, JQERROR){
		 alert(JQERROR);
		},
		beforeSend: function(){},
		data: {
		   op:'S_SOLICITUD_OBS',
		   id:id
		},
		success: function(data){//alert(data);
			var texto = '';
			for(var i=0; i<=data.length-1; i++){
				
			   texto+= (data[i].FECHA_OBS+' - '+data[i].USUARIO).bold()+'</br>'+data[i].OBSERVACION+'</br>';
			}
			$("#Comentarios").html(texto);
		}
	});
}
function AddObservacion(e,valor){
	if($('#AddComentario').val() != ''){
		tecla = (document.all) ? e.keyCode : e.which;
		 if(tecla==13) {
		 		$('#Comentarios').append(valor+"</br>");
				$("#AddComentario").val("");
				var id    = $("#tdId").html();
			    var stado = $("#tdIdEstado").html();
				//Insercion de comentario en la base de datos
			     $.ajax({
					type: "POST",
					encoding:"UTF-8",
					url: "../models/Solicitudes.php",
					async:true,
					dataType: "html",
					error: function(OBJ, ERROR, JQERROR){
					 alert(JQERROR);
					},
					beforeSend: function(){},
					data: {
					   op:'I_SOLICITUD_OBS',
					   texto:valor,
					   id:id,
					   stado:stado
					},
					success: function(data){
					}
				});
		 }
	}
}
function CambiarEstado(){
 var dpto    = $("#Dpto").val();
 var estado  = $("#tdIdEstado").html();
 var id      = $("#tdId").html();
 var nestado = '';
 if(dpto == 1 || dpto == 7){
  /*E-Enviadas
	R-Revisadas
	S-Estudio
	A-Aprobadas
	D-Rechazadas*/
	switch(estado){
	   case 'E':{nestado = 'R';}break;
	   case 'R':{nestado = 'S';}break;
	   case 'S':{nestado = 'A';}break;
	}
	ActualizarSolicitud(id,estado,nestado);
	          
 }else{
   alert('No esta autorizado para esto');
 }
}

function ActualizarSolicitud(id,estado,nestado){
  if(nestado!='A' && estado!='P'){
		var txestado = '';  
		switch(nestado){
		   case 'R':{txestado = 'REVISADA';}break;
		   case 'S':{txestado = 'ESTUDIO';}break;
		   case 'P':{txestado = 'APLAZADA';}break;
		 } 
		 //----------------------------------------------------------------------
		 swal({  title  : "Desea cambiar el estado de la solicitud a : "+txestado,   
				 text   : "Despues de aceptar no podra reversar la operacion!",   
				 type   : "warning",    
				 showCancelButton: true,   
				 confirmButtonColor: "#82ED81",   
				 cancelButtonColor: "#FFA3A4",
				 confirmButtonText: "Aceptar",   
				 cancelButtonText : "Cancelar",   
				 closeOnConfirm: true,   
				 closeOnCancel: false
			}).then((result) => {
			  if (result.value) {
				 UpdateEstado(id,nestado);
			  }else{
				 swal("Cancelado", "La operacion ha sido cancelada!", "error");  
			  }
			});
		 /*
		swal({title : "Desea cambiar el estado de la solicitud a : "+txestado,   
			 text   : "Despues de aceptar no podra reversar la operacion!",   
			 type   : "warning",   
			 showCancelButton: true,   
			 confirmButtonColor: "#82ED81",   
			 cancelButtonColor: "#FFA3A4",
			 confirmButtonText: "Aceptar",   
			 cancelButtonText : "Cancelar",   
			 closeOnConfirm: true,   
			 closeOnCancel: true }, 
			 function(isConfirm){  
				 if(isConfirm){
					 UpdateEstado(id,nestado);
				 }else{
					 swal("Cancelado", "La operacion ha sido cancelada!", "error");  
				 }
			 });*/
  }else{
	  
	  swal({ title  : "Aprueba o rechaza esta solicitud",   
			 text   : "Despues de aceptar no podra reversar la operacion!",   
			 type   : "warning",    
			 showCancelButton: true,   
			 confirmButtonColor: "#82ED81",   

			 cancelButtonColor: "#FFA3A4",
			 confirmButtonText: "Aceptar",   
			 cancelButtonText : "Cancelar",   
			 closeOnConfirm: true,   
			 closeOnCancel: false
		}).then((result) => {
		  if (result.value) {
			         $("#diasAprob").val('');
					 $("#cupoAprob").val('');
					 $("#listaAprob").val('');
					 $("#opcodeudor").val('N');
					 $("#CodeudorNombres").val('');
					 $("#CodeudorTelefono").val('');
					 $("#CodeudorDireccion").val('');
					 $("#CodeudorOcupacion").val('');
					 /*
					 $("#DatosAprobacion").dialog({	 		
						title	: "Datos de aprobacion del crédito", 
						width	: $(document).width()-120,
						height	: $(document).height()-120,	
						modal	: true,		
					 }).width( $(document).width()-120).height($(document).height() - 120);*/
					$("#DatosAprobacion").modal("show");
		  }else{
			  UpdateEstado(id,'D');swal("Excelente", "La operacion ha sido realizada con exito!", "success");
		  }
		});
  
	  /*
	  
    swal({   title  : "Aprueba o rechaza esta solicitud",   
			 text   : "Despues de aceptar no podra reversar la operacion!",   
			 type   : "warning",   
			 showCancelButton: true,   
			 confirmButtonColor: "#82ED81",   
			 cancelButtonColor: "#DB4949",
			 confirmButtonText: "APROBAR",   
			 cancelButtonText : "RECHAZAR",   
			 closeOnConfirm: true,   
			 closeOnCancel: false }, 
			 function(isConfirm){  
				 if(isConfirm){
					 $("#diasAprob").val('');
					 $("#cupoAprob").val('');
					 $("#listaAprob").val('');
					 $("#opcodeudor").val('N');
					 $("#CodeudorNombres").val('');
					 $("#CodeudorTelefono").val('');
					 $("#CodeudorDireccion").val('');
					 $("#CodeudorOcupacion").val('');
					 $("#DatosAprobacion").dialog({	 		
						title	: "Datos de aprobacion del crédito", 
						width	: $(document).width()-120,
						height	: $(document).height()-120,	
						modal	: true,		
					 }).width( $(document).width()-120).height($(document).height() - 120);
				 }else{
					 UpdateEstado(id,'D');swal("Excelente", "La operacion ha sido realizada con exito!", "success");
				 }
			 });*/
  }
}

function UpdateEstado(id,nestado){
   $.ajax({
		type: "POST",
		encoding:"UTF-8",
		url: "../models/Solicitudes.php",
		async:true,
		dataType: "html",
		error: function(OBJ, ERROR, JQERROR){
		 alert(JQERROR);
		},
		beforeSend: function(){},
		data: {
		   op:'U_SOLICITUD_CREDITO',
		   id:id,
		   nestado:nestado
		},
		success: function(data){
			if(data=='ok'){
				 var txestado = '';
				  /*E-Enviadas
					R-Revisadas
					S-Estudio
					A-Aprobadas
					D-Rechazadas*/
			     switch(nestado){
				   case 'R':{txestado = 'REVISADA';}break;
				   case 'S':{txestado = 'ESTUDIO';}break;
				   case 'A':{txestado = 'APROBADA';}break;
				   case 'D':{txestado = 'RECHAZADA';}break;
				   case 'P':{txestado = 'APLAZADA';}break;
				 }
				 if(nestado =='P'){$("#btnAplazar").hide();}
			     $("#tdEstado").html(txestado);
	             $("#tdIdEstado").html(nestado);
				 ConsultarSolicitudes();
		    }else{
			  swal('Oops','Ocurrio un error al actualizar el estado','error');
			}
		}
	});
}
function DatosAprobacion(){
	var dias         = $("#diasAprob").val();
	var cupo         = $("#cupoAprob").val();
	var lista        = $("#listaAprob").val();
	var vendedor     = $("#vendedorAprob").val();
	var codeudor     = $("#opcodeudor").val();
	var CodNombre    = $("#CodeudorNombres").val();
	var CodTelefono  = $("#CodeudorTelefono").val();
	var CodDireccion = $("#CodeudorDireccion").val();
	var CodOcupacion = $("#CodeudorOcupacion").val();
	var idSol        = $("#tdId").html();
	var sw           = 0;

    if(codeudor == 'S'){
     if(CodNombre!='' && CodTelefono!='' && CodDireccion!='' && CodOcupacion!=''){
	   sw = 0;
	 }else{
	   sw = 1;
	 }
    }
    if(dias!='' && cupo!='' && lista!='' && sw == 0){
			$.ajax({
				type: "POST",
				encoding:"UTF-8",
				url: "../models/Solicitudes.php",
				async:true,
				dataType: "html",
				error: function(OBJ, ERROR, JQERROR){
				 alert(JQERROR);
				},
				beforeSend: function(){},
				data: {
				   op:'U_SOLICITUD_CREDITO_APROB',
				   dias:dias,
				   cupo:cupo,
				   lista:lista,
				   vendedor:vendedor,
				   codeudor:codeudor,
				   CodNombre:CodNombre,
				   CodTelefono:CodTelefono,
				   CodDireccion:CodDireccion,
				   CodOcupacion:CodOcupacion,
				   idSol:idSol
				},
				success: function(data){
					if(data == 'ok'){
					  swal('Excelente','Solicitud aprobada','success');
					  $("#GestionSolicitudes").dialog('close');
					  $("#DatosAprobacion").dialog('close');
					  ConsultarSolicitudes();
					}else{
					  swal('Oops','Ocurrio un error al actualizar el estado','error');
					}
						
				}
			});
  }else{
    swal('Error','Existen campos obligatorios vacios!\nVerifique e intente nuevamente','error');	
  }
}
