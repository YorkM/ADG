const url_file = "https://app.pwmultiroma.com";
const rolId = parseInt($('#rol').val());

let tipoGasto = {
  '1': 'COTIZACIÓN',
  '2': 'FACTURA DIRECTA',
  '3': 'ANTICIPO'
}

let estados = {
  'S': { color: '#0A97B0', texto: 'SOLICITADO' },
  'K': { color: '#77dd77', texto: 'AUTORZADO' },
  'U': { color: '#b7950b', texto: 'ANTICIPO' },
  'O': { color: '#77dd77', texto: 'AUTORIZADO' },
  'Q': { color: '#B2A5FF', texto: 'FACTURA' },
  'T': { color: '#77dd77', texto: 'AUTORIZADO' },
  'C': { color: '#84b6f4', texto: 'CAUSADO' },
  'P': { color: '#ffda9e', texto: 'PAGADO' },
  'R': { color: '#ff6961', texto: 'RECHAZADO' },
  'N': { color: '#ff6961', texto: 'NO CAUSADO' },
  'M': { color: '#ff6961', texto: 'NO PAGADO' },
  'L': { color: '#ff6961', texto: 'NO COMPENSADO' },
  'F': { color: '#c5c6c8', texto: 'FINALIZADO' },
  'W': { color: '#FC8F54', texto: 'COMPENSADO' }
}

const enviarMail = async (destino, estado, idSolicitud) => {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/WorkFlow.php",
    global: false,
    error: function (JQERROR) {
      console.log(JQERROR + " ");
    },
    data: {
      op: "E_EMAIL",
      destino,
      estado,
      idSolicitud
    },
    dataType: "html",
    async: true,
    success: function (data) { },
  }).fail(function (error) {
    console.log(error);
  });
}

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

const formatNumber = (value) => {
  value = value.replace(/[^0-9]/g, '');
    if (value) value = parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 0 });
    return value;
}

const formatDate = (dateString) => {
  const processedDateString = dateString.replace(/:(\d{3})([AP]M)/, " $2");
  const date = new Date(processedDateString);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  };
  return new Intl.DateTimeFormat("es-ES", options).format(date);
}

function formatearFecha(fechaTexto) {
  fechaTexto = fechaTexto.replace(/:000AM|:000PM/g, '').trim();
  fechaTexto = fechaTexto.replace(/\s+/g, ' ');
  let partes = fechaTexto.split(" ");
  if (partes.length < 3) return null;
  let meses = {
      "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
      "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
      "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
  };
  let mes = meses[partes[0]];
  let dia = partes[1].padStart(2, '0');
  let año = partes[2];

  return `${año}-${mes}-${dia}`;
}

const getDptos = async () => {
  try {
    const resp = await enviarPeticion({ op: "G_DTPOS", link: "../models/WorkFlow.php" });
    let elements = `<option value="">Seleccione un Dpto</option>`;
    if (resp.length) {
      resp.forEach(elem => {
        elements += `<option value="${elem.DESCRIPCION.trim()}">${elem.DESCRIPCION}</option>`;
      });
    }
    $("#filtroDepartamentos").html(elements);
  } catch (error) {
    console.log(error);
  }
}

const getOficinas = async () => {
  try {
    let resp = await enviarPeticion({ op: "G_OFICINA", link: "../models/WorkFlow.php" });
    if (resp.length) {
      let elements = ``;
      let elements2 = ``;
      resp.forEach(elem => {
        elements += `<option value="${elem.OFICINA_VENTAS}">${elem.DESCRIPCION}</option>`;
        elements2 += `<option value="${elem.ORGANIZACION_VENTAS}">${elem.ORGANIZACION_VENTAS === "2000" ? "Roma" : "Multidrogas"}</option>`;
      });
      $("#oficina_solicitante").html(elements);
      $("#organizacion").html(elements2);
    }
  } catch (e) {
    console.error(e);
  }
}

const getDatosUsuario = async () => {
  try {
    let idUsuario = $("#UsrId").val();
    resp = await enviarPeticion({ op: "G_USUARIO", idUsuario, link: "../models/WorkFlow.php" });
    if (resp.length) {
      resp.forEach(elem => {
        $("#usuario_solicitante").val(elem.USUARIO);
      });
      return resp[0].USUARIO;
    }
  } catch (error) {
    console.log(error);
  }
}

const getInfoTablaGastos = async () => {
  const colores = {

  }
  try {
    const resp = await enviarPeticion({op: "G_INFOTABLAG", link: "../models/WorkFlow.php"});
    const colores = {
      "GERENTE": "#4F959D",
      "COORDINADOR": "#E5D0AC",
      "AUXILIAR": "#A9B5DF",
      "GENERAL": "#5C7285",
    }
    let table = `
    <table class="table table-bordered">
    <thead class="table-info">
        <tr>
            <th>Cargo</th>
            <th>Concepto</th>
            <th>Gasto autorizado</th>
        </tr>                     
      </thead>
    <tbody>`;

    resp.forEach(elem => {
      table += ` 
      <tr style="background-color: ${colores[elem.CARGO]};">
        <td style="color: white;">${elem.CARGO}</td>
        <td style="color: white;">${elem.CONCEPTO}</td>
        <td style="color: white;">${formatNum(elem.GASTO_AUTORIZADO, "$")}</td>
      </tr>`
    });

    table += `
      </tbody>
    </table>
    `
    $('#containerTablaGastos').html(table);
    $('#modalTablaGastos').modal('show');
  } catch (error) {
    console.log(error);
  }
}

const actualizarNota = async (idSolicitud) => {
  await enviarPeticion({ op: "U_NOTA", link: "../models/WorkFlow.php", idSolicitud });
  await getSolicitudes();
}

const getConceptos = async () => {
  try {
    const resp = await enviarPeticion({ op: "G_CONCEPTOS", link: "../models/WorkFlow.php" });
    let elements = `<option value="">--Seleccione un concepto--</option>`;
    if (resp.length) {
      resp.forEach(elem => {
        elements += `<option value="${elem.ID}">${elem.CONCEPTO}</option>`;
      });
    }
    $("#conceptoFormulario").html(elements);
  } catch (error) {
    console.log(error);
  }
}
 
