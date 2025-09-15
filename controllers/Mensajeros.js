let arrayDespachosFiltrados;
// FUNCIÓN CONFIRM ACCIONES
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
// FUNCIÓN OBTENER LISTAS DE FLETES
async function ConsultaListaFlete() {
  try {
    LoadImg('Consultando Información...');
    
    const { data } = await enviarPeticion({
      link: "../models/Mensajeros.php",
      op: "s_lista_flete",
      oficina: $("#TxtOficina").val()
    });

    if (data.length) {
      let tabla = `
      <table class="table table-bordered table-hover table-sm w-100" id="tdListaFlete">
        <thead>
          <tr>
            <th class="bag-info text-green size-14">ID</th>
            <th class="bag-info text-green size-14">LISTA</th>
            <th class="bag-info text-green size-14">PORCENTAJE</th>
            <th class="bag-info text-green size-14">OFICINA</th>
            <th class="bag-info text-green size-14">ORGANIZACION</th>
            <th class="bag-info text-green size-14 text-center">ACCIONES</th>
          </tr>
        </thead>
        <tbody>`;

      data.forEach(item => {
        tabla += `
        <tr>
          <td class="size-13 vertical">${item.ID}</td>
          <td class="size-13 vertical">${item.LISTA}</td>
          <td class="size-13 vertical">${item.PORCENTAJE}</td>
          <td class="size-13 vertical">${item.OFICINA}</td>
          <td class="size-13 vertical">${item.ORGANIZACION}</td>
          <td class="d-flex justify-content-center gap-2">
            <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar-lista" data-id="${item.ID}" title="Eliminar lista de fletes">
              <i class="fa-solid fa-trash-can"></i>
            </button>
            <button type="button" class="btn btn-outline-warning btn-sm btn-editar-lista" data-id="${item.ID}" title="Actualizar lista de fletes">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </td>
        </tr>`;
      });

      tabla += `</tbody></table>`;
      $("#ResultFletes").html(tabla);

      $('#tdListaFlete').on('click', '.btn-eliminar-lista', function () {
        const id = $(this).attr("data-id");
         EliminaListaFlete(id);
      });

      $('#tdListaFlete').on('click', '.btn-editar-lista', async function () {
        const id = $(this).attr("data-id");
        $('#idListaHidden').val(id);
        $('#dvListaFletes').modal("hide");
        const { data } = await enviarPeticion({
          op: "G_LISTA_ID",
          link: "../models/Mensajeros.php",
          id
        });
        const { LISTA, PORCENTAJE } = data[0];
        $('#ListaFleteEdi').val(LISTA);
        $('#PcjFleteEdi').val(PORCENTAJE);
        $('#modalEditarLista').modal("show");
      });
    } else {
      const msgHtml = `
      <div class="alert alert-danger" role="alert">
        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        <span class="sr-only">Error:</span>  NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
      </div>`;
      $("#ResultFletes").html(msgHtml);
    }
  } catch (error) {
    console.log(error);
  } finally {
    UnloadImg();
  }
}
// FUNCIÓN PARA ELIMINAR LISTA DE FLETE
async function EliminaListaFlete(id) {
  try {
    const result = await confirmAlert("Eliminar Lista", `¿Está seguro(a) de eliminar la lista con ID #${id}?`);
    if (!result.isConfirmed) return;

    LoadImg('Eliminando Registro...');

    const data = await enviarPeticion({
      link: "../models/Mensajeros.php",
      op: "d_lista_flete",
      id
    });

    if (data.ok) {
      Swal.fire('Excelente', 'Registro eliminado', 'success');
    } else {
      Swal.fire('Error', 'Error al intentar eliminar', 'error');
    }
    ConsultaListaFlete();

  } catch (error) {
    console.log(error);
  } finally {
    UnloadImg();
  }
}
// FUNCIÓN PARA EDITAR LISTA DE FLETE
async function EditarListaFlete(id) {
  const flete = $('#PcjFleteEdi').val();

  if (!flete) {
    Swal.fire("Oops!!!", "Debe diligenciar el flete", "error");
    return;
  }

  try {
    const result = await confirmAlert("Editar Lista", `¿Está seguro(a) de editar la lista con ID #${id}?`);
    if (!result.isConfirmed) return;

    const data = await enviarPeticion({
      link: "../models/Mensajeros.php",
      op: "U_LISTA_FLETES",
      flete,
      id
    });

    if (data.ok) {
      Swal.fire('Excelente', 'Lista actualizada', 'success');
    } else {
      Swal.fire('Error', 'Error al intentar actualizar', 'error');
    }
    ConsultaListaFlete();
    $('#modalEditarLista').modal("hide");
  } catch (error) {
    console.log(error);
  }
}
// FUNCIÓN PARA AGREGAR LISTAS DE FLETES
const AgregarListaFlete = async () => {
  const oficina = $("#TxtOficina").val();
  const flete = $("#PcjFlete").val();
  const lista = $("#ListaFlete").val();

  try {
    LoadImg('Agregando Registro...');

    const { data: existeLista } = await enviarPeticion({
      op: "VERIFICAR_EXISTE_LISTA", 
      link: "../models/Mensajeros.php",
      oficina,
      lista
    });

    if (existeLista.length) {
      Swal.fire("Oops!!!", `La lista que intenta agregar ya existe para la oficina ${oficina}`, "error");
      return;
    }

    const data = await enviarPeticion({
      link: "../models/Mensajeros.php",
      op: "i_lista_flete",
      oficina,
      flete,
      lista
    });

    if (data == 1) {
      Swal.fire('Excelente', 'Registro agregado', 'success');
    } else {
      Swal.fire('Error', 'Error al intentar agregar el registro', 'error');
    }
    ConsultaListaFlete();
  } catch (error) {
    console.log(error);
  } finally {
    UnloadImg();
  }
}
// FUNCIÓN CONSULTAR DETALLE DE PLANILLA
const ConsultarDetallePlanilla = async () => {
  $('#dvListaDespachosDet').html(``);
  $('#filtroLista, #filtroZona, #filtroCliente, #filtroCiudad, #filtroTransportador, #filtroCodigo').html(`<option value="">--Seleccione--</option>`);
  LoadImg('Consultando Información...');
  try {
    const data = await enviarPeticion({
      op: "s_planilla_detalle",
      link: "../models/Mensajeros.php",
      oficina: $("#TxtOficina2D").val(),
      fh_ini: $("#fhIniD").val(),
      fh_fin: $("#fhFinD").val()
    });

    arrayDespachosFiltrados = [...data];
  } catch (error) {
    console.log(error);
  } finally {
    UnloadImg();
  }
}

