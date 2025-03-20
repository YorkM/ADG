// JavaScript Document

//validaciones//
/* 
* function  exclusion(e) no permite la comilla simple  (')
* function  vletras(e)// acepta solo letras y sin espacios
* function  vletras_espacios(e) acepta letras y espacios
* function  vletras_numeros(e)  acepta numeros y letras sin espacios
* function  vletras_numeros_esp(e) apecta numeros y letras con espacios
* function	vletras_numeros_esp_guion(e) apecta numeros letras y los guines medios y bajos
* function  vletras_numeros_esp_por(e) apecta numeros y letras con espacios y el %
* function  vlet_num_eps_por_guion(e) acepta letras numeros,espacios,porcentajes, guiones bajos y medios
* function  vletras_ñ(e) apecta letras con la ñ y sin espacios
* function  vletras_ñ_esp(e) acepta letras con ñ y espacios
* function  letras_v(valor) apecta letras con espacios y la ñ 
* 


* vespacios(valor) evalua espacios en una cadena
* vnumeros(e) apecta solo numeros
* function vurl(url) evalua la estructura correcta de una url 
* function vemail(url) evalue  la estructura correcta de un email : ejemplo@xxxx.com
*  function vreal(e) acepta numeros reales con la ,
* function miles_decimales(cadena) coloca el formato de miles y sus decimales si los tienes miles(.),decimales(,)
* function replace_coma(cadena) remplaza una , por un .
* function replace_punto() remplaza un . por una ,
* function quitar_miles elimina el formato de miles y deja los decimales ej: 123333,45
*
*
*
* function enabled_disabled habilita e inhabilita los componentes en un form
* function existe_en_tabla valida si un valor se encuentra dentro de una tabla especificando la columna
**/


function validar_campos(requeridos)
{
	for(i=0;i<requeridos.length;i++)
	{		
		if(($("#" + requeridos[i] + "").val() == "")||($("#" + requeridos[i] + "").val() == "*** requerido ***"))
		{
			$("#" + requeridos[i] + "").val("*** requerido ***"); 
			$("#" + requeridos[i] + "").focus(); 	
			$("#" + requeridos[i] + "").select();
			return false;		
			break;
		}
	}
	return true;
}
function limpiar_campos(campos)
{

	for(i=0;i<campos.length;i++)
	{	
	
		if(($("#" + campos[i] + "").val() != ""))
		{
			
			$("#" + campos[i] + "").val(""); 
				
			}
	}
	
}
function default_cero(objetos,tipo)
{
	var id="";
  
	if(tipo=='C'){
		id='.';}
	else{
		if(tipo=='ID'){
	id='#';}}

	for(i=0;i<objetos.length;i++)
	{	
	   
		if(($( id+objetos[i] ).val() == ""))
		{
			
			$(id+ objetos[i] ).val('0'); 
				
			}
	}

}
function verificar_ceros(campos)
{
	var x=0;
     p1=preparar_datos($("#precio_um1").val(),'M');
	 p2=preparar_datos($("#precio_um2").val(),'M');
	 p3=preparar_datos($("#precio_um3").val(),'M');
     p4=preparar_datos($("#precio_um4").val(),'M');
	 p5=preparar_datos($("#precio_um5").val(),'M');

	if(p1!=0 || p2!=0 || p3!=0|| p4!=0 || p5!=0){x++;}
	
	
	return x;
}


function limpiaForm(miForm) 
{
	// recorremos todos los campos que tiene el formulario
	$(':input', miForm).each(function() 
	{
		var type = this.type;
		var tag = this.tagName.toLowerCase();
		//limpiamos los valores de los campos…
		if (type == 'text' || type == 'password' || tag == 'textarea' || tag == 'hidden')
		this.value = "";
		// excepto de los checkboxes y radios, le quitamos el checked
		// pero su valor no debe ser cambiado
		else if (type == 'checkbox' || type == 'radio')
		this.checked = false;
		// los selects le ponesmos el indice a -
		else if (tag == 'select')
		this.selectedIndex = 0;//-1;
	});
}

function exclusion(e){
 tecla = (document.all) ? e.keyCode : e.which; 
  patron =/\'/; // Solo acepta letras
    te = String.fromCharCode(tecla); // 5
    if(patron.test(te)) return false; 
}
function validar_codigo(e){
 tecla = (document.all) ? e.keyCode : e.which; 
 te = String.fromCharCode(tecla); 
patron=  /^[0-9](\-){1}[a-zA-Z]{1}$/;

return patron.test(cadena);	
}

