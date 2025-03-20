<?php 
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
 include('../models/funciones.php');
 session_start();
 Redireccionar();
?>
<!doctype html>
<html><head>
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Last-Modified" content="0">
  <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
  <meta http-equiv="Pragma" content="no-cache">
<meta charset="utf-8">
<title>Presupuesto</title>
  <title>Inventario actual</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="../resources/plugins/fontawesome-free/css/all.min.css">
	<link rel="stylesheet" href="../resources/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
	<link rel="stylesheet" href="../resources/plugins/icheck-bootstrap/icheck-bootstrap.min.css">
	<link rel="stylesheet" href="../resources/plugins/adminlte.min.css">	
	<link rel="stylesheet" href="../resources/plugins/select2/css/select2.min.css">
	<link rel="stylesheet" href="../resources/plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
	<link rel="stylesheet" href="../resources/plugins/daterangepicker/daterangepicker.css">
	<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.min.css" id="theme-styles">
	<link rel="stylesheet" href="../resources/plugins/jquery-ui/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="../resources/plugins/DataTables/datatables.min.css"/>	
	<link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs_v2.css?<?php  echo(rand()); ?>" >
<style>
	.optimas{
		background-color: aquamarine;
	}
	.programadas{
		background-color: bisque;
	}
	.contactadas{
		background-color: aqua;
	}
	.cumplimiento{
		background-color: orchid;
	}

	.card {
		height: 200px;
	}

	.custom-container {
		padding: 10px;
	}
</style>
</head>
<body>
<!--  -->
 <input type="hidden" id="Organizacion" value="<?php if(!empty($_SESSION["ses_NumOrg"])) { echo $_SESSION["ses_NumOrg"];} ?>"  readonly />
 <input type="hidden" id="TxtRolId"     value="<?php if(!empty($_SESSION["ses_RolesId"])){ echo $_SESSION["ses_RolesId"];} ?>" readonly />
 <input type="hidden" id="TxtIdu"       value="<?php if(!empty($_SESSION["ses_Id"]))     { echo $_SESSION["ses_Id"];}      ?>" readonly />
 <input type="hidden" id="TxtCodSap"    value="<?php if(!empty($_SESSION["ses_CodSap"] )){ echo $_SESSION["ses_CodSap"] ;} ?>" readonly />
 <input type="hidden" id="Rol"          value="<?php if(!empty($_SESSION["ses_RolesId"] )){ echo $_SESSION["ses_RolesId"] ;}?>" readonly>
<table width="100%" border="0" class="form" align="center">
 <thead>
  <tr>
   <th colspan="11">CUMPLIMIENTO DE PRESUPUESTO</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>Oficina</td>
   <td><select name="SlcOficina" class="form-control form-control-sm" id="SlcOficina"></select></td>
  </tr>
  <tr>
   <td>Zona Ventas</td>
   <td><select name="txtZonas" class="form-control form-control-sm" id="txtZonas"></select></td>
  </tr>
  <tr> 
   <td>Mes</td>
   <td><select name="meses" class="form-control form-control-sm" id="meses"></select></td>
  </tr> 
  <tr>
   <td>Año</td>
   <td><select name="ano" class="form-control form-control-sm" id="ano"></select></td>
  </tr>   
  <tr> 
   <td>Clasificaciones</td>
   <td><select id="Clasificaciones" class="form-control form-control-sm">
        <option value="-">TODAS</option>
        <option value="AA">AA</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
	    <option value="D">D</option>
	    <option value="E">E</option>
     </select>
   </td>
  </tr>
  <tr>
	<td>Clase de Pedido</td>
	<td>
	 <select id="txtClasePedido" class="form-control form-control-sm" style="width:100%">
	  <option value="T" selected>TODOS</option>
	  <option value="ZPWA">ZPWA - ADMINISTRADOR</option>
	  <option value="ZPWV">ZPWV - VENDEDOR</option>
	  <option value="ZPWL">ZPWL - TELEVENDEDOR</option>
	  <option value="ZPWP">ZPWP - PROVEEDOR</option>
	  <option value="ZPWT">ZPWT - TRANSFERENCISTA</option>
	  <option value="ZPWC">ZPWC - CLIENTE</option>
	  <option value="ZPIC">ZPIC - INTEGRACION COMERCIAL</option>
	 </select>
	</td> 
  </tr>	  
  <tr>
   <td colspan="2">  
     <button type="button" class="btn btn-info btn-sm" id="btn_consultar">Consultar</button>
   </td> 
  </tr>
  <tr><td colspan="11"><hr></td></tr>
 </tbody>
