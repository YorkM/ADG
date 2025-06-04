var $NAME  = '';
var $LOGIN = '';
var $ORG   = '';
$(function(){
	//$(document).snow({ SnowImage: "../resources/images/snow.gif" });	
 Limpiar();
/*CAPTCHA*/
/**************************************************************************/
//Gnera Captcha

  $(".btncapt").click(function(){
    //document.location.reload();
     CargarCaptcha();
  });
  //cargamos la captcha al iniciar
  //la pagina web
  
//--------Recordar Organizacion---------------------------
	$("#RecordarOrg").on('click',function(){
	 if($(this).prop('checked')){
	   var org = $("#TxtOrg").val();
	   if(org == 0 || org == '' || isNaN(org)){
		 $("#dvSelectOrg").modal("show");
		 $("#RecordarOrg").prop("checked", false);
	   }else{
		 localStorage.setItem("OrgStorage", org);
	   }
	 }else{
	   localStorage.setItem("OrgStorage", '');
	   $("#dvSelectOrg").modal("show");
	 }
	});
	
	if(localStorage.getItem("OrgStorage")!='' && localStorage.getItem("OrgStorage")!=null){
	  var org = localStorage.getItem("OrgStorage");
	  $("#RecordarOrg").prop("checked", true);
	  $("#TxtOrg").val(org);
	}else{
	  $("#RecordarOrg").prop("checked", false);
	  $("#TxtOrg").val('');
	  var org = $("#TxtOrg").val();
	   if(org == 0 || org == '' || isNaN(org)){
		 $("#dvSelectOrg").modal("show");
		 $("#RecordarOrg").prop("checked", false);
	   }else{
		 localStorage.setItem("OrgStorage", org);
	   }
	}
	CarruselItems($("#TxtOrg").val());
//--------------------------------------------------------
CargarCaptcha();

//TAB DEL LOGIN
/************************************************************************/
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		$("#img_reg").show();
		$("#img_logo").hide();
		CargarCaptcha();
		e.preventDefault();
	});
 	$('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		//$("#TxtOficina").val("");
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		$("#img_reg").hide();
		$("#img_logo").show();
		e.preventDefault();
	});

//EVENTOS
 //KEYUP
 $('#Pass, #User').keyup(function(e){
	var tecla = (document.all) ? e.keyCode : e.which;
	 if(tecla==13){
		 Entrar();
	 }
 });	
 $("#nit").keyup(function(e){
	var tecla = (document.all) ? e.keyCode : e.which;
	vlr=$.trim($(this).val());
	if(vlr!=""){
	  if(tecla==13){
		BuscarNit();
	   }
	}else{
	  $("#register-form input").val("");
	  $("#register-form input:not(.nit),select").attr("disabled",true);
	  $("#organizacion").html("");
	  $("#TxtOficina").val("");
	  $("#nit").removeClass("NitTrue");
	}

 });
 //FOCUS
  $("body input[type='text']").focus(function(){
	if($("#TxtCod_sap").val()==""){
		$("#nit").removeClass("NitTrue");
	}
 });
 //FOCUSOUT
 $("#nit").focusout(function(){
	 vlr=$.trim($(this).val());
		if(vlr!=""){
			if(ValidarNit()>0){
				alert("El nit "+$("#nit").val()+" , ya se encuentra asociado a una cuenta de ADG!. Por favor verifique o consulte con el administrador del sistema");
				$("#nit").val("");
				$("#nit").focus();
			}else{
				BuscarNit();
			}
			//
		}else{
		    $("#register-form input:not(.nit),select").attr("disabled",true);
			$("#register-form input").val("");
			$("#organizacion").html("");
			$("#TxtOficina").val("");
			$("#nit").removeClass("NitTrue");
		}
 });
 //CLICK