//letras
function vletras(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 || tecla==0 ) return true; // 3
    patron =/^[a-zA-Z]/; // Solo acepta letras
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); 
} // SOLO LETRAS sin espacios con keypress
function vletras_espacios(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 || tecla==0 || tecla==32) return true; // 3
    patron =/^[a-zA-Z]/; // Solo acepta letras
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}
function vletras_numeros(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 ||tecla==0 ) return true; // 3
    patron =/[a-zA-Z0-9]+/; // Solo acepta letras
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}// letras y numeros sin espacios con keypress

function vletras_numeros_esp(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 ||tecla==0 || tecla==32) return true; // 3
    patron =/[a-zA-Z0-9]+/; // Solo acepta letras
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
function vletras_numeros_guion(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 ||tecla==0  || tecla==45) return true; // 3
    patron =/[a-zA-Z0-9]+|\-/; // Solo acepta letras
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}

function vletras_numeros_esp_por(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 ||tecla==0 || tecla==32 || tecla==37) return true; // 3
    patron =/[a-zA-Z0-9]+/; // Solo acepta letras
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}
function vlet_num_eps_por_guion(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 ||tecla==0 || tecla==32 || tecla==37 || tecla==45) return true; // 3
    patron =/[a-zA-Z0-9]+|\_/; // Solo acepta letras
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}
/*function vletras_ñ(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 ||  tecla==0) return true; // 3
    patron =/[A-Za-zñÑ]/; // Solo acepta letras con ñ
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}// LETRAS CON Ñ y sin espacios validar  con keypress
function vletras_ñ_esp(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 ||  tecla==0 || tecla==32) return true; // 3
    patron =/[A-Za-zñÑ]/; // Solo acepta letras con ñ
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
}*/
function letras_v(valor){
 if(valor!=""  ){
     var patron=/^[A-Za-zñÑ\s]+$/;	
	if( !valor.match(patron)){
		alert('solo se permiten letras en este campo');
		
	}}}// solos letras con espacios para validar con onblur
	

function vespacios(valor){
	
var patron=/\s/;
 return valor.match(patron);

}// envia true si hay espacios

function vnumeros(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 || tecla==0 ) return true; // 3
    patron =/[0-9]/; // Solo acepta números
    te = String.fromCharCode(tecla); // 5
    return patron.test(te); // 6
} // solo numeros sin espacios con keypress

function vurl(url){ 
var patron=/^(ht|f)tps?:\/\/\w+([\.\-\w]+)?\.([a-z]{2,4}|travel)(:\d{2,5})?(\/.*)?$/; 
       if ( !patron.test(url)){
		   alert('formato no permitido');
		   
	   }
				
}// valida url 

function vemail(cadena){
	
var patron=/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})+\;$/;

if(! cadena.match(patron)){
	alert('formato valido:ejemplo@xxxx.com');
}
}// valida email con ; al final

function vreal(e){

   tecla = (document.all) ? e.keyCode : e.which;
    if (  tecla==0 || tecla==8 ) return true;

	  patron =/^[0-9]|\,/; // Solo acepta letras
    te = String.fromCharCode(tecla);
	return patron.test(te);
	
}// acepta numero reales validar con keypress

function format_miles(numero){
	var result='';
     while( numero.length > 3 )
        {
           result = '.' + numero.substr(numero.length - 3) + result;
           numero = numero.substring(0, numero.length - 3);
              }
               result = numero +result;
                return   result;	
				}// convierte formato miles ej: 122.233

function formato_miles(numero){
	var result='';

     while( numero.length > 3 )
        {
			if(S_DECIMAL==',')
			{
			  
              result = '.' + numero.substr(numero.length - 3) + result;
              numero = numero.substring(0, numero.length - 3);
			     }
			  else
		        {
				if(S_DECIMAL=='.'){
		          result = ',' + numero.substr(numero.length - 3) + result;
                   numero = numero.substring(0, numero.length - 3);}  
		   }}
              
               result = numero +result;
			   
                return   result;

				}// convierte formato miles ej: 122.233
		
				

						
						 
function replace_punto(cadena){
	if(cadena.match(/\,/g)){
return cadena.replace(",",".");	
	}
	else{
		
	return cadena;	
	}
	
}
function replace_coma(cadena){
	if(cadena.match(/\./g)){
return cadena.replace(".",",");	
	}else{
		return cadena;
	}
	
}
function replace_guiones(cadena){
	if(cadena.match(/\-/g)){
return cadena.replace(/\-/g,"/");	
	}else{
		return cadena;
	}
	
}
function quitar_comas(cadena){

if(cadena.match(/\,+/)){
var nueva_cadena = cadena.replace(/\,/g,"");
return  nueva_cadena;
}
else
	
return cadena;	
	
}
function quitar_guiones(cadena){

if(cadena.match(/\-+/)){
var nueva_cadena = cadena.replace(/\-/g,"");
return  nueva_cadena;
}	
}
function encontrar_patron(cadena,patron){
	var x=0;
for(var i=0;i<=cadena.length;i++){
	
if(cadena[i]==patron){
x++;
}}
return  x;
}



