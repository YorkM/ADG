let ArrayMulticash = [];
let ArrayMulticashBanco = [];
let ArrCli = [];
let ArrDctos = [];
let arrayLiquidador = [];
const arrayMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const arrayMesesAbrev = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
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
  $('#contenedorTablasLiquidador').html(`<p class="lead text-center">No hay documentos agregados al liquidador</p>`);
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

    const titulo = document.createElement("h6");
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
    tabla.style.marginBottom = "5px";

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
    btnDescargarPDF.innerHTML = 'Descargar PDF';
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
        <th colspan="5" class="size-th-2" style="text-align: center;">TOTALES</th>
        <th class="size-th-2">${formatNum(totalImporte, "$")}</th>
        <th class="size-th-2">${formatNum(totalBasePP, "$")}</th>
        <th class="size-th"></th>
        <th class="size-th"></th>
        <th class="size-th-2">${formatNum(totalDescuento, "$")}</th>
        <th class="size-th-2">${formatNum(totalPagar, "$")}</th>
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
async function obtenerPermisos(modulo) {
  const rol = $("#RolId").val();
  try {
    const data = await enviarPeticion({op: "S_PERMISOS", link: "../models/Notas.php", rol, modulo});
    return (Array.isArray(data) && data.some((d) => d.chck === 'S'));
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN PARA ACTUALIZAR ELEMENTOS SEGÚN PERMISOS
async function actualizarElementoSegunPermisos(modulo, elementoId) {
  const tienePermisos = await obtenerPermisos(modulo);
  const $elemento = $(elementoId);
  if (tienePermisos) $elemento.show();
  else $elemento.hide();
}
// FUNCIÓN PARA FILTRAR EL ARRAY DE CLIENTES
function FiltrarCli(expr, ArrayCli, op) {
  const expresion = new RegExp(expr, "i");
  let filtro = "";
  switch (parseInt(op)) {
    case 1:
      filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.codigo_sap));
      if (filtro.length == 0) filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.nit));
      if (filtro.length == 0) filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.telefonos));
      break;
    case 2:
      filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.nombres));
      if (filtro.length == 0) filtro = ArrayCli.filter(ArrayCli => expresion.test(ArrayCli.razon_comercial));
      break;
  }
  return filtro;
}
// FUNCIÓN PARA VALIDAR DOCUMENTO
async function ValidarDocumento(valor) {
  if (valor.substring(0, 3) === "000") {
    Swal.fire("Oops!!!", "El valor ingresado no es válido", "error");
    return;
  }

  try {
    LoadImg("Consultanto información...");
    const data = await enviarPeticion({ op: "B_DOCUMENTO_RC", link: "../models/RecibosCaja.php", documento: valor });
    if (data.length) {
      Swal.fire("Oops", `El documento esta comprometido en el recibo #${data[0].ID_RC}, tomado por el usuario ${data[0].USUARIO}`, "error");
    } else {
      Swal.fire("Excelente!", "El documento se encuentra disponible", "info");
    }
  } catch (error) {
    console.error(error);
  } finally {
    UnloadImg();
  }
}
// FUNCIÓN PARA CARGAR LOS CLIENTES
async function LoadArrayCli() {
  try {
    LoadImg('Cargando clientes...');
    const data = await enviarPeticion({op: "B_CLIENTE_RC", link: "../models/RecibosCaja.php"});
    if (data.length) {
      data.forEach(item => {
        let obj = {
            value: `${item.nombres} | ${item.razon_comercial}`,
            nombres: item.nombres,
            razon_comercial: item.razon_comercial,
            codigo_sap: item.codigo_sap.trim(),
            nit: item.nit.trim(),
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
            institucional: item.institucional,
            email_zona: item.email_zona,
            grupo: item.grupo,
            desc_grupo: item.desc_grupo,
            zona_ventas: item.zona_ventas,
            zona_descripcion: item.zona_descripcion
          }
          ArrCli.push(obj);
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    UnloadImg();
  }
}
// FUNCIÓN CONDICIONES DE DESCUENTOS
async function CondicionesDcto() {
  const codigo = $("#CodigoSAP").val();
  const sociedad = $("#Sociedad").val();
  try {
    const data = await enviarPeticion({op: "S_COND_DCTO", link: "../models/RecibosCaja.php", codigo, sociedad});
    if (data.length) {
      let tabla = `
      <table class="table table-bordered table-hover table-sm" style="width: 100%;" id="tableCondicionesDcto">
        <thead class="table-info">
          <tr class="size-th">
            <th class="size-th">CODIGO</th>
            <th class="size-th">SOCIEDAD</th>
            <th class="size-th">DIAS</th>
            <th class="size-th">DESCUENTO</th>
            <th class="size-th">TIPO</th>
            <th class="size-th">SUJETO CUMPLIMIENTO</th>
          </tr>
        </thead>
        <tbody>`;

      data.forEach(item => {
        tabla += `
        <tr>
          <td class="size-text vertical">${item.codigo_sap}</td>
          <td class="size-text vertical">${item.sociedad}</td>
          <td class="size-text vertical">${item.dias}</td>
          <td class="size-text vertical">${item.descuento}</td>
          <td class="size-td vertical">${item.tipo}</td>
          <td class="size-td vertical">${item.sujeto_cump}</td>
        </tr>`;

        ArrDctos.push({ dias: item.dias, descuento: item.descuento, tipo: item.tipo });
      });

      tabla += `</tbody></table>`;
      $("#dvCondicionesDetalle").html(tabla);
    }
  } catch (error) {
    console.error(error);
  } 
}
// FUNCIÓN PARA LISTAR LAS ZONAS EMAIL
async function ListarZonasEmail() {
  try {
    const data = await enviarPeticion({op: "S_ZONAS_EMAIL", link: "../models/RecibosCaja.php"});
    if (data.length) {
      let tabla = `
      <table class="table table-bordered table-hover table-sm" width="100%" id="tableZonaEmail">
        <thead class="table-info">
          <tr>
            <th class="size-th">ZONA</th>
            <th class="size-th">DESCRIPCIÓN</th>
            <th class="size-th">EMAIL</th>
            <th class="size-th text-center">ELIMINAR</th>
          </tr>
        </thead>
        <tbody>`;

      data.forEach(item => {
        tabla += `
        <tr>
          <td class="size-text vertical">${item.ZONA_VENTAS}</td>
          <td class="size-td vertical">${item.ZONA_DESCRIPCION}</td>
          <td class="size-text vertical">${item.EMAIL}</td>
          <td class="text-center">
            <button class="btn btn-outline-danger btn-sm" onclick="DelZonaEmail('${item.ZONA_VENTAS}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>`;
      });

      tabla += `</tbody></table>`;
      $("#dvResultZonasEmail").html(tabla);
    }
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN CONSULTAR ZONAS
async function ConsultarZonas() {
  try {
    const data = await enviarPeticion({op: "S_ZONAS_VENTA", link: "../models/PW-SAP.php", sw: 1});
    if (data.length) {
      let zonas = "";
      data.forEach(item => zonas += `<option value="${item.zona}">${item.zona} - ${item.descripcion}</option>`);
      $("#slcZonaEmail").html(zonas);
    }
  } catch (error) {
    console.log(error);
  }
}
// FUNCIÓN PARA ELIMINAR UNA ZONA EMAIL
async function DelZonaEmail(zona) {
  const result = await confirmAlert("Eliminar email de zona", `¿Realmente desea eliminar la zona: ${zona}?`);
  if (result.isConfirmed) {
    try {
      await enviarPeticion({op: "D_ZONA_EMAIL", link: "../models/RecibosCaja.php", zona});
      Swal.fire('Excelente', 'Zona eliminada con éxito', 'success');
      ListarZonasEmail();
    } catch (error) {
      console.error(error);
    }
  }
}
// FUNCIÓN PARA AGREGAR UNA ZONA EMAIL
async function AddZonaEmail() {
  let email = $("#txtZonaEmail").val();
  let zona = $("#slcZonaEmail").val();
  let sw = 0;
  
  if (email !== "") {
    $("#tableZonaEmail tr:gt(0)").each(function () {
      let tdzona = $(this).find('td').eq(0).text().trim();
      if (zona == tdzona) sw = 1;
    });

    if (sw === 1) {
      const result = await confirmAlert("Actualización de zona", "Ésta zona ya tiene un correo asociado... ¿Desea actualizarlo?");
      if (result.isConfirmed) {
        try {
          await enviarPeticion({op: "U_ZONA_EMAIL", link: "../models/RecibosCaja.php", email, zona});
          Swal.fire("Excelente", "Zona actualizada con éxito", "success");
          ListarZonasEmail();          
        } catch (error) {
          console.error(error);
        }
      }    
    } else {
      try {
        const data = await enviarPeticion({op: "I_ZONA_EMAIL", link: "../models/RecibosCaja.php", email, zona});
        Swal.fire("Excelente", "Zona agregada con éxito", "success");
        ListarZonasEmail();
      } catch (error) {
        console.error(error);
      }
    }
  } else {
    Swal.fire('Error', 'Debe ingresar un mail válido', 'error');
  }
}
// FUNCIÓN PARA SUBIR CASH
async function SubirCash() {
  $("#tdImportCash tr:gt(0)").each(async function () {
    const objTD = $(this).find('td');

    const Cuenta = objTD.eq(0).text();
    const Numero = objTD.eq(1).text();
    const Importe = unformatNum(objTD.eq(2).text());
    const Texto = objTD.eq(3).text();
    const FechaC = objTD.eq(4).text();
    const FechaV = objTD.eq(5).text();
    const Ref = objTD.eq(6).text();

    try {
      LoadImg("Subiendo multicash...");
      const data = await enviarPeticion({
        op: 'G_MULTICASH',
        link: "../models/RecibosCaja.php",
        Cuenta,
        Numero,
        Importe,
        Texto,
        FechaC,
        FechaV,
        Ref
      });
      
      if (data == 0) {
        Swal.fire("Carga Completa", "La información ha sido subida", "success");
      } else {
        Swal.fire("Oops", "Error al subir datos por favor verificar.", "error");
      }

      $("#tr_det_cash").html("");
      $("#filename").val("");
      $("#dvSubirCash").modal("hide");
    } catch (error) {
      console.error(error);
    } finally {
      UnloadImg();
    }  
  });
}
// FUNCIÓN PARA CONSULTAR EL MULTICASH
async function ConsultarMulticash() {
  const mes = $("#MultiMes").val();
  const anio = $("#MultiAnio").val();
  const dia = $("#MultiDay").val();
  try {
    LoadImg("Consultando multicash...");
    const data = await enviarPeticion({op: 'S_MULTICASH', link: "../models/RecibosCaja.php", Estado: 0, mes, anio, dia});
    if (data.length) {
      ArrayMulticash = [];
      data.forEach(item => {
        let value = `CUENTA: ${item.CUENTA} | ${item.DESCRIPCION.trim()} | REF: ${item.REFERENCIA} | VALOR: ${formatNum(item.VALOR, '$')} | FECHA: ${item.FECHA_VALOR}`;
        let item_busqueda = `${item.CUENTA} ${item.DESCRIPCION.trim()} ${item.NUMERO} ${item.VALOR} ${item.TEXTO} ${item.FECHA_CONTABILIZACION} ${item.FECHA_VALOR} ${item.ESTADO} ${item.REFERENCIA}`;
        let obj = {
          value,
          cuenta: item.CUENTA,
          descripcion: item.DESCRIPCION.trim(),
          numero: item.NUMERO,
          valor: item.VALOR,
          texto: item.TEXTO,
          fecha_cont: item.FECHA_CONTABILIZACION,
          fecha_val: item.FECHA_VALOR,
          estado: item.ESTADO,
          referencia: item.REFERENCIA,
          id: item.ID,
          id_rc: item.ID_RC,
          item_busqueda
        }
        ArrayMulticash.push(obj);
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    UnloadImg();
  }
}
// FUNCIÓN CONSULTAR MULTICASH BANCO
async function ConsultarMulticashBanco() {
  const mes = $("#MultiMes2").val();
  const anio = $("#MultiAnio2").val();
  const dia = $("#MultiDay2").val();
  try {
    LoadImg('Consultando multicash...');
    const data = await enviarPeticion({ op: 'S_MULTICASH', link: "../models/RecibosCaja.php", Estado: 0, mes, anio, dia });
    if (data.length) {
      ArrayMulticashBanco = [];
      data.forEach(item => {
        let value = `CUENTA: ${item.CUENTA} | ${item.DESCRIPCION.trim()} | REF: ${item.REFERENCIA} | VALOR: ${formatNum(item.VALOR, '$')} | FECHA: ${item.FECHA_VALOR}`;
        let item_busqueda = `${item.CUENTA} ${item.DESCRIPCION.trim()} ${item.NUMERO} ${item.VALOR} ${item.TEXTO} ${item.FECHA_CONTABILIZACION} ${item.FECHA_VALOR} ${item.ESTADO} ${item.REFERENCIA}`;
        let obj = {
          value,
          cuenta: item.CUENTA,
          descripcion: $.trim(item.DESCRIPCION),
          numero: item.NUMERO,
          valor: item.VALOR,
          texto: item.TEXTO,
          fecha_cont: item.FECHA_CONTABILIZACION,
          fecha_val: item.FECHA_VALOR,
          estado: item.ESTADO,
          referencia: item.REFERENCIA,
          id: item.ID,
          id_rc: item.ID_RC,
          item_busqueda
        }
        ArrayMulticashBanco.push(obj);
      });

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
  } catch (error) {
    console.error(error);
  } finally {
    UnloadImg();
  }
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
// FUNCIÓN QUITAR ABONO CASH
function QuitarAbonoCash(ob) {
  let total = unformatNum($("#VlrTotalAbono").val());
  let valor = unformatNum($(ob).parent().find('td').eq(2).html());
  let id = $(ob).parent().attr('id');
  
  $("#VlrTotalAbono").val(formatNum(parseFloat(total - parseFloat(valor)), '$'));
  const vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val())) - parseFloat(unformatNum($("#VlrTotalFacturas").val()));
  $("#VlrSinAsignar").val(formatNum(vasignado, '$'));
  $(ob).parent().remove();
  
  $("#tdPlanillas tr").each(function () {
    if ($.trim($(this).find('td').eq(9).html()) == id) {
      $(this).css('background-color', '#fafafa');
      $(this).find('td').eq(7).html(0);
    }
  });
}
// FUNCIÓN QUITAR ABONO
function QuitarAbono(ob) {
  let total = unformatNum($("#VlrTotalAbono").val());
  let valor = unformatNum($(ob).parent().find('td').eq(2).html());
  $("#VlrTotalAbono").val(formatNum(parseFloat(total - parseFloat(valor)), '$'));
  const vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val())) - parseFloat(unformatNum($("#VlrTotalFacturas").val()));
  $("#VlrSinAsignar").val(formatNum(vasignado, '$'));
  $(ob).parent().remove();
}
// FUNCIÓN NOTIFICACIÓN DESCUENTO
function NofificacionDescuento(pcjDesc) {
  showToastr("success", `Descuento de este documento ${pcjDesc}%`, "<strong>DESCUENTOS</strong>");  
}
// FUNCIÓN AGREGAR FACTURA
function AddFactura(ob, valor, cumple_pres) {
  const objTD = $(ob).closest('tr').find('td');

  let NumDoc = objTD.eq(0).text().trim();
  let fechaCrea = objTD.eq(4).text().trim();
  let fechaDoc = objTD.eq(5).text().trim();
  let vlrDoc = unformatNum(objTD.eq(9).text());
  let numAbonos = 0;
  let vlrAbonos = 0;
  let fechaAbono = '';
  let recibeDescuento = 0;

  $("#tdBody tr").each(function () {
    numAbonos ++;
    vlrAbonos = vlrAbonos + parseFloat(unformatNum($(this).find('td').eq(2).text().trim()));
    let fecha = $(this).find('td').eq(3).text().trim();

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
    // CÓDIGO PARA CONDICIONES DE DESCUENTOS ESPECIALES
    fechaDoc = fechaDoc.split("-");
    fechaDoc = new Date(parseInt(fechaDoc[0]), parseInt(fechaDoc[1] - 1), parseInt(fechaDoc[2]));

    fechaCrea = fechaCrea.split("-");
    fechaCrea = new Date(parseInt(fechaCrea[0]), parseInt(fechaCrea[1] - 1), parseInt(fechaCrea[2]));

    dias = fechaAbono.getTime() - fechaCrea.getTime();
    dias = (dias / (1000 * 60 * 60 * 24));

    let pcjDesc = 0;

    // PARAMETROS DE CONDICIONES DE DESCUENTOS ADICIONALES
    // 1. CLIENTE TIPO DROGUERIA GRUPO 100
    // 2. CUMPLIMIENTO DE PRESUPUESTO DE VENTA EN MES FAC
    // 3. DESCUENTO HABILITADO EN PLATAFORMA CON TIPO S
    // 4. SI EL CHECK ESTA ACTIVADO NO SE CALCULA DCTO

    if (!$("#ActivaDcto").is(':checked')) {
      // CONDICIONES SUJETAS A CUMPLIMIENTO DE VENTAS
      $("#tableCondicionesLista tr:gt(0)").each(function () {
        let diasDcto = $(this).find('td').eq(1).text();
        if ($("#Grupo").val().trim() == '100' && cumple_pres == 'S') {
          if (parseInt(dias) <= parseInt(diasDcto)) {
            pcjDesc = parseInt($(this).find('td').eq(2).html());
            recibeDescuento = 1;
            NofificacionDescuento(pcjDesc);
            return false;
          }
        }
      });
      // CONDICIONES ESPECIALES SUJETAS A PLAZO
      if (pcjDesc == 0) {
        $("#tableCondicionesListaPlazo tr:gt(0)").each(function () {
          let diasDcto = $(this).find('td').eq(1).text();
          if ($("#Grupo").val().trim() == '100') {
            if (parseInt(dias) <= parseInt(diasDcto)) {
              pcjDesc = parseInt($(this).find('td').eq(2).text());
              recibeDescuento = 1;
              NofificacionDescuento(pcjDesc);
              return false;
            }
          }
        });
      }
      // CONDICIONES PROPIAS DEL CLIENTE
      if (pcjDesc == 0) {
        $("#tableCondicionesDcto tr:gt(0)").each(function () {
          let diasDcto = $(this).find('td').eq(2).text();
          let SujPres = $(this).find('td').eq(5).text(); // Sujeto a cumplimiento de presupuesto
          if (SujPres == 'S') {
            if ($("#Grupo").val().trim() == '100' && cumple_pres == 'S') {
              if (parseInt(dias) <= parseInt(diasDcto)) {
                if (pcjDesc < parseInt($(this).find('td').eq(3).text())) {
                  pcjDesc = parseInt($(this).find('td').eq(3).text());
                  recibeDescuento = 1;
                  NofificacionDescuento(pcjDesc);
                  return false;
                }
              }
            }
          } else {
            if (parseInt(dias) <= parseInt(diasDcto)) {
              if (pcjDesc < parseInt($(this).find('td').eq(3).text())) {
                pcjDesc = $(this).find('td').eq(3).text();
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

    // AJUSTES MAS RECIENTES PARA CONDICIONES DE DESCUENTOS ESPECIALES
    if (parseInt(vlrDoc) < 0) vlrDoc = vlrDoc * -1;

    if (valor == '') {
      valor = 0;
      $(ob).val(0);
    }

    valor = parseInt(unformatNum(valor));
    if (vlrDoc >= valor || valor == 0 || valor == '') {
      let vtotal = 0;
      $("#tdFacturas tbody tr").each(function () {
        let IdDoc = parseInt(unformatNum($(this).find('td').eq(0).text()));
        let vlrFila = parseInt(unformatNum($(this).find('td').eq(11).find('input').val()));
        let vlrFact = parseInt(unformatNum($(this).find('td').eq(9).text()));
        let TipoDoc = $(this).find('td').eq(2).text().trim();

        if (IdDoc == NumDoc) {
          if ((vlrFact == vlrFila) && (TipoDoc == 'RV' || TipoDoc == 'DZ' || TipoDoc == 'AB')) {
            $(this).find('td').eq(12).find('input').attr('disabled', false);
            if (recibeDescuento == 1) {
              let basePP = unformatNum($(this).find('td').eq(13).text().trim());
              let vlrDesc = 0;
              if (basePP > 0) vlrDesc = Math.round(parseFloat(basePP) * (parseFloat(pcjDesc) / 100));
              $(this).find('td').eq(12).find('input').val(formatNum(vlrDesc, '$'));
            } else {
              $(this).find('td').eq(12).find('input').attr('disabled', true);
              $(this).find('td').eq(12).find('input').val('$0');
            }
          } else {
            $(this).find('td').eq(12).find('input').attr('disabled', true);
            $(this).find('td').eq(12).find('input').val('$0');
          }
        }

        if (vlrFila > 0) $(this).css('background-color', '#8BF4C4');
        else $(this).css('background-color', '');

        let vlrDesc = parseInt(unformatNum($(this).find('td').eq(12).find('input').val()));
        if (vlrFact < 0) vlrFila = (vlrFila - vlrDesc) * -1;
        else vlrFila = (vlrFila - vlrDesc);
        vtotal = vtotal + parseFloat(vlrFila);
      });

      $("#VlrTotalFacturas").val(formatNum(vtotal, '$'));
      const vasignado = parseFloat(unformatNum($("#VlrTotalAbono").val())) - parseFloat(unformatNum($("#VlrTotalFacturas").val()));
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
async function Documentos() {
  const codigo = $("#CodigoSAP").val().trim();
  const org = $("#Sociedad").val();
  try {
    LoadImg('Cargando documentos...');
    const data = await enviarPeticion({op: 'B_CARTERA_RC', link: "../models/CRM.php", codigo, org, tipo: 'S'});
    if (data.length) {
      let detalle = '';
      let total = 0;
      let mora = '';
      let ver = '';
      let cont = 0;
      let vlrMora = 0;

      data.forEach(item => {
        if (parseInt(item.DEMORA_GRACIA) > 0) {
          mora = 'style="background-color: #F77577;"';
          vlrMora = vlrMora + parseFloat(item.IMPORTE);
        } else {
          mora = 'style="background-color: #75F7A8;"';
        }

        if ($.trim(item.CLASE_DOCUMENTO) == 'RV') {
          ver = `<img src="../resources/icons/eye.png" style="width: 20px; cursor: pointer;" onclick="VisualizarDocumento('${item.REFERENCIA.trim()}', 'F')">`;
        } else {
          ver = '';
        }

        let cumple_img = '';
        let cumple_pres = 'N';
        if (parseFloat(item.CUMP_PRESUPUESTO) > 0) {
          cumple_img = `<i class="fa-solid fa-flag text-success"></i>`;
          cumple_pres = 'S';
        }

        detalle +=`
        <tr>
          <td class="no-wrap size-text vertical">${item.NUMERO_DOCUMENTO.trim()}</td>
          <td class="no-wrap size-td vertical">${item.REFERENCIA.trim()}</td>
          <td class="no-wrap size-td vertical">${item.CLASE_DOCUMENTO}</td>
          <td class="no-wrap size-text vertical">${ver}</td>
          <td class="no-wrap size-text vertical">${item.FECHA_BASE}</td>
          <td class="no-wrap size-text vertical">${item.FECHA_PAGO_GRACIA}</td>
          <td class="no-wrap size-text vertical">${item.CONDICION_PAGO}</td>
          <td class="no-wrap size-text vertical" ${mora}>${item.DEMORA_GRACIA}</td>
          <td class="no-wrap size-text vertical">${item.DIAS}</td>
          <td class="no-wrap size-text vertical">${formatNum(item.IMPORTE, '$')}</td>
          <td class="no-wrap size-td vertical" title="${item.TEXTO.trim()}">${cortarTexto(item.TEXTO.trim(), 10)}</td>
          <td><input type="text" onKeyPress="return vnumeros(event)" onDblClick="AsignarValor(this);" size="15" class="form-control ClassNumero shadow-sm" onBlur="AddFactura(this, this.value, '${cumple_pres}')" value="$0"></td>
          <td><input type="text" onKeyPress="return vnumeros(event)"  size="15" class="form-control ClassNumero shadow-sm" onBlur="AddFactura(this, this.value,  '${cumple_pres}')" disabled value="$0"></td>
          <td class="size-text vertical">${formatNum(parseFloat(item.BASE_PP), '$')}</td>
          <td style="display:none;">${item.DESCUENTO}</td>
          <td class="size-text vertical">${item.REFERENCIA_FACTURA}</td>
          <td class="text-center vertical">${cumple_img}</td>
          <td class="text-center">
            <button class="btn btn-primary btn-sm agregar-liquidacion" data-item='${JSON.stringify(item)}'>
              <i class="fa-solid fa-plus"></i>
            </button>
          </td>
        </tr>`;

        total += parseFloat(item.IMPORTE);
        cont++;
      });

      $('#valorTotal').text(formatNum(total, '$'));
      $('#partidas').text(cont);
      $('#valorMora').text(formatNum(vlrMora, '$'));

       let tabla =`
       <table class="table table-bordered table-hover table-sm" style="width: 100%;" id="tdFacturas">
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
        selectAllOnFocus: true,
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
      const msgHtml = `
      <div class="alert alert-danger" role="alert">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span class="sr-only">Error:</span>NO EXISTEN DOCUMENTOS PARA EL CLIENTE SELECCIONADO
      </div>`;
      $("#dvResultCartera").html(msgHtml);
    }
  } catch (error) {
    console.error(error);
  } finally {
    UnloadImg();
    ConsultarMulticash();
  }
}
// FUNCIÓN ASIGNAR VALOR
function AsignarValor(ob) {
  let vlrDoc = unformatNum($(ob).closest('tr').find('td').eq(9).text());
  let vlrAct = unformatNum($(ob).val());

  if (parseInt(vlrDoc) < 0) vlrDoc = parseInt(vlrDoc) * -1;

  if (vlrAct > 0) $(ob).val('$0');
  else $(ob).val(formatNum(vlrDoc, '$'));
}
// FUNCIÓN VISUALIZAR DOCUMENTO
function VisualizarDocumento(num, tipo) {
  let rol = $("#RolId").val();

  if (num != 0) {
    if (tipo == 'R') { // Recibos de caja
      if (rol != 14) $("#btnEliminarPDF").show();
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
// FUNCIÓN ELIMINAR PDF
async function EliminarPDF() {
  let id = $("#txt_id_rc").text().trim();
  let num = $("#txt_num").text().trim();

  if (num == 0) {
    const result = await confirmAlert(`¿Realmente desea eliminar el documento asociado al recibo #${id}?`, "Después de aceptar no podrá reversar la operación");
    if (result.isConfirmed) {
      try {
        const data = await enviarPeticion({op: 'U_RC', link: "../models/RecibosCaja.php", id});
        if (data == 1) {
          Swal.fire('Excelente', 'El documento ha sido eliminado', 'success');
          ConsultarPlanilla();
          $("#ModalPDF").modal("hide");
          $("#dvReciboCaja").modal("hide");
        } else {
          Swal.fire('Error', 'No se pudo eliminar del documento', 'error');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      Swal.fire('Cancelado', 'No se ha realizado ninguna operacion', 'warning');
    }
  } else {
    Swal.fire('Oops', 'No es posible editar el documento de un recibo autorizado', 'error');
  }
}
// FUNCIÓN GUARDAR 
async function Guardar() {
  let codigoSap = $("#CodigoSAP").val().trim();
  if (codigoSap !== '') {
    let cont = 0;
    let documen = [];
    let cuentas = [];
    let vlrAsignar = unformatNum($("#VlrSinAsignar").val());
    let vlrFactura = unformatNum($("#VlrTotalFacturas").val());

    // FACTURAS
    $("#tdFacturas tbody tr").each(function () {
      let vlrFila = parseInt(unformatNum($(this).find('td').eq(11).find('input').val()));
      let vlrDesc = parseInt(unformatNum($(this).find('td').eq(12).find('input').val()));
      let Vlr = parseInt(unformatNum($(this).find('td').eq(9).text().trim()));
      let TipoDoc = $(this).find('td').eq(2).text().trim();
      let ReFact = $(this).find('td').eq(15).text().trim();
      let NumDoc = $(this).find('td').eq(0).text().trim();
      let RefDoc = $(this).find('td').eq(1).text().trim();
      let TipoVal = '';

      if (vlrFila > 0) {
        if (Vlr < 0) TipoVal = 'N';
        else TipoVal = 'P';

        documen.push({
          NumDoc,
          vlrFila,
          vlrDesc,
          RefDoc,
          ReFact,
          TipoDoc,
          TipoVal
        });

        cont++;
      }
    });

    // ABONOS
    $("#tdBody tr").each(function () {
      let Cuenta = $(this).find('td').eq(0).text().trim();
      let Valor = $(this).find('td').eq(2).text().trim();
      let FechaValor = $(this).find('td').eq(3).text().trim();
      let Referencia = $(this).find('td').eq(4).text().trim();
      let Id = $(this).attr('id').trim();

      if (Cuenta !== '') {
        cuentas.push({
          Cuenta,
          Valor: unformatNum(Valor),
          FechaValor,
          Id,
          Tipo: 'ABN',
          Referencia
        });
      }
    });

    // VALIDACIÓN PARA AGREGAR FACTURAS
    if (cont > 0) {
      if (parseFloat(vlrAsignar) >= -1000 && parseFloat(vlrFactura) > 0) {
        // El valor asignado es mayor a cero es porque se hizo abono
        let titulo = '';
        if (parseFloat(vlrAsignar) >= -1000 && parseFloat(vlrAsignar) <= 1000) {
          if (parseFloat(vlrAsignar) == 0) { // Recibo normal
            titulo = '¿Está seguro de generar el recibo de caja?';
          } else { // Con ajuste al peso
            titulo = 'Se detectó ajuste al peso... ¿Está seguro de continuar?';
          }
        } else {
          titulo = 'Se generará saldo a favor... ¿Está seguro de continuar?';
        }

        const result = await confirmAlert(titulo, "Después de aceptar no podrá reversar la operación");
        if (result.isConfirmed) {
          EnviarTMP(cuentas, documen, vlrAsignar, codigoSap);
        } else {
          Swal.fire("Cancelado", "La operacion  ha sido cancelada!", "error");
        }
      } else {
        Swal.fire('Oops', 'La diferencia es demasiado grande para compensar!', 'warning')
      }
    } else {
      Swal.fire('Error', 'No se ha seleccionado ningun documento.', 'error')
    }
  } else {
    Swal.fire('Error', 'Debe cargar un cliente!', 'error');
  }
}
// FUNCIÓN VERIFICAR DOCUMENTO
async function VerificarDocumento(doc) {
  let id_rc = 0;
  try {
    const data = await enviarPeticion({op: 'S_VALIDA_DOC', link: "../models/RecibosCaja.php", doc});
    if (data.length) id_rc = parseInt(data[0].id_rc);
  } catch (error) {
    console.error(error);
  }
  return id_rc; 
}
// FUNCIÓN ENVIAR TMP
async function EnviarTMP(cuentas, documentos, asignados, cliente) {
  let sw = 0;
  documentos.forEach(function (data) {
    sw = VerificarDocumento(data.NumDoc);
    if (sw > 0) return;
  });

  if (sw == 0) {
    const referencia = $.trim($("#Referencia").val());
    const TextoCabecera = $.trim($("#TextoCabecera").val());
    const TextoCompensa = $.trim($("#TextoCompensacion").val());
    const FechaDoc = $.trim($("#FechaDocumento").val());
    const Sociedad = $.trim($("#Sociedad").val());
    try {
      LoadImg('Creando preliminar...');
      const data = await enviarPeticion({
        op: "I_CARTERA_RC",
        link: "../models/RecibosCaja.php",
        cuentas,
        documentos,
        asignados,
        cliente,
        referencia,
        TextoCabecera,
        TextoCompensa,
        FechaDoc,
        Sociedad
      });

      if (data > 0) {
        Swal.fire("Excelente!", `Recibo de caja temporal #${data} creado satisfactoriamente`, "success");
        Limpiar();
        return false;
      } else {
        Swal.fire("Oops!!!", `Error al recibir respuesta:\n ${data}`, "error");
        return false;
      }
    } catch (error) {
      console.error(error);
    } finally {
      UnloadImg();
    }
  } else {
    Swal.fire('Oops!!!', `Uno de los documentos que intenta adicionar está en el recibo #${sw}`, 'error');
  }
}
// FUNCIÓN AUTORIZAR RC
async function AutorizarRC(version) {
  let id = $("#txt_id_rc").text().trim();
  if (id != 0) {
    const result = await confirmAlert(`Realmente desea autorizar el recibo temporal #${id}`, "Después de aceptar no podrá reversar la operación");
    if (result.isConfirmed) {
      try {
        LoadImg('Guardando...');
        const data = await enviarPeticion({link: "../models/WS-RCTMP.php", id, version}); 
        if (data > 0) {
          Swal.fire("Excelente!", `Recibo de caja: ${data} creado satisfactoriamente`, "success");
          EnviarMail(id.trim());
        } else {
          Swal.fire('Oops!!!', `No fue posible enviar el RC... ${data}`, 'error');
        }
        ConsultarPlanilla();
        $("#dvReciboCaja").modal("hide");      
      } catch (error) {
        console.error(error);
      } finally {
        UnloadImg();
      }
    } else {
      Swal.fire("Cancelado", "La operación  ha sido cancelada", "error");
    }    
  } else {
    Swal.fire('Oops!!!', 'No fue posible enviar el RC', 'error');
  }
}
// FUNCIÓN ENVIAR WS
async function EnviarWS(cuentas, documen, asignados, cliente) {
  const referencia = $("#Referencia").val().trim();
  const TextoCabecera = $("#TextoCabecera").val().trim();
  const TextoCompensa = $("#TextoCompensacion").val().trim();
  const FechaDoc = $("#FechaDocumento").val().trim();
  const Sociedad = $("#Sociedad").val().trim();
  try {
    const data = await enviarPeticion({
      link: "../models/WS-RC.php",
      cuentas,
      documen,
      asignados,
      cliente,
      referencia,
      TextoCabecera,
      TextoCompensa,
      FechaDoc,
      Sociedad
    });

    if (data > 0) {
      Swal.fire("Excelente!", `Recibo de caja: ${data} creado satisfactoriamente`, "success");
      Limpiar();
      return false;
    } else {
      Swal.fire("Oops!!!", `Error al recibir respuesta:\n ${data}`, "error");
      return false;
    }
  } catch (error) {
    console.error(error);
  }  
}
// FUNCIÓN CONSULTAR PLANILLA
async function ConsultarPlanilla() {
  const Usr = $("#UsrLogin").val();
  const fhIni = $("#RptFhIni").val();
  const fhFin = $("#RptFhFin").val();
  try {
    const data = await enviarPeticion({op: 'PLANILLA', link: "../models/RecibosCaja.php", fhIni, fhFin, Usr});
    if (data.length) {
      let detalle = '';
      let total = 0;
      let desc = 0;
      let cont = 0;
      let estado = '';
      let color = '';

      data.forEach((item, index) => {
        if (item.ESTADO == 'T') {
          estado = '<i class="fa-solid fa-thumbs-down"></i>';
          color = 'danger';
        } else {
          estado = '<i class="fa-solid fa-thumbs-up"></i>';
          color = 'success';
        }

        detalle += `
        <tr>
          <td class="size-td no-wrap vertical">${(index + 1)}</td>
          <td class="size-td no-wrap vertical">${item.FECHA_HORA}</td>
          <td class="size-12 no-wrap vertical">${item.USUARIO}</td>
          <td class="size-td no-wrap vertical">${item.CODIGO_SAP}</td>
          <td class="size-12 no-wrap vertical">${cortarTexto(item.NOMBRES, 30)}</td>
          <td class="size-12 no-wrap vertical">${cortarTexto(item.RAZON_COMERCIAL, 30)}</td>
          <td class="size-td no-wrap vertical">${item.NUMERO}</td>
          <td class="size-td no-wrap vertical">${formatNum(item.VALOR, '$')}</td>
          <td class="size-td no-wrap vertical">${formatNum(item.DESCUENTO, '$')}</td>
          <td class="text-center"><button class="btn btn-${color} btn-sm" type="button">${estado}</button></td>
          <td class="text-center"><button type="button" class="btn btn-warning btn-sm" onclick="AbrirRecibo('${item.ID_RC}', this)"><i class="fa-solid fa-bolt"></i></button></td>
          <td style="display: none;">${item.TEXTO_CABECERA}</td>
          <td style="display: none;">${item.TEXTO_COMPENSACION}</td>
          <td style="display: none;">${item.TEXTO_REFERENCIA}</td>
          <td class="text-center"><button type="button" class="btn btn-primary btn-sm" onclick="PDFRecibo('${item.ID_RC}', this)"><i class="fa-solid fa-file-pdf"></i></button></td>
          <td style="display: none;">${item.ADJUNTO}</td>
          <td class="size-12 no-wrap vertical">${item.ZONA_VENTAS}</td>
          <td class="size-td no-wrap vertical">${item.ID_RC}</td>
          <td style="display: none;">${item.EMAIL}</td>
          <td style="display: none;">${item.EMAIL_ZONA}</td>
          <td style="display: none;">${item.USUARIO_APRUEBA}</td>
          <td style="display: none;">${item.FECHA_HORA_APROBACION}</td>
        </tr>`;

        total += parseFloat(item.VALOR);
        desc += parseFloat(item.VALOR);
        cont++;
      });

      let tabla = `
      <table class="table table-bordered table-hover table-sm" width="100%" id="tablePlanillas">
        <thead class="table-info">
          <tr>
            <th class="size-th nowrap">N°</th>
            <th class="size-th nowrap">FECHA/HORA</th>
            <th class="size-th nowrap">USUARIO</th>
            <th class="size-th nowrap">CODIGO</th>
            <th class="size-th nowrap">NOMBRES</th>
            <th class="size-th nowrap">RAZON</th>
            <th class="size-th nowrap">NUMERO</th>
            <th class="size-th nowrap">VALOR</th>
            <th class="size-th nowrap">DESCUENTO</th>
            <th class="size-th nowrap">ESTADO</th>
            <th class="size-th nowrap">GESTIONAR</th>
            <th class="size-th nowrap">PDF</th>
            <th class="size-th nowrap">ZONA VENTAS</th>
            <th class="size-th nowrap">ID</th>
          </tr>
        </thead>
        <tbody>
        ${detalle}
        </tbody>
      </table>`;
      $("#dvResultPlanilla").html(tabla);
      $("#TotalRC").val(cont);
    } else {
      const msgHtml = `
      <div class="alert alert-danger" role="alert">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
      </div>`;
      $("#dvResultPlanilla").html(msgHtml);
    }
    
  } catch (error) {
    console.error(error);
    $("#FiltroPlanilla").trigger('keyup');
  }
}
// FUNCIÓN ABRIR RECIBO
async function AbrirRecibo(id, ob) {
  let obj = $(ob).parent().parent().find("td");

  $("#txt_id_rc").text(id);
  $("#txt_num").text((obj.eq(6).text().trim() !== "") ? obj.eq(6).text() : "-");
  $("#txt_codigo").text((obj.eq(3).text().trim() !== "") ? obj.eq(3).text() : "-");
  $("#txt_cliente").text((obj.eq(4).text().trim() !== "") ? obj.eq(4).text() : "-");
  $("#txt_razon").text((obj.eq(5).text().trim() !== "") ? obj.eq(5).text() : "-");

  $("#txt_valor").text((obj.eq(7).text().trim() !== "") ? obj.eq(7).text() : "-");
  $("#txt_cabecera").text((obj.eq(11).text().trim() !== "") ? obj.eq(11).text() : "-");
  $("#txt_compesacion").text((obj.eq(12).text().trim() !== "") ? obj.eq(12).text() : "-");
  $("#txt_referencia").text((obj.eq(13).text().trim() !== "") ? obj.eq(13).text() : "-");

  $("#txt_mail").text((obj.eq(18).text().trim() !== "") ? obj.eq(18).text() : "-");
  $("#txt_mail_zona").text((obj.eq(19).text().trim() !== "") ? obj.eq(19).text() : "-");
  $("#txt_user_aprueba").text((obj.eq(20).text().trim() !== "") ? obj.eq(20).text() : "-");
  $("#txt_fh_aprueba").text((obj.eq(21).text().trim() !== "") ? obj.eq(21).text() : "-");

  let adj = obj.eq(15).text();

  if (adj == 1) {
    $("#tdDocPDF").html(`<img src="../resources/icons/eye.png" class="btn-micro-two" onclick="VisualizarDocumento('${id.trim()}', 'R')">`);
  } else {
    $("#tdDocPDF").html('<input type="file" id="DocPDF" name="DocPDF" class="form-control" accept="application/pdf">');
    $("#DocPDF").change(function () { uploadAjax(); });
  }

  try {
    const data = await enviarPeticion({op: 'S_DETALLE_RC', link: "../models/RecibosCaja.php", id});
    if (data.length) {
      let table = `
      <table class="table table-bordered table-hover table-sm" width="100%">
        <thead class="table-info">
          <tr>
            <th class="size-th no-wrap">ID</th>
            <th class="size-th no-wrap">IMPORTE</th>
            <th class="size-th no-wrap">DESCUENTO</th>
            <th class="size-th no-wrap">CUENTA</th>
            <th class="size-th no-wrap">FECHA VALOR</th>
            <th class="size-th no-wrap">DOCUMENTO</th>
            <th class="size-th no-wrap">DOC REF</th>
            <th class="size-th no-wrap">FAC REF</th>
            <th style="display: none;">C. BENEFICIO</th>
            <th class="size-th no-wrap">TIPO</th>
            <th class="size-th no-wrap">TEXTO</th>
          </tr>
        </thead>
        <tbody>`;

      let dtotal = 0;
      let vtotal = 0;
      let diferencia = 0;

      data.forEach(item => {
        let valor = 0;
        if (item.TIPO == 'C') {
          valor = `<td class="size-text vertical text-danger">(${formatNum(parseFloat(item.IMPORTE), '$')})</td>`;
          vtotal += parseFloat(item.IMPORTE) * -1;
        } else {
          if (item.TIPO_DOC.trim() == 'DA' || item.TIPO_VALOR.trim() == 'N') {
            valor = `<td class="size-text vertical text-danger">(${formatNum(parseFloat(item.IMPORTE), '$')})</td>`;
            vtotal += parseFloat(item.IMPORTE) * -1;
          } else {
            valor = `<td class="size-text vertical">${formatNum(item.IMPORTE, '$')}</td>`;
            vtotal += parseFloat(item.IMPORTE);
          }
        }
        dtotal += parseFloat(item.DESCUENTO);

        table += `
        <tr>
          <td class="size-text vertical no-wrap">${item.ID_RC}</td>${valor}
          <td class="size-text vertical no-wrap text-danger">(${formatNum(item.DESCUENTO, '$')})</td>
          <td class="size-text vertical no-wrap">${item.CUENTA}</td>
          <td class="size-text vertical no-wrap">${item.FECHA_VALOR}</td>
          <td class="size-text vertical no-wrap">${item.DOCUMENTO}</td>
          <td class="size-text vertical no-wrap">${item.REF_DOC}</td>
          <td class="size-text vertical no-wrap">${item.REF_FACT}</td>
          <td class="size-text vertical no-wrap d-none">${item.CENTRO_BENEFICIO}</td>
          <td class="size-text vertical no-wrap">${item.TIPO}</td>
          <td class="size-text vertical no-wrap">${item.TEXTO}</td>
        </tr>`;
      });

      diferencia = vtotal - dtotal;

      table += `
      <tr>
        <td class="size-th"><b>TOTALES</b></td>
        <td class="size-text vertical">${formatNum(vtotal, '$')}</td>
        <td class="size-text vertical">${formatNum(dtotal, '$')}</td>
        <td colspan="8"></td>
      </tr>

      <tr>
        <td class="size-th"><b>DIFERENCIA</b></td>
        <td class="size-text vertical" colspan="2">${formatNum(diferencia, '$')}</td>
        <td colspan="7"></td>
      </tr>
      
      </tbody></table>`;        

      $("#tr_det").html(table);
      $("#ContainerPDF").html('');
      $("#dvReciboCaja").modal("show");
    }
  } catch (error) {
    console.error(error);
  }  
}
// FUNCIÓN ELIMINAR RC
async function EliminarRC() {
  let id = parseInt($("#txt_id_rc").text()).trim();
  let num = parseInt($("#txt_num").text()).trim();

  const result = await confirmAlert(`Realmente desea eliminar el recibo temporal #${id}`, "Después de aceptar no podrá reversar la operación");
  if (result.isConfirmed) {
    if (num == 0) {
      try {
        const data = await enviarPeticion({op: "D_RC", link: "../models/RecibosCaja.php", id});
        if (data == 0) {
          Swal.fire('Excelente', 'Recibo temporal eliminado', 'success');
        } else {
          Swal.fire('Oops!!!', 'No fue posible eliminar el RC', 'error');
        }
        ConsultarPlanilla();
        $("#dvReciboCaja").modal("hide");
      } catch (error) {
        console.error(error);
      }
    } else {
      Swal.fire('Oops...', 'No es posible eliminar un RC ya aplicado.', 'error');
    }
  }
}
// FUNCIÓN VER PDF RECIBO
function PDFRecibo(num) {
  const src = "../resources/tcpdf/Recibos.php";
  const email = "sistemas@multidrogas.com";
  const urlTemplate = `<embed src="${src}?numero=${num}&email=${email}&tipo=R" frameborder="0" width="100%" height="400px">`;
  $('#dvReciboCajaPDF').html(urlTemplate);
  $("#dvPDFRecibo").modal("show");
}
// FUNCIÓN ENVIAR EMAIL
async function EnviarMail(numero) {
  let email = '';
  if ($("#txt_mail_zona").text().trim() !== '') email = $("#txt_mail_zona").text().trim();

  if ($("#txt_mail").text().trim() !== '') {
    if (email != '') email += ';' + $("#txt_mail").text().trim();
    else email = $("#txt_mail").html().trim();
  }

  try {
    const data = await enviarPeticion({link: "../resources/tcpdf/Recibos.php", numero, tipo: 'P', email});
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN CARGAR AJAX
async function uploadAjax() {
  let inputFile = document.getElementById('DocPDF');
  let file = inputFile.files[0];
  let id = $("#txt_id_rc").text().trim();

  try {
    const data = await enviarPeticion({op: "SUBIR_FILE", link: "../models/RecibosCaja.php", archivo: file, id});
    if (data == "true") {
      Swal.fire('Documento Cargado!', 'Se han cargado los archivos correctamente', 'success');
      $("#tdDocPDF").html(`<img src="../resources/icons/eye.png" align="absmiddle" onclick="VisualizarDocumento('${id.trim()}', 'R')">`);
    } else {
      Swal.fire('Error!', 'Se han producido un error cargado los archivos', 'error');
    }
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN AGREGAR CONDICIÓN ESPECIAL
async function AgregarCondicionEspecial() {
  let codigo = $("#txt_CondCodigo").val().trim();
  let dias = parseInt($("#txt_CondDias").val()).trim();
  let dcto = parseInt($("#txt_CondDcto").val().trim());

  if (codigo !== '' && dias > 0 && dcto > 0) {
    try {
      const data = await enviarPeticion({op: 'I_CONDICION_ESPECIAL', link: "../models/RecibosCaja.php", codigo, dias, dcto});
      if (data > 0) Swal.fire('Excelente', 'Condicion especial guardada y en espera de autorización.', 'success');
      else Swal.fire('Oops!!!', 'No fue posible crear la solicitud.', 'error');

      ConsultarCondicionEspecial();

      $("#txt_CondCodigo").val('');
      $("#txt_CondDias").val('');
      $("#txt_CondDcto").val('');
      $("#txt_CondCliente").val('');
    } catch (error) {
      console.error(error);
    }
  } else {
    Swal.fire('Error!', 'Campos vacios o inválidos, verifique e intente nuevamente', 'error');
  }
}
// FUNCIÓN CONSULTAR CONDICIÓN ESPECIAL
async function ConsultarCondicionEspecial() {
  try {
    const data = await enviarPeticion({op: "S_CONDICION_ESPECIAL", link: "../models/RecibosCaja.php"});
    if (data.length) {
      let tabla = `
      <table class="table table-bordered table-hover table-sm" width="100%" id="tableCondicionesEspeciales">
        <thead class="table-info">
          <tr>
            <th class="size-th">ID</th>
            <th class="size-th">CODIGO</th>
            <th class="size-th">NOMBRES</th>
            <th class="size-th">RAZON</th>
            <th class="size-th">DIAS</th>
            <th class="size-th">SUJETO.CUMPLI.</th>
            <th class="size-th">DESCUENTO</th>
            <th class="size-th">AUTORIZAR</th>
          </tr>
        </thead>
        <tbody>`;

      data.forEach(item => {
        tabla += `
        <tr>
          <td class="size-text vertical">${item.id}</td>
          <td class="size-text vertical">${item.codigo_sap}</td>
          <td class="size-td vertical">${item.nombres}</td>
          <td class="size-td vertical">${item.razon_comercial}</td>
          <td class="size-td vertical">${item.dias}</td>
          <td class="size-td vertical">${item.sujeto_cump}</td>
          <td class="size-td vertical">${item.descuento}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-light btn-micro text-primary" onclick="AutorizarCondicionEspecial('${item.id}')">
              <i class="fa-solid fa-square-check"></i>
            </button>
          </td>
        </tr>`;
      });

      tabla += `</tbody></table>`;
      $("#dvResultCondicionesEspeciales").html(tabla);
    } else {
      const msgHtml = `
      <div class="alert alert-danger" role="alert">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span class="sr-only">Error:</span>No hay solicitudes pendientes
      </div>`;
      $("#dvResultCondicionesEspeciales").html(msgHtml);
    }
  } catch (error) {
    console.error(error);
  }
}
// FUNCIÓN AUTORIZAR CONDICIÓN ESPECIAL
async function AutorizarCondicionEspecial(id) {
  let rol = $("#RolId").val();  
  if (rol == 1 || rol == 73) { // Administrador - gerencia administrativa
    const result = await confirmAlert(`Autorizar condición de descuento #${id}`, "¿Está seguro?");
    if (result.isConfirmed) {
      try {
        const data = await enviarPeticion({op: "A_CONDICION_ESPECIAL", link: "../models/RecibosCaja.php", id});
        if (data == 1) {
          Swal.fire('Excelente', 'Condicion autorizada con exito', 'success');
        } else {
          Swal.fire('Error', 'No fue posible autorizar!' + data, 'error');
        }
        ConsultarCondicionEspecial();        
      } catch (error) {
        console.error(error);
      }
    }
  } else {
    Swal.fire('Error', 'Usted no cuenta con los permisos para autorizar, este tipo de solicitudes.', 'error');
  }
}
// FUNCIÓN AUTORIZAR TODA CONDICIÓN
async function AutorizarTodoCondicion() {
  let nFilas = $("#tableCondicionesEspeciales tr").length;
  let rol = $("#RolId").val();
  if (rol == 1 || rol == 73) { // Administrador - gerencia administrativa
    if (nFilas > 0) {
      const result = await confirmAlert("Se autorizarán todas las condiciones", "¿Está seguro de autorizar todo?");
      if (result.isConfirmed) {
        try {
          $("#tableCondicionesEspeciales tr:gt(0)").each(async function () {
            let id = $(this).find('td').eq(0).html();
            await enviarPeticion({op: "A_CONDICION_ESPECIAL", link: "../models/RecibosCaja.php", id});           
          });
          Swal.fire("Excelente", "Condiciones autorizadas con éxito", "success");
          ConsultarCondicionEspecial();
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      Swal.fire("Oops!!!", "No hay nada que autorizar", "error");
    }
  }
}
// FUNCIÓN CONSULTAR CONDICIÓN LISTA
async function ConsultarCondicionLista() {
  let lista = $("#Lista").val();
  let oficina = $("#Oficina").val();
  try {
    const data = await enviarPeticion({op: "S_CONDICION_LISTAS", link: "../models/RecibosCaja.php", oficina});
    if (data.length) {
      let tabla = `
      <table class="table table-bordered table-hover table-sm" width="100%" id="">
        <thead class="table-info">
          <tr>
            <th class="size-th">LISTA</th>
            <th class="size-th">DIAS</th>
            <th class="size-th">% DESCUENTO</th>
            <th class="size-th">SUJETO PPTO</th>
            <th class="size-th">OFICINA</th>
          </tr>
        </thead>
        <tbody>`;

      let tabla2 = `
       <table class="table table-bordered table-hover table-sm" width="100%" id="tableCondicionesLista">
          <thead class="table-info">
            <tr>
              <th class="size-th">LISTA</th>
              <th class="size-th">DIAS</th>
              <th class="size-th">% DESCUENTO</th>
              <th class="size-th">OFICINA</th>
            </tr>
          </thead>
          <tbody>`;

      let tabla3 = `
       <table class="table table-bordered table-hover table-sm" width="100%" id="tableCondicionesListaPlazo">
          <thead class="table-info">
            <tr>
              <th class="size-th">LISTA</th>
              <th class="size-th">DIAS</th>
              <th class="size-th">% DESCUENTO</th>
              <th class="size-th">OFICINA</th>
            </tr>
          </thead>
          <tbody>`;

      let cont = 0;
      let cont2 = 0;

      data.forEach(item => {
        if (lista == item.lista) {
          ArrDctos.push({dias: item.dias, descuento: item.descuento, tipo: 'ADG'});

          if (item.sujeto_ppto == 'S') {
            cont++;

            tabla2 += `
            <tr>
              <td class="size-text vertical">${item.lista}</td>
              <td class="size-text vertical">${item.dias}</td>
              <td class="size-text vertical">${item.descuento}</td>
              <td class="size-text vertical">${item.oficina_ventas}</td>
            </tr>`;
          } else {
            cont2++;

            tabla3 += `
            <tr>
              <td class="size-text vertical">${item.lista}</td>
              <td class="size-text vertical">${item.dias}</td>
              <td class="size-text vertical">${item.descuento}</td>
              <td class="size-text vertical">${item.oficina_ventas}</td>
            </tr>`;
          }
        }

        tabla += `
        <tr>
          <td class="size-text vertical">${item.lista}</td>
          <td class="size-text vertical">${item.dias}</td>
          <td class="size-text vertical">${item.descuento}</td>
          <td class="size-text vertical">${item.sujeto_ppto}</td>
          <td class="size-text vertical">${item.oficina_ventas}</td>
        </tr>`;
      });

      tabla += `</tbody></table>`;
      tabla2 += `</tbody></table>`;
      tabla3 += `</tbody></table>`;
      $("#dvResultCondicionesEspecialesListas").html(tabla);

      // CONDICIONES POR LISTA DE PRECIOS SUJETAS A CUMPLIMIENTO DE PRESUPUESTO DE VENTAS
      if (cont > 0) {
        $("#dvCondicionesDetalleLista").html(tabla2);
      } else {
        const msgHtml = `
        <div class="alert alert-danger" role="alert">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span class="sr-only">Error:</span> No tiene condiciones especiales asociadas.
        </div>`;
        $("#dvCondicionesDetalleLista").html(msgHtml);
      }

      // CONDICIONES POR LISTA DE PRECIOS SUJETAS A PLAZO DE PAGO
      if (cont2 > 0) {
        $("#dvCondicionesDetalleListaPlazo").html(tabla3);
      } else {
        const msgHtml = `
        <div class="alert alert-danger" role="alert">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span class="sr-only">Error:</span> No tiene condiciones especiales asociadas.
        </div>`;
        $("#dvCondicionesDetalleListaPlazo").html(msgHtml);
      }
    } else {
      const msgHtml = `
      <div class="alert alert-danger" role="alert">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span class="sr-only">Error:</span> No hay resultados o no ha seleccionado un cliente.
      </div>`;
       $("#dvResultCondicionesEspecialesListas, #dvCondicionesDetalleLista").html(msgHtml);
    }
  } catch (error) {
    console.error(error); 
  }
}
// FUNCIÓN PARA FILTRAR ESTADOS
function filtroEstado(valor) {
  const theTable = $("#tablePlanillas tr:gt(0)");
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
// FUNCIÓN CONSULTAR INFORMES
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
// FUNCIÓN PARA FORMATEAR FECHAS SQL
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
// FUNCIÓN GENERAR GRÁFICO
function GenerarGrafico(titulo, jsonArray) {
  if (jsonArray.length) {
    Highcharts.chart('DivGrafico', {
      chart: {type: 'column'},
      title: {text: titulo},
      accessibility: {announceNewData: {enabled: true}},
      xAxis: {type: 'category'},
      yAxis: {title: {text: 'Numero de recibos'}},
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
// FUNCIÓN PARA RESET DE CAMPOS
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
// FUNCIÓN COMPENSAR DOCUMENTOS
const compensarDocumentos = async () => {
  let fhIni = $("#fhCompenIni").val();
  let fhFin = $("#fhCompenFin").val();
  let doc = $("#idCompenDoc").val();
  let mensaje = '';
  let titulo = "";

  if (doc == '') {
    titulo = `Compensación por fechas`;
    mensaje = `Esta seguro de esta operación, esto no se puede reversar?`;
  } else {
    titulo = `Compensación por documento`;
    mensaje = `Esta seguro de esta operación, esto no se puede reversar?`;
  }

  try {
    const result = await confirmAlert(titulo, mensaje);
    if (result.isConfirmed) {
      let resp = await enviarPeticion({
        link: "../models/RecibosCaja.php",
        op: "COMPENSAR_DOCUMENTOS",
        fhIni: fhIni,
        fhFin: fhFin,
        doc: doc
      });
      if (resp.estatus) {
        Swal.fire("Excelente!", resp.msg, "success");
        limpiarCompensar();
      } else {
        Swal.fire("Error!", resp.msg, "error");
      }
    } else {
      Swal.fire("Correcto!", "Compensación cancelada", "warning");
    }
  } catch (e) {
    console.log(e);
  }
}
// FUNCIÓN PARA CORTAR TEXTOS
function cortarTexto(texto, maxLongitud) {
  return texto.length > maxLongitud ? texto.slice(0, maxLongitud) + '...' : texto;
}
// FUNCIÓN PARA FILTAR EL AUTOCOMPLETE DE CLIENTES
function filtrarClientes(id) {
  let Arr_cli = ArrCli;
  const valor = $.trim($(`#${id}`).val());
  if (validarSiNumero(valor) == 1) {
    Arr_cli = FiltrarCli(valor, Arr_cli, 1);
  } else {
    let div_cadena = valor;
    div_cadena = div_cadena.split(" ");
    for (var x = 0; x < div_cadena.length; x++) {
      let expr = div_cadena[x].trim();
      Arr_cli = FiltrarCli(expr, Arr_cli, 2);
    }
  }
  return Arr_cli.slice(0, 10);
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
    const theTable = $("#tablePlanillas > tbody > tr");
    const value = $(this).val().toLowerCase();
    theTable.filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  // CAMPO AUTOCOMPLETE PARA BUSQUEDA DE MULTICASH 
  $("#filtro").autocomplete({
    source: function (request, response) {
      let Array_Cash = ArrayMulticash;
      const valor = $.trim($("#filtro").val());
      let div_cadena = valor;
      div_cadena = div_cadena.split(" ");

      for (let x = 0; x < div_cadena.length; x++) {
        let expr = div_cadena[x].trim();
        Array_Cash = FiltrarArray(expr, Array_Cash, 2);
      }
      response(Array_Cash.slice(0, 40));
    },
    maxResults: 40,
    minLength: 3,
    select: function (event, ui) {
      let sw = 0;

      $("#tdDetalleMulticash tr").each(function () {
        let id = $(this).find('td').eq(9).html();
        if (ui.item.id == id) sw = 1;
      });

      if (sw == 0) {
        if (ui.item.estado == 0) {
          const templateHTML = `
          <tr onDblClick="AddMulticash(this)">
            <td class="size-text">${ui.item.cuenta}</td>
            <td class="size-td">${ui.item.descripcion}</td>
            <td class="size-text">${ui.item.numero}</td>
            <td class="size-text">${formatNum(ui.item.valor, "$")}</td>
            <td class="size-text">${ui.item.texto}</td>
            <td class="size-text">${ui.item.fecha_cont}</td>
            <td class="size-text">${ui.item.fecha_val}</td>
            <td class="size-text">${ui.item.estado}</td>
            <td class="size-text">${ui.item.referencia}</td>
            <td class="size-text">${ui.item.id}</td>
          </tr>`; 
          $("#tdDetalleMulticash").append(templateHTML);
        } else {
          Swal.fire("Oops", "Ya el valor se aplico en el recibo :" + ui.item.id_rc, "error");
        }
      } else {
        Swal.fire("Oops", "Valor ya agregado", "error");
      }
    }
  }).focusout(function () {
    $('#filtro').val('');
  });

  $("#DocPDF").change(function () { uploadAjax(); });

  const idRol = parseInt($("#RolId").val());
  // CLICK PARA AUTORIZACIONES
  if (idRol == 1 || idRol == 26) { // Administrador & contabilidad
    $("#btnAutorizar").show();
    $("#btnCompensaciones").attr("disabled", false);
  } else {
    $("#btnAutorizar").hide();
    $("#btnCompensaciones").attr("disabled", true);
  }
  
  const sociedad = $("#Sociedad").val();
  // VALIDACIÓN DE CUENTAS
  if (sociedad == 1000) {
    $("#Cuenta").html('<option value="2815050503">2815050503 - AJUSTE AL PESO CM</option>');
  } else {
    $("#Cuenta").html('<option value="2815051601">2815051601 - AJUSTE AL PESO ROMA</option>');
  }
  // CLICK PARA EL CARGUE DEL MULTICASH
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
    monthNames: arrayMeses,
    monthNamesShort: arrayMesesAbrev,
    dateFormat: 'yy-mm-dd',
    width: 100,
    heigth: 100,
    minDate: -5
  }).datepicker("setDate", new Date());

  $("#FechaValor,#RptFhFin,#RptFhIni, #InfoFhIni,#InfoFhFin,#fhCompenIni,#fhCompenFin").datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: arrayMeses,
    monthNamesShort: arrayMesesAbrev,
    dateFormat: 'yy-mm-dd',
    width: 100,
    heigth: 100
  }).datepicker("setDate", new Date());

  Limpiar();

  $(document).keyup(function (e) {
    tecla = e.keyCode;
    if (tecla == 115) { Guardar(); } // F4 para guardar documento
  });

  $("#txtValidaDocumento").keyup(function (e) {
    let tecla = e.keyCode;
    let valor = $(this).val();
    if (tecla == 13) { // Enter para consultar
      if (valor !== "") ValidarDocumento(valor);
      else Swal.fire("Error", "Debe ingresar un número de documento válido.", "error");
    }
  });

  // CAMPO AUTOCOMPLETE PARA CLIENTES 
  $('#Cliente').autocomplete({
    source: function (request, response) {     
      response(filtrarClientes("Cliente"));
    },
    maxResults: 10,
    minLength: 3,
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
  
  $('#txt_CondCliente').autocomplete({
    source: function (request, response) {      
      response(filtrarClientes("txt_CondCliente"));
    },
    maxResults: 10,
    minLength: 3,
    select: function (event, ui) {
      $("#txt_CondCodigo").val(ui.item.codigo_sap);
    }
  });
  
  $(".ClassNumero").maskMoney({
    selectAllOnFocus: true,
    prefix: '$',
    thousands: '.',
    decimal: ',',
    precision: 0
  });

  ConsultarPlanilla();

  $("#RptFhFin, #RptFhIni").change(function () {
    ConsultarPlanilla();
  });

  $("#btnSubirMulticash").click(function () {
    $("#tr_det_cash").html('');
    $("#filename").val('');
    $("#dvSubirCash").modal('show');
  });

  // CARGUE DE PLANO MULTICASH
  $("#filename").val('');
  $("#filename").change(function (e) {
    const ext = $("input#filename").val().split(".").pop().toLowerCase();

    if ($.inArray(ext, ["csv"]) == -1) {
      Swal.fire("Oops!!!", "Solo se permiten archivos CSV", "error");
      $("#filename").val('');
      return false;
    }

    if (e.target.files != undefined) {
      const reader = new FileReader();

      reader.onload = function (e) {
        let csvval = e.target.result.split("\n");
        let detalle = '';
        let vtotal = 0;

        for (let i = 0; i < csvval.length; i++) {
          const row = csvval[i];
          if (row !== '') {
            const col = row.split(',');
            vtotal += parseFloat(col[1]);
            let valorCol2 = formatNum(parseFloat(col[2].trim()) * -1, '$');
            detalle += `
            <tr>
              <td>${col[0].trim()}</td>
              <td>${col[1].trim()}</td>
              <td>${valorCol2}</td>
              <td>${col[3].trim()}</td>
              <td>${col[4].trim()}</td>
              <td>${col[5].trim()}</td>
              <td>${col[6].trim()}</td>
            </tr>`;
          }
        }

        if (detalle != '') {
          var tb = `
          <table class="form" width="100%" id="tdImportCash">
            <thead>
              <tr>
              <th>Cuenta</th>
              <th>Documento</th>
              <th>Importe</th>
              <th>Texto</th>
              <th>Fecha Conta.</th>
              <th>Fecha Valor.</th>
              <th>Referencia</th>
              </tr>
            </thead>
            <tbody>
            ${detalle}
            </tbody>
          </table>`;
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

    $("#ModalHipervinculo").modal("show");
    $("#span-titulo-modulo").text(title);
    $(".iframe").attr('src', url).show();
  });

  $("#btnCompensaciones").click(() => {
    $("#modalCompensaciones").modal('show');
  });

  $("#btnCompensar").click(() => {
    compensarDocumentos();
  });

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
  
  $("#Cliente, #txt_CondCliente, #filtro").on("input", function () {
    this.value = this.value.toUpperCase();
  });
});