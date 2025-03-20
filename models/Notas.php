<?php
error_reporting( 0 );
ini_set( 'memory_limit', '-1' );
include( 'funciones.php' );
session_start();
conectar();

function GruposArticulos( $idNegocio ) {
  $grupos = '';
  $sql = "select distinct
			     a.grupo_articulo+' - '+a.descripcion1 as grupo_articulo
			  from t_negocios_especiales_det d 
			  inner join t_materiales m on m.codigo_material = d.codigo_material
			  inner join t_grupos_articulos a on a.grupo_articulo = m.grupo_articulos
			  where d.id_negocio = '" . $idNegocio . "' ";
  $q = mssql_query( $sql );
  while ( $row = mssql_fetch_array( $q ) ) {
    $grupos .= trim( utf8_encode( $row[ 'grupo_articulo' ] ) ) . ' - ';
  }
  return trim( $grupos, ' - ' );
}

function facturasNegocio( $idNegocio ) {
  $fact = '';
  $sql = "select numero_factura from t_negocios_especiales_factura d where d.id_negocio = " . $idNegocio . " ";
  $q = mssql_query( $sql );
  while ( $row = mssql_fetch_array( $q ) ) {
    $fact .= trim( utf8_encode( $row[ 'numero_factura' ] ) ) . ' - ';
  }
  return trim( $fact, ' - ' );

}