function mostrarDetallePlanilla(data) {
  if (data.length) {
    let tabla = `
    <table class="table table-bordered table-hover table-sm w-100" id="tdListaDespachoDetalle">
      <thead>
        <tr>
          <th class="bag-info size-14 text-green no-wrap">LOTE</th>
          <th class="bag-info size-14 text-green no-wrap">EMPRESA</th>
          <th class="bag-info size-14 text-green no-wrap">OFICINA</th>
          <th class="bag-info size-14 text-green no-wrap">ZONA</th>
          <th class="bag-info size-14 text-green no-wrap">DESCRIPCIÓN</th>
          <th class="bag-info size-14 text-green no-wrap">FECHA</th>
          <th class="bag-info size-14 text-green no-wrap">CLIENTE</th>
          <th class="bag-info size-14 text-green no-wrap">CÓDIGO SAP</th>
          <th class="bag-info size-14 text-green no-wrap">COND. PAGO</th>
          <th class="bag-info size-14 text-green no-wrap">DIRECCIÓN</th>
          <th class="bag-info size-14 text-green no-wrap">CIUDAD</th>
          <th class="bag-info size-14 text-green no-wrap text-center">FACTURA</th>
          <th class="bag-info size-14 text-green no-wrap d-none">FACTURA</th>
          <th class="bag-info size-14 text-green no-wrap">TRANSP.</th>
          <th class="bag-info size-14 text-green no-wrap">GUÍA</th>
          <th class="bag-info size-14 text-green no-wrap">VALOR FACTURA</th>
          <th class="bag-info size-14 text-green no-wrap">VALOR</th>
          <th class="bag-info size-14 text-green no-wrap">LISTA</th>
          <th class="bag-info size-14 text-green no-wrap">% FLETE</th>
          <th class="bag-info size-14 text-green no-wrap">VLR. FLETE APROBADO</th>
          <th class="bag-info size-14 text-green no-wrap">VLR. FLETE</th>
          <th class="bag-info size-14 text-green no-wrap">FLETE REAL</th>
          <th class="bag-info size-14 text-green no-wrap">FLETE PROVEEDOR</th>
          <th class="bag-info size-14 text-green no-wrap">FLETE FINAL</th>
          <th class="bag-info size-14 text-green no-wrap">DIF.</th>
          <th class="bag-info size-14 text-green no-wrap">INDICADOR FLETE</th>
          <th class="bag-info size-14 text-green no-wrap">CAJAS</th>
          <th class="bag-info size-14 text-green no-wrap">PAQUETES</th>
          <th class="bag-info size-14 text-green no-wrap">INICIO</th>
          <th class="bag-info size-14 text-green no-wrap">FIN</th>
        </tr>
      </thead>
      <tbody>`;

    let totalCajas = 0;
    let totalPaquetes = 0;
    let totalFacturaSin = 0;
    let totalFacturaCon = 0;
    let totalPorcFlete = 0;
    let totalFleteAprob = 0;
    let totalFlete = 0;
    let totalFleteReal = 0;
    let diferencia = 0;
    let totalFleteProveedor = 0;
    let totalFleteFinal = 0;
    let totalIndicador = 0;
    let totalIndicadorF;

    data.forEach(item => {
      let VLR_FLETE = 0;
      let VLR_FLETE_APROB = 0;
      let DIF = 0;
      let COLOR = 'style="color: #00B362;"';

      let fleteProveedor = 0;

      if (item.FLETE_PROVEEDOR.trim() === "") {
        fleteProveedor = 0;
      } else {
        fleteProveedor = parseFloat(item.FLETE_PROVEEDOR);
      }

      const fleteFinal = parseFloat(item.FLETE) - fleteProveedor;
      totalFleteProveedor += fleteProveedor;

      if (parseInt(item.PCJ_FLETE) > 0) {
        VLR_FLETE = Math.round(parseFloat(item.VALOR * (item.PCJ_FLETE / 100)));
        VLR_FLETE_APROB = Math.round(parseFloat(item.VALOR_NETO * (item.PCJ_FLETE / 100)));
        DIF = VLR_FLETE_APROB - fleteFinal;
      }

      if (DIF > 0) COLOR = 'style="color: #FF0509;"';

      const indicadorFlete = (fleteFinal / parseFloat(item.VALOR_NETO)).toFixed(2);

      totalFleteAprob += VLR_FLETE_APROB;
      totalFlete += VLR_FLETE
      diferencia += DIF;
      totalFleteFinal += fleteFinal;
      totalIndicador += parseFloat(indicadorFlete);
      totalIndicador = totalIndicador / data.length;
      totalIndicadorF = totalIndicador.toFixed(2);

      tabla += `
      <tr>
        <td class="size-13 vertical no-wrap">${item.ID_LOTE}</td>
        <td class="size-13 vertical no-wrap">${item.ORGANIZACION_VENTAS}</td>
        <td class="size-13 vertical no-wrap text-center">${item.OFICINA_VENTAS}</td>
        <td class="size-13 vertical no-wrap">${item.ZONA}</td>
        <td class="size-12 vertical no-wrap">${item.ZONA_DESCRIPCION}</td>
        <td class="size-13 vertical no-wrap">${item.FECHA}</td>
        <td class="size-12 vertical no-wrap" title="${item.CLIENTE}">${cortarTexto(item.CLIENTE, 30)}</td>
        <td class="size-13 vertical no-wrap">${item.CODIGO_SAP}</td>
        <td class="size-13 vertical no-wrap">${item.CONDICION_PAGO}</td>
        <td class="size-13 vertical no-wrap" title="${item.DIRECCION}">${cortarTexto(item.DIRECCION, 30)}</td>
        <td class="size-12 vertical no-wrap">${item.CIUDAD}</td>
        <td class="size-13 vertical no-wrap text-center facturas">${item.NUMERO_FACTURA}</td>
        <td class="size-13 vertical no-wrap d-none">${item.NUMERO_FACTURA}</td>
        <td class="size-12 vertical no-wrap" title="${item.TRANSPORTADOR}">${cortarTexto(item.TRANSPORTADOR, 35)}</td>
        <td class="size-13 vertical no-wrap">${item.GUIA}</td>
        <td class="size-13 vertical no-wrap fw-bold">${formatNum(item.VALOR_NETO, '$')}</td>
        <td class="size-13 vertical no-wrap fw-bold">${formatNum(item.VALOR, '$')}</td>
        <td class="size-13 vertical no-wrap fw-bold">${item.LISTA}</td>
        <td class="size-13 vertical no-wrap fw-bold">${item.PCJ_FLETE}%</td>
        <td class="size-13 vertical no-wrap fw-bold">${formatNum(VLR_FLETE_APROB, '$')}</td>
        <td class="size-13 vertical no-wrap fw-bold">${formatNum(VLR_FLETE, '$')}</td>
        <td class="size-13 vertical no-wrap fw-bold">${formatNum(item.FLETE, '$')}</td>
        <td class="size-13 vertical no-wrap fw-bold">${formatNum(fleteProveedor, "$")} - ${item.NOMBRE_FLETE_PROV}</td>
        <td class="size-13 vertical no-wrap fw-bold">${formatNum(fleteFinal, "$")}</td>
        <td class="size-13 vertical no-wrap fw-bold" ${COLOR}>${formatNum(DIF, '$')}</td>
        <td class="size-13 vertical no-wrap fw-bold">${indicadorFlete}%</td>
        <td class="size-13 vertical no-wrap text-center fw-bold">${item.N_CAJAS}</td>
        <td class="size-13 vertical no-wrap text-center fw-bold">${item.N_PAQUETES}</td>
        <td class="size-13 vertical no-wrap">${item.FECHA_INICIO}</td>
        <td class="size-13 vertical no-wrap">${item.FECHA_FIN}</td>
      </tr>`;
    });

    totalCajas = data.reduce((acumulador, item) => acumulador + parseInt(item.N_CAJAS), 0);
    totalPaquetes = data.reduce((acumulador, item) => acumulador + parseInt(item.N_PAQUETES), 0);
    totalFacturaSin = data.reduce((acumulador, item) => acumulador + parseFloat(item.VALOR_NETO), 0);
    totalFacturaCon = data.reduce((acumulador, item) => acumulador + parseFloat(item.VALOR), 0);
    totalFleteReal = data.reduce((acumulador, item) => acumulador + parseFloat(item.FLETE), 0);
    totalPorcFlete = data.reduce((acumulador, item) => acumulador + parseInt(item.PCJ_FLETE), 0);
    totalPorcFlete = (totalPorcFlete / data.length).toFixed(2);

    tabla += `
    </tbody>
    <tfoot>
      <tr>
        <th colspan="14" class="text-center bag-info text-green">TOTALES</th>
        <th class="text-center bag-info text-green d-none"></th>
        <th class="fw-bold size-14 bag-info text-green">${formatNum(totalFacturaSin, "$")}</th>
        <th class="fw-bold size-14 bag-info text-green">${formatNum(totalFacturaCon, "$")}</th>
        <th class="fw-bold size-14 bag-info text-green"></th>
        <th class="fw-bold size-14 bag-info text-green">${totalPorcFlete}%</th>
        <th class="fw-bold size-14 bag-info text-green">${formatNum(totalFleteAprob, "$")}</th>
        <th class="fw-bold size-14 bag-info text-green">${formatNum(totalFlete, "$")}</th>
        <th class="fw-bold size-14 bag-info text-green">${formatNum(totalFleteReal, "$")}</th>
        <th class="fw-bold size-14 bag-info text-green">${formatNum(totalFleteProveedor, "$")}</th>
        <th class="fw-bold size-14 bag-info text-green">${formatNum(totalFleteFinal, "$")}</th>
        <th class="fw-bold size-14 bag-info text-green">${formatNum(diferencia, "$")}</th>
        <th class="fw-bold size-14 bag-info text-green">${totalIndicadorF}%</th>
        <th class="fw-bold size-14 text-center bag-info text-green">${totalCajas}</th>
        <th class="fw-bold size-14 text-center bag-info text-green">${totalPaquetes}</th>
        <th class="fw-bold size-14 bag-info text-green"></th>
        <th class="fw-bold size-14 bag-info text-green"></th>
      </tr>
    </tfoot></table>`;

    $("#dvListaDespachosDet").html(tabla);
    theTable = $("#tdListaDespachoDetalle");
    const facturasCeldas = document.querySelectorAll("#tdListaDespachoDetalle td.facturas");
    resumirFacturas(facturasCeldas);

    $("#FiltroPlanilla").keyup(function () {
      $.uiTableFilter(theTable, this.value);
    });

    $("#tdListaDespachoDetalle").tableExport({
      formats: ["xlsx"],
      position: 'botton',
      bootstrap: true,
      fileName: `Detalle de planillas de despacho del ${$("#fhIniD").val()} al ${$("#fhFinD").val()}`
    });

    $("#tdListaDespachoDetalle > caption").css({
      "position": "absolute",
      "top": "65px",
      "right": "20px"
    });

    $("#tdListaDespachoDetalle > caption > button").removeClass('xlsx');
    $("#tdListaDespachoDetalle > caption > button").removeClass('btn-outline-secondary');
    $("#tdListaDespachoDetalle > caption > button").addClass('btn-outline-success');
    $("#tdListaDespachoDetalle > caption > button").addClass('btn-sm');
    $("#tdListaDespachoDetalle > caption > button").text('Exportar a Excel');

  } else {
    const msgHtml = `
    <div class="alert alert-danger" role="alert">
      <i class="fa-solid fa-circle-exclamation"></i>
      <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
    </div>`;
    $("#dvListaDespachosDet").html(msgHtml);
  }
}

