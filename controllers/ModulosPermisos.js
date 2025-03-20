// JavaScript Document
function CargarModulos(){
	
$.ajax({     
		  url: "../models/Modulos.php",
			global: false,
			type: "POST",
			data : ({op:"1"}),
			dataType: "json",
			async:false,
			success: function(data)
			{  // alert(data); return false;
			   $("#TbModulos tr:gt(0)").remove();
			   $("#TbPermisos tr:gt(0)").find("").removeClass("");
			   var tb="";
               for(var i=0;i<data.length;i++){
				 cadena=data[i];
				   tb+="<tr onclick='SeleccionarModulo(this,"+cadena.ID+")'>"+
				   		   "<td align='right' style='padding-left:20px;'>"+cadena.NUMERO+"</td>"+
						   "<td>"+cadena.TITULO+"</td>"+
						   "<td style='display:none'>"+cadena.ID+"</td>"+
						"</tr>"; 

			   }//for
			   $("#TbModulos").append(tb);
			}
		});	  		
}
//
function CargarPermisos(){
	
$.ajax({     
		  url: "../models/Permisos.php",
			global: false,
			type: "POST",
			data : ({op:"3"}),
			dataType: "json",
			async:false,
			success: function(data)
			{   
			  // alert(data);return false;
			   $("#TbPermisos tr:gt(0)").remove();
			   var tb="";
			   
               for(var i=0;i<data.length;i++){
				 cadena=data[i];
				 
				   tb+="<tr class='' onclick='SelecionarPermiso(this,"+cadena.ID+")'>"+
				   		   "<td style='padding-left:20px;'>"+cadena.ID+"</td>"+
						   "<td>"+cadena.TITULO+"&nbsp;("+(cadena.DESCRIPCION)+")</td>"+
						"</tr>"; 
				 
			   }//for
			   $("#TbPermisos").append(tb);
			}
		});	  			
	
}
//
function SeleccionarModulo(ob,id){

 $("#TxtIdModulo").val(id);
 $("#TxtIdPermiso").val("");	
 $("#TbModulos tr:gt(0)").removeClass("FilaSeleted");
 $("#TbModulos tr:gt(0)").removeClass("FilaCheck");
 $("#TbPermisos tr:gt(0)").removeClass("FilaSeleted");
 $("#TbPermisos tr:gt(0)").removeClass("FilaCheck");
 $(ob).addClass("FilaSeleted");
 $(ob).addClass("FilaCheck");
 CargarPermisosAsociado(id);
 
}

function SelecionarPermiso(ob,id){
	
 
 if($("#TxtIdModulo").val()>0){
	 //verifico si la clase de  PermisoAgregado ya esta 
	 cl=$(ob).find("td").eq(0).attr("class");
	 if(cl!=undefined){
		 
		 if(cl.indexOf("PermisoAgregado")!=-1){
			 alert("Este Permiso ya se encuentra agregado!!");
		 }else{
			     if(cl.indexOf("FilaSeleted")!=-1){
					 $("#TbPermisos tr:gt(0)").removeClass("FilaSeleted");
				     $("#TbPermisos tr:gt(0)").removeClass("FilaCheck");
					 $("#TxtIdPermiso").val("");
				 }else{
						 $("#TbPermisos tr:gt(0)").removeClass("FilaSeleted");
						 $("#TbPermisos tr:gt(0)").removeClass("FilaCheck");
						 $(ob).addClass("FilaSeleted");
						 $(ob).addClass("FilaCheck");
						 $("#TxtIdPermiso").val(id);
				 	  }
		 }
	 }else{
			 $("#TbPermisos tr:gt(0)").removeClass("FilaSeleted");
			 $("#TbPermisos tr:gt(0)").removeClass("FilaCheck");
			 $(ob).addClass("FilaSeleted");
			 $(ob).addClass("FilaCheck");
			 $("#TxtIdPermiso").val(id);		 
		 
	 }
 }else{
	  alert("Debe seleccionar un Modulo primero!!"); 
 }
}

