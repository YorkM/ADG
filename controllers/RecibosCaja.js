let ArrayMulticash = [];
let ArrayMulticashBanco = [];
let ArrCli = [];
let ArrDctos = [];
let arrayLiquidador = [];

// TODO: CONTINUAR AJUSTANDO EL CONTENIDO DE LA MODAL EMAIL ZONAS

// DECLARACIÓN DE FUNCIONES GENERALES
// FUNCIÓN MOSTRAR LOADING
function LoadImg(texto = "Cargando...") {
  let n = 0;

  const html = `
    <img src="../resources/icons/preloader.gif" alt="Cargando..." />
    <figcaption style="font-size: 25px; margin-bottom: 5px; font-weight: bold;">${texto}</figcaption>
    <figcaption id="txtTimer" style="font-weight: bold;">0</figcaption>`;

  const loader = document.getElementById("loaderOverlayRecibo");
  loader.innerHTML = html;
  loader.style.display = "flex";

  window.timerInterval = setInterval(() => {
    if (document.getElementById("txtTimer")) document.getElementById("txtTimer").textContent = ++n;
  }, 1000);
}
// FUNCIÓN DESMONTAR LOADING
function UnloadImg() {
  clearInterval(window.timerInterval);
  const loader = document.getElementById("loaderOverlayRecibo");
  loader.style.display = "none";
  loader.innerHTML = "";
}
// FUNCIÓN CONFIRMAR ALERTA
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
// FUNCIÓN PARA FILTRAR TABLAS
const filtrar = (filtro) => {
  const filas = document.querySelectorAll('#tdPlanillas2 tbody tr');

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll('td');
    const coincide = Array.from(celdas).some(td => td.textContent.toLowerCase().includes(filtro));

    fila.style.display = coincide ? '' : 'none';
  });
}
// FUNCIÓN PARA REALIZAR LIMPIEZA
const limpiarDatos = () => {
  ArrDctos.length = 0;
  arrayLiquidador.length = 0;

  $("#VlrTotalAbono").val(formatNum(0, '$'));
  $("#VlrTotalFacturas").val(formatNum(0, '$'));
  $("#VlrSinAsignar").val(formatNum(0, '$'));

  $('#tdPlanillas tbody').html("");
  $('#contenedorTablasLiquidador').html("");
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

    if (claseDoc === "DZ" && importe < 0) {
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

    const titulo = document.createElement("h5");
    titulo.classList.add('text-center');
    titulo.classList.add('text-green');
    titulo.textContent = `LIQUIDACIÓN A ${dias} DÍAS`;
    contenedor.appendChild(titulo);

    const tabla = document.createElement("table");
    tabla.setAttribute('id', `tabla${count}`);
    tabla.classList.add('table');
    tabla.classList.add('table-bordered');
    tabla.classList.add('table-hover');
    tabla.classList.add('table-sm');
    tabla.classList.add('table-liquidador');
    tabla.style.width = "100%";

    const cardContenedor = document.createElement('div');
    cardContenedor.classList.add('custom-card');
    cardContenedor.style.width = '98%';
    cardContenedor.style.margin = '12px auto';

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
    thead.classList.add('table-info');
    const encabezado = `
      <tr>
        <th class="size-th">DOC</th>
        <th class="size-th">REFERENCIA</th>
        <th class="size-th">CLASE</th>
        <th class="size-th">FECHA</th>
        <th class="size-th">FECHA VENC.</th>
        <th class="size-th">V FACT.</th>
        <th class="size-th">BASE PP</th>
        <th class="size-th">DÍAS</th>
        <th class="size-th">% DESC.</th>
        <th class="size-th">V DESC.</th>
        <th class="size-th">V PAGAR</th>
        <th class="size-th">OBSER.</th>
        <th class="size-th">ELIMINAR</th>
      </tr>`;
    thead.innerHTML = encabezado;
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    grupo.forEach(item => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td class="size-text vertical">${item.numeroDoc}</td>
        <td class="size-text vertical">${item.referencia}</td>
        <td class="size-text vertical">${item.claseDoc}</td>
        <td class="size-text vertical">${item.fechaFactura}</td>
        <td class="size-text vertical">${item.fechaVencimientoFactura}</td>
        <td class="size-text vertical">${formatNum(item.importe, "$")}</td>
        <td class="size-text vertical">${formatNum(item.basePP, "$")}</td>
        <td class="size-text vertical">${item.dias}</td>
        <td class="size-text vertical">${item.porcentajeDescuento}%</td>
        <td class="size-text vertical">${formatNum(item.valorDescuento, "$")}</td>
        <td class="size-text vertical">${formatNum(item.valorPagar, "$")}</td>
        <td class="size-text vertical td-text"><input type="text" maxlength="25" class="form-control input-sm input-obser"></td>
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
    tfoot.classList.add('table-info')
    const totales = `
      <tr>
        <th colspan="5" class="size-th" style="text-align: center;">TOTALES</th>
        <th class="size-th">${formatNum(totalImporte, "$")}</th>
        <th class="size-th">${formatNum(totalBasePP, "$")}</th>
        <th class="size-th"></th>
        <th class="size-th"></th>
        <th class="size-th">${formatNum(totalDescuento, "$")}</th>
        <th class="size-th">${formatNum(totalPagar, "$")}</th>
        <th class="size-th"></th>
        <th class="size-th"></th>
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
      if (!arrayLiquidador.length) $('#contenedorTablasLiquidador').html(`<p class="lead text-center">No hay documentos agregados al liquidador</p>`);
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
  const { 
    BASE_PP, 
    CLASE_DOCUMENTO, 
    FECHA_BASE, 
    IMPORTE, 
    NUMERO_DOCUMENTO, 
    REFERENCIA, 
    REFERENCIA_FACTURA 
  } = item;

  const basePP = parseFloat(BASE_PP);
  const importe = parseFloat(IMPORTE);
  const claseDoc = CLASE_DOCUMENTO.trim();
  const FB = FECHA_BASE.split("-");
  const fechaFactura = `${FB[2]}/${FB[1]}/${FB[0]}`;

  const descuentosFiltrados = ArrDctos.filter((obj, index, self) =>
    index === self.findIndex(o =>
      o.dias === obj.dias &&
      o.descuento === obj.descuento &&
      o.tipo === obj.tipo
    )
  );

  descuentosFiltrados.forEach(item => {
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

// FUNCIÓN PERMISOS DE ACCESOS DIRECTOS
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
// FUNCIÓN PARA ACTUALIZAR ELEMENTOS SEGÚN PERMISOS
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
// FUNCIÓN PARA FILTRAR EL ARRAY DE CLIENTES
function FiltrarCli(expr, ArrayCli, op) {
  expresion = new RegExp(expr, "i");
  switch (parseInt(op)) {
    case 1:
      filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.codigo_sap));
      if (filtro.length == 0) {
        filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.nit));
      }
      if (filtro.length == 0) {
        filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.telefonos));
      }
      break;
    case 2:
      filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.nombres));
      if (filtro.length == 0) {
        filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.razon_comercial));
      }
      break;
  }
  return filtro;
}
// FUNCIÓN PARA VALIDAR DOCUMENTO
function ValidarDocumento(valor) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/RecibosCaja.php",
    dataType: "json",
    async: true,
    beforeSend: function () {
      LoadImg('Consultanto información...');
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
// FUNCIÓN PARA CARGAR LOS CLIENTES
function LoadArrayCli() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/RecibosCaja.php",
    dataType: "json",
    async: true,
    beforeSend: function () {
      LoadImg('Cargando clientes...');
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
// FUNCIÓN CONDICIONES DE DESCUENTOS
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
      var tabla = '<table class="table table-bordered table-hover table-sm" style="width: 100%;" id="tableCondicionesDcto">'
        + '<thead class="table-info">'
        + '<tr class="size-th">'
        + '<th class="size-th">CODIGO</th>'
        + '<th class="size-th">SOCIEDAD</th>'
        + '<th class="size-th">DIAS</th>'
        + '<th class="size-th">DESCUENTO</th>'
        + '<th class="size-th">TIPO</th>'
        + '<th class="size-th">SUJETO CUMPLIMIENTO</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>';
      for (var i = 0; i <= data.length - 1; i++) {
        tabla += '<tr>'
          + '<td class="size-text vertical">' + data[i].codigo_sap + '</td>'
          + '<td class="size-text vertical">' + data[i].sociedad + '</td>'
          + '<td class="size-text vertical">' + data[i].dias + '</td>'
          + '<td class="size-text vertical">' + data[i].descuento + '</td>'
          + '<td class="size-td vertical">' + data[i].tipo + '</td>'
          + '<td class="size-td vertical">' + data[i].sujeto_cump + '</td>'
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
// FUNCIÓN PARA LISTAR LAS ZONAS EMAIL
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
      var tabla = '<table class="table table-bordered table-hover table-sm" width="100%" id="tableZonaEmail">'
        + '<thead class="table-info">'
        + '<tr>'
        + '<th class="size-th">ZONA</th>'
        + '<th class="size-th">DESCRIPCION</th>'
        + '<th class="size-th">EMAIL</th>'
        + '<th class="size-th text-center">ELIMINAR</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>';
      for (var i = 0; i <= data.length - 1; i++) {
        tabla += '<tr>'
          + '<td class="size-text vertical">' + data[i].ZONA_VENTAS + '</td>'
          + '<td class="size-td vertical">' + data[i].ZONA_DESCRIPCION + '</td>'
          + '<td class="size-text vertical">' + data[i].EMAIL + '</td>'
          + '<td class="text-center">'
          + '<button class="btn btn-outline-danger btn-sm" onclick="DelZonaEmail(\'' + data[i].ZONA_VENTAS + '\')">'
          + '<i class="fa-solid fa-trash-can"></i>'
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
// FUNCIÓN CONSULTAR ZONAS
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
// FUNCIÓN PARA ELIMINAR UNA ZONA EMAIL
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
// FUNCIÓN PARA AGREGAR UNA ZONA EMAIL
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
// FUNCIÓN PARA SUBIR CASH
function SubirCash() {
  $("#tdImportCash tr:gt(0)").each(function (index, element) {
    const objTD = $(this).find('td');

    const Cuenta = objTD.eq(0).text();
    const Numero = objTD.eq(1).text();
    const Importe = unformatNum(objTD.eq(2).text());
    const Texto = objTD.eq(3).text();
    const FechaC = objTD.eq(4).text();
    const FechaV = objTD.eq(5).text();
    const Ref = objTD.eq(6).text();
    
    $.ajax({
      type: "POST",
      url: "../models/RecibosCaja.php",
      global: false,
      beforeSend: function () {
        LoadImg('Subiendo multicash...');
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
// FUNCIÓN PARA CONSULTAR EL MULTICASH
function ConsultarMulticash() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/RecibosCaja.php",
    global: false,
    beforeSend: function () {
      LoadImg('Consultando multicash...');
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
      if (data.length) {
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
      LoadImg('Consultando multicash...');
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

      $('#cantBancos').text(resultado.length);

      if (resultado.length) {
        resultado.forEach((item, index) => {
          elementos += `
            <tr>
              <td class="size-text no-wrap vertical">${index + 1}</td>
              <td class="size-text no-wrap vertical">${item.cuenta}</td>
              <td class="size-td no-wrap vertical">${item.descripcion}</td>
              <td class="size-text no-wrap vertical">${item.numero}</td>
              <td class="size-text no-wrap vertical">${formatNum(item.valor, "$")}</td>
              <td class="size-text no-wrap vertical">${item.fecha_cont}</td>
              <td class="size-text no-wrap vertical">${item.referencia}</td>
              <td class="size-text no-wrap vertical">${item.codigo_sap}</td>
              <td class="size-td no-wrap vertical">
                <p class="m-0">${item.nombres}</p>
                <p class="size-10 text-primary m-0">${item.razon_comercial}</p>
              </td>
              <td class="size-td no-wrap vertical">${item.bodega_desc.split(' ')[1]}</td>
              <td class="size-text no-wrap vertical">${item.zona_ventas}</td>
              <td class="size-td no-wrap vertical">${item.zona_descripcion}</td>
              <td class="size-td no-wrap vertical">${item.condicion_pago}</td>
              <td class="text-center vertical">
                <button class="btn btn-primary btn-sm observacion" data-id='${JSON.stringify(item)}'>
                  <i class="fa-solid fa-paper-plane"></i>                                                                     
                </button>
              </td>
            </tr>`;
        });

        $('#tdPlanillas2 tbody').html(elementos);

        $('#tdPlanillas2').off().on('click', '.observacion', function () {
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
              const coincidencia2 = ArrayMulticashBanco.find(item => item.referencia.trim() === valorBuscado);
              if (coincidencia2) {
                $('#filtro')
                  .val(coincidencia2.item_busqueda)
                  .data('ui-autocomplete')._trigger('select', null, { item: coincidencia2 });

                $('#MultiDay').val(MultiDay).trigger('change');
              }
            }, 2000);
          }
        });
      } else $('#tdPlanillas2 tbody').html(`<td class="text-center lead" colspan="14">Multicash no disponible</td>`);
    }
  }).always(function (data) {
    UnloadImg();
  })
    .fail(function (data) {
      console.error(data)
    });
}
// FUNCIÓN FILTRAR ARRAY
function FiltrarArray(expr, ArrayMulticash) {
  const expresion = new RegExp(expr, "i");
  const filtro = ArrayMulticash.filter(ArrayMulticash => expresion.test(ArrayMulticash.item_busqueda));
  return filtro;
}
// FUNCIÓN VALIDAR NÚMERO
function validarSiNumero(numero) {
  let x = 0;
  if (/^([0-9])*$/.test(numero)) x = 1;
  return x;
}
// FUNCIÓN AGREGAR MULTICASH
function AddMulticash(ob) {
  let obj = $(ob).find('td');

  let estado = obj.eq(7).text().trim();
  let cuenta = obj.eq(0).text().trim();
  let num = obj.eq(2).text().trim();
  let valor = obj.eq(3).text().trim();
  let fvalor = obj.eq(6).text().trim();
  let id = obj.eq(9).text().trim();
  let ref = obj.eq(8).text().trim();

  if (estado == 0) {
    AddAbonoCash(cuenta, fvalor, valor, num, id, ref);
    $(ob).find('td').css('background-color', '#51F563');
    obj.eq(7).text(1);
  } else {
    let total = unformatNum($("#VlrTotalAbono").val());
    valor = unformatNum(valor);
    const valorTotalAbono = formatNum(parseFloat(total - parseFloat(valor)), '$');
    $("#VlrTotalAbono").val(valorTotalAbono);
    const vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val())) - parseFloat(unformatNum($("#VlrTotalFacturas").val()));
    $("#VlrSinAsignar").val(formatNum(vasignado, '$'));
    obj.css('background', '#fafafa');
    $(ob).find('td').css('background-color', '#fafafa');
    obj.eq(7).text(0);
    $("#tdBody tr").each(function () {
      if ($(this).attr('id').trim() == id) $(this).remove();
    });
  } 
}
// FUNCIÓN PRINT DIV
function printDiv(nombreDiv) {
  let contenido = document.getElementById(nombreDiv).innerHTML;
  let contenidoOriginal = document.body.innerHTML;
  document.body.innerHTML = contenido;
  window.print();
  document.body.innerHTML = contenidoOriginal;
}
// FUNCIÓN ACTIVAR TAB
function activaTab(btnTab) {
  $(`#${btnTab}`).click();
};
// FUNCIÓN TECLA ENTER
function Enter(ob, tipo) {
  const tecla = ob.keyCode || ob.which;
  if (tecla == 13) {
    switch (tipo) {
      case 'AddAbono':
        AddAbono();
        break;
    }
  }
}
// FUNCIÓN LIMPIAR
function Limpiar() {
  const rol = $("#RolId").val();
  limpiarDatos();

  const camposTexto = [
    "#CodigoSAP", "#Cliente", "#Referencia", "#TextoCabecera", "#TextoCompensacion",
    "#ValorAbono", "#Email", "#EmailZona", "#Grupo", "#DescGrupo", "#Lista", "#Oficina"
  ];
  camposTexto.forEach(id => $(id).val(''));

  const camposFormato = [
    "#VlrTotalAbono", "#VlrTotalFacturas", "#VlrSinAsignar"
  ];
  camposFormato.forEach(id => $(id).val(formatNum(0, '$')));

  $("#tdBody").html('');
  $("#tdDetalleMulticash").html('');

  ["#btnMulticash", "#btnAbonos", "#btnFacturas"].forEach(btn => {
    $(btn).attr("disabled", true);
  });

  if (rol == 14) {
    $("#dvTotalAbono").hide();
    activaTab('btnPlanilla');
    $("#btnEliminarRC, #btnEliminarPDF").hide();
  } else {
    activaTab('btnCliente');
    $("#Cliente").focus();
    $("#btnEliminarRC, #btnEliminarPDF").show();
  }
}
// FUNCIÓN AGREGAR ABONO DESDE CASH
function AddAbonoCash(pcuenta, pfecha, pvalor, id, ref) {
  let cuenta = pcuenta;
  let valor = pvalor;
  let desc = '';
  let fecha = pfecha;
  let total = $("#VlrTotalAbono").val();
  let sw = 0;

  switch (cuenta) {
    case '1105050100':
      desc = 'CAJA VIAJERO';
      break;
    case '1105050108':
      desc = 'CAJA EFECTIVO';
      break;
    case '1105050103':
      desc = 'CHEQUES';
      break;
    case '1110050101':
      desc = 'BANCOLOMBIA';
      break;
    case '1110050501':
      desc = 'BANCO BOGOTA';
      break;
    case '1110050501':
      desc = 'BANCO AGRARIO';
      break;
    case '1110050501':
      desc = 'BANCO BBVA';
      break;
    case '2815050503':
      desc = 'AJUSTE AL PESO';
      break;
    case '1355180501':
      desc = 'IMPUESTO DE INDUSTRIA Y COMERCIO RETENIDO';
      break;
    case '5305350501':
      desc = 'DESCUENTOS COMERCIALES';
      break;
    case '1110050201':
      desc = 'BANCOLOMBIA CORRIENTE';
      break;
  }

  if (cuenta == '2815050503' && parseFloat(unformatNum(valor)) > 1000) sw = 2;

  if (parseFloat(unformatNum(valor)) > 0) {
    $("#tdBody tr").each(function () {
      let c = $(this).find('td').eq(0).html();

      if ((c == '1105050108' || c == '1105050100') && (cuenta == '1105050108' || cuenta == '1105050100')) sw = 1;
      if (c == '2815050503' && cuenta == '2815050503') sw = 1;
    });

    if (sw == 0) {
      let tdBodyHTML = `
      <tr id="${id}">
        <td class="size-text vertical">${cuenta}</td>
        <td class="size-td vertical">${desc}</td>
        <td class="size-text vertical">${valor}</td>
        <td class="size-text vertical">${fecha}</td>
        <td class="size-text vertical">${ref}</td>
        <td class="text-center" onclick="QuitarAbonoCash(this)">
          <button type="button" class="btn btn-outline-danger btn-sm">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
        <td style="display: none;">$0</td>
        <td style="display: none;">$0</td>
      </tr>`;

      $("#tdBody").append(tdBodyHTML);
      const valorTotalAbono = formatNum(parseFloat(unformatNum(valor)) + parseFloat(unformatNum(total)), '$');
      $("#VlrTotalAbono").val(valorTotalAbono);
      $("#ValorAbono").val('');
      $("#ValorAbono").focus();
      let vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val())) - parseFloat(unformatNum($("#VlrTotalFacturas").val()));
      $("#VlrSinAsignar").val(formatNum(vasignado, '$'));
    } else {
      if (sw == 1) Swal.fire('Operacion no permitida!', 'Ya se encuentra asignada la cuenta efectivo,viajero o ajuste al peso', 'error');
      else Swal.fire('Operacion no permitida!', 'El valor de ajuste al peso no puede superar los $1.000', 'error');
      $("#ValorAbono").val('');
      $("#ValorAbono").focus();
    }
  }
}
// FUNCIÓN AGREGAR ABONO
function AddAbono() {
  let cuenta = $("#Cuenta").val();
  let valor = $("#ValorAbono").val();
  let desc = $("#Cuenta option:selected").text();
  let fecha = $("#FechaValor").val();
  let total = $("#VlrTotalAbono").val();
  let sw = 0;
  let tipov = $("#TipoValor").val();

  if (cuenta == '2815050503' && parseFloat(unformatNum(valor)) > 1000) sw = 2;

  if (parseFloat(unformatNum(valor)) <= 1000) {
    $("#tdBody tr").each(function () {
      let c = $(this).find('td').eq(0).html();

      if ((c == '1105050108' || c == '1105050100') && (cuenta == '1105050108' || cuenta == '1105050100')) sw = 1;
      if (c == '2815050503' && cuenta == '2815050503') sw = 1;
    });

    if (sw == 0) {
      if (tipov == 'N') valor = formatNum((parseFloat(unformatNum(valor)) * (-1)), '$');

      let tdBodyHTML = `
      <tr>
        <td class="size-text vertical">${cuenta}</td>
        <td class="size-td vertical">${desc}</td>
        <td class="size-text vertical">${valor}</td>
        <td class="size-text vertical">${fecha}</td>
        <td class="size-text vertical">${cuenta}</td>
        <td class="text-center" onclick="QuitarAbono(this)">
          <button type="button" class="btn btn-outline-danger btn-sm" title="Quitar abono">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
        <td style="display: none;">$0</td>
        <td style="display: none;">$0</td>
      </tr>`;
      
      $("#tdBody").append(tdBodyHTML);

      const valorTotalAbono = formatNum(parseFloat(unformatNum(valor)) + parseFloat(unformatNum(total)), "$");

      $("#VlrTotalAbono").val(valorTotalAbono);
      $("#ValorAbono").val('');
      $("#ValorAbono").focus();
      let vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val())) - parseFloat(unformatNum($("#VlrTotalFacturas").val()));
      $("#VlrSinAsignar").val(formatNum(vasignado, '$'));
    } else {
      if (sw == 1) Swal.fire("Operación no permitida", "Ya se encuentra asignada la cuenta efectivo, viajero o ajuste al peso", "error");
      else Swal.fire("Operación no permitida", "El valor de ajuste al peso no puede superar los $1.000", "error");
      $("#ValorAbono").val("");
      $("#ValorAbono").focus();
    }
  } else {
    Swal.fire("Oops!!!", "El valor excede el limite permitido", "error");
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

    fecha = fecha.split("-");
    fecha = new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]));

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

    dias = fechaAbono.getTime() - fechaCrea.getTime();
    dias = (dias / (1000 * 60 * 60 * 24));

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
// FUNCIÓN PARA OBTENER LOS DOCUMENTOS
function Documentos() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    global: false,
    beforeSend: function () {
      LoadImg('Cargando documentos...');
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
            ver = `<img src="../resources/icons/eye.png" style="width: 20px; cursor: pointer;" onclick="VisualizarDocumento('${data[i].REFERENCIA.trim()}', 'F')">`;
          } else {
            ver = '';
          }

          let cumple_img = '';
          let cumple_pres = 'N';
          if (parseFloat(data[i].CUMP_PRESUPUESTO) > 0) {
            cumple_img = `<i class="fa-solid fa-flag text-success"></i>`;
            cumple_pres = 'S';
          }
          detalle +=
            `<tr>
              <td class="no-wrap size-text vertical">${data[i].NUMERO_DOCUMENTO.trim()}</td>
              <td class="no-wrap size-td vertical">${data[i].REFERENCIA.trim()}</td>
              <td class="no-wrap size-td vertical">${data[i].CLASE_DOCUMENTO}</td>
              <td class="no-wrap size-text vertical">${ver}</td>
              <td class="no-wrap size-text vertical">${data[i].FECHA_BASE}</td>
              <td class="no-wrap size-text vertical">${data[i].FECHA_PAGO_GRACIA}</td>
              <td class="no-wrap size-text vertical">${data[i].CONDICION_PAGO}</td>
              <td class="no-wrap size-text vertical" ${mora}>${data[i].DEMORA_GRACIA}</td>
              <td class="no-wrap size-text vertical">${data[i].DIAS}</td>
              <td class="no-wrap size-text vertical">${formatNum(data[i].IMPORTE, '$')}</td>
              <td class="no-wrap size-td vertical">${data[i].TEXTO.trim()}</td>
              <td>
                <input type="text" onKeyPress="return vnumeros(event)" onDblClick="AsignarValor(this);" size="15" class="form-control ClassNumero shadow-sm" onBlur="AddFactura(this, this.value, '${cumple_pres}')" value="$0">
              </td>
              <td>
                <input type="text" onKeyPress="return vnumeros(event)"  size="15" class="form-control ClassNumero shadow-sm" onBlur="AddFactura(this, this.value,  '${cumple_pres}')" disabled value="$0">
              </td>
              <td class="size-text vertical">${formatNum(parseFloat(data[i].BASE_PP), '$')}</td>
              <td style="display:none;">${data[i].DESCUENTO}</td>
              <td class="size-text vertical">${data[i].REFERENCIA_FACTURA}</td>
              <td class="text-center vertical">${cumple_img}</td>
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
        `<table class="table table-bordered table-hover table-sm" style="width: 100%;" id="tdFacturas">
          <thead class="table-info">            
            <tr>
              <th class="size-th no-wrap">DOCUMENTO</th>
              <th class="size-th no-wrap">REF DOC</th>
              <th class="size-th no-wrap">CLASE</th>
              <th class="size-th no-wrap">VER</th>
              <th class="size-th no-wrap">FH BASE</th>
              <th class="size-th no-wrap">FH PAGO</th>
              <th class="size-th no-wrap">CONDICION</th>
              <th class="size-th no-wrap">DEMORA</th>
              <th class="size-th no-wrap">DIA</th>
              <th class="size-th no-wrap">IMPORTE</th>
              <th class="size-th no-wrap">TEXTO</th>
              <th class="size-th no-wrap">VALOR</th>
              <th class="size-th no-wrap">DCTO</th>
              <th class="size-th no-wrap">BASE PP</th>
              <th class="size-th no-wrap">REF FACT</th>
              <th class="size-th no-wrap">CUMP.PRES</th>
              <th class="size-th no-wrap">AGR. FAC.</th>
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
  let rol = $("#RolId").val();

  if (num != 0) {
    if (tipo == 'R') { // Recibos de caja
      if (rol != 14) {
        $("#btnEliminarPDF").show();
      }
      $("#ContainerPDF").html(`<embed src="../../RecibosCaja/${num}.pdf" frameborder="0" width="100%" height="400px">`);
    } else if (tipo == 'F') { // Facturas
      $("#btnEliminarPDF").hide();
      $("#ModalPDFTittle").html('FACTURA DE VENTA');
      $("#ContenidoPDF").html(`<embed src="../resources/tcpdf/Factura.php?num=${parseInt(num)}" frameborder="0" width="100%" height="400px">`);
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
        LoadImg('Creando preliminar...');
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
            LoadImg('Guardando...');
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
            estado = '<i class="fa-solid fa-thumbs-down"></i>';
            color = 'danger';
          } else {
            estado = '<i class="fa-solid fa-thumbs-up"></i>';
            color = 'success';
          }
          detalle += '<tr>'
            + '<td class="size-text no-wrap vertical">' + (i + 1) + '</td>'
            + '<td class="size-text no-wrap vertical">' + data[i].FECHA_HORA + '</td>'
            + '<td class="size-td no-wrap vertical">' + data[i].USUARIO + '</td>'
            + '<td class="size-text no-wrap vertical">' + data[i].CODIGO_SAP + '</td>'
            + '<td class="size-td no-wrap vertical">' + cortarTexto(data[i].NOMBRES, 30) + '</td>'
            + '<td class="size-td no-wrap vertical">' + cortarTexto(data[i].RAZON_COMERCIAL, 30) + '</td>'
            + '<td class="size-text no-wrap vertical">' + data[i].NUMERO + '</td>'
            + '<td class="size-text no-wrap vertical">' + formatNum(data[i].VALOR, '$') + '</td>'
            + '<td class="size-text no-wrap vertical">' + formatNum(data[i].DESCUENTO, '$') + '</td>'
            + '<td class="text-center">'
            + '<button class="btn btn-' + color + ' btn-sm" type="button">' + estado + '</button>'
            + '</td>'
            + '<td class="text-center">'
            + '<button type="button" class="btn btn-warning btn-sm" onclick="AbrirRecibo(\'' + data[i].ID_RC + '\',this)">'
            + '<i class="fa-solid fa-bolt"></i>'
            + '</button>'
            + '</td>'
            + '<td style="display:none;">' + data[i].TEXTO_CABECERA + '</td>'
            + '<td style="display:none;">' + data[i].TEXTO_COMPENSACION + '</td>'
            + '<td style="display:none;">' + data[i].TEXTO_REFERENCIA + '</td>'
            + '<td class="text-center">'
            + '<button type="button" class="btn btn-primary btn-sm" onclick="PDFRecibo(\'' + data[i].ID_RC + '\',this)">'
            + '<i class="fa-solid fa-file-pdf"></i>'
            + '</button>'
            + '</td>'
            + '<td style="display:none;">' + data[i].ADJUNTO + '</td>'
            + '<td class="size-td no-wrap vertical">' + data[i].ZONA_VENTAS + '</td>'
            + '<td class="size-text no-wrap vertical">' + data[i].ID_RC + '</td>'
            + '<td style="display:none;">' + data[i].EMAIL + '</td>'
            + '<td style="display:none;">' + data[i].EMAIL_ZONA + '</td>'
            + '<td style="display:none;">' + data[i].USUARIO_APRUEBA + '</td>'
            + '<td style="display:none;">' + data[i].FECHA_HORA_APROBACION + '</td>'
            + '</tr>';
          total += parseFloat(data[i].VALOR);
          desc += parseFloat(data[i].VALOR);
          cont++;

        }
        var tabla = '<table class="table table-bordered table-hover table-sm" width="100%" id="tablePlanillas">'
          + '<thead class="table-info">'
          + '<tr>'
          + '<th class="size-th nowrap">N°</th>'
          + '<th class="size-th nowrap">FECHA/HORA</th>'
          + '<th class="size-th nowrap">USUARIO</th>'
          + '<th class="size-th nowrap">CODIGO</th>'
          + '<th class="size-th nowrap">NOMBRES</th>'
          + '<th class="size-th nowrap">RAZON</th>'
          + '<th class="size-th nowrap">NUMERO</th>'
          + '<th class="size-th nowrap">VALOR</th>'
          + '<th class="size-th nowrap">DESCUENTO</th>'
          + '<th class="size-th nowrap">ESTADO</th>'
          + '<th class="size-th nowrap">GESTIONAR</th>'
          + '<th class="size-th nowrap">PDF</th>'
          + '<th class="size-th nowrap">ZONA VENTAS</th>'
          + '<th class="size-th nowrap">ID</th>'
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
          + '<i class="fa-solid fa-circle-exclamation"></i>'
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
  $('#dvReciboCajaPDF').html(`<embed src="../resources/tcpdf/Recibos.php?numero=${num}&email=sistemas@multidrogas.com&tipo=R" frameborder="0" width="100%" height="400px">`);
  $("#dvPDFRecibo").modal("show");
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
          + '<i class="fa-solid fa-circle-exclamation"></i>'
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
        var tabla = '<table class="table table-bordered table-hover table-sm" width="100%" id="">'
          + '<thead class="table-info">'
          + '<tr>'
          + '<th class="size-th">LISTA</th>'
          + '<th class="size-th">DIAS</th>'
          + '<th class="size-th">% DESCUENTO</th>'
          + '<th class="size-th">SUJETO PPTO</th>'
          + '<th class="size-th">OFICINA</th>'
          + '</tr>'
          + '</thead>'
          + '<tbody>';
        var tabla2 = '<table class="table table-bordered table-hover table-sm" width="100%" id="tableCondicionesLista">'
          + '<thead class="table-info">'
          + '<tr>'
          + '<th class="size-th">LISTA</th>'
          + '<th class="size-th">DIAS</th>'
          + '<th class="size-th">% DESCUENTO</th>'
          + '<th class="size-th">OFICINA</th>'
          + '</tr>'
          + '</thead>'
          + '<tbody>';
        var tabla3 = '<table class="table table-bordered table-hover table-sm" width="100%" id="tableCondicionesListaPlazo">'
          + '<thead class="table-info">'
          + '<tr>'
          + '<th class="size-th">LISTA</th>'
          + '<th class="size-th">DIAS</th>'
          + '<th class="size-th">% DESCUENTO</th>'
          + '<th class="size-th">OFICINA</th>'
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
                + '<td class="size-text vertical">' + data[i].lista + '</td>'
                + '<td class="size-text vertical">' + data[i].dias + '</td>'
                + '<td class="size-text vertical">' + data[i].descuento + '</td>'
                + '<td class="size-text vertical">' + data[i].oficina_ventas + '</td>'
                + '</tr>';
            } else {
              cont2++;
              tabla3 += '<tr>'
                + '<td class="size-text vertical">' + data[i].lista + '</td>'
                + '<td class="size-text vertical">' + data[i].dias + '</td>'
                + '<td class="size-text vertical">' + data[i].descuento + '</td>'
                + '<td class="size-text vertical">' + data[i].oficina_ventas + '</td>'
                + '</tr>';
            }

          }
          tabla += '<tr>'
            + '<td class="size-text vertical">' + data[i].lista + '</td>'
            + '<td class="size-text vertical">' + data[i].dias + '</td>'
            + '<td class="size-text vertical">' + data[i].descuento + '</td>'
            + '<td class="size-text vertical">' + data[i].sujeto_ppto + '</td>'
            + '<td class="size-text vertical">' + data[i].oficina_ventas + '</td>'
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
                                                    <i class="fa-solid fa-circle-exclamation"></i>
                                                    <span class="sr-only">Error:</span> No tiene condiciones especiales asociadas.
                                                   </div>`);
        }

        //Condiciones por lista de precios sujetas a plazo de pago	
        if (cont2 > 0) {
          $("#dvCondicionesDetalleListaPlazo").html(tabla3);
        } else {
          $("#dvCondicionesDetalleListaPlazo").html(`<div class="alert alert-danger" role="alert">
														<i class="fa-solid fa-circle-exclamation"></i>
														<span class="sr-only">Error:</span> No tiene condiciones especiales asociadas.
													   </div>`);
        }
      } else {
        $("#dvResultCondicionesEspecialesListas, #dvCondicionesDetalleLista").html(`<div class="alert alert-danger" role="alert">
																							<i class="fa-solid fa-circle-exclamation"></i>
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

