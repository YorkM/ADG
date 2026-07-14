const urlModels = "../models/WorkFlow.php";
const url_file = "https://app.pwmultiroma.com";
const rolId = parseInt($('#rol').val());

let tipoGasto = {
   '1': 'COTIZACIÓN',
   '2': 'FACTURA DE GASTO',
   '3': 'ANTICIPO'
}

let estados = {
   'S': { color: '#0A97B0', texto: 'SOLICITADO' },
   'K': { color: '#77dd77', texto: 'AUTORIZADO' },
   'U': { color: '#b7950b', texto: 'ANTICIPO' },
   'O': { color: '#77dd77', texto: 'AUTORIZADO' },
   'Q': { color: '#B2A5FF', texto: 'FACTURA' },
   'T': { color: '#77dd77', texto: 'AUTORIZADO' },
   'C': { color: '#84b6f4', texto: 'CAUSADO' },
   'P': { color: '#ffda9e', texto: 'PAGADO' },
   'R': { color: '#ff6961', texto: 'RECHAZADO' },
   'N': { color: '#ff6961', texto: 'NO CAUSADO' },
   'M': { color: '#ff6961', texto: 'NO PAGADO' },
   'L': { color: '#ff6961', texto: 'NO CONTABILIZADO' },
   'F': { color: '#c5c6c8', texto: 'FINALIZADO' },
   'W': { color: '#FC8F54', texto: 'CONTABILIZADO' }
}

const enviarMail = async (destino, estado, idSolicitud) => {
   $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: urlModels,
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

const formatNumber = (value, currency = "") => {
   value = value.replace(/[^0-9]/g, '');
   if (value) value = parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 0 });
   return currency ? `${currency}${value}` : value;
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
      const resp = await enviarPeticion({ op: "G_DTPOS", link: urlModels });
      let elements = `<option value="">--Filtrar por Dpto--</option>`;
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
      let resp = await enviarPeticion({ op: "G_OFICINA", link: urlModels });
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
      resp = await enviarPeticion({ op: "G_USUARIO", idUsuario, link: urlModels });
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
   try {
      const resp = await enviarPeticion({ op: "G_INFOTABLAG", link: urlModels });

      let table = `
      <table class="table table-bordered" id="tablaGastos">
         <thead class="table-info">
            <tr>
               <th>CARGO</th>
               <th>CONCEPTO</th>
               <th>GASTO AUTORIZADO</th>
            </tr>                     
         </thead>
         <tbody>`;

      resp.forEach(elem => {
         table += ` 
         <tr>
            <td>${elem.CARGO}</td>
            <td>${elem.CONCEPTO}</td>
            <td class="size-14">${formatNum(elem.GASTO_AUTORIZADO, "$")}</td>
         </tr>`;
      });

      table += `</tbody></table>`;

      $('#containerTablaGastos').html(table);
      $('#modalTablaGastos').modal('show');
   } catch (error) {
      console.log(error);
   }
}

const actualizarNota = async (idSolicitud) => {
   await enviarPeticion({ op: "U_NOTA", link: urlModels, idSolicitud });
   await getSolicitudes();
}

