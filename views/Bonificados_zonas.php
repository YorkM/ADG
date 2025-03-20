<?php 
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
 include('../models/funciones.php');
 session_start();
 //echo $_SESSION["ses_DepId"];
?>
<!--
 MODULO SEGUIMIENTO DE BONIFICADOS POR ZONAS
 Fecha:28-01-2020
 Ingeniero:Javier Perez Cumplido
-->
<!doctype html>
<head>
<meta http-equiv="Expires" content="0">
<meta http-equiv="Last-Modified" content="0">
<meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<link type="text/css" rel="stylesheet" href="../resources/css/Generales.css?<?php  echo(rand()); ?>"/>
<link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php  echo(rand()); ?>"/>
<link type="text/css" rel="stylesheet" href="../lib/SweetAlert/sweet-alert.css?<?php  echo(rand()); ?>"/>
<link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php  echo(rand()); ?>" >
<script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/js/bootstrap.min.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/SweetAlert/sweet-alert.min.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/js/funciones.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../controllers/Bonificados_zonas.js?<?php  echo(rand()); ?>"></script>
<title></title>
</head>
<body bgcolor="#FFFFFF">
<input type="hidden" id="Organizacion" value="<?php echo $_SESSION["ses_OfcVentas"];?>" readonly>
<input type="hidden" id="RolId" value="<?php echo $_SESSION["ses_RolesId"];?>" readonly>
<input type="hidden" id="Ofi" value="<?php echo $_SESSION["ses_OfcVentas"];?>" readonly>
<table class="form" align="center" id="HistorialOpciones" width="100%">
 <thead>	
  <tr>
   <th colspan="6">SEGUIMIENTO BONIFICADOS POR ZONAS</th>
  </tr>
 </thead>
 <tbody> 
  <tr>
  <tr>
    <td>Proveedor</td>
    <td colspan="3"><select class="form-control" id="proveedor"></select></td> 
  </tr>
  <tr>
    <td >Fecha Inicial:</td>
    <td colspan="6"><input type="text" class="form-control" readonly id="fecha_ini" size="10"></td>
  </tr>
  <tr>
    <td>Fecha Final:</td>
    <td colspan="6"><input type="text" class="form-control" readonly id="fecha_fin" size="10"></td>
  </tr> 
  <tr>
    <td>Estado:</td>
    <td colspan="3"><select class="form-control" id="estado">
		<option value="0">TODOS</option>'
		<option value="GESTION">GESTION</option>'
		<option value="SIN_GESTION">SIN GESTION</option>'
		</select></td> 
  </tr>
  <tr>
   <td colspan="6">
    <input type="button" class="btn btn-success" onclick="Consultar();" value="Consultar" />
   <!-- <input type="button" class="btn btn-info" onclick="Gestion();" value="Gestion llamada" />-->
   </td>
  </tr>         
 </tbody>
</table>
</br>
<div id="Result"></div>
 
 
</body>
</html>