// JavaScript Document
var ArrProd = new Array();
var ArrEan = new Array();
var ArrCli = new Array();
var Arr = "";
var OfcN = "";
var OfcS = "";
var Perm_Cambiar_Bodega = '';


const validaEstadoDesbloqueo = async () => {
  try {
    const pedido = $("#ped_numero_sap").val();
    const resp = await enviarPeticion({
      link: '../models/PW-SAP.php',
      pedido: pedido,
      op: 'status_sol_desbloqueo'
    });

    // Verifica que resp sea un array y tenga elementos
    if (Array.isArray(resp) && resp.length > 0) {
      return resp[0].nsolicitud > 0; // Devuelve true si nsolicitud es mayor que 0
    }

    return false; // Devuelve false si no hay solicitudes
  } catch (error) {
    console.error('Error en la validación de estado de desbloqueo:', error);
    return false; // Devuelve false en caso de error
  }
};


const SolDesbloqueo = async () => {
  /*2024-10-04 Christian Bula 
   Se añade control para solo poder volver a montar la solicitud si el estado es (R:Rechazado - A: Aprobado)*/
  let status = await validaEstadoDesbloqueo();

  if (status) {
    Swal.fire({
      title: '¡Oh no!',
      text: 'Ya se ha realizado una solicitud para este pedido la cual posee un estatus Pendiente o en Verificación, lo que significa que no puedes hacer otra solicitud en este momento.',
      icon: 'warning',
      confirmButtonText: 'Entiendo, seguiré esperando...'
    });
    return;

  }

  /*2024-10-04 Christian Bula */


  Swal.fire({
    title: "Solicitud de desbloqueo del pedido #" + $("#ped_numero_sap").val(),
    html: `<textarea id="nota" class="swal2-input form-control"  placeholder="Si tienes una observacion , escribela aquí"></textarea>`,
    text: "Solicitar desbloqueo de pedido #" + $("#ped_numero_sap").val(),
    inputAttributes: {
      autocapitalize: "off"
    },
    showCancelButton: true,
    confirmButtonText: "Enviar solicitud",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        const nota = Swal.getPopup().querySelector('#nota').value;
        resp = await enviarPeticion({
          link: '../models/PW-SAP.php',
          pedido: $("#ped_numero_sap").val(),
          op: 'enviar_sol_desbloqueo',
          nota
        });
        if (!resp.ok) {
          Swal.fire("Error", "No se pudo enviar la solicitud, por favor validar", "error");
          return;
        }

        if (resp.solicitada) {
          Swal.fire("Error", resp.mensaje, "error");
          return;
        }
        Swal.fire("Ok", "Se envio la solicitud correctamente!", "success");
        Temporales();
      } catch (error) {
        Swal.showValidationMessage(`
          Request failed: ${error}
        `);
      }
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    console.log(result)
  });
}

const MostrarEstadoSolDesbloqueo = async (pedido) => {

  const data = {
    link: '../models/PW-SAP.php',
    op: 'datos_sol',
    pedido
  }

  resp = await enviarPeticion(data);
  estado = ''

  switch (resp[0].ESTADO) {
    case "0":
      estado = 'Pendiente';
      break;
    case "1":
      estado = 'En validación';
      break;
    case "2":
      estado = 'Rechazada';
      break;
  }

  Swal.fire("Estado de la solicitud", "Tu solicitud se encuentra  " + estado + "  <br> Nota :" + resp[0].RESPUESTA, "info")

}

const guardSolicitudesDesbloqueoPedidos = async () => {

  try {
    const data = {
      link: '../models/PW-SAP.php',
      op: 'SOL_PENDIENTE'
    }

    resp = await enviarPeticion(data);
  } catch (e) {
    console.error(e)
  }

}

// 
const cerrarAlertaDesbloqueoPedidos = () => {
  $("#alarma_sol_desbloqueo").html('').hide()
}

$(function () {
  /*
    setInterval(function(){
      dataPedidosDesbloqueo()
      .then(resp=>{
         


        if(resp.length>0){
          switch(resp[0].estado){
            case "1": estado=' EN VERIFIACION '; color='info'; break;
            case "2": estado=' RECHAZADA'; color='danger'; break;
            case "3": estado=' APROBADA';color='success' ; break;
          }
          $("#alarma_sol_desbloqueo").html(`
          <div class="row ">
            <div class="col-md-10">
            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            El pedido #${resp[0].pedido} del cliente ${resp[0].cliente} se encuentra <b><span class="text-${color}">${estado}</span></b>         
            </div>
            <div class="col-md-2">
            <button onclick="cerrarAlertaDesbloqueoPedidos()" class="btn btn-default text-danger" style="float:right;right   :0">x</button>
            </div>
          </div>
            
            
            `).show("slow");
        }
      })
      .catch(e=>{
        console.error(e)
      })
    },5000)
  */
  //Validacion de permisos
  Permisos();
  //Nuevas notificaciones emergentes
  Notificaciones(); //se quita porque se acabo la convencion
  setInterval(function () {
    Notificaciones();
  }, 300000);
  //----------------------------------------------------------	
  var ofi_ = $("#Ofi").val();
  if (ofi_ == 2100 || ofi_ == 2200 || ofi_ == 2300) {
    //$("#ModalFeriaMayo").modal('show');
  }
  //Nueva distribucion de grupos 
  CargaGruposClientes(1);
  CargaGruposClientes(2);
  //--------------------------
  OfcS = OficinasVentas('S');
  OfcN = OficinasVentas('N');
  //Nuevo Filtro Bodega
  $("#FiltroOficinaVentas").html(OfcS);
  $("#FiltroOficinaVentas").change(function () {
    GestionPedidos();
  });
  $("#txtZonas,#FiltroOficinaVentas,#txtClasePedido").select2();
  //VALIDO SI EXISTE NIT PARA LOS CLIENTES
  var DepId = $("#Dpto").val();
  if (DepId == 10) {
    if ($.trim($("#Nit").val()) == "") {

      Swal.fire("Session Error", "No se logro cargar la informacion, salga del sistema e intente nuevamente!", "error");
      setTimeout(function () {
        parent.$("#iframe").trigger("click");
      }, 3000);

    } else {
      LoadArrayCli();
    }
  } else {
    LoadArrayCli();
  }

  //Tabulacion de pestañas de seleccion	
  $("#btnProductos").click(function () {
    VerificaPedido();
    $("#txt_destinatario").attr('disabled', true);
    $("#txt_oficina").attr('disabled', true);
    $("#TxtIntegracion").attr('disabled', true);

    if ($("#txt_bproductos").val() == '') {
      $("#dvResultProductos").html('');
    } else {
      var n = 0;
      if (validarSiNumero(valor) == 1) {
        n = 1;
      }
      BuscarProductoArr(n);
    }
  });

  //Eventos click 
  $("#ContenidoPhone").html('<embed src="../../adg-phone/index.html?" frameborder="0" width="100%" height="500px">');
  $("#btnPhone").click(function () {
    $("#ModalPhone").modal('show');
  })
  //Refresh pedidos 
  $("#btnMenu9").click(function () {
    var num = $.trim($("#ped_numero").val());
    consultaOpciones(num);
    $.notify({ // options
      icon: 'glyphicon glyphicon-warning-sign',
      title: '<strong>ACTUALIZAR INFO PEDIDO ' + num + '</strong></br>',
      message: 'Ejecutado correctamente',
      url: '',
      target: '_blank'
    }, { // settings	
      delay: 2000,
      type: 'success',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
    });
  });
  //exportar la gestion
  $("#exportar_gestion").click(function () {
    Exportar('DvRecuperablesTerceros')
  })
  //------------------------------------------
  $("#btnMenu10").click(function () {
    LogDatos();
  });
  //------------------------------------------
  $("#btnPedidos").click(function () {
    WSInvenTotal();
    ListarPedido();
  });
  $("#btnTemporales").click(function () {
    Temporales();
  });
  $("#btnAddEntregas").click(function () {
    LimpiarEntregas();

    if ($("#link_pro").val() != '0') {
      $('#ClienteEntregas').val($("#txt_cliente").val()).attr("disabled", true);;
      $("#CodigoSAPEntregas").val($("#txt_codigoSap").val());
    }

  });
  $("#btnEventos").click(function () {


    ListarEvento();
  });
  $("#btListaFacts").click(function () {
    LimpiarFacturas();
    if ($("#link_pro").val() != '0') {
      $("#txtFactCodigoCliente").val($("#txt_codigoSap").val());
      $("#txtFactCliente").val($("#txt_cliente").val()).attr("disabled", true);
    }

  });

  $("#btnTempTerceros").click(function () {
    ZonasVentas();
    LimpiarGestionPedido();
    if ($("#link_pro").val() != '0') {
      $("#txtCodigoSAP").val($("#txt_codigoSap").val());
      $("#txtCliente").val($("#txt_cliente").val()).attr("disabled", true);
    }
  });
  $("#btnMenu8").click(function () {
    var num = $.trim($("#ped_factura").val());
    VisualizarFactura(num);
  });
  $("#txtFecha1,#txtFecha2,#EntregasFecha1,#EntregasFecha2,#txtFactFecha1,#txtFactFecha2,#txtFaltanteFecha1,#txtFaltanteFecha2").val(FechaActual());
  $("#txtFecha1,#txtFecha2,#EntregasFecha1,#EntregasFecha2,#txtFactFecha1,#txtFactFecha2,#txtFaltanteFecha1,#txtFaltanteFecha2").datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dateFormat: 'dd-mm-yy',
    width: 100,
    heigth: 100
  });
  //Inicializacion
  $("#dvCentros").hide();
  //Busqueda de clientes para filtro de pedidos 
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
    search: function () { },
    open: function (event, ui) { },

    select: function (event, ui) {
      $("#txtCodigoSAP").val(ui.item.codigo_sap);

    }
  });


  $('#txtCliente').on('keyup', function () {
    if ($(this).val() == '') {
      $("#txtCodigoSAP").val('');
    }
  });


  //Busqueda de clientes gestion de entregas
  $('#ClienteEntregas').autocomplete({
    source: function (request, response) {
      Arr_cli = ArrCli;
      valor = $.trim($("#ClienteEntregas").val());
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
      $("#CodigoSAPEntregas").val(ui.item.codigo_sap);
    }
  });

  $('#ClienteEntregas').on('keyup', function () {
    if ($(this).val() == '') {
      $("#CodigoSAPEntregas").val('');
      $("#DvListaEntregas").html('');
    }
  });
  //Busqueda de clientes en facturacion
  $('#txtFactCliente').autocomplete({
    source: function (request, response) {
      Arr_cli = ArrCli;
      valor = $.trim($("#txtFactCliente").val());
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
      $("#txtFactCodigoCliente").val(ui.item.codigo_sap);
    }
  });

  //Busqueda de clientes en faltantes
  $('#txtFaltanteCliente').autocomplete({
    source: function (request, response) {
      Arr_cli = ArrCli;
      valor = $.trim($("#txtFaltanteCliente").val());
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
      $("#txtFaltanteCodigoCliente").val(ui.item.codigo_sap);
    }
  });

  $('#txtFactCliente').on('keyup', function () {
    if ($(this).val() == '') {
      $("#txtFactCodigoCliente").val('');
      $("#DvListaFacturas").html('');
    }
  });
  //----------------------------------------------------
  $("#OficinaEntregas").on('change', function () {
    GestionEntregas();
  });
  //Busqueda o carga de cliente segun departamento

  if (DepId == 10) {
    $("#colCliente").html('<select id="txt_cliente" class="form-select size-text"></select>');
    $("#txt_cliente").on('change', function () {
      CargarClienteSeleccionado();
    });
    $("#tr_cliente_fact").hide();
    $("#tr_cliente_faltante").hide();
  } else {
    $("#tr_cliente_fact").show();
    $("#tr_cliente_faltante").show();
    $("#colCliente").html(`<div class="input-group">
								  <input type="text" id="txt_cliente" class="form-control size-text" placeholder="Búsqueda de clientes" tabindex="1">
								  <span class="input-group-btn">
									<button class="btn btn-light btn-micro" type="button" title="Búsqueda de cliente por voz" onclick="iniciarVozATexto('txt_cliente',this)">
										<i class="fa-solid fa-microphone"></i>&nbsp;
									</button>
								  </span>
								</div>`);


    $('#txt_cliente').autocomplete({
      source: function (request, response) { //alert();
        Arr_cli = ArrCli;
        valor = $.trim($("#txt_cliente").val());
        //
        if (validarSiNumero(valor) == 1) {
          Arr_cli = FiltrarCli(valor, Arr_cli, 1);
        } else {
          div_cadena = valor;
          div_cadena = div_cadena.split(" ");
          //
          for (var x = 0; x < div_cadena.length; x++) {
            expr = $.trim(div_cadena[x]);
            Arr_cli = FiltrarCli(expr, Arr_cli, 2);
          } //for 
        }
        response(Arr_cli.slice(0, 10));
      },
      maxResults: 10,
      minLength: 3,
      search: function () { },
      open: function (event, ui) { },
      select: function (event, ui) {
        $("#TxtIntegracion").attr('disabled', true);
        $("#txt_nit").val(ui.item.nit);
        $("#txt_dir").val(ui.item.direccion);
        $("#txt_tel").val(ui.item.telefonos);
        $("#txt_mail").val(ui.item.email);
        $("#txt_ciudad").val(ui.item.ciudad);
        $("#txt_cupo").val(formatNum(ui.item.cupo_credito, '$'));
        //--------------------------------------------------
        $("#txt_oficina").html(OfcN);
        $("#txt_oficina option[value='" + ui.item.bodega + "']").attr("selected", true);
        //Validamos los permisos para cambio de bodega y activamos o desactivamos esta opcion.
        if (Perm_Cambiar_Bodega != 'S') {
          $("#txt_oficina").attr("disabled", true);
        } else {
          $("#txt_oficina").attr("disabled", false);
        }
        //-------------------------------------------------------------------------------------------------------------
        $("#txt_condicion").val(ui.item.condicion_pago);
        $("#txt_lista").val(ui.item.lista);
        $("#txt_vendedor").val(ui.item.vendedor);
        $("#txt_televendedor").val(ui.item.televendedor);
        $("#txt_vendedor_tel").val(ui.item.telefono_vendedor);
        $("#txt_televendedor_tel").val(ui.item.telefono_televendedor);
        $("#txt_codigoSap").val(ui.item.codigo_sap);
        $("#txt_descuento").val(ui.item.descuento_financiero);
        $("#txt_plazo").val(ui.item.dias_pago + ' dias');
        Destinatarios(ui.item.codigo_sap, ui.item.ciudad, ui.item.direccion);
        Presupuesto_datos();
        Cartera_edades();
        if (ui.item.institucional == 1) {
          $("#txt_institucional").val('SI');
        } else {
          $("#txt_institucional").val('NO');
        }
        if (ui.item.controlados == 1) {
          $("#txt_controlado").val('SI');
        } else {
          $("#txt_controlado").val('NO');
        }
        //Activacion de tabs de productos
        // $("#liProductos").removeClass("disabled disabledTab");
        $("#btnProductos").attr("disabled", false);
        //Grupos de clientes-----------------------------------
        $("#txtGrp1").val(ui.item.grupo1);
        $("#txtGrp2").val(ui.item.grupo2);
        $("#txtGrp1,#txtGrp2").prop('disabled', true)
        //-----------------------------------
        CargarEvento();
        BuscarProductos();
        //-----------------------------------


      }
    });
  } //fin si
  Limpiar();
  //Filtros descuentos, bonificados y stock
  $(".DivCheckBox").click(function () {
    var id = $(this).attr('id');
    if ($(this).hasClass('DivCheckBoxTrue')) {
      $(this).removeClass('DivCheckBoxTrue');
    } else {
      $(this).addClass('DivCheckBoxTrue');
    }
    //id del div
    id = $(this).attr("id");
    if (id == 'DvChkKits') {
      BuscarProductos();
    }

    //if($("#txt_bproductos").val()!=''){
    var n = 0;
    var sto = 0;
    if (validarSiNumero(valor) == 1) {
      n = 1;
    }
    if ($("#DvChkStock").hasClass('DivCheckBoxTrue')) {
      sto = 1;
    } //solo con stock
    if (sto == 1) {
      BuscarProductoArr(n);
    } else {
      if (id == 'DvChkStock') {
        Swal.fire({
          title: "¿Esta seguro?",
          text: "Esta opción puede tornar lenta las búsquedas, esta seguro de continuar?",
          icon: "question",
          confirmButtonColor: "#82ED81",
          cancelButtonColor: "#FFA3A4",
          confirmButtonText: "Si,continuar",
          cancelButtonText: "No,cancelar",
          showLoaderOnConfirm: true,
          showCancelButton: true,
        }).then((result) => {
          if (result.value) {
            BuscarProductos();
          } else {
            $("#DvChkStock").addClass('DivCheckBoxTrue');
          }
        });
      } else {
        BuscarProductoArr(n);
      }
    }
    // }
  });
  $("#txt_reg").on('change', function () {
    if ($("#txt_bproductos").val() != '') {
      BuscarProductoArr();
    }
  });
  $("#txt_oficina").change(function () {
    if ($("#txt_codigoSap").val() != '') {
      BuscarProductos();
      if ($("#txt_bproductos").val() != '') {
        BuscarProductoArr();
      }
    }
  });
  $("#txt_orden").on('change', function () {
    if ($("#txt_bproductos").val() != '') {
      BuscarProductoArr();
    }
  });
  CargarEvento();
  $("#selTipos").change(function () {
    ListarEvento();
  });
  //Teclas de acceso rapido
  $(document).keyup(function (e) {
    tecla = e.keyCode;
    //Ubicar y limpiar caja de texto de busqueda de productos
    if (tecla == 113) { //Funcion tecla F2 
      var sw = 0;
      if ($("#liProductos").hasClass("disabled")) {
        sw = 1;
      }
      if (sw == 0) {
        activaTab("dvProductos");
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          var target = e.target.attributes.href.value;
          $(target + ' #txt_bproductos').focus();
        });
        $('#txt_bproductos').focus();
        $("#txt_bproductos").val('');
      }
    }
    if (tecla == 115) { //Funcion tecla F4
      var sw = 0;
      if ($("#liPedidos").hasClass("disabled")) {
        sw = 1;
      }
      if (sw == 0) {
        activaTab("dvPedidos");
        Guardar();
      }
    }


  });
  //==================================NUEVO PARA EDICION DE PEDIDOS======================================================
  $("#btnEditar").click(function () {
    $("#ModalEditarPedidos").modal("show");
  });

  $("#btnEstadisticas").click(function () {
    // Comportamiento();
    $("#ModalEstadisticas").modal("show");
    $("#container").html(`<div class="alert alert-danger">Cargando...</div>`);
    dataComportamiento()
      .then(resp => {

        let claves = pasarMeses(resp.claves);

        Highcharts.chart('container', {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Compras mes a mes'
          },
          subtitle: {
            text: '12 meses atrás'
          },
          xAxis: {
            categories: claves,
            crosshair: true
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Valor compra'
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: `<span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.0f}</b> of total<br/>`
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            },
            dataLabels: {
              enabled: true,
            }
          },
          series: [{
            name: 'valores',
            data: resp.datos

          },]
        });

      })
      .catch(err => {
        console.log(err);
        $("#container").html(`<div class="alert alert-danger">Se produjo un error!</div>`);
      })

    $("#container2").html(`<div class="alert alert-warning">Cargando...</div>`);
    top10_materiales()
      .then(resp => {

        let ano = new Date().getFullYear();
        let mes = new Date().getMonth() + 1;
        let pluginArrayArg = new Array();
        let jsonArray = '';

        resp.forEach(item => {

          let dato = new Object();
          dato.name = '(' + item.codigo_material + ') ' + item.descripcion;
          dato.y = Math.round(item.frecuencia);
          pluginArrayArg.push(dato);
        })
        jsonArray = JSON.parse(JSON.stringify(pluginArrayArg));

        if (pluginArrayArg.length > 0) {

          Highcharts.chart('container2', {
            chart: {
              type: 'column'
            },
            title: {
              text: 'TOP 20 DE PRODUCTOS MAS COMPRADOS'
            },
            subtitle: {
              text: 'Frecuencia de compra : ' + ano
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
                text: 'Frecuencia de compra'
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

          $("#container2").html('<h4>TOP 20 DE PRODUCTOS MAS COMPRADOS</h4><br><div class="alert alert-danger">Sin resultados!</div>');

        }

      }).catch(err => {
        console.error(err);
        $("#container2").html(`<div class="alert alert-danger">Se produjo un error!</div>`);
      });


    $("#container3").html(`<div class="alert alert-info">Cargando...</div>`);
    datos_cupo()
      .then(resp => {

        let datos = '';

        if (resp.length > 0) {
          datos = [{
            name: 'Disponible',
            y: parseInt(resp[0].DISPONIBLE),
            sliced: true,
            selected: true
          }, {
            name: 'Comprometido',
            y: parseInt(resp[0].COMPROMETIDO)
          }];
          $("#cupo_txt1").text('COMPROMETIDO : ' + formatNum(resp[0].COMPROMETIDO, '$'));
          $("#cupo_txt2").text('DISPONIBLE   : ' + formatNum(resp[0].DISPONIBLE, '$'));
        } else {
          datos = [{
            name: 'Disponible',
            y: 100,
            sliced: true,
            selected: true
          }, {
            name: 'Comprometido',
            y: 0
          }];
          $("#cupo_txt1").text('COMPROMETIDO : ' + formatNum(0, '$'));
          $("#cupo_txt2").text('DISPONIBLE   : ' + $("#txt_cupo").val());
        }

        Highcharts.chart('container3', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'CUPO DE CRÉDITO'
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
            name: 'Brands',
            // colorByPoint: true,
            data: datos
          }]
        });
      })
      .catch(err => {
        console.error(err);
        $("#container3").html(`<div class="alert alert-danger">Se produjo un error!</div>`);
      });

  });


  $("#btnBuscarEditar").click(function () {
    if ($("#EdtNumeroPedido").val() != '' && $("#EdtNumeroPedido").val() > 0) {
      EditarPedido($("#EdtNumeroPedido").val(), $("#EdtTipo").val());
    }
  });

  $("#txt_bproductos").keyup(function (e) {
    tecla = (document.all) ? e.keyCode : e.which;
    valor = $.trim($(this).val());
    if (valor != "") {
      if ($(this).val().length > 2) {
        if (tecla == 13) {
          //verifico si solo son numer
          //busco por codigo sap o codigo de barras
          if (validarSiNumero(valor) == 1) {
            //busco por codigo de barras
            BuscarProductoArr(1);
          } else {
            BuscarProductoArr(0);
          }

        }
      }
    } else {
      $("#dvResultProductos").html("");
      $("#n_resultados").text("");
    }

  });
  //--Fin se coloca para mitigar el problema mobil
  $("#txt_bproductos").focusout(function (e) {
    valor = $.trim($(this).val());
    if (valor != "") {
      if ($(this).val().length > 2) {
        //verifico si solo son numer
        //busco por codigo sap o codigo de barras
        if (validarSiNumero(valor) == 1) {
          //busco por codigo de barras
          BuscarProductoArr(1);
        } else {
          BuscarProductoArr(0);
        }
      }
    } else {
      $("#dvResultProductos").html("");
      $("#n_resultados").text("");
    }
  });
  //--Fin se coloca para mitigar el problema mobil
  //------nuevo para carga de archivo plano 
  $("#filename").val('');
  $("#filename").change(function (e) {
    var ext = $("input#filename").val().split(".").pop().toLowerCase();
    if ($.inArray(ext, ["csv"]) == -1) {
      alert('Solo se permiten archivos CSV');
      $("#filename").val('');
      return false;
    }
    if (e.target.files != undefined) {
      $("#ModalAjustesBusqueda").modal("hide");
      LoadImg("Subiendo CSV");
      var reader = new FileReader();
      reader.onload = function (e) {
        var csvval = e.target.result.split("\n");
        var SiAdd = new Array();
        var NoAdd = '';

        for (var i = 0; i < csvval.length; i++) { //for 1		
          var row = csvval[i];
          if (row != '') {
            var col = row.split(',');
            var desc = escapeRegExp($.trim(col[0]));
            var SwAdd = 0;
            Arr = ArrProd;
            Arr = recursiva(desc, Arr, 0, 0, 0, 1);

            if (Arr.length > 0) {
              for (var x = 0; x < Arr.length; x++) { //for 2									
                d = Arr[0];
                for (var y = 0; y < SiAdd.length; y++) {
                  if (SiAdd[y].codigo == $.trim(d.codigo_material)) {
                    SwAdd = 1
                  }
                }
                if (SwAdd == 0) {
                  cant = parseInt($.trim(col[1]));
                  reg = parseInt($.trim(d.cant_regular));
                  if ((reg > 0) && (reg > cant)) {
                    UnloadImg()
                    if (confirm("El producto " + $.trim(d.descripcion) + " presenta bonificado,"
                      + "desea aumentar la cantidad a " + reg + " unidades para ganarlo?")) {
                      cant = reg;
                    }
                    LoadImg("Subiendo CSV");
                  }
                  AddProductoPlano($.trim(d.codigo_material),
                    $.trim(d.valor_unitario),
                    $.trim(d.iva),
                    $.trim(d.descuento),
                    cant,
                    $.trim(d.valor_neto),
                    $.trim(d.stock),
                    $.trim(d.vlr_pedido),
                    $.trim(d.id_pedido),
                    $.trim(0),
                    $.trim(d.cant_bonificado),
                    $.trim(d.cant_regular),
                    $.trim(d.stock_bonificado));
                  d = {
                    'codigo': desc
                  }
                  SiAdd.push(d);
                } else {
                  NoAdd += $.trim(col[0]) + ",\n";
                }
              } //fin for 2	
            } else {
              NoAdd += $.trim(col[0]) + ",\n";
            }
          } //fin if
        } //fin for 1	

        WSInvenTotal();
        ListarPedido();
        activaTab("dvPedidos");
        $("#filename").val('');
        UnloadImg();
        if (NoAdd != '') {
          Swal.fire('Codigos no encontrados o no validos', NoAdd, 'warning');
        }
      };
      reader.readAsText(e.target.files.item(0));
    }
    return false;
  });
  if ($("#Rol").val() == '10' || $("#Dpto").val() == '11') {
    console.log('cliente o transferencista no carga competencia')
  } else {
    ListarCompetencia();
  }

  //Ferias virtuales
  $("#btnFeriaVirtual").click(function () {
    var cod = $("#txt_codigoSap").val();
    if (cod != '') {
      $("#ModalFeriaVirtual").modal('show');
      QueryFeria(4);

    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Debe seleccionar un cliente!.'
      });
    }
  });
  //Ferias Virtuales


  //Grupos Articulos
  GruposArticulos();
  $("#txtGrupoArticulo").change(function () {
    $("#txt_bproductos").val($.trim($(this).val()));
    BuscarProductoArr(0);
  });
  //Grupos Articulos	
  //Descuentos ir------------------------------------------------------------
  $("#btnDescuentos").on('click', function () {
    activaTab('dvProductos');
    if ($("#txtGrp1").val() == '100') {
      $("#txt_bproductos").val('OFERTA EXCLUSIVA CLIENTE WEB');
    } else {
      $("#txt_bproductos").val('*');
    }

    $("#DvChkDctos").addClass("DivCheckBoxTrue");
    BuscarProductoArr(0);
  });
  //Descuentos ir------------------------------------------------------------

  //carga por defecto el usuario que se le esta haciendo la gestion en el 0102 
  //
  if ($("#link_pro").val() != '') {
    preLoadCliente($("#link_pro").val());
  }

  $("#TxtIntegracion").change(function () {
    if ($("#link_pro").val() != '') {
      BuscarProductos();
    }

  });


  //Nuevo filtro para ofertas
  $("#txtFilter").val('');
  $('#txtFilter').on('input', function () {
    var filtro = $(this).val().toLowerCase();

    // Iterar sobre los paneles y ocultar/mostrar según el filtro
    $('.panel-default').each(function () {
      var textoGrupo = $(this).find('.col-md-4:eq(1)').text().toLowerCase();
      if (textoGrupo.includes(filtro)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  //Plan de puntos para clientes.
  $("#btnPuntos").click(function () {

    if ($("#txt_codigoSap").val() != '') {
      consultarPuntos($("#txt_codigoSap").val());
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe seleccionar un cliente.!.'
      });
    }
  });

  $("#buy-now").click(function () {
    crearPedidoRedencion();
  })

  var valor_rol = $("#Rol").val(); // Obtiene el valor del input
  var valoresPermitidosrol = ["12", "1", "44", "72", "13", "14"];

  // Mostrar u ocultar los divs según el valor de Rol
  $("#cartera_edades, #Presupuesto_datos").toggle(valoresPermitidosrol.includes(valor_rol));

  $('#btnMas').click(function () {
    $('#ModalMasCliente').modal('show');
  });
});

const preLoadCliente = (codigo_sap) => {

  //valido si se abrio el modulo desde el 0102 
  if (codigo_sap != '0') {

    $("#txt_numero").val('0');
    $("#btnLimpiar").attr("disabled", true);
    $("#txt_cliente").attr("disabled", true);
    $(".btns-limpiar").attr("disabled", true);


    DataCliente = FiltrarCli(codigo_sap, ArrCli, 1);


    DataCliente = DataCliente[0];


    //$("#TxtIntegracion").attr('disabled',true); 
    $("#txt_nit").val(DataCliente.nit);
    $("#txt_dir").val(DataCliente.direccion);
    $("#txt_tel").val(DataCliente.telefonos);
    $("#txt_mail").val(DataCliente.email);
    $("#txt_ciudad").val(DataCliente.ciudad);

    $("#txt_cupo").val(formatNum(DataCliente.cupo_credito, '$'));
    //-------------------------------------------------------------------------------------------------------------
    $("#txt_oficina").html(OfcN);
    $("#txt_oficina option[value='" + DataCliente.bodega + "']").attr("selected", true);
    //-------------------------------------------------------------------------------------------------------------
    $("#txt_condicion").val(DataCliente.condicion_pago);
    $("#txt_lista").val(DataCliente.lista);
    $("#txt_vendedor").val(DataCliente.vendedor);
    $("#txt_televendedor").val(DataCliente.televendedor);
    $("#txt_vendedor_tel").val(DataCliente.telefono_vendedor);
    $("#txt_televendedor_tel").val(DataCliente.telefono_televendedor);
    $("#txt_codigoSap").val(DataCliente.codigo_sap);
    $("#txt_descuento").val(DataCliente.descuento_financiero);
    $("#txt_plazo").val(DataCliente.dias_pago + ' dias');


    Destinatarios(DataCliente.codigo_sap, DataCliente.ciudad, DataCliente.direccion);
    if (DataCliente.institucional == 1) {
      $("#txt_institucional").val('SI');
    } else {
      $("#txt_institucional").val('NO');
    }
    if (DataCliente.controlados == 1) {
      $("#txt_controlado").val('SI');
    } else {
      $("#txt_controlado").val('NO');
    }
    //Activacion de tabs de productos
    // $("#liProductos").removeClass("disabled disabledTab");
    $("#btnProductos").attr("disabled", false);
    //Grupos de clientes-----------------------------------
    $("#txtGrp1").val(DataCliente.grupo1);
    $("#txtGrp2").val(DataCliente.grupo2);
    $("#txtGrp1,#txtGrp2").prop('disabled', true)
    //-----------------------------------
    $("#txt_cliente").val(DataCliente.value);
    $("#txtFaltanteCodigoCliente").val(DataCliente.codigo_sap);
    $("#txtFaltanteCliente").val(DataCliente.value).attr("disabled", true);
    CargarEvento();
    BuscarProductos();

  }

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
      var option = '<option value="">TODOS</option>'
      for (var i = 0; i <= data.length - 1; i++) {
        option += '<option value="' + data[i].GRUPO_ARTICULO + '">' + data[i].DESCRIPCION1 + '</option>'
      }
      $("#txtGrupoArticulo").html(option);
    }
  });
}

