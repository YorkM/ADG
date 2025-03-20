let ArrCli = new Array();
let ArrProv = new Array();
let Perm_Autorizar = '';
let Perm_Visualizar = '';
let Perm_Aprobar = '';
let Perm_AprobarPedido = '';
//Document ready
$(function () {
  //Años, meses y oficinas.
  var option = OficinasVentas('S');
  $("#Oficinas").html(option);
  $('#FhInicial, #FhFinal').datepicker({
    autoclose: true,
    multidate: false,
    changeMonth: true,
    changeYear: true,
    useCurrent: true,
    dateFormat: 'yy-mm-dd'
  }).datepicker("setDate", new Date());

  $("#Oficinas, #FhInicial, #FhFinal, #Estado, #tnegocio").change(function () {
    ConsultarSolicitudes();
  });
  //Carga de permisos 
  Permisos();
  //Carga de clientes y proveedores
  LoadArrayCli();
  LoadArrayProv();
  //Limpieza
  Limpiar();
  $("#SlcGrupoArticulo").select2({
    placeholder: 'Seleccione uno o varios grupos',
    language: "es"
  });
  $("#SlcTipoNegocio").change(function () {
    GruposArticulos();
    switch ($(this).val()) {
      case 'P':
        {
          $("#SlcGrupoArticulo").select2({
            maximumSelectionLength: 1,
            language: "es"
          });
        }
        break;
      default:
        {
          $("#SlcGrupoArticulo").select2({
            maximumSelectionLength: 1000,
            language: "es"
          });
        }
        break;
    }

  });
  //Fechas para campos de notas
  $("#fhContabilizacion,#fhDocumento,#fhPagoProv").datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dateFormat: 'dd-mm-yy',
    width: 100,
    heigth: 100
  });

  //Autocompletar clientes	
  $('#txtCliente').autocomplete({
    source: function (request, response) {
      Arr_cli = ArrCli;
      valor = $.trim($("#txtCliente").val());
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
    search: function () {},
    open: function (event, ui) {},
    select: function (event, ui) {
      $("#txtCodigo").val(ui.item.codigo_sap);
      $("#txtLista").val(ui.item.lista);
      $("#txtOficina").val(ui.item.bodega);

    }
  });
  //Autocompletar Proveedores
  $('#txtCodigoProv').autocomplete({
    source: function (request, response) {
      Arr_prov = ArrProv;
      valor = $.trim($("#txtCodigoProv").val());

      if (validarSiNumero(valor) == 1) {
        Arr_prov = FiltrarProv(valor, Arr_prov, 1);
      } else {
        div_cadena = valor;
        div_cadena = div_cadena.split(" ");
        for (var x = 0; x < div_cadena.length; x++) {
          expr = $.trim(div_cadena[x]);
          Arr_prov = FiltrarProv(expr, Arr_prov, 2);
        }
      }
      response(Arr_prov.slice(0, 10));
    },
    maxResults: 10,
    minLength: 3,
    search: function () {},
    open: function (event, ui) {},
    select: function (event, ui) {
      ui.item.value = ui.item.codigo_sap;
      $("#txtCodigoProv").val(ui.item.codigo_sap);


    }
  });
  //Calculo de valor de descuento
  $("#txtVlrNegocio, #txtDescuento").keyup(function () {
    let vlrNegocio = parseFloat($("#txtVlrNegocio").val());
    let pcjDescuento = parseFloat($("#txtDescuento").val());
    let vlrDescuento = 0;

    if (pcjDescuento > 0 && vlrNegocio > 0) {
      vlrDescuento = Math.round(vlrNegocio * (pcjDescuento / 100));
      $("#txtVlrDescuento").val(formatNum(vlrDescuento, '$'));
    } else {
      $("#txtVlrDescuento").val('');
    }

  });

  //Calculo de recurso
  $("#SegPresupuesto").keyup(function () {
    let valor = unformatNum($(this).val());
    $("#SegPresupuesto").val(formatNum(valor, '$'));
  });
  $("#btnGuardarRecurso").click(function () {
    let valor = unformatNum($("#SegPresupuesto").val());
    if (valor > 0) {
      AsignarRecurso(valor)
    } else {
      Swal.fire('Oops', 'El valor asignado debe ser mayor a cero (0)', 'warning');
    }
  })
  //Validar caja de texto de imagen 
  $("#txtImgSoporte").change(function () {
    var inputFileImage = document.getElementById('txtImgSoporte');
    var file = inputFileImage.files[0];
    if (file.type != 'image/png' && file.type != 'image/jpeg') {
      Swal.fire('Oops', 'Formato de archivo invalido, solo se permiten imagenes JPG, PNG, JPEG', 'warning');
      $(this).val('');
    }
  })
  //Actualizar estado de solicitud.

  $("#btnAutorizaNota").click(function () {
    ActualizarEstadoSol('A', 'AUTORIZADO', 'N');
  });
  $("#btnAutorizaPed").click(function () {
    ActualizarEstadoSol('A', 'AUTORIZADO', 'P');
  });
  $("#btnRechazar").click(function () {
    ActualizarEstadoSol('R', 'RECHAZADO');
  });
  $("#BtnUpdate").click(function () {
    ActualizarSolicitud();
  });
  //Calculo de descuento y valor en formato de actualizacion 
  $("#GesVlrNegocio, #GesDescuento").keyup(function () {
    let vlrNegocio = parseFloat(unformatNum($("#GesVlrNegocio").val()));
    let pcjDescuento = parseFloat($("#GesDescuento").val());
    let vlrDescuento = 0;
    $("#GesVlrNegocio").val(formatNum(vlrNegocio, '$'));
    if (pcjDescuento > 0 && vlrNegocio > 0) {
      vlrDescuento = Math.round(vlrNegocio * (pcjDescuento / 100));
      $("#GesVlrDescuento").val(formatNum(vlrDescuento, '$'));
    } else {
      $("#GesVlrDescuento").val('');
    }

  });
  //Auto complete 
  $("#GesNumFact").keypress(function (e) {
    if (e.which == 13) {
      ValidarFactura();
    }
  });
  $("#GesNumFact").focusout(function () {
    if ($(this).val() != '') {
      ValidarFactura();
    }
  })


  //Guardar cambios de numero de factura
  $("#BtnFactura").click(function () {
    GuardarFactura();
  });
  $("#btnCrearDoc").click(function () {
    let tipo = $("#GesTipoNegocio").val();
    let NotaFondo = $("#GesNotaFondo").val();
    if (Perm_Autorizar == 'S' && $("#txtNumDoc").val() == 0) {
      if (tipo == 'P') {
        $("#SlcTipoAplicacion").show();
        if (NotaFondo == 0) {
          $("#dvcol1").removeClass("col-md-12");
          $("#dvcol1").addClass("col-md-6");
          $("#PanelProveedor").show();
        } else {
          $("#dvcol1").removeClass("col-md-6");
          $("#dvcol1").addClass("col-md-12");
          $("#PanelProveedor").hide();
        }
      } else {
        $("#SlcTipoAplicacion").hide();
      }

    }


    if (Perm_Aprobar == 'S' && $("#txtNumDoc").val() == 0) {
      $("#btnAprobarNota").show();
    } else {
      $("#btnAprobarNota").hide();
    }

    $("#fhContabilizacion,#fhDocumento,#fhPagoProv").val(FechaActual());

    if (tipo == 'P' && NotaFondo == 0) {
      $("#dvcol1").removeClass("col-md-12");
      $("#dvcol1").addClass("col-md-6");
      $("#PanelProveedor").show();
    } else {
      $("#dvcol1").removeClass("col-md-6");
      $("#dvcol1").addClass("col-md-12");
      $("#PanelProveedor").hide();
    }
    $("#ModalNotas").modal('show');
  });
  $("#btnGuardarNota").click(function () {
    ActualizarDatosNota();
  });
  $("#btnAprobarNota").click(function () {
    WSCrearNota();
  });
  $("input:radio[name=flexRadio]").change(function () {
    let radiocheck = $("input:radio[name=flexRadio]:checked").val();
    if (radiocheck == 0) {
      $("#txtValorNota").val($("#GesVlrDescuento").val());
    } else {
      $("#txtValorNota").val($("#GesVlrDescuentoFac").val());
    }
  })

  //Finalizar carga de facturas 
  $("#BtnFinCarga").click(function () {
    FinalizaFacturas();
  });

  $("#btnInformacion").click(function () {
    $("#ModalInfo").modal('show');
  });
  $("#btnFacturaDescuentos").click(function () {
    $("#ModalInfoFacturas").modal('show');
  });
  $("#txtConsultaFactura").on("keypress", function (event) {
    if (event.which === 13) {
      event.preventDefault();
      ConsultarFacturasDescuentos($(this).val());
    }
  });

  $("#BtnAnular").click(function () {
    AnularSolicitud();
  });

  $("#listarSeleccionados").click(function () {
    ListarProductosSeleccionados();
  });


  //Carga de archivo plano
  $("#archivoPlano").val('');
  $("#archivoPlano").change(function (e) {
    var ext = $("input#archivoPlano").val().split(".").pop().toLowerCase();
    if ($.inArray(ext, ["csv"]) == -1) {
      Swal.fire('Error', 'Solo se permiten archivos CSV', 'error');
      $("#archivoPlano").val('');
      return false;
    }
    if ($("#dvResultMateriales").html() != '') {
      if (e.target.files != undefined) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var csvval = e.target.result.split("\n");
          var cont = 0;
          var items = 0;
          for (var i = 0; i < csvval.length; i++) { //for 1		
            var row = csvval[i];
            if (row != '') {
              var col = row.split(',');
              items++;
              $('#dvResultMateriales table tbody tr').each(function (index, tr) {
                codigo = $.trim($(tr).find('td:eq(0)').html());
                if (codigo == $.trim(col[0])) {
                  $(tr).find('td:eq(8)').find('input').val($.trim(col[1]));
                  cont++;
                }
              });
            }
          } //for
          Swal.fire('Información!', 'Se cargaron ' + cont + ' de ' + items + ' materiales.', 'info');
        };
        reader.readAsText(e.target.files.item(0));
      }
      return false;
    } else {
      Swal.fire('Error', 'No se han cargado los materiales', 'error');
      $("#archivoPlano").val('');
      return false;
    }

  });
  $("#SlcTipoAplicacion").change(function () {
    if ($(this).val() == 0) {
      $("#dvcol1").removeClass("col-md-12");
      $("#dvcol1").addClass("col-md-6");
      $("#PanelProveedor").show();
    } else {
      $("#dvcol1").removeClass("col-md-6");
      $("#dvcol1").addClass("col-md-12");
      $("#PanelProveedor").hide();
    }
  });
  $("#btnExportar").click(() => {
    exportar();
  });

});
//Document ready


