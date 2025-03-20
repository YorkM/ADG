<?php  
session_start();
require('funciones.php');
conectar();

try{

		$nombre_archivo = $_FILES['archivo']['name'];
		$tipo_archivo   = $_FILES['archivo']['type'];
		$tmp_archivo    = $_FILES['archivo']['tmp_name'];
		$ext = pathinfo($nombre_archivo, PATHINFO_EXTENSION);

		
		if(isset($_POST["nuevo_nombre"])){
		 $nombre_archivo=	$_POST["nuevo_nombre"].".".$ext;
		}
		
		$rutaRemota  = $_POST["ruta"].'/'.$nombre_archivo;
	
		if(isset($_POST["cambio_nombre"]) && isset($_POST["nuevo_nombre"])){
			
			if($_POST["cambio_nombre"]==true){
				
				if($_POST["nuevo_nombre"]==''){
					echo  json_encode(array(
						'ok'=>false,
						'datos'=>$_POST,
						'mensaje'=>'No se envio el nuevo nombre del archivo por el que se va a reemplazar',
						'archivo'=>'https://app.pwmultiroma.com/'.$rutaRemota
					));	
					return;
				}
				$rutaRemota  = $_POST["ruta"].'/'.$_POST["nuevo_nombre"].".".$ext;
			}
		}	
	    
	
	
		move_uploaded_file($tmp_archivo,$nombre_archivo );
		$file=getcwd()."/".$nombre_archivo;				
		$subirFtp =uploadFileFtp($rutaRemota,$nombre_archivo);

		if(file_exists($file)){
			unlink($file);
		}

		if($subirFtp){
			echo  json_encode(array(
				'ok'=>true,
				'archivo'=>'https://app.pwmultiroma.com'.$rutaRemota,
				'datos'=>$_POST,
				'nombre_archivo'=>$rutaRemota
			));
		}else{
			echo  json_encode(array(
				'ok'=>false,
				'archivo'=>'https://app.pwmultiroma.com'.$rutaRemota,
				'datos'=>$_POST,
				'nombre_archivo'=>$rutaRemota
			));
		}	
}catch(Exception $e){
		echo  json_encode(array(
			'ok'=>false,
			'archivo'=>'https://app.pwmultiroma.com'.$rutaRemota,
			'datos'=>$_POST,
			'mensaje'=>$e->getMessage()
		));
}

?>