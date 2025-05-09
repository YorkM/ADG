// JavaScript Document
// JavaScript Document 
const TemasCartera = [

  'NA',
  'Saldo Vencido',
  'Cupo Excedido',
  'Pendiente tramite documentos',
  'Otros Causas de Cartera'
]

const TemasCarteraVencimiento = [

  'NA',
  'Solicita acuerdo de pago',
  'No tiene forma de pagar',
  'Solicita estado de cartera',
  'Pago por  programar',
  'Pago ya realizado',
  'Otro',
]
let causalesNoventas = [];

const cargarMotivosNoVenta = async () => {

  try {
    data = {
      link: '../models/ProgramacionCliente.php',
      op: "cargarMotivosNoVenta"
    }

    resp = await enviarPeticion(data)
    causalesNoventas[0] = 'NA'
    resp.forEach(ele => {
      causalesNoventas.push(ele.motivo);
    });

  } catch (e) {
    console.error(e)
  }
}
cargarMotivosNoVenta();

modoSeleccion = false;

function validarSleccionados() {
  cont = 0;
  $("#datos_visitas tr:gt(0)").each(function () {
    if ($(this).hasClass("seleccionada")) {
      cont++;
    }
  });
  if (cont > 0) {
    $("#eliminar_programacion").show();
  } else {
    $("#eliminar_programacion").hide();
  }
}

// EJECUCIÓN DE FUNCIONALIDADES
$(function () {
  $("#eliminar_programacion").click(async function () {
    try {
      ids = [];

      if (confirm("Está seguro de que desea eliminar las programaciones? ")) {

        $("#datos_visitas tr:gt(0)").each(function () {
          if ($(this).hasClass("seleccionada")) {
            console.log()
            id = $.trim($(this).find("td").eq(27).html());
            if (id !== undefined) {
              ids.push(id);
            }
          }
        });

        if (ids.length == 0) {
          Swal.fire("Info", "No se encontraron datos seleccionados", "waring");
        }

        resp = await enviarPeticion({
          op: 'eliminar_programacion',
          link: '../models/SeguimientoVisitas.php',
          ids
        });

        if (resp.ok) {
          Swal.fire("Ok", resp.message, "success");
          Consultar();
        }

      }
    } catch (error) {
      console.error(error)
    }

  })

  $("#chk_seleccionar").change(function () {

    if ($("#Result").html() != '') {

      $("#datos_visitas tr:gt(0)").each(function () {
        tr = $(this);
        estado = $.trim(tr.find("td").eq(28).html());
        if ($("#chk_seleccionar").is(":checked")) {
          if (estado == 'P') {
            tr.addClass("seleccionada");
            tr.find("td").addClass("btn-primary")
          }

        } else {
          tr.removeClass("seleccionada");
          tr.find("td").removeClass("btn-primary")
        }
      })
    }

    validarSleccionados();
  })

  $("#SeleccionarProg").click(function () {

    modoSeleccion = !modoSeleccion;

    if ($("#Result").html() != '') {

      if (!modoSeleccion) {
        $(this).removeClass("btn-info");
        $(this).html(`Seleccionar prog.(Desactivado)`);
        $("#span_chk_seleccionar").hide();
        $("#eliminar_programacion").hide();
        $("#datos_visitas tr:gt(0)").each(function () {
          $(this).removeClass("seleccionada");
          $(this).find("td").removeClass("btn-primary")
        });
        return;
      }
      $(this).addClass("btn-info");
      $(this).html(`<i class="fa fa-check "></i>&nbsp;<b>Seleccionar prog.(Activado)</b>`);
      $("#span_chk_seleccionar").show();
    }
  })


  $("#btn-version-actual").click(function () {
    $("#ModalGestionVersion").modal("hide");
    abrirVersionActual();
  });

  $("#btn-version-beta").click(function () {
    $("#ModalGestionVersion").modal("hide");
    abrirVersionBeta();
  })


  $("#Organizacion").val(parent.parent.$("#org").val());
  $("#fecha_ini").datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dateFormat: 'dd-mm-yy',
    width: 100,
    heigth: 100,
  });
  $("#fecha_fin").datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dateFormat: 'dd-mm-yy',
    width: 100,
    heigth: 100,
  });
  $("#fecha_ini").val(FechaActual());
  $("#fecha_fin").val(FechaActual());

  //--------------------------------------------------------------------
  TipoUsuario();
  CargarEjecutivos();
  $("#tipo").change(function () {
    CargarEjecutivos();
  });
  ///oficina de ventas
  let OfcS = OficinasVentas('N');
  $("#oficina").append(OfcS);
  $("#oficina").change(function () {
    CargarEjecutivos();
  });

  // CÓDIGO AGREGADO 2025
  $("#txtZonas, #FiltroOficinaVentas").select2();
  $("#txtFecha1, #txtFecha2").val(FechaActual());
  $("#txtFecha1, #txtFecha2").datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dateFormat: 'dd-mm-yy',
    width: 100,
    heigth: 100
  });

  getZonasVentas();
  const oficinas = OficinasVentas('S');
  $("#FiltroOficinaVentas").html(oficinas);

  // OBTENER REPORTE VISITAS POR ZONAS
  getReporteVisitasZonas();

  // CLICK PARA CONSULTAR REPORTE CON FILTRO
  $('#btnBuscar').click(function () {
    getReporteVisitasZonas();
  });

  // CLICK EXPORTAR A EXCEL
  $('#btnExportar').click(function () {
    exportarExcel();
  });

  // REESTABLECER LOS FILTROS, CONSULTA PRINCIPAL
  $('#btnLimpiar').click(function () {
    getZonasVentas();
    const oficinas = OficinasVentas('S');
    $("#FiltroOficinaVentas").html(oficinas);

    $("#txtFecha1, #txtFecha2").val(FechaActual());
    $("#txtFecha1, #txtFecha2").datepicker({
      changeMonth: true,
      changeYear: true,
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      dateFormat: 'dd-mm-yy',
      width: 100,
      heigth: 100
    });

    getReporteVisitasZonas();
  });

  // SETEO DE LAS ZONAS DEPENDIENDO DE LA OFICINA
  $('#FiltroOficinaVentas').change(async function () {
    const filtro = this.value;

    const resp = await enviarPeticion({
      op: "G_ZONAS_VENTAS",
      link: "../models/SeguimientoVisitas.php"
    });

    let zona = filtro.substring(0, 2);
    let zonasFiltradas = '';

    if (zona == 10 || zona == 20) zonasFiltradas = resp.filter(item => item.ZONA_VENTAS.substring(0, 1) === filtro.substring(0, 1));
    else zonasFiltradas = resp.filter(item => item.ZONA_VENTAS.substring(0, 2) === filtro.substring(0, 2));

    let zonas = `<option value="0">000000 - TODAS</option>`;

    zonasFiltradas.forEach(item => {
      zonas += `<option value="${item.ZONA_VENTAS}">${item.ZONA_VENTAS} - ${item.ZONA_DESCRIPCION}</option>`;
    });

    $('#txtZonas').html(zonas);
  });

  // FILTRO ZONAS
  $('#txtZonas').change(function () {
    const filtro = this.value;
    filtrar(filtro);
  });
});

// FUNCIONES GENERALES
// OBTENER LAS ZONAS DE VENTA
const getZonasVentas = async () => {
  const resp = await enviarPeticion({
    op: "G_ZONAS_VENTAS",
    link: "../models/SeguimientoVisitas.php"
  });

  let zonas = `<option value="0">000000 - TODAS</option>`;
  let filtro = $('#FiltroOficinaVentas').val();

  let zona = filtro.substring(0, 2);
  let zonasFiltradas = '';

  if (zona == 10 || zona == 20) zonasFiltradas = resp.filter(item => item.ZONA_VENTAS.substring(0, 1) === filtro.substring(0, 1));
  else zonasFiltradas = resp.filter(item => item.ZONA_VENTAS.substring(0, 2) === filtro.substring(0, 2));

  zonasFiltradas.forEach(item => {
    zonas += `<option value="${item.ZONA_VENTAS}">${item.ZONA_VENTAS} - ${item.ZONA_DESCRIPCION}</option>`;
  });

  $('#txtZonas').html(zonas);
}