$("#register-submit").click(function(){	
   if($("#TxtCod_sap").val()!=""){	   
	 if($("#nit").val()!=""){			
		 if($("#drogueria").val()!=""){				
			if($("#cedula").val()!=""){				
				 if($("#nombres").val()!=""){					 
					 if($("#contacto").val()!=""){						 
						  if($("#email").val()!=""){							  
							   if($("#telefono").val()!=""){
								   if(validarEmail($("#email").val(),0)){
								       $.ajax({
											url     : '../models/captcha/VerifCaptha.php',
											type    : 'POST',
											dataType: 'html',
											async:false,
											data    : {"valor": $("#valorCapt").val()},
											success: function(data){
												//si la captcha es correcta
												if(data=="1"){
														nit       =$("#nit").val();
														cedula    =$("#cedula").val();
														nombres   =$("#nombres").val();
														apellidos =$("#apellidos").val();
														codigo_sap=$("#TxtCod_sap").val();
														correo    =$("#email").val();
														telefono  =$("#telefono").val();
														org       =$("#organizacion").val();//organizacion en la que solicita el usuario
														oficina   =$("#TxtOficina").val();
														correo2   =$("#email2").val();
														drogueria =$("#drogueria").val();
														contacto  =$("#contacto").val();
														$.ajax({
																url   : "../models/Solicitudes_web.php",
																global: false,
																type  : "POST",
																data  : ({ 
																			op: "INSERTAR",
																			codigo_sap : codigo_sap,
																			cedula     : cedula,
																			nombres    : nombres,
																			apellidos  : apellidos,
																			correo     : correo,
																			telefono   : telefono,
																			org        : org,
																			nit        : nit,
																			correo2    : correo2,
																			drogueria  : drogueria,
																			oficina    : oficina,
																			contacto   : contacto
																		}),
															dataType: "html",
															async   : false,
															success : function(data){
																		 if(data>0){
																			 //swal('','','success');
																			 Swal.fire(
																				  'Correcto!',
																				  'Tu solicitud ha sido enviada satisfactoriamente!',
																				  'success'
																			 );
																			 email(codigo_sap,cedula,nombres,apellidos,correo,telefono,org,nit,correo2,drogueria,contacto);																			 																			 $("#register-form input").val("");	
																			 $("#organizacion").html("");
																			 $("#TxtOficina").val("");
																			 $("#register-form input:not(.nit),select").attr("disabled",true);
																			 $('#login-form-link').trigger("click");
																			 $("#User").focus();
																		 }else{
																			  Swal.fire(
																				  'Correcto!',
																				  'No se puedo enviar la solicitud! '+data,
																				  'warning'
																				);
																		 }
																	}
														
															}).fail(function(data){
																console.log(data); 
															});//$.ajax({ |
														
													}//data==1  
													else{
														alert("Por favor digite los caracteres de la imagen nuevamente!");
														CargarCaptcha();
													}
												}//data

								  }).fail(function(e){
										   console.error(e)
									   });//ajax 
								   }//if(validarEmail)
							   }//if($("#telefono").val()!=""){
						  }//if($("#email").val()!=""){
					 }//if($("#apellidos").val()!=""){
				 }//if($("#nombres").val()!=""){
			}//f($("#cedula").val()!=""){
		   }
		}//if($("#nit").val()!=""){
   }//if($("#TxtCod_sap").val()!=""){
 });

});
function email(codigo_sap,cedula,nombres,apellidos,correo,telefono,org,nit,correo2,drogueria,contacto){
	 
	 $.ajax({
			  url    : "../models/Solicitudes_web.php",
			  global : false,
			  type   : "POST",
			  data  : ({ 
						 op: "EMAIL",
						 codigo_sap :codigo_sap,
						 cedula     :cedula,
						 nombres    :nombres,
						 apellidos  :apellidos,
						 correo     :correo,
						 telefono   :telefono,
						 org        :org,
						 nit        :nit,
						 correo2    :correo2,
						 drogueria  :drogueria,
				         contacto	:contacto
					  }),
			dataType: "html",
			async   : false,
			success : function(data){//alert(data);
				console.log(data);
			      
			}
	 }).fail(function(data){
		 console.error(data);
	 });
}


/****************************************************************/
function ValidarNit(){
	nit=$.trim($("#nit").val());
	x=0;
	$.ajax({
			url   : "../models/Solicitudes_web.php",
			global: false,
			type  : "POST",
			data  : ({ op:"VERIFICAR" ,nit  :nit}),
			dataType: "json",
			async   : false,
			success : function(data){//alert(data);			    
				if(data.length>0){
					x=1;
				}else{
				  x=0;	
				}
																
			}
															
	});
	return x;
}

//Realiza la peticion AJAX
function CargarCaptcha() {
	 $.ajax({
             url: '../models/captcha/captcha2.php',
   	         type: 'post',
   	         dataType: 'text',
			 async:false,
   	         data:{"capt":"visto"}
   })
   .done(function(data) {
     if(data){
		var visto=$.parseJSON(data);
		//Canva Graficamos el texto devuelto por 
		//el servidor
		var canva=document.getElementById("capatcha");
		var dibujar=canva.getContext("2d");
		canva.width = canva.width;
		dibujar.fillStyle="#2594D1";
		dibujar.font='20pt "NeoPrint M319"';
		dibujar.fillText(visto.retornar,6,39);
		//console.log(data);		 
		var canva=document.getElementById("capatcha2");
		var dibujar=canva.getContext("2d");
		canva.width = canva.width;
		dibujar.fillStyle="#2594D1";
		dibujar.font='20pt "NeoPrint M319"';
		dibujar.fillText(visto.retornar,6,39);
	 }


   	//console.log(data);
   })
   .fail(function() {
   	console.log("error");
   })
   .always(function() {
   	//console.log("complete");
   });
   
}




