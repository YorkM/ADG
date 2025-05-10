let ArrayMulticash = new Array();
let ArrayMulticashBanco = new Array();
let ArrCli = new Array();
let ArrDctos = new Array();
let arrayLiquidador = new Array();

// EJECUCIÓN DE FUNCIONALIDADES
$(function () {
  carga_anios('MultiAnio');
  carga_mes('MultiMes');
  carga_dias('MultiDay', $("#MultiMes").val(), $("#MultiAnio").val());

  carga_anios('MultiAnio2');
  carga_mes('MultiMes2');
  carga_dias('MultiDay2', $("#MultiMes2").val(), $("#MultiAnio2").val());

  LoadArrayCli();

  $("#MultiMes,#MultiAnio").change(function () {
    carga_dias('MultiDay', $("#MultiMes").val(), $("#MultiAnio").val());
    ConsultarMulticash();
  });

  $("#MultiMes2, #MultiAnio2").change(function () {
    carga_dias('MultiDay2', $("#MultiMes2").val(), $("#MultiAnio2").val());
    ConsultarMulticashBanco();
  });

  $("#MultiDay").change(function () {
    ConsultarMulticash();
  });

  $("#MultiDay2").change(function () {
    ConsultarMulticashBanco();
  });

  $("#FiltroPlanilla").keyup(function () {
    theTable = $("#tablePlanillas > tbody > tr");
    var value = $(this).val().toLowerCase();
    theTable.filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  $("#filtro").autocomplete({
    source: function (request, response) {
      Array_Cash = ArrayMulticash;
      valor = $.trim($("#filtro").val());
      div_cadena = valor;
      div_cadena = div_cadena.split(" ");

      for (var x = 0; x < div_cadena.length; x++) {
        expr = $.trim(div_cadena[x]);
        Array_Cash = FiltrarArray(expr, Array_Cash, 2);
      }
      response(Array_Cash.slice(0, 40));
    },
    maxResults: 40,
    minLength: 3,
    search: function () { },
    open: function (event, ui) { },
    select: function (event, ui) {
      var sw = 0;
      $("#tdDetalleMulticash tr").each(function (index, element) {
        var id = $(this).find('td').eq(9).html();
        if (ui.item.id == id) {
          sw = 1;
        }
      });
      if (sw == 0) {
        if (ui.item.estado == 0) {
          $("#tdDetalleMulticash").append('<tr onDblClick="AddMulticash(this)">'
            + '<td>' + ui.item.cuenta + '</td>'
            + '<td>' + ui.item.descripcion + '</td>'
            + '<td>' + ui.item.numero + '</td>'
            + '<td>' + formatNum(ui.item.valor, '$') + '</td>'
            + '<td>' + ui.item.texto + '</td>'
            + '<td>' + ui.item.fecha_cont + '</td>'
            + '<td>' + ui.item.fecha_val + '</td>'
            + '<td>' + ui.item.estado + '</td>'
            + '<td>' + ui.item.referencia + '</td>'
            + '<td>' + ui.item.id + '</td>'
            + '</tr>');
        } else {
          Swal.fire('Oops', 'Ya el valor se aplico en el recibo :' + ui.item.id_rc, 'error');
        }
      } else {
        Swal.fire('Oops', 'Valor ya agregado', 'error');
      }


    }
  }).focusout(function () {
    $('#filtro').val('');
  });

  //Carga de archivo PDF
  $("#DocPDF").change(function () {
    uploadAjax();
  })
  var idRol = parseInt($("#RolId").val());
  //Boton de autorizacion 
  if (idRol == 1 || idRol == 26) { //Administrador & contabilidad
    $("#btnAutorizar").show();
    $("#btnCompensaciones").show();
  } else {
    $("#btnAutorizar").hide();
    $("#btnCompensaciones").hide();
  }
  //Cuentas 
  var sociedad = $("#Sociedad").val();
  if (sociedad == 1000) {
    $("#Cuenta").html('<option value="2815050503">2815050503 - AJUSTE AL PESO CM</option>');
  } else {
    $("#Cuenta").html('<option value="2815051601">2815051601 - AJUSTE AL PESO ROMA</option>');
  }
  //Cargue de multicash
  if (idRol == 1 || idRol == 4) { //Tesoreria & administrador
    $("#btnSubirMulticash").attr('disabled', false);
  } else {
    $("#btnSubirMulticash").attr('disabled', true);
  }

  const cssDeshabilatar = {
    "pointer-events": "none",
    "color": "#aaa !important",
    "background-color": "#f5f5f5",
    "cursor": "not-allowed",
    "text-decoration": "none"
  }

  // RESTRICCIÓN DE ACCESO A LA PESTAÑA DE BANCOS 
  if (idRol !== 17 && idRol !== 48 && idRol !== 72 && idRol !== 73 && idRol !== 1) {
    document.getElementById('btnBancos').removeAttribute('data-toggle');
    $('#btnBancos').css(cssDeshabilatar);
  }

  // RESTRICCIÓN DE ACCESO A LA PESTAÑA DE LIQUIDADOR 
  if (idRol !== 17 && idRol !== 48 && idRol !== 72 && idRol && idRol !== 44 && idRol !== 3 && idRol !== 14 && idRol !== 13 && idRol !== 73 && idRol !== 1) {
    document.getElementById('btnLiquidador').removeAttribute('data-toggle');
    $('#btnLiquidador').css(cssDeshabilatar);
  }

  $("#FechaDocumento").datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dateFormat: 'yy-mm-dd',
    width: 100,
    heigth: 100,
    minDate: -5
  }).datepicker("setDate", new Date());

  $("#FechaValor,#RptFhFin,#RptFhIni, #InfoFhIni,#InfoFhFin,#fhCompenIni,#fhCompenFin").datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dateFormat: 'yy-mm-dd',
    width: 100,
    heigth: 100
  }).datepicker("setDate", new Date());

  Limpiar();

  $(document).keyup(function (e) {
    tecla = e.keyCode;
    if (tecla == 115) { //F4 para guardar documento
      Guardar();
    }
  });

  $("#txtValidaDocumento").keyup(function (e) {
    var tecla = e.keyCode;
    var valor = $(this).val();
    if (tecla == 13) { //Enter para consultar
      if (valor != '') {
        ValidarDocumento(valor);
      } else {
        Swal.fire('Error', 'Debe ingresar un número de documento válido.', 'error');
      }

    }
  })


  $('#Cliente').autocomplete({
    source: function (request, response) {
      Arr_cli = ArrCli;
      valor = $.trim($("#Cliente").val());
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
      limpiarDatos();

      $("#CodigoSAP").val(ui.item.codigo_sap);
      $("#Email").val(ui.item.email);
      $("#EmailZona").val(ui.item.email_zona);
      $("#Grupo").val(ui.item.grupo);
      $("#DescGrupo").val(ui.item.desc_grupo);
      $("#Lista").val(ui.item.lista);
      $("#Oficina").val(ui.item.bodega);


      $("#liAbonos").removeClass("disabled disabledTab");
      $("#btnAbonos").attr("data-toggle", "tab");

      $("#liFacturas").removeClass("disabled disabledTab");
      $("#btnFacturas").attr("data-toggle", "tab");

      $("#liMulticash").removeClass("disabled disabledTab");
      if (idRol !== 14) {
        $("#btnMulticash").attr("data-toggle", "tab");
      }
      CondicionesDcto();
      Documentos();
      ConsultarCondicionLista();
    }
  });
  //-------------------------------------------------------------------------------
  $('#txt_CondCliente').autocomplete({
    source: function (request, response) {
      Arr_cli = ArrCli;
      valor = $.trim($("#txt_CondCliente").val());
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
      $("#txt_CondCodigo").val(ui.item.codigo_sap);
    }
  });
  //-------------------------------------------------------------------------------  
  $(".ClassNumero").maskMoney({
    selectAllOnFocus: true, //evento onkeyup 
    prefix: '$',
    thousands: '.',
    decimal: ',',
    precision: 0
  });

  ConsultarPlanilla();
  $("#RptFhFin,#RptFhIni").change(function () {
    ConsultarPlanilla();
  });
  //Nuevo 29-04-2020
  $("#btnSubirMulticash").click(function () {
    $("#tr_det_cash").html('');
    $("#filename").val('');
    $("#dvSubirCash").modal('show');
  })
  //Cargue de plano Multicash
  $("#filename").val('');
  $("#filename").change(function (e) {
    var ext = $("input#filename").val().split(".").pop().toLowerCase();
    if ($.inArray(ext, ["csv"]) == -1) {
      alert('Solo se permiten archivos CSV');
      $("#filename").val('');
      return false;
    }
    if (e.target.files != undefined) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var csvval = e.target.result.split("\n");
        var detalle = '';
        var vtotal = 0;
        for (var i = 0; i < csvval.length; i++) { //for 1		
          var row = csvval[i];
          if (row != '') {
            var col = row.split(',');
            vtotal += parseFloat(col[1]);
            detalle += '<tr>'
              + '<td>' + $.trim(col[0]) + '</td>'
              + '<td>' + $.trim(col[1]) + '</td>'
              + '<td>' + formatNum(parseFloat($.trim(col[2])) * -1, '$') + '</td>'
              + '<td>' + $.trim(col[3]) + '</td>'
              + '<td>' + $.trim(col[4]) + '</td>'
              + '<td>' + $.trim(col[5]) + '</td>'
              + '<td>' + $.trim(col[6]) + '</td>'
              + '</tr>';
          }

        } //fin for
        if (detalle != '') {
          //Importe,Texto,Fecha contabilización,Fecha valor
          var tb = '<table class="form" width="100%" id="tdImportCash">'
            + '<thead>'
            + '<tr>'
            + '<th>Cuenta</th>'
            + '<th>Documento</th>'
            + '<th>Importe</th>'
            + '<th>Texto</th>'
            + '<th>Fecha Conta.</th>'
            + '<th>Fecha Valor.</th>'
            + '<th>Referencia</th>'
            + '</tr>'
            + '</thead>'
            + '<tbody>'
            +

            detalle
            + '</tbody>'
            + '</table>';
          $("#tr_det_cash").html(tb);
        }

      };
      reader.readAsText(e.target.files.item(0));
    }
    return false;
  });
  //------------------------------------------------------------
  $("#btnEmailZona").click(function () {
    ConsultarZonas();
    ListarZonasEmail();
    $("#dvEmailZonas").modal("show");
  });
  //------------------------------------------------------------
  $("#btnCondicionDcto").click(function () {
    if ($("#CodigoSAP").val() != '') {
      $("#dvCondiciones").modal("show");
    } else {
      Swal.fire('Error', 'Debe seleccionar un cliente!.', 'error');
    }
  });
  //----Botones de hipervinculos
  actualizarElementoSegunPermisos("0401", "#0401");
  actualizarElementoSegunPermisos("0102", "#0102");

  $("#0401,#0102").click(function () {
    let id = $(this).attr('id')
    let url = '';
    let title = '';

    switch (id) {
      case '0401':
        url = 'CRM.php';
        title = '0401 - CRM';
        break;
      case '0102':
        url = 'ProgramacionCliente.php';
        title = '0102 - PROGRAMACION DE CLIENTE';
        break;
    }
    $("#ModalHipervinculo").modal("show")
    $("#span-titulo-modulo").text(title);
    $(".iframe").attr('src', url).show();
  });

  $("#btnCompensaciones").click(() => {
    $("#modalCompensaciones").modal('show');
  })

  $("#btnCompensar").click(() => {
    compensarDocumentos();
  })

  $('#btnSeleccionarTodas').click(async function () {
    arrayLiquidador.length = 0;

    if (!$("#tdFacturas tbody tr").length) {
      Swal.fire("Agregar documentos", "No hay documentos para agregar al liquidador", "warning");
      return;
    }

    const result = await confirmAlert("Agregar documentos", "Se agregarán todos los documentos disponibles al liquidador", "info");
    if (!result.isConfirmed) return;

    $("#tdFacturas tbody tr").each(function () {
      let fila = $(this).find('td');
      let item = JSON.parse($(fila.eq(17)).find('button').attr('data-item'));

      agregarLiquidador(item);
    });
  });

  $('#filtro2').keyup(function () {
    const filtro = this.value.toLowerCase();
    filtrar(filtro);
  });
});

// DECLARACIÓN DE FUNCIONES GENERALES
const confirmAlert = async (title, text, icon = 'warning') => {
  const result = await Swal.fire({
    title: `${title}`,
    text: `${text}`,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  });

  return result;
}

const filtrar = (filtro) => {
  const filas = document.querySelectorAll('#tdPlanillas2 tbody tr');

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll('td');
    const coincide = Array.from(celdas).some(td => td.textContent.toLowerCase().includes(filtro));

    fila.style.display = coincide ? '' : 'none';
  });
}

const limpiarDatos = () => {
  ArrDctos.length = 0;
  arrayLiquidador.length = 0;

  $("#VlrTotalAbono").val(formatNum(0, '$'));
  $("#VlrTotalFacturas").val(formatNum(0, '$'));
  $("#VlrSinAsignar").val(formatNum(0, '$'));

  $('#tdPlanillas tbody').html("");

  $('#tablaLiquidador tbody').html("");
  $('#tablaLiquidador2 tbody').html("");
  $('#tablaLiquidador3 tbody').html("");

  $('#totalFacturas').text("$0");
  $('#totalProntoPago').text("$0");
  $('#totalDescuento').text("$0");
  $('#totalPagar').text("$0");

  $('#totalFacturas2').text("$0");
  $('#totalProntoPago2').text("$0");
  $('#totalDescuento2').text("$0");
  $('#totalPagar2').text("$0");

  $('#totalFacturas3').text("$0");
  $('#totalProntoPago3').text("$0");
  $('#totalDescuento3').text("$0");
  $('#totalPagar3').text("$0");
}

