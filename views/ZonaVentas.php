<?php session_start(); ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Zonas de ventas </title>
    
    <!-- Bootstrap 5.3.2 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Otros CSS -->
    <link rel="stylesheet" type="text/css" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php echo(rand()); ?>"/>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.min.css" id="theme-styles">
    <link rel="stylesheet" type="text/css" href="../lib/js/datepicke-time/datepicker-time.css?<?php echo(rand()); ?>">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <link rel="stylesheet" href="../resources/css/formulario.css">
    <link rel="stylesheet" href="../resources/css/tab.css">
    <link rel="stylesheet" href="../resources/css/calendario.css">
    <link rel="stylesheet" href="../resources/css/tablas.css">

<style>
    .tabla-estilo td {
        padding: 2px !important;
    }
    .tabla-estilo td input.form-control {
        width: 50px !important;       
        min-width: 30px !important;   
        max-width: 80px !important;   
        text-align: center !important;
        padding: 0 2px !important;
        display: inline-block !important;
    }
</style>
</head>

<body>
<input type="hidden" id="Organizacion" value="<?php echo (!empty($_SESSION["ses_NumOrg"])) ? $_SESSION["ses_NumOrg"] : ""; ?>" readonly>
<input type="hidden" id="Rol" value="<?php echo (!empty($_SESSION["ses_RolesId"] )) ? $_SESSION["ses_RolesId"] : "";?>" readonly>

