var miModal;
const url_img = 'https://app.pwmultiroma.com/web/banners/eventoscomerciales/';

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

const listarEventosCierres = async (descripcion) => {

  try {
    const data = {
      link: url_api + 'eventoscierre/search',
      descripcion
    }
    const respuesta = await enviarPeticion(data);

    let p = '<option value="0">No</option>';

    if (respuesta.length > 0) {
      respuesta.forEach(item => {
        p += `<option value="${item.id}">${item.descripcion.toUpperCase()}</option>`
      })
    }

    $("#eventos_cierres").html(p);

  } catch (e) {
    console.error(e)
  }
}

const ApilistarOficinas = async () => {

  try {

    fetch(url_api + 'datosmaestros/oficinas')
      .then(resp => {
        return resp.json()
      })
      .then(data => {
        p = '<option value=""></option>';
        _ofi = $.trim($("#Ofi").val());

        data = data.filter(o => o.oficina_ventas.substring(0, 1) == _ofi.substring(0, 1))

        data.forEach(oficina => {
          p += `<option value="${oficina.oficina_ventas}">${oficina.oficina_ventas}</option>`
        })

        $("#oficinas").html(p);
      })
  } catch (e) {
    console.error(e)
  }

}

const crearEventoCierre = async () => {

  try {
    const data = {
      link: url_api + 'eventoscierre/create',
      descripcion: $("#nombre_evento_cierre").val()
    }
    $("button,input").attr("disabled", true);
    const respuesta = await enviarPeticion(data);
    $("button,input").attr("disabled", false);
    if (respuesta.id > 0) {

      listarEventosCierres('');
      //$("#staticBackdrop").modal("hide")
      miModal.hide();
      Swal.fire("Ok", "Se guardo correctamente el registro", "success");
    }
  } catch (e) {
    console.error(e)
    $("button,input").attr("disabled", false);
  }

}

const crearEventoComercial = async (data) => {

  const respuesta = await enviarPeticion(data);

}

const removeClasValidationForm = () => {

  var forms = document.querySelectorAll('.needs-validation')

  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.classList.remove("was-validated");
    });
  event.preventDefault();
}

const mostrarBanners = (imagenes) => {

  imagenes.forEach((img, idx) => {

    $("#" + img).attr("src", 'https://app.pwmultiroma.com/web/banners/eventoscomerciales/banner1_evento_comercial_' + (idx + 1))
  })
}

const cargarForm = async (id) => {

  try {

    showLoadingSwalAlert2('Cargando información', false);
    const data = {
      link: url_api + 'eventoscomerciales/searchid',
      id,
      metodo: 'GET'
    }
    const respuesta = await enviarPeticion(data);

    if (respuesta.length == 1) {
      resp = respuesta[0];
      //url_img='https://dfnas.pwmultiroma.com/banners/eventoscomerciales/';
      $("#list-lab").html(``)
      $("#id").val(resp.id);
      $("#nombre").val(resp.nombre);
      $("#oficinas").val(resp.oficina_ventas);
      $("#fecha_inicial").val(resp.fecha_inicio);
      $("#fecha_final").val(resp.fecha_fin);
      $("#fecha_fin_terrestre").val(resp.fecha_fin_terrestre);
      $("#fecha_fin_convocatoria").val(resp.fecha_fin_convocatoria);
      $("#presupuesto_aereos").val(resp.presupuesto_aereo);
      $("#presupuesto_terrestres").val(resp.presupuesto_terrestre);
      $("#fecha_fin_aereo").val(resp.fecha_fin_aereo);
      $("#eventos_cierres").val(resp.id_evento_cierre).trigger("change");
      $("#estado").val(resp.estado);
      $("#usuario").val(resp.usuario);
      $("#info_lugar").val(resp.info_lugar)
      $("#info_direccion").val(resp.info_direccion)
      $("#info_premios").val(resp.info_premios);

      $("#lab-csv").attr("disabled", true);

      if (resp.n_lab > 0) {
        $(".cl_input_csv_lab").hide();
      } else {
        $(".cl_input_csv_lab").show();
      }

      $(".nav-tabs >button").removeClass("active");
      $(".nav-tabs button:first-child").addClass("active").addClass("show");
      $(".tab-content div").removeClass("show active");
      $("#nav-home").addClass("show active");

      $("#guardar").html(`<i class="fa-regular fa-pen-to-square"></i><span class="p-1">Editar</span>`).prop("disabled", false);
      imagenes = [];
      //$("#img_publicitaria_1").val(resp.img_publicitaria_1);
      //$("#img_publicitaria_2").val(resp.img_publicitaria_2);

      if (resp.img_publicitaria_1 != '') {
        link1 = url_img + resp.img_publicitaria_1;
        console.log(link1)
        $("#img-banner-1").attr("src", link1)

      }
      if (resp.img_publicitaria_2 != '') {
        link2 = url_img + resp.img_publicitaria_2;
        console.log(link2)
        $("#img-banner-2").attr("src", link2)
      }

    }

    dissminSwal();
  } catch (e) {
    console.error(e)
    dissminSwal();
    Swal.fire("Error", "Se genero un error en el servidor", "error");
  }

}

const eliminarLabSave = async (id, ob) => {

  try {
    Swal.fire({
      title: 'Esta seguro que desea eliminar el laboratorio?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        if (id > 0) {
          data = {
            link: url_api + 'laboratoriosconvocatoria/eliminarporid',
            id
          }

          resp = await enviarPeticion(data);

          if (resp.ok) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Se elimino correctamente el laboratorio',
              showConfirmButton: false,
              timer: 1500
            })

            $(ob).parent().parent().parent().remove();
            buscarEventos();
          } else {
            Swal.fire("Error", "Error al eliminar el registro", "error")
          }
        }
      }
    })


  } catch (e) {
    console.error(e)
    wal.fire("Error", "Se genero un error interno!", "error")
  }

}

const HttpEliminarLabsSave = async (id_evento) => {

  return await enviarPeticion({
    link: url_api + 'laboratoriosconvocatoria/eliminarporevento',
    id_evento
  });
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

const EliminarLabsSave = () => {

  try {
    Swal.fire({
      title: 'Esta seguro que desea eliminar todos los laboratorios?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        id_evento = $("#id-evento-modal").val();

        if (id_evento > 0) {

          resp = await HttpEliminarLabsSave(id_evento);

          if (resp.ok) {

            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Se eliminaron correctamente los laboratorios',
              showConfirmButton: false,
              timer: 1500
            })
            $("#list-lab-modal").html('');

          } else {
            Swal.fire("Error", "Ha ocurrido un error", "error")
          }
        }
      }
    })


  } catch (e) {
    console.error(e)
  }

}

const abrirModalLab = async (id_evento) => {

  try {
    $("#modal-labs").modal("show");
    $('#form2')[0].reset();
    $(".cl_input_csv_lab").show();
    const data = {
      link: url_api + 'laboratoriosconvocatoria/buscarporevento',
      id_evento
    }
    showLoadingSwalAlert2('Cargando laboratorios', false);
    const resp = await enviarPeticion(data);

    n = $("#list-lab-modal div.row").length;
    n++;
    fila = '';

    if (resp.length > 0) {

      fila = `
					<div class="row">
						<div class="col-1">
						</div>
					   <div class="col-2">
							<label class="m-1">Nit</label>
					   </div>
					   <div class="col-3">
							<label class="m-1">Nombres</label>
					   </div>
					   <div class="col-2">
							<label class="m-1">Grupo articulo</label>
					   </div>
					   <div class="col-2">
							<label class="m-1">Monto</label>
					   </div>
					   <div class="col-1">
							<label class="m-1 text-center"></label>
					   </div>
					   <div class="col-1">
							<label class="m-1 text-center"></label>
					   </div>
					</div>
				`
    }

    resp.forEach((item, idx) => {

      patrocinador = '';
      n = idx + 1;

      if (item.patrocinador == "1") {
        patrocinador = "checked";
      }

      fila += `
					<div class="row rows-lab" id="row-lab-${n}">
						<div class="col-1 columna-${n}-0">
						 ${n}
						</div>
							<div class="col-2 columna-${n}-1">
							  <input type="text" onkeypress="return vnumeros(event)" class="form-control autocomplete-lab form-control-sm" name="lab-nit" value="${item.nit}" minlength="6" maxlength="15" required>
							</div>
							<div class="col-3  columna-${n}-2">
							   <input type="text" value="${item.nombres}"  class="form-control form-control-sm  autocomplete-lab" name="lab-nombres" minlength="3" maxlength="50" required>
							</div>
							<div class="col-2  columna-${n}-3">
								<input type="text"  maxlength="10" class="form-control form-control-sm  autocomplete-lab" name="lab-grupo" value="${item.grupo_articulo}" >
							</div>
							<div class="col-2 columna-${n}-4">
							   <input type="number" value="${Math.round(item.monto)}" class="form-control form-control-sm" name="lab-monto" required>
							</div>
							<div class="col-1  columna-${n}-5">
									<center><input type="checkbox" ${patrocinador} class="form-check" /></center>
							</div>
							<div class="col-1  columna-${n}-6">
									 <div  class="btn-group btn-group-sm">
										<button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarLabSave(${item.id},this)"><i class="fa fa-trash"></i></button>
									  </div>
							 </div>
							<div class="col-2 row_codigo_sap columna-${n}-7" style="display:none">
							    <input type="number" class="codigo_sap" value="${item.nit}" readonly  />
							</div>
							<div class="col-2 columna-${n}-8" style="display:none">
								<input type="number" class="id-lab" readonly value="${item.id}" >
							</div>
						</div>`;

    })

    dissminSwal();

    $("#id-evento-modal").val(id_evento);
    $("#list-lab-modal").html(fila);
    $("#lab-csv-modal").val('');

  } catch (e) {
    console.error(e)
    dissminSwal();
  }
}

let hot1;
let hot2;
let hot3;
let hot4;
let hot5;

