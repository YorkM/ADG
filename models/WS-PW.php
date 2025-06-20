<?php
//192.168.1.11	rpdsrv-rpd.distriroma.com
//192.168.1.18	rpqsrv-rpq.distriroma.com
//192.168.1.15	rppsrv-rpp.distriroma.com
require_once '../lib/lib_nusoap/nusoap.php';
require_once '../models/funciones.php';
$username = 'PISUPER';
$password = 'M4n4g3r17';
$ip = 'http://192.168.1.15:50000';
$numero = $_POST[ 'numero' ];
$numeroSAP = $_POST[ 'numeroSAP' ];
session_start();
conectar();
switch ( $_POST[ 'op' ] ) {
  case 'NUEVO':
    {
      //DATOS DE ACCESO A WS
      $wsdlurl_dm = $ip . '/dir/wsdl?p=ic/6203880c2fcf304291aec126359c2cb0';
      $EndPoint = $ip . '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Integra&receiverParty=&receiverService=&interface=WSCreacion_Pedido_Out&interfaceNamespace=urn%3Adfroma.com.co%3Aintegra%3Apedidos';
      $client = new nusoap_client( $wsdlurl_dm, 'wsdl' );
      $client->setCredentials( $username, $password, 'basic' );
      $err = $client->getError();
      if ( $err ) {
        echo 'Error en Constructor' . $err;
      }
      //PEDIDO TEMPORAL BASE DE DATOS MULTIROMA
      //ENCABEZADO
      $opcion = 1;
      $sp1 = mssql_init( 'P_PEDIDO_ENC_WSDL_S_NEW' );
      mssql_bind( $sp1, '@NUMERO', $numero, SQLINT4, false, false );
      mssql_bind( $sp1, '@OPCION', $opcion, SQLINT4, false, false );
      $r1 = mssql_execute( $sp1 );
      $parametrosCab = GenerarArraySimple( $r1, 'SP' );
      mssql_free_statement( $sp1 );
      //DETALLE
      $sp2 = mssql_init( 'P_PEDIDO_DET_WSDL_S_NEW' );
      mssql_bind( $sp2, '@NUMERO', $numero, SQLINT4, false, false );
      mssql_bind( $sp2, '@OPCION', $opcion, SQLINT4, false, false );
      $r2 = mssql_execute( $sp2 );
      // $parametrosDet = GenerarArray($r2,'SP');

      /*NUEVO CODIGO PARA DESCUENTOS DESDE ADG******/
      $datos = array();
      while ( $row = mssql_fetch_array( $r2 ) ) {
        $datos[] = array( 'MATERIAL' => $row[ 'MATERIAL' ],
          'CENTRO' => $row[ 'CENTRO' ],
          'ALMACEN' => $row[ 'ALMACEN' ],
          'CANTIDAD' => $row[ 'CANTIDAD' ],
          'PRECIO' => $row[ 'PRECIO' ],
          'DTO' => $row[ 'DTO' ],
          'ORDEN' => $row[ 'ORDEN' ],
          'CONDICIONES' => array( 'CLASE' => $row[ 'CLASE' ],
            'VALOR' => $row[ 'VALOR' ] ) );
      }
      $parametrosDet = $datos;
      /*FIN DE NUEVO CODIGO DE DESCUENTOS PARA ADG*/
      mssql_free_statement( $sp2 );
      //***************************************
      $parametrosCrea = array(
        'Cabecera_Pedido' => $parametrosCab,
        'Detalles_Pedido' => $parametrosDet
      );
      $parametros = array(
        'MTCreacion_Pedido' => $parametrosCrea
      );
        
      
      $funcion = 'WSCreacion_Pedido_Out';
      //Punto de salida de retorno sap
      $client->setEndpoint( $EndPoint );
      $result = $client->call( $funcion, $parametros );
      $err2 = $client->getError();
      if ( $err2 ) {
        //echo 'Error en Call' . $err2 ; 
        $datos = array( 'Tipo' => 'E',
          'Msj' => $err2,
          'Num' => 0 );
        echo json_encode( $datos );
        GuardarLog( $numero, 'PED', utf8_decode( $_SESSION[ "ses_Login" ] ), 'CREACION', utf8_decode( strtoupper( $err2 ) ) );
      } else {
        if ( trim( $result[ 'NumeroPedido' ] ) > 0 ) {
          $sql = "UPDATE T_PEDIDOS_TMP SET 
						           TRANSFERIDO = 1, 
								   NUMERO_SAP='" . trim( $result[ 'NumeroPedido' ] ) . "' 
								 WHERE NUMERO=" . $numero;
          mssql_query( $sql );
        }

        $datos = '';
        $numPedSAP = trim( $result[ 'NumeroPedido' ] );
        $Array = ArrayRespuesta( $result );
        for ( $i = 0; $i < count( $Array ); $i++ ) {
          $Tipo = $Array[ 0 ][ 'TipoM' ];
          $Msj = utf8_encode( trim( $Array[ 0 ][ 'TextoM' ] ) );
          $datos = array( 'Tipo' => $Tipo,
            'Msj' => $Msj,
            'Num' => $numPedSAP );
          GuardarLog( $numero, 'PED', utf8_decode( $_SESSION[ "ses_Login" ] ), 'CREACION', utf8_decode( strtoupper( $Msj ) ) );
        }
        echo json_encode( $datos );

      }
    }
    break;
  case 'ELIMINAR':
      $wsdlurl_dm = $ip . '/dir/wsdl?p=ic/f8f78b5f277f3762989d960ebec896fa';
      $EndPoint = $ip . '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Integra&receiverParty=&receiverService=&interface=WSActualizacion_Pedido_Out&interfaceNamespace=urn:dfroma.com.co:integra:pedidos';
      $client = new nusoap_client( $wsdlurl_dm, 'wsdl' );
      $client->setCredentials( $username, $password, 'basic' );
      $err = $client->getError();

      if ( $err ) echo 'Error en Constructor' . $err;

      $parametrosCrea = array('Cabecera_Pedido' => array( 'NUMERO_PEDIDO' => $numero ),);
      $parametros = array('MTEliminacion_Pedido' => $parametrosCrea);
      $funcion = 'Eliminacion_Pedido_Out';
      $client->setEndpoint( $EndPoint );
      $result = $client->call( $funcion, $parametros );
      $err2 = $client->getError();

      if ( $err2 ) {
        $datos = array( 'Tipo' => 'E', 'Msj' => $err2 );
        echo json_encode( $datos );
        GuardarLog( $numero, 'PED', utf8_decode( $_SESSION[ "ses_Login" ] ), 'ELIMINACION', utf8_decode( strtoupper( $err2 ) ) );
      } else {
        $datos = '';
        for ( $i = 0; $i < count( $result ); $i++ ) {
          $Tipo = $result[ 'Mensajes' ][ 'TipoM' ];
          $Msj = utf8_encode( trim( $result[ 'Mensajes' ][ 'TextoM' ] ) );
          $datos = array( 'Tipo' => $Tipo, 'Msj' => $Msj );
          GuardarLog( $numero, 'PED', utf8_decode( $_SESSION[ "ses_Login" ] ), 'ELIMINACION', utf8_decode( strtoupper( $Msj ) ) );
        }
        echo json_encode( $datos );
      }
      break;
  case 'MODIFICAR':
    {
      //DATOS DE ACCESO A WS
      $wsdlurl_dm = $ip . '/dir/wsdl?p=ic/f8f78b5f277f3762989d960ebec896fa';
      $EndPoint = $ip . '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Integra&receiverParty=&receiverService=&interface=WSActualizacion_Pedido_Out&interfaceNamespace=urn:dfroma.com.co:integra:pedidos';
      $client = new nusoap_client( $wsdlurl_dm, 'wsdl' );
      $client->setCredentials( $username, $password, 'basic' );
      $err = $client->getError();
      if ( $err ) {
        echo 'Error en Constructor' . $err;
      }
      //PEDIDO TEMPORAL BASE DE DATOS MULTIROMA
      //ENCABEZADO
      $opcion = 2;

      $sp1 = mssql_init( 'P_PEDIDO_ENC_WSDL_S_NEW' );
      mssql_bind( $sp1, '@NUMERO', $numeroSAP, SQLINT4, false, false );
      mssql_bind( $sp1, '@OPCION', $opcion, SQLINT4, false, false );
      $r1 = mssql_execute( $sp1 );
      $parametrosCab = GenerarArraySimple( $r1, 'SP' );
      mssql_free_statement( $sp1 );
      //DETALLE
      $sp2 = mssql_init( 'P_PEDIDO_DET_WSDL_S_NEW' );
      mssql_bind( $sp2, '@NUMERO', $numeroSAP, SQLINT4, false, false );
      mssql_bind( $sp2, '@OPCION', $opcion, SQLINT4, false, false );
      $r2 = mssql_execute( $sp2 );
      $parametrosDet = GenerarArray( $r2, 'SP' );
      mssql_free_statement( $sp2 );
      //***************************************
      $parametrosCrea = array(
        'Cabecera_Pedido' => $parametrosCab,
        'Detalles_Pedido' => $parametrosDet
      );
      $parametros = array(
        'MTModificacion_Pedido' => $parametrosCrea
      );
      $funcion = 'Modificacion_Pedido_Out';
      //Punto de salida de retorno sap
      $client->setEndpoint( $EndPoint );
      $result = $client->call( $funcion, $parametros );
      $err2 = $client->getError();
      if ( $err2 ) {
        //echo 'Error en Call' . $err2 ;
        $datos = array( 'Tipo' => 'E',
          'Msj' => $err2 );
        GuardarLog( $numeroSAP, 'PED', utf8_decode( $_SESSION[ "ses_Login" ] ), 'MODIFICACION', utf8_decode( strtoupper( $err2 ) ) );
        echo json_encode( $datos );
      } else {
        //print_r($result);
        $datos = '';
        $Array = ArrayRespuesta( $result );
        for ( $i = 0; $i < count( $Array ); $i++ ) {
          $Tipo = $Array[ 0 ][ 'TipoM' ];
          $Msj = utf8_encode( trim( $Array[ 0 ][ 'TextoM' ] ) );
          $datos = array( 'Tipo' => $Tipo,
            'Msj' => $Msj );
          GuardarLog( $numeroSAP, 'PED', utf8_decode( $_SESSION[ "ses_Login" ] ), 'MODIFICACION', utf8_decode( strtoupper( $Msj ) ) );
        }
        echo json_encode( $datos );
      }

    }
    break;
  case 'CREA_ENTREGAS':
    {
      //DATOS DE ACCESO A WS
      $wsdlurl_dm = $ip . '/dir/wsdl?p=ic/7e7a66fce750345e816d55c0281c0b2a';
      $EndPoint = $ip . '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Integra&receiverParty=&receiverService=&interface=WSCreacion_Entrega_Out&interfaceNamespace=urn:dfroma.com.co:integra:entregas';
      $client = new nusoap_client( $wsdlurl_dm, 'wsdl' );
      $client->setCredentials( $username, $password, 'basic' );
      $err = $client->getError();
      if ( $err ) {
        echo 'Error en Constructor' . $err;
      }

      //---------------------------------
      $entrega = $_POST[ 'numero' ];
      $parametrosCab = array(
        'NumeroPedido' => $entrega
      );
      $parametrosCrea = array(
        'Cabecera' => $parametrosCab
      );
      $parametros = array(
        'MTCreacionEntrega' => $parametrosCrea
      );
      $funcion = 'WSCreacion_Entrega_Out';
      //Punto de salida de retorno sap
      $client->setEndpoint( $EndPoint );
      $result = $client->call( $funcion, $parametros );
      $err2 = $client->getError();
      if ( $err2 ) {
        //echo 'Error en Call' . $err2 ; 
        $datos = array( 'Tipo' => 'E',
          'Msj' => $err2 );
        GuardarLog( $entrega, 'ENT', utf8_decode( $_SESSION[ "ses_Login" ] ), 'CREACION', utf8_decode( strtoupper( $err2 ) ) );
        echo json_encode( $datos );
      } else {
        $datos = '';
        $Array = ArrayRespuesta( $result );
        for ( $i = 0; $i < count( $Array ); $i++ ) {
          $Tipo = $Array[ 0 ][ 'TipoM' ];
          $Msj = utf8_encode( trim( $Array[ 0 ][ 'TextoM' ] ) );
          $datos = array( 'Tipo' => $Tipo,
            'Msj' => $Msj );
          GuardarLog( $entrega, 'ENT', utf8_decode( $_SESSION[ "ses_Login" ] ), 'CREACION', utf8_decode( strtoupper( $Msj ) ) );
        }
        echo json_encode( $datos );
      }
    }
    break;
  case 'ELIMINA_ENTREGAS':
    {
      $wsdlurl_dm = $ip . '/dir/wsdl?p=ic/3dc0efa0f1793eda8194d83de1291c1b';
      $EndPoint = $ip . '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Integra&receiverParty=&receiverService=&interface=WSActualizacion_Entrega_Out&interfaceNamespace=urn:dfroma.com.co:integra:entregas';
      $client = new nusoap_client( $wsdlurl_dm, 'wsdl' );
      $client->setCredentials( $username, $password, 'basic' );
      $err = $client->getError();
      if ( $err ) {
        echo 'Error en Constructor' . $err;
      }

      //---------------------------------
      $entrega = $_POST[ 'numero' ];
      $parametrosCab = array(
        'NumeroEntrega' => $entrega
      );
      $parametrosCrea = array(
        'Cabecera' => $parametrosCab
      );
      $parametros = array(
        'MTEliminacionEntrega' => $parametrosCrea
      );
      $funcion = 'Eliminacion_Entrega_Out';
      //Punto de salida de retorno sap
      $client->setEndpoint( $EndPoint );
      $result = $client->call( $funcion, $parametros );
      $err2 = $client->getError();
      if ( $err2 ) {
        //echo 'Error en Call' . $err2 ; 
        $datos = array( 'Tipo' => 'E',
          'Msj' => $err2 );
        GuardarLog( $entrega, 'ENT', utf8_decode( $_SESSION[ "ses_Login" ] ), 'ELIMINACION', utf8_decode( strtoupper( $err2 ) ) );
        echo json_encode( $datos );
      } else {
        $datos = '';
        $Array = ArrayRespuesta( $result );
        for ( $i = 0; $i < count( $Array ); $i++ ) {
          $Tipo = $Array[ 0 ][ 'TipoM' ];
          $Msj = utf8_encode( trim( $Array[ 0 ][ 'TextoM' ] ) );
          $datos = array( 'Tipo' => $Tipo,
            'Msj' => $Msj );
          GuardarLog( $entrega, 'ENT', utf8_decode( $_SESSION[ "ses_Login" ] ), 'ELIMINACION', utf8_decode( strtoupper( $Msj ) ) );
        }
        echo json_encode( $datos );
      }
    }
    break;
  case 'MODIFICA_ENTREGAS':
    {
      $wsdlurl_dm = $ip . '/dir/wsdl?p=ic/3dc0efa0f1793eda8194d83de1291c1b';
      $EndPoint = $ip . '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Integra&receiverParty=&receiverService=&interface=WSActualizacion_Entrega_Out&interfaceNamespace=urn:dfroma.com.co:integra:entregas';
      $client = new nusoap_client( $wsdlurl_dm, 'wsdl' );
      $client->setCredentials( $username, $password, 'basic' );
      $err = $client->getError();
      if ( $err ) {
        echo 'Error en Constructor' . $err;
      }

      //---------------------------------
      $entrega = $_POST[ 'entrega' ];
      $detalle = json_decode( $_POST[ "detalle" ], true );

      $parametrosCrea = array(
        'Cabecera' => array( 'NumeroEntrega' => $entrega ),
        'Detalles' => $detalle
      );
      $parametros = array(
        'MTModificacionEntrega' => $parametrosCrea
      );
      //print_r($parametrosCrea);
      $funcion = 'Modificacion_Entrega_Out';
      //Punto de salida de retorno sap
      $client->setEndpoint( $EndPoint );
      $result = $client->call( $funcion, $parametros );
      $err2 = $client->getError();
      if ( $err2 ) {
        //echo 'Error en Call' . $err2 ; 
        $datos = array( 'Tipo' => 'E',
          'Msj' => $err2 );
        GuardarLog( $entrega, 'ENT', utf8_decode( $_SESSION[ "ses_Login" ] ), 'MODIFICACION', utf8_decode( strtoupper( $err2 ) ) );
        echo json_encode( $datos );
      } else {
        $datos = '';
        $Array = ArrayRespuesta( $result );
        for ( $i = 0; $i < count( $Array ); $i++ ) {
          $Tipo = $Array[ 0 ][ 'TipoM' ];
          $Msj = utf8_encode( trim( $Array[ 0 ][ 'TextoM' ] ) );
          $datos = array( 'Tipo' => $Tipo,
            'Msj' => $Msj );
          GuardarLog( $entrega, 'ENT', utf8_decode( $_SESSION[ "ses_Login" ] ), 'MODIFICACION', utf8_decode( strtoupper( $Msj ) ) );
        }
        echo json_encode( $datos );
      }

    }
    break;
  case 'UNIFICA_ENTREGAS':
    {
      $sql = "select
						 p.numero          as NumeroPedido,
						 d.posicion        as PosicionPedido,
						 d.codigo_material as Material,
						 d.cantidad        as Cantidad
						from t_pedidos_detalle d 
						inner join t_pedidos p on p.numero = d.numero and isnull(p.anulado,0) = 0
						left  join t_entregas_detalle t on t.numero_pedido = d.numero and isnull(t.anulado,0) = 0
						where 
						 t.numero is null and 
						 d.cantidad > 0   and 
						 d.numero in(" . trim( $_POST[ 'numeros' ], ',' ) . ")";
      $parametrosDet = GenerarArray( $sql, '' );
      //-------------------------------------------------------
      $wsdlurl_dm = $ip . '/dir/wsdl?p=ic/7e7a66fce750345e816d55c0281c0b2a';
      $EndPoint = $ip . '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Integra&receiverParty=&receiverService=&interface=WSCreacion_Entrega_Out&interfaceNamespace=urn:dfroma.com.co:integra:entregas';
      $client = new nusoap_client( $wsdlurl_dm, 'wsdl' );
      $client->setCredentials( $username, $password, 'basic' );
      $err = $client->getError();
      if ( $err ) {
        echo 'Error en Constructor' . $err;
      }
      //--------------------------------------------------------			
      $parametrosCrea = array(
        'Cabecera' => array( "NumeroPedido" => "",
          "FechaEntrega" => "" ),
        'Detalles' => $parametrosDet
      );
      $parametros = array(
        'MTCreacionEntrega' => $parametrosCrea
      );
      $funcion = 'WSCreacion_Entrega_Out';
      //print_r($parametros);
      //Punto de salida de retorno sap
      $client->setEndpoint( $EndPoint );
      $result = $client->call( $funcion, $parametros );
      $err2 = $client->getError();
      if ( $err2 ) {
        //echo 'Error en Call' . $err2 ; 
        $datos = array( 'Tipo' => 'E',
          'Msj' => $err2 );
        echo json_encode( $datos );
      } else {
        $datos = '';
        $Array = ArrayRespuesta( $result );
        for ( $i = 0; $i < count( $Array ); $i++ ) {
          $Tipo = $Array[ 0 ][ 'TipoM' ];
          $Msj = utf8_encode( trim( $Array[ 0 ][ 'TextoM' ] ) );
          $datos = array( 'Tipo' => $Tipo,
            'Msj' => $Msj );
        }
        echo json_encode( $datos );
      }
    }
    break;
  case 'CREA_ORDENES':
    {
      //DATOS DE ACCESO A WS
      $wsdlurl_dm = $ip . '/dir/wsdl?p=ic/91cace8aee8d349e8acde1443ab21608';
      $EndPoint = $ip . '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Integra&receiverParty=&receiverService=&interface=WSCreacion_OrdenT_Out&interfaceNamespace=urn:dfroma.com.co:integra:ordenest';
      $client = new nusoap_client( $wsdlurl_dm, 'wsdl' );
      $client->setCredentials( $username, $password, 'basic' );
      $err = $client->getError();
      if ( $err ) {
        echo 'Error en Constructor' . $err;
      }

      //---------------------------------
      $entrega = $_POST[ 'entrega' ];
      $almacen = $_POST[ 'almacen' ];
      $parametrosCrea = array(
        'NumeroAlmacen' => $almacen,
        'NumeroEntrega' => $entrega
        //'Confirmar'=>'x', por si se requiere confirmar sin escanear
      );
      $parametros = array(
        'MTCreacionOT' => $parametrosCrea
      );
      $funcion = 'WSCreacion_OrdenT_Out';
      //Punto de salida de retorno sap
      $client->setEndpoint( $EndPoint );
      $result = $client->call( $funcion, $parametros );
      $err2 = $client->getError();
      if ( $err2 ) {
        //echo 'Error en Call' . $err2 ; 
        $datos = array( 'Tipo' => 'E',
          'Msj' => $err2 );
        GuardarLog( $entrega, 'OT', utf8_decode( $_SESSION[ "ses_Login" ] ), 'CREACION', utf8_decode( strtoupper( $err2 ) ) );
        echo json_encode( $datos );
      } else {
        $datos = '';
        $Array = ArrayRespuesta( $result );
        for ( $i = 0; $i < count( $Array ); $i++ ) {
          $Tipo = $Array[ 0 ][ 'TipoM' ];
          $Msj = utf8_encode( trim( $Array[ 0 ][ 'TextoM' ] ) );
          $datos = array( 'Tipo' => $Tipo,
            'Msj' => $Msj );
          GuardarLog( $entrega, 'OT', utf8_decode( $_SESSION[ "ses_Login" ] ), 'CREACION', utf8_decode( strtoupper( $Msj ) ) );
        }
        echo json_encode( $datos );
      }
    }
    break;
  case 'ELIMINA_OT':
    {
      $wsdlurl_dm = $ip . '/dir/wsdl?p=ic/ac365d6bc81e350b94336db98aa833ac';
      $EndPoint = $ip . '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Integra&receiverParty=&receiverService=&interface=WSActualizacion_OrdenT_Out&interfaceNamespace=urn:dfroma.com.co:integra:ordenest';
      $client = new nusoap_client( $wsdlurl_dm, 'wsdl' );
      $client->setCredentials( $username, $password, 'basic' );
      $err = $client->getError();
      if ( $err ) {
        echo 'Error en Constructor' . $err;
      }

      //---------------------------------
      $ot = $_POST[ 'ot' ];
      $alm = $_POST[ 'alm' ];
      $parametrosCab = array(
        'NumeroOT' => $ot,
        'NumeroAlmacen' => $alm
      );
      $parametrosCrea = array(
        'Cabecera' => $parametrosCab
      );
      $parametros = array(
        'MTEliminacionOT' => $parametrosCrea
      );
      $funcion = 'WSEliminacion_OrdenT_Out';
      //Punto de salida de retorno sap
      $client->setEndpoint( $EndPoint );
      $result = $client->call( $funcion, $parametros );
      $err2 = $client->getError();
      if ( $err2 ) {
        //echo 'Error en Call' . $err2 ; 
        $datos = array( 'Tipo' => 'E',
          'Msj' => $err2 );
        GuardarLog( $ot, 'OT', utf8_decode( $_SESSION[ "ses_Login" ] ), 'ELIMINACION', utf8_decode( strtoupper( $err2 ) ) );
        echo json_encode( $datos );
      } else {
        $datos = '';
        $Array = ArrayRespuesta( $result );
        for ( $i = 0; $i < count( $Array ); $i++ ) {
          $Tipo = $Array[ 0 ][ 'TipoM' ];
          $Msj = utf8_encode( trim( $Array[ 0 ][ 'TextoM' ] ) );
          $datos = array( 'Tipo' => $Tipo,
            'Msj' => $Msj );
          GuardarLog( $ot, 'OT', utf8_decode( $_SESSION[ "ses_Login" ] ), 'ELIMINACION', utf8_decode( strtoupper( $Msj ) ) );
        }
        echo json_encode( $datos );
      }
    }
    break;
  case 'CONFIRMACION_OT':
    {
      $wsdlurl_dm = $ip . '/dir/wsdl?p=ic/f006756cd3013ce68a69f4c5c453e35a';
      $EndPoint = $ip . '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Integra&receiverParty=&receiverService=&interface=WSConfirmacion_OrdenT_Out&interfaceNamespace=urn:dfroma.com.co:integra:ordenest';
      $client = new nusoap_client( $wsdlurl_dm, 'wsdl' );
      $client->setCredentials( $username, $password, 'basic' );
      $err = $client->getError();
      if ( $err ) {
        echo 'Error en Constructor' . $err;
      }
      $numero = $_POST[ 'orden' ];
      $almacen = $_POST[ 'almacen' ];
      //ENCABEZADO
      $parametrosCab = array(
        'NUMERO_ORDEN' => $numero,
        'ALMACEN' => $almacen
      );
      //DETALLE
      $r = mssql_query( "SELECT  
						 T.ALMACEN,
						 T.POSICION_OT,
						 T.CODIGO_MATERIAL AS MATERIAL,  
						 SUM(ISNULL(T.CANTIDAD,0)) AS CANTIDAD 
						FROM T_SEPARACION_OT_DETALLE  T
						WHERE
						  ISNULL(T.ANULADO,0) = 0 AND
						  T.NUMERO_OT = '" . $numero . "' AND  T.ALMACEN = '" . $almacen . "'
						GROUP BY
						  T.CODIGO_MATERIAL,
						  T.POSICION_OT,
						  T.ALMACEN" );
      $datos = array();
      while ( $row = mssql_fetch_array( $r ) ) {
        $datos[] = array(
          'POSICION' => $row[ 'POSICION_OT' ],
          'MATERIAL' => $row[ 'MATERIAL' ],
          'CANTIDAD' => $row[ 'CANTIDAD' ] );
      }
      $parametrosDet[] = $datos;
		
      $parametrosCrea = array(
        'Cabecera' => $parametrosCab,
        'Detalles' => $parametrosDet
      );
      $parametros = array(
        'MTConfirmacionOT' => $parametrosCrea
      );

      $funcion = 'WSConfirmacion_OrdenT_Out';
      $client->setEndpoint( $EndPoint );
      $result = $client->call( $funcion, $parametros );
      $err2 = $client->getError();

      if ( $err2 ) {
        $datos = array();
        $datos[] = array( 'Tipo' => 'E',
          'Msj' => utf8_encode( $err2 ) );
      } else {
        $datos = '';
        unset( $result[ 'NumeroOT' ] );
        $Array = ArrayRespuesta( $result );
        for ( $i = 0; $i < count( $Array ); $i++ ) {
          $Tipo = $Array[ 0 ][ 'TipoM' ];
          $Msj = utf8_encode( trim( $Array[ 0 ][ 'TextoM' ] ) );
          $datos = array( 'Tipo' => $Tipo,
            'Msj' => $Msj );
          GuardarLog( $numero, 'OT', utf8_decode( $_SESSION[ "ses_Login" ] ), 'CONFIRMACION', utf8_decode( strtoupper( $Msj ) ) );
        }
        echo json_encode( $datos );
      }

    }
    break;
}

?>