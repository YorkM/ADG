<?php session_start(); ?>
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>Seguimiento Incentivos</title>
    <link title="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" />
    <link type="text/css" rel="stylesheet" href="../resources/bootstrap/bootstrap-5.0.2-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <link type="text/css" rel="stylesheet" href="../resources/plugins/jquery-ui/jquery-ui.css" />
    <link rel="stylesheet" href="../resources/select2-bootstrap4-theme/select2-bootstrap4.css">
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

        .overflow {
            overflow: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        #tablaIncentivos thead tr th {
            font-size: 14px !important;
            font-weight: 400;
            color: #055160;
        }

        #tablaPorcentajes thead tr th {
            font-size: 14px !important;
            font-weight: 400;
            color: #055160;
        }

        #tablaResumen thead tr th {
            font-size: 14px !important;
            font-weight: 400;
            color: #055160;
        }

        #tablaResumen2 thead tr th {
            font-size: 14px !important;
            font-weight: 400;
            color: #055160;
        }

        #tablaLiquidacion thead tr th {
            font-size: 14px !important;
            font-weight: 400;
            color: #055160;
        }

        #tablaLiquidacionZonas thead tr th {
            font-size: 14px !important;
            font-weight: 400;
            color: #055160;
        }

        .text-green {
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

        .alinear {
            display: flex;
            justify-content: center;
        }

        .custom-td {
            font-size: 13px !important;
        }

        .custom-td-2 {
            font-size: 14px;
        }

        .custom-btn {
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
        }

        .custom-fa {
            font-size: 13px;
            margin: 0;
        }
    </style>
</head>

<body>
    <input type="hidden" id="rol" value="<?php echo !empty($_SESSION["ses_RolesId"]) ? $_SESSION["ses_RolesId"] : ''; ?>" disabled>
    <input type="hidden" id="UsrId" value="<?php echo !empty($_SESSION["ses_Id"]) ? $_SESSION["ses_Id"] : ''; ?>" disabled>
    <input type="hidden" id="oficinaHidden" value="<?php echo !empty($_SESSION["ses_OfcVentas"]) ? $_SESSION["ses_OfcVentas"] : ''; ?>" disabled>
    <input type="hidden" id="login_user" value="<?php echo !empty($_SESSION["ses_Login"]) ? $_SESSION["ses_Login"] : ''; ?>" disabled>
    <input type="hidden" id="numOrg" value="<?php echo !empty($_SESSION["ses_NumOrg"]) ? $_SESSION["ses_NumOrg"] : ''; ?>" disabled>

    <div class="alert alert-info mb-2" style="font-weight: 400;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0126 - SEGUIMIENTO INCENTIVOS</div>

    <div class="container-fluid">
        <nav class="row p-1">
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true"><i class="fa fa-pencil"></i>&nbsp;Creación</button>

                <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false"><i class="fa-solid fa-eye"></i>&nbsp;Seguimiento Incentivo</button>

                <button class="nav-link" id="nav-profile-tab-2" data-bs-toggle="tab" data-bs-target="#nav-profile-2" type="button" role="tab" aria-controls="nav-profile-2" aria-selected="false"><i class="fa-solid fa-sack-dollar"></i>&nbsp;Liquidación FDV</button>

                <button class="nav-link" id="nav-profile-tab-3" data-bs-toggle="tab" data-bs-target="#nav-profile-3" type="button" role="tab" aria-controls="nav-profile-3" aria-selected="false"><i class="fa-solid fa-rectangle-list"></i>&nbsp;Resumen</button>
            </div>
        </nav>
        <div class="tab-content " id="nav-tabContent">
            <div class="tab-pane fade show active p-2" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <!-- CAMPOS PRINCIPALES SEGUIMIENTO INCENTIVOS -->
                <div class="row px-4">
                    <div class="col-md-6">
                        <div class="row align-items-center mb-2">
                            <div class="col-md-3">
                                <label for="oficina">Oficina Ventas</label>
                            </div>
                            <div class="col-12 col-md-9">
                                <select class="form-select form-select-sm" id="oficina">

                                </select>
                            </div>
                        </div>
                        <div class="row align-items-center mb-2">
                            <div class="col-12 col-md-3">
                                <label for="proveedor">Proveedor - GA</label>
                            </div>
                            <div class="col-md-9">
                                <select class="form-select form-select-sm" id="proveedor" multiple="multiple">

                                </select>
                            </div>
                        </div>
                        <div class="row align-items-center mb-2">
                            <div class="col-md-3">
                                <label for="cuotaValores">Cuota en Valores</label>
                            </div>
                            <div class="col-md-9">
                                <input type="text" class="form-control form-control-sm" placeholder="Cuota en Valores" id="cuotaValores">
                            </div>
                        </div>
                        <div class="row align-items-center mb-2">
                            <div class="col-md-3">
                                <label for="cuotaImpactos">Cuota en Impactos</label>
                            </div>
                            <div class="col-md-9">
                                <input type="text" class="form-control form-control-sm" placeholder="Cuota en Impactos" id="cuotaImpactos">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="row align-items-center mb-2">
                            <div class="col-md-3">
                                <label for="seguimiento">Tipo Seguimiento</label>
                            </div>
                            <div class="col-md-9">
                                <select class="form-select form-select-sm" id="seguimiento">
                                    <option disabled selected>Seleccione tipo seguimiento</option>
                                    <option value="COSTO">COSTO</option>
                                    <option value="VALOR NETO">VALOR NETO</option>
                                </select>
                            </div>
                        </div>
                        <div class="row align-items-center mb-2">
                            <div class="col-md-3">
                                <label for="fechaInicial">Fecha Inicial</label>
                            </div>
                            <div class="col-md-9">
                                <input type="text" class="form-control form-control-sm" id="fechaInicial">
                            </div>
                        </div>
                        <div class="row align-items-center mb-2">
                            <div class="col-md-3">
                                <label for="fechaFinal">Fecha Final</label>
                            </div>
                            <div class="col-md-9">
                                <input type="text" class="form-control form-control-sm" id="fechaFinal">
                            </div>
                        </div>
                        <div class="row align-items-center mb-2">
                            <div class="col-md-3">

                            </div>
                            <div class="col-md-9">
                                <button class="btn btn-outline-primary btn-sm w-100" id="guardarDatos">Guardar Datos Base</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- TABLA DE INCENTIVOS EN SEGUIMIENTO -->
                <div class="overflow mt-3" id="contenedorTablaIncentivos">
                    <table class="table table-bordered table-hover table-sm" id="tablaIncentivos">
                        <thead class="table-info">
                            <tr>
                                <th>N°</th>
                                <th>OFICINA VENTAS</th>
                                <th>PROVEEDOR - GA</th>
                                <th>PROVEEDORES</th>
                                <th>DESCRIPCIÓN</th>
                                <th>CUOTA EN VALORES</th>
                                <th>CUOTA EN IMPACTOS</th>
                                <th>TIPO DE SEGUIMIENTO</th>
                                <th>FECHA INICIO</th>
                                <th>FECHA FINAL</th>
                                <th class="text-center">SEGUIMIENTO</th>
                                <th class="text-center">EDITAR</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
            <div class="tab-pane fade p-2" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                <h5 class="text-center text-green">SEGUIMIENTO INCENTIVO - LIQUIDACIÓN PROVEEDOR</h5>
                <div class="overflow mt-3 mb-3">
                    <table class="table table-bordered table-sm" id="tablaPorcentajes">
                        <thead class="table-info">
                            <tr>
                                <th>CUOTA EN VALORES</th>
                                <th>CUOTA ACTUAL</th>
                                <th>CUOTA EN IMPACTOS</th>
                                <th>IMPACTO ACTUAL</th>
                                <th>DIFERECIA FALTANTE EN VALORES</th>
                                <th>DIFERECIA FALTANTE EN IMPACTOS</th>
                                <th>% CUMPLIMIENTO CUOTA</th>
                                <th>% CUMPLIMIENTO IMPACTOS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="custom-td-2" id="cuota"></td>
                                <td class="custom-td-2" id="cuotaActual"></td>
                                <td class="custom-td-2" id="impacto"></td>
                                <td class="custom-td-2" id="impactoActual"></td>
                                <td class="custom-td-2" id="difCuota"></td>
                                <td class="custom-td-2" id="difImpacto"></td>
                                <td class="custom-td-2" id="porcCuota"></td>
                                <td class="custom-td-2" id="porcImpacto"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h5 class="text-center text-green">RESUMEN POR PROVEEDOR - POR ZONAS DE VENTAS</h5>
                <div class="overflow mt-3 mb-3">
                    <table class="table table-bordered table-hover table-sm mx-auto" id="tablaResumen" style="width: 60%;">
                        <thead class="table-info">
                            <tr>
                                <th>RAPPELS</th>
                                <th>SEGUIMIENTO INCENTIVOS</th>
                                <th colspan="3" id="descProveedor" style="font-size: 14px !important;"></th>
                            </tr>
                            <tr>
                                <td colspan="6" style="background-color: white;"></td>                                
                            </tr>
                            <tr>
                                <th>ZONA</th>
                                <th>NOMBRE ZONA</th>
                                <th>CANTIDAD</th>
                                <th>CANTIDAD IMPACTOS</th>
                                <th>SUMA DE VALOR NETO</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                        <tfoot class="table-info">
                            <tr>
                                <td class="text-green">TOTAL GENERAL</td>
                                <td></td>
                                <td class="text-green" id="totalCantidad"></td>
                                <td class="text-green" id="totalImpactos"></td>
                                <td class="text-green" id="totalResumen"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>               
            </div>
            <div class="tab-pane fade p-2" id="nav-profile-2" role="tabpanel" aria-labelledby="nav-profile-tab">
                <input type="hidden" id="seguimientoOculto">               
                <h5 class="text-center text-green mb-3">GESTIONAR DATOS NOTA CRÉDITO</h5>
                <div style="width: 98%; margin: 0 auto;">
                    <div class="row justify-content-center mb-2" style="border: 1px solid #ccc; padding: 15px; border-radius: 5px;">
                        <div class="col-md-5">
                            <div class="form-group">
                                <label for="numeroNota">Número Nota</label>
                                <input type="text" class="form-control form-control-sm shadow-sm" id="numeroNota" placeholder="Ingrese Número de la Nota">
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="form-group">
                                <label for="valorNota">Valor Nota</label>
                                <input type="text" class="form-control form-control-sm shadow-sm" id="valorNota" placeholder="Ingrese Valor de la Nota">
                            </div>
                        </div>
                        <div class="col-md-2 align-self-end">
                            <button class="btn btn-outline-primary btn-sm w-100" id="guardarNota">Guardar</button>
                        </div>
                    </div>
                </div>
                <h5 class="text-center text-green mb-3 mt-5">LIQUIDACIÓN FDV - BENEFICIARIOS</h5>
                <div class="overflow mt-3 mb-3" id="contenedorTablaLiquidacion">
                    
                </div>               
                <div class="overflow mt-3 mb-3" id="contenedorTablaLiquidacionZonas">
                    
                </div>               
            </div>
            <div class="tab-pane fade p-2" id="nav-profile-3" role="tabpanel" aria-labelledby="nav-profile-tab">
                <div class="overflow mt-3 mb-3" id="contenedorTablaResumen">
                    
                </div>               
            </div>
        </div>
    </div>
    <!-- MODAL --> 
    <div class="modal fade" id="modalSeguimiento" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="min-width: 50%;">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">
                        <h5>Actualizar Datos</h5>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding-bottom: 30px;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="cuotaValor">Cuota en Valores</label>
                                <input type="text" class="form-control form-control-sm" id="cuotaValor">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="cuotaImpacto">Cuota en Impactos</label>
                                <input type="text" class="form-control form-control-sm" id="cuotaImpacto">
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="fechaInicioEdi">Fecha Inicio</label>
                                <input type="date" class="form-control form-control-sm" id="fechaInicioEdi">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="fechaFinalEdi">Fecha Final</label>
                                <input type="date" class="form-control form-control-sm" id="fechaFinalEdi">
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12 align-self-end">
                            <button class="btn btn-outline-primary btn-sm w-100" id="actualizarDatos">Actualizar</button>
                        </div>
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
    <script src="../resources/select2/js/select2.full.min.js"></script>
    <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
    <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
    <script type="module" src="../controllers/SeguimientoIncentivos.js?<?php echo (rand()); ?>"></script>
</body>

</html>