// EXPORTAR A EXCEL
function exportarExcel(nombreArchivo = "reporte.xlsx", nombreHoja = "Datos") {
  const tabla = document.getElementById("tablaVisitasZona");
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

// FORMATEAR FECHAS
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

// OBTENER EL REPORTE GENERAL
const getReporteVisitasZonas = async () => {
  try {
    let oficinaSubs = $('#FiltroOficinaVentas').val().substring(0, 2);
    let FI = $('#txtFecha1').val().split('-');
    let FF = $('#txtFecha2').val().split('-');
    let oficina;
    if (oficinaSubs === "20" || oficinaSubs === "10") oficina = oficinaSubs.substring(0, 1);
    else oficina = oficinaSubs.substring(0, 2);
    let fechaInicio = `${FI[2]}-${FI[1]}-${FI[0]}`;
    let fechaFinal = `${FF[2]}-${FF[1]}-${FF[0]}`;

    showLoadingSwalAlert2('Cargando los datos...', false, true);

    const resp = await enviarPeticion({
      op: "G_REPORTE_VISITAS_ZONAS",
      link: "../models/SeguimientoVisitas.php",
      oficina,
      fechaInicio,
      fechaFinal
    });

    $('#contenedorTablaVisitasZona').html(``);

    let tabla = `
			<table class="table tabla-fija" id="tablaVisitasZona" style="width: 100%; margin-bottom: 0;">
              <thead>
                <tr>
                  <th class="custom-nowrap-2">N°</th>
                  <th class="custom-nowrap-2">Zona</th>
                  <th class="custom-nowrap-2">Zona Descrip.</th>
                  <th class="custom-nowrap-2">Cl. Programados</th>
                  <th class="custom-nowrap-2">Cl. Visitados</th>
                  <th class="custom-nowrap-2">Cl. Contactados</th>
                  <th class="custom-nowrap-2">Fecha y Hora Inicial</th>
                  <th class="custom-nowrap-2">Fecha y Hora Final</th>
                  <th class="custom-nowrap-2">N° Ped. Ruta del Día</th>
                  <th class="custom-nowrap-2">Valor Ped. Tomados</th>
                  <th class="custom-nowrap-2">Valor Ped. Adicionales</th>
                </tr>
              </thead>
              <tbody>`;

    if (resp.data.length) {
      resp.data.forEach((item, index) => {
        tabla += `
				        <tr>
                  <td class="custom-border">${index + 1}</td>
                  <td class="custom-border">${item.zona_ventas}</td>
                  <td class="custom-border custom-nowrap-2" style="font-size: 12px;">${item.zona_descripcion}</td>
                  <td class="custom-border text-center">${item.programados}</td>
                  <td class="custom-border text-center">${item.visitados}</td>
                  <td class="custom-border text-center">${item.contactados}</td>
                  <td class="custom-border custom-nowrap-2">${(item.fecha_ini_gestion) ? formatDate(item.fecha_ini_gestion) : ''}</td>
                  <td class="custom-border custom-nowrap-2">${(item.fecha_fin_gestion) ? formatDate(item.fecha_fin_gestion) : ''}</td>
                  <td class="custom-border text-center">${item.cantidad_gestionados}</td>
                  <td class="custom-border text-center">${formatNum(item.valor_gestionados, "$")}</td>
                  <td class="custom-border text-center">${formatNum(item.valor_adicionales, "$")}</td>
                </tr>`;
      });

      tabla += `
				      </tbody>
            </table>`;

      $('#contenedorTablaVisitasZona').html(tabla);
    }
  } catch (error) {
    console.log(error);
  } finally {
    dissminSwal();
  }
}

// FILTRAR
const filtrar = (filtro) => {
  const filas = document.querySelectorAll('#tablaVisitasZona tbody tr');

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll('td');
    const coincide = Array.from(celdas).some(td => td.textContent.toLowerCase().includes(filtro));

    fila.style.display = coincide ? '' : 'none';
  });
}

/*VARIBLE EXPORTACION GLOBAL*/
var tabla_exporto = "-";
/***/
function TipoUsuario() {
  $.ajax({
    url: "../models/SeguimientoVisitas.php",
    global: false,
    type: "POST",
    data: ({
      op: 'TIPO_USUARIO',
      depid: $("#IdDpto").val()
    }),
    dataType: "json",
    async: false,
    success: function (data) {
      var lista = '';
      for (var i = 0; i < data.length; i++) {
        lista += '<option value="' + data[i].ID + '">' + data[i].DESCRIPCION + '</option>';
      }
      $("#tipo").html(lista);
    }
  });
}

function CargarEjecutivos() { //alert($("#Organizacion").val());
  $.ajax({
    url: "../models/SeguimientoVisitas.php",
    global: false,
    type: "POST",
    data: ({
      op: 'VENDEDOR',
      tipo: $("#tipo").val(),
      org: $("#Organizacion").val(),
      oficina: $("#oficina").val()
    }),
    dataType: "json",
    async: false,
    success: function (data) {

      // console.log(data);//alert(data); return false;
      var lista = '<option value="0">TODOS</option>';
      for (var i = 0; i < data.length; i++) {
        lista += '<option value="' + data[i].ID + '">' + data[i].LOGIN + ' - ' + data[i].NOMBRES + '</option>';
      }
      $("#ejecutivo").html(lista);
      $("#ejecutivo").select2();
    }
  }).fail(function (error) {
    console.error(error)
  });
}

function Programar(ob, cod_sap) {
  fila = $(ob).parent().parent();
  cliente = fila.find("td").eq(1).html();
  id_ven = fila.find("td").eq(13).html();
  cod_sap_cli = fila.find("td").eq(14).html();
  Swal.fire({
    title: "Desea programar para POSVENTA  ",
    text: "Cliente: " + cliente,
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#82ED81",
    cancelButtonColor: "#FFA3A4",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    closeOnConfirm: true,
    closeOnCancel: false
  }).then((result) => {
    if (result.value) {
      //alert(id_ven+'   '+cod_sap_cli);
      $.ajax({
        url: "../models/SeguimientoVisitas.php",
        global: false,
        type: "POST",
        data: ({
          op: 'P_VISITAS_VENDEDOR_I',
          id_ven: id_ven,
          cod_sap_cli: cod_sap_cli
        }),
        dataType: "html",
        async: false,
        success: function (data) {
          //alert(data);
          if (data > 0) {
            Swal.fire("Ok", "Se programó correctamente el cliente " + cliente + " para POSVENTA !", "success");
          }
        }
      }).always(function (data) {
        //console.log(data);
      });
    } else {
      Swal.fire("Cancelado", "La operacion ha sido cancelada!", "error");
    }
  });
}
//
function ConsultarDatosAsterisk(ob, codigo_sap) {

  var fila = $(ob).parent().parent();
  var telefonos = fila.find("th").eq(2).html();
  var ext = fila.find("th").eq(3).html();
  var idven = fila.find("th").eq(4).html();
  var fecha_ini_ped = fila.find("th").eq(5).html();
  //alert(telefonos+' '+ext+' '+idven+' '+fecha_ini_ped);
  $.ajax({
    url: "../models/SeguimientoVisitas.php",
    global: false,
    type: "POST",
    data: ({
      op: 'GESTION_LLAMADA',
      telefonos: telefonos,
      fecha_ini_ped: fecha_ini_ped,
      idven: idven,
      ext: ext,
      codigo_sap: codigo_sap
    }),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          d = data[i];
          $("#n_contestadas").text(d.contestadas);
          $("#n_no_contestadas").text(d.no_contestadas);
          $("#n_fallidas").text(d.fallida);
          $("#n_ocupadas").text(d.ocupadas);
          $("#m_tiempo_aire").text(d.duracion_min);
          $("#m_min_contestadas").text(d.min_contestadas);
          $("#m_min_no_contestadas").text(d.min_no_contestadas);
          $("#m_min_ocupadas").text(d.min_ocupadas);
          $("#pedidos").text(formatNum(d.pedidos, '$'));

        } //FOR	
        $('#datos_asterisk').dialog({
          title: "Gestion de Llamadas",
          width: $(window).width() * 0.6,
          height: $(window).height() * 0.5,
          modal: true,
        }).width($(window).width() * 0.6);
      } else {
        alert("No se encontraron resultados");
      }

    }

  }).always(function (data) {
    console.log(data);
  });
}
//
function Gestion() {
  var oficina = $("#oficina").val();
  window.open("https://www.pwmultiroma.com/ReportesAutomaticos/RptVisitasLlamadas.php?id_vendedor=" + $("#ejecutivo").val() + "&fh_ini=" + $("#fecha_ini").val() + "&fh_fin=" + $("#fecha_fin").val() + "&oficina=" + oficina + "&id_dpto=" + $("#tipo").val())
}

