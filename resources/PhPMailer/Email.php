<?php
//date_default_timezone_set('Etc/UTC');
require 'PHPMailer/PHPMailerAutoload.php';

define( 'HOST', 'smtp-legacy.office365.com' );
define( 'PORT', 587 );
define( 'USER', 'reportesweb@pwmultiroma.com' );
define( 'PASS', 'B!865393488132up' );

function EnviarMailReporte( $titulo, $msj, $remi, $dest, $archivo, $op ) {
  $mail = new PHPMailer;
  $mail->isSMTP();
  $mail->SMTPDebug = 2;
  $mail->Debugoutput = 'html';
  $mail->Host = HOST;
  $mail->Port = PORT;
  $mail->SMTPSecure = 'tls';
  $mail->SMTPAuth = true;
  $mail->Username = USER;
  $mail->Password = PASS;
  $mail->setFrom( USER, $remi );

  $user = split( ';', $dest );
  for ( $i = 0; $i <= count( $user ) - 1; $i++ ) {
    $mail->addAddress( $user[ $i ] );
  }
  if ( !isset( $archivo ) ) {
    $mail->AddAttachment( $archivo, 'ADJUNTO_WEB_' . date( "dMY" ) . '_' . date( "g" ) . ':' . date( "i" ) . ' ' . date( "a" ) . '.pdf' ); //AQUI ADJUNTO ARCHIVO
  }
  $mail->Subject = $titulo;
  $mail->CharSet = 'UTF-8'; 
  $mail->msgHTML( $msj );
  $envio = $mail->send();
  //echo 	($envio);
  if ( !$envio ) {
    echo "Mailer Error: " . $mail->ErrorInfo;
  } else {
    echo "Message sent!";
  }
}

function EnviarMail( $titulo, $msj, $remi, $dest, $archivo = "", $op = "" ) {
  $mail = new PHPMailer;
  $mail->isSMTP();
  $mail->SMTPDebug = 2;
  $mail->Debugoutput = 'html';
  $mail->Host = HOST;
  $mail->Port = PORT;
  $mail->SMTPSecure = 'tls';
  $mail->SMTPAuth = true;
  $mail->Username = USER;
  $mail->Password = PASS;
  $mail->setFrom( USER, $remi );
  //Fin Codigo
  $user = split( ';', $dest );
  for ( $i = 0; $i <= count( $user ) - 1; $i++ ) {
    $mail->addAddress( $user[ $i ] );
  }
  //if(is_dir($archivo)){
  $mail->AddAttachment( $archivo, 'ADJUNTO_WEB_' . date( "dMY" ) . '_' . date( "g" ) . ':' . date( "i" ) . ' ' . date( "a" ) . '.pdf' ); //AQUI ADJUNTO ARCHIVO
  //}
  $mail->Subject = $titulo;
  $mail->msgHTML( $msj );
  $mail->CharSet = 'UTF-8'; 
  $envio = $mail->send();
  $datos = '';
  if ( !$envio ) {
    $datos = array( 'Id' => '',
      'Tipo' => 'error',
      'Msj' => $mail->ErrorInfo );

  } else {
    $datos = array( 'Id' => '',
      'Tipo' => 'success',
      'Msj' => 'Mensaje enviado con éxito' );
  }
  echo json_encode( $datos );
}

function EnviarMailDIAN( $titulo, $msj, $remi, $dest, $archivo, $archivo2, $org ) {
  $mail = new PHPMailer;
  $mail->isSMTP();
  $mail->SMTPDebug = 2;
  $mail->Debugoutput = 'html';
  $mail->Host = HOST;
  $mail->Port = PORT;
  $mail->SMTPSecure = 'tls';
  $mail->SMTPAuth = true;
  $mail->Username = USER;
  $mail->Password = PASS;
  $mail->setFrom( USER, $remi );

  $user = split( ';', $dest );
  for ( $i = 0; $i <= count( $user ) - 1; $i++ ) {
    $mail->addAddress( $user[ $i ] );
  }
  $mail->AddAttachment( $archivo, 'ADJUNTO_PDF_' . date( "dMY" ) . '_' . date( "g" ) . ':' . date( "i" ) . ' ' . date( "a" ) . '.pdf' ); //AQUI ADJUNTO ARCHIVO
  $mail->AddAttachment( $archivo2, 'ADJUNTO_XML_' . date( "dMY" ) . '_' . date( "g" ) . ':' . date( "i" ) . ' ' . date( "a" ) . '.xml' ); //AQUI ADJUNTO ARCHIVO
  $mail->Subject = $titulo;
  $mail->msgHTML( $msj );
  $envio = $mail->send();
  if ( !$envio ) {
    echo "Mailer Error: " . $mail->ErrorInfo;
  } else {
    echo "Message sent!";
  }
}