const getConceptos = async () => {
   try {
      const resp = await enviarPeticion({ op: "G_CONCEPTOS", link: urlModels });
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
      $("#numeroCausacion, #adjuntoLegalizacion, #valorAnticipo, #valorLegalizacion, #valorAutorizado, #comentarioLegalizacion").attr("disabled", true);
      $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
      $('#botonesAprobarLegalizacion').removeClass('d-flex').hide();
      $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #subTotalFactura2, #iva2, #nit2, #fondo2, #numeroFondo2, #comentarioFactura, #adjunto_factura, #comentarioAprobarFactura").attr("disabled", true);
      $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #nit3, #codigoSap3, #fondo3, #numeroFondo3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2, #comentarioAprobarFactura2").attr("disabled", true);
      $('#sectionBtnGF').removeClass('d-flex').hide();
      $('#sectionBtnGF2').removeClass('d-flex').hide();
      $('#sectionBtnGA').removeClass('d-flex').hide();
      $('#botonesAnticipo').removeClass('d-flex').hide();
      $('#botonesAprobarFactura').removeClass('d-flex').hide();
      $('#botonesAprobarFactura2').removeClass('d-flex').hide();
      $("#numeroCompensacion, #comentarioCompensacion, #adjuntoContabilidad").attr("disabled", true);
      $("#fechaPago").val("");
      $("#fechaPago").attr("disabled", true);
      $("#comentarioContabilidad").val("");
      $("#comentarioContabilidad").attr("disabled", true);
      $("#comentarioTesoreria").val("");
      $("#comentarioTesoreria").attr("disabled", true);
      $("#adjuntoPago, #numeroZP").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
      $('#alerta1').addClass('d-none');
      $('#alerta2').addClass('d-none');
      $('#alerta3').addClass('d-none');
      $('#adjunto1ModalDiv').show();
      $('#adjunto2ModalDiv').show();
      $('#adjunto3ModalDiv').show();
      $('#btnActualizarAdjDiv').addClass('d-flex').show();
      $('#sectionCompensacion').show();
      if (TIPO_GASTO === "3") {
         if (resp[0].TIPO_ANTICIPO !== "1") {
            $('#textArchivos').hide();
            $('input[type="radio"]').attr("disabled", true);
         }
         if (resp[0].TIPO_ANTICIPO === "2" || resp[0].TIPO_ANTICIPO === "3") {
            $('#fechaAnticipo').val((resp[0].FECHA_SOLICITA) && formatDate(resp[0].FECHA_SOLICITA));
         }
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
      $('#btnVerAnticipoDiv').addClass("d-none").hide();
      $('#btnVerFacturaDiv2').removeClass('d-flex').hide();
      $('#sectionBtnGF2').removeClass('d-flex').hide();
      $('#checkAdmin').removeClass('d-none').show();
      $('#checkFactura, #checkAprobFactura, #checkContabilidad, #checkTesoreria, #checkAnticipo').addClass('d-none').hide();
      $('input[type="radio"]').attr("disabled", true);
      $('#divBtnRestaurar').removeClass('d-flex').hide();
      $("#comentarioAutoriza, #fechaAutorizacion").attr("disabled", true);
      $('input[type="radio"]')[0].checked = false;
      $('input[type="radio"]')[1].checked = false;
      $('input[type="radio"]')[2].checked = false;
      $("#fechaAutorizacion").val(formatDate(resp[0].FECHA_AUTORIZA));
      $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
      $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
      $('#botonesAdmin').removeClass('d-flex').hide();
      $("#sectionFactura").removeClass('d-none');
      $('#botonesAprobarFactura2').removeClass('d-flex').hide();
      $('#numeroPreliminar, #adjunto_factura, #comentarioFactura, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #nit2, #numeroFondo2').val("");
      $("#sectionAprobarFactura").addClass('d-none');
      $('#numeroPreliminar, #adjunto_factura, #comentarioFactura, #fechaFactura2, #numeroDocumento2, #subTotalFactura2, #razonSocial2, #valorFactura2, #iva2, #nit2, #fondo2, #numeroFondo2, #comentarioAprobarFactura').attr('disabled', true);
      $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #nit3, #codigoSap3, #fondo3, #numeroFondo3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2, #comentarioAprobarFactura2").attr("disabled", true);
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
      $("#adjuntoPago, #numeroZP").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
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
         $('#numeroPreliminar, #adjunto_factura, #comentarioFactura, #fechaFactura2, #numeroDocumento2, #subTotalFactura2, #iva2, #nit2, #fondo2, #numeroFondo2').attr('disabled', false);
      }
      if (resp[0].TIPO_ANTICIPO === "1") {
         $('#sectionFactura').addClass('d-none').hide();
         $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').attr('disabled', true);
         $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').val("");
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
      $('#checkAdmin, #checkAnticipo').removeClass('d-none').show();
      $('#fechaAutorizacionDiv').removeClass('d-none');
      $('#btnVerAnticipoDiv').removeClass('d-none').addClass("d-flex").show();
      $('#btnVerFacturaDiv2').removeClass('d-flex').hide();
      $('#sectionBtnGF2').removeClass('d-flex').hide();
      $('#checkFactura, #checkAprobFactura, #checkContabilidad, #checkTesoreria, #checkCompesacion').addClass('d-none').hide();
      $('input[type="radio"]')[0].checked = false;
      $('input[type="radio"]')[1].checked = false;
      $('input[type="radio"]')[2].checked = false;
      $("#fechaAutorizacion").val(formatDate(resp[0].FECHA_AUTORIZA));
      $("#fechaAnticipo").val(formatDate(resp[0].FECHA_FINALIZA));
      $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
      $('#comentarioAnticipo').val(await getComentarioAprob(resp[0].ID, "U"));
      $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
      $("#sectionFactura, #sectionAprobarFactura").addClass('d-none');
      $('#botonesAprobarFactura2').removeClass('d-flex').hide();
      $('#fechaAnticipoDiv').removeClass('d-none');
      $('#adjuntoAnticipoDiv').hide();
      $("#fechaCausacion, #numeroCausacion, #fechaPago, #comentarioContabilidad #comentarioTesoreria, #numeroZP, #adjuntoPago, #comentarioAnticipo").val("");
      $("#comentarioTesoreria, input[type='radio'], #numeroCausacion, #fechaCausacion, #fechaPago, #comentarioContabilidad, #adjuntoPago, #comentarioAutoriza, #fechaAutorizacion, #adjuntoAnticipo, #comentarioAnticipo, #fechaAnticipo, #numeroZP").attr("disabled", true);
      $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #nit3, #codigoSap3, #fondo3, #numeroFondo3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2, #comentarioAprobarFactura2").attr("disabled", true);
      $('#botonesAdmin, #botonesContabilidad, #botonesTesoreria, #botonesCompensacion, #divBtnRestaurar, #sectionBtnGA, #botonesAnticipo').removeClass('d-flex').hide();
      $("#alerta1, #alerta2, #alerta3").addClass('d-none');
      $('#titleAnticipo').html(`<h5>Anticipo adjunto - <span class="h5">Aprobación</span></h5>`);
      if (resp[0].USUARIO_SOLICITA === await getDatosUsuario()) {
         $('#sectionFactura').removeClass('d-none');
         $('#numeroPreliminar, #adjunto_factura, #comentarioFactura').attr('disabled', false);
      }
      if (resp[0].TIPO_ANTICIPO === "1") {
         $('#sectionFactura').addClass('d-none').hide();
         $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').attr('disabled', true);
         $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').val("");
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
      $("#comentarioAutoriza, #fechaAutorizacion, #fechaAnticipo").attr("disabled", true);
      $('input[type="radio"]')[0].checked = false;
      $('input[type="radio"]')[1].checked = false;
      $('input[type="radio"]')[2].checked = false;
      $('#btnVerFacturaDiv2').addClass('d-flex').show();
      $('#adjunto_facturaDiv2').hide();
      $('#comentarioFacturaDiv2').hide();
      $('#btnVerFacturaDiv2').removeClass('d-none');
      $("#numeroDocumento3").val(resp[0].NUMERO_DOCUMENTO);
      $("#nit3").val(resp[0].NIT);
      $("#razonSocial3").val(resp[0].RAZON_SOCIAL);
      $("#codigoSap3").val(resp[0].CODIGO_SAP);
      $("#valorFactura3").val(formatNum(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura3").val(formatNum(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $('#comentarioAnticipo').val(await getComentarioAprob(resp[0].ID, "O"));
      $("#iva3").val(formatNumber(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo3").val(resp[0].FONDO);
      $("#numeroFondo3").val(resp[0].NUMERO_FONDO);
      $("#sectionBtnGF2").removeClass("d-flex").addClass("d-none");
      $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
      $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
      $('#botonesAdmin').removeClass('d-flex').hide();
      $("#sectionFactura").addClass('d-none');
      $("#sectionAprobarFactura").addClass('d-none');
      $('#botonesAprobarFactura2').removeClass('d-flex').hide();
      $("#fechaCausacion").val(resp[0].FECHA_CAUSA);
      $("#fechaCausacionDiv").removeClass('d-none');
      $("#fechaPreliminar").val(formatDate(resp[0].FECHA_PRELIMINAR));
      $("#valorLegalizacion").val(formatNumber(resp[0].VALOR_LEGALIZACION, "$"));
      $("#valorAnticipo").val(formatNumber(resp[0].VALOR_ANTICIPO, "$"));
      $("#adjuntoLegalizacionDiv").addClass('d-none');
      $("#btnVerLegalizacionDiv").removeClass('d-none').addClass('d-flex');
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
      $("#numeroZP").val(resp[0].NUMERO_ZP);
      $("#comentarioTesoreria").attr("disabled", true);
      $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $("#fechaFactura3").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $("#sectionBtnGF").removeClass("d-flex").addClass("d-none");
      $("#adjuntoPago").val("");
      $('#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #nit3, #codigoSap3, #fondo3, #numeroFondo3, #valorFactura3, #subTotalFactura3, #iva3, #adjuntoAnticipo2, comentarioAnticipo2, #numeroCompensacion, #adjuntoContabilidad, #comentarioCompensacion, #comentarioAprobarFactura2').attr('disabled', true);
      $("#adjuntoLegalizacion, #valorLegalizacion, #valorAnticipo, #valorAutorizado, #comentarioLegalizacion").attr("disabled", true);
      $('#adjunto_factura').attr('disabled', true);
      $('#comentarioFactura').attr('disabled', true);
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
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
         $('#btnVerAnticipoDiv').removeClass('d-none').addClass("d-flex").show();
         $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
         $('#checkAdmin, #checkAnticipo, #checkContabilidad, #checkTesoreria').removeClass('d-none').show();
         $('#checkCompesacion').addClass('d-none').hide();
         $('#titleAnticipo').html(`<h5>Anticipo adjunto</h5>`);
         if (resp[0].TIPO_ANTICIPO === "2" || resp[0].TIPO_ANTICIPO === "3") {
            $('#fechaAnticipo').val((resp[0].FECHA_SOLICITA) && formatDate(resp[0].FECHA_SOLICITA));
            $("#fechaAutorizacion").val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
            $("#comentarioAutoriza").val(resp[0].COMENTARIO_FINALIZA);
         }
      }
      if (rol === 1 || rol === 73) {
         $("#sectionAprobarFactura2").removeClass('d-none');
         $("#botonesAprobarFactura").addClass('d-flex').show();
         $('#botonesAprobarFactura2').addClass('d-flex').show();
         $("#comentarioAprobarFactura, #comentarioLegalizacion, #valorAutorizado, #comentarioAprobarFactura2").attr('disabled', false);
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
      $("#numeroPreliminar, #fechaPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #subTotalFactura2, #iva2, #nit2, #fondo2, #numeroFondo2, #comentarioFactura").attr("disabled", true);
      $('#numeroPreliminar').val(resp[0].NUMERO_PRELIMINAR);
      $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $('#btnVerFacturaDiv').addClass('d-flex').show();
      $('#adjunto_facturaDiv').hide();
      $('#comentarioFacturaDiv').hide();
      $('#btnVerFacturaDiv').removeClass('d-none');
      $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
      $("#nit2").val(resp[0].NIT);
      $("#codigoSap2").val(resp[0].CODIGO_SAP);
      $("#razonSocial2").val(resp[0].RAZON_SOCIAL);
      $("#valorFactura2").val(formatNum(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura2").val(formatNum(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $("#iva2").val(formatNumber(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo2").val(resp[0].FONDO);
      $("#numeroFondo2").val(resp[0].NUMERO_FONDO);
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
      $("#adjuntoPago, #numeroZP").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
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

   if (ESTADO === "N" && TIPO_GASTO === "2" || ESTADO === "R" && TIPO_GASTO === "2") {
      $('#sectionAdmin').hide();
      $('#checkFactura').addClass('d-none').hide();
      $('#checkAprobFactura, #checkContabilidad, #checkTesoreria').addClass('d-none').hide();
      $('#divBtnRestaurar').removeClass('d-flex').hide();
      $("#sectionFactura").removeClass('d-none');
      $("#numeroPreliminar, #fechaPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #subTotalFactura2, #iva2, #nit2, #fondo2, #numeroFondo2, #comentarioFactura, #adjunto_factura").attr("disabled", true);
      $('#numeroPreliminar').val(resp[0].NUMERO_PRELIMINAR);
      $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $('#btnVerFacturaDiv').addClass('d-flex').show();
      $('#adjunto_facturaDiv').show();
      $('#comentarioFacturaDiv').show();
      $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
      $("#nit2").val(resp[0].NIT);
      $("#codigoSap2").val(resp[0].CODIGO_SAP);
      $("#razonSocial2").val(resp[0].RAZON_SOCIAL);
      $("#valorFactura2").val(formatNum(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura2").val(formatNum(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $("#iva2").val(formatNumber(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo2").val(resp[0].FONDO);
      $("#numeroFondo2").val(resp[0].NUMERO_FONDO);
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
      $("#adjuntoPago, #numeroZP").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
      $('#botonesContabilidad').removeClass('d-flex').hide();
      $('#botonesTesoreria').removeClass('d-flex').hide();
      $('#botonesCompensacion').removeClass('d-flex').hide();
      $("#alerta1").addClass('d-none');
      $("#alerta2").addClass('d-none');
      $("#alerta3").addClass('d-none');

      if (resp[0].USUARIO_SOLICITA === await getDatosUsuario() || rol === 1 || rol === 73) {
        $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #subTotalFactura2, #iva2, #nit2, #fondo2, #numeroFondo2, #comentarioFactura, #adjunto_factura").attr("disabled", false);
        $("#sectionBtnGF").addClass("d-flex").removeClass("d-none");
      }
   }

   if (ESTADO === "Q" && TIPO_GASTO === "1") {
      $('#sectionAdmin').show();
      $('#botonesAdmin').removeClass('d-flex').hide();
      $('#checkAdmin, #checkFactura').removeClass('d-none').show();
      $('#fechaAutorizacionDiv').removeClass('d-none');
      $('#checkAprobFactura, #checkContabilidad, #checkTesoreria').addClass('d-none').hide();
      $('#divBtnRestaurar').removeClass('d-flex').hide();
      $("#sectionAprobarFactura").addClass('d-none');
      $("#sectionFactura").removeClass('d-none');
      $("#numeroPreliminar").val(resp[0].NUMERO_PRELIMINAR);
      $('#btnVerFacturaDiv').addClass('d-flex').show();
      $('#adjunto_facturaDiv').hide();
      $('#comentarioFacturaDiv').hide();
      $('#btnVerFacturaDiv').removeClass('d-none');
      $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
      $("#nit2").val(resp[0].NIT);
      $("#codigoSap2").val(resp[0].CODIGO_SAP);
      $("#razonSocial2").val(resp[0].RAZON_SOCIAL);
      $("#valorFactura2").val(formatNum(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura2").val(formatNum(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $("#iva2").val(formatNumber(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo2").val(resp[0].FONDO);
      $("#numeroFondo2").val(resp[0].NUMERO_FONDO);
      $("#numeroPreliminar, #fechaFactura2, #fechaAutorizacion, #fechaPreliminar, #numeroDocumento2, #razonSocial2, #subTotalFactura2, #valorFactura2, #iva2, #nit2, #fondo2, #numeroFondo2").attr("disabled", true);
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
      $("#adjuntoPago, #numeroZP").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
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

   if (ESTADO === "N" && TIPO_GASTO === "1") {
      $('#sectionAdmin').show();
      $('#botonesAdmin').removeClass('d-flex').hide();
      $('#checkAdmin').removeClass('d-none').show();
      $('#fechaAutorizacionDiv').removeClass('d-none');
      $('#checkAprobFactura, #checkContabilidad, #checkTesoreria').addClass('d-none').hide();
      $('#divBtnRestaurar').removeClass('d-flex').hide();
      $("#sectionAprobarFactura").addClass('d-none');
      $("#sectionFactura").removeClass('d-none');
      $("#numeroPreliminar").val(resp[0].NUMERO_PRELIMINAR);
      $('#btnVerFacturaDiv').addClass('d-flex').show();
      $('#adjunto_facturaDiv').show();
      $('#comentarioFacturaDiv').show();
      $('#btnVerFacturaDiv').removeClass('d-none');
      $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
      $("#nit2").val(resp[0].NIT);
      $("#codigoSap2").val(resp[0].CODIGO_SAP);
      $("#razonSocial2").val(resp[0].RAZON_SOCIAL);
      $("#valorFactura2").val(formatNum(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura2").val(formatNum(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $("#iva2").val(formatNum(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo2").val(resp[0].FONDO);
      $("#numeroFondo2").val(resp[0].NUMERO_FONDO);
      $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #fechaAutorizacion, #fechaPreliminar, #subTotalFactura2, #iva2, #nit2, #fondo2, #razonSocial2, #numeroFondo2").attr("disabled", true);
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
      $("#adjuntoPago, #numeroZP").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
      $('#botonesContabilidad').removeClass('d-flex').hide();
      $('#botonesTesoreria').removeClass('d-flex').hide();
      $('#botonesCompensacion').removeClass('d-flex').hide();
      $("#alerta1").addClass('d-none');
      $("#alerta2").addClass('d-none');
      $("#alerta3").addClass('d-none');
      if (await getDatosUsuario() === resp[0].USUARIO_SOLICITA || rol === 1 || rol === 73) {
         $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #subTotalFactura2, #iva2, #nit2, #fondo2, #numeroFondo2, #adjunto_factura, #comentarioFactura").attr("disabled", false);
         $("#sectionBtnGF").addClass("d-flex").removeClass("d-none");
      }
   }

   if ((ESTADO === "T" || ESTADO === "M") && TIPO_GASTO === "1") {
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
      $("#nit2").val(resp[0].NIT);
      $("#codigoSap2").val(resp[0].CODIGO_SAP);
      $("#razonSocial2").val(resp[0].RAZON_SOCIAL);
      $("#valorFactura2").val(formatNum(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura2").val(formatNum(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $("#iva2").val(formatNum(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo2").val(resp[0].FONDO);
      $("#numeroFondo2").val(resp[0].NUMERO_FONDO);
      $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #fechaAutorizacion, #fechaPreliminar, #razonSocial2, #subTotalFactura2, #valorFactura2, #iva2, #nit2, #fondo2, #numeroFondo2").attr("disabled", true);
      $("#adjunto_factura").attr("disabled", true);
      $("#comentarioFactura").attr("disabled", true);
      $("#sectionBtnGF").removeClass("d-flex").addClass("d-none");
      $("#sectionAprobarFactura").removeClass('d-none');
      $('#fechaAprobarPreliminar').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
      $('#fechaAprobarPreliminarDiv').removeClass('d-none');
      $('#fechaAprobarPreliminar').attr('disabled', true);
      $('#comentarioAprobarFactura').attr('disabled', true);
      $('#comentarioAprobarFactura').val(await getComentarioAprob(resp[0].ID, "T"));
      $("#fechaPago").val("");
      $("#fechaPago").attr("disabled", true);
      $("#adjuntoPago, #numeroZP").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
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

   if ((ESTADO === "T" || ESTADO === "M") && TIPO_GASTO === "3") {
      $('#divBtnRestaurar').removeClass('d-flex').hide();
      $('#sectionAdmin, #sectionCompensacion').show();
      $('#checkAdmin, #checkFactura2, #checkAprobFactura2, #checkContabilidad, #checkTesoreria, #checkLegalizacion').removeClass('d-none').show();
      $('#checkCompesacion').addClass('d-none').hide();
      $('input[type="radio"]').attr("disabled", true);
      $("#comentarioAutoriza, #fechaAutorizacion, #fechaAnticipo, #fechaCausacion, #fechaPreliminar2").attr("disabled", true);
      $('input[type="radio"]')[0].checked = false;
      $('input[type="radio"]')[1].checked = false;
      $('input[type="radio"]')[2].checked = false;
      $('#fechaAutorizacionDiv').removeClass('d-none');
      $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
      $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
      $('#botonesAdmin').removeClass('d-flex').hide();
      $("#sectionFactura").addClass('d-none');
      $("#numeroPreliminar3").val(resp[0].NUMERO_PRELIMINAR);
      $('#comentarioAnticipo').val(await getComentarioAprob(resp[0].ID, "O"));
      $('#comentarioAprobarFactura2').val(await getComentarioAprob(resp[0].ID, "T"));
      $('#comentarioLegalizacion').val(await getComentarioAprob(resp[0].ID, "T"));
      $("#sectionBtnGF2").removeClass("d-flex").addClass("d-none");
      $('#btnVerFacturaDiv2').addClass('d-flex').show();
      $('#verAdjPagoDiv').addClass('d-flex').show();
      $('#adjunto_facturaDiv2').hide();
      $('#comentarioFacturaDiv2').hide();
      $('#fechaPreliminarDiv2').removeClass('d-none');
      $('#fechaPreliminar2').val(formatDate(resp[0].FECHA_PRELIMINAR));
      $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
      $('#fechaAnticipoDiv').removeClass('d-none');
      $('#adjuntoAnticipoDiv').hide();
      $("#fechaCausacionDiv").removeClass('d-none');
      $('#adjuntoPagoDiv').hide();
      $("#fechaPagoDiv").removeClass('d-none');
      $("#adjuntoLegalizacion, #valorLegalizacion, #valorAnticipo, #valorAutorizado, #comentarioLegalizacion").attr("disabled", true);
      $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
      $('#botonesAprobarLegalizacion').removeClass('d-flex').hide();
      $("#valorLegalizacion").val(formatNumber(resp[0].VALOR_LEGALIZACION, "$"));
      $("#valorAnticipo").val(formatNumber(resp[0].VALOR_ANTICIPO, "$"));
      $("#valorAutorizado").val(formatNumber(resp[0].VALOR_AUTORIZADO, "$"));
      $("#adjuntoLegalizacionDiv").addClass('d-none');
      $("#btnVerLegalizacionDiv").removeClass('d-none').addClass('d-flex');
      $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $("#fechaFactura3").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $("#numeroDocumento3").val(resp[0].NUMERO_DOCUMENTO);
      $("#nit3").val(resp[0].NIT);
      $("#razonSocial3").val(resp[0].RAZON_SOCIAL);
      $("#codigoSap3").val(resp[0].CODIGO_SAP);
      $("#valorFactura3").val(formatNum(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura3").val(formatNum(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $("#iva3").val(formatNumber(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo3").val(resp[0].FONDO);
      $("#numeroFondo3").val(resp[0].NUMERO_FONDO);
      $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #nit3, #codigoSap3, #fondo3, #numeroFondo3, #valorFactura3, #iva3, #subTotalFactura3, #adjunto_factura2, #comentarioFactura2").attr("disabled", true);
      $("#sectionAprobarFactura").addClass('d-none');
      $('#fechaAprobarPreliminarDiv2').removeClass('d-none');
      $('#fechaAprobarPreliminar2').val((resp[0].FECHA_AUTORIZA_PRELI) ? formatDate(resp[0].FECHA_AUTORIZA_PRELI) : "");
      $('#fechaAprobarPreliminar2').attr('disabled', true);
      $('#comentarioAprobarFactura2').attr('disabled', true);
      $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
      $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
      $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
      $("#fechaPago").val(formatDate(resp[0].FECHA_PAGA));
      $("#fechaPago").attr("disabled", true);
      $("#adjuntoPago, #numeroZP").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
      $("#comentarioTesoreria").val(resp[0].COMENTARIO_PAGA);
      $("#numeroZP").val(resp[0].NUMERO_ZP);
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
      $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').attr('disabled', false);
      $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').val("");
      $('#fechaCompensacionDiv').addClass('d-none');
      if (resp[0].TIPO_GASTO === "3") {
         if (resp[0].TIPO_ANTICIPO === "1") $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
         $('#adjuntoAnticipo, #comentarioAnticipo').attr('disabled', true);
         $('#botonesAnticipo, #sectionBtnGA').removeClass('d-flex').hide();
         $('#btnVerAnticipoDiv').removeClass('d-none').addClass("d-flex").show();
         $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
         $('#checkAdmin, #checkAnticipo, #checkContabilidad, #checkTesoreria').removeClass('d-none').show();
         $('checkCompesacion').addClass('d-none').hide();
         $('#titleAnticipo').html(`<h5>Anticipo adjunto</h5>`);
         if (resp[0].TIPO_ANTICIPO === "2" || resp[0].TIPO_ANTICIPO === "3") {
            $('#fechaAnticipo').val((resp[0].FECHA_SOLICITA) && formatDate(resp[0].FECHA_SOLICITA));
            $("#fechaAutorizacion").val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
            $("#comentarioAutoriza").val(resp[0].COMENTARIO_FINALIZA);
         }
      }
      if (rolId !== 26 && rolId !== 69) {
         $('#botonesCompensacion').removeClass('d-flex').hide();
         $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').attr('disabled', true);
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
      $("#comentarioAutoriza, #fechaAutorizacion, #fechaAnticipo").attr("disabled", true);
      $('input[type="radio"]')[0].checked = false;
      $('input[type="radio"]')[1].checked = false;
      $('input[type="radio"]')[2].checked = false;
      $("#fechaAutorizacionDiv").removeClass('d-none');
      $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));      
      $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
      $('#comentarioAnticipo').val(await getComentarioAprob(resp[0].ID, "O"));
      $('#botonesAdmin').removeClass('d-flex').hide();
      $("#numeroCompensacion, #adjuntoContabilidad, #comentarioCompensacion, #adjuntoLegalizacion, #valorAnticipo, #valorLegalizacion, #valorAutorizado,#comentarioLegalizacion").attr("disabled", true);
      $('#botonesAprobarLegalizacion').removeClass('d-flex').hide();
      $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
      $("#sectionFactura").addClass('d-none');
      $("#numeroPreliminar").val(resp[0].NUMERO_PRELIMINAR);
      $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #nit3, #codigoSap3, #fondo3, #numeroFondo3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2, #comentarioAprobarFactura2").attr("disabled", true);
      $('#sectionBtnGF2').removeClass('d-flex').hide();
      $("#sectionAprobarFactura").addClass('d-none');
      $('#fechaAprobarPreliminar').val((resp[0].FECHA_AUTORIZA_PRELI) ? formatDate(resp[0].FECHA_AUTORIZA_PRELI) : "");
      $('#fechaAprobarPreliminar').attr('disabled', true);
      $('#comentarioAprobarFactura').attr('disabled', true);
      $("#fechaPago").val("");
      $("#fechaPago").attr("disabled", true);
      $("#adjuntoPago, #numeroZP").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
      $("#comentarioTesoreria, #comentarioContabilidad, #numeroCausacion").val("");
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
         $('#btnVerAnticipoDiv').removeClass('d-none').addClass("d-flex").show();
         $('#fechaAnticipoDiv').removeClass('d-none');
         $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
         $('#checkAdmin, #checkAnticipo').removeClass('d-none').show();
         $('#adjuntoAnticipoDiv').hide();
         $('#checkContabilidad, #checkTesoreria').addClass('d-none').hide();
         $('#titleAnticipo').html(`<h5>Anticipo adjunto</h5>`);
         if (resp[0].TIPO_ANTICIPO === "2" || resp[0].TIPO_ANTICIPO === "3") {
            $('#fechaAnticipo').val((resp[0].FECHA_SOLICITA) && formatDate(resp[0].FECHA_SOLICITA));
            $("#fechaAutorizacion").val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
            $("#comentarioAutoriza").val(resp[0].COMENTARIO_FINALIZA);
         }
      }
      if (rol !== 26 && rol !== 69) {
         $("#comentarioContabilidad").attr("disabled", true);
         $("#numeroCausacion").attr("disabled", true);
         $('#botonesContabilidad').removeClass('d-flex').hide();
      }
   }

   if ((ESTADO === "T" || ESTADO === "M") && TIPO_GASTO === "2") {
      $('#sectionAdmin').hide();
      $('#checkFactura, #checkAprobFactura').removeClass('d-none').show();
      $('#checkContabilidad, #checkTesoreria').addClass('d-none').hide();
      $('#divBtnRestaurar').removeClass('d-flex').hide();
      $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
      $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
      $('#botonesContabilidad').addClass('d-flex').show();
      $("#sectionFactura").removeClass('d-none').show();
      $("#numeroPreliminar, #fechaPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #subTotalFactura2, #iva2, #nit2, #fondo2, #numeroFondo2, #comentarioFactura, #adjunto_factura").attr("disabled", true);
      $('#btnVerFacturaDiv').addClass('d-flex').show();
      $('#adjunto_facturaDiv').hide();
      $('#comentarioFacturaDiv').hide();
      $('#numeroPreliminar').val(resp[0].NUMERO_PRELIMINAR);
      $('#fechaPreliminarDiv').removeClass('d-none');
      $('#fechaPreliminar').val(formatDate(resp[0].FECHA_PRELIMINAR));
      $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
      $("#nit2").val(resp[0].NIT);
      $("#codigoSap2").val(resp[0].CODIGO_SAP);
      $("#razonSocial2").val(resp[0].RAZON_SOCIAL);
      $("#valorFactura2").val(formatNum(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura2").val(formatNum(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $("#iva2").val(formatNumber(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo2").val(resp[0].FONDO);
      $("#numeroFondo2").val(resp[0].NUMERO_FONDO);
      $("#sectionBtnGF").removeClass("d-flex").addClass("d-none");
      $("#sectionAprobarFactura").removeClass('d-none');
      $('#fechaAprobarPreliminarDiv').removeClass('d-none');
      $('#fechaAprobarPreliminar').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
      $('#fechaAprobarPreliminar').attr('disabled', true);
      $('#comentarioAprobarFactura').attr('disabled', true);
      $('#comentarioAprobarFactura').val(await getComentarioAprob(resp[0].ID, "T"));
      $("#comentarioContabilidad").attr("disabled", true);
      $("#numeroCausacion").attr("disabled", true);
      $('#botonesContabilidad').removeClass('d-flex').hide();
      $("#fechaPago").val("");
      $("#fechaPago").attr("disabled", true);
      $("#adjuntoPago, #numeroZP").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
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
      $('#verAdjPagoDiv').removeClass('d-flex').hide();
      $("#sectionFactura").removeClass('d-none');
      $("#sectionAprobarFactura").removeClass('d-none');
      $('#fechaAprobarPreliminar').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
      $('#numeroPreliminar').val(resp[0].NUMERO_PRELIMINAR);
      $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #fechaAutorizacion, #fechaPreliminar, #razonSocial2, #valorFactura2, #subTotalFactura2, #iva2, #nit2, #fondo2, #numeroFondo2, #comentarioFactura").attr("disabled", true);
      $('#adjunto_facturaDiv').hide();
      $('#comentarioFacturaDiv').hide();
      $('#numeroPreliminar').val(resp[0].NUMERO_PRELIMINAR);
      $('#fechaPreliminarDiv').removeClass('d-none');
      $('#fechaPreliminar').val(formatDate(resp[0].FECHA_PRELIMINAR));
      $('#btnVerFacturaDiv').addClass('d-flex').show();
      $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
      $("#nit2").val(resp[0].NIT);
      $("#codigoSap2").val(resp[0].CODIGO_SAP);
      $("#razonSocial2").val(resp[0].RAZON_SOCIAL);
      $("#valorFactura2").val(formatNum(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura2").val(formatNum(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $("#iva2").val(formatNumber(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo2").val(resp[0].FONDO);
      $("#numeroFondo2").val(resp[0].NUMERO_FONDO);
      $('#fechaAprobarPreliminarDiv').removeClass('d-none');
      $('#fechaPreliminar').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
      $('#numeroPreliminar').attr('disabled', true);
      $('#fechaAprobarPreliminar').attr('disabled', true);
      $('#sectionBtnGF').removeClass('d-flex').hide();
      $('#adjunto_factura').attr('disabled', true);
      $('#comentarioFactura').attr('disabled', true);
      $('#comentarioAprobarFactura').attr('disabled', true);
      $('#comentarioAprobarFactura').val(await getComentarioAprob(resp[0].ID, "T"));
      $("#fechaCausacion").attr("disabled", true);
      $("#fechaCausacionDiv").removeClass('d-none');
      $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
      $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
      $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
      $("#numeroCausacion").attr("disabled", true);
      $("#comentarioContabilidad").attr("disabled", true);
      $('#botonesContabilidad').removeClass('d-flex').hide();
      $('#botonesAprobarFactura').removeClass('d-flex').hide();
      $('#botonesCompensacion').removeClass('d-flex').hide();
      $('#alerta1').addClass('d-none');
      $('#alerta2').addClass('d-none');
      $('#alerta3').addClass('d-none');
      if (rol !== 4) {
         $("#fechaPago").attr("disabled", true);
         $("#adjuntoPago, #numeroZP").attr("disabled", true);
         $("#comentarioTesoreria").attr("disabled", true);
         $('#botonesTesoreria').removeClass('d-flex').hide();
      }
      if (resp[0].REQUIERE_SOPORTE === "0") {
         $('#adjuntoPago').attr("disabled", true);
         $('#textoRequiere').removeClass('d-none');
      }
   }

   if (ESTADO === "C" && TIPO_GASTO === "3") {
      $('#divBtnRestaurar').removeClass('d-flex').hide();
      $('#sectionAdmin').show();
      $('#sectionAnticipo').show();
      $('#fechaAutorizacionDiv').removeClass('d-none');
      $('#sectionCompensacion').show();
      $('#btnVerFacturaDiv2').removeClass('d-flex').hide();
      $('#botonesAprobarLegalizacion').removeClass('d-flex').hide();
      $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
      $('#verAdjPagoDiv').removeClass('d-flex').hide();
      $('#checkAdmin, #checkFactura, #checkAprobFactura, #checkContabilidad').removeClass('d-none').show();
      $('#checkTesoreria').addClass('d-none').hide();
      $('input[type="radio"]').attr("disabled", true);
      $("#comentarioAutoriza, #fechaAutorizacion, #fechaAnticipo").attr("disabled", true);
      $('input[type="radio"]')[0].checked = false;
      $('input[type="radio"]')[1].checked = false;
      $('input[type="radio"]')[2].checked = false;
      $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
      $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
      $('#comentarioAnticipo').val(await getComentarioAprob(resp[0].ID, "O"));
      $('#botonesAdmin').removeClass('d-flex').hide();
      $("#sectionFactura").addClass('d-none');
      $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #nit3, #codigoSap3, #fondo3, #numeroFondo3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2, #comentarioAprobarFactura2").attr("disabled", true);
      $('#sectionBtnGF2').removeClass('d-flex').hide();
      $("#sectionAprobarFactura").addClass('d-none');
      $('#fechaAprobarPreliminar').val((resp[0].FECHA_AUTORIZA_PRELI) ? formatDate(resp[0].FECHA_AUTORIZA_PRELI) : "");
      $('#fechaAprobarPreliminar').attr('disabled', true);
      $('#comentarioAprobarFactura').attr('disabled', true);
      $("#fechaCausacion").attr("disabled", true);
      $("#numeroCompensacion, #adjuntoContabilidad, #comentarioCompensacion, #adjuntoLegalizacion, #valorLegalizacion, #valorAnticipo, #valorAutorizado,#comentarioLegalizacion").attr("disabled", true);
      $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
      $("#fechaCausacionDiv").removeClass('d-none');
      $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
      $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
      $("#numeroCausacion").attr("disabled", true);
      $("#comentarioContabilidad, #numeroCompensacion, #adjuntoContabilidad, #comentarioCompensacion").attr("disabled", true);
      $('#comentarioTesoreria, #adjuntoPago, #numeroZP, #numeroCompensacion, #adjuntoContabilidad, #comentarioCompensacion').val("");
      $('#botonesContabilidad').removeClass('d-flex').hide();
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
         $('#btnVerAnticipoDiv').removeClass('d-none').addClass("d-flex").show();
         $('#fechaAnticipoDiv').removeClass('d-none');
         $('#adjuntoAnticipoDiv').hide();
         $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
         $('#checkAdmin, #checkAnticipo, #checkContabilidad').removeClass('d-none').show();
         $('#checkTesoreria').addClass('d-none').hide();
         $('#titleAnticipo').html(`<h5>Anticipo adjunto</h5>`);
         if (resp[0].TIPO_ANTICIPO === "2" || resp[0].TIPO_ANTICIPO === "3") {
            $('#fechaAnticipo').val((resp[0].FECHA_SOLICITA) && formatDate(resp[0].FECHA_SOLICITA));
            $("#fechaAutorizacion").val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
            $("#comentarioAutoriza").val(resp[0].COMENTARIO_FINALIZA);
         }
      }
      if (rol !== 4) {
         $("#adjuntoPago, #numeroZP").attr("disabled", true);
         $("#comentarioTesoreria").attr("disabled", true);
         $('#botonesTesoreria').removeClass('d-flex').hide();
      }      
      if (resp[0].REQUIERE_SOPORTE === "0") {
         $('#adjuntoPago').attr("disabled", true);
         $('#textoRequiere').removeClass('d-none');
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
      $("#numeroPreliminar, #fechaPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #subTotalFactura2, #iva2, #nit2, #fondo2, #numeroFondo2, #comentarioFactura").attr("disabled", true);
      $('#adjunto_facturaDiv').hide();
      $('#comentarioFacturaDiv').hide();
      $('#numeroPreliminar').val(resp[0].NUMERO_PRELIMINAR);
      $('#verAdjPagoDiv').removeClass('d-flex').hide();
      $('#fechaPreliminarDiv').removeClass('d-none');
      $('#fechaPreliminar').val(formatDate(resp[0].FECHA_PRELIMINAR));
      $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $('#btnVerFacturaDiv').addClass('d-flex').show();
      $("#numeroDocumento2").val(resp[0].NUMERO_DOCUMENTO);
      $("#nit2").val(resp[0].NIT);
      $("#codigoSap2").val(resp[0].CODIGO_SAP);
      $("#razonSocial2").val(resp[0].RAZON_SOCIAL);
      $("#valorFactura2").val(formatNum(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura2").val(formatNum(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $("#iva2").val(formatNumber(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo2").val(resp[0].FONDO);
      $("#numeroFondo2").val(resp[0].NUMERO_FONDO);
      $("#sectionBtnGF").removeClass("d-flex").addClass("d-none");
      $("#sectionAprobarFactura").removeClass('d-none');
      $('#fechaAprobarPreliminarDiv').removeClass('d-none');
      $('#fechaAprobarPreliminar').val(formatDate(resp[0].FECHA_AUTORIZA_PRELI));
      $('#comentarioAprobarFactura').attr('disabled', true);
      $('#comentarioAprobarFactura').val(await getComentarioAprob(resp[0].ID, "T"));
      $("#fechaCausacion").attr("disabled", true);
      $("#fechaCausacionDiv").removeClass('d-none');
      $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
      $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
      $("#comentarioTesoreria").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
      $("#comentarioTesoreria").attr("disabled", true);
      $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
      $("#numeroCausacion").attr("disabled", true);
      $("#comentarioContabilidad").attr("disabled", true);
      $('#botonesContabilidad').removeClass('d-flex').hide();
      $('#botonesAprobarFactura').removeClass('d-flex').hide();
      $('#botonesCompensacion').removeClass('d-flex').hide();
      $('#botonesTesoreria').removeClass('d-flex').hide();
      $('#alerta1').addClass('d-none');
      $('#alerta2').addClass('d-none');
      $('#alerta3').addClass('d-none');
      if (rol === 4) {
         $("#adjuntoPago, #numeroZP").attr("disabled", false);
         $("#comentarioTesoreria").attr("disabled", false);
         $('#botonesTesoreria').addClass('d-flex').show();
      }
      if (resp[0].REQUIERE_SOPORTE === "0") {
         $('#adjuntoPago').attr("disabled", true);
         $('#textoRequiere').removeClass('d-none');
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
      $('#comentarioAprobarFactura').val(await getComentarioAprob(resp[0].ID, "T"));
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
      $("#nit2").val(resp[0].NIT);
      $("#codigoSap2").val(resp[0].CODIGO_SAP);
      $("#razonSocial2").val(resp[0].RAZON_SOCIAL);
      $("#valorFactura2").val(formatNum(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura2").val(formatNum(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $("#iva2").val(formatNumber(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo2").val(resp[0].FONDO);
      $("#numeroFondo2").val(resp[0].NUMERO_FONDO);
      $("#numeroPreliminar, #fechaPreliminar, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #iva2, #nit2, #fondo2, #numeroFondo2, #subTotalFactura2, #comentarioFactura").attr("disabled", true);
      $("#sectionAprobarFactura").removeClass('d-none');
      $("#fechaCausacion").attr("disabled", true);
      $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
      $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
      $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
      $("#numeroCausacion").attr("disabled", true);
      $("#comentarioContabilidad").attr("disabled", true);
      $('#botonesContabilidad').removeClass('d-flex').hide();
      $("#fechaPago").val(formatDate(resp[0].FECHA_PAGA));
      $("#fechaPago, #numeroZP").attr("disabled", true);
      $("#comentarioTesoreria").val(resp[0].COMENTARIO_PAGA);
      $("#numeroZP").val(resp[0].NUMERO_ZP);
      $("#comentarioTesoreria").attr("disabled", true);
      $('#botonesTesoreria').removeClass('d-flex').hide();
      $('#botonesAprobarFactura').removeClass('d-flex').hide();
      $('#botonesCompensacion').removeClass('d-flex').hide();
      $("#adjuntoPago").attr("disabled", true);
      $("#alerta").addClass('d-none');
      $('#alerta1').addClass('d-none');
      $('#alerta2').addClass('d-none');
      $('#alerta3').addClass('d-none');
      if (resp[0].REQUIERE_SOPORTE === "0") {
         $('#verAdjPago').attr("disabled", true);
         $('#textoRequiere').removeClass('d-none');
      } else {
         $('#verAdjPago').attr("disabled", false);
         $('#textoRequiere').addClass('d-none');
      }
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
      $('#comentarioAprobarFactura').val(await getComentarioAprob(resp[0].ID, "T"));
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
      $("#nit2").val(resp[0].NIT);
      $("#codigoSap2").val(resp[0].CODIGO_SAP);
      $("#razonSocial2").val(resp[0].RAZON_SOCIAL);
      $("#valorFactura2").val(formatNum(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura2").val(formatNum(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $("#iva2").val(formatNumber(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo2").val(resp[0].FONDO);
      $("#numeroFondo2").val(resp[0].NUMERO_FONDO);
      $("#sectionBtnGF").removeClass("d-flex").addClass("d-none");
      $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #fechaAutorizacion, #fechaPreliminar, #razonSocial2, #valorFactura2, #subTotalFactura2, #iva2, #nit2, #fondo2, #numeroFondo2, #comentarioFactura, #adjunto_factura").attr("disabled", true);
      $("#sectionAprobarFactura").removeClass('d-none');
      $("#fechaCausacion").attr("disabled", true);
      $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
      $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
      $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
      $("#numeroCausacion").attr("disabled", true);
      $("#comentarioContabilidad").attr("disabled", true);
      $('#botonesContabilidad').removeClass('d-flex').hide();
      $("#fechaPago").val(formatDate(resp[0].FECHA_PAGA));
      $("#fechaPago, #numeroZP").attr("disabled", true);
      $("#comentarioTesoreria").val(resp[0].COMENTARIO_PAGA);
      $("#numeroZP").val(resp[0].NUMERO_ZP);
      $("#comentarioTesoreria").attr("disabled", true);
      $('#botonesTesoreria').removeClass('d-flex').hide();
      $('#botonesAprobarFactura').removeClass('d-flex').hide();
      $('#botonesCompensacion').removeClass('d-flex').hide();
      $("#adjuntoPago").attr("disabled", true);
      $('#alerta1').addClass('d-none');
      $('#alerta2').addClass('d-none');
      $('#alerta3').addClass('d-none');
      if (resp[0].REQUIERE_SOPORTE === "0") {
         $('#verAdjPago').attr("disabled", true);
         $('#textoRequiere').removeClass('d-none');
      } else {
         $('#verAdjPago').attr("disabled", false);
         $('#textoRequiere').addClass('d-none');
      }
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
      $("#comentarioAutoriza, #fechaAutorizacion, #fechaAnticipo").attr("disabled", true);
      $('input[type="radio"]')[0].checked = false;
      $('input[type="radio"]')[1].checked = false;
      $('input[type="radio"]')[2].checked = false;
      $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
      $('#comentarioAnticipo').val(await getComentarioAprob(resp[0].ID, "O"));
      $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
      $('#fechaAprobarPreliminar').val((resp[0].FECHA_AUTORIZA_PRELI) ? formatDate(resp[0].FECHA_AUTORIZA_PRELI) : "");
      $('#fechaAprobarPreliminar').attr('disabled', true);
      $('#comentarioAprobarFactura').attr('disabled', true);
      $('#botonesAdmin').removeClass('d-flex').hide();
      $("#sectionAprobarFactura").addClass('d-none');
      $("#fechaCausacion").attr("disabled", true);
      $("#adjuntoLegalizacion, #valorLegalizacion, #valorAnticipo, #valorAutorizado, #comentarioLegalizacion").attr("disabled", true);
      $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
      $("#fechaCausacionDiv").removeClass('d-none');
      $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
      $("#comentarioContabilidad").attr("disabled", true);
      $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
      $("#valorAnticipo").val(formatNumber(resp[0].VALOR_ANTICIPO, "$"));
      $("#numeroCausacion").attr("disabled", true);
      $("#numeroCompensacion, #adjuntoContabilidad").val("");
      $("#numeroCompensacion, #adjuntoContabilidad").attr("disabled", true);
      $("#comentarioCompensacion").val("");
      $("#comentarioCompensacion").attr("disabled", true);
      $('#sectionBtnGF').removeClass('d-flex').hide();
      $('#numeroPreliminar').attr('disabled', true);
      $('#numeroPreliminar').val("");
      $('#adjunto_factura').attr('disabled', true);
      $('#comentarioFactura').attr('disabled', true);
      $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $("#numeroDocumento2").val("");
      $("#razonSocial2").val("");
      $("#valorFactura2").val("");
      $("#nit2").val("");
      $("#codigoSap2").val("");
      $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #nit3, #codigoSap3, #fondo3, #numeroFondo3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2, #comentarioAprobarFactura2").attr("disabled", true);
      $('#sectionBtnGF2').removeClass('d-flex').hide();
      $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
      $('#botonesAprobarLegalizacion').removeClass('d-flex').hide();
      $('#botonesContabilidad').removeClass('d-flex').hide();
      $("#fechaPago").val(formatDate(resp[0].FECHA_PAGA));
      $("#fechaPago").attr("disabled", true);
      $("#numeroZP").val(resp[0].NUMERO_ZP);
      $("#numeroZP").attr("disabled", true);
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
         $('#btnVerAnticipoDiv').removeClass('d-none').addClass("d-flex").show();
         $('#fechaAnticipoDiv').removeClass('d-none');
         $('#adjuntoAnticipoDiv').hide();
         $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
         $('#checkAdmin, #checkAnticipo, #checkContabilidad, #checkTesoreria').removeClass('d-none').show();
         $('#checkCompesacion').addClass('d-none').hide();
         $('#titleAnticipo').html(`<h5>Anticipo adjunto</h5>`);
         if (resp[0].TIPO_ANTICIPO === "2" || resp[0].TIPO_ANTICIPO === "3") {
            $('#fechaAnticipo').val((resp[0].FECHA_SOLICITA) && formatDate(resp[0].FECHA_SOLICITA));
            $("#fechaAutorizacion").val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
            $("#comentarioAutoriza").val(resp[0].COMENTARIO_FINALIZA);
         }
      }
      if (resp[0].USUARIO_SOLICITA === await getDatosUsuario() || rol === 1 || rol === 73) {
         $('#sectionBtnGF2').addClass('d-flex').removeClass('d-none').show();
         $('#btnGuardarLegalDiv').addClass('d-flex').removeClass('d-none').show();
         $("#adjuntoLegalizacion, #valorLegalizacion, #valorAnticipo, #comentarioLegalizacion").attr("disabled", false);
         $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #nit3, #fondo3, #numeroFondo3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2").attr("disabled", false);
      }
      console.log(resp[0].REQUIERE_SOPORTE)
      if (resp[0].REQUIERE_SOPORTE === "0") {
         $('#verAdjPago').attr("disabled", true);
         $('#textoRequiere').removeClass('d-none');
      } else {
         $('#verAdjPago').attr("disabled", false);
         $('#textoRequiere').addClass('d-none');
      }
   }

   if (ESTADO === "W" && TIPO_GASTO === "3") {
      $('#divBtnRestaurar').removeClass('d-flex').hide();
      $('#sectionAdmin, #sectionCompensacion').show();
      $('#checkAdmin, #checkFactura2, #checkAprobFactura2, #checkContabilidad, #checkTesoreria, #checkCompesacion, #checkLegalizacion').removeClass('d-none').show();
      $('input[type="radio"]').attr("disabled", true);
      $("#comentarioAutoriza, #fechaAutorizacion, #fechaAnticipo, #fechaCausacion, #fechaPreliminar2, #fechaCompensacion").attr("disabled", true);
      $('input[type="radio"]')[0].checked = false;
      $('input[type="radio"]')[1].checked = false;
      $('input[type="radio"]')[2].checked = false;
      $('#fechaAutorizacionDiv').removeClass('d-none');
      $("#fechaAutorizacion").val((resp[0].FECHA_AUTORIZA) && formatDate(resp[0].FECHA_AUTORIZA));
      $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
      $('#comentarioAnticipo').val(await getComentarioAprob(resp[0].ID, "O"));
      $('#comentarioAprobarFactura2').val(await getComentarioAprob(resp[0].ID, "T"));
      $('#comentarioLegalizacion').val(await getComentarioAprob(resp[0].ID, "T"));
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
      $("#adjuntoLegalizacion, #valorLegalizacion,  #valorAnticipo, #valorAutorizado, #comentarioLegalizacion, #comentarioLegalizacion").attr("disabled", true);
      $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
      $('#botonesAprobarLegalizacion').removeClass('d-flex').hide();
      $("#valorLegalizacion").val(formatNumber(resp[0].VALOR_LEGALIZACION, "$"));
      $("#valorAnticipo").val(formatNumber(resp[0].VALOR_ANTICIPO, "$"));
      $("#valorAutorizado").val(formatNumber(resp[0].VALOR_AUTORIZADO, "$"));
      $("#adjuntoLegalizacionDiv").addClass('d-none');
      $("#btnVerLegalizacionDiv").removeClass('d-none').addClass('d-flex');
      $("#fechaFactura2").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $("#fechaFactura3").val(formatearFecha(resp[0].FECHA_DOCUMENTO));
      $("#numeroDocumento3").val(resp[0].NUMERO_DOCUMENTO);
      $("#nit3").val(resp[0].NIT);
      $("#razonSocial3").val(resp[0].RAZON_SOCIAL);
      $("#codigoSap3").val(resp[0].CODIGO_SAP);
      $("#valorFactura3").val(formatNumber(resp[0].VALOR_DOCUMENTO, "$"));
      $("#subTotalFactura3").val(formatNumber(resp[0].SUBTOTAL_DOCUMENTO, "$"));
      $("#iva3").val(formatNumber(resp[0].IVA_DOCUMENTO, "$"));
      $("#fondo3").val(resp[0].FONDO);
      $("#numeroFondo3").val(resp[0].NUMERO_FONDO);
      $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #nit3, #codigoSap3, #fondo3, #numeroFondo3, #valorFactura3, #iva3, #subTotalFactura3, #adjunto_factura2, #comentarioFactura2").attr("disabled", true);
      $("#sectionAprobarFactura").addClass('d-none');
      $('#fechaAprobarPreliminarDiv2').removeClass('d-none');
      $('#fechaAprobarPreliminar2').val((resp[0].FECHA_AUTORIZA_PRELI) ? formatDate(resp[0].FECHA_AUTORIZA_PRELI) : "");
      $('#fechaAprobarPreliminar2').attr('disabled', true);
      $('#comentarioAprobarFactura2').attr('disabled', true);
      $("#fechaCausacion").val(formatDate(resp[0].FECHA_CAUSA));
      $("#numeroCausacion").val(resp[0].DOCUMENTO_CAUSA);
      $("#comentarioContabilidad").val(resp[0].COMENTARIO_CAUSA);
      $("#fechaPago").val(formatDate(resp[0].FECHA_PAGA));
      $("#fechaPago").attr("disabled", true);
      $("#adjuntoPago").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
      $("#comentarioTesoreria").val(resp[0].COMENTARIO_PAGA);
      $("#numeroZP").val(resp[0].NUMERO_ZP);
      $("#comentarioCompensacion").val(resp[0].COMENTARIO_COMPENSA);
      $("#comentarioTesoreria").attr("disabled", true);
      $('#botonesTesoreria').removeClass('d-flex').hide();
      $('#botonesAprobarFactura2').removeClass('d-flex').hide();
      $('#botonesCompensacion').addClass('d-flex').show();
      $('#adjuntoContabilidadDiv').hide();
      $('#verAdjContabilidadDiv').removeClass('d-none').addClass('d-flex').show();
      $("#alerta1").addClass('d-none');
      $("#alerta2").addClass('d-none');
      $("#alerta3").addClass('d-none');
      $("#comentarioContabilidad").attr("disabled", true);
      $("#numeroCausacion").attr("disabled", true);
      $('#botonesContabilidad').removeClass('d-flex').hide();
      $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').attr('disabled', false);
      $('#botonesCompensacion').removeClass('d-flex').hide();
      $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').attr('disabled', true);
      if (resp[0].TIPO_GASTO === "3") {
         if (resp[0].TIPO_ANTICIPO === "1") $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
         $('#adjuntoAnticipo, #comentarioAnticipo').attr('disabled', true);
         $('#botonesAnticipo, #sectionBtnGA').removeClass('d-flex').hide();
         $('#btnVerAnticipoDiv').removeClass('d-none').addClass("d-flex").show();
         $('#fechaAnticipo').val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
         $('#checkAdmin, #checkAnticipo, #checkContabilidad, #checkTesoreria').removeClass('d-none').show();
         $('checkCompesacion').addClass('d-none').hide();
         $('#titleAnticipo').html(`<h5>Anticipo adjunto</h5>`);
         if (resp[0].TIPO_ANTICIPO === "2" || resp[0].TIPO_ANTICIPO === "3") {
            $('#fechaAnticipo').val((resp[0].FECHA_SOLICITA) && formatDate(resp[0].FECHA_SOLICITA));
            $("#fechaAutorizacion").val((resp[0].FECHA_FINALIZA) && formatDate(resp[0].FECHA_FINALIZA));
            $("#comentarioAutoriza").val(resp[0].COMENTARIO_FINALIZA);
         }
      }
   }

   if (ESTADO === "R" && TIPO_GASTO !== "2") {
      $('#sectionAdmin').show();
      $('#sectionAnticipo').hide();
      $('input[type="radio"]').attr("disabled", true);
      $("#comentarioAutoriza").attr("disabled", true);
      $('input[type="radio"]')[0].checked = false;
      $('input[type="radio"]')[1].checked = false;
      $('input[type="radio"]')[2].checked = false;
      $('#fechaAprobarPreliminar').attr('disabled', true);
      $('#comentarioAprobarFactura').attr('disabled', true);
      $('#botonesAdmin').removeClass('d-flex').hide();
      $('#btnVerFacturaDiv2').removeClass('d-flex').hide();
      $('#botonesAprobarFactura2').removeClass('d-flex').hide();
      $("#sectionFactura").addClass('d-none');
      $("#sectionAprobarFactura").addClass('d-none');
      $("#fechaCausacion").attr("disabled", true);
      $("#fechaCausacion").val("");
      $("#comentarioContabilidad").val("");
      $("#numeroCausacion").val("");
      $("#numeroCausacion").attr("disabled", true);
      $('#sectionBtnGF').removeClass('d-flex').hide();
      $('#sectionBtnGF2').removeClass('d-flex').hide();
      $('#btnGuardarLegalDiv').removeClass('d-flex').hide();
      $('#botonesAprobarLegalizacion').removeClass('d-flex').hide();
      $("#comentarioContabilidad").attr("disabled", true);
      $('#botonesContabilidad').removeClass('d-flex').hide();
      $("#numeroPreliminar, #fechaFactura2, #numeroDocumento2, #iva2, #nit2, #fondo2, #numeroFondo2, #subTotalFactura2, #adjunto_factura, #comentarioFactura").attr("disabled", true);
      $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #nit3, #codigoSap3, #fondo3, #numeroFondo3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2, #comentarioAprobarFactura2, #valorAnticipo, #valorLegalizacion, #valorAutorizado, #comentarioLegalizacion, #adjuntoLegalizacion").attr("disabled", true);
      $("#fechaPago").val("");
      $("#fechaPago").attr("disabled", true);
      $("#btnVerFactura, #verAdjPago").attr("disabled", true);
      $("#comentarioTesoreria, #numeroZP").val("");
      $("#comentarioTesoreria, #numeroCompensacion, #adjuntoContabilidad, #comentarioCompensacion").attr("disabled", true);
      $('#botonesTesoreria').removeClass('d-flex').hide();
      $('#botonesAprobarFactura').removeClass('d-flex').hide();
      $('#botonesCompensacion').removeClass('d-flex').hide();
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
      $("#fechaAutorizacion").val(resp[0].FECHA_AUTORIZA);
      $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
      $("#adjuntosModal").show();
      $("#textAdjuntos").show();
      const respuesta = await enviarPeticion({ op: "G_ULTIMOCOMENTARIO", link: urlModels, idSolicitud: resp[0].ID });
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
   } else {
      $("#btnVerFactura, #verAdjPago").attr("disabled", false);
      if (resp[0].REQUIERE_SOPORTE === "0") {
         $('#verAdjPago').attr("disabled", true);
         $('#textoRequiere').removeClass('d-none');
      } else {
         $('#verAdjPago').attr("disabled", false);
         $('#textoRequiere').addClass('d-none');
      }
   }

   if (ESTADO === "R" && TIPO_GASTO === "3" && resp[0].TIPO_ANTICIPO === "1" && resp[0].COMENTARIO_RECHAZA === "3") {
      $('#sectionAdmin').show();
      $('#sectionAnticipo').show();
      $('#fechaAutorizacionDiv').removeClass('d-none');
      $('#btnVerAnticipoDiv').addClass("d-none").hide();
      $('#btnVerFacturaDiv2').removeClass('d-flex').hide();
      $('#sectionBtnGF2').removeClass('d-flex').hide();
      $('#checkAdmin').removeClass('d-none').show();
      $('#checkFactura, #checkAprobFactura, #checkContabilidad, #checkTesoreria, #checkAnticipo').addClass('d-none').hide();
      $('input[type="radio"]').attr("disabled", true);
      $('#divBtnRestaurar').removeClass('d-flex').hide();
      $("#comentarioAutoriza, #fechaAutorizacion").attr("disabled", true);
      $('input[type="radio"]')[0].checked = false;
      $('input[type="radio"]')[1].checked = false;
      $('input[type="radio"]')[2].checked = false;
      $("#fechaAutorizacion").val(formatDate(resp[0].FECHA_AUTORIZA));
      $("#comentarioAutoriza").val(resp[0].COMENTARIO_AUTORIZA);
      $('input[type="radio"]')[resp[0].ARCHIVO_SELECCIONADO].checked = true;
      $('#botonesAdmin').removeClass('d-flex').hide();
      $("#sectionFactura").removeClass('d-none');
      $('#botonesAprobarFactura2').removeClass('d-flex').hide();
      $('#numeroPreliminar, #adjunto_factura, #comentarioFactura, #fechaFactura2, #numeroDocumento2, #razonSocial2, #valorFactura2, #nit2, #numeroFondo2').val("");
      $("#sectionAprobarFactura").addClass('d-none');
      $('#numeroPreliminar, #adjunto_factura, #comentarioFactura, #fechaFactura2, #numeroDocumento2, #subTotalFactura2, #razonSocial2, #valorFactura2, #iva2, #nit2, #fondo2, #numeroFondo2, #comentarioAprobarFactura').attr('disabled', true);
      $("#numeroPreliminar3, #fechaFactura3, #numeroDocumento3, #razonSocial3, #nit3, #codigoSap3, #fondo3, #numeroFondo3, #valorFactura3, #subTotalFactura3, #iva3, #comentarioFactura2, #adjunto_factura2, #comentarioAprobarFactura2").attr("disabled", true);
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
      $("#adjuntoPago, #numeroZP").val("");
      $("#adjuntoPago, #numeroZP").attr("disabled", true);
      $('#botonesContabilidad').removeClass('d-flex').hide();
      $('#botonesTesoreria').removeClass('d-flex').hide();
      $('#botonesCompensacion').removeClass('d-flex').hide();
      $('#botonesAprobarFactura').removeClass('d-flex').hide();
      $('#sectionBtnGF').removeClass('d-flex').hide();
      $("#alerta1").addClass('d-none');
      $("#alerta2").addClass('d-none');
      if (resp[0].USUARIO_SOLICITA === await getDatosUsuario()) {
         $('#sectionFactura').removeClass('d-none').show();
         $('#sectionBtnGF').removeClass("d-none").addClass("d-flex");
         $('#numeroPreliminar, #adjunto_factura, #comentarioFactura, #fechaFactura2, #numeroDocumento2, #subTotalFactura2, #iva2, #nit2, #fondo2, #numeroFondo2').attr('disabled', false);
      }
      if (resp[0].TIPO_ANTICIPO === "1") {
         $('#sectionFactura').addClass('d-none').hide();
         $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').attr('disabled', true);
         $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').val("");
         $('#botonesAnticipo').removeClass("d-flex").hide();
         $('#comentarioAnticipo, #adjuntoAnticipo').attr('disabled', true);
         $('#sectionBtnGA').addClass("d-none").hide();
      }
      if (resp[0].TIPO_ANTICIPO === "1" && resp[0].USUARIO_SOLICITA === await getDatosUsuario()) {
         $('#comentarioAnticipo, #adjuntoAnticipo').attr('disabled', false);
         $('#sectionBtnGA').removeClass("d-none").addClass("d-flex");
      }
   }

   if (ESTADO !== "T" && TIPO_GASTO !== "3") {
      $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').attr('disabled', true);
      $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').val("");
   }

   if (TIPO_GASTO !== "3") {
      $('#sectionCompensacion').hide();
      $('#sectionAnticipo').hide();
      $("#sectionFactura2").addClass('d-none');
      $("#sectionAprobarFactura2").addClass('d-none');
      $('#comentarioCompensacion, #numeroCompensacion, #adjuntoContabilidad').attr('disabled', true);
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
      $('#sectionLegalizacion').removeClass('d-none');
   } else {
      $('#sectionLegalizacion').addClass('d-none');
   }

   if (TIPO_GASTO === "3" && resp[0].TIPO_ANTICIPO === "3") {
      $('#textArchivos').text("Solicitud de anticipo").show();
      $('#gridRadios1Div').hide();
      $('#sectionFactura2').removeClass('d-none');
      $('#sectionAprobarFactura2').removeClass('d-none');
   }

   if (TIPO_GASTO === "3" && resp[0].TIPO_ANTICIPO === "1") {
      $('#gridRadios1Div').show();
      $('#gridRadios2Div').show();
      $('#sectionFactura2').removeClass('d-none');
      $('#sectionAprobarFactura2').removeClass('d-none');
   }

   if (TIPO_GASTO === "1" && ESTADO !== "N") {
      $("#sectionFactura").removeClass('d-none');
      if (rolId === 1 || rolId === 73) {
         $("#sectionAprobarFactura").removeClass('d-none');
      }
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
      $('#adjunto1ModalDiv').show();
      $('#adjunto2ModalDiv').show();
      $('#adjunto3ModalDiv').show();
      $('#btnActualizarAdjDiv').addClass('d-flex').show();
      $('#comentarioAutoriza').attr('disabled', false);
   }
}

const verAdjuntoDinamico = (adjunto) => {
   console.log(adjunto);
   if (adjunto) {
      let url = `${url_file}/web/workflow/${adjunto}`;
      let extension = adjunto.split('.').pop().toLowerCase();
      let contenido = '';

      if (extension === 'pdf') {
         contenido = `<iframe src="${url}?t=${new Date().getTime()}" width="100%" height="600px"></iframe>`;
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
         contenido = `<img src="${url}?t=${new Date().getTime()}" style="width:100%; height:auto;" />`;
      } else {
         contenido = `<p>No se puede visualizar este tipo de archivo. <a href="${url}" target="_blank">Descargar</a></p>`;
      }

      $("#visorPDF").html(contenido);
      $("#modalVistaArchivos").modal('show');
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
         const adjunto = (resp[0].ADJUNTO_PAGO) ? resp[0].ADJUNTO_PAGO.trim() : "";

         verAdjuntoDinamico(adjunto);
      });
   }

   if (resp[0].ADJUNTO_CONTABILIDAD !== "") {
      $('#verAdjContabilidad').click(function () {
         const adjunto = (resp[0].ADJUNTO_CONTABILIDAD) ? resp[0].ADJUNTO_CONTABILIDAD.trim() : "";

         verAdjuntoDinamico(adjunto);
      });
   }
}

const verFacturaPreliminar = (resp, sw) => {
   let adjunto;

   if (sw === 1) { 
      adjunto = resp[0].ADJUNTO_FACTURA;

   } else if (sw === 2) {
      if (resp[0].TIPO_ANTICIPO === "1") {
         adjunto = resp[0].ADJUNTO_FINALIZA;

      } else {
         adjunto = resp[0].ADJUNTO_SOLICITA_1;
      }

   } else {
      adjunto = resp[0].ADJUNTO_LEGALIZACION;
   }

   if (adjunto) {
      let url = `${url_file}/web/workflow/${adjunto}.pdf`;
      let elementoIframe = `<iframe src="${url}?t=${new Date().getTime()}" width="100%" height="600px"></iframe>`;
      $("#visorPDF").html(elementoIframe);
      $("#modalVistaArchivos").modal('show');
   }
}

const getComentarioAprob = async (idSolicitud, estado) => {
   try {
      const data = await enviarPeticion({
         op: "G_COMENTARIO_APROBADO",
         link: urlModels,
         idSolicitud,
         estado
      });

      let cometario = (data[0]?.COMENTARIO) ? data[0]?.COMENTARIO : "-";
      return cometario;
   } catch (error) {
      console.log(error);
   }
}

const getComentariosModal = async (idSolicitud) => {
   try {
      const data = await enviarPeticion({
         op: "G_COMENTARIOS_2",
         link: urlModels,
         idSolicitud
      });

      if (data.length) {
         let elementos = `<ul>`;
         data.forEach(item => {
            elementos += `
               <li>
                  <p class="m-0 size-smaller text-primary">${item.USUARIO}:</p>
                  <p class="m-0 size-smaller-x text-muted">${item.COMENTARIO}</p>
               </li>`;
         });
         elementos += `</ul>`;
         $('.timeline-two').html(elementos);
      }
   } catch (error) {
      console.log(error);
   }
}

const gestionarSolicitud = async (data) => {
   const usuario = data.USUARIO_SOLICITA;
   const nombreUsuario = data.NOMBRE_USUARIO;
   $('#usuarioInfoM').val(`${usuario} - ${nombreUsuario}`);
   $('#usuarioInfo').val(usuario);
   $('#tipoGastoInfo').val(tipoGasto[data.TIPO_GASTO]);
   $('#tipoGastoInfoM').val(tipoGasto[data.TIPO_GASTO]);
   $('#departamentoInfo').val(data.DPTO);
   let fecha = formatDate(data.FECHA_SOLICITA);
   $('#fechaInfo').val(fecha.toUpperCase());
   $('#idOcultoSolicitud').val(data.ID);

   const resp = await enviarPeticion({ op: "G_INFOMODAL", idSolicitud: data.ID, link: urlModels });

   if (resp[0].TIPO_PERSONA === "1") {
      $('#infoSolicitud2').removeClass('d-none');
      $('#infoSolicitud3').addClass('d-none');
      $('#documentoInfo').val(resp[0].DOCUMENTO_IDENTIDAD);
      $('#nombreInfo').val(resp[0].NOMBRE_TERCERO);
      $('#celularInfo').val(resp[0].CELULAR);
      $('#correoInfo').val(resp[0].CORREO);
      $('#cargoInfo').val(resp[0].CARGO);
      $('#centroCostoInfo').val(resp[0].CENTRO_COSTOS);
   } else {
      $('#infoSolicitud2').addClass('d-none');
      $('#infoSolicitud3').removeClass('d-none');
      $('#nitInfo').val(resp[0].NIT_TERCERO);
      $('#codigoSAPInfo').val(resp[0].CODIGO_SAP_2);
      $('#razonSocialInfo').val(resp[0].RAZON_SOCIAL_TERCERO);
   }

   $("#adjCheck1, #adjCheck2, #adjCheck3").addClass("d-none").removeClass("d-flex");
   $("#btnVerAdj1, #btnVerAdj2, #btnVerAdj3").off("click");
   $('#estadoOcultoSolicitud').val(resp[0].ESTADO);
   let tipoAnticipo = resp[0].TIPO_ANTICIPO;
   if (tipoAnticipo === "1") tipoAnticipo = "- CON COTIZACIÓN";
   if (tipoAnticipo === "2") tipoAnticipo = "- LEGALIZACIÓN DE VIAJE";
   if (tipoAnticipo === "3") tipoAnticipo = "- SIN COTIZACIÓN";
   $('#tipoGastoInfoM').val(`${tipoGasto[data.TIPO_GASTO]} ${tipoAnticipo}`);

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

   getComentariosModal(data.ID);

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
      'Q': { color: '#B2A5FF', texto: 'FACTURA DE GASTO' },
      'T': { color: '#77dd77', texto: 'APROBACIÓN FACTURA' },
      'C': { color: '#84b6f4', texto: 'CAUSACIÓN' },
      'P': { color: '#ffda9e', texto: 'PAGO' },
      'F': { color: '#c5c6c8', texto: 'FINALIZACIÓN' },
      'R': { color: '#ff6961', texto: 'RECHAZAR' },
      'N': { color: '#ff6961', texto: 'NO CAUSACIÓN' },
      'M': { color: '#ff6961', texto: 'NO PAGO' },
      'L': { color: '#ff6961', texto: 'NO CONTABILIZADO' },
      'W': { color: '#FC8F54', texto: 'CONTABILIZADO' }
   }

   let estates = {
      'S': "S",
      'K': "A",
      'U': "S",
      'O': "A",
      'Q': "F",
      'T': "A",
      'C': "C",
      'P': "P",
      'F': "",
      'R': "R",
      'N': "N",
      'M': "N",
      'L': "",
      'W': "C"
   }

   const response = await enviarPeticion({ op: "G_INFOMODAL", link: urlModels, idSolicitud });
   const { ESTADO, USUARIO_SOLICITA, TIPO_GASTO, TIPO_ANTICIPO } = response[0];  

   const resp = await enviarPeticion({ op: "G_LOGS", idSolicitud, link: urlModels });
   $(".timeline").html(``);
   resp.forEach((item, index) => {
      const position = index % 2 === 0 ? "left" : "right";
      let estadoMostrar = "";
      let letraMostrar = "";

      if (item.ESTADO === "Q" && TIPO_GASTO === "3" && TIPO_ANTICIPO === "2") {
         estadoMostrar = "LEGALIZACIÓN";
         letraMostrar = "L";
      } else if (item.ESTADO === "T" && TIPO_GASTO === "3" && TIPO_ANTICIPO === "2") {
         estadoMostrar = "APROBACIÓN LEGALIZACIÓN";
         letraMostrar = "A";
      } else {
         estadoMostrar = estados[item.ESTADO].texto;
         letraMostrar = estates[item.ESTADO];
      }

      let timelineItem = `
      <div class="timeline-item" data-position="${position}">
          <div class="timeline-avatar" style="background-color: ${estados[item.ESTADO].color};">${letraMostrar}</div>
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
                    ${estadoMostrar}</span>
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
   if (ESTADO === "N" && USUARIO_SOLICITA === await getDatosUsuario()) await actualizarNota(idSolicitud);
   if (ESTADO === "M" && USUARIO_SOLICITA === await getDatosUsuario()) await actualizarNota(idSolicitud);

   $('#modalComentarios').modal('show');
}

const getSolicitudes = async () => {
   const fechaDesde = $('#fechaDesde').val();
   const fechaHasta = $('#fechaHasta').val();
   const oficina = $('#filtroOficina').val();
   const departamento = $('#filtroDepartamentos').val();
   const estado = $('#filtroEstados').val();
   const organizacion = $('#organizacionHidden').val();
   const usuario = await getDatosUsuario();
   try {
      let { data } = await enviarPeticion({
         op: "G_SOLICITUDES",
         link: urlModels,
         departamento,
         fechaDesde,
         organizacion,
         fechaHasta,
         oficina,
         estado
      });

      if (!data.length) {
         $('#contenedorTablaSolicitudes').html(`<p class="lead text-center">No hay solicitudes disponibles</p>`);
         $('#cantSolicitudes').text("0");
         return;
      }

      let resp = data;

      $('#cantSolicitudes').text(resp.length);

      let tabla = `
      <table id="tablaSolicitudes" class="table table-sm table-bordered table-hover" style="width: 100%;">
        <thead class="table-info">
            <tr>
               <th>N°</th>
               <th>Oficina</th>
               <th>Departamento</th>
               <th>Nit</th>
               <th>Nombre Tercero</th>
               <th>Concepto</th>
               <th>Tipo Gasto</th>
               <th>Usuario</th>
               <th class="text-center">Estado</th>
               <th>Número Causación</th>
               <th>Número ZP</th>
               <th class="text-center">Gestión</th>
               <th>Fecha Solicitud</th>
            </tr>
        </thead>
        <tbody>`;

      resp.forEach(item => {
         let estadoMostrar = "";
         
         if (item.ESTADO === "Q" && item.TIPO_GASTO === "3" && item.TIPO_ANTICIPO === "2") {
            estadoMostrar = "LEGALIZACIÓN";
         } else {
            estadoMostrar = estados[item.ESTADO].texto;
         }

         tabla += `
         <tr>
            <td class="size-13">${item.ID}</td>
            <td class="size-12">${item.OFICINA_VENTAS_T.split(' ')[1] || 'N/A'}</td>
            <td class="size-12">${item.DPTO || '-'}</td>
            <td class="size-13">${item.DOCUMENTO || '-'}</td>
            <td class="size-12">${item.NOMBRE_TERCERO || '-'}</td>
            <td class="size-12">${item.CONCEPTO || 'N/A'}</td>
            <td class="size-12">${tipoGasto[item.TIPO_GASTO] || 'Desconocido'}</td>
            <td class="size-12">
               <p style="margin: 0; font-size: 12px">${item.NOMBRE_USUARIO} <span style="font-size: 10px; color: #2575fc; font-weight: bold;">(${item.USUARIO_SOLICITA || 'N/A'})</span></p>
            </td>                       
            <td class="size-12" style="display: flex; justify-content: center;">
               <div data-item="${item.ID}" class="btn-noti position-relative" style="width: 90px;">
                  <span class="badge estados" style="background-color: ${estados[item.ESTADO].color}">${estadoMostrar}</span>
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${parseInt(item.INDICADORNOTA) > 0 ? "" : "d-none"}" style="font-size: 4px;">
                        1
                  </span>
               </div>
            </td>
            <td class="size-13">${item.DOCUMENTO_CAUSA || ''}</td>
            <td class="size-13">${item.NUMERO_ZP || ''}</td>
            <td style="display: flex; justify-content: center;">
               <button class="btn btn-outline-primary btn-sm btn-gestionar" data-item='${JSON.stringify(item)}'>
                  <i class="fa-solid fa-play"></i>
               </button>
            </td>
            <td class="size-12">${item.FECHA_SOLICITA ? formatDate(item.FECHA_SOLICITA).toUpperCase() : 'N/A'}</td>
         </tr>`;
      });

      tabla += `</tbody></table>`;      
      $('#contenedorTablaSolicitudes').html(tabla);

      $('#tablaSolicitudes').on('click', '.btn-noti', function (e) {
         const id = $(this).attr('data-item');
         gestionarLogs(id);
      });

      $('#tablaSolicitudes').on('click', '.btn-gestionar', function (e) {
         const data = JSON.parse($(this).attr('data-item'));
         resetModalGestionarSolicitud();
         gestionarSolicitud(data);
      });

   } catch (e) {
      console.error("Error al obtener las solicitudes:", e);
   }
}

const agregarConcepto = async () => {
   try {      
      let concepto = $("#conceptoModal").val().trim().toUpperCase();
      if (!concepto.length) {
         Swal.fire("Concepto vacío", "Debe diligenciar el concepto", "error");
      } else {
         $("#conceptoModal").val("");
         $("#modalAgregarConcepto").modal('hide');
         resp = await enviarPeticion({ op: "I_CONCEPTO", concepto, link: urlModels });
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
   const fondo = $("#fondo").val();
   const requiereSoporte = $("#requiere").val();
   const tipoPersona = $("#tipoPersona").val();
   const documento = $("#documento").val();
   const nitTercero = $("#nitTercero").val();

   if (!tipoGasto) {
      Swal.fire("Campo requerido", "El tipo de gasto es obligatorio", "error");
      return;
   }  

   if (tipoGasto === "1") {
      if (!concepto || !adjunto || !adjunto2 || !comentario || !requiereSoporte) {
         Swal.fire("Campos requeridos", "Todos los campos indicados con asterisco son obligatorios", "error");
         return false;
      }
   } else if (tipoGasto === "3") {
      if (!tipoAnticipo) {
         Swal.fire("Campo requerido", "El tipo de anticipo  es obligatorio", "error");
         return;
      }

      if (tipoAnticipo === "1") {
         if (!concepto || !adjunto || !adjunto2 || !comentario || !requiereSoporte) {
            Swal.fire("Campos requeridos", "Todos los campos indicados con asterisco son obligatorios", "error");
            return false;
         }
      } else {
         if (!concepto || !adjunto || !comentario || !requiereSoporte) {
            Swal.fire("Campos requeridos", "Todos los campos indicados con asterisco son obligatorios", "error");
            return false;
         }
      }
   } else {
      if (!concepto || !adjunto || !comentario || !fechaFactura || !subTotalFactura || !numeroDocumento || !razonSocial || !valorFactura || !numeroPreliminar || !fondo || !requiereSoporte) {
         Swal.fire("Campos requeridos", "Todos los campos indicados con asterisco son obligatorios", "error");
         return false;
      }

      if (fondo === "1" || fondo === "2") {
         if (!$("#numeroFondo").val()) {
            Swal.fire("Campo requerido", "Debe ingresar el número de fondo", "error");
            return false;
         }
      }
   }

   if (!tipoPersona) {
      Swal.fire("Campo requerido", "El tipo de persona es obligatorio", "error");
      return;
   }

   if (tipoPersona === "1") {
      if (!documento) {
         Swal.fire("Campos requeridos", "Debe ingresar todos los datos del tercero", "error");
         return false;
      }
   } else if (tipoPersona === "2") {
      if (!nitTercero) {
         Swal.fire("Campos requeridos", "Debe ingresar todos los datos del tercero", "error");
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
         else if (accion === "3" || accion === "6") nuevoNombre = "sol-work-flow-an";
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
            await enviarPeticion({ nombre: `${nuevoNombre}${i + 1}_${id_sol}`, id_sol, link: urlModels, op: "U_ADJUNTOS", adj: i + 1, accion });
         } else {
            console.log(i);
         }
      }
   }
}

const SubirArchivosAdjUpdate = async (id_sol, archivos, accion = "7") => {
   for (let item of archivos) {
      let file = item.file;
      let pos = item.pos;

      let nuevoNombre = "sol-work-flow-a";

      let UploadFile = await subirArchivos(file, {
         validateSize: false,
         maxSize: 0,
         validateExt: false,
         typesFile: {},
         ruta: "/web/workflow",
      }, (params = { nuevo_nombre: `${nuevoNombre}${pos}_${id_sol}` }));

      if (UploadFile.ok) {

         await enviarPeticion({
            nombre: `${nuevoNombre}${pos}_${id_sol}`,
            id_sol,
            link: urlModels,
            op: "U_ADJUNTOS_UPDATE",
            adj: pos,
            accion
         });

      } else {
         console.log("Error subiendo archivo posición:", pos);
      }
   }
}

const activarNotificacion = async (idSolicitud) => {
   const resp = await enviarPeticion({ op: "A_NOTIFICACION", link: urlModels, idSolicitud });
   getSolicitudes();
}

const actualizarArchivosAdj_v2 = async () => {
   let usuarioLogueado = await getDatosUsuario();
   let usuarioSolicitud = $("#usuarioInfo").val();
   let estadoSolicitud = $("#estadoOcultoSolicitud").val();

   if ((usuarioLogueado === usuarioSolicitud && estadoSolicitud === "S") || estadoSolicitud === "R") {
      let idSolicitud = $("#idOcultoSolicitud").val();

      let archivos = [
         { file: document.getElementById("adjunto1Modal").files[0], pos: 1 },
         { file: document.getElementById("adjunto2Modal").files[0], pos: 2 },
         { file: document.getElementById("adjunto3Modal").files[0], pos: 3 }
      ];

      let archivosSeleccionados = archivos.filter(a => a.file);

      if (archivosSeleccionados.length === 0) {
         Swal.fire("Campo requerido", "Debe adjuntar al menos un archivo", "error");
         return;
      }

      await SubirArchivosAdjUpdate(idSolicitud, archivosSeleccionados, "7");
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
      link: urlModels,
      ID_SOLICITUD: idSolicitud,
      COMENTARIO: comentario,
      USUARIO: usuario,
      ESTADO: estado
   });
   if (resp.ok && comentario.length) await activarNotificacion(idSolicitud);
   return resp;
}

const insertarLog = async (idSolicitud, estado, usuario, idComentario = null) => {
   await enviarPeticion({ op: "I_LOG", link: urlModels, idSolicitud, estado, usuario, idComentario });
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
         dataRequest.IVA_DOCUMENTO = dataRequest.IVA_DOCUMENTO.replace(/\./g, "");
         dataRequest.op = "I_SOLICITUD";
         dataRequest.link = urlModels;
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

         let accion = "";

         accion = (tipoGasto === "1" || tipoGasto === "3") ? "1" : "4";
         (tipoGasto === "3" && tipoAnticipo === "2") && (accion = "6");
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
      let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, campoRadio, idSolicitud, link: urlModels });
      if (resp.ok) {
         $("#comentarioAutoriza").val("");
         $('#modalGestionarSolicitud').modal('hide');
         Swal.fire(`Autorización de ${msgText2}`, `${msgText2} autorizado(a)`, "success");
         getSolicitudes();
         let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
         const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
         await insertarLog(idSolicitud, estado, usuario, comentarioID);
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
      let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, campoRadio, idSolicitud, link: urlModels });
      if (resp.ok) {
         $("#comentarioAprobarFactura").val("");
         $('#modalGestionarSolicitud').modal('hide');
         Swal.fire(`Aprobación de ${msgText}`, `${msgText} aprobada`, "success");
         let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
         const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
         await insertarLog(idSolicitud, estado, usuario, comentarioID);
         getSolicitudes();
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
      let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, valorAutorizado, idSolicitud, link: urlModels });
      if (resp.ok) {
         $("#comentarioLegalizacion").val("");
         $("#valorAutorizado").val("");
         $('#modalGestionarSolicitud').modal('hide');
         Swal.fire("Aprobación de legalización", "Legalización aprobada", "success");
         let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
         const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
         await insertarLog(idSolicitud, estado, usuario, comentarioID);
         getSolicitudes();
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

   const resp = await enviarPeticion({ op: "G_INFOMODAL", idSolicitud, link: urlModels });
   const { TIPO_GASTO } = resp[0];

   let msgText = "";

   if (TIPO_GASTO === "1" || TIPO_GASTO === "2") {
      msgText = "FACTURA APROBADA";
   } else if (TIPO_GASTO === "3") {
      msgText = "ANTICIPO APROBADO";
   }

   const result = await confirmAlert("Causación de solicitud", `La solicitud pasará de estado ${msgText} a CAUSADO`);
   if (result.isConfirmed) {
      let estado = "C";
      let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, numeroCausacion, idSolicitud, link: urlModels });
      if (resp.ok) {
         $("#numeroCausacion").val("");
         $("#modalGestionarSolicitud").click();
         Swal.fire("Causación solicitud", "Solicitud Causada correctamente", "success");
         let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
         const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
         await insertarLog(idSolicitud, estado, usuario, comentarioID);
         getSolicitudes();
      }
   }
}

const subirAdjuntoVariado = async (idSolicitud, arrayArchivos, numeroProceso,  nombreArchivo, accion) => {
   for (let i = 0; i < arrayArchivos.length; i++) {
      if (arrayArchivos[i]) {
         const long = arrayArchivos[i].name.split('.').length;
         let extension = arrayArchivos[i].name.split('.')[long - 1];

         let UploadFile = await subirArchivos(arrayArchivos[i], {
            validateSize: false,
            maxSize: 0,
            validateExt: false,
            typesFile: {},
            ruta: "/web/workflow",
         }, (params = { nuevo_nombre: `${nombreArchivo}_${numeroProceso}`.replaceAll(" ", "_") }));

         if (UploadFile.ok) {
            const name = `${nombreArchivo}_${numeroProceso}`.replaceAll(" ", "_");
            await enviarPeticion({
               nombre: `${name}.${extension}`,
               idSolicitud,
               link: urlModels,
               op: "U_ADJUNTO_VARIADO",
               accion
            });
         } else {
            console.log(i);
         }
      }
   }
}

const compensar = async () => {
   const adjuntoCompensacion = document.getElementById('adjuntoContabilidad').files[0];
   const idSolicitud = $("#idOcultoSolicitud").val();
   const usuario = await getDatosUsuario();
   const numeroCompensacion = $("#numeroCompensacion").val();
   const comentario = $("#comentarioCompensacion").val();

   if (!numeroCompensacion) {
      Swal.fire("Campo requerido", "Debe ingresar el número de compensación", "error");
      return;
   }

   const result = await confirmAlert("Compensación de solicitud", "La solicitud pasará de estado FACTURA APROBADA a CONTABILIZADO");
   if (result.isConfirmed) {
      let estado = "W";
      let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, numeroCompensacion, idSolicitud, link: urlModels });
      if (resp.ok) {
         if (adjuntoCompensacion) await subirAdjuntoVariado(idSolicitud, [adjuntoCompensacion], numeroCompensacion, "workflow-compensacion", "1");
         $("#comentarioCompensacion").val("");
         $("#numeroCompensacion").val("");
         $("#adjuntoContabilidad").val("");
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
   const usuario = await getDatosUsuario();
   const adjuntoPago = document.querySelector("#adjuntoPago").files[0];
   const comentario = $("#comentarioTesoreria").val();
   const numeroZP = $("#numeroZP").val();
   const tipoGastoText = $('#tipoGastoInfo').val();

   const resp = await enviarPeticion({ op: "G_INFOMODAL", idSolicitud, link: urlModels });
   const { REQUIERE_SOPORTE } = resp[0];

   if (REQUIERE_SOPORTE === "1" && !adjuntoPago) {
      Swal.fire("Campo requerido", "Debe adjuntar el soporte de pago", "error");
      return;
   }

   if (!numeroZP) {
      Swal.fire("Campos requeridos", "Debe ingresar el número ZP", "error");
      return;
   }

   const result = await confirmAlert("Pago de solicitud", "La solicitud pasará de estado CAUSADO a PAGADO");
   if (result.isConfirmed) {
      let estado = "P";
      let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, numeroZP, idSolicitud, link: urlModels });
      if (resp.ok) {
         $("#adjuntoPago").val("");
         $("#comentarioTesoreria").val("");
         $("#numeroZP").val("");
         $('#modalGestionarSolicitud').modal('hide');
         Swal.fire("Pago solicitud", "Solicitud pagada correctamente", "success");
         if (adjuntoPago) {
            let arr_arch = [adjuntoPago];
            await subirAdjuntoVariado(idSolicitud, arr_arch, numeroZP, "workflow-pago", "2");
         }
         let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
         const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
         await insertarLog(idSolicitud, estado, usuario, comentarioID);
         getSolicitudes();
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

   if (!comentario.length) {
      Swal.fire("Comentario requerido", "Es necesario dejar un comentario con el motivo por el cual se rechaza la solicitud", "warning");
      return;
   }

   const result = await confirmAlert("Rechazar solicitud", `La solicitud pasará a estado RECHAZADO`);
   if (result.isConfirmed) {
      let estado = "R";
      let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentarioSW, idSolicitud, link: urlModels });
      if (resp.ok) {
         $("#comentarioAutoriza").val("");
         $("#modalGestionarSolicitud").modal('hide');
         Swal.fire("Rechazar solicitud", "La solicitud ha sido rechazada", "info");
         let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
         await insertarLog(idSolicitud, estado, usuario, idComentario.id);
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

   const result = await confirmAlert("No causar", "La solicitud pasará a estado NO CAUSADO");
   if (result.isConfirmed) {
      let estado = "N";
      await enviarPeticion({ op: "U_ESTADOS", estado, usuario, idSolicitud, link: urlModels });
      let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
      await insertarLog(idSolicitud, estado, usuario, idComentario.id);
      $("#modalGestionarSolicitud").modal('hide');
      Swal.fire("Causación pendiente", "Solicitud pendiente", "info");
      getSolicitudes();
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

   const result = await confirmAlert("No compensar", "La solicitud pasará a estado NO COMPENSADO");
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

   const result = await confirmAlert("No realizar pago", "La solicitud pasará a estado NO PAGADO");
   if (result.isConfirmed) {
      let estado = "M";
      await enviarPeticion({ op: "U_ESTADOS", estado, usuario, idSolicitud, link: urlModels });
      let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
      await insertarLog(idSolicitud, estado, usuario, idComentario.id);
      $("#modalGestionarSolicitud").modal('hide');
      Swal.fire("Causación pendiente", "Solicitud pendiente", "info");
      getSolicitudes();
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
   const iva = (sw === 1) ? $('#iva2').val().replace(/\./g, "") : $('#iva3').val().replace(/\./g, "");
   const nit = (sw === 1) ? $('#nit2').val() : $('#nit3').val();
   const codigoSap = (sw === 1) ? $('#codigoSap2').val().trim() : $('#codigoSap3').val().trim();
   const fondo = (sw === 1) ? $('#fondo2').val() : $('#fondo3').val();
   const numeroFondo = (sw === 1) ? $('#numeroFondo2').val() : $('#numeroFondo3').val();
   const idSolicitud = $("#idOcultoSolicitud").val();
   const usuario = await getDatosUsuario();
   const comentario = (sw === 1) ? $("#comentarioFactura").val() : $("#comentarioFactura2").val();

   if (!adjuntoFactura || !numeroPreliminar || !fechaFactura || !numeroDocumento || !razonSocial || !valorFactura || !subTotalFactura || !nit || !fondo) {
      Swal.fire('Campos requeridos', 'Todos los campos de la factura son requeridos', 'error');
      return;
   }

   if ((fondo === "1" || fondo === "2") && !numeroFondo) {
      Swal.fire('Campo requerido', 'Debe ingresar el número de fondo', 'error');
      return;
   }

   (sw === 1) ? $('#adjunto_factura').val("") : $('#adjunto_factura2').val("");
   (sw === 1) ? $('#comentarioFactura').val("") : $('#comentarioFactura2').val("");
   (sw === 1) ? $('#numeroPreliminar').val("") : $('#numeroPreliminar2').val("");
   (sw === 1) ? $('#fechaFactura2').val("") : $('#fechaFactura3').val("");
   (sw === 1) ? $('#numeroDocumento2').val("") : $('#numeroDocumento3').val("");
   (sw === 1) ? $('#razonSocial2').val("") : $('#razonSocial3').val("");
   (sw === 1) ? $('#valorFactura2').val("") : $('#valorFactura3').val("");
   (sw === 1) ? $('#nit2').val("") : $('#nit3').val("");
   (sw === 1) ? $('#codigoSap2').val("") : $('#codigoSap3').val("");

   let estado = "Q";
   let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, numeroPreliminar, fechaFactura, subTotalFactura, numeroDocumento, iva, razonSocial, valorFactura, nit, codigoSap, fondo, numeroFondo, idSolicitud, link: urlModels });
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
   const valorAnticipo = $('#valorAnticipo').val().replace(/\./g, "");
   const idSolicitud = $("#idOcultoSolicitud").val();
   const usuario = await getDatosUsuario();
   const comentario = $("#comentarioLegalizacion").val();

   if (!adjuntoLegal || !valorLegal || !valorAnticipo) {
      Swal.fire('Campos requeridos', 'El adjunto de la legalización y los valores a legalizar son requeridos', 'error');
      return;
   }

   $('#adjuntoLegalizacion').val("");
   $('#valorLegalizacion').val("");
   $('#valorAnticipo').val("");

   const estado = "Q";
   let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, valorLegal, valorAnticipo, idSolicitud, link: urlModels });
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
   let resp = await enviarPeticion({ op: "U_ESTADOS", estado, usuario, comentario, idSolicitud, link: urlModels });
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

   const resp = await enviarPeticion({ op: "G_INFOMODAL", idSolicitud, link: urlModels });
   const { COMENTARIO_RECHAZA } = resp[0];

   let estado = "";
   if (COMENTARIO_RECHAZA === "1") estado = "S";
   if (COMENTARIO_RECHAZA === "2" || COMENTARIO_RECHAZA === "4") estado = "Q";
   if (COMENTARIO_RECHAZA === "3") estado = "U";

   const result = await confirmAlert("Confirmar corrección", "¿Las correcciones de la solicitud han sido realizadas?");
   if (!result.isConfirmed) {
      return;
   }

   const respuesta = await enviarPeticion({ op: "U_SOLICITUD", link: urlModels, idSolicitud, estado });
   let idComentario = await insertarComentario(idSolicitud, comentario, usuario, estado);
   const comentarioID = (parseInt(idComentario.id) > 0) ? idComentario.id : "";
   if (respuesta.ok) {
      insertarLog(idSolicitud, estado, usuario, comentarioID);
   }
   $('#modalGestionarSolicitud').modal('hide');
   getSolicitudes();
}

function exportarExcel(nombreArchivo = "solicitudes.xlsx", nombreHoja = "Datos") {
   const tabla = document.getElementById("tablaSolicitudes");
   if (!tabla) {
      console.log("No se encontró la tabla");
      return;
   }

   const wb = XLSX.utils.table_to_book(tabla, {
      sheet: nombreHoja,
      raw: true,
   });

   XLSX.writeFile(wb, nombreArchivo);
}

const filtrar = (filtro) => {
   const filas = document.querySelectorAll('#tablaSolicitudes tbody tr');

   filas.forEach(fila => {
      const celdas = fila.querySelectorAll('td');
      const coincide = Array.from(celdas).some(td => td.textContent.toLowerCase().includes(filtro));

      fila.style.display = coincide ? '' : 'none';
   });
}

const getTerceros = async (nit) => {
   try {
      const resp = await enviarPeticion({ op: "G_TERCEROS", link: urlModels, nit });
      return resp;      
   } catch (error) {
      console.log(error);
   }
}

const getTerceros2 = async (identificacion) => {
   try {
      const resp = await enviarPeticion({ op: "G_TERCEROS_2", link: urlModels, identificacion });
      return resp;      
   } catch (error) {
      console.log(error);
   }
}

function resetModalGestionarSolicitud() {
   const modal = $('#modalGestionarSolicitud');

   modal.find('input[type="text"], input[type="date"], textarea').val('');
   modal.find('input[type="hidden"]').val('');
   modal.find('select').prop('selectedIndex', 0);
   modal.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
   modal.find('input[type="file"]').val('');
   $('#iva2, #iva3').val('0');

   const secciones = [
      '#sectionFactura',
      '#sectionFactura2',
      '#sectionAprobarFactura',
      '#sectionAprobarFactura2',
      '#sectionLegalizacion'
   ];

   secciones.forEach(sec => $(sec).addClass('d-none'));

   const seccionesBase = [
      '#sectionAdmin',
      '#sectionAnticipo',
      '#sectionContabilidad',
      '#sectionTesoreria',
      '#sectionCompensacion'
   ];

   seccionesBase.forEach(sec => $(sec).removeClass('d-none'));

   modal.find(`
      #fechaAutorizacionDiv,
      #fechaAnticipoDiv,
      #fechaPreliminarDiv,
      #fechaPreliminarDiv2,
      #fechaAprobarPreliminarDiv,
      #fechaAprobarPreliminarDiv2,
      #fechaCausacionDiv,
      #fechaPagoDiv,
      #fechaCompensacionDiv,
      #btnVerLegalizacionDiv,
      #verAdjContabilidadDiv
   `).addClass('d-none');

   modal.find('#alerta1, #alerta2, #alerta3').addClass('d-none');

   modal.find(`
      #checkAdmin,
      #checkAnticipo,
      #checkFactura,
      #checkFactura2,
      #checkAprobFactura,
      #checkAprobFactura2,
      #checkContabilidad,
      #checkTesoreria,
      #checkLegalizacion,
      #checkCompesacion
   `).addClass('d-none');

   $('#textArchivos').text('Seleccione uno de los archivos adjuntos');

   modal.find('input, textarea, select').prop('disabled', false);

   $('#usuarioInfoM, #departamentoInfo, #tipoGastoInfoM, #fechaInfo').prop('disabled', true);
   $('#documentoInfo, #nombreInfo, #celularInfo, #correoInfo, #cargoInfo, #centroCostoInfo, #nitInfo, #codigoSAPInfo, #razonSocialInfo').prop('disabled', true);
   $('#codigoSap2, #razonSocial2, #valorFactura2').prop('disabled', true);

   modal.find('.modal-body').scrollTop(0);
}

// EJECUCIÓN DE FUNCIONALIDADES.
$(function () {
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

   $("#fechaDesde, #fechaHasta, #filtroDepartamentos, #filtroOficina, #filtroEstados").change(function () {
      getSolicitudes();
   });

   const oficinas = OficinasVentas('S');
   $('#filtroOficina').html(oficinas);

   getDptos();
   getSolicitudes();

   $("#iva, #iva2, #numeroCausacion, #numeroCompensacion, #numeroPreliminar, #numeroPreliminar2, #documento, #nitTercero").on("input", function () {
      this.value = this.value.replace(/\D/g, "");
   });

   $('#valorAnticipo, #valorAnticipo1, #valorLegalizacion, #valorAutorizado, #valorFactura, #iva, #iva2, #iva3, #subTotalFactura, #subTotalFactura2, #valorFactura2').on('input', function () {
      let value = $(this).val().replace(/[^0-9]/g, '');
      if (value) value = parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 0 });
      $(this).val(value);
   });

   $('#subTotalFactura').change(function () {
      const subTotal = parseFloat($(this).val().replace(/[.$]/g, ''));
      const iva = parseFloat($('#iva').val().replace(/[.$]/g, ''));
      if (!isNaN(subTotal) && !isNaN(iva)) {
         const valorFactura = Math.round(subTotal + iva);
         $('#valorFactura').val(valorFactura.toLocaleString('es-ES', { minimumFractionDigits: 0 }));
      }
   });

   $('#subTotalFactura2').change(function () {
      const subTotal = parseFloat($(this).val().replace(/[.$]/g, ''));
      const iva = parseFloat($('#iva2').val().replace(/[.$]/g, ''));
      if (!isNaN(subTotal) && !isNaN(iva)) {
         const valorFactura = Math.round(subTotal + iva);
         $('#valorFactura2').val(valorFactura.toLocaleString('es-ES', { minimumFractionDigits: 0 }));
      }
   });

   $('#subTotalFactura3').change(function () {
      const subTotal = parseFloat($(this).val().replace(/[.$]/g, ''));
      const iva = parseFloat($('#iva3').val().replace(/[.$]/g, ''));
      if (!isNaN(subTotal) && !isNaN(iva)) {
         const valorFactura = Math.round(subTotal + iva);
         $('#valorFactura3').val(valorFactura.toLocaleString('es-ES', { minimumFractionDigits: 0 }));
      }
   });

   $('#iva').change(function () {
      const iva = parseFloat($(this).val().replace(/[.$]/g, ''));
      const subTotal = parseFloat($('#subTotalFactura').val().replace(/[.$]/g, ''));
      if (!isNaN(subTotal) && !isNaN(iva)) {
         const valorFactura = Math.round(subTotal + iva);
         $('#valorFactura').val(valorFactura.toLocaleString('es-ES', { minimumFractionDigits: 0 }));
      }
   });

   $('#iva2').change(function () {
      const iva = parseFloat($(this).val().replace(/[.$]/g, ''));
      const subTotal = parseFloat($('#subTotalFactura2').val().replace(/[.$]/g, ''));
      if (!isNaN(subTotal) && !isNaN(iva)) {
         const valorFactura = Math.round(subTotal + iva);
         $('#valorFactura2').val(valorFactura.toLocaleString('es-ES', { minimumFractionDigits: 0 }));
      }
   });
   
   $('#iva3').change(function () {
      const iva = parseFloat($(this).val().replace(/[.$]/g, ''));
      const subTotal = parseFloat($('#subTotalFactura3').val().replace(/[.$]/g, ''));
      if (!isNaN(subTotal) && !isNaN(iva)) {
         const valorFactura = Math.round(subTotal + iva);
         $('#valorFactura3').val(valorFactura.toLocaleString('es-ES', { minimumFractionDigits: 0 }));
      }
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
      if (rolId !== 1) return;
      $('#modalAgregarConcepto').modal('show');
   });

   $('#btnGuardar').on('click', async (e) => {
      e.preventDefault();
      insertarSolicitud();
   });

   $("#btnActualizarAdj").on("click", () => {
      actualizarArchivosAdj_v2();
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

   $("#btnExportar").on("click", () => {
      const rows = $('#tablaSolicitudes tbody tr').length;
      if (!rows) return;

      exportarExcel();
   });

   $("#filtroSolicitudes").keyup(function () {
      let filtro = $(this).val().toLowerCase();
      filtrar(filtro);
   });

   $('#fondo').change(function () {
      const fondo = $(this).val();
      
      if (fondo === "3" || fondo === "") {
         $('#numeroFondo').attr('disabled', true);
      } else {
         $('#numeroFondo').attr('disabled', false);
      }
   });

   $('#fondo2').change(function () {
      const fondo = $(this).val();
      
      if (fondo === "3" || fondo === "") {
         $('#numeroFondo2').attr('disabled', true);
      } else {
         $('#numeroFondo2').attr('disabled', false);
      }
   });
   
   $('#fondo3').change(function () {
      const fondo = $(this).val();
      
      if (fondo === "3" || fondo === "") {
         $('#numeroFondo3').attr('disabled', true);
      } else {
         $('#numeroFondo3').attr('disabled', false);
      }
   });

   $('#tipoPersona').change(function () {
      const tipo = $(this).val();

      if (tipo === "1") {
         $('#documentoDiv, #nombreDiv, #celularDiv, #correoDiv, #cargoDiv, #centroCostosDiv').removeClass('d-none');
         $('#nitDiv, #codigoSapDiv, #razonSocialDiv').addClass('d-none');
         $('#nitTercero, #codigoSAP2, #razonSocialTercero').val("");

      } else if (tipo === "2") {
         $('#nitDiv, #codigoSapDiv, #razonSocialDiv').removeClass('d-none');
         $('#documentoDiv, #nombreDiv, #celularDiv, #correoDiv, #cargoDiv, #centroCostosDiv').addClass('d-none');
         $('#documento, #nombreTercero, #celular, #correo, #cargo, #centroCostos').val("");

      } else {
         $('#documentoDiv, #nombreDiv, #celularDiv, #correoDiv, #cargoDiv, #centroCostosDiv, #nitDiv, #codigoSapDiv, #razonSocialDiv').addClass('d-none');
         $('#documento, #nombreTercero, #celular, #correo, #cargo, #centroCostos, #nitTercero, #codigoSAP2, #razonSocialTercero').val("");
      }
   });

   $('#nit').autocomplete({
      source: async function (request, response) {
         const data = await getTerceros(request.term);

         const resultado = data.map(item => ({
            label: `${item.CODIGO_SAP} - ${item.NOMBRES}`,
            value: item.NIT,
            data: item
         }));

         response(resultado);
      },
      minLength: 3,
      select: function (event, ui) {
         $('#codigoSap').val(ui.item.data.CODIGO_SAP);
         $('#razonSocial').val(ui.item.data.NOMBRES);
      }
   });

   $('#nit2').autocomplete({
      source: async function (request, response) {
         const data = await getTerceros(request.term);

         const resultado = data.map(item => ({
            label: `${item.CODIGO_SAP} - ${item.NOMBRES}`,
            value: item.NIT,
            data: item
         }));

         response(resultado);
      },
      minLength: 3,
      select: function (event, ui) {
         $('#codigoSap2').val(ui.item.data.CODIGO_SAP);
         $('#razonSocial2').val(ui.item.data.NOMBRES);
      }
   });

   $('#nit3').autocomplete({
      source: async function (request, response) {
         const data = await getTerceros(request.term);

         const resultado = data.map(item => ({
            label: `${item.CODIGO_SAP} - ${item.NOMBRES}`,
            value: item.NIT,
            data: item
         }));

         response(resultado);
      },
      minLength: 3,
      select: function (event, ui) {
         $('#codigoSap3').val(ui.item.data.CODIGO_SAP);
         $('#razonSocial3').val(ui.item.data.NOMBRES);
      }
   });

   $('#nitTercero').autocomplete({
      source: async function (request, response) {
         const data = await getTerceros(request.term);

         const resultado = data.map(item => ({
            label: `${item.CODIGO_SAP} - ${item.NOMBRES}`,
            value: item.NIT,
            data: item
         }));

         response(resultado);
      },
      minLength: 3,
      select: function (event, ui) {
         $('#codigoSAP2').val(ui.item.data.CODIGO_SAP);
         $('#razonSocialTercero').val(ui.item.data.NOMBRES);

         if ($('#tipoGasto').val() === "2") {
            $('#nit').attr('disabled', true);
            $('#nit').val(ui.item.data.NIT);
            $('#codigoSap').val(ui.item.data.CODIGO_SAP);
            $('#razonSocial').val(ui.item.data.NOMBRES);
         } else {
            $('#nit').attr('disabled', false);
            $('#nit').val("");
            $('#codigoSap').val("");
            $('#razonSocial').val("");
         }
      }
   });
   
   $('#documento').autocomplete({
      source: async function (request, response) {
         const data = await getTerceros2(request.term);

         const resultado = data.map(item => ({
            label: `${item.IDENTIFICACION} - ${item.NOMBRE}`,
            value: item.IDENTIFICACION,
            data: item
         }));

         response(resultado);
      },
      minLength: 3,
      select: function (event, ui) {
         $('#nombreTercero').val(ui.item.data.NOMBRE);
         $('#celular').val(ui.item.data.CELULAR);
         $('#correo').val(ui.item.data.EMAIL);
      }
   });

   $(document).on('input', 'input[type="text"], textarea', function () {
      $(this).val($(this).val().toUpperCase());
   });   
});