function GestionPosVentas() {
  var oficina = $("#oficina").val();
  window.open("https://www.pwmultiroma.com/ReportesAutomaticos/RptVisitasLlamadasPosVenta.php?id_vendedor=" + $("#ejecutivo").val() + "&fh_ini=" + $("#fecha_ini").val() + "&fh_fin=" + $("#fecha_fin").val() + "&oficina=" + oficina + "&id_dpto=" + $("#tipo").val())
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

getKilometros = function (lat1, lon1, lat2, lon2) {
  rad = function (x) {
    return x * Math.PI / 180;
  }
  var R = 6378.137; //Radio de la tierra en km
  var dLat = rad(lat2 - lat1);
  var dLong = rad(lon2 - lon1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d.toFixed(3); //Retorna tres decimales
}
/*
//programaciones que tinen estado V
*/
function progSinGestion() {

  $.ajax({
    url: "../models/SeguimientoVisitas.php",
    global: false,
    type: "POST",
    data: ({
      op: 'PROG_V',
      id: $("#ejecutivo").val(),
      fh_ini: $("#fecha_ini").val(),
      fh_fin: $("#fecha_fin").val(),
      oficina: oficina,
      id_dpto: $("#tipo").val()
    }),
    beforeSend: function () {
      $("#Result_prog_v").html(`<div class="alert alert-danger"><i class="fa fa-search m-1"></i> Cargando programaciones no contactadas...</div>`);
    },
    dataType: "json",
    async: true,
    success: function (data) {
      console.warn(data);

      if (data.length == 0) {
        $("#Result_prog_v").html(`<div class="alert alert-warning"><i class="fa fa-search m-1"></i>No se encontraron programaciones gestionadas no contactadas</div>`);
        return;
      }

      tabla = `
                 <h4>Programaciones gestionadas no contactadas</h4>
				<table class="table table-sm">
					<thead>
						<tr>
							<th>Codigo sap</th>
							<th>Nit</th>
							<th>Nombres</th>
							<th>Razon comercial</th>
							<th># Veces</th>
						</tr>
					</thead>
					<tbody>
				`

      data.forEach(item => {

        tabla += `<tr>
							<td>${item.codigo_sap}</td>
							<td>${item.nit}</td>
							<td>${item.nombres}</td>
							<td>${item.razon_comercial}</td>
							<td>${item.n_veces}</td>
						</tr>`

      });

      tabla += `</tbody>
					</table>`
      $("#Result_prog_v").html(tabla);
    }
  }).fail(function (error) {
    console.error(error)
  });

}

const seleccionarFilar = (obs) => {

  if (modoSeleccion) {
    //console.log({mod:$(obs).hasClass("seleccionada")})
    if ($(obs).hasClass("seleccionada")) {
      $(obs).find("td").removeClass("bg-primary")
      $(obs).removeClass("seleccionada")
    } else {
      $(obs).find("td").addClass("bg-primary")
      $(obs).addClass("seleccionada")
    }

    validarSleccionados();

  }
}


function Consultar() {
  oficina = $("#oficina").val();
  $("#Result_prog_v").html('');
  $("#eliminar_programacion").hide();
  $("#chk_seleccionar").attr("checked", false);
  $("#SeleccionarProg").removeClass("btn-info");
  $("#SeleccionarProg").html(`Seleccionar prog.(Desactivado)`);
  $("#span_chk_seleccionar").hide();
  modoSeleccion = false;

  $.ajax({
    url: "../models/SeguimientoVisitas.php",
    global: false,
    type: "POST",
    data: ({
      op: 'CONSULTAR',
      id: $("#ejecutivo").val(),
      fh_ini: $("#fecha_ini").val(),
      fh_fin: $("#fecha_fin").val(),
      oficina: oficina,
      id_dpto: $("#tipo").val()

    }),
    beforeSend: function () {
      LoadImg('CONSULTANDO INFORMACIÓN...');
    },
    dataType: "json",
    async: true,
    success: function (data) {
      console.log({
        causalesNoventas
      })
      if (data != '' && data != null) {

        let fechaMinima = new Date('9999-12-31T23:59:59');
        let fechaMaxima = new Date($("#fecha_fin").val() + 'T23:59:59');

        let hora_inicio = data.map(objeto => objeto.HORA_MIN != '' ? objeto.HORA_MIN.substring(0, 8) : '');
        let hora_fin = data.map(objeto => objeto.HORA_FIN != '' ? objeto.HORA_FIN.substring(0, 8) : '');

        cont_razon_venta = 0;
        cont_razon_cartera = 0;
        cont_razon_pqrs = 0;
        cont_razon_pos = 0;
        cont_razon_otro = 0;

        //
        cont_ubc_error = 0;
        cont_ubc_ok = 0;
        cont_ubc_virtuales = 0;

        //TIPO 
        cont_tipo_prog_p = 0;
        cont_tipo_prog_i = 0;

        valor_pedido = 0;
        valor_facturado = 0;
        clientes_con_pedidos = 0;
        clientes_con_facturacion = 0;

        horas = 0;

        let data_motivo_visita = data.forEach(item => {

          if (item.RAZON_IMPREVISTO == 'V') {
            cont_razon_venta++;
          } else
          if (item.RAZON_IMPREVISTO == 'C') {
            cont_razon_cartera++;
          } else
          if (item.RAZON_IMPREVISTO == 'P') {
            cont_razon_pqrs++;
          } else
          if (item.RAZON_IMPREVISTO == 'S') {
            cont_razon_pos++;
          } else
          if (item.RAZON_IMPREVISTO == 'O') {
            cont_razon_otro++;
          } else {
            cont_razon_otro++;
          }

          if (item.TIPO_GESTION == 'V') {
            cont_ubc_virtuales++;
          } else {
            if (item.ESTADO == 'V') {
              cont_ubc_ok++;
            } else if (item.ESTADO == 'F') {
              cont_ubc_error++;
            }
          }

          if (item.TIPO_PROGRAMACION == 'I') {
            cont_tipo_prog_i++;
          } else if (item.TIPO_PROGRAMACION == 'P') {
            cont_tipo_prog_p++;
          }

          if (item.PEDIDO > 0) {
            valor_pedido += parseFloat(item.PEDIDO);
            clientes_con_pedidos++;
          }
          if (item.VALOR > 0) {
            valor_facturado += parseFloat(item.VALOR);
            clientes_con_facturacion++;
          }
          horas = item.DIF;

        })

        let porcentaje_facturado = (valor_facturado > 0 ? valor_facturado / valor_pedido : 0) * 100;
        porcentaje_facturado = porcentaje_facturado.toFixed(2);

        console.log({
          hora_inicio,
          hora_fin,
          porcentaje_facturado,
          cont_razon_venta,
          cont_razon_cartera,
          cont_razon_pqrs,
          cont_razon_pos,
          cont_razon_otro
        })
        $("#no_venta_venta").text(cont_razon_venta);
        $("#no_venta_cartera").text(cont_razon_cartera);
        $("#no_venta_pqrs").text(cont_razon_pqrs);
        $("#no_venta_pos").text(cont_razon_pos);
        $("#no_venta_otro").text(cont_razon_otro);

        $("#ubicacion_erroneas").text(cont_ubc_error);
        $("#ubicacion_virtuales").text(cont_ubc_virtuales);
        $("#ubicacion_correctas").text(cont_ubc_ok);

        $("#tipo_programadas").text(cont_tipo_prog_p);
        $("#tipo_imprevisto").text(cont_tipo_prog_i);

        $("#valor_pedidos").text(formatNumberES(valor_pedido, 0, '$'));
        $("#cant_clientes_pedidos").text(clientes_con_pedidos);
        $("#valor_facturado").text(formatNumberES(valor_facturado, 0, '$'));
        $("#cant_clientes_facturado").text(clientes_con_facturacion);

        $("#v_hora_inicio").text(hora_inicio[0]);
        $("#v_hora_final").text(hora_fin[0]);

        var tabla = '<table class="table" align="center" width="100%" id="datos_visitas">'
          + '<thead>'
          + '<tr>'
          + '<th class="custom-nowrap">VENDEDOR</th>'
          + '<th class="custom-nowrap">CLIENTE</th>'
          + '<th class="custom-nowrap">RAZÓN</th>'
          + '<th class="custom-nowrap">CIUDAD</th>'
          + '<th class="custom-nowrap">FECHA</th>'
          + '<th class="custom-nowrap">FH PROG.</th>'
          + '<th class="custom-nowrap">INI_GESTION</th>'
          + '<th class="custom-nowrap">FIN_GESTION</th>'
          + '<th class="custom-nowrap">MINUTOS</th>'
          + '<th class="custom-nowrap">ESTADO</th>'
          + '<th class="custom-nowrap">REV.VENT</th>'
          + '<th class="custom-nowrap">REV.CART</th>'
          + '<th class="custom-nowrap">REV.JURI</th>'
          + '<th class="custom-nowrap">GESTION</th>'
          + '<th class="custom-nowrap">PROG</th>'
          + '<th class="custom-nowrap">MOTIVO</th>'
          + '<th class="custom-nowrap">UBICACION</th>'
          + '<th class="custom-nowrap">TIPO</th>'
          + '<th class="custom-nowrap">PEDIDO</th>'
          + '<th class="custom-nowrap">PEDIDO FACTURADO</th>'
          + '</tr>'
          + '</thead>'
          + '<tbody>';
        var rv = '';
        var rc = '';
        var rj = '';
        var es = '';
        var tp = '';
        var CantVis = 0;
        var CantPrg = 0;
        var CantMin = 0; //Cantidad de minutos trabajados
        var CantMinLaborales = 0; //Cantidad de Minutos laborales en un rango de fechas 
        var PromMin = 0; //Promedio de minutos trabajados 
        //----------------------------------------------------   
        let ini = moment(convertDateFormat($("#fecha_ini").val()), "YYYYMMDD");
        let fin = moment(convertDateFormat($("#fecha_fin").val()));
        CantMinLaborales = ((fin.diff(ini, 'days') + 1) * 8) * 60;
        //----------------------------------------------------   
        var CP = 0; //Visitas programadas
        var CV = 0; //Visitas realizadas
        var CC = 0; //Visitas contactadas
        var CN = 0; //Clientes no creados
        var CV_N = 0; //contador de visitas a clientes nuevos

        for (var i = 0; i <= data.length - 1; i++) {
          CantMin += parseInt(data[i].MINUTOS_GESTION);
          var ArrTel = new Array();
          if ($.trim(data[i].COMENTARIO_VENTA) != "") {
            rv = "<img src='../resources/icons/ProgVentas1.png' align='absmiddle' width='16' height='16'/>";
          } else {
            switch (data[i].REVISION_VENTAS) {
              case '0':
                {
                  rv = "<img src='../resources/icons/CirculoRojo.png' align='absmiddle' width='12' height='12'/>";
                }
                break;
              case '1':
                {
                  rv = "<img src='../resources/icons/CirculoVerde.png' align='absmiddle' width='12' height='12'/>";
                }
                break;
            }
          }
          //
          if ($.trim(data[i].COMENTARIO_CARTERA) != "") {
            rv = "<img src='../resources/icons/ProgCartera1.png' align='absmiddle' width='16' height='16'/>";
          } else {
            switch (data[i].REVISION_CARTERA) {
              case '0':
                {
                  rc = "<img src='../resources/icons/CirculoRojo.png' align='absmiddle' width='12' height='12'/>";
                }
                break;
              case '1':
                {
                  rc = "<img src='../resources/icons/CirculoVerde.png' align='absmiddle' width='12' height='12'/>";
                }
                break;
            }
          }
          //
          if ($.trim(data[i].COMENTARIO_JURIDICA) != "") {
            rv = "<img src='../resources/icons/ProgJuridica1.png' align='absmiddle' width='16' height='16'/>";
          } else {
            switch (data[i].REVISION_JURIDICA) {
              case '0':
                {
                  rj = "<img src='../resources/icons/CirculoRojo.png' align='absmiddle' width='12' height='12'/>";
                }
                break;
              case '1':
                {
                  rj = "<img src='../resources/icons/CirculoVerde.png' align='absmiddle' width='12' height='12'/>";
                }
                break;
            }
          }

          switch (data[i].ESTADO_VISITA) {

            case 'P':
              {
                es = '<button type="button" class="btn btn-danger btn-xs" aria-label="Left Align">'
                + '<span class="fa fa-times-circle" aria-hidden="true"></span>'
                + '</button>';
                CP++;
              }
              break;
            case 'V':
              {
                es = '<button type="button" class="btn btn-info btn-xs" aria-label="Left Align">'
                + '<span class="fa fa-check-circle" aria-hidden="true"></span>'
                + '</button>';
                if (data[i].TIPO_PROGRAMACION != 'S') {
                  CantVis++;
                }
                //se valida que solo cuente los clientes ya creados en la base de datos
                //solicitado por Raul

                if (data[i].CODIGO_SAP_CLI != '0') {
                  CV++;
                  console.log({
                    CV
                  });
                } else {
                  console.log('entro')
                  CV_N++;
                }

              }
              break;
            case 'C':
              {
                es = '<button type="button" class="btn btn-success btn-xs" aria-label="Left Align">'
                + '<span class="fa fa-check-circle aria-hidden="true"></span>'
                + '</button>';
                if (data[i].TIPO_PROGRAMACION != 'S') {
                  CantVis++;
                }
                CC++;

                if (data[i].CODIGO_SAP_CLI != '0' && data[i].REPROGRAMADO == '0') {
                  CV++;
                } else {
                  CV_N++;
                }
              }
              break;

          }
          if (data[i].CODIGO_SAP_CLI == 0) {
            CN++;
          }
          if (data[i].TIPO_PROGRAMACION == 'I') {
            tp = 'style ="background:#FFF3D3;"'
          } else {
            tp = '';
          };
          var lat0 = data[i].LATITUD_VIS;
          var lng0 = data[i].LONGITUD_VIS;
          var lat1 = data[i].LATITUD_CLI;
          var lng1 = data[i].LONGITUD_CLI;

          var km = Georeferencia2(data[i].LATITUD_VIS, data[i].LONGITUD_VIS, data[i].LATITUD_CLI, data[i].LONGITUD_CLI);
          var tipoG = data[i].TIPO_GESTION;
          if (tipoG == 'V') {
            ClassColor = 'btn-info';
          } else {
            if (data[i].CODIGO_SAP_CLI != '0') {
              if (lat0 != '0' && lng0 != '0' && lat1 != '0' && lng1 != '0') {
                if (parseFloat(km) <= 1) {
                  ClassColor = 'btn-success';
                } else {
                  ClassColor = 'btn-danger';
                }
              } else {
                ClassColor = 'btn-danger';
              }
            }

          }
          var ClassParpadeo = '';
          if (data[i].ID_SOL_COORDENADA != 0) {
            var ClassParpadeo = 'parpadea'
          }

          color_fila = '';


          if (data[i].TIPO_PROGRAMACION == 'S') {

            color_fila = "alert-info";

          }

          logro_venta = '';

          //si contesto 
          if (data[i].CONTESTO == 'S') {
            logro_venta = 'Contesto- ';
          }
          if (data[i].ESTADO_VISITA == 'C') {
            logro_venta += ' Hubo contacto ';
          } else if (data[i].ESTADO_VISITA == 'V') {
            logro_venta += ' Se gestiono pero sin contacto ';
          } else {
            logro_venta += ' No gestionada ';
          }
          if (data[i].PIDIO_VENTA == 'S') {

            logro_venta += ` Se logro venta , `
          } else {
            logro_venta += ' No se logro venta '

            if (data[i].RAZON_NO_VENTA != '0') {
              logro_venta += ' por ' + causalesNoventas[parseInt(data[i].RAZON_NO_VENTA)];

              if (data[i].RAZON_NO_VENTA == "4") {

                if (data[i].MOTIVOS_CARTERA != '0') {
                  logro_venta += ',' + TemasCarteraVencimiento[parseInt(data[i].MOTIVOS_CARTERA)];

                  if (data[i].MOTIVOS_CARTERA == "1") {
                    logro_venta += ',' + TemasCartera[parseInt(data[i].MOTIVOS_SALDO_VENCIDO)];
                  }
                }

              }
            }
          }

          if ($.trim(data[i].ESTADO_VISITA) == 'P') {
            tabla += '<tr ' + tp + ' onclick="seleccionarFilar(this)"  onDblClick="AbrirGestion(' + data[i].ID_VIS + ',' + data[i].ORGANIZACION_VENTAS + ')">';
          } else {
            tabla += '<tr ' + tp + '  onDblClick="AbrirGestion(' + data[i].ID_VIS + ',' + data[i].ORGANIZACION_VENTAS + ')">';
          }


          tabla += '<td class="custom-nowrap ' + color_fila + '">' + data[i].VENDEDOR + '</td>'
            + /**0 */ '<td class="custom-nowrap ' + color_fila + '">' + data[i].CODIGO_SAP_CLI + ' - ' + data[i].CLIENTE + '</td>'
            + '<td class="custom-nowrap ' + color_fila + '">' + data[i].RSOCIAL + '</td>'
            + '<td class="custom-nowrap ' + color_fila + '">' + data[i].CIUDAD + '</td>'
            + '<td class="custom-nowrap ' + color_fila + '">' + data[i].FECHA_VISITA + '</td>'
            + '<td class="custom-nowrap ' + color_fila + '">' + data[i].FECHA_PROGRAMACION + '</td>'
            + '<td class="custom-nowrap ' + color_fila + '">' + data[i].FECHA_INI_GESTION + '</td>'
            + '<td class="custom-nowrap ' + color_fila + '">' + data[i].FECHA_FIN_GESTION + '</td>'
            + '<td class="custom-nowrap ' + color_fila + '">' + data[i].MINUTOS_GESTION + '</td>'
            + '<td align="center" class="' + color_fila + '">' + es + '</td>'
            + '<td align="center" class="' + color_fila + '">' + rv + '</td>'
            + '<td align="center" class="' + color_fila + '">' + rc + '</td>'
            + '<td align="center" class="' + color_fila + '">' + rj + '</td>'
            + '<td align="center" class="' + color_fila + '">'
            + '<img src="../resources/icons/expand.png" width="24" heignt="24" onclick="ShowGestion(this,' + data[i].ID_VIS + ',' + data[i].REVISION_VENTAS + ',' + data[i].REVISION_JURIDICA + ',' + data[i].REVISION_CARTERA + ')">'
            + '</td>'; /**13 */

          if (data[i].TIPO_PROGRAMACION != 'S') { //14

            if (data[i].VALOR > 0) {
              tabla += '<td class="' + color_fila + '" ><img src="../resources/icons/prog.png" width="24" heignt="24" title="Programar para POSVENTA"  onclick="Programar(this,' + data[i].CODIGO_SAP + ')" /></td>';
            } else {
              tabla += '<td class="' + color_fila + '" ></td>';
            }

          } else {
            tabla += '<td class="' + color_fila + '" ></td>';
          }


          tabla += '<td style="display:none">' + data[i].ID_VEN + '</td>'; /*15*/
          tabla += '<td style="display:none">' + data[i].CODIGO_SAP + '</td>'; /*16*/
          tabla += '<td class="' + color_fila + '">' + data[i].RAZON_VISITA + '</td>'; /*17*/
          tabla += '<td style="display:none">' + data[i].LATITUD_VIS + '</td>'; /*18*/
          tabla += '<td style="display:none">' + data[i].LONGITUD_VIS + '</td>'; /*19*/
          tabla += '<td style="display:none">' + data[i].LATITUD_CLI + '</td>'; /*20*/
          tabla += '<td style="display:none">' + data[i].LONGITUD_CLI + '</td>'; /*21*/
          tabla += '<td style="display:none">' + data[i].TIPO_GESTION + '</td>'; /*22*/
          tabla += '<td align="center" class="' + color_fila + '">'
            + '<button type="button" class="btn btn-xs ' + ClassColor + ' ' + ClassParpadeo + '" aria-label="Left Align" onclick="Georeferencia(this,' + data[i].ID_SOL_COORDENADA + ',\'' + data[i].DIRECCION + '\')">'
            + '<span class="fa fa-map-marker" aria-hidden="true"></span>'
            + '</button>'
            + '</td>'; /*23*/
          tabla += '<td><b>' + data[i].TIPO_PROGRAMACION + '</b></td>'; /**24 */
          tabla += '<td><b>' + formatNumberES(data[i].PEDIDO, 0, '$') + '</b></td>'; /**25 */
          tabla += '<td><b>' + formatNumberES(data[i].VALOR, 0, '$') + '</b></td>'; /**26 */
          tabla += '<td style="display:none" class="id_visita">' + data[i].ID_VIS + '</td>'; /**27 */
          tabla += '<td style="display:none">' + data[i].ESTADO_VISITA + '</td>' /**28 */
          tabla += '</tr>'
            + '<tr id="' + data[i].ID_VIS + '" style="display:none">'
            + '<td colspan="17" align="center" class="form disabled">'
            + '<table width="100%" id="" class="" align="right">'
            + '<tr>'
            + '<td width="10%"><b>VENTAS</b></td>'
            + '<td width="30%">' + data[i].OBJETIVO_VENTA + '</td>'
            + '<td width="35%">' + logro_venta + '</td>'
            + '<td width="25%">'
            + '<textarea rows="1" style="width:100%;" id="CV" onblur="GuardarGestion(' + data[i].ID_VIS + ',this);">'
            + $.trim(data[i].COMENTARIO_VENTA)
            + '</textarea>'
            + '</td>'
            + '</tr>'
            + '<tr class="hide_no_pos_venta">'
            + '<td width="10%"><b>CARTERA</b></td>'
            + '<td width="30%">' + data[i].OBJETIVO_CARTERA + '</td>'
            + '<td width="35%">' + data[i].LOGRO_CARTERA + '</td>'
            + '<td width="25%">'
            + '<textarea rows="1" style="width:100%;" id="CC" onblur="GuardarGestion(' + data[i].ID_VIS + ',this);">'
            + $.trim(data[i].COMENTARIO_CARTERA)
            + '</textarea>'
            + '</td>'
            + '</tr>'
            + '<tr class="hide_no_pos_venta">'
            + '<td width="10%"><b>JURIDICA</b></td>'
            + '<td width="30%">' + data[i].OBJETIVO_JURIDICA + '</td>'
            + '<td width="35%">' + data[i].LOGRO_JURIDICA + '</td>'
            + '<td width="25%">'
            + '<textarea rows="1" style="width:100%;" id="CJ" onblur="GuardarGestion(' + data[i].ID_VIS + ',this);">'
            + $.trim(data[i].COMENTARIO_JURIDICA)
            + '</textarea>'
            + '</td>'
            + '</tr>';
          tabla += '<tr>'
          tabla += `<td colspan="4">
									   <label>Nota general</label>
									   <div class=" alert-danger" style="width:100%;padding:10px">${data[i].NOTA_GENERAL_GESTION}</div>
									</td>`

          if (data[i].TIPO_PROGRAMACION != 'S') {

            tabla += '<tr class="">'
              + '<td width="10%"><b>TEXTO PRECIO</b></td>'
              + '<td>' + data[i].TEXTO_PRECIO + '</td>'
              + '<td width="10%"><b>ENCUESTA PRECIO</b></td>'
              + '<td>' + data[i].PRECIO_VENTA + '</td>'
              + '</tr>'
              + '<tr class="">'
              + '<td width="10%"><b>TEXTO SERVICIO</b></td>'
              + '<td>' + data[i].TEXTO_SERVICIO + '</td>'
              + '<td width="10%"><b>ENCUESTA SERVICIO</b></td>'
              + '<td>' + data[i].SERVICIO_VENTA + '</td>'
              + '</tr>'
              + '<tr class="">'
              + '<td width="10%"><b>TEXTO SURTIDO</b></td>'
              + '<td>' + data[i].TEXTO_SURTIDO + '</td>'
              + '<td width="10%"><b>ENCUESTA SURTIDO</b></td>'
              + '<td>' + data[i].SURTIDO_VENTA + '</td>'
              + '</tr>'
              + '<tr class="">'
              + '<td width="10%"><b>GESTION LLAMADA</b></td>'
              + /*0*/ '<th width="10%" colspan="3" align="left">'
              + '<button class="form-control btn-warning" onclick="ConsultarDatosAsterisk(this,' + data[i].CODIGO_SAP + ')">Consultar</button>'
              + '</th>'; /*1*/
          } else {
            tabla += '<tr >'
              + '<td width="20%" colspan="2"><b>LLego el pedido a tiempo?</b></td>'
              + '<td colspan="2">' + data[i].LLEGO_PEDIDO + '</td>'
              + '</tr>'
              + '<tr >'
              + '<td width="20%" colspan="2"><b>LLego completo?</b></td>'
              + '<td colspan="2">' + data[i].LLEGO_COMPLETO + '</td>'
              + '</tr>'
              + '<tr >'
              + '<td width="20%" colspan="2"><b>LLego en buen estado?</b></td>'
              + '<td colspan="2">' + data[i].LLEGO_BUEN_ESTADO + '</td>'
              + '</tr>'
              + '<tr><td colspan="4"></td></tr>';

          }


          if ($.trim(data[i].TELEFONO1) != "") {
            ArrTel.push($.trim(data[i].TELEFONO1));
          }
          if ($.trim(data[i].TELEFONO2) != "") {
            ArrTel.push($.trim(data[i].TELEFONO2));
          }
          if ($.trim(data[i].TELEFONO3) != "") {
            ArrTel.push($.trim(data[i].TELEFONO3));
          }
          tabla += '<th style="display:none">' + ArrTel + '</th>'; //2

          /*2*/
          tabla += '<th style="display:none">' + data[i].EXT + '</th>'
            + //3
            '<th style="display:none">' + data[i].ID_VEN + '</th>'
            + /*4*/ '<th style="display:none">' + data[i].FECHA_VISITA + '</th>'
            + //5
            '<th style="display:none">' + data[i].CODIGO_SAP_CLI + '</th>'
            + //6RptVisitasLlamadas

            '</tr>'
            + '</table>'
            + '</td>'
            +

            '</tr>';

          if (data[i].TIPO_PROGRAMACION != 'S') {
            CantPrg++;
          }

        }
        var diashabiles = ConsultarDiasHabiles();
        var pcjCantPrg = (Math.round(((parseInt(CantPrg) / diashabiles) * 100) * 100) / 100) / 100; //Math.round((parseInt(CantPrg)/diashabiles));
        var pcjCantVis = (Math.round(((parseInt(CantVis) / diashabiles) * 100) * 100) / 100) / 100;
        tabla += '</tbody>'
          + '<thead>'
          + '<tr>'
          + '<th colspan="6">PROGRAMADOS : ' + parseInt(CantPrg) + '</th><th colspan="13">PROMEDIO MENSUAL : ' + pcjCantPrg + '</th>'
          + '</tr>'
          + '<tr>'
          + '<th colspan="6">VISITADOS   : ' + parseInt(CantVis) + '</th><th colspan="13">PROMEDIO MENSUAL : ' + pcjCantVis + '</th>'
          + '</tr>'
          + '</thead>'
          + '</table>';

        v_cant_contactadas
        p_cant_contactadas = formatNumberES(Math.round(((CC / CantPrg) * 100) * 100) / 100, 2, '%');
        $("#p_cant_programados").html(parseInt(CantPrg));
        $("#p_prom_programados").html(formatNumberES(pcjCantPrg, 2, ''));
        $("#p_cant_visitados").html(parseInt(CantVis));
        $("#p_prom_visitados").html(formatNumberES(pcjCantVis, 2, ''));
        $("#p_prom_dias_habiles").html(diashabiles);

        $("#v_cant_programados").html(parseInt(CP));
        $("#v_cant_realizadas").html(parseInt(CV));
        $("#v_cant_realizadas_nuevos").html(parseInt(CV_N))
        $("#v_cant_contactadas").html(parseInt(CC));
        $("#v_clientes_nocreados").html(parseInt(CN));
        $("#p_cant_contactadas").html(p_cant_contactadas);

        $("#p_min_laborales").html(CantMinLaborales);
        $("#p_minutos_laborados").html(CantMin);

        let minCumple = formatNumberES((parseInt(CantMin) / parseInt(CantMinLaborales)) * 100, 2, '%');
        $("#p_minutos_cumplimiento").html(minCumple);


        $("#FilaTotales").show();
        $("#Result").html(tabla);
        //$(".hide_no_pos_venta").hide();
        if ($("#tipo").val() == 12 || $("#tipo").val() == 3) {
          progSinGestion();
        }


      } else {
        $("#Result").html('<div class="alert alert-danger" role="alert">'
          + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
          + '<span class="sr-only">Error:</span>  NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS'
          + '</div>');
        $("#FilaTotales").hide();
      }
    }
  }).always(function (data) {
    console.log(data);
    //UnloadImg();
  });
  var tb;
  var clase
  var tb = '<table	 class="table" align="center" width="100%">'
    + '<thead>'
    + '<tr>'
    + '<th>COD SAP</th>'
    + '<th>CLIENTE</th>'
    + '</tr>'
    + '</thead>'
    + '<tbody>';
  $.ajax({
    url: "../models/SeguimientoVisitas.php",
    global: false,
    type: "POST",
    data: ({
      op: 'Clientes_zona',
      org: $("#oficina").val(),
      id: $("#ejecutivo").val()
    }),
    beforeSend: function () {
      // LoadImg('CONSULTANDO INFORMACIÓN...');
    },
    dataType: "json",
    async: true,
    success: function (data) {
      if (data.length > 0) {
        CantPrg = 0;
        for (var i = 0; i < data.length; i++) {
          d = data[i];
          if (d.PROGRAMADA_MES == 0) {
            clase = 'alert alert-danger';
            tb += '<tr onclick="Selec_cliente(this)" class="filas_f ' + clase + '">'
              + '<td>' + d.CODIGO_SAP + '</td>'
              + '<td>' + d.RAZON_COMERCIAL + '</td>'
              + '</tr>';
            CantPrg++;
          } else {
            clase = 'alert alert-success"';
          }

        } //for 
        tb += '</tbody>'
          + '<thead>'
          + '<tr>'
          + '<th colspan="14">NO PROGRAMADOS : ' + parseInt(CantPrg) + '</th>'
          + '</tr>'
          + '</thead>'
          + '</table>';
        $("#Result2").html('');

        $("#Result2").html(tb);
      } else {
        $("#Result2").html('<div class="alert alert-danger" role="alert">'
          + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
          + '<span class="sr-only">Error:</span>  NO EXISTEN RESULTADOS'
          + '</div>');
      }
    }
  }).always(function (data) {
    //console.log(data);
    UnloadImg();
  });
}

function ConsultarDiasHabiles() {
  let diashabiles = 0;
  $.ajax({
    url: "../models/SeguimientoVisitas.php",
    global: false,
    type: "POST",
    data: ({
      op: 'CONSULTAR_DIAS_HABILES',
      fh_ini: $("#fecha_ini").val(),
      fh_fin: $("#fecha_fin").val()
    }),
    beforeSend: function () {},
    dataType: "json",
    async: false,
    success: function (data) {
      diashabiles = data.dias_habiles;
    }
  });
  return diashabiles;
}

function Consultar2() {
  oficina = $("#oficina").val();

  $.ajax({
    url: "../models/SeguimientoVisitas.php",
    global: false,
    type: "POST",
    data: ({
      op: 'CONSULTAR',
      id: $("#ejecutivo").val(),
      fh_ini: $("#fecha_ini").val(),
      fh_fin: $("#fecha_fin").val(),
      oficina: oficina,
      id_dpto: $("#tipo").val()

    }),
    beforeSend: function () {
      LoadImg('DESCARGANDO INFORMACIÓN...');
    },
    dataType: "json",
    async: true,
    success: function (data) {

      if (data != '' && data != null) {
        //datos encabezados 


        let fechaMinima = new Date('9999-12-31T23:59:59');
        let fechaMaxima = new Date($("#fecha_fin").val() + 'T23:59:59');

        let hora_inicio = data.map(objeto => objeto.HORA_MIN != '' ? objeto.HORA_MIN.substring(0, 8) : '');
        let hora_fin = data.map(objeto => objeto.HORA_FIN != '' ? objeto.HORA_FIN.substring(0, 8) : '');


        cont_razon_venta = 0;
        cont_razon_cartera = 0;
        cont_razon_pqrs = 0;
        cont_razon_pos = 0;
        cont_razon_otro = 0;

        //
        cont_ubc_error = 0;
        cont_ubc_ok = 0;
        cont_ubc_virtuales = 0;

        //TIPO 
        cont_tipo_prog_p = 0;
        cont_tipo_prog_i = 0;

        valor_pedido = 0;
        valor_facturado = 0;
        clientes_con_pedidos = 0;
        clientes_con_facturacion = 0;

        horas = 0;

        let data_motivo_visita = data.forEach(item => {

          if (item.RAZON_IMPREVISTO == 'V') {
            cont_razon_venta++;
          } else
          if (item.RAZON_IMPREVISTO == 'C') {
            cont_razon_cartera++;
          } else
          if (item.RAZON_IMPREVISTO == 'P') {
            cont_razon_pqrs++;
          } else
          if (item.RAZON_IMPREVISTO == 'S') {
            cont_razon_pos++;
          } else
          if (item.RAZON_IMPREVISTO == 'O') {
            cont_razon_otro++;
          } else {
            cont_razon_otro++;
          }

          if (item.TIPO_GESTION == 'V') {
            cont_ubc_virtuales++;
          } else {
            if (item.ESTADO == 'V') {
              cont_ubc_ok++;
            } else if (item.ESTADO == 'F') {
              cont_ubc_error++;
            }
          }

          if (item.TIPO_PROGRAMACION == 'I') {
            cont_tipo_prog_i++;
          } else if (item.TIPO_PROGRAMACION == 'P') {
            cont_tipo_prog_p++;
          }

          if (item.PEDIDO > 0) {
            valor_pedido += parseFloat(item.PEDIDO);
            clientes_con_pedidos++;
          }
          if (item.VALOR > 0) {
            valor_facturado += parseFloat(item.VALOR);
            clientes_con_facturacion++;
          }
          horas = item.DIF;

        })

        let porcentaje_facturado = (valor_facturado > 0 ? valor_facturado / valor_pedido : 0) * 100;
        porcentaje_facturado = porcentaje_facturado.toFixed(2);

        var tabla = '<table class="" border="1" align="center" width="100%" id="tableExport">'
          + '<thead>'
          + '<tr>'
          + '<th>HORAS</th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th>MOTIVO VISITA</th>'
          + '<th></th>'
          + '<th></th>'
          + '<th>UBICACION</th>'
          + '<th></th>'
          + '<th></th>'
          + '<th>TIPO </th>'
          + '<th></th>'
          + '<th></th>'
          + '<th>VENTAS REALIZADAS</th>'
          + '<th></th>'
          + '<th></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          +
          /*NUEVOS DATOS AGREGADOS EN EL 0102*/
          '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<tr>'
          + '<th></th>'
          + '<th>Hora inicio</th>'
          + '<th>' + hora_inicio[0] + '</th>'
          + '<th></th>'
          + '<th>Ventas</th>'
          + '<th>' + cont_razon_venta + '</th>'
          + '<th></th>'
          + '<th>Erroneas</th>'
          + '<th>' + cont_ubc_error + '</th>'
          + '<th></th>'
          + '<th>Programadas</th>'
          + '<th>' + cont_tipo_prog_p + '</th>'
          + '<th></th>'
          + '<th></th>'
          + '<th>Valor</th>'
          + '<th>Cant clientes</th>'
          + '<th></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          +
          /*NUEVOS DATOS AGREGADOS EN EL 0102*/
          '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '</tr>'
          + '<tr>'
          + '<th></th>'
          + '<th>Hora fin</th>'
          + '<th>' + hora_fin[0] + '</th>'
          + '<th></th>'
          + '<th>Cartera</th>'
          + '<th>' + cont_razon_cartera + '</th>'
          + '<th></th>'
          + '<th>Virtuales</th>'
          + '<th>' + cont_ubc_virtuales + '</th>'
          + '<th></th>'
          + '<th>Imprevisto</th>'
          + '<th>' + cont_tipo_prog_i + '</th>'
          + '<th></th>'
          + '<th>Pedidos</th>'
          + '<th>' + formatNumberES(valor_pedido, '$') + '</th>'
          + '<th>' + clientes_con_pedidos + '</th>'
          + '<th></th>'
          + '<th style="display:none"> </th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          +
          /*NUEVOS DATOS AGREGADOS EN EL 0102*/
          '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '</tr>'
          + '<tr>'
          + '<th></th>'
          + '<th>Horas</th>'
          + '<th>' + horas + '</th>'
          + '<th></th>'
          + '<th>PQRS</th>'
          + '<th>' + cont_razon_pqrs + '</th>'
          + '<th></th>'
          + '<th>Correctas</th>'
          + '<th>' + cont_ubc_ok + '</th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th>Facturado</th>'
          + '<th>' + formatNumberES(valor_facturado, '$') + '</th>'
          + '<th>' + clientes_con_facturacion + '</th>'
          + '<th style="display:none"> </th>'
          + '<th style="display:none"> </th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          +
          /*NUEVOS DATOS AGREGADOS EN EL 0102*/
          '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '</tr>'
          + '<tr>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th>Pos</th>'
          + '<th>' + cont_razon_pos + '</th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th>Porcentaje</th>'
          + '<th>' + porcentaje_facturado + '%</th>'
          + '<th style="display:none"> </th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          +
          /*NUEVOS DATOS AGREGADOS EN EL 0102*/
          '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '</tr>'
          + '<tr>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th>Otro</th>'
          + '<th>' + cont_razon_otro + '</th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th style="display:none"> </th>'
          + '<th style="display:none"> </th>'
          + '<th style="display:none"> </th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          + '<th style="display:none"></th>'
          +
          /*NUEVOS DATOS AGREGADOS EN EL 0102*/
          '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '<th></th>'
          + '</tr>'
          + '<tr>'
          + '<th>VENDEDOR</th>'
          + '<th>CLIENTE</th>'
          + '<th>RAZÓN</th>'
          + '<th>CIUDAD</th>'
          + '<th>TELEFONO</th>'
          + '<th>DIRECCION</th>'
          + '<th>FECHA</th>'
          + '<th>FH PROG.</th>'
          + '<th>FH VIS</th>'
          + '<th>INI_GESTION</th>'
          + '<th>FIN_GESTION</th>'
          + '<th>MINUTOS</th>'
          + '<th>ESTADO_GESTION</th>'
          + '<th style="display:none">LAT VISI</th>'
          + '<th style="display:none">LONG VISI</th>'
          + '<th style="display:none">LAT CLI</th>'
          + '<th style="display:none">LONG CLI</th>'
          + '<th style="display:none">DISTANCIA</th>'
          + '<th style="display:none">ESTADO</th>'
          + '<th style="display:none">TIPO GESTION</th>'
          + '<th style="display:">TIPO PROGRAMACION</th>'
          + '<th style="display:none">TIPO G. WHATSAPP</th>'
          + '<th style="display:none">TIPO G. VISITA</th>'
          + '<th style="display:none">TIPO G. LLAMADA</th>'
          + '<th style="display:none">CLIENTE PIDIO</th>'
          + '<th style="display:">PEDIDOS TOMADOS</th>'
          + '<th style="display:">PEDIDOS FACTURADOS</th>'
          + '<th style="display:none">LLEGO EN EL TIEMPO ACORDADO</th>'
          + '<th style="display:none">LLEGO COMPLETO</th>'
          + '<th style="display:none">LLEGO EN BUEN ESTADO</th>'
          + '<th style="display:none">PRECIO ACORDADO</th>'
          +
          /*NUEVOS DATOS AGREGADOS EN EL 0102*/
          '<th>POTENCIAL ACTUAL</th>'
          + '<th>POTENCIAL ANTERIOR</th>'
          + '<th>CONTESTO</th>'
          + '<th>NOMBRE CONTACTO</th>'
          + '<th>LOGRO OBJETIVO</th>'
          + '<th>RAZON NO VENTA</th>'
          + '<th>MOTIVO CARTERA</th>'
          + '<th>MOTIVO CARTERA POR SALDO</th>'
          + '<th>LOGRO DE CARTERA</th>'
          + '<th>REPROGRAMADO</th>'
          + '<th>FECHA HORA REPROGRAMADO</th>'
          + '<th>GESTION CARTERA</th>'
          + '<th>MOTIVO GESTION CARTERA POR SALDOS</th>'
          + '</tr>'
          + '</thead>'
          + '<tbody>';
        for (var i = 0; i <= data.length - 1; i++) {

          var lat0 = data[i].LATITUD_VIS;
          var lng0 = data[i].LONGITUD_VIS;
          var lat1 = data[i].LATITUD_CLI;
          var lng1 = data[i].LONGITUD_CLI;
          var km = 0;
          var km = Georeferencia2(data[i].LATITUD_VIS, data[i].LONGITUD_VIS, data[i].LATITUD_CLI, data[i].LONGITUD_CLI)
          var estado = '';

          if (lat0 != '0' && lng0 != '0' && lat1 != '0' && lng1 != '0') {
            if (parseFloat(km) <= 1) {
              estado = 'V';
            } else {
              estado = 'F';
            }
          } else {
            estado = 'F';
          }
          /*if(parseFloat(km) <= 1 && parseFloat(km) > 0){
            estado = 'V';
          }else{
            estado = 'F';
          }*/

          reprogramado = 'No';
          if (data[i].REPROGRAMADO == '1' || data[i].REPROGRAMADO == '2') {
            reprogramado = 'Si'
          }

          tabla += '<tr>'
            + '<td>' + data[i].VENDEDOR + '</td>'
            + '<td>' + data[i].CODIGO_SAP_CLI + ' - ' + data[i].CLIENTE + '</td>'
            + '<td>' + data[i].RSOCIAL + '</td>'
            + '<td>' + data[i].CIUDAD + '</td>'
            + '<td>' + data[i].TELEFONO + '</td>'
            + '<td>' + data[i].DIRECCION + '</td>'
            + '<td>' + data[i].FECHA_VISITA + '</td>'
            + '<td>' + data[i].FECHA_PROGRAMACION + '</td>'
            + '<td>' + data[i].FECHA_VISITO + '</td>'
            + '<td>' + data[i].FECHA_INI_GESTION + '</td>'
            + '<td>' + data[i].FECHA_FIN_GESTION + '</td>'
            + '<td align="center">' + parseInt(data[i].MINUTOS_GESTION) + '</td>'
            + '<td>' + data[i].ESTADO_VISITA + '</td>';
          tabla += '<td style="display:none">' + data[i].LATITUD_VIS + '</td>'; /*15*/
          tabla += '<td style="display:none">' + data[i].LONGITUD_VIS + '</td>'; /*16*/
          tabla += '<td style="display:none">' + data[i].LATITUD_CLI + '</td>'; /*17*/
          tabla += '<td style="display:none">' + data[i].LONGITUD_CLI + '</td>'; /*18*/
          tabla += '<td style="display:none">' + km + '</td>';
          tabla += '<td style="display:none">' + estado + '</td>'
            + '<td style="display:none">' + data[i].TIPO_GESTION + '</td>'
            + '<td style="display:none">' + data[i].TIPO_PROGRAMACION + '</td>'
            + '<td style="display:none">' + data[i].contacto_wp + '</td>'
            + '<td style="display:none">' + data[i].contacto_v + '</td>'
            + '<td style="display:none">' + data[i].contacto_l + '</td>'
            + '<td style="display:none">' + data[i].PIDIO_VENTA + '</td>'
            + '<td style="display:">' + data[i].PEDIDO + '</td>'
            + '<td style="display:">' + data[i].VALOR + '</td>'
            + '<td style="display:none">' + data[i].LLEGO_PEDIDO + '</td>'
            + '<td style="display:none">' + data[i].LLEGO_COMPLETO + '</td>'
            + '<td style="display:none">' + data[i].LLEGO_BUEN_ESTADO + '</td>'
            + '<td style="display:none">' + data[i].PRECIO_ACORDADO + '</td>'
            + '<td style="display:none">' + data[i].POTENCIAL + '</td>'
            + '<td style="display:none">' + data[i].POTENCIAL_ANT + '</td>'
            + '<td style="display:none">' + data[i].CONTESTO + '</td>'
            + '<td style="display:none">' + data[i].NOMBRE_CONTACTO + '</td>'
            + '<td style="display:none">' + data[i].LOGRO_OBJETIVO + '</td>'
            + '<td style="display:none">' + causalesNoventas[parseInt(data[i].RAZON_NO_VENTA)] + '</td>'
            + '<td style="display:none">' + TemasCartera[parseInt(data[i].MOTIVOS_CARTERA)] + '</td>'
            + '<td style="display:none">' + TemasCarteraVencimiento[parseInt(data[i].MOTIVOS_SALDO_VENCIDO)] + '</td>'
            + '<td style="display:none">' + data[i].LOGRO_CARTERA + '</td>'
          '<td style="display:none">' + reprogramado + '</td>'
            + '<td style="display:none">' + data[i].FECHA_HORA_REPROGRAMADO + '</td>'
            + '<td style="display:none">' + TemasCartera[parseInt(data[i].G_CARTERA)] + '</td>'
            + '<td style="display:none">' + TemasCarteraVencimiento[parseInt(data[i].G_CARTERA_SALDOS)] + '</td>'
            + '</tr>';
        }
        tabla += '</tbody>';
        UnloadImg();

        $("#Result3").html(tabla);


        $("#Result3").tableExport({
          formats: ["xlsx"], //Tipo de archivos a exportar ("xlsx","txt", "csv", "xls")
          position: 'botton', // Posicion que se muestran los botones puedes ser: (top, bottom)
          bootstrap: true, //Usar lo estilos de css de bootstrap para los botones (true, false)
          fileName: "Reporte de seguimiento de visitas del " + $("#fecha_ini").val() + " al " + $("#fecha_fin").val(), //Nombre del archivo 
          trimWhitespace: true
        });
        $("#Result3 button").trigger("click");

        //fnExcelReport('tableExport');  
      } else {
        Swal.fire('Oops', 'No hay datos que exportar.', 'warning');
      }

    }
  }).always(function (data) {
    //console.log(data);
    UnloadImg();
  });
}
/*
async function getAddressFromCoordinates(latitude, longitude, apiKey) {
	try {
		// Construye la URL de la solicitud
		const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

		// Realiza la solicitud HTTP
		const response = await fetch(url);
	    
		// Verifica si la respuesta fue exitosa
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		// Convierte la respuesta a JSON
		const data = await response.json();

		// Verifica el estado de la respuesta de la API
		if (data.status === 'OK') {
			// Obtén la primera dirección de los resultados
			const address = data.results[0].formatted_address;
			return address;
		} else {
			throw new Error(`Error from API: ${data.status}`);
		}
	} catch (error) {
		console.error('Error:', error);
		return `Error: ${error.message}`;
	}
}*/

async function getAddressFromCoordinatesOSM(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.address) {
      // Obtén la dirección detallada
      const address = data.display_name;
      return address;
    } else {
      throw new Error('No address found');
    }
  } catch (error) {
    console.error('Error:', error);
    return `Error: ${error.message}`;
  }
}