/***********************************************************************/

//
function enter2tab(e)
{
 if (e.keyCode == 13) 
 {
  cb = parseInt($(this).attr('tabindex'));
  if ($(':input[tabindex=\'' + (cb + 1) + '\']') != null) 
  {
   $(':input[tabindex=\'' + (cb + 1) + '\']').focus();
   $(':input[tabindex=\'' + (cb + 1) + '\']').select();
   e.preventDefault();
   return false;
  }
 }
} 

//
function BuscarNit(){
  nit=$("#nit").val();
  if($.trim(nit)!=""){
	   $.ajax({
			    url   : "../models/Solicitudes_web.php",
			    global: false,
				type  : "POST",
						  data : ({ 
						            op: "BUSCAR",nit:nit
						 }),
				dataType: "json",
				async:false,
				error: function(){
					$("#nit").removeClass("NitTrue");
					$("#register-form input:not(.nit),select").attr("disabled",true);
				},
				success: function(data){
			       ///alert(data);return false;
				    if(data.length>0){
				        html="";
						CargarCaptcha();
					    for(var i =0;i<data.length;i++){
							d=data[i];
							if(d.ORGANIZACION_VENTAS==1000){des_org="CM";}else{des_org="ROMA";}
							html+='<option value="'+d.ORGANIZACION_VENTAS+'">'+des_org+'</>';
							$("#TxtCod_sap").val(d.CODIGO_SAP);
							$("#TxtOficina").val(d.OFICINA_VENTAS);
						}//FOR
						 $("#organizacion").html(html);
						$("#nit").addClass("NitTrue");
						$("#register-form input,select").attr("disabled",false);
					}else{
						 Swal.fire(
						  'Error!',
						  'No se encontró el nit '+$("#nit").val()+'!',
						  'warning'
						);
						 $("#nit").removeClass("NitTrue");
						 $("#register-form input:not(.nit),select").attr("disabled",true);
						 $("#register-form input:not(.nit),select").val("");
						 $("#TxtOficina").val("");
						 $("#organizacion").html("");

					}
				}//DATA
	   });
  }
}

function Limpiar(){
	$('#User').focus();
	$('#User').val('');
	$('#Pass').val('');
	$("#TxtOficina").val("");
	$("#RescueEmail").val("");
	$("RescueCaptcha").val("");
}
function Validar(){
  var sw = 0 ;
  if($('#Pass').val()==''){
    $('#Pass').addClass('input-error');
    sw = 1;
  }else{
    $('#Pass').removeClass('input-error');
  }
  if($('#User').val()==''){
    $('#User').addClass('input-error');
    sw = 1;
  }else{
	$('#User').removeClass('input-error');  
  }
  if(sw==0){
   return true;
  }else{
   return false;
  }
}
function Enter(ob){
 tecla = (document.all) ? ob.keyCode : ob.which;
	if(tecla== 13 ){ 
	  Entrar();
	}
}
//
function IniciarSesion(id){
	
	 $.ajax({
		url: "../models/Login.php",
		global: false,
		type: "POST",
		data : ({ 
			op: "IniciarSesion",
			id: id
		}),
		dataType: "html",
		async:false,
		success: function(data){
			
		}
	 }).fail(function(data){
		 console.log(data);
	 });
}

//
t=0;

 function calcular(tiempo){
	
	if( parseInt(tiempo/1000)>=0){
		return  parseInt(tiempo/1000)	
	 }else{
		 return; 
	 }
}


