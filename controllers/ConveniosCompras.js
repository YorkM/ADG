let arrayGeneral = new Array();

$(function () {
  $("#floatingButton").hide();

  $("#inSociedad").html(`
    <option value="*" selected>Todas las Sociedades</option>
	  <option value="1000">1000 - MULTIDROGAS</option>
	  <option value="2000">2000 - ROMA</option>`
  );

  $("#inGrupoArticulo").select2({
    placeholder: 'Seleccione uno o varios grupos',
    language: "es"
  });

  $("#centro").select2({
    placeholder: 'Seleccione uno o varios centros',
    language: "es"
  });

  gruposArticulos();

  limpiar();

  $(".form-percent").on("input", function (event) {
    let value = $(this).val();
    value = value.replace(/[^\d.]/g, '');
    value = value.replace(/\.(?=.*\.)/g, '');
    $(this).val(value);
  });

  $("#btnGuardar").click(function () {
    guardarConvenio();
  });

  buscarConvenios();

  $("#btn-div-mes").click(function () {
    $("#dvComprasMensuales").slideToggle("slow");
    const icon = $(this).find('i');
    icon.css('transition', 'transform 0.3s ease');

    if (icon.css('transform') === 'none' || icon.css('transform') === 'matrix(1, 0, 0, 1, 0, 0)') {
      icon.css('transform', 'rotate(180deg)');
    } else {
      icon.css('transform', 'rotate(0deg)');
    }
  });

  $("#btn-div-trimestre").click(function () {
    $("#dvComprasTrimestrales").slideToggle("slow");
    const icon = $(this).find('i');
    icon.css('transition', 'transform 0.3s ease');

    if (icon.css('transform') === 'none' || icon.css('transform') === 'matrix(1, 0, 0, 1, 0, 0)') {
      icon.css('transform', 'rotate(180deg)');
    } else {
      icon.css('transform', 'rotate(0deg)');
    }
  });

  getCentros();

  $('#inSociedad').change(function () {
    getCentros();
  });

  $('#tipoConvenio').change(function () {
    const tipoConvenio = $(this).val();
    validarSeccionTipoConvenios(tipoConvenio);
  });

  $('#txtDescripcion, #txtNotas, #txtEmail').on('input', function () {
    this.value = this.value.toUpperCase();
  });

  $('#verDetalle').click(function () {
    const idConvenio = parseInt($('#idConvenio').val());
    $('#modalLiquidacion').modal("show");
    const reporte = generarLiquidacion(idConvenio);
    renderReporteLiquidacion(reporte);
  });
});


// EJECUCIÓN DE FUNCIONALIDADES AL CARGAR EL DOM
// OBTENER Y CARGAR LOS CENTROS
const getCentros = async () => {
  const sociedad = $('#inSociedad').val();
  try {
    const { data } = await enviarPeticion({ op: "G_CENTROS", link: "../models/ConveniosCompras.php", sociedad });

    if (data.length) {
      let opciones = `<option value="">--Seleccione Centro--</option>`;
      data.forEach(item => opciones += `<option value="${item.CENTRO}">${item.CENTRO} - ${item.CIUDAD}</option>`);
      $('#centro').html(opciones);
    }
  } catch (error) {
    console.log(error);
  }
}
// VALIDAR SECCIONES DE TIPOS DE CONVENIO
const validarSeccionTipoConvenios = (tipoConvenio) => {
  if (tipoConvenio === "C") {
    $('#tituloImpactos').html(`<i class="fas fa-bullseye me-2"></i> OBJETIVOS CUATRIMESTRALES POR IMPACTOS`);
    $('#tituloCompras').html(`<i class="fas fa-chart-line me-2"></i> OBJETIVOS CUATRIMESTRALES POR COMPRAS`);
    $('#tituloRotacion').html(`<i class="fas fa-sync-alt me-2"></i> OBJETIVOS CUATRIMESTRALES POR ROTACIÓN`);
    $('#impQ4, #comQ4, #rotQ4').hide(400);
    $('#impQ2, #impQ3, #comQ2, #comQ3, #rotQ2, #rotQ3').show(400);

  } else if (tipoConvenio === "T") {
    $('#tituloImpactos').html(`<i class="fas fa-bullseye me-2"></i> OBJETIVOS TRIMESTRALES POR IMPACTOS`);
    $('#tituloCompras').html(`<i class="fas fa-chart-line me-2"></i> OBJETIVOS TRIMESTRALES POR COMPRAS`);
    $('#tituloRotacion').html(`<i class="fas fa-sync-alt me-2"></i> OBJETIVOS TRIMESTRALES POR ROTACIÓN`);
    $('#impQ2, #impQ3, #impQ4, #comQ2, #comQ3, #comQ4, #rotQ2, #rotQ3, #rotQ4').show(400);

  } else if (tipoConvenio === "S") {
    $('#tituloImpactos').html(`<i class="fas fa-bullseye me-2"></i> OBJETIVOS SEMESTRALES POR IMPACTOS`);
    $('#tituloCompras').html(`<i class="fas fa-chart-line me-2"></i> OBJETIVOS SEMESTRALES POR COMPRAS`);
    $('#tituloRotacion').html(`<i class="fas fa-sync-alt me-2"></i> OBJETIVOS SEMESTRALES POR ROTACIÓN`);
    $('#impQ3, #impQ4, #comQ3, #comQ4, #rotQ3, #rotQ4').hide(400);
    $('#impQ2, #comQ2, #rotQ2').show(400);

  } else if (tipoConvenio === "A") {
    $('#tituloImpactos').html(`<i class="fas fa-bullseye me-2"></i> OBJETIVO ANUAL POR IMPACTOS`);
    $('#tituloCompras').html(`<i class="fas fa-chart-line me-2"></i> OBJETIVO ANUAL POR COMPRAS`);
    $('#tituloRotacion').html(`<i class="fas fa-sync-alt me-2"></i> OBJETIVO ANUAL POR ROTACIÓN`);
    $('#impQ2, #impQ3, #impQ4, #comQ2, #comQ3, #comQ4, #rotQ2, #rotQ3, #rotQ4').hide(400);

  } else {
    $('#tituloImpactos').html(`<i class="fas fa-bullseye me-2"></i> OBJETIVOS TRIMESTRALES POR IMPACTOS`);
    $('#tituloCompras').html(`<i class="fas fa-chart-line me-2"></i> OBJETIVOS TRIMESTRALES POR COMPRAS`);
    $('#tituloRotacion').html(`<i class="fas fa-sync-alt me-2"></i> OBJETIVOS TRIMESTRALES POR ROTACIÓN`);
    $('#impQ2, #impQ3, #impQ4, #comQ2, #comQ3, #comQ4, #rotQ2, #rotQ3, #rotQ4').show(400);
  }
}
// LOADING Y/O CXARGANDO DE LA APLICACIÓN
const LoadImg = async (texto) => {
  const html = `
  <center>
    <figure><img src="../resources/icons/preloader.gif" class="img-responsive"/></figure>
    <figcaption>${texto}</figcaption>
  </center>`;

  $(".centrado-porcentual").html(html);
  $(".form-control").attr("disabled", true);
  $(".centrado-porcentual").show();
  $("#Bloquear").show();

  return Promise.resolve();
}
// FUNCIÓN PARA DESMONTAR EL LOADING
const UnloadImg = async () => {
  $("#Bloquear").hide();
  $(".centrado-porcentual").hide();
  $(".form-control").attr("disabled", false);

  return Promise.resolve();
}
// VALIDAR DILIGENCIAMIENTO DE SECCONES DE OBJETIVOS
const validarCamposSeccionOjetivos = (tipoConvenio) => {
  if (tipoConvenio === "C") {
    if ($('#Q1Impactos').val() === "0" || $('#Q2Impactos').val() === "0" || $('#Q3Impactos').val() === "0") {
      Swal.fire("Campos requeridos", "Los campos de la sección de objetivos por impactos son requeridos", "error");
      return false;
    }

    if ($('#Q1').val() === "0" || $('#Q2').val() === "0" || $('#Q3').val() === "0") {
      Swal.fire("Campos requeridos", "Los campos de la sección de objetivos por compras son requeridos", "error");
      return false;
    }

    if ($('#Q1Rotacion').val() === "0" || $('#Q2Rotacion').val() === "0" || $('#Q3Rotacion').val() === "0") {
      Swal.fire("Campos requeridos", "Los campos de la sección de objetivos por rotación son requeridos", "error");
      return false;
    }

  } else if (tipoConvenio === "T") {
    if ($('#Q1Impactos').val() === "0" || $('#Q2Impactos').val() === "0" || $('#Q3Impactos').val() === "0" || $('#Q4Impactos').val() === "0") {
      Swal.fire("Campos requeridos", "Los campos de la sección de objetivos por impactos son requeridos", "error");
      return false;
    }

    if ($('#Q1').val() === "0" || $('#Q2').val() === "0" || $('#Q3').val() === "0" || $('#Q4').val() === "0") {
      Swal.fire("Campos requeridos", "Los campos de la sección de objetivos por compras son requeridos", "error");
      return false;
    }

    if ($('#Q1Rotacion').val() === "0" || $('#Q2Rotacion').val() === "0" || $('#Q3Rotacion').val() === "0" || $('#Q4Rotacion').val() === "0") {
      Swal.fire("Campos requeridos", "Los campos de la sección de objetivos por rotación son requeridos", "error");
      return false;
    }

  } else if (tipoConvenio === "S") {
    if ($('#Q1Impactos').val() === "0" || $('#Q2Impactos').val() === "0") {
      Swal.fire("Campos requeridos", "Los campos de la sección de objetivos por impactos son requeridos", "error");
      return false;
    }

    if ($('#Q1').val() === "0" || $('#Q2').val() === "0") {
      Swal.fire("Campos requeridos", "Los campos de la sección de objetivos por compras son requeridos", "error");
      return false;
    }

    if ($('#Q1Rotacion').val() === "0" || $('#Q2Rotacion').val() === "0") {
      Swal.fire("Campos requeridos", "Los campos de la sección de objetivos por rotación son requeridos", "error");
      return false;
    }

  } else if (tipoConvenio === "A") {
    if ($('#Q1Impactos').val() === "0") {
      Swal.fire("Campos requeridos", "Los campos de la sección de objetivos por impactos son requeridos", "error");
      return false;
    }

    if ($('#Q1').val() === "0") {
      Swal.fire("Campos requeridos", "Los campos de la sección de objetivos por compras son requeridos", "error");
      return false;
    }

    if ($('#Q1Rotacion').val() === "0") {
      Swal.fire("Campos requeridos", "Los campos de la sección de objetivos por rotación son requeridos", "error");
      return false;
    }
  }

  return true;
}
// FUNCIÓN PARA GUARDAR DATOS DEL CONVENIO
const guardarConvenio = async () => {
  const tipoConvenio = $('#tipoConvenio').val();
  if (!tipoConvenio) {
    Swal.fire("Oops!!!", "Debe seleccionar un tipo convenio", "error");
    return;
  }
  
  const validate = validarCamposSeccionOjetivos(tipoConvenio);
  if (!validate) return;

  const centro = $('#centro').val();
  if (centro === null) {
    Swal.fire("Oops!!!", "No ha seleccionado ningún centro", "error");
    return;
  }

  let centroArrayIN = centro.map(item => `'${item}'`).join(", ");

  const descripcion = $.trim($("#txtDescripcion").val());
  if (!descripcion) {
    Swal.fire("Oops!!!", "Por favor escriba una descripción.", "error");
    $("#txtDescripcion").focus();
    return false;
  }

  // Validación de campos numéricos
  let camposVacios = false;

  $(".form-percent").each(function () {
    if ($(this).val().trim() === "") {
      $(this).focus();
      camposVacios = true;
      return false;
    }
  });

  if (camposVacios) {
    Swal.fire("Oops", "Por favor complete todos los campos.", "error");
    return false;
  }

  // Validación de grupos de artículos seleccionados
  const grupos = $("#inGrupoArticulo").val();
  if (!grupos || grupos.length === 0) {
    Swal.fire("Oops", "No ha seleccionado ningún grupo de artículo.", "error");
    return false;
  }
  
  const nombreArchivo = `convenio_compras_${obtenerFechaHoraActual()}.pdf`;

  const data = {
    link: "../models/ConveniosCompras.php",
    op: "G_CONVENIO",
    org: $("#inSociedad").val(),
    fhInicio: $("#fhInicio").val(),
    fhFinal: $("#fhFinal").val(),
    descripcion,
    email: $("#txtEmail").val(),
    grupos,
    tipoConvenio,
    centro: centro.join('-'),
    centroArrayIN,
    rebateMes: $("#rebateMes").val(),
    rebateTrimestre: $("#rebateTrimestre").val(),
    rebateSemestre: $("#rebateSemestre").val(),
    rebateAnio: $("#rebateAnio").val(),
    rebateCodificacion: $("#rebateCodificacion").val(),
    rebateRotacion: $("#rebateRotacion").val(),
    rebateInformacion: $("#rebateInformacion").val(),
    rebateDevoluciones: $("#rebateDevoluciones").val(),
    rebateDinamica: $("#rebateDinamica").val(),
    rebateInventario: $("#rebateInventario").val(),
    rebateImpactos: $("#rebateImpactos").val(),
    rebateLogistica: $("#rebateLogistica").val(),
    porcentajeOpcional: $("#rebateOtros").val(),
    Q1: $("#Q1").val(),
    Q2: $("#Q2").val(),
    Q3: $("#Q3").val(),
    Q4: $("#Q4").val(),
    objetivoAnio: $("#objetivoAnio").val(),
    txtNotas: $("#txtNotas").val(),
    Q1_IMPACTOS: $("#Q1Impactos").val(),
    Q2_IMPACTOS: $("#Q2Impactos").val(),
    Q3_IMPACTOS: $("#Q3Impactos").val(),
    Q4_IMPACTOS: $("#Q4Impactos").val(),
    anioImpactos: $("#anioImpactos").val(),
    Q1_ROTACION: $("#Q1Rotacion").val(),
    Q2_ROTACION: $("#Q2Rotacion").val(),
    Q3_ROTACION: $("#Q3Rotacion").val(),
    Q4_ROTACION: $("#Q4Rotacion").val(),
    anioRotacion: $("#anioRotacion").val(),
    nombreArchivo: nombreArchivo
  }

  const upload = await subirArchivo(nombreArchivo);

  if (!upload) {
    Swal.fire('Oops!!!', 'El archivo PDF del convenio no pudo subirse, verifique e intente nuevamente.', 'error');
    return;
  }

  try {
    const resp = await enviarPeticion(data);

    if (!resp.error) {
      Swal.fire('Excelente', 'Convenio creado correctamente', 'success');
    } else {
      Swal.fire('Error', 'No fue posible crear el convenio, verifique los datos e intente nuevamente.', 'error');
    }

    limpiarFormulario();
  } catch (e) {
    Swal.fire('Error', 'Algo salio muy mal, no fue posible crear el convenio, verifique los datos e intente nuevamente.', 'error');
    console.log(e);
  }
}