async function getAddressFromCoordinatesMapbox(latitude, longitude, apiKey) {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.features.length > 0) {
      // Obtén la dirección formateada
      const address = data.features[0].place_name;
      return address;
    } else {
      throw new Error('No address found');
    }
  } catch (error) {
    console.error('Error:', error);
    return `Error: ${error.message}`;
  }
}


function Georeferencia(ob, id_sol_geo, direccion) {
  var obj = $(ob).parent().parent();
  var lat0 = obj.find('td').eq(18).html();
  var lng0 = obj.find('td').eq(19).html();

  var lat1 = obj.find('td').eq(20).html();
  var lng1 = obj.find('td').eq(21).html();
  var tipoG = obj.find('td').eq(22).html();

  var km = '';
  var status = '<button type="button" class="btn btn-danger btn-sm" aria-label="Left Align">'
    + '<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>'
    + '</button>';
  if (tipoG == 'V') {
    status = '<button type="button" class="btn btn-info btn-sm" aria-label="Left Align">'
      + '<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>'
      + '</button>';
    km = 'NA';
  } else {
    if (lat0 != '0' && lng0 != '0' && lat1 != '0' && lng1 != '0') {
      km = getKilometros(lat0, lng0, lat1, lng1);
      if (parseFloat(km) <= 1) {
        status = '<button type="button" class="btn btn-success btn-sm" aria-label="Left Align">'
          + '<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>'
          + '</button>';
      }
    } else {
      km = 'NA';
    }
  }
  $("#Dircli").html(direccion);
  $("#gdiferencia").html(km);
  $("#gestado").html(status);
  $("#latvis").html(lat0);
  $("#lonvis").html(lng0);
  $("#latcli").html(lat1);
  $("#loncli").html(lng1);
  $("#id_sol_geo").val($.trim(id_sol_geo));
  if ($.trim(id_sol_geo) > 0) {
    if ($.trim($("#RolId").val()) == 3 || $.trim($("#RolId").val()) == 1) {
      $("#btn_auto_geo").show();
    } else {
      $("#btn_auto_geo").hide();
    }
  } else {
    $("#btn_auto_geo").hide();
  }

  getAddressFromCoordinatesMapbox(lat0, lng0, 'pk.eyJ1IjoiY2VzYXJhcnIiLCJhIjoiY2t6cHhkMW5uMGVpbDJ3cng0NHM0anFrNCJ9.NTkw681n7B8hMpPAzXG_OA')
    .then(address => $("#dir_visita").html(address))
    .catch(error => console.error('Error:', error));

  $("#ModalGeoreferencia").modal("show");


  VerMapa('V');
}