const verDetalleConsolidados = async (codigoCliente) => {
  try {
    showLoadingSwalAlert2("Cargando información...", false, true);
    const detalleConso = await enviarPeticion({ op: "G_DETALLE_CONSOLIDADOS", link: "../models/EventosComerciales.php", codigoCliente });

    const objDetalleConso = detalleConso.data.map(item => {
      let porcentajeCumplimiento = 0;

      const valorTotal = parseFloat(item.VALOR_TOTAL);
      const valorFacturadoEvento = parseFloat(item.VALOR_FACTURADO_EVENTO);

      if (!isNaN(valorTotal) && valorTotal > 0 && !isNaN(valorFacturadoEvento) && valorFacturadoEvento > 0) {
        porcentajeCumplimiento = (valorFacturadoEvento * 100) / valorTotal;
      } else {
        porcentajeCumplimiento = 0;
      }

      return {
        codigo: item.CODIGO,
        descripcion: item.DESCRIPCION,
        grupoArticulos: item.GRUPO_ARTICULOS,
        oficina: item.OFICINA_VENTAS,
        codigoCliente: item.CODIGO_CLIENTE,
        nitCliente: item.NIT_CLIENTE,
        ciudad: item.CIUDAD.toUpperCase(),
        nombreCliente: item.NOMBRE_CLIENTE,
        usuarioPassport: item.USUARIO_PASSPORT.toUpperCase(),
        zonaVentas: item.ZONA_VENTAS,
        zonaDescripcion: item.ZONA_DESCRIPCION,
        valorUnitario: formatNum(item.VALOR_UNITARIO, "$"),
        descuento: item.DESCUENTO,
        iva: item.IVA,
        cantidad: item.CANTIDAD,
        cantidadFacturada: item.CANTIDAD_FACTURADA,
        valorTotal: formatNum(item.VALOR_TOTAL, "$"),
        valorFacturadoTotal: formatNum(item.VALOR_FACTURADO_TOTAL, "$"),
        valorFacturadoEvento: formatNum(item.VALOR_FACTURADO_EVENTO, "$"),
        porcentajeCumplimiento: porcentajeCumplimiento.toFixed(2),
      }
    });

    console.log(objDetalleConso);

    const colHeadersArr = ['Código', 'Descripción', 'Grupo Articulos', 'Oficina', 'Código Cliente', 'Nit Cliente', 'Ciudad', 'Nombre Cliente', 'Usuario Passport', 'Zona Ventas', 'Zona Descripción', 'Valor Unitario', 'Descuento', 'Iva', 'Cantidad', 'Valor Total', 'Cant. Facturada', 'Val. Fact. Total', 'Val. Fact. Evento', '% Cumplimiento'];

    const handsontable4 = document.getElementById("handsontable4");
    const colWidthsArr = [
      95,  // 'Código'
      320,  // 'Descripción'
      120,  // 'Grupo articulos'
      75,  // 'Oficina'
      120,  // 'Código cliente'
      110,  // 'Nit cliente'
      110,  // 'Ciudad'
      250,  // 'Nombre cliente'
      200,  // 'Usuario passport'
      120,  // 'Zona ventas'
      150,  // 'Zona descripción'
      120,  // 'Valor unitario'
      100,  // 'Descuento'
      70,   // 'Iva'
      90,  // 'Cantidad'
      120,  // 'Valor total'
      120,  // 'Cantidad facturada'
      130,  // 'Valor facturado total'
      130,  // 'Valor facturado evento'
      125   // '% cumplimiento'
    ];

    const columnsArr = [
      { data: "codigo", type: "text", readOnly: true },
      { data: "descripcion", type: "text", readOnly: true },
      { data: "grupoArticulos", type: "text", readOnly: true },
      { data: "oficina", type: "text", readOnly: true },
      { data: "codigoCliente", type: "text", readOnly: true },
      { data: "nitCliente", type: "text", readOnly: true },
      { data: "ciudad", type: "text", readOnly: true },
      { data: "nombreCliente", type: "text", readOnly: true },
      { data: "usuarioPassport", type: "text", readOnly: true },
      { data: "zonaVentas", type: "text", readOnly: true },
      { data: "zonaDescripcion", type: "text", readOnly: true },
      { data: "valorUnitario", type: "numeric", readOnly: true },
      { data: "descuento", type: "numeric", readOnly: true },
      { data: "iva", type: "numeric", readOnly: true },
      { data: "cantidad", type: "numeric", readOnly: true },
      { data: "valorTotal", type: "numeric", readOnly: true },
      { data: "cantidadFacturada", type: "numeric", readOnly: true },
      { data: "valorFacturadoTotal", type: "numeric", readOnly: true },
      { data: "valorFacturadoEvento", type: "numeric", readOnly: true },
      { data: "porcentajeCumplimiento", type: "numeric", readOnly: true }
    ];

    hot4 = new Handsontable(handsontable4, {
      data: objDetalleConso,
      height: $(window).height() - 10,
      colWidths: colWidthsArr,
      colHeaders: colHeadersArr,
      columns: columnsArr,
      cells: function (row, col, prop) {
        let cellProperties = {};
        let cellValue = parseFloat(this.instance.getDataAtCell(row, col)) || 0;

        if (prop === "porcentajeCumplimiento") {
          if (cellValue < 30.5) {
            cellProperties.className = "low-percentage";
          } else if (cellValue >= 30.5 && cellValue < 99) {
            cellProperties.className = "medium-percentage";
          } else {
            cellProperties.className = "high-percentage";
          }
        }
        return cellProperties;
      },
      afterChange: async function (changes, source) { },
      dropdownMenu: true,
      hiddenColumns: {
        indicators: true,
      },
      contextMenu: true,
      multiColumnSorting: true,
      filters: true,
      rowHeaders: true,
      manualRowMove: true,
      autoWrapCol: true,
      autoWrapRow: true,
      licenseKey: "non-commercial-and-evaluation",
    });
    $("#handsontable4").addClass("full-screen");
    setTimeout(() => {
      hot4.render();
    }, 500);
    dissminSwal();
  } catch (error) {
    console.log(error);
  }
}

// TODO: REALIZAR AJUSTE DE ASIGNAR OFICINA DINÁMICAMENTE
const verConsolidadoOficinas = (resp) => {
  const oficinaMedellin = resp.filter(item => item.OFICINA_VENTAS === "2100");
  const oficinaBogota = resp.filter(item => item.OFICINA_VENTAS === "2200");
  const oficinaCali = resp.filter(item => item.OFICINA_VENTAS === "2300");
  const oficinaBarranquilla = resp.filter(item => item.OFICINA_VENTAS === "2400");
  
  //? MEDELLIN
  const consolidadoMedellin = oficinaMedellin.reduce((acumulado, item) => {
    const valorTotal = parseFloat(item.VALOR_TOTAL || 0);
    const valorFacturado = parseFloat(item.VALOR_FACTURADO || 0);

    acumulado.total += valorTotal;
    acumulado.facturado += valorFacturado;
    acumulado.pendiente += valorTotal - valorFacturado;

    return acumulado;
  }, { total: 0, facturado: 0, pendiente: 0 });
  consolidadoMedellin.porcentajeCumplimiento = consolidadoMedellin.total > 0
    ? (consolidadoMedellin.facturado / consolidadoMedellin.total) * 100
    : 0;
  consolidadoMedellin.porcentajeCumplimiento = parseFloat(consolidadoMedellin.porcentajeCumplimiento.toFixed(2));
  consolidadoMedellin.oficina = "MEDELLÍN";

  //? BOGOTÁ
  const consolidadoBogota = oficinaBogota.reduce((acumulado, item) => {
    const valorTotal = parseFloat(item.VALOR_TOTAL || 0);
    const valorFacturado = parseFloat(item.VALOR_FACTURADO || 0);

    acumulado.total += valorTotal;
    acumulado.facturado += valorFacturado;
    acumulado.pendiente += valorTotal - valorFacturado;

    return acumulado;
  }, { total: 0, facturado: 0, pendiente: 0 });
  consolidadoBogota.porcentajeCumplimiento = consolidadoBogota.total > 0
    ? (consolidadoBogota.facturado / consolidadoBogota.total) * 100
    : 0;
  consolidadoBogota.porcentajeCumplimiento = parseFloat(consolidadoBogota.porcentajeCumplimiento.toFixed(2));
  consolidadoBogota.oficina = "BOGOTÁ";

  //? CALI
  const consolidadoCali = oficinaCali.reduce((acumulado, item) => {
    const valorTotal = parseFloat(item.VALOR_TOTAL || 0);
    const valorFacturado = parseFloat(item.VALOR_FACTURADO || 0);

    acumulado.total += valorTotal;
    acumulado.facturado += valorFacturado;
    acumulado.pendiente += valorTotal - valorFacturado;

    return acumulado;
  }, { total: 0, facturado: 0, pendiente: 0 });
  consolidadoCali.porcentajeCumplimiento = consolidadoCali.total > 0
    ? (consolidadoCali.facturado / consolidadoCali.total) * 100
    : 0;
  consolidadoCali.porcentajeCumplimiento = parseFloat(consolidadoCali.porcentajeCumplimiento.toFixed(2));
  consolidadoCali.oficina = "CALI";

  //? BARRANQUILLA
  const consolidadoBarranquilla = oficinaBarranquilla.reduce((acumulado, item) => {
    const valorTotal = parseFloat(item.VALOR_TOTAL || 0);
    const valorFacturado = parseFloat(item.VALOR_FACTURADO || 0);

    acumulado.total += valorTotal;
    acumulado.facturado += valorFacturado;
    acumulado.pendiente += valorTotal - valorFacturado;

    return acumulado;
  }, { total: 0, facturado: 0, pendiente: 0 });
  consolidadoBarranquilla.porcentajeCumplimiento = consolidadoBarranquilla.total > 0
    ? (consolidadoBarranquilla.facturado / consolidadoBarranquilla.total) * 100
    : 0;
  consolidadoBarranquilla.porcentajeCumplimiento = parseFloat(consolidadoBarranquilla.porcentajeCumplimiento.toFixed(2));
  consolidadoBarranquilla.oficina = "BARRANQUILLA";

  const objOficinas = [consolidadoMedellin, consolidadoBogota, consolidadoCali, consolidadoBarranquilla]

  let elementos = ``;
  let bgColor = ``;

  objOficinas.forEach(item => {
    const porcentaje = parseFloat(item.porcentajeCumplimiento);
    const facturado = parseFloat(item.facturado).toFixed(2);
    const pendiente = parseFloat(item.pendiente).toFixed(2);

    if (porcentaje < 30.5) {
      bgColor = "#ec7063";
    } else if (porcentaje >= 30.5 && porcentaje < 99) {
      bgColor = "#f9e79f";
    } else {
      bgColor = "#1abc9c";
    }

    elementos += `
          <tr>
            <td>${item.oficina}</td>
            <td>${formatNum(item.total, "$")}</td>
            <td>${formatNum(facturado, "$")}</td>
            <td>${formatNum(pendiente, "$")}</td>
            <td style="background-color: ${bgColor};">${item.porcentajeCumplimiento}</td>
          </tr>`;
  });

  const totalGeneral = objOficinas.reduce((acc, oficina) => acc + oficina.total, 0);
  const totalFacturado = objOficinas.reduce((acc, oficina) => acc + oficina.facturado, 0);
  const totalPendiente = objOficinas.reduce((acc, oficina) => acc + oficina.pendiente, 0);
  const porcentajeCumplimientoTotal = ((totalFacturado / totalGeneral) * 100).toFixed(2);

  $('#tablaOficinas tbody').html(elementos);
  $('#tPassport').text(formatNum(totalGeneral, "$"));
  $('#tFacturado').text(formatNum(parseFloat(totalFacturado).toFixed(2), "$"));
  $('#tPendiente').text(formatNum(parseFloat(totalPendiente).toFixed(2), "$"));
  $('#tPorcentaje').text(porcentajeCumplimientoTotal + "%");
}