function quitar_una_coma(cadena){

if(cadena.match(/\,+/)){
var nueva_cadena = cadena.replace(/\,/,"");
return  nueva_cadena;
}
else
	
return cadena;	
	
}
function quitar_puntos(cadena){

if(cadena.match(/\.+/)){
var nueva_cadena = cadena.replace(/\./g,"");
return  nueva_cadena;
}
else
	
return cadena;	
	
}

function quitar_porcentaje(cadena){

if(cadena.match(/\%+/)){
var nueva_cadena = cadena.replace(/\%/g,"");
return  nueva_cadena;
}else return cadena;	
}


function quitar_signo_peso(cadena){

if(cadena.match(/\$+/)){
var nueva_cadena = cadena.replace(/\$/g,"");
return  nueva_cadena;
}else return cadena;	
}

/*   funciones para controlar los decimales
* function cortar_decimales_porcent(e,long_ini,s_decimal,s_miles,d_porcentajes,objeto,ent_max)
*function cortar_decimales_miles(e,long_ini,s_decimal,s_miles,d_miles,objeto,ent_max)
*function cortar_decimales_cantidades(e,long_ini,s_decimal,s_miles,d_cantidades,objeto,ent_max)




*/
// ESTAS FUNCIONES RECIBEN COMO PARAMETROS EL EVENT,MAXLENGTH DE LA CAJA DE TEXTO Y EL THIS DE LA CAJA DE TEXTO
///-------------------- corta decimales en los porcentajes
function cortar_decimales_porcentaje(e,long_ini,objeto)
{
 cadena=$(objeto).val();
 evaluar_c=cadena.match(/\,/);
 evaluar_p=cadena.match(/\./);
 tecla = (document.all) ? e.keyCode : e.which;
if(D_PORCENTAJE>0)
 {
  if(S_DECIMAL==',' && S_MILES=='.')
	{
		
        if(cadena.length==E_MAX_P  && tecla!=8)
		         {
				     if( !(evaluar_c))
					 {
						 $(objeto).val($(objeto).val()+',');
						 }
				             
					 } 

if(tecla==188 || tecla==44 || evaluar_c)
	 {
		 if(cadena.match(/^,+/)){
			 $(objeto).val('0'+$(objeto).val());
		 
		  
		 }
		
		 indc=cadena.indexOf(',');
         tmp=cadena.substring(0,indc);
	     logi=parseInt(tmp.length)+parseInt(D_PORCENTAJE);
         $(objeto).attr("maxlength",logi+1);

	
       }
	   
if($(objeto).val()=="")
	{
		 $(objeto).attr("maxlength",long_ini); 
							  }
							  
 if(tecla==8)
 { 	
    if(!(evaluar_c))
		{	
			 $(objeto).attr("maxlength",long_ini); 
		 }else{$(objeto).attr("maxlength",long_ini);}
 }
						
                   }// cierra if de s_decimal y s_miles
	  
		else
		
		
		{
			
			if(S_DECIMAL=='.' && S_MILES==',')
	               {

            if(cadena.length==E_MAX_P  && tecla!=8){
			
				        if( !(evaluar_p)){ 
				             $(objeto).val($(objeto).val()+'.');
							        }
                                              } 
		    
if(tecla==190|| tecla==46 || evaluar_p)
 {
	  if(cadena.match(/^.+/)){
			 $(objeto).val('0'+$(objeto).val());}
   indc=cadena.indexOf('.');
   tmp=cadena.substring(0,indc);
   logi=parseInt(tmp.length)+parseInt(D_PORCENTAJE);
   $(objeto).attr("maxlength",logi+1);
            }
if($(objeto).val()=="")
      {
	$(objeto).attr("maxlength",long_ini); 
             }
if(tecla==8)
      { 	
     if(!(evaluar_p))
		 {	
		$(objeto).attr("maxlength",long_ini); 
		 }else{$(objeto).attr("maxlength",long_ini);}
	   }
						
}// cierra if de s_decimal='.' y s_miles=','
	   } // cierra el else
	                        
		}// condifional del d_porcentaje >0
	else{
		$(objeto).attr("maxlength",E_MAX_P); 
	$(objeto).val($(objeto).val());
	}
  	 
    }// cierra la function

//--------------------------

//------------------------------------- corta decimales en moneda

