<?php
include( 'funciones.php' );
session_start();
conectar();

function verificar_url( $url ) {
  //abrimos el archivo en lectura
  $id = @fopen( $url, "r" );
  //hacemos las comprobaciones
  if ( $id )$abierto = true;
  else $abierto = false;
  //devolvemos el valor
  return $abierto;
  //cerramos el archivo
  fclose( $id );
}


switch ( $_POST[ 'op' ] ) {
  case 'B_INFO_MATERIAL': {
      $codigo = $_POST[ "cod" ];
      $sql = "SELECT 
               M.CODIGO_MATERIAL,
               '1'+SUBSTRING(M.CODIGO_MATERIAL, 2, 10) AS CODIGO_FOTO,
               M.DESCRIPCION,
               M.DESCRIPCION2,
               T.NOMBRES AS LAB,
               M.CODIGO_SAP,
               ISNULL(M.CONTROLADO, 0) AS CONTROLADO,
               ISNULL(M.INSTITUCIONAL, 0) AS INSTITUCIONAL,
               ISNULL(M.INVIMA, '') AS INVIMA,
               M.BLOQUEO_VENTA,
               ISNULL(M.EAN, '') AS EAN,
               ISNULL(M.EMBALAJE, 0) AS EMBALAJE,
               M.FECHA_CREACION,
               DATEDIFF(DAY, M.FECHA_CREACION, GETDATE()) AS DIAS_CREACION
            FROM T_MATERIALES M
            LEFT JOIN T_TERCEROS T ON T.CODIGO_SAP = M.CODIGO_SAP
            WHERE 
              M.CODIGO_MATERIAL = '$codigo '";
      $optCentros = '';
      
      if($_POST['org'] == '1000'){
          $optCentros = "'MM01','MC01'";
      }else{
          $optCentros = "'RM01','RB01','RC01','RQ01'";
      }
      
      $sqlSAP = "select 
                        LTRIM(a.matnr, '0') as material,
                        a.charg as lote,
                        b.vfdat as vmcto,
                        a.gesme as cantidad,
                        a.lgpla as ubicacion,
                        a.werks as centro,
                        a.lgnum as almacen,
                        a.lgtyp as tipo_mov
                    from lqua a
                    join mch1 as b on  a.matnr = b.matnr and a.charg = b.charg
                    where 
                     LTRIM(a.matnr, '0') = '$codigo' and 
                     a.werks in($optCentros) and 
                     a.lgtyp <> 'CUA' and 
                     a.lgtyp <> '916'
                    order by 
                     a.werks,
                     a.lgnum";

      $resultadosSAP = generarArrayHana( $sqlSAP, 0 );

      $datos = array();

      $q = mssql_query( $sql );

      while ( $row = mssql_fetch_array( $q ) ) {

        $ruta = "https://dfnas.pwmultiroma.com/imagenesMateriales/" . $row[ "CODIGO_FOTO" ] . '.png';
        $datos[] = array(
          'CODIGO_MATERIAL' => $row[ "CODIGO_MATERIAL" ],
          'DESCRIPCION' => utf8_encode( $row[ "DESCRIPCION" ] ),
          'DESCRIPCION2' => utf8_encode( $row[ "DESCRIPCION2" ] ),
          'LAB' => utf8_encode( $row[ "LAB" ] ),
          'CODIGO_SAP' => $row[ "CODIGO_SAP" ],
          'CONTROLADO' => $row[ "CONTROLADO" ],
          'INSTITUCIONAL' => $row[ "INSTITUCIONAL" ],
          'INVIMA' => utf8_encode( $row[ "INVIMA" ] ),
          'BLOQUEO_VENTA' => $row[ "BLOQUEO_VENTA" ],
          'EAN' => $row[ "EAN" ],
          'EMBALAJE' => $row[ "EMBALAJE" ],
          'FECHA_CREACION' => $row[ "FECHA_CREACION" ],
          'DIAS_CREACION' => $row[ "DIAS_CREACION" ],
          'RUTA' => $ruta,
          'INVENTARIO_LOTES' => $resultadosSAP
        );
      } //while

      echo json_encode( $datos );
      mssql_free_result( $q );
      mssql_close();
    }
    break;
  case 'B_FACTURACION_MES':
    {

      $sp = mssql_init( 'P_VENTAS_MES_A_MES' );
      mssql_bind( $sp, '@CODIGO_SAP', $_POST[ "cod" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@ORG', $_POST[ "org" ], SQLVARCHAR, false, false );
      $r = mssql_execute( $sp );

      $matriz = [];
      $claves = array();
      $previo = $r;
      $keys = array_keys( mssql_fetch_array( $r ) );

      foreach ( $keys as $key ) {

        if ( !is_numeric( $key ) ) {
          if ( $key != 'CODIGO_SAP' ) {
            $claves[] = $key;
          }
        }
      } //foreach
      conectar();
      $sp2 = mssql_init( 'P_VENTAS_MES_A_MES' );
      mssql_bind( $sp2, '@CODIGO_SAP', $_POST[ "cod" ], SQLVARCHAR, false, false );
      mssql_bind( $sp2, '@ORG', $_POST[ "org" ], SQLVARCHAR, false, false );
      $r2 = mssql_execute( $sp2 );

      while ( $row = mssql_fetch_assoc( $r2 ) ) {

        foreach ( $claves as $k ) {

          if ( array_key_exists( $k, $row ) ) {
            $matriz[] = $row[ $k ] /*array($k=>$row[$k])*/ ;
          }
        }
      }

      echo json_encode( array(
        'claves' => $claves,
        'datos' => $matriz
      ) );
    }
    mssql_close();
    break;
  case 'B_TOP20_MATERIALES':
    {
      $sp = mssql_init( 'P_TOP20_MATERIALES' );
      mssql_bind( $sp, '@ANO', $_POST[ "ano" ], SQLINT4, false, false );
      mssql_bind( $sp, '@MES', $_POST[ "mes" ], SQLINT4, false, false );
      mssql_bind( $sp, '@CODIGO_SAP', $_POST[ "cod" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@ORGANIZACION', $_POST[ "org" ], SQLVARCHAR, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_free_result( $r );
      mssql_close();
    }
    break;
  case 'GUARDA_SHOPING':
    {
      $listas = '';
      $entidad = '';
      if ( $_SESSION[ 'ses_OfcVentas' ] == '1100' || $_SESSION[ 'ses_OfcVentas' ] == '1200' ) {
        $entidad = 'CM';
        $listas = "'02','09'";
      }
      if ( $_SESSION[ 'ses_OfcVentas' ] == '2100' || $_SESSION[ 'ses_OfcVentas' ] == '2200' ) {
        $entidad = 'ROMA';
        $listas = "'51','59'";
      }

      $g = "SELECT vml.lista,
				   vml.valor_neto
			FROM V_MATERIALES_LISTAS vml
			WHERE vml.lista in (" . $listas . ") and
				  vml.oficina_ventas = '" . $_SESSION[ 'ses_OfcVentas' ] . "' and
				  vml.codigo_material = '" . $_POST[ 'shoping_codmaterial' ] . "' ";
      $lista1 = 0;
      $lista2 = 0;
      $quer = mssql_query( $g );
      $c = 0;
      while ( $row = mssql_fetch_array( $quer ) ) {
        if ( $entidad == 'CM' ) {
          if ( $row[ "lista" ] == '02' ) {
            $lista1 = $row[ "valor_neto" ];
          }
          if ( $row[ "lista" ] == '09' ) {
            $lista2 = $row[ "valor_neto" ];

          }
        }
        if ( $entidad == 'ROMA' ) {
          if ( $row[ "lista" ] == '51' ) {
            $lista1 = $row[ "valor_neto" ];
          }
          if ( $row[ "lista" ] == '59' ) {
            $lista2 = $row[ "valor_neto" ];

          }
        }


      }
      $sql = "INSERT INTO T_SHOPING_PRECIOS  (COD_SAP,
										LISTA,
										COD_MATERIAL,
										COMPETENCIA_ID,
										PRECIO_COMPETENCIA,
										USUARIO,OBSERVACION,
										FECHA,
										PRECIO_MATERIAL,
										OFICINA,
										LISTA5,
										LISTA9)
								VALUES ('" . $_POST[ 'codigo_sap' ] . "','" .
      $_POST[ 'shoping_lista' ] . "','" .
      $_POST[ 'shoping_codmaterial' ] . "','" .
      $_POST[ 'competencia' ] . "','" .
      $_POST[ 'valor_competencia' ] . "','" .
      $_POST[ 'shoping_usuario' ] . "','" .
      $_POST[ 'shoping_observacion' ] . "',getdate(),'" .
      $_POST[ 'shoping_preciomaterial' ] . "','" .
      $_POST[ "oficina" ] . "','" .
      $lista1 . "','" .
      $lista2 . "');";
      $q = mssql_query( $sql );
      mssql_close();
    }
    break;
  case 'B_CLIENTE_RC':
    { // Este caso se utiliza para el modulo de recibos de caja
      $sql = "select top 10 
					case 
					  when t.nombres is not null then upper(t.nombres) 
					  else upper(t.razon_comercial) 
					end as value,
					t.nombres,
					case 
					  when t.razon_comercial='' OR t.razon_comercial IS NULL then upper(t.nombres)
					   else upper(t.razon_comercial)
					   end as razon_comercial ,
					t.codigo_sap,
					t.nit,
					t.email,
					isnull(t.telefono1,'-') as telefonos,
					isnull(t.cupo_credito,0) as cupo_credito,
					t.direccion,
					isnull(t.ciudad,'N/A') as ciudad,
					f.oficina_ventas as bodega,
					f.descripcion as bodega_desc,
					o.lista,
					o.condicion_pago, 
					isnull(v.nombres,'NA') as vendedor,
					isnull(l.nombres,'NA') as televendedor,
					o.institucional,
					e.email as email_zona
				from t_terceros t
				inner join t_terceros_organizacion o on o.codigo_sap  = t.codigo_sap  and o.canal_distribucion = 10
				inner join t_oficinas_ventas       f on f.oficina_ventas = o.oficina_ventas and f.organizacion_ventas = o.organizacion_ventas 
				left join t_terceros               v on v.codigo_sap  = o.codigo_vendedor
				left join t_terceros               l on l.codigo_sap  = o.codigo_televendedor
				left join t_zonas_email            e on e.zona_ventas = o.zona_ventas
				where 
					o.organizacion_ventas = " . mb_strtoupper( $_SESSION[ "ses_NumOrg" ], "UTF-8" ) . " and 
					isnull(t.bloqueo,0)   = 0 and 
					" . palabras_terceros( utf8_decode( $_POST[ "term" ] ), 't' );
      $Query = GenerarArray( $sql, "" );
      echo json_encode( $Query );
      mssql_close();
    }
    break;
  case 'B_CLIENTE':
    {
      $sql = "select  
				  case 
					when t.nombres is not null then upper(t.nombres)+' | '+upper(t.razon_comercial)
					else upper(t.razon_comercial) 
				  end as value,
				  t.nombres,
				  t.razon_comercial,
				  t.codigo_sap,
				  t.nit,
				  t.email,
				  isnull(t.telefono1,'-')+' '+isnull(t.telefono2,'-')+' '+isnull(t.telefono3,'-') as telefonos,
				  isnull(t.cupo_credito,0) as cupo_credito,
				  t.direccion,
				  isnull(t.ciudad,'N/A') as ciudad,
				  f.oficina_ventas as bodega,
				  f.descripcion as bodega_desc,
				  o.lista,
				  o.condicion_pago, 
				  isnull(v.nombres,'NA') as vendedor,
                  isnull(v.telefono1,'') as telefono_vendedor,
				  isnull(l.nombres,'NA') as televendedor,
                  isnull(l.telefono1,'') as telefono_televendedor,
				  o.institucional,
				  o.controlados,
				  c.dias as dias_pago,
				  c.descuento as descuento_financiero,
				  o.grupo1,
				  o.grupo2,
				  o.grupo3,
				  o.grupo4,
				  o.grupo5
				  from t_terceros t
				  inner join t_terceros_organizacion o on o.codigo_sap = t.codigo_sap and o.canal_distribucion  = 10 
				  inner join t_oficinas_ventas       f on f.oficina_ventas      = o.oficina_ventas and 
														  f.organizacion_ventas = o.organizacion_ventas
				  left join t_condiciones_pago       c on c.condicion = o.condicion_pago
				  left join t_terceros               v on v.codigo_sap = o.codigo_vendedor
				  left join t_terceros               l on l.codigo_sap = o.codigo_televendedor
			 where
				isnull(t.borrado,0)   = 0 and
				isnull(t.bloqueo,0)   = 0 and 
				o.organizacion_ventas = " . mb_strtoupper( $_POST[ "org" ], "UTF-8" );
      //echo  $sql;
      $datos = array();

      $q = mssql_query( $sql );

      while ( $row = mssql_fetch_array( $q ) ) {
        $datos[] = array(
          'nombres' => utf8_encode( $row[ "nombres" ] ),
          'razon_comercial' => utf8_encode( $row[ "razon_comercial" ] ),
          'codigo_sap' => $row[ "codigo_sap" ],
          'nit' => $row[ "nit" ],
          'email' => utf8_encode( $row[ "email" ] ),
          'telefonos' => $row[ "telefonos" ],
          'cupo_credito' => $row[ "cupo_credito" ],
          'direccion' => utf8_encode( $row[ "direccion" ] ),
          'ciudad' => utf8_encode( $row[ "ciudad" ] ),
          'bodega' => $row[ "bodega" ],
          'bodega_desc' => utf8_encode( $row[ "bodega_desc" ] ),
          'lista' => $row[ "lista" ],
          'condicion_pago' => $row[ "condicion_pago" ],
          'vendedor' => utf8_encode( $row[ "vendedor" ] ),
          'televendedor' => utf8_encode( $row[ "televendedor" ] ),
          'telefono_vendedor' => $row[ "telefono_vendedor" ],
          'telefono_televendedor' => $row[ "telefono_televendedor" ],
          'institucional' => $row[ "institucional" ],
          'controlados' => $row[ "controlados" ],
          'dias_pago' => $row[ "dias_pago" ],
          'descuento_financiero' => $row[ "descuento_financiero" ],
          'grupo1' => $row[ "grupo1" ],
          'grupo2' => $row[ "grupo2" ],
          'grupo3' => $row[ "grupo3" ],
          'grupo4' => $row[ "grupo4" ],
          'grupo5' => $row[ "grupo5" ]
        );
      } //while

      echo json_encode( $datos );
      mssql_free_result( $q );
      mssql_close();
      //echo json_encode(GenerarArray($sql,""));*/
    }
    break;
  case 'B_PRODUCTOS':
    {
      if ( $_POST[ 'TipoPed' ] == 'N' ) {
        switch ( $_SESSION[ "ses_DepId" ] ) {
          case '1':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '2':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '3':
            {
              $clase = 'ZPWV';
            }
            break; //Vendedores
          case '4':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '5':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '6':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '7':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '8':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '9':
            {
              $clase = 'ZPWP';
            }
            break; //Proovedor
          case '10':
            {
              $clase = 'ZPWC';
            }
            break; //Clientes
          case '11':
            {
              $clase = 'ZPWT';
            }
            break; //Transferencistas internas
          case '12':
            {
              $clase = 'ZPWL';
            }
            break; //Televendedores
          case '13':
            {
              $clase = 'ZPWT';
            }
            break; //Transferencistas Externas
          default:
            {
              $clase = 'ZPWA';
            }
        }
      } else {
        $clase = 'ZPIC';
      }
      $sql = "select 
			  m.codigo_material,
			  m.descripcion,
			  m.valor_unitario,
			  m.iva,
			  m.descuento,
			  m.stock ,
			  cast(m.valor_neto as money) as valor_neto,
			  cast(m.valor_bruto as money) as valor_bruto,
			  isnull(m.bonificado,'0') as bonificado,
			  m.desc_bonificado,
			  m.desc_bonificado_n,
			  isnull(m.stock_bonificado,0) as stock_bonificado,
			  m.cant_bonificado,
			  m.cant_regular,
			  m.condicion_b,
			  m.stock_prepack,
			  cant_pedido     = isnull((select d.cantidad    from t_pedidos_detalle_tmp d where d.codigo = m.codigo_material and d.numero = " . $_POST[ "numero" ] . "),0),
			  id_pedido       = isnull((select d.id          from t_pedidos_detalle_tmp d where d.codigo = m.codigo_material and d.numero = " . $_POST[ "numero" ] . "),0),
			  vlr_pedido      = isnull((select d.valor_total from t_pedidos_detalle_tmp d where d.codigo = m.codigo_material and d.numero = " . $_POST[ "numero" ] . "),0),
			  grupo_articulos = isnull(m.grupo_articulos,'NA'),
			  dias_creacion,
			  fecha_creacion,
			  img1,
			  img2";
      if ( $clase == 'ZPWC' ) { //Restriccion para que los descuentos de clase ZPWC sean solo para clientes Droguistas es decir 100
        if ( $_POST[ 'Grp1' ] == '100' ) {
          $sql .= ", descuento_adg = isnull((select top 1 
			                              --d.descuento
                                          case 
                                             when (isnull(d.tipo_descuento,'PR') = 'CO' and isnull(m.costo_unitario,0) > 0) then 
                                             round((isnull(m.costo_unitario,0) * (isnull(d.descuento,0)/100)*100)/m.valor_unitario,2)
                                           else isnull(d.descuento,0) end as descuento
										from t_descuentos_adg d 
										where  
										  d.codigo_material = m.codigo_material and
										  (d.clase_pedido   = '" . $clase . "' or d.clase_pedido = '*') and
										  (d.lista = m.lista or d.lista = '*') and
										  (d.oficina_ventas     = m.oficina_ventas or d.oficina_ventas = '*') and
										  (d.codigo_sap = '*' or d.codigo_sap = '" . $_POST[ 'CodigoSAP' ] . "') and 
										  (d.grupo1 = '*' or d.grupo1 = '" . $_POST[ 'Grp1' ] . "') and
										  d.organizacion_ventas = m.organizacion_ventas and 
										  cast (d.fecha_inicial as date) <= cast (getdate() as date) and 
										  cast (d.fecha_final   as date) >= cast (getdate() as date)),0)";
        } else {
          $sql .= ", descuento_adg = 0";
        }
      } else {
        $sql .= ", descuento_adg = isnull((select top 1 
			                              ---d.descuento
                                           case 
                                             when (isnull(d.tipo_descuento,'PR') = 'CO' and isnull(m.costo_unitario,0) > 0) then 
                                             round((isnull(m.costo_unitario,0) * (isnull(d.descuento,0)/100)*100)/m.valor_unitario,2)
                                           else isnull(d.descuento,0) end as descuento
										from t_descuentos_adg d 
										where  
										  d.codigo_material = m.codigo_material and
										  (d.clase_pedido   = '" . $clase . "' or d.clase_pedido = '*') and
										  (d.lista = m.lista or d.lista = '*') and
										  (d.oficina_ventas     = m.oficina_ventas or d.oficina_ventas = '*') and
										  (d.codigo_sap = '*' or d.codigo_sap = '" . $_POST[ 'CodigoSAP' ] . "') and 
										  (d.grupo1 = '*' or d.grupo1 = '" . $_POST[ 'Grp1' ] . "') and
										  d.organizacion_ventas = m.organizacion_ventas and 
										  cast (d.fecha_inicial as date) <= cast (getdate() as date) and 
										  cast (d.fecha_final   as date) >= cast (getdate() as date)),0)";
      }

      $sql .= " from V_MATERIALES m 
			where
			    isnull(m.bloqueo_venta,0) = 0 and 
				isnull(m.anulada,0)       = 0 and							
				m.oficina_ventas          = '" . $_POST[ "bodega" ] . "' and
				m.lista                   = '" . $_POST[ "lista" ] . "' ";
      //Restriccion de codigos plan odontologos 11000
      if ( $_SESSION[ 'ses_RolesId' ] == '53' || //Vendedor LAF
        $_SESSION[ 'ses_RolesId' ] == '54' //Transferencista LAF
      ) {
        $sql .= " and m.tipo_material in('ZFAR','ZFAO','ZOBS','ZFAL','ZREG','ZEPS','ZFEV')";
      } else {
        //validacion para productos institucionales dependiendo de la condicion del cliente
        if ( $_POST[ "eps" ] == 'NO' ) {
          $sql .= " and m.tipo_material in('ZFAR','ZFAO','ZOBS','ZFAL','ZREG')";
        } else {
          $sql .= " and m.tipo_material in('ZFAR','ZFAO','ZOBS','ZFAL','ZREG','ZEPS')";
        }

      }
      $sql .= " and (m.valor_unitario > 0 or m.tipo_material = 'ZOBS')";

      //restriccion para productos de Henkel canal tradicional usuarios internos
      if ( ( $_SESSION[ 'ses_RolesId' ] != '12' && //Televendedores
          $_SESSION[ 'ses_RolesId' ] != '14' && //Vendedores
          $_SESSION[ 'ses_RolesId' ] != '1' && //Administrador
          $_SESSION[ 'ses_RolesId' ] != '13' && //Coordinadores de contact
          $_SESSION[ "ses_NitPro" ] != '860000751' ) //restriccion para productos de Henkel canal tradicional - transferencistas
      ) {
        $sql .= " and m.grupo_articulos <> 'ROMA2570' 
			          and m.grupo_articulos <> 'HENK1301'";
      }
      //validacion para que traiga solo los productos corresponientes al laboratorio para el caso de transferencistas y proveedores
      if (
        $_SESSION[ 'ses_RolesId' ] == 11 or //Transferencistas externas
        $_SESSION[ 'ses_RolesId' ] == 9 or //Proveedores
        $_SESSION[ 'ses_RolesId' ] == 54 or //Transferencistas LAF
        $_SESSION[ 'ses_RolesId' ] == 120 //Transferencias internas
      ) {
        switch ( $_SESSION[ "ses_NitPro" ] ) {
          case '817001644':
            {
              $w = "nit like('%817001644%') OR nit like('%800226384%') OR  
				                            nit like('%830010337%') OR nit like('%60003476%')";
            }
            break; //GENFAR-SANOFY-MEDLEY
          case '900735454':
            {
              $w = "nit like('%900735454%') OR nit like('%830109901%')";
            }
            break; //PADEL   - 3Q
          case '800174633':
            {
              $w = "nit like('%800174633%') OR nit like('%860074358%')";
            }
            break; //BUSSIE  - LABINCO
          case '890902165':
            {
              $w = "nit like('%890902165%') OR nit like('%900436298%')";
            }
            break; //LAPROFF - LEBRIUT
          case '800168135':
            {
              $w = "nit like('%800168135%') OR nit like('%900136364%')";
            }
            break; //FARPAQ  - PFFARMACEUTICA
          case '860501437':
            {
              $w = "nit like('%860501437%') OR nit like('%800194450%')";
            }
            break; //ARMOFAR - QUIMICA PATRIC
          case '900145434':
            {
              $w = "nit like('%900145434%') OR nit like('%900710313%')";
            }
            break; //UNIDOS NAC. - LAB. BIO LINE
          case '890300684':
            {
              $w = "nit like('%890300684%') OR nit like('%900253413%') OR nit like('%9012034074%')";
            }
            break;
          case '860001942':
            {
              $w = "nit like('%900716452%') OR nit like('%860001942%')";
            }
            break; //BAYER -EXCELTIS
          case '89030146':
            {
              $w = "nit like('%89030146%')  OR nit like('%900238878%')";
            }
            break; //LAFRANCOL - SUNSTAR
          case '811000967':
            {
              $w = "nit like('%811000967%') OR nit like('%860001642%')";
            }
            break; //REMO - LICOL
          case '900809229':
            {
              $w = "nit like('%900809229%') OR nIt lIke('%900786357%')";
            }
            break; //GSK && PFIZER
          case '901203407':
            {
              $w = "nit like('%901203407%') OR nIt lIke('%900253413%')";
            }
            break; //RB HEALTH - Mead Johnso
          case '890106527':
            {
              $w = "nit like('%890106527%') OR nIt lIke('%900724712%')";
            }
            break; //Procaps - Rimco 	
          case '800232359':
            {
              $w = "nit like('%800232359%') OR nIt lIke('%900303567%')";
            }
            break; //BCN - FAES 
            //transferencista SUPERNUMERARIA VOSPINA --VALENTINA 
          case "999999": //padel && 3Q
            $w = "  
						          nit like('%900735454%') OR
						          nit like('%830109901%') OR
						          nit like('%860507994%') OR
							      nit like('%900828998%') OR
								  nit like('%805030336%') ";
            break;
          case "888888":
            $w = "     /*UNILEVER*/
						          nit like('%860002518%') OR
								  /*CRUZ AZUL*/
						          nit like('%900703991%') OR
								  /*BAYER*/
						          nit like('%860001942%')";
            break;
          default:
            {
              $w = "nit like('%" . $_SESSION[ "ses_NitPro" ] . "%')";
            }
            break; //DEFAULT
        }
        $sql .= " and m.codigo_sap in(select codigo_sap from t_terceros where " . $w . " ) ";
      }
      //validacion para productos controlados dependiendo de la condicion del cliente
      if ( $_POST[ "ctrl" ] == 'NO' ) {
        $sql .= " and m.controlado = 0";
      }
      //Filtro de busqueda para disponibilidad de inventario
      if ( $_POST[ "f_sto" ] == 1 ) {
        $sql .= " and m.stock > 0";
      }
      //Filtro de busqueda para descuentos
      //----Comentado 30-03-2021-----///if($_POST["f_dto"] == 1){$sql .= " and m.descuento > 0";}
      //Filtro de busqueda para productos bonificados 
      //----Comentado 30-03-2021-----///if($_POST["f_bon"] == 1){$sql .= " and isnull(m.bonificado,'0') <> '0' and isnull(m.stock_bonificado,0)>0";}
      //Validacion de codigos 8000 para que los clientes no los pueda visualizar
      if ( $_SESSION[ 'ses_RolesId' ] == 10 ) {
        $sql .= " and m.codigo_material not like '8000%'";
      }

      //Se validan productos de venta exclusiva interna - bloqueo externo	 - 17-03-2020 - CBM		
      if ( //$_SESSION['ses_RolesId'] == 9  || //Proveedores
        //$_SESSION['ses_RolesId'] == 11 || //Transferencistas
        $_SESSION[ 'ses_RolesId' ] == 10 //Clientes
      ) {
        $sql .= " and m.bloqueo_externo = 0";
      }
      //------------------------------------------------------------------
      $datos = array();
      $q = mssql_query( $sql );
      /*
        * 20250529 - V1
        * Ampliacion 29-05-2025 Christian Bula 
        * Control de lotes desde SAP para informarlos en la descripción
      */    
        
            $materialesADG = [];
            while ($row = mssql_fetch_array($q, MSSQL_ASSOC)) {
                $materialesADG[$row['codigo_material']] = $row;
            }
            mssql_free_result($q);
           
            $materialesList = "'" . implode("','", array_keys($materialesADG)) . "'";
        
            $centro = '';
            switch($_POST[ "bodega" ]){
                case "1100": $centro = 'MM01'; break;
                case "1200": $centro = 'MC01'; break;
                case "2100": $centro = 'RM01'; break;
                case "2200": $centro = 'RB01'; break;
                case "2300": $centro = 'RC01'; break;
                case "2400": $centro = 'RQ01'; break;
            }
        
            $sqlSAP = "select 
                            LTRIM(a.matnr, '0') as material,
                            a.charg as lote,
                            b.vfdat as vmcto
                        from lqua a
                        join mch1 as b on  a.matnr = b.matnr and a.charg = b.charg
                        where 
                         LTRIM(a.matnr, '0') in($materialesList ) and 
                         a.werks = '$centro' and 
                         a.lgtyp <> 'CUA' and 
                         a.lgtyp <> '916'";
            $resultadosSAP = generarArrayHana($sqlSAP, 0);
             // Indexar resultados SAP por material
            $lotesSAP = [];
            foreach ($resultadosSAP as $item) {
                $material = $item['MATERIAL'];
                $fechaLote = $item['VMCTO'];
                if (empty($fechaLote)) continue;
                if (!isset($lotesSAP[$material]) || strtotime($fechaLote) < strtotime($lotesSAP[$material])) {
                    $lotesSAP[$material] = $fechaLote;
                }
            }

     /*
        * 20250529 - V1
        * Ampliacion 29-05-2025 Christian Bula 
        * Control de lotes desde SAP para informarlos en la descripción
      */   
    

      foreach ($materialesADG as $row) {
        /*
         Control del lote
        */  
        $codigo = $row["codigo_material"];
        $vmcto  = ($codigo !== null && isset($lotesSAP[$codigo])) ? $lotesSAP[$codigo] : 0;
          
          
        if ( $row[ 'descuento_adg' ] > 0 ) {
          $neto = round( ( $row[ "valor_unitario" ] * ( 1 - ( ( $row[ "descuento" ] + $row[ "descuento_adg" ] ) / 100 ) ) ) * ( 1 + ( $row[ "iva" ] / 100 ) ), 0 );
        } else {
          $neto = $row[ 'valor_neto' ];
        }        
        if ( $clase == 'ZPWC' ) { //Restriccion para que los descuentos de clase ZPWC sean solo para clientes Droguistas es decir 100
          if ( $_POST[ 'Grp1' ] == '100' && ( int )$row[ "descuento_adg" ] > 0 ) {

            $descripcion = 'OFERTA EXCLUSIVA CLIENTE WEB : ' . utf8_encode( trim( $row[ "descripcion" ] ) ) . ' - ' . utf8_encode( trim( $row[ "grupo_articulos" ] ) ) . ' - ' .  $vmcto ;
          } else {
            $descripcion = utf8_encode( trim( $row[ "descripcion" ] ) ) . ' - ' . utf8_encode( trim( $row[ "grupo_articulos" ] ) ) . ' - ' . $vmcto ;
          }
        } else {
          $descripcion = utf8_encode( trim( $row[ "descripcion" ] ) ) . ' - ' . utf8_encode( trim( $row[ "grupo_articulos" ] ) ) . ' - ' .  $vmcto ;
        }
        $datos[] = array(
          'codigo_material' => $row[ "codigo_material" ],
          'descripcion' => $descripcion,
          'valor_unitario' => $row[ "valor_unitario" ],
          'iva' => $row[ "iva" ],
          'descuento' => ( $row[ "descuento" ] + $row[ "descuento_adg" ] ),
          'stock' => $row[ "stock" ],
          'valor_neto' => $neto,
          'valor_bruto' => $row[ "valor_bruto" ],
          'bonificado' => $row[ "bonificado" ],
          'desc_bonificado_n' => utf8_encode( $row[ "desc_bonificado_n" ] ),
          'stock_bonificado' => $row[ "stock_bonificado" ],
          'cant_bonificado' => $row[ "cant_bonificado" ],
          'cant_regular' => $row[ "cant_regular" ],
          'condicion_b' => $row[ "condicion_b" ],
          'stock_prepack' => $row[ "stock_prepack" ],
          'cant_pedido' => $row[ "cant_pedido" ],
          'id_pedido' => $row[ "id_pedido" ],
          'vlr_pedido' => $row[ "vlr_pedido" ],
          'fecha_inicio' => '',
          'fecha_fin' => '',
          'lista' => '',
          'oficina_ventas' => '',
          'anulado' => '',
          'grupo_articulos' => utf8_encode( trim( $row[ "grupo_articulos" ] ) ),
          'descuento_adg' => $row[ "descuento_adg" ],
          'dias_creacion' => $row[ "dias_creacion" ],
          'fecha_creacion' => $row[ "fecha_creacion" ],
          'img1' => $row[ "img1" ],
          'img2' => $row[ "img2" ],
          'op_inf' => '0'//,
          //'SQL' => $sql
        );
        //print_r($datos);
      }

      $sql = "select 
			  k.fecha_inicio,
			  k.fecha_fin,
			  k.lista, 
			  k.oficina_ventas,
			  k.anulado,
			  k.codigo_material,
			  k.descripcion,
			  isnull(k.valor_unitario,0) as valor_unitario,
			  k.iva,
			  k.descuento,
			  k.stock,
			  isnull(cast(k.valor_neto as money),0) as valor_neto,
			  0 as valor_bruto,
			  k.bonificado,
			  k.desc_bonificado,
			  k.stock_bonificado,
			  k.cant_bonificado,
			  cant_pedido = isnull((select d.cantidad from t_pedidos_detalle_tmp d where d.codigo = k.codigo_material and d.numero = " . $_POST[ "numero" ] . "),0),
		      id_pedido   = isnull((select d.id from t_pedidos_detalle_tmp d where d.codigo = k.codigo_material and d.numero = " . $_POST[ "numero" ] . "),0),
		      vlr_pedido  = isnull((select d.valor_total from t_pedidos_detalle_tmp d where  d.codigo = k.codigo_material and d.numero = " . $_POST[ "numero" ] . "),0),
			  k.codigo_sap
			from v_materiales_kit k 
			where 
			k.anulado        = 0 and
			k.fecha_inicio  <= cast(getdate() as date) and 
			k.fecha_fin     >= cast(getdate() as date) and 
			k.lista          = '" . $_POST[ "lista" ] . "'   and 
			k.oficina_ventas = '" . $_POST[ "bodega" ] . "'   ";

      $sql .= " and stock > 0 ";

      //validacion para que traiga solo los productos corresponientes al laboratorio para el caso de transferencistas y proveedores
      if ( $_SESSION[ 'ses_RolesId' ] == 9 ) {
        switch ( $_SESSION[ "ses_NitPro" ] ) {
          //GENFAR-SANOFY-MEDLEY-BERHINGER
          case '817001644':
            {
              $w = "nit like('%817001644%') OR nit like('%800226384%') OR 
			                           nit like('%830010337%') OR  nit like('%860000753%')";
            }
            break;
            //PADEL - 3Q
          case '900735454':
            {
              $w = "nit like('%900735454%') OR nit like('%830109901%')";
            }
            break;
            //BUSSIE - LABINCO
          case '800174633':
            {
              $w = "nit like('%800174633%') OR nit like('%860074358%')";
            }
            break;
            //LAPROFF - LEBRIUT
          case '890902165':
            {
              $w = "nit like('%890902165%') OR nit like('%900436298%')";
            }
            break;
            //FARPAQ - PFFARMACEUTICA
          case '800168135':
            {
              $w = "nit like('%800168135%') OR nit like('%900136364%')";
            }
            break;
            //ARMOFAR - QUIMICA PATRIC
          case '860501437':
            {
              $w = "nit like('%860501437%') OR nit like('%800194450%')";
            }
            break;
            //UNIDOS NAC. - LAB. BIO LINE
          case '900145434':
            {
              $w = "nit like('%900145434%') OR nit like('%900710313%')";
            }
            break;
            //RECKIT. - MEAD JOHNSONS
          case '890300684':
            {
              $w = "nit like('%890300684%') OR nit like('%900253413%') OR nit like('%901203407%')";
            }
            break;
            //DEFAULT
          default:
            {
              $w = "nit like('%" . $_SESSION[ "ses_NitPro" ] . "%')";
            }
            break;
        }
        $sql .= "  and k.codigo_sap in(select codigo_sap from t_terceros where " . $w . ")";
      }
      $q = mssql_query( $sql );


      while ( $row = mssql_fetch_array( $q ) ) {

        $datos[] = array(
          'codigo_material' => $row[ "codigo_material" ],
          'descripcion' => utf8_encode( $row[ "descripcion" ] ),
          'valor_unitario' => $row[ "valor_unitario" ],
          'iva' => $row[ "iva" ],
          'descuento' => $row[ "descuento" ],
          'stock' => $row[ "stock" ],
          'valor_neto' => $row[ "valor_neto" ],
          'valor_bruto' => $row[ "valor_bruto" ],
          'bonificado' => $row[ "bonificado" ],
          'desc_bonificado_n' => '',
          'stock_bonificado' => $row[ "stock_bonificado" ],
          'cant_bonificado' => $row[ "cant_bonificado" ],
          'cant_regular' => 0,
          'condicion_b' => 0,
          'stock_prepack' => 0,
          'cant_pedido' => $row[ "cant_pedido" ],
          'id_pedido' => $row[ "id_pedido" ],
          'vlr_pedido' => ( float )$row[ "vlr_pedido" ],
          'fecha_inicio' => $row[ "fecha_inicio" ],
          'fecha_fin' => $row[ "fecha_fin" ],
          'lista' => $row[ "lista" ],
          'oficina_ventas' => $row[ "oficina_ventas" ],
          'anulado' => $row[ "anulado" ],
          'op_inf' => '1'
        );
      }

      echo json_encode( $datos );
      mssql_free_result( $q );
      mssql_close();
      //echo  $sql;
    }
    break;
  case "B_EAN":
    $sql = "SELECT 
						CODIGO_MATERIAL,
						EAN 
						FROM T_MATERIALES_EAN
						WHERE ISNULL(EAN,'0')<>'0' AND  ISNULL(ANULADO,0)=0
			";
    $q = mssql_query( $sql );
    $arr_ean = array();
    while ( $e = mssql_fetch_array( $q ) ) {
      $arr_ean[] = array(
        'ean' => utf8_encode( trim( $e[ "EAN" ] ) ),
        'codigo_material' => ( trim( $e[ "CODIGO_MATERIAL" ] ) )
      );
    } //w
    echo json_encode( $arr_ean );
    mssql_free_result( $q );
    mssql_close();
    break;


  case 'B_PRODUCTOS_KIT':
    {

      $sql = "select 
			  k.fecha_inicio,
			  k.fecha_fin,
			  k.lista, 
			  k.oficina_ventas,
			  k.anulado,
			  k.codigo_material,
			  k.descripcion,
			  isnull(k.valor_unitario,0) as valor_unitario,
			  k.iva,
			  k.descuento,
			  k.stock,
			  isnull(cast(k.valor_neto as money),0) as valor_neto,
			  0 as valor_bruto,
			  k.bonificado,
			  k.desc_bonificado,
			  k.stock_bonificado,
			  k.cant_bonificado,
			  cant_pedido = isnull((select d.cantidad from t_pedidos_detalle_tmp d where d.codigo = k.codigo_material and d.numero = " . $_POST[ "numero" ] . "),0),
		      id_pedido   = isnull((select d.id from t_pedidos_detalle_tmp d where d.codigo = k.codigo_material and d.numero = " . $_POST[ "numero" ] . "),0),
		      vlr_pedido  = isnull((select d.valor_total from t_pedidos_detalle_tmp d where  d.codigo = k.codigo_material and d.numero = " . $_POST[ "numero" ] . "),0),
			  k.codigo_sap
			from v_materiales_kit k 
			where 
			k.anulado        = 0 and
			k.fecha_inicio  <= cast(getdate() as date) and 
			k.fecha_fin     >= cast(getdate() as date) and 
			k.lista          = '" . $_POST[ "lista" ] . "'   and 
			k.oficina_ventas = '" . $_POST[ "bodega" ] . "'   ";

      $sql .= " and stock > 0 ";

      //validacion para que traiga solo los productos corresponientes al laboratorio para el caso de transferencistas y proveedores
      if ( $_SESSION[ 'ses_RolesId' ] == 11 or $_SESSION[ 'ses_RolesId' ] == 9 ) {
        switch ( $_SESSION[ "ses_NitPro" ] ) {
          //GENFAR-SANOFY-MEDLEY-BERHINGER
          case '817001644':
            {
              $w = "nit like('%817001644%') OR nit like('%800226384%') OR 
			                           nit like('%830010337%') OR  nit like('%860000753%')";
            }
            break;
            //PADEL - 3Q
          case '900735454':
            {
              $w = "nit like('%900735454%') OR nit like('%830109901%')";
            }
            break;
            //BUSSIE - LABINCO
          case '800174633':
            {
              $w = "nit like('%800174633%') OR nit like('%860074358%')";
            }
            break;
            //LAPROFF - LEBRIUT
          case '890902165':
            {
              $w = "nit like('%890902165%') OR nit like('%900436298%')";
            }
            break;
            //FARPAQ - PFFARMACEUTICA
          case '800168135':
            {
              $w = "nit like('%800168135%') OR nit like('%900136364%')";
            }
            break;
            //ARMOFAR - QUIMICA PATRIC
          case '860501437':
            {
              $w = "nit like('%860501437%') OR nit like('%800194450%')";
            }
            break;
            //UNIDOS NAC. - LAB. BIO LINE
          case '900145434':
            {
              $w = "nit like('%900145434%') OR nit like('%900710313%')";
            }
            break;
            //RECKIT. - MEAD JOHNSONS
          case '890300684':
            {
              $w = "nit like('%890300684%') OR nit like('%900253413%') OR nit like('%901203407%')";
            }
            break;
            //DEFAULT
          default:
            {
              $w = "nit like('%" . $_SESSION[ "ses_NitPro" ] . "%')";
            }
            break;
        }
        $sql .= "  and k.codigo_sap in(select codigo_sap from t_terceros where " . $w . ")";
      }
      $q = mssql_query( $sql );
      $datos = array();

      while ( $row = mssql_fetch_array( $q ) ) {

        $datos[] = array(
          'codigo_material' => $row[ "codigo_material" ],
          'descripcion' => utf8_encode( $row[ "descripcion" ] ),
          'valor_unitario' => $row[ "valor_unitario" ],
          'iva' => $row[ "iva" ],
          'descuento' => $row[ "descuento" ],
          'stock' => $row[ "stock" ],
          'valor_neto' => $row[ "valor_neto" ],
          'valor_bruto' => $row[ "valor_bruto" ],
          'bonificado' => $row[ "bonificado" ],
          'desc_bonificado_n' => '',
          'stock_bonificado' => $row[ "stock_bonificado" ],
          'cant_bonificado' => $row[ "cant_bonificado" ],
          'cant_regular' => 0,
          'condicion_b' => 0,
          'stock_prepack' => 0,
          'cant_pedido' => $row[ "cant_pedido" ],
          'id_pedido' => $row[ "id_pedido" ],
          'vlr_pedido' => ( float )$row[ "vlr_pedido" ],
          'fecha_inicio' => $row[ "fecha_inicio" ],
          'fecha_fin' => $row[ "fecha_fin" ],
          'lista' => $row[ "lista" ],
          'oficina_ventas' => $row[ "oficina_ventas" ],
          'anulado' => $row[ "anulado" ],
          'op_inf' => '1'
        );
      } // while($row = mssql_fetch_array($q)){
      echo json_encode( $datos );
      mssql_free_result( $q );
      mssql_close();
    }
    break;
  case 'B_INFO_KIT':
    {
      $sql = "SELECT 
				  M.CODIGO_MATERIAL,
				  CASE WHEN M.DESCRIPCION2 IS NULL THEN M.DESCRIPCION ELSE M.DESCRIPCION2 END AS DESCRIPCION,
				  K.CANTIDAD,
				  ISNULL(M.IVA,0) AS IVA,
				  ISNULL(D.DESCUENTO,0) AS DESCUENTO,
				  ISNULL(L.VALOR_UNITARIO,0) AS VALOR_UNITARIO,
				  VALOR_NETO  = ISNULL(ROUND(L.VALOR_UNITARIO*(1+ISNULL((M.IVA/100),0))*(1-ISNULL(( CASE 
								 WHEN (ISNULL(D.TIPO_DESCUENTO,'PR') = 'CO' AND ISNULL(L.COSTO_UNITARIO,0) > 0) THEN 
								 ROUND((ISNULL(L.COSTO_UNITARIO,0) * (ISNULL(D.DESCUENTO,0)/100)*100)/L.VALOR_UNITARIO,2)
								 ELSE ISNULL(D.DESCUENTO,0)
								END/100),0)),0),0)

				FROM T_MATERIALES_KIT K 
				INNER JOIN T_MATERIALES M ON M.CODIGO_MATERIAL = K.CODIGO_MATERIAL
				LEFT  JOIN T_DESCUENTOS D ON D.CODIGO_MATERIAL = M.CODIGO_MATERIAL AND 
											 D.OFICINA_VENTAS  = K.OFICINA_VENTAS AND
											 CAST(D.FECHA_INICIO AS DATE) <= CAST(GETDATE() AS DATE) AND 
											 CAST(D.FECHA_FIN AS DATE)    >= CAST(GETDATE() AS DATE) AND
											 D.LISTA = '" . $_POST[ 'lst' ] . "'
				LEFT  JOIN T_MATERIALES_LISTAS  L ON L.CODIGO_MATERIAL  = K.CODIGO_MATERIAL AND 
													 L.LISTA = '" . $_POST[ 'lst' ] . "' AND 
													 L.OFICINA_VENTAS = K.OFICINA_VENTAS
                WHERE 
				  K.CODIGO_KIT        = '" . $_POST[ 'cod' ] . "' AND 
				  ISNULL(K.ANULADO,0) = 0 AND 
				  K.OFICINA_VENTAS    = '" . $_POST[ 'ofi' ] . "'";
      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'B_DESTINATARIO':
    {
      $sql = "select 
			  d.id,
			  d.direccion+' - '+s.descripcion+' - '+c.descripcion as direccion
			from t_terceros_dir d 
			inner join t_departamentos s on s.departamento = d.departamento
			inner join t_ciudades c on c.ciudad = d.ciudad and c.departamento = d.departamento  
			where 
			d.CODIGO_SAP = '" . mb_strtoupper( $_POST[ "codSap" ], "UTF-8" ) . "'";
      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'I_PEDIDO_ENCABEZADO':
    {
      $id = "";
      $clase = "";
      //clase queda pendiente definir eso
      if ( $_POST[ 'tipoPed' ] == 'N' ) {
        switch ( $_SESSION[ "ses_DepId" ] ) {
          case '1':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '2':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '3':
            {
              $clase = 'ZPWV';
            }
            break; //Vendedores
          case '4':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '5':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '6':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '7':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '8':
            {
              $clase = 'ZPWA';
            }
            break; //Administrativos
          case '9':
            {
              $clase = 'ZPWP';
            }
            break; //Proovedor
          case '10':
            {
              $clase = 'ZPWC';
            }
            break; //Clientes
          case '11':
            {
              $clase = 'ZPWT';
            }
            break; //Transferencistas internas
          case '12':
            {
              $clase = 'ZPWL';
            }
            break; //Televendedores
          case '13':
            {
              $clase = 'ZPWT';
            }
            break; //Transferencistas Externas
          default:
            {
              $clase = 'ZPWA';
            }
        }
      } else {
        $clase = 'ZPIC';
      }

      $visible = 1;

      $sp = mssql_init( 'P_PEDIDO_ENCABEZADO_I' );
      mssql_bind( $sp, '@ORGANIZACION_VENTAS', mb_strtoupper( $_POST[ "organizacion_ventas" ], "UTF-8" ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@OFICINA_VENTAS', mb_strtoupper( $_POST[ "oficina_ventas" ], "UTF-8" ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@CLASE', mb_strtoupper( $clase, "UTF-8" ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@CANAL_DISTRIBUCION', mb_strtoupper( $_POST[ "canal_distribucion" ], "UTF-8" ), SQLINT4, false, false );
      mssql_bind( $sp, '@CODIGO_SAP', mb_strtoupper( $_POST[ "codigo_sap" ], "UTF-8" ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@DESTINATARIO', mb_strtoupper( $_POST[ "codigo_sap" ], "UTF-8" ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@USUARIO', utf8_decode( $_SESSION[ 'ses_Login' ] ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@CODIGO_DIRECCION', $_POST[ 'destinatario' ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@VISIBLE', $visible, SQLINT4, false, false );
      mssql_bind( $sp, '@ID', $id, SQLINT4, true, false );
      mssql_execute( $sp );
      if ( $id > 0 ) {
        echo $id;
      } else {
        echo 0;
      }
      mssql_close();
    }
    break;
  case 'I_PEDIDO_DETALLE':
    {
      $id = "";
      $sp = mssql_init( 'ZP_PEDIDO_DETALLE_I' );
      mssql_bind( $sp, '@NUMERO', $_POST[ "NumPed" ], SQLINT4, false, false );
      mssql_bind( $sp, '@CODIGO', $_POST[ "codigo" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@CANTIDAD', $_POST[ "cant" ], SQLINT4, false, false );
      mssql_bind( $sp, '@VALOR', $_POST[ "vlr_unitario" ], SQLINT4, false, false );
      mssql_bind( $sp, '@VALOR_TOTAL', $_POST[ "vlr_total" ], SQLINT4, false, false );
      mssql_bind( $sp, '@DESCUENTO', $_POST[ "descuento" ], SQLFLT8, false, false );
      mssql_bind( $sp, '@IVA', $_POST[ "iva" ], SQLINT4, false, false );
      mssql_bind( $sp, '@NOTA', mb_strtoupper( "-" ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@OFICINA', $_POST[ "oficina" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@LISTA', $_POST[ "lista" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@ID', $id, SQLINT4, true, false );
      mssql_bind( $sp, '@CANAL', $_POST[ "canal" ], SQLVARCHAR, false, false );
      mssql_execute( $sp );
      if ( $id > 0 ) {
        echo $id;
      } else {
        echo 0;
      }
      mssql_close();
    }
    break;
  case 'U_PEDIDO_DETALLE':
    {
      $sp = mssql_init( 'ZP_PEDIDO_DETALLE_U' );
      mssql_bind( $sp, '@CANTIDAD', $_POST[ 'cant' ], SQLINT4, false, false );
      mssql_bind( $sp, '@ID', $_POST[ 'idfila' ], SQLINT4, false, false );
      mssql_bind( $sp, '@VALOR_TOTAL', $_POST[ 'vlr_total' ], SQLINT4, false, false );
      mssql_bind( $sp, '@NUMERO', $_POST[ 'numero' ], SQLINT4, false, false );
      mssql_bind( $sp, '@CODIGO', $_POST[ "codigo" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@OFICINA', $_POST[ "oficina" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@LISTA', $_POST[ "lista" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@CANAL', $_POST[ "canal" ], SQLVARCHAR, false, false );
      mssql_execute( $sp );
      mssql_close();
    }
    break;
  case 'D_PEDIDO_DETALLE':
    {
      //print_r($_POST);
      $sp = mssql_init( 'ZP_PEDIDO_DETALLE_D' );
      mssql_bind( $sp, '@ID', $_POST[ 'idfila' ], SQLINT4, false, false );
      mssql_bind( $sp, '@NUMERO', $_POST[ 'numero' ], SQLINT4, false, false );
      mssql_bind( $sp, '@CODIGO', $_POST[ "codigo" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@OFICINA', $_POST[ "oficina" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@LISTA', $_POST[ "lista" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@CANAL', $_POST[ "canal" ], SQLVARCHAR, false, false );
      $exce = mssql_execute( $sp );
      if ( $exce ) {
        echo 1;
      } else {
        echo 0;
      }
      mssql_close();
    }
    break;
  case 'S_PEDIDO_DETALLE':
    {
      $sp = mssql_init( 'P_PEDIDO_DETALLE_S' );
      mssql_bind( $sp, '@NUMERO', mb_strtoupper( $_POST[ "numero" ], "UTF-8" ), SQLINT4, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_close();
    }
    break;
  case 'S_VERIFICA_PEDIDO':
    {
      $sql = "select numero from t_pedidos_tmp where numero = " . $_POST[ 'num' ];
      echo json_encode( GenerarArray( $sql, 'C' ) );
      mssql_close();
    }
    break;
  case 'S_TEMPORALES':
    {
      $sp = mssql_init( 'P_PEDIDO_ENCABEZADO_S' );
      mssql_bind( $sp, '@USUARIO', utf8_decode( $_SESSION[ 'ses_Login' ] ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@ORG', $_SESSION[ 'ses_NumOrg' ], SQLVARCHAR, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_close();
    }
    break;
  case 'D_PEDIDO':
    {
      $sp = mssql_init( 'P_PEDIDO_ENCABEZADO_D' );
      mssql_bind( $sp, '@NUMERO', $_POST[ 'numero' ], SQLINT4, false, false );
      mssql_bind( $sp, '@USUARIO', $_SESSION[ 'ses_Login' ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@OPCION', $_POST[ 'opc' ], SQLINT4, false, false );
      if ( mssql_execute( $sp ) ) {
        echo 0;
      } else {
        echo 1;
      }
    }
    break;
  case 'U_NOTAS':
    {
      $sql = "UPDATE T_PEDIDOS_TMP SET NOTAS ='" . $_POST[ 'nota' ] . "' WHERE NUMERO = " . $_POST[ 'nump' ];
      mssql_query( $sql );
      mssql_close();
    }
    break;
  case 'EMAIL':
    {
      $sql = "select
			  p.organizacion_ventas as org,
			  o.descripcion as bodega, 
			  t.nit,
			  t.nombres,
			  t.razon_comercial,
			  t.direccion,
			  t.ciudad,
			  p.numero_sap,
			  isnull(p.notas,'') as nota,
			  p.valor_total
			from t_pedidos_tmp p 
			inner join t_oficinas_ventas o on o.oficina_ventas = p.oficina_ventas
			inner join t_terceros t on t.codigo_sap = p.codigo_sap
			where 
			  p.numero = '" . $_POST[ 'numero' ] . "'";
      $dato = mssql_fetch_array( mssql_query( $sql ) );

      mssql_close();
      //--------------------------------------------------------------------------------------------------------------------------------
      require_once( '../resources/PhPMailer/Email.php' );
      $org = '';
      $slogan = '';
      $asunto = '';
      if ( $dato[ 'org' ] == '1000' ) {
        $url = 'www.multidrogas.com';
        $slogan = 'CM de Colombia S.A.S el socio leal y estratégico del droguista colombiano';
        $asunto = 'Pedidos WEB CM';
      } else {
        $url = 'www.dfroma.com';
        $slogan = 'Distribuidora farmaceutica ROMA S.A';
        $asunto = 'Pedidos WEB ROMA';
      }
      if ( $_POST[ 'tipo' ] == 'G' ) { //Pedido Guardado
        $titulo = utf8_decode( $_SESSION[ "ses_Login" ] ) . " - NUEVO PEDIDO " . $dato[ 'numero_sap' ] . " WEB PARA " . utf8_decode( $dato[ 'nombres' ] );
        $para = utf8_decode( $_SESSION[ "ses_Email" ] );
        $msg = '<!doctype html>
					<head>
					<meta charset="utf-8">
					<title>Documento sin título</title>
					</head>
					<body>
					<table align="center" border="1" rules="cols">
					 <thead>
					  <tr><th colspan="2">REPORTE AUTOMATICO DE PEDIDOS WEB</th></tr>
					 </thead>
					 <tbody>
					  <tr><td colspan="2" align="center">Nuestro sistema ha detectado la generacion de un nuevo pedido</td></tr>
					  <tr>
					   <td><b>Numero</b></td><td>' . $dato[ 'numero_sap' ] . '</td>
					  </tr>
					  <tr>
					   <td><b>Bodega</b></td><td>' . $dato[ 'bodega' ] . '</td>
					  </tr>
					  <tr>
					   <td><b>Nit</b></td><td>' . $dato[ 'nit' ] . '</td>
					  </tr>
					  <tr>
					   <td><b>Cliente</b></td><td>' . utf8_decode( $dato[ 'nombres' ] ) . '</td>
					  </tr>
					  <tr>
					   <td><b>Ciudad</b></td><td>' . $dato[ 'ciudad' ] . '</td>
					  </tr>
					  <tr>
					   <td><b>Valor</b></td><td>$' . number_format( $dato[ 'valor_total' ] ) . '</td>
					  </tr>
					  <tr>
					   <td><b>Notas</b></td><td>' . utf8_decode( $dato[ 'nota' ] ) . '</td>
					  </tr>
					 </tbody>
					 <tfoot>
					  <tr><td colspan="2" align="center">' . $slogan . '</td></tr>
					  <tr><td colspan="2" align="center">' . $url . '</td></tr>
					 </tfoot>
					</table>
					</body>
					</html>';


      } else if ( $_POST[ 'tipo' ] == 'E' ) {
        $titulo = utf8_decode( $_SESSION[ "ses_Login" ] ) . " - PEDIDO WEB ANULADO " . $dato[ 'numero_sap' ] . "  PARA " . utf8_decode( $dato[ 'nombres' ] );
        $para = utf8_decode( $_SESSION[ "ses_Email" ] );
        $msg = '<!doctype html>
					<head>
					<meta charset="utf-8">
					<title>Documento sin título</title>
					</head>
					<body>
					<table align="center" border="1" rules="cols">
					 <thead>
					  <tr><th colspan="2">REPORTE AUTOMÁTICO DE ANULACION DE PEDIDOS WEB</th></tr>
					 </thead>
					 <tbody>
					  <tr><td colspan="2" align="center">Nuestro sistema ha detectado la anulacion de un pedido</td></tr>
					  <tr>
					   <td><b>Numero</b></td><td>' . $dato[ 'numero_sap' ] . '</td>
					  </tr>
					  <tr>
					   <td><b>Bodega</b></td><td>' . $dato[ 'bodega' ] . '</td>
					  </tr>
					  <tr>
					   <td><b>Nit</b></td><td>' . $dato[ 'nit' ] . '</td>
					  </tr>
					  <tr>
					   <td><b>Cliente</b></td><td>' . utf8_decode( $dato[ 'nombres' ] ) . '</td>
					  </tr>
					  <tr>
					   <td><b>Ciudad</b></td><td>' . $dato[ 'ciudad' ] . '</td>
					  </tr>
					  <tr>
					   <td><b>Valor</b></td><td>$' . number_format( $dato[ 'valor_total' ] ) . '</td>
					  </tr>
					  <tr>
					   <td><b>Motivo de anulación</b></td><td>' . utf8_decode( $_POST[ 'texto' ] ) . '</td>
					  </tr>
					 </tbody>
					 <tfoot>
					  <tr><td colspan="2" align="center">' . $slogan . '</td></tr>
					  <tr><td colspan="2" align="center">' . $url . '</td></tr>
					 </tfoot>
					</table>
					</body>
					</html>';

      }


      EnviarMail( $titulo, $msg, $asunto, $para );
    }
    break;
    //==================================NUEVOS CASOS PARA MODIFICACION DE PEDIDOS DESDE SAP=================================================
  case 'B_CLIENTE_SAP':
    {
      $sp = mssql_init( 'P_BUSCAR_CLIENTE_PW_SAP' );
      mssql_bind( $sp, '@NUMERO', $_POST[ 'Numero' ], SQLVARCHAR, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_close();
    }
    break;
  case 'S_EDITAR_PW':
    {
      $sql = "SELECT 
	            P.CODIGO_SAP,
				P.NUMERO,
				P.VALOR_TOTAL,
				P.DESTINATARIO,
				P.OFICINA_VENTAS,
				P.TRANSFERIDO,
				P.NUMERO_SAP
			 FROM T_PEDIDOS_TMP P 
			 WHERE";
      if ( $_POST[ 'Tipo' ] == '1' ) {
        $sql .= " P.NUMERO_SAP = '" . $_POST[ 'Numero' ] . "'";
      } else {
        $sql .= " P.NUMERO = '" . $_POST[ 'Numero' ] . "'";
      }
      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'S_ENTREGA':
    {
      $sp = mssql_init( 'P_ENTREGA_S' );
      mssql_bind( $sp, '@NUMERO', $_POST[ 'numero' ], SQLVARCHAR, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_close();
    }
    break;
  case 'S_ORDEN':
    {
      $sp = mssql_init( 'P_OT_S' );
      mssql_bind( $sp, '@NUMERO_OT', $_POST[ 'numero' ], SQLVARCHAR, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_close();
    }
    break;
  case 'S_ZONAS_VENTA':
    {
      if ( $_POST[ 'sw' ] == 1 ) {

        $sql = "select 
					zona_ventas as zona,
					zona_descripcion as descripcion
				 from t_zonas_ventas 
				 where 
					substring(zona_ventas,1,1) = " . substr( $_SESSION[ 'ses_NumOrg' ], 0, 1 );

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
  case 'S_GESTION_PEDIDOS':
    {
      $sql = "select 
	          p.clase,
			  p.numero,
			  p.organizacion_ventas,
			  p.canal_distribucion,
			  p.bodega,
			  p.oficina_ventas,
			  p.codigo_sap,
			  p.cliente,


			  p.nit_cliente,
			  p.fecha_pedido,
			  p.valor_total,
			  p.destinatario,
			  p.transferido,
			  p.numero_sap,
			  p.entrega,
			  p.ot,
			  p.factura,
			  p.usuario,
			  p.zona_ventas,
			  p.notas,
        p.codigo_direccion,
        case 
        when p.codigo_direccion = 0 then p.direccion 
        else (select td.direccion from t_terceros_dir td where td.id = p.codigo_direccion) 
        end as direccion,
        p.zona_descripcion,
        sol_desbloqueo =isnull((
          SELECT TOP  1
            CAST(S.ESTADO AS VARCHAR)
           FROM T_CAR_SOL_DESBLOQUEO_PEDIDOS S
           WHERE S.PEDIDO =P.numero_sap AND CAST(S.FECHA_SOL AS DATE)=CAST(GETDATE() AS DATE)
         ),'')
		 from v_pedidos_web p
         where 
		 isnull(p.visible,1) =1 and 
		 p.organizacion_ventas = '" . $_SESSION[ 'ses_NumOrg' ] . "' and  
		 cast(p.fecha_real as date) between '" . Formato_Fecha_A_M_D( $_POST[ 'fh1' ] ) . "' and '" . Formato_Fecha_A_M_D( $_POST[ 'fh2' ] ) . "'";
      if ( $_POST[ 'zona' ] > 0 ) {
        $sql .= "  and p.zona_ventas = '" . $_POST[ 'zona' ] . "'";
      }
      if ( $_POST[ 'codigo' ] != '' ) {
        $sql .= "  and p.codigo_sap = '" . $_POST[ 'codigo' ] . "'";
      }
      if ( $_POST[ 'clase' ] != 'T' ) {
        $sql .= " and p.clase = '" . $_POST[ 'clase' ] . "'";
      }
      if ( $_POST[ 'oficina' ] != '1000' && $_POST[ 'oficina' ] != '2000' ) {
        $sql .= " and p.oficina_ventas = '" . $_POST[ 'oficina' ] . "'";
      }
      //echo $sql;
      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'S_ENTREGAS':
    {
      /* $sql ="select distinct
			  p.clase,
			  p.usuario,
			  convert(varchar(30),p.fecha_pedido,120) as fecha_pedido,
			  p.numero,
			  p.oficina_ventas,
			  p.codigo_sap,
			  p.anulado,
              p.valor
			from t_pedidos_detalle d 
			inner join t_pedidos p on p.numero = d.numero and isnull(p.anulado,0) = 0
			left  join t_entregas_detalle t on t.numero_pedido = d.numero and isnull(t.anulado,0) = 0
			where 
			  t.numero is null and 
			  p.oficina_ventas = '".$_POST['oficina']."' and 
			  cast(p.fecha_pedido as date)  between '".Formato_Fecha_A_M_D($_POST['fh1'])."' and '".Formato_Fecha_A_M_D($_POST['fh2'])."' and
			  p.codigo_sap ='".$_POST['codigo']."'";*/
      $sql = "select distinct
			  p.clase,
			  p.usuario,
			  convert(varchar(30),p.fecha_pedido,120) as fecha_pedido,
			  p.numero,
			  p.oficina_ventas,
			  p.codigo_sap,
			  isnull(p.anulado,0) as anulado,
			  p.valor,
			  isnull(m.codigo_direccion,0) as cod_direccion
			from t_pedidos_detalle d 
			inner join t_pedidos          p on p.numero        = d.numero and isnull(p.anulado,0) = 0
			left  join t_pedidos_tmp      m on m.numero_sap    = p.numero
			left  join t_entregas_detalle t on t.numero_pedido = d.numero and isnull(t.anulado,0) = 0
			where 
			  t.numero is null and 
			  p.oficina_ventas = '" . $_POST[ 'oficina' ] . "' and 
			  cast(p.fecha_pedido as date)  between '" . Formato_Fecha_A_M_D( $_POST[ 'fh1' ] ) . "' and '" . Formato_Fecha_A_M_D( $_POST[ 'fh2' ] ) . "' and
			  p.codigo_sap ='" . $_POST[ 'codigo' ] . "' and
			  isnull(m.visible,1) = 1 ";
      //echo $sql;
      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'S_FACTURAS':
    {
      $sql = "SELECT 

				  F.NUMERO_FACTURA,
				  F.OFICINA_VENTAS,
				  F.CODIGO_SAP,
				  T.NOMBRES,
				  T.RAZON_COMERCIAL,
				  CAST(F.FECHA_INICIO AS DATE) AS FECHA_HORA,
				  SUM(D.VALOR_NETO) AS VALOR,
				  SUM(D.VALOR_IVA) AS IVA,
				  SUM(CASE WHEN d.VALOR_UNITARIO>0 
					  THEN 
					   ISNULL(ROUND((ROUND(D.VALOR_UNITARIO*(1+ISNULL((D.IVA/100),0))*
					   (1-ISNULL(ROUND( (((d.VALOR_DESCUENTO/d.CANTIDAD)*100)/d.VALOR_UNITARIO),2),0)/100),0))*D.CANTIDAD,0),0)
					  ELSE 0
				  END ) AS TOTAL
				FROM T_PEDIDOS_FACTURA F
				INNER JOIN T_PEDIDOS_FACTURA_DETALLE D ON D.NUMERO_FACTURA = F.NUMERO_FACTURA AND D.NUMERO_PEDIDO = F.NUMERO_PEDIDO
				INNER JOIN T_TERCEROS T ON T.CODIGO_SAP = F.CODIGO_SAP 
				WHERE 
				   CAST(F.FECHA_HORA AS DATE) BETWEEN '" . Formato_Fecha_A_M_D( $_POST[ 'fh1' ] ) . "' AND '" . Formato_Fecha_A_M_D( $_POST[ 'fh2' ] ) . "'";
      if ( $_POST[ 'fact' ] != '' ) {
        $sql .= " AND F.NUMERO_FACTURA = '" . $_POST[ 'fact' ] . "'";
      }
      if ( $_POST[ 'codigo' ] != '' ) {
        $sql .= " AND F.CODIGO_SAP = '" . $_POST[ 'codigo' ] . "'";
      }
      $sql .= " GROUP BY
				  F.NUMERO_FACTURA,
				  F.OFICINA_VENTAS,
				  F.CODIGO_SAP,
				  T.NOMBRES,
				  T.RAZON_COMERCIAL,
				  CAST(F.FECHA_INICIO AS DATE)";

      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'S_FALTANTES':
    {
      $sql = "SELECT 
			  E.CODIGO_SAP,
			  P.NUMERO,
			  P.CODIGO_MATERIAL,
			  ISNULL(M.DESCRIPCION2, M.DESCRIPCION) AS DESCRIPCION,
			  SUM(ISNULL(D.CANTIDAD,0)) AS CANTIDAD,
			  P.CANTIDAD AS CANT_PED,
			 -- ISNULL(D.LOTE,'-') AS LOTE,
			 -- ISNULL(D.CENTRO,'-') AS CENTRO,
			 -- ISNULL(D.ALMACEN,'-') AS ALMACEN,
			  ISNULL(D.ANULADO,0) AS ANULADO,
			  ISNULL(D.NUMERO,0) AS ENTREGA,
			  ISNULL(P.PORCENTAJE_DESCUENTO,0) AS DESCUENTO,
			  ISNULL(P.VALOR_DESCUENTO,0) AS VLR_DESCUENTO
			FROM T_PEDIDOS_DETALLE P
			INNER JOIN T_PEDIDOS          E ON E.NUMERO            = P.NUMERO
			INNER JOIN T_MATERIALES       M ON M.CODIGO_MATERIAL   = P.CODIGO_MATERIAL
			LEFT  JOIN T_ENTREGAS_DETALLE D ON D.NUMERO_PEDIDO     = P.NUMERO AND 
											   D.CODIGO_MATERIAL   = P.CODIGO_MATERIAL AND
											   D.POSICION_PEDIDO   = P.POSICION AND 
											   ISNULL(D.ANULADO,0) = 0
			WHERE 
			  E.CODIGO_SAP = '" . $_POST[ 'codigo' ] . "' AND  
              CAST(E.FECHA_PEDIDO AS DATE) BETWEEN '" . Formato_Fecha_A_M_D( $_POST[ 'fh1' ] ) . "' AND '" . Formato_Fecha_A_M_D( $_POST[ 'fh2' ] ) . "' 
			GROUP BY
			  E.CODIGO_SAP,
			  P.NUMERO,
			  P.CODIGO_MATERIAL,
			  ISNULL(M.DESCRIPCION2, M.DESCRIPCION),
			  P.CANTIDAD,
			 -- ISNULL(D.LOTE,'-') ,
			 -- ISNULL(D.CENTRO,'-') ,
			 -- ISNULL(D.ALMACEN,'-') ,
			  ISNULL(D.ANULADO,0) ,
			  ISNULL(D.NUMERO,0) ,
			  ISNULL(P.PORCENTAJE_DESCUENTO,0),
			  ISNULL(P.VALOR_DESCUENTO,0)
		    HAVING 
             SUM(ISNULL(D.CANTIDAD,0)) < P.CANTIDAD ";
      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'VERIFY_PEDIDO':
    {
      $sql = "SELECT
	    		ISNULL(P.NUMERO_SAP,0) AS NUMERO_SAP,
				CASE WHEN ISNULL(P.TRANSFERIDO, 0) = 0 AND ISNULL(P.NUMERO_SAP,0) = 0 THEN 0 ELSE 1 END AS ESTADO
		      FROM T_PEDIDOS_TMP P
			  WHERE 
			  	P.NUMERO = '" . trim( $_POST[ 'numTMP' ] ) . "'";
      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'NUMERO_SAP':
    {
      $sql = "SELECT NUMERO_SAP FROM T_PEDIDOS_TMP WHERE NUMERO = '" . trim( $_POST[ 'numTMP' ] ) . "'";
      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'S_CUPO_CREDITO':
    {
      $sql = "SELECT 
			  V.CLIENTE,
			  V.CUPO_CREDITO,
			  SUM(V.IMPORTE) AS COMPROMETIDO,
			  V.CUPO_CREDITO-SUM(V.IMPORTE) AS DISPONIBLE,
			  ROUND(((V.CUPO_CREDITO-SUM(V.IMPORTE))*100)/ V.CUPO_CREDITO,0) AS PCJ_DISPONIBLE,
			  ROUND(((SUM(V.IMPORTE))*100)/ V.CUPO_CREDITO,0) AS PCJ_COMPROMETIDO
			FROM V_CARTERA V 
			WHERE 

			  V.CLIENTE  = '" . $_POST[ 'codigo' ] . "' AND
			  V.SOCIEDAD = '" . $_POST[ 'org' ] . "' AND 
			  V.DOCUMENTO_COMPENSACION = '-' AND
			  V.CLASE_DOCUMENTO <> 'WL' 
			GROUP by
			  V.CUPO_CREDITO,
			  V.CLIENTE";

      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'S_FERIA':
    {
      $sp = mssql_init( 'P_SEGUIMIENTO_FERIA_S' );
      mssql_bind( $sp, '@GRUPO', $_POST[ 'grupo' ], SQLINT4, false, false );
      mssql_bind( $sp, '@CODIGO_SAP', $_POST[ 'codigo' ], SQLVARCHAR, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_close();
    }
    break;
  case 'G_HUELLA':
    {
      $sql = "INSERT INTO T_HUELLA_PEDIDO (CODIGO_SAP,CODIGO_MATERIAL,CANTIDAD,OFICINA,USUARIO,NUMERO_PEDIDO,NOTA,VALOR_UNITARIO,DESCUENTO,STOCK,ORGANIZACION_VENTAS)
								VALUES ('" . $_POST[ 'codigo_sap' ] . "',
								        '" . $_POST[ 'codigo_material' ] . "',
										'" . $_POST[ 'cantidad' ] . "',
										'" . $_POST[ 'oficina' ] . "',
										'" . $_POST[ 'usuario' ] . "',
										'" . $_POST[ 'pedido' ] . "',
										'" . strtoupper( $_POST[ 'nota' ] ) . "',
										'" . $_POST[ 'valor' ] . "',
										'" . $_POST[ 'dcto' ] . "',
										'" . $_POST[ 'stock' ] . "',
										'" . $_SESSION[ "ses_NumOrg" ] . "');";
      $q = mssql_query( $sql );
      mssql_close();
    }
    break;
  case 'S_PERMISO_ZONA':
    {
      $sql = "select 
			  mp.modulos_id, 
			  mp.permisos_id,
			  p.descripcion
			from t_permisos_roles pr 
			inner join t_modulos_permisos mp on (pr.modulos_permisos_id = mp.id) 
			inner join t_permisos p on p.id = mp.permisos_id
			inner join t_modulos m on(m.id=mp.modulos_id)		   
			where 
			  pr.roles_id    = '" . $_POST[ 'rol' ] . "' and 
			  m.numero       = '0101' and 
			  mp.permisos_id = '1012'";
      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'S_GESTION_PEDIDOS_UNICO':
    {
      $sql = "select 
			p.clase,
			p.numero,
			p.organizacion_ventas,
			p.canal_distribucion,
			p.bodega,
			p.oficina_ventas,
			p.codigo_sap,
			p.cliente,
			p.nit_cliente,
			p.fecha_pedido,
			p.valor_total,
			p.destinatario,
			p.transferido,
			p.numero_sap,
			p.entrega,
			p.ot,
			p.usuario,
			p.factura,
			p.zona_ventas,
			isnull(p.notas,'') as notas
		 from v_pedidos_web p
         where 
		 	isnull(p.visible,1)=1 and 
			p.organizacion_ventas = '" . $_SESSION[ 'ses_NumOrg' ] . "' and  
			p.numero = '" . $_POST[ 'pedido' ] . "'";
      //echo $sql;
      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'CONSULTA_LOG':
    {
      $sql = "SELECT 
				D.ID,
				D.TIPO,
				D.ACCION,
				D.MENSAJE,
				D.USUARIO,
				D.FECHA_HORA,
				D.DOCUMENTO
		  FROM T_DOCUMENTOS_LOG D WHERE D.DOCUMENTO IN(";
      $sql .= "'" . $_POST[ 'Ped' ] . "',";
      $sql .= "'" . $_POST[ 'PedSAP' ] . "',";
      $sql .= "'" . $_POST[ 'Entrega' ] . "',";
      $sql .= "'" . $_POST[ 'Orden' ] . "',";
      $sql .= "'" . $_POST[ 'Factura' ] . "'";
      $sql .= ")";

      echo json_encode( GenerarArray( $sql, '' ) );
      mssql_close();
    }
    break;
  case 'VALIDA_BONIFICADO_S':
    {
      $numero = $_POST[ 'numero' ];
      $sp = mssql_init( 'P_PEDIDO_VALIDA_BONIFICADO_S' );
      mssql_bind( $sp, '@NUMERO', $numero, SQLINT4, false, false );
      $r = mssql_execute( $sp );
      // echo mssql_num_rows($r);
      if ( mssql_num_rows( $r ) > 0 ) {
        $Msj = '';
        while ( $row = mssql_fetch_array( $r ) ) {
          $Msj .= $row[ "codigo_material_n" ] . ' - ' . $row[ "descripcion" ] . ' - ';
        }
        $datos = array( 'Id' => 1,
          'Tipo' => 'error',
          'Msj' => $Msj,
          'NumPed' => $numero );
      } else {
        $datos = array( 'Id' => 0,
          'Tipo' => 'success',
          'Msj' => 'Pedido sin problemas',
          'NumPed' => $numero );
      }
      echo json_encode( $datos );
      mssql_close();
    }
    break;
  case "validar_url":
    {
      $valida = verificar_url( "https://dfnas.pwmultiroma.com/imagenesMateriales/" . $_POST[ "codigo" ] . '.png' );
      echo json_encode( array( 'existe' => $valida, 'url' => "https://dfnas.pwmultiroma.com/imagenesMateriales/" . $_POST[ "codigo" ] . '.png' ) );
    }
    break;
  case "S_GESTION_PEDIDOS_HISTORIA":
    {
      $sql = "  select 
					p.clase,
					p.numero,
					p.organizacion_ventas,
					p.canal_distribucion,
					o.descripcion as bodega,
					p.oficina_ventas,
					p.codigo_sap,
					case 
					   when t.perfil_tributario = 'pn' then t.nombres+' - '+ isnull(t.razon_comercial,'NA')
					   else t.razon_comercial+' - '+isnull(t.nombres,'NA')
					end as cliente,
					t.nit as nit_cliente,
					convert(varchar(30),p.fecha_pedido, 120) as fecha_pedido,
					cast(isnull(p.valor_total,0) as numeric(18,0)) as valor_total,
					p.destinatario,
					p.transferido,
					p.numero_sap,
					p.usuario,
					g.zona_ventas,
					dbo.LimpiarCaracteresEspeciales(p.notas) as notas,
					p.codigo_direccion
				from t_pedidos_tmp_his p
				inner join t_oficinas_ventas       o on o.oficina_ventas = p.oficina_ventas
				inner join t_terceros              t on(t.codigo_sap = p.codigo_sap) 
				inner join t_terceros_organizacion g on g.codigo_sap           = t.codigo_sap and 
														g.organizacion_ventas  = p.organizacion_ventas and
														g.canal_distribucion   = 10
			    where 
					 p.organizacion_ventas = '" . $_SESSION[ 'ses_NumOrg' ] . "' and  
					 cast(p.fecha_pedido as date) between '" . Formato_Fecha_A_M_D( $_POST[ 'fh1' ] ) . "' and '" . Formato_Fecha_A_M_D( $_POST[ 'fh2' ] ) . "'";
      if ( $_POST[ 'zona' ] > 0 ) {
        $sql .= "  and g.zona_ventas = '" . $_POST[ 'zona' ] . "'";
      }
      if ( $_POST[ 'codigo' ] != '' ) {
        $sql .= "  and p.codigo_sap = '" . $_POST[ 'codigo' ] . "'";
      }
      if ( $_POST[ 'clase' ] != 'T' ) {
        $sql .= " and p.clase = '" . $_POST[ 'clase' ] . "'";
      }
      if ( $_POST[ 'oficina' ] != '1000' && $_POST[ 'oficina' ] != '2000' ) {
        $sql .= " and p.oficina_ventas = '" . $_POST[ 'oficina' ] . "'";
      }
      echo json_encode( GenerarArray( $sql, '' ) );
    }
    break;
  case "G_PEDIDOS_HISTORIA_TMP":
    {
      $num = 0;
      $numero = $_POST[ 'numero' ];
      $respuesta = array();

      $sp = mssql_init( 'P_VOLCAR_HISTORIA_TEMPORALES' );
      mssql_bind( $sp, '@NUMERO', $numero, SQLINT4, false, false );
      mssql_bind( $sp, '@NUMERO_NUEVO', $num, SQLINT4, true, false );
      $r = mssql_execute( $sp );


      if ( $r ) {
        $respuesta[] = array(
          'error' => false,
          'mensaje' => 'Se restablecio el pedido correctamente.',
          'numero' => $num
        );
      } else {
        $respuesta[] = array(
          'error' => true,
          'mensaje' => 'Error al intentar restablecer el pedido.',
          'numero' => $num
        );
      }

      echo json_encode( $respuesta );
    }
  case 'S_PERMISOS':
    {
      $sql = "select
				  case when r.modulos_permisos_id is null then 'N' else 'S' end as chck,
				  p.titulo+'  ( '+p.descripcion+' ) ' as descripcion,
				  p.id as id_mod_per,
				  case when r.modulos_permisos_id is null then 0  else r.modulos_permisos_id end modulos_permisos_id
				from  t_modulos_permisos m
				inner join t_modulos d on d.id = m.modulos_id
				inner join t_permisos p on p.id=m.permisos_id
				left join t_permisos_roles r on r.modulos_permisos_id=m.id and r.roles_id = '" . $_POST[ 'rol' ] . "'
				where 
				d.numero = '" . $_POST[ 'modulo' ] . "'";
      $q = GenerarArray( $sql, '' );
      echo json_encode( $q );
    }
    break;
  case 'S_PUNTOS_CLIENTE':
    {
      $sql = "select 
				  t.codigo_sap,
				  t.nombres,
				  isnull(sum(p.puntos),0) as puntos
				from t_terceros t
				left join t_terceros_puntos p on p.codigo_sap = t.codigo_sap and p.organizacion_ventas = '" . $_SESSION[ "ses_NumOrg" ] . "'
				where t.codigo_sap = '" . $_POST[ 'codigo_sap' ] . "'
				group by
				  t.codigo_sap,
				  t.nombres";

      echo json_encode( GenerarArray( $sql, '' ) );
    }
    break;
  case 'S_OBSEQUIOS_PUNTOS':
    $sql = "select 
			  p.codigo_material,
			  v.descripcion,
			  p.puntos,
			  1 as stock
			from t_plan_puntos p 
			inner join v_materiales v on v.codigo_material = p.codigo_material and ( v.oficina_ventas = p.oficina_ventas or v.organizacion_ventas = p.oficina_ventas)
			where 
			  (p.oficina_ventas = '" . $_POST[ 'oficina' ] . "' or p.oficina_ventas ='" . $_POST[ 'organizacion' ] . "') and
			  v.lista = '58' and 
			  v.oficina_ventas = '" . $_POST[ 'oficina' ] . "' --and  v.stock > 0
			  ";
    $q = GenerarArray( $sql, '' );
    echo json_encode( $q );
    break;
  case 'S_OBSEQUIOS_PUNTOS_PRODUCTO':
    $sql = "select 
			  p.codigo_material,
			  v.descripcion,
			  p.puntos,
			  1 as stock
			from t_plan_puntos p 
			inner join v_materiales v on v.codigo_material = p.codigo_material and ( v.oficina_ventas = p.oficina_ventas or v.organizacion_ventas = p.oficina_ventas)
			where 
			  (p.oficina_ventas = '" . $_POST[ 'oficina' ] . "' or p.oficina_ventas ='" . $_POST[ 'organizacion' ] . "') and
			  v.lista = '" . $_POST[ 'lista' ] . "' and 
			  v.oficina_ventas = '" . $_POST[ 'oficina' ] . "' and 
			 -- v.stock > 0 and 
			  p.codigo_material = '" . $_POST[ 'codigo' ] . "'";
    $q = GenerarArray( $sql, '' );
    echo json_encode( $q );
    break;
  case 'I_CREAR_PEDIDO_REDENCION':
    $num = 0;
    $cod_msg = '';
    $msg = '';

    $org = $_SESSION[ "ses_NumOrg" ];
    $codigo_sap = $_POST[ 'codigo_sap' ];
    $puntos = $_POST[ 'puntos' ];
    $usuario = utf8_decode( $_SESSION[ 'ses_Login' ] );
    $codigo_material = $_POST[ 'codigo_material' ];


    $respuesta = array();

    $sp = mssql_init( 'P_REDIMIR_PREMIO_I' );
    mssql_bind( $sp, '@organizacion_ventas', $org, SQLVARCHAR, false, false );
    mssql_bind( $sp, '@codigo_sap', $codigo_sap, SQLVARCHAR, false, false );
    mssql_bind( $sp, '@puntos_redimir', $puntos, SQLINT4, false, false );
    mssql_bind( $sp, '@usuario', $usuario, SQLVARCHAR, false, false );
    mssql_bind( $sp, '@codigo_material', $codigo_material, SQLVARCHAR, false, false );
    mssql_bind( $sp, '@id', $num, SQLINT4, true, false );
    mssql_bind( $sp, '@cod_msg', $cod_msg, SQLVARCHAR, true, false );
    $r = mssql_execute( $sp );

    /*
	 @cod_msg = 0 -- Todo ok
	 @cod_msg = 1 -- Error al crear el pedido
	 @cod_msg = 2 -- Error sin puntos disponibles
     @cod_msg = 3 -- solicitudes abiertas con el mismo premio
   */

    switch ( $cod_msg ) {
      case '0':
        $msg = 'Solicitud creada correctamente';
        break;
      case '1':
        $msg = 'No fue posible crear la solicitud';
        break;
      case '2':
        $msg = 'No cuenta con puntos disponibles para redimir este premio.';
        break;
      case '3':
        $msg = 'Ya cuenta con solicitudes abiertas con el mismo premio, no es posible continuar.';
        break;
    }
    if ( $r ) {
      $respuesta = array(
        'error' => false,
        'cod_error' => $cod_msg,
        'mensaje' => $msg,
        'numero' => $num
      );
    } else {
      $respuesta = array(
        'error' => true,
        'cod_error' => $cod_msg,
        'mensaje' => 'No fue posible crear la solicitud.',
        'numero' => $num
      );
    }

    echo json_encode( $respuesta );
    break;
  case "enviar_sol_desbloqueo":
    $pedido = $_POST[ "pedido" ];
    $usuario = $_SESSION[ "ses_Id" ];

    //valido si ya existe una sol de desbloqueo
    $sol = GenerarArray( "SELECT TOP 1
      U.LOGIN AS USUARIO,
      S.ESTADO,
      U.ID,
      S.FECHA_SOL
      FROM T_CAR_SOL_DESBLOQUEO_PEDIDOS S
      LEFT JOIN T_USUARIOS U ON U.ID =S.USUARIO_SOL
      WHERE (S.PEDIDO=" . $pedido . " 
      AND CAST(S.FECHA_SOL AS DATE)=CAST(GETDATE() AS DATE)) OR S.ESTADO IN(2,3)", '' );


    //VALIDO si ya son las 05:30  pm 
    // Obtener la hora actual en formato 24 horas y minutos
    $currentHour = date( 'H' ); // Hora actual en formato 24 horas
    $currentMinute = date( 'i' ); // Minutos actuales

    // Definir la hora y minutos objetivo
    $targetHour = 17; // 17:00 es 05:00 PM en formato 24 horas
    $targetMinute = 30; // 30 minutos

    $fields = array(
      'pedido' => $pedido,
      'usuario_sol' => $usuario,
      'estado' => 0,
      'observacion' => $_POST[ "nota" ]
    );
    $id = insertWhidthReturnId( $fields, 'T_CAR_SOL_DESBLOQUEO_PEDIDOS', true );


    if ( $id > 0 ) {
      echo json_encode( array(
        'ok' => true,
        'solicitada' => false,
        'id' => $id
      ) );
    } else {
      echo json_encode( array(
        'ok' => false,
        'solicitada' => false,
        'id' => 0
      ) );
    }

    break;
  case "SOL_PENDIENTE":
    $usuario = $_SESSION[ "ses_Id" ];

    $solicitudes = GenerarArray( "
            select 
            pedido,
            estado
            from T_CAR_SOL_DESBLOQUEO_PEDIDOS S
            WHERE S.USUARIO_SOL= $usuario 
            AND (DATEDIFF(MINUTE,S.FECHA_FIN_GESTION,GETDATE()) <5
            OR CAST(S.FECHA_SOL AS DATE)=CAST(GETDATE() AS DATE))
          ", '' );

    echo json_encode( $solicitudes );

    break;
  case "datos_sol":
    $pedido = $_POST[ "pedido" ];
    echo json_encode( GenerarArray( 'SELECT 
      * 
      FROM T_CAR_SOL_DESBLOQUEO_PEDIDOS 
      WHERE PEDIDO=' . $pedido . ' 
      AND CAST(FECHA_SOL AS DATE)=CAST(GETDATE() AS DATE)', '' ) );
    mssql_close();
    break;
  case "status_sol_desbloqueo":
    $pedido = $_POST[ 'pedido' ];
    $sql = "select count(*) as nsolicitud
            from t_car_sol_desbloqueo_pedidos p
            where p.estado in (0, 1) and
                p.pedido = $pedido";
    echo json_encode( GenerarArray( $sql, '' ) );
    mssql_close();
    break;

  case "Cartera_edades":
    $codigo_sap = $_POST[ 'codigo_sap' ];
    $org = $_POST[ 'org' ];
    $sql = "SELECT 
            V.CLIENTE,
                SUM(V.C_SIN_VENCER) C_SIN_VENCER,
                 SUM(V.C_1_30) C_1_30,
                 SUM(V.C_31_60) C_31_60,
                 SUM(V.C_61_90)C_61_90 ,
                 SUM(V.C_91_120) C_91_120,
                 SUM(V.C_120) C_120 
          FROM ZV_CARTERA V 
          WHERE 
            V.CLIENTE            = '" . $codigo_sap . "' AND 
            V.SOCIEDAD               =  '" . $org . "'  AND 
            V.DOCUMENTO_COMPENSACION = '-' AND
            V.CLASE_DOCUMENTO       <> 'WL' AND
            V.CLASE_DOCUMENTO       <> 'DZ'    
            GROUP BY V.CLIENTE ";
    echo json_encode( GenerarArray( $sql, '' ) );
    mssql_close();
    break;
  case "Presupuesto_datos":
    $codigo_sap = $_POST[ 'codigo_sap' ];
    $org = $_POST[ 'org' ];
    $sql = "SELECT
          tcpc.VALOR_PRESUPUESTO,
          SUM(vf.P_FACTURA_NETO) AS VlrNetoTotal,
          ROUND((SUM(vf.P_FACTURA_NETO) * 100.0) / tcpc.VALOR_PRESUPUESTO, 2) AS [%CumpPpto],
          (tcpc.VALOR_PRESUPUESTO - SUM(vf.P_FACTURA_NETO)) AS Falta,
          -- Ajuste para calcular lo que debería llevar según el día actual
            (tcpc.VALOR_PRESUPUESTO / 30) * DAY(GETDATE()) AS DeberiaLlevar,
          ROUND(((tcpc.VALOR_PRESUPUESTO / 30) * DAY(GETDATE()) * 100.0) / tcpc.VALOR_PRESUPUESTO, 2) AS [%_D_LLV],
          ROUND(((SUM(vf.P_FACTURA_NETO) * 100.0) / ((tcpc.VALOR_PRESUPUESTO / 30) * DAY(GETDATE()))) - 100, 2) AS [%_Deficit],
          -- Proyección basada en el rendimiento actual ajustado a 30 días
            (SUM(vf.P_FACTURA_NETO) / DAY(GETDATE())) * 30 AS ProyVsProm,
          ROUND(((SUM(vf.P_FACTURA_NETO) / DAY(GETDATE())) * 30) * 100.0 / tcpc.VALOR_PRESUPUESTO, 2) AS [%_ProyVsProm],
          (tcpc.VALOR_PRESUPUESTO / 30) AS [ProyDiaria(100%)]
        FROM
          T_PRESUPUESTO tcpc
        LEFT JOIN v_facturacion vf 
            ON 
          vf.CODIGO_SAP = TCPC.CODIGO_SAP_CLIENTE
          AND YEAR(vf.FECHA) = YEAR(GETDATE())
          AND MONTH(vf.FECHA) = MONTH(GETDATE())
           AND vf.ORGANIZACION_VENTAS = '" . $org . "'
        WHERE
          TCPC.CODIGO_SAP_CLIENTE = '" . $codigo_sap . "'
          AND TCPC.ANIO = YEAR(GETDATE())
          AND TCPC.MES = MONTH(GETDATE())         
          AND tcpc.ORGANIZACION_VENTAS = '" . $org . "'
        GROUP BY
          tcpc.VALOR_PRESUPUESTO;";
    echo json_encode( GenerarArray( $sql, '' ) );
    mssql_close();
    break;


  case "Prioridad_ot":
    $almacen = isset( $_POST[ 'almacen' ] ) ? trim( $_POST[ 'almacen' ] ) : '';
    $ot = isset( $_POST[ 'ot' ] ) ? $_POST[ 'ot' ] : '';
    $recojeDespachos = isset( $_POST[ 'recojeDespachos' ] ) ? $_POST[ 'recojeDespachos' ] : '0';
    $recojePuntoVenta = isset( $_POST[ 'recojePuntoVenta' ] ) ? $_POST[ 'recojePuntoVenta' ] : '0';
    if ( empty( $ot ) || empty( $almacen ) ) {
      echo json_encode( [
        'Tipo' => 'E',
        'Msj' => 'Datos incompletos: ' . ( empty( $ot ) ? 'Falta número OT' : 'Falta almacén' )
      ] );
      break;
    }
    if ( $recojeDespachos === '1' || $recojePuntoVenta === '1' ) {
      $sql = "UPDATE T_SEPARACION_OT SET PRIORIDAD ='2' WHERE NUMERO_OT = '" . $ot . "' AND ALMACEN = '" . $almacen . "';";
      if ( mssql_query( $sql ) ) {
        echo json_encode( [ 'Tipo' => 'S', 'Msj' => ' Prioridad actualizada correctamente' ] );
      } else {
        echo json_encode( [ 'Tipo' => 'E', 'Msj' => 'Error al guardar prioridad' ] );
      }
      mssql_close();
    }
    break;
  case "Top_20_mas_vendidos_con_copi":
    $org = $_POST[ 'org' ];
    $oficina = $_POST[ 'oficina' ];
    $lista = $_POST[ 'lista' ];
    $sql = "WITH Grupo100 AS (
                        SELECT TOP 20 v.codigo_material
                        FROM v_facturacion v
                        INNER JOIN V_MATERIALES_STOCK tms 
                            ON tms.CODIGO_MATERIAL = v.CODIGO_MATERIAL 
                            AND tms.OFICINA_VENTAS = '" . $oficina . "' 
                        WHERE 
                            v.tipo_factura IN ('zf01','zf03','zf05','zf07','zf09','zf10','zf11','zf12') 
                            AND v.organizacion_ventas = '" . $org . "'
                            AND v.GRUPO1 = '100'
                            AND v.p_neto > 0
                            AND CAST(v.FECHA_HORA AS DATETIME) >= DATEADD(HOUR, 16, CAST(CAST(DATEADD(DAY, -1, GETDATE()) AS DATE) AS DATETIME))
                            AND CAST(v.FECHA_HORA AS DATETIME) <= GETDATE()
                        GROUP BY v.CODIGO_MATERIAL
                        HAVING SUM(tms.STOCK) > 30
                        ORDER BY COUNT(v.codigo_material) DESC
                    ), 
                    Grupo130 AS (
                        SELECT TOP 20 v.codigo_material
                        FROM v_facturacion v
                        INNER JOIN V_MATERIALES_STOCK tms 
                            ON tms.CODIGO_MATERIAL = v.CODIGO_MATERIAL 
                            AND tms.OFICINA_VENTAS = '" . $oficina . "' 
                        WHERE 
                            v.tipo_factura IN ('zf01','zf03','zf05','zf07','zf09','zf10','zf11','zf12') 
                            AND v.organizacion_ventas = '" . $org . "'
                            AND v.GRUPO1 = '100'
                            AND v.GRUPO2 = '130'
                            AND v.p_neto > 0
                            AND CAST(v.FECHA_HORA AS DATETIME) >= DATEADD(HOUR, 16, CAST(CAST(DATEADD(DAY, -1, GETDATE()) AS DATE) AS DATETIME))
                            AND CAST(v.FECHA_HORA AS DATETIME) <= GETDATE()
                        GROUP BY v.CODIGO_MATERIAL
                        HAVING SUM(tms.STOCK) > 30
                        ORDER BY COUNT(v.codigo_material) DESC
                    )
                    SELECT 
                        tm.CODIGO_MATERIAL,
                        CASE 
                            WHEN g130.codigo_material IS NOT NULL THEN 1 
                            ELSE 0 
                        END AS GRUPO_130
                    FROM T_MATERIALES tm
                    INNER JOIN Grupo100 g100 ON tm.CODIGO_MATERIAL = g100.codigo_material
                    LEFT JOIN Grupo130 g130 ON tm.CODIGO_MATERIAL = g130.codigo_material;";
    echo json_encode( GenerarArray( $sql, '' ) );
    mssql_close();
    break;
  case "MAIL_REDENCIONES":
    $id = $_POST[ 'id' ];
    $sql = "select 
                  r.codigo_material,
                  r.codigo_sap,
                  r.oficina_ventas,
                  r.organizacion_ventas,
                  r.puntos,
                  r.usuario,
                  t.nombres,
                  t.razon_comercial,
                  t.nit,
                  isnull(m.descripcion2,m.descripcion) as material,
                  t.email
                from t_redencion_puntos r 
                inner join t_terceros t on t.codigo_sap = r.codigo_sap 
                inner join t_materiales m on m.codigo_material = r.codigo_material
                where 
                   r.id = $id ";
    $dato = mssql_fetch_array( mssql_query( $sql ) );

    mssql_close();

    require_once( '../resources/PhPMailer/Email.php' );
    $org = '';
    $slogan = '';
    $titulo = '';
    $asunto = '';
    if ( $dato[ 'organizacion_ventas' ] == '1000' ) {
      $titulo = 'Nueva redención de puntos Multidrogas de colombia!';
      $url = 'www.multidrogas.com';
      $slogan = 'CM de Colombia S.A.S el socio leal y estratégico del droguista colombiano';
      $asunto = 'Redenciones WEB CM';
    } else {
      $titulo = 'Nueva redención de puntos Distribuidora Roma!';
      $url = 'www.dfroma.com';
      $slogan = 'Distribuidora farmaceutica ROMA S.A';
      $asunto = 'Redenciones WEB ROMA';
    }
    $msg = '<!doctype html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de Redención de Puntos</title>
            <style type="text/css">
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .email-container {
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .email-header {
                    background-color: #2c3e50;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    font-size: 18px;
                    font-weight: bold;
                }
                .email-body {
                    padding: 20px;
                    background-color: #ffffff;
                }
                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                }
                .info-table td {
                    padding: 12px;
                    border-bottom: 1px solid #e0e0e0;
                }
                .info-table tr:last-child td {
                    border-bottom: none;
                }
                .label {
                    font-weight: bold;
                    color: #2c3e50;
                    width: 30%;
                }
                .highlight {
                    background-color: #f8f9fa;
                }
                .email-footer {
                    background-color: #f8f9fa;
                    padding: 15px;
                    text-align: center;
                    font-size: 12px;
                    color: #666666;
                }
                .points-badge {
                    display: inline-block;
                    background-color: #27ae60;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-weight: bold;
                }
                a {
                    color: #3498db;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    CONFIRMACIÓN DE REDENCIÓN DE PUNTOS
                </div>

                <div class="email-body">
                    <p style="text-align: center; margin-bottom: 25px;">
                        ¡Felicitaciones! Has redimido exitosamente tus puntos por un obsequio.
                    </p>

                    <table class="info-table">
                        <tr>
                            <td class="label">Producto Redimido:</td>
                            <td>' . $dato[ 'codigo_material' ] . ' / ' . $dato[ 'material' ] . '</td>
                        </tr>
                        <tr class="highlight">
                            <td class="label">NIT:</td>
                            <td>' . $dato[ 'nit' ] . '</td>
                        </tr>
                        <tr>
                            <td class="label">Cliente:</td>
                            <td>' . $dato[ 'razon_comercial' ] . ' / ' . $dato[ 'nombres' ] . '</td>
                        </tr>
                        <tr class="highlight">
                            <td class="label">Puntos Redimidos:</td>
                            <td><span class="points-badge">' . $dato[ 'puntos' ] . ' puntos</span></td>
                        </tr>
                    </table>

                    <p style="text-align: center; margin-top: 25px;">
                        Gracias por participar en nuestro programa de fidelización.
                    </p>
                </div>

                <div class="email-footer">
                    <p>' . $slogan . '</p>
                    <p><a href="' . $url . '">' . $url . '</a></p>
                    <p style="margin-top: 10px;">© ' . date( 'Y' ) . ' Todos los derechos reservados</p>
                </div>
            </div>
        </body>
        </html>';

    $para = 'sistemas@multidrogas.com';
    if ( $dato[ 'email' ] != '' ) {
      $para .= ";" . $dato[ 'email' ];
    }
    EnviarMail( $titulo, $msg, $asunto, $para );
    break;
}
?>