// FUNCIÓN AGREGAR DIAS FECHA BASE
function agregarDias(fechaBase, diasAgregar) {
  const [anio, mes, dia] = fechaBase.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);

  fecha.setDate(fecha.getDate() + diasAgregar);

  const nuevoDia = String(fecha.getDate()).padStart(2, '0');
  const nuevoMes = String(fecha.getMonth() + 1).padStart(2, '0');
  const nuevoAnio = fecha.getFullYear();

  return `${nuevoDia}/${nuevoMes}/${nuevoAnio}`;
}

// FUNCIÓN VERIFICAR VIGENCIA FECHA
function verificarVencimientoDescuento(fechaVencimientoFactura) {
  const [d1, m1, y1] = fechaVencimientoFactura.split('/').map(Number);
  const fechaVencimiento = new Date(y1, m1 - 1, d1);

  const hoy = new Date();
  let fechaReferencia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  return fechaVencimiento < fechaReferencia;
}

// FUNCIÓN GENERAR PDF LIQUIDADOR
async function generarPDF(idTabla) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape');

  const organizacion = $('#NumOrg').val();
  const logoImg = (organizacion === "2000")
    ? document.getElementById('logoEmpresa')
    : document.getElementById('logoEmpresa2');
  const empresa = (organizacion === "2000") ? "D.F ROMA" : "CM";

  const canvas = document.createElement('canvas');
  canvas.width = logoImg.naturalWidth;
  canvas.height = logoImg.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(logoImg, 0, 0);
  const logoDataURL = canvas.toDataURL('image/png');

  const pageWidth = doc.internal.pageSize.getWidth();
  const logoWidth = 40;
  const xRight = pageWidth - logoWidth - 10;
  doc.addImage(logoDataURL, 'PNG', xRight, 10, logoWidth, 20);

  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.text('LIQUIDACIÓN FACTURAS', 13, 20);

  const tablaOriginal = document.getElementById(idTabla);
  const tablaClon = tablaOriginal.cloneNode(true);
  ['thead', 'tbody', 'tfoot'].forEach(seccion => {
    const seccionTabla = tablaClon.querySelector(seccion);
    if (seccionTabla) {
      seccionTabla.querySelectorAll('tr').forEach(tr => {
        tr.lastElementChild?.remove();
      });
    }
  });
  tablaClon.style.display = 'none';
  document.body.appendChild(tablaClon);

  doc.autoTable({
    html: tablaClon,
    startY: 35,
    theme: 'grid',
    showHead: 'firstPage',
    showFoot: 'lastPage',
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: 255,
      halign: 'center'
    },
    footStyles: {
      fillColor: [44, 62, 80],
      textColor: 255,
      halign: 'center'
    },
    bodyStyles: {
      fillColor: [245, 245, 245],
      textColor: [33, 37, 41],
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [220, 220, 220]
    },
    styles: {
      fontSize: 9,
      cellPadding: 2
    }
  });

  document.body.removeChild(tablaClon);
  const finalY = doc.lastAutoTable.finalY || 45;

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  const notas = [
    'NOTA: El descuento pronto pago aplica pagando las facturas dentro de la fecha establecida',
    'Las facturas deben ser canceladas en orden consecutivo',
    `RECUERDE: SOLO ESTÁ PERMITIDO CANCELAR A LAS CUENTAS DE ${empresa}`
  ];
  notas.forEach((texto, i) => {
    doc.text(texto, pageWidth / 2, finalY + 7 + (i * 7), { align: 'center' });
  });

  const yCuentas = finalY + 35;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`CUENTAS Y CONVENIOS DE ${empresa}`, 13, yCuentas);

  doc.setFont(undefined, 'normal');

  let cuentasConvenios;

  if (organizacion === "2000") {
    cuentasConvenios = [
      { banco: 'Banco Agrario', cuenta: '13030608080', tipo: 'Corriente', convenio: '13458' },
      { banco: 'Banco de Bogotá', cuenta: '172037855', tipo: 'Corriente', convenio: '' },
      { banco: 'Davivienda', cuenta: '560036469998987', tipo: 'Corriente', convenio: '1012947' },
      { banco: 'BBVA', cuenta: '130612000100040000', tipo: 'Corriente', convenio: '31592' },
      { banco: 'Bancolombia', cuenta: '01090147509', tipo: 'Corriente', convenio: '26835' },
      { banco: 'Bancolombia', cuenta: '10022159448', tipo: 'Ahorros', convenio: '' },
    ];
  } else {
    cuentasConvenios = [
      { banco: 'Banco Agrario', cuenta: '327030001066', tipo: 'Corriente' },
      { banco: 'Banco de Bogotá', cuenta: '438560393', tipo: 'Corriente' },
      { banco: 'BBVA', cuenta: '612018051', tipo: 'Corriente' },
      { banco: 'Bancolombia', cuenta: '67720889532', tipo: 'Corriente' },
    ];
  }

  doc.autoTable({
    startY: yCuentas + 5,
    head: [['Banco', 'Cuenta', 'Tipo', 'Convenio']],
    body: cuentasConvenios.map(c => [c.banco, c.cuenta, c.tipo, c.convenio]),
    theme: 'grid',
    showHead: 'firstPage',
    styles: {
      fontSize: 9,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: 255,
      halign: 'center'
    },
    bodyStyles: {
      fillColor: [245, 245, 245],
      textColor: [33, 37, 41],
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [220, 220, 220]
    }
  });

  doc.save('liquidacion.pdf');
}

// FUNCIÓN PARA REALIZAR LOS CÁLCULOS DE DESCUENTO
const calcularDescuento = (basePP, importe, porcentaje, claseDoc, fechaVencimiento) => {
  if (claseDoc !== "DA") {
    const vencido = verificarVencimientoDescuento(fechaVencimiento);
    if (vencido || ["NC", "ND"].includes(claseDoc)) {
      return { porcentaje: 0, descuento: 0, pagar: importe };
    }

    if (claseDoc === "DZ" && importe > 0) {
      const descuento = Math.round(basePP * (porcentaje / 100));
      const pagar = Math.round(importe - descuento);
      return { porcentaje, descuento, pagar };
    } else {
      return { porcentaje: 0, descuento: 0, pagar: importe };
    }

    const descuento = Math.round(basePP * (porcentaje / 100));
    const pagar = Math.round(importe - descuento);
    return { porcentaje, descuento, pagar };

  } else {
    const descuento = Math.round(importe * (porcentaje / 100));
    const pagar = Math.round(importe - descuento);
    return { porcentaje, descuento, pagar };
  }
};

