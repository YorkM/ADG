function Limpiar() {
  $('#User').focus();
  $('#User').val('');
  $('#Pass').val('');
  $("#TxtOficina").val("");
  $("#RescueEmail").val("");
  $("#RescueCaptcha").val("");
}

const recuperarClave = async () => {
  const email = $.trim($("#RescueEmail").val());
  const datosUsuario = await enviarPeticion({
    op: "ValidaCorreo",
    link: "../models/Login.php",
    email
  });
  showLoadingSwalAlert2('<i class="fa-regular fa-paper-plane m-1 fa-1x fa-bounce"></i>  Enviando correo de recuperación de contraseña. Por favor espere!', false, true)

  if (datosUsuario.length > 0) {
    $.ajax({
      url: '../models/captcha/VerifCaptha.php',
      type: 'POST',
      dataType: 'html',
      async: true,
      data: {
        "valor": $("#RescueCaptcha").val()
      },
      success: function (data) {
        if (data == 1) {
          $.ajax({
            url: "../models/Login.php",
            type: 'POST',
            dataType: 'json',
            async: true,
            data: {
              op: "EnviarCorreo",
              email: email,
              usuario: datosUsuario[0].login,
              nombres: datosUsuario[0].nombres,
              org: datosUsuario[0].org
            },
            success: function (data) {
              $(".footer-modal-recuperacion").addClass("d-none")
              $(".header-modal-recuperacion").addClass("d-none")
              $(".form-recuperacion").addClass("d-none")
              $(".img-success").removeClass("d-none")
              Limpiar();
              dissminSwal();
            }
          }).fail(function (e) {
            console.error(e)
            dissminSwal();
            Swal.fire("Error", "Ha ocurrido un error interno en el servidor!", "error");

          });
        } else {
          dissminSwal();
          Swal.fire("Oops", "Por favor digite los caracteres de la imagen nuevamente!", "error");
          CargarCaptcha();
        }
      }
    });
  } else {
    dissminSwal();
    Swal.fire("Oops", "Correo invalido o no esta asociado a una cuenta, verifique e intente nuevamente!", "error");
    CargarCaptcha();
  }
}

const cambiarClave = async (data) => {
  try {
    showLoadingSwalAlert2('<h4>Guardando datos</h4>', false, true);
    resp = await enviarPeticion({
      link: "../models/Usuarios.php",
      op: "9",
      clave: $("#NewPass1").val(),
      id: $("#IdUser").val()
    });
    dissminSwal();
    if (!resp.ok) {
      Swla.fire("Cambio de clave", resp.message, "error");
      return;
    }
    if (resp.ok) {
      Swal.fire("Ok", resp.message, "error");
      $("#dvCambioClave").modal("hide");
      $("#NewPass1").val("")
      $("#NewPass2").val("")
      $("#IdUser").val(0)
      form_cambio_clave.classList.remove("was-validated");
    }
  } catch (e) {
    console.error(e)
  }
}
//Realiza la peticion AJAX
function CargarCaptcha() {
  $.ajax({
      url: '../models/captcha/captcha2.php',
      type: 'post',
      dataType: 'text',
      async: false,
      data: {
        "capt": "visto"
      }
    })
    .done(function (data) {
      if (data) {
        var visto = $.parseJSON(data);
        var canva = document.getElementById("capatcha");
        var dibujar = canva.getContext("2d");
        canva.width = canva.width;
        dibujar.fillStyle = "#2594D1";
        dibujar.font = '20pt "NeoPrint M319"';
        dibujar.fillText(visto.retornar, 6, 39);
        var canva = document.getElementById("capatcha2");
        var dibujar = canva.getContext("2d");
        canva.width = canva.width;
        dibujar.fillStyle = "#2594D1";
        dibujar.font = '20pt "NeoPrint M319"';
        dibujar.fillText(visto.retornar, 6, 39);
      }
    })
    .fail(function () {
      console.log("error");
    });
}
const BuscarNit = async () => {
  try {
    nit = $("#nit").val();
    data = {
      nit,
      link: '../models/Solicitudes_web.php',
      op: "BUSCAR",
    }
    resp = await enviarPeticion(data);
    if (resp.length > 0) {
      html = "";
      CargarCaptcha();
      for (var i = 0; i < resp.length; i++) {
        d = resp[i];
        if (d.ORGANIZACION_VENTAS == 1000) {
          des_org = "CM";
        } else {
          des_org = "ROMA";
        }
        html += '<option value="' + d.ORGANIZACION_VENTAS + '">' + des_org + '</>';
        $("#TxtCod_sap").val(d.CODIGO_SAP);
        $("#TxtOficina").val(d.OFICINA_VENTAS);
        $("#drogueria").val(d.RAZON_COMERCIAL);
        $("#nombres").val(d.NOMBRES);
        $("#apellidos").val(d.NOMBRES);
        $("#email").val(d.EMAIL);
        $("#telefono").val($.trim(d.TELEFONO1));
      } //FOR
      $("#organizacion").html(html);
      $("#nit").addClass("NitTrue");
      $("#register-form input,select").attr("disabled", false);
    } else {
      Swal.fire(
        'Error!',
        'No se encontró el nit ' + $("#nit").val() + '!',
        'warning'
      );
      $("#nit").removeClass("NitTrue");
      $("#register-form input:not(.nit),select").attr("disabled", true);
      $("#register-form input:not(.nit),select").val("");
      $("#TxtOficina").val("");
      $("#organizacion").html("");

    }
  } catch (e) {
    console.error(e)
  }
}
function tiene_letras(texto) {
  var letras = "abcdefghyjklmnñopqrstuvwxyz";
  texto = texto.toLowerCase();
  for (i = 0; i < texto.length; i++) {
    if (letras.indexOf(texto.charAt(i), 0) != -1) {
      return 1;
    }
  }
  return 0;
}
function tiene_numeros(texto) {
  var numeros = "0123456789";
  for (i = 0; i < texto.length; i++) {
    if (numeros.indexOf(texto.charAt(i), 0) != -1) {
      return 1;
    }
  }
  return 0;
}
const CarruselItems = async (org) => {
  if (org == '' || org == null || org == undefined) {
    $(".items-carrusel").html(`
            <div class="carousel-item active">
                <img src="../../ImagenesPublicitarias/default.png"  class="d-block w-100 " style="height:95vh; min-height:95vh" alt="...">
            </div>
        `);
    return;
  }
  try {
    const data = {
      link: "../models/ImagenesPublicitarias.php",
      op: "S_PUBLICIDAD_ACTIVA",
      org
    }

    resp = await enviarPeticion(data);
    if (resp.length == 0) {
      $(".items-carrusel").html(`
            <div class="carousel-item active">
                <img src="../../ImagenesPublicitarias/default.png"  class="d-block w-100 " style="height:95vh; min-height:95vh" alt="...">
            </div>
           `);
      return;
    }
    img = ``
    resp.forEach((item, idx) => {
      active = ''
      if (idx == 0) {
        active = 'active'
      }
      img += `  <div class="carousel-item ${active}">
                        <img src="../../ImagenesPublicitarias/${item.URL_IMG}.png" class="d-block w-100 " style="height:95vh; min-height:95vh" alt="...">
                    </div>`
    })
    $(".items-carrusel").html(img);
  } catch (e) {
    console.error(e)
  }
}

