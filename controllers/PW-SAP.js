let ArrProd = new Array();
let ArrEan = new Array();
let ArrCli = new Array();
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
    cancelButtonText: 'Cancelar'
  });
  return result;
}
// FUNCIÓN PARA VALIDAR ESTADO DE DESBLOQUEO
const validaEstadoDesbloqueo = async () => {
  try {
    const pedido = $("#ped_numero_sap").val();
    const resp = await enviarPeticion({
      link: '../models/PW-SAP.php',
      pedido: pedido,
      op: 'status_sol_desbloqueo'
    });

    // Verifica que resp sea un array y tenga elementos
    if (Array.isArray(resp) && resp.length > 0) {
      return resp[0].nsolicitud > 0; // Devuelve true si nsolicitud es mayor que 0
    }

    return false; // Devuelve false si no hay solicitudes
  } catch (error) {
    console.error('Error en la validación de estado de desbloqueo:', error);
    return false; // Devuelve false en caso de error
  }
};
// FUNCIÓN PARA GESTIONAR SOLICITUD DE DESBLOQUEO
const SolDesbloqueo = async () => {
  /*2024-10-04 Christian Bula: Se añade control para solo poder volver a montar la solicitud si el estado es (R:Rechazado - A: Aprobado)*/
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
  /*2024-10-04 Christian Bula */
  Swal.fire({
    title: "Solicitud de desbloqueo del pedido #" + $("#ped_numero_sap").val(),
    html: `<textarea id="nota" class="swal2-input form-control"  placeholder="Si tienes una observacion , escribela aquí"></textarea>`,
    text: "Solicitar desbloqueo de pedido #" + $("#ped_numero_sap").val(),
    inputAttributes: {
      autocapitalize: "off"
    },
    showCancelButton: true,
    confirmButtonText: "Enviar solicitud",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        const nota = Swal.getPopup().querySelector('#nota').value;
        const resp = await enviarPeticion({
          link: '../models/PW-SAP.php',
          pedido: $("#ped_numero_sap").val(),
          op: 'enviar_sol_desbloqueo',
          nota
        });
        if (!resp.ok) {
          Swal.fire("Error", "No se pudo enviar la solicitud, por favor validar", "error");
          return;
        }

        if (resp.solicitada) {
          Swal.fire("Error", resp.mensaje, "error");
          return;
        }
        Swal.fire("Ok", "Se envio la solicitud correctamente!", "success");
        Temporales();
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
      }
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    console.log(result)
  });
}
// FUNCIÓN PARA MOSTRAR ESTADO DE SOLICITUD DE DESBLOQUEO
const MostrarEstadoSolDesbloqueo = async (pedido) => {
  const resp = await enviarPeticion({
    link: '../models/PW-SAP.php',
    op: 'datos_sol',
    pedido
  });

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

  Swal.fire("Estado de la solicitud", "Tu solicitud se encuentra  " + estado + "  <br> Nota :" + resp[0].RESPUESTA, "info");
  Swal.fire("Estado de la solicitud", "Tu solicitud se encuentra  " + estado + "  <br> Nota :" + resp[0].RESPUESTA, "info");
}

