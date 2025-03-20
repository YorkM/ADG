<?php
/*DESARROLLADO POR ING CRISTIAN BULA 09-12-2022*/
/*ACTUALIZACION ING CRISTIAN BULA 02-09-2024*/
header( "Cache-Control: no-cache, must-revalidate" ); // HTTP/1.1
header( "Expires: Sat, 1 Jul 2000 05:00:00 GMT" ); // Fecha en el pasado
include( '../models/funciones.php' );
session_start();
Redireccionar();

?>
<html>
<head>
<meta http-equiv="Expires" content="0">
<meta http-equiv="Last-Modified" content="0">
<meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta charset="utf-8">
<title>Notas</title>
<!-- Latest compiled and minified CSS -->
<link type="text/css" rel="stylesheet" href="../lib/Bootstrap/V3/css/bootstrap.min.css?<?php echo(rand()); ?>">
<link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php  echo(rand()); ?>"/>
<link type="text/css" rel="stylesheet" href="../lib/SweetAlert2_V10/dist/sweetalert2.all.js?<?php  echo(rand()); ?>"/>
<link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php  echo(rand()); ?>" >
<link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs.css?<?php  echo(rand()); ?>" >
<link type="text/css" rel="stylesheet" href="../resources/select2-bootstrap4-theme/select2-bootstrap4.css" >
<link type="text/css" rel="stylesheet" href="../resources/select2/css/select2.css" >
<link type="text/css" rel="stylesheet" href="../resources/fontawesome/css/all.css" >
<!------------------------------------------------------------------------------------------------------------------> 
<script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php  echo(rand()); ?>"></script> 
<script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php  echo(rand()); ?>"></script> 
<script type="text/javascript" src="../lib/js/bootstrap.min.js?<?php  echo(rand()); ?>"></script> 
<script type="text/javascript" src="../lib/SweetAlert2_V10/dist/sweetalert2.all.js?<?php  echo(rand()); ?>"></script> 
<script type="text/javascript" src="../lib/js/funciones.js?<?php  echo(rand()); ?>"></script> 
<script type="text/javascript" src="../lib/js/servicios.js?<?php  echo(rand()); ?>"></script> 
<script type="text/javascript" src="../resources/HighCharts/code/highcharts.js?<?php  echo(rand()); ?>"></script> 
<script type="text/javascript" src="../lib/bootstrap-notify/bootstrap-notify.min.js"></script> 
<script type="text/javascript" src="../resources/select2/js/select2.full.min.js"></script> 
<script type="text/javascript" src="../resources/select2/js/i18n/es.js"></script> 
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.3/xlsx.full.min.js"></script> 
<script type="text/javascript" src="../controllers/Notas.js?<?php  echo(rand()); ?>"></script>
<style>
.swal2-popup {
    font-size: 1.5rem !important;
}
.modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}
.modal-lg {
    width: 80%;
}
[data-notify] {
    z-index: 9999 !important;
}
md-toast.md-error-toast-theme {
    background-color: #3B3B3B;
    position: 'top right'
}
select option {
    color: "#000000";
}
	
.circle{
	border-radius: 50%;
	width: 30px;
	height: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	font-size: 1.4rem;
	font-weight: bold;
}
.status-s {
	background: #C8C8C8;
	color: black;
}
.status-a {
	background: #3DEC62;
	color: white;
}
.status-r {
	background: #BA0808;
	color: white;
}
.status-g {
	background: #00C5CC;
	color: white;
}
.status-d{
   background: #BF43E9;
   color: white;
}
.status-c{
   background: #0B0EBD;
   color: white;
}

