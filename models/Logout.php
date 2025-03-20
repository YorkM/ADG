<?php
include("funciones.php");
conectar();

session_name("ADGSESID");
session_start();
unset($_SESSION["ses_Login"]);
unset($_SESSION["ses_Id"]);
unset($_SESSION["ses_Email"]);
unset($_SESSION["ses_DepId"]);
unset($_SESSION["ses_CodSap"] );
unset($_SESSION["ses_RolesId"] );
unset($_SESSION["ses_NumOrg"]);
unset($_SESSION["ses_OfcVentas"]);
unset($_SESSION["ses_NitPro"] );
unset($_SESSION["ses_Usuario"]);
unset($_SESSION["ses_Ingreso"]);
unset($_SESSION["ses_Nit"]);
unset($_SESSION["ses_Id_Ses"]);
session_destroy();
echo "<script> window.location = '../views/Login.php'; </script>";

/*
if (!empty($_SERVER['HTTPS']) && ('on' == $_SERVER['HTTPS'])) {
	$uri = 'https://';
} else {
			$uri = 'http://';
		}
$uri .= $_SERVER['HTTP_HOST'];
$dir= explode("/",dirname($_SERVER['PHP_SELF']));
		
 header('Location: '.$uri."/".$dir[1] .'/views/Login.php'); 	 */
	//$Query="UPDATE T_USER_ACTIVE SET ESTADO='D' WHERE USUARIO_ID=".$_GET["id_get"];
	//$Sql  = mssql_query($Query);




?>