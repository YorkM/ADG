<?php
session_start();
set_time_limit(1000);
require_once('funciones.php');
conectar();
switch($_POST["op"]){

case "S_CUMPLIMIENTO_VENTA":
		
         $zona     = $_POST["zona"];
		 $mes      = $_POST["mes"];
		 $anio     = $_POST["anio"];
		 $Oficina  = $_POST["Oficina"];
         $op       = 0;
		
         if($Oficina=='0'){
			 if($_SESSION["ses_NumOrg"]==1000){
				 $Oficina="1100,1200";
			 }else{
				$Oficina="2100,2200,2300,2400";
			 }
		 }
		
		$SQLClasePedido = '';
		
		if($_POST['ClasePedido']!='T'){
		  $SQLClasePedido = " and f.clase = '".$_POST['ClasePedido']."'";	
		}
		
		
		if(date('m') == str_pad($mes, 2, "0", STR_PAD_LEFT))
		{
		   $hoy="GETDATE()";
		}
		else
		{
		   $hoy="EOMONTH('".$anio.str_pad($mes, 2, "0", STR_PAD_LEFT)."01')";
		}
		
		 $sql="SET DATEFIRST 1 
		        declare @FechaIni date = '".$anio.str_pad($mes, 2, "0", STR_PAD_LEFT)."01';
				declare @FechaIni2 date = '".$anio.str_pad($mes, 2, "0", STR_PAD_LEFT)."01';
				declare @FechaIni3 date = '".$anio.str_pad($mes, 2, "0", STR_PAD_LEFT)."01';
				declare @FechaFin date = EOMONTH('".$anio.str_pad($mes, 2, "0", STR_PAD_LEFT)."01') ;
				declare @Hoy date = ".$hoy.";
				declare @diashabiles float=0;
				declare @diashabileshoy float=0;
				declare @domingos float=0;
				WHILE @FechaIni <= @FechaFin
				BEGIN  
					
				if  datepart(dw, @FechaIni) not in (7) and datepart(dw, @FechaIni) = (6) and datepart(dd, @FechaIni) not in (select dia from T_FESTIVOS t where t.mes='".$mes."' and t.ano='".$anio."' )     SET @diashabiles=@diashabiles+0.5
				if  datepart(dw, @FechaIni) not in (6,7) and datepart(dd, @FechaIni) not in (select dia from T_FESTIVOS t where t.mes='".$mes."' and t.ano='".$anio."') SET @diashabiles=@diashabiles+1
					set @FechaIni=dateadd(dd,1,@FechaIni)
				END  
				WHILE @FechaIni2 <= @Hoy
				BEGIN  
				if  datepart(dw, @FechaIni2) not in (7) and datepart(dw, @FechaIni2) = (6) and datepart(dd, @FechaIni2) not in (select dia from T_FESTIVOS t where t.mes='".$mes."' and t.ano='".$anio."')     SET @diashabileshoy=@diashabileshoy+0.5
				if  datepart(dw, @FechaIni2) not in (6,7) and datepart(dd, @FechaIni2) not in (select dia from T_FESTIVOS t where t.mes='".$mes."' and t.ano='".$anio."')  SET @diashabileshoy=@diashabileshoy+1
					set @FechaIni2=dateadd(dd,1,@FechaIni2)
				END   

		
		select 
					----------------------cliente---------------------------- 
					isnull(t.bloqueo,0) as bloqueo, 
					o.organizacion_ventas, 
					o.oficina_ventas, 
					t.codigo_sap as codigo_sap_cliente, 
					isnull(o.zona_ventas,'') as zona_ventas,
					isnull(z.zona_descripcion,'') as zona_descripcion,
					t.nit, isnull(t.nombres,'NA') as nombres, 
					isnull(t.razon_comercial,'NA') as razon_comercial, 
					t.ciudad, 
					t.departamento, 
					----------------------vendedor--------------------------- 
					isnull(tv.codigo_sap,'-') as cod_sap_vendedor, 
					isnull(uv.codigo_sap,'-') as cod_web_vendedor, 
					isnull(tv.nombres,'NA') as vendedor, 
					case when isnull(tv.codigo_sap,0) <> isnull(uv.codigo_sap,0) then 'f' else 'v' end sinc_vend, 
					--------------------televendedor------------------------- 
					isnull(tt.nombres,'NA') as televendedor, 
					isnull(tt.codigo_sap,'-') as cod_sap_televendedor, 
					isnull(ut.codigo_sap,'-') as cod_web_televendedor, 
					case when isnull(tt.codigo_sap,0) <> isnull(ut.codigo_sap,0) then 'f' else 'v' end sinc_tele, 
					---------------------presupuesto------------------------- 
					isnull(p.valor_presupuesto,0) as valor_presupuesto, 
					isnull(p.id,0) as id_presupuesto, 
					--------------------cumplimiento-------------------------
					ejecutado = (
					
						 select 
						  isnull(sum(f.p_neto),0) 
						 from v_facturacion f 
						 where 
						  f.codigo_sap = t.codigo_sap and 
						  ------------f.tipo_factura like 'ZF%' and  
						  (f.tipo_factura like 'ZF%' or f.tipo_factura like 'ZN%') and  
						  f.organizacion_ventas = o.organizacion_ventas and 
						  year(f.fecha)  = ".$anio." and
						  month(f.fecha) = ".$mes." ".$SQLClasePedido."  
					
					),
					----------------historial de visitas----------------------
					vis_televendedor = isnull((select count(*) from t_visitas_vendedor pt where  
															   pt.id_usuario = ut.id and 
															   pt.codigo_sap_cli = t.codigo_sap and
															   year(pt.fecha_visita)  = ".$anio." and
															   month(pt.fecha_visita) = ".$mes."),0),
					vis_vendedor     = isnull((select count(*) from t_visitas_vendedor pv where
													   pv.id_usuario = uv.id               and 
													   pv.codigo_sap_cli = t.codigo_sap    and
													   year(pv.fecha_visita)  = ".$anio." and
													   month(pv.fecha_visita) = ".$mes."),0), 
					----------------historial de visitas contactadas----------------------
					vis_televendedor_c = isnull((select count(*) from t_visitas_vendedor pt where  
															   pt.id_usuario           = ut.id and 
															   pt.codigo_sap_cli       = t.codigo_sap and
															   year(pt.fecha_visita)   = ".$anio." and
															   month(pt.fecha_visita)  = ".$mes."  and
													           isnull(pt.estado_visita,'') = 'C'),0),
					vis_vendedor_c     = isnull((select count(*) from t_visitas_vendedor pv where
													   pv.id_usuario           = uv.id  and 
													   pv.codigo_sap_cli       = t.codigo_sap and
													   year(pv.fecha_visita)   = ".$anio." and
													   month(pv.fecha_visita)  = ".$mes." and
													   isnull(pv.estado_visita,'') = 'C'),0), 
				
					-----------------promedio de ventas-----------------------
					prom_venta_3mes = isnull(round((select sum(valor)
                                                from t_terceros_promedio_ventas p
                                                where p.codigo_sap = t.codigo_sap and
                                                      p.organizacion_ventas = o.organizacion_ventas and
                                                      p.promedio = 3),0),0),
					prom_venta_6mes = isnull(round((select sum(valor)
                                                from t_terceros_promedio_ventas p
                                                where p.codigo_sap = t.codigo_sap and
                                                      p.organizacion_ventas = o.organizacion_ventas and
                                                      p.promedio = 6 ),0),0)  ,
					-----------------promedio de ventas-----------------------								  				
					  z.t_aa, 
					  z.t_a, 
					  z.t_b, 
					  z.t_c, 
					  z.t_d, 
					  z.t_e, 
					  z.v_aa, 
					  z.v_a, 
					  z.v_b, 
					  z.v_c, 
					  z.v_d, 
					  z.v_e,
                      isnull(vv.objetivo_televentas,0) as objetivo_televentas,
                      isnull(vv.objetivo_ventas,0) as objetivo_ventas,
					  DiasLaborales = @diashabiles,
				      DiasLaboralesTranscurridos = @diashabileshoy,
					  isnull(o.grupo1,'-') as grupo1,
					  isnull(g1.descripcion,'-') as desc_grupo1,
					  isnull(o.grupo2,'-') as grupo2,
					  isnull(o.potencial,0) as potencial,
					  isnull(c.clasificacion,'E') as clasificacion,
					  isnull(c.participacion,0) as participacion
				from t_terceros t 
			inner join t_terceros_organizacion o WITH (NOLOCK)  on o.codigo_sap  = t.codigo_sap and o.canal_distribucion=10 
				--presupuesto
				left  join t_presupuesto p on p.codigo_sap_cliente = o.codigo_sap and 
											 --- p.codigo_sap_vendedor = o.codigo_vendedor and se cambia por la zona 2023-09-04
											  p.zona_ventas = o.zona_ventas and
											  p.mes  = ".$mes." and 
											  p.anio = ".$anio."
				--clasificacion 
				left join t_terceros_clasificacion c on c.codigo_sap  = o.codigo_sap and 
                                                        c.organizacion_ventas = o.organizacion_ventas and 
                                                        c.mes  = ".$mes." and 
											            c.anio = ".$anio."
				--vendedor
				left  join t_terceros tv WITH (NOLOCK)  on tv.codigo_sap = o.codigo_vendedor 
				left  join t_usuarios uv on uv.codigo_sap = tv.codigo_sap and uv.roles_id=14 and uv.estado = 'A'
				--televendedor
				left  join t_terceros tt WITH (NOLOCK) on tt.codigo_sap = o.codigo_televendedor
				left  join t_usuarios ut on ut.codigo_sap = tt.codigo_sap and ut.roles_id=12 and ut.estado = 'A'
				left  join t_zonas_ventas z on z.zona_ventas = o.zona_ventas
				--visitas objetivo
                left  join t_terceros_visitas_objetivo vv on vv.codigo_sap          = t.codigo_sap and 
                                                             vv.organizacion_ventas = o.organizacion_ventas and 
                                                             vv.canal_distribucion  = o.canal_distribucion and 
                                                             vv.oficina_ventas      = o.oficina_ventas
				--grupos
				left join t_terceros_grupos1 g1 on g1.grupo = o.grupo1
				where      ";
		if($Oficina==1000 || $Oficina==2000){
			$sql.="	o.organizacion_ventas ='".$Oficina."'"; 
		}else{
			$sql.="	o.oficina_ventas in(".$Oficina.")"; 
		}
		if($zona!='000000'){
		  $sql.=" and o.zona_ventas = '".$zona."'";
		}else{
			if($Oficina!='2000' && $Oficina!='1000'){
				 $sql.=" and substring(o.zona_ventas,1,2) = ".substr($Oficina,0,2)." 
				         and z.n_seg_v = 'S'";
			}
		 		
		}
	
		$res_sp= mssql_query($sql);
		$datos  = array();
		
		$t_total_pre=0;
		$t_total_eje=0;
		$t_total_t  =0;
		$t_total_v  =0;
		$total_trimestre  =0;
        $i = 0;
		
      while($row = mssql_fetch_assoc($res_sp)){
		 
		  
		$datos[] = array(   'n_filas'                    => $i,
		                    'codigo_sap'                 => $row['codigo_sap_cliente'],
							'nit'                        => $row['nit'],
							'nombres'                    => utf8_encode($row['nombres']),
							'razon_comercial'            => utf8_encode($row['razon_comercial']),
							'ciudad'                     => utf8_encode($row['ciudad']),
							'departamento'               => utf8_encode($row['departamento']),
							'organizacion_ventas'        => utf8_encode($row['organizacion_ventas']),
							'id_presupuesto'             => $row['id_presupuesto'],
							'valor_presupuesto'          => $row['valor_presupuesto'],
							'total_reg'                  => 0,
							'vis_televendedor'           => $row['vis_televendedor'],
							'vis_vendedor'               => $row['vis_vendedor'],
						    'vis_televendedor_c'         => $row['vis_televendedor_c'],
							'vis_vendedor_c'             => $row['vis_vendedor_c'],
							'vendedor'                   => utf8_encode($row['vendedor']),
							'televendedor'               => utf8_encode($row['televendedor']),
							'ejecutado'                  => $row['ejecutado'],
							't_total_pre'                => 0,
							't_total_eje'                => 0,
							't_total_t'                  => 0,
							't_total_v'                  => 0,
							'oficina_ventas'             => utf8_encode($row['oficina_ventas']),
							'prom_venta_3mes'            => ($row['prom_venta_3mes']),
							'prom_venta_6mes'            => ($row['prom_venta_6mes']),							
						    'zona_ventas'                => $row['zona_ventas'],
						    'zona_descripcion'           => utf8_encode($row['zona_descripcion']),
						    't_aa'                       => $row["t_aa"], 
							't_a'                        => $row["t_a"], 
							't_b'                        => $row["t_b"], 
							't_c'                        => $row["t_c"], 
							't_d'                        => $row["t_d"], 
							't_e'                        => $row["t_e"], 
							'v_aa'                       => $row["v_aa"], 
							'v_a'                        => $row["v_a"], 
							'v_b'                        => $row["v_b"], 
							'v_c'                        => $row["v_c"], 
							'v_d'                        => $row["v_d"], 
							'v_e'                        => $row["v_e"],
						    'objetivo_ventas'            => $row['objetivo_ventas'],
						    'objetivo_televentas'        => $row['objetivo_televentas'],
						    'DiasLaborales'              => number_format($row['DiasLaborales'],2),
						    'DiasLaboralesTranscurridos' => $row['DiasLaboralesTranscurridos'],
						    'grupo1'                     => $row['grupo1'],
						    'desc_grupo1'                => utf8_encode($row['desc_grupo1']),
						    'grupo2'                     => $row['grupo2'],			   
						    'potencial'                  => $row['potencial'],			   
						    'clasificacion'              => $row['clasificacion'],			   
						    'participacion'              => $row['participacion'],			   
						    'SQL'                        => $sql
		                 );
			$i++;
		}
		/*GRAFICO TOP 10 PRODUCTOS MAS VENDIDOS-----------------------------------------------------*/
        $sql_pastel ="select top 10
						  f.codigo_material,isnull(m.descripcion2,m.descripcion) as descripcion, f.cantidad, m.tipo_material
						from v_facturacion f 
						inner join t_materiales m on m.codigo_material = f.codigo_material
						where
						  (f.tipo_factura like 'ZF%' or f.tipo_factura like 'ZN%') and  
						  f.organizacion_ventas = '".$_SESSION['ses_NumOrg']."' and 
						  year(f.fecha)  = ".$anio." and
						  month(f.fecha) = ".$mes." and 
						  m.tipo_material not in( 'zfab') ";
		if($zona!='000000'){
		  $sql_pastel.=" and f.zona_ventas = '".$zona."'";
		}		
		$sql_pastel.="order by
						  f.cantidad desc"; 
		$res_pastel= GenerarArray($sql_pastel,"");
		/*----------------------------------------------------------------------------------------*/
		$sql_lab = "select top 5
					  substring(isnull(t.nombres,t.razon_comercial),0,30) as lab,
					  isnull(sum(f.p_neto),0) as total 
					from v_facturacion f 
					inner join t_materiales m on m.codigo_material = f.codigo_material
					inner join t_terceros t on t.codigo_sap = m.codigo_sap
					where
					  (f.tipo_factura like 'ZF%' or f.tipo_factura like 'ZN%') and  
					  f.organizacion_ventas = '".$_SESSION['ses_NumOrg']."' and 
					  year(f.fecha)  = ".$anio." and
					  month(f.fecha) = ".$mes." and 
					  m.tipo_material not in( 'zfab')";
		if($zona!='000000'){
		   $sql_lab.=" and f.zona_ventas = '".$zona."'";
		}		
		$sql_lab.="group by
					t.razon_comercial,
					t.nombres
				   order by
					isnull(sum(f.p_neto),0) desc";
	    $res_lab= GenerarArray($sql_lab,"");
		
		//--Presupuesto de venta por zona
		$sql_pres_zona = "select sum(p.valor_presupuesto) as valor_presupuesto
						from t_presupuesto_venta p
						inner join t_zonas_ventas z on p.zona_ventas = z.zona_ventas
						where p.mes = '".$mes."' and
							  p.anio = '".$anio."'
						";
		if($zona!='000000'){
		$sql_pres_zona.=" and p.zona_ventas = '".$zona."'";
		}else{
		if($Oficina!='2000' && $Oficina!='1000'){
			 $sql_pres_zona.=" and substring(p.zona_ventas,1,2) = ".substr($Oficina,0,2)." and  z.n_seg_v = 'S'";
		}

		}
		$res_pres_zona = GenerarArray($sql_pres_zona,"");
		
		//---Ventas por grupo de clientes
		/*$sql_venta_grupo = "select 
							  isnull(g.grupo,'S/A') as grupo,
							  sum(g.vlr_venta_trimestre) as vlr_venta_trimestre,
							  sum(g.vlr_venta_actual) as vlr_venta_actual,
							  count(*) as n_clientes
							from v_facturacion_grupos g 
							inner join t_zonas_ventas z on z.zona_ventas = g.zona_ventas
							where 
							  g.organizacion_ventas = '".$_SESSION['ses_NumOrg']."'";
		if($zona!='000000'){
		    $sql_venta_grupo.=" and g.zona_ventas = '".$zona."'";
		}else{
			if($Oficina!='2000' && $Oficina!='1000'){
				 $sql_venta_grupo.=" and substring(g.zona_ventas,1,2) = ".substr($Oficina,0,2)." and  z.n_seg_v = 'S'";
			}

		}				
		$sql_venta_grupo .= " group by
							  isnull(g.grupo,'S/A')";*/
		
		$sql_venta_grupo = " select 
								o.codigo_sap,
								o.organizacion_ventas,
								isnull(o.grupo1, 'S/A') as grupo,
								vlr_venta_actual = isnull(sum(f.p_neto), 0)
							  into #tmp
							  from t_terceros t
							  inner join t_terceros_organizacion o WITH (NOLOCK) on o.codigo_sap = t.codigo_sap and o.canal_distribucion = 10
							  inner join t_zonas_ventas z WITH (NOLOCK) on z.zona_ventas = o.zona_ventas
							  left  join v_facturacion f WITH (NOLOCK) on f.codigo_sap = t.codigo_sap and 
																		 (f.tipo_factura like 'ZF%' or f.tipo_factura like 'ZN%') and 
																		  f.organizacion_ventas = o.organizacion_ventas and 
																		  year (f.fecha) = ".$anio." and 
																		  month (f.fecha) = ".$mes."
							  where 
								o.organizacion_ventas = '".$_SESSION['ses_NumOrg']."' ";
							if($zona!='000000'){
								$sql_venta_grupo.=" and z.zona_ventas = '".$zona."'";
							}else{
								if($Oficina!='2000' && $Oficina!='1000'){
									$sql_venta_grupo.=" and substring(z.zona_ventas,1,2) = ".substr($Oficina,0,2)." and  z.n_seg_v = 'S'";
								}

							}				
	   $sql_venta_grupo .= "  group by 
								o.codigo_sap,
								o.organizacion_ventas,
								isnull(o.grupo1, 'S/A');

							  select 
								grupo,
								vlr_venta_actual = sum(vlr_venta_actual),
								vlr_venta_trimestre = isnull(sum(valor),0),
								count(*) as n_clientes
							  from #tmp t
							  left join v_terceros_promedio_ventas_org  p on p.codigo_sap = t.codigo_sap and
																		     p.organizacion_ventas = t.organizacion_ventas and
																		     p.promedio = 3
							  group by
								grupo";
		
		
		$resp_venta_grupo = GenerarArray($sql_venta_grupo,"");
		
		//---Ventas por tipo de clientes
		/*$sql_venta_tipo  = "select 
							  isnull(g.clasificacion,'S/A') as clasificacion,
							  sum(g.vlr_venta_trimestre) as vlr_venta_trimestre,
							  sum(g.vlr_venta_actual) as vlr_venta_actual,
							  count(*) as n_clientes
							from v_facturacion_grupos g 
							inner join t_zonas_ventas z on z.zona_ventas = g.zona_ventas
							where 
							  g.organizacion_ventas = '".$_SESSION['ses_NumOrg']."'";
		                   if($zona!='000000'){
								$sql_venta_tipo .= " and g.zona_ventas = '".$zona."'";
							}else{
								if($Oficina!='2000' && $Oficina!='1000'){
									 $sql_venta_tipo .= " and substring(g.zona_ventas,1,2) = ".substr($Oficina,0,2)." and  z.n_seg_v = 'S'";
								}

						   }	
							
		$sql_venta_tipo  .= " group by
							  isnull(g.clasificacion,'S/A') 
							 order by 
							  case
								  when isnull(g.clasificacion,'S/A') = 'AA' then 1 
								  else 2 
							  end,
							  isnull(g.clasificacion,'S/A')";*/
		$sql_venta_tipo  ="select 
								o.codigo_sap,
								o.organizacion_ventas,
							   isnull(c.clasificacion,'S/A') as clasificacion,
								vlr_venta_actual = isnull(sum(f.p_neto), 0)
							  into #tmp_c
							  from t_terceros t
							  inner join t_terceros_organizacion o WITH (NOLOCK) on o.codigo_sap = t.codigo_sap and o.canal_distribucion = 10
							  inner join t_zonas_ventas z WITH (NOLOCK) on z.zona_ventas = o.zona_ventas
							  left  join v_facturacion f WITH (NOLOCK) on f.codigo_sap = t.codigo_sap and 
																		 (f.tipo_factura like 'ZF%' or f.tipo_factura like 'ZN%') and 
																		  f.organizacion_ventas = o.organizacion_ventas and 
																		  year (f.fecha) = ".$anio." and 
																		  month (f.fecha) = ".$mes."
							  left join t_terceros_clasificacion   c WITH (NOLOCK) on c.anio = year(getdate()) and 
																					c.mes  = month(getdate()) and 
																					c.codigo_sap = o.codigo_sap and 
																					c.organizacion_ventas = o.organizacion_ventas 
							  where 
								o.organizacion_ventas = '".$_SESSION['ses_NumOrg']."' ";
							if($zona!='000000'){
								$sql_venta_tipo.=" and z.zona_ventas = '".$zona."'";
							}else{
								if($Oficina!='2000' && $Oficina!='1000'){
									$sql_venta_tipo.=" and substring(z.zona_ventas,1,2) = ".substr($Oficina,0,2)." and  z.n_seg_v = 'S'";
								}

							}				
	   $sql_venta_tipo .= "   group by 
								o.codigo_sap,
								o.organizacion_ventas,
								isnull(c.clasificacion,'S/A');

							  select 
								t.clasificacion,
								vlr_venta_actual = sum(t.vlr_venta_actual),
								vlr_venta_trimestre = isnull(sum(valor),0),
								count(*) as n_clientes
							  from #tmp_c t
							  left join v_terceros_promedio_ventas_org  p on p.codigo_sap = t.codigo_sap and
																		     p.organizacion_ventas = t.organizacion_ventas and
																		     p.promedio = 3
							  group by
								t.clasificacion
							  order by 
							  case
								  when isnull(t.clasificacion,'S/A') = 'AA' then 1 
								  else 2 
							  end,
							  isnull(t.clasificacion,'S/A')";
		$resp_venta_tipo = GenerarArray($sql_venta_tipo,"");
		mssql_close();
		/*----------------------------------------------------------------------------------------*/
		
		echo json_encode(array( 
			                'datos'               => $datos ,
			                'grafico_prod'        => $res_pastel,
			                'grafico_lab'         => $res_lab,
			                'presupuesto_zona'    => $res_pres_zona,
			                'venta_grupo'         => $resp_venta_grupo,
			                'venta_tipo'          => $resp_venta_tipo
		                 ));

  break;
}
//
?>