const limpiar = () => {
  $(".form-percent").val(0);

  $('#fhInicio, #fhFinal').datepicker({
    autoclose: true,
    multidate: false,
    changeMonth: true,
    changeYear: true,
    useCurrent: true,
    dateFormat: 'yy-mm-dd'
  }).datepicker("setDate", new Date());

  $("#inSociedad").val('*');
  $("#tipoConvenio").val('');
  $("#txtDescripcion").val('');
  $("#inGrupoArticulo").val('');
  $("#adjunto").val('');
  $("#txtNotas").val('');
  $("#txtEmail").val('');
}

const gruposArticulos = async () => {
  try {
    const resp = await enviarPeticion({ link: "../models/Eventos.php", op: "B_GARTICULOS" });
    let options = ``;
    resp.forEach(item => options += `<option value="${item.GRUPO_ARTICULO}">${item.GRUPO_ARTICULO} - ${item.DESCRIPCION1}</option>`);
    $("#inGrupoArticulo").html(options);
  } catch (e) {
    console.log(e);
  }
}

const eliminarConvenio = async (id) => {
  Swal.fire({
    title: "Esta seguro de eliminar este convenio?",
    text: "Esta opción no se puede reversar!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminarlo!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      const data = {
        link: "../models/ConveniosCompras.php",
        op: "D_CONVENIO",
        id: id
      }
      try {
        LoadImg('Eliminando convenio... Por favor espere');
        const resp = await enviarPeticion(data);
        if (resp.ok) {
          Swal.fire('Correcto', 'Convenio eliminado correctamente', 'success');
        } else {
          Swal.fire('Error', 'Ha ocurrido un error al eliminar el convenio, verifique e intente nuevamente.', 'error');
        }
        buscarConvenios();
      } catch (e) {
        UnloadImg();
        console.log(e);
      }
    } else {
      Swal.fire('Correcto', 'Operación cancelada', 'info');
    }
  });
}

const tipoConvenio = {
  "T": "TRIMESTRAL",
  "C": "CUATRIMESTRAL",
  "S": "SEMESTRAL",
  "A": "ANUAL",
}

const buscarConvenios = async () => {  
  try {
    LoadImg('Consultando información... Por favor espere');

    const resp = await enviarPeticion({
      link: "../models/ConveniosCompras.php",
      op: "S_CONVENIO",
    });

    let tablaHtml = '';
    if (resp.length > 0) {
      tablaHtml += `
      <table class="table table-bordered table-hover table-sm" style="100%" id="tableResult">
        <thead>
          <tr>
            <th class="bag-info text-green size-14 no-wrap">ID</th>           
            <th class="bag-info text-green size-14 no-wrap">ORGANIZACIÓN</th>     
            <th class="bag-info text-green size-14 no-wrap">INICIO</th>           
            <th class="bag-info text-green size-14 no-wrap">FIN</th>           
            <th class="bag-info text-green size-14 no-wrap">GRUPOS</th>           
            <th class="bag-info text-green size-14 no-wrap">CENTRO</th>           
            <th class="bag-info text-green size-14 no-wrap">TIPO CONVENIO</th>           
            <th class="bag-info text-green size-14 no-wrap">DESCRIPCIÓN</th>    
            <th class="bag-info text-green size-14 no-wrap">NOTAS</th>
            <th class="bag-info text-green size-14 no-wrap">EMAIL</th>
            <th class="bag-info text-green size-14 no-wrap text-center">CONSULTAR</th>
            <th class="bag-info text-green size-14 no-wrap text-center">ADJUNTO</th>
            <th class="bag-info text-green size-14 no-wrap text-center">ELIMINAR</th>
          </tr>
        </thead>
        <tbody>`;        

      arrayGeneral = [];

      resp.forEach(function (item) {
        const datosCompraVenta = unirArraysPorCentro(item.VENTAS, item.COMPRAS, item.CENTRO);
        const grupos = item.GRUPOS.replaceAll("'", '').replaceAll(',', '-');

        tablaHtml += `
        <tr>
          <td class="size-14 no-wrap">${item.ID}</td>
          <td class="size-14 no-wrap">${item.ORGANIZACION_VENTAS}</td>
          <td class="size-14 no-wrap">${item.FECHA_INICIO}</td>
          <td class="size-14 no-wrap">${item.FECHA_FIN}</td>
          <td class="size-14 no-wrap">${grupos}</td>
          <td class="size-13 no-wrap">${item.CENTRO}</td>
          <td class="size-13 no-wrap">${tipoConvenio[item.TIPO_CONVENIO]}</td>
          <td class="size-13 no-wrap">${item.DESCRIPCION}</td>
          <td class="size-13 no-wrap">${item.NOTAS}</td>
          <td class="size-13 no-wrap">${item.EMAIL}</td>
          <td class="text-center"><button class="btn btn-outline-success" onclick="detalleConvenio(${item.ID});"><i class="fa-solid fa-arrow-up-right-from-square"></i> </button></td>
          <td class="text-center"><button class="btn btn-outline-primary" onclick="adjuntoConvenio('${item.PDF_CONVENIO}');"><i class="fa-solid fa-file-pdf"></i> </button></td>
          <td class="text-center"><button class="btn btn-outline-danger" onclick="eliminarConvenio(${item.ID});"><i class="fa-solid fa-trash-can"></i> </button></td>
        </tr>`;

        arrayGeneral.push({
          ID: item.ID,
          ORGANIZACION_VENTAS: item.ORGANIZACION_VENTAS,
          FECHA_INICIO: item.FECHA_INICIO,
          FECHA_FIN: item.FECHA_FIN,
          DESCRIPCION: item.DESCRIPCION,
          REBATE_MES: item.REBATE_MES,
          REBATE_TRIMESTRE: item.REBATE_TRIMESTRE,
          REBATE_SEMESTRE: item.REBATE_SEMESTRE,
          REBATE_ANIO: item.REBATE_ANIO,
          REBATE_CODIFICACION: item.REBATE_CODIFICACION,
          REBATE_ROTACION: item.REBATE_ROTACION,
          REBATE_INFORMACION: item.REBATE_INFORMACION,
          REBATE_DEVOLUCIONES: item.REBATE_DEVOLUCIONES,
          REBATE_DINAMICA: item.REBATE_DINAMICA,
          REBATE_INVENTARIO: item.REBATE_INVENTARIO,
          REBATE_IMPACTOS: item.REBATE_IMPACTOS,
          REBATE_LOGISTICA: item.REBATE_LOGISTICA,
          Q1: item.Q1,
          Q2: item.Q2,
          Q3: item.Q3,
          Q4: item.Q4,
          OBJETIVO_ANIO: item.OBJETIVO_ANIO,
          NOTAS: item.NOTAS,
          VENTAS: item.VENTAS,
          COMPRAS: item.COMPRAS,
          DATOS_COMPRAVENTA: datosCompraVenta,
          Q1_IMPACTOS: item.Q1_IMPACTOS,
          Q2_IMPACTOS: item.Q2_IMPACTOS,
          Q3_IMPACTOS: item.Q3_IMPACTOS,
          Q4_IMPACTOS: item.Q4_IMPACTOS,
          IMPACTOS_ANIO: item.IMPACTOS_ANIO,
          Q1_ROTACION: item.Q1_ROTACION,
          Q2_ROTACION: item.Q2_ROTACION,
          Q3_ROTACION: item.Q3_ROTACION,
          Q4_ROTACION: item.Q4_ROTACION,
          ROTACION_ANIO: item.ROTACION_ANIO,
          CENTRO: item.CENTRO,
          TIPO_CONVENIO: item.TIPO_CONVENIO
        });
      });
      
      tablaHtml += `</tbody></table>`;
    } else {
      tablaHtml = `
      <div class="alert alert-danger" role="alert">
        <i class="fa-solid fa-circle-info fa-beat"></i> No hay convenios creados por el momento
      </div>`;
    }

    $("#dvResult").html(tablaHtml);
    UnloadImg();
  } catch (e) {
    console.log(e);
  }
}

const adjuntoConvenio = (pdf) => {
  let pdfUrl = "../../Documentos/ConveniosCompras/" + pdf;
  let embedElement = $('<embed>', {
    src: pdfUrl,
    frameborder: 0,
    width: "100%",
    height: "400px"
  });
  $("#ContainerPDF").empty().append(embedElement);
  $("#ModalAdjunto").modal('show');
}

