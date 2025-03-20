<?php

function conectar() {
  ini_set( "display_errors", 1 );
  $servername = '192.168.1.21';
  $username = 'Wcmc';
  $password = 'o4X(,xEm>L!<';
  $connection = mssql_connect( $servername, $username, $password )or die( "No se puede conectar con el servidor" );
  mssql_select_db( 'MULTIROMA', $connection );
  return $connection;
}

function conectarBI() {
  ini_set( "display_errors", 1 );
  $servername = '192.168.1.21';
  $username = 'Wcmc';
  $password = 'o4X(,xEm>L!<';
  $connection = mssql_connect( $servername, $username, $password )or die( "No se puede conectar con el servidor" );
  mssql_select_db( 'BI', $connection );
  return $connection;
}
/* CONEXION HANNA. */

function conectarHanaSap() {

  try {
    $driver = "HDB"; // 32 bit odbc drivers that come with the hana client      installation.
    //PRODUCTIVO
    $servername = "181.49.157.131:32113";
    $db_name = "HDB"; // This is the default name of your hana instance. 
    $username = "SAPABAP1"; // This is the default username, do provide your username
    $password = "M4n4g3r16"; // This is the default password, do provide your own   password.
    //CALIDAD
    //$servername     = "190.145.65.251:32013";
    //$db_name        = "RED";      // This is the default name of your hana instance. 
    //$username       = "SAPABAP1"; // This is the default username, do provide your username
    //$password       = "M4n4g3r16"; // This is the default password, do provide your own   password.		
    $conn = odbc_connect( $driver, $username, $password, SQL_CUR_USE_ODBC );

    if ( !$conn ) {

      die( 'Error al intentar conectar a la base de datos de Hanna,' . odbc_errormsg() );
    }
    return $conn;
  } catch ( Exception $e ) {
    echo "Ha ocurrido un error: " . $e->getMessage();
  }
}

function conversitNum( $num ) {

  if ( is_numeric( $num ) ) {
    return $num;
  } else {
    return utf8_encode( $num );
  }

}

function returnCadena( $row ) {
  return utf8_encode( trim( $row ) );
}

function decodeString( $row ) {
  return utf8_decode( trim( $row ) );
}

function formatString($row) { 
    $formattedRow = array();
    foreach ($row as $key => $value) {
        if ($key === 'VENTAS_FECHAGENERACION') { 
            $formattedRow[$key] = date('Y-m-d H:i:s');
        }else if ($key === 'CLIENTE_FECHACREA') { 
            $formattedRow[$key] = date('Y-m-d H:i:s', strtotime($value));
        }else if ($key === 'CLIENTE_MUNCOD') { 
            $formattedRow[$key] = substr($value, -3);
        }else if ($key === 'MAESTRASCLIENTES_FECHAGENERACION') { 
            $formattedRow[$key] = date('Y-m-d H:i:s');
        }else {
            $formattedRow[$key] = str_replace('|', '', trim($value));
        }
    }
    return $formattedRow;
}



function generarArrayHana( $sql, $format = 1 ) {
  $rows = array();
  $conn = conectarHanaSap();

  try {
    if ( !$conn ) {
      throw new Exception( "Error al conectar con la base de datos." );
    }

    $query = odbc_prepare( $conn, $sql );

    if ( !$query ) {
      throw new Exception( "Error al preparar la consulta SQL." );
    }

    if ( odbc_execute( $query ) ) {
      while ( $row = odbc_fetch_array( $query ) ) {
        if ( $format == 0 ) {
          $rows[] = formatString( $row ); //Exclusivo grupo familia - No tocar
        } elseif ( $format == 1 ) {
          $rows[] = array_map( "conversitNum", $row );
        } else {
          $rows[] = array_map( 'returnCadena', $row );
        }
      }
    } else {
      throw new Exception( "Error al ejecutar la consulta SQL." );
    }
  } catch ( Exception $e ) {
    // Manejar el error de manera adecuada, por ejemplo, registrándolo en un archivo de registro.
    error_log( "Error en generarArrayHana: " . $e->getMessage() );
  } finally {
    if ( $conn ) {
      odbc_close( $conn );
    }
  }

  return $rows;
}


//Nueva funcion 29.09.2021
function GuardarLog( $documento, $tipo, $usuario, $accion, $mensaje ) {
  $sp = mssql_init( 'P_DOCUMENTOS_LOG_I' );
  mssql_bind( $sp, '@DOCUMENTO', $documento, SQLVARCHAR, false, false );
  mssql_bind( $sp, '@TIPO', $tipo, SQLVARCHAR, false, false );
  mssql_bind( $sp, '@USUARIO', $usuario, SQLVARCHAR, false, false );
  mssql_bind( $sp, '@ACCION', $accion, SQLVARCHAR, false, false );
  mssql_bind( $sp, '@MENSAJE', $mensaje, SQLVARCHAR, false, false );
  mssql_execute( $sp );
}

function ConectarBiometrico( $ofc ) {

  switch ( trim( $ofc ) ) {

    case "1100":
      ini_set( "display_errors", 1 );
      $servername = '181.57.206.108';
      $username = 'Wcmc';
      $password = 'Mul71dr0g4s';
      $connection = mssql_connect( $servername, $username, $password )or die( "No se puede conectar con el servidor" );
      mssql_select_db( 'BIOMETRICOS', $connection );
      return $connection;
      break;
    case "1200":
      ini_set( "display_errors", 1 );
      $servername = '181.57.206.108';
      $username = 'Wcmc';
      $password = 'Mul71dr0g4s';
      $connection = mssql_connect( $servername, $username, $password )or die( "No se puede conectar con el servidor" );
      mssql_select_db( 'BIOMETRICOS', $connection );
      return $connection;
      break;
    case "2100":
      ini_set( "display_errors", 1 );
      $servername = '192.168.1.2';
      $username = 'user_biometrico';
      $password = '3xH7@&v9';
      $connection = mssql_connect( $servername, $username, $password )or die( "No se puede conectar con el servidor" );
      mssql_select_db( 'Biometrico', $connection );
      return $connection;
      break;
    case "2200":
      ini_set( "display_errors", 1 );
      $servername = '192.168.1.2';
      $username = 'user_biometrico';
      $password = '3xH7@&v9';
      $connection = mssql_connect( $servername, $username, $password )or die( "No se puede conectar con el servidor" );
      mssql_select_db( 'Biometrico', $connection );
      return $connection;
      break;
    case "2300":
      ini_set( "display_errors", 1 );
      $servername = '192.168.1.2';
      $username = 'user_biometrico';
      $password = '3xH7@&v9';
      $connection = mssql_connect( $servername, $username, $password )or die( "No se puede conectar con el servidor" );
      mssql_select_db( 'Biometrico', $connection );
      return $connection;
      break;
    case "2400":
      ini_set( "display_errors", 1 );
      $servername = '192.168.1.2';
      $username = 'user_biometrico';
      $password = '3xH7@&v9';
      $connection = mssql_connect( $servername, $username, $password )or die( "No se puede conectar con el servidor" );
      mssql_select_db( 'Biometrico', $connection );
      return $connection;
      break;
  }

}


