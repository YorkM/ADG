<?php
session_start();
require_once 'tcpdf/tcpdf.php';
require_once '../../models/funciones.php';
class MYPDF extends TCPDF{
function Header2($nombre,$nit,$dir,$ciudad,$tel,$vendedor,$numero,$numero_sap,$org,$fechaPed,$tipo){
	    $fechaAct = date("Y-m-d");
		$this->setxy(10,10);
		$this->SetFont("","B",8);
		if($org == '1000'){
			$this->Image('../images/logo_cm.jpg',11,12,32);
			$this->ln(22);
			$this->SetFont("","B",7);
			$this->Cell(30,4,"Nit: 823.000.097-1",0,1,"C");
			$this->Cell(30,4,"Calle 29 #8-69 - Monteria - Cordoba",0,1,"C");
			$this->Cell(30,4,"PBX 7925055 - 7815778 - 7924218",0,1,"C");
			$this->Cell(30,4,"IVA REGIMEN COMUN",0,1,"C");
		}else if($org == '2000'){
			$this->Image('../images/logo_roma.jpg',11,12,32);
			$this->ln(22);
			$this->SetFont("","B",7);
			$this->Cell(30,4,"Nit: 890.901.475",0,1,"C");
			$this->Cell(30,4,"Cra 43G # 27-36 - Medellin - Antioquia",0,1,"C");
			$this->Cell(30,4,"PBX 2619491 - 2619490 - 2619494 ",0,1,"C");
			$this->Cell(30,4,"IVA REGIMEN COMUN",0,1,"C");
		}
$this->setxy(50,10);
if($tipo=='0'){
 $desc = 'PW TIPO COTIZACION VIGENTE SOLO POR HOY';
}else if($tipo=='1'){
 $desc = 'PEDIDO WEB(PW)';
}
$tbl = <<<EOD
			<table border="" cellpadding="1" cellspacing="2" nobr="true" width="251">
			<tr>
			  <th colspan="2" align="center" style="font-size: 10; font-family: bold;">$desc</th>
			</tr>
           <tr>
			  <td width="41" style="font-size: 7;">Cliente </td>
			  <td width="210" style="font-size: 7.5;">$nombre</td>
			</tr>
			<tr>
			  <td style="font-size: 6.5;">Nit </td>
			  <td style="font-size: 8;">$nit</td>
			</tr>
			<tr>
		      <td style="font-size: 7;">Direccion </td>
			  <td style="font-size: 7.5;">$dir</td>
			</tr>
			<tr>
			<td style="font-size: 7;">Ciudad </td>
			  <td style="font-size: 7.5;">$ciudad</td>
			</tr>
			<tr>
			  <td style="font-size: 7;">Telefono </td>
		 	  <td style="font-size: 7.5;">$tel</td>
			</tr>
			<tr>
			  <td style="font-size: 7;">Vendedor </td>
			  <td style="font-size: 7.5;">$vendedor</td>
			 </tr>
		  </table>
EOD;
$this->writeHTML($tbl, true, false, false, false, '');
$this->setxy(140,10);
$tbl2 = <<<EOD
			<table border="" cellpadding="1" cellspacing="2" nobr="true" width="212">
			 <tr>
				<th colspan="2" align="left" style="font-size: 10; font-family: bold;">N° Tmp</th>
			 </tr>
			 <tr>
			  <td colspan="2" width="160" style="font-size: 15; background-color:#C9C9C9" align="center">$numero</td>
			 </tr>
			 <tr>
				<th colspan="2" align="left" style="font-size: 10; font-family: bold;">N° SAP</th>
			 </tr>
			 <tr>
			  <td colspan="2" width="160" style="font-size: 15; background-color:#C9C9C9" align="center">$numero_sap</td>
			 </tr>
			 <tr>
			  <td style="font-size: 7;">Fecha Toma:</td>
			  <td style="font-size: 7.5;">$fechaPed</td>
			 </tr>
			 <tr>
			  <td style="font-size: 7;">Fecha Actual:</td>
			  <td style="font-size: 7.5;">$fechaAct</td>
			 </tr>
			</table>
EOD;
$this->writeHTML($tbl2, true, false, false, false, '');
}
function Footer(){
		$this->SetY(-15);
		$this->SetX(10);
		$this->SetFont('','B',7);
		$this->Cell(15,4,'Página  '.$this->getAliasNumPage().' de '.$this->getAliasNbPages(),0,0,'L');
}	
} 
$pdf = new MYPDF('P','mm','Legal');
$pdf->Open();
$pdf->AddPage();
conectar();
$pedido = $_GET['ped'];
$sql = "select
            p.numero,
			p.numero_sap,
			p.organizacion_ventas,
			case p.oficina_ventas
			  when '1100' then 'MONTERIA'
			  when '1200' then 'CARTAGENA'
			  when '2100' then 'MEDELLIN'
			  when '2200' then 'BOGOTA'
			end as bodega, 
			t.nit,
			t.nombres,
			t.razon_comercial,
			t.direccion,
			t.ciudad,
			isnull(t.telefono1+'-'+t.telefono2+'-'+t.telefono3,0) as telefonos,
			isnull(p.notas,'') as nota,
			p.valor_total,
			cast(p.fecha_pedido as date) as fecha_pedido,
			p.usuario,
            v.nombres as vendedor,
            isnull(t.email,'-') as email
		from t_pedidos_tmp p 
		inner join t_terceros t on t.codigo_sap = p.codigo_sap
		inner join t_terceros_organizacion o on o.codigo_sap = t.codigo_sap and o.organizacion_ventas = p.organizacion_ventas
		left  join t_terceros v on v.codigo_sap = o.codigo_vendedor
		where p.numero = '".$pedido."'";	