<div class="alert alert-info"><i class="fa-solid fa-star fa-flip"></i> 0412 - ZONA DE VENTAS</div>
<div class="tabs-card">
    <div class="tabs-header">
        <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item" id="liCreacionModificacion" role="presentation">
                <button class="nav-link active"
                        id="tab1"
                        data-bs-toggle="tab"
                        data-bs-target="#principal"
                        type="button"
                        role="tab"
                        aria-controls="principal"
                        aria-selected="true">
                    <i class="fa fa-truck me-2"></i>
                    Creación - Modificación
                    <span class="badge bg-primary ms-2" id="n_creacion"></span>
                </button>
            </li>

            <li class="nav-item" id="liListadoZonas" role="presentation">
                <button class="nav-link"
                        id="tab2"
                        data-bs-toggle="tab"
                        data-bs-target="#listado"
                        type="button"
                        role="tab"
                        aria-controls="listado"
                        aria-selected="false">
                    <i class="fa fa-file-text me-2"></i>
                    Listado Zonas
                    <span class="badge bg-info ms-2" id="n_listado"></span>
                </button>
            </li>
        </ul>
    </div>
    <input type="hidden" id="id" readonly value="0">
    <div class="tab-content" id="myTabContent">
        <div class="px-3 tab-pane active" id="principal" role="tabpanel">
            <div class="card shadow-sm">
                <div class="card-header">
                    <h5 class="mb-0"><i class="fa fa-map me-2"></i> Gestión de Zonas</h5>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <!-- Oficina -->
                        <div class="col-6">
                            <label>Oficina</label>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text bg-light"><i class="fas fa-building opacity-50"></i></span>
                                <select class="form-select " id="oficina"></select>
                            </div>
                        </div>

                        <!-- Zona -->
                        <div class="col-6">
                            <label>Zona</label>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text bg-light"><i class="fas fa-map-marker-alt opacity-50"></i></span>
                                <input type="text" class="form-control " id="codigo_zona" maxlength="6" onKeyPress="return exclusion(event)">
                            </div>
                        </div>

                        <!-- Descripción zona -->
                        <div class="col-12">
                            <label>Descripción Zona</label>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text bg-light"><i class="fas fa-align-left opacity-50"></i></span>
                                <input type="text" class="form-control " id="descripcion" maxlength="120" onKeyPress="return exclusion(event)">
                            </div>
                        </div>

                        <!-- Checkboxes -->
                        <div class="col-12">
                            <div  class="row">
                                <div class="col-6">
                                    <div class="form-check mb-2 text-center align-items-center">
                                        <input class="form-check-input" type="checkbox" id="n_seg_p" name="n_seg_p">
                                        <label class="form-check-label" for="n_seg_p" style="max-width: 300px">
                                            No participa en seg de presupuesto <br> (NO SE MUESTRA EN EL 0108)
                                        </label>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-check text-center align-items-center">
                                        <input class="form-check-input" type="checkbox" id="n_cal_p" name="n_cal_p">
                                        <label class="form-check-label" for="n_cal_p" style="max-width: 300px">
                                            No afecta el valor del presupuesto <br> (SE MUESTRA EN EL 0108, PERO NO AFECTA EL VALOR DEL PRESUPUESTO)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Botones y carga de archivo -->
                        <div class="col-12">
                                <div class="d-flex gap-2">
                                    <button class="btn btn-outline-success" id="guardar">
                                        <i class="fas fa-save me-1"></i> Guardar
                                    </button>
                                    <button class="btn btn-outline-secondary" id="nuevo">
                                        <i class="fas fa-file me-1"></i> Nuevo
                                    </button>
                                </div>
                        </div>

                        <!-- Botones y carga de archivo -->
                        <div class="col-6">
                            <label></label>
                                <div class="input-group input-group-sm mt-md-0">
                                    <span class="input-group-text bg-light"><i class="fas fa-file-upload opacity-50"></i></span>
                                    <input type="file" class="form-control" id="csv">
                                </div>
                        </div>

                        <!-- Zonas a modificar -->
                        <div class="col-6">
                            <label>ZONAS A MODIFICAR/INSERTAR</label>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text bg-light"><i class="fas fa-exclamation-triangle opacity-50"></i></span>
                                <input type="text" readonly id="n_mod_insert" class="form-control" style="background-color: #FF6B6B80; color: #A83B3B;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="table_csv"></div>
        </div>
        <div class="px-3 tab-pane fade" id="listado" role="tabpanel" >
        <div class="card-body">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0"><i class="fas fa-search me-2"></i> Búsqueda de zona de ventas</h5>
                </div>
                <div class="p-3">
                    <!-- Campo de búsqueda -->
                    <div class="col-12">
                        <label>Zona / Descripción</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-light"><i class="fas fa-search opacity-50"></i></span>
                            <input type="text" name="busqueda" id="busqueda" autocomplete="off" class="form-control form-control-sm" onKeyPress="exclusion(event)">
                            <button class="btn btn-outline-success btn-sm" type="button" onClick="listarZonasVentas()">
                                <i class="fas fa-list me-1"></i> Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Resultados -->
        <div id="result" class="my-3"></div>
        </div>
    </div>
</div>

<!-- Bootstrap 5.3.2 JS Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- Otros scripts -->
<script type="text/javascript" src="//code.jquery.com/jquery-2.1.1.min.js"></script> 
<script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php echo(rand()); ?>"></script> 
<script type="text/javascript" src="../lib/js/datepicke-time/moments.js"></script> 
<script type="text/javascript" src="../lib/js/datepicke-time/datepicker.js"></script> 
<!--SWAL2 --> 
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.min.js"></script> 
<script type="text/javascript" src="../resources/HighCharts/code/highcharts.js"></script> 
<script type="text/javascript" src="../resources/HighCharts/code/modules/data.js"></script> 
<script type="text/javascript" src="../resources/HighCharts/code/modules/drilldown.js"></script> 
<script type="text/javascript" src="../resources/HighCharts/code/modules/exporting.js"></script> 
<script type="text/javascript" src="../lib/js/funciones.js?<?php echo(rand()); ?>"></script> 
<script type="text/javascript" src="../lib/bootstrap-notify/bootstrap-notify.min.js"></script>
<script type="text/javascript" src="../controllers/ZonaVentas.js?<?php echo(rand()); ?>"></script>
</body>
</html>