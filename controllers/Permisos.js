//FUNCION QUE CARGA LOS ROLES DE USUARIOS
function CargarRoles(){
  
$.ajax({     
		  url: "../models/Roles.php",
			global: false,
			type: "POST",
			data : ({op:"1"}),
			dataType: "json",
			async:false,
			success: function(data)
			{   
			 
               for(var i=0;i<data.length;i++){
				   cadena=data[i];
				  
				   $("#DivRoles").append("<div class='DIvItems'  onclick='CargarUsuariosRoles(this,"+cadena.ID+")'><a>"+cadena.ID+" -"+cadena.TITULO+"</a></div>"); 
				   
			   }//for
			  
			}
		});	  	
	
}
//FUNCION QUE CARGA LOS MODULOS DEL SISTEMA
function CargarModulos(){
	
$.ajax({     
		  url: "../models/Modulos.php",
			global: false,
			type: "POST",
			data : ({op:"1"}),
			dataType: "json",
			async:false,
			success: function(data)
			{   
			 
               for(var i=0;i<data.length;i++){
				   cadena=data[i];
				   $("#DivModulos").append("<div class='DIvItems modulos' id='mod_"+cadena.NUMERO+"' onclick='CargarModulosPermisos("+cadena.ID+",this)'><a>("+cadena.NUMERO+") &nbsp;"+cadena.DESCRIPCION+"</a></div>"); 
				    
			   }//for
			  
			}
		});	  		
}
//FUCION QUE CARGA LOS PERMISOS DE UN MODULO EN ESPECIFICO
function CargarModulosPermisos(ModId,ob){
	
if($("#TxtRolesId").val()>0){
	
	$("#DivPermisos div").remove();
	$("#DivModulos div").removeClass("Seleccionado");	
	obj=$(ob);
	$.ajax({     
		  url: "../models/Permisos.php",
			global: false,
			type: "POST",
			data : ({op:"1",ModId:ModId,RolesId:$("#TxtRolesId").val()}),
			dataType: "json",
			async:false,
			success: function(data)
			{   
				console.log(data);
			  // alert(data);return false;
               for(var i=0;i<data.length;i++){
				   cadena=data[i];
				   if(cadena.CHCK=='S'){
				      cl='Seleccionado';
				   }else{
				      cl="";
				   }
				   $("#DivPermisos").append("<div class='DIvItems "+cl+"' onclick='AsignarPermiso(this,"+cadena.ID_MOD_PER+","+cadena.MODULOS_PERMISOS_ID+")'>"+cadena.DESCRIPCION+"</div>"); 
				  obj.addClass("Seleccionado");
			   }//for
			  
			}
		});	  	
		
}else{
   alert("Debe seleccionar un Rol!");	
}

}
//FUNCTION QUE ASIGNA EL PERMISO AL MODULO EN LA TABLA T_PERMISOS_ROLES
function AsignarPermiso(ob,IdModPer,modulos_permisos_id){
	
 var obj  =$(ob);
 var cl   =obj.attr("class");
 var IdRol=$("#TxtRolesId").val();
 if(cl.indexOf("Seleccionado")!=-1){
	 opc="4"; 
 }else{
	 opc="2"; 
 }
  $.ajax({     
		  url    : "../models/Permisos.php",
		  global : false,
		  type   : "POST",
		  data   : ({op:opc,IdModPer:IdModPer,IdRol:IdRol,modulos_permisos_id:modulos_permisos_id}),
		   dataType: "html",
		   async   :  false,
		   success:   function(data)
			{// alert(opc+'   '+data);
			   if(data>0){
				   if(opc==4){
						  obj.removeClass("Seleccionado");
						
					  }else{
						   obj.addClass("Seleccionado");  
					  }  
			   }else{
				      if(opc==2){
						   alert("Se no se ha podido guardar el registro!");   
					  }else{
						  alert("No se ha podido eliminar el registro!");     
					  }
				  
			   }
			}
		});

}


//funcion que carga los usuarios de un rol seleccionado
function CargarUsuariosRoles(ob,id){
	
obj=$(ob);

		$("div").removeClass("Seleccionado");	
		$.ajax({     
		  url: "../models/Usuarios.php",
			global: false,
			type: "POST",
			contents:"UTF-8",
			data : ({op:"7",RolesId:id}),
			dataType: "json",
			async:false,
			success: function(data)
			{   //alert(data); return false;
		
		       p="";
               for(var i=0;i<data.length;i++){
				   cadena=data[i];
				   p+="<p>"+cadena.LOGIN.toUpperCase()+" ("+cadena.NOMBRES.toUpperCase()+' '+cadena.APELLIDOS+")</p>"; 
				   
			   }//for
			   $("#TxtRolesId").val(id);
			   $("#DivPermisos div").remove();
			  $("#DivUsuariosRles p").remove();
			  $("#DivUsuariosRles").append(p);
			  obj.addClass("Seleccionado");
			}
		});	 
	
	CargarPermisosAcceso(id);
	
}


function CargarPermisosAcceso(id){
	
		$.ajax({     
		  url: "../models/Usuarios.php",
			global: false,
			type: "POST",
			contents:"UTF-8",
			data : ({op:"17",rol:id}),
			dataType: "json",
			async:false,
			success: function(data)
			{  
				
				data.forEach(resp=>{
				
					let numero=resp.numero;
					
					$(".modulos").each(function(){
						
						d=$(this).attr("id");
					
						num=d.split("_");
						num=num[1];
						
						if(num==numero){
						  
							$(this).css("background-color","#0CA1A4");
							$(this).css("color","#ffffff");
						   
						}
						
					});
					
					
				});
				
			}
		}).fail(function(data){
			console.error(data);
		});
	
}

$(window).resize(function(e) {
   $("table").height($(window).height()-100);
   $("#DivModulos").height($(window).height()-200); 
});
<!--  DOCUMENT READY -->
$(document).ready(function(e) {
    
CargarRoles();
CargarModulos();	
$("table").height($(window).height()-100);
$("#DivModulos").height($(window).height()-200);
//

});