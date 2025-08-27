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

    <!-- <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DynaPuff:wght@500&display=swap" rel="stylesheet">
    <link href="../resources/fontawesome-free-6.1.2-web/css/fontawesome.min.css" rel="stylesheet" />
    <link href="../resources/fontawesome-free-6.1.2-web/css/v5-font-face.min.css" rel="stylesheet" />
    <link href="../resources/fontawesome-free-6.1.2-web/css/regular.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="../resources/select2-bootstrap4-theme/select2-bootstrap4.css">
    
    <link type="text/css" rel="stylesheet" href="../resources/plugins/jquery-ui/jquery-ui.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <link title="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" />
    <link href="../resources/niceadmin/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
    <link href="../resources/niceadmin/assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
    <link href="../resources/niceadmin/assets/vendor/quill/quill.snow.css" rel="stylesheet">
    <link href="../resources/niceadmin/assets/vendor/quill/quill.bubble.css" rel="stylesheet">
    <link href="../resources/niceadmin/assets/vendor/remixicon/remixicon.css" rel="stylesheet">
    <link rel="stylesheet" href="../resources/select2/css/select2.css">
    <link rel="stylesheet" href="../resources/datatable/datatables.min.css"> -->
    
<link type="text/css" rel="stylesheet" href="../resources/bootstrap/bootstrap-5.0.2-dist/css/bootstrap.min.css">
    <!-- Iconos -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">

        <!-- Estilos personalizados -->
    <link rel="stylesheet" href="../resources/css/formulario.css">
    <link rel="stylesheet" href="../resources/css/botones.css">
    <link rel="stylesheet" href="../resources/css/calendario.css">
    <link rel="stylesheet" href="../resources/css/tablas.css">
    <link rel="stylesheet" href="../resources/css/tabs.css">
    <link rel="stylesheet" href="../resources/css/alerts.css">
    <link rel="stylesheet" href="../resources/css/Animate.css">
    <link rel="stylesheet" href="../resources/css/imgPreloder.css">

    <style>
        
/* ===================== */
/*   ESTILO DE MODALES   */
/* ===================== */

/* Contenido del modal */
.modal-content {
  border-radius: 1rem;
  border: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.4s ease-out;
  background-color: #ffffff;
}

/* Encabezado */
.modal-header {
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: #fff;
  border-bottom: none;
  padding: 1rem 1.25rem;
  border-radius: 1rem 1rem 0 0;
}
.modal-header .btn-close {
  filter: brightness(0) invert(1);
  opacity: 0.8;
  transition: opacity 0.2s;
}
.modal-header .btn-close:hover {
  opacity: 1;
}

/* Cuerpo */
.modal-body {
  padding: 0px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #444;
  background-color: #fdfdfd;
}

