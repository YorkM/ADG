<?php session_start(); ?>
<!doctype html>
<html>

<head>
    <meta http-equiv="Expires" content="0">
    <meta http-equiv="Last-Modified" content="0">
    <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <link rel="shortcut icon" href="">
    <meta charset="utf-8">
    <title>Business Intelligence</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DynaPuff:wght@500&display=swap" rel="stylesheet">
    <link href="../resources/fontawesome-free-6.1.2-web/css/fontawesome.min.css" rel="stylesheet" />
    <link href="../resources/fontawesome-free-6.1.2-web/css/v5-font-face.min.css" rel="stylesheet" />
    <link href="../resources/fontawesome-free-6.1.2-web/css/regular.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="../resources/select2-bootstrap4-theme/select2-bootstrap4.css">
    <link type="text/css" rel="stylesheet" href="../resources/bootstrap/bootstrap-5.0.2-dist/css/bootstrap.min.css">
    <link type="text/css" rel="stylesheet" href="../resources/plugins/jquery-ui/jquery-ui.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <link title="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" />
    <link href="../resources/niceadmin/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
    <link href="../resources/niceadmin/assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
    <link href="../resources/niceadmin/assets/vendor/quill/quill.snow.css" rel="stylesheet">
    <link href="../resources/niceadmin/assets/vendor/quill/quill.bubble.css" rel="stylesheet">
    <link href="../resources/niceadmin/assets/vendor/remixicon/remixicon.css" rel="stylesheet">
    <link rel="stylesheet" href="../resources/select2/css/select2.css">
    <link rel="stylesheet" href="../resources/datatable/datatables.min.css">
    <style>
        html,
        * {
            font-size: .9rem;
        }

        .btn-bar {
            width: 100px;
        }

        table {
            border-collapse: collapse;
        }

        #tablaDatos thead tr th {
            font-size: .8rem !important;
            font-weight: 500;
            color: #055160;
        }

        #tablaInfo thead tr th {
            font-size: .8rem !important;
            font-weight: 500;
            color: #055160;
        }

        th,
        td {
            padding: 0;
            line-height: 2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>
</head>

<body>
    <input type="hidden" id="rol" value="<?php echo !empty($_SESSION["ses_RolesId"]) ? $_SESSION["ses_RolesId"] : ''; ?>" disabled>
    <input type="hidden" id="UsrId" value="<?php echo !empty($_SESSION["ses_Id"]) ? $_SESSION["ses_Id"] : ''; ?>" disabled>
    <input type="hidden" id="oficina" value="<?php echo !empty($_SESSION["ses_OfcVentas"]) ? $_SESSION["ses_OfcVentas"] : ''; ?>" disabled>
    <input type="hidden" id="login_user" value="<?php echo !empty($_SESSION["ses_Login"]) ? $_SESSION["ses_Login"] : ''; ?>" disabled>
    <div id="main-content">
        <div class="alert alert-info mb-2" style="font-weight: 500;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0720 - BUSINESS INTELLIGENCE</div>
        <div class="row shadow-sm py-2 w-90 mx-auto mb-3 mt-2" id=barraFiltros>
            <input type="hidden" id="campoBandera" value="0">
            <div class="col-3">
                <div class="form-group">
                    <label for="seleccionarTabla">Tablas disponibles</label>
                    <select class="form-select form-select-sm" id="seleccionarTabla">
                        <option value="">Selección de tabla</option>
                        <option value="1">CONVENIOS</option>
                        <option value="2">INVENTARIOS</option>
                        <option value="3">ORDENES DE COMPRAS</option>
                        <option value="4">PRESUPUESTO COMPRAS</option>
                        <option value="5">PRESUPUESTO VENTAS</option>
                        <option value="6">REBATE</option>
                        <option value="7">VENTAS</option>
                    </select>
                </div>
            </div>
            <div class="col-4">
                <div class="form-group">
                    <label for="archivo">Cargar archivo</label>
                    <input type="file" class="form-control form-control-sm" accept=".csv" id="archivo">
                </div>
            </div>
            <div class="col-5 d-flex justify-content-evenly">
                <div class="d-flex">
                    <button class="btn btn-outline-primary btn-sm btn-bar align-self-end" title="Obtener información de la estructura de las tablas" id="btnInformacion">
                        <i class="fa-solid fa-circle-info"></i>
                        Información
                    </button>
                </div>
                <div class="d-flex">
                    <button class="btn btn-outline-warning btn-sm btn-bar align-self-end" title="Cargar" id="btnCargarDatos">
                        <i class="fa-solid fa-arrow-up-from-bracket"></i>
                        Cargar
                    </button>
                </div>
                <div class="d-flex">
                    <button class="btn btn-outline-success btn-sm btn-bar align-self-end" title="Guardar" id="btnGuardarDatos">
                        <i class="fa-solid fa-floppy-disk"></i>
                        Guardar
                    </button>
                </div>
                <div class="d-flex">
                    <button class="btn btn-outline-dark btn-sm btn-bar align-self-end" title="Limpiar" id="btnLimpiarDatos">
                        <i class="fa-solid fa-eraser"></i>
                        Limpiar
                    </button>
                </div>
            </div>
        </div>
        <p id="errorMessages" style="color: red; font-weight: bold;"></p>
        <div style="overflow: auto;">
            <table id="tablaDatos" class="table table-sm table-bordered table-hover" style="width: 100%;">
                <thead class="table-info">
                    <tr id="tableHeader"></tr>
                </thead>
                <tbody id="tableBody">

                </tbody>
            </table>
        </div>
    </div>
    <!-- MODAL -->
    <div class="modal fade" id="modalTablaInfo" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="min-width: 80%;">
            <div class="modal-content" style="background-color: whitesmoke;">
                <div class="modal-header">
                    <div class="modal-title">
                        <h5></h5>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h2>Estructura del archivo a cargar</h2>
                    <p>Asegúrate de que el archivo CSV contenga las siguientes columnas con los formatos correctos:</p>
                    <p>Nombre tabla: <span class="fw-bold" id="nombreTabla"></span></p>
                    <div style="overflow: auto;">
                        <table id="tablaInfo" class="table table-sm table-bordered table-hover" style="width: 100%;">
                            <thead class="table-info">
                                <tr>
                                    <th>N°</th>
                                    <th>COLUMNA</th>
                                    <th>TIPO DE DATO</th>
                                    <th>MAX. LONGITUD</th>
                                </tr>
                            </thead>
                            <tbody id="tableBodyInfo">

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript" src="../resources/plugins/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="../resources/plugins/jquery-ui/jquery-ui.js"></script>
    <script type="text/javascript" src="../resources/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.min.js"></script>
    <script src="../resources/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../resources/niceadmin/assets/vendor/chart.js/chart.umd.js"></script>
    <script src="../resources/niceadmin/assets/vendor/echarts/echarts.min.js"></script>
    <script src="../controllers/humana/Storage.js"></script>
    <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
    <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
    <script src="../resources/plugins/fullcalendar-6.1.10/dist/index.global.min.js"></script>
    <script src="../resources/select2/js/select2.full.min.js"></script>
    <script src="../resources/datatable/datatables.min.js"></script>
    <script type="module" src="../controllers/BusinessIntelligence.js?<?php echo (rand()); ?>"></script>
</body>

</html>