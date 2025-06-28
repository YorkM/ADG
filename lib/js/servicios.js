var fechaActual = '';
/*SERVICIOS*/
//url api evaluaciones de desempeño
const url_api = 'https://app.pwmultiroma.com/Apiadg/index.php/';
///const url_api='https://192.168.2.52/Apiadg/index.php/';
//const url_api='https://www.dfroma.com/Apiadg/index.php/';
//url solicitudes de ingresos
function enviarPeticion(opciones) {
  return new Promise((resolve, reject) => {
    if (!opciones.link) {
      return reject('No se envió el link');
    }

    const metodo = opciones.metodo || 'POST';
    // const timeoutMs = opciones.timeout || 15000;

    $.ajax({
      url: opciones.link,
      type: metodo,
      data: opciones,
      dataType: "json",
      async: true,
      // timeout: timeoutMs,
      success: function (respuesta) {
        resolve(respuesta);
      },
      error: function (xhr, status, error) {
        console.error("Error en enviarPeticion():", status, error);
        reject({
          status: status,
          message: xhr.responseText || 'Error en la petición',
          xhr
        });
      }
    });
  });
}


async function getListMonth() {

  return new Promise((resolve, reject) => {

    $.ajax({
      url: "../models/Servicios.php",
      /* url o donde esta el php que va a ejecutar la consulta sql */
      type: "POST",
      /* tipo de dato enviado , como se envia */
      data: ({
        op: "get_month"
      }),
      dataType: "json",
      /*tipo de dato de respuesta*/
      async: true,
      success: function (data) /*respuesta */ {
        resolve(data);
      }
    }).fail(function (error) {
      reject(error);
    });

  })

}

async function getListYear() {

  return new Promise((resolve, reject) => {

    $.ajax({
      url: "../models/Servicios.php",
      /* url o donde esta el php que va a ejecutar la consulta sql */
      type: "POST",
      /* tipo de dato enviado , como se envia */
      data: ({
        op: "get_year"
      }),
      dataType: "json",
      /*tipo de dato de respuesta*/
      async: true,
      success: function (data) /*respuesta */ {
        resolve(data);
      }
    }).fail(function (error) {
      reject(error);
      console.error({
        error
      });
    });

  })
}


/*CARGA LOS TIPOS DE EQUIPOS*/

function t_sys_tipos_equipos() {


  var respuesta = null;

  $.ajax({
    url: "../../models/Servicios.php",
    /* url o donde esta el php que va a ejecutar la consulta sql */
    type: "POST",
    /* tipo de dato enviado , como se envia */
    data: ({
      op: "t_sys_tipos_equipos"
    }),
    dataType: "json",
    /*tipo de dato de respuesta*/
    async: false,
    success: function (data) /*respuesta */ {

      respuesta = {
        error: '',
        data: data
      }

    }
  }).fail(function (error) {
    respuesta = {
      error: error.responseText,
      data: null
    }
  });

  return respuesta;


}


/*CARGA LAS MARCAS DE LOS EQUIPOS*/

function t_sys_marcas_equipos() {

  var respuesta = null;

  $.ajax({
    url: "../../models/Servicios.php",
    /* url o donde esta el php que va a ejecutar la consulta sql */
    type: "POST",
    /* tipo de dato enviado , como se envia */
    data: ({
      op: "t_sys_marcas_equipos"
    }),
    dataType: "json",
    /*tipo de dato de respuesta*/
    async: false,
    success: function (data) /*respuesta */ {

      respuesta = {
        error: '',
        data: data
      }

    }
  }).fail(function (error) {
    respuesta = {
      error: error.responseText,
      data: null
    }
  });

  return respuesta;
}


/*CARGA LOS SISTEMAS OPERATIVOS*/

function t_sys_so_equipos() {


  var respuesta = null;

  $.ajax({
    url: "../../models/Servicios.php",
    /* url o donde esta el php que va a ejecutar la consulta sql */
    type: "POST",
    /* tipo de dato enviado , como se envia */
    data: ({
      op: "t_sys_so_equipos"
    }),
    dataType: "json",
    /*tipo de dato de respuesta*/
    async: false,
    success: function (data) /*respuesta */ {

      respuesta = {
        error: '',
        data: data
      }

    }
  }).fail(function (error) {
    respuesta = {
      error: error.responseText,
      data: null
    }
  });

  return respuesta;


}

/* departamentos*/

function t_sys_dpto() {


  var respuesta = null;

  $.ajax({
    url: "../../models/Servicios.php",
    /* url o donde esta el php que va a ejecutar la consulta sql */
    type: "POST",
    /* tipo de dato enviado , como se envia */
    data: ({
      op: "t_sys_dpto"
    }),
    dataType: "json",
    /*tipo de dato de respuesta*/
    async: false,
    success: function (data) /*respuesta */ {

      respuesta = {
        error: '',
        data: data
      }

    }
  }).fail(function (error) {
    respuesta = {
      error: error.responseText,
      data: null
    }
  });

  return respuesta;


}


//INSERTA MODIFICA Y ELIMINA UN PEDIDO
function SrvUpdateSap(op, numero, numeroSAP, codigo_material) {


  return new Promise((resolve, reject) => {

    $.ajax({
      type: "POST",
      url: "../models/WS-PW_new.php",
      global: false,
      beforeSend: function () {
        // LoadImg('GUARDANDO...');  
      },
      data: ({
        op: op,
        numero: numero,
        numeroSAP: numeroSAP,
        codigo_material: codigo_material
      }),
      dataType: "json",
      async: true,
      success: function (data) {

        var sw_errores = false;

        data.forEach(resp => {

          if (resp.Tipo == 'E') {
            sw_errores = true;
          }

        });

        let respuesta = {
          error: sw_errores,
          data: data
        }


        if (!sw_errores) {
          resolve(respuesta);
        } else {
          reject(respuesta);
        }
      }
    }).fail(function (data) {
      console.error(data);
      respuesta = {
        error: true,
        data: data
      }
      reject(respuesta);
    });


  });


}

