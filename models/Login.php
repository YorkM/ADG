<?php
header('Content-Type: text/html; charset=UTF-8');
include('funciones.php');
session_start();
conectar();


function generatePassword($length){
    $key = "";
    $pattern = "1234567890abcdefghijklmnopqrstuvwxyz";
    $max = strlen($pattern)-1;
    for($i = 0; $i < $length; $i++){
        $key .= substr($pattern, mt_rand(0,$max), 1);
    }
    return $key;
}


switch($_POST['op']){

	case "ValidarUsuario":
		$user    = QuitarCaracter($_POST['usuario']);
		$pass    = QuitarCaracter($_POST['clave']);
		//print_r($_POST);
		$estatus      = 0;
		$cambio_clave = 0;
		$id_usuario   = 0;
		
		$sql = "SELECT TOP 1 
			   U.ID, 
			   U.CLAVE, 
			   U.LOGIN, 
			   U.CODIGO_SAP, 
			   U.EMAIL,
			   U.ESTADO,
			   U.ID_DPTO,
			   U.NOMBRES,
			   U.APELLIDOS,
			   U.ROLES_ID,
			   U.ORGANIZACION_VENTA,
			   U.OFICINA_VENTAS,
			   U.CAMBIO_CLAVE,
			   CASE WHEN (U.ID_DPTO=11 OR U.ID_DPTO=9 OR U.ID_DPTO=13) THEN U.IDENTIFICACION_PROVEEDOR ELSE '0'  END AS NIT_PROVEEDOR,
			   ULTIMO_INGRESO = (SELECT MAX(R.FECHA_HORA) FROM T_REG_LOGIN R WHERE R.ID_USUARIO = U.ID),
			   U.IDENTIFICACION,CALLE
			 FROM 
			   T_USUARIOS  U 
			 WHERE 
			   U.LOGIN = '".strtoupper(utf8_decode($user) )."'";
		$usuario =GenerarArray($sql,'');

		if(trim($usuario[0]["CLAVE"])!=trim(md5($pass))){
			
			echo json_encode(array(
				'ok'=>false,
				'menssage'=>'El usuario o clave son incorrectos!',
				'cambio_clave'=>$usuario[0]["CAMBIO_CLAVE"],
				'datos_usuario'=>[],
				'id'=>''
			));
			return ;
		}

		if($usuario[0]["ESTADO"]!='A'){
			echo json_encode(array(
				'ok'=>false,
				'menssage'=>'El usuario se encuentra bloqueado!',
				'cambio_clave'=>$usuario[0]["CAMBIO_CLAVE"],
				'datos_usuario'=>[],
				'id'=>''
			));
			return ;
		}
							// el usuario existe 
							@$_SESSION["ses_Login"]     = ($usuario[0]['LOGIN']); 
							@$_SESSION["ses_Id"] 	    = $usuario[0]['ID'];
							@$_SESSION["ses_Email"]	    = $usuario[0]['EMAIL'];
							@$_SESSION["ses_DepId"]     = $usuario[0]['ID_DPTO'];
							@$_SESSION["ses_CodSap"]    = $usuario[0]['CODIGO_SAP'];
							@$_SESSION["ses_RolesId"]   = $usuario[0]['ROLES_ID'];
							@$_SESSION["ses_NumOrg"]    = $usuario[0]['ORGANIZACION_VENTA'];
							@$_SESSION["ses_OfcVentas"] = $usuario[0]['OFICINA_VENTAS'];
							@$_SESSION["ses_NitPro"]    = $usuario[0]['NIT_PROVEEDOR'];
							@$_SESSION["ses_Usuario"]   = $usuario[0]['NOMBRES'].' '.$usuario[0]['APELLIDOS'];
							@$_SESSION["ses_Ingreso"]   = $usuario[0]['ULTIMO_INGRESO'];
							@$_SESSION["ses_Nit"]       = $usuario[0]['IDENTIFICACION'];
							@$_SESSION["ses_Calle"]     = $usuario[0]['CALLE'];
							@$_SESSION["ses_Id_Ses"]    = strtotime(date("Y-m-d h:i:s"));
							@$_SESSION["ses_Nombres"]   = ucwords(strtolower( $usuario[0]['NOMBRES']));
							@$_SESSION["ses_Apellidos"]   = ucwords(strtolower( $usuario[0]['APELLIDOS']));
							$cambio_clave = $usuario[0]['CAMBIO_CLAVE'];
							$id_usuario =  $usuario[0]['ID'];


		$UltSession   = GenerarArray("SELECT *  FROM T_USER_ACTIVE WHERE USUARIO_ID=".$usuario[0]['ID'],'');
		$opc=1;
		if(count($UltSession)==0){
			$sp  =  mssql_init('P_USER_ACTIVE');
					mssql_bind($sp, '@USUARIO_ID'  ,$usuario[0]['ID'],  SQLINT4, false, false);
					mssql_bind($sp,'@ID_SES'       ,$_SESSION["ses_Id_Ses"],  SQLVARCHAR, false, false);
					mssql_bind($sp, '@OP'  ,$opc,  SQLINT4, false, false);
					$r   =  mssql_execute($sp);
		}else{
			$UpdSes="UPDATE T_USER_ACTIVE SET SESSION_ID='".$_SESSION["ses_Id_Ses"]."' WHERE USUARIO_ID=".$usuario[0]['ID'];
			$Exec  = mssql_query($UpdSes);	
		}

		$sql = "INSERT INTO T_REG_LOGIN(ID_USUARIO,FECHA_HORA)VALUES('".$usuario[0]['ID']."',GETDATE())";
			mssql_query($sql);

		echo  json_encode(array(
			'ok'=>true,
			'menssage'=>'Se inicio correctamente la sesion',
			'cambio_clave'=>$usuario[0]["CAMBIO_CLAVE"],
			'id'=>$usuario[0]["ID"],
		));


	break;
	case "ValidaCorreo":{
		$sql = "select top 1 
				  login,
				  isnull(nombres,'') +' '+isnull(apellidos,'') as nombres,
				  organizacion_venta as org
				from t_usuarios  
				where 
				  email = '".$_POST['email']."' and estado = 'A';";
		$qry = GenerarArray($sql,'');
		echo json_encode($qry);
	  }break;
	  case "EnviarCorreo":
		$NewPass = generatePassword(10);
		$sql = "update t_usuarios set 
				   clave        = '".md5($NewPass)."',
				   cambio_clave = 1
				where 
					email = '".$_POST['email']."' and estado = 'A';";
		if(mssql_query($sql)){
		   require_once('../../adg/resources/PhPMailer/Email.php');
		   if($_POST['org'] == '1000'){
			 $url    = 'www.multidrogas.com';
			 $slogan = 'CM de Colombia S.A.S el socio leal y estratégico del droguista colombiano';
			 $asunto = 'Recuperacion de clave de acceso a ADG-CM';
		   }else{
			 $url    = 'www.dfroma.com';
			 $slogan = 'Distribuidora farmaceutica ROMA S.A';
			 $asunto = 'Recuperacion de clave de acceso a ADG-ROMA';
		   }
		   $titulo = "Recuperacion de clave de acceso a ADG";
		   $para   = utf8_decode($_POST['email']);
		   $msg    = '<!doctype html>
						  <head>
						  <meta charset="utf-8">
						  <title>Documento sin título</title>
						  </head>
						  <body>
						  <table align="center" border="1" rules="cols">
						   <thead>
							<tr><th colspan="2">CORREO AUTOM&Aacute;TICO DE RECUPERACION DE CONTRASE&Ntilde;A ADG</th></tr>
							<tr><th colspan="2">Sr(a) '.$_POST['nombres'].'</th></tr>
						   </thead>
						   <tbody>
							<tr><td colspan="2" align="center">A continuaci&oacute;n encontrara sus nuevos datos de acceso</td></tr>
							<tr>
							 <td><b>USUARIO</b></td><td>'.$_POST['usuario'].'</td>
							</tr>
							<tr>
							 <td><b>CONTRASE&Ntilde;A</b></td><td>'.$NewPass.'</td>
							</tr>
							<tr><td colspan="2" align="center">Tenga en cuenta que tan pronto ingrese por primera vez, el sistema le solicitara cambio de contrase&ntilde;a.</td></tr>
							<td colspan="2" align="center"><a href="https://www.pwmultiroma.com">Click aqui para ir a ADG</a></td></tr>
						   </tbody>
						   </tbody>
						   <tfoot>
							<tr><td colspan="2" align="center">'.$slogan.'</td></tr>
							<tr><td colspan="2" align="center">'.$url.'</td></tr>
						   </tfoot>
						  </table>
						  </body>
						  </html>';
			 EnviarMail($titulo,$msg,$asunto,$para,'','');
		}else{
		   $datos = array('Id'   => '',
						  'Tipo' => 'error',
						  'Msj'  => 'Error al actualizar los datos del usuario');
		   echo json_encode($datos);
		}
	break;
}