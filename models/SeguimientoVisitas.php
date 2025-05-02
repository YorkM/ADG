<?php
include('funciones.php');
session_start();
conectar();
switch($_POST['op']){
	case 'VENDEDOR':{
		
		if($_POST["org"]==1000){//1000
			//
			if($_POST["oficina"]==0){
			   $ofi = "'1100','1200'";
			}else{
			   $ofi = $ofi= "'".$_POST["oficina"]."'";
			}
		}else{//2000
		   	if($_POST["oficina"]==0){
				$ofi="'2100','2200'";
			}else{
			   $ofi= "'".$_POST["oficina"]."'";	
			}	
		}
		$sql = "SELECT 
					ID,
					LOGIN,
					UPPER(NOMBRES+' '+APELLIDOS) AS NOMBRES
				FROM T_USUARIOS 
				WHERE";
				switch($_SESSION["ses_RolesId"]){
					case '14':{$sql .=" ID =".$_SESSION["ses_Id"]." AND";}break;//VENTAS EXTERNAS
					case '11':{$sql .=" ID =".$_SESSION["ses_Id"]." AND";}break;//TRANSF. INTERNAS
					case '11':{$sql .=" ID =".$_SESSION["ses_Id"]." AND";}break;//TRANSF. EXTERNAS
					case '12':{$sql .=" ID =".$_SESSION["ses_Id"]." AND";}break;//TELEVENTAS
					case '1' :{$sql.="  (ID_DPTO = ".$_POST['tipo']." OR ISNULL(ROLES_ID,0)=1   ) AND ";}break;
					default  :{$sql .="  ID_DPTO = ".$_POST['tipo']." AND ";}break;
				}
				$sql.=" ORGANIZACION_VENTA = '".$_POST["org"]."' AND 
				        ISNULL(OFICINA_VENTAS,'0') IN(".$ofi.")  AND 
						ESTADO ='A' 
						ORDER BY NOMBRES";
		//echo $sql;
		echo json_encode(GenerarArray($sql,""));
		
		mssql_close();
	}break;
	case 'TIPO_USUARIO':{
	  // $sql = " SELECT ID,DESCRIPCION FROM T_DPTO WHERE ID IN (3,11,12,13)";
	   $sql = " SELECT ID,DESCRIPCION FROM T_DPTO ";
	   if(@$_SESSION["ses_RolesId"]==9 || @$_SESSION["ses_RolesId"]==11){
		   if(@$_SESSION["ses_RolesId"]==9){
			   $sql.=" WHERE ID IN(9,11,13)";
		   }else{
			   $sql.=" WHERE ID =(SELECT ID_DPTO  FROM T_USUARIOS  WHERE LOGIN='".trim(@$_SESSION["ses_Login"]) ."')";
		   }
	   }
	   $sql.= "  ORDER BY DESCRIPCION";
	   echo json_encode(GenerarArray($sql,""));
	   mssql_close();
	}break;
	case 'CONSULTAR':{//print_r($_POST);
	
	 $fi=Formato_Fecha_M_D_A($_POST['fh_ini']);
	 $ff=Formato_Fecha_M_D_A($_POST['fh_fin']);
     $oficina=$_POST["oficina"];
	 $id_dpto=$_POST["id_dpto"];
	  $sp  = mssql_init('P_SEGUIMIENTO_VISITAS_S');
	         mssql_bind($sp, '@FECHA_INI',$fi, SQLVARCHAR, false, false);	
			 mssql_bind($sp, '@FECHA_FIN',$ff, SQLVARCHAR, false, false);	
			 mssql_bind($sp, '@OFICINA',$oficina, SQLVARCHAR, false, false);
			 mssql_bind($sp, '@ID_DPTO',$id_dpto, SQLVARCHAR, false, false);
			 mssql_bind($sp, '@ID', $_POST['id'], SQLINT4, false, false);				   
      $r   = mssql_execute($sp);
	  echo json_encode(GenerarArray($r,'SP'));
	  mssql_close();
	}break;
	case "P_VISITAS_VENDEDOR_I":
	       	$id=0;
			$hora = getdate();
			$hora=$hora["hours"];
			if($hora>8){
				$tp_p="I";
			}else{
			    $tp_p="P";	
			}
			$sp = mssql_init('P_VISITAS_VENDEDOR_I');
			mssql_bind($sp, '@ID_VENDEDOR', $_POST['id_ven'], SQLVARCHAR, false, false);
			mssql_bind($sp, '@CODIGO_SAP_CLI', $_POST['cod_sap_cli'], SQLVARCHAR, false, false);
			mssql_bind($sp, '@FECHA_VISITA', stripslashes(Formato_Fecha_M_D_A(date("d-m-y"))), SQLVARCHAR, false, false);
			mssql_bind($sp, '@OBJETIVO_VENTA', stripslashes(''), SQLTEXT, false, false);//OBJ VENTA	
			mssql_bind($sp, '@OBJETIVO_CARTERA', stripslashes(''), SQLTEXT, false, false);	
			mssql_bind($sp, '@TIPO_PROGRAMACION', stripslashes($tp_p), SQLVARCHAR, false, false);
			mssql_bind($sp, '@RAZON_IMPREVISTO', stripslashes('S'), SQLVARCHAR, false, false);/// DESCRIPCION DEL MOTIVO
			mssql_bind($sp, '@NOTAS', stripslashes(utf8_encode(strtoupper(''))), SQLTEXT, false, false);
			mssql_bind($sp, '@OBJETIVO_JURIDICA', stripslashes('POSVENTA'), SQLTEXT, false, false);
			mssql_bind($sp, '@TIPO_REGISTRO', stripslashes('R'), SQLVARCHAR, false, false);
			mssql_bind($sp, '@ID', $id, SQLINT4, true, false);
			 $r   = mssql_execute($sp);
			 if($r){
				 echo 1;
			 }
			mssql_close();	
	break;
		case 'Clientes_zona':{	
 			if($_POST["id"]==0) {$id_ejecutivo=$_SESSION["ses_Id"];} else {$id_ejecutivo = $_POST["id"];}
			$org = $_SESSION["ses_NumOrg"];
		    
			   //selecciono el nit de un tercero
			   $sql ="SELECT T.CODIGO_SAP,
						   CASE
							 WHEN T.NOMBRES IS NOT NULL THEN UPPER(T.NOMBRES)
							 ELSE UPPER(T.RAZON_COMERCIAL)
						   END AS VALUE,
						   T.NOMBRES,
						   CASE
							 WHEN T.RAZON_COMERCIAL = '' OR T.RAZON_COMERCIAL IS NULL THEN UPPER(
							 T.NOMBRES)
							 ELSE UPPER(T.RAZON_COMERCIAL)
						   END AS RAZON_COMERCIAL,
						   T.NIT,
						   CAST(MAX(TVV.FECHA_VISITA) AS DATE) AS ULTIMA_VISITA,
						   COUNT(TVV.FECHA_PROGRAMACION) AS PROGRAMADA_MES
						FROM T_TERCEROS T
						 INNER JOIN T_TERCEROS_ORGANIZACION O ON (O.CODIGO_SAP = T.CODIGO_SAP)
						 LEFT JOIN T_TERCEROS V  ON (V.CODIGO_SAP  = O.CODIGO_VENDEDOR)
						 LEFT JOIN T_TERCEROS L  ON (L.CODIGO_SAP  = O.CODIGO_TELEVENDEDOR)
						 LEFT JOIN T_USUARIOS TU ON TU.CODIGO_SAP  = L.CODIGO_SAP
						 LEFT JOIN T_USUARIOS TV ON TV.CODIGO_SAP  = V.CODIGO_SAP
						 LEFT JOIN T_VISITAS_VENDEDOR TVV ON TVV.CODIGO_SAP_CLI = T.CODIGO_SAP AND 
															 MONTH(CAST (TVV.FECHA_VISITA AS DATE)) = MONTH(GETDATE()) AND 
															 YEAR(CAST (TVV.FECHA_VISITA AS DATE))= YEAR(GETDATE()) AND 
															 TVV.ID_USUARIO = '".$id_ejecutivo."'
						
						WHERE 
						  O.ORGANIZACION_VENTAS = '".$org."' AND
						  ISNULL(T.BLOQUEO, 0)  = 0 AND
						  O.CANAL_DISTRIBUCION  = 10 AND
						  (TU.ID = '".$id_ejecutivo."' OR TV.ID = '".$id_ejecutivo."')  
						 
						GROUP BY T.CODIGO_SAP,
							 T.NOMBRES,
							 T.RAZON_COMERCIAL,
							 T.NIT";				
		        $Query= GenerarArray($sql,"");
			    echo json_encode($Query);
			// print_r($_POST);
	mssql_close();

	}break;
	case "GESTION_LLAMADA":
	       AsteriskConectMed("asteriskcdrdb");	
			  $telefono      = $_POST["telefonos"]; 
			  $fh_ini        = explode("-",substr($_POST["fecha_ini_ped"],0,10));
			  $fh_ini        = $fh_ini[0]."-".$fh_ini[1]."-".$fh_ini[2];		  
			  $idven         = $_POST["idven"];		   
			  $extension     = trim($_POST["ext"]);
			  $fecha_ini_ped = $_POST["fecha_ini_ped"];
			  $codigo_sap    = trim($_POST["codigo_sap"]);
		
              $sql="select case when src=".$extension." then '".$extension."' else dst end as src,  
							SUM(ceil(duration/60)) as duracion_min,
							--conteo de minutos
							sum(case when disposition='ANSWERED' then ceil(duration/60) else 0 end )  AS 'min_contestadas',
							sum(case when disposition='NO ANSWER' then ceil(duration/60) else 0 end ) AS 'min_no_contestadas',
							sum(case when disposition='BUSY' then ceil(duration/60) else 0 end )      AS 'min_ocupadas',
							sum(case when disposition='FAILED' then ceil(duration/60) else 0 end )    AS 'fallida',
							--conteo de marcados
							sum(case when disposition='ANSWERED' then 1 else 0 end )  AS 'contestadas',
							sum(case when disposition='NO ANSWER' then 1 else 0 end ) AS 'no_contestadas',
							sum(case when disposition='BUSY' then 1 else 0 end )      AS 'ocupadas'
							from cdr 
							 where 
							  src in(".$extension.")  and 
							  ( ".separar_like($telefono,"dst").")
							  and 
							  (cast(calldate as date)>=cast('".$fh_ini."' as date) and 
							   cast(calldate as date)<=cast('".$fh_ini."' as date)
							  )
							   and  duration>0";
			
					 $sql.=' group by 
							case when src='.$extension.' then '.$extension.' else dst end  
							  '; 
					 $sql.="order by
								 SUM(ceil(duration/60))  ";
             //  echo $sql;
				 $result = mysql_query($sql);
				
				 $datos  = array();
	                    
					 while ($row = mysql_fetch_array($result)){
						 
						   $ventas="select sum(p.VALOR) as valor_pedido
                                    from T_PEDIDOS p
                                         inner join t_usuarios u on (p.USUARIO = u.LOGIN)
                                    where u.ID = ".$idven." and
                                          cast (p.FECHA_PEDIDO as date) between cast ('".$fecha_ini_ped."' as DATE) and cast('".$fecha_ini_ped."' as DATE) and
                                          p.CODIGO_SAP = '".$codigo_sap."' ";
			                 $rventas = mssql_query($ventas);
							 
							 if(mssql_num_rows($rventas)>0){
								 while ($vr = mssql_fetch_assoc($rventas)){
									 $datos[]=array(
													 'duracion_min'       	=>$row["duracion_min"],
													 'min_contestadas'		=>$row["min_contestadas"],
													 'min_no_contestadas'	=>$row["min_no_contestadas"],
													 'min_ocupadas'			=>$row["min_ocupadas"],
													 'fallida'				=>$row["fallida"],
													 'contestadas'			=>$row["contestadas"],
													 'no_contestadas'		=>$row["no_contestadas"],
													 'ocupadas'				=>$row["ocupadas"],
													 'pedidos'				=>round($vr["valor_pedido"])
												  ); 
							 
							 } // while ($vr = mssql_fetch_assoc($rventas)){
							  
					 } // while ($row = mysql_fetch_array($result)){
				
                     }
		   	 echo json_encode($datos);	
			 mysql_close();
	break;
	case "PROG_V":
	 $fi		=Formato_Fecha_M_D_A($_POST['fh_ini']);
	 $ff		=Formato_Fecha_M_D_A($_POST['fh_fin']);
     $oficina	=$_POST["oficina"];
	 $id_dpto	=$_POST["id_dpto"];
	 $id		=$_POST['id'];
		
	 $sql="  SELECT
	            COUNT(*) AS N_VECES,
				C.NIT,
				C.CODIGO_SAP,
				C.NOMBRES,
				C.RAZON_COMERCIAL
				FROM T_VISITAS_VENDEDOR V 
				INNER JOIN T_USUARIOS T ON T.ID = V.ID_USUARIO
				LEFT  JOIN T_TERCEROS C ON C.CODIGO_SAP = V.CODIGO_SAP_CLI
				INNER JOIN T_USUARIOS U ON U.ID=V.ID_USUARIO
				WHERE V.FECHA_VISITA BETWEEN CAST('".$fi."' AS DATE) AND CAST('".$ff."' AS DATE) 
					  AND V.ESTADO_VISITA='V' ";
		if($id>0){
			$sql.=" AND  V.ID_USUARIO = ".$id;
		}else{
			$sql.=" AND T.OFICINA_VENTAS=$oficina AND T.ID_DPTO=$id_dpto ";
		}
		
		$sql.="
		  GROUP BY
		   C.NIT,
		   C.CODIGO_SAP,
		   C.NOMBRES,
		   C.RAZON_COMERCIAL
		
		  ORDER BY
		  C.NOMBRES ";
		
		$exe=mssql_query($sql);
		$datos=array();
		
		while($r=mssql_fetch_array($exe)){
			
			$datos[]=array(
				'n_veces'			=>$r["N_VECES"],
				'nit'				=>$r["NIT"],
				'codigo_sap'		=>$r["CODIGO_SAP"],
				'razon_comercial'	=>utf8_encode($r["RAZON_COMERCIAL"]),
				'nombres'			=>utf8_encode($r["NOMBRES"])
			);
		}
		
		echo  json_encode($datos);
		
	break;
	case 'CONSULTAR_DIAS_HABILES':{
		$fi		= Formato_Fecha_M_D_A($_POST['fh_ini']);
	    $ff		= Formato_Fecha_M_D_A($_POST['fh_fin']);
	    $dias_habiles = 0;
		
		$sp = mssql_init('SP_OBTENER_DIAS_HABILES');
				mssql_bind($sp, '@FHINI', $fi, SQLVARCHAR, false, false);
				mssql_bind($sp, '@FHFIN', $ff, SQLVARCHAR, false, false);
         $q = mssql_execute($sp); 
		
	 
	  while($d=mssql_fetch_array($q)){
		$dias_habiles=$d["dias_habiles"];  
	  }
	  echo json_encode(array('dias_habiles'=>$dias_habiles));
	}break;
	case "eliminar_programacion":

		$ids =$_POST["ids"];

		if(count($ids)>0){
			foreach($ids as $id){
				if($id>0){
					$delete =mssql_query("DELETE FROM T_VISITAS_VENDEDOR WHERE ID=".$id);
				}
			}
		}

		echo  json_encode(array(
			'ok'		=>true,
			'message'	=>'Se eliminaron los registros'
		));

	break;

	case "G_ZONAS_VENTAS":
		$query = "SELECT ZONA_VENTAS, ZONA_DESCRIPCION FROM T_ZONAS_VENTAS";
		$resultado = GenerarArray($query, '');
		echo json_encode($resultado);
	break;
}

?>