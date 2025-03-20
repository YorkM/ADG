<?php
require( "../models/funciones.php" );
session_start();
Redireccionar();
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>ADG:Administración digital de la gestión</title>
  <meta name="robots" content="noindex, nofollow">
  <meta content="" name="description">
  <meta content="" name="keywords">
  <!-- Favicons -->
  <link href="../resources/icons/adg_logo.PNG" rel="icon">
  <link href="../resources/icons/adg_logo.PNG" rel="apple-touch-icon">
  <!-- Google Fonts -->
  <link href="https://fonts.gstatic.com" rel="preconnect">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">
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

  <style>


    .p-nav-on{
        display: none !important;
    }
    .i-nav-on{
        font-size: 1.2rem !important;
        margin-top: -30px;
    }

  </style>
</head>
<body>
<input type="hidden" value="<?php if(!empty($_SESSION["ses_DepId"]))  {echo  $_SESSION["ses_DepId"]; }?>"    id="DepId"  readonly />
<input type="hidden" value="<?php if(!empty($_SESSION["ses_Id"]))     {echo  $_SESSION["ses_Id"]; }?>"       id="IdUser" readonly />
<input type="hidden" value="<?php if(!empty($_SESSION["ses_RolesId"])){echo  $_SESSION["ses_RolesId"];} ?>"  id="Rol"    readonly />
<input type="hidden" value="<?php if(!empty($_SESSION["ses_NumOrg"])) {echo  $_SESSION["ses_NumOrg"];} ?>"   id="org"    readonly/>
<input type="hidden" value="<?php if(!empty($_SESSION["ses_OfcVentas"])) {echo $_SESSION["ses_OfcVentas"];} ?>"   id="oficina"    readonly/>	
<input type="hidden" value="<?php if(!empty($_GET["mod"])){ echo $_GET["mod"];}else{echo 0;} ?>" id="grupo" readonly>
<input type="hidden" value="<?php if(!empty($_GET["eve"])){ echo $_GET["eve"];}else{echo 0;} ?>" id="AbrirVentas" readonly>
<input type="hidden" value="<?php if(!empty($_GET["tipoeve"])){ echo $_GET["tipoeve"];}else{echo 0;} ?>" id="AbrirVentasTipo" readonly>
<input type="hidden" value="" id="clase" readonly />
<input type="hidden" value="<?php if(!empty($_GET["abrir_mod_auto"]))  {echo  $_GET["abrir_mod_auto"]; }?>"    id="abrir_mod_auto"  readonly />  

<!-- ======= Header ======= -->
<header id="header" class="header pt-3 fixed-top d-flex align-items-center bg-bg-secondary-subtle" style="background-color: #d5e1f0;">

<div class="d-flex align-items-center justify-content-between ">
    <div class="logo_center" style="cursor:pointer"  onclick="volver()">A.D.G</div>
</div><!-- End Logo -->

<nav class="header-nav ms-auto ">
<ul class="d-flex align-items-center ul-header">

    <li class="nav-item dropdown pe-3   d-md-inline d-lg-inline d-xl-inline d-xs-inline" onclick="volver()" >
       <a class=" d-flex align-items-center flex-column pe-0 position-relative  "   href="#"  data-bs-toggle="dropdown">
         <i class="fa-solid fa-arrow-left-long" style="font-size: 1.4rem;"></i>
         <p class="d-none d-sm-inline d-md-inline d-lg-inline status p-nav-off" >Atrás</p>
       </a>
    </li>

