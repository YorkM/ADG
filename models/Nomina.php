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

  case 'I_DOCUMENTOS':
	$codigoSAP = $_POST['codigoSAP'];

    $campos_validos = [
        "HOJA_VIDA",
        "CEDULA_CIUDADANIA",
        "CONTRATO_LABORAL",
        "EXAMENES_MEDICOS",
        "CERTIFICACION_BANCARIA",
        "CERTICADO_EPS",
        "CERTIFICADO_ESTUDIO",
        "CERTIFICADO_ARL",
        "CERTIFICADO_AFP"
    ];

    $columnas = ["COD_SAP_EMPLEADO"];
    $valores = ["'$codigoSAP'"];

    foreach ($_POST as $clave => $valor) {
        if (in_array($clave, $campos_validos)) {
            $columnas[] = $clave;
            $valores[] = "'" . addslashes($valor) . "'";
        }
    }

    $sql = "INSERT INTO T_DOCUMENTOS_EMPLEADOS (" . implode(", ", $columnas) . ") VALUES (" . implode(", ", $valores) . ")";

    $resultado = mssql_query($sql);

    if ($resultado) echo json_encode(["ok" => true, "msg" => "Documentos insertados correctamente."]);
	else echo json_encode(["ok" => false, "msg" => "Error al insertar los documentos"]);
		 
	break;

  case 'U_DOCUMENTOS':
	$codigoSAP = $_POST['codigoSAP']; 

	$campos_validos = [
		"HOJA_VIDA",
		"CEDULA_CIUDADANIA",
		"CONTRATO_LABORAL",
		"EXAMENES_MEDICOS",
		"CERTIFICACION_BANCARIA",
		"CERTICADO_EPS",
		"CERTIFICADO_ESTUDIO",
		"CERTIFICADO_ARL",
		"CERTIFICADO_AFP"
	];

	$set_clauses = [];

	foreach ($_POST as $clave => $valor) {
		if (in_array($clave, $campos_validos) && !empty($valor)) {
			$set_clauses[] = "$clave = '" . addslashes($valor) . "'";
		}
	}

	if (!empty($set_clauses)) {
		$sql = "UPDATE T_DOCUMENTOS_EMPLEADOS SET " . implode(", ", $set_clauses) . " WHERE COD_SAP_EMPLEADO = '$codigoSAP'";

		$resultado = mssql_query($sql);

		if ($resultado) echo json_encode(["ok" => true, "msg" => "Documentos actualizados correctamente."]);
		else echo json_encode(["ok" => false, "msg" => "Error al actualizar los documentos"]);
	} else {
		echo json_encode(["ok" => false, "msg" => "No hay campos válidos para actualizar."]);
	}

	break;
}