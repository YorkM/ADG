// JavaScript Document
$(function () {
  $("#Organizacion").val(parent.parent.$("#org").val());
  $("#fh_ini,#fh_fin").val(FechaActual());
  $('#fh_ini,#fh_fin').datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dateFormat: 'dd-mm-yy',
    width: 100,
    heigth: 100
  });

  $("#oficina").html(OficinasVentas('N'));
  $("#almacen").html(Almacenes($("#oficina").val()));
  Consultar();
  $("#oficina").on('change', function () {
    $("#almacen").html(Almacenes($("#oficina").val()));
    Consultar();
    AsignarHora();
  });
  $("#almacen").on('change', function () {
    Consultar();
  });

  AsignarHora();
$(document).on('keyup', '#filtro', function () {
  filtrarTabla();
});

});

function AsignarHora() {
  //Poblacion
  var HP_1100 = '15:00';
  var HP_1200 = '12:00';
  var HP_2100 = '12:00';
  var HP_2200 = '12:00';
  var HP_2300 = '12:00';
  var HP_2400 = '12:00';
  //Ciudad
  var HC_1100 = '16:00';
  var HC_1200 = '16:00';
  var HC_2100 = '15:00';
  var HC_2200 = '13:00';
  var HC_2300 = '13:00';
  var HC_2400 = '14:00';
  switch ($("#oficina").val()) {
    case '1100':
      {
        $("#hora_ciudad").val(HC_1100);$("#hora_poblacion").val(HP_1100);
      }
      break; //Monteria
    case '1200':
      {
        $("#hora_ciudad").val(HC_1200);$("#hora_poblacion").val(HP_1200);
      }
      break; //Cartagena
    case '2100':
      {
        $("#hora_ciudad").val(HC_2100);$("#hora_poblacion").val(HP_2100);
      }
      break; //Medellin
    case '2200':
      {
        $("#hora_ciudad").val(HC_2200);$("#hora_poblacion").val(HP_2200);
      }
      break; //Bogota
    case '2300':
      {
        $("#hora_ciudad").val(HC_2300);$("#hora_poblacion").val(HP_2300);
      }
      break; //Cali
    case '2400':
      {
        $("#hora_ciudad").val(HC_2400);$("#hora_poblacion").val(HP_2400);
      }
      break; //Barranquilla
  }
}
const LoadImg = async (html = ``, icono = `<img src="../resources/icons/preloader.gif" class="img-fluid "/>`) => {
  const contenidoHTML = `${icono}&nbsp;<b>${html}</b>`;
  const configuracionSwal = {
    html: contenidoHTML,
    showConfirmButton: false, // Oculta el botón de confirmación
    allowOutsideClick: false, // Evita cerrar el modal haciendo clic afuera
    allowEscapeKey: false, // Evita cerrar el modal presionando la tecla Esc
    showCloseButton: false, // Muestra el botón de cierre
    background: 'transparent', // Establece el fondo transparente
    backdrop: `rgba(0,250,450,0.4)`,
    customClass: {
      popup: 'background', // Aplica una clase CSS personalizada para eliminar los bordes
    }
  };
  Swal.fire(configuracionSwal);
}
const UnloadImg = async () => {
  Swal.close();
}

