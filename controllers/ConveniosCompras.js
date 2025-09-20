var arrayGeneral = new Array();

$(function () {
	$("#floatingButton").hide();
  $("#inSociedad").html(
    `<option value="*">TODAS LAS SOCIEDADES</option>
	 <option value="1000">1000 - MULTIDROGAS</option>
	 <option value="2000">2000 - ROMA</option>`
  );
  $("#inGrupoArticulo").select2({
    placeholder: 'Seleccione uno o varios grupos',
    language: "es"
  });
  gruposArticulos();
  limpiar();
  $(".form-percent").on("input", function (event) {
    var value = $(this).val();
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

});


const LoadImg = async (texto) => {
  const html = '<center>'
    + '<figure><img src="../resources/icons/preloader.gif" class="img-responsive"/></figure>'
    + '<figcaption>' + texto + '</figcaption>'
    + '</center>';
  
  $(".centrado-porcentual").html(html);
  $(".form-control").attr("disabled", true);
  $(".centrado-porcentual").show();
  $("#Bloquear").show();
  
  return Promise.resolve();
}

const UnloadImg = async () => {
  $("#Bloquear").hide();
  $(".centrado-porcentual").hide();
  $(".form-control").attr("disabled", false);
  
  return Promise.resolve();
}

const guardarConvenio = async () => {

  const nombreArchivo = 'convenio_compras_' + obtenerFechaHoraActual() + '.pdf';
  const upload = await subirArchivo(nombreArchivo);

  if (!upload) {
    Swal.fire('Error', 'El archivo PDF del convenio no pudo subirse, verifique e intente nuevamente.', 'error');
    return;
  }

  var org = $("#inSociedad").val();
  var fhInicio = $("#fhInicio").val();
  var fhFinal = $("#fhFinal").val();
  // Validación de la descripción
  var descripcion = $.trim($("#txtDescripcion").val());
  if (descripcion === '') {
    Swal.fire("Oops", "Por favor escriba una descripción.", "error");
    $("#txtDescripcion").focus();
    return false;
  }

  // Validación de campos numéricos
  var camposVacios = false;
  $(".form-percent").each(function () {
    if ($(this).val().trim() === "") {
      $(this).focus();
      camposVacios = true;
      return false; // Salir del bucle si se encuentra un campo vacío
    }
  });
  if (camposVacios) {
    Swal.fire("Oops", "Por favor complete todos los campos.", "error");
    return false;
  }

  // Validación de grupos de artículos seleccionados
  var grupos = $("#inGrupoArticulo").val();
  if (!grupos || grupos.length === 0) {
    Swal.fire("Oops", "No ha seleccionado ningún grupo de artículo.", "error");
    return false;
  }

  const data = {
    link: "../models/ConveniosCompras.php",
    op: "G_CONVENIO",
    org: $("#inSociedad").val(),
    fhInicio: $("#fhInicio").val(),
    fhFinal: $("#fhFinal").val(),
    descripcion,
    grupos,
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
  try {
    const resp = await enviarPeticion(data);
    if (!resp.error) {
      Swal.fire('Excelente', 'Convenio creado correctamente', 'success');
    } else {
      Swal.fire('Error', 'No fue posible crear el convenio, verifique los datos e intente nuevamente.', 'error');
    }
    limpiar();
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
  $("#txtDescripcion").val('');
  $("#inGrupoArticulo").val('');
  $("#adjunto").val('');

}
const gruposArticulos = async () => {
  const data = {
    link: "../models/Eventos.php",
    op: "B_GARTICULOS"
  }
  try {
    const resp = await enviarPeticion(data);
    let options = ``;
    resp.forEach(function (d) {
      options += '<option value="' + d.GRUPO_ARTICULO + '">' + d.GRUPO_ARTICULO + ' - ' + d.DESCRIPCION1 + '</option>'
    })
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
        LoadImg('Eliminando convenio, por favor espere');
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
const buscarConvenios = async () => {
  const data = {
    link: "../models/ConveniosCompras.php",
    op: "S_CONVENIO"
  }
  try {
    LoadImg('Consultando información, por favor espere');
    const resp = await enviarPeticion(data);

    let tablaHtml = '';
    if (resp.length > 0) {
      tablaHtml += `<div class="tabla-estilo-wrapper" style="max-height: 70vh">
                    <table class="tabla-estilo" id="tableResult" border="0" cellpadding="4" cellspacing="0" width="100%">
                        <thead class="sticky-top">
                                    <tr>
                          <th>Id</th>           
                          <th>Organización</th>     
                          <th>Inicio</th>           
                          <th>Fin</th>           
                          <th>Descripción</th>    
                          <th>Notas</th>
                          <th>Consultar</th>
                          <th>Adjunto</th>
                          <th>Eliminar</th>
                          </tr>
                        </thead>
                        <tbody>`;
      arrayGeneral = [];
      resp.forEach(function (d) {

        const datosCompraVenta = unirArrays(d.VENTAS, d.COMPRAS);
        const datosTrimestrales = resumirPorTrimestre(datosCompraVenta);

        var totVentas = 0;
        var totCompras = 0;
        var totImpactos = 0;

        tablaHtml += `<tr>
						<td>${d.ID}</td>
						<td>${d.ORGANIZACION_VENTAS}</td>
						<td>${d.FECHA_INICIO}</td>
						<td>${d.FECHA_FIN}</td>
						<td>${d.DESCRIPCION}</td>
						<td>${d.NOTAS}</td>
						<td align="center"><button class="btn btn-outline-success" onclick="detalleConvenio(${d.ID});"><i class="fa-solid fa-arrow-up-right-from-square"></i> </button></td>
						<td align="center"><button class="btn btn-outline-primary" onclick="adjuntoConvenio('${d.PDF_CONVENIO}');"><i class="fa-solid fa-file-pdf"></i> </button></td>
						<td align="center"><button class="btn btn-outline-danger" onclick="eliminarConvenio(${d.ID});"><i class="fa-solid fa-trash-can"></i> </button></td>
					  </tr>`;
        arrayGeneral.push({
          'ID': d.ID,
          'ORGANIZACION_VENTAS': d.ORGANIZACION_VENTAS,
          'FECHA_INICIO': d.FECHA_INICIO,
          'FECHA_FIN': d.FECHA_FIN,
          'DESCRIPCION': d.DESCRIPCION,
          'REBATE_MES': d.REBATE_MES,
          'REBATE_TRIMESTRE': d.REBATE_TRIMESTRE,
          'REBATE_SEMESTRE': d.REBATE_SEMESTRE,
          'REBATE_ANIO': d.REBATE_ANIO,
          'REBATE_CODIFICACION': d.REBATE_CODIFICACION,
          'REBATE_ROTACION': d.REBATE_ROTACION,
          'REBATE_INFORMACION': d.REBATE_INFORMACION,
          'REBATE_DEVOLUCIONES': d.REBATE_DEVOLUCIONES,
          'REBATE_DINAMICA': d.REBATE_DINAMICA,
          'REBATE_INVENTARIO': d.REBATE_INVENTARIO,
          'REBATE_IMPACTOS': d.REBATE_IMPACTOS,
          'REBATE_LOGISTICA': d.REBATE_LOGISTICA,
          'Q1': d.Q1,
          'Q2': d.Q2,
          'Q3': d.Q3,
          'Q4': d.Q4,
          'OBJETIVO_ANIO': d.OBJETIVO_ANIO,
          'NOTAS': d.NOTAS,
          'DATOS_COMPRAVENTA': datosCompraVenta,
          'DATOS_TRIMESTRALES': datosTrimestrales,
          'Q1_IMPACTOS': d.Q1_IMPACTOS,
          'Q2_IMPACTOS': d.Q2_IMPACTOS,
          'Q3_IMPACTOS': d.Q3_IMPACTOS,
          'Q4_IMPACTOS': d.Q4_IMPACTOS,
          'IMPACTOS_ANIO': d.IMPACTOS_ANIO,
          'Q1_ROTACION': d.Q1_ROTACION,
          'Q2_ROTACION': d.Q2_ROTACION,
          'Q3_ROTACION': d.Q3_ROTACION,
          'Q4_ROTACION': d.Q4_ROTACION,
          'ROTACION_ANIO': d.ROTACION_ANIO ///,
          ///  'IMPACTOS_TRIMESTRE': d.IMPACTOS_TRIMESTRE
        });

      });
      tablaHtml += `</tbody></table></div>`;

    } else {
      tablaHtml = `<div class="alert alert-danger" role="alert">
						<i class="fa-solid fa-circle-info fa-beat"></i> No existen resultados para las condiciones seleccionadas.
					 </div>`;
    }
    $("#dvResult").html(tablaHtml);
    UnloadImg();
  } catch (e) {
    console.log(e);
  }

}

const adjuntoConvenio = (pdf) => {
  var pdfUrl = "../../Documentos/ConveniosCompras/" + pdf;
  var embedElement = $('<embed>', {
    src: pdfUrl,
    frameborder: 0,
    width: "100%",
    height: "400px"
  });
  $("#ContainerPDF").empty().append(embedElement);
  $("#ModalAdjunto").modal('show');
}

const detalleConvenio = (id) => {
  var objetoFiltrado = arrayGeneral.filter(function (objeto) {
    return objeto.ID === id;
  });


  $("#titulo-convenio").text(objetoFiltrado[0].DESCRIPCION);
  //-----------------------------------
  $("#detQ1Obj").html(formatNum(objetoFiltrado[0].Q1, '$'));
  $("#detQ2Obj").html(formatNum(objetoFiltrado[0].Q2, '$'));
  $("#detQ3Obj").html(formatNum(objetoFiltrado[0].Q3, '$'));
  $("#detQ4Obj").html(formatNum(objetoFiltrado[0].Q4, '$'));

  let valoresObjetivoTrimestre = [];

  valoresObjetivoTrimestre.push(
    objetoFiltrado[0].Q1,
    objetoFiltrado[0].Q2,
    objetoFiltrado[0].Q3,
    objetoFiltrado[0].Q4
  );

  let valoresObjetivosVentasTrimestre = [];
  valoresObjetivosVentasTrimestre.push(
    objetoFiltrado[0].Q1_ROTACION,
    objetoFiltrado[0].Q2_ROTACION,
    objetoFiltrado[0].Q3_ROTACION,
    objetoFiltrado[0].Q4_ROTACION
  );

  let sumaValoresQC = valoresObjetivoTrimestre.reduce((total, valorQ) => total + parseFloat(valorQ), 0);
  let sumaValoresQV = valoresObjetivosVentasTrimestre.reduce((total, valorQ) => total + parseFloat(valorQ), 0);
  $("#detAnioObj").html(formatNum(sumaValoresQC, '$'));
  $("#detAnioObjVentas").html(formatNum(sumaValoresQV, '$'));


  let detQ1Compra = 0;
  let detQ2Compra = 0;
  let detQ3Compra = 0;
  let detQ4Compra = 0;

  let detQ1Ventas = 0;
  let detQ2Ventas = 0;
  let detQ3Ventas = 0;
  let detQ4Ventas = 0;

  let detQ1Impactos = 0;
  let detQ2Impactos = 0;
  let detQ3Impactos = 0;
  let detQ4Impactos = 0;

  let valoresComprasTrimestre = [];
  let valoresVentasTrimestre = [];
  let valoresImpactosTrimestre = [];
  let sumaComprasQ = 0;
  let sumaVentasQ = 0;

  objetoFiltrado[0].DATOS_TRIMESTRALES.forEach(function (d) {
    switch (d.TRIMESTRE) {
      case 1:
        detQ1Compra = d.VAL_NETO_COMPRAS;
        detQ1Ventas = d.VAL_NETO_VENTAS;
        detQ1Impactos = d.IMPACTOS;
        break;
      case 2:
        detQ2Compra = d.VAL_NETO_COMPRAS;
        detQ2Ventas = d.VAL_NETO_VENTAS;
        detQ2Impactos = d.IMPACTOS;
        break;
      case 3:
        detQ3Compra = d.VAL_NETO_COMPRAS;
        detQ3Ventas = d.VAL_NETO_VENTAS;
        detQ3Impactos = d.IMPACTOS;
        break;
      case 4:
        detQ4Compra = d.VAL_NETO_COMPRAS;
        detQ4Ventas = d.VAL_NETO_VENTAS;
        detQ4Impactos = d.IMPACTOS;
        break;
    }
    valoresComprasTrimestre.push(d.VAL_NETO_COMPRAS);
    valoresVentasTrimestre.push(d.VAL_NETO_VENTAS);
    valoresImpactosTrimestre.push(d.IMPACTOS);

    sumaComprasQ += parseFloat(d.VAL_NETO_COMPRAS);
    sumaVentasQ += parseFloat(d.VAL_NETO_VENTAS);
  });

  let detAnioCumpleCompras = calcularPorcentaje(sumaComprasQ, sumaValoresQC);
  $("#detAnioCumpleCompras").html(detAnioCumpleCompras + '%');


  let detAnioCumpleVentas = calcularPorcentaje(sumaVentasQ, sumaValoresQV);
  $("#detAnioCumpleVentas").html(detAnioCumpleVentas + '%');


  $("#detQ1Compra").html(formatNum(detQ1Compra, '$'));
  $("#detQ2Compra").html(formatNum(detQ2Compra, '$'));
  $("#detQ3Compra").html(formatNum(detQ3Compra, '$'));
  $("#detQ4Compra").html(formatNum(detQ4Compra, '$'));
  $("#detAnioCompra").html(formatNum(sumaComprasQ, '$'));
  $("#detAnioVentas").html(formatNum(sumaVentasQ, '$'));

  //-----------------------------------------------
  let detQ1Cumple = calcularPorcentaje(detQ1Compra, objetoFiltrado[0].Q1);
  let detQ2Cumple = calcularPorcentaje(detQ2Compra, objetoFiltrado[0].Q2);
  let detQ3Cumple = calcularPorcentaje(detQ3Compra, objetoFiltrado[0].Q3);
  let detQ4Cumple = calcularPorcentaje(detQ4Compra, objetoFiltrado[0].Q4);


  $("#detQ1Cumple").html(detQ1Cumple + '%');
  $("#detQ2Cumple").html(detQ2Cumple + '%');
  $("#detQ3Cumple").html(detQ3Cumple + '%');
  $("#detQ4Cumple").html(detQ4Cumple + '%');


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
        categories: ['Q1', 'Q2', 'Q3', 'Q4'],
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
            description: 'Trimestres'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Ventas trimestrales',
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
            color: '#055160'
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
        data: valoresObjetivoTrimestre,
        // Color basado en #055160 con transparencia
        color: 'rgba(5, 81, 96, 0.7)',
        // Borde un poco más oscuro
        borderColor: '#04414d'
    },
    {
        name: 'Compras',
        data: valoresComprasTrimestre,
        // Color intermedio entre #cff4fc y #055160
        color: 'rgba(49, 151, 174, 0.7)',
        borderColor: '#2d8da5'
    },
    {
        name: 'Ventas',
        data: valoresVentasTrimestre,
        // Color basado en #cff4fc con menos transparencia
        color: 'rgba(135, 216, 240, 0.8)',
        borderColor: '#70c6e3'
    }],
    credits: {
        enabled: false
    }
});
  //----Datos mensuales.
  var totVentas = 0;
  var totCompras = 0;
  var totImpactos = 0;

  let tablaHtml = `<div class="tabla-estilo-wrapper" style="max-height: 70vh">
					  <table class="tabla-estilo" width="100%">
						<thead>
						  <tr>
							<th>CONCEPTO</th>
							${objetoFiltrado[0].DATOS_COMPRAVENTA.map(d => `<th>${obtenerNombreMes(d.MES)}</th>`).join('')}
						  </tr>
						</thead>
						<tbody>`;
  // Crear filas para cada tipo de dato (Compras, Rotación e Impactos)
  ['Compras', 'Rotación', 'Impactos'].forEach(tipo => {
    tablaHtml += `
						<tr>
						  <td>${tipo}</td>
						  ${objetoFiltrado[0].DATOS_COMPRAVENTA.map(d => `<td>${tipo === 'Compras' ? formatNum(parseFloat(d.VAL_NETO_COMPRAS), '$') : tipo === 'Rotación' ? formatNum(parseFloat(d.VAL_NETO_VENTAS), '$') : formatNum(d.IMPACTOS)}</td>`).join('')}
						</tr>`;
  });

  // Cerrar la estructura de la tabla
  tablaHtml += `
						</tbody>
					  </table>
					</div>`;

  objetoFiltrado[0].DATOS_COMPRAVENTA.forEach(function (d, index) {
    // Si el índice es divisible por 3, comienza una nueva fila
    /*  if (index % 3 === 0) {
      tablaHtml += '<div class="row mb-4">';
    }

    tablaHtml += `<div class="col-md-4">
				<div class="card">
				 <div class="card-header">${obtenerNombreMes(d.MES)}</div>
				  <ul class="list-group list-group-flush">
					<li class="list-group-item">
						<div class="row">
							<div class="col-sm-6"><h3 class="h3 mb-0 me-4">${formatNum(parseFloat(d.VAL_NETO_COMPRAS),'$')}</h3></div>
							<div class="col-sm-3"><h4>Compras</h4><p class="mb-0">Compras mensuales</p></div>
							<div class="col-sm-3 text-center"><i class="fa-brands fa-shopify text-success fa-3x"></i></div>
						</div>
 					</li>
					<li class="list-group-item">
						<div class="row">
							<div class="col-sm-6"><h3 class="h3 mb-0 me-4">${formatNum(parseFloat(d.VAL_NETO_VENTAS),'$')}</h3></div>
							<div class="col-sm-3"><h4>Rotación</h4><p class="mb-0">Ventas mensuales</p></div>
							<div class="col-sm-3 text-center"><i class="fa-solid fa-chart-line text-danger fa-3x"></i></div>
						</div>
                    </li>
					<li class="list-group-item">
					    <div class="row">
							<div class="col-sm-6"><h3 class="h3 mb-0 me-4">${formatNum(d.IMPACTOS)}</h3></div>
							<div class="col-sm-3"><h4>Impactos</h4><p class="mb-0">Impactos a clientes</p></div>
							<div class="col-sm-3 text-center"><i class="fa-solid fa-person-circle-check text-warning fa-3x"></i></div>
						</div>
					</li>
				  </ul>
				</div>
				</div>`;*/
    totVentas += parseFloat(d.VAL_NETO_VENTAS);
    totCompras += parseFloat(d.VAL_NETO_COMPRAS);
    totImpactos += parseFloat(d.IMPACTOS)

    // Si el índice es el último elemento o el índice es divisible por 3 menos 1, cierra la fila
    /*if ((index + 1) % 3 === 0 || index === objetoFiltrado[0].DATOS_COMPRAVENTA.length - 1) {
      tablaHtml += '</div>';
    }*/
  });

  //REBATE POR COMPRAS TRIMESTRALES
  $("#pcjRbCompras1,#pcjRbCompras2,#pcjRbCompras3,#pcjRbCompras4").html(objetoFiltrado[0].REBATE_TRIMESTRE + '%');
  let vlrRbCompras1 = calcularCumplimiento(detQ1Compra, objetoFiltrado[0].REBATE_TRIMESTRE);
  let vlrRbCompras2 = calcularCumplimiento(detQ2Compra, objetoFiltrado[0].REBATE_TRIMESTRE);
  let vlrRbCompras3 = calcularCumplimiento(detQ3Compra, objetoFiltrado[0].REBATE_TRIMESTRE);
  let vlrRbCompras4 = calcularCumplimiento(detQ4Compra, objetoFiltrado[0].REBATE_TRIMESTRE);
  $("#vlrRbCompras1").html(formatNum(vlrRbCompras1, '$'));
  $("#vlrRbCompras2").html(formatNum(vlrRbCompras2, '$'));
  $("#vlrRbCompras3").html(formatNum(vlrRbCompras3, '$'));
  $("#vlrRbCompras4").html(formatNum(vlrRbCompras4, '$'));


  //REBATE POR IMPACTOS TRIMESTRALES
  $("#pcjRbImpactos1,#pcjRbImpactos2,#pcjRbImpactos3,#pcjRbImpactos4").html(objetoFiltrado[0].REBATE_IMPACTOS + '%');
  $("#detQ1ObjImpactos").html(formatNum(objetoFiltrado[0].Q1_IMPACTOS));
  $("#detQ2ObjImpactos").html(formatNum(objetoFiltrado[0].Q2_IMPACTOS));
  $("#detQ3ObjImpactos").html(formatNum(objetoFiltrado[0].Q3_IMPACTOS));
  $("#detQ4ObjImpactos").html(formatNum(objetoFiltrado[0].Q4_IMPACTOS));
  /*objetoFiltrado[0].IMPACTOS_TRIMESTRE.forEach(function (d, i) {
    switch (i) {
      case 0:
        detQ1Impactos = d.IMPACTOS;
        break;
      case 1:
        detQ2Impactos = d.IMPACTOS;
        break;
      case 2:
        detQ3Impactos = d.IMPACTOS;
        break;
      case 3:
        detQ4Impactos = d.IMPACTOS;
        break;
    }
  })*/
  $("#detQ1Impactos").html(formatNum(detQ1Impactos));
  $("#detQ2Impactos").html(formatNum(detQ2Impactos));
  $("#detQ3Impactos").html(formatNum(detQ3Impactos));
  $("#detQ4Impactos").html(formatNum(detQ4Impactos));

  let vlrRbImpactos1 = calcularCumplimiento(detQ1Compra, objetoFiltrado[0].REBATE_IMPACTOS);
  let vlrRbImpactos2 = calcularCumplimiento(detQ2Compra, objetoFiltrado[0].REBATE_IMPACTOS);
  let vlrRbImpactos3 = calcularCumplimiento(detQ3Compra, objetoFiltrado[0].REBATE_IMPACTOS);
  let vlrRbImpactos4 = calcularCumplimiento(detQ4Compra, objetoFiltrado[0].REBATE_IMPACTOS);
  $("#vlrRbImpactos1").html(formatNum(vlrRbImpactos1, '$'));
  $("#vlrRbImpactos2").html(formatNum(vlrRbImpactos2, '$'));
  $("#vlrRbImpactos3").html(formatNum(vlrRbImpactos3, '$'));
  $("#vlrRbImpactos4").html(formatNum(vlrRbImpactos4, '$'));

  let cumpleImpactos1 = calcularPorcentaje(detQ1Impactos, objetoFiltrado[0].Q1_IMPACTOS);
  let cumpleImpactos2 = calcularPorcentaje(detQ2Impactos, objetoFiltrado[0].Q2_IMPACTOS);
  let cumpleImpactos3 = calcularPorcentaje(detQ3Impactos, objetoFiltrado[0].Q3_IMPACTOS);
  let cumpleImpactos4 = calcularPorcentaje(detQ4Impactos, objetoFiltrado[0].Q4_IMPACTOS);
  $("#cumpleImpactos1").html(cumpleImpactos1 + '%');
  $("#cumpleImpactos2").html(cumpleImpactos2 + '%');
  $("#cumpleImpactos3").html(cumpleImpactos3 + '%');
  $("#cumpleImpactos4").html(cumpleImpactos4 + '%');
  //REBATE POR ROTACION TRIMESTRALES
  $("#pcjRbRotacion1,#pcjRbRotacion2,#pcjRbRotacion3,#pcjRbRotacion4").html(objetoFiltrado[0].REBATE_ROTACION + '%');
  $("#detQ1ObjRotacion").html(formatNum(objetoFiltrado[0].Q1_ROTACION, '$'));
  $("#detQ2ObjRotacion").html(formatNum(objetoFiltrado[0].Q2_ROTACION, '$'));
  $("#detQ3ObjRotacion").html(formatNum(objetoFiltrado[0].Q3_ROTACION, '$'));
  $("#detQ4ObjRotacion").html(formatNum(objetoFiltrado[0].Q4_ROTACION, '$'));

  $("#detQ1Ventas").html(formatNum(detQ1Ventas, '$'));
  $("#detQ2Ventas").html(formatNum(detQ2Ventas, '$'));
  $("#detQ3Ventas").html(formatNum(detQ3Ventas, '$'));
  $("#detQ4Ventas").html(formatNum(detQ4Ventas, '$'));

  let cumpleVentas1 = calcularPorcentaje(detQ1Ventas, objetoFiltrado[0].Q1_ROTACION);
  let cumpleVentas2 = calcularPorcentaje(detQ2Ventas, objetoFiltrado[0].Q2_ROTACION);
  let cumpleVentas3 = calcularPorcentaje(detQ3Ventas, objetoFiltrado[0].Q3_ROTACION);
  let cumpleVentas4 = calcularPorcentaje(detQ4Ventas, objetoFiltrado[0].Q4_ROTACION);
  $("#cumpleVentas1").html(cumpleVentas1 + '%');
  $("#cumpleVentas2").html(cumpleVentas2 + '%');
  $("#cumpleVentas3").html(cumpleVentas3 + '%');
  $("#cumpleVentas4").html(cumpleVentas4 + '%');

  let vlrRbVentas1 = calcularCumplimiento(detQ1Compra, objetoFiltrado[0].REBATE_ROTACION);
  let vlrRbVentas2 = calcularCumplimiento(detQ2Compra, objetoFiltrado[0].REBATE_ROTACION);
  let vlrRbVentas3 = calcularCumplimiento(detQ3Compra, objetoFiltrado[0].REBATE_ROTACION);
  let vlrRbVentas4 = calcularCumplimiento(detQ4Compra, objetoFiltrado[0].REBATE_ROTACION);
  $("#vlrRbVentas1").html(formatNum(vlrRbVentas1, '$'));
  $("#vlrRbVentas2").html(formatNum(vlrRbVentas2, '$'));
  $("#vlrRbVentas3").html(formatNum(vlrRbVentas3, '$'));
  $("#vlrRbVentas4").html(formatNum(vlrRbVentas4, '$'));

  //REBATE NO DEVOLUCIONES
  $("#pcjRbDevoluciones1,#pcjRbDevoluciones2,#pcjRbDevoluciones3,#pcjRbDevoluciones4").html(objetoFiltrado[0].REBATE_DEVOLUCIONES + '%');
  let vlrRbDevoluciones1 = calcularCumplimiento(detQ1Compra, objetoFiltrado[0].REBATE_DEVOLUCIONES);
  let vlrRbDevoluciones2 = calcularCumplimiento(detQ2Compra, objetoFiltrado[0].REBATE_DEVOLUCIONES);
  let vlrRbDevoluciones3 = calcularCumplimiento(detQ3Compra, objetoFiltrado[0].REBATE_DEVOLUCIONES);
  let vlrRbDevoluciones4 = calcularCumplimiento(detQ4Compra, objetoFiltrado[0].REBATE_DEVOLUCIONES);
  $("#vlrRbDevoluciones1").html(formatNum(vlrRbDevoluciones1, '$'));
  $("#vlrRbDevoluciones2").html(formatNum(vlrRbDevoluciones2, '$'));
  $("#vlrRbDevoluciones3").html(formatNum(vlrRbDevoluciones3, '$'));
  $("#vlrRbDevoluciones4").html(formatNum(vlrRbDevoluciones4, '$'));

  //REBATE POR DINAMICA COMERCIAL
  $("#pcjRbDinamica1,#pcjRbDinamica2,#pcjRbDinamica3,#pcjRbDinamica4").html(objetoFiltrado[0].REBATE_DINAMICA + '%');
  let vlrRbDinamica1 = calcularCumplimiento(detQ1Compra, objetoFiltrado[0].REBATE_DINAMICA);
  let vlrRbDinamica2 = calcularCumplimiento(detQ2Compra, objetoFiltrado[0].REBATE_DINAMICA);
  let vlrRbDinamica3 = calcularCumplimiento(detQ3Compra, objetoFiltrado[0].REBATE_DINAMICA);
  let vlrRbDinamica4 = calcularCumplimiento(detQ4Compra, objetoFiltrado[0].REBATE_DINAMICA);
  $("#vlrRbDinamica1").html(formatNum(vlrRbDinamica1, '$'));
  $("#vlrRbDinamica2").html(formatNum(vlrRbDinamica2, '$'));
  $("#vlrRbDinamica3").html(formatNum(vlrRbDinamica3, '$'));
  $("#vlrRbDinamica4").html(formatNum(vlrRbDinamica4, '$'));

  //REBATE POR MANEJO DIAS INVENTARIO	
  $("#pcjRbInventario1,#pcjRbInventario2,#pcjRbInventario3,#pcjRbInventario4").html(objetoFiltrado[0].REBATE_INVENTARIO + '%');
  let vlrRbInventario1 = calcularCumplimiento(detQ1Compra, objetoFiltrado[0].REBATE_INVENTARIO);
  let vlrRbInventario2 = calcularCumplimiento(detQ2Compra, objetoFiltrado[0].REBATE_INVENTARIO);
  let vlrRbInventario3 = calcularCumplimiento(detQ3Compra, objetoFiltrado[0].REBATE_INVENTARIO);
  let vlrRbInventario4 = calcularCumplimiento(detQ4Compra, objetoFiltrado[0].REBATE_INVENTARIO);
  $("#vlrRbInventario1").html(formatNum(vlrRbInventario1, '$'));
  $("#vlrRbInventario2").html(formatNum(vlrRbInventario2, '$'));
  $("#vlrRbInventario3").html(formatNum(vlrRbInventario3, '$'));
  $("#vlrRbInventario4").html(formatNum(vlrRbInventario4, '$'));


  //REBATE POR LOGISTICA	
  $("#pcjRbLogistica1,#pcjRbLogistica2,#pcjRbLogistica3,#pcjRbLogistica4").html(objetoFiltrado[0].REBATE_LOGISTICA + '%');
  let vlrRbLogistica1 = calcularCumplimiento(detQ1Compra, objetoFiltrado[0].REBATE_LOGISTICA);
  let vlrRbLogistica2 = calcularCumplimiento(detQ2Compra, objetoFiltrado[0].REBATE_LOGISTICA);
  let vlrRbLogistica3 = calcularCumplimiento(detQ3Compra, objetoFiltrado[0].REBATE_LOGISTICA);
  let vlrRbLogistica4 = calcularCumplimiento(detQ4Compra, objetoFiltrado[0].REBATE_LOGISTICA);
  $("#vlrRbLogistica1").html(formatNum(vlrRbLogistica1, '$'));
  $("#vlrRbLogistica2").html(formatNum(vlrRbLogistica2, '$'));
  $("#vlrRbLogistica3").html(formatNum(vlrRbLogistica3, '$'));
  $("#vlrRbLogistica4").html(formatNum(vlrRbLogistica4, '$'));

  //REBATE POR MANEJO DE LINEA - CODIFICACION
  $("#pcjRbManejo1,#pcjRbManejo2,#pcjRbManejo3,#pcjRbManejo4").html(objetoFiltrado[0].REBATE_CODIFICACION + '%');
  let vlrRbManejo1 = calcularCumplimiento(detQ1Compra, objetoFiltrado[0].REBATE_CODIFICACION);
  let vlrRbManejo2 = calcularCumplimiento(detQ2Compra, objetoFiltrado[0].REBATE_CODIFICACION);
  let vlrRbManejo3 = calcularCumplimiento(detQ3Compra, objetoFiltrado[0].REBATE_CODIFICACION);
  let vlrRbManejo4 = calcularCumplimiento(detQ4Compra, objetoFiltrado[0].REBATE_CODIFICACION);
  $("#vlrRbManejo1").html(formatNum(vlrRbManejo1, '$'));
  $("#vlrRbManejo2").html(formatNum(vlrRbManejo2, '$'));
  $("#vlrRbManejo3").html(formatNum(vlrRbManejo3, '$'));
  $("#vlrRbManejo4").html(formatNum(vlrRbManejo4, '$'));


  //VALOR TOTAL DEL REBATE TRIMESTRAL - SUMA DE TODAS LAS CONDICIONES.	
  let vlrTotalRbQ1 = (vlrRbCompras1 + vlrRbImpactos1 + vlrRbVentas1 + vlrRbDevoluciones1 + vlrRbDinamica1 + vlrRbInventario1 + vlrRbLogistica1 + vlrRbManejo1);
  let vlrTotalRbQ2 = (vlrRbCompras2 + vlrRbImpactos2 + vlrRbVentas2 + vlrRbDevoluciones2 + vlrRbDinamica2 + vlrRbInventario2 + vlrRbLogistica2 + vlrRbManejo2);
  let vlrTotalRbQ3 = (vlrRbCompras3 + vlrRbImpactos3 + vlrRbVentas3 + vlrRbDevoluciones3 + vlrRbDinamica3 + vlrRbInventario3 + vlrRbLogistica3 + vlrRbManejo3);
  let vlrTotalRbQ4 = (vlrRbCompras4 + vlrRbImpactos4 + vlrRbVentas4 + vlrRbDevoluciones4 + vlrRbDinamica4 + vlrRbInventario4 + vlrRbLogistica4 + vlrRbManejo4);
  $("#vlrTotalRbQ1").html(formatNum(vlrTotalRbQ1, '$'));
  $("#vlrTotalRbQ2").html(formatNum(vlrTotalRbQ2, '$'));
  $("#vlrTotalRbQ3").html(formatNum(vlrTotalRbQ3, '$'));
  $("#vlrTotalRbQ4").html(formatNum(vlrTotalRbQ4, '$'));

  //CUMPLIMIENTO TOTAL AÑO
  let detAnioCumplimientoTotal = (vlrTotalRbQ1 + vlrTotalRbQ2 + vlrTotalRbQ3 + vlrTotalRbQ4)
  $("#detAnioCumplimientoTotal").html(formatNum(detAnioCumplimientoTotal, '$'));

  $("#dvComprasMensuales").html(tablaHtml);
  $("#modalDetConvenio").modal('show');
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

function unirArrays(array1, array2) {
  const result = [];

  array1.forEach(item1 => {
    array2.forEach(item2 => {
      if (item1.ANIO === item2.ANIO && item1.MES === item2.MES) {
        result.push({
          ...item1,
          ...item2
        });
      }
    });
  });
  // Ordenar el resultado por ANIO y MES
  result.sort((a, b) => {
    if (a.ANIO === b.ANIO) {
      return a.MES - b.MES;
    }
    return a.ANIO - b.ANIO;
  });
  return result;
}

function resumirPorTrimestre(array) {
  const trimestres = {};

  array.forEach(item => {
    const trimestre = Math.ceil(Number(item.MES) / 3); // Calcular el trimestre
    const clave = `${item.ANIO}-T${trimestre}`; // Clave única para el trimestre

    if (!trimestres[clave]) {
      trimestres[clave] = {
        ANIO: item.ANIO,
        TRIMESTRE: trimestre,
        VAL_NETO_VENTAS: 0,
        IMPACTOS: 0,
        VAL_NETO_COMPRAS: 0
      };
    }

    trimestres[clave].VAL_NETO_VENTAS += parseFloat(item.VAL_NETO_VENTAS);
    trimestres[clave].IMPACTOS += parseInt(item.IMPACTOS);
    trimestres[clave].VAL_NETO_COMPRAS += parseFloat(item.VAL_NETO_COMPRAS);
  });

  // Convertir el objeto de trimestres en un array
  const resultado = Object.values(trimestres);

  return resultado;
}

function obtenerNombreMes(numeroMes) {
  const meses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];

  if (numeroMes >= 1 && numeroMes <= 12) {
    return meses[numeroMes - 1];
  } else {
    return "Mes inválido";
  }
}


const subirArchivo = async (nombreArchivo) => {
  try {
    var IdAdjunto = $.trim($("#adjunto").attr('id'));
    var inputFile = document.getElementById(IdAdjunto);
    var file = inputFile.files[0];
    // Verificar si se ha seleccionado un archivo
    if (!file) {
      return false;
    }
    // Verificar si el archivo es de tipo PDF
    if (file.type != 'application/pdf') {
      return false;
    }
    var data = new FormData();
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


function obtenerFechaHoraActual() {
  var fecha = new Date();
  var año = fecha.getFullYear();
  var mes = agregarCeroDelante(fecha.getMonth() + 1);
  var dia = agregarCeroDelante(fecha.getDate());
  var hora = agregarCeroDelante(fecha.getHours());
  var minuto = agregarCeroDelante(fecha.getMinutes());
  var segundo = agregarCeroDelante(fecha.getSeconds());

  return año + '_' + mes + '_' + dia + '_' + hora + '_' + minuto + '_' + segundo;
}

function agregarCeroDelante(numero) {
  return numero < 10 ? '0' + numero : numero;
}

function limpiarFormulario() {
  // Inputs de texto, número, fecha
  document.querySelectorAll("input[type='text'], input[type='number'], input[type='date']").forEach(el => {
    el.value = "";
  });

  // Textareas
  document.querySelectorAll("textarea").forEach(el => {
    el.value = "";
  });

  // Selects simples
  document.querySelectorAll("select:not([multiple])").forEach(el => {
    el.selectedIndex = -1; // deja sin selección
    // Si es Select2, actualizarlo
    if ($(el).data('select2')) {
      $(el).trigger('change.select2');
    }
  });

  // Selects múltiples (como inGrupoArticulo) 
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

  // Inputs file
  document.querySelectorAll("input[type='file']").forEach(el => {
    el.value = "";
  });

  // Si tienes campos específicos como fechas readonly
  const fhInicio = document.getElementById("fhInicio");
  const fhFinal = document.getElementById("fhFinal");
  if (fhInicio) fhInicio.value = "";
  if (fhFinal) fhFinal.value = "";

  // Notificación visual opcional
  if (typeof Swal !== "undefined") {
    Swal.fire({
      icon: 'info',
      title: 'Formulario limpio',
      text: 'Todos los campos han sido reiniciados',
      timer: 1500,
      showConfirmButton: false
    });
  }
}