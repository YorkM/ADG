var miModal;
const url_img = "https://app.pwmultiroma.com/web/banners/eventoscomerciales/";
let rol = $("#idRol").val();
const rolesPermitidos = [1, 118];

const confirmAlert = async (title, text) => {
  const result = await Swal.fire({
    title: `${title}`,
    text: `${text}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
  });

  return result;
};

const listarEventosCierres = async (descripcion) => {
  try {
    const data = {
      link: url_api + "eventoscierre/search",
      descripcion,
    };
    const respuesta = await enviarPeticion(data);

    let p = '<option value="0">No</option>';

    if (respuesta.length > 0) {
      respuesta.forEach((item) => {
        p += `<option value="${
          item.id
        }">${item.descripcion.toUpperCase()}</option>`;
      });
    }

    $("#eventos_cierres").html(p);
  } catch (e) {
    console.error(e);
  }
};

const ApilistarOficinas = async () => {
  try {
    fetch(url_api + "datosmaestros/oficinas")
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        p = '<option value="0">TODAS</option>';
        _ofi = $.trim($("#Ofi").val());

        data = data.filter(
          (o) => o.oficina_ventas.substring(0, 1) == _ofi.substring(0, 1)
        );

        data.forEach((oficina) => {
          p += `<option value="${oficina.oficina_ventas}">${oficina.oficina_ventas}</option>`;
        });

        $("#oficinas").html(p);
      });
  } catch (e) {
    console.error(e);
  }
};

const crearEventoCierre = async () => {
  try {
    const data = {
      link: url_api + "eventoscierre/create",
      descripcion: $("#nombre_evento_cierre").val(),
    };
    $("button,input").attr("disabled", true);
    const respuesta = await enviarPeticion(data);
    $("button,input").attr("disabled", false);
    if (respuesta.id > 0) {
      listarEventosCierres("");
      //$("#staticBackdrop").modal("hide")
      miModal.hide();
      Swal.fire("Ok", "Se guardo correctamente el registro", "success");
    }
  } catch (e) {
    console.error(e);
    $("button,input").attr("disabled", false);
  }
};

const crearEventoComercial = async (data) => {
  const respuesta = await enviarPeticion(data);
};

const removeClasValidationForm = () => {
  var forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.classList.remove("was-validated");
  });
  event.preventDefault();
};

const mostrarBanners = (imagenes) => {
  imagenes.forEach((img, idx) => {
    $("#" + img).attr(
      "src",
      "https://app.pwmultiroma.com/web/banners/eventoscomerciales/banner1_evento_comercial_" +
        (idx + 1)
    );
  });
};

const cargarForm = async (id) => {
  try {
    LoadImg("Cargando información", false);
    const data = {
      link: url_api + "eventoscomerciales/searchid",
      id,
      metodo: "GET",
    };
    const respuesta = await enviarPeticion(data);

    if (respuesta.length == 1) {
      resp = respuesta[0];
      //url_img='https://dfnas.pwmultiroma.com/banners/eventoscomerciales/';
      $("#list-lab").html(``);
      $("#id").val(resp.id);
      $("#nombre").val(resp.nombre.toUpperCase());
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
      $("#info_lugar").val(resp.info_lugar);
      $("#info_direccion").val(resp.info_direccion);
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

      $("#guardar")
        .html(
          `<i class="fa-regular fa-pen-to-square"></i><span class="p-1">Editar</span>`
        )
        .prop("disabled", false);
      imagenes = [];
      //$("#img_publicitaria_1").val(resp.img_publicitaria_1);
      //$("#img_publicitaria_2").val(resp.img_publicitaria_2);

      if (resp.img_publicitaria_1 != "") {
        link1 = url_img + resp.img_publicitaria_1;
        console.log(link1);
        $("#img-banner-1").attr("src", link1);
      }
      if (resp.img_publicitaria_2 != "") {
        link2 = url_img + resp.img_publicitaria_2;
        console.log(link2);
        $("#img-banner-2").attr("src", link2);
      }
    }

    dissminSwal();
  } catch (e) {
    console.error(e);
    dissminSwal();
    Swal.fire("Error", "Se genero un error en el servidor", "error");
  }
};

const eliminarLabSave = async (id, ob) => {
  try {
    Swal.fire({
      title: "Esta seguro que desea eliminar el laboratorio?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (id > 0) {
          data = {
            link: url_api + "laboratoriosconvocatoria/eliminarporid",
            id,
          };

          resp = await enviarPeticion(data);

          if (resp.ok) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Se elimino correctamente el laboratorio",
              showConfirmButton: false,
              timer: 1500,
            });

            $(ob).parent().parent().parent().remove();
            buscarEventos();
          } else {
            Swal.fire("Error", "Error al eliminar el registro", "error");
          }
        }
      }
    });
  } catch (e) {
    console.error(e);
    wal.fire("Error", "Se genero un error interno!", "error");
  }
};

const HttpEliminarLabsSave = async (id_evento) => {
  return await enviarPeticion({
    link: url_api + "laboratoriosconvocatoria/eliminarporevento",
    id_evento,
  });
};

const formatDate = (dateString) => {
  const processedDateString = dateString.replace(/:(\d{3})([AP]M)/, " $2");
  const date = new Date(processedDateString);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("es-ES", options).format(date);
};

const EliminarLabsSave = () => {
  try {
    Swal.fire({
      title: "Esta seguro que desea eliminar todos los laboratorios?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        id_evento = $("#id-evento-modal").val();

        if (id_evento > 0) {
          resp = await HttpEliminarLabsSave(id_evento);

          if (resp.ok) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Se eliminaron correctamente los laboratorios",
              showConfirmButton: false,
              timer: 1500,
            });
            $("#list-lab-modal").html("");
          } else {
            Swal.fire("Error", "Ha ocurrido un error", "error");
          }
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
};

const abrirModalLab = async (id_evento) => {
  try {
    $("#modal-labs").modal("show");
    $("#form2")[0].reset();
    $(".cl_input_csv_lab").show();
    const data = {
      link: url_api + "laboratoriosconvocatoria/buscarporevento",
      id_evento,
    };
    showLoadingSwalAlert2("Cargando laboratorios", false);
    const resp = await enviarPeticion(data);

    n = $("#list-lab-modal div.row").length;
    n++;
    fila = "";

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
				`;
    }

    resp.forEach((item, idx) => {
      patrocinador = "";
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
							  <input type="text" onkeypress="return vnumeros(event)" class="form-control autocomplete-lab form-control-sm" name="lab-nit" value="${
                  item.nit
                }" minlength="6" maxlength="15" required>
							</div>
							<div class="col-3  columna-${n}-2">
							   <input type="text" value="${
                   item.nombres
                 }"  class="form-control form-control-sm  autocomplete-lab" name="lab-nombres" minlength="3" maxlength="50" required>
							</div>
							<div class="col-2  columna-${n}-3">
								<input type="text"  maxlength="10" class="form-control form-control-sm  autocomplete-lab" name="lab-grupo" value="${
                  item.grupo_articulo
                }" >
							</div>
							<div class="col-2 columna-${n}-4">
							   <input type="number" value="${Math.round(
                   item.monto
                 )}" class="form-control form-control-sm" name="lab-monto" required>
							</div>
							<div class="col-1  columna-${n}-5">
									<center><input type="checkbox" ${patrocinador} class="form-check" /></center>
							</div>
							<div class="col-1  columna-${n}-6">
									 <div  class="btn-group btn-group-sm">
										<button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarLabSave(${
                      item.id
                    },this)"><i class="fa fa-trash"></i></button>
									  </div>
							 </div>
							<div class="col-2 row_codigo_sap columna-${n}-7" style="display:none">
							    <input type="number" class="codigo_sap" value="${item.nit}" readonly  />
							</div>
							<div class="col-2 columna-${n}-8" style="display:none">
								<input type="number" class="id-lab" readonly value="${item.id}" >
							</div>
						</div>`;
    });

    dissminSwal();

    $("#id-evento-modal").val(id_evento);
    $("#list-lab-modal").html(fila);
    $("#lab-csv-modal").val("");
  } catch (e) {
    console.error(e);
    dissminSwal();
  }
};

let hot1;
let hot2;
let hot3;
let hot4;
let hot5;

