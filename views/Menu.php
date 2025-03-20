<?php
require("../models/funciones.php");
session_start();
Redireccionar();
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8">
  <meta name="viewport"
    content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
  <title>ADG: Adminsitración digital de la gestión</title>
  <meta name="robots" content="noindex, nofollow">
  <meta content="" name="description">
  <meta content="" name="keywords">

  <!-- Favicons -->
  <link href="../resources/icons/adg_logo.PNG" rel="icon">
  <link href="../resources/icons/adg_logo.PNG" rel="apple-touch-icon">

  <!-- Google Fonts -->

  <!-- Vendor CSS Files 
<link type="text/css" rel="stylesheet" href="../resources/bootstrap/bootstrap-5.0.2-dist/css/bootstrap.min.css">
-->

  <link href="../resources/niceadmin/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="../resources/niceadmin/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="../resources/niceadmin/assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="../resources/niceadmin/assets/vendor/quill/quill.snow.css" rel="stylesheet">
  <link href="../resources/niceadmin/assets/vendor/quill/quill.bubble.css" rel="stylesheet">
  <link href="../resources/niceadmin/assets/vendor/remixicon/remixicon.css" rel="stylesheet">
  <link href="../resources/niceadmin/assets/vendor/simple-datatables/style.css" rel="stylesheet">
  <link href="../resources/fontawesome-free-6.1.2-web/css/all.css" rel="stylesheet" />
  <!-- Template Main CSS File -->
  <link href="../resources/niceadmin/assets/css/style.css" rel="stylesheet">
  <link href="../lib/floating-button-actions/style.css" rel="stylesheet">
  <link href="../lib/SweetAlert2_V10/dist/sweetalert2.min.css" rel="stylesheet" />
  <link href="../resources/css/MenuContenido.css" rel="stylesheet" />

  <!-- =======================================================
  * Template Name: ADG
  * Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
  * Updated: Ago 09 2024 with Bootstrap v5.3.3
  * Author: ctdsas.com
  * License: 
  ======================================================== -->
</head>

