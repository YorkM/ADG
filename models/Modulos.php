<?php
session_start();
require_once('funciones.php');
conectar();
switch($_POST["op"]){
   
   case "1":
             $sql="SELECT
			            ID,
						DESCRIPCION,
						TITULO,
						NUMERO
					FROM
					T_MODULOS ORDER BY NUMERO ASC";
			 $Query=GenerarArray($sql,"");
			 echo json_encode($Query);
   mssql_close();
   break;	
  case "2":
             $sql="SELECT
			            MP.ID AS ID_MP,
						MP.PERMISOS_ID AS ID,
						P.TITULO,
						P.DESCRIPCION
						
						FROM T_MODULOS_PERMISOS MP
						INNER JOIN T_PERMISOS P ON P.ID=MP.PERMISOS_ID
						INNER JOIN T_MODULOS M ON M.ID=MP.MODULOS_ID 
						WHERE MP.MODULOS_ID=".$_POST["id"];
			 $Query=GenerarArray($sql,"");
			 echo json_encode($Query);
  mssql_close();
  break;
  case "3":
       $id  = 0;
	   $modulos_id=$_POST["modulos_id"];
	   $permisos_id=$_POST["permisos_id"];
	   $sp  = mssql_init('P_MODULOS_PERMISOS_I');
              mssql_bind($sp, '@MODULOS_ID', $modulos_id , SQLINT4, false, false);   
			  mssql_bind($sp, '@PERMISOS_ID', $permisos_id, SQLINT4, false, false);
			  mssql_bind($sp, '@ID', $id, SQLINT4, true, false);
			   
       $r   = mssql_execute($sp);
	   if($id>0){
		  echo $id; 
	   }else{
		   echo 0;
	   }
   mssql_close();      
  break;
  case "4":
             $sql="DELETE FROM T_MODULOS_PERMISOS WHERE ID=".$_POST["id"];
			 $q = mssql_query($sql);
			 if($q){
				 echo "1";
			 }else{
				   echo "0";
			    }
  break;	
}

?>