function getIP() {
  if ( isset( $_SERVER[ "HTTP_CLIENT_IP" ] ) ) {
    return $_SERVER[ "HTTP_CLIENT_IP" ];
  } elseif ( isset( $_SERVER[ "HTTP_X_FORWARDED_FOR" ] ) ) {
    return $_SERVER[ "HTTP_X_FORWARDED_FOR" ];
  } elseif ( isset( $_SERVER[ "HTTP_X_FORWARDED" ] ) ) {
    return $_SERVER[ "HTTP_X_FORWARDED" ];
  } elseif ( isset( $_SERVER[ "HTTP_FORWARDED_FOR" ] ) ) {
    return $_SERVER[ "HTTP_FORWARDED_FOR" ];
  } elseif ( isset( $_SERVER[ "HTTP_FORWARDED" ] ) ) {
    return $_SERVER[ "HTTP_FORWARDED" ];
  } else {
    return $_SERVER[ "REMOTE_ADDR" ];
  }
}

function Consecutivo( $num ) {
  $num = ( string )$num;
  $n_ceros = 3 - strlen( $num );
  $c = "0";
  $cadena = "";
  for ( $i = 0; $i < $n_ceros; $i++ ) {
    $cadena = $cadena + $c;

  }
  return $cadena + $num;
}

function convertMonthText( $mes ) {

  $text = '';

  switch ( $mes ) {

    case 1:
      $text = 'Enero';
      break;
    case 2:
      $text = 'Febrero';
      break;
    case 3:
      $text = 'Marzo';
      break;
    case 4:
      $text = 'Abril';
      break;
    case 5:
      $text = 'Mayo';
      break;
    case 6:
      $text = 'Junio';
      break;
    case 7:
      $text = 'Julio';
      break;
    case 8:
      $text = 'Agosto';
      break;
    case 9:
      $text = 'Septiembre';
      break;
    case 10:
      $text = 'Octubre';
      break;
    case 11:
      $text = 'Noviembre';
      break;
    case 12:
      $text = 'Diciembre';
      break;
  }

  return $text;

}

/*FUNCIONES DE FTP*/

function conectarFtp() {
  $ftp_server = "192.168.2.52"; //ip de la NAS
  $conn_id = ftp_connect( $ftp_server )or die( "No se pudo conectar a $ftp_server" );
  $ftp_user = "adg";
  $ftp_pass = "Mul71dr0g4s";
  ftp_login( $conn_id, $ftp_user, $ftp_pass );
  return $conn_id;
}


function uploadFileFtp($rutaRemota,$archivo_local){
	  
	try{
    
		if($rutaRemota==''){  throw new Exception( 'Debe enviar la ruta');  }
		if($archivo_local   ==''){  throw new Exception( 'Debe enviar el archivo');  }

		$conn_id =conectarFtp();
	
		if(!$conn_id){  echo 'Error al conectarse al servidor '; return;}
		$upload = ftp_put($conn_id,$rutaRemota, $archivo_local,FTP_BINARY);

		ftp_chmod($conn_id, 0777, $rutaRemota);

		return $upload;
		
	}catch(Exception $e){
		echo $e->getMessage();
	}

}


//**************************************************************
function subirFtp( $archivo_local, $nombre_remoto, $ruta = "" ) {
  /*
  $ftp_server = "192.168.1.10";//ip de la NAS
  $ftp_user = "multiroma";
  $ftp_pass = "Mul71dr0g4sR0m4$%";
  $conn_id = ftp_connect($ftp_server) or die("No se pudo conectar a $ftp_server");
  $arrayString = explode(".", $archivo_local); //array(archivo1, jpg)
  $extension = strtoupper(end($arrayString)); //jpg
	
  // intentar iniciar sesión
  if (@ftp_login($conn_id, $ftp_user, $ftp_pass)) {
  		
  		$file="/var/www/adg/models/sys/".$archivo_local;//documento local en adg
  		if($ruta==''){
  			$ruta="home/ADG/Documentos/soportes_tickets/";
  		}
    
  	if (ftp_put($conn_id, $ruta.$nombre_remoto, $file, FTP_BINARY)) {
  			   $sw=true;
  		}	
  } else {
  		echo "No se pudo conectar como $ftp_user\n";
  }
	
  ftp_close($conn_id);
  */
}


function leerFTP( $archivo, $ruta = "" ) {

  // ruta al archivo remoto
  $remote_file = "home/ADG/Documentos/soportes_tickets/" . $archivo;
  $local_file = $archivo;

  // abrir un archivo para escribir
  $handle = fopen( $local_file, 'w' );

  $ftp_server = "192.168.2.52"; //ip de la NAS
  $ftp_user = "adg";
  $ftp_pass = "Mul71dr0g4s";
  // establecer una conexión básica
  $conn_id = ftp_connect( $ftp_server );

  // iniciar sesión con nombre de usuario y contraseña
  $login_result = ftp_login( $conn_id, $ftp_user, $ftp_pass );

  // intenta descargar un $remote_file y guardarlo en $handle
  if ( ftp_fget( $conn_id, $handle, $remote_file, FTP_BINARY, 0 ) ) {

    if ( $ruta == '' ) {
      echo "../../models/sys/" . $local_file;
    } else {
      echo $ruta . $local_file;
    }


  } else {
    echo "Ha habido un problema durante la descarga de $remote_file en $local_file\n";
  }

  // cerrar la conexión ftp y el gestor de archivo
  ftp_close( $conn_id );
  fclose( $handle );


}