function Consultar() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/GestionLogistica.php",
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) {
      swal('Error al consultar', ERROR + ' - ' + JQERROR, 'error');
    },
    beforeSend: function () {
      LoadImg('Cargando información');
    },
    data: {
      op: "B_PEDIDOS",
      fh_ini: $("#fh_ini").val(),
      fh_fin: $("#fh_fin").val(),
      oficina: $("#oficina").val(),
      almacen: $("#almacen").val()
    },
    async: true,
    success: function (data) {
      if (data != '' && data != null) {
        var tabla = `<table class="table" align="center" width="100%" id="td_result">
							  <thead>
								<tr>
								  <td colspan="12" class="table-danger" align="center"><b>INFORMACION DE OT</b></td>
								  <td colspan="8"  class="table-warning" align="center"><b>PICKING</b></td>
								  <td colspan="8"  class="table-success" align="center"><b>FACTURACION</b></td>
								  <td colspan="9"  class="table-info" align="center"><b>EMPAQUE</b></td>
								  <td colspan="9" class="table-primary" align="center"><b>DESPACHO</b></td>
								</tr>
								<tr>
								  <th>FERIA</th>
								  <th>AGRUPADOS</th>
								  <th>SAP</th>
								  <th>CONDICION</th>
								  <th>ALMACEN</th>
								  <th>BODEGA</th>
								  <th>DPTO</th>
								  <th>CIUDAD</th>
								  <th>PRODUCTOS</th>
								  <th>ITEMS</th>
								  <th>OT</th>
								  <th>DIRECCION</th>
								  <th>FECHA/HORA</th>
								  <th>INICIO</th>
								  <th>HORA</th>
								  <th>FIN</th>
								  <th>HORA</th>
								  <th>MINUTOS</th>
								  <th>USUARIO</th>
								  <th>NUMERO</th>
								  <th>INICIO</th>
								  <th>HORA</th>
								  <th>FIN</th>
								  <th>HORA</th>
								  <th>MINUTOS</th>
								  <th>USUARIO</th>
								  <th>INICIO</th>
								  <th>HORA</th>
								  <th>FIN</th>
								  <th>HORA</th>
								  <th>MINUTOS</th>
								  <th>USUARIO</th>
								  <th>CAJAS</th>
								  <th>NOTAS</th>
								  <th>INICIO</th>
								  <th>HORA</th>
								  <th>FIN</th>
								  <th>MINUTOS</th>
								  <th>HORA</th>
								  <th>USUARIO</th>
								  <th>NOTA</th>
								  <th>TIPO_ZONA</th>
								</tr>
							  </thead>
							  <tbody id="td_body">`;

        var todos = 0;
        var pedidos = 0;
        var separado = 0;
        var facturado = 0;
        var empacado = 0;
        var despachado = 0;
        for (var i = 0; i <= data.length - 1; i++) {
          var css = '';
          todos++;
          if (data[i].USR_PICKING == '' && data[i].USUARIO_EMPAQUE == '' && data[i].USUARIO_FACTURA == '' && data[i].TRANSPORTADOR == '') {
            pedidos++;
            css = 'class="table-danger"';
          }
          if (data[i].USR_PICKING != '' && data[i].USUARIO_EMPAQUE == '' && data[i].USUARIO_FACTURA == '' && data[i].TRANSPORTADOR == '') {
            separado++;
            css = 'class="table-warning"';
          }
          if (data[i].USUARIO_FACTURA != '' && data[i].USUARIO_EMPAQUE == '' && data[i].TRANSPORTADOR == '') {
            facturado++;
            css = 'class="table-success"';
          }
          if (data[i].USUARIO_EMPAQUE != '' && data[i].TRANSPORTADOR == '') {
            empacado++;
            css = 'class="table-info"';
          }
          if (data[i].TRANSPORTADOR != '') {
            despachado++;
            css = 'class="table-primary"';
          }
		  let icon = 'NO';
          if (data[i].CONTIENE_FERIA == 1) {
			  icon = 'SI';
          }
          tabla += `<tr ${css}>
					<td>${icon}</td>
                    <td>${data[i].UNIFICADOS}</td>
					<td>${data[i].CODIGO_SAP}</td>
					<td>${data[i].CONDICION_PAGO} - ${data[i].DESCRIPCION_CONDICION_PAGO}</td>
					<td>${data[i].ALMACEN}</td>
					<td>${data[i].BODEGA}</td>
					<td>${data[i].DPTO}</td>
					<td>${data[i].CIUDAD}</td>
					<td>${data[i].ITEMS}</td>
					<td>${data[i].PRODUCTOS}</td>
					<td>${data[i].NUMERO_OT}</td>
					<td>${data[i].DIR_ALTERNA}</td>
					<td>${data[i].FECHA_OT}-${data[i].HORA_OT}</td>
					<td>${data[i].INICIO_PICKING}</td>
					<td>${data[i].HORA_INICIO_PICKING}</td>
					<td>${data[i].FIN_PICKING}</td>
					<td>${data[i].HORA_FIN_PICKING}</td>
					<td>${data[i].MINUTOS}</td>
					<td>${data[i].USR_PICKING}</td>
					<td>${data[i].NUMERO_FACTURA}</td>
					<td>${data[i].FECHA_FACTURA}</td>
					<td>${data[i].HORA_FECHA_FACTURA}</td>
					<td>${data[i].FECHA_FACTURA_FIN}</td>
					<td>${data[i].HORA_FECHA_FACTURA_FIN}</td>
					<td>${data[i].MINUTOS_FACTURA}</td>
					<td>${data[i].USUARIO_FACTURA}</td>
					<td>${data[i].FECHA_EMPAQUE}</td>
					<td>${data[i].HORA_EMPAQUE}</td>
					<td>${data[i].FECHA_EMPAQUE_FIN}</td>
					<td>${data[i].HORA_EMPAQUE_FIN}</td>
					<td>${data[i].MINUTOS_EMPAQUE}</td>
					<td>${data[i].USUARIO_EMPAQUE}</td>
					<td>${data[i].N_CAJAS}</td>
					<td>${data[i].NOTA_EMPAQUE}</td>
					<td>${data[i].INICIO_DESPACHO}</td>
					<td>${data[i].HORA_INICIO_DESPACHO}</td>
					<td>${data[i].FIN_DESPACHO}</td>
					<td>${data[i].HORA_FIN_DESPACHO}</td>
					<td>${data[i].MINUTOS_DESPACHO}</td>
					<td>${data[i].TRANSPORTADOR}</td>
					<td>${data[i].NOTA_DESPACHO}</td>
					<td style="display:none;">${data[i].HORA_OT}</td>
					<td>${data[i].TIPO_ZONA}</td>
				  </tr>`;

        }
        $("#CantTotal").html('<b>' + todos + '</b>&nbsp;');
        $("#CantPedido").html('<b>' + pedidos + '</b>&nbsp;');
        $("#CantSeparado").html('<b>' + separado + '</b>&nbsp;');
        $("#CantFacturado").html('<b>' + facturado + '</b>&nbsp;');
        $("#CantEmpacado").html('<b>' + empacado + '</b>&nbsp;');
        $("#CantDespachado").html('<b>' + despachado + '</b>&nbsp;');
        $("#CantFueraCorte").html('<b>' + despachado + '</b>&nbsp;');


        tabla += '</tbody></table>';
        $("#result").html(tabla);
       
      } else {
        $("#CantTotal").html('<b>0</b>&nbsp;');
        $("#CantPedido").html('<b>0</b>&nbsp;');
        $("#CantSeparado").html('<b>0</b>&nbsp;');
        $("#CantFacturado").html('<b>0</b>&nbsp;');
        $("#CantEmpacado").html('<b>0</b>&nbsp;');
        $("#CantDespachado").html('<b>0</b>&nbsp;');
        $("#CantFueraCorte").html('<b>0</b>&nbsp;');
        $("#result").html('<div class="alert alert-danger" role="alert">'
          + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
          + '<span class="sr-only">Error:</span>SIN RESULTADOS '
          + '</div>');
      }
    }
  }).always(function () {
    UnloadImg();
  });
}
var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
//Function to convert rgb color to hex format
function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