//Imagen de carga
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

function validarSiNumero(numero) {
  x = 0;
  if (/^([0-9])*$/.test(numero)) {
    x = 1;
  }
  return x;
}

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

function FiltrarProv(expr, ArrayProv, op) {
  expresion = new RegExp(expr, "i"); //

  switch (parseInt(op)) {
    //por codigo
    case 1:
      filtro = ArrayProv.filter(ArrayProv => expresion.test(ArrayProv.codigo_sap)); //
      if (filtro.length == 0) {
        filtro = ArrayProv.filter(ArrayProv => expresion.test(ArrayProv.nit));
      }
      break;
      //por descripcion 
    case 2:
      filtro = ArrayProv.filter(ArrayProv => expresion.test(ArrayProv.nombres));
      if (filtro.length == 0) {
        filtro = ArrayProv.filter(ArrayProv => expresion.test(ArrayProv.razon_comercial));
      }
      break;
  }
  return filtro;
}

function LoadArrayProv() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/Notas.php",
    dataType: "json",
    async: true,
    beforeSend: function () {
      LoadImg('CARGANDO PROVEEDORES...');
    },
    data: {
      op: "S_TERCEROS_PROV"
    },
    success: function (data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          d = data[i];
          det = {
            'value': $.trim(d.codigo_sap) + '|' + d.nombres + '|' + d.razon,
            'nombres': d.nombres,
            'nit': d.nit,
            'razon_comercial': d.razon,
            'codigo_sap': $.trim(d.codigo_sap)
          } //det
          ArrProv.push(det);
        } //for   for(var i=0;i<data.length;i++){				

      } //				

    }
  }).done(function () {
    UnloadImg();
  }).fail(function (data) {
    console.error(data);
  });
}
//Carga de clientes
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
            'desc_grupo': d.desc_grupo
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

function GruposArticulos() {
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
    async: true,
    success: function (data) {
      var option = '';
      for (var i = 0; i <= data.length - 1; i++) {
        option += '<option value="' + data[i].GRUPO_ARTICULO + '">' + data[i].GRUPO_ARTICULO + ' - ' + data[i].DESCRIPCION1 + '</option>'
      }
      $("#SlcGrupoArticulo").html(option);
    }
  });
}

const validaNegocio = async (cliente, grupo) => {
  try {
    const requestData = {
      link: "../models/Notas.php",
      op: "VALIDA_NEGOCIO",
      codigo: cliente,
      grupo: grupo
    };
    const response = await enviarPeticion(requestData);

    if (Array.isArray(response)) {
      return response.length;
    } else {
      console.warn("La respuesta no es un array:", response);
      return 0;
    }
  } catch (error) {
    console.error("Error en la función validaNegocio:", error);
  }
}


const CargarProductos = async () => {
  var grupo = new Array();
  let tiponegocio = $("#SlcTipoNegocio").val();
  $("#SlcGrupoArticulo option").each(function () {
    if ($(this).is(":selected")) {
      grupo.push($(this).val());
    }
  });

  if (tiponegocio == 'P') {
    let codigoSAP = $("#txtCodigo").val();
    let grupoProv = grupo[0].trim();
    let response = await validaNegocio(codigoSAP, grupoProv);
    if (response >= 1) {
      Swal.fire('Validación de negocio', 'El cliente y el grupo de artículo seleccionado ya están asignados para este mes. Se le permitirá continuar con el proceso, pero se recomienda realizar una verificación adicional para evitar posibles duplicidades.', 'info');
    }

  }

  if (grupo.length > 0) {
    if ($("#SlcTipoNegocio").val() != '') {
      if ($("#txtCodigo").val() != '') {
        if (parseFloat($("#txtVlrNegocio").val()) > 0) {
          if (parseFloat($("#txtDescuento").val()) > 0) {
            try {
              const data = {
                link: "../models/Notas.php",
                op: "S_MATERIALES",
                oficina: $("#txtOficina").val(),
                lista: $("#txtLista").val(),
                grupo: grupo
              };
              LoadImg('Cargando materiales...');
              const resp = await enviarPeticion(data);
              if (resp.length > 0) {
                var tabla = `<table class="table table-sm" align="center" id="tablaMateriales">
								  <thead>
								    <tr>
									 <th>Código</th>
									 <th>Descripción</th>
									 <th>IVA</th>
									 <th>DCTO</th>
									 <th>Stock</th>
									 <th>Valor</th>
									 <th>Bruto</th>
									 <th>Neto</th>
									 <th>Cantidad</th>
									</tr>
								 </thead>
								 <tbody>`;
                resp.forEach((row) => {
                  tabla += `<tr>
									<td>${row.codigo_material}</td>
									<td>${row.descripcion}</td>
									<td>${row.iva}</td>
									<td>${row.descuento}</td>
									<td>${row.stock}</td>
						            <td>${formatNum(row.valor_unitario,'$')}</td>
									<td>${formatNum(row.valor_bruto,'$')}</td>
									<td>${formatNum(row.valor_neto,'$')}</td>
									<td><input type="number" class="form-control" size="2" onKeyPress="return vnumeros(event)"></td>
							    </tr>`;
                });
                tabla += `</tbody></table>`;
                $("#dvResultMateriales").html(tabla);

                $("#filtroTablaMateriales").keyup(function () {
                  theTable = $("#tablaMateriales > tbody > tr");
                  var value = $(this).val().toLowerCase();
                  theTable.filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                  });
                });

              } else {
                $("#dvResultMateriales").html(`<div class="alert alert-danger" role="alert">
                                                    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                                                    <span class="sr-only">Error:</span>
                                                    NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
                                                  </div>`);
              }

            } catch (e) {
              console.log(e);

            }
            UnloadImg();

          } else {
            Swal.fire('Error', 'Es necesario asignar el porcentaje del descuento!.', 'error');
          }
        } else {
          Swal.fire('Error', 'Es necesario asignar el valor del negocio!.', 'error');
        }
      } else {
        Swal.fire('Error', 'Es necesario cargar un cliente!.', 'error');
      }
    } else {
      Swal.fire('Error', 'Es necesario seleccionar el tipo de negocio!.', 'error');
    }
  } else {
    Swal.fire('Error', 'Es necesario seleccionar los grupos de articulos!.', 'error');
  }
}


function uploadImagen(input) {
  var inputFileImage = document.getElementById(input);
  var file = inputFileImage.files[0];
  var data = new FormData();
  var date = new Date();
  var nombre = 'IMG_' + date.getDate() + date.getDay() + date.getFullYear() + date.getSeconds();
  data.append('archivo', file);
  data.append('op', 'U_IMAGEN');
  data.append('nombre', nombre);
  let respuesta;
  $.ajax({
    url: "../models/Notas.php",
    type: "POST",
    contentType: false,
    data: data,
    processData: false,
    cache: false,
    dataType: "json",
    async: false,
    success: function (data) {
      respuesta = data;
    }
  });
  return respuesta;
}