//
/*
function datos_cupo(){
  $.ajax({
    type    : "POST",
    encoding: "UTF-8",
    url     : "../models/PW-SAP.php",
    async   : false,
    dataType: "json",
    error   : function(OBJ, ERROR, JQERROR){
    },
    beforeSend : function(){
    },
    data: {
      op     : "S_CUPO_CREDITO",
      org    : $.trim($("#Organizacion").val()),
      codigo : $.trim($("#txt_codigoSap").val())
    },
    success: function(data){
      var datos = '';
  	
      if(data.length>0){
        datos = [{
            name: 'Disponible',
            y: parseInt(data[0].DISPONIBLE),
            sliced: true,
            selected: true
             }, {
            name: 'Comprometido',
            y: parseInt(data[0].COMPROMETIDO)
            }];
        $("#cupo_txt1").text('COMPROMETIDO : '+formatNum(data[0].COMPROMETIDO,'$'));
        $("#cupo_txt2").text('DISPONIBLE   : '+formatNum(data[0].DISPONIBLE,'$'));
      }else{
        datos = [{
            name: 'Disponible',
            y: 100,
            sliced: true,
            selected: true
             }, {
            name: 'Comprometido',
            y: 0
            }];
        $("#cupo_txt1").text('COMPROMETIDO : '+formatNum(0,'$'));
        $("#cupo_txt2").text('DISPONIBLE   : '+$("#txt_cupo").val());
      }
    	
             Highcharts.chart('container3', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'CUPO DE CRÉDITO'
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
            name: 'Brands',
             // colorByPoint: true,
            data: datos
          }]
        });	
    }
  }).fail(function(data){
      console.error(data);
  });	

}
*/
function consultaOpciones(pedido, alm, rdespacho, rpuntoventa) {
  alm = alm || undefined;
  rdespacho = rdespacho || undefined;
  rpuntoventa = rpuntoventa || undefined;
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    beforeSend: function () { },
    data: ({
      op: "S_GESTION_PEDIDOS_UNICO",
      pedido: pedido
    }),
    dataType: "json",
    async: true,
    success: function (data) {
      $("#ped_gestion").val(data[0].factura);
      $("#ped_numero").val(data[0].numero);
      $("#ped_valor_total").val(data[0].valor_total);
      $("#ped_destinatario").val(data[0].destinatario);
      $("#ped_bodega").val(data[0].oficina_ventas);
      $("#ped_codigo_sap").val(data[0].codigo_sap);
      $("#ped_transferido").val(data[0].transferido);
      $("#ped_numero_sap").val(data[0].numero_sap);
      $("#ped_entrega").val(data[0].entrega);
      $("#ped_ot").val(data[0].ot);
      $("#ped_factura").val(data[0].factura);
      $("#NotasRapidas").val(data[0].notas);
      if (data[0].ot > 0) {
        Prioridad_ot(data[0].ot, alm ?? "", rdespacho ?? "", rpuntoventa ?? "");
      }
      if (data[0].entrega == 0) {
        $("#NotasRapidas").attr('disabled', false);
        $("#btnNotaRapida").attr('disabled', false);
      } else {
        $("#NotasRapidas").attr('disabled', true);
        $("#btnNotaRapida").attr('disabled', true);
      }
    }
  });
}

function Notificaciones() {
  var rol = $("#Rol").val();
  var ofi = $("#Ofi").val();
  //Televentas 12
  //Ventas 14
  //Administradores 1
  /*if(rol == 14 || rol == 12 || rol == 1){
   if(ofi == 2100 || ofi == 2200 || ofi == 2300){
    $.notify({// options
      icon:    'glyphicon glyphicon-warning-sign',
      title: '<strong>CONVENCIÓN</strong></br>',
      message: '¡Vamos con toda! Convención 2022 ARUBA'+
           '  tú puedes ¡ANIMO!',
      url: '',
      target: '_blank' 
    },{// settings	
      delay : 10000,
      type: 'warning',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
    });
     }
 }*/
  //DESCUENTOS ESPECIALES PAGINA WEB
  if (rol == 10) {
    if (ofi == 2100 || ofi == 2200 || ofi == 2300 || ofi == 2400) {
      $.notify({ // options
        icon: 'glyphicon glyphicon-warning-sign',
        title: '<strong>PROMOCIONES!</strong></br>',
        message: '¡Tenemos descuentos exclusivos para clientes WEB compra ya!',
        url: '',
        target: '_blank'
      }, { // settings	
        delay: 10000,
        type: 'success',
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        },
      });
    }
  }

}
//Funcion para carga de zonas de ventas para consulta de pedidos
function PermisosZonas() {
  var rol = $("#Rol").val();
  var sw = 0;
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    async: false,
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) { },
    beforeSend: function () { },
    data: {
      op: "S_PERMISO_ZONA",
      rol: rol
    },
    success: function (data) {
      if (data.length > 0) {
        sw = 1
      }
    }
  }).fail(function (data) {
    console.error(data);
  });
  return sw;
}

function ZonasVentas() {

  var sw = PermisosZonas();
  var idUsr = $("#UsrId").val();
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    async: false,
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) { },
    beforeSend: function () { },
    data: {
      op: "S_ZONAS_VENTA",
      sw: sw,
      idUsr: idUsr
    },
    success: function (data) {
      var zonas = '';
      if (data.length > 0) {
        if (sw == 1) {
          zonas = '<option value="0">000000 - TODAS</option>';
        }
        for (var i = 0; i < data.length; i++) {
          zonas += '<option value="' + data[i].zona + '">' + data[i].zona + ' - ' + data[i].descripcion + '</option>';
        } //for	
      } else {
        zonas = '<option value="999999">NO TIENE ZONA ASIGNADA SOLICITAR AL ADMINISTRADOR</option>';
      }
      $("#txtZonas").html(zonas);
    }
  }).fail(function (data) {
    console.error(data);
  });
}
//Funcion de activacion de Tabs
function activaTab(tab) {
  $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};
//-----------------------------Funcion de carga de cliente especifico para el caso de que el usuario sea tipo cliente y no tenga opcion de seleccionar mas 
//funcion que carga la imagen de "cargando..."
function LoadImg(texto) {
  var n = 0;
  html = '<center>'
    + '<figure><img src="../resources/icons/preloader.gif" class="img-responsive"/></figure>'
    + '<figcaption>' + texto + '</figcaption>'
    + '<figcaption id="txtTimer">' + n + '</figcaption>'
    + '</center>';
  $(".centrado-porcentual").html(html);
  //$(".form-control").attr("disabled",true);
  $(".centrado-porcentual").show();
  $("#Bloquear").show();
  //Timer	
  var l = document.getElementById("txtTimer");
  window.setInterval(function () {
    l.innerHTML = n;
    n++;
  }, 1000);
}

function UnloadImg() {
  $("#Bloquear").hide();
  $(".centrado-porcentual").hide();
  //$(".form-control").attr("disabled",false);
}
//funcion que desbloquea la pantalla
function UnlockScreen(cadena) {
  $(".centrado-porcentual").html(' <center><img src="../resources/icons/llorar.png"   /></center><br><center><h3 style="width:90%; padding-left:0; margin-left:0">AL PARECER HA OCURRIDO UN ERROR AL CARGAR LOS ' + cadena + ', POR FAVOR VUELVE A INTENTARLO</h3>  </center><br>');
  $(".form-control").attr("disabled", false);
  setInterval(DesbloquearPantalla, 3000);
}
//FUNCION QUE CARGA EL ARRAY DE LOS TERCEROS DE LA ORGANIZACION X
function LoadArrayCli() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    dataType: "json",
    async: false,
    beforeSend: function () {
      LoadImg('CARGANDO CLIENTE...');
    },
    data: {
      op: "B_CLIENTE",
      org: $("#Organizacion").val(),
      sw: 'a'
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
            //--
            'telefono_vendedor': d.telefono_vendedor,
            'telefono_televendedor': d.telefono_televendedor,
            //--
            'institucional': d.institucional,
            'controlados': d.controlados,
            'dias_pago': d.dias_pago,
            'descuento_financiero': d.descuento_financiero,
            //--
            'grupo1': d.grupo1,
            'grupo2': d.grupo2,
            'grupo3': d.grupo3,
            'grupo4': d.grupo4,
            'grupo5': d.grupo5
          } //det
          ArrCli.push(det);


        } //for   for(var i=0;i<data.length;i++){

      } //				

    }
  }).done(function () {
    UnloadImg();
  }).fail(function (data) {
    console.log(data);
    UnlockScreen('TERCEROS');
  });
}

function validarSiNumero(numero) {
  x = 0;
  if (/^([0-9])*$/.test(numero)) {
    x = 1;
  }
  return x;
}

function EditarPedido(Numero, Tipo) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: {
      op: "S_EDITAR_PW",
      Numero: Numero,
      Tipo: Tipo
    },
    async: false,
    success: function (data) {
      if (data != '' && data != null) {
        $("#ModalEditarPedidos").modal("hide");
        $("#ped_numero").val(data[0].NUMERO);
        $("#ped_valor_total").val(data[0].VALOR_TOTAL);
        $("#ped_destinatario").val(data[0].DESTINATARIO);
        $("#ped_bodega").val(data[0].OFICINA_VENTAS);
        $("#ped_codigo_sap").val(data[0].CODIGO_SAP);
        $("#ped_transferido").val(data[0].TRANSFERIDO);
        $("#ped_numero_sap").val(data[0].NUMERO_SAP)
        //---------------------------------------------------------
        CargarCliente(data[0].CODIGO_SAP, 'c');
        BuscarProductos();
        $("#txt_numero").val(data[0].NUMERO);
        $("#txt_numero_sap").val(data[0].NUMERO_SAP);
        $("#txt_total").val(formatNum(data[0].VALOR_TOTAL, '$'));
        //---------------------------------------------------------
        $("#liPedidos").removeClass("disabled disabledTab");
        $("#btnPedidos").attr("data-toggle", "tab");
        $("#txt_destinatario").attr('disabled', true);
        //$("#ModalOpciones").modal("hide");
        //---------------------------------------------------------*/
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Pedido no encontrado!.'
        });
      }
    }
  });
}

function CargarEvento() {
  ///carga de evento automatico
  var DepId = $("#Dpto").val();
  if (parent.parent.$("#AbrirVentas").val() != 0) {
    if (DepId == 10 || $("#txt_codigoSap").val() != '') {
      activaTab("dvProductos");
      //-------------------------
      var grupo = parent.parent.$("#AbrirVentas").val();
      var tipo = parent.parent.$("#AbrirVentasTipo").val();
      switch (tipo) {
        case 'DES':
          {
            $("#DvChkDctos").addClass('DivCheckBoxTrue');
          }
          break;
        case 'BON':
          {
            $("#DvChkBonif").addClass('DivCheckBoxTrue');
          }
          break;
      }
      $("#txt_bproductos").val($.trim(grupo));

      BuscarProductos();
      setTimeout(function () {
        BuscarProductoArr(0);
      }, 2000);

      parent.parent.$("#AbrirVentas").val(0);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Para visualizar el evento primero debe seleccionar un cliente!.'
      });
    }
  }
}
//Nuevo para carga de multiples codigos de clientes-----------------------------------------------------------
function CargarClienteNit(codSAP, sw) {
  var expresion = new RegExp(codSAP, "i");
  var bodega = new RegExp($.trim($("#Ofi").val()));
  filtro = ArrCli.filter(nuevo => expresion.test(nuevo.nit));
  filtro = filtro.filter(filtro => bodega.test(filtro.bodega));
  var dataCliente = '';
  for (var i = 0; i < filtro.length; i++) {
    d = filtro[i];
    dataCliente += '<option value="' + d.codigo_sap + '">' + d.codigo_sap + ' | ' + d.nombres + '</option>';
  }
  $("#txt_cliente").html(dataCliente);
  CargarClienteSeleccionado();
}

function CargarClienteSeleccionado() {
  var codSAP = $("#txt_cliente").val();
  expresion = new RegExp(codSAP, "i");
  filtro = ArrCli.filter(ArrCli => expresion.test(ArrCli.codigo_sap));
  for (var i = 0; i < filtro.length; i++) {
    d = filtro[0];
    $("#txt_nit").val(d.nit);
    $("#txt_dir").val(d.direccion);
    $("#txt_tel").val(d.telefonos);
    $("#txt_mail").val(d.email);
    $("#txt_ciudad").val(d.ciudad);
    $("#txt_cupo").val(formatNum(d.cupo_credito, '$'));
    $("#txt_oficina").html('<option value="' + d.bodega + '">' + d.bodega_desc + '</option>');
    //$("#txt_oficina").html(OfcN);
    $("#txt_oficina option[value='" + d.bodega + "']").attr("selected", true);
    $("#txt_condicion").val(d.condicion_pago);
    $("#txt_lista").val(d.lista);
    $("#txt_vendedor").val(d.vendedor);
    $("#txt_televendedor").val(d.televendedor);
    $("#txt_vendedor_tel").val(d.telefono_vendedor);
    $("#txt_televendedor_tel").val(d.telefono_televendedor);
    $("#txt_codigoSap").val(d.codigo_sap);
    $("#txt_descuento").val(d.descuento_financiero);
    $("#txt_plazo").val(d.dias_pago + ' dias');
    $("#txt_destinatario").attr('enable', true);
    $('#txt_cliente').prop('readonly', true);
    //Grupo cliente-------------------------
    $("#txtGrp1").val(d.grupo1);
    $("#txtGrp2").val(d.grupo2);
    //Grupo cliente-------------------------
    $("#txtGrp1,#txtGrp2").prop('disabled', true);
    Destinatarios(d.codigo_sap, d.ciudad, d.direccion);
    if (d.institucional == 1) {
      $("#txt_institucional").val('SI');
    } else {
      $("#txt_institucional").val('NO');
    }
    if (d.controlados == 1) {
      $("#txt_controlado").val('SI');
    } else {
      $("#txt_controlado").val('NO');
    }
  }
  BuscarProductos();
}
//fin nueva carga de clientes---------------------------------------------------------------------------------------
function CargarCliente(codSAP, sw) {
  expresion = new RegExp(codSAP, "i");
  filtro = ArrCli.filter(ArrCli => expresion.test(ArrCli.codigo_sap));
  for (var i = 0; i < filtro.length; i++) {
    d = filtro[0];
    $('#txt_cliente').val(d.value);
    $("#txt_nit").val(d.nit);
    $("#txt_dir").val(d.direccion);
    $("#txt_tel").val(d.telefonos);
    $("#txt_mail").val(d.email);
    $("#txt_ciudad").val(d.ciudad);
    $("#txt_cupo").val(formatNum(d.cupo_credito, '$'));
    $("#txt_oficina").html('<option value="' + d.bodega + '">' + d.bodega_desc + '</option>');
    $("#txt_condicion").val(d.condicion_pago);
    $("#txt_lista").val(d.lista);
    $("#txt_vendedor").val(d.vendedor);
    $("#txt_televendedor").val(d.televendedor);
    $("#txt_codigoSap").val(d.codigo_sap);
    $("#txt_descuento").val(d.descuento_financiero);
    $("#txt_plazo").val(d.dias_pago + ' dias');
    $("#txt_destinatario").attr('enable', true);
    $('#txt_cliente').prop('readonly', true);
    Destinatarios(d.codigo_sap, d.ciudad, d.direccion);
    if (d.institucional == 1) {
      $("#txt_institucional").val('SI');
    } else {
      $("#txt_institucional").val('NO');
    }
    if (d.controlados == 1) {
      $("#txt_controlado").val('SI');
    } else {
      $("#txt_controlado").val('NO');
    }
  }
  //BuscarProductos();
}
//-----------------------Limpieza y actualizacion de campos
function Limpiar() {
  $("#txt_cliente").focus();
  //Organizacion de ventas traida desde el menu
  $("#Organizacion").val(parent.parent.$("#org").val());
  //Datos del pedido
  $("#txt_bproductos").val('');
  $("#txt_total").val('$0');
  $("#txt_numero").val('0');
  $("#txt_numero_sap").val('0');
  $("#dvResultProductos").html('');
  //--------------------------------
  $("#txt_descuento").val('');
  $("#txt_plazo").val('');
  $("#txt_nit").val('');
  $("#txt_dir").val('');
  $("#txt_tel").val('');
  $("#txt_mail").val('');
  $("#txt_ciudad").val('');
  $("#txt_cupo").val('');
  $("#txt_oficina").html('');
  $("#txt_condicion").val('');
  $("#txt_lista").val('');
  $("#txt_vendedor").val('');
  $("#txt_televendedor").val('');

  $("#txt_codigoSap").val('');
  $("#txt_institucional").val('');
  $("#txt_controlado").val('');
  $("#txt_destinatario").html('');
  $("#txt_destinatario").attr('disabled', false);
  $("#btnDescuentos").hide();
  //Deshabilitar pestañas---------------------------------
  // $("#liProductos").addClass("disabled disabledTab");
  $("#btnProductos").attr("disabled", true);
  $("#liPedidos").addClass("disabled disabledTab");
  $("#btnPedidos").removeAttr("data-toggle", "tab");
  //------------------------------------------------------
  $('#txt_cliente').prop('readonly', false);
  $("#txt_oficina").attr('disabled', false);
  var DepId = $("#Dpto").val();
  if (DepId == 10) {
    CargarClienteNit($.trim($("#Nit").val()), 'c');
  } else {
    $('#txt_cliente').val('');
  }
  //Control de visualizacion de cupo de credito 
  if (DepId != 10 //Clientes 
    && DepId != 11 //Transferencistas Internas
    && DepId != 13 //Transferencistas Externas
    && DepId != 9) { //Proveedores
    //if($("#Ofi").val()!='2200' && $("#Ofi").val()!='2300'  && $("#Ofi").val()!='2400' ){
    $("#trTipoPed").show();
    //}
    $("#trCondicion").show();
    $("#trCupo").show();
    $("#btnEstadisticas").show();
  } else {
    $("#trCondicion").hide();
    $("#trCupo").hide();
    $("#trTipoPed").hide();
    $("#btnEstadisticas").hide();
  }
  //Control de visualizacion de eventos de mercadeo
  if (DepId != 11 //Transferencistas Internas
    && DepId != 13 //Transferencistas Externas
    && DepId != 9) { //Proveedores
    $('[href="#dvEventos"]').closest('li').show();
    $("#separadorEventos").show();
  } else {
    $('[href="#dvEventos"]').closest('li').hide();
    $("#separadorEventos").hide();
  }
  if ($.trim($("#Rol").val()) == 9 || $.trim($("#Rol").val()) == 11 || $.trim($("#Rol").val()) == 120) { //Transferencistas y proveedores
    $("#btnEditar").hide();
    $("#btnTempTerceros").hide();
    $("#btnAddEntregas").hide();
    $("#separadorEntregas").hide();
    $("#btListaFacts").hide();
    $("#separadorFacturas").hide();
    $("#btnMenu5").hide();
    $("#btnMenu6").hide();
    $("#btnMenu7").hide();
    $("#btnMenu8").hide();
  } else if ($.trim($("#Rol").val()) == 10) { // Clientes
    $("#btnEditar").hide();
    $("#btnTempTerceros").hide();
    $("#btnAddEntregas").hide();
    $("#separadorEntregas").hide();
    $("#btnMenu5").hide();
    $("#btnMenu6").hide();
    $("#btnMenu7").hide();
    $("#btnMenu8").hide();
    $("#btnDescuentos").show();
    $("#btnDescuentos").show();
  }
  //alert($.trim($("#Rol").val()) )
  //---eliminar pedidos y eliminar OT
  if ($.trim($("#Rol").val()) == 1 || $.trim($("#Rol").val()) == 3 || $.trim($("#Rol").val()) == 13) {
    $("#btnMenu5").show();
    $("#btnEliminaOT").show();
  } else {
    $("#btnMenu5").hide();
    $("#btnEliminaOT").hide();
  }
  //------------------------------------------------
  //$(".form-control").attr("disabled",false);
  $("#n_resultados").text("");
  $("#OficinaEntregas").html(OfcN);
  $("#TxtIntegracion").val('N');

  $("#TxtIntegracion").attr('disabled', false);


  if ($("#link_pro").val() != '0') {
    $("#btnLimpiar").attr("disabled", true)
  }
  $('#cartera_edades, #Presupuesto_datos').empty();

}

function InfoBon(descripcion, desc_bonificado_n, stock, stock_bonificado, condicion, stock_prepack) {
  Swal.fire({
    title: 'BONIFICADO',
    html: '<table border="0" class="form" width="100%">'
      + '<tr>'
      + '<td colspan="4" align="center"><b>CONDICION OFERTA : ' + condicion + '</b></td>'
      + '</tr>'
      + '<tr>'
      + '<td align="left"><b>REGULAR</b></td>'
      + '<td align="left">' + descripcion + '</td>'
      + '<td align="left"><b>STOCK</b></td>'
      + '<td align="left">' + stock + '</br>'
      + '</tr>'
      + '<tr>'
      + '<td align="left" width="20%"><b>BONIFICADO</b></br>'
      + '<td align="left">' + desc_bonificado_n + '</td>'
      + '<td align="left"><b>STOCK</b></td>'
      + '<td align="left">' + stock_bonificado + '</b>'
      + '</tr>'
      + '<tr>'
      + '<td colspan="4" align="center"><b>OFERTAS DISPONIBLES : ' + stock_prepack + '</b></td>'
      + '</tr>'
      + '</table>',
    showCloseButton: true,
    confirmButtonText: 'Cerrar'
  });
}

function getCleanedString(cadena) {
  // Definimos los caracteres que queremos eliminar
  var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";
  // Los eliminamos todos
  for (var i = 0; i < specialChars.length; i++) {
    cadena = cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
  }
  // Lo queremos devolver limpio en minusculas
  cadena = cadena.toLowerCase();
  // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
  // cadena = cadena.replace(/ /g,"_");
  // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
  cadena = cadena.replace(/á/gi, "a");
  cadena = cadena.replace(/é/gi, "e");
  cadena = cadena.replace(/í/gi, "i");
  cadena = cadena.replace(/ó/gi, "o");
  cadena = cadena.replace(/ú/gi, "u");
  cadena = cadena.replace(/ñ/gi, "n");
  return cadena.toUpperCase();
}

function ordenarAsc(p_array_json, p_key) {
  cont = 0;
  p_array_json.sort(function (a, b) {
    return a[p_key] > b[p_key];
  });
}

function ordenar(op, ob) {
  obj = $(ob);
  switch (parseInt(op)) {
    case 1:
      key = "descripcion";
      break;
    case 2:
      key = "valor_unitario";
      break;
    case 3:
      key = "descuento";
      break;
    case 4:
      key = "stock";
      break;
    default:
      key = "descripcion";
      break;
  }
  new_ord = "";
  if (obj.hasClass("glyphicon-triangle-bottom")) {
    new_ord = "asc";
    cl = "glyphicon-triangle-top";
  } else {
    new_ord = "desc";
    cl = "glyphicon-triangle-bottom";
  }
  sortJSON(Arr, key, new_ord);
  TableView(Arr, op, cl);
}