function srcDeleteOrderSap(numero_sap, numero, insertMotivo) {

  if (numero_sap == '' || numero_sap == '0') {
    AlertToast('error', 'No se envio numero de pedido de SAP', 'top-right');
    return;
  }

  if (numero == '' || numero == '0') {
    AlertToast('error', 'No se envio numero de pedido de ADG', 'top-right');
    return;
  }


  return new Promise((resolve, reject) => {

    $.ajax({
      type: "POST",
      url: "../models/WS-PW_new.php",
      global: false,
      data: ({
        op: 'ELIMINAR',
        numero: numero_sap
      }),
      dataType: "json",
      async: false,
      success: function (data) {

        var sw_errores = false;

        data.forEach(resp => {

          if (resp.Tipo == 'E') {
            sw_errores = true;
          }

        });

        let respuesta = {
          error: sw_errores,
          data: data
        }


        if (!sw_errores) {
          resolve(respuesta);
        } else {
          reject(respuesta);
        }
      }
    }).fail(function (data) {

      respuesta = {
        error: true,
        data: data
      }
      reject(respuesta);

    });

  });

}


function srcDeleteOrderADG(numero, numero_sap, insertMotivo, motivo_anulacion) {

  return new Promise((resolve, reject) => {

    $.ajax({
      type: "POST",
      url: "../models/PW-SAP_new.php",
      global: false,
      data: ({
        op: 'D_PEDIDO',
        numero: numero,
        numero_sap: numero_sap,
        insertMotivo: insertMotivo,
        motivo_anulacion: motivo_anulacion
      }),
      dataType: "json",
      async: true,
      success: function (data) {

        if (!data.error) {
          resolve(data);
        } else {
          reject(data);
        }

      }
    }).fail(function (data) {
      reject(data);
    });
  });

}


function SrvInsertDetalle(NumPed, codigo, cant, vlr_unitario, descuento, totalfila, iva, refresh, input, lista, oficina, canal) {

  return new Promise((resolve, reject) => {

    $.ajax({
      url: "../models/PW-SAP_new.php",
      global: false,
      type: "POST",
      data: ({
        op: "I_PEDIDO_DETALLE",
        NumPed: NumPed,
        codigo: codigo,
        cant: cant,
        vlr_unitario: vlr_unitario,
        vlr_total: totalfila,
        descuento: descuento,
        iva: iva,
        lista: lista,
        oficina: oficina,
        canal: canal
      }),

      dataType: "json",
      async: true,
      success: function (data) { //alert(data); return false;

        if (data[0].id > 0) {
          resolve(data);
        } else {
          reject(data);
        }

      }
    }).fail(function (data) {
      reject(data);
      console.error(data);
    })


  });
}

function srvUpdateDetalle(idfila, cant, totalfila, codigo, refresh, oficina, lista, canal, numero) {

  return new Promise((resolve, reject) => {

    $.ajax({
      url: "../models/PW-SAP_new.php",
      global: false,
      type: "POST",
      data: ({
        op: "U_PEDIDO_DETALLE",
        idfila: idfila,
        cant: cant,
        vlr_total: totalfila,
        oficina: oficina,
        codigo: codigo,
        numero: numero,
        lista: lista,
        canal: canal
      }),
      dataType: "json",
      async: true,
      success: function (data) {

        if (!data[0].error) {
          resolve(data[0]);
        } else {
          reject(data[0]);
        }
      }
    }).fail(function (data) {
      reject('no se puedo actuializar el registro');
    });

  });


}


function srvDeleteDetalle(idfila, codigo, numero, oficina, lista, canal) {

  return new Promise((resolve, reject) => {

    $.ajax({
      url: "../models/PW-SAP_new.php",
      global: false,
      type: "POST",
      data: ({
        op: "D_PEDIDO_DETALLE",
        idfila: idfila,
        numero: numero,
        oficina: oficina,
        codigo: $.trim(codigo),
        lista: lista,
        canal: canal
      }),
      dataType: "json",
      async: true,
      success: function (data) {

        if (!data[0].error) {
          resolve(data[0]);
        } else {
          reject(data[0]);
        }
      }
    }).fail(function (data) {
      reject(data[0]);
      console.error(data);
    });
  });

}


/*SERVICIO DE NOTIFICACIONES */
function NotificationPush(PlayAudio, titulo, mensaje, icono, data) {


  if (PlayAudio) {
    $(".miAudio").remove();
  }


  if (icono != '') {

    extra = {
      icon: "../resources/icons/" + icono + ".png",
      body: mensaje,
      //image:'../resources/images/img_notification.png'
    }

  } else {

    extra = {
      body: mensaje
    }
  }


  if (("Notification" in window)) {

    if (Notification.permission !== "granted") {

      Notification.requestPermission();

    }
  }

  noti = new Notification(titulo, extra);

  if (PlayAudio) {
    var audio = '<audio class="miAudio"   >'
      + ' <source src="../resources/sound/tono-mensaje-9-.mp3" onPlay="true" ></source>'
      + '</audio>';
    $("body").append(audio);
    $(".miAudio").attr("autoplay", true);

  }

  /*
   noti.onclick = function() {
  	window.location='https://www.pwmultiroma.com/C4l1d4d/views/Contenido.php?mod=01&numero_ped='+data.numero	 
   }*/


}


function srvNotificacionPush(parametros) {

  return new Promise((resolve, reject) => {


    $.ajax({
      url: "../models/NotificationPush.php",
      type: "POST",
      data: (parametros),
      dataType: "json",
      async: true,
      success: function (data) {
        if (data.length > 0) {

          data = data[0];

          if (!data.error) {

            resolve(data);

          } else {
            reject(data);
          }
        } else {

          resolve([{
            error: false,
            mensaje: 'no hay datos que mostrar ',
            data: []
          }]);
        }


      }
    }).fail(function (data) {
      console.error(data)
      reject([{
        error: true,
        mensaje: data,
        data: []
      }]);
      console.error("error del serv", data);
      console.error(data);
    });

  });

}


