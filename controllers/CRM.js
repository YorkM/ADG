let Visualizar_Vinculos  = '';
const arrayMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const arrayMesesShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const urlArchivo = "https://app.pwmultiroma.com/web/ProcesosJuridicos/";
const usuario = $('#usuario').val();
// FUNCIÓN CONFIRM AACCIONES
const confirmAlert = async (title, text) => {
  const result = await Swal.fire({
    title: `${title}`,
    text: `${text}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
  });
  return result;
}
// FUNCIÓN PARA SUBIR ARCHIVOS AL SERVIDOR
const SubirArchivosAdj = async (idProceso, arrayArchivos, codigo) => {
  for (let i = 0; i < arrayArchivos.length; i++) {
    if (arrayArchivos[i]) {
      const item = arrayArchivos[i];
      let nombreArchivo = item.file.name.split('.')[0].replace(' ', '_');
      const nuevoNombre = `${codigo}_${nombreArchivo}`;
      const campoActualizar = item.campo;       
      let UploadFile = await subirArchivos(arrayArchivos[i].file, {
        validateSize: false,
        maxSize: 0,
        validateExt: false,
        typesFile: {},
        ruta: "/web/ProcesosJuridicos",
      }, (params = { nuevo_nombre: nuevoNombre }));

      if (UploadFile.ok) {
        await enviarPeticion({ 
          op: "U_ARCHIVOS", 
          link: "../models/CRM.php", 
          nombreArchivo: nuevoNombre,
          campoActualizar, 
          idProceso, 
        });
      } else {
        console.log(i);
      }
    }
  }
}
// FUNCIÓN OBTENER PERMISOS
function obtenerPermisos(modulo) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "../models/Notas.php",
      dataType: "json",
      data: {
        op: "S_PERMISOS",
        rol: $("#Rol").val(),
        modulo: modulo,
      },
      success: function (data) {
        if (Array.isArray(data) && data.some((d) => d.chck === 'S')) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      error: function (errorThrown) {
        console.error("Error en la solicitud AJAX:", errorThrown);
        reject(errorThrown);
      },
    });
  });
}
// FUNCIÓN ACTUALIZAR ELEMENTOS
function actualizarElementoSegunPermisos(modulo, elementoId) {
  obtenerPermisos(modulo).then((tienePermisos) => {
    const $elemento = $(elementoId);
    if (tienePermisos) {
      $elemento.show();
    } else {
      $elemento.hide();
    }
  });
}
// FUNCIÓN CONFIGURAR AÑOS
async function Anios () {
  const max   = new Date().getFullYear();
  const min   = max - 10;  
  let d = {}
  for (let i = max; i >= min; i--) {
	  
	  d[i] = i;
  }   
  return d;
}
//FUNCIÓN CARTERA POR EDADES
function CarteraXEdades(codigo) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "json",
    data: {
      op: "CarteraXEdades",
      codigo
    },
    success: function (data) {
      let tabla = `
      <table class="table table-bordered table-hover table-sm" width="100%">
      <tbody>`;

      if (data.length) {
        data.forEach(item => {
          tabla += `
          <tr>
            <th class="size-th">SIN VENCER</th>
            <td class="size-12">${formatNum(item.C_SIN_VENCER, '$')}</td>
          </tr>
          <tr>
            <th class="size-th">31 A 60</th>
            <td class="size-12">${formatNum(item.C_31_60, '$')}</td>
          </tr>
          <tr>
            <th class="size-th">61 A 90</th>
            <td class="size-12">${formatNum(item.C_61_90, '$')}</td>
          </tr>
          <tr>
            <th class="size-th">91 A 120</th>
            <td class="size-12">${formatNum(item.C_91_120, '$')}</td>
          </tr>
          <tr>
            <th class="size-th">MAS DE 120</th>
            <td class="size-12">${formatNum(item.C_120, '$')}</td>
          </tr>`;
        });
      }

      tabla += `</tbody></table>`;
      $("#dvCarteraxEdades").html(tabla);
    }
  }).fail(function (data) {
    $("#Aficiones").html(`<h3>ERROR...${data}</h3>`);
  });
}
// FUNCIÓN GESTIONES
function Gestiones(codigo) {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "json",
    data: {
      op: "Gestiones",
      codigo
    },
    success: function (data) {
      if (data.length) {
        let tabla = `
        <table class="table table-bordered table-hover table-sm mb-0" width="100%">
          <thead>
            <tr>
              <th class="size-th bag-info">NOMBRES</th>
              <th class="size-th bag-info">FECHA</th>
              <th class="size-th bag-info text-center">DESCRIPCION</th>
            </tr>
          </thead>
          <tbody>`;

        data.forEach(item => {
          tabla += `
          <tr>
            <td class="size-11 vertical">${item.NOMBRES}</td>
            <td class="size-11 vertical">${item.FECHA_VISITA}</td>
            <td class="size-11">
              <table class="table table-bordered table-hover table-sm mb-0" width="100%">
                <thead class="bg-info">
                  <tr>
                    <th class="size-th bag-info">DPTO</th>
                    <th class="size-th bag-info">OBJETIVO</th>
                    <th class="size-th bag-info">LOGRO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="size-11">CARTERA</td>
                    <td class="size-11">${item.OBJETIVO_CARTERA}</td>
                    <td class="size-11">${item.LOGRO_CARTERA}</td>
                  </tr>
                  <tr>
                    <td class="size-11">JURIDICA</td>
                    <td class="size-11">${item.OBJETIVO_JURIDICA}</td>
                    <td class="size-11">${item.LOGRO_JURIDICA}</td>
                  </tr>
                  <tr>
                    <td class="size-11">VENTA</td>
                    <td class="size-11">${item.OBJETIVO_VENTA}</td>
                    <td class="size-11">${item.LOGRO_VENTA}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>`;
        });
        tabla += `</tbody></table>`;
        $("#dvGestiones").html(tabla);
      }
    }
  }).fail(function (data) {
    $("#Aficiones").html(`<h3>ERROR... ${data}</h3>`);
  });
}
// FUNCIÓN CARDARAF
function CardarAf() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "json",
    beforeSend: function () {
      $("#Aficiones").html("<h3>CARGANDO...</h3>");
    },
    data: {
      op: "Load_Aficiones"
    },
    success: function (data) {
      if (data.length > 0) {
        let tb = `<table class="table_af" cellpadding="0" cellspacing="3" width="100%"><tr>`;
        data.forEach(item => tb += `<td><label>${item.AFICION}</label>&nbsp;&nbsp;<input  type="checkbox"  name="aficiones" value="${item.ID}" class="InputG"></td>`);
        tb += `</tr>`;
        $("#Aficiones").html(tb);
      } else {
        $("#Aficiones").html("<h4>Sin resultados</h4>");
      }
    }
  }).fail(function (data) {
    $("#Aficiones").html(`<h3>ERROR... ${data}</h3>`);
  });
}
// FUNCIÓN LIMPIAR MATERIALES
function LimpiarMateriales() {
  $("#InpMaterial").val('');
  $("#dvResultFact").html('');
  $("#InpMaterial").focus();
}
// FUNCIÓN CONSULTAR FACTURAS
function ConsultarFacturas(material) {
  let codigo = $("#txtCodigo").val();

  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "json",
    error: function (JQERROR) {
      alert(JQERROR);
    },
    data: {
      op: 'S_FACTURAS',
      material: material,
      codigo
    },
    success: function (data) {
      if (data.length) {
        let tabla = `
        <table class="table table-bordered table-hover table-sm">
          <thead>
            <tr>
              <th class="size-th bag-info">N° PEDIDO</th>
              <th class="size-th bag-info">FECHA PEDIDO</th>
              <th class="size-th bag-info">TIPO FACT.</th>
              <th class="size-th bag-info">N° FACTURA</th>
              <th class="size-th bag-info">FECHA FACT.</th>
              <th class="size-th bag-info">NOTAS</th>
            </tr>
          </thead>
          <tbody>`;

        data.forEach(item => {
          tabla += `
          <tr onclick="Verfactura('${item.NUMERO_FACTURA}')">
            <td class="size-14 vertical">${item.NUMERO}</td>
            <td class="size-14 vertical">${item.FECHA_PEDIDO}</td>
            <td class="size-14 vertical">${item.TIPO_FACTURA}</td>
            <td class="size-14 vertical">${item.NUMERO_FACTURA}</td>
            <td class="size-14 vertical">${item.FECHA_INICIO}</td>
            <td class="size-14 vertical">${item.NOTA}</td>
          </tr>`;
        });
        tabla += `</tbody></table>`;
        $("#dvResultFact").html(tabla);
      } else {
        $("#dvResultFact").html(`<p class="text-center lead">No existe este material en ninguna de las facturas asociadas al cliente</p>`);
      }
    }
  });
}
// FUNCIÓN LISTAR ACUERDOS
function Listar_acuerdos() {
  let codigo = $("#txtCodigo").val();
  let org = $("#Organizacion").val();

  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "json",
    error: function (JQERROR) {
      alert(JQERROR);
    },
    beforeSend: function () {
      LoadImg('Cargando Información...');
    },
    data: {
      op: 'B_ACUERDOS',
      codigo,
      org
    },
    success: function (data) {
      if (data.length) {
        let tabla = `
        <table class="table table-bordered table-hover table-sm">
            <thead>
              <tr>
                <th class="size-th-2 bag-info">N°</th>
                <th class="size-th-2 bag-info">NOMBRE</th>
                <th class="size-th-2 bag-info">FECHA INI</th>
                <th class="size-th-2 bag-info">FECHA FIN</th>
                <th class="size-th-2 bag-info">INCENTIVO %</th>
                <th class="size-th-2 bag-info">MONTO $</th>
                <th class="size-th-2 bag-info">OBSERVACIONES</th>
                <th class="size-th-2 bag-info">FACTURADO</th>
                <th class="size-th-2 bag-info">CUMPLIMIENTO</th>
                <th class="size-th-2 bag-info"></th>
              </tr>
            </thead>
            <tbody>`;

        data.forEach(item => {
          let cumplimiento = formatNum(redondear((item.vlr / item.MONTO) * 100, 2));

          tabla += `
          <tr ondblclick="Veracuerdos('${item.ADJUNTO}')">
            <td class="size-14 vertical">${item.NUMERO}</td>
            <td class="size-13 vertical">${item.NOMBRES}</td>
            <td class="size-14 vertical">${item.FECHA_INI}</td>
            <td class="size-14 vertical">${item.FECHA_FIN}</td>
            <td class="size-14 vertical">${item.INCENTIVO}</td>
            <td class="size-14 vertical">${formatNum(item.MONTO, '$')}</td>
            <td class="size-13 vertical">${item.OBSERVACION}</td>
            <td class="size-14 vertical">${formatNum(item.vlr, '$')}</td>
            <td class="size-14 vertical">${cumplimiento}%</td>`;

          if ($("#Rol").val() == '1') {
            tabla += `
            <td align="center">
              <span onClick="DelAcuerdo('${item.ID}')"><i class="fa-solid fa-trash-can text-danger"></i></span>
            </td></tr>`;
          } else {
            tabla += `
            <td class="hidden" align="center">
              <span onClick="DelAcuerdo('${item.ID}')"><i class="fa-solid fa-trash-can text-danger"></i></span>
            </td></tr>`;
          }
        });       
        tabla += `</tbody></table>`;
        $("#dvResultAcu").html(tabla);
      } else {
        $("#dvResultAcu").html(`<p class="text-center lead">No existen acuerdos</p>`);
      }
    }
  }).done(function () {
    UnloadImg();
  })
}
// FUNCIÓN REDONDEAR VALORES
function redondear(numero, digitos) {
  let base = Math.pow(10, digitos);
  let entero = Math.round(numero * base);
  return entero / base;
}
// FUNCIÓN LISTAR PAGARÉ
function ListarPagare() {
  let codigo = $("#txtCodigo").val();

  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "json",
    error: function (JQERROR) {
      alert(JQERROR);
    },
    data: {
      op: 'B_PAGARES',
      codigo
    },
    success: function (data) {
      if (data.length) {
        let tabla = `
        <table class="table">
          <thead>
            <tr>
             <th>#</th>
            </tr>
          </thead>
          <tbody>`;

        data.forEach(item => {
          tabla += `
          <tr ondblclick="Verpagare('${item.ADJUNTO}')">
            <td>${item.ID}</td>
          </tr>`;
        });

        tabla += `</tbody></table>`;
        $("#DlgInfoDet").html('');
        $("#DlgInfoDet").html(tabla);
      } else {
        $("#DlgInfoDet").html(`<p class="text-center lead">NO EXISTEN RESULTADOS</p>`);
      }
    }
  });
}
// FUNCIÓN VER ACUERDOS
function Veracuerdos(archivo) {
  $("#ContenidoPDF").html(`<embed src="../resources/acuerdos/${archivo}" frameborder="0" width="100%" height="400px">`);
  $("#ModalPDF").modal("show");
}
// FUNCIÓN VER PAGARÉ
function Verpagare(archivo) {
  $("#ContenidoPDF").html(`<embed src="../resources/pagare/${archivo}" frameborder="0" width="100%" height="400px">`);
  $("#ModalPDF").modal("show");
}
// FUNCIÓN VER FACTURA
function Verfactura(num) {
  if (!isNaN(num)) {
    $("#ContenidoPDF").html(`<embed src="../resources/tcpdf/Factura.php?num=${parseInt(num)}" frameborder="0" width="100%" height="400px">`);
    $("#ModalPDF").modal("show");
  } else {
    Swal.fire("Cancelado", "El documento no contiene un numero de referencia válido!", "error");
  }
}
// FUNCIÓN VER DEVOLUCIÓN
function VerDevolucion(num) {
  if (!isNaN(num)) {
    $("#ContenidoPDF").html(`<embed src="../resources/tcpdf/Devolucion.php?num=${parseInt(num)}" frameborder="0" width="100%" height="400px">`);
    $("#ModalPDF").modal("show");
  } else {
    Swal.fire("Cancelado", "El documento no contiene un numero de referencia valido!", "error");
  }
}
// FUNCIÓN CARGAR DEPARTAMENTOS
function Departamentos() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "json",
    error: function (JQERROR) {
      alert(JQERROR);
    },
    data: {
      op: 'B_DEPARTAMENTOS'
    },
    success: function (data) {
      let option = '';
      data.forEach(item => option += `<option value="${item.DEPARTAMENTO}">${item.DESCRIPCION}</option>`);      
      $("#slcDtpo").html(option);
      Ciudades();
    }
  });
}
// FUNCIÓN CARGAR CIUDADES
function Ciudades() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "json",
    error: function (JQERROR) {
      alert(JQERROR);
    },
    data: {
      op: 'B_CIUDADES',
      dpto: $("#slcDtpo").val()
    },
    success: function (data) {
      let option = '';
      data.forEach(item => option += `<option value="${item.CIUDAD}">${item.DESCRIPCION}</option>`);    
      $("#slcCiudad").html(option);
    }
  });
}
// FUNCIÓN GESTIONAR DIRECCIONES
function Direcciones() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "json",
    error: function (JQERROR) {
      alert(JQERROR);
    },
    data: {
      op: 'B_DIRECCIONES',
      codigo: $("#txtCodigo").val()
    },
    success: function (data) {
      if (data.length) {
        let tabla = `
        <table class="table" >
          <thead>
            <tr>
              <th class="size-th-2 bag-info">DIRECCION</th>
              <th class="size-th-2 bag-info">DEPARTAMENTO</th>
              <th class="size-th-2 bag-info">CIUDAD</th>
              <th class="size-th-2 bag-info text-center">ELIMINAR</th>
            </tr>
          </thead>
          <tbody>`;

        data.forEach(item => {
          tabla += `
          <tr>
            <td class="size-14 vertical">${item.DIRECCION}</td>
            <td class="size-13 vertical">${item.DPTO}</td>
            <td class="size-13 vertical">${item.CIUDAD}</td>
            <td align="center">
              <span onClick="DelDireccion('${item.ID}')"><i class="fa-solid fa-trash-can" style="font-size: 22px; color: red;"></i></span>
            </td>
          </tr>`;
        });
        tabla += `</tbody></table>`;
        $("#dvResultDir").html(tabla);
      } else {
        $("#dvResultDir").html(`<p class="text-center lead">No existen direcciones alternas para este cliente</p>`);
      }
    }
  });
}
// FUNCIÓN ELIMINAR ACUERDO
async function DelAcuerdo(id) {
  const result = await confirmAlert("Eliminar Acuerdo", "¿Está seguro(a) de eliminar el acuerdo?");
  if (!result.isConfirmed) return;

  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "html",
    error: function (JQERROR) {
      alert(JQERROR);
    },
    data: {
      op: 'D_ACUERDOS',
      id: id
    },
    success: function (data) {
      if (data == 1) {
        Swal.fire('Excelente!', 'Acuerdo eliminado correctamente!', 'success');
        Listar_acuerdos();
      } else {
        Swal.fire('Oops!', 'Error al intentar eliminar este contrato!', 'error');
      }
    }
  });
}
// FUNCIÓN ELIMINAR DIRECCIÓN
async function DelDireccion(id) {
  const result = await confirmAlert("Eliminar Dirección", "¿Está seguro(a) de eliminar la dirección alterna?");
  if (!result.isConfirmed) return;

  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "html",
    error: function (JQERROR) {
      alert(JQERROR);
    },
    beforeSend: function () {},
    data: {
      op: 'D_DIRECCIONES',
      id: id
    },
    success: function (data) { //alert(data);
      if (data == 1) {
        Swal.fire('Excelente!', 'Direccion eliminada correctamente!', 'success');
        Direcciones();
      } else {
        Swal.fire('Oops!', 'Error al intentar eliminar esta direccion!', 'error');
      }
    }
  });
}
// FUNCIÓN PARA OBTENER LA CARTERA
function Cartera() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "json",
    error: function (JQERROR) {
      alert(JQERROR);
    },
    beforeSend: function () {
      LoadImg('Cargando...');
    },
    data: {
      op: 'B_CARTERA',
      codigo: $("#txtCodigo").val(),
      org: $("#Organizacion").val(),
      DepId: $("#DepId").val(),
      tipo: $("#Tipopartidas").val(),
      anio: $("#anio").val()
    },
    success: function (data) {
      if (data.length) {
        let idDpto = $("#DepId").val();
        let detalle = '';
        let total = 0;
        let mora = '';
        let ver = '';
        let cont = 0;
        let vlrMora = 0;
        let style = '';

        if (idDpto == 10 || idDpto == 11 || idDpto == 13) {
          style = 'style="display: none;"';
        }

        data.forEach(item => {
          if (parseInt(item.DEMORA) > 0) {
            mora = 'style="background-color: #F77577"';
            vlrMora = vlrMora + parseFloat(item.IMPORTE);

          } else {
            mora = 'style="background-color: #75F7A8"';
          }

          if ($.trim(item.CLASE_DOCUMENTO) == 'RV') {
            ver = `<span style="cursor: pointer;" onClick="Verfactura('${item.REFERENCIA.trim()}')"><i class="fa-solid fa-eye fa-lg text-success"></i></span>`;

          } else if (item.CLASE_DOCUMENTO.trim() == 'DZ') {
            ver = `<span style="cursor: pointer;" onClick="Verfactura('${item.REFERENCIA_FACTURA.trim()}')"><i class="fa-solid fa-eye fa-lg text-success"></i></span>`;

          } else if (item.CLASE_DOCUMENTO.trim() == 'DA') {
            ver = `<span style="cursor: pointer;" onClick="VerDevolucion('${item.REFERENCIA_FACTURA}')"><i class="fa-solid fa-eye fa-lg text-success"></i></span>`;

          } else {
            ver = '';
          }

          let cumple_img = '<span><i class="fa-solid fa-flag fa-lg text-danger"></i></span>';
          if (parseFloat(item.CUMP_PRESUPUESTO) > 0) {
            cumple_img = '<span><i class="fa-solid fa-flag fa-lg text-success"></i></span>';
          }

          detalle += `
          <tr>
            <td class="size-14 vertical">${item.NUMERO_DOCUMENTO}</td>
            <td class="size-14 vertical">${item.REFERENCIA}</td>
            <td class="size-13 vertical">${item.CLASE_DOCUMENTO}</td>
            <td class="size-14 vertical">${ver}</td>
            <td class="size-14 vertical">${item.FECHA_BASE}</td>
            <td class="size-14 vertical" ${style}>${item.FECHA_PAGO}</td>
            <td class="size-14 vertical" ${style}>${item.CONDICION_PAGO}</td>
            <td class="size-14 vertical" ${style} ${mora}>${item.DEMORA}</td>
            <td class="size-14 vertical" ${style}>${item.DIAS}</td>
            <td class="size-14 vertical">${formatNum(item.IMPORTE, '$')}</td>
            <td class="size-14 vertical">${formatNum(parseFloat(item.VNETO) + parseFloat(item.BASE_PP), '$')}</td>
            <td class="size-14 vertical">${item.TEXTO}</td>
            <td class="size-14 vertical">${item.REFERENCIA_FACTURA}</td>
            <td class="size-14 vertical">${cumple_img}</td>
          </tr>`;

          total += parseFloat(item.IMPORTE);
          cont++;
        });       

        let tabla = `
        <table class="table table-bordered table-hover table-sm">
          <thead>
            <tr>
              <th class="bag-info size-th-2">VALOR TOTAL:${formatNum(total, '$')}</th>
              <th class="bag-info size-th-2">PARTIDAS: ${cont}</th>
              <th class="bag-info size-th-2" colspan="12">VALOR MORA: ${formatNum(vlrMora, '$')}</th>
            </tr>
            <tr>
              <th class="size-th-2 bag-info">DOCUMENTO</th>
              <th class="size-th-2 bag-info">REFERENCIA</th>
              <th class="size-th-2 bag-info">CLASE</th>
              <th class="size-th-2 bag-info">VER</th>
              <th class="size-th-2 bag-info">FECHA BASE</th>
              <th class="size-th-2 bag-info"${style}>FECHA PAGO</th>
              <th class="size-th-2 bag-info"${style}>CONDICION</th>
              <th class="size-th-2 bag-info"${style}>DEMORA</th>
              <th class="size-th-2 bag-info"${style}>DIA</th>
              <th class="size-th-2 bag-info">IMPORTE</th>
              <th class="size-th-2 bag-info">BASE PP</th>
              <th class="size-th-2 bag-info">TEXTO</th>
              <th class="size-th-2 bag-info">REF FACTURA</th>
              <th class="size-th-2 bag-info">CUMP PRESUPUESTO</th>
            </tr>
          </thead>
          <tbody>
            ${detalle}
          </tbody>
          <thead>
            <tr>
            <th class="bag-info size-th-2">VALOR TOTAL: ${formatNum(total, '$')}</th>
            <th class="bag-info size-th-2">PARTIDAS: ${cont}</th>
            <th class="bag-info size-th-2" colspan="12">VALOR MORA: ${formatNum(vlrMora, '$')}</th>
            </tr>
          </thead>
        </table>`;

        $("#dvResultCartera").html(tabla);
      } else {
        const msgHtml = `
        <div class="alert alert-danger" role="alert">
          <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span class="sr-only">Error:</span>EL CLIENTE NO POSEE DOCUMENTOS PENDIENTES
        </div>`;
        $("#dvResultCartera").html(msgHtml);
      }
      UnloadImg();
    }
  }).fail(function (data) {
    console.log(data);
  })
}
// FUNCIÓN GUARDAR DIRECCIÓN
function GuardarDireccion() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "html",
    error: function (JQERROR) {
      alert(JQERROR);
    },
    data: {
      op: 'G_DIRECCIONES',
      codigo: $("#txtCodigo").val(),
      dpto: $("#slcDtpo").val(),
      mpio: $("#slcCiudad").val(),
      dir: $("#txtDir_alt").val()
    },
    success: function (data) {
      if (data == 1) {
        Swal.fire('Excelente!', 'Direccion almacenada correctamente!', 'success');
        $("#txtDir_alt").val('');
        Direcciones();
      } else {
        Swal.fire('Oops!', 'Error al intentar almacenar esta direccion!', 'error');
      }
    }
  });
}
// FUNCIÓN GUARDAR
function Guardar() {
  ActualizarTercero();
  GuardarPagare();
}
// FUNCIÓN ACTUALIZAR TERCERO
function ActualizarTercero() {
  let emailfe = $.trim($("#txtMailFE").val());
  let codigo = $.trim($("#txtCodigo").val());

  if (codigo != '') {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/CRM.php",
      async: true,
      dataType: "html",
      error: function (JQERROR) {
        alert(JQERROR);
      },
      data: {
        op: 'U_TERCERO',
        EMAIL_FE: emailfe,
        CODIGO_SAP: codigo
      },
      success: function (data) {
        if (data == 1) {
          Swal.fire('Excelente!', 'El tercero se actualizo correctamente!', 'success');
        } else {
          Swal.fire('Oops!', 'Error al intentar almacenar este acuerdo!', 'error');
        }
      }
    });
  } else {
    Swal.fire('Oops', 'Debe seleccionar un tercero', 'error');
  }
}
// FUNCIÓN GUARDAR PAGARÉ
function GuardarPagare() {
  if ($("#pagarePDF").val() != '') {
    uploadAjax('pagarePDF', 'pagare');
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/CRM.php",
      async: true,
      dataType: "html",
      error: function (JQERROR) {
        alert(JQERROR);
      },
      data: {
        op: 'G_PAGARES',
        c_sap: $("#txtCodigo").val(),
        adj: $("#npagarePDF").val()
      },
      success: function (data) {
        if (data == 1) {
          Swal.fire('Excelente!', 'El acuerdo se guardo correctamente!', 'success');
        } else {
          Swal.fire('Oops!', 'Error al intentar almacenar este acuerdo!', 'error');
        }
      }
    });
  } else {
    Swal.fire('Oops!!!', 'No se sube pdf... Selecciona uno primero', 'error');
  }
}
// FUNCIÓN GUARDAR ACUERDO
function GuardarAcuerdo() {
  if ($("#acuerdoPDF").val() != '') {
    uploadAjax('acuerdoPDF', 'acuerdo');
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/CRM.php",
      async: true,
      dataType: "html",
      error: function (JQERROR) {
        alert(JQERROR);
      },
      data: {
        op: 'G_ACUERDOS',
        c_sap: $("#txtCodigo").val(),
        acu: $("#numeroAcu").val(),
        f_ini: $("#fechaiAcu").val(),
        f_fin: $("#fechafAcu").val(),
        mont: $("#montoAcu").val(),
        inc: $("#incenAcu").val(),
        obs: $("#obsAcu").val(),
        adj: $("#nacuerdoPDF").val(),
        oficina: $("#txtOficina").val(),
        organizacion: $("#Organizacion").val()
      },
      success: function (data) {
        if (data == 1) {
          Swal.fire('Excelente!', 'El acuerdo se guardo correctamente!', 'success');
          Listar_acuerdos();
        } else {
          Swal.fire('Oops!', 'Error al intentar almacenar este acuerdo!', 'error');
        }
      }
    });
  } else {
    Swal.fire('Oops!!!', 'No se sube imagen... Selecciona una primero', 'error');
  }
}
// FUNCIÓN CARGAR AJAX - ARCHIVOS
function uploadAjax(caja, tipo) {
  let inputFileImage = document.getElementById(caja);
  let file = inputFileImage.files[0];
  let data = new FormData();

  data.append('archivo', file);
  data.append('op', 'subir');
  data.append('tipo', tipo);
  data.append('codigo', $("#txtCodigo").val());
  data.append('numero', $("#numeroAcu").val());
  const url = "../models/CRM.php";

  $.ajax({
    url,
    type: "POST",
    contentType: false,
    data,
    processData: false,
    cache: false,
    async: false,
    success: function (data) {
      $(`#n${caja}`).val(data);
    }
  });
}
// FUNCIÓN PARA REINICIAR CAMPOS Y HTML
function Limpiar() {
  $("#Organizacion").val(parent.parent.$("#org").val());
  $("#Tipopartidas").val('S');
  $("#txtCliente").val('');
  $("#txtCliente").focus();
  $("#txtCreado").val('');
  $("#txtFhNacimiento").val('');
  $("#txtNit").val('');
  $("#txtDigito").val('');
  $("#txtTipoNit").val('');
  $("#txtPerfil").val('');
  $("#txtCodigo").val('');
  $("#txtSexo").val('');
  $("#txtNombres").val('');
  $("#txtRazon").val('');
  $("#txtTel1").val('');
  $("#txtTel2").val('');
  $("#txtTel3").val('');
  $("#txtMail").val('');
  $("#txtCupo").val('');
  $("#txtCondicion").val('');
  $("#txtTelevendedor").val('');
  $("#txtVendedor").val('');
  $("#txtLista").val('');
  $("#txtSector").val('');
  $("#txtCanal").val('');
  $("#txtOficina").val('');
  $("#txtZonaVenta").val('');
  $("#txtDireccion").val('');
  $("#txtCiudad").val('');
  $("#txtDepartamento").val('');
  $("#txtLatitud").val('');
  $("#txtLongitud").val('');
  $("#chkAControlados").attr('checked', false);
  $("#chkInstitucionales").attr('checked', false);
  $("#chkAutoretenedor").attr('checked', false);
  $("#chkCree").attr('checked', false);
  $("#chkGranContrib").attr('checked', false);
  $("#chkICA").attr('checked', false);
  $("#chkIVA").attr('checked', false);
  $("#dvGestiones").html("");
  $("#dvCarteraxEdades").html("");
  Departamentos();
  $("#InpMaterial").val('');
  $("#btnDireccion, #btnCartera, #btnProductos, #btnComercial, #btnAcuerdos").attr("disabled", true);
  $("#Mapa").html('');
}
// FUNCIÓN PARA MONTAR EL LOADING
function LoadImg(texto = "Cargando...") {
  let n = 0;

  const html = `
  <img src="../resources/icons/preloader.gif" alt="Cargando..." />
  <figcaption style="font-size: 23px; margin-bottom: 5px; font-weight: bold; text-align: center;">${texto}</figcaption>
  <figcaption id="txtTimer" style="font-weight: bold;">0</figcaption>`;

  const loader = document.getElementById("loaderCRM");
  loader.innerHTML = html;
  loader.style.display = "flex";

  window.timerInterval = setInterval(() => {
    if (document.getElementById("txtTimer")) document.getElementById("txtTimer").textContent = ++n;
  }, 1000);
}
// FUNCIÓN PARA DESMONTAR EL LOADING
function UnloadImg() {
  clearInterval(window.timerInterval);
  const loader = document.getElementById("loaderCRM");
  loader.style.display = "none";
  loader.innerHTML = "";
}
// FUNCIÓN PARA CARGAR CLINETE
function CargarClienteLogin() {
  $.ajax({
    type: "POST",
    encoding: "UTF-8",
    url: "../models/CRM.php",
    async: true,
    dataType: "json",
    beforeSend: function () {
      $("#Aficiones").html("<h3>CARGANDO...</h3>");
    },
    data: {
      op: "CargarClienteLogin",
      id_cliente: $("#IdUser").val(),
      org: $("#org").val()
    },
    success: function (data) {
      $("#txtCreado").val(data[0].FECHA_CREACION);
      $("#txtFhNacimiento").val(data[0].FECHA_NACIMIENTO);
      $("#txtNit").val(data[0].NIT);
      $("#txtDigito").val(data[0].NIT_DIGITO);
      $("#txtTipoNit").val(data[0].NIT_TIPO);
      $("#txtPerfil").val(data[0].PERFIL_TRIBUTARIO);
      $("#txtCodigo").val(data[0].CODIGO_SAP);
      $("#txtSexo").val(data[0].SEXO);
      $("#txtNombres").val(data[0].NOMBRES);
      $("#txtRazon").val(data[0].RAZON);
      $("#txtTel1").val(data[0].TELEFONO1);
      $("#txtTel2").val(data[0].TELEFONO2);
      $("#txtTel3").val(data[0].TELEFONO3);
      $("#txtMail").val(data[0].EMAIL);
      $("#txtCupo").val(formatNum(data[0].CUPO_CREDITO, '$'));
      $("#txtCondicion").val(data[0].CONDICION_PAGO);
      $("#txtTelevendedor").val(data[0].TELEVENDEDOR);
      $("#txtVendedor").val(data[0].VENDEDOR);
      $("#txtLista").val(data[0].LISTA);
      $("#txtSector").val(data[0].SECTOR);
      $("#txtCanal").val(data[0].CANAL_DISTRIBUCION);
      $("#txtOficina").val(data[0].OFICINA_VENTAS);
      $("#txtZonaVenta").val(data[0].ZONA_VENTAS);
      $("#txtDireccion").val(data[0].DIRECCION);
      $("#txtCiudad").val(data[0].CIUDAD);
      $("#txtDepartamento").val(data[0].DEPARTAMENTO);

      (data[0].CONTROLADOS == 1) ? $("#chkAControlados").attr('checked', true) : $("#chkAControlados").attr('checked', false);
      (data[0].INSTITUCIONAL == 1) ? $("#chkInstitucionales").attr('checked', true) : $("#chkInstitucionales").attr('checked', false);
      (data[0].AUTORETENEDOR == 1) ? $("#chkAutoretenedor").attr('checked', true) : $("#chkAutoretenedor").attr('checked', false);
      (data[0].EXCENTO_CREE == 1) ? $("#chkCree").attr('checked', true) : $("#chkCree").attr('checked', false);
      (data[0].GRAN_CONTRIBUYENTE == 1) ? $("#chkGranContrib").attr('checked', true) : $("#chkGranContrib").attr('checked', false);
      (data[0].RESPONSABLE_ICA == 1) ? $("#chkICA").attr('checked', true) : $("#chkICA").attr('checked', false);
      (data[0].EXCENTO_IVA == 1) ? $("#chkIVA").attr('checked', true) : $("#chkIVA").attr('checked', false);
      
      let rol = $("#Rol").val().trim();
      if (rol == 17 || rol == 1) $("#btnDireccion").attr("disabled", false);

      $("#btnCartera, #btnProductos, #btnComercial, #btnAcuerdos").attr("disabled", false);
      $("#divCreaAcuerdo, #titleAC").hide();
      Direcciones();
      Listar_acuerdos();
    }
  }).fail(function (data) {
    console.log(data);
    $("#Aficiones").html(`<h3>ERROR... ${data}</h3>`);
  });
}
// FUNCIÓN ENVIAR EMAIL
function EnviarMail() {
  let sap  = $("#txtCodigo").val();
  let tipo = $("#slcCartas").val();
  let mail = $("#txtMail").val();
  let anio = $("#txt_anio_carta").val();
  let nit  = $("#txtNit").val();
  let url = '';

  switch (tipo) {
    case '0':
      url = "../resources/tcpdf/CartaAviso.php";
      break;
    case '1':
      url = "../resources/tcpdf/CartaCifin.php";
      break;
    case '2':
      url = "../resources/tcpdf/CartaPrejuridica.php";
    case '3':
      url = "../resources/tcpdf/CartaComprasClientes.php";
      break;
  }

  if (mail != '') {
    $.ajax({
      type: "GET",
      encoding: "UTF-8",
      url,
      global: false,
      error: function (JQERROR) {
        alert(JQERROR + " ");
      },
      data: ({
        cod: sap,
        tipo: 'P',
        anio: anio,
        nit: nit,
        mail: mail
      }),
      dataType: "html",
      async: true,
      success: function (data) { }
    }).always(function (data) {
      console.log(data);
    });
    $("#ModalCartas").modal('hide');
  } else {
    Swal.fire('Oops', 'No hay correo donde enviar el documento.', 'error');
  }
}
// FUNCIÓN SINCRONIZAR
function Sincronizar() {
  let codigo = $("#txtCodigo").val();

  if (codigo != '') {
    $.ajax({
      type: "POST",
      encoding: "UTF-8",
      url: "../models/CRM.php",
      async: true,
      dataType: "html",
      error: function (JQERROR) {
        alert(JQERROR);
      },
      data: {
        op: 'S_SINC_TERCEROS',
        codigo: codigo
      },
      success: function (data) {
         Swal.fire('Msj', data, 'warning');
      }
    });
  }else{
	  Swal.fire('Oops', 'No ha seleccionado un cliente.', 'error'); 
  }
}
// FUNCIÓN FORMATEAR FECHAS DB
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
// FUNCIÓN CARGAR ZONAS DE VENTAS
const getZonasVentas = async () => {
  const resp = await enviarPeticion({
    op: "G_ZONAS_VENTAS",
    link: "../models/SeguimientoVisitas.php"
  });

  let zonas = `<option value="0">000000 - TODAS</option>`;
  let filtro = $('#oficina').val();

  let zona = filtro.substring(0, 2);
  let zonasFiltradas = '';

  if (zona == 10 || zona == 20) zonasFiltradas = resp.filter(item => item.ZONA_VENTAS.substring(0, 1) === filtro.substring(0, 1));
  else zonasFiltradas = resp.filter(item => item.ZONA_VENTAS.substring(0, 2) === filtro.substring(0, 2));

  zonasFiltradas.forEach(item => {
    zonas += `<option value="${item.ZONA_VENTAS}">${item.ZONA_VENTAS} - ${item.ZONA_DESCRIPCION}</option>`;
  });

  $('#zona').html(zonas);
}
// FUNCIÓN CARGAR ZONAS POR OFICINA
const setearZonasPorOficina = async (filtro) => {
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

  $('#zona').html(zonas);
}
// DICCIONARIO DE MESES
let meses = {
  "1": "ENERO",
  "2": "FEBRERO",
  "3": "MARZO",
  "4": "ABRIL",
  "5": "MAYO",
  "6": "JUNIO",
  "7": "JULIO",
  "8": "AGOSTO",
  "9": "SEPTIEMBRE",
  "10": "OCTUBRE",
  "11": "NOVIEMBRE",
  "12": "DICIEMBRE"
}
// FUNCIÓN FILTRAR POR ZONA
const filtrar = (filtro) => {
  const filas = document.querySelectorAll('#tablaRotacion tbody tr');

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll('td');
    const coincide = Array.from(celdas).some(td => td.textContent.toLowerCase().includes(filtro));

    fila.style.display = coincide ? '' : 'none';
  });
}
// FUNCIÓN FILTRAR POR OFICINA
const filtrar2 = (filtro) => {
  const filas = document.querySelectorAll('#tablaRotacion tbody tr');

  filas.forEach(fila => {
    const primeraCelda = fila.querySelector('td');
    if (!primeraCelda) return;

    const valor = primeraCelda.textContent.trim().substring(0, 2);

    if (filtro === "20") {
      fila.style.display = '';
    } else {
      fila.style.display = (valor === filtro) ? '' : 'none';
    }
  });
};
// FUNCIÓN PARA OBTENER LA ROTACIÓN
const getRotacion = async () => {
  const filtroZonas = $("#ofic").val().substring(0, 2);
  const { data } = await enviarPeticion({
    op: "G_ROTACION",
    link: "../models/CRM.php",
    filtroZonas
  });

  if (data.length) {
    let elementos = ``;
    data.forEach(item => {
      elementos += `
      <tr>
        <td class="size-14 vertical">${item.ZONA}</td>
        <td class="size-13 vertical">${item.TEXTO}</td>
        <td class="size-14 vertical">${item.ANIO}</td>
        <td class="size-13 vertical">${meses[item.MES]}</td>
        <td class="size-14 vertical">${item.DIAS}</td>
        <td class="size-14 vertical text-primary">${formatNum(item.CARTERA, "$")}</td>
        <td class="size-14 vertical text-success">${formatNum(item.VENTAS, "$")}</td>
        <td class="size-14 vertical">${item.ROTACION}%</td>
      </tr>`;
    });

    $('#tablaRotacion tbody').html(elementos);
  } else {
    $('#tablaRotacion tbody').html(`<p class="text-center lead">No hay registros disponibles</p>`);
  }
}
// FUNCIÓN LIMPIAR CAMPOS
const limpiarCampos = () => {
  $('#btnGuardar').prop("disabled", true);
  $('#organizacionJ').val("");
  $('#recordatorioJ').val("");
  $('#ejecutivoJ').val("");
  $('#direccionJ').val("");
  $('#telefonoJ').val("");
  $('#clienteJ').val("");
  $('#oficinaJ').val("");
  $('#cedulaJ').val("");
  $('#correoJ').val("");
  $('#codigoJ').val("");
  $('#razonJ').val("");
  $('#zonaJ').val("");
  $('#cifinJ').val("");
}
// FUNCIÓN OBTENER DÍAS FUTUROS
function sumarDiasHabiles(fechaInicial, diasHabiles) {
  let fecha = new Date(fechaInicial);
  let contador = 0;

  while (contador < diasHabiles) {
    fecha.setDate(fecha.getDate() + 1);
    const diaSemana = fecha.getDay();

    if (diaSemana !== 0 && diaSemana !== 6) {
      contador++;
    }
  }

  return fecha.toISOString();
}
// FUNCIÓN PARA REGISTRAR LOS LOGS
const guardarLogs = async (idProceso, estado, usuario) => {
  try {
    const resp = await enviarPeticion({
      op: "I_LOG",
      link: "../models/CRM.php",
      idProceso,
      estado,
      usuario
    });
  } catch (error) {
    console.log(error);
  }
}
// FUNCIÓN PARA CAMBIO DE ESTADOS
const cambiarEstados = async (idProceso, estado, campo) => {
  try {
    const resp = await enviarPeticion({ 
      op: "U_ESTADOS", 
      link: "../models/CRM.php", 
      idProceso, 
      estado,
      campo 
    });
    
    return resp.ok;
  } catch (error) {
    console.log(error);
  }
}
// FUNCIÓN VER ARCHIVOS
const verArchivos = async (archivo) => {
  let url = `${urlArchivo}${archivo}.pdf`;
  let elementoIframe = `<iframe src="${url}?t=${new Date().getTime()}" style="width:100%; height:80vh; border:none;"></iframe>`;
  $("#verPDF").html(elementoIframe);
  $("#modalVerPDF").modal('show');
  $('#modalGestion').modal("hide");
}
// FUNCIÓN PARA OBTENER LOS DATOS DEL CLIENTE
const getDatosClientes = async (codigo) => {
  const { data } = await enviarPeticion({
    op: "G_DATOS_CLIENTE",
    link: "../models/CRM.php",
    codigo
  });

  if (data.length) {
    const item = data[0];

    $('#razonJ').val(item.RAZON_COMERCIAL);
    $('#cedulaJ').val(item.IDENTIFICACION);
    $('#ejecutivoJ').val(item.EJEC_CARGO);
    $('#direccionJ').val(item.DIRECCION);
    $('#telefonoJ').val(item.TELEFONO1);
    $('#organizacionJ').val(item.ORG);
    $('#oficinaJ').val(item.OFICINA);
    $('#clienteJ').val(item.NOMBRES);
    $('#correoJ').val(item.EMAIL);
    $('#zonaJ').val(item.ZONA_C);
  } else {
    Swal.fire("Oops!!!", "El código ingresado no existe o no es válido para el sistema", "warning");
    limpiarCampos();
    $('#btnGuardar').prop("disabled", true);
  }
}
// FUNCIÓN RENDERIZAR TEMPLATE LOGS
const renderizarLogs = (position, color, item, estados) => `
<div class="timeline-item" data-position="${position}">
  <div class="timeline-avatar" style="background-color: ${color};">${estados[item.ESTADO].icon}</div>
  <div class="timeline-content">
    <div class="estilos1">
        <p class="p1">${item.NOMBRE_USUARIO}</p>
        <P class="p2">
          Acción realizada: 
          <span style="font-size: 9px; font-weight: bold; color: ${color}; padding: 0 8px; padding: 0;">
            ${estados[item.ESTADO].texto}
          </span>
        </P>
        <P style="margin: 0; padding: 0; font-size: 10px; color: #9f9999;">
            Usuario que realizó la acción: <span style="font-size: 9px; color: #453e3e;">
            ${item.USUARIO}
          </span>
        </P>
        <P style="margin: 0; padding: 0; font-size: 9px; color: #9f9999;">
          Fecha de la acción: 
          <span style="font-size: 9px; color: #453e3e;">
            ${formatDate(item.FECHA_HORA)}
          </span>
        </P>             
      </div>
  </div>
</div>`;
// FUNCIÓN PARA VER GESTIÓN LOGS
const gestionarLogs = async (idProceso) => {
  let estados = {
    '1': {icon: '<i class="fa-solid fa-envelope"></i>', texto: 'CARTA CIFIN' },
    '2': {icon: '<i class="fa-solid fa-envelope-open-text"></i>', texto: 'CARTA PREJURIDICA' },
    '3': {icon: '<i class="fa-solid fa-handshake"></i>', texto: 'ACUERDO DE PAGO' },   
    '4': {icon: '<i class="fa-solid fa-money-bill"></i>', texto: 'SOPORTE DE PAGO' },   
    '5': {icon: '<i class="fa-solid fa-thumbs-up"></i>', texto: 'FINALIZADO' },   
    '6': {icon: '<i class="fa-solid fa-gavel"></i>', texto: 'COBRO JURÍDICO' },
    '7': {icon: '<i class="fa-solid fa-folder-open"></i>', texto: 'DOCUMENTACIÓN JURÍDICA' }
  }

  const resp = await enviarPeticion({ op: "G_LOGS", link: "../models/CRM.php", idProceso });
  $(".timeline").html(``);
  resp.forEach((item, index) => {
    const position = index % 2 === 0 ? "left" : "right";
    const color = index % 2 === 0 ? "#0A97B0" : "#FC8F54";
    let timelineItem = renderizarLogs(position, color, item, estados);
      $('.timeline').append(timelineItem);
    });

    $('#modalLogs').modal('show');
}
// FUNCIÓN RENDERIZAR TEMPLATE PROCESOS
/*<td class="size-12 vertical no-wrap fw-bold ${clase} text-center" style="background-color: ${colorFila}">${estado}</td>*/
const renderizarTds = (item, colorFila, clase, estado, title) => `
<tr title="${title}">
  <td class="size-13 vertical no-wrap" style="background-color: ${colorFila}">${item.ID}</td>
  <td class="size-13 vertical no-wrap" style="background-color: ${colorFila}">${item.ORGANIZACION}</td>
  <td class="size-13 vertical no-wrap" style="background-color: ${colorFila}">${item.OFICINA}</td>
  <td class="d-flex justify-content-center gap-2 align-items-center" style="background-color: ${colorFila}">
    <button 
      class="btn btn-outline-primary btn-sm shadow-sm gestion" 
      data-item='${JSON.stringify(item)}' 
      title="Ir a gestión de proceso"
    ><i class="fa-solid fa-bars fa-lg"></i>
    </button>
    <button 
      class="btn btn-outline-success btn-sm shadow-sm btn-timeline" 
      data-id="${item.ID}" 
      title="Ver gestión del proceso"
    ><i class="fa-solid fa-gear fa-lg"></i>
    </button>
  </td>
  <td class="size-13 vertical no-wrap" style="background-color: ${colorFila}">${item.CODIGO}</td>
  <td class="size-12 vertical no-wrap" style="background-color: ${colorFila}">${item.NOMBRE_CLIENTE}</td>
  <td class="size-12 vertical no-wrap" style="background-color: ${colorFila}">${item.RAZON_SOCIAL}</td>
  <td class="vertical nowrap text-center" style="background-color: ${colorFila}"><span style="font-size: 9px; background-color: ${clase}; color: white; padding: 3px 5px; border-radius: 4px; display: inline-block; width: 4rem; font-weight: bold;">${estado}</span></td>
  <td class="size-13 vertical no-wrap" style="background-color: ${colorFila}">${item.CEDULA}</td>
  <td class="size-13 vertical no-wrap" style="background-color: ${colorFila}">${item.TELEFONO}</td>
  <td class="size-12 vertical no-wrap" style="background-color: ${colorFila}">${item.DIRECCION}</td>
  <td class="size-12 vertical no-wrap" style="background-color: ${colorFila}">${item.CORREO.toUpperCase()}</td>
  <td class="size-12 vertical no-wrap" style="background-color: ${colorFila}">${item.ZONA_VENTAS}</td>
  <td class="size-12 vertical no-wrap" style="background-color: ${colorFila}">${item.EJECUTIVO_CARGO}</td>
  <td class="size-12 vertical no-wrap" style="background-color: ${colorFila}">${formatDate(item.FECHA_REGISTRO).toUpperCase()}</td>
</tr>`;
// DICCINARIO DE ESTADOS
const diccionarioEstados = {
  '1': { color: "primary", texto: 'Proceso en estado <strong>PREJURÍDICO</strong>, en instancia de <strong>CARTA CIFIN</strong> adjunta, proceso que podrá ser enviado a cobro jurídico directamente, al cumplirse los 20 días hábiles y no haber algún tipo de acuerdo' },
  '2': { color: "primary", texto: 'Proceso en estado <strong>PREJURÍDICO</strong>, en instancia de <strong>CARTA PREJURÍDICA</strong> adjunta, proceso que podrá ser enviado a cobro jurídico directamente, al cumplirse los 10 días hábiles y no haber algún tipo de acuerdo' },
  '3': { color: "warning", texto: 'Proceso en estado <strong>PREJURÍDICO</strong>, en instancia de <strong>ACUERDO DE PAGO</strong>, proceso con un tiempo determinado para siguientes tomas de decisiones' },
  '4': { color: "success", texto: 'Proceso en estado <strong>PREJURÍDICO</strong>, en instancia de <strong>SOPORTE DE PAGO</strong>, proceso que ha llegado a su finalización en los mejores términos' },
  '5': { color: "success", texto: 'Proceso en estado <strong>PREJURÍDICO</strong>, en instancia de <strong>FINALIZADO</strong>, proceso cerrado por finalización de manera satisfactoria' },
  '6': { color: "danger", texto: 'Proceso en estado <strong>JURÍDICO</strong>, en instancia de <strong>COBRO JURÍDICO</strong>, proceso que ha sido enviado a cobro jurídico por incumplimiento de algún tipo de acuerdo, al cuál se le adjuntará toda la documentación para el respectivo seguimiento' },
  '7': { color: "danger", texto: 'Proceso en estado <strong>JURÍDICO</strong>, en instancia de <strong>DOCUMENTACIÓN JURÍDICA</strong>, proceso que ya cuenta con la información y con los documentos para el respectivo seguimiento del área jurídica' },
}
// FUNCIÓN OBTENER DATOS DE PROCESOS
const getDatosProcesos = async () => {
  const organizacion = $('#org').val();
  try {
    const { data } = await enviarPeticion({ op: "G_DATOS_PROCESO", link: "../models/CRM.php", organizacion });
    if (data.length) {
      let elementos = ``;

      data.forEach(item => {
        const E = item.ESTADO;
        let estado = "";
        let clase = "";

        if (E === "1" || E === "2" || E === "3") {
          estado = "PREJURÍDICO";
          clase = "#ffc107";
        } else if (E === "6" || E === "7") {
          estado = "JURÍDICO";
          clase = "#dc3545";
        } else if (E === "5") {
          estado = "FINALIZADO";
          clase = "#198754 ";
        }

        const validarEstado = E;
        let colorFila = "";
        let title = "";

        if (validarEstado === "1") {
          const fechaDias20 = sumarDiasHabiles(item.FECHA_ISO, 20);
          const fechaDias20Time = new Date(fechaDias20).getTime();
          const fechaActualTime = new Date().getTime();

          title = `La carta CIFIN vence en: ${formatDate(fechaDias20)}`;
          
          const fechaVencida = fechaDias20Time < fechaActualTime;
          if (fechaVencida) colorFila = "#FF9B9B";
          console.log({fechaDias20, fechaDias20Time, fechaActualTime, fechaVencida, FR: item.FECHA_ISO});
          
        } else if (validarEstado === "2") {
          const fechaDias10 = sumarDiasHabiles(item.FECHA_PREJU, 10);
          const fechaDias10Time = new Date(fechaDias10).getTime();
          const fechaActualTime = new Date().getTime();
          
          title = `La carta prejurídica vence en: ${formatDate(fechaDias10)}`;
          
          const fechaVencida = fechaDias10Time < fechaActualTime;
          if (fechaVencida) colorFila = "#FF9B9B";
          console.log({fechaDias10, fechaDias10Time, fechaActualTime, fechaVencida, FJ: item.FECHA_PREJU});
          
        } else if (validarEstado === "3") {
          const fechaAcuerdo = new Date(item.FECHA_FIN_ACUER);
          const fechaAcuerdoTime = new Date(fechaAcuerdo).getTime();
          const fechaActualTime = new Date().getTime();
          
          title = `El acuerdo de pago vence en: ${formatDate(fechaAcuerdo.toISOString())}`;

          const fechaVencida = fechaAcuerdoTime < fechaActualTime;
          if (fechaVencida) {
            colorFila = "#FF9B9B";
          } else {
            colorFila = "#F8ED8C";
          }
          console.log({ fechaAcuerdo, fechaAcuerdoTime, fechaActualTime, fechaVencida, FFA: item.FECHA_FIN_ACUER });
        } else if (E === "5") {
          colorFila = "#B0DB9C";
        }
        
        elementos += renderizarTds(item, colorFila, clase, estado, title);
      });

      $('#tablaProcesos tbody').html(elementos);

      $('#tablaProcesos').on('click', '.gestion', async function () {
        const item = JSON.parse($(this).attr("data-item"));        
        const { data } = await enviarPeticion({op: "G_PROCESO", link: "../models/CRM.php", idProceso: item.ID});
        sessionStorage.DatosProceso = JSON.stringify(data[0]);
        
        $('#idProcesoHidden').val(item.ID);
        $('#codigoM').val(item.CODIGO);
        $('#nombreM').val(item.NOMBRE_CLIENTE);
        $('#razonM').val(item.RAZON_SOCIAL);

        const E = item.ESTADO;

        const alertHTML = `
        <div class="alert alert-${diccionarioEstados[E].color} mb-5" role="alert">
          ${diccionarioEstados[E].texto}
        </div>`;

        $('#alertEstados').html(alertHTML);

        (E === "1") ? $('#btnCargarCarta span').text("Cargar") : $('#btnCargarCarta span').text("Ver"); 
        (E === "1" ||  E === "2") ? $('#btnCargarAcuerdo span').text("Cargar") : $('#btnCargarAcuerdo span').text("Ver"); 
        (E === "1" ||  E === "2" ||  E === "3") ? $('#btnGuardarSoporte span').text("Cargar") : $('#btnGuardarSoporte span').text("Ver"); 
        (E === "7") ? $('#btnGuardarDatosJuri span').text("Ver") : $('#btnGuardarDatosJuri span').text("Cargar"); 

        $('#modalGestion').modal("show");
      });

      $('#tablaProcesos').on('click', '.btn-timeline', function () {
        const idProceso = $(this).attr("data-id");
        gestionarLogs(idProceso);
      });
    } else {
      $('#tablaProcesos tbody').html(`<td colspan="15" class="text-center lead">No hay registros disponibles</td>`);
    }
  } catch (error) {
    console.log(error);
  }
}
// FUNCIÓN GUARDAR DATOS
const guardarDatos = async () => {
  const recordatorio = document.querySelector("#recordatorioJ").files[0];
  const cifin = document.querySelector("#cifinJ").files[0];
  const codigo = $('#codigoJ').val();
  const nombres = $('#clienteJ').val();
  const organizacion = $('#organizacionJ').val();
  const organizacion2 = $('#org').val();

  if (!codigo && !nombres) {
    Swal.fire("Oops!!!", "No hay datos disponibles para guardar", "error");
    return;
  }

  if (!cifin) {
    Swal.fire("Oops!!!", "Debe cargar la carta CIFIN", "error");
    return;
  }

  if (organizacion2 !== organizacion) {
    Swal.fire("Oops!!!", "El cliente no pertenece a su organización... Revise el caso por favor", "error");
    return;
  }

  const result = await confirmAlert("Guardar Datos", "Los datos se guardarán... ¿Han sido verificados?");
  if (!result.isConfirmed) return;

  let arrayArchivos = (recordatorio) 
  ? [{file: recordatorio, campo: "RECORDATORIO_PAGO"}, {file: cifin, campo: "CARTA_CIFIN"}] 
  : [{file: cifin, campo: "CARTA_CIFIN"}];

  const ejecutivo = $('#ejecutivoJ').val();
  const direccion = $('#direccionJ').val();
  const telefono = $('#telefonoJ').val();
  const oficina = $('#oficinaJ').val();
  const usuario = $('#usuario').val();
  const cedula = $('#cedulaJ').val();
  const correo = $('#correoJ').val();
  const razon = $('#razonJ').val();
  const zona = $('#zonaJ').val();

  const resp = await enviarPeticion({
    op: "I_DATOS_PROCESO",
    link: "../models/CRM.php",
    organizacion,
    ejecutivo,
    direccion,
    telefono,
    oficina,
    usuario,
    nombres,
    codigo,
    cedula,
    correo,
    razon,
    zona
  });

  if (resp.ok) {
    Swal.fire("Excelente", "Se guardaron los datos correctamente", "success");
    getDatosProcesos();
    guardarLogs(resp.id, "1", usuario);
    SubirArchivosAdj(resp.id, arrayArchivos, codigo);
    limpiarCampos();
  }
}
// FUNCIÓN PARA CARGAR LA CARTA PREJURÍDICA
const gestionarCartaPrejuridica = () => {
  const item = JSON.parse(sessionStorage.DatosProceso);
  if (item.ESTADO === "1") {
    const carta = document.querySelector('#cartaM').files[0];

    if (!carta) {
      Swal.fire("Oops!!!", "Debe cargar la carta", "error");
      return;
    }

    SubirArchivosAdj(item.ID, [{file: carta, campo: "CARTA_PREJURIDICA"}], item.CODIGO);

    const OK = cambiarEstados(item.ID, "2", "FECHA_CARTA_JURI");

    if (OK) {
      Swal.fire("Cargar Carta", "La carta prejurídica ha sido cargada correctamente", "success");
      guardarLogs(item.ID, "2", usuario);
      getDatosProcesos();
      $('#cartaM').val("");
      $('#modalGestion').modal("hide");
    }

  } else {
    if (item.CARTA_PREJURIDICA) {
      verArchivos(item.CARTA_PREJURIDICA);
    } else {
      Swal.fire("Oops!!!", "No hay archivos disponibles", "info");
    }
  }
}
// FUNCIÓN PARA CARGAR EL ACUERDO PAGO
const gestionarAcuerdo = async () => {
  const item = JSON.parse(sessionStorage.DatosProceso);
  if (item.ESTADO === "2") {
    const acuerdo = document.querySelector('#acuerdoM').files[0];
    const fechaInicio = $('#fechaIniM').val();
    const fechaFin = $('#fechaFinM').val();

    if (!acuerdo || !fechaInicio || !fechaFin) {
      Swal.fire("Oops!!!", "Todos los campos relacionados con la gestión del acuerdo son obligatorios", "error");
      return;
    }
    
    const resp = await enviarPeticion({
      op: "U_ACUERDO",
      link: "../models/CRM.php",
      idProceso: item.ID,
      estado: "3",
      fechaInicio: `${fechaInicio} 00:00:00.000`,
      fechaFin: `${fechaFin} 00:00:00.000`
    });
    
    if (resp.ok) {
      Swal.fire("Cargar Acuerdo", "El acuerdo ha sido cargado correctamente", "success");
      SubirArchivosAdj(item.ID, [{file: acuerdo, campo: "ACUERDO_PAGO"}], item.CODIGO);
      guardarLogs(item.ID, "3", usuario);
      getDatosProcesos();
      $('#acuerdoM').val("");
      $('#fechaIniM').val("");
      $('#fechaFinM').val("");
      $('#modalGestion').modal("hide");
    }

  } else {
    if (item.ACUERDO_PAGO) {
      verArchivos(item.ACUERDO_PAGO);
    } else {
      Swal.fire("Oops!!!", "No hay archivos disponibles", "info");
    }
  }
}
// FUNCIÓN PARA SUBIR SOPORTE DE PAGO Y FINALIZACIÓN DEL PROCESO
const gestionarSoportePago = async () => {
  const item = JSON.parse(sessionStorage.DatosProceso);
  if (item.ESTADO === "3") {
    const soporte = document.querySelector('#soporteM').files[0];
    const fechaSoporte = $('#fechaSoporteM').val();

    if (!soporte || !fechaSoporte) {
      Swal.fire("Oops!!!", "El soporte de pago y la fecha del soporte son obligatorios", "error");
      return;
    }
    
    const resp = await enviarPeticion({
      op: "U_SOPORTE",
      link: "../models/CRM.php",
      idProceso: item.ID,
      estado: "5",
      fechaSoporte: `${fechaSoporte} 00:00:00.000`
    });
    
    if (resp.ok) {
      Swal.fire("Cargar soporte", "El soporte de pago ha sido cargado correctamente", "success");
      SubirArchivosAdj(item.ID, [{file: soporte, campo: "SOPORTE_PAGO"}], item.CODIGO);
      await guardarLogs(item.ID, "4", usuario);
      guardarLogs(item.ID, "5", usuario);
      getDatosProcesos();
      $('#soporteM').val("");
      $('#fechaSoporteM').val("");
      $('#modalGestion').modal("hide");
    }

  } else {
    if (item.SOPORTE_PAGO) {
      verArchivos(item.SOPORTE_PAGO);
    } else {
      Swal.fire("Oops!!!", "No hay archivos disponibles", "info");
    }
  }
}
// FUNCIÓN PARA SUBIR SOPORTE DE PAGO Y FINALIZACIÓN DEL PROCESO
const guardarDatosJuridica = async () => {
  const item = JSON.parse(sessionStorage.DatosProceso);
  if (item.ESTADO === "6") {
    const documentosJuri = document.querySelector('#documentosM').files[0];
    const fechaJuri = $('#fechaJuridicaM').val();
    const valor = $('#montoM').val();

    if (!documentosJuri || !fechaJuri || !valor) {
      Swal.fire("Oops!!!", "Todos los campos relacionados con la gestión del proceso jurídico son obligatorios", "error");
      return;
    }   
    
    const resp = await enviarPeticion({
      op: "U_DOCUMENTOS_JURIDICO",
      link: "../models/CRM.php",
      idProceso: item.ID,
      fechaJuri: `${fechaJuri} 00:00:00.000`,
      valor: valor.replace(/\./g, ""),
      estado: "7"
    });
    
    if (resp.ok) {
      Swal.fire("Guardar información", "La información relacionada al envío de proceso a jurídica ha sido guardada correctamente", "success");
      SubirArchivosAdj(item.ID, [{file: documentosJuri, campo: "DOCUMENTOS_JURIDICOS"}], item.CODIGO);
      guardarLogs(item.ID, "7", usuario);
      getDatosProcesos();
      $('#documentosM').val("");
      $('#fechaJuridicaM').val("");
      $('#montoM').val("");
      $('#modalGestion').modal("hide");
    }

  } else {
    if (item.DOCUMENTOS_JURIDICOS) {
      verArchivos(item.DOCUMENTOS_JURIDICOS);
    } else {
      Swal.fire("Oops!!!", "No hay archivos disponibles", "info");
    }
  }
}
// FUNCIÓN PARA ENVIAR PROCESO A JURÍDICA
const enviarProcesoJuridico = async () => {
  const item = JSON.parse(sessionStorage.DatosProceso);
  if (item.ESTADO === "1" || item.ESTADO === "2") {
    const result = await confirmAlert("Enviar proceso a jurídica", "El proceso pasará de estado prejurídico a jurídico... ¿Desea continuar?");
    if (!result.isConfirmed) return;
    
    const resp = await enviarPeticion({
      op: "U_PROCESO_JURIDICO",
      link: "../models/CRM.php",
      idProceso: item.ID,
      estado: "6"
    });
    
    if (resp.ok) {
      Swal.fire("Envío de proceso a jurídico", "El proceso ha sido enviado a cobro jurídico correctamente", "success");
      guardarLogs(item.ID, "6", usuario);
      getDatosProcesos();
      $('#modalGestion').modal("hide");
    }

  } else {
    Swal.fire("Oops!!!", "En el estado que se encuentra el proceso no se puede enviar a cobro jurídico", "info");
  }
}