function eliminarFtp($rutaRemota){
  $conn_id =conectarFtp();
  // Intenta eliminar el archivo
  $del=ftp_delete($conn_id, $rutaRemota); 
  // Cerrar la conexión FTP
  ftp_close($conn_id);	
  return $del;
}


function deleteFtp( $file ) {


  $ftp_server = "192.168.2.52"; //ip de la NAS
  $ftp_user = "adg";
  $ftp_pass = "Mul71dr0g4s";
  // establecer una conexión básica
  $conn_id = ftp_connect( $ftp_server );

  // iniciar sesión con nombre de usuario y contraseña
  $login_result = ftp_login( $conn_id, $ftp_user, $ftp_pass );

  if ( ftp_delete( $conn_id, $file ) ) {
    return true;
  } else {
    return false;
  }

}

function EmailCalidad( $opc, $id, $texto, $tipo ) {

  /*
  Empleado 
Estado  de la solicitud
Documento                             
Proceso
Código  
Nombre 
Fecha de la solicitud 
Fecha de la aprobación 

//mejoras
Origen
Mejora
Requisito                             
Fecha de creación 

  */
  $empleado = '';
  $estado = '';
  $documento = '';
  $proceso = '';
  $codigo = '';
  $nombre = '';
  $fecha_sol = '';
  $fecha_auto = '';
  $html = '';
  $nota_rechazo = '';

  $origen = '';
  $mejora = '';

  if ( $texto == '' ) {

    $estado = 'Autorizado';

  } else {

    $estado = 'Pendiente';
  }

  if ( trim( $tipo ) == 'M' ) {
    $tp_sol = "MODIFICACION";
  } else {
    $tp_sol = "CREACION";
  }


  $sql = "
			 		SELECT
					U.NOMBRES+' '+U.APELLIDOS AS EMPLEADO,
					P.PROCESO,
					S.DOC_COD AS CODIGO,
					S.DOC_NOMBRE,
					S.DOC_FHSOLIC AS FECHA_SOL,
					S.DOC_FHAUTO AS FECHA_AUTO,
					NOTA_RECHAZO=(
								  SELECT TOP 1
								  NOTA
								  FROM T_CAL_NOTAS_DOCUMENTOS
								  WHERE ID_DOC=S.DOC_ID
					)
					FROM T_CAL_DOCUMENTOS S
					INNER JOIN T_USUARIOS     U ON   U.ID =S.DOC_USR_SOLICITA
					INNER JOIN T_CAL_PROCESOS P ON   P.COD=S.DOC_PROCESO
					WHERE S.DOC_ID=" . $id . " ";
  // echo $sql;
  $q = mssql_query( $sql );
  while ( $row = mssql_fetch_array( $q ) ) {
    $empleado = utf8_decode( $row[ 'EMPLEADO' ] );
    $proceso = $row[ 'PROCESO' ];

    $codigo = $row[ 'CODIGO' ];
    $nombre = $row[ 'DOC_NOMBRE' ];
    $fecha_sol = $row[ 'FECHA_SOL' ];
    $fecha_auto = $row[ 'FECHA_AUTO' ];
    $nota_rechazo = utf8_decode( $row[ 'NOTA_RECHAZO' ] );
  }

  switch ( $opc ) {
    //aprobacion para editar	


    case 1:
      $img = 'sol_doc';

      $html = '<html>
             <body>
		     <table class="" border="0" width="60%" align="center" cellpadding="8" cellspacing="0"
				  style="font-family: \'Gill Sans\', 
				         \'Gill Sans MT\', \'Myriad Pro\', 
						 \'DejaVu Sans Condensed\', Helvetica, Arial, 
						 \'sans-serif\'; 
						 border: 1px solid #97D3F9;
						 border-radius: 12px 12px 12px 12px;
						-moz-border-radius: 12px 12px 12px 12px;
						-webkit-border-radius: 12px 12px 12px 12px;
						 border: 0px solid #000000;">
               <tr>
                <td colspan="2" style="padding: 5px; 
				                       margin: 10px; 
									   background-color:#A3D9E0; 
									   font-family: \'Gill Sans\', 
									   \'Gill Sans MT\', \'Myriad Pro\', 
									   \'DejaVu Sans Condensed\', 
									   Helvetica, Arial, \'sans-serif\'; color:#01807E;
                                       border-radius: 12px 12px 12px 12px;
									   -moz-border-radius: 12px 12px 12px 12px;
									   -webkit-border-radius: 12px 12px 12px 12px;
									   height: 100px;">
			  <table width="80%"   border="0" cellpadding="0" cellspacing="0" align="center" style="color:#17666F">
				<tr>
					<td align="left" width="5%" valign="middle"> 
					   <img  src="https://www.pwmultiroma.com/adg/resources/icons/' . $img . '.png" width="90" height="80" />
					</td>			
					<td width="95%" align="center" valign="bottom">
						<h2><b>ADG </b> ' . utf8_decode( 'GESTIÓN' ) . ' INTEGRADA </h2>
					</td>
				</tr>
			  </table>
		      </tr>   
			   <tr>
				     <td colspan="2" align="center" >NUEVA SOLICITUD DE ' . utf8_decode( $tp_sol ) . ' DE DOCUMENTOS</td>
			   </tr>
		       <tr>
			     <th colspan="2" style="background-color:#008B9C;height:30px;line-height: 30px;">DETALLES</th>
		       </tr>
			   <tr>
				    <td colspan="2"><hr style="border:1px dotted #008B9C; width:100%" /></td>
			   </tr>
			   <tr>
			       <td>Estado  de la solicitud</td>
				   <td>' . $estado . '</td>
			   </tr>
			   <tr>
			       <td>Solicitante</td>
				   <td>' . $empleado . '</td>
			   </tr>
			   <tr>
			       <td>Proceso</td>
				   <td>' . $proceso . '</td>
			   </tr>
			   <tr>
			       <td>' . utf8_decode( 'Código' ) . '</td>
				   <td>' . $codigo . '</td>
			   </tr>
			   <tr>
			       <td>Nombre</td>
				   <td>' . $nombre . '</td>
			   </tr>
			   <tr>
			       <td>Fecha de la solicitud </td>
				   <td>' . $fecha_sol . '</td>
			   </tr>';

      if ( $texto == '' ) {
        $html .= '<tr>
			      <td>Fecha de la ' . utf8_decode( 'autorización ' ) . ' </td>
				  <td>' . $fecha_auto . '</td>
			   </tr>';
      }
      $html .= '<tr>
			     <td colspan="2">
				    <hr style="border:1px dotted #008B9C; width:100%" />
				 </td>
			   </tr>
		   </table>
			<center><img width="200" height="50" src="https://www.pwmultiroma.com/adg/resources/images/logo_roma.jpg"  ></center>
	   </body>
     </html>';
      break;

      //PARA EXPOSICION	 
    case 3:
      $nota_text = 'Le informamos que el documento ' . $nombre . ' con ' . utf8_decode( 'código' ) . ' ' . $codigo . '  se encuentra en  <b>' . utf8_decode( 'EXPOSICIÓN' ) . '</b>, por favor realizar las debidas revisiones.';
      $html = '<html>
				<body>
					<div style="padding: 5px; margin: 10px; background-color:#FDF3CA; font-family: \'Gill Sans\', \'Gill Sans MT\', \'Myriad Pro\', \'DejaVu Sans Condensed\', Helvetica, Arial, \'sans-serif\'; color:#9A861F;

								border-radius: 12px 12px 12px 12px;
								-moz-border-radius: 12px 12px 12px 12px;
								-webkit-border-radius: 12px 12px 12px 12px;
								 height: 100px;
								">
						<table width="95%"   border="0" cellpadding="0" cellspacing="0" align="center" style="color:#9A861F">

							<tr>
								<td align="left" width="5%" valign="middle"> 
								   <img  src="https://www.pwmultiroma.com/adg/resources/icons/sol_doc2.png" width="90" height="80" />
								</td>			
								<td width="95%" align="center" valign="bottom">
									<h2><b>ADG </b> ' . utf8_decode( 'GESTIÓN' ) . ' INTEGRADA </h2>
								</td>

							</tr>
						</table>

					</div>
					<p style="background-color: #17666F; color:#ffffff; font-weight: 600; text-align: center; padding: 10px">
						DETALLES
					</p>
					<br>
				   <p>
					  SR(A)  ' . utf8_decode( $empleado ) . '
					   <br><br>
						<fieldset
						style="border-radius: 12px 12px 12px 12px;
							-moz-border-radius: 12px 12px 12px 12px;
						    -webkit-border-radius: 12px 12px 12px 12px;">' . $nota_text . '</fieldset>
					</p>
					<br>
					<br>
					<center><img width="200" height="50" src="https://www.pwmultiroma.com/adg/resources/images/logo_roma.jpg"  ></center>

				</body>

			</html>';

      break;
    case 4:
      $nota_text = 'Le informamos que el documento ' . $nombre . ' con ' . utf8_decode( 'código' ) . ' ' . $codigo . '  se encuentra listo para <b>APROBACION</b> ';
      $html = '<html>
				<body>
					<div style="padding: 5px; margin: 10px; background-color:#FFC49C; font-family: \'Gill Sans\', \'Gill Sans MT\', \'Myriad Pro\', \'DejaVu Sans Condensed\', Helvetica, Arial, \'sans-serif\'; color:#9E5516;

								border-radius: 12px 12px 12px 12px;
								-moz-border-radius: 12px 12px 12px 12px;
								-webkit-border-radius: 12px 12px 12px 12px;
								 height: 100px;
								">
						<table width="95%"   border="0" cellpadding="0" cellspacing="0" align="center" style="color:#9E5516">

							<tr>
								<td align="left" width="5%" valign="middle"> 
								   <img  src="https://www.pwmultiroma.com/adg/resources/icons/sol_doc3.png" width="90" height="80" />
								</td>			
								<td width="95%" align="center" valign="bottom">
									<h2><b>ADG  </b> ' . utf8_decode( 'GESTIÓN' ) . ' INTEGRADA </h2>
								</td>

							</tr>
						</table>

					</div>
					<p style="background-color: #17666F; color:#ffffff; font-weight: 600; text-align: center; padding: 10px">
						DETALLES
					</p>
					<br>
				   <p>
					  SR(A) ' . utf8_decode( $empleado ) . '
					   <br><br>
						<fieldset style="border-radius: 12px 12px 12px 12px;
									   -moz-border-radius: 12px 12px 12px 12px;
									   -webkit-border-radius: 12px 12px 12px 12px;">' . $nota_text . '</fieldset>
					</p>
					<br>
					<br>
					<center><img width="200" height="50" src="https://www.pwmultiroma.com/adg/resources/images/logo_roma.jpg"  ></center>
				</body>
			</html>';
      break;

    case 8:
      //APROBADO PARA DISTRIBUIR
      $nota_text = 'Le informamos que el documento ' . $nombre . ' con ' . utf8_decode( 'código' ) . ' ' . $codigo . '  se encuentra  <b>APROBADO</b> y hace parte de la ' . utf8_decode( 'documentación' ) . ' de  su proceso.';
      $html = '<html>
				<body>
					<div style="padding: 5px; margin: 10px; background-color:#DBFFCE; font-family: \'Gill Sans\', \'Gill Sans MT\', \'Myriad Pro\', \'DejaVu Sans Condensed\', Helvetica, Arial, \'sans-serif\'; color:#1F7F18;

								border-radius: 12px 12px 12px 12px;
								-moz-border-radius: 12px 12px 12px 12px;
								-webkit-border-radius: 12px 12px 12px 12px;
								 height: 100px;
								">
						<table width="95%"   border="0" cellpadding="0" cellspacing="0" align="center" style="color:#1F7F18">

							<tr>
								<td align="left" width="5%" valign="middle"> 
								   <img  src="https://www.pwmultiroma.com/adg/resources/icons/sol_doc6.png" width="90" height="80" />
								</td>			
								<td width="95%" align="center" valign="bottom">
									<h2><b>ADG</b> ' . utf8_decode( 'GESTIÓN' ) . ' INTEGRADA </h2>
								</td>

							</tr>
						</table>

					</div>
					<p style="background-color: #17666F; color:#ffffff; font-weight: 600; text-align: center; padding: 10px">
						DETALLES
					</p>
					<br>
				   <p>
					 SR(A)  ' . utf8_decode( $empleado ) . '
					   <br><br>
						<fieldset>' . $nota_text . '</fieldset>
					</p>
					<br>
					<br>
					<center><img width="200" height="50" src="https://www.pwmultiroma.com/adg/resources/images/logo_roma.jpg"  ></center>
				</body>
			</html>';

      break;
    case 6: //SOLICITUD RECHAZADA
      $nota_text = 'Le informamos que la solicitud del documento ' . $nombre . ' con ' . utf8_decode( 'código' ) . ' ' . $codigo . '  fue RECHAZADA.';

      $nota_text .= '<fieldset><legend> ' . utf8_decode( 'Razón' ) . ' </legend>
		             ' . utf8_decode( $nota_rechazo ) . '
					 </fieldset>';

      $html = '<html>
				<body>
					<div style="padding: 5px; margin: 10px; background-color:#F8B2B3; font-family: \'Gill Sans\', \'Gill Sans MT\', \'Myriad Pro\', \'DejaVu Sans Condensed\', Helvetica, Arial, \'sans-serif\'; color:#9C0F12;

								border-radius: 12px 12px 12px 12px;
								-moz-border-radius: 12px 12px 12px 12px;
								-webkit-border-radius: 12px 12px 12px 12px;
								 height: 100px;
								">
						<table width="95%"   border="0" cellpadding="0" cellspacing="0" align="center" style="color:#9C0F12">

							<tr>
								<td align="left" width="5%" valign="middle"> 
								   <img  src="https://www.pwmultiroma.com/adg/resources/icons/sol_doc5.png" width="90" height="80" />
								</td>			
								<td width="95%" align="center" valign="bottom">
									<h2><b>ADG </b> ' . utf8_decode( 'GESTIÓN' ) . ' INTEGRADA </h2>
								</td>

							</tr>
						</table>

					</div>
					<p style="background-color: #17666F; color:#ffffff; font-weight: 600; text-align: center; padding: 10px">
						DETALLES
					</p>
					<br>
				   <p>
					  SR(A)  <span>' . utf8_decode( $empleado ) . '</span>
					   <br><br>
						<fieldset
						style="border-radius: 12px 12px 12px 12px;
							-moz-border-radius: 12px 12px 12px 12px;
						    -webkit-border-radius: 12px 12px 12px 12px;">' . $nota_text . '</fieldset>
					</p>
					<br>
					<br>
					<center><img width="200" height="50" src="https://www.pwmultiroma.com/adg/resources/images/logo_roma.jpg"  ></center>

				</body>

			</html>';

      break;
    case 9:
      break;
  }


  return $html;
}


