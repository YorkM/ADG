<?php
session_start();
require_once('funciones.php');
conectar();
switch($_POST["op"]){
   
   case "1":
             $sql="SELECT
			  			DISTINCT
			            T_ROLES.ID,
						T_ROLES.TITULO
					FROM
					T_ROLES
					INNER JOIN T_USUARIOS ON T_USUARIOS.ROLES_ID=T_ROLES.ID
					ORDER BY
					T_ROLES.TITULO
					
					";
			 $Query=GenerarArray($sql,"");
			 echo json_encode($Query);
   mssql_close();
   break;	
   case "2":
             $sql="SELECT ID,TITULO,FECHA_CREACION FROM T_ROLES ORDER BY TITULO";
		     $Query=GenerarArray($sql,"");
			 echo json_encode($Query);
   mssql_close();
   break;
   case "3":
            $dato=$_POST["dato"];
            $sql  ="SELECT T_ROLES.ID,T_ROLES.TITULO, CASE WHEN T_USUARIOS.LOGIN <>NULL THEN  T_USUARIOS.LOGIN+'('+NOMBRES+' '+APELLIDOS+')' ELSE 'N' END AS USUARIO 
			FROM T_ROLES LEFT JOIN T_USUARIOS ON T_USUARIOS.ROLES_ID=T_ROLES.ID  WHERE T_ROLES.ID=".$dato;
			$Query=GenerarArray($sql,"");
			echo json_encode($Query);
   mssql_close();
   break;
   case "4":
       $id  = 0;
	   $titulo=$_POST["titulo"];
	   $sp  = mssql_init('P_ROLES_I');
              mssql_bind($sp, '@TITULO', strtoupper(QuitarCaracter($titulo)) , SQLVARCHAR, false, false);   
			  mssql_bind($sp, '@USUARIOS_ID', $_SESSION["ses_Id"], SQLINT4, false, false);

			  mssql_bind($sp, '@ID', $id, SQLINT4, true, false);
			   
       $r   = mssql_execute($sp);
	   if($id>0){
		  echo $id; 
	   }else{
		   echo 0;
	   }
   mssql_close();
   break;
   case "5":
       $titulo= $_POST["titulo"];
	   $IdRol = $_POST["IdRol"];
   	   $sp  = mssql_init('P_ROLES_U');
	  		  mssql_bind($sp, '@ID',$IdRol , SQLINT4, false, false);
              mssql_bind($sp, '@TITULO', strtoupper(QuitarCaracter($titulo)) , SQLVARCHAR, false, false);   
			  mssql_bind($sp, '@USUARIOS_ID', $_SESSION["ses_Id"], SQLINT4, false, false);
       $r   = mssql_execute($sp);
	   echo $IdRol;
   mssql_close();
   break;
   case "6":
             $sql="SELECT ID,TITULO,FECHA_CREACION FROM T_ROLES ";
			 if(!empty($_POST["dato"])){
				 if($_POST["dato"]!=""){
					 $sql.="WHERE TITULO LIKE('%".$_POST["dato"]."%')";
				 }
			 }
		     $Query=GenerarArray($sql,"");
			 echo json_encode($Query);
   mssql_close();
   break;
   case "7":  
             $sql="SELECT TOP 1 ID FROM T_USUARIOS WHERE ROLES_ID= ".$_POST["IdRol"];
			 $Query=GenerarArray($sql,"");
			 
			 if(count($Query)==0){
			   	 $delete="DELETE FROM T_ROLES WHERE ID=".$_POST["IdRol"];
				 $q = mssql_query($delete);
				 if($q){
					 echo 1;
				 }else{
				     echo 0;
				 }
			 }else{
				    echo 2; 
			 }
   break;
   
}

?>