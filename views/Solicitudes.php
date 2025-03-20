<?php 
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
 include('../models/funciones.php');
 session_start();
 Redireccionar();
?>
<!--
 Desarrollado por: Inge Cristian Bula martinez
 Fecha  : 2017-07-15
 Modulo : Control de eventos de mercadeo
-->
<!doctype html>
<html>
<head>
    <meta http-equiv="Expires" content="0">
    <meta http-equiv="Last-Modified" content="0">
    <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
    <meta http-equiv="Pragma" content="no-cache">
<meta charset="utf-8">
<title>Solicitudes de Credito</title>
<link type="text/css" rel="stylesheet" href="../lib/Bootstrap/V3/css/bootstrap.min.css?<?php echo(rand()); ?>">
<link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php  echo(rand()); ?>"/>
<link type="text/css" rel="stylesheet" href="../lib/SweetAlert/sweet-alert.css?<?php  echo(rand()); ?>"/>
<link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php  echo(rand()); ?>" >
<link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs.css?<?php  echo(rand()); ?>" >
<!------------------------------------------------------------------------------------------------------------------>
<script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/js/bootstrap.min.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/SweetAlert/sweet-alert.min.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/js/funciones.js?<?php  echo(rand()); ?>"></script>
<script type="text/javascript" src="../lib/js/jquery.uitablefilter.js"></script>
<script type="text/javascript" src="../controllers/Solicitudes.js?<?php  echo(rand()); ?>"></script>
</head>
<body>
 <input type="hidden" id="Organizacion" value="<?php  if(!empty($_SESSION["ses_NumOrg"])){ echo $_SESSION["ses_NumOrg"];}else{ echo 0;}?>" readonly>
 <input type="hidden" id="Dpto" value="<?php if(!empty($_SESSION["ses_DepId"])){ echo $_SESSION["ses_DepId"];}?>" readonly>
 <input type="hidden" id="rol"  value="<?php if(!empty($_SESSION["ses_RolesId"] )){ echo $_SESSION["ses_RolesId"];}else{ "0";}   ?>"  />
 
<!--<div id="tabs">Div Tabs
    <ul>
     <li id="1"><a href="#dvNueva">Solicitudes</a></li>
     <li id="2"><a href="#dvGestion">Gestion</a></li>
    </ul>-->
<div class="panel with-nav-tabs panel-info">
<div class="panel-heading">
    <ul class="nav nav-tabs">
        <li class="active"><a href="#dvNueva" data-toggle="tab">Solicitudes</a></li>
        <li id="libtn2"><a href="#dvGestion" data-toggle="tab" id="btn2">Gestion</a></li>  
        <li id="libtn3"><a href="#dvGestionFechas" data-toggle="tab" id="btn3">Gestion Fechas</a></li> 
    </ul>