const validarSeccionesXEstados = async (resp = [], rol) => {
  const { ESTADO, TIPO_GASTO } = resp[0];
  if (ESTADO === "S") {
    $('#sectionAdmin, #adjuntosModal, #textArchivos').show();
    $('#sectionAnticipo').hide();
    $('#btnVerFacturaDiv').removeClass('d-flex').hide();
    $('#btnVerFacturaDiv2').removeClass('d-flex').hide();
    $('#verAdjPagoDiv').removeClass('d-flex').hide();
    $('#checkAdmin, #checkFactura, #checkAprobFactura, #checkContabilidad, #checkTesoreria').addClass('d-none').hide();
    $('#divBtnRestaurar, #botonesContabilidad, #botonesTesoreria, #botonesCompensacion').removeClass('d-flex').hide();
    $('input[type="radio"]').attr("disabled", false);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $('#botonesAdmin').addClass("d-flex").show();
    $('#btnRechazar').attr("disabled", false);
    $('#btnRechazar').addClass('btn-warning');
    $('#btnRechazar').removeClass('btn-disabled');
    $("#sectionFactura").addClass('d-none');
    $("#sectionAprobarFactura").addClass('d-none');
    $("#comentarioAutoriza").val("");
    $("#comentarioAutoriza").attr("disabled", false);
    $("#fechaCausacion").val("");
    $("#fechaCausacion").attr("disabled", true);
    $("#numeroCausacion").val("");
    $("#numeroCausacion, #adjuntoLegalizacion, #valorLegalizacion, #valorAutorizado, #comentarioLegalizacion").attr("disabled", true);
    $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
    $('#botonesAprobarLegalizacion').removeClass('d-flex').hide(); 
    $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #subTotalFactura2, #iva2, #comentarioFactura, #adjunto_factura, #comentarioAprobarFactura").attr("disabled", true);
    $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2, #comentarioAprobarFactura2").attr("disabled", true);
    $('#sectionBtnGF').removeClass('d-flex').hide();
    $('#sectionBtnGF2').removeClass('d-flex').hide();
    $('#sectionBtnGA').removeClass('d-flex').hide();
    $('#botonesAnticipo').removeClass('d-flex').hide();
    $('#botonesAprobarFactura').removeClass('d-flex').hide();
    $('#botonesAprobarFactura2').removeClass('d-flex').hide();
    $("#numeroCompensacion, #comentarioCompensacion").attr("disabled", true);
    $("#fechaPago").val("");
    $("#fechaPago").attr("disabled", true);
    $("#comentarioContabilidad").val("");
    $("#comentarioContabilidad").attr("disabled", true);
    $("#comentarioTesoreria").val("");
    $("#comentarioTesoreria").attr("disabled", true);
    $("#adjuntoPago").val("");
    $("#adjuntoPago").attr("disabled", true);
    $('#alerta1').addClass('d-none');
    $('#alerta2').addClass('d-none');
    $('#alerta3').addClass('d-none');
    $('#adjunto1ModalDiv').show();
    $('#adjunto2ModalDiv').show();
    $('#adjunto3ModalDiv').show();
    $('#btnActualizarAdjDiv').addClass('d-flex').show();
    $('#sectionCompensacion').show();
    if (TIPO_GASTO === "3" && resp[0].TIPO_ANTICIPO !== "1") {
      $('#textArchivos').hide();
      $('input[type="radio"]').attr("disabled", true);
    }
    if (rol !== 1 && rol !== 73) {
      $("#comentarioAutoriza").attr("disabled", true);
      $('input[type="radio"]').attr("disabled", true);
      $('#botonesAdmin').removeClass('d-flex').hide();
    }
    if (resp[0].USUARIO_SOLICITA !== await getDatosUsuario()) {
      $('#adjunto1ModalDiv').hide();
      $('#adjunto2ModalDiv').hide();
      $('#adjunto3ModalDiv').hide();
      $('#btnActualizarAdjDiv').removeClass('d-flex').hide();
    }
  }

  if (ESTADO === "K") {
    $('#sectionAdmin').show();
    $('#sectionAnticipo').show();
    $('#fechaAutorizacionDiv').removeClass('d-none');
    $('#btnVerAnticipo').addClass("d-none");
    $('#checkAdmin').removeClass('d-none').show();
    $('#checkFactura, #checkAprobFactura, #checkContabilidad, #checkTesoreria, #checkAnticipo').addClass('d-none').hide();
    $('input[type="radio"]').attr("disabled", true);
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $("#fechaAutorizacion").val(formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
    $('#botonesAdmin').removeClass('d-flex').hide();
    $("#sectionFactura").removeClass('d-none');
    $('#numeroPreliminar, #adjunto_factura, #comentarioFactura, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #iva2').val("");
    $("#sectionAprobarFactura").removeClass('d-none');
    $('#numeroPreliminar, #adjunto_factura, #comentarioFactura, #fechaFactura2, #numeroDocumento2, #subTotalFactura2, #razonSocial2, #valorFactura2, #iva2, #comentarioAprobarFactura').attr('disabled', true);
    $("#fechaCausacion").val("");
    $("#fechaCausacion").attr("disabled", true);
    $("#numeroCausacion").val("");
    $("#numeroCausacion").attr("disabled", true);
    $("#fechaPago").val("");
    $("#fechaPago").attr("disabled", true);
    $("#comentarioContabilidad").val("");
    $("#comentarioContabilidad").attr("disabled", true);
    $("#comentarioTesoreria").val("");
    $("#comentarioTesoreria").attr("disabled", true);
    $("#adjuntoPago").val("");
    $("#adjuntoPago").attr("disabled", true);
    $('#botonesContabilidad').removeClass('d-flex').hide();
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $('#botonesAprobarFactura').removeClass('d-flex').hide();
    $('#sectionBtnGF').removeClass('d-flex').hide();
    $("#alerta1").addClass('d-none');
    $("#alerta2").addClass('d-none');
    $("#alerta3").addClass('d-none');
    if (resp[0].USUARIO_SOLICITA === await getDatosUsuario()) {
      $('#sectionFactura').removeClass('d-none').show();
      $('#sectionBtnGF').removeClass("d-none").addClass("d-flex");
      $('#numeroPreliminar, #adjunto_factura, #comentarioFactura, #fechaFactura2, #numeroDocumento2, #subTotalFactura2, #razonSocial2, #valorFactura2, #iva2').attr('disabled', false);
    }
    if (resp[0].TIPO_ANTICIPO === "1") {
      $('#sectionFactura').addClass('d-none').hide();
      $('#comentarioCompensacion, #numeroCompensacion').attr('disabled', true);
      $('#comentarioCompensacion, #numeroCompensacion').val("");
      $('#botonesAnticipo').removeClass("d-flex").hide();
      $('#comentarioAnticipo, #adjuntoAnticipo').attr('disabled', true);
      $('#sectionBtnGA').addClass("d-none").hide();
    }
    if (resp[0].TIPO_ANTICIPO === "1" && resp[0].USUARIO_SOLICITA === await getDatosUsuario()) {
      $('#comentarioAnticipo, #adjuntoAnticipo').attr('disabled', false);
      $('#sectionBtnGA').removeClass("d-none").addClass("d-flex");
    }
  }

  if (ESTADO === "U") {
    $('#sectionAdmin, #sectionAnticipo').show();
    $('#checkAdmin, #checkAnticipo, #btnVerAnticipo').removeClass('d-none').show();
    $('#checkFactura, #checkAprobFactura, #checkContabilidad, #checkTesoreria, #checkCompesacion').addClass('d-none').hide();
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $("#fechaAutorizacion").val(formatDate(resp[0].FECHA_AUTORIZA));
    $("#fechaAnticipo").val(formatDate(resp[0].FECHA_FINALIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
    $("#sectionFactura, #sectionAprobarFactura").addClass('d-none');
    $("#fechaCausacion, #numeroCausacion, #fechaPago, #comentarioContabilidad #comentarioTesoreria, #adjuntoPago, #comentarioAnticipo").val("");
    $("#comentarioTesoreria, input[type='radio'], #numeroCausacion, #fechaCausacion, #fechaPago, #comentarioContabilidad, #adjuntoPago, #comentarioAutoriza, #adjuntoAnticipo, #comentarioAnticipo").attr("disabled", true);
    $('#botonesAdmin, #botonesContabilidad, #botonesTesoreria, #botonesCompensacion, #divBtnRestaurar, #sectionBtnGA, #botonesAnticipo').removeClass('d-flex').hide();
    $("#alerta1, #alerta2, #alerta3").addClass('d-none');
    $('#titleAnticipo').html(`<h5>Anticipo adjunto - <span class="h5">Aprobación</span></h5>`);
    if (resp[0].USUARIO_SOLICITA === await getDatosUsuario()) {
      // $('#fechaPreliminar').val(getFechaHoraActual);
      $('#sectionFactura').removeClass('d-none');
      $('#numeroPreliminar, #adjunto_factura, #comentarioFactura').attr('disabled', false);
    }
    if (resp[0].TIPO_ANTICIPO === "1") {
      $('#sectionFactura').addClass('d-none').hide();
      $('#comentarioCompensacion, #numeroCompensacion').attr('disabled', true);
      $('#comentarioCompensacion, #numeroCompensacion').val("");
    }
    if (rol === 1 || rol === 73) {
      $('#comentarioAnticipo').attr('disabled', false);
      $('#botonesAnticipo').addClass('d-flex').show();
    }
  }

  if (ESTADO === "Q" && TIPO_GASTO === "3") {
    $('#sectionAdmin').show();
    $('#sectionCompensacion').show();
    $('#checkAdmin, #checkFactura2, #checkContabilidad, #checkTesoreria').removeClass('d-none').show();
    $('#checkAprobFactura').addClass('d-none').hide();
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $("#fechaAutorizacionDiv").removeClass('d-none');
    $('#adjuntoAnticipoDiv').hide();
    $('#adjuntoPagoDiv').hide();
    $('#verAdjPagoDiv').addClass('d-flex').show();
    $('#fechaAnticipoDiv').removeClass('d-none');
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $('#btnVerFacturaDiv2').addClass('d-flex').show();
    $('#adjunto_facturaDiv2').hide();
    $('#comentarioFacturaDiv2').hide();
    $('#btnVerFacturaDiv2').removeClass('d-none');
    $("#numeroDocumento3").val(resp[0].NUMERO_DOCUMENTO);
    $("#razonSocial3").val(resp[0].NIT);
    $("#valorFactura3").val(resp[0].VALOR_DOCUMENTO);
    $("#subTotalFactura3").val(resp[0].SUBTOTAL_DOCUMENTO);
    $("#iva3").val(resp[0].IVA_DOCUMENTO);
    $("#sectionBtnGF2").removeClass("d-flex").addClass("d-none");
    $("#fechaAutorizacion").val(formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('#botonesAdmin').removeClass('d-flex').hide();
    $("#sectionFactura").addClass('d-none');
    $("#sectionAprobarFactura").addClass('d-none');
    $("#fechaCausacion").val(resp[0].FECHA_CAUSA);
    $("#fechaCausacionDiv").removeClass('d-none');
    $("#fechaPreliminar").val(formatDate(resp[0].FECHA_PRELIMINAR));
    $("#valorLegalizacion").val(formatNumber(resp[0].VALOR_LEGALIZACION));
    $("#valorAnticipo").val(formatNumber(resp[0].VALOR_ANTICIPO));
    $("#adjuntoLegalizacionDiv").addClass('d-none');
    $("#btnVerLegalizacionDiv").removeClass('d-none').addClass('d-flex');
    // $("#fechaAprobarPreliminar").val(getFechaHoraActual);
    $("#fechaCausacion, #fechaPreliminar").attr("disabled", true);
    $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
    $("#numeroPreliminar3").val(resp[0].NUMERO_PRELIMINAR);
    $("#comentarioFactura").val(resp[0].COMENTARIO_PRELIMINAR);
    $("#numeroCausacion, #numeroPreliminar").attr("disabled", true);
    $("#fechaPago").val(resp[0].FECHA_PAGA);
    $("#fechaPago").attr("disabled", true);
    $("#fechaPagoDiv").removeClass('d-none');
    $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
    $("#comentarioContabilidad, #comentarioFactura").attr("disabled", true);
    $("#comentarioTesoreria").val(resp[0].COMENTARIO_PAGA);
    $("#comentarioTesoreria").attr("disabled", true);
    $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $("#sectionBtnGF").removeClass("d-flex").addClass("d-none");
    $("#adjuntoPago").val("");
    $('#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #valorFactura3, #subTotalFactura3, #iva3, #adjuntoAnticipo2, comentarioAnticipo2, #numeroCompensacion, #comentarioCompensacion').attr('disabled', true);
    $("#adjuntoLegalizacion, #valorLegalizacion, #valorAutorizado, #comentarioLegalizacion").attr("disabled", true);
    $('#adjunto_factura').attr('disabled', true);
    $('#comentarioFactura').attr('disabled', true);
    $("#adjuntoPago").attr("disabled", true);
    $("#adjunto_factura").attr("disabled", true);
    $('#botonesContabilidad').removeClass('d-flex').hide();
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
    $('#botonesAprobarLegalizacion').removeClass('d-flex').hide();
    $("#alerta1").addClass('d-none');
    $("#alerta2").addClass('d-none');
    $("#alerta3").addClass('d-none');
    if (resp[0].TIPO_GASTO === "3") {
      if (resp[0].TIPO_ANTICIPO === "1") $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
      $('#adjuntoAnticipo, #comentarioAnticipo').attr('disabled', true);
      $('#botonesAnticipo, #sectionBtnGA').removeClass('d-flex').hide();
      $('#btnVerAnticipo').removeClass('d-none');
      $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
      $('#checkAdmin, #checkAnticipo, #checkContabilidad, #checkTesoreria').removeClass('d-none').show();
      $('#checkCompesacion').addClass('d-none').hide();
      $('#titleAnticipo').html(`<h5>Anticipo adjunto</h5>`);
    }
    if (rol === 1 || rol === 73) {
      $("#sectionAprobarFactura2").removeClass('d-none');
      $("#botonesAprobarFactura").addClass('d-flex').show();
      $("#comentarioAprobarFactura, #comentarioLegalizacion, #valorAutorizado").attr('disabled', false);
      $('#botonesAprobarLegalizacion').addClass('d-flex').show();
    }
  }

  if (ESTADO === "Q" && TIPO_GASTO === "2") {
    $('#sectionAdmin').hide();
    $('#checkFactura').removeClass('d-none').show();
    $('#checkAprobFactura, #checkContabilidad, #checkTesoreria').addClass('d-none').hide();
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $('#comentarioAprobarFactura').attr('disabled', false);
    $('#botonesAprobarFactura').addClass('d-flex').show();
    $("#sectionFactura").removeClass('d-none');
    $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #subTotalFactura2, #iva2, #comentarioFactura").attr("disabled", true);
    $('#numeroPreliminar').val(resp[0].NUMERO_PRELIMINAR);
    // $('#fechaPreliminar').val(formatDate(resp[0].FECHA_PRELIMINAR));
    $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $('#btnVerFacturaDiv').addClass('d-flex').show();
    $('#adjunto_facturaDiv').hide();
    $('#comentarioFacturaDiv').hide();
    $('#btnVerFacturaDiv').removeClass('d-none');
    $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
    $("#razonSocial2").val(resp[0].NIT);
    $("#valorFactura2").val(resp[0].VALOR_DOCUMENTO);
    $("#subTotalFactura2").val(resp[0].SUBTOTAL_DOCUMENTO);
    $("#iva2").val(resp[0].IVA_DOCUMENTO);
    $("#sectionBtnGF").removeClass("d-flex").addClass("d-none");
    $("#sectionAprobarFactura").addClass('d-none');
    $("#fechaCausacion").val("");
    $("#fechaCausacion").attr("disabled", true);
    $("#numeroCausacion").val("");
    $("#numeroCausacion").attr("disabled", true);
    $("#fechaPago").val("");
    $("#fechaPago").attr("disabled", true);
    $("#comentarioContabilidad").val("");
    $("#comentarioContabilidad").attr("disabled", true);
    $("#comentarioTesoreria").val("");
    $("#comentarioTesoreria").attr("disabled", true);
    $("#adjuntoPago").val("");
    $("#adjuntoPago").attr("disabled", true);
    $('#botonesContabilidad').removeClass('d-flex').hide();
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $("#alerta1").addClass('d-none');
    $("#alerta2").addClass('d-none');
    $("#alerta3").addClass('d-none');
    if (rol === 1 || rol === 73) {
      $("#sectionAprobarFactura").removeClass('d-none');
      $("#botonesAprobarFactura").addClass('d-flex').show();
      $("#comentarioAprobarFactura").attr('disabled', false);
    }
  }

  if (ESTADO === "Q" && TIPO_GASTO === "1") {
    $('#sectionAdmin').show();
    $('#botonesAdmin').removeClass('d-flex').hide();
    $('#checkAdmin, #checkFactura').removeClass('d-none').show();
    $('#fechaAutorizacionDiv').removeClass('d-none');
    $('#checkAprobFactura, #checkContabilidad, #checkTesoreria').addClass('d-none').hide();
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    // $('#fechaAprobarPreliminar').val(getFechaHoraActual());
    $("#sectionAprobarFactura").addClass('d-none');
    $("#sectionFactura").removeClass('d-none');
    $("#numeroPreliminar").val(resp[0].NUMERO_PRELIMINAR);
    $('#btnVerFacturaDiv').addClass('d-flex').show();
    $('#adjunto_facturaDiv').hide();
    $('#comentarioFacturaDiv').hide();
    $('#btnVerFacturaDiv').removeClass('d-none');
    $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
    $("#razonSocial2").val(resp[0].NIT);
    $("#valorFactura2").val(resp[0].VALOR_DOCUMENTO);
    $("#subTotalFactura2").val(resp[0].VALOR_DOCUMENTO);
    $("#iva2").val(resp[0].IVA_DOCUMENTO);
    $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #subTotalFactura2, #valorFactura2, #iva2").attr("disabled", true);
    $("#fechaPreliminar").val(resp[0].FECHA_PRELIMINAR);
    $("#fechaPreliminar").attr("disabled", true);
    $("#adjunto_factura").attr("disabled", true);
    $("#comentarioFactura").attr("disabled", true);
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $('input[type="radio"]')[(resp[0].ARCHIVO_SELECCIONADO) ? resp[0].ARCHIVO_SELECCIONADO : 0].checked = true;
    $("#fechaAutorizacion").val(formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $("#sectionBtnGF").removeClass("d-flex").addClass("d-none");
    $("#fechaCausacion").val("");
    $("#fechaCausacion").attr("disabled", true);
    $("#numeroCausacion").val("");
    $("#numeroCausacion").attr("disabled", true);
    $("#fechaPago").val("");
    $("#fechaPago").attr("disabled", true);
    $("#comentarioContabilidad").val("");
    $("#comentarioContabilidad").attr("disabled", true);
    $("#comentarioTesoreria").val("");
    $("#comentarioTesoreria").attr("disabled", true);
    $("#adjuntoPago").val("");
    $("#adjuntoPago").attr("disabled", true);
    $('#botonesContabilidad').removeClass('d-flex').hide();
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $("#alerta1").addClass('d-none');
    $("#alerta2").addClass('d-none');
    $("#alerta3").addClass('d-none');
    if (rol === 1 || rol === 73) {
      $("#sectionAprobarFactura").removeClass('d-none');
      $("#botonesAprobarFactura").addClass('d-flex').show();
      $("#comentarioAprobarFactura").attr('disabled', false);
    }
  }

  if (ESTADO === "T" && TIPO_GASTO === "1") {
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $('#sectionAdmin').show();
    $('#fechaAutorizacionDiv').removeClass('d-none');
    $('#checkAdmin, #checkFactura, #checkAprobFactura').removeClass('d-none').show();
    $('#checkContabilidad, #checkTesoreria').addClass('d-none').hide();
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('input[type="radio"]')[(resp[0].ARCHIVO_SELECCIONADO) ? resp[0].ARCHIVO_SELECCIONADO : 0].checked = true;
    $('#botonesAdmin').removeClass('d-flex').hide();
    $("#sectionFactura").removeClass('d-none');
    $("#numeroPreliminar").val(resp[0].NUMERO_PRELIMINAR);
    $('#btnVerFacturaDiv').addClass('d-flex').show();
    $('#adjunto_facturaDiv').hide();
    $('#comentarioFacturaDiv').hide();
    $('#btnVerFacturaDiv').removeClass('d-none');
    $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
    $("#razonSocial2").val(resp[0].NIT);
    $("#valorFactura2").val(resp[0].VALOR_DOCUMENTO);
    $("#subTotalFactura2").val(resp[0].SUBTOTAL_DOCUMENTO);
    $("#iva2").val(resp[0].IVA_DOCUMENTO);
    $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #subTotalFactura2, #valorFactura2, #iva2").attr("disabled", true);
    $("#adjunto_factura").attr("disabled", true);
    $("#comentarioFactura").attr("disabled", true);
    $("#sectionBtnGF").removeClass("d-flex").addClass("d-none");
    $("#sectionAprobarFactura").removeClass('d-none');
    $('#fechaAprobarPreliminar').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
    $('#fechaAprobarPreliminarDiv').removeClass('d-none');
    $('#fechaAprobarPreliminar').attr('disabled', true);
    $('#comentarioAprobarFactura').attr('disabled', true);
    // $("#fechaCausacion").val(getFechaHoraActual);
    $("#fechaPago").val("");
    $("#fechaPago").attr("disabled", true);
    $("#adjuntoPago").val("");
    $("#adjuntoPago").attr("disabled", true);
    $("#comentarioTesoreria").val("");
    $("#comentarioTesoreria").attr("disabled", true);
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesAprobarFactura').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $("#alerta1").addClass('d-none');
    $("#alerta2").addClass('d-none');
    $("#alerta3").addClass('d-none');
    if (rol !== 26 && rol !== 69) {
      $("#comentarioContabilidad").attr("disabled", true);
      $("#numeroCausacion").attr("disabled", true);
      $('#botonesContabilidad').removeClass('d-flex').hide();
    }
  }

  if (ESTADO === "T" && TIPO_GASTO === "3") {
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $('#sectionAdmin, #sectionCompensacion').show();
    $('#checkAdmin, #checkFactura2, #checkAprobFactura2, #checkContabilidad, #checkTesoreria, #checkLegalizacion').removeClass('d-none').show();
    $('#checkCompesacion').addClass('d-none').hide();
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $('#fechaAutorizacionDiv').removeClass('d-none');
    $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('#botonesAdmin').removeClass('d-flex').hide();
    $("#sectionFactura").addClass('d-none');
    $("#numeroPreliminar3").val(resp[0].NUMERO_PRELIMINAR);
    $("#sectionBtnGF2").removeClass("d-flex").addClass("d-none");
    $('#btnVerFacturaDiv2').addClass('d-flex').show();
    $('#verAdjPagoDiv').addClass('d-flex').show();
    $('#adjunto_facturaDiv2').hide();
    $('#comentarioFacturaDiv2').hide();
    $('#fechaPreliminarDiv2').removeClass('d-none');
    $('#fechaPreliminar2').val(formatDate(resp[0].FECHA_PRELIMINAR));
    $('#fechaAnticipoDiv').removeClass('d-none');
    $('#adjuntoAnticipoDiv').hide();
    $("#fechaCausacionDiv").removeClass('d-none');
    $('#adjuntoPagoDiv').hide();
    $("#fechaPagoDiv").removeClass('d-none');
    $("#adjuntoLegalizacion, #valorLegalizacion, #valorAutorizado, #comentarioLegalizacion").attr("disabled", true);
    $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
    $('#botonesAprobarLegalizacion').removeClass('d-flex').hide();
    $("#valorLegalizacion").val(formatNumber(resp[0].VALOR_LEGALIZACION));
    $("#valorAnticipo").val(formatNumber(resp[0].VALOR_ANTICIPO));
    $("#valorAutorizado").val(formatNumber(resp[0].VALOR_AUTORIZADO));
    $("#adjuntoLegalizacionDiv").addClass('d-none');
    $("#btnVerLegalizacionDiv").removeClass('d-none').addClass('d-flex');    
    $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $("#numeroDocumento3").val(resp[0].NUMERO_DOCUMENTO);
    $("#razonSocial3").val(resp[0].NIT);
    $("#valorFactura3").val(resp[0].VALOR_DOCUMENTO);
    $("#subTotalFactura3").val(resp[0].SUBTOTAL_DOCUMENTO);
    $("#iva3").val(resp[0].IVA_DOCUMENTO);
    $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #valorFactura3, #iva3, #subTotalFactura3, #adjunto_factura2, #comentarioFactura2").attr("disabled", true);
    $("#sectionAprobarFactura").addClass('d-none');
    $('#fechaAprobarPreliminarDiv2').removeClass('d-none');
    $('#fechaAprobarPreliminar2').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
    $('#fechaAprobarPreliminar2').attr('disabled', true);
    $('#comentarioAprobarFactura2').attr('disabled', true);
    $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
    $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
    $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
    $("#fechaPago").val(formatDate(resp[0].FECHA_PAGA));
    $("#fechaPago").attr("disabled", true);
    $("#adjuntoPago").val("");
    $("#adjuntoPago").attr("disabled", true);
    $("#comentarioTesoreria").val(resp[0].COMENTARIO_PAGA);
    $("#comentarioTesoreria").attr("disabled", true);
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesAprobarFactura2').removeClass('d-flex').hide();
    $('#botonesCompensacion').addClass('d-flex').show();
    $("#alerta1").addClass('d-none');
    $("#alerta2").addClass('d-none');
    $("#alerta3").addClass('d-none');
    $("#comentarioContabilidad").attr("disabled", true);
    $("#numeroCausacion").attr("disabled", true);
    $('#botonesContabilidad').removeClass('d-flex').hide();
    $('#comentarioCompensacion, #numeroCompensacion').attr('disabled', false);
    $('#comentarioCompensacion, #numeroCompensacion').val("");
    $('#fechaCompensacionDiv').addClass('d-none');
    if (resp[0].TIPO_GASTO === "3") {
      if (resp[0].TIPO_ANTICIPO === "1") $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
      $('#adjuntoAnticipo, #comentarioAnticipo').attr('disabled', true);
      $('#botonesAnticipo, #sectionBtnGA').removeClass('d-flex').hide();
      $('#btnVerAnticipo').removeClass('d-none');
      $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
      $('#checkAdmin, #checkAnticipo, #checkContabilidad, #checkTesoreria').removeClass('d-none').show();
      $('checkCompesacion').addClass('d-none').hide();
      $('#titleAnticipo').html(`<h5>Anticipo adjunto</h5>`);
    }
    if (rolId !== 26 && rolId !== 69) {
      $('#botonesCompensacion').removeClass('d-flex').hide();
      $('#comentarioCompensacion, #numeroCompensacion').attr('disabled', true);
    }
  }

  if (ESTADO === "O" && TIPO_GASTO === "3") {
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $('#sectionAdmin').show();
    $('#sectionAnticipo').show();
    $('#sectionCompensacion').show();
    $('#btnVerFacturaDiv2').removeClass('d-flex').hide();
    $('#checkAdmin, #checkFactura, #checkAprobFactura').removeClass('d-none').show();
    $('#checkContabilidad, #checkTesoreria').addClass('d-none').hide();
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $("#fechaAutorizacionDiv").removeClass('d-none');
    $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('#botonesAdmin').removeClass('d-flex').hide();
    $("#numeroCompensacion, #comentarioCompensacion, #adjuntoLegalizacion, #valorLegalizacion, #valorAutorizado, #comentarioLegalizacions, #comentarioLegalizacion").attr("disabled", true);
    $('#botonesAprobarLegalizacion').removeClass('d-flex').hide();
    $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
    $("#sectionFactura").addClass('d-none');
    $("#numeroPreliminar").val(resp[0].NUMERO_PRELIMINAR);
    $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2, #comentarioAprobarFactura2").attr("disabled", true);
    $('#sectionBtnGF2').removeClass('d-flex').hide();
    $("#sectionAprobarFactura").addClass('d-none');
    $('#fechaAprobarPreliminar').val((resp[0].FECHA_AUTORIZA_PRELI) ? formatDate(resp[0].FECHA_AUTORIZA_PRELI) : "");
    $('#fechaAprobarPreliminar').attr('disabled', true);
    $('#comentarioAprobarFactura').attr('disabled', true);
    // $("#fechaCausacion").val(getFechaHoraActual);
    $("#fechaPago").val("");
    $("#fechaPago").attr("disabled", true);
    $("#adjuntoPago").val("");
    $("#adjuntoPago").attr("disabled", true);
    $("#comentarioTesoreria, #comentarioAnticipo, #comentarioContabilidad, #numeroCausacion").val("");
    $("#comentarioTesoreria").attr("disabled", true);
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesAprobarFactura').removeClass('d-flex').hide();
    $('#botonesAprobarFactura2').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $("#alerta1").addClass('d-none');
    $("#alerta2").addClass('d-none');
    $("#alerta3").addClass('d-none');
    if (resp[0].TIPO_GASTO === "3") {
      if (resp[0].TIPO_ANTICIPO === "1") $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
      $('#adjuntoAnticipo, #comentarioAnticipo').attr('disabled', true);
      $('#botonesAnticipo, #sectionBtnGA').removeClass('d-flex').hide();
      $('#btnVerAnticipo').removeClass('d-none');
      $('#fechaAnticipoDiv').removeClass('d-none');
      $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
      $('#checkAdmin, #checkAnticipo').removeClass('d-none').show();
      $('#adjuntoAnticipoDiv').hide();
      $('#checkContabilidad, #checkTesoreria').addClass('d-none').hide();
      $('#titleAnticipo').html(`<h5>Anticipo adjunto</h5>`);
    }
    if (rol !== 26 && rol !== 69) {
      $("#comentarioContabilidad").attr("disabled", true);
      $("#numeroCausacion").attr("disabled", true);
      $('#botonesContabilidad').removeClass('d-flex').hide();
    }
  }

  if (ESTADO === "T" && TIPO_GASTO === "2") {
    $('#sectionAdmin').hide();
    $('#checkFactura, #checkAprobFactura').removeClass('d-none').show();
    $('#checkContabilidad, #checkTesoreria').addClass('d-none').hide();
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('#botonesContabilidad').addClass('d-flex').show();
    $("#sectionFactura").removeClass('d-none').show();
    $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #subTotalFactura2, #iva2, #comentarioFactura, #adjunto_factura").attr("disabled", true);
    // $('#comentarioAprobarFacturaDiv').hide();
    $('#btnVerFacturaDiv').addClass('d-flex').show();
    $('#adjunto_facturaDiv').hide();
    $('#comentarioFacturaDiv').hide();
    $('#numeroPreliminar').val(resp[0].NUMERO_PRELIMINAR);
    $('#fechaPreliminarDiv').removeClass('d-none');
    $('#fechaPreliminar').val(formatDate(resp[0].FECHA_PRELIMINAR));
    $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
    $("#razonSocial2").val(resp[0].NIT);
    $("#valorFactura2").val(resp[0].VALOR_DOCUMENTO);
    $("#subTotalFactura2").val(resp[0].SUBTOTAL_DOCUMENTO);
    $("#iva2").val(resp[0].IVA_DOCUMENTO);
    $("#sectionBtnGF").removeClass("d-flex").addClass("d-none");
    $("#sectionAprobarFactura").removeClass('d-none');
    $('#fechaAprobarPreliminarDiv').removeClass('d-none');
    $('#fechaAprobarPreliminar').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
    $('#fechaAprobarPreliminar').attr('disabled', true);
    $('#comentarioAprobarFactura').attr('disabled', true);
    // $("#fechaCausacion").val(getFechaHoraActual);
    $("#comentarioContabilidad").attr("disabled", true);
    $("#numeroCausacion").attr("disabled", true);
    $('#botonesContabilidad').removeClass('d-flex').hide();
    $("#fechaPago").val("");
    $("#fechaPago").attr("disabled", true);
    $("#adjuntoPago").val("");
    $("#adjuntoPago").attr("disabled", true);
    $("#comentarioTesoreria, #comentarioContabilidad, #numeroCausacion").val("");
    $("#comentarioTesoreria").attr("disabled", true);
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesAprobarFactura').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $("#alerta1").addClass('d-none');
    $("#alerta2").addClass('d-none');
    $("#alerta3").addClass('d-none');
    if (rol === 26 || rol === 69) {
      $("#comentarioContabilidad").attr("disabled", false);
      $("#numeroCausacion").attr("disabled", false);
      $('#botonesContabilidad').addClass('d-flex').show();
    }
  }

  if (ESTADO === "C" && TIPO_GASTO === "1") {
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $('#sectionAdmin').show();
    $('#fechaAutorizacionDiv').removeClass('d-none');
    $('#checkAdmin, #checkFactura, #checkAprobFactura, #checkContabilidad').removeClass('d-none').show();
    $('#checkTesoreria').addClass('d-none').hide();
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('input[type="radio"]')[(resp[0].ARCHIVO_SELECCIONADO) ? resp[0].ARCHIVO_SELECCIONADO : 0].checked = true;
    $('#botonesAdmin').removeClass('d-flex').hide();
    $("#sectionFactura").removeClass('d-none');
    $("#sectionAprobarFactura").removeClass('d-none');
    $('#fechaAprobarPreliminar').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
    $('#numeroPreliminar').val(resp[0].NUMERO_PRELIMINAR);
    $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #subTotalFactura2, #iva2, #comentarioFactura").attr("disabled", true);
    $('#adjunto_facturaDiv').hide();
    $('#comentarioFacturaDiv').hide();
    $('#numeroPreliminar').val(resp[0].NUMERO_PRELIMINAR);
    $('#fechaPreliminarDiv').removeClass('d-none');
    $('#fechaPreliminar').val(formatDate(resp[0].FECHA_PRELIMINAR));
    $('#btnVerFacturaDiv').addClass('d-flex').show();
    $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
    $("#razonSocial2").val(resp[0].NIT);
    $("#valorFactura2").val(resp[0].VALOR_DOCUMENTO);
    $("#subTotalFactura2").val(resp[0].SUBTOTAL_DOCUMENTO);
    $("#iva2").val(resp[0].IVA_DOCUMENTO);
    $('#fechaAprobarPreliminarDiv').removeClass('d-none');
    $('#fechaPreliminar').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
    $('#numeroPreliminar').attr('disabled', true);
    $('#fechaAprobarPreliminar').attr('disabled', true);
    $('#sectionBtnGF').removeClass('d-flex').hide();
    $('#adjunto_factura').attr('disabled', true);
    $('#comentarioFactura').attr('disabled', true);
    $('#comentarioAprobarFactura').attr('disabled', true);
    $("#fechaCausacion").attr("disabled", true);
    $("#fechaCausacionDiv").removeClass('d-none');
    $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
    $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
    $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
    $("#numeroCausacion").attr("disabled", true);
    $("#comentarioContabilidad").attr("disabled", true);
    $('#botonesContabilidad').removeClass('d-flex').hide();
    // $("#fechaPago").val(getFechaHoraActual);
    $('#botonesAprobarFactura').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $('#alerta1').addClass('d-none');
    $('#alerta2').addClass('d-none');
    $('#alerta3').addClass('d-none');
    if (rol !== 4) {
      $("#fechaPago").attr("disabled", true);
      $("#adjuntoPago").attr("disabled", true);
      $("#comentarioTesoreria").attr("disabled", true);
      $('#botonesTesoreria').removeClass('d-flex').hide();
    }
  }

  if (ESTADO === "C" && TIPO_GASTO === "3") {
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $('#sectionAdmin').show();
    $('#sectionAnticipo').show();
    $('#fechaAutorizacionDiv').removeClass('d-none');
    $('#sectionCompensacion').show();
    // $("#fechaPagoDiv").removeClass('d-none');
    $('#btnVerFacturaDiv2').removeClass('d-flex').hide();
    // $('#adjuntoPagoDiv').hide();
    $('#checkAdmin, #checkFactura, #checkAprobFactura, #checkContabilidad').removeClass('d-none').show();
    $('#checkTesoreria').addClass('d-none').hide();
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('#botonesAdmin').removeClass('d-flex').hide();
    $("#sectionFactura").addClass('d-none');
    $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2, #comentarioAprobarFactura2").attr("disabled", true);
    $('#sectionBtnGF2').removeClass('d-flex').hide();
    $("#sectionAprobarFactura").addClass('d-none');
    $('#fechaAprobarPreliminar').val((resp[0].FECHA_AUTORIZA_PRELI) ? formatDate(resp[0].FECHA_AUTORIZA_PRELI) : "");
    $('#fechaAprobarPreliminar').attr('disabled', true);
    $('#comentarioAprobarFactura').attr('disabled', true);
    $("#fechaCausacion").attr("disabled", true);
    $("#numeroCompensacion, #comentarioCompensacion, #adjuntoLegalizacion, #valorLegalizacion, #valorAutorizado, #comentarioLegalizacions, #comentarioLegalizacion").attr("disabled", true);
    $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
    $("#fechaCausacionDiv").removeClass('d-none');
    $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
    $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
    $("#numeroCausacion").attr("disabled", true);
    $("#comentarioContabilidad, #numeroCompensacion, #comentarioCompensacion").attr("disabled", true);
    $('#comentarioTesoreria, #adjuntoPago, #numeroCompensacion, #comentarioCompensacion').val("");
    $('#botonesContabilidad').removeClass('d-flex').hide();
    // $("#fechaPago").val(getFechaHoraActual);
    $('#botonesAprobarFactura').removeClass('d-flex').hide();
    $('#botonesAprobarFactura2').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $('#alerta1').addClass('d-none');
    $('#alerta2').addClass('d-none');
    $('#alerta3').addClass('d-none');
    if (resp[0].TIPO_GASTO === "3") {
      if (resp[0].TIPO_ANTICIPO === "1") $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
      $('#adjuntoAnticipo, #comentarioAnticipo').attr('disabled', true);
      $('#botonesAnticipo, #sectionBtnGA').removeClass('d-flex').hide();
      $('#btnVerAnticipo').removeClass('d-none');
      $('#fechaAnticipoDiv').removeClass('d-none');
      $('#adjuntoAnticipoDiv').hide();
      $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
      $('#checkAdmin, #checkAnticipo, #checkContabilidad').removeClass('d-none').show();
      $('#checkTesoreria').addClass('d-none').hide();
      $('#titleAnticipo').html(`<h5>Anticipo adjunto</h5>`);
    }
    if (rol !== 4) {
      $("#adjuntoPago").attr("disabled", true);
      $("#comentarioTesoreria").attr("disabled", true);
      $('#botonesTesoreria').removeClass('d-flex').hide();
    }
  }

  if (ESTADO === "C" && TIPO_GASTO === "2") {
    $('#sectionAdmin').hide();
    $('#checkFactura, #checkAprobFactura, #checkContabilidad').removeClass('d-none').show();
    $('#checkTesoreria, #checkCompesacion').addClass('d-none').hide();
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $("#sectionFactura").removeClass('d-none').show();
    $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #subTotalFactura2, #iva2, #comentarioFactura").attr("disabled", true);
    $('#adjunto_facturaDiv').hide();
    $('#comentarioFacturaDiv').hide();
    $('#numeroPreliminar').val(resp[0].NUMERO_PRELIMINAR);
    $('#fechaPreliminarDiv').removeClass('d-none');
    $('#fechaPreliminar').val(formatDate(resp[0].FECHA_PRELIMINAR));
    $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $('#btnVerFacturaDiv').addClass('d-flex').show();
    $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
    $("#razonSocial2").val(resp[0].NIT);
    $("#valorFactura2").val(resp[0].VALOR_DOCUMENTO);
    $("#subTotalFactura2").val(resp[0].SUBTOTAL_DOCUMENTO);
    $("#iva2").val(resp[0].IVA_DOCUMENTO);
    $("#sectionBtnGF").removeClass("d-flex").addClass("d-none");
    $("#sectionAprobarFactura").removeClass('d-none');
    $('#fechaAprobarPreliminarDiv').removeClass('d-none');
    $('#fechaAprobarPreliminar').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
    $('#comentarioAprobarFactura').attr('disabled', true);
    $("#fechaCausacion").attr("disabled", true);
    $("#fechaCausacionDiv").removeClass('d-none');
    $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
    $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
    $("#comentarioTesoreria").val("");
    $("#adjuntoPago").attr("disabled", true);
    $("#comentarioTesoreria").attr("disabled", true);
    $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
    $("#numeroCausacion").attr("disabled", true);
    $("#comentarioContabilidad").attr("disabled", true);
    $('#botonesContabilidad').removeClass('d-flex').hide();
    // $("#fechaPago").val(getFechaHoraActual);
    $('#botonesAprobarFactura').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#alerta1').addClass('d-none');
    $('#alerta2').addClass('d-none');
    $('#alerta3').addClass('d-none');
    if (rol === 4) {
      $("#adjuntoPago").attr("disabled", false);
      $("#comentarioTesoreria").attr("disabled", false);
      $('#botonesTesoreria').addClass('d-flex').show();
    }
  }

  if (ESTADO === "P" && TIPO_GASTO === "2") {
    $('#sectionAdmin').hide();
    $('#sectionBtnGF').removeClass('d-flex').hide();
    $('#checkFactura, #checkAprobFactura, #checkContabilidad, #checkTesoreria').removeClass('d-none').show();
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('input[type="radio"]')[(resp[0].ARCHIVO_SELECCIONADO) ? resp[0].ARCHIVO_SELECCIONADO : 0].checked = true;
    $('#fechaAprobarPreliminar').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
    $('#fechaAprobarPreliminar').attr('disabled', true);
    $('#comentarioAprobarFactura').attr('disabled', true);
    $('#botonesAdmin').removeClass('d-flex').hide();
    $("#sectionFactura").removeClass('d-none').show();
    $('#adjunto_facturaDiv').hide();
    $('#comentarioFacturaDiv').hide();
    $('#adjuntoPagoDiv').hide();
    $('#fechaPreliminarDiv').removeClass('d-none');
    $('#fechaAprobarPreliminarDiv').removeClass('d-none');
    $("#fechaCausacionDiv").removeClass('d-none');
    $("#fechaPagoDiv").removeClass('d-none');
    $('#fechaPreliminar').val(formatDate(resp[0].FECHA_PRELIMINAR));
    $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $('#btnVerFacturaDiv').addClass('d-flex').show();
    $('#verAdjPagoDiv').addClass('d-flex').show();
    $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
    $("#numeroPreliminar").val(resp[0].NUMERO_PRELIMINAR);
    $("#razonSocial2").val(resp[0].NIT);
    $("#valorFactura2").val(resp[0].VALOR_DOCUMENTO);
    $("#subTotalFactura2").val(resp[0].SUBTOTAL_DOCUMENTO);
    $("#iva2").val(resp[0].IVA_DOCUMENTO);
    $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #iva2, #subTotalFactura2, #comentarioFactura").attr("disabled", true);
    $("#sectionAprobarFactura").removeClass('d-none');
    $("#fechaCausacion").attr("disabled", true);
    $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
    $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
    $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
    $("#numeroCausacion").attr("disabled", true);
    $("#comentarioContabilidad").attr("disabled", true);
    $('#botonesContabilidad').removeClass('d-flex').hide();
    $("#fechaPago").val(formatDate(resp[0].FECHA_PAGA));
    $("#fechaPago").attr("disabled", true);
    $("#comentarioTesoreria").val(resp[0].COMENTARIO_PAGA);
    $("#comentarioTesoreria").attr("disabled", true);
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesAprobarFactura').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $("#adjuntoPago").attr("disabled", true);
    $("#alerta").addClass('d-none');
    $('#alerta1').addClass('d-none');
    $('#alerta2').addClass('d-none');
    $('#alerta3').addClass('d-none');
  }

  if (ESTADO === "P" && TIPO_GASTO === "1") {
    $('#sectionAdmin').show();
    $('#checkAdmin, #checkFactura, #checkAprobFactura, #checkContabilidad, #checkTesoreria').removeClass('d-none').show();
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $('#fechaAutorizacionDiv').removeClass('d-none');
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('input[type="radio"]')[(resp[0].ARCHIVO_SELECCIONADO) ? resp[0].ARCHIVO_SELECCIONADO : 0].checked = true;
    $('#fechaAprobarPreliminar').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
    $('#fechaAprobarPreliminar').attr('disabled', true);
    $('#comentarioAprobarFactura').attr('disabled', true);
    $('#botonesAdmin').removeClass('d-flex').hide();
    $("#sectionFactura").removeClass('d-none');
    $('#numeroPreliminar').val(resp[0].NUMERO_PRELIMINAR);
    $('#fechaPreliminar').val(formatDate(resp[0].FECHA_PRELIMINAR));
    $('#adjunto_facturaDiv').hide();
    $('#comentarioFacturaDiv').hide();
    $('#adjuntoPagoDiv').hide();
    $('#fechaPreliminarDiv').removeClass('d-none');
    $('#fechaAprobarPreliminarDiv').removeClass('d-none');
    $("#fechaCausacionDiv").removeClass('d-none');
    $("#fechaPagoDiv").removeClass('d-none');
    $('#btnVerFacturaDiv').addClass('d-flex').show();
    $('#verAdjPagoDiv').addClass('d-flex').show();
    $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
    $("#razonSocial2").val(resp[0].NIT);
    $("#valorFactura2").val(resp[0].VALOR_DOCUMENTO);
    $("#subTotalFactura2").val(resp[0].SUBTOTAL_DOCUMENTO);
    $("#iva2").val(resp[0].IVA_DOCUMENTO);
    $("#sectionBtnGF").removeClass("d-flex").addClass("d-none");
    $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #subTotalFactura2, #iva2, #comentarioFactura, #adjunto_factura").attr("disabled", true);
    $("#sectionAprobarFactura").removeClass('d-none');
    $("#fechaCausacion").attr("disabled", true);
    $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
    $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
    $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
    $("#numeroCausacion").attr("disabled", true);
    $("#comentarioContabilidad").attr("disabled", true);
    $('#botonesContabilidad').removeClass('d-flex').hide();
    $("#fechaPago").val(formatDate(resp[0].FECHA_PAGA));
    $("#fechaPago").attr("disabled", true);
    $("#comentarioTesoreria").val(resp[0].COMENTARIO_PAGA);
    $("#comentarioTesoreria").attr("disabled", true);
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesAprobarFactura').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $("#adjuntoPago").attr("disabled", true);
    $('#alerta1').addClass('d-none');
    $('#alerta2').addClass('d-none');
    $('#alerta3').addClass('d-none');
  }

  if (ESTADO === "P" && TIPO_GASTO === "3") {
    $('#sectionAdmin').show();
    $('#sectionCompenacion').show();
    $("#fechaPagoDiv").removeClass('d-none');
    $('#adjuntoPagoDiv').hide();
    $("#fechaAutorizacionDiv").removeClass('d-none');
    $('#verAdjPagoDiv').addClass('d-flex').show();
    $('#checkAdmin, #checkContabilidad, #checkTesoreria').removeClass('d-none').show();
    $('#checkFactura, #checkAprobFactura').addClass('d-none').hide();
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $('#btnVerFacturaDiv2').removeClass('d-flex').hide();
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('#fechaAprobarPreliminar').val((resp[0].FECHA_AUTORIZA_PRELI) ? formatDate(resp[0].FECHA_AUTORIZA_PRELI) : "");
    $('#fechaAprobarPreliminar').attr('disabled', true);
    $('#comentarioAprobarFactura').attr('disabled', true);
    $('#botonesAdmin').removeClass('d-flex').hide();
    $("#sectionAprobarFactura").addClass('d-none');
    $("#fechaCausacion").attr("disabled", true);
    $("#adjuntoLegalizacion, #valorLegalizacion, #valorAutorizado, #comentarioLegalizacions, #comentarioLegalizacion").attr("disabled", true);
    $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
    $("#fechaCausacionDiv").removeClass('d-none');
    $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
    $("#comentarioContabilidad").attr("disabled", true);
    $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
    $("#numeroCausacion").attr("disabled", true);
    $("#numeroCompensacion").val("");
    $("#numeroCompensacion").attr("disabled", true);
    $("#comentarioCompensacion").val("");
    $("#comentarioCompensacion").attr("disabled", true);
    $('#sectionBtnGF').removeClass('d-flex').hide();
    $('#numeroPreliminar').attr('disabled', true);
    $('#numeroPreliminar').val("");
    $('#adjunto_factura').attr('disabled', true);
    $('#comentarioFactura').attr('disabled', true);
    // $('#fechaPreliminar').val(getFechaHoraActual());
    $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $("#numeroDocumento2").val("");
    $("#razonSocial2").val("");
    $("#valorFactura2").val("");
    $("#iva2").val("");
    $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2, #comentarioAprobarFactura2").attr("disabled", true);
    $('#sectionBtnGF2').removeClass('d-flex').hide();
    $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
    $('#botonesAprobarLegalizacion').removeClass('d-flex').hide();
    $('#botonesContabilidad').removeClass('d-flex').hide();
    $("#fechaPago").val(formatDate(resp[0].FECHA_PAGA));
    $("#fechaPago").attr("disabled", true);
    $("#comentarioTesoreria").val(resp[0].COMENTARIO_PAGA);
    $("#comentarioTesoreria").attr("disabled", true);
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesAprobarFactura').removeClass('d-flex').hide();
    $('#botonesAprobarFactura2').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $("#adjuntoPago").attr("disabled", true);
    $('#alerta1').addClass('d-none');
    $('#alerta2').addClass('d-none');
    $('#alerta3').addClass('d-none');
    if (resp[0].TIPO_GASTO === "3") {
      if (resp[0].TIPO_ANTICIPO === "1") $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
      $('#adjuntoAnticipo, #comentarioAnticipo').attr('disabled', true);
      $('#botonesAnticipo, #sectionBtnGA').removeClass('d-flex').hide();
      $('#btnVerAnticipo').removeClass('d-none');
      $('#fechaAnticipoDiv').removeClass('d-none');
      $('#adjuntoAnticipoDiv').hide();
      $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
      $('#checkAdmin, #checkAnticipo, #checkContabilidad, #checkTesoreria').removeClass('d-none').show();
      $('#checkCompesacion').addClass('d-none').hide();
      $('#titleAnticipo').html(`<h5>Anticipo adjunto</h5>`);
    }
    if (resp[0].USUARIO_SOLICITA === await getDatosUsuario()) {
      $('#sectionBtnGF2').addClass('d-flex').removeClass('d-none').show();
      $('#btnGuardarLegalDiv').addClass('d-flex').removeClass('d-none').show();
      $("#adjuntoLegalizacion, #valorLegalizacion, #comentarioLegalizacions, #comentarioLegalizacion").attr("disabled", false);
      $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2").attr("disabled", false);
    }
  }

  if (ESTADO === "W" && TIPO_GASTO === "3") {
    $('#divBtnRestaurar').removeClass('d-flex').hide();
    $('#sectionAdmin, #sectionCompensacion').show();
    $('#checkAdmin, #checkFactura2, #checkAprobFactura2, #checkContabilidad, #checkTesoreria, #checkCompesacion, #checkLegalizacion').removeClass('d-none').show();
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $('#fechaAutorizacionDiv').removeClass('d-none');
    $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $('#botonesAdmin').removeClass('d-flex').hide();
    $("#sectionFactura").addClass('d-none');
    $("#numeroPreliminar3").val(resp[0].NUMERO_PRELIMINAR);
    $("#sectionBtnGF2").removeClass("d-flex").addClass("d-none");
    $('#btnVerFacturaDiv2').addClass('d-flex').show();
    $('#verAdjPagoDiv').addClass('d-flex').show();
    $('#adjunto_facturaDiv2').hide();
    $('#comentarioFacturaDiv2').hide();
    $('#fechaPreliminarDiv2').removeClass('d-none');
    $('#fechaPreliminar2').val(formatDate(resp[0].FECHA_PRELIMINAR));
    $('#fechaAnticipoDiv').removeClass('d-none');
    $('#adjuntoAnticipoDiv').hide();
    $("#fechaCausacionDiv").removeClass('d-none');
    $('#adjuntoPagoDiv').hide();
    $("#fechaPagoDiv").removeClass('d-none');
    $("#fechaCompensacionDiv").removeClass('d-none');
    $("#fechaCompensacion").val(formatDate(resp[0].FECHA_COMPENSACION));
    $("#numeroCompensacion").val(resp[0].NUMERO_COMPENSACION);
    $("#adjuntoLegalizacion, #valorLegalizacion, #valorAutorizado, #comentarioLegalizacion, #comentarioLegalizacion").attr("disabled", true);
    $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
    $('#botonesAprobarLegalizacion').removeClass('d-flex').hide();
    $("#valorLegalizacion").val(formatNumber(resp[0].VALOR_LEGALIZACION));
    $("#valorAnticipo").val(formatNumber(resp[0].VALOR_ANTICIPO));
    $("#valorAutorizado").val(formatNumber(resp[0].VALOR_AUTORIZADO));
    $("#adjuntoLegalizacionDiv").addClass('d-none');
    $("#btnVerLegalizacionDiv").removeClass('d-none').addClass('d-flex');
    $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $("#fechaFactura3").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
    $("#numeroDocumento3").val(resp[0].NUMERO_DOCUMENTO);
    $("#razonSocial3").val(resp[0].NIT);
    $("#valorFactura3").val(resp[0].VALOR_DOCUMENTO);
    $("#subTotalFactura3").val(resp[0].SUBTOTAL_DOCUMENTO);
    $("#iva3").val(resp[0].IVA_DOCUMENTO);
    $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #valorFactura3, #iva3, #subTotalFactura3, #adjunto_factura2, #comentarioFactura2").attr("disabled", true);
    $("#sectionAprobarFactura").addClass('d-none');
    $('#fechaAprobarPreliminarDiv2').removeClass('d-none');
    $('#fechaAprobarPreliminar2').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
    $('#fechaAprobarPreliminar2').attr('disabled', true);
    $('#comentarioAprobarFactura2').attr('disabled', true);
    $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
    $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
    $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
    $("#fechaPago").val(formatDate(resp[0].FECHA_PAGA));
    $("#fechaPago").attr("disabled", true);
    $("#adjuntoPago").val("");
    $("#adjuntoPago").attr("disabled", true);
    $("#comentarioTesoreria").val(resp[0].COMENTARIO_PAGA);
    $("#comentarioTesoreria").attr("disabled", true);
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesAprobarFactura2').removeClass('d-flex').hide();
    $('#botonesCompensacion').addClass('d-flex').show();
    $("#alerta1").addClass('d-none');
    $("#alerta2").addClass('d-none');
    $("#alerta3").addClass('d-none');
    $("#comentarioContabilidad").attr("disabled", true);
    $("#numeroCausacion").attr("disabled", true);
    $('#botonesContabilidad').removeClass('d-flex').hide();
    $('#comentarioCompensacion, #numeroCompensacion').attr('disabled', false);
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $('#comentarioCompensacion, #numeroCompensacion').attr('disabled', true);
    if (resp[0].TIPO_GASTO === "3") {
      if (resp[0].TIPO_ANTICIPO === "1") $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
      $('#adjuntoAnticipo, #comentarioAnticipo').attr('disabled', true);
      $('#botonesAnticipo, #sectionBtnGA').removeClass('d-flex').hide();
      $('#btnVerAnticipo').removeClass('d-none');
      $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
      $('#checkAdmin, #checkAnticipo, #checkContabilidad, #checkTesoreria').removeClass('d-none').show();
      $('checkCompesacion').addClass('d-none').hide();
      $('#titleAnticipo').html(`<h5>Anticipo adjunto</h5>`);
    }
  }

  // TODO: REVISAR A FONDO LA FUNCIONALIDAD DE RECHAZAR LA SOLICITUD EN LOS DIFERENTES FLUJOS
  
  if (ESTADO === "R") {
    $('#sectionAdmin').show();
    $('input[type="radio"]').attr("disabled", true);
    $("#comentarioAutoriza").attr("disabled", true);
    $('input[type="radio"]')[0].checked = false;
    $('input[type="radio"]')[1].checked = false;
    $('input[type="radio"]')[2].checked = false;
    $('#fechaAprobarPreliminar').attr('disabled', true);
    $('#comentarioAprobarFactura').attr('disabled', true);
    $('#botonesAdmin').removeClass('d-flex').hide();
    $("#sectionFactura").addClass('d-none');
    $("#sectionAprobarFactura").removeClass('d-none');
    $("#fechaCausacion").attr("disabled", true);
    $("#fechaCausacion").val("");
    $("#comentarioContabilidad").val("");
    $("#numeroCausacion").val("");
    $("#numeroCausacion").attr("disabled", true);
    $("#comentarioContabilidad").attr("disabled", true);
    $('#botonesContabilidad').removeClass('d-flex').hide();
    $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #iva2, #subTotalFactura2, #adjunto_factura, #comentarioFactura").attr("disabled", true);
    $("#fechaPago").val("");
    $("#fechaPago").attr("disabled", true);
    $("#btnVerFactura, #verAdjPago").attr("disabled", true);
    $("#comentarioTesoreria").val("");
    $("#comentarioTesoreria").attr("disabled", true);
    $('#botonesTesoreria').removeClass('d-flex').hide();
    $('#botonesAprobarFactura').removeClass('d-flex').hide();
    $('#botonesCompensacion').removeClass('d-flex').hide();
    $("#adjuntoPago").attr("disabled", true);
    $("#fechaAutorizacion").val(resp[0].FECHA_AUTORIZA);
    $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
    $("#adjuntosModal").show();
    $("#textAdjuntos").show();
    const respuesta = await enviarPeticion({ op: "G_ULTIMOCOMENTARIO", link: "../models/WorkFlow.php", idSolicitud: resp[0].ID });
    $(`#alerta${resp[0].COMENTARIO_RECHAZA}`).removeClass('d-none');
    $(`#alerta${resp[0].COMENTARIO_RECHAZA} > div`).html(`<strong>Rechazado!</strong> ${respuesta[0].COMENTARIO}`);
    if (resp[0].COMENTARIO_RECHAZA === "1") {
      $('#alerta2').addClass('d-none');
      $('#alerta3').addClass('d-none');
      $('#checkAdmin, #checkFactura, #checkAprobFactura, #checkContabilidad, #checkTesoreria').addClass('d-none').hide();
    } else if (resp[0].COMENTARIO_RECHAZA === "2") {
      $('#alerta1').addClass('d-none');
      $('#alerta3').addClass('d-none');
      $('#checkFactura').removeClass('d-none').show();
      $('#checkAprobFactura, #checkContabilidad, #checkTesoreria').addClass('d-none').hide();
    } else {
      $('#alerta1').addClass('d-none');
      $('#alerta2').addClass('d-none');
      $('#checkFactura').removeClass('d-none').show();
      $('#checkAprobFactura2, #checkContabilidad, #checkTesoreria, #checkCompesacion').addClass('d-none').hide();
    }
    if (rolId === 1 || rolId === 73) {
      $("#comentarioAutoriza").attr("disabled", false);
      $('input[type="radio"]').attr("disabled", false);
      $('#botonesAdmin').addClass('d-flex').show();
      $('#btnRechazar').attr('disabled', true);
      $('#btnRechazar').addClass('btn-disabled');
      $('#btnRechazar').removeClass('btn-warning');
      $('#divBtnRestaurar').removeClass('d-flex').hide();
    }
    if (resp[0].COMENTARIO_RECHAZA === "2") {
      $('#sectionAdmin').hide();
      $('#sectionFactura').removeClass('d-none');
      $("#fechaPreliminar").val(resp[0].FECHA_PRELIMINAR);
      $("#numeroPreliminar").val(resp[0].NUMERO_PRELIMINAR);
      $("#numeroPreliminar").attr('disabled', false);
      $("#adjunto_factura").attr('disabled', false);
      $("#comentarioFactura").attr('disabled', false);
      $("#adjuntosModal").hide();
      $("#textAdjuntos").hide();
    }
    if (resp[0].USUARIO_SOLICITA === await getDatosUsuario() && resp[0].COMENTARIO_RECHAZA === "1") {
      $('#divBtnRestaurar').addClass('d-flex').removeClass('d-none').show();
    }
  }

  if (ESTADO !== "T" && TIPO_GASTO !== "3") {
    $('#comentarioCompensacion, #numeroCompensacion').attr('disabled', true);
    $('#comentarioCompensacion, #numeroCompensacion').val("");
  }

  if (TIPO_GASTO !== "3") {
    $('#sectionCompensacion').hide();
    $('#sectionAnticipo').hide();
    $("#sectionFactura2").addClass('d-none');
    $("#sectionAprobarFactura2").addClass('d-none');
    $('#comentarioCompensacion, #numeroCompensacion').attr('disabled', true);
  }

  if (ESTADO !== "S") {
    $('#adjunto1ModalDiv').hide();
    $('#adjunto2ModalDiv').hide();
    $('#adjunto3ModalDiv').hide();
    $('#btnActualizarAdjDiv').removeClass('d-flex').hide();
  }

  if (TIPO_GASTO === "3" && resp[0].TIPO_ANTICIPO === "2") {
    $('#textArchivos').text("Observar solicitud de anticipo").show();
    $('input[type="radio"]').attr("disabled", true);
    $('#gridRadios1Div').hide();
    $('#gridRadios2Div').hide();
    $('#sectionAprobarFactura2').hide();
    $('#btnActualizarAdjDiv').css("width", "59%");
    $('#sectionLegalizacion').removeClass('d-none');
  } else {
    $('#sectionLegalizacion').addClass('d-none');
  }

  if (TIPO_GASTO === "3" && resp[0].TIPO_ANTICIPO === "3") {
    $('#textArchivos').text("Solicitud de anticipo").show();
    $('#gridRadios1Div').hide();
    $('#sectionFactura2').removeClass('d-none');
    $('#sectionAprobarFactura2').removeClass('d-none');
    $('#btnActualizarAdjDiv').css("width", "59%");
  }

  if (TIPO_GASTO === "3" && resp[0].TIPO_ANTICIPO === "1") {
    // $('#textArchivos').text("Solicitud de anticipo").show();
    $('#gridRadios1Div').show();
    $('#gridRadios2Div').show();
    $('#sectionFactura2').removeClass('d-none');
    $('#sectionAprobarFactura2').removeClass('d-none');
    $('#btnActualizarAdjDiv').css("width", "64%");
    $('#sectionAnticipo').show();
  } 

  if (TIPO_GASTO === "1") {
    $("#sectionFactura").removeClass('d-none');
    $("#sectionAprobarFactura").removeClass('d-none');
    $('#gridRadios1Div').show();
    $('#gridRadios2Div').show();
    $('#btnActualizarAdjDiv').css("width", "64%");
  }

  if (resp[0].TIPO_ANTICIPO !== "1" && resp[0].TIPO_ANTICIPO !== "3") {
    $('#sectionFactura2').addClass('d-none');
    $('#sectionAprobarFactura2').addClass('d-none');
  }

  if (ESTADO === "R" && resp[0].USUARIO_SOLICITA === await getDatosUsuario() && resp[0].COMENTARIO_RECHAZA === "1") {
    $("#adjuntosModal").show();
  }
}

const validacionCamposRadios = (resp) => {
  if (resp[0].ADJUNTO_SOLICITA_1 !== "") {
    $("#adjCheck1").addClass("d-flex").removeClass('d-none');
    $("#btnVerAdj1").on("click", () => {
      let elementoIframe = `<iframe src="${url_file}/web/workflow/${resp[0].ADJUNTO_SOLICITA_1.trim()}.pdf" width="100%" height="600px"></iframe>`;
      $("#visorPDF").html(elementoIframe);
      $('#modalVistaArchivos').modal('show');
    });
  }

  if (resp[0].ADJUNTO_SOLICITA_2 !== "") {
    $("#adjCheck2").addClass("d-flex").removeClass('d-none');
    $("#btnVerAdj2").on("click", () => {
      let elementoIframe = `<iframe src="${url_file}/web/workflow/${resp[0].ADJUNTO_SOLICITA_2.trim()}.pdf" width="100%" height="600px"></iframe>`;
      $("#visorPDF").html(elementoIframe);
      $('#modalVistaArchivos').modal('show');
    });
  }

  if (resp[0].ADJUNTO_SOLICITA_3 !== "") {
    $("#adjCheck3").addClass("d-flex").removeClass('d-none');
    $("#btnVerAdj3").on("click", () => {
      let elementoIframe = `<iframe src="${url_file}/web/workflow/${resp[0].ADJUNTO_SOLICITA_3.trim()}.pdf" width="100%" height="600px"></iframe>`;
      $("#visorPDF").html(elementoIframe);
      $('#modalVistaArchivos').modal('show');
    });
  }

  if (resp[0].ADJUNTO_PAGO !== "") {
    $("#verAdjPago").on("click", () => {
      let elementoIframe = `<iframe src="${url_file}/web/workflow/${resp[0].ADJUNTO_PAGO.trim()}.pdf" width="100%" height="600px"></iframe>`;
      $("#visorPDF").html(elementoIframe);
      $('#modalVistaArchivos').modal('show');
    });
  }
}

const verFacturaPreliminar = (resp, sw) => {
  let adjunto;
  if (sw === 1) adjunto = resp[0].ADJUNTO_FACTURA;
  else if (sw === 2) adjunto = resp[0].ADJUNTO_FINALIZA;
  else adjunto = resp[0].ADJUNTO_LEGALIZACION;

  if (adjunto) {
    let url = `${url_file}/web/workflow/${adjunto}.pdf`;
    let elementoIframe = `<iframe src="${url}?t=${new Date().getTime()}" width="100%" height="600px"></iframe>`;
    $("#visorPDF").html(elementoIframe);
    $("#modalVistaArchivos").modal('show');
  }
}

const gestionarSolicitud = async (data) => {
  const usuario = data.usuario.split('\n')[2].split('>')[1].split('<')[0];
  const nombreUsuario = data.usuario.split('>')[2].split('<')[0];
  $('#usuarioInfoM').val(`${usuario} - ${nombreUsuario}`);
  $('#usuarioInfo').val(usuario);
  $('#tipoGastoInfo').val(data.tipo);
  $('#tipoGastoInfoM').val(data.tipo);
  $('#departamentoInfo').val(data.dpto);
  $('#fechaInfo').val(data.fecha.split(',')[0]);
  $('#idOcultoSolicitud').val(data.id);

  const resp = await enviarPeticion({ op: "G_INFOMODAL", idSolicitud: data.id, link: "../models/WorkFlow.php" });
  $("#adjCheck1, #adjCheck2, #adjCheck3").addClass("d-none").removeClass("d-flex");
  $("#btnVerAdj1, #btnVerAdj2, #btnVerAdj3").off("click");
  $('#estadoOcultoSolicitud').val(resp[0].ESTADO);
  let tipoAnticipo = resp[0].TIPO_ANTICIPO;
  if (tipoAnticipo === "1") tipoAnticipo = "- CON COTIZACIÓN";
  if (tipoAnticipo === "2") tipoAnticipo = "- LEGALIZACIÓN DE VIAJE";
  if (tipoAnticipo === "3") tipoAnticipo = "- SIN COTIZACIÓN";
  $('#tipoGastoInfoM').val(`${data.tipo} ${tipoAnticipo}`);

  $('#btnVerFactura').on('click', () => {
    verFacturaPreliminar(resp, 1);
  });

  $('#btnVerFactura2').on('click', () => {
    verFacturaPreliminar(resp, 1);
  });

  $('#btnVerAnticipo').on('click', () => {
    verFacturaPreliminar(resp, 2);
  });

  $('#btnVerLegalizacion').on('click', () => {
    verFacturaPreliminar(resp, 3);
  });

  validacionCamposRadios(resp);
  validarSeccionesXEstados(resp, rolId);
  $('#modalGestionarSolicitud').modal('show');
}

const gestionarLogs = async (idSolicitud) => {
  let estados = {
    'S': { color: '#0A97B0', texto: 'SOLICITUD' },
    'K': { color: '#77dd77', texto: 'APROBACIÓN COTIZACIÓN' },
    'U': { color: '#b7950b', texto: 'SOLICITUD ANTICIPO' },
    'O': { color: '#77dd77', texto: 'APROBACIÓN ANTICIPO' },
    'Q': { color: '#B2A5FF', texto: 'LEGALIZACIÓN' },
    'T': { color: '#77dd77', texto: 'APROBACIÓN LEGALIZACIÓN' },
    'C': { color: '#84b6f4', texto: 'CAUSACIÓN' },
    'P': { color: '#ffda9e', texto: 'PAGO' },
    'F': { color: '#c5c6c8', texto: 'FINALIZACIÓN' },
    'R': { color: '#ff6961', texto: 'RECHAZAR' },
    'N': { color: '#ff6961', texto: 'NO CAUSACIÓN' },
    'M': { color: '#ff6961', texto: 'NO PAGO' },
    'L': { color: '#ff6961', texto: 'NO COMPENSADO' },
    'W': { color: '#FC8F54', texto: 'COMPENSADO' }
  }

  const resp = await enviarPeticion({ op: "G_LOGS", idSolicitud, link: "../models/WorkFlow.php" });
  $(".timeline").html(``);
  resp.forEach((item, index) => {
    const position = index % 2 === 0 ? "left" : "right";
    let timelineItem = `
      <div class="timeline-item" data-position="${position}">
          <div class="timeline-avatar" style="background-color: ${estados[item.ESTADO].color};">${item.ESTADO}</div>
          <div class="timeline-content">
             <div style="width: 100%; margin: 0 auto;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
              padding: 5px 10px; background-color: white; border-radius: 10px;">
                  <p style="margin: 0; padding: 0; font-weight: bold;
                  font-size: 10px; margin-bottom: 3px; color: #453e3e;">
                    ${item.NOMBRE_USUARIO}
                  </p>
                  <P style="margin: 0; padding: 0; font-size: 10px;
                  color: #9f9999;">Acción realizada: <span style="font-size: 9px;
                    font-weight: bold; color: ${estados[item.ESTADO].color}; padding: 0 8px;">
                    ${estados[item.ESTADO].texto}</span>
                  </P>
                  <P style="margin: 0; padding: 0; font-size: 10px; color: #9f9999;">
                  Usuario que realizó la acción: <span style="font-size: 9px; color: #453e3e;">
                    ${item.USUARIO}</span></P>
                  <P style="margin: 0; padding: 0; font-size: 9px; color: #9f9999;">
                  Fecha de la acción: <span style="font-size: 9px; color: #453e3e;">
                  ${formatDate(item.FECHA_HORA)}
                  </span></P>
                  <P style="margin-top: 5px; margin-bottom: 0; padding: 0; font-size: 10px; color: #9f9999;">
                  Comentario: <span style="font-size: 9px; color: #453e3e;">
                  ${item.COMENTARIO}
                  </span></P>
                </div>
          </div>
      </div>`;
      $('.timeline').append(timelineItem);
    });
    
    const response = await enviarPeticion({ op: "G_INFOMODAL", link: "../models/WorkFlow.php", idSolicitud });
    const { ESTADO, USUARIO_SOLICITA } = response[0];

    if (ESTADO === "S" && rolId === 1 || rolId === 73) await actualizarNota(idSolicitud);
    if (ESTADO === "Q" && rolId === 1 || rolId === 73) await actualizarNota(idSolicitud);
    if (ESTADO === "U" && rolId === 1 || rolId === 73) await actualizarNota(idSolicitud);
    if (ESTADO === "K" && await getDatosUsuario() === USUARIO_SOLICITA) await actualizarNota(idSolicitud);
    if (ESTADO === "P" && await getDatosUsuario() === USUARIO_SOLICITA) await actualizarNota(idSolicitud);
    if (ESTADO === "T" && rolId === 26 || rolId === 69) await actualizarNota(idSolicitud);
    if (ESTADO === "O" && rolId === 26 || rolId === 69) await actualizarNota(idSolicitud);
    if (ESTADO === "C" && rolId === 4) await actualizarNota(idSolicitud);
    if (ESTADO === "W" && await getDatosUsuario() === USUARIO_SOLICITA) await actualizarNota(idSolicitud);
    if (ESTADO === "R" && USUARIO_SOLICITA === await getDatosUsuario()) await actualizarNota(idSolicitud);

    $('#modalComentarios').modal('show');
}

const getSolicitudes = async () => {
  const fechaDesde = $('#fechaDesde').val();
  const fechaHasta = $('#fechaHasta').val();
  const oficina = $('#filtroOficina').val();
  const departamento = $('#filtroDepartamentos').val();
  const usuario = await getDatosUsuario();
  try {
    let resp = await enviarPeticion({ op: "G_SOLICITUDES", fechaDesde, fechaHasta, departamento, oficina, link: "../models/WorkFlow.php" });
    resp = resp.data;
    // CONTABILIDAD
    if (rolId === 26 || rolId === 69) resp = resp.filter(elem => elem.ESTADO === "T" || elem.ESTADO === "O" || elem.USUARIO_SOLICITA === usuario);
    // TESORERÍA
    else if (rolId === 4) resp = resp.filter(elem => elem.ESTADO === "C" || elem.USUARIO_SOLICITA === usuario);
    // ADMIN - GERENCIA ADMIN
    else if (rolId === 1 || rolId === 73) resp;
    // USUARIO QUE CREÓ LA SOLICITUD
    else resp = resp.filter(elem => elem.USUARIO === usuario);

    const nuevoObj = resp.map((item) => {
      return {
        idSol: item.ID,
        // organizacion: item.ORGANIZACION_VENTAS_T || 'N/A',
        oficina: item.OFICINA_VENTAS_T.split(' ')[1] || 'N/A',
        dpto: item.DPTO || 'N/A',
        concepto: item.CONCEPTO || 'N/A',
        tipo: tipoGasto[item.TIPO_GASTO] || 'Desconocido',
        usuario: `<div>
                      <p style="margin: 0; font-size: 0.7rem">${item.NOMBRE_USUARIO}</p>
                      <small style="font-size: 0.5rem; margin: 0;">${item.USUARIO_SOLICITA || 'N/A'}</small>
                  </div>`,
        estado: `<div data-item="${item.ID}" class="btn-noti position-relative" style="width: 80px;">
                    <span class="badge estados" style="background-color:${estados[item.ESTADO].color}">${estados[item.ESTADO].texto}</span>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${parseInt(item.INDICADORNOTA) > 0 ? "" : "d-none"}" style="font-size: 7px;">
                    1
                    </span>
                </div>`,
        fecha: item.FECHA_SOLICITA ? formatDate(item.FECHA_SOLICITA).toUpperCase() : 'N/A',
        id: item.ID
      }
    });

    let columNames = ['N° solicitud', 'Oficina', 'Departamento', 'Concepto', 'Tipo Gasto', 'Usuario', 'Estado', 'Fecha'];

    if ($.fn.DataTable.isDataTable("#tablaSolicitudes")) {
      $("#tablaSolicitudes").DataTable().destroy();
      $("#tablaSolicitudes tbody").empty();
    }

    let config = {
      callback: gestionarSolicitud,
      clases: `btn btn-outline-primary btn-sm`,
      customClass: 'btn-gestionar',
      icon: `<i class="fa-solid fa-play"></i>`,
      rowAmount: -1,
      order: [[0, "desc"]],
      dom: "Bfrtip",
	    buttons: [
        {
          extend: "excelHtml5",
          text: "Exportar a Excel",
          title: "Reporte_Datos",
          filename: "Datos_Exportados",
          className: "btn btn-success btn-sm"
        }
      ],
    }

    createDataTable('tablaSolicitudes', nuevoObj, Object.keys(nuevoObj[0] || {}), columNames, null, null, false, '', '', config);
    setTimeout(() => {
      $('#tablaSolicitudes_filter > label > input').css({ "width": "350px", "margin-right": "10px" });
      $('#tablaSolicitudes_length > label').css({ "margin-left": "10px" });      

      $('#tablaSolicitudes').off('click').on('click', '.btn-noti', function (e) {
        const id = $(this).attr('data-item');
        gestionarLogs(id);       
      });      
    }, 500);
  } catch (e) {
    console.error("Error al obtener las solicitudes:", e);
  }
}

const getConteoEstados = async () => {
  const resp = await enviarPeticion({ op: 'G_CONTEOESTADOS', link: '../models/WorkFlow.php' });
  let cantS = "", cantK = "", cantQ = "", cantC = "", cantP = "", cantT = "", cantR = "", cantO = "";
  for (let i = 0; i < resp.length; i++) {
    if (resp[i].ESTADO === 'S') cantS = resp[i].CONTEOESTADOS;
    if (resp[i].ESTADO === 'K') cantK = resp[i].CONTEOESTADOS;
    if (resp[i].ESTADO === 'O') cantO = resp[i].CONTEOESTADOS;
    if (resp[i].ESTADO === 'Q') cantQ = resp[i].CONTEOESTADOS;
    if (resp[i].ESTADO === 'T') cantT = resp[i].CONTEOESTADOS;
    if (resp[i].ESTADO === 'C') cantC = resp[i].CONTEOESTADOS;
    if (resp[i].ESTADO === 'P') cantP = resp[i].CONTEOESTADOS;
    if (resp[i].ESTADO === 'R') cantR = resp[i].CONTEOESTADOS;
  }
  cantS = parseInt((cantS) ? cantS : 0);
  cantQ = parseInt((cantQ) ? cantQ : 0);
  cantO = parseInt((cantO) ? cantO : 0);
  cantT = parseInt((cantT) ? cantT : 0);
  cantK = parseInt((cantK) ? cantK : 0);
  cantP = parseInt((cantP) ? cantP : 0);
  cantR = parseInt((cantR) ? cantR : 0);
  let totalGere = cantS + cantQ;
  let totalSoli = cantK + cantP + cantR;
  let totalConta = cantT + cantO;
  $('#gerencia').text(totalGere);
  $('#contabilidad').text(totalConta);
  $('#tesoreria').text((cantC) ? cantC : "0");
  $('#solicitante').text(totalSoli);

  setTimeout(() => {
    const container = document.querySelector(".container-items-dptos");
    const items = Array.from(document.querySelectorAll(".p-2.d-flex.justify-content-between"));

    const sortedItems = items.map(item => ({
      element: item,
      value: parseInt(item.querySelector("p").textContent, 10)
    })).sort((a, b) => b.value - a.value);

    sortedItems.forEach(({ element }) => container.append(element));
  }, 1000);
}

const agregarConcepto = async () => {
  try {
    if (rolId !== 1) return;
    let concepto = $("#conceptoModal").val().trim().toUpperCase();
    if (!concepto.length) {
      Swal.fire("Concepto vacío", "Debe diligenciar el concepto", "error");
    } else {
      $("#conceptoModal").val("");
      $("#modalAgregarConcepto").modal('hide');
      resp = await enviarPeticion({ op: "I_CONCEPTO", concepto, link: "../models/WorkFlow.php" });
      setTimeout(() => {
        Swal.fire("Guardar concepto", "El concepto ha sido guardado correctamente", "success");
      }, 1000);
      getConceptos();
    }
  } catch (error) {
    console.log(error);
  }
}

const ocultarCampos = (tipoGasto) => {
  if (tipoGasto === 1) { // Cotización
    $('#cotizaciones').show(200);
    $('#datosFactura').hide(200);
    $('#inputNumeroPreliminar').hide(200);
    $('#inputTipoAnticipo').hide(200);
    $('#inputValorAnticipo').hide(200);
    $('#inputArchivo1').show(200);
    $('#inputArchivo2').show(200);
    $('#inputArchivo3').show(200);
    $('#label1').html(`Adjuntar cotización 1<span class="text-danger h6">*</span>`);
    $('#label2').html(`Adjuntar cotización 2<span class="text-danger h6">*</span>`);
  } else if (tipoGasto === 2) { // Factura directa
    $('#cotizaciones').show(200);
    $('#datosFactura').show(200);
    $('#inputNumeroPreliminar').show(200);
    $('#inputTipoAnticipo').hide(200);
    $('#inputValorAnticipo').hide(200);
    $('#inputArchivo1').show(200);
    $('#inputArchivo2').hide(200);
    $('#inputArchivo3').hide(200);
    $('#label1').html(`Adjuntar factura<span class="text-danger h6">*</span>`);
  } else if (tipoGasto === 3) { // Anticipo
    $('#datosFactura').hide(200);
    $('#inputNumeroPreliminar').hide(200);
    $('#inputTipoAnticipo').show(200);
    $('#inputValorAnticipo').show(200);
    $('#cotizaciones').show(200);
    $('#inputArchivo1').hide(200);
    $('#inputArchivo2').hide(200);
    $('#inputArchivo3').hide(200);
    $('#label1').html(`Adjuntar soporte del anticipo<span class="text-danger h6">*</span>`);
  } else {
    $('#cotizaciones').hide(200);
    $('#datosFactura').hide(200);
  }
}

const validarCampos = () => {
  const tipoGasto = $("#tipoGasto").val();
  const tipoAnticipo = $("#tipoAnticipo").val();
  const concepto = $("#conceptoFormulario").val();
  const adjunto = $("#adjunto_1").val();
  const adjunto2 = $("#adjunto_2").val();
  const comentario = $("#comentario_solicitante").val();
  const fechaFactura = $("#fechaFactura").val();
  const numeroDocumento = $("#numeroDocumento").val();
  const razonSocial = $("#razonSocial").val();
  const valorFactura = $("#valorFactura").val();
  const numeroPreliminar = $("#numeroPreliminar2").val();
  const subTotalFactura = $("#subTotalFactura").val();

  if (!tipoGasto) {
    Swal.fire("Campo requerido", "El tipo de gasto es obligatorio", "error");
    return;
  } 

  if (tipoGasto === "1") {
    if (!concepto || !adjunto || !adjunto2 || !comentario) {
      Swal.fire("Campos requeridos", "Todos los campos indicados con asterisco son obligatorios", "error");
      return false;
    } 
  } else if (tipoGasto === "3") {
    if (!tipoAnticipo) {
      Swal.fire("Campo requerido", "El tipo de anticipo  es obligatorio", "error");
      return;
    }
    
    if (tipoAnticipo === "1") {
      if (!concepto || !adjunto || !adjunto2 || !comentario) {
        Swal.fire("Campos requeridos", "Todos los campos indicados con asterisco son obligatorios", "error");
        return false;
      }
    } else {
      if (!concepto || !adjunto ||  !comentario) {
        Swal.fire("Campos requeridos", "Todos los campos indicados con asterisco son obligatorios", "error");
        return false;
      }
    }
  } else {
      if (!concepto || !adjunto || !comentario || !fechaFactura || !subTotalFactura || !numeroDocumento || !razonSocial || !valorFactura || !numeroPreliminar) {
        Swal.fire("Campos requeridos", "Todos los campos indicados con asterisco son obligatorios", "error");
        return false;
      }
  }
  return true;
}

const SubirArchivosAdj = async (id_sol, arr_arch, accion = "1") => {
  for (let i = 0; i < arr_arch.length; i++) {
    if (arr_arch[i]) {
      let nuevoNombre = "";
      if (accion === "1") nuevoNombre = "sol-work-flow-";
      else if (accion === "2") nuevoNombre = "sol-work-flow-p";
      else if (accion === "3") nuevoNombre = "sol-work-flow-an";
      else if (accion === "4") nuevoNombre = "sol-work-flow-pr";
      else if (accion === "5") nuevoNombre = "sol-work-flow-le";
      else nuevoNombre = "sol-work-flow-a";
      let UploadFile = await subirArchivos(arr_arch[i], {
        validateSize: false,
        maxSize: 0,
        validateExt: false,
        typesFile: {},
        ruta: "/web/workflow",
      }, (params = { nuevo_nombre: `${nuevoNombre}${i + 1}_${id_sol}` }));

      if (UploadFile.ok) {
        await enviarPeticion({ nombre: `${nuevoNombre}${i + 1}_${id_sol}`, id_sol, link: "../models/WorkFlow.php", op: "U_ADJUNTOS", adj: i + 1, accion });
      } else {
        console.log(i);
      }
    }
  }
}

const activarNotificacion = async (idSolicitud) => {
  const resp = await enviarPeticion({ op: "A_NOTIFICACION", link: "../models/WorkFlow.php", idSolicitud });
  getSolicitudes();
}

const actualizarArchivosAdj = async () => {
  let usuarioLogueado = await getDatosUsuario();
  let usuarioSolicitud = $("#usuarioInfo").val();
  let estadoSolicitud = $("#estadoOcultoSolicitud").val();

  if (usuarioLogueado === usuarioSolicitud && estadoSolicitud === "S" || estadoSolicitud === "R") {
    let idSolicitud = $("#idOcultoSolicitud").val();
    let archivo1 = document.getElementById("adjunto1Modal").files[0];
    let archivo2 = document.getElementById("adjunto2Modal").files[0];
    let archivo3 = document.getElementById("adjunto3Modal").files[0];
    if (!archivo1 && !archivo2 && !archivo3) {
      Swal.fire("Campo requerido", "Debe adjuntar un archivo", "error");
      return;
    }
    let arr_arch = [archivo1, archivo2, archivo3];
    await SubirArchivosAdj(idSolicitud, arr_arch, "5");
    $("#adjunto1Modal, #adjunto2Modal, #adjunto3Modal").val("");
    Swal.fire("Actualizar adjuntos", "Archivos actualizados correctamente", "success");
    $("#modalGestionarSolicitud").modal('hide');
    await getSolicitudes();
  } else {
    Swal.fire("¡Acción no disponible!", "No puede cambiar los adjuntos", "warning");
  }
}

const insertarComentario = async (idSolicitud, comentario, usuario, estado) => {
  const resp = await enviarPeticion({ 
    op: "I_COMENTARIO", 
    link: "../models/WorkFlow.php", 
    ID_SOLICITUD: idSolicitud, 
    COMENTARIO: comentario, 
    USUARIO: usuario, 
    ESTADO: estado 
  });
  if (resp.ok && comentario.length) await activarNotificacion(idSolicitud);
  return resp;
}

const insertarLog = async (idSolicitud, estado, usuario, idComentario = null) => {
  await enviarPeticion({ op: "I_LOG", link: "../models/WorkFlow.php", idSolicitud, estado, usuario, idComentario });
}

const insertarSolicitud = async () => {
  try {
    if (validarCampos()) {
      const usuario = await getDatosUsuario();
      let tipoGasto = $('#tipoGasto').val();
      let tipoAnticipo = $('#tipoAnticipo').val();
      let comentarioSolicitud = $('#comentario_solicitante').val();
      const data = $("#formCrearSolicitud").serializeArrayAll();
      const dataRequest = formatearArrayRequest(data);
      dataRequest.SUBTOTAL_DOCUMENTO = dataRequest.SUBTOTAL_DOCUMENTO.replace(/\./g, "");
      dataRequest.VALOR_DOCUMENTO = dataRequest.VALOR_DOCUMENTO.replace(/\./g, "");
      dataRequest.VALOR_ANTICIPO = dataRequest.VALOR_ANTICIPO.replace(/\./g, "");
      dataRequest.op = "I_SOLICITUD";
      dataRequest.link = "../models/WorkFlow.php";
      dataRequest.tipoGasto = tipoGasto;
      dataRequest.usuario = await getDatosUsuario();

      let arr_arch;
      if (tipoGasto === "1") {
        let archivo1 = document.getElementById("adjunto_1").files[0];
        let archivo2 = document.getElementById("adjunto_2").files[0];
        let archivo3 = document.getElementById("adjunto_3").files[0];
        arr_arch = [archivo1, archivo2, archivo3];
      } else if (tipoGasto === "3" && tipoAnticipo === "2") {
        let archivo1 = document.getElementById("adjunto_1").files[0];
        let archivo2 = document.getElementById("adjunto_2").files[0];
        arr_arch = [archivo1, archivo2];
      } else if (tipoGasto === "3" && tipoAnticipo === "1") {
        let archivo1 = document.getElementById("adjunto_1").files[0];
        let archivo2 = document.getElementById("adjunto_2").files[0];
        let archivo3 = document.getElementById("adjunto_3").files[0];
        arr_arch = [archivo1, archivo2, archivo3];
      } else {
        let archivo1 = document.getElementById("adjunto_1").files[0];
        arr_arch = [archivo1];
      }

      showLoadingSwalAlert2("Guardando la información...", false);
      const { id, ok } = await enviarPeticion(dataRequest);
      if (!ok) {
        Swal.fire("Error", "No se pudo insertar el registro", "error");
        return;
      }

      let accion = (tipoGasto === "1" || tipoGasto === "3") ? "1" : "4";
      let estado = (tipoGasto !== "2") ? "S" : "Q";

      const idComentario = await insertarComentario(id, comentarioSolicitud, usuario, estado);
      await insertarLog(id, estado, usuario, idComentario.id);

      await SubirArchivosAdj(id, arr_arch, accion);
      dissminSwal();
      Swal.fire("Solicitud", "La solicitud ha sido registrada correctamente", "success");
      getSolicitudes();
      $('#formCrearSolicitud').trigger('reset');
      enviarMail("pruebagerenciaworkflow@yopmail.com", estado, id);
      $('#modalAgregarSolicitud').modal('hide');
    }
  } catch (e) {
    console.log(e);
  }
}

const autorizar = async () => {
  const idSolicitud = $("#idOcultoSolicitud").val();
  const usuario = await getDatosUsuario();
  const comentario = $("#comentarioAutoriza").val();
  const tipoGastoText = $('#tipoGastoInfo').val();
  let tipoAnticipo = $('#tipoGastoInfoM').val();
  tipoAnticipo = (tipoAnticipo.split('-')[1]) ? tipoAnticipo.split('-')[1].trim() : '';
  let estado = "";
  let msgText = "";
  let msgText2 = "";
  if (tipoGastoText === "COTIZACIÓN") {
    estado = "K";
    msgText = "COTIZACIÓN AUTORIZADA";
    msgText2 = "Cotización";
  } else if (tipoGastoText === "ANTICIPO" && tipoAnticipo === "CON COTIZACIÓN") {
    estado = "K";
    msgText = "COTIZACIÓN AUTORIZADA";
    msgText2 = "Cotización";
  } else if (tipoGastoText === "ANTICIPO" && tipoAnticipo !== "CON COTIZACIÓN") {
    estado = "O";
    msgText = "ANTICIPO AUTORIZADO";
    msgText2 = "Anticipo";
  }

  if (tipoGastoText === "COTIZACIÓN" || tipoAnticipo === "CON COTIZACIÓN") {
    if (!$('input[type="radio"]')[0].checked && !$('input[type="radio"]')[1].checked && !$('input[type="radio"]')[2].checked) {
      Swal.fire("Campo requerido", "Debe escoger una de las cotizaciones", "error");
      return;
    }
  }

  const result = await confirmAlert(`Autorizar ${msgText2}`, `La solicitud pasará de estado SOLICITADO a  ${msgText}`);
  if (result.isConfirmed) {
    let campoRadio;
    if ($('input[type="radio"]')[0].checked) campoRadio = "0";
    if ($('input[type="radio"]')[1].checked) campoRadio = "1";
    if ($('input[type="radio"]')[2].checked) campoRadio = "2";
    let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, campoRadio, idSolicitud, link: "../models/WorkFlow.php" });
    if (resp.ok) {
      $("#comentarioAutoriza").val("");
      $('#modalGestionarSolicitud').modal('hide');
      Swal.fire(`Autorización de ${msgText2}`, `${msgText2} autorizado(a)`, "success");
      getSolicitudes();
      let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
      const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
      await insertarLog(idSolicitud, estado, usuario, comentarioID);
      // enviarMail("pruebacontabilidadworkflow@yopmail.com");
    }
  }
}

const aprobarFactura = async (sw) => {
  const idSolicitud = $("#idOcultoSolicitud").val();
  const usuario = await getDatosUsuario();
  let comentario = "";
  let estado = "";
  let msgText = "";
  let msgText2 = "";
  let msgText3 = "";
  let campoRadio;
  if (sw === 1 || sw === 3) {
    comentario = (sw === 1) ? $("#comentarioAprobarFactura").val() : $("#comentarioAprobarFactura2").val();
    estado = "T";
    msgText = "Factura";
    msgText2 = "FACTURA PRELIMINAR";
    msgText3 = "FACTURA APROBADA";
  } else if (sw === 2) {
    comentario = $("#comentarioAnticipo").val();
    estado = "O";
    msgText = "Anticipo";
    msgText2 = "ANTICIPO SOLICITADO";
    msgText3 = "ANTICIPO APROBADO";
    if ($('input[type="radio"]')[0].checked) campoRadio = "0";
    if ($('input[type="radio"]')[1].checked) campoRadio = "1";
    if ($('input[type="radio"]')[2].checked) campoRadio = "2";
  }
  const result = await confirmAlert(`Aprobar ${msgText}`, `La solicitud pasará de estado ${msgText2} a ${msgText3}`);
  if (result.isConfirmed) {
    let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, campoRadio, idSolicitud, link: "../models/WorkFlow.php" });
    if (resp.ok) {
      $("#comentarioAprobarFactura").val("");
      $('#modalGestionarSolicitud').modal('hide');
      Swal.fire(`Aprobación de ${msgText}`, `${msgText} aprobada`, "success");
      let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
      const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
      await insertarLog(idSolicitud, estado, usuario, comentarioID);
      getSolicitudes();
      // enviarMail("pruebacontabilidadworkflow@yopmail.com");
    }
  }
}

const aprobarLegalizacion = async (sw) => {
  const idSolicitud = $("#idOcultoSolicitud").val();
  const usuario = await getDatosUsuario();
  let comentario = $("#comentarioLegalizacion").val();
  let valorAutorizado = $("#valorAutorizado").val().replace(/\./g, "");
  let estado = "T";

  if (!valorAutorizado) {
    Swal.fire("Campo requerido", "Debe ingresar el valor autorizado", "error");
    return;
  }

  const result = await confirmAlert("Aprobar legalización", "La solicitud pasará de estado legalización a legalización aprobada");
  if (result.isConfirmed) {
    let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, valorAutorizado, idSolicitud, link: "../models/WorkFlow.php" });
    if (resp.ok) {
      $("#comentarioLegalizacion").val("");
      $("#valorAutorizado").val("");
      $('#modalGestionarSolicitud').modal('hide');
      Swal.fire("Aprobación de legalización", "Legalización aprobada", "success");
      let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
      const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
      await insertarLog(idSolicitud, estado, usuario, comentarioID);
      getSolicitudes();
      // enviarMail("pruebacontabilidadworkflow@yopmail.com");
    }
  }
}

