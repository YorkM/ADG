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
  <title>C.R.M</title>
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

    .title-card {
      background-color: #cff4fc;
      border: 1px solid #9eeaf9;
      padding: 5px;
      color: #055160;
      font-weight: 400;
      font-size: 14px;
      margin-bottom: 0;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

    .border-card {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: 1px solid #9eeaf9;
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

    .bold-span {
      font-weight: bold;
      color: #055160;
      text-transform: uppercase;
      font-size: 11px;
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

    .bag-disabled {
      background-color: #e9ecef !important;
      font-weight: 500;
    }

    .text-green {
      color: #055160;
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

    .timeline-container {
      width: 80%;
      max-width: 800px;
      position: relative;
    }

    .timeline::before {
      content: "";
      position: absolute;
      left: 50%;
      width: 4px;
      background: linear-gradient(to bottom, #6a11cb, #2575fc);
      height: 100%;
      top: 0;
      transform: translateX(-50%);
      border-radius: 2px;
    }

    .timeline-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 40px;
      position: relative;
    }

    .timeline-item[data-position="right"] {
      justify-content: flex-end;
    }

    .timeline-avatar {
      width: 40px;
      height: 40px;
      background: #007bff;
      color: white;
      font-weight: bold;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      border: 4px solid white;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      font-family: 'Poppins', sans-serif;
    }

    .timeline-item[data-position="right"] .timeline-avatar {
      left: auto;
      right: 50%;
      transform: translate(50%, 0);
    }

    .timeline-content {
      width: 46%;
      position: relative;
    }

    .estilos1 {
      width: 100%;
      margin: 0 auto;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      padding: 5px 10px;
      background-color: white;
      border-radius: 10px;
    }

    .p1 {
      margin: 0;
      padding: 0;
      font-weight: bold;
      font-size: 10px;
      margin-bottom: 3px;
      color: #453e3e;
    }

    .p2 {
      margin: 0;
      padding: 0;
      font-size: 10px;
      color: #9f9999;
    }
  </style>
</head>

<body>
  <div id="tituloModuloCRM" class="alert alert-info" style="font-weight: 500;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0401 - CRM</div>

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
        <button class="nav-link active" id="btnCliente" data-bs-toggle="tab" data-bs-target="#dvClientes" type="button" role="tab" aria-controls="dvClientes" aria-selected="true">
          <i class="fa-solid fa-user-tie"></i>&nbsp;
          <span class="btn-text">Cliente</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="btnDireccion" data-bs-toggle="tab" data-bs-target="#dvDirecciones" type="button" role="tab" aria-controls="dvDirecciones" aria-selected="false">
          <i class="fa-solid fa-location-dot"></i>&nbsp;
          <span class="btn-text">Dirección</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="btnCartera" data-bs-toggle="tab" data-bs-target="#dvCartera" type="button" role="tab" aria-controls="dvCartera" aria-selected="false">
          <i class="fa-solid fa-sack-dollar"></i>&nbsp;
          <span class="btn-text">Cartera</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="btnProductos" data-bs-toggle="tab" data-bs-target="#dvProductos" type="button" role="tab" aria-controls="dvProductos" aria-selected="false">
          <i class="fa-solid fa-pills"></i>&nbsp;
          <span class="btn-text">Productos</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="btnAcuerdos" data-bs-toggle="tab" data-bs-target="#dvAcuerdosCom" type="button" role="tab" aria-controls="dvAcuerdosCom" aria-selected="false">
          <i class="fa-solid fa-handshake"></i></i>&nbsp;
          <span class="btn-text">Acuerdo Comercial</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="btnRotacion" data-bs-toggle="tab" data-bs-target="#dvRotacion" type="button" role="tab" aria-controls="dvRotacion" aria-selected="false">
          <i class="fa-solid fa-rotate"></i></i>&nbsp;
          <span class="btn-text">Rotación</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="btnJuridica" data-bs-toggle="tab" data-bs-target="#dvJuridica" type="button" role="tab" aria-controls="dvJuridica" aria-selected="false">
          <i class="fa-solid fa-gavel"></i>&nbsp;
          <span class="btn-text">Procesos Jurídicos</span>
        </button>
      </li>
      <li class="nav-item dropdown" role="presentation">
        <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">
          <i class="fa-solid fa-plane"></i>&nbsp;
          <span class="btn-text">Ir a</span>
        </a>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item size-a" id="0405" data-bs-toggle="tab" data-bs-target="#dvClientes" aria-controls="dvClientes" aria-selected="false" href="#" role="tab">
              <i class="fa-solid fa-chevron-right"></i>
              &nbsp;0405 - Recibos de pago
            </a>
          </li>
          <li>
            <a class="dropdown-item size-a" id="0102" data-bs-toggle="tab" data-bs-target="#dvClientes" aria-controls="dvClientes" aria-selected="false" href="#" role="tab">
              <i class="fa-solid fa-chevron-right"></i>&nbsp;0102 - Programación de clientes
            </a>
          </li>
        </ul>
      </li>
    </ul>
    <!-- CONTENIDO DE CADA TAB -->
    <div class="tab-content pt-2" id="nav-tabContent">
      <!-- TAB CLIENTE -->
      <div class="tab-pane fade show active p-2" id="dvClientes" role="tabpanel" aria-labelledby="nav-home-tab">
        <div class="row">
          <div class="col-lg-6">
            <h6 class="title-card">GENERALES</h6>
            <div class="card p-2 border-card shadow-sm mb-4">
              <div class="mb-3" id="div-busqueda">
                <input type="text" id="txtCliente" placeholder="Buscar cliente..." class="form-control form-control-sm shadow-sm size-13" size="60">
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bold-span size-13">Nombres:</span>
                <input type="text" id="txtNombres" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="60" readonly disabled>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Creado el:</span>
                    <input type="text" id="txtCreado" size="10" class="form-control form-control-sm shadow-sm size-13 bag-disabled" readonly disabled>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Fecha Nacimiento:</span>
                    <input type="text" id="txtFhNacimiento" size="10" class="form-control form-control-sm shadow-sm size-13 bag-disabled" readonly disabled>
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Sexo:</span>
                    <select id="txtSexo" class="form-select form-select-sm shadow-sm size-13">
                      <option value="O">OTRO/NA</option>
                      <option value="M">MASCULINO</option>
                      <option value="F">FEMENINO</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Razón:</span>
                    <input type="text" id="txtRazon" placeholder="" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="60" readonly disabled>
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Teléfono 1:</span>
                    <input type="text" id="txtTel1" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="20" readonly disabled>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Teléfono 2:</span>
                    <input type="text" id="txtTel2" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="20" readonly disabled>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Teléfono 3:</span>
                    <input type="text" id="txtTel3" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="20" readonly disabled>
                  </div>
                </div>
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bold-span size-13">Email SAP:</span>
                <input type="text" id="txtMail" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="60" readonly disabled>
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bold-span size-13">Email FE-ADG:</span>
                <input type="text" id="txtMailFE" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="60">
              </div>
              <div class="row">
                <div class="col-md-4">
                  <button class="btn btn-outline-primary btn-sm w-100" onClick="Limpiar();">
                    <i class="fa-solid fa-file"></i> Nuevo
                  </button>
                </div>
                <div class="col-md-4">
                  <button class="btn btn-outline-success btn-sm w-100" onClick="Guardar();">
                    <i class="fa-solid fa-floppy-disk"></i> Guardar
                  </button>
                </div>
                <div class="col-md-4">
                  <button class="btn btn-outline-danger btn-sm w-100" onClick="Sincronizar();">
                    <i class="fa-solid fa-rotate"></i> Sincronizar
                  </button>
                </div>
              </div>
            </div>
            <h6 class="title-card">CONDICIONES DEL TERCERO</h6>
            <div class="card p-2 border-card shadow-sm mb-4">
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Código SAP:</span>
                    <input type="text" id="txtCodigo" size="10" class="form-control form-control-sm shadow-sm size-13 bag-disabled" readonly disabled>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Cupo Crédito:</span>
                    <input type="text" id="txtCupo" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="22" readonly disabled>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Condición de Pago:</span>
                    <input type="text" id="txtCondicion" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="5" readonly disabled>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Lista Precios:</span>
                    <input type="text" id="txtLista" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="5" readonly disabled>
                  </div>
                </div>
              </div>
            </div>
            <h6 class="title-card">GESTIONES REALIZADAS (6 MESES)</h6>
            <div class="card p-2 border-card shadow-sm mb-4">
              <div id="dvGestiones" style="height: 250px; overflow: auto;"></div>
            </div>
            <h6 class="title-card">CARTERA POR EDADES</h6>
            <div class="card p-2 border-card shadow-sm mb-4">
              <div id="dvCarteraxEdades" style="height: 180px; overflow: auto;"></div>
            </div>
          </div>
          <div class="col-lg-6">
            <h6 class="title-card" id="titleDT">DOCUMENTOS DEL TERCERO</h6>
            <div class="card p-2 border-card shadow-sm mb-4" id="docTercero">
              <div class="row">
                <div class="col-md-9">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Pagaré:</span>
                    <input type="file" id="pagarePDF" name="pagarePDF" class="form-control form-control-sm shadow-sm size-13" readonly>
                    <input type="hidden" id="npagarePDF" name="npagarePDF" class="hidden">
                  </div>
                </div>
                <div class="col-md-3">
                  <button class="btn btn-outline-primary btn-sm w-100" id="btnBPagare">
                    <i class="fa-solid fa-eye"></i> VISUALIZAR
                  </button>
                </div>
              </div>
            </div>
            <h6 class="title-card">COMERCIAL</h6>
            <div class="card p-2 border-card shadow-sm mb-4">
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Sector:</span>
                    <input type="text" id="txtSector" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="10" readonly disabled>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Canal:</span>
                    <input type="text" id="txtCanal" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="10" readonly disabled>
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Oficina de Ventas:</span>
                    <input type="text" id="txtOficina" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="10" readonly disabled>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Zona de Ventas:</span>
                    <input type="text" id="txtZonaVenta" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="20" readonly disabled>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Televendedor:</span>
                    <input type="text" id="txtTelevendedor" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="60" readonly disabled>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Vendedor:</span>
                    <input type="text" id="txtVendedor" class="form-control form-control-sm shadow-sm size-13 bag-disabled" size="60" readonly disabled>
                  </div>
                </div>
              </div>
            </div>
            <h6 class="title-card">PERFÍL TRIBUTARIO</h6>
            <div class="card p-2 border-card shadow-sm mb-4">
              <div class="input-group mb-3">
                <span class="input-group-text bold-span size-13">Nit:</span>
                <input type="text" id="txtNit" class="form-control form-control-sm shadow-sm size-13 bag-disabled" title="Nit/Cedula" readonly disabled>
                <input type="text" id="txtDigito" size="2" class="form-control form-control-sm shadow-sm size-13 bag-disabled" title="Digito de verificacion" readonly disabled>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Tipo Nit:</span>
                    <input type="text" id="txtTipoNit" size="2" class="form-control form-control-sm shadow-sm size-13 bag-disabled" title="Tipo de nit" readonly disabled>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Perfíl Tributario:</span>
                    <input type="text" id="txtPerfil" size="2" class="form-control form-control-sm shadow-sm size-13 bag-disabled" title="Perfil tributario" readonly disabled>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-2">
                  <div class="d-flex justify-content-center gap-1">
                    <label class="size-13">Excento IVA:</label>
                    <input type="checkbox" id="chkIVA" disabled>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="d-flex justify-content-center gap-1">
                    <label class="size-13">Excento Cree:</label>
                    <input type="checkbox" id="chkCree" disabled>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="d-flex justify-content-center gap-1">
                    <label class="size-13">Resp. ICA:</label>
                    <input type="checkbox" id="chkICA" disabled>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="d-flex justify-content-center gap-1">
                    <label class="size-13">Gran Contrib:</label>
                    <input type="checkbox" id="chkGranContrib" disabled>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="d-flex justify-content-center gap-1">
                    <label class="size-13">Autoretenedor:</label>
                    <input type="checkbox" id="chkAutoretenedor" disabled>
                  </div>
                </div>
              </div>
            </div>
            <h6 class="title-card">CONTROL DE PRODUCTOS</h6>
            <div class="card p-2 border-card shadow-sm mb-4">
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="d-flex justify-content-between">
                    <label class="size-13">Controlados:</label>
                    <input type="checkbox" id="chkAControlados" disabled>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex justify-content-between">
                    <label class="size-13">Institucionales:</label>
                    <input type="checkbox" id="chkInstitucionales" disabled>
                  </div>
                </div>
              </div>
            </div>
            <h6 class="title-card">UBICACIÓN GEOGRÁFICA</h6>
            <div class="card p-2 border-card shadow-sm">
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Latitud:</span>
                    <input type="text" id="txtLatitud" size="60" class="form-control form-control-sm shadow-sm size-13">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Longitud:</span>
                    <input type="text" id="txtLongitud" size="60" class="form-control form-control-sm shadow-sm size-13">
                  </div>
                </div>
              </div>
              <div id="Mapa"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- TAB DIRECCIONES -->
      <div class="tab-pane fade p-2" id="dvDirecciones" role="tabpanel" aria-labelledby="nav-profile-tab">
        <h6 class="title-card">DIRECCIÓN PRINCIPAL - SAP</h6>
        <div class="card p-2 border-card shadow-sm mb-4">
          <div class="row">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Dirección:</span>
                <input type="text" id="txtDireccion" size="60" class="form-control form-control-sm shadow-sm size-13 bag-disabled" readonly disabled>
              </div>
            </div>
            <div class="col-md-3">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Departamento:</span>
                <input type="text" id="txtDepartamento" class="form-control form-control-sm shadow-sm size-13 bag-disabled" readonly disabled>
              </div>
            </div>
            <div class="col-md-3">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Ciudad:</span>
                <input type="text" id="txtCiudad" class="form-control form-control-sm shadow-sm size-13 bag-disabled" readonly disabled>
              </div>
            </div>
          </div>
        </div>
        <h6 class="title-card">DIRECCIONES ALTERNATIVAS - WEB</h6>
        <div class="card p-2 border-card shadow-sm mb-5">
          <div class="row">
            <div class="col-md-5">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Dirección:</span>
                <input type="tex" id="txtDir_alt" size="60" class="form-control form-control-sm shadow-sm size-13">
              </div>
            </div>
            <div class="col-md-3">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Departamento:</span>
                <select id="slcDtpo" class="form-select form-select-sm shadow-sm size-13"></select>
              </div>
            </div>
            <div class="col-md-3">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Ciudad:</span>
                <select id="slcCiudad" class="form-select form-select-sm shadow-sm size-13"></select>
              </div>
            </div>
            <div class="col-md-1">
              <button class="btn btn-success btn-sm w-100" onClick="GuardarDireccion();">
                <i class="fa-solid fa-plus" style="font-size: 15px; font-weight: bold;"></i>
              </button>
            </div>
          </div>
        </div>
        <div id="dvResultDir" class="table-responsive"></div>
      </div>
      <!-- TAB CARTERA -->
      <div class="tab-pane fade p-2" id="dvCartera" role="tabpanel" aria-labelledby="nav-profile-tab">
        <h6 class="title-card">DOCUMENTOS</h6>
        <div class="card p-2 border-card shadow-sm mb-4">
          <div class="row mb-4">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Año:</span>
                <select id="anio" class="form-select form-select-sm shadow-sm size-13"></select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Tipo Partida:</span>
                <select id="Tipopartidas" class="form-select form-select-sm shadow-sm size-13"></select>
              </div>
            </div>
          </div>
        </div>
        <div id="dvResultCartera" class="table-responsive" style="overflow: auto;"></div>
      </div>
      <!-- TAB PRODUCTOS -->
      <div class="tab-pane fade p-2" id="dvProductos" role="tabpanel">
        <h6 class="title-card">BÚSQUEDA DE PRODUCTOS</h6>
        <div class="card p-2 border-card shadow-sm mb-4">
          <div class="row mb-3">
            <div class="col-md-11">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Código Material:</span>
                <input type="text" id="InpMaterial" class="form-control shadow-sm size-13" placeholder="Escribir producto que desea buscar">
              </div>
            </div>
            <div class="col-md-1">
              <button class="btn btn-outline-primary btn-sm w-100" onClick="LimpiarMateriales();">
                <i class="fa-solid fa-magnifying-glass"></i> Limpiar
              </button>
            </div>
          </div>
        </div>
        <div id="dvResultFact" class="table-responsive" style="overflow: auto;"></div>
      </div>
      <!-- TAB ACUERDO COMERCIAL -->
      <div class="tab-pane fade p-2" id="dvAcuerdosCom" role="tabpanel">
        <h6 class="title-card" id="titleAC">CREAR ACUERDO COMERCIAL</h6>
        <div class="card p-2 border-card shadow-sm mb-3" id="divCreaAcuerdo">
          <div class="row mb-3">
            <div class="col-md-3">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">N° Acuerdo:</span>
                <input type="text" id="numeroAcu" class="form-control form-control-sm shadow-sm size-13">
              </div>
            </div>
            <div class="col-md-2">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Fecha Inicio:</span>
                <input type="text" id="fechaiAcu" class="form-control form-control-sm shadow-sm size-13" readonly>
              </div>
            </div>
            <div class="col-md-2">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Fecha Fin:</span>
                <input type="text" id="fechafAcu" class="form-control form-control-sm shadow-sm size-13" readonly>
              </div>
            </div>
            <div class="col-md-3">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Monto del acuerdo:</span>
                <input type="text" id="montoAcu" class="form-control form-control-sm shadow-sm size-13">
              </div>
            </div>
            <div class="col-md-2">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Incentivo acuerdo %</span>
                <input type="text" id="incenAcu" class="form-control form-control-sm shadow-sm size-13">
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text bold-span size-13">Observaciones:</span>
            <textarea id="obsAcu" class="form-control form-control-sm shadow-sm size-13"></textarea>
          </div>
          <div class="row">
            <div class="col-md-11">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Acuerdo:</span>
                <input type="file" id="acuerdoPDF" name="acuerdoPDF" class="form-control shadow-sm size-13" readonly>
                <input type="hidden" id="nacuerdoPDF" name="nacuerdoPDF">
              </div>
            </div>
            <div class="col-md-1">
              <button class="btn btn-success btn-sm w-100" onClick="GuardarAcuerdo();">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <h6 class="title-card">ACUERDOS REALIZADOS</h6>
        <div class="card p-2 border-card shadow-sm">
          <div id="dvResultAcu" class="table-responsive"></div>
        </div>
      </div>
      <!-- TAB ROTACIÓN CARTERA -->
      <div class="tab-pane fade p-2" id="dvRotacion" role="tabpanel">
        <h6 class="title-card">ROTACIÓN DE CARTERA POR ZONA</h6>
        <div class="card p-2 border-card shadow-sm mb-4">
          <div class="row">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Oficina:</span>
                <select id="oficina" class="form-select form-select-sm shadow-sm size-13">

                </select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text bold-span size-13">Zona:</span>
                <select id="zona" class="form-select form-select-sm shadow-sm size-13">

                </select>
              </div>
            </div>
          </div>
        </div>
        <div style="overflow: auto;">
          <table class="table table-bordered table-hover table-sm" id="tablaRotacion">
            <thead>
              <tr>
                <th class="size-th-2 bag-info">ZONA</th>
                <th class="size-th-2 bag-info">EJECUTIVO</th>
                <th class="size-th-2 bag-info">AÑO</th>
                <th class="size-th-2 bag-info">MES</th>
                <th class="size-th-2 bag-info">DÍAS</th>
                <th class="size-th-2 bag-info">CARTERA</th>
                <th class="size-th-2 bag-info">VENTA</th>
                <th class="size-th-2 bag-info">ROTACIÓN</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
      <!-- TAB PROCESOS JUDICIALES -->
      <div class="tab-pane fade p-1" id="dvJuridica" role="tabpanel">
        <h6 class="title-card">DATOS BÁSICOS DEL CLIENTE</h6>
        <div class="card p-2 border-card shadow-sm mb-4">
          <div class="container-fluid">
            <div class="row mb-3">
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Código:</span>
                  <input type="text" class="form-control form-control-sm shadow-sm size-13" style="font-weight: 500;" id="codigoJ">
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Organización:</span>
                  <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="organizacionJ" readonly>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Oficina:</span>
                  <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="oficinaJ" readonly>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Nombre Cliente:</span>
                  <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="clienteJ" readonly>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Razón Social:</span>
                  <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="razonJ" readonly>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Zona Venta:</span>
                  <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="zonaJ" readonly>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Ejecutivo a Cargo:</span>
                  <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="ejecutivoJ" readonly>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Cédula:</span>
                  <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="cedulaJ" readonly>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Dirección:</span>
                  <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="direccionJ" readonly>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Teléfono:</span>
                  <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="telefonoJ" readonly>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Correo Electrónico:</span>
                  <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="correoJ" readonly>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Recordatorio pago:</span>
                  <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="recordatorioJ">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-8">
                <div class="input-group">
                  <span class="input-group-text bold-span size-13">Carta CIFIN:</span>
                  <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="cifinJ">
                </div>
              </div>
              <div class="col-md-4">
                <button class="btn btn-outline-primary btn-sm w-100" id="btnGuardar">
                  <i class="fa-solid fa-floppy-disk"></i> Guardar datos
                </button>
              </div>
            </div>
          </div>
        </div>
        <p style="font-family: system-ui; font-size: 14px; color: #055160;">
          A continuación se listan todos los procesos... Tanto en estados Finalizados, Prejurídicos y Jurídicos
        </p>
        <div style="overflow: auto;">
          <table class="table table-bordered table-hover table-sm" style="width: 100%;" id="tablaProcesos">
            <thead>
              <tr>
                <th class="size-th-2 bag-info no-wrap">N°</th>
                <th class="size-th-2 bag-info no-wrap">ORGANIZACIÓN</th>
                <th class="size-th-2 bag-info no-wrap">OFICINA</th>
                <th class="size-th-2 bag-info no-wrap text-center">GESTIÓN</th>
                <th class="size-th-2 bag-info no-wrap">CÓDIGO</th>
                <th class="size-th-2 bag-info no-wrap">NOMBRE CLIENTE</th>
                <th class="size-th-2 bag-info no-wrap">RAZÓN SOCIAL</th>
                <th class="size-th-2 bag-info no-wrap text-center">ESTADO</th>
                <th class="size-th-2 bag-info no-wrap">DOCUMENTO</th>
                <th class="size-th-2 bag-info no-wrap">TELÉFONO</th>
                <th class="size-th-2 bag-info no-wrap">DIRECCIÓN</th>
                <th class="size-th-2 bag-info no-wrap">CORREO</th>
                <th class="size-th-2 bag-info no-wrap">ZONA VENTAS</th>
                <th class="size-th-2 bag-info no-wrap">EJECUTIVO A CARGO</th>
                <th class="size-th-2 bag-info no-wrap">FECHA</th>
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
  <div id="loaderCRM" class="" style="display: none;"></div>

  <!-- MODAL VER PDF -->
  <div class="modal fade" id="ModalPDF" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
  <!-- MODAL PAGARÉ -->
  <div class="modal fade" id="ModalPagare" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 70%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-green">PAGARES</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div id="DlgInfoDet"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL CARTAS -->
  <div class="modal fade" id="ModalCartas" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 70%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-green">CARTAS</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="BodyModalCartas">

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-warning" onClick="EnviarMail()">Enviar Email</button>
          <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL PEDIDOS -->
  <div class="modal fade" id="ModalPedidos" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 100%; height: 99vh; margin: 0;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-green"></h1>
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
          <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL LOGS -->
  <div class="modal fade" id="modalLogs" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="min-width: 70%;">
      <div class="modal-content" style="background-color: whitesmoke;">
        <div class="modal-header">
          <div class="modal-title">
            <h4 class="text-green">GESTIÓN DEL PROCESO</h4>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-3" style="padding: 20px; display: flex; justify-content: center;">
          <div class="timeline-container">
            <div class="timeline"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL PDF -->
  <div class="modal fade" id="modalVerPDF" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 70%;">
      <div class="modal-content">
        <div class="modal-body" id="verPDF">

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL GESTIONAR PROCESO -->
  <div class="modal fade" id="modalGestion" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" style="min-width: 80%;">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <h4 class="text-green">GESTIONAR PROCESOS PREJURÍDICOS Y JURÍDICOS</h4>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="idPricesoHidden">
          <div class="mb-5" id="alertEstados"></div>
          <h5 class="text-center text-green">GESTIÓN DE PROCESOS PREJURÍDICOS</h5>
          <h6 class="title-card">DATOS DEL PROCESO</h6>
          <div class="card p-2 border-card shadow-sm mb-5">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-md-2">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Código:</span>
                    <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="codigoM" readonly>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Nombre Cliente:</span>
                    <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="nombreM" readonly>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Razón Social:</span>
                    <input type="text" class="form-control form-control-sm shadow-sm size-13 bag-disabled" id="razonM" readonly>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-end gap-3">
                <button class="btn btn-outline-primary btn-sm shadow-sm" title="Ver recordatorio pago" id="btnVerRecordatorio">
                  <i class="fa-solid fa-file"></i>
                  Ver
                </button>
                <button class="btn btn-outline-success btn-sm shadow-sm" title="Ver carta CIFIN" id="btnVerCifin">
                  <i class="fa-solid fa-file-lines"></i>
                  Ver
                </button>
              </div>
            </div>
          </div>
          <hr>
          <h6 class="title-card">CARTA PREJURÍDICA</h6>
          <div class="card p-2 border-card shadow-sm mb-5">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-10">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Carta Prejurídica:</span>
                    <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="cartaM">
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="input-group d-flex justify-content-end">
                    <button class="btn btn-outline-primary btn-sm shadow-sm" title="Ver o cargar la carta prejurídica" id="btnCargarCarta">
                      <i class="fa-solid fa-file-lines"></i>
                      <span>Cargar carta</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <h6 class="title-card">GESTIÓN ACUERDO DE PAGO</h6>
          <div class="card p-2 border-card shadow-sm mb-5">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Acuerdo Pago:</span>
                    <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="acuerdoM">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Fecha Inicio:</span>
                    <input type="date" class="form-control form-control-sm shadow-sm size-13" id="fechaIniM">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Fecha Final:</span>
                    <input type="date" class="form-control form-control-sm shadow-sm size-13" id="fechaFinM">
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <button class="btn btn-outline-primary btn-sm shadow-sm" title="Ver o guardar el acuerdo de pago" id="btnCargarAcuerdo">
                  <i class="fa-solid fa-handshake"></i>
                  <span>Guardar</span>
                </button>
              </div>
            </div>
          </div>
          <hr>
          <h6 class="title-card">FINALIZACIÓN PROCESO PREJURÍDICO</h6>
          <div class="card p-2 border-card shadow-sm mb-5">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Soporte de pago:</span>
                    <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="soporteM">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Fecha soporte:</span>
                    <input type="date" class="form-control form-control-sm shadow-sm size-13" id="fechaSoporteM">
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-end gap-3">
                  <button class="btn btn-outline-primary btn-sm shadow-sm" title="Ver o cargar el soporte de pago" id="btnGuardarSoporte">
                    <i class="fa-solid fa-receipt"></i>
                    <span>Guardar soporte</span>
                  </button>
                  <button class="btn btn-outline-danger btn-sm shadow-sm" title="Enviar a cobro jurídico" id="btnEnviarJuridico">
                    <i class="fa-solid fa-gavel"></i>
                  </button>
              </div>
            </div>
          </div>
          <h5 class="text-center text-green">GESTIÓN DE PROCESOS JURÍDICOS</h5>
          <h6 class="title-card">PROCESO PREJURÍDICO</h6>
          <div class="card p-2 border-card shadow-sm mb-5">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Documentos:</span>
                    <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="documentosM">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Monto/Valor:</span>
                    <input type="text" class="form-control form-control-sm shadow-sm size-13" autocomplete="off" style="font-weight: 500;" id="montoM">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Fecha Inicio:</span>
                    <input type="date" class="form-control form-control-sm shadow-sm size-13" id="fechaJuridicaM">
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <button class="btn btn-outline-primary btn-sm shadow-sm" title="Ver o cargar la documentación jurídica" id="btnGuardarDatosJuri">
                  <i class="fa-solid fa-folder-open"></i>
                  <span>Cargar</span>
                </button>
              </div>
            </div>
          </div>
          <hr>
          <h6 class="title-card">SEGUIMIENTO DEL PROCESO</h6>
          <div class="card p-2 border-card shadow-sm mb-5">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Informe Bienes:</span>
                    <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="bienesM">
                  </div>
                </div>                
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Presentación Demanda:</span>
                    <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="demandaM">
                  </div>
                </div>                
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Juzgado/Radicado:</span>
                    <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="juzgaRadiM">
                  </div>
                </div>                
              </div>
              <div class="row">                
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Juzgado:</span>
                    <input type="text" class="form-control form-control-sm shadow-sm size-13" style="font-weight: 500;" id="juzgadoM">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Radicado:</span>
                    <input type="text" class="form-control form-control-sm shadow-sm size-13" autocomplete="off" style="font-weight: 500;" id="radicadoM">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Fecha Demanda:</span>
                    <input type="date" class="form-control form-control-sm shadow-sm size-13" autocomplete="off" id="fechaDemandaM">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <h6 class="title-card">OBSERVACIONES DEL PROCESO</h6>
          <div class="card p-2 border-card shadow-sm mb-5">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Mandamiento de Pago:</span>
                    <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="mandamientoM">
                  </div>
                </div>                
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Notificación Demanda:</span>
                    <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="demandaM">
                  </div>
                </div>                
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Acuerdo Pago:</span>
                    <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="acuerdo2M">
                  </div>
                </div>                
              </div>
            </div>
          </div>
          <hr>
          <h6 class="title-card">OBSERVACIONES DEL PROCESO</h6>
          <div class="card p-2 border-card shadow-sm">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13">Estado:</span>
                    <select class="form-select form-select-sm shadow-sm size-13" id="estadoM">
                      <option value="">--Seleccione el estado--</option>
                      <option value="1">PENDIENTE POR DILIGENCIA</option>
                      <option value="2">EN ACUERDO DE PAGO</option>
                      <option value="3">FINALIZADO</option>
                      <option value="4">EN ESTADO DE INSOLVENCIA</option>
                    </select>
                  </div>
                </div>                
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bold-span size-13" id="labelEstado">:</span>
                    <input type="file" accept=".pdf" class="form-control form-control-sm shadow-sm size-13" id="demandaM">
                  </div>
                </div>     
              </div>            
            </div>
          </div>
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
  <script type="text/javascript" src="../controllers/CRM.js?<?php echo (rand()); ?>"></script>
</body>

</html>