function cortar_decimales_moneda(e,long_ini,objeto)
{
 cadena=$(objeto).val();
 evaluar_c=cadena.match(/\,/);
  evaluar_p=cadena.match(/\./);
 tecla = (document.all) ? e.keyCode : e.which;
if(D_MONEDA>0)
 {
	 
  if(S_DECIMAL==',' && S_MILES=='.')
	{
        if(cadena.length==E_MAX_M  && tecla!=8)
		         {
					
				     if( !(evaluar_c))
					 {
						 if(D_MONEDA>0){

						 $(objeto).val($(objeto).val()+',');
						 }}
				             
					 } 
 if(S_DECIMAL==','){
if(tecla==188 || tecla==44 || evaluar_c)
	 {
		  if(cadena.match(/^,+/)){
			 $(objeto).val('0'+$(objeto).val());}
		
		 indc=cadena.indexOf(',');
         tmp=cadena.substring(0,indc);
	     logi=parseInt(tmp.length)+parseInt(D_MONEDA);
         $(objeto).attr("maxlength",logi+1);
       }
	   }
	   
if($(objeto).val()=="")
	{
		 $(objeto).attr("maxlength",long_ini); 
							  }
							  
 if(tecla==8)
 { 	
    if(!(evaluar_c))
		{	
			 $(objeto).attr("maxlength",long_ini); 
		 }else{ $(objeto).attr("maxlength",long_ini); }
 }
						
                   }// cierra if de s_decimal y s_miles
	  
		else{
			if(S_DECIMAL=='.' && S_MILES==',')
	               {
  
               if(cadena.length==E_MAX_M  && tecla!=8){
				        if( !(evaluar_p)){ 
				             $(objeto).val($(objeto).val()+'.');
							        }
                                              } 
		    
if(tecla==190 || tecla==46 || evaluar_p)
 {
   indc=cadena.indexOf('.');
   tmp=cadena.substring(0,indc);
   logi=parseInt(tmp.length)+parseInt(D_MONEDA);
   $(objeto).attr("maxlength",logi+1);
            }
if($(objeto).val()=="")
      {
	$(objeto).attr("maxlength",long_ini); 
             }
if(tecla==8)
      { 	
     if(!(evaluar_p))
		 {	
		$(objeto).attr("maxlength",long_ini); 
		 }else{$(objeto).attr("maxlength",long_ini); }
	   }
						
}// cierra if de s_decimal='.' y s_miles=','
	   } // cierra el else
	                        
		}// condifional del d_porcentaje >0
	else{
		$(objeto).attr("maxlength",E_MAX_M); 
	$(objeto).val($(objeto).val());
	}
  	 
    }



//-------------------------------------------------------------------------- fucntion para las cantidades

function cortar_decimales_cantidades(e,long_ini,objeto)
{
 cadena=$(objeto).val();
 evaluar_c=cadena.match(/\,/);
  evaluar_p=cadena.match(/\./);
 tecla = (document.all) ? e.keyCode : e.which;
if(D_CANTIDADES>0)
 {
  if(S_DECIMAL==',' && S_MILES=='.')
	{
        if(cadena.length==E_MAX_C  && tecla!=8)
		         {
				     if( !(evaluar_c))
					 {
						 $(objeto).val($(objeto).val()+',');
						 }
				             
					 } 
if(tecla==188 || tecla==44 || evaluar_c)
	 {
		 indc=cadena.indexOf(',');
         tmp=cadena.substring(0,indc);
	     logi=parseInt(tmp.length)+parseInt(D_CANTIDADES);
         $(objeto).attr("maxlength",logi+1);
       }
	   
if($(objeto).val()=="")
	{
		 $(objeto).attr("maxlength",long_ini); 
							  }
							  
 if(tecla==8)
 { 	
    if(!(evaluar_c))
		{	
			 $(objeto).attr("maxlength",long_ini); 
		 }else{ $(objeto).attr("maxlength",long_ini);}
 }
						
                   }// cierra if de s_decimal y s_miles
	  
		else{
			if(S_DECIMAL=='.' && S_MILES==',')
	               {
  
               if(cadena.length==E_MAX_C  && tecla!=8){
				        if( !(evaluar_p)){ 
				             $(objeto).val($(objeto).val()+'.');
							        }
                                              } 
				    
if(tecla==190 || tecla==46 || evaluar_p)
 {
   indc=cadena.indexOf('.');
   tmp=cadena.substring(0,indc);
   logi=parseInt(tmp.length)+parseInt(D_CANTIDADES);
   $(objeto).attr("maxlength",logi+1);
            }
if($(objeto).val()=="")
      {
	$(objeto).attr("maxlength",long_ini); 
             }
if(tecla==8)
      { 	
     if(!(evaluar_p))
		 {	
		$(objeto).attr("maxlength",long_ini); 
		 }else{ $(objeto).attr("maxlength",long_ini);}
	   }
						
}// cierra if de s_decimal='.' y s_miles=','
	   } // cierra el else
	                        
		}// condifional del d_porcentaje >0
	else{
			$(objeto).attr("maxlength",E_MAX_C); 
	$(objeto).val($(objeto).val());
	}
  	 
    }