const causar = async () => {
  const idSolicitud = $("#idOcultoSolicitud").val();
  const usuario = await getDatosUsuario();
  const numeroCausacion = $("#numeroCausacion").val();
  const comentario = $("#comentarioContabilidad").val();

  if (!numeroCausacion) {
    Swal.fire("Campo requerido", "Debe ingresar el número de causación", "error");
    return;
  }

  const result = await confirmAlert("Causación de solicitud", "La solicitud pasará de estado FACTURA APROBADA a CAUSADO");
  if (result.isConfirmed) {
    let estado = "C";
    let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, numeroCausacion, idSolicitud, link: "../models/WorkFlow.php" });
    if (resp.ok) {
      $("#numeroCausacion").val("");
      $("#modalGestionarSolicitud").click();
      Swal.fire("Causación solicitud", "Solicitud Causada correctamente", "success");
      let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
      const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
      await insertarLog(idSolicitud, estado, usuario, comentarioID);
      getSolicitudes();
      // enviarMail("pruebatesoreriaworkflow@yopmail.com");
    }
  }
}

const compensar = async () => {
  const idSolicitud = $("#idOcultoSolicitud").val();
  const usuario = await getDatosUsuario();
  const numeroCompensacion = $("#numeroCompensacion").val();
  const comentario = $("#comentarioCompensacion").val();

  if (!numeroCompensacion) {
    Swal.fire("Campo requerido", "Debe ingresar el número de compensación", "error");
    return;
  }

  const result = await confirmAlert("Compensación de solicitud", "La solicitud pasará de estado FACTURA APROBADA a COMPENSADO");
  if (result.isConfirmed) {
    let estado = "W";
    let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, numeroCompensacion, idSolicitud, link: "../models/WorkFlow.php" });
    if (resp.ok) {
      $("#numeroCompensacion").val("");
      $("#modalGestionarSolicitud").click();
      Swal.fire("Compensación solicitud", "Solicitud Compensada correctamente", "success");
      let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
      const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
      await insertarLog(idSolicitud, estado, usuario, comentarioID);
      getSolicitudes();
    }
  }
}