function Entrar(){
	
 if(Validar()){

	 $.ajax({
		url: "../models/Login.php",
		global: false,
		type: "POST",
		data : ({ 
			op: "ValidarUsuario",
			u:$.trim($('#User').val()),
			p:$.trim($('#Pass').val()) 
		}),
		dataType: "html",
		async:false,
		success: function(data){
		  var data = data.split('-');		 
		  switch(data[0]){
			  case '0':{
				if(data[1] == 0){
			      window.location.href = "../views/Menu.php";
			    }else{
				  $("#IdUser").val(data[2]);
				  $('#dvCambioClave').modal('show');
				}
			  }break;
			  case '1':{
			   Swal.fire({
						  type: 'error',
						  title: 'Oops...',
						  text: 'Usuario Inactivo o Bloqueado!'
						})
			    Limpiar();
			  }break;
			  case '2':{
			   		 Swal.fire({
						  type: 'error',
						  title: 'Oops...',
						  text: 'La clave digitada no es valida!'
						})
				$('#Pass').select()
			  }break;
			  case '3':{
				  	   Swal.fire({
						  type: 'error',
						  title: 'Oops...',
						  text: 'EL usuario seleccionado no existe!'
						})
				  
				$('#Pass').select()
			  }break;
			
		  }
		}
	});
 }
 
}
function tiene_numeros(texto){
var numeros="0123456789";
   for(i=0; i<texto.length; i++){
      if (numeros.indexOf(texto.charAt(i),0)!=-1){
         return 1;
      }
   }
   return 0;
} 


function tiene_letras(texto){
   var letras="abcdefghyjklmnñopqrstuvwxyz";
   texto = texto.toLowerCase();
   for(i=0; i<texto.length; i++){
      if (letras.indexOf(texto.charAt(i),0)!=-1){
         return 1;
      }
   }
   return 0;
} 
function CambioClave(){
	
 var clave1   = $.trim($("#NewPass1").val());
 var clave2   = $.trim($("#NewPass2").val());
 var claveAct = $("#Pass").val();
 
 if(clave1!='' && clave2!='' && (clave1==clave2) && clave1!=claveAct){
   if(clave1.length >=6){
     if(tiene_numeros(clave1) == 1){
	 	 if(tiene_letras(clave1) == 1){
		      $.ajax({
				url: "../models/Usuarios.php",
				global: false,
				type: "POST",
				data : ({ op    : "9",
				          clave : clave1,
						  id    :$("#IdUser").val()
				}),
				dataType: "html",
				async:false,
				success: function(data){
					//alert(data);
				  if(data=="1"){
					 // swal("Correcto", "Contraseña actualizada!", "success"); 
					  Swal.fire(
						  'Correcto!',
						  'Contraseña actualizada!',
						  'success'
						);
					  
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
					// swal("Error", "No se puedo actualizar la contraseña!", "error"); 
					 Swal.fire(
						  'Error!',
						  'No se puedo actualizar la contraseña!',
						  'error'
					 );
				  }
				}
	 });
		 }else{
			$("#NewPass1").val('');
			$("#NewPass2").val('');
			//swal('Oops','Las contraseña debe tener letras\nVerifique e intente nuevamente','warning');
			 Swal.fire(
						  'Error!',
						  'Las contraseña debe tener letras\nVerifique e intente nuevamente',
						  'error'
					 );
			$("#NewPass1").focus();
		 }
	 }else{
	    $("#NewPass1").val('');
	    $("#NewPass2").val('');
		//swal('Oops','Las contraseña debe tener como minimo un numero\nVerifique e intente nuevamente','warning');
			 Swal.fire(
						  'Error!',
						  'Las contraseña debe tener como minimo un numero\nVerifique e intente nuevamente',
						  'error'
					 );
		$("#NewPass1").focus();
	 }
   }else{
       $("#NewPass1").val('');
	   $("#NewPass2").val('');
	  // swal('Oops','Las contraseña debe tener como minimo 6 caracteres\nVerifique e intente nuevamente','warning');
			 Swal.fire(
						  'Error!',
						  'Las contraseña debe tener como minimo 6 caracteres\nVerifique e intente nuevamente',
						  'error'
					 );
	   $("#NewPass1").focus();
   }
 }else{
   $("#NewPass1").val('');
   $("#NewPass2").val('');
   //swal('Oops','Las contraseñas digitadas no coinciden, estan vacias o es igual a la actual\nVerifique e intente nuevamente','warning');
	Swal.fire(
			'Error!',
			'Las contraseñas digitadas no coinciden, estan vacias o es igual a la actual\nVerifique e intente nuevamente',
			'error'
			);
   $("#NewPass1").focus();
 }
} 

function Registrarse(){
$("#ModalRegistro").modal('show');
};