const seleccionarOrg = async (org) => {
  CarruselItems(org);
  $("#dvSelectOrg").modal("hide");
}
visible = false
function VerPass() {
  visible = !visible;

  if (visible) {
    $("#clave").prop("type", "text");
    $("#togglePassword").removeClass("fa-eye-slash").addClass("fa-eye")
  } else {
    $("#clave").prop("type", "password");
    $("#togglePassword").removeClass("fa-eye").addClass("fa-eye-slash")
  }

}
function validarEmail(valor, tipo) {
  //valor = email a validar
  //tipo  = si se desea validar la estructura del correo o si se requiere adicional validar si esta en nuestra base.
  //        (0 == sin validacion interna || 1 = con validacion interna)
  var sw = false;
  if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(valor)) {
    if (tipo == 1) {
      $.ajax({
        url: "../models/Login.php",
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
          op: "ValidaCorreo",
          email: valor
        },
        success: function (data) {
          if (data.length > 0) {
            sw = true;
            $LOGIN = data[0].login;
            $NAME = data[0].nombres;
            $ORG = data[0].org;
          }
        }
      });
    } else {
      sw = true;
    }
  }
  return sw;
}
$(async function () {
  CargarCaptcha();
  // Inicializar el modal
  var myModal = new bootstrap.Modal(document.getElementById('dvSelectOrg'), {
    keyboard: false, // Evitar cierre con la tecla Esc
    backdrop: 'static' // Evitar cierre al hacer clic fuera del modal
  });
  //CLICK
  $("#register-submit").click(function () {
    if ($("#TxtCod_sap").val() != "") {
      if ($("#nit").val() != "") {
        if ($("#drogueria").val() != "") {
          if ($("#cedula").val() != "") {
            if ($("#nombres").val() != "") {
              if ($("#contacto").val() != "") {
                if ($("#email").val() != "") {
                  if ($("#telefono").val() != "") {
                    if (validarEmail($("#email").val(), 0)) {
                      $.ajax({
                        url: '../models/captcha/VerifCaptha.php',
                        type: 'POST',
                        dataType: 'html',
                        async: false,
                        data: {
                          "valor": $("#valorCapt").val()
                        },
                        success: function (data) {
                          //si la captcha es correcta
                          if (data == "1") {
                            nit = $("#nit").val();
                            cedula = $("#cedula").val();
                            nombres = $("#nombres").val();
                            apellidos = $("#apellidos").val();
                            codigo_sap = $("#TxtCod_sap").val();
                            correo = $("#email").val();
                            telefono = $("#telefono").val();
                            org = $("#organizacion").val(); //organizacion en la que solicita el usuario
                            oficina = $("#TxtOficina").val();
                            correo2 = $("#email2").val();
                            drogueria = $("#drogueria").val();
                            contacto = $("#contacto").val();
                            $.ajax({
                              url: "../models/Solicitudes_web.php",
                              global: false,
                              type: "POST",
                              data: ({
                                op: "INSERTAR",
                                codigo_sap: codigo_sap,
                                cedula: cedula,
                                nombres: nombres,
                                apellidos: apellidos,
                                correo: correo,
                                telefono: telefono,
                                org: org,
                                nit: nit,
                                correo2: correo2,
                                drogueria: drogueria,
                                oficina: oficina,
                                contacto: contacto
                              }),
                              dataType: "html",
                              async: false,
                              success: function (data) {
                                if (data > 0) {
                                  //swal('','','success');
                                  Swal.fire(
                                    'Correcto!',
                                    'Tu solicitud ha sido enviada satisfactoriamente!',
                                    'success'
                                  );
                                  email(codigo_sap, cedula, nombres, apellidos, correo, telefono, org, nit, correo2, drogueria, contacto);
                                  $("#register-form input").val("");
                                  $("#organizacion").html("");
                                  $("#TxtOficina").val("");
                                  $("#register-form input:not(.nit),select").attr("disabled", true);
                                  $('#login-form-link').trigger("click");
                                  $("#User").focus();
                                } else {
                                  Swal.fire(
                                    'Correcto!',
                                    'No se puedo enviar la solicitud! ' + data,
                                    'warning'
                                  );
                                }
                              }

                            }).fail(function (data) {
                              console.log(data);
                            }); //$.ajax({ |

                          } //data==1  
                          else {
                            alert("Por favor digite los caracteres de la imagen nuevamente!");
                            CargarCaptcha();
                          }
                        } //data

                      }); //ajax 
                    } //if(validarEmail)
                  } //if($("#telefono").val()!=""){
                } //if($("#email").val()!=""){
              } //if($("#apellidos").val()!=""){
            } //if($("#nombres").val()!=""){
          } //f($("#cedula").val()!=""){
        }
      } //if($("#nit").val()!=""){
    } //if($("#TxtCod_sap").val()!=""){
  });

  $("#form-login input").on('keyup', function (e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13) {
      $("#login").trigger("click")
      return;
    }
  });
  $(".btncapt").click(function () {
    CargarCaptcha();
  });
  $(".btn-org").click(function () {
    $(".btn-org").removeClass("btn-org-selected")
    $(this).addClass("btn-org-selected");
  });
  //--------Recordar Organizacion---------------------------
  var orgSelected = await leerElemento('OrgStorage');
  if (orgSelected != null && orgSelected != 'undefined') {
    //cargar el dato 
    $("#recordar").attr("checked", true).attr("disabled", false);
    texto = orgSelected == '1000' ? 'CM' : 'ROMA'
    $("#text_org").text(texto);
  } else {
    $("#dvSelectOrg").modal("show");
    $("#recordar").attr("disabled", false);
  }
  CarruselItems(orgSelected);
  $("#recordar").click(async function () {
    orgSelected = await leerElemento('OrgStorage');
    if (!$(this).is(":checked")) {
      //varifico si existe localStorage
      if (orgSelected != null && orgSelected != undefined) {
        await eliminarElemento('OrgStorage');
        $("#text_org").text('')
        $("#dvSelectOrg").modal("show");
      }
    } else {
      org = $(".btn-org-selected").attr("id").split("_").pop();
      if (org != '') {
        await crearElemento('OrgStorage', org);
      } else {
        $("#dvSelectOrg").modal("show");
      }
    }
  })
  //FOCUSOUT
  $("#nit").focusout(async function () {
    nit = $.trim($(this).val());
    if (nit != "") {
      const existe = await enviarPeticion({
        op: "VERIFICAR",
        nit,
        link: "../models/Solicitudes_web.php"
      });
      if (existe > 0) {
        Swal.fire("Alerta", "El nit " + $("#nit").val() + " , ya se encuentra asociado a una cuenta de ADG!. Por favor verifique o consulte con el administrador del sistema", "warning");
        $("#nit").val("");
        $("#nit").focus();
        return;
      }
      BuscarNit();
    } else {
      $("#register-form input:not(.nit),select").attr("disabled", true);
      $("#register-form input").val("");
      $("#organizacion").html("");
      $("#TxtOficina").val("");
      $("#nit").removeClass("NitTrue");
    }
  });
  var form_login = document.getElementById("form-login");
  var form_cambio_clave = document.getElementById("form-cambio-clave");
  var BtnLogin = document.getElementById('login');
  var BtnCambioClave = document.getElementById('cambiar_clave');
  BtnLogin.addEventListener("click", async function (event) {
    event.preventDefault();
    try {
      // Realizar la validación manual de campos requeridos
      if (!form_login.checkValidity()) {
        // Si hay campos inválidos, evitar que el formulario se envíe y mostrar los mensajes de validación
        event.preventDefault();
        event.stopPropagation();
        // Agregar la clase "was-validated" para mostrar los mensajes de validación en campos inválidos
        form_login.classList.add("was-validated");
        return;
      }
      const data = $("#form-login").serializeArrayAll();
      let dataRequest = formatearArrayRequest(data);
      recordar = false;
      data.forEach(element => {
        if (element.name == 'recordar') {
          recordar = element.value;
        }
      });
      dataRequest.recordar = recordar;
      dataRequest.op = 'ValidarUsuario'
      dataRequest.link = "../models/Login.php"
      showLoadingSwalAlert2(`<h4>Iniciando sesión</h4>`, false, true)
      resp = await enviarPeticion(dataRequest);
      if (!resp.ok) {
        Swal.fire({
          title: 'Error de Inicio de Sesión',
          text: resp.message,
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
          footer: '<a href="#" id="recoverPasswordLink" data-bs-toggle="modal" data-bs-target="#dvCambioContra">Olvidé mi contraseña</a>',
          onBeforeOpen: () => {
            const recoverLink = document.getElementById("recoverPasswordLink");
            recoverLink.addEventListener("click", (e) => {
              e.preventDefault();
              Swal.close();
            });
          }
        });
        return;
      }
      $("#IdUser").val(resp.id);
      if (resp.cambio_clave == 1) {
        dissminSwal()
        $('#dvCambioClave').modal('show');
        return;
      }
      window.location.href = "../views/Menu.php";
    } catch (e) {
      console.error(e)
      dissminSwal()
      Swal.fire("Inicio de sesión", "Ha ocurrido un error inesperado!", "error")

    }
  });

  BtnCambioClave.addEventListener("click", async function (event) {
    event.preventDefault();
    try {
      showLoadingSwalAlert2(`<h4>Cambiando clave</h4>`, false, true)
      // Realizar la validación manual de campos requeridos
      if (!form_cambio_clave.checkValidity()) {
        // Si hay campos inválidos, evitar que el formulario se envíe y mostrar los mensajes de validación
        event.preventDefault();
        event.stopPropagation();
        // Agregar la clase "was-validated" para mostrar los mensajes de validación en campos inválidos

        if ($.trim($("#NewPass1").val()).length == 0) {
          $(".msj_change_pass1").text("La clave es requerida").show("show");

        }
        if ($.trim($("#NewPass2").val()).length == 0) {
          $(".msj_change_pass2").text("La clave es requerida").show("show");

        }
        form_cambio_clave.classList.add("was-validated");
        dissminSwal();
        return;
      }

      if ($.trim($("#NewPass1").val()).length < 6) {
        dissminSwal();
        $(".msj_change_pass1").text("La longitud minima de caracteres es de 6 digitos").show();;
        return;
      }
      if ($.trim($("#NewPass2").val()).length < 6) {
        dissminSwal();
        $(".msj_change_pass2").text("La longitud minima de caracteres es de 6 digitos").show();;
        return;
      }

      if ($("#NewPass1").val() != $("#NewPass2").val()) {
        dissminSwal();
        $(".msj_change_pass_final").text("Las contraseñas son diferentes").show();;
        return;
      }

      await cambiarClave();

    } catch (e) {
      console.error(e)
      dissminSwal();
    }
  });

  $("input[class='form-control']").keyup(function () {
    $(".msj_change_pass").hide().text('')
  });
  $("#recuperar_clave").click(function () {
    if ($.trim($("#RescueEmail").val()).length == 0) {
      Swal.fire("Ups", "Debe digitar el correo de recuperación", "error")
      return;
    }
    if ($.trim($("#RescueCaptcha").val()).length == 0) {
      Swal.fire("Ups", "Debe digitar la el texto de la imagen", "error")
      return;
    }
    recuperarClave();
  });

  $("#a_recuperar").click(function () {
    $(".footer-modal-recuperacion").removeClass("d-none")
    $(".header-modal-recuperacion").removeClass("d-none")
    $(".form-recuperacion").removeClass("d-none")
    $(".img-success").addClass("d-none")
  })

})