const verDetalleConsolidados = async (codigoCliente) => {
  try {
    showLoadingSwalAlert2("Cargando información...", false, true);
    const detalleConso = await enviarPeticion({
      op: "G_DETALLE_CONSOLIDADOS",
      link: "../models/EventosComerciales.php",
      codigoCliente,
    });

    const objDetalleConso = detalleConso.data.map((item) => {
      let porcentajeCumplimiento = 0;

      const valorTotal = parseFloat(item.VALOR_TOTAL);
      const valorFacturadoEvento = parseFloat(item.VALOR_FACTURADO_EVENTO);

      if (
        !isNaN(valorTotal) &&
        valorTotal > 0 &&
        !isNaN(valorFacturadoEvento) &&
        valorFacturadoEvento > 0
      ) {
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
      };
    });

    console.log(objDetalleConso);

    const colHeadersArr = [
      "Código",
      "Descripción",
      "Grupo Articulos",
      "Oficina",
      "Código Cliente",
      "Nit Cliente",
      "Ciudad",
      "Nombre Cliente",
      "Usuario Passport",
      "Zona Ventas",
      "Zona Descripción",
      "Valor Unitario",
      "Descuento",
      "Iva",
      "Cantidad",
      "Valor Total",
      "Cant. Facturada",
      "Val. Fact. Total",
      "Val. Fact. Evento",
      "% Cumplimiento",
    ];

    const handsontable4 = document.getElementById("handsontable4");
    const colWidthsArr = [
      95, // 'Código'
      320, // 'Descripción'
      120, // 'Grupo articulos'
      75, // 'Oficina'
      120, // 'Código cliente'
      110, // 'Nit cliente'
      110, // 'Ciudad'
      250, // 'Nombre cliente'
      200, // 'Usuario passport'
      120, // 'Zona ventas'
      150, // 'Zona descripción'
      120, // 'Valor unitario'
      100, // 'Descuento'
      70, // 'Iva'
      90, // 'Cantidad'
      120, // 'Valor total'
      120, // 'Cantidad facturada'
      130, // 'Valor facturado total'
      130, // 'Valor facturado evento'
      125, // '% cumplimiento'
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
      { data: "porcentajeCumplimiento", type: "numeric", readOnly: true },
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
      afterChange: async function (changes, source) {},
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
};

// TODO: REALIZAR AJUSTE DE ASIGNAR OFICINA DINÁMICAMENTE
const verConsolidadoOficinas = (resp) => {
  const oficinaMedellin = resp.filter((item) => item.OFICINA_VENTAS === "2100");
  const oficinaBogota = resp.filter((item) => item.OFICINA_VENTAS === "2200");
  const oficinaCali = resp.filter((item) => item.OFICINA_VENTAS === "2300");
  const oficinaBarranquilla = resp.filter(
    (item) => item.OFICINA_VENTAS === "2400"
  );

  //? MEDELLIN
  const consolidadoMedellin = oficinaMedellin.reduce(
    (acumulado, item) => {
      const valorTotal = parseFloat(item.VALOR_TOTAL || 0);
      const valorFacturado = parseFloat(item.VALOR_FACTURADO || 0);

      acumulado.total += valorTotal;
      acumulado.facturado += valorFacturado;
      acumulado.pendiente += valorTotal - valorFacturado;

      return acumulado;
    },
    { total: 0, facturado: 0, pendiente: 0 }
  );
  consolidadoMedellin.porcentajeCumplimiento =
    consolidadoMedellin.total > 0
      ? (consolidadoMedellin.facturado / consolidadoMedellin.total) * 100
      : 0;
  consolidadoMedellin.porcentajeCumplimiento = parseFloat(
    consolidadoMedellin.porcentajeCumplimiento.toFixed(2)
  );
  consolidadoMedellin.oficina = "MEDELLÍN";

  //? BOGOTÁ
  const consolidadoBogota = oficinaBogota.reduce(
    (acumulado, item) => {
      const valorTotal = parseFloat(item.VALOR_TOTAL || 0);
      const valorFacturado = parseFloat(item.VALOR_FACTURADO || 0);

      acumulado.total += valorTotal;
      acumulado.facturado += valorFacturado;
      acumulado.pendiente += valorTotal - valorFacturado;

      return acumulado;
    },
    { total: 0, facturado: 0, pendiente: 0 }
  );
  consolidadoBogota.porcentajeCumplimiento =
    consolidadoBogota.total > 0
      ? (consolidadoBogota.facturado / consolidadoBogota.total) * 100
      : 0;
  consolidadoBogota.porcentajeCumplimiento = parseFloat(
    consolidadoBogota.porcentajeCumplimiento.toFixed(2)
  );
  consolidadoBogota.oficina = "BOGOTÁ";

  //? CALI
  const consolidadoCali = oficinaCali.reduce(
    (acumulado, item) => {
      const valorTotal = parseFloat(item.VALOR_TOTAL || 0);
      const valorFacturado = parseFloat(item.VALOR_FACTURADO || 0);

      acumulado.total += valorTotal;
      acumulado.facturado += valorFacturado;
      acumulado.pendiente += valorTotal - valorFacturado;

      return acumulado;
    },
    { total: 0, facturado: 0, pendiente: 0 }
  );
  consolidadoCali.porcentajeCumplimiento =
    consolidadoCali.total > 0
      ? (consolidadoCali.facturado / consolidadoCali.total) * 100
      : 0;
  consolidadoCali.porcentajeCumplimiento = parseFloat(
    consolidadoCali.porcentajeCumplimiento.toFixed(2)
  );
  consolidadoCali.oficina = "CALI";

  //? BARRANQUILLA
  const consolidadoBarranquilla = oficinaBarranquilla.reduce(
    (acumulado, item) => {
      const valorTotal = parseFloat(item.VALOR_TOTAL || 0);
      const valorFacturado = parseFloat(item.VALOR_FACTURADO || 0);

      acumulado.total += valorTotal;
      acumulado.facturado += valorFacturado;
      acumulado.pendiente += valorTotal - valorFacturado;

      return acumulado;
    },
    { total: 0, facturado: 0, pendiente: 0 }
  );
  consolidadoBarranquilla.porcentajeCumplimiento =
    consolidadoBarranquilla.total > 0
      ? (consolidadoBarranquilla.facturado / consolidadoBarranquilla.total) *
        100
      : 0;
  consolidadoBarranquilla.porcentajeCumplimiento = parseFloat(
    consolidadoBarranquilla.porcentajeCumplimiento.toFixed(2)
  );
  consolidadoBarranquilla.oficina = "BARRANQUILLA";

  const objOficinas = [
    consolidadoMedellin,
    consolidadoBogota,
    consolidadoCali,
    consolidadoBarranquilla,
  ];

  let elementos = ``;
  let bgColor = ``;

  objOficinas.forEach((item) => {
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
            <td style="background-color: ${bgColor};">${
      item.porcentajeCumplimiento
    }</td>
          </tr>`;
  });

  const totalGeneral = objOficinas.reduce(
    (acc, oficina) => acc + oficina.total,
    0
  );
  const totalFacturado = objOficinas.reduce(
    (acc, oficina) => acc + oficina.facturado,
    0
  );
  const totalPendiente = objOficinas.reduce(
    (acc, oficina) => acc + oficina.pendiente,
    0
  );
  const porcentajeCumplimientoTotal = (
    (totalFacturado / totalGeneral) *
    100
  ).toFixed(2);

  $("#tablaOficinas tbody").html(elementos);
  $("#tPassport").text(formatNum(totalGeneral, "$"));
  $("#tFacturado").text(formatNum(parseFloat(totalFacturado).toFixed(2), "$"));
  $("#tPendiente").text(formatNum(parseFloat(totalPendiente).toFixed(2), "$"));
  $("#tPorcentaje").text(porcentajeCumplimientoTotal + "%");
};

const verConsolidadoEvento = async (id) => {
  try {
    showLoadingSwalAlert2(
      "Cargando información... Por favor espere, esto puede tardar unos minutos",
      false,
      true
    );
    const consolidado = await enviarPeticion({
      op: "G_CONSOLIDADO_EVENTO",
      link: "../models/EventosComerciales.php",
      id,
    });

    verConsolidadoOficinas(consolidado.data);

    const objConsolidados = consolidado.data.map((item) => {
      let porcentajeCumplimiento = 0;

      const valorTotal = parseFloat(item.VALOR_TOTAL);
      const valorFacturado = parseFloat(item.VALOR_FACTURADO);

      if (
        !isNaN(valorTotal) &&
        valorTotal > 0 &&
        !isNaN(valorFacturado) &&
        valorFacturado > 0
      ) {
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
        porcentajeCumplimiento: porcentajeCumplimiento.toFixed(2),
      };
    });

    const colHeadersArr = [
      "Oficina",
      "Código Cliente",
      "Nit Cliente",
      "Nombre Cliente",
      "Razón Cliente",
      "Condición Pago",
      "Pedido ADG",
      "Nombre Vendedor",
      "Valor Total",
      "Valor Facturado",
      "% Cumplimiento",
    ];

    const handsontable2 = document.getElementById("handsontable2");
    const colWidthsArr = [
      75, // 'Oficina'
      120, // 'Código cliente'
      110, // 'Nit cliente'
      250, // 'Nombre cliente'
      250, // 'Razón cliente'
      120, // 'Condición pago'
      100, // 'Pedido ADG'
      220, // 'Nombre vendedor'
      120, // 'Valor total'
      130, // 'Valor facturado'
      125, // '% cumplimiento'
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
        data: null,
        renderer: function (
          instance,
          td,
          row,
          col,
          prop,
          value,
          cellProperties
        ) {
          td.innerHTML = `<button class="btn btn-light btn-eye" data-row="${row}">
            <i class="fa-solid fa-eye text-primary"></i>
          </button>`;
          td.style.textAlign = "center";
        },
      },
    ];

    hot2 = new Handsontable(handsontable2, {
      data: objConsolidados,
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
      afterChange: async function (changes, source) {},
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
      afterOnCellMouseDown: async function (event, coords, TD) {
        if (TD.querySelector(".btn-eye")) {
          let row = coords.row;
          let rowData = hot2.getSourceDataAtRow(row);
          await verDetalleConsolidados(rowData.codigoCliente);
          $("#modalDetalleConso").modal("show");
        }
      },
    });
    $("#handsontable2").addClass("full-screen");
    setTimeout(() => {
      hot2.render();
    }, 500);
    dissminSwal();
    return consolidado;
  } catch (error) {
    console.log(error);
  }
};

const verDetalleEvento = async () => {
  try {
    showLoadingSwalAlert2("Cargando información...", false, true);
    const id = $("#idEvento").val();
    const detalle = await enviarPeticion({
      op: "G_DETALLE_EVENTO",
      link: "../models/EventosComerciales.php",
      id,
    });

    const objDetalles = detalle.data.map((item) => {
      let porcentajeCumplimiento = 0;

      const valorTotal = parseFloat(item.VALOR_TOTAL);
      const valorFacturadoEvento = parseFloat(item.VALOR_FACTURADO_EVENTO);

      if (
        !isNaN(valorTotal) &&
        valorTotal > 0 &&
        !isNaN(valorFacturadoEvento) &&
        valorFacturadoEvento > 0
      ) {
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
      };
    });

    const colHeadersArr = [
      "Código",
      "Descripción",
      "Grupo Articulos",
      "Oficina",
      "Código Cliente",
      "Nit Cliente",
      "Ciudad",
      "Nombre Cliente",
      "Usuario Passport",
      "Zona Ventas",
      "Zona Descripción",
      "Valor Unitario",
      "Stock",
      "Descuento",
      "Iva",
      "Cantidad",
      "Valor Total",
      "Cant. Facturada",
      "Val. Fact. Total",
      "Val. Fact. Evento",
      "% Cumplimiento",
    ];

    const handsontable1 = document.getElementById("handsontable1");
    const colWidthsArr = [
      95, // 'Código'
      320, // 'Descripción'
      120, // 'Grupo articulos'
      75, // 'Oficina'
      120, // 'Código cliente'
      110, // 'Nit cliente'
      110, // 'Ciudad'
      250, // 'Nombre cliente'
      200, // 'Usuario passport'
      120, // 'Zona ventas'
      150, // 'Zona descripción'
      120, // 'Valor unitario'
      100, // 'Stock'
      100, // 'Descuento'
      70, // 'Iva'
      90, // 'Cantidad'
      120, // 'Valor total'
      120, // 'Cantidad facturada'
      130, // 'Valor facturado total'
      130, // 'Valor facturado evento'
      125, // '% cumplimiento'
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
      { data: "porcentajeCumplimiento", type: "numeric", readOnly: true },
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
      afterChange: async function (changes, source) {},
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
};

const verConsolidados2 = async () => {
  try {
    showLoadingSwalAlert2("Cargando información...", false, true);
    const id = $("#idEvento").val();
    const consolidados2 = await enviarPeticion({
      op: "G_CONSOLIDADO_COMPRA_EVENTO",
      link: "../models/EventosComerciales.php",
      id,
    });

    const resultado = consolidados2.datos.map((evento) => {
      const match = JSON.parse(consolidados2.transito).find(
        (t) => t.MATERIAL === evento.codigo && t.CENTRO === evento.centro
      );
      return {
        ...evento,
        transito: match ? match.TRANSITO : "0",
      };
    });

    const objResultado = resultado.map((item) => {
      let diferencia = 0;

      const stock = parseFloat(item.stock);
      const transito = parseFloat(item.transito);
      const cantidadFacturada = parseFloat(item.cantidad_facturada);
      const cantidad = parseFloat(item.cantidad);

      diferencia = cantidad - (stock + transito + cantidadFacturada);

      diferencia = diferencia < 1 ? 0 : diferencia;

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
        diferencia,
      };
    });

    const colHeadersArr = [
      "Código",
      "Descripción",
      "Grupo Articulos",
      "Oficina",
      "Organización",
      "Centro",
      "Almacen",
      "Cantidad",
      "Cant. Facturada",
      "Stock",
      "Transito",
      "Val. Fact. Evento",
      "Val. Facturado",
      "Diferencia",
    ];

    const handsontable5 = document.getElementById("handsontable5");
    const colWidthsArr = [
      95, // 'Código'
      310, // 'Descripción'
      130, // 'Grupo articulos'
      75, // 'Oficina'
      120, // 'Organización'
      90, // 'centro'
      90, // 'almacen'
      90, // 'Cantidad'
      120, // 'Cantidad facturada'
      90, // 'Stock'
      110, // 'transito'
      130, // 'Valor facturado evento'
      130, // 'Valor facturado total'
      120, // 'diferencia'
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
      { data: "diferencia", type: "numeric", readOnly: true },
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
      afterChange: async function (changes, source) {},
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
};

const verZonaEvento = async () => {
  try {
    showLoadingSwalAlert2("Cargando información...", false, true);
    const id = $("#idEvento").val();
    const zona = await enviarPeticion({
      op: "G_ZONA_EVENTO",
      link: "../models/EventosComerciales.php",
      id,
    });

    const objZonas = zona.data.map((item) => {
      let porcentajeCumplimiento = 0;

      const valorTotal = parseFloat(item.VALOR_TOTAL);
      const valorFacturado = parseFloat(item.VALOR_FACTURADO);

      if (
        !isNaN(valorTotal) &&
        valorTotal > 0 &&
        !isNaN(valorFacturado) &&
        valorFacturado > 0
      ) {
        porcentajeCumplimiento = (valorFacturado * 100) / valorTotal;
      } else {
        porcentajeCumplimiento = 0;
      }

      return {
        zonaVentas: item.ZONA_VENTAS,
        zonaDescripcion: item.ZONA_DESCRIPCION,
        valorTotal: formatNum(item.VALOR_TOTAL, "$"),
        valorFacturado: formatNum(item.VALOR_FACTURADO, "$"),
        porcentajeCumplimiento: porcentajeCumplimiento.toFixed(2),
      };
    });

    const colHeadersArr = [
      "Zona Ventas",
      "Zona Descripción",
      "Valor Total",
      "Valor Facturado",
      "% Cumplimiento",
    ];

    const handsontable3 = document.getElementById("handsontable3");
    const colWidthsArr = [
      120, // 'Zona ventas'
      150, // 'Zona descripción'
      130, // 'Valor Total'
      130, // 'Valor facturado'
      125, // '% cumplimiento'
    ];

    const columnsArr = [
      { data: "zonaVentas", type: "text", readOnly: true },
      { data: "zonaDescripcion", type: "text", readOnly: true },
      { data: "valorTotal", type: "numeric", readOnly: true },
      { data: "valorFacturado", type: "numeric", readOnly: true },
      { data: "porcentajeCumplimiento", type: "numeric", readOnly: true },
    ];

    hot3 = new Handsontable(handsontable3, {
      data: objZonas,
      height: $(window).height() - 10,
      colWidths: colWidthsArr,
      colHeaders: colHeadersArr,
      columns: columnsArr,
      stretchH: "all",
      width: "100%",
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
      afterChange: async function (changes, source) {},
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
    $("#handsontable3").addClass("full-screen");
    dissminSwal();
  } catch (error) {
    console.log(error);
  }
};

function exportarExcel(sw) {
  const hotMap = {
    1: hot1,
    2: hot2,
    3: hot3,
    4: hot4,
    5: hot5,
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
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  const wbout = XLSX.write(wb, {
    bookType: "xlsx",
    type: "binary",
    cellDates: true,
  });

  // Crear y descargar el archivo correctamente
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "reporte.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const validarPresupuesto = async () => {};

const guardarPresupuestoEvento = async () => {
  try {
    const idEvento = $("#idEventoPresu").val().split("-")[0];
    const oficina = $("#oficinaPresupuesto").val();
    const eventoAnterior = $("#eventoAnterior")
      .val()
      .replace(/\./g, "")
      .replace(/\$/g, "");
    const presupuesto = $("#presupuesto")
      .val()
      .replace(/\./g, "")
      .replace(/\$/g, "");
    const zonaVentas = oficina.substring(0, 2);

    if (oficina === "2000" || !eventoAnterior || !presupuesto) {
      setTimeout(() => {
        Swal.fire(
          "Campos requeridos",
          "Debe agregar (Oficina - Presupuesto evento anterior - Presupuesto actual)",
          "warning"
        );
      }, 100);
      return;
    }

    const respFH = await enviarPeticion({
      op: "G_FECHA_HORA",
      link: "../models/EventosComerciales.php",
      idEvento,
    });
    const eventoActivo = respFH[0].ACTIVO;

    if (eventoActivo === "FALSE") {
      setTimeout(() => {
        Swal.fire(
          "Guardar presupuesto",
          "El evento ya excedió el limite de la fecha fin de la convocatoria, por lo tanto no es posible realizar esta acción",
          "error"
        );
      }, 100);
      return;
    }

    const respEvento = await getPresupuestoEvento(idEvento);
    const resultado = respEvento.data.find(
      (item) => item.OFICINA_VENTAS === oficina
    );
    if (resultado) {
      const result = await confirmAlert(
        "Guardar presupuesto",
        "La oficina que desea agregar ya se encuentra con presupuesto asignado... Si acepta seguir se reemplazará el presupuesto actual y se eliminarán todos los presupuestos asignados a las zonas relacionadas"
      );

      if (!result.isConfirmed) return;
      const respReplace = await enviarPeticion({
        op: "U_REPLACE_PRESUPUESTO",
        link: "../models/EventosComerciales.php",
        idEvento,
        oficina,
        zonaVentas,
        eventoAnterior,
        presupuesto,
      });
      await getPresupuestoEvento(idEvento);
      setTimeout(() => {
        Swal.fire(
          "Reemplazar presupuesto",
          "El presupuesto ha sido reemplazado y el presupuesto de las zonas asociadas han sido eliminados",
          "info"
        );
      }, 100);
      $("#oficinaPresupuesto").val("2000");
      $("#eventoAnterior").val("");
      $("#presupuesto").val("");
      return;
    }

    showLoadingSwalAlert2("Guardando la información...", false, true);
    const resp = await enviarPeticion({
      op: "I_PRESUPUESTO_EVENTO",
      link: "../models/EventosComerciales.php",
      idEvento,
      oficina,
      eventoAnterior,
      presupuesto,
    });

    if (!resp.ok) {
      Swal.fire("Error", "No se pudo insertar el registro", "error");
      return;
    }

    await getPresupuestoEvento(idEvento);

    $("#oficinaPresupuesto").val("2000");
    $("#eventoAnterior").val("");
    $("#presupuesto").val("");
  } catch (error) {
    console.log(error);
  } finally {
    dissminSwal();
  }
};

const guardarPresupuestoZonas = async () => {
  try {
    const idEvento = $("#idEventoPresu").val().split("-")[0].trim();

    const respFH = await enviarPeticion({
      op: "G_FECHA_HORA",
      link: "../models/EventosComerciales.php",
      idEvento,
    });
    const eventoActivo = respFH[0].ACTIVO;

    if (eventoActivo === "FALSE") {
      setTimeout(() => {
        Swal.fire(
          "Guardar presupuesto",
          "El evento ya excedió el limite de la fecha fin de la convocatoria, por lo tanto no es posible realizar esta acción",
          "error"
        );
      }, 100);
      return;
    }

    let datosOficina = [];
    let datosZona = [];

    $("#tablaPresupuestoZona tbody tr").each(function () {
      let fila = $(this).find("td");
      let $input = fila.find(".inputPresupuestoZona");
      let valorPresupuesto = parseFloat(
        $input.val().replace(/\$/g, "").replace(/\./g, "")
      );

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
        oficina: fila.eq(0).text().split("-")[0].trim(),
        presupuesto: parseFloat(
          fila.eq(2).text().replace(/\./g, "").replace(/\$/g, "")
        ),
      };

      datosOficina.push(data);
    });

    let oficinaSubs = datosZona[0].zonaVentas.substring(0, 2);
    let oficina = `${oficinaSubs}00`;

    let presupuestoOficina = datosOficina.filter(
      (item) => item.oficina === oficina
    );
    presupuestoOficina = presupuestoOficina[0].presupuesto;

    const totalPresupuestoZona = datosZona.reduce(
      (acc, zona) => acc + zona.presupuesto,
      0
    );

    if (totalPresupuestoZona < presupuestoOficina) {
      setTimeout(() => {
        Swal.fire(
          "Guardar presupuesto",
          "El presupuesto total de las zonas no puede ser menor al presupuesto de la oficina",
          "error"
        );
      }, 100);
      return;
    }

    const result = await confirmAlert(
      "Guardar presupuesto",
      `Se guardará el presupuesto cargado con un total de las zonas de: ${formatNum(
        totalPresupuestoZona,
        "$"
      )}`
    );
    if (!result.isConfirmed) return;

    showLoadingSwalAlert2("Guardando el presupuesto", false, true);

    let resp = "";

    const respZonas = await enviarPeticion({
      op: "G_PRESUPUESTO_ZONA_BANDERA",
      link: "../models/EventosComerciales.php",
      oficinaSubs,
      idEvento,
    });

    if (!respZonas.data.length) {
      resp = await enviarPeticion({
        op: "I_PRESUPUESTO_EVENTO_ZONA",
        datos: JSON.stringify(datosZona),
        link: "../models/EventosComerciales.php",
      });
    } else {
      resp = await enviarPeticion({
        op: "U_PRESUPUESTO_EVENTO_ZONA",
        datos: JSON.stringify(datosZona),
        link: "../models/EventosComerciales.php",
      });
    }

    if (resp.ok) {
      setTimeout(() => {
        Swal.fire(
          "Guardar presupuesto",
          "Se guardó el presupuesto correctamente",
          "success"
        );
      }, 100);
      await getZonasPresupuesto(oficinaSubs, idEvento);
    }
  } catch (error) {
    console.log(error);
  } finally {
    dissminSwal();
  }
};

const eliminarPresupuestoEvento = async (idEvento, oficina, zonaVentas) => {
  const result = await confirmAlert(
    "Eliminar presupuesto",
    "Se eliminará el presupuesto de la oficina y todos los presupuestos de las zonas asociadas a la misma... ¿Desea seguir?"
  );
  if (!result.isConfirmed) return;

  showLoadingSwalAlert2("Eliminando el presupuesto", false, true);

  const resp = await enviarPeticion({
    op: "D_PRESUPUESTO_EVENTO",
    link: "../models/EventosComerciales.php",
    idEvento,
    oficina,
    zonaVentas,
  });

  if (resp.ok) {
    setTimeout(() => {
      Swal.fire(
        "Eliminar presupuesto",
        "Se eliminó el presupuesto correctamente",
        "success"
      );
    }, 100);
    await getPresupuestoEvento(idEvento);
    $("#containerTablaPresupuestoZona").html(``);
  }
};

const getZonasPresupuesto = async (oficina, idEvento) => {
  try {
    $("#containerTablaPresupuestoZona").html(``);

    const resp = await enviarPeticion({
      op: "G_PRESUPUESTO_EVENTO_ZONA",
      link: "../models/EventosComerciales.php",
      oficina,
      idEvento,
    });

    const totalPresupuestoZona = resp.data.reduce(
      (acc, item) => acc + parseFloat(item.PRESUPUESTO),
      0
    );

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
              <input type="text" class="form-control form-control-sm inputPresupuestoZona" value="${formatNum(
                item.PRESUPUESTO,
                "$"
              )}">
            </td>    
          </tr>`;
      });

      tabla += `
        </tbody>
      </table>`;

      $("#containerTablaPresupuestoZona").html(tabla);

      $(".inputPresupuestoZona").on("input", function () {
        let value = $(this)
          .val()
          .replace(/[^0-9]/g, "");
        if (value)
          value = parseFloat(value).toLocaleString("es-ES", {
            minimumFractionDigits: 0,
          });
        $(this).val("$" + value);
      });

      $("#totalPresupuesto").text(formatNum(totalPresupuestoZona, "$"));
      $("#modalPresupuestoZona").modal("show");
    }
  } catch (error) {
    console.log(error);
  }
};