function llenarSelect(selector, campo, data) {
  const valoresUnicos = [...new Set(data.map(x => x[campo]))].sort();
  const select = document.querySelector(selector);
  valoresUnicos.forEach(valor => {
    if (valor && valor.trim() !== '') {
      const option = document.createElement('option');
      option.value = valor;
      option.textContent = valor;
      select.appendChild(option);
    }
  });
}

function aplicarFiltros(data) {
  const lista = document.querySelector('#filtroLista').value;
  const zona = document.querySelector('#filtroZona').value;
  const cliente = document.querySelector('#filtroCliente').value;
  const ciudad = document.querySelector('#filtroCiudad').value;
  const transportador = document.querySelector('#filtroTransportador').value;
  const codigo = document.querySelector('#filtroCodigo').value;

  const resultado = data.filter(item =>
    (!lista || item.LISTA === lista) &&
    (!zona || item.ZONA === zona) &&
    (!cliente || item.CLIENTE === cliente) &&
    (!ciudad || item.CIUDAD === ciudad) &&
    (!transportador || item.TRANSPORTADOR === transportador) &&
    (!codigo || item.CODIGO_SAP === codigo)
  );

  mostrarDetallePlanilla(resultado);
}

const Limpiar = async () => {
  var op = OficinasVentas('N');
  $("#TxtOficina").html(op);
  $("#TxtOficina2").html(op);
  $("#TxtOficina2D").html(op);
  $("#TxtCod_sap_cliente").html("");
  $("#TxtNit").html("");
  $("#TxtCliente").html("");
  $("#TxtDpto").html("");
  $("#TxtCiudad").html("");
  $("#numero_h").val("");
  $("#id_reg_despacho").val("");
  $("#SlcCajas").html('');
  $("#SlcPaquetes").html('');
  $("#fecha_inicio").html("");
  $("#fecha_fin").html("");
  $("#trDetallefact").hide();
  $("#tbody").html('');
  $("#TxtNFactura").val('');
  $("#totFletes").val('$0');
  await CargarEmpacador();
  await CargarTransportador();
  $("#TxtNFactura").focus();
  desbloquearTransportador();
}

function VerificarMensajero() {
  var sw = 0;
  var opc = '';
  var id = '';
  if ($("#TxtTipoEnvio").val() == 'M') {
    opc = 's_verificar_mensajero';
    id = $("#TxtEmpacador").val();
  } else {
    opc = 's_verificar_transportador';
    id = $("#TxtTransportador").val();
  }
  if (id != '') {
    $.ajax({
      url: "../models/Mensajeros.php",
      global: false,
      type: "POST",
      data: ({
        op: opc,
        id: id
      }),
      dataType: "json",
      async: false,
      success: function (data) { 
        if (data.length > 0) {
          if (data[0].NUM_FAC_PENDIENTES == 0 || data[0].BLOQUEO_PLANILLA == 'N') {
            sw = 0;
          } else {
            sw = 1;
          }
        }
      }
    });
  } else {
    sw = 1;
  }

  if (sw == 0) {
    return true;
  } else {
    return false;
  }
}

const CargarEmpacador = async () => {
  const data = {
    link: "../models/Mensajeros.php",
    op: "s_listar_mensajeros",
    oficina: $("#TxtOficina").val()
  }
  try {
    const resp = await enviarPeticion(data);
    let option = ``;
    resp.forEach(function (d) {
      option += '<option value="' + d.ID + '">' + d.NOMBRES + '</option>';
    })
    $("#TxtEmpacador").html(option);
  } catch (e) {
    console.log(e);
  }
}

const CargarTransportador = async () => {
  const data = {
    link: "../models/Transportadores.php",
    op: "S_TRANSPORTADOR",
    org: $("#TxtOrg").val(),
    ofc: $("#TxtOficina").val()
  }
  try {
    const resp = await enviarPeticion(data);
    if (resp.length > 0) {
      let option = ``;
      resp.forEach(function (d) {
        option += '<option value="' + d.ID + '">' + d.NOMBRES + '</option>';
      })
      $("#TxtTransportador").html(option);
    } else {
      $("#TxtTransportador").html('');
    }
  } catch (e) {
    console.log(e);
  }
}

function ValidarGrilla(numero) {
  var sw = 0;
  $("#tbody tr").each(function (index, element) {
    var num_fact = $(this).find('td').eq(0).html();

    if (num_fact == numero) {
      sw = 1;
      return false;
    } else {
      sw = 0;
    }
  });

  if (sw == 0) {
    return true;
  } else {
    return false;
  }
}