const Limpiar = () => {
  var RolId = $("#RolId").val();
  $("#txtDescuento").val('');
  $("#SlcTipoNegocio").val('');
  $("#txtCodigo").val('');
  $("#txtVlrNegocio").val('');
  $("#txtCliente").val('');
  $("#txtLista").val('');
  $("#txtOficina").val('');
  $("#txtImgSoporte").val('');
  $("#dvResultMateriales").html('');
  $("#txtVlrDescuento").val('');
  $("#txtNotas").val('');
  GruposArticulos();
  $("#txtCliente").focus();
  if (Perm_Autorizar == 'S') {
    $("#liSeguimiento").removeClass("disabled disabledTab");
    $("#btnSeguimiento").attr("data-toggle", "tab");
    Recurso();
  }


}

const Recurso = async () => {
  try {
    const requestData = {
      link: "../models/Notas.php",
      op: "S_RECURSO"
    };
    const response = await enviarPeticion(requestData);
    if (Array.isArray(response) && response.length > 0) {
      $("#SegPresupuesto").val(formatNum(response[0].valor, '$'));
    } else {
      $("#SegPresupuesto").val(formatNum(0, '$'));
    }
  } catch (error) {
    console.error("Error al obtener el recurso:", error);
    $("#SegPresupuesto").val(formatNum(0, '$'));
  }
};


const AsignarRecurso = async (valor) => {
  try {
    const requestData = {
      link: "../models/Notas.php",
      op: "I_RECURSO",
      usuario: $.trim($("#SegUsuario").val()),
      valor: valor
    };
    const response = await enviarPeticion(requestData);
    if (!response.error) {
      Swal.fire('Excelente', response.mensaje, 'success');
      Limpiar();
    } else {
      Swal.fire('Error', response.mensaje, 'error');
    }
  } catch (error) {
    console.error("Error al asignar el recurso:", error);
    Swal.fire('Error', 'Ocurrió un problema al procesar la solicitud. Intente de nuevo más tarde.', 'error');
  }
};


function GuardarSolicitud() {
  //Datos de cliente
  let TipoNegocio = $("#SlcTipoNegocio").val();
  let vlrNegocio = parseFloat($("#txtVlrNegocio").val());
  let Descuento = parseFloat($("#txtDescuento").val());
  let Codigo = $("#txtCodigo").val();
  let Lista = $("#txtLista").val();
  let Oficina = $("#txtOficina").val();
  let vlrDescuento = unformatNum($("#txtVlrDescuento").val());
  let Grupo = $("#SlcGrupoArticulo").val()[0];
  let Nota = $("#txtNotas").val();
  let Materiales = new Array();

  //Datos del grupo dependiendo del tipo
  if ($("#Organizacion").val() == 2000) {
    switch (TipoNegocio) {
      case 'P':
        grupo = Grupo;
        break;
      default:
        grupo = 'ROMA2570';
        break;

    }
  } else {
    switch (TipoNegocio) {
      case 'P':
        grupo = Grupo;
        break;
      default:
        grupo = 'MULTI0001';
        break;
    }
  }

  //Datos de Materiales
  $("#tablaMateriales tr:gt(0)").each(function () {
    let codigo = $(this).find('td').eq(0).html()
    let cantidad = parseInt($(this).find('td').eq(8).find('input').val());
    if (cantidad > 0) {
      Materiales.push({
        'codigo': codigo,
        'cantidad': cantidad
      });
    }
  });

  if (Materiales.length > 0) {
    if (
      TipoNegocio != ''
      && vlrNegocio != ''
      && Descuento != ''
      && Codigo != ''
      && vlrDescuento != ''
    ) {
      //Confirmacion de envio de datos
      Swal.fire({
        title: "Esta seguro de guardar esta solicitud?",
        text: "Despues de aceptar no podra reversar la operacion!",
        icon: "warning",
        confirmButtonColor: "#82ED81",
        cancelButtonColor: "#FFA3A4",

        confirmButtonText: "Enviar!",
        cancelButtonText: "No Enviar",
        showLoaderOnConfirm: true,
        showCancelButton: true,
      }).then((result) => {
        if (result.value) {
          //Validacion de carga de imagen
          let swImg = 0;
          let NombreImg = '';
          if ($("#txtImgSoporte").val() != '') {
            let respImg = uploadImagen('txtImgSoporte');
            if (!respImg.status) {
              swImg = 1;
            } else {
              NombreImg = respImg.nombre;
            }
          }

          if (swImg == 0) {
            $.ajax({
              type: "POST",
              encoding: "UTF-8",
              url: "../models/Notas.php",
              dataType: "json",
              data: {
                op: "G_SOLICITUD",
                TipoNegocio: TipoNegocio,
                vlrNegocio: vlrNegocio,
                Descuento: Descuento,
                Codigo: Codigo,
                vlrDescuento: vlrDescuento,
                NombreImg: NombreImg,
                Materiales: Materiales,
                Lista: Lista,
                Oficina: Oficina,
                Grupo: Grupo,
                Nota: Nota
              },
              async: false,
              success: function (data) {
                if (!data.error) {
                  Swal.fire('Excelente', data.mensaje + ' ' + data.id, 'success');
                  Limpiar();
                } else {
                  Swal.fire('Error', data.mensaje, 'error');
                }

              }
            });
          } else {
            Swal.fire('Opps', 'Hubo un error al cargar la imagen, se cancela el guardado, verifique e intente nuevamente!!', 'warning');
          }

        }
      });


    } else {
      Swal.fire('Opps', 'Campos incompletos, verifique e intente nuevamente!!', 'warning');
    }
  } else {
    Swal.fire('Opps', 'No ha seleccionado ningun material, verifique e intente nuevamente!!', 'warning');
  }

}