/*RETORNA EL ARRAY CON DOS POSICIONES  [TipoM] Y  [TextoM] */
function ArrayRespuesta( $arr ) {

  $new_array = array();
  //print_r($arr);
  if ( array_key_exists( 'NumeroPedido', $arr ) ) {

    if ( array_key_exists( 'TipoM', $arr[ 'Mensajes' ] ) ) {
      $new_array[] = array( 'TipoM' => $arr[ 'Mensajes' ][ 'TipoM' ],
        'TextoM' => $arr[ 'Mensajes' ][ 'TextoM' ] );
    } else {
      $tipo = '';
      $msj = '';
      for ( $i = 0; $i <= count( $arr[ 'Mensajes' ] ) - 1; $i++ ) {
        if ( $arr[ 'Mensajes' ][ $i ][ 'TipoM' ] == 'S' ) {
          $tipo = $arr[ 'Mensajes' ][ $i ][ 'TipoM' ];
          $msj = $arr[ 'Mensajes' ][ $i ][ 'TextoM' ];
          break;
        } else {
          $tipo = $arr[ 'Mensajes' ][ $i ][ 'TipoM' ];
          $msj .= $arr[ 'Mensajes' ][ $i ][ 'TextoM' ];
        }
      }

      $new_array[] = array( 'TipoM' => $tipo,
        'TextoM' => $msj );

    }
  } else {
    foreach ( $arr as $r2 => $clave2 ) {
      if ( array_key_exists( 'Mensajes', $arr ) ) {
        $c = 0;
        foreach ( $clave2 as $rint ) {
          if ( array_key_exists( 'TipoM', $clave2 ) ) {
            if ( $c == 0 ) {
              $new_array[] = array( 'TipoM' => $clave2[ "TipoM" ],
                'TextoM' => $clave2[ "TextoM" ] );
            } //IF
          } else {
            foreach ( $clave2 as $int2 ) {
              if ( $c == 0 ) {
                $new_array[] = array( 'TipoM' => $int2[ "TipoM" ],
                  'TextoM' => $int2[ "TextoM" ] );
              }
            } //FOR								
          } //ELSE					 
          $c++;
        } //FOREACH 
      } //IF
    } //FOREACH

  }

  return $new_array;
}