function CargarDatosFactura() {
  let numero = $("#TxtNFactura").val();

  if ($("#TxtOficina").val() == '1100') {
    numero = parseInt(numero, 10); // Convierte a número, eliminando los ceros iniciales
    numero = numero.toString(); // Convierte nuevamente a string si es necesario
  }
  
  var reexpedicion = $("#TxtReexpedicion").val();

  $.ajax({
    url: "../models/Mensajeros.php",
    global: false,
    type: "POST",
    data: ({
      op: "P_DESPACHOS_S",
      numero: numero
    }),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          d = data[i];
          //verifico si hay proceso de empaque y si ya ha sido terminado el empaque de esa factura
          if (parseInt(d.id_reg_empaque) > 0) {
            if (d.estado == 'T') { //verifico si fue terminado el proceso de empaque 
              //verifico si la factura esta en t_despacho_detalle
              //alert('Estado despacho : '+ $.trim(d.estado_despacho));
              if (parseInt(d.id_lote_det) == 0 || $.trim(d.estado_despacho) == 'L') { // no tiene despacho en t_despachos o el estado es liberado
                //verifico si el mensajero tiene pendientes 
                if (VerificarMensajero()) { // si es true , entonces puede hacer despachos
                  //ahora verifico si la factura ya fue agregada a la tabla temporal para iniciar el proceso							   
                  /**/
                  var Slct = '';
                  $.ajax({
                    type: "POST",
                    encoding: "UTF-8",
                    url: "../models/Eventos.php",
                    dataType: "json",
                    error: function (OBJ, ERROR, JQERROR) {
                      alert(JQERROR);
                    },
                    data: {
                      op: "B_GARTICULOS"
                    },
                    async: false,
                    success: function (data) {
                      var option = '<option value="0">NO ASUME PROVEEDOR</option>';
                      for (var i = 0; i <= data.length - 1; i++) {
                        option += '<option value="' + data[i].GRUPO_ARTICULO + '">' + data[i].DESCRIPCION1 + '</option>'
                      }
                      Slct = '<select class="form-select form-select-sm shadow-sm size-13">' + option + '</select>';
                    }
                  });
                  /**/

                  if (ValidarGrilla(numero)) {
                    var ini = (d.inicio_despacho != null) ? d.inicio_despacho : '';
                    var fin = (d.fin_despacho != null) ? d.fin_despacho : '';
                    var status = '';
                    if (parseInt(d.n_cajas) == 0 && parseInt(d.n_paquetes) == 0) {
                      status = 'disabled';
                    }
                    var det = '<tr>'
                      + '<td class="size-13 vertical">' + numero + '</td>'
                      + /*0*/ '<td class="size-13 vertical">' + d.codigo_sap + '</td>'
                      + /*1*/ '<td class="size-13 vertical">' + d.nit + '</td>'
                      + /*2*/ '<td class="size-13 vertical no-wrap">' + d.razon_comercial + '</td>'
                      + /*3*/ '<td class="size-13 vertical">' + d.departamento + '</td>'
                      + /*4*/ '<td class="size-13 vertical">' + d.ciudad + '</td>'
                      + /*5*/ '<td class="size-13 vertical text-center">' + d.n_cajas + '</td>'
                      + /*6*/ '<td class="size-13 vertical text-center">' + d.n_paquetes + '</td>'
                      + /*7*/ '<td class="size-13 vertical" style="display:none">' + ini + '</td>'
                      + /*0*/ '<td class="size-13 vertical" style="display:none">' + fin + '</td>'
                      + /*0*/ '<td class="vertical">'
                      + '<input type="text" class="form-control form-control-sm shadow-sm ClassNumero" ' + status + ' onBlur="TotalFletes()" value="$0" onKeyPress="return vnumeros(event)">'
                      + '</td>'
                      + '<td class="vertical"><input type="text" class="form-control form-control-sm shadow-sm" value=""></td>'
                      + '<td class="size-13 vertical text-center">' + reexpedicion + '</td>'
                      + '<td class="size-13 vertical text-center">0</td>'
                      + '<td class="vertical">' + Slct + '</td>'
                      + '<td align="center">'
                      + '<button type="button" class="btn btn-outline-danger btn-sm" onclick="EliminarFila(this)">'
                      + '<i class="fa-solid fa-trash-can"></i>'
                      + '</button>'
                      + '</td>'
                      + '</tr>';
                    //alert(det);

                    $("#tbody").append(det);
                    bloquearTransportador();
                    $(".ClassNumero").maskMoney({
                      selectAllOnFocus: true, //evento onkeyup 
                      prefix: '$',
                      thousands: '.',
                      decimal: ',',
                      allowZero: true,
                      precision: 0
                    });
                    $("#TxtNFactura").val('');
                    $("#trDetallefact").show();
                    return false;
                  } else {
                    Swal.fire('Oops!', 'La factura ya ha sido agregada para iniciar proceso de despacho', 'warning');
                    return false;
                  }
                } else { //Fin verifica mensajeros
                  $("#TxtNFactura").val('');
                  Swal.fire('Oops!', 'El usuario tiene facturas pendientes por entregar, no es posible cargar una nueva!', 'error');
                  return false;
                }


              } else { //verifico primero si el estado es D
                //verifico si el estado es E

                if ($.trim(d.estado_despacho) != 'E') {
                  //ahora verifico si el estado es D

                  if ($.trim(d.estado_despacho) == 'D') {

                    if (d.reexpedicion == 'N') { ///Aqui se finaliza el despacho ya que no hay reexpedicion
                      Swal.fire({
                        title: "Finalizar despacho #" + numero,
                        text: "Desea finalizar el despacho de esta factura?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#82ED81",
                        cancelButtonColor: "#FFA3A4",
                        confirmButtonText: "Aceptar",
                        cancelButtonText: "Cancelar",
                        html: '<textarea id="txtNotas" class="notas" placeholder="Espacio para notas adicionales..."></textarea>',
                        closeOnConfirm: true,
                        closeOnCancel: false
                      }).then((result) => {
                        if (result.value) {
                          FinalizarProceso(parseInt(d.id_lote_det));
                        } else {
                          Swal.fire("Cancelado", "La operacion ha sido cancelada!", "error");
                        }
                      });
                    } else {
                      /**
												     ESTO ES LA REEXPEDICION
													  Aqui se reexpide el pedido 
											          si estado no es D
											          se debe iniciar 
												  **/
                      if (ValidarGrilla(numero)) {
                        var ini = (d.inicio_despacho != null) ? d.inicio_despacho : '';
                        var fin = (d.fin_despacho != null) ? d.fin_despacho : '';
                        status = '';
                        if (parseInt(d.n_cajas) == 0 && parseInt(d.n_paquetes) == 0) {
                          status = 'disabled';
                        }
                        var det = '<tr>'
                          + '<td>' + numero + '</td>'
                          + '<td>' + d.codigo_sap + '</td>'
                          + '<td>' + d.nit + '</td>'
                          + '<td>' + d.razon_comercial + '</td>'
                          + '<td>' + d.departamento + '</td>'
                          + '<td>' + d.ciudad + '</td>'
                          + '<td>' + d.n_cajas + '</td>'
                          + '<td>' + d.n_paquetes + '</td>'
                          + '<td style="display:none">' + ini + '</td>'
                          + '<td style="display:none">' + fin + '</td>'
                          + '<td align="center">'
                          + '<input type="text" class="form-control" ' + status + ' onBlur="TotalFletes()" value="$0" onKeyPress="return vnumeros(event)">'
                          + '</td>'
                          + '<td align="center"><input type="text" class="form-control" value=""></td>'
                          + '<td>N</td>'
                          + '<td>' + d.id_lote_det + '</td>'
                          + '</tr>';
                        //alert(det);

                        $("#tbody").append(det);
                        bloquearTransportador();

                        $(".ClassNumero").maskMoney({
                          selectAllOnFocus: true, //evento onkeyup 
                          prefix: '$',
                          thousands: '.',
                          decimal: ',',
                          allowZero: true,
                          precision: 0
                        });
                        $("#TxtNFactura").val('');
                        $("#trDetallefact").show();
                        return false;
                      } else {
                        Swal.fire('Oops!', 'La factura ya ha sido agregada para iniciar proceso de despacho', 'warning');
                        return false;
                      }
                      /**
                         AQUI FINALIZA LA REEXPEDICION 
                      **/

                    }
                    $("#TxtNFactura").val('');
                    return false;

                  }

                } else {
                  $("#TxtNFactura").val('');
                  Swal.fire.fire('Oops!', 'El proceso de despacho ya fue terminado para esta factura!', 'error');
                  return false;
                }
              }

            } else {
              $("#TxtNFactura").val('');
              Swal.fire('Oops!', 'No se ha terminado el proceso de  empaque, por lo tanto no se puede iniciar despacho', 'warning');
              return false;
            }
          } else {
            $("#TxtNFactura").val('');
            Swal.fire('Oops!', 'No se tiene registro de empaque, por lo tanto no se puede iniciar despacho', 'warning');
            return false;
          }
        } //for

      } else {
        $("#TxtNFactura").val('');
        Swal.fire('Oops!', 'No se encontraron resultados!', 'warning');
      }
    }
  });

}

function EliminarFila(ob) {
  Swal.fire({
    title: "Eliminar factura",
    text: "Esta seguro de eliminar esta factura?",
    type: "warning",
    html: '',
    showCancelButton: true,
    confirmButtonColor: "#82ED81",
    cancelButtonColor: "#FFA3A4",
    confirmButtonText: "Eliminar!",
    cancelButtonText: "Cancelar",
    closeOnConfirm: false,
    closeOnCancel: false
  }).then((result) => {
    if (result.value) {
      $(ob).parent().parent().remove();
      // valido la longitud 
      n_filas = $(".data_facturas_planillas tbody tr").length;

      if (n_filas == 0) {
        desbloquearTransportador();
      }

    } else {
      Swal.fire("Cancelado", "Operación cancelada!", "error");
    }
  })

}

function TotalFletes() {
  var flete = 0;
  $("#tbody tr").each(function (index, element) {
    flete += parseFloat(unformatNum($(this).find('td').eq(10).find('input').val()));
  });
  $("#totFletes").val(formatNum(flete, '$'));
}
//
function TipoTransportista(id) {
  tipo = 0;
  $.ajax({
    url: "../models/Mensajeros.php",
    global: false,
    type: "POST",
    data: ({
      op: "TIPO_TRASPORTISTA",
      id: id
    }),
    dataType: "html",
    async: false,
    success: function (data) {
      tipo = data;
    }
  });
  return tipo;
}

const bloquearTransportador = () => {
  $("#TxtTransportador").prop("disabled", true);
  $("#TxtEmpacador").prop("disabled", true);
  $("#TxtTipoEnvio").prop("disabled", true);
  $("#TxtOficina").prop("disabled", true);
}

const desbloquearTransportador = () => {
  $("#TxtTransportador").prop("disabled", false)
  $("#TxtEmpacador").prop("disabled", false)
  $("#TxtTipoEnvio").prop("disabled", false);
  $("#TxtOficina").prop("disabled", false);
}

