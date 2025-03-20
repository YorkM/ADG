// JavaScript Document
$(function(){
	$("#numero").val('').focus();
	$("#tbRastreo").hide();
});
function Enter(){
 tecla = (document.all) ? ob.keyCode : ob.which;
	if(tecla== 13 ){ 
	  Trazabilidad();
	}
}
function Regresar(){
 $("#tbBuscarRastreo").show();
 $("#tbRastreo").hide();
}
function Trazabilidad(){
var numero = $("#numero").val();
if(numero!=''){
$.ajax({
		type: "POST",
		encoding:"UTF-8",
		url: "../models/RastreoPedido.php",
		dataType: "json",
		error: function(OBJ, ERROR, JQERROR){
		 alert(JQERROR);
		},
		data: {
			op   : "TRAZABILIDAD",
			numero  : numero
		},
		async:false,
		success: function(data){
		 if(data!='' && data!=null){
			 for(var i=0; i<=data.length-1; i++){
				//CLIENTE-------------------------------------------
				$("#txt_org").html(data[i].ORG);
				$("#txt_bodega").html(data[i].BODEGA);
				//CLIENTE-------------------------------------------
				$("#txt_cliente").html(data[i].NOMBRES+' - '+data[i].RAZON_COMERCIAL);
				$("#txt_dir").html(data[i].DIRECCION);
				$("#txt_nit").html(data[i].NIT);
				$("#txt_cod").html(data[i].CODIGO_SAP);
				//PEDIDO-------------------------------------------
				$("#txt_pedido").html(data[i].NUMERO);
				$("#txt_usr_ped").html(data[i].USUARIO);
				$("#txt_fh_ped").html(data[i].FECHA_PEDIDO);
				$("#txt_fh_ot").html(data[i].FECHA_OT);
				$("#txt_usr_ot").html(data[i].USUARIO_OT);
				//SEPARACION-------------------------------------------
				$("#txt_usr_sep").html(data[i].USUARIO_SEPARA);
				$("#txt_fhini_sep").html(data[i].INI_SEP);
				$("#txt_fhfin_sep").html(data[i].FIN_SEP);
				$("#txt_num_ot").html(data[i].NUMERO_OT);
				//FACTURACION-------------------------------------------
				$("#txt_usr_fact").html(data[i].USUARIO_FACT);
				$("#txt_fhini_fact").html(data[i].INI_FACT);
				$("#txt_fhfin_fact").html(data[i].FIN_FACT);
				$("#txt_num_fact").html(data[i].NUMERO_FACT);
				//ENTREGA-------------------------------------------
				$("#txt_usr_ent").html(data[i].USUARIO_DESP);
				$("#txt_fhini_ent").html(data[i].INI_TRANS);
				$("#txt_fhfin_ent").html(data[i].FIN_TRANS);
				$("#txt_guia").html(data[i].GUIA);
				$("#txt_nota").html(data[i].NOTA_ENTREGA);
				//EMPAQUE-------------------------------------------
				$("#txt_usr_emp").html(data[i].USUARIO_EMPAQUE);
				$("#txt_fhini_emp").html(data[i].FINI_EMPAQUE);
				$("#txt_fhfin_emp").html(data[i].FFIN_EMPAQUE);
				$("#txt_n_bolsas").html(data[i].N_BOLSAS);
				$("#txt_n_paquete").html(data[i].N_PAQUETES);
				$("#txt_n_cajas").html(data[i].N_CAJAS);
				
			 }	
			 $("#tbBuscarRastreo").hide();
			 $("#tbRastreo").show();
		}else{
		  swal('Oops!!','El numero de pedido que esta intentando buscar no existe, verifique e intente nuevamente','warning');
		}
	 }
});
}else{
  swal('Oops!!','Debe ingresar un numero para iniciar la busqueda','warning');
}
}