//OBTIENE LA FECHA ACTUAL CON HORA 
function SrcFechaHoraActual() {


  return new Promise((resolve, reject) => {

    $.ajax({
      url: "../models/Servicios.php",
      type: "POST",
      data: ({
        op: 'SrcFechaHoraActual'
      }),
      dataType: "json",
      async: true,
      success: function (data) {

        resolve(data);

      }
    }).fail(function (data) {
      reject(data);
    });
  });

}


function eventoNoti() {

  srvNotificacionPush({
    'op': 'n_pedidos_zonas',
    'fecha': fechaActual
  }).then(resp => {

    lista = resp.data;

    if (lista.length > 0) {

      datos = lista[0];

      mensaje = datos.cliente + '\n';
      mensaje += datos.nota + '\n';
      mensaje += datos.fecha_pedido;

      NotificationPush(true, 'NUEVO PEDIDO #' + datos.numero, mensaje, 'megafono', datos);

      srvNotificacionPush({
        'op': 'marcar_visto',
        'numero': datos.numero,
        'fecha': fechaActual
      }).then(su => {}).catch(error => {
        console.error("error al insertar ", error);
      });
    }

  }).catch(error => {
    console.error(error);
    console.error(" error de sistemas ", error);
  });

}


function AlertToast(icon, msj, position, isArray) {

  text_msj = '';

  if (isArray) {

    msj.forEach(resp => {

      text_msj += '<p>' + resp.Msj + '</p>';

    });

  } else {
    text_msj = msj.mensaje;
  }

  Swal.fire({
    toast: true,
    icon: icon,
    title: text_msj,
    animation: false,
    position: position,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
}

async function CallSrvSap(op, numero, numeroSAP, codigo_material) {
  const respSap = await SrvUpdateSap(op, numero, numeroSAP, codigo_material)
  return respSap;

}

async function CallSrvInsertDetalle(NumPed, codigo, cant, vlr_unitario, descuento, totalfila, iva, refresh, input, lista, oficina, canal) {
  const respDet = await SrvInsertDetalle(NumPed, codigo, cant, vlr_unitario, descuento, totalfila, iva, refresh, input, lista, oficina, canal);
  return respDet;

}

async function CallsrvUpdateDetalle(idfila, cant, totalfila, codigo, refresh, oficina, lista, canal, numero) {
  const respDet = await srvUpdateDetalle(idfila, cant, totalfila, codigo, refresh, oficina, lista, canal, numero);
  return respDet;

}

async function CallsrvEliminarDetalle(idfila, codigo, numero, oficina, lista, canal) {
  const respDet = await srvDeleteDetalle(idfila, codigo, numero, oficina, lista, canal);
  return respDet;

}

async function CallsrcDeleteOrderSap(numero_sap, numero, insertMotivo, swlistarped) {
  const respDet = await srcDeleteOrderSap(numero_sap, numero, insertMotivo, swlistarped);
  return respDet;

}

async function CallsrcDeleteOrderAdg(numero, numero_sap, insertMotivo, motivo_anulacion) {
  const respDet = await srcDeleteOrderADG(numero, numero_sap, insertMotivo, motivo_anulacion);
  return respDet;

}

// SERVICIOS EVALUACION DE DESEMPEÑO
// 
function getPendingEvaluations(top = 0, id) {

  return new Promise((resolve, reject) => {

    $.ajax({
      url: url_api + 'encuesta/pendientes/' + id + '/' + top,
      type: "GET",
      dataType: "json",
      async: true,
      success: function (data) {
        resolve(data);
      }
    }).fail(function (data) {
      reject(data);
    });

  });


}
//

async function listarComportamientoByRol(id_rol, id_enc_det = 0) {

  return await new Promise((resolve, reject) => {

    $.ajax({
      url: url_api + 'comportamientos/listByRol/',
      type: "GET",
      data: ({
        id_rol,
        id_enc_det
      }),
      dataType: "json",
      async: true,
      success: function (data) {
        resolve(data);
      }
    }).fail(function (data) {
      reject(data);
    });

  });

}

async function listarComportamientoByProcesos(id) {

  return await new Promise((resolve, reject) => {

    $.ajax({
      url: url_api + 'comportamientos/listByProcesos/' + parseInt(id),
      type: "GET",
      dataType: "json",
      async: true,
      success: function (data) {
        resolve(data);
      }
    }).fail(function (data) {
      reject(data);
    });

  });

}

//LISTA LOS COMPORTAMIENTOS CON CALIFICACION POR DEBAJO DE 4
async function listarComportamientosCalificados(data) {

  return await new Promise((resolve, reject) => {

    $.ajax({
      url: url_api + 'plandesarrollo/pendientes',
      type: "GET",
      data: (data),
      dataType: "json",
      async: true,
      success: function (data) {
        resolve(data);
      }
    }).fail(function (data) {
      reject(data);
    });

  });

}
//LISTA TODOS LOS PLANES DE DESARROLLOS GESTIONADOS 
async function listarComportamientosGestionados(data) {

  return await new Promise((resolve, reject) => {

    $.ajax({
      url: url_api + 'plandesarrollo/gestionados',
      type: "GET",
      dataType: "json",
      async: true,
      data: (data),
      success: function (data) {
        resolve(data);
      }
    }).fail(function (data) {
      reject(data);
    });

  });

}

/*listar competencias*/
async function listarCompetencias() {

  return await new Promise((resolve, reject) => {

    $.ajax({
      url: url_api + 'competencias/search',
      type: "POST",
      dataType: "json",
      async: true,
      success: function (data) {
        resolve(data);
      }
    }).fail(function (data) {
      reject(data);
    });


  });

}

//LISTAS LAS COMPETENCIAS 
async function listarComportamientos() {

  return await new Promise((resolve, reject) => {

    $.ajax({
      url: url_api + 'comportamientos/search',
      type: "POST",
      dataType: "json",
      async: true,
      success: function (data) {
        resolve(data);
      }
    }).fail(function (data) {
      reject(data);
    });


  });

}
//OFICINAS DE VENTAS
async function listarOficinas(link = '../../models/Usuarios.php') {

  return new Promise((resolve, reject) => {

    $.ajax({
      url: link,
      type: "POST",
      dataType: "json",
      data: ({
        op: '18'
      }),
      async: true,
      success: function (data) {
        resolve(data);
      }
    }).fail(function (data) {
      reject(data);
    });

  });

}

//ROLES DE SISTEMAS 
async function listarRoles() {

  return new Promise((resolve, reject) => {

    $.ajax({
      url: '../../models/Roles.php',
      type: "POST",
      dataType: "json",
      data: ({
        op: '2'
      }),
      async: true,
      success: function (data) {
        resolve(data);
      }
    }).fail(function (data) {
      reject(data);
    });

  });

}


async function viewListEvaluacionesPendientes(top, id) {
  $(".list-group-evaluaciones li").remove();


  li = `<li class="list-group-item text-center btn btn-primary "
	data-bs-toggle="modal" 
	data-bs-target=".modal_list_evaluaciones_pendientes" 
	onclick="viewInTableEvaluacionesPendientes(40,${id})"><ins><b>Ver todas</b></ins></li>`;

  await getPendingEvaluations(top, id)
    .then(resp => {
      $(".n_evaluaciones_desempenio").text(resp.length);

      if (resp.length > 0) {

        $(".li_evaluaciones_desempenio").show();

        //$(".list-group-evaluaciones").html('<li class="text-center" style="padding:5px" ></li>');
        resp.forEach(item => {

          if (item.TIENE_RESPUESTA > 0) {
            /*
            li+=`<li class="text-left item_li_evaluacion alert-warning" 
            		style="padding:6px;font-size:12px; cursor:pointer" 
            		onclick="GoViewEvaluacion(${item.USUARIO_ID},${item.NUMERO},${item.ID_TIPO_EVALUADOR},${item.ID_DET})"
            	> 
            		<i class="fa fa-pencil text-left p-1"></i>
            		${item.TITULO.toUpperCase().substring(0,50)} - Como <b>${item.CALIDAD_DE} (<small>${item.EVALUADO}</small>) </b>
            		 
            </li>`;*/
            li += `
						 <li class="item_li_evaluacion alert-warning" style="padding:6px;font-size:12px; cursor:pointer" >
							<a class="dropdown-item d-flex align-items-center btn" onclick="GoViewEvaluacion(${item.USUARIO_ID},${item.NUMERO},${item.ID_TIPO_EVALUADOR},${item.ID_DET})" >
							   <i class="fa fa-pencil text-left p-1"></i>
							     ${item.TITULO.toUpperCase().substring(0,50)} - Como <b>${item.CALIDAD_DE} (<small>${item.EVALUADO}</small>) </b>
							</a>
							</li>					
					`
          } else {
            /*
            li+=`<li  class="text-left item_li_evaluacion" 
            		style="padding:6px;font-size:12px; cursor:pointer" 
            		onclick="GoViewEvaluacion(${item.USUARIO_ID},${item.NUMERO},${item.ID_TIPO_EVALUADOR},${item.ID_DET})"
            	> 
            		<i class="fa fa-pencil text-left p-1"></i>
            		${item.TITULO.toUpperCase().substring(0,50)} - Como <b>${item.CALIDAD_DE} (<small>${item.EVALUADO}</small>) </b>
            		 
            </li>`;*/
            li += `
						 <li class="item_li_evaluacion " 
						     style="padding:6px;font-size:10px; cursor:pointer" >
							 
							<a class="dropdown-item d-flex align-items-center flex-column btn" onclick="GoViewEvaluacion(${item.USUARIO_ID},${item.NUMERO},${item.ID_TIPO_EVALUADOR},${item.ID_DET})" >
							   
							     ${item.TITULO.toUpperCase().substring(0,50)} - Como <b>${item.CALIDAD_DE} (<small>${item.EVALUADO}</small>) </b>
							</a>
							</li>					
					`

          }
        });

      } else {
        $(".li_evaluaciones_desempenio").hide();
      }


      $(".list-group-evaluaciones").append(li);
    })
    .catch(err => {
      console.error(err);
    })

}


async function viewInTableEvaluacionesPendientes(top, id) {

  $(".result_list_evaluaciones_pendientes").html(`
			<div class="alert alert-success" style="padding:3px">Cargando...</div>
		`);

  await getPendingEvaluations(top, id)
    .then(resp => {

      let tabla = `<table class="evaluaciones_desempenio" width="100%" border="0" style="border-collapse:collapse" cellpadding="1" cellspacing="1">
							<thead class="alert-info" style="font-size:15px">
								<tr>
									<th>#</th>
									<th>Titulo</th>
									<th>En calidad de</th>
									<th>Sr(a)</th>
									<th>Rol</th>
									<th>Proceso</th>
									<th>Evaluar a  </th>
									<th>Periodo inicial</th>
									<th>Periodo final</th>
									<th>Faltan</th>
									<th>Realizar</th>
								</tr>
							</thead>
					  <tbody>
					`;
      resp.forEach((item, index) => {

        titulo = item.TITULO.toUpperCase();
        usuario = item.USUARIO;

        disabled = '';

        if (item.ESTADO != 'P') {
          disabled = 'disabled';
        }

        if ($.trim(item.USUARIO) != $.trim(item.EVALUADO)) {
          evaluar_a = item.EVALUADO;
        } else {
          evaluar_a = ''
        }

        tabla += `<tr>
							<td class="">${(index+1)}</td>
							<td>${titulo}</td>
							<td>${item.CALIDAD_DE}</td>
							<td>${usuario}</td>
							<td>${item.ROL}</td>
							<td>${item.PROCESO}</td>
							<td>${evaluar_a}</td>
							<td>${item.FECHA_INI}</td>
							<td>${item.FECHA_FIN}</td>
							<td>${item.QUEDAN}</td> `;

        if (item.TIENE_RESPUESTA > 0) {
          tabla += `
							<td><button class="btn btn-sm btn-warning m-1" onclick="GoViewEvaluacion(${item.USUARIO_ID},${item.NUMERO},${item.ID_TIPO_EVALUADOR},${item.ID_DET})" ${disabled}><i class="fa fa-refresh"></i>Actualizar respuestas</button></td>
							`;
        } else {
          tabla += `
							<td><button class="btn btn-sm btn-success" onclick="GoViewEvaluacion(${item.USUARIO_ID},${item.NUMERO},${item.ID_TIPO_EVALUADOR},${item.ID_DET})" ${disabled}><i class="fa fa-arrow-right"></i></button></td>
							`;
        }


        tabla += `
						 </tr>
						`;
      });

      tabla += `</tbody>
					</table>`;

      $(".result_list_evaluaciones_pendientes").html(tabla);

    });
  $(".modal_list_evaluaciones_pendientes").modal("show");

}

function GoViewEvaluacion(usuario_id, id_evaluacion, id_tipo_evaluador, id_det) {

  window.open(`ViewEvaluacionDesempenio.php?idUser=${usuario_id}&Ide=${id_evaluacion}&Idt=${id_tipo_evaluador}&id_det=${id_det}`, 'Evaluacion de desempeño');
}


/**/
//

function buscarDetalle(id, link) {

  $("#modal_detalle_sol").modal("show");

  data = {
    op: 'buscarDetalle',
    id,
    link
  };
  $("#result_detalle").html(`<div class="alert alert-info"><i class="glyphicon glyphicon-refresh"></i> Cargando...</div>`);
  enviarPeticion(data)
    .then(resp => {

      $("#id_sol").html(id)

      if (resp.length == 0) {
        $("#result_detalle").html(`<div class="alert alert-danger">Sin resultados</div>`);
        return;
      }

      tabla = ` <table class="table">
					<thead>
					  <tr>
						 <th>Código</th>
						 <th>Material</th>
						 <th>Cantidad</th>
						 <th>Fecha</th>
						 <th>Lote</th>
					  </tr>
					</thead>
				 <tbody>
				`
      resp.forEach(item => {

        tabla += `<tr>
						<td>${item.codigo_material}</td>
						<td>${item.material}</td>
						<td>${item.cantidad}</td>
						<td>${item.fecha_vencimiento}</td>
						<td>${item.lote}</td>
					   </tr>`

      });

      tabla += `<tbody></table>`;

      $("#result_detalle").html(tabla);


    })
    .catch(e => {
      console.error(e);
    })

}


function aprobarSol(id) {

  enviarPeticion({
      op: 'aprobacion',
      id,
      link: '../models/CartaAprobacion.php'
    })
    .then(resp => {
      SolicitudesIngresosPendientes()
        .then(solicitudes => {
          visualizarSolicitudesIngresos(solicitudes);
        })
        .catch(error => {
          console.error(error)
        })
    })
    .catch(e => {
      console.log(e)
    })
}

function RechazarSol(id) {

  motivo = prompt("Por favor indique el motivo de rechazo de la solicitud #" + id);

  if (motivo) {
    enviarPeticion({
        op: 'rechazo',
        id,
        motivo,
        link: '../models/CartaAprobacion.php'
      })
      .then(resp => {

        SolicitudesIngresosPendientes()
          .then(solicitudes => {
            visualizarSolicitudesIngresos(solicitudes);
          })
          .catch(error => {
            console.error(error)
          })

      }).catch(e => {
        console.error(e)
      })
  }
}


/*  OBTIENE LAS SOLICITUES DE INGRESOS DE MERCANCIAS DE  */

async function SolicitudesIngresosPendientes() {

  return new Promise((resolve, reject) => {

    d = new Date();
    d2 = d.toLocaleDateString("en-US")
    d2 = d2.split("/");

    dia = d2[1] < 10 ? '0' + d2[1] : d2[1];
    mes = d2[0] < 10 ? '0' + d2[0] : d2[0];
    ano = d2[2];

    fecha_final = ano + '-' + mes + '-' + dia;

    $.ajax({
      url: '../models/CartaAprobacion.php',
      type: "POST",
      dataType: "json",
      data: ({
        op: 'buscar',
        filtro: '',
        estado: 'P',
        fecha_inicial: '2023-01-01',
        fecha_final: fecha_final
      }),
      async: true,
      success: function (data) {
        resolve(data);
      }
    }).fail(function (data) {
      reject(data);
    });

  });

}


function visualizarSolicitudesIngresos(resp) {

  if (resp === undefined) {
    $(".n_solicitudes_ing").hide()

    $(".li_solicitudes_ing").hide()
    return;
  }
  $(".n_solicitudes_ing").html(resp.length)

  if (resp.length == 0) {
    $(".n_solicitudes_ing").hide();
    $(".li_solicitudes_ing").hide();
  } else {
    $(".n_solicitudes_ing").show()
    $(".li_solicitudes_ing").show();
    if (!$("#ModalPendientes").is(":visible")) {
      $("#ModalPendientes").modal("show");
    }
  }


  let div = `<h4 class="text-center"> <i class="fa fa-clock m-1 text-info" style="font-size: 22px"></i>Solicitudes pendientes(MODULO EN VERSION DE PRUEBA )</h4>
		  <br>`;

  div += ` 
		  <div class="card-body bg-white ">
			 <div class="row shadow-sm">
				<div class="col-md-4 col-sm-4 col-xs-4 text-left"><h4><b>Fecha</b></h4></div>
				<div class="col-md-4 col-sm-4 col-xs-4 text-center"><h4><b>Proveedor</b></h4></div>
				<div class="col-md-4 col-sm-4 col-xs-4 text-right"><h4><b>Usuario</b></h4></div>
			</div>`;


  resp.forEach(item => {

    div += `	  <div class="row shadow-sm">
					 <!-- <div class="col-1 text-left "><input type="checkbox"  ></div> -->
					  <div class="col-md-4 col-sm-4 col-xs-4 text-left ">${item.fecha}</div>
					  <div class="col-md-4 col-sm-4 col-xs-4 text-left ">${item.proveedor}</div>
					  <div class="col-md-4 col-sm-4 col-xs-4 text-right ">${item.usuario}</div>	  
				  </div>
				<div class="row" style="margin-bottom:15px">
					<div class="col-md-8 col-sm-8 col-xs-8" ></div>	
					<div class="col-md-4 col-sm-4 col-xs-4 text-right" >

						<div class="btn-group btn-group-sm fila-${item.id}" role="group" aria-label="Basic example">
							<button class="btn btn-success float-left" title="Aprobar solicitud" onclick="aprobarSol(${item.id})"><i class="fa fa-check"></i></button>
							<button class="btn btn-danger float-left"  title="Rechazar solicitud"  onclick="RechazarSol(${item.id})"><i class="fa fa-times"></i></button>
							<button class="btn btn-default float-left" onclick="buscarDetalle(${item.id},'${'../models/CartaAprobacion.php'}')"><i class="fa fa-list text-info"></i></button>
							<button class="btn btn-default float-left"><a class="" href="https://www.pwmultiroma.com/documentos/0310/${item.adjunto}"><i class="fa fa-download text-primary"></i></a></button>
						</div>
					</div>
				</div>
			  </div>`

  })

  $(".body-moda-pendientes").html(div);
}
/*S: NUESTRA TODAS LAS OFICINAS , N:SOLO LA OFICINA DE ADG*/
const obtenerOficinasVentas = async (sw, id, default_ofi) => {


  let options = '';

  const data = {
    op: 18,
    link: '../models/Usuarios.php'
  }

  const respuesta = await enviarPeticion(data);
  respuesta.forEach((oficina, index) => {

    let selected = '';

    if (sw == 'S') {
      if (index == 0) {
        options += `<option value="${oficina.ORGANIZACION_VENTAS}">${oficina.ORGANIZACION_VENTAS}-Todas</option>`
      }
    }

    if (default_ofi == oficina.OFICINA_VENTAS) {
      selected = "selected";
    }

    options += `<option ${selected} value="${oficina.OFICINA_VENTAS}">${oficina.OFICINA_VENTAS}-${oficina.DESCRIPCION}</option>`;
  })

  $("#" + id).html(options);

  /*
  		  for(var i=0; i<=data.length-1; i++){
  			org  =  data[i].ORGANIZACION_VENTAS;
  			tmp += '<option value="'+data[i].OFICINA_VENTAS+'">'+data[i].OFICINA_VENTAS+' - '+data[i].DESCRIPCION+'</option>';
  		  } 
  		  //Agregar todas las oficinas
  		  if(op == 'S'){
  			ofc = '<option value="'+org+'">'+org+' - TODAS</option>';
  			ofc += tmp;
  		  }else{
  	        ofc += tmp;
  		  }		
  */
}

/*OBTIENE LOS CENTROS DE COSTOS SUMINISTRADORES*/
const obtenerCentrosSuministradores = async (mostrarTodas, id, oficina) => {

  switch (oficina) {
    case "1100":
      centro = 'MM01';
      break;
    case "1200":
      centro = 'MC01';
      break;
    case "2100":
      centro = 'RM01';
      break;
    case "2200":
      centro = 'RB01';
      break;
    case "2300":
      centro = 'RC01';
      break;
    case "2400":
      centro = 'RQ01';
      break;
  }

  const data = {
    op: 18,
    link: '../models/Usuarios.php'
  }
  const respuesta = await enviarPeticion(data);

  options = '';

  respuesta.forEach((centro, index) => {

    if (mostrarTodas && index == 0) {
      options += `<option value="0">Todas</option>`
    }

    options += `<option value="${centro.CENTRO_SUMINISTRADOR}">${centro.CENTRO_SUMINISTRADOR}-${centro.OFICINA_VENTAS}</option>`

  });

  $("#" + id).html(options);

  if (!mostrarTodas) {
    $("#" + id).prop("disabled", true).val(centro);
  }

}


///SERVICIOS PARA SUBIR ARCHIVOS

const getExtFile = (archivo) => {
  return archivo.name.split(".").pop().toLowerCase()
}

const getFileFormId = (id) => {

  let archivo = document.getElementById(String(id));
  return archivo.files[0];
}

const esImagen = (archivo, permitidas = ['png', 'jpg', 'jpeg']) => {

  let contCoincidencias = 0;
  if (permitidas[0] == '*') {
    return true;
  }
  let extencion = getExtFile(archivo);

  permitidas.forEach(ext => {
    if (extencion.indexOf(ext) != -1) {
      contCoincidencias++;
    }
  });
  return contCoincidencias > 0 ? true : false;
}

const esDocumento = (archivo, permitidas = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'pptx', 'ppt', 'txt']) => {

  let contCoincidencias = 0;
  if (permitidas[0] == '*') {
    return true;
  }
  //let file= getFileFormId(id);
  let extencion = getExtFile(archivo);

  permitidas.forEach(ext => {
    if (extencion.indexOf(ext) != -1) {
      contCoincidencias++;
    }
  });
  return contCoincidencias > 0 ? true : false;
}

const esVideo = (archivo, permitidas = ['mp4', 'avi', 'mkv', 'mov', 'flv', 'mov', 'wmv', 'webm']) => {

  let contCoincidencias = 0;
  if (permitidas[0] == '*') {
    return true;
  }
  //let file= getFileFormId(id);
  let extencion = getExtFile(archivo);

  permitidas.forEach(ext => {
    if (extencion.indexOf(ext) != -1) {
      contCoincidencias++;
    }
  });

  return contCoincidencias > 0 ? true : false;
}

const getFileSizeMb = (archivo) => archivo.size / 1000000;

/**
*@archivo es el objeto input ejem archivo =document.getElementById('id_input_file');
*@validateSize 
 *@typesFile  es un objeto que lleva los tipos de datos img,agen video, document 
  ejemplo options={
		typesFile:{
			image:[],video:[],document:[]
		}
	}

*/
const subirArchivos = (archivo, options = {
    validateSize: false,
    maxSize: 0,
    validateExt: false,
    typesFile: {},
    ruta: ''
  },
  params = {}) => {

  let valido = validateFileUpload(archivo, options);

  let data = new FormData();

  data.append('archivo', archivo);
  data.append('ruta', options.ruta);
  //si se envian parametros extras
  keys = Object.keys(params);
  keys.forEach((key, idx) => {
    data.append(key, params[key]);
  });

  return new Promise((resolve, reject) => {

    if (!valido) {
      reject(false)
    }

    $.ajax({
      url: '../models/ServiceUploadFile.php',
      type: "POST",
      dataType: "json",
      contentType: false,
      processData: false,
      cache: false,
      data: data,
      async: true,
      success: function (data) {
        resolve(data);
      }
    }).fail(function (data) {
      reject(data);
    });
  })

}

const validateFileUpload = (archivo, options) => {

  let valido = true;
  let cont = 0;

  if (Object.entries(options).length === 0) {
    throw new Error('Se debe enviar las opcciones al menos con la clave ruta');
  }

  if (options.ruta == '') {
    throw new Error('El parametro ruta es necesario');
  }

  if ((options.validateExt && (Object.entries(options.typesFile).length == 0 || options.typesFile == undefined))) {
    throw new Error('Si se envia la opcion validateExt como verdadera, se deben mandar el objeto typesFile');
  }

  if (options.validateExt && Object.entries(options.typesFile).length > 0) {

    let arrTipos = Object.entries(options.typesFile.tipo).filter(t => t[0] == 'document' || t[0] == 'video' || t[0] == 'image')


    if (arrTipos.length == 0) {
      throw new Error('El parametro tipo de documento no es valido. Los tipos validos son document,vide,image');
    }

    arrTipos.forEach(tipo => {

      switch ($.trim(tipo[0])) {
        case 'video':
          valid = esVideo(archivo, tipo[1]);

          if (valid) {
            cont++;
          }
          break;
        case 'image':
          valid = esImagen(archivo, tipo[1]);

          if (valid) {
            cont++;
          }
          break;
        case 'document':
          valid = esDocumento(archivo, tipo[1]);

          if (valid) {
            cont++;
          }
          break;
        default:
          cont++;
      }
    });

  } //valida extensiones
  else {
    cont++;
  }

  if (options.validateSize && options.maxSize > 0) {
    tamanio = getFileSizeMb(archivo);

    if (tamanio > options.maxSize) {
      cont++;
    } else {

      throw new Error('El tamaño del archivo supera el permitido. tamaño permitido ' + options.maxSize);
    }
  }

  if (cont == 0) {
    valido = false;
    throw new Error('Archivo no valido el archivo debe ser ');
  }

  return valido;
}

const showLoadingSwalAlert2 = (html = '', WhithImg = true, sw = false, text = 'Cargando...') => {
  let img = '<img src="../resources/icons/preloader.gif"  class="img-fluid"/>';
  if (!WhithImg) {
    img = html;
  }

  Swal.fire({
    title: img,
    html: text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      if (sw) {
        Swal.showLoading();
      }
    }
  });
};