<li class="nav-item dropdown pe-3 d-xl-none d-md-none d-lg-none d-xs-inline" >
           <a class=" d-flex align-items-center flex-column pe-0 position-relative "   href="#"  data-bs-toggle="dropdown">   
             <i class="fa-solid fa-ellipsis-vertical m-2" style="font-size: 1.4rem;"></i>
           </a>
           <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages" >

                <li>
                    <a class="dropdown-item d-flex align-items-center start-recording">
                        <i class="fa-solid fa-microphone-slash "></i>
                        <span class="status">Inactivo &nbsp;<span class=" badge bg-primary"></span></span>
                    </a>
                </li>
            </ul>
        </li>
        
    <li class="nav-item dropdown pe-3  d-none d-md-inline d-lg-inline d-xl-inline d-xs-none" >
       <a class=" d-flex align-items-center flex-column pe-0 position-relative  start-recording"   href="#"  data-bs-toggle="dropdown">
         <i class="fa-solid fa-microphone-slash i-nav-off"  style="font-size: 1.4rem;"></i>
         <p class="d-none d-sm-inline d-md-inline d-lg-inline status p-nav-off" >Inactivo</p>
       </a>
    </li>


    <li class="nav-item dropdown pe-3"
        <?php 
         if (  $_SESSION[ "ses_RolesId" ] ==1 ||  $_SESSION[ "ses_RolesId" ]  ==125 ) {
          echo  ' data-bs-toggle="modal" data-bs-target="#change_bodega"';
        }
        ?>
        
      >
      <a class="d-flex align-items-center flex-column pe-0" href="#" data-bs-toggle="dropdown">
        <i class="fa-solid fa-map-location-dot i-nav-off" style="font-size: 1.4rem;"></i>
        <?php
            if ( $_SESSION[ "ses_NumOrg" ] == 1000 ) {
                echo ' <p id="Org_select" class="d-none d-sm-inline d-md-inline d-lg-inline p-nav-off">Cm</p>';
            }else{
                echo  ' <p id="Org_select" class="d-none d-sm-inline d-md-inline d-lg-inline p-nav-off">Roma</p>';
            }
        ?>
        <!-- <span class="d-none d-md-block dropdown-toggle ps-2">K. Anderson</span>-->
      </a><!-- End Profile Iamge Icon -->
    </li><!-- End Profile Nav -->

    <li class="nav-item dropdown pe-3 ">
       <a class=" d-flex align-items-center flex-column pe-0"  href="#" data-bs-toggle="dropdown">
         <i class="fa-solid fa-user i-nav-off" style="font-size: 1.4rem;"></i>
       
          <?php
            if ( !empty( $_SESSION[ "ses_Login" ] ) ) {
                echo  ' <p class="d-none d-sm-inline d-md-inline d-lg-inline p-nav-off">'. ucfirst(strtolower(($_SESSION[ "ses_Login" ]))).'</p>';
            }else{
                echo  ' <p class="d-none d-sm-inline d-md-inline d-lg-inline p-nav-off"></p>';
            }
            ?>
      
       </a>
       <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages" >
            <li>
                <a class="dropdown-item d-flex align-items-center btn" data-bs-toggle="modal" data-bs-target="#CambiarCont" >
                    <i class="bi bi-key text-danger"></i>
                    <span>Cambio de clave</span>
                </a>
                </li>
                <li>
                <a class="dropdown-item d-flex align-items-center btn"  data-bs-toggle="modal" data-bs-target="#ModalUsuarioPerfil">
                    <i class="bi bi-file-person text-success "></i>
                    <span>Mi perfil</span>
                </a>
                </li>
               <!-- <li>
                <a class="dropdown-item d-flex align-items-center btn"  data-bs-toggle="modal" data-bs-target="#ModalMesaAyuda">
                    <i class="fa-solid fa-circle-question text-primary"></i>
                    <span>Mesa de ayuda?</span>
                </a>
               </li>-->
               <li>
                <a class="dropdown-item d-flex align-items-center btn" data-bs-toggle="modal" data-bs-target="#ModalTicket">
                    <i class="fa-solid fa-headset text-danger"></i>
                    <span>Soporte tecnico?</span>
                </a>
              </li>
              <li>
                <a class="dropdown-item d-flex align-items-center btn floatingButton"  data-bs-toggle="modal" data-bs-target="#ModalActividades">
                    <i class="fa-solid fa-chalkboard-user"></i>
                    <span>Actividad actual?</span>
                </a>
              </li>
            </ul>
    </li>
    <li class="nav-item dropdown pe-3 " >
        <a class="text-center  d-flex align-items-center justify-content-center flex-column" id="a_cerrar_all"  href="#"  data-bs-toggle="dropdown"> 
            <i class="fa-solid fa-power-off text-danger i-nav-off" style="font-size: 1.4rem;"></i>
            <p class="d-none d-sm-inline d-md-inline d-lg-inline p-nav-off">Salir</p>
        </a>
    </li>
  </ul>