$dato   = mssql_fetch_array(mssql_query($sql));
mssql_close();

$pdf->Header2(utf8_encode(trim($dato['nombres'])),
             trim($dato['nit']),
			 utf8_encode(trim($dato['direccion'])),
			 utf8_encode(trim($dato['ciudad'])),
			 trim($dato['telefonos']),
			 utf8_encode(trim($dato['vendedor'])),
			 trim($dato['numero']),
			 trim($dato['numero_sap']),
			 trim($dato['organizacion_ventas']),
			 trim($dato['fecha_pedido']),0);
     $org    = '';
	 $slogan = '';
	 $asunto = '';
	 $mail_c = trim($dato['email']);	 
	 $mail   = $_SESSION["ses_Email"];
	 
	 if($dato['organizacion_ventas'] == '1000'){
	   $url    = 'www.multidrogas.com';
	   $slogan = 'CM de Colombia S.A.S el socio leal y estratégico del droguista colombiano';
	   $asunto = 'Pedidos WEB CM';
	   $para   = $mail_c.';'.$mail;
	   $titulo = utf8_decode($dato["usuario"])." - NUEVO PEDIDO ".$dato['numero_sap']." WEB CM PARA ".utf8_decode($dato['nombres']);
	 }else{
	   $url    = 'www.dfroma.com';
	   $slogan = 'Distribuidora farmaceutica ROMA S.A';
	   $asunto = 'Pedidos WEB ROMA';
	   $para   = $mail_c.';'.$mail;
	   $titulo = utf8_decode($dato["usuario"])." - NUEVO PEDIDO ".$dato['numero_sap']." WEB ROMA PARA ".utf8_decode($dato['nombres']);
	 }
	 
	 
	 $msg    = '<!doctype html>
					<head>
					<meta charset="utf-8">
					<title>Documento sin título</title>
					</head>
					<body>
					<table align="center" border="1" rules="cols">
					 <thead>
					  <tr><th colspan="2">REPORTE AUTOMÁTICO DE PEDIDOS WEB</th></tr>
					 </thead>
					 <tbody>
					  <tr><td colspan="2" align="center">Nuestro sistema ha detectado la generación de un nuevo pedido</td></tr>
					  <tr>
					   <td><b>Numero</b></td><td>'.$dato['numero_sap'].'</td>
					  </tr>
					  <tr>
					   <td><b>Bodega</b></td><td>'.$dato['bodega'].'</td>
					  </tr>
					  <tr>
					   <td><b>Nit</b></td><td>'.$dato['nit'].'</td>
					  </tr>
					  <tr>
					   <td><b>Cliente</b></td><td>'.utf8_decode($dato['nombres']).'</td>
					  </tr>
					  <tr>
					   <td><b>Ciudad</b></td><td>'.$dato['ciudad'].'</td>
					  </tr>
					  <tr>
					   <td><b>Valor</b></td><td>$'.number_format($dato['valor_total']).'</td>
					  </tr>
					  <tr>
					   <td><b>Notas</b></td><td>'.utf8_decode($dato['nota']).'</td>
					  </tr>
					 </tbody>
					 <tfoot>
					  <tr><td colspan="2" align="center">'.$slogan.'</td></tr>
					  <tr><td colspan="2" align="center">'.$url.'</td></tr>
					 </tfoot>
					</table>
					</body>
					</html>';