const showLoadingSwalAlert2Feria = (titulo = 'Cargando informacion', html = ``) => {
  // Bloquear la pantalla
  /*
  	Swal.fire({
  	  title				: titulo,
  	  html				: html,
  	  allowOutsideClick	: false,
  	  allowEscapeKey	: false,
  	  showConfirmButton	: false,

  	  onOpen: () => {
  		//Swal.showLoading();
  	  }
  	});
  */
  // <img src="../resources/images/preload_navidenio.gif" class="img-fluid"/>
  const contenidoHTML = `
    <img class="img-fluid" src="../resources/images/preload_navidad.gif" />
  ${html}`;

  // Configuración de Swal2
  const configuracionSwal = {
    html: contenidoHTML,
    showConfirmButton: false, // Oculta el botón de confirmación
    allowOutsideClick: false, // Evita cerrar el modal haciendo clic afuera
    allowEscapeKey: false, // Evita cerrar el modal presionando la tecla Esc
    showCloseButton: false, // Muestra el botón de cierre
    onBeforeOpen: () => {
      //   Swal.showLoading(); // Muestra el spinner de carga mientras se muestra el gif
    },
    // background: 'transparent', // Establece el fondo transparente
    customClass: {
      //popup: 'background', // Aplica una clase CSS personalizada para eliminar los bordes
    },
    onClose: () => {
      Swal.hideLoading(); // Oculta el spinner de carga cuando se cierra el modal
    }
  };
  Swal.fire(configuracionSwal);
}