</nav><!-- End Icons Navigation -->
</header><!-- End Header -->




<main class="d-flex align-items-center justify-content-center align-items-start h-auto " style=" margin-top:100px; width: 100% !important;height: auto; ;margin-left:none !important; padding-left:none !important">
    <div class="row container d-flex  align-items-center justify-content-center align-items-start h-auto "   id="list-modulos" >
         <h1 class="text-center " style="margin-top:100px"><i class="fa-solid fa-circle-notch fa-spin " ></i></h1>
    </div>
</main>

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
                <?php  if(!empty($_SESSION["ses_Ingreso"]) ){ echo utf8_encode($_SESSION["ses_Ingreso"]); } ?>
                </span></td>
            </tr>
            <tr>
              <td>Usuario</td>
              <td><span>
                <?php  if(!empty($_SESSION["ses_Login"]) ){ echo utf8_encode($_SESSION["ses_Login"]); } ?>
                </span></td>
            </tr>
            <tr>
              <td>Nombres</td>
              <td><span>
                <?php  if(!empty($_SESSION["ses_Usuario"]) ){ echo utf8_encode($_SESSION["ses_Usuario"]); } ?>
                </span></td>
            </tr>
            <tr>
              <td>Email</td>
              <td><span>
                <?php  if(!empty($_SESSION["ses_Email"]) ){ echo utf8_encode($_SESSION["ses_Email"]); } ?>
                </span></td>
            </tr>
            <tr>
              <th colspan="2" class="bg-primary text-white">Cambiar Contraseña</th>
            </tr>
            <tr>
              <td>Contraseña Actual*</td>
              <td><input type="password" class="form-control form-control-sm"  id="passact" >
                  <div class="passact-invalid-feedback invalid-feedback ">
                      Por favor digita su clave actual.
                    </div>    
              </td>
            </tr>
            <tr>
              <td>Nueva Contraseña*</td>
              <td><input type="password" class="form-control form-control-sm"  id="passnew" >
              <div class="passnew-invalid-feedback invalid-feedback ">
                      Por favor digita la nueva clave.
                    </div>    
              </td>
            </tr>
            <tr>
              <td>Confirmar Contraseña*</td>
              <td><input type="password" class="form-control form-control-sm"  id="passconf" >
                 <div class="passconf-invalid-feedback invalid-feedback ">
                      Por favor confirma la nueva clave.
                  </div>    
              
              </td>
            </tr>
            <tr>
              <td colspan="2"><h4 style="border:1px solid #F0C2C3; background-color:#EB999B;color:#ffffff; padding:5px; font-size:10px; font:'Gill Sans', 'Gill Sans MT', 'Myriad Pro', 'DejaVu Sans Condensed', Helvetica, Arial, sans-serif;">*RECUERDE QUE AL CAMBIAR LA CONTRASEÑA SE CERRARÁ AUTOMATICAMENTE LA SESIÓN DEL SISTEMA*</h4></td>
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
</div><!-- End Large Modal-->

<div class="modal fade" id="fullscreenModal" tabindex="-1">
      <div class="modal-dialog modal-fullscreen ">
            <div class="modal-content d-flex align-content-center justify-content-center  p-0" >
                    <div class=" p-0 w-100 bg-dark opacity-75 text-light btn"  data-bs-dismiss="modal" aria-label="Close">
                      <h6 class="text-center p-0" >Cerrar</h6>
                    </div>      
                    <div class="modal-body p-0 m-0 ">

                        <iframe id="MyIframe"  src ="" class="h-100 border border-1 border-dark-subtle" frameborder="0" width="100%" ></iframe>
                    </div>
            </div>
      </div>
  </div><!-- End Full Screen Modal-->