const guardSolicitudesDesbloqueoPedidos = async () => {
  try {
    const resp = await enviarPeticion({link: '../models/PW-SAP.php', op: 'SOL_PENDIENTE'});
  } catch (e) {
    console.error(e)
  }
}

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
    const data = await enviarPeticion({op: "S_GESTION_PEDIDOS_UNICO", link: "../models/PW-SAP.php", pedido});
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
    
    const data = await enviarPeticion({op: "S_PERMISO_ZONA", link: "../models/PW-SAP.php", rol});
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
  
    const data = await enviarPeticion({op: "S_ZONAS_VENTA", link: "../models/PW-SAP.php", sw, idUsr});
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
function activaTab(tab) { $(`.nav-tabs a[href="#${tab}"]`).tab("show"); };
// FUNCIÓN LOADING DE LA APP
function LoadImg(texto = "Cargando...") {
  let n = 0;

  const html = `
    <img src="../resources/icons/preloader.gif" alt="Cargando..." />
    <figcaption style="font-size: 25px; margin-bottom: 5px; font-weight: bold;">${texto}</figcaption>
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
    LoadImg('Cargando información... Espere un momento ⏳⏳⏳');
    await new Promise(requestAnimationFrame);

    const data = await enviarPeticion({
      op: "B_CLIENTE", 
      link: "../models/PW-SAP.php",
      org: $("#Organizacion").val(),
      sw: 'a'
    });

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
    const data = await enviarPeticion({ op: "S_EDITAR_PW", link: "../models/PW-SAP.php", Numero, Tipo });
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
      activaTab("dvProductos");
      
      let grupo = parent.parent.$("#AbrirVentas").val();
      let tipo = parent.parent.$("#AbrirVentasTipo").val();
      switch (tipo) {
        case 'DES':
            $("#DvChkDctos").addClass('DivCheckBoxTrue');
            break;
        case 'BON':
            $("#DvChkBonif").addClass('DivCheckBoxTrue');
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
  for (var i = 0; i < filtro.length; i++) {
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
  for (var i = 0; i < specialChars.length; i++) {
    cadena = cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
  }
  cadena = cadena.toLowerCase();
  // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi  
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
// FUNCIÓN PARA ARMAR TABLA PRINCIPAL DE RESULTADOS DE PRODUCTOS
function TableView(filas) {
  const op_inf = $("#DvChkKits").hasClass('DivCheckBoxTrue') ? 1 : 0;
  const org = $.trim($("#Organizacion").val());

  let tabla = `
    <table class="display" width="100%" id="tableProd">
      <thead>
        <tr style="background-color: #cff4fc;">
          <th class="size-th">CÓDIGO</th>
          <th class="size-th">DESCRIPCIÓN</th>
          <th class="size-th">VALOR</th>
          <th class="size-th">IVA</th>
          <th class="size-th">DCTO</th>
          <th class="size-th">VNETO</th>
          <th class="size-th">STOCK</th>
          <th class="size-th">CANTIDAD</th>
          <th class="size-th">TOTAL</th>
          <th class="size-th">ID</th>
          <th class="size-th">INFO</th>
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
      `<span class="glyphicon glyphicon-star-empty alert-warning" aria-hidden="true"></span> <b>%</b> ` : '';

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
        <td class="size-td">${img_new}${d.codigo_material}</td>
        <td class="size-12">${img_3} ${img} ${img_desc} ${d.descripcion} ${img_1} ${img_2}</td>
        <td class="size-td" style="background-color:#64D4F7">${formatNum(d.valor_unitario, '$')}</td>
        <td class="size-td">${d.iva}</td>
        <td class="size-td">${d.descuento}</td>
        <td class="size-td" style="background-color:#95F3E8">${formatNum(d.valor_neto, '$')}</td>
        <td class="size-td">${d.stock}</td>
        <td class="size-td"><input type="number" id="CAF${d.codigo_material}" value="${cantPedido}" class="form-control size-td cantidad" tabindex="${i + 1}" data-material='${JSON.stringify(d)}'></td>
        <td><input type="text" class="form-control size-td" id="TOF${d.codigo_material}" value="${formatNum(vlrPedido, '$')}" disabled readonly></td>
        <td><input type="text" class="form-control" value="${d.id_pedido}" id="IDF${d.codigo_material}" disabled readonly></td>
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
    scrollX: true,
    columnDefs: [
      { targets: [9], className: "d-none" },
      { targets: [10], orderable: false }
    ],
    language: {
      zeroRecords: "No se encontraron registros",
      infoEmpty: "No hay registros disponibles"
    }
  });

  // Delegar eventos para campos dinámicos
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
      link: "../models/PW-SAP.php",
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
    const organizacion =  $("#Organizacion").val();
    const data = await enviarPeticion({op: "LISTA_COMPETENCIA", link: "../models/Listar_fidelizados.php", organizacion});
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

  if ($("#DvChkStock").hasClass('DivCheckBoxTrue')) f_sto = 1;
  if ($("#DvChkDctos").hasClass('DivCheckBoxTrue')) f_dto = 1;
  if ($("#DvChkBonif").hasClass('DivCheckBoxTrue')) f_bon = 1;
  if ($("#DvChkBarras").hasClass('DivCheckBoxTrue')) f_bar = 1;	
  if ($("#DvChkNuevos").hasClass('DivCheckBoxTrue')) f_new = 1;	
  if ($("#DvChkOfertado").hasClass('DivCheckBoxTrue')) f_ofe = 1;

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

    if (Arr.length > 0) {
      TableView(Arr);
      $("#n_resultados").text(`${Arr.length} Coincidencias encontradas`);
    } else {
      let msgHtml = `
      <div class="alert alert-danger" role="alert">
        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        <span class="sr-only">Error:</span>  NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
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
    const data = await enviarPeticion({op: "B_EAN", link: "../models/PW-SAP.php"});
    data.forEach(item => {
      let e = {codigo_material: item.codigo_material, ean: item.ean}
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
  
  if ($("#DvChkStock").hasClass('DivCheckBoxTrue')) f_sto = 1;
  if ($("#DvChkDctos").hasClass('DivCheckBoxTrue')) f_dto = 1;
  if ($("#DvChkBonif").hasClass('DivCheckBoxTrue')) f_bon = 1;
  if ($("#DvChkBarras").hasClass('DivCheckBoxTrue')) f_bar = 1;
  if ($("#DvChkNuevos").hasClass('DivCheckBoxTrue')) f_new = 1; 

  let TipoPed = $("#TxtIntegracion").val();
 
  let op_sw = 'B_PRODUCTOS';
  let op_inf = 0;
  if ($("#DvChkKits").hasClass('DivCheckBoxTrue')) {
    op_sw = 'B_PRODUCTOS_KIT';
    op_inf = 1;
  }

  try {
    LoadImg('Cargando portafolio... ⏳⏳⏳');
    ArrProd = [];
    const data = await enviarPeticion({op: op_sw, link: "../models/PW-SAP.php", desc, bodega, lista, numero, eps, ctrl, f_sto, f_dto, f_bon, f_bar, top, orden, TipoPed, f_new, Grp1, Grp2, CodigoSAP});
    data.forEach(item => {
      let det = {
        codigo_material: item.codigo_material,
        descripcion: $.trim(item.descripcion),
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
      link: "../models/PW-SAP.php",
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
    const data = await enviarPeticion({op: opc, link: "../models/PW-SAP.php", cod: pcodigo, org, ofi, lst});
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
      <td>${item.CENTRO} </tb>
      <td>${item.ALMACEN} </td>
      <td>${item.TIPO_MOV}</td>
      <td>${item.LOTE}</td>
      <td>${item.VMCTO}</td>
      <td>${parseInt(item.CANTIDAD)}</td>
      <td>${item.UBICACION}</td>
    </tr>`).join('');

  const html = `
    <div class="container-fluid">
      <div class="row">
        <!-- Columna de datos básicos -->
        <div class="col-md-6">
          <div class="panel panel-info">
            <div class="panel-heading text-green bag-info">DATOS BÁSICOS</div>
            <table class="form" width="100%" align="center">
              <tbody>
                <tr>
                  <td colspan="2" align="center">
                    <img src="https://dfnas.pwmultiroma.com/imagenesMateriales/no_imagen.png" class="img-responsive img-material w-100 img-fluid" height="345">
                  </td>
                </tr>
                <tr>
                  <td class="size-10"><strong>CÓDIGO</strong></td>
                  <td class="text-green">${data[0].CODIGO_MATERIAL}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>TEXTO CORTO</strong></td>
                  <td class="size-10 size-td text-green">${data[0].DESCRIPCION}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>REGISTRO INFO</strong></td>
                  <td class="text-green">${data[0].CODIGO_SAP}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>TEXTO LARGO</strong></td>
                  <td class="size-10 size-td text-green">${data[0].DESCRIPCION2}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>LABORATORIO</strong></td>
                  <td class="text-green">${data[0].LAB}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>INVIMA</strong></td>
                  <td class="text-green">${data[0].INVIMA}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>EAN</strong></td>
                  <td class="text-green">${data[0].EAN}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>EMBALAJE</strong></td>
                  <td class="text-green">${data[0].EMBALAJE}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>FECHA CREACIÓN</strong></td>
                  <td class="text-green">${data[0].FECHA_CREACION}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>DIAS CREACIÓN</strong></td>
                  <td class="text-green">${data[0].DIAS_CREACION}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>CONTROLADO</strong>: ${ctrl}</td>
                  <td class="size-10"><strong>INSTITUCIONAL</strong>: ${ins}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Columna de datos de venta -->
        <div class="col-md-6">
          <div class="panel panel-info">
            <div class="panel-heading text-green bag-info">DATOS DE VENTA</div>
            <table class="form" width="100%" align="center">
              <tbody>
                <tr>
                  <td class="size-10"><strong>VLR BRUTO</strong></td>
                  <td class="text-green">${formatNum(vunit, '$')}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>VLR NETO SIN IVA</strong></td>
                  <td class="text-green">${formatNum(v1, '$')}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>VLR NETO FINANCIERO</strong></td>
                  <td class="text-green">${formatNum(v4, '$')}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>VLR DESCUENTO</strong></td>
                  <td class="text-green">${formatNum(v3, '$')}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>VLR IVA</strong></td>
                  <td class="text-green">${formatNum(v2, '$')}</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>PORCENTAJE DCTO</strong></td>
                  <td class="text-green">${dcto}%</td>
                </tr>
                <tr>
                  <td class="size-10"><strong>PORCENTAJE IVA</strong></td>
                  <td class="text-green">${iva}%</td>
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
            <div class="panel-heading">INVENTARIO FÍSICO POR LOTES</div>
            <div style="overflow: auto;">
              <table class="table" width="100%" align="center">
                <thead>
                    <tr>
                      <th class="bag-info text-green">CENTRO</th>
                      <th class="bag-info text-green">ALMACEN</th>
                      <th class="bag-info text-green">MOV</th>
                      <th class="bag-info text-green">LOTE</th>
                      <th class="bag-info text-green">VENCIMIENTO</th>
                      <th class="bag-info text-green">STOCK</th>
                      <th class="bag-info text-green">UBICACION</th>
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
      <td>${item.CODIGO_MATERIAL}</td>
      <td>${item.DESCRIPCION}</td>
      <td>${formatNum(item.VALOR_UNITARIO, '$')}</td>
      <td>${item.IVA}</td>
      <td>${item.DESCUENTO}</td>
      <td>${formatNum(item.VALOR_NETO, '$')}</td>
      <td>${item.CANTIDAD}</td>
      <td>${formatNum((parseFloat(item.VALOR_NETO) * parseInt(item.CANTIDAD)), '$')}</td>
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
    const data = await enviarPeticion({link: "../models/WS-INVENT.php", codigo, oficina});
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
    const data = await enviarPeticion({ op: "B_DESTINATARIO", link: "../models/PW-SAP.php", codSap: $.trim(codSap) });
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
        link: "../models/PW-SAP.php",
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
      link: "../models/PW-SAP.php",
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
      link: "../models/PW-SAP.php",
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
      link: "../models/PW-SAP.php",
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
    LoadImg('Guardando... ⏳⏳⏳');
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
      const data = await enviarPeticion({ op: "S_VERIFICA_PEDIDO", link: "../models/PW-SAP.php", num});
      if (data == '') {
        var numsap = $.trim($("#txt_numero_sap").val());
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
      activaTab("dvClientes");
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

    LoadImg('Cargando pedido... ⏳⏳⏳');

    const data = await enviarPeticion({op: "S_PEDIDO_DETALLE", link: "../models/PW-SAP.php", numero});
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
          <td class="size-td">${img} ${item.descripcion} ${msj}</td>
          <td class="size-td">${formatNum(item.valor_unitario, "$")}</td>
          <td class="size-td">${item.iva}</td>
          <td class="size-td">${item.descuento}</td>
          <td class="size-td">${formatNum(item.valor_neto, "$")}</td>
          <td class="size-td">${item.stock}</td>
          <td>
            <input ${acces} ${style} type="number" id="CAF${item.codigo}" onKeyPress="return vnumeros(event)" value="${item.cantidad}" class="form-control size-td" tabindex="${(index + 1)}" onBlur="AddProducto('${$.trim(item.codigo)}', '${$.trim(item.valor_unitario)}', '${$.trim(item.iva)}', '${$.trim(item.descuento)}', this.value, '${$.trim(item.valor_neto)}', '${$.trim(item.stock)}', '${$.trim(item.valor_total)}', '${$.trim(item.id)}', '${$.trim(Bonifica)}', '${$.trim(item.cant_bonificado)}', '${$.trim(item.cant_regular)}', '${$.trim(item.stock_bonificado)}'); ListarPedido();">
          </td>
          <td>
            <input type="text" class="form-control size-td" id="TOF${item.codigo}" value="${item.valor_total}" disabled readonly>
          </td>
          <td>
            <input type="text" class="form-control size-td" id="IDF${item.codigo}" value="${item.id}" disabled readonly>
          </td>
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
        <button type="button" class="btn btn-danger btn-sm w-btn" onClick="EliminarPW('${NumPed}'); Limpiar(); activaTab('dvClientes');">
          <i class="fa-solid fa-trash-can"></i>
          Eliminar
        </button>`;
        // valido si el modulo es abierto desde la programación
        if ($("#link_pro").val() != '') {
          if ($("#tipo_documento").val() == 'C') {
            // valido si es cotización 
            btnVerPdf = `
            <button type="button" class="btn btn-default btn-sm element-gestion-pedido" onClick="VisualizarPedido()">
              <i class="glyphicon glyphicon-save-file text-danger" aria-hidden="true"></i>
              Ver en pdf
            </button>`;

            btnEnviarPdfEmail = `
            <button type="button" class="btn btn-default btn-sm element-gestion-pedido" onClick="ConfirmarenviarPedidoEmail('${NumPed}')">
              <i class="glyphicon glyphicon-envelope text-primary" aria-hidden="true"></i>
              Enviar por email
            </button>`;
          }
        }
      } else {
        if (Rol == 1 || Rol == 3 || Rol == 21 || Rol == 13) { // 1:Administrador | 3:Gerente de ventas | 21:Coordinador pw | 13:Coordinador Televentas
          btnEliminar = `
          <button type="button" class="btn btn-danger btn-sm w-btn" onClick="EliminarSAP('${NumPedSAP}', '${NumPed}'); Limpiar(); activaTab('dvClientes');">
            <i class="fa-solid fa-trash-can"></i>
            Eliminar
          </button>`;
        }
      }

      const infoPedidoArray = [
        {title: "Subtotal", value: formatNum(vbruto, '$')},
        {title: "Valor Iva", value: formatNum(vtotal - vbruto, '$')},
        {title: "Valor Total", value: formatNum(vtotal, '$')},
        {title: "Items", value: cont},
        {title: "Productos", value: ctotal},
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
        <textarea id="Pnotas" class="form-control mb-3" style="background-color: #FFC;" onblur="UpdNotas(this)" placeholder="Notas del pedido">${notas}</textarea>
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
      <div class="alert alert-danger d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
        <div>
          NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
        </div>
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
      const data = await enviarPeticion({op: "U_NOTAS", link: "../models/PW-SAP.php", nota, nump});
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }  
}
// PEDIDOS TEMPORALES PENDIENTES POR RECUPERAR
const Temporales = async () => {
  try {
    LoadImg('Cargando... ⏳⏳⌛');
    const data = await enviarPeticion({op: "S_TEMPORALES", link: "../models/PW-SAP.php"});
    if (data.length) {
      let header = `    
      <div class="alert alert-warning alert-dismissible mt-2 mb-5" role="alert">
        <strong>NOTA!</strong> Todos los pedidos que se encuentran para recuperación cuentan con una validez de 24 horas,
        transcurrido este tiempo serán eliminados de manera automática por nuestro sistema.
      </div>
      <div class="mb-2">
        <span class="badge text-bg-danger"><strong>T</strong>emporal</span>
        <span class="badge text-bg-warning"><strong>P</strong>edido</span>
        <span class="badge text-bg-success"><strong>E</strong>ntrega</span>
        <span class="badge text-bg-info"><strong>O</strong>rden</span>
        <span class="badge text-bg-primary"><strong>F</strong>actura</span>              
      </div>            
      <div id="VtotalPropios"></div>`;

      let tabla = `
      <table class="display" width="100%" id="tableRescue">
          <thead>
            <tr class="bag-info">
              <th class="size-th">FECHA/HORA</th>
              <th class="size-th">BODEGA</th>
              <th class="size-th">NÚMERO</th>
              <th class="size-th">NOMBRES</th>
              <th class="size-th">VALOR</th>
              <th class="size-th">DESTINATARIO</th>
              <th class="size-th">TRANSFERIDO</th>
              <th class="size-th">OPCIONES</th>
            </tr>
          </thead>
          <body>`;

      let cont = 0;
      let total = 0;
      let usr = '';
      let visualizar = '';
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
          <td class="size-td">${item.fecha_pedido}</td>
          <td class="size-td">${item.bodega}</td>
          <td class="size-td">${item.numero}</td>
          <td class="size-td">
            <P style="margin: 0;">${item.cliente}</P>
            <small style="font-weight: bold;">
              Zona ventas: 
              <span class="text-primary" style="font-size: 8px;">${item.zona_ventas} - ${item.zona_descripcion}</span>
            </small>
          </td>
          <td class="size-td">${formatNum(item.valor_total, '$')}</td>
          <td class="size-td">${item.destinatario}</td>
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
      <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
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
  var num = $.trim($("#ped_numero").val());
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
      activaTab('dvPedidos');

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
    const data = await enviarPeticion({metodo: "GET", link: "../resources/tcpdf/pedidos.php", ped: numero, tipo: tipo});
    console.log(data);
  } catch (error) {
    console.error(error);
  }  
}
// ENVÍO DE EMAIL DE ANULACIÓN DE PEDIDOS
async function EnviarMailAnulacion(tipo, numero, texto) {
  try {
    const data = await enviarPeticion({op: "EMAIL", link: "../models/PW-SAP.php", tipo, numero, texto});
    console.log(data);
  } catch (error) {
    console.error(error);
  }  
}
//Funcion validar inventario antes de guardar
function WSInvenTotal() {
  var numero = $("#txt_numero").val();
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
      success: function (data) {
        //alert(data);
      }
    });
  }
}
// FUNCIÓN PARA GUARDAR PEDIDO EN SAP
const Guardar = async () => {
  let numero = $.trim($("#txt_numero").val());
  let op = '';
  let numeroSAP = 0;

  if (VerficarPedido(numero) == 0) {
    op = 'NUEVO';
  } else {
    op = 'MODIFICAR';
    numeroSAP = NumeroSAP(numero);
  }

  let BoniDatos = ValidarBonificados(numero);
  if (parseInt(BoniDatos.Id) == 0) {
    if (numero != '' && numero > 0) {
      const result = await confirmAlert(`¿Está seguro(a) de enviar el pedido número ${numero}?`, "Después de aceptar no podrá reversar la operación!!!");
      if (result.isConfirmed) {
        try {
          LoadImg('Guardando... ⏳⏳⏳');
          const data = await enviarPeticion({
            op: op,
            link: "../models/WS-PW.php",
            numero: numero,
            numeroSAP: numeroSAP
          });

          if (data.Tipo == 'S') {
            Swal.fire("Excelente!", data.Msj, "success");
            activaTab("dvClientes");
            Limpiar();
            // Envio de email para usuarios---
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
        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
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
        $("#DvChkDctos").addClass('DivCheckBoxTrue');
        break;
      case 'BON':
        $("#DvChkBonif").addClass('DivCheckBoxTrue');
        break;
    }

    $("#txt_bproductos").val($.trim(grupo));
    BuscarProductoArr(0);
    activaTab("dvProductos");
  } else {
    activaTab("dvClientes");
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
    const result = await confirmAlert("Eliminar Pedido", "¿Está seguro(a) de eliminar el pedido?");
    if (!result.isConfirmed) return;

    const data = await enviarPeticion({op: "D_PEDIDO", link: "../models/PW-SAP.php", numero});

    if (data == 0) {
      Swal.fire("Excelente", "Pedido eliminado correctamente!", "success");
      Temporales();
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
    const result = await confirmAlert("Oops!!", "¿Está seguro(a) de eliminar el pedido?");
    if (!result.isConfirmed) return;

    const data = await enviarPeticion({op: "ELIMINAR", link: "../models/WS-PW.php", numero: numero_sap});

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

const Rastreo = async () => {
  if ($("#ped_numero_sap").val() != '' && $("#ped_numero_sap").val() > 0) {
    try {
      const numero = $("#ped_numero_sap").val();
      const data = await enviarPeticion({op: "TRAZABILIDAD", link: "../models/RastreoPedido.php", numero});
      const item = data[0];
      if (data.length) {
        $("#txt_org").html(item.ORG);
        $("#txt_bodega").html(item.BODEGA);
        $("#txt_nit").html(item.NIT);
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
function Entregas() {
  var Num = $.trim($("#ped_entrega").val());
  var NumTmp = $.trim($("#ped_numero").val());
  if (Num == '0') {
    Swal.fire({
      title: "El pedido no posee entrega, desea crearla?",
      text: "Despues de aceptar no podra reversar la operacion!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#82ED81",
      cancelButtonColor: "#FFA3A4",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      closeOnConfirm: true,
      closeOnCancel: false
    }).then((result) => {
      if (result.value) {
        $.ajax({
          type: "POST",
          encoding: "UTF-8",
          url: "../models/WS-PW.php",
          global: false,
          error: function (OBJ, ERROR, JQERROR) {
            alert(JQERROR + " ");
          },
          data: ({
            op: 'CREA_ENTREGAS',
            numero: $.trim($("#ped_numero_sap").val())
          }),
          dataType: "json",
          async: false,
          success: function (data) {
            if (data.Tipo != 'S') {
              Swal.fire("Error", data.Msj, "error");
            } else {
              Swal.fire("Excelente", data.Msj, "success");
            }
            var delayInMilliseconds = 2000; //1 segundo
            setTimeout(function () {
              //Temporales propios
              Temporales();
              //Temporales de terceros
              GestionPedidos();
              //Actualizacion de datos en modal
              consultaOpciones(NumTmp);
              //-------------------------------
            }, delayInMilliseconds);

          }
        }).done(function (data) {
          //console.log(data);	
        });
      } else {
        Swal.fire("Cancelado", "La operacion ha sido cancelada!", "error");
      }
    });

  } else {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      global: false,
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR + " ");
      },
      data: ({
        op: 'S_ENTREGA',
        numero: $.trim($("#ped_numero_sap").val())
      }),
      dataType: "json",
      async: false,
      success: function (data) {
        //$("#ModalOpciones").modal("hide");
        var detalle = '';
        var clas = '';
        var icon = '';
        var Pneto = 0;
        var PnetoIva = 0;
        for (var i = 0; i <= data.length - 1; i++) {

          if (parseInt(data[i].ENTREGA) == 0) {
            clas = 'class="alert-danger"';
            icon = '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>'
          } else if (parseInt(data[i].CANTIDAD) < parseInt(data[i].CANT_PED)) {
            clas = 'class="alert-warning"';
            icon = '<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>'
          } else {
            clas = '';
            icon = '';
          }
          detalle += '<tr ' + clas + '>'
            + '<td>' + data[i].POSICION + '</td>'
            + '<td>' + data[i].CODIGO_MATERIAL + '</td>'
            + '<td>' + icon + ' ' + data[i].DESCRIPCION + '</td>'
            + '<td><input type="text" value="' + data[i].CANTIDAD + '" class="form-control form-control-sm" size="2%"></td>'
            + '<td>' + data[i].CANT_PED + '</td>'
            + '<td>' + data[i].DESCUENTO + '%</td>'
            + '<td>' + data[i].ENTREGA + '</td>'
            + '<td align="center"><input type="checkbox"/></td>'
            + '<td>' + data[i].STOCK + '</td>'
            + '</tr>';
          Pneto = Pneto + parseFloat((data[i].PNETO));
          PnetoIva = PnetoIva + parseFloat((data[i].PNETO_IVA));
        }
        $("#tdDetalleEntregas").html(detalle);
        $("#ModalOpciones").modal("hide");
        $("#ModalEntregas").modal("show");
        $("#valor_entrega").html(`VALOR ENTREGADO SIN IVA: <span><strong>${formatNum(Pneto, '$')}</strong></span>`);
        $("#valor_entrega_iva").html(`VALOR ENTREGADO: <span><strong>${formatNum(PnetoIva, '$')}</strong></span>`);

      }
    }).done(function (data) {
      //console.log(data);	
    });
  }
}

function EliminarEntrega() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/WS-PW.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR + " ");
    },
    data: ({
      op: 'ELIMINA_ENTREGAS',
      numero: $.trim($("#ped_entrega").val())
    }),
    dataType: "json",
    async: false,
    success: function (data) { //alert(data);

      if (data.Tipo != 'S') {
        Swal.fire("Error", data.Msj, "error");
      } else {
        Swal.fire("Excelente", data.Msj, "success");
        //Temporales propios
        Temporales();
        //Temporales de terceros
        GestionPedidos();
        $("#ModalEntregas").modal("hide");
      }

    }
  }).done(function (data) {
    //console.log(data);	
  });
}

function ModificarEntrega() {
  var entrega = $.trim($("#ped_entrega").val());
  //Posiciones 
  var detalle = new Array();
  $("#tdDetalleEntregas tr").each(function (index, element) {
    d1 = $.trim($(this).find("td").eq(0).html());
    d2 = $.trim($(this).find("td").eq(1).html());
    d3 = $.trim($(this).find("td").eq(3).find("input").val());
    d5 = $.trim($(this).find("td").eq(4).html());
    d6 = $.trim($(this).find("td").eq(8).html());
    if ($(this).find("td").eq(7).find("input").prop('checked')) {
      d4 = 'X'
    } else {
      d4 = ''
    };
    if (d1 != 0) {
      det = {
        'Posicion': d1,
        'Material': d2,
        'Cantidad': d3,
        'Eliminar': d4,
        'Pedido': d5,
        'Stock': d6
      } //det={
      detalle.push(det);
    }
  });
  var proceder = 0;
  for (i = 0; i <= detalle.length - 1; i++) {

    if (parseInt(detalle[i].Cantidad) > parseInt(detalle[i].Stock)) {
      proceder = 1;
    }

    if (parseInt(detalle[i].Cantidad) > parseInt(detalle[i].Pedido)) {
      proceder = 2;
    }
  }
  if (proceder == 0) {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/WS-PW.php",
      global: false,
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR + " ");
      },
      data: ({
        op: 'MODIFICA_ENTREGAS',
        entrega: entrega,
        detalle: JSON.stringify(detalle)
      }),
      dataType: "json",
      async: false,
      success: function (data) { //alert(data); return false;
        if (data.Tipo != 'S') {
          Swal.fire("Error", data.Msj, "error");
        } else {
          Swal.fire("Excelente", data.Msj, "success");
        }
      }
    }).fail(function (data) {
      console.log(data);
    });
  } else {
    $("#ModalEntregas").modal("hide");
    if (proceder == 1) {
      Swal.fire("Operación Cancelada", "No es posible actualizar un producto en donde la cantidad es mayor al stock ", "error");
    }

    if (proceder == 2) {
      Swal.fire("Operación Cancelada", "No es posible que la cantidad entregada sea superior a la cantidad pedida ", "error");
    }

  }
  //alert(JSON.stringify(detalle));
}