//Connexion asterisk medellin
function AsteriskConectMed( $db ) {
  //181.49.157.132
  $link = mysql_connect( "192.168.1.25", "multidrogas", "Mul71dr0g4s2017$%" )or die( "Error al conectar: " . mysql_error() );
  mysql_select_db( $db )or die( "Error al conectar a Asterisk CDR. error:" . mysql_error() );
  return $link;
}

//Connexion asterisk Bogota
function AsteriskConectBog( $db ) {
  $link = mysql_connect( "181.57.205.85", "multidrogas", "Mul71dr0g4s2017$%" )or die( "Error al conectar: " . mysql_error() );
  mysql_select_db( $db )or die( "Error al conectar a Asterisk CDR. error:" . mysql_error() );
  return $link;
}

//Connexion asterisk Monteria
function AsteriskConectMon( $db ) {
  $link = mysql_connect( "181.57.206.109", "multidrogas", "Mul71dr0g4s2017$%" )or die( "Error al conectar: " . mysql_error() );
  mysql_select_db( $db )or die( "Error al conectar a Asterisk CDR. error:" . mysql_error() );
  return $link;
}
//Connexion asterisk Barranquilla
function AsteriskConectBar( $db ) {
  $link = mysql_connect( "181.57.206.109", "multidrogas", "Mul71dr0g4s2017$%" )or die( "Error al conectar: " . mysql_error() );
  //$link = mysql_connect( "181.49.71.242:3350", "multidrogas", "Mul71dr0g4s$%" )or die( "Error al conectar: " . mysql_error() );
  mysql_select_db( $db )or die( "Error al conectar a Asterisk CDR. error:" . mysql_error() );
  return $link;
}

