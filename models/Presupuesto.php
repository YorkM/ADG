<?php
session_start();
set_time_limit( 600 );
require_once( 'funciones.php' );
conectar();
switch ( $_POST[ "op" ] ) {
  // lista los vendedores
  case "s_ListVend":
    $id = $_POST[ "id" ];
    $RolId = $_POST[ "RolId" ];
    $Org = trim( $_POST[ "Org" ] );
    $Oficina = trim( $_POST[ "Ofi" ] );
    //print_r($_POST);
    $sp = mssql_init( 'P_CARGAR_VENDEDORES_S' );
    mssql_bind( $sp, '@ORGANIZACION_VENTAS', $Org, SQLVARCHAR, false, false );
    mssql_bind( $sp, '@OFICINA_VENTAS', $Oficina, SQLVARCHAR, false, false );
    mssql_bind( $sp, '@ID_ROL', $RolId, SQLINT4, false, false );
    mssql_bind( $sp, '@ID', $id, SQLINT4, false, false );

    $res_sp = mssql_execute( $sp );
    $datos = array();
    while ( $row = mssql_fetch_array( $res_sp ) ) {
      $datos[] = array( 'id_user' => $row[ 'id_user' ],
        'codigo_sap' => trim( $row[ 'codigo_sap' ] ),
        'nombres' => utf8_encode( $row[ 'nombres' ] )
      );

    }
    echo json_encode( $datos );
    mssql_close();

    break;
    //Condiciones de pago
  case 's_condiciones_pago':
    {
      $sql = "select c.condicion,c.descuento,c.dias from t_condiciones_pago c order by condicion asc";
      $Query = GenerarArray( $sql, "" );
      echo json_encode( $Query );
    }
    break;
    // lista los clientes para asginar presupuesto
  case "s_ListaClientes":
    //$codSap   = $_POST["cod_sap"];
    $codZona = $_POST[ "cod_zona" ];
    $org = $_SESSION[ 'ses_NumOrg' ];
    $mes = $_POST[ "mes" ];
    $anio = $_POST[ "anio" ];
    $pag = $_POST[ "pag" ];
    $SizePge = 20;
    $cont = 0;


    $sp = mssql_init( 'P_PRESUPUESTO_S' );
    mssql_bind( $sp, '@PageSize', $SizePge, SQLINT4, false, false );
    mssql_bind( $sp, '@PageNumber', $pag, SQLINT4, false, false );
    mssql_bind( $sp, '@CodZona', $codZona, SQLVARCHAR, false, false );
    mssql_bind( $sp, '@ano', $anio, SQLINT4, false, false );
    mssql_bind( $sp, '@mes', $mes, SQLINT4, false, false );
    mssql_bind( $sp, '@org', $org, SQLVARCHAR, false, false );
    $res_sp = mssql_execute( $sp );
    $datos = array();
    while ( $row = mssql_fetch_array( $res_sp ) ) {
      $datos[] = array( 'n_filas' => $row[ 'n_filas' ],
        'codigo_sap_cliente' => $row[ 'codigo_sap_cliente' ],
        'nit' => $row[ 'nit' ],
        'nombres' => utf8_encode( $row[ 'nombres' ] ),
        'razon_comercial' => utf8_encode( $row[ 'razon_comercial' ] ),
        'ciudad' => utf8_encode( $row[ 'ciudad' ] ),
        'departamento' => utf8_encode( $row[ 'departamento' ] ),
        'organizacion_ventas' => $row[ 'organizacion_ventas' ],
        'id_presupuesto' => $row[ 'id_presupuesto' ],
        'valor_presupuesto' => $row[ 'valor_presupuesto' ],
        'total_reg' => $row[ 'total_reg' ],
        'nota' => ( $row[ 'nota' ] ),
        'valor_total' => $row[ 'valor_total' ],
        'codigo_vendedor' => $row[ 'codigo_vendedor' ],
        'zona_ventas' => $row[ 'zona_ventas' ],
        'clasificacion' => $row[ 'clasificacion' ]
      );

    }
    echo json_encode( $datos );
    mssql_close();
    break;
  case "I_presupuesto":

    $id = 0;

    $codigo_sap_vendedor = $_POST[ "codigo_sap_vendedor" ];
    $codigo_sap_cliente = $_POST[ "codigo_sap_cliente" ];
    $mes = $_POST[ "mes" ];
    $anio = $_POST[ "anio" ];
    $usuario_id = $_POST[ "usuario_id" ];
    $valor_presupuesto = $_POST[ "presupuesto" ];
    $organizacion = $_POST[ "organizacion" ];
    $nota = $_POST[ "nota" ];
    $zona_ventas = $_POST[ "zona_ventas" ];
    $sp = mssql_init( 'P_PRESUPUESTO_I' );
    mssql_bind( $sp, '@CODIGO_SAP_VENDEDOR', strtoupper( QuitarCaracter( $codigo_sap_vendedor ) ), SQLVARCHAR, false, false );
    mssql_bind( $sp, '@CODIGO_SAP_CLIENTE', strtoupper( QuitarCaracter( $codigo_sap_cliente ) ), SQLVARCHAR, false, false );
    mssql_bind( $sp, '@MES', $mes, SQLINT4, false, false );
    mssql_bind( $sp, '@ANIO', $anio, SQLINT4, false, false );
    mssql_bind( $sp, '@VALOR_PRESUPUESTO', $valor_presupuesto, SQLINT4, false, false );
    mssql_bind( $sp, '@USUARIO_ID', $usuario_id, SQLINT4, false, false );
    mssql_bind( $sp, '@ORGANIZACION_VENTAS', strtoupper( QuitarCaracter( $organizacion ) ), SQLVARCHAR, false, false );
    mssql_bind( $sp, '@NOTA', strtoupper( QuitarCaracter( $nota ) ), SQLVARCHAR, false, false );
    mssql_bind( $sp, '@ZONA_VENTAS', strtoupper( QuitarCaracter( $zona_ventas ) ), SQLVARCHAR, false, false );
    mssql_bind( $sp, '@ID', $id, SQLINT4, true, false );

    $r = mssql_execute( $sp );
    if ( $id > 0 ) {
      echo $id;
    } else {
      echo 0;
    }
    mssql_close();
    break;
  case "U_presupuesto":
    $id_det = $_POST[ "id_det" ];
    $codigo_sap_vendedor = $_POST[ "codigo_sap_vendedor" ];
    $codigo_sap_cliente = $_POST[ "codigo_sap_cliente" ];
    $mes = $_POST[ "mes" ];
    $anio = $_POST[ "anio" ];
    $usuario_id = $_POST[ "usuario_id" ];
    $valor_presupuesto = $_POST[ "presupuesto" ];
    $organizacion = $_POST[ "organizacion" ];
    $zona_ventas = $_POST[ "zona_ventas" ];
    $nota = $_POST[ "nota" ];
    $sp = mssql_init( 'P_PRESUPUESTO_U' );
    mssql_bind( $sp, '@ID', $id_det, SQLINT4, false, false );
    mssql_bind( $sp, '@CODIGO_SAP_VENDEDOR', strtoupper( QuitarCaracter( $codigo_sap_vendedor ) ), SQLVARCHAR, false, false );
    mssql_bind( $sp, '@CODIGO_SAP_CLIENTE', strtoupper( QuitarCaracter( $codigo_sap_cliente ) ), SQLVARCHAR, false, false );
    mssql_bind( $sp, '@MES', $mes, SQLINT4, false, false );
    mssql_bind( $sp, '@ANIO', $anio, SQLINT4, false, false );
    mssql_bind( $sp, '@VALOR_PRESUPUESTO', $valor_presupuesto, SQLINT4, false, false );
    mssql_bind( $sp, '@USUARIO_ID', $usuario_id, SQLINT4, false, false );
    mssql_bind( $sp, '@ORGANIZACION_VENTAS', strtoupper( QuitarCaracter( $organizacion ) ), SQLVARCHAR, false, false );
    mssql_bind( $sp, '@NOTA', strtoupper( QuitarCaracter( $nota ) ), SQLVARCHAR, false, false );
    mssql_bind( $sp, '@ZONA_VENTAS', strtoupper( QuitarCaracter( $zona_ventas ) ), SQLVARCHAR, false, false );
    $r = mssql_execute( $sp );
    echo $id_det;
    mssql_close();
    break;
  case "l_date":
    echo date( "m" ) . "%&" . date( "Y" );
    break;
  case "D_presupuesto":
    $id_det = $_POST[ "id_det" ]; //id del id_detalle
    $sp = mssql_init( 'P_PRESUPUESTO_D' );
    mssql_bind( $sp, '@ID', $id_det, SQLINT4, false, false );
    $r = mssql_execute( $sp );
    if ( $r ) {
      echo $id_det;
    }
    break;
  case "s_cumplimiento_presupuesto":
    $ofc = substr( trim( $_POST[ "oficina" ] ), 0, 2 );
    $org = $_POST[ "org" ];
    $rol = $_POST[ "rol" ];
    $id = $_POST[ "codSap" ];
    if ( $ofc == "10" ) {
      $ofc = '11,12';
    } else if ( $ofc == "20" ) {
      $ofc = '21,22,23,24';

    }
    $mes = $_POST[ "mes" ];
    $anio = $_POST[ "anio" ];
    $fhini = $_POST[ "fhIni" ];
    $fhfin = $_POST[ "fhFin" ];
    $cond = $_POST[ "cond" ];

    $sp = mssql_init( 'ZP_ASIGNACION_PRESUPUESTO_SN' );
    mssql_bind( $sp, '@ofc', $ofc, SQLVARCHAR, false, false );
    mssql_bind( $sp, '@ano', $anio, SQLINT4, false, false );
    mssql_bind( $sp, '@mes', $mes, SQLINT4, false, false );
    mssql_bind( $sp, '@fhini', $fhini, SQLVARCHAR, false, false );
    mssql_bind( $sp, '@fhfin', $fhfin, SQLVARCHAR, false, false );
    mssql_bind( $sp, '@cond', $cond, SQLINT4, false, false );
    $r = mssql_execute( $sp );
    echo json_encode( GenerarArray( $r, 'SP' ) );

    //	print_r($_POST);
    mssql_close();
    //echo $ofc;


    break;
  case "Validar_fecha_actual":
    $m = $_POST[ "m" ];
    $a = $_POST[ "a" ];
    //
    if ( trim( $m ) == date( "m" ) && trim( $a ) == date( "Y" ) && date( "d" ) <= 2 ) {
      echo "1";
    } else {
      echo "0";
    }

    break;
  case "I_asg_presupuesto":
    $id = 0;
    $zona = $_POST[ "zona" ];
    $mes = $_POST[ "mes" ];
    $anio = $_POST[ "anio" ];
    $valor = $_POST[ "valor" ];
    $org = $_POST[ "org" ];
    $sp = mssql_init( 'ZP_ASIGNACION_PRESUPUESTO_I' );
    mssql_bind( $sp, '@ZONA_VENTAS', $zona, SQLVARCHAR, false, false );
    mssql_bind( $sp, '@MES', $mes, SQLINT4, false, false );
    mssql_bind( $sp, '@ANIO', $anio, SQLINT4, false, false );
    mssql_bind( $sp, '@VALOR_PRESUPUESTO', $valor, SQLINT4, false, false );
    mssql_bind( $sp, '@ORGANIZACION_VENTAS', $org, SQLVARCHAR, false, false );
    mssql_bind( $sp, '@ID', $id, SQLINT4, true, false );
    $r = mssql_execute( $sp );
    if ( $id > 0 ) {
      echo $id;
    } else {
      echo 0;
    }
    mssql_close();
    break;
  case "U_asg_presupuesto":
    // print_r($_POST);
    $id_det = $_POST[ "id_det" ];
    $cod_ven = $_POST[ "cod_ven" ];
    $mes = $_POST[ "mes" ];
    $anio = $_POST[ "anio" ];
    $usu_id = $_POST[ "usu_id" ];
    $asignado = $_POST[ "asignado" ];
    $organizacion = $_POST[ "organizacion" ];
    $sp = mssql_init( 'P_ASIGNACION_PRESUPUESTO_U' );
    mssql_bind( $sp, '@ID', $id_det, SQLINT4, false, false );
    mssql_bind( $sp, '@CODIGO_SAP_VENDEDOR', strtoupper( QuitarCaracter( $cod_ven ) ), SQLVARCHAR, false, false );
    mssql_bind( $sp, '@MES', $mes, SQLINT4, false, false );
    mssql_bind( $sp, '@ANIO', $anio, SQLINT4, false, false );
    mssql_bind( $sp, '@PRESUPUESTO_ASIGNADO', $asignado, SQLINT4, false, false );
    mssql_bind( $sp, '@USUARIO_ID', $usu_id, SQLINT4, false, false );
    mssql_bind( $sp, '@ORGANIZACION_VENTAS', strtoupper( QuitarCaracter( $organizacion ) ), SQLVARCHAR, false, false );
    $r = mssql_execute( $sp );
    echo $id_det;
    mssql_close();


    break;
  case "D_asg_presupuesto":
    $id = $_POST[ "id" ]; //id del id_detalle
    $sp = mssql_init( 'P_ASIGNACION_PRESUPUESTO_D' );
    mssql_bind( $sp, '@ID', $id, SQLINT4, false, false );
    $r = mssql_execute( $sp );
    if ( $r ) {
      echo $id;
    }
    break;
  case "S_cumplimiento_presupueto":

    $zona = $_POST[ "zona" ];
    $mes = $_POST[ "mes" ];
    $anio = $_POST[ "anio" ];
    $pag = $_POST[ "pag" ];
    $Oficina = $_POST[ "Oficina" ];
    $SizePge = 30;
    $cont = 0;
    //print_r($_POST);
    $op = 0;
    if ( $Oficina == '0' ) {
      if ( $_SESSION[ "ses_NumOrg" ] == 1000 ) {
        $Oficina = "1100,1200";
      } else {
        $Oficina = "2100,2200,2300,2400";
      }
    }

    $SQLClasePedido = '';

    if ( $_POST[ 'ClasePedido' ] != 'T' ) {
      $SQLClasePedido = " and f.clase = '" . $_POST[ 'ClasePedido' ] . "'";
    }


    if ( date( 'm' ) == str_pad( $mes, 2, "0", STR_PAD_LEFT ) ) {
      $hoy = "GETDATE()";
    } else {
      $hoy = "EOMONTH('" . $anio . str_pad( $mes, 2, "0", STR_PAD_LEFT ) . "01')";
    }

    $sql = "SET DATEFIRST 1 
		        declare @FechaIni date = '" . $anio . str_pad( $mes, 2, "0", STR_PAD_LEFT ) . "01';
				declare @FechaIni2 date = '" . $anio . str_pad( $mes, 2, "0", STR_PAD_LEFT ) . "01';
				declare @FechaIni3 date = '" . $anio . str_pad( $mes, 2, "0", STR_PAD_LEFT ) . "01';
				declare @FechaFin date = EOMONTH('" . $anio . str_pad( $mes, 2, "0", STR_PAD_LEFT ) . "01') ;
				declare @Hoy date = " . $hoy . ";
				declare @diashabiles float=0;
				declare @diashabileshoy float=0;
				declare @domingos float=0;
				WHILE @FechaIni <= @FechaFin
				BEGIN  
					
				if  datepart(dw, @FechaIni) not in (7) and datepart(dw, @FechaIni) = (6) and datepart(dd, @FechaIni) not in (select dia from T_FESTIVOS t where t.mes='" . $mes . "' and t.ano='" . $anio . "' )     SET @diashabiles=@diashabiles+0.5
				if  datepart(dw, @FechaIni) not in (6,7) and datepart(dd, @FechaIni) not in (select dia from T_FESTIVOS t where t.mes='" . $mes . "' and t.ano='" . $anio . "') SET @diashabiles=@diashabiles+1
					set @FechaIni=dateadd(dd,1,@FechaIni)
				END  
				WHILE @FechaIni2 <= @Hoy
				BEGIN  
				if  datepart(dw, @FechaIni2) not in (7) and datepart(dw, @FechaIni2) = (6) and datepart(dd, @FechaIni2) not in (select dia from T_FESTIVOS t where t.mes='" . $mes . "' and t.ano='" . $anio . "')     SET @diashabileshoy=@diashabileshoy+0.5
				if  datepart(dw, @FechaIni2) not in (6,7) and datepart(dd, @FechaIni2) not in (select dia from T_FESTIVOS t where t.mes='" . $mes . "' and t.ano='" . $anio . "')  SET @diashabileshoy=@diashabileshoy+1
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
						  year(f.fecha)  = " . $anio . " and
						  month(f.fecha) = " . $mes . " " . $SQLClasePedido . "  
					
					),
					----------------historial de visitas----------------------
					vis_televendedor = isnull((select count(*) from t_visitas_vendedor pt where  
															   pt.id_usuario = ut.id and 
															   pt.codigo_sap_cli = t.codigo_sap and
															   year(pt.fecha_visita)  = " . $anio . " and
															   month(pt.fecha_visita) = " . $mes . "),0),
					vis_vendedor     = isnull((select count(*) from t_visitas_vendedor pv where
													   pv.id_usuario = uv.id               and 
													   pv.codigo_sap_cli = t.codigo_sap    and
													   year(pv.fecha_visita)  = " . $anio . " and
													   month(pv.fecha_visita) = " . $mes . "),0), 
					----------------historial de visitas contactadas----------------------
					vis_televendedor_c = isnull((select count(*) from t_visitas_vendedor pt where  
															   pt.id_usuario           = ut.id and 
															   pt.codigo_sap_cli       = t.codigo_sap and
															   year(pt.fecha_visita)   = " . $anio . " and
															   month(pt.fecha_visita)  = " . $mes . "  and
													           isnull(pt.estado_visita,'') = 'C'),0),
					vis_vendedor_c     = isnull((select count(*) from t_visitas_vendedor pv where
													   pv.id_usuario           = uv.id  and 
													   pv.codigo_sap_cli       = t.codigo_sap and
													   year(pv.fecha_visita)   = " . $anio . " and
													   month(pv.fecha_visita)  = " . $mes . " and
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
			        presupuesto_cartera =isnull((select sum(pc.valor_presupuesto) 
                                                  from t_presupuesto_cartera pc where 
                                                     pc.mes=" . $mes . " and 
                                                     pc.anio=" . $anio . " and pc.CODIGO_SAP_CLIENTE=t.CODIGO_SAP
													  and pc.CODIGO_SAP_VENDEDOR=tv.CODIGO_SAP 
													 ),0),
				    recaudo_real = isnull((select 
                                    sum(d.valor_presupuesto)
                                from t_presupuesto_cartera_detalle d WITH (NOLOCK) 
                                inner join v_cartera v on v.clase_documento = d.clase_documento and v.numero_documento = d.numero_documento and 
                                v.cliente = d.codigo_sap_cliente
                                where d.codigo_sap_cliente    = t.codigo_Sap and 
                                      d.mes                   = " . $mes . " and
                                      d.anio                   = " . $anio . " and
                                      v.documento_compensacion = '-'),0),
				    recaudo = isnull((
								 SELECT 
								 (SUM(R.VALOR)*-1) AS VALOR
								 FROM V_REACUDO R WITH (NOLOCK)
								 WHERE
									 R.CLASE = 'DZ'    
									 and r.condicion_pago <> 'z001' 
								 AND R.CODIGO_SAP = t.codigo_Sap
								 -----AND R.COD_VENDEDOR=tv.codigo_sap
								 and   r.zona_ventas = o.zona_ventas  ";
    //codigo nuevo
    if ( $_POST[ 'Filtro' ] == 'N' ) {
      $sql .= " AND MONTH(R.fecha_contabilizacion)=" . $mes . " AND YEAR(R.fecha_contabilizacion)=" . $anio;
    } else {
      $sql .= "	AND CAST(R.fecha_contabilizacion AS DATE) BETWEEN '" . $_POST[ 'fhIni' ] . "' AND '" . $_POST[ 'fhFin' ] . "'";
    }
    $sql .= "),0),
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
					  
					 --nuevos campos 2023-06-20
					  isnull(t.cupo_credito,0) as cupo_credito,
					  comprometido = isnull(c.comprometido,0),
					  cartera_10_dias = isnull(c.c_10_dias,0) 
				from t_terceros t 
				inner join t_terceros_organizacion o WITH (NOLOCK)  on o.codigo_sap  = t.codigo_sap and o.canal_distribucion=10 
				--cartera comprometida 
				left join t_terceros_cartera_comprometida c on c.codigo_sap = t.codigo_sap and c.sociedad = o.organizacion_ventas
				--presupuesto
				left  join t_presupuesto p on p.codigo_sap_cliente = o.codigo_sap and 
											  p.codigo_sap_vendedor = o.codigo_vendedor and
											  p.mes  = " . $mes . " and 
											  p.anio = " . $anio . "
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
    if ( $Oficina == 1000 || $Oficina == 2000 ) {
      $sql .= "	o.organizacion_ventas ='" . $Oficina . "'";
    } else {
      $sql .= "	o.oficina_ventas in(" . $Oficina . ")";
    }
    if ( $zona != '000000' ) {
      $sql .= " and o.zona_ventas = '" . $zona . "'";
    } else {
      if ( $Oficina != '2000' && $Oficina != '1000' ) {
        $sql .= " and substring(o.zona_ventas,1,2) = " . substr( $Oficina, 0, 2 ) . " 
				         and z.n_seg_v = 'S'";
      }

    }

    //try{

    //echo $sql;
    //return;
    $res_sp = mssql_query( $sql );
    $datos = array();

    $t_total_pre = 0;
    $t_total_eje = 0;
    $t_total_t = 0;
    $t_total_v = 0;
    $total_trimestre = 0;
    $i = 0;
    $vlr_total_trimestre = 0;

    while ( $row = mssql_fetch_assoc( $res_sp ) ) {

      $vlr_total_trimestre = $vlr_total_trimestre + $row[ 'prom_venta_3mes' ];

      $datos[] = array( 'n_filas' => $i,
        'codigo_sap' => $row[ 'codigo_sap_cliente' ],
        'nit' => $row[ 'nit' ],
        'nombres' => utf8_encode( $row[ 'nombres' ] ),
        'razon_comercial' => utf8_encode( $row[ 'razon_comercial' ] ),
        'ciudad' => utf8_encode( $row[ 'ciudad' ] ),
        'departamento' => utf8_encode( $row[ 'departamento' ] ),
        'organizacion_ventas' => utf8_encode( $row[ 'organizacion_ventas' ] ),
        'id_presupuesto' => $row[ 'id_presupuesto' ],
        'valor_presupuesto' => $row[ 'valor_presupuesto' ],
        'total_reg' => 0,
        'vis_televendedor' => $row[ 'vis_televendedor' ],
        'vis_vendedor' => $row[ 'vis_vendedor' ],
        'vis_televendedor_c' => $row[ 'vis_televendedor_c' ],
        'vis_vendedor_c' => $row[ 'vis_vendedor_c' ],
        'vendedor' => utf8_encode( $row[ 'vendedor' ] ),
        'televendedor' => utf8_encode( $row[ 'televendedor' ] ),
        'ejecutado' => $row[ 'ejecutado' ],
        't_total_pre' => 0,
        't_total_eje' => 0,
        't_total_t' => 0,
        't_total_v' => 0,
        'oficina_ventas' => utf8_encode( $row[ 'oficina_ventas' ] ),
        'prom_venta_3mes' => ( $row[ 'prom_venta_3mes' ] ),
        'prom_venta_6mes' => ( $row[ 'prom_venta_6mes' ] ),
        'presupuesto_cartera' => $row[ 'presupuesto_cartera' ],
        'recaudo' => $row[ 'recaudo' ],
        'recaudo_real' => $row[ 'recaudo_real' ],
        'zona_ventas' => $row[ 'zona_ventas' ],
        'zona_descripcion' => utf8_encode( $row[ 'zona_descripcion' ] ),
        't_aa' => $row[ "t_aa" ],
        't_a' => $row[ "t_a" ],
        't_b' => $row[ "t_b" ],
        't_c' => $row[ "t_c" ],
        't_d' => $row[ "t_d" ],
        't_e' => $row[ "t_e" ],
        'v_aa' => $row[ "v_aa" ],
        'v_a' => $row[ "v_a" ],
        'v_b' => $row[ "v_b" ],
        'v_c' => $row[ "v_c" ],
        'v_d' => $row[ "v_d" ],
        'v_e' => $row[ "v_e" ],
        'objetivo_ventas' => $row[ 'objetivo_ventas' ],
        'objetivo_televentas' => $row[ 'objetivo_televentas' ],
        'DiasLaborales' => number_format( $row[ 'DiasLaborales' ], 2 ),
        'DiasLaboralesTranscurridos' => $row[ 'DiasLaboralesTranscurridos' ],
        'grupo1' => $row[ 'grupo1' ],
        'desc_grupo1' => utf8_encode( $row[ 'desc_grupo1' ] ),
        'grupo2' => $row[ 'grupo2' ],
        'cupo_credito' => $row[ 'cupo_credito' ],
        'cupo_comprometido' => $row[ 'comprometido' ],
        'cartera_10_dias' => $row[ 'cartera_10_dias' ],
        'SQL' => $sql
      );
      $i++;
    }
    mssql_close();
    echo json_encode( array( 'datos' => $datos, 'vlr_total_trimestre' => $vlr_total_trimestre ) );


    break;

  case "S_cumplimiento_presupueto_web":
    //
    $zona = $_POST[ "zona" ];
    $mes = $_POST[ "mes" ];
    $anio = $_POST[ "anio" ];
    $pag = $_POST[ "pag" ];
    $Oficina = $_POST[ "Oficina" ];
    $SizePge = 30;
    $cont = 0;
    //print_r($_POST);
    $op = 0;
    if ( $Oficina == '0' ) {
      if ( $_SESSION[ "ses_NumOrg" ] == 1000 ) {
        $Oficina = "1100,1200";
      } else {
        $Oficina = "2100,2200,2300,2400";
      }
    }

    $sql = "select 
					  ----------------------cliente----------------------------
					  isnull(t.bloqueo,0) as bloqueo,
					  o.organizacion_ventas,
					  o.oficina_ventas,
					  t.codigo_sap as codigo_sap_cliente,
					  t.nit,
					  isnull(t.nombres,'na') as nombres,
					  isnull(t.razon_comercial,'na') as razon_comercial,
					  t.ciudad,
					  t.departamento,
					  ----------------------vendedor---------------------------
					  tv.codigo_sap as cod_sap_vendedor,
					  uv.codigo_sap as cod_web_vendedor,
					  isnull(tv.nombres,'na') as vendedor,
					  case when isnull(tv.codigo_sap,0) <> isnull(uv.codigo_sap,0) then 'f' else 'v' end sinc_vend,
					  --------------------televendedor-------------------------
					  isnull(tt.nombres,'na') as televendedor,
					  tt.codigo_sap as cod_sap_televendedor,
					  ut.codigo_sap as cod_web_televendedor,
					  case when isnull(tt.codigo_sap,0) <> isnull(ut.codigo_sap,0) then 'f' else 'v' end sinc_tele,
					  ---------------------presupuesto-------------------------
					  isnull(p.valor_presupuesto,0) as valor_presupuesto,
					  isnull(p.id,0) as id_presupuesto,
					  --------------------cumplimiento-------------------------
					  ejecutado = (select 
									isnull(sum(f.p_neto),0) 
								   from v_facturacion f 
								   where 
									f.codigo_sap = t.codigo_sap and 
									f.tipo_factura in('zf01','zf03','zf05','zf07','zf09','zf10','zf11','zf12','zf13','zf14','zf15','zf16','zf17','zf18','ZNC2','S1') and  
									f.organizacion_ventas = o.organizacion_ventas and 
									year(f.fecha)  = " . $anio . " and
									month(f.fecha) = " . $mes . "),
					  ----------------historial de visitas----------------------
					  vis_televendedor = isnull((select count(*) from t_visitas_vendedor pt where  
																 pt.id_usuario = ut.id and 
																 pt.codigo_sap_cli = t.codigo_sap and
																 year(pt.fecha_visita)  = " . $anio . " and
																 month(pt.fecha_visita) = " . $mes . "),0),
					  vis_vendedor     = isnull((select count(*) from t_visitas_vendedor pv where
														 pv.id_usuario = uv.id               and 
														 pv.codigo_sap_cli = t.codigo_sap    and
														 year(pv.fecha_visita)  = " . $anio . " and
														 month(pv.fecha_visita) = " . $mes . "),0), 
				  
					  -----------------promedio de ventas-----------------------
					  prom_venta_3mes = round((select 
										  isnull(sum(v.p_neto),0)/3
										 from v_facturacion v 
										 where 
										  v.codigo_sap = t.codigo_sap and
										  v.tipo_factura in('zf01','zf03','zf05','zf07','zf09','zf10','zf11','zf12','zf13','zf14','zf15','zf16','zf17','zf18','ZNC2','S1') and                 
										  cast(v.fecha as date) between cast(dateadd(month,-3,getdate()) as date) and 
																		cast(dateadd(month,-1,getdate()) as date) and
										  v.organizacion_ventas = o.organizacion_ventas),0),
					  prom_venta_6mes = round((select 
										  isnull(sum(v.p_neto),0)/6
										 from v_facturacion v 
										 where 
										  v.codigo_sap = t.codigo_sap and
										  v.tipo_factura in('zf01','zf03','zf05','zf07','zf09','zf10','zf11','zf12','zf13','zf14','zf15','zf16','zf17','zf18','ZNC2','S1') and                 
										  cast(v.fecha as date) between cast(dateadd(month,-6,getdate()) as date) and 
																		cast(dateadd(month,-1,getdate()) as date) and
										  v.organizacion_ventas = o.organizacion_ventas),0)  ,
					 presupuesto_cartera =isnull((select sum(pc.valor_presupuesto) 
													from t_presupuesto_cartera pc where 
													   pc.mes=" . $mes . " and 
													   pc.anio=" . $anio . " and pc.CODIGO_SAP_CLIENTE=t.CODIGO_SAP
														and pc.CODIGO_SAP_VENDEDOR=tv.CODIGO_SAP 
													   ),0),
					  recaudo = isnull((
								   SELECT 
								   (SUM(R.VALOR)*-1) AS VALOR
								   FROM V_REACUDO R
								   WHERE
									   R.CLASE = 'DZ'    
								   AND R.CONDICION_PAGO <> 'z001' 
								   AND R.CODIGO_SAP = T.CODIGO_SAP
								   -----AND R.COD_VENDEDOR=tv.CODIGO_SAP
								   AND R.ZONA_VENTAS = O.zona_ventas  ";
    //codigo nuevo
    if ( $_POST[ 'Filtro' ] == 'N' ) {
      $sql .= " AND MONTH(R.fecha_contabilizacion)=" . $mes . " AND YEAR(R.fecha_contabilizacion)=" . $anio;
    } else {
      $sql .= "	AND CAST(R.fecha_contabilizacion AS DATE) BETWEEN '" . $_POST[ 'fhIni' ] . "' AND '" . $_POST[ 'fhFin' ] . "'";
    }
    $sql .= "),0)	 					
				  
				  from t_terceros t 
				  inner join t_terceros_organizacion o on o.codigo_sap  = t.codigo_sap and o.canal_distribucion=10
				  --presupuesto
				  left  join t_presupuesto p on p.codigo_sap_cliente = o.codigo_sap and 
												p.codigo_sap_vendedor = o.codigo_vendedor and
												p.mes  = " . $mes . " and 
												p.anio = " . $anio . "
				  --vendedor
				  left  join t_terceros tv  on tv.codigo_sap = o.codigo_vendedor 
				  left  join t_usuarios uv on uv.codigo_sap = tv.codigo_sap and uv.roles_id=14
				  --televendedor
				  left  join t_terceros tt on tt.codigo_sap = o.codigo_televendedor
				  left  join t_usuarios ut on ut.codigo_sap = tt.codigo_sap and ut.roles_id=12
				  where      ";
    if ( $Oficina == 1000 || $Oficina == 2000 ) {
      $sql .= "	o.organizacion_ventas ='" . $Oficina . "'";
    } else {
      $sql .= "	o.oficina_ventas in(" . $Oficina . ")";
    }
    if ( $zona != '000000' ) {
      $sql .= " and o.zona_ventas = '" . $zona . "'";
    } else {
      $sql .= " and substring(o.zona_ventas,1,2) = " . substr( $Oficina, 0, 2 );
    }

    $res_sp = mssql_query( $sql );
    $datos = array();

    $t_total_pre = 0;
    $t_total_eje = 0;
    $t_total_t = 0;
    $t_total_v = 0;
    $total_trimestre = 0;


    while ( $row = mssql_fetch_assoc( $res_sp ) ) {

      $datos[] = array( 'n_filas' => 0,
        'codigo_sap_cliente' => $row[ 'codigo_sap_cliente' ],
        'nit' => $row[ 'nit' ],
        'nombres' => utf8_encode( $row[ 'nombres' ] ),
        'razon_comercial' => utf8_encode( $row[ 'razon_comercial' ] ),
        'ciudad' => utf8_encode( $row[ 'ciudad' ] ),
        'departamento' => utf8_encode( $row[ 'departamento' ] ),
        'organizacion_ventas' => $row[ 'organizacion_ventas' ],
        'id_presupuesto' => $row[ 'id_presupuesto' ],
        'valor_presupuesto' => $row[ 'valor_presupuesto' ],
        'total_reg' => 0,
        'vis_televendedor' => $row[ 'vis_televendedor' ],
        'vis_vendedor' => $row[ 'vis_vendedor' ],
        'vendedor' => utf8_encode( $row[ 'vendedor' ] ),
        'televendedor' => utf8_encode( $row[ 'televendedor' ] ),
        'ejecutado' => $row[ 'ejecutado' ],
        't_total_pre' => 0,
        't_total_eje' => 0,
        't_total_t' => 0,
        't_total_v' => 0,
        'oficina_ventas' => $row[ 'oficina_ventas' ],
        'prom_venta_3mes' => ( $row[ 'prom_venta_3mes' ] ),
        'prom_venta_6mes' => ( $row[ 'prom_venta_6mes' ] ),
        'presupuesto_cartera' => $row[ 'presupuesto_cartera' ],
        'recaudo' => $row[ 'recaudo' ]
      );

    }

    echo json_encode( $datos );
    mssql_close();
    break;
  case 's_cumplimiento_presupuesto_anio':
    {
      $anio = $_POST[ "anio" ];
      $org = $_POST[ "org" ];
      $sp = mssql_init( 'P_VENTAS_MES_VARIACION' );
      mssql_bind( $sp, '@ORGANIZACION_VENTAS', $org, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@ANIO', $anio, SQLINT4, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_close();
    }
    break;
  case 's_detalle_cumplimiento_ventas':
    {
      $ano = $_POST[ "ano" ];
      $mes = $_POST[ "mes" ];
      $org = $_POST[ "org" ];
      $zona = $_POST[ "zona" ];
      $tipo = $_POST[ "tipo" ];
      $sp = mssql_init( 'ZP_ASIGNACION_PRESUPUESTO_DETALLE_S' );
      mssql_bind( $sp, '@zona', $zona, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@org', $org, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@tipo', $tipo, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@mes', $mes, SQLINT4, false, false );
      mssql_bind( $sp, '@ano', $ano, SQLINT4, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_close();

    }
    break;
  case 'I_convenios_presupuesto':
    {
      $id = 0;
      $codigo = $_POST[ "codigo" ];
      $mes = $_POST[ "mes" ];
      $anio = $_POST[ "anio" ];
      $valor = $_POST[ "valor" ];
      $org = $_POST[ "org" ];
      $IdUsr = $_POST[ "IdUsr" ];
      $sp = mssql_init( 'P_CONVENIOS_PRESUPUESTO_I' );
      mssql_bind( $sp, '@CODIGO_SAP', $codigo, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@MES', $mes, SQLINT4, false, false );
      mssql_bind( $sp, '@ANIO', $anio, SQLINT4, false, false );
      mssql_bind( $sp, '@VALOR', $valor, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@ORGANIZACION_VENTAS', $org, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@USUARIO', $IdUsr, SQLINT4, false, false );
      mssql_bind( $sp, '@ID', $id, SQLINT4, true, false );
      $r = mssql_execute( $sp );
      if ( $id > 0 ) {
        echo $id;
      } else {
        echo 0;
      }
      mssql_close();
    }
    break;
  case 'S_convenios_presupuesto':
    {
      $oficina = $_POST[ 'oficina' ];
      $sp = mssql_init( 'P_CONVENIOS_PRESUPUESTO_S' );
      mssql_bind( $sp, '@OFICINA_VENTAS', $oficina, SQLVARCHAR, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_close();

    }
    break;
  case 'U_convenios_presupuesto':
    {
      $datos = $_POST[ 'datos' ];
      $sql = '';
      for ( $i = 0; $i <= sizeof( $datos ) - 1; $i++ ) {
        $sp = mssql_init( 'P_CONVENIOS_PRESUPUESTO_U' );
        mssql_bind( $sp, '@ID', $datos[ $i ], SQLVARCHAR, false, false );
        mssql_execute( $sp );
      }
    }
    break;
  case 's_presupuesto_cartera':
    {
      $sql = "select 
				 t.codigo_sap,				 
				 isnull(t.razon_comercial,t.nombres) as razon_comercial,
				 isnull(c.valor_presupuesto,0) as valor,
                 isnull(c.id,0) as id
				from   t_terceros t
				inner join t_terceros_organizacion o on o.codigo_sap = t.codigo_sap
				left join t_presupuesto_cartera    c on t.codigo_sap = c.codigo_sap_cliente and 
												        c.mes        = '" . $_POST[ "mes" ] . "' and 
												        c.anio       = '" . $_POST[ "anio" ] . "'
				where 
				 o.organizacion_ventas = '" . $_POST[ "org" ] . "' and 
				 t.codigo_sap  = '" . $_POST[ "codigo" ] . "'";
      $q = GenerarArray( $sql, "" );
      echo json_encode( $q );
    }
    break;
  case 's_cumplimiento_presupuesto_detalle_cliente':
    {
      $mes = $_POST[ "mes" ];
      $anio = $_POST[ "ano" ];
      $zona = $_POST[ "zona" ];
      $org = $_POST[ "org" ];
      $sp = mssql_init( 'P_CUMPLIMIENTO_PRESUPUESTO_DETALLE_CLIENTE_S' );
      mssql_bind( $sp, '@MES', $mes, SQLINT4, false, false );
      mssql_bind( $sp, '@ANO', $anio, SQLINT4, false, false );
      mssql_bind( $sp, '@ORG', $org, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@ZONA', $zona, SQLVARCHAR, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_close();
    }
    break;
  case 's_detalle_cartera_asignado':
    {
      $mes = $_POST[ "mes" ];
      $anio = $_POST[ "ano" ];
      $zona = $_POST[ "zona" ];
      $sql = "select 
	          p.anio,
			  p.mes,
			  p.codigo_sap_cliente as codigo_sap,
			  replace(t.nombres,',','-') as nombres,
			  isnull(replace(t.razon_comercial,',','-'),'N/A') as razon,
			  p.zona_ventas,
			  v.zona_descripcion,
			  p.valor_presupuesto		  
			from 
			t_presupuesto_cartera p
			inner join t_terceros t on t.codigo_sap = p.codigo_sap_cliente
			left join t_zonas_ventas v on v.zona_ventas = p.zona_ventas
			where
			  substring(p.zona_ventas,0,3) = " . $zona . " and
			  p.anio = " . $anio . " and 
			  p.mes = " . $mes . "
			order by
			  v.zona_descripcion";
      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'S_ZONAS_VENTA':
    {

      if ( $_POST[ 'sw' ] == 1 ) {

        if ( $_POST[ "oficina" ] == 1000 || $_POST[ "oficina" ] == 2000 ) {
          //busco por org

          $sql = "select 
					zona_ventas as zona,
					zona_descripcion as descripcion
				 from t_zonas_ventas 
				 where 
					substring(zona_ventas,1,1) = " . substr( $_SESSION[ 'ses_NumOrg' ], 0, 1 );
        } else {

          $sql = "select 
					zona_ventas as zona,
					zona_descripcion as descripcion
				 from t_zonas_ventas 
				 where 
					substring(zona_ventas,1,2) = " . substr( $_POST[ "oficina" ], 0, 2 );

        }


      } else {
        $sql = "select 
				  v.zona_ventas as zona,
				  v.zona_descripcion as descripcion
				from t_usuarios_zonas z
				inner join t_zonas_ventas v on v.zona_ventas = z.zona_ventas
				where 
				  z.id_usuario = '" . $_POST[ 'idUsr' ] . "'";
      }

      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'u_terceros_visita_objetivos':
    {
      $codigo = $_POST[ 'codigo_sap' ];
      $oficina = $_POST[ 'oficina' ];
      $org = $_POST[ 'org' ];
      $canal = '10';
      $valor = $_POST[ 'valor' ];
      $tipo = $_POST[ 'tipo' ];

      $sp = mssql_init( 'P_TERCEROS_VISITAS_OBJETIVOS_I' );
      mssql_bind( $sp, '@CODIGO_SAP', $codigo, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@OFICINA_VENTAS', $oficina, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@ORGANIZACION_VENTAS', $org, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@CANAL_DISTRIBUCION', $canal, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@TIPO', $tipo, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@VALOR', $valor, SQLINT4, false, false );
      $r = mssql_execute( $sp );
      $respuesta = array();
      if ( $r ) {
        $respuesta[] = array(
          'error' => false,
          'mensaje' => 'Se actualizo correctamente el registro!'
        );
      } else {
        $respuesta[] = array(
          'error' => true,
          'mensaje' => 'Error al actualizar el registro!'
        );
      }
      echo json_encode( $respuesta );
    }
    break;
  case 'S_META_VOLANTE_OFICINA':
    {
      $sql = "SELECT META1,META2,META3 FROM T_METAS_VOLANTES WHERE OFICINA_VENTAS = '" . $_POST[ 'oficina' ] . "'";
      $q = GenerarArray( $sql, '' );
      echo json_encode( $q );
    }
    break;
  case 'U_META_VOLANTE_OFICINA':
    {
      $sql = "UPDATE T_METAS_VOLANTES SET
				   META1 = '" . $_POST[ 'pcj1' ] . "',
				   META2 = '" . $_POST[ 'pcj2' ] . "',
				   META3 = '" . $_POST[ 'pcj3' ] . "'
			   WHERE 
			   	   OFICINA_VENTAS = '" . $_POST[ 'oficina' ] . "'";
      $res_sp = mssql_query( $sql );

      if ( $res_sp ) {
        $datos = array(
          'error' => false,
          'mensaje' => 'Registros actualizados con exito.'
        );
      } else {
        $datos = array(
          'error' => true,
          'mensaje' => 'Error al actualizar el registro.'
        );
      }

      echo json_encode( $datos );
    }
    break;

  case 'Meta_volante_zona':
    {
      $sql = "DECLARE @ano varchar(4) = '" . $_POST[ 'ano' ] . "';
		DECLARE @mes varchar(2) = '" . $_POST[ 'mes' ] . "';
		DECLARE @zona varchar(6) = '" . $_POST[ 'zona' ] . "';
		DECLARE @org_venta varchar(4) = '" . $_POST[ 'org' ] . "';
		
		select SUM(t.VALOR_PRESUPUESTO) as PRESUPUESTO,
			   t.ZONA_VENTAS,
			   tz.ZONA_DESCRIPCION,
			   TMV.META1,
			   TMV.META2,
			   TMV.META3,
			   
				c_ventas = isnull((select 
								  sum(vs.p_neto)
								 from v_facturacion  vs WITH (NOLOCK)
								 where 
								  vs.tipo_factura in('zf01','zf03','zf05','zf07','zf09','zf10','zf11','zf12','znc2','zf13','zf14','zf15','zf16','zf18','s1') and   
								  vs.zona_ventas         = t.zona_ventas and 
								  year(vs.fecha)         = @ano and
								  month(vs.fecha)        = @mes and
								  vs.organizacion_ventas = @org_venta ),0),
			  c_ventas_1_7 = isnull((select 
								  sum(vs.p_neto)
								 from v_facturacion  vs WITH (NOLOCK)
								 where 
								  vs.tipo_factura in('zf01','zf03','zf05','zf07','zf09','zf10','zf11','zf12','znc2','zf13','zf14','zf15','zf16','zf18','s1') and   
								  vs.zona_ventas         = t.zona_ventas and 
								  year(vs.fecha)         = @ano and
								  month(vs.fecha)        = @mes and
								  day(vs.fecha)  between 1 and 7 and 
								  vs.organizacion_ventas = @org_venta ),0),
			  c_ventas_8_14 = isnull((select 
								  sum(vs.p_neto)
								 from v_facturacion  vs WITH (NOLOCK)
								 where 
								  vs.tipo_factura in('zf01','zf03','zf05','zf07','zf09','zf10','zf11','zf12','znc2','zf13','zf14','zf15','zf16','zf18','s1') and   
								  vs.zona_ventas         = t.zona_ventas and 
								  year(vs.fecha)         = @ano and
								  month(vs.fecha)        = @mes and
								  day(vs.fecha)  between 8 and 14 and 
								  vs.organizacion_ventas = @org_venta ),0),
			  c_ventas_15_21 = isnull((select 
								  sum(vs.p_neto)
								 from v_facturacion  vs WITH (NOLOCK)
								 where 
								  vs.tipo_factura in('zf01','zf03','zf05','zf07','zf09','zf10','zf11','zf12','znc2','zf13','zf14','zf15','zf16','zf18','s1') and   
								  vs.zona_ventas         = t.zona_ventas and 
								  year(vs.fecha)         = @ano and
								  month(vs.fecha)        = @mes and
								  day(vs.fecha)  between 15 and 21 and 
								  vs.organizacion_ventas = @org_venta ),0)
								  
								  
		from T_PRESUPUESTO_VENTA t
			 INNER JOIN T_ZONAS_VENTAS TZ ON TZ.ZONA_VENTAS = t.ZONA_VENTAS
			 INNER JOIN T_METAS_VOLANTES TMV ON SUBSTRING(TMV.OFICINA_VENTAS, 1, 2) = substring(t.ZONA_VENTAS, 1, 2)
		where t.ORGANIZACION_VENTAS = @org_venta and
			  t.ANIO = @ano and
			  t.MES = @mes and 
			  t.ZONA_VENTAS=@zona
		group by t.ZONA_VENTAS,
				 tz.ZONA_DESCRIPCION,
				 TMV.META1,
				 TMV.META2,
				 TMV.META3";
      $q = GenerarArray( $sql, '' );
      echo json_encode( $q );
    }
    break;


}


?>