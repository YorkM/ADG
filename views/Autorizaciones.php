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
  <title>Autorizaciones</title>
  <link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php echo (rand()); ?>" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet" />
  <link type="text/css" rel="stylesheet" href="../resources/select2/css/select2.css">
  <link type="text/css" rel="stylesheet" href="../resources/fontawesome/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.13.2/dist/sweetalert2.min.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet">
  <link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php echo (rand()); ?>">
  <style>
    .swal2-popup {
      font-size: 1rem !important;
    }

    .iframe {
      width: 99%;
      height: 85vh;
      border: none
    }

    #ui-id-1,
    #ui-id-2 {
      font-size: 13px;
    }

    #select2-zona-results li,
    #select2-oficina-results li {
      font-size: 13px !important;
    }

    .size-11 {
      font-size: 11px;
    }

    .size-12 {
      font-size: 12px;
    }

    .size-13 {
      font-size: 13px;
    }

    .size-14 {
      font-size: 14px;
    }

    .size-th {
      font-size: 12.5px;
      font-weight: 400;
      color: #055160 !important;
    }

    .size-th-2 {
      font-size: 13px;
      font-weight: 400;
      color: #055160 !important;
    }

    .vertical {
      vertical-align: middle;
    }

    .bag-info {
      background-color: #cff4fc !important;
    }

    .text-green {
      color: #055160 !important;
    }

    #loaderCRM {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background-color: rgba(255, 255, 255, 0.8);
      display: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    #loaderCRM img {
      max-width: 500px;
      height: 300px;
      margin-bottom: 10px;
    }

    .no-wrap {
      padding: 0;
      line-height: 2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  </style>
</head>

<body>
  <div id="tituloModuloCRM" class="alert alert-info" style="font-weight: 500;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0418 - AUTORIZACIONES</div>

  <input type="hidden" id="Organizacion" value="" readonly>
  <input type="hidden" value="<?php echo (!empty($_SESSION["ses_DepId"])) ? $_SESSION["ses_DepId"] : ""; ?>" id="DepId" readonly />
  <input type="hidden" value="<?php echo (!empty($_SESSION["ses_NumOrg"])) ? $_SESSION["ses_NumOrg"] : ""; ?>" id="org" readonly />
  <input type="hidden" id="Rol" value="<?php echo (!empty($_SESSION["ses_RolesId"])) ? $_SESSION["ses_RolesId"] : ""; ?>" readonly>
  <input type="hidden" value="<?php echo (!empty($_SESSION["ses_Id"])) ? $_SESSION["ses_Id"] : ""; ?>" id="IdUser" readonly />
  <input type="hidden" value="<?php echo (!empty($_SESSION["ses_OfcVentas"])) ? $_SESSION["ses_OfcVentas"] : ""; ?>" id="ofic" readonly />
  <input type="hidden" value="<?php echo (!empty($_SESSION["ses_Login"])) ? $_SESSION["ses_Login"] : ""; ?>" id="usuario" readonly />

  <div class="container-fluid">
    <!-- MENÚ DE OPCIONES A LOS TABS -->
    <ul class="nav nav-tabs" id="nav-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="btnAutorizaciones" data-bs-toggle="tab" data-bs-target="#dvAutorizaciones" type="button" role="tab" aria-controls="dvAutorizaciones" aria-selected="true">
          <i class="fa-solid fa-check"></i></i>&nbsp;
          <span class="btn-text">Autorizaciones</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="btnHistorial" data-bs-toggle="tab" data-bs-target="#dvHistorial" type="button" role="tab" aria-controls="dvHistorial" aria-selected="false">
          <i class="fa-solid fa-question"></i>&nbsp;
          <span class="btn-text">Historial</span>
        </button>
      </li>
    </ul>
    <!-- CONTENIDO DE CADA TAB -->
    <div class="tab-content pt-2" id="nav-tabContent">
      <!-- TAB AUTORIZACIONES -->
      <div class="tab-pane fade show active p-2" id="dvAutorizaciones" role="tabpanel" aria-labelledby="nav-home-tab">
        <div style="overflow: auto;" id="contenedorTablaAutorizaciones">
          <table class="table table-bordered table-hover table-sm W-100" id="tablaAutorizaciones">
            <thead>
              <tr>
                <th class="bag-info size-th">LOG_ID</th>
                <th class="bag-info size-th">MANDANTE</th>
                <th class="bag-info size-th">CENTRO COSTO</th>
                <th class="bag-info size-th">LIBRO MAYOR</th>
                <th class="bag-info size-th">ESTADO</th>
                <th class="bag-info size-th">FECHA</th>
                <th class="bag-info size-th">HORA</th>
                <th class="bag-info size-th">USUARIO</th>
                <th class="bag-info size-th">SOCIEDAD</th>
                <th class="bag-info size-th">PRESUPUESTO</th>
                <th class="bag-info size-th">EJECUTADO</th>
                <th class="bag-info size-th text-center">ACCIÓN</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
      <!-- TAB HISTORIAL -->
      <div class="tab-pane fade p-2" id="dvHistorial" role="tabpanel" aria-labelledby="nav-profile-tab">
        <div style="overflow: auto;" id="contenedorTablaAutorizaciones2">
          <table class="table table-bordered table-hover table-sm W-100" id="tablaAutorizaciones2">
            <thead>
              <tr>
                <th class="bag-info size-th">LOG_ID</th>
                <th class="bag-info size-th">MANDANTE</th>
                <th class="bag-info size-th">CENTRO COSTO</th>
                <th class="bag-info size-th">LIBRO MAYOR</th>
                <th class="bag-info size-th">ESTADO</th>
                <th class="bag-info size-th">FECHA</th>
                <th class="bag-info size-th">HORA</th>
                <th class="bag-info size-th">USUARIO</th>
                <th class="bag-info size-th">SOCIEDAD</th>
                <th class="bag-info size-th">PRESUPUESTO</th>
                <th class="bag-info size-th">EJECUTADO</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- LOADING DEL MÓDULO -->
  <div id="" class="" style="display: none;"></div>

  <!-- MODAL VER PDF -->
  <div class="modal fade" id="" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 70%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-green">VISUALIZAR DOCUMENTO</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="ContenidoPDF">

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php echo (rand()); ?>"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.13.2/dist/sweetalert2.all.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
  <script type="text/javascript" src="../resources/select2/js/select2.full.min.js"></script>
  <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../controllers/Autorizaciones.js?<?php echo (rand()); ?>"></script>
</body>

</html>