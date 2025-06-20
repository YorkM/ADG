<?php
session_start();
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Cargue Boletas</title>
<link type="text/css" rel="stylesheet" href="../lib/Bootstrap/V3/css/bootstrap.min.css?<?php echo(rand()); ?>">
<link type="text/css" rel="stylesheet" href="../lib/footable/css/footable.bootstrap.css?<?php  echo(rand()); ?>"/>
<link type="text/css" rel="stylesheet" href="../lib/SweetAlert/sweet-alert.css?<?php  echo(rand()); ?>"/>
<link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php  echo(rand()); ?>" >
<link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs.css?<?php  echo(rand()); ?>" >
<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/css/bootstrap-datepicker.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.min.css" id="theme-styles">
<!------------------------------------------------------------------------------------------------------------------>
<script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/js/bootstrap.min.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/SweetAlert/sweet-alert.min.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/js/funciones.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/footable/js/footable.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/js/bootstrap-datepicker.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.min.js"></script>
<script type="application/javascript" src="../controllers/cargue_boletas.js?<?php  echo(rand()); ?>"></script>
</head>

<body>
<input type="hidden" id="Org" value="<?php if(!empty($_SESSION["ses_NumOrg"])) {echo  $_SESSION["ses_NumOrg"];} ?>" readonly>
<input type="hidden" id="Ofc" value="<?php if(!empty($_SESSION["ses_OfcVentas"])) {echo  $_SESSION["ses_OfcVentas"];} ?>" readonly>
	
<table width="100%" class="form">
   <thead>
   <tr>
    <th colspan="2">GENERAR BOLETAS</th>
   </tr>
  </thead>
  <tbody>
    <tr>
		<td>Selecione una opción</td>
      	<td><select class="form-control" id="archivoexc">
			<option value="0">Selecione</option>
			<option value="1">Boletas Clientes</option>
			<option value="2">Boletas Transferencistas</option>
		</select></td>
    </tr>
    <tr>
      <td>Archivo</td>
	  <td><input type="file" id="archivo" class="form-control" acecpt=".csv,.xlsx,.xls"></td>
    </tr>


    <tr>
      <td colspan="2">
      <button class="btn btn-success" disabled id="registrar_excel">Guardar</button>
	  <button class="btn btn-danger" disabled id="imprimir">Imprimir</button><br>
      </td>
    </tr>
  </tbody>
</table>
<div class="col-lg-12" id="div_tabla"><br></div>
<div class="col-lg-12 alert alert-info" style="display: none" id="loading"><h3>Insertando los datos...</h3></div>
<!--Modal de boletas-->	
	<div class="modal fade bd-example-modal-xl" tabindex="-1" role="dialog" id="ModalBoletas">
	  <div class="modal-dialog modal-xl" role="document">
		<div class="modal-content">
		  <div class="modal-header">
			<h5 class="modal-title">Impresión Boletas</h5>
			<button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
			  <span aria-hidden="true">&times;</span>
			</button>
		  </div>
		  <div class="modal-body" id="ModalBody" style="width: 100%; height: 400px;"></div>
		  <div class="modal-footer">
			<button type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>
		  </div>
		</div>
	  </div>
	</div>
<!--Modal de boletas-->	
</body>
</html>
