//Imagen de carga.
function LoadImg(texto) {
  let html = `<center>
                <figure>
                  <img src="../resources/icons/preloader.gif" class="img-responsive"/>
                </figure>
                <figcaption>${texto}</figcaption>
              </center>`;
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

const SubirArchivosAdj = async (codigoSAP, arr_arch) => {
  let nuevoNombre = "";
  for (let i = 0; i < arr_arch.length; i++) {
    console.log(arr_arch[i].name);
    if (arr_arch[i]) {
      nuevoNombre = arr_arch[i].name;
      let UploadFile = await subirArchivos(arr_arch[i], {
        validateSize: false,
        maxSize: 0,
        validateExt: false,
        typesFile: {},
        ruta: "/web/nomina",
      }, (params = { nuevo_nombre: `${nuevoNombre}` }));

      if (UploadFile.ok) {
        await enviarPeticion({ nombre: `${nuevoNombre}`, codigoSAP, link: "../models/Nomina.php", op: "G_DOCUMENTOS", });
      } else {
        console.log(i);
      }
    }
  }
}

const guardarDocumentos = () => {
  const codigoSAP = $('#txtCodigoSAP').val();
  const certificadoBancario = document.querySelector('#certificadoBancario').files[0];
  const certificadoEstudio = document.querySelector('#certificadoEstudio').files[0];
  const certificadoEps = document.querySelector('#certificadoEps').files[0];
  const certificadoArl = document.querySelector('#certificadoArl').files[0];
  const certificadoAfp = document.querySelector('#certificadoAfp').files[0];
  const hojaVida = document.querySelector('#hojaVida').files[0];
  const contrato = document.querySelector('#contrato').files[0];
  const cedula = document.querySelector('#cedula').files[0];
  const examen = document.querySelector('#examen').files[0];

  let arr_arch = [hojaVida, cedula, contrato, examen, certificadoBancario, certificadoEstudio, certificadoEps, certificadoArl, certificadoAfp];
  console.log(arr_arch);
  SubirArchivosAdj(codigoSAP, arr_arch);
}

const clickArchivos = (idBoton, txtDoc) => {
  let btnArchivo = document.querySelector(`#${idBoton}`);
  btnArchivo.addEventListener("click", (e) => { 
    let url = `${url_file}/web/workflow/${txtDoc}.pdf`;
    let elementoIframe = `<iframe src="${url}?t=${new Date().getTime()}" width="100%" height="600px"></iframe>`;
    $("#visorPDF").html(elementoIframe);
    $("#modalVistaArchivos").modal('show');
  });
}

const getDocumentos = async (codigoSapEmp) => {
  const resp = await enviarPeticion({op: "G_DOCUMENTOS", codigoSapEmp, link: "../models/Nomina.php"});
  const {HOJA_VIDA, CEDULA_CIUDADANIA, CONTRATO_LABORAL} = resp[0];
  console.log({HOJA_VIDA, CEDULA_CIUDADANIA, CONTRATO_LABORAL});
  if (HOJA_VIDA) {
    $('#btnHV').removeClass('btn-secondary').addClass('btn-success');
    clickArchivos("btnHV", HOJA_VIDA);
  }
}

//Carga de clientes
function LoadEmpleado() {
  let codigo = $("#txtCodigoSAP").val();
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/Nomina.php",
    dataType: "json",
    async: true,
    beforeSend: function () {
      LoadImg('CARGANDO EMPLEADO...');
    },
    data: {
      op: "S_EMPLEADO",
      codigo
    },
    success: function (data) {
      if (data.length) {
        $("#txtNombres").val(data[0].NOMBRES);
        $("#txtTipoidentificacion").val(data[0].TIPO_IDENTIFICACION);
        $("#txtIdentificacion").val(data[0].IDENTIFICACION);
        $("#txtfhIngreso").val(data[0].INICIO_CONTRATO);
        $("#txtSalario").val(formatNum(data[0].SALARIO, '$'));
        $("#txtDireccion").val(data[0].DIRECCION);
        $("#txtCiudad").val(data[0].CIUDAD);
        $("#txtSalud").val(data[0].DESC_SALUD);
        $("#txtCaja").val(data[0].DESC_CAJA);
        $("#txtARL").val(data[0].DESC_ARL);
        $("#txtCuentaBanco").val(data[0].NUMERO_CUENTA);
        PeriodosNomina(codigo);
        $('#tabEmpleadoDoc').attr('disabled', false);
        // getDocumentos(codigo);
      }
    }
  }).done(function () {
    UnloadImg();
  }).fail(function (data) {
    console.error(data);
  });
}

function PeriodosNomina(codigo) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/Nomina.php",
    dataType: "json",
    async: true,
    beforeSend: function () {},
    data: {
      op: "S_PERIODOS",
      codigo
    },
    success: function (data) {
      let option = '';
      for (let i = 0; i <= data.length - 1; i++) {
        option += `<option value="${data[i].FECHA}">${data[i].FECHA}</option>`;
      }
      $("#slcPeriodo").html(option);
    }
  });
}

function VisualizarFactura() {
  $("#ModalPDF").modal("hide");
  let periodo = $("#slcPeriodo").val();
  let codigo = $("#txtCodigoSAP").val();
  if (!isNaN(codigo) && codigo != '') {
    $("#ContenidoPDF").html(`<embed src="../resources/tcpdf/ColillaPago.php?codigo=${parseInt(codigo)}&periodo=${periodo}" frameborder="0" width="100%" height="400px">`);
    $("#ModalPDF").modal("show");
  } else {
    Swal.fire("Cancelado", "Debe seleccionar un empleado válido!", "error");
  }
}

function VisualizarCarta() {
  $("#ModalPDF").modal("hide");
  let codigo = $("#txtCodigoSAP").val();
  let tipo = $("#slcTipoCarta").val();
  if (!isNaN(codigo) && codigo != '') {
    if (tipo != 0) {
      $("#ContenidoPDF").html(`<embed src="../resources/tcpdf/CertificadoLaboral.php?codigoSAP=${parseInt(codigo)}&tipo=${tipo}" frameborder="0" width="100%" height="400px">`);
      $("#ModalPDF").modal("show");
    } else {
      Swal.fire("Cancelado", "Debe seleccionar un tipo de carta", "error");
    }
  } else {
    Swal.fire("Cancelado", "Debe seleccionar un empleado válido!", "error");
  }
}

// EJECUCIÓN DE FUNCIONALIDADES 
$(function () {
  $("#txtCodigoSAP").keypress(function (e) {
    if (e.which == 13) {
      LoadEmpleado();
    }
  });

  $("#btnGeneraColilla").click(function () {
    VisualizarFactura();
  });

  $("#btnGeneraCarta").click(function () {
    VisualizarCarta();
  });

  let ses_CodSap = $("#ses_CodSap").val();
  let RolId = $("#RolId").val();

  if (RolId != 1 && RolId != 112) {
    $("#txtCodigoSAP").val(ses_CodSap);
    $("#txtCodigoSAP").attr({
      'disabled': true,
      'readonly': true
    });
    LoadEmpleado();
  } else {
    $("#txtCodigoSAP").val('');
    $("#txtCodigoSAP").attr({
      'disabled': false,
      'readonly': false
    });
  }

  $('#btnAgregarDoc').click( ()=> {
    $('#modalDocumentos').modal('show');
  });

  $('#btnGuardarDocs').click( ()=> {
    guardarDocumentos();
  });
});