<body>
  <p id="textoReconocido" style="display: none;"></p>

  <!--   modales -->

  <div class="modal fade" id="ModalEventosPromociones" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">EVENTOS & PROMOCIONES</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row mt-3">
            <div class="col-6">
              <label class="m-1">Tipo de evento </label>
              <div class="input-group"> <span class="input-group-addon" id="basic-addon1"> <i class="fa-solid fa-filter" style="width: 30px;"></i> </span>
                <select class="form-select form-select-sm" id="selTipos">
                  <option value="T">Todos</option>
                  <option value="BON">Bonificados</option>
                  <option value="DES">Descuentos</option>
                </select>
              </div>
            </div>
            <div class="col-6">
              <label class="m-1">Bonificados</label>
              <div class="input-group"> <span class="input-group-addon" id="basic-addon2"> <i class="fa-solid fa-gifts" style="width: 30px;"></i> </span>
                <input type="text" id="CantBoni" class="form-control form-control-sm" disabled readonly>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-12">
              <label class="m-1">Descuentos</label>
              <div class="input-group"> <span class="input-group-addon" id="basic-addon3"> <i class="fa fa-tags" style="width: 30px;"></i> </span>
                <input type="text" id="CantDesc" class="form-control form-control-sm" disabled readonly>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-12">
              <label class="m-1">Filtro</label>
              <div class="input-group"> <span class="input-group-addon" id="basic-addon4"> <i class="fa-solid fa-newspaper" style="width: 30px;"></i> </span>
                <input type="text" id="filtroEvento" name="filtroEvento" class="form-control form-control-sm" placeholder="Filtro por líneas..." autocomplete="off" wfd-id="id11" value>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div id="ModalBody" class="col-12"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn  btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <div class="section-modal modal fade" role="dialog" aria-hidden="true">
    <div class="mainbody-section text-center">
      <div class="row cont_bodega">
        <div class="col-md-3"></div>
        <div class="col-md-3 cont_bodega">
          <div class="menu-item bodega_select" id="div_bog1" style="background-color:#FDFDFD;"> <a href="#" data-toggle="modal"> <i class="fa fa-tags"></i>
              <p>MULTIDROGAS</p>
            </a> </div>
        </div>
        <div class="col-md-3 cont_bodega">
          <div class="menu-item bodega_select" id="div_bog2" style="background-color:#FDFDFD;"> <a href="#" data-toggle="modal"> <i class="fa fa-tags"></i>
              <p>ROMA</p>
            </a> </div>
        </div>
        <div class="col-md-3"></div>
      </div>
    </div>
  </div>
  <div class="modal fade" tabindex="-1" id="change_bodega" aria-hidden="true">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><i class="fa-solid fa-arrow-right-arrow-left"></i> Cambio de bodega</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center"> Por favor selecciona la bodega en la que deseas trabajar. <br>
          <div class="row mt-3 ">
            <div class="col-6  p-2 "> <img src="../resources/images/LogoCM.png" onClick="cambiarOrg(1000,this,2)" class="img-fluid seleccion-bodega"> </div>
            <div class="col-6  p-2"> <img src="../resources/images/LogoRoma.png" onClick="cambiarOrg(2000,this,2)" class="img-fluid seleccion-bodega"> </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End Small Modal-->

  <!--  tratamiento de datos -->
  <div class="modal fade" id="dvActualizarDatos" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">SE REQUIERE ACTUALIZACIÓN DE DATOS PARA CONTINUAR</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="FormUpdate" action="" onSubmit="return false">
            <table width="100%" class="form" cellspacing="5" cellpadding="5">
              <tbody>
                <tr>
                  <td><b>LOGIN</b></td>
                  <td><input type="text" id="UPD_Login" class="form-control" readonly></td>
                </tr>
                <tr>
                  <td><b>NOMBRES</b></td>
                  <td><input type="text" id="UPD_Nombres" class="form-control" readonly></td>
                </tr>
                <tr>
                  <td><b>EMAIL</b></td>
                  <td><input type="email" id="UPD_Email" class="form-control" required></td>
                </tr>
                <tr>
                  <td><b>CELULAR</b></td>
                  <td><input type="text" id="UPD_Celular" class="form-control" required></td>
                </tr>
                <tr>
                  <td><b>FECHA NACIMIENTO</b></td>
                  <td><input type="text" id="UPD_Fhnace" class="form-control" placeholder="AAAA-MM-DD" required></td>
                </tr>
                <tr>
                  <td><b>SEXO</b></td>
                  <td><select class="form-control" id="UPD_Sexo" name="UPD_Sexo" required>
                      <option value="M">MASCULINO</option>
                      <option value="F">FEMENINO</option>
                      <option value="P" selected>PREFIERO NO DECIRLO</option>
                    </select></td>
                </tr>
                <tr>
                  <td><b>HIJOS</b></td>
                  <td><select name="UPD_Hijos" id="UPD_Hijos" class="form-control" required>
                      <option value="S">SI</option>
                      <option value="N" selected>NO</option>
                    </select></td>
                </tr>
                <tr>
                  <td colspan="2"><b>Habeas Data</b>
                    <textarea style="text-align:justify" class="form-control" id="txtHabeasData" rows="4" readonly></textarea>
                  </td>
                </tr>
                <tr>
                  <td colspan="2"><label for="UPD_Habeas"><b>Acepta politicas de Habeas Data para manejo de datos</b></label>
                    <input type="checkbox" id="UPD_Habeas" name="UPD_Habeas" required>
                  </td>
                </tr>
                <tr>
                  <td colspan="2"><b>Políticas de devoluciones</b>
                    <textarea style="text-align:justify" class="form-control" id="txtPoliticaDevolucion" rows="4" readonly></textarea>
                  </td>
                </tr>
                <tr>
                  <td colspan="2"><label for="UPD_Devolucion"><b>Acepta políticas de devoluciones</b></label>
                    <input type="checkbox" id="UPD_Devolucion" name="UPD_Devolucion" required>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-outline-success">Enviar</button>
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
        </form>
      </div>
    </div>
  </div>
  <!-- End Large Modal-->

  <div class="modal fade" id="CambiarCont" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Cambio de clave de acceso</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <table class="table table-sm table-striped" width="100%" align="center">
            <tbody>
              <tr>
                <th colspan="2" class="bg-primary text-white">Datos Basicos</th>
              </tr>
              <tr>
                <td>Ultimo ingreso</td>
                <td><span>
                    <?php if (!empty($_SESSION["ses_Ingreso"])) {
                      echo utf8_encode($_SESSION["ses_Ingreso"]);
                    } ?>
                  </span></td>
              </tr>
              <tr>
                <td>Usuario</td>
                <td><span>
                    <?php if (!empty($_SESSION["ses_Login"])) {
                      echo ($_SESSION["ses_Login"]);
                    } ?>
                  </span></td>
              </tr>
              <tr>
                <td>Nombres</td>
                <td><span>
                    <?php if (!empty($_SESSION["ses_Usuario"])) {
                      echo utf8_encode($_SESSION["ses_Usuario"]);
                    } ?>
                  </span></td>
              </tr>
              <tr>
                <td>Email</td>
                <td><span>
                    <?php if (!empty($_SESSION["ses_Email"])) {
                      echo utf8_encode($_SESSION["ses_Email"]);
                    } ?>
                  </span></td>
              </tr>
              <tr>
                <th colspan="2" class="bg-primary text-white">Cambiar Contraseña</th>
              </tr>
              <tr>
                <td>Contraseña Actual*</td>
                <td><input type="password" class="form-control form-control-sm" id="passact">
                  <div class="passact-invalid-feedback invalid-feedback "> Por favor digita su clave actual. </div>
                </td>
              </tr>
              <tr>
                <td>Nueva Contraseña*</td>
                <td><input type="password" class="form-control form-control-sm" id="passnew">
                  <div class="passnew-invalid-feedback invalid-feedback "> Por favor digita la nueva clave. </div>
                </td>
              </tr>
              <tr>
                <td>Confirmar Contraseña*</td>
                <td><input type="password" class="form-control form-control-sm" id="passconf">
                  <div class="passconf-invalid-feedback invalid-feedback "> Por favor confirma la nueva clave. </div>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <h4 style="border:1px solid #F0C2C3; background-color:#EB999B;color:#ffffff; padding:5px; font-size:10px; font:'Gill Sans', 'Gill Sans MT', 'Myriad Pro', 'DejaVu Sans Condensed', Helvetica, Arial, sans-serif;">*RECUERDE QUE AL CAMBIAR LA CONTRASEÑA SE CERRARÁ AUTOMATICAMENTE LA SESIÓN DEL SISTEMA*</h4>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
          <button class="btn btn-outline-success" id="guardarpass">Guardar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- End Large Modal-->

  <div class="modal fade" id="ModalUsuarioPerfil" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Datos de perfil</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="card">
                <div class="card-body profile-card pt-4 d-flex flex-column align-items-center"> <img id="profile-avatar" src="https://img.freepik.com/foto-gratis/ilustracion-3d-hombre-negocios-gafas-sobre-fondo-gris_1142-58140.jpg?w=740&t=st=1726059978~exp=1726060578~hmac=73120d3d78d9b7e58fcf3103a50de72a8328fe0b7ead804315ca54a19a962688" height="80" width="80" class="rounded-circle">
                  <h2 id="profile-usuario"></h2>
                  <h3 id="profile-rol"></h3>
                  <div class="social-links mt-2"> <a href="#" class="twitter"><i class="bi bi-twitter"></i></a> <a href="#" class="facebook"><i class="bi bi-facebook"></i></a> <a href="#" class="instagram"><i class="bi bi-instagram"></i></a> <a href="#" class="linkedin"><i class="bi bi-linkedin"></i></a> </div>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="card">
                <div class="card-body pt-3">
                  <!-- Bordered Tabs -->
                  <ul class="nav nav-tabs nav-tabs-bordered">
                    <li class="nav-item">
                      <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Info general</button>
                    </li>
                    <!--
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Editar datos</button>
            </li>

            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-settings">Settings</button>
            </li>
 
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Cambiar Clave</button>
            </li>
               -->
                  </ul>
                  <div class="tab-content pt-2">
                    <div class="tab-pane fade show active profile-overview" id="profile-overview">
                      <h5 class="card-title">Acerca de mí</h5>
                      <p class="small fst-italic">
                        <textarea class="form-control alert-warning" row="6"></textarea>
                      </p>
                      <h5 class="card-title">Detalle</h5>
                      <div class="row">
                        <div class="col-lg-3 col-md-4 label ">Nombre completo</div>
                        <div class="col-lg-9 col-md-8" id="profile-full-name"></div>
                      </div>
                      <div class="row mb-1">
                        <div class="col-lg-3 col-md-4 label">Organización y oficina</div>
                        <div class="col-lg-9 col-md-8" id="profile-org-ofi"></div>
                      </div>
                      <div class="row mb-1">
                        <div class="col-lg-3 col-md-4 label">Cargo</div>
                        <div class="col-lg-9 col-md-8" id="profile-cargo"></div>
                      </div>
                      <div class="row mb-1">
                        <div class="col-lg-3 col-md-4 label">Pais</div>
                        <div class="col-lg-9 col-md-8">Colombia</div>
                      </div>
                      <div class="row mb-1">
                        <div class="col-lg-3 col-md-4 label">Dirección</div>
                        <div class="col-lg-9 col-md-8" id="profile-direccion"></div>
                      </div>
                      <div class="row mb-1">
                        <div class="col-lg-3 col-md-4 label">Teléfono</div>
                        <div class="col-lg-9 col-md-8" id="profile-telefonos"></div>
                      </div>
                      <div class="row mb-1">
                        <div class="col-lg-3 col-md-4 label">Email</div>
                        <div class="col-lg-9 col-md-8" id="profile-email"></div>
                      </div>
                    </div>
                    <div class="tab-pane fade profile-edit pt-3" id="profile-edit">

                      <!-- Profile Edit Form -->
                      <form>
                        <div class="row mb-3">
                          <label for="profileImage" class="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                          <div class="col-md-8 col-lg-9">
                            <!--          <img src="assets/img/profile-img.jpg" alt="Profile">-->
                            <div class="pt-2"> <a href="#" class="btn btn-primary btn-sm" title="Upload new profile image"><i class="bi bi-upload"></i></a> <a href="#" class="btn btn-danger btn-sm" title="Remove my profile image"><i class="bi bi-trash"></i></a> </div>
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Full Name</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="fullName" type="text" class="form-control" id="fullName" value="Kevin Anderson">
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="about" class="col-md-4 col-lg-3 col-form-label">About</label>
                          <div class="col-md-8 col-lg-9">
                            <textarea name="about" class="form-control" id="about" style="height: 100px">Sunt est soluta temporibus accusantium neque nam maiores cumque temporibus. Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum quae quisquam autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde.</textarea>
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="company" class="col-md-4 col-lg-3 col-form-label">Company</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="company" type="text" class="form-control" id="company" value="Lueilwitz, Wisoky and Leuschke">
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="Job" class="col-md-4 col-lg-3 col-form-label">Job</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="job" type="text" class="form-control" id="Job" value="Web Designer">
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="Country" class="col-md-4 col-lg-3 col-form-label">Country</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="country" type="text" class="form-control" id="Country" value="USA">
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="Address" class="col-md-4 col-lg-3 col-form-label">Address</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="address" type="text" class="form-control" id="Address" value="A108 Adam Street, New York, NY 535022">
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="Phone" class="col-md-4 col-lg-3 col-form-label">Phone</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="phone" type="text" class="form-control" id="Phone" value="(436) 486-3538 x29071">
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="Email" class="col-md-4 col-lg-3 col-form-label">Email</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="email" type="email" class="form-control" id="Email" value="k.anderson@example.com">
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="Twitter" class="col-md-4 col-lg-3 col-form-label">Twitter Profile</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="twitter" type="text" class="form-control" id="Twitter" value="https://twitter.com/#">
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="Facebook" class="col-md-4 col-lg-3 col-form-label">Facebook Profile</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="facebook" type="text" class="form-control" id="Facebook" value="https://facebook.com/#">
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="Instagram" class="col-md-4 col-lg-3 col-form-label">Instagram Profile</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="instagram" type="text" class="form-control" id="Instagram" value="https://instagram.com/#">
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="Linkedin" class="col-md-4 col-lg-3 col-form-label">Linkedin Profile</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="linkedin" type="text" class="form-control" id="Linkedin" value="https://linkedin.com/#">
                          </div>
                        </div>
                        <div class="text-center">
                          <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                      </form>
                      <!-- End Profile Edit Form -->

                    </div>
                    <div class="tab-pane fade pt-3" id="profile-settings">

                      <!-- Settings Form -->
                      <form>
                        <div class="row mb-3">
                          <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Email Notifications</label>
                          <div class="col-md-8 col-lg-9">
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" id="changesMade" checked>
                              <label class="form-check-label" for="changesMade"> Changes made to your account </label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" id="newProducts" checked>
                              <label class="form-check-label" for="newProducts"> Information on new products and services </label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" id="proOffers">
                              <label class="form-check-label" for="proOffers"> Marketing and promo offers </label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" id="securityNotify" checked disabled>
                              <label class="form-check-label" for="securityNotify"> Security alerts </label>
                            </div>
                          </div>
                        </div>
                        <div class="text-center">
                          <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                      </form>
                      <!-- End settings Form -->

                    </div>
                    <div class="tab-pane fade pt-3" id="profile-change-password">
                      <!-- Change Password Form -->
                      <form>
                        <div class="row mb-3">
                          <label for="currentPassword" class="col-md-4 col-lg-3 col-form-label">Current Password</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="password" type="password" class="form-control" id="currentPassword">
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="newPassword" class="col-md-4 col-lg-3 col-form-label">New Password</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="newpassword" type="password" class="form-control" id="newPassword">
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="renewPassword" class="col-md-4 col-lg-3 col-form-label">Re-enter New Password</label>
                          <div class="col-md-8 col-lg-9">
                            <input name="renewpassword" type="password" class="form-control" id="renewPassword">
                          </div>
                        </div>
                        <div class="text-center">
                          <button type="submit" class="btn btn-primary">Change Password</button>
                        </div>
                      </form>
                      <!-- End Change Password Form -->

                    </div>
                  </div>
                  <!-- End Bordered Tabs -->

                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- End Large Modal-->

  <div class="modal fade modal_list_evaluaciones_pendientes" id="ExtralargeModal" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Evaluacione de desempeño</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="result_list_evaluaciones_pendientes table-responsive-md" style="padding: 10px"> </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- End Extra Large Modal-->

  <div class="modal fade" id="ModalTicket" tabindex="-1">
    <div class="modal-dialog modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ticket de soporte</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div id="formulario-ticket"></div>
          <input type="hidden" class="_tsk_prioridad" readonly value="0">
          <div class="row">
            <label class="mb-1">Categoria</label>
            <div class="input-group mb-3"> <span class="input-group-text" id="basic-addon1"> <i class="fa-solid fa-list-check"></i> </span>
              <select class="form-select" id="_tsk_categorias">
              </select>
            </div>
          </div>
          <div class="row">
            <label class="mb-1">Sub.categoria</label>
            <div class="input-group mb-3"> <span class="input-group-text" id="basic-addon1"> <i class="fa-solid fa-bars-staggered"></i> </span>
              <select class="form-select" id="_tsk_sub-categorias">
              </select>
            </div>
          </div>
          <div class="row">
            <label class="mb-1">Descripción</label>
            <div class="input-group mb-3"> <span class="input-group-text" id="basic-addon1"> <i class="fa-solid fa-audio-description"></i> </span>
              <textarea class="form-control" rows="5" id="_tsk_descripcion"> </textarea>
            </div>
          </div>
          <lable>Ctrl+v para pegar la imagen</lable>
          <div class="row">
            <div class="col">
              <div class="input-group mb-3">
                <canvas class="_tsk_mycanvas" style="border:1px solid grey;height:100px; width:100%" id="mycanvas" title="PRESIONA CTRL+V"></canvas>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button class="btn btn-sm btn-danger" id="btn-borrar-canvas" style="display:none" onclick="BorrarImg()">Eliminar imagen</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" id="guardar-ticket" class="btn btn-outline-primary">Guardar ticket</button>
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- End Small Modal-->

  <div class="modal fade" id="ModalActividades" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">FUNCION ACTUAL -- Seleccione el nuevo estado de sus labores ---</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="ContenidoEstado">
          <div id="body_estados" class="card-icon-content border border-1 border-black" style="height:auto;"></div>
        </div>
        <div class="modal-footer">
          <button type="button" id="Guarda_estado" class="btn btn-outline-primary">Guardar</button>
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- End Extra Large Modal-->

  <div class="modal fade" id="ModalMesaAyuda" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Mesa de ayuda de ADG</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body"> </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  <!-- End Extra Large Modal-->

  <div class="modal fade p-0 m-0 border-0 vh-100" id="modal_dtos_exclusivos" tabindex="-1" style="z-index:99999999">
    <div class="modal-dialog modal-xl p-0 border-0" style="background-color:transparent" style="z-index:999999999">
      <div class="modal-content2 p-0  " style="background-color:transparent; width:auto">
        <div class="modal-header p-0 border-0" style="background-color:transparent">
          <button type="button" class="btn text-light"></button>
        </div>
        <div class="modal-body m-0 p-0 border-0 d-flex align-content-center justify-content-center border-3 border border-warning">
          <div class=" position-relative m-2"> <span class="position-absolute top-0 start-100 translate-middle btn badge rounded-pill bg-danger" data-bs-dismiss="modal" aria-label="Close" style="cursor:poiner"> <i class="fa fa-close fa-2x"></i> </span> <img class=" img-fluid" style="height: 100vh;" id="img-descuentos-mes" src="" /> </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End Full Screen Modal-->

  <!-- Modal Registro -->
  <div class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">SOLICITUD DE REGISTRO PLAN PUNTOS TRANSFERENCISTAS</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
        </div>
        <div class="modal-body">
          <form id="register-trans-form" action="" role="form" enctype="multipart/form-data" onsubmit="return false;">
            <div class="card">
              <div class="card-header alert-info">
                <h5 class="card-title">DATOS DEL TRANSFERENCISTA</h5>
              </div>
              <div class="card-body">
                <!-- Existing form fields -->

                <div class="form-group">
                  <input type="text" name="laboratorio" id="laboratorio" tabindex="1" class="form-control nit" placeholder="Laboratorio" value="" required>
                </div>
                <div class="form-group">
                  <input type="text" name="usuario_trans" id="usuario_trans" tabindex="2" value="<?php if (!empty($_SESSION["ses_Login"])) {
                                                                                                    echo ($_SESSION["ses_Login"]);
                                                                                                  } ?>" class="form-control" placeholder="Usuario del transferencista" readonly required>
                </div>
                <div class="form-group">
                  <input type="text" name="nombres_trans" id="nombres_trans" tabindex="3" class="form-control" placeholder="Nombres" onKeyPress="return vletras_espacios(event)" required>
                </div>
                <div class="form-group">
                  <input type="text" name="apellido_trans" id="apellido_trans" tabindex="4" class="form-control" placeholder="Apellidos" onKeyPress="return vletras_espacios(event)" required>
                </div>
                <div class="form-group">
                  <input type="number" name="cedula_trans" id="cedula_trans" tabindex="5" class="form-control" placeholder="Cédula" onKeyPress="return exclusion(event)" value="" required>
                </div>
                <div class="form-group">
                  <input type="number" name="celular_trans" id="celular_trans" tabindex="6" class="form-control" placeholder="Celular" onKeyPress="return exclusion(event)" value="" required>
                </div>
                <div class="form-group">
                  <input type="email" name="email" id="email" tabindex="7" class="form-control" placeholder="Email" onKeyPress="return exclusion(event)" value="" required>
                </div>
                <div class="form-group">
                  <input type="text" name="direccion_trans" id="direccion_trans" tabindex="8" class="form-control" placeholder="Dirección" value="" required>
                </div>
                <div class="form-group">
                  <input type="text" name="ciudad_trans" id="ciudad_trans" tabindex="9" class="form-control" placeholder="Ciudad" value="" required>
                </div>

                <!-- New file input -->
                <div class="form-group">
                  <input type="file" name="fileInput" id="fileInput" tabindex="10" class="form-control" required>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
          <button type="submit" onclick="guardar_registro_transferencista()" class="btn btn-info">Enviar</button>
        </div>
      </div>
    </div>
  </div>

  <!--  ****************************************************** -->

  <!-- ======= Header ======= -->
  <header id="header" class="header pt-3 fixed-top d-flex align-items-center bg-bg-secondary-subtle" style="background-color: #d5e1f0;">
    <div class="d-flex align-items-center justify-content-between ">
      <div class="logo_center" style="cursor:pointer" onclick="">A.D.G</div>
    </div>
    <!-- End Logo -->

    <nav class="header-nav ms-auto ">
      <ul class="d-flex align-items-center ul-header">
        <li class="nav-item dropdown pe-3 d-xl-none d-md-none d-lg-none d-sm-none "> <a class=" d-flex align-items-center flex-column pe-0 position-relative " href="#" data-bs-toggle="dropdown"> <i class="fa-solid fa-ellipsis-vertical m-2" style="font-size: 1.4rem;"></i> </a>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
            <li class="li_eventos_reuniones"> <a class="dropdown-item d-flex align-items-center"> <i class="fa-solid fa-users"></i> <span class="position-absolute top-0 start-100 translate-middle badge  bg-primary n_eventos_reuniones"
                  style="font-size: 0.5; margin-left:-30px ; margin-top:20px"> 0 </span> <span>Reunión</span> </a> </li>
            <li class="" onclick="viewInTableEvaluacionesPendientes(40,<?php echo  $_SESSION["ses_Id"];  ?>)"> <a class="dropdown-item d-flex align-items-center"> <i class="fa-regular fa-pen-to-square"></i> <span>Evaluaciones &nbsp;<span class="badge bg-primary n_evaluaciones_desempenio"></span></span> </a> </li>
            <li class="li_solicitudes_ing"> <a class="dropdown-item d-flex align-items-center"> <i class="bi bi-truck"></i> <span>Ingresos <span class="badge bg-primary n_solicitudes_ing"></span></span> </a> </li>
            <li> <a class="dropdown-item d-flex align-items-center start-recording"> <i class="fa-solid fa-microphone-slash"></i> <span class="status">Inactivo &nbsp;<span class=" badge bg-primary"></span></span> </a> </li>
          </ul>
        </li>
        <li class="nav-item dropdown pe-3  li_solicitudes_ing " style="display: none;"> <a class=" d-flex align-items-center flex-column pe-0 position-relative" href="#" data-bs-toggle="dropdown"> <i class="	fa fa-truck" style="font-size: 1.4rem;"> </i> <span class="position-absolute top-0 start-100 translate-middle badge  bg-primary n_solicitudes_ing "
              style="font-size: 0.5; margin-left: -20px; padding: 5px; margin-top: 2px; "> 0 </span>
            <p class="d-none d-sm-inline d-md-inline d-lg-inline"> Ingresos </p>
          </a> </li>
          <li class="nav-item dropdown pe-3 d-none" id="itemNotiworkFlow"> 
            <a class="d-flex align-items-center flex-column pe-0" data-bs-toggle="dropdown"> 
              <i class="fa-solid fa-bullhorn text-warning " style="font-size: 1.4rem;"></i> 
              <span class="position-absolute top-0 start-100 translate-middle badge  bg-primary"
              style="font-size: 0.5; margin-left: -30px; padding: 5px; margin-top: 2px;" id="notiworkFlow">0
              </span>
            <p class="d-none d-sm-inline d-md-inline d-lg-inline">WorkFlow</p>
          </a> 
         </li>
        <li class="nav-item dropdown pe-3  " id="li_microfono"> <a class=" d-flex align-items-center flex-column pe-0 position-relative  start-recording" href="#" data-bs-toggle="dropdown"> <i class="fa-solid fa-microphone-slash" style="font-size: 1.4rem;"></i>
            <p class="d-none d-sm-inline d-md-inline d-lg-inline status">Inactivo</p>
          </a> </li>
        <li class="nav-item dropdown pe-3  li_evaluaciones_desempenio" id="li_evaluaciones"> <a class=" d-flex align-items-center flex-column pe-0 position-relative" href="#" data-bs-toggle="dropdown"> <i class="fa-regular fa-pen-to-square" style="font-size: 1.4rem;"></i> <span class="position-absolute top-0 start-100 translate-middle badge  bg-primary n_evaluaciones_desempenio"
              style="font-size: 0.5; margin-left: -20px; padding: 5px; margin-top: 2px; "> 0 </span>
            <p class="d-none d-sm-inline d-md-inline d-lg-inline "> Evaluación </p>
          </a>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow list-group-evaluaciones">
          </ul>
        </li>
        <li class="nav-item dropdown pe-3  li_eventos_reuniones" style="display: none;"> <a class="d-flex align-items-center flex-column pe-0 " href="#" data-bs-toggle="dropdown"> <i class="fa-solid fa-users" style="font-size: 1.4rem;"></i> <span class="position-absolute top-0 start-100 translate-middle badge  bg-primary n_eventos_reuniones"
              style="font-size: 0.5; margin-left: -30px; padding: 5px; margin-top: 2px;"> 0 </span>
            <p class="d-none d-sm-inline d-md-inline d-lg-inline">Reunión</p>
          </a>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow  list-eventos-adg">
          </ul>
        </li>
        <li class="nav-item dropdown pe-3 "> <a class=" d-flex align-items-center flex-column pe-0" onClick="ListarEvento(1);" data-bs-toggle="dropdown"> <i class="fa-solid fa-bullhorn text-warning " style="font-size: 1.4rem;"></i> <span class="position-absolute top-0 start-100 translate-middle badge  bg-primary n_eventos_comerciales"
              style="font-size: 0.5; margin-left: -30px; padding: 5px; margin-top: 2px; display: none;">0 </span>
            <p class="d-none d-sm-inline d-md-inline d-lg-inline">Eventos</p>
          </a> 
        </li>
        <li class="nav-item dropdown pe-3"
          <?php
          if ($_SESSION["ses_RolesId"] == 1 ||  $_SESSION["ses_RolesId"]  == 125) {
            echo  ' data-bs-toggle="modal" data-bs-target="#change_bodega"';
          }
          ?>> <a class="d-flex align-items-center flex-column pe-0" href="#" data-bs-toggle="dropdown"> <i class="fa-solid fa-map-location-dot" style="font-size: 1.4rem;"></i>
            <?php
            if ($_SESSION["ses_NumOrg"] == 1000) {
              echo ' <p id="Org_select" class="d-none d-sm-inline d-md-inline d-lg-inline">Cm</p>';
            } else {
              echo ' <p id="Org_select" class="d-none d-sm-inline d-md-inline d-lg-inline">Roma</p>';
            }
            ?>
            <!-- <span class="d-none d-md-block dropdown-toggle ps-2">K. Anderson</span>-->
          </a><!-- End Profile Iamge Icon -->
        </li>
        <!-- End Profile Nav -->

        <li class="nav-item dropdown pe-3 "> <a class=" d-flex align-items-center flex-column pe-0" href="#" data-bs-toggle="dropdown"> <i class="fa-solid fa-user" style="font-size: 1.4rem;"></i>
            <?php
            if (!empty($_SESSION["ses_Login"])) {
              echo ' <p class="d-none d-sm-inline d-md-inline d-lg-inline">' . ucfirst(strtolower(($_SESSION["ses_Login"]))) . '</p>';
            } else {
              echo ' <p class="d-none d-sm-inline d-md-inline d-lg-inline"></p>';
            }
            ?>
          </a>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
            <li> <a class="dropdown-item d-flex align-items-center btn" data-bs-toggle="modal" data-bs-target="#CambiarCont"> <i class="bi bi-key text-danger"></i> <span>Cambio de clave</span> </a> </li>
            <li> <a class="dropdown-item d-flex align-items-center btn" data-bs-toggle="modal" data-bs-target="#ModalUsuarioPerfil"> <i class="bi bi-file-person text-success "></i> <span>Mi perfil</span> </a> </li>
            <!-- <li>
                <a class="dropdown-item d-flex align-items-center btn"  data-bs-toggle="modal" data-bs-target="#ModalMesaAyuda">
                    <i class="fa-solid fa-circle-question text-primary"></i>
                    <span>Mesa de ayuda?</span>
                </a>
               </li>-->
            <li> <a class="dropdown-item d-flex align-items-center btn" data-bs-toggle="modal" data-bs-target="#ModalTicket"> <i class="fa-solid fa-headset text-danger"></i> <span>Soporte tecnico?</span> </a> </li>
            <li> <a class="dropdown-item d-flex align-items-center btn floatingButton" data-bs-toggle="modal" data-bs-target="#ModalActividades"> <i class="fa-solid fa-chalkboard-user"></i> <span>Actividad actual?</span> </a> </li>
          </ul>
        </li>
        <li class="nav-item dropdown pe-3 "> <a class="text-center  d-flex align-items-center justify-content-center flex-column" id="a_cerrar_all" href="#" data-bs-toggle="dropdown"> <i class="fa-solid fa-power-off text-danger " style="font-size: 1.4rem;"></i>
            <p class="d-none d-sm-inline d-md-inline d-lg-inline">Salir</p>
          </a> </li>
      </ul>
    </nav>
    <!-- End Icons Navigation -->

  </header>

  <main class="d-flex align-content-center justify-content-center" style=" margin-top:120px; width: 100% !important; margin-left:none !important; padding-left:none !important">
    <div class="row container d-flex  align-content-center justify-content-center " id="list-grupos">
      <div class="row container d-flex  align-items-center justify-content-center align-items-start h-auto " id="list-modulos">
        <h1 class="text-center " style="margin-top:100px"><i class="fa-solid fa-circle-notch fa-spin "></i></h1>
      </div>
    </div>
  </main>

  <!-- Vendor JS Files -->
  <input type="hidden" value="<?php if (!empty($_SESSION["ses_Calle"])) {
                                echo  $_SESSION["ses_Calle"];
                              } ?>" id="Calle" readonly />
  <input type="hidden" value="<?php if (!empty($_SESSION["ses_DepId"])) {
                                echo  $_SESSION["ses_DepId"];
                              } ?>" id="DepId" readonly />
  <input type="hidden" value="<?php if (!empty($_SESSION["ses_Id"])) {
                                echo  $_SESSION["ses_Id"];
                              } ?>" id="IdUser" readonly />
  <input type="hidden" value="<?php if (!empty($_SESSION["ses_RolesId"])) {
                                echo  $_SESSION["ses_RolesId"];
                              } ?>" id="Rol" readonly />
  <input type="hidden" value="<?php if (!empty($_SESSION["ses_NumOrg"])) {
                                echo  $_SESSION["ses_NumOrg"];
                              } ?>" id="org" readonly />
  <input type="hidden" value="<?php if (!empty($_SESSION["ses_NitPro"])) {
                                echo  $_SESSION["ses_NitPro"];
                              } ?>" id="NIT_PT" readonly />
  <input type="hidden" value="<?php if (!empty($_SESSION["ses_OfcVentas"])) {
                                echo  $_SESSION["ses_OfcVentas"];
                              } ?>" id="TxtOficina" readonly />
  <input type="hidden" value="<?php if (!empty($_SESSION["ses_Login"])) {
                                echo  $_SESSION["ses_Login"];
                              } ?>" id="login_user" readonly />
  <input type="hidden" value="<?php if (!empty($_SESSION["ses_Id_Ses"])) {
                                echo  $_SESSION["ses_Id_Ses"];
                              } ?>" id="ses_id" readonly />
  <script type="text/javascript" src="../resources/plugins/jquery/jquery.min.js"></script>
  <script type="text/javascript" src="../resources/plugins/jquery-ui/jquery-ui.js"></script>
  <script src="../resources/niceadmin/assets/vendor/apexcharts/apexcharts.min.js"></script>
  <script src="../resources/niceadmin/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <!-- <script type="text/javascript" src="../resources/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.min.js?<?php echo (rand()); ?>"></script>-->
  <!-- <script src="../resources/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>-->
  <script src="../resources/niceadmin/assets/vendor/chart.js/chart.umd.js"></script>
  <script src="../resources/niceadmin/assets/vendor/echarts/echarts.min.js"></script>
  <script src="../resources/niceadmin/assets/vendor/quill/quill.js"></script>
  <script src="../resources/niceadmin/assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="../resources/niceadmin/assets/vendor/tinymce/tinymce.min.js"></script>
  <script src="../resources/niceadmin/assets/vendor/php-email-form/validate.js"></script>
  <script src="../lib/floating-button-actions/main.js"></script>
  <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/Isa.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/SweetAlert2_V10/dist/sweetalert2.min.js"></script>
  <script type="text/javascript" src="../lib/ticket-form/main.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/notificaciones-push/notificaciones-push.js?<?php echo rand(); ?>"></script>
  <!-- Template Main JS File -->
  <script src="../resources/niceadmin/assets/js/main.js"></script>
  <script src="../controllers/Menu.js?<?php echo (rand()); ?>"></script>
</body>

</html>