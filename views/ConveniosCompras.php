<?php
include( '../models/funciones.php' );
session_start();
Redireccionar();

?>
<html>
<head>
<meta http-equiv="Expires" content="0">
<meta http-equiv="Last-Modified" content="0">
<meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta charset="utf-8">
<title>Administracion de convenios de compras</title>
<!-- Latest compiled and minified CSS -->
<!-- <link type="text/css" rel="stylesheet" href="../resources/bootstrap/bootstrap-5.0.2-dist/css/bootstrap.min.css"> -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<!-- <link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php  echo(rand()); ?>"/> -->
<link type="text/css" rel="stylesheet" href="../lib/SweetAlert2_V10/dist/sweetalert2.all.js?<?php  echo(rand()); ?>"/>
<link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php  echo(rand()); ?>" >
<!--<link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs.css?<?php  echo(rand()); ?>" >-->
<link type="text/css" rel="stylesheet" href="../resources/select2-bootstrap4-theme/select2-bootstrap4.css" >
<link type="text/css" rel="stylesheet" href="../resources/select2/css/select2.css" >
<link type="text/css" rel="stylesheet" href="../resources/fontawesome/css/all.css" >
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
<link rel="stylesheet" href="../resources/css/formulario.css">
<link rel="stylesheet" href="../resources/css/tab.css">
<link rel="stylesheet" href="../resources/css/calendario.css">
<link rel="stylesheet" href="../resources/css/AutoComplete.css">
<link rel="stylesheet" href="../resources/css/tablas.css">
<link rel="stylesheet" href="../resources/css/imgPre.css">
<!------------------------------------------------------------------------------------------------------------------> 
<script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php  echo(rand()); ?>"></script> 
<script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php  echo(rand()); ?>"></script> 
<script type="text/javascript" src="../resources/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.min.js?1905557934"></script> 
<script type="text/javascript" src="../lib/SweetAlert2_V10/dist/sweetalert2.all.js?<?php  echo(rand()); ?>"></script> 
<script type="text/javascript" src="../lib/js/funciones.js?<?php  echo(rand()); ?>"></script> 
<script type="text/javascript" src="../lib/js/servicios.js?<?php  echo(rand()); ?>"></script> 
<script src="https://code.highcharts.com/highcharts.js"></script> 
<script src="https://code.highcharts.com/modules/exporting.js"></script> 
<script src="https://code.highcharts.com/modules/export-data.js"></script> 
<script src="https://code.highcharts.com/modules/accessibility.js"></script> 
<script type="text/javascript" src="../lib/bootstrap-notify/bootstrap-notify.min.js"></script> 
<script type="text/javascript" src="../resources/select2/js/select2.full.min.js"></script> 
<script type="text/javascript" src="../resources/select2/js/i18n/es.js"></script> 
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.0/xlsx.full.min.js"></script> 
<script type="text/javascript" src="../controllers/ConveniosCompras.js?<?php  echo(rand()); ?>"></script>
<style>
    html {
        font-size: 0.8rem
    }
    [data-notify] {
        z-index: 9999 !important;
    }
    .notas {
        background: #FFC;
        border: 1px solid #FC0;
        border-radius: 5px;
        font-size: 10px;
        font: "Courier New", Courier, monospace;
        padding: 5px;
        width: 100%;
        height: 40px;
    }
    .form {
        border-radius: 3px;
        border : solid 1px #f1f1f1;
        font-family: Gotham, "Helvetica Neue", Helvetica, Arial, sans-serif;
        transition: all .5s ease-in-out;
    }
    .form a {
        color: #fff;
    }
    .form thead tr th, .form tfoot tr td {
        padding : 5px 3px;
        background-color: #cff4fc;
        ;
        color : #31708F;
        font-weight : bold;
        font-size : 13px;
        text-align : justify;
        min-width : 10px;
    }
    .form tbody tr td {
        transition : all 400ms ease-in;
        -webkit-transition: all 400ms ease-in;
        -moz-transition : all 400ms ease-in;
        -o-transition : all 400ms ease-in;
        -ms-transition : all 400ms ease-in;
        padding : 5px 5px;
        word-wrap : break-word;
        border : solid 0px #fff;
        border-bottom : solid 1px #fff;
        border-top : solid 1px #f1f1f1;
        border-right : solid 1px #f1f1f1;
        font-size : 12px;
    }
    .form tbody tr:nth-child(odd) {
        background-color: #fff;
        cursor : pointer;
    }
    .form tbody tr:nth-child(even) {
        background-color: #fafafa;
        cursor : pointer;
    }


    .card-header-success {
      padding: var(--bs-card-cap-padding-y) var(--bs-card-cap-padding-x);
      margin-bottom: 0;
      color: #0a4438;
      background-color: #d1f2eb !important;
    }

    .card-header-danger {
      padding: var(--bs-card-cap-padding-y) var(--bs-card-cap-padding-x);
      margin-bottom: 0;
      color: #721c24;
      background-color: #f8d7da !important;
    }

    .card-header-warning {
      padding: var(--bs-card-cap-padding-y) var(--bs-card-cap-padding-x);
      margin-bottom: 0;
      color: #856404;
      background-color: #fff3cd !important;
    }

    #ModalAdjunto .modal-content {
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    #ModalAdjunto .modal-header {
      border-bottom: 2px solid rgba(255,255,255,0.1);
    }
    
    #ModalAdjunto .modal-footer {
      border-top: 1px solid #e9ecef;
    }
    
    #pdfPlaceholder {
      opacity: 0.7;
    }
    .select2-container--default .select2-results__option--highlighted[aria-selected] {
        background-color: #cff4fc;
        color: #055160;
    } 