function ConsultarSolicitudes() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/Notas.php",
    dataType: "json",
    data: {
      op: "S_SOLICITUD",
      Perm_Autorizar: Perm_Autorizar,
      Perm_Visualizar: Perm_Visualizar,
      anio: $("#Anio").val(),
      fhini: $("#FhInicial").val(),
      fhfin: $("#FhFinal").val(),
      estado: $("#Estado").val(),
      oficina: $("#Oficinas").val(),
      tnegocio: $("#tnegocio").val(),
    },
    beforeSend: function () {
      LoadImg('CARGANDO SOLICITUDES...');
    },
    async: true,
    success: function (data) {
      let TotNegCompras = 0;
      let TotNegGerencia = 0;
      let TotNegProveedor = 0;
      let TotNegMercadeo = 0;
      let TotNegComercial = 0;
      let UsuEjecucion = 0;
      //---
      let TotS = 0;
      let TotA = 0;
      let TotR = 0;
      let TotG = 0;
      let TotD = 0;
      let TotC = 0;
      if (data.length > 0) {
        var tabla = `<table class="table table-sm" align="center" id="tablaSolicitudes">
								  <thead>
								    <tr>
									 <th>Id</th> 
                                     <th>Oficina</th>
                                     <th>Tipo</th>
									 <th>Fecha</th>
									 <th>CodigoSAP</th>
									 <th>Nombres</th>
									 <th>Razon</th>
									 <th>Valor</th>
									 <th>Descuento</th>
									 <th>Vlr.Descuento</th>
                                     <th>Vlr.Nota</th>
									 <th>Usuario</th>
                                     <th>Nota.Cliente</th>
                                     <th>Nota.Proveedor</th>
                                     <th>Estado</th>
                                     <th>Tipo</th>
                                     <th>Grupos</th>
                                     <th>Autoriza</th>
									 <th>Facturas</th>
									 <th>Gestión</th>
                                     <th>Eliminar</th>
									</tr>
								 </thead>
								 <tbody>`;
        data.forEach(function (row) {
          //Contadores tipos de negocios
          switch (row.tipo_neg) {
            case 'G':
              TotNegGerencia++;
              break;
            case 'P':
              TotNegProveedor++;
              break;
            case 'M':
              TotNegMercadeo++;
              break;
            case 'C':
              TotNegComercial++;
              break;
            case 'O':
              TotNegCompras++;
              break;
          }
          //----------------------------

          let imgEstado = '';
          let imgTipo = '';
          let btn_eliminar = ` <button type="button" class="btn btn-danger btn-sm" disabled>
									<span class="fa-solid fa-trash" aria-hidden="true"></span> 
								 </button>`;
          switch (row.estado) {
            case 'S': //Solicitado
              TotS++;
              imgEstado = `<div class="circle status-s">S</div>`;
              btn_eliminar = `<button type="button" class="btn btn-danger btn-sm" onClick="EliminarSolicitud('${row.id}')">
								  <span class="fa-solid fa-trash" aria-hidden="true"></span> 
								</button>`;
              break;
            case 'A': //Autorizado      
              TotA++;
              imgEstado = `<div class="circle status-a" onclick="SeleccionarSolicitud(${row.id})">A</div>`;
              break;
            case 'R': //Rechazado    
              TotR++;
              imgEstado = `<div class="circle status-r">R</div>`;
              break;
            case 'G': //Gestionado
              TotG++;
              imgEstado = `<div class="circle status-g">G</div>`;
              break;
            case 'D': //Diligenciado   
              TotD++;
              imgEstado = `<div class="circle status-d">D</div>`;
              break;
            case 'C': //Contabilizado  
              TotC++;
              imgEstado = `<div class="circle status-c">C</div>`;
              break;
          }
          switch (row.tipo_estado) {
            case 'N':
              imgTipo = `<div class="circle tipo-n">N</div>`;
              break;
            case 'P':
              imgTipo = `<div class="circle tipo-p">P</div>`;
              break;
            default:
              imgTipo = `<div class="circle tipo-s">?</div>`;
              break;
          }


          if ($.trim($("#SegUsuario").val()) == $.trim(row.usuario_autoriza)) {
            if (row.estado == 'A' && row.tipo_estado == 'N') {
              UsuEjecucion = UsuEjecucion + parseFloat(row.valor_descuento);
            }

          }

          tabla += `<tr>
						<td>${row.id}</td>
						<td>${row.oficina_ventas}</td>
						<td>${row.tipo_neg_desc}</td>
						<td>${row.fecha_hora}</td>
						<td>${row.codigo_sap}</td>
						<td>${row.nombres}</td>
						<td>${row.razon_comercial}</td>
						<td>${formatNum(row.valor_negocio,'$')}</td>
						<td>${row.descuento}%</td>
						<td>${formatNum(row.valor_descuento,'$')}</td>
                        <td>${formatNum(row.nota_valor,'$')}</td>
						<td>${row.usuario} - ${row.nombre_usuario}</td>
						<td>${row.nota_numero}</td>
						<td>${row.nota_numero_prov}</td>
						<td align="center" width="4%">${imgEstado}</td>
						<td align="center" width="4%">${imgTipo}</td>
						<td> ${row.GruposArticulos}</td>
                        <td>${row.usuario_autoriza}</td>
						<td>${row.facturas}</td>
						<td align="center" width="4%">
						  <button type="button" class="btn btn-default btn-sm" onClick="AbrirOpciones(${row.id});" title="Menu de opciones">
							<span class="glyphicon glyphicon-th" aria-hidden="true"></span>
						  </button> 
						</td>
						<td>${btn_eliminar}</td>
					</tr>`;
        });
        tabla += `</tbody></table>`;
        $("#dvGestionSolicitudes").html(tabla);

        $("#filtroTablaSolicitudes").keyup(function () {
          theTable = $("#tablaSolicitudes > tbody > tr");
          var value = $(this).val().toLowerCase();
          theTable.filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
        });
        let SegPresupuesto = unformatNum($("#SegPresupuesto").val());
        $("#SegEjecucion").val(formatNum(UsuEjecucion, '$'));
        $("#SegDisponible").val(formatNum(SegPresupuesto - UsuEjecucion, '$'));

        //--
        let ObTotalesTipos = [{
            name: 'Compras',
            y: TotNegCompras
          },
          {
            name: 'Mercadeo',
            y: TotNegMercadeo
          },
          {
            name: 'Gerencia',
            y: TotNegGerencia
          },
          {
            name: 'Proveedor',
            y: TotNegProveedor,
            sliced: true,
            selected: true
          },
          {
            name: 'Comercial',
            y: TotNegComercial
          }
        ];
        let ObTotalesSolicitudes = [{
            name: 'Solicitadas',
            y: TotS
          },
          {
            name: 'Autorizadas',
            y: TotA
          },
          {
            name: 'Rechazadas',
            y: TotR
          },
          {
            name: 'Gestionado',
            y: TotG
          },
          {
            name: 'Diligenciado',
            y: TotD
          },
          {
            name: 'Contabilizado',
            y: TotC
          }
        ];


        //Informes solo para rol administradores	
        let rolId = $("#RolId").val();
        if (rolId == 1) {
          $("#callout5, #callout6").show();
          NotasPorGrupos();
          let DatosUsuarios = NotasPorUsuarios();
          if (DatosUsuarios.length > 0) {
            Graficos('GrNotasUsuarios', DatosUsuarios, 'VALOR NOTAS AUTORIZADAS POR USUARIOS', 'column');
          } else {
            $("#GrNotasUsuarios").html(`<div class="alert alert-danger" role="alert">
												<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
												<span class="sr-only">Error:</span>	No existen resultados para condiciones seleccionadas
											  </div>`);
          }

        } else {
          $("#callout5, #callout6").hide();
        }

        Graficos('GrEstadoSolicitudes', ObTotalesSolicitudes, 'ESTADO SOLICITUDES ACTUALMENTE', 'column');
        Graficos('GrParticipacionTipos', ObTotalesTipos, 'PARTICIPACIÓN DE NEGOCIOS POR TIPOS', 'pie');
      } else {
        $("#dvGestionSolicitudes").html(`<div class="alert alert-danger" role="alert">
											<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
											<span class="sr-only">Error:</span> No existen resultados para condiciones seleccionadas
										  </div>`);
      }

    }
  }).done(function (data) {
    UnloadImg();
  }).error(function (data) {})
}

function NotasPorUsuarios() {
  var datos = new Array();
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/Notas.php",
    dataType: "json",
    data: {
      op: "S_NOTAS_X_USUARIOS",
      fhini: $("#FhInicial").val(),
      fhfin: $("#FhFinal").val(),
      oficina: $("#Oficinas").val(),
    },
    beforeSend: function () {},
    async: false,
    success: function (data) {
      datos = data;
    }
  });
  return datos;
}

function NotasPorGrupos() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/Notas.php",
    dataType: "json",
    data: {
      op: "S_NOTAS_X_GRUPOS",
      fhini: $("#FhInicial").val(),
      fhfin: $("#FhFinal").val(),
      oficina: $("#Oficinas").val(),
    },
    beforeSend: function () {},
    async: false,
    success: function (data) {
      if (data.length > 0) {
        var tabla = `<table class="table table-sm" align="center" id="tablaSolicitudes">
								  <thead>
								    <tr>
									 <th>Grupo</th> 
                                     <th>Descripción</th>
                                     <th>Valor</th>
									</tr>
								 </thead>
								 <tbody>`;
        data.forEach(function (row) {
          tabla += `<tr>
								<td>${row.grupo_articulos}</td>
								<td>${row.descripcion_grupo}</td>
								<td>${formatNum(row.valor_total,'$')}</td>
                              </tr>`;
        });
        tabla += `</tbody></table>`;
        $("#GrNotasGrupos").html(tabla);
      } else {
        $("#GrNotasGrupos").html(`<div class="alert alert-danger" role="alert">
											<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
											<span class="sr-only">Error:</span>	No existen resultados para condiciones seleccionadas
										  </div>`);
      }
    }
  });
}

function Graficos(div, datos, titulo = 'Sin Titulo', tipo) {
  if (tipo == 'pie') {
    Highcharts.chart(div, {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: '',
        align: 'left'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Porcentaje',
        colorByPoint: true,
        data: datos
      }]
    });
  } else if (tipo == 'column') {
    Highcharts.chart(div, {
      chart: {
        type: 'column'
      },
      title: {
        align: 'left',
        text: ''
      },
      subtitle: {
        align: 'left',
        text: ''
      },
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
          text: 'Total percent market share'
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
            format: '{point.y}'
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
      },
      series: [{
        name: 'Solicitudes',
        colorByPoint: true,
        data: datos
      }]
    });


  }

}

function SeleccionarSolicitud(id) {
  const url = "../models/Notas.php";
  var datos = '';
  $.ajax({
    type: "POST",
    url: url,
    data: {
      op: "S_SOLICITUD_ID",
      id: id
    },
    async: false,
    dataType: "json",
    success: function (data) {
      datos = data[0];
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud:", error);
    }
  });
  return datos;
}

function EliminarSolicitud(id) {
  Swal.fire({
    title: "Esta seguro de eliminar esta solicitud?",
    text: "Despues de aceptar no podra reversar la operacion!",
    icon: "warning",
    confirmButtonColor: "#82ED81",
    cancelButtonColor: "#FFA3A4",
    confirmButtonText: "Eliminar!",
    cancelButtonText: "No eliminar",
    showLoaderOnConfirm: true,
    showCancelButton: true,
  }).then((result) => {
    if (result.value) {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/Notas.php",
        dataType: "json",
        data: {
          op: "D_SOLICITUD",
          id: id
        },
        async: false,
        success: function (data) {
          if (!data.error) {
            Swal.fire('Excelente', data.mensaje + ' ' + data.id, 'success');
            ConsultarSolicitudes();
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        }
      });
    } else {

    }
  });
}

