<?php 
include('funciones.php');
session_start();
conectar();
switch($_POST['op']){
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
  case 'I_SOLICITUD_CREDITO':{
	 $img = $_POST['Adjunto'];
	 if($img !=''){$img = '../../Documentos/'.$img;}
     $sql = "INSERT INTO T_SOLICITUDES_CREDITO(ID_USUARIO, 
								   SOL_NIT, 
								   SOL_RAZON, 
								   SOL_REPRESENTANTE, 
								   SOL_NIT_REPRESENTANTE, 
								   SOL_DIRECCION, 
								   DPTO_CODIGO, 
								   MPIO_CODIGO, 
								   SOL_TELEFONO, 
								   SOL_EMAIL, 
								   SOL_CUPO,
								   SOL_DIAS,
								   SOL_DOCUMENTOS,
								   SOL_ESTADO,
								   SOL_ORGANIZACION,
								   SOL_OFICINA,
								   SOL_LISTA,
								   TIPO_DIR)
							VALUES('".$_SESSION['ses_Id']."',
								   '".$_POST['nit']."',
								   '".strtoupper($_POST['razon'])."',
								   '".strtoupper($_POST['representante'])."',
								   '".$_POST['cedula']."',
								   '".strtoupper($_POST['direccion'])."',
								   '".strtoupper($_POST['dpto'])."',
								   '".strtoupper($_POST['mpio'])."',
								   '".$_POST['tel']."',
								   '".$_POST['email']."',
								   '".$_POST['cupo']."',
								   '".$_POST['dias']."',
								   '".utf8_decode($img)."',
								   'E',
								   '".$_POST['org']."',
								   '".$_POST['bodega']."',
								   '".$_POST['lista']."','F');";
	  if(mssql_query($sql)){
	   echo 'ok';
	  }else{
	   echo 'error';
	  }
	  mssql_close();
  }break;
  case 'S_SOLICITUD_CREDITO':{
    $sql ="select 
			  s.sol_id,
			  s.sol_razon,
			  s.sol_nit,
			  s.sol_representante,
			  s.sol_nit_representante,
			  s.sol_estado,
			  s.sol_fecha_envio as fecha,
			  s.sol_estado,
			  s.sol_oficina,
			  case(s.sol_oficina)
			   when '1100' then 'MONTERIA'
			   when '1200' then 'CARTAGENA'
			   when '2100' then 'MEDELLIN'
			   when '2200' then 'BOGOTA'
			  end as oficina_desc,
			  case (s.sol_estado)
			   when 'E' then 'ENVIADA'
			   when 'R' then 'REVISADA'
			   when 'S' then 'ESTUDIO'
			   when 'A' then 'APROBADA'
			   when 'D' then 'RECHAZADA'
			   when 'P' then 'APLAZADA'
			  end as estado,
			  u.nombres+' '+u.apellidos as usuario,
			  s.sol_cupo,
			  s.sol_dias,
			  s.sol_lista,
			  S.sol_cupo_aprobado,
			  s.sol_dias_aprobado,
			  s.sol_lista_aprobado,
			  --s.sol_documentos,
			  REPLACE(s.SOL_DOCUMENTOS, '../resources/Documentos', '../../Documentos') AS sol_documentos,
			  s.tipo_dir
			from t_solicitudes_credito s
			inner join t_usuarios u on u.id = s.id_usuario 
			where 
			s.sol_organizacion       = '".$_POST['org']."'  and
			s.sol_oficina            = '".$_POST['ofc']."'  and 
			year(s.sol_fecha_envio)  = '".$_POST['anio']."' and
			month(s.sol_fecha_envio) = '".$_POST['mes']."'";
			switch($_POST['estado']){
			  case 'E':{$sql.=" and s.sol_estado = 'E' ";}break;
			  case 'R':{$sql.=" and s.sol_estado = 'R' ";}break;
			  case 'S':{$sql.=" and s.sol_estado = 'S' ";}break;
			  case 'A':{$sql.=" and s.sol_estado = 'A' ";}break;
			  case 'D':{$sql.=" and s.sol_estado = 'D' ";}break;
			  case 'P':{$sql.=" and s.sol_estado = 'P' ";}break;
			}
		/*if($_POST['dpto']!='1' && $_POST['dpto']!='7' && $_POST['dpto']!='6'){
		 $sql .=" and s.id_usuario = '".trim($_SESSION['ses_Id'])."'";
		}*/
	    if($_SESSION["ses_RolesId"] != 1  && //Administrador
		   $_SESSION["ses_RolesId"] != 3  && //Gerente Ventas
		   $_SESSION["ses_RolesId"] != 17 && //Gerente cartera
		   $_SESSION["ses_RolesId"] != 48 && //Auxiliar de Cartera
		   $_SESSION["ses_RolesId"] != 72 && //Coordinador de Cartera
		   $_SESSION["ses_RolesId"] != 73    //Gerencia Administrativa
		  ){
		   $sql .=" and s.id_usuario = '".trim($_SESSION['ses_Id'])."'";
		}
		$sql .= " order by s.sol_fecha_envio desc";
	 echo json_encode(GenerarArray($sql,""));
     mssql_close();
  }break;
  case 'I_SOLICITUD_OBS':{
	$text = $_POST['texto'];
	if(strlen($text)>90){$ntext = wordwrap($text, 90, "<br />\n");} else{$ntext = $text;}
    $sql = "INSERT INTO T_SOLICITUDES_CREDITO_OBS (ID_USUARIO,
	                                               OBSERVACION,
												   SOL_ID,
												   SOL_ESTADO)
											VALUES('".trim($_SESSION['ses_Id'])."',
											       '".trim(strtoupper($ntext))."',
											       '".trim($_POST['id'])."',
												   '".trim($_POST['stado'])."')";
	if(mssql_query($sql)){
	  echo 'ok';
	}else{
      echo 'error : '.$sql;
	  
	}
    mssql_close();
  }break;
  case 'S_SOLICITUD_OBS':{
    $sql ="SELECT 
			O.FECHA_OBS,
			O.OBSERVACION,
			U.NOMBRES+' '+U.APELLIDOS AS USUARIO
			 FROM T_SOLICITUDES_CREDITO_OBS O 
			INNER JOIN T_USUARIOS U ON U.ID = O.ID_USUARIO
			WHERE O.SOL_ID = ".$_POST['id']."
			ORDER BY
			O.FECHA_OBS";
     echo json_encode(GenerarArray($sql,""));
     mssql_close();
  }break;
  case 'U_SOLICITUD_CREDITO':{
	  /*E-Enviadas
		R-Revisadas
		S-Estudio
		A-Aprobadas
		D-Rechazadas*/
	  $fecha = "";
	  $usuario = "";
	  switch($_POST['nestado']){
		case 'R':{$fecha = 'SOL_FECHA_REVISION'; $usuario = "USU_ID_REVISA"; }break;
		case 'S':{$fecha = 'SOL_FECHA_ESTUDIO';  $usuario = "USU_ID_ESTUDIO";}break;
		case 'A':{$fecha = 'SOL_FECHA_APRUEBA';  $usuario = "USU_ID_APRUEBA";}break;
		case 'D':{$fecha = 'SOL_FECHA_RECHAZA';  $usuario = "USU_ID_RECHAZA";}break;
		case 'P':{$fecha = 'SOL_FECHA_APLAZA';   $usuario = "USU_ID_APLAZA";}break;
	  }
	  
	  $sql = "UPDATE T_SOLICITUDES_CREDITO SET 
	          ".$fecha."   = GETDATE(), 
			  ".$usuario." = '".trim($_SESSION['ses_Id'])."',
			  SOL_ESTADO   = '".$_POST['nestado']."'
			  WHERE 
			  SOL_ID = '".$_POST['id']."'";
	  
	  if(mssql_query($sql)){
	    echo 'ok';
	  }else{
		echo 'error'; 
	  }
	  mssql_close();
  }break;
  case 'VENDEDOR':{
		$sql = "SELECT 
				ID,
				LOGIN,
				NOMBRES+' '+APELLIDOS AS NOMBRES
				FROM T_USUARIOS 
				WHERE
				ID_DPTO = '3' AND
				ORGANIZACION_VENTA = '".$_POST["org"]."' AND 
				ESTADO ='A' ORDER BY NOMBRES";
		//echo $sql;
		echo json_encode(GenerarArray($sql,""));
		mssql_close();
	}break;
	case 'U_SOLICITUD_CREDITO_APROB':{
		 $sql = "UPDATE T_SOLICITUDES_CREDITO SET 
				  SOL_CUPO_APROBADO  = '".$_POST['cupo']."',
				  SOL_DIAS_APROBADO  = '".$_POST['dias']."',
				  SOL_LISTA_APROBADO = '".$_POST['lista']."',
				  ID_VENDEDOR_APROBADO = '".$_POST['vendedor']."',
				  TIENE_CODEUDOR     = '".$_POST['codeudor']."',
				  NOMBRE_CODEUDOR    = '".$_POST['CodNombre']."',
				  TELEFONO_CODEUDOR  = '".$_POST['CodTelefono']."',
				  DIRECCION_CODEUDOR = '".$_POST['CodDireccion']."',
				  OCUPACION_CODEUDOR = '".$_POST['CodOcupacion']."',
				  USU_ID_APRUEBA     = '".trim($_SESSION['ses_Id'])."',
				  SOL_FECHA_APRUEBA  = GETDATE(),
				  SOL_ESTADO   = 'A'
				  WHERE 
				  SOL_ID = '".$_POST['idSol']."'";
			 if(mssql_query($sql)){
			echo 'ok';
		  }else{
			echo 'error'; 
		  }
	     mssql_close();
	}break;
	case 'S_SOLICITUD_CREDITO_APROB':{
      $sql ="select 
			  s.sol_cupo_aprobado ,
			  s.sol_dias_aprobado ,
			  s.sol_lista_aprobado,
			  s.tiene_codeudor,
			  isnull(upper(s.nombre_codeudor),'N/A') as nombre_codeudor,
			  isnull(s.telefono_codeudor,'N/A')  as telefono_codeudor,
			  isnull(upper(s.direccion_codeudor),'N/A') as direccion_codeudor,
			  isnull(upper(s.ocupacion_codeudor),'N/A') as ocupacion_codeudor,
			  s.usu_id_aprueba,
			  s.sol_fecha_aprueba,
			  s.id_vendedor_aprobado,
			  u.nombres+' '+u.apellidos as vendedor
			from t_solicitudes_credito s
			left join t_usuarios u on u.id = s.id_vendedor_aprobado 
			where 
			  s.sol_id =".$_POST['id']."";
	  echo json_encode(GenerarArray($sql,""));
	  mssql_close();
	}break;

	case "R_SOL":
		$id=$_POST["id"];
		
		$sql="UPDATE T_SOLICITUDES_CREDITO SET SOL_ESTADO='E' WHERE SOL_ID=".$id;
		$query=mssql_query($sql);
		
		if($query){
			echo 1;
		}
	break;
	case "D_SOL":
		$id=$_POST["id"];
		
		$sql="DELETE FROM   T_SOLICITUDES_CREDITO  WHERE SOL_ID=".$id;
		$query=mssql_query($sql);
		
		if($query){
			echo 1;
		}
	break;
	case 'S_SOLICITUD_CREDITO_FECHAS':{
	  $sql ="select 
				s.sol_id,
				s.sol_razon,
				s.sol_nit,
				convert(varchar(24),s.sol_fecha_aplaza,100) as sol_fecha_aplaza,
				convert(varchar(24),s.sol_fecha_aprueba,100) as sol_fecha_aprueba,
				convert(varchar(24),s.sol_fecha_envio ,100) as sol_fecha_envio,
				convert(varchar(24),s.sol_fecha_estudio,100) as sol_fecha_estudio,
				convert(varchar(24),s.sol_fecha_rechaza,100) as sol_fecha_rechaza,
				convert(varchar(24),s.sol_fecha_revision,100) as sol_fecha_revision
			from t_solicitudes_credito s
			inner join t_usuarios u on u.id = s.id_usuario 
			where 
				s.sol_organizacion       = '".$_POST['org']."'  and
				s.sol_oficina            = '".$_POST['ofc']."'  and 
				year(s.sol_fecha_envio)  = '".$_POST['anio']."' and
				month(s.sol_fecha_envio) = '".$_POST['mes']."'";
				if($_POST['dpto']!='1' && $_POST['dpto']!='7'){
				$sql .=" and s.id_usuario = '".trim($_SESSION['ses_Id'])."'";
				}
			$sql .= " order by s.sol_fecha_envio desc";
	        echo json_encode(GenerarArray($sql,""));
	}break;
}
?>