function sortJSON(data, key, orden) {
  return data.sort(function (a, b) {
    var x = a[key],
      y = b[key];

    if (orden === 'asc') {
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    if (orden === 'desc') {
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    }
  });

}

function TableView(filas, n, cl) {
  const op_inf = $("#DvChkKits").hasClass('DivCheckBoxTrue') ? 1 : 0;
  const org = $.trim($("#Organizacion").val());

  // Generar encabezados de tabla con ordenamiento dinámico
  const headers = [
    { title: 'CODIGO', breakpoints: 'xs', sortable: false },
    { title: 'DESCRIPCION', sortable: true, sortOrder: n === 1 ? cl : '' },
    { title: 'VALOR', breakpoints: 'xs', sortable: true, sortOrder: n === 2 ? cl : '' },
    { title: 'IVA', breakpoints: 'xs', sortable: false },
    { title: 'DCTO', breakpoints: 'xs', sortable: true, sortOrder: n === 3 ? cl : '' },
    { title: 'VNETO', breakpoints: 'xs', sortable: false },
    { title: 'STOCK', breakpoints: 'xs', sortable: true, sortOrder: n === 4 ? cl : '' },
    { title: 'CANTIDAD', width: '20px', sortable: false },
    { title: 'TOTAL', breakpoints: 'xs', width: '120px', sortable: false },
    { title: 'ID', visible: false, sortable: false },
    { title: 'INFO', breakpoints: 'xs', sortable: false }
  ];

  // Construir el HTML de la tabla
  let tabla = `
    <table class="table" align="center" width="100%" id="tableProd">
      <thead>
        <tr>
          ${headers.map(header => `
            <th ${header.breakpoints ? `data-breakpoints="${header.breakpoints}"` : ''}
                ${header.width ? `style="width:${header.width}"` : ''}
                ${header.visible === false ? 'data-visible="false"' : ''}
                ${header.sortable ? `onclick="ordenar(${headers.findIndex(h => h.title === header.title)}, this)"` : ''}
                class="${header.sortable ? 'ordenArr' : ''} ${header.sortOrder || ''}">
              <span>${header.title}</span>
            </th>
          `).join('')}
        </tr>
      </thead>
      <tbody>
  `;

  // Generar filas de datos
  filas.forEach((d, i) => {
    const Bonifica = d.bonificado != 0 && (parseInt(d.stock_bonificado) >= parseInt(d.cant_bonificado)) ? 1 : 0;
    const cantPedido = d.cant_pedido == 0 ? '' : d.cant_pedido;
    const vlrPedido = d.cant_pedido == 0 ? '' : d.vlr_pedido;

    // Generar iconos
    const img = Bonifica ?
      `<img src="../resources/icons/regalo.png" width="24" height="24" 
            onclick="InfoBon('${d.descripcion}','${d.desc_bonificado_n}','${d.stock}',
                    '${d.stock_bonificado}','${d.condicion_b}','${d.stock_prepack}')" 
            align="absmiddle">` : '';

    const img_desc = parseInt(d.descuento_adg) > 0 ?
      `<span class="glyphicon glyphicon-star-empty alert-warning" aria-hidden="true"></span> <b>%</b> ` : '';

    const img_new = parseInt(d.dias_creacion) <= 90 ?
      `<img src="../resources/icons/nuevo.png" width="24" title="* Producto Nuevo *" height="24" align="absmiddle">` : '';

    // Iconos específicos para Roma
    let img_1 = '', img_2 = '', img_3 = '';
    if (org === '2000') {
      img_1 = parseInt(d.img1) === 1 ?
        `<img src="../resources/icons/pw/aniversario.png" width="32" title="FERIA ROMA" height="32" align="absmiddle">` : '';
      img_2 = parseInt(d.img2) === 1 ?
        `<img src="../resources/icons/pw/70star.png" width="24" title="PRODUCTO ESTRELLA" height="24" align="absmiddle">` : '';
    }

    const ofertado = d.codigo_material.substring(0, 4);
    img_3 = ofertado === '4000' ?
      `<img src="../resources/icons/pw/tag_marcado.png" width="24" title="PRODUCTO OFERTADO" height="24" align="absmiddle">` : '';

    // Construir fila
    tabla += `
      <tr>
        <td>${img_new}${d.codigo_material}</td>
        <td>${img_3} ${img} ${img_desc} ${d.descripcion} ${img_1} ${img_2}</td>
        <td style="background-color:#64D4F7">${formatNum(d.valor_unitario, '$')}</td>
        <td>${d.iva}</td>
        <td>${d.descuento}</td>
        <td style="background-color:#95F3E8">${formatNum(d.valor_neto, '$')}</td>
        <td>${d.stock}</td>
        <td>
          <input type="number" 
                 id="CAF${d.codigo_material}" 
                 onKeyPress="return vnumeros(event)" 
                 value="${cantPedido}" 
                 class="form-control" 
                 tabindex="${i + 1}"
                 onBlur="AddProducto(
                   '${$.trim(d.codigo_material)}',
                   '${$.trim(d.valor_unitario)}',
                   '${$.trim(d.iva)}',
                   '${$.trim(d.descuento)}',
                   this.value,
                   '${$.trim(d.valor_neto)}',
                   '${$.trim(d.stock)}',
                   '${$.trim(d.vlr_pedido)}',
                   '${$.trim(d.id_pedido)}',
                   '${$.trim(Bonifica)}',
                   '${$.trim(d.cant_bonificado)}',
                   '${$.trim(d.cant_regular)}',
                   '${$.trim(d.stock_bonificado)}'
                 )">
        </td>
        <td>
          <input type="text" class="form-control" id="TOF${d.codigo_material}" 
                 value="${formatNum(vlrPedido, '$')}" disabled readonly>
        </td>
        <td>
          <input type="text" class="form-control" value="${d.id_pedido}" 
                 id="IDF${d.codigo_material}" disabled readonly>
        </td>
        <td align="center">
          <button type="button" class="btn btn-sm btn-default" 
                  onClick="InfoMaterial(
                    '${$.trim(d.codigo_material)}',
                    '${$.trim(d.valor_unitario, '$')}',
                    '${$.trim(d.iva)}',
                    '${$.trim(d.descuento)}',
                    '${$.trim(d.descripcion)}',
                    '${$.trim(d.stock)}',
                    ${d.op_inf}
                  )">
            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
          </button>
        </td>
      </tr>
    `;
  });

  tabla += `
      </tbody>
    </table>
  `;

  $("#dvResultProductos").html(tabla);
  $('#tableProd').footable();
}
function GuardarShoping() {
  $.ajax({
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    type: "POST",
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: ({
      op: "GUARDA_SHOPING",
      codigo_sap: $("#txt_codigoSap").val(),
      shoping_codmaterial: $("#shoping_codmaterial").val(),
      shoping_preciomaterial: unformatNum($("#shoping_preciomaterial").val()),
      shoping_lista: $("#txt_lista").val(),
      shoping_usuario: $("#UsrLogin").val(),
      competencia: $("#shoping_competencia").val(),
      valor_competencia: $("#shoping_valor").val(),
      shoping_observacion: $("#shoping_observacion").val(),
      oficina: $("#txt_oficina").val()
    }),
    dataType: "html",
    async: false,
    success: function (data) {
      Swal.fire('Excelente.', 'Informacion almacenada correctamente.', 'success');
      $("#shoping_observacion").val('');
      $("#shoping_valor").val('');
    }

  });
}

function ListarCompetencia() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/Listar_fidelizados.php",
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) {

    },
    data: {
      op: "LISTA_COMPETENCIA",
      organizacion: $("#Organizacion").val()
    },
    async: false,
    success: function (data) { //alert(data); return false;
      var option = '';
      for (var i = 0; i <= data.length - 1; i++) {
        option += '<option value="' + data[i].ID + '">' + data[i].NOMBRE + '</option>'
      }
      $("#shoping_competencia").html(option);


    }
  }).fail(function (data) {
    console.log(data);
  });
}

//FILTROS
function FiltrarCli(expr, ArrayCli, op) {
  // Convertir 'expr' en una expresión regular para búsqueda insensible a mayúsculas/minúsculas
  const expresion = new RegExp(expr, "i");
  let filtro = [];

  // Filtrar según la opción 'op' usando un solo ciclo de iteración
  switch (parseInt(op)) {
    case 1: // Filtrar por código SAP, NIT o teléfonos
      filtro = ArrayCli.filter(cliente => {
        return expresion.test(cliente.codigo_sap)
          || expresion.test(cliente.nit)
          || expresion.test(cliente.telefonos);
      });
      break;

    case 2: // Filtrar por nombres o razón comercial
      filtro = ArrayCli.filter(cliente => {
        return expresion.test(cliente.nombres)
          || expresion.test(cliente.razon_comercial);
      });
      break;

    default:
      // En caso de que 'op' no coincida con ninguna opción válida, retornar array vacío
      filtro = [];
      break;
  }

  return filtro;
}


function recursiva(expr, ArrayP, st, des, f_bon, isnum, f_new, f_ofe) {
  // Crear una expresión regular basada en la entrada 'expr' (ignorar mayúsculas y minúsculas)
  let expresion = new RegExp(expr, "i");

  // Si 'isnum' es 1 (es número), buscar por código de barras
  if (isnum == 1) {
    // Buscar en el array de códigos de barras el código del material
    for (let c = 0; c < ArrEan.length; c++) {
      let cod = ArrEan[c];
      if (cod.ean == expr) {
        expresion = new RegExp(cod.codigo_material, "i");
        break; // Detener la búsqueda una vez encontrado
      }
    }
  }

  // Filtrar el array 'ArrayP' según la expresión y/o otras condiciones
  let filtro = ArrayP.filter(item => {
    // Comprobar si la descripción o el código de material coinciden con la expresión
    return expresion.test(item.descripcion) || expresion.test(item.codigo_material);
  });

  // Aplicar filtros adicionales según los parámetros
  if (st == 1) {
    filtro = filtro.filter(item => item.stock > 0);
  }
  if (des == 1) {
    filtro = filtro.filter(item => item.descuento > 0);
  }
  if (f_bon == 1) {
    filtro = filtro.filter(item => item.bonificado > 0);
  }
  if (f_new == 1) {
    filtro = filtro.filter(item => item.dias_creacion <= 90);
  }
  if (f_ofe == 1) {
    filtro = filtro.filter(item => item.codigo_material.substring(0, 4) == '4000');
  }

  return filtro;
}


function AddProductoPlano(pcodigo, pvalor, piva, pdcto, pcant, pneto, pstock, pvrlped, pidped, pbonifica, pcantbon, pcantreg, pstobon) {
  var oficina = $("#txt_oficina").val();
  var codigo = pcodigo;
  //------------------------------------------------------
  var vlr_unitario = pvalor;
  var iva = piva;
  var descuento = pdcto;
  var cant = isNaN(pcant) || pcant == '' ? 0 : parseInt(pcant);
  var precio = pneto;
  var stock = parseInt(pstock);
  var totalfila = parseFloat(precio) * parseInt(cant);
  var totalped = unformatNum($("#txt_total").val());
  var NumPed = $("#txt_numero").val();
  var idfila = 'IDF' + pcodigo;
  //Variables de control de envio de bonificacion-
  var Bonifica = pbonifica //--
  var CantBonifica = pcantbon //--
  var CantRegular = pcantreg //--
  var StockBonifica = pstobon //--
  //----------------------------------------------
  //return false;
  if (cant > 0) { //validacion de cantidad mayor a cero   
    //------------Encabezado----------------------------------------------------------------------------
    if (NumPed == 0) {
      NumPed = InsertarEncabezado(); //Se inserta el encabezado
      $("#txt_numero").val(NumPed);
    }
    if (NumPed > 0) {
      totalped = (totalped + totalfila);
      $("#txt_total").val(formatNum(totalped, '$'));
      InsertarDetalle(NumPed, codigo, cant, vlr_unitario, descuento, totalfila, iva); //Se inserta el detalle
    }
  }
}

function BuscarProductoArr(isn) {
  var desc = $.trim($("#txt_bproductos").val()).toUpperCase(); //descripcion del producto
  var bodega = $("#txt_oficina").val(); //bodega
  var lista = $("#txt_lista").val(); //lista de precio del cliente
  var numero = $("#txt_numero").val(); //numero del pedido temporal
  var eps = $("#txt_institucional").val(); //eps
  var ctrl = $("#txt_controlado").val(); //si es controlado
  var top = $("#txt_reg").val(); //top de busqueda
  var orden = $("#txt_orden").val(); //ordenar 
  /*------------Filtros de busqueda-------------------------------------------------*/
  var f_sto = 0;
  var f_dto = 0;
  var f_bon = 0;
  var f_bar = 0;
  var f_new = 0;
  var f_ofe = 0;
  if ($("#DvChkStock").hasClass('DivCheckBoxTrue')) {
    f_sto = 1;
  } //solo con stock
  if ($("#DvChkDctos").hasClass('DivCheckBoxTrue')) {
    f_dto = 1;
  } //con descuentos
  if ($("#DvChkBonif").hasClass('DivCheckBoxTrue')) {
    f_bon = 1;
  } //con bonificados
  if ($("#DvChkBarras").hasClass('DivCheckBoxTrue')) {
    f_bar = 1;
  } //codigo de barras	
  if ($("#DvChkNuevos").hasClass('DivCheckBoxTrue')) {
    f_new = 1;
  } //Productos nuevos	
  if ($("#DvChkOfertado").hasClass('DivCheckBoxTrue')) {
    f_ofe = 1;
  } //Productos ofertados	

  //alert(f_bon);
  //recorro el array
  //codigo de material pos=0
  //descripcion        pos=1
  var sh_cod = 0;
  var sh_ean = 0;
  var sh_des = 0;
  var desc = escapeRegExp(desc);
  if (desc != "") {
    var div_cadena = desc.split(" ");
    var new_arr = new Array();
    var expr = "";
    Arr = ArrProd;
    //bloqueo la caja de texto 
    //coloco cargando en div de busqueda
    $("#txt_bproductos").attr("disabled", true);
    //****************************************************
    if (isn == 1) { //es numero
      Arr = recursiva(desc, Arr, f_sto, f_dto, f_bon, isn, f_new, f_ofe);
    } else {

      for (var x = 0; x < div_cadena.length; x++) {
        //limpio la cadena
        expr = $.trim(div_cadena[x]);
        Arr = recursiva(expr, Arr, f_sto, f_dto, f_bon, isn, f_new, f_ofe);
      }
    }
    if (Arr.length > 0) {
      TableView(Arr, 1, 'glyphicon-triangle-bottom');
      $("#n_resultados").html(Arr.length + ' Coincidencias encontradas');
    } else {
      $("#dvResultProductos").html('<div class="alert alert-danger" role="alert">'
        + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
        + '<span class="sr-only">Error:</span>  NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS'
        + '</div>');
      $("#n_resultados").html('0 resultados');
    }
    $("#txt_bproductos").attr("disabled", false);
  }
}

function CargarEan() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    async: true,
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) { },
    beforeSend: function () { },
    data: {
      op: "B_EAN"
    },
    success: function (data) {

      for (var i = 0; i < data.length; i++) {
        d = data[i];
        e = {
          'codigo_material': d.codigo_material,
          'ean': d.ean
        }
        ArrEan.push(e);
      } //for
    }
  }).fail(function (data) {
    console.error(data);
  });
}
//---------------------------------Funcion para busqueda de productos 
function BuscarProductos() {
  var desc = $.trim($("#txt_bproductos").val());
  var bodega = $("#txt_oficina").val();
  var lista = $("#txt_lista").val();
  var numero = $("#txt_numero").val();
  var eps = $("#txt_institucional").val();

  var ctrl = $("#txt_controlado").val();
  var top = $("#txt_reg").val();
  var orden = $("#txt_orden").val();
  var CodigoSAP = $("#txt_codigoSap").val();
  //Grupos de terceros ------------------
  var Grp1 = $("#txtGrp1").val();
  var Grp2 = $("#txtGrp2").val();
  //-------------------------------------
  /*------------Filtros de busqueda-------------------------------------------------*/
  var f_sto = 0;
  var f_dto = 0;
  var f_bon = 0;
  var f_bar = 0;
  var f_new = 0;
  if ($("#DvChkStock").hasClass('DivCheckBoxTrue')) {
    f_sto = 1;
  }
  if ($("#DvChkDctos").hasClass('DivCheckBoxTrue')) {
    f_dto = 1;
  }
  if ($("#DvChkBonif").hasClass('DivCheckBoxTrue')) {
    f_bon = 1;
  }
  if ($("#DvChkBarras").hasClass('DivCheckBoxTrue')) {
    f_bar = 1;
  }
  if ($("#DvChkNuevos").hasClass('DivCheckBoxTrue')) {
    f_new = 1;
  } //Productos nuevos	
  /*
 //valido si se abre desde la ventana de 0102 y selecciono por defecto el valor enviado en $_GET["pedido_integracion"]	
  if($("#pedido_integracion").val()!=''){
   if($("#pedido_integracion").val()=='S'){
    $("#TxtIntegracion").val('S');
   }else{
     $("#TxtIntegracion").val('N');
   }
  }*/

  var TipoPed = $("#TxtIntegracion").val();

  /*-----------Filtro de caso para productos regulares o Kits-----------------------*/
  var op_sw = 'B_PRODUCTOS';
  var op_inf = 0;
  if ($("#DvChkKits").hasClass('DivCheckBoxTrue')) {
    op_sw = 'B_PRODUCTOS_KIT';
    op_inf = 1;
  }
  /*--------------------------------------------------------------------------------*/

  //console.log('Bodega : '+bodega);
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    async: true,
    dataType: "json",
    beforeSend: function () {
      LoadImg('CARGANDO PORTAFOLIO...');
    },
    data: {
      op: op_sw,
      desc: desc,
      bodega: bodega,
      lista: lista,
      numero: numero,
      eps: eps,
      ctrl: ctrl,
      f_sto: f_sto,
      f_dto: f_dto,
      f_bon: f_bon,
      f_bar: f_bar,
      top: top,
      orden: orden,
      TipoPed: TipoPed,
      f_new: f_new,
      Grp1: Grp1,
      Grp2: Grp2,
      CodigoSAP: CodigoSAP
    },
    success: function (data) {
      ArrProd = [];
      for (var i = 0; i < data.length; i++) {
        d = data[i];
        det = {
          'codigo_material': d.codigo_material,
          'descripcion': $.trim(d.descripcion),
          'valor_unitario': d.valor_unitario,
          'iva': d.iva,
          'descuento': d.descuento,
          'stock': d.stock,
          'valor_neto': d.valor_neto,
          'valor_bruto': d.valor_bruto,
          'bonificado': d.bonificado,
          'desc_bonificado_n': d.desc_bonificado_n,
          'stock_bonificado': d.stock_bonificado,
          'cant_bonificado': d.cant_bonificado,
          'cant_regular': d.cant_regular,
          'condicion_b': d.condicion_b,
          'stock_prepack': d.stock_prepack,
          'cant_pedido': d.cant_pedido,
          'id_pedido': d.id_pedido,
          'vlr_pedido': d.vlr_pedido,
          'grupo_articulo': d.grupo_articulos,
          'descuento_adg': d.descuento_adg,
          'dias_creacion': d.dias_creacion,
          'img1': d.img1,
          'img2': d.img2,
          'op_inf': d.op_inf
          /*,
                     'codigos_ean'          :d.codigos_ean */
        } //det={
        ArrProd.push(det);


      } //for
      // console.log('Registros ARRAY : '+ArrProd.length);
      sortJSON(ArrProd, 'descripcion', 'asc');
      // $("#liProductos").removeClass("disabled disabledTab");
      $("#btnProductos").attr("disabled", false);
      CargarEan(); //se comenta para ver como funciona el rendimiento

    }
  }).done(function () {
    UnloadImg();
  }).fail(function (data) {
    console.error(data);
    UnlockScreen('PRODUCTOS');
  });
}

function DesbloquearPantalla() {
  $("#Bloquear").hide();
  $(".centrado-porcentual").hide();
}

//---------------------Funcion que permite guardar la huella de faltante
function GuardarHuella() {
  $.ajax({
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    type: "POST",
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: ({
      op: "G_HUELLA",
      codigo_sap: $("#txt_codigoSap").val(),
      codigo_material: $("#huella_codmaterial").val(),
      cantidad: $("#huella_cantidad").val(),
      oficina: $("#txt_oficina").val(),
      usuario: $("#UsrLogin").val(),
      pedido: $("#txt_numero").val(),
      nota: $("#huella_notas").val(),
      valor: unformatNum($("#shoping_preciomaterial").val()),
      dcto: $("#huella_dcto").val(),
      stock: $("#huella_stock").val()
    }),
    dataType: "html",
    async: false,
    success: function (data) { //alert(data); return false;
      Swal.fire('Excelente.', 'Informacion almacenada correctamente.', 'success');
      $("#huella_cantidad").val('');
      $("#huella_notas").val('');
    }
  });
}


const validarUrlImg = async (codigo) => {
  try {
    codigo = codigo.substring(0, 1) != "8" ? "1" + codigo.substring(1) : codigo;
    const url = `https://app.pwmultiroma.com/web/imagenesMateriales/${codigo}.png`;
    const defaultUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/480px-Imagen_no_disponible.svg.png";

    const img = new Image();
    img.onload = function () {
      $(".img-material").attr("src", url);
    };
    img.onerror = function () {
      $(".img-material").attr("src", defaultUrl);
    };
    img.src = url;

    // Aplicar el tamaño aunque la imagen no haya cargado aún
    $(".img-material").css({ width: 400, height: 345 });

  } catch (e) {
    console.error(e);
    $(".img-material").attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/480px-Imagen_no_disponible.svg.png");
  }
};



//---------------------Funcion de informacion adicional del producto (codigo,descripcion,fecha y lotes)
function InfoMaterial(pcodigo, pvalor, piva, pdcto, pdesc, pstock, op) {
  // Configuración inicial
  const vunit = parseFloat(pvalor);
  const iva = parseInt(piva);
  const dcto = parseInt(pdcto);
  const org = $("#Organizacion").val();
  const ofi = $("#txt_oficina").val();
  const lst = $("#txt_lista").val();
  const opc = op === 0 ? 'B_INFO_MATERIAL' : 'B_INFO_KIT';

  // Cálculos financieros
  const v1 = Math.round(vunit - ((vunit * dcto) / 100));
  const dtoPP = parseInt($("#txt_descuento").val());
  const v2 = Math.round(v1 * (iva / 100));
  const v3 = Math.round((vunit * dcto) / 100);

  let v4 = 0;
  if (pcodigo.substring(0, 1) !== '9') {
    v4 = Math.round((v1 - (v1 * (dtoPP / 100)) + v2));
  }

  // Configurar valores en el modal
  $("#huella_codmaterial").val(pcodigo);
  $("#huella_descripcion").val(pdesc);
  $("#huella_dcto").val(dcto);
  $("#huella_stock").val(pstock);

  $("#shoping_codmaterial").val(pcodigo);
  $("#shoping_descripcion").val(pdesc);
  $("#shoping_preciomaterial").val(formatNum(vunit, '$'));

  // Mostrar modal
  $('#ModalInfoMaterial').modal('show');

  // Cargar datos
  $.ajax({
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    type: "POST",
    beforeSend: function () {
      $('#ContenidoInfoMateriales').html(`
        <div class="alert alert-info m-2">
          <i class="fas fa-spinner fa-spin"></i> Cargando...
        </div>
      `);
    },
    data: { op: opc, cod: pcodigo, org, ofi, lst },
    dataType: "json",
    success: function (data) {// console.log(data); return ;
      if (op === 0) {
        renderMaterialInfo(data, { vunit, v1, v2, v3, v4, iva, dcto });
      } else {
        renderKitInfo(data);
      }
      validarUrlImg(pcodigo);
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud AJAX:", status, error);
      $('#ContenidoInfoMateriales').html(`
        <div class="alert alert-danger m-2">
          Error al cargar la información del material
        </div>
      `);
    }
  });
}