</table>
	
<div id="FilaTotales" style="display:none;">
	<div class="custom-container">
		<div class="row">
			<div class="col-12 col-sm-6 col-md-4">
				<div class="card">
				  <div class="card-header text-center bg-default">
				   <i class="fas fa-dollar-sign"></i> 
				   <b>PRESUPUESTO DE VENTAS X CLIENTE (PROYECTADO)</b>
				  </div>
				  <div class="card-body">
					  <div class="row">
						  <div class="col-6 col-sm-6 col-md-6">Presupuesto Proyectado</div>	
						  <div class="col-6 col-sm-6 col-md-6"><b id="p_pres_venta"></b></div>	
					  </div>
					  <div class="row">
						   <div class="col-6 col-sm-6 col-md-6">Ejecutado</div>	
						  <div class="col-6 col-sm-6 col-md-6"><b id="p_cump_venta"></b></div>	
					  </div>
					  <div class="row">
						  <div class="col-6 col-sm-6 col-md-6">Cumplimiento</div>	
						  <div class="col-6 col-sm-6 col-md-6"><b id="p_pcj_venta"></b></div>	
					  </div>
				  </div>
				</div>
			</div>
			<div class="col-12 col-sm-6 col-md-4">
				<div class="card">
				  <div class="card-header text-center bg-default">			    
					 <i class="fas fa-user-circle"></i>
					 <b>PANEL DE CLIENTES</b>
				  </div>
				  <div class="card-body">
					  <div class="row">
						   <div class="col-6 col-sm-6 col-md-6">Panel</div>	
						  <div class="col-6 col-sm-6 col-md-6"><b id="p_panel_cliente"></b></div>	
					  </div>
					  <div class="row">
						   <div class="col-6 col-sm-6 col-md-6">Impactados</div>	
						  <div class="col-6 col-sm-6 col-md-6"><b id="p_imp_cliente"></b></div>	
					  </div>
					  <div class="row">
						   <div class="col-6 col-sm-6 col-md-6">Pendientes</div>	
						  <div class="col-6 col-sm-6 col-md-6"><b id="p_pend_cliente"></b></div>	
					  </div>
				  </div>
				</div>
			</div>
			<div class="col-12 col-sm-6 col-md-4">			
				
				<div class="card">
				  <div class="card-header text-center bg-default">			    
					 <i class="fas fa-calendar-check"></i>
					 <b>DIAS LABORALES</b>
				  </div>
				  <div class="card-body">
					  <div class="row">
						   <div class="col-6 col-sm-6 col-md-6">Dias del mes</div>	
						  <div class="col-6 col-sm-6 col-md-6"><b id="p_dias_laborales"></b></div>	
					  </div>
					  <div class="row">
						   <div class="col-6 col-sm-6 col-md-6">Dias transcurridos</div>	
						  <div class="col-6 col-sm-6 col-md-6"><b id="p_dias_transcurridos"></b></div>	
					  </div>
					   <div class="row">
						   <div class="col-6 col-sm-6 col-md-6">Dias restantes</div>	
						  <div class="col-6 col-sm-6 col-md-6"><b id="p_dias_restantes"></b></div>	
					  </div>
				  </div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-12 col-sm-6 col-md-4">	
				<div class="card">
				  <div class="card-header text-center bg-default">			    
					 <i class="fas fa-plus-square"></i>
					 <b>OBJETIVO DE VISITAS / LLAMADAS</b>
				  </div>
				  <div class="card-body">
					  <div class="row">
						  <div class="col-3 col-sm-3 col-md-3"></div>	
						  <div class="col-2 col-sm-2 col-md-2"><b>Objetivo</b></div>
						  <div class="col-2 col-sm-2 col-md-2"><b>Programado</b></div>
						  <div class="col-2 col-sm-2 col-md-2"><b>Contactada</b></div>
						  <div class="col-2 col-sm-2 col-md-2"><b>Cumple</b></div>
					  </div>
					  <div class="row">
						  <div class="col-2 col-sm-2 col-md-3">Ejecutivo</div>	
						  <div class="col-2 col-sm-2 col-md-2"><b id="p_optimas_ventas"></b></div>
						  <div class="col-2 col-sm-2 col-md-2"><b id="p_cump_ventas_v"></b></div>
						  <div class="col-2 col-sm-2 col-md-2"><b id="sum_v_contactadas"></b></div>					  
						  <!--<div class="col-2 col-sm-2 col-md-2"><b id="p_pcj_ventas_v"></b></div>-->
						  <div class="col-2 col-sm-2 col-md-2"><b id="pcj_sum_v_contactadas"></b></div>
					  </div>
					  <div class="row">
						  <div class="col-3 col-sm-3 col-md-3">Televendedor</div>	
						  <div class="col-2 col-sm-2 col-md-2"><b id="p_optimas_televentas"></b></div>	
						  <div class="col-2 col-sm-2 col-md-2"><b id="p_cump_ventas_t"></b></div>
						  <div class="col-2 col-sm-2 col-md-2"><b id="sum_t_contactadas"></b></div>
						<!--  <div class="col-2 col-sm-2 col-md-2"><b id="p_pcj_ventas_t"></b></div>-->
						  <div class="col-2 col-sm-2 col-md-2"><b id="pcj_sum_t_contactadas"></b></div>
					  </div>
				  </div>
				</div>
			</div>	
			<div class="col-12 col-sm-6 col-md-4">		
				<div class="card">
				  <div class="card-header text-center">
				  <!-- <i class="fas fa-percentage"></i>-->
				   <b>PROMEDIO VISITAS / LLAMADAS DIARIAS</b>
				  </div>
				  <div class="card-body">
					  <div class="row">
						  <div class="col-4 col-sm-4 col-md-4"></div>	
						  <div class="col-4 col-sm-4 col-md-4"><b>Programado Mes</b></div>
						  <div class="col-4 col-sm-4 col-md-4"><b>Contactada Actual</b></div>
					  </div>
					  <div class="row">
						  <div class="col-4 col-sm-4 col-md-4">Ejecutivo</div>	
						  <div class="col-4 col-sm-4 col-md-4" ><b id="p_promdia_v_programado"></b></div>	
						  <div class="col-4 col-sm-4 col-md-4" ><b id="p_promdia_v_contactado"></b></div>	
					  </div>
					  <div class="row">
						  <div class="col-4 col-sm-4 col-md-4">Televendedor</div>	
						  <div class="col-4 col-sm-4 col-md-4" ><b id="p_promdia_t_programado"></b></div>	
						  <div class="col-4 col-sm-4 col-md-4" ><b id="p_promdia_t_contactado"></b></div>	
					  </div>				  
				  </div>
				</div>
			</div>
			<div class="col-12 col-sm-6 col-md-4">
				<div class="card">
				  <div class="card-header text-center bg-default">
				   <i class="fas fa-dollar-sign"></i> 
				   <b>PRESUPUESTO DE VENTAS X ZONA (ASIGNADO)</b>
				  </div>
				  <div class="card-body">
					  <div class="row">
						  <div class="col-6 col-sm-6 col-md-6">Presupuesto Asignado</div>	
						  <div class="col-6 col-sm-6 col-md-6"><b id="p_pres_venta_zona"></b></div>	
					  </div>
					  <div class="row">
						   <div class="col-6 col-sm-6 col-md-6">Ejecutado</div>	
						  <div class="col-6 col-sm-6 col-md-6"><b id="p_cump_venta_zona"></b></div>	
					  </div>
					  <div class="row">
						  <div class="col-6 col-sm-6 col-md-6">Cumplimiento</div>	
						  <div class="col-6 col-sm-6 col-md-6"><b id="p_pcj_venta_zona"></b></div>	
					  </div>
				  </div>
				</div>
			</div>
		</div>	
	</div>
	
	
	<div class="row">
	     <div class="col-12 col-sm-12 col-md-12">
			 
						<table width="100%" border="0" class="form" align="center">
							<thead>
								<tr>
									<th colspan="6">CUMPLIMIENTO CLIENTES Y POTENCIAL DE COMPRA</th>
								</tr>
								<tr>
									<th>Clientes cumplen PPTO</th>
									<th>Potencial Ventas</th>
									<th>Participación % en clientes - prom 3 meses</th>
									<th>Promedio 3 meses</th>
									<th>Promedio 6 meses</th>
									<th>Variación 3 vs 6 meses</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><b id="potencial_clientes_cumplen"></b></td>
									<td><b id="potencial_valor_total"></b></td>
									<td><b id="potencial_participacion_3mes"></b></td>
									<td><b id="potencial_suma_3mes"></b></td>
									<td><b id="potencial_suma_6mes"></b></td>
									<td><b id="potencial_variacion"></b></td>
								</tr>								
							</tbody>
						</table>	
					<!--<div class="card">
							  <div class="card-header text-center bg-info">			    
								 <i class="fas fa-percentage"></i>
								 <b>CUMPLIMIENTO CLIENTES Y POTENCIAL DE COMPRA</b>
							  </div>
							  <div class="card-body">
								  <div class="row">
									  <div class="col-2 col-sm-2 col-md-2"><b>CLIENTES CUMPLEN PPTO</b></div>
									  <div class="col-2 col-sm-2 col-md-2"><b>POTENCIAL VENTAS</b></div>
									  <div class="col-2 col-sm-2 col-md-2"><b>PARTICIPACION % EN CLIENTES - PROM 3 MESES</b></div>
									  <div class="col-2 col-sm-2 col-md-2"><b>PROMEDIO 3 MESES</b></div>
									  <div class="col-2 col-sm-2 col-md-2"><b>PROMEDIO 6 MESES</b></div>
									  <div class="col-2 col-sm-2 col-md-2"><b>VARIACION 3 VS 6 MESES</b></div>
								  </div>
								  <div class="row">
									  <div class="col-2 col-sm-2 col-md-2"><b id="potencial_clientes_cumplen"></b></div>
									  <div class="col-2 col-sm-2 col-md-2"><b id="potencial_valor_total"></b></div>
									  <div class="col-2 col-sm-2 col-md-2"><b id="potencial_participacion_3mes"></b></div>
									  <div class="col-2 col-sm-2 col-md-2"><b id="potencial_suma_3mes"></b></div>
									  <div class="col-2 col-sm-2 col-md-2"><b id="potencial_suma_6mes"></b></div>
									  <div class="col-2 col-sm-2 col-md-2"><b id="potencial_variacion"></b></div>
								  </div>
							  </div>
							</div>-->
		</div>
	</div>
	<br>
	<div class="row">
	     <div class="col-6 col-sm-6 col-md-6" id="td_venta_grupo"></div>
		 <div class="col-6 col-sm-6 col-md-6" id="td_venta_tipo"></div>
	</div>
	</br>
	<div class="row">
	     <div class="col-12 col-sm-6 col-md-6">
			 <figure class="highcharts-figure">
				<div id="DivGrafico"></div>
				<p class="highcharts-description"></p>
			 </figure>
		</div>
		<div class="col-12 col-sm-6 col-md-6">
			 <figure class="highcharts-figure">
				<div id="DivGraficoLab"></div>
				<p class="highcharts-description"></p>
			 </figure>
		</div>
	</div>
	<div class="row">
		<div class="col-12 col-sm-6 col-md-3"></div>	
		<div class="col-12 col-sm-6 col-md-3"></div>
		<div class="col-12 col-sm-6 col-md-3"></div>	
		<div class="col-12 col-sm-6 col-md-3"></div>		
    </div>
	<div class="row">
		<div class="col-12 col-sm-6 col-md-4" id="contenedor_cvolante1">			
			<div class="info-box">
              <span class="info-box-icon bg-info elevation-1"><i class="fas fa-flag"></i></span>
              <div class="info-box-content">
                <span class="info-box-text">Meta volante 1-7</span>
                <span class="info-box-number" id="vmeta_volante_1"></span>
                <span class="info-box-text">Venta 1-7</span>
                <span class="info-box-number" id="venta_corte_1"></span>
				<span class="info-box-text">% Cumplimiento</span>
                <span class="info-box-number" id="cumplimiento_meta_1"></span>
              </div>
            </div>
		</div>
    
    <div class="col-12 col-sm-6 col-md-4" id="contenedor_cvolante2">			
			<div class="info-box">
              <span class="info-box-icon bg-danger elevation-1"><i class="fas fa-flag"></i></span>
              <div class="info-box-content">
                <span class="info-box-text">Meta volante 8-14</span>
                <span class="info-box-number" id="vmeta_volante_2"></span>
                <span class="info-box-text">Venta 8-14</span>
                <span class="info-box-number" id="venta_corte_2"></span>
				<span class="info-box-text">% Cumplimiento</span>
                <span class="info-box-number" id="cumplimiento_meta_2"></span>
              </div>
            </div>
		</div>
    
    <div class="col-12 col-sm-6 col-md-4" id="contenedor_cvolante3">			
			<div class="info-box">
              <span class="info-box-icon bg-success elevation-1"><i class="fas fa-flag"></i></span>
              <div class="info-box-content">
                <span class="info-box-text">Meta volante 15-21</span>
                <span class="info-box-number" id="vmeta_volante_3"></span>
                <span class="info-box-text">Venta 15-21</span>
                <span class="info-box-number" id="venta_corte_3"></span>
				<span class="info-box-text">% Cumplimiento</span>
                <span class="info-box-number" id="cumplimiento_meta_3"></span>
              </div>
            </div>
	</div>	
	</div>
	
  </div>