//----------------------------------------------------------------------------




function validar(e){
	
	
if(S_DECIMAL==',' && S_MILES=='.'){
	
	 tecla = (document.all) ? e.keyCode : e.which;
	 if(tecla==188 || tecla==44) return true;
	 return vnumeros(e);
	}
	else
if(S_DECIMAL=='.' && S_MILES==','){
	 tecla = (document.all) ? e.keyCode : e.which;
	 if(tecla==190 || tecla==46) return true;
	 return vnumeros(e);
	}

	
}

//--------------VALIDACIONES CON RESPECTO A CONFIGURACIONES

function vgeneral(e,clase){

if(clase=='P'){
if(D_PORCENTAJE>0  ){return validar(e);}
else
return vnumeros(e);
	}
	else
    if(clase=='M'){
		
	if(D_MONEDA>0  ){ return validar(e);}
	else

		return vnumeros(e);
	}
	else
   if(clase=='C'){
   if(D_CANTIDADES>0){return validar(e);}
   else
	return vnumeros(e);
	}

	
}

//----------------------------------------------------------

function agregar_formatos(cadena,clase){
cadena=String(cadena);	
var cantidad_decimales="";
var signo_pe="";
var signo_po="";
var separador="";
var patron=false;


if(!cadena.match(/\%/) && clase=='P'){ signo_po='%'; patron=true; }
if(!cadena.match(/\$/) && clase=='M'){ signo_pe='$'; patron=true; }
if((encontrar_patron(cadena,'.')==1 || encontrar_patron(cadena,',')==1) && clase=='C'){patron=true;}

if((clase=='P') &&  (D_PORCENTAJE>0)){cantidad_decimales=parseInt(D_PORCENTAJE); }
if((clase=='M') && (D_MONEDA>0)){cantidad_decimales=parseInt(D_MONEDA);	}
if((clase=='C') && (D_CANTIDADES>0)){cantidad_decimales=parseInt(D_CANTIDADES);}

if(S_DECIMAL==','){separador=',';}else{separador='.';}// en caso de S_DECIMAL==',' o S_dECIMAL=='.'
if(S_DECIMAL==',' && (encontrar_patron(cadena,'.')==1  && !cadena.match(/\,/))){cadena=replace_coma(cadena);}

indice=cadena.indexOf(separador);

if(patron==true && cadena!=0 && cadena!=""){

if(indice>0 ){
decimales=cadena.substring(indice,indice+cantidad_decimales+1);// se separan los decimales
subcadena=cadena.substring(0,indice); // cadena que quedara con fotmato de miles 
cadena=(formato_miles(subcadena)+decimales);
return signo_pe+completar_decimales( cadena,clase)+signo_po;}
else{

     return  signo_pe+formato_miles(cadena)+pon_ceros(clase)+signo_po; 
	}

}else
{
	return cadena;}// si patron=false y cadena ==0 o vacio





}
//-------------------------------------------------------------------------------------------------------------
function quitar_formatos(cadena,clase){


if(cadena!="" || cadena>0   ){
	
if( S_MILES=='.'){
	    if(clase=='P' ){
		              if(cadena.match(/\%+/)){
		               return  quitar_porcentaje(quitar_puntos(cadena));}
		                         else{return cadena;}  }// cierra el clase=='P'
		
		else 
		
		if(clase=='M'){
			 if(cadena.match(/\$+/)){
			   return quitar_signo_peso(quitar_puntos(cadena));}else{return cadena;}} //CIERRA EL clase=='M' 
		
		else
		 if( clase=='C'){
			 if(cadena.match(/\./)){
			 return quitar_puntos(cadena);}else{return cadena;}
			 }
			 
			 
}//CIERRA EL S_MILES=='.'
			 
			 
			 
			 
else{// abre else 1
	if(S_MILES==','){

	if(clase=='P' ){
        if(cadena.match(/\%+/))
		          {
		            return  quitar_porcentaje(quitar_comas(cadena));}else{return cadena;}}//CIERRA EL clase=='P'
		else 
		     if(clase=='M')
			        {
			        if(cadena.match(/\$+/)){
			          return quitar_signo_peso(quitar_comas(cadena));}else{return cadena;}}
			   
			   else
		        if( clase=='C'){
					if(cadena.match(/,/)){
			     return quitar_comas(cadena);}else{return cadena;}}
	              } // cierra el else 1
    
	    }// cierra el S_MILES=='.'

} // cadena!=""
}// cierra la function