//Connexion asterisk Cartagena
function AsteriskConectCar( $db ) {
  $link = mysql_connect( "181.49.71.242:3350", "multidrogas", "Mul71dr0g4s$%" )or die( "Error al conectar: " . mysql_error() );
  mysql_select_db( $db )or die( "Error al conectar a Asterisk CDR. error:" . mysql_error() );
  return $link;
}

//Connexion asterisk Cali
function AsteriskConectCali( $db ) {
  $link = mysql_connect( "181.57.128.213", "multidrogas", "Mul71dr0g4s$%" )or die( "Error al conectar: " . mysql_error() );
  mysql_select_db( $db )or die( "Error al conectar a Asterisk CDR. error:" . mysql_error() );
  return $link;
}


function GenerarArrayMYSQL( $sql ) {
  $matriz = array();
  $result = mysql_query( $sql );
  while ( $row = mysql_fetch_array( $result ) ) {
    $matriz[] = array_map( 'utf8_encode', $row );
  }
  return $matriz;
}

//
function conectarPassport() {
  ini_set( "display_errors", 1 );
  $servername = '192.168.1.21';
  $username = 'sa';
  $password = 'Mul71dr0g4s';
  $connection = mssql_connect( $servername, $username, $password )or die( "No se puede conectar con el servidor" );
  mssql_select_db( 'PASSPORT', $connection );
  return $connection;
}

function GenerarArray( $sql, $op ) {
  
  $matriz = array();
  if ( $op != 'SP' ) {
    $q = mssql_query( $sql );
  } else {
    $q = $sql;
  }
  while ( $row = mssql_fetch_assoc( $q ) ) {
    $matriz[] = array_map( 'utf8_encode', $row );
  }
  return $matriz;
}

function GenerarArraySimple( $sql, $op ) {
  $array = '';
  if ( $op != 'SP' ) {
    $q = mssql_query( $sql );
  } else {
    $q = $sql;
  }
  while ( $row = mssql_fetch_assoc( $q ) ) {
    $array = array_map( 'utf8_encode', $row );
  }
  return $array;
}

function Redireccionar() {
  //conectar();
  if ( empty( $_SESSION[ "ses_Id" ] ) ) {
    header( 'Location:Login.php' );
  } else {

    /* $fechaGuardada = $_SESSION["ses_Id_Ses"];
    $ahora = date("Y-m-d h:i:s");
    $tiempo_transcurrido = (strtotime($ahora)-strtotime($fechaGuardada));
    //comparamos el tiempo transcurrido
     if($tiempo_transcurrido >= 600) {
     //si pasaron 10 minutos o más
      session_destroy(); // destruyo la sesión
      header('Location:Login.php'); //envío al usuario a la pag. de autenticación
      //sino, actualizo la fecha de la sesión
	  
	  }
	  */

  }
}

function VerificarSession() {

  if ( !empty( $_SESSION[ "ses_Id" ] ) ) {
    return $_SESSION[ "ses_Id" ];
  } else {
    return 0;
  }
}

function QuitarCaracter( $mensaje ) {
  $nopermitidos = array( "'", '\\', '<', '>', "\"" );
  $mensaje = str_replace( $nopermitidos, "", $mensaje );
  return $mensaje;
}

function ObtenerData( $datos ) {
  $array = array();
  $cadena = "";
  if ( !empty( $datos[ 'NumeroPedido' ] ) ) {
    $cadena = $datos[ 'NumeroPedido' ];
  }
  for ( $i = 0; $i < count( $datos[ 'Mensajes' ] ); $i++ ) {
    $array = $datos[ 'Mensajes' ][ $i ];
    //echo "asdsadasd".count($array)."</br>";
    if ( $array[ 'TipoM' ] == 'E' ) {
      $cadena = $array[ 'TextoM' ];
    }
  } // for
  return $cadena;
}

function palabras_usuarios( $texto, $alias ) {
  $newcadena = "";
  $cadena = explode( " ", $texto );
  for ( $i = 0; $i < count( $cadena ); $i++ ) {
    if ( $cadena[ $i ] != " " ) {
      if ( $i > 0 ) {
        $newcadena .= " ";
      }
      $newcadena .= $cadena[ $i ];
    }
  }
  $texto = explode( " ", $newcadena );
  $long_str = count( $texto );
  $new_str = "";
  for ( $i = 0; $i < $long_str; $i++ ) {
    if ( $i > 0 ) {
      $new_str .= " AND ";
    }
    $new_str .= "  
  									isnull(" . $alias . ".IDENTIFICACION,'')+
  									isnull(" . $alias . ".NOMBRES,'')+
									isnull(" . $alias . ".LOGIN,'')+
  									isnull(" . $alias . ".APELLIDOS,'')like('%" . $texto[ $i ] . "%')";
  }
  return $new_str;
}