function VerMapa(tipo) {
  var direccion = '';


  var lat1 = $("#latcli").html();
  var lng1 = $("#loncli").html();
  var lat2 = $("#latvis").html();
  var lng2 = $("#lonvis").html();
  if (tipo == 'C') { //cliente
    direccion = $("#latcli").html() + ',' + $("#loncli").html();

  } else {
    direccion = $("#latvis").html() + ',' + $("#lonvis").html();

  }
  /* var mapa = '<iframe width="100%" height="400" frameborder="0" style="border:0"src="https://www.google.com/maps/embed/v1/place?q='+direccion+'&key='+GoogleKeyApis+'&zoom=19" allowfullscreen></iframe>';*/
  //alert('MapaGoogle'+'-'+lat1+'-'+lng1+'-'+lat2+'-'+lng2);
  initMapMarker('MapaGoogle', lat1, lng1, lat2, lng2)
  //$("#MapaGoogle").html(mapa);
}

function Georeferencia2(lat0, lng0, lat1, lng1) {

  var km = '';

  if (lat0 != '0' && lng0 != '0' && lat1 != '0' && lng1 != '0') {
    km = getKilometros(lat0, lng0, lat1, lng1);
    if (isNaN(km)) {
      km = 0;
    }

  } else {
    km = 0;
  }
  return km;
}

