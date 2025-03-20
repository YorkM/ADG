<?php
/*DESARROLLADO POR ING CRISTIAN BULA 19-05-2023*/
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
include('../models/funciones.php');
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
  <title>Modulo de Nomina - Datos de solo consulta</title>
  <!-- Latest compiled and minified CSS -->
  <link type="text/css" rel="stylesheet" href="../resources/bootstrap/bootstrap-5.0.2-dist/css/bootstrap.min.css">
  <link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?1645080088" />
  <link type="text/css" rel="stylesheet" href="../lib/SweetAlert2_V10/dist/sweetalert2.all.js?1505248750" />
  <link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?616710359">
  <link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs.css?375362504">
  <link type="text/css" rel="stylesheet" href="../resources/select2-bootstrap4-theme/select2-bootstrap4.css">
  <link type="text/css" rel="stylesheet" href="../resources/select2/css/select2.css">
  <link type="text/css" rel="stylesheet" href="../resources/fontawesome/css/all.css">
  <!------------------------------------------------------------------------------------------------------------------>
  <script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?194103208"></script>
  <script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?563679273"></script>
  <script type="text/javascript" src="../resources/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.min.js?1905557934"></script>
  <script type="text/javascript" src="../lib/SweetAlert2_V10/dist/sweetalert2.all.js?1307157658"></script>
  <script type="text/javascript" src="../lib/js/funciones.js?1989629645"></script>
  <script type="text/javascript" src="../lib/js/servicios.js?1585863381"></script>
  <script type="text/javascript" src="../resources/HighCharts/code/highcharts.js?1959467690"></script>
  <script type="text/javascript" src="../lib/bootstrap-notify/bootstrap-notify.min.js"></script>
  <script type="text/javascript" src="../resources/select2/js/select2.full.min.js"></script>
  <script type="text/javascript" src="../resources/select2/js/i18n/es.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.0/xlsx.full.min.js"></script>
  <script type="text/javascript" src="../controllers/Nomina.js?<?php echo (rand()); ?>"></script>
  <style>
    .swal2-popup {
      font-size: 1rem !important;
    }

    html,
    * {
      font-size: .95rem;
    }

    .modal-body {
      max-height: calc(100vh - 200px);
      overflow-y: auto;
    }

    [data-notify] {
      z-index: 9999 !important;
    }
  </style>
  <!------------------------------------------------------------------------------------------------------------------>
</head>