</style>
</head>
<body>
    <!-- alert -->
    <div class="alert alert-info">
      <i class="fa-solid fa-star fa-flip"></i>&nbsp;0312 - ADMINISTRACIÓN DE CONVENIOS
    </div>
    <div class="tabs-card">
  <!-- Pestañas unificadas -->
  <div class="tabs-header">
    <ul class="nav nav-tabs" id="borderedTab" role="tablist">
        <li class="nav-item" id="liCreacion" role="presentation">
            <button class="nav-link active"
                    id="tabCreacion"
                    data-bs-toggle="tab"
                    data-bs-target="#dvCreacion"
                    type="button"
                    role="tab"
                    aria-controls="dvCreacion"
                    aria-selected="true">
                <i class="fa-solid fa-plus me-2"></i>
                Creación
                <span class="badge bg-primary ms-2" id="n_creacion"></span>
            </button>
        </li>

        <li class="nav-item" id="liSeguimiento" role="presentation">
            <button class="nav-link"
                    id="tabSeguimiento"
                    data-bs-toggle="tab"
                    data-bs-target="#dvSeguimiento"
                    type="button"
                    role="tab"
                    aria-controls="dvSeguimiento"
                    aria-selected="false">
                <i class="fa-solid fa-person-running me-2"></i>
                Seguimiento
                <span class="badge bg-info ms-2" id="n_seguimiento"></span>
            </button>
        </li>
    </ul>
