<?php
// DESARROLLADO POR ING CRISTIAN BULA 09-04-2018
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 1 Jul 2000 05:00:00 GMT");
include('../models/funciones.php');
session_start();
Redireccionar();
$sociedad = (!empty($_SESSION["ses_NumOrg"])) ? $_SESSION["ses_NumOrg"] : "";
?>
<!doctype html>
<html>

<head>
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Last-Modified" content="0">
  <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta charset="utf-8">
  <title>Recibos de caja - SAP</title>
  <link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php echo (rand()); ?>" />
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../lib/SweetAlert2_V10/dist/sweetalert2.css">
  <link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php echo (rand()); ?>">
  <link type="text/css" rel="stylesheet" href="../resources/fontawesome/css/all.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet">
  <style>
    html {
      font-size: 1rem;
    }

    .material-switch>input[type="checkbox"] {
      display: none;
    }

    .material-switch>label {
      cursor: pointer;
      height: 0px;
      position: relative;
      width: 40px;
    }

    .material-switch>label::before {
      background: rgb(0, 0, 0);
      box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.5);
      border-radius: 8px;
      content: '';
      height: 16px;
      margin-top: -8px;
      position: absolute;
      opacity: 0.3;
      transition: all 0.4s ease-in-out;
      width: 40px;
    }

    .material-switch>label::after {
      background: rgb(255, 255, 255);
      border-radius: 16px;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
      content: '';
      height: 24px;
      left: -4px;
      margin-top: -8px;
      position: absolute;
      top: -4px;
      transition: all 0.3s ease-in-out;
      width: 24px;
    }
    
    .material-switch>input[type="checkbox"]:checked+label::before {
      background: #28a745;
      opacity: 0.5;
    }

    .material-switch>input[type="checkbox"]:checked+label::after {
      background: #28a745;
      left: 20px;
    }


    .iframe {
      width: 99%;
      height: 85vh;
      border: none;
    }

    .contenedor-valores {
      display: flex;
      flex: 1;
      gap: 5%;
      align-items: center;
    }

    .contenedor-val-todas {
      display: flex;
      justify-content: space-between;
      align-items: end;
      margin-bottom: 8px;
    }

    @media (max-width: 768px) {
      .contenedor-valores {
        flex-direction: column;
      }

      .contenedor-val-todas {
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
    }

    .p-valores {
      font-size: 20px;
      margin: 0;
    }

    .custom-padding {
      padding: 3px 8px;
      font-size: 14px;
    }

    .custom-padding-two {
      padding: 3px 8px;
      font-size: 14px;
    }

    .cantBan {
      margin: 0;
      font-size: 1.1rem;
      border: 1px solid #ccc;
      padding: 4px 5px;
      border-radius: 4px;
      text-align: center;
    }

    .cantBan2 {
      margin: 0;
      border: 1px solid #ccc;
      padding: 0px 5px;
      border-radius: 3px;
    }

    .no-wrap {
      padding: 0;
      line-height: 2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .vertical {
      vertical-align: middle !important;
    }

    .div-container {
      width: 99.8%;
      margin: 0 auto;
      border-left: 2px solid #dee2e6;
      border-right: 2px solid #dee2e6;
      padding: 0 8px;
    }

    .custom-thead {
      height: 35px;
      font-size: 15px;
      color: #055160;
      font-weight: 500;
      background-color: #cff4fc;
      padding: 0 5px;
    }

    .custom-tr {
      line-height: 3;
    }

    .custom-td {
      line-height: 2.3;
    }

    .size-text {
      font-size: 14px !important;
    }

    .size-td {
      font-size: 13px;
    }

    .text-green {
      color: #055160 !important;
    }

    .size-th {
      font-size: 14px !important;
      color: #055160 !important;
    }

    .size-th-2 {
      font-size: 15px !important;
      color: #055160 !important;
    }

    .bg-info {
      background-color: #cff4fc !important;
    }

    .fw-500 {
      font-weight: 500 !important;
    }

    .container-fixed {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      border: 1px solid #CCC;
      border-radius: 3px;
      background-color: #cff4fc;
      width: 99.5%;
    }

    #loaderOverlayRecibo {
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

    #loaderOverlayRecibo img {
      max-width: 500px;
      height: 300px;
      margin-bottom: 10px;
    }

    .overflow {
      overflow: auto;
    }

    #ui-id-1,
    #ui-id-2,
    #ui-id-3 {
      font-size: 13px !important;
    }

    .btn-micro {
      border: 1px solid #dee2e6;
      border-radius: 0 3px 3px 0;
    }

    .w-btn {
      width: 50px;
    }

    .size-10 {
      font-size: 10px;
    }

    .margin-hr {
      margin: 0px 0px 16px 0 !important;
    }

    .custom-alert-one {
      padding: 8px;
      border-top: 1px solid #CCC;
      border-right: 1px solid #CCC;
      border-bottom: 1px solid #CCC;
      border-left: 5px solid #5bc0de;
      border-radius: 3px;
    }

    .custom-alert-two {
      padding: 8px;
      border-top: 1px solid #CCC;
      border-right: 1px solid #CCC;
      border-bottom: 1px solid #CCC;
      border-left: 5px solid #5cb85c;
      border-radius: 3px;
    }

    .custom-alert-three {
      padding: 8px;
      border-top: 1px solid #CCC;
      border-right: 1px solid #CCC;
      border-bottom: 1px solid #CCC;
      border-left: 5px solid #f0ad4e;
      border-radius: 3px;
    }

    .td-data {
      border-bottom: 1px solid #CCC;
      padding: 0px 0px 0px 8px;
    }
  </style>