/*Tipos autorizaciones*/	
.tipo-n{
	background: #3DEC62;
	color: white;
}
.tipo-p{
	background: #00C5CC;
	color: white;
}
.tipo-s{
	background: #CCB600;
	color: white;
}
/*Divs stilos colores*/
.div-style {

	width: 100px;
	height: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	font-size: 1.4rem;
	font-weight: bold;
}	
</style>
</head>
<body>
<!--Campos ocultos de informacion -->
<input type="hidden" id="RolId" value="<?php if(!empty($_SESSION["ses_RolesId"])){ echo $_SESSION["ses_RolesId"];}?>" readonly>
<input type="hidden" id="UsrLogin" value="<?php if(!empty($_SESSION["ses_Login"])){ echo $_SESSION["ses_Login"];}?>" readonly>
<input type="hidden" id="Organizacion" value="<?php if(!empty($_SESSION["ses_NumOrg"])) {echo  $_SESSION["ses_NumOrg"];} ?>" readonly>
<!--Campos ocultos de informacion -->
<div class="alert alert-info"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0629 - ADMINISTRACIÓN DE NOTAS</div>
<div class="panel with-nav-tabs panel-info">
  <div class="panel-heading">
    <ul class="nav nav-tabs">
      <li class="active" id="liSolicitud"><a href="#dvSolicitud"  id="" data-toggle="tab"><span class="glyphicon glyphicon-edit" aria-hidden="true">&nbsp;Solicitud</a></li>
      <li id="liGestion" onClick="ConsultarSolicitudes()"><a href="#dvGestion" data-toggle="tab"><span class="glyphicon glyphicon-check" aria-hidden="true">&nbsp;Gestión</a></li>
	  <li class="disabled disabledTab" id="liSeguimiento" onClick="ConsultarSolicitudes()"><a href="#dvSeguimiento" id="btnSeguimiento" ><span class="glyphicon glyphicon-stats" aria-hidden="true">&nbsp;Seguimiento</a></li>
    </ul>
  </div>
  <div class="panel-body">
    <div class="tab-content">
      <div class="tab-pane fade in active" id="dvSolicitud">
        <div class="bs-callout bs-callout-info" id="callout1">
          <h4>Administración de negociaciones especiales.</h4>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <div class="panel panel-info">
              <div class="panel-heading"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Selección de Cliente</div>
              <div style="width: 100%; height: 550px;">
                <table class="form" width="100%">
                  <tbody>
                    <tr>
                      <td>Tipo Negocio</td>
                      <td><select class="form-control" id="SlcTipoNegocio">
                          <option value="">SELECCIONE</option>
                          <option value="G">GERENCIA</option>
                          <option value="P">PROVEEDOR</option>
                          <option value="M">MERCADEO</option>
                          <option value="C">COMERCIAL</option>
						  <option value="O">COMPRAS</option>
                        </select></td>
                    </tr>
                    <tr>
                      <td>Cliente</td>
                      <td><input type="text" class="form-control" id="txtCliente" autocomplete="off"></td>
                    </tr>
                    <tr>
                      <td>Codigo SAP</td>
                      <td><input type="text" class="form-control" id="txtCodigo" readonly disabled></td>
                    </tr>
                    <tr>
                      <td>Oficina</td>
                      <td><input type="text" class="form-control" id="txtOficina" readonly disabled></td>
                    </tr>
                    <tr>
                      <td>Lista</td>
                      <td><input type="text" class="form-control" id="txtLista" readonly disabled></td>
                    </tr>
                    <tr>
                      <td>Grupo Articulo</td>
                      <td><select id="SlcGrupoArticulo" class="form-control" multiple style="width:100%">
                        </select></td>
                    </tr>
                    <tr>
                      <td>Valor Negocio</td>
                      <td><input type="text" class="form-control" id="txtVlrNegocio"  onKeyPress="return vnumeros(event)"></td>
                    </tr>
                    <tr>
                      <td>Descuento %</td>
                      <td><input type="text" class="form-control" id="txtDescuento"  onKeyPress="return vnumeros_puntocoma(event)"></td>
                    </tr>
                    <tr>
                      <td>Valor Descuento</td>
                      <td><input type="text" class="form-control" id="txtVlrDescuento"  onKeyPress="return vnumeros(event)"  readonly disabled></td>
                    </tr>
                    <tr>
                      <td>Soporte (Imagen JPG - JPEG - PNG)</td>
                      <td><input type="file" class="form-control" id="txtImgSoporte" ></td><!--accept="image/jpg"-->
                    </tr>
                    <tr>
                      <td colspan="2"><textarea id="txtNotas" placeholder="Notas opcionales" class="notas"></textarea></td>
                    </tr>
                    <tr>
                      <td colspan="2" align="center"><button class="btn btn-default" id="btnLimpiar" onClick="Limpiar()"> <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span> Limpiar</button>
                        <button class="btn btn-default" id="btnCargarLab" onClick=" CargarProductos()"> <span class="glyphicon glyphicon-log-out" aria-hidden="true"></span> Cargar Productos</button>
                        <button class="btn btn-default" id="btnGuardar" onClick="GuardarSolicitud()"> <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Guardar</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="panel panel-info">
              <div class="panel-heading"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span> Selección de Materiales</div>
              <table class="table table-sm" align="center" id="">
                <thead>
                  <tr>
					<td>
						<input type="text" class="form-control" id="filtroTablaMateriales" placeholder="Filtro de búsqueda" autocomplete="off">
					</td>
					<td>
						<input type="file" class="form-control" id="archivoPlano" placeholder="">
					</td>
					<td>
						<button type="button" class="btn btn-default" aria-label="Left Align" id="listarSeleccionados">
							<span class="glyphicon glyphicon-list" aria-hidden="true"></span> Listar
						</button>
					</td>
                  </tr>
                </thead>
              </table>
              <div id="dvResultMateriales" style="width: 100%; height: 550px; overflow-y: scroll;"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane fade in" id="dvGestion">
		<table class="form" width="100%">
		 <tbody>
		   <tr>
		    <td>
				<div class="input-group"> 
					<span class="input-group-addon" id="basic-addon1">
						<i class="fa-solid fa-calendar-days" style="width: 30px;"></i> Inicial
					</span>
				<input type="text" id="FhInicial" class="form-control" readonly>
				</div>
			</td>
		    <td>
				<div class="input-group"> 
					<span class="input-group-addon" id="basic-addon1">
						<i class="fa-solid fa-calendar-days" style="width: 30px;"></i> Final
					</span>
				<input type="text" id="FhFinal" class="form-control" readonly>
			   </div>
			</td>
		    <td>
				<div class="input-group"> 
					<span class="input-group-addon" id="basic-addon1">
						<i class="fa-solid fa-building" style="width: 30px;"></i> Oficina
					</span>
				<select id="Oficinas" class="form-control"></select>
			    </div>
			</td>
		    <td>
				<div class="input-group"> 
					<span class="input-group-addon" id="basic-addon1">
						<i class="fa-solid fa-building" style="width: 30px;"></i> Tipo
					</span>
					<select class="form-control" id="tnegocio">
                          <option value="">SELECCIONE</option>
                          <option value="G">GERENCIA</option>
                          <option value="P">PROVEEDOR</option>
                          <option value="M">MERCADEO</option>
                          <option value="C">COMERCIAL</option>
						  <option value="O">COMPRAS</option>
                   </select>
			    </div>
			</td>
			<td>
			  <div class="input-group"> 
					<span class="input-group-addon" id="basic-addon1">
						<i class="fa-solid fa-list" style="width: 30px;"></i> Estado
					</span>
			   <select id="Estado" class="form-control">
			     <option value="">TODOS</option>
				 <option value="S">S - SOLICITADO</option>
				 <option value="A">A - AUTORIZADO</option>
				 <option value="R">R - RECHAZADO</option>
				 <option value="G">G - GESTIONADO</option>
				 <option value="D">D - DILIGENCIADO</option>
				 <option value="C">C - CONTABILIZADO</option>
			   </select>
			  </div>
			</td>
		    <td><input type="text" placeholder="Filtro de búsqueda" size="40" class="form-control" id="filtroTablaSolicitudes" name="filtroTablaSolicitudes" autocomplete="off"></td>
			 </tr>
			 <tr>
			<td colspan="6">
				<button type="button" class="btn btn-info btn-sm" id="btnInformacion">
				  <i class="fa-solid fa-circle-info"></i> Información
				</button>
				<button type="button" class="btn btn-default btn-sm" id="btnFacturaDescuentos">
				  <i class="fa-solid fa-magnifying-glass"></i> Facturas
				</button>
				<button type="button" class="btn btn-success btn-sm" id="btnExportar">
				  <i class="fa-regular fa-file-excel"></i> Excel
				</button>
			</td>   
		   </tr>  
		 </tbody>
		</table>
        <div id="dvGestionSolicitudes"> </div>
      </div>
	  <div class="tab-pane fade in" id="dvSeguimiento">
		<div class="bs-callout bs-callout-info" id="callout2">
          <h4>Informes consolidados de negociaciones.</h4>
		  <h5>Tenga en cuenta que el rango de fechas esta basado en la gestion</h5>
        </div>
		
		  </br>
		  <div class="row">
			<div class="col-sm-6">
				<div class="bs-callout bs-callout-info" id="callout3">
				  <h4>Participación de negocios por tipos</h4>
				</div>
				<figure class="highcharts-figure">
				<div id="GrParticipacionTipos"></div>
				<p id="GrDescTipos" class="highcharts-description"></p>
				</figure>
			</div>
			<div class="col-sm-6">
				<div class="bs-callout bs-callout-info" id="callout3">
				  <h4>Administración de recursos por usuario</h4>
				</div>
				<table class="form" width="100%">  
				  <tr>
					  <td>
						<div class="input-group"> 
							<span class="input-group-addon" style="width:200px;" id="basic-addon1">
							  <i class="fa-solid fa-user"></i> Usuario
							</span>
							<input type="text" id="SegUsuario" class="form-control" value="<?php if(!empty($_SESSION["ses_Login"])){ echo $_SESSION["ses_Login"];}?>" readonly>
							<span class="input-group-btn">
								<button class="btn btn-default" id="" type="button"><b>...</b></button>
							</span>	
						</div>
					  </td> 
				  </tr> 
					<tr>
					  <td>
						<div class="input-group"> 
							<span class="input-group-addon alert-success" style="width:200px;" id="basic-addon1">
								<i class="fa-solid fa-coins " ></i> Recurso
							</span>
							<input type="text" id="SegPresupuesto" class="form-control" onKeyPress="return vnumeros(event)" >
							<span class="input-group-btn">
								<button class="btn btn-default" id="btnGuardarRecurso" type="button"><b>Guardar!</b></button>
							</span>
						</div>
					  </td> 
				  </tr> 
					<tr>
					  <td>
						<div class="input-group"> 
							<span class="input-group-addon alert-warning" style="width:200px;" id="basic-addon1">
								<i class="fa-solid fa-coins"></i> Ejecución
							</span>
							<input type="text" id="SegEjecucion" class="form-control" readonly>
							<span class="input-group-btn">
								<button class="btn btn-default" id="" type="button"><b>...</b></button>
							</span>	
						</div>
					  </td> 
				  </tr> 
					<tr>
					  <td>
						<div class="input-group"> 
							<span class="input-group-addon alert-danger" style="width:200px;" id="basic-addon1">
								<i class="fa-solid fa-coins" ></i> Disponible
							</span>
							<input type="text" id="SegDisponible" class="form-control" readonly>
							<span class="input-group-btn">
								<button class="btn btn-default" id="" type="button"><b>...</b></button>
							</span>	
						</div>
					  </td> 
				  </tr> 
				</table>	
			
			</div>	
		</div>	
		<div class="row">
		  <div class="col-sm-6">
			 <div class="bs-callout bs-callout-info" id="callout4">
				  <h4>Estado de solicitudes</h4>
				</div>
			 <figure class="highcharts-figure">
				<div id="GrEstadoSolicitudes"></div>
				<p id="GrDescEstadoSolicitudes" class="highcharts-description"></p>
			 </figure>
		  </div>
		  <div class="col-sm-6">
			  <div class="bs-callout bs-callout-info" id="callout5">
				  <h4>Valores notas por usuarios - (No proveedores)</h4>
				</div>
			 <figure class="highcharts-figure">
				<div id="GrNotasUsuarios"></div>
				<p id="GrDescNotasUsuarios" class="highcharts-description"></p>
			 </figure>
		  </div>	
		</div>
		<div class="row">
		  <div class="col-sm-6">
			<div class="bs-callout bs-callout-info" id="callout6">
			  <h4>Notas por grupos - (Solo proveedores)</h4>
			</div>
			<div id="GrNotasGrupos"></div>
		  </div>
		  <div class="col-sm-6"></div>
		</div>
	  </div>	  
    </div>
  </div>
