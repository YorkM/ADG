<?php 
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
 include('../models/funciones.php');
 session_start();
 Redireccionar();
?>
<!doctype html>
<html lang="es">
<head>
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Last-Modified" content="0">
  <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta charset="utf-8">
  <title>Fidelización Ácida de Clientes</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../resources/plugins/fontawesome-free/css/all.min.css">
  <link rel="stylesheet" href="../resources/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-5.min.css">
  <!-- <link rel="stylesheet" href="../resources/plugins/adminlte.min.css"> -->
  <link rel="stylesheet" href="../resources/plugins/select2/css/select2.min.css">
  <link rel="stylesheet" href="../resources/plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
  <link rel="stylesheet" href="../resources/plugins/daterangepicker/daterangepicker.css">
  <link rel="stylesheet" href="../resources/plugins/sweetalert2/sweetalert2.css">
  <link rel="stylesheet" href="../resources/plugins/jquery-ui/jquery-ui.css">
  <link rel="stylesheet" type="text/css" href="../resources/plugins/DataTables/datatables.min.css"/>
  <link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs_v2.css?<?php echo(rand()); ?>">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="../resources/css/formulario.css">
  <link rel="stylesheet" href="../resources/css/imgPre.css">
  <link rel="stylesheet" href="../resources/css/tablas.css">

  <style>
    .dataTables_wrapper .top-section {
        display: flex;
        justify-content: space-between; 
        align-items: center;
        width: 100%;
        padding: 10px 15px;
        box-sizing: border-box;
        background-color: #f8f9fa; 
        border-radius: 4px;
        margin-bottom: 15px; 
    }

    .buttons-group {
        display: flex;
        gap: 8px; 
    }

    .dt-buttons .btn {
        padding: 6px 12px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: #fff;
        color: #333;
        transition: all 0.3s;
    }

    .dt-buttons .btn:hover {
        background-color: #e9ecef;
        border-color: #ccc;
    }

    .search-group {
        margin-left: auto; 
    }

    .dataTables_filter input {
        padding: 6px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        height: 34px;
        width: 250px; 
        font-size: 14px;
    }

    .dataTables_filter input:focus {
        border-color: #80bdff;
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    @media (max-width: 768px) {
        .top-section {
            flex-direction: column; 
            gap: 10px;
            padding: 10px;
        }
        .buttons-group, .search-group {
            width: 100%;
        }
        .dataTables_filter input {
            width: 100%; 
        }
    }
    table.dataTable tbody td.alert-success,
    table.dataTable tbody td.alert-warning {
        background-color: inherit !important;
    }

    table.dataTable tbody td.alert-success {
        background-color: #d4edda !important;
        color: #000000 !important;
    }

    table.dataTable tbody td.alert-warning {
        background-color: #fff3cd !important;
        color: #000000 !important;
    }
    /* Contenedor inferior (info + paginación) */
    .bottom-section {
        width: 100%;
        padding: 10px 15px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f8f9fa; 
        border-radius: 4px;
        margin-top: 10px !important;
    }

    /* Info (izquierda) */
    .info-group {
        margin-right: auto; 
        font-size: 14px;
        color: #6c757d;
    }

    /* Paginación (derecha) */
    .pagination-group {
        margin-left: auto; 
    }

    .dataTables_paginate .paginate_button:hover {
        background-color: #e9ecef;
    }
    .dataTables_paginate .paginate_button.current {
        background-color: #007bff;
        color: white !important;
        border-color: #007bff;
    }

</style>
</head>
<body class="hold-transition sidebar-mini layout-fixed">
  <!-- alert -->
  <!-- <div class="alert alert-info" style="background-color: #CFF4FC !important; color: #055160 !important; border: 0;">
      <i class="fa-solid fa-star fa-flip" ></i>&nbsp;0122 - FIDELIZACIÓN ACIDA DE CLIENTES
  </div> -->
    <!-- Main content -->
    <section class="content">
     
    <input type="hidden" id="Organizacion" value="<?php if(!empty($_SESSION["ses_NumOrg"])) { echo $_SESSION["ses_NumOrg"];} ?>">
    <input type="hidden" id="TxtRolId" value="<?php if(!empty($_SESSION["ses_RolesId"])){ echo $_SESSION["ses_RolesId"];} ?>">
    <input type="hidden" id="TxtIdu" value="<?php if(!empty($_SESSION["ses_Id"])) { echo $_SESSION["ses_Id"];} ?>">
    <input type="hidden" id="TxtCodSap" value="<?php if(!empty($_SESSION["ses_CodSap"] )){ echo $_SESSION["ses_CodSap"] ;} ?>">
    <input type="hidden" id="Rol" value="<?php if(!empty($_SESSION["ses_RolesId"] )){ echo $_SESSION["ses_RolesId"] ;}?>">
    <div class="p-3">
        <div class="card mb-3">
            <div class="card-header">
                <h5 class="mb-0"><i class="fas fa-users me-2"></i>FIDELIZACIÓN ÁCIDA DE CLIENTES</h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    
                    <div class="col-md-6">
                        <label class="form-label">Oficina</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-building opacity-50"></i></span>
                            <select id="SlcOficina" class="form-select"></select>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Zona Ventas</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-map-marker-alt opacity-50"></i></span>
                            <select id="txtZonas" class="form-select "></select>
                        </div>
                        <small class="text-muted"><i>(Opción todas se excluyen módulo 0412)</i></small>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Mes</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-calendar-alt opacity-50"></i></span>
                            <select id="meses" class="form-select "></select>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Año</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-calendar opacity-50"></i></span>
                            <select id="ano" class="form-select "></select>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Clasificaciones</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-star opacity-50"></i></span>
                            <select id="Clasificaciones" class="form-select ">
                                <option value="-">TODAS</option>
                                <option value="AA">AA</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Clase de Pedido</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-tag opacity-50"></i></span>
                            <select id="txtClasePedido" class="form-select ">
                                <option value="T" selected>TODOS</option>
                                <option value="ZPWA">ZPWA - ADMINISTRADOR</option>
                                <option value="ZPWV">ZPWV - VENDEDOR</option>
                                <option value="ZPWL">ZPWL - TELEVENDEDOR</option>
                                <option value="ZPWP">ZPWP - PROVEEDOR</option>
                                <option value="ZPWT">ZPWT - TRANSFERENCISTA</option>
                                <option value="ZPWC">ZPWC - CLIENTE</option>
                                <option value="ZPIC">ZPIC - INTEGRACION COMERCIAL</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="col-12 text-start mt-3">
                        <button class="btn btn-outline-success" id="btn_consultar"><i class="bi bi-search me-2"></i>Consultar</button>
                        <!-- <button class="btn btn-success btn-sm" id="btn_exportar"><span>Exportar</span></button> -->
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-3" id="FilaTotales" style="display:none;">
            <!-- Tarjeta Presupuesto de Ventas -->
            <div class="col-12 col-sm-6 col-md-3">
                <div class="card border-warning h-100 ">
                    <div class="card-body p-2">
                        <div class="d-flex">
                            <div class="bg-warning text-white rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                                <i class="fas fa-dollar-sign fa-xs"></i>
                            </div>
                            <div class="flex-grow-1 text-truncate">
                                <h6 class="text-muted text-uppercase small mb-1" style="font-size: 0.7rem;">Presupuesto Ventas</h6>
                                <div class="d-flex align-items-end justify-content-between">
                                    <p class="mb-0 fw-bold" style="font-size: 1.1rem;"><span id="p_pres_venta"></span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tarjeta Cumplimiento de Ventas -->
            <div class="col-12 col-sm-6 col-md-3">
                <div class="card border-danger h-100 ">
                    <div class="card-body p-2">
                        <div class="d-flex">
                            <div class="bg-danger text-white rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                                <i class="fas fa-chart-line fa-xs"></i>
                            </div>
                            <div class="flex-grow-1 text-truncate">
                                <h6 class="text-muted text-uppercase small mb-1" style="font-size: 0.7rem;">Cumplimiento Ventas</h6>
                                <div class="d-flex align-items-end justify-content-between">
                                    <p class="mb-0 fw-bold" style="font-size: 1.1rem;"><span id="p_cump_venta"></span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tarjeta Presupuesto de Cartera -->
            <div class="col-12 col-sm-6 col-md-3">
                <div class="card border-info h-100 ">
                    <div class="card-body p-2">
                        <div class="d-flex">
                            <div class="bg-info text-white rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                                <i class="fas fa-wallet fa-xs"></i>
                            </div>
                            <div class="flex-grow-1 text-truncate">
                                <h6 class="text-muted text-uppercase small mb-1" style="font-size: 0.7rem;">Presupuesto Cartera</h6>
                                <div class="d-flex align-items-end justify-content-between">
                                    <p class="mb-0 fw-bold" style="font-size: 1.1rem;"><span id="p_pres_cartera"></span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tarjeta Cumplimiento de Cartera -->
            <div class="col-12 col-sm-6 col-md-3">
                <div class="card border-primary h-100">
                    <div class="card-body p-2">
                        <div class="d-flex">
                            <div class="bg-primary text-white rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                                <i class="fas fa-check-circle fa-xs"></i>
                            </div>
                            <div class="flex-grow-1 text-truncate">
                                <h6 class="text-muted text-uppercase small mb-1" style="font-size: 0.7rem;">Cumplimiento Cartera</h6>
                                <div class="d-flex align-items-end justify-content-between">
                                    <p class="mb-0 fw-bold" style="font-size: 1.1rem;"><span id="p_cump_cartera"></span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="ConsolidadoAcidez" class="mt-3"></div>
        
        <div id="result" ></div>
        
        <div>
            <div class="card-body p-0">
                    <table id="TableView" class="tabla-estilo nowrap" style="width:100%">
                        <!-- <tfoot>
                            <tr>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                            </tr>
                        </tfoot> -->
                    </table>
            </div>
        </div>
    </div>

    </section>

  <div id="Bloquear" style="display:none;"></div>  
  <div class="centrado-porcentual"></div> 
  
  <script src="../resources/plugins/jquery/jquery.js"></script>
  <script src="../resources/plugins/jquery-ui/jquery-ui.min.js"></script>  
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../resources/plugins/moment/moment.min.js"></script>  
  <script src="../resources/plugins/daterangepicker/daterangepicker.js"></script>
  <script src="../resources/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-5.min.js"></script>
  <script src="../resources/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
  <script src="../resources/plugins/select2/js/select2.full.min.js"></script>
  <script type="text/javascript" src="../resources/plugins/DataTables/datatables.min.js"></script>
  <script type="text/javascript" src="../lib/js/funciones.js"></script>
  <script type="text/javascript" src="../controllers/FidelizacionAcida.js?<?php echo(rand()); ?>"></script>
</body>
</html>