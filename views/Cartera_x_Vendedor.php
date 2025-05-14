<?php 
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
 include("../models/funciones.php");
 session_start();
 Redireccionar();
?>
<!doctype html>
<html>
<head>
    <meta http-equiv="Expires" content="0">
    <meta http-equiv="Last-Modified" content="0">
    <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta charset="utf-8">
    <title>CARTERA POR VENDEDOR</title>
    <link type="text/css" rel="stylesheet" href="../lib/Bootstrap/V3/css/bootstrap.min.css?<?php echo(rand()); ?>">
    <link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php  echo(rand()); ?>"/>
    <link type="text/css" rel="stylesheet" href="../lib/SweetAlert/sweet-alert.css?<?php  echo(rand()); ?>"/>
    <link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php  echo(rand()); ?>" >
    <link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs.css?<?php  echo(rand()); ?>" >
    <!------------------------------------------------------------------------------------------------------------------>
    <script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php  echo(rand()); ?>"></script>
    <script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php  echo(rand()); ?>"></script>
    <script type="text/javascript" src="../lib/js/bootstrap.min.js?<?php  echo(rand()); ?>"></script>
    <script type="text/javascript" src="../lib/SweetAlert/sweet-alert.min.js?<?php  echo(rand()); ?>"></script>
    <script type="text/javascript" src="../lib/js/funciones.js?<?php  echo(rand()); ?>"></script>
    <script type="text/javascript" src="../controllers/Cartera_x_Vendedor.js?<?php  echo(rand()); ?>"></script>
</head>
<body>
     <input type="hidden" id="Organizacion" value="<?php if(!empty($_SESSION["ses_NumOrg"]))  { echo $_SESSION["ses_NumOrg"];} ?>"  readonly>
     <input type="hidden" id="TxtRolId"     value="<?php if(!empty($_SESSION["ses_RolesId"])) { echo $_SESSION["ses_RolesId"];} ?>" readonly>
     <input type="hidden" id="TxtIdu"       value="<?php if(!empty($_SESSION["ses_Id"]))      { echo $_SESSION["ses_Id"];} ?>"      readonly>
     <input type="hidden" id="TxtCodSap"    value="<?php if(!empty($_SESSION["ses_CodSap"] )) { echo $_SESSION["ses_CodSap"] ;} ?>" readonly>
     <table width="100%" class="form">
     <thead>
      <tr>
       <th colspan="2">CARTERA GENERAL POR VENDEDOR</th>
      </tr>
     </thead>
     <tbody>
      <tr>
       <td><span>Oficina</span></td>
       <td><select name="SlcOficina" class="form-control" id="SlcOficina"></select></td>
      </tr>
      <tr>  
       <td><span>Ejecutivos</span></td>
       <td><select id="SlcVendedores" class="form-control"></select></td>
      </tr>
      <tr>
       <td colspan="2">
         <button class="btn btn-default" id="btn_consultar" onClick="ConsultarCartera();">Consultar</button>
         <button class="btn btn-success" id="btn_exportar"  onClick="Exportar()" >Exportar</button>
         <button class="btn btn-warning" id="btn_exportar"  onClick="ExportarDirecto()" >Exportar sin Consultar</button>
       </td>
      </tr>
      <tr>
        <td colspan="2"><hr></hr></td>
      </tr>
     </tbody>
    </table>
    <div id="result"></div>
    <div id="Bloquear" style="display:none;"></div>  
    <div class="centrado-porcentual" style="display:none;background-color:transparent; width:30%; height:250px"></div>
</body>
</html>