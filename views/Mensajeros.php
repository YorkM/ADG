<?php
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 1 Jul 2000 05:00:00 GMT");
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
  <title>Mensajería</title>
  <link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php echo (rand()); ?>" />
  <link type="text/css" rel="stylesheet" href="../lib/Bootstrap/V5/css/bootstrap.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.13.2/dist/sweetalert2.min.css">
  <link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php echo (rand()); ?>">
  <link href="../lib/exportar_html_excel/dist/css/tableexport.css" rel="stylesheet" type="text/css">
  <link href="../resources/fontawesome/css/all.min.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css">
  <style>
    .bag-info {
      background-color: #cff4fc !important;
    }

    .text-green {
      color: #055160 !important;
    }

    .size-15 {
      font-size: 15px;
    }

    .size-14 {
      font-size: 14px;
    }

    .size-13 {
      font-size: 13px;
    }

    .size-12 {
      font-size: 12px;
    }

    .p-title {
      padding: 12px;
      border: 1px solid #9eeaf9;
    }

    .bag-disabled {
      background-color: #e9ecef !important;
    }

    .custom-shadow {
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    }

    .vertical {
      vertical-align: middle !important;
    }

    .no-wrap {
      padding: 0;
      line-height: 2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #loaderRD {
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

    #loaderRD img {
      max-width: 500px;
      height: 300px;
      margin-bottom: 10px;
    }

    label {
      font-weight: 500;
    }
  </style>
</head>