const generarGrafica = (valorObjetivos, valorCompras, valorVentas, tipoConvenio) => {
  let categorias = [];
  let tituloGrafico = "";
  let descripcion = "";

  if (tipoConvenio === "S") {
    categorias.push("1° Semestre", "2° Semestre");
    tituloGrafico = "Ventas Semestrales";
    descripcion = "Semestres";
    
  } else if (tipoConvenio === "A") {
    categorias.push("Año");
    tituloGrafico = "Venta Anual";
    descripcion = "Año";
    
  } else if (tipoConvenio === "C") {
    categorias.push("1° Cuatrimestre", "2° Cuatrimestre", "3° Cuatrimestre");
    tituloGrafico = "Ventas Cuatrimestrales";
    descripcion = "Cuatrimestres";
    
  } else if (tipoConvenio === "T") {
    categorias.push("1° Trimestre", "2° Trimestre", "3° Trimestre", "4° Trimestre");
    tituloGrafico = "Ventas Trimestrales";
    descripcion = "Trimestres";
  }

  Highcharts.chart('imgContainer1', {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      style: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }
    },
    title: {
      text: '',
      align: 'center'
    },
    subtitle: {
      text: '',
      align: 'left'
    },
    xAxis: {
      categories: categorias,
      crosshair: true,
      lineColor: '#ced4da',
      tickColor: '#ced4da',
      labels: {
        style: {
          color: '#495057',
          fontWeight: '500'
        }
      },
      title: {
        style: {
          color: '#495057'
        }
      },
      accessibility: {
        description: descripcion
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: tituloGrafico,
        style: {
          color: '#495057'
        }
      },
      gridLineColor: '#e9ecef',
      labels: {
        style: {
          color: '#495057'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ced4da',
      borderRadius: 6,
      valueSuffix: ' ',
      style: {
        color: '#495057'
      }
    },
    legend: {
      itemStyle: {
        color: '#495057',
        fontWeight: '500'
      },
      itemHoverStyle: {
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 2,
        borderRadius: 3,
        groupPadding: 0.15
      }
    },
    series: [{
      name: 'Objetivo',
      data: valorObjetivos,
    },
    {
      name: 'Compras',
      data: valorCompras,
    },
    {
      name: 'Ventas',
      data: valorVentas,
    }],
    credits: {
      enabled: false
    }
  });
}
// FUNCIÓN PARA REALIZAR CONSOLIDADO DE LOS CONVENIOS
function consolidarConvenio(convenio) {
	const tipo = convenio.TIPO_CONVENIO;
	const mesesPorTipo = { T: 3, C: 4, S: 6, A: 12 };
	const mesesPorGrupo = mesesPorTipo[tipo];

	let centrosAsociados = convenio.CENTRO;

	if (typeof centrosAsociados === "string") {
		centrosAsociados = centrosAsociados.split("-");
	}

	const periodos = {};
	const totalAnual = {};

	function acumular(item, esVenta) {
		const grupo = (tipo === "A") ? 1 : Math.ceil(Number(item.MES) / mesesPorGrupo);
		const clave = `${item.ANIO}-${tipo}${grupo}`;

		if (!periodos[clave]) {
			periodos[clave] = {
				ANIO: +item.ANIO,
				PERIODO: (tipo === "A") ? "ANUAL" : `${tipo}${grupo}`,
				VAL_NETO_VENTAS: 0,
				VAL_NETO_COMPRAS: 0,
				IMPACTOS: 0
			};
		}

		if (!totalAnual[item.ANIO]) {
			totalAnual[item.ANIO] = {
				ANIO: +item.ANIO,
				PERIODO: "ANUAL",
				VAL_NETO_VENTAS: 0,
				VAL_NETO_COMPRAS: 0,
				IMPACTOS: 0
			};
		}

		if (esVenta) {
			periodos[clave].VAL_NETO_VENTAS += +item.VAL_NETO_VENTAS;
			periodos[clave].IMPACTOS += +item.IMPACTOS;
			totalAnual[item.ANIO].VAL_NETO_VENTAS += +item.VAL_NETO_VENTAS;
			totalAnual[item.ANIO].IMPACTOS += +item.IMPACTOS;
		} else {
			periodos[clave].VAL_NETO_COMPRAS += +item.VAL_NETO_COMPRAS;
			totalAnual[item.ANIO].VAL_NETO_COMPRAS += +item.VAL_NETO_COMPRAS;
		}
	}

	convenio.VENTAS
		.filter(v => centrosAsociados.includes(v.CENTRO))
		.forEach(v => acumular(v, true));

	convenio.COMPRAS
		.filter(c => centrosAsociados.includes(c.CENTRO))
		.forEach(c => acumular(c, false));

	return [
		...Object.values(periodos).sort((a, b) => (a.ANIO - b.ANIO) || a.PERIODO.localeCompare(b.PERIODO)),
		...Object.values(totalAnual).sort((a, b) => a.ANIO - b.ANIO)
	];
}
// FUNCIÓN PARA ARMAR EL DETALLE DEL CONVENIO POR TIPO
const detalleConvenio = (id) => {
  $('#idConvenio').val(id);
  let objetoFiltrado = arrayGeneral.filter(item => {
    return item.ID === id;
  });

  const objetoConsolidado = consolidarConvenio(objetoFiltrado[0]);  

  const { TIPO_CONVENIO, REBATE_TRIMESTRE, Q1, Q2, Q3, Q4, Q1_ROTACION, Q2_ROTACION, Q3_ROTACION, Q4_ROTACION } = objetoFiltrado[0]; 

  $("#titulo-convenio").text(objetoFiltrado[0].DESCRIPCION);

  let valoresObjetivoTrimestre = [];
  let valoresObjetivosVentasTrimestre = [];

  if (TIPO_CONVENIO === "S") {
    $('#columna3, #columna4').hide();
    $('#columna1, #columna2').show();
    $('#columna1, #columna2').removeClass("col-lg-3 col-md-4");
    $('#columna1, #columna2').addClass("col-md-6");
    $("#detQ1Obj").html(formatNum(Q1, '$'));
    $("#detQ2Obj").html(formatNum(Q2, '$'));
    $("#pcjRbCompras1, #pcjRbCompras2").html(`${REBATE_TRIMESTRE}%`);
	  valoresObjetivosVentasTrimestre.push(Q1_ROTACION, Q2_ROTACION);
    valoresObjetivoTrimestre.push(Q1, Q2);
    $('#tituloGrafico').html(`<i class="fa-solid fa-chart-simple me-2"></i> CUMPLIMIENTO SEMESTRAL GRÁFICO`);
    $('#tituloSeguimiento').html(`<i class="fas fa-flag-checkered fa-lg me-3"></i> <h5 class="mb-0 fw-bold">SEGUIMIENTO DE REBATES SEMESTRAL</h5>`);
    $('#tituloCol1').html(`<i class="fas fa-calendar me-2"></i>PRIMER SEMESTRE`);
    $('#tituloCol2').html(`<i class="fas fa-calendar me-2"></i>SEGUNDO SEMESTRE`);
    $('#tituloTotales1').html(`<i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE 1° SEMESTRE`);
    $('#tituloTotales2').html(`<i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE 2° SEMESTRE`);
    
	} else if (TIPO_CONVENIO === "A") {
    $('#columna2, #columna3, #columna4').hide();
		$('#columna1').show();
		$('#columna1').removeClass("col-lg-3 col-md-4");
		$('#columna1').addClass("col-md-6");
		$("#detQ1Obj").html(formatNum(Q1, '$'));
		$("#pcjRbCompras1").html(`${REBATE_TRIMESTRE}%`);
		valoresObjetivosVentasTrimestre.push(Q1_ROTACION);
		valoresObjetivoTrimestre.push(Q1);
    $('#tituloGrafico').html(`<i class="fa-solid fa-chart-simple me-2"></i> CUMPLIMIENTO ANUAL GRÁFICO`);
    $('#tituloSeguimiento').html(`<i class="fas fa-flag-checkered fa-lg me-3"></i> <h5 class="mb-0 fw-bold">SEGUIMIENTO DE REBATES ANUAL</h5>`);
    $('#tituloCol1').html(`<i class="fas fa-calendar me-2"></i>AÑO`);
    $('#tituloTotales1').html(`<i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE AÑO`);
		
	} else if (TIPO_CONVENIO === "C") {
    $('#columna4').hide();
		$('#columna1, #columna2, #columna3').show();
		$('#columna1, #columna2, #columna3').removeClass("col-md-6 col-lg-3");
		$('#columna1, #columna2, #columna3').addClass("col-md-4");
		$("#detQ1Obj").html(formatNum(Q1, '$'));
		$("#detQ2Obj").html(formatNum(Q2, '$'));
		$("#detQ3Obj").html(formatNum(Q3, '$'));
		$("#pcjRbCompras1, #pcjRbCompras2, #pcjRbCompras3").html(`${REBATE_TRIMESTRE}%`);
		valoresObjetivosVentasTrimestre.push(Q1_ROTACION, Q2_ROTACION, Q3_ROTACION);
		valoresObjetivoTrimestre.push(Q1, Q2, Q3);
    $('#tituloGrafico').html(`<i class="fa-solid fa-chart-simple me-2"></i> CUMPLIMIENTO CUATRIMESTRAL GRÁFICO`);
    $('#tituloSeguimiento').html(`<i class="fas fa-flag-checkered fa-lg me-3"></i> <h5 class="mb-0 fw-bold">SEGUIMIENTO DE REBATES CUATRIMESTRAL</h5>`);
    $('#tituloCol1').html(`<i class="fas fa-calendar me-2"></i>PRIMER CUATRIMESTRE`);
    $('#tituloCol2').html(`<i class="fas fa-calendar me-2"></i>SEGUNDO CUATRIMESTRE`);
    $('#tituloCol3').html(`<i class="fas fa-calendar me-2"></i>TERCER CUATRIMESTRE`);
    $('#tituloTotales1').html(`<i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE 1° CUATRIMESTRE`);
    $('#tituloTotales2').html(`<i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE 2° CUATRIMESTRE`);
    $('#tituloTotales3').html(`<i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE 3° CUATRIMESTRE`);
		
	} else if (TIPO_CONVENIO === "T") {
    $('#columna1, #columna2, #columna3, #columna4').show();
		$('#columna1, #columna2, #columna3').addClass("col-md-6 col-lg-3");
		$('#columna1, #columna2, #columna3').removeClass("col-md-4");
		$("#detQ1Obj").html(formatNum(Q1, '$'));
		$("#detQ2Obj").html(formatNum(Q2, '$'));
		$("#detQ3Obj").html(formatNum(Q3, '$'));
		$("#detQ4Obj").html(formatNum(Q4, '$'));
		$("#pcjRbCompras1, #pcjRbCompras2, #pcjRbCompras3, #pcjRbCompras4").html(`${REBATE_TRIMESTRE}%`);
		valoresObjetivosVentasTrimestre.push(Q1_ROTACION, Q2_ROTACION, Q3_ROTACION, Q4_ROTACION);
		valoresObjetivoTrimestre.push(Q1, Q2, Q3, Q4);
    $('#tituloGrafico').html(`<i class="fa-solid fa-chart-simple me-2"></i> CUMPLIMIENTO TRIMESTRAL GRÁFICO`);
    $('#tituloSeguimiento').html(`<i class="fas fa-flag-checkered fa-lg me-3"></i> <h5 class="mb-0 fw-bold">SEGUIMIENTO DE REBATES TRIMESTRAL</h5>`);
    $('#tituloCol1').html(`<i class="fas fa-calendar me-2"></i>PRIMER TRIMESTRE`);
    $('#tituloCol2').html(`<i class="fas fa-calendar me-2"></i>SEGUNDO TRIMESTRE`);
    $('#tituloCol3').html(`<i class="fas fa-calendar me-2"></i>TERCER TRIMESTRE`);
    $('#tituloCol4').html(`<i class="fas fa-calendar me-2"></i>CUARTO TRIMESTRE`);
    $('#tituloTotales1').html(`<i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE 1° TRIMESTRE`);
    $('#tituloTotales2').html(`<i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE 2° TRIMESTRE`);
    $('#tituloTotales3').html(`<i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE 3° TRIMESTRE`);
    $('#tituloTotales4').html(`<i class="fas fa-cash-register me-2"></i>VALOR TOTAL REBATE 4° TRIMESTRE`);
  }

	let sumaValoresQC = valoresObjetivoTrimestre.reduce((total, valorQ) => total + parseFloat(valorQ), 0);
	let sumaValoresQV = valoresObjetivosVentasTrimestre.reduce((total, valorQ) => total + parseFloat(valorQ), 0);
	$("#detAnioObj").html(formatNum(sumaValoresQC, '$'));
	$("#detAnioObjVentas").html(formatNum(sumaValoresQV, '$'));		
	
  let detQ1Compra = 0, detQ2Compra = 0, detQ3Compra = 0, detQ4Compra = 0;
  let detQ1Ventas = 0, detQ2Ventas = 0, detQ3Ventas = 0, detQ4Ventas = 0;
  let detQ1Impactos = 0, detQ2Impactos = 0, detQ3Impactos = 0, detQ4Impactos = 0;
	let detQ1Cumple = 0, detQ2Cumple = 0, detQ3Cumple = 0, detQ4Cumple = 0;
	
  let valoresComprasTrimestre = [];
  let valoresVentasTrimestre = [];
  let valoresImpactosTrimestre = [];
  
	if (objetoConsolidado.length) {
    if (TIPO_CONVENIO === "S") {
      detQ1Compra = objetoConsolidado[0].VAL_NETO_COMPRAS;
			detQ2Compra = objetoConsolidado[1].VAL_NETO_COMPRAS;
      detQ1Ventas = objetoConsolidado[0].VAL_NETO_VENTAS;
			detQ2Ventas = objetoConsolidado[1].VAL_NETO_VENTAS;
      valoresComprasTrimestre.push(detQ1Compra, detQ2Compra);
      valoresVentasTrimestre.push(detQ1Ventas, detQ2Ventas);
			$("#detQ1Compra").html(formatNum(detQ1Compra, '$'));
			$("#detQ2Compra").html(formatNum(detQ2Compra, '$'));
			detQ1Cumple = calcularPorcentaje(detQ1Compra, Q1);
			detQ2Cumple = calcularPorcentaje(detQ2Compra, Q2);
			$("#detQ1Cumple").html(detQ1Cumple + '%');
			$("#detQ2Cumple").html(detQ2Cumple + '%');
			
		} else if (TIPO_CONVENIO === "A") {
      detQ1Compra = objetoConsolidado[0].VAL_NETO_COMPRAS;
      detQ1Ventas = objetoConsolidado[0].VAL_NETO_VENTAS;
      valoresComprasTrimestre.push(detQ1Compra);
      valoresVentasTrimestre.push(detQ1Ventas);
			$("#detQ1Compra").html(formatNum(detQ1Compra, '$'));
			detQ1Cumple = calcularPorcentaje(detQ1Compra, Q1); 
  		$("#detQ1Cumple").html(detQ1Cumple + '%');
      
		} else if (TIPO_CONVENIO === "C") {
      detQ1Compra = objetoConsolidado[0].VAL_NETO_COMPRAS;
			detQ2Compra = objetoConsolidado[1].VAL_NETO_COMPRAS;
			detQ3Compra = objetoConsolidado[2].VAL_NETO_COMPRAS;
      detQ1Ventas = objetoConsolidado[0].VAL_NETO_VENTAS;
			detQ2Ventas = objetoConsolidado[1].VAL_NETO_VENTAS;
			detQ3Ventas = objetoConsolidado[2].VAL_NETO_VENTAS;
      valoresComprasTrimestre.push(detQ1Compra, detQ2Compra, detQ3Compra);
      valoresVentasTrimestre.push(detQ1Ventas, detQ2Ventas, detQ3Ventas);
			$("#detQ1Compra").html(formatNum(detQ1Compra, '$'));
			$("#detQ2Compra").html(formatNum(detQ2Compra, '$'));
			$("#detQ3Compra").html(formatNum(detQ3Compra, '$'));
			detQ1Cumple = calcularPorcentaje(detQ1Compra, Q1);
			detQ2Cumple = calcularPorcentaje(detQ2Compra, Q2);
			detQ3Cumple = calcularPorcentaje(detQ3Compra, Q3);      
			$("#detQ1Cumple").html(detQ1Cumple + '%');
			$("#detQ2Cumple").html(detQ2Cumple + '%');
			$("#detQ3Cumple").html(detQ3Cumple + '%');
      
		} else if (TIPO_CONVENIO === "T") {
      detQ1Compra = objetoConsolidado[0].VAL_NETO_COMPRAS;
			detQ2Compra = objetoConsolidado[1].VAL_NETO_COMPRAS;
			detQ3Compra = objetoConsolidado[2].VAL_NETO_COMPRAS;
			detQ4Compra = objetoConsolidado[3].VAL_NETO_COMPRAS;
      detQ1Ventas = objetoConsolidado[0].VAL_NETO_VENTAS;
			detQ2Ventas = objetoConsolidado[1].VAL_NETO_VENTAS;
			detQ3Ventas = objetoConsolidado[2].VAL_NETO_VENTAS;
			detQ4Ventas = objetoConsolidado[3].VAL_NETO_VENTAS;
      valoresComprasTrimestre.push(detQ1Compra, detQ2Compra, detQ3Compra, detQ4Compra);
      valoresVentasTrimestre.push(detQ1Ventas, detQ2Ventas, detQ3Ventas, detQ4Ventas);
			$("#detQ1Compra").html(formatNum(detQ1Compra, '$'));
			$("#detQ2Compra").html(formatNum(detQ2Compra, '$'));
			$("#detQ3Compra").html(formatNum(detQ3Compra, '$'));
			$("#detQ4Compra").html(formatNum(detQ4Compra, '$'));
			detQ1Cumple = calcularPorcentaje(detQ1Compra, Q1);
			detQ2Cumple = calcularPorcentaje(detQ2Compra, Q2);
			detQ3Cumple = calcularPorcentaje(detQ3Compra, Q3);
			detQ4Cumple = calcularPorcentaje(detQ4Compra, Q4);
			$("#detQ1Cumple").html(detQ1Cumple + '%');
			$("#detQ2Cumple").html(detQ2Cumple + '%');
			$("#detQ3Cumple").html(detQ3Cumple + '%');
			$("#detQ4Cumple").html(detQ4Cumple + '%');
		}

		const CONSOLIDADO = objetoConsolidado.filter(item => item.PERIODO === "ANUAL");
		const sumaComprasQ = CONSOLIDADO[0].VAL_NETO_COMPRAS;
		const sumaVentasQ = CONSOLIDADO[0].VAL_NETO_VENTAS;
	
		$("#detAnioCompra").html(formatNum(sumaComprasQ, '$'));
		$("#detAnioVentas").html(formatNum(sumaVentasQ, '$'));
	
		let detAnioCumpleCompras = calcularPorcentaje(sumaComprasQ, sumaValoresQC);
		$("#detAnioCumpleCompras").html(detAnioCumpleCompras + '%');
	
		let detAnioCumpleVentas = calcularPorcentaje(sumaVentasQ, sumaValoresQV);
		$("#detAnioCumpleVentas").html(detAnioCumpleVentas + '%');
	}

  generarGrafica(valoresObjetivoTrimestre, valoresComprasTrimestre, valoresVentasTrimestre, TIPO_CONVENIO);  
  
  const datosPorCentro = objetoFiltrado[0].DATOS_COMPRAVENTA.reduce((acc, item) => {
    if (!acc[item.CENTRO]) acc[item.CENTRO] = [];
    acc[item.CENTRO].push(item);
    return acc;
  }, {});

  const mesesUnicos = [...new Set(objetoFiltrado[0].DATOS_COMPRAVENTA.map(d => d.MES))].sort((a, b) => a - b);

  let tablaHtml = `
  <div class="tabla-estilo-wrapper" style="max-height: 70vh; overflow:auto;">
    <table class="table table-bordered table-hover table-sm" width="100%">
      <thead>
        <tr>
          <th class="text-green bag-info size-14">CENTRO / CONCEPTO</th>
          ${mesesUnicos.map(m => `<th class="text-green bag-info size-14">${obtenerNombreMes(m)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>`;

  Object.keys(datosPorCentro).forEach(centro => {
    ['COMPRAS', 'ROTACIÓN', 'IMPACTOS'].forEach(tipo => {
      tablaHtml += `
      <tr>
        <td class="size-13"><b>${centro}</b> - ${tipo}</td>
        ${mesesUnicos.map(mes => {
        const d = datosPorCentro[centro].find(x => x.MES === mes);
        if (!d) return `<td>-</td>`;
        return `<td class="size-14">${tipo === 'COMPRAS'
            ? formatNum(parseFloat(d.VAL_NETO_COMPRAS), '$')
            : tipo === 'ROTACIÓN'
            ? formatNum(parseFloat(d.VAL_NETO_VENTAS), '$')
            : formatNum(d.IMPACTOS)
          }</td>`;
      }).join('')}
      </tr>`;
    });
  });

  tablaHtml += `</tbody></table></div>`;
  $("#dvComprasMensuales").html(tablaHtml);

  let vlrRbCompras1 =  0, vlrRbCompras2 = 0, vlrRbCompras3 = 0, vlrRbCompras4 = 0;
  let vlrRbImpactos1 = 0, vlrRbImpactos2 = 0, vlrRbImpactos3 = 0, vlrRbImpactos4 = 0;
  let cumpleImpactos1 = 0, cumpleImpactos2 = 0, cumpleImpactos3 = 0, cumpleImpactos4 = 0;
  let cumpleVentas1 = 0, cumpleVentas2 = 0, cumpleVentas3 = 0, cumpleVentas4 = 0;
  let vlrRbVentas1 = 0, vlrRbVentas2 = 0, vlrRbVentas3 = 0, vlrRbVentas4 = 0;
  let vlrRbDevoluciones1 = 0, vlrRbDevoluciones2 = 0, vlrRbDevoluciones3 = 0, vlrRbDevoluciones4 = 0;
  let vlrRbDinamica1 = 0, vlrRbDinamica2 = 0, vlrRbDinamica3 = 0, vlrRbDinamica4 = 0;
  let vlrRbInventario1 = 0, vlrRbInventario2 = 0, vlrRbInventario3 = 0, vlrRbInventario4 = 0;
  let vlrRbLogistica1 = 0, vlrRbLogistica2 = 0, vlrRbLogistica3 = 0, vlrRbLogistica4 = 0;
  let vlrRbManejo1 = 0, vlrRbManejo2 = 0, vlrRbManejo3 = 0, vlrRbManejo4 = 0;
  let vlrTotalRbQ1 = 0, vlrTotalRbQ2 = 0, vlrTotalRbQ3 = 0, vlrTotalRbQ4 = 0;

  const { REBATE_IMPACTOS, Q1_IMPACTOS, Q2_IMPACTOS, Q3_IMPACTOS, Q4_IMPACTOS, REBATE_ROTACION, REBATE_DEVOLUCIONES, REBATE_DINAMICA, REBATE_INVENTARIO, REBATE_LOGISTICA, REBATE_CODIFICACION } = objetoFiltrado[0];
  
  if (TIPO_CONVENIO === "S") {
    $("#pcjRbImpactos1, #pcjRbImpactos2").html(`${REBATE_IMPACTOS}%`);
    vlrRbCompras1 = calcularCumplimiento(detQ1Compra, REBATE_TRIMESTRE);
    vlrRbCompras2 = calcularCumplimiento(detQ2Compra, REBATE_TRIMESTRE);
    $("#vlrRbCompras1").html(formatNum(vlrRbCompras1, '$'));
    $("#vlrRbCompras2").html(formatNum(vlrRbCompras2, '$'));
    
    $("#detQ1ObjImpactos").html(formatNum(Q1_IMPACTOS));
    $("#detQ2ObjImpactos").html(formatNum(Q2_IMPACTOS));
    detQ1Impactos = objetoConsolidado[0].IMPACTOS;
    detQ2Impactos = objetoConsolidado[1].IMPACTOS;
    $("#detQ1Impactos").html(formatNum(detQ1Impactos));
    $("#detQ2Impactos").html(formatNum(detQ2Impactos));
    vlrRbImpactos1 = calcularCumplimiento(detQ1Compra, REBATE_IMPACTOS);
    vlrRbImpactos2 = calcularCumplimiento(detQ2Compra, REBATE_IMPACTOS);
    $("#vlrRbImpactos1").html(formatNum(vlrRbImpactos1, '$'));
    $("#vlrRbImpactos2").html(formatNum(vlrRbImpactos2, '$'));
    cumpleImpactos1 = calcularPorcentaje(detQ1Impactos, Q1_IMPACTOS);
    cumpleImpactos2 = calcularPorcentaje(detQ2Impactos, Q2_IMPACTOS);    
    $("#cumpleImpactos1").html(cumpleImpactos1 + '%');
    $("#cumpleImpactos2").html(cumpleImpactos2 + '%');
   
    $("#pcjRbRotacion1, #pcjRbRotacion2").html(REBATE_ROTACION + '%');
    $("#detQ1ObjRotacion").html(formatNum(Q1_ROTACION, '$'));
    $("#detQ2ObjRotacion").html(formatNum(Q2_ROTACION, '$'));    
    $("#detQ1Ventas").html(formatNum(detQ1Ventas, '$'));
    $("#detQ2Ventas").html(formatNum(detQ2Ventas, '$'));
    cumpleVentas1 = calcularPorcentaje(detQ1Ventas, Q1_ROTACION);
    cumpleVentas2 = calcularPorcentaje(detQ2Ventas, Q2_ROTACION);    
    $("#cumpleVentas1").html(cumpleVentas1 + '%');
    $("#cumpleVentas2").html(cumpleVentas2 + '%');
    vlrRbVentas1 = calcularCumplimiento(detQ1Compra, REBATE_ROTACION);
    vlrRbVentas2 = calcularCumplimiento(detQ2Compra, REBATE_ROTACION);    
    $("#vlrRbVentas1").html(formatNum(vlrRbVentas1, '$'));
    $("#vlrRbVentas2").html(formatNum(vlrRbVentas2, '$'));
    
    $("#pcjRbDevoluciones1, #pcjRbDevoluciones2").html(`${REBATE_DEVOLUCIONES}%`);
    vlrRbDevoluciones1 = calcularCumplimiento(detQ1Compra, REBATE_DEVOLUCIONES);
    vlrRbDevoluciones2 = calcularCumplimiento(detQ2Compra, REBATE_DEVOLUCIONES);
    $("#vlrRbDevoluciones1").html(formatNum(vlrRbDevoluciones1, '$'));
    $("#vlrRbDevoluciones2").html(formatNum(vlrRbDevoluciones2, '$'));

    $("#pcjRbDinamica1, #pcjRbDinamica2").html(`${REBATE_DINAMICA}%`);
    vlrRbDinamica1 = calcularCumplimiento(detQ1Compra, REBATE_DINAMICA);
    vlrRbDinamica2 = calcularCumplimiento(detQ2Compra, REBATE_DINAMICA);
    $("#vlrRbDinamica1").html(formatNum(vlrRbDinamica1, '$'));
    $("#vlrRbDinamica2").html(formatNum(vlrRbDinamica2, '$'));

    $("#pcjRbInventario1, #pcjRbInventario2").html(`${REBATE_INVENTARIO}%`);
    vlrRbInventario1 = calcularCumplimiento(detQ1Compra, REBATE_INVENTARIO);
    vlrRbInventario2 = calcularCumplimiento(detQ2Compra, REBATE_INVENTARIO);
    $("#vlrRbInventario1").html(formatNum(vlrRbInventario1, '$'));
    $("#vlrRbInventario2").html(formatNum(vlrRbInventario2, '$'));

    $("#pcjRbLogistica1, #pcjRbLogistica2").html(`${REBATE_LOGISTICA}%`);
    vlrRbLogistica1 = calcularCumplimiento(detQ1Compra, REBATE_LOGISTICA);
    vlrRbLogistica2 = calcularCumplimiento(detQ2Compra, REBATE_LOGISTICA);
    $("#vlrRbLogistica1").html(formatNum(vlrRbLogistica1, '$'));
    $("#vlrRbLogistica2").html(formatNum(vlrRbLogistica2, '$'));

    $("#pcjRbManejo1, #pcjRbManejo2").html(`${REBATE_CODIFICACION}%`);
    vlrRbManejo1 = calcularCumplimiento(detQ1Compra, REBATE_CODIFICACION);
    vlrRbManejo2 = calcularCumplimiento(detQ2Compra, REBATE_CODIFICACION);
    $("#vlrRbManejo1").html(formatNum(vlrRbManejo1, '$'));
    $("#vlrRbManejo2").html(formatNum(vlrRbManejo2, '$'));

    vlrTotalRbQ1 = (vlrRbCompras1 + vlrRbImpactos1 + vlrRbVentas1 + vlrRbDevoluciones1 + vlrRbDinamica1 + vlrRbInventario1 + vlrRbLogistica1 + vlrRbManejo1);
    vlrTotalRbQ2 = (vlrRbCompras2 + vlrRbImpactos2 + vlrRbVentas2 + vlrRbDevoluciones2 + vlrRbDinamica2 + vlrRbInventario2 + vlrRbLogistica2 + vlrRbManejo2);
    $("#vlrTotalRbQ1").html(formatNum(vlrTotalRbQ1, '$'));
    $("#vlrTotalRbQ2").html(formatNum(vlrTotalRbQ2, '$'));
    
  } else if (TIPO_CONVENIO === "A") {
    $("#pcjRbImpactos1").html(`${REBATE_IMPACTOS}%`);
    vlrRbCompras1 = calcularCumplimiento(detQ1Compra, REBATE_TRIMESTRE);
    $("#vlrRbCompras1").html(formatNum(vlrRbCompras1, '$'));
    
    $("#detQ1ObjImpactos").html(formatNum(Q1_IMPACTOS));
    detQ1Impactos = objetoConsolidado[0].IMPACTOS;
    $("#detQ1Impactos").html(formatNum(detQ1Impactos));
    vlrRbImpactos1 = calcularCumplimiento(detQ1Compra, REBATE_IMPACTOS);
    $("#vlrRbImpactos1").html(formatNum(vlrRbImpactos1, '$'));
    cumpleImpactos1 = calcularPorcentaje(detQ1Impactos, Q1_IMPACTOS);    
    $("#cumpleImpactos1").html(cumpleImpactos1 + '%');
    
    $("#pcjRbRotacion1").html(REBATE_ROTACION + '%');
    $("#detQ1ObjRotacion").html(formatNum(Q1_ROTACION, '$'));    
    $("#detQ1Ventas").html(formatNum(detQ1Ventas, '$'));
    cumpleVentas1 = calcularPorcentaje(detQ1Ventas, Q1_ROTACION);   
    $("#cumpleVentas1").html(cumpleVentas1 + '%');
    vlrRbVentas1 = calcularCumplimiento(detQ1Compra, REBATE_ROTACION);    
    $("#vlrRbVentas1").html(formatNum(vlrRbVentas1, '$'));
    
    $("#pcjRbDevoluciones1").html(`${REBATE_DEVOLUCIONES}%`);
    vlrRbDevoluciones1 = calcularCumplimiento(detQ1Compra, REBATE_DEVOLUCIONES);    
    $("#vlrRbDevoluciones1").html(formatNum(vlrRbDevoluciones1, '$'));

    $("#pcjRbDinamica1").html(`${REBATE_DINAMICA}%`);
    vlrRbDinamica1 = calcularCumplimiento(detQ1Compra, REBATE_DINAMICA);
    $("#vlrRbDinamica1").html(formatNum(vlrRbDinamica1, '$'));

    $("#pcjRbInventario1").html(`${REBATE_INVENTARIO}%`);
    vlrRbInventario1 = calcularCumplimiento(detQ1Compra, REBATE_INVENTARIO);
    $("#vlrRbInventario1").html(formatNum(vlrRbInventario1, '$'));

    $("#pcjRbLogistica1").html(`${REBATE_LOGISTICA}%`);
    vlrRbLogistica1 = calcularCumplimiento(detQ1Compra, REBATE_LOGISTICA);
    $("#vlrRbLogistica1").html(formatNum(vlrRbLogistica1, '$'));

    $("#pcjRbManejo1").html(`${REBATE_CODIFICACION}%`);
    vlrRbManejo1 = calcularCumplimiento(detQ1Compra, REBATE_CODIFICACION);
    $("#vlrRbManejo1").html(formatNum(vlrRbManejo1, '$'));

    vlrTotalRbQ1 = (vlrRbCompras1 + vlrRbImpactos1 + vlrRbVentas1 + vlrRbDevoluciones1 + vlrRbDinamica1 + vlrRbInventario1 + vlrRbLogistica1 + vlrRbManejo1);
    $("#vlrTotalRbQ1").html(formatNum(vlrTotalRbQ1, '$'));
    
  } else if (TIPO_CONVENIO === "C") {
    $("#pcjRbImpactos1, #pcjRbImpactos2, #pcjRbImpactos3").html(`${REBATE_IMPACTOS}%`);
    vlrRbCompras1 = calcularCumplimiento(detQ1Compra, REBATE_TRIMESTRE);
    vlrRbCompras2 = calcularCumplimiento(detQ2Compra, REBATE_TRIMESTRE);
    vlrRbCompras3 = calcularCumplimiento(detQ3Compra, REBATE_TRIMESTRE);
    $("#vlrRbCompras1").html(formatNum(vlrRbCompras1, '$'));
    $("#vlrRbCompras2").html(formatNum(vlrRbCompras2, '$'));
    $("#vlrRbCompras3").html(formatNum(vlrRbCompras3, '$'));
    
    $("#detQ1ObjImpactos").html(formatNum(Q1_IMPACTOS));
    $("#detQ2ObjImpactos").html(formatNum(Q2_IMPACTOS));
    $("#detQ3ObjImpactos").html(formatNum(Q3_IMPACTOS));
    detQ1Impactos = objetoConsolidado[0].IMPACTOS;
    detQ2Impactos = objetoConsolidado[1].IMPACTOS;
    detQ3Impactos = objetoConsolidado[2].IMPACTOS;
    $("#detQ1Impactos").html(formatNum(detQ1Impactos));
    $("#detQ2Impactos").html(formatNum(detQ2Impactos));
    $("#detQ3Impactos").html(formatNum(detQ3Impactos));
    vlrRbImpactos1 = calcularCumplimiento(detQ1Compra, REBATE_IMPACTOS);
    vlrRbImpactos2 = calcularCumplimiento(detQ2Compra, REBATE_IMPACTOS);
    vlrRbImpactos3 = calcularCumplimiento(detQ3Compra, REBATE_IMPACTOS);
    $("#vlrRbImpactos1").html(formatNum(vlrRbImpactos1, '$'));
    $("#vlrRbImpactos2").html(formatNum(vlrRbImpactos2, '$'));
    $("#vlrRbImpactos3").html(formatNum(vlrRbImpactos3, '$'));
    cumpleImpactos1 = calcularPorcentaje(detQ1Impactos, Q1_IMPACTOS);
    cumpleImpactos2 = calcularPorcentaje(detQ2Impactos, Q2_IMPACTOS);
    cumpleImpactos3 = calcularPorcentaje(detQ3Impactos, Q3_IMPACTOS);
    $("#cumpleImpactos1").html(cumpleImpactos1 + '%');
    $("#cumpleImpactos2").html(cumpleImpactos2 + '%');
    $("#cumpleImpactos3").html(cumpleImpactos3 + '%');
    
    $("#pcjRbRotacion1, #pcjRbRotacion2, #pcjRbRotacion3").html(`${REBATE_ROTACION}%`);
    $("#detQ1ObjRotacion").html(formatNum(Q1_ROTACION, '$'));
    $("#detQ2ObjRotacion").html(formatNum(Q2_ROTACION, '$'));
    $("#detQ3ObjRotacion").html(formatNum(Q3_ROTACION, '$'));
    $("#detQ1Ventas").html(formatNum(detQ1Ventas, '$'));
    $("#detQ2Ventas").html(formatNum(detQ2Ventas, '$'));
    $("#detQ3Ventas").html(formatNum(detQ3Ventas, '$'));
    cumpleVentas1 = calcularPorcentaje(detQ1Ventas, Q1_ROTACION);
    cumpleVentas2 = calcularPorcentaje(detQ2Ventas, Q2_ROTACION);
    cumpleVentas3 = calcularPorcentaje(detQ3Ventas, Q3_ROTACION);
    $("#cumpleVentas1").html(cumpleVentas1 + '%');
    $("#cumpleVentas2").html(cumpleVentas2 + '%');
    $("#cumpleVentas3").html(cumpleVentas3 + '%');
    vlrRbVentas1 = calcularCumplimiento(detQ1Compra, REBATE_ROTACION);
    vlrRbVentas2 = calcularCumplimiento(detQ2Compra, REBATE_ROTACION);
    vlrRbVentas3 = calcularCumplimiento(detQ3Compra, REBATE_ROTACION);
    $("#vlrRbVentas1").html(formatNum(vlrRbVentas1, '$'));
    $("#vlrRbVentas2").html(formatNum(vlrRbVentas2, '$'));
    $("#vlrRbVentas3").html(formatNum(vlrRbVentas3, '$'));

    $("#pcjRbDevoluciones1, #pcjRbDevoluciones2, #pcjRbDevoluciones3").html(`${REBATE_DEVOLUCIONES}%`);
    vlrRbDevoluciones1 = calcularCumplimiento(detQ1Compra, REBATE_DEVOLUCIONES);
    vlrRbDevoluciones2 = calcularCumplimiento(detQ2Compra, REBATE_DEVOLUCIONES);
    vlrRbDevoluciones3 = calcularCumplimiento(detQ3Compra, REBATE_DEVOLUCIONES);
    $("#vlrRbDevoluciones1").html(formatNum(vlrRbDevoluciones1, '$'));
    $("#vlrRbDevoluciones2").html(formatNum(vlrRbDevoluciones2, '$'));
    $("#vlrRbDevoluciones3").html(formatNum(vlrRbDevoluciones3, '$'));

    $("#pcjRbDinamica1, #pcjRbDinamica2, #pcjRbDinamica3").html(`${REBATE_DINAMICA}%`);
    vlrRbDinamica1 = calcularCumplimiento(detQ1Compra, REBATE_DINAMICA);
    vlrRbDinamica2 = calcularCumplimiento(detQ2Compra, REBATE_DINAMICA);
    vlrRbDinamica3 = calcularCumplimiento(detQ3Compra, REBATE_DINAMICA);
    $("#vlrRbDinamica1").html(formatNum(vlrRbDinamica1, '$'));
    $("#vlrRbDinamica2").html(formatNum(vlrRbDinamica2, '$'));
    $("#vlrRbDinamica3").html(formatNum(vlrRbDinamica3, '$'));

    $("#pcjRbInventario1, #pcjRbInventario2, #pcjRbInventario3").html(`${REBATE_INVENTARIO}%`);
    vlrRbInventario1 = calcularCumplimiento(detQ1Compra, REBATE_INVENTARIO);
    vlrRbInventario2 = calcularCumplimiento(detQ2Compra, REBATE_INVENTARIO);
    vlrRbInventario3 = calcularCumplimiento(detQ3Compra, REBATE_INVENTARIO);
    $("#vlrRbInventario1").html(formatNum(vlrRbInventario1, '$'));
    $("#vlrRbInventario2").html(formatNum(vlrRbInventario2, '$'));
    $("#vlrRbInventario3").html(formatNum(vlrRbInventario3, '$'));

    $("#pcjRbLogistica1, #pcjRbLogistica2, #pcjRbLogistica3").html(`${REBATE_LOGISTICA}%`);
    vlrRbLogistica1 = calcularCumplimiento(detQ1Compra, REBATE_LOGISTICA);
    vlrRbLogistica2 = calcularCumplimiento(detQ2Compra, REBATE_LOGISTICA);
    vlrRbLogistica3 = calcularCumplimiento(detQ3Compra, REBATE_LOGISTICA);
    $("#vlrRbLogistica1").html(formatNum(vlrRbLogistica1, '$'));
    $("#vlrRbLogistica2").html(formatNum(vlrRbLogistica2, '$'));
    $("#vlrRbLogistica3").html(formatNum(vlrRbLogistica3, '$'));

    $("#pcjRbManejo1, #pcjRbManejo2, #pcjRbManejo3").html(`${REBATE_CODIFICACION}%`);
    vlrRbManejo1 = calcularCumplimiento(detQ1Compra, REBATE_CODIFICACION);
    vlrRbManejo2 = calcularCumplimiento(detQ2Compra, REBATE_CODIFICACION);
    vlrRbManejo3 = calcularCumplimiento(detQ3Compra, REBATE_CODIFICACION);
    $("#vlrRbManejo1").html(formatNum(vlrRbManejo1, '$'));
    $("#vlrRbManejo2").html(formatNum(vlrRbManejo2, '$'));
    $("#vlrRbManejo3").html(formatNum(vlrRbManejo3, '$'));

    vlrTotalRbQ1 = (vlrRbCompras1 + vlrRbImpactos1 + vlrRbVentas1 + vlrRbDevoluciones1 + vlrRbDinamica1 + vlrRbInventario1 + vlrRbLogistica1 + vlrRbManejo1);
    vlrTotalRbQ2 = (vlrRbCompras2 + vlrRbImpactos2 + vlrRbVentas2 + vlrRbDevoluciones2 + vlrRbDinamica2 + vlrRbInventario2 + vlrRbLogistica2 + vlrRbManejo2);
    vlrTotalRbQ3 = (vlrRbCompras3 + vlrRbImpactos3 + vlrRbVentas3 + vlrRbDevoluciones3 + vlrRbDinamica3 + vlrRbInventario3 + vlrRbLogistica3 + vlrRbManejo3);
    $("#vlrTotalRbQ1").html(formatNum(vlrTotalRbQ1, '$'));
    $("#vlrTotalRbQ2").html(formatNum(vlrTotalRbQ2, '$'));
    $("#vlrTotalRbQ3").html(formatNum(vlrTotalRbQ3, '$'));

  } else if (TIPO_CONVENIO === "T") {
    $("#pcjRbImpactos1, #pcjRbImpactos2, #pcjRbImpactos3, #pcjRbImpactos4").html(`${REBATE_IMPACTOS}%`);
    vlrRbCompras1 = calcularCumplimiento(detQ1Compra, REBATE_TRIMESTRE);
    vlrRbCompras2 = calcularCumplimiento(detQ2Compra, REBATE_TRIMESTRE);
    vlrRbCompras3 = calcularCumplimiento(detQ3Compra, REBATE_TRIMESTRE);
    vlrRbCompras4 = calcularCumplimiento(detQ4Compra, REBATE_TRIMESTRE);
    $("#vlrRbCompras1").html(formatNum(vlrRbCompras1, '$'));
    $("#vlrRbCompras2").html(formatNum(vlrRbCompras2, '$'));
    $("#vlrRbCompras3").html(formatNum(vlrRbCompras3, '$'));
    $("#vlrRbCompras4").html(formatNum(vlrRbCompras4, '$'));
    
    $("#detQ1ObjImpactos").html(formatNum(Q1_IMPACTOS));
    $("#detQ2ObjImpactos").html(formatNum(Q2_IMPACTOS));
    $("#detQ3ObjImpactos").html(formatNum(Q3_IMPACTOS));
    $("#detQ4ObjImpactos").html(formatNum(Q4_IMPACTOS));
    detQ1Impactos = objetoConsolidado[0].IMPACTOS;
    detQ2Impactos = objetoConsolidado[1].IMPACTOS;
    detQ3Impactos = objetoConsolidado[2].IMPACTOS;
    detQ4Impactos = objetoConsolidado[3].IMPACTOS;
    $("#detQ1Impactos").html(formatNum(detQ1Impactos));
    $("#detQ2Impactos").html(formatNum(detQ2Impactos));
    $("#detQ3Impactos").html(formatNum(detQ3Impactos));
    $("#detQ4Impactos").html(formatNum(detQ4Impactos));
    vlrRbImpactos1 = calcularCumplimiento(detQ1Compra, REBATE_IMPACTOS);
    vlrRbImpactos2 = calcularCumplimiento(detQ2Compra, REBATE_IMPACTOS);
    vlrRbImpactos3 = calcularCumplimiento(detQ3Compra, REBATE_IMPACTOS);
    vlrRbImpactos4 = calcularCumplimiento(detQ4Compra, REBATE_IMPACTOS);
    $("#vlrRbImpactos1").html(formatNum(vlrRbImpactos1, '$'));
    $("#vlrRbImpactos2").html(formatNum(vlrRbImpactos2, '$'));
    $("#vlrRbImpactos3").html(formatNum(vlrRbImpactos3, '$'));
    $("#vlrRbImpactos4").html(formatNum(vlrRbImpactos4, '$'));
    cumpleImpactos1 = calcularPorcentaje(detQ1Impactos, Q1_IMPACTOS);
    cumpleImpactos2 = calcularPorcentaje(detQ2Impactos, Q2_IMPACTOS);
    cumpleImpactos3 = calcularPorcentaje(detQ3Impactos, Q3_IMPACTOS);
    cumpleImpactos4 = calcularPorcentaje(detQ4Impactos, Q4_IMPACTOS);
    $("#cumpleImpactos1").html(cumpleImpactos1 + '%');
    $("#cumpleImpactos2").html(cumpleImpactos2 + '%');
    $("#cumpleImpactos3").html(cumpleImpactos3 + '%');
    $("#cumpleImpactos4").html(cumpleImpactos4 + '%');
    
    $("#pcjRbRotacion1, #pcjRbRotacion2, #pcjRbRotacion3, #pcjRbRotacion4").html(REBATE_ROTACION + '%');
    $("#detQ1ObjRotacion").html(formatNum(Q1_ROTACION, '$'));
    $("#detQ2ObjRotacion").html(formatNum(Q2_ROTACION, '$'));
    $("#detQ3ObjRotacion").html(formatNum(Q3_ROTACION, '$'));
    $("#detQ4ObjRotacion").html(formatNum(Q4_ROTACION, '$'));
    $("#detQ1Ventas").html(formatNum(detQ1Ventas, '$'));
    $("#detQ2Ventas").html(formatNum(detQ2Ventas, '$'));
    $("#detQ3Ventas").html(formatNum(detQ3Ventas, '$'));
    $("#detQ4Ventas").html(formatNum(detQ4Ventas, '$'));
    cumpleVentas1 = calcularPorcentaje(detQ1Ventas, Q1_ROTACION);
    cumpleVentas2 = calcularPorcentaje(detQ2Ventas, Q2_ROTACION);
    cumpleVentas3 = calcularPorcentaje(detQ3Ventas, Q3_ROTACION);
    cumpleVentas4 = calcularPorcentaje(detQ4Ventas, Q4_ROTACION);
    $("#cumpleVentas1").html(cumpleVentas1 + '%');
    $("#cumpleVentas2").html(cumpleVentas2 + '%');
    $("#cumpleVentas3").html(cumpleVentas3 + '%');
    $("#cumpleVentas4").html(cumpleVentas4 + '%');
    vlrRbVentas1 = calcularCumplimiento(detQ1Compra, REBATE_ROTACION);
    vlrRbVentas2 = calcularCumplimiento(detQ2Compra, REBATE_ROTACION);
    vlrRbVentas3 = calcularCumplimiento(detQ3Compra, REBATE_ROTACION);
    vlrRbVentas4 = calcularCumplimiento(detQ4Compra, REBATE_ROTACION);
    $("#vlrRbVentas1").html(formatNum(vlrRbVentas1, '$'));
    $("#vlrRbVentas2").html(formatNum(vlrRbVentas2, '$'));
    $("#vlrRbVentas3").html(formatNum(vlrRbVentas3, '$'));
    $("#vlrRbVentas4").html(formatNum(vlrRbVentas4, '$'));

    $("#pcjRbDevoluciones1, #pcjRbDevoluciones2, #pcjRbDevoluciones3, #pcjRbDevoluciones4").html(`${REBATE_DEVOLUCIONES}%`);
    vlrRbDevoluciones1 = calcularCumplimiento(detQ1Compra, REBATE_DEVOLUCIONES);
    vlrRbDevoluciones2 = calcularCumplimiento(detQ2Compra, REBATE_DEVOLUCIONES);
    vlrRbDevoluciones3 = calcularCumplimiento(detQ3Compra, REBATE_DEVOLUCIONES);
    vlrRbDevoluciones4 = calcularCumplimiento(detQ4Compra, REBATE_DEVOLUCIONES);
    $("#vlrRbDevoluciones1").html(formatNum(vlrRbDevoluciones1, '$'));
    $("#vlrRbDevoluciones2").html(formatNum(vlrRbDevoluciones2, '$'));
    $("#vlrRbDevoluciones3").html(formatNum(vlrRbDevoluciones3, '$'));
    $("#vlrRbDevoluciones4").html(formatNum(vlrRbDevoluciones4, '$'));

    $("#pcjRbDinamica1, #pcjRbDinamica2, #pcjRbDinamica3, #pcjRbDinamica4").html(`${REBATE_DINAMICA}%`);
    vlrRbDinamica1 = calcularCumplimiento(detQ1Compra, REBATE_DINAMICA);
    vlrRbDinamica2 = calcularCumplimiento(detQ2Compra, REBATE_DINAMICA);
    vlrRbDinamica3 = calcularCumplimiento(detQ3Compra, REBATE_DINAMICA);
    vlrRbDinamica4 = calcularCumplimiento(detQ4Compra, REBATE_DINAMICA);
    $("#vlrRbDinamica1").html(formatNum(vlrRbDinamica1, '$'));
    $("#vlrRbDinamica2").html(formatNum(vlrRbDinamica2, '$'));
    $("#vlrRbDinamica3").html(formatNum(vlrRbDinamica3, '$'));
    $("#vlrRbDinamica4").html(formatNum(vlrRbDinamica4, '$'));

    $("#pcjRbInventario1, #pcjRbInventario2, #pcjRbInventario3, #pcjRbInventario4").html(`${REBATE_INVENTARIO}%`);
    vlrRbInventario1 = calcularCumplimiento(detQ1Compra, REBATE_INVENTARIO);
    vlrRbInventario2 = calcularCumplimiento(detQ2Compra, REBATE_INVENTARIO);
    vlrRbInventario3 = calcularCumplimiento(detQ3Compra, REBATE_INVENTARIO);
    vlrRbInventario4 = calcularCumplimiento(detQ4Compra, REBATE_INVENTARIO);
    $("#vlrRbInventario1").html(formatNum(vlrRbInventario1, '$'));
    $("#vlrRbInventario2").html(formatNum(vlrRbInventario2, '$'));
    $("#vlrRbInventario3").html(formatNum(vlrRbInventario3, '$'));
    $("#vlrRbInventario4").html(formatNum(vlrRbInventario4, '$'));

    $("#pcjRbLogistica1, #pcjRbLogistica2, #pcjRbLogistica3, #pcjRbLogistica4").html(`${REBATE_LOGISTICA}%`);
    vlrRbLogistica1 = calcularCumplimiento(detQ1Compra, REBATE_LOGISTICA);
    vlrRbLogistica2 = calcularCumplimiento(detQ2Compra, REBATE_LOGISTICA);
    vlrRbLogistica3 = calcularCumplimiento(detQ3Compra, REBATE_LOGISTICA);
    vlrRbLogistica4 = calcularCumplimiento(detQ4Compra, REBATE_LOGISTICA);
    $("#vlrRbLogistica1").html(formatNum(vlrRbLogistica1, '$'));
    $("#vlrRbLogistica2").html(formatNum(vlrRbLogistica2, '$'));
    $("#vlrRbLogistica3").html(formatNum(vlrRbLogistica3, '$'));
    $("#vlrRbLogistica4").html(formatNum(vlrRbLogistica4, '$'));

    $("#pcjRbManejo1, #pcjRbManejo2, #pcjRbManejo3, #pcjRbManejo4").html(`${REBATE_CODIFICACION}%`);
    vlrRbManejo1 = calcularCumplimiento(detQ1Compra, REBATE_CODIFICACION);
    vlrRbManejo2 = calcularCumplimiento(detQ2Compra, REBATE_CODIFICACION);
    vlrRbManejo3 = calcularCumplimiento(detQ3Compra, REBATE_CODIFICACION);
    vlrRbManejo4 = calcularCumplimiento(detQ4Compra, REBATE_CODIFICACION);
    $("#vlrRbManejo1").html(formatNum(vlrRbManejo1, '$'));
    $("#vlrRbManejo2").html(formatNum(vlrRbManejo2, '$'));
    $("#vlrRbManejo3").html(formatNum(vlrRbManejo3, '$'));
    $("#vlrRbManejo4").html(formatNum(vlrRbManejo4, '$'));

    vlrTotalRbQ1 = (vlrRbCompras1 + vlrRbImpactos1 + vlrRbVentas1 + vlrRbDevoluciones1 + vlrRbDinamica1 + vlrRbInventario1 + vlrRbLogistica1 + vlrRbManejo1);
    vlrTotalRbQ2 = (vlrRbCompras2 + vlrRbImpactos2 + vlrRbVentas2 + vlrRbDevoluciones2 + vlrRbDinamica2 + vlrRbInventario2 + vlrRbLogistica2 + vlrRbManejo2);
    vlrTotalRbQ3 = (vlrRbCompras3 + vlrRbImpactos3 + vlrRbVentas3 + vlrRbDevoluciones3 + vlrRbDinamica3 + vlrRbInventario3 + vlrRbLogistica3 + vlrRbManejo3);
    vlrTotalRbQ4 = (vlrRbCompras4 + vlrRbImpactos4 + vlrRbVentas4 + vlrRbDevoluciones4 + vlrRbDinamica4 + vlrRbInventario4 + vlrRbLogistica4 + vlrRbManejo4);
    $("#vlrTotalRbQ1").html(formatNum(vlrTotalRbQ1, '$'));
    $("#vlrTotalRbQ2").html(formatNum(vlrTotalRbQ2, '$'));
    $("#vlrTotalRbQ3").html(formatNum(vlrTotalRbQ3, '$'));
    $("#vlrTotalRbQ4").html(formatNum(vlrTotalRbQ4, '$'));
  }  

  let detAnioCumplimientoTotal = (vlrTotalRbQ1 + vlrTotalRbQ2 + vlrTotalRbQ3 + vlrTotalRbQ4);
  $("#detAnioCumplimientoTotal").html(formatNum(detAnioCumplimientoTotal, '$'));
  
  const totalesRebates = {
    COMPRAS: {
      Q1: vlrRbCompras1,
      Q2: vlrRbCompras2,
      Q3: vlrRbCompras3,
      Q4: vlrRbCompras4,
      ANUAL: 0
    },
    IMPACTOS: {
      Q1: vlrRbImpactos1,
      Q2: vlrRbImpactos2,
      Q3: vlrRbImpactos3,
      Q4: vlrRbImpactos4,
      ANUAL: 0
    },
    ROTACION: {
      Q1: vlrRbVentas1,
      Q2: vlrRbVentas2,
      Q3: vlrRbVentas3,
      Q4: vlrRbVentas4,
      ANUAL: 0
    },
    MANEJO: {
      Q1: vlrRbManejo1,
      Q2: vlrRbManejo2,
      Q3: vlrRbManejo3,
      Q4: vlrRbManejo4,
      ANUAL: 0
    }
  }

  localStorage.setItem('TotalRebate', JSON.stringify(totalesRebates));
  $("#modalDetConvenio").modal('show');
}
// FUNCIÓN PARA GENERAR LIQUIDACIÓN POR CENTROS
function generarLiquidacion(idConvenio) {
  const objetoFiltrado = arrayGeneral.filter(item => item.ID === idConvenio);
  const convenio = objetoFiltrado[0];
  if (!convenio) return null;

  const tipoConvenio = convenio.TIPO_CONVENIO || "T"; // T=Trimestral, S=Semestral, C=Cuatrimestral, A=Anual
  const rebatesOriginales = JSON.parse(localStorage.getItem("TotalRebate")) || {};

  // 🔹 Clonar rebates originales para no modificar la referencia
  const rebates = JSON.parse(JSON.stringify(rebatesOriginales));

  // 🔹 Convertir los rebates originales (que suelen venir en Q1–Q4) a periodos del tipo de convenio
  Object.keys(rebates).forEach(tipo => {
    const r = rebates[tipo];

    if (tipoConvenio === "S") {
      r["S1"] = (r["Q1"] || 0) + (r["Q2"] || 0);
      r["S2"] = (r["Q3"] || 0) + (r["Q4"] || 0);
    } else if (tipoConvenio === "C") {
      r["C1"] = (r["Q1"] || 0);
      r["C2"] = (r["Q2"] || 0) + (r["Q3"] || 0);
      r["C3"] = (r["Q4"] || 0);
    } else if (tipoConvenio === "A") {
      r["A1"] =
        (r["Q1"] || 0) +
        (r["Q2"] || 0) +
        (r["Q3"] || 0) +
        (r["Q4"] || 0);
    }
  });

  // 🔹 Función para determinar el periodo según el mes y tipo de convenio
  const obtenerPeriodo = (mes, tipo) => {
    const m = Number(mes);

    switch (tipo) {
      case "T": // Trimestres (3 meses)
        return `Q${Math.ceil(m / 3)}`;
      case "S": // Semestres (6 meses)
        return m <= 6 ? "S1" : "S2";
      case "C": // Cuatrimestres (4 meses)
        if (m <= 4) return "C1";
        if (m <= 8) return "C2";
        return "C3";
      case "A": // Año completo
        return "A1";
      default:
        return `Q${Math.ceil(m / 3)}`; // Por defecto trimestral
    }
  };

  // 🔹 Agrupar datos por centro y periodo
  const reporte = {};
  const totalesGenerales = {};

  convenio.DATOS_COMPRAVENTA.forEach(d => {
    const { CENTRO, MES } = d;
    const periodo = obtenerPeriodo(MES, tipoConvenio);

    if (!reporte[CENTRO]) reporte[CENTRO] = { CENTRO, DETALLE: {} };
    if (!reporte[CENTRO].DETALLE[periodo]) {
      reporte[CENTRO].DETALLE[periodo] = { VENTAS: 0, COMPRAS: 0, IMPACTOS: 0 };
    }
    if (!totalesGenerales[periodo]) {
      totalesGenerales[periodo] = { VENTAS: 0, COMPRAS: 0, IMPACTOS: 0 };
    }

    // Acumular datos
    reporte[CENTRO].DETALLE[periodo].VENTAS += parseFloat(d.VAL_NETO_VENTAS || 0);
    reporte[CENTRO].DETALLE[periodo].COMPRAS += parseFloat(d.VAL_NETO_COMPRAS || 0);
    reporte[CENTRO].DETALLE[periodo].IMPACTOS += parseInt(d.IMPACTOS || 0);

    totalesGenerales[periodo].VENTAS += parseFloat(d.VAL_NETO_VENTAS || 0);
    totalesGenerales[periodo].COMPRAS += parseFloat(d.VAL_NETO_COMPRAS || 0);
    totalesGenerales[periodo].IMPACTOS += parseInt(d.IMPACTOS || 0);
  });

  // 🔹 Calcular participación, liquidaciones y totales de rebates
  const totalesRebates = {};

  Object.values(reporte).forEach(r => {
    let totalCentro = 0;

    Object.entries(r.DETALLE).forEach(([periodo, valores]) => {
      valores.REBATES = {};

      Object.entries(rebates).forEach(([tipoRebate, periodos]) => {
        const baseIndicador = tipoRebate.toUpperCase(); // Ej: COMPRAS, IMPACTOS
        const baseTotal = totalesGenerales[periodo]?.[baseIndicador] || 0;
        const baseCentro = valores[baseIndicador] || 0;
        const participacion = baseTotal > 0 ? baseCentro / baseTotal : 0;
        const totalRebatePeriodo = periodos[periodo] || 0;
        const valorLiquidado = totalRebatePeriodo * participacion;

        valores.REBATES[tipoRebate] = {
          PARTICIPACION: (participacion * 100).toFixed(2),
          VALOR_LIQUIDADO_REAL: valorLiquidado,
        };

        // Sumar totales por tipo y periodo
        if (!totalesRebates[tipoRebate]) totalesRebates[tipoRebate] = {};
        if (!totalesRebates[tipoRebate][periodo]) totalesRebates[tipoRebate][periodo] = 0;
        totalesRebates[tipoRebate][periodo] += valorLiquidado;

        totalCentro += valorLiquidado;
      });
    });

    r.TOTAL_REBATES = totalCentro;
  });

  // 🔹 Calcular totales globales de rebates
  Object.keys(totalesRebates).forEach(tipo => {
    totalesRebates[tipo]["TOTAL"] = Object.values(totalesRebates[tipo]).reduce((a, b) => a + b, 0);
  });

  // 🔹 Resultado final
  return {
    tipoConvenio,
    reporte: Object.values(reporte),
    totalesGenerales,
    totalesRebates,
    rebatesOriginales,
  };
}
const tipoPeriodo = {
  "S1": "1° SEMESTRE",
  "S2": "2° SEMESTRE",
  "C1": "1° CUATRIMESTRE",
  "C2": "2° CUATRIMESTRE",
  "C3": "3° CUATRIMESTRE",
  "Q1": "1° TRIMESTRE",
  "Q2": "2° TRIMESTRE",
  "Q3": "3° TRIMESTRE",
  "Q4": "4° TRIMESTRE",
  "A1": "ANUAL",
}
// FUNCIÓN PARA GENERAR EL HTML DEL DETALLE Y LIQUIDACIÓN
function renderReporteLiquidacion(data) {
  const container = document.getElementById("reporteLiquidacion");
  container.innerHTML = "";

  if (!data) {
    container.innerHTML = `<div class="alert alert-warning">No hay datos disponibles.</div>`;
    return;
  }

  const resumen = `
  <div class="row g-3 mb-4 text-center">
    <div class="col-md-4">
      <div class="card border-success shadow-sm">
        <div class="card-body">
          <h6 class="text-muted mb-1">TIPO CONVENIO</h6>
          <h5 class="text-success fw-bold size-14">${tipoConvenio[data.tipoConvenio]}</h5>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card border-primary shadow-sm">
        <div class="card-body">
          <h6 class="text-muted mb-1">TOTAL REBATES</h6>
          <h5 class="text-primary fw-bold">$${formatNum(totalRebatesGlobal(data.totalesRebates))}</h5>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card border-warning shadow-sm">
        <div class="card-body">
          <h6 class="text-muted mb-1">CENTROS</h6>
          <h5 class="fw-bold">${data.reporte.length}</h5>
        </div>
      </div>
    </div>
  </div>`;

  let html = resumen;

  html += `
  <div class="accordion" id="accordionCentros">
    ${data.reporte
    .map((centro, i) => `
    <div class="accordion-item mb-2 border shadow-sm">
      <h2 class="accordion-header" id="heading${i}">
        <button class="accordion-button collapsed bg-light shadow-sm" type="button" data-bs-toggle="collapse"
          data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
          <strong>${centro.CENTRO}</strong> &nbsp;  &nbsp; Total Rebates: <span class="text-success fw-bold ms-1 size-14">$${formatNum(centro.TOTAL_REBATES)}</span>
        </button>
      </h2>
      <div id="collapse${i}" class="accordion-collapse collapse" aria-labelledby="heading${i}"
        data-bs-parent="#accordionCentros">
        <div class="accordion-body p-2">
          ${renderDetalleCentro(centro.DETALLE)}
        </div>
      </div>
    </div>`
    ).join("")}
  </div>`;

  html += `
  <div class="card mt-4 shadow-sm">
    <div class="card-header bag-info text-green fw-bold">TOTALES GENERALES</div>
    <div class="card-body">
      ${renderTotalesGenerales(data.totalesGenerales, data.totalesRebates)}
    </div>
  </div>`;

  container.innerHTML = html;
}

function renderDetalleCentro(detalle) {
  const periodos = Object.entries(detalle);

  let html = `
  <table class="table table-striped table-sm align-middle mb-2">
    <thead class="table-success">
      <tr>
        <th class="bag-info text-green size-15">PERIODO</th>
        <th class="bag-info text-green size-15">VENTAS</th>
        <th class="bag-info text-green size-15">COMPRAS</th>
        <th class="bag-info text-green size-15">IMPACTOS</th>
        <th class="bag-info text-green size-15">REBATE</th>
        <th class="bag-info text-green size-15">PARTICIPACIÓN</th>
        <th class="bag-info text-green size-15">VALOR LIQUIDACIÓN</th>
      </tr>
    </thead>
    <tbody>`;

  periodos.forEach(([periodo, datos]) => {
    const rebates = Object.entries(datos.REBATES || {});
    rebates.forEach(([tipo, info], idx) => {
      html += `
      <tr>
        ${idx === 0 ? `<td rowspan="${rebates.length}" class="fw-bold text-green size-13">${tipoPeriodo[periodo]}</td>` : ""}
        ${idx === 0 ? `<td rowspan="${rebates.length}" class="size-14">$${formatNum(datos.VENTAS)}</td>` : ""}
        ${idx === 0 ? `<td rowspan="${rebates.length}" class="size-14">$${formatNum(datos.COMPRAS)}</td>` : ""}
        ${idx === 0 ? `<td rowspan="${rebates.length}" class="size-14">${formatNum(datos.IMPACTOS)}</td>` : ""}
        <td class="size-13">${tipo}</td>
        <td class="size-14">${info.PARTICIPACION}%</td>
        <td class="size-14">$${formatNum(info.VALOR_LIQUIDADO_REAL)}</td>
      </tr>`;
    });
  });

  html += `</tbody></table>`;
  return html;
}

function renderTotalesGenerales(totales, totalesRebates) {
  let html = `
  <table class="table table-bordered table-sm align-middle">
    <thead class="table-light">
      <tr>
        <th class="bag-info text-green">Periodo</th>
        <th class="bag-info text-green">Ventas</th>
        <th class="bag-info text-green">Compras</th>
        <th class="bag-info text-green">Impactos</th>
        ${Object.keys(totalesRebates).map(tipo => `<th class="bag-info text-green">${tipo}</th>`).join("")}
      </tr>
    </thead>
    <tbody>`;

  Object.entries(totales).forEach(([periodo, valores]) => {
    html += `
    <tr>
      <td class="size-13">${tipoPeriodo[periodo]}</td>
      <td class="size-14">$${formatNum(valores.VENTAS)}</td>
      <td class="size-14">$${formatNum(valores.COMPRAS)}</td>
      <td class="size-14">${formatNum(valores.IMPACTOS)}</td>
      ${Object.keys(totalesRebates)
        .map(tipo => `<td>$${formatNum(totalesRebates[tipo][periodo] || 0)}</td>`)
        .join("")}
    </tr>`;
  });

  html += `
    <tr class="fw-bold">
      <td class="text-green">TOTAL</td>
      <td colspan="3"></td>
      ${Object.keys(totalesRebates)
        .map(tipo => `<td class="text-green">$${formatNum(totalesRebates[tipo].TOTAL || 0)}</td>`)
        .join("")}
    </tr>
  </tbody></table>`;

  return html;
}

function totalRebatesGlobal(totalesRebates) {
  return Object.values(totalesRebates)
    .map(r => r.TOTAL || 0)
    .reduce((a, b) => a + b, 0);
}

function formatNum(num) {
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("es-CO").format(num);
}

const calcularCumplimiento = (valor, pcj) => {
  if (pcj <= 0) return 0;
  return Math.round(valor * (pcj / 100));
}

const calcularPorcentaje = (valor, objetivo) => {
  if (objetivo <= 0) return 0;
  let result = (parseFloat(valor) / parseFloat(objetivo)) * 100;
  return result.toFixed(2);
}
// FUNCIÓN PARA UNIR LAS COMPRAS Y VENTAS POR MES Y AÑO
function unirArraysPorCentro(ventas = [], compras = [], centrosAsociadosRaw = '') {
  // Normalizar el string de centros -> array limpio
  const centrosAsociados = centrosAsociadosRaw
    .split(/[-,;|]/)     // separa por -, , ; o |
    .map(c => c.trim().toUpperCase())
    .filter(Boolean);

  // Si no hay centros, devolvemos vacío
  if (!centrosAsociados.length) return [];

  const consolidado = {};
  const key = (centro, anio, mes) => `${centro}-${anio}-${mes}`;

  // Procesar ventas
  ventas.forEach(v => {
    const centro = String(v.CENTRO || '').trim().toUpperCase();
    if (!centrosAsociados.includes(centro)) return;

    const anio = Number(v.ANIO);
    const mes = Number(v.MES);
    const k = key(centro, anio, mes);

    if (!consolidado[k]) {
      consolidado[k] = {
        CENTRO: centro,
        ANIO: anio,
        MES: mes,
        VAL_NETO_VENTAS: 0,
        VAL_NETO_COMPRAS: 0,
        IMPACTOS: 0
      };
    }

    consolidado[k].VAL_NETO_VENTAS += Number(v.VAL_NETO_VENTAS || 0);
    consolidado[k].IMPACTOS += Number(v.IMPACTOS || 0);
  });

  // Procesar compras
  compras.forEach(c => {
    const centro = String(c.CENTRO || '').trim().toUpperCase();
    if (!centrosAsociados.includes(centro)) return;

    const anio = Number(c.ANIO);
    const mes = Number(c.MES);
    const k = key(centro, anio, mes);

    if (!consolidado[k]) {
      consolidado[k] = {
        CENTRO: centro,
        ANIO: anio,
        MES: mes,
        VAL_NETO_VENTAS: 0,
        VAL_NETO_COMPRAS: 0,
        IMPACTOS: 0
      };
    }

    consolidado[k].VAL_NETO_COMPRAS += Number(c.VAL_NETO_COMPRAS || 0);
  });

  // Pasar a array y ordenar
  return Object.values(consolidado).sort((a, b) => {
    if (a.ANIO === b.ANIO) {
      if (a.MES === b.MES) {
        return a.CENTRO.localeCompare(b.CENTRO);
      }
      return a.MES - b.MES;
    }
    return a.ANIO - b.ANIO;
  });
}
// FUNCIÓN PARA OBTENER NOMBRE DE MES
function obtenerNombreMes(numeroMes) {
  const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

  if (numeroMes >= 1 && numeroMes <= 12) {
    return meses[numeroMes - 1];
  } else {
    return "Mes inválido";
  }
}
// FUNCIÓN PARA SUBIR ARCHIVOS
const subirArchivo = async (nombreArchivo) => {
  try {
    let IdAdjunto = $.trim($("#adjunto").attr('id'));
    let inputFile = document.getElementById(IdAdjunto);
    let file = inputFile.files[0];
    
    if (!file) {
      return false;
    }
    
    if (file.type != 'application/pdf') {
      return false;
    }

    let data = new FormData();
    data.append('archivo', file);
    data.append('op', 'subirConvenio');
    data.append('nombreArchivo', nombreArchivo);

    const response = await $.ajax({
      url: "../models/ConveniosCompras.php",
      type: 'POST',
      contentType: false,
      data: data,
      processData: false,
      cache: false,
    });

    return true;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    return false;
  }
}
// FUNCIÓN PARA OBTENER LA FECHA ACTUAL
function obtenerFechaHoraActual() {
  let fecha = new Date();
  let año = fecha.getFullYear();
  let mes = agregarCeroDelante(fecha.getMonth() + 1);
  let dia = agregarCeroDelante(fecha.getDate());
  let hora = agregarCeroDelante(fecha.getHours());
  let minuto = agregarCeroDelante(fecha.getMinutes());
  let segundo = agregarCeroDelante(fecha.getSeconds());

  return `${año}_${mes}_${dia}_${hora}_${minuto}_${segundo}`;
}
// AGREGAR CERO A NÚMEROS DE UN DIGITO
function agregarCeroDelante(numero) {
  return numero < 10 ? '0' + numero : numero;
}
// FUNCIÓN PARA RESETEO DEL FORMULARIO
function limpiarFormulario() {
  getCentros();
  limpiar();

  const grupoArticulo = document.getElementById("inGrupoArticulo");
  if (grupoArticulo) {
    // Limpiar selecciones del DOM
    Array.from(grupoArticulo.options).forEach(option => {
      option.selected = false;
    });
    // Limpiar Select2
    if ($(grupoArticulo).data('select2')) {
      $(grupoArticulo).val(null).trigger('change');
    }
  }

  document.getElementById("fhInicio").value = "";
  document.getElementById("fhFinal").value = "";
}