//
function IniciarProceso() {
  tipo_usr = $("#TxtTipoEnvio").val();
  id_ser = (tipo_usr == 'M') ? $("#TxtEmpacador").val() : $("#TxtTransportador").val();
  org = $("#TxtOrg").val();
  ofc = $("#TxtOficina").val();
  detalle = $("#tbody").html();
  var arrayProductos = [];
  // Nuevo código para controlar los datos de envío font style 2024-10-25
  $("#tbody tr").each(function () {
    var fila = $(this);
    var num_fact = $.trim(fila.find('td').eq(0).html());
    var flete = unformatNum(fila.find('td').eq(10).find('input').val());
    var guia = fila.find('td').eq(11).find('input').val();
    var reexpide = $.trim(fila.find('td').eq(12).html());
    var idReexpide = parseInt($.trim(fila.find('td').eq(13).html()));
    var GruLab = $.trim(fila.find('td').eq(14).html());
    var cajas = parseInt($(this).find("td").eq(6).html());
    var paquetes = parseInt($(this).find("td").eq(7).html());

    arrayProductos.push({
      num_fact: num_fact,
      flete: flete,
      guia: guia,
      reexpide: reexpide,
      idReexpide: idReexpide,
      GruLab: GruLab,
      cajas: cajas,
      paquetes: paquetes
    });
  });

  // Validar si alguno de los num_fact no es un número
  if (arrayProductos.some(producto => !$.isNumeric(producto.num_fact))) {
    Swal.fire('Error', 'Ha ocurrido un error al generar la planilla, por favor inicie el proceso nuevamente', 'error');
    return;
  }
  //Nuevo codigo para controlar los datos de envio font style 2024-10-25

  if (arrayProductos.length > 0) {
    let sw = true;
    let pedir_flete = false;
    let tipo_t_id = TipoTransportista(id_ser);
    let obj_select = "";
    /*Recorro el detalle para determinar que no existan valores de fletes en 0
       verifico el tipo de usuario 
       si es mensajero no se cobra flete
       si es trasportista verifico el tipo_trasportista y en el caso valido flete*/
    if (tipo_usr == 'T') {
      switch (parseInt(tipo_t_id)) {
        case 2:
          arrayProductos.forEach(function (d, i) {
            if (d.cajas > 0 || d.paquetes > 0) {
              if (d.flete == 0) {
                sw = false;
                return false;
              }
            }
          });
          break;
      }
    }
    if (sw) {
      $.ajax({
        url: "../models/Mensajeros.php",
        global: false,
        type: "POST",
        data: ({
          op: "P_DESPACHO_LOTES_I",
          id_ser: id_ser,
          tipo_usr: tipo_usr,
          org: org,
          ofc: ofc
        }),
        dataType: "html",
        async: false,
        success: function (data) {

          if (parseInt(data) > 0) {
            //insercion del detalle del lote
            arrayProductos.forEach(function (d, i) {
              $.ajax({
                url: "../models/Mensajeros.php",
                global: false,
                type: "POST",
                data: ({
                  op: "P_DESPACHO_LOTES_DET_I",
                  num_fact: d.num_fact,
                  flete: d.flete,
                  guia: d.guia,
                  id: parseInt(data),
                  reexpide: d.reexpide,
                  idReexpide: d.idReexpide,
                  GruLab: d.GruLab
                }),
                dataType: "html",
                async: false,
                success: function (data) {
                }
              });
            });
            Limpiar();
            GenerarPlanilla(parseInt(data));
            //--------------------------------------------------------------------------------	   
          } else {
            Swal.fire('Oops!', 'No se pudo guardar el registro! \n' + data, 'warning');
            return false;
          }
        }
      });

    } else {
      Swal.fire('Oops!', 'El valor de flete de la factura, debe ser digitado!', 'warning');
      return false;
    }


  } else {
    Swal.fire('Oops!', 'Es necesario cargar por lo menos una factura', 'warning');
  }
}

function FinalizarProceso(id) {
  $.ajax({
    url: "../models/Mensajeros.php",
    global: false,
    type: "POST",
    data: ({
      op: "P_DESPACHO_LOTES_DET_U",
      id: id,
      nota: $.trim($("#txtNotas").val())
    }),
    dataType: "html",
    async: false,
    success: function (data) {
      if (parseInt(data) > 0) {
        Swal.fire('', 'Proceso finalizado!', 'success');
        Limpiar();
      } else {
        Swal.fire('Oops!', 'No se pudo finalizar el proceso de empaque!', 'warning');
      }
    }
  });
}

var tablaExcel = '';

function ListarDespachos() {

  $("#dvListaDespachosExcel").html('');

  $.ajax({
    url: "../models/Mensajeros.php",
    global: false,
    type: "POST",
    beforeSend: function () {
      LoadImg('Cargando Información...');
    },
    data: ({
      op: "P_DESPACHO_LOTE_S",
      fhini: $("#fhIni").val(),
      fhfin: $("#fhFin").val(),
      oficina: $("#TxtOficina2").val(),
    }),
    dataType: "json",
    async: true,
    success: function (data) {
      if (data != '' && data != null) {

        let tablaExcel = '';

        var tabla = '<table class="table table-bordered table-hover table-sm w-100" id="tdListaDespacho">'
          + '<thead>'
          + '<th class="bag-info size-14 text-green">N° LOTE</th>'
          + '<th class="bag-info size-14 text-green">FECHA/HORA</th>'
          + '<th class="bag-info size-14 text-green text-center">ORGANIZACIÓN</th>'
          + '<th class="bag-info size-14 text-green text-center">OFICINA</th>'
          + '<th class="bag-info size-14 text-green">TIPO USUARIO</th>'
          + '<th class="bag-info size-14 text-green">USUARIO</th>'
          + '<th class="bag-info size-14 text-green text-center">N° ENTREGAS</th>'
          + '<th class="bag-info size-14 text-green text-center">N° FINALIZADOS</th>'
          + '<th class="bag-info size-14 text-green text-center">ESTADO GRAL</th>'
          + '<th class="bag-info size-14 text-green">PLANILLA</th>'
          + '</thead>'
          + '<tbody>';
        tablaExcel += '<table class="table" width="100%" id="tdListaDespachoExcel">'
          + '<thead>'
          + '<th class="bag-info size-14 text-green">N° LOTE</th>'
          + '<th class="bag-info size-14 text-green">FECHA/HORA</th>'
          + '<th class="bag-info size-14 text-green text-center">ORGANIZACIÓN</th>'
          + '<th class="bag-info size-14 text-green text-center">OFICINA</th>'
          + '<th class="bag-info size-14 text-green">TIPO USUARIO</th>'
          + '<th class="bag-info size-14 text-green">USUARIO</th>'
          + '<th class="bag-info size-14 text-green text-center">N° ENTREGAS</th>'
          + '<th class="bag-info size-14 text-green text-center">N° FINALIZADOS</th>'
          + '<th class="bag-info size-14 text-green text-center">ESTADO GRAL</th>'
          + '<th class="bag-info size-14 text-green">PLANILLA</th>'
          + '</thead>'
          + '<tbody>';

        for (var i = 0; i < data.length; i++) {
          d = data[i];
          var estado = '';
          var sw = '';
          if (parseInt(d.CANT_ENTREGAS) != parseInt(d.ENTREGADOS) || (parseInt(d.CANT_ENTREGAS) == 0)) {
            estado = "<img src='../resources/icons/CirculoRojo.png' align='absmiddle' width='14' height='14'/>";
            sw = 'D';
          } else {
            estado = "<img src='../resources/icons/CirculoVerde.png' align='absmiddle' width='14' height='14'/>";
            sw = 'E';
          }
          color = "";
          if (parseInt(d.CANT_ENTREGAS) == 0) {
            tabla += '<tr>';
            color = 'bgcolor="#D8D8D8"';
          } else {
            tabla += '<tr onDblClick="ListarDespachosDetalle(\'' + d.ID + '\')">';
          }
          tablaExcel += `<tr>`

          tabla += '<td class="size-13 vertical" ' + color + '>' + d.ID + '</td>'
            + '<td class="size-13 vertical" ' + color + '>' + d.FECHA_LOTE + '</td>'
            + '<td class="size-13 vertical text-center" ' + color + '>' + d.ORGANIZACION + '</td>'
            + '<td class="size-13 vertical text-center" ' + color + '>' + d.OFICINA_VENTAS + '</td>'
            + '<td class="size-12 vertical" ' + color + '>' + d.TIPO_USUARIO + '</td>'
            + '<td class="size-12 vertical" ' + color + '>' + d.USUARIO + '</td>'
            + '<td class="size-13 vertical text-center" ' + color + '>' + d.CANT_ENTREGAS + '</td>'
            + '<td class="size-13 vertical text-center" ' + color + '>' + d.ENTREGADOS + '</td>'
            + '<td align="center" ' + color + '>' + estado + '</td>'
            + '<td align="center" ' + color + '>'
            + '<button type="button" class="btn btn-outline-primary btn-sm btn-sm-custom" onclick="GenerarPlanilla(\'' + d.ID + '\')">'
            + '<i class="fa-solid fa-list-ul fa-md"></i> '
            + '</button>'
            +
            // '<input type="button" class="btn btn-default" >'+
            '</td>'
            + '<td style="display:none;" ' + color + '  align="center">' + sw + '</td>'
            + '</tr>';

          tablaExcel += '<td>' + d.ID + '</td>'
            + '<td>' + d.FECHA_LOTE + '</td>'
            + '<td>' + d.ORGANIZACION + '</td>'
            + '<td>' + d.OFICINA_VENTAS + '</td>'
            + '<td>' + d.TIPO_USUARIO + '</td>'
            + '<td>' + d.USUARIO + '</td>'
            + '<td>' + d.CANT_ENTREGAS + '</td>'
            + '<td>' + d.ENTREGADOS + '</td>';

          if (parseInt(d.CANT_ENTREGAS) != parseInt(d.ENTREGADOS) || (parseInt(d.CANT_ENTREGAS) == 0)) {
            tablaExcel += '<td align="center" >Pendiente</td>';
          } else {
            tablaExcel += '<td align="center" >Terminada</td>';
          }

          tablaExcel += '</tr>';
        }
        tabla += '</tbody></table>';
        tablaExcel += '</tbody></table>';

        $("#dvListaDespachos").html(tabla);
        $("#dvListaDespachosExcel").html(tablaExcel);
      } else {
        $("#dvListaDespachos").html('<div class="alert alert-danger" role="alert">'
          + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
          + '<span class="sr-only">Error:</span>  NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS' + '</div>');
        $("#dvListaDespachosExcel").html('')
      }
    }
  }).always(function () {
    UnloadImg();
  });
}
//
function seleccionar(ob) {
  $(ob).select();
}
//
function UpdateFlete(ob) {
  fila = $(ob).parent().parent();
  id = fila.find("td").eq(0).html();

  flete_ant = fila.find("td").eq(14).html();
  valor = $(ob).val();

  if (!isNaN(valor)) {

    $.ajax({
      url: "../models/Mensajeros.php",
      global: false,
      type: "POST",
      data: ({
        op: "UDATE_FLETE",
        id: id,
        valor: valor
      }),
      dataType: "html",
      error: function () {
        fila.find("td").eq(8).find("input").val(flete_ant);
      },
      async: true,
      success: function (data) {

        if (data > 0) {
          fila.find("td").eq(8).find("input").val(valor);
        } else {
          Swal.fire('Error', 'No se puedo modificar el valor del flete. Por favor intente nuevamante!', 'error');
          fila.find("td").eq(8).find("input").val(flete_ant);
        }
      }
    }).fail(function (data) {
      Swal.fire('Error', 'No se puedo modificar el valor del flete. Por favor intente nuevamante!', 'error');
      fila.find("td").eq(8).find("input").val(flete_ant);
    });
  } else {
    fila.find("td").eq(8).find("input").val(flete_ant);
  }

}
//