</div>
<!-------------MODALS---------------------->

<div id="ModalOpciones" class="modal fade bd-example-modal-lg" role="dialog">
  <div class="modal-dialog modal-lg"> 
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title"><b>Gestion de solicitud</b></h4>
		<div class="row">
          <div class="col-sm-12">
		    <div class="bs-callout bs-callout-sm bs-callout-danger" id="CallOutInfoCliente"></div>
		  </div>
		 </div>
      </div>
      <div class="modal-body" id="">
		
        <div class="row">
          <div class="col-sm-6">
            <div class="panel panel-info">
              <div class="panel-heading"><span class="glyphicon glyphicon-bookmark" aria-hidden="true"></span> Datos del negocio</div>
              <input type="hidden" id="GesUsrNegocio" class="form-control" disabled readonly>
              <input type="hidden" id="GesId" class="form-control" disabled readonly>
			  <input type="hidden" id="GesNotaFondo" class="form-control" disabled readonly>
              
              <input type="hidden" id="GesFecha" class="form-control" disabled readonly>
			  <input type="hidden" id="GesEstado" class="form-control" disabled readonly>
			  <input type="hidden" id="GesOficinaVentas" class="form-control" disabled readonly>
              <table class="form" width="100%">
                <tr>
                  <td>Tipo Negocio</td>
                  <td>
					  <div class="row" style="display:none">
						<div class="col-xs-2">
						  <input type="text" id="GesTipoNegocio" class="form-control" disabled readonly>
						</div>
						<div class="col-xs-10">
						   <input type="text" id="GesTipoNegocioDesc" class="form-control" disabled readonly>
						</div>
					  </div>
					  <select class="form-control" id="SlcGesTipoNegocio">
                          <option value="G">G - GERENCIA</option>
                          <option value="P">P - PROVEEDOR</option>
                          <option value="M">M - MERCADEO</option>
                          <option value="C">C - COMERCIAL</option>
						  <option value="O">O - COMPRAS</option>
                        </select>
				  </td>
                </tr>
				<tr>
                  <td>Codigo Cliente</td>
                  <td><input type="text" id="GesCodigoSAP" class="form-control" disabled readonly></td>
                </tr>
				<tr>
                  <td>Condición Pago</td>
                  <td><input type="text" id="GesCondicionPago" class="form-control" disabled readonly></td>
                </tr>
				<tr>
                  <td>Descuento PP</td>
                  <td><input type="text" id="GesDescuentoPP" class="form-control" disabled readonly></td>
                </tr>
                <tr>
                  <td>Laboratorio Negocio</td>
                  <td>
					  <div class="row">
						<div class="col-xs-6">
						  <input type="text" id="GesLabNegocio" class="form-control" disabled readonly>
						</div>
						<div class="col-xs-6" id="TdSoporte">
						   
						</div>
					  </div>
                </tr>
				<tr>
                  <td>Descuento</td>
                  <td><input type="text"  id="GesDescuento" onKeyPress="return vnumeros_puntocoma(event)" class="form-control" disabled readonly></td>
                </tr>
                <tr>
                  <td>Valor Negocio Solicitado</td>
                  <td><input type="text" id="GesVlrNegocio"  onKeyPress="return vnumeros(event)" class="form-control" disabled readonly></td>
                </tr>                
                <tr>
                  <td>Valor descuento Solicitado</td>
                  <td><input type="text"  id="GesVlrDescuento"  class="form-control" disabled readonly></td>
                </tr>
				<tr>
                  <td>Valor Negocio Facturado</td>
                  <td><input type="text" id="GesVlrNegocioFac"  onKeyPress="return vnumeros(event)" class="form-control" disabled readonly></td>
                </tr>                
                <tr>
                  <td>Valor descuento Facturado</td>
                  <td><input type="text"  id="GesVlrDescuentoFac"  class="form-control" disabled readonly></td>
                </tr>
                <tr>
                  <td>Notas</td>
                  <td><textarea id="GesNotas" placeholder="Nota" class="notas"></textarea></td>
                </tr>
				<tr>
                  <td colspan="2">
				    <button type="button" id="BtnAnular" class="btn btn-danger">
						<i class="fa-solid fa-circle-minus"></i> Anular Solicitud
					</button>
				  </td>
                </tr>
                <tr>
                  <td colspan="2"><button type="button" id="BtnUpdate" class="btn btn-default" style="display: none"><span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Guardar</button></td>
                </tr>
              </table>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="panel panel-info" id="PanelFactura" style="display: none;">
              <div class="panel-heading"><span class="glyphicon glyphicon-piggy-bank" aria-hidden="true"></span> Datos de facturación</div>
              <table class="form" width="100%">
                <tr>
                  <td>Numero de Factura</td>
                  <td><input type="text" id="GesNumFact" class="form-control" disabled readonly></td>
                </tr>
                <tr>
                  <td>Valor Neto</td>
                  <td><input type="text" id="GesVlrFact" class="form-control" disabled readonly></td>
                </tr>
				<tr>
                  <td>Valor Neto PP</td>
                  <td><input type="text" id="GesVlrFactPP" class="form-control" disabled readonly></td>
                </tr>
                <tr>
                  <td colspan="2">
					<button type="button" id="BtnFactura" class="btn btn-default" style="display: none">
						<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Guardar
					</button> 
					<button type="button" id="BtnFinCarga" class="btn btn-success" style="display: none">
						<span class="fa fa-gavel" aria-hidden="true"></span> Finalizar Facturas
					</button>
					<button type="button" id="btnCrearDoc" class="btn btn-primary" style="display: none">
						<span class="glyphicon glyphicon-check" aria-hidden="true"></span> Gestión Nota 
					</button>
				 </td>
                </tr>
              </table>
			  <div id="dvResultFacturas"></div>
            </div>
          </div>
        </div>
		<div class="row">
          <div class="col-sm-6">
			  <div class="panel panel-info">
				  <div class="panel-heading"><span class="glyphicon glyphicon-list" aria-hidden="true"></span> Datos de gestion</div>
				  <div id="dvPanelGestion">
				    <table class="form" width="100%">
				     <tbody>
					  <tr>
						  <td>Usuario Autoriza/Rechaza</td>
						  <td id="UsuAutoriza"></td>
						  <td>Fecha Autoriza</td>
						  <td id="FhAutoriza"></td>
					  </tr>
					  <tr>
						  <td>Usuario Ingresa Factura</td>
						  <td id="UsuFactura"></td>
						  <td>Fecha Ingreso Factura</td>
						  <td id="FhFactura"></td>
					  </tr>
					  <tr>
						  <td>Usuario Diligencia Nota</td>
						  <td id="UsuNota"></td>
						  <td>Fecha Diligencia Nota</td>
						  <td id="FhNota"></td>
					  </tr>
					  <tr>
						  <td>Usuario Aprueba</td>
						  <td id="UsuAprueba"></td>
						  <td>Fecha Aprueba</td>
						  <td id="FhAprueba"></td>
					  </tr>
					  <tr>
						  <td>Usuario Anula</td>
						  <td id="UsuAnula"></td>
						  <td>Fecha Aprueba</td>
						  <td id="FhAnula"></td>
					  </tr>
					 </tbody>
					</table>
				  </div>
				</div>
		  </div>
		</div>   
		<div class="row">
          <div class="col-sm-6">
			    <div class="panel panel-info">
				  <div class="panel-heading"><span class="glyphicon glyphicon-list" aria-hidden="true"></span> Datos de materiales</div>
				  <div id="dvPanelMateriales"></div>
				</div>
		  </div>
		</div>        
		
      </div>
      <div class="modal-footer" id="FootAutorizacion" style="display: none;">
        <div class="btn-group">
          <button class="btn btn-success dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <span class="glyphicon glyphicon-check" aria-hidden="true"></span> Autorizar <span class="caret"></span> </button>
          <ul class="dropdown-menu">
            <li><a id="btnAutorizaNota" style="cursor: pointer">Nota Crédito</a></li>
            <li><a id="btnAutorizaPed" style="cursor: pointer">Dcto Pedido</a></li>
          </ul>
        </div>
        <button type="button" class="btn btn-danger" id="btnRechazar"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Rechazar </button>
      </div>
    </div>
  </div>