</div>
<div class="card-body"> 
  <div class="tab-content " id="borderedTabContent">
    <!-- TAB CREACIÓN -->
    <div class="tab-pane fade show active" id="dvCreacion" role="tabpanel">
      <div class="m-3">
        <div class="row">
          <div class="col-md-6">
            <div class="card">
                <div class="card-header alert-info">
                    <h5 class="mb-0"><i class="fas fa-file-contract me-2"></i>CONDICIONES GENERALES DE CONVENIO</h5>
                </div>
                <div class="card-body">
                    <form class="row g-3">
                        <!-- Sociedad -->
                        <div class="col-md-6">
                            <label for="inSociedad">Sociedad</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light"><i class="fas fa-building opacity-50"></i></span>
                                <select id="inSociedad" class="form-control"></select>
                            </div>
                        </div>

                        <!-- Grupo de artículos -->
                        <div class="col-md-6">
                            <label for="inGrupoArticulo">Grupo de artículos</label>
                            <div class="input-group">
                                <select id="inGrupoArticulo" class="form-control" multiple style="width:100%"></select>
                            </div>
                        </div>

                        <!-- Descripción -->
                        <div class="col-12">
                            <label for="txtDescripcion">Descripción</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light"><i class="fas fa-align-left opacity-50"></i></span>
                                <input type="text" id="txtDescripcion" class="form-control text-uppercase" autocomplete="off">
                            </div>
                        </div>

                        <!-- Periodo -->
                        <div class="col-12">
                            <label>Periodo</label>
                            <div class="row g-2">
                                <div class="col-md-6">
                                    <div class="input-group">
                                        <span class="input-group-text bg-light"><i class="fas fa-calendar opacity-50"></i></span>
                                        <input type="text" id="fhInicio" class="form-control" readonly placeholder="Fecha inicial">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="input-group">
                                        <span class="input-group-text bg-light"><i class="fas fa-calendar opacity-50"></i></span>
                                        <input type="text" id="fhFinal" class="form-control" readonly placeholder="Fecha final">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Campos de rebate (mostrados) -->
                        <div class="col-md-6">
                            <label for="rebateTrimestre"><i class="fas fa-percent me-2"></i>Rebate Volumen Compras Trimestre</label>
                            <input type="text" id="rebateTrimestre" class="form-control form-percent">
                        </div>

                        <div class="col-md-6">
                            <label for="rebateCodificacion"><i class="fas fa-percent me-2"></i>Rebate manejo de linea (Codificación)</label>
                            <input type="text" id="rebateCodificacion" class="form-control form-percent">
                        </div>

                        <div class="col-md-6">
                            <label for="rebateRotacion"><i class="fas fa-percent me-2"></i>Rebate x rotacion</label>
                            <input type="text" id="rebateRotacion" class="form-control form-percent">
                        </div>

                        <div class="col-md-6">
                            <label for="rebateInformacion"><i class="fas fa-percent me-2"></i>Rebate x informacion</label>
                            <input type="text" id="rebateInformacion" class="form-control form-percent">
                        </div>

                        <div class="col-md-6">
                            <label for="rebateDevoluciones"><i class="fas fa-percent me-2"></i>Rebate no devoluciones</label>
                            <input type="text" id="rebateDevoluciones" class="form-control form-percent">
                        </div>

                        <div class="col-md-6">
                            <label for="rebateDinamica"><i class="fas fa-percent me-2"></i>Dinamica Comercial</label>
                            <input type="text" id="rebateDinamica" class="form-control form-percent">
                        </div>

                        <div class="col-md-6">
                            <label for="rebateInventario"><i class="fas fa-percent me-2"></i>Manejo dias inventario</label>
                            <input type="text" id="rebateInventario" class="form-control form-percent">
                        </div>

                        <div class="col-md-6">
                            <label for="rebateImpactos"><i class="fas fa-percent me-2"></i>Distribucion numerica /impactos</label>
                            <input type="text" id="rebateImpactos" class="form-control form-percent">
                        </div>

                        <div class="col-md-12">
                            <label for="rebateLogistica"><i class="fas fa-percent me-2"></i>Logistica</label>
                            <input type="text" id="rebateLogistica" class="form-control form-percent">
                        </div>

                        <!-- Campos ocultos (mantenidos pero no visibles) -->
                        <div class="col-md-6" style="display: none">
                            <label for="rebateMes"><i class="fas fa-percent me-2"></i>Rebate Volumen Compras Mensual</label>
                            <input type="text" id="rebateMes" class="form-control form-percent">
                        </div>

                        <div class="col-md-6" style="display: none">
                            <label for="rebateSemestre"><i class="fas fa-percent me-2"></i>Rebate Volumen Compras Semestre</label>
                            <input type="text" id="rebateSemestre" class="form-control form-percent">
                        </div>

                        <div class="col-md-6" style="display: none">
                            <label for="rebateAnio"><i class="fas fa-percent me-2"></i>Rebate Volumen Compras Año</label>
                            <input type="text" id="rebateAnio" class="form-control form-percent">
                        </div>
                    </form>
                </div>
            </div>
          </div>
          <div class="col-md-6">
            <!-- CARD OBJETIVOS TRIMESTRALES POR IMPACTOS -->
            <div class="card mb-3">
                <div class="card-header alert-info">
                    <h5 class="mb-0"><i class="fas fa-bullseye me-2"></i>OBJETIVOS TRIMESTRALES POR IMPACTOS</h5>
                </div>
                <div class="card-body">
                    <form class="row g-3">
                        <!-- Trimestre 1 y 2 -->
                        <div class="col-md-6">
                            <label for="Q1Impactos"><i class="fas fa-hashtag me-2"></i>Objetivo Impactos (Q1)</label>
                            <input type="text" id="Q1Impactos" class="form-control form-percent">
                        </div>
                        <div class="col-md-6">
                            <label for="Q2Impactos"><i class="fas fa-hashtag me-2"></i>Objetivo Impactos (Q2)</label>
                            <input type="text" id="Q2Impactos" class="form-control form-percent">
                        </div>

                        <!-- Trimestre 3 y 4 -->
                        <div class="col-md-6">
                            <label for="Q3Impactos"><i class="fas fa-hashtag me-2"></i>Objetivo Impactos (Q3)</label>
                            <input type="text" id="Q3Impactos" class="form-control form-percent">
                        </div>
                        <div class="col-md-6">
                            <label for="Q4Impactos"><i class="fas fa-hashtag me-2"></i>Objetivo Impactos (Q4)</label>
                            <input type="text" id="Q4Impactos" class="form-control form-percent">
                        </div>

                        <!-- Campo oculto -->
                        <div class="col-md-12" style="display: none">
                            <label for="anioImpactos"><i class="fas fa-hashtag me-2"></i>Objetivo Impactos Año</label>
                            <input type="text" id="anioImpactos" class="form-control form-percent">
                        </div>
                    </form>
                </div>
            </div>
            <!-- CARD OBJETIVOS TRIMESTRALES POR COMPRAS -->
            <div class="card mb-3">
                <div class="card-header alert-info">
                    <h5 class="mb-0"><i class="fas fa-chart-line me-2"></i>OBJETIVOS TRIMESTRALES POR COMPRAS</h5> 
                </div>
                <div class="card-body">
                    <form class="row g-3">
                        <!-- Trimestre 1 y 2 -->
                        <div class="col-md-6">
                            <label for="Q1"><i class="fas fa-dollar-sign me-2"></i>Objetivo Compras (Q1)</label>
                            <input type="text" id="Q1" class="form-control form-percent">
                        </div>
                        <div class="col-md-6">
                            <label for="Q2"><i class="fas fa-dollar-sign me-2"></i>Objetivo Compras (Q2)</label>
                            <input type="text" id="Q2" class="form-control form-percent">
                        </div>

                        <!-- Trimestre 3 y 4 -->
                        <div class="col-md-6">
                            <label for="Q3"><i class="fas fa-dollar-sign me-2"></i>Objetivo Compras (Q3)</label>
                            <input type="text" id="Q3" class="form-control form-percent">
                        </div>
                        <div class="col-md-6">
                            <label for="Q4"><i class="fas fa-dollar-sign me-2"></i>Objetivo Compras (Q4)</label>
                            <input type="text" id="Q4" class="form-control form-percent">
                        </div>

                        <!-- Campo oculto -->
                        <div class="col-md-12" style="display: none">
                            <label for="objetivoAnio"><i class="fas fa-dollar-sign me-2"></i>Objetivo Compras Año</label>
                            <input type="text" id="objetivoAnio" class="form-control form-percent">
                        </div>
                    </form>
                </div>
            </div>
            <!-- CARD OBJETIVOS TRIMESTRALES POR ROTACION -->
            <div class="card mb-3">
                <div class="card-header alert-info">
                    <H5 class="mb-0"><i class="fas fa-sync-alt me-2"></i>OBJETIVOS TRIMESTRALES POR ROTACIÓN</H5>
                </div>
                <div class="card-body">
                    <form class="row g-3">
                        <!-- Trimestre 1 y 2 -->
                        <div class="col-md-6">
                            <label for="Q1Rotacion"><i class="fas fa-dollar-sign me-2"></i>Objetivo Rotación (Q1)</label>
                            <input type="text" id="Q1Rotacion" class="form-control form-percent">
                        </div>
                        <div class="col-md-6">
                            <label for="Q2Rotacion"><i class="fas fa-dollar-sign me-2"></i>Objetivo Rotación (Q2)</label>
                            <input type="text" id="Q2Rotacion" class="form-control form-percent">
                        </div>

                        <!-- Trimestre 3 y 4 -->
                        <div class="col-md-6">
                            <label for="Q3Rotacion"><i class="fas fa-dollar-sign me-2"></i>Objetivo Rotación (Q3)</label>
                            <input type="text" id="Q3Rotacion" class="form-control form-percent">
                        </div>
                        <div class="col-md-6">
                            <label for="Q4Rotacion"><i class="fas fa-dollar-sign me-2"></i>Objetivo Rotación (Q4)</label>
                            <input type="text" id="Q4Rotacion" class="form-control form-percent">
                        </div>

                        <!-- Campo oculto -->
                        <div class="col-md-12" style="display: none">
                            <label for="anioRotacion"><i class="fas fa-dollar-sign me-2"></i>Objetivo Rotación Año</label>
                            <input type="text" id="anioRotacion" class="form-control form-percent">
                        </div>
                    </form>
                </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header alert-info">
              <h5 class="mb-0"><i class="fa-solid fa-clipboard fa-flip me-2"></i>NOTAS</h5>
          </div>
          <div class="card-body">
              <form class="row g-3">
                  <!-- Campo Notas -->
                  <div class="col-md-8">
                      <label for="txtNotas">Notas</label>
                      <div class="input-group">
                          <span class="input-group-text bg-light"><i class="fas fa-sticky-note opacity-50"></i></span>
                          <textarea class="form-control notas" id="txtNotas" rows="4"></textarea>
                      </div>
                  </div>

                  <!-- Campo PDF -->
                  <div class="col-md-4">
                      <label for="adjunto">PDF Convenio</label>
                      <div class="input-group">
                          <span class="input-group-text bg-light"><i class="fas fa-file-pdf opacity-50"></i></span>
                          <input type="file" id="adjunto" name="adjunto" class="form-control" accept=".pdf">
                      </div>
                  </div>
              </form>
          </div>
        </div>
        <div class="mt-3">
            <button type="button" class="btn btn-outline-success" id="btnGuardar">
                <i class="fas fa-floppy-disk me-2"></i> Guardar
            </button>
            <button type="button" class="btn btn-outline-secondary" id="btnLimpiar" onclick="limpiarFormulario()">
                <i class="far fa-file me-2"></i> Limpiar
            </button>
        </div>
      </div>
    </div>  
    <!-- TAB SEGUIMIENTO -->
    <div class="tab-pane fade show" id="dvSeguimiento" role="tabpanel" >
      <div class="text-start mx-3"><button class="btn btn-lg btn-outline-success mb-3 " id="" onClick="buscarConvenios();"><i class="fa-solid fa-floppy-disk"></i> Actualizar</button></div>
    <div class=" card mx-3" id="dvResult"></div>
    </div>
  </div>
