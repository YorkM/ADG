<?php 
 /*DESARROLLADO POR ING CRISTIAN BULA 09-12-2016*/
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
  include('../models/funciones.php');
  session_start();
  Redireccionar();

?>
<html>

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>Evento comercial </title>
  <meta content="" name="description">
  <meta content="" name="keywords">

  <!-- Favicons -->
  <link href="../resources/icons/" rel="icon">
  <link href="../resources/" rel="apple-touch-icon">
  <!-- Google Fonts -->
  <link href="https://fonts.gstatic.com" rel="preconnect">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

  <!-- Vendor CSS Files -->
<link type="text/css" rel="stylesheet" href="../lib/footable/css/footable.bootstrap.css"/>
  <link href="../resources/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="../resources/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="../resources/assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="../resources/assets/vendor/quill/quill.snow.css" rel="stylesheet">
  <link href="../resources/assets/vendor/quill/quill.bubble.css" rel="stylesheet">
  <link href="../resources/assets/vendor/remixicon/remixicon.css" rel="stylesheet">
  <link href="../resources/assets/vendor/simple-datatables/style.css" rel="stylesheet"> 
  <link href="../resources/fontawesome-free-6.1.2-web/css/all.css" rel="stylesheet">
  <link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css"/>
  <link href="../lib/SweetAlert2/SweetAlert2.css" rel="stylesheet">
  <!-- Template Main CSS File --> 
  <link type="text/css" href="../resources/assets/css/style.css" rel="stylesheet" /> 
  <link type="text/css" href="../lib/footable/css/footable.bootstrap.css" rel="stylesheet" />
		<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
  <style> 
	  html{
		  font-size: 0.9rem;
	  }
	  .img-title{
		  margin-top: -9px;
		  margin-right: -10px;
		  z-index: 9999
		  /*
		  position: fixed*/
	  }
	  body{
		  background-image: url('../resources/images/fondo_navidad_feria.png'); 
		  background-repeat: repeat; 
		  background-size: 320px 320px; 
	  }
	  .tab-content{
		 background-color: #ffffff;
		
	  }
	  nav-tabs li.active{
		  border: 1px solid #FFC6C6
	  }
	  .border-danger{
		  border-color: #FCAFB0 !important
	  }
	  
	  button.active{
		  color: #004D0D !important;
		   border:1px solid #FFBABA  !important;
		  background-color: #FFDADA !important;
	  }
	 .ui-menu-item {
      font-size: 12px; /* Tamaño de la letra para los elementos del menú */
      color: #333; /* Color de la letra por defecto */
    }
    .ui-menu-item a:hover {
		background: #2F8433;
		color: #F3F3F3
    }
	  
	  #tableProd,#tableRescue,#infoBoni,.info-material,#tablaConfirmar tbody tr td {
		 font-size: 0.8rem 
	  }
    .transparent-div {
      background-color: rgba(255, 255, 255, 0.1); /* Color de fondo con opacidad (ajusta los valores según tus necesidades) */
    }
	  .table thead th {
		  cursor: pointer;
		  background-color: #FF6469;
		  padding: 5px;
		  color: #E9E9E9
	  }
	  .form-control{
		 /* border-top: none !important;
		  border-left: none !important;
		  border-right: none !important;*/
	  }
	  label{
		 /* font-weight: 600;
		  padding-left: 3px;
		  font-size: 14px*/
	  }
	  .nav-tabs{
		  background-color: #FFFFFF
	  }
	  .nav-item button{
		  border: 1px #FFDBDB solid !important;
	  }
	  .nav-item button:hover{
		  background-color: #FFBCBD !important;
	  }
	  .list-group li button{
		  text-align: left !important;
	  }
	  .encabezados {
			position: sticky;
			top: 0;
			z-index:300;	
		}
	
.timeline {
    border-left: 3px solid #F86464;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    background: rgba(114, 124, 245, 0.09);
    margin: 0 auto;
    letter-spacing: 0.2px;
    position: relative;
    line-height: 1.4em;
    font-size: 1.03em;
    padding: 50px;
    list-style: none;
    text-align: left;
    max-width: 70%;
}

@media (max-width: 767px) {
    .timeline {
        max-width: 98%;
        padding: 25px;
    }
}

.timeline h1 {
    font-weight: 300;
    font-size: 1.4em;
}

.timeline h2,
.timeline h3 {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 10px;
}

.timeline .event {
    border-bottom: 1px dashed #e8ebf1;
    padding-bottom: 25px;
    margin-bottom: 25px;
    position: relative;
}

@media (max-width: 767px) {
    .timeline .event {
        padding-top: 30px;
    }
}

.timeline .event:last-of-type {
    padding-bottom: 0;
    margin-bottom: 0;
    border: none;
}

.timeline .event:before,
.timeline .event:after {
    position: absolute;
    display: block;
    top: 0;
}

.timeline .event:before {
    left: -207px;
    content: attr(data-date);
    text-align: right;
    font-weight: 600;
    font-size: 0.9em;
    min-width: 120px;
	word-break: normal
}

@media (max-width: 767px) {
    .timeline .event:before {
        left: 0px;
        text-align: left;
    }
}

.timeline .event:after {
    -webkit-box-shadow: 0 0 0 3px #F86464;
    box-shadow: 0 0 0 3px #F86464;
    left: -55.8px;
    background: #fff;
    border-radius: 50%;
    height: 9px;
    width: 9px;
    content: "";
    top: 5px;
}

@media (max-width: 767px) {
    .timeline .event:after {
        left: -31.8px;
    }
}

.rtl .timeline {
    border-left: 0;
    text-align: right;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    border-right: 3px solid #727cf5;
}

.rtl .timeline .event::before {
    left: 0;
    right: -170px;
}

.rtl .timeline .event::after {
    left: 0;
    right: -55.8px;
}
	  
	  .card-btn:hover{
		  border: 1px solid #FF9193 !important;
		  box-shadow: 5px 5px 5px #FF9193 !important;
		  background-color: #FFEFEF;
	  }
	  .card-btn .card-title{
		  color:#FF5558
	  }
 .card-btn:hover svg{
    transform: scale(1.5); /* Ajusta el factor de escala según tus preferencias */
    transition: transform 0.6s ease; /* Ajusta la duración y la función de tiempo según tus preferencias */
  }
	  
	#letter_f {
      transition: transform 0.3s ease-in-out;
   }

	#letter_f:hover {
	  transform: translateY(-5px);
	}
	  .img-tab-btn{
		transition: transform 0.3s ease-in-out;  
	  } 
	  
	  .img-tab-btn:hover {
	  transform: translateY(-6px);
	}

    .background {
      position: relative;
	  min-height: 380px;
	  padding-bottom: 3px;
	  min-width: 70%;
      top: 0;
      left: 0;
	  bottom: 20px;
      width: 100%;
      height: 80%;
      background: url('../resources/images/camino_preload-min.png?772727262553') repeat-x;
      animation: walkAnimation 23s linear infinite; /* Ajusta la velocidad y la duración según sea necesario */
      border: none;
      overflow: hidden;
    }
	 .img-preload{
         top:130px;
		 z-index: 999;
		  position: absolute;
		  display: block;
		  background-color: transparent;
	 }
    .img-fluid2 {
      position: absolute;
      top: 50%; /* Ajusta la posición vertical de la imagen */
      left: 50%; /* Ajusta la posición horizontal de la imagen */
      transform: translate(-50%, -50%); /* Centra la imagen con respecto a su contenedor */
      display: block;
      margin: 0 auto;
	  z-index: 100;
      visibility: hidden; /* Oculta la imagen original */
    }

    @keyframes walkAnimation {
      from {
        background-position: 0 0 ;
      }
      to {
        background-position:   100% 0; /* Desplaza la imagen horizontalmente */
      }
    }