// EJECUCIÓN DE FUNCIONALIDADES AL CARGAR EL DOM
$(function () {
  $("#fechaiAcu, #fechafAcu").datepicker({
    changeMonth: true,
    changeYear: true,
    monthNames: arrayMeses,
    monthNamesShort: arrayMesesShort,
    dateFormat: 'yy-mm-dd',
    width: 100,
    heigth: 100
  });

  $("#fechaiAcu, #fechafAcu").val(FechaActualAmd());

  let DepId = $("#DepId").val();
  let RolId = $("#Rol").val();

  if (RolId == 17 || RolId == 1 || RolId == 72 || RolId == 26) $("#dvCartasNotifica").show();
  else $("#dvCartasNotifica").hide();

  if (DepId == 10) {
    CargarClienteLogin()
    $("#div-busqueda").hide();
    $("#dvDirecciones").hide();
  }

  // PARTIDAS COMPENSADAS Y SIN COMPENSAR
  // Administrador - Gerente de cartera - Auxiliar de cartera - Coordinador de cartera 
  if (RolId == 1 || RolId == 17 || RolId == 48 || RolId == 72) {
    const compenHTML = `
    <option value="S" selected>SIN COMPENSAR</option>
    <option value="C">COMPENSADAS</option>`;
    $("#Tipopartidas").html(compenHTML);
  } else {
    $("#Tipopartidas").html(`<option value="S" selected>SIN COMPENSAR</option>`);
  }

  $("#tabs").tabs({
    activate: function () {
      let activeTab = $('#tabs').tabs('option', 'active');
      switch (activeTab) {
        case 2:
          Cartera();
          break;
      }
    }
  });

  Limpiar();
  
  $("#slcDtpo").on('change', function () {
    Ciudades();
  });

  $("#btnCartera").on('click', function () {
    Cartera();
  });

  $("#Tipopartidas,#anio").change(function () {
    Cartera();
  });

  carga_anios('anio');

  $('#InpMaterial').autocomplete({
    source: function (request, response) {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/CRM.php",
        dataType: "json",
        data: {
          term: request.term,
          op: 'B_MATERIALES',
          cliente: $("#txtCodigo").val()
        },
        success: function (data) {
          response(data);
        }
      });
    },
    minLength: 3,
    select: function (event, ui) {
      ConsultarFacturas(ui.item.CODIGO_MATERIAL);
    }
  });
 
  $('#txtCliente').autocomplete({
    source: function (request, response) {
      $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/CRM.php",
        dataType: "json",
        data: {
          term: request.term,
          op: 'B_CLIENTES',
          org: $("#Organizacion").val()
        },
        success: function (data) {
          response(data);
        }
      });
    },
    minLength: 3,
    select: function (event, ui) {
      let direccion = ui.item.LATITUD + ',' + ui.item.LONGITUD;
      const src = "https://www.google.com/maps/embed/v1/place?q=";
      let mapa = `<iframe width="100%" height="400" frameborder="0" style="border:0"src="${src}${direccion}&key=${GoogleKeyApis}&zoom=19" allowfullscreen></iframe>`;
      $("#txtLatitud").val(ui.item.LATITUD);
      $("#txtLongitud").val(ui.item.LONGITUD);
      $("#Mapa").html(mapa);
      $("#txtCreado").val(ui.item.FECHA_CREACION);
      $("#txtFhNacimiento").val(ui.item.FECHA_NACIMIENTO);
      $("#txtNit").val(ui.item.NIT);
      $("#txtDigito").val(ui.item.NIT_DIGITO);
      $("#txtTipoNit").val(ui.item.NIT_TIPO);
      $("#txtPerfil").val(ui.item.PERFIL_TRIBUTARIO);
      $("#txtCodigo").val(ui.item.CODIGO_SAP);
      $("#txtSexo").val(ui.item.SEXO);
      $("#txtNombres").val(ui.item.NOMBRES);
      $("#txtRazon").val(ui.item.RAZON);
      $("#txtTel1").val(ui.item.TELEFONO1);
      $("#txtTel2").val(ui.item.TELEFONO2);
      $("#txtTel3").val(ui.item.TELEFONO3);
      $("#txtMail").val(ui.item.EMAIL);
      $("#txtMailFE").val(ui.item.EMAIL_FE);
      $("#txtCupo").val(formatNum(ui.item.CUPO_CREDITO, '$'));
      $("#txtCondicion").val(ui.item.CONDICION_PAGO);
      $("#txtTelevendedor").val(ui.item.TELEVENDEDOR);
      $("#txtVendedor").val(ui.item.VENDEDOR);
      $("#txtLista").val(ui.item.LISTA);
      $("#txtSector").val(ui.item.SECTOR);
      $("#txtCanal").val(ui.item.CANAL_DISTRIBUCION);
      $("#txtOficina").val(ui.item.OFICINA_VENTAS);
      $("#txtZonaVenta").val(ui.item.ZONA_VENTAS);
      $("#txtDireccion").val(ui.item.DIRECCION);
      $("#txtCiudad").val(ui.item.CIUDAD);
      $("#txtDepartamento").val(ui.item.DEPARTAMENTO);
      $("#txt_tipo_carta").val(ui.item.NOTIFICACION_CARTERA);
      $("#txt_fecha_carta").val(ui.item.NOTIFICACION_FECHA);

      (ui.item.CONTROLADOS == 1) ? $("#chkAControlados").attr('checked', true) : $("#chkAControlados").attr('checked', false);
      (ui.item.INSTITUCIONAL == 1) ? $("#chkInstitucionales").attr('checked', true) : $("#chkInstitucionales").attr('checked', false);
      (ui.item.AUTORETENEDOR == 1) ? $("#chkAutoretenedor").attr('checked', true) : $("#chkAutoretenedor").attr('checked', false);
      (ui.item.EXCENTO_CREE == 1) ? $("#chkCree").attr('checked', true) : $("#chkCree").attr('checked', false);
      (ui.item.GRAN_CONTRIBUYENTE == 1) ? $("#chkGranContrib").attr('checked', true) : $("#chkGranContrib").attr('checked', false);
      (ui.item.RESPONSABLE_ICA == 1) ? $("#chkICA").attr('checked', true) : $("#chkICA").attr('checked', false);
      (ui.item.EXCENTO_IVA == 1) ? $("#chkIVA").attr('checked', true) : $("#chkIVA").attr('checked', false);

      let rol = $.trim($("#Rol").val());
      if (rol == 17 || rol == 1 || rol == 72) $("#btnDireccion").attr("disabled", false);
      
      $("#btnCartera, #btnProductos, #btnComercial, #btnAcuerdos").attr("disabled", false);
      Direcciones();
      Listar_acuerdos();
      Gestiones(ui.item.CODIGO_SAP);
      CarteraXEdades(ui.item.CODIGO_SAP);
    }
  });

  CardarAf();

  const rolId = $("#Rol").val();

  if (rolId == '1' || rolId == '3' || rolId == '44') $("#divCreaAcuerdo, #titleAC").show();
  else $("#divCreaAcuerdo, #titleAC").hide();

  if (RolId == '1' || RolId == '17' || RolId == '72') $("#docTercero, #titleDT").show();
  else $("#docTercero, #titleDT").hide();

  $("#btnBPagare").click(function () {
    $("#ModalPagare").modal("show");
    ListarPagare();
  });

  $("#btnEnviarCarta").click(function () {
    let sap = $("#txtCodigo").val();
    let tipo = $("#slcCartas").val();

    if (tipo != 3) {
      switch (tipo) {
        case '0':
          $("#BodyModalCartas").html(`<embed src="../resources/tcpdf/CartaAviso.php?cod=${sap}&tipo=I" frameborder="0" width="100%" height="400px">`);
          break;
        case '1':
          $("#BodyModalCartas").html(`<embed src="../resources/tcpdf/CartaCifin.php?cod=${sap}&tipo=I" frameborder="0" width="100%" height="400px">`);
          break;
        case '2':
          $("#BodyModalCartas").html(`<embed src="../resources/tcpdf/CartaPrejuridica.php?cod=${sap}&tipo=I" frameborder="0" width="100%" height="400px">`);
          break;
      }
      $("#ModalCartas").modal('show');
    } else {
      (async () => {
        const { value: anio } = await Swal.fire({
          title: 'Seleccione el año que desea consultar.',
          input: 'select',
          inputOptions: Anios(),
          inputPlaceholder: 'Seleccione un año',
          showCancelButton: true,
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value != '') {
                resolve()
              } else {
                resolve('Debe seleccionar una opción')
              }
            })
          }
        })

        if (anio) {
          let nit = $("#txtNit").val();
          $("#txt_anio_carta").val(anio);
          if (nit != '') {
            $("#BodyModalCartas").html(`<embed src="../resources/tcpdf/CartaComprasClientes.php?nit=${nit}&anio=${anio}&tipo=I" frameborder="0" width="100%" height="400px">`);
            $("#ModalCartas").modal('show');
          } else {
            Swal.fire('Oops', 'Debe seleccionar un cliente', 'error');
          }
        }
      })()
    }
  });
	
  actualizarElementoSegunPermisos("0405", "#0405");
  actualizarElementoSegunPermisos("0102", "#0102");

  $("#0405, #0102").click(function () {
    let id = $(this).attr('id');
    let url = '';
    let title = '';

    switch (id) {
      case '0405':
        url = 'RecibosCaja.php';
        title = '0405 - RECIBOS DE PAGO';
        break;

      case '0102':
        url = 'ProgramacionCliente.php';
        title = '0102 - PROGRAMACION DE CLIENTE';
        break;
    }

    $("#ModalPedidos").modal("show");
    $("#span-titulo-modulo").text(title);
    $(".iframe").attr('src', url).show();
  });

  $("#txtCliente").on("input", function () {
    this.value = this.value.toUpperCase();
  });

  $('#oficina, #zona').select2({
    theme: 'bootstrap-5'
  });

  const fechaActual = new Date().toISOString().split("T")[0];
  const fechaFinal = document.querySelector('#fechaFinM');
  fechaFinal.min = fechaActual;

  getZonasVentas();

  const oficinas = OficinasVentas('S');
  $("#oficina").html(oficinas);

  getRotacion();

  getDatosProcesos();

  $('#oficina').change(async function () {
    const filtro = this.value;
    setearZonasPorOficina(filtro);    
  });

  $('#zona').change(function () {
    const filtro = this.value;
    filtrar(filtro);
  });

  $('#oficina').change(function () {
    const oficina = this.value;
    const oficinaSubs = oficina.substring(0, 2);
    filtrar2(oficinaSubs);
  });

  $('#btnGuardar').click(function () {
    guardarDatos();
  });

  $('#btnVerRecordatorio').click(function () {
    const item = JSON.parse(sessionStorage.DatosProceso);
    if (item.RECORDATORIO_PAGO) {
      verArchivos(item.RECORDATORIO_PAGO);
    } else {
      Swal.fire("Oops!!!", "El documento no ha sido cargado", "warning");
    }
  });

  $('#btnVerCifin').click(function () {
    const item = JSON.parse(sessionStorage.DatosProceso);
    if (item.CARTA_CIFIN) {
      verArchivos(item.CARTA_CIFIN);
    } else {
      Swal.fire("Oops!!!", "El documento no ha sido cargado", "warning");
    }
  });

  $("#modalVerPDF").on("hidden.bs.modal", () => {
    $('#modalGestion').modal("show");
  });

  $('#btnGuardar').prop("disabled", true);

  $('#codigoJ').on('blur', function () {
    const codigo = this.value;
    if (!codigo) {
      limpiarCampos();
      $('#btnGuardar').prop("disabled", true);
      Swal.fire("Oops!!!", "Debe ingresar un código para obtener los datos", "error");
      return;
    }
    getDatosClientes(codigo);
    $('#btnGuardar').prop("disabled", false);
  });

  $('#btnCargarCarta').click(function () {
    gestionarCartaPrejuridica();
  });

  $('#btnCargarAcuerdo').click(function () {
    gestionarAcuerdo();
  });

  $('#btnGuardarSoporte').click(function () {
    gestionarSoportePago();
  });

  $('#btnGuardarDatosJuri').click(function () {
    guardarDatosJuridica();
  });

  $('#btnEnviarJuridico').click(function () {
    enviarProcesoJuridico();
  });

  $('#estadoM').change(function () {
    const estado = $(this).val();
    if (estado === "1") $('#labelEstado').text("Soporte de la Diligencia Pendiente");
    else if (estado === "2") $('#labelEstado').text("Soporte Acuerdo de Pago");
    else if (estado === "3") $('#labelEstado').text("Documentos de Terminación del Caso");
    else if (estado === "4") $('#labelEstado').text("Soporte de Estado de Insolvencia");
    else $('#labelEstado').text("Soporte de Estado de Insolvencia");
  });

  $('#montoM').on('input', function () {
    let value = $(this).val().replace(/[^0-9]/g, '');
    if (value) value = parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 0 });
    $(this).val(value);
  });
});