function formatear_numeros(cadena,clase,op){
	
if(op=='A'){// SE LLAMA A LA FUNCION AGREGAR

return agregar_formatos(cadena,clase);
	
}else
if(op=='Q'){
return quitar_formatos(cadena,clase);}	
		
}



 

//-----------------------------------------------COLOCA LOS '0' EN LOS FORMATOS NUMERICOS

function pon_ceros(clase)
{
var ceros="";
var separador="";
//-------------------se defne el separador de los decimales-----

	
if(clase=='P'){
	if(D_PORCENTAJE>0){
		if(S_DECIMAL==','){separador=',';}else{separador='.';}
for(var  i=1;i<=D_PORCENTAJE;i++){
ceros+='0';	
}}	
}
if(clase=='M'){
	if(D_MONEDA>0){
		if(S_DECIMAL==','){separador=',';}else{separador='.';}
for(var  i=1;i<=D_MONEDA;i++){
ceros+='0';	
	}	}}
if(clase=='C'){
for(var  i=1;i<=D_CANTIDADES;i++){
ceros+='0';	
	}	

}
return separador+ceros;
			
	
	
}



//esta funcion prepara los numeros para hacer operaciones con ellos recibe como parametros el numero y la clase
//------------------------------------------------------

function preparar_datos(cadena,clase){

if(  cadena.match(/\.|\,/) || cadena.match(/\$/) || cadena.match(/\%/)){
	
switch (S_DECIMAL)
{
	
case ',':    
                     
                    if(clase=='P'){
					return   quitar_porcentaje(replace_punto(quitar_puntos(cadena))); }
					if(clase=='M'){
						
					return quitar_signo_peso(replace_punto(quitar_puntos(cadena)));  }
                    if(clase=='C'){return replace_punto(quitar_puntos(cadena)); 	}
                    break;
case '.':
                   if(clase=='P'){ 
                    return   quitar_porcentaje(quitar_comas(cadena));}
					if(clase=='M'){ return quitar_signo_peso(quitar_coma(cadena)); }
					if(clase=='C'){ return quitar_comas(cadena); 	}
	                break;
	                default : cadena;
}	
}
else{return cadena; }
}




//---------------------------------------------------
function completar_ceros(cantidades)
{
var ceros="";

for(var i=0;i<cantidades;i++){
	
ceros+='0';	
	
}

return ceros;	
	
}
//-----------------------------------------------------------

function completar_decimales(cadena,clase)
{

var separador="";
var decimales=0;
var log_dec=0;
if(S_DECIMAL==','){separador=',';}else{separador='.';}// en caso de S_DECIMAL==',' o S_dECIMAL=='.'
indice=cadena.indexOf(separador);

if(indice>0){
decimales=cadena.substring(indice+1,cadena.length);// se separan los decimales
log_dec=decimales.length;
switch (clase)
{
case 'P':

         if(D_PORCENTAJE==log_dec)
		 {
			 
			return cadena; 
		 }else
		 {
			cantidades=D_PORCENTAJE-log_dec;
			return cadena+completar_ceros(cantidades);
			 
			 
			 }
	     break;
case 'M':

         if(D_MONEDA==log_dec)
		 {
		
			return cadena; 
		 }else
		 {
			 if(D_MONEDA>log_dec){
		
			cantidades=D_MONEDA-log_dec;
			cadena=cadena+completar_ceros(cantidades);
			return cadena;
			 }
			 
			 }
	     break;		 
case 'C':
         if(D_CANTIDADES==log_dec)
		 {
			return cadena; 
		 }else
		 {
			cantidades=D_CANTIDADES-long_dec;
			return cadena+completar_ceros(cantidades);
			 
			 
			 }
	     break;	

	
	
	}//cierra el switch







}// cierra if indice mayor q cero





	
	}//cierra la funcion















function  analizar_codigo(codigo){

	 patron= /([a-zA-Z]|[0-9])(\-){1}[a-zA-Z]{1}$/;
	
	 if(patron.test(codigo)){
		return true;
	}
	
}
function codigo_regular(codigo){
	var cr;
guion='-';
 pos=codigo.indexOf(guion);
		return  codigo.substring(0,pos);

	
}
function calcular_p(costo,listados,selector,iva){
	
	for(var i=0;i<=listados.length;i++){
			
				switch (selector)	
				{
				 case '1':
					porcentaje=listados[0];
					
					break;
					case '2':
					
					porcentaje=listados[1];
					
					break;
						case '3':
					
					porcentaje=listados[2];
					
					break;
								
					case '4':
					
					porcentaje=listados[3];
					
					break;
						case '5':
					
					porcentaje=listados[4];
					
					break;}}
	
	
	
	
valor=$.ajax({
				url: "../controllers/productos.php",
				global: false,
				type: "POST",
				data : ({ 
							op: "PI", 
							porcentaje : porcentaje,
							costo : costo,
							iva :  iva,
							}),
							dataType: "html",
							async:false,
							success: function(data){
 }
										 
	   }).responseText;
										 

return valor;	
}
//-----------------------------------------decimales-------------------------------











