<?php
/*DESARROLLADO POR ING CRISTIAN BULA 09-04-2018*/
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
include('../models/funciones.php');
session_start();
Redireccionar();
?>
<!doctype html>
<html>

<head>
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Last-Modified" content="0">
  <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta charset="utf-8">
  <title>Recibos de caja - SAP</title>
  <link type="text/css" rel="stylesheet" href="../lib/Bootstrap/V3/css/bootstrap.min.css?<?php echo (rand()); ?>">
  <link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php echo (rand()); ?>" />
  <link rel="stylesheet" href="../lib/SweetAlert2_V10/dist/sweetalert2.css">
  <link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php echo (rand()); ?>">
  <link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs.css?<?php echo (rand()); ?>">
  <link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php echo (rand()); ?>">
  <link type="text/css" rel="stylesheet" href="../resources/fontawesome/css/all.css">
  <!------------------------------------------------------------------------------------------------------------------>
  <script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/bootstrap.min.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/SweetAlert2_V10/dist/sweetalert2.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>
  <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/bootstrap-notify/bootstrap-notify.min.js"></script>
  <script type="text/javascript" src="../lib/js/jquery.keyz.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/MaskMoney/jquery.maskMoney.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../resources/HighCharts/code/highcharts.js?1991462313"></script>
  <script type="text/javascript" src="../controllers/RecibosCaja.js?<?php echo (rand()); ?>"></script>
  <style>
    html {
      font-size: 1rem;
    }

    .material-switch>input[type="checkbox"] {
      display: none;
    }

    .material-switch>label {
      cursor: pointer;
      height: 0px;
      position: relative;
      width: 40px;
    }

    .material-switch>label::before {
      background: rgb(0, 0, 0);
      box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.5);
      border-radius: 8px;
      content: '';
      height: 16px;
      margin-top: -8px;
      position: absolute;
      opacity: 0.3;
      transition: all 0.4s ease-in-out;
      width: 40px;
    }

    .material-switch>label::after {
      background: rgb(255, 255, 255);
      border-radius: 16px;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
      content: '';
      height: 24px;
      left: -4px;
      margin-top: -8px;
      position: absolute;
      top: -4px;
      transition: all 0.3s ease-in-out;
      width: 24px;
    }

    .material-switch>input[type="checkbox"]:checked+label::before {
      background: inherit;
      opacity: 0.5;
    }

    .material-switch>input[type="checkbox"]:checked+label::after {
      background: inherit;
      left: 20px;
    }

    .iframe {
      width: 99%;
      height: 85vh;
      border: none;
    }

    .font-size {
      font-size: 13px !important;
    }

    .font-size-tf {
      font-size: 14px !important;
    }

    .contenedor-valores {
      display: flex;
      flex: 1;
      gap: 5%;
      align-items: center;
    }

    .contenedor-val-todas {
      display: flex;
      justify-content: space-between;
      align-items: end;
      margin-bottom: 8px;
    }

    @media (max-width: 768px) {
      .contenedor-valores {
        flex-direction: column;
      }

      .contenedor-val-todas {
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
    }

    .p-valores {
      font-size: 20px;
      margin: 0;
    }

    .span-valores {
      font-weight: 600;
      color: #337ab7;
    }

    .custom-card {
      border: 1.5px solid #ccc;
      padding: 5px;
      border-radius: 5px;
    }

    .custom-padding {
      padding: 3px 8px;
      font-size: 12px;
    }

    .custom-padding-two {
      padding: 3px 8px;
      font-size: 12px;
    }
  </style>
</head>

<body>
  <input type="hidden" id="RolId" value="<?php echo (!empty($_SESSION["ses_RolesId"])) ? $_SESSION["ses_RolesId"] : "" ?>" readonly>
  <input type="hidden" id="UsrLogin" value="<?php echo (!empty($_SESSION["ses_Login"])) ? $_SESSION["ses_Login"] : "" ?>" readonly>
  <input type="hidden" id="NumOrg" value="<?php echo (!empty($_SESSION["ses_NumOrg"])) ? $_SESSION["ses_NumOrg"] : "" ?>" readonly>
  <input type="hidden" value="" id="fechaPagoHide">

  <div class="alert alert-info"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0405 - RECIBOS DE PAGO</div>
  <div class="panel with-nav-tabs panel-info">
    <div class="panel-heading">
      <ul class="nav nav-tabs">
        <li class="active" id="liCliente"> <a href="#dvClientes" id="btnCliente" data-toggle="tab">Cliente</a></li>
        <li class="disabled disabledTab" id="liAbonos"> <a href="#dvAbonos" id="btnAbonos">Abonos</a></li>
        <li class="disabled disabledTab" id="liFacturas"> <a href="#dvFacturas" id="btnFacturas">Facturas</a></li>
        <li class="disabled disabledTab" id="liMulticash"><a href="#dvMulticash" id="btnMulticash" data-toggle="tab">Multicash</a></li>
        <li class="" id="liPlanilla"><a href="#dvPlanilla" onClick="ConsultarPlanilla();" data-toggle="tab" id="btnPlanilla">Planilla</a></li>
        <li class="" id="liInformes"><a href="#dvInformes" data-toggle="tab" id="btnInformes">Informes</a></li>
        <li class="" id="liLiquidador"><a href="#dvLiquidador" data-toggle="tab" id="btnLiquidador">Liquidador</a></li>
        <li class="" id="liBancos"><a href="#dvBancos" data-toggle="tab" id="btnBancos">Bancos</a></li>
        <li class="dropdown"> <a href="#" data-toggle="dropdown">Ir a <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">
            <li> <a href="#" id="0401" data-toggle="tab"><span class="glyphicon glyphicon-menu-right"></span>0401 - CRM</a></li>
            <li> <a href="#" id="0102" data-toggle="tab"><span class="glyphicon glyphicon-menu-right"></span>0102 - Programación de clientes</a> </li>
          </ul>
        </li>
        <li style=" float:right">
          <div class="btn-group" role="group" aria-label="...">
            <button class="btn btn-success" id="btnContinuar" onClick="Guardar();" title="Preliminar"> <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> </button>
            <button class="btn btn-info" id="btnLimpiar" onClick="Limpiar();" title="Nuevo RC"> <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> </button>
            <button class="btn btn-default" id="btnEmailZona" title="Email Zonas"> <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> </button>
            <button class="btn btn-danger" id="btnCondicionDcto" title="Condiciones cliente"> <span class="glyphicon glyphicon-piggy-bank" aria-hidden="true"></span> </button>
          </div>
        </li>
      </ul>
    </div>
    <div class="panel-body">
      <div class="tab-content">
        <div class="tab-pane fade in active" id="dvClientes">
          <div style="overflow-y: scroll; overflow-x: hidden; max-height: 460px;">
            <table class="form" width="100%">
              <tr>
                <td>Fecha Documento</td>
                <td><input type="text" class="form-control" id="FechaDocumento"></td>
              </tr>
              <tr>
                <td>Cliente</td>
                <td><input type="text" class="form-control" id="Cliente" size="60"></td>
              </tr>
              <tr>
                <td>Desactiva Descuentos</td>
                <td style="float: left;">
                  <div class="material-switch">
                    <input id="ActivaDcto" name="" type="checkbox" />
                    <label for="ActivaDcto" class="label-success"></label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Codigo SAP</td>
                <td><input type="text" class="form-control" id="CodigoSAP" readonly disabled></td>
              </tr>
              <tr>
                <td>Sociedad / Oficina</td>
                <td>
                  <div class="form-group row">
                    <div class="col-xs-2">
                      <input type="text" class="form-control" id="Sociedad" value="<?php echo (!empty($_SESSION["ses_NumOrg"])) ? $_SESSION["ses_NumOrg"] : "" ?>" readonly disabled>
                    </div>
                    <div class="col-xs-10">
                      <input type="text" class="form-control" id="Oficina" readonly disabled>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Grupo Cliente</td>
                <td>
                  <div class="form-group row">
                    <div class="col-xs-2">
                      <input class="form-control" id="Grupo" type="text" readonly disabled>
                    </div>
                    <div class="col-xs-10">
                      <input class="form-control" id="DescGrupo" type="text" readonly disabled>
                    </div>
                  </div>
              </tr>
              <tr>
                <td>Lista</td>
                <td><input type="text" class="form-control" id="Lista" readonly disabled></td>
              </tr>
              <tr>
                <td>Email</td>
                <td><input type="text" class="form-control" id="Email" readonly disabled></td>
              </tr>
              <tr>
                <td>Email Zona</td>
                <td><input type="text" class="form-control" id="EmailZona" readonly disabled></td>
              </tr>
              <tr>
                <td>Referencia</td>
                <td><textarea maxlength="25" class="notas form-control" id="Referencia" onKeyPress="return vletras_numeros(event)" placeholder="Solo letras y numeros, maximo 25 caracteres"></textarea></td>
              </tr>
              <tr>
                <td>Texto Cabecera</td>
                <td><textarea maxlength="25" class="notas form-control" id="TextoCabecera" onKeyPress="return vletras_numeros(event)" placeholder="Solo letras y numeros, maximo 25 caracteres"></textarea></td>
              </tr>
              <tr>
                <td>Texto Compensación</td>
                <td><textarea maxlength="25" class="notas form-control" id="TextoCompensacion" onKeyPress="return vletras_numeros(event)" placeholder="Solo letras y numeros, maximo 25 caracteres"></textarea></td>
              </tr>
            </table>
          </div>
        </div>
        <div class="tab-pane fade in" id="dvAbonos">
          <table class="form" width="100%" id="TablaAbonos">
            <tr>
              <td>Cuenta</td>
              <td><select id="Cuenta" class="form-control">
                </select></td>
            </tr>
            <tr>
              <td>Tipo Valor</td>
              <td><select id="TipoValor" class="form-control">
                  <option value="P">POSITIVO (+)</option>
                  <option value="N">NEGATIVO (-)</option>
                </select></td>
            </tr>
            <tr>
              <td>Valor</td>
              <td><input type="text" id="ValorAbono" class="form-control ClassNumero" onKeyPress="return vnumeros(event)" onKeyUp="Enter(event,'AddAbono')"></td>
            </tr>
            <tr>
              <td>Fecha Valor</td>
              <td><input type="text" id="FechaValor" class="form-control" onKeyUp="Enter(event,'AddAbono')"></td>
            </tr>
          </table>
          <div id="DetalleAbonos" style="overflow-y:scroll; overflow-x:hidden; height:500px;">
            <table class="form" width="100%">
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th>Descripción</th>
                  <th>Valor</th>
                  <th>Fecha Valor</th>
                  <th>Referencia</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody id="tdBody">
              </tbody>
            </table>
          </div>
        </div>
        <div class="tab-pane fade in" id="dvFacturas">
          <div class="contenedor-val-todas">
            <div class="contenedor-valores">
              <p class="p-valores">Valor Total: <span class="span-valores" id="valorTotal">$0</span></p>
              <p class="p-valores">Partidas: <span class="span-valores" id="partidas">0</span></p>
              <p class="p-valores">Valor Mora: <span class="span-valores" id="valorMora">$0</span></p>
            </div>
            <div style="display: flex; justify-content: flex-end;">
              <button class="btn btn-primary" id="btnSeleccionarTodas">Seleccionar todas</button>
            </div>
          </div>
          <div id="dvResultCartera" style="overflow: auto; height: 60vh;"></div>
        </div>
        <div class="tab-pane fade in" id="dvPlanilla">
          <table width="100%" class="form" id="tb_filtros_planilla">
            <tr>
              <td>Filtrado</td>
              <td><input type="text" id="FiltroPlanilla" class="form-control" size="25"></td>
              <td>Fecha Inicial</td>
              <td><input type="text" id="RptFhIni" class="form-control" size="12" readonly></td>
              <td>Fecha Final</td>
              <td><input type="text" id="RptFhFin" class="form-control" size="12" readonly></td>
              <td>Total RC</td>
              <td><input type="text" id="TotalRC" class="form-control" size="8" readonly></td>
              <td>
                <div class="btn-group" role="group" aria-label="...">
                  <button class="btn btn-success btn-sm" type="button" onClick="filtroEstado('A')"> <span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span> </button>
                  <button class="btn btn-danger btn-sm" type="button" onClick="filtroEstado('S')"> <span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span> </button>
                  <button class="btn btn-default btn-sm" type="button" onClick="filtroEstado('T')"> <span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span> </button>
                </div>
              </td>
              <td><button class="btn btn-default" id="btnCompensaciones" style="display:none;"><i class="fa-solid fa-faucet"></i> Compensaciones</button></td>

              <!--<td><button class="btn btn-default" id="btnConsultar"   onClick="ConsultarPlanilla();">Consultar</button></td>-->
            </tr>
          </table>
          <div id="dvResultPlanilla" style="overflow: auto; height: 60vh;"></div>
        </div>
        <div class="tab-pane fade in" id="dvInformes">
          <table width="100%" class="form" id="">
            <tr>
              <td>Fecha Inicial</td>
              <td>
                <div class="input-group"> <span class="input-group-addon" id="basic-addon1"><i class="fa-solid fa-calendar-days" style="width: 30px;"></i></span>
                  <input type="text" class="form-control" id="InfoFhIni" readonly>
                </div>
              </td>
              <td>Fecha Final</td>
              <td>
                <div class="input-group"> <span class="input-group-addon" id="basic-addon1"><i class="fa-solid fa-calendar-days" style="width: 30px;"></i></span>
                  <input type="text" class="form-control" id="InfoFhFin" readonly>
                </div>
              </td>
              <td><button type="button" class="btn btn-success" onclick="ConsultarInformes();"><i class="fa-solid fa-search"></i> Consultar</button></td>
            </tr>
          </table>
          </br>
          <div class="row">
            <div class="col-md-6">
              <div id="dvResultConsolidado"></div>
            </div>
            <div class="col-md-6">
              <figure class="highcharts-figure">
                <div id="DivGrafico"></div>
                <p class="highcharts-description"></p>
              </figure>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div id="dvResultInformes"></div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade in" id="dvMulticash">
          <!-- <table width="100%">
            <tr>
              <td width="50%">
                <input type="text" placeholder="Filtro de búsqueda" class="form-control" id="filtro" name="filtro">
              </td>
              <td>
                <select id="MultiDay" class="form-control">
                </select>
              </td>
              <td>
                <select id="MultiMes" class="form-control">
                </select>
              </td>
              <td>
                <select id="MultiAnio" class="form-control">
                </select>
              </td>
              <td>
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="Validar Multicash" id="txtValidaDocumento" onKeyPress="return vnumeros(event)">
                  <span class="input-group-addon"> <span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>
                </div>
              </td>
            </tr>
          </table> -->
          <div class="row">
            <div class="col-md-6">
              <input type="text" placeholder="Filtro de búsqueda" class="form-control" id="filtro" name="filtro">
            </div>
            <div class="col-md-1">
              <select id="MultiDay" class="form-control">
              </select>
            </div>
            <div class="col-md-2">
              <select id="MultiMes" class="form-control">
              </select>
            </div>
            <div class="col-md-1">
              <select id="MultiAnio" class="form-control">
              </select>
            </div>
            <div class="col-md-2">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Validar Multicash" id="txtValidaDocumento" onKeyPress="return vnumeros(event)">
                <span class="input-group-addon"> <span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>
              </div>
            </div>
          </div>
          <div id="dvResultMulticash" style="overflow: auto; height: 50vh;">
            <hr>
            <table class="table" width="100%" id="tdPlanillas">
              <thead>
                <tr>
                  <th>CUENTA</th>
                  <th>DESCRIPCION</th>
                  <th>NUMERO</th>
                  <th>VALOR</th>
                  <th>TEXTO</th>
                  <th>FECHA CONT.</th>
                  <th>FECHA VALOR.</th>
                  <th>ESTADO</th>
                  <th>REFERENCIA</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody id="tdDetalleMulticash">
              </tbody>
            </table>
          </div>
        </div>
        <div class="tab-pane fade in" id="dvLiquidador">
          <img id="logoEmpresa" src="../resources/images/LogoRoma.png" style="display: none;" />
          <img id="logoEmpresa2" src="../resources/images/LogoCM.png" style="display: none;" />
          <div style="overflow: auto; height: 67vh;" id="contenedorTablasLiquidador">

          </div>
        </div>
        <div class="tab-pane fade in" id="dvBancos">
          <div class="row">
            <div class="col-md-6">
              <input type="text" placeholder="Filtro de búsqueda" class="form-control" id="filtro2" name="filtro2">
            </div>
            <div class="col-md-2">
              <select id="MultiDay2" class="form-control">
              </select>
            </div>
            <div class="col-md-2">
              <select id="MultiMes2" class="form-control">
              </select>
            </div>
            <div class="col-md-2">
              <select id="MultiAnio2" class="form-control">
              </select>
            </div>
          </div>
          <!-- REVISAR TABLA -->
          <div id="dvResultMulticash2" style="overflow: auto; max-height: 60vh;">
            <hr>
            <table class="table" width="100%" id="tdPlanillas2">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>CUENTA</th>
                  <th>CLAVE REF.</th>
                  <th>N° DOC.</th>
                  <th>VALOR</th>
                  <th>FECHA DOC.</th>
                  <th>REFERENCIA</th>
                  <th>SAP</th>
                  <th>CLIENTE</th>
                  <th>OFICINA</th>
                  <th>ZONA</th>
                  <th>NOMBRE</th>
                  <th>CONDICIÓN</th>
                  <th>OBSER.</th>
                </tr>
              </thead>
              <tbody id="tdDetalleMulticash2">

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="dvTotalAbono" style="width: 100%; position: fixed; bottom: 0; left: 0;">
    <table class="form" width="100%" style="margin-top:10px;">
      <tr>
        <td>Total Abonado :
          <input type="text" id="VlrTotalAbono" class="form-control" size="10" readonly>
        </td>
        <td>Total Facturas :
          <input type="text" id="VlrTotalFacturas" class="form-control" size="10" readonly>
        </td>
        <td>Sin Asignar :
          <input type="text" id="VlrSinAsignar" class="form-control" size="10" readonly>
        </td>
      </tr>
    </table>
  </div>
  <!---INICIO CONDICIONES DE DESCUENTOS DEL CLIENTE SELECCIONADO-->
  <div id="dvCondiciones" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">CONDICIONES DE DESCUENTO</h4>
        </div>
        <div class="modal-body">
          <div class="bs-callout bs-callout-info" id="callout-alerts-dismiss-plugin">
            <h4>Condiciones propias del cliente</h4>
            <p>Estan asociadas al cliente especificamente y pueden depender o no del cumplimiento del presupuesto</p>
          </div>
          <div id="dvCondicionesDetalle"></div>
          </br>
          <div class="bs-callout bs-callout-success" id="callout-alerts-dismiss-plugin">
            <h4>Condiciones por lista de precio </h4>
            <p>Estan asociadas a la lista de precio del cliente y para ser aplicadas dependen del plazo de pago especial</p>
          </div>
          <div id="dvCondicionesDetalleListaPlazo"></div>
          </br>
          <div class="bs-callout bs-callout-warning" id="callout-alerts-dismiss-plugin">
            <h4>Condiciones por lista de precio sujetos a cumplimiento de presupuesto de ventas</h4>
            <p>Estan asociadas a la lista de precio del cliente y para ser aplicadas dependen del cumplimiento del presupuesto de ventas correspondiente al periodo del documento</p>
          </div>
          <div id="dvCondicionesDetalleLista"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!---FIN CONDICIONES DE DESCUENTOS DEL CLIENTE SELECCIONADO-->
  <div id="dvSclAbono" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">SELECIÓN DE ABONO</h4>
        </div>
        <div class="modal-body">
          <div id="dvSclAbonoDetalle"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
  <!---Modal compensaciones 2024-09-07-->
  <div id="modalCompensaciones" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Compensación de partidas.</h4>
        </div>
        <div class="modal-body">
          <table class="form" width="100%">
            <thead>
              <tr>
                <th colspan="2">COMPENSACIÓN DE DOCUMENTOS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="2">
                  <div class="alert alert-warning"><i class="fa-solid fa-circle-info"></i><span> La compensacion de documentos, desactiva de multichash las partidas de banco por aprovechamiento.</span></div>
                </td>
              </tr>
              <tr>
                <td>Fecha Inicial</td>
                <td><input type="text" class="form form-control" id="fhCompenIni"></td>
              </tr>
              <tr>
                <td>Fecha Final</td>
                <td><input type="text" class="form form-control" id="fhCompenFin"></td>
              </tr>
              <tr>
                <td>Número de documento (Opcional)</td>
                <td><input type="text" class="form form-control" id="idCompenDoc" onKeyPress="return vnumeros(event)"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" id="btnCompensar">Compensar</button>
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!---Modal compensaciones 2024-09-07-->
  <!---email zonas-------->
  <div id="dvEmailZonas" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">CONFIGURACIÓN</h4>
        </div>
        <div class="modal-body">
          <div class="panel with-nav-tabs panel-info">
            <div class="panel-heading">
              <ul class="nav nav-tabs">
                <li class="active"><a href="#dvCorreos" data-toggle="tab">Correos</a></li>
                <li class=""><a href="#dvCondicionesEspeciales" data-toggle="tab" onClick="ConsultarCondicionEspecial();">Condiciones Especiales</a></li>
                <li class=""><a href="#dvCondicionesListas" data-toggle="tab" onClick="ConsultarCondicionLista();">Condiciones Listas</a></li>
              </ul>
            </div>
            <div class="panel-body">
              <div class="tab-content">
                <div class="tab-pane fade in active" id="dvCorreos">
                  <table class="form" width="100%">
                    <tr>
                      <td>ZONA</td>
                      <td><select id="slcZonaEmail" class="form-control"></select></td>
                    <tr>
                    <tr>
                      <td>EMAIL</td>
                      <td><input type="text" id="txtZonaEmail" class="form-control"></td>
                    <tr>
                    <tr>
                      <td colspan="2">
                        <button type="button" class="btn btn-sm btn-success" onClick="AddZonaEmail()">Agregar</button>
                      </td>
                    <tr>
                  </table>
                  <div id="dvResultZonasEmail"></div>
                </div>
                <div class="tab-pane fade in" id="dvCondicionesEspeciales">
                  <div class="alert alert-warning" role="alert">
                    <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                    Tener en cuenta que al autorizar las condiciones solicitadas se eliminaran las que se encuentran vigentes en ADG.
                  </div>
                  <table class="form" width="100%">
                    <tr>
                      <td>Cliente</td>
                      <td><input type="text" id="txt_CondCliente" class="form-control"></td>
                      <td><input type="text" id="txt_CondCodigo" class="form-control" placeholder="Codigo SAP" readonly disabled></td>
                      <td>Sujeto Cumplimiento</td>
                      <td>
                        <select id="txtSujetoCumplimiento" class="form-control">
                          <option value="S">SI</option>
                          <option value="N">NO</option>
                        </select>
                      </td>
                    <tr>
                    <tr>
                      <td>Dias Pago</td>
                      <td><input type="text" id="txt_CondDias" onKeyPress="return vnumeros(event)" class="form-control"></td>
                      <td>Descuento %</td>
                      <td colspan="2"><input type="text" id="txt_CondDcto" onKeyPress="return vnumeros(event)" class="form-control"></td>
                    <tr>
                    <tr>
                      <td colspan="5">
                        <button type="button" class="btn btn-sm btn-success" onClick="AgregarCondicionEspecial()">Agregar</button>
                        <button type="button" class="btn btn-sm btn-info" onClick="AutorizarTodoCondicion()">Autorizar Todo</button>
                      </td>
                    <tr>
                  </table>
                  <div id="dvResultCondicionesEspeciales"></div>
                </div>
                <div class="tab-pane fade in" id="dvCondicionesListas">
                  <div class="alert alert-warning" role="alert">
                    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                    <span class="sr-only"></span> <b>PLAN ESPECIAL DE CLIENTES DE TIPO DROGUERIA Y QUE CUMPLAN PRESUPUESTO DE VENTAS</b>
                  </div>
                  <div id="dvResultCondicionesEspecialesListas"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
  <!--------------------------------------------------------------------------------------------------->
  <div id="dvPDFRecibo" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">PDF RECIBO</h4>
        </div>
        <div class="modal-body">
          <div id="dvReciboCajaPDF"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <div id="dvSubirCash" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Subir Planilla de multicash</h4>
        </div>
        <div class="modal-body">
          <table width="100%" class="form" id="">
            <tbody>
              <tr>
                <td>CSV [Cuenta,Documento,Importe,Texto,Fecha cont,Fecha valor,Referencia]</td>
                <td><input type="file" id="filename" name="filename" class="form-control" readonly></td>
              </tr>
            </tbody>
          </table>
          <div id="tr_det_cash"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" onClick="SubirCash()">Subir</button>
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <div id="dvReciboCaja" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg" style="width: 95%">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">RECIBO DE CAJA</h4>
        </div>
        <div class="modal-body">
          <div class="modal-footer">
            <div class="btn-group" id="btnAutorizar">
              <button class="btn btn-success dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="glyphicon glyphicon-check" aria-hidden="true"></span> Autorizar <span class="caret"></span>
              </button>
              <ul class="dropdown-menu">
                <li><a onClick="AutorizarRC(1)" style="cursor: pointer">Version 1</a></li>
                <<li><a onClick="AutorizarRC(2)" style="cursor: pointer">Version 2</a></li>
              </ul>
            </div>
            <button type="button" class="btn btn-danger" id="btnEliminarRC" onClick="EliminarRC()">
              <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Eliminar
            </button>
            <button type="button" class="btn btn-info" data-dismiss="modal">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Cerrar
            </button>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="panel panel-info">
                <div class="panel-heading"> <a data-toggle="collapse" href="#BodyCliente">DATOS DE CLIENTE</a></div>
                <div class="panel-body collapse in" id="BodyCliente">
                  <div class="row">
                    <div class="col-md-6">
                      <table class="form" width="100%">
                        <tbody>
                          <tr>
                            <td width="30%"><b>ID</b></td>
                            <td id="txt_id_rc"></td>
                          </tr>
                          <tr>
                            <td><b>NUMERO</b></td>
                            <td id="txt_num"></td>
                          </tr>
                          <td><b>CODIGO</b></td>
                          <td id="txt_codigo"></td>
                          </tr>
                          </tr>
                          <td><b>CLIENTE</b></td>
                          <td id="txt_cliente"></td>
                          </tr>
                          </tr>
                          <td><b>RAZÓN</b></td>
                          <td id="txt_razon"></td>
                          </tr>
                          <tr>
                            <td><b>EMAIL</b></td>
                            <td id="txt_mail"></td>
                          </tr>
                          <tr>
                            <td><b>EMAIL ZONA</b></td>
                            <td id="txt_mail_zona"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="col-md-6">
                      <table class="form" width="100%">
                        <tbody>
                          <tr>
                            <td width="30%"><b>VALOR</b></td>
                            <td id="txt_valor"></td>
                          </tr>
                          <tr>
                            <td><b>TEXTO CABECERA</b></td>
                            <td id="txt_cabecera"></td>
                          </tr>
                          <tr>
                            <td><b>TEXTO COMPENSACION</b></td>
                            <td id="txt_compesacion"></td>
                          </tr>
                          <tr>
                            <td><b>TEXTO REFERENCIA</b></td>
                            <td id="txt_referencia"></td>
                          </tr>
                          <tr>
                            <td><b>FECHA APROBACIÓN</b></td>
                            <td id="txt_fh_aprueba"></td>
                          </tr>
                          <tr>
                            <td><b>USUARIO APROBACIÓN</b></td>
                            <td id="txt_user_aprueba"></td>
                          </tr>
                          <tr>
                            <td><b>ARCHIVO</b></td>
                            <td id="tdDocPDF"><input type="file" id="DocPDF" name="DocPDF" class="form-control" accept="application/pdf"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6" id="panel_2">
              <div class="panel panel-info">
                <div class="panel-heading"> <a data-toggle="collapse" href="#">DETALLE DE PAGO</a></div>
                <div class="panel-body collapse in  " style="overflow:auto" id="tr_det">
                </div>
              </div>
            </div>
            <div class="col-md-6" id="panel_3">
              <div class="panel panel-info">
                <div class="panel-heading"> <a data-toggle="collapse" href="#">DOCUMENTO</a></div>
                <div class="panel-body collapse in" id="ContainerPDF">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="Bloquear" style="display:none;"></div>
  <div class="centrado-porcentual" style="display:none;background-color:transparent; width:30%; height:250px"></div>
  <!-------Modal PDF---->
  <div id="ModalPDF" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" id="ModalPDFTittle"></h4>
        </div>
        <div class="modal-body" id="ContenidoPDF">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" onClick="EliminarPDF()" id="btnEliminarPDF">Eliminar</button>
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!----------------------------------->
  <div id="ModalHipervinculo" class="modal" role="dialog" style="z-index: 99999; margin-top: 0; background-color: #C0C0C0; padding: 0"
    aria-hidden="true"
    data-keyboard="false"
    data-backdrop="static">
    <div class="modal-dialog modal-lg" style="width: 100%;height: 99vh; margin:0; ">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header" style="padding: 1px; margin: 1px; font-size: 12px">
          <h4 class="modal-title">
            <span id="span-titulo-modulo"></span>
          </h4>
        </div>
        <div class="modal-body">
          <div class="row row_iframe">
            <div class="col-md-12 col-iframe-left">
              <iframe class="iframe" src="" style="display: none; font-size: 1rem"></iframe>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="padding: 3px;">
          <button type="button" class="btn btn-danger btn-sm " style="margin-right: 10px" data-dismiss="modal"><i class="fa fa-times"></i>&nbsp;Cerrar</button>
        </div>
      </div>
    </div>
  </div> 
</body>

</html>