function Prioridad_ot(ot, almacen, despacho, punto) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      //alert(JQERROR + " ");
    },
    data: {
      op: 'Prioridad_ot',
      ot: ot,
      almacen: almacen,
      recojeDespachos: despacho, // Cambiado de 'despacho' a 'recojeDespachos'
      recojePuntoVenta: punto // Cambiado de 'punto' a 'recojePuntoVenta'
    },
    dataType: "json",
    async: false,
    success: function (data) {
      if (data.Tipo != 'S') {
        console.log("Error" + data.Msj);
      } else {
        console.log("Exito" + data.Msj);
      }
    }
  }).fail(function (data) {
    console.log(data);
    // Swal.fire("Error", "Ocurrió un error al actualizar la prioridad", "error");
  });
}

function Ordenes() {
  var entrega = $.trim($("#ped_entrega").val());
  var NumTmp = $.trim($("#ped_numero").val());
  var almacen = '';
  switch ($.trim($("#ped_bodega").val())) {
    case '1100':
      almacen = 'D01';
      break; //Monteria
    case '1200':
      almacen = 'C01';
      break; //Cartagena 
    case '2100':
      almacen = 'M01';
      break; //Medellin
    case '2200':
      almacen = 'B01';
      break; //Bogota
    case '2300':
      almacen = 'L01';
      break; //Cali
    case '2400':
      almacen = 'R01';
      break; //Barranquilla
  }
  if (entrega != 0 && entrega != '') {
    var Num = $.trim($("#ped_ot").val());
  
    if (Num == '0') {
      // Configuración inicial del Swal con checkboxes dinámicos
      let swalOptions = {
        title: "El pedido no posee Orden de transporte, desea crearla?",
        text: "Despues de aceptar no podra reversar la operacion!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#82ED81",
        cancelButtonColor: "#FFA3A4",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false,
        closeOnCancel: false,
        html: `
                <div style="text-align: left; margin-top: 20px;">
                    <label style="display: block; margin-bottom: 10px;">
                        <input type="checkbox" id="recojeDespachos" name="recojeDespachos"> 
                        Recoge en Despachos
                    </label>
                    ${$.trim($("#ped_bodega").val()) == '1100' ?
            `<label style="display: block;">
                        <input type="checkbox" id="recojePuntoVenta" name="recojePuntoVenta"> 
                        Recoge en Punto de venta
                    </label>` : ''}
                </div>
            `,
        preConfirm: () => {
          return {
            recojeDespachos: document.getElementById('recojeDespachos').checked,
            recojePuntoVenta: $.trim($("#ped_bodega").val()) == '1100'
              ? document.getElementById('recojePuntoVenta').checked : false
          }
        }
      };

      Swal.fire(swalOptions).then((result) => {
        if (result.value) {
          const opcionesRecojo = result.value;
          console.log('Opciones seleccionadas:', opcionesRecojo);

          $.ajax({
            type: "POST",
            encoding: "UTF-8",
            url: "../models/WS-PW.php",
            global: false,
            error: function (OBJ, ERROR, JQERROR) {
              alert(JQERROR + " ");
            },
            data: ({
              op: 'CREA_ORDENES',
              almacen: almacen,
              entrega: entrega,
              recojeDespachos: opcionesRecojo.recojeDespachos ? '1' : '0',
              recojePuntoVenta: opcionesRecojo.recojePuntoVenta ? '1' : '0'
            }),
            dataType: "json",
            async: false,
            success: function (data) {
              if (data.Tipo != 'S') {
                Swal.fire("Error", data.Msj, "error");
              } else {
                // Extraer el número de OT del mensaje
                let nueva_ot = '';
                let rdespa = opcionesRecojo.recojeDespachos ? '1' : '0';
                let rpunto = opcionesRecojo.recojePuntoVenta ? '1' : '0';
                Swal.fire("Excelente", data.Msj, "success");

                var delayInMilliseconds = 2000; //1 segundo
                setTimeout(function () {
                  //Temporales propios
                  Temporales();
                  //Temporales de terceros
                  GestionPedidos();
                  //Actualizacion de datos en modal
                  consultaOpciones(NumTmp, almacen, rdespa, rpunto);
                  //-----------------------------------//

                }, delayInMilliseconds);
              }
            }
          }).fail(function (data) {
            console.log(data);
          });
        } else {
          Swal.fire("Cancelado", "La operacion ha sido cancelada!", "error");
        }
      });
    } else {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/PW-SAP.php",

        global: false,
        error: function (OBJ, ERROR, JQERROR) {
          alert(JQERROR + " ");
        },
        data: ({
          op: 'S_ORDEN',
          numero: Num
        }),
        dataType: "json",
        async: false,
        success: function (data) {
          //$("#ModalOpciones").modal("hide");
          var detalle = '';
          var clas = '';
          var Pneto = 0;
          for (var i = 0; i <= data.length - 1; i++) {
            if (parseInt(data[i].ENTREGA) == 0) {
              clas = 'class="alert-danger"';
            }
            detalle += '<tr ' + clas + '>'
              + '<td>' + data[i].posicion_ot + '</td>'
              + '<td>' + data[i].codigo_material + '</td>'
              + '<td>' + data[i].descripcion + '</td>'
              + '<td><input type="text" value="' + data[i].cantidad + '" class="form-control form-control-sm" size="2%"></td>'
              + '<td>' + data[i].lote + '</td>'
              + '<td>' + data[i].numero_ot + '</td>'
              + '<td align="center"><input type="checkbox"/></td>'
              + '</tr>';
            Pneto = Pneto + parseFloat((data[i].pneto));
          }
          $("#tdDetalleOrdenes").html(detalle);
          $("#ModalOpciones").modal("hide");
          $("#ModalOrdenes").modal("show");
          $("#valor_orden").html(`VALOR ORDEN: <span><strong>${formatNum(Pneto, '$')}</strong></span>`);

        }
      }).done(function (data) {
        //console.log(data);	
      });
    }
  } else {
    Swal.fire('Error', 'El pedido no tiene entrega, no se puede generar OT', 'error');
  }
}

