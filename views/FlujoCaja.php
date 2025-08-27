<?php session_start(); ?>
<!doctype html>
<html>

<head>
   <meta charset="utf-8">
   <title>Proyección de Flujo de Caja</title>
   <link title="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" />
   <link rel="stylesheet" href="../resources/select2-bootstrap4-theme/select2-bootstrap4.css">
   <link type="text/css" rel="stylesheet" href="../resources/bootstrap/bootstrap-5.0.2-dist/css/bootstrap.min.css">
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
   <link type="text/css" rel="stylesheet" href="../resources/plugins/jquery-ui/jquery-ui.css" />
   <link rel="stylesheet" href="../resources/select2/css/select2.css">
   <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet">
   <style>
      html,
      * {
         font-size: 1rem;
      }

      .overflow {
         overflow: auto;
      }

      .text-green {
         color: #055160 !important;
      }

      .bg-celeste {
         background-color: #cff4fc;
      }

      .size-13 {
         font-size: 13px !important;
      }

      .size-14 {
         font-size: 14px;
      }

      .size-15 {
         font-size: 14.5px;
      }

      select>option {
         font-size: 14px;
      }

      th {
         font-weight: 500;
      }

      .no-wrap {
         padding: 0;
         line-height: 2;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
      }

      .vertical {
         vertical-align: middle;
      }
   </style>
</head>