const verConsolidadoEvento = async (id) => {
  try {
    showLoadingSwalAlert2("Cargando información... Por favor espere, esto puede tardar unos minutos", false, true);
    const consolidado = await enviarPeticion({ op: "G_CONSOLIDADO_EVENTO", link: "../models/EventosComerciales.php", id });

    verConsolidadoOficinas(consolidado.data);

    const objConsolidados = consolidado.data.map(item => {
      let porcentajeCumplimiento = 0;

      const valorTotal = parseFloat(item.VALOR_TOTAL);
      const valorFacturado = parseFloat(item.VALOR_FACTURADO);

      if (!isNaN(valorTotal) && valorTotal > 0 && !isNaN(valorFacturado) && valorFacturado > 0) {
        porcentajeCumplimiento = (valorFacturado * 100) / valorTotal;
      } else {
        porcentajeCumplimiento = 0;
      }

      return {
        oficina: item.OFICINA_VENTAS,
        codigoCliente: item.CODIGO_CLIENTE,
        nitCliente: item.NIT_CLIENTE,
        nombreCliente: item.NOMBRE_CLIENTE,
        razonCliente: item.RAZON_CLIENTE,
        condicionPago: item.CONDICION_PAGO,
        pedidoADG: item.PEDIDO_ADG,
        nombreVendedor: item.NOMBRE_VENDEDOR,
        valorTotal: formatNum(item.VALOR_TOTAL, "$"),
        valorFacturado: formatNum(item.VALOR_FACTURADO, "$"),
        porcentajeCumplimiento: porcentajeCumplimiento.toFixed(2)
      }
    });

    const colHeadersArr = ['Oficina', 'Código Cliente', 'Nit Cliente', 'Nombre Cliente', 'Razón Cliente', 'Condición Pago', 'Pedido ADG', 'Nombre Vendedor', 'Valor Total', 'Valor Facturado', '% Cumplimiento', 'Acciones'];

    const handsontable2 = document.getElementById("handsontable2");
    const colWidthsArr = [
      75,  // 'Oficina'
      120,  // 'Código cliente'
      110,  // 'Nit cliente'
      250,  // 'Nombre cliente'
      250,  // 'Razón cliente'
      120,  // 'Condición pago'
      100,  // 'Pedido ADG'
      220,  // 'Nombre vendedor'
      120,  // 'Valor total'
      130,  // 'Valor facturado'
      125,  // '% cumplimiento'
      75   // 'Acciones'
    ];

    const columnsArr = [
      { data: "oficina", type: "text", readOnly: true },
      { data: "codigoCliente", type: "text", readOnly: true },
      { data: "nitCliente", type: "text", readOnly: true },
      { data: "nombreCliente", type: "text", readOnly: true },
      { data: "razonCliente", type: "text", readOnly: true },
      { data: "condicionPago", type: "text", readOnly: true },
      { data: "pedidoADG", type: "text", readOnly: true },
      { data: "nombreVendedor", type: "text", readOnly: true },
      { data: "valorTotal", type: "numeric", readOnly: true },
      { data: "valorFacturado", type: "numeric", readOnly: true },
      { data: "porcentajeCumplimiento", type: "numeric", readOnly: true },
      {
        data: null, renderer: function (instance, td, row, col, prop, value, cellProperties) {
          td.innerHTML = `<button class="btn btn-light btn-eye" data-row="${row}">
            <i class="fa-solid fa-eye text-primary"></i>
          </button>`;
          td.style.textAlign = "center";
          td.style.padding = "0";
          td.style.verticalAlign = "middle";
        }
      }
    ];

    hot2 = new Handsontable(handsontable2, {
      data: objConsolidados,
      height: $(window).height() - 10,
      colWidths: colWidthsArr,
      colHeaders: colHeadersArr,
      columns: columnsArr,
      rowHeights: 38,
      autoRowSize: false,
      cells: function (row, col, prop) {
        let cellProperties = {};
        let cellValue = parseFloat(this.instance.getDataAtCell(row, col)) || 0;

        if (prop === "porcentajeCumplimiento") {
          if (cellValue < 30.5) {
            cellProperties.className = "low-percentage";
          } else if (cellValue >= 30.5 && cellValue < 99) {
            cellProperties.className = "medium-percentage";
          } else {
            cellProperties.className = "high-percentage";
          }
        }
        return cellProperties;
      },
      hiddenColumns: {
        indicators: true,
      },
      contextMenu: true,
      multiColumnSorting: true,
      filters: true,
      dropdownMenu: true,
      columnSorting: true,
      rowHeaders: true,
      manualRowMove: true,
      licenseKey: "non-commercial-and-evaluation",
      afterOnCellMouseDown: async function (event, coords, TD) {
        if (TD.querySelector('.btn-eye')) {
          let row = coords.row;
          let rowData = hot2.getSourceDataAtRow(row);
          await verDetalleConsolidados(rowData.codigoCliente);
          $('#modalDetalleConso').modal('show');
        }
      }
    });
    $("#handsontable2").addClass("full-screen");
    setTimeout(() => {
      const filtroPlugin = hot2.getPlugin('filters');
      filtroPlugin.enablePlugin();
      hot2.render();
      hot2.refreshDimensions();
    }, 500);
    dissminSwal();
    return consolidado;
  } catch (error) {
    console.log(error);
  }
}

const verDetalleEvento = async () => {
  try {
    showLoadingSwalAlert2("Cargando información...", false, true);
    const id = $('#idEvento').val();
    const detalle = await enviarPeticion({ op: "G_DETALLE_EVENTO", link: "../models/EventosComerciales.php", id });

    const objDetalles = detalle.data.map(item => {
      let porcentajeCumplimiento = 0;

      const valorTotal = parseFloat(item.VALOR_TOTAL);
      const valorFacturadoEvento = parseFloat(item.VALOR_FACTURADO_EVENTO);

      if (!isNaN(valorTotal) && valorTotal > 0 && !isNaN(valorFacturadoEvento) && valorFacturadoEvento > 0) {
        porcentajeCumplimiento = (valorFacturadoEvento * 100) / valorTotal;
      } else {
        porcentajeCumplimiento = 0;
      }

      return {
        codigo: item.CODIGO,
        descripcion: item.DESCRIPCION,
        grupoArticulos: item.GRUPO_ARTICULOS,
        oficina: item.OFICINA_VENTAS,
        codigoCliente: item.CODIGO_CLIENTE,
        nitCliente: item.NIT_CLIENTE,
        ciudad: item.CIUDAD.toUpperCase(),
        nombreCliente: item.NOMBRE_CLIENTE,
        usuarioPassport: item.USUARIO_PASSPORT.toUpperCase(),
        zonaVentas: item.ZONA_VENTAS,
        zonaDescripcion: item.ZONA_DESCRIPCION,
        valorUnitario: formatNum(item.VALOR_UNITARIO, "$"),
        stock: item.STOCK,
        descuento: item.DESCUENTO,
        iva: item.IVA,
        cantidad: item.CANTIDAD,
        cantidadFacturada: item.CANTIDAD_FACTURADA,
        valorTotal: formatNum(item.VALOR_TOTAL, "$"),
        valorFacturadoTotal: formatNum(item.VALOR_FACTURADO_TOTAL, "$"),
        valorFacturadoEvento: formatNum(item.VALOR_FACTURADO_EVENTO, "$"),
        porcentajeCumplimiento: porcentajeCumplimiento.toFixed(2),
      }
    });

    const colHeadersArr = ['Código', 'Descripción', 'Grupo Articulos', 'Oficina', 'Código Cliente', 'Nit Cliente', 'Ciudad', 'Nombre Cliente', 'Usuario Passport', 'Zona Ventas', 'Zona Descripción', 'Valor Unitario', 'Stock', 'Descuento', 'Iva', 'Cantidad', 'Valor Total', 'Cant. Facturada', 'Val. Fact. Total', 'Val. Fact. Evento', '% Cumplimiento'];

    const handsontable1 = document.getElementById("handsontable1");
    const colWidthsArr = [
      95,  // 'Código'
      320,  // 'Descripción'
      120,  // 'Grupo articulos'
      75,  // 'Oficina'
      120,  // 'Código cliente'
      110,  // 'Nit cliente'
      110,  // 'Ciudad'
      250,  // 'Nombre cliente'
      200,  // 'Usuario passport'
      120,  // 'Zona ventas'
      150,  // 'Zona descripción'
      120,  // 'Valor unitario'
      100,  // 'Stock'
      100,  // 'Descuento'
      70,   // 'Iva'
      90,  // 'Cantidad'
      120,  // 'Valor total'
      120,  // 'Cantidad facturada'
      130,  // 'Valor facturado total'
      130,  // 'Valor facturado evento'
      125   // '% cumplimiento'
    ];

    const columnsArr = [
      { data: "codigo", type: "text", readOnly: true },
      { data: "descripcion", type: "text", readOnly: true },
      { data: "grupoArticulos", type: "text", readOnly: true },
      { data: "oficina", type: "text", readOnly: true },
      { data: "codigoCliente", type: "text", readOnly: true },
      { data: "nitCliente", type: "text", readOnly: true },
      { data: "ciudad", type: "text", readOnly: true },
      { data: "nombreCliente", type: "text", readOnly: true },
      { data: "usuarioPassport", type: "text", readOnly: true },
      { data: "zonaVentas", type: "text", readOnly: true },
      { data: "zonaDescripcion", type: "text", readOnly: true },
      { data: "valorUnitario", type: "numeric", readOnly: true },
      { data: "stock", type: "numeric", readOnly: true },
      { data: "descuento", type: "numeric", readOnly: true },
      { data: "iva", type: "numeric", readOnly: true },
      { data: "cantidad", type: "numeric", readOnly: true },
      { data: "valorTotal", type: "numeric", readOnly: true },
      { data: "cantidadFacturada", type: "numeric", readOnly: true },
      { data: "valorFacturadoTotal", type: "numeric", readOnly: true },
      { data: "valorFacturadoEvento", type: "numeric", readOnly: true },
      { data: "porcentajeCumplimiento", type: "numeric", readOnly: true }
    ];

    hot1 = new Handsontable(handsontable1, {
      data: objDetalles,
      height: $(window).height() - 10,
      colWidths: colWidthsArr,
      colHeaders: colHeadersArr,
      columns: columnsArr,
      cells: function (row, col, prop) {
        let cellProperties = {};
        let cellValue = parseFloat(this.instance.getDataAtCell(row, col)) || 0;

        if (prop === "porcentajeCumplimiento") {
          if (cellValue < 30.5) {
            cellProperties.className = "low-percentage";
          } else if (cellValue >= 30.5 && cellValue < 99) {
            cellProperties.className = "medium-percentage";
          } else {
            cellProperties.className = "high-percentage";
          }
        }
        return cellProperties;
      },
      afterChange: async function (changes, source) { },
      dropdownMenu: true,
      hiddenColumns: {
        indicators: true,
      },
      contextMenu: true,
      multiColumnSorting: true,
      filters: true,
      rowHeaders: true,
      manualRowMove: true,
      autoWrapCol: true,
      autoWrapRow: true,
      licenseKey: "non-commercial-and-evaluation",
    });
    $("#handsontable1").addClass("full-screen");
    dissminSwal();
  } catch (error) {
    console.log(error);
  }
}