//
function BuscarModuloNom(id){
 nom="";
	$("#TbModulos tr:gt(0)").each(function(){
		idTb=$(this).find("td").eq(2).html();
		if(idTb==id){
			nom=$(this).find("td").eq(0).html()+'-'+$(this).find("td").eq(1).html();
			return false;
		}
	});
return nom;	
}

//
function MostrarClase(ob){

$(ob).find("td").eq(0).addClass("DeleteFila");		
$(ob).find("td").addClass("Roja");		
}
//
function ElimiraClases(ob){
$(ob).find("td").eq(0).removeClass("DeleteFila");	
$(ob).find("td").removeClass("Roja");
}
//
function Eliminar(ob,id){

r=confirm("Dese Eliminar el Permiso Asociado al Modulo : "+BuscarModuloNom($("#TxtIdModulo").val())+"? ");
if(r){
	 $.ajax({     
		  url: "../models/Modulos.php",
			global: false,
			type: "POST",
			data : ({op:"4",id:id}),
			dataType: "json",
			async:false,
			success: function(data)
			{ 
			   if(data>0){
				   $(ob).remove();
			   }		   
			}
	});
	
}

}
//1

function CargarPermisosAsociado(id){
	var Ids=new Array();
	
	$.ajax({     
		  url: "../models/Modulos.php",
			global: false,
			type: "POST",
			data : ({op:"2",id:id}),
			dataType: "json",
			async:false,
			success: function(data)
			{ //alert(data); return false;
			   $("#TbAsociados tr:gt(0)").remove();
			   var tb="";
			   
               for(var i=0;i<data.length;i++){
				 cadena=data[i];
				   tb+="<tr onmouseover='MostrarClase(this)' onmouseout='ElimiraClases(this)' onclick='Eliminar(this,"+cadena.ID_MP+")'>"+
				   		   "<td style='padding-left:20px;'>"+cadena.ID+"</td>"+
						   "<td>"+cadena.TITULO+"</td>"+
						   "<td>"+cadena.DESCRIPCION+"</td>"+
						"</tr>";
				   Ids.push(cadena.ID);  
			   }//for
			   $("#TbAsociados").append(tb);
			}
		});	
		 $("#TbPermisos tr:gt(0)").find("td").removeClass("PermisoAgregado");
		 $("#TbPermisos tr:gt(0)").removeClass("FilaSeleted");
		 $("#TbPermisos tr:gt(0)").removeClass("FilaCheck");
		 for(var i=0;i<Ids.length;i++){
		
			$("#TbPermisos tr:gt(0)").each(function() {
				id=$(this).find("td").eq(0).html();
				if(id==Ids[i]){
					$(this).find("td").addClass("PermisoAgregado");
				}
			});

		  }//for
}

//FUNCION QUE AGREGAR A LA TABLA MODULOS_PERMISOS
function AgregarModulosPermisos(){
  //valido si hay modulo seleccionado
  if($("#TxtIdModulo").val()>0){
	  //valido si hay permisos agregado
	  if($("#TxtIdPermiso").val()>0){
		   var modulos_id =$("#TxtIdModulo").val();
		   var permisos_id=$("#TxtIdPermiso").val();
	        $.ajax({     
		       	url: "../models/Modulos.php",
				global: false,
				type: "POST",
				data : ({op:"3",modulos_id:modulos_id,permisos_id:permisos_id}),
				dataType: "json",
				async:false,
				success: function(data)
				{ 
				   if(data>0){
					    CargarPermisosAsociado(modulos_id); 
				   }else{
					   alert("No se ha podido asiciar el permiso!!");
				   }
				}
			});
	  }else{ alert("Debe seleccionar un Permiso primero!!"); }
  }else{ alert("Debe seleccionar un Modulo primero!!"); }
	
}

$(document).ready(function(e) {
 CargarModulos();   
 CargarPermisos();	
// EVENTOS CLICK 
$("#btnEnviar").click(AgregarModulosPermisos);
	
});