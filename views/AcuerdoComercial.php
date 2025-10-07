<?php 
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Sat, 1 Jul 2000 05:00:00 GMT"); // Fecha en el pasado
 include('../models/funciones.php');
 session_start();
 Redireccionar();
?>

<!doctype html>
<html lang="es">
<head>
	<meta charset="utf-8">
	<title>Acuerdos comerciales</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
	<link type="text/css" rel="stylesheet" href="../resources/css/start/jquery-ui-1.9.2.custom.css?<?php echo(rand()); ?>"/>
	<link type="text/css" rel="stylesheet" href="../lib/SweetAlert/sweet-alert.css?<?php echo(rand()); ?>"/>
	<link type="text/css" rel="stylesheet" href="../resources/css/Animate.css?<?php echo(rand()); ?>">
	<link type="text/css" rel="stylesheet" href="../resources/css/BootstrapTabs.css?<?php echo(rand()); ?>">
	<link rel="stylesheet" href="../resources/plugins/fontawesome-free/css/all.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
	<link rel="stylesheet" href="../resources/css/formulario.css">
	<link rel="stylesheet" href="../resources/css/tablas.css">
	<link rel="stylesheet" href="../resources/css/imgPre.css">
</head>

<body>
	<!-- alert -->
	<div class="alert alert-info">
        <i class="fa-solid fa-star fa-flip"></i>&nbsp;0123 - ACUERDOS COMERCIALES
    </div>
	<!-- Hidden inputs -->
	<input type="hidden" id="RolId" value="<?php if(!empty($_SESSION["ses_RolesId"])){ echo $_SESSION["ses_RolesId"];}?>" readonly>
	<input type="hidden" id="UsrLogin" value="<?php if(!empty($_SESSION["ses_Login"])){ echo $_SESSION["ses_Login"];}?>" readonly>
	<input type="hidden" id="Organizacion" value="<?php if(!empty($_SESSION["ses_NumOrg"])){ echo $_SESSION["ses_NumOrg"];}else{ echo 0;}?>" readonly>  

	<!-- Modal PDF -->
	<div class="modal fade" id="ModalPDF" tabindex="-1" aria-labelledby="ModalPDFLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg" style="max-height: 80vh; height: 80vh;">
		<div class="modal-content" style="height: 100%;">
		<!-- Encabezado -->
		<div class="modal-header" style="background-color: #CFF4FC; color: #055160;">
			<h5 class="modal-title fw-bold" id="ModalPDFLabel">
			<i class="fas fa-file-pdf me-3"></i>
			VISUALIZACIÓN DE DOCUMENTO
			</h5>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		</div>
		
		<!-- Cuerpo del modal  -->
		<div class="modal-body pre-scrollable" id="ContenidoPDF" 
			style="padding: 1.5rem; height: calc(100% - 120px); overflow-y: auto;">
		</div>
		
		<!-- Footer -->
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">
			<i class="fas fa-times me-1"></i> Cerrar
			</button>
		</div>
		</div>
	</div>
	</div>

	<div class="container-fluid mt-3">
	<div class="card mb-3">
		<div class="card-header bg-primary text-white">
			<h5 class="mb-0"><i class="fas fa-handshake me-2"></i>ADMINISTRACIÓN Y SEGUIMIENTO DE ACUERDOS COMERCIALES</h5>
		</div>
		<div class="card-body">
			<div class="row g-3">
				
				<div class="col-6">
					<label>Año</label>
					<div class="input-group input-group-sm">
						<span class="input-group-text bg-light"><i class="fas fa-calendar opacity-50"></i></span>
						<select id="anio" class="form-select form-select-sm"></select>
					</div>
				</div>
				
				<div class="col-6">
					<label>Oficinas</label>
					<div class="input-group input-group-sm">
						<span class="input-group-text bg-light"><i class="fas fa-building opacity-50"></i></span>
						<select id="Oficinas" class="form-select form-select-sm"></select>
					</div>
				</div>
				
				<div class="col-6">
					<label>Zona</label>
					<div class="input-group input-group-sm">
						<span class="input-group-text bg-light"><i class="fas fa-map-marker-alt opacity-50"></i></span>
						<select id="zona" class="form-select form-select-sm"></select>
					</div>
				</div>
				
				<div class="col-6">
					<label>Filtro de búsqueda</label>
					<div class="input-group input-group-sm">
						<span class="input-group-text bg-light"><i class="fas fa-search opacity-50"></i></span>
						<input type="text" placeholder="Filtro de búsqueda" class="form-control form-control-sm" id="filtro" name="filtro">
					</div>
				</div>
				
				<div class="col-12 text-end mt-3">
					<button type="button" class="btn btn-outline-primary " id="btnConsultar" onClick="ConsultarAcuerdos()">
						<i class="fas fa-search me-1"></i> Consultar
					</button>
					<button type="button" class="btn btn-outline-success" id="btnExportar" onClick="Exportar('dvResult')">
						<i class="fas fa-download me-1"></i> Exportar
					</button>
				</div>
			</div>
		</div>
	</div>

    <div id="dvResult" class="mt-3"></div>
    
    <div id="Bloquear" style="display:none;"></div>  
    <div class="centrado-porcentual"></div>  
	</div>

	<script type="text/javascript" src="../lib/js/jquery-2.1.1.min.js?<?php echo(rand()); ?>"></script>
	<script type="text/javascript" src="../lib/js/jquery-ui-1.9.2.custom.js?<?php echo(rand()); ?>"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
	<script type="text/javascript" src="../lib/SweetAlert/sweet-alert.min.js?<?php echo(rand()); ?>"></script>
	<script type="text/javascript" src="../lib/js/funciones.js?<?php echo(rand()); ?>"></script>
	<script type="text/javascript" src="../lib/js/jquery.uitablefilter.js?<?php echo(rand()); ?>"></script>
	<script type="text/javascript" src="../controllers/AcuerdoComercial.js?<?php echo(rand()); ?>"></script>
</body>
</html>