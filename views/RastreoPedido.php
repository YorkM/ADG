<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
include('../models/funciones.php');
///echo $_SESSION["ses_NitPro"];
?>
<!doctype html>

<html>

<head>
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Last-Modified" content="0">
  <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta charset="utf-8">
  <title>Trazabilidad de pedidos</title>
  <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"> -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
  <link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php echo (rand()); ?>" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
  <!-- <link type="text/css" rel="stylesheet" href="../lib/SweetAlert/sweet-alert.css?" /> -->
  <!-- <link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs.css?"> -->
  <style>
    html {
      font-size: 1rem;
    }

    .text-center {
      text-align: center;
    }

    .text-justify {
      text-align: justify;
    }

    .center {
      display: flex;
      justify-content: center;
    }

    .w-30 {
      width: 35%;
      margin: 0 auto;
    }

    .w-50-two {
      width: 60%;
      margin: 0 auto;
    }

    .w-100 {
      width: 100%;
    }

    table {
      margin-bottom: 10px !important;
    }

    .rastreo-table {
      margin-bottom: 20px;
      table-layout: fixed;
      width: 100%;
    }

    .rastreo-table th,
    .rastreo-table td {
      vertical-align: middle;
      text-align: center;
      word-wrap: break-word;
    }

    .rastreo-table-two {
      vertical-align: middle;
      /* text-align: center; */
      word-wrap: break-word;
    }

    .rastreo-img {
      width: 80px;
      margin-bottom: 5px;
    }

    .rastreo-titulo {
      font-weight: bold;
      display: block;
      margin-top: 5px;
    }

    .rastreo-section {
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 25px;
    }

    .custom-color {
      color: #055160 !important;
    }

    .custom-font-size {
      font-size: 14px !important;
    }

    .custom-font-title {
      font-weight: 400 !important;
      text-align: left !important;
      color: #055160 !important;
    }
  </style>
</head>