// Función para renderizar información de material
function renderMaterialInfo(data, { vunit, v1, v2, v3, v4, iva, dcto }) {
  const ins = data[0].INSTITUCIONAL == 1 ? 'SI' : 'NO';
  const ctrl = data[0].CONTROLADO == 1 ? 'SI' : 'NO';

  const stockRows = data[0]['INVENTARIO_LOTES'].map(item => `
    <tr>
      <td>${item.CENTRO} </tb>
      <td>${item.ALMACEN} </td>
      <td>${item.TIPO_MOV}</td>
      <td>${item.LOTE}</td>
      <td>${item.VMCTO}</td>
      <td>${parseInt(item.CANTIDAD)}</td>
      <td>${item.UBICACION}</td>
    </tr>
  `).join('');

  const html = `
    <div class="container-fluid">
      <div class="row">
        <!-- Columna de datos básicos -->
        <div class="col-lg-6">
          <div class="panel panel-info">
            <div class="panel-heading">DATOS BASICOS</div>
            <table class="form" width="100%" align="center">
              <tbody>
                <tr>
                  <td colspan="2" align="center">
                    <img src="https://dfnas.pwmultiroma.com/imagenesMateriales/no_imagen.png" 
                         class="img-responsive img-material" width="400" height="345">
                  </td>
                </tr>
                <tr>
                  <td><b>CODIGO</b></td>
                  <td>${data[0].CODIGO_MATERIAL}</td>
                </tr>
                <tr>
                  <td><b>TEXTO CORTO</b></td>
                  <td>${data[0].DESCRIPCION}</td>
                </tr>
                <tr>
                  <td><b>REGISTRO INFO</b></td>
                  <td>${data[0].CODIGO_SAP}</td>
                </tr>
                <tr>
                  <td><b>TEXTO LARGO</b></td>
                  <td>${data[0].DESCRIPCION2}</td>
                </tr>
                <tr>
                  <td><b>LABORATORIO</b></td>
                  <td>${data[0].LAB}</td>
                </tr>
                <tr>
                  <td><b>INVIMA</b></td>
                  <td>${data[0].INVIMA}</td>
                </tr>
                <tr>
                  <td><b>EAN</b></td>
                  <td>${data[0].EAN}</td>
                </tr>
                <tr>
                  <td><b>EMBALAJE</b></td>
                  <td>${data[0].EMBALAJE}</td>
                </tr>
                <tr>
                  <td><b>FECHA CREACIÓN</b></td>
                  <td>${data[0].FECHA_CREACION}</td>
                </tr>
                <tr>
                  <td><b>DIAS CREACIÓN</b></td>
                  <td>${data[0].DIAS_CREACION}</td>
                </tr>
                <tr>
                  <td><b>CONTROLADO</b>: ${ctrl}</td>
                  <td><b>INSTITUCIONAL</b>: ${ins}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Columna de datos de venta -->
        <div class="col-lg-6">
          <div class="panel panel-info">
            <div class="panel-heading">DATOS DE VENTA</div>
            <table class="form" width="100%" align="center">
              <tbody>
                <tr>
                  <td><b>VLR BRUTO</b></td>
                  <td>${formatNum(vunit, '$')}</td>
                </tr>
                <tr>
                  <td><b>VLR NETO SIN IVA</b></td>
                  <td>${formatNum(v1, '$')}</td>
                </tr>
                <tr>
                  <td><b>VLR NETO FINANCIERO</b></td>
                  <td>${formatNum(v4, '$')}</td>
                </tr>
                <tr>
                  <td><b>VLR DESCUENTO</b></td>
                  <td>${formatNum(v3, '$')}</td>
                </tr>
                <tr>
                  <td><b>VLR IVA</b></td>
                  <td>${formatNum(v2, '$')}</td>
                </tr>
                <tr>
                  <td><b>PORCENTAJE DCTO</b></td>
                  <td>${dcto}%</td>
                </tr>
                <tr>
                  <td><b>PORCENTAJE IVA</b></td>
                  <td>${iva}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Columna de datos de ingreso -->
        <div class="col-lg-12">
          <div class="panel panel-info">
            <div class="panel-heading">INVENTARIO FISICO POR LOTES</div>
            <table class="table" width="100%" align="center">
              <thead>
                  <th>CENTRO</tb>
                  <th>ALMACEN</td>
                  <th>MOV</td>
                  <th>LOTE</td>
                  <th>VENCIMIENTO</td>
                  <th>STOCK</td>
                  <th>UBICACION</td>
              </thead>
              <tbody>
                ${stockRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  $('#ContenidoInfoMateriales').html(html);
}

// Función para renderizar información de kit
function renderKitInfo(data) {
  const rows = data.map(item => `
    <tr>
      <td>${item.CODIGO_MATERIAL}</td>
      <td>${item.DESCRIPCION}</td>
      <td>${formatNum(item.VALOR_UNITARIO, '$')}</td>
      <td>${item.IVA}</td>
      <td>${item.DESCUENTO}</td>
      <td>${formatNum(item.VALOR_NETO, '$')}</td>
      <td>${item.CANTIDAD}</td>
      <td>${formatNum((parseFloat(item.VALOR_NETO) * parseInt(item.CANTIDAD)), '$')}</td>
    </tr>
  `).join('');

  const html = `
    <table class="table" width="100%" align="center">
      <thead>
        <tr>
          <th>CODIGO</th>
          <th>DESCRIPCION</th>
          <th>VALOR</th>
          <th>%IVA</th>
          <th>%DCTO</th>
          <th>VALOR NETO</th>
          <th>CANTIDAD</th>
          <th>VALOR TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  $('#ContenidoInfoMateriales').html(html);
}
//---------------------WS que valida en tiempo real el inventario en SAP
function WSInvent(codigo, oficina) {
  var cantidad = 0;
  $.ajax({
    encoding: "UTF-8",
    url: "../models/WS-INVENT.php",
    global: false,
    type: "POST",
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: ({
      codigo: codigo,
      oficina: oficina
    }),
    dataType: "html",
    async: false,
    success: function (data) {
      cantidad = data;
    }
  });
  return cantidad;
}
//---------------------Funcion para agregar o eliminar un producto seleccionado
function AddProducto(pcodigo,
  pvalor,
  piva,
  pdcto,
  pcant,
  pneto,
  pstock,
  pvrlped,
  pidped,
  pbonifica,
  pcantbon,
  pcantreg,
  pstobon) {

  var oficina = $("#txt_oficina").val();
  var codigo = pcodigo;
  var cant = isNaN(pcant) || pcant == '' ? 0 : parseInt(pcant);
  //Variables de control de envio de bonificacion-
  var Bonifica = pbonifica;
  var CantBonifica = pcantbon;
  var CantRegular = parseInt(pcantreg);
  var StockBonifica = pstobon;
  //Verificacion de aumento de cantidad segun bonificacion
  if ((cant > 0) && (cant < CantRegular)) {
    if (confirm("Este producto tiene una oferta " + CantRegular + " + " + CantBonifica + " desea aumentar su cantidad para que no deje perder esta promoción")) {
      cant = CantRegular;
      $("#CAF" + pcodigo).val(cant);
    }
  }
  var vlr_unitario = pvalor;
  var iva = piva;
  var descuento = pdcto;
  var precio = pneto;
  var stock = parseInt(pstock);
  var totalfila = parseFloat(precio) * parseInt(cant);
  var totalped = unformatNum($("#txt_total").val());
  var totalfila_antes = isNaN(unformatNum($('#TOF' + pcodigo).val())) || unformatNum($('#TOF' + pcodigo).val()) == '' ? 0 : unformatNum($('#TOF' + pcodigo).val());
  var NumPed = $("#txt_numero").val();
  var idfila = 'IDF' + pcodigo;
  //----------------------------------------------
  //return false;
  if (cant > 0) { //validacion de cantidad mayor a cero
    var CantRegalar = parseInt(parseInt(parseInt(cant) / parseInt(CantRegular)) * parseInt(CantBonifica));
    var swb = 0;
    if (parseInt(Bonifica) == 1) {
      if (CantRegalar <= parseInt(StockBonifica)) {
        swb = 0;
      } else {
        Swal.fire({
          title: 'INFORMACIÓN',
          type: 'info',
          html: '<table border="0"  width="100%">'
            + '<tr>'
            + '<td colspan="4" align="justify">'
            + 'Señor usuario, tenga en cuenta que la cantidad disponible de bonificado'
            + ' es inferior a la ingresada, lo que significa que solo llegarán <b>' + StockBonifica + '</b> '
            + 'unidades de bonificación, si no esta de acuerdo con esto por favor modificar '
            + 'la cantidad de producto valorado.'
            + '</td>'
            + '</tr>'
            + '</table>',
          showCloseButton: true,
          confirmButtonText: 'Ok'
        });
      }
    } else {
      swb = 0;
    }
    totalped = (totalped - totalfila_antes) + totalfila;
    $("#TOF" + pcodigo).val(formatNum(totalfila, '$'));
    $("#txt_total").val(formatNum(totalped, '$'));
    //------------Encabezado----------------------------------------------------------------------------
    if (NumPed == 0) {
      //Se inserta el encabezado
      NumPed = InsertarEncabezado();
      $("#txt_numero").val(NumPed);
    }
    //-----------Detalle--------------------------------------------------------------------------------
    if ($("#" + idfila).val() == 0) {
      //Se inserta la fila 
      idfila = InsertarDetalle(NumPed, codigo, cant, vlr_unitario, descuento, totalfila, iva);
      $("#IDF" + pcodigo).val(idfila); //
    } else {

      //Se actualiza la fila
      var id = $("#IDF" + pcodigo).val();
      ActualizarDetalle(id, cant, totalfila, codigo);
    }

  } else {
    //Elimina
    totalped = totalped - totalfila_antes;
    $("#txt_total").val(formatNum(totalped, '$'));
    $("#CAF" + pcodigo).val(''); // input catidad
    $("#TOF" + pcodigo).val(''); // input total
    //Se elimina la fila 	
    EliminarDetalle($('#IDF' + pcodigo).val(), pcodigo);
    $("#IDF" + pcodigo).val(0); // input id fila
  }
}
//--------------------------Funcion que construye el listado de destinatarios de mercancia 
function Destinatarios(codSap, ciudad, direccion) {
  $.ajax({
    encoding: "UTF-8",

    url: "../models/PW-SAP.php",
    global: false,
    type: "POST",
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: ({
      op: "B_DESTINATARIO",
      codSap: $.trim(codSap)
    }),
    dataType: "json",
    async: false,
    success: function (data) { // alert(JSON.stringify(data));
      var destino = '<option value="0" selected>Principal - ' + ciudad + ' - ' + direccion + '</option>';
      if (data != '') {
        for (var i = 0; i <= data.length - 1; i++) {
          destino += '<option value="' + data[i].id + '">alterna ' + i + ' - ' + data[i].direccion + '</option>';
        }
      }
      $("#txt_destinatario").html(destino);
      //$("#txt_destinatario select").val(0);
    }
  }).fail(function (data) {
    console.log(data);
  });
}
//---------------------------Funcion para insercion del encabezado del pedido
function InsertarEncabezado() {
  var numero = 0;
  var usuario = $("#UsrLogin").val();
  var tipoPed = $("#TxtIntegracion").val();
  if (usuario != '') {
    $.ajax({
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      global: false,
      type: "POST",
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR);
      },
      data: ({
        op: "I_PEDIDO_ENCABEZADO",
        organizacion_ventas: $("#Organizacion").val(),
        oficina_ventas: $("#txt_oficina").val(),
        canal_distribucion: 10,
        codigo_sap: $("#txt_codigoSap").val(),
        destinatario: $("#txt_destinatario").val(),
        tipoPed: tipoPed,
        cotizacion: $("#tipo_documento").val()
      }),
      dataType: "html",
      async: false,
      success: function (data) { //alert(data);
        if (!isNaN(data) > 0) {
          numero = data;
          $("#liPedidos").removeClass("disabled disabledTab");
          $("#btnPedidos").attr("data-toggle", "tab");
        } else {
          alert('ERROR: Al insertar el encabezado del pedido');
        }
      }
    });
  }
  return numero;
}

function ModificarArray(cant, total, id, cod) {
  for (var i = 0; i < ArrProd.length; i++) {
    d = ArrProd[i];
    if (d.codigo_material == cod) {
      d.cant_pedido = cant;
      d.vlr_pedido = total;
      d.id_pedido = id;
    }
  }
}
//---------------------------Funcion que inserta el detalle 
function InsertarDetalle(NumPed, codigo, cant, vlr_unitario, descuento, totalfila, iva) {
  var numero = 0;
  var NumPedSAP = $.trim($("#txt_numero_sap").val());
  $.ajax({
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    type: "POST",
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: ({
      op: "I_PEDIDO_DETALLE",
      NumPed: NumPed,
      codigo: codigo,
      cant: cant,
      vlr_unitario: vlr_unitario,
      vlr_total: totalfila,
      descuento: descuento,
      iva: iva,
      lista: $("#txt_lista").val(),
      oficina: $("#txt_oficina").val(),
      canal: '10'
    }),
    dataType: "html",
    async: false,
    success: function (data) { //alert(data); return false;
      if (!isNaN(data) > 0) {
        numero = data;
        if (NumPedSAP != 0) {
          InserUpdateSAP('MODIFICAR', NumPed, NumPedSAP);
        }
        ModificarArray(cant, totalfila, numero, codigo);
      } else {
        /* alert('ERROR: Al insertar el producto - '+codigo);
       alert(data);*/
        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'ERROR: Al insertar el producto - ' + codigo + ' ' + data,
          animation: false,
          position: 'top-right',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
      }
    }
  });
  return numero;
}
//--------------Funcion que actualiza el detalle del pedido
function ActualizarDetalle(idfila, cant, totalfila, codigo) {
  var numero = $.trim($("#txt_numero").val());
  var numeroSAP = $.trim($("#txt_numero_sap").val());
  $.ajax({
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    type: "POST",
    error: function (OBJ, ERROR, JQERROR) { },
    data: ({
      op: "U_PEDIDO_DETALLE",
      idfila: idfila,
      cant: cant,
      vlr_total: totalfila,
      oficina: $("#txt_oficina").val(),
      codigo: codigo,
      numero: numero,
      lista: $("#txt_lista").val(),
      canal: '10'
    }),
    dataType: "html",
    async: false,
    success: function (data) {
      if (numeroSAP != 0) {
        InserUpdateSAP('MODIFICAR', numero, numeroSAP);
      }
      ModificarArray(cant, totalfila, idfila, codigo);
    }
  });
}
//Funcion que elimina el detalle del pedido 
function EliminarDetalle(idfila, codigo) {
  //alert(idfila+' - '+codigo);
  var numero = $.trim($("#txt_numero").val());
  var numeroSAP = $.trim($("#txt_numero_sap").val());
  $.ajax({
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    type: "POST",
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: ({
      op: "D_PEDIDO_DETALLE",
      idfila: idfila,
      numero: numero,
      oficina: $("#txt_oficina").val(),
      codigo: $.trim(codigo),
      lista: $("#txt_lista").val(),
      canal: '10'
    }),
    dataType: "html",
    async: false,
    success: function (data) { //alert(data);
      if (data > 0) {
        //modifico
        if (numeroSAP != 0) {
          InserUpdateSAP('MODIFICAR', numero, numeroSAP);
        }
        ModificarArray(0, 0, 0, codigo);
      } else { }
      VerificaPedido();
    }
  });
}
//----------------------Function Que actualiza o guarda el pedido en el WS - 30-04-2021
function InserUpdateSAP(op, numero, numeroSAP) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/WS-PW.php",
    global: false,
    beforeSend: function () {
      LoadImg('GUARDANDO...');
    },
    data: ({
      op: op,
      numero: numero,
      numeroSAP: numeroSAP
    }),
    dataType: "json",
    async: true,
    success: function (data) {
      //alert(data);return false;
      if (data.Tipo == 'S') {
        Swal.fire({
          toast: true,
          icon: 'success',
          title: data.Msj,
          animation: false,
          position: 'top-right',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
      } else {
        Swal.fire({
          toast: true,
          icon: 'error',
          title: data.Msj,
          animation: false,
          position: 'top-right',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
      }
    }
  }).always(function (data) {
    UnloadImg();
    //console.log(data);	
  });

}

//----------------------Funcion que verifica si el pedido existe o no existe en la base de datos
function VerificaPedido() {
  var num = $("#txt_numero").val();
  if (num > 0) {
    $.ajax({
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      type: "POST",
      async: true,
      dataType: "json",
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR);
      },
      data: {
        op: "S_VERIFICA_PEDIDO",
        num: num
      },
      success: function (data) {
        if (data == '') {
          var numsap = $.trim($("#txt_numero_sap").val());
          if (numsap != 0) {
            EliminarSAP(numsap, 0);
          }
          $("#txt_total").val('$0');
          $("#txt_numero").val('0');
          $("#txt_numero_sap").val('0')
        }
      }
    });
  }
}


async function enviarCotizacionEmail(numero) {

  try {
    data = {
      op: 'EnviarPedidoEmail',
      link: "../models/ProgramacionCliente.php",
      ped: numero,
      tipo: 'C'
    }
    showLoadingSwalAlert2();
    const resp = await enviarPeticion(data);
    dissminSwal();

    if (resp.Tipo && resp.Tipo == 'success') {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Documento enviado',
        showConfirmButton: false,
        timer: 1500
      });

      activaTab("dvClientes");
      Limpiar();
      //valido si se abrio el modulo desde el 0102 
      if ($("#link_pro").val() != '0' || $("#link_pro").val() != '') {
        preLoadCliente($("#link_pro").val());
      }

    } else {
      Swal.fire('Error', 'Ocurrio un error al enviar la cotización', 'error');
    }
  } catch (e) {
    Swal.fire('Error', 'Ocurrio un error al enviar la cotización', 'error');
    dissminSwal();
    console.error(e)
  }

}


function ConfirmarenviarPedidoEmail(numero) {

  Swal.fire({
    title: "Desea enviar la cotización al coerreo?",
    text: "La coizacion de enviara al correo " + $("#emailCliente").val(),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si'
  }).then((result) => {
    if (result.isConfirmed) {
      enviarCotizacionEmail(numero);
    }
  })

}

//------------------Listar pedido temporal 
function ListarPedido() {
  $("#dvResultProductos").html("");
  var numero = $("#txt_numero").val();
  //alert(numero+'--'+$("#txt_oficina").val()+'--'+$("#txt_lista").val());
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    async: true,
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    beforeSend: function () {
      LoadImg('CARGANDO PEDIDO...');
    },
    data: {
      op: "S_PEDIDO_DETALLE",
      numero: numero
    },
    success: function (data) { //alert(data);return false;
      if (data != '' && data != null) {
        var cont = 0;
        var vtotal = 0;
        var vunit = 0;
        var vneto = 0;
        var vbruto = 0;
        var ctotal = 0;
        var tabla = '';
        var detalle = '';
        var notas = '';
        var style = '';
        for (var i = 0; i <= data.length - 1; i++) {
          cont++;
          vtotal += parseInt(data[i].valor_total);
          vunit += parseInt(data[i].valor_unitario);
          vneto += parseInt(data[i].valor_neto);
          ctotal += parseInt(data[i].cantidad);
          vbruto += parseInt(data[i].valor_bruto) * parseInt(data[i].cantidad);
          notas = data[i].notas;
          var Bonifica = 0; //variable creada para saber si el producto esta o no bonificado
          if (data[i].cantidad == 0) {
            data[i].cantidad = '';
            data[i].valor_total = '';
          } else {
            data[i].valor_total = formatNum(data[i].valor_total, '$');
          }
          if (data[i].bonificado != 0 && (parseInt(data[i].stock_bonificado) >= parseInt(data[i].cant_bonificado))) {
            Bonifica = 1;
            img = '<img src="../resources/icons/regalo.png" width="24" heigth="24"' + 'onclick="InfoBon(\'' + data[i].descripcion + '\',\''
              + data[i].desc_bonificado + '\',\''
              + data[i].stock + '\',\''
              + data[i].stock_bonificado + '\',\''
              + data[i].condicion_b + '\',\''
              + data[i].stock_prepack + '\')" align="absmiddle">';
          } else {
            Bonifica = 0;
            img = '';
          }
          if (parseInt(data[i].stock) < parseInt(data[i].cantidad)) {
            style = 'style = "background-color:#FB8A8B;"';
          } else {
            style = '';
          }
          //Nueva validacion para codigos bonificados.
          var clase = '';
          var acces = '';
          var msj = '';
          if (data[i].codigo.substr(0, 1) == '2' || data[i].codigo.substr(0, 1) == '3' || data[i].tipo == 'K') {
            clase = 'class="aler alert-warning"';
            acces = 'readonly disabled';
            msj = '<b><i>(GRATIS)</i></b>'
          }
          if (data[i].tipo == 'K') {
            clase = 'class="aler alert-info"';
            acces = 'readonly disabled';

            msj = '<b><i>(KIT)</i></b>'
          }
          //-----------------------------------------
          detalle += '<tr ' + clase + '>'
            + '<td>' + data[i].codigo + '</td>'
            + '<td>' + img + ' ' + data[i].descripcion + ' ' + msj + '</td>'
            + '<td>' + formatNum(data[i].valor_unitario, '$') + '</td>'
            + '<td>' + data[i].iva + '</td>'
            + '<td>' + data[i].descuento + '</td>'
            + '<td>' + formatNum(data[i].valor_neto, '$') + '</td>'
            + '<td>' + data[i].stock + '</td>'
            + '<td>'
            + '<input ' + acces + ' ' + style + ' type="number" id="CAF' + data[i].codigo + '" onKeyPress="return vnumeros(event)" '
            + 'value="' + data[i].cantidad + '" class="form-control" tabindex="' + (i + 1) + '"'
            + 'onBlur="AddProducto(\'' + $.trim(data[i].codigo) + '\',\''
            + $.trim(data[i].valor_unitario) + '\',\''
            + $.trim(data[i].iva) + '\',\''
            + $.trim(data[i].descuento) + '\',this.value,\''
            + $.trim(data[i].valor_neto) + '\',\''
            + $.trim(data[i].stock) + '\',\''
            + $.trim(data[i].valor_total) + '\',\''
            + $.trim(data[i].id) + '\',\''
            + $.trim(Bonifica) + '\',\''
            + $.trim(data[i].cant_bonificado) + '\',\''
            + $.trim(data[i].cant_regular) + '\',\''
            + $.trim(data[i].stock_bonificado) + '\');ListarPedido();" >'
            + '</td>'
            + '<td>'
            + '<input type="text" class="form-control" id="TOF' + data[i].codigo + '" value="' + data[i].valor_total + '" disabled readonly>'
            + '</td>'
            + '<td>'
            + '<input type="text" class="form-control" id="IDF' + data[i].codigo + '" value="' + data[i].id + '" disabled readonly>'
            + '</td>'
            + '</tr>';
        }

        var NumPed = $.trim($("#txt_numero").val());
        var NumPedSAP = $.trim($("#txt_numero_sap").val());
        var Rol = $.trim($("#Rol").val());
        var btnEliminar = '';
        let btnVerPdf = '';
        let btnEnviarPdfEmail = '';

        if (NumPedSAP == 0) {
          btnEliminar = '<button type="button" class="btn btn-danger btn-sm" onClick="EliminarPW(\'' + NumPed + '\'); Limpiar(); activaTab(\'dvClientes\');">'
            + '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Eliminar'
            + '</button> ';

          //valido si el modulo es abierto desde la programacion 

          if ($("#link_pro").val() != '') {

            if ($("#tipo_documento").val() == 'C') {
              //valido si es cotizacion 
              btnVerPdf = '<button class="btn btn-default btn-sm element-gestion-pedido" onClick="VisualizarPedido()" ><i class="glyphicon glyphicon-save-file text-danger " aria-hidden="true" type="button"></i>Ver en pdf</button>';

              btnEnviarPdfEmail = '<button type="button" class="btn btn-default btn-sm element-gestion-pedido" onClick="ConfirmarenviarPedidoEmail(' + NumPed + ')"><i class="glyphicon glyphicon-envelope text-primary" aria-hidden="true"></i>Enviar por email</button>';
            }
          }
        } else {
          if (Rol == 1 || Rol == 3 || Rol == 21 || Rol == 13) { //1:Administrador | 3:Gerente de ventas | 21:Coordinador pw | 13:Coordinador Televentas
            btnEliminar = '<button type="button" class="btn btn-danger btn-sm" onClick="EliminarSAP(\'' + NumPedSAP + '\',\'' + NumPed + '\'); Limpiar(); activaTab(\'dvClientes\');">'
              + '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Eliminar'
              + '</button> ';
          }
        }

        tabla = '<table class="table" width="100%">'
          + '<body>'
          + '<tr>'
          + '<td colspan="2"><textarea id="Pnotas" class="notas" onblur="UpdNotas(this)" placeholder="Notas de pedido" >' + notas + '</textarea></td>'
          + '</tr>'
          + '<tr>'
          + '<td>'
          + '<button type="button" class="btn btn-success btn-sm" onClick="Guardar();">'
          + '<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Guardar'
          + btnVerPdf + btnEnviarPdfEmail
          + '</button>'
          + '</td>'
          + '<td align="right">'
          + btnEliminar
          + '</td>'
          + '</tr>'
          + '<tr><td>Subtotal</td><td>' + formatNum(vbruto, '$') + '</td></tr>'
          + '<tr><td>Vlr IVA</td><td>' + formatNum(vtotal - vbruto, '$') + '</td></tr>'
          + '<tr><td>Vlr Total</td><td>' + formatNum(vtotal, '$') + '</td></tr>'
          + '<tr><td>Items</td><td>' + cont + '</td></tr>'
          + '<tr><td>Productos</td><td>' + ctotal + '</td></tr>'
          + '</tbody>'
          + '</table>';
        tabla += '<table class="table" align="center" id="tablaConfirmar">'
          + '<thead>'
          + '<tr>'
          + '<th data-breakpoints="xs">CODIGO</th>'
          + '<th>DESCRIPCION</th>'
          + '<th data-breakpoints="xs">VALOR</th>'
          + '<th data-breakpoints="xs">IVA</th>'
          + '<th data-breakpoints="xs">DCTO</th>'
          + '<th data-breakpoints="xs">VNETO</th>'
          + '<th data-breakpoints="xs">STOCK</th>'
          + '<th style="width:20px;">CANTIDAD</th>'
          + '<th style="width:120px;" data-breakpoints="xs">TOTAL</th>'
          + '<th data-visible="false">ID</th>'
          + '</tr>'
          + '</thead>'
          + '<tbody>' + detalle + '</tbody>'
          + '</table>';
        $("#dvResultPedidos").html(tabla);
        $('#tablaConfirmar').footable();

      } else {
        $("#dvResultPedidos").html('<div class="alert alert-danger" role="alert">'
          + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
          + '<span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS'
          + '</div>');
      }
    }
  }).done(function () {
    UnloadImg();
  });
}
//-----------------------------Actualizacion de notas de pedidos 
function UpdNotas(ob) {
  var nota = $.trim($(ob).val());
  var nump = $.trim($("#txt_numero").val());
  if (nump != '') {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      global: false,
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR);
      },
      data: ({
        op: "U_NOTAS",
        nota: nota,
        nump: nump
      }),
      dataType: "html",
      async: false,
      success: function (data) { //alert(data);
      }
    });

  }
}
//-----------------------------Pedidos temporales pendientes por recuperar
function Temporales() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    beforeSend: function () {
      LoadImg('CARGANDO...');
    },
    data: ({
      op: "S_TEMPORALES"
    }),
    dataType: "json",
    async: true,
    success: function (data) {
      if (data.length) {
        let tabla = `<div class="alert alert-warning alert-dismissible" role="alert">
          <strong>NOTA!</strong> Todos los pedidos que se encuentran para recuperación cuentan con una validez de 24 horas,
          transcurrido este tiempo serán eliminados de manera automática por nuestro sistema.
          </div>
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-sm btn-danger"><b>T</b>emporal</button>
            <button type="button" class="btn btn-sm btn-warning"><b>P</b>edido</button>
            <button type="button" class="btn btn-sm btn-success"><b>E</b>ntrega</button>
            <button type="button" class="btn btn-sm btn-info"><b>O</b>rden</button>
            <button type="button" class="btn btn-sm btn-primary"><b>F</b>actura</button>
          </div>
          <div id="VtotalPropios"></div>`;

        tabla += `<table class="table" align="center" id="tableRescue">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th data-breakpoints="xs">Bodega</th>
              <th data-breakpoints="xs">Numero</th>
              <th>Nombres</th>
              <th data-breakpoints="xs">Valor</th>
              <th data-breakpoints="xs">Destinatario</th>
              <th data-breakpoints="xs">Transferido</th>
              <th data-breakpoints="xs">Opciones</th>
            </tr>
          </thead>
          <body>`;

        let cont = 0;
        let total = 0;
        let usr = '';
        let visualizar = '';
        for (let i = 0; i <= data.length - 1; i++) {
          let transfer = '';

          if (data[i].transferido == 1) {
            if ($.trim(data[i].entrega) != '0') {
              if ($.trim(data[i].ot) != '0') {
                if ($.trim(data[i].factura) != '0') {
                  transfer = `<button type="button" class="btn btn-primary btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${data[i].numero_sap}','success');">
                    <span aria-hidden="true"><b>F</b></span>
                  </button>`;
                } else {
                  transfer = `<button type="button" class="btn btn-info btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${data[i].numero_sap}','success');">
                    <span aria-hidden="true"><b>O</b></span>
                  </button>`;
                }
              } else {
                transfer = `<button type="button" class="btn btn-success btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${data[i].numero_sap}','success');">
                  <span aria-hidden="true"><b>E</b></span>
                </button>`;
              }
            } else {
              if ($.trim(data[i].sol_desbloqueo) != '' /*&& data[i].sol_desbloqueo!='3'*/) {
                let estado_sol_des = "";
                let color = "";

                switch (data[i].sol_desbloqueo) {
                  case "0":
                    estado_sol_des = '<i class="fa-solid fa-lock " title="Solicitud enviada"></i>';
                    color = 'warning'
                    break;
                  case "1":
                    estado_sol_des = '<i class="fa-solid fa-lock "  title="Solicitud en revision"></i>';
                    color = 'info'
                    break;
                  case "2":
                    estado_sol_des = '<i class="fa-solid fa-lock "  title="Solicitud rechazada"></i>';
                    color = 'danger'
                    break;
                  case "3":
                    estado_sol_des = '<i class="fa-solid fa-circle-check  fa-bea"  title="Solicitud aprobada"></i>';
                    color = 'success'
                    break;
                }
                transfer += `<button onclick="MostrarEstadoSolDesbloqueo(${data[i].numero_sap})" class="btn btn-${color}">${estado_sol_des}</button>`;
              } else {
                transfer = `<button type="button" class="btn btn-warning btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${data[i].numero_sap}','success');">
                  <span aria-hidden="true"><b>P</b></span>
                </button>`;
              }
            }
          } else {
            transfer = `<button type="button" class="btn btn-danger btn-sm" onClick="Swal.fire('Oops', 'Pendiente por transferir', 'error');">
              <span aria-hidden="true"><b>T</b></span>
            </button>`;
          }

          data[i].cliente = data[i].cliente.replace(/'/g, '');
          data[i].cliente = data[i].cliente.replace(/"/g, '');

          tabla += `<tr>
                    <td>${data[i].fecha_pedido}</td>
                    <td>${data[i].bodega}</td>
                    <td>${data[i].numero}</td>
                    <td>
                      <P>${data[i].cliente}</P>
                      <small style="font-weight: bold">Zona ventas: <span class="text-primary">${data[i].zona_ventas} - ${data[i].zona_descripcion}</span></small>
                    </td>
                    <td>${formatNum(data[i].valor_total, '$')}</td>
                    <td>${data[i].destinatario}</td>
                    <td align="center" width="4%">${transfer}</td>
                    <td align="center" width="4%">
                      <button type="button" class="btn btn-default btn-sm" 
                        onClick="AbrirOpciones(
                          '${$.trim(data[i].numero)}',
                          '${$.trim(data[i].valor_total)}',
                          '${$.trim(data[i].codigo_direccion)}',
                          '${$.trim(data[i].direccion)}',
                          '${$.trim(data[i].oficina_ventas)}',
                          '${$.trim(data[i].codigo_sap)}',
                          '${$.trim(data[i].transferido)}',
                          '${$.trim(data[i].entrega)}',
                          '${$.trim(data[i].ot)}',
                          '${$.trim(data[i].numero_sap)}',
                          '${$.trim(data[i].factura)}',
                          'P',
                          '${$.trim(data[i].notas)}',
                          '${$.trim(data[i].usuario)}',
                          '${$.trim(data[i].destinatario)}',
                          '${$.trim(data[i].cliente)}'
                        );"
                        title="Menu de opciones">
                          <span class="glyphicon glyphicon-th" aria-hidden="true"></span>
                      </button>
                    </td>
                  </tr>`;

          cont++;
          total += parseFloat(data[i].valor_total);
        }
        tabla += `</tbody>
                </table>`;

        $("#DvRecuperables").html(tabla);
        $('#tableRescue').footable();
        $("#VtotalPropios").html(`<div class="alert alert-info" role="info"><b>VALOR TOTAL: ${formatNum(total, '$')}</b></div>`);
      } else {
        $("#DvRecuperables").html(`<div class="alert alert-danger" role="alert">
                                    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                                    <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS'
                                  </div>`);
      }
    }
  }).done(function () {
    UnloadImg();
  }).fail(function (data) {
    console.log(data);
  })
}

