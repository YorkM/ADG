<?php
    //192.168.1.11	rpdsrv-rpd.distriroma.com
    //192.168.1.18	rpqsrv-rpq.distriroma.com
    //192.168.1.15	rppsrv-rpp.distriroma.com
    require_once '../lib/lib_nusoap/nusoap.php';
    require_once '../models/funciones.php';
    $username   = 'PISUPER';
    $password   = 'M4n4g3r17';
    $wsdlurl_dm = 'http://192.168.1.15:50000/dir/wsdl?p=ic/dd84b03c789d3e2b8f4d8f6353ce92f9';
    $client = new nusoap_client($wsdlurl_dm, 'wsdl');
    $client->setCredentials($username, $password, 'basic');
    $err = $client->getError();
    if ($err) {	echo 'Error en Constructor' . $err ; }
    //***********************PEDIDO TEMPORAL BASE DE DATOS MULTIROMA***********************************************************
     
     conectar();
	 $numero = 80501;
     $sp1    = mssql_init('P_PEDIDO_DET_WSDL_INVE');
               mssql_bind($sp1, '@NUMERO', $numero, SQLINT4, false, false);				   
     $r1     = mssql_execute($sp1);
     $p      = GenerarArray($r1,'SP');
	 //print_r($p);
    //*************************************************************************************************************************
    $parametrosCrea = array(
        'MATERIALES'=>$p
    );
    
    $parametros = array (
        'MTDisponibles'=>$parametrosCrea
    );
    
    $funcion = 'WSDisponibles';
    //Punto de salida de retorno sap
    $client->setEndpoint('http://192.168.1.15:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Integra&receiverParty=&receiverService=&interface=WSDisponibles&interfaceNamespace=urn%3Adfroma.com.co%3Aintegra%3Adisponibles');
    
    $result = $client->call($funcion, $parametros);
    
    $err2 = $client->getError();
    if ($err2){
      echo 'Error en Call' . $err2 ; 
    }else{
	  echo 'ok';
		//print_r($result);
		/*$datos = array();
		 foreach($result['MATERIALES'] as $valor) {
           $datos[]= array($valor['CODIGO_MATERIAL'] => (int)$valor['CANTIDAD']);
		 }
		 echo json_encode($datos);*/
	}
    
?>