<?php
include('funciones.php');
session_start();
conectar();


switch($_POST['op']){
	case 'Buscar_OT':{

		$ean= $_POST["ean"];

		  $sql = "SELECT
				tp.CODIGO_MATERIAL,
				tm.DESCRIPCION,
				tp.ean
			from
				T_MATERIALES_EAN tp
			inner join T_MATERIALES tm on
				tm.CODIGO_MATERIAL = tp.CODIGO_MATERIAL
			where
				tp.EAN ='".$ean."'
				 ";
$query = GenerarArray($sql,"");
echo json_encode($query);	
mssql_close();
}break;	 
}
?>