const getPresupuestoEvento = async (idEvento) => {
  $("#containerTablaPresupuesto").html(``);
  const resp = await enviarPeticion({
    op: "G_PRESUPUESTO_EVENTO",
    link: "../models/EventosComerciales.php",
    idEvento,
  });
  const totalPresupuestoAnterior = resp.data.reduce(
    (acc, item) => acc + parseFloat(item.EVENTO_ANTERIOR),
    0
  );
  const totalPresupuesto = resp.data.reduce(
    (acc, item) => acc + parseFloat(item.PRESUPUESTO),
    0
  );

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
    resp.data.forEach((item) => {
      tabla += `
        <tr>
          <td style="vertical-align: middle;">${item.OFICINA_VENTAS} - ${
        item.DESCRIPCION
      }</td>
          <td style="vertical-align: middle;">${formatNum(
            item.EVENTO_ANTERIOR,
            "$"
          )}</td>
          <td style="vertical-align: middle;">${formatNum(
            item.PRESUPUESTO,
            "$"
          )}</td>
          <td class="text-center">
            <button class="btn btn-outline-primary btn-sm btn-presupuesto" data-item="${
              item.OFICINA_VENTAS
            }">
              <i class="fa-solid fa-circle-plus"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm btn-eliminar-presupuesto" data-item='${JSON.stringify(
              item
            )}'>
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
              <td style="vertical-align: middle; font-weight: 600">${formatNum(
                totalPresupuestoAnterior,
                "$"
              )}</td>
              <td style="vertical-align: middle; font-weight: 600">${formatNum(
                totalPresupuesto,
                "$"
              )}</td>                
              <td style="vertical-align: middle;"></td>                
            </tr>
        </tfoot>
      </table>`;
    $("#containerTablaPresupuesto").html(tabla);

    $("#tablaPresupuestoEvento").on(
      "click",
      ".btn-presupuesto",
      async function () {
        let oficina = $(this).attr("data-item");
        oficina = oficina.substring(0, 2);
        $("#oficinaSubs").val(oficina);
        await getZonasPresupuesto(oficina, idEvento);
        // $('#modalPresupuestoZona').modal('show');
      }
    );

    $("#tablaPresupuestoEvento").on(
      "click",
      ".btn-eliminar-presupuesto",
      async function () {
        const respFH = await enviarPeticion({
          op: "G_FECHA_HORA",
          link: "../models/EventosComerciales.php",
          idEvento,
        });
        const eventoActivo = respFH[0].ACTIVO;

        if (eventoActivo === "FALSE") {
          setTimeout(() => {
            Swal.fire(
              "Guardar presupuesto",
              "El evento ya excedió el limite de la fecha fin de la convocatoria, por lo tanto no es posible realizar esta acción",
              "error"
            );
          }, 100);
          return;
        }

        let { ID_EVENTO, OFICINA_VENTAS } = JSON.parse(
          $(this).attr("data-item")
        );
        const zonaVentas = OFICINA_VENTAS.substring(0, 2);
        $("#oficinaSubs").val(zonaVentas);
        await eliminarPresupuestoEvento(ID_EVENTO, OFICINA_VENTAS, zonaVentas);
      }
    );
  } else {
    $("#containerTablaPresupuesto").html(
      `<p class="lead text-center">No hay presupuestos asignados</td>`
    );
  }

  return resp;
};

const procesarArchivo = async (esquema) => {
  const fileInput = document.getElementById("archivo");
  const tableBody = document.getElementById("tableBody");
  const tableHeader = document.getElementById("tableHeader");

  if (!fileInput.files.length) {
    Swal.fire(
      "Campo requerido",
      "Debe seleccionar el archivo a procesar",
      "warning"
    );
    return;
  }

  showLoadingSwalAlert2("Cargando los datos...", false, true);

  setTimeout(() => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const text = event.target.result;
        const rows = text
          .split("\n")
          .map((row) => row.split(",").map((cell) => cell.trim()));

        if (rows.length < 2) {
          Swal.fire(
            "Carga de archivo",
            "El archivo CSV está vacío o no tiene suficientes datos",
            "error"
          );
          return;
        }

        const csvHeaders = rows[0];
        const expectedHeaders = esquema.map((col) => col.name);

        if (csvHeaders.join(",") !== expectedHeaders.join(",")) {
          setTimeout(() => {
            Swal.fire(
              "Carga de archivo",
              "El archivo CSV no tiene los encabezados correctos",
              "error"
            );
          }, 200);
          return;
        }

        tableHeader.innerHTML =
          `<th>No.</th>` +
          expectedHeaders
            .map((header) => `<th>${header.replace(/\_/g, " ")}</th>`)
            .join("");
        tableBody.innerHTML = "";
        let elementosCsv = [];

        for (let i = 1; i < rows.length; i++) {
          const element = rows[i][0];
          const element1 = rows[i][1];
          let objElementos = {
            element,
            element1,
          };

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
};

const cargarDatos = async () => {
  const esquema = [
    { name: "MATERIAL", type: "varchar" },
    { name: "ESTATUS", type: "int" },
  ];
  await procesarArchivo(esquema);
};

const getInfoPortafolio = async () => {
  const idEvento = $("#idEvento").val();
  const resp = await enviarPeticion({
    op: "G_PORTAFOLIO_EVENTO",
    link: "../models/EventosComerciales.php",
    idEvento,
  });

  if (!resp.data.length) {
    Swal.fire(
      "Ver portafolio",
      "El evento no cuenta con portafolio cargado",
      "info"
    );
    return;
  }

  showLoadingSwalAlert2("Cargando información...", false, true);

  setTimeout(() => {
    $("#archivo").val("");
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
};

const guardarDatosPortafolios = async () => {
  const idEvento = $("#idEvento").val();
  try {
    const contenidoTabla = $("#tablaDatos tbody tr").length;
    if (contenidoTabla < 1) {
      Swal.fire(
        "Guardar datos",
        "Debe cargar la información para guardar",
        "warning"
      );
      return;
    }

    const respFH = await enviarPeticion({
      op: "G_FECHA_HORA",
      link: "../models/EventosComerciales.php",
      idEvento,
    });
    const eventoActivo = respFH[0].ACTIVO;

    if (eventoActivo === "FALSE") {
      setTimeout(() => {
        Swal.fire(
          "Guardar presupuesto",
          "El evento ya excedió el limite de la fecha fin de la convocatoria, por lo tanto no es posible realizar esta acción",
          "error"
        );
      }, 100);
      return;
    }

    let datos = [];

    $("#tablaDatos tbody tr").each(function () {
      let fila = $(this).find("td");

      let data = {
        material: fila.eq(1).text(),
        estatus: fila.eq(2).text(),
        idEvento: $("#idEvento").val(),
        usuario: $("#usuario_ses").val(),
      };
      datos.push(data);
    });

    showLoadingSwalAlert2("Guardando los datos...", false, true);

    const resp = await enviarPeticion({
      op: "I_DATOS_PORTAFOLIO",
      datos: JSON.stringify(datos),
      link: "../models/EventosComerciales.php",
    });

    dissminSwal();
    if (resp.ok) {
      Swal.fire(
        "Guardar datos",
        "Lo datos se guardaron correctamente",
        "success"
      );
      $("#archivo").val("");
      document.getElementById("tableBody").innerHTML = ``;
      document.getElementById("tableHeader").innerHTML = ``;
    }
  } catch (error) {
    console.log(error);
  }
};

const buscarEventos = async () => {
  try {
    const data = {
      link: url_api + "eventoscomerciales/search",
      fecha_inicial: $("#sh_fecha_inicio").val(),
      fecha_final: $("#sh_fecha_final").val(),
      filtro: $("#filtro").val(),
      org: $("#org_ses").val(),
      sh_estado: $("#sh_estado").val(),
      sh_oficinas: $("#sh_oficinas").val(),
      metodo: "GET",
    };

    console.log(data);

    $("#buscar-evento")
      .html(`<i class="fa-solid fa-sync fa-spin"></i>`)
      .prop("disabled", true);
    $("#result").html("");
    const respuesta = await enviarPeticion(data);
    console.log(respuesta);
    $("#n-result-busqueda").text(respuesta.length);

    if (respuesta.length == 0) {
      $("#result").html(`<div class="card p-1 shadow-sm mt-2">
        <h5><i class="fa-solid fa-ban "></i> Sin resultados</h5>
      </div>`);

      $("#buscar-evento")
        .html(`<i class="fa-solid fa-search"></i>`)
        .prop("disabled", true)
        .attr("disabled", false);
      return;
    }

    // <th class="text-center">Presupuesto</th>
    //         <th class="text-center">Detalles</th>
    //         <th class="text-center">Portafolio</th>
    //         <th class="text-center">Seguimiento</th>
    //         <th class="text-center">Editar</th>
    //         <th class="text-center">Eliminar</th>

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
        <th>Opciones</th> 
      </tr>
    </thead>
    <tbody>`;

    respuesta.forEach((item, index) => {
      icon_img_1 = "";
      icon_img_2 = "";
      link1 = "";
      link2 = "";

      if (item.img_publicitaria_1 != "") {
        icon_img_1 = `<i class="fa-regular fa-image text-primary"></i>`;
        link1 = url_img + item.img_publicitaria_1;
      }
      if (item.img_publicitaria_2 != "") {
        icon_img_2 = `<i class="fa-regular fa-image text-info"></i>`;
        link2 = url_img + item.img_publicitaria_2;
      }
      if (item.estado == "I") {
        estado = '<span class="bg-danger badge ">Inactivo</span>';
      } else {
        estado = '<span class="bg-success badge ">Activo</span>';
      }

      tabla += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.id}</td>
          <td>${item.nombre}</td>
          <td>${item.fecha_inicio}</td>
          <td>${item.fecha_fin}</td>
          <td>${item.oficina_ventas}</td>
          <td>${estado}</td>						
          <td>${item.usuario}</td>
          <td>
              <span class="badge bg-primary shadow-sm" style="width: 30px;">${
                item.n_lab
              }</span> 
              <button class="btn btn-sm" onclick="abrirModalLab(${item.id})">
                <i class="fa fa-plus"></i>
              </button> 
          </td>
          <td>
            <div class="dropdown text-center">
              <button class="btn btn-outline-primary btn-sm" type="button" id="dropdownMenuButton${
                item.id
              }" data-bs-toggle="dropdown" aria-expanded="false" title="Opciones">
                <i class="fa-solid fa-table-cells"></i>
              </button>
              <ul class="dropdown-menu shadow" aria-labelledby="dropdownMenuButton${
                item.id
              }">
                ${
                  rolesPermitidos.includes(parseInt(rol))
                    ? `<li>
                         <button class="dropdown-item btn-presupuesto-merc" data-id='${JSON.stringify(
                           item
                         )}'>
                           📊 Presupuesto Mercadeo
                         </button>
                       </li>`
                    : ""
                }
                <li>
                  <button class="dropdown-item btn-presupuesto" data-id='${JSON.stringify(
                    item
                  )}'>
                    💰 Presupuesto
                  </button>
                </li>
                <li>
                  <button class="dropdown-item btn-detalles" data-id='${JSON.stringify(
                    item
                  )}'>
                    📄 Detalles
                  </button>
                </li>
                <li>
                  <button class="dropdown-item btn-portafolio" data-id='${JSON.stringify(
                    item
                  )}'>
                    🗂️ Portafolio
                  </button>
                </li>
                <li>
                  <button class="dropdown-item btn-seguimiento" data-id="${
                    item.id
                  }">
                    <i class="fa-solid fa-record-vinyl text-primary me-2"></i> Seguimiento
                  </button>
                </li>
                <li>
                  <button class="dropdown-item" onclick="cargarForm(${
                    item.id
                  })">
                    <i class="fa-regular fa-pen-to-square text-warning me-2"></i> Editar
                  </button>
                </li>
                <li>
                  <button class="dropdown-item" onclick="eliminarEvento(${
                    item.id
                  },this)">
                    <i class="fa-regular fa-trash-can text-danger me-2"></i> Eliminar
                  </button>
                </li>
              </ul>
            </div>
          </td>
        </tr>`;
    });

    tabla += `</tbody>
				</table>`;

    $("#result").html(tabla);
    $("#buscar-evento")
      .html(`<i class="fa-solid fa-search"></i>`)
      .prop("disabled", true)
      .attr("disabled", false);

    $("#tablaEventos").on("click", ".btn-presupuesto-merc", async function () {
      const evento = JSON.parse($(this).attr("data-id"));

      const idEvento = evento.id;
      const nombreEvento = evento.nombre; // Suponiendo que también tienes el nombre

      // Actualiza el título del modal
      $("#tituloModalPresupuestoMerc").text(`${idEvento} - ${nombreEvento}`);

      // Muestra el modal
      $("#modalPresupuestoMercadeo").modal("show");

      // Llama a la función y PASA el ID del evento
      const resp = await verPresupuestoMercadeo(idEvento); // <--- CORRECCIÓN
    });

    $("#tablaEventos").on("click", ".btn-seguimiento", async function () {
      const id = $(this).attr("data-id");
      $("#idEvento").val(id);
      const resp = await verConsolidadoEvento(id);
      if (resp.ok) {
        $("#modalSeguimiento").modal("show");
      } else {
        Swal.fire(
          "Seguimiento evento",
          "Ocurrió un error al obtener la información del evento... Posiblemente el evento no cuenta con información disponible",
          "error"
        );
      }
    });

    $("#tablaEventos").on("click", ".btn-presupuesto", async function () {
      const evento = JSON.parse($(this).attr("data-id"));
      //const { id, nombre } = evento;
      $("#idEventoPresu").val(`${evento.id} - ${evento.nombre}`);
      $("#tituloModalPresu").text(`${evento.id} - ${evento.nombre}`);
      await getPresupuestoEvento(evento.id);
      $("#containerTablaPresupuestoZona").html(``);
      $("#modalPresupuesto").modal("show");
    });

    // Manejador para el botón "Detalles"

    // Manejador para el botón "Detalles"
    $("#tablaEventos").on("click", ".btn-detalles", async function (event) {
      event.stopPropagation();

      const evento = JSON.parse($(this).attr("data-id"));

      const idEvento = evento.id;
      const nombreEvento = evento.nombre;

      // Actualiza el título del modal
      $("#tituloModalLabConfirmados").text(`${idEvento} - ${nombreEvento}`);

      cargarHistorialLaboratorios(idEvento);
      await cargarPanelLaboratorios(idEvento);
      $("#modalSeguimientoLabConfirmados").modal("show");
    });

    $("#tablaEventos").on("click", ".btn-portafolio", async function () {
      const { id, nombre } = JSON.parse($(this).attr("data-id"));
      $("#tituloModalPorta").text(`${id} - ${nombre}`);
      $("#idEvento").val(id);
      $("#modalPortafolio").modal("show");
    });
  } catch (e) {
    console.error(e);

    $("#result")
      .html(`<div class="card p-1 shadow-sm alert alert-danger text-danger">
        <h5><i class="fa-solid fa-circle-exclamation m-1"></i>Se ha producido un error</h5>
      </div>`);

    $("#buscar-evento")
      .html(`<i class="fa-solid fa-search"></i>`)
      .prop("disabled", true)
      .attr("disabled", false);
  }
};

const verPresupuestoMercadeo = async (id) => {
  try {
    const datosIngresos = await enviarPeticion({
      op: "GET_TOTAL_INGRESOS_EVENTO",
      link: "../models/EventosComerciales.php",
      idEvento: id,
    });

    console.log(
      "Respuesta COMPLETA para S_PRESUSPUESTO_MERCADEO:",
      datosIngresos
    );
    const totalIngresos =
      datosIngresos && datosIngresos.ok ? datosIngresos.total_ingresos : 0;
    const respuesta = await enviarPeticion({
      op: "S_PRESUPUESTO_MERCADEO",
      link: "../models/EventosComerciales.php",
      idEvento: id,
    });

    console.log("Respuesta COMPLETA para S_PRESUSPUESTO_MERCADEO:", respuesta);
    const grupos = {};
    respuesta.forEach((item) => {
      if (!grupos[item.DESC_TIPO]) grupos[item.DESC_TIPO] = [];
      grupos[item.DESC_TIPO].push(item);
    });

    let html = `
     <table class="table table-sm table-bordered table-hover" id="tablaPresupuestoMerc">
        <thead class="thead-list-eventos table-info">
          <tr>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Valor Unitario</th>
            <th>Presupuesto</th>
            <th>Ejecutado</th>
            <th>Proveedor</th>
            <th>Factura</th>
          </tr>
        </thead>
        <tbody>`;

    let totalGeneral = 0;
    let totalEjecutado = 0;

    for (const tipo in grupos) {
      const items = grupos[tipo];
      let subtotal = 0;
      let subtotalEjecutado = 0;

      items.forEach((item, i) => {
        const presupuesto = Number(item.PRESUPUESTO) || 0;
        const ejecutado = Number(item.EJECUTADO) || 0;
        subtotal += presupuesto;
        subtotalEjecutado += ejecutado;
        totalGeneral += presupuesto;
        totalEjecutado += ejecutado;

        html += `<tr 
          data-id="${item.ID}" 
          data-id-evento="${item.ID_EVENTO}"  
          data-id-tipo="${item.ID_TIPO}" 
          data-id-categoria="${item.ID_CATEGORIA}"
        >`;

        if (i === 0) {
          html += `<td rowspan="${items.length}" class="align-middle text-center fw-bold bg-light">${tipo}</td>`;
        }

        html += `
          <td>${item.DESC_CAT}</td>
          <td><input type="number" class="form-control form-control-sm cantidad" value="${
            item.CANTIDAD || 0
          }"></td>
          <td><input type="number" class="form-control form-control-sm valor" value="${
            item.VALOR_UNITARIO || 0
          }"></td>
          <td><input type="text" class="form-control form-control-sm presupuesto" value="${presupuesto.toLocaleString()}" data-raw="${presupuesto}"></td>
          <td><input type="text" class="form-control form-control-sm ejecutado" value="${ejecutado.toLocaleString()}" data-raw="${ejecutado}"></td>
          <td><input type="text" class="form-control form-control-sm proveedor" value="${
            item.PROVEEDOR || ""
          }"></td>
          <td><input type="text" class="form-control form-control-sm factura" value="${
            item.FACTURA || ""
          }"></td>
        </tr>`;
      });

      html += `
        <tr class="table-warning">
          <td colspan="4"><strong>TOTAL ${tipo.toUpperCase()}</strong></td>
          <td><strong class="subtotal" data-tipo="${tipo}">$ ${subtotal.toLocaleString()}</strong></td>
          <td><strong class="subtotal-ejecutado" data-tipo="${tipo}">$ ${subtotalEjecutado.toLocaleString()}</strong></td>
          <td colspan="2"></td>
        </tr>`;
    }

    html += `
      <tr style="color: #055160; background-color: #cff4fc; border-color: #b6effb;">
        <td colspan="4"><strong>TOTAL GENERAL</strong></td>
        <td><strong id="totalGeneral">$ ${totalGeneral.toLocaleString()}</strong></td>
        <td><strong id="totalEjecutado">$ ${totalEjecutado.toLocaleString()}</strong></td>
        <td colspan="2"></td>
      </tr>
      </tbody>
    </table>`;

    html += `
      <div class="mt-4 p-3 bg-light rounded">
        <h5 class="mb-3">Resumen Financiero</h5>
        <table class="table table-bordered" id="tablaResumenFinanciero">
          <tbody>
            <tr>
              <td class="fw-bold" style="width: 75%;">INGRESOS</td>
              
              <td class="text-end fw-bold" id="resumenIngresos" data-raw="${totalIngresos}">
                $ ${totalIngresos.toLocaleString()}
              </td>
            </tr>
            <tr class="table-secondary">
              <td class="fw-bold">GASTOS</td>
              <td class="text-end" id="resumenGastos">$ 0</td>
            </tr>
            <tr>
              <td>
                <!-- CAMBIO: Reemplazado input por texto estático -->
                <span class="fw-bold">23%</span>
                <span class="ms-2"></span>
              </td>
              <td class="text-end" id="resumenPorcentaje">$ 0</td>
            </tr>
            <tr class="table-warning">
              <td class="fw-bold">TOTAL GASTO (Gastos + Imprevistos)</td>
              <td class="text-end fw-bold" id="resumenTotalGasto">$ 0</td>
            </tr>
            <tr class="table-success">
              <td class="fw-bold">DIFERENCIA (Ingresos - Total Gasto)</td>
              <td class="text-end fw-bold" id="resumenDiferencia">$ 0</td>
            </tr>
            <tr>
              <td class="fw-bold">UTILIDAD (%)</td>
              <td class="text-end fw-bold" id="resumenUtilidad">0%</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    $("#modalPresupuestoMercadeo .modal-body").html(html);
    recalcularSubtotalesYTotal();

    $("#tablaPresupuestoMerc").on("input", ".cantidad, .valor", function () {
      const $fila = $(this).closest("tr");
      const cantidad = parseInt($fila.find(".cantidad").val()) || 0;
      const valorUnitario = parseFloat($fila.find(".valor").val()) || 0;
      const nuevoPresupuesto = cantidad * valorUnitario;
      const $inputPresupuesto = $fila.find(".presupuesto");

      $inputPresupuesto.val(nuevoPresupuesto.toLocaleString());
      $inputPresupuesto.attr("data-raw", nuevoPresupuesto);

      recalcularSubtotalesYTotal();
    });

    $("#tablaPresupuestoMerc").on(
      "input",
      ".presupuesto, .ejecutado",
      function () {
        const $input = $(this);
        let value = $input.val().replace(/[^\d]/g, "");
        const rawValue = Number(value) || 0;
        $input.val(rawValue.toLocaleString()).attr("data-raw", rawValue);
        recalcularSubtotalesYTotal();
      }
    );

    $("#tablaPresupuestoMerc").on("blur", "input", async function () {
      const $fila = $(this).closest("tr");
      const datosFila = {
        id: parseInt($fila.data("id")),
        idEvento: parseInt($fila.data("id-evento")),
        idTipo: parseInt($fila.data("id-tipo")),
        idCategoria: parseInt($fila.data("id-categoria")),
        cantidad: parseInt($fila.find(".cantidad").val()) || 0,
        vUnitario: parseFloat($fila.find(".valor").val()) || 0,
        presupuesto:
          parseFloat($fila.find(".presupuesto").attr("data-raw")) || 0,
        ejecutado: parseFloat($fila.find(".ejecutado").attr("data-raw")) || 0,
        proveedor: $fila.find(".proveedor").val().trim(),
        factura: $fila.find(".factura").val().trim(),
      };

      if (!datosFila.id || !datosFila.idEvento) {
        console.error(
          "No se pudieron encontrar los IDs necesarios en la fila.",
          $fila.data()
        );
        return;
      }
      await actualizarPresupuestoFila(datosFila);
    });
  } catch (e) {
    console.error("Error al cargar el presupuesto de mercadeo:", e);
  }
};

function recalcularSubtotalesYTotal() {
  const subtotales = {};
  let totalGeneralPresupuesto = 0;
  let totalGeneralEjecutado = 0;

  $("#tablaPresupuestoMerc tbody tr[data-id]").each(function () {
    const $fila = $(this);
    const presupuesto =
      parseFloat($fila.find(".presupuesto").attr("data-raw")) || 0;
    const ejecutado =
      parseFloat($fila.find(".ejecutado").attr("data-raw")) || 0;

    totalGeneralPresupuesto += presupuesto;
    totalGeneralEjecutado += ejecutado;

    const celdaTipo = $fila.find("td[rowspan]");
    let tipo;
    if (celdaTipo.length > 0) {
      tipo = celdaTipo.text();
    } else {
      tipo = $fila
        .prevAll("tr:has(td[rowspan])")
        .first()
        .find("td[rowspan]")
        .text();
    }

    if (tipo) {
      if (!subtotales[tipo]) {
        subtotales[tipo] = { presupuesto: 0, ejecutado: 0 };
      }
      subtotales[tipo].presupuesto += presupuesto;
      subtotales[tipo].ejecutado += ejecutado;
    }
  });

  for (const tipo in subtotales) {
    const subtotalPresupuesto = subtotales[tipo].presupuesto;
    const subtotalEjecutado = subtotales[tipo].ejecutado;
    $(`.subtotal[data-tipo="${tipo}"]`).text(
      `$ ${subtotalPresupuesto.toLocaleString()}`
    );
    $(`.subtotal-ejecutado[data-tipo="${tipo}"]`).text(
      `$ ${subtotalEjecutado.toLocaleString()}`
    );
  }

  $("#totalGeneral").text(`$ ${totalGeneralPresupuesto.toLocaleString()}`);
  $("#totalEjecutado").text(`$ ${totalGeneralEjecutado.toLocaleString()}`);

  const ingresos = parseFloat($("#resumenIngresos").attr("data-raw")) || 0;

  const gastos = totalGeneralPresupuesto;

  const porcentajeImprevistos = 23;

  const valorImprevistos = gastos * (porcentajeImprevistos / 100);
  const totalGasto = gastos + valorImprevistos;
  const diferencia = ingresos - totalGasto;
  const utilidad = ingresos > 0 ? (diferencia / ingresos) * 100 : 0;

  $("#resumenGastos").text(`$ ${gastos.toLocaleString()}`);
  $("#resumenPorcentaje").text(`$ ${valorImprevistos.toLocaleString()}`);
  $("#resumenTotalGasto").text(`$ ${totalGasto.toLocaleString()}`);
  $("#resumenDiferencia").text(`$ ${diferencia.toLocaleString()}`);
  $("#resumenUtilidad").text(`${utilidad.toFixed(1)}%`);
}

const actualizarPresupuestoFila = async (datosFila) => {
  const datosParaEnviar = [datosFila];
  const opcionesParaPeticion = {
    link: "../models/EventosComerciales.php",
    op: "UPDATE_PRESUPUESTO_MERCADEO",
    datos: JSON.stringify(datosParaEnviar),
  };

  try {
    const respuesta = await enviarPeticion(opcionesParaPeticion);
    if (respuesta.ok) {
      console.log("Fila actualizada con éxito:", respuesta.msg);
    } else {
      console.error("Error al actualizar la fila:", respuesta.msg, respuesta);
      alert(`Error al guardar: ${respuesta.msg}`);
    }
    return respuesta;
  } catch (error) {
    console.error("Error de conexión o parseo al actualizar:", error);
    alert(
      "No se pudo procesar la respuesta del servidor. Revisa la consola para más detalles."
    );
    console.log("Respuesta del servidor que causó el error:", error.message);
  }
};
const asignarDatosMaestros = () => {
  $("#org").val($("#org_ses").val());
  $("#usuario").val($("#usuario_ses").val());
};

function previewImage(event, querySelector) {
  let file = event.target.files[0];
  //Recuperamos el input que desencadeno la acción
  const input = event.target;
  //Recuperamos la etiqueta img donde cargaremos la imagen
  $imgPreview = document.querySelector(querySelector);
  // Verificamos si existe una imagen seleccionada
  if (!input.files.length) return;
  //Recuperamos el archivo subido
  file = input.files[0];
  //Creamos la url
  objectURL = URL.createObjectURL(file);
  //Modificamos el atributo src de la etiqueta img
  $imgPreview.src = objectURL;
}

function NombreFichero(fic) {
  fic = fic.split("\\");
  return $.trim(fic[fic.length - 1]);
}

const subirImagenesBanners = async (idInput, id) => {
  const inputFile = document.getElementById(idInput);
  let archivo = inputFile.files[0];
  return await subirArchivos(
    archivo,
    {
      validateSize: false,
      maxSize: 0,
      validateExt: false,
      typesFile: {
        image: [],
      },
      ruta: "web/banners/eventoscomerciales",
    },
    {
      cambio_nombre: true,
      nuevo_nombre: "banner1_evento_comercial_" + id,
    }
  );
};

const updateImgBanner = async (id, nombre, campo) => {
  const data = {
    link: url_api + "eventoscomerciales/updateimgbanner",
    nombre,
    campo,
    id,
  };

  const respuesta = await enviarPeticion(data);
};

const finalizarInsersion = (id) => {
  $("#form")[0].reset();
  $("#form2")[0].reset();
  removeClasValidationForm();
  asignarDatosMaestros();
  $("#img-banner-1").attr("src", "");
  $("#img-banner-2").attr("src", "");
  $("#id-evento").val("");
  $("#list-lab-modal").html("");
  $("#list-lab").html("");
  $("#eventos_cierres").val("0").trigger("change");
};

function obtenerExtension(nombreArchivo) {
  const partes = nombreArchivo.split(".");
  return partes[partes.length - 1];
}

listarEventosCierres("");

const eliminarEvento = async (id, ob) => {
  try {
    Swal.fire({
      title: "Esta seguro que desea eliminar el evento?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const data = {
          id,
          link: url_api + "eventoscomerciales/delete/",
          metodo: "GET",
        };
        const respuesta = await enviarPeticion(data);

        if (respuesta.ok) {
          await HttpEliminarLabsSave(id);
          $(ob).parent().parent().remove();
          Swal.fire("Ok", "Se elimino correctamente el registro", "success");
          buscarEventos();
        }
      } else if (result.isDenied) {
        Swal.fire("Has cancelado la acción", "", "info");
      }
    });
  } catch (e) {
    console.error(e);
    err = e.message == undefined ? e.responseText : e.message;
    console.log(err);
    Swal.fire("Error", err, "error");
  }
};

const eliminarLab = (ob) => {
  $(ob).parent().parent().parent().fadeOut().remove();
  n = $("#list-lab div.row").length;

  if (n == 1) {
    $("#list-lab").html("");
    $("#lab_csv").val("");
  }
};

const limpiarListLab = (op) => {
  Swal.fire({
    title: "Esta seguro que desea eliminar los laboratorios agregados?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Si",
    denyButtonText: `No`,
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      if (op == 1) {
        $("#list-lab").html("");
        $("#lab-csv").val("");
      } else {
        $("#list-lab-modal").html("");
        $("#lab-csv-modal").val("");
      }
    }
  });
};

const limpiarRowLab = (ob) => {
  fila = $(ob).parent().parent().parent();

  NumeroCol = fila.attr("id").split("-")[2];

  fila
    .find("div.columna-" + NumeroCol + "-2")
    .find("input")
    .val("");
  fila
    .find("div.columna-" + NumeroCol + "-3")
    .find("input")
    .val("");
  fila
    .find("div.columna-" + NumeroCol + "-1")
    .find("input")
    .val("");
  fila
    .find("div.columna-" + NumeroCol + "-4")
    .find("input")
    .val("");
  fila
    .find("div.columna-" + NumeroCol + "-5")
    .find("input")
    .attr("checked", false);
  fila
    .find("div.columna-" + NumeroCol + "-7")
    .find("input")
    .val("");
};

const validarLabAgregado = (codigo_sap) => {
  response = {
    valido: true,
    fila: 0,
  };

  $(".rows-lab div").each(function (index, data) {
    codigo_sap_row = $.trim($(this).find("input.codigo_sap").val());

    if (codigo_sap == codigo_sap_row) {
      response.valido = false;
      response.fila = $(this).parent().attr("id").split("-")[2];
    }
  });
  return response;
};

const validarCsv = () => {
  $("#list-lab div.row:gt(0)").each(function (index, data) {});
};

const guardarLab = async (data, fila) => {
  resp = await enviarPeticion(data);
  if (resp.id > 0) {
    fila.remove();
  }
};

const getDataTableCsv = (id_evento, idDiv) => {
  try {
    let reqData = [];

    $("#" + idDiv + " div.row:gt(0)").each(async function (index, data) {
      fila = $(this);

      NumeroCol = fila.attr("id").split("-")[2];
      const nit = fila
        .find("div.columna-" + NumeroCol + "-1")
        .find("input")
        .val();
      const nombres = fila
        .find("div.columna-" + NumeroCol + "-2")
        .find("input")
        .val();
      let grupo = $.trim(
        fila
          .find("div.columna-" + NumeroCol + "-3")
          .find("input")
          .val()
      );
      const monto = fila
        .find("div.columna-" + NumeroCol + "-4")
        .find("input")
        .val();

      const check = fila.find("div.columna-" + NumeroCol + "-5").find("input");
      const id = fila
        .find("div.columna-" + NumeroCol + "-8")
        .find("input")
        .val();

      let patrocinador = 0;

      if (check.is(":checked")) {
        patrocinador = 1;
      }

      if (grupo == "") {
        grupo = "NA";
      }

      url_send = url_api + "laboratoriosconvocatoria/create";

      if (id > 0) {
        url_send = url_api + "laboratoriosconvocatoria/editar";
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
        link: url_send,
      };
      console.log(itemsLab);
      $("#" + idDiv)
        .find("input")
        .attr("disabled", true);
      const resp = await guardarLab(itemsLab, fila);
      $("#" + idDiv)
        .find("input")
        .attr("disabled", false);

      if ($("#list-lab-modal div.row:gt(0)").length == 0) {
        $("#list-lab-modal").html("");
        $("#modal-labs").modal("hide");
        Swal.fire("Ok", "Se guardaron correctamente los datos", "success");
        $("#id-evento-modal").val("0");
        removeClasValidationForm();
        buscarEventos();
      }
    });
  } catch (e) {
    console.error(e);
  }
};

const addLabList = (id) => {
  n = $("#" + id + " div.row").length;
  n++;
  fila = "";

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
        url: url_api + "laboratoriosconvocatoria/buscarporcriterio",
        dataType: "json",
        data: {
          filtro: request.term,
        },
        success: function (data) {
          response(data);
        },
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
        Swal.fire(
          "Validacion",
          "Este laboratorio ya fue agregado en la fila #" + valido.fila,
          "warning"
        );
        return;
      }
      fila = $(this).parent().parent();

      NumeroCol = fila.attr("id").split("-")[2];

      fila
        .find("div.columna-" + NumeroCol + "-2")
        .find("input")
        .val(ui.item.nombres.substring(0, 255));
      fila
        .find("div.columna-" + NumeroCol + "-3")
        .find("input")
        .val(ui.item.grupo_articulos);
      //fila.find("div.columna-"+NumeroCol+"-1").find("input").val(ui.item.nit)
      fila.find("div.row_codigo_sap").find("input").val(ui.item.nit);
      fila
        .find("div.columna-" + NumeroCol + "-8")
        .find("input")
        .val(0);

      setTimeout(function () {
        fila
          .find("div.columna-" + NumeroCol + "-1")
          .find("input")
          .val(ui.item.nit);
        fila
          .find("div.columna-" + NumeroCol + "-2")
          .find("input")
          .val(ui.item.nombres.substring(0, 255));
      }, 100);
    },
  });
};

const loadCsv = (idInput, iDiv, e) => {
  const ext = $("#" + idInput)
    .val()
    .split(".")
    .pop()
    .toLowerCase();

  if ($.inArray(ext, ["csv"]) == -1) {
    Swal.fire("Error", "Solo se permiten archivos Csv", "warning");
    $("#" + idInput).val("");
    return false;
  }

  //
  if (e.target.files != undefined) {
    const reader = new FileReader();
    reader.onload = function (e) {
      let csvval = e.target.result.split("\n");
      console.log({
        csvval: csvval[0].split(";").length,
      });
      if (parseInt(csvval[0].split(";").length) != 5) {
        Swal.fire(
          "Error",
          "El csv debe tener 5 columnas nit,nombre,grupo articulos,monto, patrocinado(1:si ,0:no)",
          "warning"
        );
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
				`;

      for (let i = 0; i < csvval.length; i++) {
        n = i + 1;
        const row = $.trim(csvval[i]);

        if (row != "") {
          let col = row.split(";");

          patrocinador = "";
          grupo = col[2];

          if (col[4] == "1") {
            patrocinador = "checked";
          }

          if ($.trim(grupo) == "") {
            grupo = "NA";
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
							`;
        }
      } //for(let i=0;i<csvval.length;i++){
      $("#" + iDiv).append(fila);
    };

    reader.readAsText(e.target.files.item(0));
  }
};

$(function () {
  const oficinas = OficinasVentas("S");
  $("#oficinaPresupuesto, #oficinaEvento").html(oficinas);

  $("#eventoAnterior, #presupuesto").on("input", function () {
    let value = $(this)
      .val()
      .replace(/[^0-9]/g, "");
    if (value)
      value = parseFloat(value).toLocaleString("es-ES", {
        minimumFractionDigits: 0,
      });
    $(this).val("$" + value);
  });

  listarOficinas((link = "../models/Usuarios.php")).then((resp) => {
    nuevoArray = resp.map((item) => {
      if (item.OFICINA_VENTAS.substr(0, 1) == $("#Ofi").val().substr(0, 1)) {
        return item;
      }
    });
    nuevoArray = nuevoArray.filter((item) => item !== undefined);
    p = '<option value="">Todas</option>';
    nuevoArray.forEach((oficina) => {
      p += `<option value="${oficina.OFICINA_VENTAS}">${oficina.OFICINA_VENTAS}-${oficina.DESCRIPCION}</option>`;
    });
    $("#sh_oficinas").html(p);
  });

  asignarDatosMaestros();

  miModal = new bootstrap.Modal(document.getElementById("staticBackdrop"));

  $(".format-number").keyup(function () {
    numeroLimpio = $(this).val().replace(/[$.]/g, "");
    if (!isNaN(numeroLimpio) && $(this).val().length > 0) {
      $(this).val(formatNumberES(numeroLimpio, 0, "$"));
    }
  });

  $(".format-number").focus(function () {
    numeroLimpio = $(this).val().replace(/[$.]/g, "");
    $(this).val(numeroLimpio);
    $(this).select();
  });

  $(".format-number").focusout(function () {
    if ($(this).val().length == 0) {
      $(this).val(0);
    }
    numeroLimpio = $(this).val().replace(/[$.]/g, "");
    $(this).val(formatNumberES(numeroLimpio, 0, "$"));
  });

  $("#lab-csv").change(function (e) {
    loadCsv("lab-csv", "list-lab", e);
  });

  $("#lab-csv-modal").change(function (e) {
    loadCsv("lab-csv-modal", "list-lab-modal", e);
  });

  $("#add-evento-cierre").click(function () {
    miModal.show();
  });

  $("#formulario").submit(function (event) {
    event.preventDefault();
  });

  $("#nuevo").click(function (event) {
    removeClasValidationForm();
    $("#guardar")
      .html(
        `<i class="fa-regular fa-floppy-disk"></i><span class="p-1">Guardar</span>`
      )
      .prop("disabled", false);
    $("#form")[0].reset();
    $("#list-lab").html("");
  });

  ApilistarOficinas();

  const fechas = document.querySelectorAll(".fechas");

  fechas.forEach((input) => {
    //input.valueAsDate = new Date();
  });

  $("#guardar_evento_cierre").click(function () {
    const descripcion = $.trim($("#nombre_evento_cierre").val());

    if (descripcion.length > 0) {
      crearEventoCierre();
    }
  });

  $("#eventos_cierres").select2();

  $("#cancelar-lab-modal").click(function () {
    $("#modal-labs").modal("hide");
  });

  $("#form2").on("submit", async function (e) {
    try {
      form = document.getElementById("form2");

      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if ($("#id-evento-modal").val() > 0) {
        //verifico si  se debe insertar los laboratorios
        n_lab = $("#list-lab-modal div.row").length;

        if (n_lab > 1) {
          getDataTableCsv($("#id-evento-modal").val(), "list-lab-modal");
        }
      } else {
        Swal.fire("Alerta", "No se han agregado laboratorios!", "warning");
        return;
      }
    } catch (e) {
      console.error(e);
    }
  });

  $("#form").on("submit", async function (e) {
    try {
      form = document.getElementById("form");

      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      showLoadingSwalAlert2("Guardando evento", false);
      $("#guardar")
        .html(`<i class="fa-solid fa-sync fa-spin"></i> Guardando`)
        .prop("disabled", true);

      //quito los formatos numeros
      Inputumumber = document.querySelectorAll(".format-number");

      Inputumumber.forEach((input) => {
        input.value = input.value.replace(/[$.]/g, "");
      });

      const data = $(this).serializeArray();

      if ($("#id").val() > 0) {
        data.push({
          name: "link",
          value: url_api + "eventoscomerciales/update",
        });
      } else {
        data.push({
          name: "link",
          value: url_api + "eventoscomerciales/create",
        });
      }

      const nombreBanner1 = NombreFichero($("#img_publicitaria_1").val());
      const nombreBanner2 = NombreFichero($("#img_publicitaria_2").val());
      const ext1 = obtenerExtension(nombreBanner1);
      const ext2 = obtenerExtension(nombreBanner2);

      const dataRequest = formatearArrayRequest(data);
      dataRequest.id_usuario = $("#id_usuario").val();

      const respuesta = await enviarPeticion(dataRequest);

      if (respuesta.id > 0) {
        //verifico si  se debe insertar los laboratorios
        n_lab = $("#list-lab div.row").length;

        if (n_lab > 1) {
          getDataTableCsv(respuesta.id, "list-lab");
        }

        if (nombreBanner1 != "") {
          await subirImagenesBanners("img_publicitaria_1", respuesta.id);
          await updateImgBanner(
            respuesta.id,
            "banner1_evento_comercial_" + respuesta.id + "." + ext1,
            "img_publicitaria_1"
          );
        }
        if (nombreBanner2 != "") {
          await subirImagenesBanners("img_publicitaria_2", respuesta.id);
          await updateImgBanner(
            respuesta.id,
            "banner2_evento_comercial_" + respuesta.id + "." + ext2,
            "img_publicitaria_2"
          );
        }

        finalizarInsersion();
        dissminSwal();
        Swal.fire("Ok", "Se guardo correctamente el evento!", "success");
      } else {
        Swal.fire("warning", "No se puedo guardar el evento!!", "error");
        removeClasValidationForm();
        dissminSwal();
      }

      $("#guardar")
        .html(
          `<i class="fa-regular fa-floppy-disk"></i><span class="p-1">Guardar</span>`
        )
        .prop("disabled", false);
    } catch (e) {
      console.error(e);
      $("#guardar")
        .html(
          `<i class="fa-regular fa-floppy-disk"></i><span class="p-1">Guardar</span>`
        )
        .prop("disabled", false);
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
      addLabList("list-lab");
    }
  });

  $(".add-row-lab-modal").click(function () {
    addLabList("list-lab-modal");
  });

  $("#tabDetalles").click(async function () {
    await verDetalleEvento();
  });

  $("#btnExportDetalle").click(function () {
    exportarExcel(1);
  });

  $("#tabConsolidados").click(async function () {
    const id = $("#idEvento").val();
    await verConsolidadoEvento(id);
  });

  $("#tabConsolidados2").click(async function () {
    const id = $("#idEvento").val();
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
    const idEvento = $("#idEventoPresu").val().split("-")[0].trim();
    const respFH = await enviarPeticion({
      op: "G_FECHA_HORA",
      link: "../models/EventosComerciales.php",
      idEvento,
    });
    const eventoActivo = respFH[0].ACTIVO;

    if (eventoActivo === "FALSE") {
      setTimeout(() => {
        Swal.fire(
          "Guardar presupuesto",
          "El evento ya excedió el limite de la fecha fin de la convocatoria, por lo tanto no es posible realizar esta acción",
          "error"
        );
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
    $("#archivo").val("");
    document.getElementById("tableBody").innerHTML = ``;
    document.getElementById("tableHeader").innerHTML = ``;
  });

  $("#btnVerPortafolio").click(async function () {
    getInfoPortafolio();
  });

  $("#modalPresupuesto").on("hidden.bs.modal", function () {
    $("#oficinaPresupuesto").val("2000");
    $("#eventoAnterior").val("");
    $("#presupuesto").val("");
  });

  $("#modalPortafolio").on("hidden.bs.modal", function () {
    $("#archivo").val("");
    document.getElementById("tableBody").innerHTML = ``;
    document.getElementById("tableHeader").innerHTML = ``;
  });
  $("#btnGuardar").on("click", function (event) {
    // Prevenimos cualquier comportamiento por defecto que pudiera tener el botón
    event.preventDefault();
    guardarLaboratorioConfirmado();
  });

  //$("#valorParticipacion, #premio").on("input", calcularValorTotal);

  $("#btnConsultarHist").on("click", function () {
    let anioEvento = $("#anioEvento").val();
    let oficina = $("#oficinaEvento").val();
    console.log(oficina);

    // Validar campos obligatorios
    if (!anioEvento) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, seleccione un año.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (!oficina) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, seleccione una oficina.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    // Mostrar loader mejorado
    $("#HistorialEventosMer").html(`
    <div class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
      <div class="text-center">
        <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <h5 class="text-muted">Cargando datos...</h5>
        <p class="text-muted">Esto puede tomar un momento</p>
      </div>
    </div>
  `);

    // Solicitud AJAX
    $.ajax({
      url: "../models/EventosComerciales.php",
      method: "POST",
      data: {
        op: "LISTAR_EVENTOS",
        anioEvento: anioEvento,
        oficina: oficina,
      },
      dataType: "json",
      success: function (response) {
        console.log("Respuesta raw:", response);
        console.log("Tipo:", typeof response);

        if (response.error) {
          $("#HistorialEventosMer").html(`
          <div class="alert alert-danger d-flex align-items-center" role="alert">
            <i class="fas fa-exclamation-triangle me-3 fa-lg"></i>
            <div>
              <h6 class="mb-1">Error en la consulta</h6>
              <p class="mb-0">${response.error}</p>
            </div>
          </div>
        `);
          return;
        }

        if (response.data && response.data.length > 0) {
          // Calcular métricas
          const metricas = calcularMetricas(response.data);

          // Crear estructura mejorada
          let contenidoMejorado = `
          <!-- Tarjetas de métricas -->
          <div class="row mb-4">
            <div class="col-md-3 mb-3">
              <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #2563eb !important;">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="bg-primary bg-opacity-10 rounded-3 p-3">
                        <i class="fas fa-calendar-check text-primary fa-lg"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h3 class="fw-bold mb-0 text-primary">${
                        metricas.totalEventos
                      }</h3>
                      <p class="text-muted mb-0 small">Total Eventos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-3 mb-3">
              <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #10b981 !important;">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="bg-success bg-opacity-10 rounded-3 p-3">
                        <i class="fas fa-users text-success fa-lg"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h3 class="fw-bold mb-0 text-success">${metricas.totalAsistentes.toLocaleString()}</h3>
                      <p class="text-muted mb-0 small">Total Asistentes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-3 mb-3">
              <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #f59e0b !important;">
                <div class="card-body"> 
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="bg-warning bg-opacity-10 rounded-3 p-3">
                        <i class="fas fa-dollar-sign text-warning fa-lg"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h3 class="fw-bold mb-0 text-warning">$${
                        metricas.totalVentas
                      }</h3>
                      <p class="text-muted mb-0 small">Total Ventas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-3 mb-3">
              <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #06b6d4 !important;">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="bg-info bg-opacity-10 rounded-3 p-3">
                        <i class="fas fa-percentage text-info fa-lg"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h3 class="fw-bold mb-0 text-info">${
                        metricas.promedioAsistencia
                      }%</h3>
                      <p class="text-muted mb-0 small">Promedio Asistencia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
              <div class="d-flex justify-content-between align-items-center">
                
                <div class="d-flex gap-2">
                  <button class="btn btn-outline-success btn-sm" id="btnExportExcel">
                    <i class="fas fa-file-excel me-1"></i> Excel
                  </button>

                </div>
              </div>
         
            <div class="card-body p-0">
              <div class="table-responsive">
                <table id="tablaReportePassport" class="table table-hover mb-0" style="width:100%">
                  <thead class="table-light">
                    <tr>
                      <th class="fw-semibold">
                        ID
                      </th>
                      <th class="fw-semibold">
                       Org. Ventas
                      </th>
                      <th class="fw-semibold">
                        Oficina
                      </th>
                      <th class="fw-semibold">
                        Evento
                      </th>
                      <th class="fw-semibold">
                        Fecha
                      </th>
                      <th class="fw-semibold text-center">
                        Convocados
                      </th>
                      <th class="fw-semibold text-center">
                        Asistentes
                      </th>
                      <th class="fw-semibold text-center">
                        % Asistencia
                      </th>
                      <th class="fw-semibold text-end">
                        </i>Presupuesto
                      </th>
                      <th class="fw-semibold text-end">
                        Ventas
                      </th>
                      <th class="fw-semibold text-center">Detalles</th>
                    </tr>
                  </thead>
                  <tbody> `;

            response.data.forEach(function (row, index) {
              const porcentajeAsistencia = calcularPorcentajeAsistencia(
                row.clientes_convocatoria,
                row.clientes_asistentes
              );
              const estadoBadge = obtenerEstadoBadge(porcentajeAsistencia);
              const fechaFormateada = formatearFecha(row.fecha_inicio);

              contenidoMejorado += `
                <tr class="align-middle">
                  <td class="fw-semibold text-primary">#${row.id || ""}</td>
                  <td>
                    <span class="badge bg-light text-dark">${
                      row.organizacion_ventas || ""
                    }</span>
                  </td>
                  <td>
                    <span class="badge bg-secondary">${
                      row.oficina_ventas || ""
                    }</span>
                  </td>
                  <td>
                    <div class="fw-semibold text-truncate" style="max-width: 200px;" title="${
                      row.nombre_integracion || ""
                    }">
                      ${row.nombre_integracion || ""}
                    </div>
                  </td>
                  <td>
                    <small class="text-muted">
                      <i class="fas fa-calendar-day me-1"></i>
                      ${fechaFormateada}
                    </small>
                  </td>
                  <td class="text-center">
                    <span class="badge bg-info text-white fs-6">
                      ${parseInt(row.clientes_convocatoria || 0).toLocaleString()}
                    </span>
                  </td>
                  <td class="text-center">
                    <span class="badge bg-success text-white fs-6">
                      ${parseInt(row.clientes_asistentes || 0).toLocaleString()}
                    </span>
                  </td>
                  <td class="text-center">
                    ${estadoBadge}
                  </td>
                  <td class="text-end">
                    <span class="fw-semibold text-secondary">
                      $${formatearMoneda(row.presupuesto)}
                    </span>
                  </td>
                  <td class="text-end">
                    <span class="fw-bold text-success">
                      $${formatearMoneda(row.ventas)}
                    </span>
                  </td>
                  <td class="text-center">
                    <button class="btn btn-outline-primary btn-sm btn-ver-detalles" data-evento='${JSON.stringify(row)}'>
                      <i class="fas fa-eye me-1"></i> Ver Detalles
                    </button>
                  </td>
                </tr>
              `;
            });

          contenidoMejorado += `
                  </tbody>
                </table>
              </div>
           
            <div class="card-footer bg-light">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <p class="mb-0 text-muted">
                    <i class="fas fa-info-circle me-1"></i>
                    <strong>Total de registros:</strong> ${response.data.length}
                  </p>
                </div>
                <div class="col-md-6 text-md-end">
                  <small class="text-muted">
                    <i class="fas fa-clock me-1"></i>
                    Actualizado: ${new Date().toLocaleString("es-CO")}
                  </small>
                </div>
              </div>
            </div>
          </div>
              `;

          // Insertar el contenido
          $("#HistorialEventosMer").html(contenidoMejorado);
          

          // Event listener para exportar a Excel
          $("#btnExportExcel").on("click", function () {
            // Aquí puedes integrar tu lógica de exportación existente
            exportarAExcel(response.data);
          });

          // Event listener para cambiar vista
          $("#btnToggleView").on("click", function () {
            toggleVistaTabla();
          });

          console.log(
            `Se cargaron ${response.data.length} registros correctamente.`
          );

          // Mostrar mensaje de éxito
          mostrarNotificacion(
            "success",
            `Se cargaron ${response.data.length} eventos correctamente`
          );
        } else {
          $("#HistorialEventosMer").html(`
          <div class="text-center py-5">
            <div class="mb-4">
              <i class="fas fa-search fa-4x text-muted mb-3"></i>
              <h4 class="text-muted">No se encontraron datos</h4>
              <p class="text-muted">No hay eventos registrados para los filtros seleccionados.</p>
            </div>
            <div class="alert alert-info d-inline-block">
              <i class="fas fa-lightbulb me-2"></i>
              Intenta ajustar los filtros de búsqueda
            </div>
          </div>
        `);
        }
      },
      error: function (xhr, status, error) {
        $("#HistorialEventosMer").html(`
        <div class="alert alert-danger d-flex align-items-center" role="alert">
          <i class="fas fa-exclamation-circle me-3 fa-2x"></i>
          <div>
            <h5 class="alert-heading mb-2">Error de conexión</h5>
            <p class="mb-1">No se pudieron cargar los datos. Por favor, intente nuevamente.</p>
            <small class="text-muted">Código de error: ${status}</small>
          </div>
        </div>
      `);
        console.error("Error:", error);

        // Mostrar notificación de error
        mostrarNotificacion("error", "Error al cargar los datos");
      },
    });
  });

  $("#btnLimpiar").on("click", function () {
    // Restablecer los campos de entrada al valor por defecto
    $("#anioEvento option:first").prop("selected", true);
    $("#oficinaEvento option:first").prop("selected", true);

    // Restablecer el contenido de #HistorialEventosMer a su estado inicial
    $("#HistorialEventosMer").html(`
        <div class="text-center py-5">
            <i class="fas fa-chart-line fa-4x text-muted mb-3"></i>
            <h4 class="text-muted">Seleccione filtros para consultar</h4>
            <p class="text-muted">Utilice los campos de año y oficina para ver el historial de eventos.</p>
        </div>
    `);

    // Opcional: Mostrar notificación de éxito
    Swal.fire({
      icon: "success",
      title: "Limpieza completada",
      text: "Los filtros y los datos han sido restablecidos.",
      confirmButtonColor: "#2563eb",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    // Opcional: Destruir DataTable si está inicializado
    if ($.fn.DataTable.isDataTable("#tablaReportePassport")) {
      $("#tablaReportePassport").DataTable().destroy();
    }

    console.log("Filtros y tabla limpiados exitosamente.");
  });

  $("#SlcLabConfirmado").select2({
    theme: "bootstrap-5",
  });

$("#HistorialEventosMer").on("click", ".btn-ver-detalles", function() {

  let oficina = $("#oficinaEvento").val();
  const eventoData = JSON.parse($(this).attr('data-evento'));
  const idEvento = eventoData.id;
  const nombreEvento = eventoData.nombre_integracion;

  const modal = new bootstrap.Modal(document.getElementById('modalDetallesEvento'));
  const contenedorDinamico = $("#contenidoDinamicoModal");
  
  $("#nombreEventoEnModal").text(nombreEvento);

  contenedorDinamico.html(`
    <div class="text-center p-5">
      <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>
      <p class="mt-3 text-muted">Cargando datos para los gráficos...</p>
    </div>
  `);
  
  modal.show();

  $.ajax({
    url: "../models/EventosComerciales.php",
    method: "POST",
    data: { op: "DETALLES_EVENTO_CLIENTES", id_evento: idEvento, oficina: oficina },
    dataType: "json",
    success: function(response) {
      // --- ¡CAMBIO IMPORTANTE AQUÍ! ---
      // Verificamos que la respuesta sea correcta y que ambos conjuntos de datos existan.
      if (response.ok && response.data && response.data.top_clientes && response.data.ventas_por_oficina) {
        
        const estructuraGraficosHTML = `
          <div class="row">
            <div class="col-lg-8">
              <h5>Top 10 Clientes (Oficina: ${oficina})</h5>
              <div id="grafico-barras-clientes" class="mt-3"></div>
            </div>
            <div class="col-lg-4">
              <h5>Participación por Oficina</h5>
              <div id="grafico-dona-oficinas" class="mt-3"></div>
            </div>
          </div>
        `;
        
        contenedorDinamico.html(estructuraGraficosHTML);

        // Pasamos el set de datos correcto a cada función.
        renderizarGraficoBarras(response.data.top_clientes);
        renderizarGraficoDona(response.data.ventas_por_oficina);

      } else {
        contenedorDinamico.html(`<div class="alert alert-info text-center">No se encontraron datos suficientes para generar los gráficos.</div>`);
      }
    },
    error: function() {
      contenedorDinamico.html(`<div class="alert alert-danger">Error de conexión. No se pudo comunicar con el servidor.</div>`);
    }
  });
});

// --- FUNCIONES AUXILIARES PARA CREAR LOS GRÁFICOS ---

function renderizarGraficoBarras(datos) {
  const categorias = datos.map(cliente => cliente.NOMBRE_CLIENTE);
  const series = datos.map(cliente => parseFloat(cliente.VALOR_FACTURADO));

  const paletaDeColores = [
    '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0',
    '#3F51B5', '#546E7A', '#D4526E', '#8D5B4C', '#F86624'
  ];

  const opciones = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: true }
    },
    series: [{
      name: 'Valor Facturado',
      data: series
    }],
    xaxis: {
      categories: categorias,
      labels: {
        style: {
          fontSize: '10px'
        },
        rotate: -45, // Rota las etiquetas 45 grados.
        rotateAlways: true, // Asegura que la rotación se aplique siempre.
        trim: false, // Evita que la librería intente cortar el texto.
        hideOverlappingLabels: false // Muestra todas las etiquetas aunque se superpongan un poco.
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return "$" + parseInt(value).toLocaleString('es-CO');
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        distributed: true 
      }
    },
    colors: paletaDeColores,
    dataLabels: {
      enabled: false
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return "$" + parseInt(value).toLocaleString('es-CO');
        }
      }
    },
    legend: {
      show: false
    }
  };

  const grafico = new ApexCharts(document.querySelector("#grafico-barras-clientes"), opciones);
  grafico.render();
}

function renderizarGraficoDona(datos_oficinas) {
  const etiquetas = datos_oficinas.map(oficina => oficina.OFICINA_VENTAS);
  const series = datos_oficinas.map(oficina => parseFloat(oficina.TOTAL_OFICINA));

  const opciones = {
    chart: {
      type: 'donut',
      height: 350
    },
    series: series,
    labels: etiquetas,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      y: {
        formatter: function (value) {
          return "$" + parseInt(value).toLocaleString('es-CO');
        }
      }
    },
    dataLabels: {
      formatter(val, opts) {
        const seriesIndex = opts.seriesIndex;
        // Asegurarse de que la etiqueta exista antes de intentar acceder a ella
        if (opts.w.globals.labels[seriesIndex]) {
            return opts.w.globals.labels[seriesIndex] + ": " + val.toFixed(1) + '%';
        }
        return val.toFixed(1) + '%';
      }
    }
  };
  const grafico = new ApexCharts(document.querySelector("#grafico-dona-oficinas"), opciones);
  grafico.render();
}

});

//BY JHON


// Función para formatear números como moneda COP
function formatCurrency(amount) {
  if (!amount || isNaN(amount)) return "$0";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Función para convertir moneda formateada a número
function parseCurrency(formattedAmount) {
  if (!formattedAmount) return 0;
  return parseInt(formattedAmount.replace(/[^\d]/g, "")) || 0;
}

// Formatear campos de moneda en tiempo real
function setupCurrencyFormatting(selector) {
  $(selector).on("input", function () {
    let value = parseCurrency($(this).val());
    $(this).val(formatCurrency(value));
    calculateTotal();
  });

  $(selector).on("focus", function () {
    let value = parseCurrency($(this).val());
    if (value === 0) {
      $(this).val("");
    } else {
      $(this).val(value.toString());
    }
  });

  $(selector).on("blur", function () {
    let value = parseCurrency($(this).val());
    $(this).val(formatCurrency(value));
  });
}

// Aplicar formateo de moneda
setupCurrencyFormatting("#valorParticipacion, #premio");

// Calcular valor total
function calculateTotal() {
  const valorParticipacion = parseCurrency($("#valorParticipacion").val());
  const premio = parseCurrency($("#premio").val());
  const total = valorParticipacion + premio;
  $("#valorTotal").val(formatCurrency(total));
}

// Limpiar errores de validación
function clearErrors() {
  $(".form-control, .form-select").removeClass("field-error");
  $(".error-message").text("");
}

// Mostrar error de validación
function showError(fieldName, message) {
  $(`#${fieldName}`).addClass("field-error");
  $(`#error-${fieldName}`).text(message);
}

//Consultar Historial Eventos Passport - VERSIÓN MEJORADA

// FUNCIONES AUXILIARES

function calcularMetricas(data) {
  const totalEventos = data.length;
  const totalAsistentes = data.reduce(
    (sum, row) => sum + parseInt(row.clientes_asistentes || 0),
    0
  );
  const totalConvocados = data.reduce(
    (sum, row) => sum + parseInt(row.clientes_convocatoria || 0),
    0
  );
  const totalVentas = data.reduce((sum, row) => {
    const ventas = parseFloat(row.ventas?.toString().replace(/[,.]/g, "") || 0);
    return sum + ventas;
  }, 0);

  const promedioAsistencia =
    totalConvocados > 0
      ? Math.round((totalAsistentes / totalConvocados) * 100)
      : 0;

  return {
    totalEventos,
    totalAsistentes,
    totalVentas: formatearMoneda(totalVentas.toString()),
    promedioAsistencia,
  };
}

function calcularPorcentajeAsistencia(convocados, asistentes) {
  const conv = parseInt(convocados || 0);
  const asist = parseInt(asistentes || 0);
  return conv > 0 ? Math.round((asist / conv) * 100) : 0;
}

function obtenerEstadoBadge(porcentaje) {
  if (porcentaje >= 80) {
    return `<span class="badge bg-success">${porcentaje}%</span>`;
  } else if (porcentaje >= 60) {
    return `<span class="badge bg-warning">${porcentaje}%</span>`;
  } else {
    return `<span class="badge bg-danger">${porcentaje}%</span>`;
  }
}

function obtenerEstadoGeneral(row) {
  const ventas = parseFloat(row.ventas?.toString().replace(/[,.]/g, "") || 0);
  const presupuesto = parseFloat(
    row.presupuesto?.toString().replace(/[,.]/g, "") || 0
  );

  if (ventas > presupuesto) {
    return '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i>Exitoso</span>';
  } else if (ventas > presupuesto * 0.8) {
    return '<span class="badge bg-warning"><i class="fas fa-exclamation-triangle me-1"></i>Bueno</span>';
  } else {
    return '<span class="badge bg-danger"><i class="fas fa-times-circle me-1"></i>Bajo rendimiento</span>';
  }
}

function formatearFecha(fecha) {
  if (!fecha) return "";
  try {
    const [dia, mes, anio] = fecha.split("/");
    const fechaObj = new Date(anio, mes - 1, dia);
    return fechaObj.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return fecha;
  }
}

function formatearMoneda(valor) {
  if (!valor) return "0";
  const numero = parseFloat(valor.toString().replace(/[,.]/g, ""));
  return numero.toLocaleString("es-CO");
}

function exportarAExcel(data) {
  // Aquí integras tu lógica de exportación existente
  console.log("Exportando a Excel...", data);
  // Tu código de exportación actual
}

function toggleVistaTabla() {
  // Función para cambiar entre vistas (tabla/cards)
  console.log("Cambiando vista...");
}

function mostrarNotificacion(tipo, mensaje) {
  // Si tienes SweetAlert2 o similar
  if (typeof Swal !== "undefined") {
    Swal.fire({
      icon: tipo,
      title: mensaje,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    });
  } else {
    // Fallback a alert nativo
    alert(mensaje);
  }
}

/*HISTORIAL LABORATORIOS CONFIRMADOS */

function cargarHistorialLaboratorios(idEvento) {
  if (!idEvento || isNaN(idEvento)) {
    console.error(
      "No se puede cargar el historial: idEvento inválido:",
      idEvento
    );
    const container = $("#tablaLabConfirmadosPassport");
    container.html(
      `<div class="alert alert-danger text-center p-3 mb-0"><strong>Error:</strong> ID de evento inválido.</div>`
    );
    return;
  }

  const container = $("#tablaLabConfirmadosPassport");
  const formData = new FormData();
  formData.append("op", "M_LAB_CONF_PASSPORT");
  formData.append("id_evento", idEvento);

  //console.log("Enviando solicitud con idEvento:", idEvento);

  fetch("../models/EventosComerciales.php", {
    method: "POST",
    body: formData,
  })
    .then(async (response) => {
      const text = await response.text();
      //console.log("Respuesta cruda del servidor:", text);
      if (!response.ok) {
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.msg || "Error en el servidor");
        } catch (e) {
          throw new Error(`Respuesta no válida: ${text || "Respuesta vacía"}`);
        }
      }
      try {
        return JSON.parse(text);
      } catch (e) {
        throw new Error(`Error al parsear JSON: ${text || "Respuesta vacía"}`);
      }
    })
    .then((data) => {
      let tablaHTML = `
                <div class="table-responsive">
                    <table id="tablaHistorialPassport" class="table table-sm table-striped table-hover tabla-notas-anuladas">
                        <thead class="sticky-top bag-info">
                            <tr>
                                <th scope="col" class="no-wrap size-th text-center py-3">Laboratorio</th>
                                <th scope="col" class="no-wrap size-th text-center py-3">Stand</th>
                                <th scope="col" class="no-wrap size-th text-center py-3">Contacto</th>
                                <th scope="col" class="no-wrap size-th text-center py-3">Responsable</th>
                                <th scope="col" class="no-wrap size-th text-center py-3">Tipo Stand</th>
                                <th scope="col" class="no-wrap size-th text-end py-3">Participación</th>
                                <th scope="col" class="no-wrap size-th text-end py-3">Premio</th>
                                <th scope="col" class="no-wrap size-th text-end py-3">Total</th>
                                <th scope="col" class="no-wrap size-th text-center py-3">Cobro</th>
                                <th scope="col" class="no-wrap size-th text-center py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>`;

      if (data && data.length > 0) {
        data.forEach(function (row) {
          const valorParticipacion = parseFloat(
            row.valor_participacion || 0
          ).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          });
          const premio = parseFloat(row.premio || 0).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          });
          const valorTotal = parseFloat(row.valor_total || 0).toLocaleString(
            "es-CO",
            {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
            }
          );
          const rowData = JSON.stringify(row);

          tablaHTML += `
                        <tr class="align-middle">
                            <td class="no-wrap text-secondary fw-medium p-3">${
                              row.grupo_articulo || "-"
                            }</td>
                            <td class="no-wrap p-3">${
                              row.nombre_stand || "-"
                            }</td>
                            <td class="no-wrap p-3">${
                              row.contacto_ejecutivo || "-"
                            }</td>
                            <td class="no-wrap p-3">${
                              row.responsable || "-"
                            }</td>
                            <td class="no-wrap text-center p-3"><span class="badge bg-info text-white">${
                              row.tipo_stand || "-"
                            }</span></td>
                            <td class="no-wrap text-end p-3">${valorParticipacion}</td>
                            <td class="no-wrap text-end p-3">${premio}</td>
                            <td class="no-wrap text-end text-success fw-bold p-3">${valorTotal}</td>
                            <td class="no-wrap text-center p-3">${
                              row.tipo_cobro || "-"
                            }</td>
                            <td class="text-center p-3">
                                <div class="dropdown">
                                    <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="acciones-${
                                      row.ids
                                    }" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fas fa-ellipsis-v"></i>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="acciones-${
                                      row.ids
                                    }">
                                        <li><a class="dropdown-item" href="#" onclick='editarRegistro(${rowData})'><i class="fas fa-edit me-2"></i>Editar</a></li>
                                        <li><a class="dropdown-item text-danger" href="#" onclick='eliminarRegistro("${
                                          row.ids
                                        }")'><i class="fas fa-trash-alt me-2"></i>Eliminar</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>`;
        });
      } else {
        tablaHTML +=
          '<tr><td colspan="10" class="text-center p-4 text-muted">No hay laboratorios confirmados para este evento.</td></tr>';
      }

      tablaHTML += `</tbody></table></div>`;
      container.html(tablaHTML);
    })
    .catch((error) => {
      console.error("Error al cargar el historial:", error);
      const errorHTML = `<div class="alert alert-danger text-center p-3 mb-0"><strong>Error:</strong> No se pudieron cargar los datos del historial. Detalle: ${error.message}</div>`;
      container.html(errorHTML);
    });
}
/*EDITAR HISTORIAL */
function editarRegistro(rowData) {
 
  console.log("Editando registro:", rowData);


  $("#SlcLabConfirmado").val(rowData.laboratorio).trigger("change"); 
  $("#nombreStand").val(rowData.nombre_stand);
  $("#contactoEjecutivo").val(rowData.contacto_ejecutivo);
  $("#responsable").val(rowData.responsable);
  $("#tipoStand").val(rowData.tipo_stand);
  $("#valorParticipacion").val(rowData.valor_participacion);
  $("#premio").val(rowData.premio);
  $("#tipoCobro").val(rowData.tipo_cobro);

  if (rowData.laboratorio) {
    const codigosSeleccionados = rowData.laboratorio.split(",");
    $("#SlcLabConfirmado").val(codigosSeleccionados).trigger("change");
  }

  calcularValorTotal();

  
  if ($("#id_lab_confirmado").length === 0) {
    $("#formLabConfirmado").append(
      '<input type="hidden" id="id_lab_confirmado" name="id_lab_confirmado">'
    );
  }
  $("#id_lab_confirmado").val(rowData.id);

  
  $("#btnGuardar")
    .html('<i class="fas fa-sync-alt me-1"></i> Actualizar')
    .removeClass("btn-primary")
    .addClass("btn-info");


  if ($("#btnCancelarEdicion").length === 0) {
    $("#btnGuardar").after(
      '<button type="button" id="btnCancelarEdicion" class="btn btn-secondary btn-sm ms-2">Cancelar</button>'
    );
    $("#btnCancelarEdicion").on("click", function () {
      $("#formLabConfirmado")[0].reset();
      $("#id_lab_confirmado").remove();
      $(this).remove();
      $("#btnGuardar")
        .html('<i class="fas fa-save me-1"></i> Guardar')
        .removeClass("btn-info")
        .addClass("btn-primary");
    });
  }

  $("#modalSeguimientoLabConfirmados").animate({ scrollTop: 0 }, "slow");
}