const pagar = async () => {
  const idSolicitud = $("#idOcultoSolicitud").val();
  // const usuarioSolicitud = $("#usuarioInfo").val();
  // let respuesta = await enviarPeticion({op: "G_USEREMAIL", link: "../models/WorkFlow.php", usuarioSolicitud });
  const usuario = await getDatosUsuario();
  const adjuntoPago = document.querySelector("#adjuntoPago").files[0];
  const comentario = $("#comentarioTesoreria").val();
  const tipoGastoText = $('#tipoGastoInfo').val();

  if (!adjuntoPago) {
    Swal.fire("Campo requerido", "Debe adjuntar el soporte de pago", "error");
    return;
  }

  const result = await confirmAlert("Pago de solicitud", "La solicitud pasará de estado CAUSADO a PAGADO");
  if (result.isConfirmed) {
    let estado = "P";
    let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, idSolicitud, link: "../models/WorkFlow.php" });
    if (resp.ok) {
      $("#adjuntoPago").val("");
      $("#comentarioTesoreria").val("");
      $('#modalGestionarSolicitud').modal('hide');
      Swal.fire("Pago solicitud", "Solicitud pagada correctamente", "success");
      let arr_arch = [adjuntoPago];
      await SubirArchivosAdj(idSolicitud, arr_arch, "2");
      let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
      const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
      await insertarLog(idSolicitud, estado, usuario, comentarioID);
      getSolicitudes();
      if (tipoGastoText === "ANTICIPO") enviarMail("pruebaworkflow@yopmail.com", estado, idSolicitud);
    }
  }
}