function FiltroColor(clase) {
  $("#td_body tr").each(function (index, element) {
    var claseFila = $(this).attr('class') ? $(this).attr('class').toUpperCase() : '';
    var primerColumna = $(this).find('td:first').text().trim().toUpperCase();
    var filtrarPorFeria = $('#chkFeria').is(':checked');
	  if(filtrarPorFeria){
		  filtroSiNo = 'SI'		  
	  }else{
		  filtroSiNo = '';
	  }
	  
    if ((claseFila.includes(clase.toUpperCase()) || clase === '') && (filtroSiNo === '' || primerColumna === filtroSiNo)) {		
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}


// Función para filtrar la tabla según el campo de entrada global y el checkbox
function filtrarTabla() {
  var filtroGlobal = $('#filtro').val().trim().toUpperCase();
  var filtrarPorFeria = $('#chkFeria').is(':checked');

  $("#td_body tr").each(function () {
    var mostrarFila = false;
    var primerColumna = $(this).find('td:first').text().trim().toUpperCase();

    // Verificar cada celda si contiene el filtro global
    $(this).find('td').each(function () {
      var contenidoCelda = $(this).text().trim().toUpperCase();
      if (contenidoCelda.indexOf(filtroGlobal) !== -1) {
        mostrarFila = true;
        return false; // Salir del loop de las celdas si encontramos una coincidencia
      }
    });

    // Si el checkbox está marcado, filtrar por la primera columna que debe ser "SI"
    if (filtrarPorFeria && primerColumna !== 'SI') {
      mostrarFila = false;
    }

    if (mostrarFila) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

// Función para filtrar la tabla según el campo de entrada global, el checkbox y la hora
function FiltroHora(tipo) {
  var filtroGlobal = $('#filtro').val().trim().toUpperCase();
  var filtrarPorFeria = $('#chkFeria').is(':checked');
  var Hora = tipo === 'C' ? $("#hora_ciudad").val() : $("#hora_poblacion").val();

  $("#td_body tr").each(function (index, element) {
    var mostrarFila = true;
    var primerColumna = $.trim($(this).find('td').eq(0).text()).toUpperCase();
    var OTHora = $.trim($(this).find("td").eq(40).html());
    var OTDespacho = $.trim($(this).find("td").eq(34).html());
    var OTZona = $.trim($(this).find("td").eq(41).html());

    // Filtrar por hora, despacho y zona
    if (!(OTHora <= Hora && OTDespacho === '' && OTZona === tipo)) {
      mostrarFila = false;
    }

    // Si el checkbox está marcado, filtrar por la primera columna que debe ser "SI"
    if (filtrarPorFeria && primerColumna !== 'SI') {
      mostrarFila = false;
    }

    // Verificar cada celda si contiene el filtro global
    $(this).find('td').each(function () {
      var contenidoCelda = $(this).text().trim().toUpperCase();
      if (filtroGlobal && contenidoCelda.indexOf(filtroGlobal) === -1) {
        mostrarFila = false;
      }
    });

    if (mostrarFila) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

