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
     $almacen = '';
	 $centro  = '';
	 $codigo  = $_POST['codigo'];
	 switch($_POST['oficina']){
	  case '1100':{$almacen="MT01"; $centro="MM01";}break;
	  case '1200':{$almacen="CA01"; $centro="MC01";}break;
	  case '2100':{$almacen="ME01"; $centro="RM01";}break;
	  case '2200':{$almacen="BT01"; $centro="RB01";}break;
	 }
     conectar();
     $sql = "select 
				m.CODIGO_MATERIAL,
				'".$centro."'  AS CENTRO,
				'".$almacen."' AS ALMACEN
				from t_materiales m 
				where 
				m.codigo_material='".$codigo."'";
				//echo $sql;
	 $p = GenerarArray($sql,'');
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
		//print_r($result);
		$cantidad = $result['MATERIALES']['CANTIDAD'];
	    echo number_format((int)$cantidad);
	}
    
?>