<div id="result"></div>
<table id="TableView" class="table display nowrap" width="100%">
	
	<tfoot>
		<tr>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>&nbsp;</th>
		    <th>&nbsp;</th>
		</tr>
	</tfoot>
</table>



<div id="Bloquear" style="display:none;"></div>  
<div class="centrado-porcentual " ></div> 
	
<script src="../resources/plugins/jquery/jquery.js"></script>
<!-- jQuery UI 1.11.4 -->
<script src="../resources/plugins/jquery-ui/jquery-ui.min.js"></script>	
<!-- Bootstrap 4 -->
<script src="../resources/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>

<script src="../resources/plugins/moment/moment.min.js"></script>	
<!-- daterangepicker -->
<script src="../resources/plugins/daterangepicker/daterangepicker.js"></script>
<!-- Tempusdominus Bootstrap 4 -->
<script src="../resources/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
<!-- Summernote -->
<script src="../resources/plugins/summernote/summernote-bs4.min.js"></script>
<!-- overlayScrollbars -->
<script src="../resources/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>

<script src="../resources/plugins/select2/js/select2.full.min.js"></script>
<!-- AdminLTE for demo purposes -->

<script type="text/javascript" src="../resources/plugins/DataTables/datatables.min.js"></script>
<script type="text/javascript" src="../resources/HighCharts/code/highcharts.js?1991462313"></script>
<script type="text/javascript" src="../lib/js/funciones.js?<?php  echo(rand()); ?>"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@8/dist/sweetalert2.min.js"></script>
	
<script type="text/javascript" src="../controllers/Cumplimiento_presupuesto.js?<?php  echo(rand()); ?>"></script>	

	
</body>
</html>