function UpdateGuia(ob) {

  fila = $(ob).parent().parent();
  id = fila.find("td").eq(0).html();

  guia_ant = fila.find("td").eq(16).html();
  valor = $(ob).val();

  if (!isNaN(valor)) {

    $.ajax({
      url: "../models/Mensajeros.php",
      global: false,
      type: "POST",
      data: ({
        op: "UPDATE_GUIA",
        id: id,
        valor: valor
      }),
      dataType: "html",
      error: function () {
        fila.find("td").eq(15).find("input").val(guia_ant);
      },
      async: true,
      success: function (data) {

        if (data > 0) {
          fila.find("td").eq(15).find("input").val(valor);
        } else {
          Swal.fire('Error', 'No se puedo modificar el valor del flete. Por favor intente nuevamante!', 'error');
          fila.find("td").eq(15).find("input").val(guia_ant);
        }
      }
    }).fail(function (data) {
      Swal.fire('Error', 'No se puedo modificar el valor la guia. Por favor intente nuevamante!', 'error');
      fila.find("td").eq(15).find("input").val(guia_ant);
    });
  } else {
    fila.find("td").eq(15).find("input").val(guia_ant);
  }

}

///
function ListarDespachosDetalle(id) {
  $.ajax({
    url: "../models/Mensajeros.php",
    global: false,
    type: "POST",
    data: ({
      op: "P_DESPACHO_LOTE_DET_S",
      id: id
    }),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data != '' && data != null) {
        var tabla = '<table class="table" width="100%" id="tdDetallePlanilla">'
          + '<thead>'
          + '<th class="bag-info text-green size-14">#ID</th>'
          + '<th class="bag-info text-green size-14">FACTURA</th>'
          + '<th class="bag-info text-green size-14">INICIO</th>'
          + '<th class="bag-info text-green size-14">FIN</th>'
          + '<th class="bag-info text-green size-14">#CAJAS</th>'
          + '<th class="bag-info text-green size-14">#PAQ</th>'
          + '<th class="bag-info text-green size-14">CIUDAD</th>'
          + '<th class="bag-info text-green size-14">DIRECCION</th>'
          + '<th class="bag-info text-green size-14">FLETE</th>'
          + '<th class="bag-info text-green size-14">NOTA</th>'
          + '<th class="bag-info text-green size-14">ESTADO</th>'
          + '<th class="bag-info text-green size-14">LIBERAR</th>'
          + '<th class="bag-info text-green size-14">R</th>'
          + '<th class="bag-info text-green size-14">GUIA</th>'
          + '</thead>'
          + '<tbody>';
        for (var i = 0; i < data.length; i++) {
          d = data[i];
          var estado = '';
          var elimin = '';
          var status = '';
          switch (d.ESTADO) {
            case 'D':
              {
                estado = "<img src='../resources/icons/CirculoRojo.png' align='absmiddle' width='14' height='14'/>";
                elimin = "<img src='../resources/icons/DeleteG.png' align='absmiddle' width='18' height='18'/>";

              }
              break;
            case 'E':
              {
                estado = "<img src='../resources/icons/CirculoVerde.png' align='absmiddle' width='14' height='14'/>";
                elimin = "<img src='../resources/icons/DeleteG.png' align='absmiddle' width='18' height='18'/>";
                status = "disabled";
              }
              break;
          }
          tabla += '<tr>'
            + '<td class="size-13 vertical">' + d.ID + '</td>'
            + //0
            '<td class="size-13 vertical">' + d.NUMERO_FACTURA + '</td>'
            + //1
            '<td class="size-13 vertical">' + d.FECHA_INICIO + '</td>'
            + //2
            '<td class="size-13 vertical">' + d.FECHA_FIN + '</td>'
            + //3
            '<td class="size-13 vertical">' + d.N_CAJAS + '</td>'
            + //4
            '<td class="size-13 vertical">' + d.N_PAQUETES + '</td>'
            + //5
            '<td class="size-13 vertical">' + d.CIUDAD + '</td>'
            + //6
            '<td class="size-13 vertical">' + d.DIRECCION + '</td>'; //7
          //verifico si e tipo de usuario es 3--
          switch (parseInt(d.TIPO_T_ID)) {
            case 0:
              tabla += '<td class="size-13 vertical">' + formatNum(d.FLETE, '$') + '</td>'; //8
              break;
            case 3:
              tabla += '<td class="size-13 vertical"><input type="text" size="10" class="ClassNumero form-control form-control-sm shadow-sm size-14" onfocus="seleccionar(this)" ' + status + ' onblur="UpdateFlete(this)"  value="' + parseFloat(d.FLETE) + '" onkeypress="return vnumeros(event)" /></td>'; //8
              break;
            default:
              tabla += '<td class="size-13 vertical">' + formatNum(d.FLETE, '$') + '</td>'; //8
              break;
          }
          //*********************************************************+


          //**********************************************************
          tabla += '<td class="size-13 vertical">' + d.NOTA_ENTREGA + '</td>'
            + //9
            '<td class="size-13 vertical" align="center">' + estado + '</td>'
            + //10
            '<td class="size-13 vertical" align="center" onclick ="LiberarFactura(this,\'' + d.ESTADO + '\')">' + elimin + '</td>'
            + //11
            '<td class="size-13 vertical" style="display:none;">' + d.ID_LOTE + '</td>'
            + //12
            '<td class="vertical text-center"><input type="checkbox" class="InputG" ' + status + '></td>'
            + //13
            '<td class="size-13 vertical" style="display:none">' + d.FLETE + '</td>';
          switch (parseInt(d.TIPO_T_ID)) {
            case 3:
              tabla += '<td class="size-13 vertical"><input type="text" size="10" class="ClassNumero form-control form-control-sm size-14 shadow-sm" onfocus="seleccionar(this)" "' + status + '" onblur="UpdateGuia(this)"  value="' + (d.GUIA) + '"/></td>'; //15
              break;
          }
          tabla += '<td style="display:none">' + d.GUIA + '</td>'; //16
          tabla += '</tr>';
        }
        tabla += '</tbody></table>';
        $("#idPlanilla").val(id);
        $("#dvResultDetalle").html(tabla);
      } else {
        $("#dvResultDetalle").html('<h3>No existen registros para las condiciones seleccionadas!</h3>');
      }
    }
  });
  $("#dvListaDespachosDetalle").modal('show');
}

