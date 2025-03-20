<?php
session_start();
require_once('funciones.php');
conectar();
switch($_POST["op"]){
	case "1":
              $sql="SELECT
			              ID,
						  DESCRIPCION
						  FROM T_DPTO ORDER BY DESCRIPCION";		  
			  $Query=GenerarArray($sql,"");	
			  echo json_encode($Query);
			  mssql_close();
	break;
	
    case "2":
	           //print_r($_POST);
	           if($_POST["idtdp"]==9 || $_POST["idtdp"]==11 || $_POST["idtdp"]==13){
				  $i=" LEFT "; 
			   }else{
			      $i=" INNER ";
			   }
			   //selecciono el nit de un tercero
			   $sql="SELECT
			   				T.CODIGO_SAP,
							T.NIT,
							CASE WHEN T.PERFIL_TRIBUTARIO='PJ' THEN T.RAZON_COMERCIAL ELSE T.NOMBRES  END AS TERCERO,
							OT.ORGANIZACION_VENTAS,
							OT.OFICINA_VENTAS,
						    ISNULL(G1.GRUPO+'-'+G1.DESCRIPCION,'') AS GRUPO1_CLIENTE,
						    ISNULL(G2.GRUPO2+'-'+G2.DESCRIPCION,'') AS GRUPO2_CLIENTE,
							ISNULL(G3.GRUPO3+'-'+G3.DESCRIPCION,'') AS GRUPO3_CLIENTE
					FROM T_TERCEROS T 
					".$i." JOIN T_TERCEROS_ORGANIZACION OT ON(OT.CODIGO_SAP=T.CODIGO_SAP) 
					LEFT JOIN T_TERCEROS_GRUPOS1 G1 ON G1.GRUPO  =OT.GRUPO1
					LEFT JOIN T_TERCEROS_GRUPOS2 G2 ON G2.GRUPO2 =OT.GRUPO2
					LEFT JOIN T_TERCEROS_GRUPOS3 G3 ON G3.GRUPO3 =OT.GRUPO3";
					$sql.=" WHERE T.NIT='".trim($_POST["nit"])."'  "; 
					if($_POST["idtdp"]==9 || $_POST["idtdp"]==11  || $_POST["idtdp"]==13){
						$sql.=" AND T.PERFIL_TRIBUTARIO='PJ' AND T.TIPO_TERCERO='Z006' ";
					}else{
					   $sql.=" AND T.TIPO_TERCERO<>'Z006'  AND OT.ORGANIZACION_VENTAS = ".$_POST['org']." AND ISNULL(T.BLOQUEO,0) = 0";	
					}
					//echo $sql; 
				 
		        $Query= GenerarArray($sql,"");
			    echo json_encode($Query);
			 
	mssql_close();
	break;	
	case "3":
	         
			 // print_r($_POST);
			  $op=$_POST["tbp"];
			  $dato=utf8_decode($_POST["dato"]);
			  $sql="SELECT
			  			  DISTINCT
			              U.ID,
						  U.LOGIN,
						  U.CLAVE,
						  U.NOMBRES,
						  U.APELLIDOS,
						  U.ID_DPTO,
						  U.CODIGO_SAP,
						  U.ORGANIZACION_VENTA AS ORGANIZACION_VENTAS,
						  U.IDENTIFICACION,
						  U.IDENTIFICACION_PROVEEDOR,
						  U.FECHA_CREACION,
						  U.FECHA_MODIFICACION,
						  U.ESTADO,
						  LOWER(U.EMAIL) AS EMAIL,
						  U.ROLES_ID,
						  T.RAZON_COMERCIAL,
						  U.OFICINA_VENTAS,
						  U.EXT,
						  U.CELULAR,
						  FORMAT(U.FECHA_NACIMIENTO, N'dd-MM-yyyy') AS FECHA_NACIMIENTO,
						  U.HIJOS,
						  U.SEXO,
						  T.NOMBRES AS CLIENTE,
						  U.ZONA_VENTAS,
                          U.CALLE,
						  U.USUARIO_SAP,
						  O.DESCRIPCION AS NOMBRE_OFICINA,
						  D.DESCRIPCION AS NOMBRE_DPTO,
						  ISNULL(G1.GRUPO+'-'+G1.DESCRIPCION,'') AS GRUPO1_CLIENTE,
						  ISNULL(G2.GRUPO2+'-'+G2.DESCRIPCION,'') AS GRUPO2_CLIENTE,
						  ISNULL(G3.GRUPO3+'-'+G3.DESCRIPCION,'') AS GRUPO3_CLIENTE
 					FROM T_USUARIOS U
					INNER JOIN T_DPTO D ON D.ID = U.ID_DPTO
					LEFT JOIN T_OFICINAS_VENTAS O ON O.OFICINA_VENTAS = U.OFICINA_VENTAS AND O.ORGANIZACION_VENTAS = U.ORGANIZACION_VENTA
 					LEFT JOIN T_TERCEROS  T ON (T.CODIGO_SAP=U.CODIGO_SAP)
					LEFT JOIN T_TERCEROS_ORGANIZACION OT  ON OT.CODIGO_SAP =T.CODIGO_SAP AND OT.CANAL_DISTRIBUCION='10'
					LEFT JOIN T_TERCEROS_GRUPOS1 G1 ON G1.GRUPO  =OT.GRUPO1
					LEFT JOIN T_TERCEROS_GRUPOS2 G2 ON G2.GRUPO2 =OT.GRUPO2
					LEFT JOIN T_TERCEROS_GRUPOS3 G3 ON G3.GRUPO3 =OT.GRUPO3
				    WHERE ";
			if(trim($op)=='i'){
				$sql.=" U.ID=".$dato;				
			}else{
			   $sql.=" U.LOGIN='".strtoupper($dato)."'";	
			}
			
			 $Query=GenerarArray($sql,""); 
			 echo json_encode($Query);
	mssql_close();
	break;
	case "4":
		
		if(!empty($_POST["IdentProv"])){$IdentProv=$_POST["IdentProv"];}else{$IdentProv=0;}
		
		$Login     = $_POST["Login"];
		$Nombres   = $_POST["Nombres"];
		$Apellidos = $_POST["Apellidos"];
		$Clave     = $_POST["Clave"];
		$Email     = $_POST["Email"];
		$IdDpto    = $_POST["IdDpto"];
		$CodSap    = $_POST["CodSap"];
		$Estado    = trim($_POST["Estado"]);
		$OrgVentas = $_POST["OrgVentas"];
		$Indet     = $_POST["Ident"];
        $RolesId   = $_POST["IdRoles"];
		$OfiVent   = $_POST["OfiVent"];
		$SolCambio = $_POST["SolCambio"];
		$Celular   = $_POST["Celular"];	
		$fhNace    = '';
		$sexo      = $_POST["sexo"];
		$hijos     = $_POST["hijos"];
		$zona      = $_POST["zona"];
		$Calle     = $_POST["Calle"];
		$UsuSAP    = $_POST['UsuSAP'];
		
		//valido si el correo existe
		$sqlEmail=mssql_query(" select top 1 * from t_usuarios where email='".trim($_POST["Email"])."' ");
		
		while($r=mssql_fetch_array($sqlEmail)){
			
			$NomUser= $r["NOMBRES"];
			$ApellidosUser= $r["APELLIDOS"];
			$UserLogin= $r["LOGIN"];
			
			echo '<p>Este correo ya existe ! en el usuario '.$UserLogin.' ('.$Nombres.' '.$ApellidosUser.' )</p>';
			return ;
		}
		
		
		if($_POST["fhNace"]==''){$fhNace = $_POST["fhNace"];}else{$fhNace = '01-01-1800';};
		if($Celular==""){
			$Celular=0;
		}
		$Ext = $_POST["Ext"];
	   $id = 0;
	   $sp  = mssql_init('P_USUARIOS_I');
              mssql_bind($sp, '@LOGIN', utf8_decode(strtoupper(QuitarCaracter($Login)))  , SQLVARCHAR, false, false);   
			  mssql_bind($sp, '@NOMBRES',  utf8_decode(strtoupper($Nombres))  ,SQLVARCHAR, false, false);
			  mssql_bind($sp, '@APELLIDOS', utf8_decode(strtoupper(QuitarCaracter($Apellidos))) , SQLVARCHAR, false, false);
			  mssql_bind($sp, '@CLAVE', md5($Clave), SQLVARCHAR, false, false);
			  mssql_bind($sp, '@EMAIL', utf8_decode($Email), SQLVARCHAR, false, false);
			  mssql_bind($sp, '@ID_DPTO', $IdDpto, SQLINT4, false, false);
			  mssql_bind($sp, '@CODIGO_SAP', $CodSap, SQLVARCHAR, false, false);
			  mssql_bind($sp, '@ESTADO', $Estado, SQLVARCHAR, false, false);
			  mssql_bind($sp, '@ROLES_ID', $_POST["IdRoles"], SQLINT4, false, false);
			  mssql_bind($sp, '@ORGANIZACION_VENTA', $OrgVentas, SQLVARCHAR, false, false);
			  mssql_bind($sp, '@IDENTIFICACION', $Indet, SQLVARCHAR, false, false);
			  mssql_bind($sp, '@IDENTIFICACION_PROVEEDOR', $IdentProv, SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@USUARIOS_ID',$_SESSION["ses_Id"], SQLINT4, false, false); 
			  mssql_bind($sp, '@OFICINA_VENTAS', $OfiVent, SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@CELULAR', trim($Celular), SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@CAMBIO_CLAVE', $SolCambio, SQLINT4, false, false); 
			  mssql_bind($sp, '@FECHA_NACIMIENTO', Formato_Fecha_M_D_A($fhNace), SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@SEXO', trim($sexo), SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@HIJOS', trim($hijos), SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@EXT', $Ext, SQLINT4, false, false); 
			  mssql_bind($sp, '@ZONA_VENTAS', $zona, SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@CALLE', $Calle, SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@USUARIO_SAP', $UsuSAP, SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@ID', $id, SQLINT4, true, false);
			   
       $r   = mssql_execute($sp);
	   if($id>0){
		  echo $id; 
		  $sql ="INSERT INTO T_HISTORIAL_MODIFICACIONES (MODULO,CONCEPTO,ID_USUARIO_MODIFICA,ID_USUARIO)
	             VALUES('0201','CREO USUARIO WEB ID = ".$id."','".$_SESSION["ses_Id"]."','".$id."')";
	      mssql_query($sql);
		  
	   }else{
		   echo 0;
	   }
	  // echo $r;
    mssql_close();
	break;
    case "5"://print_r($_POST);
			if(!empty($_POST["IdentProv"])){$IdentProv=$_POST["IdentProv"];}else{$IdentProv=0;}			
			$Celular   = $_POST["Celular"];
			if($Celular==""){$Celular=0;}
			$Login     = $_POST["Login"];
			$Nombres   = $_POST["Nombres"];
			$Apellidos = $_POST["Apellidos"];
			$Clave     = $_POST["Clave"];
			$Email     = $_POST["Email"];
			$IdDpto    = $_POST["IdDpto"];
			$CodSap    = $_POST["CodSap"];
			$Estado    = ($_POST["Estado"]);
			$OrgVentas = $_POST["OrgVentas"];
			$Ident     = $_POST["Ident"];
			$IdUsu	   = $_POST["IdUsu"];
	        $RolesId   = $_POST["IdRoles"];
			$OfiVent   = $_POST["OfiVent"];
			$SolCambio = $_POST["SolCambio"];			
			$UpdPass   = $_POST["UpdPass"];
			$Ext       = $_POST["Ext"];			
			$fhNace    = "";
			if($_POST["fhNace"] != ""){$fhNace = $_POST["fhNace"];}else{$fhNace = '01-01-1800';};
			$sexo      = $_POST["sexo"];
			$hijos     = $_POST["hijos"];
			$zona      = $_POST["zona"];
			$Calle     = $_POST["Calle"];
			$UsuSAP    = $_POST['UsuSAP'];
		
		/*$sqlEmail=mssql_query(" select top 1 * from t_usuarios where email='".trim($_POST["Email"])."' ");
		
		while($r=mssql_fetch_array($sqlEmail)){
			
			$NomUser= $r["NOMBRES"];
			$ApellidosUser= $r["APELLIDOS"];
			$UserLogin= $r["LOGIN"];
			
			echo '<p>Este correo ya existe ! en el usuario '.$UserLogin.' ('.$Nombres.' '.$ApellidosUser.' )</p>';
			return ;
		}*/		
		
		
		//print_r($Estado);	
	   $sp  = mssql_init('P_USUARIOS_U');
	          mssql_bind($sp, '@ID', $IdUsu, SQLVARCHAR, false, false); 
              mssql_bind($sp, '@LOGIN',utf8_decode( strtoupper(QuitarCaracter($Login))), SQLVARCHAR, false, false);  
			  mssql_bind($sp, '@NOMBRES', utf8_decode(QuitarCaracter($Nombres) ), SQLVARCHAR, false, false);
			  mssql_bind($sp, '@APELLIDOS',utf8_decode(strtoupper(QuitarCaracter($Apellidos))) , SQLVARCHAR, false, false);
			  mssql_bind($sp, '@CLAVE', md5($Clave), SQLVARCHAR, false, false);
			  mssql_bind($sp, '@EMAIL', utf8_decode($Email), SQLVARCHAR, false, false);
			  mssql_bind($sp, '@ID_DPTO', $IdDpto, SQLINT4, false, false);
			  mssql_bind($sp, '@CODIGO_SAP', $CodSap, SQLVARCHAR, false, false);
			  mssql_bind($sp, '@ESTADO', $Estado, SQLVARCHAR, false, false);
			  mssql_bind($sp, '@ROLES_ID', $RolesId, SQLINT4, false, false);
			  mssql_bind($sp, '@ORGANIZACION_VENTA', $OrgVentas, SQLVARCHAR, false, false);
			  mssql_bind($sp, '@IDENTIFICACION', $Ident, SQLVARCHAR, false, false);
			  mssql_bind($sp, '@IDENTIFICACION_PROVEEDOR', $IdentProv, SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@USUARIOS_ID', $_SESSION["ses_Id"], SQLINT4, false, false);
			  mssql_bind($sp, '@OFICINA_VENTAS', $OfiVent, SQLVARCHAR, false, false);   
			  mssql_bind($sp, '@CAMBIO_CLAVE', $SolCambio, SQLINT4, false, false);  
			  mssql_bind($sp, '@CELULAR', trim($Celular), SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@UPD_PASS', trim($UpdPass), SQLINT4, false, false); 
			  mssql_bind($sp, '@FECHA_NACIMIENTO', Formato_Fecha_M_D_A($fhNace), SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@SEXO', trim($sexo), SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@HIJOS', trim($hijos), SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@EXT', $Ext, SQLINT4, false, false);  
			  mssql_bind($sp, '@ZONA_VENTAS', $zona, SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@CALLE', $Calle, SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@USUARIO_SAP', $UsuSAP, SQLVARCHAR, false, false); 
	   if(mssql_execute($sp)){
	     echo $IdUsu;
	   }else{
	     echo "Error";
	   } 
	   $sql ="INSERT INTO T_HISTORIAL_MODIFICACIONES (MODULO,CONCEPTO,ID_USUARIO_MODIFICA,ID_USUARIO)
	          VALUES('0201','MODIFICO USUARIO WEB ID = ".$IdUsu."','".$_SESSION["ses_Id"]."','".$IdUsu."')";
	   mssql_query($sql);
   	   mssql_close();
	break;
	case "6":
	          $dato=utf8_decode(strtoupper(trim($_POST["dato"]))); 
			  $sql="SELECT
						U.ID AS ID_USUARIO,
						U.LOGIN,
						U.CLAVE,
						UPPER(U.NOMBRES) AS NOMBRES,
						UPPER(U.APELLIDOS) AS APELLIDOS,
						U.ID_DPTO,
						U.CODIGO_SAP,
						U.ORGANIZACION_VENTA,
						ISNULL(U.OFICINA_VENTAS,'NA') AS OFICINA_VENTAS,
						U.IDENTIFICACION,
						U.IDENTIFICACION_PROVEEDOR,
						ISNULL(T.NOMBRES,T.RAZON_COMERCIAL) AS PROVEEDOR,
						CAST(U.FECHA_CREACION AS DATE) AS FECHA_CREACION,
						CAST(U.FECHA_MODIFICACION AS DATE) AS FECHA_MODIFICACION,
						U.ESTADO,
						UPPER(U.EMAIL) AS EMAIL,
						D.DESCRIPCION AS DPTO,
						O.ZONA_VENTAS,
					    Z.ZONA_DESCRIPCION  ,
						U.EXT,
						U.CELULAR,
                        U.CALLE
					FROM T_USUARIOS U
					INNER JOIN T_DPTO  D ON D.ID = U.ID_DPTO
					LEFT  JOIN T_TERCEROS T ON T.CODIGO_SAP = U.CODIGO_SAP
					LEFT  JOIN T_TERCEROS_ORGANIZACION O ON O.CODIGO_SAP = T.CODIGO_SAP AND O.ORGANIZACION_VENTAS = U.ORGANIZACION_VENTA AND O.CANAL_DISTRIBUCION = '10'
					LEFT  JOIN T_ZONAS_VENTAS Z ON Z.ZONA_VENTAS = O.ZONA_VENTAS 
					WHERE U.ID>0"; 
		
					if($_POST["org"]!=''){
					 $sql.=" AND U.ORGANIZACION_VENTA  = '".$_POST['org']."' ";
					}
		
					if($_POST["status"]!=''){
						$sql.=" AND U.ESTADO = '".$_POST['status']."' ";
					}
		
					 if($dato!=""){
						$sql.="  AND CAST(T.NIT AS VARCHAR)+CAST(U.CODIGO_SAP AS VARCHAR)+U.NOMBRES+U.APELLIDOS+U.LOGIN+U.IDENTIFICACION LIKE('%".$dato."%')";	
					 }
					 if(isset($_POST['dpto'])){
						$dpto = '';
						for($i = 0; $i < count($_POST['dpto']); $i++){
							$dpto.= "'".$_POST['dpto'][$i]."',";
													
						}
					   $sql.=" AND U.ID_DPTO IN(".trim($dpto,',').")";
					}
			   $sql.="ORDER BY U.NOMBRES";
			 //echo $sql;
		     $Query=GenerarArray($sql,""); 
			 echo json_encode($Query);
	mssql_close();
	break;
	case "7":
	          $sql="SELECT
			  			  U.LOGIN,
						  U.CLAVE,
						  U.NOMBRES,
						  U.APELLIDOS,
						  U.ROLES_ID
					FROM T_USUARIOS U
					WHERE U.ROLES_ID=".$_POST["RolesId"]." AND ESTADO ='A'";
			 $Query=GenerarArray($sql,""); 
			 echo json_encode($Query);
	mssql_close();
	break;
	case "8":
	          $sql="SELECT ID FROM  T_USUARIOS WHERE CLAVE='".md5($_POST["clave"])."' AND ID=".$_POST["id"];
			  echo  $sql;
			  $Query=GenerarArray($sql,""); 
			  echo json_encode($Query);
	break;
	case "9":
		//print_r($_POST);
	         $sql="UPDATE T_USUARIOS SET CLAVE='".md5($_POST["clave"])."', CAMBIO_CLAVE = 0 WHERE ID=".$_POST["id"];
			 $Query=mssql_query($sql);
			 if($Query){

				if(empty($_SESSION["ses_Id"])){
					$_SESSION["ses_Id"]= $_POST["id"];
				}
				 
				 $sql ="INSERT INTO T_HISTORIAL_MODIFICACIONES (MODULO,CONCEPTO,ID_USUARIO_MODIFICA,ID_USUARIO)
	                    VALUES('0201','MODIFICO CLAVE WEB ID = ".$_POST["id"]."','".$_SESSION["ses_Id"]."','".$_POST["id"]."')";
	             mssql_query($sql);

				 echo  json_encode(array(
					'ok'=>true,
					'message'=>'Se actualizo correctamente la clave!'
				 ));
			 }else{
				echo  json_encode(array(
					'ok'=>false,
					'message'=>'No se pudo actualizar la clave!'
				 ));
			 }
	break;
	case "10":{
		$sql="SELECT 
				U.FECHA_CREACION,
				UPPER(C.[LOGIN]) AS USUARIO_CREA,
				UPPER(C.NOMBRES+' '+C.APELLIDOS) AS NOMBRES_CREA,
				M.FECHA,
				M.CONCEPTO,
				M.MODULO,
				UPPER(A.[LOGIN]) AS USUARIO_MODIFICA,
				UPPER(A.NOMBRES+' '+A.APELLIDOS) AS NOMBRES_MODIFICA
			 FROM T_USUARIOS U 
			 INNER JOIN T_USUARIOS C ON C.ID = U.USUARIOS_ID
			 LEFT JOIN T_HISTORIAL_MODIFICACIONES M ON M.ID_USUARIO = U.ID
			 LEFT JOIN T_USUARIOS A ON A.ID = M.ID_USUARIO_MODIFICA
			 WHERE 
				U.ID =".$_POST['id'];
		$Query = GenerarArray($sql,""); 
		echo json_encode($Query);
	}break;
	case "11":{	   
	    $sp  = mssql_init('P_OFICINAS_VENTAS_S');
	           mssql_bind($sp, '@ORGANIZACION', $_SESSION["ses_NumOrg"], SQLVARCHAR, false, false); 
	    $r   = mssql_execute($sp);
   	    $Query = GenerarArray($r,"SP"); 
		echo json_encode($Query);
	
	}break;
	case "12":{	   
	    $sp  = mssql_init('P_ALMACENES_S');
	           mssql_bind($sp, '@ORGANIZACION', $_SESSION["ses_NumOrg"], SQLVARCHAR, false, false); 
	    $r   = mssql_execute($sp);
   	    $Query = GenerarArray($r,"SP"); 
		echo json_encode($Query);
	
	}break;
	case "13":{
	    $sql ="select zona_ventas from t_usuarios_zonas where id_usuario = '".$_POST['id']."'";
		$Query = GenerarArray($sql,""); 
		echo json_encode($Query);
	}break;
	case "14":{
	    $sql = "delete from t_usuarios_zonas where id_usuario = '".$_POST['id']."';";		
		if(isset($_POST['zonas'])){
			for($i = 0; $i < count($_POST['zonas']); $i++){
				$sql.= "insert into t_usuarios_zonas (id_usuario,zona_ventas)values('".$_POST['id']."','".$_POST['zonas'][$i]."');";
			
			}
		}
	    mssql_query($sql);
	}break;
	case "15":{
	  $sql ="update u set
			  u.identificacion = t.nit,
			  u.oficina_ventas = o.oficina_ventas
			from t_usuarios u
			inner join t_terceros t on t.codigo_sap =u.codigo_sap 
			inner join t_terceros_organizacion o on o.organizacion_ventas = u.organizacion_venta and o.codigo_sap = u.codigo_sap
			where 
			  u.id  ='".$_POST['id']."'";
	  $q = mssql_query($sql);
	  if($q){
	    $datos = array('Id'   => $_POST['id'],
					   'Tipo' => 'success',
					   'Msj'  => 'Identificacion emparejada con exito');
	  }else{
	    $datos = array('Id'   => $_POST['id'],
					   'Tipo' => 'error',
					   'Msj'  => 'No fue posible el emparejamiento.');
	  }
	  echo json_encode($datos);
	}break;
	case "16":{
	   $id  = $_POST['id'];	
       $sp  = mssql_init('P_USUARIOS_D');
	           mssql_bind($sp, '@ID', $id, SQLINT4, false, false); 
	   $r   = mssql_execute($sp);
	   
		if($r){
		$datos = array('Id'   => $_POST['id'],
				       'Tipo' => 'success',
				       'Msj'  => 'Usuario eliminado con exito');
		}else{
		$datos = array('Id'   => $_POST['id'],
				       'Tipo' => 'error',
				       'Msj'  => 'Error al eliminar el usuario.');
		}
		
 echo $sql ="INSERT INTO T_HISTORIAL_MODIFICACIONES (MODULO,CONCEPTO,ID_USUARIO_MODIFICA,ID_USUARIO)VALUES('0201','ELIMINO USUARIO ".$_POST['id']."','".$_SESSION["ses_Id"]."','".$_POST['id']."')";
	      mssql_query($sql);
	    echo json_encode(array('Id'   => $_POST['id'],
				       'Tipo' => 'success',
				       'Msj'  => 'Usuario eliminado con exito'));
	}break;
	case 17:
				$rol=$_POST["rol"];
				
				$sql="	SELECT DISTINCT
						M.NUMERO
						FROM T_PERMISOS_ROLES R
						INNER JOIN T_MODULOS_PERMISOS P ON P.ID=R.MODULOS_PERMISOS_ID
						INNER JOIN T_MODULOS M ON M.ID=P.MODULOS_ID
						WHERE R.ROLES_ID=".$rol." AND P.PERMISOS_ID=1";
				$query=mssql_query($sql);
		
		
				$datos=array();
		
				while($r=mssql_fetch_assoc($query)){
					
					$datos[]=array(
						'numero'=>$r["NUMERO"]
					);
					
				}
		
				echo json_encode($datos);
			
	break;
	case 18:
		$org='0';
		$RolId    =$_SESSION["ses_RolesId"];
		
		if($RolId!=1){
			$org=$_SESSION["ses_NumOrg"];
		}
		
	    $sp  = mssql_init('P_OFICINAS_VENTAS_S');
	           mssql_bind($sp, '@ORGANIZACION', $org, SQLVARCHAR, false, false); 
	    $r   = mssql_execute($sp);
   	    $Query = GenerarArray($r,"SP"); 
		echo json_encode($Query);		
	break;
	case 19:
	    $oficina = $_POST['oficina'];
		$anio    = $_POST['anio'];
		
	    $sp  = mssql_init('P_CLIENTES_WEB_FIDELIZADOS');
	           mssql_bind($sp, '@OFICINA', $oficina, SQLVARCHAR, false, false); 
		       mssql_bind($sp, '@ANIO', $anio, SQLVARCHAR, false, false); 
	    $r   = mssql_execute($sp);
   	    $Query = GenerarArray($r,"SP"); 
		echo  json_encode($Query);
	break;
	case "valid_email_por_usuario":
		$email =trim($_POST["email"]);
		
		$sql=mssql_query(" select * from t_usuarios where email='".$email."' ");
		
		$existe=false;
		while($r=mssql_fetch_array($sql)){
			$existe   =true;
			$usuario  =$r["LOGIN"];
			$nombre   =utf8_encode($r["NOMBRES"]);
			$apellidos=utf8_encode($r["APELLIDOS"]);
		}
		
		if(count($r)>0){
			echo json_encode(array(
				'existe'		=>$existe,
				'usuario'		=>$usuario,
				'nombres'		=>$nombre,
				'apellidos'		=>$apellidos
			));
		}else{
			echo  json_encode(array(
				'existe'=>$existe,
				'usuario'		=>$usuario,
				'nombres'		=>$nombre,
				'apellidos'		=>$apellidos
			));
		}
		

	break;
	
}

?>