function abrirVersionActual() {
  id = $("#id-modal-gestion").val();
  org = $("#org-modal-gestion").val();

  $("#ContenidoGestion").html('<embed src="GestionVisitas.php?id=' + id + '&fecha_ini=' + $("#fecha_ini").val() + '&fecha_fin=' + $("#fecha_fin").val() + '&org=' + org + '" frameborder="0" width="100%" height="400px">');
  $("#ModalGestion").modal("show");
}

function abrirVersionBeta() {

  id = $("#id-modal-gestion").val();
  org = $("#org-modal-gestion").val();

  $("#ContenidoGestion").html('<embed src="GestionVisitas.php?id=' + id + '&fecha_ini=' + $("#fecha_ini").val() + '&fecha_fin=' + $("#fecha_fin").val() + '&org=' + org + '" frameborder="0" width="100%" height="400px">');
  $("#ModalGestion").modal("show");
}

function AbrirGestion(id, org) {
  $("#id-modal-gestion").val(id);
  $("#org-modal-gestion").val(org);

  abrirVersionBeta();
  // $("#ModalGestionVersion").modal("show");
}

function CallBack() {
  $("#IframeGestion").dialog('close').remove();
  Consultar();
}

function ShowGestion(ob, id, rv, rj, rc) {


  if ($("#" + id).is(':visible')) {
    $(ob).attr('src', '../resources/icons/expand.png');
    $("#" + id).hide();
  } else {
    $(ob).attr('src', '../resources/icons/contraer.png');
    $("#" + id).show();
  }
  switch ($("#RolId").val()) {
    case '3':
      { //Ventas
        if (rv == '0') {
          ActualizarEstado('V', id);
        }
      }
      break;
    case '1':
      { //Ventas
        console.log('CASO 3')
        if (rv == '0') {
          ActualizarEstado('V', id);
        }
      }
      break;
    case '13':
      { //Coordinadores contact center
        if (rv == '0') {
          ActualizarEstado('V', id);
        }
      }
      break;
    case '12':
      { //Coordinadores contact center
        if (rv == '0') {
          ActualizarEstado('V', id);
        }
      }
      break;
    case '17':
      { //Cartera
        if (rc == '0') {
          ActualizarEstado('C', id);
        }
      }
      break;
    case '18':
      { //Juridica
        if (rj == '0') {
          ActualizarEstado('J', id);
        }
      }
      break;
  }
}