function DespacharVarios() {
  var idRol = $("#TxtIdRol").val();
  var Org = $("#TxtOrg").val();
  var cont = 0;
  if (idRol == 1 || idRol == 24 || idRol == 23 || idRol == 4 || Org == 1000) {
    $("#tdDetallePlanilla tr:gt(0)").each(function (index, element) {
      if ($(this).find('td').eq(13).find('input').is(':checked')) {
        var id = $(this).find('td').eq(0).html();
        var idLote = $(this).find('td').eq(12).html();
        var nota = '';
        $.ajax({
          url: "../models/Mensajeros.php",
          global: false,
          type: "POST",
          data: ({
            op: "P_DESPACHO_LOTES_DET_U",
            id: id,
            nota: $.trim($("#txtNotas").val())
          }),
          dataType: "html",
          async: false,
          success: function (data) {
            ListarDespachosDetalle(idLote);
          }
        });
        cont++;
      }
    });
    if (cont == 0) {
      Swal.fire('Oops', 'No hay nada que despachar', 'error');
    }
  } else {
    Swal.fire('Error', 'Usuario no autorizado para realizar este procedimiento!', 'error');
  }
}
var select = '';
const cargarMotivosAnulacion = async () => {

  try {
    const data = {
      link: '../models/motivosAnulacionPlanillas.php',
      op: 'S'
    }

    resp = await enviarPeticion(data);
    select = '<select id="slcTipoLib"  class="InputG form-control form-control-sm">';

    if (resp.length > 0) {

      resp.forEach(item => {
        select += '<option value="' + item.id + '">' + item.motivo + '</option>';
      })

    }
    select += '</select>';
  } catch (e) {
    console.error(e)
  }

  return select;
}

cargarMotivosAnulacion();


function LiberarFactura(ob, status) {
  var idRol = $("#TxtIdRol").val();
  var obj = $(ob).parent().find('td');
  var Org = $("#TxtOrg").val();
  if (status != 'E') {
    if (idRol == 1 || idRol == 24 || idRol == 4 || Org == 1000 || idRol == 23) {
      Swal.fire({
        title: "Liberar Factura",
        text: "Despues de aceptar no podra reversar la operacion!",
        type: "warning",
        html: select,
        showCancelButton: true,
        confirmButtonColor: "#82ED81",
        cancelButtonColor: "#FFA3A4",
        confirmButtonText: "Enviar!",
        cancelButtonText: "No Enviar",
        closeOnConfirm: false,
        closeOnCancel: false
      }).then((result) => {
        if (result.value) {
          var slcTipoLib = $("#slcTipoLib").val();
          var idLoteDet = $.trim(obj.eq(0).html());
          var idLote = $.trim(obj.eq(12).html());
          var Numfact = $.trim(obj.eq(1).html());
          Liberarfactura(idLoteDet, slcTipoLib, idLote, Numfact);
          ListarDespachos();
          ListarDespachosDetalle(idLote)
        } else {
          Swal.fire("Cancelado", "La liberacion ha sido cancelada!", "error");
        }
      })

    } else {
      Swal.fire('Error', 'Usuario no autorizado para liberar facturas!', 'error');
    }
  } else {
    Swal.fire('Error', 'No es posible liberar una factura finalizada', 'error');
  }
}

function Liberarfactura(idLoteDet, tipoLib, idLote, Numfact) {
  var id = idLote;
  var id_det = idLoteDet;
  var id_user = $("#TxtIdu").val();
  var id_con = tipoLib;
  var num_fact = Numfact;
  $.ajax({
    url: "../models/Mensajeros.php",
    global: false,
    type: "POST",
    data: ({
      op: "P_LIBERAR_DESPACHO",
      id: id,
      id_det: id_det,
      id_user: id_user,
      id_con: id_con,
      num_fact: num_fact
    }),
    dataType: "html",
    async: false,
    success: function (data) {

    }
  }).always(function (data) {
    console.log(data);
  });
}
// FUNCÓN IFRAME GENERAR PLANILLA
function GenerarPlanilla(id) {
  $("#dvPDFPlanilla").html(`<iframe width="100%" style="height: 400px;" src="../resources/tcpdf/PlanillaDespacho.php?id=${id}" />`);
  $("#dvPlanillaPDF").modal('show');
}
// FUNCIÓN FITRO POR ESTADOS
function FiltroEstado(op) {
  switch (op) {
    case "E":
      $("#tdListaDespacho tbody tr").each(function () {
        let ob = $(this).find('td').eq(10).html();
        if (ob == 'E') $(this).show();
        else $(this).hide();
      });
      break; // Color Rojo

    case "D":
      $("#tdListaDespacho tbody tr").each(function () {
        let ob = $(this).find('td').eq(10).html();
        if (ob == 'D') $(this).show();
        else $(this).hide();
      });
      break; // Color Gris

    case "T":
      $("#tdListaDespacho tbody tr").each(function () {
        $(this).show();
      });
      break;
  }
}
// FUNCIÓN PARA MONTAR EL LOADING
function LoadImg(texto = "Cargando...") {
  let n = 0;

  const html = `
  <img src="../resources/icons/preloader.gif" alt="Cargando..." />
  <figcaption style="font-size: 23px; margin-bottom: 5px; font-weight: bold; text-align: center;">${texto}</figcaption>
  <figcaption id="txtTimer" style="font-weight: bold;">0</figcaption>`;

  const loader = document.getElementById("loaderRD");
  loader.innerHTML = html;
  loader.style.display = "flex";

  window.timerInterval = setInterval(() => {
    if (document.getElementById("txtTimer")) document.getElementById("txtTimer").textContent = ++n;
  }, 1000);
}
// FUNCIÓN PARA DESMONTAR EL LOADING
function UnloadImg() {
  clearInterval(window.timerInterval);
  const loader = document.getElementById("loaderRD");
  loader.style.display = "none";
  loader.innerHTML = "";
}
// FUNCIÓN AGREGAR FACTURA A PLANILLA
const AddFacturaPlanilla = () => {
  $("#addCodigo").val('');
  $("#addCliente").val('');
  $("#addCiudad").val('');
  $("#addNumeroFactura").val('');
  $("#addFlete").val('$0');
  $("#addGuia").val('');
  $("#dvAddFactura").modal('show');
  $("#addNumeroFactura").focus();
  $("#addNumeroFactura").attr('disabled', false)
}
// FUNCIÓN CARGAR DATOS DE FACTURA
const cargarDatosFacturaAdd = async (numero) => {
  const data = {
    link: "../models/Mensajeros.php",
    op: "P_DESPACHOS_S",
    numero: numero
  }
  try {
    const resp = await enviarPeticion(data);
    if (resp.length > 0) {
      resp.forEach(function (d) {
        if (parseInt(d.id_reg_empaque) > 0) {
          if (d.estado == 'T') {
            if (parseInt(d.id_lote_det) == 0 || $.trim(d.estado_despacho) == 'L') {
              $("#addCodigo").val(d.codigo_sap);
              $("#addCliente").val(d.razon_comercial);
              $("#addCiudad").val(d.ciudad + "/" + d.departamento);
              $("#addFlete").val('$0');
              $("#addGuia").val('');
              $("#addNumeroFactura").attr('disabled', true)
            } else {
              $("#addNumeroFactura").val('');
              Swal.fire('Oops!', 'Ya esta factura tiene registro de despacho', 'warning');
              return false;
            }
          } else {
            $("#addNumeroFactura").val('');
            Swal.fire('Oops!', 'No se ha terminado el proceso de  empaque, por lo tanto no se puede iniciar despacho', 'warning');
            return false;
          }
        } else {
          $("#addNumeroFactura").val('');
          Swal.fire('Oops!', 'No se tiene registro de empaque, por lo tanto no se puede iniciar despacho', 'warning');
          return false;
        }
      });
    } else {
      $("#addNumeroFactura").val('');
      Swal.fire('Oops!', 'No se encontraron resultados!', 'warning');
    }
  } catch (e) {
    console.log(e);
  }
}
// FUNCIÓN ACTUALIZAR FACTURA
const updatePlanilla = async () => {
  let id = $("#idPlanilla").val();
  let num_fact = $("#addNumeroFactura").val();
  let flete = unformatNum($("#addFlete").val());
  let guia = $("#addGuia").val();


  if (id === "" || num_fact === "" || flete === "" || guia === "") {
    Swal.fire('Oops!', 'Por favor, completa todos los campos.', 'warning');
    return;
  }
  if (flete == 0) {
    Swal.fire('Oops!', 'El flete no puede ser cero.', 'warning');
    return;
  }

  let reexpide = 'N';
  let idReexpide = 0;
  let GruLab = 0;

  const data = {
    link: "../models/Mensajeros.php",
    op: "P_DESPACHO_LOTES_DET_I",
    num_fact,
    flete,
    guia,
    id,
    reexpide,
    idReexpide,
    GruLab
  }
  try {
    const resp = await enviarPeticion(data);
    if (parseInt(resp) > 0) {
      Swal.fire('Excelente', 'Factura agregada satisfactoriamente.', 'success');
    } else {
      Swal.fire('Error', 'No fue posible adicionar la factura', 'error');
    }
    ListarDespachosDetalle(id);
    $("#dvAddFactura").modal('hide');
  } catch (e) {
    console.log(e);
  }
}
// FUNCIÓN PARA OCULTAR FACTURAS MUY EXTENSAS
const resumirFacturas = (facturasCeldas) => {
  facturasCeldas.forEach(celda => {
    const texto = celda.textContent.trim();
    const facturas = texto.split(" - ");
    celda.textContent = "";

    if (facturas.length > 2) {
      const resumen = facturas.slice(0, 2).join(" - ");
      const ocultas = facturas.slice(2).join(" - ");

      const spanResumen = document.createElement("span");
      spanResumen.textContent = resumen + " ... ";

      const btn = document.createElement("button");
      btn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
      btn.classList.add("btn");
      btn.classList.add("btn-outline-primary");
      btn.classList.add("btn-sm");
      btn.classList.add("fw-bold");
      btn.setAttribute("title", "Ver mas...");
      btn.onclick = () => {
        Swal.fire("Facturas:", `${facturas.join("-")}`, "info");
      };

      celda.appendChild(spanResumen);
      celda.appendChild(btn);

    } else {
      celda.textContent = facturas.join(" - ");
    }
  });
}