const verConsolidados2 = async () => {
  try {
    showLoadingSwalAlert2("Cargando información...", false, true);
    const id = $('#idEvento').val();
    const consolidados2 = await enviarPeticion({ op: "G_CONSOLIDADO_COMPRA_EVENTO", link: "../models/EventosComerciales.php", id });
  
    const resultado = consolidados2.datos.map(evento => {
      const match = JSON.parse( consolidados2.transito).find(t => t.MATERIAL === evento.codigo && t.CENTRO === evento.centro);
      return {
          ...evento, 
          transito: match ? match.TRANSITO : "0"
      };
    });   

    const objResultado = resultado.map(item => {
      let diferencia = 0;

      const stock = parseFloat(item.stock);
      const transito = parseFloat(item.transito);
      const cantidadFacturada = parseFloat(item.cantidad_facturada);
      const cantidad = parseFloat(item.cantidad);

      diferencia = (cantidad) - (stock + transito + cantidadFacturada);

      diferencia = (diferencia < 1 ? 0 : diferencia);

      return {
        codigo: item.codigo,
        descripcion: item.descripcion,
        grupoArticulos: item.grupo,
        oficina: item.oficina,
        organizacion: item.organizacion,
        centro: item.centro,
        almacen: item.almacen,
        cantidad: item.cantidad,
        cantidadFacturada: item.cantidad_facturada,
        stock: item.stock,
        transito: item.transito,
        pnetoEvento: formatNum(item.pneto_evento, "$"),
        pnetoFacturado: formatNum(item.pneto_facturado, "$"),
        diferencia 
      }
    });

    const colHeadersArr = ['Código', 'Descripción', 'Grupo Articulos', 'Oficina', 'Organización', 'Centro', 'Almacen', 'Cantidad', 'Cant. Facturada', 'Stock', 'Transito', 'Val. Fact. Evento', 'Val. Facturado', 'Diferencia'];

    const handsontable5 = document.getElementById("handsontable5");
    const colWidthsArr = [
      95,  // 'Código'
      310,  // 'Descripción'
      130,  // 'Grupo articulos'
      75,  // 'Oficina'
      120,  // 'Organización'
      90,  // 'centro'
      90,  // 'almacen'
      90,  // 'Cantidad'
      120,  // 'Cantidad facturada'
      90,  // 'Stock'
      110,  // 'transito'
      130,  // 'Valor facturado evento'
      130,  // 'Valor facturado total'
      120,  // 'diferencia'
    ];

    const columnsArr = [
      { data: "codigo", type: "text", readOnly: true },
      { data: "descripcion", type: "text", readOnly: true },
      { data: "grupoArticulos", type: "text", readOnly: true },
      { data: "oficina", type: "text", readOnly: true },
      { data: "organizacion", type: "text", readOnly: true },
      { data: "centro", type: "text", readOnly: true },
      { data: "almacen", type: "text", readOnly: true },
      { data: "cantidad", type: "numeric", readOnly: true },
      { data: "cantidadFacturada", type: "numeric", readOnly: true },
      { data: "stock", type: "numeric", readOnly: true },
      { data: "transito", type: "numeric", readOnly: true },
      { data: "pnetoEvento", type: "numeric", readOnly: true },
      { data: "pnetoFacturado", type: "numeric", readOnly: true },    
      { data: "diferencia", type: "numeric", readOnly: true }    
    ];

    hot5 = new Handsontable(handsontable5, {
      data: objResultado,
      height: $(window).height() - 10,
      colWidths: colWidthsArr,
      colHeaders: colHeadersArr,
      columns: columnsArr,
      // cells: function (row, col, prop) {
      //   let cellProperties = {};
      //   let cellValue = parseFloat(this.instance.getDataAtCell(row, col)) || 0;

      //   if (prop === "porcentajeCumplimiento") {
      //     if (cellValue < 30.5) {
      //       cellProperties.className = "low-percentage";
      //     } else if (cellValue >= 30.5 && cellValue < 99) {
      //       cellProperties.className = "medium-percentage";
      //     } else {
      //       cellProperties.className = "high-percentage";
      //     }
      //   }
      //   return cellProperties;
      // },
      afterChange: async function (changes, source) { },
      dropdownMenu: true,
      hiddenColumns: {
        indicators: true,
      },
      contextMenu: true,
      multiColumnSorting: true,
      filters: true,
      rowHeaders: true,
      manualRowMove: true,
      autoWrapCol: true,
      autoWrapRow: true,
      licenseKey: "non-commercial-and-evaluation",
    });
    $("#handsontable5").addClass("full-screen");
    dissminSwal();
  } catch (error) {
    console.log(error);
  }
}

const verZonaEvento = async () => {
  try {
    showLoadingSwalAlert2("Cargando información...", false, true);
    const id = $('#idEvento').val();
    const zona = await enviarPeticion({ op: "G_ZONA_EVENTO", link: "../models/EventosComerciales.php", id });

    const objZonas = zona.data.map(item => {
      let porcentajeCumplimiento = 0;

      const valorTotal = parseFloat(item.VALOR_TOTAL);
      const valorFacturado = parseFloat(item.VALOR_FACTURADO);

      if (!isNaN(valorTotal) && valorTotal > 0 && !isNaN(valorFacturado) && valorFacturado > 0) {
        porcentajeCumplimiento = (valorFacturado * 100) / valorTotal;
      } else {
        porcentajeCumplimiento = 0;
      }

      return {
        zonaVentas: item.ZONA_VENTAS,
        zonaDescripcion: item.ZONA_DESCRIPCION,
        valorTotal: formatNum(item.VALOR_TOTAL, "$"),
        valorFacturado: formatNum(item.VALOR_FACTURADO, "$"),
        porcentajeCumplimiento: porcentajeCumplimiento.toFixed(2)
      }
    });

    const colHeadersArr = ['Zona Ventas', 'Zona Descripción', 'Valor Total', 'Valor Facturado', '% Cumplimiento'];

    const handsontable3 = document.getElementById("handsontable3");
    const colWidthsArr = [
      120,  // 'Zona ventas'
      150,  // 'Zona descripción'
      130,  // 'Valor Total'
      130,  // 'Valor facturado'
      125   // '% cumplimiento'
    ];

    const columnsArr = [
      { data: "zonaVentas", type: "text", readOnly: true },
      { data: "zonaDescripcion", type: "text", readOnly: true },
      { data: "valorTotal", type: "numeric", readOnly: true },
      { data: "valorFacturado", type: "numeric", readOnly: true },
      { data: "porcentajeCumplimiento", type: "numeric", readOnly: true }
    ];

    hot3 = new Handsontable(handsontable3, {
      data: objZonas,
      height: $(window).height() - 10,
      colWidths: colWidthsArr,
      colHeaders: colHeadersArr,
      columns: columnsArr,
      rowHeights: 35,
      autoRowSize: false,    
      cells: function (row, col, prop) {
        let cellProperties = {};
        let cellValue = parseFloat(this.instance.getDataAtCell(row, col)) || 0;

        if (prop === "porcentajeCumplimiento") {
          if (cellValue < 30.5) {
            cellProperties.className = "low-percentage";
          } else if (cellValue >= 30.5 && cellValue < 99) {
            cellProperties.className = "medium-percentage";
          } else {
            cellProperties.className = "high-percentage";
          }
        }
        return cellProperties;
      },
      afterChange: async function (changes, source) { },
      dropdownMenu: true,
      hiddenColumns: {
        indicators: true,
      },
      contextMenu: true,
      multiColumnSorting: true,
      filters: true,
      rowHeaders: true,
      manualRowMove: true,
      // autoWrapCol: true,
      // autoWrapRow: true,
      stretchH: 'all',
      width: '100%',
      licenseKey: "non-commercial-and-evaluation",
    });
    $("#handsontable3").addClass("full-screen");
    dissminSwal();
  } catch (error) {
    console.log(error);
  }
}

function exportarExcel(sw) {
  const hotMap = {
    1: hot1,
    2: hot2,
    3: hot3,
    4: hot4,
    5: hot5
  };

  const hot = hotMap[sw];

  const headers = hot.getColHeader();
  const datos = hot.getData();
  datos.unshift(headers);
  const hoja = XLSX.utils.aoa_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, hoja, "Datos");

  // Forzar codificación UTF-8
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary", cellDates: true });

  // Crear y descargar el archivo correctamente
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "reporte.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const validarPresupuesto = async () => {

}

const guardarPresupuestoEvento = async () => {
  try {
    const idEvento = $('#idEventoPresu').val().split('-')[0];
    const oficina = $('#oficinaPresupuesto').val();
    const eventoAnterior = $('#eventoAnterior').val().replace(/\./g, "").replace(/\$/g, "");
    const presupuesto = $('#presupuesto').val().replace(/\./g, "").replace(/\$/g, "");
    const zonaVentas = oficina.substring(0, 2);

    if (oficina === "2000" || !eventoAnterior || !presupuesto) {
      setTimeout(() => {
        Swal.fire("Campos requeridos", "Debe agregar (Oficina - Presupuesto evento anterior - Presupuesto actual)", "warning");
      }, 100);
      return;
    }

    const respFH = await enviarPeticion({ op: "G_FECHA_HORA", link: "../models/EventosComerciales.php", idEvento });
    const eventoActivo = respFH[0].ACTIVO;

    if (eventoActivo === "FALSE") {
      setTimeout(() => {
        Swal.fire("Guardar presupuesto", "El evento ya excedió el limite de la fecha fin de la convocatoria, por lo tanto no es posible realizar esta acción", "error");
      }, 100);
      return;
    }

    const respEvento = await getPresupuestoEvento(idEvento);
    const resultado = respEvento.data.find(item => item.OFICINA_VENTAS === oficina);
    if (resultado) {
      const result = await confirmAlert("Guardar presupuesto", "La oficina que desea agregar ya se encuentra con presupuesto asignado... Si acepta seguir se reemplazará el presupuesto actual y se eliminarán todos los presupuestos asignados a las zonas relacionadas");

      if (!result.isConfirmed) return;
      const respReplace = await enviarPeticion({
        op: "U_REPLACE_PRESUPUESTO",
        link: "../models/EventosComerciales.php",
        idEvento,
        oficina,
        zonaVentas,
        eventoAnterior,
        presupuesto
      });
      await getPresupuestoEvento(idEvento);
      setTimeout(() => {
        Swal.fire("Reemplazar presupuesto", "El presupuesto ha sido reemplazado y el presupuesto de las zonas asociadas han sido eliminados", "info");
      }, 100);
      $('#oficinaPresupuesto').val("2000");
      $('#eventoAnterior').val("");
      $('#presupuesto').val("");
      return;
    }

    showLoadingSwalAlert2("Guardando la información...", false, true);
    const resp = await enviarPeticion({
      op: "I_PRESUPUESTO_EVENTO",
      link: "../models/EventosComerciales.php",
      idEvento,
      oficina,
      eventoAnterior,
      presupuesto
    });

    if (!resp.ok) {
      Swal.fire("Error", "No se pudo insertar el registro", "error");
      return;
    }

    await getPresupuestoEvento(idEvento);

    $('#oficinaPresupuesto').val("2000");
    $('#eventoAnterior').val("");
    $('#presupuesto').val("");
  } catch (error) {
    console.log(error);
  } finally {
    dissminSwal();
  }
}