@font-face {
  font-family: 'ChopinScript';
  src: url('../resources/fonts/rechtmanplain-webfont.woff2') format('woff2'),
       url('../resources/fonts/rechtmanplain-webfont.woff.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}	  
	
	  
	  .container-bienvenida{
		  margin: 0;
		  padding: 0;
		  display: flex;
		  justify-content: center;
		  align-items: center;
		  align-content: center;
		 /* height: 100vh;*/
		  background-color: #ffffff; /* Puedes cambiar esto según tus preferencias */
		  min-width: 200px;
		  border: 2px solid red;
		  /*min-height: 100vh;*/
	  }
    .imagen {
      position: relative;
      display: inline-block;
	   min-width: 200px;
    }
	  .mensaje_titulo{
		  top:40%;
		  left: 44%;
		  font-size: 3.3em;
		  margin-bottom: 10px
	  }
	  .mensaje_cuerpo{
		   top:58%;
		   left: 50%;
		  font-size: 2.7em;
		  
	  }
    .mensaje {
	  font-family: 'ChopinScript',cursive;
      position: absolute;
	  transform: translate(-50%, -50%);
      color: #FF4B4E; /* Puedes cambiar el color del texto según tus preferencias */
	  max-width: 330px;
	  line-height: 1;
    }	  
/*	  
@media (min-width: 451px) and (max-width: 740px) {
	  .mensaje_titulo{
		  top:40%;
		  left: 35%;
		  font-size: 3.3em;
	  }
	.mensaje_cuerpo{
		font-size: 3em;
	}
}
	  
@media (min-width: 101px) and (max-width: 450px) {
	
  .mensaje_titulo{
	 top:43%;
  }
		.mensaje_cuerpo{
		font-size: 2.4em;
	}

} */
  </style>
<body>
<input type="hidden" id="SesNombres"         value="<?php if(!empty($_SESSION["ses_Nombres"])){ echo $_SESSION["ses_Nombres"];}?>" readonly>
<input type="hidden" id="SesApellidos"         value="<?php if(!empty($_SESSION["ses_Apellidos"])){ echo $_SESSION["ses_Apellidos"];}?>" readonly>
	
<input type="hidden" id="Dpto"         value="<?php if(!empty($_SESSION["ses_DepId"])){ echo $_SESSION["ses_DepId"];}?>" readonly>
<input type="hidden" id="Organizacion" value="<?php if(!empty($_SESSION["ses_NumOrg"])) {echo  $_SESSION["ses_NumOrg"];} ?>" readonly>
<input type="hidden" id="CodigoSAP"    value="<?php if(!empty($_SESSION["ses_CodSap"])){ echo $_SESSION["ses_CodSap"];}?>" readonly>
<input type="hidden" id="UsrLogin"     value="<?php if(!empty($_SESSION["ses_Login"])){ echo $_SESSION["ses_Login"];}?>" readonly>
<input type="hidden" id="Ofi"          value="<?php if(!empty($_SESSION["ses_OfcVentas"] )){ echo $_SESSION["ses_OfcVentas"] ;}?>" readonly>
<input type="hidden" id="Rol"          value="<?php if(!empty($_SESSION["ses_RolesId"] )){ echo $_SESSION["ses_RolesId"] ;}?>" readonly>
<input type="hidden" id="Nit"          value="<?php if(!empty($_SESSION["ses_Nit"] )){ echo $_SESSION["ses_Nit"] ;}?>" readonly>
<input type="hidden" id="UsrId"        value="<?php if(!empty($_SESSION["ses_Id"])){ echo $_SESSION["ses_Id"] ;}?>" readonly>
<input type="hidden" id="AbrirVentas"  value="<?php if(!empty($_GET["eve"])){ echo $_GET["eve"] ;}else{echo 0;}?>" readonly>
<input type="hidden" id="link_pro"  value="<?php if(!empty($_GET["link_prog"])){ echo $_GET["link_prog"] ;}else{echo '0';}?>" readonly>
<input type="hidden" id="tipo_documento"  value="<?php if(!empty($_GET["tipo_documento"])){ echo $_GET["tipo_documento"] ;}else{echo '';}?>" readonly>
<input type="hidden" id="emailCliente"  value="<?php if(!empty($_GET["emailCliente"])){ echo $_GET["emailCliente"] ;}else{echo '';}?>" readonly>
<input type="hidden" id="pedido_integracion"  value="<?php if(!empty($_GET["pedido_integracion"])){ echo $_GET["pedido_integracion"] ;}else{echo '';}?>" readonly>
	


	
	
  <div class="container-fluid min-vh-100 mt-2 " id="divSeguimiento" style="display: none">
	<div class="row  mb-2">
	   <div class="col-12 d-flex align-content-center justify-content-center align-items-center ">
		   <button id="atrasPedidos" class="btn btn-md btn-success shadow"><i class="bi bi-arrow-left"></i>&nbsp;Atras</button>
	   </div>  
	</div>
	<div class="row p-4 mt-2 d-flex align-content-center justify-content-center align-items-center"  >
		<!-- Presupuesto -->
	   <div class="col-md-4">
			<div class="card shadow btn card-btn border border-1 border-secondary-subtle card-btn text-danger" style="min-height: 200px" id="btn_pre_cli">
				<div class="card-title "><h3>Presupuesto por cliente</h3></div>
		       <div class="card-body text-center ">
				  <h1><i class="fa-solid fa-chart-line"></i></h1>
			   </div>
		    </div>
	   </div>
		<!-- dinamica -->
	   <div class="col-md-4">
			<div class="card shadow btn card-btn border border-1 border-secondary-subtle card-btn text-danger"  style="min-height: 200px" id="btn_pre_zona">
				<div class="card-title "><h3>Presupuesto por zonas</h3></div>
		       <div class="card-body text-center">
				  <h1><i class="fa-solid fa-chart-column"></i></h1>
			   </div>
		    </div>
	   </div>
	   <div class="col-md-4">
			<div class="card shadow btn card-btn border border-1 border-secondary-subtle card-btn text-danger"  style="min-height: 200px" id="btn_sorteo">
				<div class="card-title "><h3>Sorteo</h3></div>
		       <div class="card-body text-center">
				  <h1><i class="fa-regular fa-face-smile-beam"></i></h1>
			   </div>
		    </div>
	   </div>
	</div>
	  
	<div class="row card shadow" id="row_report_presupuesto_cli" style="display: none">
		<div class="card-title">
			Presupuesto por cliente
		</div>
	   <div class="card-body">
		   
		   <div class="row">
		     <div class="col-4">
			   <label> Presupuesto total</label>
				<div class="input-group mb-1">
					  <span class="input-group-text" ><i class="fa-solid fa-dollar-sign text-success"></i></span>
					  <input type="text" class="form-control form-control-sm" readonly id="presupuesto_total" aria-describedby="basic-addon1">
			    </div>  
			 </div>
		     <div class="col-4">
			    <label> Valor total pedidos</label>
			    <div class="input-group mb-1">
					<span class="input-group-text" >
						  <i class="fa-solid fa-cart-plus"></i>
					</span>
					<input type="text" class="form-control form-control-sm" readonly id="valor_pedidos_total" aria-describedby="basic-addon1">
				 </div>
			  </div>
		     <div class="col-4">
			    <label>Cumplimiento</label>
				<div class="input-group mb-1">
				   <span class="input-group-text" >
					  <i class="fa-solid fa-percent"></i>
				   </span>
				<input type="text" class="form-control form-control-sm" readonly id="cumplimiento_total" aria-describedby="basic-addon1">
				</div> 
			 </div>
		   </div>
		   <div class="row">
		   	<div class="col-4">
			    <label># Clientes</label>
				<div class="input-group mb-1">
				   <span class="input-group-text" >
					  <i class="fa-solid fa-user-tie"></i>
				   </span>
				<input type="text" class="form-control form-control-sm" readonly id="total_clientes" aria-describedby="basic-addon1">
				</div> 			   
			</div>
		   	<div class="col-4">
			    <label># Clientes con compras</label>
				<div class="input-group mb-1">
				   <span class="input-group-text" >
					  <i class="bi bi-cart-check"></i>
				   </span>
				<input type="text" class="form-control form-control-sm" readonly id="total_clientes_compras" aria-describedby="basic-addon1">
				</div> 			   
			</div>
		   	<div class="col-4">
			    <label>Porcentaje clientes compras</label>
				<div class="input-group mb-1">
				   <span class="input-group-text" >
					  <i class="ri ri-pie-chart-2-line"></i>
				   </span>
				<input type="text" class="form-control form-control-sm" readonly id="pcj_total_clientes_compras" aria-describedby="basic-addon1">
				</div> 			   
			</div>
		   </div>
		   <div class="row">
		   	  <div class="col-12">
			    <label>Valor notas</label>
				<div class="input-group mb-1">
				   <span class="input-group-text" >
					 <i class="fa-solid fa-hand-holding-dollar"></i>
				   </span>
				<input type="text" class="form-control form-control-sm" readonly id="valor_total_notas" aria-describedby="basic-addon1">
				</div> 
			  </div>
		   </div>
	   </div>
	   <div class="col-12" id="report_presupuesto_cli" ></div> 
	</div> 
	  
	<div class="row card shadow" id="row_report_presupuesto_zona" style="display: none">
		
		<div class="card-title">
		  Presupuesto por zona
		</div>
	   <div class="card-body">
		   
		   <div class="row">
		     <div class="col-4">
			   <label> Presupuesto total</label>
				<div class="input-group mb-1">
					  <span class="input-group-text" ><i class="fa-solid fa-dollar-sign text-success"></i></span>
					  <input type="text" class="form-control form-control-sm" readonly id="presupuesto_total_zonas" aria-describedby="basic-addon1">
			    </div>  
			 </div>
		     <div class="col-4">
			    <label> Valor total pedidos</label>
			    <div class="input-group mb-1">
					<span class="input-group-text" >
						  <i class="fa-solid fa-cart-plus"></i>
					</span>
					<input type="text" class="form-control form-control-sm" readonly id="valor_pedidos_total_zonas" aria-describedby="basic-addon1">
				 </div>
			  </div>
		     <div class="col-4">
			    <label>Cumplimiento</label>
				<div class="input-group mb-1">
				   <span class="input-group-text">
					  <i class="fa-solid fa-percent"></i>
				   </span>
				<input type="text" class="form-control form-control-sm" readonly id="cumplimiento_total_zonas" aria-describedby="basic-addon1">
				</div> 
			 </div>
		   </div>
		   <div class="row">
		   	<div class="col-4">
			    <label># Zonas</label>
				<div class="input-group mb-1">
				   <span class="input-group-text" >
					  <i class="fa-solid fa-user-tie"></i>
				   </span>
				<input type="text" class="form-control form-control-sm" readonly id="total_zonas" aria-describedby="basic-addon1">
				</div> 			   
			</div>
		   	<div class="col-4">
			    <label># Zonas con compras</label>
				<div class="input-group mb-1">
				   <span class="input-group-text" >
					  <i class="bi bi-cart-check"></i>
				   </span>
				<input type="text" class="form-control form-control-sm" readonly id="total_zonas_compras" aria-describedby="basic-addon1">
				</div> 			   
			</div>
		   	<div class="col-4">
			    <label>Porcentaje clientes compras</label>
				<div class="input-group mb-1">
				   <span class="input-group-text" i>
					  <i class="ri ri-pie-chart-2-line"></i>
				   </span>
				<input type="text" class="form-control form-control-sm" readonly id="pcj_total_zonas_compras" aria-describedby="basic-addon1">
				</div> 			   
			</div>
		   </div>
	   </div>		
	   <div class="col-12" id="report_presupuesto_zona" ></div> 
	</div>
	<div class="row card shadow " id="row_report_presupuesto_sorteo" style="display: none">
		<div class="card-title">
			SORTEO FERIA ROMA
		</div>
		<div class="card-body">
		<div class="alert alert-warning alert-dismissible fade show" role="alert">
			<i class="bi bi-exclamation-triangle me-1"></i>
			El cliente debe comprar en los <span id="n_lab"></span> participantes con un monto minimo de $100.000 para ganar <b>1</b> boleta, y por cada <b>$100.000</b> adicionales , ganara <b>1</b> boleta mas.	
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
		<table class="table  table-striped table-hover" border="1" cellpadding="4">
			<tbody>
				<tr>
					<td>Codigo sap</td>
					<td id="sorteo_codigo_sap"></td>
				</tr>
				<tr>
					<td>Nombres</td>
					<td id="soporte_nombres"></td>
				</tr>
				<tr>
					<td>Razón comercial</td>
					<td id="soporte_razon_comercial"></td>
				</tr>
				<tr>
					<td>Ciudad</td>
					<td id="soporte_ciudad"></td>
				</tr>
			</tbody>
		</table>
			
		 <div class="row mb-3">
			
		  <div class="col-12">
			  <h5><b>Búsqueda de cliente</b></h5>
			<label class="m-1">Codigo sap </label>
			 <div class="input-group ">
				<span class="input-group-text text-danger">
					<i class="fa-solid fa-magnifying-glass text-success"></i>
				</span>
				<input type="text" id="sorteo_codigo_sap_busqueda" class="form-control form-control-sm border border-0 border-danger border-bottom" />
			  </div>			 
		  </div>	
		 </div>
		   <div class="row">
		     <div class="col-4">
			   <label> Laboratorios cumplidos</label>
				<div class="input-group mb-1">
					  <span class="input-group-text" ><i class="fa-solid fa-flask text-success"></i></span>
					  <input type="text" class="form-control form-control-sm" readonly id="sorteo_lab_cumplidos" aria-describedby="basic-addon1">
			    </div>  
			 </div>
		     <div class="col-4">
			    <label> Laboratorios faltantes</label>
			    <div class="input-group mb-1">
					<span class="input-group-text" >
						  <i class="fa-solid fa-flask text-danger"></i>
					</span>
					<input type="text" class="form-control form-control-sm" readonly id="sorteo_lab_faltantes" aria-describedby="basic-addon1">
				 </div>
			  </div>
		     <div class="col-4">
			    <label>Boletas</label>
				<div class="input-group mb-1">
				   <span class="input-group-text" >
					 <i class="fa-solid fa-ticket text-primary"></i>
				   </span>
				     <input type="text" class="form-control form-control-sm" readonly id="sorteo_boletas" aria-describedby="basic-addon1">
				<!--	 <span class="input-group-text" >
						 <button class="btn btn-sm btn-danger" id="imp-boetas">
						 	 <i class="bi bi-printer "></i> Imprimir
						 </button>
				    </span>-->
				</div> 
			 </div>
		   </div>			
		  <div class="row">
			 <div class="col-12">
			  
			    <div id="result_sorteo"></div> 
			 </div>
		  </div>
		</div>
	</div>
  </div>	
	
  <div class="container-fluid pt-1" id="divPedidos" style="display: ">

			<h1 class="p-1 text-success position-relative mb-3 text-center bg-light" style="min-width: 270px; width:  320px;margin: 0 auto; margin-top: 20px; cursor: pointer" >
			 <!-- <img src="../resources/images/sombrero-navidenio.png" width="25" height="25" class="position-absolute" style="z-index: 9999; top: 2px; left: -10px;">-->
			  <b style="z-index: -1;"><img style="margin-top: -18px; margin-right: -2px" width="35" height="35" id="letter_f" src="../resources/images/letter_f.png" >eria virtual roma</b>
				
			</h1>

              <!-- Bordered Tabs -->
              <ul class="nav nav-tabs shadow " id="borderedTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active text-danger" 
						  id="home-tab" 
						  data-bs-toggle="tab" 
						  data-bs-target="#bordered-home" 
						  type="button" 
						  role="tab" 
						  aria-controls="home" 
						  aria-selected="true">
					 <!-- <i class="fa-solid fa-user-tie m-1"></i>-->
					  <img src="../resources/images/cliente-navidad.png" class="img-tab-btn" width="18" height="18" >
					  Datos cliente</button>
                </li>
                <li class="nav-item" role="presentation"  id="liProductos">
                  <button class="nav-link  text-danger" id="btnProductos" 
						  data-bs-toggle="tab" 
						  data-bs-target="#toma-pedido-home" 
						  type="button" 
						  role="tab" 
						  aria-controls="toma-pedido" 
						  aria-selected="true"
						  disabled
						  >
					  <!--<i class="bi bi-cart3 m-1"></i>-->
					  <img src="../resources/images/busqueda-navidad.png"  class="img-tab-btn" width="18" height="18" >
					  Toma de pedidos
				   </button>
                </li>
                <li class="nav-item" role="presentation" id="liPedidos" >
                  <button class="nav-link text-danger" 
						  id="btnPedidos" 
						  data-bs-toggle="tab" 
						  data-bs-target="#pedido-actual" 
						  type="button" 
						  role="tab" 
						  aria-controls="pedido-actual" 
						  aria-selected="false"
						  disabled
						  >
					  <!--<i class="bi bi-cart3 m-1"></i>-->
					  <img src="../resources/images/carrito-navidad.png"  class="img-tab-btn" width="18" height="18" >
					  Pedido actual
					   <span class="badge text-bg-danger" id="n_items">0</span>
					</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link text-danger" 
						   id="btnTemporales"
						  data-bs-toggle="tab" 
						  data-bs-target="#mis-pedidos" 
						  type="button" 
						  role="tab" 
						  aria-controls="mis-pedidos" 
						  aria-selected="false"
						  >
					  <!--<i class="bi bi-list-check m-1"></i>-->
					   <img src="../resources/images/lista-navidad.png"  class="img-tab-btn" width="18" height="18" >
					  Mis pedidos 
				  </button>
                </li>
              </ul>
<div class="tab-content pt-2 border  border border-1 border-secondary-subtle" id="borderedTabContent">
  <div class="tab-pane fade show active" id="bordered-home" role="tabpanel" aria-labelledby="home-tab">       				
 <div class="row">
    <div class="col-md-4 datos_iniciales"> 
		
		<div class="row mb-2">
			<div class="col-12" id="colCliente"> </div>
		</div>
		<div class="row mb-2">
			<div class="col-12">
				<label class="m-1"> Oficina Ventas (Bodega)</label>
				  <div class="input-group">
					 <span class="input-group-text text-danger">
						<i class="fa-solid fa-map-location-dot text-danger"></i>
					 </span> 
 					<select id="txt_oficina" class="form-control form-control-sm border border-0 border-danger border-bottom"></select>
				  </div>			
			</div>
		</div>
		<div class="row mb-2">
	      <div class="col-12">
			<label class="m-1">Destinatario</label>
			 <div class="input-group ">
			   <span class="input-group-text text-danger">
				  <i class="fa-solid fa-hotel"></i>
			   </span> 
				<select id="txt_destinatario" class="form-control form-control-sm border border-0 border-danger border-bottom"></select>
			 </div>
		  </div>
		</div>
		<div class="row mb-2">
			<div class="col-md-5">
				<label class="m-1">Teléfono</label>
				<div class="input-group ">
					 <span class="input-group-text text-danger">
						<i class="fa-solid fa-mobile-screen text-danger"></i> 
					 </span>
					 <input type="text" id="txt_tel" class="form-control form-control-sm border border-0 border-danger border-bottom" readonly>
				</div>			
			</div>
			<div class="col-md-7">
				 <label class="m-1">Email</label>
				 <div class="input-group ">
					 <span class="input-group-text text-danger">
				 		<i class="fa-solid fa-at text-danger"></i> 
					 </span>
					 <input type="text" id="txt_mail" class="form-control form-control-sm border border-0 border-danger border-bottom" readonly>
				  </div>
			</div>
		</div>
		<div class="row mb-2" >
		  <div class="col-md-5" id="trCondicion">
				<label class="m-1">Plazo</label>
				 <div class="input-group ">
					 <span class="input-group-text text-danger">
						<i class="fa-regular fa-calendar-plus text-danger"></i>
					 </span>
					 <input type="text" id="txt_plazo" class="form-control form-control-sm border border-0 border-danger border-bottom" readonly/>
				  </div>
			</div>
			<div class="col-md-7 mb-2 cl_cupo">
				<label class="m-1">Cupo Crédito</label>
				 <div class="input-group ">
					 <span class="input-group-text text-danger">
						<i class="fa-solid fa-credit-card text-danger"></i>
					 </span>
				    <input type="text" id="txt_cupo" class="form-control form-control-sm border border-0 border-danger border-bottom" readonly>
				  </div> 			
			</div>
		</div>
		<div class="col-12 mb-2" style="display: none">
				<label class="m-1">Pedido de Integración</label>
				 <div class="input-group mb-3">
					 <span class="input-group-text text-danger">
						<i class="fa-solid fa-toggle-off text-danger"></i>
					 </span>
				   <select id="TxtIntegracion" class="form-control form-control-sm .select-pedido-integracion">
					   <option value="S" selected>SI</option>
					</select>
				  </div>		
		</div>
		<div class="col-12 p-2" >
			<div class="btn-group" role="group" aria-label="Basic example">
 				<button type="button" class="btn btn-sm btn-outline-success" id="btnLimpiar" onClick="Limpiar();">
                  <i class="fa-regular fa-file"></i> Nuevo
                 </button>
                 <button type="button" class="btn btn-sm btn-outline-success" id="btnMas" data-bs-toggle="modal" data-bs-target="#ModalMasCliente" onClick="Comportamiento()">
                  <span class="bi bi-info-circle" aria-hidden="true"></span> Mas
                 </button>
				 <!--<button type="button" class="btn btn-sm btn-success" id="btnDescuentos" style="display: none">
                  <i class="fa-solid fa-chart-column m-1"></i> Descuentos para ti!
                 </button>-->
                
				 <button type="button" class="btn btn-sm btn-outline-success" id="btnFeriaVirtual" style="display: none">
				  <i class="fa-regular fa-eye"></i> Seguimiento
			 	 </button>
			
				 <button type="button" class="btn btn-sm btn-danger" id="btnRegistrarUsuario" style="display: none">
				  <i class="ri ri-user-add-fill"></i>Usuario+
			 	 </button>
				
				 <button style="display: <?php
						 	if($_SESSION["ses_RolesId"]=='10'){
								echo 'none';
							}
						 ?>" type="button" class="btn btn-sm btn-success" id="btnAsistencia" style="display:;">
				  <i class="fa-solid fa-user-doctor"></i>Clientes 
			 	 </button>
			
			</div>
		  </div>
	   </div>
	  <div class="col-md-8">
  
              <!-- Slides with captions -->
              <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                  <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                  <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                  <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
	            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 3"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <img src="../resources/images/banner_feria_1_2200.png" class="d-block w-100 img-fluid" alt="..."  height="800">
                    <div class="carousel-caption d-none d-md-block">
                     <!-- <h5>First slide label</h5>
                      <p>Some representative placeholder content for the first slide.</p>-->
                    </div>
                  </div>
                  <div class="carousel-item">
                    <img src="../resources/images/banner_feria_2_2200.png" class="d-block w-100 img-fluid" alt="..."  height="800">
                    <div class="carousel-caption d-none d-md-block">
                      <!--<h5>Second slide label</h5>
                      <p>Some representative placeholder content for the second slide.</p>-->
                    </div>
                  </div>
                  <div class="carousel-item">
                    <img src="../resources/images/banner_feria_3_2200.png" class="d-block w-100 img-fluid" alt="..."  height="800">
                    <div class="carousel-caption d-none d-md-block">
                      <!--<h5>Third slide label</h5>
                      <p>Some representative placeholder content for the third slide.</p>-->
                    </div>
                  </div>
                  <div class="carousel-item">
                    <img src="../resources/images/banner_feria_4_2200.png" class="d-block w-100 img-fluid" alt="..."  height="400">
                    <div class="carousel-caption d-none d-md-block">
                      <!--<h5>Third slide label</h5>
                      <p>Some representative placeholder content for the third slide.</p>-->
                    </div>
                  </div>
                  <div class="carousel-item">
                    <img src="../resources/images/banner_feria_5_2200.png" class="d-block w-100 img-fluid" alt="..."  height="400">
                    <div class="carousel-caption d-none d-md-block">
                      <!--<h5>Third slide label</h5>
                      <p>Some representative placeholder content for the third slide.</p>-->
                    </div>
                  </div>
                </div>
			 </div>
           </div>					
		</div>
	</div>
<div class="tab-pane fade show min-vh-100" id="toma-pedido-home" role="tabpanel" aria-labelledby="toma-pedido-tab">
  
   <div class="container_vtotal">
     <!-- <table class="tableinfo" align="center">
            <thead>
              <tr>
                <th align="center">&nbsp; &nbsp; &nbsp;VALOR TOTAL PEDIDO - <input type="text" id="txt_total" class="sin_borde" readonly disabled></th>
              </tr>
            </thead>
      </table>-->
	   
	 <div class="card shadow-sm m-1 w-25" style="min-width: 300px">
				
		<div class="input-group ">
		<span class="input-group-text text-danger text-danger">
		 <label class="m-1">Valor total</label>
		</span>
		  <input type="text" id="txt_total" class="form-control form-control-sm border-0 border bg-info-light" readonly >  
		</div>
	    
	 </div>  
	   
   </div>	
   <table class="table table-sm" width="100%">

           <tr>
               <td width="100%">
				
			     <div class="input-group ">
					<span class="input-group-text text-danger text-danger">
						<i class="bi bi-search text-danger"></i>
					</span>
					 <input type="text" id="txt_bproductos" placeholder="F2 - Descripción de producto : Nombre - Codigo - Grupo" class="form-control border border-1 border-danger" tabindex="1">
				</div> 
			  </td>       
               <!--<td width="5%" align="center">
                 <button type="button" class="btn btn-sm btn-outline-success" id="btnMas" data-bs-toggle="modal" data-bs-target="#ModalAjustesBusqueda">
                  <i class="ri-settings-3-line" ></i>
                </button>
               </td>-->
            </tr>
	        <tr>
             <td colspan="2">
               <div id="n_resultados" class="n_resultados"></div>
             </td>
           </tr>
    </table> 
    <div id="dvResultProductos" class="mt-3"></div>
</div>
 <div class="tab-pane fade" id="pedido-actual" role="tabpanel" aria-labelledby="pedido-actual-tab">  
        <div id="dvResultPedidos"></div> 
 </div>
 <div class="tab-pane fade min-vh-100 p-2" id="mis-pedidos" role="tabpanel" aria-labelledby="mis-pedidos">
	   <div class="row mb-3 p-2">
		
	   	<div class="col-12 ">
			 <p>Exportar pedidos</p> 
		   <button class="btn btn-sm btn-outline-success" id="btn-exportar-excel-feria"><i class="fa-solid fa-file-excel m-1"></i>Excel</button>
		   <button class="btn btn-sm btn-outline-danger" id="btn-exportar-pdf-feria"><i class="fa-solid fa-file-pdf m-1"></i>Pdf</button> 
		</div>
	   </div>
     <!-- <div class="input-group mb-2">
		<input type="text" class="form-control form-control-sm" id="filtrar_pedido" >
		<span class="input-group-text  btn btn-outline-danger">
			<i class="fa-solid fa-magnifying-glass"></i>
		</span> 
	  </div>-->   
	 
	    <div id="DvRecuperables"></div>
	 
   </div>
</div><!-- End Bordered Tabs -->
</div>
	
    
  <div id="Bloquear" style="display:none;"></div>  
  <div class="centrado-porcentual" style="display:none;background-color:transparent; width:30%; height:250px"></div>  	
	

	
	
<!-- MODALES -->	
	
 <div id="ModalModificarPresupuesto" class="modal fade " tabindex="-1">
    <div class="modal-dialog">
        <!-- Modal content-->
       <div class="modal-content">
          <div class="modal-header">
            
            <h5 class="modal-title">MODIFICAR PRESUPUESTO</h5>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body pre-scrollable">
 			<label class="m-1">Presupuesto</label>
			  <input type="hidden" id="codigo_sap_presupuesto" readonly  value="0">
			<div class="input-group ">
				<span class="input-group-text text-danger">
					<i class="fa-solid fa-credit-card text-danger"></i>
				</span>
				 <input type="text" id="valor_presupuesto" value="0" class="form-control form-control-sm border border-0 border-danger border-bottom" >
				<button class="btn btn-sm btn-outline-danger" id="modificar_presupuesto">Modificar</button>
			</div> 	
		 </div>
	  </div>
  </div>
</div>
	
	
		   
 <div id="ModalCorte" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            
            <h4 class="modal-title">Pedidos feria</h4>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
			  <div id="listados_pedidos_corte" class="table-responsive-md">
			  </div>
		  </div>
		 </div>
	 </div>
  </div>
		
<div class="modal fade" id="ModalInfoBonificados"  tabindex="-1">
   <div class="modal-dialog modal-lg">
     <div class="modal-content">
       <div class="modal-header">
             <h4 class="modal-title">INFORMACION DE BONIFICADOS</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body" id="ContenidoInfoBonificados">
	   </div>
       <div class="modal-footer">
           <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
       </div>
	 </div>
	</div>
</div>
		   
 <div id="ModalInfoMaterial" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            
            <h4 class="modal-title">Datos adicionales de productos</h4>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">  
			  
 <!-- Default Tabs -->
              <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item text-danger" role="presentation">
                  <button class="nav-link active text-danger" 
						  id="home-tab" 
						  data-bs-toggle="tab" 
						  data-bs-target="#ContenidoInfoMateriales" 
						  type="button" 
						  role="tab" 
						  aria-controls="ContenidoInfoMateriales" 
						  aria-selected="true">
					  <i class="fa-solid fa-circle-info text-danger"></i>&nbsp; Información
					</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link text-danger" 
						  id="profile-tab" 
						  data-bs-toggle="tab" 
						  data-bs-target="#ContenidoShoppingMateriales" 
						  type="button" 
						  role="tab" 
						  aria-controls="ContenidoShoppingMateriales" 
						  aria-selected="false">
					   <i class="ri ri-shopping-bag-line" ></i> &nbsp;Shopping
					</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link text-danger" 
						  id="contact-tab" 
						  data-bs-toggle="tab" 
						  data-bs-target="#ContenidoHuellaMateriales" 
						  type="button" 
						  role="tab" 
						  aria-controls="ContenidoHuellaMateriales" 
						  aria-selected="false">
					 <i class="fa-solid fa-fingerprint"></i> Huella
				  </button>
                </li>
              </ul>
              <div class="tab-content pt-2" id="myTabContent">
                <div class="tab-pane fade show active" id="ContenidoInfoMateriales" role="tabpanel" aria-labelledby="home-tab">
    
                </div>
                <div class="tab-pane fade show"  id="ContenidoShoppingMateriales"role="tabpanel" aria-labelledby="profile-tab">
                    <table class="table table-sm table-striped table-hover table-bordered"  width="100%">
                         <tbody>
                                 <tr>
                                    <td width="30%">CODIGO</td>
                                    <td><input type="text" class="form-control form-control-sm" id="shoping_codmaterial" readonly> </td>
                                 </tr>
                                 <tr>
                                    <td>DESCRIPCIÓN</td>
                                    <td><input type="text" class="form-control form-control-sm" id="shoping_descripcion" readonly> </td>
                                 </tr>
                                 <tr>
                                    <td>VALOR ACTUAL</td>
                                    <td><input type="text" class="form-control form-control-sm" id="shoping_preciomaterial" readonly> </td>
                                 </tr>
                                 <tr>
                                    <td>COMPETENCIA</td>
                                    <td><select id="shoping_competencia" class="form-control form-control-sm"></select></td>
                                 </tr>
                                 <tr>
                                    <td>VALOR COMPETENCIA</td>
                                    <td><input type="number" class="form-control form-control-sm" id="shoping_valor"></td>
                                </tr> 
                                <tr>
                                    <td>OBSERVACIÓN</td> 
                                    <td><input type="text" class="form-control form-control-sm" id="shoping_observacion"></td>
                                </tr>    
                                <tr>
                                 <td colspan="2"><button type="button" class="btn btn-sm btn-outline-success" onClick="GuardarShoping();"><i class="bi  bi-save2"></i>&nbsp;Guardar</button></td>
                                </tr>
                             </tbody>
                         </table>
                </div>
                <div class="tab-pane fade show" id="ContenidoHuellaMateriales" role="tabpanel" aria-labelledby="contact-tab">
                          <div class="alert alert-warning alert-dismissible" role="alert">
                           <strong>NOTA!</strong> 
                           Ingreso de huella de faltantes para solicitar compra.
                         </div>
                         <input type="hidden" class="form-control" id="huella_stock" readonly> 
                         <input type="hidden" class="form-control" id="huella_dcto" readonly> 
                         <table class="table table-sm table-striped table-hover table-bordered" width="100%">
                             <thead></thead> 
                             <tbody>
                                 <tr>
                                    <td width="30%">CODIGO</td>
                                    <td><input type="text" class="form-control" id="huella_codmaterial" readonly> </td>
                                 </tr>
                                 <tr>
                                    <td>DESCRIPCIÓN</td>
                                    <td><input type="text" class="form-control" id="huella_descripcion" readonly> </td>
                                 </tr>
                                 <tr>
                                    <td>CANTIDAD</td>
                                    <td><input type="number" class="form-control" id="huella_cantidad" > </td>
                                 </tr>
                                <tr>
                                    <td>OBSERVACIÓN</td> 
                                    <td><input type="text" class="form-control" id="huella_notas"></td>
                                </tr>    
                                <tr>
                                 <td colspan="2"><button type="button" class="btn btn-sm btn-success" onClick="GuardarHuella();">Guardar</button></td>
                                </tr>
                             </tbody>
                            </table>
                </div>
              </div><!-- End Default Tabs -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div> 
	
<div class="modal fade" id="ModalAjustesBusqueda"  tabindex="-1">
   <div class="modal-dialog modal-lg">
     <div class="modal-content">
       <div class="modal-header">
            <h4 class="modal-title">Configuración de bÚsqueda</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body">
                      <table class="table table-sm table-bordered table-hover table-striped" width="100%">
                       <tr>
                           <td>Stock</td>
                           <td><div id="DvChkStock" class="DivCheckBox DivCheckBoxTrue"></div></td>
                       </tr>
                       <tr>
                           <td>Descuentos</td>
                           <td><div id="DvChkDctos" class="DivCheckBox"></div></td>
                       </tr>
                       <tr>
                           <td>Bonificados</td>
                           <td><div id="DvChkBonif" class="DivCheckBox"></div></td>
                       </tr>
                       <tr>
                           <td>Productos Nuevos (90 Dias)</td>
                           <td><div id="DvChkNuevos" class="DivCheckBox"></div></td>
                       </tr>
                       <tr>
                           <td>KIT'S</td>
                           <td><div id="DvChkKits"  class="DivCheckBox"></div></td>
                       </tr>
					    <tr>
                           <td>Proveedores</td>
                           <td><select id="txtGrupoArticulo" class="form-control form-control-sm" style="width:100%"></select></td>
                       </tr>
                       <tr>
                           <td>Numero Temporal</td>
                           <td align="center"><input type="text" id="txt_numero" class="form-control form-control-sm" readonly></td>
                       </tr>
                       <tr>
                           <td>Numero SAP</td>
                           <td align="center"><input type="text" id="txt_numero_sap" class="form-control form-control-sm" readonly></td>
                       </tr>
                       <tr>
                           <td>Importar Plano [codigo,cantidad]</td>
                           <td align="center"><input type="file" id="filename" name="filename" class="form-control form-control-sm" readonly></td>
                       </tr>
                     </table>
       </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Close</button>
        </div>
     </div>
   </div>
</div><!-- End Basic Modal-->

	
<div class="modal fade" id="ModalClientesEvento" tabindex="-1">
  <div class="modal-dialog modal-fullscreen" >
     <div class="modal-content" >
       <div class="modal-header">
           <h5 class="modal-title">CLIENTES PARTICIPANTES </h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
        <div class="modal-body">
			<div id="list-clientes-feria" class="table-responsive-md">
				
			</div>
		 </div>
	  </div>
	</div>
</div>
	
	
	
<div class="modal fade" id="modal_registro_usuarios" tabindex="-1">
  <div class="modal-dialog modal-lg">
     <div class="modal-content">
       <div class="modal-header">
           <h5 class="modal-title">REGISTRO DE USUARIOS </h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
        <div class="modal-body">
			
              <!-- Default Tabs -->
              <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Registro</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Usuarios registrados</button>
                </li>

              </ul>
              <div class="tab-content pt-2" id="myTabContent">
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
      				<label class="m-1">Usuario de ADG</label>
				 <div class="input-group mb-3">
					 <span class="input-group-text text-danger">
						<i class="fa-solid fa-user text-danger"></i>
					 </span>
				    <input type="text" id="usuario_registro" class="form-control form-control-sm border border-0 border-danger border-bottom" placeholder="" >
				  </div> 
			      <button class="btn btn-outline-danger" id="registrar_usuario">Registrar</button>
                </div>
                <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    <div id="result_ususarios_registrados"></div>
                </div>
              </div><!-- End Default Tabs -->			
		 </div>
	  </div>
	</div>
</div>
	

<div class="modal fade" id="ModalMasCliente" tabindex="-1">
  <div class="modal-dialog modal-lg">
     <div class="modal-content">
       <div class="modal-header">
           <h5 class="modal-title">INFORMACION ADICIONAL DE CLIENTE</h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
     <div class="modal-body">
                   <table class="table table-sm table-hover table-striped" width="100%">
                      <tbody>
                        <tr>
                          <td>Codigo</td>
                          <td><input type="text" id="txt_codigoSap" class="form-control form-control-sm" readonly></td>
                        <tr> 
                        </tr>
                        <tr> 
                          <td>Nit</td>
                          <td><input type="text" id="txt_nit" class="form-control form-control-sm" readonly></td>
                        </tr>
                        <tr> 
                          <td>Ciudad</td>
                          <td><input type="text" id="txt_ciudad" class="form-control form-control-sm" readonly></td>
                        </tr>
                          <td>Direccion</td>
                          <td><input type="text" id="txt_dir" class="form-control form-control-sm" readonly></td>
                        </tr>
                        <tr> 
                          <td>Vendedor</td>
                          <td>
					          <div class="input-group">
							    <span class="input-group-addon" id="basic-addon1">
								  <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                                </span>
							    <input type="text" class="form-control form-control-sm" id="txt_vendedor" aria-describedby="basic-addon1" readonly>
							  </div>
						      <div class="input-group">
							    <span class="input-group-addon" id="basic-addon1">
								  <span class="glyphicon glyphicon-earphone" aria-hidden="true"></span>
                                </span>
							    <input type="text" class="form-control form-control-sm" id="txt_vendedor_tel" aria-describedby="basic-addon1" readonly>
							  </div>
						  </td>
                       </tr>
                       <tr> 
                          <td>Televendedor</td>
                          <td>
							  <div class="input-group">
							    <span class="input-group-addon" id="basic-addon1">
								  <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                                </span>
							    <input type="text" class="form-control form-control-sm" id="txt_televendedor" aria-describedby="basic-addon1" readonly>
							  </div>
						      <div class="input-group">
							    <span class="input-group-addon" id="basic-addon1">
								  <span class="glyphicon glyphicon-earphone" aria-hidden="true"></span>
                                </span>
							    <input type="text" class="form-control form-control-sm" id="txt_televendedor_tel" aria-describedby="basic-addon1" readonly>
							  </div>
						  </td>
                       </tr>
                       <tr>
                          <td>Lista Precios</td>
                          <td><input type="text" id="txt_lista" class="form-control" readonly></td>
                       </tr>
                       <tr>
                          <td>Condicion de Pago</td>
                          <td><input type="text" id="txt_condicion" class="form-control" readonly></td>
                       </tr>
                       <tr> 
                          <td>Institucionales</td>
                          <td><input type="text" id="txt_institucional" class="form-control" readonly>
                       </tr>
                       <tr>     
                          <td>Controlados</td>
                          <td><input type="text" id="txt_controlado" class="form-control" readonly></td>
                       </tr>    
                       <tr>
                          <td>Descuento Financiero %</td>
                          <td><input type="text" id="txt_descuento" class="form-control" readonly/></td>
                       </tr>
					   <tr>
                            <td>Grupo 1</td>
                            <td><select class="form-control" id="txtGrp1" readonly disabled></select></td>
                        </tr>
                        <tr>
                            <td>Grupo 2</td>
                            <td><select class="form-control" id="txtGrp2" readonly disabled></select></td>
                        </tr>
                       </tbody>
                      </table>
     </div>
     <div class="modal-footer">
         <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
     </div>
    </div>
   </div>
</div><!-- End Basic Modal-->	
	
	
<div class="modal fade" id="ModalOpciones" tabindex="-1">
  <div class="modal-dialog modal-lg">
     <div class="modal-content">
       <div class="modal-header">
           <h5 class="modal-title">Menú de opciones</h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="ContenidoModalOpciones">
                 <!--inputs ocultos---> 
                  <input type="hidden" id="ped_valor_total"  disabled readonly>
                  <input type="hidden" id="ped_listdestinatario" disabled readonly>
                  <input type="hidden" id="ped_bodega"       disabled readonly>
                  <input type="hidden" id="ped_codigo_sap"   disabled readonly>
                  <input type="hidden" id="ped_transferido"  disabled readonly>
                  <input type="hidden" id="ped_gestion"      disabled readonly>
 <div class="container-fluid">
   <div class="row">
     <div class="col-md-5 col-sm-12">  
       <!-- Default Card -->
        <div class="card card shadow border border-1 border-secondary-subtle">
            <div class="card-body">
              <h5 class="card-title p-1 text-danger">Opciones</h5>
          
				<ul class="list-group  d-flex justify-content-start " style="text-align: left">
				  <li class="list-group-item list-group-item-action w-100 p-0">
					 <button  id="btnMenu1" onClick="GuardarDirecto()" title="Guardar Directo" 
							 class="btn btn-outline-light w-100 text-secondary" >
					    <i class="bi bi-save2 text-danger"></i> &nbsp;Guardar
					 </button>
				  </li>
				  <li class="list-group-item  list-group-item-action w-100 p-0">
					 <button  id="btnMenu2" title="Recuperar pedido"
							 class="btn btn-outline-light w-100 text-secondary"  >
					    <i class="fa-solid fa-rotate-right text-danger"></i> &nbsp;Recuperar
					 </button>  
				  </li>
				  <li class="list-group-item list-group-item-action w-100 p-0">
					 <button  id="btnMenu3" onClick="VisualizarPedido()" title="Visualizar PDF"
							 class="btn btn-outline-light w-100 text-secondary"  >
					    <i class="fa-regular fa-file-pdf text-danger"></i> &nbsp;Visualizar
					 </button>  
				  </li>
				  <li class="list-group-item list-group-item-action w-100 p-0">
					 <button  id="btnMenu4" onClick="Rastreo()"title="Rastrear Pedido"
							 class="btn btn-outline-light w-100 text-secondary"  >
					    <i class="fa-solid fa-satellite-dish text-danger"></i> &nbsp;Rastreo
					 </button>  
				  </li>
				  <li class="list-group-item list-group-item-action w-100 p-0">
					 <button  id="btnMenu5" onClick="EliminarPedido()"  title="Eliminar"
							 class="btn btn-outline-light w-100 text-secondary"  >
					    <i class="fa-regular fa-trash-can text-danger"></i> &nbsp;Eliminar
					 </button>  
				  </li>
				</ul>
            </div>
        </div><!-- End Default Card -->
   </div>
   <div class="col-md-7 col-sm-12" id="Result">
       <div class="card shadow border border-1 border-secondary-subtle">
           <div class="card-body">
              <h5 class="card-title  p-1 text-danger">Flujo de documentos</h5>
				<table class="table table-sm table-striped table-hover" width="100%">
							  <tr>
                               <td>Usuario ADG</td>
                               <td><input type="text" id="ped_usuario" class="form-control form-control-sm" disabled readonly></td>
                              </tr>
                              <tr>
                               <td>Pedido ADG</td>
                               <td><input type="text" id="ped_numero" class="form-control form-control-sm" disabled readonly></td>
                              </tr>
                              <tr>
                               <td>Pedido SAP</td>
                               <td><input type="text"  id="ped_numero_sap" class="form-control form-control-sm" disabled readonly></td>
                              </tr>
                              <tr>
                               <td>Entrega</td>
                               <td><input type="text"  id="ped_entrega"  class="form-control form-control-sm" disabled readonly></td>
                              </tr>
                              <tr>
                               <td>Orden</td>
                               <td><input type="text"  id="ped_ot" class="form-control form-control-sm" disabled readonly></td>
                              </tr>
                              <tr>
                               <td>Factura</td>
                               <td><input type="text" id="ped_factura" class="form-control form-control-sm" disabled readonly></td>
                              </tr>
                              <tr>
                               <td>Notas</td>
                               <td><textarea id="NotasRapidas" placeholder="Notas de pedidos" class="notas form-control-sm form-control table-warning"></textarea></td>
                              </tr>
                              <tr>
                               <td colspan="2">
                                 <button type="button" class="w-100 btn btn-sm btn-outline-danger"  onClick="NotaRapida();" id="btnNotaRapida">
                                  <i class="fa-regular fa-square-check"></i>  Salvar Nota
                                 </button>
                               </td>
                              </tr>
                            </table>    
            </div>
          </div><!-- End Default Card -->
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
	
    <div id="ModalPDF" class="modal fade " tabindex="-1">
      <div class="modal-dialog modal-lg">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">VISUALIZAR PEDIDO</h4>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="ContenidoPDF">              
          </div>
          <div class="modal-footer">
           <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-success btn-sm" onClick="DescargarExcel('PEDIDO')">
               <span class="glyphicon glyphicon-cloud-download" aria-hidden="true"></span> Excel
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">Cerrar</button>
           </div>
          </div>
        </div>
      </div>
    </div>
	
	
    <div id="ModalRastreo" class="modal fade " tabindex="-1">
      <div class="modal-dialog modal-lg">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            
            <h5 class="modal-title">SEGUIMIENTO / RASTREO DE PEDIDOS</h5>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body pre-scrollable">
			  <!--
            <table class="table table-sm table-bordered table-striped table-hover" border="1" width="100%">
            <tbody>
                <tr><td>Organización</td><td id="txt_org"></td></tr>
                <tr><td>Bodega</td><td id="txt_bodega"></td></tr>
                <tr><td>Nombres</td><td id="txt_nombres"></td></tr>
                <tr><td>Identificación</td><td id="txt_nit"></td></tr>
                <tr><td>Codigo Interno:</td><td id="txt_cod_sap"></td></tr>
                <tr><td>Direcciòn:</td><td id="txt_direccion"></td> </tr>
                      
                <tr>
                 <td colspan="4"><b>PEDIDO</b></td>
                </tr>
                <tr>
                 <td>Numero Pedido</td>
                 <td id="txt_num_ped"></td>
                </tr>
                <tr>
                 <td>Usuario Pedido</td>
                 <td id="txt_usuario_ped"></td>
                </tr>
                <tr>
                 <td>Fecha</td>
                 <td id="txt_fecha_ped"></td>
                </tr>
                <tr>
                 <td>Usuario OT</td>
                 <td id="txt_usuario_ot"></td>
                </tr>	
                         
                <tr>
                 <td colspan="4"><b>ENTREGA</b></td>
                </tr>
                <tr>
                 <td>Numero entrega</td>
                 <td id="txt_num_ent"></td>
                </tr>
                <tr>
                 <td>Usuario Entrega</td>
                 <td id="txt_usuario_ent"></td>
                </tr>
                <tr>
                 <td>Fecha</td>
                 <td id="txt_fecha_ent"></td>
                </tr>	
                                 
                <tr><td colspan="4"><b>SEPARACION</b></td></tr>
                <tr>
                  <td>Usuario</td>
                  <td id="txt_usuario_sep"></td>
                </tr>
                <tr>
                  <td>Numero OT.</td>
                  <td id="txt_numero_ot"></td>
                </tr>
                <tr>
                  <td>Fecha OT</td>
                  <td id="txt_fecha_ot"></td>
                </tr>
                <tr>
                  <td>Fecha Inicio</td>
                  <td id="txt_fecha_ini_ot"></td>
                </tr>
                <tr>
                  <td>Fecha Fin</td>
                  <td id="txt_fecha_fin_ot"></td>
                </tr>
                
                <tr><td colspan="3"><b>FACTURACION</b></td></tr>
                <tr>
                  <td>Usuario</td>
                  <td id="txt_usuario_fact"></td>
                </tr>
                <tr>
                  <td>Numero/Tipo</td>
                  <td id="txt_numero_fact"></td>
                </tr>
                <tr>
                  <td>Fecha Inicio</td>
                  <td id="txt_fecha_ini_fact"></td>
                </tr>
                <tr>
                  <td>Fecha Fin</td>
                  <td id="txt_fecha_fin_fact"></td>
                </tr>
               
                <tr><td colspan="3"><b>EMPAQUE</b></td></tr>
                <tr>
                  <td>Usuario</td>
                  <td id="txt_usuario_emp"></td>
                </tr>
                <tr>
                  <td>Fecha Inicio</td>
                  <td id="txt_fecha_ini_emp"></td>
                </tr>
                <tr>
                  <td>Fecha Fin</td>
                  <td id="txt_fecha_fin_emp"></td>
                </tr>
                <tr>
                  <td>N° Bolsas</td>
                  <td id="txt_bolsas_emp"></td>
                </tr>
                <tr>
                  <td>N° Paquetes</td>
                  <td id="txt_paquetes_emp"></td>
                </tr>
                <tr>
                  <td>N° Cajas</td>
                  <td id="txt_cajas_emp"></td>
                </tr>    
              
                <tr><td colspan="6"><b>TRANSPORTE</b></td></tr>
                <tr>
                  <td>Usuario</td>
                  <td id="txt_usr_ent" colspan="3"></td>
                </tr>
                <tr>
                  <td>Fecha Inicio</td>
                  <td id="txt_fhini_ent"></td>
                </tr>
                <tr>
                  <td>Fecha Fin</td>
                  <td id="txt_fhfin_ent"></td>
                </tr>    
                <tr> 
                  <td># Guia</td>
                  <td id="txt_guia">'+data[0].GUIA+'</td>
                </tr>
                <tr>  
                  <td align="left">Nota</td>
                  <td id="txt_nota"></td>
                </tr>
            </tbody>
            </table>-->
<div class="container-fluid div_rastreo">
	<div class="row">
		<div class="col-12">
			<table class="table table-sm table-bordered table-striped table-hover info-material" border="1" width="100%">
            		  <tbody>
						<tr><td>Organización</td><td id="txt_org"></td></tr>
						<tr><td>Bodega</td><td id="txt_bodega"></td></tr>
						<tr><td>Nombres</td><td id="txt_nombres"></td></tr>
						<tr><td>Identificación</td><td id="txt_nit"></td></tr>
						<tr><td>Codigo Interno:</td><td id="txt_cod_sap"></td></tr>
						<tr><td>Direcciòn:</td><td id="txt_direccion"></td> </tr>	
					   </tbody>
			</table>
		</div>
	</div>
    <div class="row ">
      <div class="col-md-12">
        <div class="card ">
           <div class="card-body ">
             <div id="content" style="width: 100%">
                 <ul class="timeline " >
                     <li class="event" id="li_pedido" data-date="">
                       <h2 class="badge bg-light p-2" id="estado_rastreo_pedido"><i class="fa-regular fa-pen-to-square"></i> &nbsp;Pedido</h2>
                        <p>
					      <table class="table table-sm table-striped table-borderless table-hover" id="table_pedido" cellpadding="4">
				
							<tr>
							 <td>Numero Pedido</td>
							 <td id="txt_num_ped"></td>
							</tr>
							<tr>
							 <td>Usuario Pedido</td>
							 <td id="txt_usuario_ped"></td>
							</tr>
							<tr>
							 <td>Fecha</td>
							 <td id="txt_fecha_ped"></td>
							</tr>
							<tr>
							 <td>Usuario OT</td>
							 <td id="txt_usuario_ot"></td>
							</tr>		
						</table>
					 </p>
                    </li>
                    <!--<li class="event" id="li_entrega" data-date="">
                        <h3  class="badge bg-light p-2" id="estado_rastreo_entrega">Entrega</h3>
                        <p>
						  <table id="table_entrega" class="table table-sm table-bordered table-hover table-striped">
							<tr>
							 <td>Numero entrega</td>
							 <td id="txt_num_ent"></td>
							</tr>
							<tr>
							 <td>Usuario Entrega</td>
							 <td id="txt_usuario_ent"></td>
							</tr>
							<tr>
							 <td>Fecha</td>
							 <td id="txt_fecha_ent"></td>
							</tr>
							 </tr>
						  </table>
						</p>
                    </li>-->
                    <li class="event" id="li_separa" data-date="">
                        <h3  class="badge bg-light p-2" id="estado_rastreo_separa">Separación</h3>
                        <p>
						 <table id="table_separa"  class="table table-sm table-borderless table-hover table-striped" cellpadding="4">
							<tr>
							  <td>Usuario</td>
							  <td id="txt_usuario_sep"></td>
							</tr>
							<tr>
							  <td>Numero OT.</td>
							  <td id="txt_numero_ot"></td>
							</tr>
							<tr>
							  <td>Fecha OT</td>
							  <td id="txt_fecha_ot"></td>
							</tr>
							<tr>
							  <td>Fecha Inicio</td>
							  <td id="txt_fecha_ini_ot"></td>
							</tr>
							<tr>
							  <td>Fecha Fin</td>
							  <td id="txt_fecha_fin_ot"></td>
							</tr>						
						 </table>
						</p>
                    </li>
     <li class="event" id="li_fact" data-date="">
          <h3  class="badge bg-light p-2" id="estado_rastreo_fact">Facturacion</h3>
         <p>
		    <table id="table_fact"  class="table table-sm table-borderless table-hover table-striped">
			   <tr>
				<td>Usuario</td>
				<td id="txt_usuario_fact"></td>
				</tr>
				<tr>
					<td>Numero/Tipo</td>
					<td id="txt_numero_fact"></td>
				</tr>
					<tr>
					  <td>Fecha Inicio</td>
					  <td id="txt_fecha_ini_fact"></td>
					</tr>
					<tr>
					  <td>Fecha Fin</td>
					  <td id="txt_fecha_fin_fact"></td>
					</tr>	
				  </table>
				</p>
       </li>
       <li class="event" id="li_emp" data-date="">
              <h3  class="badge bg-light p-2" id="estado_rastreo_emp">Empaque</h3>
              <p>
			  <table id="table_emp"  class="table table-sm table-borderless table-hover table-striped">
				<tr>
                  <td>Usuario</td>
                  <td id="txt_usuario_emp"></td>
                </tr>
                <tr>
                  <td>Fecha Inicio</td>
                  <td id="txt_fecha_ini_emp"></td>
                </tr>
                <tr>
                  <td>Fecha Fin</td>
                  <td id="txt_fecha_fin_emp"></td>
                </tr>
                <tr>
                  <td>N° Bolsas</td>
                  <td id="txt_bolsas_emp"></td>
                </tr>
                <tr>
                  <td>N° Paquetes</td>
                  <td id="txt_paquetes_emp"></td>
                </tr>
                <tr>
                  <td>N° Cajas</td>
                  <td id="txt_cajas_emp"></td>
                </tr> 
			  </table>
			</p>
          </li>
			
       <li class="event" id="li_desp" data-date="">
          <h3  class="badge bg-light p-2" id="estado_rastreo_desp">Despacho</h3>
            <p>
			<table id="table_desp"  class="table table-sm table-borderless table-hover table-striped" cellpadding="4">
 				<tr>
                  <td>Usuario</td>
                  <td id="txt_usr_ent" colspan="3"></td>
                </tr>
                <tr>
                  <td>Fecha Inicio</td>
                  <td id="txt_fhini_ent"></td>
                </tr>
                <tr>
                  <td>Fecha Fin</td>
                  <td id="txt_fhfin_ent"></td>
                </tr>    
                <tr> 
                  <td># Guia</td>
                  <td id="txt_guia"></td>
                </tr>
                <tr>  
                  <td align="left">Nota</td>
                  <td id="txt_nota"></td>
                </tr>						
						 </table>
						</p>
                    </li>			
			
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>			  
			  
			  
			  
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>	
	
	
  <!-- Vendor JS Files -->
  <script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js"></script>
  <script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js"></script>
  <script src="../resources/assets/vendor/apexcharts/apexcharts.min.js"></script>
  <script src="../resources/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="../resources/assets/vendor/chart.js/chart.umd.js"></script>
  <script src="../resources/assets/vendor/echarts/echarts.min.js"></script>
  <script src="../resources/assets/vendor/quill/quill.min.js"></script>
  <script src="../resources/assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="../resources/assets/vendor/tinymce/tinymce.min.js"></script>
  <script src="../resources/assets/vendor/php-email-form/validate.js"></script>
  <script src="../resources/fontawesome-free-6.1.2-web/js/all.js"></script>
  <script type="text/javascript" src="../lib/js/funciones.js?<?php  echo(rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/servicios.js?<?php  echo(rand()); ?>"></script>
  
  <script type="text/javascript" src="../lib/bootstrap-notify/bootstrap-notify.min.js"></script>
  <script type="text/javascript" src="../resources/select2/js/select2.full.min.js"></script>
  <script type="text/javascript" src="../lib/SweetAlert2/SweetAlert2.js"></script> 
  <!-- Template Main JS File -->
  <script src="assets/js/main.js"></script>
  <script type="text/javascript" src="../lib/footable/js/footable.js?<?php  echo(rand()); ?>"></script>
  <script type="text/javascript" language="javascript" src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
  <script type="text/javascript" language="javascript" src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>
<script type="text/javascript" src="../controllers/EventosComerciales.js?<?php  echo(rand()); ?>"></script> 
</body> 
</html>