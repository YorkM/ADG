<?php
session_start();
require_once('funciones.php');
conectar();
switch($_POST["op"]){
   
    case "1":
		 $sql="SELECT
				CASE WHEN T_PERMISOS_ROLES.MODULOS_PERMISOS_ID IS NULL THEN 'N' ELSE 'S' END AS CHCK,
				T_PERMISOS.TITULO+'  ( '+T_PERMISOS.DESCRIPCION+' ) ' AS DESCRIPCION,
				T_MODULOS_PERMISOS.ID AS ID_MOD_PER,
				CASE WHEN T_PERMISOS_ROLES.MODULOS_PERMISOS_ID IS NULL THEN 0  ELSE T_PERMISOS_ROLES.MODULOS_PERMISOS_ID END MODULOS_PERMISOS_ID
				FROM
				T_MODULOS_PERMISOS
				INNER JOIN T_PERMISOS ON T_PERMISOS.ID=T_MODULOS_PERMISOS.PERMISOS_ID
				LEFT  JOIN T_PERMISOS_ROLES ON T_PERMISOS_ROLES.MODULOS_PERMISOS_ID=T_MODULOS_PERMISOS.ID AND T_PERMISOS_ROLES.ROLES_ID=".$_POST["RolesId"]."
				WHERE T_MODULOS_PERMISOS.MODULOS_ID=".$_POST["ModId"];
				
			//	echo $sql;
		 $Query=GenerarArray($sql,"");
		 echo json_encode($Query);
   mssql_close();
   break;	
   case "2":
             $IdRol   =$_POST["IdRol"];    //
			 $IdModPer=$_POST["IdModPer"]; //
	   $sp  = mssql_init('P_PERMISOS_ROLES_I');
              mssql_bind($sp, '@ROLES_ID', $IdRol , SQLINT4, false, false);   
			  mssql_bind($sp, '@MODULOS_PERMISOS_ID', $IdModPer, SQLINT4, false, false);
			   
       $r   = mssql_execute($sp);
	   echo $IdRol;
   mssql_close();	 
   break;
   case "3":
            $sql="SELECT
					   ID,
					   TITULO,
					   DESCRIPCION
					 FROM T_PERMISOS";
			 $Query=GenerarArray($sql,"");
			 echo json_encode($Query);
   mssql_close();
   break;
   case "4":
            $sql="DELETE FROM T_PERMISOS_ROLES WHERE ROLES_ID=".$_POST["IdRol"]." AND MODULOS_PERMISOS_ID=".$_POST["modulos_permisos_id"];
			$q = mssql_query($sql);
			echo $_POST["modulos_permisos_id"];
   mssql_close();
   break;
	
}

?>