switch ( $_POST[ 'op' ] ) {
  case 'S_TERCEROS_PROV':
    {
      $sql = "select
					t.codigo_sap, 
					isnull(t.nombres,'') as nombres,
					isnull(t.razon_comercial,'') as razon,
					t.nit
				from t_terceros t 
				where 
				    t.tipo_tercero = 'Z006'";
      $q = GenerarArray( $sql, '' );
      echo json_encode( $q );
    }
    break;
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
  case 'S_MATERIALES':
    {
      $grupo = '';
      if ( isset( $_POST[ 'grupo' ] ) ) {
        for ( $i = 0; $i < count( $_POST[ 'grupo' ] ); $i++ ) {
          $grupo .= "'" . $_POST[ 'grupo' ][ $i ] . "',";

        }
      }
      $sql = "select 
			  m.tipo_material,
			  m.codigo_material,
			  m.descripcion,
			  m.valor_unitario,
			  cast(m.iva as int) as iva,
			  m.descuento,
			  m.stock ,
			  cast(m.valor_neto as float) as valor_neto,
			  cast(m.valor_bruto as float) as valor_bruto
			from v_materiales m 
			where
			  isnull(m.bloqueo_venta,0) = 0 and 
			  isnull(m.anulada,0)       = 0 and							
			  m.oficina_ventas          = '" . $_POST[ 'oficina' ] . "' and
			  m.lista                   = '" . $_POST[ 'lista' ] . "' and 
			  m.valor_unitario          > 0 and
			  m.tipo_material in('ZFAR','ZFAO','ZFAL','ZREG','ZEPS','ZFEV')  and 
			  m.grupo_articulos  in( " . trim( utf8_decode( $grupo ), ',' ) . " )";


      $q = GenerarArray( $sql, '' );

      echo json_encode( $q );
    }
    break;
  case "U_IMAGEN":
    {
      $return = array( 'ok' => TRUE );
      $upload_folder = '../../ImagenesNotas';
      $nombre = $_POST[ 'nombre' ] . '-' . date( 'Ymd H:i:s' );
      $result = array();


      $nombre_archivo = $_FILES[ 'archivo' ][ 'name' ];
      $tipo_archivo = $_FILES[ 'archivo' ][ 'type' ];
      $tipo_archivo = explode( "/", $tipo_archivo );

      $tipo_archivo = $_FILES[ 'archivo' ][ 'type' ];
      $tamano_archivo = $_FILES[ 'archivo' ][ 'size' ];
      $tmp_archivo = $_FILES[ 'archivo' ][ 'tmp_name' ];
      $archivador = $upload_folder . '/' . $nombre . '.jpeg';
      if ( !move_uploaded_file( $tmp_archivo, $archivador ) ) {
        $result = array(
          'status' => false,
          'mensaje' => 'Error al subir la imagen',
          'nombre' => ''
        );
      } else {
        $result = array(
          'status' => true,
          'mensaje' => 'Imagen cargada correctamente',
          'nombre' => $nombre . '.jpeg'
        );
      }
      echo json_encode( $result );
    }
    break;
  case 'G_SOLICITUD':
    {


      $respuesta = array();
      $nota = "-";
      $id = 0;
      $materiales = $_POST[ 'Materiales' ];

      $sp = mssql_init( 'P_NEGOCIOS_ESPECIALES_I' );
      mssql_bind( $sp, '@CODIGO_SAP', $_POST[ "Codigo" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@OFICINA_VENTAS', $_POST[ "Oficina" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@LISTA', $_POST[ "Lista" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@TIPO_NEGOCIO', $_POST[ "TipoNegocio" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@VALOR_NEGOCIO', $_POST[ "vlrNegocio" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@DESCUENTO', $_POST[ "Descuento" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@VALOR_DESCUENTO', $_POST[ "vlrDescuento" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@SOPORTE', $_POST[ "NombreImg" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@USUARIO', utf8_decode( $_SESSION[ "ses_Login" ] ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@GRUPO_ARTICULO', $_POST[ "Grupo" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@NOTAS', $_POST[ "Nota" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@ID', $id, SQLINT4, true, false );
      mssql_execute( $sp );

      if ( $id > 0 ) {
        $sql = "";
        for ( $i = 0; $i <= count( $materiales ) - 1; $i++ ) {
          $sql .= "INSERT INTO T_NEGOCIOS_ESPECIALES_DET ( ID_NEGOCIO, CODIGO_MATERIAL, CANTIDAD ) VALUES ( " . $id . ",'" . $materiales[ $i ][ 'codigo' ] . "','" . $materiales[ $i ][ 'cantidad' ] . "' );";
        }

        if ( mssql_query( $sql ) ) {
          $respuesta = array(
            'error' => false,
            'mensaje' => 'Se inserto correctamente el registro!',
            'id' => $id
          );
        } else {
          $respuesta = array(
            'error' => true,
            'mensaje' => 'Error al intentar insertar el registro!',
            'id' => $id
          );
        }
      } else {
        $respuesta = array(
          'error' => true,
          'mensaje' => 'Error al intentar insertar el registro!',
          'id' => $id
        );
      }
      echo json_encode( $respuesta );
    }
    break;
  case 'S_SOLICITUD':
    {
      $sql = "select
				  e.oficina_ventas,
				  e.tipo_negocio,
				  case e.tipo_negocio
					  when 'G' then 'GERENCIA'
					  when 'P' then 'PROVEEDOR'
					  when 'M' then 'MERCADEO'
					  when 'C' then 'COMERCIAL'
					  when 'O' then 'COMPRAS'
				  end as tipo_negocio_desc,
				  e.fecha_hora, 
				  cast(e.fecha_hora as date) as fecha,
				  e.id,
				  e.codigo_sap,
				  t.nombres,
				  isnull(t.razon_comercial,'') as razon_comercial,
				  e.valor_negocio,
				  e.descuento,
				  e.valor_descuento,
				  e.soporte,
				  e.usuario,
				  upper(u.nombres) +' '+ upper(u.apellidos) as nombre_usuario,
				  e.notas,
				  e.estado,
				  e.grupo_articulo+ ' - ' +a.descripcion1 as grupo,
				  numero_factura = isnull((select count(*) from t_negocios_especiales_factura f where f.id_negocio = e.id),0),
				  valor_factura  = isnull((select sum(f.valor) from t_negocios_especiales_factura f where f.id_negocio = e.id),0),
				  e.tipo_estado,
				  e.nota_fecha_doc ,
				  e.nota_fecha_cont ,
				  e.nota_cuenta_mayor ,
				  e.nota_centro_costo ,
				  e.nota_centro_beneficio ,
				  e.nota_texto1 ,
				  e.nota_texto2,
				  e.nota_valor,
				  isnull(e.nota_numero,0) as nota_numero,
				  o.condicion_pago,       
				  c.descripcion as condicion_desc,
				  c.descuento as dcto_financiero,
				  e.nota_centro_beneficio_prov,
                  e.nota_centro_costo_prov,
                  e.nota_cuenta_mayor_prov,
                  e.nota_texto1_prov,
                  e.nota_texto2_prov,
                  isnull(e.nota_numero_prov,0) as nota_numero_prov,
                  e.nota_fecha_pago_prov,
				  e.nota_codigo_sap_prov,
				  o.organizacion_ventas,
                  --AUTORIZACION Y APROBACION
                  isnull(e.usuario_modifica,'-') as usuario_modifica,
                  e.fecha_modifica,
                  isnull(e.usuario_aprueba,'-') as usuario_aprueba,
                  e.fecha_aprobacion,
				  GruposArticulos =  ''
					  
				from t_negocios_especiales e 
				inner join t_terceros t on t.codigo_sap = e.codigo_sap
				inner join t_terceros_organizacion o on o.codigo_sap = t.codigo_sap and o.oficina_ventas = e.oficina_ventas and o.canal_distribucion = '10'
				left join t_condiciones_pago c on c.condicion = o.condicion_pago
				inner join t_usuarios u on u.login = e.usuario
				left join t_grupos_articulos a on a.grupo_articulo = e.grupo_articulo
				where 
				 o.organizacion_ventas = '" . $_SESSION[ 'ses_NumOrg' ] . "' and  
				 isnull(e.anulada,0) = 0 and
				 cast(e.fecha_hora as date) between cast('" . $_POST[ 'fhini' ] . "' as date) and cast('" . $_POST[ 'fhfin' ] . "' as date)";

      if ( $_POST[ 'oficina' ] != '1000' && $_POST[ 'oficina' ] != '2000' ) {
        $sql .= " and e.oficina_ventas = '" . $_POST[ 'oficina' ] . "'";
      }

      if ( $_POST[ 'estado' ] != '' ) {
        $sql .= " and e.estado = '" . $_POST[ 'estado' ] . "'";
      }

      if ( $_POST[ 'tnegocio' ] != '' ) {
        $sql .= " and e.tipo_negocio = '" . $_POST[ 'tnegocio' ] . "'";
      }

      if ( $_POST[ 'Perm_Autorizar' ] != 'S' && $_POST[ 'Perm_Visualizar' ] != 'S' ) {
        //// $sql .= " and e.usuario = '" . utf8_decode($_SESSION[ 'ses_Login' ]). . "'";
        $sql .= " and o.zona_ventas in (select zona_ventas from t_usuarios_zonas where id_usuario = '" . $_SESSION[ 'ses_Id' ] . "')";
      }

      //echo $sql;

      $q = mssql_query( $sql );
      $datos = array();
      while ( $row = mssql_fetch_array( $q ) ) {
        $ruta = '';
        if ( $row[ "soporte" ] != '' ) {
          $ruta = '../../ImagenesNotas/' . $row[ "soporte" ];
        } else {
          $ruta = '../../ImagenesNotas/no_imagen.png';
        }


        $grupos = GruposArticulos( $row[ "id" ] );
        $facturas = facturasNegocio( $row[ "id" ] );

        $datos[] = array(
          'id' => $row[ "id" ],
          'fecha_hora' => $row[ "fecha_hora" ],
          'codigo_sap' => $row[ "codigo_sap" ],
          'nombres' => utf8_encode( $row[ "nombres" ] ),
          'razon_comercial' => utf8_encode( $row[ "razon_comercial" ] ),
          'valor_negocio' => $row[ "valor_negocio" ],
          'descuento' => $row[ "descuento" ],
          'valor_descuento' => $row[ "valor_descuento" ],
          'usuario' => utf8_encode( $row[ "usuario" ] ),
          'nombre_usuario' => utf8_encode( $row[ "nombre_usuario" ] ),
          'notas' => utf8_encode( $row[ "notas" ] ),
          'estado' => $row[ "estado" ],
          'soporte' => $ruta,
          'grupo' => $row[ 'grupo' ],
          'oficina_ventas' => $row[ 'oficina_ventas' ],
          'tipo_neg_desc' => $row[ 'tipo_negocio_desc' ],
          'tipo_neg' => $row[ 'tipo_negocio' ],
          'fecha' => $row[ 'fecha' ],
          'factura' => $row[ 'numero_factura' ],
          'valor_factura' => $row[ 'valor_factura' ],
          'tipo_estado' => $row[ 'tipo_estado' ],
          'condicion_pago' => utf8_encode( trim( $row[ 'condicion_pago' ] ) ),
          'condicion_desc' => utf8_encode( trim( $row[ 'condicion_desc' ] ) ),
          'dcto_financiero' => utf8_encode( trim( $row[ 'dcto_financiero' ] ) ),
          //Datos de la nota
          'nota_fecha_doc' => $row[ 'nota_fecha_doc' ],
          'nota_fecha_cont' => $row[ 'nota_fecha_cont' ],
          'nota_cuenta_mayor' => trim( $row[ 'nota_cuenta_mayor' ] ),
          'nota_centro_costo' => trim( $row[ 'nota_centro_costo' ] ),
          'nota_centro_beneficio' => trim( $row[ 'nota_centro_beneficio' ] ),
          'nota_texto1' => utf8_encode( trim( $row[ 'nota_texto1' ] ) ),
          'nota_texto2' => utf8_encode( trim( $row[ 'nota_texto2' ] ) ),
          'nota_numero' => trim( $row[ 'nota_numero' ] ),
          'nota_valor' => trim( $row[ 'nota_valor' ] ),
          //Datos de la nota proveedor
          'nota_centro_beneficio_prov' => trim( $row[ 'nota_centro_beneficio_prov' ] ),
          'nota_centro_costo_prov' => trim( $row[ 'nota_centro_costo_prov' ] ),
          'nota_cuenta_mayor_prov' => trim( $row[ 'nota_cuenta_mayor_prov' ] ),
          'nota_texto1_prov' => utf8_encode( trim( $row[ 'nota_texto1_prov' ] ) ),
          'nota_texto2_prov' => utf8_encode( trim( $row[ 'nota_texto2_prov' ] ) ),
          'nota_numero_prov' => trim( $row[ 'nota_numero_prov' ] ),
          'nota_fecha_pago_prov' => trim( $row[ 'nota_fecha_pago_prov' ] ),
          'nota_codigo_sap_prov' => trim( $row[ 'nota_codigo_sap_prov' ] ),
          //Datos de autorizacion y aprobacion
          'usuario_autoriza' => utf8_encode( trim( $row[ 'usuario_modifica' ] ) ),
          'usuario_aprueba' => utf8_encode( trim( $row[ 'usuario_aprueba' ] ) ),
          'fecha_autoriza' => trim( $row[ 'fecha_modifica' ] ),
          'fecha_aprueba' => trim( $row[ 'fecha_aprobacion' ] ),
          'GruposArticulos' => $grupos,
          'facturas' => $facturas

          /*,
		  'SQL' => $sql	*/

        );
      } //for
      echo json_encode( $datos );
    }
    break;
  case 'S_SOLICITUD_DETALLE':
    {
      $sql = "select 
					e.id,
					e.codigo_material,
					isnull(m.descripcion2,m.descripcion) as descripcion,
					e.cantidad
				from t_negocios_especiales_det e 
				inner join t_materiales m on m.codigo_material = e.codigo_material
				where 
					e.id_negocio = " . $_POST[ "id" ];
      $q = GenerarArray( $sql, '' );
      echo json_encode( $q );
    }
    break;
  case 'U_ESTADO_SOL':
    {
      $id = $_POST[ "id" ];
      $estado = $_POST[ 'estado' ];
      $sql = "update t_negocios_especiales set 
	            estado           = '" . $estado . "', 
				tipo_estado      = '" . $_POST[ 'tipo' ] . "',
				usuario_modifica = '" . utf8_decode( $_SESSION[ "ses_Login" ] ) . "',
				fecha_modifica   = getdate()
			  where 
			    id = " . $id;
      if ( mssql_query( $sql ) ) {
        $respuesta = array(
          'error' => false,
          'mensaje' => 'Se actualizo correctamente el registro!',
          'id' => $id
        );
      } else {
        $respuesta = array(
          'error' => true,
          'mensaje' => 'Error al intentar actualizar el registro!',
          'id' => $id
        );
      }
      echo json_encode( $respuesta );
    }
    break;
  case 'U_SOLICITUD':
    {

      $sql = "update t_negocios_especiales set 
		          valor_negocio   = '" . $_POST[ 'vlrNegocio' ] . "', 
				  descuento       = '" . $_POST[ 'pcjDescuento' ] . "',
				  valor_descuento = '" . $_POST[ 'GesVlrDescuento' ] . "',
				  tipo_negocio    = '" . $_POST[ 'TipoNegocio' ] . "'
			  where 
				  id = " . $_POST[ "GesId" ];

      if ( mssql_query( $sql ) ) {
        $respuesta = array(
          'error' => false,
          'mensaje' => 'Se actualizo correctamente el registro!',
          'id' => $_POST[ "GesId" ]
        );
      } else {
        $respuesta = array(
          'error' => true,
          'mensaje' => 'Error al intentar actualizar el registro!',
          'id' => $_POST[ "GesId" ]
        );
      }
      echo json_encode( $respuesta );
    }
    break;
  case 'D_SOLICITUD':
    {
      $sql = "delete from t_negocios_especiales where  id = " . $_POST[ "id" ] . ";
	         delete from t_negocios_especiales_det where  id_negocio = " . $_POST[ "id" ] . ";";

      if ( mssql_query( $sql ) ) {
        $respuesta = array(
          'error' => false,
          'mensaje' => 'Se elimino correctamente el registro!',
          'id' => $_POST[ "id" ]
        );
      } else {
        $respuesta = array(
          'error' => true,
          'mensaje' => 'Error al intentar elimino el registro!',
          'id' => $_POST[ "GesId" ]
        );
      }
      echo json_encode( $respuesta );
    }
    break;
  case 'S_FACTURA':
    {
      $fecha = $_POST[ 'fecha' ];
      $sql = "SELECT 
				  D.NUMERO_FACTURA,
				  SUM(D.VALOR_NETO) AS VALOR_NETO,
				  ---ANTERIOR
                    --- ROUND(SUM(D.VALOR_NETO)*(1-(C.DESCUENTO/100)),0) AS VALOR_NETO_PP,
                  ---ANTERIOR
                  ---NUEVO 2024-11-14
                 SUM( ROUND((D.VALOR_NETO) * CASE 
                            WHEN SUBSTRING(D.CODIGO_MATERIAL, 1, 1) = 9 
                            THEN 1 
                            ELSE (1 - (CAST(C.DESCUENTO AS DECIMAL(18,2)) / 100)) 
                          END, 0) ) AS VALOR_NETO_PP,
                  ---NUEVO 2024-11-14
				  CONVERT(VARCHAR, CAST(F.FECHA_HORA AS DATETIME), 120) AS FECHA_HORA,
				  C.DESCUENTO,
				  CASE WHEN (SELECT CONVERT(VARCHAR, CAST(E.FECHA_HORA AS DATETIME), 120) FROM T_NEGOCIOS_ESPECIALES E  WHERE E.ID = '" . $_POST[ 'id' ] . "'  ) < CONVERT(VARCHAR, CAST(F.FECHA_HORA AS DATETIME), 120) THEN 0  ELSE 1 END AS ESTADO
				FROM T_PEDIDOS_FACTURA_DETALLE D
				INNER JOIN T_PEDIDOS_FACTURA F ON F.NUMERO_FACTURA = D.NUMERO_FACTURA AND F.NUMERO_PEDIDO = D.NUMERO_PEDIDO
				INNER JOIN T_TERCEROS_ORGANIZACION O  ON O.CODIGO_SAP = F.CODIGO_SAP AND O.ORGANIZACION_VENTAS = F.ORGANIZACION_VENTAS AND O.CANAL_DISTRIBUCION = F.CANAL_DISTRIBUCION
				LEFT JOIN T_CONDICIONES_PAGO C ON C.CONDICION = O.CONDICION_PAGO
			  WHERE 
				SUBSTRING(D.CODIGO_MATERIAL,2,10) IN (
									   SELECT SUBSTRING(N.CODIGO_MATERIAL,2,10)  FROM T_NEGOCIOS_ESPECIALES_DET N  WHERE N.ID_NEGOCIO = '" . $_POST[ 'id' ] . "' 
				                      )AND 
				F.CODIGO_SAP = '" . $_POST[ 'codigo_sap' ] . "'  AND
				D.NUMERO_FACTURA = '" . $_POST[ 'factura' ] . "'  AND
				CAST (F.FECHA_HORA AS DATE) BETWEEN '" . $fecha . "'  AND EOMONTH('" . $fecha . "' )
			  GROUP BY 
				D.NUMERO_FACTURA,
				CONVERT(VARCHAR, CAST(F.FECHA_HORA AS DATETIME), 120),
				C.DESCUENTO";
      $datos = GenerarArray( $sql, '' );
      echo json_encode( $datos );
    }
    break;
  case 'G_FACTURA':
    {
      $msj = "";
      $id = 0;
      $sp = mssql_init( 'P_FACTURAS_NEGOCIOS_ESPECIALES_I' );
      mssql_bind( $sp, '@ID_NEGOCIO', $_POST[ "id" ], SQLINT4, false, false );
      mssql_bind( $sp, '@NUMERO_FACTURA', $_POST[ "factura" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@VALOR_FACTURA', $_POST[ "valor_factura" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@VALOR_FACTURA_PP', $_POST[ "valor_factura_pp" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@TIPO_NEGOCIO', $_POST[ "tipoNegocio" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@ORGANIZACION', $_SESSION[ 'ses_NumOrg' ], SQLVARCHAR, false, false ); //Nuevo campo
      mssql_bind( $sp, '@ID', $id, SQLINT4, true, false );
      mssql_bind( $sp, '@MSJ', $msj, SQLVARCHAR, true, false );

      if ( !mssql_execute( $sp ) ) {
        $respuesta = array(
          'error' => true,
          'mensaje' => 'Error al ejecutar el procedimiento',
          'id' => $_POST[ "id" ]
        );
      } else {
        if ( $id != 0 ) {
          $respuesta = array(
            'error' => false,
            'mensaje' => $msj,
            'id' => $id
          );
        } else {
          $respuesta = array(
            'error' => true,
            'mensaje' => $msj,
            'id' => $id
          );
        }
      }

      echo json_encode( $respuesta );
    }
    break;
  case 'S_FACTURAS_NOTAS':
    {
      $sql = "select 
				  f.id,
				  f.id_negocio,
				  f.numero_factura,
				  f.valor,
				  f.valor_pp
				from t_negocios_especiales_factura f 
				where 
				  f.id_negocio = " . $_POST[ 'id' ];
      $datos = GenerarArray( $sql, '' );
      echo json_encode( $datos );
    }
    break;
  case 'U_SOLICITUD_NOTA':
    {
      $sql = "update t_negocios_especiales set 
				  nota_fecha_doc              = '" . Formato_Fecha_A_M_D( $_POST[ 'fhDoc' ] ) . "',
				  nota_fecha_cont             = '" . Formato_Fecha_A_M_D( $_POST[ 'fhCont' ] ) . "',
				  nota_cuenta_mayor           = '" . $_POST[ 'cuenta' ] . "',
				  nota_centro_costo           = '" . $_POST[ 'CentroCosto' ] . "',
				  nota_centro_beneficio       = '" . $_POST[ 'CentroBene' ] . "',
				  nota_texto1                 = '" . $_POST[ 'texto1' ] . "',
				  nota_texto2                 = '" . $_POST[ 'texto2' ] . "',
				  nota_valor                  = '" . $_POST[ 'vlrNota' ] . "',
				  nota_cuenta_mayor_prov      = '" . $_POST[ 'cuentaProv' ] . "',
				  nota_centro_costo_prov      = '" . $_POST[ 'CentroCostoProv' ] . "',
				  nota_centro_beneficio_prov  = '" . $_POST[ 'CentroBeneProv' ] . "',
				  nota_texto1_prov            = '" . $_POST[ 'textoProv1' ] . "',
				  nota_texto2_prov            = '" . $_POST[ 'textoProv2' ] . "',
				  nota_fecha_pago_prov        = '" . Formato_Fecha_A_M_D( $_POST[ 'fhPago' ] ) . "',
				  nota_codigo_sap_prov        = '" . $_POST[ 'CodigoProv' ] . "',
				  estado                      = 'D',
				  nota_usuario_diligencia     = '" . utf8_decode( $_SESSION[ "ses_Login" ] ) . "',
				  nota_fecha_diligencia       = getdate(),
				  nota_fondo                  = '" . $_POST[ 'TipoAplicacion' ] . "'
				where 
				  id = " . $_POST[ "id" ];

      if ( mssql_query( $sql ) ) {
        $respuesta = array(
          'error' => false,
          'mensaje' => 'Se actualizo correctamente el registro!',
          'id' => $_POST[ "id" ]
        );
      } else {
        $respuesta = array(
          'error' => true,
          'mensaje' => 'Error al intentar actualizar el registro!',
          'id' => $_POST[ "id" ]
        );
      }
      echo json_encode( $respuesta );
    }
    break;
  case 'G_DESCUENTOS_MATERIALES':
    {
      $materiales = $_POST[ 'Materiales' ];
      $tipo = $_POST[ 'tipo' ];
      $desc = $_POST[ 'desc' ];
      $lista = $_POST[ 'lista' ];
      $oficina = '*';
      $Grupo = '*';
      $org = $_POST[ 'org' ];
      $centro = $_POST[ 'centro' ];
      $clase = $_POST[ 'clase' ];
      $CodigoSAP = $_POST[ 'CodigoSAP' ];
      $fhini = date( 'Y-m-d' );
      $fhfin = date( 'Y-m-d' );
      $sw = 0;
      for ( $i = 0; $i <= count( $materiales ) - 1; $i++ ) {
        $sp = mssql_init( 'P_DESCUENTOS_ADG_I' );
        mssql_bind( $sp, '@CODIGO', $materiales[ $i ][ 'codigo' ], SQLVARCHAR, false, false );
        mssql_bind( $sp, '@TIPO', $tipo, SQLVARCHAR, false, false );
        mssql_bind( $sp, '@DESCUENTO', $desc, SQLINT4, false, false );
        mssql_bind( $sp, '@FECHAINI', $fhini, SQLVARCHAR, false, false );
        mssql_bind( $sp, '@FECHAFIN', $fhfin, SQLVARCHAR, false, false );
        mssql_bind( $sp, '@CLASE_PED', $clase, SQLVARCHAR, false, false );
        mssql_bind( $sp, '@LISTA', $lista, SQLVARCHAR, false, false );
        mssql_bind( $sp, '@OFICINA', $oficina, SQLVARCHAR, false, false );
        mssql_bind( $sp, '@ORGANIZACION', $org, SQLVARCHAR, false, false );
        mssql_bind( $sp, '@CENTRO', $centro, SQLVARCHAR, false, false );
        mssql_bind( $sp, '@USUARIO', utf8_decode( $_SESSION[ 'ses_Login' ] ), SQLVARCHAR, false, false );
        mssql_bind( $sp, '@CODIGO_SAP', $CodigoSAP, SQLVARCHAR, false, false );
        mssql_bind( $sp, '@GRUPO1', $Grupo, SQLVARCHAR, false, false );
        if ( !mssql_execute( $sp ) ) {
          $respuesta = array(
            'error' => true,
            'mensaje' => 'Error al crear descuento',
            'codigo' => $materiales[ $i ][ 'codigo' ]
          );
          echo json_encode( $respuesta );
          return false;

        }
      }
      $respuesta = array(
        'error' => false,
        'mensaje' => 'Descuentos creados correctamente',
        'codigo' => ''
      );
      echo json_encode( $respuesta );
    }
    break;
  case 'U_FINALIZA_FACT':
    {
      $id = $_POST[ "id" ];
      $sql = "update t_negocios_especiales set 
	            estado                   = 'G', 
				usuario_finaliza_factura = '" . utf8_decode( $_SESSION[ "ses_Login" ] ) . "',
				fecha_finaliza_factura   = getdate()
			  where 
			    id = " . $id;
      if ( mssql_query( $sql ) ) {
        $respuesta = array(
          'error' => false,
          'mensaje' => 'Se actualizo correctamente el registro!',
          'id' => $id
        );
      } else {
        $respuesta = array(
          'error' => true,
          'mensaje' => 'Error al intentar actualizar el registro!',
          'id' => $id
        );
      }
      echo json_encode( $respuesta );
    }
    break;
  case 'U_ANULA_SOL':
    {
      $id = $_POST[ "id" ];
      $sql = "update t_negocios_especiales set 
	            anulada       = 1, 
				usuario_anula = '" . utf8_decode( $_SESSION[ "ses_Login" ] ) . "',
				fecha_anula   = getdate()
			  where 
			    id = " . $id;

      if ( mssql_query( $sql ) ) {
        $respuesta = array(
          'error' => false,
          'mensaje' => 'Se anular correctamente el registro!',
          'id' => $id
        );
      } else {
        $respuesta = array(
          'error' => true,
          'mensaje' => 'Error al intentar anular el registro!',
          'id' => $id
        );
      }
      echo json_encode( $respuesta );
    }
    break;
  case 'S_SOLICITUD_ID':
    {
      $sql = "select
				  e.oficina_ventas,
				  e.tipo_negocio,
				  case e.tipo_negocio
					  when 'G' then 'GERENCIA'
					  when 'P' then 'PROVEEDOR'
					  when 'M' then 'MERCADEO'
					  when 'C' then 'COMERCIAL'
					  when 'O' then 'COMPRAS'
				  end as tipo_negocio_desc,
				  e.fecha_hora, 
				  cast(e.fecha_hora as date) as fecha,
				  e.id,
				  e.codigo_sap,
				  t.nombres,
				  isnull(t.razon_comercial,'') as razon_comercial,
				  e.valor_negocio,
				  e.descuento,
				  e.valor_descuento,
				  e.soporte,
				  e.usuario,
				  upper(u.nombres) +' '+ upper(u.apellidos) as nombre_usuario,
				  e.notas,
				  e.estado,
				  e.grupo_articulo+ ' - ' +a.descripcion1 as grupo,
				  numero_factura = isnull((select count(*) from t_negocios_especiales_factura f where f.id_negocio = e.id),0),
				  valor_factura  = isnull((select sum(f.valor) from t_negocios_especiales_factura f where f.id_negocio = e.id),0),
				  e.tipo_estado,
				  e.nota_fecha_doc ,
				  e.nota_fecha_cont ,
				  e.nota_cuenta_mayor ,
				  e.nota_centro_costo ,
				  e.nota_centro_beneficio ,
				  e.nota_texto1 ,
				  e.nota_texto2,
				  e.nota_valor,
				  isnull(e.nota_numero,0) as nota_numero,
				  o.condicion_pago,       
				  c.descripcion as condicion_desc,
				  c.descuento as dcto_financiero,
				  e.nota_centro_beneficio_prov,
                  e.nota_centro_costo_prov,
                  e.nota_cuenta_mayor_prov,
                  e.nota_texto1_prov,
                  e.nota_texto2_prov,
                  e.nota_numero_prov,
                  e.nota_fecha_pago_prov,
				  e.nota_codigo_sap_prov,
				  o.organizacion_ventas,
                  --AUTORIZACION Y APROBACION
                  isnull(e.usuario_modifica,'-') as usuario_modifica,
                  e.fecha_modifica,
                  isnull(e.usuario_aprueba,'-') as usuario_aprueba,
                  e.fecha_aprobacion,
				  
				  e.usuario_finaliza_factura,
				  e.fecha_finaliza_factura,
				  e.nota_usuario_diligencia,
				  e.nota_fecha_diligencia,
                  negocios_adicionales = isnull((
                                            select top 1
                                              n.id 
                                            from t_negocios_especiales n
                                            where 
                                              n.codigo_sap = e.codigo_sap and
                                              year (n.fecha_hora) = year (e.fecha_hora) and
                                              month(n.fecha_hora) = month(e.fecha_hora) and 
                                              n.id <> e.id and 
                                              n.tipo_negocio <> 'P'
                                          ),0),
				 isnull(e.nota_fondo,0) as nota_fondo
				  
				from t_negocios_especiales e 
				inner join t_terceros t on t.codigo_sap = e.codigo_sap
				inner join t_terceros_organizacion o on o.codigo_sap = t.codigo_sap and o.oficina_ventas = e.oficina_ventas and o.canal_distribucion = '10'
				left join t_condiciones_pago c on c.condicion = o.condicion_pago
				inner join t_usuarios u on u.login = e.usuario
				left join t_grupos_articulos a on a.grupo_articulo = e.grupo_articulo
				where 
				 e.id = '" . $_POST[ 'id' ] . "' ";

      $q = mssql_query( $sql );
      $datos = array();
      while ( $row = mssql_fetch_array( $q ) ) {
        $ruta = '';
        if ( $row[ "soporte" ] != '' ) {
          $ruta = '../../ImagenesNotas/' . $row[ "soporte" ];
        } else {
          $ruta = '../../ImagenesNotas/no_imagen.png';
        }
        $datos[] = array(
          'id' => $row[ "id" ],
          'fecha_hora' => $row[ "fecha_hora" ],
          'codigo_sap' => $row[ "codigo_sap" ],
          'nombres' => utf8_encode( $row[ "nombres" ] ),
          'razon_comercial' => utf8_encode( $row[ "razon_comercial" ] ),
          'valor_negocio' => $row[ "valor_negocio" ],
          'descuento' => $row[ "descuento" ],
          'valor_descuento' => $row[ "valor_descuento" ],
          'usuario' => utf8_encode( $row[ "usuario" ] ),
          'nombre_usuario' => utf8_encode( $row[ "nombre_usuario" ] ),
          'notas' => utf8_encode( $row[ "notas" ] ),
          'estado' => $row[ "estado" ],
          'soporte' => $ruta,
          'grupo' => $row[ 'grupo' ],
          'oficina_ventas' => $row[ 'oficina_ventas' ],
          'tipo_neg_desc' => $row[ 'tipo_negocio_desc' ],
          'tipo_neg' => $row[ 'tipo_negocio' ],
          'fecha' => $row[ 'fecha' ],
          'factura' => $row[ 'numero_factura' ],
          'valor_factura' => $row[ 'valor_factura' ],
          'tipo_estado' => $row[ 'tipo_estado' ],
          'condicion_pago' => utf8_encode( trim( $row[ 'condicion_pago' ] ) ),
          'condicion_desc' => utf8_encode( trim( $row[ 'condicion_desc' ] ) ),
          'dcto_financiero' => utf8_encode( trim( $row[ 'dcto_financiero' ] ) ),
          //Datos de la nota
          'nota_fecha_doc' => $row[ 'nota_fecha_doc' ],
          'nota_fecha_cont' => $row[ 'nota_fecha_cont' ],
          'nota_cuenta_mayor' => trim( $row[ 'nota_cuenta_mayor' ] ),
          'nota_centro_costo' => trim( $row[ 'nota_centro_costo' ] ),
          'nota_centro_beneficio' => trim( $row[ 'nota_centro_beneficio' ] ),
          'nota_texto1' => utf8_encode( trim( $row[ 'nota_texto1' ] ) ),
          'nota_texto2' => utf8_encode( trim( $row[ 'nota_texto2' ] ) ),
          'nota_numero' => trim( $row[ 'nota_numero' ] ),
          'nota_valor' => trim( $row[ 'nota_valor' ] ),
          //Datos de la nota proveedor
          'nota_centro_beneficio_prov' => trim( $row[ 'nota_centro_beneficio_prov' ] ),
          'nota_centro_costo_prov' => trim( $row[ 'nota_centro_costo_prov' ] ),
          'nota_cuenta_mayor_prov' => trim( $row[ 'nota_cuenta_mayor_prov' ] ),
          'nota_texto1_prov' => utf8_encode( trim( $row[ 'nota_texto1_prov' ] ) ),
          'nota_texto2_prov' => utf8_encode( trim( $row[ 'nota_texto2_prov' ] ) ),
          'nota_numero_prov' => trim( $row[ 'nota_numero_prov' ] ),
          'nota_fecha_pago_prov' => trim( $row[ 'nota_fecha_pago_prov' ] ),
          'nota_codigo_sap_prov' => trim( $row[ 'nota_codigo_sap_prov' ] ),
          //Datos de autorizacion y aprobacion
          'usuario_autoriza' => utf8_encode( trim( $row[ 'usuario_modifica' ] ) ),
          'usuario_aprueba' => utf8_encode( trim( $row[ 'usuario_aprueba' ] ) ),
          'fecha_autoriza' => trim( $row[ 'fecha_modifica' ] ),
          'fecha_aprueba' => trim( $row[ 'fecha_aprobacion' ] ),
          'usuario_gestiona' => utf8_encode( trim( $row[ 'usuario_finaliza_factura' ] ) ),
          'fecha_gestiona' => trim( $row[ 'fecha_finaliza_factura' ] ),
          'nota_usuario_diligencia' => utf8_encode( trim( $row[ 'nota_usuario_diligencia' ] ) ),
          'fecha_usuario_diligencia' => trim( $row[ 'nota_fecha_diligencia' ] ),
          'negocios_adicionales' => $row[ 'negocios_adicionales' ],
          'nota_fondo' => $row[ 'nota_fondo' ]

        );
      } //for
      echo json_encode( $datos );
    }
    break;
  case 'S_RECURSO':
    {
      $sql = "select valor from t_negocios_recursos where usuario = '" . utf8_decode( $_SESSION[ "ses_Login" ] ) . "'";
      $q = mssql_query( $sql );
      $datos = array();
      while ( $row = mssql_fetch_array( $q ) ) {
        $datos[] = array(
          'valor' => $row[ "valor" ]
        );

      }
      echo json_encode( $datos );
    }
    break;
  case 'I_RECURSO':
    {
      $sp = mssql_init( 'P_NEGOCIO_RECURSO_I' );
      mssql_bind( $sp, '@USUARIO', $_POST[ 'usuario' ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@VALOR', $_POST[ 'valor' ], SQLVARCHAR, false, false );
      if ( !mssql_execute( $sp ) ) {
        $respuesta = array(
          'error' => true,
          'mensaje' => 'Error al crear recurso'
        );
      } else {
        $respuesta = array(
          'error' => false,
          'mensaje' => 'Recurso creados correctamente'
        );
      }
      echo json_encode( $respuesta );
    }
    break;
  case 'U_IMAGEN_SOLICITUD':
    {

      $sql = "update t_negocios_especiales set soporte = '" . $_POST[ 'NombreImg' ] . "' where id = " . $_POST[ "id" ];

      if ( mssql_query( $sql ) ) {
        $respuesta = array(
          'error' => false,
          'mensaje' => 'Se actualizo correctamente el registro!',
          'id' => $_POST[ "id" ]
        );
      } else {
        $respuesta = array(
          'error' => true,
          'mensaje' => 'Error al intentar actualizar el registro!',
          'id' => $_POST[ "id" ]
        );
      }
      echo json_encode( $respuesta );
    }
    break;
  case 'S_NOTAS_X_USUARIOS':
    {
      $sql = "select 
				  e.usuario_modifica+' - '+ u.nombres+' '+u.apellidos as name, 
				  sum(e.nota_valor) as y 
				from t_negocios_especiales e 
				inner join t_terceros t on t.codigo_sap = e.codigo_sap
				inner join t_terceros_organizacion o on o.codigo_sap = t.codigo_sap and o.oficina_ventas = e.oficina_ventas and o.canal_distribucion = '10'
				inner join t_usuarios u on u.login = e.usuario_modifica 
				where 
				  o.organizacion_ventas = '" . $_SESSION[ 'ses_NumOrg' ] . "' and 
				  cast(e.fecha_hora as date) between cast('" . $_POST[ 'fhini' ] . "' as date) and cast('" . $_POST[ 'fhfin' ] . "' as date) ";
      if ( $_POST[ 'oficina' ] != '1000' && $_POST[ 'oficina' ] != '2000' ) {
        $sql .= " and e.oficina_ventas = '" . $_POST[ 'oficina' ] . "'";
      }
      $sql .= " and e.estado = 'C' and e.tipo_negocio <> 'P'
				group by
				  e.usuario_modifica,
				  u.nombres,
				  u.apellidos";
      $q = mssql_query( $sql );
      $datos = array();
      while ( $row = mssql_fetch_array( $q ) ) {
        $datos[] = array(
          'name' => utf8_encode( $row[ "name" ] ),
          'y' => ( int )$row[ "y" ]
        );

      }
      echo json_encode( $datos );
    }
    break;
  case 'S_NOTAS_X_GRUPOS':
    {
      $sql = "select 
				  m.grupo_articulos,
				  g.descripcion1 as descripcion_grupo,
				  sum(e.nota_valor) as valor_total 
				from t_negocios_especiales e 
				inner join t_terceros t on t.codigo_sap = e.codigo_sap
				inner join t_terceros_organizacion o on o.codigo_sap = t.codigo_sap and o.oficina_ventas = e.oficina_ventas and o.canal_distribucion = '10'
				inner join t_negocios_especiales_det d on d.id_negocio = e.id
				inner join t_materiales m on m.codigo_material = d.codigo_material
				inner join t_grupos_articulos g on g.grupo_articulo = m.grupo_articulos
				where 
				 o.organizacion_ventas = '" . $_SESSION[ 'ses_NumOrg' ] . "' and 
				 cast(e.fecha_hora as date) between cast('" . $_POST[ 'fhini' ] . "' as date) and cast('" . $_POST[ 'fhfin' ] . "' as date) ";
      if ( $_POST[ 'oficina' ] != '1000' && $_POST[ 'oficina' ] != '2000' ) {
        $sql .= " and e.oficina_ventas = '" . $_POST[ 'oficina' ] . "'";
      }
      $sql .= " and e.estado = 'C' and e.tipo_negocio = 'P'
				group by
				  m.grupo_articulos,
				  g.descripcion1
				order by 
				   sum(e.nota_valor) desc";
      //echo $sql;
      $q = GenerarArray( $sql, '' );
      echo json_encode( $q );
    }
    break;
  case 'S_FACT_DESCUENTO':
    {
      $sql = "select 
				  f.numero_factura,
				  e.codigo_sap,
				  e.fecha_hora,
				  t.nombres,
				  t.razon_comercial,
				  e.descuento,
				  e.valor_descuento as descuento_solicitado,
				  e.nota_valor as descuento_aprobado,
				  e.oficina_ventas,
				  e.id as id_neg
				from t_negocios_especiales_factura f
				inner join t_negocios_especiales e on e.id = f.id_negocio
				inner join t_terceros t on t.codigo_sap = e.codigo_sap
				where  
				f.numero_factura like '%" . $_POST[ 'factura' ] . "%'";
      $datos = GenerarArray( $sql, '' );
      echo json_encode( $datos );
    }
    break;
  case 'VALIDA_NEGOCIO':
    {
      $sql = "SELECT 
				E.ID
				FROM T_NEGOCIOS_ESPECIALES E
				WHERE E.CODIGO_SAP = '" . $_POST[ 'codigo' ] . "' AND
					  YEAR (E.FECHA_HORA) = YEAR (GETDATE()) AND
					  MONTH (E.FECHA_HORA) =  MONTH (GETDATE()) AND 
					  E.GRUPO_ARTICULO = '" . $_POST[ 'grupo' ] . "'";
      $datos = GenerarArray( $sql, '' );
      echo json_encode( $datos );
    }
    break;
  case 'VALIDA_ADD_FACTURA':
    {
      $sql = "SELECT 
				DATEDIFF(DAY,CAST(E.FECHA_HORA AS DATE), CAST(GETDATE() AS DATE)) AS DIAS 
			  FROM T_NEGOCIOS_ESPECIALES E
			  WHERE 
			    E.ID = " . $_POST[ 'id' ] . "";
      $datos = GenerarArray( $sql, '' );
      echo json_encode( $datos );
    }
    break;
  case 'valida_saldo_fondo':
    $sql = "SELECT
				SUM(BSEG.DMBTR * CASE WHEN BSEG.SHKZG = 'H' THEN -1 ELSE 1 END)*100 AS Saldo
			FROM BSEG 
			INNER JOIN BKPF ON BKPF.BELNR = BSEG.BELNR AND BKPF.BUKRS = BSEG.BUKRS 
			WHERE
			  BSEG.BUKRS = '" . $_SESSION[ "ses_NumOrg" ] . "' 
			  AND BKPF.STBLG = ''
			  AND BSEG.HKONT = '" . $_POST[ 'cuenta' ] . "' ";
    $q = generarArrayHana( $sql );
    echo json_encode( $q );
    break;
  case 'valida_cuenta': //Se valida que la cuenta exista
    $sql = "SELECT
					A.SAKNR AS cuenta,
					T.TXT50 AS nombre
				FROM
					SKA1 AS A
				INNER JOIN
					SKAT AS T ON A.SAKNR = T.SAKNR AND T.SPRAS = 'S'
				WHERE
					A.MANDT = '400'  
					AND A.SAKNR = '" . $_POST[ 'cuenta' ] . "' 
					AND A.KTOPL = 'PUC'";
    $q = generarArrayHana( $sql );
    echo json_encode( $q );
    break;
}
?>