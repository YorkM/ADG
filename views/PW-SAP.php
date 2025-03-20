<?php
/*DESARROLLADO POR ING CRISTIAN BULA 09-12-2016*/
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
include('../models/funciones.php');
session_start();
Redireccionar();
//echo utf8_decode( $_SESSION[ 'ses_Login' ] );
?>
<html>

<head>
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Last-Modified" content="0">
  <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta charset="utf-8">
  <title>Modulo de pedidos WEB - SAP</title>
  <!-- Latest compiled and minified CSS -->
  <link type="text/css" rel="stylesheet" href="../lib/Bootstrap/V3/css/bootstrap.min.css?<?php echo (rand()); ?>">
  <link type="text/css" rel="stylesheet" href="../lib/footable/css/footable.bootstrap.css?<?php echo (rand()); ?>" />
  <link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php echo (rand()); ?>" />

  <link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php echo (rand()); ?>">
  <link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs.css?<?php echo (rand()); ?>">
  <link type="text/css" rel="stylesheet" href="../resources/select2-bootstrap4-theme/select2-bootstrap4.css">
  <link type="text/css" rel="stylesheet" href="../resources/select2/css/select2.css">
  <link type="text/css" rel="stylesheet" href="../resources/fontawesome/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.13.2/dist/sweetalert2.min.css">
  <!------------------------------------------------------------------------------------------------------------------>
  <script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/bootstrap.min.js?<?php echo (rand()); ?>"></script>

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.13.2/dist/sweetalert2.all.min.js"></script>
  <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/footable/js/footable.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../resources/HighCharts/code/highcharts.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/bootstrap-notify/bootstrap-notify.min.js"></script>
  <script type="text/javascript" src="../resources/select2/js/select2.full.min.js"></script>
  <script type="text/javascript" src="../controllers/PW-SAP.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/Isa.js?<?php echo (rand()); ?>"></script>
  <style>
    .swal2-popup {
      font-size: 1.5rem !important;
    }

    .modal-body {
      max-height: calc(100vh - 200px);
      overflow-y: auto;
    }

    [data-notify] {
      z-index: 9999 !important;
    }

    .thumbnail {
      height: 400px;
      /* Establece la altura fija para cada tarjeta */
    }

    .div-container-check {
      display: flex;
      align-items: baseline;
      gap: 5px;
    }

    .div-col-check {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }

    .div-row {
      border: .2px solid #ccc;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      border-radius: 2px;
      padding: 10px 0;
      margin-bottom: 10px;
      box-shadow: 0 .125rem .25rem rgba(0, 0, 0, 0.075) !important;
    }

    /* #tablaDatos tbody tr td {
      font-size: smaller;
    } */
  </style>
</head>

<body>
  <!-- 
