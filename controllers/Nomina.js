let url_file = "https://app.pwmultiroma.com/web/nomina/";

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

function renderizarGaleria(resp) {
  console.log(resp);

  const documentos = [
    { nombre: 'Hoja de vida', campo: 'HOJA_VIDA', icono: '<i class="fas fa-file" style="color: #837d7d;"></i>' },    
    { nombre: 'Cédula de ciudadanía', campo: 'CEDULA_CIUDADANIA', icono: '<i class="fa-solid fa-id-card" style="color: #a52a2a;"></i>' },    
    { nombre: 'Contrato laboral', campo: 'CONTRATO_LABORAL', icono: '<i class="fa-solid fa-file-contract" style="color: #0d6efd;"></i>' },    
    { nombre: 'Exámenes médicos', campo: 'EXAMENES_MEDICOS', icono: '<i class="fa-solid fa-stethoscope" style="color: #ff7f50;"></i>' },    
    { nombre: 'Certificado bancario', campo: 'CERTIFICACION_BANCARIA', icono: '<i class="fa-solid fa-building-columns" style="color: #05bdb6;"></i>' },    
    { nombre: 'Certificado estudio', campo: 'CERTIFICADO_ESTUDIO', icono: '<i class="fa-solid fa-graduation-cap" style="color: #15158d;"></i>' },    
    { nombre: 'Certificado EPS', campo: 'CERTICADO_EPS', icono: '<i class="fa-solid fa-suitcase-medical" style="color: #ef0a0a;"></i>' },    
    { nombre: 'Certificado ARL', campo: 'CERTIFICADO_ARL', icono: '<i class="fa-solid fa-helmet-safety" style="color: #ffc107;"></i>' },    
    { nombre: 'Certificado AFP', campo: 'CERTIFICADO_AFP', icono: '<i class="fa-solid fa-sack-dollar" style="color: #025e02;"></i>' }    
  ];

  const galeria = document.getElementById("galeria");
  galeria.innerHTML = documentos.map(doc => `
                <div class="gallery-item" data-item="${resp[0][doc.campo]}" style="position: relative;">
                    ${doc.icono}
                    <p>${doc.nombre}</p>
                    <span class="${(resp[0][doc.campo]) ? '' : 'd-none'}" style="position: absolute; top: -4px; right: -6px;">
                      <i class="fa-regular fa-circle-check text-success" style="font-size: 20px;"></i>
                    </span>                   
                </div>`).join('');
  
  $('#galeria').on('click', '.gallery-item', function () {
    const archivo = $(this).attr('data-item');
    if (archivo) {
      let url = `${url_file}${archivo}.pdf`;
      let elementoIframe = `<iframe src="${url}?t=${new Date().getTime()}" width="100%" height="600px"></iframe>`;
      $("#visorPDF").html(elementoIframe);
      // setTimeout(() => {
        $("#ModalPDF").modal('show');        
      // }, 500);
    } else {
      Swal.fire("😥Oops...!", "Sin archivo disponible", "warning");
    }
  });
}

const getDocumentos = async (codigoSapEmp) => {
  const resp = await enviarPeticion({op: "G_DOCUMENTOS", codigoSapEmp, link: "../models/Nomina.php"});

  if (resp.length) {
    renderizarGaleria(resp);
    $('#contenedorBtn').removeClass('d-flex').hide();
    $('#contenedorBtn2').addClass('d-flex').show();
  } else {
    $('#contenedorBtn').addClass('d-flex').show();
    $('#contenedorBtn2').removeClass('d-flex').hide();
    document.getElementById("galeria").innerHTML = `<p class="lead text-center" style="font-size: 25px;">El empleado no cuenta con documentos</p>`;
  }
}

const SubirArchivosAdj = async (codigoSAP, arr_arch) => {
  let camposParaActualizar = {};

  for (let i = 0; i < arr_arch.length; i++) {
    const item = arr_arch[i];
    if (item && item.file) {
      const archivo = item.file;
      const campoBD = item.campo;
      const nuevoNombre = `${codigoSAP}_${campoBD}`;

      const UploadFile = await subirArchivos(archivo, {
        validateSize: false,
        maxSize: 0,
        validateExt: false,
        typesFile: {},
        ruta: "/web/nomina",
      }, { nuevo_nombre: nuevoNombre });

      if (UploadFile.ok) {
        console.log(`Subido: ${nuevoNombre}`);
        camposParaActualizar[campoBD] = nuevoNombre;
      } else {
        console.warn(`Error al subir ${campoBD}`);
      }
    }
  }

  // TODO: REALIZAR FUNCIONALIDAD DE ACTUALIZAR DOCUMENTOS
  // TODO: VALIDAR SI YA EXISTE REGISTRO
  if (Object.keys(camposParaActualizar).length > 0) {
    const resp = await enviarPeticion({
      link: "../models/Nomina.php",
      op: "I_DOCUMENTOS",
      codigoSAP,
      ...camposParaActualizar
    });
    if (resp.ok) {
      getDocumentos(codigoSAP);
      Swal.fire("Guardar ducumentos", "Se guardaron los documentos correctamente", "success");
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

  const arr_arch = [
    {file: certificadoBancario, campo: "CERTIFICACION_BANCARIA"},
    {file: certificadoEstudio, campo: "CERTIFICADO_ESTUDIO"},
    {file: certificadoEps, campo: "CERTICADO_EPS"},
    {file: certificadoArl, campo: "CERTIFICADO_ARL"},
    {file: certificadoAfp, campo: "CERTIFICADO_AFP"},
    {file: hojaVida, campo: "HOJA_VIDA"},
    {file: contrato, campo: "CONTRATO_LABORAL"},
    {file: cedula, campo: "CEDULA_CIUDADANIA"},
    {file: examen, campo: "EXAMENES_MEDICOS"}
  ];
  
  SubirArchivosAdj(codigoSAP, arr_arch);

  $('#modalDocumentos').modal('hide');
}

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
        getDocumentos(codigo);
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
    $('#exampleModalLabel').text("Agregar documentos");
    $('#btnGuardarDocs').text("Guardar documentos");
  });

  $('#btnAgregarDoc2').click( ()=> {
    $('#modalDocumentos').modal('show');
    $('#exampleModalLabel').text("Actualizar documentos");
    $('#btnGuardarDocs').text("Actualizar documentos");
  });

  $('#btnGuardarDocs').click( ()=> {
    guardarDocumentos();
  });
});