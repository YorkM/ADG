// JavaScript Document
function LimpiarCampos(){
	
  $("#TrListUserRol").hide();
  $("#ListUserRol p").remove();	
  $("#TxtRol").val("");
  $("#IdRol").val("");
  $("#SpanButtonText").text("Guardar");
  
}

//FUNCION QUE BUSCA LOS ROLES 
function BuscarRol(dato){
	
	 $("#ListUserRol").html("");
	
	 $.ajax({     
		  url      : "../models/Roles.php",
		  global   : false,
		  type     : "POST",
		  data     : ({op:"3",dato:dato}),
		  dataType : "json",
		  async    : false,
		  success  : function(data)
			{ 
			     if(data.length>0){
					 var tr="";
					 for(var i=0;i<data.length;i++){
						 datos=data[i];
						 $("#IdRol").val(datos.ID);
						 $("#TxtRol").val(datos.TITULO);
						 
						 if(datos.USUARIO!="N"){
							 $("#ListUserRol").append("<p>"+datos.USUARIO+"</p>"); 
							 $("#TrListUserRol").show();
						 }else{
						       $("#ListUserRol").append("<p><h3>No se encontraron usuarios asociados !</h3></p>"); 
							   $("#TrListUserRol").show(); 
						 }
						
						 
						 $("#WindowsBuscarRol").dialog("close");
						 $("#SpanButtonText").text("Actualizar");
					 }
				 }
			}
		});
}
//FUNCION QUE INSERTA O ACTUALIZA EL ROL

function EnviarRol(){
   	
//verifico si hay que actualizar o insertar
if($("#IdRol").val()>0){
	op="5";
	process="Actualizado";
}else{
   op="4";	
   process="Guardado";
   $("#SpanButtonText").text("Actualizar");
}
if($("#TxtRol").val()!=""){
    // ajax
     $.ajax({     
		  url      : "../models/Roles.php",
		  global   : false,
		  type     : "POST",
		  data     : ({op:op,IdRol:$("#IdRol").val(),titulo:$("#TxtRol").val()}),
		  dataType : "html",
		  async    : false,
		  success  : function(data)
			{ 
			   if(data>0){
				   alert("Registro "+process);
				   $("#IdRol").val(data);
			   }
			}
		});
}else{
    alert("Debe digitar un titulo o descripcion para el ROL!!");	
	$("#TxtRol").focus();
}
	
}

// FUNCTION QUE LISTA TODOS LOS ROLES
function ListarRoles(){
	
  	 $.ajax({     
		  url      : "../models/Roles.php",
		  global   : false,
		  type     : "POST",
		  data     : ({op:"2"}),
		  dataType : "json",
		  async    : true,
		  success  : function(data)
			{ 
			  if(data.length>0){
				 var tr="";
				 var cont=1;
				 $("#TbResult tr:gt(0)").remove();
			     for(var i=0;i<data.length;i++){
					datos=data[i];
					tr+="<tr onclick='BuscarRol("+datos.ID+")'>"+
							 "<td>"+cont+"</td>"+
					         "<td>"+datos.TITULO+"</td>"+
							 "<td>"+datos.FECHA_CREACION+"</td>"+
						"</tr>";
						cont++;
				 }//for
				 $("#TbResult").append(tr);
				 $("#HNoExiste").hide();
				 $("#TbResult").show();
			  }//if(data.length>0){
			}//data
		});	
}

//BUSCA EL ROL POR EL TITULO
function BuscarRolDes(dato){
	
	$.ajax({     
		  url      : "../models/Roles.php",
		  global   : false,
		  type     : "POST",
		  data     : ({op:"6",dato:dato}),
		  dataType : "json",
		  async    : true,
		  success  : function(data)
			{ 
			  if(data.length>0){
				 var tr="";
				 $("#TbResult tr:gt(0)").remove();
				 cont=1;
			     for(var i=0;i<data.length;i++){
					datos=data[i];
					tr+="<tr onclick='BuscarRol("+datos.ID+")'>"+
							 "<td>"+cont+"</td>"+
					         "<td>"+datos.TITULO+"</td>"+
							 "<td>"+datos.FECHA_CREACION+"</td>"+
						"</tr>";
						cont++;
				 }
				 $("#TbResult").append(tr);
				 $("#HNoExiste").hide();
				 $("#TbResult").show();
				 
			  }//if(data.length>0){
				else{
					   $("#HNoExiste").show();
				       $("#TbResult").hide();
				  }
			}//data
		});	
	
}
function AbrirVentanaBusqueda(){
	
   	$("#WindowsBuscarRol").dialog({				
							 title	: "Busqueda de Roles",
							 width	: $(window).width()-100,
							 height	: $(window).height()-200,	
							 modal	: true
						 });
	$("#TxtBuscarRol").focus();	
	$("#TxtBuscarRol").val("");	
    $("#TbResult").hide();
	$("#TbResult tr:gt(0)").remove(); 
}

//funcion que elimina un rol
function Eliminar(){
  	
	 $.ajax({     
		  url      : "../models/Roles.php",
		  global   : false,
		  type     : "POST",
		  data     : ({op:"7",IdRol:$("#IdRol").val()}),
		  dataType : "html",
		  async    : false,
		  success  : function(data)
			{ 
			  if(data>0){
				  if(data==2){
					  alert("El rol no se puede eliminar porque existen registros asociados a él!!");
				  }else{
					   alert("El Rol se elimino correctamente!!"); 
					   LimpiarCampos()
				  }
			  }else{
				 alert("No se puedo eliminar el Rol!!");  
			  }
			}
		});
}

$(window).resize(function(e) {
    if($("#WindowsBuscarRol").is(":visible")){
		$("#WindowsBuscarRol").dialog({"width":  $(window).width()-100});
	}
});

$(document).ready(function(){

//EVENTOS ONCLIK
$("#btnGuardar").click(function(){
	EnviarRol();
});

$("#btnNuevo").click(function(){
	LimpiarCampos();
	$("#TxtRol").focus();
});

$("#btnListarRol").click(function(){
	ListarRoles();
});

$("#btnEliminar").click(function(){
  if($("#IdRol").val()>0){
	  	Eliminar(); 
  }
 
});

//boton buscar
$("#btnBuscar").click(AbrirVentanaBusqueda);

//eventos KEYUP
$("#TxtBuscarRol").keyup(function(){
	 var dato=$.trim($(this).val());
	 if(dato!=""){
		 if(dato.length>=3){
		   BuscarRolDes(dato);
		 }
	 }else{
		   	 $("#HNoExiste").hide();
			 $("#TbResult").hide();
			  $("#TbResult tr:gt(0)").remove(); 
	      } 
});

//
$("#TxtRol").keyup(function(){
	var dato=$(this).val();
	if(dato!=""){
		
	}else{
	       $("#TrListUserRol").hide(); 
		   $("#ListUserRol p").remove(); 	
	}
});

});