const rechazar = async (sw) => {
  const idSolicitud = $("#idOcultoSolicitud").val();
  const usuario = await getDatosUsuario();
  let comentario = "";
  if (sw === "1") comentario = $("#comentarioAutoriza").val();
  else if (sw === "2") comentario = $("#comentarioAprobarFactura").val();
  else if (sw === "3") comentario = $("#comentarioAnticipo").val();
  else comentario = $("#comentarioAprobarFactura2").val();
  let comentarioSW = sw;
  // const usuarioSolicitud = $("#usuarioInfo").val();
  // let respuesta = await enviarPeticion({op: "G_USEREMAIL", link: "../models/WorkFlow.php", usuarioSolicitud });

  if (!comentario.length) {
    Swal.fire("Comentario requerido", "Es necesario dejar un comentario con el motivo por el cual se rechaza la solicitud", "warning");
    return;
  }

  const result = await confirmAlert("Rechazar solicitud", `La solicitud pasará a estado RECHAZADO`);
  if (result.isConfirmed) {
    let estado = "R"; 
    let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentarioSW, idSolicitud, link: "../models/WorkFlow.php" });
    if (resp.ok) {
      $("#comentarioAutoriza").val("");
      $("#modalGestionarSolicitud").modal('hide');
      Swal.fire("Rechazar solicitud", "La solicitud ha sido rechazada", "info");
      let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
      await insertarLog(idSolicitud, estado, usuario, idComentario.id);
      // await enviarMail(respuesta[0].EMAIL);
      await enviarMail("pruebaworkflow@yopmail.com", estado, idSolicitud);
      getSolicitudes();
    }
  }
}

