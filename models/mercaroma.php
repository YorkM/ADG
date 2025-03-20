<?php
session_start();
require_once('funciones.php');
conectar();
switch($_POST["op"]){
 case 1:
        $codigo_sap=$_POST["codigo_sap"];
		$comidas   =$_POST["comidas"];
		$refri     =$_POST["refri"];
		$oficina   =$_POST["oficina"];
		    $id  = 0;

	   $sp  = mssql_init('P_REG_MERCARROMA_I');
              mssql_bind($sp, '@CODIGO_SAP', trim($codigo_sap)   , SQLVARCHAR, false, false); 
			  mssql_bind($sp, '@COMIDAS'   , $comidas            , SQLINT4, false, false);
			  mssql_bind($sp, '@REFRI'     , $refri              , SQLINT4, false, false); 
			  mssql_bind($sp, '@OFICINA'   , trim($oficina)      , SQLVARCHAR, false, false);  
			  mssql_bind($sp, '@USUARIO_CREACION', $_SESSION["ses_Id"], SQLINT4, false, false);
			  mssql_bind($sp, '@ID', $id, SQLINT4, true, false);
			   
       $r   = mssql_execute($sp);
	   if($id>0){
		  echo $id; 
	   }else{
		   echo 0;
	   }
   mssql_close();
 break;
 case 2:
         $sql="

				SELECT
				T.CODIGO_SAP,
				T.NIT,
				ISNULL(T.NOMBRES,T.RAZON_COMERCIAL) AS CLIENTE,
				ISNULL(R.BOLETAS,0) AS BOLETAS,
				VENTAS_TOTAL=ISNULL((
				                 SELECT
								 SUM(P_NETO_IVA)
								 FROM V_FACTURACION V
								 WHERE
								     MONTH(V.FECHA_FIN)    in(6)
								 AND YEAR(V.FECHA_FIN)    =2019
								 AND DAY(V.FECHA_FIN)     IN(7)
								 AND V.CODIGO_SAP         =R.CODIGO_SAP
				),0)
				
				 FROM T_REG_MERCAROMA R
				 INNER JOIN T_TERCEROS T ON T.CODIGO_SAP=R.CODIGO_SAP  ";
				 if($_POST["cedula"]){
					 $sql.=" AND T.NIT='".$_POST["cedula"]."'";
				 }
		echo json_encode(GenerarArray($sql,""));
 break;
 case "3":
          $update="UPDATE T_REG_MERCAROMA SET BOLETAS=".$_POST["boletas"]."  WHERE CODIGO_SAP='".$_POST["cod"]."'";
		  $query = mssql_query($update);
			if($query){
				echo 1;
			}else{
			   echo 0;	
			}
 break;	
 case "listado":
           $codigo="";
		   $cod=$_POST["cod"];
		   
		   $sql="SELECT TOP 1
		           CODIGO_MATERIAL
				   FROM T_MATERIALES_EAN
				   WHERE EAN='".trim($cod)."'
				   ";
		    $query= mssql_query($sql);
			 while($row = mssql_fetch_assoc($query)){
				$codigo=$row["CODIGO_MATERIAL"]; 
			 }//W
			 
			 if($codigo==""){
				 $codigo=$cod;
			 }
			 //

	 $sprod = "select top 1
			  m.codigo_material,
			  m.descripcion,
			  m.valor_unitario,
			  m.iva,
			  m.descuento,

			  m.stock ,
			  cast(m.valor_neto as money) as valor_neto,
			  cast(m.valor_bruto as money) as valor_bruto,
			  m.bonificado,
			  m.desc_bonificado,
			  m.desc_bonificado_n,
			  m.stock_bonificado,
			  m.cant_bonificado,
			  m.cant_regular,
			  m.condicion_b,
			  m.stock_prepack
			from V_MATERIALES m 
			where
			m.tipo_material not in('ZFAB') and
			isnull(m.bloqueo_venta,0) = 0 and  
			isnull(m.anulada,0)       = 0 and
			m.oficina_ventas          = '2100'  and
			m.lista                   = '65' and 
			m.codigo_material not like '6000%' and 
			m.codigo_material not like '1100%' and ";
			$sprod.=" m.codigo_material='".$codigo."'";
			 $prod= mssql_query($sprod);
			 $datos=array();
			  while($p = mssql_fetch_assoc($prod)){
				 $datos[]=array(
								'codigo_material'=>$p["codigo_material"],
								'descripcion'    =>$p["descripcion"],
								'valor_unitario' =>$p["valor_unitario"],
								'iva'            =>$p["iva"],
								'valor_unitario' =>$p["valor_unitario"]				 
				               ); 
			  }
			  //
			  echo  json_encode($datos);
 break;
}
?>
