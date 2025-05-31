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
            font-size: 15px !important;
            font-weight: 400;
            color: #055160;
        }

        #tablaPorcentajes thead tr th {
            font-size: 15px !important;
            font-weight: 400;
            color: #055160;
        }

        #tablaResumen thead tr th {
            font-size: 15px !important;
            font-weight: 400;
            color: #055160;
        }

        #tablaLiquidacion thead tr th {
            font-size: 15px !important;
            font-weight: 400;
            color: #055160;
        }

        #tablaLiquidacionZonas thead tr th {
            font-size: 15px !important;
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
            font-size: 13px;
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

    <div>
        <nav class="row p-1">
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true"><i class="fa fa-pencil"></i>&nbsp;Creación</button>

                <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false"><i class="fa-solid fa-eye"></i>&nbsp;Seguimiento Incentivo</button>

                <button class="nav-link" id="nav-profile-tab-2" data-bs-toggle="tab" data-bs-target="#nav-profile-2" type="button" role="tab" aria-controls="nav-profile-2" aria-selected="false"><i class="fa-solid fa-sack-dollar"></i>&nbsp;Liquidación FDV</button>
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
                                <select class="form-select form-select-sm" id="proveedor">

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
                                <th>Oficina Ventas</th>
                                <th>Proveedor - GA</th>
                                <th>Descripción</th>
                                <th>Cuota en Valores</th>
                                <th>Cuota en Impactos</th>
                                <th>Tipo Seguimiento</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Final</th>
                                <th class="text-center">Seguimiento</th>
                                <th class="text-center">Editar</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
            <div class="tab-pane fade p-2" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                <h4 class="text-center text-green">Seguimiento Incentivo - Liquidación Proveedor</h4>
                <div class="overflow mt-3 mb-3">
                    <table class="table table-bordered table-sm" id="tablaPorcentajes">
                        <thead class="table-info">
                            <tr>
                                <th>Cuota en Valores</th>
                                <th>Cuota Actual</th>
                                <th>Cuota en Impactos</th>
                                <th>Impacto Actual</th>
                                <th>Diferencia Faltante en Valores</th>
                                <th>Diferencia Faltante en Impactos</th>
                                <th>% Cumplimiento Cuota</th>
                                <th>% Cumplimiento Impactos</th>
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
                <h4 class="text-center text-green">Resumen por Proveedor - Por Zonas de Ventas</h4>
                <div class="overflow mt-3 mb-3">
                    <table class="table table-bordered table-sm mx-auto" id="tablaResumen" style="width: 60%;">
                        <thead class="table-info">
                            <tr>
                                <th>Rappels</th>
                                <th>Seguimiento Incentivo</th>
                                <th colspan="3" id="descProveedor" style="font-size: 14px !important;"></th>
                            </tr>
                            <tr>
                                <td colspan="6" style="background-color: white;"></td>                                
                            </tr>
                            <tr>
                                <th>Zona</th>
                                <th>Nombre Zona</th>
                                <th>Cantidad</th>
                                <th>Suma de Valor Neto</th>
                                <th>Cantidad Impactos</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                        <tfoot class="table-info">
                            <tr>
                                <td class="text-green">TOTAL GENERAL</td>
                                <td></td>
                                <td class="text-green" id="totalCantidad"></td>
                                <td class="text-green" id="totalResumen"></td>
                                <td class="text-green" id="totalImpactos"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>               
            </div>
            <div class="tab-pane fade p-2" id="nav-profile-2" role="tabpanel" aria-labelledby="nav-profile-tab">
                <input type="hidden" id="seguimientoOculto">               
                <h4 class="text-center text-green mb-3">Gestionar Datos Nota Crédito</h4>
                <div class="shadow-sm" style="width: 98%; margin: 0 auto;">
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
                <h4 class="text-center text-green mb-3 mt-5">Liquidación FDV - Beneficiarios</h4>
                <div class="overflow mt-3 mb-3" id="contenedorTablaLiquidacion">
                    
                </div>               
                <div class="overflow mt-3 mb-3" id="contenedorTablaLiquidacionZonas">
                    
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
    <script src="../resources/select2/js/select2.full.min.js"></script>
    <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
    <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
    <script type="module" src="../controllers/SeguimientoIncentivos.js?<?php echo (rand()); ?>"></script>
</body>

</html>