function AbrirOpciones(numero, valor_total, destinatario, direccion, bodega, codigo_sap, transferido, entrega, ot, numero_sap, factura, gestion, notas, usuario, destinatario, cliente) {
  $("#ped_gestion").val(gestion);
  $("#ped_numero").val(numero);
  $("#ped_valor_total").val(valor_total);
  $("#ped_destinatario").val(destinatario);
  $("#direccion_pedido").val(direccion);
  $("#ped_bodega").val(bodega);
  $("#ped_codigo_sap").val(codigo_sap);
  $("#ped_transferido").val(transferido);
  $("#ped_numero_sap").val(numero_sap);
  $("#ped_entrega").val(entrega);
  $("#ped_ot").val(ot);
  $("#ped_factura").val(factura);
  $("#NotasRapidas").val(notas);
  $("#ped_usuario").val(usuario);
  $("#info-cliente-codigo-sap").html(destinatario);
  $("#info-cliente-nombres").html(cliente);

  //valida si debe mostrar el btn de desbloqueo de pedidos
  if (codigo_sap != '' && codigo_sap != '0') {
    if (entrega == '0' || entrega == '' || entrega == null) {
      $("#btn-sol-desbloqueo").show();
    } else {
      $("#btn-sol-desbloqueo").hide();
    }
  }

  $("#ModalOpciones").modal("show");
  if (entrega == 0) {
    $("#NotasRapidas").attr('disabled', false);
    $("#btnNotaRapida").attr('disabled', false);
  } else {
    $("#NotasRapidas").attr('disabled', true);
    $("#btnNotaRapida").attr('disabled', true);
  }
}

function VisualizarPedido() {
  var num = $.trim($("#ped_numero").val());
  $("#ContenidoPDF").html('<embed src="../resources/tcpdf/pedidos.php?ped=' + num + '&tipo=V" frameborder="0" width="100%" height="400px">');
  $("#ModalPDF").modal("show");
}

function VisualizarFactura(num) {
  if (num != 0) {
    //$("#ModalOpciones").modal("hide");
    $("#ContenidoPDFfactura").html('<embed src="../resources/tcpdf/Factura.php?num=' + num + '&tipo=V" frameborder="0" width="100%" height="400px">');
    $("#ModalPDFfactura").modal("show");
  } else {
    Swal.fire('error', 'El pedido seleccionado no posee factura', 'error');
  }
}

function RecuperarPedido() {
  //---------------------------------------------------------
  var numero = $.trim($("#ped_numero").val());
  var valor = $.trim($("#ped_valor_total").val());
  var destinatario = $.trim($("#ped_destinatario").val());
  var bodega = $.trim($("#ped_bodega").val());
  var codigo_sap = $.trim($("#ped_codigo_sap").val());
  var transferido = $.trim($("#ped_transferido").val());
  var numero_sap = $.trim($("#ped_numero_sap").val());
  var entrega = $.trim($("#ped_entrega").val());
  var DepId = $.trim($("#Dpto").val());
  //---Control de modificacion de pedidos usuarios diferentes
  var ped_usuario = $.trim($("#ped_usuario").val());
  var usuario_log = $.trim($("#UsrLogin").val());
  var sw_user = 0;
  var IdRol = $.trim($("#Rol").val());
  if (ped_usuario != usuario_log && ped_usuario != 'INTEGRACION' && IdRol != 1) {
    sw_user = 1;
  }

  if (sw_user == 0) {
    //---Control de modificacion de pedidos usuarios diferentes
    if (entrega == 0) {
      //--------------------------------------------------------------		
      $("#txt_numero").val(numero);
      $("#txt_numero_sap").val(numero_sap);
      $("#txt_total").val(formatNum(valor, '$'));
      //---------------------------------------------------------
      $("#liPedidos").removeClass("disabled disabledTab");
      $("#btnPedidos").attr("data-toggle", "tab");
      $("#ModalOpciones").modal("hide");
      activaTab('dvPedidos');
      //---------------------------------------------------------
      if (DepId == 10) {
        $("#txt_cliente").val(codigo_sap);
        BuscarProductos();
      } else {
        CargarCliente(codigo_sap, 'c');
        $("#txt_oficina").html(OfcN);
        $("#txt_oficina option[value='" + bodega + "']").attr("selected", true);
        $("#txt_oficina").attr('disabled', true);
        $("#txt_oficina").attr('readonly', true);
        BuscarProductos();

      }
      //--------------------------------------------------------------		
      ListarPedido();
      $("#txt_destinatario").val(destinatario);
      $("#txt_destinatario").attr('disabled', true);
      $("#txt_destinatario").attr('readonly', true);
      //BuscarProductos();	 se cancela por hacer el proceso dos veces
      //---------------------------------------------------------
    } else {
      Swal.fire('Cancelado', 'No es posible recuperar un pedido con procesos posteriores.', 'error');
    }

  } else {
    Swal.fire('Cancelado', 'No es posible recuperar un pedido realizado por otro usuario!.', 'error');
  }
}
//Envio de Email de pedidos--------------------------------------------
function EnviarMail(tipo, numero) {
  $.ajax({
    type: "GET",
    encoding: "UTF-8",
    url: "../resources/tcpdf/pedidos.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR + " ");
    },
    data: ({
      ped: numero,
      tipo: tipo
    }),
    dataType: "html",
    async: true,
    success: function (data) { }
  }).fail(function (data) {
    console.log(data);
  });
}
//Envio de Email de anulacion de pedidos
function EnviarMailAnulacion(tipo, numero, texto) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR + " ");
    },
    data: ({
      op: "EMAIL",
      tipo: tipo,
      numero: numero,
      texto: texto
    }),
    dataType: "html",
    async: true,
    success: function (data) { }
  }).fail(function (data) {
    console.log(data);
  });
}
//Funcion validar inventario antes de guardar
function WSInvenTotal() {
  var numero = $("#txt_numero").val();
  if (numero > 0) {
    $.ajax({
      encoding: "UTF-8",
      url: "../models/WS-INVENT-TOTAL.php",
      global: false,
      type: "POST",
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR);
      },
      data: ({
        numero: numero
      }),
      dataType: "html",
      async: true,
      success: function (data) {
        //alert(data);
      }
    });
  }
}
//Funcion para guardar pedido en SAP------------------------------------
function Guardar() {
  var numero = $.trim($("#txt_numero").val());
  var op = '';
  var numeroSAP = 0;

  if (VerficarPedido(numero) == 0) {
    op = 'NUEVO';
  } else {
    op = 'MODIFICAR';
    numeroSAP = NumeroSAP(numero);
  }
  var BoniDatos = ValidarBonificados(numero);
  if (parseInt(BoniDatos.Id) == 0) {
    if (numero != '' && numero > 0) {
      Swal.fire({
        title: "Esta seguro de enviar el pedido numero " + numero + "?",
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
            url: "../models/WS-PW.php",
            global: false,
            beforeSend: function () {
              LoadImg('GUARDANDO...');
            },
            data: ({
              op: op,
              numero: numero,
              numeroSAP: numeroSAP
            }),
            dataType: "json",
            async: true,
            success: function (data) { //alert(data);return false;
              if (data.Tipo == 'S') {
                Swal.fire("Excelente!", data.Msj, "success");
                activaTab("dvClientes");
                Limpiar();
                //Envio de email para usuarios---
                if (numeroSAP == 0) {
                  EnviarMail('P', numero);
                } else {
                  EnviarMail('M', numero);
                }

                //valido si se abrio el modulo desde el 0102 
                if ($("#link_pro").val() != '0' || $("#link_pro").val() != '') {
                  preLoadCliente($("#link_pro").val());
                }
                //-------------------------------
                return false;
              } else {
                Swal.fire("Oops..!", data.Msj, "error");
                return false;
              }
            }
          }).always(function (data) {
            UnloadImg();
          });
        } else {
          Swal.fire("Cancelado", "La operacion de guardado de pedido ha sido cancelada!", "error");
        }
      })
    }
  } else {
    Swal.fire('Bonificados errados, imposible guardar', BoniDatos.Msj, 'error');
  }
}

function ListarEvento() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/Eventos.php",
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: {
      op: "S_EVENTO_LISTA",
      org: $("#Organizacion").val(),
      ofi: $("#Ofi").val(),
      tipo: $("#selTipos").val()
    },
    async: true,
    success: function (resp) {
      if (resp.data.length > 0) {
        var detalle = '';
        var contDesc = 0;
        var contBoni = 0;
        resp.data.forEach(function (d, i) {
          var tipo = 'BONIFICADO';
          var img = '<i class="fa-solid fa-gifts"></i>';
          if (d.TIPO == 'DES') {
            tipo = 'DESCUENTO';
            img = `<i class="fa fa-tags" style="--fa-primary-color: #e83211; --fa-secondary-color: #e8ec09;"></i>`;
            contDesc++;
          } else {
            contBoni++;
          }
          detalle += `<div class="panel panel-default">
									<div class="panel-heading">
										</br>
										  <div class="row">
											<div class="col-md-4">&nbsp;${img} ${tipo}</div>
											<div class="col-md-4">${d.GRUPO_ARTICULO} - ${d.GRUPO_DESCRIPCION}</div>
											<div class="col-md-4">
												<button type="button" class="btn btn-success" onClick="AddEvento('${d.GRUPO_ARTICULO}','${d.TIPO}');">
												 <i class="fa-solid fa-circle-plus"></i> Compra aquí!
												</button>
											</div>
										 </div>		
										</br>
									</div>
								</div>`;
        });
        $("#ResultEventos").html(detalle);
        $("#CantDesc").val(contDesc);
        $("#CantBoni").val(contBoni);
      } else {
        $("#ResultEventos").html(`<div class="alert alert-danger" role="alert">
										<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
										<span class="sr-only">Error:</span>  No existen resultados para las condiciones seleccionadas
									 </div>`);
        $("#CantDesc").val(0);
        $("#CantBoni").val(0);
      }

    }
  });
}

function AddEvento(grupo, tipo) {
  if ($("#txt_codigoSap").val() != '') {
    switch (tipo) {
      case 'DES':
        {
          $("#DvChkDctos").addClass('DivCheckBoxTrue');
        }
        break;
      case 'BON':
        {
          $("#DvChkBonif").addClass('DivCheckBoxTrue');
        }
        break;
    }
    $("#txt_bproductos").val($.trim(grupo));
    BuscarProductoArr(0);
    activaTab("dvProductos");
  } else {
    activaTab("dvClientes");
    parent.parent.$("#AbrirVentas").val(grupo);
    parent.parent.$("#AbrirVentasTipo").val(tipo);
    Swal.fire('Información', 'Para visualizar el evento primero debe seleccionar un cliente', 'warning');
  }
}
//NUEVAS MODIFICACIONES PARA EDICION DE PEDIDOS-------------------------------------------------------------------------------------
//Funciones de eliminacion de pedidos-----------------------------------------------------------------------------------------------
function EliminarPedido() {
  var numero = $.trim($("#ped_numero").val());

  var opc = $.trim($("#ped_transferido").val());
  var numero_sap = $.trim($("#ped_numero_sap").val());
  var gestion = $.trim($("#ped_gestion").val());
  //---Control de modificacion de pedidos usuarios diferentes
  var ped_usuario = $.trim($("#ped_usuario").val());
  var usuario_log = $.trim($("#UsrLogin").val());
  var sw_user = 0;
  var IdRol = $.trim($("#Rol").val());
  if (ped_usuario != usuario_log && ped_usuario != 'INTEGRACION' && IdRol != 1) {
    sw_user = 1;
  }

  if (sw_user == 0) {
    $("#ModalOpciones").modal("hide");
    Swal.fire({
      title: "Desea eliminar el pedido #" + numero,
      text: "Despues de aceptar no podra reversar la operacion!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#82ED81",
      cancelButtonColor: "#FFA3A4",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      closeOnConfirm: true,
      closeOnCancel: false
    }).then((result) => {
      if (result.value) {
        if (opc == 0) {
          EliminarPW(numero);
        } else {
          EliminarSAP(numero_sap, numero);
        }
        if (gestion == 'T') {
          GestionPedidos();
        } else if (gestion == 'P') {
          Temporales();
        }
        //activaTab("dvClientes");
        Limpiar();
      } else {
        Swal.fire("Cancelado", "La operacion ha sido cancelada!", "error");
      }
    });
  } else {
    Swal.fire("Oops", "No es posible eliminar un pedido que fue creado por otro usuario!", "error");
  }
}

function EliminarPW(numero) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR + " ");
    },
    data: ({
      op: 'D_PEDIDO',
      numero: numero
    }),
    dataType: "html",
    async: true,
    success: function (data) {
      if (data == 0) {
        Swal.fire("Excelente", "Pedido eliminado correctamente!", "success");
        Temporales();
      } else {
        Swal.fire("Error", "Error al intentar eliminar pedido!", "error");
      }
    }
  }).fail(function (data) {
    console.log(data);
  });
}

function EliminarSAP(numero_sap, numero) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/WS-PW.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR + " ");
    },
    data: ({
      op: 'ELIMINAR',
      numero: numero_sap
    }),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data.Tipo != 'S') {
        Swal.fire("Error", data.Msj, "error");
      } else {
        EnviarMailAnulacion('E', numero, 'Pedido eliminado');
        EliminarPW(numero);
      }
    }
  }).fail(function (data) {
    console.log(data);
  });
}

function Rastreo() {
  if ($("#ped_numero_sap").val() != '' && $("#ped_numero_sap").val() > 0) {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/RastreoPedido.php",
      dataType: "json",
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR);
      },
      data: {
        op: "TRAZABILIDAD",
        numero: $("#ped_numero_sap").val()
      },
      async: false,
      success: function (data) {
        $("#txt_org").html(data[0].ORG);
        $("#txt_bodega").html(data[0].BODEGA);
        $("#txt_nit").html(data[0].NIT);
        $("#txt_cod_sap").html(data[0].CODIGO_SAP);
        $("#txt_nombres").html(data[0].NOMBRES + '-' + data[0].RAZON_COMERCIAL);
        $("#txt_direccion").html(data[0].DIRECCION);
        $("#txt_num_ped").html(data[0].NUMERO);
        $("#txt_usuario_ped").html(data[0].USUARIO);
        $("#txt_fecha_ped").html(data[0].FECHA_PEDIDO);
        $("#txt_usuario_ot").html(data[0].USUARIO_OT);

        $("#txt_num_ent").html(data[0].NUMERO_ENTREGA);
        $("#txt_usuario_ent").html(data[0].USUARIO_ENTREGA);
        $("#txt_fecha_ent").html(data[0].FECHA_ENTREGA);

        $("#txt_usuario_sep").html(data[0].USUARIO_SEPARA);
        $("#txt_numero_ot").html(data[0].NUMERO_OT);
        $("#txt_fecha_ot").html(data[0].FECHA_OT);
        $("#txt_fecha_ini_ot").html(data[0].INI_SEP);
        $("#txt_fecha_fin_ot").html(data[0].FIN_SEP);

        $("#txt_usuario_fact").html(data[0].USUARIO_FACT);
        $("#txt_numero_fact").html(data[0].NUMERO_FACT);
        $("#txt_fecha_ini_fact").html(data[0].INI_FACT);
        $("#txt_fecha_fin_fact").html(data[0].FIN_FACT);

        $("#txt_usuario_emp").html(data[0].USUARIO_EMPAQUE);
        $("#txt_fecha_ini_emp").html(data[0].FINI_EMPAQUE);
        $("#txt_fecha_fin_emp").html(data[0].FFIN_EMPAQUE);
        $("#txt_bolsas_emp").html(data[0].N_BOLSAS);
        $("#txt_paquetes_emp").html(data[0].N_PAQUETES);
        $("#txt_cajas_emp").html(data[0].N_CAJAS);

        $("#txt_").html(data[0].USUARIO_DESP);
        $("#txt_fhini_ent").html(data[0].INI_TRANS);
        $("#txt_fhfin_ent").html(data[0].FIN_TRANS);
        $("#txt_guia").html(data[0].GUIA);
        $("#txt_nota").html(data[0].NOTA_ENTREGA);

        //$("#ModalOpciones").modal("hide");
        $("#ModalRastreo").modal("show");
      }
    });
  } else {
    Swal.fire('Oops', 'No esposible rastrear un pedido temporal', 'warning');
  }
}

function Entregas() {
  var Num = $.trim($("#ped_entrega").val());
  var NumTmp = $.trim($("#ped_numero").val());
  if (Num == '0') {
    Swal.fire({
      title: "El pedido no posee entrega, desea crearla?",
      text: "Despues de aceptar no podra reversar la operacion!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#82ED81",
      cancelButtonColor: "#FFA3A4",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      closeOnConfirm: true,
      closeOnCancel: false
    }).then((result) => {
      if (result.value) {
        $.ajax({
          type: "POST",
          encoding: "UTF-8",
          url: "../models/WS-PW.php",
          global: false,
          error: function (OBJ, ERROR, JQERROR) {
            alert(JQERROR + " ");
          },
          data: ({
            op: 'CREA_ENTREGAS',
            numero: $.trim($("#ped_numero_sap").val())
          }),
          dataType: "json",
          async: false,
          success: function (data) {
            if (data.Tipo != 'S') {
              Swal.fire("Error", data.Msj, "error");
            } else {
              Swal.fire("Excelente", data.Msj, "success");
            }
            var delayInMilliseconds = 2000; //1 segundo
            setTimeout(function () {
              //Temporales propios
              Temporales();
              //Temporales de terceros
              GestionPedidos();
              //Actualizacion de datos en modal
              consultaOpciones(NumTmp);
              //-------------------------------
            }, delayInMilliseconds);

          }
        }).done(function (data) {
          //console.log(data);	
        });
      } else {
        Swal.fire("Cancelado", "La operacion ha sido cancelada!", "error");
      }
    });

  } else {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      global: false,
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR + " ");
      },
      data: ({
        op: 'S_ENTREGA',
        numero: $.trim($("#ped_numero_sap").val())
      }),
      dataType: "json",
      async: false,
      success: function (data) {
        //$("#ModalOpciones").modal("hide");
        var detalle = '';
        var clas = '';
        var icon = '';
        var Pneto = 0;
        var PnetoIva = 0;
        for (var i = 0; i <= data.length - 1; i++) {

          if (parseInt(data[i].ENTREGA) == 0) {
            clas = 'class="alert-danger"';
            icon = '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>'
          } else if (parseInt(data[i].CANTIDAD) < parseInt(data[i].CANT_PED)) {
            clas = 'class="alert-warning"';
            icon = '<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>'
          } else {
            clas = '';
            icon = '';
          }
          detalle += '<tr ' + clas + '>'
            + '<td>' + data[i].POSICION + '</td>'
            + '<td>' + data[i].CODIGO_MATERIAL + '</td>'
            + '<td>' + icon + ' ' + data[i].DESCRIPCION + '</td>'
            + '<td><input type="text" value="' + data[i].CANTIDAD + '" class="form-control" size="2%"></td>'
            + '<td>' + data[i].CANT_PED + '</td>'
            + '<td>' + data[i].DESCUENTO + '%</td>'
            + '<td>' + data[i].ENTREGA + '</td>'
            + '<td align="center"><input type="checkbox"/></td>'
            + '<td>' + data[i].STOCK + '</td>'
            + '</tr>';
          Pneto = Pneto + parseFloat((data[i].PNETO));
          PnetoIva = PnetoIva + parseFloat((data[i].PNETO_IVA));
        }
        $("#tdDetalleEntregas").html(detalle);
        $("#ModalEntregas").modal("show");
        $("#valor_entrega").html('<b>VALOR ENTREGADO SIN IVA : ' + formatNum(Pneto, '$') + '</b>');
        $("#valor_entrega_iva").html('<b>VALOR ENTREGADO : ' + formatNum(PnetoIva, '$') + '</b>');

      }
    }).done(function (data) {
      //console.log(data);	
    });
  }
}

function EliminarEntrega() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/WS-PW.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR + " ");
    },
    data: ({
      op: 'ELIMINA_ENTREGAS',
      numero: $.trim($("#ped_entrega").val())
    }),
    dataType: "json",
    async: false,
    success: function (data) { //alert(data);

      if (data.Tipo != 'S') {
        Swal.fire("Error", data.Msj, "error");
      } else {
        Swal.fire("Excelente", data.Msj, "success");
        //Temporales propios
        Temporales();
        //Temporales de terceros
        GestionPedidos();
        $("#ModalEntregas").modal("hide");
      }

    }
  }).done(function (data) {
    //console.log(data);	
  });
}

function ModificarEntrega() {
  var entrega = $.trim($("#ped_entrega").val());
  //Posiciones 
  var detalle = new Array();
  $("#tdDetalleEntregas tr").each(function (index, element) {
    d1 = $.trim($(this).find("td").eq(0).html());
    d2 = $.trim($(this).find("td").eq(1).html());
    d3 = $.trim($(this).find("td").eq(3).find("input").val());
    d5 = $.trim($(this).find("td").eq(4).html());
    d6 = $.trim($(this).find("td").eq(8).html());
    if ($(this).find("td").eq(7).find("input").prop('checked')) {
      d4 = 'X'
    } else {
      d4 = ''
    };
    if (d1 != 0) {
      det = {
        'Posicion': d1,
        'Material': d2,
        'Cantidad': d3,
        'Eliminar': d4,
        'Pedido': d5,
        'Stock': d6
      } //det={
      detalle.push(det);
    }
  });
  var proceder = 0;
  for (i = 0; i <= detalle.length - 1; i++) {

    if (parseInt(detalle[i].Cantidad) > parseInt(detalle[i].Stock)) {
      proceder = 1;
    }

    if (parseInt(detalle[i].Cantidad) > parseInt(detalle[i].Pedido)) {
      proceder = 2;
    }
  }
  if (proceder == 0) {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/WS-PW.php",
      global: false,
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR + " ");
      },
      data: ({
        op: 'MODIFICA_ENTREGAS',
        entrega: entrega,
        detalle: JSON.stringify(detalle)
      }),
      dataType: "json",
      async: false,
      success: function (data) { //alert(data); return false;
        if (data.Tipo != 'S') {
          Swal.fire("Error", data.Msj, "error");
        } else {
          Swal.fire("Excelente", data.Msj, "success");
        }
      }
    }).fail(function (data) {
      console.log(data);
    });
  } else {
    $("#ModalEntregas").modal("hide");
    if (proceder == 1) {
      Swal.fire("Operación Cancelada", "No es posible actualizar un producto en donde la cantidad es mayor al stock ", "error");
    }

    if (proceder == 2) {
      Swal.fire("Operación Cancelada", "No es posible que la cantidad entregada sea superior a la cantidad pedida ", "error");
    }

  }
  //alert(JSON.stringify(detalle));
}

function Prioridad_ot(ot, almacen, despacho, punto) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      //alert(JQERROR + " ");
    },
    data: {
      op: 'Prioridad_ot',
      ot: ot,
      almacen: almacen,
      recojeDespachos: despacho, // Cambiado de 'despacho' a 'recojeDespachos'
      recojePuntoVenta: punto // Cambiado de 'punto' a 'recojePuntoVenta'
    },
    dataType: "json",
    async: false,
    success: function (data) {
      if (data.Tipo != 'S') {
        console.log("Error" + data.Msj);
      } else {
        console.log("Exito" + data.Msj);
      }
    }
  }).fail(function (data) {
    console.log(data);
    // Swal.fire("Error", "Ocurrió un error al actualizar la prioridad", "error");
  });
}