const noCausar = async () => {
  const usuario = await getDatosUsuario();
  const idSolicitud = $("#idOcultoSolicitud").val();
  const comentario = $("#comentarioContabilidad").val();

  if (!comentario.length) {
    Swal.fire("Campo requerido", "Es necesario un comentario con el motivo de la no causación", "error");
    return;
  }

  const result = await confirmAlert("No causar", "Solicitud pendiente de causar");
  if (result.isConfirmed) {
    let estado = "N";
    let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
    await insertarLog(idSolicitud, estado, usuario, idComentario.id);
    $("#modalGestionarSolicitud").modal('hide');
    Swal.fire("Causación pendiente", "Solicitud pendiente", "info");
    getSolicitudes();
    enviarMail("pruebaworkflow@yopmail.com", estado, idSolicitud);
  }
}

const noCompensar = async () => {
  const usuario = await getDatosUsuario();
  const idSolicitud = $("#idOcultoSolicitud").val();
  const comentario = $("#comentarioCompensacion").val();

  if (!comentario.length) {
    Swal.fire("Campo requerido", "Es necesario un comentario con el motivo de la no compensación", "error");
    return;
  }

  const result = await confirmAlert("No compensar", "Solicitud pendiente de compensar");
  if (result.isConfirmed) {
    let estado = "L";
    let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
    await insertarLog(idSolicitud, estado, usuario, idComentario.id);
    $("#modalGestionarSolicitud").modal('hide');
    Swal.fire("Compensación pendiente", "Solicitud pendiente", "info");
    getSolicitudes();
    enviarMail("pruebaworkflow@yopmail.com", estado, idSolicitud);
  }
}