const dissminSwal = () => {
  Swal.close();
}


const formatearArrayRequest = (data) => {

  if (data.length == 0) return;

  let nuevoObj = {};

  data.forEach(item => {
    nuevoObj[item.name] = item.value
  });
  return nuevoObj;
}

$.fn.serializeArrayAll = function () {
  var obj = [];
  $(':disabled[name]', this).each(function () {
    obj.push({
      name: this.name,
      value: $(this).val()
    });
  });
  return this.serializeArray().concat(obj);
};


/** INICIO SERVICIOS LOCALSTORAGE */
// Función para crear un nuevo elemento en localStorage
function crearElemento(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Función para leer un elemento de localStorage
async function leerElemento(key) {
  const valor = localStorage.getItem(key);
  // Verificar si el valor es null (no existe en localStorage)
  if (valor === null || valor == '') {
    console.warn(`El elemento con la clave "${key}" no existe en el localStorage.`);
    return null; // O puedes devolver un valor predeterminado
  }

  try {
    return JSON.parse(valor); // Intentar analizar el valor
  } catch (error) {
    console.error(`Error al analizar JSON para la clave "${key}":`, error);
    return null; // O manejar el error de otra manera
  }
}

// Función para actualizar un elemento en localStorage
function actualizarElemento(key, newValue) {
  if (localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(newValue));
    return true; // Actualización exitosa
  }
  return false; // Elemento no encontrado
}

