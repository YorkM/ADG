<?php
include('funciones.php');
session_start();
conectar();
switch ($_POST['op']) {
	case 'CargarClienteLogin':
		$sql = "SELECT  
			T.NOMBRES+'-'+T.RAZON_COMERCIAL AS value, 
			T.NIT,
			T.NIT_DIGITO,
			T.NIT_TIPO,
			T.PERFIL_TRIBUTARIO,
			T.CODIGO_SAP,
			T.NOMBRES,
			ISNULL(T.SEXO,'N') AS SEXO,
			T.FECHA_CREACION,
			T.FECHA_NACIMIENTO,
			T.FECHA_MODIFICACION,
			T.TELEFONO1,
			T.TELEFONO2,
			T.TELEFONO3,
			T.EMAIL,
			ISNULL(t.RAZON_COMERCIAL,'') AS RAZON, 
			T.CUPO_CREDITO,
			O.CONDICION_PAGO,
			O.LISTA,
			V.NOMBRES AS VENDEDOR,
			L.NOMBRES AS TELEVENDEDOR,
			ISNULL(T.EXCENTO_IVA,0) AS EXCENTO_IVA,
			ISNULL(T.EXCENTO_CREE,0) AS EXCENTO_CREE,
			ISNULL(T.RESPONSABLE_ICA,0) AS RESPONSABLE_ICA,
			ISNULL(O.GRAN_CONTRIBUYENTE,0) AS GRAN_CONTRIBUYENTE,
			O.AUTORETENEDOR,
			O.ZONA_VENTAS,
			O.CANAL_DISTRIBUCION,
			O.OFICINA_VENTAS,
			O.SECTOR,
			ISNULL(O.INSTITUCIONAL,0) AS INSTITUCIONAL,
			ISNULL(O.CONTROLADOS,0) AS CONTROLADOS,
			T.DIRECCION,
			T.CIUDAD,
			T.DEPARTAMENTO,
			T.LONGITUD,
			T.LATITUD
		FROM T_TERCEROS t 
		INNER JOIN T_USUARIOS U ON (U.identificacion=t.nit)
		INNER JOIN T_TERCEROS_ORGANIZACION O ON O.CODIGO_SAP = T.CODIGO_SAP
		LEFT  JOIN T_TERCEROS L ON L.CODIGO_SAP = O.CODIGO_TELEVENDEDOR
		LEFT  JOIN T_TERCEROS V ON V.CODIGO_SAP = O.CODIGO_VENDEDOR
		WHERE 
		O.ORGANIZACION_VENTAS = " . mb_strtoupper($_POST["org"], "UTF-8") . " AND 
		O.CANAL_DISTRIBUCION  = 10 AND U.ID= '" . $_POST["id_cliente"] . "' ";

		echo json_encode(GenerarArray($sql, ""));
		mssql_close();
		break;
	case 'B_CLIENTES': {
			$sql = "SELECT TOP 5
	          T.NOMBRES+'-'+T.RAZON_COMERCIAL AS value, 
			  T.NIT,
			  T.NIT_DIGITO,
  		      T.NIT_TIPO,
			  T.PERFIL_TRIBUTARIO,
			  T.CODIGO_SAP,
			  T.NOMBRES,
			  ISNULL(T.SEXO,'N') AS SEXO,
			  T.FECHA_CREACION,
			  T.FECHA_NACIMIENTO,
			  T.FECHA_MODIFICACION,
			  T.TELEFONO1,
			  T.TELEFONO2,
			  T.TELEFONO3,
			  ISNULL(T.EMAIL,'') AS EMAIL,
			  ISNULL(T.EMAIL_FE,'') AS EMAIL_FE,
			  ISNULL(t.RAZON_COMERCIAL,'') AS RAZON, 
			  T.CUPO_CREDITO,
			  O.CONDICION_PAGO,
			  O.LISTA,
			  V.NOMBRES AS VENDEDOR,
			  L.NOMBRES AS TELEVENDEDOR,
			  ISNULL(T.EXCENTO_IVA,0) AS EXCENTO_IVA,
              ISNULL(T.EXCENTO_CREE,0) AS EXCENTO_CREE,
			  ISNULL(T.RESPONSABLE_ICA,0) AS RESPONSABLE_ICA,
			  ISNULL(O.GRAN_CONTRIBUYENTE,0) AS GRAN_CONTRIBUYENTE,
              O.AUTORETENEDOR,
			  O.ZONA_VENTAS,
              O.CANAL_DISTRIBUCION,
              O.OFICINA_VENTAS,
              O.SECTOR,
			  ISNULL(O.INSTITUCIONAL,0) AS INSTITUCIONAL,
              ISNULL(O.CONTROLADOS,0) AS CONTROLADOS,
			  T.DIRECCION,
              T.CIUDAD,
              T.DEPARTAMENTO,
			  T.LONGITUD,
			  T.LATITUD,
			  T.NOTIFICACION_CARTERA,
			  T.NOTIFICACION_FECHA
			FROM T_TERCEROS t 
			INNER JOIN T_TERCEROS_ORGANIZACION O ON O.CODIGO_SAP = T.CODIGO_SAP
			LEFT  JOIN T_TERCEROS L ON L.CODIGO_SAP = O.CODIGO_TELEVENDEDOR
			LEFT  JOIN T_TERCEROS V ON V.CODIGO_SAP = O.CODIGO_VENDEDOR
			WHERE 
			O.ORGANIZACION_VENTAS = " . mb_strtoupper($_POST["org"], "UTF-8") . " AND 
			O.CANAL_DISTRIBUCION  = 10 AND " . palabras_terceros(utf8_decode($_POST["term"]), 't');
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case 'B_DEPARTAMENTOS': {
			$sql = "SELECT DEPARTAMENTO,DESCRIPCION FROM T_DEPARTAMENTOS";
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case 'B_CIUDADES': {
			$sql = "SELECT CIUDAD,DESCRIPCION FROM T_CIUDADES WHERE DEPARTAMENTO = '" . $_POST['dpto'] . "'";
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case 'B_DIRECCIONES': {
			$sql = "SELECT 
			 D.ID,
			 D.DIRECCION,
			 P.DESCRIPCION AS DPTO,
			 C.DESCRIPCION AS CIUDAD
			FROM T_TERCEROS_DIR D 
			INNER JOIN T_DEPARTAMENTOS P ON P.DEPARTAMENTO = D.DEPARTAMENTO
			INNER JOIN T_CIUDADES C ON C.CIUDAD = D.CIUDAD AND C.DEPARTAMENTO = D.DEPARTAMENTO
			WHERE 
			 D.CODIGO_SAP = '" . $_POST['codigo'] . "'";
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case 'B_ACUERDOS': {
			$sql = "SELECT  
			  T.ID, 
			  vlr=(select sum(vs.p_neto) from v_facturacion  vs  WHERE 
			  		---vs.tipo_factura IN('zf01','zf03','zf05','zf07','zf09','zf10','zf11','zf12','znc2') AND   
					(vs.tipo_factura like 'ZF%' or vs.tipo_factura like 'ZN%') and 
			  		vs.fecha between  t.FECHA_INI and t.FECHA_FIN     AND
					vs.organizacion_ventas = '" . $_POST['org'] . "' and    vs.CODIGO_SAP=t.CODIGO_SAP ),T.ADJUNTO,T.ID,T.NUMERO,T.FECHA_INI,T.FECHA_FIN,T.INCENTIVO,T.MONTO,T.OBSERVACION,TT.NOMBRES

 FROM T_ACUERDO_COMERCIAL T  
  INNER JOIN T_TERCEROS TT ON(TT.CODIGO_SAP=T.CODIGO_SAP)
 WHERE  T.CODIGO_SAP='" . $_POST['codigo'] . "'";
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case 'B_PAGARES': {
			$sql = " SELECT T.ID,T.CODIGO_SAP,T.ADJUNTO,TT.NOMBRES FROM T_PAGARES T 
INNER JOIN T_TERCEROS TT ON(TT.CODIGO_SAP=T.CODIGO_SAP)
WHERE T.CODIGO_SAP= '" . $_POST['codigo'] . "'";
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case 'G_DIRECCIONES': {
			$sql = "INSERT INTO T_TERCEROS_DIR(CODIGO_SAP,CIUDAD,DEPARTAMENTO,DIRECCION)VALUES('" . $_POST['codigo'] . "','" . $_POST['mpio'] . "','" . $_POST['dpto'] . "','" . strtoupper($_POST['dir']) . "')";
			if (mssql_query($sql)) {
				echo 1;
			} else {
				echo 0;
			}
		}
		break;
	case 'D_DIRECCIONES': {
			$sql = "DELETE FROM T_TERCEROS_DIR WHERE ID = '" . $_POST['id'] . "'";
			if (mssql_query($sql)) {
				echo 1;
			} else {
				echo 0;
			}
		}
		break;
	case 'D_ACUERDOS': {
			$sql = "DELETE FROM T_ACUERDO_COMERCIAL WHERE ID = '" . $_POST['id'] . "'";
			if (mssql_query($sql)) {
				echo 1;
			} else {
				echo 0;
			}
		}
		break;
	case 'B_CARTERA_RC': {
			$tipo = 'S';
			$sp   = mssql_init('P_CARTERA');
			mssql_bind($sp, '@CODIGO_SAP', $_POST["codigo"], SQLVARCHAR, false, false);
			mssql_bind($sp, '@ORGANIZACION', $_POST["org"], SQLVARCHAR, false, false);
			mssql_bind($sp, '@TIPO', $_POST["tipo"], SQLVARCHAR, false, false);
			$r   = mssql_execute($sp);
			echo json_encode(GenerarArray($r, 'SP'));
			mssql_close();
		}
		break;
	case 'B_CARTERA': {
			$tipo = 'S';
			$sp   = mssql_init('ZP_CARTERA');
			mssql_bind($sp, '@CODIGO_SAP', $_POST["codigo"], SQLVARCHAR, false, false);
			mssql_bind($sp, '@ORGANIZACION', $_POST["org"], SQLVARCHAR, false, false);
			mssql_bind($sp, '@TIPO', $_POST["tipo"], SQLVARCHAR, false, false);
			mssql_bind($sp, '@DepId', $_POST["DepId"], SQLVARCHAR, false, false);
			mssql_bind($sp, '@ANIO', $_POST["anio"], SQLINT4, false, false);
			$r   = mssql_execute($sp);
			echo json_encode(GenerarArray($r, 'SP'));
			mssql_close();
		}
		break;
	case 'B_MATERIALES': {
			$b_regu = palabras_materiales(utf8_decode($_POST['term']), 'm');
			$sql = "SELECT DISTINCT TOP 5
			 UPPER(M.CODIGO_MATERIAL+' - '+ISNULL(M.DESCRIPCION2,M.DESCRIPCION)) AS value, 
			 M.CODIGO_MATERIAL, 
			 ISNULL(M.DESCRIPCION2,M.DESCRIPCION) AS DESCRIPCION 
		 FROM T_MATERIALES M 
		 INNER JOIN T_PEDIDOS_FACTURA_DETALLE D ON D.CODIGO_MATERIAL = M.CODIGO_MATERIAL
		 INNER JOIN T_PEDIDOS_FACTURA F ON F.NUMERO_FACTURA = D.NUMERO_FACTURA AND F.NUMERO_PEDIDO = D.NUMERO_PEDIDO
		 INNER JOIN T_PEDIDOS P ON F.NUMERO_PEDIDO = P.NUMERO 
		 WHERE " . $b_regu . " AND P.CODIGO_SAP = " . $_POST['cliente'];
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case 'B_MATERIALES_SC': {
			$b_regu = palabras_materiales(utf8_decode($_POST['term']), 'm');
			$sql = "SELECT DISTINCT TOP 5
			 UPPER(M.CODIGO_MATERIAL+' - '+ISNULL(M.DESCRIPCION2,M.DESCRIPCION)) AS value, 
			 M.CODIGO_MATERIAL, 
			 ISNULL(M.DESCRIPCION2,M.DESCRIPCION) AS DESCRIPCION 
		 FROM T_MATERIALES M 
		 INNER JOIN T_PEDIDOS_FACTURA_DETALLE D ON D.CODIGO_MATERIAL = M.CODIGO_MATERIAL
		 INNER JOIN T_PEDIDOS_FACTURA F ON F.NUMERO_FACTURA = D.NUMERO_FACTURA AND F.NUMERO_PEDIDO = D.NUMERO_PEDIDO
		 INNER JOIN T_PEDIDOS P ON F.NUMERO_PEDIDO = P.NUMERO 
		 WHERE " . $b_regu;
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case 'S_FACTURAS': {
			$sql = "SELECT 
				P.NUMERO,
				CAST(P.FECHA_PEDIDO AS DATE) AS FECHA_PEDIDO,
				ISNULL(P.NOTA,'N/A') AS NOTA,
				F.TIPO_FACTURA,
				F.NUMERO_FACTURA,
				F.FECHA_INICIO
			FROM T_PEDIDOS_FACTURA_DETALLE D
			INNER JOIN T_PEDIDOS_FACTURA F ON F.NUMERO_FACTURA = D.NUMERO_FACTURA
			INNER JOIN T_PEDIDOS P ON P.NUMERO = F.NUMERO_PEDIDO
			WHERE 
				D.CODIGO_MATERIAL = '" . $_POST['material'] . "' AND 
				P.CODIGO_SAP = '" . $_POST['codigo'] . "'
			GROUP BY
				P.NUMERO,
				P.FECHA_PEDIDO,
				P.NOTA,
				F.TIPO_FACTURA,
				F.NUMERO_FACTURA,
				F.FECHA_INICIO";
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case 'DATOS_COMERCIAL':
		$crm_cod_sap = $_POST["crm_cod_sap"];
		$sp  = mssql_init('P_CRM_DATOS_TERCEROS');
		mssql_bind($sp, '@CRM_COD_SAP',  $crm_cod_sap, SQLVARCHAR, false, false);
		mssql_bind($sp, '@NOMBRE_DOC',  trim(utf8_decode(strtoupper($_POST["nombre_doc"]))), SQLVARCHAR, false, false);


		mssql_bind($sp, '@ID', $id, SQLINT4, true, false);

		break;
	case "Load_Aficiones":
		$sql = "SELECT
				        ID,
						AFICION
						FROM 
						T_CRM_AFICIONES   ";
		echo json_encode(GenerarArray($sql, ""));
		mssql_close();
		break;
	case 'G_ACUERDOS': {
			$nombre = $_POST['adj'] . ".pdf";

			$sql = "INSERT INTO T_ACUERDO_COMERCIAL (CODIGO_SAP,NUMERO,FECHA_INI,FECHA_FIN,MONTO,INCENTIVO,OBSERVACION,ADJUNTO,ORGANIZACION_VENTAS,OFICINA_VENTAS)VALUES('" . $_POST['c_sap'] . "','" . $_POST['acu'] . "','" . $_POST['f_ini'] . "','" . $_POST['f_fin'] . "','" . $_POST['mont'] . "','" . $_POST['inc'] . "','" . strtoupper($_POST['obs']) . "','" . $nombre . "','" . $_POST['organizacion'] . "','" . $_POST['oficina'] . "')";
			if (mssql_query($sql)) {
				echo 1;
			} else {
				echo 0;
			}
		}
		break;
	case 'G_PAGARES': {
			$nombre = $_POST['adj'] . ".pdf";
			$sql = "INSERT INTO T_PAGARES	 (CODIGO_SAP,ADJUNTO)VALUES('" . $_POST['c_sap'] . "','" . $nombre . "')";
			if (mssql_query($sql)) {
				echo 1;
			} else {
				echo 0;
			}
		}
		break;
	case "subir":
		$return = array('ok' => TRUE);



		$nombre_archivo = $_FILES['archivo']['name'];
		$tipo_archivo = $_FILES['archivo']['type'];
		$tipo_archivo = explode("/", $tipo_archivo);
		if ($_POST["tipo"] == 'acuerdo') {
			$upload_folder = '../resources/acuerdos/';
			$nombre = $_POST["codigo"] . '_' . rand(1, 9999);
		}
		if ($_POST["tipo"] == 'pagare') {
			$upload_folder = '../resources/pagare/';
			$nombre = 'pagare' . $_POST["codigo"] . '_' . rand(1, 9999);
		}
		if ($tipo_archivo[1] == "pdf") {
			$tipo_archivo = $_FILES['archivo']['type'];
			$tamano_archivo = $_FILES['archivo']['size'];
			$tmp_archivo = $_FILES['archivo']['tmp_name'];
			$archivador = $upload_folder . '/' . $nombre . '.pdf';
			if (!move_uploaded_file($tmp_archivo, $archivador)) {
				echo "No se ha podido cargar el pdf .";
			} else {
				echo  $nombre;
			}
		} else {
			echo  "El documento debe ser un pdf.";
		}


		break;
	case "Gestiones": {
			$sql = "SELECT 
				U.NOMBRES+' '+U.APELLIDOS AS NOMBRES,
				CAST(V.FECHA_VISITA AS DATE) AS FECHA_VISITA,
				V.OBJETIVO_CARTERA,
				V.OBJETIVO_JURIDICA,
				V.OBJETIVO_VENTA,
				V.LOGRO_CARTERA,
				V.LOGRO_JURIDICA,
				V.LOGRO_VENTA 
			 FROM T_VISITAS_VENDEDOR V 
			 INNER JOIN T_USUARIOS U ON U.ID = V.ID_USUARIO
			 WHERE V.CODIGO_SAP_CLI = '" . $_POST['codigo'] . "' AND V.FECHA_VISITA >=  GETDATE()-180
			 ORDER BY 
				V.FECHA_VISITA DESC";
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case "CarteraXEdades": {
			$sql = "SELECT 
				 V.CLIENTE,
				 SUM(V.C_SIN_VENCER) AS C_SIN_VENCER,
				 SUM(V.C_31_60) AS C_31_60,
				 SUM(V.C_61_90) AS C_61_90,
				 SUM(V.C_91_120) AS C_91_120,
				 SUM(V.C_120) AS C_120
				FROM V_CARTERA V 
				WHERE 
				 V.CLIENTE  = '" . $_POST['codigo'] . "' AND 
				 V.SOCIEDAD = '" . $_SESSION['ses_NumOrg'] . "' AND
			     V.DOCUMENTO_COMPENSACION = '-'
				GROUP BY
				 V.CLIENTE";
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case "U_TERCERO": {
			$sql = "UPDATE T_TERCEROS SET EMAIL_FE ='" . $_POST['EMAIL_FE'] . "' WHERE CODIGO_SAP = '" . $_POST['CODIGO_SAP'] . "'";
			if (mssql_query($sql)) {
				echo 1;
			} else {
				echo 0;
			}
		}
		break;
	case 'S_GRUPOS_CLIENTES': {
			$grupo = $_POST['grupo'];

			switch ($grupo) {
				case 1:
					$sql = "SELECT GRUPO  AS GRUPO, DESCRIPCION FROM T_TERCEROS_GRUPOS1";
					break;
				case 2:
					$sql = "SELECT GRUPO2 AS GRUPO, DESCRIPCION FROM T_TERCEROS_GRUPOS2";
					break;
				case 3:
					$sql = "SELECT GRUPO3 AS GRUPO, DESCRIPCION FROM T_TERCEROS_GRUPOS3";
					break;
				case 4:
					$sql = "SELECT GRUPO4 AS GRUPO, DESCRIPCION FROM T_TERCEROS_GRUPOS4";
					break;
				case 5:
					$sql = "SELECT GRUPO5 AS GRUPO, DESCRIPCION FROM T_TERCEROS_GRUPOS5";
					break;
			}
			$result = GenerarArray($sql, "");
			echo json_encode($result);
		}
		break;

	case 'S_SINC_TERCEROS': {
			$sql = "SELECT top 1
					LTRIM(T.KUNNR,0) AS CODIGO_SAP,
					C.KVGR1 AS GRUPO1,
					C.KVGR2 AS GRUPO2,
					C.KVGR3 AS GRUPO3,
					C.KVGR4 AS GRUPO4,
					C.KVGR5 AS GRUPO5,
					T.REGIO AS COD_DPTO,
					SUBSTRING(
						P.CITY_CODE,
						10,
						12
					) COD_CIUDAD,
					P.CITY_NAME AS NOMBRE_CIUDAD    
				FROM KNA1 T 
				INNER JOIN KNVV C ON C.KUNNR = T.KUNNR
				INNER JOIN ADRCITY D ON D.REGION = T.REGIO
				left JOIN ADRCITYT P ON P.CITY_CODE = D.CITY_CODE AND UPPER(REPLACE(P.CITY_NAME,'É','E')) = UPPER(T.MCOD3)
				WHERE 
				LTRIM(T.KUNNR,0) = '" . $_POST['codigo'] . "'
				ORDER BY 
				P.CITY_NAME DESC";
			$datos = generarArrayHana($sql, 0);

			for ($i = 0; $i <= count($datos) - 1; $i++) {
				//Actualizacion en terceros 
				$q = "UPDATE T_TERCEROS SET 
		        COD_CIUDAD = '" . $datos[$i]['COD_CIUDAD'] . "',
				COD_DPTO   = '" . $datos[$i]['COD_DPTO'] . "'
			  WHERE 
			    CODIGO_SAP = '" . $datos[$i]['CODIGO_SAP'] . "';";
				//Actualizacion en terceros organizacion
				$q .= "UPDATE T_TERCEROS_ORGANIZACION SET
		       GRUPO1 = '" . $datos[$i]['GRUPO1'] . "',
			   GRUPO2 = '" . $datos[$i]['GRUPO2'] . "',
			   GRUPO3 = '" . $datos[$i]['GRUPO3'] . "',
			   GRUPO4 = '" . $datos[$i]['GRUPO4'] . "',
			   GRUPO5 = '" . $datos[$i]['GRUPO5'] . "'
			  WHERE CODIGO_SAP = '" . $datos[$i]['CODIGO_SAP'] . "';";
				mssql_query($q);
			}
			echo "Fin, se sincronizaron " . count($datos) . " registros";
		}
		break;

	case 'G_ROTACION':
		$filtroZonas = $_POST['filtroZonas'];
		$mes = $_POST['mes'];

		$query = "SELECT C.ZONA, Z.ZONA_DESCRIPCION AS TEXTO, C.ANIO, C.MES, C.VENTAS, C.CARTERA, C.DIAS, C.ROTACION 
		FROM T_CARTERA_ROTACION_ZONA C
		INNER JOIN T_ZONAS_VENTAS Z ON C.ZONA = Z.ZONA_VENTAS
		WHERE ZONA LIKE '$filtroZonas%' AND MES = '$mes'
		ORDER BY C.ZONA ASC";

		$result = GenerarArray($query, "");
		if ($result) echo json_encode(['ok' => true, 'data' => $result]);
		else echo json_encode(['ok' => false, 'data' => []]);
		break;

	case 'G_DATOS_CLIENTE':
		$codigo = $_POST['codigo'];

		$query = "SELECT ISNULL(O.ORGANIZACION_VENTAS, 'ND') AS ORG, 
		CONCAT(TU.NOMBRES, ' ', TU.APELLIDOS) AS EJEC_CARGO, 
		ISNULL(O.OFICINA_VENTAS, 'ND') AS OFICINA, U.IDENTIFICACION,
		T.NOMBRES, T.RAZON_COMERCIAL, T.DIRECCION, T.TELEFONO1, T.EMAIL,
		ISNULL(O.ZONA_VENTAS, 'ND') AS ZONA, CONCAT(Z.ZONA_VENTAS, ' - ', Z.ZONA_DESCRIPCION) AS ZONA_C,
		ISNULL(O.CODIGO_VENDEDOR, 'ND') AS ENCARGADO
		FROM T_TERCEROS T
		LEFT JOIN T_TERCEROS_ORGANIZACION O ON T.CODIGO_SAP = O.CODIGO_SAP
		LEFT JOIN T_ZONAS_VENTAS Z ON O.ZONA_VENTAS = Z.ZONA_VENTAS
		LEFT JOIN T_USUARIOS U ON T.CODIGO_SAP = U.CODIGO_SAP
		LEFT JOIN T_USUARIOS TU ON O.CODIGO_VENDEDOR = TU.CODIGO_SAP
		WHERE T.CODIGO_SAP = '$codigo'";

		$result = GenerarArray($query, "");
		if ($result) echo json_encode(['ok' => true, 'data' => $result]);
		else echo json_encode(['ok' => false, 'data' => []]);
		break;

	case 'G_DATOS_PROCESO':
		$organizacion = $_POST['organizacion'];
		$oficina = $_POST['oficina'];

		$query = "SELECT *, CONVERT(VARCHAR(25), FECHA_CARTA_CIFIN, 126) AS FECHA_CIFIN,
		CONVERT(VARCHAR(25), FECHA_CARTA_JURI, 126) AS FECHA_PREJU,
		CONVERT(VARCHAR(25), FECHA_FIN_ACUERDO, 126) AS FECHA_FIN_ACUER,
		CONVERT(VARCHAR(25), FECHA_INICIO_ACUERDO, 126) AS FECHA_INI_ACUER
		FROM T_PROCESOS_JURIDICOS WHERE ORGANIZACION = '$organizacion'";

		if ($oficina !== "" && $oficina !== "2000" && $oficina !== "1000") {
			$query .= " AND OFICINA = '$oficina'";
		}

		$result = GenerarArray($query, "");
		if ($result) echo json_encode(['ok' => true, 'data' => $result]);
		else echo json_encode(['ok' => false, 'data' => []]);
		break;

	case 'G_PROCESO':
		$idProceso = intval($_POST['idProceso']);

		$query = "SELECT * FROM T_PROCESOS_JURIDICOS WHERE ID = $idProceso";

		$result = GenerarArray($query, "");
		if ($result) echo json_encode(['ok' => true, 'data' => $result]);
		else echo json_encode(['ok' => false, 'data' => []]);
		break;

	case 'G_REPORTE_PROCESOS':
		$organizacion = $_POST['organizacion'];
		$oficina = $_POST['oficina'];

		$query = "SELECT *, CONVERT(VARCHAR(25), FECHA_REGISTRO, 126) AS FECHA_ISO,
		CONVERT(VARCHAR(25), FECHA_CARTA_JURI, 126) AS FECHA_PREJU,
		CONVERT(VARCHAR(25), FECHA_FIN_ACUERDO, 126) AS FECHA_FIN_ACUER,
		CONVERT(VARCHAR(25), FECHA_INICIO_JURI, 126) AS FECHA_INI_JURI
		FROM T_PROCESOS_JURIDICOS 
		WHERE ORGANIZACION = '$organizacion'
		AND ESTADO IN ('6', '7', '8', '9', '10', '11', '12', '13')
		AND OFICINA LIKE '$oficina%'";

		$result = GenerarArray($query, "");
		if ($result) echo json_encode(['ok' => true, 'data' => $result]);
		else echo json_encode(['ok' => false, 'data' => []]);
		break;

	case 'I_DATOS_PROCESO':
		$nomb = utf8_decode($_POST['nombres']);
		$razon = utf8_decode($_POST['razon']);
		$fechaCifin = $_POST['fechaCifin'];
		$org = $_POST['organizacion'];
		$dire = utf8_decode($_POST['direccion']);
		$ejec = $_POST['ejecutivo'];
		$codigo = $_POST['codigo'];
		$correo = $_POST['correo'];
		$tel = $_POST['telefono'];
		$usua = $_POST['usuario'];
		$ofi = $_POST['oficina'];
		$cedu = $_POST['cedula'];
		$zona = $_POST['zona'];

		$query = "INSERT INTO T_PROCESOS_JURIDICOS (CODIGO, ORGANIZACION, OFICINA, CEDULA, NOMBRE_CLIENTE, RAZON_SOCIAL, DIRECCION, TELEFONO, CORREO, ZONA_VENTAS, EJECUTIVO_CARGO, ESTADO, FECHA_CARTA_CIFIN, FECHA_REGISTRO, USUARIO)
        VALUES ('$codigo', '$org', '$ofi', '$cedu', '$nomb', '$razon', '$dire', '$tel', '$correo', '$zona', '$ejec', '1', '$fechaCifin', GETDATE(), '$usua');

        SELECT SCOPE_IDENTITY() AS ID_INSERTADO;";

		$result = mssql_query($query);

		if ($result) {
			$row = mssql_fetch_assoc($result);
			$idInsertado = $row['ID_INSERTADO'];
			echo json_encode(['ok'  => true, 'msg' => "Datos guardados", 'id'  => $idInsertado]);
		} else {
			echo json_encode(['ok'  => false, 'msg' => "Error al guardar"]);
		}
		break;

	case 'I_LOG':
		$idProceso = intval($_POST['idProceso']);
		$usuario = $_POST['usuario'];		
		$estado  = $_POST['estado'];

		$query = "INSERT INTO T_PROCESOS_JURIDICOS_LOGS (ID_PROCESO, ESTADO, USUARIO, FECHA_HORA) 
		VALUES ($idProceso, '$estado', '$usuario', GETDATE())";

		$result = mssql_query($query);

		if ($result) echo json_encode(['ok'  => true, 'msg' => "Log insertado"]);
		else echo json_encode(['ok'  => false, 'msg' => "Error al insertar log"]);
		break;

	case "G_LOGS":
		$idProceso = intval($_POST['idProceso']);

		$sql = "SELECT L.USUARIO, L.ESTADO, L.FECHA_HORA,
		CONCAT(U.NOMBRES, ' ', U.APELLIDOS) AS NOMBRE_USUARIO
		FROM T_PROCESOS_JURIDICOS_LOGS L
		INNER JOIN T_USUARIOS U ON L.USUARIO = U.[LOGIN]
		WHERE L.ID_PROCESO = $idProceso 
		ORDER BY FECHA_HORA ASC";

		$result = GenerarArray($sql, '');

		echo json_encode($result);
		break;

	case "U_ARCHIVOS":
		$campoActualizar = $_POST['campoActualizar'];
		$idProceso = intval($_POST['idProceso']);
		$nombreArchivo = $_POST['nombreArchivo'];
		
		$sql = "UPDATE T_PROCESOS_JURIDICOS SET $campoActualizar = '$nombreArchivo' WHERE ID = $idProceso";
		$update = mssql_query($sql);	

		if ($update) echo json_encode(['ok' => true, 'msg' => "Archivos actualizados correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al actualizar los archivos"]);
		break;

	case "U_ESTADOS":
		$idProceso = intval($_POST['idProceso']);
		$fechaCartaPreju = $_POST['fechaCartaPreju'];
		$comentario = utf8_decode($_POST['comentario']);
		$estado = $_POST['estado'];
		
		$sql = "UPDATE T_PROCESOS_JURIDICOS SET ESTADO = '$estado', FECHA_CARTA_JURI = '$fechaCartaPreju', COMENTARIO_PREJURIDICA = '$comentario' WHERE ID = $idProceso";		
		$update = mssql_query($sql);	

		if ($update) echo json_encode(['ok' => true, 'msg' => "Estado actualizado correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al actualizar estado"]);
		break;

	case "U_ACUERDO":
		$comentario = utf8_decode($_POST['comentario']);
		$idProceso = intval($_POST['idProceso']);
		$fechaInicio = $_POST['fechaInicio'];
		$fechaFin = $_POST['fechaFin'];
		$estado = $_POST['estado'];

		$sql = "UPDATE T_PROCESOS_JURIDICOS SET ESTADO = '$estado', FECHA_INICIO_ACUERDO = '$fechaInicio', FECHA_FIN_ACUERDO = '$fechaFin', COMENTARIO_ACUERDO = '$comentario' WHERE ID = $idProceso";			
		$update = mssql_query($sql);	

		if ($update) echo json_encode(['ok' => true, 'msg' => "Acuerdo actualizado correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al actualizar acuerdo"]);
		break;

	case "U_SOPORTE":
		$comentario = utf8_decode($_POST['comentario']);
		$idProceso = intval($_POST['idProceso']);
		$fechaSoporte = $_POST['fechaSoporte'];
		$estado = $_POST['estado'];

		$sql = "UPDATE T_PROCESOS_JURIDICOS SET ESTADO = '$estado', FECHA_SOPORTE = '$fechaSoporte', COMENTARIO_FINALIZA_PREJU = '$comentario' WHERE ID = $idProceso";			
		$update = mssql_query($sql);	

		if ($update) echo json_encode(['ok' => true, 'msg' => "Soporte actualizado correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al actualizar soporte"]);
		break;

	case "U_PROCESO_JURIDICO":
		$idProceso = intval($_POST['idProceso']);
		$estado = $_POST['estado'];

		$sql = "UPDATE T_PROCESOS_JURIDICOS SET ESTADO = '$estado' WHERE ID = $idProceso";			
		$update = mssql_query($sql);	

		if ($update) echo json_encode(['ok' => true, 'msg' => "Paso a jurídico correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al pasar a jurídico"]);
		break;

	case "U_DOCUMENTOS_JURIDICO":
		$comentario = utf8_decode($_POST['comentario']);
		$idProceso = intval($_POST['idProceso']);
		$fechaJuri = $_POST['fechaJuri'];
		$estado = $_POST['estado'];
		$valor = $_POST['valor'];

		$sql = "UPDATE T_PROCESOS_JURIDICOS SET ESTADO = '$estado', FECHA_INICIO_JURI = '$fechaJuri', VALOR = '$valor', COMENTARIO_ENVIA_JURI = '$comentario' WHERE ID = $idProceso";			
		$update = mssql_query($sql);	

		if ($update) echo json_encode(['ok' => true, 'msg' => "Documentos jurídicos actualizados correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al actualizar los documentos jurídicos"]);
		break;

	case "I_SEGUIMIENTO":
		$comentario = utf8_decode($_POST['comentario']);
		$idProceso = intval($_POST['idProceso']);
		$fechaDemanda = $_POST['fechaDemanda'];
		$juzgado = utf8_decode($_POST['juzgado']);
		$radicado = $_POST['radicado'];
		$estado = $_POST['estado'];

		$sql = "UPDATE T_PROCESOS_JURIDICOS SET ESTADO = '$estado', JUZGADO = '$juzgado', RADICADO = '$radicado', FECHA_DEMANDA = '$fechaDemanda', COMENTARIO_SEGUIMIENTO = '$comentario' WHERE ID = $idProceso";		
		$update = mssql_query($sql);

		if ($update) echo json_encode(['ok' => true, 'msg' => "Seguimiento actualizado correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al actualizar el seguimiento"]);
		break;

	case "U_ESTADO_OBSERVACIONES":
		$comentario = utf8_decode($_POST['comentario']);
		$idProceso = intval($_POST['idProceso']);
		$estado = $_POST['estado'];

		$sql = "UPDATE T_PROCESOS_JURIDICOS SET ESTADO = '$estado', COMENTARIO_OBSERVACIONES = '$comentario' WHERE ID = $idProceso";		
		$update = mssql_query($sql);

		if ($update) echo json_encode(['ok' => true, 'msg' => "Observaciones actualizadas correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al actualizar las observaciones"]);
		break;

	case "U_ESTADO_PROCESO":
		$estadoProceso = $_POST['estadoProceso'];
		$idProceso = intval($_POST['idProceso']);
		$estado = $_POST['estado'];

		$sql = "UPDATE T_PROCESOS_JURIDICOS SET ESTADO = '$estado', ESTADO_PROCESO = '$estadoProceso' WHERE ID = $idProceso";		
		$update = mssql_query($sql);

		if ($update) echo json_encode(['ok' => true, 'msg' => "Observaciones actualizadas correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al actualizar las observaciones"]);
		break;

	case "U_CUMPLE":
		$idAbono = intval($_POST['idAbono']);
		$valor = $_POST['valor'];

		$sql = "UPDATE T_ACUERDOS_PAGO SET CUMPLE = '$valor' WHERE ID = $idAbono";	
		$update = mssql_query($sql);

		if ($update) echo json_encode(['ok' => true, 'msg' => "Pago actualizado correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al actualizar el pago"]);
		break;

	case "I_SOPORTE":
		$idAbono = intval($_POST['idAbono']);
		$numeroDocumento = $_POST['numeroDocumento'];
		$fechaPago = $_POST['fechaPago'];
		$formaPago = $_POST['formaPago'];

		$sql = "UPDATE T_ACUERDOS_PAGO SET NUMERO_DOCUMENTO = '$numeroDocumento', FECHA_REALIZA_PAGO = '$fechaPago', FORMA_PAGO = '$formaPago' WHERE ID = $idAbono";	
		$update = mssql_query($sql);

		if ($update) echo json_encode(['ok' => true, 'msg' => "Soporte pago actualizado correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al actualizar el soporte pago"]);
		break;

	case "I_ABONO":
		$codigo = $_POST['codigo'];
		$estado = $_POST['estado'];
		$valor = $_POST['valor'];
		$fecha = $_POST['fecha'];
		$tipo = $_POST['tipo'];

		$sql = "INSERT INTO T_ACUERDOS_PAGO (CODIGO, VALOR_PAGO, FECHA_PAGO, TIPO_PAGO, ESTADO)
		VALUES ('$codigo', '$valor', '$fecha', '$tipo', '$estado')";		
		$resultado = mssql_query($sql);

		if ($resultado) echo json_encode(['ok' => true, 'msg' => "Abono guardado"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al guardar abono"]);
		break;

	case "G_ABONOS":
		$codigo = $_POST['codigo'];		
		$estado = $_POST['estado'];		

		$sql = "SELECT AP.ID, PJ.ORGANIZACION, PJ.CODIGO, PJ.ZONA_VENTAS, ISNULL(AP.CUMPLE, 0) AS CUMPLE,
		PJ.NOMBRE_CLIENTE, AP.FECHA_PAGO, AP.VALOR_PAGO, AP.NUMERO_DOCUMENTO, AP.FECHA_REALIZA_PAGO, AP.FORMA_PAGO,
		CASE WHEN AP.TIPO_PAGO = '1' THEN 'ABONO' ELSE 'TOTAL' END AS TIPO,
		CASE WHEN AP.ESTADO = '1' THEN 'PREJURÍDICA' ELSE 'JURÍDICA' END AS ESTADO,
		CASE WHEN AP.CUMPLE = '1' THEN 'SI' WHEN AP.CUMPLE = '2' THEN 'NO' ELSE '-' END AS CUMPLE_T
		FROM T_ACUERDOS_PAGO AP 
		INNER JOIN T_PROCESOS_JURIDICOS PJ ON AP.CODIGO = PJ.CODIGO
		WHERE AP.CODIGO = '$codigo' AND AP.ESTADO = '$estado'
		ORDER BY AP.FECHA_PAGO ASC";

		$resultado = GenerarArray($sql, "");

		if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
		else echo json_encode(['ok' => false, 'data' => []]);
		break;
}