//----------------------------- controles -----------------------------------------------------


//habilita o inhabilita los inputs
/*  var a = ["",..];
	enabled_disabled(campos,'false');*/
function enabled_disabled(campos,op)
{	
	for (var i=0; i < campos.length; i++) 
	{
		$("#" + campos[i]).attr('disabled', op);
	};
}
//habilita o inhabilita los inputs

function enabled_disabled_perm(campos,op)
{
	for (var i=0; i < campos.length; i++) 
	{
		if((campos[i] !="")&&(campos[i] != null))
		{
			$("#" + campos[i]).attr('disabled', op);
			if(op == "true"){	$("#" + campos[i]).removeAttr('disabled');	}
			var clss = String($("#" + campos[i] + " > span").attr("class")); 
			var y = String("#" + campos[i] +" > span");
			if(op=="false")
			{
				 var c = String(clss+"_disable");			 
				 $(y).removeClass(clss).addClass(c);
			}
			else
			{
				if((clss!='add')&&(clss!='quit'))
				{
					var count = clss.search(/_/);
					var c = String(clss.substring(0,count));
					if(clss!="guardar"){//esto dado que de validar dos veces tanto para insertar como para modificar
					$(y).removeClass(clss).addClass(c);}
				}
			}
		}
	};
}

function existe_en_tabla(tabla, vlr, col)
{
	var resp = false;
	$("#"+ tabla + " tr").each(function()
	{
		x = $(this).find("td").eq(col).html();
		if(vlr == x)
		{
		 	resp = true;
		}
	});
	return resp;
}

//------------------------ funciones de busquedas de productos

/*
 busca por codigo de barras 
parametros: codigo de barras del producto
retorna el id del producto en caso de entontrarlo de lo contrario retorna un '0'

*/

function buscar_id_por_barras(codigo_b){
x= $.ajax({
		  url: "../controllers/productos.php",
		  global: false,
		  type: "POST",
		  data: ({op: "CPB", 
		  codigo_b	 : codigo_b}),
		  dataType: "html",
		  async:false,
		  success: function(data){
					} }).responseText;
	return x;
	
}
//-------------------------------------------------------------------

/*
 busca por codigo del producto
parametros: codigo del producto
retorna el id del producto en caso de entontrarlo de lo contrario retorna un '0'

*/

function buscar_id_por_codigo(codigo){
	
x= $.ajax({
		url: "../controllers/productos.php",
		global: false,
		type: "POST",
		data: ({op: "VR", 
				codigo	 : codigo}),
				dataType: "html",
				async:false,
			    success: function(data){
						           
									  }  }).responseText;
	return x;	
	
}
 function cargar_valor_iva(id_iva){
 x=$.ajax({
      url: "../controllers/productos.php",
      global: false,
      type: "POST",
      data: ({op: "CVI",
			 iva_id:id_iva}),
      dataType: "html",
      async:false,
      success: function(data){
      
	  }
   }).responseText; 
	return x; 
	 }


// esta funcion calcula el precio desde la utilidad o desde el incremento

function calcular_precio(porcentaje,costo,iva){ 

var x=$.ajax({
				url: "../controllers/productos.php",
				global: false,
				type: "POST",
				data : ({ 
							op: "PI", 
							porcentaje : porcentaje,
							costo : costo,
							iva :  iva,
							}),
							dataType: "html",
							async:false,
							success: function(data){
			                   
						                x=data;    
												 }
			}).responseText;


return x;

}
//----- validar_codigo valida la estructura correcta de un codigo de producto y recibe como parametros el 'this' de la caja de texto por medio del evento keyup del objeto.
function validar_codigo(objeto){
	codigo=$(objeto).val();							   
patron=/^([0-9]|[A-Za-z])+/;


if(codigo.match(patron)){ 
if(codigo.match(/\-{2,10}/)){
	var longi=codigo.length;
    if(encontrar_patron(codigo,'-')>1)
	{	
	codigo2=quitar_guiones(codigo);
	$(objeto).val(codigo2);
	
	}
}

}else {
$(objeto).val("");}
if(encontrar_patron(codigo,'-')==1){
	if(codigo.match(/^([0-9]|[A-Za-z])+\-$/)){
		$(objeto).attr("maxlength",codigo.length+1);
		}
		if(!codigo.match(/^([0-9]|[A-Za-z])+\-{1}[A-Za-z]*$/)){
			$(objeto).val(codigo.substring(0,codigo.length-1));
			}
	}	
$(objeto).keypress(function(e){
	 tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla==8 ){ return true;}
	
	 if(!codigo.match(/\-/)){
		 
	  $(objeto).attr("maxlength",20);
	 }					  
						  
						  });

}
function  borrar(cadena,objeto){
	var x=0;

	if(cadena!=0 || cadena!=""){
	if(S_DECIMAL==','){
		
	 if(cadena.match(/\,$/) || cadena.match(/\,0$/)){
		 
		 x=1;}
		 }else
	      {
		 if(cadena.match(/\.$/)){$(objeto).val("")}
		 x=1;
		 }}
	 
	return x;
	}// coloca en ceros un campo numerico donde no se digite los decimales correctamente