function eliminarRegistro(idsConcatenados) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esta acción!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, ¡eliminar!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: "../models/EventosComerciales.php",
        dataType: "json",
        data: {
          op: "ELIMINAR_LAB_CONFIRMADOS",
          ids_a_eliminar: idsConcatenados,
        },
        success: function (response) {
          if (response.ok) {
            Swal.fire(
              "¡Eliminado!",
              "El registro ha sido eliminado.",
              "success"
            );
            $(`#fila-${idRegistro}`).fadeOut(500, function () {
              $(this).remove();
            });
          } else {
            Swal.fire(
              "Error",
              response.msg || "No se pudo eliminar el registro.",
              "error"
            );
          }
        },

        error: function (jqXHR, textStatus, errorThrown) {
          console.error("--- DETALLES DEL ERROR AJAX ---");
          console.error("Estado (textStatus):", textStatus);
          console.error("Error lanzado (errorThrown):", errorThrown);
          console.error(
            "Respuesta completa del servidor (jqXHR.responseText):"
          );
          console.log(jqXHR.responseText); 
          console.error("---------------------------------");

          let mensajeError = "No se pudo comunicar con el servidor.";
          if (textStatus === "parsererror") {
            mensajeError =
              "La respuesta del servidor no es un JSON válido. Revisa la consola para ver los detalles.";
          } else if (jqXHR.status === 404) {
            mensajeError =
              "El archivo del servidor no fue encontrado (Error 404).";
          } else if (jqXHR.status >= 500) {
            mensajeError =
              "Error interno del servidor (Error " +
              jqXHR.status +
              "). Revisa la consola.";
          }

          Swal.fire("Error de Conexión", mensajeError, "error");
        },
      });
    }
  });
}