</div>
</div>
<div id="ModalPDF" class="modal fade bd-example-modal-lg" role="dialog">
  <div class="modal-dialog modal-lg"> 
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">VISUALIZAR DOCUMENTO</h4>
      </div>
      <div class="modal-body" id="ContenidoPDF"> </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<div id="ModalListarProductosSeleccionados" class="modal fade bd-example-modal-lg" role="dialog">
  <div class="modal-dialog modal-lg"> 
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">PRODUCTOS SELECCIONADOS</h4>
      </div>
      <div class="modal-body" id="ContenidoProductosSeleccionados"> </div>
      <div class="modal-footer">
		<div class="row">
		 <div class="col-md-4 text-left" id="TotalListaProductos"></div>
		 <div class="col-md-8">
		  <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>	
		 </div>	
		</div>	
        
      </div>
    </div>
  </div>
</div>

<div id="ModalNotas" class="modal fade bd-example-modal-lg" role="dialog">
  <div class="modal-dialog modal-lg"> 
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">ADMINISTRACIÓN DE NOTAS</h4>
      </div>
      <div class="modal-body" id="">
		<div class="row">  
		  <div id="dvcol1" class="col-md-6">
           <div class="panel panel-info" id="PanelCliente">
          <div class="panel-heading"><span class="fa-solid fa-file-pen" aria-hidden="true"></span> Creación de notas</div>
          <table class="form" width="100%">
			<thead>
				<tr>
				 <th colspan="2">DATOS DE CLIENTE</th>
				</tr>
			</thead>	
			<tr>
			  <td>Seleccionar Descuento</td>	
			  <td>
				  <div class="form-check">
					  <input class="form-check-input" type="radio" name="flexRadio" id="Radio1" value="0" >
					  <label class="form-check-label" for="Radio1">
						Descuento Solicitado
					  </label>
					</div>
					<div class="form-check">
					  <input class="form-check-input" type="radio" name="flexRadio" id="Radio2" value="1" >
					  <label class="form-check-label" for="Radio2">
						Descuento Facturado
					  </label>
					</div>
			   </td>	
            </tr>
			<tr>
              <td>Valor Nota</td>
              <td><input type="text" id="txtValorNota" class="form-control" readonly disabled></td>
            </tr>
			<tr>
              <td>Numero documento</td>
              <td><input type="text" id="txtNumDoc" class="form-control" readonly disabled></td>
            </tr>
            <tr>
              <td>Fecha Documento</td>
              <td><input type="text" id="fhDocumento" class="form-control input-notas" readonly ></td>
            </tr>
            <tr>
              <td>Fecha Contabilización</td>
              <td><input type="text" id="fhContabilizacion" class="form-control input-notas" readonly ></td>
            </tr>
            <tr>
              <td>Cuenta Mayor</td>
              <td><input type="text" id="txtCuentaMayor" class="form-control input-notas"></td>
            </tr>
            <tr>
              <td>Centro Costo</td>
              <td><input type="text" id="txtCentroCosto" class="form-control input-notas"></td>
            </tr>
            <tr>
              <td>Centro Beneficio</td>
              <td><input type="text" id="txtCentroBeneficio" class="form-control input-notas"></td>
            </tr>            
            <tr>
              <td>Texto 1</td>
              <td><input type="text" id="txtTexto1" class="form-control input-notas"></td>
            </tr>
            <tr>
              <td>Texto 2</td>
              <td><input type="text" id="txtTexto2" class="form-control input-notas"></td>
            </tr>			
          </table>
        </div>
		</div>	  
		<div class="col-md-6">
		<div class="panel panel-info" id="PanelProveedor">
          <div class="panel-heading"><span class="fa-solid fa-file-pen" aria-hidden="true"></span> Creación de notas proveedor</div>
		   <table class="form" width="100%">
		    <thead>
				<tr>
				 <th colspan="2">DATOS DE PROVEEDOR</th>
				</tr>
			</thead>
			<tr>
              <td>Numero documento</td>
              <td><input type="text" id="txtNumDocProv" class="form-control" readonly disabled></td>
            </tr>
			<tr>
              <td>Cuenta Mayor</td>
              <td><input type="text" id="txtCuentaMayorProv" class="form-control input-notas"></td>
            </tr>
			<tr>
              <td>Proveedor</td>
              <td><input type="text" id="txtCodigoProv" class="form-control input-notas"></td>
            </tr>
			<tr>
              <td>Fecha Pago</td>
              <td><input type="text" id="fhPagoProv" class="form-control input-notas" readonly ></td>
            </tr>
			<tr>
              <td>Centro Costo</td>
              <td><input type="text" id="txtCentroCostoProv" class="form-control input-notas"></td>
            </tr>
            <tr>
              <td>Centro Beneficio</td>
              <td><input type="text" id="txtCentroBeneficioProv" class="form-control input-notas"></td>
            </tr>
			<tr>
              <td>Texto 1</td>
              <td><input type="text" id="txtTexto1Prov" class="form-control input-notas"></td>
            </tr>
            <tr>
              <td>Texto 2</td>
              <td><input type="text" id="txtTexto2Prov" class="form-control input-notas"></td>
            </tr>
		   </table>
		</div>
		  </div>
		</div>
      </div>
      <div class="modal-footer">
		  <div class="row">
			<div class="col-md-6"> </div> 	
			<div class="col-md-3"> 
				<select id="SlcTipoAplicacion" class="form-control" style="display: none;">
					<option value="0">Sin Fondo (Prov)</option>
					<option value="1">Con Fondo (Prov)</option>
				</select>	
			</div>
			<div class="col-md-3"> 
				<button type="button" class="btn btn-success" id="btnGuardarNota">
					<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Guardar
				</button>	
				<button type="button" class="btn btn-primary" id="btnAprobarNota">
					<span class="glyphicon glyphicon-check" aria-hidden="true"></span> Aprobar
				</button>			
				<button type="button" class="btn btn-info" data-dismiss="modal">
					<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Cerrar
				</button>
			</div>
	     </div>
      </div>
    </div>
  </div>