function AbrirImagen(soporte) {
  $("#ContenidoImagen").html('<img src="' + soporte + '" class="img-responsive" width="100%" height="100%">');
  $("#ModalImagen").modal('show');
  $("#txtImgSoporteAdicional").val('');
}

function AbrirOpciones(id) {

  var data = SeleccionarSolicitud(id);
  var RolId = $("#RolId").val();
  var UsrLogin = $("#UsrLogin").val();


  if (data.negocios_adicionales > 0) {
    let text = `<h4><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;Advertencia</h4>
                  <p>El cliente posee otra negociación para este mes con ID#${data.negocios_adicionales}</p>`
    $("#CallOutInfoCliente").html(text);
    $("#CallOutInfoCliente").show();
  } else {
    $("#CallOutInfoCliente").html('');
    $("#CallOutInfoCliente").hide();
  }


  $("#TdSoporte").html(`<button type="button" class="btn btn-default" onClick="AbrirImagen('${data.soporte}')" title="Ver Imagen de soporte">
									<span class="glyphicon glyphicon-picture" aria-hidden="true"></span> Ver Soporte
								  </button> `);
  $("#GesEstado").val(data.estado);
  if (Perm_AprobarPedido == 'S') {
    $("#btnAutorizaPed").show();
  } else {
    $("#btnAutorizaPed").hide();
  }
  //Actualizacion del estado de la solicitud
  $("#FootAutorizacion").hide();
  if (Perm_Autorizar == 'S') {

    if (data.estado == 'S') {
      $("#FootAutorizacion").show();
    } else {
      if (data.tipo_estado == 'N') { //Notas
        $("#PanelFactura").show();
        if (data.estado == 'G' || data.estado == 'D' || data.estado == 'C') {
          $("#btnCrearDoc").show();
        } else {
          $("#btnCrearDoc").hide();
        }
      } else { //Pedidos
        $("#PanelFactura").hide();
      }
    }

  } //Fin permisos autorizar


  if (UsrLogin == data.usuario) {
    if (data.estado != 'S' && data.tipo_estado == 'N') {
      $("#PanelFactura").show();
      if (data.estado == 'A') {
        $("#BtnFactura").show();
      } else {
        $("#BtnFactura").hide();
      }

      $("#GesNumFact").attr({
        'disabled': false,
        'readonly': false
      });
    } else {
      $("#PanelFactura").hide();
      $("#BtnFactura").hide();
      $("#GesNumFact").attr({
        'disabled': true,
        'readonly': true
      });
    }
  }


  //Actualizacion y edicion del porcentaje de descuentos y el valor del negocio, solo mientras esta en estado solicitado
  if ((Perm_Autorizar == 'S' || UsrLogin == data.usuario) && data.estado == 'S') {
    $("#GesDescuento").attr({
      'disabled': false,
      'readonly': false
    });
    $("#GesVlrNegocio").attr({
      'disabled': false,
      'readonly': false
    });
    $("#BtnUpdate").show();
  } else {
    $("#GesDescuento").attr({
      'disabled': true,
      'readonly': true
    });
    $("#GesVlrNegocio").attr({
      'disabled': true,
      'readonly': true
    });
    $("#BtnUpdate").hide();
  }
  //Estato de la solicitud


  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/Notas.php",
    dataType: "json",
    data: {
      op: "S_SOLICITUD_DETALLE",
      id: id
    },
    async: false,
    success: function (data) {
      if (data.length > 0) {
        var tabla = `<table class="table table-sm TablaMateriales" align="center" id="tbMaterialesNota">
								  <thead>
								    <tr>
                                     <th>Id</th>
									 <th>Código</th>
									 <th>Descripción</th>
                                     <th>Cantidad</th>
									</tr>
								 </thead>
								 <tbody>`;
        data.forEach(function (row) {
          tabla += `<tr>
                                <td>${row.id}</td>
								<td>${row.codigo_material}</td>
								<td>${row.descripcion}</td>
                                <td>${row.cantidad}</td>
							</tr>`;
        });
        tabla += `</tbody></table>`;
        $("#dvPanelMateriales").html(tabla);
      } else {
        $("#dvPanelMateriales").html(`<div class="alert alert-danger" role="alert">
										<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
										<span class="sr-only">Error:</span> No existen resultados para condiciones seleccionadas
									  </div>`);
      }

    }
  });
  $("#GesVlrNegocio").val(formatNum(data.valor_negocio, '$'));
  $("#GesLabNegocio").val(data.grupo);
  $("#GesDescuento").val(data.descuento);
  $("#GesVlrDescuento").val(formatNum(data.valor_descuento, '$'));
  $("#GesNotas").val(data.notas);
  $("#GesTipoNegocio").val(data.tipo_neg);
  $("#GesTipoNegocioDesc").val(data.tipo_neg_desc);

  $("#SlcGesTipoNegocio").val(data.tipo_neg);
  $("#GesNotaFondo").val(data.nota_fondo);


  $("#GesUsrNegocio").val(data.usuario);
  $("#GesId").val(id);
  $("#GesCodigoSAP").val(data.codigo_sap);
  $("#GesFecha").val(data.fecha_hora);
  $("#GesVlrFact").val('');
  $("#GesVlrFactPP").val('');
  $("#GesNumFact").val('');
  $("#GesOficinaVentas").val(data.oficina_ventas);
  $("#GesCondicionPago").val(data.condicion_pago + ' - ' + data.condicion_desc);
  $("#GesDescuentoPP").val(data.dcto_financiero);
  //Campos de nota
  $("#txtNumDoc").val(data.nota_numero);
  $("#fhDocumento").val(data.nota_fecha_doc);
  $("#fhContabilizacion").val(data.nota_fecha_cont);
  $("#txtCuentaMayor").val(data.nota_cuenta_mayor);
  $("#txtCentroCosto").val(data.nota_centro_costo);
  $("#txtCentroBeneficio").val(data.nota_centro_beneficio);
  $("#txtTexto1").val(data.nota_texto1);
  $("#txtTexto2").val(data.nota_texto2);
  //Campos de nota proveedor
  $("#txtNumDocProv").val(data.nota_numero_prov);
  $("#txtCuentaMayorProv").val(data.nota_cuenta_mayor_prov);
  $("#txtCentroCostoProv").val(data.nota_centro_costo_prov);
  $("#txtCentroBeneficioProv").val(data.nota_centro_beneficio_prov);
  $("#txtTexto1Prov").val(data.nota_texto1_prov);
  $("#txtTexto2Prov").val(data.nota_texto2_prov);
  $("#fhPagoProv").val(data.nota_fecha_pago_prov);
  $("#txtCodigoProv").val(data.nota_codigo_sap_prov);
  //Campos de gestion 
  $("#UsuAutoriza").html(data.usuario_autoriza);
  $("#FhAutoriza").html(data.fecha_autoriza);
  $("#UsuAprueba").html(data.usuario_aprueba);
  $("#FhAprueba").html(data.fecha_aprueba);

  $("#UsuFactura").html(data.usuario_gestiona);
  $("#FhFactura").html(data.fecha_gestiona);

  $("#UsuNota").html(data.nota_usuario_diligencia);
  $("#FhNota").html(data.fecha_usuario_diligencia);


  if (data.nota_numero == 0) {
    $(".input-notas").attr({
      'disabled': false,
      'readonly': false
    });

    $("#btnGuardarNota").show();
  } else {
    $(".input-notas").attr({
      'disabled': true,
      'readonly': true
    });
    $("#btnGuardarNota").hide();
  }
  ConsultarFacturas(id);
  if (unformatNum($("#GesVlrDescuento").val()) == data.nota_valor) {
    $("#Radio1").prop('checked', true);
    $("#txtValorNota").val($("#GesVlrDescuento").val());
  } else {
    $("#Radio2").prop('checked', true);
    $("#txtValorNota").val($("#GesVlrDescuentoFac").val());
  }

  $("#ModalOpciones").modal('show');


}