const guardarPresupuestoZonas = async () => {
  try {
    const idEvento = $('#idEventoPresu').val().split('-')[0].trim();

    const respFH = await enviarPeticion({ op: "G_FECHA_HORA", link: "../models/EventosComerciales.php", idEvento });
    const eventoActivo = respFH[0].ACTIVO;

    if (eventoActivo === "FALSE") {
      setTimeout(() => {
        Swal.fire("Guardar presupuesto", "El evento ya excedió el limite de la fecha fin de la convocatoria, por lo tanto no es posible realizar esta acción", "error");
      }, 100);
      return;
    }

    let datosOficina = [];
    let datosZona = [];

    $("#tablaPresupuestoZona tbody tr").each(function () {
      let fila = $(this).find("td");
      let $input = fila.find(".inputPresupuestoZona");
      let valorPresupuesto = parseFloat($input.val().replace(/\$/g, "").replace(/\./g, ""));

      let data = {
        idEvento,
        zonaVentas: fila.eq(1).text(),
        zonaDescripcion: fila.eq(2).text(),
        presupuesto: valorPresupuesto,
      };

      datosZona.push(data);
    });

    $("#tablaPresupuestoEvento tbody tr").each(function () {
      let fila = $(this).find("td");

      let data = {
        oficina: fila.eq(0).text().split('-')[0].trim(),
        presupuesto: parseFloat(fila.eq(2).text().replace(/\./g, "").replace(/\$/g, ""))
      };

      datosOficina.push(data);
    });

    let oficinaSubs = datosZona[0].zonaVentas.substring(0, 2);
    let oficina = `${oficinaSubs}00`;

    let presupuestoOficina = datosOficina.filter(item => item.oficina === oficina);
    presupuestoOficina = presupuestoOficina[0].presupuesto;

    const totalPresupuestoZona = datosZona.reduce((acc, zona) => acc + zona.presupuesto, 0);

    if (totalPresupuestoZona < presupuestoOficina) {
      setTimeout(() => {
        Swal.fire("Guardar presupuesto", "El presupuesto total de las zonas no puede ser menor al presupuesto de la oficina", "error");
      }, 100);
      return;
    }

    const result = await confirmAlert("Guardar presupuesto", `Se guardará el presupuesto cargado con un total de las zonas de: ${formatNum(totalPresupuestoZona, "$")}`);
    if (!result.isConfirmed) return;

    showLoadingSwalAlert2('Guardando el presupuesto', false, true);

    let resp = "";

    const respZonas = await enviarPeticion({
      op: "G_PRESUPUESTO_ZONA_BANDERA",
      link: "../models/EventosComerciales.php",
      oficinaSubs,
      idEvento
    });

    if (!respZonas.data.length) {
      resp = await enviarPeticion({
        op: "I_PRESUPUESTO_EVENTO_ZONA",
        datos: JSON.stringify(datosZona),
        link: "../models/EventosComerciales.php"
      });
    } else {
      resp = await enviarPeticion({
        op: "U_PRESUPUESTO_EVENTO_ZONA",
        datos: JSON.stringify(datosZona),
        link: "../models/EventosComerciales.php"
      });
    }

    if (resp.ok) {
      setTimeout(() => {
        Swal.fire("Guardar presupuesto", "Se guardó el presupuesto correctamente", "success");
      }, 100);
      await getZonasPresupuesto(oficinaSubs, idEvento);
    }

  } catch (error) {
    console.log(error);
  } finally {
    dissminSwal();
  }
}

const eliminarPresupuestoEvento = async (idEvento, oficina, zonaVentas) => {
  const result = await confirmAlert("Eliminar presupuesto", "Se eliminará el presupuesto de la oficina y todos los presupuestos de las zonas asociadas a la misma... ¿Desea seguir?");
  if (!result.isConfirmed) return;

  showLoadingSwalAlert2('Eliminando el presupuesto', false, true);

  const resp = await enviarPeticion({
    op: "D_PRESUPUESTO_EVENTO",
    link: "../models/EventosComerciales.php",
    idEvento,
    oficina,
    zonaVentas
  });

  if (resp.ok) {
    setTimeout(() => {
      Swal.fire("Eliminar presupuesto", "Se eliminó el presupuesto correctamente", "success");
    }, 100);
    await getPresupuestoEvento(idEvento);
    $('#containerTablaPresupuestoZona').html(``);
  }
}

const getZonasPresupuesto = async (oficina, idEvento) => {
  try {
    $('#containerTablaPresupuestoZona').html(``);

    const resp = await enviarPeticion({
      op: "G_PRESUPUESTO_EVENTO_ZONA",
      link: "../models/EventosComerciales.php",
      oficina,
      idEvento
    });

    const totalPresupuestoZona = resp.data.reduce((acc, item) => acc + parseFloat(item.PRESUPUESTO), 0);

    let tabla = `
      <table class="table table-bordered table-sm table-hover animate__animated animate__fadeIn" id="tablaPresupuestoZona">
        <thead class="table-info">
          <tr>
            <th>N°</th>
            <th>Zona Ventas</th>
            <th>Zona Descripción</th>
            <th>Presupuesto</th>
          </tr>
        </thead>
        <tbody>`;

    if (resp.data.length) {
      resp.data.forEach((item, index) => {
        tabla += `
          <tr>
            <td>${index + 1}</td>
            <td>${item.ZONA_VENTAS}</td>
            <td>${item.ZONA_DESCRIPCION}</td>
            <td style="display: none;">${item.PRESUPUESTO}</td>    
            <td>
              <input type="text" class="form-control form-control-sm inputPresupuestoZona" value="${formatNum(item.PRESUPUESTO, "$")}">
            </td>    
          </tr>`;
      });

      tabla += `
        </tbody>
      </table>`;

      $('#containerTablaPresupuestoZona').html(tabla);

      $('.inputPresupuestoZona').on('input', function () {
        let value = $(this).val().replace(/[^0-9]/g, '');
        if (value) value = parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 0 });
        $(this).val("$" + value);
      });

      $('#totalPresupuesto').text(formatNum(totalPresupuestoZona, "$"));
      $('#modalPresupuestoZona').modal('show');
    }
  } catch (error) {
    console.log(error);
  }
}

const getPresupuestoEvento = async (idEvento) => {
  $('#containerTablaPresupuesto').html(``);

  const resp = await enviarPeticion({ op: "G_PRESUPUESTO_EVENTO", link: "../models/EventosComerciales.php", idEvento });
  const totalPresupuestoAnterior = resp.data.reduce((acc, item) => acc + parseFloat(item.EVENTO_ANTERIOR), 0);
  const totalPresupuesto = resp.data.reduce((acc, item) => acc + parseFloat(item.PRESUPUESTO), 0);

  let tabla = `
    <h5 class="text-center mt-2 mb-3" style="color: #055160; font-weight: 400">Presupuesto evento oficina</h5>
    <table class="table table-bordered table-sm table-hover" id="tablaPresupuestoEvento">
      <thead class="table-info">
        <tr>
          <th>Oficina</th>
          <th>Evento Anterior</th>
          <th>Presupuesto</th>
          <th class="text-center">Presupuesto Zona</th>
        </tr>
      </thead>
      <tbody>`;

  if (resp.data.length) {
    resp.data.forEach(item => {
      tabla += `
        <tr>
          <td style="vertical-align: middle;">${item.OFICINA_VENTAS} - ${item.DESCRIPCION}</td>
          <td style="vertical-align: middle;">${formatNum(item.EVENTO_ANTERIOR, "$")}</td>
          <td style="vertical-align: middle;">${formatNum(item.PRESUPUESTO, "$")}</td>
          <td class="text-center">
            <button class="btn btn-outline-primary btn-sm btn-presupuesto" data-item="${item.OFICINA_VENTAS}">
              <i class="fa-solid fa-circle-plus"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm btn-eliminar-presupuesto" data-item='${JSON.stringify(item)}'>
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </td>
        </tr>`;
    });

    tabla += `
          </tbody>
          <tfoot class="table-info">
            <tr>
              <td style="vertical-align: middle;">TOTALES</td>
              <td style="vertical-align: middle; font-weight: 600">${formatNum(totalPresupuestoAnterior, "$")}</td>
              <td style="vertical-align: middle; font-weight: 600">${formatNum(totalPresupuesto, "$")}</td>                
              <td style="vertical-align: middle;"></td>                
            </tr>
        </tfoot>
      </table>`;
    $('#containerTablaPresupuesto').html(tabla);

    $('#tablaPresupuestoEvento').on('click', '.btn-presupuesto', async function () {
      let oficina = $(this).attr('data-item');
      oficina = oficina.substring(0, 2);
      $('#oficinaSubs').val(oficina);
      await getZonasPresupuesto(oficina, idEvento);
      // $('#modalPresupuestoZona').modal('show');
    });

    $('#tablaPresupuestoEvento').on('click', '.btn-eliminar-presupuesto', async function () {
      const respFH = await enviarPeticion({ op: "G_FECHA_HORA", link: "../models/EventosComerciales.php", idEvento });
      const eventoActivo = respFH[0].ACTIVO;

      if (eventoActivo === "FALSE") {
        setTimeout(() => {
          Swal.fire("Guardar presupuesto", "El evento ya excedió el limite de la fecha fin de la convocatoria, por lo tanto no es posible realizar esta acción", "error");
        }, 100);
        return;
      }

      let { ID_EVENTO, OFICINA_VENTAS } = JSON.parse($(this).attr('data-item'));
      const zonaVentas = OFICINA_VENTAS.substring(0, 2);
      $('#oficinaSubs').val(zonaVentas);
      await eliminarPresupuestoEvento(ID_EVENTO, OFICINA_VENTAS, zonaVentas);
    });

  } else {
    $('#containerTablaPresupuesto').html(`<p class="lead text-center">No hay presupuestos asignados</td>`);
  }

  return resp;
}

const procesarArchivo = async (esquema) => {
  const fileInput = document.getElementById("archivo");
  const tableBody = document.getElementById("tableBody");
  const tableHeader = document.getElementById("tableHeader");

  if (!fileInput.files.length) {
    Swal.fire("Campo requerido", "Debe seleccionar el archivo a procesar", "warning");
    return;
  }

  showLoadingSwalAlert2("Cargando los datos...", false, true);

  setTimeout(() => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const text = event.target.result;
        const rows = text.split("\n").map(row => row.split(",").map(cell => cell.trim()));

        if (rows.length < 2) {
          Swal.fire("Carga de archivo", "El archivo CSV está vacío o no tiene suficientes datos", "error");
          return;
        }

        const csvHeaders = rows[0];
        const expectedHeaders = esquema.map(col => col.name);

        if (csvHeaders.join(",") !== expectedHeaders.join(",")) {
          setTimeout(() => {
            Swal.fire("Carga de archivo", "El archivo CSV no tiene los encabezados correctos", "error");
          }, 200);
          return;
        }

        tableHeader.innerHTML = `<th>No.</th>` + expectedHeaders.map(header => `<th>${header.replace(/\_/g, " ")}</th>`).join("");
        tableBody.innerHTML = "";
        let elementosCsv = [];

        for (let i = 1; i < rows.length; i++) {
          const element = rows[i][0];
          const element1 = rows[i][1];
          let objElementos = {
            element,
            element1
          }

          elementosCsv.push(objElementos);
        }

        let rowHTML = ``;
        elementosCsv.forEach((item, index) => {
          rowHTML += `
            <tr>
              <td>${index + 1}</td>
              <td>${item.element}</td>
              <td>${item.element1}</td>
            </tr>`;
        });

        tableBody.innerHTML += rowHTML;

      } catch (error) {
        console.error("Error procesando el archivo:", error);
      } finally {
        dissminSwal();
      }
    };

    reader.readAsText(file);
  }, 200);
}

