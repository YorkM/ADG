<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
include('../models/funciones.php');
session_start();
//echo $_SESSION["ses_DepId"];
?>
<!--
 SAP
 Actualizacion del modulo de gestion de visitas y llamadas
 Fecha:29-10-2016
 Ingeniero:Christian Bula Martinez
-->
<!doctype html>

<head>
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Last-Modified" content="0">
  <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!-- Latest compiled and minified CSS -->

  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  <link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs.css?<?php echo (rand()); ?>">
  <link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php echo (rand()); ?>" />
  <link type="text/css" rel="stylesheet" href="../lib/SweetAlert/sweet-alert.css?<?php echo (rand()); ?>" />
  <link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php echo (rand()); ?>">
  <link href="../lib/exportar_html_excel/dist/css/tableexport.css" rel="stylesheet" type="text/css">
  <link type="text/css" rel="stylesheet" href="../resources/select2-bootstrap4-theme/select2-bootstrap4.css">
  <link type="text/css" rel="stylesheet" href="../resources/select2/css/select2.css">
  <link href="../resources/fontawesome-free-6.1.2-web/css/all.min.css" rel="stylesheet" />

  <!--
    
	<link rel="stylesheet" href="../resources/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
	<link rel="stylesheet" href="../resources/plugins/icheck-bootstrap/icheck-bootstrap.min.css">
	<link rel="stylesheet" href="../resources/plugins/adminlte.min.css">	
	<link rel="stylesheet" href="../resources/plugins/select2/css/select2.min.css">
	<link rel="stylesheet" href="../resources/plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
	<link rel="stylesheet" href="../resources/plugins/daterangepicker/daterangepicker.css">
	<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.min.css" id="theme-styles">
	<link rel="stylesheet" href="../resources/plugins/jquery-ui/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="../resources/plugins/DataTables/datatables.min.css"/>	
	<link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs_v2.css?<?php echo (rand()); ?>" >		-->


  <script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/bootstrap.min.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="https://maps.google.com/maps/api/js?v=3&language=es&key=AIzaSyAiEVx_nyyrkNci_hWB_fMuUAkKn_OH_b8"></script>
  <script type="text/javascript" src="../lib/js/GoogleMapsPropios.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/SweetAlert/sweet-alert.min.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
  <script src="../lib/exportar_html_excel/FileSaver.min.js"></script>
  <script src="../lib/exportar_html_excel/Blob.min.js"></script>
  <script src="../lib/exportar_html_excel/xls.core.min.js"></script>
  <script src="../lib/exportar_html_excel/dist/js/tableexport.js"></script>
  <script src="https://momentjs.com/downloads/moment.min.js"></script>
  <script type="text/javascript" src="../resources/select2/js/select2.full.min.js"></script>
  <script type="text/javascript" src="../resources/fontawesome-free-6.1.2-web/js/all.min.js"></script>
  <script type="text/javascript" src="../controllers/SeguimientoVisitas.js?<?php echo (rand()); ?>"></script>
  <title></title>

  <style>
    .info-box {
      box-shadow: 0 0 1px rgba(0, 0, 0, .125), 0 1px 3px rgba(0, 0, 0, .2);
      border-radius: .25rem;
      background: #fff;
      display: -ms-flexbox;
      display: flex;
      margin-bottom: 1rem;
      min-height: 80px;
      padding: .5rem;
      position: relative;
      height: 140px;
    }

    .info-box .progress {
      background-color: rgba(0, 0, 0, .125);
      height: 2px;
      margin: 5px 0
    }

    .info-box .progress .progress-bar {
      background-color: #fff
    }

    .info-box .info-box-icon {
      border-radius: .25rem;
      -ms-flex-align: center;
      align-items: center;
      display: -ms-flexbox;
      display: flex;
      font-size: 1.875rem;
      -ms-flex-pack: center;
      justify-content: center;
      text-align: center;
      width: 70px
    }

    .info-box .info-box-icon>img {
      max-width: 100%
    }

    .info-box .info-box-content {
      -ms-flex: 1;
      flex: 1;
      padding: 5px 10px
    }

    .info-box .info-box-number {
      display: block;
      font-weight: 700
    }

    .info-box .info-box-text,
    .info-box .progress-description {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap
    }

    .info-box .info-box .bg-gradient-primary,
    .info-box .info-box .bg-primary {
      color: #fff
    }

    .info-box .info-box .bg-gradient-primary .progress-bar,
    .info-box .info-box .bg-primary .progress-bar {
      background-color: #fff
    }

    .info-box .info-box .bg-gradient-secondary,
    .info-box .info-box .bg-secondary {
      color: #fff
    }

    .info-box .info-box .bg-gradient-secondary .progress-bar,
    .info-box .info-box .bg-secondary .progress-bar {
      background-color: #fff
    }

    .info-box .info-box .bg-gradient-success,
    .info-box .info-box .bg-success {
      color: #fff
    }

    .info-box .info-box .bg-gradient-success .progress-bar,
    .info-box .info-box .bg-success .progress-bar {
      background-color: #fff
    }

    .info-box .info-box .bg-gradient-info,
    .info-box .info-box .bg-info {
      color: #fff
    }

    .info-box .info-box .bg-gradient-info .progress-bar,
    .info-box .info-box .bg-info .progress-bar {
      background-color: #fff
    }

    .info-box .info-box .bg-gradient-warning,
    .info-box .info-box .bg-warning {
      color: #1f2d3d
    }

    .info-box .info-box .bg-gradient-warning .progress-bar,
    .info-box .info-box .bg-warning .progress-bar {
      background-color: #1f2d3d
    }

    .info-box .info-box .bg-danger,
    .info-box .info-box .bg-gradient-danger {
      color: #fff
    }

    .info-box .info-box .bg-danger .progress-bar,
    .info-box .info-box .bg-gradient-danger .progress-bar {
      background-color: #fff
    }

    .info-box .info-box .bg-gradient-light,
    .info-box .info-box .bg-light {
      color: #1f2d3d
    }

    .info-box .info-box .bg-gradient-light .progress-bar,
    .info-box .info-box .bg-light .progress-bar {
      background-color: #1f2d3d
    }

    .info-box .info-box .bg-dark,
    .info-box .info-box .bg-gradient-dark {
      color: #fff
    }

    .info-box .info-box .bg-dark .progress-bar,
    .info-box .info-box .bg-gradient-dark .progress-bar {
      background-color: #fff
    }

    .info-box .info-box-more {
      display: block
    }

    .info-box .progress-description {
      margin: 0
    }

    @media (min-width:768px) {

      .col-lg-2 .info-box .progress-description,
      .col-md-2 .info-box .progress-description,
      .col-xl-2 .info-box .progress-description {
        display: none;
      }

      .col-lg-3 .info-box .progress-description,
      .col-md-3 .info-box .progress-description,
      .col-xl-3 .info-box .progress-description {
        display: none;
      }
    }

    @media (min-width:992px) {

      .col-lg-2 .info-box .progress-description,
      .col-md-2 .info-box .progress-description,
      .col-xl-2 .info-box .progress-description {
        font-size: .75rem;
        display: block;
      }

      .col-lg-3 .info-box .progress-description,
      .col-md-3 .info-box .progress-description,
      .col-xl-3 .info-box .progress-description {
        font-size: .75rem;
        display: block;
      }
    }

    @media (min-width:1200px) {

      .col-lg-2 .info-box .progress-description,
      .col-md-2 .info-box .progress-description,
      .col-xl-2 .info-box .progress-description {
        font-size: 1rem;
        display: block;
      }

      .col-lg-3 .info-box .progress-description,
      .col-md-3 .info-box .progress-description,
      .col-xl-3 .info-box .progress-description {
        font-size: 1rem;
        display: block;
      }
    }

    .parpadea {

      animation-name: parpadeo;
      animation-duration: 1s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;

      -webkit-animation-name: parpadeo;
      -webkit-animation-duration: 1s;
      -webkit-animation-timing-function: linear;
      -webkit-animation-iteration-count: infinite;
    }

    @-moz-keyframes parpadeo {
      0% {
        opacity: 1.0;
      }

      50% {
        opacity: 0.0;
      }

      100% {
        opacity: 1.0;
      }
    }

    @-webkit-keyframes parpadeo {
      0% {
        opacity: 1.0;
      }

      50% {
        opacity: 0.0;
      }

      100% {
        opacity: 1.0;
      }
    }

    @keyframes parpadeo {
      0% {
        opacity: 1.0;
      }

      50% {
        opacity: 0.0;
      }

      100% {
        opacity: 1.0;
      }
    }

    @media screen and (max-width: 999px) {

      .modal-sm {
        margin: 0 auto;
        width: 60%;
      }

      #btn-version-actual,
      #btn-version-beta {
        width: 100%;
        display: inline-block;
      }
    }

    #tablaVisitasZona thead tr th {
      font-size: 15px;
    }
    
    #tablaVisitasZona tbody tr td {
      font-size: 14px;
    }

    .tabla-fija thead th {
      position: sticky;
      top: 0;
      background: #fff;
      /* z-index: 2; */
    }

    .custom-nowrap-2 {
        padding: 0;
        line-height: 2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
  </style>
</head>

<body bgcolor="#FFFFFF">
  <input type="hidden" id="Organizacion" value="" readonly>
  <input type="hidden" id="RolId" value="<?php echo $_SESSION["ses_RolesId"]; ?>" readonly>
  <input type="hidden" id="Ofi" value="<?php echo $_SESSION["ses_OfcVentas"]; ?>" readonly>
  
  <div class="alert alert-info"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0104 - SEGUIMIENTO PROGRAMACIÓN</div>
  <div class="panel with-nav-tabs panel-info">
    <div class="panel-heading">
      <ul class="nav nav-tabs">
        <li class="active" id="liVisitasU"> <a href="#dvVisitasU" id="btnVisitasU" data-toggle="tab">Usuarios</a></li>
        <li id="liVisitasZ"> <a href="#dvVisitasZ" id="btnVisitasZ" data-toggle="tab">Zonas</a></li>
      </ul>
    </div>
    <div class="panel-body">
      <div class="tab-content">
        <div class="tab-pane fade in active" id="dvVisitasU">
          <table class="form" align="center" id="HistorialOpciones" width="100%">
            <thead>
              <tr>
                <th colspan="3">SEGUIMIENTO DE VISITAS/LLAMADAS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Departamento:</td>
                <td colspan="6"><select class="form-control" id="tipo"></select></td>
              </tr>
              <tr>
              <tr>
                <td>Oficina Ventas </td>
                <td colspan="6"><select class="form-control" id="oficina"></select></td>
              </tr>
              <tr>
                <td>Usuario:</td>
                <td colspan="3"><select class="form-control form-select" style="width: 100%; padding: 5px" id="ejecutivo"></select></td>
                <!--<td>Todos</td>
                <td><div id="Todos" class="DivCheckBox"></div></td>-->
              </tr>
              <tr>
                <td>Fecha Inicial:</td>
                <td colspan="6"><input type="text" class="form-control" readonly id="fecha_ini" size="10"></td>
              </tr>
              <tr>
                <td>Fecha Final:</td>
                <td colspan="6"><input type="text" class="form-control" readonly id="fecha_fin" size="10"></td>
              </tr>
              <tr>
                <td>Estados Geolocalización</td>
                <td>
                  <div class="btn-group" role="group" aria-label="...">
                    <button type="button" class="btn btn-danger btn-xs" aria-label="Left Align">
                      <i class="fa-solid fa-location-dot"></i> Erróneas
                    </button>
                    <button type="button" class="btn btn-info btn-xs" aria-label="Left Align">
                      <i class="fa-solid fa-location-dot"></i> GestiónVirtual
                    </button>
                    <button type="button" class="btn btn-success btn-xs" aria-label="Left Align">
                      <i class="fa-solid fa-location-dot"></i> </span>Correctas
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Estados Visitas</td>
                <td>
                  <div class="btn-group" role="group" aria-label="...">
                    <button type="button" class="btn btn-danger btn-xs" aria-label="Left Align">
                      <span class="fa fa-times-circle" aria-hidden="true"></span>&nbsp; P - Programada
                    </button>
                    <button type="button" class="btn btn-info btn-xs" aria-label="Left Align">
                      <span class="fa fa-check-circle" aria-hidden="true"></span>&nbsp; V - Visitada
                    </button>
                    <button type="button" class="btn btn-success btn-xs" aria-label="Left Align">
                      <span class="fa fa-check-circle" aria-hidden="true"></span>&nbsp; C - Contactada
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="6">

                  <div class="btn-group">
                    <button type="button" class="btn btn-default btn-sm" onclick="Consultar();" aria-label="Left Align">
                      <span class="fa fa-search" aria-hidden="true"></span>&nbsp;Consultar
                    </button>
                    <button type="button" class="btn btn-default btn-sm" onclick="Consultar2();" aria-label="Left Align">
                      <span class="fa fa-download" aria-hidden="true"></span>&nbsp;Exportar
                    </button>
                    <button type="button" class="btn btn-default btn-sm" onclick="Gestion();" aria-label="Left Align">
                      <span class="fa fa-phone-alt" aria-hidden="true"></span>&nbsp;Gestion llamada
                    </button>
                    <button type="button" class="btn btn-default btn-sm" onclick="GestionPosVentas();" aria-label="Left Align">
                      <span class="fa fa-copy" aria-hidden="true"></span>&nbsp;PostVenta
                    </button>

                    <button type="button" class="btn btn-default btn-sm" id="SeleccionarProg" aria-label="Left Align">
                      Seleccionar prog.( Desactivado)
                    </button>
                    <span id="span_chk_seleccionar" style="display: none;">
                      <label class="form-check-label">Seleccionara todas las filas</label>
                      <input class="form-check-input" type="checkbox" id="chk_seleccionar">
                    </span>
                    <button class="btn-danger btn btn-sm" style="display:none ;" id="eliminar_programacion">
                      <i class="fa fa-trash"></i>&nbsp; Eliminar
                    </button>

                  </div>




                </td>
              </tr>
            </tbody>
          </table>
          </br>
          <div id="FilaTotales" style="display:none;">
            <div class="row">
              <div class="col-12 col-sm-6 col-md-4">
                <div class="info-box">
                  <span class="info-box-icon bg-default elevation-1"><i class="fas fa-calendar"></i></span>
                  <div class="info-box-content">
                    <span class="info-box-text">Clientes Programados</span>
                    <span class="info-box-number" id="p_cant_programados"></span>
                    <span class="info-box-text">Clientes Visitados</span>
                    <span class="info-box-number" id="p_cant_visitados"></span>
                    <span class="info-box-text">&nbsp;</span>
                    <span class="info-box-number">&nbsp;</span>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <div class="info-box">
                  <span class="info-box-icon bg-default elevation-1"><i class="fas fa-percentage"></i></span>
                  <div class="info-box-content">
                    <span class="info-box-text">Promedio Clientes Programados</span>
                    <span class="info-box-number" id="p_prom_programados"></span>
                    <span class="info-box-text">Promedio Clientes Visitados</span>
                    <span class="info-box-number" id="p_prom_visitados"></span>
                    <span class="info-box-text">Dias Habiles</span>
                    <span class="info-box-number" id="p_prom_dias_habiles"></span>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <div class="info-box">
                  <span class="info-box-icon bg-default elevation-1"><i class="fas fa-calendar-check"></i></span>
                  <div class="info-box-content">
                    <span class="info-box-text">Minutos Laborales</span>
                    <span class="info-box-number" id="p_min_laborales"></span>
                    <span class="info-box-text">Minutos Laborados</span>
                    <span class="info-box-number" id="p_minutos_laborados"></span>
                    <span class="info-box-text">Cumplimiento</span>
                    <span class="info-box-number" id="p_minutos_cumplimiento"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-6 col-md-4">
                <div class="info-box">
                  <span class="info-box-icon bg-default elevation-1"><i class="fa fa-calendar-week"></i></span>
                  <div class="info-box-content">
                    <span class="info-box-text">Visitas Pendientes</span>
                    <span class="info-box-number" id="v_cant_programados"></span>
                    <span class="info-box-text">Visitas Realizadas</span>
                    <span class="info-box-number" id="v_cant_realizadas"></span>
                    <span class="info-box-text">&nbsp;</span>
                    <span class="info-box-number">&nbsp;</span>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <div class="info-box">
                  <span class="info-box-icon bg-default elevation-1"><i class="fa fa-calendar-check"></i></span>
                  <div class="info-box-content">
                    <span class="info-box-text">Prospecto de clientes</span>
                    <span class="info-box-number" id="v_clientes_nocreados"></span>
                    <span class="info-box-text">Visitas realizadas a clientes prospecto </span>
                    <span class="info-box-number" id="v_cant_realizadas_nuevos"></span>
                    <span class="info-box-text">&nbsp;</span>
                    <span class="info-box-number">&nbsp;</span>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <div class="info-box">
                  <span class="info-box-icon bg-default elevation-1"><i class="fas fa-calendar-plus"></i></span>
                  <div class="info-box-content">
                    <span class="info-box-text">Visitas Contactadas</span>
                    <span class="info-box-number" id="v_cant_contactadas"></span>
                    <span class="info-box-text">Porcentaje </span>
                    <span class="info-box-number" id="p_cant_contactadas"></span>
                    <span class="info-box-text">&nbsp;</span>
                    <span class="info-box-number">&nbsp;</span>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <div class="info-box">
                  <span class="info-box-icon bg-default elevation-1">
                    <i class="fa fa-clock"></i>
                  </span>
                  <div class="info-box-content">
                    <span class="info-box-text">Hora inicio</span>
                    <span class="info-box-number" id="v_hora_inicio"></span>
                    <span class="info-box-text">&nbsp;</span>
                    <span class="info-box-text">Hora final</span>
                    <span class="info-box-number" id="v_hora_final"></span>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">Motivos no venta
                <div class="info-box">

                  <span class="info-box-icon bg-default elevation-1">
                    <i class="fa-solid fa-heart-crack"></i>
                  </span>
                  <div class="info-box-content">
                    <table border="0" cellspacing="0" cellpadding="2">
                      <tr>
                        <td class="info-box-text">Venta&nbsp;</td>
                        <td id="no_venta_venta"></td>
                      </tr>
                      <tr>
                        <td class="info-box-text">Cartera&nbsp;</td>
                        <td id="no_venta_cartera"></td>
                      </tr>
                      <tr>
                        <td class="info-box-text">Pqrs&nbsp;</td>
                        <td id="no_venta_pqrs"></td>
                      </tr>
                      <tr>
                        <td class="info-box-text">Pos&nbsp;</td>
                        <td id="no_venta_pos"></td>
                      </tr>
                      <tr>
                        <td class="info-box-text">Otro&nbsp;</td>
                        <td id="no_venta_otro"></td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">Ubicacion
                <div class="info-box">
                  <span class="info-box-icon bg-default elevation-1">
                    <i class="fa-solid fa-map-location"></i>
                  </span>
                  <div class="info-box-content">
                    <span class="info-box-text">Erroneas</span>
                    <span class="info-box-number" id="ubicacion_erroneas"></span>
                    <span class="info-box-text">Virtuales</span>
                    <span class="info-box-number" id="ubicacion_virtuales"></span>
                    <span class="info-box-text">Correctas</span>
                    <span class="info-box-number" id="ubicacion_correctas"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-6 col-md-4">Tipo visita
                <div class="info-box">
                  <span class="info-box-icon bg-default elevation-1">
                    <i class="fa-regular fa-calendar-check"></i>
                  </span>
                  <div class="info-box-content">
                    <span class="info-box-text">Programadas</span>
                    <span class="info-box-number" id="tipo_programadas"></span>
                    <span class="info-box-text">Imprevisto</span>
                    <span class="info-box-number" id="tipo_imprevisto"></span>
                    <span class="info-box-text">Integraciones</span>
                    <span class="info-box-number" id="tipo_integracion"></span>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-4">Ventas realizadas
                <div class="info-box">
                  <span class="info-box-icon bg-default elevation-1">
                    <i class="fa-regular fa-handshake"></i>
                  </span>
                  <div class="info-box-content">
                    <table border="0" cellspacing="0" cellpadding="2" width="100%">
                      <tr>
                        <th></th>
                        <th align="left">Valor</th>
                        <th align="center">Cant clientes</th>
                      </tr>
                      <tr>
                        <th>Pedidos</th>
                        <th id="valor_pedidos" align="left"></th>
                        <th id="cant_clientes_pedidos" align="center"></th>
                      </tr>
                      <tr>
                        <th>Facturado</th>
                        <th id="valor_facturado" align="left"></th>
                        <th id="cant_clientes_facturado" align="center"></th>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div style="overflow: auto;" id="Result"></div>
          <div id="Result2"></div>
          <div id="Result3" style="display:none"></div>

          <div id="Result_prog_v"></div>
          <div id="cargaexterna"></div>
          <div id="datos_asterisk" style="display:none">
            <table width="50%" cellpadding="2" cellspacing="0" border="1" class="form" align="center">
              <tbody>
                <tr>
                  <td colspan="2" align="center">GESTION LLAMADAS</td>
                </tr>
                <tr>
                  <td colspan="2">&nbsp;</td>
                </tr>
                <tr>
                  <th width="215" align="left">N°. CONTESTADAS</th>
                  <th width="10"><span id="n_contestadas"></span></th>
                </tr>
                <tr>
                  <th align="left">N°. NO CONTESTADAS</th>
                  <th><span id="n_no_contestadas"></span></th>
                </tr>
                <tr>
                  <th align="left">N°.FALLIDAS</th>
                  <th><span id="n_fallidas"></span></th>
                </tr>
                <tr>
                  <th align="left">N°. OCUPADAS</th>
                  <th><span id="n_ocupadas"></span></th>
                </tr>
                <tr>
                  <th align="left">TIEMPO AL AIRE</th>
                  <th><span id="m_tiempo_aire"></span></th>
                </tr>
                <tr>
                  <th align="left">MIN. CONTESTADAS</th>
                  <th><span id="m_min_contestadas"></span></th>
                </tr>
                <tr>
                  <th align="left">MIN. NO CONTESTADAS</th>
                  <th><span id="m_min_no_contestadas"></span></th>
                </tr>
                <tr>
                  <th align="left">MIN. OCUPADAS</th>
                  <th><span id="m_min_ocupadas"></span></th>
                </tr>
                <tr>
                  <th align="left">VALOR PEDIDOS</th>
                  <th><span id="pedidos"></span></th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="tab-pane fade in" id="dvVisitasZ">
          <table class="form" align="center" width="100%">
            <thead>
              <tr>
                <th colspan="3">SEGUIMIENTO PROGRAMACIÓN ZONA</th>
              </tr>
            </thead>
            <tbody>             
              <tr>
                <td>Zona de ventas</td>
                <td>
                  <select id="txtZonas" class="form-control" style="width:100%">                   
                  </select>
                </td>
              </tr>              
              <tr>
                <td>Oficina de ventas</td>
                <td colspan="2">
                  <select id="FiltroOficinaVentas" class="form-control" style="width:100%">                   
                  </select>
                </td>
              </tr>
              <tr>
                <td>Fecha Inicial</td>
                <td colspan="2"><input type="text" id="txtFecha1" placeholder="Fecha Inicial" class="form-control" readonly></td>
              </tr>
              <tr>
                <td>Fecha Final</td>
                <td colspan="2"><input type="text" id="txtFecha2" placeholder="Fecha Final" class="form-control" readonly></td>
              </tr>             
              <tr>
                <td colspan="3">
                  <button class="btn btn-primary btn-sm" id="btnBuscar">Consultar</button>
                  <!-- <button class="btn btn-default btn-sm" id="btnLimpiar">Limpiar</button> -->
                </td>
              </tr>
            </tbody>
          </table>
          <div id="contenedorTablaVisitasZona" style="overflow: auto; height: 60vh; margin-top: 20px;">            
              
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="ModalGestion" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg" style="width: 90%">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">GESTION DE VISITAS/LLAMADAS</h4>
        </div>
        <div class="modal-body" id="ContenidoGestion"></div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <div id="ModalGestionVersion" class="modal fade bd-example-modal-lg" role="dialog" data-backdrop="static">
    <div class="modal-dialog modal-sm" style="width: 40%; min-width: 300px; max-width: 350px">
      <!-- Modal content-->
      <div class="modal-content">

        <div class="modal-body">
          <input id="id-modal-gestion" readonly type="hidden" value="0">
          <input id="org-modal-gestion" readonly type="hidden" value="">
          <div class="row">
            <div class="col-md-12">
              <h4>Por favor selecciona la versión del módulo que deseas ver </h4><br>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6" style="display: flex;align-content: center; align-items: center; justify-content: center">

              <button id="btn-version-actual" class="btn btn-info">
                <i class="glyphicon glyphicon-calendar"></i> &nbsp;Version actual
              </button>


            </div>
            <div class="col-md-6" style="display: flex;align-content: center; align-items: center; justify-content: center">
              <button id="btn-version-beta" class="btn btn-warning">
                <i class="glyphicon glyphicon-fire"></i>&nbsp;Version Beta</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>role="dialog" data-backdrop="static"
  </div>
  <!--INICIO MODAL DE GESTION DE GEOREFERENCIACION------>
  <div id="ModalGeoreferencia" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">GEOREFERENCIACIÓN DE VISITA</h4>
        </div>
        <div class="modal-body">
          <input type="hidden" class="form-control" disabled readonly id="id_sol_geo" size="10">
          <table class="form" width="100%">
            <thead>
            </thead>
            <tbody>
              <tr>
                <th colspan="4">UBICACIÓN CLIENTE</th>
              </tr>
              <tr>
                <td>DIRECCION</td>
                <td colspan="4" id="Dircli"></td>
              </tr>
              <tr>
                <td>LATITUD - LONGITUD</td>
                <td id="latcli"></td>
                <td id="loncli"></td>
                <td align="center">
                  <button type="button" class="btn btn-default btn-sm" aria-label="Left Align" onClick="VerMapa('C')">
                    <!-- <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" width="16" height="16"> -->
                  </button>
                </td>
                <td id="dir_cliente"></td>
              </tr>
              <tr>
                <th colspan="4">UBICACIÓN VISITA</th>
              </tr>
              <tr>
                <td>LATITUD - LONGITUD</td>
                <td id="latvis"></td>
                <td id="lonvis"></td>
                <td id="dir_visita"></td>
                <td align="center">
                  <button type="button" class="btn btn-default btn-sm" aria-label="Left Align" onClick="VerMapa('V')">
                    <!-- <img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" width="16" height="16"> -->
                  </button>
                </td>

              </tr>
              <tr>
                <th colspan="4">ESTADO</th>
              </tr>
              <tr>
                <td>DIFERENCIA DISTANCIA</td>
                <td colspan="3" id="gdiferencia"></td>
              </tr>
              <tr>
                <td>ESTADO</td>
                <td colspan="3" id="gestado"></td>
              </tr>
              <tr>
                <td colspan="4" align="center">
                  <button type="button" class="btn btn-info btn-sm" id="btn_auto_geo" onClick="AutorizarCoordenadas()">
                    AUTORIZAR NUEVAS COORDENADAS DE CLIENTE SEGUN ESTA VISITA
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div id="MapaGoogle" style="width: 100%; height: 350px;"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!--FIN MODAL DE GESTION DE GEOREFERENCIACION------>
  <div id="Bloquear" style="display:none;"></div>
  <div class="centrado-porcentual" style="display:none;background-color:transparent; width:30%; height:250px"></div>
</body>

</html>