function ConsultarFacturas(id) {
  var RolId = $("#RolId").val();
  var UsrLogin = $("#UsrLogin").val();
  var estado = $("#GesEstado").val();
  var usuario = $("#GesUsrNegocio").val();
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/Notas.php",
    dataType: "json",
    data: {
      op: "S_FACTURAS_NOTAS",
      id: id
    },
    async: false,
    success: function (data) {
      if (data.length > 0) {
        var vtotal = 0;
        var vtotal_pp = 0;
        var tabla = `<table class="table table-sm" align="center" id="">
					  <thead>
						<tr>
						 <th>Id</th>
						 <th>Numero</th>
						 <th>Valor</th>
                         <th>Valor PP</th>
						 <th>Ver</th>
						</tr>
					 </thead>
					 <tbody>`;
        data.forEach(function (row) {
          vtotal += parseFloat(row.valor);
          vtotal_pp += parseFloat(row.valor_pp);
          tabla += `<tr>
						<td>${row.id}</td>
						<td>${row.numero_factura}</td>
						<td>${formatNum(row.valor,'$')}</td>
                        <td>${formatNum(row.valor_pp,'$')}</td>
						<td>
                          <button type="button" class="btn btn-default">
                           <span class="fa-solid fa-eye "aria-hidden="true" onclick="VisualizarFactura('${row.numero_factura}')"></span>
                          </button>
                        </td>
					</tr>`;
        });
        tabla += `</tbody>
                  <thead>
					<tr>
					 <th colspan="2">Total</th>
					 <th>${formatNum(vtotal,'$')}</th>
                     <th>${formatNum(vtotal_pp,'$')}</th>
					 <th></th>
					</tr>
				 </thead>
                 </table>`;
        var dcto = parseFloat($("#GesDescuento").val());
        var dcto_val = 0;
        if ($("#GesTipoNegocio").val() != 'P') {
          $("#GesVlrNegocioFac").val(formatNum(vtotal_pp, '$'));
          dcto_val = Math.round((vtotal_pp) * (dcto / 100));
          $("#GesVlrDescuentoFac").val(formatNum(dcto_val, '$'));
        } else {
          $("#GesVlrNegocioFac").val(formatNum(vtotal, '$'));
          dcto_val = Math.round((vtotal) * (dcto / 100));
          $("#GesVlrDescuentoFac").val(formatNum(dcto_val, '$'));
        }
        $("#dvResultFacturas").html(tabla);
        //########## Ampliacion pendiente ##########################
        if (UsrLogin == usuario && estado == 'A') {
          $("#BtnFinCarga").show();
        } else {
          $("#BtnFinCarga").hide();
        }
        //########## Ampliacion pendiente ##########################
      } else {
        $("#GesVlrNegocioFac").val(formatNum(0, '$'));
        $("#GesVlrDescuentoFac").val(formatNum(0, '$'));
        $("#dvResultFacturas").html(`<div class="alert alert-danger" role="alert">
									   <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
									   <span class="sr-only">Error:</span> No se han asociado facturas
									 </div>`);
      }
    }
  });
}

function ActualizarEstadoSol(estado, descripcion, tipo) {
  let id = $("#GesId").val();
  let desc_tipo = '';
  switch (tipo) {
    case 'P':
      {
        desc_tipo = 'PEDIDO';
      }
      break;
    case 'N':
      {
        desc_tipo = 'NOTA';
      }
      break;
  }
  Swal.fire({
    title: "Esta seguro de actualizar al estado " + descripcion + " de tipo " + desc_tipo + "?",
    text: "Despues de aceptar no podra reversar la operacion!",
    icon: "warning",
    confirmButtonColor: "#82ED81",
    cancelButtonColor: "#FFA3A4",
    confirmButtonText: "Enviar!",
    cancelButtonText: "No Enviar",
    showLoaderOnConfirm: true,
    showCancelButton: true,
  }).then((result) => {
    if (result.value) {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/Notas.php",
        dataType: "json",
        data: {
          op: "U_ESTADO_SOL",
          estado: estado,
          id: id,
          tipo: tipo
        },
        async: false,
        success: function (data) {
          if (!data.error) {
            Swal.fire('Excelente', data.mensaje + ' ' + data.id, 'success');
            if (tipo == 'P') {
              CrearDescuentoCliente();
            }
            ConsultarSolicitudes();
            $("#ModalOpciones").modal('hide');
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        }
      });
    } else {

    }
  });
}

function ActualizarSolicitud() {
  let vlrNegocio = parseFloat(unformatNum($("#GesVlrNegocio").val()));
  let pcjDescuento = parseFloat($("#GesDescuento").val());
  let GesVlrDescuento = parseFloat(unformatNum($("#GesVlrDescuento").val()));
  let GesId = $("#GesId").val();
  let TipoNegocio = $("#SlcGesTipoNegocio").val();
  if (vlrNegocio > 0 && pcjDescuento > 0 && GesId > 0 && GesVlrDescuento > 0) {
    Swal.fire({
      title: "Esta seguro de actualizar los datos de esta solicitud.?",
      text: "Despues de aceptar no podra reversar la operacion!",
      icon: "warning",
      confirmButtonColor: "#82ED81",
      cancelButtonColor: "#FFA3A4",
      confirmButtonText: "Enviar!",
      cancelButtonText: "No Enviar",
      showLoaderOnConfirm: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        $.ajax({
          type: "POST",
          encoding: "UTF-8",
          url: "../models/Notas.php",
          dataType: "json",
          data: {
            op: "U_SOLICITUD",
            vlrNegocio: vlrNegocio,
            pcjDescuento: pcjDescuento,
            GesVlrDescuento: GesVlrDescuento,
            GesId: GesId,
            TipoNegocio: TipoNegocio
          },
          async: false,
          success: function (data) {
            if (!data.error) {
              Swal.fire('Excelente', data.mensaje + ' ' + data.id, 'success');
              ConsultarSolicitudes();
              $("#ModalOpciones").modal('hide');
            } else {
              Swal.fire('Error', data.mensaje, 'error');
            }
          }
        });
      } else {

      }
    });
  } else {
    Swal.fire('Error', 'No es posible guardar valores en ceros', 'error')
  }


}

const ValidarFactura = async () => {
  try {
    const factura = $("#GesNumFact").val();
    const id = $("#GesId").val();
    const codigo_sap = $("#GesCodigoSAP").val();
    const fecha = $("#GesFecha").val();

    const requestData = {
      link: "../models/Notas.php",
      op: "S_FACTURA",
      factura: factura,
      id: id,
      codigo_sap: codigo_sap,
      fecha: fecha
    };

    const response = await enviarPeticion(requestData);
	  console.log(response);

    if (Array.isArray(response) && response.length > 0) {
      const facturaData = response[0];
      if (facturaData.ESTADO == 0) {
        $("#GesVlrFact").val(formatNum(facturaData.VALOR_NETO, '$'));
        $("#GesVlrFactPP").val(formatNum(facturaData.VALOR_NETO_PP, '$'));
      } else {
        Swal.fire('Oops', 'La hora de facturación es inferior a la hora de solicitud.', 'error');
      }
    } else {
      Swal.fire('Oops', 'No hay coincidencias', 'error');
    }
  } catch (error) {
    console.error("Error al validar la factura:", error);
    Swal.fire('Error', 'Ocurrió un problema al procesar la solicitud. Intente de nuevo más tarde.', 'error');
  }
};

const validarAddFactura = async (id) => {
  try {
    const data = {
      link: "../models/Notas.php",
      op: "VALIDA_ADD_FACTURA",
      id: id
    };
    const resp = await enviarPeticion(data);
    const dias = parseInt(resp[0].DIAS);
    if (dias > 14) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.log(e);
  }
}

const GuardarFactura = async () => {
  try {
    const id = $("#GesId").val();
    const factura = $("#GesNumFact").val();
    const valor_factura = parseFloat(unformatNum($("#GesVlrFact").val()));
    const valor_factura_pp = parseFloat(unformatNum($("#GesVlrFactPP").val()));
    const tipoNegocio = $.trim($("#GesTipoNegocio").val());
    const status = await validarAddFactura(id);

    if (factura !== '' && factura !== '0') {
      if (valor_factura > 0) {
        if (!status) {
          Swal.fire({
            title: "Lo sentimos!",
            text: "Ya pasaron mas de 15 dias de su solicitud, es imposible realizar la gestión.",
            imageUrl: "https://www.pwmultiroma.com/adg/resources/icons/llorando.gif",
            imageAlt: ""
          });
          $("#GesNumFact").val('');
          $("#GesVlrFact").val('');
          $("#GesVlrFactPP").val('');
          return false;
        }

        const requestData = {
          link: "../models/Notas.php",
          op: "G_FACTURA",
          factura: factura,
          id: id,
          valor_factura: valor_factura,
          valor_factura_pp: valor_factura_pp,
          tipoNegocio: tipoNegocio
        };
        const response = await enviarPeticion(requestData);
        if (!response.error) {
          Swal.fire('Excelente', `${response.mensaje} ${response.id}`, 'success');
          await ConsultarSolicitudes();
          await ConsultarFacturas(id);
        } else {
          Swal.fire('Error', response.mensaje, 'error');
        }
        $("#GesNumFact").val('');
        $("#GesVlrFact").val('');
        $("#GesVlrFactPP").val('');
      } else {
        Swal.fire('Oops', 'El valor de la factura no puede ser cero (0)', 'error');
      }
    } else {
      Swal.fire('Oops', 'No hay correspondencia con ese número de factura', 'error');
    }
  } catch (error) {
    console.error("Error al guardar la factura:", error);
    Swal.fire('Error', 'Ocurrió un problema al procesar la solicitud. Intente de nuevo más tarde.', 'error');
  }
};


