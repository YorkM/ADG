<?php
ini_set( 'memory_limit', '-1' );
include( 'funciones.php' );
session_start();
conectar();

switch ( $_POST[ 'op' ] ) {
  case 'S_EMPLEADO':
	$codigo_sap = $_POST[ 'codigo' ];
	$sql = "SELECT 
			K.NAME1 AS NOMBRES,
			K.STRAS AS DIRECCION,
			K.ORT01 AS CIUDAD,
			E.ZFECHAINI AS INICIO_CONTRATO,
			E.ZTIPOIDEN AS TIPO_IDENTIFICACION,
			K.STCD1 AS IDENTIFICACION,
			E.ZCUMPLE AS FECHA_CUMPLE,
			E.ZSTAT AS ESTADO_CIVIL,
			E.ZTIPCONTRA AS TIPO_CONTRATO,
			E.ZSALARIO AS SALARIO,
			E.ZTRANSPORTE AS SUBSIDIO_TRANSPORTE,
			E.ZNROCTA AS NUMERO_CUENTA,
			E.ZACTARL AS ARL,
			UPPER(A.DESCRIPCION) AS DESC_ARL,
			E.ZACTSAL AS SALUD,
			UPPER(S.DESCRIPCION) AS DESC_SALUD,
			E.ZACTCAJ AS CAJA_COMPENSACION,
			UPPER(C.DESCRIPCION) AS DESC_CAJA
		FROM ZHRT_EMPLEADO E
		INNER JOIN KNA1 K ON K.KUNNR = E.KUNNR
		LEFT JOIN ZHRT_ARL A ON A.CODIGO = E.ZACTARL
		LEFT JOIN ZHRT_CAJA C ON C.CODIGO = E.ZACTCAJ
		LEFT JOIN ZHRT_SALUD S ON S.CODIGO = E.ZACTSAL
		WHERE 
		E.KUNNR LIKE'%" . $codigo_sap . "' AND 
		E.BUKRS='" . $_SESSION[ 'ses_NumOrg' ] . "'";
	echo json_encode( generarArrayHana( $sql ) );
    break;
	
  case 'S_PERIODOS':
	$codigo_sap = $_POST[ 'codigo' ];
	$sql = "SELECT distinct
				ERDAT AS FECHA
			FROM ZHRT_HISTO
			WHERE BUKRS = '" . $_SESSION[ 'ses_NumOrg' ] . "' AND
			KUNNR  LIKE'%" . $codigo_sap . "'
			ORDER BY ERDAT DESC";
	echo json_encode( generarArrayHana( $sql ) );
    break;

  case 'G_DOCUMENTOS':
	$cod_sap_emp = $_POST['codigoSapEmp'];
	$query = GenerarArray("SELECT * FROM T_DOCUMENTOS_EMPLEADOS WHERE COD_SAP_EMPLEADO = '$cod_sap_emp'", '');
	echo json_encode($query); 
	break;
}
?>