function ActualizarEstado(tipo, idvis) {
  $.ajax({
    url: "../models/ProgramacionCliente.php",
    global: false,
    type: "POST",
    data: ({
      op: 'RevisionJefes',
      tipo: tipo,
      idvis: idvis
    }),
    dataType: "html",
    async: false,
    success: function (data) {}
  });
}

function GuardarGestion(id, ob) {
  var dialog = '';
  switch ($("#RolId").val()) {
    case '3':
      { //Ventas
        dialog = 'CVentas';
      }
      break;
    case '1':
      { //Ventas
        dialog = 'CVentas';
      }
      break;
    case '13':
      { //Coordinadores contact center
        dialog = 'CVentas';
      }
      break;
    case '17':
      { //Cartera
        dialog = 'CCartera';
      }
      break;
    case '18':
      { //Juridica
        dialog = 'CJuridica';
      }
      break;
  }

  if ($(ob).val() != '' && dialog != '') {
    $.ajax({
      url: "../models/ProgramacionCliente.php",
      global: false,
      type: "POST",
      data: ({
        op: 'Comentarios',
        tipo: dialog,
        idvis: id,
        comentario: $(ob).val()
      }),
      dataType: "html",
      async: false,
      success: function (data) {
        if (data == 'error') {
          Swal.fire('Error!', 'Error al intentar guardar el comentario!', 'error');
        } else {
          EnviarMail(id, dialog);
        }
      }
    });
  }
}

function EnviarMail(id, dpto) {
  $.ajax({
    url: "../models/ProgramacionCliente.php",
    global: false,
    type: "POST",
    data: ({
      op: 'EnviarMail',
      idvis: id,
      dpto: dpto
    }),
    dataType: "html",
    async: false,
    success: function (data) {

    }
  });
}

function AutorizarCoordenadas() {
  var id = $("#id_sol_geo").val();
  $.ajax({
    url: "../models/ProgramacionCliente.php",
    global: false,
    type: "POST",
    data: ({
      op: 'AutorizarCoordenadas',
      id: id,
      latcli: $("#latcli").html(),
      loncli: $("#loncli").html(),
      dir_visita: $("#dir_visita").html()
    }),
    dataType: "html",
    async: false,
    success: function (data) {
      if (data == 1) {
        Swal.fire('Excelente', 'Solicitud autorizada con exito.', 'success');
      } else {
        Swal.fire('Error', 'Su solicitud no pudo ser autorizada, verifique e intente nuevamente', 'error');
      }
      Consultar()
    }
  });
}
