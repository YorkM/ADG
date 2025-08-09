const urlModel = "../models/PW-SAP.php";
let ArrProd = [];
let ArrEan = [];
let ArrCli = [];
let Arr = "";
let OfcN = "";
let OfcS = "";
let Perm_Cambiar_Bodega = '';
// FUNCIÓN PARA REALIZAR CONFIRMACIONES
const confirmAlert = async (title, text) => {
  const result = await Swal.fire({
    title: `${title}`,
    text: `${text}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
  });
  return result;
}
// FUNCIÓN PARA CORTAR TEXTO
function cortarTexto(texto, maxLongitud) {
  return texto.length > maxLongitud ? texto.slice(0, maxLongitud) + '...' : texto;
}
// FUNCIÓN PARA VALIDAR ESTADO DE DESBLOQUEO
const validaEstadoDesbloqueo = async () => {
  try {
    const pedido = $("#ped_numero_sap").val();
    const resp = await enviarPeticion({
      link: urlModel,
      pedido: pedido,
      op: 'status_sol_desbloqueo'
    });

    if (Array.isArray(resp) && resp.length > 0) {
      return resp[0].nsolicitud > 0;
    }

    return false;
  } catch (error) {
    console.error('Error en la validación de estado de desbloqueo:', error);
    return false;
  }
};
// FUNCIÓN PARA GESTIONAR SOLICITUD DE DESBLOQUEO
const SolDesbloqueo = async () => {
  // 2024-10-04 Christian Bula: Se añade control para solo poder volver a montar la solicitud si el estado es (R:Rechazado - A: Aprobado)
  let status = await validaEstadoDesbloqueo();
  if (status) {
    Swal.fire({
      title: '¡Oh no!',
      text: 'Ya se ha realizado una solicitud para este pedido la cual posee un estatus Pendiente o en Verificación, lo que significa que no puedes hacer otra solicitud en este momento.',
      icon: 'warning',
      confirmButtonText: 'Entiendo, seguiré esperando...'
    });
    return;
  }

  const pedido = $("#ped_numero_sap").val();
  
  $('#ModalOpciones').modal("hide");
  $('#numPedidoDesb').text(pedido);
  $('#modalSolictudDesbloqueo').modal("show");
}
// FUNCIÓN EJECUTAR SOLICITUD DE DESBLOQUEO
const ejecutarSolDesbloqueo = async () => {
  const nota = document.querySelector('#nota').value.trim();
  if (!nota) {
    showToastr("error", "Por favor escribe una observación antes de enviar");
    return false;
  }

  try {
    const pedido = $("#ped_numero_sap").val();
    const resp = await enviarPeticion({ op: 'enviar_sol_desbloqueo', link: urlModel, pedido, nota });

    if (!resp.ok) {
      Swal.fire("Error", "No se pudo enviar la solicitud, por favor validar", "error");
      return false;
    }

    if (resp.solicitada) {
      Swal.fire("Error", resp.mensaje, "error");
      return false;
    }

    Swal.fire("Ok", "Se envió la solicitud correctamente!", "success");
    Temporales();
  } catch (error) {
    console.log(`Error al enviar la solicitud: ${error}`);
  }
}
// FUNCIÓN PARA MOSTRAR ESTADO DE SOLICITUD DE DESBLOQUEO
const MostrarEstadoSolDesbloqueo = async (pedido) => {
  const resp = await enviarPeticion({ link: urlModel, op: 'datos_sol', pedido });

  let estado = '';
  switch (resp[0].ESTADO) {
    case "0":
      estado = 'Pendiente';
      break;
    case "1":
      estado = 'En validación';
      break;
    case "2":
      estado = 'Rechazada';
      break;
  }

  Swal.fire("Estado de la solicitud", `Tu solicitud se encuentra ${estado}<br> Nota: ${resp[0].RESPUESTA}`, "info");
}
// FUNCIÓN GUARDAR SOLICITUDES DE DESBLOQUEO
const guardSolicitudesDesbloqueoPedidos = async () => {
  try {
    const resp = await enviarPeticion({ link: urlModel, op: 'SOL_PENDIENTE' });
  } catch (e) {
    console.error(e)
  }
}
// FUNCIÓN CERRAR ALERTAS DE DESBLOQUEO
const cerrarAlertaDesbloqueoPedidos = () => {
  $("#alarma_sol_desbloqueo").html('').hide()
}
// FUNCIÓN PARA PRECARGAR EL CLIENTE
const preLoadCliente = (codigo_sap) => {
  // valido si se abrio el modulo desde el 0102 
  if (codigo_sap != '0') {
    $("#txt_numero").val('0');
    $("#btnLimpiar").attr("disabled", true);
    $("#txt_cliente").attr("disabled", true);
    $(".btns-limpiar").attr("disabled", true);

    DataCliente = FiltrarCli(codigo_sap, ArrCli, 1);
    DataCliente = DataCliente[0];

    $("#txt_nit").val(DataCliente.nit);
    $("#txt_dir").val(DataCliente.direccion);
    $("#txt_tel").val(DataCliente.telefonos);
    $("#txt_mail").val(DataCliente.email);
    $("#txt_ciudad").val(DataCliente.ciudad);

    $("#txt_cupo").val(formatNum(DataCliente.cupo_credito, '$'));

    $("#txt_oficina").html(OfcN);
    $("#txt_oficina option[value='" + DataCliente.bodega + "']").attr("selected", true);

    $("#txt_condicion").val(DataCliente.condicion_pago);
    $("#txt_lista").val(DataCliente.lista);
    $("#txt_vendedor").val(DataCliente.vendedor);
    $("#txt_televendedor").val(DataCliente.televendedor);
    $("#txt_vendedor_tel").val(DataCliente.telefono_vendedor);
    $("#txt_televendedor_tel").val(DataCliente.telefono_televendedor);
    $("#txt_codigoSap").val(DataCliente.codigo_sap);
    $("#txt_descuento").val(DataCliente.descuento_financiero);
    $("#txt_plazo").val(DataCliente.dias_pago + ' dias');

    Destinatarios(DataCliente.codigo_sap, DataCliente.ciudad, DataCliente.direccion);

    if (DataCliente.institucional == 1) $("#txt_institucional").val('SI');
    else $("#txt_institucional").val('NO');

    if (DataCliente.controlados == 1) $("#txt_controlado").val('SI');
    else $("#txt_controlado").val('NO');

    $("#btnProductos").attr("disabled", false);
    // Grupos de clientes
    $("#txtGrp1").val(DataCliente.grupo1);
    $("#txtGrp2").val(DataCliente.grupo2);
    $("#txtGrp1,#txtGrp2").prop('disabled', true)

    $("#txt_cliente").val(DataCliente.value);
    $("#txtFaltanteCodigoCliente").val(DataCliente.codigo_sap);
    $("#txtFaltanteCliente").val(DataCliente.value).attr("disabled", true);
    CargarEvento();
    BuscarProductos();
  }
}
// FUNCIÓN PARA CARGAR GRUPOS DE ARTICULOS
async function GruposArticulos() {
  try {
    const data = await enviarPeticion({ op: "B_GARTICULOS", link: "../models/Eventos.php" });
    if (data.length) {
      let option = `<option value="">TODOS</option>`;
      data.forEach(item => {
        option += `<option value="${item.GRUPO_ARTICULO}">${item.DESCRIPCION1}</option>`;
      });
      $("#txtGrupoArticulo").html(option);
    }
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN CONSULTA DE OPCIONES
async function consultaOpciones(pedido, alm = undefined, rdespacho = undefined, rpuntoventa = undefined) {
  try {
    const data = await enviarPeticion({ op: "S_GESTION_PEDIDOS_UNICO", link: urlModel, pedido });
    if (data.length) {
      let item = data[0];
      $("#ped_gestion").val(item.factura);
      $("#ped_numero").val(item.numero);
      $("#ped_valor_total").val(item.valor_total);
      $("#ped_destinatario").val(item.destinatario);
      $("#ped_bodega").val(item.oficina_ventas);
      $("#ped_codigo_sap").val(item.codigo_sap);
      $("#ped_transferido").val(item.transferido);
      $("#ped_numero_sap").val(item.numero_sap);
      $("#ped_entrega").val(item.entrega);
      $("#ped_ot").val(item.ot);
      $("#ped_factura").val(item.factura);
      $("#NotasRapidas").val(item.notas);

      if (item.ot > 0) Prioridad_ot(item.ot, alm ?? "", rdespacho ?? "", rpuntoventa ?? "");

      if (item.entrega == 0) {
        $("#NotasRapidas").attr('disabled', false);
        $("#btnNotaRapida").attr('disabled', false);
      } else {
        $("#NotasRapidas").attr('disabled', true);
        $("#btnNotaRapida").attr('disabled', true);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN NOTIFICACIONES
function Notificaciones() {
  let rol = $("#Rol").val();
  let ofi = $("#Ofi").val();
  // Descuentos especiales página web
  if (rol == 10) {
    if (ofi == 2100 || ofi == 2200 || ofi == 2300 || ofi == 2400) {
      showToastr("success", "¡Tenemos descuentos exclusivos para clientes WEB compra ya!", `<strong>PROMOCIONES!</strong></br>`);
    }
  }
}
// FUNCIÓN PARA CARGA DE ZONAS DE VENTAS PARA CONSULTA DE PEDIDOS
const PermisosZonas = async () => {
  let sw = 0;
  try {
    let rol = $("#Rol").val();

    const data = await enviarPeticion({ op: "S_PERMISO_ZONA", link: urlModel, rol });
    if (data.length > 0) sw = 1;
  } catch (error) {
    console.error(error);
  }
  return sw;
}
// FUNCIÓN PARA CARGA DE ZONAS DE VENTAS 
const ZonasVentas = async () => {
  try {
    let zonas = "";
    let sw = await PermisosZonas();
    let idUsr = $("#UsrId").val();

    const data = await enviarPeticion({ op: "S_ZONAS_VENTA", link: urlModel, sw, idUsr });
    if (data.length > 0) {
      if (sw == 1) {
        zonas = `<option value="0">000000 - TODAS</option>`;
      }

      data.forEach(item => zonas += `<option value="${item.zona}">${item.zona} - ${item.descripcion}</option>`);

    } else {
      zonas = `<option value="999999">NO TIENE ZONA ASIGNADA SOLICITAR AL ADMINISTRADOR</option>`;
    }
    $("#txtZonas").html(zonas);
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN DE ACTIVACIÓN DE TABS
function activaTab(btnTab) { 
  $(`#${btnTab}`).click(); 
};
// FUNCIÓN LOADING DE LA APP
function LoadImg(texto = "Cargando...") {
  let n = 0;

  const html = `
  <img src="../resources/icons/preloader.gif" alt="Cargando..." />
  <figcaption style="font-size: 23px; margin-bottom: 5px; font-weight: bold; text-align: center;">${texto}</figcaption>
  <figcaption id="txtTimer" style="font-weight: bold;">0</figcaption>`;

  const loader = document.getElementById("loaderOverlay");
  loader.innerHTML = html;
  loader.style.display = "flex";

  window.timerInterval = setInterval(() => {
    if (document.getElementById("txtTimer")) document.getElementById("txtTimer").textContent = ++n;
  }, 1000);
}
// FUNCIÓN PARA DESMONTAR LOADING
function UnloadImg() {
  clearInterval(window.timerInterval);
  const loader = document.getElementById("loaderOverlay");
  loader.style.display = "none";
  loader.innerHTML = "";
}
// FUNCIÓN QUE DESBLOQUEA LA PANTALLA
function UnlockScreen(cadena) {
  let errorHTML = `
  <center>
    <img src="../resources/icons/llorar.png">
  </center><br>
  <center>
    <h3 style="width:90%; padding-left:0; margin-left:0">
      AL PARECER HA OCURRIDO UN ERROR AL CARGAR LOS ${cadena}, POR FAVOR VUELVE A INTENTARLO
    </h3>  
  </center><br>`;
  $(".centrado-porcentual-pw").html(errorHTML);
  $(".form-control").attr("disabled", false);
  setInterval(DesbloquearPantalla, 3000);
}
// FUNCION QUE CARGA EL ARRAY DE LOS TERCEROS DE LA ORGANIZACION X
const LoadArrayCli = async () => {
  try {
    LoadImg('Cargando información... Espere un momento');
    await new Promise(requestAnimationFrame);

    const data = await enviarPeticion({op: "B_CLIENTE", link: urlModel, org: $("#Organizacion").val(), sw: 'a'});

    if (data.length) {
      ArrCli = data.map(item => ({
        value: item.nombres + '|' + item.razon_comercial,
        nombres: item.nombres,
        razon_comercial: item.razon_comercial,
        codigo_sap: $.trim(item.codigo_sap),
        nit: $.trim(item.nit),
        email: item.email,
        telefonos: item.telefonos,
        cupo_credito: item.cupo_credito,
        direccion: item.direccion,
        ciudad: item.ciudad,
        bodega: item.bodega,
        bodega_desc: item.bodega_desc,
        lista: item.lista,
        condicion_pago: item.condicion_pago,
        vendedor: item.vendedor,
        televendedor: item.televendedor,
        telefono_vendedor: item.telefono_vendedor,
        telefono_televendedor: item.telefono_televendedor,
        institucional: item.institucional,
        controlados: item.controlados,
        dias_pago: item.dias_pago,
        descuento_financiero: item.descuento_financiero,
        grupo1: item.grupo1,
        grupo2: item.grupo2,
        grupo3: item.grupo3,
        grupo4: item.grupo4,
        grupo5: item.grupo5
      }));
    }
  } catch (error) {
    console.error(error);
  } finally {
    UnloadImg();
  }
};
// FUNCIÓN PARA VALIDAR SI ES UN NÚMERO
function validarSiNumero(numero) {
  x = 0;
  if (/^([0-9])*$/.test(numero)) x = 1;
  return x;
}
// FUNCIÓN PARA EDITAR UN PEDIDO
const EditarPedido = async (Numero, Tipo) => {
  try {
    const data = await enviarPeticion({ op: "S_EDITAR_PW", link: urlModel, Numero, Tipo });
    if (data.length) {
      const item = data[0];
      $("#ModalEditarPedidos").modal("hide");
      $("#ped_numero").val(item.NUMERO);
      $("#ped_valor_total").val(item.VALOR_TOTAL);
      $("#ped_destinatario").val(item.DESTINATARIO);
      $("#ped_bodega").val(item.OFICINA_VENTAS);
      $("#ped_codigo_sap").val(item.CODIGO_SAP);
      $("#ped_transferido").val(item.TRANSFERIDO);
      $("#ped_numero_sap").val(item.NUMERO_SAP);

      CargarCliente(item.CODIGO_SAP, 'c');
      BuscarProductos();
      $("#txt_numero").val(item.NUMERO);
      $("#txt_numero_sap").val(item.NUMERO_SAP);
      $("#txt_total").val(formatNum(item.VALOR_TOTAL, '$'));

      $("#btnPedidos").attr("disabled", false);
      $("#txt_destinatario").attr('disabled', true);
    } else {
      Swal.fire("Oops!!!", "Pedido no encontrado", "error");
    }
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN PARA CARGA DE EVENTO AUTOMATICO
function CargarEvento() {
  let DepId = $("#Dpto").val();
  if (parent.parent.$("#AbrirVentas").val() != 0) {
    if (DepId == 10 || $("#txt_codigoSap").val() != '') {
      activaTab("btnProductos");

      let grupo = parent.parent.$("#AbrirVentas").val();
      let tipo = parent.parent.$("#AbrirVentasTipo").val();

      switch (tipo) {
        case 'DES':
          // $("#DvChkDctos").addClass('DivCheckBoxTrue');
          document.querySelector('#DvChkDctos').checked = true;
          break;
          case 'BON':
          // $("#DvChkBonif").addClass('DivCheckBoxTrue');
          document.querySelector('#DvChkBonif').checked = true;
          break;
      }
      $("#txt_bproductos").val($.trim(grupo));

      BuscarProductos();

      setTimeout(function () {
        BuscarProductoArr(0);
      }, 2000);

      parent.parent.$("#AbrirVentas").val(0);
    } else {
      Swal.fire("Oops!!!", "Para visualizar el evento primero debe seleccionar un cliente", "warning");
    }
  }
}
// FUNCIÓN PARA DE MULTIPLES CÓDIGOS DE CLIENTES
function CargarClienteNit(codSAP, sw) {
  let expresion = new RegExp(codSAP, "i");
  let bodega = new RegExp($.trim($("#Ofi").val()));

  let filtro = ArrCli.filter(nuevo => expresion.test(nuevo.nit));
  filtro = filtro.filter(filtro => bodega.test(filtro.bodega));

  let dataCliente = '';
  for (let i = 0; i < filtro.length; i++) {
    let d = filtro[i];
    dataCliente += `<option value="${d.codigo_sap}">${d.codigo_sap} | ${d.nombres}</option>`;
  }
  $("#txt_cliente").html(dataCliente);
  CargarClienteSeleccionado();
}
// FUNCIÓN PARA CARGAR EL CLIENTE SELECCIONADO
function CargarClienteSeleccionado() {
  let codSAP = $("#txt_cliente").val();
  let expresion = new RegExp(codSAP, "i");

  let filtro = ArrCli.filter(ArrCli => expresion.test(ArrCli.codigo_sap));
  for (let i = 0; i < filtro.length; i++) {
    const d = filtro[0];
    $("#txt_nit").val(d.nit);
    $("#txt_dir").val(d.direccion);
    $("#txt_tel").val(d.telefonos);
    $("#txt_mail").val(d.email);
    $("#txt_ciudad").val(d.ciudad);
    $("#txt_cupo").val(formatNum(d.cupo_credito, '$'));
    $("#txt_oficina").html(`<option value="${d.bodega}">${d.bodega_desc}</option>`);

    $(`#txt_oficina option[value="${d.bodega}"]`).attr("selected", true);
    $("#txt_condicion").val(d.condicion_pago);
    $("#txt_lista").val(d.lista);
    $("#txt_vendedor").val(d.vendedor);
    $("#txt_televendedor").val(d.televendedor);
    $("#txt_vendedor_tel").val(d.telefono_vendedor);
    $("#txt_televendedor_tel").val(d.telefono_televendedor);
    $("#txt_codigoSap").val(d.codigo_sap);
    $("#txt_descuento").val(d.descuento_financiero);
    $("#txt_plazo").val(d.dias_pago + ' dias');
    $("#txt_destinatario").attr('enable', true);
    $('#txt_cliente').prop('readonly', true);

    $("#txtGrp1").val(d.grupo1);
    $("#txtGrp2").val(d.grupo2);
    // Grupo cliente
    $("#txtGrp1,#txtGrp2").prop('disabled', true);
    Destinatarios(d.codigo_sap, d.ciudad, d.direccion);
    if (d.institucional == 1) $("#txt_institucional").val('SI');
    else $("#txt_institucional").val('NO');

    if (d.controlados == 1) $("#txt_controlado").val('SI');
    else $("#txt_controlado").val('NO');
  }
  BuscarProductos();
}
// FUNCIÓN PARA CARGAR CLIENTE
function CargarCliente(codSAP, sw) {
  let expresion = new RegExp(codSAP, "i");
  let filtro = ArrCli.filter(ArrCli => expresion.test(ArrCli.codigo_sap));
  for (let i = 0; i < filtro.length; i++) {
    const d = filtro[0];
    $('#txt_cliente').val(d.value);
    $("#txt_nit").val(d.nit);
    $("#txt_dir").val(d.direccion);
    $("#txt_tel").val(d.telefonos);
    $("#txt_mail").val(d.email);
    $("#txt_ciudad").val(d.ciudad);
    $("#txt_cupo").val(formatNum(d.cupo_credito, '$'));
    $("#txt_oficina").html(`<option value="${d.bodega}">${d.bodega_desc}</option>`);
    $("#txt_condicion").val(d.condicion_pago);
    $("#txt_lista").val(d.lista);
    $("#txt_vendedor").val(d.vendedor);
    $("#txt_televendedor").val(d.televendedor);
    $("#txt_codigoSap").val(d.codigo_sap);
    $("#txt_descuento").val(d.descuento_financiero);
    $("#txt_plazo").val(d.dias_pago + ' dias');
    $("#txt_destinatario").attr('enable', true);
    $('#txt_cliente').prop('readonly', true);
    Destinatarios(d.codigo_sap, d.ciudad, d.direccion);

    if (d.institucional == 1) $("#txt_institucional").val('SI');
    else $("#txt_institucional").val('NO');

    if (d.controlados == 1) $("#txt_controlado").val('SI');
    else $("#txt_controlado").val('NO');
  }
}
// LIMPIEZA Y ACTUALIZACIÓN DE CAMPOS
function Limpiar() {
  $("#txt_cliente").focus();
  // Organización de ventas traída desde el menú
  $("#Organizacion").val(parent.parent.$("#org").val());

  const camposVal = [
    '#txt_bproductos', '#txt_descuento', '#txt_plazo', '#txt_nit', '#txt_dir',
    '#txt_tel', '#txt_mail', '#txt_ciudad', '#txt_cupo', '#txt_condicion',
    '#txt_lista', '#txt_vendedor', '#txt_televendedor', '#txt_codigoSap',
    '#txt_institucional', '#txt_controlado'
  ];
  $(camposVal.join(',')).val('');

  $("#txt_total").val('$0');
  $("#txt_numero, #txt_numero_sap").val('0');
  $("#dvResultProductos").empty();

  $("#txt_oficina, #txt_destinatario").empty();
  $("#txt_destinatario").attr('disabled', false);
  $("#btnProductos, #btnPedidos").attr("disabled", true);
  $("#btnDescuentos").hide();

  $('#txt_cliente').prop('readonly', false);
  $("#txt_oficina").attr('disabled', false);

  // Visualización según Departamento
  const DepId = $("#Dpto").val();
  if (DepId == 10) {
    CargarClienteNit($.trim($("#Nit").val()), 'c');
    $('#txt_cliente').val('');
  } else {
    $('#txt_cliente').val('');
  }

  if (![10, 11, 13, 9].includes(+DepId)) {
    $("#trTipoPed, #trCondicion, #trCupo, #btnEstadisticas").show();
  } else {
    $("#trTipoPed, #trCondicion, #trCupo, #btnEstadisticas").hide();
  }

  if (![11, 13, 9].includes(+DepId)) {
    $('[href="#dvEventos"]').closest('li').show();
    $("#separadorEventos").show();
  } else {
    $('[href="#dvEventos"]').closest('li').hide();
    $("#separadorEventos").hide();
  }

  const Rol = +$.trim($("#Rol").val());
  const botonesOcultar = "#btnEditar, #btnTempTerceros, #btnAddEntregas, #separadorEntregas, #btListaFacts, #separadorFacturas, #btnMenu5, #btnMenu6, #btnMenu7, #btnMenu8";

  if ([9, 11, 120].includes(Rol)) {
    $(botonesOcultar).hide();
  } else if (Rol === 10) {
    $(botonesOcultar + ', #btnDescuentos').hide();
  }

  // Permiso para eliminar pedidos y OT
  if ([1, 3, 13].includes(Rol)) {
    $("#btnMenu5, #btnEliminaOT").show();
  } else {
    $("#btnMenu5, #btnEliminaOT").hide();
  }

  $("#n_resultados").text("");
  $("#OficinaEntregas").html(OfcN);
  $("#TxtIntegracion").val('N').attr('disabled', false);

  if ($("#link_pro").val() !== '0') {
    $("#btnLimpiar").attr("disabled", true);
  }

  $('#cartera_edades, #Presupuesto_datos').empty();
}
// FUNCIÓN PARA OBTENER INFORMACIÓN DE BONIFICADOS
function InfoBon(descripcion, desc_bonificado_n, stock, stock_bonificado, condicion, stock_prepack) {
  Swal.fire({
    title: "BONIFICADO",
    html: `
        <table border="0" class="form" width="100%">
          <tr>
            <td colspan="4" align="center"><b>CONDICION OFERTA: ${condicion}</b></td>
          </tr>
          <tr>
            <td align="left"><b>REGULAR</b></td>
            <td align="left">${descripcion}</td>
            <td align="left" width="60"><b>STOCK</b></td>
            <td align="left" width="60">${stock}</br>
          </tr>
          <tr>
            <td align="left" width="100"><b>BONIFICADO</b></br>
            <td align="left">${desc_bonificado_n}</td>
            <td align="left"><b>STOCK</b></td>
            <td align="left">${stock_bonificado}</b>
          </tr>
          <tr>
            <td colspan="4" align="center"><b>OFERTAS DISPONIBLES : ${stock_prepack}</b></td>
          </tr>
        </table>`,
    showCloseButton: true,
    confirmButtonText: 'Cerrar'
  });
}
// FUNCIÓN PARA LIMPIAR CADENAS DE CARACTERES ESPECIALES
function getCleanedString(cadena) {
  let specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";
  for (let i = 0; i < specialChars.length; i++) {
    cadena = cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
  }
  cadena = cadena.toLowerCase();
  // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
  cadena = cadena.replace(/á/gi, "a");
  cadena = cadena.replace(/é/gi, "e");
  cadena = cadena.replace(/í/gi, "i");
  cadena = cadena.replace(/ó/gi, "o");
  cadena = cadena.replace(/ú/gi, "u");
  cadena = cadena.replace(/ñ/gi, "n");
  return cadena.toUpperCase();
}
// FUNCIÓN PARA ORDENAR REGISTROS
function sortJSON(data, key, orden) {
  return data.sort(function (a, b) {
    let x = a[key], y = b[key];

    if (orden === 'asc') return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    if (orden === 'desc') return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
}
// FUNCIÓN REORDENAR TABINDEX
function reordenarTabindex() {
  let inputs = document.querySelectorAll('input.cantidad');
  inputs.forEach((input, index) => {
    input.setAttribute('tabindex', index + 1);
  });
}
// FUNCIÓN PARA ARMAR TABLA PRINCIPAL DE RESULTADOS DE PRODUCTOS
function TableView(filas) {
  // const op_inf = $("#DvChkKits").hasClass('DivCheckBoxTrue') ? 1 : 0;
  const op_inf = (document.querySelector('#DvChkKits').checked) ? 1 : 0;
  const org = $.trim($("#Organizacion").val());

  let tabla = `
    <table class="display" width="100%" id="tableProd">
      <thead style="background-color: #cff4fc;">
        <tr>
          <th class="size-th no-wrap">CÓDIGO</th>
          <th class="size-th no-wrap">DESCRIPCIÓN</th>
          <th class="size-th no-wrap">VALOR</th>
          <th class="size-th no-wrap">IVA</th>
          <th class="size-th no-wrap">DCTO</th>
          <th class="size-th no-wrap">VNETO</th>
          <th class="size-th no-wrap">STOCK</th>
          <th class="size-th no-wrap">CANTIDAD</th>
          <th class="size-th no-wrap">TOTAL</th>
          <th class="size-th no-wrap">ID</th>
          <th class="size-th no-wrap">INFO</th>
        </tr>
      </thead>
      <tbody>`;

  let Bonifica;

  filas.forEach((d, i) => {
    Bonifica = d.bonificado != 0 && (parseInt(d.stock_bonificado) >= parseInt(d.cant_bonificado)) ? 1 : 0;
    const cantPedido = d.cant_pedido == 0 ? '' : d.cant_pedido;
    const vlrPedido = d.cant_pedido == 0 ? '' : d.vlr_pedido;

    const img = Bonifica ?
      `<img src="../resources/icons/regalo.png" width="24" height="24" onclick="InfoBon('${d.descripcion}','${d.desc_bonificado_n}','${d.stock}','${d.stock_bonificado}','${d.condicion_b}','${d.stock_prepack}')" align="absmiddle">` : '';

    const img_desc = parseInt(d.descuento_adg) > 0 ?
      `<i class="fa-regular fa-star text-warning"></i> <b>%</b> ` : '';

    const img_new = parseInt(d.dias_creacion) <= 90 ?
      `<img src="../resources/icons/nuevo.png" width="24" title="* Producto Nuevo *" height="24" align="absmiddle">` : '';

    let img_1 = '', img_2 = '', img_3 = '';
    if (org === '2000') {
      img_1 = parseInt(d.img1) === 1 ?
        `<img src="../resources/icons/pw/aniversario.png" width="32" title="FERIA ROMA" height="32" align="absmiddle">` : '';
      img_2 = parseInt(d.img2) === 1 ?
        `<img src="../resources/icons/pw/70star.png" width="24" title="PRODUCTO ESTRELLA" height="24" align="absmiddle">` : '';
    }

    const ofertado = d.codigo_material.substring(0, 4);
    img_3 = ofertado === '4000' ?
      `<img src="../resources/icons/pw/tag_marcado.png" width="24" title="PRODUCTO OFERTADO" height="24" align="absmiddle">` : '';

    tabla += `
      <tr>
        <td class="size-td no-wrap">${img_new}${d.codigo_material}</td>
        <td class="p-0 size-12 no-wrap">
          <div class="m-0" title="${d.descripcion.trim()}">${img_3} ${img} ${img_desc} ${cortarTexto(d.descripcion, 70)} ${img_1} ${img_2}</div>
          <p class="m-0 text-primary" style="font-size: 10px;">${d.grupoAr} - ${d.fechaV}</p>
        </td>
        <td class="size-td no-wrap" style="background-color:#64D4F7">${formatNum(d.valor_unitario, '$')}</td>
        <td class="size-td no-wrap">${d.iva}</td>
        <td class="size-td no-wrap">${d.descuento}</td>
        <td class="size-td no-wrap" style="background-color:#95F3E8">${formatNum(d.valor_neto, '$')}</td>
        <td class="size-td no-wrap">${d.stock}</td>
        <td class="td-input-two"><input type="number" id="CAF${d.codigo_material}" value="${cantPedido}" class="form-control size-td shadow-sm cantidad" data-material='${JSON.stringify(d)}'></td>
        <td class="td-input"><input type="text" class="form-control size-td" id="TOF${d.codigo_material}" value="${formatNum(vlrPedido, '$')}" disabled readonly></td>
        <td><input type="text" class="form-control" value="${d.id_pedido}" id="IDF${d.codigo_material}" readonly></td>
        <td align="center">
          <button type="button" class="btn btn-sm btn-outline-primary info-btn" style="font-weight: bolder; font-size: 15px;" data-material='${JSON.stringify(d)}'>
            <i class="fa-solid fa-plus" style="font-size: 17px"></i>
          </button>
        </td>
      </tr>`;
  });

  tabla += `</tbody></table>`;

  $("#dvResultProductos").html(tabla);

  $('#tableProd').DataTable({
    paging: false,
    searching: false,
    ordering: true,
    info: false,
    responsive: true,
    columnDefs: [
      { targets: [9], className: "d-none" },
      { targets: [10], orderable: false }
    ],
    language: {
      zeroRecords: "No se encontraron registros",
      infoEmpty: "No hay registros disponibles"
    }
  });

  reordenarTabindex();

  $('#tableProd').on('blur', '.cantidad', function () {
    const { codigo_material, valor_unitario, iva, descuento, valor_neto, stock, vlr_pedido, id_pedido, cant_bonificado, cant_regular, stock_bonificado } = $(this).data('material');
    const cantidad = $(this).val();
    AddProducto(codigo_material, valor_unitario, iva, descuento, cantidad, valor_neto, stock, vlr_pedido, id_pedido, Bonifica, cant_bonificado, cant_regular, stock_bonificado);
  });

  $('#tableProd').on('click', '.info-btn', function () {
    const { codigo_material, valor_unitario, iva, descuento, descripcion, stock, op_inf } = $(this).data('material');
    InfoMaterial(codigo_material, valor_unitario, iva, descuento, descripcion, stock, op_inf);
  });
}
// FUNCIÓN GUARDAR SHOPING
const GuardarShoping = async () => {
  try {
    const data = await enviarPeticion({
      op: "GUARDA_SHOPING",
      link: urlModel,
      codigo_sap: $("#txt_codigoSap").val(),
      shoping_codmaterial: $("#shoping_codmaterial").val(),
      shoping_preciomaterial: unformatNum($("#shoping_preciomaterial").val()),
      shoping_lista: $("#txt_lista").val(),
      shoping_usuario: $("#UsrLogin").val(),
      competencia: $("#shoping_competencia").val(),
      valor_competencia: $("#shoping_valor").val(),
      shoping_observacion: $("#shoping_observacion").val(),
      oficina: $("#txt_oficina").val()
    });

    if (data.ok) {
      Swal.fire("Excelente", "Informacion almacenada correctamente", "success");
      $("#shoping_observacion").val("");
      $("#shoping_valor").val("");
    }
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN LISTAR COMPETENCIA
const ListarCompetencia = async () => {
  try {
    let option = "";
    const organizacion = $("#Organizacion").val();
    const data = await enviarPeticion({ op: "LISTA_COMPETENCIA", link: "../models/Listar_fidelizados.php", organizacion });
    data.forEach(item => option += `<option value="${item.ID}">${item.NOMBRE}</option>`);
    $("#shoping_competencia").html(option);
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN PARA FILTRAR CLIENTES
function FiltrarCli(expr, ArrayCli, op) {
  const expresion = new RegExp(expr, "i");
  let filtro = [];

  switch (parseInt(op)) {
    case 1: // Filtrar por código SAP, NIT o teléfonos
      filtro = ArrayCli.filter(cliente => {
        return expresion.test(cliente.codigo_sap)
          || expresion.test(cliente.nit)
          || expresion.test(cliente.telefonos);
      });
      break;
    case 2: // Filtrar por nombres o razón comercial
      filtro = ArrayCli.filter(cliente => {
        return expresion.test(cliente.nombres)
          || expresion.test(cliente.razon_comercial);
      });
      break;
    default:
      filtro = [];
      break;
  }
  return filtro;
}
// FUNCIÓN RECURSIVA
function recursiva(expr, ArrayP, st, des, f_bon, isnum, f_new, f_ofe) {
  let expresion = new RegExp(expr, "i");

  if (isnum == 1) {
    for (let c = 0; c < ArrEan.length; c++) {
      let cod = ArrEan[c];
      if (cod.ean == expr) {
        expresion = new RegExp(cod.codigo_material, "i");
        break;
      }
    }
  }

  let filtro = ArrayP.filter(item => {
    return expresion.test(item.descripcion) || expresion.test(item.codigo_material);
  });

  if (st == 1) filtro = filtro.filter(item => item.stock > 0);
  if (des == 1) filtro = filtro.filter(item => item.descuento > 0);
  if (f_bon == 1) filtro = filtro.filter(item => item.bonificado > 0);
  if (f_new == 1) filtro = filtro.filter(item => item.dias_creacion <= 90);
  if (f_ofe == 1) filtro = filtro.filter(item => item.codigo_material.substring(0, 4) == '4000');

  return filtro;
}
// FUNCIÓN AGREGAR PRODUCTO PLANO
async function AddProductoPlano(pcodigo, pvalor, piva, pdcto, pcant, pneto, pstock, pvrlped, pidped, pbonifica, pcantbon, pcantreg, pstobon) {
  let oficina = $("#txt_oficina").val();
  let codigo = pcodigo;

  let vlr_unitario = pvalor;
  let iva = piva;
  let descuento = pdcto;
  let cant = isNaN(pcant) || pcant == '' ? 0 : parseInt(pcant);
  let precio = pneto;
  let stock = parseInt(pstock);
  let totalfila = parseFloat(precio) * parseInt(cant);
  let totalped = unformatNum($("#txt_total").val());
  let NumPed = $("#txt_numero").val();
  let idfila = 'IDF' + pcodigo;
  // Variables de control de envio de bonificacion
  let Bonifica = pbonifica;
  let CantBonifica = pcantbon;
  let CantRegular = pcantreg;
  let StockBonifica = pstobon;

  if (cant > 0) { // validacion de cantidad mayor a cero   
    // Encabezado
    if (NumPed == 0) {
      NumPed = await InsertarEncabezado(); // Se inserta el encabezado
      $("#txt_numero").val(NumPed);
    }

    if (NumPed > 0) {
      totalped = (totalped + totalfila);
      $("#txt_total").val(formatNum(totalped, '$'));
      await InsertarDetalle(NumPed, codigo, cant, vlr_unitario, descuento, totalfila, iva); // Se inserta el detalle
    }
  }
}
// FUNCIÓN BUSCAR PRODUCTO EN EL ARRAY EN MEMORIA
function BuscarProductoArr(isn) {
  let desc = $.trim($("#txt_bproductos").val()).toUpperCase(); //descripcion del producto
  let bodega = $("#txt_oficina").val(); //bodega
  let lista = $("#txt_lista").val(); //lista de precio del cliente
  let numero = $("#txt_numero").val(); //numero del pedido temporal
  let eps = $("#txt_institucional").val(); //eps
  let ctrl = $("#txt_controlado").val(); //si es controlado
  let top = $("#txt_reg").val(); //top de busqueda
  let orden = $("#txt_orden").val(); //ordenar 

  let f_sto = 0;
  let f_dto = 0;
  let f_bon = 0;
  let f_bar = 0;
  let f_new = 0;
  let f_ofe = 0;

  // if ($("#DvChkStock").hasClass('DivCheckBoxTrue')) f_sto = 1;
  if (document.querySelector('#DvChkStock').checked) f_sto = 1;
  // if ($("#DvChkDctos").hasClass('DivCheckBoxTrue')) f_dto = 1;
  if (document.querySelector('#DvChkDctos').checked) f_dto = 1;
  // if ($("#DvChkBonif").hasClass('DivCheckBoxTrue')) f_bon = 1;
  if (document.querySelector('#DvChkBonif').checked) f_bon = 1;
  // if ($("#DvChkBarras").hasClass('DivCheckBoxTrue')) f_bar = 1;
  // if (document.querySelector('#DvChkBarras').checked) f_bar = 1;
  // if ($("#DvChkNuevos").hasClass('DivCheckBoxTrue')) f_new = 1;
  if (document.querySelector('#DvChkNuevos').checked) f_new = 1;
  // if ($("#DvChkOfertado").hasClass('DivCheckBoxTrue')) f_ofe = 1;
  if (document.querySelector('#DvChkOfertado').checked) f_ofe = 1;

  let sh_cod = 0;
  let sh_ean = 0;
  let sh_des = 0;
  desc = escapeRegExp(desc);

  if (desc != "") {
    let div_cadena = desc.split(" ");
    let new_arr = new Array();
    let expr = "";
    Arr = ArrProd;
    $("#txt_bproductos").attr("disabled", true);

    if (isn == 1) {
      Arr = recursiva(desc, Arr, f_sto, f_dto, f_bon, isn, f_new, f_ofe);
    } else {
      for (let x = 0; x < div_cadena.length; x++) {
        expr = $.trim(div_cadena[x]);
        Arr = recursiva(expr, Arr, f_sto, f_dto, f_bon, isn, f_new, f_ofe);
      }
    }

    $("#dvResultProductos").html(``);

    if (Arr.length > 0) {
      TableView(Arr);
      $("#n_resultados").text(`${Arr.length} Coincidencias encontradas`);
    } else {
      let msgHtml = `
      <div class="alert alert-danger" role="alert">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
      </div>`;
      $("#dvResultProductos").html(msgHtml);
      $("#n_resultados").text('0 resultados');
    }
    $("#txt_bproductos").attr("disabled", false);
  }
}
// FUNCIÓN CARGAR EAN
async function CargarEan() {
  try {
    const data = await enviarPeticion({ op: "B_EAN", link: urlModel });
    data.forEach(item => {
      let e = { codigo_material: item.codigo_material, ean: item.ean }
      ArrEan.push(e);
    });
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN PARA BUSCAR PRODUCTOS 
async function BuscarProductos() {
  let desc = $.trim($("#txt_bproductos").val());
  let bodega = $("#txt_oficina").val();
  let lista = $("#txt_lista").val();
  let numero = $("#txt_numero").val();
  let eps = $("#txt_institucional").val();

  let ctrl = $("#txt_controlado").val();
  let top = $("#txt_reg").val();
  let orden = $("#txt_orden").val();
  let CodigoSAP = $("#txt_codigoSap").val();
  // Grupos de terceros
  let Grp1 = $("#txtGrp1").val();
  let Grp2 = $("#txtGrp2").val();

  let f_sto = 0;
  let f_dto = 0;
  let f_bon = 0;
  let f_bar = 0;
  let f_new = 0;

  // if ($("#DvChkStock").hasClass('DivCheckBoxTrue')) f_sto = 1;
  if (document.querySelector('#DvChkStock').checked) f_sto = 1;
  // if ($("#DvChkDctos").hasClass('DivCheckBoxTrue')) f_dto = 1;
  if (document.querySelector('#DvChkDctos').checked) f_dto = 1;
  // if ($("#DvChkBonif").hasClass('DivCheckBoxTrue')) f_bon = 1;
  if (document.querySelector('#DvChkBonif').checked) f_bon = 1;
  // if ($("#DvChkBarras").hasClass('DivCheckBoxTrue')) f_bar = 1;
  // if (document.querySelector('#DvChkBarras').checked) f_bar = 1;
  // if ($("#DvChkNuevos").hasClass('DivCheckBoxTrue')) f_new = 1;
  if (document.querySelector('#DvChkNuevos').checked) f_new = 1;

  let TipoPed = $("#TxtIntegracion").val();

  let op_sw = 'B_PRODUCTOS';
  let op_inf = 0;
  // if ($("#DvChkKits").hasClass('DivCheckBoxTrue')) {
  //   op_sw = 'B_PRODUCTOS_KIT';
  //   op_inf = 1;
  // }
  if (document.querySelector('#DvChkKits').checked) {
    op_sw = 'B_PRODUCTOS_KIT';
    op_inf = 1;
  }

  try {
    LoadImg('Cargando portafolio...');
    ArrProd = [];
    const data = await enviarPeticion({ op: op_sw, link: urlModel, desc, bodega, lista, numero, eps, ctrl, f_sto, f_dto, f_bon, f_bar, top, orden, TipoPed, f_new, Grp1, Grp2, CodigoSAP });
    data.forEach(item => {
      let det = {
        codigo_material: item.codigo_material,
        descripcion: $.trim(item.descripcion),
        grupoAr: $.trim(item.grupoAr),
        fechaV: $.trim(item.fechaV),
        valor_unitario: item.valor_unitario,
        iva: item.iva,
        descuento: item.descuento,
        stock: item.stock,
        valor_neto: item.valor_neto,
        valor_bruto: item.valor_bruto,
        bonificado: item.bonificado,
        desc_bonificado_n: item.desc_bonificado_n,
        stock_bonificado: item.stock_bonificado,
        cant_bonificado: item.cant_bonificado,
        cant_regular: item.cant_regular,
        condicion_b: item.condicion_b,
        stock_prepack: item.stock_prepack,
        cant_pedido: item.cant_pedido,
        id_pedido: item.id_pedido,
        vlr_pedido: item.vlr_pedido,
        grupo_articulo: item.grupo_articulos,
        descuento_adg: item.descuento_adg,
        dias_creacion: item.dias_creacion,
        img1: item.img1,
        img2: item.img2,
        op_inf: item.op_inf
      }
      ArrProd.push(det);
    });
    sortJSON(ArrProd, 'descripcion', 'asc');
    $("#btnProductos").attr("disabled", false);
    CargarEan();
  } catch (error) {
    console.error(error);
  } finally {
    UnloadImg();
  }
}
// FUNCIÓN QUE PERMITE GUARDAR LA HUELLA FALTANTE
async function GuardarHuella() {
  try {
    const data = await enviarPeticion({
      op: "G_HUELLA",
      link: urlModel,
      codigo_sap: $("#txt_codigoSap").val(),
      codigo_material: $("#huella_codmaterial").val(),
      cantidad: $("#huella_cantidad").val(),
      oficina: $("#txt_oficina").val(),
      usuario: $("#UsrLogin").val(),
      pedido: $("#txt_numero").val(),
      nota: $("#huella_notas").val(),
      valor: unformatNum($("#shoping_preciomaterial").val()),
      dcto: $("#huella_dcto").val(),
      stock: $("#huella_stock").val()
    });
    if (data.ok) {
      Swal.fire("Excelente.", "Informacion almacenada correctamente.", "success");
      $("#huella_cantidad").val("");
      $("#huella_notas").val("");
    }
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN PARA VALIDAR URL DE IMAGEN
const validarUrlImg = async (codigo) => {
  try {
    codigo = codigo.substring(0, 1) != "8" ? "1" + codigo.substring(1) : codigo;
    const url = `https://app.pwmultiroma.com/web/imagenesMateriales/${codigo}.png`;
    const defaultUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/480px-Imagen_no_disponible.svg.png";

    const img = new Image();
    img.onload = function () {
      $(".img-material").attr("src", url);
    };

    img.onerror = function () {
      $(".img-material").attr("src", defaultUrl);
    };

    img.src = url;

    $(".img-material").css({ width: 400, height: 345 });
  } catch (e) {
    console.error(e);
    $(".img-material").attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/480px-Imagen_no_disponible.svg.png");
  }
};
// FUNCIÓN PARA OBTENER INFORMACIÓN DEL PRODUCTO
async function InfoMaterial(pcodigo, pvalor, piva, pdcto, pdesc, pstock, op) {
  const vunit = parseFloat(pvalor);
  const iva = parseInt(piva);
  const dcto = parseInt(pdcto);
  const org = $("#Organizacion").val();
  const ofi = $("#txt_oficina").val();
  const lst = $("#txt_lista").val();
  const opc = op === "0" ? 'B_INFO_MATERIAL' : 'B_INFO_KIT';

  // Cálculos financieros
  const v1 = Math.round(vunit - ((vunit * dcto) / 100));
  const dtoPP = parseInt($("#txt_descuento").val());
  const v2 = Math.round(v1 * (iva / 100));
  const v3 = Math.round((vunit * dcto) / 100);

  let v4 = 0;
  if (pcodigo.substring(0, 1) !== '9') {
    v4 = Math.round((v1 - (v1 * (dtoPP / 100)) + v2));
  }

  $("#huella_codmaterial").val(pcodigo);
  $("#huella_descripcion").val(pdesc);
  $("#huella_dcto").val(dcto);
  $("#huella_stock").val(pstock);

  $("#shoping_codmaterial").val(pcodigo);
  $("#shoping_descripcion").val(pdesc);
  $("#shoping_preciomaterial").val(formatNum(vunit, '$'));

  $('#ModalInfoMaterial').modal('show');

  try {
    let msgHtml = `
    <div class="alert alert-info m-2">
      <i class="fas fa-spinner fa-spin"></i> Cargando...
    </div>`;
    $('#ContenidoInfoMateriales').html(msgHtml);
    const data = await enviarPeticion({ op: opc, link: urlModel, cod: pcodigo, org, ofi, lst });
    if (data.length) {
      if (op === "0") {
        renderMaterialInfo(data, { vunit, v1, v2, v3, v4, iva, dcto });
      } else {
        renderKitInfo(data);
      }
      validarUrlImg(pcodigo);
    }
  } catch (error) {
    console.error(error);
    let msgHtml = `
    <div class="alert alert-danger m-2">
      Error al cargar la información del material
    </div>`;
    $('#ContenidoInfoMateriales').html(msgHtml);
  }
}
// FUNCIÓN PARA RENDERIZAR INFORMACIÓN DEL MATERIAL
function renderMaterialInfo(data, { vunit, v1, v2, v3, v4, iva, dcto }) {
  const ins = data[0].INSTITUCIONAL == 1 ? "SI" : "NO";
  const ctrl = data[0].CONTROLADO == 1 ? "SI" : "NO";

  const stockRows = data[0]['INVENTARIO_LOTES'].map(item => `
    <tr>
      <td class="size-td">${item.CENTRO} </tb>
      <td class="size-td">${item.ALMACEN} </td>
      <td class="size-td">${item.TIPO_MOV}</td>
      <td class="size-td">${item.LOTE}</td>
      <td class="size-td">${item.VMCTO}</td>
      <td class="size-td">${parseInt(item.CANTIDAD)}</td>
      <td class="size-td">${item.UBICACION}</td>
    </tr>`).join('');

  const html = `
    <div class="container-fluid">
      <div class="row">
        <!-- Columna de datos básicos -->
        <div class="col-md-5">
          <div class="panel panel-info">
            <img src="https://dfnas.pwmultiroma.com/imagenesMateriales/no_imagen.png" class="img-responsive img-material w-100 img-fluid h-100">
          </div>
        </div>
        
        <!-- Columna de datos de venta -->
        <div class="col-md-7">
          <div class="panel panel-info">
            <div class="panel-heading text-green bag-info">DATOS DE VENTA</div>
            <table class="form" width="100%" align="center">
              <tbody>
                <tr>
                  <td class="size-10"><strong>VLR BRUTO</strong></td>
                  <td class="text-green size-td">${formatNum(vunit, '$')}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>VLR NETO SIN IVA</strong></td>
                  <td class="text-green size-td">${formatNum(v1, '$')}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>VLR NETO FINANCIERO</strong></td>
                  <td class="text-green size-td">${formatNum(v4, '$')}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>VLR DESCUENTO</strong></td>
                  <td class="text-green size-td">${formatNum(v3, '$')}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>VLR IVA</strong></td>
                  <td class="text-green size-td">${formatNum(v2, '$')}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>PORCENTAJE DCTO</strong></td>
                  <td class="text-green size-td">${dcto}%</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>PORCENTAJE IVA</strong></td>
                  <td class="text-green size-td">${iva}%</td>
                </tr>
              </tbody>
            </table>
            <div class="panel-heading text-green bag-info mt-2">DATOS BÁSICOS</div>
            <table class="form" width="100%" align="center">
              <tbody>                
                <tr>
                  <td class="size-10"><strong>CÓDIGO</strong></td>
                  <td class="text-green size-td">${data[0].CODIGO_MATERIAL}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>TEXTO CORTO</strong></td>
                  <td class="size-11 text-green">${data[0].DESCRIPCION}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>REGISTRO INFO</strong></td>
                  <td class="text-green size-td">${data[0].CODIGO_SAP}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>TEXTO LARGO</strong></td>
                  <td class="size-11 text-green">${data[0].DESCRIPCION2}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>LABORATORIO</strong></td>
                  <td class="text-green size-td">${data[0].LAB}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>INVIMA</strong></td>
                  <td class="text-green size-td">${data[0].INVIMA}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>EAN</strong></td>
                  <td class="text-green size-td">${data[0].EAN}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>EMBALAJE</strong></td>
                  <td class="text-green size-td">${data[0].EMBALAJE}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>FECHA CREACIÓN</strong></td>
                  <td class="text-green size-td">${data[0].FECHA_CREACION}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>DIAS CREACIÓN</strong></td>
                  <td class="text-green size-td">${data[0].DIAS_CREACION}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>CONTROLADO</strong>: ${ctrl}</td>
                  <td class="size-10"><strong>INSTITUCIONAL</strong>: ${ins}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
        
      <!-- Columna de datos de ingreso -->
      <div class="row mt-3">
        <div class="col-md-12">
          <div class="panel panel-info">
            <div class="text-green">INVENTARIO FÍSICO POR LOTES</div>
            <div style="overflow: auto;">
              <table class="table table-bordered table-hover table-sm" width="100%" align="center">
                <thead>
                    <tr>
                      <th class="bag-info size-th">CENTRO</th>
                      <th class="bag-info size-th">ALMACEN</th>
                      <th class="bag-info size-th">MOV</th>
                      <th class="bag-info size-th">LOTE</th>
                      <th class="bag-info size-th">VENCIMIENTO</th>
                      <th class="bag-info size-th">STOCK</th>
                      <th class="bag-info size-th">UBICACION</th>
                    </tr>
                </thead>
                <tbody>
                  ${stockRows}
                </tbody>
              </table>            
            </div>
          </div>
        </div>
      </div>
    </div>`;

  $('#ContenidoInfoMateriales').html(html);
}

// FUNCIÓN PARA RENDERIZAR INFORMACIÓN DE KIT
function renderKitInfo(data) {
  const rows = data.map(item => `
    <tr>
      <td class="size-td">${item.CODIGO_MATERIAL}</td>
      <td class="size-td">${item.DESCRIPCION}</td>
      <td class="size-td">${formatNum(item.VALOR_UNITARIO, '$')}</td>
      <td class="size-td">${item.IVA}</td>
      <td class="size-td">${item.DESCUENTO}</td>
      <td class="size-td">${formatNum(item.VALOR_NETO, '$')}</td>
      <td class="size-td">${item.CANTIDAD}</td>
      <td class="size-td">${formatNum((parseFloat(item.VALOR_NETO) * parseInt(item.CANTIDAD)), '$')}</td>
    </tr>
  `).join('');

  const html = `
    <table class="table" width="100%" align="center">
      <thead>
        <tr>
          <th>CODIGO</th>
          <th>DESCRIPCION</th>
          <th>VALOR</th>
          <th>%IVA</th>
          <th>%DCTO</th>
          <th>VALOR NETO</th>
          <th>CANTIDAD</th>
          <th>VALOR TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`;

  $('#ContenidoInfoMateriales').html(html);
}
// FUNCIÓN QUE VALIDA EN TIEMPO REAL EL INVENTARIO EN SAP
async function WSInvent(codigo, oficina) {
  let cantidad = 0;
  try {
    const data = await enviarPeticion({ link: "../models/WS-INVENT.php", codigo, oficina });
    cantidad = data;
  } catch (error) {
    console.error(error);
  }
  return cantidad;
}
// FUNCIÓN PARA AGERAGAR O ELIMINAR UN PRODUCTO SELECCIONADO
async function AddProducto(pcodigo, pvalor, piva, pdcto, pcant, pneto, pstock, pvrlped, pidped, pbonifica, pcantbon, pcantreg, pstobon) {
  let oficina = $("#txt_oficina").val();
  let codigo = pcodigo;
  let cant = isNaN(pcant) || pcant == '' ? 0 : parseInt(pcant);
  // Variables de control de envio de bonificacion-
  let Bonifica = pbonifica;
  let CantBonifica = pcantbon;
  let CantRegular = parseInt(pcantreg);
  let StockBonifica = pstobon;
  // Verificacion de aumento de cantidad segun bonificacion
  if ((cant > 0) && (cant < CantRegular)) {
    const result = await confirmAlert("Oferta Producto", `Este producto tiene una oferta ${CantRegular} + ${CantBonifica} ¿desea aumentar su cantidad para que no deje perder esta promoción?`);
    if (result.isConfirmed) {
      cant = CantRegular;
      $("#CAF" + pcodigo).val(cant);
    }
  }

  let vlr_unitario = pvalor;
  let iva = piva;
  let descuento = pdcto;
  let precio = pneto;
  let stock = parseInt(pstock);
  let totalfila = parseFloat(precio) * parseInt(cant);
  let totalped = unformatNum($("#txt_total").val());
  let totalfila_antes = isNaN(unformatNum($('#TOF' + pcodigo).val())) || unformatNum($('#TOF' + pcodigo).val()) == '' ? 0 : unformatNum($('#TOF' + pcodigo).val());
  let NumPed = $("#txt_numero").val();
  let idfila = 'IDF' + pcodigo;

  if (cant > 0) {
    let CantRegalar = parseInt(parseInt(parseInt(cant) / parseInt(CantRegular)) * parseInt(CantBonifica));
    let swb = 0;
    if (parseInt(Bonifica) == 1) {
      if (CantRegalar <= parseInt(StockBonifica)) {
        swb = 0;
      } else {
        Swal.fire({
          title: "INFORMACIÓN",
          type: "info",
          html: `<table border="0"  width="100%">
                  <tr>
                    <td colspan="4" align="justify">
                      Señor usuario, tenga en cuenta que la cantidad disponible de bonificado
                      es inferior a la ingresada, lo que significa que solo llegarán <strong>${StockBonifica}</strong> 
                      unidades de bonificación, si no esta de acuerdo con esto por favor modificar 
                      la cantidad de producto valorado.
                    </td>
                  </tr>
                </table>`,
          showCloseButton: true,
          confirmButtonText: 'Ok'
        });
      }
    } else {
      swb = 0;
    }
    totalped = (totalped - totalfila_antes) + totalfila;
    $(`#TOF${pcodigo}`).val(formatNum(totalfila, "$"));
    $("#txt_total").val(formatNum(totalped, "$"));

    // Se inserta el encabezado
    if (NumPed == 0) {
      NumPed = await InsertarEncabezado();
      $("#txt_numero").val(NumPed);
    }

    // Se inserta la fila 
    if ($(`#${idfila}`).val() == 0) {
      idfila = await InsertarDetalle(NumPed, codigo, cant, vlr_unitario, descuento, totalfila, iva);
      $(`#IDF${pcodigo}`).val(idfila);
    } else {
      // Se actualiza la fila
      let id = $(`#IDF${pcodigo}`).val();
      await ActualizarDetalle(id, cant, totalfila, codigo);
    }

  } else {
    totalped = totalped - totalfila_antes;
    $("#txt_total").val(formatNum(totalped, '$'));
    $(`#CAF${pcodigo}`).val(''); // input catidad
    $(`#TOF${pcodigo}`).val(''); // input total
    // Se elimina la fila 	
    await EliminarDetalle($(`#IDF${pcodigo}`).val(), pcodigo);
    $(`#IDF${pcodigo}`).val(0); // input id fila
  }
}
// FUNCIÓN QUE CONSTRUYE EL LISTADO DE DESTINATARIOS DE MERCANCIA 
async function Destinatarios(codSap, ciudad, direccion) {
  try {
    const data = await enviarPeticion({ op: "B_DESTINATARIO", link: urlModel, codSap: $.trim(codSap) });
    let destino = `<option value="0" selected>Principal - ${ciudad} - ${direccion}</option>`;
    if (data != '') {
      data.forEach((item, i) => destino += `<option value="${item.id}">alterna ${i} - ${item.direccion}</option>`);
    }
    $("#txt_destinatario").html(destino);
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN PARA INSERTAR EL ENCABEZADO DEL PEDIDO
async function InsertarEncabezado() {
  let numero = 0;
  let usuario = $("#UsrLogin").val();
  let tipoPed = $("#TxtIntegracion").val();
  if (usuario != '') {
    try {
      const data = await enviarPeticion({
        op: "I_PEDIDO_ENCABEZADO",
        link: urlModel,
        organizacion_ventas: $("#Organizacion").val(),
        oficina_ventas: $("#txt_oficina").val(),
        canal_distribucion: 10,
        codigo_sap: $("#txt_codigoSap").val(),
        destinatario: $("#txt_destinatario").val(),
        tipoPed: tipoPed,
        cotizacion: $("#tipo_documento").val()
      });
      if (!isNaN(data) > 0) {
        numero = data;
        $("#btnPedidos").attr("disabled", false);
      } else {
        alert('ERROR: Al insertar el encabezado del pedido');
      }
    } catch (error) {
      console.error(error);
    }
  }
  return numero;
}
// FUNCIÓN MODIFICAR ARRAY
function ModificarArray(cant, total, id, cod) {
  for (let i = 0; i < ArrProd.length; i++) {
    let d = ArrProd[i];
    if (d.codigo_material == cod) {
      d.cant_pedido = cant;
      d.vlr_pedido = total;
      d.id_pedido = id;
    }
  }
}
// FUNCIÓN QUE INSERTA EL DETALLE 
async function InsertarDetalle(NumPed, codigo, cant, vlr_unitario, descuento, totalfila, iva) {
  let numero = 0;
  let NumPedSAP = $.trim($("#txt_numero_sap").val());
  try {
    const data = await enviarPeticion({
      op: "I_PEDIDO_DETALLE",
      link: urlModel,
      NumPed: NumPed,
      codigo: codigo,
      cant: cant,
      vlr_unitario: vlr_unitario,
      vlr_total: totalfila,
      descuento: descuento,
      iva: iva,
      lista: $("#txt_lista").val(),
      oficina: $("#txt_oficina").val(),
      canal: '10'
    });

    if (!isNaN(data) > 0) {
      numero = data;
      if (NumPedSAP != 0) {
        await InserUpdateSAP('MODIFICAR', NumPed, NumPedSAP);
      }
      ModificarArray(cant, totalfila, numero, codigo);
    } else {
      showToastr("error", `ERROR: Al insertar el producto - ${codigo} ${data}`);
    }
  } catch (error) {
    console.error(error);
  }
  return numero;
}
// FUNCIÓN QUE ACTUALIZA EL DETALLE DEL PEDIDO
async function ActualizarDetalle(idfila, cant, totalfila, codigo) {
  try {
    let numero = $.trim($("#txt_numero").val());
    let numeroSAP = $.trim($("#txt_numero_sap").val());

    const data = await enviarPeticion({
      op: "U_PEDIDO_DETALLE",
      link: urlModel,
      idfila: idfila,
      cant: cant,
      vlr_total: totalfila,
      oficina: $("#txt_oficina").val(),
      codigo: codigo,
      numero: numero,
      lista: $("#txt_lista").val(),
      canal: '10'
    });
    console.log(data);
    if (numeroSAP != 0) {
      await InserUpdateSAP('MODIFICAR', numero, numeroSAP);
    }
    ModificarArray(cant, totalfila, idfila, codigo);
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN QUE ELIMINA EL DETALLE DEL PEDIDO 
async function EliminarDetalle(idfila, codigo) {
  try {
    let numero = $.trim($("#txt_numero").val());
    let numeroSAP = $.trim($("#txt_numero_sap").val());

    const data = await enviarPeticion({
      op: "D_PEDIDO_DETALLE",
      link: urlModel,
      idfila: idfila,
      numero: numero,
      oficina: $("#txt_oficina").val(),
      codigo: $.trim(codigo),
      lista: $("#txt_lista").val(),
      canal: '10'
    });

    if (data > 0) {
      if (numeroSAP != 0) {
        await InserUpdateSAP('MODIFICAR', numero, numeroSAP);
      }
      ModificarArray(0, 0, 0, codigo);
    }
    VerificaPedido();
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN QUE ACTUALIZA O GUARDA EL PEDIDO EN EL WS
async function InserUpdateSAP(op, numero, numeroSAP) {
  try {
    LoadImg('Guardando...');
    const data = await enviarPeticion({ op, link: "../models/WS-PW.php", numero, numeroSAP });

    if (data.Tipo == 'S') {
      showToastr("success", data.Msj);
    } else {
      showToastr("error", data.Msj);
    }
  } catch (error) {
    console.log(error);
  } finally {
    UnloadImg();
  }
}
// FUNCIÓN QUE VERIFICA SI EL PEDIDO EXISTE O NO EN LA BASE DE DATOS
async function VerificaPedido() {
  try {
    let num = $("#txt_numero").val();
    if (num > 0) {
      const data = await enviarPeticion({ op: "S_VERIFICA_PEDIDO", link: urlModel, num });
      if (data == '') {
        let numsap = $.trim($("#txt_numero_sap").val());
        if (numsap != 0) {
          EliminarSAP(numsap, 0);
        }
        $("#txt_total").val('$0');
        $("#txt_numero").val('0');
        $("#txt_numero_sap").val('0')
      }
    }
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN PARA ENVIAR COTIZACIÓN VÍA EMAIL
async function enviarCotizacionEmail(numero) {
  try {
    showLoadingSwalAlert2();
    const resp = await enviarPeticion({
      op: "EnviarPedidoEmail",
      link: "../models/ProgramacionCliente.php",
      ped: numero,
      tipo: "C"
    });
    dissminSwal();

    if (resp.Tipo && resp.Tipo == "success") {
      showToastr("success", "Documento enviado");
      activaTab("btnClientes");
      Limpiar();
      // valido si se abrio el modulo desde el 0102 
      if ($("#link_pro").val() != "0" || $("#link_pro").val() != "") {
        preLoadCliente($("#link_pro").val());
      }
    } else {
      Swal.fire("Error", "Ocurrio un error al enviar la cotización", "error");
    }
  } catch (e) {
    Swal.fire("Error", "Ocurrio un error al enviar la cotización", "error");
    dissminSwal();
    console.error(e)
  }
}
// FUNCIÓN PARA CONFIRMAR ENVÍO DE PEDIDO VÍA EMAIL
async function ConfirmarenviarPedidoEmail(numero) {
  const result = await confirmAlert("¿Desea enviar la cotización al correo?", "La cotizacion se enviará al correo " + $("#emailCliente").val());
  if (result.isConfirmed) {
    enviarCotizacionEmail(numero);
  }
}
// LISTAR PEDIDO TEMPORAL
const ListarPedido = async () => {
  try {
    $("#dvResultProductos").html("");
    let numero = $("#txt_numero").val();

    LoadImg('Cargando pedido...');

    const data = await enviarPeticion({ op: "S_PEDIDO_DETALLE", link: urlModel, numero });
    if (data.length) {
      let cont = 0;
      let vtotal = 0;
      let vunit = 0;
      let vneto = 0;
      let vbruto = 0;
      let ctotal = 0;
      let tabla = '';
      let detalle = '';
      let notas = '';
      let style = '';

      data.forEach((item, index) => {
        cont++;
        vtotal += parseInt(item.valor_total);
        vunit += parseInt(item.valor_unitario);
        vneto += parseInt(item.valor_neto);
        ctotal += parseInt(item.cantidad);
        vbruto += parseInt(item.valor_bruto) * parseInt(item.cantidad);
        notas = item.notas;
        let Bonifica = 0; // variable creada para saber si el producto esta o no bonificado

        if (item.cantidad == 0) {
          item.cantidad = '';
          item.valor_total = '';
        } else {
          item.valor_total = formatNum(item.valor_total, '$');
        }

        let img = "";
        if (item.bonificado != 0 && (parseInt(item.stock_bonificado) >= parseInt(item.cant_bonificado))) {
          Bonifica = 1;
          img = `<img src="../resources/icons/regalo.png" width="24" heigth="24" onclick="InfoBon('${item.descripcion}','${item.desc_bonificado}', '${item.stock}', '${item.stock_bonificado}', '${item.condicion_b}', '${item.stock_prepack}')" align="absmiddle">`;
        }

        if (parseInt(item.stock) < parseInt(item.cantidad)) {
          style = 'style = "background-color: #FB8A8B;"';
        }

        // Nueva validación para códigos bonificados.
        let clase = '';
        let acces = '';
        let msj = '';
        if (item.codigo.substr(0, 1) == '2' || item.codigo.substr(0, 1) == '3' || item.tipo == 'K') {
          clase = 'class="aler alert-warning"';
          acces = "readonly disabled";
          msj = "<b><i>(GRATIS)</i></b>";
        }

        if (item.tipo == 'K') {
          clase = 'class="aler alert-info"';
          acces = "readonly disabled";
          msj = "<b><i>(KIT)</i></b>";
        }

        detalle += `
        <tr ${clase}>
          <td class="size-td">${item.codigo}</td>
          <td class="size-td no-wrap">${img} ${item.descripcion} ${msj}</td>
          <td class="size-td">${formatNum(item.valor_unitario, "$")}</td>
          <td class="size-td">${item.iva}</td>
          <td class="size-td">${item.descuento}</td>
          <td class="size-td">${formatNum(item.valor_neto, "$")}</td>
          <td class="size-td">${item.stock}</td>
          <td>
            <input ${acces} ${style} type="number" id="CAF${item.codigo}" onKeyPress="return vnumeros(event)" value="${item.cantidad}" class="form-control size-td" tabindex="${(index + 1)}" onBlur="AddProducto('${$.trim(item.codigo)}', '${$.trim(item.valor_unitario)}', '${$.trim(item.iva)}', '${$.trim(item.descuento)}', this.value, '${$.trim(item.valor_neto)}', '${$.trim(item.stock)}', '${$.trim(item.valor_total)}', '${$.trim(item.id)}', '${$.trim(Bonifica)}', '${$.trim(item.cant_bonificado)}', '${$.trim(item.cant_regular)}', '${$.trim(item.stock_bonificado)}'); ListarPedido();">
          </td><td class="td-input"><input type="text" class="form-control size-td" id="TOF${item.codigo}" value="${item.valor_total}" disabled readonly></td>
          <td class="td-input"><input type="text" class="form-control size-td" id="IDF${item.codigo}" value="${item.id}" disabled readonly></td>
        </tr>`;
      });

      let NumPed = $.trim($("#txt_numero").val());
      let NumPedSAP = $.trim($("#txt_numero_sap").val());
      let Rol = $.trim($("#Rol").val());
      let btnEliminar = '';
      let btnVerPdf = '';
      let btnEnviarPdfEmail = '';

      if (NumPedSAP == 0) {
        btnEliminar = `
        <button type="button" class="btn btn-danger btn-sm w-btn" onClick="EliminarPW('${NumPed}');">
          <i class="fa-solid fa-trash-can"></i>
          Eliminar
        </button>`;
        // valido si el modulo es abierto desde la programación
        if ($("#link_pro").val() != '') {
          if ($("#tipo_documento").val() == 'C') {
            // valido si es cotización 
            btnVerPdf = `
            <button type="button" class="btn btn-default btn-sm element-gestion-pedido" onClick="VisualizarPedido()">
              <i class="fa-solid fa-file-arrow-up text-danger"></i>
              Ver en pdf
            </button>`;

            btnEnviarPdfEmail = `
            <button type="button" class="btn btn-default btn-sm element-gestion-pedido" onClick="ConfirmarenviarPedidoEmail('${NumPed}')">
              <i class="fa-solid fa-envelope text-primary"></i>
              Enviar por email
            </button>`;
          }
        }
      } else {
        if (Rol == 1 || Rol == 3 || Rol == 21 || Rol == 13) { // 1:Administrador | 3:Gerente de ventas | 21:Coordinador pw | 13:Coordinador Televentas
          btnEliminar = `
          <button type="button" class="btn btn-danger btn-sm w-btn" onClick="EliminarSAP('${NumPedSAP}', '${NumPed}'); Limpiar(); activaTab('btnClientes');">
            <i class="fa-solid fa-trash-can"></i>
            Eliminar
          </button>`;
        }
      }

      const infoPedidoArray = [
        { title: "Subtotal", value: formatNum(vbruto, '$') },
        { title: "Valor Iva", value: formatNum(vtotal - vbruto, '$') },
        { title: "Valor Total", value: formatNum(vtotal, '$') },
        { title: "Items", value: cont },
        { title: "Productos", value: ctotal },
      ];

      let itemsList = ``;
      infoPedidoArray.forEach(item => {
        itemsList += `
        <li class="list-group-item d-flex justify-content-between">
            <p class="m-0">${item.title}:</p>
            <p class="m-0 text-green">${item.value}</p>
        </li>`;
      });

      let infoPedido = `
        <div class="d-flex justify-content-end align-items-center gap-3 mb-3">
          <button type="button" class="btn btn-success btn-sm w-btn" onClick="Guardar();">
            <i class="fa-solid fa-floppy-disk"></i>
            Guardar
            ${btnVerPdf} ${btnEnviarPdfEmail}
          </button>
          ${btnEliminar}
        </div>
        <textarea id="Pnotas" class="form-control mb-3 shadow-sm" style="background-color: #FFC;" onblur="UpdNotas(this)" placeholder="Notas del pedido">${notas}</textarea>
        <div class="mb-3">
          <ul class="list-group">
            ${itemsList}
          </ul>
        </div>`;

      let columns = ``;
      ['CÓDIGO', 'DESCRIPCIÓN', 'VALOR', 'IVA', 'DCTO', 'VNETO', 'STOCK', 'CANTIDAD', 'TOTAL', 'ID'].forEach(item => columns += `<th class="size-th">${item}</th>`);

      tabla += `
      <table class="display" style="width: 100%" id="tablaConfirmar">
        <thead> 
          <tr class="bag-info">
            ${columns}
          </tr>
        </thead>
      <tbody>${detalle}</tbody>
      </table>`
      $("#listInfoPedido").html(infoPedido);
      $("#dvResultPedidos").html(tabla);

      $('#tablaConfirmar').DataTable({
        paging: false,
        searching: false,
        ordering: true,
        info: false,
        responsive: true,
        scrollX: true,
        columnDefs: [
          { targets: [9], className: "d-none" },
        ],
        language: {
          zeroRecords: "No se encontraron registros",
          infoEmpty: "No hay registros disponibles"
        }
      });

    } else {
      let alertMsg = `
      <div class="alert alert-danger" role="alert">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
      </div>`;
      $("#dvResultPedidos").html(alertMsg);
    }
  } catch (error) {
    console.log(error);
  } finally {
    UnloadImg();
  }
}
// ACTUALIZACIÓN DE NOTAS DE PEDIDO 
async function UpdNotas(ob) {
  try {
    let nota = $.trim($(ob).val());
    let nump = $.trim($("#txt_numero").val());
    if (nump != '') {
      const data = await enviarPeticion({ op: "U_NOTAS", link: urlModel, nota, nump });
      if (data.ok) Swal.fire("OK", "Nota actualizada correctamente", "success");
    }
  } catch (error) {
    console.log(error);
  }
}
// PEDIDOS TEMPORALES PENDIENTES POR RECUPERAR
const Temporales = async () => {
  try {
    LoadImg('Cargando temporales...');
    const data = await enviarPeticion({ op: "S_TEMPORALES", link: urlModel });
    if (data.length) {
      let header = `    
      <div class="alert alert-warning alert-dismissible mt-2 mb-5" role="alert">
        <strong>NOTA!</strong> Todos los pedidos que se encuentran para recuperación cuentan con una validez de 24 horas,
        transcurrido este tiempo serán eliminados de manera automática por nuestro sistema.
      </div>
      <div class="mb-2">
        <span class="badge text-bg-danger size-14"><strong>T</strong>emporal</span>
        <span class="badge text-bg-warning size-14"><strong>P</strong>edido</span>
        <span class="badge text-bg-success size-14"><strong>E</strong>ntrega</span>
        <span class="badge text-bg-info size-14"><strong>O</strong>rden</span>
        <span class="badge text-bg-primary size-14"><strong>F</strong>actura</span>              
      </div>            
      <div id="VtotalPropios"></div>`;

      let tabla = `
      <table class="display" width="100%" id="tableRescue">
          <thead>
            <tr class="bag-info">
              <th class="size-th no-wrap">FECHA/HORA</th>
              <th class="size-th no-wrap">BODEGA</th>
              <th class="size-th no-wrap">NÚMERO</th>
              <th class="size-th no-wrap">NOMBRES</th>
              <th class="size-th no-wrap">VALOR</th>
              <th class="size-th no-wrap">DESTINATARIO</th>
              <th class="size-th no-wrap">TRANSFERIDO</th>
              <th class="size-th no-wrap">OPCIONES</th>
            </tr>
          </thead>
          <body>`;

      let cont = 0;
      let total = 0;

      data.forEach(item => {
        let transfer = '';
        if (item.transferido == 1) {
          if ($.trim(item.entrega) != '0') {
            if ($.trim(item.ot) != '0') {
              if ($.trim(item.factura) != '0') {
                transfer = `
                <button type="button" class="btn btn-primary btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${item.numero_sap}','success');">
                  <span aria-hidden="true"><b>F</b></span>
                </button>`;
              } else {
                transfer = `
                <button type="button" class="btn btn-info btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${item.numero_sap}','success');">
                  <span aria-hidden="true"><b>O</b></span>
                </button>`;
              }
            } else {
              transfer = `
              <button type="button" class="btn btn-success btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${item.numero_sap}','success');">
                <span aria-hidden="true"><b>E</b></span>
              </button>`;
            }
          } else {
            if ($.trim(item.sol_desbloqueo) != '') {
              let estado_sol_des = "";
              let color = "";

              switch (item.sol_desbloqueo) {
                case "0":
                  estado_sol_des = '<i class="fa-solid fa-lock " title="Solicitud enviada"></i>';
                  color = 'warning'
                  break;
                case "1":
                  estado_sol_des = '<i class="fa-solid fa-lock "  title="Solicitud en revisión"></i>';
                  color = 'info'
                  break;
                case "2":
                  estado_sol_des = '<i class="fa-solid fa-lock "  title="Solicitud rechazada"></i>';
                  color = 'danger'
                  break;
                case "3":
                  estado_sol_des = '<i class="fa-solid fa-circle-check  fa-bea"  title="Solicitud aprobada"></i>';
                  color = 'success'
                  break;
              }
              transfer += `
              <button onclick="MostrarEstadoSolDesbloqueo(${item.numero_sap})" class="btn btn-${color}">
                ${estado_sol_des}
              </button>`;
            } else {
              transfer = `
              <button type="button" class="btn btn-warning btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${item.numero_sap}','success');">
                <span aria-hidden="true"><b>P</b></span>
              </button>`;
            }
          }
        } else {
          transfer = `
          <button type="button" class="btn btn-danger btn-sm" onClick="Swal.fire('Oops', 'Pendiente por transferir', 'error');">
            <span aria-hidden="true"><b>T</b></span>
          </button>`;
        }

        item.cliente = item.cliente.replace(/'/g, '');
        item.cliente = item.cliente.replace(/"/g, '');

        tabla += `
        <tr>
          <td class="size-td no-wrap">${item.fecha_pedido}</td>
          <td class="size-12 no-wrap">${item.bodega}</td>
          <td class="size-td no-wrap">${item.numero}</td>
          <td class="p-0 size-td no-wrap">
            <p class="no-wrap" style="margin: 0; font-size: 12px;">${item.cliente}</p>
            <small style="font-weight: bold;">
              Zona ventas: <span class="text-primary" style="font-size: 8px;">${item.zona_ventas} - ${item.zona_descripcion}</span>
            </small>
          </td>
          <td class="size-td no-wrap">${formatNum(item.valor_total, '$')}</td>
          <td class="size-td no-wrap">${item.destinatario}</td>
          <td align="center" width="4%">${transfer}</td>
          <td align="center" width="4%">
            <button type="button" class="btn btn-outline-primary btn-sm" style="font-weight: bolder; font-size: 15px;" onClick="AbrirOpciones('${$.trim(item.numero)}', '${$.trim(item.valor_total)}', '${$.trim(item.codigo_direccion)}', '${$.trim(item.direccion)}', '${$.trim(item.oficina_ventas)}', '${$.trim(item.codigo_sap)}', '${$.trim(item.transferido)}', '${$.trim(item.entrega)}', '${$.trim(item.ot)}', '${$.trim(item.numero_sap)}', '${$.trim(item.factura)}', 'P', '${$.trim(item.notas)}', '${$.trim(item.usuario)}', '${$.trim(item.destinatario)}', '${$.trim(item.cliente)}');" title="Menu de opciones">
              <i class="fa-solid fa-grip" style="font-size: 17px"></i>
            </button>
          </td>
        </tr>`;
        cont++;
        total += parseFloat(item.valor_total);
      });
      tabla += `</tbody></table>`;

      $("#contenedorLeyendas").html(header);
      $("#VtotalPropios").html(`<div class="alert alert-info" role="info"><strong>VALOR TOTAL: ${formatNum(total, '$')}</strong></div>`);
      $("#DvRecuperables").html(tabla);

      $('#tableRescue').DataTable({
        paging: false,
        searching: false,
        ordering: true,
        info: false,
        responsive: true,
        scrollX: true,
        columnDefs: [
          { targets: [7], orderable: false }
        ],
        language: {
          zeroRecords: "No se encontraron registros",
          infoEmpty: "No hay registros disponibles"
        }
      });

    } else {
      let msgHtml = `
      <div class="alert alert-danger mt-3" role="alert">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
      </div>`;
      $("#contenedorLeyendas").html(``);
      $("#DvRecuperables").html(msgHtml);
    }
  } catch (error) {
    console.log(error);
  } finally {
    UnloadImg();
  }
}
// FUNCIÓN ABRIR OPCIONES
function AbrirOpciones(numero, valor_total, destinatario, direccion, bodega, codigo_sap, transferido, entrega, ot, numero_sap, factura, gestion, notas, usuario, destinatario, cliente) {
  $("#ped_gestion").val(gestion);
  $("#ped_numero").val(numero);
  $("#ped_valor_total").val(valor_total);
  $("#ped_destinatario").val(destinatario);
  $("#direccion_pedido").val(direccion);
  $("#ped_bodega").val(bodega);
  $("#ped_codigo_sap").val(codigo_sap);
  $("#ped_transferido").val(transferido);
  $("#ped_numero_sap").val(numero_sap);
  $("#ped_entrega").val(entrega);
  $("#ped_ot").val(ot);
  $("#ped_factura").val(factura);
  $("#NotasRapidas").val(notas);
  $("#ped_usuario").val(usuario);
  $("#info-cliente-codigo-sap").html(destinatario);
  $("#info-cliente-nombres").html(cliente);

  //valida si debe mostrar el btn de desbloqueo de pedidos
  if (codigo_sap != '' && codigo_sap != '0') {
    if (entrega == '0' || entrega == '' || entrega == null) {
      $("#btn-sol-desbloqueo").show();
    } else {
      $("#btn-sol-desbloqueo").hide();
    }
  }

  $("#ModalOpciones").modal("show");
  if (entrega == 0) {
    $("#NotasRapidas").attr('disabled', false);
    $("#btnNotaRapida").attr('disabled', false);
  } else {
    $("#NotasRapidas").attr('disabled', true);
    $("#btnNotaRapida").attr('disabled', true);
  }
}
// FUNCIÓN PARA VISUALIZAR PEDIDO
function VisualizarPedido() {
  let num = $.trim($("#ped_numero").val());
  $("#ContenidoPDF").html('<embed src="../resources/tcpdf/pedidos.php?ped=' + num + '&tipo=V" frameborder="0" width="100%" height="400px">');
  $("#ModalPDF").modal("show");
}
// FUNCIÓN PARA VISUALIZAR FACTURA
function VisualizarFactura(num) {
  if (num != 0) {
    $("#ContenidoPDFfactura").html('<embed src="../resources/tcpdf/Factura.php?num=' + num + '&tipo=V" frameborder="0" width="100%" height="400px">');
    $("#ModalPDFfactura").modal("show");
  } else {
    Swal.fire('error', 'El pedido seleccionado no posee factura', 'error');
  }
}
// FUNCIÓN PARA RECUPERAR PEDIDOS
function RecuperarPedido() {
  let numero = $.trim($("#ped_numero").val());
  let valor = $.trim($("#ped_valor_total").val());
  let destinatario = $.trim($("#ped_destinatario").val());
  let bodega = $.trim($("#ped_bodega").val());
  let codigo_sap = $.trim($("#ped_codigo_sap").val());
  let transferido = $.trim($("#ped_transferido").val());
  let numero_sap = $.trim($("#ped_numero_sap").val());
  let entrega = $.trim($("#ped_entrega").val());
  let DepId = $.trim($("#Dpto").val());
  // Control de modificacion de pedidos usuarios diferentes
  let ped_usuario = $.trim($("#ped_usuario").val());
  let usuario_log = $.trim($("#UsrLogin").val());
  let sw_user = 0;
  let IdRol = $.trim($("#Rol").val());

  if (ped_usuario != usuario_log && ped_usuario != 'INTEGRACION' && IdRol != 1) {
    sw_user = 1;
  }

  if (sw_user == 0) {
    if (entrega == 0) {
      $("#txt_numero").val(numero);
      $("#txt_numero_sap").val(numero_sap);
      $("#txt_total").val(formatNum(valor, '$'));
      $("#btnPedidos").attr("disabled", false);
      $("#ModalOpciones").modal("hide");
      activaTab('btnPedidos');

      if (DepId == 10) {
        $("#txt_cliente").val(codigo_sap);
        BuscarProductos();
      } else {
        CargarCliente(codigo_sap, 'c');
        $("#txt_oficina").html(OfcN);
        $("#txt_oficina option[value='" + bodega + "']").attr("selected", true);
        $("#txt_oficina").attr('disabled', true);
        $("#txt_oficina").attr('readonly', true);
        BuscarProductos();
      }

      ListarPedido();
      $("#txt_destinatario").val(destinatario);
      $("#txt_destinatario").attr('disabled', true);
      $("#txt_destinatario").attr('readonly', true);
    } else {
      Swal.fire('Cancelado', 'No es posible recuperar un pedido con procesos posteriores.', 'error');
    }
  } else {
    Swal.fire('Cancelado', 'No es posible recuperar un pedido realizado por otro usuario!.', 'error');
  }
}
// ENVÍO DE EMAIL DE PEDIDOS
async function EnviarMail(tipo, numero) {
  try {
    const data = await enviarPeticion({ metodo: "GET", link: "../resources/tcpdf/pedidos.php", ped: numero, tipo: tipo });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
// ENVÍO DE EMAIL DE ANULACIÓN DE PEDIDOS
async function EnviarMailAnulacion(tipo, numero, texto) {
  try {
    const data = await enviarPeticion({ op: "EMAIL", link: urlModel, tipo, numero, texto });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN PARA VALIDAR INVENTARIO ANTES DE GUARDAR
function WSInvenTotal() {
  let numero = $("#txt_numero").val();
  if (numero > 0) {
    $.ajax({
      encoding: "UTF-8",
      url: "../models/WS-INVENT-TOTAL.php",
      global: false,
      type: "POST",
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR);
      },
      data: ({
        numero: numero
      }),
      dataType: "html",
      async: true,
      success: function (data) {}
    });
  }
}
// FUNCIÓN PARA GUARDAR PEDIDO EN SAP
const Guardar = async () => {
  let numero = $.trim($("#txt_numero").val());
  let op = '';
  let numeroSAP = 0;

  if (await VerficarPedido(numero) == 0) {
    op = 'NUEVO';
  } else {
    op = 'MODIFICAR';
    numeroSAP = NumeroSAP(numero);
  }

  let BoniDatos = await ValidarBonificados(numero);
  if (parseInt(BoniDatos.Id) == 0) {
    if (numero != '' && numero > 0) {
      const result = await confirmAlert(`¿Está seguro(a) de enviar el pedido número ${numero}?`, "Después de aceptar no podrá reversar la operación!!!");
      if (result.isConfirmed) {
        try {
          LoadImg('Guardando...');
          const data = await enviarPeticion({
            op: op,
            link: "../models/WS-PW.php",
            numero: numero,
            numeroSAP: numeroSAP
          });

          if (data.Tipo == 'S') {
            Swal.fire("Excelente!", data.Msj, "success");
            activaTab("btnClientes");
            Limpiar();
            // Envio de email para usuarios
            if (numeroSAP == 0) {
              EnviarMail('P', numero);
            } else {
              EnviarMail('M', numero);
            }
            // valido si se abrio el modulo desde el 0102 
            if ($("#link_pro").val() != '0' || $("#link_pro").val() != '') {
              preLoadCliente($("#link_pro").val());
            }

            return false;
          } else {
            Swal.fire("Oops!!!", data.Msj, "error");
            return false;
          }
        } catch (error) {
          console.error(error);
        } finally {
          UnloadImg();
        }
      } else {
        Swal.fire("Cancelado", "La operación de guardado de pedido ha sido cancelada!", "error");
      }
    }
  } else {
    Swal.fire('Bonificados errados, imposible guardar', BoniDatos.Msj, 'error');
  }
}
// FUNCIÓN LISTAR ENVENTOS
const ListarEvento = async () => {
  try {
    const resp = await enviarPeticion({
      op: "S_EVENTO_LISTA",
      link: "../models/Eventos.php",
      org: $("#Organizacion").val(),
      ofi: $("#Ofi").val(),
      tipo: $("#selTipos").val()
    });

    if (resp.data.length > 0) {
      let detalle = '';
      let contDesc = 0;
      let contBoni = 0;

      resp.data.forEach(function (d, i) {
        let tipo = 'BONIFICADO';
        let img = '<i class="fa-solid fa-gifts text-primary"></i>';

        if (d.TIPO == 'DES') {
          tipo = 'DESCUENTO';
          img = `<i class="fa fa-tags text-warning"></i>`;
          contDesc++;
        } else {
          contBoni++;
        }

        detalle += `
        <div class="card mt-2 mb-2 shadow-sm card-evento">
          <div class="card-body">
            <div class="row align-items-center text-center text-md-start">
              <div class="col-12 col-md-4 mb-2 mb-md-0">
                <p class="m-0 size-text">${img} ${tipo}</p>
              </div>
              <div class="col-12 col-md-4 mb-2 mb-md-0">
                <p class="m-0 size-text">${d.GRUPO_ARTICULO} - ${d.GRUPO_DESCRIPCION}</p>
              </div>
              <div class="col-12 col-md-4">
                <button type="button" class="btn btn-success btn-sm" onClick="AddEvento('${d.GRUPO_ARTICULO}', '${d.TIPO}');">
                  <i class="fa-solid fa-circle-plus"></i> Compra aquí!
                </button>
              </div>
            </div>		
          </div>
        </div>`;
      });

      $("#ResultEventos").html(detalle);
      $("#CantDesc").val(contDesc);
      $("#CantBoni").val(contBoni);
    } else {
      let resultHTML = `
      <div class="alert alert-danger" role="alert">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span class="sr-only">Error:</span>  No existen resultados para las condiciones seleccionadas
      </div>`;
      $("#ResultEventos").html(resultHTML);
      $("#CantDesc").val(0);
      $("#CantBoni").val(0);
    }
  } catch (error) {
    console.log(error);
  }
}
// FUNCIÓN AGREGAR EVENTO
function AddEvento(grupo, tipo) {
  if ($("#txt_codigoSap").val() != '') {
    switch (tipo) {
      case 'DES':
        // $("#DvChkDctos").addClass('DivCheckBoxTrue');
        document.querySelector('#DvChkDctos').checked = true;
        break;
      case 'BON':
        // $("#DvChkBonif").addClass('DivCheckBoxTrue');
        document.querySelector('#DvChkBonif').checked = true;
        break;
    }

    $("#txt_bproductos").val($.trim(grupo));
    BuscarProductoArr(0);
    activaTab("btnProductos");
  } else {
    activaTab("btnClientes");
    parent.parent.$("#AbrirVentas").val(grupo);
    parent.parent.$("#AbrirVentasTipo").val(tipo);
    Swal.fire('Información', 'Para visualizar el evento primero debe seleccionar un cliente', 'warning');
  }
}
// FUNCIONES DE ELIMINACIÓN DE PEDIDOS - NUEVAS MODIFICACIONES PARA EDICION DE PEDIDOS
const EliminarPedido = async () => {
  let numero = $.trim($("#ped_numero").val());
  let opc = $.trim($("#ped_transferido").val());
  let numero_sap = $.trim($("#ped_numero_sap").val());
  let gestion = $.trim($("#ped_gestion").val());
  // Control de modificacion de pedidos usuarios diferentes
  let ped_usuario = $.trim($("#ped_usuario").val());
  let usuario_log = $.trim($("#UsrLogin").val());
  let sw_user = 0;
  let IdRol = $.trim($("#Rol").val());

  if (ped_usuario != usuario_log && ped_usuario != 'INTEGRACION' && IdRol != 1) sw_user = 1;

  if (sw_user == 0) {
    $("#ModalOpciones").modal("hide");
    const result = await confirmAlert(`Desea eliminar el pedido #${numero}`, "Después de aceptar no podrá reversar la operación!");
    if (result.isConfirmed) {
      if (opc == 0) EliminarPW(numero);
      else EliminarSAP(numero_sap, numero);

      if (gestion == 'T') GestionPedidos();
      else if (gestion == 'P') Temporales();

      Limpiar();
    } else {
      Swal.fire("Cancelado", "La operación ha sido cancelada!", "error");
    }
  } else {
    Swal.fire("Oops", "No es posible eliminar un pedido que fue creado por otro usuario!", "error");
  }
}
// FUNCIÓN PARA ELIMINAR PEDIDO WEB
const EliminarPW = async (numero) => {
  try {
    const result = await confirmAlert("Eliminar Pedido Web", "¿Está seguro(a) de eliminar el pedido?");
    if (!result.isConfirmed) return;

    const data = await enviarPeticion({ op: "D_PEDIDO", link: urlModel, numero });

    if (data == 0) {
      Swal.fire("Excelente", "Pedido eliminado correctamente!", "success");
      Temporales();
      Limpiar(); 
      activaTab('btnClientes');
    } else {
      Swal.fire("Error", "Error al intentar eliminar pedido!", "error");
    }
  } catch (error) {
    console.log(error);
  }
}
// FUNCIÓN PARA ELIMINAR PEDIDO SAP
const EliminarSAP = async (numero_sap, numero) => {
  try {
    const result = await confirmAlert("Eliminar Pedido SAP", "¿Está seguro(a) de eliminar el pedido?");
    if (!result.isConfirmed) return;

    const data = await enviarPeticion({ op: "ELIMINAR", link: "../models/WS-PW.php", numero: numero_sap });

    if (data.Tipo != 'S') {
      Swal.fire("Error", data.Msj, "error");
    } else {
      EnviarMailAnulacion('E', numero, 'Pedido eliminado');
      EliminarPW(numero);
    }
  } catch (error) {
    console.log(error);
  }
}
// FUNCIÓN DE RASTREO DE PEDIDOS
const Rastreo = async () => {
  if ($("#ped_numero_sap").val() != '' && $("#ped_numero_sap").val() > 0) {
    try {
      const numero = $("#ped_numero_sap").val();
      const data = await enviarPeticion({ op: "TRAZABILIDAD", link: "../models/RastreoPedido.php", numero });
      const item = data[0];
      if (data.length) {
        $("#txt_org").html(item.ORG);
        $("#txt_bodega").html(item.BODEGA);
        $("#txt_nit2").html(item.NIT);
        $("#txt_cod_sap").html(item.CODIGO_SAP);
        $("#txt_nombres").html(item.NOMBRES + '-' + item.RAZON_COMERCIAL);
        $("#txt_direccion").html(item.DIRECCION);
        $("#txt_num_ped").html(item.NUMERO);
        $("#txt_usuario_ped").html(item.USUARIO);
        $("#txt_fecha_ped").html(item.FECHA_PEDIDO);
        $("#txt_usuario_ot").html(item.USUARIO_OT);

        $("#txt_num_ent").html(item.NUMERO_ENTREGA);
        $("#txt_usuario_ent").html(item.USUARIO_ENTREGA);
        $("#txt_fecha_ent").html(item.FECHA_ENTREGA);

        $("#txt_usuario_sep").html(item.USUARIO_SEPARA);
        $("#txt_numero_ot").html(item.NUMERO_OT);
        $("#txt_fecha_ot").html(item.FECHA_OT);
        $("#txt_fecha_ini_ot").html(item.INI_SEP);
        $("#txt_fecha_fin_ot").html(item.FIN_SEP);

        $("#txt_usuario_fact").html(item.USUARIO_FACT);
        $("#txt_numero_fact").html(item.NUMERO_FACT);
        $("#txt_fecha_ini_fact").html(item.INI_FACT);
        $("#txt_fecha_fin_fact").html(item.FIN_FACT);

        $("#txt_usuario_emp").html(item.USUARIO_EMPAQUE);
        $("#txt_fecha_ini_emp").html(item.FINI_EMPAQUE);
        $("#txt_fecha_fin_emp").html(item.FFIN_EMPAQUE);
        $("#txt_bolsas_emp").html(item.N_BOLSAS);
        $("#txt_paquetes_emp").html(item.N_PAQUETES);
        $("#txt_cajas_emp").html(item.N_CAJAS);

        $("#txt_").html(item.USUARIO_DESP);
        $("#txt_fhini_ent").html(item.INI_TRANS);
        $("#txt_fhfin_ent").html(item.FIN_TRANS);
        $("#txt_guia").html(item.GUIA);
        $("#txt_nota").html(item.NOTA_ENTREGA);

        $("#ModalRastreo").modal("show");
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    Swal.fire('Oops', 'No es posible rastrear un pedido temporal', 'warning');
  }
}
// FUNCIÓN ENTREGAS
async function Entregas() {
  const Num = $.trim($("#ped_entrega").val());
  const NumTmp = $.trim($("#ped_numero").val());
  const numero = $.trim($("#ped_numero_sap").val());
  try {
    if (Num == '0') {
      const result = await confirmAlert("El pedido no posee entrega... ¿Desea crearla?", "Después de aceptar no podrá reversar la operación");
      if (result.isConfirmed) {
        const data = await enviarPeticion({op: 'CREA_ENTREGAS', link: "../models/WS-PW.php", numero});
        if (data.Tipo != 'S') {
          Swal.fire("Error", data.Msj, "error");
        } else {
          $('#ModalOpciones').modal("hide");
          Swal.fire("Excelente", data.Msj, "success")
          .then((result) => {
            if (result.isConfirmed) {
              $('#ModalOpciones').modal("show");
            }
          });
        }

        setTimeout(function () {
          Temporales(); // Temporales propios
          GestionPedidos(); // Temporales de terceros 
          consultaOpciones(NumTmp); // Actualizacion de datos en modal
        }, 2000);

      } else {
        Swal.fire("Cancelado", "La operación ha sido cancelada", "error");
      }
    } else {
      const data = await enviarPeticion({ op: 'S_ENTREGA', link: urlModel, numero});
      if (data.length) {
        let detalle = '';
        let clas = '';
        let icon = '';
        let Pneto = 0;
        let PnetoIva = 0;

        data.forEach(item => {
          if (parseInt(item.ENTREGA) == 0) {
            clas = 'class="text-danger"';
            icon = '<i class="fa-solid fa-circle-xmark"></i>'
          } else if (parseInt(item.CANTIDAD) < parseInt(item.CANT_PED)) {
            clas = 'class="text-warning"';
            icon = '<i class="fa-solid fa-triangle-exclamation"></i>'
          } else {
            clas = '';
            icon = '';
          }

          detalle += `
          <tr ${clas}>
            <td class="size-td vertical">${item.POSICION}</td>
            <td class="size-td vertical">${item.CODIGO_MATERIAL}</td>
            <td class="size-td vertical">${icon} ${item.DESCRIPCION}</td>
            <td class="vertical"><input type="text" value="${item.CANTIDAD}" class="form-control form-control-sm" size="2%"></td>
            <td class="size-td vertical">${item.CANT_PED}</td>
            <td class="size-td vertical">${item.DESCUENTO}%</td>
            <td class="size-td vertical">${item.ENTREGA}</td>
            <td class="vertical" align="center"><input type="checkbox"></td>
            <td class="size-td vertical">${item.STOCK}</td>
          </tr>`;
          Pneto = Pneto + parseFloat((item.PNETO));
          PnetoIva = PnetoIva + parseFloat((item.PNETO_IVA));
        });
        $("#tdDetalleEntregas").html(detalle);
        $("#ModalOpciones").modal("hide");
        $("#ModalEntregas").modal("show");
        $("#valor_entrega").html(`VALOR ENTREGADO SIN IVA: <span style="font-size: 16px"><strong>${formatNum(Pneto, '$')}</strong></span>`);
        $("#valor_entrega_iva").html(`VALOR ENTREGADO: <span style="font-size: 16px"><strong>${formatNum(PnetoIva, '$')}</strong></span>`);
      }      
    }
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN ELIMNAR ENTREGA
async function EliminarEntrega() {
  const numero = $.trim($("#ped_entrega").val());
  try {
    const result = await confirmAlert("Eliminar Entrega", "¿Está seguro(a) de eliminar la entrega?");
    if (!result.isConfirmed) return;
    const data = await enviarPeticion({op: "ELIMINA_ENTREGAS", link: "../models/WS-PW.php", numero});
    if (data.Tipo != 'S') {
      Swal.fire("Error", data.Msj, "error");
    } else {
      Swal.fire("Excelente", data.Msj, "success");
      setTimeout(() => {
        Temporales();  // Temporales propios      
        GestionPedidos(); // Temporales de terceros        
      }, 2000);
      $("#ModalEntregas").modal("hide");
    }   
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN MODIFICAR ENTREGA
async function ModificarEntrega() {
  let entrega = $.trim($("#ped_entrega").val());
  let detalle = new Array();
  let d1 = "", d2 = "", d3 = "", d4 = "", d5 = "", d6 = "";

  $("#tdDetalleEntregas tr").each(function (index, element) {
    d1 = $.trim($(this).find("td").eq(0).html());
    d2 = $.trim($(this).find("td").eq(1).html());
    d3 = $.trim($(this).find("td").eq(3).find("input").val());
    d5 = $.trim($(this).find("td").eq(4).html());
    d6 = $.trim($(this).find("td").eq(8).html());

    if ($(this).find("td").eq(7).find("input").prop('checked')) d4 = 'X';
    else d4 = '';

    if (d1 != 0) {
      det = {
        Posicion: d1,
        Material: d2,
        Cantidad: d3,
        Eliminar: d4,
        Pedido: d5,
        Stock: d6
      }
      detalle.push(det);
    }
  });

  let  proceder = 0;
  detalle.forEach(item => {
    if (parseInt(item.Cantidad) > parseInt(item.Stock)) proceder = 1;
    if (parseInt(item.Cantidad) > parseInt(item.Pedido)) proceder = 2;
  });
  
  if (proceder == 0) {
    try {
      const data = await enviarPeticion({
        op: 'MODIFICA_ENTREGAS',
        link: "../models/WS-PW.php",
        entrega: entrega,
        detalle: JSON.stringify(detalle)
      });

      if (data.Tipo != 'S') Swal.fire("Error", data.Msj, "error");
      else Swal.fire("Excelente", data.Msj, "success");
    } catch (error) {
      console.error(error);
    }
  } else {
    $("#ModalEntregas").modal("hide");
    if (proceder == 1) Swal.fire("Operación Cancelada", "No es posible actualizar un producto en donde la cantidad es mayor al stock ", "error");
    if (proceder == 2) Swal.fire("Operación Cancelada", "No es posible que la cantidad entregada sea superior a la cantidad pedida ", "error");
  }
}
// FUNCIÓN PRIORIDAD OT
async function Prioridad_ot(ot, almacen, despacho, punto) {
  try {
    const data = await enviarPeticion({
      op: 'Prioridad_ot',
      link: urlModel,
      ot: ot,
      almacen: almacen,
      recojeDespachos: despacho, // Cambiado de 'despacho' a 'recojeDespachos'
      recojePuntoVenta: punto // Cambiado de 'punto' a 'recojePuntoVenta'
    });

    if (data.Tipo != 'S') console.log("Error" + data.Msj);
    else console.log("Exito" + data.Msj);
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN ORDENES
async function Ordenes() {
  let entrega = $.trim($("#ped_entrega").val());
  let NumTmp = $.trim($("#ped_numero").val());
  let pedidoBodega = $.trim($("#ped_bodega").val());
  let almacen = '';

  switch (pedidoBodega) {
    case '1100':
      almacen = 'D01';
      break; // Monteria
    case '1200':
      almacen = 'C01';
      break; // Cartagena 
    case '2100':
      almacen = 'M01';
      break; // Medellin
    case '2200':
      almacen = 'B01';
      break; // Bogota
    case '2300':
      almacen = 'L01';
      break; // Cali
    case '2400':
      almacen = 'R01';
      break; // Barranquilla
  }

  let htmlConfirm = `
  <div style="text-align: left; margin-top: 20px;">
    <label style="display: block; margin-bottom: 10px; text-align: center;">
        <input type="checkbox" id="recojeDespachos" name="recojeDespachos"> 
        Recoge en Despachos
    </label>
    ${pedidoBodega == '1100' ?
  `<label style="display: block; text-align: center;">
        <input type="checkbox" id="recojePuntoVenta" name="recojePuntoVenta"> 
        Recoge en Punto de venta
    </label>` : ''}
  </div>`;
  
  if (entrega != 0 && entrega != '') {
    let Num = $.trim($("#ped_ot").val());
    if (Num == '0') {
      // Configuración inicial del Swal con checkboxes dinámicos
      let swalOptions = {
        title: "El pedido no posee orden de transporte... ¿Desea crearla?",
        text: "Después de aceptar no podrá reversar la operación!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        html: htmlConfirm,
        preConfirm: () => {
          return {
            recojeDespachos: document.getElementById('recojeDespachos').checked,
            recojePuntoVenta: (pedidoBodega == '1100') ? document.getElementById('recojePuntoVenta').checked : false
          }
        }
      };

      Swal.fire(swalOptions).then(async result => {
        if (result.value) {
          try {
            const opcionesRecojo = result.value;
            console.log('Opciones seleccionadas:', opcionesRecojo);

            const data = await enviarPeticion({
              op: "CREA_ORDENES",
              link: "../models/WS-PW.php",
              almacen: almacen,
              entrega: entrega,
              recojeDespachos: opcionesRecojo.recojeDespachos ? "1" : "0",
              recojePuntoVenta: opcionesRecojo.recojePuntoVenta ? "1" : "0"
            });

            if (data.Tipo != 'S') {
              Swal.fire("Error", data.Msj, "error");
            } else {
              let rdespa = opcionesRecojo.recojeDespachos ? '1' : '0';
              let rpunto = opcionesRecojo.recojePuntoVenta ? '1' : '0';
              $('#ModalOpciones').modal("hide");
              Swal.fire("Excelente", data.Msj, "success")
                .then((result) => {
                  if (result.isConfirmed) {
                    $('#ModalOpciones').modal("show");
                  }
                });

              setTimeout(function () {
                Temporales(); // Temporales propios                  
                GestionPedidos(); // Temporales de terceros                  
                consultaOpciones(NumTmp, almacen, rdespa, rpunto); // Actualización de datos en modal
              }, 2000);
            }

          } catch (error) {
            console.error(error);
          }
        } else {
          Swal.fire("Cancelado", "La operacion ha sido cancelada!", "error");
        }
      });
    } else {
      try {
        let detalle = '';
        let clas = '';
        let Pneto = 0;
        const data = await enviarPeticion({ op: 'S_ORDEN', link: urlModel, numero: Num });
        data.forEach(item => {
          if (parseInt(item.ENTREGA) == 0) {
            clas = 'class="alert-danger"';
          }

          detalle += `
          <tr ${clas}>
            <td class="size-td vertical">${item.posicion_ot}</td>
            <td class="size-td vertical">${item.codigo_material}</td>
            <td class="size-td vertical">${item.descripcion}</td>
            <td class="vertical"><input type="text" value="${item.cantidad}" class="form-control form-control-sm size-td" size="2%"></td>
            <td class="size-td vertical">${item.lote}</td>
            <td class="size-td vertical">${item.numero_ot}</td>
            <td class="size-td vertical" align="center"><input type="checkbox"/></td>
          </tr>`;
          Pneto += parseFloat((item.pneto));
        });

        $("#tdDetalleOrdenes").html(detalle);
        $("#ModalOpciones").modal("hide");
        $("#ModalOrdenes").modal("show");
        $("#valor_orden").html(`VALOR ORDEN: <span style="font-size: 16px"><strong>${formatNum(Pneto, '$')}</strong></span>`);
      } catch (error) {
        console.error(error);
      }
    }
  } else {
    Swal.fire("Error", "El pedido no tiene entrega, no se puede generar OT", "error");
  }
}
// FUNCIÓN ELIMINAR OT
async function EliminarOT() {
  let almacen = '';
  let pedidoBodega = $.trim($("#ped_bodega").val());
  switch (pedidoBodega) {
    case '1100':
      almacen = 'D01';
      break; // Monteria
    case '1200':
      almacen = 'C01';
      break; // Cartagena 
    case '2100':
      almacen = 'M01';
      break; // Medellin
    case '2200':
      almacen = 'B01';
      break; // Bogota
    case '2300':
      almacen = 'L01';
      break; // Cali
  }
  try {
    const result = await confirmAlert("Eliminar OT", "¿Está seguro(a) de eliminar la OT?");
    if (!result.isConfirmed) return;
  
    const data = await enviarPeticion({
      op: 'ELIMINA_OT',
      link: "../models/WS-PW.php",
      ot: $.trim($("#ped_ot").val()),
      alm: almacen
    });
  
    if (data.Tipo != 'S') {
      Swal.fire("Error", data.Msj, "error");
    } else {
      Swal.fire("Excelente", data.Msj, "success");      
      Temporales(); // Temporales propios      
      GestionPedidos(); // Temporales de terceros
      $("#ModalOrdenes").modal("hide");
    }    
  } catch (error) {
    console.error(error);
  }  
}
// GESTIÓN DE PEDIDOS DE TERCEROS
function LimpiarGestionPedido() {
  ZonasVentas();
  $("#txtCodigoSAP").val('');
  $("#txtCliente").val('');
  $("#txtFecha1,#txtFecha2").val(FechaActual());
  $("#DvRecuperablesTerceros").html('');
  $("#VtotalTerceros").html('');
}
// FUNCIÓN GESTIÓN DE PEDIDOS
const GestionPedidos = async () => {
  const link = urlModel;
  let zona = $("#txtZonas").val();
  const codigo = $("#txtCodigoSAP").val().trim();
  const fh1 = $("#txtFecha1").val().trim();
  const fh2 = $("#txtFecha2").val().trim();
  const clase = $("#txtClasePedido").val().trim();
  const oficina = $("#FiltroOficinaVentas").val().trim();
  let data = undefined;

  zona = (!zona) ? "210093" : zona;

  let TemporalesHistoria = $("#txtTemporalesHistoria").val();
  const dataPeticion = { link, zona, codigo, fh1, fh2, clase, oficina };

  let cont = 0;
  let total = 0;

  let headerTabla = `
  <div class="d-flex flex-wrap justify-content-center justify-content-md-between align-items-center gap-2 mb-1">
    <div style="background-color: #cff4fc; border: 1px solid #9eeaf9; padding: 5px 15px; color: #055160; font-weight: 500; border-radius: 3px;" id="VtotalTerceros"></div>
    <div>
      <button type="button" class="btn btn-sm btn-danger mb-1" onClick="FiltrosTipoPedidos('T')"><b>T</b><span class="btn-text">emporal</span></button>
      <button type="button" class="btn btn-sm btn-warning mb-1" onClick="FiltrosTipoPedidos('P')"><b>P</b><span class="btn-text">edido</span></button>
      <button type="button" class="btn btn-sm btn-success mb-1" onClick="FiltrosTipoPedidos('E')"><b>E</b><span class="btn-text">ntrega</span></button>
      <button type="button" class="btn btn-sm btn-info mb-1" onClick="FiltrosTipoPedidos('O')"><b>O</b><span class="btn-text">rden</span></button>
      <button type="button" class="btn btn-sm btn-primary mb-1" onClick="FiltrosTipoPedidos('F')"><b>F</b><span class="btn-text">actura</span></button>
      <button type="button" class="btn btn-sm btn-light btn-micro mb-1" onClick="FiltrosTipoPedidos('A')"><b>TODOS</b></button>
    </div>
  </div>
  <table class="display" width="100%" id="tableRescueTerceros">
    <thead>
      <tr class="bag-info">
        <th class="size-th no-wrap">FECHA/HORA</th>
        <th class="size-th no-wrap">BODEGA</th>
        <th class="size-th no-wrap">CLASE/NÚMERO</th>
        <th class="size-th no-wrap">NOMBRES</th>
        <th class="size-th no-wrap">VALOR</th>
        <th class="size-th no-wrap">DESTINATARIO</th>
        <th class="size-th no-wrap">TRANSFERIDO</th>
        <th class="size-th no-wrap">OPCIONES</th>
        <th class="size-th no-wrap">TIPO</th>
      </tr>
    </thead>
    <body>`;

  if (TemporalesHistoria == 'N') {
    try {
      LoadImg('Cargando pedidos...');
      data = await enviarPeticion({ op: "S_GESTION_PEDIDOS", ...dataPeticion });
      if (data.length) {
        data.forEach(item => {
          let transfer = '';
          let btnText = '';
          if (item.transferido == 1) {
            if ($.trim(item.entrega) != '0') {
              if ($.trim(item.ot) != '0') {
                if ($.trim(item.factura) != '0') {
                  transfer = `
                    <button type="button" class="btn btn-primary btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${item.numero_sap}','success');">
                      <span aria-hidden="true"><b>F</b></span>
                    </button>`;
                  btnText = 'F';
                } else {
                  transfer = `
                    <button type="button" class="btn btn-info btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${item.numero_sap}','success');">
                      <span aria-hidden="true"><b>O</b></span>
                    </button>`;
                  btnText = 'O';
                }
              } else {
                transfer = `
                  <button type="button" class="btn btn-success btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${item.numero_sap}','success');">
                    <span aria-hidden="true"><b>E</b></span>
                  </button>`;
                btnText = 'E';
              }
            } else {
              if ($.trim(item.sol_desbloqueo) != '') {
                let estado_sol_des = "";
                switch (item.sol_desbloqueo) {
                  case "0":
                    estado_sol_des = '<i class="fa-solid fa-lock text-warning" title="Solicitud enviada"></i>';
                    break;
                  case "1":
                    estado_sol_des = '<i class="fa-solid fa-lock text-info"  title="Solicitud en revision"></i>';
                    break;
                  case "2":
                    estado_sol_des = '<i class="fa-solid fa-lock text-danger"  title="Solicitud rechazada"></i>';
                    break;
                  case "3":
                    estado_sol_des = '<i class="fa-solid fa-circle-check text-success fa-bea"  title="Solicitud aprobada"></i>';
                    break;
                }
                transfer += `
                  <button onclick="MostrarEstadoSolDesbloqueo(${item.numero_sap})" class="btn btn-default">
                    ${estado_sol_des}
                  </button>`;
                btnText = ''
              } else {
                transfer = `
                  <button type="button" class="btn btn-warning btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${item.numero_sap}','success');">
                    <span aria-hidden="true"><b>P</b></span>
                  </button>`;
                btnText = 'P';
              }
            }
          } else {
            transfer = `
              <button type="button" class="btn btn-danger btn-sm" onClick="Swal.fire('Oops', 'Pendiente por transferir', 'error');">
                <span aria-hidden="true"><b>T</b></span>
              </button>`;
            btnText = 'T';
          }

          item.cliente = item.cliente.replace(/'/g, '');
          item.cliente = item.cliente.replace(/"/g, '');

          headerTabla += `
          <tr>
            <td class="size-td no-wrap">${item.fecha_pedido}</td>
            <td class="no-wrap" style="font-size: 12px">${item.bodega}</td>
            <td class="size-td no-wrap">${item.clase} - ${item.numero_sap}</td>
            <td class="p-0 size-td no-wrap">
              <p class="no-wrap" style="margin: 0; font-size: 12px">${item.cliente}</p>
              <small class="no-wrap" style="font-weight: bold;">Zona ventas: 
                <span class="text-primary" style="font-size: 8px;">${item.zona_ventas} - ${item.zona_descripcion}</span>
              </small>
            </td>
            <td class="size-td no-wrap">${formatNum(item.valor_total, '$')}</td>
            <td class="size-td no-wrap">${item.destinatario}</td>
            <td align="center" width="4%">${transfer}</td>
            <td align="center" width="4%">
              <button type="button" class="btn btn-outline-primary btn-sm" style="font-weight: bolder; font-size: 15px;" onClick="AbrirOpciones('${item.numero.trim()}', '${item.valor_total.trim()}', '${item.codigo_direccion.trim()}', '${item.direccion.trim()}', '${item.oficina_ventas.trim()}', '${item.codigo_sap.trim()}', '${item.transferido.trim()}', '${item.entrega.trim()}', '${item.ot.trim()}', '${item.numero_sap.trim()}', '${item.factura.trim()}', 'T', '${item.notas.trim()}', '${item.usuario.trim()}', '${item.destinatario.trim()}', '${item.cliente.trim()}');" title="Menu de opciones">
                <i class="fa-solid fa-grip" style="font-size: 16px"></i>
              </button>
            </td>
            <td>${btnText}</td>
          </tr>`;

          cont++;
          total += parseFloat(item.valor_total);
        });
        headerTabla += `</tbody></table>`;
        // $("#VtotalTerceros").html(`<div class="alert alert-info" role="info"><b>VALOR TOTAL: ${formatNum(total, '$')}</b></div>`);
        $("#DvRecuperablesTerceros").html(headerTabla);
        $("#VtotalTerceros").html(`<p class="m-0">VALOR TOTAL: <span style="font-size: large; font-weight: 700;">${formatNum(total, '$')}</span></p>`);
      } else {
        $("#VtotalTerceros").html('');
        let msgHtml = `
        <div class="alert alert-danger" role="alert">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
        </div>`;
        $("#DvRecuperablesTerceros").html(msgHtml);
      }
    } catch (error) {
      console.error(error);
    } finally {
      UnloadImg();
    }
  } else {
    try {
      data = await enviarPeticion({ op: "S_GESTION_PEDIDOS_HISTORIA", ...dataPeticion });
      if (data.length) {
        data.forEach(item => {
          headerTabla += `
            <tr>
              <td class="size-td no-wrap">${item.fecha_pedido}</td>
              <td class="size-td no-wrap">${item.bodega}</td>
              <td class="size-td no-wrap">${item.clase} ' - ' ${item.numero}</td>
              <td class="size-td no-wrap">${item.cliente}</td>
              <td class="size-td no-wrap">${formatNum(item.valor_total, '$')}</td>
              <td class="size-td no-wrap">${item.destinatario}</td>
              <td class="size-td no-wrap" align="center" width="4%">
                <button type="button" class="btn btn-danger btn-sm">
                  <i class="fa-regular fa-clock"></i>
                </button>
              </td>
              <td align="center" width="4%">
                <button type="button" class="btn btn-light btn-micro btn-sm" onClick="RecuperarHistorico(${$.trim(item.numero)})">
                  <i class="fa-solid fa-right-left"></i>
                </button>
              </td>
              <td>T</td>
            </tr>`;

          cont++;
          total += parseFloat(item.valor_total);
        });
        headerTabla += `</tbody></table>`;
        $("#VtotalTerceros").html(`<p class="m-0">VALOR TOTAL: <span style="font-size: large; font-weight: 700;">${formatNum(total, '$')}</span></p>`);
        $("#DvRecuperablesTerceros").html(headerTabla);
      } else {
        $("#VtotalTerceros").html('');
        let msgHtml = `
          <div class="alert alert-danger" role="alert">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
          </div>`;
        $("#DvRecuperablesTerceros").html(msgHtml);
      }
    } catch (error) {
      console.error(error);
    } finally {
      UnloadImg();
    }
  }

  if (data.length) {
    $('#tableRescueTerceros').DataTable({
      dom: 'lrtip',
      searching: true,
      paging: false,
      ordering: true,
      info: false,
      responsive: true,
      scrollX: true,
      columnDefs: [
        { targets: [7], orderable: false },
        { targets: [8], visible: false }
      ],
      language: {
        zeroRecords: "No se encontraron registros",
        infoEmpty: "No hay registros disponibles"
      }
    });
  }
}
// FUNCIÓN RECUPERAR HISTÓRICOS
async function RecuperarHistorico(numero) {
  try {
    const result = await confirmAlert(`¿Está seguro(a) de restablecer el pedido temporal número ${numero}?`, "Tenga presente que las condiciones (Precios, Descuentos, Bonificaciones) serán recalculadas a la fecha actual");
    if (result.isConfirmed) {
      LoadImg('Restaurando...');
      const data = await enviarPeticion({op: "G_PEDIDOS_HISTORIA_TMP", link: urlModel, numero});
      if (!data.error) {
        Swal.fire("Excelente", data.mensaje, "success");
      } else {
        Swal.fire("Oops", data.mensaje, "error");
      }
      GestionPedidos();
    } else {
      Swal.fire("Cancelado", "Operación cancelada por el usuario", "warning");
    }    
  } catch (error) {
    console.error(error);
  } finally {
    UnloadImg();
  } 
}
// FUNCIÓN GUARDAR DIRECTO
async function GuardarDirecto() {
  let numero = $("#ped_numero").val();
  let numeroSAP = 0;
  let op = '';
  
  if (await VerficarPedido(numero) == 0) {
    op = 'NUEVO';
  } else {
    op = 'MODIFICAR';
    numeroSAP = NumeroSAP(numero);
  }

  let BoniDatos = await ValidarBonificados(numero);
  if (parseInt(BoniDatos.Id) == 0) {
    const result = await confirmAlert(`¿Está seguro de enviar el pedido número ${numero}?`, "Después de aceptar no podrá reversar la operación");
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Guardando...',
        html: '<img src="../resources/icons/preloader.gif" width="300px" heigth="300px">',
        showConfirmButton: false
      });
      const data = await enviarPeticion({op: op, link: "../models/WS-PW.php", numero, numeroSAP});
      if (data.Tipo == 'S') {
        Swal.fire("Excelente!", data.Msj, "success");
        setTimeout(function () {          
          Temporales(); // Temporales propios          
          GestionPedidos(); // Temporales de terceros          
          consultaOpciones(numero); // Actualizacion de datos en modal
        }, 2000);
        return false;
      } else {
        Swal.fire("Oops!!!", data.Msj, "error");
        return false;
      }
    } else {
      Swal.fire("Cancelado", "La operación de guardado de pedido ha sido cancelada!", "warning");
    }   
  } else {
    Swal.fire('Bonificados errados, imposible guardar', BoniDatos.Msj, 'error');
  }
}
// FUNCIÓN PARA GESTIONAR ENTREGAS
const GestionEntregas = async () => {
  if ($.trim($("#CodigoSAPEntregas").val()) != '') {
    try {
      LoadImg('Cargando...');
      const data = await enviarPeticion({
        op: "S_ENTREGAS",
        link: urlModel,
        oficina: $.trim($("#OficinaEntregas").val()),
        codigo: $.trim($("#CodigoSAPEntregas").val()),
        fh1: $.trim($("#EntregasFecha1").val()),
        fh2: $.trim($("#EntregasFecha2").val())
      });

      if (data.length) {
        let tabla = `
        <table class="display" width="100%" id="tableEntregas">
          <thead>
            <tr>
              <th>Numero</th>
              <th>Fecha</th>
              <th>Clase</th>
              <th>Usuario</th>
              <th>Valor</th>
              <th>Add</th>
              <th>CodDir</th>
            </tr>
          </thead>
          <body>`;

        data.forEach(item => {
          tabla +=
            `<tr>
            <td>${item.numero}</td>
            <td>${item.fecha_pedido}</td>
            <td>${item.clase}</td>
            <td>${item.usuario}</td>
            <td>${formatNum(item.valor, '$')}</td>
            <td align="center">
              <label class="contenedor">
              <input type="checkbox">
              <span class="checkmark"></span>
              </label>
            </td>
            <td>${item.cod_direccion}</td>
          </tr>`;
        });
        tabla += `</body></table>`;
        $("#DvListaEntregas").html(tabla);

        $('#tableEntregas').DataTable({
          paging: false,
          searching: false,
          ordering: true,
          info: false,
          responsive: true,
          scrollX: true,
          language: {
            zeroRecords: "No se encontraron registros",
            infoEmpty: "No hay registros disponibles"
          }
        });
      } else {
        let msgHtml = `
        <div class="alert alert-danger" role="alert">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
        </div>`;
        $("#DvListaEntregas").html(msgHtml);
      }
    } catch (error) {
      console.log(error);
    } finally {
      UnloadImg();
    }
  } else Swal.fire('Error', 'Debe seleccionar un cliente', 'error');
}
// FUNCIÓN LIMPIAR ENTREGAS
function LimpiarEntregas() {
  $("#ClienteEntregas").val('');
  $("#CodigoSAPEntregas").val('');
  $("#DvListaEntregas").html('');
  $("#ClienteEntregas").focus();
}
// FUNCIÓN PARA UNIFICAR ENTREGAS
const UnificarEntrega = async () => {
  let numeros = '';
  let CodDir = 0;
  let ContDir = 0;
  $("#tableEntregas tr:gt(0)").each(function (index, element) {
    if ($(this).find("td").eq(5).find("input").is(":checked")) {
      numeros += $.trim($(this).find("td").eq(0).html()) + ',';

      if (CodDir != parseInt($.trim($(this).find("td").eq(6).html()))) {
        ContDir++;
      }
      CodDir = parseInt($.trim($(this).find("td").eq(6).html()));
    }
  });

  if (ContDir > 1) {
    Swal.fire("No es posible crear una entrega unificada", "Los pedidos seleccionados poseen direcciones de despacho diferentes", "error");
  } else {
    if (numeros != '') {
      try {
        LoadImg('Cargando...');
        const data = await enviarPeticion({ op: "UNIFICA_ENTREGAS", link: "../models/WS-PW.php", numeros });
        if (data.Tipo == 'S') {
          const result = await confirmAlert(`${data.Msj}, desea generar la OT?`, "Despues de aceptar no podra reversar la operación!");
          if (result.isConfirmed) {
            let entrega = data.Msj.replace(/\D/g, '');
            let almacen = '';
            switch ($.trim($("#OficinaEntregas").val())) {
              case '1100':
                almacen = 'D01';
                break; // Monteria
              case '1200':
                almacen = 'C01';
                break; // Cartagena 
              case '2100':
                almacen = 'M01';
                break; // Medellin
              case '2200':
                almacen = 'B01';
                break; // Bogota
              case '2300':
                almacen = 'L01';
                break; // Cali
              case '2400':
                almacen = 'R01';
                break; // Barranquilla
            }
            const data = await enviarPeticion({ op: "", link: "", almacen, entrega });
            if (data.Tipo != 'S') {
              Swal.fire("Error", data.Msj, "error");
            } else {
              Swal.fire("Excelente", data.Msj, "success");
            }
            GestionEntregas();
          } else {
            Swal.fire("Cancelado", "La operación de guardado de pedido ha sido cancelada!", "error");
          }
        } else {
          Swal.fire("Oops..!", data.Msj, "error");
          return false;
        }
      } catch (error) {
        console.log(error);
      } finally {
        UnloadImg();
      }
    } else {
      Swal.fire('Error', 'Debe seleccionar por lo menos una entrega', 'error');
    }
  }
}
// FUNCIONES CORTAS PARA MOSTRAR ARCHIVOS
function ExcelFactura(num) {
  if (num != 0 && num != '') window.open("../resources/Excel/ExcelFactura.php?num=" + num);
  else Swal.fire('Error', 'El pedido no posee factura.', 'error');
}

function ExcelPedido(num) {
  if (num != 0 && num != '') window.open("../resources/Excel/ExcelPedido.php?num=" + num);
  else Swal.fire('Error', 'El pedido no posee pedido SAP.', 'error');
}

function ExcelEntrega(numE, numP) {
  if (numE != 0 && numE != '') window.open("../resources/Excel/ExcelEntrega.php?num=" + numP);
  else Swal.fire('Error', 'El pedido no posee pedido SAP.', 'error');
}

function ExcelOrden(num) {
  if (num != 0 && num != '') window.open("../resources/Excel/ExcelOrden.php?num=" + num);
  else Swal.fire('Error', 'El pedido no posee pedido SAP.', 'error');
}

function TxtFactura(num) {
  if (num != 0 && num != '') window.open("../resources/TXT/TxtFactura.php?num=" + num);
  else Swal.fire('Error', 'El pedido no posee factura.', 'error');
}
// FUNCIÓN LISTAR FACTURAS
const ListarFacturas = async () => {
  let DepId = $.trim($("#Dpto").val());
  let codigo = '';

  if (DepId != 10) {
    codigo = $("#txtFactCodigoCliente").val();
  } else {
    codigo = $("#txt_codigoSap").val();
  }

  let fh1 = $("#txtFactFecha1").val();
  let fh2 = $("#txtFactFecha2").val();
  let fact = $("#txtNumFact").val();

  if ((codigo != '') || (fact != '')) {
    try {
      const data = await enviarPeticion({ op: "S_FACTURAS", link: urlModel, codigo, fh1, fh2, fact });
      if (data.length) {
        let tabla = `
          <table class="display" width="100%" id="tableEntregas">
            <thead>
              <tr>
                <th>Factura</th>
                <th>Oficina</th>
                <th>Codigo</th>
                <th>Nombres</th>
                <th>Razon</th>
                <th>Fecha</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Exportar</th>
              </tr>
            </thead>
            <body>`;
        let total = 0;
        let iva = 0;
        let subtotal = 0;

        data.forEach(item => {
          tabla += `
                <tr>
                  <td>${item.NUMERO_FACTURA}</td>
                  <td>${item.OFICINA_VENTAS}</td>
                  <td>${item.CODIGO_SAP}</td>
                  <td>${item.NOMBRES}</td>
                  <td>${item.RAZON_COMERCIAL}</td>
                  <td>${item.FECHA_HORA}</td>
                  <td>${formatNum(item.VALOR, '$')}</td>
                  <td>${formatNum(item.IVA, '$')}</td>
                  <td>${formatNum(item.TOTAL, '$')}</td>
                  <td>
                    <div class="btn-group" role="group" aria-label="...">
                      <button class="btn btn-success btn-sm" onClick="ExcelFactura('${item.NUMERO_FACTURA}');">XLS</button>
                      <button class="btn btn-danger btn-sm"  onClick="VisualizarFactura('${item.NUMERO_FACTURA}');">PDF</button>
                      <button class="btn btn-default btn-sm" onClick="TxtFactura('${item.NUMERO_FACTURA}');">TXT</button>
                    </div>
                  </td>
                </tr>`;
          subtotal += parseFloat(item.VALOR);
          iva += parseFloat(item.IVA);
          total += parseFloat(item.TOTAL);
        });

        tabla += `</body></table>`;
        $("#DvListaFacturas").html(tabla);
        let totalHTML = `
            <div class="alert alert-info" role="info">
              <div class="container">
                <div class="row">
                <div class="col-md-4"><b>SUBTOTAL: </b>${formatNum(subtotal, '$')}</div>
                <div class="col-md-4"><b>VALOR IVA: </b>${formatNum(iva, '$')}</div>
                <div class="col-md-4"><b>VALOR TOTAL: </b>${formatNum(total, '$')}</div>
                </div>
              </div>
            </div>`;
        $("#VtotalFacturas").html(totalHTML);
      } else {
        let msgHtml = `
        <div class="alert alert-danger" role="alert">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
        </div>`;
        $("#VtotalFacturas").html('');
        $("#DvListaFacturas").html(msgHtml);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    Swal.fire('Error', 'Debe seleccionar un cliente', 'error');
  }
}
// FUNCIONES DE LIMPIEZA
function LimpiarFacturas() {
  $("#DvListaFacturas").html('');
  $("#txtFactCodigoCliente").val('');
  $("#txtFactCliente").val('');
  $("#txtNumFact").val('');
  $("#VtotalFacturas").html('');
  $("#txtNumFact").focus();
}

function LimpiarFaltantes() {
  $("#txtFaltanteCodigoCliente").val('');
  $("#txtFaltanteCliente").val('');
  $("#VtotalFaltante").html('');
  $("#DvListaFaltante").html('');
  $("#txtFaltanteCliente").focus();
}
// FUNCIÓN FALTANTES
const Faltante = async () => {
  let DepId = $.trim($("#Dpto").val());
  let codigo = '';

  if (DepId != 10) {
    codigo = $("#txtFaltanteCodigoCliente").val();
  } else {
    codigo = $("#txt_codigoSap").val();
  }

  let fh1 = $("#txtFaltanteFecha1").val();
  let fh2 = $("#txtFaltanteFecha2").val();
  let fact = $("#txtNumFact").val();

  if (codigo != '' || fact != undefined) {
    try {
      LoadImg('Cargando...');
      const data = await enviarPeticion({ op: "S_FALTANTES", link: urlModel, codigo, fh1, fh2, fact });
      if (data != '' && data != null) {
        let tabla = `
         <table class="table" align="center" id="tdFaltantes">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>No Pedido</th>
              <th>Codigo</th>
              <th>Descripcion</th>
              <th>Cant Entrega</th>
              <th>Cant Pedido</th>
              <th>No Entrega</th>
            </tr>
          </thead>
          <body>`;

        data.forEach(item => {
          tabla += `
          <tr>
            <td>${item.CODIGO_SAP}</td>
            <td>${item.NUMERO}</td>
            <td>${item.CODIGO_MATERIAL}</td>
            <td>${item.DESCRIPCION}</td>
            <td>${item.CANTIDAD}</td>
            <td>${item.CANT_PED}</td>
            <td>${item.ENTREGA}</td>
          </tr>`;
        });
        tabla += `</body></table>`;
        $("#DvListaFaltante").html(tabla);
        $("#VtotalFaltante").html('');

        $('#tdFaltantes').DataTable({
          paging: false,
          searching: false,
          ordering: true,
          info: false,
          responsive: true,
          scrollX: true,
          language: {
            zeroRecords: "No se encontraron registros",
            infoEmpty: "No hay registros disponibles"
          }
        });
      } else {
        let msgHtml = `
        <div class="alert alert-danger" role="alert">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
        </div>`;
        $("#VtotalFaltante").html('');
        $("#DvListaFaltante").html(msgHtml);
      }
    } catch (error) {
      console.log(error);
    } finally {
      UnloadImg();
    }
  } else {
    Swal.fire('Error', 'Debe seleccionar un cliente', 'error');
  }
}
// NUEVAS FUNCIONES PARA VERIFICACIÓN DE PEDIDOS
async function VerficarPedido(numTMP) {
  let result = 0;
  try {
    const data = await enviarPeticion({op: "VERIFY_PEDIDO", link: urlModel, numTMP: numTMP});
    result = data[0].ESTADO;
  } catch (error) {
    console.error(error);
  }  
  return result;
}
// FUNCIÓN QUE RETORNA NÚMERO SAP
async function NumeroSAP(numTMP) {
  let result = 0;
  try {
    const data = await enviarPeticion({op: 'NUMERO_SAP', link: urlModel, numTMP: numTMP});
    result = data[0].NUMERO_SAP;
  } catch (error) {
    console.error(error);
  }
  return result;
}
// FUNCIÓN DATOS CUPO
async function datos_cupo() {
  let org = $.trim($("#Organizacion").val());
  let codigo = $.trim($("#txt_codigoSap").val());
  try {
    const data = await enviarPeticion({op: "S_CUPO_CREDITO", link: urlModel, org, codigo});
    return data;
  } catch (error) {
    console.log(error);
  } 
}
// FUNCIÓN TOP 10 MATERIALES
async function top10_materiales() {
  let ano = new Date().getFullYear();
  let mes = new Date().getMonth() + 1;
  let cod = $("#txt_codigoSap").val();
  let org = $("#Organizacion").val();

  try {
    const data = await enviarPeticion({op: 'B_TOP20_MATERIALES', link: urlModel, cod, org, ano,  mes});
    return data;
  } catch (error) {
    console.error(error);
  } 
}
// FUNCIÓN PASAR MESES
function pasarMeses(claves) {
  resultado = [];
  claves.forEach(clave => {
    resultado.push(clave.substr(2, clave.length));
  });
  return resultado;
}
// FUNCIÓN DATA COMPORTAMIENTO
async function dataComportamiento() {
  let ano = new Date().getFullYear();
  let mes = new Date().getMonth() + 1;
  let org = $("#Organizacion").val();
  let cod = $("#txt_codigoSap").val().trim();
  if (cod === "") {
    cod = $('#CodigoSAP').val();
  }
  try {
    const data = await enviarPeticion({op: 'B_FACTURACION_MES', link: urlModel, cod, org, ano, mes});
    return data;
  } catch (error) {
    console.error(error);
  }  
}
// FUNCIÓN NOTA RÁPIDA
async function NotaRapida() {
  let nota = $.trim($("#NotasRapidas").val());
  let nump = $.trim($("#ped_numero").val());
  let nums = $.trim($("#ped_numero_sap").val());
  let entr = $.trim($("#ped_entrega").val());

  if (entr == '' || entr == 0 || entr == '0') {
    try {
      const data = await enviarPeticion({op: "U_NOTAS", link: urlModel, nota, nump});
      console.log(data);
      if (data.ok) {
        if (nums != 0) GuardarDirecto();
        else Swal.fire('Excelente', 'Nota actualizada con éxito.', 'success');
      }
    } catch (error) {
      console.log(error);
    }   
  } else {
    Swal.fire('Opps', 'El pedido ya posee entrega, no puede modificarse la nota!', 'error');
  }
}
// FUNCIÓN FILTROS TIPO PEDIDOS
function FiltrosTipoPedidos(tipo) {
  const table = $('#tableRescueTerceros').DataTable();
  let valor_total = 0;

  if (tipo === 'A') {
    table.column(8).search('').draw(); // Mostrar todos
  } else {
    table.column(8).search('^' + tipo + '$', true, false).draw(); // Filtrar por valor exacto
  }

  // Sumar valores visibles
  table.rows({ search: 'applied' }).every(function () {
    const valorTexto = $(this.node()).find('td').eq(4).text().trim();
    const valor = parseFloat(unformatNum(valorTexto)) || 0;
    valor_total += valor;
  });

  $("#VtotalTerceros").html(`<p class="m-0">VALOR TOTAL: <span style="font-size: large; font-weight: 700;">${formatNum(valor_total, '$')}</span></p>`);
}
// FUNCIÓN DESCARGAR EXCEL
function DescargarExcel(OPC) {
  let num = "";
  switch (OPC) {
    case 'PEDIDO':
      num = $.trim($("#ped_numero").val());
      ExcelPedido(num);
      break;
    case 'ENTREGA':
      let numE = $.trim($("#ped_entrega").val());
      let numP = $.trim($("#ped_numero_sap").val());
      ExcelEntrega(numE, numP)
      break;
    case 'OT':
      num = $.trim($("#ped_ot").val());
      ExcelOrden(num);
      break;
    case 'FACTURA':
      num = $("#ped_factura").val();
      ExcelFactura(num);
      break;
  }
}
// FUNCIÓN PARA GRABAR LOG DE DATOS
async function LogDatos() {
  let Ped = $("#ped_numero").val() == 0 ? '' : $("#ped_numero").val();
  let PedSAP = $("#ped_numero_sap").val() == 0 ? '' : $("#ped_numero_sap").val();
  let Entrega = $("#ped_entrega").val() == 0 ? '' : $("#ped_entrega").val();
  let Orden = $("#ped_ot").val() == 0 ? '' : $("#ped_ot").val();
  let Factura = $("#ped_factura").val() == 0 ? '' : $("#ped_factura").val();
  try {
    const data = await enviarPeticion({
      op: "CONSULTA_LOG",
      link: urlModel,
      Ped: Ped,
      PedSAP: PedSAP,
      Entrega: Entrega,
      Orden: Orden,
      Factura: Factura
    });
    if (data.length) {
      let tabla = `
      <table class="table table-bordered table-hover table-sm" width="100%" id="tdLog">
        <thead>
          <tr>
            <th class="bag-info text-green">ID</th>
            <th class="bag-info text-green">TIPO</th>
            <th class="bag-info text-green">ACCION</th>
            <th class="bag-info text-green">MENSAJE</th>
            <th class="bag-info text-green">USUARIO</th>
            <th class="bag-info text-green">FECHA/HORA</th>
            <th class="bag-info text-green">DOCUMENTO</th>
          </tr>
        </thead>
        <body>`;
      data.forEach(item => {
        tabla += `
        <tr>
          <td class="size-11">${item.ID}</td>
          <td class="size-11">${item.TIPO}</td>
          <td class="size-11">${item.ACCION}</td>
          <td class="size-11">${item.MENSAJE}</td>
          <td class="size-11">${item.USUARIO}</td>
          <td class="size-11">${item.FECHA_HORA}</td>
          <td class="size-11">${item.DOCUMENTO}</td>
        </tr>`;
      });
      tabla += `</body></table>`;
      $("#DetalleLog").html(tabla);
    } else {
      let msgHtml = `
      <div class="alert alert-danger" role="alert">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
      </div>`;
      $("#DetalleLog").html(msgHtml);
    }
    $("#ModalOpciones").modal('hide');
    $("#ModalLog").modal('show');
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN PARA VALIDAR BONIFICADOS
async function ValidarBonificados(numero) {
  let datos;
  try {
    const data = enviarPeticion({op: "VALIDA_BONIFICADO_S", link: urlModel, numero});
    datos = data;
  } catch (error) {
    console.error(error);
  }
  return datos;
}
// FUNCIÓN CARGAR GRUPOS DE CLIENTES
async function CargaGruposClientes(grupo) {
  try {
    let options = '<option value="">SIN ASIGNAR</option>';
    const data = await enviarPeticion({op: "S_GRUPOS_CLIENTES", link: "../models/CRM.php", grupo});
    if (data.length) {
      data.forEach(item => options += `<option value="${item.GRUPO}">${item.GRUPO} - ${item.DESCRIPCION}</option>`);
      switch (grupo) {
        case 1:
          $("#txtGrp1").html(options);
          break;
        case 2:
          $("#txtGrp2").html(options);
          break;
        case 3:
          $("#txtGrp3").html(options);
          break;
        case 4:
          $("#txtGrp4").html(options);
          break;
        case 5:
          $("#txtGrp5").html(options);
          break;
      }
    }
  } catch (error) {
    console.error(error)
  } 
}
// NUEVO PARA MANEJAR PERMISOS DE BODEGA 
async function Permisos() {
  let rol = $("#Rol").val();
  try {
    const data = await enviarPeticion({op: "S_PERMISOS", link: urlModel, rol, modulo: '0101'});
    if (data.length) {
      data.forEach(item => {
        if (item.id_mod_per == 1023) {
          Perm_Cambiar_Bodega = item.chck;
        }
      });
    }
  } catch (error) {
    console.error(error);
  } 
}
// FUNCIÓN CONSULTAR PUNTOS
const consultarPuntos = async (codigo_sap) => {
  try {
    const resp = await enviarPeticion({
      link: urlModel,
      op: "S_PUNTOS_CLIENTE",
      codigo_sap
    });
    resp.forEach(function (d, i) {
      $("#tdAcumuladoPuntos").html(`<strong>Tus Puntos: ${d.puntos}</strong>`);
      $("#tdCodigoSapPuntos").html(`<strong>Hola... ${d.nombres}</strong>`);
    });
    consultarObsequios();
  } catch (error) {
    console.log();
  }
}
// FUNCIÓN CONSULTAR OBSEQUIOS
const consultarObsequios = async () => {
  const organizacion = $.trim($("#Organizacion").val());
  const oficina = $.trim($("#txt_oficina").val());
  try {
    const resp = await enviarPeticion({
      link: urlModel,
      op: "S_OBSEQUIOS_PUNTOS",
      organizacion,
      oficina
    });
    let html = '';
    if (resp.length > 0) {
      for (let i = 0; i < resp.length; i++) {
        if (i % 4 === 0) {
          html += '<div class="row mb-4">';
        }

        html += `
        <div class="col-sm-6 col-md-3 mb-3">
          <div class="card h-100 shadow-sm">
            <img src="https://app.pwmultiroma.com/web/imagenesMateriales/${resp[i].codigo_material}.png" class="card-img-top" alt="${resp[i].descripcion}">            
            <div class="card-body d-flex flex-column">
              <h6 class="card-title">${resp[i].puntos} Puntos</h6>
              <p class="mt-auto">
                <button class="btn btn-danger btn-sm w-100" onclick="redimirProducto('${resp[i].codigo_material}','https://app.pwmultiroma.com/web/imagenesMateriales/${resp[i].codigo_material}.png')">
                  <i class="fa-solid fa-heart-circle-plus"></i> ¡Lo quiero!
                </button>
              </p>
              <p class="card-text mt-2 small text-muted">${resp[i].descripcion}</p>
            </div>
          </div>
        </div>`;

        if ((i + 1) % 4 === 0 || (i + 1) === resp.length) {
          html += '</div>'; // cerrar fila
        }
      }
    } else {
      html = '<div class="alert alert-danger"><i class="fa-solid fa-circle-info"></i> Sin resultados para mostrar.</div>';
    }

    $("#dvMaterialespuntos").html(html);
    $("#ModalPP").modal('show');
  } catch (error) {
    console.log(error);
  }
}
// FUNCIÓN REDIMIR PUNTOS
const redimirProducto = async (codigo, url) => {
  const organizacion = $.trim($("#Organizacion").val());
  const oficina = $.trim($("#txt_oficina").val());
  const lista = $.trim($("#txt_lista").val());
  try {
    const resp = await enviarPeticion({
      link: urlModel,
      op: "S_OBSEQUIOS_PUNTOS_PRODUCTO",
      organizacion,
      oficina,
      codigo,
      lista
  });
    resp.forEach(function (d) {
      $("#redimePuntos").val(d.puntos);
      $("#redimeProducto").val(codigo);
      $("#descripcionDetallePuntos").html(`<h4><b>${d.descripcion}</b></h4>`);
      $("#puntosDetalle").html(`<h4><b>Puntos ${d.puntos}</b></h3>`);
      $("#stockDetalle").html(`<h5><b>${d.stock} unidades disponibles</b></h5>`);
    });
  } catch (error) {
    console.log(error);
  }
  $("#imgDetalle").attr('src', url);
  $("#ModalPPDetalle").modal('show');
}
// FUNCIÓN CREAR PEDIDO REDENCIÓN
const crearPedidoRedencion = async () => {
  const result = await confirmAlert("¿Esta seguro de redimir este producto?", "Una vez iniciado el proceso no se puede reversar");
  if (result.isConfirmed) {
    const codigo_sap = $("#txt_codigoSap").val();
    const puntos = $("#redimePuntos").val();
    const codigo_material = $("#redimeProducto").val();
    try {
      $("#ModalPP").modal('hide');
      $("#ModalPPDetalle").modal('hide');
      LoadImg('Generando solicitud, por favor espere...');
      const resp = await enviarPeticion({
        link: urlModel,
        op: "I_CREAR_PEDIDO_REDENCION",
        codigo_sap,
        puntos,
        codigo_material
      });
      if (!resp.error) {
        if (resp.cod_error == 0) {
          await enviarPeticion({
            link: urlModel,
            op: "MAIL_REDENCIONES",
            id: resp.numero
          });
          Swal.fire('Excelente!', 'Redención realizada con éxito.', 'success');
        } else {
          Swal.fire('Error', resp.mensaje, 'error');
        }
      } else {
        Swal.fire('Error', 'No fue posible crear su solicitud. Por favor, verifique e intente nuevamente. En caso de persistir el error, por favor, comuníquese con su ejecutivo comercial.', 'error');
      }
      UnloadImg();
    } catch (error) {
      console.log(error);
      UnloadImg();
    }
  } else {
    Swal.fire('Cancelado', 'ha cancelado la operación', 'warning');
  }  
}
// FUNCIÓN CREAR PEDIDO REENCIÓN SAP
const crearPedidoRedencionSAP = async (numero) => {
  let numPedSAP = 0;
  try {
    const resp = await enviarPeticion({
      link: "../models/WS-PW.php",
      op: 'NUEVO',
      numero,
      numeroSAP: 0
    });
    numPedSAP = resp.Num;

  } catch (error) {
    console.log(error);
  }
  return numPedSAP;
}
// FUNCIÓN CREAR ENTREGA REDENCIÓN SAP
const crearEntregaRedencionSAP = async (numero) => {
  let numEntregaSAP = 0;
  try {
    const resp = await enviarPeticion({
      link: "../models/WS-PW.php",
      op: 'CREA_ENTREGAS',
      numero,
    });
    console.log(resp);
  } catch (error) {
    console.log(error);
  }
  return numEntregaSAP;
}
// FUNCIÓN OBTENER CARTERA EDADES
const crearCard = (titulo, valor) => `
  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
    <div class="panel panel-default custom-card shadow-sm">
      <div class="panel-body" style="padding: 5px;">
        <h5 style="font-size: 12px; margin: 0 0 5px 0;">${titulo}</h5>
        <p style="font-size: 12px; margin: 0;">${valor}</p>
      </div>
    </div>
  </div>`;
// FUNCIÓN OBTENER CARTERA EDADES
const Cartera_edades = async () => {
  try {
    const resp = await enviarPeticion({
      op: "Cartera_edades",
      link: urlModel,
      org: $("#Organizacion").val(),
      codigo_sap: $("#txt_codigoSap").val()
    });

    const data = resp.length > 0 ? resp[0] : {
      C_SIN_VENCER: 0,
      C_1_30: 0,
      C_31_60: 0,
      C_61_90: 0,
      C_91_120: 0,
      C_120: 0
    };

    const edades = [
      ["SIN VENCER", "C_SIN_VENCER"],
      ["1-30 DÍAS", "C_1_30"],
      ["31-60 DÍAS", "C_31_60"],
      ["61-90 DÍAS", "C_61_90"],
      ["91-120 DÍAS", "C_91_120"],
      ["+120 DÍAS", "C_120"]
    ];

    let cardHtml = `
      <div class="panel panel-info">
        <div class="panel-heading">
          <h3 class="panel-title custom-thead" style="font-size: 14px; font-weight: bold;">CARTERA EDADES</h3>
        </div>
        <div class="panel-body" style="padding: 5px;">
          <div class="row">`;

    edades.forEach(([label, key]) => {
      const valor = formatNum(data[key], '$');
      cardHtml += crearCard(label, valor);
    });

    cardHtml += `</div></div></div>`;
    $("#cartera_edades").html(cardHtml);

  } catch (error) {
    console.log(error);
  }
};
// FUNCIÓN OBTENER PRESUPUESTO DATOS
const crearCardP = (titulo, valor) => `
  <div class="col-xs-12 col-sm-6 col-md-4">
    <div class="panel panel-default custom-card shadow-sm">
      <div class="panel-body" style="padding: 5px;">
        <h5 style="font-size: 12px; margin: 0 0 5px 0;">${titulo}</h5>
        <p style="font-size: 12px; margin: 0;">${valor}</p>
      </div>
    </div>
  </div>`;
// FUNCIÓN OBTENER PRESUPUESTO DATOS
const Presupuesto_datos = async () => {
  try {
    const resp = await enviarPeticion({
      op: "Presupuesto_datos",
      link: urlModel,
      org: $("#Organizacion").val(),
      codigo_sap: $("#txt_codigoSap").val()
    });

    const labels = [
      ["VALOR PRESUPUESTO", "VALOR_PRESUPUESTO", true],
      ["VALOR NETO TOTAL", "VlrNetoTotal", true],
      ["% CUMP. PRESUPUESTO", "%CumpPpto", false, "%"],
      ["FALTA", "Falta", true],
      ["DEBERÍA LLEVAR", "DeberiaLlevar", true],
      ["% D. LLEVAR", "%_D_LLV", false, "%"],
      ["% EXCESO/DÉFICIT", "%_ExcesoODéficit", false, "%"],
      ["PROY. VS PROM.", "ProyVsProm", true],
      ["% PROY. VS PROM.", "%_ProyVsProm", false, "%"],
      ["PROY. DIARIA (100%)", "ProyDiaria(100%)", true]
    ];

    let cardHtml = `
      <div class="panel panel-info">
        <div class="panel-heading">
          <h3 class="panel-title custom-thead" style="font-size: 13px; font-weight: bold;">DATOS DE PRESUPUESTO</h3>
        </div>
        <div class="panel-body" style="padding: 5px;">
          <div class="row">`;

    const data = resp && resp.length ? resp[0] : {};

    labels.forEach(([label, key, isNumber, suffix = ""]) => {
      let rawValue = parseFloat(data[key]) || 0;
      let value = isNumber ? rawValue.toLocaleString() : `${rawValue.toFixed(2)}${suffix}`;
      cardHtml += crearCardP(label, value);
    });

    cardHtml += `</div></div></div>`;
    $("#Presupuesto_datos").html(cardHtml);
  } catch (error) {
    console.log(error);
  }
};
// FUNCIÓN PARA ALTERNAR CLASES
function toggleButton(button, checkboxDivId) {
  $(button).toggleClass('btn-light btn-success');
  toggleDivCheckbox(checkboxDivId);

  const valor = $.trim($('#txt_bproductos').val());
  if (valor != "") {
    if ($('#txt_bproductos').val().length > 2) {
      if (validarSiNumero(valor) == 1) BuscarProductoArr(1);
      else BuscarProductoArr(0);
    }
  } else {
    $("#dvResultProductos").html("");
    $("#n_resultados").text("");
  }
}
// FUNCIÓN PARA EL MANEJO DEL TOGGLE CHECK-BOX
function toggleDivCheckbox(checkboxDivId) {
  let checkboxDiv = document.querySelector(`#${checkboxDivId}`);
  // let checkboxDiv = $('#' + checkboxDivId);
  // let icon = checkboxDiv.find('.checkbox-icon');

  if (checkboxDiv.checked) {
    // checkboxDiv.removeClass('DivCheckBoxTrue');
    checkboxDiv.checked = false;
  } else {
    // checkboxDiv.addClass('DivCheckBoxTrue');
    checkboxDiv.checked = true;
  }
}

// FUNCIONES ESPECIFICAS PARA CADA BOTÓN
function BotonBonificado(button) {
  toggleButton(button, 'DvChkBonif');
}

function BotonOfertas(button) {
  toggleButton(button, 'DvChkOfertado');
}

function BotonDescuentos(button) {
  toggleButton(button, 'DvChkDctos');
}
//  FUNCIÓN PARA FILTRAR POR CÓDIGOS
function filtrarPorCodigos(objeto1, objeto2) {
  const mapaGrupo130 = new Map(objeto2.map(item => [item.CODIGO_MATERIAL, item.GRUPO_130]));
  const resultado = objeto1
    .filter(item => mapaGrupo130.has(item.codigo_material))
    .map(item => ({
      ...item,
      GRUPO_130: mapaGrupo130.get(item.codigo_material)
    }));

  return resultado;
}
// FUNCIÓN PARA OBTENER EL TOP 20 DE PRODUCTOS MAS VENDIDOS
async function Top_20_mas_vendidos_con_copi() {
  const resp = await enviarPeticion({
    link: urlModel,
    op: 'Top_20_mas_vendidos_con_copi',
    org: $("#Organizacion").val(),
    lista: $("#txt_lista").val(),
    oficina: $("#txt_oficina").val()
  });

  let obj = filtrarPorCodigos(ArrProd, resp);
  let $tabla = $('<table>', {
    'class': 'table table-bordered table-hover table-sm',
    'id': 'tablaTop20Productos'
  });

  const headers = ['CÓDIGO', 'DESCRIPCIÓN', 'VALOR UNITARIO', 'IVA', 'DESCUENTO', 'VALOR NETO', ''];

  let $thead = $('<thead>').addClass('thead-dark');
  let $headerRow = $('<tr>');

  $.each(headers, function (i, header) {
    $headerRow.append($('<th>').text(header).addClass("bag-info size-th"));
  });

  $thead.append($headerRow);
  $tabla.append($thead);

  let $tbody = $('<tbody>');

  $.each(obj, function (index, item) {
    let $row = $('<tr>', {
      'class': 'fila-producto',
      'data-codigo': item.codigo_material,
      'css': {'cursor': 'pointer'}
    });

    $row.append($('<td>').text(item.codigo_material));

    // Descripción con icono si bonificado ≠ 0
    let $descripcionCell = $('<td>');
    let $contenedor = $('<div>').css({
      display: 'flex',
      alignItems: 'center'
    });

    if (parseFloat(item.bonificado) !== 0) {
      let descripcionCompleta = item.descripcion;
      let descBonificadoN = item.desc_bonificado_n || '';
      let stock = item.stock || '0';
      let stockBonificado = item.stock_bonificado || '0';
      let condicion = item.condicion_b || '';
      let stockPrepack = item.stock_prepack || '0';

      let $img = $('<img>', {
        src: '../resources/icons/regalo.png',
        width: 24,
        height: 24,
        align: 'absmiddle',      
        onclick: `event.stopPropagation(); InfoBon('${descripcionCompleta.replace(/'/g, "\\'")}', '${descBonificadoN.replace(/'/g, "\\'")}', '${stock}', '${stockBonificado}', '${condicion}', '${stockPrepack}')`
      }).css({
        marginRight: '8px',
        display: 'inline-block',
        verticalAlign: 'middle',
        cursor: 'pointer'
      });
      $contenedor.append($img);
    }

    let $textoDesc = $('<span>').text(item.descripcion).css({
      display: 'inline-block',
      verticalAlign: 'middle',
      fontSize: '11px'
    });

    $contenedor.append($textoDesc);
    $descripcionCell.append($contenedor);
    $row.append($descripcionCell);

    // Valor Unitario
    $row.append($('<td>').text('$' + parseFloat(item.valor_unitario).toLocaleString('es-CO')));
    // IVA
    $row.append($('<td>').text(item.iva));
    // Descuento
    $row.append($('<td>').text(item.descuento));
    // Valor Neto
    $row.append($('<td>').text('$' + parseFloat(item.valor_neto).toLocaleString('es-CO')));

    // Grupo 130 con estrella
    let $grupoCell = $('<td>');
    if (parseInt(item.GRUPO_130) === 1) {
      let $estrella = $('<img>', {
        src: '../resources/icons/pw/estrella.png',
        width: 24,
        height: 24,
        align: 'absmiddle'
      });
      $grupoCell.append($estrella);
    }
    $row.append($grupoCell);
    $tbody.append($row);
  });

  $tabla.append($tbody);
  $('#TablaTop20_100_130').empty().append($tabla);

  $(document).off('click', '.fila-producto').on('click', '.fila-producto', function () {
    const $fila = $(this);
    const codigoMaterial = $fila.data('codigo');
    $('#txt_bproductos').val(codigoMaterial);
    BuscarProductoArr(0);
    $('#ModalTop20_100_130').modal('hide');
    $('.fila-producto').removeClass('table-active');
    $fila.addClass('table-active');
  });

  $('#ModalTop20_100_130').modal('show');
}
// FUNCIÓN PARA VALIDAR LA CARGA DE CLIENTES
const validarCargaClientes = () => {
  let DepId = $("#Dpto").val();
  if (DepId == 10) {
    if ($.trim($("#Nit").val()) == "") {
      Swal.fire("Session Error", "No se logro cargar la informacion, salga del sistema e intente nuevamente!", "error");
      setTimeout(function () {
        parent.$("#iframe").trigger("click");
      }, 3000);
    } else {
      LoadArrayCli();
    }
  } else {
    LoadArrayCli();
  }
}
// FUNCIÓN PARA MOSTRAR MENSAJES DINÁMICOS - ESTADISTICAS
function mostrarMensaje(selector, tipo = 'info', mensaje = 'Cargando...') {
  $(selector).html(`<div class="alert alert-${tipo}">${mensaje}</div>`);
}
// FUNCIÓN PARA CARGAR COMPRAS POR MES - ESTADISTICAS
async function cargarComprasMes() {
  const selector = "#container";
  mostrarMensaje(selector, 'danger', 'Cargando...');
  try {
    const resp = await dataComportamiento();
    const claves = pasarMeses(resp.claves);

    Highcharts.chart('container', {
      chart: { type: 'column' },
      title: { text: 'Compras mes a mes' },
      subtitle: { text: '12 meses atrás' },
      xAxis: { categories: claves, crosshair: true },
      yAxis: {
        min: 0,
        title: { text: 'Valor compra' }
      },
      legend: { enabled: false },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: `<span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.0f}</b><br/>`
      },
      plotOptions: {
        column: { pointPadding: 0.2, borderWidth: 0 },
        dataLabels: { enabled: true }
      },
      series: [{ name: 'valores', data: resp.datos }]
    });

  } catch (err) {
    console.error(err);
    mostrarMensaje(selector, 'danger', 'Se produjo un error!');
  }
}
// FUNCIÓN CARGAR TOP 20 PRODUCTOSM - ESTADISTICAS
async function cargarTopProductos() {
  const selector = "#container2";
  mostrarMensaje(selector, 'warning', 'Cargando...');
  try {
    const resp = await top10_materiales();
    const ano = new Date().getFullYear();

    const data = resp.map(item => ({
      name: `(${item.codigo_material}) ${item.descripcion}`,
      y: Math.round(item.frecuencia)
    }));

    if (!data.length) {
      $(selector).html(`<h4>Top 20 de productos más comprados</h4><br><div class="alert alert-danger">Sin resultados!</div>`);
      return;
    }

    Highcharts.chart('container2', {
      chart: { type: 'column' },
      title: { text: 'Top 20 de productos más comprados' },
      subtitle: { text: `Frecuencia de compra: ${ano}` },
      accessibility: {
        announceNewData: { enabled: true }
      },
      xAxis: { type: 'category' },
      yAxis: {
        title: { text: 'Frecuencia de compra' }
      },
      legend: { enabled: false },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:f}'
          }
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:f}</b><br/>'
      },
      series: [{
        name: "Materiales",
        colorByPoint: true,
        data: data
      }]
    });

  } catch (err) {
    console.error(err);
    mostrarMensaje(selector, 'danger', 'Se produjo un error!');
  }
}
// FUNCIÓN CARGAR CUPO CREDITO - ESTADISTICAS
async function cargarCupoCredito() {
  const selector = "#container3";
  mostrarMensaje(selector, 'info', 'Cargando...');
  try {
    const resp = await datos_cupo();
    let datos = [];

    if (resp.length > 0) {
      datos = [
        { name: 'Disponible', y: parseInt(resp[0].DISPONIBLE), sliced: true, selected: true },
        { name: 'Comprometido', y: parseInt(resp[0].COMPROMETIDO) }
      ];

      $("#cupo_txt1").text(`COMPROMETIDO : ${formatNum(resp[0].COMPROMETIDO, '$')}`);
      $("#cupo_txt2").text(`DISPONIBLE   : ${formatNum(resp[0].DISPONIBLE, '$')}`);
    } else {
      datos = [
        { name: 'Disponible', y: 100, sliced: true, selected: true },
        { name: 'Comprometido', y: 0 }
      ];
      $("#cupo_txt1").text('COMPROMETIDO : $0');
      $("#cupo_txt2").text(`DISPONIBLE   : ${$("#txt_cupo").val()}`);
    }

    Highcharts.chart('container3', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: { text: 'Cupo de crédito' },
      tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
      accessibility: {
        point: { valueSuffix: '%' }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Cupo',
        data: datos
      }]
    });

  } catch (err) {
    console.error(err);
    mostrarMensaje(selector, 'danger', 'Se produjo un error!');
  }
}
// FUNCIÓN PARA FILTRAR EN TODOS LOS CAMPOS CLIENTES
const filtrarClientesCampos = (idCampo) => {
  let Arr_cli = ArrCli;
  let valor = $.trim($(`#${idCampo}`).val());
  if (validarSiNumero(valor) == 1) {
    Arr_cli = FiltrarCli(valor, Arr_cli, 1);
  } else {
    let div_cadena = valor;
    div_cadena = div_cadena.split(" ");
    for (let x = 0; x < div_cadena.length; x++) {
      let expr = $.trim(div_cadena[x]);
      Arr_cli = FiltrarCli(expr, Arr_cli, 2);
    }
  }
  return Arr_cli.slice(0, 10);
}

const parrafo = document.getElementById("pTotal");
const input = document.getElementById("txt_total");
const tituloModulo = document.getElementById("tituloModulo");
function manejarCambio(e) {
  parrafo.textContent = e.matches ? "T. PEDIDO:" : "VALOR TOTAL PEDIDO:";
  parrafo.style.fontSize = e.matches ? "12px" : "14px";
  input.style.fontSize = e.matches ? "16px" : "20px";
  tituloModulo.style.display = e.matches ? "none" : "block";
}

// EJECUCIÓN DE LAS FUNCIONALIDADES AL CARGAR EL DOM
$(function () {
  Permisos(); // Validacion de permisos
  Notificaciones(); // Nuevas notificaciones emergentes - se quita porque se acabo la convención
  setInterval(function () {
    Notificaciones();
  }, 300000);

  CargaGruposClientes(1); // Nueva distribución de grupos 
  CargaGruposClientes(2);

  OfcS = OficinasVentas('S');
  OfcN = OficinasVentas('N');
  $("#FiltroOficinaVentas").html(OfcS);
  $("#FiltroOficinaVentas").change(function () {
    GestionPedidos();
  });

  $("#buscarPedidos").click(async function () {
    const zona = $('#txtZonas').val();
    if (zona === "0") {
      const result = await confirmAlert("Consultar todos los pedidos!!!", "Está por consultar todos los pedidos en general, La consulta puede tardar varios minutos... ¿Desea continuar con la operación?");
      if (!result.isConfirmed) return;
      GestionPedidos();
    }
    GestionPedidos();
  });

  $("#txtZonas, #FiltroOficinaVentas, #txtClasePedido").select2({
    theme: 'bootstrap-5'
  });

  // VALIDO SI EXISTE NIT PARA LOS CLIENTES
  validarCargaClientes();

  // TABULACIÓN DE PESTAÑAS DE SELECCIÓN	
  $("#btnProductos").click(function () {
    VerificaPedido();
    $("#txt_destinatario").attr('disabled', true);
    $("#txt_oficina").attr('disabled', true);
    $("#TxtIntegracion").attr('disabled', true);

    if ($("#txt_bproductos").val() == '') {
      $("#dvResultProductos").html('');
    } else {
      let n = 0;
      if (validarSiNumero($("#txt_bproductos").val()) == 1) {
        n = 1;
      }
      BuscarProductoArr(n);
    }
  });

  $("#ContenidoPhone").html('<embed src="../../adg-phone/index.html?" frameborder="0" width="100%" height="500px">');
  $("#btnPhone").click(function () {
    $("#ModalPhone").modal('show');
  });
  // REFRESH PEDIDOS 
  $("#btnMenu9").click(function () {
    let num = $.trim($("#ped_numero").val());
    consultaOpciones(num);
    showToastr("success", "Ejecutado correctamente", `<strong>ACTUALIZAR INFO PEDIDO ${num}</strong></br>`);
  });
  // CLICK'S
  $("#exportar_gestion").click(function () {
    Exportar('DvRecuperablesTerceros')
  });

  $("#btnMenu10").click(function () {
    LogDatos();
  });

  $("#btnPedidos").click(function () {
    WSInvenTotal();
    ListarPedido();
  });

  $("#btnTemporales").click(function () {
    Temporales();
  });

  $("#btnAddEntregas").click(function () {
    LimpiarEntregas();
    if ($("#link_pro").val() != '0') {
      $('#ClienteEntregas').val($("#txt_cliente").val()).attr("disabled", true);;
      $("#CodigoSAPEntregas").val($("#txt_codigoSap").val());
    }
  });

  $("#btnEventos").click(function () {
    ListarEvento();
  });

  $("#btListaFacts").click(function () {
    LimpiarFacturas();
    if ($("#link_pro").val() != '0') {
      $("#txtFactCodigoCliente").val($("#txt_codigoSap").val());
      $("#txtFactCliente").val($("#txt_cliente").val()).attr("disabled", true);
    }
  });

  $("#btnTempTerceros").click(function () {
    ZonasVentas();
    LimpiarGestionPedido();
    if ($("#link_pro").val() != '0') {
      $("#txtCodigoSAP").val($("#txt_codigoSap").val());
      $("#txtCliente").val($("#txt_cliente").val()).attr("disabled", true);
    }
  });

  $("#btnMenu8").click(function () {
    let num = $.trim($("#ped_factura").val());
    VisualizarFactura(num);
  });

  $("#txtFecha1,#txtFecha2,#EntregasFecha1,#EntregasFecha2,#txtFactFecha1,#txtFactFecha2,#txtFaltanteFecha1,#txtFaltanteFecha2").val(FechaActual());
  $("#txtFecha1,#txtFecha2,#EntregasFecha1,#EntregasFecha2,#txtFactFecha1,#txtFactFecha2,#txtFaltanteFecha1,#txtFaltanteFecha2").datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dateFormat: 'dd-mm-yy',
    width: 100,
    heigth: 100
  });

  $("#dvCentros").hide();

  // BÚSQUEDA DE CLIENTES PARA FILTRO DE PEDIDOS 
  $('#txtCliente').autocomplete({
    source: function (request, response) {      
      response(filtrarClientesCampos("txtCliente"));
    },
    maxResults: 10,
    minLength: 3,
    search: function () { },
    open: function (event, ui) { },
    select: function (event, ui) {
      $("#txtCodigoSAP").val(ui.item.codigo_sap);
    }
  });

  $('#txtCliente').on('keyup', function () {
    if ($(this).val() == '') {
      $("#txtCodigoSAP").val('');
    }
  });

  // BÚSQUEDA DE CLIENTES GESTION DE ENTREGAS
  $('#ClienteEntregas').autocomplete({
    source: function (request, response) {      
      response(filtrarClientesCampos("ClienteEntregas"));
    },
    maxResults: 10,
    minLength: 3,
    search: function () { },
    open: function (event, ui) { },
    select: function (event, ui) {
      $("#CodigoSAPEntregas").val(ui.item.codigo_sap);
    }
  });

  $('#ClienteEntregas').on('keyup', function () {
    if ($(this).val() == '') {
      $("#CodigoSAPEntregas").val('');
      $("#DvListaEntregas").html('');
    }
  });

  // BÚSQUEDA DE CLIENTES EN FACTURACIÓN
  $('#txtFactCliente').autocomplete({
    source: function (request, response) {      
      response(filtrarClientesCampos("txtFactCliente"));
    },
    maxResults: 10,
    minLength: 3,
    search: function () { },
    open: function (event, ui) { },
    select: function (event, ui) {
      $("#txtFactCodigoCliente").val(ui.item.codigo_sap);
    }
  });

  // BÚSQUEDA DE CLIENTES EN FALTANTES
  $('#txtFaltanteCliente').autocomplete({
    source: function (request, response) {      
      response(filtrarClientesCampos("txtFaltanteCliente"));
    },
    maxResults: 10,
    minLength: 3,
    search: function () { },
    open: function (event, ui) { },
    select: function (event, ui) {
      $("#txtFaltanteCodigoCliente").val(ui.item.codigo_sap);
    }
  });

  $('#txtFactCliente').on('keyup', function () {
    if ($(this).val() == '') {
      $("#txtFactCodigoCliente").val('');
      $("#DvListaFacturas").html('');
    }
  });

  $("#OficinaEntregas").on('change', function () {
    GestionEntregas();
  });

  // BÚSQUEDA O CARGA DE CLIENTE SEGÚN DEPARTAMENTO
  let DepId = $("#Dpto").val();
  if (DepId == 10) {
    $("#colCliente").html('<select id="txt_cliente" class="form-select size-text"></select>');

    $("#txt_cliente").on('change', function () {
      CargarClienteSeleccionado();
    });

    $("#tr_cliente_fact").hide();
    $("#tr_cliente_faltante").hide();
  } else {
    $("#tr_cliente_fact").show();
    $("#tr_cliente_faltante").show();
    let inputCliente = `
    <div class="input-group">
      <input type="text" id="txt_cliente" class="form-control size-td shadow-sm" placeholder="Búsqueda de clientes" tabindex="1">
      <span class="input-group-btn">
      <button class="btn btn-light btn-micro" type="button" title="Búsqueda de cliente por voz" onclick="iniciarVozATexto('txt_cliente',this)">
        <i class="fa-solid fa-microphone"></i>&nbsp;
      </button>
      </span>
    </div>`;
    $("#colCliente").html(inputCliente);

    $('#txt_cliente').autocomplete({
      source: function (request, response) {       
        response(filtrarClientesCampos("txt_cliente"));       
      },
      minLength: 3,
      select: function (event, ui) {
        $("#TxtIntegracion").attr('disabled', true);
        $("#txt_nit").val(ui.item.nit);
        $("#txt_dir").val(ui.item.direccion);
        $("#txt_tel").val(ui.item.telefonos);
        $("#txt_mail").val(ui.item.email);
        $("#txt_ciudad").val(ui.item.ciudad);
        $("#txt_cupo").val(formatNum(ui.item.cupo_credito, '$'));

        $("#txt_oficina").html(OfcN);
        $("#txt_oficina option[value='" + ui.item.bodega + "']").attr("selected", true);

        if (Perm_Cambiar_Bodega != 'S') {
          $("#txt_oficina").attr("disabled", true);
        } else {
          $("#txt_oficina").attr("disabled", false);
        }

        $("#txt_condicion").val(ui.item.condicion_pago);
        $("#txt_lista").val(ui.item.lista);
        $("#txt_vendedor").val(ui.item.vendedor);
        $("#txt_televendedor").val(ui.item.televendedor);
        $("#txt_vendedor_tel").val(ui.item.telefono_vendedor);
        $("#txt_televendedor_tel").val(ui.item.telefono_televendedor);
        $("#txt_codigoSap").val(ui.item.codigo_sap);
        $("#txt_descuento").val(ui.item.descuento_financiero);
        $("#txt_plazo").val(ui.item.dias_pago + ' dias');

        Destinatarios(ui.item.codigo_sap, ui.item.ciudad, ui.item.direccion);
        Presupuesto_datos();
        Cartera_edades();

        $("#txt_institucional").val(ui.item.institucional == 1 ? 'SI' : 'NO');
        $("#txt_controlado").val(ui.item.controlados == 1 ? 'SI' : 'NO');

        $("#btnProductos").attr("disabled", false);

        $("#txtGrp1").val(ui.item.grupo1);
        $("#txtGrp2").val(ui.item.grupo2);
        $("#txtGrp1,#txtGrp2").prop('disabled', true);

        CargarEvento();
        BuscarProductos();
      }
    });
  }

  Limpiar();

  // FILTROS DESCUENTOS, BONIFICADOS Y STOCK
  $(".form-check-input").click(async function () {
    let id = $(this).attr('id');

    if ($(this).hasClass('DivCheckBoxTrue')) $(this).removeClass('DivCheckBoxTrue');
    else $(this).addClass('DivCheckBoxTrue');

    id = $(this).attr("id");
    if (id == 'DvChkKits') BuscarProductos();

    let valor = $('#txt_bproductos').val();
    let n = 0;
    let sto = 0;
    if (validarSiNumero(valor) == 1) n = 1;

    if ($("#DvChkStock").hasClass('DivCheckBoxTrue')) sto = 1; // solo con stock

    if (sto == 1) {
      BuscarProductoArr(n);
    } else {
      if (id == 'DvChkStock') {
        const result = await confirmAlert("¿Está seguro(a)?", "Esta opción puede tornar lenta las búsquedas... ¿Está seguro(a) de continuar?");
        if (result.isConfirmed) BuscarProductos();
        else $("#DvChkStock").addClass('DivCheckBoxTrue');        
      } else {
        BuscarProductoArr(n);
      }
    }
  });

  $("#txt_reg").on('change', function () {
    if ($("#txt_bproductos").val() != '') {
      BuscarProductoArr();
    }
  });

  $("#txt_oficina").change(function () {
    if ($("#txt_codigoSap").val() != '') {
      BuscarProductos();
      if ($("#txt_bproductos").val() != '') {
        BuscarProductoArr();
      }
    }
  });

  $("#txt_orden").on('change', function () {
    if ($("#txt_bproductos").val() != '') {
      BuscarProductoArr();
    }
  });

  CargarEvento();

  $("#selTipos").change(function () {
    ListarEvento();
  });

  // TECLAS DE ACCESO RÁPIDO
  $(document).keyup(function (e) {
    tecla = e.keyCode;
    if (tecla == 113) { // Función tecla F2 
      let sw = 0;
      if ($("#liProductos").hasClass("disabled")) sw = 1;

      if (sw == 0) {
        activaTab("btnProductos");
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          let target = e.target.attributes.href.value;
          $(target + ' #txt_bproductos').focus();
        });
        $('#txt_bproductos').focus();
        $("#txt_bproductos").val('');
      }
    }

    if (tecla == 115) { // Función tecla F4
      let sw = 0;
      if ($("#liPedidos").hasClass("disabled")) sw = 1;

      if (sw == 0) {
        activaTab("btnPedidos");
        Guardar();
      }
    }
  });

  // NUEVO PARA EDICION DE PEDIDOS
  $("#btnEditar").click(function () {
    $("#ModalEditarPedidos").modal("show");
  });

  // CLICK ESTADISTICAS DE COMPRAS Y MÁS
  $("#btnEstadisticas").click(function () {
    $("#ModalEstadisticas").modal("show");
    cargarComprasMes();
    cargarTopProductos();
    cargarCupoCredito();
  });

  // CLICK BUSCAR Y EDITAR
  $("#btnBuscarEditar").click(function () {
    if ($("#EdtNumeroPedido").val() != '' && $("#EdtNumeroPedido").val() > 0) {
      EditarPedido($("#EdtNumeroPedido").val(), $("#EdtTipo").val());
    }
  });

  // EVENTO DE TECLADO PARA BÚSQUEDA DE PRODUCTOS
  $("#txt_bproductos").keyup(function (e) {
    const tecla = e.keyCode || e.which;
    const valor = $.trim($(this).val());
    if (valor != "") {
      if ($(this).val().length > 2) {
        if (tecla == 13) {
          if (validarSiNumero(valor) == 1) BuscarProductoArr(1);
          else BuscarProductoArr(0);
        }
      }
    } else {
      $("#dvResultProductos").html("");
      $("#n_resultados").text("");
    }
  });

  // EVENTO PARA ACTIVAR LA FUNCIÓN AL DAR CLICK POR FUERA DEL CAMPO
  $("#txt_bproductos").focusout(function (e) {
    const valor = $.trim($(this).val());
    if (valor != "") {
      if ($(this).val().length > 2) {
        if (validarSiNumero(valor) == 1) BuscarProductoArr(1);
        else BuscarProductoArr(0);
      }
    } else {
      $("#dvResultProductos").html("");
      $("#n_resultados").text("");
    }
  });

  // NUEVO PARA CARGA DE ARCHIVO PLANO 
  $("#filename").val(''); 
  $("#filename").change(function (e) {
    const ext = $("input#filename").val().split(".").pop().toLowerCase();

    if ($.inArray(ext, ["csv"]) == -1) {
      Swal.fire("Oops!!!", "Solo se permiten archivos CSV");
      $("#filename").val('');
      return false;
    }

    if (e.target.files != undefined) {
      $("#ModalAjustesBusqueda").modal("hide");
      LoadImg("Subiendo CSV");

      let reader = new FileReader();
      reader.onload = async function (e) {
        let csvval = e.target.result.split("\n");
        let NoAdd = '';
        let arrayProductosCSV = [];

        for (let i = 0; i < csvval.length; i++) {
          let row = csvval[i];
          if (row != '') {
            let col = row.split(',');
            let codigo = escapeRegExp($.trim(col[0]));
            let cantidad = escapeRegExp($.trim(col[1]));
            Arr = ArrProd;
            Arr = recursiva(codigo, Arr, 0, 0, 0, 1);

            if (Arr.length === 1) {
              Arr[0].cantidad = cantidad;
              arrayProductosCSV.push(Arr[0]);
            } else if (Arr.length === 0) {
              NoAdd += col[0].trim() + ",\n";
            }
          }
        }

        if (arrayProductosCSV.length) {
          for (const item of arrayProductosCSV) {
            if ((item.cant_regular > 0) && (item.cant_regular > item.cantidad)) {
              UnloadImg();

              const result = await confirmAlert("Producto bonificado", `El producto ${$.trim(item.descripcion)} presenta bonificado, desea aumentar la cantidad a ${item.cant_regular} unidades para ganarlo?`);

              if (result.isConfirmed) item.cantidad = item.cant_regular;
              LoadImg("Subiendo CSV");
            }

            await AddProductoPlano(
              item.codigo_material.trim(),
              item.valor_unitario,
              item.iva,
              item.descuento,
              item.cantidad,
              item.valor_neto,
              item.stock,
              item.vlr_pedido,
              item.id_pedido, 0,
              item.cant_bonificado,
              item.cant_regular,
              item.stock_bonificado
            );
          }        
        }

        WSInvenTotal();
        ListarPedido();
        setTimeout(() => {
          activaTab("btnPedidos");
        }, 1000);
        $("#filename").val('');
        UnloadImg();
        if (NoAdd != '') Swal.fire('Códigos no encontrados o no válidos', NoAdd, 'warning');
      };
      reader.readAsText(e.target.files.item(0));
    }
    return false;
  });

  if ($("#Rol").val() == '10' || $("#Dpto").val() == '11') console.log('cliente o transferencista no carga competencia');
  else ListarCompetencia();

  GruposArticulos();

  $("#txtGrupoArticulo").change(function () {
    $("#txt_bproductos").val($.trim($(this).val()));
    BuscarProductoArr(0);
  });

  $("#btnDescuentos").on('click', function () {
    activaTab('btnProductos');
    if ($("#txtGrp1").val() == '100') $("#txt_bproductos").val('OFERTA EXCLUSIVA CLIENTE WEB');
    else $("#txt_bproductos").val('*');
    $("#DvChkDctos").addClass("DivCheckBoxTrue");
    BuscarProductoArr(0);
  });

  // CARGA POR DEFECTO EL USUARIO QUE SE LE ESTÁ HACIENDO LA GESTIÓN EN EL 0102 
  if ($("#link_pro").val() != '') {
    preLoadCliente($("#link_pro").val());
  }

  $("#TxtIntegracion").change(function () {
    if ($("#link_pro").val() != '') BuscarProductos();
  });

  $("#txtFilter").val('');
  $('#txtFilter').on('input', function () {
    let filtro = $(this).val().toLowerCase();
    $('.card-evento').each(function () {
      let textoGrupo = $(this).find('.col-md-4:eq(1)').text().toLowerCase();
      if (textoGrupo.includes(filtro)) $(this).show();
      else $(this).hide();
    });
  });

  // PLAN DE PUNTOS PARA CLIENTES
  $("#btnPuntos").click(function () {
    if ($("#txt_codigoSap").val() != '') consultarPuntos($("#txt_codigoSap").val());
    else Swal.fire("Oops!!", "Dede seleccionar un cliente", "error");
  });

  $("#buy-now").click(function () {
    crearPedidoRedencion();
  });

  let valor_rol = $("#Rol").val();
  let valoresPermitidosrol = ["12", "1", "44", "72", "13", "14"];
  $("#cartera_edades, #Presupuesto_datos").toggle(valoresPermitidosrol.includes(valor_rol));

  $('#btnMas').click(function () {
    $('#ModalMasCliente').modal('show');
  });

  $('#btnMas2').click(function () {
    $('#ModalAjustesBusqueda').modal('show');
  });
  
  $("#txt_cliente, #ClienteEntregas, #txtFactCliente, #txtFaltanteCliente, #txtCliente").on("input", function () {
    this.value = this.value.toUpperCase();
  });
  
  const mediaQuery = window.matchMedia("(max-width: 1347px)");
  manejarCambio(mediaQuery);
  mediaQuery.addListener(manejarCambio);

  $('#btnCancelarSolicitud').click(function () {
    $('#nota').val("");
    $('#modalSolictudDesbloqueo').modal('hide');
  });

  $('#btnEnviarSolicitud').click(function () {
    ejecutarSolDesbloqueo();
  });
});