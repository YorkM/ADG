<?php session_start(); ?>
<!doctype html>
<html>
<head>
<meta http-equiv="Expires" content="0">
<meta http-equiv="Last-Modified" content="0">
<meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
<meta http-equiv="Pragma" content="no-cache">
<link rel="shortcut icon" href="">
<meta charset="utf-8">
<title>Reporte de ventas por material por año</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DynaPuff:wght@500&display=swap" rel="stylesheet">
<link href="../resources/fontawesome-free-6.1.2-web/css/fontawesome.min.css" rel="stylesheet" />
<link href="../resources/fontawesome-free-6.1.2-web/css/v5-font-face.min.css" rel="stylesheet" />
<link href="../resources/fontawesome-free-6.1.2-web/css/regular.min.css" rel="stylesheet" />
<link rel="stylesheet" href="../resources/select2-bootstrap4-theme/select2-bootstrap4.css">
<link type="text/css" rel="stylesheet" href="../resources/bootstrap/bootstrap-5.0.2-dist/css/bootstrap.min.css">
<link type="text/css" rel="stylesheet" href="../resources/plugins/jquery-ui/jquery-ui.css?<?php echo (rand()); ?>" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@8/dist/sweetalert2.min.css" id="theme-styles">
<link title="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" />
<link href="../resources/niceadmin/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
<link href="../resources/niceadmin/assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
<link href="../resources/niceadmin/assets/vendor/quill/quill.snow.css" rel="stylesheet">
<link href="../resources/niceadmin/assets/vendor/quill/quill.bubble.css" rel="stylesheet">
<link href="../resources/niceadmin/assets/vendor/remixicon/remixicon.css" rel="stylesheet">
<link rel="stylesheet" href="../resources/select2/css/select2.css">
<link rel="stylesheet" href="https://cdn.datatables.net/2.1.4/css/dataTables.dataTables.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.css">
</head>

<body>
<div class="alert alert-info"><i class="fa-solid fa-star fa-flip"></i>&nbsp;0718 - REPORTE DE VENTAS POR MATERIAL, AÑO Y ORGANIZACIÓN </div>
<input type="hidden" id="TxtRolId" value="<?php if(!empty($_SESSION["ses_RolesId"])){ echo $_SESSION["ses_RolesId"];} ?>" readonly>
<input type="hidden" id="TxtIdu" value="<?php if(!empty($_SESSION["ses_Id"])){ echo $_SESSION["ses_Id"];} ?>" readonly>
<input type="hidden" id="TxtCodSap" value="<?php if(!empty($_SESSION["ses_CodSap"])) { echo $_SESSION["ses_CodSap"] ;} ?>" readonly>
<div class="card">
  <div class="card-body">
    <div class="row">
      <div class="col-md-4">
        <label for="Organizacion" class="form-label">Organización</label>
        <input type="text" class="form-control form-control-sm" id="Organizacion" value="<?php if(!empty($_SESSION["ses_NumOrg"])){echo $_SESSION["ses_NumOrg"];} ?>"  readonly>
      </div>
      <div class="col-md-4">
        <label for="anios" class="form-label">Año</label>
        <select id="anios" class="form-select form-select-sm">
        </select>
      </div>
      <div class="col-md-4">
        <label for="btnConsultar" class="form-label">&nbsp;</label>
        <div class="btn-group-sm">
          <button class="btn btn-info btn-sm" id="btnConsultar" >Consultar</button>
          <button class="btn btn-success btn-sm" id="btnExport">Exportar a CSV</button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12" id="contResultados"></div>
    </div>
    <div id="handsontable"></div>
  </div>
</div>
<script type="text/javascript" src="../resources/plugins/jquery/jquery.min.js?<?php echo (rand()); ?>"></script> 
<script type="text/javascript" src="../resources/plugins/jquery-ui/jquery-ui.js?<?php echo (rand()); ?>"></script> 
<script type="text/javascript" src="../resources/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.min.js?<?php echo (rand()); ?>"></script> 
<script src="../resources/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script> 
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@8/dist/sweetalert2.min.js"></script> 
<script src="../resources/niceadmin/assets/vendor/chart.js/chart.umd.js"></script> 
<script src="../resources/niceadmin/assets/vendor/echarts/echarts.min.js"></script> 
<script src="../controllers/humana/Storage.js"></script> 
<script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script> 
<script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script> 
<script src="../resources/plugins/fullcalendar-6.1.10/dist/index.global.min.js"></script> 
<script src="../resources/select2/js/select2.full.min.js"></script> 
<script src="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js"></script> 
<script src="https://cdn.datatables.net/2.1.4/js/dataTables.min.js"></script> 
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script> 
<script type="text/javascript" src="../controllers/ventasMaterialAnio.js?<?php echo (rand()); ?>"></script>
</body>
</html>