<body>
   <input type="hidden" id="rol" value="<?php echo !empty($_SESSION["ses_RolesId"]) ? $_SESSION["ses_RolesId"] : ''; ?>" disabled>
   <input type="hidden" id="UsrId" value="<?php echo !empty($_SESSION["ses_Id"]) ? $_SESSION["ses_Id"] : ''; ?>" disabled>
   <input type="hidden" id="oficinaHidden" value="<?php echo !empty($_SESSION["ses_OfcVentas"]) ? $_SESSION["ses_OfcVentas"] : ''; ?>" disabled>
   <input type="hidden" id="login_user" value="<?php echo !empty($_SESSION["ses_Login"]) ? $_SESSION["ses_Login"] : ''; ?>" disabled>
   <input type="hidden" id="numOrg" value="<?php echo !empty($_SESSION["ses_NumOrg"]) ? $_SESSION["ses_NumOrg"] : ''; ?>" disabled>

   <div class="alert alert-info mb-2" style="font-weight: 500;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0418 - PROYECCIÓN FLUJO DE CAJA</div>

   <div class="container-fluid">
      <nav class="row p-1">
         <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button class="nav-link active" id="btnCrearMovimiento" data-bs-toggle="tab" data-bs-target="#divCrearMovimiento" type="button" role="tab" aria-controls="divCrearMovimiento" aria-selected="true"><i class="fa-solid fa-pen"></i>&nbsp;Agregar movimiento</button>

            <button class="nav-link" id="btnProyeccion" data-bs-toggle="tab" data-bs-target="#divProyeccion" type="button" role="tab" aria-controls="divProyeccion" aria-selected="false"><i class="fa-solid fa-list"></i>&nbsp;Movimientos</button>

            <button class="nav-link" id="btnFlujo" data-bs-toggle="tab" data-bs-target="#divFlujo" type="button" role="tab" aria-controls="divFlujo" aria-selected="false"><i class="fa-solid fa-arrows-rotate"></i>&nbsp;Flujo de caja</button>

            <button class="nav-link" id="btnEstadisticas" data-bs-toggle="tab" data-bs-target="#divEstadisticas" type="button" role="tab" aria-controls="divEstadisticas" aria-selected="false"><i class="fa-solid fa-chart-simple"></i>&nbsp;Estadísticas</button>
         </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
         <div class="tab-pane fade show active p-2" id="divCrearMovimiento" role="tabpanel" aria-labelledby="nav-home-tab">
            <div class="alert alert-success" role="alert">
               En el siguiente formulario podrá agregar los diferentes tipos de movimientos
            </div>
            <div class="card px-3 py-4 shadow-sm mt-4">
               <div class="row mb-3">
                  <div class="col-md-6">
                     <div class="form-group">
                        <label for="fechaM">Fecha Movimiento</label>
                        <input type="date" class="form-control shadow-sm" id="fechaM">
                     </div>
                  </div>
                  <div class="col-md-6">
                     <div class="form-group">
                        <label for="tipoM">Tipo Movimiento</label>
                        <select id="tipoM" class="form-select shadow-sm size-14">
                           <option value="">-- Seleccione el tipo de movimiento --</option>
                           <option value="1">INGRESO</option>
                           <option value="2">EGRESO</option>
                        </select>
                     </div>
                  </div>
               </div>
               <div class="row mb-3">
                  <div class="col-md-6">
                     <div class="form-group">
                        <label for="tipoP">Tipo Presupuesto</label>
                        <select id="tipoP" class="form-select shadow-sm size-14">
                           <option value="">-- Seleccione el tipo de presupuesto --</option>
                           <option value="1">REAL</option>
                           <option value="2">PROYECTADO</option>
                        </select>
                     </div>
                  </div>
                  <div class="col-md-6">
                     <div class="form-group">
                        <label for="concepto">Concepto</label>
                        <div class="input-group mb-3">
                           <select id="concepto" class="form-select shadow-sm size-14" aria-describedby="concepto" aria-label="concepto"></select>
                           <button class="btn btn-outline-primary shadow-sm" type="button" id="btnConcepto" title="Click aquí para agregar un nuevo concepto">
                              <i class="fa-solid fa-circle-plus"></i>
                           </button>
                        </div>
                     </div>
                  </div>                  
               </div>
               <div class="row">
                  <div class="col-md-6">
                     <div class="form-group">
                        <label for="monto">Monto (Valor)</label>
                        <input type="text" class="form-control shadow-sm" id="monto" placeholder="Monto o valor del movimiento" autocomplete="off">
                     </div>
                  </div>
                  <div class="col-md-6">
                     <div class="form-group">
                        <label for="descripcion">Descripción</label>
                        <textarea class="form-control shadow-sm size-14" rows="1" id="descripcion" placeholder="Descripción del movimiento(Opcional)"></textarea>
                     </div>
                  </div>
               </div>
               <div class="mt-3">
                  <div class="d-flex justify-content-center">
                     <button class="btn btn-outline-primary shadow-sm w-50" id="btnGuardar">Guardar movimiento</button>
                  </div>
               </div>
            </div>
         </div>
         <div class="tab-pane fade p-2" id="divProyeccion" role="tabpanel" aria-labelledby="nav-profile-tab">
            <div class="row mb-3">
               <div class="col-md-6">
                  <div class="form-group">
                     <label for="filtroBusqueda">Filtro de búsqueda</label>
                     <input type="text" class="form-control shadow-sm size-14" placeholder="Filtro de búsqueda..." id="filtroBusqueda" autocomplete="off">
                  </div>
               </div>
               <div class="col-md-3">
                  <div class="form-group">
                     <label for="fechaInicio">Fecha Inicio</label>
                     <input type="date" class="form-control shadow-sm size-14" id="fechaInicio">
                  </div>
               </div>
               <div class="col-md-3">
                  <div class="form-group">
                     <label for="fechaFinal">Fecha Final</label>
                     <input type="date" class="form-control shadow-sm size-14" id="fechaFinal">
                  </div>
               </div>
            </div>
            <div style="overflow: auto;" id="contenedorTablaProyeccion">
               <table class="table table-bordered table-hover table-sm" id="tablaProyeccion">
                  <thead class="bg-celeste">
                     <tr>
                        <th class="no-wrap size-14 text-green text-center">DÍA</th>
                        <th class="no-wrap size-14 text-green text-center">MES</th>
                        <th class="no-wrap size-14 text-green text-center">AÑO</th>
                        <th class="no-wrap size-14 text-green text-center">ORGANIZACIÓN</th>
                        <th class="no-wrap size-14 text-green text-center">TIPO MOVIMIENTO</th>
                        <th class="no-wrap size-14 text-green">CONCEPTO</th>
                        <th class="no-wrap size-14 text-green text-center">MONTO</th>
                        <th class="no-wrap size-14 text-green">DESCRIPCIÓN</th>
                        <th class="no-wrap size-14 text-green text-center">EDITAR</th>
                     </tr>
                  </thead>
                  <tbody>

                  </tbody>
               </table>
            </div>
         </div>
         <div class="tab-pane fade p-2" id="divFlujo" role="tabpanel" aria-labelledby="divFlujo">
            <div class="row mb-3">
               <div class="col-md-6">
                  <div class="form-group">
                     <label for="filtroBusqueda2">Filtro de búsqueda</label>
                     <input type="text" class="form-control shadow-sm size-14" placeholder="Filtro de búsqueda..." id="filtroBusqueda2" autocomplete="off">
                  </div>
               </div>
               <div class="col-md-3">
                  <div class="form-group">
                     <label for="fechaInicio2">Fecha Inicio</label>
                     <input type="date" class="form-control shadow-sm size-14" id="fechaInicio2">
                  </div>
               </div>
               <div class="col-md-3">
                  <div class="form-group">
                     <label for="fechaFinal2">Fecha Final</label>
                     <input type="date" class="form-control shadow-sm size-14" id="fechaFinal2">
                  </div>
               </div>
            </div>
            <hr>
            <h5 class="text-center text-green">FLUJO DE CAJA POR DÍA</h5>
            <div class="mb-5" style="overflow: auto;" id="contenedorTablaProyeccionDia">
               <table class="table table-bordered table-hover table-sm" id="tablaProyeccionDia">
                  <thead class="bg-celeste">
                     <tr>
                        <th class="size-14 text-green text-center no-wrap">DÍA</th>
                        <th class="size-14 text-green text-center no-wrap">TOTAL INGRESOS</th>
                        <th class="size-14 text-green text-center no-wrap">TOTAL EGRESOS</th>
                        <th class="size-14 text-green text-center no-wrap">NETO FLUJO CAJA</th>
                        <th class="size-14 text-green text-center no-wrap">NÚMERO DE INGRESOS</th>
                        <th class="size-14 text-green text-center no-wrap">NÚMERO DE EGRESOS</th>
                        <th class="size-14 text-green text-center no-wrap">% DE EGRESOS SOBRE INGRESOS</th>
                     </tr>
                  </thead>
                  <tbody>

                  </tbody>
               </table>
            </div>
            <h5 class="text-center text-green">FLUJO DE CAJA POR BIMESTRE</h5>
            <div style="overflow: auto;" id="contenedorTablaProyeccion2">
               <table class="table table-bordered table-hover table-sm" id="tablaProyeccion2">
                  <thead class="bg-celeste">
                     <tr>
                        <th class="size-14 text-green text-center no-wrap">BIMESTRE</th>
                        <th class="size-14 text-green text-center no-wrap">TOTAL INGRESOS</th>
                        <th class="size-14 text-green text-center no-wrap">TOTAL EGRESOS</th>
                        <th class="size-14 text-green text-center no-wrap">NETO FLUJO CAJA</th>
                        <th class="size-14 text-green text-center no-wrap">PROMEDIO INGRESOS DÍA</th>
                        <th class="size-14 text-green text-center no-wrap">PROMEDIO EGRESOS DÍA</th>
                        <th class="size-14 text-green text-center no-wrap">DÍAS CON MOVIMIENTOS</th>
                        <th class="size-14 text-green text-center no-wrap">NÚMERO DE INGRESOS</th>
                        <th class="size-14 text-green text-center no-wrap">NÚMERO DE EGRESOS</th>
                        <th class="size-14 text-green text-center no-wrap">% DE EGRESOS SOBRE INGRESOS</th>
                     </tr>
                  </thead>
                  <tbody>

                  </tbody>
               </table>
            </div>
         </div>
         <div class="tab-pane fade p-2" id="divEstadisticas" role="tabpanel" aria-labelledby="divEstadisticas">
           <h5 class="text-center text-green mb-3">COMPARATIVA ENTRE LO REAL Y LO PROYECTADO</h5>
            <div style="overflow: auto;" id="contenedorTablaProyeccionRP">
               <table class="table table-bordered table-hover table-sm" id="tablaProyeccionRP">
                  <thead class="bg-celeste">
                     <tr>
                        <th class="size-14 text-green text-center no-wrap">FECHA</th>
                        <th class="size-14 text-green text-center no-wrap">INGRESO REAL</th>
                        <th class="size-14 text-green text-center no-wrap">INGRESO PROYECTADO</th>
                        <th class="size-14 text-green text-center no-wrap">EGRESO REAL</th>
                        <th class="size-14 text-green text-center no-wrap">EGRESO PROYECTADO</th>
                     </tr>
                  </thead>
                  <tbody>

                  </tbody>
               </table>
            </div>
            <div class="row mt-5">
               <div class="col-md-6">
                  <canvas id="graficaFlujoCaja" width="100%" height="50"></canvas>
               </div>
               <div class="col-md-6">
                  <canvas id="graficaEgresos" width="400" height="200"></canvas>
               </div>
            </div>
         </div>
      </div>
   </div>


   <!-- MODAL AGREGAR CONCEPTO -->
   <div class="modal fade" id="agregarConcepto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" style="min-width: 60%;">
         <div class="modal-content">
            <div class="modal-header">
               <div class="modal-title">
                  <h5 class="text-green">AGREGAR NUEVO CONCEPTO</h5>
               </div>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <div class="form-group mb-2">
                  <label for="newConcepto">Concepto</label>
                  <input type="text" class="form-control shadow-sm size-14" placeholder="Escriba el nuevo concepto que desea agregar" id="newConcepto" autocomplete="off">
               </div>
               <div class="d-flex justify-content-end">
                  <button class="btn btn-outline-primary shadow-sm" id="guardarConcepto">Guardar concepto</button>
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
   <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
   <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
   <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
   <script type="module" src="../controllers/FlujoCaja.js?<?php echo (rand()); ?>"></script>
</body>

</html>