</div>
</div>

<!-- Modal CONVENIO 2024 VITALIS -->
<div class="modal fade" id="modalDetConvenio" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"  aria-hidden="true">
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header" style="background-color: #CFF4FC; color: #055160;">
        <h5 class="modal-title" id="titulo-convenio"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body"> 
        <!--Oculto por el momento-->
        <div class="row">
          <div class="col-md-9">
            <div class="card">
              <div class="card-header alert-info"><h5 class="mb-0"><i class="fa-solid fa-chart-simple fa-flip me-2"></i>CUMPLIMIENTO TRIMESTRAL GRAFICO</h5></div>
              <div class="card-body">
                <div id="imgContainer1" style="height: 85vh;"></div>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
          
            <div class="card">
              <div class="card-header alert-info"><h5 class="mb-0"><i class="fa-solid fa-list me-2"></i>CUMPLIMIENTO TOTAL AÑO</h5></div>
              <div class="card-body p-0">
                <ul class="list-group list-group-flush mb-3">
                  <li class="list-group-item mb-3">
                    <div class="row">
                      <div class="col-sm-9">
                        <h4 class="h3 mb-0 me-4" id="detAnioCumplimientoTotal"></h4>
                      </div>
                      <div class="col-sm-3 text-center"><i class="fa-solid fa-sack-dollar text-warning fa-2x opacity-50"></i>
                        <p class="mb-0 no-wrap">Valor</p>
                      </div>
                    </div>
                  </li>

                  <div class="card-header alert-info d-flex align-items-center"> <i class="fa-solid fa-boxes-stacked fa-flip me-2"></i>&nbsp;<h5>SELL IN</h5></div>
                  <li class="list-group-item">
                    <div class="row">
                      <div class="col-sm-9">
                        <h4 class="h3 mb-0 me-4" id="detAnioObj"></h4>
                      </div>
                      <div class="col-sm-3 text-center"><i class="fa-solid fa-bullseye text-danger fa-2x opacity-50"></i>
                        <p class="mb-0">Objetivo </p>
                      </div>
                    </div>
                  </li>

                  <li class="list-group-item">
                    <div class="row">
                      <div class="col-sm-9">
                        <h4 class="h3 mb-0 me-4" id="detAnioCompra"></h4>
                      </div>
                      <div class="col-sm-3 text-center"><i class="fa-brands fa-shopify text-success fa-2x opacity-50"></i>
                        <p class="mb-0 no-wrap">Compras</p>
                      </div>
                    </div>
                  </li>
                  <li class="list-group-item">
                    <div class="row">
                      <div class="col-sm-9">
                        <h4 class="h3 mb-0 me-4" id="detAnioCumpleCompras"></h4>
                      </div>
                      <div class="col-sm-3 text-center"><i class="fa-solid fa-percent text-secondary fa-2x opacity-50"></i>
                        <p class="mb-0">Cumpto.</p>
                      </div>
                    </div>
                  </li>
                </ul>
                <ul class="list-group list-group-flush mb-3">
                  <div class="card-header alert-info d-flex align-items-center"> <i class="fa-solid fa-box fa-flip me-2"></i>&nbsp;<h5>SELL OUT</h5></div>
                  <li class="list-group-item">
                    <div class="row">
                      <div class="col-sm-9">
                        <h4 class="h3 mb-0 me-4" id="detAnioObjVentas"></h4>
                      </div>
                      <div class="col-sm-3 text-center"><i class="fa-solid fa-bullseye text-danger fa-2x opacity-50"></i>
                        <p class="mb-0">Objetivo</p>
                      </div>
                    </div>
                  </li>
                  <li class="list-group-item">
                    <div class="row">
                      <div class="col-sm-9">
                        <h4 class="h3 mb-0 me-4" id="detAnioVentas"></h4>
                      </div>
                      <div class="col-sm-3 text-center"><i class="fa-solid fa-chart-line text-primary fa-2x opacity-50"></i>
                        <p class="mb-0">Ventas</p>
                      </div>
                    </div>
                  </li>
                  <li class="list-group-item">
                    <div class="row">
                      <div class="col-sm-9">
                        <h4 class="h3 mb-0 me-4" id="detAnioCumpleVentas"></h4>
                      </div>
                      <div class="col-sm-3 text-center"><i class="fa-solid fa-percent text-secondary fa-2x opacity-50"></i>
                        <p class="mb-0">Cumpto.</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        
        <!-- Sección Compras Mes a Mes -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-info d-flex justify-content-between align-items-center py-3">
                <div class="d-flex align-items-center">
                  <i class="fas fa-shopping-cart fa-lg fap-flip me-3"></i>
                  <h5 class="mb-0 fw-bold">COMPRAS MENSUALES</h5>
                </div>
                <button class="btn btn-light btn-sm" id="btn-div-mes">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
              <div class="card-body p-0">
                <div id="dvComprasMensuales" class="collapse">
                  <!-- Contenido dinámico irá aquí -->
                  <div class="p-3 text-center text-muted">
                    <i class="fas fa-spinner fa-spin me-2"></i>
                    Cargando datos mensuales...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- Sección Seguimiento Rebates Trimestrales -->