function invertir_cadena(cadena)
{

	for(var i=0;i<=cadena.length;i++){
	si_esp=cadena.split("/");
       
}
return (si_esp[2]+"/"+ si_esp[1]+ '/' +si_esp[0])
	
	
	
}

function cortar_decimales(cadena,clase)
{
	
var cadena=String(cadena);
var cant="";
if(clase=='P'){cant=parseInt(D_PORCENTAJE); }
if(clase=='M'){cant=parseInt(D_MONEDA);}	
if(clase=='C'){cant=parseInt(D_CANTIDADES);}	
	
	
indice=cadena.indexOf('.');

sub_cadena=cadena.substring(0,parseInt(indice+1)+cant);
	
return sub_cadena;	
	
	
}





function format_miles_R(numero,c){
	var result='';
	var signom ="";
	var signop="";
	if(c=='M'){signom='$';signop="";}
   if(c=='P'){signop='%';signom="";}
    if(c=='C'){signop="";signom="";}
	
	
     while( numero.length > 3 )
        {
           result = '.' + numero.substr(numero.length - 3) + result;
           numero = numero.substring(0, numero.length - 3);
              }
               result = numero +result;
                return   signom+ result +signop;	
				}// convierte formato miles ej: 122.233


function agregar_formatos_R(cadena,clase) // AGREGA LOS FORMATOS Y LLAMA A FORMA_MILES QUE COLOCA LOS PUNTOS
{
switch (clase)
{
case 'M':
       
        return format_miles_R(cadena,clase);

       break;
case 'Q':
        return format_miles_R(cadena,clase);

       break;
       case 'C':
        return format_miles_R(cadena,clase);

       break;	
		
	
}
}

function quitar_formatos_R(cadena,clase)
{
	
switch (clase)
{
case 'M':

        return quitar_puntos(quitar_signo_peso(cadena));

       break;
case 'Q':
        return quitar_puntos(quitar_porcentaje(cadena));

       break;	
case 'C':
        return quitar_puntos(cadena);

       break;	
	
	
}}


function formatear_numeros_R(cadena,clase,op){
	
if(op=='A'){// SE LLAMA A LA FUNCION AGREGAR

return agregar_formatos_R(cadena,clase);
	
}else
if(op=='Q'){
return quitar_formatos_R(cadena,clase);}	
		
}

function permisos(m)
{
	$.ajax({
	      url: "../controllers/permisos.php",
	      global: false,
	      type: "POST",
	      data: ({	op			: "LP_MOD",
	      			modulos_id 	: m
	      		}),
	      dataType: "html",
	      async:false,
	      success: function(data)
	      { 
	      	pms = data;
		  }
	});
	return pms;
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

// separa decimales de una cadena y manda la cadena a formato_miles

/*patron = /\d/; // Solo acepta números
  patron = /\w/; // Acepta números y letras
  patron = /\D/; // No acepta números
  patron =/[A-Za-zñÑ\s]/; // igual que el ejemplo, pero acepta también las letras ñ y Ñ
  
  También se puede hacer un patrón que acepte determinados caracteres, 
  poniendolos entre corchetes. 
  Veamos un ejemplo para validar que solo se acepte a, j, t, 6 y 9:
  patron = /[ajt69]/;
  
  O el caso contrario, queremos aceptar cualquier caracter, menos alguno. 
  Los que no nos sirven se ponen en el patron y se cambia un poco el 
  código de la función que usamos para validar.
  patron =/[javierb]/; // 4
  te = String.fromCharCode(tecla); // 5
  return !patron.test(te); // 6

*/

$.fn.datepicker.dates['es'] = {
    days: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
    daysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    today: "Hoy",
    clear: "Limpiar",
    format: "mm/dd/yyyy",
    titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
    weekStart: 0
};