</div>  
<div class="panel-body">
<div class="tab-content"> 
  <div class="tab-pane fade in active" id="dvNueva">  
   <div class="container-fluid">     
      <div class="row">
        <div class="col-lg-6">
        <table class="form" width="100%">
          <thead>
            <tr>
              <th colspan="2">DATOS PERSONALES</th>
            </tr>
          </thead>
          <tbody>
          <tr>
            <td>NIT</td>
            <td><input type="number" name="nit" id="nit" class="form-control"></td>
          </tr>
          <tr>
            <td>RAZON SOCIAL</td>
            <td><input type="text" name="r_social" id="r_social" class="form-control" size="50"></td>
          </tr>
          <tr>
            <td>REPRESENTANTE LEGAL</td>
            <td><input type="text" name="r_legal" id="r_legal" class="form-control" size="50"></td>
          </tr>
          <tr>
            <td>CEDULA</td>
            <td><input type="number" name="cedula" id="cedula" class="form-control"></td>
          </tr>
          <tr>
            <td>DIRECCION</td>
            <td><input type="text" name="dir" id="dir" class="form-control" size="40"></td>
          </tr>
          <tr>
            <td>OFICINA DE VENTAS</td>
            <td><select id="bodega" class="form-control"></select></td>
          </tr>
          <tr>
            <td>DEPARTAMENTO</td>
            <td><select name="dpto" id="dpto" class="form-control"></select></td>
          </tr>
          <tr>
            <td>MUNICIPIO</td>
            <td><select name="mpio" id="mpio" class="form-control"></select></td>
          </tr>
         
          </tbody>
        </table></div>
        <div class="col-lg-6">
          <table class="form" width="100%">
          <thead>
            <tr>
              <th colspan="2">DATOS COMERCIALES</th>
            </tr>
          </thead>
           <tbody>
              </tr>
                <tr>
                <td>PLAZO SUGERIDO</td>
                <td><input type="number" name="dias" id="dias" class="form-control" size="5"></td>
              </tr>
               <tr>
                <td>CUPO SUGERIDO</td>
                <td><input type="number" name="cupo" id="cupo" class="form-control"></td>
              </tr>
               <tr>
                <td>LISTA SUGERIDA</td>
                <td><select id="lista" class="form-control"></select></td>
              </tr>
               <tr>
                <td>DOCUMENTACION</td> 
                <td><input type="file" name="ced" id="Docs" class="form-control"></td>
              </tr>
              <tr>
                <td>TELEFONO</td>
                <td><input type="tel" name="tel" id="tel" class="form-control"></td>
              </tr>
              <tr>
                <td>E-MAIL</td>
                <td><input type="email" name="email" id="email" class="form-control"></td>
              <tr>
               <td colspan="2" align="center">
                <input type="button" class="btn btn-success" value="Guardar" onClick="Insertar();">
                <input type="button" class="btn btn-default" value="Limpiar" onClick="Limpiar();">
               </td>
             </tr>
           </tbody>
          </table>
        </div>
    </div>
   </div>         
  </div>
  <div class="tab-pane fade in" id="dvGestion">
    <table class="form" width="100%">
     <tbody>
      <tr>
       <td><select id="anio" class="form-control"></select></td>
       <td><select id="meses" class="form-control"></select></td>
       <td>
         <select id="estados" class="form-control">
          <option value="T">Todos los estados</option>
          <option value="E">Enviadas</option>
          <option value="R">Revisadas</option>
          <option value="S">Estudio</option>
          <option value="A">Aprobadas</option>
          <option value="D">Rechazadas</option>
          <option value="P">Aplazadas</option>
         </select>
       </td>
       <td><select id="Oficinas" class="form-control"></select></td>
       <td><input type="text" placeholder="filtro de busqueda" size="60" class="form-control" id="filtro" name="filtro"></td>  
      </tr>
     </tbody>
    </table>
     <div id="dvResultSolicitudes"></div>
  </div>
  <div class="tab-pane fade in" id="dvGestionFechas">
    <table class="form" width="100%">
     <tbody>
      <tr>
       <td><select id="anio_f" class="form-control"></select></td>
       <td><select id="meses_f" class="form-control"></select></td>
       <td><select id="Oficinas_f" class="form-control"></select></td>
       <td><input type="text" placeholder="filtro de busqueda" size="60" class="form-control" id="filtro_f" name="filtro_f"></td>  
      </tr>
     </tbody>
    </table>
     <div id="dvResultSolicitudesFechas"></div>
  </div>
</div>
</div>
</div>