function palabras_terceros( $texto, $alias ) {
  $newcadena = "";
  $cadena = explode( " ", $texto );
  for ( $i = 0; $i < count( $cadena ); $i++ ) {
    if ( $cadena[ $i ] != " " ) {
      if ( $i > 0 ) {
        $newcadena .= " ";
      }
      $newcadena .= $cadena[ $i ];
    }
  }
  $texto = explode( " ", $newcadena );
  $long_str = count( $texto );
  $new_str = "";
  for ( $i = 0; $i < $long_str; $i++ ) {
    if ( $i > 0 ) {
      $new_str .= " AND ";
    }
    $new_str .= "   isnull(" . $alias . ".codigo_sap,'')+
  									isnull(" . $alias . ".nit,'')+
  									isnull(" . $alias . ".nombres,'')+ 
									isnull(" . $alias . ".razon_comercial,'')like('%" . $texto[ $i ] . "%')";
  }
  return $new_str;
}

function palabras_zonas( $texto, $alias ) {
  $newcadena = "";
  $cadena = explode( " ", $texto );
  for ( $i = 0; $i < count( $cadena ); $i++ ) {
    if ( $cadena[ $i ] != " " ) {
      if ( $i > 0 ) {
        $newcadena .= " ";
      }
      $newcadena .= $cadena[ $i ];
    }
  }
  $texto = explode( " ", $newcadena );
  $long_str = count( $texto );
  $new_str = "";
  for ( $i = 0; $i < $long_str; $i++ ) {
    if ( $i > 0 ) {
      $new_str .= " AND ";
    }
    $new_str .= "   isnull(" . $alias . ".ZONA_DESCRIPCION,'')+
  									isnull(" . $alias . ".ZONA_VENTAS,'') like('%" . $texto[ $i ] . "%')";
  }
  return $new_str;
}

function palabras_materiales( $texto, $alias ) {
  $newcadena = "";
  $cadena = explode( " ", $texto );
  $new_str = "";
  if ( count( $cadena ) == 1 && is_numeric( $cadena[ 0 ] ) ) {
    $new_str .= "   isnull(" . $alias . ".codigo_material,'')like('%" . $cadena[ 0 ] . "%')";
  } else {
    for ( $i = 0; $i < count( $cadena ); $i++ ) {
      if ( $cadena[ $i ] != " " ) {
        if ( $i > 0 ) {
          $newcadena .= " ";
        }
        $newcadena .= $cadena[ $i ];
      }
    }
    $texto = explode( " ", $newcadena );
    $long_str = count( $texto );

    for ( $i = 0; $i < $long_str; $i++ ) {
      if ( $i > 0 ) {
        $new_str .= " AND ";
      }
      $new_str .= "   isnull(" . $alias . ".GRUPO_ARTICULOS,'')+isnull(" . $alias . ".DESCRIPCION,'')like('%" . $texto[ $i ] . "%')";
    }
  }
  return $new_str;
}

function Formato_Fecha_M_D_A( $fecha ) {
  list( $dia, $mes, $anio ) = explode( "-", $fecha );
  return $mes . "-" . $dia . "-" . $anio;
}

function Formato_Fecha_A_M_D( $fecha ) {
  list( $dia, $mes, $anio ) = explode( "-", $fecha );
  return $anio . "-" . $mes . "-" . $dia;
}

function cambiarFormatoFecha_ymd( $fecha ) {
  list( $dia, $mes, $anio ) = explode( "-", $fecha );
  return $anio . "/" . $mes . "/" . $dia;
}

function cambiarFormatoFecha_m_d_y( $fecha ) {
  list( $dia, $mes, $anio ) = explode( "-", $fecha );
  return $mes . "/" . $dia . "/" . $anio;
}

function quotedstr( $val ) {
  //return "'".$val."'";
  return $val;
}

/*function formato_creado( $fecha_bd ) {
  if ( $fecha_bd != '' ) {
    setlocale( LC_ALL, 'Spanish' );
    $tiempo = strtotime( $fecha_bd );
    return strftime( "%d de %B del %Y ", $tiempo );
  }
}*/
function formato_creado($fecha_bd) {
    if ($fecha_bd != '') {
        setlocale(LC_ALL, 'es_ES.UTF-8', 'Spanish_Spain.1252');
        $meses = array(
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        );
        $tiempo = strtotime($fecha_bd);
        $dia = strftime("%d", $tiempo);
        $mes = $meses[date('n', $tiempo) - 1]; // Obtener el nombre del mes
        $anio = strftime("%Y", $tiempo);
        return $dia . ' de ' . $mes . ' del ' . $anio;
    }
    return ''; 
}


function AddDays( $fecha, $ndiasasumar ) {
  list( $dia, $mes, $ano ) = split( "-", $fecha );
  $nueva = mktime( 0, 0, 0, $mes, $dia, $ano ) + $ndiasasumar * 24 * 60 * 60;
  $nuevafecha = date( "d-m-Y", $nueva );
  return ( $nuevafecha );
}

function separa_in( $arr ) {
  //print_r($arr);
  $coma = ",";
  $texto = "";
  $arr = explode( ",", $arr );
  //print_r($arr);
  for ( $i = 0; $i < count( $arr ); $i++ ) {

    if ( ( count( $arr ) - 1 ) == $i ) {
      $coma = "";
    }

    $texto .= "'" . $arr[ $i ] . "'" . $coma;

  } //for($i=0;$i<count($arr);$i++){
  return trim( $texto );
}

function separar_like( $cadena, $camp ) {
  $or = " or ";
  $texto = "";
  $cadena = explode( ",", $cadena );
  for ( $i = 0; $i < count( $cadena ); $i++ ) {
    if ( ( count( $cadena ) - 1 ) == $i ) {
      $or = " ";
    }
    $texto .= $camp . " like('%" . $cadena[ $i ] . "') " . $or;
  } //for($i=0;$i<count($arr);$i++){
  return trim( $texto );
}