<body>
  <div id="tituloModuloRD" class="alert alert-info" style="font-weight: 500;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0505 - REGISTRO DE DESPACHO</div>

  <input type="hidden" id="TxtIdu" value="<?php echo (!empty($_SESSION["ses_Id"])) ? $_SESSION["ses_Id"] : ""; ?>" readonly />
  <input type="hidden" id="TxtCod_sap_emp" value="<?php echo $_SESSION["ses_CodSap"]; ?>" readonly />
  <input type="hidden" id="TxtIdRol" value="<?php echo $_SESSION["ses_RolesId"]; ?>" readonly />
  <input type="hidden" id="TxtIdDpto" value="<?php echo $_SESSION["ses_DepId"]; ?>" readonly />
  <input type="hidden" id="TxtOrg" value="<?php echo $_SESSION["ses_NumOrg"]; ?>" readonly />
  <input type="hidden" id="TxtOfic" value="<?php echo $_SESSION["ses_OfcVentas"]; ?>" readonly />
  <input type="hidden" id="id_reg_despacho" readonly />
  <input type="hidden" id="numero_h" readonly />

  <div class="container-fluid">
    <!-- MENÚ DE OPCIONES A LOS TABS -->
    <ul class="nav nav-tabs" id="nav-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="btnDespacho" data-bs-toggle="tab" data-bs-target="#dvDespacho" type="button" role="tab" aria-controls="dvDespacho" aria-selected="true">
          <i class="fa-solid fa-truck-moving"></i>&nbsp;
          <span class="btn-text">Despacho</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="btnPlanilla" data-bs-toggle="tab" data-bs-target="#dvPlanilla" type="button" role="tab" aria-controls="dvPlanilla" aria-selected="false">
          <i class="fa-solid fa-clipboard-list"></i>&nbsp;
          <span class="btn-text">Planilla</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="btnPlanillaDetalle" data-bs-toggle="tab" data-bs-target="#dvPlanillaDetalle" type="button" role="tab" aria-controls="dvPlanillaDespacho" aria-selected="false">
          <i class="fa-solid fa-list"></i>&nbsp;
          <span class="btn-text">Planilla Detalle</span>
        </button>
      </li>
    </ul>
    <!-- CONTENIDO DE CADA TAB -->
    <div class="tab-content pt-2" id="nav-tabContent">
      <!-- TAB DESPACHO -->
      <div class="tab-pane fade show active p-1" id="dvDespacho" role="tabpanel" aria-labelledby="nav-home-tab">
        <h5 class="bag-info text-green p-title size-15 mb-3">REGISTRO DE ENVÍO (DESPACHO) DE FACTURAS</h5>
        <div class="row mb-2">
          <div class="col-md-4">
            <label class="size-13" for="TxtOficina">OFICINA</label>
          </div>
          <div class="col-md-8">
            <select id="TxtOficina" class="form-select shadow-sm custom-shadow size-13">

            </select>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-4">
            <label class="size-13" for="TxtTipoEnvio">ENVIADO POR</label>
          </div>
          <div class="col-md-8">
            <select class="form-select shadow-sm size-13" id="TxtTipoEnvio">
              <option value="M" selected>MENSAJEROS</option>
              <option value="T">TRANSPORTADORES</option>
            </select>
          </div>
        </div>
        <div class="row mb-2" id="trMensajeros">
          <div class="col-md-4">
            <label class="size-13" for="TxtEmpacador">MENSAJERO</label>
          </div>
          <div class="col-md-8">
            <select class="form-select shadow-sm size-13" id="TxtEmpacador">

            </select>
          </div>
        </div>
        <div class="row mb-2" id="trTransportador">
          <div class="col-md-4">
            <label class="size-13" for="TxtTransportador">TRANSPORTADOR</label>
          </div>
          <div class="col-md-8">
            <select class="form-select shadow-sm size-13" id="TxtTransportador">

            </select>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-4">
            <label class="size-13" for="TxtReexpedicion">REEXPEDICIÓN</label>
          </div>
          <div class="col-md-8">
            <select class="form-select shadow-sm size-13" id="TxtReexpedicion">
              <option value="N" selected>NO</option>
              <option value="S">SI</option>
            </select>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-4">
            <label class="size-13" for="TxtNFactura">N° FACTURA</label>
          </div>
          <div class="col-md-8">
            <input type="text" class="form-control shadow-sm size-14" id="TxtNFactura">
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="size-13" for="totFletes">TOTAL FLETES</label>
          </div>
          <div class="col-md-8">
            <input type="text" id="totFletes" class="form-control shadow-sm size-14 bag-disabled" onKeyPress="return vnumeros(event)" value="0" readonly>
          </div>
        </div>
        <hr>
        <div class="mb-2" style="overflow: auto;" id="trDetallefact">
          <table class="table table-bordered table-hover table-sm w-100 data_facturas_planillas">
            <thead>
              <tr>
                <th class="bag-info text-green size-14 no-wrap">FACTURA</th>
                <th class="bag-info text-green size-14 no-wrap">CÓDIGO</th>
                <th class="bag-info text-green size-14 no-wrap">NIT</th>
                <th class="bag-info text-green size-14 no-wrap">CLIENTE</th>
                <th class="bag-info text-green size-14 no-wrap">DPTO</th>
                <th class="bag-info text-green size-14 no-wrap">CIUDAD</th>
                <th class="bag-info text-green size-14 no-wrap">CAJAS</th>
                <th class="bag-info text-green size-14 no-wrap">PAQ</th>
                <th class="bag-info text-green size-14 no-wrap" style="display:none">INICIO</th>
                <th class="bag-info text-green size-14 no-wrap" style="display:none">FIN</th>
                <th class="bag-info text-green size-14 no-wrap">FLETE</th>
                <th class="bag-info text-green size-14 no-wrap">GUIA</th>
                <th class="bag-info text-green size-14 no-wrap">REEXPIDE</th>
                <th class="bag-info text-green size-14 no-wrap">ID REEXPIDE</th>
                <th class="bag-info text-green size-14 no-wrap">FLETE/PROVEEDOR</th>
                <th class="bag-info text-green size-14 no-wrap">ELIMINAR</th>
              </tr>
            </thead>
            <tbody id="tbody">

            </tbody>
          </table>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-success shadow-sm d-flex align-items-center gap-1" id="BtnProceso">
            <i class="fa-solid fa-play"></i> Iniciar
          </button>
          <button class="btn btn-sm btn-outline-danger shadow-sm d-flex align-items-center gap-1" onClick="Limpiar();">
            <i class="fa-solid fa-trash-can"></i> Limpiar
          </button>
          <button class="btn btn-sm btn-outline-primary shadow-sm" id="btn_lista_precios" style="display: none;">
            <i class="fa-solid fa-list-ul"></i> Listas
          </button>
        </div>
      </div>
      <!-- TAB PLANILLA -->
      <div class="tab-pane fade p-1" id="dvPlanilla" role="tabpanel" aria-labelledby="nav-profile-tab">
        <div class="row mb-3">
          <div class="col-md-2">
            <div class="form-group">
              <label for="fhIni" class="size-13">FECHA INICIAL</label>
              <input type="text" class="form-control shadow-sm size-14" id="fhIni">
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="fhFin" class="size-13">FECHA FINAL</label>
              <input type="text" class="form-control shadow-sm size-14" id="fhFin" />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="TxtOficina2" class="size-13">OFICINA</label>
              <select id="TxtOficina2" class="form-select shadow-sm size-14">

              </select>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="slcStatus" class="size-13">ESTADO</label>
              <select id="slcStatus" class="form-control shadow-sm size-14">
                <option value="T">TODOS</option>
                <option value="D">DESPACHADOS</option>
                <option value="E">ENTREGADOS</option>
              </select>
            </div>
          </div>
          <div class="col-md-2 align-self-end">
            <button class="btn btn-sm btn-outline-success shadow-sm w-100 d-flex justify-content-center align-items-center gap-2" id="exportarExcel">
              <i class="fa fa-file-excel fa-lg"></i>
              Exportar a Excel
            </button>
          </div>
        </div>
        <div id="dvListaDespachos"></div>
        <div id="dvListaDespachosExcel" style="display: none;"></div>
      </div>
      <!-- TAB PLANILLA DETALLE -->
      <div class="tab-pane fade p-1" id="dvPlanillaDetalle" role="tabpanel" aria-labelledby="nav-profile-tab">
        <div class="card p-2 mb-2 shadow-sm">
          <div class="mb-2">
            <input type="text" id="FiltroPlanilla" class="form-control form-control-sm shadow-sm size-14" placeholder="Filtre aquí por cualquier columna" autocomplete="off">
          </div>
          <div class="row mb-2">
            <div class="col-md-4">
              <div class="form-group">
                <label for="TxtOficina2D" class="size-13">Oficina</label>
                <select id="TxtOficina2D" class="form-select form-select-sm shadow-sm size-12">

                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="fhIniD" class="size-13">Fecha Inicial</label>
                <input type="text" class="form-control form-control-sm shadow-sm size-12" id="fhIniD">
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="fhFinD" class="size-13">Fecha Final</label>
                <input type="text" class="form-control form-control-sm shadow-sm size-12" id="fhFinD">
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="" class="size-13">Lista</label>
                <select id="" class="form-select form-select-sm shadow-sm size-13">
                  <option value="">--Seleccione--</option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="" class="size-13">Ciudad</label>
                <select class="form-select form-select-sm shadow-sm size-13" id="">
                  <option value="">--Seleccione--</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">            
            <div class="col-md-4">
              <div class="form-group">
                <label for="" class="size-13">Cliente</label>
                <select class="form-select form-select-sm shadow-sm size-13" id="">
                  <option value="">--Seleccione--</option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="" class="size-13">Transportador</label>
                <select id="" class="form-select form-select-sm shadow-sm size-13">
                  <option value="">--Seleccione--</option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="" class="size-13">Zona</label>
                <select class="form-select form-select-sm shadow-sm size-13" id="">
                  <option value="">--Seleccione--</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end mb-3">
          <button type="button" class="btn btn-outline-primary btn-sm" title="Click aquí para consultar" onClick="ConsultarDetallePlanilla();">
            <i class="fa-solid fa-magnifying-glass"></i>
            Consultar
          </button>
        </div>
        <div style="overflow: auto;" id="dvListaDespachosDet"></div>
      </div>
    </div>
  </div>

  <!-- LOADING DEL MÓDULO -->
  <div id="loaderRD" class="" style="display: none;"></div>

  <!-- MODAL PARA VER PDF DE LA PLANILLA -->
  <div class="modal fade" id="dvPlanillaPDF" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 80%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-green" id="exampleModalLabel">PDF PLANILLA</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="dvPDFPlanilla">

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL LISTAR DESPACHOS -->
  <div class="modal fade" id="dvListaDespachosDetalle" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 80%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-green" id="exampleModalLabel">DETALLES DE DESPACHO</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="dvResultDetalle" style="overflow: auto;">

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-primary btn-sm" id="btnAddFactura">Agregar Factura</button>
          <button type="button" class="btn btn-outline-success btn-sm" onClick="DespacharVarios();">Despachar</button>
          <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL EDITAR LISTA DE FLETE -->
  <div class="modal fade" id="modalEditarLista" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 60%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-green" id="exampleModalLabel">EDITAR LISTA</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="idListaHidden">
          <div class="row mb-3">
            <div class="col-md-6">
              <div class="form-group">
                <label for="ListaFleteEdi">Lista</label>
                <select class="form-select shadow-sm size-14" id="ListaFleteEdi" disabled>

                </select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="PcjFleteEdi">% Flete</label>
                <input type="text" id="PcjFleteEdi" class="form-control shadow-sm size-14" onKeyPress="return vnumeros(event)">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-primary btn-sm" id="btnEditarLista">Guardar Cambios</button>
          <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL LISTAS DE FLETES -->
  <div class="modal fade" id="dvListaFletes" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 80%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-green" id="exampleModalLabel">LISTAS DE FLETES</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h5 class="bag-info text-green p-title size-15 mb-3">CONFIGURACIÓN DE LISTAS DE PRECIOS SEGUN FLETES</h5>
          <div class="row mb-3">
            <div class="col-md-4">
              <div class="form-group">
                <label for="ListaFlete">Lista</label>
                <select class="form-select shadow-sm size-14" id="ListaFlete">

                </select>
              </div>
            </div>
            <div class="col-md-8">
              <div class="form-group">
                <label for="PcjFlete">% Flete</label>
                <input type="text" id="PcjFlete" class="form-control shadow-sm size-14" onKeyPress="return vnumeros(event)">
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-end mb-2">
            <button type="button" class="btn btn-sm btn-outline-success" onClick="AgregarListaFlete()">Agregar Lista</button>
          </div>
          <div id="ResultFletes"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL AGREGAR FACTURA -->
  <div class="modal fade" id="dvAddFactura" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 60%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-green" id="exampleModalLabel">AGREGAR FACTURA</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row mb-2">
            <div class="col-md-4">
              <label class="size-14" for="idPlanilla">Número de Planilla</label>
            </div>
            <div class="col-md-8">
              <input type="text" id="idPlanilla" class="form-control shadow-sm size-14 bag-disabled" readonly>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-4">
              <label class="size-14" for="addNumeroFactura">Número de Factura</label>
            </div>
            <div class="col-md-8">
              <input type="text" id="addNumeroFactura" class="form-control shadow-sm size-14">
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-4">
              <label class="size-14" for="addCodigo">Código SAP</label>
            </div>
            <div class="col-md-8">
              <input type="text" id="addCodigo" class="form-control shadow-sm size-14 bag-disabled" readonly>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-4">
              <label class="size-14" for="addCliente">Cliente</label>
            </div>
            <div class="col-md-8">
              <input type="text" id="addCliente" class="form-control shadow-sm size-14 bag-disabled" readonly>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-4">
              <label class="size-14" for="addCiudad">Ciudad/Dpto</label>
            </div>
            <div class="col-md-8">
              <input type="text" id="addCiudad" class="form-control shadow-sm size-14 bag-disabled" readonly>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-4">
              <label class="size-14" for="addFlete">Flete</label>
            </div>
            <div class="col-md-8">
              <input type="text" id="addFlete" class="form-control shadow-sm size-14" value="$0" onKeyPress="return vnumeros(event)">
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-4">
              <label class="size-14" for="addGuia">Guía</label>
            </div>
            <div class="col-md-8">
              <input type="text" id="addGuia" class="form-control shadow-sm size-14" onKeyPress="return vnumeros(event)">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-success btn-sm" id="btnUpdPlanilla">Agregar</button>
          <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/Bootstrap/V5/js/bootstrap.bundle.min.js?<?php echo (rand()); ?>"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.13.2/dist/sweetalert2.all.min.js"></script>
  <script type="text/javascript" src="../lib/MaskMoney/jquery.maskMoney.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/jquery.uitablefilter.js"></script>
  <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
  <!--   EXPORTAR A EXCEL -->
  <script src="../lib/exportar_html_excel/FileSaver.min.js"></script>
  <script src="../lib/exportar_html_excel/Blob.min.js"></script>
  <script src="../lib/exportar_html_excel/xls.core.min.js"></script>
  <script src="../lib/exportar_html_excel/dist/js/tableexport.js"></script>
  <script src="../lib/js/funciones.js?<?php echo  rand(); ?>"></script>
  <script src="../lib/js/servicios.js?<?php echo  rand(); ?>"></script>
  <script type="text/javascript" src="../controllers/Mensajeros.js?<?php echo (rand()); ?>"></script>
</body>

</html>