<?php
session_start();
require_once('funciones.php');
conectar();
switch ($_POST["op"]) {
	case 's_planilla_detalle': {
			$sp  = mssql_init('P_DESPACHO_LOTE_S_FACT_DET');
			mssql_bind($sp, '@FH_INI', $_POST['fh_ini'], SQLVARCHAR, false, false);
			mssql_bind($sp, '@FH_FIN', $_POST['fh_fin'], SQLVARCHAR, false, false);
			mssql_bind($sp, '@OFICINA', $_POST['oficina'], SQLVARCHAR, false, false);
			$r   = mssql_execute($sp);
			echo json_encode(GenerarArray($r, 'SP'));
			mssql_close();
		}
		break;
	case 's_listar_mensajeros': {
			$sql = "SELECT 
			U.ID,
			UPPER(U.NOMBRES +' '+U.APELLIDOS) AS NOMBRES,
		    NUM_FAC_PENDIENTES = (SELECT COUNT(*) AS NUM_PENDIENTES FROM T_DESPACHO_LOTE L
								  INNER JOIN T_DESPACHO_LOTE_DET D ON D.ID_LOTE = L.ID
								  WHERE 
								  L.ID_USUARIO = U.ID AND L.TIPO_USUARIO = 'M' AND D.ESTADO = 'D')
		  FROM T_USUARIOS U 
		  WHERE 
			U.ROLES_ID = 24 and
			U.OFICINA_VENTAS = '" . $_POST['oficina'] . "'";
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case 's_verificar_mensajero': {
			$sql = "SELECT 
			U.ID,
		    NUM_FAC_PENDIENTES = ISNULL((SELECT COUNT(*) AS NUM_PENDIENTES FROM T_DESPACHO_LOTE L
								  INNER JOIN T_DESPACHO_LOTE_DET D ON D.ID_LOTE = L.ID
								  WHERE 
								  L.ID_USUARIO = U.ID AND L.TIPO_USUARIO = 'M' AND D.ESTADO = 'D'),0),
			BLOQUEO_PLANILLA = 'S'
		  FROM T_USUARIOS U 
		  WHERE 
			U.ID = '" . $_POST['id'] . "'";
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case 's_verificar_transportador': {
			$sql = "SELECT 
			 T.ID,
			 NUM_FAC_PENDIENTES = (SELECT COUNT(*) AS NUM_PENDIENTES FROM T_DESPACHO_LOTE L
									INNER JOIN T_DESPACHO_LOTE_DET D ON D.ID_LOTE = L.ID
									WHERE 
									L.ID_USUARIO = T.ID AND L.TIPO_USUARIO = 'T' AND D.ESTADO = 'D'),
			 T.BLOQUEO_PLANILLA
		  FROM T_TRANSPORTADORES T
		  WHERE 
			T.ID = '" . $_POST['id'] . "'";
			echo json_encode(GenerarArray($sql, ""));
			mssql_close();
		}
		break;
	case 'P_DESPACHOS_S': {
			$num = trim($_POST["numero"]);
			$sp  = mssql_init('P_DESPACHOS_S');
			mssql_bind($sp, '@NUMERO', $num, SQLVARCHAR, false, false);
			$r   = mssql_execute($sp);
			echo json_encode(GenerarArray($r, 'SP'));
			mssql_close();
		}
		break;
	case 'P_DESPACHO_LOTE_S': {
			$sp  = mssql_init('P_DESPACHO_LOTE_S');
			mssql_bind($sp, '@FHINI', trim($_POST["fhini"]),  SQLVARCHAR, false, false);
			mssql_bind($sp, '@FHFIN', trim($_POST["fhfin"]),  SQLVARCHAR, false, false);
			mssql_bind($sp, '@OFICINA', trim($_POST["oficina"]), SQLVARCHAR, false, false);
			$r   = mssql_execute($sp);

			$datos = array();
			while ($row = mssql_fetch_array($r)) {
				$datos[] = array(
					'ID'             => $row['ID'],
					'FECHA_LOTE'     => trim($row['FECHA_LOTE']),
					'ORGANIZACION'   => trim($row['ORGANIZACION']),
					'OFICINA_VENTAS' => trim($row['OFICINA_VENTAS']),
					'TIPO_USUARIO'   => trim($row['TIPO_USUARIO']),
					'USUARIO'        => utf8_encode(trim($row['USUARIO'])),
					'CANT_ENTREGAS'  => trim($row['CANT_ENTREGAS']),
					'ENTREGADOS'     => trim($row['ENTREGADOS'])
				);
			}
			echo json_encode($datos);
			//echo json_encode(GenerarArray($r,'SP'));
			mssql_close();
		}
		break;
	case 'P_DESPACHO_LOTE_DET_S': {
			$sp  = mssql_init('P_DESPACHO_LOTE_DET_S');
			mssql_bind($sp, '@ID_LOTE', trim($_POST["id"]), SQLINT4, false, false);
			$r   = mssql_execute($sp);
			echo json_encode(GenerarArray($r, 'SP'));
			mssql_close();
		}
		break;
	case 'P_DESPACHO_LOTES_I': {
			$usuario_id = $_POST['id_ser'];
			$org        = $_POST["org"];
			$ofc        = $_POST["ofc"];
			$tipo_usr   = $_POST["tipo_usr"];
			$id_usu_crea = $_SESSION["ses_Id"];
			$id         = '';
			$sp  = mssql_init('P_DESPACHO_LOTE_I');
			mssql_bind($sp, '@ID_USUARIO', $usuario_id, SQLINT4, false, false);
			mssql_bind($sp, '@TIPO_USUARIO', QuitarCaracter($tipo_usr), SQLVARCHAR, false, false);
			mssql_bind($sp, '@ORGANIZACION', QuitarCaracter($org), SQLVARCHAR, false, false);
			mssql_bind($sp, '@OFICINA',      QuitarCaracter($ofc), SQLVARCHAR, false, false);
			mssql_bind($sp, '@ID_USUARIO_CREACION', $id_usu_crea, SQLINT4, false, false);
			mssql_bind($sp, '@ID', $id, SQLINT4, true, false);
			$r = mssql_execute($sp);
			if ($id > 0) {
				echo $id;
			} else {
				echo 0;
			}
		}
		break;
	case 'P_DESPACHO_LOTES_DET_I': {
			$flete      = $_POST['flete'];
			$guia       = $_POST['guia'];
			$num_fact   = $_POST["num_fact"];
			$id         = $_POST['id'];
			$reexpide   = $_POST['reexpide'];
			$idReexpide = $_POST['idReexpide'];
			$GruLab     = $_POST['GruLab'];
			$id_det     = '';

			$sp  = mssql_init('P_DESPACHO_LOTE_DET_I');
			mssql_bind($sp, '@ID_LOTE', $id, SQLINT4, false, false);
			mssql_bind($sp, '@NUMERO_FACTURA', trim(QuitarCaracter($num_fact)), SQLVARCHAR, false, false);
			mssql_bind($sp, '@FLETE', $flete, SQLINT4, false, false);
			mssql_bind($sp, '@GUIA', QuitarCaracter($guia), SQLVARCHAR, false, false);
			mssql_bind($sp, '@REEXPIDE', QuitarCaracter($reexpide), SQLVARCHAR, false, false);
			mssql_bind($sp, '@IDREEXPIDE', QuitarCaracter($idReexpide), SQLINT4, false, false);
			mssql_bind($sp, '@ID', $id_det, SQLINT4, true, false);
			$r = mssql_execute($sp);
			if ($id_det > 0) {
				echo $id_det;
			} else {
				echo 0;
			}
		}
		break;
	case 'P_DESPACHO_LOTES_DET_U': {
			$id   		= $_POST['id'];
			$nota 		= $_POST['nota'];
			$id_usuario   = $_SESSION["ses_Id"];
			$sp   = mssql_init('P_DESPACHO_LOTE_DET_U');
			mssql_bind($sp, '@ID', $id, 		              SQLINT4,   false, false);
			mssql_bind($sp, '@NOTA', QuitarCaracter($nota), SQLVARCHAR, false, false);
			mssql_bind($sp, '@ID_USUARIO', $id_usuario,     SQLINT4,   false, false);
			$r = mssql_execute($sp);
			if ($r) {
				echo 1;
			} else {
				echo 0;
			}
		}
		break;
	case 'P_LIBERAR_DESPACHO': {

			$id       = $_POST['id'];
			$id_det   = $_POST['id_det'];
			$id_user  = $_POST['id_user'];
			$id_con   = $_POST['id_con'];
			$num_fact = $_POST["num_fact"];
			$id_usu_lib = $_SESSION["ses_Id"];

			$sp  = mssql_init('P_LIBERAR_DESPACHO');
			mssql_bind($sp, '@ID_LOTE',     $id, SQLINT4, false, false);
			mssql_bind($sp, '@ID_LOTE_DET', $id_det, SQLINT4, false, false);
			mssql_bind($sp, '@ID_USUARIO',  $id_user, SQLINT4, false, false);
			mssql_bind($sp, '@ID_USUARIO_LIB',  $id_usu_lib, SQLINT4, false, false);
			mssql_bind($sp, '@ID_CONCEPTO', $id_con, SQLINT4, false, false);
			mssql_bind($sp, '@NUM_FACT',    $num_fact, SQLVARCHAR, false, false);
			$r = mssql_execute($sp);
			if ($r) {
				echo 0;
			} else {
				echo 1;
			}
		}
		break;
	case "P_REPORTE_TRASPORTISTAS_S":
		$id_usuario = $_POST["id_ser"];
		$n_planilla = $_POST["n_planilla"];
		$fhini = trim($_POST["fhini"]);
		$fhfin = trim($_POST["fhfin"]);
		$ofi       = $_POST["ofc"];
		$num_fact  = $_POST["num_fact"];
		//
		$sql = "SELECT
                    DL.OFICINA_VENTAS,
					Z.ZONA_DESCRIPCION,
					Z.ZONA_VENTAS	,				
					DLD.FLETE,					
					/*CASE */
					CASE WHEN DL.TIPO_USUARIO='T' THEN 
					  (SELECT T.VEHICULO FROM T_TRANSPORTADORES T WHERE T.ID=DL.ID_USUARIO)
					ELSE ''
					END AS VEHICULO,					
					/*CASE */
					CASE WHEN DL.TIPO_USUARIO='T' THEN (SELECT T.PLACA FROM T_TRANSPORTADORES T WHERE T.ID=DL.ID_USUARIO)
					ELSE '' END AS PLACA,					
					/*CASE */
					CASE WHEN DL.TIPO_USUARIO='T' THEN (SELECT T.NOMBRES FROM T_TRANSPORTADORES T WHERE T.ID=DL.ID_USUARIO)
					ELSE (SELECT U.NOMBRES  FROM T_USUARIOS U  WHERE U.ID=DL.ID_USUARIO ) END AS TRASPORTADOR,
					/*CASE*/
					SUM(CASE WHEN T2.CONDICION_PAGO='Z001'  THEN
					   CASE WHEN PD.VALOR_UNITARIO>0 THEN 
						 ISNULL(ROUND((ROUND(PD.VALOR_UNITARIO*(1+ISNULL((PD.IVA/100),0))*(1-ISNULL(  ROUND( (((PD.VALOR_DESCUENTO/PD.CANTIDAD)*100)/PD.VALOR_UNITARIO),2)  ,0)/100),0))*PD.CANTIDAD,0),0)
						ELSE 0
					   END
					ELSE 0
					END) AS CONTADO,
					/*CASE*/
					SUM(CASE WHEN T2.CONDICION_PAGO<>'Z001' THEN
					    CASE WHEN PD.VALOR_UNITARIO>0 THEN 
						 ISNULL(ROUND((ROUND(PD.VALOR_UNITARIO*(1+ISNULL((PD.IVA/100),0))*(1-ISNULL(  ROUND( (((PD.VALOR_DESCUENTO/PD.CANTIDAD)*100)/PD.VALOR_UNITARIO),2)  ,0)/100),0))*PD.CANTIDAD,0),0)
						ELSE
						0 END
					ELSE 0 END) AS CREDITO,
					/*CASE */
					CASE WHEN DLD.ESTADO='E' THEN 'ENVIADO'
					     WHEN DLD.ESTADO='D' THEN 'DESPACHADO'
						 WHEN DLD.ESTADO='L' THEN 'LIBERADO'
					END AS ESTADO,
					/*CASE */
					ISNULL(SUM(CASE WHEN DLD.ESTADO='L' THEN 1 ELSE 0 END),0) AS DEVOLUCIONES,					
					USUARIO_CREACION   =  UC.NOMBRES +' ' +UC.APELLIDOS,
					USUARIO_LIB        =  ISNULL(UL.NOMBRES +' ' +UL.APELLIDOS,''),
					USUARIO_FIN        =  ISNULL(UF.NOMBRES +' ' +UF.APELLIDOS,''),
					FECHA_DESBLOQUEO   =  CAST(isnull(L.FECHA_HORA,'01/01/1900') as date),
					NUMERO_FACTURA     =  ISNULL(DLD.NUMERO_FACTURA,''),
					TOTAL_PLANILLA     =  (SELECT SUM(flete) FROM T_DESPACHO_LOTE_DET TMP WHERE TMP.ID_LOTE=DL.ID),
					HORA_DESBLOQUEO    =  CONVERT(VARCHAR(10),isnull(L.FECHA_HORA,'01/01/1900') ,108) ,
					N_PLANILLA         =  DL.ID  ,
					FECHA			   =  CAST(DL.FECHA_LOTE AS DATE)  ,
					HORA               =  CONVERT(VARCHAR(10),DL.FECHA_LOTE,108)  ,
					P.OFICINA_VENTAS,
					PCJ_VENTA=SUM( CASE WHEN PD.VALOR_UNITARIO>0 THEN 
						 ISNULL(ROUND((ROUND(PD.VALOR_UNITARIO*(1+ISNULL((PD.IVA/100),0))*(1-ISNULL(  ROUND( (((PD.VALOR_DESCUENTO/PD.CANTIDAD)*100)/PD.VALOR_UNITARIO),2)  ,0)/100),0))*PD.CANTIDAD,0),0)
						ELSE
						0
					   END)*(ZF.PORCENTAJE_FLETE/100),
					  ISNULL(ZF.PORCENTAJE_FLETE,0) as PORCENTAJE_FLETE,
					  ISNULL(DLD.GUIA,'') as GUIA,
					  Q.CIUDAD  AS CIUDAD_FLETE,
					  ISNULL(CONVERT(VARCHAR(30),DLD.FECHA_FIN,120),'') AS FECHA_FIN,
                      ISNULL(CONVERT(VARCHAR(30),DLD.FECHA_INICIO,120),'') AS FECHA_INICIO,
					  ISNULL(DATEDIFF(MINUTE, DLD.FECHA_INICIO,DLD.FECHA_FIN),0) AS DIFERENCIA,
					  ENTREGAS = (SELECT COUNT(*) FROM T_DESPACHO_LOTE_DET LDN WHERE LDN.ID_LOTE = DL.ID )				
					FROM T_DESPACHO_LOTE_DET      DLD
					INNER  JOIN  T_DESPACHO_LOTE               DL ON DL.ID              =DLD.ID_LOTE 
					INNER  JOIN  T_PEDIDOS_FACTURA_DETALLE     PD ON PD.NUMERO_FACTURA  =DLD.NUMERO_FACTURA
					INNER  JOIN  T_PEDIDOS                     P  ON P.NUMERO           =PD.NUMERO_PEDIDO 
					INNER  JOIN  T_TERCEROS                    Q  ON Q.CODIGO_SAP       =P.CODIGO_SAP
					INNER  JOIN  T_TERCEROS_ORGANIZACION       T2 ON Q.CODIGO_SAP       =T2.CODIGO_SAP AND  T2.OFICINA_VENTAS =" . $ofi . " 
					INNER  JOIN  T_ZONAS_VENTAS                Z  ON Z.ZONA_VENTAS      =T2.ZONA_VENTAS
					LEFT   JOIN  T_USUARIOS                    UF  ON UF.ID             =DLD.ID_USUARIO_FIN
					LEFT   JOIN  T_LIBERACION_FACTURA_DESPACHO L  ON L.NUMERO_FACTURA   =DLD.NUMERO_FACTURA
					LEFT   JOIN  T_USUARIOS                    UL ON UL.ID              =L.ID_USUARIO_LIB
					LEFT   JOIN  T_USUARIOS                    UC ON UC.ID              =DL.ID_USUARIO_CREACION 
					LEFT   JOIN  T_ZONA_FLETES                 ZF ON ZF.ZONA            =T2.ZONA_VENTAS 
					WHERE  
					P.OFICINA_VENTAS =" . $ofi . " 
					AND CAST(DL.FECHA_LOTE AS DATE)>=CAST('" . $fhini . "' AS DATE) AND
						CAST(DL.FECHA_LOTE AS DATE)<=CAST('" . $fhfin . "' AS DATE) ";
		if ($id_usuario != 0) {
			$sql .= " AND DL.ID_USUARIO=" . $id_usuario;
		}
		if ($n_planilla != 0) {
			$sql .= " AND DL.ID=" . $n_planilla;
		}
		if ($num_fact != 0) {
			$sql .= " AND DLD.NUMERO_FACTURA='" . $num_fact . "'";
		}
		$sql .= " GROUP BY
			        Q.CIUDAD,
					DL.OFICINA_VENTAS,
					DL.TIPO_USUARIO,
					DL.ID,
					DL.FECHA_LOTE,
					DLD.NUMERO_FACTURA,
					Z.ZONA_DESCRIPCION,
					DLD.FLETE,
					DL.ID_USUARIO,
					DLD.ESTADO,
					UC.NOMBRES,
					UC.APELLIDOS,
					UL.NOMBRES,
					UL.APELLIDOS,
					UF.NOMBRES,
					UF.APELLIDOS,
					DLD.GUIA,
					T2.CONDICION_PAGO,
					cast(isnull(L.FECHA_HORA,'') as date),
					isnull(L.FECHA_HORA,'01/01/1900'),
					DLD.ID,
					P.OFICINA_VENTAS,
					Z.ZONA_VENTAS,
					ZF.PORCENTAJE_FLETE,
					DLD.FECHA_FIN,
                    DLD.FECHA_INICIO
					
					ORDER BY
				    CASE WHEN DL.TIPO_USUARIO='T' THEN 
					  (SELECT T.NOMBRES FROM T_TRANSPORTADORES T WHERE T.ID=DL.ID_USUARIO)
					ELSE
					   (SELECT U.NOMBRES +' '+ U.APELLIDOS  FROM T_USUARIOS U  WHERE U.ID=DL.ID_USUARIO )
					END,
					DL.ID
					";
		//	echo $sql;
		$query = mssql_query($sql);
		$datos = array();
		$tras = 0;
		$e_enviado = 0;
		while ($row = mssql_fetch_assoc($query)) {
			$datos[] = array(
				'oficina'                 => $row['OFICINA_VENTAS'],
				'transportador'           => strtoupper(utf8_encode($row['TRASPORTADOR'])),
				'n_planilla'              => $row['N_PLANILLA'],
				'placa'                   => $row['PLACA'],
				'vehiculo'                => $row['VEHICULO'],
				'fecha'                   => $row['FECHA'],
				'hora'                    => $row['HORA'],
				'numero_factura'          => $row['NUMERO_FACTURA'],
				'cod_zona'                => $row['ZONA_VENTAS'],
				'zona'                    => utf8_decode($row['ZONA_DESCRIPCION']),
				'contado'                 => $row['CONTADO'],
				'credito'                 => $row['CREDITO'],
				'estado'                  => trim($row['ESTADO']),
				'flete'                   => ($row['FLETE']),
				'devoluciones'            => $row["DEVOLUCIONES"],
				'usuario_creacion'        => utf8_decode($row["USUARIO_CREACION"]),
				'usuario_lib'             => utf8_decode($row["USUARIO_LIB"]),
				'usuario_fin'             => utf8_decode($row["USUARIO_FIN"]),
				'fecha_desbloqueo'        => $row["FECHA_DESBLOQUEO"],
				'hora_desbloqueo'         => $row["HORA_DESBLOQUEO"],
				'total_flete_planilla'    => $row["TOTAL_PLANILLA"],
				'valor_pcj_flete_venta'   => $row["PCJ_VENTA"],
				'flete_pcj'               => $row["PORCENTAJE_FLETE"],
				'guia'                    => trim(utf8_encode($row['GUIA'])),
				'ciudad'                  => utf8_decode($row["CIUDAD_FLETE"]),
				'fecha_inicio'            => $row["FECHA_INICIO"],
				'fecha_fin'               => $row["FECHA_FIN"],
				'diferencia'              => $row["DIFERENCIA"],
				'entrega'                 => $row["ENTREGAS"],
			);
			//echo $row['VEHICULO'];
		}
		echo json_encode($datos);
		break;

	case "D_LIBERADOS":
		$oficina        = $_POST["oficina"];
		$fecha_ini      = $_POST["fecha_ini"];
		$fecha_fin      = $_POST["fecha_fin"];
		$numero_factura = trim($_POST["numero_factura"]);
		$planilla       = trim($_POST["planilla"]);
		$sql = "SELECT 
				   CASE 
					   WHEN PF.OFICINA_VENTAS ='1100' THEN 'Montería'
					   WHEN PF.OFICINA_VENTAS ='1200' THEN 'Cartagena'
					   WHEN PF.OFICINA_VENTAS ='2100' THEN 'Medellín'
					   WHEN PF.OFICINA_VENTAS ='2200' THEN 'Bogotá'
					   WHEN PF.OFICINA_VENTAS ='2300' THEN 'Cali'
					   WHEN PF.OFICINA_VENTAS ='2400' THEN 'Barranquilla'
				   END  AS SEDE    ,
				   D.FECHA_LOTE AS FECHA,
				   DL.NUMERO_FACTURA AS FACTURA,
				   DL.ID_LOTE AS PLANILLA,
				   HORA    =  CONVERT(VARCHAR(10),isnull(L.FECHA_HORA,'01/01/1900') ,108),
				   /*CASE*/
				   SUM(CASE WHEN T2.CONDICION_PAGO='Z001'  THEN
						CASE WHEN PD.VALOR_UNITARIO>0 THEN 
						   ISNULL(ROUND((ROUND(PD.VALOR_UNITARIO*(1+ISNULL((PD.IVA/100),0))*(1-ISNULL(  ROUND( (((PD.VALOR_DESCUENTO/PD.CANTIDAD)*100)/PD.VALOR_UNITARIO),2)  ,0)/100),0))*PD.CANTIDAD,0),0)
						ELSE
						   0
						END
				   ELSE
						0
				   END) AS CONTADO,
				   /*CASE*/
				   SUM(CASE WHEN T2.CONDICION_PAGO<>'Z001' THEN
					  CASE WHEN PD.VALOR_UNITARIO>0 THEN 
						   ISNULL(ROUND((ROUND(PD.VALOR_UNITARIO*(1+ISNULL((PD.IVA/100),0))*(1-ISNULL(  ROUND( (((PD.VALOR_DESCUENTO/PD.CANTIDAD)*100)/PD.VALOR_UNITARIO),2)  ,0)/100),0))*PD.CANTIDAD,0),0)
					   ELSE
						   0
					   END
				   ELSE
						0
				   END) AS CREDITO,
				   U.LOGIN AS USUARIO_LIB,
				   ISNULL(M.MOTIVO,'') AS CAUSAL
				   FROM T_DESPACHO_LOTE_DET DL
				   INNER JOIN T_LIBERACION_FACTURA_DESPACHO L  ON L.NUMERO_FACTURA =DL.NUMERO_FACTURA AND L.ID_DESPACHO_LOTE_DET=DL.ID
				   INNER JOIN T_USUARIOS 					 U  ON U.ID             =L.ID_USUARIO_LIB
				   INNER JOIN T_USUARIOS                    UC ON UC.ID            =L.ID_USUARIO
				   INNER JOIN T_PEDIDOS_FACTURA             PF ON PF.NUMERO_FACTURA=DL.NUMERO_FACTURA
				   INNER JOIN T_PEDIDOS_FACTURA_DETALLE     PD ON PD.NUMERO_FACTURA=PF.NUMERO_FACTURA
			   
				   INNER JOIN T_TERCEROS                    T  ON T.CODIGO_SAP     =PF.CODIGO_SAP
				   INNER JOIN T_TERCEROS_ORGANIZACION       T2 ON T2.CODIGO_SAP    =T.CODIGO_SAP AND T2.OFICINA_VENTAS =" . $oficina . " 
				   INNER JOIN T_DESPACHO_LOTE               D  ON D.ID             =DL.ID_LOTE
				   LEFT JOIN T_LOG_MOTIVOS_ANULACION_PLANILLA M ON M.ID =L.ID_CONCEPTO
				   WHERE PF.OFICINA_VENTAS=" . $oficina . "  AND  
				   CAST(D.FECHA_LOTE AS DATE)>=CAST('" . $fecha_ini . "' AS DATE) AND CAST(D.FECHA_LOTE AS DATE)<=CAST('" . $fecha_fin . "' AS DATE)
					";
		if ($planilla != "") {
			$sql .= " AND  D.ID=" . $planilla;
		}
		if ($numero_factura != "") {
			$sql .= " AND DL.NUMERO_FACTURA='" . $numero_factura . "' ";
		}

		$sql .= " GROUP BY
				   PF.OFICINA_VENTAS,
				   D.FECHA_LOTE,
				   PD.NUMERO_PEDIDO,
				   DL.NUMERO_FACTURA,
				   DL.ID_LOTE,
				   U.LOGIN,
				   CONVERT(VARCHAR(10),isnull(L.FECHA_HORA,'01/01/1900') ,108),ISNULL(M.MOTIVO,'')";
		//echo  $sql;		
		$query = mssql_query($sql);
		$datos = array();

		while ($row = mssql_fetch_assoc($query)) {

			//$hora=$fech_des[1];
			$datos[] = array(
				'sede'              => $row['SEDE'],
				'fecha'             => $row['FECHA'],
				'factura'           => $row['FACTURA'],
				'planilla'          => $row['PLANILLA'],
				'hora'              => $row['HORA'],
				'contado'           => $row['CONTADO'],
				'credito'           => $row['CREDITO'],
				'usuario'           => utf8_encode($row['USUARIO_LIB']),
				'causal'			=> utf8_encode($row["CAUSAL"])
			);
		}
		echo json_encode($datos);
		break;
	case "D_LIBERADOS_EST":
		$oficina        = $_POST["oficina"];
		$fecha_ini      = $_POST["fecha_ini"];
		$fecha_fin      = $_POST["fecha_fin"];
		$numero_factura = trim($_POST["numero_factura"]);
		$planilla       = trim($_POST["planilla"]);
		$sql = "
	SELECT
	COUNT(*) AS N,
	M.MOTIVO AS CAUSAL
	FROM T_DESPACHO_LOTE_DET DL
	INNER JOIN T_LIBERACION_FACTURA_DESPACHO L  ON L.NUMERO_FACTURA =DL.NUMERO_FACTURA 
	AND L.ID_DESPACHO_LOTE_DET=DL.ID
	INNER JOIN T_PEDIDOS_FACTURA             PF ON PF.NUMERO_FACTURA=DL.NUMERO_FACTURA
	LEFT JOIN T_LOG_MOTIVOS_ANULACION_PLANILLA M ON M.ID =L.ID_CONCEPTO
	WHERE PF.OFICINA_VENTAS=" . $oficina . "   
	AND  CAST(L.FECHA_HORA AS DATE)>=CAST('$fecha_ini' AS DATE) 
	AND  CAST(L.FECHA_HORA AS DATE)<=CAST('$fecha_fin' AS DATE) ";

		if ($planilla != "") {
			$sql .= " AND  DL.ID_LOTE=" . $planilla;
		}
		if ($numero_factura != "") {
			$sql .= " AND DL.NUMERO_FACTURA='" . $numero_factura . "' ";
		}

		$sql .= "GROUP BY
	M.MOTIVO
	ORDER BY COUNT(*) DESC 
   ";
		$query = mssql_query($sql);
		$datos = array();

		while ($row = mssql_fetch_assoc($query)) {

			//$hora=$fech_des[1];
			$datos[] = array(
				'cantidad'           => ($row['N']),
				'causal'			=> utf8_encode($row["CAUSAL"])
			);
		}
		echo json_encode($datos);
		break;

	case "TIPO_TRASPORTISTA":

		$sql = "SELECT TIPO_T_ID  FROM T_TRANSPORTADORES WHERE ID=" . $_POST["id"];
		$query = mssql_query($sql);
		while ($row = mssql_fetch_assoc($query)) {
			echo $row["TIPO_T_ID"];
		}
		break;
	case "UDATE_FLETE":
		$sql = "UPDATE T_DESPACHO_LOTE_DET SET FLETE=" . $_POST["valor"] . " WHERE ID=" . $_POST["id"];
		$query = mssql_query($sql);
		if ($query) {
			echo $_POST["id"];
		} else {
			echo 0;
		}
		break;
	case "UPDATE_GUIA":
		$sql = "UPDATE T_DESPACHO_LOTE_DET SET GUIA='" . $_POST["valor"] . "'  WHERE ID=" . $_POST["id"];
		$query = mssql_query($sql);
		if ($query) {
			echo $_POST["id"];
		} else {
			echo 0;
		}
		break;

	case "s_lista_flete": 
		$oficina = $_POST['oficina'];

		$sql = "SELECT ID, LISTA, PORCENTAJE, OFICINA, ORGANIZACION
		FROM T_LISTAS_FLETES 
		WHERE oficina = '$oficina'";

		$resultado = GenerarArray($sql, "");
		if ($resultado)	echo json_encode(['ok' => true, 'data' => $resultado]);
		else echo json_encode(['ok' => false, 'data' => []]);
		mssql_close();
		break;

	case "G_LISTA_ID": 
		$id = $_POST['id'];

		$sql = "SELECT * FROM T_LISTAS_FLETES WHERE ID = '$id'";

		$resultado = GenerarArray($sql, "");
		if ($resultado)	echo json_encode(['ok' => true, 'data' => $resultado]);
		else echo json_encode(['ok' => false, 'data' => []]);
		mssql_close();
		break;

	case "VERIFICAR_EXISTE_LISTA": 
		$oficina = $_POST['oficina'];
		$lista = $_POST['lista'];

		$sql = "SELECT * FROM T_LISTAS_FLETES WHERE LISTA = '$lista' AND OFICINA = '$oficina'";
		$resultado = GenerarArray($sql, "");

		if ($resultado)	echo json_encode(['ok' => true, 'data' => $resultado]);
		else echo json_encode(['ok' => false, 'data' => []]);
		mssql_close();
		break;

	case "d_lista_flete":
		$id = $_POST['id'];

		$sql = "DELETE FROM T_LISTAS_FLETES WHERE ID = '$id'";
		$resultado = mssql_query($sql);

		if ($resultado) echo json_encode(['ok' => true, 'msg' => "Lista eliminada correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al eliminar lista"]);
		break;

	case "i_lista_flete":
		$lista = $_POST['lista'];
		$flete = $_POST['flete'];
		$oficina = $_POST['oficina'];
		$organizacion = $_SESSION["ses_NumOrg"];

		$sql = "INSERT INTO T_LISTAS_FLETES (LISTA, PORCENTAJE, OFICINA, ORGANIZACION)
		VALUES ('$lista', '$flete', '$oficina', '$organizacion')";

		$query = mssql_query($sql);
		if ($query) echo 1;
		else echo 0;
		break;

	case "U_LISTA_FLETES":
		$idLista = intval($_POST['id']);
		$flete = $_POST['flete'];

		$sql = "UPDATE T_LISTAS_FLETES SET PORCENTAJE = '$flete' WHERE ID = $idLista";
		$query = mssql_query($sql);

		if ($query) echo json_encode(['ok' => true, 'msg' => "Actualizado correctamente"]);
		else echo json_encode(['ok' => false, 'msg' => "Error al actualizar"]);
		break;
}