function eliminar_simbolos( $string ) {

  $string = ( ( string )trim( $string ) );

  $string = str_replace(
    array( 'á', 'à', 'ä', 'â', 'ª', 'Á', 'À', 'Â', 'Ä' ),
    array( 'a', 'a', 'a', 'a', 'a', 'A', 'A', 'A', 'A' ),
    $string
  );

  $string = str_replace(
    array( 'é', 'è', 'ë', 'ê', 'É', 'È', 'Ê', 'Ë' ),
    array( 'e', 'e', 'e', 'e', 'E', 'E', 'E', 'E' ),
    $string
  );

  $string = str_replace(
    array( 'í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î' ),
    array( 'i', 'i', 'i', 'i', 'I', 'I', 'I', 'I' ),
    $string
  );

  $string = str_replace(
    array( 'ó', 'ò', 'ö', 'ô', 'Ó', 'Ò', 'Ö', 'Ô' ),
    array( 'o', 'o', 'o', 'o', 'O', 'O', 'O', 'O' ),
    $string
  );

  $string = str_replace(
    array( 'ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Û', 'Ü' ),
    array( 'u', 'u', 'u', 'u', 'U', 'U', 'U', 'U' ),
    $string
  );

  $string = str_replace(
    array( 'ñ', 'Ñ', 'ç', 'Ç' ),
    array( 'n', 'N', 'c', 'C', ),
    $string
  );


  return $string;
}


function sanear_string( $string ) {

  $string = trim( $string );

  $string = str_replace(
    array( 'á', 'à', 'ä', 'â', 'ª', 'Á', 'À', 'Â', 'Ä' ),
    array( 'a', 'a', 'a', 'a', 'a', 'A', 'A', 'A', 'A' ),
    $string
  );

  $string = str_replace(
    array( 'é', 'è', 'ë', 'ê', 'É', 'È', 'Ê', 'Ë' ),
    array( 'e', 'e', 'e', 'e', 'E', 'E', 'E', 'E' ),
    $string
  );

  $string = str_replace(
    array( 'í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î' ),
    array( 'i', 'i', 'i', 'i', 'I', 'I', 'I', 'I' ),
    $string
  );

  $string = str_replace(
    array( 'ó', 'ò', 'ö', 'ô', 'Ó', 'Ò', 'Ö', 'Ô' ),
    array( 'o', 'o', 'o', 'o', 'O', 'O', 'O', 'O' ),
    $string
  );

  $string = str_replace(
    array( 'ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Û', 'Ü' ),
    array( 'u', 'u', 'u', 'u', 'U', 'U', 'U', 'U' ),
    $string
  );

  $string = str_replace(
    array( 'ñ', 'Ñ', 'ç', 'Ç' ),
    array( 'n', 'N', 'c', 'C', ),
    $string
  );

  //Esta parte se encarga de eliminar cualquier caracter extraño
  return $string;
}

//DETECTA SI ES UNA FECHA 
function esFechaValida( $dato ) {
  // Intenta convertir el dato a un timestamp
  $timestamp = strtotime( $dato );

  // Si la conversión fue exitosa y el año es mayor a 1970 (para evitar fechas negativas),
  // entonces consideramos que es una fecha válida
  return ( $timestamp !== false && $timestamp > 0 );
}
//nuevas funciones de insersion sin procedures 

function insertWhidthReturnId( $fields, $table, $autoIncrementable ) {
  conectar();

  if ( $autoIncrementable ) {
    unset( $fields[ 'id' ] );
  }
  //unset($fields['id']);   // Elimina la clave 'op'
  unset( $fields[ 'op' ] ); // Elimina la clave 'op'
  unset( $fields[ 'link' ] ); // Elimina la clave 'link'
  if (isset($fields['tipoGasto'])) unset($fields['tipoGasto']);
  if (isset($fields['usuario'])) unset($fields['usuario']);
  // Construye la consulta de inserción
  /*$fieldNames = implode(', ', array_keys($fields));
    $fieldValues = implode(', ', array_fill(0, count($fields), '?'));
	//$params = array_values($fields);

    $insertQuery = "INSERT INTO $table ($fieldNames) VALUES ($fieldValues)";
	*/
  $fields = array_map(function($value) {
    return is_string($value) ? utf8_decode($value) : $value;
  }, $fields);
  // Construye la consulta de inserción
  $fieldNames = implode( ', ', array_map( function ( $field ) {
    return "$field";
  }, array_keys( $fields ) ) );

  $fieldValues = implode( ', ', array_map( function ( $value ) {
    // Escapa y encierra los valores de cadena en comillas simples
    return "'" . my_mssql_escape_string( $value ) . "'";
  }, $fields ) );

  $insertQuery = "INSERT INTO $table ($fieldNames) VALUES ($fieldValues)";

  $result = mssql_query( $insertQuery );

  if ( $result === false ) {
    die( "La consulta de inserción falló: " . $insertQuery );
  }

  if ( $autoIncrementable ) {
    // Obtiene el último ID insertado
    $sql = "SELECT @@IDENTITY as last_id";
    $query = mssql_query( $sql );

    if ( $query === false ) {
      die( "La consulta para obtener el último ID insertado falló: " . $sql );
    }
    $row = mssql_fetch_array( $query );
    $lastInsertId = $row[ 'last_id' ];
  } else {
    $lastInsertId = $fields[ "id" ];
  }


  return $lastInsertId;
}


function update( $tabla, $datos, $condicion ) {

  unset( $datos[ 'id' ] ); // Elimina la clave 'op'
  unset( $datos[ 'op' ] ); // Elimina la clave 'op'
  unset( $datos[ 'link' ] ); // Elimina la clave 'link'
  $sql = "UPDATE $tabla SET ";

  $updateColumns = array();
  $updateValues = array();

  foreach ( $datos as $campo => $valor ) {
    $updateColumns[] = "$campo = '$valor' ";
    $updateValues[] = $valor; // Utiliza &$valorCopia para pasar por referencia
  }
  // $updateValues = array_map(function(&$value) { return $value; }, $updateValues);
  $sql .= implode( ', ', $updateColumns );
  $sql .= " WHERE id = '$condicion'";

  // Preparar la consulta
  $stmt = mssql_query( $sql );

  if ( $stmt === false ) {
    die( 'No se puedo insertar el registro' );
  }
  return true; // Actualización exitosa
}


function generarId() {

  $cadenaUnica = uniqid();
  $idGenerado = substr( md5( $cadenaUnica ), 0, 10 );
  return $idGenerado;
}

function my_mssql_escape_string( $value ) {
  // Usa la función str_replace para escapar comillas simples
  $escaped = str_replace( "'", "''", $value );
  return $escaped;
}


?>