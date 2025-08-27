<?php  session_start(); ?>
<!doctype html>
<html>

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Zonas de ventas </title>
<!-- Bootstrap 5 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

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

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@8/dist/sweetalert2.min.css" id="theme-styles">

</head>

<body>

<input type="hidden" id="Organizacion" value="<?php if(!empty($_SESSION["ses_NumOrg"])) {echo  $_SESSION["ses_NumOrg"];} ?>" readonly>
<input type="hidden" id="Rol"          value="<?php if(!empty($_SESSION["ses_RolesId"] )){ echo $_SESSION["ses_RolesId"] ;}?>" readonly>
<input type="hidden" id="id" readonly value="0">




<div class="panel with-nav-tabs panel-info">

  <div class="card-header p-0 bg-white border-0">
    <ul class="nav nav-tabs custom-tabs nav-justified" role="tablist">
      <li class="nav-item">
        <button class="nav-link active" id="tab1" data-bs-toggle="tab" data-bs-target="#principal" type="button">
          <i class="fa fa-truck me-2"></i> Creacion/Modificacion
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" id="tab2" data-bs-toggle="tab" data-bs-target="#listado" type="button">
          <i class="fa fa-file-text me-2"></i> Listado Zonas
        </button>
      </li>
    </ul>
  </div>
  <div class="container my-4">
    <div class="card-body">
      <div class="tab-content" id="myTabContent">
        <div class="alert alert-info mb-4 ">
          <i class="fa-solid fa-star fa-flip"></i> 0412 - ZONA DE VENTAS
        </div>
        <div class="tab-pane active" id="principal" role="tabpanel">
          <div class="container my-3">
            <div class="card shadow-sm" style="max-width: 70%; margin: 0 auto;">
              <div class="card-header">
                <h5 class="mb-0"><i class="fa fa-map me-2"></i> Gestión de Zonas</h5>
              </div>
              <div class="card-body">
                <form class="row g-3">
                  
                  <!-- Oficina -->
                  <div class="col-12">
                    <label for="oficina" class="form-label">Oficina</label>
                    <select class="form-select form-select-sm" id="oficina"></select>
                  </div>

                  <!-- Zona -->
                  <div class="col-12 col-md-6">
                    <label for="codigo_zona" class="form-label">Zona</label>
                    <input type="text" class="form-control form-control-sm" id="codigo_zona" maxlength="6" onKeyPress="return exclusion(event)">
                  </div>

                  <!-- Descripción zona -->
                  <div class="col-12 col-md-6">
                    <label for="descripcion" class="form-label">Descripción zona</label>
                    <input type="text" class="form-control form-control-sm" id="descripcion" maxlength="120" onKeyPress="return exclusion(event)">
                  </div>

                  <!-- Checkboxes -->
                  <div class="col-12">
                    <div class="form-check mb-2">
                      <input class="form-check-input" type="checkbox" id="n_seg_p" name="n_seg_p">
                      <label class="form-check-label" for="n_seg_p">
                        No participa en seg de presupuesto <br> (NO SE MUESTRA EN EL 0108)
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="n_cal_p" name="n_cal_p">
                      <label class="form-check-label" for="n_cal_p">
                        No afecta el valor del presupuesto <br> (SE MUESTRA EN EL 0108, PERO NO AFECTA EL VALOR DEL PRESUPUESTO)
                      </label>
                    </div>
                  </div>

                  <!-- Botones y carga de archivo -->
                  <div class="col-12 d-flex align-items-center justify-content-between flex-wrap">
                    <div>
                      <button class="btn btn-success btn-sm" id="guardar">
                        <i class="fa fa-save"></i> Guardar
                      </button>
                      <button class="btn btn-secondary btn-sm" id="nuevo">
                        <i class="fa fa-file"></i> Nuevo
                      </button>
                    </div>
                    <input type="file" class="form-control form-control-sm mt-2 mt-md-0" id="csv" style="max-width: 50%;">
                  </div>

                  <!-- Zonas a modificar -->
                  <div class="col-12">
                    <label for="n_mod_insert" class="form-label">ZONAS A MODIFICAR/INSERTAR</label>
                    <input type="text" readonly id="n_mod_insert" class="form-control-plaintext alert alert-danger py-1">
                  </div>

                </form>
              </div>
            </div>

            <!-- Tabla CSV -->
            <div id="table_csv" class="card mt-3"></div>
          </div>
        </div>

        <div class="tab-pane fade" id="listado" role="tabpanel">
          <div class="container my-3">

            <!-- Alerta de título -->
            <div class="alert alert-warning shadow-sm">
              <h5 class="mb-0"><i class="fa fa-search me-2"></i> Búsqueda de zona de ventas</h5>
            </div>

            <!-- Campo de búsqueda -->
            <div class="card p-3 shadow-sm">
              <div class="mb-3">
                <label for="busqueda" class="form-label fw-bold text-uppercase">Zona / Descripción</label>
                <div class="input-group input-group-sm">
                  <input type="text" name="busqueda" id="busqueda" autocomplete="off" class="form-control" onKeyPress="exclusion(event)">
                  <button class="btn btn-info" type="button" onClick="listarZonasVentas()">
                    <i class="fa fa-list"></i> Buscar
                  </button>
                </div>
              </div>
            </div>

            <!-- Resultados -->
            <div class="mt-3 p-2 shadow-sm" id="result"></div>

          </div>
        </div>

      </div>
    </div>
  </div>

</div>





<script type="text/javascript" src="//code.jquery.com/jquery-2.1.1.min.js"></script> 
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php  echo(rand()); ?>"></script> 
<script type="text/javascript" src="../lib/js/datepicke-time/moments.js"></script> 
<script type="text/javascript" src="../lib/js/datepicke-time/datepicker.js"></script> 
<!--SWAL2 --> 
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.min.js"></script> 
<script type="text/javascript" src="../resources/HighCharts/code/highcharts.js"></script> 
<script type="text/javascript" src="../resources/HighCharts/code/modules/data.js"></script> 
<script type="text/javascript" src="../resources/HighCharts/code/modules/drilldown.js"></script> 
<script type="text/javascript" src="../resources/HighCharts/code/modules/exporting.js"></script> 
<script type="text/javascript" src="../lib/js/funciones.js?<?php  echo(rand()); ?>"></script> 
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@8/dist/sweetalert2.min.js"></script>
<script type="text/javascript" src="../lib/bootstrap-notify/bootstrap-notify.min.js"></script>
<script type="text/javascript" src="../controllers/ZonaVentas.js?<?php  echo(rand()); ?>"></script>
</body>
</html>
