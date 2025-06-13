<?php
/* DESARROLLADO POR ING CRISTIAN BULA 09-12-2016 */
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 1 Jul 2000 05:00:00 GMT");
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
  <title>Modulo de pedidos WEB - SAP</title>
  <link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php echo (rand()); ?>" />
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
  <link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php echo (rand()); ?>">
  <link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs.css?<?php echo (rand()); ?>">
  <link type="text/css" rel="stylesheet" href="../resources/select2-bootstrap4-theme/select2-bootstrap4.css">
  <link type="text/css" rel="stylesheet" href="../resources/select2/css/select2.css">
  <link type="text/css" rel="stylesheet" href="../resources/fontawesome/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.13.2/dist/sweetalert2.min.css">
  <style>
    .modal-body {
      max-height: calc(100vh - 200px);
      overflow-y: auto;
    }

    [data-notify] {
      z-index: 9999 !important;
    }

    .thumbnail {
      height: 400px;
    }

    .custom-thead {
      height: 35px;
      font-size: 15px;
      color: #055160;
      font-weight: 500;
      background-color: #cff4fc;
      padding: 0 5px;
    }

    .size-text {
      font-size: 14px;
    }

    .custom-tr {
      line-height: 3;
    }

    .btn-micro {
      border: 1px solid #dee2e6;
      border-radius: 0 3px 3px 0;
    }

    .w-btn {
      width: 140px;
    }

    .container-btn {
      margin-top: 10px;
      display: flex;
      justify-content: end;
      gap: 20px;
    }

    .custom-card {
      margin-bottom: 5px;
      border: 1px solid #dee2e6;
      border-radius: 3px;
    }

    .div-container {
      width: 99.8%;
      margin: 0 auto;
      border-left: 2px solid #dee2e6;
      border-right: 2px solid #dee2e6;
      padding: 0 8px;
    }

    .custom-total {
      background-color: #cff4fc;
      width: 30%;
      margin: 0 auto;
      position: fixed;
      bottom: 10px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 8px;
      border-radius: 5px;
      z-index: 50;
    }

    .input-total {
      color: #055160;
      font-weight: 500;
    }

    .p-total {
      margin: 0;
      color: #055160;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .custom-total {
        width: 70%;
        flex-direction: column;
        gap: 0;
      }

      .input-total {
        text-align: center;
      }
    }

    .centrado-porcentual {
      position: fixed;
      width: 100vw;
      height: 100vh;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 9999;

      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
    }

    .centrado-porcentual img {
      max-width: 500px;
      height: 300px;
      margin-bottom: 10px;
    }

    .size-th {
      font-size: 14px;
      color: #055160;
    }

    .text-green {
      color: #055160 !important;
    }

    .bag-info {
      background-color: #cff4fc !important;
    }

    .size-td {
      font-size: 13px;
    }

    .size-td-2 {
      font-size: 11px;
    }

    #ui-id-1,
    #ui-id-2 {
      font-size: 13px;
    }

    .vertical {
      vertical-align: middle;
    }

    .separador {
      margin: 0;
      padding: 0 0 0 7px;
      color: #055160;
    }

    .size-a {
      font-size: 14.5px;
    }

    #select2-txtZonas-container,
    #select2-FiltroOficinaVentas-container,
    #select2-txtClasePedido-container,
    #select2-FiltroOficinaVentas-results,
    #select2-txtClasePedido-results,
    #select2-txtZonas-results {
      font-size: 14px !important;
    }
  </style>
</head>