//-----DETALLE----------------------------------------------------------------------------------------------------------------------------------------------
$pdf->setxy(10,55);
		$tb = <<<EOD
		 <table border="1" cellpadding="1" cellspacing="0"  width="100%" nobr="true">
		   <thead>
			<tr align="center">
				<th style="font-size: 7;" width="45">Codigo</th>
				<th style="font-size: 7;" width="290">Descripcion</th>
				<th style="font-size: 7;" width="19">Cant</th>
				<th style="font-size: 7;" width="45">P. Unit</th>
				<th style="font-size: 7;" width="20">Dcto</th>
				<th style="font-size: 7;" width="50">P. Neto</th>
				<th style="font-size: 7;" width="20">IVA</th>
				<th style="font-size: 7;" width="50">Total</th>
			</tr>
		   </thead>
		   <tbody>
EOD;
//-----DETALLE SQL--------------------------------------------------------------------------------------------
conectar();
$sql = "select
			 d.codigo,
			 case 
			 when m.descripcion2 is null then case 
												 when isnull(b.codigo_material_n,0)<> '0' then b.descripcion
												 else m.descripcion
											   end
			 else case 
					 when isnull(b.codigo_material_n,0)<> '0' then b.descripcion
					 else m.descripcion2
				   end 
			 end as descripcion,
			 d.iva,
			 isnull(d.descuento,0) as descuento,
			 d.valor_unitario,
			 (round((d.valor_unitario)*(1+isnull(D.iva/100,0))*(1-isnull(d.descuento/100,0)),0)) as valor_neto,
			 round(((d.valor_unitario)*(1-isnull(d.descuento/100,0))*isnull(D.iva/100,0))*d.cantidad,0) as valor_iva,
			 d.cantidad,
			 case when m.tipo_material = 'ZKIT' then 0 else d.valor_total end as valor_total,
			 upper(p.notas) as notas
			 
			from t_pedidos_detalle_tmp d 
			inner join t_pedidos_tmp            p on p.numero = d.numero
			inner join t_materiales             m on m.codigo_material = d.codigo
			left  join t_materiales_bonificados b on b.codigo_material_v = d.codigo and 
													 cast(b.fecha_inicio as date) <= cast(getdate() as date) and 
													 cast(b.fecha_fin as date)    >= cast(getdate() as date) and
													 b.tipo = 'b' and
													 b.oficina_ventas = p.oficina_ventas and 
                                                     isnull(b.anulado,0) = 0 and b.canal_distribucion = p.canal_distribucion
			where 
			d.numero = '".$pedido."'";
$q = mssql_query($sql);
$items     = 0;
$unida     = 0;
$vlr_total = 0;
$vlr_unit  = 0;
$vlr_iva   = 0;
$notas     = '';
while($r = mssql_fetch_array($q)){
	        $items++;
			$unida       += (int)$r['cantidad'];
			$vlr_total   += (real)$r['valor_total'];
			$vlr_unit    += (real)$r['valor_unitario']*$r['cantidad'];
			$vlr_iva     += (real)$r['valor_iva'];
			$codigo       = $r['codigo'];
			$descripcion  = utf8_encode($r['descripcion']);
			$cantidad     = $r['cantidad'];
			$v_unitario   = number_format($r['valor_unitario']);
			$iva          = $r['iva'];
			$descuento    = $r['descuento'];
			$v_neto       = number_format($r['valor_neto']);
			$v_total      = number_format($r['valor_total']);
			$notas        = $r['notas'];
	$tb .= <<<EOD
			<tr align="center">
				<td style="font-size: 7; border-right: 1px solid #000; border-left: 1px solid #000;" width="45">$codigo</td>
				<td style="font-size: 7; border-right: 1px solid #000; border-left: 1px solid #000;" width="290" align="left">$descripcion</td>
				<td style="font-size: 7; border-right: 1px solid #000; border-left: 1px solid #000;" width="19">$cantidad</td>
				<td style="text-align:right; font-size: 7; border-right: 1px solid #000; border-left: 1px solid #000;" width="45">$$v_unitario</td>
				<td style="font-size: 7; border-right: 1px solid #000; border-left: 1px solid #000;" width="20">$descuento</td>
				<td style="text-align:right; font-size: 7; border-right: 1px solid #000; border-left: 1px solid #000;" width="50">$$v_neto</td>
				<td style="font-size: 7; border-right: 1px solid #000; border-left: 1px solid #000;" width="20">$iva</td>
				<td style="text-align:right; font-size: 7; border-right: 1px solid #000; border-left: 1px solid #000;" width="50">$$v_total</td>
			</tr>
EOD;
}
$vlr_unit  = number_format($vlr_total-$vlr_iva);
$vlr_total = number_format($vlr_total);

