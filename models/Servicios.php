<?php
session_start();
require_once('funciones.php');
conectar();
switch($_POST["op"]){
		
	
	case "t_sys_tipos_equipos":
		
		$sql=" select * from t_sys_tipos order by tipo";
		$query=GenerarArray($sql);

		$datos=array();

		//while( $r=mssql_fetch_array($query)  ){
		foreach($query as $r){
			
			$datos[]=array(

				'id'	=>$r["ID_TIPO"],
				'tipo'	=>$r["TIPO"]

			);

		}//while end 

		echo json_encode($datos);
		
	break;
		
	
	case "t_sys_marcas_equipos":
		
		$sql=" select * from t_sys_marcas order by marca ";
		$query=GenerarArray($sql);

		$datos=array();

		//while( $r=mssql_fetch_array($query)  ){
		foreach($query as $r){
			
			$datos[]=array(

				'id'	=>$r["ID_MARCA"],
				'marca'	=>$r["MARCA"]

			);

		}//while end 

		echo json_encode($datos);
		
	break;
		
	
	case "t_sys_so_equipos":
		
		$sql=" select * from t_sys_so order by so ";
		$query=GenerarArray($sql);

		$datos=array();

		//while( $r=mssql_fetch_array($query)  ){
		foreach($query as $r){
			
			$datos[]=array(

				'id'	=>$r["ID_SO"],
				'so'	=>$r["SO"]

			);

		}//while end 

		echo json_encode($datos);		
	break;
		
	
	case "t_sys_dpto":
		
		$sql=" select * from t_dpto   order  by descripcion ";
		$query=GenerarArray($sql);

		$datos=array();

		//while( $r=mssql_fetch_array($query)  ){
		foreach($query as $r){
			
			$datos[]=array(

				'id'	=>$r["ID"],
				'value'	=>$r["ID"].' - '.$r["DESCRIPCION"],
				'dpto'	=>utf8_encode($r["DESCRIPCION"])

			);

		}//while end 

		echo json_encode($datos);		
	break;	
	case "SrcFechaHoraActual":
		
		$fecha_actual=date("m-d-Y H:m:i");
		$respuesta	 =array();
		
		$respuesta[]=array(
			'fecha_actual'=>$fecha_actual
		);
		
		echo json_encode($respuesta);
	break;
	//EVLUACIONES PENDIENTES
	case "getPendingEvaluations":
		/*
		if(!empty($_SESSION["ses_Id"])){
			
			$id = $_SESSION["ses_Id"];
			$top=$_POST["top"];
			$ch = curl_init();
			

			curl_setopt_array($ch, array(
						CURLOPT_URL => "https://api.multidrogas.com/adg/encuesta/pendientes/".$id."/".$top, //url a la que se conecta
						CURLOPT_RETURNTRANSFER => true, //devuelve el resultado como una cadena del tipo curl_exec
						CURLOPT_ENCODING => "", // permite decodificar la respuesta y puede ser"identity", "deflate", y "gzip", si está vacío recibe todos los disponibles.
						CURLOPT_MAXREDIRS => 10, // Si usamos CURLOPT_FOLLOWLOCATION le dice el máximo de encabezados a seguir
						CURLOPT_SSL_VERIFYPEER=>false,
						CURLOPT_TIMEOUT => 30, // Tiempo máximo para ejecutar
						CURLOPT_CUSTOMREQUEST => "GET", // el tipo de petición, puede ser PUT, POST, GET o Delete 
			)); //curl_setopt_array configura las opciones para una transferencia cURL
			
			$res = curl_exec($ch);
			$err = curl_error($ch); // muestra errores en caso de existir

			if ($err) {
				echo "cURL Error #:" . $err; // mostramos el error
			} else {
				echo $res; // en caso de funcionar correctamente
			}
						
			curl_close($ch);

			
		}else{
			echo http_response_code(500);
		}
		*/
	echo json_encode(array());
	break;
	case "get_month":
		
		$mes_actual	=(int)date("m");
		$datos		=array();
		
		
		for($i=1;$i<=12;$i++){
			
			$actual		=false;
			
			if($i==$mes_actual){
				
				$actual=true;
			}
			
			$datos[]=array(
				'mes'		=>convertMonthText($i),
				'index'		=>$i,
				'actual'	=>$actual
			);
		}//for
		
		echo  json_encode($datos);
	break;
	case "get_year":
		
		$anio_actual	=(int)date("Y");
		$anio_inicial	=2022;
		$datos			=array();
		
		
		for($i=$anio_inicial;$i<=$anio_actual;$i++){
			
			$actual			=false;
			
			if($i==$anio_actual){
				$actual=true;
			}
			
			$datos[]=array(
				'anio'=>$i,
				'actual'=>$actual
			);
			
		}
		echo json_encode($datos);
	break;
	//valida las programaciones de cliente reprogramadas y alerta antes de 5 min
	case "prog_reprogramadas":
		
		$idUser=$_SESSION["ses_Id"];
		$sql="SELECT 
		      T.NOMBRES,
			  T.TELEFONO1,
			  V.FECHA_VISITA,
			  V.NOTA_GENERAL_GESTION
		      FROM  T_VISITAS_VENDEDOR v 
			  INNER JOIN T_TERCEROS T ON T.CODIGO_SAP_CLI =V.CODIGO_SAP
			  WHERE REPROGRAMADO=1 AND V.ESTADO_VISITA='P' AND ID_USUARIO = ".$_SESSION["ses_Id"]."  
			  AND DATEDIFF(MINUTE,GETDATE(),V.FECHA_HORA_REPROGRAMADO)<120";
		$exe=mssql_query($sal);
		$datos=array();
		
		while($r=mssql_fetch_array($exe)){
			$datos[]=array(
				'nombres'		=>utf8_encode($r["NOMBRES"]),
				'telefono'		=>($r["TELEFONO1"]),
				'fecha_visita'	=>utf8_encode($r["FECHA_VISITA"]),
				'nota_general'	=>utf8_encode($r["NOTA_GENERAL_GESTION"]),
			);
		}
		
	   echo  json_encode($datos);
		
	break;
	//obtiene el nombre del modulo descripcion y version 
	case "getInfoModule":
		
		if(!isset($_POST["numero"])){
			echo  json_encode(array(
				'ok'=>false,
				'mensaje'=>'No se envio el numero del modulo'
			));
			return ;
		}
		$numero=$_POST["numero"];
		//echo " select numero,titulo from t_modulos where numero='$numero'";
		$modulo=GenerarArray(" select numero,lower(titulo) as titulo,lower(nombre_grupo) as nombre_grupo from t_modulos where numero='$numero'",'');
	
		echo  json_encode($modulo);
	break;
		
}


?>