// Función para eliminar un elemento de localStorage
function eliminarElemento(key) {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    return true; // Eliminación exitosa
  }
  return false; // Elemento no encontrado
}

const dataPedidosDesbloqueo = async () => {
  data = {
    link: '../models/Menu.php',
    op: 'pedidos_desbloqueo'
  }
  return await enviarPeticion(data)
}

const pedidosPendientes = async () => {
  $("#miAudio").remove();

  try {

    resp = await dataPedidosDesbloqueo();

    if (resp.length > 0) {

      switch (resp[0].estado) {
        case "1":
          estado = ' EN VERIFIACION ';
          color = 'info';
          break;
        case "2":
          estado = ' RECHAZADA';
          color = 'danger';
          break;
        case "3":
          estado = ' APROBADA';
          color = 'success';
          break;
      }
      Swal.fire("Estado de sol. de desbloqueo de pedido", `
				<div class="container">
					<div class="row">
						<div class="col-12">
								El pedido numero <b>${resp[0].pedido}</b> se encuentra <span class="text-${color}">${ estado }</b></span> por el dpto de Cartera.
								<br>
								Nota  : ${resp[0].respuesta}
						</div>
					</div>
				</div>
			`, false, false);
      showNotification(`Pedido #${resp[0].pedido}`, ` Se encuentra ${ estado }`, 'https://www.pwmultiroma.com/calidad/lib/notificaciones-push/iconos/unlock.png', 'https://www.pwmultiroma.com/calidad/views/Menu.php')
      var audio = '<audio id="miAudio"   >'
        + ' <source src="https://www.pwmultiroma.com/calidad/resources/sound/iphone-notificacion.mp3" onPlay="true" ></source>'
        + '</audio>';
      $("body").append(audio);
      $("#miAudio").attr("autoplay", true);

    }
  } catch (e) {
    console.error(e)
  }

}