// EJECUCIÓN DE LAS FUNCIONALIDADES AL CARGAR EL DOM
$(function () {
  $('#consultarDetallePlanilla').click(async function () {
    await ConsultarDetallePlanilla();
    mostrarDetallePlanilla(arrayDespachosFiltrados);

    llenarSelect("#filtroLista", "LISTA", arrayDespachosFiltrados);
    llenarSelect("#filtroZona", "ZONA", arrayDespachosFiltrados);
    llenarSelect("#filtroCliente", "CLIENTE", arrayDespachosFiltrados);
    llenarSelect("#filtroCiudad", "CIUDAD", arrayDespachosFiltrados);
    llenarSelect("#filtroTransportador", "TRANSPORTADOR", arrayDespachosFiltrados);
    llenarSelect("#filtroCodigo", "CODIGO_SAP", arrayDespachosFiltrados);

    document.querySelectorAll('#filtroLista, #filtroZona, #filtroCliente, #filtroCiudad, #filtroTransportador, #filtroCodigo')
    .forEach(select => select.addEventListener('change', () => {
      aplicarFiltros(arrayDespachosFiltrados);
    }));
  });

  $("#exportarExcel").click(function () {
    fnExcelReport('tdListaDespachoExcel');
  })

  if ($("#TxtIdRol").val() != 23 && $("#TxtIdRol").val() != 1) {
    $("#exportarExcel").remove();
  }

  $(".ClassNumero").maskMoney({
    selectAllOnFocus: true,
    prefix: '$',
    thousands: '.',
    decimal: ',',
    allowZero: true,
    precision: 0
  });

  $("#btnPlanilla").on('click', function () {
    ListarDespachos();
  });

  $('#fhFin,#fhIni,#fhFinD,#fhIniD').datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dateFormat: 'mm-dd-yy',
    width: 100,
    heigth: 100
  }).datepicker("setDate", new Date());

  $('#fhFin,#fhIni,#TxtOficina2').change(function () {
    ListarDespachos();
  });

  Limpiar();

  $("#TxtOficina").change(function () {
    if ($("#TxtTipoEnvio").val() == 'T') {
      CargarTransportador()
    } else {
      CargarEmpacador();
    }
  });

  $("#TxtTipoEnvio").change(function () {
    if ($(this).val() == 'T') {
      CargarTransportador()
    } else {
      CargarEmpacador();
    }
  });

  $("#TxtNFactura").focus();
  
  $("#TxtNFactura").keyup(function (e) {
    tecla = $(document.all) ? e.keyCode : e.which;
    dato = $.trim($(this).val());
    if ($.trim(dato) != "") {
      if (tecla == 13) {
        CargarDatosFactura();
      }
    }
  });

  $("#BtnProceso").click(function () {
    IniciarProceso();
  });

  if ($("#TxtTipoEnvio").val() == 'M') {
    $("#trMensajeros").show();
    $("#trTransportador").hide();
  } else {
    $("#trMensajeros").hide();
    $("#trTransportador").show();
  }

  $("#TxtTipoEnvio").change(function () {
    if ($(this).val() == 'M') {
      $("#trMensajeros").show();
      $("#trTransportador").hide();
    } else {
      $("#trMensajeros").hide();
      $("#trTransportador").show();
    }
  });

  $("#slcStatus").change(function () {
    FiltroEstado($(this).val())
  });

  $(".ClassNumero").maskMoney({
    selectAllOnFocus: true,
    prefix: '$',
    thousands: '.',
    decimal: ',',
    precision: 0
  });

  $("#totFletes").focus(function () {
    $("#totFletes").val(unformatNum($(this).val()));
    $(this).select();
  });

  $("#totFletes").focusout(function () {
    $(this).val(formatNum($(this).val(), '$'));
  });

  $("#btn_lista_precios").click(function () {
    $("#dvListaFletes").modal('show');
  });
  
  let listas = '';
  for (var i = 1; i < 100; i++) {
    let ln = (String(i)).length;
    let op = '';
    if (ln == 1) {
      op = '0' + String(i);
    } else {
      op = i;
    }
    listas += '<option value="' + op + '">' + op + '</option>';
  }

  $("#ListaFlete, #ListaFleteEdi").html(listas);

  ConsultaListaFlete();

  $("#TxtOficina").change(function () {
    ConsultaListaFlete();
  });

  if ($("#TxtIdRol").val() == 1 || $("#TxtIdRol").val() == 23) {
    $("#btn_lista_precios").show();
  } else {
    $("#btn_lista_precios").hide();
  }

  $("#btnAddFactura").click(function () {
    AddFacturaPlanilla();
  });

  $("#addNumeroFactura").keyup(function (e) {
    tecla = $(document.all) ? e.keyCode : e.which;
    dato = $.trim($(this).val());
    if ($.trim(dato) != "") {
      if (tecla == 13) {
        cargarDatosFacturaAdd(dato);
      }
    }
  });

  $("#btnUpdPlanilla").click(async function () {
    const result = await confirmAlert("Confirmación", "¿Desea realmente adicionar esta factura?");
    if (result.isConfirmed) {
      updatePlanilla();
    } else {
      Swal.fire("Cancelado", "La operacion ha sido cancelada!", "error");
    }   
  });

  $("#modalEditarLista").on("hidden.bs.modal", () => {
    $('#dvListaFletes').modal("show");
  });

  $('#btnEditarLista').click(async function () {
    const idLista = $('#idListaHidden').val();    
    EditarListaFlete(idLista);
  });
});