<div class="row mb-4">
  <div class="col-12">
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-info d-flex justify-content-between align-items-center py-3" style="border-radius: 0;">
        <div class="d-flex align-items-center">
          <i class="fas fa-flag-checkered fa-lg me-3"></i>
          <h5 class="mb-0 fw-bold">SEGUIMIENTO DE REBATES TRIMESTRALES</h5>
        </div>
        <button class="btn btn-light btn-sm" id="btn-div-trimestre">
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
      <div class="card-body p-0">
        <div id="dvComprasTrimestrales" class="collapse">
          <div class="row g-3 p-3">
            <!-- Trimestre Q1 -->
            <div class="col-md-6 col-lg-3">
              <div class="card h-100">
                <div class="card-header bg-light" style="border-radius: 0;">
                  <h6 class="mb-0" style="color: #055160;"><i class="fas fa-calendar me-2"></i>PRIMER TRIMESTRE Q1</h6>
                </div>
                
                <!-- Rebate por volumen de compras (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-shopping-cart me-2"></i>REBATE POR VOLUMEN DE COMPRAS</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbCompras1"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Objetivo</small>
                        <h5 class="mb-0" id="detQ1Obj"></h5>
                      </div>
                      <i class="fas fa-bullseye text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Compras</small>
                        <h5 class="mb-0" id="detQ1Compra"></h5>
                      </div>
                      <i class="fas fa-cart-arrow-down text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbCompras1"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Cumplimiento</small>
                        <h5 class="mb-0" id="detQ1Cumple"></h5>
                      </div>
                      <i class="fas fa-percent text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por manejo de línea (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-code me-2"></i>REBATE POR MANEJO DE LÍNEA</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbManejo1"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbManejo1"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por no devoluciones (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-undo-alt me-2"></i>REBATE POR NO DEVOLUCIONES</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbDevoluciones1"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbDevoluciones1"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por dinámica comercial (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-chart-line me-2"></i>REBATE POR DINÁMICA COMERCIAL</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbDinamica1"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbDinamica1"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por manejo días inventario (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-boxes me-2"></i>REBATE POR MANEJO DÍAS INVENTARIO</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbInventario1"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbInventario1"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por logística (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-truck me-2"></i>REBATE POR LOGÍSTICA</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbLogistica1"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbLogistica1"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por impactos (Azul) -->
                <div class="card-header bg-primary " style="border-radius: 0; color: #055160;">
                  <h6 class="mb-0"><i class="fas fa-bullseye me-2"></i>REBATE POR IMPACTOS</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbImpactos1"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Objetivo</small>
                        <h5 class="mb-0" id="detQ1ObjImpactos"></h5>
                      </div>
                      <i class="fas fa-bullseye text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Impactos</small>
                        <h5 class="mb-0" id="detQ1Impactos"></h5>
                      </div>
                      <i class="fas fa-bullseye text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbImpactos1"></h5>
                      </div>
                      <i class="fas fa-handshake text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Cumplimiento</small>
                        <h5 class="mb-0" id="cumpleImpactos1"></h5>
                      </div>
                      <i class="fas fa-percent text-primary"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por rotación (Rojo) -->
                <div class="card-header-danger">
                  <h6 class="mb-0"><i class="fas fa-sync-alt me-2"></i>REBATE POR ROTACIÓN</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbVentas1"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Objetivo</small>
                        <h5 class="mb-0" id="detQ1ObjRotacion"></h5>
                      </div>
                      <i class="fas fa-bullseye text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Ventas</small>
                        <h5 class="mb-0" id="detQ1Ventas"></h5>
                      </div>
                      <i class="fas fa-chart-line text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbRotacion1"></h5>
                      </div>
                      <i class="fas fa-handshake text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Cumplimiento</small>
                        <h5 class="mb-0" id="cumpleVentas1"></h5>
                      </div>
                      <i class="fas fa-percent text-danger"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Valor total rebate (Amarillo) -->
                <div class="card-header-warning"">
                  <h6 class="mb-0"><i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE Q1</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Total</small>
                        <h5 class="mb-0" id="vlrTotalRbQ1"></h5>
                      </div>
                      <i class="fas fa-money-bill-wave text-warning"></i>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Trimestre Q2 -->
            <div class="col-md-6 col-lg-3">
              <div class="card h-100">
                <div class="card-header bg-light" style="border-radius: 0;">
                  <h6 class="mb-0" style="color: #055160;"><i class="fas fa-calendar me-2"></i>SEGUNDO TRIMESTRE Q2</h6>
                </div>
                
                <!-- Rebate por volumen de compras (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-shopping-cart me-2"></i>REBATE POR VOLUMEN DE COMPRAS</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbCompras2"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Objetivo</small>
                        <h5 class="mb-0" id="detQ2Obj"></h5>
                      </div>
                      <i class="fas fa-bullseye text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Compras</small>
                        <h5 class="mb-0" id="detQ2Compra"></h5>
                      </div>
                      <i class="fas fa-cart-arrow-down text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbCompras2"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Cumplimiento</small>
                        <h5 class="mb-0" id="detQ2Cumple"></h5>
                      </div>
                      <i class="fas fa-percent text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por manejo de línea (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-code me-2"></i>REBATE POR MANEJO DE LÍNEA</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbManejo2"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbManejo2"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por no devoluciones (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-undo-alt me-2"></i>REBATE POR NO DEVOLUCIONES</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbDevoluciones2"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbDevoluciones2"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por dinámica comercial (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-chart-line me-2"></i>REBATE POR DINÁMICA COMERCIAL</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbDinamica2"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbDinamica2"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por manejo días inventario (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-boxes me-2"></i>REBATE POR MANEJO DÍAS INVENTARIO</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbInventario2"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbInventario2"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por logística (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-truck me-2"></i>REBATE POR LOGÍSTICA</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbLogistica2"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbLogistica2"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por impactos (Azul) -->
                <div class="card-header bg-primary " style="border-radius: 0; color: #055160;">
                  <h6 class="mb-0"><i class="fas fa-bullseye me-2"></i>REBATE POR IMPACTOS</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbImpactos2"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Objetivo</small>
                        <h5 class="mb-0" id="detQ2ObjImpactos"></h5>
                      </div>
                      <i class="fas fa-bullseye text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Impactos</small>
                        <h5 class="mb-0" id="detQ2Impactos"></h5>
                      </div>
                      <i class="fas fa-bullseye text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbImpactos2"></h5>
                      </div>
                      <i class="fas fa-handshake text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Cumplimiento</small>
                        <h5 class="mb-0" id="cumpleImpactos2"></h5>
                      </div>
                      <i class="fas fa-percent text-primary"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por rotación (Rojo) -->
                <div class="card-header-danger">
                  <h6 class="mb-0"><i class="fas fa-sync-alt me-2"></i>REBATE POR ROTACIÓN</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbVentas2"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Objetivo</small>
                        <h5 class="mb-0" id="detQ2ObjRotacion"></h5>
                      </div>
                      <i class="fas fa-bullseye text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Ventas</small>
                        <h5 class="mb-0" id="detQ2Ventas"></h5>
                      </div>
                      <i class="fas fa-chart-line text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbRotacion2"></h5>
                      </div>
                      <i class="fas fa-handshake text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Cumplimiento</small>
                        <h5 class="mb-0" id="cumpleVentas2"></h5>
                      </div>
                      <i class="fas fa-percent text-danger"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Valor total rebate (Amarillo) -->
                <div class="card-header-warning">
                  <h6 class="mb-0"><i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE Q2</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Total</small>
                        <h5 class="mb-0" id="vlrTotalRbQ2"></h5>
                      </div>
                      <i class="fas fa-money-bill-wave text-warning"></i>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Trimestre Q3 -->
            <div class="col-md-6 col-lg-3">
              <div class="card h-100">
                <div class="card-header bg-light" style="border-radius: 0;">
                  <h6 class="mb-0" style="color: #055160;"><i class="fas fa-calendar me-2"></i>TERCER TRIMESTRE Q3</h6>
                </div>
                
                <!-- Rebate por volumen de compras (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-shopping-cart me-2"></i>REBATE POR VOLUMEN DE COMPRAS</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbCompras3"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Objetivo</small>
                        <h5 class="mb-0" id="detQ3Obj"></h5>
                      </div>
                      <i class="fas fa-bullseye text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Compras</small>
                        <h5 class="mb-0" id="detQ3Compra"></h5>
                      </div>
                      <i class="fas fa-cart-arrow-down text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbCompras3"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Cumplimiento</small>
                        <h5 class="mb-0" id="detQ3Cumple"></h5>
                      </div>
                      <i class="fas fa-percent text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por manejo de línea (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-code me-2"></i>REBATE POR MANEJO DE LÍNEA</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbManejo3"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbManejo3"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por no devoluciones (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-undo-alt me-2"></i>REBATE POR NO DEVOLUCIONES</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbDevoluciones3"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbDevoluciones3"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por dinámica comercial (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-chart-line me-2"></i>REBATE POR DINÁMICA COMERCIAL</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbDinamica3"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbDinamica3"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por manejo días inventario (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-boxes me-2"></i>REBATE POR MANEJO DÍAS INVENTARIO</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbInventario3"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbInventario3"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por logística (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-truck me-2"></i>REBATE POR LOGÍSTICA</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbLogistica3"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbLogistica3"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por impactos (Azul) -->
                <div class="card-header bg-primary " style="border-radius: 0; color: #055160;">
                  <h6 class="mb-0"><i class="fas fa-bullseye me-2"></i>REBATE POR IMPACTOS</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbImpactos3"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Objetivo</small>
                        <h5 class="mb-0" id="detQ3ObjImpactos"></h5>
                      </div>
                      <i class="fas fa-bullseye text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Impactos</small>
                        <h5 class="mb-0" id="detQ3Impactos"></h5>
                      </div>
                      <i class="fas fa-bullseye text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbImpactos3"></h5>
                      </div>
                      <i class="fas fa-handshake text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Cumplimiento</small>
                        <h5 class="mb-0" id="cumpleImpactos3"></h5>
                      </div>
                      <i class="fas fa-percent text-primary"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por rotación (Rojo) -->
                <div class="card-header-danger">
                  <h6 class="mb-0"><i class="fas fa-sync-alt me-2"></i>REBATE POR ROTACIÓN</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbVentas3"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Objetivo</small>
                        <h5 class="mb-0" id="detQ3ObjRotacion"></h5>
                      </div>
                      <i class="fas fa-bullseye text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Ventas</small>
                        <h5 class="mb-0" id="detQ3Ventas"></h5>
                      </div>
                      <i class="fas fa-chart-line text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbRotacion3"></h5>
                      </div>
                      <i class="fas fa-handshake text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Cumplimiento</small>
                        <h5 class="mb-0" id="cumpleVentas3"></h5>
                      </div>
                      <i class="fas fa-percent text-danger"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Valor total rebate (Amarillo) -->
                <div class="card-header-warning">
                  <h6 class="mb-0"><i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE Q3</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Total</small>
                        <h5 class="mb-0" id="vlrTotalRbQ3"></h5>
                      </div>
                      <i class="fas fa-money-bill-wave text-warning"></i>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Trimestre Q4 -->
            <div class="col-md-6 col-lg-3">
              <div class="card h-100">
                <div class="card-header bg-light" style="border-radius: 0;">
                  <h6 class="mb-0" style="color: #055160;"><i class="fas fa-calendar me-2"></i>CUARTO TRIMESTRE Q4</h6>
                </div>
                
                <!-- Rebate por volumen de compras (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-shopping-cart me-2"></i>REBATE POR VOLUMEN DE COMPRAS</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbCompras4"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Objetivo</small>
                        <h5 class="mb-0" id="detQ4Obj"></h5>
                      </div>
                      <i class="fas fa-bullseye text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Compras</small>
                        <h5 class="mb-0" id="detQ4Compra"></h5>
                      </div>
                      <i class="fas fa-cart-arrow-down text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbCompras4"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Cumplimiento</small>
                        <h5 class="mb-0" id="detQ4Cumple"></h5>
                      </div>
                      <i class="fas fa-percent text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por manejo de línea (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-code me-2"></i>REBATE POR MANEJO DE LÍNEA</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbManejo4"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbManejo4"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por no devoluciones (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-undo-alt me-2"></i>REBATE POR NO DEVOLUCIONES</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbDevoluciones4"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbDevoluciones4"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por dinámica comercial (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-chart-line me-2"></i>REBATE POR DINÁMICA COMERCIAL</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbDinamica4"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbDinamica4"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por manejo días inventario (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-boxes me-2"></i>REBATE POR MANEJO DÍAS INVENTARIO</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbInventario4"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbInventario4"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por logística (Verde) -->
                <div class="card-header-success">
                  <h6 class="mb-0"><i class="fas fa-truck me-2"></i>REBATE POR LOGÍSTICA</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbLogistica4"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-success"></i>
                    </div>
                  </li>
                  <li class="list-group-item ...">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbLogistica4"></h5>
                      </div>
                      <i class="fas fa-handshake text-success"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por impactos (Azul) -->
                <div class="card-header bg-primary " style="border-radius: 0; color: #055160;">
                  <h6 class="mb-0"><i class="fas fa-bullseye me-2"></i>REBATE POR IMPACTOS</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbImpactos4"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Objetivo</small>
                        <h5 class="mb-0" id="detQ4ObjImpactos"></h5>
                      </div>
                      <i class="fas fa-bullseye text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Impactos</small>
                        <h5 class="mb-0" id="detQ4Impactos"></h5>
                      </div>
                      <i class="fas fa-bullseye text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbImpactos4"></h5>
                      </div>
                      <i class="fas fa-handshake text-primary"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Cumplimiento</small>
                        <h5 class="mb-0" id="cumpleImpactos4"></h5>
                      </div>
                      <i class="fas fa-percent text-primary"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Rebate por rotación (Rojo) -->
                <div class="card-header-danger">
                  <h6 class="mb-0"><i class="fas fa-sync-alt me-2"></i>REBATE POR ROTACIÓN</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Valor</small>
                        <h5 class="mb-0" id="vlrRbVentas4"></h5>
                      </div>
                      <i class="fas fa-dollar-sign text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Objetivo</small>
                        <h5 class="mb-0" id="detQ4ObjRotacion"></h5>
                      </div>
                      <i class="fas fa-bullseye text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Ventas</small>
                        <h5 class="mb-0" id="detQ4Ventas"></h5>
                      </div>
                      <i class="fas fa-chart-line text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Convenio</small>
                        <h5 class="mb-0" id="pcjRbRotacion4"></h5>
                      </div>
                      <i class="fas fa-handshake text-danger"></i>
                    </div>
                  </li>
                  <li class="list-group-item ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Cumplimiento</small>
                        <h5 class="mb-0" id="cumpleVentas4"></h5>
                      </div>
                      <i class="fas fa-percent text-danger"></i>
                    </div>
                  </li>
                </ul>
                
                <!-- Valor total rebate (Amarillo) -->
                <div class="card-header-warning">
                  <h6 class="mb-0"><i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE Q4</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <small class="text-muted">Total</small>
                        <h5 class="mb-0" id="vlrTotalRbQ4"></h5>
                      </div>
                      <i class="fas fa-money-bill-wave text-warning"></i>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
        <!---en caso de otra fila aqui es la vuelta------> 
      </div>
       <div class="modal-footer">
        <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal PDF Mejorado -->
<!---Modal PDF------>
<div class="modal fade" id="ModalAdjunto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content text-center">
      <div class="modal-header" style="background-color: #CFF4FC; color: #055160;">
        <h5 class="modal-title" id="exampleModalLabel"> <i class="fa-solid fa-file fa-flip mx-3"></i>DOCUMENTO ADJUNTO</h5>
        <button type="button" class="btn-close me-3" style="color: #055160;" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="ContainerPDF"> </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
<div id="Bloquear" style="display:none;"></div>
<div class="centrado-porcentual"></div>
</body>
</html>
