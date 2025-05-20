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
    <title>Seguimiento Incentivos</title>
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
    <style>
        html,
        * {
            font-size: .95rem;
        }

        label {
            font-weight: 500;
            font-size: 14px;
        }

        /* table {
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
        } */
    </style>
</head>

<body>
    <input type="hidden" id="rol" value="<?php echo !empty($_SESSION["ses_RolesId"]) ? $_SESSION["ses_RolesId"] : ''; ?>" disabled>
    <input type="hidden" id="UsrId" value="<?php echo !empty($_SESSION["ses_Id"]) ? $_SESSION["ses_Id"] : ''; ?>" disabled>
    <input type="hidden" id="oficinaHidden" value="<?php echo !empty($_SESSION["ses_OfcVentas"]) ? $_SESSION["ses_OfcVentas"] : ''; ?>" disabled>
    <input type="hidden" id="login_user" value="<?php echo !empty($_SESSION["ses_Login"]) ? $_SESSION["ses_Login"] : ''; ?>" disabled>

    <div class="alert alert-info mb-2" style="font-weight: 400;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0126 - SEGUIMIENTO INCENTIVOS</div>
    
    <div class="row mt-4 px-4">
        <div class="col-md-6">
            <div class="row align-items-center mb-3">
                <div class="col-md-3">
                    <label for="oficina">Oficina Ventas</label>
                </div>
                <div class="col-md-9">
                    <select class="form-select form-select-sm" id="oficina"></select>
                </div>
            </div>   
            <div class="row align-items-center mb-3">
                <div class="col-md-3">
                    <label for="zonaVentas">Zona Ventas</label>
                </div>
                <div class="col-md-9">
                    <select class="form-select form-select-sm" id="zonaVentas"></select>
                </div>
            </div>   
            <div class="row align-items-center mb-3">
                <div class="col-md-3">
                    <label for="proveedor">Proveedor - GA</label>
                </div>
                <div class="col-md-9">
                    <select class="form-select form-select-sm" id="proveedor"></select>
                </div>
            </div>   
            <div class="row align-items-center mb-3">
                <div class="col-md-3">
                    <label for="cuotaValores">Cuota en Valores</label>
                </div>
                <div class="col-md-9">
                    <input type="text" class="form-control form-control-sm" id="cuotaValores">
                </div>
            </div>   
        </div>
        <div class="col-md-6">
            <div class="row align-items-center mb-3">
                <div class="col-md-3">
                    <label for="cuotaImpactos">Cuota en Impactos</label>
                </div>
                <div class="col-md-9">
                    <input type="text" class="form-control form-control-sm" id="cuotaImpactos">
                </div>
            </div>
            <div class="row align-items-center mb-3">
                <div class="col-md-3">
                    <label for="seguimiento">Seguimiento</label>
                </div>
                <div class="col-md-9">
                    <select class="form-select form-select-sm" id="seguimiento">
                        <option disabled selected>Seleccione tipo seguimiento</option>
                        <option value="1">COSTO</option>
                        <option value="2">VALOR NETO</option>
                    </select>
                </div>
            </div>   
            <div class="row align-items-center mb-3">
                <div class="col-md-3">
                    <label for="fechaInicial">Fecha Inicial</label>
                </div>
                <div class="col-md-9">
                    <input type="text" class="form-control form-control-sm" id="fechaInicial">
                </div>
            </div>   
            <div class="row align-items-center mb-3">
                <div class="col-md-3">
                    <label for="fechaFinal">Fecha Final</label>
                </div>
                <div class="col-md-9">
                    <input type="text" class="form-control form-control-sm" id="fechaFinal">
                </div>
            </div>             
        </div>
    </div>
    <!-- MODAL -->
    <div class="modal fade" id="" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="min-width: 80%;">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">
                        <h5></h5>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

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
    <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
    <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
    <script src="../resources/select2/js/select2.full.min.js"></script>
    <script type="module" src="../controllers/SeguimientoIncentivos.js?<?php echo (rand()); ?>"></script>
</body>

</html>