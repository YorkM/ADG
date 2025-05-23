<?php session_start(); ?>
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>Plan Objetivos Esenciales</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php echo (rand()); ?>" />
    <link rel="stylesheet" href="../resources/bootstrap/bootstrap-5.0.2-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../resources/select2/css/select2.css" />
    <link rel="stylesheet" href="../resources/bootstrap/bootstrap-5.0.2-dist/css/select2-bootstrap-5-theme.min.css">
    <link rel="stylesheet" href="../lib/SweetAlert2_V10/dist/sweetalert2.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/handsontable@12.1.0/dist/handsontable.full.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <style>
        html,
        * {
            font-size: .9rem;
        }

        #tablaDatos thead tr th {
            font-weight: 400;
            color: #055160;
            font-size: larger;
        }

        #tablaReportes tbody tr th {
            font-weight: 400;
            color: #055160;
            font-size: larger;
        }

        #tablaReportesDos thead tr th {
            font-weight: 400;
            color: #055160;
            font-size: larger;
        }

        #tablaReportesDos tbody tr th {
            font-weight: 400;
            color: #055160;
            font-size: larger;
        }

        #tablaDatosDetalle thead tr th {
            font-weight: 700;
            color: #055160;
            font-size: larger;
        }

        #tablaAccionesReporte thead tr th {
            font-weight: 400;
            color: #055160;
            font-size: larger;
        }

        th,
        td {
            padding: 0;
            line-height: 2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .btn-guardar {
            background-color: #cff4fc;
            color: #055160;
            font-size: medium;
            width: 15%;
            border: 1px solid #055160;
            border-radius: 3px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }

        .btn-guardar:hover {
            background-color: #013f4b;
            color: rgb(183, 232, 241);
        }

        .bg-custom-input {
            background-color: #FFF8E7;
        }

        .bg-custom-input:focus {
            background-color: #FFF8E7;
        }

        .btn-accion-style {
            border: none;
            background-color: #055160;
            color: white;
            padding: 3px 7px;
            font-size: 12px;
            border-radius: 2px;
        }

        .btn-accion-style:hover {
            background-color: rgb(3, 76, 90);
            color: rgb(183, 232, 241);
        }

        .align-tds {
            vertical-align: middle;
        }

        .error {
            background-color: #ffcccc !important;
        }

        .bg-label {
            font-weight: 500;
        }

        .fw-bold-custom {
            font-weight: 500;
        }

        .bg-bold {
            background-color: #DDD !important;
        }

        .label-form {
            font-size: 15px;
        }
    </style>
</head>

<body>
    <input type="hidden" id="id-evento" value="0" readonly>
    <input type="hidden" id="Ofi" value="<?php echo (!empty($_SESSION["ses_OfcVentas"])) ? $_SESSION["ses_OfcVentas"] : "" ?>" readonly />
    <input type="hidden" id="org_ses" value="<?php echo (!empty($_SESSION["ses_NumOrg"])) ? $_SESSION["ses_NumOrg"] : "" ?>" readonly />
    <input type="hidden" id="usuario_ses" value="<?php echo (!empty($_SESSION['ses_Login'])) ? $_SESSION['ses_Login'] : "" ?>" readonly />
    <input type="hidden" id="rolId" value="<?php echo (!empty($_SESSION['ses_RolesId'])) ? $_SESSION['ses_RolesId'] : "" ?>" readonly />
    <input type="hidden" id="idPlan">
    <!-- VISTA GENERAL CREACIÓN - SEGUIMIENTO -->
    <div>
        <div class="alert alert-info mb-2" style="font-weight: 500; font-size: larger;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;11414 - PLAN OBJETIVOS ESENCIALES</div>
        <nav class="row p-1">
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true"><i class="fa fa-pencil"></i>&nbsp;Creación</button>

                <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false"><i class="fa-solid fa-eye"></i>&nbsp;Seguimiento</button>

                <button class="nav-link" id="btnReportes" data-bs-toggle="tab" data-bs-target="#reportes" type="button" role="tab" aria-controls="nav-profile" aria-selected="false"><i class="fa-solid fa-chart-simple"></i>&nbsp;Reportes</button>
            </div>
        </nav>
        <div class="tab-content " id="nav-tabContent">
            <div class="tab-pane fade show active p-2" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <div class="alert alert-danger d-none align-items-center gap-3 mb-3 mt-2" role="alert" id="alert1">
                    <i class="fa-solid fa-triangle-exclamation fa-xl"></i>
                    <div style="font-weight: 500; font-size: medium;">
                        Vigencia en los primeros 5 días del mes !!!
                    </div>
                </div>
                <div style="width: 95%; margin: 0 auto;">
                    <form class="" id="formulario">
                        <div class="row shadow-sm px-3 py-4" style="background-color: whitesmoke;">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="label-form" for="proceso">Proceso</label>
                                    <select name="PROCESO" id="proceso" class="form-select">

                                    </select>
                                </div>
                                <div class="form-group mt-2">
                                    <label class="label-form" for="periodo">Período a cumplir</label>
                                    <select name="PERIODO" id="periodo" class="form-select">
                                        <option value="">Seleccione el Periodo</option>
                                        <option value="DIARIO">DIARIO</option>
                                        <option value="SEMANAL">SEMANAL</option>
                                        <option value="QUINCENAL">QUINCENAL</option>
                                        <option value="MENSUAL">MENSUAL</option>
                                        <option value="BIMESTRAL">BIMESTRAL</option>
                                        <option value="TRIMESTRAL">TRIMESTRAL</option>
                                        <option value="SEMESTRAL">SEMESTRAL</option>
                                        <option value="ANUAL">ANUAL</option>
                                    </select>
                                </div>
                                <div class="form-group mt-2">
                                    <label class="label-form" for="meta">Meta %</label>
                                    <input type="text" class="form-control" name="META" id="meta" placeholder="% Meta">
                                </div>
                                <div class="form-group mt-2">
                                    <label class="label-form" for="rango">Rango %</label>
                                    <div class="d-flex gap-2">
                                        <input type="text" class="form-control" name="RANGO_INICIAL" id="rangoIni" placeholder="% Rango Inicial">
                                        <input type="text" class="form-control" name="RANGO_FINAL" id="rangoFin" placeholder="% Rango Final">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="label-form" for="objetivos">Objetivos esenciales</label>
                                    <textarea name="OBJETIVOS" class="form-control form-control-sm bg-custom-input" id="objetivos"></textarea>
                                </div>
                                <div class="form-group">
                                    <label class="label-form" for="causaRaiz">Causa raíz: <span>Es el factor específico y controlable que si lo eliminas previene la recurrencia o mejora significativa del indicador</span></label>
                                    <textarea name="CAUSA_RAIZ" class="form-control form-control-sm bg-custom-input" id="causaRaiz"></textarea>
                                </div>
                                <div class="form-group">
                                    <label class="label-form" for="indicador">Indicador: <span>Relación del resultado obtenido entre el objetivo a alcanzar</span></label>
                                    <textarea name="INDICADOR" class="form-control form-control-sm bg-custom-input" id="indicador"></textarea>
                                </div>
                                <div class="d-flex align-items-baseline gap-5 mt-2">
                                    <p style="font-weight: 600;">ACCIONES</p>
                                    <button type="button" class="btn btn-primary btn-sm" id="btnAgregarAcciones" style="height: max-content;">
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="row justify-content-center" id="contenedorAcciones">

                    </div>
                    <div class="d-flex justify-content-center mt-3 mb-2">
                        <button class="btn btn-primary w-50" id="btnGuardarPlan" style="font-size: large;">
                            Guardar plan
                        </button>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade p-2" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                <div class="alert alert-danger d-none align-items-center gap-3 mb-3 mt-2" role="alert" id="alert2">
                    <i class="fa-solid fa-triangle-exclamation fa-xl"></i>
                    <div style="font-weight: 500; font-size: medium;">
                        Vigencia en los primeros 5 días del mes !!!
                    </div>
                </div>
                <div class="mb-3" style="width: 98%; margin: 0 auto;">
                    <div class="row justify-content-center shadow-sm py-3">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="bg-label" for="desde">Desde</label>
                                <input type="date" class="form-control" id="desde">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="bg-label" for="hasta">Hasta</label>
                                <input type="date" class="form-control" id="hasta">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div style="height: 100%; display: flex;">
                                <input type="text" class="form-control" style="height: max-content; align-self: flex-end;" id="buscar" placeholder="Buscar plan de acción">
                            </div>
                        </div>
                    </div>
                </div>
                <div style="overflow: auto;" id="contenedorTablaPlanes">

                </div>
            </div>
            <div class="tab-pane fade p-2" id="reportes" role="tabpanel" aria-labelledby="nav-profile-tab">
                <h5 class="text-center" style="margin-bottom: 20px; font-weight: 400;">REPORTE - OBJETIVOS ESENCIALES</h5>
                <div class="row">
                    <div class="col-md-6">
                        <div class="card p-3">
                            <div class="form-group">
                                <label class="label-form" for="procesoReporte">Proceso</label>
                                <select id="procesoReporte" class="form-select">
    
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="bg-label" for="fechaReporte">Fecha</label>
                                <input type="date" class="form-control" id="fechaReporte">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card p-3">
                            <table class="table table-bordered" id="tablaReportes" style="border-color: #9ba0a5;">
                                <tbody>
                                    <tr>
                                        <th class="table-info" style="border-color: #9ba0a5;">Cantidad objetivos esenciales</th>
                                        <td class="text-center fw-bold-custom bg-bold" id="cantObj"></td>
                                    </tr>
                                    <tr>
                                        <th class="table-info" style="border-color: #9ba0a5;">Promedio de avance</th>
                                        <td class="text-center fw-bold-custom bg-bold" id="promeAvanc"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="row mt-3" style="margin-bottom: 30px;">
                    <div class="col-12">
                        <!-- <div class="card p-3"> -->
                            <table class="table table-bordered table-sm" id="tablaReportesDos" style="margin-bottom: 0; padding: 0; border-color: #9ba0a5;">
                                <thead>
                                    <tr>
                                        <th colspan="4" class="table-info" style="border-color: #9ba0a5;">Cantidad de acciones</th>
                                        <td colspan="2" class="text-center fw-bold-custom bg-bold" id="cantAcc"></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th class="table-info" style="border-color: #9ba0a5;">Estados</th>
                                        <td class="text-center">NO INICIADO</td>
                                        <td class="text-center">EN PROCESO</td>
                                        <td class="text-center">COMPLETADO</td>
                                        <td class="text-center">NO COMPLETADO</td>
                                        <td class="text-center">REPROGRAMADO</td>
                                    </tr>
                                    <tr>
                                        <th class="table-info" style="border-color: #9ba0a5;">Cantidad</th>
                                        <td class="text-center fw-bold-custom bg-bold" id="cantNoIni"></td>
                                        <td class="text-center fw-bold-custom bg-bold" id="cantEnPro"></td>
                                        <td class="text-center fw-bold-custom bg-bold" id="cantComple"></td>
                                        <td class="text-center fw-bold-custom bg-bold" id="cantNoComple"></td>
                                        <td class="text-center fw-bold-custom bg-bold" id="cantRepro"></td>
                                    </tr>
                                    <tr>
                                        <th class="table-info" style="border-color: #9ba0a5;">% Participación</th>
                                        <td class="text-center fw-bold-custom bg-bold" id="porcNoIni"></td>
                                        <td class="text-center fw-bold-custom bg-bold" id="porcEnPro"></td>
                                        <td class="text-center fw-bold-custom bg-bold" id="porcComple"></td>
                                        <td class="text-center fw-bold-custom bg-bold" id="porcNoComple"></td>
                                        <td class="text-center fw-bold-custom bg-bold" id="porcRepro"></td>
                                    </tr>                                           
                                </tbody>
                            </table>
                        <!-- </div> -->
                    </div>
                </div>
                <div style="margin-top: 30px; overflow: auto;">
                    <h5 class="text-center" style="margin-bottom: 20px; font-weight: 400;">REPORTE - ACCIONES CONCRETAS</h5>
                    <table class="table table-bordered table-sm" id="tablaAccionesReporte" style="border-color: #9ba0a5;">
                        <thead class="table-info" style="border-color: #9ba0a5;"> 
                            <tr>
                                <th>Acciones</th>
                                <th>Índice</th>
                                <th>Avance</th>
                                <th>Resultado</th>
                                <th>Estado</th>
                                <th>Fecha Inicial</th>
                                <th>Fecha Final</th>
                                <th>Responsable</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL DETALLE ACCIONES -->
    <div class="modal fade" id="modalPlanes" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" style="min-width: 90%;">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">
                        <h4 style="color: #055160; font-weight: 500;">Listado de acciones</h4>
                    </div>
                    <div class="d-flex justify-content-between align-items-center gap-3">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body">
                    <div style="overflow: auto;" id="tablaDetallePlan">

                    </div>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-primary" id="guardarAcciones" style="font-size: large;">
                            Guardar acciones
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js"></script>
    <script type="text/javascript" src="../resources/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.js"></script>
    <script type="text/javascript" src="../resources/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
    <script type="text/javascript" src="../lib/SweetAlert2_V10/dist/sweetalert2.min.js"></script>
    <script type="text/javascript" src="../resources/fontawesome-free-6.1.2-web/js/all.js"></script>
    <script type="text/javascript" src="../resources/select2/js/select2.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/handsontable@12.1.0/dist/handsontable.full.min.js"></script>
    <script type="text/javascript" src="../lib/js/servicios.js?<?php echo rand(); ?>"></script>
    <script type="text/javascript" src="../lib/js/funciones.js?<?php echo  rand(); ?>"></script>
    <script type="text/javascript" src="../controllers/PlanAccion.js?<?php echo  rand(); ?>"></script>
</body>

</html>