function VisualizarFactura(num) {
  if (!isNaN(num)) {
    $("#ContenidoPDF").html('<embed src="../resources/tcpdf/Factura.php?num=' + parseInt(num) + '" frameborder="0" width="100%" height="100%">');
    $("#ModalPDF").modal("show");
  } else {
    swal("Cancelado", "El documento no contiene un numero de referencia valido!", "error");
  }
}

function Permisos() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/Notas.php",
    dataType: "json",
    data: {
      op: "S_PERMISOS",
      rol: $("#RolId").val(),
      modulo: '0629'
    },
    async: false,
    success: function (data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          d = data[i];
          if (d.id_mod_per == 1019) {
            Perm_Autorizar = d.chck;
          }
          if (d.id_mod_per == 1020) {
            Perm_Aprobar = d.chck;
          }
          if (d.id_mod_per == 1021) {
            Perm_AprobarPedido = d.chck;
          }
          if (d.id_mod_per == 1022) {
            Perm_Visualizar = d.chck;
          }

        }
      }

    }
  });
}

const ActualizarDatosNota = async () => {
  let id = $("#GesId").val();
  let numDoc = $("#txtNumDoc").val();
  let numDocProv = $("#txtNumDocProv").val();
  //Datos de cliente--------------------------------------------------------
  let fhDoc = $("#fhDocumento").val();
  let fhCont = $("#fhContabilizacion").val();
  let cuenta = $("#txtCuentaMayor").val();
  let CentroCosto = $("#txtCentroCosto").val();
  let CentroBene = $("#txtCentroBeneficio").val();
  let texto1 = $("#txtTexto1").val();
  let texto2 = $("#txtTexto1").val();
  let vlrNota = unformatNum($("#txtValorNota").val());
  //Datos de proveedor------------------------------------------------------
  let cuentaProv = $("#txtCuentaMayorProv").val();
  let CentroCostoProv = $("#txtCentroCostoProv").val();
  let CentroBeneProv = $("#txtCentroBeneficioProv").val();
  let textoProv1 = $("#txtTexto1Prov").val();
  let textoProv2 = $("#txtTexto1Prov").val();
  let fhPago = $("#fhPagoProv").val();
  let CodigoProv = $("#txtCodigoProv").val();
  //Datos de nota afectando o no el fondo del proveedor
  let TipoAplicacion = $("#SlcTipoAplicacion").val();

  // Validar cuenta contable existe
  const cuentaContable = await validaCuentaContable(cuenta);
  if (cuentaContable.length == 0) {
    Swal.fire('Error', 'La cuenta seleccionada no existe.', 'error');
    return;
  }
  //Validar saldo de fondo en caso de que sea una cuenta que inicia en 2815
  let saldoFondo;
  if (cuenta.substring(0, 4) == '2815') {
    saldoFondo = await validaSaldoFondo(cuenta);
    if (saldoFondo.length == 0) {
      Swal.fire('Error', 'No fue posible obtener el saldo, verifique e intente nuevamente.', 'error');
      return;
    } else {
      let saldo = parseFloat(saldoFondo[0].SALDO);
      if (saldo < 0) {
        saldo = (saldo * -1);
        if (saldo < vlrNota) {
          Swal.fire('Error', `El valor total de las nota es superior al saldo disponible del fondo ${formatNum(saldo)}`, 'error');
          return;
        }
      } else {
        Swal.fire('Error', `Cuenta ${cuenta} sin fondos disponibles.`, 'error');
        return;
      }
    }
  }

  //Validamos que tenga centro de beneficio
  if (cuenta.substring(0, 4) == '2815' || cuenta.substring(0, 4) == '4175' || cuenta.substring(0, 4) == '4210') {
    if (CentroBene == '') {
      Swal.fire('Error', `El centro de beneficio no puede estar vacio.`, 'error');
      return;
    }
  }
  Swal.fire({
    title: "Esta seguro de actualizar los datos de esta solicitud.?",
    text: "Despues de aceptar no podra reversar la operacion!",
    icon: "warning",
    confirmButtonColor: "#82ED81",
    cancelButtonColor: "#FFA3A4",
    confirmButtonText: "Enviar!",
    cancelButtonText: "No Enviar",
    showLoaderOnConfirm: true,
    showCancelButton: true,
  }).then((result) => {
    if (result.value) {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/Notas.php",
        dataType: "json",
        data: {
          op: "U_SOLICITUD_NOTA",
          id: id,
          fhDoc: fhDoc,
          fhCont: fhCont,
          cuenta: cuenta,
          CentroCosto: CentroCosto,
          CentroBene: CentroBene,
          texto1: texto1,
          texto2: texto2,
          vlrNota: vlrNota,
          //---------------
          cuentaProv: cuentaProv,
          CentroCostoProv: CentroCostoProv,
          CentroBeneProv: CentroBeneProv,
          textoProv1: textoProv1,
          textoProv2: textoProv2,
          fhPago: fhPago,
          CodigoProv: CodigoProv,
          //-------------------
          TipoAplicacion: TipoAplicacion
        },
        async: false,
        success: function (data) {
          if (!data.error) {
            Swal.fire('Excelente', data.mensaje + ' ' + data.id, 'success');
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
          ConsultarSolicitudes();
        }
      });
    } else {

    }
  });
}

function WSCrearNota() {
  let id = $("#GesId").val();
  let numDoc = $("#txtNumDoc").val();
  if (id != 0) {
    if (numDoc == 0) {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/WS-NOTAS.php",
        dataType: "json",
        beforeSend: function () {
          LoadImg('CREANDO NOTA...');
        },
        data: {
          id: id
        },
        async: true,
        success: function (data) {
          if (!data.error) {

            Swal.fire({
              title: '<strong>Excelente!</strong>',
              icon: 'success',
              html: `<table class="form" align="center">
							 <tr>
								 <td><b>NOTA CLIENTE</b></td>
								 <td>${data.notaCliente}</td>
							 </tr>
							 <tr>
								 <td><b>NOTA PROVEEDOR</b></td>
								 <td>${data.notaProveedor}</td>
							 </tr>
						 </table>`,
              showCloseButton: false,
              showCancelButton: false,
              focusConfirm: false,
              footer: ''
            });

            $("#ModalOpciones").modal('hide');
            $("#ModalNotas").modal('hide');
            ConsultarSolicitudes();
            Limpiar();
          } else {
            Swal.fire("Oops..!", data.mensaje + ' - ' + data.msj, "error");
          }
        }
      }).done(function () {
        UnloadImg();
      }).fail(function (error) {
        UnloadImg();
      }).always(function (data) {
        console.log(data);
      })
    } else {
      Swal.fire('Error', 'No es posible contabilizar una nota ya creada', 'error');
    }
  } else {
    Swal.fire('Error', 'Ocurrio un error no se encontro el Id de la nota a generar, verifique e intente nuevamente ', 'error');
  }

}

function CrearDescuentoCliente() {
  let Materiales = new Array();
  let codigo = '';
  let tipo = '*';
  let desc = parseInt($("#GesDescuento").val());
  let lista = '*';
  let oficina = $("#GesOficinaVentas").val();
  let org = $("#Organizacion").val();
  let centro = '';
  let clase = '*';
  let CodigoSAP = $("#GesCodigoSAP").val();
  switch (oficina) {
    case '2400':
      {
        centro = 'RQ01';
      }
      break;
    case '2300':
      {
        centro = 'RC01';
      }
      break;
    case '2100':
      {
        centro = 'RM01';
      }
      break;
    case '2200':
      {
        centro = 'RB01';
      }
      break;
    case '1100':
      {
        centro = 'MM01';
      }
      break;
    case '1200':
      {
        centro = 'MC01';
      }
      break;
  }
  var registro = Math.round(Math.random() * (1 - 9999999999) + 1);
  $("#tbMaterialesNota tr:gt(0)").each(function () {
    codigo = $(this).find('td').eq(1).html();
    Materiales.push({
      'codigo': codigo
    });

  });
  if (Materiales.length > 0) {
    $.ajax({
      url: "../models/Notas.php",
      global: false,
      type: "POST",
      data: ({
        op: "G_DESCUENTOS_MATERIALES",
        Materiales: Materiales,
        tipo: tipo,
        desc: desc,
        lista: lista,
        oficina: oficina,
        org: org,
        centro: centro,
        clase: clase,
        CodigoSAP: CodigoSAP
      }),
      dataType: "json",
      async: false,
      success: function (data) {
        if (!data.error) {
          Swal.fire('Excelente!', data.mensaje, 'success');
        } else {
          Swal.fire('Error!', data.mensaje + ' - ' + data.codigo, 'error');
        }
      }
    }).error(function (data) {});
  } else {
    Swal.fire('Error', 'No hay materiales a los que aplicar el descuento', 'error');
  }
  /**/
}