</div>
<div id="ModalImagen" class="modal fade bd-example-modal-lg" role="dialog">
  <div class="modal-dialog modal-lg"> 
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Imagen de soporte</h4>
      </div>
      <div class="modal-body" id="ContenidoImagen" align="center"></div>
      <div class="modal-footer">
		  
		  <div class="input-group">
				<div class="row">
					<div class="col-md-9">
						<input type="file" class="form-control" id="txtImgSoporteAdicional">
					</div>  
					<div class="col-md-3">
						<button type="button" class="btn btn-danger" aria-label="Left Align" onClick="UpdImg()">
						<span class="glyphicon glyphicon-paperclip" aria-hidden="true"></span> Actualizar
						</button>
					</div>
				</div>			  
		 </div>
		  
		  
		
        <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<div id="ModalInfo" class="modal fade bd-example-modal-lg" role="dialog">
  <div class="modal-dialog modal-lg"> 
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">INFORMACIÓN DE TIPOS Y ESTADOS</h4>
      </div>
      <div class="modal-body" id=""> 
	    <div class="panel panel-info">
          <div class="panel-heading"><span class="fa-solid fa-file-pen" aria-hidden="true"></span> Estado de la solicitud</div>
		  <table class="form" width="100%">
		    <tr>
				<td align="center" width="5%"><div class="circle status-s">S</div></td>
				<td align="left" width="10%"><b>Solicitado</b></td>
				<td align="justify">Es el estado inicial de la solicitud, tan pronto es montada al sistema</td>
			</tr>
			<tr>
				<td align="center"><div class="circle status-a">A</div></td>
				<td align="left"><b>Autorizado</b></td>
				<td align="justify">El departamento asignado acepta las condiciones del negocio</td>
			</tr>
			<tr>
				<td align="center"><div class="circle status-g">G</div></td>
				<td align="left"><b>Gestionado</b></td>
				<td align="justify">Cuando el solicitante adjunta las facturas y da paso a la gestion de la nota</td>
			</tr>
			<tr>
				<td align="center"><div class="circle status-d">D</div></td>
				<td align="left"><b>Diligenciado</b></td>
				<td align="justify">A la espera de la aprobacion y contabilización de la nota</td>
			</tr>
			<tr>
				<td align="center"><div class="circle status-c">C</div></td>
				<td align="left"><b>Contabilizado</b></td>
				<td align="justify">Aqui finalizo todo el flujo del proceso con la contabilizacion de la nota en SAP</td>
			</tr>
			<tr>
				<td align="center"><div class="circle status-r">R</div></td>
				<td align="left"><b>Rechazado</b></td>
				<td align="justify">El departamento asignado no acepta las condiciones del negocio</td>
			</tr>
		  </table>	  
	    </div>
		<div class="panel panel-info">
          <div class="panel-heading"><span class="fa-solid fa-file-pen" aria-hidden="true"></span> Tipos de negocios</div>
			<table class="form" width="100%">
		    <tr>
				<td align="center" width="5%"><div class="circle tipo-s">?</div></td>
				<td align="left" width="10%"><b>Sin Asignar</b></td>
				<td align="justify">Tipo de solicitud sin asignación por parte del responsable</td>
			</tr>
			<tr>
				<td align="center"><div class="circle tipo-n">N</div></td>
				<td align="left"><b>Nota</b></td>
				<td align="justify">Solicitud autorizada con descuento sobre nota</td>
			</tr>
			<tr>
				<td align="center"><div class="circle tipo-p">P</div></td>
				<td align="left"><b>Pedido</b></td>
				<td align="justify">Solicitud autorizada por descuentos sobre pedidos, en este caso aqui finaliza el proceso</td>
			</tr>
			</table>
	    </div>
	  </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>


<div id="ModalInfoFacturas" class="modal fade bd-example-modal-lg" role="dialog">
  <div class="modal-dialog modal-lg"> 
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">CONSULTA DE DESCUENTOS EN FACTURAS</h4>
      </div>
      <div class="modal-body" id=""> 
			<div class="row">
				<div class="col-md-12">
					<div class="input-group"> 
						<span class="input-group-addon" id="basic-addon1">
						  <i class="fa-solid fa-building" style="width: 30px;"></i> Factura
						</span>
						<input type="text" class="form-control" id="txtConsultaFactura" placeholder="Digite el número de factura y presione enter">
					</div>
				</div>	
			</div>	
		    </br>
		    <div id="ResultFacturaDescuentos"></div>
	  </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
<!----------------------------------->
<div id="Bloquear" style="display:none;"></div>
<div class="centrado-porcentual" style="display:none;background-color:transparent; width:30%; height:250px"></div>
</body>
</html>