<div id="GestionSolicitudes" class="modal fade bd-example-modal-lg" role="dialog">
  <div class="modal-dialog modal-lg">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">GESTION SOLICITUD</h4>
      </div>
      <div class="modal-body">
        <table class="form" width="100%">
          <thead>
          </thead>
          <tbody>
           <tr>
            <td><div id="Comentarios" class="notas" style="height: 350px; text-align:justify;overflow:auto;"></div></td>    
            <td rowspan="2" align="center">
             <table width="100%">
             <thead>
             <tr>
               <td colspan="2" align="center">
                  <table class="form" width="100%">
                   <thead>
                     <tr>
                      <th colspan="2">Datos de Solicitud</th>
                     </tr>
                     <tr style="display:none;">
                       <th width="20%">ID Solicitud</th>
                       <td id="tdId"></td>
                      </tr>
                     <tr>
                       <th width="20%">Fecha Solicitud</th>
                       <td id="tdFecha"></td>
                      </tr>
                      <tr>
                       <th>Cliente</th>
                       <td id="tdCliente"></td>
                      </tr>
                      <tr>
                       <th>Usuario Solicita</th>
                       <td id="tdUserSolicita"></td>
                      </tr>
                      <tr>
                       <th>Estado Actual</th>
                       <td id="tdEstado"></td>
                      </tr>
                      <tr style="display:none;">
                       <th>ID Estado</th>
                       <td id="tdIdEstado"></td>
                      </tr>
                   </thead>
                  </table>
               </td>
              </tr>             
              </thead>
              <tr>
               <td colspan="2" align="center" id="trOp"></td>
              </tr>
             </table>
            </td>
           </tr>
           <tr>
            <td><textarea id="AddComentario" class="notas"  onkeypress="AddObservacion(event,this.value);"></textarea></td>
           </tr>
          </tbody>
         </table>              
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div> 
<div id="ModalPDF" class="modal fade bd-example-modal-lg" role="dialog">
  <div class="modal-dialog modal-lg">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">VISUALIZAR CARTA</h4>
      </div>
      <div class="modal-body" id="ContenidoPDF">              
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
<div id="DatosAprobacion" class="modal fade bd-example-modal-lg" role="dialog">
  <div class="modal-dialog modal-lg">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">GESTION SOLICITUD</h4>
      </div>
      <div class="modal-body">  
         <table class="form" width="100%">
              <tr>
                <td>Dias</td>
                <td><input type="number" class="form-control" id="diasAprob"></td>
              </tr>
              <tr>
                <td>Cupo</td>
                <td><input type="number" class="form-control" id="cupoAprob"></td>
              </tr>
              <tr>
                <td>Lista</td>
                <td><select class="form-control" id="listaAprob"></select></td>
              </tr>
              <tr>
                <td>Vendedor</td>
                <td><select  class="form-control" id="vendedorAprob"></select></td>
              </tr>
              <tr>
                <td>¿Tiene Codeudor?</td>
                <td>
                 <select id="opcodeudor" class="form-control">
                  <option value="N" selected>NO</option>
                  <option value="S">SI</option>
                 </select>
                </td>
              </tr>
              <tr>
               <td>&nbsp;</td>
               <td id="trCodeudor">
                    <table class="form">
                     <thead>
                      <tr> 
                       <th colspan="2">DATOS DE CODEUDOR</th>
                      </tr>
                     </thead>
                      <tr>
                        <td>Nombres</td>
                        <td><input type="text" class="form-control" id="CodeudorNombres" size="50"></td>
                      </tr>
                      <tr>
                        <td>Telefono</td>
                        <td><input type="number" class="form-control" id="CodeudorTelefono"></td>
                      </tr>
                      <tr>
                        <td>Direccion</td>
                        <td><input type="text" class="form-control" id="CodeudorDireccion" size="40"></td>
                      </tr>
                      <tr>
                        <td>Ocupacion/Cargo</td>
                        <td><input type="text" class="form-control" id="CodeudorOcupacion" size="40"></td>
                      </tr>
                      </table>
               </td>
              </tr>
              <tr>
               <td colspan="2" align="center"><input type="button" class="btn btn-success" value="Guardar" onClick="DatosAprobacion();"></td>
              </tr>
             </table>       
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-info" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div> 

<!--<div id="DatosAprobacion" style="display:none;"></div>-->
</body>
</html>