const datosPerfil = async (id) => {
  try {
    data = {
      link: '../models/Menu.php',
      op: 'perfil'
    }

    const resp = await enviarPeticion(data);

    datos = resp[0];

    $("#profile-usuario").html(datos.usuario.charAt(0).toUpperCase() + datos.usuario.slice(1).toLowerCase());
    $("#profile-rol").html(datos.rol.charAt(0).toUpperCase() + datos.rol.slice(1).toLowerCase());
    nombre_completo = datos.nombres.charAt(0).toUpperCase() + datos.nombres.slice(1).toLowerCase() + ' ' + datos.apellidos.charAt(0).toUpperCase() + datos.apellidos.slice(1).toLowerCase()
    $("#profile-full-name").html(nombre_completo);
    ofi = '';
    switch (datos.oficina_ventas) {
      case '1100':
        ofi = 'Monteria';
        break;
      case '1200':
        ofi = 'Cartagena';
        break;
      case '2100':
        ofi = 'Medellín';
        break;
      case '2200':
        ofi = 'Bogotá';
        break;
      case '2300':
        ofi = 'Cali';
        break;
      case '2400':
        ofi = 'Barranquilla';
        break;

    }
    company = datos.organizacion_ventas == '1000' ? 'CM' : 'ROMA' + '  -  ' + ofi
    $("#profile-org-ofi").html(company);
    $("#profile-cargo").html(datos.cargo);
    $("#profile-direccion").html(datos.direccion);
    $("#profile-email").html(datos.email);
    $("#profile-telefonos").html(datos.telefonos);
  } catch (e) {
    console.error(e)
  }

}