<body>
  <div id="tbBuscarRastreo">
    <h1 class="text-center mb-4 mt-5">TRAZABILIDAD DE PEDIDOS</h1>
    <div class="center mb-4">
      <img src="../resources/icons/rastreo/radar.png">
    </div>
    <div class="w-50-two mb-5">
      <p class="text-justify">Rastree sus pedidos de manera rápida y fácil con Multidrogas/Roma Rastreo. Simplemente ingrese su número de pedido, previamente obtenido a través de nuestros televendedores o ejecutivos de venta y mantengase al tanto del estado del mismo.</p>
    </div>
    <div class="w-30 mb-2">
      <input type="text" id="numero" class="form-control" placeholder="Número Pedido" onKeyPress="return vnumeros(event)">
    </div>
    <div class="w-30 mb-2">
      <button class="btn btn-primary w-100" onClick="trazabilidad();">Consultar</button>
    </div>
  </div>

  <div class="row mt-2" style="width: 99%; margin: 0 auto;" id="tbRastreo">
    <div class="col-md-6">
      <table class="table table-bordered table-sm">
        <thead class="table-info">
          <tr>
            <th class="text-center custom-color" colspan="3">SEGUIMIENTO / RASTREO DE PEDIDOS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="custom-font-title">Organización</td>
            <td class="custom-font-size" colspan="2" id="txt_org"></td>
          </tr>
          <tr>
            <td class="custom-font-title">Bodega</td>
            <td class="custom-font-size" colspan="2" id="txt_bodega"></td>
          </tr>
          <tr>
            <td class="custom-font-title">Nombres</td>
            <td class="custom-font-size" colspan="2" id="txt_cliente"></td>
          </tr>
          <tr>
            <td class="custom-font-title">Identificación</td>
            <td class="custom-font-size" colspan="2" id="txt_nit"></td>
          </tr>
          <tr>
            <td class="custom-font-title">Código Interno:</td>
            <td class="custom-font-size" colspan="2" id="txt_cod"></td>
          </tr>
          <tr>
            <td class="custom-font-title">Departamento:</td>
            <td class="custom-font-size" colspan="2" id="txt_depa"></td>
          </tr>
          <tr>
            <td class="custom-font-title">Ciudad:</td>
            <td class="custom-font-size" colspan="2" id="txt_ciud"></td>
          </tr>
          <tr>
            <td class="custom-font-title">Dirección:</td>
            <td class="custom-font-size" colspan="2" id="txt_dir"></td>
          </tr>
      </table>     
    </div>
    <div class="col-md-6">
      <!-- TRZABILIDAD -->
      <table class="table table-bordered table-sm rastreo-table">
        <thead class="table-info">
          <tr>
            <th class="custom-color" colspan="3">TRAZABILIDAD</th>
          </tr>
        </thead>
        <!-- PEDIDO -->
        <tbody>
          <tr>
            <td class="text-center" rowspan="6">
              <img src="../resources/icons/rastreo/usuarios.png" class="rastreo-img">
              <span class="rastreo-titulo custom-color">PEDIDO</span>
            </td>
            <td class="custom-font-title rastreo-table-two">Número Pedido</td>
            <td class="custom-font-size" id="txt_pedido"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Usuario Pedido</td>
            <td class="custom-font-size" id="txt_usr_ped"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Fecha</td>
            <td class="custom-font-size" id="txt_fh_ped"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Fecha OT</td>
            <td class="custom-font-size" id="txt_fh_ot"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Diferencia</td>
            <td class="custom-font-size" id="txtDifPedido"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Usuario OT</td>
            <td class="custom-font-size rastreo-table-two" id="txt_usr_ot"></td>
          </tr>
        </tbody>
      </table>

      <!-- SEPARACION -->
      <table class="table table-bordered table-sm rastreo-table">
        <tbody>
          <tr>
            <td class="text-center" rowspan="5">
              <img src="../resources/icons/rastreo/separacion.png" class="rastreo-img">
              <span class="rastreo-titulo custom-color">SEPARACIÓN - PICKING</span>
            </td>
            <td class="custom-font-title rastreo-table-two">Usuario</td>
            <td class="custom-font-size" id="txt_usr_sep"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Número OT</td>
            <td class="custom-font-size" id="txt_num_ot"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Fecha Inicio</td>
            <td class="custom-font-size" id="txt_fhini_sep"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Fecha Fin</td>
            <td class="custom-font-size" id="txt_fhfin_sep"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Diferencia</td>
            <td class="custom-font-size" id="difSepa"></td>
          </tr>
        </tbody>
      </table>

      <!-- FACTURACION -->
      <table class="table table-bordered table-sm rastreo-table">
        <tbody>
          <tr>
            <td class="text-center" rowspan="5">
              <img src="../resources/icons/rastreo/facturacion.png" class="rastreo-img">
              <span class="rastreo-titulo custom-color">FACTURACIÓN</span>
            </td>
            <td class="custom-font-title rastreo-table-two">Usuario</td>
            <td class="custom-font-size" id="txt_usr_fact"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Número/Tipo</td>
            <td class="custom-font-size" id="txt_num_fact"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Fecha Inicio</td>
            <td class="custom-font-size" id="txt_fhini_fact"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Fecha Fin</td>
            <td class="custom-font-size" id="txt_fhfin_fact"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Diferencia</td>
            <td class="custom-font-size" id="difFact"></td>
          </tr>
        </tbody>
      </table>

      <!-- EMPAQUE -->
      <table class="table table-bordered table-sm rastreo-table">
        <tbody>
          <tr>
            <td class="text-center" rowspan="7">
              <img src="../resources/icons/rastreo/empaque.png" class="rastreo-img">
              <span class="rastreo-titulo custom-color">EMPAQUE</span>
            </td>
            <td class="custom-font-title rastreo-table-two">Usuario</td>
            <td class="custom-font-size" id="txt_usr_emp"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Fecha Inicio</td>
            <td class="custom-font-size" id="txt_fhini_emp"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Fecha Fin</td>
            <td class="custom-font-size" id="txt_fhfin_emp"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Diferencia</td>
            <td class="custom-font-size" id="difEmpa"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">N° Bolsas</td>
            <td class="custom-font-size" id="txt_n_bolsas"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">N° Paquetes</td>
            <td class="custom-font-size" id="txt_n_paquete"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">N° Cajas</td>
            <td class="custom-font-size" id="txt_n_cajas"></td>
          </tr>
        </tbody>
      </table>

      <!-- ENTREGA -->
      <table class="table table-bordered table-sm rastreo-table">
        <tbody>
          <tr>
            <td class="text-center" rowspan="6">
              <img src="../resources/icons/rastreo/despacho.png" class="rastreo-img">
              <span class="rastreo-titulo custom-color">TRANSPORTE</span>
            </td>
            <td class="custom-font-title rastreo-table-two">Usuario</td>
            <td class="custom-font-size" id="txt_usr_ent"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Fecha Inicio</td>
            <td class="custom-font-size" id="txt_fhini_ent"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Fecha Fin</td>
            <td class="custom-font-size" id="txt_fhfin_ent"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Diferencia</td>
            <td class="custom-font-size" id="difEntre"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">N° Guía</td>
            <td class="custom-font-size" id="txt_guia"></td>
          </tr>
          <tr>
            <td class="custom-font-title rastreo-table-two">Nota</td>
            <td class="custom-font-size" id="txt_nota"></td>
          </tr>
        </tbody>
      </table>
      <div class="mt-2 mb-2 d-flex justify-content-center">
        <button class="btn btn-primary btn_general Regresar w-100" onClick="Regresar();">Regresar</button>
      </div>
    </div>
  </div>

  <script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php echo (rand()); ?>"></script>
  <!-- <script type="text/javascript" src="../lib/js/bootstrap.min.js?"></script> -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.min.js" integrity="sha384-RuyvpeZCxMJCqVUGFI0Do1mQrods/hhxYlcVfGPOfQtPJh0JCw12tUAZ/Mv10S7D" crossorigin="anonymous"></script>
  <!-- <script type="text/javascript" src="../lib/SweetAlert/sweet-alert.min.js?<"></script> -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/jquery.keyz.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../controllers/RastreoPedido.js?<?php echo (rand()); ?>"></script>
</body>

</html>