function EnviarMailPQRS( $titulo, $msj, $remi, $dest, $archivo, $archivo2, $org ) {
  $mail = new PHPMailer;
  $mail->isSMTP();
  $mail->SMTPDebug = 2;
  $mail->Debugoutput = 'html';
  $mail->Host = HOST;
  $mail->Port = PORT;
  $mail->SMTPSecure = 'tls';
  $mail->SMTPAuth = true;
  $mail->Username = USER;
  $mail->Password = PASS;
  $mail->setFrom( USER, $remi );

  $user = split( ';', $dest );
  for ( $i = 0; $i <= count( $user ) - 1; $i++ ) {
    $mail->addAddress( $user[ $i ] );
  }
  $mail->AddAttachment( $archivo, 'ADJUNTO_' . date( "dMY" ) . '_' . date( "g" ) . ':' . date( "i" ) . ' ' . date( "a" ) . '.pdf' ); //AQUI ADJUNTO ARCHIVO
  $mail->AddAttachment( $archivo2, 'ADJUNTO_' . date( "dMY" ) . '_' . date( "g" ) . ':' . date( "i" ) . ' ' . date( "a" ) . '.pdf' ); //AQUI ADJUNTO ARCHIVO
  $mail->Subject = $titulo;
  $mail->msgHTML( $msj );
  $envio = $mail->send();
  if ( !$envio ) {
    echo "Mailer Error: " . $mail->ErrorInfo;
  } else {
    echo "Message sent!";
  }
}

function EnviarMailTercero( $titulo, $msj, $remi, $dest, $archivo, $nombre_archivo ) {
  $mail = new PHPMailer;
  $mail->isSMTP();
  $mail->SMTPDebug = 2;
  $mail->Debugoutput = 'html';
  $mail->Host = HOST;
  $mail->Port = PORT;
  $mail->SMTPSecure = 'tls';
  $mail->SMTPAuth = true;
  $mail->Username = USER;
  $mail->Password = PASS;
  $mail->setFrom( USER, $remi );

  $user = split( ';', $dest );
  for ( $i = 0; $i <= count( $user ) - 1; $i++ ) {
    $mail->addAddress( $user[ $i ] );
  }
  $mail->AddAttachment( $archivo, $nombre_archivo ); //AQUI ADJUNTO ARCHIVO
  $mail->Subject = $titulo;
  $mail->msgHTML( $msj );
  $envio = $mail->send();
  if ( !$envio ) {
    echo "Mailer Error: " . $mail->ErrorInfo;
  } else {
    echo "Message sent!";
  }
}

function EnviarMailInformeProveedores( $titulo, $msj, $remi, $dest, $archivo, $nombre_archivo, $archivo_d, $nombre_archivo_d ) {
  $mail = new PHPMailer;
  $mail->isSMTP();
  $mail->SMTPDebug = 2;
  $mail->Debugoutput = 'html';
  $mail->Host = HOST;
  $mail->Port = PORT;
  $mail->SMTPSecure = 'tls';
  $mail->SMTPAuth = true;
  $mail->Username = USER;
  $mail->Password = PASS;
  $mail->setFrom( USER, $remi );

  $user = split( ';', $dest );
  for ( $i = 0; $i <= count( $user ) - 1; $i++ ) {
    $mail->addAddress( $user[ $i ] );
  }
  $mail->AddAttachment( $archivo, $nombre_archivo ); 
  $mail->AddAttachment( $archivo_d, $nombre_archivo_d ); 
  //Set the subject line
  $mail->Subject = $titulo;
  $mail->msgHTML( $msj );
  $envio = $mail->send();
  if ( !$envio ) {
    echo "Mailer Error: " . $mail->ErrorInfo;
  } else {
    echo "Message sent!";
  }
}
?>