$vlr_iva   = number_format($vlr_iva);
$tb .=<<<EOD
   </tbody>
  </table>
  <table border="0" cellpadding="1" cellspacing="0"  width="100%">
	 <thead>
	    <tr>
		 <td>&nbsp;</td>
		</tr>
		<tr>
		 <td width="330"style="font-size: 6; border-bottom:1px solid #000;"></td>
		 <td width="30" style="font-size: 6; border-top:1px solid #000;border-bottom:1px solid #000; border-right: 1px solid #000; border-left: 1px solid #000;">N° ITEM</td>
		 <td width="20" style="font-size: 6; border-top:1px solid #000;border-bottom:1px solid #000; border-right: 1px solid #000; border-left: 1px solid #000;">$items</td>
		 <td width="40" style="font-size: 6; border-top:1px solid #000;border-bottom:1px solid #000; border-right: 1px solid #000; border-left: 1px solid #000;">TOT UNIT.</td>
		 <td width="20" style="font-size: 6; border-top:1px solid #000;border-bottom:1px solid #000; border-right: 1px solid #000; border-left: 1px solid #000;">$unida</td>
		 <td width="50" style="background-color:#C9C9C9;font-size: 6; border-top:1px solid #000;border-bottom:1px solid #000; border-right: 1px solid #000; border-left: 1px solid #000;"> SUBTOTAL</td>
		 <td width="50" align="rigth" style="font-size: 6; border-top:1px solid #000;border-bottom:1px solid #000; border-right: 1px solid #000; border-left: 1px solid #000;">$$vlr_unit</td>
		</tr>
		<tr>
		 <td rowspan="3" width="440" style="font-size: 6; border-bottom:1px solid #000; border-left: 1px solid #000;">$notas</td>
		 <td width="50" style="background-color:#C9C9C9;font-size: 6; border-top:1px solid #000;border-bottom:1px solid #000; border-right: 1px solid #000; border-left: 1px solid #000;"> VLR IVA</td>
		 <td width="50" align="rigth" style="font-size: 6; border-top:1px solid #000;border-bottom:1px solid #000; border-right: 1px solid #000; border-left: 1px solid #000;">$vlr_iva</td>
		</tr>
		<tr>
		 
		 <td width="50" style="background-color:#C9C9C9;font-size: 6; border-top:1px solid #000;border-bottom:1px solid #000; border-right: 1px solid #000; border-left: 1px solid #000;"> TOTAL</td>
		 <td width="50" align="rigth" style="font-size: 6; border-top:1px solid #000;border-bottom:1px solid #000; border-right: 1px solid #000; border-left: 1px solid #000;">$$vlr_total</td>
		</tr>
	  </thead>
  </table>
EOD;
$pdf->writeHTML($tb, true, false, false, false, '');
$archivo = __DIR__.'/PDF_Pedidos/'.$_GET['ped'].date('Ymd His').'.pdf';
if($_GET['tipo']=='P'){
  require_once('../../resources/PhPMailer/Email.php');
  $pdf->Output($archivo,'F');
  EnviarMail($titulo,$msg,$asunto,$para,$archivo,1);
  unlink($archivo);
}else{
  $pdf->Output($archivo);
  
} 

?>