<body>
  <div class="alert alert-info" style="font-weight: 500;"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0101 - PEDIDOS WEB-SAP</div>

  <input type="hidden" id="Dpto" value="<?php echo (!empty($_SESSION["ses_DepId"])) ? $_SESSION["ses_DepId"] : ""; ?>">
  <input type="hidden" id="Organizacion" value="<?php echo (!empty($_SESSION["ses_NumOrg"])) ? $_SESSION["ses_NumOrg"] : ""; ?>">
  <input type="hidden" id="CodigoSAP" value="<?php echo (!empty($_SESSION["ses_CodSap"])) ? $_SESSION["ses_CodSap"] : ""; ?>">
  <input type="hidden" id="UsrLogin" value="<?php echo (!empty($_SESSION["ses_Login"])) ? $_SESSION["ses_Login"] : ""; ?>">
  <input type="hidden" id="Ofi" value="<?php echo (!empty($_SESSION["ses_OfcVentas"])) ? $_SESSION["ses_OfcVentas"] : ""; ?>">
  <input type="hidden" id="Rol" value="<?php echo (!empty($_SESSION["ses_RolesId"])) ? $_SESSION["ses_RolesId"] : ""; ?>">
  <input type="hidden" id="Nit" value="<?php echo (!empty($_SESSION["ses_Nit"])) ? $_SESSION["ses_Nit"] : ""; ?>">
  <input type="hidden" id="UsrId" value="<?php echo (!empty($_SESSION["ses_Id"])) ? $_SESSION["ses_Id"] : ""; ?>">
  <input type="hidden" id="AbrirVentas" value="<?php echo (!empty($_GET["grupo"])) ? $_GET["grupo"] : "0"; ?>">
  <input type="hidden" id="link_pro" value="<?php echo (!empty($_GET["link_prog"])) ? $_GET["link_prog"] : "0"; ?>">
  <input type="hidden" id="tipo_documento" value="<?php echo (!empty($_GET["tipo_documento"])) ? $_GET["tipo_documento"] : ""; ?>">
  <input type="hidden" id="emailCliente" value="<?php echo (!empty($_GET["emailCliente"])) ? $_GET["emailCliente"] : ""; ?>">
  <input type="hidden" id="pedido_integracion" value="<?php echo (!empty($_GET["pedido_integracion"])) ? $_GET["pedido_integracion"] : ""; ?>">

  <div id="data"></div>

  <div>
    <!-- MENÚ DE OPCIONES EN TABS -->
    <div class="container-fluid">
      <ul class="nav nav-tabs" id="nav-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="btnClientes" data-bs-toggle="tab" data-bs-target="#dvClientes" type="button" role="tab" aria-controls="dvClientes" aria-selected="true">
            <i class="fa-solid fa-user-tie"></i>&nbsp;Cliente
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="btnProductos" data-bs-toggle="tab" data-bs-target="#dvProductos" type="button" role="tab" aria-controls="dvProductos" aria-selected="false">
            <i class="fa-solid fa-pills"></i>&nbsp;Productos
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="btnPedidos" data-bs-toggle="tab" data-bs-target="#dvPedidos" type="button" role="tab" aria-controls="dvPedidos" aria-selected="false">
            <i class="fa-solid fa-file-invoice"></i>&nbsp;Pedido
          </button>
        </li>
        <li class="nav-item dropdown" role="presentation">
          <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">
            <i class="fa-solid fa-list-check"></i>&nbsp;Gestión</a>
          <ul class="dropdown-menu">
            <li>
              <p class="separador"><strong>Pedidos</strong></p>
            </li>
            <li>
              <a class="dropdown-item size-a" id="btnTemporales" data-bs-toggle="tab" href="#dvRecuperar" role="tab" aria-controls="dvRecuperar" aria-selected="false">
                <i class="fa-solid fa-chevron-right"></i>&nbsp;Propios</a>
            </li>
            <li>
              <a class="dropdown-item size-a" id="btnTempTerceros" data-bs-toggle="tab" href="#dvRecuperarTerceros" role="tab" aria-controls="dvRecuperarTerceros" aria-selected="false">
                <i class="fa-solid fa-chevron-right"></i>&nbsp;Terceros</a>
            </li>
            <li>
              <p class="separador"><strong>Entregas</strong></p>
            </li>
            <li>
              <a class="dropdown-item size-a" data-bs-toggle="tab" href="#dvExtra3" role="tab" aria-controls="dvExtra1" aria-selected="false">
                <i class="fa-solid fa-chevron-right"></i>&nbsp;Unificar</a>
            </li>
            <li>
              <a class="dropdown-item size-a" data-bs-toggle="tab" href="#dvExtra4" role="tab" aria-controls="dvExtra2" aria-selected="false">
                <i class="fa-solid fa-chevron-right"></i>&nbsp;Faltantes</a>
            </li>
            <li>
              <p class="separador"><strong>Facturas</strong></p>
            </li>
            <li>
              <a class="dropdown-item size-a" data-bs-toggle="tab" href="#dvExtra5" role="tab" aria-controls="dvExtra1" aria-selected="false">
                <i class="fa-solid fa-chevron-right"></i>&nbsp;Facturas</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- CONTENIDO DE CADA TAB -->
    <div class="tab-content" id="nav-tabContent">
      <!-- TAB CLIENTE -->
      <div class="tab-pane fade show active p-2" id="dvClientes" role="tabpanel" aria-labelledby="nav-home-tab">
        <div class="div-container">
          <div id="dvCentros"></div>
          <table style="width: 100%;">
            <thead>
              <tr class="custom-tr">
                <th class="custom-thead" colspan="4" align="center">SELECCION DE CLIENTES</th>
              </tr>
            </thead>
            <tbody>
              <tr class="custom-tr">
                <td class="size-text">Cliente</td>
                <td id="colCliente"></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Oficina Ventas (Bodega)</td>
                <td>
                  <select id="txt_oficina" class="form-select size-text shadow-sm">
                  </select>
                </td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Destinatario</td>
                <td>
                  <select id="txt_destinatario" class="form-select size-text shadow-sm">
                  </select>
                </td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Teléfono</td>
                <td>
                  <input type="text" id="txt_tel" class="form-control size-text" disabled>
                </td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Email</td>
                <td>
                  <input type="text" id="txt_mail" class="form-control size-text" disabled>
                </td>
              </tr>
              <tr class="custom-tr" id="trCupo" style="display: none">
                <td class="size-text">Cupo Crédito</td>
                <td>
                  <input type="text" id="txt_cupo" class="form-control size-text" disabled>
                </td>
              </tr>
              <tr class="custom-tr" id="trCondicion" style="display: none">
                <td class="size-text">Plazo</td>
                <td>
                  <input type="text" id="txt_plazo" class="form-control size-text" disabled />
                </td>
              </tr>
              <tr class="custom-tr" id="trTipoPed" style="display: none">
                <td class="size-text">Pedido de Integración</td>
                <td>
                  <select id="TxtIntegracion" class="form-select size-text shadow-sm  .select-pedido-integracion">
                    <option value="N" selected>NO</option>
                    <option value="S">SI</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="container-btn">
            <button type="button" class="btn btn-outline-secondary w-btn btn-sm" id="btnLimpiar" onClick="Limpiar();">
              <i class="fa-solid fa-file"></i>
              Nuevo
            </button>
            <button type="button" class="btn btn-outline-primary w-btn btn-sm" id="btnMas">
              <i class="fa-solid fa-list"></i>
              Mas
            </button>
            <button type="button" class="btn btn-outline-success w-btn btn-sm" id="btnPuntos">
              <i class="fa-solid fa-heart"></i>
              Puntos
            </button>
            <button type="button" class="btn btn-outline-danger w-btn btn-sm" id="btnDescuentos" style="display: none">
              <i class="fa-solid fa-bullhorn"></i>
              Descuentos para ti!
            </button>
            <button type="button" class="btn btn-outline-warning w-btn btn-sm" id="btnEstadisticas" style="display: none">
              <i class="fa-solid fa-chart-pie"></i>
              Estadisticas
            </button>
          </div>
          <hr>
          <div id="Presupuesto_datos"></div>
          <div id="cartera_edades"></div>
        </div>
      </div>
      <!-- TAB PRODUCTOS -->
      <div class="tab-pane fade p-2" id="dvProductos" role="tabpanel" aria-labelledby="nav-profile-tab">
        <div class="custom-total">
          <P class="p-total">VALOR TOTAL PEDIDO:</P>
          <input type="text" id="txt_total" class="sin_borde input-total" readonly disabled>
        </div>
        <div class="container-fluid">
          <div class="row mt-2 mb-2">
            <div class="col-md-3">
              <button class="btn btn-sm btn-light btn-micro w-100" type="button" onclick="BotonBonificado(this)">
                <img src="../resources/icons/regalo.png" width="24" heigth="24" alt="PRODUCTO BONIFICADO" align="absmiddle">
                &nbsp;Bonificado
              </button>
            </div>
            <div class="col-md-3">
              <button class="btn btn-sm btn-light btn-micro w-100" type="button" onclick="BotonOfertas(this)">
                <img src="../resources/icons/pw/tag_marcado.png" width="24" alt="PRODUCTO OFERTADO" heigth="24" align="absmiddle">
                &nbsp;Ofertas
              </button>
            </div>
            <div class="col-md-3">
              <button class="btn btn-sm btn-light btn-micro w-100" type="button" onclick="BotonDescuentos(this)">
                <img src="../resources/icons/pw/tag_discount.png" width="24" heigth="24" alt="SOLO DESCUENTOS" align="absmiddle">
                &nbsp;Descuentos
              </button>
            </div>
            <div class="col-md-3">
              <button class="btn btn-sm btn-light btn-micro w-100" type="button" onclick="Top_20_mas_vendidos_con_copi(this)">
                <img src="../resources/icons/pw/top-10.png" width="24" heigth="24" alt="TOP 20" align="absmiddle">
                &nbsp;TOP 20
              </button>
            </div>
          </div>
          <div class="input-group mb-2 shadow-sm">
            <input type="text" id="txt_bproductos" class="form-control" tabindex="1" placeholder="F2 - Descripción de producto: Nombre - Codigo - Grupo">
            <div class="input-group-btn">
              <button class="btn btn-light btn-micro" type="button" title="Búsqueda de productos por voz" onclick="iniciarVozATexto('txt_bproductos',this)">
                <i class="fa-solid fa-microphone"></i>&nbsp;
              </button>
              <button type="button" class="btn btn-light btn-micro" id="btnMas2">
                <i class="fa-solid fa-gear"></i>&nbsp;
              </button>
            </div>
          </div>
          <p id="n_resultados" class="n_resultados lead p-total"></p>
          <div id="dvResultProductos"></div>
        </div>
      </div>
      <!-- TAB PEDIDO -->
      <div class="tab-pane fade p-2" id="dvPedidos" role="tabpanel" aria-labelledby="nav-profile-tab">
        <div class="container-fluid">
          <div id="listInfoPedido"></div>
          <div id="dvResultPedidos"></div>
        </div>
      </div>
      <!-- TAB GESTIÓN -->
      <!-- RECUPERAR PEDIDDOS PROPIOS -->
      <div class="tab-pane fade" id="dvRecuperar" role="tabpanel">
        <div class="container-fluid">
          <div id="contenedorLeyendas"></div>
          <div id="DvRecuperables"></div>
        </div>
      </div>
      <!-- RECUPERAR PEDIDOS TERCEROS -->
      <div class="tab-pane fade p-2" id="dvRecuperarTerceros" role="tabpanel">
        <input type="hidden" id="txtCodigoSAP" readonly disabled>
        <div class="div-container">
          <table style="width: 100%;">
            <thead>
              <tr class="custom-tr">
                <th class="custom-thead" colspan="3">PEDIDOS DE TERCEROS</th>
              </tr>
            </thead>
            <tbody>
              <tr class="custom-tr">
                <td class="size-text">Cliente</td>
                <td><input type="text" id="txtCliente" placeholder="Cliente" class="form-control size-text shadow-sm"></td>
              </tr>
              <tr>
                <td class="size-text">Zona de ventas</td>
                <td><select id="txtZonas" class="form-control size-text shadow-sm" style="width:100%">
                  </select></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Clase de Pedido</td>
                <td><select id="txtClasePedido" class="form-control size-text shadow-sm" style="width:100%">
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
              <tr class="custom-tr">
                <td class="size-text">Oficina de ventas</td>
                <td colspan="2"><select id="FiltroOficinaVentas" class="form-control size-text shadow-sm" style="width:100%">
                  </select></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Fecha Inicial</td>
                <td colspan="2"><input type="text" id="txtFecha1" placeholder="Fecha Inicial" class="form-control size-text shadow-sm"></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Fecha Final</td>
                <td colspan="2"><input type="text" id="txtFecha2" placeholder="Fecha Final" class="form-control size-text shadow-sm"></td>
              </tr>
              <tr class="custom-tr">
                <td class="size-text">Temporales Historia</td>
                <td colspan="2"><select id="txtTemporalesHistoria" class="form-control size-text shadow-sm" style="width:100%">
                    <option value="N" selected>NO</option>
                    <option value="S">SI</option>
                  </select></td>
              </tr>
            </tbody>
          </table>
          <div class="">
            <button class="btn btn-info btn-sm w-btn" onClick="GestionPedidos();">Buscar</button>
            <button class="btn btn-success btn-sm w-btn" id="exportar_gestion">Exportar</button>
            <button class="btn btn-light btn-sm w-btn btn-micro" onClick="LimpiarGestionPedido();">Limpiar</button>
          </div>
          <hr>
        </div>        
        <div id="VtotalTerceros"></div>
        <div id="DvRecuperablesTerceros"></div>
      </div>
      <div class="tab-pane fade" id="dvExtra3" role="tabpanel">
        Contenido Extra 3
      </div>
      <div class="tab-pane fade" id="dvExtra4" role="tabpanel">
        Contenido Extra 4
      </div>
      <div class="tab-pane fade" id="dvExtra5" role="tabpanel">
        Contenido Extra 5
      </div>
    </div>
  </div>
  <!-- DIV'S PARA RENDERIZAR LOS LOADING -->
  <div id="Bloquear" style="display: none;"></div>
  <div id="loaderOverlay" class="centrado-porcentual" style="display: none;"></div>

  <!-- MODAL MENU DE OPCIONES PARA PEDIDOS -->
  <div class="modal fade" id="ModalOpciones" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 60%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Menú de opciones</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body" id="ContenidoModalOpciones">
          <input type="hidden" id="ped_valor_total" disabled readonly>
          <input type="hidden" id="ped_destinatario" disabled readonly>
          <input type="hidden" id="ped_bodega" disabled readonly>
          <input type="hidden" id="ped_codigo_sap" disabled readonly>
          <input type="hidden" id="ped_transferido" disabled readonly>
          <input type="hidden" id="ped_gestion" disabled readonly>
          <div class="container-liquid">
            <div class="row">
              <div class="col-md-4">
                <div class="panel panel-info">
                  <div class="panel-heading bag-info text-green p-2">Opciones</div>
                  <ul class="list-group">
                    <button type="button" class="list-group-item text-start size-a" onClick="SolDesbloqueo()" id="btn-sol-desbloqueo" title="Solicitar desbloqueo de pedido" style="display: none;">
                      <i class="fa-solid fa-unlock text-danger"></i> Sol. Desbloqueo
                    </button>
                    <button type="button" id="btnMenu1" class="list-group-item text-start size-a" onClick="GuardarDirecto()" title="Guardar Directo">
                      <i class="fa-solid fa-floppy-disk"></i> Guardar
                    </button>
                    <button type="button" id="btnMenu2" class="list-group-item text-start size-a" title="Recuperar pedido" onClick="RecuperarPedido()">
                      <i class="fa-solid fa-rotate-right"></i> Recuperar
                    </button>
                    <button type="button" id="btnMenu3" class="list-group-item text-start size-a" onClick="VisualizarPedido()" title="Visualizar PDF">
                      <i class="fa-solid fa-file"></i> Visualizar
                    </button>
                    <button type="button" id="btnMenu4" class="list-group-item text-start size-a" onClick="Rastreo()" title="Rastreo de pedido">
                      <i class="fa-solid fa-arrows-up-down-left-right"></i> Rastreo
                    </button>
                    <button type="button" id="btnMenu5" class="list-group-item text-start size-a" onClick="EliminarPedido()" title="Eliminar">
                      <i class="fa-solid fa-trash-can"></i> Eliminar
                    </button>
                    <button type="button" id="btnMenu6" class="list-group-item text-start size-a" onClick="Entregas()" title="Generar entregas">
                      <i class="fa-solid fa-check-double"></i> Entregas
                    </button>
                    <button type="button" id="btnMenu7" class="list-group-item text-start size-a" onClick="Ordenes()" title="Generar OT">
                      <i class="fa-solid fa-cart-shopping"></i> OT - Logistica
                    </button>
                    <button type="button" id="btnMenu8" class="list-group-item text-start size-a" title="Generar Factura">
                      <i class="fa-solid fa-file-invoice"></i> Factura
                    </button>
                    <button type="button" id="btnMenu9" class="list-group-item text-start size-a" title="Refrescar">
                      <i class="fa-solid fa-arrows-rotate"></i> Refrescar
                    </button>
                    <button type="button" id="btnMenu10" class="list-group-item text-start size-a" title="Log de modificaciones">
                      <i class="fa-solid fa-magnifying-glass-plus"></i> Historial
                    </button>
                  </ul>
                </div>
              </div>
              <div class="col-md-8" id="Result">
                <div class="panel panel-info">
                  <div class="panel-heading bag-info text-green p-2">Flujo de documentos</div>
                  <table class="form" width="100%">
                    <tr>
                      <td>Usuario ADG</td>
                      <td><input type="text" id="ped_usuario" class="form-control size-th" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Pedido ADG</td>
                      <td><input type="text" id="ped_numero" class="form-control size-th" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Dirección pedido</td>
                      <td><input type="text" id="direccion_pedido" class="form-control size-th" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Pedido SAP</td>
                      <td><input type="text" id="ped_numero_sap" class="form-control size-th" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Entrega</td>
                      <td><input type="text" id="ped_entrega" class="form-control size-th" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Orden</td>
                      <td><input type="text" id="ped_ot" class="form-control size-th" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Factura</td>
                      <td><input type="text" id="ped_factura" class="form-control size-th" disabled readonly></td>
                    </tr>
                    <tr>
                      <td>Notas</td>
                      <td><textarea id="NotasRapidas" placeholder="Notas de pedidos" class="form-control" style="background-color: #FFC;"></textarea></td>
                    </tr>
                  </table>
                  <div>
                    <button type="button" class="btn btn-light btn-sm btn-micro w-100" onClick="NotaRapida();" id="btnNotaRapida">
                      <i class="fa-solid fa-check-double"></i> Salvar Nota
                    </button>
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
  <!-- MODAL VISUALIZAR PDF PEDIDO -->
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
  <!-- MODAL VISUALIZAR PDF FACTURA -->
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
  <!-- MODAL INFORMACION DE MATERIALES -->
  <div class="modal fade" id="ModalInfoMaterial" tabindex="-1" aria-labelledby="ModalInfoMaterialLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalInfoMaterialLabel">Datos adicionales de productos</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <ul class="nav nav-tabs" id="materialTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="info-tab" data-bs-toggle="tab" data-bs-target="#ContenidoInfoMateriales"
                type="button" role="tab" aria-controls="ContenidoInfoMateriales" aria-selected="true">
                <i class="bi bi-info-circle"></i> Información
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="shop-tab" data-bs-toggle="tab" data-bs-target="#ContenidoShoppingMateriales"
                type="button" role="tab" aria-controls="ContenidoShoppingMateriales" aria-selected="false">
                <i class="bi bi-star"></i> Shopping
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="huella-tab" data-bs-toggle="tab" data-bs-target="#ContenidoHuellaMateriales"
                type="button" role="tab" aria-controls="ContenidoHuellaMateriales" aria-selected="false">
                <i class="bi bi-bell"></i> Huella
              </button>
            </li>
          </ul>
          <div class="tab-content pt-3">
            <div class="tab-pane fade show active" id="ContenidoInfoMateriales" role="tabpanel" aria-labelledby="info-tab">
              <!-- Contenido dinámico -->
            </div>
            <div class="tab-pane fade" id="ContenidoShoppingMateriales" role="tabpanel" aria-labelledby="shop-tab">
              <table class="table">
                <tbody>
                  <tr>
                    <td class="vertical">CODIGO</td>
                    <td><input type="text" class="form-control size-th" id="shoping_codmaterial" readonly></td>
                  </tr>
                  <tr>
                    <td class="vertical">DESCRIPCIÓN</td>
                    <td><input type="text" class="form-control size-td text-green" id="shoping_descripcion" readonly></td>
                  </tr>
                  <tr>
                    <td class="vertical">VALOR ACTUAL</td>
                    <td><input type="text" class="form-control size-th" id="shoping_preciomaterial" readonly></td>
                  </tr>
                  <tr>
                    <td class="vertical">COMPETENCIA</td>
                    <td><select id="shoping_competencia" class="form-control size-th"></select></td>
                  </tr>
                  <tr>
                    <td class="vertical">VALOR COMPETENCIA</td>
                    <td><input type="number" class="form-control size-th" id="shoping_valor"></td>
                  </tr>
                  <tr>
                    <td class="vertical">OBSERVACIÓN</td>
                    <td><input type="text" class="form-control size-td" id="shoping_observacion"></td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <button type="button" class="btn btn-success btn-sm" onClick="GuardarShoping();">
                        Guardar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="tab-pane fade" id="ContenidoHuellaMateriales" role="tabpanel" aria-labelledby="huella-tab">
              <div class="alert alert-warning" role="alert"><strong>NOTA!</strong> Ingreso de huella de faltantes para
                solicitar compra.
              </div>
              <input type="hidden" class="form-control" id="huella_stock" readonly>
              <input type="hidden" class="form-control" id="huella_dcto" readonly>
              <table class="table">
                <tbody>
                  <tr>
                    <td class="vertical">CODIGO</td>
                    <td><input type="text" class="form-control size-th" id="huella_codmaterial" readonly></td>
                  </tr>
                  <tr>
                    <td class="vertical">DESCRIPCIÓN</td>
                    <td><input type="text" class="form-control size-td text-green" id="huella_descripcion" readonly></td>
                  </tr>
                  <tr>
                    <td class="vertical">CANTIDAD</td>
                    <td><input type="number" class="form-control size-th" id="huella_cantidad"></td>
                  </tr>
                  <tr>
                    <td class="vertical">OBSERVACIÓN</td>
                    <td><input type="text" class="form-control size-td text-green" id="huella_notas"></td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <button type="button" class="btn btn-success btn-sm" onClick="GuardarHuella();">
                        Guardar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL RASTREO DE PEDIDOS - TRAZABILIDAD -->
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
  <!-- MODAL MENU DE ENTREGAS -->
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
  <!-- MODAL ORDENES DE TRANSPORTE -->
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
  <!-- MODAL LOG -->
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
  <!-- MODAL FERIA VIRTUAL -->
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
  <!-- MODAL IMAGEN ANIVERSARIO -->
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
  <!-- MODAL PLAN DE PUNTOS -->
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
  <!-- MODAL TOP 20 MAS VENDIDOS 100 Y 130 -->
  <div id="ModalTop20_100_130" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Top 20 Productos destacados</h4>
        </div>
        <div class="modal-body" id="TablaTop20_100_130"> </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL PP DETALLE -->
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
                  <button id="buy-now" class="btn btn-lg  btn-success"> <i class="fa-solid fa-arrow-up-right-from-square"></i> Redimir </button>
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
  <!-- MODAL EDITAR PEDIDOS -->
  <div id="ModalEditarPedidos" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
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
  <!-- MODAL ESTADISTICAS -->
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
  <!-- MODAL MAS CLIENTE -->
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
  <!-- MODAL AJUSTE BÚSQUEDA -->
  <div class="modal fade" id="ModalAjustesBusqueda" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="min-width: 50%;">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Configuración de búsqueda</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <table class="form" width="100%">
            <tr>
              <td>
                <img src="../resources/icons/pw/tag_stock.png" width="24" title="SOLO CON STOCK" heigth="24" align="absmiddle">
                &nbsp;Stock
              </td>
              <td>
                <div id="DvChkStock" class="DivCheckBox DivCheckBoxTrue"></div>
              </td>
            </tr>
            <tr>
              <td>
                <img src="../resources/icons/pw/tag_discount.png" width="24" heigth="24" title="SOLO DESCUENTOS" align="absmiddle">
                &nbsp;Descuentos
              </td>
              <td>
                <div id="DvChkDctos" class="DivCheckBox"></div>
              </td>
            </tr>
            <tr>
              <td>
                <img src="../resources/icons/pw/tag_marcado.png" width="24" title="PRODUCTO OFERTADO" heigth="24" align="absmiddle">
                &nbsp;Productos Ofertados
              </td>
              <td>
                <div id="DvChkOfertado" class="DivCheckBox"></div>
              </td>
            </tr>
            <tr>
              <td>
                <img src="../resources/icons/regalo.png" width="24" heigth="24" title="PRODUCTO BONIFICADO" align="absmiddle">
                &nbsp;Bonificados
              </td>
              <td>
                <div id="DvChkBonif" class="DivCheckBox"></div>
              </td>
            </tr>
            <tr>
              <td width="400">
                <img src="../resources/icons/nuevo.png" width="24" title="PRODUCTOS NUEVO" heigth="24" align="absmiddle">
                &nbsp;Productos Nuevos (90 Dias)
              </td>
              <td>
                <div id="DvChkNuevos" class="DivCheckBox"></div>
              </td>
            </tr>
            <tr>
              <td>
                <img src="../resources/icons/pw/tag_kit.png" width="24" title="PRODUCTOS KITS" heigth="24" align="absmiddle">
                &nbsp;KIT'S
              </td>
              <td>
                <div id="DvChkKits" class="DivCheckBox"></div>
              </td>
            </tr>
          </table>
          <table class="form mt-2" width="100%">
            <tr>
              <td>Proveedores</td>
              <td>
                <select id="txtGrupoArticulo" class="form-select size-td" style="width:100%">
                </select>
              </td>
            </tr>
            <tr>
              <td>Numero Temporal</td>
              <td align="center">
                <input type="text" id="txt_numero" class="form-control size-td" readonly>
              </td>
            </tr>
            <tr>
              <td>Numero SAP</td>
              <td align="center">
                <input type="text" id="txt_numero_sap" class="form-control size-td" readonly>
              </td>
            </tr>
            <tr>
              <td>Importar Plano [codigo,cantidad]</td>
              <td align="center">
                <input type="file" id="filename" name="filename" class="form-control size-td" readonly>
              </td>
            </tr>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- MODAL INFORMACIÓN DE BONIFICADOS -->
  <div id="ModalInfoBonificados" class="modal fade bd-example-modal-lg" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">INFORMACIÓN DE BONIFICADOS</h4>
        </div>
        <div class="modal-body" id="ContenidoInfoBonificados"></div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- SCRIPT'S PARA EL DINAMISMO DE LA PÁGINA -->
  <script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php echo (rand()); ?>"></script>
  <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.min.js"
    integrity="sha384-RuyvpeZCxMJCqVUGFI0Do1mQrods/hhxYlcVfGPOfQtPJh0JCw12tUAZ/Mv10S7D"
    crossorigin="anonymous">
  </script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.13.2/dist/sweetalert2.all.min.js"></script>
  <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../resources/HighCharts/code/highcharts.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/bootstrap-notify/bootstrap-notify.min.js"></script>
  <script type="text/javascript" src="../resources/select2/js/select2.full.min.js"></script>
  <script type="text/javascript" src="../controllers/PW-SAP.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/Isa.js?<?php echo (rand()); ?>"></script>
</body>

</html>