</head>

<body>
  <input type="hidden" id="RolId" value="<?php echo (!empty($_SESSION["ses_RolesId"])) ? $_SESSION["ses_RolesId"] : ""; ?>" readonly>
  <input type="hidden" id="UsrLogin" value="<?php echo (!empty($_SESSION["ses_Login"])) ? $_SESSION["ses_Login"] : ""; ?>" readonly>
  <input type="hidden" id="NumOrg" value="<?php echo (!empty($_SESSION["ses_NumOrg"])) ? $_SESSION["ses_NumOrg"] : ""; ?>" readonly>
  <input type="hidden" value="" id="fechaPagoHide">

  <div class="alert alert-info" style="font-weight: 500;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0405 - RECIBOS DE PAGO</div>

  <div>
    <!-- MENÚ DE OPCIONES EN TABS -->
    <div class="container-fluid">
      <ul class="nav nav-tabs" id="nav-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="btnCliente" data-bs-toggle="tab" data-bs-target="#dvClientes" type="button" role="tab" aria-controls="dvClientes" aria-selected="true">
            <i class="fa-solid fa-user-tie"></i>&nbsp;Cliente
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="btnAbonos" data-bs-toggle="tab" data-bs-target="#dvAbonos" type="button" role="tab" aria-controls="dvAbonos" aria-selected="false">
            <i class="fa-solid fa-cash-register"></i>&nbsp;Abonos
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="btnFacturas" data-bs-toggle="tab" data-bs-target="#dvFacturas" type="button" role="tab" aria-controls="dvFacturas" aria-selected="false">
            <i class="fa-solid fa-file-invoice"></i>&nbsp;Facturas
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="btnMulticash" data-bs-toggle="tab" data-bs-target="#dvMulticash" type="button" role="tab" aria-controls="dvMulticash" aria-selected="false">
            <i class="fa-solid fa-sack-dollar"></i>&nbsp;Multicash
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="btnPlanilla" data-bs-toggle="tab" data-bs-target="#dvPlanilla" type="button" role="tab" aria-controls="dvPlanilla" aria-selected="false">
            <i class="fa-solid fa-clipboard-list"></i>&nbsp;Planilla
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="btnInformes" data-bs-toggle="tab" data-bs-target="#dvInformes" type="button" role="tab" aria-controls="dvInformes" aria-selected="false">
            <i class="fa-solid fa-chart-simple"></i>&nbsp;Informes
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="btnLiquidador" data-bs-toggle="tab" data-bs-target="#dvLiquidador" type="button" role="tab" aria-controls="dvLiquidador" aria-selected="false">
            <i class="fa-solid fa-calculator"></i>&nbsp;Liquidador
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="btnBancos" data-bs-toggle="tab" data-bs-target="#dvBancos" type="button" role="tab" aria-controls="dvBancos" aria-selected="false">
            <i class="fa-solid fa-building-columns"></i>&nbsp;Bancos
          </button>
        </li>
        <li class="nav-item dropdown" role="presentation">
          <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">
            <i class="fa-solid fa-plane-up"></i>
            &nbsp;Ir a</a>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item size-a" id="0401" data-bs-toggle="tab" href="#dvRecuperar" role="tab" aria-controls="dvRecuperar" aria-selected="false">
                <i class="fa-solid fa-chevron-right"></i>
                &nbsp;0401 - CRM
              </a>
            </li>
            <li>
              <a class="dropdown-item size-a" id="0102" data-bs-toggle="tab" href="#dvRecuperarTerceros" role="tab" aria-controls="dvRecuperarTerceros" aria-selected="false">
                <i class="fa-solid fa-chevron-right"></i>
                &nbsp;0102 - Programación de clientes</a>
            </li>
          </ul>
        </li>
        <li class="nav-item" style="flex: 1;">

        </li>
        <li class="nav-item align-self-center" role="presentation">
          <div class="d-flex gap-2">
            <button class="btn btn-success btn-sm w-btn" id="btnContinuar" onClick="Guardar();" title="Preliminar"><i class="fa-solid fa-floppy-disk"></i></button>
            <button class="btn btn-primary btn-sm w-btn" id="btnLimpiar" onClick="Limpiar();" title="Nuevo RC"><i class="fa-solid fa-arrows-rotate"></i></button>
            <button class="btn btn-light btn-sm btn-micro w-btn text-primary" id="btnEmailZona" title="Email Zonas"><i class="fa-solid fa-gear"></i></button>
            <button class="btn btn-danger btn-sm w-btn" id="btnCondicionDcto" title="Condiciones cliente"><i class="fa-solid fa-piggy-bank"></i></button>
          </div>
        </li>
      </ul>
    </div>
    <!-- CONTENIDO DE CADA TAB -->
    <div class="tab-content" id="nav-tabContent">
      <!-- TAB CLIENTE -->
      <div class="tab-pane fade show active p-2" id="dvClientes" role="tabpanel" aria-labelledby="nav-home-tab">
        <div class="div-container" style="min-height: 100vh; overflow: auto;">
          <table style="width: 100%;">
            <thead>
              <tr class="custom-tr">
                <th class="custom-thead" colspan="4" align="center">SELECCION DE CLIENTES</th>
              </tr>
            </thead>
            <tbody>
              <tr class="custom-tr">
                <td class="size-text">Fecha Documento</td>
                <td><input type="text" class="form-control shadow-sm size-td" id="FechaDocumento"></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Cliente</td>
                <td><input type="text" class="form-control shadow-sm size-td" id="Cliente" size="60"></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Desactiva Descuentos</td>
                <td style="float: left;">
                  <div class="material-switch">
                    <input id="ActivaDcto" name="" type="checkbox" />
                    <label for="ActivaDcto" class="label-success"></label>
                  </div>
                </td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Codigo SAP</td>
                <td><input type="text" class="form-control shadow-sm size-td" id="CodigoSAP" readonly disabled></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Sociedad / Oficina</td>
                <td>
                  <div class="row">
                    <div class="col-md-3">
                      <input type="text" class="form-control shadow-sm size-td" id="Sociedad" value="<?= $sociedad ?>" readonly disabled>
                    </div>
                    <div class="col-md-9">
                      <input type="text" class="form-control shadow-sm size-td" id="Oficina" readonly disabled>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Grupo Cliente</td>
                <td>
                  <div class="row">
                    <div class="col-md-3">
                      <input class="form-control shadow-sm size-td" id="Grupo" type="text" readonly disabled>
                    </div>
                    <div class="col-md-9">
                      <input class="form-control shadow-sm size-td" id="DescGrupo" type="text" readonly disabled>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Lista</td>
                <td><input type="text" class="form-control shadow-sm size-td" id="Lista" readonly disabled></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Email</td>
                <td><input type="text" class="form-control shadow-sm size-td" id="Email" readonly disabled></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Email Zona</td>
                <td><input type="text" class="form-control shadow-sm size-td" id="EmailZona" readonly disabled></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Referencia</td>
                <td><textarea maxlength="25" rows="2" class="form-control shadow-sm size-td" style="background-color: #FFC;" id="Referencia" onKeyPress="return vletras_numeros(event)" placeholder="Solo letras y numeros, maximo 25 caracteres"></textarea></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Texto Cabecera</td>
                <td><textarea maxlength="25" rows="2" class="form-control shadow-sm size-td" style="background-color: #FFC;" id="TextoCabecera" onKeyPress="return vletras_numeros(event)" placeholder="Solo letras y numeros, maximo 25 caracteres"></textarea></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Texto Compensación</td>
                <td><textarea maxlength="25" rows="2" class="form-control shadow-sm size-td" style="background-color: #FFC;" id="TextoCompensacion" onKeyPress="return vletras_numeros(event)" placeholder="Solo letras y numeros, maximo 25 caracteres"></textarea></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- TAB ABONOS -->
      <div class="tab-pane fade p-2" id="dvAbonos" role="tabpanel" aria-labelledby="nav-profile-tab">
        <div class="div-container mb-3">
          <table style="width: 100%;" id="TablaAbonos">
            <tr class="custom-tr">
              <td class="size-text">Cuenta</td>
              <td><select id="Cuenta" class="form-control size-td shadow-sm"></select></td>
            </tr>
            <tr class="custom-tr">
              <td class="size-text">Tipo Valor</td>
              <td><select id="TipoValor" class="form-control size-td shadow-sm">
                  <option value="P">POSITIVO (+)</option>
                  <option value="N">NEGATIVO (-)</option>
                </select></td>
            </tr>
            <tr class="custom-tr">
              <td class="size-text">Valor</td>
              <td><input type="text" id="ValorAbono" class="form-control ClassNumero size-td shadow-sm" onKeyPress="return vnumeros(event)" onKeyUp="Enter(event,'AddAbono')"></td>
            </tr>
            <tr class="custom-tr">
              <td class="size-text">Fecha Valor</td>
              <td><input type="text" id="FechaValor" class="form-control size-td shadow-sm" onKeyUp="Enter(event,'AddAbono')"></td>
            </tr>
          </table>
        </div>
        <div id="DetalleAbonos">
          <table class="table table-bordered table-hover table-sm" style="width: 100%;">
            <thead class="table-info">
              <tr>
                <th class="size-th">CUENTA</th>
                <th class="size-th">DESCRIPCIÓN</th>
                <th class="size-th">VALOR</th>
                <th class="size-th">FECHA VALOR</th>
                <th class="size-th">REFERENCIA</th>
                <th class="size-th text-center">ELIMINAR</th>
              </tr>
            </thead>
            <tbody id="tdBody">

            </tbody>
          </table>
        </div>
      </div>
      <!-- TAB FACTURAS -->
      <div class="tab-pane fade p-2" id="dvFacturas" role="tabpanel" aria-labelledby="nav-profile-tab">
        <div class="contenedor-val-todas">
          <div class="contenedor-valores">
            <p class="p-valores">Valor Total: <span class="fw-bold text-primary" id="valorTotal">$0</span></p>
            <p class="p-valores">Partidas: <span class="fw-bold text-primary" id="partidas">0</span></p>
            <p class="p-valores">Valor Mora: <span class="fw-bold text-primary" id="valorMora">$0</span></p>
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <button class="btn btn-primary btn-sm" id="btnSeleccionarTodas">Seleccionar todas</button>
          </div>
        </div>
        <hr class="margin-hr">
        <div class="overflow mt-2" id="dvResultCartera" style="height: 70vh;"></div>
      </div>
      <!-- TAB MULTICASH -->
      <div class="tab-pane fade" id="dvMulticash" role="tabpanel">
        <div class="container-fluid mt-2">
          <div class="row">
            <div class="col-md-6">
              <input type="text" placeholder="Filtro de búsqueda" class="form-control shadow-sm size-td" id="filtro" name="filtro">
            </div>
            <div class="col-md-1">
              <select id="MultiDay" class="form-control shadow-sm">
              </select>
            </div>
            <div class="col-md-2">
              <select id="MultiMes" class="form-control shadow-sm">
              </select>
            </div>
            <div class="col-md-1">
              <select id="MultiAnio" class="form-control shadow-sm">
              </select>
            </div>
            <div class="col-md-2">
              <div class="input-group flex-nowrap">
                <input type="text" class="form-control shadow-sm" id="txtValidaDocumento" placeholder="Validar Multicash" onKeyPress="return vnumeros(event)" aria-label="Username" aria-describedby="addon-wrapping">
                <span class="input-group-text shadow-sm" id="addon-wrapping"><i class="fa-solid fa-magnifying-glass"></i></span>
              </div>
            </div>
          </div>
          <hr>
          <div id="dvResultMulticash" style="overflow: auto; height: 100vh;">
            <table class="table table-bordered table-hover table-sm" style="width: 100%;" id="tdPlanillas">
              <thead class="table-info">
                <tr>
                  <th class="size-th">CUENTA</th>
                  <th class="size-th">DESCRIPCION</th>
                  <th class="size-th">NUMERO</th>
                  <th class="size-th">VALOR</th>
                  <th class="size-th">TEXTO</th>
                  <th class="size-th">FECHA CONT.</th>
                  <th class="size-th">FECHA VALOR.</th>
                  <th class="size-th">ESTADO</th>
                  <th class="size-th">REFERENCIA</th>
                  <th class="size-th">ID</th>
                </tr>
              </thead>
              <tbody id="tdDetalleMulticash">

              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- TAB PLANILLAS -->
      <div class="tab-pane fade" id="dvPlanilla" role="tabpanel">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-3 align-self-end">
              <label class="size-text" for="FiltroPlanilla">Filtrado</label>
              <input type="text" id="FiltroPlanilla" placeholder="Filtro de búsqueda RC" class="form-control form-control-sm shadow-sm" size="25">
            </div>
            <div class="col-md-2">
              <label class="size-text" for="RptFhIni">Fecha Inicial</label>
              <input type="text" id="RptFhIni" class="form-control form-control-sm shadow-sm" size="12" readonly>
            </div>
            <div class="col-md-2">
              <label class="size-text" for="RptFhFin">Fecha Final</label>
              <input type="text" id="RptFhFin" class="form-control form-control-sm shadow-sm" size="12" readonly>
            </div>
            <div class="col-md-1">
              <label class="size-text" for="TotalRC">Total RC</label>
              <input type="text" id="TotalRC" class="form-control form-control-sm shadow-sm" size="8" readonly>
            </div>
            <div class="col-md-2 align-self-end">
              <div class="d-flex gap-3 justify-content-around align-items-center">
                <button class="btn btn-success shadow-sm btn-sm w-btn" type="button" onClick="filtroEstado('A')"><i class="fa-solid fa-thumbs-up"></i></button>
                <button class="btn btn-danger shadow-sm btn-sm w-btn" type="button" onClick="filtroEstado('S')"><i class="fa-solid fa-thumbs-down"></i></button>
                <button class="btn btn-light btn-micro text-primary shadow-sm btn-sm w-btn" type="button" onClick="filtroEstado('T')"><i class="fa-solid fa-hand-point-right"></i></button>
              </div>
            </div>
            <div class="col-md-2 align-self-end">
              <button class="btn btn-light btn-micro w-100 text-primary shadow-sm btn-sm" id="btnCompensaciones">
                <i class="fa-solid fa-hand-holding-dollar"></i>
                Compensaciones
              </button>
            </div>
          </div>
        </div>
        <div class="mt-2" id="dvResultPlanilla" style="overflow: auto; height: 70vh;"></div>
      </div>
      <!-- TAB INFORMES -->
      <div class="tab-pane fade p-2" id="dvInformes" role="tabpanel">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-5">
              <label class="size-text" for="InfoFhIni">Fecha Inicial</label>
              <div class="input-group">
                <span class="input-group-text" id="visible-addon"><i class="fa-solid fa-calendar-days"></i></span>
                <input type="text" class="form-control form-control-sm shadow-sm" id="InfoFhIni" aria-label="Username" aria-describedby="visible-addon" readonly>
              </div>
            </div>
            <div class="col-md-5">
              <label class="size-text" for="InfoFhFin">Fecha Final</label>
              <div class="input-group">
                <span class="input-group-text" id="visible-addon"><i class="fa-solid fa-calendar-days"></i></span>
                <input type="text" class="form-control form-control-sm shadow-sm" id="InfoFhFin" aria-label="Username" aria-describedby="visible-addon" readonly>
              </div>
            </div>
            <div class="col-md-2 align-self-end">
              <button type="button" class="btn btn-success btn-sm w-100 shadow-sm" onclick="ConsultarInformes();">
                <i class="fa-solid fa-search"></i>
                Consultar
              </button>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-md-6 align-self-center">
              <div id="dvResultConsolidado"></div>
            </div>
            <div class="col-md-6">
              <figure class="highcharts-figure">
                <div id="DivGrafico"></div>
                <p class="highcharts-description"></p>
              </figure>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-md-12">
              <div id="dvResultInformes"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- TAB LIQUIDADOR -->
      <div class="tab-pane fade pt-3" id="dvLiquidador" role="tabpanel">
        <img id="logoEmpresa" src="../resources/images/LogoRoma.png" style="display: none;" />
        <img id="logoEmpresa2" src="../resources/images/LogoCM.png" style="display: none;" />
        <div style="overflow: auto; height: 67vh;" id="contenedorTablasLiquidador">

        </div>
      </div>
      <!-- TAB BANCOS -->
      <div class="tab-pane fade p-2" id="dvBancos" role="tabpanel">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-4">
              <input type="text" placeholder="Filtro de búsqueda" class="form-control shadow-sm" id="filtro2" name="filtro2">
            </div>
            <div class="col-md-2">
              <select id="MultiDay2" class="form-select shadow-sm">

              </select>
            </div>
            <div class="col-md-2">
              <select id="MultiMes2" class="form-select shadow-sm">

              </select>
            </div>
            <div class="col-md-2">
              <select id="MultiAnio2" class="form-select shadow-sm">

              </select>
            </div>
            <div class="col-md-2">
              <p class="cantBan shadow-sm">
                Cantidad:
                <span class="text-primary" id="cantBancos"></span>
              </p>
            </div>
          </div>
          <div class="mt-2" id="dvResultMulticash2" style="overflow: auto; max-height: 70vh;">
            <table class="table table-bordered table-hover table-sm" style="width: 100%;" id="tdPlanillas2">
              <thead class="table-info">
                <tr>
                  <th class="size-th no-wrap">N°</th>
                  <th class="size-th no-wrap">CUENTA</th>
                  <th class="size-th no-wrap">CLAVE REF.</th>
                  <th class="size-th no-wrap">N° DOC.</th>
                  <th class="size-th no-wrap">VALOR</th>
                  <th class="size-th no-wrap">FECHA DOC.</th>
                  <th class="size-th no-wrap">REFERENCIA</th>
                  <th class="size-th no-wrap">SAP</th>
                  <th class="size-th no-wrap">CLIENTE</th>
                  <th class="size-th no-wrap">OFICINA</th>
                  <th class="size-th no-wrap">ZONA</th>
                  <th class="size-th no-wrap">NOMBRE</th>
                  <th class="size-th no-wrap">CONDICIÓN</th>
                  <th class="size-th no-wrap">OBSER.</th>
                </tr>
              </thead>
              <tbody id="tdDetalleMulticash2">

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- DIV FIXED CON LOS CAMPOS PARA VER LOS ABONADOS -->
  <div class="container-fluid container-fixed">
    <div class="row">
      <div class="col-md-4">
        <label for="VlrTotalAbono" class="size-text text-green fw-500">Total Abonado:</label>
        <input type="text" id="VlrTotalAbono" class="form-control shadow-sm mb-1" size="10" readonly>
      </div>
      <div class="col-md-4">
        <label for="VlrTotalFacturas" class="size-text text-green fw-500">Total Facturas:</label>
        <input type="text" id="VlrTotalFacturas" class="form-control shadow-sm mb-1" size="10" readonly>
      </div>
      <div class="col-md-4">
        <label for="VlrSinAsignar" class="size-text text-green fw-500">Sin Asignar:</label>
        <input type="text" id="VlrSinAsignar" class="form-control shadow-sm mb-1" size="10" readonly>
      </div>
    </div>
  </div>
  <!-- FIN CONTENIDO PRINCIPAL -->

  <!-- DIV'S PARA RENDERIZAR EL LOADING -->
  <div id="Bloquear" style="display: none;"></div>
  <div id="loaderOverlayRecibo" class="" style="display: none;"></div>

  <!-- MODAL VER PDF -->
  <div class="modal fade" id="ModalPDF" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 60%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="ModalPDFTittle"></h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="ContenidoPDF">

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" onClick="EliminarPDF()" id="btnEliminarPDF">Eliminar</button>
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL HIPERVINCULO -->
  <div class="modal fade" id="ModalHipervinculo" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 100%; height: 100vh; margin: 0;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="span-titulo-modulo"></h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row row_iframe">
            <div class="col-md-12 col-iframe-left">
              <iframe class="iframe" src="" style="display: none; font-size: 1rem"></iframe>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL CONDICIONES DEL CLIENTE -->
  <div class="modal fade" id="dvCondiciones" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 70%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">CONDICIONES DE DESCUENTO</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="custom-alert-one mb-4">
            <h5 style="color: #5bc0de;">Condiciones propias del cliente</h5>
            <p class="m-0">Estan asociadas al cliente especificamente y pueden depender o no del cumplimiento del presupuesto</p>
          </div>
          <div class="mb-4" id="dvCondicionesDetalle">

          </div>
          <div class="custom-alert-two mb-4">
            <h5 style="color: #5cb85c;">Condiciones por lista de precio </h5>
            <p class="m-0">Estan asociadas a la lista de precio del cliente y para ser aplicadas dependen del plazo de pago especial</p>
          </div>
          <div class="mb-4" id="dvCondicionesDetalleListaPlazo">

          </div>
          <div class="custom-alert-three mb-4">
            <h5 style="color: #f0ad4e;">Condiciones por lista de precio sujetos a cumplimiento de presupuesto de ventas</h5>
            <p class="m-0">Estan asociadas a la lista de precio del cliente y para ser aplicadas dependen del cumplimiento del presupuesto de ventas correspondiente al periodo del documento</p>
          </div>
          <div id="dvCondicionesDetalleLista">

          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL SELECCIÓN DE ABONO -->
  <div class="modal fade" id="dvSclAbono" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 60%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">SELECCIÓN DE ABONO</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div id="dvSclAbonoDetalle"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL COMPENSACIONES -->
  <div class="modal fade" id="modalCompensaciones" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 60%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">COMPENSACIÓN DE PARTIDAS</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h5>Compensación de Documentos</h5>
          <div class="alert alert-warning">
            <i class="fa-solid fa-circle-info"></i>
            <span>La compensación de documentos, desactiva del multichash las partidas de banco por aprovechamiento.</span>
          </div>
          <table style="width: 100%;">
            <tbody>
              <tr class="custom-tr">
                <td>Fecha Inicial</td>
                <td><input type="text" class="form form-control size-text shadow-sm" id="fhCompenIni"></td>
              </tr>
              <tr class="custom-tr">
                <td>Fecha Final</td>
                <td><input type="text" class="form form-control size-text shadow-sm" id="fhCompenFin"></td>
              </tr>
              <tr class="custom-tr">
                <td>Número de documento (Opcional)</td>
                <td><input type="text" class="form form-control size-text shadow-sm" id="idCompenDoc" onKeyPress="return vnumeros(event)"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" id="btnCompensar">Compensar</button>
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL PDF RECIBO -->
  <div class="modal fade" id="dvPDFRecibo" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 60%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">PDF RECIBO</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div id="dvReciboCajaPDF"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL SUBIR CASH -->
  <div class="modal fade" id="dvSubirCash" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 60%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">SUBIR PLANILLA DE MULTICASH</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <table width="100%" class="form">
            <tbody>
              <tr>
                <td>CSV [Cuenta, Documento, Importe, Texto, Fecha cont, Fecha valor, Referencia]</td>
                <td><input type="file" id="filename" name="filename" class="form-control" readonly></td>
              </tr>
            </tbody>
          </table>
          <div id="tr_det_cash"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" onClick="SubirCash()">Subir</button>
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL EMAIL ZONAS -->
  <div class="modal fade" id="dvEmailZonas" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 70%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">CONFIGURACIÓN</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <ul class="nav nav-tabs" id="nav-tab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#dvCorreos" type="button" role="tab" aria-controls="dvCorreos" aria-selected="true">&nbsp;Correos</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" onClick="ConsultarCondicionEspecial();" data-bs-toggle="tab" data-bs-target="#dvCondicionesEspeciales" type="button" role="tab" aria-controls="dvCondicionesEspeciales" aria-selected="false">&nbsp;Condiciones Especiales</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" onClick="ConsultarCondicionLista();" data-bs-toggle="tab" data-bs-target="#dvCondicionesListas" type="button" role="tab" aria-controls="dvFacturas" aria-selected="false">&nbsp;Condiciones Listas</button>
              </li>
            </ul>
          </div>
          <div class="tab-content" id="nav-tabContent">
            <!-- TAB DIV CORREOS -->
            <div class="tab-pane fade show active p-2" id="dvCorreos" role="tabpanel" aria-labelledby="nav-home-tab">
              <table width="100%">
                <tr class="custom-tr">
                  <td class="size-text">ZONA</td>
                  <td><select id="slcZonaEmail" class="form-select size-text shadow-sm"></select></td>
                <tr>
                <tr class="custom-tr">
                  <td class="size-text">EMAIL</td>
                  <td><input type="text" id="txtZonaEmail" class="form-control size-text shadow-sm"></td>
                <tr>
              </table>
              <div class="d-flex justify-content-end mb-3">
                <button type="button" class="btn btn-sm btn-success" onClick="AddZonaEmail()">Agregar</button>
              </div>
              <div id="dvResultZonasEmail"></div>
            </div>
            <!-- TAB DIV CONDICIONES ESPECIALES -->
            <div class="tab-pane fade p-2" id="dvCondicionesEspeciales" role="tabpanel" aria-labelledby="nav-home-tab">
              <div class="alert alert-warning" role="alert">
                <i class="fa-solid fa-circle-info"></i>
                Tener en cuenta que al autorizar las condiciones solicitadas se eliminaran las que se encuentran vigentes en ADG.
              </div>
              <table width="100%">
                <tr class="custom-tr">
                  <td class="size-text">Cliente</td>
                  <td><input type="text" id="txt_CondCliente" class="form-control shadow-sm size-text"></td>
                  <td><input type="text" id="txt_CondCodigo" class="form-control shadow-sm size-text" placeholder="Codigo SAP" readonly disabled></td>
                </tr>
                <tr class="custom-tr">
                  <td class="size-text">Sujeto Cumplimiento</td>
                  <td colspan="2">
                    <select id="txtSujetoCumplimiento" class="form-select shadow-sm size-text">
                      <option value="S">SI</option>
                      <option value="N">NO</option>
                    </select>
                  </td>
                </tr>
                <tr class="custom-tr">
                  <td class="size-text">Días Pago</td>
                  <td colspan="2"><input type="text" id="txt_CondDias" onKeyPress="return vnumeros(event)" class="form-control shadow-sm size-text"></td>
                </tr>
                <tr class="custom-tr">
                  <td class="size-text">Descuento %</td>
                  <td colspan="2"><input type="text" id="txt_CondDcto" onKeyPress="return vnumeros(event)" class="form-control shadow-sm size-text"></td>
                </tr>
              </table>
              <div class="d-flex gap-2 justify-content-end mb-3">
                <button type="button" class="btn btn-sm btn-success" onClick="AgregarCondicionEspecial()">Agregar</button>
                <button type="button" class="btn btn-sm btn-primary" onClick="AutorizarTodoCondicion()">Autorizar Todo</button>
              </div>
              <div id="dvResultCondicionesEspeciales"></div>
            </div>
            <!-- TAB DIV CONDICIONES LISTAS -->
            <div class="tab-pane fade p-2" id="dvCondicionesListas" role="tabpanel" aria-labelledby="nav-home-tab">
              <div class="alert alert-warning" role="alert">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span class="sr-only"></span> <b>PLAN ESPECIAL DE CLIENTES DE TIPO DROGUERIA Y QUE CUMPLAN PRESUPUESTO DE VENTAS</b>
              </div>
              <div id="dvResultCondicionesEspecialesListas"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL DIV RECIBO DE CAJA -->
  <div class="modal fade" id="dvReciboCaja" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 95%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">RECIBO DE CAJA</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container-fluid d-flex justify-content-between align-items-center mb-3">
            <div style="flex: 1;">
              <button class="btn btn-primary btn-sm w-50" type="button" data-bs-toggle="collapse" data-bs-target="#BodyCliente" aria-expanded="false" aria-controls="BodyCliente">
                DATOS DEL CLIENTE
              </button>
            </div>
            <div>
              <div class="btn-group" id="btnAutorizar">
                <button type="button" class="btn btn-success btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fa-solid fa-check"></i> Autorizar
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" onClick="AutorizarRC(1)" style="cursor: pointer">Versión 1</a></li>
                  <li><a class="dropdown-item" onClick="AutorizarRC(2)" style="cursor: pointer">Versión 2</a></li>
                </ul>
              </div>
              <button type="button" class="btn btn-danger btn-sm" id="btnEliminarRC" onClick="EliminarRC()">
                <i class="fa-solid fa-trash-can"></i> Eliminar
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">
                <i class="fa-solid fa-xmark"></i> Cerrar
              </button>
            </div>
          </div>
          <div class="container-fluid">
            <div class="row mb-5">
              <div class="col-md-12">
                <div class="collapse show" id="BodyCliente">
                  <div class="card p-3 shadow-sm">
                    <div class="row">
                      <div class="col-md-6">
                        <table width="100%">
                          <tbody>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary" width="30%"><b>ID</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-text text-green fw-500" id="txt_id_rc"></p>
                              </td>
                            </tr>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary"><b>NÚMERO</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-text text-green fw-500" id="txt_num"></p>
                              </td>
                            </tr>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary"><b>CÓDIGO</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-text text-green fw-500" id="txt_codigo"></p>
                              </td>
                            </tr>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary"><b>CLIENTE</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-td text-green fw-500" id="txt_cliente"></p>
                              </td>
                            </tr>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary"><b>RAZÓN</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-td text-green fw-500" id="txt_razon"></p>
                              </td>
                            </tr>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary"><b>EMAIL</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-text text-green fw-500" id="txt_mail"></p>
                              </td>
                            </tr>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary"><b>EMAIL ZONA</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-text text-green fw-500" id="txt_mail_zona"></p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="col-md-6">
                        <table width="100%">
                          <tbody>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary" width="30%"><b>VALOR</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-text text-green fw-500" id="txt_valor"></p>
                              </td>
                            </tr>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary"><b>TEXTO CABECERA</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-text text-green fw-500" id="txt_cabecera"></p>
                              </td>
                            </tr>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary"><b>TEXTO COMPENSACION</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-text text-green fw-500" id="txt_compesacion"></p>
                              </td>
                            </tr>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary"><b>TEXTO REFERENCIA</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-text text-green fw-500" id="txt_referencia"></p>
                              </td>
                            </tr>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary"><b>FECHA APROBACIÓN</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-text text-green fw-500" id="txt_fh_aprueba"></p>
                              </td>
                            </tr>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary"><b>USUARIO APROBACIÓN</b></td>
                              <td class="custom-td">
                                <p class="cantBan2 size-text text-green fw-500" id="txt_user_aprueba"></p>
                              </td>
                            </tr>
                            <tr class="custom-tr">
                              <td class="size-td text-secondary"><b>ARCHIVO</b></td>
                              <td class="size-text" id="tdDocPDF"><input type="file" id="DocPDF" name="DocPDF" class="form-control" accept="application/pdf"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card p-3 shadow-sm">
              <div class="row">
                <div class="col-md-6" id="panel_2">
                  <div class="">
                    <h6 class="bg-info text-green p-2">DETALLE DE PAGO</h6>
                    <div class="overflow" id="tr_det">

                    </div>
                  </div>
                </div>
                <div class="col-md-6" id="panel_3">
                  <div class="panel panel-info">
                    <h6 class="bg-info text-green p-2">DOCUMENTO</h6>
                    <div id="ContainerPDF">

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- SCRIPT'S PARA DINAMISMO DE LA PÁGINA -->
  <script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/SweetAlert2_V10/dist/sweetalert2.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
  <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/jquery.keyz.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/MaskMoney/jquery.maskMoney.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../resources/HighCharts/code/highcharts.js?1991462313"></script>
  <script type="text/javascript" src="../controllers/RecibosCaja.js?<?php echo (rand()); ?>"></script>
</body>

</html>