function Ordenes() {
  var entrega = $.trim($("#ped_entrega").val());
  var NumTmp = $.trim($("#ped_numero").val());
  var almacen = '';
  switch ($.trim($("#ped_bodega").val())) {
    case '1100':
      almacen = 'D01';
      break; //Monteria
    case '1200':
      almacen = 'C01';
      break; //Cartagena 
    case '2100':
      almacen = 'M01';
      break; //Medellin
    case '2200':
      almacen = 'B01';
      break; //Bogota
    case '2300':
      almacen = 'L01';
      break; //Cali
    case '2400':
      almacen = 'R01';
      break; //Barranquilla
  }
  if (entrega != 0 && entrega != '') {
    var Num = $.trim($("#ped_ot").val());
    /*if (Num == '0') {
      Swal.fire({
        title: "El pedido no posee Orden de transporte, desea crearla?",
        text: "Despues de aceptar no podra reversar la operacion!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#82ED81",
        cancelButtonColor: "#FFA3A4",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        closeOnConfirm: true,
        closeOnCancel: false
      }).then((result) => {
        if (result.value) {
          $.ajax({
            type: "POST",
            encoding: "UTF-8",
            url: "../models/WS-PW.php",
            global: false,
            error: function (OBJ, ERROR, JQERROR) {
              alert(JQERROR + " ");
            },
            data: ({
              op: 'CREA_ORDENES',
              almacen: almacen,
              entrega: entrega
            }),
            dataType: "json",
            async: false,
            success: function (data) { //alert(data);
              if (data.Tipo != 'S') {
                Swal.fire("Error", data.Msj, "error");
              } else {
                Swal.fire("Excelente", data.Msj, "success");
              }
              var delayInMilliseconds = 2000; //1 segundo
              setTimeout(function () {
                //Temporales propios
                Temporales();
                //Temporales de terceros
                GestionPedidos();
                //Actualizacion de datos en modal
                consultaOpciones(NumTmp);
                //------------------------------
              }, delayInMilliseconds);
            }
          }).fail(function (data) {
            console.log(data);
          });
        } else {
          Swal.fire("Cancelado", "La operacion ha sido cancelada!", "error");
        }
      });

    } */
    if (Num == '0') {
      // Configuración inicial del Swal con checkboxes dinámicos
      let swalOptions = {
        title: "El pedido no posee Orden de transporte, desea crearla?",
        text: "Despues de aceptar no podra reversar la operacion!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#82ED81",
        cancelButtonColor: "#FFA3A4",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false,
        closeOnCancel: false,
        html: `
                <div style="text-align: left; margin-top: 20px;">
                    <label style="display: block; margin-bottom: 10px;">
                        <input type="checkbox" id="recojeDespachos" name="recojeDespachos"> 
                        Recoge en Despachos
                    </label>
                    ${$.trim($("#ped_bodega").val()) == '1100' ?
            `<label style="display: block;">
                        <input type="checkbox" id="recojePuntoVenta" name="recojePuntoVenta"> 
                        Recoge en Punto de venta
                    </label>` : ''}
                </div>
            `,
        preConfirm: () => {
          return {
            recojeDespachos: document.getElementById('recojeDespachos').checked,
            recojePuntoVenta: $.trim($("#ped_bodega").val()) == '1100'
              ? document.getElementById('recojePuntoVenta').checked : false
          }
        }
      };

      Swal.fire(swalOptions).then((result) => {
        if (result.value) {
          const opcionesRecojo = result.value;
          console.log('Opciones seleccionadas:', opcionesRecojo);

          $.ajax({
            type: "POST",
            encoding: "UTF-8",
            url: "../models/WS-PW.php",
            global: false,
            error: function (OBJ, ERROR, JQERROR) {
              alert(JQERROR + " ");
            },
            data: ({
              op: 'CREA_ORDENES',
              almacen: almacen,
              entrega: entrega,
              recojeDespachos: opcionesRecojo.recojeDespachos ? '1' : '0',
              recojePuntoVenta: opcionesRecojo.recojePuntoVenta ? '1' : '0'
            }),
            dataType: "json",
            async: false,
            success: function (data) {
              if (data.Tipo != 'S') {
                Swal.fire("Error", data.Msj, "error");
              } else {
                // Extraer el número de OT del mensaje
                //debugger;
                let nueva_ot = '';
                let rdespa = opcionesRecojo.recojeDespachos ? '1' : '0';
                let rpunto = opcionesRecojo.recojePuntoVenta ? '1' : '0';
                Swal.fire("Excelente", data.Msj, "success");

                var delayInMilliseconds = 2000; //1 segundo
                setTimeout(function () {
                  //Temporales propios
                  Temporales();
                  //Temporales de terceros
                  GestionPedidos();
                  //Actualizacion de datos en modal
                  consultaOpciones(NumTmp, almacen, rdespa, rpunto);
                  //-----------------------------------//

                }, delayInMilliseconds);
              }
            }
          }).fail(function (data) {
            console.log(data);
          });
        } else {
          Swal.fire("Cancelado", "La operacion ha sido cancelada!", "error");
        }
      });
    } else {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/PW-SAP.php",

        global: false,
        error: function (OBJ, ERROR, JQERROR) {
          alert(JQERROR + " ");
        },
        data: ({
          op: 'S_ORDEN',
          numero: Num
        }),
        dataType: "json",
        async: false,
        success: function (data) {
          //$("#ModalOpciones").modal("hide");
          var detalle = '';
          var clas = '';
          var Pneto = 0;
          for (var i = 0; i <= data.length - 1; i++) {
            if (parseInt(data[i].ENTREGA) == 0) {
              clas = 'class="alert-danger"';
            }
            detalle += '<tr ' + clas + '>'
              + '<td>' + data[i].posicion_ot + '</td>'
              + '<td>' + data[i].codigo_material + '</td>'
              + '<td>' + data[i].descripcion + '</td>'
              + '<td><input type="text" value="' + data[i].cantidad + '" class="form-control" size="2%"></td>'
              + '<td>' + data[i].lote + '</td>'
              + '<td>' + data[i].numero_ot + '</td>'
              + '<td align="center"><input type="checkbox"/></td>'
              + '</tr>';
            Pneto = Pneto + parseFloat((data[i].pneto));
          }
          $("#tdDetalleOrdenes").html(detalle);
          $("#ModalOrdenes").modal("show");
          $("#valor_orden").html('<b>VALOR ORDEN : ' + formatNum(Pneto, '$') + '</b>');

        }
      }).done(function (data) {
        //console.log(data);	
      });
    }
  } else {
    Swal.fire('Error', 'El pedido no tiene entrega, no se puede generar OT', 'error');
  }
}

function EliminarOT() {
  var almacen = '';
  switch ($.trim($("#ped_bodega").val())) {
    case '1100':
      almacen = 'D01';
      break; //Monteria
    case '1200':
      almacen = 'C01';
      break; //Cartagena 
    case '2100':
      almacen = 'M01';
      break; //Medellin
    case '2200':
      almacen = 'B01';
      break; //Bogota
    case '2300':
      almacen = 'L01';
      break; //Cali
  }
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/WS-PW.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR + " ");
    },
    data: ({
      op: 'ELIMINA_OT',
      ot: $.trim($("#ped_ot").val()),
      alm: almacen
    }),
    dataType: "json",
    async: false,
    success: function (data) { //alert(data);

      if (data.Tipo != 'S') {
        Swal.fire("Error", data.Msj, "error");
      } else {
        Swal.fire("Excelente", data.Msj, "success");
        //Temporales propios
        Temporales();
        //Temporales de terceros
        GestionPedidos();
        $("#ModalOrdenes").modal("hide");
      }

    }
  }).done(function (data) {
    //console.log(data);	
  });
}
//Gestion de pedidos de terceros
function LimpiarGestionPedido() {
  ZonasVentas();
  $("#txtCodigoSAP").val('');
  $("#txtCliente").val('');
  $("#txtFecha1,#txtFecha2").val(FechaActual());
  $("#DvRecuperablesTerceros").html('');
  $("#VtotalTerceros").html('');
}

function GestionPedidos() {
  var TemporalesHistoria = $("#txtTemporalesHistoria").val();

  if (TemporalesHistoria == 'N') {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      global: false,
      beforeSend: function () {
        LoadImg('CARGANDO...');
      },
      data: ({
        op: "S_GESTION_PEDIDOS",
        zona: $.trim($("#txtZonas").val()),
        codigo: $.trim($("#txtCodigoSAP").val()),
        fh1: $.trim($("#txtFecha1").val()),
        fh2: $.trim($("#txtFecha2").val()),
        clase: $.trim($("#txtClasePedido").val()),
        oficina: $.trim($("#FiltroOficinaVentas").val())
      }),
      dataType: "json",
      async: true,
      success: function (data) {
        console.log(data);
        if (data.length) {
          let tabla = `<table class="table" align="center" id="tableRescueTerceros">
            <thead>
              <tr>
                <th>Fecha/Hora</th>
                <th data-breakpoints="xs">Bodega</th>
                <th data-breakpoints="xs">Clase/Numero</th>
                <th>Nombres</th>
                <th data-breakpoints="xs">Valor</th>
                <th data-breakpoints="xs">Destinatario</th>
                <th data-breakpoints="xs">Transferido</th>
                <th data-breakpoints="xs">Opciones</th>
                <th data-breakpoints="xs">Tipo</th>
              </tr>
            </thead>
            <body>`;

          let cont = 0;
          let total = 0;
          let usr = '';
          let visualizar = '';
          for (let i = 0; i <= data.length - 1; i++) {
            let transfer = '';
            let btnText = '';
            if (data[i].transferido == 1) {
              if ($.trim(data[i].entrega) != '0') {
                if ($.trim(data[i].ot) != '0') {
                  if ($.trim(data[i].factura) != '0') {
                    transfer = `<button type="button" class="btn btn-primary btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${data[i].numero_sap}','success');">
                      <span aria-hidden="true"><b>F</b></span>
                    </button>`;
                    btnText = 'F';
                  } else {
                    transfer = `<button type="button" class="btn btn-info btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${data[i].numero_sap}','success');">
                      <span aria-hidden="true"><b>O</b></span>
                    </button>`;
                    btnText = 'O';
                  }
                } else {
                  transfer = `<button type="button" class="btn btn-success btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${data[i].numero_sap}','success');">
                    <span aria-hidden="true"><b>E</b></span>
                  </button>`;
                  btnText = 'E';
                }
              } else {
                if ($.trim(data[i].sol_desbloqueo) != '' /* && data[i].sol_desbloqueo!='3'*/) {
                  estado_sol_des = "";

                  switch (data[i].sol_desbloqueo) {
                    case "0":
                      estado_sol_des = '<i class="fa-solid fa-lock text-warning" title="Solicitud enviada"></i>';
                      break;
                    case "1":
                      estado_sol_des = '<i class="fa-solid fa-lock text-info"  title="Solicitud en revision"></i>';
                      break;
                    case "2":
                      estado_sol_des = '<i class="fa-solid fa-lock text-danger"  title="Solicitud rechazada"></i>';
                      break;
                    case "3":
                      estado_sol_des = '<i class="fa-solid fa-circle-check text-success fa-bea"  title="Solicitud aprobada"></i>';
                      break;
                  }
                  transfer += `<button onclick="MostrarEstadoSolDesbloqueo(${data[i].numero_sap})" class="btn btn-default">${estado_sol_des}</button>`;
                  btnText = ''
                } else {
                  transfer = `<button type="button" class="btn btn-warning btn-sm" onClick="Swal.fire('Excelente', 'Pedido N° ${data[i].numero_sap}','success');">
                    <span aria-hidden="true"><b>P</b></span>
                  </button>`;
                  btnText = 'P';
                }
              }
            } else {
              transfer = `<button type="button" class="btn btn-danger btn-sm" onClick="Swal.fire('Oops', 'Pendiente por transferir', 'error');">
                <span aria-hidden="true"><b>T</b></span>
              </button>`;
              btnText = 'T';
            }

            data[i].cliente = data[i].cliente.replace(/'/g, '');
            data[i].cliente = data[i].cliente.replace(/"/g, '');

            tabla += `<tr>
              <td>${data[i].fecha_pedido}</td>
              <td>${data[i].bodega}</td>
              <td>${data[i].clase} - ${data[i].numero_sap}</td>
              <td>
                 <P>${data[i].cliente}</P>
                  <small style="font-weight: bold">Zona ventas: <span class="text-primary">${data[i].zona_ventas} - ${data[i].zona_descripcion}</span></small>
              </td>
              <td>${formatNum(data[i].valor_total, '$')}</td>
              <td>${data[i].destinatario}</td>
              <td align="center" width="4%">${transfer}</td>
              <td align="center" width="4%">
              <button type="button" class="btn btn-default btn-sm" onClick="AbrirOpciones('${$.trim(data[i].numero)}',
              '${$.trim(data[i].valor_total)}',
              '${$.trim(data[i].codigo_direccion)}',
              '${$.trim(data[i].direccion)}',
              '${$.trim(data[i].oficina_ventas)}',
              '${$.trim(data[i].codigo_sap)}',
              '${$.trim(data[i].transferido)}',
              '${$.trim(data[i].entrega)}',
              '${$.trim(data[i].ot)}',
              '${$.trim(data[i].numero_sap)}',
              '${$.trim(data[i].factura)}',
              'T',
              '${$.trim(data[i].notas)}',
              '${$.trim(data[i].usuario)}',
              '${$.trim(data[i].destinatario)}',
              '${$.trim(data[i].cliente)}');"
              title="Menu de opciones">
              <span class="glyphicon glyphicon-th" aria-hidden="true"></span>
              </button>
              </td>
              <td>${btnText}</td>
              </tr>`;

            cont++;
            total += parseFloat(data[i].valor_total);
          }
          tabla += `</tbody>
              </table>`;
          $("#VtotalTerceros").html(`<div class="alert alert-info" role="info"><b>VALOR TOTAL: ${formatNum(total, '$')}</b></div>`);
          $("#DvRecuperablesTerceros").html(tabla);
          $('#tableRescueTerceros').footable();
        } else {
          $("#VtotalTerceros").html('');
          $("#DvRecuperablesTerceros").html(`<div class="alert alert-danger" role="alert">

            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
          </div>`);
        }
      }
    }).done(function () {
      UnloadImg();
    }).fail(function (data) {
      console.error(data);
      UnloadImg();
      Swal.fire("Oops..!", data, "error");
    });
  } else {
    //Busqueda y recuperacion de pedidos historicos
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      global: false,
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR);
      },
      beforeSend: function () {
        LoadImg('CARGANDO...');
      },
      data: ({
        op: "S_GESTION_PEDIDOS_HISTORIA",
        zona: $.trim($("#txtZonas").val()),
        codigo: $.trim($("#txtCodigoSAP").val()),
        fh1: $.trim($("#txtFecha1").val()),
        fh2: $.trim($("#txtFecha2").val()),
        clase: $.trim($("#txtClasePedido").val()),
        oficina: $.trim($("#FiltroOficinaVentas").val())
      }),
      dataType: "json",
      async: true,
      success: function (data) {
        if (data.length) {
          let tabla = `<table class="table" align="center" id="tableRescueTercerosHistoria">
            <thead>
              <tr>
                <th>Fecha/Hora</th>
                <th data-breakpoints="xs">Bodega</th>
                <th data-breakpoints="xs">Clase/Numero</th>
                <th>Nombres</th>
                <th data-breakpoints="xs">Valor</th>
                <th data-breakpoints="xs">Destinatario</th>
                <th data-breakpoints="xs">Transferido</th>
                <th data-breakpoints="xs">Recuperar</th>
                <th data-breakpoints="xs">Tipo</th>
                </tr>
            </thead>
            <body>`;

          let cont = 0;
          let total = 0;
          let usr = '';
          let visualizar = '';
          for (let i = 0; i <= data.length - 1; i++) {
            tabla += `<tr>
                        <td>${data[i].fecha_pedido}</td>
                        <td>${data[i].bodega}</td>
                        <td>${data[i].clase} ' - ' ${data[i].numero}</td>
                        <td>${data[i].cliente}</td>
                        <td>${formatNum(data[i].valor_total, '$')}</td>
                        <td>${data[i].destinatario}</td>
                        <td align="center" width="4%">
                          <button type="button" class="btn btn-danger btn-sm">
                            <span class="glyphicon glyphicon-time" aria-hidden="true"></span>
                          </button>
                        </td>
                        <td align="center" width="4%">
                          <button type="button" class="btn btn-default btn-sm" onClick="RecuperarHistorico(${$.trim(data[i].numero)})">
                            <span class="glyphicon glyphicon-transfer" aria-hidden="true"></span>
                          </button>
                        </td>
                        <td>T</td>
                      </tr>`;

            cont++;
            total += parseFloat(data[i].valor_total);
          }
          tabla += `</tbody>
              </table>`;
          $("#VtotalTerceros").html(`<div class="alert alert-info" role="info"><b>VALOR TOTAL: ${formatNum(total, '$')}</b></div>`);
          $("#DvRecuperablesTerceros").html(tabla);
          $('#tableRescueTerceros').footable();
        } else {
          $("#VtotalTerceros").html('');
          $("#DvRecuperablesTerceros").html(`<div class="alert alert-danger" role="alert">
            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS
          </div>`);
        }
      }
    }).done(function () {
      UnloadImg();
    });
  }
}

function RecuperarHistorico(numero) {

  ///AddProductoPlano(pcodigo,pvalor,piva,pdcto,pcant,pneto,pstock,pvrlped,pidped,pbonifica,pcantbon,pcantreg,pstobon)

  Swal.fire({
    title: "Esta seguro de restablecer el pedido temporal numero " + numero + "?",
    text: "Tenga presente que las condiciones (Precios, Descuentos, Bonificaciones) serán recalculadas a la fecha actual",
    icon: "question",
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
        url: "../models/PW-SAP.php",
        global: false,
        error: function (OBJ, ERROR, JQERROR) {
          alert(JQERROR);
        },
        beforeSend: function () {
          LoadImg('RESTAURANDO...');
        },
        data: ({
          op: "G_PEDIDOS_HISTORIA_TMP",
          numero: numero
        }),
        dataType: "json",
        async: true,
        success: function (data) {
          if (!data.error) {
            Swal.fire("Excelente", data.mensaje, "success");
          } else {
            Swal.fire("Oops", data.mensaje, "error");
          }
          GestionPedidos();
        }
      });

    } else {
      Swal.fire("Cancelado", "Operacion cancelada por el usuario", "error");
    }
  }).done(function () {
    UnloadImg();
  });

}

function GuardarDirecto() {
  var numero = $("#ped_numero").val();
  var op = '';
  var numeroSAP = 0;
  if (VerficarPedido(numero) == 0) {
    op = 'NUEVO';
  } else {
    op = 'MODIFICAR';
    numeroSAP = NumeroSAP(numero);
  }
  var BoniDatos = ValidarBonificados(numero);
  if (parseInt(BoniDatos.Id) == 0) {
    Swal.fire({
      title: "Esta seguro de enviar el pedido numero " + numero + "?",
      text: "Despues de aceptar no podra reversar la operacion!",
      icon: "question",
      confirmButtonColor: "#82ED81",
      cancelButtonColor: "#FFA3A4",
      confirmButtonText: "Enviar!",
      cancelButtonText: "No Enviar",
      showLoaderOnConfirm: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        let timerInterval
        Swal.fire({
          title: 'Guardando..',
          html: '<img src="../resources/icons/preloader.gif" width="300px" heigth="300px">',
          showConfirmButton: false
        });
        $.ajax({
          type: "POST",
          encoding: "UTF-8",
          url: "../models/WS-PW.php",
          global: false,
          error: function (OBJ, ERROR, JQERROR) {
            alert(JQERROR + " ");
          },
          data: ({
            op: op,
            numero: numero,
            numeroSAP: numeroSAP
          }),
          dataType: "json",
          async: true,
          success: function (data) { //alert(data);return false;
            if (data.Tipo == 'S') {
              Swal.fire("Excelente!", data.Msj, "success");
              var delayInMilliseconds = 2000; //1 segundo
              setTimeout(function () {
                //Temporales propios
                Temporales();
                //Temporales de terceros
                GestionPedidos();
                //Actualizacion de datos en modal
                consultaOpciones(numero);
                //-------------------------------
              }, delayInMilliseconds);
              return false;
            } else {
              Swal.fire("Oops..!", data.Msj, "error");
              return false;
            }


          }
        }).always(function (data) {
          //console.log(data);	
        });
      } else {
        Swal.fire("Cancelado", "La operacion de guardado de pedido ha sido cancelada!", "error");
      }
    })
  } else {
    Swal.fire('Bonificados errados, imposible guardar', BoniDatos.Msj, 'error');
  }

}

function GestionEntregas() {
  if ($.trim($("#CodigoSAPEntregas").val()) != '') {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      global: false,
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR);
      },
      beforeSend: function () {
        LoadImg('CARGANDO...');
      },
      data: ({
        op: "S_ENTREGAS",
        oficina: $.trim($("#OficinaEntregas").val()),
        codigo: $.trim($("#CodigoSAPEntregas").val()),
        fh1: $.trim($("#EntregasFecha1").val()),
        fh2: $.trim($("#EntregasFecha2").val())
      }),
      dataType: "json",
      async: true,
      success: function (data) { //alert(data);$("#DvListaEntregas").html(data);		return false;
        if (data != '' && data != null) {
          var tabla = '<table class="table" align="center" id="tableEntregas">'
            + '<thead>'
            + '<tr>'
            + '<th>Numero</th>'
            + '<th>Fecha</th>'
            + '<th data-breakpoints="xs">Clase</th>'
            + '<th data-breakpoints="xs">Usuario</th>'
            + '<th data-breakpoints="xs">Valor</th>'
            + '<th data-breakpoints="xs">Add</th>'
            + '<th data-breakpoints="xs">CodDir</th>'
            + '</tr>'
            + '</thead>'
            + '<body>';
          var cont = 0;
          var total = 0;
          var usr = '';
          var visualizar = '';
          for (var i = 0; i <= data.length - 1; i++) {
            tabla += '<tr>'
              + '<td>' + data[i].numero + '</td>'
              + '<td>' + data[i].fecha_pedido + '</td>'
              + '<td>' + data[i].clase + '</td>'
              + '<td>' + data[i].usuario + '</td>'
              + '<td>' + formatNum(data[i].valor, '$') + '</td>'
              + '<td align="center">'
              + '<label class="contenedor">'
              + '<input type="checkbox">'
              + '<span class="checkmark"></span>'
              + '</label>'
              + '</td>'
              + '<td>' + data[i].cod_direccion + '</td>'
              + '</tr>';
          }
          tabla += '</body></table>';
          $("#DvListaEntregas").html(tabla);
        } else {
          $("#DvListaEntregas").html('<div class="alert alert-danger" role="alert">'
            + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
            + '<span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS'
            + '</div>');
        }
      }

    }).done(function () {
      UnloadImg();
    }).fail(function (data) {
      console.error(data);
      UnloadImg();
    });
  } else {
    Swal.fire('Error', 'Debe seleccionar un cliente', 'error');
  }
}

function LimpiarEntregas() {
  $("#ClienteEntregas").val('');
  $("#CodigoSAPEntregas").val('');
  $("#DvListaEntregas").html('');
  $("#ClienteEntregas").focus();
}

function UnificarEntrega() {
  var numeros = '';
  var CodDir = 0;
  var ContDir = 0;
  $("#tableEntregas tr:gt(0)").each(function (index, element) {
    if ($(this).find("td").eq(5).find("input").is(":checked")) {
      numeros += $.trim($(this).find("td").eq(0).html()) + ',';

      if (CodDir != parseInt($.trim($(this).find("td").eq(6).html()))) {
        ContDir++;
      }
      CodDir = parseInt($.trim($(this).find("td").eq(6).html()));
    }
  });


  if (ContDir > 1) {
    //console.log('No es posible crear una entrega unificada, los pedidos seleccionados poseen direcciones de despacho diferentes');
    Swal.fire("No es posible crear una entrega unificada",
      "Los pedidos seleccionados poseen direcciones de despacho diferentes",
      "error");
  } else {
    if (numeros != '') { //alert(numeros);
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/WS-PW.php",
        global: false,
        error: function (OBJ, ERROR, JQERROR) {
          alert(JQERROR);
        },
        beforeSend: function () {
          LoadImg('CARGANDO...');
        },
        data: ({
          op: "UNIFICA_ENTREGAS",
          numeros: numeros
        }),
        dataType: "json",
        async: true,
        success: function (data) {
          if (data.Tipo == 'S') {
            Swal.fire({
              title: data.Msj + ", desea generar la OT?",
              text: "Despues de aceptar no podra reversar la operacion!",
              icon: "question",
              confirmButtonColor: "#82ED81",
              cancelButtonColor: "#FFA3A4",
              confirmButtonText: "Enviar!",
              cancelButtonText: "No Enviar",
              showLoaderOnConfirm: true,
              showCancelButton: true,
            }).then((result) => {
              if (result.value) {
                var entrega = data.Msj.replace(/\D/g, '');
                var almacen = '';
                switch ($.trim($("#OficinaEntregas").val())) {
                  case '1100':
                    almacen = 'D01';
                    break; //Monteria
                  case '1200':
                    almacen = 'C01';
                    break; //Cartagena 
                  case '2100':
                    almacen = 'M01';
                    break; //Medellin
                  case '2200':
                    almacen = 'B01';
                    break; //Bogota
                  case '2300':
                    almacen = 'L01';
                    break; //Cali
                  case '2400':
                    almacen = 'R01';
                    break; //Barranquilla
                }
                $.ajax({
                  type: "POST",
                  encoding: "UTF-8",
                  url: "../models/WS-PW.php",
                  global: false,
                  error: function (OBJ, ERROR, JQERROR) {
                    alert(JQERROR + " ");
                  },
                  data: ({
                    op: 'CREA_ORDENES',
                    almacen: almacen,
                    entrega: entrega
                  }),
                  dataType: "json",
                  async: false,
                  success: function (data) { //alert(data);
                    if (data.Tipo != 'S') {
                      Swal.fire("Error", data.Msj, "error");
                    } else {
                      Swal.fire("Excelente", data.Msj, "success");
                    }
                    GestionEntregas();
                  }
                }).done(function (data) {
                  //console.log(data);	
                });
              } else {
                Swal.fire("Cancelado", "La operacion de guardado de pedido ha sido cancelada!", "error");
              }
            });
            return false;
          } else {
            Swal.fire("Oops..!", data.Msj, "error");
            return false;
          }
        }
      }).done(function () {
        UnloadImg();
      });
    } else {
      Swal.fire('Error', 'Debe seleccionar por lo menos una entrega', 'error');
    }
  }


}

function ExcelFactura(num) {
  if (num != 0 && num != '') {
    window.open("../resources/Excel/ExcelFactura.php?num=" + num);
  } else {
    Swal.fire('Error', 'El pedido no posee factura.', 'error');
  }
}

function ExcelPedido(num) {
  if (num != 0 && num != '') {
    window.open("../resources/Excel/ExcelPedido.php?num=" + num);
  } else {
    Swal.fire('Error', 'El pedido no posee pedido SAP.', 'error');
  }
}

function ExcelEntrega(numE, numP) {
  if (numE != 0 && numE != '') {
    window.open("../resources/Excel/ExcelEntrega.php?num=" + numP);
  } else {
    Swal.fire('Error', 'El pedido no posee pedido SAP.', 'error');
  }
}

function ExcelOrden(num) {
  if (num != 0 && num != '') {
    window.open("../resources/Excel/ExcelOrden.php?num=" + num);
  } else {
    Swal.fire('Error', 'El pedido no posee pedido SAP.', 'error');
  }
}

function TxtFactura(num) {
  if (num != 0 && num != '') {
    window.open("../resources/TXT/TxtFactura.php?num=" + num);
  } else {
    Swal.fire('Error', 'El pedido no posee factura.', 'error');
  }
}

