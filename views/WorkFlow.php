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
    <title>WorkFlow</title>
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

        #tablaSolicitudes tbody tr td {
            font-size: .70rem !important;
            vertical-align: middle;
        }

        table thead tr th {
            font-size: .95rem !important;
            font-weight: 500;
            vertical-align: middle;
            color: #055160;
        }

        .timeline-container {
            width: 80%;
            max-width: 800px;
            position: relative;
        }

        .timeline::before {
            content: "";
            position: absolute;
            left: 50%;
            width: 4px;
            background: linear-gradient(to bottom, #6a11cb, #2575fc);
            height: 100%;
            top: 0;
            transform: translateX(-50%);
            border-radius: 2px;
        }

        .timeline-item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 40px;
            position: relative;
        }

        .timeline-item[data-position="right"] {
            justify-content: flex-end;
        }

        .timeline-avatar {
            width: 40px;
            height: 40px;
            background: #007bff;
            color: white;
            font-weight: bold;
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid white;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            font-family: 'Poppins', sans-serif;
        }

        .timeline-item[data-position="right"] .timeline-avatar {
            left: auto;
            right: 50%;
            transform: translate(50%, 0);
        }

        .timeline-content {
            width: 46%;
            position: relative;
        }

        input[type="file"] {
            padding: 3px 10px;
        }

        label {
            font-size: 12px;
        }

        .estados {
            background-color: #0A97B0;
            width: 75px;
            padding: 5px 0;
            color: black;
            font-weight: 700;
            font-size: 9px;
        }

        .btn-gestionar {
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .btn-disabled {
            background-color: #ccc;
            border: none;
        }

        #tablaSolicitudes>tbody>tr.odd,
        #tablaSolicitudes>tbody>tr.even {
            cursor: pointer;
        }

        hr {
            height: .5px !important
        }

        .card-chat {
            width: 80%;
            background-color: rgba(180, 180, 180, 0.22);
            border-radius: 8px;
            padding: 10px;
            margin: 10px auto;
        }

        #btnModalAddSolic,
        #btnRefrescar {
            width: 120px;
            padding: 5px 0;
            background-color: #055160;
            border: 1px solid #055160;
            color: white;
            font-size: 14px;
            border-radius: 3px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            height: 28px;
        } 
    </style>
</head>