const cargarDatos = async () => {
  const esquema = [
    { name: "MATERIAL", type: "varchar" },
    { name: "ESTATUS", type: "int" }
  ];
  await procesarArchivo(esquema);
}

const getInfoPortafolio = async () => {
  const idEvento = $('#idEvento').val();
  const resp = await enviarPeticion({op: "G_PORTAFOLIO_EVENTO", link: "../models/EventosComerciales.php", idEvento});

  if (!resp.data.length) {
    Swal.fire("Ver portafolio", "El evento no cuenta con portafolio cargado", "info");
    return;
  }

  showLoadingSwalAlert2("Cargando información...", false, true);

  setTimeout(() => {
    $('#archivo').val("");
    document.getElementById("tableBody").innerHTML = ``;
    document.getElementById("tableHeader").innerHTML = ``;

    let header = `
      <th>No.</th>
      <th>MATERIAL</th>
      <th>ESTATUS</th>`;
    
    document.getElementById("tableHeader").innerHTML = header;

    let elementos = ``;
    resp.data.forEach((item, index) => {
      elementos += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.CODIGO_MATERIAL}</td>
          <td>${item.ESTATUS}</td>
        </tr>
      `;
    });
    document.getElementById("tableBody").innerHTML = elementos;
    dissminSwal();      
  }, 500);
}

const guardarDatosPortafolios = async () => {
  const idEvento = $('#idEvento').val();
  try {
    const contenidoTabla = $("#tablaDatos tbody tr").length;
    if (contenidoTabla < 1) {
      Swal.fire("Guardar datos", "Debe cargar la información para guardar", "warning");
      return;
    }

    const respFH = await enviarPeticion({ op: "G_FECHA_HORA", link: "../models/EventosComerciales.php", idEvento });
    const eventoActivo = respFH[0].ACTIVO;

    if (eventoActivo === "FALSE") {
      setTimeout(() => {
        Swal.fire("Guardar presupuesto", "El evento ya excedió el limite de la fecha fin de la convocatoria, por lo tanto no es posible realizar esta acción", "error");
      }, 100);
      return;
    }

    let datos = [];

    $("#tablaDatos tbody tr").each(function () {
      let fila = $(this).find("td");

      let data = {
        material: fila.eq(1).text(),
        estatus: fila.eq(2).text(),
        idEvento: $('#idEvento').val(),
        usuario: $('#usuario_ses').val()
      };
      datos.push(data);
    });

    showLoadingSwalAlert2('Guardando los datos...', false, true);

    const resp = await enviarPeticion({
      op: "I_DATOS_PORTAFOLIO",
      datos: JSON.stringify(datos),
      link: "../models/EventosComerciales.php"
    });

    dissminSwal();
    if (resp.ok) {
      Swal.fire("Guardar datos", "Lo datos se guardaron correctamente", "success");
      $('#archivo').val("");
      document.getElementById("tableBody").innerHTML = ``;
      document.getElementById("tableHeader").innerHTML = ``;
    }

  } catch (error) {
    console.log(error);
  }
}

const buscarEventos = async () => {
  try {
    const data = {
      link: url_api + 'eventoscomerciales/search',
      fecha_inicial: $("#sh_fecha_inicio").val(),
      fecha_final: $("#sh_fecha_final").val(),
      filtro: $("#filtro").val(),
      org: $("#org_ses").val(),
      sh_estado: $("#sh_estado").val(),
      sh_oficinas: $("#sh_oficinas").val(),
      metodo: 'GET'
    }

    $("#buscar-evento").html(`<i class="fa-solid fa-sync fa-spin"></i>`).prop("disabled", true);
    $("#result").html('');
    const respuesta = await enviarPeticion(data);
    $("#n-result-busqueda").text(respuesta.length);

    if (respuesta.length == 0) {
      $("#result").html(`<div class="card p-1 shadow-sm mt-2">
        <h5><i class="fa-solid fa-ban "></i> Sin resultados</h5>
      </div>`);

      $("#buscar-evento").html(`<i class="fa-solid fa-search"></i>`).prop("disabled", true).attr("disabled", false);
      return;
    }

    tabla = `<table class="table table-sm table-bordered table-hover" id="tablaEventos">
    <thead class="thead-list-eventos table-info">
      <tr>
        <th>#</th>
        <th>Id</th>
        <th>Nombre</th>
        <th>Fecha inicio</th>
        <th>Fecha final</th>
        <th>Oficina</th>
        <th>Estado</th>
        <th>Usuario</th>
        <th>Lab</th>
        <th class="text-center">Presupuesto</th>
        <th class="text-center">Portafolio</th>
        <th class="text-center">Seguimiento</th>
        <th class="text-center">Editar</th>
        <th class="text-center">Eliminar</th>
      </tr>
    </thead>
    <tbody>`;

    respuesta.forEach((item, index) => {
      icon_img_1 = '';
      icon_img_2 = '';
      link1 = '';
      link2 = '';

      if (item.img_publicitaria_1 != '') {
        icon_img_1 = `<i class="fa-regular fa-image text-primary"></i>`;
        link1 = url_img + item.img_publicitaria_1
      }
      if (item.img_publicitaria_2 != '') {
        icon_img_2 = `<i class="fa-regular fa-image text-info"></i>`;
        link2 = url_img + item.img_publicitaria_2
      }
      if (item.estado == 'I') {
        estado = '<span class="bg-danger badge ">Inactivo</span>'
      } else {
        estado = '<span class="bg-success badge ">Activo</span>'
      }

      tabla += `
        <tr>
          <td>${(index + 1)}</td>
          <td>${item.id}</td>
          <td>${item.nombre}</td>
          <td>${item.fecha_inicio}</td>
          <td>${item.fecha_fin}</td>
          <td>${item.oficina_ventas}</td>
          <td>${estado}</td>						
          <td>${item.usuario}</td>
          <td>
              <span class="badge bg-primary shadow-sm" style="width: 30px;">${item.n_lab}</span> 
              <button class="btn btn-sm" onclick="abrirModalLab(${item.id})">
                <i class="fa fa-plus"></i>
              </button> 
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-light btn-presupuesto" data-id='${JSON.stringify(item)}'>
              <i class="fa-solid fa-money-bill-1 text-success"></i>
            </button>
          </td>                       
          <td class="text-center">
            <button class="btn btn-sm btn-light btn-portafolio" data-id='${JSON.stringify(item)}'>
              <i class="fa-solid fa-briefcase text-secondary"></i>
            </button>
          </td>                       
          <td class="text-center">
            <button class="btn btn-sm btn-light btn-seguimiento" data-id="${item.id}">
              <i class="fa-solid fa-record-vinyl text-primary"></i>
            </button>
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-light" onclick="cargarForm(${item.id})">
              <i class="fa-regular fa-pen-to-square text-warning"></i>
            </button>
          </td>             
          <td class="text-center">
            <button class="btn btn-sm btn-light" onclick="eliminarEvento(${item.id},this)">
              <i class="fa-regular fa-trash-can text-danger"></i>
            </button>
          </td>
        </tr>`;
    });

    tabla += `</tbody>
				</table>`;

    $("#result").html(tabla);
    $("#buscar-evento").html(`<i class="fa-solid fa-search"></i>`).prop("disabled", true).attr("disabled", false);

    $('#tablaEventos').on('click', '.btn-seguimiento', async function () {
      const id = $(this).attr('data-id');
      $('#idEvento').val(id);
      const resp = await verConsolidadoEvento(id);
      console.log(resp);      
      if (resp.ok) {
        $('#modalSeguimiento').modal('show');
      } else {
        Swal.fire("Seguimiento evento", "Ocurrió un error al obtener la información del evento... Posiblemente el evento no cuenta con información disponible", "error");
      }
    });

    $('#tablaEventos').on('click', '.btn-presupuesto', async function () {
      const evento = JSON.parse($(this).attr('data-id'));
      const { id, nombre } = evento;
      $('#idEventoPresu').val(`${id} - ${nombre}`);
      $('#tituloModalPresu').text(`${id} - ${nombre}`);

      await getPresupuestoEvento(id);
      $('#containerTablaPresupuestoZona').html(``);
      $('#modalPresupuesto').modal('show');
    });

    $('#tablaEventos').on('click', '.btn-portafolio', async function () {
      const { id, nombre } = JSON.parse($(this).attr('data-id'));
      $('#tituloModalPorta').text(`${id} - ${nombre}`);
      $('#idEvento').val(id);
      $('#modalPortafolio').modal('show');
    });

  } catch (e) {
    console.error(e);

    $("#result").html(`<div class="card p-1 shadow-sm alert alert-danger text-danger">
        <h5><i class="fa-solid fa-circle-exclamation m-1"></i>Se ha producido un error</h5>
      </div>`
    );

    $("#buscar-evento").html(`<i class="fa-solid fa-search"></i>`).prop("disabled", true).attr("disabled", false);
  }

}

const asignarDatosMaestros = () => {
  $("#org").val($("#org_ses").val());
  $("#usuario").val($("#usuario_ses").val());
}

function previewImage(event, querySelector) {

  let file = event.target.files[0];
  //Recuperamos el input que desencadeno la acción
  const input = event.target;
  //Recuperamos la etiqueta img donde cargaremos la imagen
  $imgPreview = document.querySelector(querySelector);
  // Verificamos si existe una imagen seleccionada
  if (!input.files.length) return
  //Recuperamos el archivo subido
  file = input.files[0];
  //Creamos la url
  objectURL = URL.createObjectURL(file);
  //Modificamos el atributo src de la etiqueta img
  $imgPreview.src = objectURL;
}

function NombreFichero(fic) {
  fic = fic.split('\\');
  return $.trim(fic[fic.length - 1]);
}

const subirImagenesBanners = async (idInput, id) => {

  const inputFile = document.getElementById(idInput);
  let archivo = inputFile.files[0];
  return await subirArchivos(archivo, {
    validateSize: false,
    maxSize: 0,
    validateExt: false,
    typesFile: {
      image: []
    },
    ruta: 'web/banners/eventoscomerciales'
  }, {
    cambio_nombre: true,
    nuevo_nombre: 'banner1_evento_comercial_' + id
  });

}

const updateImgBanner = async (id, nombre, campo) => {

  const data = {
    link: url_api + 'eventoscomerciales/updateimgbanner',
    nombre,
    campo,
    id
  }

  const respuesta = await enviarPeticion(data);

}

const finalizarInsersion = (id) => {


  $('#form')[0].reset();
  $('#form2')[0].reset();
  removeClasValidationForm();
  asignarDatosMaestros();
  $("#img-banner-1").attr("src", "")
  $("#img-banner-2").attr("src", "")
  $("#id-evento").val('')
  $("#list-lab-modal").html('');
  $("#list-lab").html('');
  $('#eventos_cierres').val("0").trigger('change');
}

function obtenerExtension(nombreArchivo) {
  const partes = nombreArchivo.split('.');
  return partes[partes.length - 1];
}

listarEventosCierres('');

const eliminarEvento = async (id, ob) => {

  try {
    Swal.fire({
      title: 'Esta seguro que desea eliminar el evento?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        const data = {
          id,
          link: url_api + 'eventoscomerciales/delete/',
          metodo: 'GET'
        }
        const respuesta = await enviarPeticion(data);

        if (respuesta.ok) {
          await HttpEliminarLabsSave(id);
          $(ob).parent().parent().remove();
          Swal.fire("Ok", "Se elimino correctamente el registro", "success");
          buscarEventos();
        }

      } else if (result.isDenied) {
        Swal.fire('Has cancelado la acción', '', 'info')
      }
    })
  } catch (e) {
    console.error(e)
    err = e.message == undefined ? e.responseText : e.message;
    console.log(err);
    Swal.fire("Error", err, "error");
  }

}

const eliminarLab = (ob) => {

  $(ob).parent().parent().parent().fadeOut().remove();
  n = $("#list-lab div.row").length;

  if (n == 1) {
    $("#list-lab").html('');
    $("#lab_csv").val('');
  }
}

const limpiarListLab = (op) => {
  Swal.fire({
    title: 'Esta seguro que desea eliminar los laboratorios agregados?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Si',
    denyButtonText: `No`,
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {

      if (op == 1) {
        $("#list-lab").html('');
        $("#lab-csv").val('')
      } else {
        $("#list-lab-modal").html('');
        $("#lab-csv-modal").val('')
      }

    }
  })
}

const limpiarRowLab = (ob) => {
  fila = $(ob).parent().parent().parent();

  NumeroCol = fila.attr("id").split("-")[2];

  fila.find("div.columna-" + NumeroCol + "-2").find("input").val("");
  fila.find("div.columna-" + NumeroCol + "-3").find("input").val("");
  fila.find("div.columna-" + NumeroCol + "-1").find("input").val("");
  fila.find("div.columna-" + NumeroCol + "-4").find("input").val("");
  fila.find("div.columna-" + NumeroCol + "-5").find("input").attr("checked", false);
  fila.find("div.columna-" + NumeroCol + "-7").find("input").val("");
}

const validarLabAgregado = (codigo_sap) => {

  response = {
    valido: true,
    fila: 0
  };

  $(".rows-lab div").each(function (index, data) {

    codigo_sap_row = $.trim($(this).find("input.codigo_sap").val())

    if (codigo_sap == codigo_sap_row) {
      response.valido = false;
      response.fila = $(this).parent().attr("id").split("-")[2];
    }
  })
  return response;
}

const validarCsv = () => {

  $("#list-lab div.row:gt(0)").each(function (index, data) {


  });

}

const guardarLab = async (data, fila) => {
  resp = await enviarPeticion(data);
  if (resp.id > 0) {
    fila.remove();
  }
}

const getDataTableCsv = (id_evento, idDiv) => {

  try {
    let reqData = [];

    $("#" + idDiv + " div.row:gt(0)").each(async function (index, data) {

      fila = $(this);

      NumeroCol = fila.attr("id").split("-")[2];
      const nit = fila.find("div.columna-" + NumeroCol + "-1").find("input").val();
      const nombres = fila.find("div.columna-" + NumeroCol + "-2").find("input").val();
      let grupo = $.trim(fila.find("div.columna-" + NumeroCol + "-3").find("input").val());
      const monto = fila.find("div.columna-" + NumeroCol + "-4").find("input").val();

      const check = fila.find("div.columna-" + NumeroCol + "-5").find("input");
      const id = fila.find("div.columna-" + NumeroCol + "-8").find("input").val();

      let patrocinador = 0;

      if (check.is(":checked")) {
        patrocinador = 1
      }

      if (grupo == '') {
        grupo = 'NA'
      }

      url_send = url_api + 'laboratoriosconvocatoria/create';

      if (id > 0) {
        url_send = url_api + 'laboratoriosconvocatoria/editar'
      }

      itemsLab = {
        id,
        nit,
        nombres,
        grupo_articulo: grupo,
        monto,
        patrocinador,
        id_evento,
        inactivo: 0,
        usuario: $("#usuario_ses").val(),
        link: url_send
      }
      console.log(itemsLab)
      $("#" + idDiv).find("input").attr("disabled", true)
      const resp = await guardarLab(itemsLab, fila);
      $("#" + idDiv).find("input").attr("disabled", false)

      if ($("#list-lab-modal div.row:gt(0)").length == 0) {
        $("#list-lab-modal").html('');
        $("#modal-labs").modal("hide");
        Swal.fire("Ok", "Se guardaron correctamente los datos", "success");
        $("#id-evento-modal").val("0");
        removeClasValidationForm();
        buscarEventos();
      }
    });
  } catch (e) {
    console.error(e)
  }
}

const addLabList = (id) => {
  n = $("#" + id + " div.row").length;
  n++;
  fila = '';

  if (n == 1) {
    fila = `
            <div class="row">
              <div class="col-1">
              </div>
              <div class="col-2">
                  <label class="m-1">Nit</label>
              </div>
              <div class="col-3">
                  <label class="m-1">Nombres</label>
              </div>
              <div class="col-2">
                  <label class="m-1">Grupo articulo</label>
              </div>
              <div class="col-2">
                  <label class="m-1">Monto</label>
              </div>
              <div class="col-1">
                  <label class="m-1 text-center">Patrocinador</label>
              </div>
              <div class="col-1">
                  <label class="m-1 text-center"></label>
              </div>
          </div>`;
  }

  fila += `
           <div class="row rows-lab" id="row-lab-${n}">
              <div class="col-1 columna-${n}-0">
                  ${n}
              </div>
              <div class="col-2 columna-${n}-1">
                  <input type="text" onkeypress="return vnumeros(event)" class="form-control autocomplete-lab form-control-sm" name="lab-nit" minlength="6" maxlength="15" required>
              </div>
              <div class="col-3  columna-${n}-2">
                  <input type="text" minlength="3" maxlength="50" class="form-control form-control-sm  autocomplete-lab" name="lab-nombres" required>
              </div>
              <div class="col-2  columna-${n}-3">
                  <input type="text" maxlength="10" class="form-control form-control-sm  autocomplete-lab" name="lab-grupo">
              </div>
              <div class="col-2 columna-${n}-4">
                  <input type="number" class="form-control form-control-sm" name="lab-monto" required>
              </div>
              <div class="col-1  columna-${n}-5">
                  <center><input type="checkbox" class="form-check" /></center>
              </div>
              <div class="col-1  columna-${n}-6">
                  <div class="btn-group btn-group-sm">
                      <button type="button" class="btn btn-sm btn-outline-warning" onclick="limpiarRowLab(this)"><i class="fa-solid fa-broom"></i></button>
                      <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarLab(this)"><i class="fa fa-trash"></i></button>
                  </div>
              </div>
              <div class="col-2 row_codigo_sap columna-${n}-7" style="display:none">
                  <input type="number" class="codigo_sap" readonly />
              </div>
              <div class="col-2 columna-${n}-8" style="display:none">
                  <input type="number" class="id-lab" readonly value="0">
              </div>
          </div>`;
  $("#" + id).append(fila);


  $(".autocomplete-lab").autocomplete({

    source: function (request, response) {
      $.ajax({
        type: "POST",
        url: url_api + 'laboratoriosconvocatoria/buscarporcriterio',
        dataType: "json",
        data: {
          filtro: request.term
        },
        success: function (data) {
          response(data);
        }
      }).fail(function (data) {
        console.error(data);
      });
    },
    minLength: 3,
    search: function () {
      /*$(this).addClass('cargando');*/
    },
    open: function () {
      /*$(this).removeClass('cargando');*/
    },
    select: function (event, ui) {

      const valido = validarLabAgregado(ui.item.codigo_sap);

      if (!valido.valido) {
        Swal.fire("Validacion", "Este laboratorio ya fue agregado en la fila #" + valido.fila, "warning");
        return;
      }
      fila = $(this).parent().parent();

      NumeroCol = fila.attr("id").split("-")[2];

      fila.find("div.columna-" + NumeroCol + "-2").find("input").val(ui.item.nombres.substring(0, 255))
      fila.find("div.columna-" + NumeroCol + "-3").find("input").val(ui.item.grupo_articulos)
      //fila.find("div.columna-"+NumeroCol+"-1").find("input").val(ui.item.nit)
      fila.find("div.row_codigo_sap").find("input").val(ui.item.nit)
      fila.find("div.columna-" + NumeroCol + "-8").find("input").val(0)

      setTimeout(function () {
        fila.find("div.columna-" + NumeroCol + "-1").find("input").val(ui.item.nit)
        fila.find("div.columna-" + NumeroCol + "-2").find("input").val(ui.item.nombres.substring(0, 255))
      }, 100)
    }

  });

}

const loadCsv = (idInput, iDiv, e) => {

  const ext = $("#" + idInput).val().split(".").pop().toLowerCase();

  if ($.inArray(ext, ["csv"]) == -1) {
    Swal.fire("Error", "Solo se permiten archivos Csv", "warning");
    $("#" + idInput).val('');
    return false;
  }

  //
  if (e.target.files != undefined) {

    const reader = new FileReader();
    reader.onload = function (e) {

      let csvval = e.target.result.split("\n");
      console.log({
        csvval: csvval[0].split(';').length
      })
      if (parseInt(csvval[0].split(';').length) != 5) {
        Swal.fire("Error", "El csv debe tener 5 columnas nit,nombre,grupo articulos,monto, patrocinado(1:si ,0:no)", "warning");
        return;
      }

      let fila = `
					<div class="row">
						<div class="col-1">
						</div>
					   <div class="col-2">
							<label class="m-1">Nit</label>
					   </div>
					   <div class="col-3">
							<label class="m-1">Nombres</label>
					   </div>
					   <div class="col-2">
							<label class="m-1">Grupo articulo</label>
					   </div>
					   <div class="col-2">
							<label class="m-1">Monto</label>
					   </div>
					   <div class="col-1">
							<label class="m-1 text-center">Patrocinador</label>
					   </div>
					   <div class="col-1">
							<label class="m-1 text-center"></label>
					   </div>
					</div>
				`

      for (let i = 0; i < csvval.length; i++) {

        n = (i + 1)
        const row = $.trim(csvval[i]);

        if (row != '') {
          let col = row.split(';');

          patrocinador = '';
          grupo = col[2];

          if (col[4] == "1") {
            patrocinador = "checked";
          }

          if ($.trim(grupo) == "") {
            grupo = 'NA'
          }

          fila += `
					<div class="row rows-lab" id="row-lab-${n}">
						<div class="col-1 columna-${n}-0">
						 ${n}
						</div>
							<div class="col-2 columna-${n}-1">
							  <input type="text" onkeypress="return vnumeros(event)" class="form-control autocomplete-lab form-control-sm" name="lab-nit" value="${col[0]}" minlength="6" maxlength="15" required>
							</div>
							<div class="col-3  columna-${n}-2">
							   <input type="text" value="${col[1]}"  class="form-control form-control-sm  autocomplete-lab" name="lab-nombres" minlength="3" maxlength="50" required>
							</div>
							<div class="col-2  columna-${n}-3">
								<input type="text" maxlength="10" class="form-control form-control-sm  autocomplete-lab" name="lab-grupo" >
							</div>
							<div class="col-2 columna-${n}-4">
							   <input type="number" value="${col[3]}" class="form-control form-control-sm" name="lab-monto" required>
							</div>
							<div class="col-1  columna-${n}-5">
									<center><input type="checkbox" ${patrocinador} class="form-check" /></center>
							</div>
							<div class="col-1  columna-${n}-6">
									 <div  class="btn-group btn-group-sm">
										<button type="button" class="btn btn-sm btn-outline-warning" onclick="limpiarRowLab(this)"><i class="fa-solid fa-broom"></i></button>
										<button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarLab(this)"><i class="fa fa-trash"></i></button>
									  </div>
							 </div>
							<div class="col-2 row_codigo_sap columna-${n}-7" style="display:none">
							    <input type="number" class="codigo_sap" value="${col[0]}" readonly  />
							</div>
							<div class="col-2 columna-${n}-8" style="display:none">
								<input type="number" class="id-lab" value="0" readonly >
							</div>
						</div>
							`


        }
      } //for(let i=0;i<csvval.length;i++){
      $("#" + iDiv).append(fila);

    }

    reader.readAsText(e.target.files.item(0));
  }

}

$(function () {
  const oficinas = OficinasVentas('S');
  $('#oficinaPresupuesto').html(oficinas);

  $('#eventoAnterior, #presupuesto').on('input', function () {
    let value = $(this).val().replace(/[^0-9]/g, '');
    if (value) value = parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 0 });
    $(this).val("$" + value);
  });

  listarOficinas(link = '../models/Usuarios.php')
    .then(resp => {
      nuevoArray = resp.map(item => {
        if (item.OFICINA_VENTAS.substr(0, 1) == $("#Ofi").val().substr(0, 1)) {
          return item;
        }
      })
      nuevoArray = nuevoArray.filter(item => item !== undefined);
      p = '<option value="">Todas</option>';
      nuevoArray.forEach(oficina => {
        p += `<option value="${oficina.OFICINA_VENTAS}">${oficina.OFICINA_VENTAS}-${oficina.DESCRIPCION}</option>`;
      });
      $("#sh_oficinas").html(p);
    });

  asignarDatosMaestros();

  miModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));

  $(".format-number").keyup(function () {
    numeroLimpio = $(this).val().replace(/[$.]/g, '');
    if (!isNaN(numeroLimpio) && $(this).val().length > 0) {
      $(this).val(formatNumberES(numeroLimpio, 0, '$'));
    }
  });

  $(".format-number").focus(function () {

    numeroLimpio = $(this).val().replace(/[$.]/g, '');
    $(this).val(numeroLimpio);
    $(this).select()
  });

  $(".format-number").focusout(function () {
    if ($(this).val().length == 0) {
      $(this).val(0)
    }
    numeroLimpio = $(this).val().replace(/[$.]/g, '');
    $(this).val(formatNumberES(numeroLimpio, 0, '$'));
  });

  $("#lab-csv").change(function (e) {
    loadCsv('lab-csv', 'list-lab', e);
  });

  $("#lab-csv-modal").change(function (e) {
    loadCsv('lab-csv-modal', 'list-lab-modal', e);
  });

  $("#add-evento-cierre").click(function () {
    miModal.show();
  });

  $("#formulario").submit(function (event) {
    event.preventDefault();
  });

  $("#nuevo").click(function (event) {
    removeClasValidationForm();
    $("#guardar").html(`<i class="fa-regular fa-floppy-disk"></i><span class="p-1">Guardar</span>`).prop("disabled", false);
    $('#form')[0].reset();
    $("#list-lab").html('');
  });

  ApilistarOficinas();

  const fechas = document.querySelectorAll(".fechas");

  fechas.forEach(input => {
    //input.valueAsDate = new Date();
  });

  $("#guardar_evento_cierre").click(function () {

    const descripcion = $.trim($("#nombre_evento_cierre").val());

    if (descripcion.length > 0) {
      crearEventoCierre();
    }
  });

  $('#eventos_cierres').select2({
    theme: 'bootstrap-5'
  });

  $("#cancelar-lab-modal").click(function () {
    $("#modal-labs").modal("hide");
  });

  $("#form2").on('submit', async function (e) {
    try {
      form = document.getElementById("form2");

      if (!form.checkValidity()) {
        e.preventDefault()
        e.stopPropagation();
        return;
      }

      if ($("#id-evento-modal").val() > 0) {
        //verifico si  se debe insertar los laboratorios 
        n_lab = $("#list-lab-modal div.row").length;

        if (n_lab > 1) {
          getDataTableCsv($("#id-evento-modal").val(), 'list-lab-modal')
        }
      } else {
        Swal.fire("Alerta", "No se han agregado laboratorios!", "warning");
        return;
      }


    } catch (e) {
      console.error(e)
    }
  });

  $("#form").on('submit', async function (e) {
    try {
      form = document.getElementById("form");

      if (!form.checkValidity()) {
        e.preventDefault()
        e.stopPropagation();
        return;
      }
      showLoadingSwalAlert2('Guardando evento', false)
      $("#guardar").html(`<i class="fa-solid fa-sync fa-spin"></i> Guardando`).prop("disabled", true)

      //quito los formatos numeros 
      Inputumumber = document.querySelectorAll('.format-number');

      Inputumumber.forEach(input => {
        input.value = input.value.replace(/[$.]/g, '')
      })


      const data = $(this).serializeArray();


      if ($("#id").val() > 0) {
        data.push({
          name: 'link',
          value: url_api + 'eventoscomerciales/update'
        });
      } else {
        data.push({
          name: 'link',
          value: url_api + 'eventoscomerciales/create'
        });
      }

      const nombreBanner1 = NombreFichero($("#img_publicitaria_1").val());
      const nombreBanner2 = NombreFichero($("#img_publicitaria_2").val());
      const ext1 = obtenerExtension(nombreBanner1);
      const ext2 = obtenerExtension(nombreBanner2);

      const dataRequest = formatearArrayRequest(data);
      console.log({
        dataRequest
      })
      const respuesta = await enviarPeticion(dataRequest);

      if (respuesta.id > 0) {

        //verifico si  se debe insertar los laboratorios 
        n_lab = $("#list-lab div.row").length;
        console.log({
          n_lab
        })
        if (n_lab > 1) {
          getDataTableCsv(respuesta.id, 'list-lab')
        }

        if (nombreBanner1 != '') {
          await subirImagenesBanners('img_publicitaria_1', respuesta.id);
          await updateImgBanner(respuesta.id, 'banner1_evento_comercial_' + respuesta.id + "." + ext1, 'img_publicitaria_1');
        }
        if (nombreBanner2 != '') {
          await subirImagenesBanners('img_publicitaria_2', respuesta.id);
          await updateImgBanner(respuesta.id, 'banner2_evento_comercial_' + respuesta.id + "." + ext2, 'img_publicitaria_2');
        }

        finalizarInsersion();
        dissminSwal();
        Swal.fire("Ok", "Se guardo correctamente el evento!", "success")

      } else {
        Swal.fire("warning", "No se puedo guardar el evento!!", "error");
        removeClasValidationForm();
        dissminSwal();
      }

      $("#guardar").html(`<i class="fa-regular fa-floppy-disk"></i><span class="p-1">Guardar</span>`).prop("disabled", false);
    } catch (e) {
      console.error(e);
      $("#guardar").html(`<i class="fa-regular fa-floppy-disk"></i><span class="p-1">Guardar</span>`).prop("disabled", false);
      Swal.fire("Error", e.responseText, "error");
      removeClasValidationForm();
    }

  });

  $("#buscar-evento").click(function () {
    buscarEventos();
  });

  $(".add-row-lab").click(function () {
    if ($("#id").val() > 0) {
      abrirModalLab($("#id").val());
    } else {
      addLabList('list-lab');
    }
  });

  $(".add-row-lab-modal").click(function () {
    addLabList('list-lab-modal');
  });

  $("#tabDetalles").click(async function () {
    await verDetalleEvento();
  });

  $("#btnExportDetalle").click(function () {
    exportarExcel(1);
  });

  $("#tabConsolidados").click(async function () {
    const id = $('#idEvento').val();
    await verConsolidadoEvento(id);
  });

  $("#tabConsolidados2").click(async function () {
    const id = $('#idEvento').val();
    await verConsolidados2(id);
  });

  $("#btnExportConsolidado").click(function () {
    exportarExcel(2);
  });

  $("#btnExportConso2").click(function () {
    exportarExcel(5);
  });

  $("#tabZonas").click(async function () {
    await verZonaEvento();
  });

  $("#btnExportZona").click(function () {
    exportarExcel(3);
  });

  $("#btnExportDetalleConsolidado").click(function () {
    exportarExcel(4);
  });

  $("#btnPresupuesto").click(async function () {
    await guardarPresupuestoEvento();
  });

  $("#btnGuardarPresupuesto").click(async function () {
    await guardarPresupuestoZonas();
  });

  $("#btnEliminarPresupuesto1").click(async function () {
    const idEvento = $('#idEventoPresu').val().split('-')[0].trim();
    const respFH = await enviarPeticion({ op: "G_FECHA_HORA", link: "../models/EventosComerciales.php", idEvento });
    const eventoActivo = respFH[0].ACTIVO;

    if (eventoActivo === "FALSE") {
      setTimeout(() => {
        Swal.fire("Guardar presupuesto", "El evento ya excedió el limite de la fecha fin de la convocatoria, por lo tanto no es posible realizar esta acción", "error");
      }, 100);
      return;
    }

    let datosZona = [];
    $("#tablaPresupuestoZona tbody tr").each(function () {
      let fila = $(this).find("td");
      let data = {
        zonaVentas: fila.eq(1).text(),
      };
      datosZona.push(data);
    });

    let oficinaSubs = datosZona[0].zonaVentas.substring(0, 2);
    let oficina = `${oficinaSubs}00`;

    await eliminarPresupuestoEvento(idEvento, oficina, oficinaSubs);
  });

  $("#btnCargarDatos").click(async function () {
    await cargarDatos();
  });

  $("#btnGuardarDatos").click(async function () {
    await guardarDatosPortafolios();
  });

  $("#btnLimpiarDatos").click(function () {
    $('#archivo').val("");
    document.getElementById("tableBody").innerHTML = ``;
    document.getElementById("tableHeader").innerHTML = ``;
  });

  $("#btnVerPortafolio").click(async function () {
    getInfoPortafolio();
  });

  $('#modalPresupuesto').on('hidden.bs.modal', function () {
    $('#oficinaPresupuesto').val("2000");
    $('#eventoAnterior').val("");
    $('#presupuesto').val("");
  });

  $('#modalPortafolio').on('hidden.bs.modal', function () {
    $('#archivo').val("");
    document.getElementById("tableBody").innerHTML = ``;
    document.getElementById("tableHeader").innerHTML = ``;
  });
});