function ListarFacturas() {
  var DepId = $.trim($("#Dpto").val());
  var codigo = '';
  if (DepId != 10) {
    codigo = $("#txtFactCodigoCliente").val();
  } else {
    codigo = $("#txt_codigoSap").val();
  }
  var fh1 = $("#txtFactFecha1").val();
  var fh2 = $("#txtFactFecha2").val();
  var fact = $("#txtNumFact").val();
  if ((codigo != '') || (fact != '')) {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      global: false,
      error: function (OBJ, ERROR, JQERROR) {

        alert(JQERROR + " ");
      },
      data: ({
        op: 'S_FACTURAS',
        codigo: codigo,
        fh1: fh1,
        fh2: fh2,
        fact: fact
      }),
      dataType: "json",
      async: false,
      success: function (data) { //alert(data);
        if (data != '' && data != null) {
          var tabla = '<table class="table" align="center" id="tableEntregas">'
            + '<thead>'
            + '<tr>'
            + '<th data-breakpoints="xs">Factura</th>'
            + '<th data-breakpoints="xs">Oficina</th>'
            + '<th data-breakpoints="xs">Codigo</th>'
            + '<th data-breakpoints="xs">Nombres</th>'
            + '<th data-breakpoints="xs">Razon</th>'
            + '<th data-breakpoints="xs">Fecha</th>'
            + '<th data-breakpoints="xs">Subtotal</th>'
            + '<th data-breakpoints="xs">IVA</th>'
            + '<th data-breakpoints="xs">Total</th>'
            + '<th data-breakpoints="xs">Exportar</th>'
            + '</tr>'
            + '</thead>'
            + '<body>';
          var cont = 0;
          var total = 0;
          var iva = 0;
          var subtotal = 0;
          var usr = '';
          var visualizar = '';
          for (var i = 0; i <= data.length - 1; i++) {
            tabla += '<tr>'
              + '<td>' + data[i].NUMERO_FACTURA + '</td>'
              + '<td>' + data[i].OFICINA_VENTAS + '</td>'
              + '<td>' + data[i].CODIGO_SAP + '</td>'
              + '<td>' + data[i].NOMBRES + '</td>'
              + '<td>' + data[i].RAZON_COMERCIAL + '</td>'
              + '<td>' + data[i].FECHA_HORA + '</td>'
              + '<td>' + formatNum(data[i].VALOR, '$') + '</td>'
              + '<td>' + formatNum(data[i].IVA, '$') + '</td>'
              + '<td>' + formatNum(data[i].TOTAL, '$') + '</td>'
              + '<td>'
              + '<div class="btn-group" role="group" aria-label="...">'
              + '<button class="btn btn-success btn-sm" onClick="ExcelFactura(\'' + data[i].NUMERO_FACTURA + '\');">XLS</button>'
              + '<button class="btn btn-danger btn-sm"  onClick="VisualizarFactura(\'' + data[i].NUMERO_FACTURA + '\');">PDF</button>'
              + '<button class="btn btn-default btn-sm" onClick="TxtFactura(\'' + data[i].NUMERO_FACTURA + '\');">TXT</button>'
              + '</div>'
              + '</td>'
              + '</tr>';
            subtotal += parseFloat(data[i].VALOR);
            iva += parseFloat(data[i].IVA);
            total += parseFloat(data[i].TOTAL);
          }
          tabla += '</body></table>';
          $("#DvListaFacturas").html(tabla);
          $("#VtotalFacturas").html('<div class="alert alert-info" role="info">'
            + '<div class="container">'
            + '<div class="row">'
            + '<div class="col-md-4"><b>SUBTOTAL: </b>' + formatNum(subtotal, '$') + '</div>'
            + '<div class="col-md-4"><b>VALOR IVA: </b>' + formatNum(iva, '$') + '</div>'
            + '<div class="col-md-4"><b>VALOR TOTAL: </b>' + formatNum(total, '$') + '</div>'
            + '</div>'
            + '</div>'
            + '</div>');
        } else {
          $("#VtotalFacturas").html('');
          $("#DvListaFacturas").html('<div class="alert alert-danger" role="alert">'
            + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
            + '<span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS' + '</div>');
        }
      }
    }).done(function (data) {
      //console.log(data);	
    });
  } else {
    Swal.fire('Error', 'Debe seleccionar un cliente', 'error');
  }
}

function LimpiarFacturas() {
  $("#DvListaFacturas").html('');
  $("#txtFactCodigoCliente").val('');
  $("#txtFactCliente").val('');
  $("#txtNumFact").val('');
  $("#VtotalFacturas").html('');
  $("#txtNumFact").focus();
}

function LimpiarFaltantes() {

  $("#txtFaltanteCodigoCliente").val('');
  $("#txtFaltanteCliente").val('');
  $("#VtotalFaltante").html('');
  $("#DvListaFaltante").html('');
  $("#txtFaltanteCliente").focus();
}

function Faltante() {
  var DepId = $.trim($("#Dpto").val());
  var codigo = '';
  if (DepId != 10) {
    codigo = $("#txtFaltanteCodigoCliente").val();
  } else {
    codigo = $("#txt_codigoSap").val();
  }
  var fh1 = $("#txtFaltanteFecha1").val();
  var fh2 = $("#txtFaltanteFecha2").val();
  var fact = $("#txtNumFact").val();
  if ((codigo != '') || (fact != '')) {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      global: false,
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR + " ");
      },
      beforeSend: function () {
        LoadImg('CARGANDO...');
      },
      data: ({
        op: 'S_FALTANTES',
        codigo: codigo,
        fh1: fh1,
        fh2: fh2,
        fact: fact
      }),
      dataType: "json",
      async: true,
      success: function (data) { //alert(data);
        if (data != '' && data != null) {
          var tabla = '<table class="table" align="center" id="tdFaltantes">'
            + '<thead>'
            + '<tr>'
            + '<th data-breakpoints="xs">Cliente</th>'
            + '<th data-breakpoints="xs">No Pedido</th>'
            + '<th data-breakpoints="xs">Codigo</th>'
            + '<th data-breakpoints="xs">Descripcion</th>'
            + '<th data-breakpoints="xs">Cant Entrega</th>'
            + '<th data-breakpoints="xs">Cant Pedido</th>'
            + '<th data-breakpoints="xs">No Entrega</th>'
            + '</tr>'
            + '</thead>'
            + '<body>';
          var cont = 0;
          var total = 0;
          var usr = '';
          var visualizar = '';
          for (var i = 0; i <= data.length - 1; i++) {
            tabla += '<tr>'
              + '<td>' + data[i].CODIGO_SAP + '</td>'
              + '<td>' + data[i].NUMERO + '</td>'
              + '<td>' + data[i].CODIGO_MATERIAL + '</td>'
              + '<td>' + data[i].DESCRIPCION + '</td>'
              + '<td>' + data[i].CANTIDAD + '</td>'
              + '<td>' + data[i].CANT_PED + '</td>'
              + '<td>' + data[i].ENTREGA + '</td>'
              + '</tr>';
            //total+=parseFloat(data[i].VALOR);
          }
          tabla += '</body></table>';
          $("#DvListaFaltante").html(tabla);
          //$("#VtotalFaltante").html('<div class="alert alert-info" role="info"><b>VALOR TOTAL: '+formatNum(total,'$')+'</b></div>');
          $("#VtotalFaltante").html('');
        } else {
          $("#VtotalFaltante").html('');
          $("#DvListaFaltante").html('<div class="alert alert-danger" role="alert">'
            + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
            + '<span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS' + '</div>');
        }
      }
    }).done(function (data) {
      UnloadImg();
      //console.log(data);	
    });
  } else {
    Swal.fire('Error', 'Debe seleccionar un cliente', 'error');
  }
}

//-----nuevas funciones para verificacion de pedidos
function VerficarPedido(numTMP) {
  var result = 0;
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) { },
    beforeSend: function () { },
    data: ({
      op: 'VERIFY_PEDIDO',
      numTMP: numTMP
    }),


    dataType: "json",
    async: false,
    success: function (data) {
      result = data[0].ESTADO;
    }
  }).always(function (data) {
    //console.log('Estado pedido : '+data);
  });
  return result;
}

function NumeroSAP(numTMP) {
  var result = 0;
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) { },
    beforeSend: function () { },
    data: ({
      op: 'NUMERO_SAP',
      numTMP: numTMP
    }),
    dataType: "json",
    async: false,
    success: function (data) {
      result = data[0].NUMERO_SAP;
    }
  });
  return result;
}

/*
function top10_materiales(){
  var ano  = new Date().getFullYear();
  var mes  = new Date().getMonth()+1;
  var pluginArrayArg = new Array();
  var jsonArray = '';
	
  $.ajax({ 
    type: "POST",
    url: "../models/PW-SAP.php",
    beforeSend: function(){
    },
    data : ({
      op  : 'B_TOP20_MATERIALES',
      cod : $("#txt_codigoSap").val(),
      org : $("#Organizacion").val(),
      ano : ano,
      mes : mes
    }),
    dataType: "json",
    async:false,
    success: function(data){ console.log(data);
         //console.log(data);
          
        for(var i=0; i<=data.length-1; i++){
         var dato = new Object();
           dato.name = '('+data[i].codigo_material+') '+data[i].descripcion;
           dato.y    = Math.round(data[i].frecuencia);
           pluginArrayArg.push(dato);
        }
        jsonArray = JSON.parse(JSON.stringify(pluginArrayArg));
    }
  }).fail(function(data){
    console.error(data)
  });
   // Create the chart
	
  if(pluginArrayArg.length>0){
  	
    Highcharts.chart('container2', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'TOP 10 DE PRODUCTOS MAS COMPRADOS'
      },
      subtitle: {
        text: 'Frecuencia de compra : '+ano
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
          text: 'Frecuencia de compra'
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
            format: '{point.y:f}'
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:f}</b> <br/>'
      },

      series: [
        {
          name: "Browsers",
          colorByPoint: true,
          data: jsonArray
        }
      ]

    });	   
  }else{
  	
    $("#container2").html('<h4>TOP 10 DE PRODUCTOS MAS COMPRADOS</h4><br><div class="alert alert-danger">Sin resultados!</div>');
  	
  }

}*/


/*

function Comportamiento(){
var datos     = new Array();
var datos_ant = new Array();
var ano       = new Date().getFullYear();
var mes       = new Date().getMonth()+1;
var ano_ant   = new Date().getFullYear()-1;
$.ajax({ 
    type: "POST",
    url: "../models/PW-SAP.php",
    beforeSend: function(){
    },
    data : ({
      op  : 'B_FACTURACION_MES',
      cod : $("#txt_codigoSap").val(),
      org : $("#Organizacion").val(),
      ano : ano,
      mes : mes
    }),
    dataType: "json",
    async:false,
    success: function(data){ console.log({'Comportamiento':data});
      for(var i=0; i<=data.length-1; i++){
        switch(mes){
        case 1:{  datos.push(parseFloat(data[i].Ene));
          }break
        case 2:{  datos.push(parseFloat(data[i].Ene));
                    datos.push(parseFloat(data[i].Feb));
        }break
        case 3:{  datos.push(parseFloat(data[i].Ene));
              datos.push(parseFloat(data[i].Feb));
              datos.push(parseFloat(data[i].Mar));
        }break
        case 4:{  datos.push(parseFloat(data[i].Ene));
              datos.push(parseFloat(data[i].Feb));
              datos.push(parseFloat(data[i].Mar));
              datos.push(parseFloat(data[i].Abr));
        }break
        case 5:{  datos.push(parseFloat(data[i].Ene));
              datos.push(parseFloat(data[i].Feb));
              datos.push(parseFloat(data[i].Mar));
              datos.push(parseFloat(data[i].Abr));
              datos.push(parseFloat(data[i].May));
        }break
        case 6:{  datos.push(parseFloat(data[i].Ene));
              datos.push(parseFloat(data[i].Feb));
              datos.push(parseFloat(data[i].Mar));
              datos.push(parseFloat(data[i].Abr));
              datos.push(parseFloat(data[i].May));
              datos.push(parseFloat(data[i].Jun));
        }break
        case 7:{  datos.push(parseFloat(data[i].Ene));
              datos.push(parseFloat(data[i].Feb));
              datos.push(parseFloat(data[i].Mar));
              datos.push(parseFloat(data[i].Abr));
              datos.push(parseFloat(data[i].May));
              datos.push(parseFloat(data[i].Jun));
              datos.push(parseFloat(data[i].Jul));
        }break
        case 8:{  datos.push(parseFloat(data[i].Ene));
              datos.push(parseFloat(data[i].Feb));
              datos.push(parseFloat(data[i].Mar));
              datos.push(parseFloat(data[i].Abr));
              datos.push(parseFloat(data[i].May));
              datos.push(parseFloat(data[i].Jun));
              datos.push(parseFloat(data[i].Jul));
              datos.push(parseFloat(data[i].Ago));
        }break
        case 9:{  datos.push(parseFloat(data[i].Ene));
              datos.push(parseFloat(data[i].Feb));
              datos.push(parseFloat(data[i].Mar));
              datos.push(parseFloat(data[i].Abr));
              datos.push(parseFloat(data[i].May));
              datos.push(parseFloat(data[i].Jun));
              datos.push(parseFloat(data[i].Jul));
              datos.push(parseFloat(data[i].Ago));
              datos.push(parseFloat(data[i].Sep));
          }break
        case 10:{ datos.push(parseFloat(data[i].Ene));
              datos.push(parseFloat(data[i].Feb));
              datos.push(parseFloat(data[i].Mar));
              datos.push(parseFloat(data[i].Abr));
              datos.push(parseFloat(data[i].May));
              datos.push(parseFloat(data[i].Jun));
              datos.push(parseFloat(data[i].Jul));
              datos.push(parseFloat(data[i].Ago));
              datos.push(parseFloat(data[i].Sep));
              datos.push(parseFloat(data[i].Oct));
          }break
        case 11:{ datos.push(parseFloat(data[i].Ene));
              datos.push(parseFloat(data[i].Feb));
              datos.push(parseFloat(data[i].Mar));
              datos.push(parseFloat(data[i].Abr));
              datos.push(parseFloat(data[i].May));
              datos.push(parseFloat(data[i].Jun));
              datos.push(parseFloat(data[i].Jul));
              datos.push(parseFloat(data[i].Ago));
              datos.push(parseFloat(data[i].Sep));
              datos.push(parseFloat(data[i].Oct));
              datos.push(parseFloat(data[i].Nov));
          }break
        case 12:{ datos.push(parseFloat(data[i].Ene));
              datos.push(parseFloat(data[i].Feb));
              datos.push(parseFloat(data[i].Mar));
              datos.push(parseFloat(data[i].Abr));
              datos.push(parseFloat(data[i].May));
              datos.push(parseFloat(data[i].Jun));
              datos.push(parseFloat(data[i].Jul));
              datos.push(parseFloat(data[i].Ago));
              datos.push(parseFloat(data[i].Sep));
              datos.push(parseFloat(data[i].Oct));
              datos.push(parseFloat(data[i].Nov));
              datos.push(parseFloat(data[i].Dic));
         }break
      }
      }
      JSON.parse(JSON.stringify(datos));
    	
    }
 }).fail(function(data){
   console.error(data);
 });
	
 $.ajax({ 
    type: "POST",
    url: "../models/PW-SAP.php",
    beforeSend: function(){
    },
    data : ({
      op  : 'B_FACTURACION_MES',
      cod : $("#txt_codigoSap").val(),
      org : $("#Organizacion").val(),
      ano : ano_ant,
      mes : mes
    }),
    dataType: "json",
    async:false,
    success: function(data){ 
      console.log({data});
      for(var i=0; i<=data.length-1; i++){
       switch(mes){
        case 1:{  datos_ant.push(parseFloat(data[i].Ene));
          }break
        case 2:{  datos_ant.push(parseFloat(data[i].Ene));
                    datos_ant.push(parseFloat(data[i].Feb));
        }break
        case 3:{  datos_ant.push(parseFloat(data[i].Ene));
              datos_ant.push(parseFloat(data[i].Feb));
              datos_ant.push(parseFloat(data[i].Mar));
        }break
        case 4:{  datos_ant.push(parseFloat(data[i].Ene));
              datos_ant.push(parseFloat(data[i].Feb));
              datos_ant.push(parseFloat(data[i].Mar));
              datos_ant.push(parseFloat(data[i].Abr));
        }break
        case 5:{  datos_ant.push(parseFloat(data[i].Ene));
              datos_ant.push(parseFloat(data[i].Feb));
              datos_ant.push(parseFloat(data[i].Mar));
              datos_ant.push(parseFloat(data[i].Abr));
              datos_ant.push(parseFloat(data[i].May));
        }break
        case 6:{  datos_ant.push(parseFloat(data[i].Ene));
              datos_ant.push(parseFloat(data[i].Feb));
              datos_ant.push(parseFloat(data[i].Mar));
              datos_ant.push(parseFloat(data[i].Abr));
              datos_ant.push(parseFloat(data[i].May));
              datos_ant.push(parseFloat(data[i].Jun));
        }break
        case 7:{  datos_ant.push(parseFloat(data[i].Ene));
              datos_ant.push(parseFloat(data[i].Feb));
              datos_ant.push(parseFloat(data[i].Mar));
              datos_ant.push(parseFloat(data[i].Abr));
              datos_ant.push(parseFloat(data[i].May));
              datos_ant.push(parseFloat(data[i].Jun));
              datos_ant.push(parseFloat(data[i].Jul));
        }break
        case 8:{  datos_ant.push(parseFloat(data[i].Ene));
              datos_ant.push(parseFloat(data[i].Feb));
              datos_ant.push(parseFloat(data[i].Mar));
              datos_ant.push(parseFloat(data[i].Abr));
              datos_ant.push(parseFloat(data[i].May));
              datos_ant.push(parseFloat(data[i].Jun));
              datos_ant.push(parseFloat(data[i].Jul));
              datos_ant.push(parseFloat(data[i].Ago));
        }break
        case 9:{  datos_ant.push(parseFloat(data[i].Ene));
              datos_ant.push(parseFloat(data[i].Feb));
              datos_ant.push(parseFloat(data[i].Mar));
              datos_ant.push(parseFloat(data[i].Abr));
              datos_ant.push(parseFloat(data[i].May));
              datos_ant.push(parseFloat(data[i].Jun));
              datos_ant.push(parseFloat(data[i].Jul));
              datos_ant.push(parseFloat(data[i].Ago));
              datos_ant.push(parseFloat(data[i].Sep));
          }break
        case 10:{ datos_ant.push(parseFloat(data[i].Ene));
              datos_ant.push(parseFloat(data[i].Feb));
              datos_ant.push(parseFloat(data[i].Mar));
              datos_ant.push(parseFloat(data[i].Abr));
              datos_ant.push(parseFloat(data[i].May));
              datos_ant.push(parseFloat(data[i].Jun));
              datos_ant.push(parseFloat(data[i].Jul));
              datos_ant.push(parseFloat(data[i].Ago));
              datos_ant.push(parseFloat(data[i].Sep));
              datos_ant.push(parseFloat(data[i].Oct));
          }break
        case 11:{ datos_ant.push(parseFloat(data[i].Ene));
              datos_ant.push(parseFloat(data[i].Feb));
              datos_ant.push(parseFloat(data[i].Mar));
              datos_ant.push(parseFloat(data[i].Abr));
              datos_ant.push(parseFloat(data[i].May));
              datos_ant.push(parseFloat(data[i].Jun));
              datos_ant.push(parseFloat(data[i].Jul));
              datos_ant.push(parseFloat(data[i].Ago));
              datos_ant.push(parseFloat(data[i].Sep));
              datos_ant.push(parseFloat(data[i].Oct));
              datos_ant.push(parseFloat(data[i].Nov));
          }break
        case 12:{ datos_ant.push(parseFloat(data[i].Ene));
              datos_ant.push(parseFloat(data[i].Feb));
              datos_ant.push(parseFloat(data[i].Mar));
              datos_ant.push(parseFloat(data[i].Abr));
              datos_ant.push(parseFloat(data[i].May));
              datos_ant.push(parseFloat(data[i].Jun));
              datos_ant.push(parseFloat(data[i].Jul));
              datos_ant.push(parseFloat(data[i].Ago));
              datos_ant.push(parseFloat(data[i].Sep));
              datos_ant.push(parseFloat(data[i].Oct));
              datos_ant.push(parseFloat(data[i].Nov));
              datos_ant.push(parseFloat(data[i].Dic));
         }break
       }
      }
      JSON.parse(JSON.stringify(datos_ant));

	
    }
 }).fail(function(data){
   console.error(data);
 });
   
  if(datos.length>0){

    Highcharts.chart('container', {
      chart: {
      type: 'spline'
      },
      title: {
      text: 'COMPORTAMIENTO DE VENTAS AÑO '+ano_ant+' - '+ano
      },
      subtitle: {
      text: ''
      },
      xAxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun','Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      },
      yAxis: {
      title: {
        text: 'Ventas'
      },
      labels: {
        formatter: function () {
        return formatNum(this.value,'$');
        }
      }
      },
      tooltip: {
      crosshairs: true,
      shared: true
      },
      plotOptions: {
      spline: {
        marker: {
        radius: 4,
        lineColor: '#666666',
        lineWidth: 1
        }
      }
      },
      series: [
         {
          name: ano,
          marker: {
            symbol: 'square'
          },
          data: datos

          }, 
         {
          name: ano_ant,
          marker: {
            symbol: 'diamond'
          },
          data: datos_ant
          }
        ]
    });		
  	
     
  }else{
    $("#container").html('<h4>COMPORTAMIENTO DE VENTAS AÑO '+ano_ant+' - '+ano+'</h4><div class="alert alert-danger">Sin resultados!</div>')
  }

}
*/

function datos_cupo() {

  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "../models/PW-SAP.php",
      async: true,
      dataType: "json",
      data: {
        op: "S_CUPO_CREDITO",
        org: $.trim($("#Organizacion").val()),
        codigo: $.trim($("#txt_codigoSap").val())
      },
      success: function (data) {
        resolve(data)
      }
    }).fail(function (data) {
      reject(data)
    });
  });
}


function top10_materiales() {


  var ano = new Date().getFullYear();
  var mes = new Date().getMonth() + 1;

  return new Promise((resolve, reject) => {

    $.ajax({
      type: "POST",
      url: "../models/PW-SAP.php",
      beforeSend: function () { },
      data: ({
        op: 'B_TOP20_MATERIALES',
        cod: $("#txt_codigoSap").val(),
        org: $("#Organizacion").val(),
        ano: ano,
        mes: mes
      }),
      dataType: "json",
      async: true,
      success: function (data) {
        resolve(data);

      }
    }).fail(function (error) {
      reject(error);
    });
  });

}

function pasarMeses(claves) {

  resultado = [];

  claves.forEach(clave => {
    resultado.push(clave.substr(2, clave.length));
  });

  return resultado;
}


function dataComportamiento() {

  let datos = new Array();
  let datos_ant = new Array();
  let ano = new Date().getFullYear();
  let mes = new Date().getMonth() + 1;
  let ano_ant = new Date().getFullYear() - 1;

  return new Promise((resolve, reject) => {

    $.ajax({
      type: "POST",
      url: "../models/PW-SAP.php",
      beforeSend: function () { },
      data: ({
        op: 'B_FACTURACION_MES',
        cod: $("#txt_codigoSap").val(),
        org: $("#Organizacion").val(),
        ano: ano,
        mes: mes
      }),
      dataType: "json",
      async: true,
      success: function (data) {
        resolve(data)
      }
    }).fail(function (error) {
      reject();
    });
  })
}


function NotaRapida() {

  var nota = $.trim($("#NotasRapidas").val());
  var nump = $.trim($("#ped_numero").val());
  var nums = $.trim($("#ped_numero_sap").val());
  var entr = $.trim($("#ped_entrega").val());
  if (entr == '' || entr == 0 || entr == '0') {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/PW-SAP.php",
      global: false,
      error: function (OBJ, ERROR, JQERROR) {
        alert(JQERROR);
      },
      data: ({
        op: "U_NOTAS",
        nota: nota,
        nump: nump
      }),
      dataType: "html",
      async: false,
      success: function (data) {
        if (nums != 0) {
          GuardarDirecto();
        } else {
          Swal.fire('Excelente', 'Nota actualizada con éxito.', 'success');
        }
      }
    });
  } else {
    Swal.fire('Opps', 'El pedido ya posee entrega, no puede modificarse la nota!', 'error');
  }
}

function FiltrosTipoPedidos(tipo) {
  //8
  var valor = 0;
  var valor_total = 0;
  if (tipo == 'A') {
    $("#tableRescueTerceros tr:gt(0)").each(function (index, element) {
      $(this).show();
      //console.log('-='+$(this).find("td").eq(4).html())
      valor = $.trim(unformatNum($(this).find("td").eq(4).html()));
      valor_total += parseFloat(valor);

    })
    $("#VtotalTerceros").html('<div class="alert alert-info" role="info"><b>VALOR TOTAL: ' + formatNum(valor_total, '$') + '</b></div>');;
  } else {
    $("#tableRescueTerceros tr").each(function (index, element) {
      tipoPed = $.trim($(this).find("td").eq(8).html());

      //console.log(tipoPed +'!= '+tipo+' - -'+valor)
      if (tipoPed != tipo) {
        $(this).hide();
      } else {
        $(this).show();
        valor = $.trim(unformatNum($(this).find("td").eq(4).html()));
        valor_total += parseFloat(valor);
      }
    });
    $("#VtotalTerceros").html('<div class="alert alert-info" role="info"><b>VALOR TOTAL: ' + formatNum(valor_total, '$') + '</b></div>');
  }
}