/* Pie de página */
        .modal-footer {
        border-top: none;
        padding: 0.75rem 1.25rem;
        background-color: #f8f9fa;
        border-radius: 0 0 1rem 1rem;
        }

        /* Botones */
        .modal-footer .btn {
        border-radius: 20px;
        transition: all 0.3s ease;
        }
        .modal-footer .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
        }

        /* Animación de entrada */
        @keyframes modalFadeIn {
        from {
            opacity: 0;
            transform: translateY(-15px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
        }

        /* Animación del fondo */
        .modal.fade .modal-dialog {
        transform: scale(0.95);
        transition: transform 0.3s ease-out;
        }
        .modal.show .modal-dialog {
        transform: scale(1);
        }

        /* Backdrop */
        .modal-backdrop {
        background-color: rgba(0, 0, 0, 0.5);
        animation: backdropFadeIn 0.3s ease-out;
        }
        @keyframes backdropFadeIn {
        from { opacity: 0; }
        to { opacity: 0.5; }
        }

        /* Inputs dentro del modal */
        .modal-content .input-group-text {
        background: #e9ecef;
        color: #495057;
        border-radius: 0.5rem 0 0 0.5rem;
        }

        #tablaSolicitudes tbody tr td {
            font-size: 12px !important;
            vertical-align: middle;
        }

        #tablaSolicitudes thead tr th {
            font-size: 15px !important;
            font-weight: 400;
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
            width: 90px;
            padding: 5px 0;
            color: black;
            font-weight: 700;
            font-size: 10px;
            cursor: pointer;                        
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

    .btn-warning {
        border-color: #ffc107;
        color: #8b6a05ff;
    }

    .btn-warning:hover {
    background-color: #ffc107;
    color: #ffffff;
}
    </style>
</head>

<body>
    <input type="hidden" id="rol" value="<?php echo !empty($_SESSION["ses_RolesId"]) ? $_SESSION["ses_RolesId"] : ''; ?>" disabled>
    <input type="hidden" id="UsrId" value="<?php echo !empty($_SESSION["ses_Id"]) ? $_SESSION["ses_Id"] : ''; ?>" disabled>
    <input type="hidden" id="oficina" value="<?php echo !empty($_SESSION["ses_OfcVentas"]) ? $_SESSION["ses_OfcVentas"] : ''; ?>" disabled>   

<div class="container my-4">
    <!-- CONTENIDO PRINCIPAL -->
    <div id="main-content" class="mt-3">
        <!-- alert -->
            <div class="alert alert-info mb-4 ">
                <i class="fa-solid fa-star fa-flip"></i> 0417 - WORK FLOW
            </div>
            <div class="card my-3">
                <div class="card-header">
                    <h5></h5>
                </div>

                <!-- Filtros superiores -->
                <div class="row py-3 rounded bg-white w-100 mx-auto mb-3 mt-2" id="barraFiltros">
                <div class="col-lg-3 col-md-4 col-12 mb-2">
                    <label for="filtroOficina" class="form-label">Oficina</label>
                    <select class="form-select form-select-sm" id="filtroOficina"></select>
                </div>

                <div class="col-lg-2 col-md-4 col-12 mb-2">
                    <label for="filtroDepartamentos" class="form-label">Departamento</label>
                    <select class="form-select form-select-sm" id="filtroDepartamentos"></select>
                </div>

                <div class="col-lg-2 col-md-4 col-12 mb-2">
                    <label class="form-label">Desde</label>
                    <div class="input-group input-group-sm">
                    <span class="input-group-text"><i class="fa-solid fa-calendar-days"></i></span>
                    <input type="text" id="fechaDesde" class="form-control" readonly>
                    </div>
                </div>

                <div class="col-lg-2 col-md-4 col-12 mb-2">
                    <label class="form-label">Hasta</label>
                    <div class="input-group input-group-sm">
                    <span class="input-group-text"><i class="fa-solid fa-calendar-days"></i></span>
                    <input type="text" id="fechaHasta" class="form-control" readonly>
                    </div>
                </div>

                <!-- Botones en una fila independiente en pantallas grandes -->
                <div class="col-lg-3 col-md-12 col-12 mb-2 d-flex gap-2">
                    <button class="btn btn-primary btn-sm flex-fill" id="btnModalAddSolic">
                    <i class="fa fa-plus-circle"></i> Agregar
                    </button>
                    <button class="btn btn-warning btn-sm flex-fill" id="btnRefrescar">
                    <i class="fa fa-refresh"></i> Refrescar
                    </button>
                </div>
                </div>

                <!-- Barra inferior -->
                <div class="row align-items-center px-3 mb-3">
                <div class="col-lg-3 col-md-4 col-12 mb-2">
                    <button class="btn btn-success btn-sm w-100" id="btnExportar">
                    <i class="fa fa-file-excel"></i> Exportar a Excel
                    </button>
                </div>
                <div class="col-lg-3 col-md-4 col-12 mb-2 text-center">
                    <label class="form-label m-0">Solicitudes:</label>
                    <p style="font-size: 18px; color: #007bff; font-weight: bold;" id="cantSolicitudes">0</p>
                </div>
                <div class="col-lg-6 col-md-4 col-12 mb-2">
                    <input type="text" class="form-control form-control-sm" placeholder="Filtrar solicitudes..." id="filtroSolicitudes">
                </div>
                </div>
            </div>

            <!-- Tabla de solicitudes -->
            <div id="contenedorTablaSolicitudes" style="overflow-x: auto;"></div>
    </div>

    <!-- MODAL CREAR SOLICITUD -->
    <div class="modal fade" id="modalAgregarSolicitud" tabindex="-1" aria-labelledby="modalAgregarSolicitudLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content bg-light shadow-sm">
        <div class="modal-header">
            <h5 id="modalAgregarSolicitudLabel">
            <i class="fa-solid fa-plus-circle"></i> Crear solicitud
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body p-3">
            <form id="formCrearSolicitud" class="needs-validation" novalidate>
            <!-- Campos Ocultos -->
            <div class="row g-3 d-none">
                <div class="col-md-3">
                <label for="organizacion" class="form-label">Organización ventas</label>
                <select class="form-select" id="organizacion" name="ORGANIZACION_VENTAS" disabled>
                    <option value="">--Seleccione--</option>
                    <option value="2000">ROMA</option>
                    <option value="1000">MULTIDROGRAS</option>
                </select>
                </div>
                <div class="col-md-3">
                <label for="oficina_solicitante" class="form-label">Oficina</label>
                <select class="form-select" id="oficina_solicitante" name="OFICINA_VENTAS" disabled></select>
                </div>
                <div class="col-md-3">
                <label for="estado_solicitud" class="form-label">Estado</label>
                <input type="text" class="form-control" value="S" id="estado_solicitud" name="ESTADO" disabled>
                </div>
                <div class="col-md-3">
                <label for="usuario_solicitante" class="form-label">Usuario</label>
                <input type="text" class="form-control" id="usuario_solicitante" name="USUARIO_SOLICITA" disabled>
                </div>
            </div>

            <!-- Tipo y Concepto -->
            <div class="row g-3 mt-2">
                <div class="col-md-6">
                <label for="tipoGasto" class="form-label">Tipo de gasto <span class="text-danger">*</span></label>
                <select class="form-select form-select-sm" name="TIPO_GASTO" id="tipoGasto">
                    <option value="">--Seleccione--</option>
                    <option value="1">COTIZACIÓN</option>
                    <option value="2">FACTURA DIRECTA</option>
                    <option value="3">ANTICIPO</option>
                </select>
                </div>
                <div class="col-md-6">
                <label for="conceptoFormulario" class="form-label">Concepto solicitud <span class="text-danger">*</span></label>
                <div class="input-group input-group-sm">
                    <select class="form-select" id="conceptoFormulario" name="CONCEPTO_GASTO"></select>
                    <button style="border-radius: 0 1rem 1rem 0 !important;" type="button" id="btnAbrirModal" class="btn btn-primary" title="Agregar concepto">
                    <i class="fa-solid fa-circle-plus"></i>
                    </button>
                </div>
                </div>
            </div>

            <!-- Cotizaciones -->
            <div class="row g-3 mt-3" id="cotizaciones">
                <div class="col-md-4">
                <label for="tipoAnticipo" class="form-label">Tipo anticipo <span class="text-danger">*</span></label>
                <select class="form-select form-select-sm" name="TIPO_ANTICIPO" id="tipoAnticipo">
                    <option value="">--Seleccione--</option>
                    <option value="1">CON COTIZACIÓN</option>
                    <option value="2">LEGALIZACIÓN GASTOS DE VIAJE</option>
                    <option value="3">SIN COTIZACIÓN</option>
                </select>
                </div>
                <div class="col-md-4">
                <label for="valorAnticipo1" class="form-label">Valor anticipo <span class="text-danger">*</span></label>
                <input type="text" class="form-control form-control-sm" id="valorAnticipo1" name="VALOR_ANTICIPO" placeholder="Valor anticipo">
                </div>
                <div class="col-md-4">
                <label for="numeroPreliminar2" class="form-label">Número preliminar <span class="text-danger">*</span></label>
                <input type="text" class="form-control form-control-sm" id="numeroPreliminar2" name="NUMERO_PRELIMINAR" placeholder="Número preliminar">
                </div>
                <div class="col-md-4">
                <label for="adjunto_1" class="form-label">Adjuntar cotización 1 <span class="text-danger">*</span></label>
                <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjunto_1" name="ADJUNTO_SOLICITA_1">
                </div>
                <div class="col-md-4">
                <label for="adjunto_2" class="form-label">Adjuntar cotización 2</label>
                <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjunto_2" name="ADJUNTO_SOLICITA_2">
                </div>
                <div class="col-md-4">
                <label for="adjunto_3" class="form-label">Adjuntar cotización 3</label>
                <input type="file" accept=".pdf" class="form-control form-control-sm" id="adjunto_3" name="ADJUNTO_SOLICITA_3">
                </div>
            </div>

            <!-- Datos Factura -->
            <div class="row g-3 mt-3" id="datosFactura">
                <div class="col-md-4">
                <label for="fechaFactura" class="form-label">Fecha factura <span class="text-danger">*</span></label>
                <input type="date" class="form-control form-control-sm" id="fechaFactura" name="FECHA_DOCUMENTO">
                </div>
                <div class="col-md-4">
                <label for="numeroDocumento" class="form-label">Número documento <span class="text-danger">*</span></label>
                <input type="text" class="form-control form-control-sm" id="numeroDocumento" name="NUMERO_DOCUMENTO">
                </div>
                <div class="col-md-4">
                <label for="razonSocial" class="form-label">Razón social(NIT) <span class="text-danger">*</span></label>
                <input type="text" class="form-control form-control-sm" id="razonSocial" name="NIT">
                </div>
                <div class="col-md-4">
                <label for="subTotalFactura" class="form-label">Subtotal factura <span class="text-danger">*</span></label>
                <input type="text" class="form-control form-control-sm" id="subTotalFactura" name="SUBTOTAL_DOCUMENTO">
                </div>
                <div class="col-md-4">
                <label for="iva" class="form-label">IVA</label>
                <input type="text" class="form-control form-control-sm" id="iva" name="IVA_DOCUMENTO" value="0">
                </div>
                <div class="col-md-4">
                <label for="valorFactura" class="form-label">Total factura <span class="text-danger">*</span></label>
                <input type="text" class="form-control form-control-sm" id="valorFactura" name="VALOR_DOCUMENTO">
                </div>
            </div>

            <!-- Comentario -->
            <div class="row mt-3">
                <div class="col">
                <label for="comentario_solicitante" class="form-label">Comentario solicitud <span class="text-danger">*</span></label>
                <textarea rows="2" class="form-control" style="background-color: #FFF6D7;" id="comentario_solicitante" name="COMENTARIO_SOLICITA"></textarea>
                </div>
            </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
            <i class="fa-solid fa-xmark"></i> Cerrar
            </button>
            <button type="button" class="btn btn-primary" id="btnVerTablaGastos">
            <i class="fa-solid fa-table"></i> Ver tabla de gastos
            </button>
            <button type="button" class="btn btn-success" id="btnGuardar">
            <i class="fa-solid fa-floppy-disk"></i> Guardar solicitud
            </button>
        </div>
        </div>
    </div>
    </div>


    <!-- MODAL CREAR CONCEPTO -->
    <div class="modal fade" id="modalAgregarConcepto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content bg-light">
        <div class="modal-header border-bottom-0">
            <h5 class="modal-title "><i class="fa-solid fa-lightbulb me-2"></i>Nuevo Concepto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-3">
            <div class="input-group input-group-sm mb-3">
            <span class="input-group-text"><i class="fa fa-pen"></i></span>
            <input 
                type="text" 
                class="form-control" 
                placeholder="Escriba el concepto que desea agregar" 
                id="conceptoModal"
            >
            </div>
            <div class="text-end">
            <button type="button" class="btn btn-primary btn-sm" id="btnAgregarConcepto">
                <i class="fa fa-plus-circle"></i> Agregar
            </button>
            </div>
        </div>
        </div>
    </div>
    </div>

    

    <!-- MODAL GESTIONAR SOLICITUD. -->
    <div class="modal fade" id="modalGestionarSolicitud" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" style="min-width: 70%; background-color: #ddd;">
            <div class="modal-content" style="background-color: whitesmoke;">
                <div class="modal-header">
                    <h3 class="modal-title " id="exampleModalLabel">Gestionar solicitud</h3>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <!-- SECCIÓN DATOS INFO -->
                <div class="modal-body p-3">
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
                        <button class="btn btn-primary btn-sm" id="btnRestaurar">Restaurar solicitud</button>
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
                                                        <button id="btnVerAdj1" class="btn btn-primary btn-sm"
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
                                                        <button id="btnVerAdj2" class="btn btn-primary btn-sm"
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
                                                        <button id="btnVerAdj3" class="btn btn-primary btn-sm"
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
                                                <button type="button" class="btn btn-primary btn-sm" style="display: flex; justify-content: center; align-items: center; height: 24px; align-self: end;" id="btnActualizarAdj" title="Actualizar archivos">
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
                                            <button class="btn btn-primary btn-sm w-100 align-self-end" title="Ver anticipo" id="btnVerAnticipo">
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
                                            <button id="guardarAnticipo" class="btn btn-primary btn-sm" title="Guardar anticipo">
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
                                            <button class="btn btn-primary btn-sm align-self-end w-100" title="Ver factura" style="width: 30px; height: auto;" id="btnVerFactura">
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
                                            <button id="guardarFactura" class="btn btn-primary btn-sm" title="Guardar factura(Preliminar)">
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
                                            <button id="verAdjPago" title="Ver adjunto del pago" class="btn btn-primary btn-sm w-100 align-self-end">
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
                                            <button class="btn btn-primary btn-sm align-self-end w-100" title="Ver factura" style="width: 30px; height: auto;" id="btnVerFactura2">
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
                                            <button id="guardarFactura2" class="btn btn-primary btn-sm" title="Guardar factura(Preliminar)">
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
                                                <button class="btn btn-primary btn-sm align-self-end w-100" title="Ver legalización" style="width: 30px;" id="btnVerLegalizacion">
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
                                            <button id="btnGuardarLegal" class="btn btn-primary btn-sm" title="Guardar legalización">
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
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
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
                <div class="modal-body p-3">
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
                <div class="modal-body p-3" style="padding: 20px; display: flex; justify-content: center;">
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
                <div class="modal-body p-3" style="padding: 20px; display: flex; justify-content: center;">
                    <div class="container" id="containerTablaGastos">
                        
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
    <script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>
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