<body>
    <input type="hidden" id="rol" value="<?php echo !empty($_SESSION["ses_RolesId"]) ? $_SESSION["ses_RolesId"] : ''; ?>" disabled>
    <input type="hidden" id="UsrId" value="<?php echo !empty($_SESSION["ses_Id"]) ? $_SESSION["ses_Id"] : ''; ?>" disabled>
    <input type="hidden" id="oficina" value="<?php echo !empty($_SESSION["ses_OfcVentas"]) ? $_SESSION["ses_OfcVentas"] : ''; ?>" disabled>   
    <!-- CONTENIDO PRINCIPAL -->
    <div id="main-content">
        <div class="alert alert-info mb-2" style="font-weight: 500;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0417 - WORKFLOW</div>
        <div class="row shadow-sm py-2 w-90 mx-auto mb-3 mt-2" id=barraFiltros>
            <div class="col-3">
                <select class="form-select form-select-sm" id="filtroOficina">

                </select>
            </div>
            <div class="col-2">
                <select class="form-select form-select-sm" id="filtroDepartamentos">

                </select>
            </div>
            <div class="col-2">
                <div class="input-group">
                    <span style="background-color: #cff4fc; color: #055160; font-weight: bold; display: flex; align-items: center; gap: 8px; padding: 0 5px;">
                        <i class="fa-solid fa-calendar-days"></i>Desde
                    </span>
                    <input type="text" id="fechaDesde" class="form-control form-control-sm" readonly>
                </div>
            </div>
            <div class="col-2">
                <div class="input-group">
                    <span style="background-color: #cff4fc; color: #055160; font-weight: bold; display: flex; align-items: center; gap: 8px; padding: 0 5px;">
                        <i class="fa-solid fa-calendar-days"></i>Hasta
                    </span>
                    <input type="text" id="fechaHasta" class="form-control form-control-sm" readonly>
                </div>
            </div>
            <div class="col-3">        
                <div class="d-flex justify-content-end gap-3">
                    <button id="btnModalAddSolic">
                        Agregar
                        <i class="fa-solid fa-circle-plus"></i>
                    </button>
                    <button id="btnRefrescar">
                        Refrescar
                        <i class="fa-solid fa-rotate"></i>
                    </button>
                </div>
            </div>
        </div>
        <table id="tablaSolicitudes" class="table table-sm table-borderless table-hover" style="width: 100%;">
            <thead class="table-info">

            </thead>
            <tbody>

            </tbody>
        </table>
    </div>
    <!-- MODAL CREAR SOLICITUD -->
    <div class="modal fade" id="modalAgregarSolicitud" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="min-width: 70%;">
            <div class="modal-content" style="background-color: whitesmoke;">
                <div class="modal-header">
                    <h3 class="modal-title text-primary" id="exampleModalLabel">Crear solicitud</h3>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- FORMULARIO -->
                    <form id="formCrearSolicitud" class="needs-validation" novalidate>
                        <!-- CAMPOS OCULTOS IMPORTANTE -->
                        <div class="row py-2 w-90 mx-auto">
                            <div class="col">
                                <div class="form-group d-none">
                                    <label for="organizacion">Organización ventas<span class="text-danger h5">*</span></label>
                                    <select class="form-control" id="organizacion" name="ORGANIZACION_VENTAS" disabled>
                                        <option value="">--Seleccione una organización--</option>
                                        <option value="2000">ROMA</option>
                                        <option value="1000">COMERCIALIZADORA MULTIDROGRAS</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group d-none">
                                    <label for="oficina">Oficina ventas<span class="text-danger h5">*</span></label>
                                    <select class="form-control" id="oficina_solicitante" name="OFICINA_VENTAS" disabled>

                                    </select>
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group d-none">
                                    <label for="estado_solicitud">Estado</label>
                                    <input type="text" class="form-control" value="S" id="estado_solicitud" name="ESTADO" disabled>
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group d-none">
                                    <label for="usuario_solicitante">Usuario</label>
                                    <input type="text" class="form-control" id="usuario_solicitante" name="USUARIO_SOLICITA" disabled>
                                </div>
                            </div>
                        </div>
                        <!-- TIPOS Y CONCEPTOS DE GASTOS -->
                        <div class="row shadow-sm py-2 w-90 mx-auto mt-2 mb-4">
                            <div class="col">
                                <div class="form-group">
                                    <label for="tipoGasto">Tipo de gasto<span class="text-danger h5">*</span></label>
                                    <select class="form-control form-control-sm" name="TIPO_GASTO" id="tipoGasto">
                                        <option value="">--Seleccione un tipo de gasto</option>
                                        <option value="1">COTIZACIÓN</option>
                                        <option value="2">FACTURA DIRECTA</option>
                                        <option value="3">ANTICIPO</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="conceptoFormulario">Concepto solicitud<span class="text-danger h5">*</span></label>
                                    <div class="d-flex">
                                        <select class="form-control form-control-sm" style="border-radius: 3px 0 0 3px;" id="conceptoFormulario" name="CONCEPTO_GASTO">

                                        </select>
                                        <button type="button" id="btnAbrirModal" class="btn btn-primary btn-sm" style="border-radius: 0 3px 3px 0;" title="Agregar concepto">
                                            <i class="fa-solid fa-circle-plus" style="font-size: 15px;"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- COTIZACIONES -->
                        <div class="row shadow-sm py-2 w-90 mx-auto mb-4" id="cotizaciones">
                            <div class="col" id="inputTipoAnticipo">
                                <div class="form-group">
                                    <label for="tipoAnticipo">Tipo anticipo<span class="text-danger h5">*</span></label>
                                    <select class="form-control form-control-sm" name="TIPO_ANTICIPO" id="tipoAnticipo">
                                        <option value="">--Seleccione un tipo de anticipo</option>
                                        <option value="1">CON COTIZACIÓN</option>
                                        <option value="2">LEGALIZACIÓN GASTOS DE VIAJE</option>
                                        <option value="3">SIN COTIZACIÓN</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col" id="inputValorAnticipo">
                                <div class="form-group">
                                    <label for="valorAnticipo1">Valor anticipo<span class="text-danger h5">*</span></label>
                                    <input type="text" class="form-control form-control-sm" placeholder="Valor anticipo" id="valorAnticipo1" name="VALOR_ANTICIPO">
                                </div>
                            </div>
                            <div class="col" id="inputNumeroPreliminar">
                                <div class="form-group">
                                    <label for="numeroPreliminar2">Número preliminar<span class="text-danger h5">*</span></label>
                                    <input type="text" class="form-control form-control-sm" placeholder="Número preliminar" id="numeroPreliminar2" name="NUMERO_PRELIMINAR">
                                </div>
                            </div>
                            <div class="col" id="inputArchivo1">
                                <div class="form-group">
                                    <label id="label1" for="adjunto_1">Adjuntar cotización 1<span class="text-danger h5">*</span></label>
                                    <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjunto_1" name="ADJUNTO_SOLICITA_1">
                                </div>
                            </div>
                            <div class="col" id="inputArchivo2">
                                <div class="form-group">
                                    <label id="label2" for="adjunto_2">Adjuntar cotización 2</label>
                                    <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjunto_2" name="ADJUNTO_SOLICITA_2">
                                </div>
                            </div>
                            <div class="col" id="inputArchivo3">
                                <div class="form-group">
                                    <label id="label3" for="adjunto_3">Adjuntar cotización 3</label>
                                    <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjunto_3" name="ADJUNTO_SOLICITA_3">
                                </div>
                            </div>
                        </div>
                        <!-- DATOS FACTURA -->
                        <div class="row shadow-sm py-2 w-90 mx-auto mb-4" id="datosFactura">
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="fechaFactura">Fecha factura<span class="text-danger h5">*</span></label>
                                    <input type="date" class="form-control form-control-sm" id="fechaFactura" placeholder="Fecha factura" name="FECHA_DOCUMENTO">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="numeroDocumento">Número documento<span class="text-danger h5">*</span></label>
                                    <input type="text" class="form-control form-control-sm" id="numeroDocumento" placeholder="Número documento" name="NUMERO_DOCUMENTO">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="razonSocial">Razón social(NIT)<span class="text-danger h5">*</span></label>
                                    <input type="text" class="form-control form-control-sm" id="razonSocial" placeholder="Razón social" name="NIT">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="subTotalFactura">Subtotal factura<span class="text-danger h5">*</span></label>
                                    <input type="text" class="form-control form-control-sm" id="subTotalFactura" placeholder="Subtotal factura" name="SUBTOTAL_DOCUMENTO">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="iva">Iva</label>
                                    <input type="text" class="form-control form-control-sm" id="iva" value="0" placeholder="Iva" name="IVA_DOCUMENTO">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="valorFactura">Total factura<span class="text-danger h5">*</span></label>
                                    <input type="text" class="form-control form-control-sm" id="valorFactura" placeholder="Total factura" name="VALOR_DOCUMENTO">
                                </div>
                            </div>
                        </div>
                        <!-- COMENTARIO SOLICITUD -->
                        <div class="row shadow-sm py-2 w-90 mx-auto mb-4">
                            <div class="col">
                                <div class="form-group">
                                    <label for="comentario_solicitante">Comentario solicitud<span class="text-danger h5">*</span></label>
                                    <textarea rows="2" class="form-control" style="background-color: #FFF6D7;" placeholder="Describe los criterios de tu solicitud" id="comentario_solicitante" name="COMENTARIO_SOLICITA"></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-outline-primary" id="btnVerTablaGastos">Ver tabla de gastos</button>
                    <button type="button" class="btn btn-outline-success" id="btnGuardar">Guardar solicitud</button>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL CREAR CONCEPTO -->
    <div class="modal fade" id="modalAgregarConcepto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="min-width: 50%;">
            <div class="modal-content" style="background-color: whitesmoke;">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="text" class="form-control form-control-sm" placeholder="Escriba el concepto que desea agregar" id="conceptoModal">
                    <button type="button" class="btn btn-primary btn-sm mt-2" id="btnAgregarConcepto">Agregar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL GESTIONAR SOLICITUD. -->
    <div class="modal fade" id="modalGestionarSolicitud" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" style="min-width: 70%; background-color: #ddd;">
            <div class="modal-content" style="background-color: whitesmoke;">
                <div class="modal-header">
                    <h3 class="modal-title text-primary" id="exampleModalLabel">Gestionar solicitud</h3>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <!-- SECCIÓN DATOS INFO -->
                <div class="modal-body">
                    <input type="hidden" id="idOcultoSolicitud">
                    <input type="hidden" id="estadoOcultoSolicitud">
                    <div class="row" id="infoSolicitud">
                        <input type="hidden" id="tipoGastoInfo">
                        <input type="hidden" id="usuarioInfo">
                        <div class="col-4 form-group mb-2">
                            <label class="form-label">Usuario</label>
                            <input type="text" class="form-control form-control-sm" style="font-size: 10.5px;" id="usuarioInfoM" disabled>
                        </div>
                        <div class="col-2 form-group mb-2">
                            <label class="form-label">Departamento</label>
                            <input type="text" class="form-control form-control-sm" style="font-size: 10.5px;" id="departamentoInfo" disabled>
                        </div>
                        <div class="col-3 form-group">
                            <label class="form-label">Tipo gasto</label>
                            <input type="text" class="form-control form-control-sm" style="font-size: 10.5px;" id="tipoGastoInfoM" disabled>
                        </div>
                        <div class="col-3 form-group">
                            <label class="form-label">Fecha solicitud</label>
                            <input type="text" class="form-control form-control-sm" style="font-size: 10.5px;" id="fechaInfo" disabled>
                        </div>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-center align-items-center" style="margin-top: 20px; margin-bottom: 20px;" id="divBtnRestaurar">
                        <button class="btn btn-outline-primary btn-sm" id="btnRestaurar">Restaurar solicitud</button>
                    </div>
                    <!-- SECCIÓN ADMIN -->
                    <div class="row justify-content-center mb-3" id="sectionAdmin">
                        <div class="col-10">
                            <h5>Gerencia administrativa</h5>
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <div class="d-none card-title position-relative" id="checkAdmin">
                                        <span class="position-absolute top-0 start-100 translate-middle">
                                            <i class="fa-regular fa-circle-check fa-2x text-success" style="margin-top: -10px; margin-right: -10px;"></i>
                                        </span>
                                    </div>
                                    <div class="d-none alert alert-danger alert-dismissible fade show  d-flex align-items-center" role="alert" id="alerta1">
                                        <div>
                                            <strong>Rechazado!</strong> You should check in on some of those fields below.
                                        </div>
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                    <div class="form-group d-none" id="fechaAutorizacionDiv">
                                        <label class="form-label" for="fechaAutorizacion">Fecha Autorización</label>
                                        <input type="text" class="form-control form-control-sm" placeholder="Fecha Autorización" id="fechaAutorizacion" disabled>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label" for="comentarioAutoriza">Comentario</label>
                                        <textarea class="form-control form-control-sm" style="background-color: #FFF6D7;" id="comentarioAutoriza"></textarea>
                                    </div>
                                    <fieldset class="form-group">
                                        <div class="row">
                                            <small id="textArchivos">Seleccione uno de los archivos adjuntos</small>
                                            <div class="col-sm-8">
                                                <div class="d-flex align-items-baseline gap-2 mt-2" id="adjCheck1">
                                                    <div class="form-check" id="gridRadios1Div">
                                                        <label class="form-check-label" for="gridRadios1">1</label>
                                                        <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="1">
                                                    </div>
                                                    <div style="display: flex; align-items: center; gap: 40px;">
                                                        <button id="btnVerAdj1" class="btn btn-outline-primary btn-sm"
                                                            style="width: 50px; height: 24px; gap: 2px; display: flex; align-items: center;">
                                                            <i class="fa-solid fa-file"></i>
                                                            Ver
                                                        </button>                                             
                                                        <div class="form-group" id="adjunto1ModalDiv">
                                                            <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjunto1Modal">
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="d-flex align-items-baseline gap-2 mt-2" id="adjCheck2">
                                                    <div class="form-check" id="gridRadios2Div">
                                                        <label class="form-check-label" for="gridRadios1">2</label>
                                                        <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="2">
                                                    </div>
                                                    <div style="display: flex; align-items: center; gap: 40px;">
                                                        <button id="btnVerAdj2" class="btn btn-outline-primary btn-sm"
                                                            style="width: 50px; height: 24px; gap: 2px; display: flex; align-items: center;">
                                                            <i class="fa-solid fa-file"></i>
                                                            Ver
                                                        </button>                                                  
                                                        <div class="form-group" id="adjunto2ModalDiv">
                                                            <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjunto2Modal">
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="d-flex align-items-baseline gap-2 mt-2" id="adjCheck3">
                                                    <div class="form-check">
                                                        <label class="form-check-label" for="gridRadios1">3</label>
                                                        <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios3" value="3">
                                                    </div>
                                                    <div style="display: flex; align-items: center; gap: 40px;">
                                                        <button id="btnVerAdj3" class="btn btn-outline-primary btn-sm"
                                                            style="width: 50px; height: 24px; gap: 2px; display: flex; align-items: center;">
                                                            <i class="fa-solid fa-file"></i>
                                                            Ver
                                                        </button>                                             
                                                        <div class="form-group" id="adjunto3ModalDiv">
                                                            <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjunto3Modal">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="d-flex justify-content-end mt-2" style="width: 64%;" id="btnActualizarAdjDiv">
                                                <button type="button" class="btn btn-outline-primary btn-sm" style="display: flex; justify-content: center; align-items: center; height: 24px; align-self: end;" id="btnActualizarAdj" title="Actualizar archivos">
                                                    Modificar
                                                </button>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div class="d-flex justify-content-evenly mt-3" id="botonesAdmin">
                                        <button id="btnRechazar" class="btn btn-warning btn-sm" style="width: 190px;">Rechazar</button>
                                        <button id="btnAutorizar" class="btn btn-success btn-sm" style="width: 190px;">Autorizar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- SECCIÓN ADJUNTAR ANTICIPO -->
                    <div class="row justify-content-center mb-5" id="sectionAnticipo">
                        <div class="col-10">
                            <h5 id="titleAnticipo">Adjuntar solicitud de anticipo</h5>
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <div class="d-none card-title position-relative" id="checkAnticipo">
                                        <span class="position-absolute top-0 start-100 translate-middle">
                                            <i class="fa-regular fa-circle-check fa-2x text-success" style="margin-top: -10px; margin-right: -10px;"></i>
                                        </span>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col form-group d-none" id="fechaAnticipoDiv">
                                            <label for="fechaAnticipo" class="form-label">Fecha anticipo</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="Fecha anticipo" id="fechaAnticipo" disabled>
                                        </div>
                                        <div class="col form-group" id="adjuntoAnticipoDiv">
                                            <label for="adjuntoAnticipo" class="form-label">Adjunto anticipo</label>
                                            <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjuntoAnticipo">
                                        </div>
                                        <div class="col d-flex">
                                            <button class="btn btn-outline-primary btn-sm w-100 align-self-end" title="Ver anticipo" id="btnVerAnticipo">
                                                <i class="fa-solid fa-file" style="font-size: 15px;"></i>
                                                Ver anticipo
                                            </button>
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col form-group">
                                            <label class="form-label" for="comentarioAnticipo">Comentario</label>
                                            <div class="d-flex">
                                                <textarea class="form-control form-control-sm" style="background-color: #FFF6D7; border-radius: 3px 0 0 3px;" id="comentarioAnticipo"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col d-flex align-item-center justify-content-center" id="sectionBtnGA">
                                            <button id="guardarAnticipo" class="btn btn-outline-primary btn-sm" title="Guardar anticipo">
                                                <i class="fa-solid fa-floppy-disk"></i> Guardar
                                            </button>
                                        </div>
                                        <div class="d-flex justify-content-evenly mt-2" id="botonesAnticipo">
                                            <button id="btnRechazarAnticipo" class="btn btn-warning btn-sm" style="width: 190px;">Rechazar</button>
                                            <button id="btnAprobarAnticipo" class="btn btn-success btn-sm" style="width: 190px;">Aprobar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- SECCIÓN ADJUNTAR FACTURA -->
                    <div class="row justify-content-center mb-5 d-none" id="sectionFactura">
                        <div class="col-10">
                            <div class="d-flex justify-content-between p-1">
                                <h5>Adjuntar factura - Preliminar</h5>
                            </div>
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <div class="d-none card-title position-relative" id="checkFactura">
                                        <span class="position-absolute top-0 start-100 translate-middle">
                                            <i class="fa-regular fa-circle-check fa-2x text-success" style="margin-top: -10px; margin-right: -10px;"></i>
                                        </span>
                                    </div>
                                    <div class="row shadow-sm py-2 mb-3">
                                        <div class="col form-group d-none" id="fechaPreliminarDiv">
                                            <label for="fechaPreliminar" class="form-label">Fecha factura(Preliminar)</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="Fecha factura(Preliminar)" id="fechaPreliminar" disabled>
                                        </div>
                                        <div class="col form-group">
                                            <label for="numeroPreliminar" class="form-label">Número preliminar</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="Número preliminar" id="numeroPreliminar">
                                        </div>
                                        <div class="col form-group" id="adjunto_facturaDiv">
                                            <label for="adjunto_factura" class="form-label">Adjunto factura</label>
                                            <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjunto_factura">
                                        </div>
                                        <div class="col d-flex" id="btnVerFacturaDiv">
                                            <button class="btn btn-outline-primary btn-sm align-self-end w-100" title="Ver factura" style="width: 30px; height: auto;" id="btnVerFactura">
                                                <i class="fa-solid fa-file" style="font-size: 15px;"></i>
                                                Ver factura
                                            </button>
                                        </div>
                                    </div>
                                    <!-- DATOS FACTURA -->
                                    <div class="row shadow-sm py-2 mb-3">
                                        <div class="col-4 mb-2">
                                            <div class="form-group">
                                                <label for="fechaFactura2">Fecha factura</label>
                                                <input type="date" class="form-control form-control-sm" id="fechaFactura2" placeholder="Fecha factura">
                                            </div>
                                        </div>
                                        <div class="col-4 mb-2">
                                            <div class="form-group">
                                                <label for="numeroDocumento2">Número documento</label>
                                                <input type="text" class="form-control form-control-sm" id="numeroDocumento2" placeholder="Número documento">
                                            </div>
                                        </div>
                                        <div class="col-4 mb-2">
                                            <div class="form-group">
                                                <label for="razonSocial2">Razón social(NIT)</label>
                                                <input type="text" class="form-control form-control-sm" id="razonSocial2" placeholder="Razón social">
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <div class="form-group">
                                                <label for="subTotalFactura2">Subtotal factura</label>
                                                <input type="text" class="form-control form-control-sm" id="subTotalFactura2" placeholder="Subtotal factura">
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <div class="form-group">
                                                <label for="iva2">Iva</label>
                                                <input type="text" class="form-control form-control-sm" value="0" id="iva2" placeholder="Iva">
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <div class="form-group">
                                                <label for="valorFactura2">Total factura<span class="text-danger h5">*</span></label>
                                                <input type="text" class="form-control form-control-sm" id="valorFactura2" placeholder="Total factura">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mb-3" id="comentarioFacturaDiv">
                                        <div class="col">
                                            <label class="form-label" for="comentarioFactura">Comentario</label>
                                            <textarea class="form-control form-control-sm" style="background-color: #FFF6D7;" id="comentarioFactura"></textarea>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col d-flex align-item-center justify-content-center" id="sectionBtnGF">
                                            <button id="guardarFactura" class="btn btn-outline-primary btn-sm" title="Guardar factura(Preliminar)">
                                                <i class="fa-solid fa-floppy-disk"></i> Guardar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- SECCIÓN APROBAR FACTURA -->
                    <div class="row justify-content-center mb-3 d-none" id="sectionAprobarFactura">
                        <div class="col-10">
                            <h5>Aprobación de factura</h5>
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <div class="d-none card-title position-relative" id="checkAprobFactura">
                                        <span class="position-absolute top-0 start-100 translate-middle">
                                            <i class="fa-regular fa-circle-check fa-2x text-success" style="margin-top: -10px; margin-right: -10px;"></i>
                                        </span>
                                    </div>
                                    <div class="d-none alert alert-danger alert-dismissible fade show  d-flex align-items-center" role="alert" id="alerta2">
                                        <div>
                                            <strong>Rechazado!</strong> You should check in on some of those fields below.
                                        </div>
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group d-none" id="fechaAprobarPreliminarDiv">
                                            <label for="fechaAprobarPreliminar" class="form-label">Fecha aprobación factura(Preliminar)</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="Fecha aprobación factura(Preliminar)" id="fechaAprobarPreliminar" disabled>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group" id="comentarioAprobarFacturaDiv">
                                            <label class="form-label" for="comentarioAprobarFactura">Comentario</label>
                                            <textarea class="form-control form-control-sm" rows="2" style="border-radius: 3px 0 0 3px; background-color: #FFF6D7;" id="comentarioAprobarFactura"></textarea>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-evenly mt-2" id="botonesAprobarFactura">
                                        <button id="btnRechazar2" class="btn btn-warning btn-sm" style="width: 190px;">Rechazar</button>
                                        <button id="btnAprobar" class="btn btn-success btn-sm" style="width: 190px;">Aprobar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- SECCIÓN CONTABILIDAD -->
                    <div class="row justify-content-center mb-3" id="sectionContabilidad">
                        <div class="col-10">
                            <h5>Contabilidad</h5>
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <div class="d-none card-title position-relative" id="checkContabilidad">
                                        <span class="position-absolute top-0 start-100 translate-middle">
                                            <i class="fa-regular fa-circle-check fa-2x text-success" style="margin-top: -10px; margin-right: -10px;"></i>
                                        </span>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group d-none" id="fechaCausacionDiv">
                                            <label for="fechaCausacion">Fecha causación</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="Fecha causación" id="fechaCausacion" disabled>
                                        </div>
                                        <div class="col form-group">
                                            <label for="numeroCausacion">Número causación</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="Número causación" id="numeroCausacion">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group">
                                            <label for="comentarioContabilidad">Comentario</label>
                                            <textarea class="form-control form-control-sm" style="background-color: #FFF6D7;" rows="2" id="comentarioContabilidad"></textarea>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-evenly mt-2" id="botonesContabilidad">
                                        <button id="btnNoCausado" class="btn btn-warning btn-sm" style="width: 190px;">No causado</button>
                                        <button id="btnCausado" class="btn btn-success btn-sm" style="width: 190px;">Causado</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- SECCIÓN TESORERÍA -->
                    <div class="row justify-content-center mb-3" id="sectionTesoreria">
                        <div class="col-10">
                            <h5>Tesorería</h5>
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <div class="d-none card-title position-relative" id="checkTesoreria">
                                        <span class="position-absolute top-0 start-100 translate-middle">
                                            <i class="fa-regular fa-circle-check fa-2x text-success" style="margin-top: -10px; margin-right: -10px;"></i>
                                        </span>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group d-none" id="fechaPagoDiv">
                                            <label for="fechaPago">Fecha pago</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="Fecha pago" id="fechaPago" disabled>
                                        </div>
                                        <div class="col form-group" id="adjuntoPagoDiv">
                                            <label for="adjuntoPago">Adjunto pago</label>
                                            <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjuntoPago">
                                        </div>
                                        <div class="col d-flex" id="verAdjPagoDiv">
                                            <button id="verAdjPago" title="Ver adjunto del pago" class="btn btn-outline-primary btn-sm w-100 align-self-end">
                                                <i class="fa-solid fa-file"></i>
                                                Ver adjunto de pago
                                            </button>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group">
                                            <label for="comentarioTesoreria">Comentario</label>
                                            <textarea class="form-control form-control-sm" style="background-color: #FFF6D7;" rows="2" id="comentarioTesoreria"></textarea>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-evenly mt-2" id="botonesTesoreria">
                                        <button id="btnNoPagado" class="btn btn-warning btn-sm" style="width: 190px;">No pagado</button>
                                        <button id="btnPagado" class="btn btn-success btn-sm" style="width: 190px;">Pagado</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- SECCIÓN ADJUNTAR FACTURA 2 -->
                    <div class="row justify-content-center mb-5 d-none" id="sectionFactura2">
                        <div class="col-10">
                            <div class="d-flex justify-content-between p-1">
                                <h5>Legalizar factura - Preliminar</h5>
                            </div>
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <div class="d-none card-title position-relative" id="checkFactura2">
                                        <span class="position-absolute top-0 start-100 translate-middle">
                                            <i class="fa-regular fa-circle-check fa-2x text-success" style="margin-top: -10px; margin-right: -10px;"></i>
                                        </span>
                                    </div>
                                    <div class="row shadow-sm py-2 mb-3">
                                        <div class="col form-group d-none" id="fechaPreliminarDiv2">
                                            <label for="fechaPreliminar2" class="form-label">Fecha factura(Preliminar)</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="Fecha factura(Preliminar)" id="fechaPreliminar2" disabled>
                                        </div>
                                        <div class="col form-group">
                                            <label for="numeroPreliminar3" class="form-label">Número preliminar</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="Número preliminar" id="numeroPreliminar3">
                                        </div>
                                        <div class="col form-group" id="adjunto_facturaDiv2">
                                            <label for="adjunto_factura2" class="form-label">Adjunto factura</label>
                                            <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjunto_factura2">
                                        </div>
                                        <div class="col d-flex" id="btnVerFacturaDiv2">
                                            <button class="btn btn-outline-primary btn-sm align-self-end w-100" title="Ver factura" style="width: 30px; height: auto;" id="btnVerFactura2">
                                                <i class="fa-solid fa-file" style="font-size: 15px;"></i>
                                                Ver factura
                                            </button>
                                        </div>
                                    </div>
                                    <!-- DATOS FACTURA -->
                                    <div class="row shadow-sm py-2 mb-3">
                                        <div class="col-4 mb-2">
                                            <div class="form-group">
                                                <label for="fechaFactura3">Fecha factura</label>
                                                <input type="date" class="form-control form-control-sm" id="fechaFactura3" placeholder="Fecha factura">
                                            </div>
                                        </div>
                                        <div class="col-4 mb-2">
                                            <div class="form-group">
                                                <label for="numeroDocumento3">Número documento</label>
                                                <input type="text" class="form-control form-control-sm" id="numeroDocumento3" placeholder="Número documento">
                                            </div>
                                        </div>
                                        <div class="col-4 mb-2">
                                            <div class="form-group">
                                                <label for="razonSocial3">Razón social(NIT)</label>
                                                <input type="text" class="form-control form-control-sm" id="razonSocial3" placeholder="Razón social">
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <div class="form-group">
                                                <label for="subTotalFactura3">Subtotal factura</label>
                                                <input type="text" class="form-control form-control-sm" id="subTotalFactura3" placeholder="Subtotal factura">
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <div class="form-group">
                                                <label for="iva3">Iva</label>
                                                <input type="text" class="form-control form-control-sm" value="0" id="iva3" placeholder="Iva">
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <div class="form-group">
                                                <label for="valorFactura3">Total factura</label>
                                                <input type="text" class="form-control form-control-sm" id="valorFactura3" placeholder="Total factura">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mb-3" id="comentarioFacturaDiv2">
                                        <div class="col ">
                                            <label class="form-label" for="comentarioFactura2">Comentario</label>
                                            <textarea class="form-control form-control-sm" style="background-color: #FFF6D7;" id="comentarioFactura2"></textarea>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col d-flex align-item-center justify-content-center" id="sectionBtnGF2">
                                            <button id="guardarFactura2" class="btn btn-outline-primary btn-sm" title="Guardar factura(Preliminar)">
                                                <i class="fa-solid fa-floppy-disk"></i> Guardar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- SECCIÓN APROBAR FACTURA 2 -->
                    <div class="row justify-content-center mb-3 d-none" id="sectionAprobarFactura2">
                        <div class="col-10">
                            <h5>Aprobación de factura</h5>
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <div class="d-none card-title position-relative" id="checkAprobFactura2">
                                        <span class="position-absolute top-0 start-100 translate-middle">
                                            <i class="fa-regular fa-circle-check fa-2x text-success" style="margin-top: -10px; margin-right: -10px;"></i>
                                        </span>
                                    </div>
                                    <div class="d-none alert alert-danger alert-dismissible fade show  d-flex align-items-center" role="alert" id="alerta3">
                                        <div>
                                            <strong>Rechazado!</strong> You should check in on some of those fields below.
                                        </div>
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group d-none" id="fechaAprobarPreliminarDiv2">
                                            <label for="fechaAprobarPreliminar2" class="form-label">Fecha aprobación factura - Preliminar</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="Fecha aprobación factura - Preliminar" id="fechaAprobarPreliminar2" disabled>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group" id="comentarioAprobarFacturaDiv2">
                                            <label class="form-label" for="comentarioAprobarFactura2">Comentario</label>
                                            <textarea class="form-control form-control-sm" rows="2" style="border-radius: 3px 0 0 3px; background-color: #FFF6D7;" id="comentarioAprobarFactura2"></textarea>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-evenly mt-2" id="botonesAprobarFactura2">
                                        <button id="btnRechazar3" class="btn btn-warning btn-sm" style="width: 190px;">Rechazar</button>
                                        <button id="btnAprobar2" class="btn btn-success btn-sm" style="width: 190px;">Aprobar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- SECCIÓN LEGALIZACIÓN -->
                    <div class="row justify-content-center mb-5 d-none" id="sectionLegalizacion">
                        <div class="col-10">
                            <div class="d-flex justify-content-between p-1">
                                <h5>Legalización</h5>
                            </div>
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <div class="d-none card-title position-relative" id="checkLegalizacion">
                                        <span class="position-absolute top-0 start-100 translate-middle">
                                            <i class="fa-regular fa-circle-check fa-2x text-success" style="margin-top: -10px; margin-right: -10px;"></i>
                                        </span>
                                    </div>
                                    <div class="row shadow-sm py-2 mb-3">
                                        <div class="row mb-2">
                                            <div class="col form-group">
                                                <label for="valorAnticipo" class="form-label">Valor anticipo</label>
                                                <input type="text" class="form-control form-control-sm" placeholder="Valor anticipo" id="valorAnticipo" disabled>
                                            </div>
                                            <div class="col form-group" id="adjuntoLegalizacionDiv">
                                                <label for="adjuntoLegalizacion" class="form-label">Adjunto legalización</label>
                                                <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjuntoLegalizacion">
                                            </div>
                                            <div class="col form-group">
                                                <label for="valorLegalizacion" class="form-label">Valor legalización</label>
                                                <input type="text" class="form-control form-control-sm" placeholder="Valor legalización" id="valorLegalizacion">
                                            </div>
                                            <div class="col d-none" id="btnVerLegalizacionDiv">
                                                <button class="btn btn-outline-primary btn-sm align-self-end w-100" title="Ver legalización" style="width: 30px;" id="btnVerLegalizacion">
                                                    <i class="fa-solid fa-file" style="font-size: 15px;"></i>
                                                    Ver legalización
                                                </button>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col form-group">
                                                <label for="valorAutorizado" class="form-label">Valor autorizado</label>
                                                <input type="text" class="form-control form-control-sm" placeholder="Valor autorizado" id="valorAutorizado">
                                            </div>
                                        </div>
                                    </div>                                  
                                    <div class="row mb-3" id="comentarioLegalizacionDiv">
                                        <div class="col ">
                                            <label class="form-label" for="comentarioLegalizacion">Comentario</label>
                                            <textarea class="form-control form-control-sm" style="background-color: #FFF6D7;" id="comentarioLegalizacion"></textarea>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col d-flex align-item-center justify-content-center" id="btnGuardarLegalDiv">
                                            <button id="btnGuardarLegal" class="btn btn-outline-primary btn-sm" title="Guardar legalización">
                                                <i class="fa-solid fa-floppy-disk"></i> 
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-evenly mt-2" id="botonesAprobarLegalizacion">
                                        <button id="btnNoAprobarLegal" class="btn btn-warning btn-sm" style="width: 190px;">No aprobado</button>
                                        <button id="btnAprobarLegal" class="btn btn-success btn-sm" style="width: 190px;">Aprobado</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- SECCIÓN COMPENSACIÓN -->
                    <div class="row justify-content-center mb-3" id="sectionCompensacion">
                        <div class="col-10">
                            <h5>Contabilidad - Compensación</h5>
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <div class="d-none card-title position-relative" id="checkCompesacion">
                                        <span class="position-absolute top-0 start-100 translate-middle">
                                            <i class="fa-regular fa-circle-check fa-2x text-success" style="margin-top: -10px; margin-right: -10px;"></i>
                                        </span>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group d-none" id="fechaCompensacionDiv">
                                            <label for="fechaCompensacion">Fecha compensación</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="Fecha compensación" id="fechaCompensacion" disabled>
                                        </div>
                                        <div class="col form-group">
                                            <label for="numeroCompensacion">Número causación - compensación</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="Número compensación" id="numeroCompensacion">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group">
                                            <label for="comentarioCompensacion">Comentario</label>
                                            <textarea class="form-control form-control-sm" style="background-color: #FFF6D7;" rows="2" id="comentarioCompensacion"></textarea>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-evenly mt-2" id="botonesCompensacion">
                                        <button id="btnNoCompensado" class="btn btn-warning btn-sm" style="width: 190px;">No compensado</button>
                                        <button id="btnCompensado" class="btn btn-success btn-sm" style="width: 190px;">Compensado</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL VER ARCHIVOS IFRAME -->
    <div class="modal fade" id="modalVistaArchivos" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="min-width: 70%;">
            <div class="modal-content" style="background-color: whitesmoke;">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="visorPDF">

                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL COMENTARIOS. -->
    <div class="modal fade" id="modalComentarios" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="min-width: 70%;">
            <div class="modal-content" style="background-color: whitesmoke;">
                <div class="modal-header">
                    <div class="modal-title">
                        <h5>Proceso de la solicitud</h5>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding: 20px; display: flex; justify-content: center;">
                    <div class="timeline-container">
                        <div class="timeline"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL VER TABLA GASTOS -->
    <div class="modal fade" id="modalTablaGastos" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="min-width: 70%;">
            <div class="modal-content" style="background-color: whitesmoke;">
                <div class="modal-header">
                    <div class="modal-title">
                        <h5>Tabla de gastos autorizados</h5>
                    </div>               
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding: 20px; display: flex; justify-content: center;">
                    <div class="container" id="containerTablaGastos">
                        
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
    <script type="text/javascript" src="../controllers/WorkFlow.js?<?php echo (rand()); ?>"></script>
</body>

</html>