<div class="alert alert-warning fixed-bottom position-fixed " role="alert" id="alarma_sol_desbloqueo"  >
-->

  </div>
  <div class="alert alert-info"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0101 - PEDIDOS WEB-SAP</div>

  <input type="hidden" id="Dpto" value="<?php if (!empty($_SESSION["ses_DepId"])) {
                                          echo $_SESSION["ses_DepId"];
                                        } ?>" readonly>
  <input type="hidden" id="Organizacion" value="<?php if (!empty($_SESSION["ses_NumOrg"])) {
                                                  echo  $_SESSION["ses_NumOrg"];
                                                } ?>" readonly>
  <input type="hidden" id="CodigoSAP" value="<?php if (!empty($_SESSION["ses_CodSap"])) {
                                                echo $_SESSION["ses_CodSap"];
                                              } ?>" readonly>
  <input type="hidden" id="UsrLogin" value="<?php if (!empty($_SESSION["ses_Login"])) {
                                              echo $_SESSION["ses_Login"];
                                            } ?>" readonly>
  <input type="hidden" id="Ofi" value="<?php if (!empty($_SESSION["ses_OfcVentas"])) {
                                          echo $_SESSION["ses_OfcVentas"];
                                        } ?>" readonly>
  <input type="hidden" id="Rol" value="<?php if (!empty($_SESSION["ses_RolesId"])) {
                                          echo $_SESSION["ses_RolesId"];
                                        } ?>" readonly>
  <input type="hidden" id="Nit" value="<?php if (!empty($_SESSION["ses_Nit"])) {
                                          echo $_SESSION["ses_Nit"];
                                        } ?>" readonly>
  <input type="hidden" id="UsrId" value="<?php if (!empty($_SESSION["ses_Id"])) {
                                            echo $_SESSION["ses_Id"];
                                          } ?>" readonly>
  <input type="hidden" id="AbrirVentas" value="<?php if (!empty($_GET["grupo"])) {
                                                  echo $_GET["grupo"];
                                                } else {
                                                  echo 0;
                                                } ?>" readonly>
  <input type="hidden" id="link_pro" value="<?php if (!empty($_GET["link_prog"])) {
                                              echo $_GET["link_prog"];
                                            } else {
                                              echo '0';
                                            } ?>" readonly>
  <input type="hidden" id="tipo_documento" value="<?php if (!empty($_GET["tipo_documento"])) {
                                                    echo $_GET["tipo_documento"];
                                                  } else {
                                                    echo '';
                                                  } ?>" readonly>
  <input type="hidden" id="emailCliente" value="<?php if (!empty($_GET["emailCliente"])) {
                                                  echo $_GET["emailCliente"];
                                                } else {
                                                  echo '';
                                                } ?>" readonly>
  <input type="hidden" id="pedido_integracion" value="<?php if (!empty($_GET["pedido_integracion"])) {
                                                        echo $_GET["pedido_integracion"];
                                                      } else {
                                                        echo '';
                                                      } ?>" readonly>
  <!-- <input type="text" id="TipoPedido" value="PW" readonly>-->
  <div id="data"></div>
  <div class="panel with-nav-tabs panel-info">
    <div class="panel-heading">
      <ul class="nav nav-tabs">
        <li class="active"><a href="#dvClientes" data-toggle="tab">Cliente</a></li>
        <li class="disabled disabledTab" id="liProductos"><a href="#dvProductos" id="btnProductos">Productos</a></li>
        <li class="disabled disabledTab" id="liPedidos"><a href="#dvPedidos" id="btnPedidos">Pedido</a></li>
        <li class="dropdown"> <a href="#" data-toggle="dropdown">Gestión <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">
            <li role="separator"><b>Pedidos</b></li>
            <li><a href="#dvRecuperar" id="btnTemporales" data-toggle="tab"><span class="glyphicon glyphicon-menu-right"></span>Propios</a></li>
            <li><a href="#dvRecuperarTerceros" id="btnTempTerceros" data-toggle="tab"><span class="glyphicon glyphicon-menu-right"></span>Terceros</a></li>
            <li role="separator" id="separadorEntregas"><b>Entregas</b></li>
            <li><a href="#dvAddEntregas" id="btnAddEntregas" data-toggle="tab"><span class="glyphicon glyphicon-menu-right"></span>Unificar</a></li>
            <li><a href="#dvFaltantes" id="btnFaltantes" data-toggle="tab"><span class="glyphicon glyphicon-menu-right"></span>Faltantes</a></li>
            <li role="separator" id="separadorFacturas"><b>Facturas</b></li>
            <li><a href="#dvListaFacts" id="btListaFacts" data-toggle="tab"><span class="glyphicon glyphicon-menu-right"></span>Facturación</a></li>
            <li role="separator" id="separadorEventos"><b>Eventos</b></li>
            <li><a href="#dvEventos" data-toggle="tab" id="btnEventos"><span class="glyphicon glyphicon-menu-right"></span>Ofertas</a></li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="panel-body">
      <div class="tab-content">
        <div class="tab-pane fade in active" id="dvClientes">

          <!---INICIO DIV CLIENTES---------------------------------------------------------------------------------------->
          <div id="ModalEditarPedidos" class="modal fade bd-example-modal-lg" role="dialog">
            <div class="modal-dialog modal-lg">
              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">MODIFICAR PEDIDOS SAP</h4>
                </div>
                <div class="modal-body">
                  <!-- Modal Cuerpo-->
                  <div class="alert alert-warning alert-dismissible" role="alert"> <strong>NOTA!</strong> Solo podran ser editados o modificados aquellos pedidos que no tengan entregas o procesos siguientes a la toma. </div>
                  <table class="form" width="100%">
                    <thead>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Tipo</td>
                        <td><select id="EdtTipo" class="form-control">
                            <option value="0">ADG (Temporal)</option>
                            <option value="1">SAP (Real)</option>
                          </select></td>
                      </tr>
                      <tr>
                        <td>Número</td>
                        <td><input type="text" class="form-control" id="EdtNumeroPedido" onKeyPress="return vnumeros(event)"></td>
                      </tr>
                      <!--<tr>
                         <td>Solicitante</td>
                         <td><input type="text" class="form-control" id="EdtSolicitante"></td>
                       </tr>
                       <tr>
                         <td>Codigo SAP</td>
                         <td><input type="text" class="form-control" id="EdtCodigoSAP"></td>
                       </tr>-->
                      <tr>
                        <td colspan="2"><button type="button" class="btn btn-default " id="btnBuscarEditar"> <span class="glyphicon glyphicon-search" aria-hidden="true"></span>&nbsp;BUSCAR </button></td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- Modal Cuerpo-->
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
          <!-------------------------------------------------------------------------------------------->
          <div id="dvCentros"></div>
          <table id="" class="form" width="100%" align="center" cellpadding="5" cellspacing="0">
            <thead>
              <tr>
                <th colspan="4" align="center">SELECCION DE CLIENTES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cliente</td>
                <!--<td><input type="text" id="txt_cliente" class="form-control" placeholder="Busqueda de clientes" tabindex="1"></td>-->
                <td id="colCliente"></td>
              </tr>
              <tr>
                <td>Oficina Ventas (Bodega)</td>
                <td><select id="txt_oficina" class="form-control">
                  </select></td>
              </tr>
              </tr>

              <td>Destinatario</td>
              <td><select id="txt_destinatario" class="form-control">
                </select></td>
              </tr>
              <tr>
                <td>Telefono</td>
                <td><input type="text" id="txt_tel" class="form-control" readonly></td>
              </tr>
              <tr>
                <td>Email</td>
                <td><input type="text" id="txt_mail" class="form-control" readonly></td>
              </tr>
              <tr id="trCupo" style="display: none">
                <td>Cupo Credito</td>
                <td><input type="text" id="txt_cupo" class="form-control" readonly></td>
              </tr>
              <tr id="trCondicion" style="display: none">
                <td>Plazo</td>
                <td><input type="text" id="txt_plazo" class="form-control" readonly /></td>
              </tr>
              <tr id="trTipoPed" style="display: none">
                <td>Pedido de Integración</td>
                <td><select id="TxtIntegracion" class="form-control .select-pedido-integracion">
                    <option value="N" selected>NO</option>
                    <option value="S">SI</option>
                  </select></td>
              </tr>
              <tr>
                <td colspan="2" align="center"><button type="button" class="btn btn-default" id="btnLimpiar" onClick="Limpiar();"> <span class="glyphicon glyphicon-file" aria-hidden="true"></span> Nuevo </button>
                  <button type="button" class="btn btn-default" id="btnMas" data-toggle="modal" data-target="#ModalMasCliente" onClick="Comportamiento()"> <span class="glyphicon glyphicon-list" aria-hidden="true"></span> Mas </button>
                  <button type="button" class="btn btn-default" id="btnPuntos"> <span class="glyphicon glyphicon-heart" aria-hidden="true"></span> Puntos </button>

                  <!-- <button type="button" class="btn btn-default" id="btnEditar">
                  <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edición
                 </button>-->

                  <button type="button" class="btn btn-danger" id="btnDescuentos" style="display: none"> <span class="glyphicon glyphicon-bullhorn" aria-hidden="true"></span> Descuentos para ti! </button>
                  <button type="button" class="btn btn-default" id="btnEstadisticas" style="display: none"> <span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span> Estadisticas </button>
                  <?php

                  if (!empty($_SESSION["ses_NumOrg"]) && $_SESSION["ses_NumOrg"] == '2000') {
                    /*echo '<button type="button" class="btn btn-warning" id="btnFeriaVirtual">
                	     <span class="glyphicon glyphicon-fire" aria-hidden="true"></span> Feria Virtual
                	  </button>';*/
                  }
                  ?>
                </td>
              </tr>
            </tbody>

          </table>
          <div id="ModalEstadisticas" class="modal fade bd-example-modal-lg" role="dialog">
            <div class="modal-dialog modal-lg">
              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">ESTADISTICAS</h4>
                </div>
                <div class="modal-body">
                  <figure class="highcharts-figure">
                    <div id="container3"></div>
                    <p class="highcharts-description"></p>
                    <p id="cupo_txt1"></p>
                    <p id="cupo_txt2"></p>
                  </figure>
                  <figure class="highcharts-figure">
                    <div id="container"></div>
                    <p class="highcharts-description"></p>
                  </figure>
                  <figure class="highcharts-figure">
                    <div id="container2"></div>
                    <p class="highcharts-description"></p>
                  </figure>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
          <div id="ModalMasCliente" class="modal fade bd-example-modal-lg" role="dialog">
            <div class="modal-dialog modal-lg">
              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">INFORMACION ADICIONAL DE CLIENTE</h4>
                </div>
                <div class="modal-body">
                  <table class="form" width="100%">
                    <tbody>
                      <tr>
                        <td>Codigo</td>
                        <td><input type="text" id="txt_codigoSap" class="form-control" readonly></td>
                      <tr> </tr>
                      <tr>
                        <td>Nit</td>
                        <td><input type="text" id="txt_nit" class="form-control" readonly></td>
                      </tr>
                      <tr>
                        <td>Ciudad</td>
                        <td><input type="text" id="txt_ciudad" class="form-control" readonly></td>
                      </tr>
                      <td>Direccion</td>
                      <td><input type="text" id="txt_dir" class="form-control" readonly></td>
                      </tr>
                      <tr>
                        <td>Vendedor</td>
                        <td>
                          <div class="input-group"> <span class="input-group-addon" id="basic-addon1"> <span class="glyphicon glyphicon-user" aria-hidden="true"></span> </span>
                            <input type="text" class="form-control" id="txt_vendedor" aria-describedby="basic-addon1" readonly>
                          </div>
                          <div class="input-group"> <span class="input-group-addon" id="basic-addon1"> <span class="glyphicon glyphicon-earphone" aria-hidden="true"></span> </span>
                            <input type="text" class="form-control" id="txt_vendedor_tel" aria-describedby="basic-addon1" readonly>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Televendedor</td>
                        <td>
                          <div class="input-group"> <span class="input-group-addon" id="basic-addon1"> <span class="glyphicon glyphicon-user" aria-hidden="true"></span> </span>
                            <input type="text" class="form-control" id="txt_televendedor" aria-describedby="basic-addon1" readonly>
                          </div>
                          <div class="input-group"> <span class="input-group-addon" id="basic-addon1"> <span class="glyphicon glyphicon-earphone" aria-hidden="true"></span> </span>
                            <input type="text" class="form-control" id="txt_televendedor_tel" aria-describedby="basic-addon1" readonly>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Lista Precios</td>
                        <td><input type="text" id="txt_lista" class="form-control" readonly></td>
                      </tr>
                      <tr>
                        <td>Condicion de Pago</td>
                        <td><input type="text" id="txt_condicion" class="form-control" readonly></td>
                      </tr>
                      <tr>
                        <td>Institucionales</td>
                        <td><input type="text" id="txt_institucional" class="form-control" readonly>
                      </tr>
                      <tr>
                        <td>Controlados</td>
                        <td><input type="text" id="txt_controlado" class="form-control" readonly></td>
                      </tr>
                      <tr>
                        <td>Descuento Financiero %</td>
                        <td><input type="text" id="txt_descuento" class="form-control" readonly /></td>
                      </tr>
                      <tr>
                        <td>Grupo 1</td>
                        <td><select class="form-control" id="txtGrp1" readonly disabled>
                          </select></td>
                      </tr>
                      <tr>
                        <td>Grupo 2</td>
                        <td><select class="form-control" id="txtGrp2" readonly disabled>
                          </select></td>
                      </tr>
                    </tbody>

                  </table>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
          <!---FIN DIV CLIENTES-------------------------------------------------------------------------------------------->
        </div>
        <div class="tab-pane fade" id="dvProductos">
          <!---INICIO DIV PRODUCTOS---------------------------------------------------------------------------------------->
          <div class="container_vtotal">
            <table class="tableinfo" align="center">
              <thead>
                <tr>
                  <th align="center">&nbsp; &nbsp; &nbsp;VALOR TOTAL PEDIDO -
                    <input type="text" id="txt_total" class="sin_borde" readonly disabled>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <!-- FILTROS INPUTS TIPO CHECK -->
          <div style="width: 97.5%; margin: 0 auto;">
            <div class="row div-row">
              <div class="col-xs-6 col-sm-4 justify-content-between col-md-4 col-lg-2 div-col-check">
                <div class="div-container-check">
                  <img src="../resources/icons/pw/tag_stock.png" width="18" title="SOLO CON STOCK" heigth="18" align="absmiddle">
                  <p>Stock</p>
                </div>
                <div class="div-ckeck">
                  <div id="DvChkStock" class="DivCheckBox DivCheckBoxTrue"></div>
                </div>
              </div>
              <div class="col-xs-6 col-sm-4 col-md-4 col-lg-2 div-col-check">
                <div class="div-container-check">
                  <img src="../resources/icons/pw/tag_discount.png" width="18" heigth="18" title="SOLO DESCUENTOS" align="absmiddle">
                  <p>Descuentos</p>
                </div>
                <div class="div-ckeck">
                  <div id="DvChkDctos" class="DivCheckBox"></div>
                </div>
              </div>
              <div class="col-xs-6 col-sm-4 col-md-4 col-lg-2 div-col-check">
                <div class="div-container-check">
                  <img src="../resources/icons/pw/tag_marcado.png" width="18" title="PRODUCTO OFERTADO" heigth="18" align="absmiddle">
                  <p style="margin: auto;" id="prodOfer">Productos Ofertados</p>
                </div>
                <div class="div-ckeck">
                  <div id="DvChkOfertado" class="DivCheckBox"></div>
                </div>
              </div>
              <div class="col-xs-6 col-sm-4 col-md-4 col-lg-2 div-col-check">
                <div class="div-container-check">
                  <img src="../resources/icons/regalo.png" width="18" heigth="18" title="PRODUCTO BONIFICADO" align="absmiddle">
                  <p>Bonificados</p>
                </div>
                <div class="div-ckeck">
                  <div id="DvChkBonif" class="DivCheckBox"></div>
                </div>
              </div>
              <div class="col-xs-6 col-sm-4 col-md-4 col-lg-2 div-col-check">
                <div class="div-container-check">
                  <img src="../resources/icons/nuevo.png" width="18" title="PRODUCTOS NUEVO" heigth="18" align="absmiddle">
                  <p style="margin: auto;" id="prodNuevos">Productos Nuevos (90 Dias)</p>
                </div>
                <div class="div-ckeck">
                  <div id="DvChkNuevos" class="DivCheckBox"></div>
                </div>
              </div>
              <div class="col-xs-6 col-sm-4 col-md-4 col-lg-2 div-col-check">
                <div class="div-container-check">
                  <img src="../resources/icons/pw/tag_kit.png" width="18" title="PRODUCTOS KITS" heigth="18" align="absmiddle">
                  <p>KIT'S</p>
                </div>
                <div class="div-ckeck">
                  <div id="DvChkKits" class="DivCheckBox"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- RESULTADOS BÚSQUEDA DE PRODUCTOS -->
          <div style="display: flex; justify-content: flex-end; margin-bottom: 10px; gap: 10px;" id="divBotonesProductos">
            <button class="btn btn-primary btn-sm" id="btnProductosMasVendidos">Consultar productos más vendidos(Día)</button>
            <button class="btn btn-default btn-sm" id="btnLimpiarProductos" title="Limpiar datos productos más vendidos">Limpiar</button>
          </div>
          <div style="overflow: auto; height: 200px;" id="tablaProductosMasVendidos"></div>
          <table class="form" width="100%">
            <tr>
              <td colspan="2">
                <div id="n_resultados" class="n_resultados"></div>
              </td>
            </tr>
            <tr>
              <td width="100%">
                <div class="input-group">
                  <input type="text" id="txt_bproductos" placeholder="F2 - Descripción de producto : Nombre - Codigo - Grupo" class="form-control" tabindex="1">
                  <div class="input-group-btn">
                    <button class="btn btn-default" type="button" title="Búsqueda de productos por voz" onclick="iniciarVozATexto('txt_bproductos',this)"> <i class="fa-solid fa-microphone"></i>&nbsp; </button>
                    <button type="button" class="btn btn-default" id="btnMas" data-toggle="modal" data-target="#ModalAjustesBusqueda"> <i class="fa-solid fa-gear"></i>&nbsp; </button>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <div id="ModalAjustesBusqueda" class="modal fade bd-example-modal-lg" role="dialog">
            <div class="modal-dialog modal-lg">
              <!-- Modal content.-->
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Configuracion de busqueda</h4>
                </div>
                <div class="modal-body">
                  <table class="form" width="100%">
                    <!-- <tr>
                    <td><img src="../resources/icons/pw/tag_stock.png" width="24"  title="SOLO CON STOCK" heigth="24" align="absmiddle">&nbsp;Stock</td>
                    <td><div id="DvChkStock" class="DivCheckBox DivCheckBoxTrue"></div></td>
                  </tr>
                  <tr>
                    <td><img src="../resources/icons/pw/tag_discount.png" width="24" heigth="24" title="SOLO DESCUENTOS"  align="absmiddle">&nbsp;Descuentos</td>
                    <td><div id="DvChkDctos" class="DivCheckBox"></div></td>
                  </tr>
                  <tr>
                    <td><img src="../resources/icons/pw/tag_marcado.png" width="24"  title="PRODUCTO OFERTADO" heigth="24" align="absmiddle">&nbsp;Productos Ofertados</td>
                    <td><div id="DvChkOfertado" class="DivCheckBox"></div></td>
                  </tr>
                  <tr>
                    <td><img src="../resources/icons/regalo.png" width="24" heigth="24" title="PRODUCTO BONIFICADO"  align="absmiddle">&nbsp;Bonificados</td>
                    <td><div id="DvChkBonif" class="DivCheckBox"></div></td>
                  </tr>
                  <tr>
                    <td><img src="../resources/icons/nuevo.png" width="24" title="PRODUCTOS NUEVO" heigth="24" align="absmiddle">&nbsp;Productos Nuevos (90 Dias)</td>
                    <td><div id="DvChkNuevos" class="DivCheckBox"></div></td>
                  </tr>
                  <tr>
                    <td><img src="../resources/icons/pw/tag_kit.png" width="24" title="PRODUCTOS KITS" heigth="24" align="absmiddle">&nbsp;KIT'S</td>
                    <td><div id="DvChkKits"  class="DivCheckBox"></div></td>
                  </tr> -->

                    <tr>
                      <td>Proveedores</td>
                      <td><select id="txtGrupoArticulo" class="form-control" style="width:100%">
                        </select></td>
                    </tr>
                    <tr>
                      <td>Numero Temporal</td>
                      <td align="center"><input type="text" id="txt_numero" class="form-control" readonly></td>
                    </tr>
                    <tr>
                      <td>Numero SAP</td>
                      <td align="center"><input type="text" id="txt_numero_sap" class="form-control" readonly></td>
                    </tr>
                    <tr>
                      <td>Importar Plano [codigo,cantidad]</td>
                      <td align="center"><input type="file" id="filename" name="filename" class="form-control" readonly></td>
                    </tr>
                  </table>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
          <div id="dvResultProductos"></div>

          <!---FIN DIV PRODUCTOS------------------------------------------------------------------------------------------->
        </div>
        <div class="tab-pane fade" id="dvPedidos">
          <!---INICIO DIV PEDIDOS------------------------------------------------------------------------------------------>
          <div id="ModalInfoBonificados" class="modal fade bd-example-modal-lg" role="dialog">
            <div class="modal-dialog modal-lg">
              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">INFORMACION DE BONIFICADOS</h4>
                </div>
                <div class="modal-body" id="ContenidoInfoBonificados"></div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
          <div id="dvResultPedidos"></div>
          <!---FIN DIV PEDIDOS--------------------------------------------------------------------------------------------->
        </div>
        <div class="tab-pane fade" id="dvRecuperar">
          <!---RECUPERAR PEDIDOS PROPIOS----------------------------------------------------------------------------------->
          <div id="DvRecuperables"></div>
          <!---FIN RECUPERAR PEDIDOS PROPIOS------------------------------------------------------------------------------->
        </div>
        <div class="tab-pane fade" id="dvRecuperarTerceros">
          <!---RECUPERAR PEDIDOS DE TERCEROS------------------------------------------------------------------------------->
          <input type="hidden" id="txtCodigoSAP" readonly disabled>
          <table class="form" align="center" width="100%">
            <thead>
              <tr>
                <th colspan="3">PEDIDOS DE TERCEROS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cliente</td>
                <td><input type="text" id="txtCliente" placeholder="Cliente" class="form-control"></td>
              </tr>
              <tr>
                <td>Zona de ventas</td>
                <td><select id="txtZonas" class="form-control" style="width:100%">
                  </select></td>
              </tr>
              <tr>
                <td>Clase de Pedido</td>
                <td><select id="txtClasePedido" class="form-control" style="width:100%">
                    <option value="T" selected>TODOS</option>
                    <option value="ZPWA">ZPWA - ADMINISTRADOR</option>
                    <option value="ZPWV">ZPWV - VENDEDOR</option>
                    <option value="ZPWL">ZPWL - TELEVENDEDOR</option>
                    <option value="ZPWP">ZPWP - PROVEEDOR</option>
                    <option value="ZPWT">ZPWT - TRANSFERENCISTA</option>
                    <option value="ZPWC">ZPWC - CLIENTE</option>
                    <option value="ZPIC">ZPIC - INTEGRACION COMERCIAL</option>
                  </select></td>
              </tr>
              <tr>
                <td>Oficina de ventas</td>
                <td colspan="2"><select id="FiltroOficinaVentas" class="form-control" style="width:100%">
                  </select></td>
              </tr>
              <tr>
                <td>Fechas Inicial</td>
                <td colspan="2"><input type="text" id="txtFecha1" placeholder="Fecha Inicial" class="form-control"></td>
              </tr>
              <tr>
                <td>Fechas Final</td>
                <td colspan="2"><input type="text" id="txtFecha2" placeholder="Fecha Final" class="form-control"></td>
              </tr>
              <tr>
                <td>Temporales Historia</td>
                <td colspan="2"><select id="txtTemporalesHistoria" class="form-control" style="width:100%">
                    <option value="N" selected>NO</option>
                    <option value="S">SI</option>
                  </select></td>
              </tr>
              <tr>
                <td colspan="3">
                  <button class="btn btn-info btn-sm" onClick="GestionPedidos();">Buscar</button>
                  <button class="btn btn-default btn-sm" onClick="LimpiarGestionPedido();">Limpiar</button>
                  <button class="btn btn-success btn-sm" id="exportar_gestion">Exportar</button>
                </td>

              </tr>
            </tbody>
          </table>
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-sm btn-danger" onClick="FiltrosTipoPedidos('T')"><b>T</b>emporal</button>
            <button type="button" class="btn btn-sm btn-warning" onClick="FiltrosTipoPedidos('P')"><b>P</b>edido</button>
            <button type="button" class="btn btn-sm btn-success" onClick="FiltrosTipoPedidos('E')"><b>E</b>ntrega</button>
            <button type="button" class="btn btn-sm btn-info" onClick="FiltrosTipoPedidos('O')"><b>O</b>rden</button>
            <button type="button" class="btn btn-sm btn-primary" onClick="FiltrosTipoPedidos('F')"><b>F</b>actura</button>
            <button type="button" class="btn btn-sm btn-default" onClick="FiltrosTipoPedidos('A')"><b>TODOS</b></button>
          </div>
          <div id="VtotalTerceros"></div>
          <div id="DvRecuperablesTerceros"></div>
          <!---FIN RECUPERAR PEDIDOS DE TERCEROS--------------------------------------------------------------------------->
        </div>
        <div class="tab-pane fade" id="dvAddEntregas">
          <input type="hidden" id="CodigoSAPEntregas" class="form-control">
          <table class="form" align="center" width="100%">
            <thead>
              <tr>
                <th colspan="3">GESTION DE ENTREGAS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cliente</td>
                <td><input type="text" id="ClienteEntregas" placeholder="Cliente" class="form-control"></td>
              </tr>
              <tr>
                <td>Oficina</td>
                <td><select id="OficinaEntregas" class="form-control">
                  </select></td>
              </tr>
              <tr>
                <td>Fechas Inicial</td>
                <td colspan="2"><input type="text" id="EntregasFecha1" placeholder="Fecha Inicial" class="form-control"></td>
              </tr>
              <tr>
                <td>Fechas Final</td>
                <td colspan="2"><input type="text" id="EntregasFecha2" placeholder="Fecha Final" class="form-control"></td>
              </tr>
              <tr>
                <td colspan="3">
                  <div class="btn-group" role="group" aria-label="...">
                    <button class="btn btn-info btn-sm" onClick="GestionEntregas();">Buscar</button>
                    <button class="btn btn-success btn-sm" onClick="UnificarEntrega();">Crear Entrega</button>
                    <button class="btn btn-default btn-sm" onClick="LimpiarEntregas();">Limpiar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div id="DvListaEntregas"></div>
        </div>
        <div class="tab-pane fade" id="dvListaFacts">
          <input type="hidden" id="txtFactCodigoCliente" class="form-control" readonly disabled>
          <table class="form" align="center" width="100%">
            <thead>
              <tr>
                <th colspan="3">FACTURACIÓN DE TERCEROS</th>
              </tr>
            </thead>
            <tbody>
              <tr id="tr_cliente_fact">
                <td>Cliente</td>
                <td><input type="text" id="txtFactCliente" placeholder="Cliente" class="form-control"></td>
              </tr>
              <tr>
                <td>Numero factura</td>
                <td><input type="text" id="txtNumFact" placeholder="Numero de factura" class="form-control"></td>
              </tr>
              <tr>
                <td>Fechas Inicial</td>
                <td colspan="2"><input type="text" id="txtFactFecha1" placeholder="Fecha Inicial" class="form-control"></td>
              </tr>
              <tr>
                <td>Fechas Final</td>
                <td colspan="2"><input type="text" id="txtFactFecha2" placeholder="Fecha Final" class="form-control"></td>
              </tr>
              <tr>
                <td colspan="3"><button class="btn btn-info btn-sm" onClick="ListarFacturas();">Buscar</button>
                  <button class="btn btn-default btn-sm" onClick="LimpiarFacturas();">Limpiar</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div id="VtotalFacturas"></div>
          <div id="DvListaFacturas"></div>
        </div>
        <div class="tab-pane fade" id="dvFaltantes">
          <input type="hidden" id="txtFaltanteCodigoCliente" class="form-control" readonly disabled>
          <table class="form" align="center" width="100%">
            <thead>
              <tr>
                <th colspan="3">LISTADO DE FALTANTES</th>
              </tr>
            </thead>
            <tbody>
              <tr id="tr_cliente_faltante">
                <td>Cliente</td>
                <td><input type="text" id="txtFaltanteCliente" placeholder="Cliente" class="form-control"></td>
              </tr>
              <tr>
                <td>Fechas Inicial</td>
                <td colspan="2"><input type="text" id="txtFaltanteFecha1" placeholder="Fecha Inicial" class="form-control"></td>
              </tr>
              <tr>
                <td>Fechas Final</td>
                <td colspan="2"><input type="text" id="txtFaltanteFecha2" placeholder="Fecha Final" class="form-control"></td>
              </tr>
              <tr>
                <td colspan="3"><button class="btn btn-info btn-sm" onClick="Faltante();">Buscar</button>
                  <button class="btn btn-success btn-sm" onClick="fnExcelReport('tdFaltantes');">Exportar</button>
                  <button class="btn btn-default btn-sm" onClick="LimpiarFaltantes();">Limpiar</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div id="VtotalFaltante"></div>
          <div id="DvListaFaltante"></div>
        </div>
        <div class="tab-pane fade" id="dvEventos">
          <!---INICIO DIV EVENTOS------------------------------------------------------------------------------------------>
          <!--       <table class="form" width="100%">
              <tr> 
               <td>
                  <label for="selTipos">TIPOS</label>
                   <select class="form-control" id="selTipos" >
                      <option value="T">Todos</option>
					  <option value="BON">Bonificados</option>
					  <option value="DES">Descuentos</option>
                   </select>
               </td>
               <td>
                   <div class="input-group"> 
					<span class="input-group-addon" id="basic-addon1">
						<i class="fa-solid fa-gifts" style="width: 30px;"></i>
					</span>
					<input type="text" id="CantBoni" class="form-control" disabled readonly>
				  </div>
              </td>
              <td>    
                  <div class="input-group"> 
					<span class="input-group-addon" id="basic-addon1">
						<i class="fa fa-tags" style="width: 30px;"></i>
					</span>
					<input type="text" id="CantDesc" class="form-control" disabled readonly>
				</div>
               </td>
              </tr>
             </table>-->
          <div class="row">
            <div class="col-md-4">
              <div class="input-group"> <span class="input-group-addon" id="basic-addon1"> <i class="fa-solid fa-filter" style="width: 30px;"></i> </span>
                <select class="form-control blog" id="selTipos">
                  <option value="T">Todos</option>
                  <option value="BON">Bonificados</option>
                  <option value="DES">Descuentos</option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="input-group"> <span class="input-group-addon" id="basic-addon1"> <i class="fa-solid fa-gifts" style="width: 30px;"></i> </span>
                <input type="text" id="CantBoni" class="form-control" disabled readonly>
              </div>
            </div>
            <div class="col-md-4">
              <div class="input-group"> <span class="input-group-addon" id="basic-addon1"> <i class="fa fa-tags" style="width: 30px;"></i> </span>
                <input type="text" id="CantDesc" class="form-control" disabled readonly>
              </div>
            </div>
          </div>
          </br>
          <div class="row">
            <div class="col-md-12">
              <div class="input-group"> <span class="input-group-addon" id="basic-addon1"> <i class="fa-solid fa-newspaper" style="width: 30px;"></i> </span>
                <form autocomplete="off">
                  <input type="text" id="txtFilter" class="form-control" placeholder="Filtro por líneas..." autocomplete="off" value="" />
                </form>
              </div>
            </div>
          </div>
          </br>
          <div id="ResultEventos"></div>
          <!---FIN DIV EVENTOS--------------------------------------------------------------------------------------------->
        </div>
      </div>
    </div>
  </div>
  <!-------------------------MENU DE OPCIONES PARA PEDIDOS---------------------------------------------------------------------->
  <div id="ModalOpciones" class="modal fade bd-example-modal-md" role="dialog">
    <div class="modal-dialog modal-md">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Menú de opciones</h4>
        </div>
        <div class="modal-body" id="ContenidoModalOpciones">
          <!--inputs ocultos--->
          <input type="hidden" id="ped_valor_total" disabled readonly>
          <input type="hidden" id="ped_destinatario" disabled readonly>
          <input type="hidden" id="ped_bodega" disabled readonly>
          <input type="hidden" id="ped_codigo_sap" disabled readonly>
          <input type="hidden" id="ped_transferido" disabled readonly>
          <input type="hidden" id="ped_gestion" disabled readonly>
          <div class="container-liquid">
            <!-- <div class="row">
            <div class="col-md-12">
                <div class="panel panel-info">
                    <div class="panel-heading">Datos del cliente</div>
                    <table class="">
                      <tr>
                        <th>Destinatario</th>
                        <td id="info-cliente-codigo-sap"></td>
                      </tr>
                      <tr>
                        <th>Razón comercial</th>
                        <td id="info-cliente-nombres"></td>
                      </tr>
                    </table>
                </div>
            </div>
          </div>-->
            <div class="row">
              <div class="col-md-4">
                <div class="panel panel-info">
                  <div class="panel-heading">Opciones</div>
                  <ul class="list-group">
                    <button type="button" class="list-group-item" onClick="SolDesbloqueo()" id="btn-sol-desbloqueo" title="Solicitar desbloqueo de pedido" style="display:none"> <i class="fa-solid fa-unlock text-danger"></i> Sol. Desbloqueo </button>
                    <button type="button" id="btnMenu1" class="list-group-item" onClick="GuardarDirecto()" title="Guardar Directo"> <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Guardar </button>
                    <button type="button" id="btnMenu2" class="list-group-item" title="Recuperar pedido" onClick="RecuperarPedido()"> <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span> Recuperar </button>
                    <button type="button" id="btnMenu3" class="list-group-item" onClick="VisualizarPedido()" title="Visualizar PDF"> <span class="glyphicon glyphicon-file" aria-hidden="true"></span> Visualizar </button>
                    <button type="button" id="btnMenu4" class="list-group-item" onClick="Rastreo()" title="Rastreo de pedido"> <span class="glyphicon glyphicon-screenshot" aria-hidden="true"></span> Rastreo </button>
                    <button type="button" id="btnMenu5" class="list-group-item" onClick="EliminarPedido()" title="Eliminar"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Eliminar </button>
                    <button type="button" id="btnMenu6" class="list-group-item" onClick="Entregas()" title="Generar entregas"> <span class="glyphicon glyphicon-check" aria-hidden="true"></span> Entregas </button>
                    <button type="button" id="btnMenu7" class="list-group-item" onClick="Ordenes()" title="Generar OT"> <span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> OT - Logistica </button>
                    <button type="button" id="btnMenu8" class="list-group-item" title="Generar Factura"> <span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Factura </button>
                    <button type="button" id="btnMenu9" class="list-group-item" title="Refrescar"> <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Refrescar </button>
                    <button type="button" id="btnMenu10" class="list-group-item" title="Log de modificaciones"> <span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span> Historial </button>
                  </ul>
                </div>
              </div>
              <div class="col-md-8" id="Result">
                <div class="panel panel-info">
                  <div class="panel-heading">Flujo de documentos</div>
                  <table class="form" width="100%">
                    <tr>
                      <td>Usuario ADG</td>
                      <td><input type="text" id="ped_usuario" class="form-control" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Pedido ADG</td>
                      <td><input type="text" id="ped_numero" class="form-control" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Dirección pedido</td>
                      <td><input type="text" id="direccion_pedido" class="form-control" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Pedido SAP</td>
                      <td><input type="text" id="ped_numero_sap" class="form-control" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Entrega</td>
                      <td><input type="text" id="ped_entrega" class="form-control" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Orden</td>
                      <td><input type="text" id="ped_ot" class="form-control" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Factura</td>
                      <td><input type="text" id="ped_factura" class="form-control" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Notas</td>
                      <td><textarea id="NotasRapidas" placeholder="Notas de pedidos" class="notas"></textarea></td>
                    </tr>
                    <tr>
                      <td colspan="2"><button type="button" class="list-group-item" onClick="NotaRapida();" id="btnNotaRapida">
                          <spam class="glyphicon glyphicon-check"></spam>
                          Salvar Nota
                        </button></td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-----------------------------VISUALIZAR PDF PEDIDO----------------------------------------------------------------------------->
  <div id="ModalPDF" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">VISUALIZAR PEDIDO</h4>
        </div>
        <div class="modal-body" id="ContenidoPDF"> </div>
        <div class="modal-footer">
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-success btn-sm" onClick="DescargarExcel('PEDIDO')"> <span class="glyphicon glyphicon-cloud-download" aria-hidden="true"></span> Excel </button>
            <button type="button" class="btn btn-info btn-sm" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-----------------------------VISUALIZAR PDF FACTURA----------------------------------------------------------------------------->
  <div id="ModalPDFfactura" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">VISUALIZAR FACTURA</h4>
        </div>
        <div class="modal-body" id="ContenidoPDFfactura"> </div>
        <div class="modal-footer">
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-success btn-sm" onClick="DescargarExcel('FACTURA')"> <span class="glyphicon glyphicon-cloud-download" aria-hidden="true"></span> Excel </button>
            <button type="button" class="btn btn-info btn-sm" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!----------------------------INFORMACION DE MATERIALES-------------------------------------------------------------------->
  <div id="ModalInfoMaterial" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Datos adicionales de productos</h4>
        </div>
        <div class="modal-body">
          <div class="panel with-nav-tabs panel-info">
            <div class="panel-heading">
              <ul class="nav nav-tabs">
                <li class="active"><a href="#ContenidoInfoMateriales" data-toggle="tab"> <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Información</a> </li>
                <li class="" id=""><a href="#ContenidoShoppingMateriales" data-toggle="tab" id=""> <span class="glyphicon glyphicon-star" aria-hidden="true"></span> Shopping</a> </li>
                <li class="" id=""><a href="#ContenidoHuellaMateriales" data-toggle="tab" id=""> <span class="glyphicon glyphicon-bell" aria-hidden="true"></span> Huella</a> </li>
              </ul>
            </div>
            <div class="panel-body">
              <div class="tab-content">
                <div class="tab-pane fade in active" id="ContenidoInfoMateriales"> </div>
                <div class="tab-pane fade in" id="ContenidoShoppingMateriales">
                  <table class="form" width="100%">
                    <thead>
                    </thead>
                    <tbody>
                      <tr>
                        <td>CODIGO</td>
                        <td><input type="text" class="form-control" id="shoping_codmaterial" readonly></td>
                      </tr>
                      <tr>
                        <td>DESCRIPCIÓN</td>
                        <td><input type="text" class="form-control" id="shoping_descripcion" readonly></td>
                      </tr>
                      <tr>
                        <td>VALOR ACTUAL</td>
                        <td><input type="text" class="form-control" id="shoping_preciomaterial" readonly></td>
                      </tr>
                      <tr>
                        <td>COMPETENCIA</td>
                        <td><select id="shoping_competencia" class="form-control">
                          </select></td>
                      </tr>
                      <tr>
                        <td>VALOR COMPETENCIA</td>
                        <td><input type="number" class="form-control" id="shoping_valor"></td>
                      </tr>
                      <tr>
                        <td>OBSERVACIÓN</td>
                        <td><input type="text" class="form-control" id="shoping_observacion"></td>
                      </tr>
                      <tr>
                        <td colspan="2"><button type="button" class="btn btn-sm btn-success" onClick="GuardarShoping();">Guardar</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="tab-pane fade in" id="ContenidoHuellaMateriales">
                  <div class="alert alert-warning alert-dismissible" role="alert"> <strong>NOTA!</strong> Ingreso de huella de faltantes para solicitar compra. </div>
                  <input type="hidden" class="form-control" id="huella_stock" readonly>
                  <input type="hidden" class="form-control" id="huella_dcto" readonly>
                  <table class="form" width="100%">
                    <thead>
                    </thead>
                    <tbody>
                      <tr>
                        <td>CODIGO</td>
                        <td><input type="text" class="form-control" id="huella_codmaterial" readonly></td>
                      </tr>
                      <tr>
                        <td>DESCRIPCIÓN</td>
                        <td><input type="text" class="form-control" id="huella_descripcion" readonly></td>
                      </tr>
                      <tr>
                        <td>CANTIDAD</td>
                        <td><input type="number" class="form-control" id="huella_cantidad"></td>
                      </tr>
                      <tr>
                        <td>OBSERVACIÓN</td>
                        <td><input type="text" class="form-control" id="huella_notas"></td>
                      </tr>
                      <tr>
                        <td colspan="2"><button type="button" class="btn btn-sm btn-success" onClick="GuardarHuella();">Guardar</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-------------------------RASTREO DE PEDIDOS - TRAZABILIDAD----------------------------------------------------------------->
  <div id="ModalRastreo" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">SEGUIMIENTO / RASTREO DE PEDIDOS</h4>
        </div>
        <div class="modal-body pre-scrollable">
          <table class="form" width="100%">
            <tbody>
              <tr>
                <td>Organización</td>
                <td id="txt_org"></td>
              </tr>
              <tr>
                <td>Bodega</td>
                <td id="txt_bodega"></td>
              </tr>
              <tr>
                <td>Nombres</td>
                <td id="txt_nombres"></td>
              </tr>
              <tr>
                <td>Identificación</td>
                <td id="txt_nit"></td>
              </tr>
              <tr>
                <td>Codigo Interno:</td>
                <td id="txt_cod_sap"></td>
              </tr>
              <tr>
                <td>Direcciòn:</td>
                <td id="txt_direccion"></td>
              </tr>
              <!-----------------PEDIDO-------------------------------------------------------->
              <tr>
                <td colspan="4"><b>PEDIDO</b></td>
              </tr>
              <tr>
                <td>Numero Pedido</td>
                <td id="txt_num_ped"></td>
              </tr>
              <tr>
                <td>Usuario Pedido</td>
                <td id="txt_usuario_ped"></td>
              </tr>
              <tr>
                <td>Fecha</td>
                <td id="txt_fecha_ped"></td>
              </tr>
              <tr>
                <td>Usuario OT</td>
                <td id="txt_usuario_ot"></td>
              </tr>
              <!-----------------ENTREGAS-------------------------------------------------------->
              <tr>
                <td colspan="4"><b>ENTREGA</b></td>
              </tr>
              <tr>
                <td>Numero entrega</td>
                <td id="txt_num_ent"></td>
              </tr>
              <tr>
                <td>Usuario Entrega</td>
                <td id="txt_usuario_ent"></td>
              </tr>
              <tr>
                <td>Fecha</td>
                <td id="txt_fecha_ent"></td>
              </tr>
              <!-----------------SEPARACION-------------------------------------------------------->
              <tr>
                <td colspan="4"><b>SEPARACION</b></td>
              </tr>
              <tr>
                <td>Usuario</td>
                <td id="txt_usuario_sep"></td>
              </tr>
              <tr>
                <td>Numero OT.</td>
                <td id="txt_numero_ot"></td>
              </tr>
              <tr>
                <td>Fecha OT</td>
                <td id="txt_fecha_ot"></td>
              </tr>
              <tr>
                <td>Fecha Inicio</td>
                <td id="txt_fecha_ini_ot"></td>
              </tr>
              <tr>
                <td>Fecha Fin</td>
                <td id="txt_fecha_fin_ot"></td>
              </tr>
              <!-----------------FACTURACION-------------------------------------------------------->
              <tr>
                <td colspan="3"><b>FACTURACION</b></td>
              </tr>
              <tr>
                <td>Usuario</td>
                <td id="txt_usuario_fact"></td>
              </tr>
              <tr>
                <td>Numero/Tipo</td>
                <td id="txt_numero_fact"></td>
              </tr>
              <tr>
                <td>Fecha Inicio</td>
                <td id="txt_fecha_ini_fact"></td>
              </tr>
              <tr>
                <td>Fecha Fin</td>
                <td id="txt_fecha_fin_fact"></td>
              </tr>
              <!-----------------EMPAQUE-------------------------------------------------------->
              <tr>
                <td colspan="3"><b>EMPAQUE</b></td>
              </tr>
              <tr>
                <td>Usuario</td>
                <td id="txt_usuario_emp"></td>
              </tr>
              <tr>
                <td>Fecha Inicio</td>
                <td id="txt_fecha_ini_emp"></td>
              </tr>
              <tr>
                <td>Fecha Fin</td>
                <td id="txt_fecha_fin_emp"></td>
              </tr>
              <tr>
                <td>N° Bolsas</td>
                <td id="txt_bolsas_emp"></td>
              </tr>
              <tr>
                <td>N° Paquetes</td>
                <td id="txt_paquetes_emp"></td>
              </tr>
              <tr>
                <td>N° Cajas</td>
                <td id="txt_cajas_emp"></td>
              </tr>
              <!-----------------TRANSPORTE-------------------------------------------------------->
              <tr>
                <td colspan="6"><b>TRANSPORTE</b></td>
              </tr>
              <tr>
                <td>Usuario</td>
                <td id="txt_usr_ent" colspan="3"></td>
              </tr>
              <tr>
                <td>Fecha Inicio</td>
                <td id="txt_fhini_ent"></td>
              </tr>
              <tr>
                <td>Fecha Fin</td>
                <td id="txt_fhfin_ent"></td>
              </tr>
              <tr>
                <td># Guia</td>
                <td id="txt_guia">'+data[0].GUIA+'</td>
              </tr>
              <tr>
                <td align="left">Nota</td>
                <td id="txt_nota"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <!-------------------------MENU DE ENTREGAS---------------------------------------------------------------------------------------->
  <div id="ModalEntregas" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">ENTREGA DE PEDIDO</h4>
        </div>
        <div class="modal-body pre-scrollable">
          <table class="form" width="100%">
            <thead>
              <th>POS</th>
              <th>CODIGO</th>
              <th>DESCRIPCION</th>
              <th>CANTIDAD</th>
              <th>PEDIDO</th>
              <th>DESCUENTO</th>
              <th>ENTREGA</th>
              <th>ANULAR</th>
              <th>STOCK</th>
            </thead>
            <tbody id="tdDetalleEntregas">
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <p align="left" id="valor_entrega"></p>
          <p align="left" id="valor_entrega_iva"></p>
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-success btn-sm" onClick="DescargarExcel('ENTREGA')"> <span class="glyphicon glyphicon-cloud-download" aria-hidden="true"></span> Excel </button>
            <button type="button" class="btn btn-warning btn-sm" onClick="ModificarEntrega();">Editar/Guardar</button>
            <button type="button" class="btn btn-danger btn-sm" onClick="EliminarEntrega();">Eliminar</button>
            <button type="button" class="btn btn-info btn-sm" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-------------------------MENU DE ORDENES DE TRANSPORTE----------------------------------------------------------------------------->
  <div id="ModalOrdenes" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">ORDEN DE TRANSPORTE</h4>
        </div>
        <div class="modal-body pre-scrollable">
          <table class="form" width="100%">
            <thead>
              <th>POS</th>
              <th>CODIGO</th>
              <th>DESCRIPCION</th>
              <th>CANTIDAD</th>
              <th>LOTE</th>
              <th>OT</th>
              <th>ANULAR</th>
            </thead>
            <tbody id="tdDetalleOrdenes">
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <p align="left" id="valor_orden"></p>
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-success btn-sm" onClick="DescargarExcel('OT')"> <span class="glyphicon glyphicon-cloud-download" aria-hidden="true"></span> Excel </button>
            <button type="button" class="btn btn-danger btn-sm" id="btnEliminaOT" onClick="EliminarOT();">Eliminar</button>
            <button type="button" class="btn btn-info btn-sm" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-------------------------MENU DE ORDENES DE TRANSPORTE----------------------------------------------------------------------------->
  <div id="ModalLog" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">LOG DE CAMBIOS</h4>
        </div>
        <div class="modal-body pre-scrollable" id="DetalleLog"> </div>
        <div class="modal-footer">
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-info btn-sm" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!------------------------------------------------------------------------------------------------>
  <!----Modal para telefono IP------------------------------------------------------------------------------------------
    <button type="button" class="container_phone" id="btnPhone"><div class="glyphicon glyphicon-earphone" aria-hidden="true"></div></button>
    
    <div id="ModalPhone" class="modal fade bd-example-modal-md" role="dialog">
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">SOFTPHONE - MULTIROMA</h4>
          </div>
          <div class="modal-body" id="ContenidoPhone">
            
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div> -->
  <!------------------------------------------------------------------------------------------------>

  <div id="ModalFeriaVirtual" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">SEGUIMIENTO GRAN FERIA VIRTUAL MAYO</h4>
        </div>
        <div class="modal-body pre-scrollable">

          <div class="panel with-nav-tabs panel-info">
            <div class="panel-heading">
              <ul class="nav nav-tabs">
                <li class=""><a href="#dvGenericos" data-toggle="tab" onClick="QueryFeria(1)">POPULARES</a></li>
                <li class=""><a href="#dvPopulares" data-toggle="tab" onClick="QueryFeria(2)">GENERICOS</a></li><!---->
                <li class=""><a href="#dvFarma" data-toggle="tab" onClick="QueryFeria(3)">FARMA</a></li><!---->
                <li class="active"><a href="#dvOTC" data-toggle="tab" onClick="QueryFeria(4)">OTC</a></li><!---->
                <li class=""><a href="#dvGranSorteo" data-toggle="tab" onClick="QueryFeria(5)">RESUMEN</a></li><!---->
              </ul>
            </div>
            <div class="panel-body">
              <div class="tab-content">
                <div id="dvGenericos" class="tab-pane fade in active" role="dialog">
                  <div class="alert alert-warning" role="alert">
                    <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                    Evento válido desde el 02-05-2022 al 07-05-2022
                  </div>
                  <div id="dvPopularesDetalle"></div>
                </div>
                <div id="dvPopulares" class="tab-pane fade in" role="dialog">
                  <div class="alert alert-warning" role="alert">
                    <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                    Evento válido desde el 09-05-2022 al 14-05-2022
                  </div>
                  <div id="dvGenericosDetalle"></div>
                </div>
                <div id="dvFarma" class="tab-pane fade in " role="dialog">
                  <div class="alert alert-warning" role="alert">
                    <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                    Evento válido desde el 16-05-2022 al 21-05-2022
                  </div>
                  <div id="dvFarmaDetalle"></div>
                </div>
                <div id="dvOTC" class="tab-pane fade in " role="dialog">
                  <div class="alert alert-sm alert-warning" role="alert">
                    <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                    Evento válido desde el 23-05-2022 al 31-05-2022
                  </div>
                  <div id="dvOTCDetalle"></div>
                </div>
                <div id="dvGranSorteo" class="tab-pane fade in" role="dialog">
                  <div class="alert alert-danger" role="alert">
                    <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                    Estimado cliente, ten presente que solo podras reclamar las boletas semanales siempre y cuando cumplas con todas las semanas
                  </div>
                  <div id="dvGranSorteoDetalle"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <p align="left" id="valor_orden"></p>
        </div>

      </div>
    </div>
  </div>
  <!-----------------------MODAL IMAGEN ANIVERSARIO------------------------------------------------------------------------->
  <div id="ModalFeriaMayo" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">GRAN FERIA VIRTUAL MAYO</h4>
        </div>
        <div class="modal-body" id="">
          <img src="../resources/icons/semana4.png" width="100%" heigth="100%" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-----------------------MODAL PLAN DE PUNTOS------------------------------------------------------------------------->
  <div id="ModalPP" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-info">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title text-weight" id="tdCodigoSapPuntos"></h4>
          <h4 class="modal-title text-weight" id="tdAcumuladoPuntos"></h4>
        </div>
        <div class="modal-body" id="">
          <div class="row">
            <div class="col-md-12">
              <div id="dvMaterialespuntos"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <div id="ModalPPDetalle" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-info">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title text-weight">Redimir </h4>
        </div>
        <div class="modal-body" id="">
          <input type="hidden" id="redimePuntos" disabled readonly>
          <input type="hidden" id="redimeProducto" disabled readonly>
          <div class="row">
            <div class="col-md-6 text-center"><img src="" alt="" width="340" height="340" id="imgDetalle"></div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-12" id="descripcionDetallePuntos"></div>
                <div class="col-md-12" id="puntosDetalle"></div>
                <div class="col-md-12" id="stockDetalle"></div>
                <div class="col-md-12">
                  <button id="buy-now" class="btn btn-lg  btn-success">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Redimir
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!------------------------------------------------------------------------------------------------>
  <div id="Bloquear" style="display:none;"></div>
  <div class="centrado-porcentual" style="display:none;background-color:transparent; width:30%; height:250px"></div>
</body>

</html>