/**

 * @param {number} idEvento - El ID del evento actual.
 */
async function cargarPanelLaboratorios(idEvento) {
    const listaContainer = $("#listaMaestraLabs");
    const panelDetalle = $("#formDetalleLab");
    const panelVacio = $("#panelDetalleVacio");
    
    listaContainer.html('<div class="text-center p-5"><div class="spinner-border text-primary"></div></div>');
    panelDetalle.addClass('d-none'); // Ocultar el formulario
    panelVacio.removeClass('d-none'); // Mostrar el mensaje de bienvenida

    try {
      
        const [respuestaTodos, respuestaConfirmados] = await Promise.all([
            enviarPeticion({ op: "list-asociados", link: "../models/ProveedoresGrupos.php" }),
            enviarPeticion({ op: "GET_DETALLES_LABS_CONFIRMADOS", link: "../models/EventosComerciales.php", idEvento: idEvento })
        ]);

        const todosLosLaboratorios = respuestaTodos || [];
        const mapaConfirmados = new Map(
            (respuestaConfirmados.ok && respuestaConfirmados.data)
                ? respuestaConfirmados.data.map(lab => {
                    const claveNormalizada = String(lab.grupo_articulo).trim();
                    return [claveNormalizada, lab];
                  })
                : []
        );

        if (todosLosLaboratorios.length === 0) {
            listaContainer.html('<div class="alert alert-warning">No se encontraron laboratorios.</div>');
            return;
        }
        const listaHTML = todosLosLaboratorios.map(lab => {
            const claveBusquedaNormalizada = String(lab.codigo_sap).trim();
            const datosConfirmados = mapaConfirmados.get(claveBusquedaNormalizada);


             const estaConfirmado = !!datosConfirmados;
            const datosConfirmadosJson = estaConfirmado ? JSON.stringify(datosConfirmados) : '{}';
            return `
                <a href="#" 
                   class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                   data-codigo-sap="${lab.codigo_sap}"
                   data-nombre-lab="${lab.nombres}"
                   data-confirmado="${estaConfirmado}"
                   data-detalles='${datosConfirmadosJson}'>
                    
                    <span>
                        <strong>${lab.codigo_sap}</strong> - ${lab.nombres}
                    </span>
                    
                    ${estaConfirmado ? '<i class="fas fa-check-circle text-primary" title="Confirmado"></i>' : ''}
                </a>
            `;
        }).join('');
        
        listaContainer.html(listaHTML);
        configurarPanelInteractivo(idEvento);
    } catch (error) {
        console.error("Error al cargar el panel de laboratorios:", error);
        listaContainer.html('<div class="alert alert-danger">Ocurrió un error al cargar los datos.</div>');
    }
}


