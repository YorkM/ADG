<?php
include('funciones.php');
session_start();
conectar();
switch($_POST['op']){
case 'CargarClienteLogin':{
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
			O.ORGANIZACION_VENTAS = ".mb_strtoupper($_POST["org"], "UTF-8")." AND 
			O.CANAL_DISTRIBUCION  = 10 AND U.ID= '".$_POST["id_cliente"]."' ";
	  echo json_encode(GenerarArray($sql,""));
	  mssql_close();
 }break; case 'B_CLIENTES':{ 
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
			O.ORGANIZACION_VENTAS = ".mb_strtoupper($_POST["org"], "UTF-8")." AND 
			O.CANAL_DISTRIBUCION  = 10 AND ".palabras_terceros(utf8_decode($_POST["term"]),'t');
	  echo json_encode(GenerarArray($sql,""));
	  mssql_close();
 }break;
 case 'B_DEPARTAMENTOS':{
   $sql = "SELECT DEPARTAMENTO,DESCRIPCION FROM T_DEPARTAMENTOS";
   echo json_encode(GenerarArray($sql,""));
   mssql_close();
 }break;
 case 'B_CIUDADES':{
   $sql = "SELECT CIUDAD,DESCRIPCION FROM T_CIUDADES WHERE DEPARTAMENTO = '".$_POST['dpto']."'";
   echo json_encode(GenerarArray($sql,""));
   mssql_close();
 }break;
 case 'B_DIRECCIONES':{
   $sql = "SELECT 
			 D.ID,
			 D.DIRECCION,
			 P.DESCRIPCION AS DPTO,
			 C.DESCRIPCION AS CIUDAD
			FROM T_TERCEROS_DIR D 
			INNER JOIN T_DEPARTAMENTOS P ON P.DEPARTAMENTO = D.DEPARTAMENTO
			INNER JOIN T_CIUDADES C ON C.CIUDAD = D.CIUDAD AND C.DEPARTAMENTO = D.DEPARTAMENTO
			WHERE 
			 D.CODIGO_SAP = '".$_POST['codigo']."'";
   echo json_encode(GenerarArray($sql,""));
   mssql_close();
 }break;
 case 'B_ACUERDOS':{
    $sql = "SELECT  
			  T.ID, 
			  vlr=(select sum(vs.p_neto) from v_facturacion  vs  WHERE 
			  		---vs.tipo_factura IN('zf01','zf03','zf05','zf07','zf09','zf10','zf11','zf12','znc2') AND   
					(vs.tipo_factura like 'ZF%' or vs.tipo_factura like 'ZN%') and 
			  		vs.fecha between  t.FECHA_INI and t.FECHA_FIN     AND
					vs.organizacion_ventas = '".$_POST['org']."' and    vs.CODIGO_SAP=t.CODIGO_SAP ),T.ADJUNTO,T.ID,T.NUMERO,T.FECHA_INI,T.FECHA_FIN,T.INCENTIVO,T.MONTO,T.OBSERVACION,TT.NOMBRES

 FROM T_ACUERDO_COMERCIAL T  
  INNER JOIN T_TERCEROS TT ON(TT.CODIGO_SAP=T.CODIGO_SAP)
 WHERE  T.CODIGO_SAP='".$_POST['codigo']."'"; 
   echo json_encode(GenerarArray($sql,""));
   mssql_close();
 }break;
 case 'B_PAGARES':{
    $sql = " SELECT T.ID,T.CODIGO_SAP,T.ADJUNTO,TT.NOMBRES FROM T_PAGARES T 
INNER JOIN T_TERCEROS TT ON(TT.CODIGO_SAP=T.CODIGO_SAP)
WHERE T.CODIGO_SAP= '".$_POST['codigo']."'";
   echo json_encode(GenerarArray($sql,""));
   mssql_close();
 }break;
 case 'G_DIRECCIONES':{
	$sql="INSERT INTO T_TERCEROS_DIR(CODIGO_SAP,CIUDAD,DEPARTAMENTO,DIRECCION)VALUES('".$_POST['codigo']."','".$_POST['mpio']."','".$_POST['dpto']."','".strtoupper($_POST['dir'])."')";
	if(mssql_query($sql)){
	  echo 1;
	}else{
	  echo 0;
	}
 }break;
 case 'D_DIRECCIONES':{
	$sql="DELETE FROM T_TERCEROS_DIR WHERE ID = '".$_POST['id']."'";
	if(mssql_query($sql)){
	  echo 1;
	}else{
	  echo 0;
	}
 }break;
 case 'D_ACUERDOS':{
	$sql="DELETE FROM T_ACUERDO_COMERCIAL WHERE ID = '".$_POST['id']."'";
	if(mssql_query($sql)){
	  echo 1;
	}else{
	  echo 0;
	}
 }break;
 case 'B_CARTERA_RC':{  
   $tipo = 'S';
   $sp   = mssql_init('P_CARTERA');
	        mssql_bind($sp, '@CODIGO_SAP', $_POST["codigo"], SQLVARCHAR, false, false);	
			mssql_bind($sp, '@ORGANIZACION', $_POST["org"], SQLVARCHAR, false, false);
			mssql_bind($sp, '@TIPO', $_POST["tipo"], SQLVARCHAR, false, false);					   
     $r   = mssql_execute($sp);
	 echo json_encode(GenerarArray($r,'SP'));
	 mssql_close();
 }break;
 case 'B_CARTERA':{  
   $tipo = 'S';
   $sp   = mssql_init('ZP_CARTERA');
	        mssql_bind($sp, '@CODIGO_SAP', $_POST["codigo"], SQLVARCHAR, false, false);	
			mssql_bind($sp, '@ORGANIZACION', $_POST["org"], SQLVARCHAR, false, false);
			mssql_bind($sp, '@TIPO', $_POST["tipo"], SQLVARCHAR, false, false);
			mssql_bind($sp, '@DepId', $_POST["DepId"], SQLVARCHAR, false, false);
			mssql_bind($sp, '@ANIO', $_POST["anio"], SQLINT4, false, false);						   
     $r   = mssql_execute($sp);
	 echo json_encode(GenerarArray($r,'SP'));
	 mssql_close();
 }break;
 case 'B_MATERIALES':{
   $b_regu = palabras_materiales(utf8_decode($_POST['term']),'m');
   $sql="SELECT DISTINCT TOP 5
			 UPPER(M.CODIGO_MATERIAL+' - '+ISNULL(M.DESCRIPCION2,M.DESCRIPCION)) AS value, 
			 M.CODIGO_MATERIAL, 
			 ISNULL(M.DESCRIPCION2,M.DESCRIPCION) AS DESCRIPCION 
		 FROM T_MATERIALES M 
		 INNER JOIN T_PEDIDOS_FACTURA_DETALLE D ON D.CODIGO_MATERIAL = M.CODIGO_MATERIAL
		 INNER JOIN T_PEDIDOS_FACTURA F ON F.NUMERO_FACTURA = D.NUMERO_FACTURA AND F.NUMERO_PEDIDO = D.NUMERO_PEDIDO
		 INNER JOIN T_PEDIDOS P ON F.NUMERO_PEDIDO = P.NUMERO 
		 WHERE ".$b_regu." AND P.CODIGO_SAP = ".$_POST['cliente'];
   echo json_encode(GenerarArray($sql,""));
   mssql_close();
 }break;
 case 'B_MATERIALES_SC':{
   $b_regu = palabras_materiales(utf8_decode($_POST['term']),'m');
   $sql="SELECT DISTINCT TOP 5
			 UPPER(M.CODIGO_MATERIAL+' - '+ISNULL(M.DESCRIPCION2,M.DESCRIPCION)) AS value, 
			 M.CODIGO_MATERIAL, 
			 ISNULL(M.DESCRIPCION2,M.DESCRIPCION) AS DESCRIPCION 
		 FROM T_MATERIALES M 
		 INNER JOIN T_PEDIDOS_FACTURA_DETALLE D ON D.CODIGO_MATERIAL = M.CODIGO_MATERIAL
		 INNER JOIN T_PEDIDOS_FACTURA F ON F.NUMERO_FACTURA = D.NUMERO_FACTURA AND F.NUMERO_PEDIDO = D.NUMERO_PEDIDO
		 INNER JOIN T_PEDIDOS P ON F.NUMERO_PEDIDO = P.NUMERO 
		 WHERE ".$b_regu;
   echo json_encode(GenerarArray($sql,""));
   mssql_close();
 }break;
 case 'S_FACTURAS':{
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
				D.CODIGO_MATERIAL = '".$_POST['material']."' AND 
				P.CODIGO_SAP = '".$_POST['codigo']."'
			GROUP BY
				P.NUMERO,
				P.FECHA_PEDIDO,
				P.NOTA,
				F.TIPO_FACTURA,
				F.NUMERO_FACTURA,
				F.FECHA_INICIO";
	echo json_encode(GenerarArray($sql,""));
    mssql_close();
 }break;
 case 'DATOS_COMERCIAL':
                      $crm_cod_sap=$_POST["crm_cod_sap"];
					  $sp  = mssql_init('P_CRM_DATOS_TERCEROS');
							 mssql_bind($sp, '@CRM_COD_SAP'   ,  $crm_cod_sap, SQLVARCHAR,false, false);
							 mssql_bind($sp, '@NOMBRE_DOC'    ,  trim(utf8_decode(strtoupper($_POST["nombre_doc"]))), SQLVARCHAR,false, false);
							
							
							 mssql_bind($sp, '@ID', $id, SQLINT4, true, false);
                        
 break;
 case "Load_Aficiones":
                  $sql="SELECT
				        ID,
						AFICION
						FROM 
						T_CRM_AFICIONES   ";
				echo json_encode(GenerarArray($sql,""));
    mssql_close();
 break;
 case 'G_ACUERDOS':{
	 	  $nombre=$_POST['adj'].".pdf";

	  $sql="INSERT INTO T_ACUERDO_COMERCIAL (CODIGO_SAP,NUMERO,FECHA_INI,FECHA_FIN,MONTO,INCENTIVO,OBSERVACION,ADJUNTO,ORGANIZACION_VENTAS,OFICINA_VENTAS)VALUES('".$_POST['c_sap']."','".$_POST['acu']."','".$_POST['f_ini']."','".$_POST['f_fin']."','".$_POST['mont']."','".$_POST['inc']."','".strtoupper($_POST['obs'])."','".$nombre."','".$_POST['organizacion']."','".$_POST['oficina']."')";
	if(mssql_query($sql)){
	  echo 1;
	}else{
	  echo 0;
	}
 }break;
 case 'G_PAGARES':{	  
	  $nombre=$_POST['adj'].".pdf";
	  $sql="INSERT INTO T_PAGARES	 (CODIGO_SAP,ADJUNTO)VALUES('".$_POST['c_sap']."','".$nombre."')";
	if(mssql_query($sql)){
	  echo 1;
	}else{
	  echo 0;
	}
 }break;
   case "subir":
	    $return = array('ok'=>TRUE);
		
		
 		
		$nombre_archivo = $_FILES['archivo']['name'];
		$tipo_archivo = $_FILES['archivo']['type'];
		$tipo_archivo=explode("/",$tipo_archivo);
		if($_POST["tipo"]=='acuerdo'){
			$upload_folder ='../resources/acuerdos/';$nombre=$_POST["codigo"].'_'.rand(1, 9999);
		}
		if($_POST["tipo"]=='pagare'){
			$upload_folder ='../resources/pagare/';$nombre='pagare'.$_POST["codigo"].'_'.rand(1, 9999);
		}
		if($tipo_archivo[1]=="pdf")
		{
			$tipo_archivo = $_FILES['archivo']['type'];
			$tamano_archivo = $_FILES['archivo']['size'];
			$tmp_archivo = $_FILES['archivo']['tmp_name'];
			$archivador = $upload_folder . '/' . $nombre.'.pdf';
			if (!move_uploaded_file($tmp_archivo, $archivador)) 
			{
			 echo "No se ha podido cargar el pdf .";
			}else{echo  $nombre;}
		}else{echo  "El documento debe ser un pdf.";}


   break;
   case "Gestiones":{
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
			 WHERE V.CODIGO_SAP_CLI = '".$_POST['codigo']."' AND V.FECHA_VISITA >=  GETDATE()-180
			 ORDER BY 
				V.FECHA_VISITA DESC";
	echo json_encode(GenerarArray($sql,""));
    mssql_close();
   }break;
   case "CarteraXEdades":{
     $sql = "SELECT 
				 V.CLIENTE,
				 SUM(V.C_SIN_VENCER) AS C_SIN_VENCER,
				 SUM(V.C_31_60) AS C_31_60,
				 SUM(V.C_61_90) AS C_61_90,
				 SUM(V.C_91_120) AS C_91_120,
				 SUM(V.C_120) AS C_120
				FROM V_CARTERA V 
				WHERE 
				 V.CLIENTE  = '".$_POST['codigo']."' AND 
				 V.SOCIEDAD = '".$_SESSION['ses_NumOrg']."' AND
			     V.DOCUMENTO_COMPENSACION = '-'
				GROUP BY
				 V.CLIENTE";
	echo json_encode(GenerarArray($sql,""));
    mssql_close();
   }break;
	case "U_TERCERO":{
		$sql = "UPDATE T_TERCEROS SET EMAIL_FE ='".$_POST['EMAIL_FE']."' WHERE CODIGO_SAP = '".$_POST['CODIGO_SAP']."'";
		if(mssql_query($sql)){
		  echo 1;
		}else{
		  echo 0;
		}
	}break;
	case 'S_GRUPOS_CLIENTES':{
		$grupo = $_POST['grupo'];
		
		switch($grupo){
			case 1 : $sql = "SELECT GRUPO  AS GRUPO, DESCRIPCION FROM T_TERCEROS_GRUPOS1"; break;		
			case 2 : $sql = "SELECT GRUPO2 AS GRUPO, DESCRIPCION FROM T_TERCEROS_GRUPOS2"; break;		
			case 3 : $sql = "SELECT GRUPO3 AS GRUPO, DESCRIPCION FROM T_TERCEROS_GRUPOS3"; break;	
			case 4 : $sql = "SELECT GRUPO4 AS GRUPO, DESCRIPCION FROM T_TERCEROS_GRUPOS4"; break;	
			case 5 : $sql = "SELECT GRUPO5 AS GRUPO, DESCRIPCION FROM T_TERCEROS_GRUPOS5"; break;
		}
		$result = GenerarArray($sql,"");
		echo json_encode($result);
	}break;
	
	case 'S_SINC_TERCEROS':{
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
				LTRIM(T.KUNNR,0) = '".$_POST['codigo']."'
				ORDER BY 
				P.CITY_NAME DESC";
	    $datos = generarArrayHana($sql,0);
		
	for($i=0; $i<=count($datos)-1; $i++){
		//Actualizacion en terceros 
		$q = "UPDATE T_TERCEROS SET 
		        COD_CIUDAD = '".$datos[$i]['COD_CIUDAD']."',
				COD_DPTO   = '".$datos[$i]['COD_DPTO']."'
			  WHERE 
			    CODIGO_SAP = '".$datos[$i]['CODIGO_SAP']."';";
		//Actualizacion en terceros organizacion
		$q.= "UPDATE T_TERCEROS_ORGANIZACION SET
		       GRUPO1 = '".$datos[$i]['GRUPO1']."',
			   GRUPO2 = '".$datos[$i]['GRUPO2']."',
			   GRUPO3 = '".$datos[$i]['GRUPO3']."',
			   GRUPO4 = '".$datos[$i]['GRUPO4']."',
			   GRUPO5 = '".$datos[$i]['GRUPO5']."'
			  WHERE CODIGO_SAP = '".$datos[$i]['CODIGO_SAP']."';";
		mssql_query($q);
	}
		echo "Fin, se sincronizaron ".count($datos)." registros";
	}break;
}

?>