/**
 * 
 * @param {* nombre de la tabla} tableId 
 * @param {* datos un arrary} data 
 * @param {* nombre de las columnas de la db} dataNames 
 * @param {* nombre de las columnas del encabezado} columnNames 
 * @param {* boleano o funcion , si deseas que tenga el boton de editar mando el nombre de la funcion sino un false} editCallback 
 * @param {* boleano o funcion , si deseas que tenga el boton de eliminar mando el nombre de la funcion sino un false} deleteCallback 
 * @param {* boleano: si se desea ordenar la columnas} otherButton 
 * @param {* : botones adicionales formato html} boton 
 * @param {* otra funcion que se ejecute con la tabla } otherCallback 
 */
const createDataTable = (
  tableId,
  data,
  dataNames,
  columnNames,
  editCallback,
  deleteCallback,
  otherButton = false,
  boton = '',
  otherCallback = ''
) => {
  // Crear las columnas para el DataTable
  const columns = columnNames.map((name, index) => ({
    title: name,
    data: dataNames[index]
  }));

  defaultButton = ``

  if (typeof editCallback == 'function') {
    defaultButton += `<button class="edit-btn btn btn-sm btn-outline-warning">
			<i class="fa-regular fa-pen-to-square"></i>
			</button> `
  }

  if (typeof deleteCallback == 'function') {

    defaultButton += `<button class="delete-btn btn btn-sm btn-outline-danger">
	  <i class="fa-regular fa-trash-can"></i>
	  </button>`;
  }

  if (typeof editCallback == 'function' || typeof deleteCallback == 'function') {
    // Añadir columnas para los botones de acción
    columns.push({
      title: "Acciones",
      data: null,
      defaultContent: defaultButton,
      orderable: false
    });

    if (otherButton) {
      columns[columns.length - 1].defaultContent += boton;
    }
    html = columns[columns.length - 1].defaultContent;

    columns[columns.length - 1].defaultContent = `
		<div class="btn-group btn-group-sm" aria-label="Acciones">
			${html}
		</div>
		`;
  }

  // Inicializar el DataTable
  $(`#${tableId}`).DataTable({
    data: data,
    columns: columns,
    render: true,
    language: {
      "sProcessing": "Procesando...",
      "sLengthMenu": "Mostrar _MENU_ registros",
      "sZeroRecords": "No se encontraron resultados",
      "sEmptyTable": "Ningún dato disponible en esta tabla",
      "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
      "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
      "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
      "sInfoPostFix": "",
      "sSearch": "Buscar:",
      "sUrl": "",
      "sInfoThousands": ",",
      "sLoadingRecords": "Cargando...",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
      },
      "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
      }
    },
    // Agregar clases a la tabla
    // dom: 'Bfrtip'

  });

  // Añadir event listeners para los botones
  $(`#${tableId} tbody`).on('click', 'button.edit-btn', function () {
    const data = $(`#${tableId}`).DataTable().row($(this).parents('tr')).data();
    editCallback(data);
  });

  $(`#${tableId} tbody`).on('click', 'button.delete-btn', function () {
    const data = $(`#${tableId}`).DataTable().row($(this).parents('tr')).data();
    deleteCallback(data);
  });

  if (otherButton) {
    $(`#${tableId} tbody`).on('click', 'button.other-btn', function () {
      const data = $(`#${tableId}`).DataTable().row($(this).parents('tr')).data();
      otherCallback(data);
    });
  }
}