<!--
<div  class="section-modal modal fade" id="iframe" tabindex="-1" role="dialog" aria-hidden="true">
   <div class="barra_iframe" id="cerrar_iframe"><i class="fas fa-power-off" title="Cerrar"></i><span>Cerrar</span></div> 
</div>
          -->

<div class="modal fade" tabindex="-1" id="change_bodega" aria-hidden="true" >
    <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                      <h5 class="modal-title"><i class="fa-solid fa-arrow-right-arrow-left"></i> Cambio de bodega</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
        <div class="modal-body text-center">
            Por favor selecciona la bodega en la que deseas trabajar.
            <br>
            <div class="row mt-3 " >
                <div class="col-6  p-2 ">
        
                     <img src="../resources/images/LogoCM.png" onClick="cambiarOrg(1000,this,2)" class="img-fluid seleccion-bodega" >
              
                </div>
                <div class="col-6  p-2">
                    
                     <img src="../resources/images/LogoRoma.png"  onClick="cambiarOrg(2000,this,2)" class="img-fluid seleccion-bodega">
              
                </div>
            </div>

        </div>

        </div>
    </div>
</div><!-- End Small Modal-->
<!--  perfil de usuario -->


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
        <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
          <img id="profile-avatar" src="https://img.freepik.com/foto-gratis/ilustracion-3d-hombre-negocios-gafas-sobre-fondo-gris_1142-58140.jpg?w=740&t=st=1726059978~exp=1726060578~hmac=73120d3d78d9b7e58fcf3103a50de72a8328fe0b7ead804315ca54a19a962688" height="80" width="80"  class="rounded-circle">
          <h2 id="profile-usuario"></h2>
          <h3 id="profile-rol"></h3>
          <div class="social-links mt-2">
            <a href="#" class="twitter"><i class="bi bi-twitter"></i></a>
            <a href="#" class="facebook"><i class="bi bi-facebook"></i></a>
            <a href="#" class="instagram"><i class="bi bi-instagram"></i></a>
            <a href="#" class="linkedin"><i class="bi bi-linkedin"></i></a>
          </div>
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
            </li>  -->

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
                <div class="col-lg-9 col-md-8" id="profile-direccion" ></div>
              </div>

              <div class="row mb-1">
                <div class="col-lg-3 col-md-4 label">Teléfono</div>
                <div class="col-lg-9 col-md-8" id="profile-telefonos"></div>
              </div>

              <div class="row mb-1" >
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
                    <!--<img src="assets/img/profile-img.jpg" alt="Profile">-->
                    <div class="pt-2">
                      <a href="#" class="btn btn-primary btn-sm" title="Upload new profile image"><i class="bi bi-upload"></i></a>
                      <a href="#" class="btn btn-danger btn-sm" title="Remove my profile image"><i class="bi bi-trash"></i></a>
                    </div>
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
              </form><!-- End Profile Edit Form -->

            </div>

            <div class="tab-pane fade pt-3" id="profile-settings">

              <!-- Settings Form -->
              <form>

                <div class="row mb-3">
                  <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Email Notifications</label>
                  <div class="col-md-8 col-lg-9">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="changesMade" checked>
                      <label class="form-check-label" for="changesMade">
                        Changes made to your account
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="newProducts" checked>
                      <label class="form-check-label" for="newProducts">
                        Information on new products and services
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="proOffers">
                      <label class="form-check-label" for="proOffers">
                        Marketing and promo offers
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="securityNotify" checked disabled>
                      <label class="form-check-label" for="securityNotify">
                        Security alerts
                      </label>
                    </div>
                  </div>
                </div>

                <div class="text-center">
                  <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
              </form><!-- End settings Form -->

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
              </form><!-- End Change Password Form -->

            </div>

          </div><!-- End Bordered Tabs -->

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
</div><!-- End Large Modal-->