////funcion para la consulta de datos de la feria
function QueryFeria(grupo) {
  var codigo = $("#txt_codigoSap").val();
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: ({
      op: "S_FERIA",
      grupo: grupo,
      codigo: codigo
    }),
    beforeSend: function () {
      LoadImg("Consultando Información");
    },
    dataType: "json",
    async: true,
    success: function (data) {
      if (data.length > 0) {
        var tabla_consolidado = '';
        var tabla = '';
        var tabla_resumen = '';
        tabla = '<table class="table" align="center" id="tdFeria" width="95%">'
          + '<thead>'
          + '<tr>'
          + '<th data-breakpoints="xs">Grupo/Nit</th>'
          + '<th data-breakpoints="xs">Descripción</th>'
          + '<th data-breakpoints="xs">Compras</th>'
          + '<th data-breakpoints="xs">Estado</th>'
          + '</tr>'
          + '</thead>'
          + '<body>';
        //----------------------------------------------------------------------------------
        tabla_resumen = '<table class="table" align="center" id="tdFeriaResumen" width="95%">'
          + '<thead>'
          + '<tr>'
          + '<th data-breakpoints="xs">Codigo/Grupo</th>'
          + '<th data-breakpoints="xs">Nombre/grupo</th>'
          + '<th data-breakpoints="xs">Monto</th>'
          + '<th data-breakpoints="xs">Compras</th>'
          + '<th data-breakpoints="xs">Estado</th>'
          + '</tr>'
          + '</thead>'
          + '<body>';
        var cant_grupos = 0;
        var cant_cumple = 0;
        var cant_cumpleR = 0;
        var vlr_total = 0;
        var vlr_compras = 0;
        var vlr_cumple = 0;
        var cant_boleta = 0;
        var img = '';
        for (var i = 0; i <= data.length - 1; i++) {
          //----ESTATUS SEMANAL----------------------------------------------------------------------------------------------------
          var status = '<button type="button" class="btn btn-sm btn-danger" aria-label="Left Align">'
            + '<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>'
            + '</button>';
          if (parseFloat(data[i].COMPRAS) > 0) {
            status = '<button type="button" class="btn btn-sm btn-success" aria-label="Left Align">'
              + '<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>'
              + '</button>';
            cant_cumple++;
            vlr_cumple += parseInt(parseFloat(data[i].COMPRAS) / parseFloat(data[i].VALOR));
          }
          //---ESTAUS RESUMEN-----------------------------------------------------------------------------------------------------
          var statusR = '<button type="button" class="btn btn-sm btn-danger" aria-label="Left Align">'
            + '<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>'
            + '</button>';
          if (parseFloat(data[i].ESTATUS) == 1) {
            statusR = '<button type="button" class="btn btn-sm btn-success" aria-label="Left Align">'
              + '<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>'
              + '</button>';
            cant_cumpleR++;
          }
          //--------------------------------------------------------------------------------------------------------
          var cod = '';
          if (grupo != 5) {
            cod = data[i].GRUPO_ARTICULO;
            tabla += '<tr>'
              + '<td>' + cod + '</td>'
              + '<td>' + data[i].DESCRIPCION1 + '</td>'
              + '<td>' + formatNum(data[i].COMPRAS, '$') + '</td>'
              + '<td align="center">' + status + '</td>'
              + '</tr>';
          } else {
            tabla_resumen += '<tr>'
              + '<td>' + data[i].CODIGO_GRUPO + '</td>'
              + '<td>' + data[i].NOMBRE_GRUPO + '</td>'
              + '<td>' + formatNum(1000000, '$') + '</td>'
              + '<td>' + formatNum(data[i].COMPRAS, '$') + '</td>'
              + '<td align="center">' + statusR + '</td>'
              + '</tr>';
          }

          cant_grupos++;
          vlr_total += parseFloat(data[i].VALOR);
          vlr_compras += parseFloat(data[i].COMPRAS);
        }
        tabla += '</tbody></table>';
        //--------------------------------------------------------------------------------
        var img_resumen = '';
        var bol_resumen = 0;
        if (cant_cumpleR == 4) {
          img_resumen = '<img src="../resources/icons/riendo.gif" width="80"  heigth="80"/>';
          bol_resumen = 4;
        } else {
          img_resumen = '<img src="../resources/icons/llorando.gif" width="80"  heigth="80"/>';
        }
        tabla_resumen += '<tr>'
          + '<td colspan="2" align="center">' + img_resumen + '</td>'
          + '<td colspan="3" align="center"><b><h3>BOLETAS ' + bol_resumen + '</h3></b></td>'
          + '</tr>' + '</tbody></table>';
        //--------------------------------------------------------------------------------

        if ( /*cant_cumple >= 10 && */ vlr_compras >= 1000000) {
          cant_boleta = 1;
          img = '<img src="../resources/icons/riendo.gif" width="64"  heigth="64"/>';
        } else {
          cant_boleta = 0;
          img = '<img src="../resources/icons/llorando.gif" width="64"  heigth="64"/>';
        }

        if (grupo != 5) {
          tabla_consolidado = '<table class="form" width="100%" align="center" id="tdFeriaEncabezado">'
            + '<tbody>'
            + '<tr>'
            + '<td colspan="4" align="center"><img src="../resources/icons/logo_aniversario.png" width="128"  heigth="128"/></td>'
            + '</tr>'
            + '<tr>'
            + '<td colspan="4" class="alert alert-info"><b>GRUPOS DISPONIBLES</b></td>'
            + '</tr>'
            + '<tr>'
            + '<td>#GRUPOS</td>'
            + '<td>' + cant_grupos + '</td>'
            + '<td>VALOR TOTAL</td>'
            +
            //'<td>'+formatNum(vlr_total,'$')+'</td>'+
            '<td>' + formatNum(1000000, '$') + '</td>'
            + '</tr>'
            + '<tr>'
            + '<td colspan="4" class="alert alert-success"><b>COMPRAS REALIZADAS</b></td>'
            + '</tr>'
            + '<tr>'
            + '<td>#GRUPOS</td>'
            + '<td>' + cant_cumple + '</td>'
            + '<td>VALOR TOTAL</td>'
            + '<td>' + formatNum(vlr_compras, '$') + '</td>'
            + '</tr>'
            + '<tr>'
            + '<td colspan="2" align="center">' + img + '</td>'
            + '<td colspan="2" align="center"><b><h3>BOLETAS ' + cant_boleta + '</h3></b></td>'
            + '</tr>'
            + '</tbody>'
            + '</table>';
        } else { }

      } else {
        tabla = '<div class="alert alert-danger" role="alert">'
          + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
          + '<span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS' + '</div>';
      }
      switch (parseInt(grupo)) {
        case 1:
          {
            $("#dvPopularesDetalle").html(tabla_consolidado + tabla)
          }
          break;
        case 2:
          {
            $("#dvGenericosDetalle").html(tabla_consolidado + tabla)
          }
          break;
        case 3:
          {
            $("#dvFarmaDetalle").html(tabla_consolidado + tabla)
          }
          break;
        case 4:
          {
            $("#dvOTCDetalle").html(tabla_consolidado + tabla)
          }
          break;
        case 5:
          {
            $("#dvGranSorteoDetalle").html(tabla_resumen)
          }
          break;
      }

    }
  }).always(function () {
    UnloadImg();
  })
}

function DescargarExcel(OPC) {
  switch (OPC) {
    case 'PEDIDO':
      {
        var num = $.trim($("#ped_numero").val());
        ExcelPedido(num);
      }
      break;
    case 'ENTREGA':
      {
        var numE = $.trim($("#ped_entrega").val());
        var numP = $.trim($("#ped_numero_sap").val());
        ExcelEntrega(numE, numP)
      }
      break;
    case 'OT':
      {
        var num = $.trim($("#ped_ot").val());
        ExcelOrden(num);
      }
      break;
    case 'FACTURA':
      {
        var num = $("#ped_factura").val();
        ExcelFactura(num);
      }
      break;
  }

}

function LogDatos() {
  var Ped = $("#ped_numero").val() == 0 ? '' : $("#ped_numero").val();
  var PedSAP = $("#ped_numero_sap").val() == 0 ? '' : $("#ped_numero_sap").val();
  var Entrega = $("#ped_entrega").val() == 0 ? '' : $("#ped_entrega").val();
  var Orden = $("#ped_ot").val() == 0 ? '' : $("#ped_ot").val();
  var Factura = $("#ped_factura").val() == 0 ? '' : $("#ped_factura").val();
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: ({
      op: "CONSULTA_LOG",
      Ped: Ped,
      PedSAP: PedSAP,
      Entrega: Entrega,
      Orden: Orden,
      Factura: Factura
    }),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data != '' && data != null) {
        var tabla = '<table class="table" align="center" id="tdLog">'
          + '<thead>'
          + '<tr>'
          + '<th data-breakpoints="xs">ID</th>'
          + '<th data-breakpoints="xs">TIPO</th>'
          + '<th data-breakpoints="xs">ACCION</th>'
          + '<th data-breakpoints="xs">MENSAJE</th>'
          + '<th data-breakpoints="xs">USUARIO</th>'
          + '<th data-breakpoints="xs">FECHA_HORA</th>'
          + '<th data-breakpoints="xs">DOCUMENTO</th>'
          + '</tr>'
          + '</thead>'
          + '<body>';
        var cont = 0;
        var total = 0;
        var usr = '';
        var visualizar = '';
        for (var i = 0; i <= data.length - 1; i++) {
          tabla += '<tr>'
            + '<td>' + data[i].ID + '</td>'
            + '<td>' + data[i].TIPO + '</td>'
            + '<td>' + data[i].ACCION + '</td>'
            + '<td>' + data[i].MENSAJE + '</td>'
            + '<td>' + data[i].USUARIO + '</td>'
            + '<td>' + data[i].FECHA_HORA + '</td>'
            + '<td>' + data[i].DOCUMENTO + '</td>'
            + '</tr>';
          //total+=parseFloat(data[i].VALOR);
        }
        tabla += '</body></table>';
        $("#DetalleLog").html(tabla);
      } else {
        $("#DetalleLog").html('<div class="alert alert-danger" role="alert">'
          + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
          + '<span class="sr-only">Error:</span>NO EXISTEN RESULTADOS PARA LAS CONDICIONES SELECCIONADAS' + '</div>');
      }
    }
  });

  $("#ModalLog").modal('show');

}

function ValidarBonificados(numero) {
  //var numero = $.trim($("#ped_numero").val());
  var datos;
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    global: false,
    data: ({
      op: "VALIDA_BONIFICADO_S",
      numero: numero
    }),
    dataType: "json",
    async: false,
    success: function (data) {
      datos = data;
    }
  }).fail(function (data) {
    console.error(data);
  });
  return datos;
}

function CargaGruposClientes(grupo) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: false,
    dataType: "json",
    beforeSend: function () { },
    data: {
      op: "S_GRUPOS_CLIENTES",
      grupo: grupo
    },
    success: function (data) {
      let options = '<option value="">SIN ASIGNAR</option>';
      for (var i = 0; i <= data.length - 1; i++) {
        options += '<option value="' + data[i].GRUPO + '">' + data[i].GRUPO + ' - ' + data[i].DESCRIPCION + '</option>';
      }
      switch (grupo) {
        case 1:
          {
            $("#txtGrp1").html(options);
          }
          break;
        case 2:
          {
            $("#txtGrp2").html(options);
          }
          break;
        case 3:
          {
            $("#txtGrp3").html(options);
          }
          break;
        case 4:
          {
            $("#txtGrp4").html(options);
          }
          break;
        case 5:
          {
            $("#txtGrp5").html(options);
          }
          break;
      }

    }
  }).fail(function (data) {
    console.error(data);
  });
}

//Nuevo para manejar permisos de Bodega 
function Permisos() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    dataType: "json",
    data: {
      op: "S_PERMISOS",
      rol: $("#Rol").val(),
      modulo: '0101'
    },
    async: false,
    success: function (data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          d = data[i];
          if (d.id_mod_per == 1023) {
            Perm_Cambiar_Bodega = d.chck;
          }

        }
      }

    }
  });
}


const consultarPuntos = async (codigo_sap) => {
  const data = {
    link: "../models/PW-SAP.php",
    op: "S_PUNTOS_CLIENTE",
    codigo_sap
  }
  try {
    const resp = await enviarPeticion(data);
    resp.forEach(function (d, i) {
      $("#tdAcumuladoPuntos").html(`<b>Tus puntos ${d.puntos}</b>`);
      $("#tdCodigoSapPuntos").html(`<b>¡ Hola ${d.nombres}!</b>`);
    });
    consultarObsequios();
  } catch (error) {
    console.log();
  }
}

const consultarObsequios = async () => {
  const organizacion = $.trim($("#Organizacion").val());
  const oficina = $.trim($("#txt_oficina").val());
  const data = {
    link: "../models/PW-SAP.php",
    op: "S_OBSEQUIOS_PUNTOS",
    organizacion,
    oficina
  }
  try {
    const resp = await enviarPeticion(data);
    var html = '';
    if (resp.length > 0) {
      for (let i = 0; i < resp.length; i++) {
        if (i % 4 === 0) {
          html += '<div class="row">';
        }
        html += `
        <div class="col-sm-6 col-md-3">
          <div class="thumbnail">
            <img src="https://app.pwmultiroma.com/web/imagenesMateriales/${resp[i].codigo_material}.png" alt="${resp[i].descripcion}">
            <div class="caption">
              <h5>${resp[i].puntos} - Puntos</h5>
			  <p>
 					<button class="btn btn-danger btn-sm" onclick="redimirProducto('${resp[i].codigo_material}','https://app.pwmultiroma.com/web/imagenesMateriales/${resp[i].codigo_material}.png')">
						<i class="fa-solid fa-heart-circle-plus"></i> ¡Lo quiero!
					</button>
			 </p>
              <h5>${resp[i].descripcion}</h5>              
            </div>
          </div>
        </div>
      `;
        if ((i + 1) % 4 === 0 || (i + 1) === resp.length) { // Cada cuatro elementos, o si es el último elemento, cerrar la fila
          html += '</div>';
        }
      }

    } else {
      html = '<div class="alert alert-danger"><i class="fa-solid fa-circle-info"></i> Sin resultados para mostrar.</div>';
    }

    $("#dvMaterialespuntos").html(html);

    $("#ModalPP").modal('show');
  } catch (error) {
    console.log(error);
  }
}

const redimirProducto = async (codigo, url) => {
  const organizacion = $.trim($("#Organizacion").val());
  const oficina = $.trim($("#txt_oficina").val());
  const lista = $.trim($("#txt_lista").val());
  const data = {
    link: "../models/PW-SAP.php",
    op: "S_OBSEQUIOS_PUNTOS_PRODUCTO",
    organizacion,
    oficina,
    codigo,
    lista
  }
  try {
    const resp = await enviarPeticion(data);
    resp.forEach(function (d, i) {
      $("#redimePuntos").val(d.puntos);
      $("#redimeProducto").val(codigo);
      $("#descripcionDetallePuntos").html(`<h4><b>${d.descripcion}</b></h4>`);
      $("#puntosDetalle").html(`<h4><b>Puntos ${d.puntos}</b></h3>`);
      $("#stockDetalle").html(`<h5><b>${d.stock} unidades disponibles</b></h5>`);
    });
  } catch (error) {
    console.log(error);
  }
  $("#imgDetalle").attr('src', url);
  $("#ModalPPDetalle").modal('show');
}

const crearPedidoRedencion = async () => {
  Swal.fire({
    title: "¿Esta seguro de redimir este producto?",
    text: "Una vez iniciado el proceso no se puede reversar",
    icon: "question",
    confirmButtonColor: "#82ED81",
    cancelButtonColor: "#FFA3A4",
    confirmButtonText: "Si,continuar",
    cancelButtonText: "No,cancelar",
    showLoaderOnConfirm: true,
    showCancelButton: true,
  }).then(async (result) => {
    if (result.value) {
      const codigo_sap = $("#txt_codigoSap").val();
      const puntos = $("#redimePuntos").val();
      const codigo_material = $("#redimeProducto").val();
      const data = {
        link: "../models/PW-SAP.php",
        op: "I_CREAR_PEDIDO_REDENCION",
        codigo_sap,
        puntos,
        codigo_material
      }

      try {
        $("#ModalPP").modal('hide');
        $("#ModalPPDetalle").modal('hide');
        LoadImg('Generando solicitud, por favor espere...');
        const resp = await enviarPeticion(data);
        if (!resp.error) {
          if (resp.cod_error == 0) {
            await enviarPeticion({
              link: "../models/PW-SAP.php",
              op: "MAIL_REDENCIONES",
              id: resp.numero
            });
            Swal.fire('Excelente!', 'Redención realizada con éxito.', 'success');
          } else {
            Swal.fire('Error', resp.mensaje, 'error');
          }
        } else {
          Swal.fire('Error', 'No fue posible crear su solicitud. Por favor, verifique e intente nuevamente. En caso de persistir el error, por favor, comuníquese con su ejecutivo comercial.', 'error');
        }
        UnloadImg();

      } catch (error) {
        console.log(error);
        UnloadImg();
      }
    } else {
      Swal.fire('Cancelado', 'ha cancelado la operación', 'warning');
    }
  });
}

const crearPedidoRedencionSAP = async (numero) => {
  var numPedSAP = 0;
  const data = {
    link: "../models/WS-PW.php",
    op: 'NUEVO',
    numero,
    numeroSAP: 0
  }
  try {
    const resp = await enviarPeticion(data);
    numPedSAP = resp.Num;

  } catch (error) {
    console.log(error);
  }
  return numPedSAP;
}
const crearEntregaRedencionSAP = async (numero) => {
  var numEntregaSAP = 0;
  const data = {
    link: "../models/WS-PW.php",
    op: 'CREA_ENTREGAS',
    numero,
  }
  try {
    const resp = await enviarPeticion(data);
    // numEntregaSAP = resp.Num;
    console.log(resp);

  } catch (error) {
    console.log(error);
  }
  return numEntregaSAP;
}

function Cartera_edades() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) {
      alert(JQERROR);
    },
    data: {
      op: "Cartera_edades",
      org: $("#Organizacion").val(),
      codigo_sap: $("#txt_codigoSap").val()
    },
    async: true,
    success: function (resp) {
      let cardHtml = `
      <div class="panel panel-info">
        <div class="panel-heading">
          <h3 class="panel-title custom-thead" style="font-size: 14px;  font-weight: bold;">CARTERA EDADES</h3>
        </div>
        <div class="panel-body" style="padding: 5px;">
          <div class="row">`;

      // Definir valores por defecto (0) si no hay respuesta
      const data = resp.length > 0 ? resp[0] : {
        C_SIN_VENCER: 0,
        C_1_30: 0,
        C_31_60: 0,
        C_61_90: 0,
        C_91_120: 0,
        C_120: 0
      };

      cardHtml += `
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2" >
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">SIN VENCER</h5>
                  <p style="font-size: 12px; margin: 0;">${formatNum(data.C_SIN_VENCER, '$')}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2" >
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0; ">1-30 DÍAS</h5>
                  <p style="font-size: 12px; margin: 0;">${formatNum(data.C_1_30, '$')}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0; ">31-60 DÍAS</h5>
                  <p style="font-size: 12px; margin: 0;">${formatNum(data.C_31_60, '$')}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">61-90 DÍAS</h5>
                  <p style="font-size: 12px; margin: 0;">${formatNum(data.C_61_90, '$')}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">91-120 DÍAS</h5>
                  <p style="font-size: 12px; margin: 0;">${formatNum(data.C_91_120, '$')}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">+120 DÍAS</h5>
                  <p style="font-size: 12px; margin: 0;">${formatNum(data.C_120, '$')}</p>
                </div>
              </div>
            </div>`;

      cardHtml += `</div></div></div>`;
      $("#cartera_edades").html(cardHtml);
    }
  });
}

function Presupuesto_datos() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/PW-SAP.php",
    dataType: "json",
    error: function (OBJ, ERROR, JQERROR) {
      alert("Error: " + JQERROR);
    },
    data: {
      op: "Presupuesto_datos",
      org: $("#Organizacion").val(),
      codigo_sap: $("#txt_codigoSap").val()
    },
    async: true,
    success: function (resp) {
      let cardHtml = `
      <div class="panel panel-info">
        <div class="panel-heading">
          <h3 class="panel-title custom-thead" style="font-size: 13px;  font-weight: bold;">DATOS DE PRESUPUESTO</h3>
        </div>
        <div class="panel-body" style="padding: 5px;">
          <div class="row">`;

      if (!resp || resp.length === 0) {
        // Si no hay datos, mostrar valores cero
        cardHtml += `
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">VALOR PRESUPUESTO</h5>
                  <p style="font-size: 12px; margin: 0;">${(0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">VALOR NETO TOTAL</h5>
                  <p style="font-size: 12px; margin: 0;">${(0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">% CUMP. PRESUPUESTO</h5>
                  <p style="font-size: 12px; margin: 0;">0.00%</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">FALTA</h5>
                  <p style="font-size: 12px; margin: 0;">${(0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">DEBERÍA LLEVAR</h5>
                  <p style="font-size: 12px; margin: 0;">${(0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">% D. LLEVAR</h5>
                  <p style="font-size: 12px; margin: 0;">0.00%</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">% EXCESO/DÉFICIT</h5>
                  <p style="font-size: 12px; margin: 0;">0.00%</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">PROY. VS PROM.</h5>
                  <p style="font-size: 12px; margin: 0;">${(0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">% PROY. VS PROM.</h5>
                  <p style="font-size: 12px; margin: 0;">0.00%</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">PROY. DIARIA (100%)</h5>
                  <p style="font-size: 12px; margin: 0;">${(0).toLocaleString()}</p>
                </div>
              </div>
            </div>`;
      } else {
        resp.forEach(row => {
          // Convertir las cadenas a números, si son null o undefined, asignar 0
          const VALOR_PRESUPUESTO = parseFloat(row.VALOR_PRESUPUESTO) || 0;
          const VlrNetoTotal = parseFloat(row.VlrNetoTotal) || 0;
          const porCumpPpto = parseFloat(row["%CumpPpto"]) || 0;
          const Falta = parseFloat(row.Falta) || 0;
          const DeberiaLlevar = parseFloat(row.DeberiaLlevar) || 0;
          const por_D_LLV = parseFloat(row["%_D_LLV"]) || 0;
          const por_ExcesoDeficit = parseFloat(row["%_ExcesoODéficit"]) || 0;
          const ProyVsProm = parseFloat(row.ProyVsProm) || 0;
          const por_ProyVsProm = parseFloat(row["%_ProyVsProm"]) || 0;
          const ProyDiaria = parseFloat(row["ProyDiaria(100%)"]) || 0;

          cardHtml += `
            <div class="col-xs-12 col-sm-6 col-md-4" >
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">VALOR PRESUPUESTO</h5>
                  <p style="font-size: 12px; margin: 0;">${VALOR_PRESUPUESTO.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">VALOR NETO TOTAL</h5>
                  <p style="font-size: 12px; margin: 0;">${VlrNetoTotal.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">% CUMP. PRESUPUESTO</h5>
                  <p style="font-size: 12px; margin: 0;">${porCumpPpto.toFixed(2)}%</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">FALTA</h5>
                  <p style="font-size: 12px; margin: 0;">${Falta.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">DEBERÍA LLEVAR</h5>
                  <p style="font-size: 12px; margin: 0;">${DeberiaLlevar.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">% D. LLEVAR</h5>
                  <p style="font-size: 12px; margin: 0;">${por_D_LLV.toFixed(2)}%</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">% EXCESO/DÉFICIT</h5>
                  <p style="font-size: 12px; margin: 0;">${por_ExcesoDeficit.toFixed(2)}%</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">PROY. VS PROM.</h5>
                  <p style="font-size: 12px; margin: 0;">${ProyVsProm.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">% PROY. VS PROM.</h5>
                  <p style="font-size: 12px; margin: 0;">${por_ProyVsProm.toFixed(2)}%</p>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="panel panel-default custom-card shadow-sm">
                <div class="panel-body" style="padding: 5px;">
                  <h5 style="font-size: 12px; margin: 0 0 5px 0;">PROY. DIARIA (100%)</h5>
                  <p style="font-size: 12px; margin: 0;">${ProyDiaria.toLocaleString()}</p>
                </div>
              </div>
            </div>`;
        });
      }

      cardHtml += `</div></div></div>`;
      $("#Presupuesto_datos").html(cardHtml);
    }
  });
}

function toggleButton(button, checkboxDivId) {
  // Alternar la clase 'btn-success' en el botón
  $(button).toggleClass('btn-success');

  // Alternar el estado visual del "checkbox" simulado
  toggleDivCheckbox(checkboxDivId);
}

function toggleDivCheckbox(checkboxDivId) {
  var checkboxDiv = $('#' + checkboxDivId);
  var icon = checkboxDiv.find('.checkbox-icon'); // Buscar el icono dentro del div

  // Verificar si el div tiene la clase 'DivCheckBoxTrue'
  if (checkboxDiv.hasClass('DivCheckBoxTrue')) {
    // Si ya tiene la clase, quitarla y cambiar el icono
    checkboxDiv.removeClass('DivCheckBoxTrue');
    icon.text('☐'); // Cambiar a desmarcado
  } else {
    // Si no tiene la clase, añadirla y cambiar el icono
    checkboxDiv.addClass('DivCheckBoxTrue');
    icon.text('✔'); // Cambiar a marcado
  }
}

// Funciones específicas para cada botón
function BotonBonificado(button) {
  toggleButton(button, 'DvChkBonif');
}

function BotonOfertas(button) {
  toggleButton(button, 'DvChkOfertado');
}

function BotonDescuentos(button) {
  toggleButton(button, 'DvChkDctos');
}

/*function filtrarPorCodigos(objeto1, objeto2) {
  const codigosFiltro = objeto2.map(item => item.CODIGO_MATERIAL);
  const resultado = objeto1.filter(item => codigosFiltro.includes(item.codigo_material));
  return resultado;
}*/

function filtrarPorCodigos(objeto1, objeto2) {
  const mapaGrupo130 = new Map(objeto2.map(item => [item.CODIGO_MATERIAL, item.GRUPO_130]));

  const resultado = objeto1
    .filter(item => mapaGrupo130.has(item.codigo_material))
    .map(item => ({
      ...item,
      GRUPO_130: mapaGrupo130.get(item.codigo_material)
    }));

  return resultado;
}

async function Top_20_mas_vendidos_con_copi() {
  console.log('envio');
  const resp = await enviarPeticion({
    link: '../models/PW-SAP.php',
    op: 'Top_20_mas_vendidos_con_copi',
    org: $("#Organizacion").val(),
    lista: $("#txt_lista").val(),
    oficina: $("#txt_oficina").val()
  });

  console.log(resp);
  let obj = filtrarPorCodigos(ArrProd, resp);
  console.log(obj);


  let $tabla = $('<table>', {
    'class': 'table table-bordered table-hover table-sm',
    'id': 'tablaTop20Productos'
  });

  const headers = [
    'Código', 'Descripción', 'Valor Unitario', 'IVA', 'Descuento',
    'Valor Neto', ''
  ];

  let $thead = $('<thead>').addClass('thead-dark');
  let $headerRow = $('<tr>');

  $.each(headers, function (i, header) {
    $headerRow.append($('<th>').text(header));
  });

  $thead.append($headerRow);
  $tabla.append($thead);

  let $tbody = $('<tbody>');

  $.each(obj, function (index, item) {
    let $row = $('<tr>', {
      'class': 'fila-producto',
      'data-codigo': item.codigo_material,
      'css': {
        'cursor': 'pointer'
      }
    });

    // Código
    $row.append($('<td>').text(item.codigo_material));

    // Descripción con icono si bonificado ≠ 0
    let $descripcionCell = $('<td>');
    let $contenedor = $('<div>').css({
      display: 'flex',
      alignItems: 'center'
    });

    if (parseFloat(item.bonificado) !== 0) {
      let descripcionCompleta = item.descripcion;
      let descBonificadoN = item.desc_bonificado_n || '';
      let stock = item.stock || '0';
      let stockBonificado = item.stock_bonificado || '0';
      let condicion = item.condicion_b || '';
      let stockPrepack = item.stock_prepack || '0';

      let $img = $('<img>', {
        src: '../resources/icons/regalo.png',
        width: 24,
        height: 24,
        align: 'absmiddle',
        // title: 'Código: ' + item.codigo_material + '\n' +
        //         'Descripción: ' + item.descripcion + '\n' +
        //         'Condición: ' + item.condicion_b,
        onclick: `event.stopPropagation(); InfoBon('${descripcionCompleta.replace(/'/g, "\\'")}', '${descBonificadoN.replace(/'/g, "\\'")}', '${stock}', '${stockBonificado}', '${condicion}', '${stockPrepack}')`
      }).css({
        marginRight: '8px',
        display: 'inline-block',
        verticalAlign: 'middle',
        cursor: 'pointer'
      });

      $contenedor.append($img);
    }

    let $textoDesc = $('<span>').text(item.descripcion).css({
      display: 'inline-block',
      verticalAlign: 'middle'
    });

    $contenedor.append($textoDesc);
    $descripcionCell.append($contenedor);
    $row.append($descripcionCell);

    // Valor Unitario
    $row.append($('<td>').text('$' + parseFloat(item.valor_unitario).toLocaleString('es-CO')));

    // IVA
    $row.append($('<td>').text(item.iva));

    // Descuento
    $row.append($('<td>').text(item.descuento));

    // Valor Neto
    $row.append($('<td>').text('$' + parseFloat(item.valor_neto).toLocaleString('es-CO')));

    // Grupo 130 con estrella
    let $grupoCell = $('<td>');
    if (parseInt(item.GRUPO_130) === 1) {
      let $estrella = $('<img>', {
        src: '../resources/icons/estrella.png',
        width: 24,
        height: 24,
        align: 'absmiddle'
      });
      $grupoCell.append($estrella);
    }
    $row.append($grupoCell);

    $tbody.append($row);
  });

  $tabla.append($tbody);
  $('#TablaTop20_100_130').empty().append($tabla);

  // Evento click fila
  $(document).off('click', '.fila-producto').on('click', '.fila-producto', function () {
    const $fila = $(this);
    const codigoMaterial = $fila.data('codigo');
    $('#txt_bproductos').val(codigoMaterial);
    BuscarProductoArr(0);
    $('#ModalTop20_100_130').modal('hide');
    $('.fila-producto').removeClass('table-active');
    $fila.addClass('table-active');
  });

  // Mostrar modal
  $('#ModalTop20_100_130').modal('show');
}