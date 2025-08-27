<?php
include('funciones.php');
session_start();
conectar();

switch($_POST["op"]){
		
	
	case "ObtenerDatosZonaVenta":
		
		$zona_ventas=$_POST["zona_venta"];
		
		
		$sql="select top 1  
				zona_ventas,
				zona_descripcion,
				n_seg_p,
				n_cal_p 
			 from t_zonas_ventas 
			 where zona_ventas='".$zona_ventas."'";
		
		$exe=mssql_query($sql);
		
		$datos=array();
		
		while($r=mssql_fetch_array($exe)){
			
			$datos[]=array(
				
				'zona_ventas'		=>$r["zona_ventas"],
				'zona_descripcion'	=>utf8_encode($r["zona_descripcion"]),
				'n_seg_p'			=>trim($r["n_seg_p"]),
				'n_cal_p'			=>trim($r["n_cal_p"])
			);
			
		}
		
		echo json_encode($datos);
		
	break;
	case "guardarZonaVentasCsv":
		
		$zona_ventas		=trim($_POST["zona_ventas"]);
		$zona_descripcion	=utf8_decode(trim($_POST["zona_descripcion"]));
		$tipo				=$_POST["tipo"];
		$resp				=array();
		
		if(trim($tipo)=='I'){
			
			
			$sql=" INSERT INTO T_ZONAS_VENTAS(ZONA_VENTAS,ZONA_DESCRIPCION,N_SEG_P,N_CAL_P) VALUES('".$zona_ventas."','".($zona_descripcion)."','N','N')";

		
		}else{
			
			
				$sql=" UPDATE T_ZONAS_VENTAS SET 
					      ZONA_DESCRIPCION='".$zona_descripcion."' 
					WHERE ZONA_VENTAS='".$zona_ventas."'
						  ";
		}
		
		$exe=mssql_query($sql);
		
		
		if($exe){
						
			
			$resp[]=array(
				
				'error'=>false,
				'mensaje'=>'Registro guardado correctamente!'
				
			);
		}else{
						
			
			$resp[]=array(
				
				'error'=>true,
				'mensaje'=>'Error al intentar guardar el registro!'
				
			);
		}
		
		echo json_encode($resp);
		
	break;
	case "InsertarZonaVentas":
		
		$zona_ventas		= strtoupper(trim($_POST["zona_ventas"]));
		$zona_descripcion	= strtoupper(trim($_POST["zona_descripcion"]));
		$n_seg_p			=$_POST["n_seg_p"];
		$n_cal_p			=$_POST["n_cal_p"];
		$tipo				=$_POST["tipo"];

		if($tipo=='I'){
			
			$sql=" INSERT INTO T_ZONAS_VENTAS(ZONA_VENTAS,ZONA_DESCRIPCION,N_SEG_P,N_CAL_P) VALUES('".$zona_ventas."','".utf8_decode($zona_descripcion)."','".$n_seg_p."','".$n_cal_p."')";
			
		}else{
			
			$sql=" UPDATE T_ZONAS_VENTAS SET 
					      ZONA_DESCRIPCION='".$zona_descripcion."',
						  N_SEG_P='".$n_seg_p."',
						  N_CAL_P='".$n_cal_p."' 
					WHERE ZONA_VENTAS='".$zona_ventas."'
						  ";
			
		}

		$exe =mssql_query($sql);
		
		if($exe){
			
			$respuesta[]=array(
				'error'		=>false,
				'mensaje'	=>'Registro guardado corrextamente!'
			);
			
		}else{
			
			$respuesta[]=array(
				'error'		=>true,
				'mensaje'	=>'Error al guardar el registro!'
			);
			
		}
		
		echo json_encode($respuesta);
		
	break;
	case "ListarZonasVentas":
		
		$dato	=$_POST["dato"];
		$org	=$_SESSION["ses_NumOrg"]; 
		$ofc	=$_POST["ofi"]; 
		//ses_OfcVentas
		$cod_zona = substr($ofc,0,2);
		
		$sql=" select 
				  zona_ventas,
				  zona_descripcion,
				  n_seg_p,
				  n_cal_p,
				  n_cal_v,
				  n_seg_v,
				  t_aa, 
				  t_a, 
				  t_b, 
				  t_c, 
				  t_d, 
				  t_e, 
				  v_aa, 
				  v_a, 
				  v_b, 
				  v_c, 
				  v_d, 
				  v_e
				 from t_zonas_ventas ";
		
		if($dato!=''){			
		   $sql.="  WHERE ZONA_VENTAS LIKE('%".$dato."%') OR ZONA_DESCRIPCION LIKE('%".$dato."%') ";
		    if($_SESSION["ses_RolesId"]!=1 ){
				$sql.=" AND ZONA_VENTAS LIKE('".$cod_zona."%')";
			}
			
		}else{
			if($_SESSION["ses_RolesId"]!=1){
				$sql.=" WHERE ZONA_VENTAS LIKE('".$cod_zona."%')";
			}
		}

		
		
		
		
		$datos=array();
		
		$exe =mssql_query($sql);
		
		while($r=mssql_fetch_array($exe)){
				
				$datos[]=array(
					'zona_ventas'		=> $r["zona_ventas"],
					'zona_descripcion'	=> utf8_encode($r["zona_descripcion"]),
					'n_seg_p'			=> $r["n_seg_p"],
					'n_cal_p'			=> $r["n_cal_p"],
					'n_seg_v'			=> $r["n_seg_v"],
					'n_cal_v'			=> $r["n_cal_v"],
					't_aa'              => $r["t_aa"], 
					't_a'               => $r["t_a"], 
					't_b'               => $r["t_b"], 
					't_c'               => $r["t_c"], 
					't_d'               => $r["t_d"], 
					't_e'               => $r["t_e"], 
					'v_aa'              => $r["v_aa"], 
					'v_a'               => $r["v_a"], 
					'v_b'               => $r["v_b"], 
					'v_c'               => $r["v_c"], 
					'v_d'               => $r["v_d"], 
					'v_e'               => $r["v_e"],
					'SQL'               => $sql
				);
				
		}
		
		echo json_encode($datos);
		
	break;
	case "valirdarEstadoCondicion":
		
		
		$zona		=trim($_POST["zona"]);
		$respuesta	=array();
		//verifico si la zona aun esta asignada a un cliente
		$sql="select top 1 zona_ventas from t_terceros_organizacion where zona_ventas='".$zona."'";
		
		$exe=mssql_query($sql);
		
		$respuesta[]=array(
			'existe'=>false
		);
		
		$existe=false;
		
		while($r=mssql_fetch_array($exe)){
			
			$existe=true;
			$respuesta[0]['existe']=true;
			
		}
		
		echo json_encode($respuesta);
		
	break;
	case "EliminarZonaVentas":
		
		$zona		=trim($_POST["zona"]);
		$respuesta	=array();
		//verifico si la zona aun esta asignada a un cliente
		$sql="delete top(1) from t_zonas_ventas where  zona_ventas='".$zona."'";
		
		$exe=mssql_query($sql);
		
		if($exe){
			
			$respuesta[]=array(
				'error'=>false,
				'mensaje'=>'Se elimino correctamente el registro!'
			);
			
		}else{
			$respuesta[]=array(
				'error'=>true,
				'mensaje'=>'Error al eliminar el registro!'
			);
			
		}

		echo json_encode($respuesta);
	break;
	case 'U_CATEGORIAS_ZONAS':{
		$categoria	= $_POST["categoria"];
		$zona	    = $_POST["zona"]; 
		$cant	    = $_POST["cant"]; 
		
		
		$sql="UPDATE T_ZONAS_VENTAS SET ".$categoria." = ".$cant." WHERE ZONA_VENTAS='".$zona."'";
		
		$exe=mssql_query($sql);
		
		if($exe){
			
			$respuesta[]=array(
				'error'=>false,
				'mensaje'=>'Se actualizo correctamente el registro!'
			);
			
		}else{
			$respuesta[]=array(
				'error'=>true,
				'mensaje'=>'Error al actualizar el registro!'
			);
			
		}
		echo json_encode($respuesta);
	}break;
	case "updateConfigZona":
		
		$zona	=$_POST["zona"];
		$estado	=$_POST["estado"];
		$campo	=$_POST["campo"];
		$valor  ='';

		if($estado=='true'){$valor='S';}else{$valor='N';}

		switch($campo){
			case "1": 
				$campo='N_SEG_P';  
				break;

			case "2": 
				$campo='N_CAL_P';  
				break;
			case "3": 
				$campo='N_SEG_V';
				if ($estado == 'true') {
					$valor='N';
				} else {
					$valor='S';
				}
				break;
		}
		
	
		
		if($campo!='' && $valor!='' && $zona!=''){
			$sql="UPDATE T_ZONAS_VENTAS SET ".$campo."='".$valor."' WHERE ZONA_VENTAS='".$zona."'";
	
			$update=mssql_query($sql);

			 if($update){
				 echo  json_encode(array( 'error'=>false));
			 }	else{
				  echo  json_encode(array( 'error'=>true));
			 }		
		}else{  echo  json_encode(array( 'error'=>false));}
		

	break;
		
}
?>