function FinalizaFacturas() {
  let id = $("#GesId").val();
  Swal.fire({
    title: "Esta seguro de actualizar los datos de esta solicitud.?",
    text: "Despues de aceptar no adicionar mas facturas!",
    icon: "warning",
    confirmButtonColor: "#82ED81",
    cancelButtonColor: "#FFA3A4",
    confirmButtonText: "Enviar!",
    cancelButtonText: "No Enviar",
    showLoaderOnConfirm: true,
    showCancelButton: true,
  }).then((result) => {
    if (result.value) {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/Notas.php",
        dataType: "json",
        data: {
          op: "U_FINALIZA_FACT",
          id: id
        },
        async: false,
        success: function (data) {
          if (!data.error) {
            Swal.fire('Excelente', data.mensaje + ' ' + data.id, 'success');
            $("#BtnFinCarga").hide();
            $("#BtnFactura").hide();
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
          ConsultarSolicitudes();
        }
      });
    } else {

    }
  });

}

function AnularSolicitud() {
  let id = $("#GesId").val();
  let status = $("#GesEstado").val();
  if (status != 'C') {
    Swal.fire({
      title: "Esta seguro de actualizar los datos de esta solicitud.?",
      text: "Despues de aceptar no adicionar mas facturas!",
      icon: "warning",
      confirmButtonColor: "#82ED81",
      cancelButtonColor: "#FFA3A4",
      confirmButtonText: "Enviar!",
      cancelButtonText: "No Enviar",
      showLoaderOnConfirm: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        $.ajax({
          type: "POST",
          encoding: "UTF-8",
          url: "../models/Notas.php",
          dataType: "json",
          data: {
            op: "U_ANULA_SOL",
            id: id
          },
          async: false,
          success: function (data) {
            if (!data.error) {
              Swal.fire('Excelente', data.mensaje + ' ' + data.id, 'success');
              $("#ModalOpciones").modal('hide');
            } else {
              Swal.fire('Error', data.mensaje, 'error');
            }
            ConsultarSolicitudes();
          }
        });
      }
    });
  } else {
    Swal.fire('Error', 'No es posible anular una solicitud contabilizada', 'error');
  }
}

function ListarProductosSeleccionados() {
  if ($("#dvResultMateriales").html() != '') {
    let ProductosSeleccionados = new Array();
    $('#dvResultMateriales table tbody tr').each(function (index, tr) {
      var cant = $(tr).find('td:eq(8)').find('input').val();
      if (cant != '' && cant > 0) {
        det = {
          'cod': $(tr).find('td:eq(0)').html(),
          'desc': $(tr).find('td:eq(1)').html(),
          'iva': $(tr).find('td:eq(2)').html(),
          'dcto': $(tr).find('td:eq(3)').html(),
          'stock': $(tr).find('td:eq(4)').html(),
          'valor': $(tr).find('td:eq(5)').html(),
          'bruto': $(tr).find('td:eq(6)').html(),
          'neto': $(tr).find('td:eq(7)').html(),
          'cant': cant
        } //det
        ProductosSeleccionados.push(det);
      }
    });

    if (ProductosSeleccionados.length > 0) {
      var tabla = `<table class="table table-sm" align="center">
								  <thead>
									<tr>
									 <th>Codigo</th>
									 <th>Descripción</th>
									 <th>IVA</th>
									 <th>DCTO</th>
									 <th>Stock</th>
									 <th>Valor</th>
									 <th>Bruto</th>
									 <th>Neto</th>
									 <th>Cant</th>
									</tr>
								 </thead>
								 <tbody>`;
      let total = 0;
      ProductosSeleccionados.forEach(function (row) {
        tabla += `<tr>
						<td>${row.cod}</td>
						<td>${row.desc}</td>
						<td>${row.iva}</td>
						<td>${row.dcto}</td>
						<td>${row.stock}</td>
						<td>${row.valor}</td>
						<td>${row.bruto}</td>
						<td>${row.neto}</td>
						<td>${row.cant}</td>
					  </tr>`;
        total += parseFloat(unformatNum(row.neto)) * parseFloat(row.cant);
      });
      tabla += `</tbody></table>`;
      $("#TotalListaProductos").html('<b>TOTAL : ' + formatNum(total, '$') + '</b>')
      $("#ContenidoProductosSeleccionados").html(tabla);
      $("#ModalListarProductosSeleccionados").modal('show');
    } else {
      Swal.fire('Oops', 'No hay nada que listar, no se ha seleccionado ningun producto', 'warning');
    }
  } else {
    Swal.fire('Oops', 'No hay nada que listar', 'warning');
  }
}

function UpdImg() {
  var estado = $.trim($("#GesEstado").val());
  var id = $.trim($("#GesId").val());
  if (estado == 'S') {
    let swImg = 0;
    let NombreImg = '';
    if ($("#txtImgSoporteAdicional").val() != '') {
      let respImg = uploadImagen('txtImgSoporteAdicional');
      if (!respImg.status) {
        swImg = 1;
      } else {
        NombreImg = respImg.nombre;
      }
    }
    if (swImg == 0) {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/Notas.php",
        dataType: "json",
        data: {
          op: "U_IMAGEN_SOLICITUD",
          id: id,
          NombreImg: NombreImg
        },
        async: false,
        success: function (data) {
          if (!data.error) {
            Swal.fire('Excelente', data.mensaje + ' ' + data.id, 'success');
            $("#ModalImagen").modal('hide');
            $("#ModalOpciones").modal('hide');
            $("#txtImgSoporteAdicional").val('');
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        }
      });
    } else {
      Swal.fire('Oops', 'Error al cargar la imagen, por favor valide e intente nuevamente.', 'error');
    }
  } else {
    Swal.fire('Oops', 'No es posible modificar una imagen de una nota ya autorizada', 'warning');
  }
}

function exportTableToExcel(tableSelector, filename) {
  var wb = XLSX.utils.book_new();
  var table = document.querySelector(tableSelector);
  if (!table) {
    console.error('No se encontró ninguna tabla con el selector proporcionado.');
    return;
  }
  var ws = XLSX.utils.table_to_sheet(table);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
}
const exportar = () => {
  exportTableToExcel('#tablaSolicitudes', 'gestion_notas_negocios.xlsx');
}

function ConsultarFacturasDescuentos(factura) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/Notas.php",
    dataType: "json",
    data: {
      op: "S_FACT_DESCUENTO",
      factura: factura
    },
    async: false,
    success: function (data) {
      if (data.length > 0) {
        var tabla = `<table class="table table-sm" align="center">
								  <thead>
									<tr>
									 <th>Factura</th>
									 <th>CodigoSAP</th>
									 <th>Fecha</th>
									 <th>Nombres</th>
									 <th>Razon</th>
									 <th>Descuento%</th>
									 <th>Solicitado</th>
									 <th>Aprobado</th>
									 <th>Oficina</th>
                                     <th>ID.Neg</th>
									</tr>
								 </thead>
								 <tbody>`;
        data.forEach(function (row) {
          tabla += `<tr>
						<td>${row.numero_factura}</td>
						<td>${row.codigo_sap}</td>
						<td>${row.fecha_hora}</td>
						<td>${row.nombres}</td>
						<td>${row.razon_comercial}</td>
						<td>${row.descuento}</td>
						<td>${formatNum(row.descuento_solicitado,'$')}</td>
						<td>${formatNum(row.descuento_aprobado,'$')}</td>
						<td>${row.oficina_ventas}</td>
                        <td>${row.id_neg}</td>
					  </tr>`;
        });
        tabla += `</tbody></table>`;
        $("#ResultFacturaDescuentos").html(tabla);
      } else {
        $("#ResultFacturaDescuentos").html(`<div class="alert alert-danger" role="alert">
                                                    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                                                    <span class="sr-only">Error:</span> NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
                                                </div>`);
      }
    }
  });
}

const validaCuentaContable = async (cuenta) => {
  var datos;
  try {
    const data = {
      link: "../models/Notas.php",
      op: "valida_cuenta",
      cuenta
    }
    datos = await enviarPeticion(data);
  } catch (e) {
    Swal.fire('Error', 'No se pudo determinar la cuenta', 'error');
    return;
  }
  return datos;
}
const validaSaldoFondo = async (cuenta) => {
  var datos;
  try {
    const data = {
      link: "../models/Notas.php",
      op: "valida_saldo_fondo",
      cuenta
    }
    datos = await enviarPeticion(data);
  } catch (e) {
    Swal.fire('Error', 'No se pudo determinar la cuenta', 'error');
    return;
  }
  return datos;
}