<!--  -->
<div class="modal fade" id="ModalActividades" tabindex="-1">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">FUNCION ACTUAL -- Seleccione el nuevo estado de sus labores ---</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="ContenidoEstado">
               <div id="body_estados" class="card-icon-content border border-1 border-black" style="height:auto;" ></div>
            </div>
            <div class="modal-footer">
                
                <button type="button" id="Guarda_estado" class="btn btn-outline-primary">Guardar</button>
                <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
  </div><!-- End Extra Large Modal-->


  <!-- -->
  <div class="modal fade" id="ModalTicket" tabindex="-1">
                <div class="modal-dialog modal-md">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Ticket de soporte</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div id="formulario-ticket"></div>
                      <input type="hidden" class="_tsk_prioridad" readonly  value="0">
                      <div class="row">
                        <label class="mb-1">Categoria</label>
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon1">
                            <i class="fa-solid fa-list-check"></i>
                          </span>
                          <select  class="form-select" id="_tsk_categorias" ></select>
                        </div>                       
                      </div>
                      <div class="row">
                        <label  class="mb-1">Sub.categoria</label>
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon1">
                          <i class="fa-solid fa-bars-staggered"></i>
                          </span>
                          <select  class="form-select" id="_tsk_sub-categorias"></select>
                        </div>                       
                      </div>
                      <div class="row">
                        <label  class="mb-1">Descripción</label>
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon1">
                              <i class="fa-solid fa-audio-description"></i>
                          </span>
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
                        <button   class="btn btn-sm btn-danger" id="btn-borrar-canvas" style="display:none" onclick="BorrarImg()">Eliminar imagen</button>
                        </div>
                      </div>

                    </div>
                    <div class="modal-footer">
                      <button type="button" id="guardar-ticket" class="btn btn-outline-primary">Guardar ticket</button>
                      <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                  </div>
                </div>
              </div><!-- End Small Modal-->
</body>

  <!-- Vendor JS Files -->
<input type="hidden" value="<?php if(!empty($_SESSION["ses_Calle"]))  {echo  $_SESSION["ses_Calle"]; }?>"   id="Calle" readonly />
<input type="hidden" value="<?php if(!empty($_SESSION["ses_DepId"]))  {echo  $_SESSION["ses_DepId"]; }?>"   id="DepId" readonly />
<input type="hidden" value="<?php if(!empty($_SESSION["ses_Id"]))     {echo  $_SESSION["ses_Id"]; }?>"      id="IdUser" readonly />
<input type="hidden" value="<?php if(!empty($_SESSION["ses_RolesId"])){echo  $_SESSION["ses_RolesId"];} ?>" id="Rol"    readonly />
<input type="hidden" value="<?php if(!empty($_SESSION["ses_NumOrg"])) {echo  $_SESSION["ses_NumOrg"];} ?>"  id="org" readonly/>
<input type="hidden" value="<?php if(!empty($_SESSION["ses_NitPro"])) {echo  $_SESSION["ses_NitPro"];} ?>"  id="NIT_PT" readonly/>
<input type="hidden" value="<?php if(!empty($_SESSION["ses_OfcVentas"])) {echo  $_SESSION["ses_OfcVentas"];} ?>"  id="TxtOficina" readonly/>
<input type="hidden" value="<?php if(!empty($_SESSION["ses_Login"]))  {echo  $_SESSION["ses_Login"]; }?>"   id="login_user" readonly />
<input type="hidden" value="<?php if(!empty($_SESSION["ses_Id_Ses"]))  {echo  $_SESSION["ses_Id_Ses"]; }?>"   id="ses_id" readonly />


  <script type="text/javascript" src="../resources/plugins/jquery/jquery.min.js?<?php echo (rand()); ?>"></script>
  
  <script type="text/javascript" src="../resources/plugins/jquery-ui/jquery-ui.js?<?php echo (rand()); ?>"></script>
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
  <script src="../controllers/Contenido.js?<?php echo (rand()); ?>" ></script>
</html>