<?php 
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
 include('../models/funciones.php');
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
<link type="text/css" rel="stylesheet" href="../resources/css/Generales.css?<?php  echo(rand()); ?>"/>
<link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css"/>
<script type="text/javascript" src="../lib/js/jquery-1.8.3.js"></script>
<script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js"></script>
<script type="text/javascript" src="../lib/js/funciones.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../controllers/Home.js?<?php  echo(rand()); ?>"></script>
<title>Home</title>
</head>
<body>
  <input type="hidden" id="Dpto" value="<?php if(!empty($_SESSION["ses_DepId"])){ echo $_SESSION["ses_DepId"];}?>" readonly>
  <input type="hidden" id="Organizacion" value="<?php if(!empty($_SESSION["ses_NumOrg"])) {echo  $_SESSION["ses_NumOrg"];} ?>" readonly>
  <input type="hidden" id="CodigoSAP" value="<?php if(!empty($_SESSION["ses_CodSap"])){ echo $_SESSION["ses_CodSap"];}?>" readonly>
  <input type="hidden" id="UsrLogin" value="<?php if(!empty($_SESSION["ses_Login"])){ echo $_SESSION["ses_Login"];}?>" readonly>
  </br>
  </br>
  </br>
  </br>
  
  <p align="center" style="font-family:'FontADG'; font-size:40px;color:#113A8E; font-weight:bold" id="evento_roma">
   <img src="../resources/imagenes_eventos/rueda_virtual.jpg" width="500" height="300" style="cursor:pointer;" onClick="RifasRoma();" title="CLICK AQUI PARA CONSULTAR">
  </p>
  
  
  <p align="center" style="font-family:'FontADG'; font-size:40px;color:#113A8E; font-weight:bold" id="evento_roma_trans">
   <img src="../resources/imagenes_eventos/transferencista.jpg" width="380px" height="132px" style="cursor:pointer;" onClick="RifasTransRoma();">
  </p>
  
  
  
  <p align="center" style="font-family:'FontADG'; font-size:40px;color:#113A8E; font-weight:bold">BIENVENIDOS AL ADMINISTRADOR DIGITAL DE LA GESTION</p>
  <h1 align="center" style="font-family:'FontADG'; font-size:50px;color:#FC315D; font-weight:bold">A.D.G</h1>
  <!--<p align="center" style="font-family:'FontADG'; font-size:40px;color:#113A8E; font-weight:bold" id="evento">
   <img src="../resources/imagenes_eventos/rueda_apartado.jpg" width="500" height="300" style="cursor:pointer;" onClick="AbrirConsulta();">
  </p>-->
  
  <div id="DvEvento">
   <table class="form" align="center" width="100%">
    <!--<thead>
     <tr>
      <th colspan="2">DATOS DEL CLIENTE</th>
     </tr>
    </thead>-->
    <tbody>
     <tr>
       <td  width="10%" rowspan="4" colspan="2" align="center">
        <input type="button" value="Nuevo" id="btnLimpiar" class="btn_general BuscarG" style="width:100px; height:100px;" onClick="Limpiar();">
       </td>
     </tr>
     <tr>
      <td>NOMBRES</td>
      <td><input type="text" id="TxtNombres" class="InputG" style="width:100%;"></td>
     </tr>
     <tr>
      <td>NIT</td>
      <td><input type="text" id="TxtNit" class="InputG" style="width:100%;"></td>
     </tr>
     <tr>
      <td>CODIGO SAP</td>
      <td><input type="text" id="TxtCodigo" class="InputG" style="width:100%;""></td>
     </tr>
    </tbody>
   </table>
   <div id="dvResult"></div>
  </div>
</body>
</html>