<body>
  <div class="alert alert-info"><i class="fa-solid fa-star fa-flip"></i>&nbsp;1017 - NOMINA & DOCUMENTOS</div>
  <input type="hidden" id="ses_CodSap" value="<?php echo (!empty($_SESSION["ses_CodSap"])) ? $_SESSION["ses_CodSap"] : "" ?>" readonly>
  <input type="hidden" id="RolId" value="<?php echo (!empty($_SESSION["ses_RolesId"])) ? $_SESSION["ses_RolesId"] : "" ?>" readonly>
  <div class="card-body">
    <!-- Bordered Tabs -->
    <ul class="nav nav-tabs nav-tabs-bordered alert alert-info p-0" id="borderedTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="tabSeguimiento" data-bs-toggle="tab" data-bs-target="#dvEmpleados" type="button" role="tab" aria-controls="home" aria-selected="true"><i class="fa-solid fa-person-running"></i> Empleado</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" disabled id="tabEmpleadoDoc" data-bs-toggle="tab" data-bs-target="#dvEmpleadoDoc" type="button" role="tab" aria-controls="home" aria-selected="true"><i class="fa-solid fa-folder"></i> Documentos</button>
      </li>
    </ul>

    <div class="tab-content" id="">
      <div class="tab-pane fade show active" id="dvEmpleados" role="tabpanel" aria-labelledby="home-tab">
        <div class="row">
          <div class="col-sm-6">
            <div class="card-body">
              <div class="card-header alert-info"><span class="fa-solid fa-file-pen" aria-hidden="true"></span> DATOS DE EMPLEADO</div>
              <table class="form" width="100%">
                <thead>
                </thead>
                <tbody>
                  <tr>
                    <td>CODIGO SAP</td>
                    <td><input type="text" class="form-control form-control-sm" autocomplete="off" id="txtCodigoSAP"></td>
                  </tr>
                  <tr>
                    <td>NOMBRES</td>
                    <td><input type="text" class="form-control form-control-sm" id="txtNombres" readonly disabled></td>
                  </tr>
                  <tr>
                    <td>TIPO IDENTIFICACIÓN</td>
                    <td><input type="text" class="form-control form-control-sm" id="txtTipoidentificacion" readonly disabled></td>
                  </tr>
                  <tr>
                    <td>IDENTIFICACION</td>
                    <td><input type="text" class="form-control form-control-sm" id="txtIdentificacion" readonly disabled></td>
                  </tr>
                  <tr>
                    <td>CIUDAD</td>
                    <td><input type="text" class="form-control form-control-sm" id="txtCiudad" readonly disabled></td>
                  </tr>
                  <tr>
                    <td>DIRECCIÓN</td>
                    <td><input type="text" class="form-control form-control-sm" id="txtDireccion" readonly disabled></td>
                  </tr>
                  <tr>
                    <td>FECHA INGRESO</td>
                    <td><input type="text" class="form-control form-control-sm" id="txtfhIngreso" readonly disabled></td>
                  </tr>
                  <tr>
                    <td>SALARIO</td>
                    <td><input type="text" class="form-control form-control-sm" id="txtSalario" readonly disabled></td>
                  </tr>
                  <tr>
                    <td>E.P.S</td>
                    <td><input type="text" class="form-control form-control-sm" id="txtSalud" readonly disabled></td>
                  </tr>
                  <tr>
                    <td>CAJA DE COMPENSACIÓN</td>
                    <td><input type="text" class="form-control form-control-sm" id="txtCaja" readonly disabled></td>
                  </tr>
                  <tr>
                    <td>A.R.L</td>
                    <td><input type="text" class="form-control form-control-sm" id="txtARL" readonly disabled></td>
                  </tr>
                  <tr>
                    <td>N° DE CUENTA</td>
                    <td><input type="text" class="form-control form-control-sm" id="txtCuentaBanco" readonly disabled></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="card-body" id="">
              <div class="card-header alert-info"><span class="fa-solid fa-file-arrow-down" aria-hidden="true"></span> COLILLA DE PAGO </div>
              <div class="row mb-3 mt-3">
                <div class="col-sm-7">
                  <select class="form-select form-select-sm" id="slcPeriodo">
                  </select>
                </div>
                <div class="col-sm-5">
                  <button type="button" id="btnGeneraColilla" class="btn btn-primary btn-sm w-100">
                    <span class="fa-solid fa-file-import" aria-hidden="true"></span>
                    Generar soporte de pago
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body" style="display: none" id="">
              <div class="card-header alert-info"><span class="fa-solid fa-file-arrow-down" aria-hidden="true"></span> CERTIFICADO LABORAL </div>
              <div class="row mb-3 mt-3">
                <div class="col-sm-8">
                  <select class="form-select form-select-sm" id="slcTipoCarta">
                    <option value="0">Seleccione</option>
                    <option value="1">Incluir Salario</option>
                    <option value="2">No incluir Salario</option>
                  </select>
                </div>
                <div class="col-sm-4">
                  <button type="button" id="btnGeneraCarta" class="btn btn-primary btn-sm"> <span class="fa-solid fa-file-import" aria-hidden="true"></span> Generar Certificado Laboral</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="dvEmpleadoDoc" role="tabpanel" aria-labelledby="home-tab">
        <h2 class="text-center fw-bold mb-3">Vista de documentos</h2>
        <button class="btn btn-primary btn-sm d-flex align-items-baseline gap-3" style="position: fixed; bottom: 30px; right: 60px;" id="btnAgregarDoc">
          Agregar documentos
          <i class="fa-solid fa-circle-plus"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL AGREGAR DOCUMENTOS -->
  <div class="modal fade" id="modalDocumentos" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 70%;">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Agregar documentos</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="shadow-sm">
              <div class="row p-3">
                <div class="col-4 form-group">
                  <label for="hojaVida">Hoja de vida</label>
                  <input type="file" class="form-control form-control-sm" accept=".pdf" id="hojaVida">
                </div>
                <div class="col-4 form-group">
                  <label for="cedula">Cédula de ciudadanía</label>
                  <input type="file" class="form-control form-control-sm" accept=".pdf" id="cedula">
                </div>
                <div class="col-4 form-group">
                  <label for="contrato">Contrato laboral</label>
                  <input type="file" class="form-control form-control-sm" accept=".pdf" id="contrato">
                </div>
              </div>
              <div class="row p-3">
                <div class="col-4 form-group">
                  <label for="examen">Examenes médicos</label>
                  <input type="file" class="form-control form-control-sm" accept=".pdf" id="examen">
                </div>
                <div class="col-4 form-group">
                  <label for="certificadoBancario">Certificado bancario</label>
                  <input type="file" class="form-control form-control-sm" accept=".pdf" id="certificadoBancario">
                </div>
                <div class="col-4 form-group">
                  <label for="certificadoEps">Certificado EPS</label>
                  <input type="file" class="form-control form-control-sm" accept=".pdf" id="certificadoEps">
                </div>
              </div>
              <div class="row p-3">
                <div class="col-4 form-group">
                  <label for="certificadoEstudio">Certificado de estudio</label>
                  <input type="file" class="form-control form-control-sm" accept=".pdf" id="certificadoEstudio">
                </div>
                <div class="col-4 form-group">
                  <label for="certificadoArl">Certificado ARL</label>
                  <input type="file" class="form-control form-control-sm" accept=".pdf" id="certificadoArl">
                </div>
                <div class="col-4 form-group">
                  <label for="certificadoAfp">Certificado AFP</label>
                  <input type="file" class="form-control form-control-sm" accept=".pdf" id="certificadoAfp">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-success" id="btnGuardarDocs">Guardar documentos</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="ModalPDF" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="">VISUALIZAR DOCUMENTO</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="ContenidoPDF">
          ...
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <!------------------------------------------------------------------------------------------------------------------>
  <div id="Bloquear" style="display: none;"></div>
  <div class="centrado-porcentual" style="display: none; background-color: transparent; width: 30%; height: 250px;"></div>

</body>

</html>