async function ConsultarInformes() {
  try {
    LoadImg('Consultando información...');
    const resp = await enviarPeticion({
      op: "S_INFORME_RC",
      link: "../models/RecibosCaja.php",
      fhIni: $("#InfoFhIni").val(),
      fhFin: $("#InfoFhFin").val()
    });

    let data = resp.detalle;
    let data2 = resp.consolidado;

    if (data.length) {
      let tabla = `
      <table class="table table-bordered table-hover table-sm" style="width: 49%;">
        <thead class="table-info">
          <tr>
            <th class="size-th">APRUEBA</th>
            <th class="size-th">ID_RC</th>
            <th class="size-th">FECHA/HORA RECIBO</th>
            <th class="size-th">FECHA/HORA APRUEBA</th>
            <th class="size-th">EXTEMPORANEO</th>
          </tr>
        </thead>
        <tbody>`;

      data.forEach(item => {
        let estado = '';
        if (item.recibos_extemporaneos == 0) {
          estado = '<button class="btn btn-success btn-sm" type="button"><i class="fa-solid fa-thumbs-up"></i></button>';
        } else {
          estado = '<button class="btn btn-danger btn-sm" type="button"><i class="fa-solid fa-thumbs-down"></i></button>';
        }

        tabla += `
        <tr>
          <td class="size-text vertical">${item.usuario_aprueba}</td>
          <td class="size-text vertical">${item.id_rc}</td>
          <td class="size-text vertical">${(item.fecha_hora) && formatDate(item.fecha_hora)}</td>
          <td class="size-text vertical">${(item.fecha_hora_aprobacion) && formatDate(item.fecha_hora_aprobacion)}</td>
          <td class="size-text vertical text-center">${estado}</td>
        </tr>`;
      });
      tabla += `</tbody></table>`;

      let tabla2 = `
      <h5 class="text-center text-green" style="font-weight: 400;">CONSOLIDADO APLICACIÓN DE RECIBOS</h5>
      <table class="table table-bordered table-hover table-sm" style="width: 100%;">
        <thead class="table-info">
          <tr>
            <th class="size-th">APRUEBA</th>
            <th class="size-th">TOTAL RECIBOS</th>
            <th class="size-th">TOTAL EXTEMPORANEOS</th>
            <th class="size-th">% INCUMPLIMIENTO</th>
          </tr>
        </thead>
        <tbody>`;

      let RcTotales = 0;
      let RcExtemporaneos = 0;
      let pluginArrayArg = [];

      data2.forEach(item => {
        const cump = parseInt(item.recibos_extemporaneos) / parseInt(item.recibos_totales) * 100;
        tabla2 += `
        <tr>
          <td class="size-td vertical">${item.usuario_aprueba}</td>
          <td class="size-text vertical">${item.recibos_totales}</td>
          <td class="size-text vertical">${item.recibos_extemporaneos}</td>
          <td class="size-text vertical">${formatNumberES(cump, 2, '%')}</td>
        </tr>`;

        RcTotales += parseInt(item.recibos_totales);
        RcExtemporaneos += parseInt(item.recibos_extemporaneos);

        if (item.usuario_aprueba != 'N/A') {
          let dato = {};
          dato.name = item.usuario_aprueba;
          dato.y = Math.round(item.recibos_totales);
          pluginArrayArg.push(dato);
        }
      });

      const cumpTotal = parseInt(RcExtemporaneos) / parseInt(RcTotales) * 100;
        tabla2 += `
        </tbody>
        <tfoot class="table-info">
          <tr>
						<th class="size-th">TOTALES</th>
						<th class="size-th">${RcTotales}</th>
						<th class="size-th">${RcExtemporaneos}</th>
						<th class="size-th">${formatNumberES(cumpTotal, 2, '%')}</th>
          </tr>
        </tfoot>
      </table>`;

      const jsonArray = JSON.parse(JSON.stringify(pluginArrayArg));

      $("#dvResultInformes").html(tabla);
      $("#dvResultConsolidado").html(tabla2);
      GenerarGrafico('RECIBOS APROBADOS POR USUARIO', jsonArray);
    } else {
      const msgHtml = `
      <div class="alert alert-danger" role="alert">
        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        <span class="sr-only">Error:</span>  No hay información para las condiciones seleccionadas.
      </div>`;
      $("#dvResultInformes").html(msgHtml);
    }
  } catch (error) {
    console.error(error);
  } finally {
    UnloadImg();
  }
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

function GenerarGrafico(titulo, jsonArray) {
  if (jsonArray.length) {
    Highcharts.chart('DivGrafico', {
      chart: {type: 'column'},
      title: {text: titulo},
      accessibility: {
        announceNewData: {enabled: true}
      },
      xAxis: {type: 'category'},
      yAxis: {
        title: {text: 'Numero de recibos'}
      },
      legend: {enabled: false},
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
    let msgHtml = `<p class="lead text-center">No hay datos para la fecha seleccionada!!!</p>`;
    $('#DivGrafico').html(msgHtml);
  }
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

function cortarTexto(texto, maxLongitud) {
  return texto.length > maxLongitud ? texto.slice(0, maxLongitud) + '...' : texto;
}

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
            + '<td class="size-text">' + ui.item.cuenta + '</td>'
            + '<td class="size-td">' + ui.item.descripcion + '</td>'
            + '<td class="size-text">' + ui.item.numero + '</td>'
            + '<td class="size-text">' + formatNum(ui.item.valor, '$') + '</td>'
            + '<td class="size-text">' + ui.item.texto + '</td>'
            + '<td class="size-text">' + ui.item.fecha_cont + '</td>'
            + '<td class="size-text">' + ui.item.fecha_val + '</td>'
            + '<td class="size-text">' + ui.item.estado + '</td>'
            + '<td class="size-text">' + ui.item.referencia + '</td>'
            + '<td class="size-text">' + ui.item.id + '</td>'
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
  });

  const idRol = parseInt($("#RolId").val());
  if (idRol == 1 || idRol == 26) { // Administrador & contabilidad
    $("#btnAutorizar").show();
    $("#btnCompensaciones").attr("disabled", false);
  } else {
    $("#btnAutorizar").hide();
    $("#btnCompensaciones").attr("disabled", true);
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

  // RESTRICCIÓN DE ACCESO A LA PESTAÑA DE BANCOS 
  if (![17, 48, 72, 73, 1].includes(idRol)) {
    $('#btnBancos').attr("disabled", true);
  }

  // RESTRICCIÓN DE ACCESO A LA PESTAÑA DE LIQUIDADOR
  if (![17, 48, 72, 44, 3, 14, 13, 73, 1].includes(idRol)) {
    $('#btnLiquidador').attr("disabled", true);
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
  });

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

      $("#tdBody").html("");

      $("#CodigoSAP").val(ui.item.codigo_sap);
      $("#Email").val(ui.item.email);
      $("#EmailZona").val(ui.item.email_zona);
      $("#Grupo").val(ui.item.grupo);
      $("#DescGrupo").val(ui.item.desc_grupo);
      $("#Lista").val(ui.item.lista);
      $("#Oficina").val(ui.item.bodega);

      $("#btnAbonos").attr("disabled", false);
      $("#btnFacturas").attr("disabled", false);
      $("#btnMulticash").attr("disabled", false);

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
  
  $("#btnEmailZona").click(function () {
    ConsultarZonas();
    ListarZonasEmail();
    $("#dvEmailZonas").modal("show");
  });
  
  $("#btnCondicionDcto").click(function () {
    if ($("#CodigoSAP").val() != '') $("#dvCondiciones").modal("show");
    else Swal.fire("Error", "Debe seleccionar un cliente!.", "error");
  });
  // BOTONES DE HIPERVINCULO
  actualizarElementoSegunPermisos("0401", "#0401");
  actualizarElementoSegunPermisos("0102", "#0102");

  $("#0401, #0102").click(function () {
    let id = $(this).attr('id');
    let url = '';
    let title = '';

    switch (id) {
      case '0401':
        url = 'CRM.php';
        title = '0401 - CRM';
        break;
      case '0102':
        url = 'ProgramacionCliente.php';
        title = '0102 - PROGRAMACIÓN DE CLIENTE';
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

  $('#btnBancos').click(function () {
    ConsultarMulticashBanco();
  });

  if (!arrayLiquidador.length) $('#contenedorTablasLiquidador').html(`<p class="lead text-center">No hay documentos agregados al liquidador</p>`);
  
  $("#Cliente").on("input", function () {
    this.value = this.value.toUpperCase();
  });
});