/**
 * @param {number} idEvento - El ID del evento actual, para pasarlo al formulario.
 */
function configurarPanelInteractivo(idEvento) {
    const listaContainer = $("#listaMaestraLabs");
    const panelDetalle = $("#formDetalleLab");
    const panelVacio = $("#panelDetalleVacio");
    const busquedaInput = $("#busquedaMaestro");

    busquedaInput.on('input', function() {
        const textoBusqueda = $(this).val().toLowerCase();
        listaContainer.find('.list-group-item').each(function() {
            const nombre = $(this).data('nombre-lab').toLowerCase();
            const codigo = String($(this).data('codigo-sap'));
            if (nombre.includes(textoBusqueda) || codigo.includes(textoBusqueda)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    listaContainer.on('click', '.list-group-item', function(e) {
        e.preventDefault(); // Evitar que el enlace '#' recargue la página

        const $itemSeleccionado = $(this);

        
        listaContainer.find('.list-group-item').removeClass('active');
        $itemSeleccionado.addClass('active');

        
        const codigoSap = $itemSeleccionado.data('codigo-sap');
        const nombreLab = $itemSeleccionado.data('nombre-lab');
        const estaConfirmado = $itemSeleccionado.data('confirmado');
        const detalles = $itemSeleccionado.data('detalles'); // ¡Este es el objeto JSON!

        
        panelDetalle.find('#nombreLabEnDetalle').text(nombreLab);
        panelDetalle.find('#codigoLabEnDetalle').text(`Código SAP: ${codigoSap}`);
        
        
        panelDetalle.find('#detalle_id_evento').val(idEvento);
        panelDetalle.find('#detalle_codigo_sap').val(codigoSap);
        panelDetalle.find('#detalle_id_lab_confirmado').val(detalles.id_lab_confirmado || '');

        
        panelDetalle.find('#detalle_nombreStand').val(detalles.nombre_stand || '');
        panelDetalle.find('#detalle_tipoStand').val(detalles.tipo_stand || '');
        panelDetalle.find('#detalle_contactoEjecutivo').val(detalles.contacto_ejecutivo || '');
        panelDetalle.find('#detalle_responsable').val(detalles.responsable || '');
        panelDetalle.find('#detalle_valorParticipacion').val(detalles.valor_participacion || '');
        panelDetalle.find('#detalle_premio').val(detalles.premio || '');
        panelDetalle.find('#detalle_valorTotal').val(detalles.valor_total || '');
        panelDetalle.find('#detalle_tipoCobro').val(detalles.tipo_cobro || '');

        calcularValorTotalDetalle();

        if (estaConfirmado) {
            $('#btnEliminarDetalle').removeClass('d-none'); // Mostrar botón de eliminar
        } else {
            $('#btnEliminarDetalle').addClass('d-none'); // Ocultar botón de eliminar
        }
        panelVacio.addClass('d-none');
        panelDetalle.removeClass('d-none');
    });

$("#btnGuardarDetalle").on("click", async function() {
    const $boton = $(this);

    // 1. RECOGER TODOS LOS DATOS DEL FORMULARIO
    const datosFormulario = {
        op: "GUARDAR_DETALLE_LAB",
        link: "../models/EventosComerciales.php",
        id_lab_confirmado: $("#detalle_id_lab_confirmado").val(),
        id_evento: $("#detalle_id_evento").val(),
        codigo_sap: $("#detalle_codigo_sap").val(),
        nombre_stand: $("#detalle_nombreStand").val().trim(),
        tipo_stand: $("#detalle_tipoStand").val(),
        contacto_ejecutivo: $("#detalle_contactoEjecutivo").val().trim(),
        responsable: $("#detalle_responsable").val().trim(),
        valor_participacion: limpiarYConvertirMoneda($("#detalle_valorParticipacion").val()),
        premio: limpiarYConvertirMoneda($("#detalle_premio").val()),
        valor_total: limpiarYConvertirMoneda($("#detalle_valorTotal").val()),
        tipo_cobro: $("#detalle_tipoCobro").val()
    };

    // 2. VALIDACIÓN BÁSICA EN EL FRONTEND
    if (!datosFormulario.nombre_stand || !datosFormulario.tipo_stand) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Incompletos',
            text: 'Por favor, asegúrate de rellenar al menos el Nombre de Stand y el Tipo de Stand.'
        });
        return;
    }

    // 3. PROPORCIONAR FEEDBACK VISUAL AL USUARIO
    $boton.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Guardando...');
    console.log(datosFormulario);
    try {
        // 4. ENVIAR LOS DATOS AL SERVIDOR
        const respuesta = await enviarPeticion(datosFormulario);

        // 5. PROCESAR LA RESPUESTA DEL SERVIDOR
        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: respuesta.msg,
                timer: 1500,
                showConfirmButton: false
            });

            // --- ACTUALIZAR LA UI EN TIEMPO REAL ---
            const $itemActivo = $("#listaMaestraLabs .list-group-item.active");
            if ($itemActivo.length) {
              
                $itemActivo.data('confirmado', true);
                $itemActivo.attr('data-confirmado', 'true');
                
                const $iconoExistente = $itemActivo.find('.fa-check-circle');
                if ($iconoExistente.length === 0) {
                   
                    $itemActivo.append('<i class="fas fa-check-circle text-primary ms-2" title="Confirmado"></i>');
                }
                

                $("#detalle_id_lab_confirmado").val(respuesta.nuevo_id);

                const detallesActualizados = {
                    id_lab_confirmado: respuesta.nuevo_id,
                    grupo_articulo: datosFormulario.codigo_sap,
                    nombre_stand: datosFormulario.nombre_stand,
                    tipo_stand: datosFormulario.tipo_stand,
                    contacto_ejecutivo: datosFormulario.contacto_ejecutivo,
                    responsable: datosFormulario.responsable,
                    valor_participacion: datosFormulario.valor_participacion,
                    premio: datosFormulario.premio,
                    valor_total: datosFormulario.valor_total,
                    tipo_cobro: datosFormulario.tipo_cobro
                };
                $itemActivo.attr('data-detalles', JSON.stringify(detallesActualizados));

                // e) Mostrar el botón de eliminar, ya que el registro ahora existe
                $('#btnEliminarDetalle').removeClass('d-none');
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al Guardar',
                text: respuesta.msg || 'Ocurrió un problema en el servidor.'
            });
        }
    } catch (error) {
        console.error("Error en la petición de guardado:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error de Conexión',
            text: 'No se pudo comunicar con el servidor. Revisa tu conexión.'
        });
    } finally {
        // 6. RESTAURAR EL BOTÓN
        $boton.prop('disabled', false).html('<i class="fas fa-save me-2"></i>Guardar Cambios');
    }
});

        $("#btnEliminarDetalle").on("click", async function() {
        const idConfirmacion = $("#detalle_id_lab_confirmado").val();
        if (!idConfirmacion) return;

        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará la confirmación del laboratorio.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar'
        });

        if (confirmacion.isConfirmed) {
            const respuesta = await enviarPeticion({
                op: "ELIMINAR_DETALLE_LAB",
                link: "../models/EventosComerciales.php",
                id_lab_confirmado: idConfirmacion
            });

            if (respuesta.ok) {
                Swal.fire("Eliminado", respuesta.msg, "success");

                const $itemActivo = $("#listaMaestraLabs .list-group-item.active");
                if ($itemActivo.length) {
                    // Quitar el estado de confirmado
                    $itemActivo.data('confirmado', false).attr('data-confirmado', false);
                    $itemActivo.find('.fa-check-circle').remove();
                    $itemActivo.attr('data-detalles', '{}'); // Limpiar los detalles
                    $itemActivo.data('id-lab-confirmado', '');
                    $itemActivo.attr('data-id-lab-confirmado', '');

                    // Resetear y ocultar el formulario
                    $("#formDetalleLab")[0].reset();
                    $("#formDetalleLab").addClass('d-none');
                    $("#panelDetalleVacio").removeClass('d-none');
                    $itemActivo.removeClass('active');
                }
            } else {
                Swal.fire("Error", respuesta.msg || "No se pudo eliminar.", "error");
            }
        }
    });

    $("#formDetalleLab").on("input", "#detalle_valorParticipacion, #detalle_premio", function() {
    const $input = $(this);
    
    let value = $input.val().replace(/[^\d]/g, ""); 
    const rawValue = Number(value) || 0;
    
    const cursorPosition = $input[0].selectionStart;
    const originalLength = $input.val().length;
    $input.val(rawValue.toLocaleString("es-CO"));

    const newLength = $input.val().length;
    const newPosition = cursorPosition + (newLength - originalLength);
    $input[0].setSelectionRange(newPosition, newPosition);
    calcularValorTotalDetalle();
});
}


const calcularValorTotalDetalle = () => {
  const participacionVal = $("#detalle_valorParticipacion").val();
  const premioVal = $("#detalle_premio").val();

  // Usa la misma función de limpieza
  const participacion = limpiarYConvertirMoneda(participacionVal);
  const premio = limpiarYConvertirMoneda(premioVal);
  const total = participacion + premio;

  // Formatea el resultado para mostrarlo al usuario
  $("#detalle_valorTotal").val(
    "$" + total.toLocaleString("es-CO", { minimumFractionDigits: 0 })
  );
};




function limpiarYConvertirMoneda(valor) {
    if (typeof valor !== 'string' || !valor) {
        return 0;
    }
    // Elimina todo lo que no sea un dígito (mantiene los números)
    const valorLimpio = valor.replace(/[^\d]/g, ''); 
    return parseFloat(valorLimpio) || 0;
}