function CarruselItems(org){	

 var OrgStorage = localStorage.getItem("OrgStorage"); 
 $("#TxtOrg").val(org);
 
 if(OrgStorage != 0 || org != 0){			
	$.ajax({
		type: "POST",
		encoding:"UTF-8",
		url: "../models/ImagenesPublicitarias.php",
		dataType: "json",
		error: function(OBJ, ERROR, JQERROR){
		 alert(JQERROR);
		},
		data: {
			op   : "S_PUBLICIDAD_ACTIVA",
			org  : org
		},
		async:false,
		success: function(data){//alert(data.length);
			
			console.log(data);
		    var htmlItems = '';
			var htmlIndicadores = '';
			if(data.length > 0){				
				for(var i=0; i<=data.length-1; i++){
					 var activo = '';
					 if(i===0){activo = 'active';}
					 htmlItems += '<div class="carousel-item '+activo+'">'+
									  '<img class="d-block img-fluid" src="../../ImagenesPublicitarias/'+data[i].URL_IMG+'.png">'+
									  '<div class="carousel-caption d-none d-md-block">'+
										'<div class="banner-text">'+
											'<p>'+data[i].NOTAS.toUpperCase()+'</p>'+
										'</div>'+
									'</div>'+
								 '</div>';
					htmlIndicadores += '<li data-target="#carouselExampleIndicators" data-slide-to="'+i+'" class="'+activo+'"></li>'
				}
			}else{
				 htmlItems += '<div class="carousel-item active">'+
									  '<img class="d-block img-fluid" src="../../ImagenesPublicitarias/default.png">'+
									  
								 '</div>';
				htmlIndicadores += '<li data-target="#carouselExampleIndicators" data-slide-to="1" class="active"></li>'
			}
			
			$("#CarruselIndicadores").html(htmlIndicadores);
			$("#CarruselItems").html(htmlItems);
			$("#dvSelectOrg").modal("hide");
			//console.log(htmlItems);					
			
		}
 }).fail(function(data){
	 console.log(data);
 });
}else{
	$("#dvSelectOrg").modal("show");
}
}
function VerPass() {
  var x = document.getElementById("Pass");
  if (x.type === "password") {
    x.type = "text";
	$("#togglePassword").removeClass('fa-eye-slash')
	$("#togglePassword").addClass('fa-eye')
  } else {
    x.type = "password";
	$("#togglePassword").addClass('fa-eye-slash')
	$("#togglePassword").removeClass('fa-eye')
  }
}
function OpenCambioContra(){
	Limpiar();
	CargarCaptcha();
	$("#dvCambioContra").modal('show');
}
function CambioContrasena(){
  var email = $.trim($("#RescueEmail").val());
  if(validarEmail(email,1)){
		  $.ajax({
				url     : '../models/captcha/VerifCaptha.php',
				type    : 'POST',
				dataType: 'html',
				async:false,
				data    : {
					"valor": $("#RescueCaptcha").val()
				},
				success: function(data){ 
				    
					if(data == 1){
						   $("#dvCambioContra").modal('hide');
						   $.ajax({
								url      : "../models/Login.php",
								type     : 'POST',
								dataType : 'json',
								async    : false,
								data     : {
									op      : "EnviarCorreo",
									email   : email,
									usuario : $LOGIN,
									nombres : $NAME,
									org     : $ORG 
								},
								success: function(data){ //console.log(data);
									Swal.fire(
											data.Tipo,
											data.Msj +' '+data.Id,
											data.Tipo
									   );
									 Limpiar();
									 
								}
						  });
					}else{
						Swal.fire("Oops","Por favor digite los caracteres de la imagen nuevamente!","error");
						CargarCaptcha();
					}
				}
		  });
  }else{
   Swal.fire("Oops","Correo invalido o no esta asociado a una cuenta, verifique e intente nuevamente!","error");
   CargarCaptcha();
  }
}
function validarEmail(valor,tipo) {
	//valor = email a validar
	//tipo  = si se desea validar la estructura del correo o si se requiere adicional validar si esta en nuestra base.
	//        (0 == sin validacion interna || 1 = con validacion interna)
	var sw = false;
	if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(valor)){		
	     if(tipo == 1){
			  $.ajax({
					url      : "../models/Login.php",
					type     : 'POST',
					dataType : 'json',
					async    : false,
					data     : {
						op    : "ValidaCorreo",
						email : valor
					},
					success: function(data){ 
						if(data.length > 0){
						   sw = true;
						   $LOGIN = data[0].login;
						   $NAME  = data[0].nombres;
						   $ORG   = data[0].org;
						}
					}
			  });
		  }else{
	         sw = true;
		  }
	} 
    return sw;
}

function IngresoPassport(org){
 if(org == 1000){
   window.open('https://www.pwmultiroma.com/Passport/views/Login.php');
 }else{
   window.open('https://www.pwmultiroma.com/PassportRoma/views/Login.php');
 }
}

function RegistroPassport(org){
 if(org == 1000){
   window.open('https://www.pwmultiroma.com/Passport/views/Login.php');
 }else{
   window.open('https://www.pwmultiroma.com/PassportRoma/views/Login.php');
 }
}