const noPagar = async () => {
  const usuario = await getDatosUsuario();
  const idSolicitud = $("#idOcultoSolicitud").val();
  const comentario = $("#comentarioTesoreria").val();

  if (!comentario.length) {
    Swal.fire("Campo requerido", "Es necesario un comentario con el motivo de no pago", "error");
    return;
  }

  const result = await confirmAlert("No realizar pago", "Solicitud pendiente de pago");
  if (result.isConfirmed) {
    let estado = "M";
    let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
    await insertarLog(idSolicitud, estado, usuario, idComentario.id);
    $("#modalGestionarSolicitud").modal('hide');
    Swal.fire("Causación pendiente", "Solicitud pendiente", "info");
    getSolicitudes();
    enviarMail("pruebaworkflow@yopmail.com", estado, idSolicitud);
  }
}

const guardarFactura = async (sw) => {
  const adjuntoFactura = (sw === 1) ? document.getElementById("adjunto_factura").files[0] : document.getElementById("adjunto_factura2").files[0];
  const numeroPreliminar = (sw === 1) ? $('#numeroPreliminar').val() : $('#numeroPreliminar3').val();
  const fechaFactura = (sw === 1) ? $('#fechaFactura2').val() : $('#fechaFactura3').val();
  const numeroDocumento = (sw === 1) ? $('#numeroDocumento2').val() : $('#numeroDocumento3').val();
  const razonSocial = (sw === 1) ? $('#razonSocial2').val() : $('#razonSocial3').val();
  const valorFactura = (sw === 1) ? $('#valorFactura2').val().replace(/\./g, "") : $('#valorFactura3').val().replace(/\./g, "");
  const subTotalFactura = (sw === 1) ? $('#subTotalFactura2').val().replace(/\./g, "") : $('#subTotalFactura3').val().replace(/\./g, "");
  const iva = (sw === 1) ? $('#iva2').val() : $('#iva3').val();
  const idSolicitud = $("#idOcultoSolicitud").val();
  const usuario = await getDatosUsuario();
  const comentario = (sw === 1) ? $("#comentarioFactura").val() : $("#comentarioFactura2").val();

  if (!adjuntoFactura || !numeroPreliminar || !fechaFactura || !numeroDocumento || !razonSocial || !valorFactura || !subTotalFactura) {
    Swal.fire('Campos requeridos', 'Todos los campos de la factura son requeridos', 'error');
    return;
  }

  (sw === 1) ? $('#adjunto_factura').val("") : $('#adjunto_factura2').val("");
  (sw === 1) ? $('#comentarioFactura').val("") : $('#comentarioFactura2').val("");
  (sw === 1) ? $('#numeroPreliminar').val("") : $('#numeroPreliminar2').val("");
  (sw === 1) ? $('#fechaFactura2').val("") : $('#fechaFactura3').val("");
  (sw === 1) ? $('#numeroDocumento2').val("") : $('#numeroDocumento3').val("");
  (sw === 1) ? $('#razonSocial2').val("") : $('#razonSocial3').val("");
  (sw === 1) ? $('#valorFactura2').val("") : $('#valorFactura3').val("");

  let estado = "Q";
  let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, numeroPreliminar, fechaFactura, subTotalFactura, numeroDocumento, iva, razonSocial, valorFactura, idSolicitud, link: "../models/WorkFlow.php" });
  if (resp.ok) {
    SubirArchivosAdj(idSolicitud, [adjuntoFactura], "4");
    getSolicitudes();
    let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
    const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
    await insertarLog(idSolicitud, estado, usuario, comentarioID);
    Swal.fire('Factura preliminar', 'Se guardó la factura correctamente', 'success');
    $('#modalGestionarSolicitud').modal('hide');
  }
}