function EliminarOT() {
  var almacen = '';
  switch ($.trim($("#ped_bodega").val())) {
    case '1100':
      almacen = 'D01';
      break; //Monteria
    case '1200':
      almacen = 'C01';
      break; //Cartagena 
    case '2100':
      almacen = 'M01';
      break; //Medellin
    case '2200':
      almacen = 'B01';
      break; //Bogota
    case '2300':
      almacen = 'L01';
      break; //Cali
  }
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/WS-PW.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR + " ");
    },
    data: ({
      op: 'ELIMINA_OT',
      ot: $.trim($("#ped_ot").val()),
      alm: almacen
    }),
    dataType: "json",
    async: false,
    success: function (data) { //alert(data);

      if (data.Tipo != 'S') {
        Swal.fire("Error", data.Msj, "error");
      } else {
        Swal.fire("Excelente", data.Msj, "success");
        //Temporales propios
        Temporales();
        //Temporales de terceros
        GestionPedidos();
        $("#ModalOrdenes").modal("hide");
      }

    }
  }).done(function (data) {
    //console.log(data);	
  });
}
//Gestion de pedidos de terceros
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
  try {
    LoadImg('Cargando... ⏳⏳⏳');
    let TemporalesHistoria = $("#txtTemporalesHistoria").val();

    const dataPeticion = {
      link: "../models/PW-SAP.php",
      zona: $.trim($("#txtZonas").val()),
      codigo: $.trim($("#txtCodigoSAP").val()),
      fh1: $.trim($("#txtFecha1").val()),
      fh2: $.trim($("#txtFecha2").val()),
      clase: $.trim($("#txtClasePedido").val()),
      oficina: $.trim($("#FiltroOficinaVentas").val())
    }

    let cont = 0;
    let total = 0;
    let usr = '';
    let visualizar = '';

    let headerTabla = `
    <div class="mb-2">
      <button type="button" class="btn btn-sm btn-danger w-btn" onClick="FiltrosTipoPedidos('T')"><b>T</b>emporal</button>
      <button type="button" class="btn btn-sm btn-warning w-btn" onClick="FiltrosTipoPedidos('P')"><b>P</b>edido</button>
      <button type="button" class="btn btn-sm btn-success w-btn" onClick="FiltrosTipoPedidos('E')"><b>E</b>ntrega</button>
      <button type="button" class="btn btn-sm btn-info w-btn" onClick="FiltrosTipoPedidos('O')"><b>O</b>rden</button>
      <button type="button" class="btn btn-sm btn-primary w-btn" onClick="FiltrosTipoPedidos('F')"><b>F</b>actura</button>
      <button type="button" class="btn btn-sm btn-light w-btn btn-micro" onClick="FiltrosTipoPedidos('A')"><b>TODOS</b></button>
    </div>
    <table class="display" width="100%" id="tableRescueTerceros">
      <thead>
        <tr class="bag-info">
          <th class="size-th">FECHA/HORA</th>
          <th class="size-th">BODEGA</th>
          <th class="size-th">CLASE/NÚMERO</th>
          <th class="size-th">NOMBRES</th>
          <th class="size-th">VALOR</th>
          <th class="size-th">DESTINATARIO</th>
          <th class="size-th">TRANSFERIDO</th>
          <th class="size-th">OPCIONES</th>
          <th class="size-th">TIPO</th>
        </tr>
      </thead>
      <body>`;

    if (TemporalesHistoria == 'N') {
      const data = await enviarPeticion({op: "S_GESTION_PEDIDOS", ...dataPeticion});
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
            <td class="size-td">${item.fecha_pedido}</td>
            <td style="font-size: 12px">${item.bodega}</td>
            <td class="size-td">${item.clase} - ${item.numero_sap}</td>
            <td class="size-td">
                <p style="margin: 0; font-size: 12px">${item.cliente}</p>
                <small style="font-weight: bold;">Zona ventas: 
                  <span class="text-primary" style="font-size: 8px;">${item.zona_ventas} - ${item.zona_descripcion}</span>
                </small>
            </td>
            <td class="size-td">${formatNum(item.valor_total, '$')}</td>
            <td class="size-td">${item.destinatario}</td>
            <td align="center" width="4%">${transfer}</td>
            <td align="center" width="4%">
              <button type="button" class="btn btn-outline-primary btn-sm" style="font-weight: bolder; font-size: 15px;" onClick="AbrirOpciones('${$.trim(item.numero)}', '${$.trim(item.valor_total)}', '${$.trim(item.codigo_direccion)}', '${$.trim(item.direccion)}', '${$.trim(item.oficina_ventas)}', '${$.trim(item.codigo_sap)}', '${$.trim(item.transferido)}', '${$.trim(item.entrega)}', '${$.trim(item.ot)}', '${$.trim(item.numero_sap)}', '${$.trim(item.factura)}', 'T', '${$.trim(item.notas)}', '${$.trim(item.usuario)}', '${$.trim(item.destinatario)}', '${$.trim(item.cliente)}');" title="Menu de opciones">
                <i class="fa-solid fa-grip" style="font-size: 16px"></i>
              </button>
            </td>
            <td>${btnText}</td>
          </tr>`;

          cont++;
          total += parseFloat(item.valor_total);
        });
        headerTabla += `</tbody></table>`;
        $("#VtotalTerceros").html(`<div class="alert alert-info" role="info"><b>VALOR TOTAL: ${formatNum(total, '$')}</b></div>`);
        $("#DvRecuperablesTerceros").html(headerTabla);
      } else {
        $("#VtotalTerceros").html('');
        let msgHtml = `
        <div class="alert alert-danger" role="alert">
          <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
        </div>`;
        $("#DvRecuperablesTerceros").html(msgHtml);
      }
    } else {
      const data = await enviarPeticion({op: "S_GESTION_PEDIDOS_HISTORIA", ...dataPeticion});
      if (data.length) {
        data.forEach(item => {
          headerTabla += `
          <tr>
            <td class="size-td">${item.fecha_pedido}</td>
            <td class="size-td">${item.bodega}</td>
            <td class="size-td">${item.clase} ' - ' ${item.numero}</td>
            <td class="size-td">${item.cliente}</td>
            <td class="size-td">${formatNum(item.valor_total, '$')}</td>
            <td class="size-td">${item.destinatario}</td>
            <td class="size-td" align="center" width="4%">
              <button type="button" class="btn btn-danger btn-sm">
                <span class="glyphicon glyphicon-time" aria-hidden="true"></span>
              </button>
            </td>
            <td align="center" width="4%">
              <button type="button" class="btn btn-default btn-sm" onClick="RecuperarHistorico(${$.trim(item.numero)})">
                <span class="glyphicon glyphicon-transfer" aria-hidden="true"></span>
              </button>
            </td>
            <td>T</td>
          </tr>`;

          cont++;
          total += parseFloat(item.valor_total);
        });
        headerTabla += `</tbody></table>`;
        $("#VtotalTerceros").html(`<div class="alert alert-info" role="info"><b>VALOR TOTAL: ${formatNum(total, '$')}</b></div>`);
        $("#DvRecuperablesTerceros").html(headerTabla);
      } else {
         $("#VtotalTerceros").html('');
         let msgHtml = `
         <div class="alert alert-danger" role="alert">
          <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
         </div>`
        $("#DvRecuperablesTerceros").html(msgHtml);
      }
    }

    $('#tableRescueTerceros').DataTable({
      paging: false,
      searching: false,
      ordering: true,
      info: false,
      responsive: true,
      scrollX: true,
      columnDefs: [
        { targets: [8], orderable: false }
      ],
      language: {
        zeroRecords: "No se encontraron registros",
        infoEmpty: "No hay registros disponibles"
      }
    });

  } catch (error) {
    console.log(error);
  } finally {
    UnloadImg();
  }
}

function RecuperarHistorico(numero) {
  Swal.fire({
    title: "Esta seguro de restablecer el pedido temporal numero " + numero + "?",
    text: "Tenga presente que las condiciones (Precios, Descuentos, Bonificaciones) serán recalculadas a la fecha actual",
    icon: "question",
    confirmButtonColor: "#82ED81",
    cancelButtonColor: "#FFA3A4",
    confirmButtonText: "Enviar!",
    cancelButtonText: "No Enviar",
    showLoaderOnConfirm: true,
    showCancelButton: true,
  }).then((result) => {
    if (result.value) {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/PW-SAP.php",
        global: false,
        error: function (OBJ, ERROR, JQERROR) {
          alert(JQERROR);
        },
        beforeSend: function () {
          LoadImg('Restaurando... ⏳⏳⏳');
        },
        data: ({
          op: "G_PEDIDOS_HISTORIA_TMP",
          numero: numero
        }),
        dataType: "json",
        async: true,
        success: function (data) {
          if (!data.error) {
            Swal.fire("Excelente", data.mensaje, "success");
          } else {
            Swal.fire("Oops", data.mensaje, "error");
          }
          GestionPedidos();
        }
      });

    } else {
      Swal.fire("Cancelado", "Operacion cancelada por el usuario", "error");
    }
  }).done(function () {
    UnloadImg();
  });
}

function GuardarDirecto() {
  var numero = $("#ped_numero").val();
  var op = '';
  var numeroSAP = 0;
  if (VerficarPedido(numero) == 0) {
    op = 'NUEVO';
  } else {
    op = 'MODIFICAR';
    numeroSAP = NumeroSAP(numero);
  }
  var BoniDatos = ValidarBonificados(numero);
  if (parseInt(BoniDatos.Id) == 0) {
    Swal.fire({
      title: "Esta seguro de enviar el pedido numero " + numero + "?",
      text: "Despues de aceptar no podra reversar la operacion!",
      icon: "question",
      confirmButtonColor: "#82ED81",
      cancelButtonColor: "#FFA3A4",
      confirmButtonText: "Enviar!",
      cancelButtonText: "No Enviar",
      showLoaderOnConfirm: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        let timerInterval
        Swal.fire({
          title: 'Guardando..',
          html: '<img src="../resources/icons/preloader.gif" width="300px" heigth="300px">',
          showConfirmButton: false
        });
        $.ajax({
          type: "POST",
          encoding: "UTF-8",
          url: "../models/WS-PW.php",
          global: false,
          error: function (OBJ, ERROR, JQERROR) {
            alert(JQERROR + " ");
          },
          data: ({
            op: op,
            numero: numero,
            numeroSAP: numeroSAP
          }),
          dataType: "json",
          async: true,
          success: function (data) { //alert(data);return false;
            if (data.Tipo == 'S') {
              Swal.fire("Excelente!", data.Msj, "success");
              var delayInMilliseconds = 2000; //1 segundo
              setTimeout(function () {
                //Temporales propios
                Temporales();
                //Temporales de terceros
                GestionPedidos();
                //Actualizacion de datos en modal
                consultaOpciones(numero);
                //-------------------------------
              }, delayInMilliseconds);
              return false;
            } else {
              Swal.fire("Oops..!", data.Msj, "error");
              return false;
            }


          }
        }).always(function (data) {
          //console.log(data);	
        });
      } else {
        Swal.fire("Cancelado", "La operacion de guardado de pedido ha sido cancelada!", "error");
      }
    })
  } else {
    Swal.fire('Bonificados errados, imposible guardar', BoniDatos.Msj, 'error');
  }

}
// FUNCIÓN PARA GESTIONAR ENTREGAS
const GestionEntregas = async () => {
  if ($.trim($("#CodigoSAPEntregas").val()) != '') {
    try {
      LoadImg('Cargando... ⏳⏳⏳');
      const data = await enviarPeticion({
        op: "S_ENTREGAS",
        link: "../models/PW-SAP.php",
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
          <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
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
        LoadImg('Cargando... ⏳⏳⏳');
        const data = await enviarPeticion({op: "UNIFICA_ENTREGAS", link: "../models/WS-PW.php", numeros});
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
            const data = await enviarPeticion({op: "", link: "", almacen, entrega});
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
      const data = await enviarPeticion({op: "S_FACTURAS", link: "../models/PW-SAP.php", codigo, fh1, fh2, fact});
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
            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
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
      LoadImg('Cargando... ⏳⏳⏳');
      const data = await enviarPeticion({op: "S_FALTANTES", link: "../models/PW-SAP.php", codigo, fh1, fh2, fact});
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

//-----nuevas funciones para verificacion de pedidos
function VerficarPedido(numTMP) {
  var result = 0;
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) { },
    beforeSend: function () { },
    data: ({
      op: 'VERIFY_PEDIDO',
      numTMP: numTMP
    }),


    dataType: "json",
    async: false,
    success: function (data) {
      result = data[0].ESTADO;
    }
  }).always(function (data) {
    //console.log('Estado pedido : '+data);
  });
  return result;
}

function NumeroSAP(numTMP) {
  var result = 0;
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) { },
    beforeSend: function () { },
    data: ({
      op: 'NUMERO_SAP',
      numTMP: numTMP
    }),
    dataType: "json",
    async: false,
    success: function (data) {
      result = data[0].NUMERO_SAP;
    }
  });
  return result;
}

function datos_cupo() {

  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "../models/PW-SAP.php",
      async: true,
      dataType: "json",
      data: {
        op: "S_CUPO_CREDITO",
        org: $.trim($("#Organizacion").val()),
        codigo: $.trim($("#txt_codigoSap").val())
      },
      success: function (data) {
        resolve(data)
      }
    }).fail(function (data) {
      reject(data)
    });
  });
}

function top10_materiales() {


  var ano = new Date().getFullYear();
  var mes = new Date().getMonth() + 1;

  return new Promise((resolve, reject) => {

    $.ajax({
      type: "POST",
      url: "../models/PW-SAP.php",
      beforeSend: function () { },
      data: ({
        op: 'B_TOP20_MATERIALES',
        cod: $("#txt_codigoSap").val(),
        org: $("#Organizacion").val(),
        ano: ano,
        mes: mes
      }),
      dataType: "json",
      async: true,
      success: function (data) {
        resolve(data);

      }
    }).fail(function (error) {
      reject(error);
    });
  });

}

function pasarMeses(claves) {

  resultado = [];

  claves.forEach(clave => {
    resultado.push(clave.substr(2, clave.length));
  });

  return resultado;
}


function dataComportamiento() {

  let datos = new Array();
  let datos_ant = new Array();
  let ano = new Date().getFullYear();
  let mes = new Date().getMonth() + 1;
  let ano_ant = new Date().getFullYear() - 1;

  return new Promise((resolve, reject) => {

    $.ajax({
      type: "POST",
      url: "../models/PW-SAP.php",
      beforeSend: function () { },
      data: ({
        op: 'B_FACTURACION_MES',
        cod: $("#txt_codigoSap").val(),
        org: $("#Organizacion").val(),
        ano: ano,
        mes: mes
      }),
      dataType: "json",
      async: true,
      success: function (data) {
        resolve(data)
      }
    }).fail(function (error) {
      reject();
    });
  })
}


function NotaRapida() {

  var nota = $.trim($("#NotasRapidas").val());
  var nump = $.trim($("#ped_numero").val());
  var nums = $.trim($("#ped_numero_sap").val());
  var entr = $.trim($("#ped_entrega").val());
  if (entr == '' || entr == 0 || entr == '0') {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      global: false,
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR);
      },
      data: ({
        op: "U_NOTAS",
        nota: nota,
        nump: nump
      }),
      dataType: "html",
      async: false,
      success: function (data) {
        if (nums != 0) {
          GuardarDirecto();
        } else {
          Swal.fire('Excelente', 'Nota actualizada con éxito.', 'success');
        }
      }
    });
  } else {
    Swal.fire('Opps', 'El pedido ya posee entrega, no puede modificarse la nota!', 'error');
  }
}

function FiltrosTipoPedidos(tipo) {
  //8
  var valor = 0;
  var valor_total = 0;
  if (tipo == 'A') {
    $("#tableRescueTerceros tr:gt(0)").each(function (index, element) {
      $(this).show();
      //console.log('-='+$(this).find("td").eq(4).html())
      valor = $.trim(unformatNum($(this).find("td").eq(4).html()));
      valor_total += parseFloat(valor);

    })
    $("#VtotalTerceros").html('<div class="alert alert-info" role="info"><b>VALOR TOTAL: ' + formatNum(valor_total, '$') + '</b></div>');;
  } else {
    $("#tableRescueTerceros tr").each(function (index, element) {
      tipoPed = $.trim($(this).find("td").eq(8).html());

      //console.log(tipoPed +'!= '+tipo+' - -'+valor)
      if (tipoPed != tipo) {
        $(this).hide();
      } else {
        $(this).show();
        valor = $.trim(unformatNum($(this).find("td").eq(4).html()));
        valor_total += parseFloat(valor);
      }
    });
    $("#VtotalTerceros").html('<div class="alert alert-info" role="info"><b>VALOR TOTAL: ' + formatNum(valor_total, '$') + '</b></div>');
  }
}

////funcion para la consulta de datos de la feria
function QueryFeria(grupo) {
  var codigo = $("#txt_codigoSap").val();
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: ({
      op: "S_FERIA",
      grupo: grupo,
      codigo: codigo
    }),
    beforeSend: function () {
      LoadImg("Consultando Información");
    },
    dataType: "json",
    async: true,
    success: function (data) {
      if (data.length > 0) {
        var tabla_consolidado = '';
        var tabla = '';
        var tabla_resumen = '';
        tabla = '<table class="table" align="center" id="tdFeria" width="95%">'
          + '<thead>'
          + '<tr>'
          + '<th data-breakpoints="xs">Grupo/Nit</th>'
          + '<th data-breakpoints="xs">Descripción</th>'
          + '<th data-breakpoints="xs">Compras</th>'
          + '<th data-breakpoints="xs">Estado</th>'
          + '</tr>'
          + '</thead>'
          + '<body>';
        //----------------------------------------------------------------------------------
        tabla_resumen = '<table class="table" align="center" id="tdFeriaResumen" width="95%">'
          + '<thead>'
          + '<tr>'
          + '<th data-breakpoints="xs">Codigo/Grupo</th>'
          + '<th data-breakpoints="xs">Nombre/grupo</th>'
          + '<th data-breakpoints="xs">Monto</th>'
          + '<th data-breakpoints="xs">Compras</th>'
          + '<th data-breakpoints="xs">Estado</th>'
          + '</tr>'
          + '</thead>'
          + '<body>';
        var cant_grupos = 0;
        var cant_cumple = 0;
        var cant_cumpleR = 0;
        var vlr_total = 0;
        var vlr_compras = 0;
        var vlr_cumple = 0;
        var cant_boleta = 0;
        var img = '';
        for (var i = 0; i <= data.length - 1; i++) {
          //----ESTATUS SEMANAL----------------------------------------------------------------------------------------------------
          var status = '<button type="button" class="btn btn-sm btn-danger" aria-label="Left Align">'
            + '<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>'
            + '</button>';
          if (parseFloat(data[i].COMPRAS) > 0) {
            status = '<button type="button" class="btn btn-sm btn-success" aria-label="Left Align">'
              + '<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>'
              + '</button>';
            cant_cumple++;
            vlr_cumple += parseInt(parseFloat(data[i].COMPRAS) / parseFloat(data[i].VALOR));
          }
          //---ESTAUS RESUMEN-----------------------------------------------------------------------------------------------------
          var statusR = '<button type="button" class="btn btn-sm btn-danger" aria-label="Left Align">'
            + '<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>'
            + '</button>';
          if (parseFloat(data[i].ESTATUS) == 1) {
            statusR = '<button type="button" class="btn btn-sm btn-success" aria-label="Left Align">'
              + '<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>'
              + '</button>';
            cant_cumpleR++;
          }
          //--------------------------------------------------------------------------------------------------------
          var cod = '';
          if (grupo != 5) {
            cod = data[i].GRUPO_ARTICULO;
            tabla += '<tr>'
              + '<td>' + cod + '</td>'
              + '<td>' + data[i].DESCRIPCION1 + '</td>'
              + '<td>' + formatNum(data[i].COMPRAS, '$') + '</td>'
              + '<td align="center">' + status + '</td>'
              + '</tr>';
          } else {
            tabla_resumen += '<tr>'
              + '<td>' + data[i].CODIGO_GRUPO + '</td>'
              + '<td>' + data[i].NOMBRE_GRUPO + '</td>'
              + '<td>' + formatNum(1000000, '$') + '</td>'
              + '<td>' + formatNum(data[i].COMPRAS, '$') + '</td>'
              + '<td align="center">' + statusR + '</td>'
              + '</tr>';
          }

          cant_grupos++;
          vlr_total += parseFloat(data[i].VALOR);
          vlr_compras += parseFloat(data[i].COMPRAS);
        }
        tabla += '</tbody></table>';
        //--------------------------------------------------------------------------------
        var img_resumen = '';
        var bol_resumen = 0;
        if (cant_cumpleR == 4) {
          img_resumen = '<img src="../resources/icons/riendo.gif" width="80"  heigth="80"/>';
          bol_resumen = 4;
        } else {
          img_resumen = '<img src="../resources/icons/llorando.gif" width="80"  heigth="80"/>';
        }
        tabla_resumen += '<tr>'
          + '<td colspan="2" align="center">' + img_resumen + '</td>'
          + '<td colspan="3" align="center"><b><h3>BOLETAS ' + bol_resumen + '</h3></b></td>'
          + '</tr>' + '</tbody></table>';
        //--------------------------------------------------------------------------------

        if ( /*cant_cumple >= 10 && */ vlr_compras >= 1000000) {
          cant_boleta = 1;
          img = '<img src="../resources/icons/riendo.gif" width="64"  heigth="64"/>';
        } else {
          cant_boleta = 0;
          img = '<img src="../resources/icons/llorando.gif" width="64"  heigth="64"/>';
        }

        if (grupo != 5) {
          tabla_consolidado = '<table class="form" width="100%" align="center" id="tdFeriaEncabezado">'
            + '<tbody>'
            + '<tr>'
            + '<td colspan="4" align="center"><img src="../resources/icons/logo_aniversario.png" width="128"  heigth="128"/></td>'
            + '</tr>'
            + '<tr>'
            + '<td colspan="4" class="alert alert-info"><b>GRUPOS DISPONIBLES</b></td>'
            + '</tr>'
            + '<tr>'
            + '<td>#GRUPOS</td>'
            + '<td>' + cant_grupos + '</td>'
            + '<td>VALOR TOTAL</td>'
            +
            //'<td>'+formatNum(vlr_total,'$')+'</td>'+
            '<td>' + formatNum(1000000, '$') + '</td>'
            + '</tr>'
            + '<tr>'
            + '<td colspan="4" class="alert alert-success"><b>COMPRAS REALIZADAS</b></td>'
            + '</tr>'
            + '<tr>'
            + '<td>#GRUPOS</td>'
            + '<td>' + cant_cumple + '</td>'
            + '<td>VALOR TOTAL</td>'
            + '<td>' + formatNum(vlr_compras, '$') + '</td>'
            + '</tr>'
            + '<tr>'
            + '<td colspan="2" align="center">' + img + '</td>'
            + '<td colspan="2" align="center"><b><h3>BOLETAS ' + cant_boleta + '</h3></b></td>'
            + '</tr>'
            + '</tbody>'
            + '</table>';
        } else { }

      } else {
        tabla = '<div class="alert alert-danger" role="alert">'
          + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
          + '<span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS' + '</div>';
      }
      switch (parseInt(grupo)) {
        case 1:
          {
            $("#dvPopularesDetalle").html(tabla_consolidado + tabla)
          }
          break;
        case 2:
          {
            $("#dvGenericosDetalle").html(tabla_consolidado + tabla)
          }
          break;
        case 3:
          {
            $("#dvFarmaDetalle").html(tabla_consolidado + tabla)
          }
          break;
        case 4:
          {
            $("#dvOTCDetalle").html(tabla_consolidado + tabla)
          }
          break;
        case 5:
          {
            $("#dvGranSorteoDetalle").html(tabla_resumen)
          }
          break;
      }

    }
  }).always(function () {
    UnloadImg();
  })
}

function DescargarExcel(OPC) {
  switch (OPC) {
    case 'PEDIDO':
      {
        var num = $.trim($("#ped_numero").val());
        ExcelPedido(num);
      }
      break;
    case 'ENTREGA':
      {
        var numE = $.trim($("#ped_entrega").val());
        var numP = $.trim($("#ped_numero_sap").val());
        ExcelEntrega(numE, numP)
      }
      break;
    case 'OT':
      {
        var num = $.trim($("#ped_ot").val());
        ExcelOrden(num);
      }
      break;
    case 'FACTURA':
      {
        var num = $("#ped_factura").val();
        ExcelFactura(num);
      }
      break;
  }

}

function LogDatos() {
  var Ped = $("#ped_numero").val() == 0 ? '' : $("#ped_numero").val();
  var PedSAP = $("#ped_numero_sap").val() == 0 ? '' : $("#ped_numero_sap").val();
  var Entrega = $("#ped_entrega").val() == 0 ? '' : $("#ped_entrega").val();
  var Orden = $("#ped_ot").val() == 0 ? '' : $("#ped_ot").val();
  var Factura = $("#ped_factura").val() == 0 ? '' : $("#ped_factura").val();
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: ({
      op: "CONSULTA_LOG",
      Ped: Ped,
      PedSAP: PedSAP,
      Entrega: Entrega,
      Orden: Orden,
      Factura: Factura
    }),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data != '' && data != null) {
        var tabla = '<table class="table" align="center" id="tdLog">'
          + '<thead>'
          + '<tr>'
          + '<th data-breakpoints="xs">ID</th>'
          + '<th data-breakpoints="xs">TIPO</th>'
          + '<th data-breakpoints="xs">ACCION</th>'
          + '<th data-breakpoints="xs">MENSAJE</th>'
          + '<th data-breakpoints="xs">USUARIO</th>'
          + '<th data-breakpoints="xs">FECHA_HORA</th>'
          + '<th data-breakpoints="xs">DOCUMENTO</th>'
          + '</tr>'
          + '</thead>'
          + '<body>';
        var cont = 0;
        var total = 0;
        var usr = '';
        var visualizar = '';
        for (var i = 0; i <= data.length - 1; i++) {
          tabla += '<tr>'
            + '<td>' + data[i].ID + '</td>'
            + '<td>' + data[i].TIPO + '</td>'
            + '<td>' + data[i].ACCION + '</td>'
            + '<td>' + data[i].MENSAJE + '</td>'
            + '<td>' + data[i].USUARIO + '</td>'
            + '<td>' + data[i].FECHA_HORA + '</td>'
            + '<td>' + data[i].DOCUMENTO + '</td>'
            + '</tr>';
          //total+=parseFloat(data[i].VALOR);
        }
        tabla += '</body></table>';
        $("#DetalleLog").html(tabla);
      } else {
        $("#DetalleLog").html('<div class="alert alert-danger" role="alert">'
          + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
          + '<span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS' + '</div>');
      }
    }
  });

  $("#ModalOpciones").modal('hide');
  $("#ModalLog").modal('show');

}

function ValidarBonificados(numero) {
  //var numero = $.trim($("#ped_numero").val());
  var datos;
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    data: ({
      op: "VALIDA_BONIFICADO_S",
      numero: numero
    }),
    dataType: "json",
    async: false,
    success: function (data) {
      datos = data;
    }
  }).fail(function (data) {
    console.error(data);
  });
  return datos;
}

function CargaGruposClientes(grupo) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: false,
    dataType: "json",
    beforeSend: function () { },
    data: {
      op: "S_GRUPOS_CLIENTES",
      grupo: grupo
    },
    success: function (data) {
      let options = '<option value="">SIN ASIGNAR</option>';
      for (var i = 0; i <= data.length - 1; i++) {
        options += '<option value="' + data[i].GRUPO + '">' + data[i].GRUPO + ' - ' + data[i].DESCRIPCION + '</option>';
      }
      switch (grupo) {
        case 1:
          {
            $("#txtGrp1").html(options);
          }
          break;
        case 2:
          {
            $("#txtGrp2").html(options);
          }
          break;
        case 3:
          {
            $("#txtGrp3").html(options);
          }
          break;
        case 4:
          {
            $("#txtGrp4").html(options);
          }
          break;
        case 5:
          {
            $("#txtGrp5").html(options);
          }
          break;
      }

    }
  }).fail(function (data) {
    console.error(data);
  });
}

//Nuevo para manejar permisos de Bodega 
function Permisos() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    dataType: "json",
    data: {
      op: "S_PERMISOS",
      rol: $("#Rol").val(),
      modulo: '0101'
    },
    async: false,
    success: function (data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          d = data[i];
          if (d.id_mod_per == 1023) {
            Perm_Cambiar_Bodega = d.chck;
          }

        }
      }

    }
  });
}

const consultarPuntos = async (codigo_sap) => {
  try {
    const resp = await enviarPeticion({
      link: "../models/PW-SAP.php",
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

const consultarObsequios = async () => {
  const organizacion = $.trim($("#Organizacion").val());
  const oficina = $.trim($("#txt_oficina").val());
  try {
    const resp = await enviarPeticion({
      link: "../models/PW-SAP.php",
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

const redimirProducto = async (codigo, url) => {
  const organizacion = $.trim($("#Organizacion").val());
  const oficina = $.trim($("#txt_oficina").val());
  const lista = $.trim($("#txt_lista").val());
  const data = {
    link: "../models/PW-SAP.php",
    op: "S_OBSEQUIOS_PUNTOS_PRODUCTO",
    organizacion,
    oficina,
    codigo,
    lista
  }
  try {
    const resp = await enviarPeticion(data);
    resp.forEach(function (d, i) {
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

const crearPedidoRedencion = async () => {
  Swal.fire({
    title: "¿Esta seguro de redimir este producto?",
    text: "Una vez iniciado el proceso no se puede reversar",
    icon: "question",
    confirmButtonColor: "#82ED81",
    cancelButtonColor: "#FFA3A4",
    confirmButtonText: "Si,continuar",
    cancelButtonText: "No,cancelar",
    showLoaderOnConfirm: true,
    showCancelButton: true,
  }).then(async (result) => {
    if (result.value) {
      const codigo_sap = $("#txt_codigoSap").val();
      const puntos = $("#redimePuntos").val();
      const codigo_material = $("#redimeProducto").val();
      const data = {
        link: "../models/PW-SAP.php",
        op: "I_CREAR_PEDIDO_REDENCION",
        codigo_sap,
        puntos,
        codigo_material
      }

      try {
        $("#ModalPP").modal('hide');
        $("#ModalPPDetalle").modal('hide');
        LoadImg('Generando solicitud, por favor espere... ⏳⏳⏳');
        const resp = await enviarPeticion(data);
        if (!resp.error) {
          if (resp.cod_error == 0) {
            await enviarPeticion({
              link: "../models/PW-SAP.php",
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
  });
}

const crearPedidoRedencionSAP = async (numero) => {
  var numPedSAP = 0;
  const data = {
    link: "../models/WS-PW.php",
    op: 'NUEVO',
    numero,
    numeroSAP: 0
  }
  try {
    const resp = await enviarPeticion(data);
    numPedSAP = resp.Num;

  } catch (error) {
    console.log(error);
  }
  return numPedSAP;
}
const crearEntregaRedencionSAP = async (numero) => {
  var numEntregaSAP = 0;
  const data = {
    link: "../models/WS-PW.php",
    op: 'CREA_ENTREGAS',
    numero,
  }
  try {
    const resp = await enviarPeticion(data);
    // numEntregaSAP = resp.Num;
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
      link: "../models/PW-SAP.php",
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
      link: "../models/PW-SAP.php",
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

function toggleButton(button, checkboxDivId) {
  // Alternar la clase 'btn-success' en el botón
  $(button).toggleClass('btn-light btn-success');

  // Alternar el estado visual del "checkbox" simulado
  toggleDivCheckbox(checkboxDivId);
}

function toggleDivCheckbox(checkboxDivId) {
  var checkboxDiv = $('#' + checkboxDivId);
  var icon = checkboxDiv.find('.checkbox-icon'); // Buscar el icono dentro del div

  // Verificar si el div tiene la clase 'DivCheckBoxTrue'
  if (checkboxDiv.hasClass('DivCheckBoxTrue')) {
    // Si ya tiene la clase, quitarla y cambiar el icono
    checkboxDiv.removeClass('DivCheckBoxTrue');
    icon.text('☐'); // Cambiar a desmarcado
  } else {
    // Si no tiene la clase, añadirla y cambiar el icono
    checkboxDiv.addClass('DivCheckBoxTrue');
    icon.text('✔'); // Cambiar a marcado
  }
}

// Funciones específicas para cada botón
function BotonBonificado(button) {
  toggleButton(button, 'DvChkBonif');
}

function BotonOfertas(button) {
  toggleButton(button, 'DvChkOfertado');
}

function BotonDescuentos(button) {
  toggleButton(button, 'DvChkDctos');
}

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

async function Top_20_mas_vendidos_con_copi() {
  console.log('envio');
  const resp = await enviarPeticion({
    link: '../models/PW-SAP.php',
    op: 'Top_20_mas_vendidos_con_copi',
    org: $("#Organizacion").val(),
    lista: $("#txt_lista").val(),
    oficina: $("#txt_oficina").val()
  });

  console.log(resp);
  let obj = filtrarPorCodigos(ArrProd, resp);
  console.log(obj);


  let $tabla = $('<table>', {
    'class': 'table table-bordered table-hover table-sm',
    'id': 'tablaTop20Productos'
  });

  const headers = [
    'Código', 'Descripción', 'Valor Unitario', 'IVA', 'Descuento',
    'Valor Neto', ''
  ];

  let $thead = $('<thead>').addClass('thead-dark');
  let $headerRow = $('<tr>');

  $.each(headers, function (i, header) {
    $headerRow.append($('<th>').text(header));
  });

  $thead.append($headerRow);
  $tabla.append($thead);

  let $tbody = $('<tbody>');

  $.each(obj, function (index, item) {
    let $row = $('<tr>', {
      'class': 'fila-producto',
      'data-codigo': item.codigo_material,
      'css': {
        'cursor': 'pointer'
      }
    });

    // Código
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
        // title: 'Código: ' + item.codigo_material + '\n' +
        //         'Descripción: ' + item.descripcion + '\n' +
        //         'Condición: ' + item.condicion_b,
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
      verticalAlign: 'middle'
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
        src: '../resources/icons/estrella.png',
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

  $("#txtZonas,#FiltroOficinaVentas,#txtClasePedido").select2();

  // VALIDO SI EXISTE NIT PARA LOS CLIENTES
  validarCargaClientes();

  // Tabulacion de pestañas de seleccion	
  $("#btnProductos").click(function () {
    VerificaPedido();
    $("#txt_destinatario").attr('disabled', true);
    $("#txt_oficina").attr('disabled', true);
    $("#TxtIntegracion").attr('disabled', true);

    if ($("#txt_bproductos").val() == '') {
      $("#dvResultProductos").html('');
    } else {
      let n = 0;
      if (validarSiNumero(valor) == 1) {
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
    var num = $.trim($("#ped_factura").val());
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

  //Busqueda de clientes para filtro de pedidos 
  $('#txtCliente').autocomplete({
    source: function (request, response) {
      let Arr_cli = ArrCli;
      valor = $.trim($("#txtCliente").val());
      if (validarSiNumero(valor) == 1) {
        Arr_cli = FiltrarCli(valor, Arr_cli, 1);
      } else {
        div_cadena = valor;
        div_cadena = div_cadena.split(" ");
        for (var x = 0; x < div_cadena.length; x++) {
          expr = $.trim(div_cadena[x]);
          Arr_cli = FiltrarCli(expr, Arr_cli, 2);
        }
      }
      response(Arr_cli.slice(0, 10));
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

  // Busqueda de clientes gestion de entregas
  $('#ClienteEntregas').autocomplete({
    source: function (request, response) {
      let Arr_cli = ArrCli;
      valor = $.trim($("#ClienteEntregas").val());
      if (validarSiNumero(valor) == 1) {
        Arr_cli = FiltrarCli(valor, Arr_cli, 1);
      } else {
        div_cadena = valor;


        div_cadena = div_cadena.split(" ");
        for (var x = 0; x < div_cadena.length; x++) {
          expr = $.trim(div_cadena[x]);
          Arr_cli = FiltrarCli(expr, Arr_cli, 2);
        }
      }
      response(Arr_cli.slice(0, 10));
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

  // Busqueda de clientes en facturacion
  $('#txtFactCliente').autocomplete({
    source: function (request, response) {
      let Arr_cli = ArrCli;
      valor = $.trim($("#txtFactCliente").val());
      if (validarSiNumero(valor) == 1) {
        Arr_cli = FiltrarCli(valor, Arr_cli, 1);
      } else {
        div_cadena = valor;
        div_cadena = div_cadena.split(" ");
        for (var x = 0; x < div_cadena.length; x++) {
          expr = $.trim(div_cadena[x]);
          Arr_cli = FiltrarCli(expr, Arr_cli, 2);
        }
      }
      response(Arr_cli.slice(0, 10));
    },
    maxResults: 10,
    minLength: 3,
    search: function () { },
    open: function (event, ui) { },
    select: function (event, ui) {
      $("#txtFactCodigoCliente").val(ui.item.codigo_sap);
    }
  });

  // Busqueda de clientes en faltantes
  $('#txtFaltanteCliente').autocomplete({
    source: function (request, response) {
      let Arr_cli = ArrCli;
      valor = $.trim($("#txtFaltanteCliente").val());
      if (validarSiNumero(valor) == 1) {
        Arr_cli = FiltrarCli(valor, Arr_cli, 1);
      } else {
        div_cadena = valor;
        div_cadena = div_cadena.split(" ");
        for (var x = 0; x < div_cadena.length; x++) {
          expr = $.trim(div_cadena[x]);
          Arr_cli = FiltrarCli(expr, Arr_cli, 2);
        }
      }
      response(Arr_cli.slice(0, 10));
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
  
  // Búsqueda o carga de cliente según departamento
  let DepId = $("#Dpto").val();
  if (DepId == 10) {
    $("#colCliente").html('<select id="txt_cliente" class="form-select size-text"></select>');

    $("#txt_cliente").on('change', function () {
      CargarClienteSeleccionado();
      console.log("onChage...");
    });

    $("#tr_cliente_fact").hide();
    $("#tr_cliente_faltante").hide();
  } else {
    $("#tr_cliente_fact").show();
    $("#tr_cliente_faltante").show();
    let inputCliente = `
    <div class="input-group">
      <input type="text" id="txt_cliente" class="form-control size-td" placeholder="Búsqueda de clientes" tabindex="1">
      <span class="input-group-btn">
      <button class="btn btn-light btn-micro" type="button" title="Búsqueda de cliente por voz" onclick="iniciarVozATexto('txt_cliente',this)">
        <i class="fa-solid fa-microphone"></i>&nbsp;
      </button>
      </span>
    </div>`;
    $("#colCliente").html(inputCliente);   
    
    let timer;
    $('#txt_cliente').autocomplete({
      source: function (request, response) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const termino = $.trim(request.term).toLowerCase();
          if (termino.length < 3) {
            response([]);
            return;
          }

          const resultados = ArrCli.filter(cli =>
            cli.nombres.toLowerCase().includes(termino) ||
            cli.razon_comercial.toLowerCase().includes(termino) ||
            cli.nit.includes(termino)
          );

          response(resultados.slice(0, 10));
        }, 150);
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

  //Filtros descuentos, bonificados y stock
  $(".DivCheckBox").click(function () {
    var id = $(this).attr('id');
    if ($(this).hasClass('DivCheckBoxTrue')) {
      $(this).removeClass('DivCheckBoxTrue');
    } else {
      $(this).addClass('DivCheckBoxTrue');
    }
    
    id = $(this).attr("id");
    if (id == 'DvChkKits') {
      BuscarProductos();
    }

    var n = 0;
    var sto = 0;
    if (validarSiNumero(valor) == 1) {
      n = 1;
    }
    if ($("#DvChkStock").hasClass('DivCheckBoxTrue')) {
      sto = 1;
    } //solo con stock
    if (sto == 1) {
      BuscarProductoArr(n);
    } else {
      if (id == 'DvChkStock') {
        Swal.fire({
          title: "¿Esta seguro?",
          text: "Esta opción puede tornar lenta las búsquedas, esta seguro de continuar?",
          icon: "question",
          confirmButtonColor: "#82ED81",
          cancelButtonColor: "#FFA3A4",
          confirmButtonText: "Si,continuar",
          cancelButtonText: "No,cancelar",
          showLoaderOnConfirm: true,
          showCancelButton: true,
        }).then((result) => {
          if (result.value) {
            BuscarProductos();
          } else {
            $("#DvChkStock").addClass('DivCheckBoxTrue');
          }
        });
      } else {
        BuscarProductoArr(n);
      }
    }
    // }
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

  //Teclas de acceso rapido
  $(document).keyup(function (e) {
    tecla = e.keyCode;
    //Ubicar y limpiar caja de texto de busqueda de productos
    if (tecla == 113) { //Funcion tecla F2 
      var sw = 0;
      if ($("#liProductos").hasClass("disabled")) {
        sw = 1;
      }
      if (sw == 0) {
        activaTab("dvProductos");
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          var target = e.target.attributes.href.value;
          $(target + ' #txt_bproductos').focus();
        });
        $('#txt_bproductos').focus();
        $("#txt_bproductos").val('');
      }
    }
    if (tecla == 115) { //Funcion tecla F4
      var sw = 0;
      if ($("#liPedidos").hasClass("disabled")) {
        sw = 1;
      }
      if (sw == 0) {
        activaTab("dvPedidos");
        Guardar();
      }
    }


  });
  //==================================NUEVO PARA EDICION DE PEDIDOS======================================================
  $("#btnEditar").click(function () {
    $("#ModalEditarPedidos").modal("show");
  });

  $("#btnEstadisticas").click(function () {
    // Comportamiento();
    $("#ModalEstadisticas").modal("show");
    $("#container").html(`<div class="alert alert-danger">Cargando...</div>`);
    dataComportamiento()
      .then(resp => {

        let claves = pasarMeses(resp.claves);

        Highcharts.chart('container', {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Compras mes a mes'
          },
          subtitle: {
            text: '12 meses atrás'
          },
          xAxis: {
            categories: claves,
            crosshair: true
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Valor compra'
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: `<span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.0f}</b> of total<br/>`
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            },
            dataLabels: {
              enabled: true,
            }
          },
          series: [{
            name: 'valores',
            data: resp.datos

          },]
        });

      })
      .catch(err => {
        console.log(err);
        $("#container").html(`<div class="alert alert-danger">Se produjo un error!</div>`);
      })

    $("#container2").html(`<div class="alert alert-warning">Cargando...</div>`);
    top10_materiales()
      .then(resp => {

        let ano = new Date().getFullYear();
        let mes = new Date().getMonth() + 1;
        let pluginArrayArg = new Array();
        let jsonArray = '';

        resp.forEach(item => {

          let dato = new Object();
          dato.name = '(' + item.codigo_material + ') ' + item.descripcion;
          dato.y = Math.round(item.frecuencia);
          pluginArrayArg.push(dato);
        })
        jsonArray = JSON.parse(JSON.stringify(pluginArrayArg));

        if (pluginArrayArg.length > 0) {

          Highcharts.chart('container2', {
            chart: {
              type: 'column'
            },
            title: {
              text: 'TOP 20 DE PRODUCTOS MAS COMPRADOS'
            },
            subtitle: {
              text: 'Frecuencia de compra : ' + ano
            },
            accessibility: {
              announceNewData: {
                enabled: true
              }
            },
            xAxis: {
              type: 'category'
            },
            yAxis: {
              title: {
                text: 'Frecuencia de compra'
              }

            },
            legend: {
              enabled: false
            },
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
              pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:f}</b> <br/>'
            },

            series: [{
              name: "Browsers",
              colorByPoint: true,
              data: jsonArray
            }]

          });
        } else {

          $("#container2").html('<h4>TOP 20 DE PRODUCTOS MAS COMPRADOS</h4><br><div class="alert alert-danger">Sin resultados!</div>');

        }

      }).catch(err => {
        console.error(err);
        $("#container2").html(`<div class="alert alert-danger">Se produjo un error!</div>`);
      });


    $("#container3").html(`<div class="alert alert-info">Cargando...</div>`);
    datos_cupo()
      .then(resp => {

        let datos = '';

        if (resp.length > 0) {
          datos = [{
            name: 'Disponible',
            y: parseInt(resp[0].DISPONIBLE),
            sliced: true,
            selected: true
          }, {
            name: 'Comprometido',
            y: parseInt(resp[0].COMPROMETIDO)
          }];
          $("#cupo_txt1").text('COMPROMETIDO : ' + formatNum(resp[0].COMPROMETIDO, '$'));
          $("#cupo_txt2").text('DISPONIBLE   : ' + formatNum(resp[0].DISPONIBLE, '$'));
        } else {
          datos = [{
            name: 'Disponible',
            y: 100,
            sliced: true,
            selected: true
          }, {
            name: 'Comprometido',
            y: 0
          }];
          $("#cupo_txt1").text('COMPROMETIDO : ' + formatNum(0, '$'));
          $("#cupo_txt2").text('DISPONIBLE   : ' + $("#txt_cupo").val());
        }

        Highcharts.chart('container3', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'CUPO DE CRÉDITO'
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          accessibility: {
            point: {
              valueSuffix: '%'
            }
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
            name: 'Brands',
            // colorByPoint: true,
            data: datos
          }]
        });
      })
      .catch(err => {
        console.error(err);
        $("#container3").html(`<div class="alert alert-danger">Se produjo un error!</div>`);
      });

  });


  $("#btnBuscarEditar").click(function () {
    if ($("#EdtNumeroPedido").val() != '' && $("#EdtNumeroPedido").val() > 0) {
      EditarPedido($("#EdtNumeroPedido").val(), $("#EdtTipo").val());
    }
  });

  $("#txt_bproductos").keyup(function (e) {
    tecla = (document.all) ? e.keyCode : e.which;
    valor = $.trim($(this).val());
    if (valor != "") {
      if ($(this).val().length > 2) {
        if (tecla == 13) {
          //verifico si solo son numer
          //busco por codigo sap o codigo de barras
          if (validarSiNumero(valor) == 1) {
            //busco por codigo de barras
            BuscarProductoArr(1);
          } else {
            BuscarProductoArr(0);
          }

        }
      }
    } else {
      $("#dvResultProductos").html("");
      $("#n_resultados").text("");
    }
  });

  // Fin se coloca para mitigar el problema mobil
  $("#txt_bproductos").focusout(function (e) {
    valor = $.trim($(this).val());
    if (valor != "") {
      if ($(this).val().length > 2) {
        //verifico si solo son numer
        //busco por codigo sap o codigo de barras
        if (validarSiNumero(valor) == 1) {
          //busco por codigo de barras
          BuscarProductoArr(1);
        } else {
          BuscarProductoArr(0);
        }
      }
    } else {
      $("#dvResultProductos").html("");
      $("#n_resultados").text("");
    }
  });
  
  // Nuevo para carga de archivo plano 
  $("#filename").val('');
  $("#filename").change(function (e) {
    var ext = $("input#filename").val().split(".").pop().toLowerCase();
    if ($.inArray(ext, ["csv"]) == -1) {
      alert('Solo se permiten archivos CSV');
      $("#filename").val('');
      return false;
    }
    if (e.target.files != undefined) {
      $("#ModalAjustesBusqueda").modal("hide");
      LoadImg("Subiendo CSV");
      var reader = new FileReader();
      reader.onload = function (e) {
        var csvval = e.target.result.split("\n");
        var SiAdd = new Array();
        var NoAdd = '';

        for (var i = 0; i < csvval.length; i++) { //for 1		
          var row = csvval[i];
          if (row != '') {
            var col = row.split(',');
            var desc = escapeRegExp($.trim(col[0]));
            var SwAdd = 0;
            Arr = ArrProd;
            Arr = recursiva(desc, Arr, 0, 0, 0, 1);

            if (Arr.length > 0) {
              for (var x = 0; x < Arr.length; x++) { //for 2									
                d = Arr[0];
                for (var y = 0; y < SiAdd.length; y++) {
                  if (SiAdd[y].codigo == $.trim(d.codigo_material)) {
                    SwAdd = 1
                  }
                }
                if (SwAdd == 0) {
                  cant = parseInt($.trim(col[1]));
                  reg = parseInt($.trim(d.cant_regular));
                  if ((reg > 0) && (reg > cant)) {
                    UnloadImg()
                    if (confirm("El producto " + $.trim(d.descripcion) + " presenta bonificado,"
                      + "desea aumentar la cantidad a " + reg + " unidades para ganarlo?")) {
                      cant = reg;
                    }
                    LoadImg("Subiendo CSV");
                  }
                  AddProductoPlano($.trim(d.codigo_material),
                    $.trim(d.valor_unitario),
                    $.trim(d.iva),
                    $.trim(d.descuento),
                    cant,
                    $.trim(d.valor_neto),
                    $.trim(d.stock),
                    $.trim(d.vlr_pedido),
                    $.trim(d.id_pedido),
                    $.trim(0),
                    $.trim(d.cant_bonificado),
                    $.trim(d.cant_regular),
                    $.trim(d.stock_bonificado));
                  d = {
                    'codigo': desc
                  }
                  SiAdd.push(d);
                } else {
                  NoAdd += $.trim(col[0]) + ",\n";
                }
              } //fin for 2	
            } else {
              NoAdd += $.trim(col[0]) + ",\n";
            }
          } //fin if
        } //fin for 1	

        WSInvenTotal();
        ListarPedido();
        activaTab("dvPedidos");
        $("#filename").val('');
        UnloadImg();
        if (NoAdd != '') {
          Swal.fire('Codigos no encontrados o no validos', NoAdd, 'warning');
        }
      };
      reader.readAsText(e.target.files.item(0));
    }
    return false;
  });

  if ($("#Rol").val() == '10' || $("#Dpto").val() == '11') {
    console.log('cliente o transferencista no carga competencia')
  } else {
    ListarCompetencia();
  }
  
  $("#btnFeriaVirtual").click(function () { //Ferias virtuales
    let cod = $("#txt_codigoSap").val();
    if (cod != '') {
      $("#ModalFeriaVirtual").modal('show');
      QueryFeria(4);
    } else Swal.fire("Oops!!", "Debe seleccionar un cliente", "Warning");
  });
  
  GruposArticulos(); // Grupos Articulos
  $("#txtGrupoArticulo").change(function () {
    $("#txt_bproductos").val($.trim($(this).val()));
    BuscarProductoArr(0);
  });  
 
  $("#btnDescuentos").on('click', function () {  // Descuentos ir
    activaTab('dvProductos');
    if ($("#txtGrp1").val() == '100') $("#txt_bproductos").val('OFERTA EXCLUSIVA CLIENTE WEB');
    else $("#txt_bproductos").val('*');
    $("#DvChkDctos").addClass("DivCheckBoxTrue");
    BuscarProductoArr(0);
  });

  // carga por defecto el usuario que se le esta haciendo la gestion en el 0102 
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

  // Plan de puntos para clientes
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
});