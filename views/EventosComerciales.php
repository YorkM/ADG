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
        font-size: 1rem;
    }

    /* body {
      background-color: #F9F9F9;
    } */

    div.datepicker {
        padding: 10px;
        box-shadow: 10px 10px 6px #F3F3F3;
    }

    .datepicker th.dow {
        padding: 5px;
        background-color: #F3F3F3;
        border-bottom: 1px solid #CCCCCC;
        border-radius: 0;
    }

    .datepicker td.day {
        padding: 6px;
        border-radius: 5px;
        width: 22px
    }

    .datepicker td.day:hove {
        background-color: #929292
    }

    .datepicker td.active {
        background-color: #24B0F4
    }

    .datepicker td.active.day {
        background-color: #3AB7F4;
    }

    #eventos_cierres {
        border: 1px solid #DBDBDB
    }

    label {
        font-weight: 400;
        font-size: 15px;
    }

    .input-group-text {
        background-color: #FFFFFF !important;
    }

    .form-control {
        border: 1px solid #AFAFAF
    }

    .thead-list-eventos {
        position: sticky;
        top: 0;
        background-color: #ffffff;
        animation: 1s ease-in;
    }

    .rows-lab {
        border: 1px solid #F0F0F0;
        border-radius: 5px;
        margin: 2px;
        background-color: #F5F5F5
    }

    #tablaEventos thead tr th {
        font-size: .93rem !important;
        font-weight: 700;
    }

    .handsontable td {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 30px;
        text-align: center;
        border: 1px solid #ccc !important;
        font-weight: 600;
        font-size: .8rem;
        text-align: left;
        color: red;
    }

    .handsontable th {
        border: 1px solid #ccc !important;
        font-weight: 500;
        font-size: .86rem;
        color: #055160;
    }

    .low-percentage {
        background-color: #ec7063 !important;
    }

    .medium-percentage {
        background-color: #f9e79f !important;
    }

    .high-percentage {
        background-color: #1abc9c !important;
    }

    #tablaOficinas thead tr th {
        font-weight: 700;
        color: #055160;
        text-transform: uppercase;
    }

    #tablaEventos thead tr th {
        font-weight: 700;
        color: #055160;
        text-transform: uppercase;
    }

    #tablaPresupuestoEvento thead tr th {
        font-weight: 700;
        color: #055160;
        text-transform: uppercase;
    }

    #tablaPresupuestoZona thead tr th {
        font-weight: 700;
        color: #055160;
        text-transform: uppercase;
    }

    #tablaDatos thead tr th {
        font-weight: 700;
        color: #055160;
        text-transform: uppercase;
    }

    #tablaOficinas tfoot tr td {
        font-weight: 400;
        font-size: larger;
    }

    .btn-bar {
        width: 120px;
    }

    select>option {
        font-size: 13px;
    }

    .no-wrap {
        padding: 0;
        line-height: 2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .text-green {
        color: #055160;
    }

    .size-16 {
        font-size: 16px;
        font-weight: 500 !important;
    }

    .size-15 {
        font-size: 15px;
    }

    .size-14 {
        font-size: 14px;
    }

    .size-13 {
        font-size: 13px;
    }

    /* Comienzan clases Jhon */
    .modal-header {
        color: #055160;
        Background-color: #cff4fc;
        border-color: #b6effb
    }

    /* Finalizan clases jhon */
    </style>
</head>

<body>
    <input type="hidden" id="id-evento" value="0" readonly>
    <input type="hidden" id="Ofi"
        value="<?php echo (!empty($_SESSION["ses_OfcVentas"])) ? $_SESSION["ses_OfcVentas"] : "" ?>" readonly />
    <input type="hidden" id="org_ses"
        value="<?php echo (!empty($_SESSION["ses_NumOrg"])) ? $_SESSION["ses_NumOrg"] : "" ?>" readonly />
    <input type="hidden" id="usuario_ses"
        value="<?php echo (!empty($_SESSION['ses_Login'])) ? $_SESSION['ses_Login'] : "" ?>" readonly />
    <input type="hidden" id="idEvento">
    <input type="hidden" id="oficinaSubs">

    <!-- VISTA GENERAL CREACIÓN - BÚSQUEDA EVENTO -->
    <div class="alert alert-info mb-2" style="font-weight: 500;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0632 -
        EVENTOS COMERCIALES</div>
    <div class="container-fluid">
        <nav class="row p-1">
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home"
                    type="button" role="tab" aria-controls="nav-home" aria-selected="true"><i class="fa fa-pencil"></i>
                    &nbsp;Creación</button>
                <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile"
                    type="button" role="tab" aria-controls="nav-profile" aria-selected="false"><i
                        class="fa fa-search"></i>&nbsp;Búsqueda</button>
            </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <div style="width: 95%; margin: 0 auto;">
                    <form class="form needs-validation mt-3" id="form" onsubmit="event.preventDefault();" novalidate>
                        <input type="hidden" id="org" name="organizacion_ventas" value="" readonly />
                        <input type="hidden" id="usuario" name="usuario" value="" readonly />
                        <input type="hidden" readonly id="id" value="0" name="id" />
                        <div class="card shadow-sm p-3">
                            <div class="row mb-2">
                                <div class="col-md-6">
                                    <label class="m-1">Nombre del evento</label>
                                    <input type="text" class="form-control form-control-sm shadow-sm"
                                        placeholder="Nombre del evento" id="nombre" maxlength="255" minlength="10"
                                        name="nombre" required />
                                    <div class="invalid-feedback"> El nombre es obligatorio! </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="m-1">Oficina</label>
                                    <select class="form-select form-select-sm shadow-sm" id="oficinas"
                                        name="oficina_ventas" required>
                                    </select>
                                    <div class="invalid-feedback"> Por favor seleccione la oficina! </div>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-md-6">
                                    <label class="m-1">Fecha inicio evento</label>
                                    <input type="date" class="form-control form-control-sm fechas shadow-sm"
                                        name="fecha_inicio" id="fecha_inicial" required>
                                    <div class="invalid-feedback"> Este campo es obligatorio! </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="m-1">Fecha final evento</label>
                                    <input type="date" class="form-control form-control-sm fechas shadow-sm"
                                        name="fecha_fin" id="fecha_final" required>
                                    <div class="invalid-feedback"> Este campo es obligatorio! </div>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-md-6">
                                    <label class="m-1">Fecha fin viajeros terrestre</label>
                                    <input type="date" class="form-control form-control-sm fechas shadow-sm"
                                        name="fecha_fin_terrestre" id="fecha_fin_terrestre" required>
                                    <div class="invalid-feedback"> Este campo es obligatorio! </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="m-1">Fecha fin viajeros aéreos</label>
                                    <input type="date" class="form-control form-control-sm fechas shadow-sm"
                                        name="fecha_fin_aereo" id="fecha_fin_aereo" required>
                                    <div class="invalid-feedback"> Este campo es obligatorio! </div>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-md-6">
                                    <label class="m-1">Presupuesto min. Aereos</label>
                                    <input type="text"
                                        class="form-control form-control-sm fechas format-number shadow-sm"
                                        placeholder="Presupuesto min. Aereos" name="presupuesto_aereo"
                                        id="presupuesto_aereos" required onKeyPress="return vnumeros(event)">
                                    <div class="invalid-feedback"> Este campo es obligatorio! </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="m-1">Presupuesto min. Terrestres</label>
                                    <input type="text"
                                        class="form-control form-control-sm fechas format-number shadow-sm"
                                        placeholder="Presupuesto min. Terrestres" name="presupuesto_terrestre"
                                        id="presupuesto_terrestres" required onKeyPress=" return vnumeros(event)">
                                    <div class="invalid-feedback"> Este campo es obligatorio! </div>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-md-4">
                                    <label class="m-1">Fecha fin convocatoria</label>
                                    <input type="date" class="form-control form-control-sm fechas shadow-sm"
                                        name="fecha_fin_convocatoria" id="fecha_fin_convocatoria" required>
                                    <div class="invalid-feedback"> Este campo es obligatorio! </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="m-1">Evento cierre</label>
                                    <div class="input-group mb-3 ">
                                        <select class="form-select form-select-sm shadow-sm" id="eventos_cierres"
                                            name="id_evento_cierre">
                                        </select>
                                        <span class="input-group-md" id="basic-addon1">
                                            <button type="button" style="height: 33px; display: flex;"
                                                class="btn btn-sm btn-outline-primary p-2 shadow-sm"
                                                id="add-evento-cierre"><i class="fa fa-plus-circle"></i></button>
                                        </span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="m-1">Estado</label>
                                    <select class="form-select form-select-sm shadow-sm" name="estado" id="estado">
                                        <option value="A" selected>Activo</option>
                                        <option value="I">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="card shadow-sm border-1 p-2 border-light">
                                    <h5 style="font-weight: 400;"><i class="fa-solid fa-location-dot"></i> Info de lugar
                                        y logistica</h5>
                                    <div class="row p-1">
                                        <div class="col-md-6">
                                            <label class="m-1">Lugar del sitio</label>
                                            <div class="input-group mb-3"> <span class="input-group-text text-primary">
                                                    <i class="fa-solid fa-hotel"></i> </span>
                                                <input class="form-control form-control-sm text-primary shadow-sm"
                                                    maxlength="60" id="info_lugar" name="info_lugar" required>
                                                <div class="invalid-feedback"> Por favor digite el lugar donde sera el
                                                    evento! </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="m-1">Dirección</label>
                                            <div class="input-group mb-3"> <span class="input-group-text text-primary">
                                                    <i class="fa-regular fa-map"></i> </span>
                                                <input class="form-control form-control-sm text-primary shadow-sm"
                                                    maxlength="60" id="info_direccion" name="info_direccion" required>
                                                <div class="invalid-feedback"> Por favor digite la dirección! </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row p-1">
                                        <div class="col-12">
                                            <label class="m-1">Premios</label>
                                            <div class="input-group mb-3"> <span class="input-group-text text-primary">
                                                    <i class="fa-solid fa-trophy"></i> </span>
                                                <textarea class="form-control text-primary shadow-sm" rows="2"
                                                    id="info_premios" maxlength="150" name="info_premios"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row p-1 mt-2">
                                <div class="col-md-8">
                                    <label class="m-1">Laboratorios participantes</label>
                                    <input type="file" class="form-control form-control-sm shadow-sm" id="lab-csv">
                                </div>
                                <div class="col-sm-6 mt-2 col-md-2 d-flex">
                                    <button type="button"
                                        class="btn btn-outline-success btn-sm w-100 align-self-end shadow-sm add-row-lab "
                                        id="add-row-lab">
                                        <i class="fa-solid fa-plus"></i>
                                        Agregar
                                    </button>
                                </div>
                                <div class="col-sm-6 mt-2 col-md-2 d-flex">
                                    <button type="button"
                                        class="btn btn-outline-warning btn-sm w-100 align-self-end shadow-sm"
                                        onClick="limpiarListLab(1)">
                                        <i class="fa-solid fa-broom"></i>
                                        Limpiar
                                    </button>
                                </div>
                            </div>
                            <div class="row" id="list-lab"></div>
                            <div class="row">
                                <div class="col m-1">
                                    <div class="card p-1 mt-2">
                                        <label class="m-1">Banner 1</label>
                                        <input type="file" class="form-control form-control-sm shadow-sm"
                                            onchange="previewImage(event, '#img-banner-1')" id="img_publicitaria_1"
                                            name="img_publicitaria_1">
                                        <img class="" src="" id="img-banner-1" width="100%" height="130">
                                        <label class="m-1">Banner 2</label>
                                        <input type="file" class="form-control form-control-sm shadow-sm"
                                            onchange="previewImage(event, '#img-banner-2')" id="img_publicitaria_2"
                                            name="img_publicitaria_2">
                                        <img class="" src="" id="img-banner-2" width="100%" height="130">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col m-1">
                                    <button class="btn btn-outline-success btn-sm shadow-sm" type="submit"
                                        id="guardar"><i class="fa-regular fa-floppy-disk"></i><span
                                            class="p-1">Guardar</span></button>
                                    <button class="btn btn-outline-secondary btn-sm shadow-sm" id="nuevo"
                                        type="reset"><i class="fa-solid fa-file-circle-plus"></i><span
                                            class="p-1">Nuevo</span></button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="tab-pane fade p-2" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                <div style="width: 98%; margin: 0 auto;">
                    <div class="row">
                        <div class="col-md-3">
                            <label class="m-1">Fecha inicio evento</label>
                            <input type="date" class="form-control form-control-sm fechas shadow-sm"
                                name="sh_fecha_inicio" id="sh_fecha_inicio" required>
                        </div>
                        <div class="col-md-3">
                            <label class="m-1">Fecha final evento</label>
                            <input type="date" class="form-control form-control-sm fechas shadow-sm"
                                name="sh_fecha_final" id="sh_fecha_final" required>
                        </div>
                        <div class="col-md-3">
                            <label class="m-1">Estado</label>
                            <select class="form-select form-select-sm shadow-sm" id="sh_estado">
                                <option value="A">Activos</option>
                                <option value="I">Inactivos</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="m-1">Oficina</label>
                            <select name="sh_oficinas" id="sh_oficinas" class="form-select form-select-sm shadow-sm">
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="container-fluid mt-4">
                            <div class="input-group mb-3">
                                <input type="text" class="form-control form-control-sm shadow-sm" id="filtro"
                                    placeholder="Nombre / Oficina / Usuario">
                                <span class="input-group-text text-primary">
                                    <button class="btn btn-sm btn-outline-primary" id="buscar-evento"><i
                                            class="fa-solid fa-search"></i></button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <h5 style="font-weight: 400; font-size: 16px; text-align: right;">TOTAL EVENTOS: <span
                                id="n-result-busqueda" style="font-size: 20px; font-weight: 700;">0</span></h5>
                        <div class="p-1" id="result" style="overflow: auto;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL SEGUIMIENTO EVENTOS -->
    <div class="modal fade animate__animated animate__fadeIn" id="modalSeguimiento" tabindex="-1"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="min-width: 100%;">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">
                        <h5></h5>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h5 class="mb-3" style="color: #055160; text-align: center; font-weight: 400;">CONSOLIDADOS POR
                        OFICINA</h5>
                    <div style="overflow: auto;" class="mb-3">
                        <table id="tablaOficinas" class="table table-bordered table-hover" style="width: 100%;">
                            <thead class="table-info">
                                <tr>
                                    <th>OFICINA</th>
                                    <th>VALOR PASSPORT</th>
                                    <th>VALOR FACTURADO</th>
                                    <th>VALOR PENDIENTE</th>
                                    <th>% CUMPLIMIENTO</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                            <tfoot>
                                <tr style="background-color: #cff4fc;">
                                    <td class="size-16 text-green">TOTALES</td>
                                    <td class="size-16 text-green" id="tPassport"></td>
                                    <td class="size-16 text-green" id="tFacturado"></td>
                                    <td class="size-16 text-green" id="tPendiente"></td>
                                    <td class="size-16 text-green" id="tPorcentaje"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <nav class="row p-1">
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                            <button class="nav-link active" id="tabConsolidados" data-bs-toggle="tab"
                                data-bs-target="#consolidados" type="button" role="tab" aria-controls="nav-home"
                                aria-selected="true"><i class="fa-solid fa-rectangle-list"></i>
                                &nbsp;Consolidados</button>

                            <button class="nav-link" id="tabDetalles" data-bs-toggle="tab" data-bs-target="#detalles"
                                type="button" role="tab" aria-controls="nav-profile" aria-selected="false"><i
                                    class="fa-solid fa-bars"></i>&nbsp;Detalles</button>

                            <button class="nav-link" id="tabZonas" data-bs-toggle="tab" data-bs-target="#zonas"
                                type="button" role="tab" aria-controls="nav-profile" aria-selected="false"><i
                                    class="fa-solid fa-location-dot"></i></i>&nbsp;Zonas</button>

                            <button class="nav-link" id="tabConsolidados2" data-bs-toggle="tab"
                                data-bs-target="#consolidados2" type="button" role="tab" aria-controls="nav-profile"
                                aria-selected="false"><i class="fa-solid fa-eye"></i>&nbsp;Seguimiento compras</button>
                        </div>
                    </nav>
                    <div class="tab-content " id="nav-tabContent">
                        <div class="tab-pane fade show active " id="consolidados" role="tabpanel"
                            aria-labelledby="nav-home-tab">
                            <div class="mb-2">
                                <button class="btn btn-outline-success btn-sm" id="btnExportConsolidado">
                                    <i class="fa-solid fa-file-excel"></i>
                                    Exportar a Excel
                                </button>
                            </div>
                            <div id="handsontable2"></div>
                        </div>
                        <div class="tab-pane fade" id="detalles" role="tabpanel" aria-labelledby="nav-profile-tab">
                            <div class="mb-2">
                                <button class="btn btn-outline-success btn-sm" id="btnExportDetalle">
                                    <i class="fa-solid fa-file-excel"></i>
                                    Exportar a Excel
                                </button>
                            </div>
                            <div id="handsontable1"></div>
                        </div>
                        <div class="tab-pane fade" id="zonas" role="tabpanel" aria-labelledby="nav-profile-tab">
                            <div class="mb-2">
                                <button class="btn btn-outline-success btn-sm" id="btnExportZona">
                                    <i class="fa-solid fa-file-excel"></i>
                                    Exportar a Excel
                                </button>
                            </div>
                            <div id="handsontable3"></div>
                        </div>
                        <div class="tab-pane fade" id="consolidados2" role="tabpanel" aria-labelledby="nav-profile-tab">
                            <div class="mb-2">
                                <button class="btn btn-outline-success btn-sm" id="btnExportConso2">
                                    <i class="fa-solid fa-file-excel"></i>
                                    Exportar a Excel
                                </button>
                            </div>
                            <div id="handsontable5"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL DETALLE CONSOLIDADOS -->
    <div class="modal fade" id="modalDetalleConso" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="min-width: 100%;">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">
                        <h5></h5>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-2">
                        <button class="btn btn-outline-success btn-sm" id="btnExportDetalleConsolidado">
                            <i class="fa-solid fa-file-excel"></i>
                            Exportar a Excel
                        </button>
                    </div>
                    <div id="handsontable4"></div>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL ASIGNACIÓN PRESUPUESTO -->
    <div class="modal fade" id="modalPresupuesto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" style="min-width: 80%;">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">
                        <h5 style="font-weight: 500; color: #055160;">ASIGNACIÓN DE PRESUPUESTO EVENTO <span
                                id="tituloModalPresu" style="font-size: medium;"></span></h5>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger d-flex justify-content-center align-items-center gap-3 mb-3 mt-2"
                        role="alert">
                        <i class="fa-solid fa-triangle-exclamation fa-xl"></i>
                        <div style="font-weight: 500;">
                            El presupuesto solo podrá cargarse en el sistema hasta el día final de la convocatoria, a
                            las 5:00 PM
                        </div>
                    </div>
                    <h5 class="text-center mb-3" style="color: #055160; font-weight: 400;">CREAR PRESUPUESTO EVENTO
                        OFICINA</h5>
                    <form class="mb-1" id="formularioPresupuesto">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="idEventoPresu">Evento</label>
                                    <input type="text" id="idEventoPresu" class="form-control form-control-sm shadow-sm"
                                        name="ID_EVENTO" readonly>
                                </div>
                                <div class="form-group mt-2">
                                    <label for="eventoAnterior">Evento anterior</label>
                                    <input type="text" id="eventoAnterior"
                                        class="form-control form-control-sm shadow-sm" name="EVENTO_ANTERIOR">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="oficinaPresupuesto">Oficina</label>
                                    <select class="form-select form-select-sm shadow-sm" name="OFICINA_VENTAS"
                                        id="oficinaPresupuesto"></select>
                                </div>
                                <div class="form-group mt-2">
                                    <label for="presupuesto">Presupuesto</label>
                                    <input type="text" id="presupuesto" class="form-control form-control-sm shadow-sm"
                                        name="PRESUPUESTO">
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="d-flex justify-content-end">
                        <button id="btnPresupuesto" class="btn btn-outline-primary btn-sm">Agregar</button>
                    </div>
                    <div class="mt-2" id="containerTablaPresupuesto">

                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL SEGUIMIENTO LABORATORIOS CONFIRMADOS -->
    <!-- MODAL SEGUIMIENTO LABORATORIOS CONFIRMADOS -->
    <div class="modal fade" id="modalSeguimientoLabConfirmados" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Seguimiento Laboratorios Confirmados</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <!-- FORMULARIO -->
                    <div id="formLabConfirmado">
                        <div class="row">
                            <div class="col-md-4">
                                <label for="laboratorio" class="form-label">Laboratorio</label>
                                <select id="LabConfirmados" class="form-control form-select-sm"
                                    style="width:100%"></select>
                            </div>
                            <div class="col-md-4">
                                <label for="nombreStand" class="form-label">Nombre Stand</label>
                                <input type="text" class="form-control form-control-sm" id="nombreStand"
                                    name="nombre_stand">
                            </div>
                            <div class="col-md-4">
                                <label for="contactoEjecutivo" class="form-label">Contacto Ejecutivo</label>
                                <input type="text" class="form-control form-control-sm" id="contactoEjecutivo"
                                    name="contacto_ejecutivo">
                            </div>
                            <div class="col-md-4 mt-2">
                                <label for="responsable" class="form-label">Responsable</label>
                                <input type="text" class="form-control form-control-sm" id="responsable"
                                    name="responsable">
                            </div>
                            <div class="col-md-4 mt-2">
                                <label for="tipoStand" class="form-label">Tipo de Stand</label>
                                <select class="form-select form-select-sm" id="tipoStand" name="tipo_stand">
                                    <option value="">Seleccione</option>
                                    <option value="SILVER">Silver</option>
                                    <option value="GOLD">Gold</option>
                                    <option value="PLATINUM">Platinum</option>
                                </select>
                            </div>
                            <div class="col-md-4 mt-2">
                                <label for="valorParticipacion" class="form-label">Valor Participación</label>
                                <input type="number" class="form-control form-control-sm" id="valorParticipacion"
                                    name="valor_participacion">
                            </div>
                            <div class="col-md-4 mt-2">
                                <label for="premio" class="form-label">Premio</label>
                                <input type="number" class="form-control form-control-sm" id="premio" name="premio">
                            </div>
                            <div class="col-md-4 mt-2">
                                <label for="valorTotal" class="form-label">Valor Total</label>
                                <input type="number" class="form-control form-control-sm" id="valorTotal"
                                    name="valor_total" readonly>
                            </div>
                            <div class="col-md-4 mt-2">
                                <label for="tipoCobro" class="form-label">Tipo de Cobro</label>
                                <input type="text" class="form-control form-control-sm" id="tipoCobro"
                                    name="tipo_cobro">
                            </div>
                        </div>
                        <div class="mt-3 d-flex justify-content-end">
                            <button type="button" class="btn btn-primary btn-sm">Guardar</button>
                        </div>
                    </div>

                    <!-- TABLA HISTORIAL -->
                    <hr class="my-4">
                    <h6 class="text-muted">Historial de laboratorios confirmados</h6>
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered table-striped" id="tablaHistorial">
                            <thead class="table-light">
                                <tr>
                                    <th>Laboratorio</th>
                                    <th>Nombre Stand</th>
                                    <th>Contacto Ejecutivo</th>
                                    <th>Responsable</th>
                                    <th>Tipo de Stand</th>
                                    <th>Valor Participación</th>
                                    <th>Premio</th>
                                    <th>Valor Total</th>
                                    <th>Tipo de Cobro</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Filas generadas dinámicamente -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL ASIGNACIÓN PRESUPUESTO ZONA -->
    <div class="modal fade" id="modalPresupuestoZona" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" style="min-width: 80%;">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">
                        <h5>ASIGNACIÓN DE PRESUPUESTO ZONA</h5>
                    </div>
                    <div class="d-flex justify-content-between align-items-center gap-3">
                        <p style="margin: auto; font-weight: 700; color: #055160;">TOTAL PRESUPUESTO: <span
                                style="font-weight: 700; font-size: large;" id="totalPresupuesto">$0</span></p>
                        <button class="btn btn-outline-primary btn-sm" id="btnGuardarPresupuesto">
                            <i class="fa-solid fa-floppy-disk"></i>
                            Guardar
                        </button>
                        <button class="btn btn-outline-danger btn-sm" id="btnEliminarPresupuesto1">
                            <i class="fa-regular fa-trash-can"></i>
                            Eliminar
                        </button>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body">
                    <div id="containerTablaPresupuestoZona">

                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL PORTAFOLIO -->
    <div class="modal fade" id="modalPortafolio" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" style="min-width: 80%;">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">
                        <h5 style="font-weight: 500; color: #055160; text-transform: uppercase;">Asignación de
                            Portafolio Evento <span id="tituloModalPorta" style="font-size: medium;"></span></h5>
                    </div>
                    <div class="d-flex justify-content-between align-items-center gap-3">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger d-flex justify-content-center align-items-center gap-3 mb-3 mt-2"
                        role="alert">
                        <i class="fa-solid fa-triangle-exclamation fa-xl"></i>
                        <div style="font-weight: 500;">
                            El portafolio de materiales solo podrá cargarse en el sistema hasta el día final de la
                            convocatoria, a las 5:00 PM
                        </div>
                    </div>
                    <div class="row shadow-sm py-2 w-90 mx-auto mb-3 mt-2" id=barraFiltros>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="archivo">Cargar portafolio</label>
                                <input type="file" class="form-control form-control-sm" accept=".csv" id="archivo">
                            </div>
                        </div>
                        <div class="col-md-8 align-self-end">
                            <div class="row">
                                <div class="col-md-3">
                                    <button class="btn btn-outline-warning btn-sm w-100" title="Cargar"
                                        id="btnCargarDatos">
                                        <i class="fa-solid fa-arrow-up-from-bracket"></i>
                                        Cargar
                                    </button>
                                </div>
                                <div class="col-md-3">
                                    <button class="btn btn-outline-success btn-sm w-100" title="Guardar"
                                        id="btnGuardarDatos">
                                        <i class="fa-solid fa-floppy-disk"></i>
                                        Guardar
                                    </button>
                                </div>
                                <div class="col-md-3">
                                    <button class="btn btn-outline-dark btn-sm w-100" title="Limpiar"
                                        id="btnLimpiarDatos">
                                        <i class="fa-solid fa-eraser"></i>
                                        Limpiar
                                    </button>
                                </div>
                                <div class="col-md-3">
                                    <button class="btn btn-outline-primary btn-sm w-100" title="Ver portafolio"
                                        id="btnVerPortafolio">
                                        <i class="fa-solid fa-briefcase"></i>
                                        Ver portafolio
                                    </button>
                                </div>
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
            </div>
        </div>
    </div>
    <!-- MODAL CREACION DE EVENTOS DE CIERRES  -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Creación de eventos de cierre</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <label class="p-1">Nombre</label>
                    <input class="form-control" id="nombre_evento_cierre">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-outline-info" id="guardar_evento_cierre">Guardar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL LABORATORIOS -->
    <div class="modal fade bd-example-modal-lg" id="modal-labs" tabindex="-1" role="dialog"
        aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog modal-xl">
            <form class="form needs-validation mt-3" id="form2" onsubmit="event.preventDefault();" novalidate>
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Laboratorios participantes</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="id-evento-modal" readonly>
                        <div class="row p-1">
                            <div class="col-9 ">
                                <label class="m-1 cl_input_csv_lab">Laboratorios participantes</label>
                                <input type="file" class="form-control cl_input_csv_lab" id="lab-csv-modal"
                                    name="lab-csv-modal">
                            </div>
                            <div class="col-1">
                                <label class="m-1 ">Agregar</label>
                                <center>
                                    <button type="button"
                                        class="btn btn-outline-success shadow-sm add-row-lab-modal "><i
                                            class="fa-solid fa-plus"></i></button>
                                </center>
                            </div>
                            <div class="col-2 text-center">
                                <label class="m-1">Eliminar lab</label>
                                <center>
                                    <button type="button" class="btn btn-outline-danger shadow-sm"
                                        onClick="EliminarLabsSave()"><i class="fa-solid fa-trash "></i></button>
                                </center>
                            </div>
                        </div>
                        <div class="row" id="list-lab-modal"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-outline-success" id="guardar-lab-modal"><i
                                class="fa-solid fa-flask"></i>&nbsp;Guardar</button>
                        <button type="button" class="btn btn-outline-danger" id="cancelar-lab-modal"
                            data-bs-dismiss="modal"><i class="fa-solid fa-xmark"></i>&nbsp;Cancelar</button>
                    </div>
                </div>
            </form>
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
    <script type="text/javascript" src="../controllers/EventosComerciales.js?<?php echo  rand(); ?>"></script>
    <script>
    (function() {
        'use strict';
        var forms = document.querySelectorAll('.needs-validation');
        Array.prototype.slice.call(forms)
            .forEach(function(form) {
                form.addEventListener('submit', function(event) {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                    form.classList.add('was-validated')
                }, false)
            })
    })()
    </script>
</body>

</html>