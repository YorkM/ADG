<?php
include('funciones.php');
session_start();
conectar();
switch($_POST['op']){
	case 'B_PEDIDOS':{
		$sp  = mssql_init('P_PEDIDOS_LOGISTICA_S');
			   mssql_bind($sp, '@FECHA_INI', mb_strtoupper(Formato_Fecha_M_D_A($_POST["fh_ini"]), "UTF-8"), SQLVARCHAR, false, false);	
			   mssql_bind($sp, '@FECHA_FIN', mb_strtoupper(Formato_Fecha_M_D_A($_POST["fh_fin"]), "UTF-8"), SQLVARCHAR, false, false);				
			   mssql_bind($sp, '@OFICINA',   mb_strtoupper($_POST["oficina"],"UTF-8"), SQLVARCHAR, false, false);			
			   mssql_bind($sp, '@ALMACEN',   mb_strtoupper($_POST["almacen"],"UTF-8"), SQLVARCHAR, false, false);					   		   
		$r   = mssql_execute($sp);
		echo json_encode(GenerarArray($r,'SP'));
		mssql_close();
	}break;
	case 'B_PEDIDOS_MULTIPICKING':{
		$sp  = mssql_init('P_PEDIDOS_LOGISTICA_S');
			   mssql_bind($sp, '@FECHA_INI', mb_strtoupper(Formato_Fecha_M_D_A($_POST["fh_ini"]), "UTF-8"), SQLVARCHAR, false, false);	
			   mssql_bind($sp, '@FECHA_FIN', mb_strtoupper(Formato_Fecha_M_D_A($_POST["fh_fin"]), "UTF-8"), SQLVARCHAR, false, false);				
			   mssql_bind($sp, '@OFICINA',   mb_strtoupper($_POST["oficina"],"UTF-8"), SQLVARCHAR, false, false);			
			   mssql_bind($sp, '@ALMACEN',   mb_strtoupper($_POST["almacen"],"UTF-8"), SQLVARCHAR, false, false);					   		   
		$r   = mssql_execute($sp);
		echo json_encode(GenerarArray($r,'SP'));
		mssql_close();
	}break;
	 case "P_PEDIDOS_REP_EMPAQUE_S":
		 $sp      = mssql_init('P_PEDIDOS_REP_EMPAQUE_S');			
		            mssql_bind($sp, '@OFICINA',   mb_strtoupper($_SESSION["ses_OfcVentas"],"UTF-8"), SQLVARCHAR, false, false);					   
		 $query   = mssql_execute($sp);
		 $datos=array();
		 while($row = mssql_fetch_assoc($query)){
			$datos[] = array(   
			                  'numero_factura'  =>$row['NUMERO_FACTURA'],
							  'horas'           =>$row['HORAS'],
							  'n_paquetes'      =>$row['N_PAQUETES'],
							  'n_cajas'         =>$row['N_CAJAS'],
							  'fecha_inicio'    =>$row['FECHA_INICIO'],
							  'usuario'         =>strtoupper(utf8_decode($row['USUARIO'])), 
							  'cliente'         =>strtoupper(utf8_decode($row['CLIENTE'])), 
							  'valor'           =>$row['VALOR'],
							  'login'         =>strtoupper(utf8_decode($row['LOGIN'])), 
                            );
			}
		echo json_encode($datos);	
		 
	 break;
}
?>