const guardarLegalizacion = async () => {
  const adjuntoLegal = document.getElementById("adjuntoLegalizacion").files[0];
  const valorLegal = $('#valorLegalizacion').val().replace(/\./g, "");
  const idSolicitud = $("#idOcultoSolicitud").val();
  const usuario = await getDatosUsuario();
  const comentario = $("#comentarioLegalizacion").val();

  if (!adjuntoLegal || !valorLegal) {
    Swal.fire('Campos requeridos', 'El adjunto de la legalización y el valor a legalizar son requeridos', 'error');
    return;
  }

  $('#adjuntoLegalizacion').val("");
  $('#valorLegalizacion').val("");

  const estado = "Q";
  let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, valorLegal, idSolicitud, link: "../models/WorkFlow.php" });
  if (resp.ok) {
    SubirArchivosAdj(idSolicitud, [adjuntoLegal], "5");
    getSolicitudes();
    let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
    const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
    await insertarLog(idSolicitud, estado, usuario, comentarioID);
    Swal.fire('Legalización', 'Se guardó la legalización correctamente', 'success');
    $('#modalGestionarSolicitud').modal('hide');
  }
}

const guardarAnticipo = async () => {
  const adjuntoAnticipo = document.getElementById("adjuntoAnticipo").files[0];
  const idSolicitud = $("#idOcultoSolicitud").val();
  const usuario = await getDatosUsuario();
  const comentario = ($("#comentarioAnticipo").val() ? $("#comentarioAnticipo").val() : '');
  let idComentario = {};

  if (!adjuntoAnticipo) {
    Swal.fire('Campo requerido', 'Debe adjuntar el anticipo', 'error');
    return;
  }

  $('#adjuntoAnticipo').val("");

  let estado = "U";
  let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, idSolicitud, link: "../models/WorkFlow.php" });
  if (resp.ok) {
    SubirArchivosAdj(idSolicitud, [adjuntoAnticipo], "3");
    getSolicitudes();
    let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
    const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
    await insertarLog(idSolicitud, estado, usuario, comentarioID);
    Swal.fire('Anticipo', 'Se guardó el anticipo correctamente', 'success');
    $('#modalGestionarSolicitud').modal('hide');
  }
}

const restaurarSolicitud = async () => {
  const idSolicitud = $('#idOcultoSolicitud').val();
  const comentario = $('#comentarioAutoriza').val();
  const usuario = await getDatosUsuario();

  const resp = await enviarPeticion({ op: "G_INFOMODAL", idSolicitud, link: "../models/WorkFlow.php" });
  const { COMENTARIO_RECHAZA } = resp[0];

  let estado = "";
  if (COMENTARIO_RECHAZA === "1") estado = "S";
  if (COMENTARIO_RECHAZA === "2" || COMENTARIO_RECHAZA === "4") estado = "Q";
  if (COMENTARIO_RECHAZA === "3") estado = "U";

  const result = await confirmAlert("Verificación", "¿Correcciones de la solicitud realizadas?");
  if (!result.isConfirmed) {
    return;
  }

  const respuesta = await enviarPeticion({ op: "U_SOLICITUD", link: "../models/WorkFlow.php", idSolicitud, estado });
  let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
  const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
  if (respuesta.ok) {
    insertarLog(idSolicitud, estado, usuario, comentarioID);
  }
  $('#modalGestionarSolicitud').modal('hide');
  enviarMail("pruebagerenciaworkflow@yopmail.com", "Z", idSolicitud);
  getSolicitudes();
}

// EJECUCIÓN DE FUNCIONALIDADES
$(function() {
  $('#btnVerFacturaDiv').removeClass('d-flex').hide();
  $('#verAdjPagoDiv').removeClass('d-flex').hide();

  $('#fechaDesde, #fechaHasta').datepicker({
    autoclose: true,
    multidate: false,
    changeMonth: true,
    changeYear: true,
    useCurrent: true,
    dateFormat: 'yy-mm-dd'
  }).datepicker("setDate", new Date());

  $("#fechaDesde, #fechaHasta, #filtroDepartamentos, #filtroOficina").change(function () {
    getSolicitudes();
  });

  const oficinas = OficinasVentas('S');
  $('#filtroOficina').html(oficinas);

  getDptos();
  getSolicitudes();

  document.querySelector('#valorLegalizacion').addEventListener('click', () => {
    console.log('Prueba...');
  });

  $("#numeroDocumento, #numeroDocumento2, #iva, #iva2, #numeroCausacion, #numeroCompensacion, #numeroPreliminar, #numeroPreliminar2").on("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });

  $('#valorAnticipo, #valorAnticipo1, #valorLegalizacion, #valorAutorizado, #valorFactura, #subTotalFactura, #subTotalFactura2, #valorFactura2').on('input', function () {
    let value = $(this).val().replace(/[^0-9]/g, '');
    if (value) value = parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 0 });
    $(this).val(value);
  });

  $("#modalAgregarSolicitud").on("hidden.bs.modal", () => {
    $('#formCrearSolicitud').trigger('reset');
  });

  $('#btnModalAddSolic').on('click', () => {
    getOficinas();
    getDatosUsuario();
    getConceptos();
    $('#cotizaciones').hide(200);
    $('#datosFactura').hide(200);
    $('#modalAgregarSolicitud').modal('show');
  });

  $("#btnAgregarConcepto").on("click", async () => {
    agregarConcepto();
  });

  $("#btnAbrirModal").on("click", async () => {
    $('#modalAgregarConcepto').modal('show');
  });

  $('#btnGuardar').on('click', async (e) => {
    e.preventDefault();
    insertarSolicitud();
  });

  $("#btnActualizarAdj").on("click", () => {
    actualizarArchivosAdj();
  });

  $('#tipoGasto').change(function () {
    const tipoGasto = parseInt($(this).val());
    ocultarCampos(tipoGasto);
  });

  $('#tipoAnticipo').change(function () {
    const tipoAnticipo = $(this).val();
    if (tipoAnticipo === "1") {
      $('#inputArchivo1').show();
      $('#inputArchivo2').show();
      $('#inputArchivo3').hide();
      $('#label1').html(`Adjuntar cotización 1<span class="text-danger h6">*</span>`);
      $('#label2').html(`Adjuntar cotización 2<span class="text-danger h6">*</span>`);
    } else if (tipoAnticipo === "3") {
      $('#inputArchivo1').show();
      $('#inputArchivo2').hide();
      $('#inputArchivo3').hide();
      $('#label1').html(`Adjuntar solicitud de anticipo<span class="text-danger h6">*</span>`);
    } else if (tipoAnticipo === "2") {
      $('#inputArchivo1').show();
      $('#inputArchivo2').hide();
      $('#inputArchivo3').hide();
      $('#label1').html(`Adjuntar solicitud de anticipo<span class="text-danger h6">*</span>`);
    } else {
      $('#inputArchivo1').hide();
      $('#inputArchivo2').hide();
      $('#inputArchivo3').hide();
    }
  });

  $('#filtroFechaInicio').change(function () {
    let fechaDesde = $(this).val();
    fechaDesde = new Date(fechaDesde).toISOString().split('T')[0];
    const fechaHasta = document.getElementById('filtroFechaFin');
    fechaHasta.setAttribute('min', fechaDesde);
  });

  $('#filtroFechaFin').change(function () {
    let fechaHasta = $(this).val();
    fechaHasta = new Date(fechaHasta).toISOString().split('T')[0];
    const fechaDesde = document.getElementById('filtroFechaInicio');
    fechaDesde.setAttribute('max', fechaHasta);
  });

  $('#btnAutorizar').on('click', () => {
    autorizar();
  });

  $('#btnVerTablaGastos').on('click', () => {
    getInfoTablaGastos();
  });

  $('#guardarFactura').on('click', () => {
    guardarFactura(1);
  });

  $('#btnGuardarLegal').on('click', () => {
    guardarLegalizacion();
  });

  $('#guardarFactura2').on('click', () => {
    guardarFactura(2);
  });

  $('#guardarAnticipo').on('click', () => {
    guardarAnticipo();
  });

  $('#btnAprobar').on('click', () => {
    aprobarFactura(1);
  });

  $('#btnAprobar2').on('click', () => {
    aprobarFactura(3);
  });

  $('#btnAprobarAnticipo').on('click', () => {
    aprobarFactura(2);
  });

  $('#btnAprobarLegal').on('click', () => {
    aprobarLegalizacion();
  });

  $("#btnRechazar").on("click", () => {
    rechazar("1");
  });

  $("#btnRechazar2").on("click", () => {
    rechazar("2");
  });

  $("#btnRechazarAnticipo").on("click", () => {
    rechazar("3");
  });

  $("#btnRechazar3").on("click", () => {
    rechazar("4");
  });

  $('#btnCausado').on('click', () => {
    causar();
  });

  $('#btnCompensado').on('click', () => {
    compensar();
  });

  $('#btnNoCompensado').on('click', () => {
    noCompensar();
  });

  $('#btnPagado').on('click', () => {
    pagar();
  });

  $("#btnNoPagado").on("click", () => {
    noPagar();
  });

  $("#btnNoCausado").on("click", () => {
    noCausar();
  });

  $("#btnRefrescar").on("click", () => {
    getSolicitudes();
  });

  $("#btnRestaurar").on("click", () => {
    restaurarSolicitud();
  });
});