// CREACIÓN DE LAS TABLAS DEL LIQUIDADOR
function crearTablasPorDias(datos) {
  const agrupadoPorDias = {};

  datos.forEach(item => {
    const dias = item.dias;
    if (!agrupadoPorDias[dias]) {
      agrupadoPorDias[dias] = [];
    }
    agrupadoPorDias[dias].push(item);
  });

  const contenedor = document.querySelector("#contenedorTablasLiquidador");
  contenedor.innerHTML = "";

  let count = 0;

  for (const dias in agrupadoPorDias) {
    const grupo = agrupadoPorDias[dias];

    count++;

    const titulo = document.createElement("h3");
    titulo.classList.add('text-center');
    titulo.textContent = `Liquidación a ${dias} días`;
    contenedor.appendChild(titulo);

    const tabla = document.createElement("table");
    tabla.setAttribute('id', `tabla${count}`);
    tabla.classList.add('table');
    tabla.classList.add('table-liquidador');
    tabla.style.width = "100%";

    const cardContenedor = document.createElement('div');
    cardContenedor.classList.add('custom-card');
    cardContenedor.style.width = '98%';
    cardContenedor.style.margin = '20px auto';

    const btnContenedor = document.createElement('div');
    btnContenedor.classList.add('btn-pdf');
    btnContenedor.style.display = 'flex';
    btnContenedor.style.gap = '10px';
    btnContenedor.style.justifyContent = 'flex-end';

    const btnDescargarPDF = document.createElement('button');
    btnDescargarPDF.textContent = "Descargar PDF";
    btnDescargarPDF.classList.add('btn');
    btnDescargarPDF.classList.add('btn-primary');
    btnDescargarPDF.classList.add('custom-padding');

    const btnExportar = document.createElement('button');
    btnExportar.textContent = "Exportar a Excel";
    btnExportar.classList.add('btn');
    btnExportar.classList.add('btn-success');
    btnExportar.classList.add('custom-padding-two');

    // btnContenedor.appendChild(btnExportar);
    btnContenedor.appendChild(btnDescargarPDF);

    const thead = document.createElement("thead");
    const encabezado = `
      <tr>
        <th>Doc</th>
        <th>Referencia</th>
        <th>Clase</th>
        <th>Fecha</th>
        <th>Fecha Venc.</th>
        <th>V Fact.</th>
        <th>Base PP</th>
        <th>Días</th>
        <th>% Desc.</th>
        <th>V Desc.</th>
        <th>V Pagar</th>
        <th>Observación</th>
        <th>Eliminar</th>
      </tr>`;
    thead.innerHTML = encabezado;
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    grupo.forEach(item => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td class="font-size">${item.numeroDoc}</td>
        <td class="font-size">${item.referencia}</td>
        <td class="font-size">${item.claseDoc}</td>
        <td class="font-size">${item.fechaFactura}</td>
        <td class="font-size">${item.fechaVencimientoFactura}</td>
        <td class="font-size">${formatNum(item.importe, "$")}</td>
        <td class="font-size">${formatNum(item.basePP, "$")}</td>
        <td class="font-size">${item.dias}</td>
        <td class="font-size">${item.porcentajeDescuento}%</td>
        <td class="font-size">${formatNum(item.valorDescuento, "$")}</td>
        <td class="font-size">${formatNum(item.valorPagar, "$")}</td>
        <td class="font-size td-text"><input type="text" maxlength="25" class="form-control input-sm input-obser"></td>
        <td class="text-center">
          <button class="btn btn-danger btn-sm eliminar-liquidacion" data-item='${item.numeroDoc}'>
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>`;
      tbody.appendChild(fila);
    });
    tabla.appendChild(tbody);

    const totalBasePP = grupo.reduce((sum, item) => sum + item.basePP, 0);
    const totalImporte = grupo.reduce((sum, item) => sum + item.importe, 0);
    const totalDescuento = grupo.reduce((sum, item) => sum + item.valorDescuento, 0);
    const totalPagar = grupo.reduce((sum, item) => sum + item.valorPagar, 0);

    const tfoot = document.createElement("tfoot");
    const totales = `
      <tr>
        <td colspan="5" class="font-size-tf" style="text-align: center;">Totales</td>
        <td class="font-size-tf">${formatNum(totalImporte, "$")}</td>
        <td class="font-size-tf">${formatNum(totalBasePP, "$")}</td>
        <td class="font-size-tf"></td>
        <td class="font-size-tf"></td>
        <td class="font-size-tf">${formatNum(totalDescuento, "$")}</td>
        <td class="font-size-tf">${formatNum(totalPagar, "$")}</td>
        <td class="font-size-tf"></td>
        <td class="font-size-tf"></td>
      </tr>`;

    tfoot.innerHTML = totales;
    tabla.appendChild(tfoot);
    cardContenedor.appendChild(tabla);
    cardContenedor.appendChild(btnContenedor);
    contenedor.appendChild(cardContenedor);

    $('.table-liquidador tbody').on('blur', '.input-obser', function () {
      const valor = $(this).val();
      const td = $(this).closest('td');
      td.text(valor);
    });

    $('.table-liquidador').off().on('click', '.eliminar-liquidacion', async function () {
      const result = await confirmAlert("Eliminar item", "¿Está seguro(a) de eliminar el item del liquidador?");
      if (!result.isConfirmed) return;

      const numeroDoc = $(this).attr('data-item');
      arrayLiquidador = arrayLiquidador.filter(item => item.numeroDoc !== numeroDoc);
      crearTablasPorDias(arrayLiquidador);
    });

    $('.btn-pdf').off().on('click', '.custom-padding', function (e) {
      const idTabla = $(this).closest('.custom-card').find('table').attr('id');
      generarPDF(idTabla);
    });

    // $('.btn-pdf').off().on('click', '.custom-padding-two', function (e) {
    //   const idTabla = $(this).closest('.custom-card').find('table').attr('id');
    //   console.log("Id tabla a Exportar:", idTabla);
    //   generarPDF(idTabla);
    // });
  }
}

// FUNCIÓN AGREGAR ITEM AL LIQUIDADOR
const agregarLiquidador = (item) => {
  const { BASE_PP, CLASE_DOCUMENTO, FECHA_BASE, IMPORTE, NUMERO_DOCUMENTO, REFERENCIA, REFERENCIA_FACTURA } = item;

  const basePP = parseFloat(BASE_PP);
  const importe = parseFloat(IMPORTE);
  const claseDoc = CLASE_DOCUMENTO.trim();
  const FB = FECHA_BASE.split("-");
  const fechaFactura = `${FB[2]}/${FB[1]}/${FB[0]}`;

  ArrDctos.forEach(item => {
    let dias = 0;
    if (parseInt(item.dias) > 60 && parseInt(item.dias) <= 65) dias = 60;
    else if (parseInt(item.dias) > 45 && parseInt(item.dias) <= 50) dias = 45;
    else if (parseInt(item.dias) > 30 && parseInt(item.dias) <= 35) dias = 30;
    else dias = parseInt(item.dias);

    const fechaVencimientoFactura = agregarDias(FECHA_BASE, dias);
    const { porcentaje, descuento, pagar } = calcularDescuento(basePP, importe, parseFloat(item.descuento), claseDoc, fechaVencimientoFactura);

    arrayLiquidador.push({
      numeroDoc: NUMERO_DOCUMENTO.trim(),
      referencia: REFERENCIA.trim(),
      referenciaFactura: REFERENCIA_FACTURA.trim(),
      claseDoc,
      dias,
      fechaFactura,
      fechaVencimientoFactura,
      basePP,
      importe,
      porcentajeDescuento: porcentaje,
      valorDescuento: descuento,
      valorPagar: pagar
    });
  });

  crearTablasPorDias(arrayLiquidador);
}

//-------Permisos de accesos directos
function obtenerPermisos(modulo) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "../models/Notas.php",
      dataType: "json",
      data: {
        op: "S_PERMISOS",
        rol: $("#RolId").val(),
        modulo: modulo,
      },
      success: function (data) {
        if (Array.isArray(data) && data.some((d) => d.chck === 'S')) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error en la solicitud AJAX:", errorThrown);
        reject(errorThrown);
      },
    });
  });
}

function actualizarElementoSegunPermisos(modulo, elementoId) {
  obtenerPermisos(modulo).then((tienePermisos) => {
    const $elemento = $(elementoId);
    if (tienePermisos) {
      $elemento.show();
    } else {
      $elemento.hide();
    }
  });
}
//-------Permisos de accesos directos


//---nuevo array de clientes
function FiltrarCli(expr, ArrayCli, op) {
  expresion = new RegExp(expr, "i"); //
  switch (parseInt(op)) {
    //por codigo
    case 1:
      filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.codigo_sap)); //
      if (filtro.length == 0) {
        filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.nit));
      }
      if (filtro.length == 0) {
        filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.telefonos));
      }
      break;
    //por descripcion 
    case 2:
      filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.nombres));
      if (filtro.length == 0) {
        filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.razon_comercial));
      }
      break;
  }
  return filtro;
}

function ValidarDocumento(valor) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/RecibosCaja.php",
    dataType: "json",
    async: true,
    beforeSend: function () {
      LoadImg('CONSULTANDO INFORMACIÓN...');
    },
    data: {
      op: "B_DOCUMENTO_RC",
      documento: valor
    },
    success: function (data) {
      if (data.length > 0) {
        Swal.fire('Oops', 'El documento esta comprometido en el recibo #' + data[0].ID_RC + ', tomado por el usuario ' + data[0].USUARIO, 'error');
      } else {
        Swal.fire('Excelente!', 'El documento se encuentra disponible', 'info');
      }

    }
  }).done(function () {
    UnloadImg();
  }).fail(function (data) {
    console.error(data);
  });
}

function LoadArrayCli() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/RecibosCaja.php",
    dataType: "json",
    async: true,
    beforeSend: function () {
      LoadImg('CARGANDO CLIENTES...');
    },
    data: {
      op: "B_CLIENTE_RC"
    },
    success: function (data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          d = data[i];
          det = {
            'value': d.nombres + '|' + d.razon_comercial,
            'nombres': d.nombres,
            'razon_comercial': d.razon_comercial,
            'codigo_sap': $.trim(d.codigo_sap),
            'nit': $.trim(d.nit),
            'email': d.email,
            'telefonos': d.telefonos,
            'cupo_credito': d.cupo_credito,
            'direccion': d.direccion,
            'ciudad': d.ciudad,
            'bodega': d.bodega,
            'bodega_desc': d.bodega_desc,
            'lista': d.lista,
            'condicion_pago': d.condicion_pago,
            'vendedor': d.vendedor,
            'televendedor': d.televendedor,
            'institucional': d.institucional,
            'email_zona': d.email_zona,
            'grupo': d.grupo,
            'desc_grupo': d.desc_grupo,
            'zona_ventas': d.zona_ventas,
            'zona_descripcion': d.zona_descripcion
          } //det
          ArrCli.push(det);
        } //for   for(var i=0;i<data.length;i++){				

      } //				
    }
  }).done(function () {
    UnloadImg();
  }).fail(function (data) {
    console.error(data);
  });
}

function CondicionesDcto() {
  $.ajax({
    type: "POST",
    url: "../models/RecibosCaja.php",
    async: false,
    dataType: "json",
    beforeSend: function () {

    },
    data: {
      op: "S_COND_DCTO",
      codigo: $("#CodigoSAP").val(),
      sociedad: $("#Sociedad").val()
    },
    success: function (data) {
      var tabla = '<table class="form" width="100%" id="tableCondicionesDcto">'
        + '<thead>'
        + '<tr>'
        + '<th>CODIGO</th>'
        + '<th>SOCIEDAD</th>'
        + '<th>DIAS</th>'
        + '<th>DESCUENTO</th>'
        + '<th>TIPO</th>'
        + '<th>SUJETO CUMPLIMIENTO</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>';
      for (var i = 0; i <= data.length - 1; i++) {
        tabla += '<tr>'
          + '<td>' + data[i].codigo_sap + '</td>'
          + '<td>' + data[i].sociedad + '</td>'
          + '<td>' + data[i].dias + '</td>'
          + '<td>' + data[i].descuento + '</td>'
          + '<td>' + data[i].tipo + '</td>'
          + '<td>' + data[i].sujeto_cump + '</td>'
          + '</tr>';
        ArrDctos.push({
          dias: data[i].dias,
          descuento: data[i].descuento,
          tipo: data[i].tipo
        })
      }
      tabla += '</tbody></table>';

      $("#dvCondicionesDetalle").html(tabla);

    }
  }).fail(function (data) {
    console.error(data);
  });
}

function ListarZonasEmail() {
  $.ajax({
    type: "POST",
    url: "../models/RecibosCaja.php",
    async: false,
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) { },
    beforeSend: function () { },
    data: {
      op: "S_ZONAS_EMAIL"
    },
    success: function (data) {
      //console.log(data);
      var tabla = '<table class="form" width="100%" id="tableZonaEmail">'
        + '<thead>'
        + '<tr>'
        + '<th>ZONA</th>'
        + '<th>DESCRIPCION</th>'
        + '<th>EMAIL</th>'
        + '<th>ELIMINAR</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>';
      for (var i = 0; i <= data.length - 1; i++) {
        tabla += '<tr>'
          + '<td>' + data[i].ZONA_VENTAS + '</td>'
          + '<td>' + data[i].ZONA_DESCRIPCION + '</td>'
          + '<td>' + data[i].EMAIL + '</td>'
          + '<td>'
          + '<button class="btn btn-default" onclick="DelZonaEmail(\'' + data[i].ZONA_VENTAS + '\')">'
          + '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>'
          + '</button>'
          + '</td>'
          + '</tr>';
      }
      tabla += '</tbody></table>';

      $("#dvResultZonasEmail").html(tabla);
    }
  }).fail(function (data) {
    console.error(data);
  });
}

function ConsultarZonas() {
  $.ajax({
    type: "POST",
    url: "../models/PW-SAP.php",
    async: false,
    dataType: "json",
    beforeSend: function () { },
    data: {
      op: "S_ZONAS_VENTA",
      sw: 1
    },
    success: function (data) {
      var zonas = '';
      for (var i = 0; i < data.length; i++) {
        zonas += '<option value="' + data[i].zona + '">' + data[i].zona + ' - ' + data[i].descripcion + '</option>';
      } //for	
      $("#slcZonaEmail").html(zonas);
    }
  }).fail(function (data) {
    console.error(data);
  });
}

function DelZonaEmail(zona) {
  Swal.fire({
    title: 'Eliminar email de zona',
    text: "realmente desea eliminar la zona : " + zona + "'?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#82ED81",
    cancelButtonColor: "#FFA3A4",
    confirmButtonText: "SI",
    cancelButtonText: "NO",
    closeOnConfirm: false,
    closeOnCancel: false
  }).then((result) => {
    if (result.value) {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/RecibosCaja.php",
        async: false,
        dataType: "html",
        error: function (OBJ, ERROR, JQERROR) { },
        beforeSend: function () { },
        data: {
          op: "D_ZONA_EMAIL",
          zona: zona
        },
        success: function (data) { //console.log(data);
          Swal.fire('Excelente', 'Zona eliminada con éxito', 'success');
          ListarZonasEmail();
        }
      }).fail(function (data) {
        console.error(data);
      });
    }
  });
}

function AddZonaEmail() {
  var email = $("#txtZonaEmail").val();
  var zona = $("#slcZonaEmail").val();
  var sw = 0;
  if (email != '') {
    $("#tableZonaEmail tr:gt(0)").each(function (index, element) {
      var tdzona = $.trim($(this).find('td').eq(0).html());
      if (zona == tdzona) {
        sw = 1;
      }
    });
    if (sw == 1) {
      Swal.fire({
        title: 'Actualización de zona',
        text: "Esta zona ya tiene un correo asociado, desea actualizarlo?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#82ED81",
        cancelButtonColor: "#FFA3A4",
        confirmButtonText: "SI",
        cancelButtonText: "NO",
        closeOnConfirm: false,
        closeOnCancel: false
      }).then((result) => {
        if (result.value) {
          ////actualizacion
          $.ajax({
            type: "POST",
            encoding: "UTF-8",
            url: "../models/RecibosCaja.php",
            async: false,
            dataType: "html",
            error: function (OBJ, ERROR, JQERROR) { },
            beforeSend: function () { },
            data: {
              op: "U_ZONA_EMAIL",
              email: email,
              zona: zona
            },
            success: function (data) {
              Swal.fire('Excelente', 'Zona actualizada con éxito', 'success');
              ListarZonasEmail();
            }
          }).fail(function (data) {
            console.error(data);
          });
        }
      });
    } else {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/RecibosCaja.php",
        async: false,
        dataType: "html",
        error: function (OBJ, ERROR, JQERROR) { },
        beforeSend: function () { },
        data: {
          op: "I_ZONA_EMAIL",
          email: email,
          zona: zona
        },
        success: function (data) {
          Swal.fire('Excelente', 'Zona actualizada con éxito', 'success');
          ListarZonasEmail();
        }
      }).fail(function (data) {
        console.error(data);
      });
    }
  } else {
    Swal.fire('Error', 'Debe ingresar un mail válido', 'error');
  }
}

function SubirCash() {
  $("#tdImportCash tr:gt(0)").each(function (index, element) {
    var Cuenta = $.trim($(this).find('td').eq(0).html());
    var Numero = $.trim($(this).find('td').eq(1).html());
    var Importe = unformatNum($.trim($(this).find('td').eq(2).html()));
    var Texto = $.trim($(this).find('td').eq(3).html());
    var FechaC = $.trim($(this).find('td').eq(4).html());
    var FechaV = $.trim($(this).find('td').eq(5).html());
    var Ref = $.trim($(this).find('td').eq(6).html());
    //alert(Importe+' # '+Texto+' # '+FechaC+' # '+FechaV);
    $.ajax({
      type: "POST",
      url: "../models/RecibosCaja.php",
      global: false,
      beforeSend: function () {
        LoadImg('SUBIENDO MULTICASH...');
      },
      data: {
        op: 'G_MULTICASH',
        Cuenta: Cuenta,
        Numero: Numero,
        Importe: Importe,
        Texto: Texto,
        FechaC: FechaC,
        FechaV: FechaV,
        Ref: Ref
      },
      dataType: "html",
      async: false,
      success: function (data) {
        if (data == 0) {
          Swal.fire('Carga Completa', 'La informacion ha sido subida.', 'success');
        } else {
          Swal.fire('Oops', 'Error al subir datos por favor verificar.', 'error');
        }
        $("#tr_det_cash").html('');
        $("#filename").val('');
        $("#dvSubirCash").modal('hide');
      }
    }).always(function (data) {
      //console.log(data);
      UnloadImg();
    })
      .fail(function (data) {
        console.error(data)
      });
  });
}

function ConsultarMulticash() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/RecibosCaja.php",
    global: false,
    beforeSend: function () {
      LoadImg('CONSULTANDO MULTICASH...');
    },
    data: {
      op: 'S_MULTICASH',
      Estado: 0,
      mes: $("#MultiMes").val(),
      anio: $("#MultiAnio").val(),
      dia: $("#MultiDay").val()
    },
    dataType: "json",
    async: true,
    success: function (data) {
      var det = '';
      if (data.length > 0) {
        ArrayMulticash = [];
        for (var i = 0; i < data.length; i++) {
          d = data[i];
          det = {
            'value': 'CUENTA :' + d.CUENTA + ' | ' + $.trim(d.DESCRIPCION) + ' | REF : ' + d.REFERENCIA + ' | VALOR :' + formatNum(d.VALOR, '$') + ' | FECHA : ' + d.FECHA_VALOR,
            'cuenta': d.CUENTA,
            'descripcion': $.trim(d.DESCRIPCION),
            'numero': d.NUMERO,
            'valor': d.VALOR,
            'texto': d.TEXTO,
            'fecha_cont': d.FECHA_CONTABILIZACION,
            'fecha_val': d.FECHA_VALOR,
            'estado': d.ESTADO,
            'referencia': d.REFERENCIA,
            'id': d.ID,
            'id_rc': d.ID_RC,
            'item_busqueda': d.CUENTA + '' + $.trim(d.DESCRIPCION) + '' + d.NUMERO + ' ' + d.VALOR + '' + d.TEXTO + ' ' + d.FECHA_CONTABILIZACION + '' + d.FECHA_VALOR + ' ' + d.ESTADO + '' + d.REFERENCIA
          } //det={
          ArrayMulticash.push(det);
        } //for
      }
    }
  }).always(function (data) {
    //console.log(data);
    UnloadImg();
  })
    .fail(function (data) {
      console.error(data)
    });
}

// FUNCIÓN CONSULTAR MULTICASH BANCO
function ConsultarMulticashBanco() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/RecibosCaja.php",
    global: false,
    beforeSend: function () {
      LoadImg('CONSULTANDO MULTICASH...');
    },
    data: {
      op: 'S_MULTICASH',
      Estado: 0,
      mes: $("#MultiMes2").val(),
      anio: $("#MultiAnio2").val(),
      dia: $("#MultiDay2").val()
    },
    dataType: "json",
    async: true,
    success: function (data) {
      var det = '';
      ArrayMulticashBanco = [];
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          d = data[i];
          det = {
            'value': `CUENTA : ${d.CUENTA} | ${$.trim(d.DESCRIPCION)} | REF : ${d.REFERENCIA} | VALOR : ${formatNum(d.VALOR, '$')} | FECHA : ${d.FECHA_VALOR}`,
            'cuenta': d.CUENTA,
            'descripcion': $.trim(d.DESCRIPCION),
            'numero': d.NUMERO,
            'valor': d.VALOR,
            'texto': d.TEXTO,
            'fecha_cont': d.FECHA_CONTABILIZACION,
            'fecha_val': d.FECHA_VALOR,
            'estado': d.ESTADO,
            'referencia': d.REFERENCIA,
            'id': d.ID,
            'id_rc': d.ID_RC,
            'item_busqueda': d.CUENTA + '' + $.trim(d.DESCRIPCION) + '' + d.NUMERO + ' ' + d.VALOR + '' + d.TEXTO + ' ' + d.FECHA_CONTABILIZACION + '' + d.FECHA_VALOR + ' ' + d.ESTADO + '' + d.REFERENCIA
          } //det={
          ArrayMulticashBanco.push(det);
        } //for
      }

      const resultado = ArrayMulticashBanco.map(mc => {
        const cliente = ArrCli.find(c => c.nit.trim() === mc.referencia.trim());
        if (cliente && mc.id_rc === "0") {
          return { ...cliente, ...mc };
        }
        return null;
      }).filter(item => item !== null);

      $('#tdPlanillas2 tbody').html(``);
      let elementos = ``;

      if (resultado.length) {
        resultado.forEach((item, index) => {
          elementos += `
            <tr>
              <td>${index + 1}</td>
              <td>${item.cuenta}</td>
              <td>${item.descripcion}</td>
              <td>${item.numero}</td>
              <td>${formatNum(item.valor, "$")}</td>
              <td>${item.fecha_cont}</td>
              <td>${item.referencia}</td>
              <td>${item.codigo_sap}</td>
              <td>
                <p>${item.nombres}</p>
                <small class="text-primary">${item.razon_comercial}</small>
              </td>
              <td>${item.bodega_desc.split(' ')[1]}</td>
              <td>${item.zona_ventas}</td>
              <td>${item.zona_descripcion}</td>
              <td>${item.condicion_pago}</td>
              <td class="text-center">
                <button class="btn btn-primary btn-sm observacion" data-id='${JSON.stringify(item)}'>
                  <i class="fa-solid fa-paper-plane"></i>                                                                     
                </button>
              </td>
            </tr>`;
        });

        $('#tdPlanillas2 tbody').html(elementos);

        $('#tdPlanillas2').on('click', '.observacion', function () {
          limpiarDatos();
          const { codigo_sap, referencia } = JSON.parse($(this).attr('data-id'));
          const MultiDay = $('#MultiDay2').val();

          $('#btnCliente').click();
          const valorBuscado = codigo_sap;
          const coincidencia = ArrCli.find(item => item.codigo_sap === valorBuscado);

          if (coincidencia) {
            $('#Cliente')
              .val(coincidencia.nombres)
              .data('ui-autocomplete')._trigger('select', null, { item: coincidencia });

            setTimeout(() => {
              $('#btnMulticash').click();
              const valorBuscado = referencia.trim();
              const coincidencia = ArrayMulticashBanco.find(item => item.referencia.trim() === valorBuscado);
              if (coincidencia) {
                $('#filtro')
                  .val(coincidencia.item_busqueda)
                  .data('ui-autocomplete')._trigger('select', null, { item: coincidencia });

                $('#MultiDay').val(MultiDay).trigger('change');
              }
            }, 2000);
          }
        });
      } else $('#tdPlanillas2 tbody').html(`<td class="text-center lead fw-bold" colspan="14">Multicash no disponible</td>`);
    }
  }).always(function (data) {
    //console.log(data);
    UnloadImg();
  })
    .fail(function (data) {
      console.error(data)
    });
}

function FiltrarArray(expr, ArrayMulticash, op) {
  expresion = new RegExp(expr, "i");
  filtro = ArrayMulticash.filter(ArrayMulticash => expresion.test(ArrayMulticash.item_busqueda));
  return filtro;
}

function validarSiNumero(numero) {
  x = 0;
  if (/^([0-9])*$/.test(numero)) {
    x = 1;
  }
  return x;
}

function AddMulticash(ob) {
  var obj = $(ob);
  var estado = $.trim(obj.find('td').eq(7).html());
  var cuenta = $.trim(obj.find('td').eq(0).html());
  var num = $.trim(obj.find('td').eq(2).html());
  var valor = $.trim(obj.find('td').eq(3).html());
  var fvalor = $.trim(obj.find('td').eq(6).html());
  var id = $.trim(obj.find('td').eq(9).html());
  var ref = $.trim(obj.find('td').eq(8).html());

  if (estado == 0) {
    //console.log('Cuenta : '+cuenta+' Valor:'+valor+' Fecha:'+fvalor);
    AddAbonoCash(cuenta, fvalor, valor, num, id, ref);
    obj.css('background', '#51F563');
    obj.find('td').eq(7).html(1);
  } else {
    var total = unformatNum($("#VlrTotalAbono").val());
    var valor = unformatNum(valor);
    $("#VlrTotalAbono").val(formatNum(parseFloat(total - parseFloat(valor)), '$'));
    var vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val())) - parseFloat(unformatNum($("#VlrTotalFacturas").val()));
    $("#VlrSinAsignar").val(formatNum(vasignado, '$'));
    obj.css('background', '#fafafa');
    obj.find('td').eq(7).html(0);
    $("#tdBody tr").each(function (index, element) {
      if ($.trim($(this).attr('id')) == id) {
        $(this).remove();
      }
    });
  }
  /*
  $("#VlrTotalAbono").val(formatNum(parseFloat(unformatNum(valor))+parseFloat(unformatNum(total)),'$'));
  var vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val()))-parseFloat(unformatNum($("#VlrTotalFacturas").val()));
  $("#VlrSinAsignar").val(formatNum(vasignado,'$'));*/
}

function printDiv(nombreDiv) {
  var contenido = document.getElementById(nombreDiv).innerHTML;
  var contenidoOriginal = document.body.innerHTML;
  document.body.innerHTML = contenido;
  window.print();
  document.body.innerHTML = contenidoOriginal;
}

function LoadImg(texto) {
  html = '<center>'
    + '<figure><img src="../resources/icons/preloader.gif" class="img-responsive"/></figure>'
    + '<figcaption>' + texto + '</figcaption>'
    + '</center>';
  $(".centrado-porcentual").html(html);
  $(".form-control").attr("disabled", true);
  $(".centrado-porcentual").show();
  $("#Bloquear").show();
}

function UnloadImg() {
  $("#Bloquear").hide();
  $(".centrado-porcentual").hide();
  $(".form-control").attr("disabled", false);
}

function activaTab(tab) {
  $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};

function Enter(ob, tipo) {
  tecla = (document.all) ? ob.keyCode : ob.which;
  if (tecla == 13) {
    switch (tipo) {
      case 'AddAbono':
        {
          AddAbono();
        }
        break;
    }
  }
}

function Limpiar() {
  var rol = $("#RolId").val();

  limpiarDatos();

  $("#CodigoSAP").val('');
  $("#Cliente").val('');
  $("#Referencia").val('');
  $("#TextoCabecera").val('');
  $("#TextoCompensacion").val('');
  $("#ValorAbono").val('');
  $("#Email").val('');
  $("#EmailZona").val('');
  $("#VlrTotalAbono").val(formatNum(0, '$'));
  $("#VlrTotalFacturas").val(formatNum(0, '$'));
  $("#VlrSinAsignar").val(formatNum(0, '$'));
  $("#tdBody").html('');
  $("#liAbonos").addClass('disabled disabledTab');
  $("#liFacturas").addClass('disabled disabledTab');
  $("#liMulticash").addClass('disabled disabledTab');
  $("#btnMulticash").attr("data-toggle", "");
  $("#btnAbonos").attr("data-toggle", "");
  $("#btnFacturas").attr("data-toggle", "");
  $("#tdDetalleMulticash").html('');

  $("#Grupo").val('');
  $("#DescGrupo").val('');
  $("#Lista").val('');
  $("#Oficina").val('');
  //Nuevo para vendedores 14
  if (rol == 14) {
    $("#dvTotalAbono").hide();
    activaTab('dvPlanilla');
    // $("#liCliente").addClass('disabled disabledTab');
    // $("#btnCliente").attr("data-toggle", "");
    $("#btnEliminarRC").hide();
    $("#btnEliminarPDF").hide();
  } else {
    activaTab('dvClientes');
    $("#Cliente").focus();
    $("#btnEliminarRC").show();
    $("#btnEliminarPDF").show();
  }
}

function AddAbonoCash(pcuenta, pfecha, pvalor, num, id, ref) {
  var cuenta = pcuenta;
  var valor = pvalor;
  var desc = '';
  var fecha = pfecha;
  var total = $("#VlrTotalAbono").val();
  var sw = 0;

  switch (cuenta) {
    case '1105050100':
      {
        desc = 'CAJA VIAJERO';
      }
      break
    case '1105050108':
      {
        desc = 'CAJA EFECTIVO';
      }
      break
    case '1105050103':
      {
        desc = 'CHEQUES';
      }
      break
    case '1110050101':
      {
        desc = 'BANCOLOMBIA';
      }
      break
    case '1110050501':
      {
        desc = 'BANCO BOGOTA';
      }
      break
    case '1110050501':
      {
        desc = 'BANCO AGRARIO';
      }
      break
    case '1110050501':
      {
        desc = 'BANCO BBVA';
      }
      break
    case '2815050503':
      {
        desc = 'AJUSTE AL PESO';
      }
      break
    case '1355180501':
      {
        desc = 'IMPUESTO DE INDUSTRIA Y COMERCIO RETENIDO';
      }
      break
    case '5305350501':
      {
        desc = 'DESCUENTOS COMERCIALES';
      }
      break
    case '1110050201':
      {
        desc = 'BANCOLOMBIA CORRIENTE';
      }
      break
  }
  if (cuenta == '2815050503' && parseFloat(unformatNum(valor)) > 1000) {
    sw = 2;
  }
  if (parseFloat(unformatNum(valor)) > 0) {
    $("#tdBody tr").each(function (index, element) {
      var c = $(this).find('td').eq(0).html();
      if ((c == '1105050108' || c == '1105050100') && (cuenta == '1105050108' || cuenta == '1105050100')) {
        sw = 1;
      }
      if (c == '2815050503' && cuenta == '2815050503') {
        sw = 1;
      }

    });
    if (sw == 0) {
      $("#tdBody").append('<tr id="' + id + '">'
        + '<td>' + cuenta + '</td>'
        + '<td>' + desc + '</td>'
        + '<td>' + valor + '</td>'
        + '<td>' + fecha + '</td>'
        + '<td>' + ref + '</td>'
        + '<td width="5%" align="center" onclick="QuitarAbonoCash(this)">'
        + '<button type="button" class="btn btn-default" aria-label="Left Align">'
        + '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>'
        + '</button>'
        + '</td>'
        + '<td style="display:none">$0</td>'
        + '<td style="display:none">$0</td>'
        + '</tr>');
      $("#VlrTotalAbono").val(formatNum(parseFloat(unformatNum(valor)) + parseFloat(unformatNum(total)), '$'));
      $("#ValorAbono").val('');
      $("#ValorAbono").focus();
      var vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val())) - parseFloat(unformatNum($("#VlrTotalFacturas").val()));
      $("#VlrSinAsignar").val(formatNum(vasignado, '$'));
    } else {
      if (sw == 1) {
        Swal.fire('Operacion no permitida!', 'Ya se encuentra asignada la cuenta efectivo,viajero o ajuste al peso', 'error');
      } else {
        Swal.fire('Operacion no permitida!', 'El valor de ajuste al peso no puede superar los $1.000', 'error');
      }
      $("#ValorAbono").val('');
      $("#ValorAbono").focus();
    }
  }

}

function AddAbono() {
  var cuenta = $("#Cuenta").val();
  var valor = $("#ValorAbono").val();
  var desc = $("#Cuenta option:selected").text();
  var fecha = $("#FechaValor").val();
  var total = $("#VlrTotalAbono").val();
  var sw = 0;
  var tipov = $("#TipoValor").val();

  if (cuenta == '2815050503' && parseFloat(unformatNum(valor)) > 1000) sw = 2;

  if (parseFloat(unformatNum(valor)) > 0) {
    $("#tdBody tr").each(function (index, element) {
      var c = $(this).find('td').eq(0).html();

      if ((c == '1105050108' || c == '1105050100') && (cuenta == '1105050108' || cuenta == '1105050100')) {
        sw = 1;
      }

      if (c == '2815050503' && cuenta == '2815050503') {
        sw = 1;
      }

    });

    if (sw == 0) {

      if (tipov == 'N') {
        valor = formatNum((parseFloat(unformatNum(valor)) * (-1)), '$')
      }
      // console.log(valor+' - '+tipov)
      $("#tdBody").append('<tr>'
        + '<td>' + cuenta + '</td>'
        + '<td>' + desc + '</td>'
        + '<td>' + valor + '</td>'
        + '<td>' + fecha + '</td>'
        + '<td>' + cuenta + '</td>'
        + '<td width="5%" align="center" onclick="QuitarAbono(this)">'
        + '<button type="button" class="btn btn-default" aria-label="Left Align">'
        + '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>'
        + '</button>'
        + '</td>'
        + '<td style="display:none">$0</td>'
        + '<td style="display:none">$0</td>'
        + '</tr>');

      $("#VlrTotalAbono").val(formatNum(parseFloat(unformatNum(valor)) + parseFloat(unformatNum(total)), '$'));
      $("#ValorAbono").val('');
      $("#ValorAbono").focus();
      var vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val())) - parseFloat(unformatNum($("#VlrTotalFacturas").val()));
      $("#VlrSinAsignar").val(formatNum(vasignado, '$'));
    } else {
      if (sw == 1) {
        Swal.fire('Operacion no permitida!', 'Ya se encuentra asignada la cuenta efectivo,viajero o ajuste al peso', 'error');
      } else {
        Swal.fire('Operacion no permitida!', 'El valor de ajuste al peso no puede superar los $1.000', 'error');
      }
      $("#ValorAbono").val('');
      $("#ValorAbono").focus();
    }
  }

}

function QuitarAbonoCash(ob) {
  var total = unformatNum($("#VlrTotalAbono").val());
  var valor = unformatNum($(ob).parent().find('td').eq(2).html());
  var id = $(ob).parent().attr('id');
  //Lo quita de la tabla de abonos
  $("#VlrTotalAbono").val(formatNum(parseFloat(total - parseFloat(valor)), '$'));
  var vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val())) - parseFloat(unformatNum($("#VlrTotalFacturas").val()));
  $("#VlrSinAsignar").val(formatNum(vasignado, '$'));
  $(ob).parent().remove();
  //Lo desmarca del multicash
  $("#tdPlanillas tr").each(function (index, element) {
    //console.log($.trim($(this).find('td').eq(9).html()) +'=='+ id);		
    if ($.trim($(this).find('td').eq(9).html()) == id) {
      $(this).css('background', '#fafafa');
      $(this).find('td').eq(7).html(0);
    }
  });
}

function QuitarAbono(ob) {
  var total = unformatNum($("#VlrTotalAbono").val());
  var valor = unformatNum($(ob).parent().find('td').eq(2).html());
  $("#VlrTotalAbono").val(formatNum(parseFloat(total - parseFloat(valor)), '$'));
  var vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val())) - parseFloat(unformatNum($("#VlrTotalFacturas").val()));
  $("#VlrSinAsignar").val(formatNum(vasignado, '$'));
  $(ob).parent().remove();
}


function NofificacionDescuento(pcjDesc) {
  $.notify({ // options
    icon: 'glyphicon glyphicon-warning-sign',
    title: '<strong>DESCUENTOS</strong></br>',
    message: 'Descuento de este documento ' + pcjDesc + '%'
  }, { // settings	
    delay: 7000,
    type: 'success',
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    },
  });
}

function AddFactura(ob, valor, cumple_pres) {

  //   / console.log(valor+' '+cumple_pres);

  var NumDoc = $.trim($(ob).parent().parent().find('td').eq(0).html());
  var total = unformatNum($("#VlrTotalFacturas").val());
  var tipoDoc = $.trim($(ob).parent().parent().find('td').eq(2).html());
  var fechaCrea = $.trim($(ob).parent().parent().find('td').eq(4).html());
  var fechaDoc = $.trim($(ob).parent().parent().find('td').eq(5).html());
  var vlrDoc = unformatNum($(ob).parent().parent().find('td').eq(9).html());
  var numAbonos = 0;
  var vlrAbonos = 0;
  var fechaAbono = '';
  var recibeDescuento = 0;
  var vtotalFact = parseFloat(unformatNum($("#VlrTotalFacturas").val())) + parseFloat(unformatNum(valor));


  $("#tdBody tr").each(function (index, element) {
    numAbonos++;
    vlrAbonos = vlrAbonos + parseFloat(unformatNum($.trim($(this).find('td').eq(2).html())));
    var fecha = $.trim($(this).find('td').eq(3).html());

    //console.log({fecha});
    fecha = fecha.split("-");
    //console.log({fecha});
    fecha = new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]));
    //console.log({fecha});

    if (fechaAbono == '') {
      fechaAbono = fecha;
    } else {
      if (fecha > fechaAbono) {
        fechaAbono = fecha;
      }
    }
  });
  if (numAbonos > 0) {
    /*nuevo codigo para condiciones de descuentos especiales*/
    fechaDoc = fechaDoc.split("-");
    fechaDoc = new Date(parseInt(fechaDoc[0]), parseInt(fechaDoc[1] - 1), parseInt(fechaDoc[2]));

    fechaCrea = fechaCrea.split("-");
    fechaCrea = new Date(parseInt(fechaCrea[0]), parseInt(fechaCrea[1] - 1), parseInt(fechaCrea[2]));


    //console.warn(fechaAbono+' - '+fechaCrea)

    dias = fechaAbono.getTime() - fechaCrea.getTime();
    dias = (dias / (1000 * 60 * 60 * 24));

    //console.warn(dias);
    var pcjDesc = 0;
    /* PARAMETROS DE CONDICIONES DE DESCUENTOS ADICIONALES  */
    /*   1.CLIENTE TIPO DROGUERIA GRUPO 100                 */
    /*   2.CUMPLIMIENTO DE PRESUPUESTO DE VENTA EN MES FAC  */
    /*   3.DESCUENTO HABILITADO EN PLATAFORMA CON TIPO S    */
    /*   4.SI EL CHECK ESTA ACTIVADO NO SE CALCULA DCTO     */
    if (!$("#ActivaDcto").is(':checked')) {
      //Condiciones sujetas a cumplimiento de ventas
      $("#tableCondicionesLista tr:gt(0)").each(function () {
        var diasDcto = $(this).find('td').eq(1).html();
        if ($.trim($("#Grupo").val()) == '100' && cumple_pres == 'S') {
          if (parseInt(dias) <= parseInt(diasDcto)) {
            pcjDesc = parseInt($(this).find('td').eq(2).html());
            recibeDescuento = 1;
            NofificacionDescuento(pcjDesc);
            return false;
          }

        }
      });

      //Condiciones especiales sujetas a plazo
      if (pcjDesc == 0) {
        $("#tableCondicionesListaPlazo tr:gt(0)").each(function () {
          var diasDcto = $(this).find('td').eq(1).html();
          if ($.trim($("#Grupo").val()) == '100') {
            if (parseInt(dias) <= parseInt(diasDcto)) {
              pcjDesc = parseInt($(this).find('td').eq(2).html());
              recibeDescuento = 1;
              NofificacionDescuento(pcjDesc);
              return false;
            }

          }
        });
      }

      //Condiciones propias del cliente 
      if (pcjDesc == 0) {
        $("#tableCondicionesDcto tr:gt(0)").each(function () {
          var diasDcto = $(this).find('td').eq(2).html();
          var SujPres = $(this).find('td').eq(5).html(); //Sujeto a cumplimiento de presupuesto
          if (SujPres == 'S') {
            if ($.trim($("#Grupo").val()) == '100' && cumple_pres == 'S') {
              if (parseInt(dias) <= parseInt(diasDcto)) {
                if (pcjDesc < parseInt($(this).find('td').eq(3).html())) {
                  pcjDesc = parseInt($(this).find('td').eq(3).html());
                  recibeDescuento = 1;
                  NofificacionDescuento(pcjDesc);
                  return false;
                }


              }
            }
          } else {
            if (parseInt(dias) <= parseInt(diasDcto)) {
              if (pcjDesc < parseInt($(this).find('td').eq(3).html())) {
                pcjDesc = $(this).find('td').eq(3).html();
                recibeDescuento = 1;
                NofificacionDescuento(pcjDesc);
                return false;
              }

            }
          }

        });
      }
    } else {
      console.warn('No se calcula descuento por estar desactivado');
    }

    /*nuevo codigo para condiciones de descuentos especiales*/
    if (parseInt(vlrDoc) < 0) {
      vlrDoc = vlrDoc * -1;
    }
    if (valor == '') {
      valor = 0;
      $(ob).val(0);
    }
    var valor = parseInt(unformatNum(valor));
    if (vlrDoc >= valor || valor == 0 || valor == '') {
      var vtotal = 0;
      $("#tdFacturas tbody tr").each(function (index, element) {
        var IdDoc = parseInt(unformatNum($(this).find('td').eq(0).html()));
        var vlrFila = parseInt(unformatNum($(this).find('td').eq(11).find('input').val()));
        var vlrFact = parseInt(unformatNum($(this).find('td').eq(9).html()));
        var TipoDoc = $.trim($(this).find('td').eq(2).html());
        //INICIO 
        if (IdDoc == NumDoc) {
          if ((vlrFact == vlrFila) && (TipoDoc == 'RV' || TipoDoc == 'DZ' || TipoDoc == 'AB')) {
            $(this).find('td').eq(12).find('input').attr('disabled', false);
            //NUEVO CODIGO
            if (recibeDescuento == 1) {
              var demora = $.trim($(this).find('td').eq(7).html());
              var basePP = unformatNum($.trim($(this).find('td').eq(13).html()));
              var vlrDesc = 0;
              if (basePP > 0) {
                vlrDesc = Math.round(parseFloat(basePP) * (parseFloat(pcjDesc) / 100));
              }
              $(this).find('td').eq(12).find('input').val(formatNum(vlrDesc, '$'));

            } else {
              $(this).find('td').eq(12).find('input').attr('disabled', true);
              $(this).find('td').eq(12).find('input').val('$0');
            }
            //FIN NUEVO CODIGO
          } else {
            $(this).find('td').eq(12).find('input').attr('disabled', true);
            $(this).find('td').eq(12).find('input').val('$0');
          }
        }
        //FIN
        if (vlrFila > 0) {
          $(this).css('background', '#8BF4C4');
        } else {
          $(this).css('background', '');
        }
        var vlrDesc = parseInt(unformatNum($(this).find('td').eq(12).find('input').val()));
        //alert(vlrFact);
        if (vlrFact < 0) {
          vlrFila = (vlrFila - vlrDesc) * -1;
        } else {
          vlrFila = (vlrFila - vlrDesc);
        }
        vtotal = vtotal + parseFloat(vlrFila);

      });
      $("#VlrTotalFacturas").val(formatNum(vtotal, '$'));
      //Actualiza
      var vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val())) - parseFloat(unformatNum($("#VlrTotalFacturas").val()));
      $("#VlrSinAsignar").val(formatNum(vasignado, '$'));

    } else {
      $(ob).val('$0');
      $(ob).focus();
      Swal.fire('Error', 'El valor ingresado no puede ser mayor al valor del documento', 'error');
    }
  } else {
    Swal.fire('Error', 'Primero se debe agregar un abono desde la pestaña de multicash.', 'error');
    $(ob).val('$0');
  }

}

// DOCUMENTOS
function Documentos() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    global: false,
    beforeSend: function () {
      LoadImg('CARGANDO DOCUMENTOS...');
    },
    data: {
      op: 'B_CARTERA_RC',
      codigo: $.trim($("#CodigoSAP").val()),
      org: $.trim($("#Sociedad").val()),
      tipo: 'S'
    },
    dataType: "json",
    async: true,
    success: function (data) {
      if (data !== '' && data !== null) {
        let detalle = '';
        let total = 0;
        let mora = '';
        let ver = '';
        let cont = 0;
        let vlrMora = 0;
        for (let i = 0; i <= data.length - 1; i++) {
          if (parseInt(data[i].DEMORA_GRACIA) > 0) {
            mora = 'style="background-color:#F77577"';
            vlrMora = vlrMora + parseFloat(data[i].IMPORTE);
          } else {
            mora = 'style="background-color:#75F7A8"';
          }
          if ($.trim(data[i].CLASE_DOCUMENTO) == 'RV') {
            ver = '<img src="../resources/icons/eye.png" align="absmiddle" onclick="VisualizarDocumento(\'' + $.trim(data[i].REFERENCIA) + '\',\'F\')">';
          } else {
            ver = '';
          }

          let cumple_img = '';
          let cumple_pres = 'N';
          if (parseFloat(data[i].CUMP_PRESUPUESTO) > 0) {
            cumple_img = `<span class="glyphicon glyphicon-flag" aria-hidden="true" style="color:green"></span>`;
            cumple_pres = 'S';
          }
          detalle +=
            `<tr>
              <td>${data[i].NUMERO_DOCUMENTO.trim()}</td>
              <td>${data[i].REFERENCIA.trim()}</td>
              <td>${data[i].CLASE_DOCUMENTO}</td>
              <td>${ver}</td>
              <td>${data[i].FECHA_BASE}</td>
              <td>${data[i].FECHA_PAGO_GRACIA}</td>
              <td>${data[i].CONDICION_PAGO}</td>
              <td ${mora}>${data[i].DEMORA_GRACIA}</td>
              <td>${data[i].DIAS}</td>
              <td>${formatNum(data[i].IMPORTE, '$')}</td>
              <td>${data[i].TEXTO.trim()}</td>
              <td>
                <input type="text" onKeyPress="return vnumeros(event)" onDblClick="AsignarValor(this);" size="15" class="form-control ClassNumero" onBlur="AddFactura(this, this.value, '${cumple_pres}')" value="$0">
              </td>
              <td>
                <input type="text" onKeyPress="return vnumeros(event)"  size="15" class="form-control ClassNumero" onBlur="AddFactura(this, this.value,  '${cumple_pres}')" disabled value="$0">
              </td>
              <td>${formatNum(parseFloat(data[i].BASE_PP), '$')}</td>
              <td style="display:none;">${data[i].DESCUENTO}</td>
              <td>${data[i].REFERENCIA_FACTURA}</td>
              <td class="text-center">${cumple_img}</td>
              <td class="text-center">
                <button class="btn btn-primary btn-sm agregar-liquidacion" data-item='${JSON.stringify(data[i])}'>
                  <i class="fa-solid fa-plus"></i>
                </button>
              </td>
            </tr>`;
          total += parseFloat(data[i].IMPORTE);
          cont++;
        }

        $('#valorTotal').text(formatNum(total, '$'));
        $('#partidas').text(cont);
        $('#valorMora').text(formatNum(vlrMora, '$'));

        let tabla =
          `<table class="form" width="100%" id="tdFacturas">
          <thead>            
            <tr>
              <th>DOCUMENTO</th>
              <th>REF DOC</th>
              <th>CLASE</th>
              <th>VER</th>
              <th>FH BASE</th>
              <th>FH PAGO</th>
              <th>CONDICION</th>
              <th>DEMORA</th>
              <th>DIA</th>
              <th>IMPORTE</th>
              <th>TEXTO</th>
              <th>VALOR</th>
              <th>DCTO</th>
              <th>BASE PP</th>
              <th>REF FACT</th>
              <th>CUMP.PRES</th>
              <th>AGR. FAC.</th>
            </tr>
          </thead>
          <tbody>
           ${detalle}
          </tbody>
        </table>`;
        $("#dvResultCartera").html(tabla);
        $(".ClassNumero").maskMoney({
          selectAllOnFocus: true, //evento onkeyup 
          prefix: '$',
          thousands: '.',
          decimal: ',',
          allowZero: true,
          precision: 0
        });

        $('#tdFacturas').on('click', '.agregar-liquidacion', async function () {
          const item = JSON.parse($(this).attr('data-item'));

          const existeDocumento = arrayLiquidador.find(itemArray => itemArray.numeroDoc === item.NUMERO_DOCUMENTO.trim());
          if (existeDocumento) {
            Swal.fire("Agregar documento", "El documento ya existe en el liquidador", "warning");
            return;
          }

          const result = await confirmAlert("Agregar documento", "Se agregará el documento al liquidador... ¿Desea continuar?");
          if (!result.isConfirmed) return;
          agregarLiquidador(item);
        });

      } else {
        $("#dvResultCartera").html(`<div class="alert alert-danger" role="alert">
          <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span class="sr-only">Error:</span>NO EXISTEN DOCUMENTOS PARA EL CLIENTE SELECCIONADO</div>`);
      }
    }
  }).always(function (data) {
    UnloadImg();
    ConsultarMulticash();
  });
}

function AsignarValor(ob) {
  var vlrDoc = unformatNum($(ob).parent().parent().find('td').eq(9).html());
  var vlrAct = unformatNum($(ob).val());
  if (parseInt(vlrDoc) < 0) {
    vlrDoc = parseInt(vlrDoc) * -1;
  }
  if (vlrAct > 0) {
    $(ob).val('$0');
  } else {
    $(ob).val(formatNum(vlrDoc, '$'));
  }
}

function VisualizarDocumento(num, tipo) {
  var rol = $("#RolId").val();
  if (num != 0) {
    if (tipo == 'R') { //recibos de caja
      if (rol != 14) {
        $("#btnEliminarPDF").show();
      }
      /*$("#ModalPDFTittle").html('Comprobante de pago - RECIBO DE CAJA');*/
      $("#ContainerPDF").html('<embed src="../../RecibosCaja/' + num + '.pdf" frameborder="0" width="100%" height="400px">');
    } else if (tipo == 'F') { //Facturas
      $("#btnEliminarPDF").hide();
      $("#ModalPDFTittle").html('FACTURA DE VENTA');
      $("#ContenidoPDF").html('<embed src="../resources/tcpdf/Factura.php?num=' + parseInt(num) + '" frameborder="0" width="100%" height="400px">');
      $("#ModalPDF").modal("show");
    }

  } else {
    Swal.fire('error', 'El pedido seleccionado no posee factura', 'error');
  }
}

function EliminarPDF() {
  var id = $.trim($("#txt_id_rc").html());
  var num = $.trim($("#txt_num").html());
  if (num == 0) {
    Swal.fire({
      title: 'Realmente desea eliminar el documento asociado al recibo #' + id,
      text: "Despues de aceptar no podra reversar la operacion!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#82ED81",
      cancelButtonColor: "#FFA3A4",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      closeOnConfirm: false,
      closeOnCancel: false
    }).then((result) => {
      if (result.value) {
        $.ajax({
          type: "POST",
          encoding: "UTF-8",
          url: "../models/RecibosCaja.php",
          global: false,
          error: function (OBJ, ERROR, JQERROR) { },
          data: ({
            op: 'U_RC',
            id: id
          }),
          dataType: "html",
          async: true,
          success: function (data) {
            if (data == 1) {
              Swal.fire('Excelente', 'El documento ha sido eliminado', 'success');
              ConsultarPlanilla();
              $("#ModalPDF").modal("hide");
              $("#dvReciboCaja").modal("hide");
            } else {
              Swal.fire('Error', 'No se pudo eliminar del documento', 'error');
            }
          }
        }).always(function (data) {
          //console.log(data);	
        });
      } else {
        Swal.fire('Cancelado', 'No se ha realizado ninguna operacion', 'warning');
      }
    })
  } else {
    Swal.fire('Oops', 'No es posible editar el documento de un recibo autorizado', 'error');
  }

}

function Guardar() {
  var codigoSap = $.trim($("#CodigoSAP").val());
  var Organizacion = $.trim($("#Sociedad").val());
  if (codigoSap != '') {
    var cont = 0;
    var documen = new Array();
    var cuentas = new Array();
    var vlrAbonado = unformatNum($("#VlrTotalAbono").val());
    var vlrAsignar = unformatNum($("#VlrSinAsignar").val());
    var vlrFactura = unformatNum($("#VlrTotalFacturas").val());
    //Facturas--------------------------------------------------------------------------------------
    $("#tdFacturas tbody tr").each(function (index, element) {
      var vlrFila = parseInt(unformatNum($(this).find('td').eq(11).find('input').val()));
      var vlrDesc = parseInt(unformatNum($(this).find('td').eq(12).find('input').val()));
      var TipoDoc = $.trim($(this).find('td').eq(2).html());
      var NumDoc = $.trim($(this).find('td').eq(0).html());
      var RefDoc = $.trim($(this).find('td').eq(1).html());
      var ReFact = $.trim($(this).find('td').eq(15).html());
      var Vlr = parseInt(unformatNum($.trim($(this).find('td').eq(9).html())));
      var TipoVal = '';
      if (vlrFila > 0) {
        if (Vlr < 0) {
          TipoVal = 'N';
        } else {
          TipoVal = 'P';
        }


        //  documen += NumDoc+'|'+vlrFila+'|'+vlrDesc+'|'+RefDoc+'|'+ReFact+'|'+TipoDoc+'|'+TipoVal+'#';


        documen.push({
          'NumDoc': NumDoc,
          'vlrFila': vlrFila,
          'vlrDesc': vlrDesc,
          'RefDoc': RefDoc,
          'ReFact': ReFact,
          'TipoDoc': TipoDoc,
          'TipoVal': TipoVal
        });

        cont++;

      }
    });
    //Abonos----------------------------------------------------------------------------------------
    $("#tdBody tr").each(function (index, element) {
      var Cuenta = $.trim($(this).find('td').eq(0).html());
      var Valor = $.trim($(this).find('td').eq(2).html());
      var FechaValor = $.trim($(this).find('td').eq(3).html());
      var Referencia = $.trim($(this).find('td').eq(4).html());
      var Id = $.trim($(this).attr('id'));
      if (Cuenta != '') {
        // cuentas += Cuenta+'|'+unformatNum(Valor)+'|'+FechaValor+'|'+Id+'|ABN|'+Referencia+'#';
        cuentas.push({
          'Cuenta': Cuenta,
          'Valor': unformatNum(Valor),
          'FechaValor': FechaValor,
          'Id': Id,
          'Tipo': 'ABN',
          'Referencia': Referencia
        });
      }
    });
    //Validacion para agregar facturas---------------------------------------------------------------
    if (cont > 0) { //Validacion de cantidad de documentos
      if (parseFloat(vlrAsignar) >= -1000 && parseFloat(vlrFactura) > 0) { //Para probar
        //El valor asignado es mayor a cero es porque se hizo abono
        var titulo = '';
        if (parseFloat(vlrAsignar) >= -1000 && parseFloat(vlrAsignar) <= 1000) {
          if (parseFloat(vlrAsignar) == 0) { //Recibo normal
            titulo = 'Esta seguro de generar el recibo de caja?';
          } else { //Con ajuste al peso
            titulo = 'Se detecto ajuste al peso, esta seguro de continuar?';
          }
        } else {
          titulo = 'Se generara saldo a favor, esta seguro de continuar?';
        }
        Swal.fire({
          title: titulo,
          text: "Despues de aceptar no podra reversar la operacion!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#82ED81",
          cancelButtonColor: "#FFA3A4",
          confirmButtonText: "Guardar!",
          cancelButtonText: "Cancelar",
          closeOnConfirm: false,
          closeOnCancel: false
        }).then((result) => {
          if (result.value) {
            //Aqui se envia l web service de generacion de recibo de caja
            EnviarTMP(cuentas, documen, vlrAsignar, codigoSap);
          } else {
            Swal.fire("Cancelado", "La operacion  ha sido cancelada!", "error");
          }
        });

      } else {
        //No se hizo abono
        Swal.fire('Oops', 'La diferencia es demasiado grande para compensar!', 'warning')
      }
    } else {
      Swal.fire('Error', 'No se ha seleccionado ningun documento.', 'error')
    }
  } else {
    Swal.fire('Error', 'Debe cargar un cliente!', 'error');
  }

}

function VerificarDocumento(doc) {
  let id_rc = 0;
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/RecibosCaja.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {

    },
    beforeSend: function () {
      // LoadImg('Creando Preliminar...');  
    },
    data: {
      op: 'S_VALIDA_DOC',
      doc: doc

    },
    dataType: "json",
    async: false,
    success: function (data) {
      if (data.length > 0) {
        id_rc = parseInt(data[0].id_rc);
      }
    }
  });
  return id_rc;
}

function EnviarTMP(cuentas, documentos, asignados, cliente) {


  //verificacion de facturas en recibos ya creados
  var sw = 0;
  documentos.forEach(function (data) {
    sw = VerificarDocumento(data.NumDoc);
    if (sw > 0) {
      console.log('Hay fue!!.');
      return;
    }
  });
  if (sw == 0) {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/RecibosCaja.php",
      global: false,
      error: function (OBJ, ERROR, JQERROR) {

      },
      beforeSend: function () {
        LoadImg('Creando Preliminar...');
      },
      data: {
        op: 'I_CARTERA_RC',
        cuentas: cuentas,
        documentos: documentos,
        asignados: asignados,
        cliente: cliente,
        referencia: $.trim($("#Referencia").val()),
        TextoCabecera: $.trim($("#TextoCabecera").val()),
        TextoCompensa: $.trim($("#TextoCompensacion").val()),
        FechaDoc: $.trim($("#FechaDocumento").val()),
        Sociedad: $.trim($("#Sociedad").val())

      },
      dataType: "html",
      async: false,
      success: function (data) {
        if (data > 0) {
          Swal.fire("Excelente!", "Recibo de caja temporal #" + data + " creado satisfactoriamente", "success");
          Limpiar();
          return false;
        } else {
          Swal.fire("Oops..!", "Error al recibir respuesta :\n" + data, "error");
          return false;
        }
      }
    }).always(function (data) {
      UnloadImg();
    });
  } else {
    Swal.fire('Oops :(', 'Uno de los documentos que intenta adicionar esta en el recibo #' + sw, 'error');
  }

}

function AutorizarRC(version) {
  var id = $.trim($("#txt_id_rc").html());
  var num = $.trim($("#txt_num").html());
  if (id != 0) {
    // if(num == 0){
    Swal.fire({
      title: 'Realmente desea autorizar el recibo temporal #' + id,
      text: "Despues de aceptar no podra reversar la operacion!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#82ED81",
      cancelButtonColor: "#FFA3A4",
      confirmButtonText: "Guardar!",
      cancelButtonText: "Cancelar",
      closeOnConfirm: false,
      closeOnCancel: false
    }).then((result) => {
      if (result.value) {
        $.ajax({
          type: "POST",
          url: "../models/WS-RCTMP.php",
          async: true,
          dataType: "html",
          error: function (OBJ, ERROR, JQERROR) { },
          beforeSend: function () {
            LoadImg('GUARDANDO...');
          },
          data: {
            id: id,
            version: version
          },
          success: function (data) {
            console.log(data);
            UnloadImg();
            if (data > 0) {
              Swal.fire("Excelente!", "Recibo de caja :" + data + " creado satisfactoriamente", "success");
              EnviarMail($.trim(id));
            } else {
              Swal.fire('Oops...', 'No fue posible enviar el RC, ' + data, 'error');
            }
            ConsultarPlanilla();
            $("#dvReciboCaja").modal("hide");
          }
        }).fail(function (data) {
          console.error(data);
          UnloadImg();
        });
      } else {
        Swal.fire("Cancelado", "La operacion  ha sido cancelada!", "error");
      }
    });
    /* }else{	  
       Swal.fire('Oops...','El recibo fue previamente autorizado!','error');
     }*/
  } else {
    Swal.fire('Oops...', 'No fue posible enviar el RC.', 'error');
  }
}

function EnviarWS(cuentas, documen, asignados, cliente) {
  $.ajax({
    type: "POST",
    url: "../models/WS-RC.php",
    async: true,
    dataType: "html",
    error: function (OBJ, ERROR, JQERROR) { },
    beforeSend: function () { },
    data: {
      cuentas: cuentas,
      documen: documen,
      asignados: asignados,
      cliente: cliente,
      referencia: $.trim($("#Referencia").val()),
      TextoCabecera: $.trim($("#TextoCabecera").val()),
      TextoCompensa: $.trim($("#TextoCompensacion").val()),
      FechaDoc: $.trim($("#FechaDocumento").val()),
      Sociedad: $.trim($("#Sociedad").val())
    },
    success: function (data) {
      if (data > 0) {
        Swal.fire("Excelente!", "Recibo de caja :" + data + " creado satisfactoriamente", "success");
        Limpiar();
        return false;
      } else {
        Swal.fire("Oops..!", "Error al recibir respuesta :\n" + data, "error");
        return false;
      }
    }
  }).fail(function (data) {
    console.error(data);
  });
}

function ConsultarPlanilla() {
  var Usr = $("#UsrLogin").val();
  $.ajax({
    type: "POST",
    url: "../models/RecibosCaja.php",
    async: true,
    dataType: "json",
    beforeSend: function () { },
    data: {
      op: 'PLANILLA',
      fhIni: $("#RptFhIni").val(),
      fhFin: $("#RptFhFin").val(),
      Usr: Usr
    },
    success: function (data) {
      var detalle = '';
      var total = 0;
      var desc = 0;
      var cont = 0;
      if (data.length > 0) {
        for (var i = 0; i <= data.length - 1; i++) {
          var estado = '';
          var color = '';
          if (data[i].ESTADO == 'T') {
            estado = '<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>';
            color = 'danger';
          } else {
            estado = '<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>';
            color = 'success';
          }
          detalle += '<tr >'
            + '<td>' + data[i].FECHA_HORA + '</td>'
            + '<td>' + data[i].USUARIO + '</td>'
            + '<td>' + data[i].CODIGO_SAP + '</td>'
            + '<td>' + data[i].NOMBRES + '</td>'
            + '<td>' + data[i].RAZON_COMERCIAL + '</td>'
            + '<td>' + data[i].NUMERO + '</td>'
            + '<td>' + formatNum(data[i].VALOR, '$') + '</td>'
            + '<td>' + formatNum(data[i].DESCUENTO, '$') + '</td>'
            + '<td align="center">'
            + '<button class="btn btn-' + color + ' btn-sm" type="button">' + estado + '</button>'
            + '</td>'
            + '<td align="center">'
            + '<button type="button" class="btn btn-warning btn-sm" onclick="AbrirRecibo(\'' + data[i].ID_RC + '\',this)">'
            + '<span class="glyphicon glyphicon-flash" aria-hidden="true"></span>'
            + '</button>'
            + '</td>'
            + '<td style="display:none;">' + data[i].TEXTO_CABECERA + '</td>'
            + '<td style="display:none;">' + data[i].TEXTO_COMPENSACION + '</td>'
            + '<td style="display:none;">' + data[i].TEXTO_REFERENCIA + '</td>'
            + '<td align="center">'
            + '<button type="button" class="btn btn-primary btn-sm" onclick="PDFRecibo(\'' + data[i].ID_RC + '\',this)">'
            + '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>'
            + '</button>'
            + '</td>'
            + '<td style="display:none;">' + data[i].ADJUNTO + '</td>'
            + '<td style="display:;">' + data[i].ZONA_VENTAS + '</td>'
            + '<td style="display:;">' + data[i].ID_RC + '</td>'
            + '<td style="display:none;">' + data[i].EMAIL + '</td>'
            + '<td style="display:none;">' + data[i].EMAIL_ZONA + '</td>'
            + '<td style="display:none;">' + data[i].USUARIO_APRUEBA + '</td>'
            + '<td style="display:none;">' + data[i].FECHA_HORA_APROBACION + '</td>'
            + '</tr>';
          total += parseFloat(data[i].VALOR);
          desc += parseFloat(data[i].VALOR);
          cont++;

        }
        var tabla = '<table class="table" width="100%" id="tablePlanillas">'
          + '<thead>'
          + '<tr>'
          + '<th>FECHA/HORA</th>'
          + '<th>USUARIO</th>'
          + '<th>CODIGO</th>'
          + '<th>NOMBRES</th>'
          + '<th>RAZON</th>'
          + '<th>NUMERO</th>'
          + '<th>VALOR</th>'
          + '<th>DESCUENTO</th>'
          + '<th>ESTADO</th>'
          + '<th>GESTIONAR</th>'
          + '<th>PDF</th>'
          + '<th>ZONA VENTAS</th>'
          + '<th>ID</th>'
          + '</tr>'
          + '</thead>'
          + '<tbody>'
          + detalle
          + '</tbody>'
          + '</table>';
        $("#dvResultPlanilla").html(tabla);
        $("#TotalRC").val(cont);
      } else {
        $("#dvResultPlanilla").html('<div class="alert alert-danger" role="alert">'
          + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
          + '<span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS' + '</div>');
      }
    }
  }).fail(function (data) {
    $("#FiltroPlanilla").trigger('keyup');
    console.error(data);
  });
}

function AbrirRecibo(id, ob) {
  //Encabezado
  var obj = $(ob).parent().parent().find("td");
  $("#txt_id_rc").html(id);
  $("#txt_num").html(obj.eq(5).html());
  $("#txt_codigo").html(obj.eq(2).html());
  $("#txt_cliente").html(obj.eq(3).html());
  $("#txt_razon").html(obj.eq(4).html());
  $("#txt_valor").html(obj.eq(6).html());
  $("#txt_cabecera").html(obj.eq(10).html());
  $("#txt_compesacion").html(obj.eq(11).html());
  $("#txt_referencia").html(obj.eq(12).html());

  $("#txt_mail").html(obj.eq(17).html());
  $("#txt_mail_zona").html(obj.eq(18).html());
  $("#txt_user_aprueba").html(obj.eq(19).html());
  $("#txt_fh_aprueba").html(obj.eq(20).html());
  var adj = obj.eq(14).html();
  if (adj == 1) {
    $("#tdDocPDF").html('<img src="../resources/icons/eye.png" align="absmiddle" onclick="VisualizarDocumento(\'' + $.trim(id) + '\',\'R\')">');
  } else {
    $("#tdDocPDF").html('<input type="file" id="DocPDF" name="DocPDF" class="form-control" accept="application/pdf">');
    $("#DocPDF").change(function () {
      uploadAjax();
    })
  }
  //Detalle
  $.ajax({
    type: "POST",
    url: "../models/RecibosCaja.php",
    async: true,
    dataType: "json",
    beforeSend: function () {

    },
    data: {
      op: 'S_DETALLE_RC',
      id: id
    },
    success: function (data) {
      var table = '<table class="form" width="100%">'
        + '<thead>'
        + '<tr>'
        + '<th>ID</th>'
        + '<th>IMPORTE</th>'
        + '<th>DESCUENTO</th>'
        + '<th>CUENTA</th>'
        + '<th>FECHA VALOR</th>'
        + '<th>DOCUMENTO</th>'
        + '<th>DOC REF</th>'
        + '<th>FAC REF</th>'
        + '<th  style="display:none;">C. BENEFICIO</th>'
        + '<th>TIPO</th>'
        + '<th>TEXTO</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>';
      var dtotal = 0;
      var vtotal = 0;
      var diferencia = 0;
      for (var i = 0; i <= data.length - 1; i++) {
        var valor = 0;
        if (data[i].TIPO == 'C') {
          valor = '<td style="color:#FF1519;">(' + formatNum(parseFloat(data[i].IMPORTE), '$') + ')</td>';
          vtotal += parseFloat(data[i].IMPORTE) * -1;
        } else {
          if ($.trim(data[i].TIPO_DOC) == 'DA' || $.trim(data[i].TIPO_VALOR) == 'N') {
            valor = '<td style="color:#FF1519;">(' + formatNum(parseFloat(data[i].IMPORTE), '$') + ')</td>';
            vtotal += parseFloat(data[i].IMPORTE) * -1;
          } else {
            valor = '<td>' + formatNum(data[i].IMPORTE, '$') + '</td>';
            vtotal += parseFloat(data[i].IMPORTE);
          }
        }
        dtotal += parseFloat(data[i].DESCUENTO);
        table += '<tr>'
          + '<td>' + data[i].ID_RC + '</td>' + valor
          + '<td style="color:#FF1519;">(' + formatNum(data[i].DESCUENTO, '$') + ')</td>'
          + '<td>' + data[i].CUENTA + '</td>'
          + '<td>' + data[i].FECHA_VALOR + '</td>'
          + '<td>' + data[i].DOCUMENTO + '</td>'
          + '<td>' + data[i].REF_DOC + '</td>'
          + '<td>' + data[i].REF_FACT + '</td>'
          + '<td style="display:none;">' + data[i].CENTRO_BENEFICIO + '</td>'
          + '<td>' + data[i].TIPO + '</td>'
          + '<td>' + data[i].TEXTO + '</td>'
          + '</tr>';
      }
      diferencia = vtotal - dtotal;
      table += '<tr>'
        + '<td><b>TOTALES</b></td>'
        + '<td>' + formatNum(vtotal, '$') + '</td>'
        + '<td>' + formatNum(dtotal, '$') + '</td>'
        + '<td colspan="8"></td>'
        + '</tr>'
        +

        '<tr>'
        + '<td><b>DIFERENCIA</b></td>'
        + '<td>' + formatNum(diferencia, '$') + '</td>'
        + '<td colspan="9"></td>'
        + '</tr>'
        + '</tbody>'
        + '</table>';
      $("#tr_det").html(table);
    }
  }).error(function (data) {
    console.error(data);
  });
  //Abrir modal
  $("#ContainerPDF").html('');
  $("#dvReciboCaja").modal();
}


function EliminarRC() {
  var id = parseInt($.trim($("#txt_id_rc").html()));
  var num = parseInt($.trim($("#txt_num").html()));
  Swal.fire({
    title: 'Realmente desea eliminar el recibo temporal #' + id,
    text: "Despues de aceptar no podra reversar la operacion!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#82ED81",
    cancelButtonColor: "#FFA3A4",
    confirmButtonText: "Eliminar!",
    cancelButtonText: "Cancelar",
    closeOnConfirm: false,
    closeOnCancel: false
  }).then((result) => {
    if (result.value) {
      if (num == 0) {
        $.ajax({
          type: "POST",
          url: "../models/RecibosCaja.php",
          async: true,
          dataType: "json",
          error: function (OBJ, ERROR, JQERROR) { },
          beforeSend: function () { },
          data: {
            op: 'D_RC',
            id: id
          },
          success: function (data) {
            if (data == 0) {
              Swal.fire('Excelente', 'Recibo temporal eliminado', 'success');
            } else {
              Swal.fire('Oops...', 'No fue posible eliminar el RC.', 'error');
            }
            ConsultarPlanilla();
            $("#dvReciboCaja").modal("hide");
          }
        }).fail(function (data) {
          console.error(data);
        });
      } else {
        Swal.fire('Oops...', 'No es posible eliminar un RC ya aplicado.', 'error');
      }
    } else {

    }
  })
}

function PDFRecibo(num) {
  $('#dvReciboCajaPDF').html('<embed src="../resources/tcpdf/Recibos.php?numero=' + num + '&email=sistemas@multidrogas.com&tipo=R" frameborder="0" width="100%" height="400px">');
  $("#dvPDFRecibo").modal();
}

function EnviarMail(numero) {
  var email = '';
  if ($.trim($("#txt_mail_zona").html()) != '') {
    email = $.trim($("#txt_mail_zona").html());
  }
  if ($.trim($("#txt_mail").html()) != '') {
    if (email != '') {
      email += ';' + $.trim($("#txt_mail").html());
    } else {
      email = $.trim($("#txt_mail").html());
    }
  }
  $.ajax({
    type: "GET",
    url: "../resources/tcpdf/Recibos.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) { },
    data: ({
      numero: numero,
      tipo: 'P',
      email: email
    }),
    dataType: "html",
    async: true,
    success: function (data) { }
  }).fail(function (data) {
    console.error(data);
  });
}

function uploadAjax() {
  var inputFile = document.getElementById('DocPDF');
  var file = inputFile.files[0];
  var data = new FormData();
  var id = $.trim($("#txt_id_rc").html());
  data.append('archivo', file);
  data.append('id', id);
  data.append('op', 'SUBIR_FILE');
  var url = "../models/RecibosCaja.php";
  $.ajax({
    url: url,
    type: "POST",
    contentType: false,
    data: data,
    processData: false,
    cache: false,
    success: function (data) {
      if (data == "true") {
        Swal.fire('Documento Cargado!', 'Se han cargado los archivos correctamente', 'success');
        $("#tdDocPDF").html('<img src="../resources/icons/eye.png" align="absmiddle" onclick="VisualizarDocumento(\'' + $.trim(id) + '\',\'R\')">');
      } else {
        Swal.fire('Error!', 'Se han producido un error cargado los archivos', 'error')
      }
    }
  }).fail(function (data) {
    console.error(data);
  });
}

function AgregarCondicionEspecial() {
  var codigo = $.trim($("#txt_CondCodigo").val());
  var dias = parseInt($.trim($("#txt_CondDias").val()));
  var dcto = parseInt($.trim($("#txt_CondDcto").val()));
  if (codigo != '' && dias > 0 && dcto > 0) {
    $.ajax({
      type: "POST",
      url: "../models/RecibosCaja.php",
      async: true,
      dataType: "json",
      error: function (OBJ, ERROR, JQERROR) { },
      beforeSend: function () { },
      data: {
        op: 'I_CONDICION_ESPECIAL',
        codigo: codigo,
        dias: dias,
        dcto: dcto
      },
      success: function (data) {
        if (data > 0) {
          Swal.fire('Excelente', 'Condicion especial guardada y en espera de autorización.', 'success');
        } else {
          Swal.fire('Oops...', 'No fue posible crear la solicitud.', 'error');
        }
        ConsultarCondicionEspecial();
        $("#txt_CondCodigo").val('');
        $("#txt_CondDias").val('');
        $("#txt_CondDcto").val('');
        $("#txt_CondCliente").val('');
      }
    }).fail(function (data) {
      console.error(data);
    });
  } else {
    Swal.fire('Error!', 'Campos vacios o inválidos, verifique e intente nuevamente', 'error');
  }
}

function ConsultarCondicionEspecial() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/RecibosCaja.php",
    async: true,
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) { },
    beforeSend: function () { },
    data: {
      op: 'S_CONDICION_ESPECIAL'
    },
    success: function (data) {
      if (data.length > 0) {
        var tabla = '<table class="form" width="100%" id="tableCondicionesEspeciales">'
          + '<thead>'
          + '<tr>'
          + '<th>ID</th>'
          + '<th>CODIGO</th>'
          + '<th>NOMBRES</th>'
          + '<th>RAZON</th>'
          + '<th>DIAS</th>'
          + '<th>SUJETO.CUMPLI.</th>'
          + '<th>DESCUENTO</th>'
          + '<th>AUTORIZAR</th>'
          + '</tr>'
          + '</thead>'
          + '<tbody>';
        for (var i = 0; i <= data.length - 1; i++) {
          tabla += '<tr>'
            + '<td>' + data[i].id + '</td>'
            + '<td>' + data[i].codigo_sap + '</td>'
            + '<td>' + data[i].nombres + '</td>'
            + '<td>' + data[i].razon_comercial + '</td>'
            + '<td>' + data[i].dias + '</td>'
            + '<td>' + data[i].sujeto_cump + '</td>'
            + '<td>' + data[i].descuento + '</td>'
            + '<td align="center">'
            + '<button class="btn btn-sm btn-default" onclick="AutorizarCondicionEspecial(\'' + data[i].id + '\')">'
            + '<span class="glyphicon glyphicon-check" aria-hidden="true" ></span>'
            + '</button>'
            + '</td>'
            + '</tr>';
        }
        tabla += '</tbody></table>';
        $("#dvResultCondicionesEspeciales").html(tabla);
      } else {
        $("#dvResultCondicionesEspeciales").html('<div class="alert alert-danger" role="alert">'
          + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
          + '<span class="sr-only">Error:</span>  No hay solicitudes pendientes.' + '</div>');
      }
    }
  }).fail(function (data) {
    console.error(data);
  });

}

function AutorizarCondicionEspecial(id) {
  var rol = $("#RolId").val();
  if (rol == 1 || rol == 18) { //Administrador - gerencia administrativa
    Swal.fire({
      title: 'Autorizar condición de descuento #' + id,
      text: "Esta seguro?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#82ED81",
      cancelButtonColor: "#FFA3A4",
      confirmButtonText: "SI",
      cancelButtonText: "NO",
      closeOnConfirm: false,
      closeOnCancel: false
    }).then((result) => {
      if (result.value) {
        $.ajax({
          type: "POST",
          url: "../models/RecibosCaja.php",
          async: false,
          dataType: "html",
          error: function (OBJ, ERROR, JQERROR) { },
          beforeSend: function () { },
          data: {
            op: "A_CONDICION_ESPECIAL",
            id: id
          },
          success: function (data) {
            if (data == 1) {
              Swal.fire('Excelente', 'Condicion autorizada con exito', 'success');
            } else {
              Swal.fire('Error', 'No fue posible autorizar!' + data, 'error');
            }
            ConsultarCondicionEspecial();
          }
        }).fail(function (data) {
          console.error(data);
        });
      }
    });
  } else {
    Swal.fire('Error', 'Usted no cuenta con los permisos para autorizar, este tipo de solicitudes.', 'error');
  }
}

function AutorizarTodoCondicion() {
  var nFilas = $("#tableCondicionesEspeciales tr").length;
  var rol = $("#RolId").val();
  if (rol == 1 || rol == 18) { //Administrador - gerencia administrativa
    if (nFilas > 0) {
      Swal.fire({
        title: 'Se autorizarán todas las condiciones',
        text: "Esta seguro de autorizar todo?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#82ED81",
        cancelButtonColor: "#FFA3A4",
        confirmButtonText: "SI",
        cancelButtonText: "NO",
        closeOnConfirm: false,
        closeOnCancel: false
      }).then((result) => {
        if (result.value) {
          $("#tableCondicionesEspeciales tr:gt(0)").each(function (index, element) {
            var id = $(this).find('td').eq(0).html();
            $.ajax({
              type: "POST",
              encoding: "UTF-8",
              url: "../models/RecibosCaja.php",
              async: false,
              dataType: "html",
              error: function (OBJ, ERROR, JQERROR) { },
              beforeSend: function () { },
              data: {
                op: "A_CONDICION_ESPECIAL",
                id: id
              },
              success: function (data) {

              }
            }).fail(function (data) {
              console.log(data);
            });
          });
          Swal.fire('Excelente', 'Condiciones autorizadas con exito', 'success');
          ConsultarCondicionEspecial();
        }
      });
    } else {
      Swal.fire('Oops', 'No hay nada que autorizar', 'error');
    }
  }

}


function ConsultarCondicionLista() {

  var lista = $("#Lista").val();
  let oficina = $("#Oficina").val();

  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/RecibosCaja.php",
    async: true,
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) { },
    beforeSend: function () { },
    data: {
      op: 'S_CONDICION_LISTAS',
      oficina: oficina
    },
    success: function (data) { //console.log(data);
      if (data.length > 0) {
        var tabla = '<table class="form" width="100%" id="">'
          + '<thead>'
          + '<tr>'
          + '<th>LISTA</th>'
          + '<th>DIAS</th>'
          + '<th>%DESCUENTO</th>'
          + '<th>SUJETO PPTO</th>'
          + '<th>OFICINA</th>'
          + '</tr>'
          + '</thead>'
          + '<tbody>';
        var tabla2 = '<table class="form" width="100%" id="tableCondicionesLista">'
          + '<thead>'
          + '<tr>'
          + '<th>LISTA</th>'
          + '<th>DIAS</th>'
          + '<th>%DESCUENTO</th>'
          + '<th>OFICINA</th>'
          + '</tr>'
          + '</thead>'
          + '<tbody>';
        var tabla3 = '<table class="form" width="100%" id="tableCondicionesListaPlazo">'
          + '<thead>'
          + '<tr>'
          + '<th>LISTA</th>'
          + '<th>DIAS</th>'
          + '<th>%DESCUENTO</th>'
          + '<th>OFICINA</th>'
          + '</tr>'
          + '</thead>'
          + '<tbody>';
        var cont = 0;
        var cont2 = 0;
        for (var i = 0; i <= data.length - 1; i++) {

          if (lista == data[i].lista) {
            ArrDctos.push({
              dias: data[i].dias,
              descuento: data[i].descuento,
              tipo: 'ADG'
            })
            if (data[i].sujeto_ppto == 'S') {
              cont++;
              tabla2 += '<tr>'
                + '<td>' + data[i].lista + '</td>'
                + '<td>' + data[i].dias + '</td>'
                + '<td>' + data[i].descuento + '</td>'
                + '<td>' + data[i].oficina_ventas + '</td>'
                + '</tr>';
            } else {
              cont2++;
              tabla3 += '<tr>'
                + '<td>' + data[i].lista + '</td>'
                + '<td>' + data[i].dias + '</td>'
                + '<td>' + data[i].descuento + '</td>'
                + '<td>' + data[i].oficina_ventas + '</td>'
                + '</tr>';
            }

          }
          tabla += '<tr>'
            + '<td>' + data[i].lista + '</td>'
            + '<td>' + data[i].dias + '</td>'
            + '<td>' + data[i].descuento + '</td>'
            + '<td>' + data[i].sujeto_ppto + '</td>'
            + '<td>' + data[i].oficina_ventas + '</td>'
            + '</tr>';


        }
        tabla += '</tbody></table>';
        tabla2 += '</tbody></table>';
        tabla3 += '</tbody></table>';
        $("#dvResultCondicionesEspecialesListas").html(tabla);

        //Condiciones por lista de precios sujetas a cumplimiento de presupuesto de ventas

        if (cont > 0) {
          $("#dvCondicionesDetalleLista").html(tabla2);
        } else {
          $("#dvCondicionesDetalleLista").html(`<div class="alert alert-danger" role="alert">
                                                    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                                                    <span class="sr-only">Error:</span> No tiene condiciones especiales asociadas.
                                                   </div>`);
        }

        //Condiciones por lista de precios sujetas a plazo de pago	
        if (cont2 > 0) {
          $("#dvCondicionesDetalleListaPlazo").html(tabla3);
        } else {
          $("#dvCondicionesDetalleListaPlazo").html(`<div class="alert alert-danger" role="alert">
														<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
														<span class="sr-only">Error:</span> No tiene condiciones especiales asociadas.
													   </div>`);
        }
      } else {
        $("#dvResultCondicionesEspecialesListas, #dvCondicionesDetalleLista").html(`<div class="alert alert-danger" role="alert">
																							<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
																							<span class="sr-only">Error:</span> No hay resultados o no ha seleccionado un cliente.
																					   </div>`);
      }
    }
  }).fail(function (data) {
    console.error(data);
  });
}

function filtroEstado(valor) {
  theTable = $("#tablePlanillas tr:gt(0)");
  theTable.each(function () {
    if (valor == 'T') {
      $(this).show();
    } else if (valor == 'A') {
      if ($(this).find('td').eq(5).html() != '0') {
        $(this).show();
      } else {
        $(this).hide();
      }
    } else if (valor == 'S') {
      if ($(this).find('td').eq(5).html() == '0') {
        $(this).show();
      } else {
        $(this).hide();
      }
    }

  });
}


//*****PARA INFORMES

function ConsultarInformes() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/RecibosCaja.php",
    async: true,
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) { },
    beforeSend: function () {
      LoadImg('CONSULTANDO INFORMACIÓN...');
    },
    data: {
      op: 'S_INFORME_RC',
      fhIni: $("#InfoFhIni").val(),
      fhFin: $("#InfoFhFin").val()
    },
    success: function (resp) {
      console.log({
        resp
      })
      var data = resp['detalle'];
      var data2 = resp['consolidado'];
      if (data.length > 0) {
        //Detalle
        var tabla = `<table class="form" width="100%" id="">
						<thead>
							<tr>
								<th>APRUEBA</th>
								<th>ID_RC</th>
								<th>FECHA/HORA RECIBO</th>
								<th>FECHA/HORA APRUEBA</th>
								<th>EXTEMPORANEO</th>
							</tr>
						</thead>
						<tbody>`;
        for (var i = 0; i <= data.length - 1; i++) {
          var estado = '';
          if (data[i].recibos_extemporaneos == 0) {
            estado = '<button class="btn btn-success btn-sm" type="button"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span></button>';
          } else {
            estado = '<button class="btn btn-danger btn-sm" type="button"><span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span></button>';
          }
          tabla += `<tr>
                       <td>${data[i].usuario_aprueba}</td>
                       <td>${data[i].id_rc}</td>
                       <td>${data[i].fecha_hora}</td>
                       <td>${data[i].fecha_hora_aprobacion}</td>
                       <td>${estado}</td>
                    </tr>`;
        }
        tabla += `</tbody></table>`;
        //Consolidado
        var tabla2 = `<table class="form" width="100%" id="">
						<thead>
                            <tr>
                              <th colspan="4">CONSOLIDADO APLICACIÓN DE RECIBOS</th>
                            </tr>
							<tr>
								<th>APRUEBA</th>
								<th>TOTAL RECIBOS</th>
								<th>TOTAL EXTEMPORANEOS</th>
								<th>% INCUMPLIMIENTO</th>
							</tr>
						</thead>
						<tbody>`;
        var RcTotales = 0;
        var RcExtemporaneos = 0;
        var pluginArrayArg = new Array();
        for (var i = 0; i <= data2.length - 1; i++) {
          var cump = parseInt(data2[i].recibos_extemporaneos) / parseInt(data2[i].recibos_totales) * 100;
          tabla2 += `<tr>
                       <td>${data2[i].usuario_aprueba}</td>
                       <td>${data2[i].recibos_totales}</td>
                       <td>${data2[i].recibos_extemporaneos}</td>
                       <td>${formatNumberES(cump, 2, '%')}</td>
                      </tr>`;
          RcTotales += parseInt(data2[i].recibos_totales);
          RcExtemporaneos += parseInt(data2[i].recibos_extemporaneos);
          //---Para el grafico---------------------------------
          if (data2[i].usuario_aprueba != 'N/A') {
            var dato = new Object();
            dato.name = data2[i].usuario_aprueba;
            dato.y = Math.round(data2[i].recibos_totales);
            pluginArrayArg.push(dato);
          }
          //---Para el grafico---------------------------------

        }
        var cumpTotal = parseInt(RcExtemporaneos) / parseInt(RcTotales) * 100;
        tabla2 += `</tbody>
                     <tfoot>
                      <tr>
						<th></th>
						<th>${RcTotales}</th>
						<th>${RcExtemporaneos}</th>
						<th>${formatNumberES(cumpTotal, 2, '%')}</th>
					  </tr>
                     </tfoot>
                     </table>`;


        var jsonArray = JSON.parse(JSON.stringify(pluginArrayArg));

        $("#dvResultInformes").html(tabla);
        $("#dvResultConsolidado").html(tabla2);
        GenerarGrafico('RECIBOS APROBADOS POR USUARIO', jsonArray);
      } else {
        $("#dvResultInformes").html(`<div class="alert alert-danger" role="alert">
											<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
											<span class="sr-only">Error:</span>  No hay información para las condiciones seleccionadas.
										</div>`);
      }
    }
  }).fail(function (data) {
    UnloadImg();
    console.error(data);
  }).done(function () {
    UnloadImg();
  })

}

function GenerarGrafico(titulo, jsonArray) {
  // Create the chart
  Highcharts.chart('DivGrafico', {
    chart: {
      type: 'column'
    },
    title: {
      text: titulo
    },
    /*subtitle: {
      text: 'Frecuencia de compra mensual '
    },*/
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
        text: 'Numero de recibos'
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

}

const limpiarCompensar = () => {
  $("#fhCompenIni,#fhCompenFin").datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dateFormat: 'yy-mm-dd',
    width: 100,
    heigth: 100
  }).datepicker("setDate", new Date());
  $("#idCompenDoc").val('');
}

const compensarDocumentos = async () => {
  let fhIni = $("#fhCompenIni").val();
  let fhFin = $("#fhCompenFin").val();
  let doc = $("#idCompenDoc").val();
  let mensaje = '';
  if (doc == '') {
    titulo = `Compensación por fechas`;
    mensaje = `Esta seguro de esta operación, esto no se puede reversar?`;
  } else {
    titulo = `Compensación por documento`;
    mensaje = `Esta seguro de esta operación, esto no se puede reversar?`;
  }

  try {
    const data = {
      link: "../models/RecibosCaja.php",
      op: "COMPENSAR_DOCUMENTOS",
      fhIni: fhIni,
      fhFin: fhFin,
      doc: doc
    }
    Swal.fire({
      title: titulo,
      text: mensaje,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#82ED81",
      cancelButtonColor: "#FFA3A4",
      confirmButtonText: "SI",
      cancelButtonText: "NO",
      closeOnConfirm: false,
      closeOnCancel: false
    }).then(async (result) => {
      if (result.value) {
        let resp = await enviarPeticion(data);
        if (resp.estatus) {
          Swal.fire('Excelente!', resp.msg, 'success');
          limpiarCompensar();
        } else {
          Swal.fire('Error!', resp.msg, 'error');
        }
      } else {
        Swal.fire('Correcto!', 'Compensación cancelada', 'warning');
      }
    });

  } catch (e) {
    console.log(e);
  }
}