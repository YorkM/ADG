<?php session_start(); ?>
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>Eventos comerciales</title>
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

        #tablaDatosDetalle thead tr th {
            font-weight: 700;
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

        /* .w-input {
            width: 80%;
            background-color: #EEF7FF;
        }

        .w-input:focus {
            width: 80%;
            background-color: #EEF7FF;
        } */

        .error {
            background-color: #ffcccc !important;
        }

        .bg-label {
            font-weight: 500;
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
        <div class="alert alert-info mb-2" style="font-weight: 500; font-size: larger;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;11414 - PLAN MENSUAL DE ACCIONES</div>
        <nav class="row p-1">
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true"><i class="fa fa-pencil"></i>&nbsp;Creación</button>

                <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false"><i class="fa-solid fa-eye"></i>&nbsp;Seguimiento</button>
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
                    <!-- <h3 class="text-center mt-2 mb-4" style="color: #055160; font-weight: 400;">Creación plan mensual de acciones</h3> -->
                    <form class="" id="formulario">
                        <div class="row shadow-sm px-3 py-4" style="background-color: whitesmoke;">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="proceso">Proceso</label>
                                    <select name="PROCESO" id="proceso" class="form-select">

                                    </select>
                                </div>
                                <div class="form-group mt-2">
                                    <label for="periodo">Periodo</label>
                                    <select name="PERIODO" id="periodo" class="form-select">
                                        <option value="">Seleccione el Periodo</option>
                                        <option value="DIARIO">DIARIO</option>
                                        <option value="MENSUAL">MENSUAL</option>
                                        <option value="BIMESTRAL">BIMESTRAL</option>
                                        <option value="TRIMESTRAL">TRIMESTRAL</option>
                                        <option value="SEMESTRAL">SEMESTRAL</option>
                                        <option value="ANUAL">ANUAL</option>
                                    </select>
                                </div>
                                <div class="form-group mt-2">
                                    <label for="meta">Meta %</label>
                                    <input type="text" class="form-control" name="META" id="meta" placeholder="% Meta">
                                </div>
                                <div class="form-group mt-2">
                                    <label for="rango">Rango %</label>
                                    <div class="d-flex gap-2">
                                        <input type="text" class="form-control" name="RANGO_INICIAL" id="rangoIni" placeholder="% Rango Inicial">
                                        <input type="text" class="form-control" name="RANGO_FINAL" id="rangoFin" placeholder="% Rango Final">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="objetivos">Objetivos</label>
                                    <textarea name="OBJETIVOS" class="form-control form-control-sm bg-custom-input" id="objetivos"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="causaRaiz">Causa raíz</label>
                                    <textarea name="CAUSA_RAIZ" class="form-control form-control-sm bg-custom-input" id="causaRaiz"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="indicador">Indicador</label>
                                    <textarea name="INDICADOR" class="form-control form-control-sm bg-custom-input" id="indicador"></textarea>
                                </div>
                                <div class="d-flex align-items-baseline gap-5 mt-2">
                                    <p style="font-weight: 600;">ACCIONES</p>
                                    <button type="button" class="btn btn-primary btn-sm" id="btnAgregarAcciones" style="height: max-content;">
                                        <!-- <i class="fa-solid fa-circle-plus"></i> -->
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
                            <!-- <i class="fa-solid fa-floppy-disk"></i> -->
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
                            <!-- <i class="fa-solid fa-floppy-disk"></i> -->
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