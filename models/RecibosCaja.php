<?php
session_start();
require( "funciones.php" );
require_once( '../resources/PhPMailer/Email.php' );
$conn = conectar();
switch ( $_POST[ "op" ] ) {
  case "PLANILLA":
    {
      $sql = "SELECT 
					 R.USUARIO,
					 CONVERT(VARCHAR(30),R.FECHA_HORA,120) as FECHA_HORA,
					 R.CODIGO_SAP,
					 T.NOMBRES,
					 T.RAZON_COMERCIAL,
					 R.NUMERO,
					 R.ORGANIZACION_VENTAS,
					 ISNULL(R.TEXTO_CABECERA,'') AS TEXTO_CABECERA,
					 ISNULL(R.TEXTO_COMPENSACION,'') AS TEXTO_COMPENSACION,
					 ISNULL(R.TEXTO_REFERENCIA,'') AS TEXTO_REFERENCIA,
					 SUM(CASE WHEN D.TIPO = 'C'THEN D.IMPORTE ELSE 0 END) AS VALOR,
					 SUM(D.DESCUENTO) AS DESCUENTO,
					 R.ESTADO,
					 R.FECHA_HORA_APROBACION,
					 R.ID_RC,
					 R.ADJUNTO,
					 Z.ZONA_VENTAS+' - '+ Z.ZONA_DESCRIPCION AS ZONA_VENTAS,
					 ISNULL(E.EMAIL,'') AS EMAIL_ZONA,
                     ISNULL(T.EMAIL,'')	AS EMAIL,
					 R.USUARIO_APRUEBA		 			 
				   FROM T_RECIBOS_NEW R 
				   INNER JOIN T_TERCEROS T ON T.CODIGO_SAP = R.CODIGO_SAP
				   INNER JOIN T_TERCEROS_ORGANIZACION O ON O.CODIGO_SAP = R.CODIGO_SAP AND O.CANAL_DISTRIBUCION = 10 AND O.ORGANIZACION_VENTAS = R.ORGANIZACION_VENTAS
                   LEFT  JOIN T_ZONAS_VENTAS Z ON Z.ZONA_VENTAS = O.ZONA_VENTAS
				   INNER JOIN T_RECIBOS_DETALLE_NEW D ON D.ID_RC = R.ID_RC
				   LEFT  JOIN T_ZONAS_EMAIL E ON E.ZONA_VENTAS = O.ZONA_VENTAS 
				   WHERE
				     CAST(R.FECHA_HORA AS DATE) BETWEEN '" . $_POST[ 'fhIni' ] . "' AND '" . $_POST[ 'fhFin' ] . "' AND
					 R.ORGANIZACION_VENTAS = '" . $_SESSION[ "ses_NumOrg" ] . "' ";
      $sql .= "GROUP BY
					R.USUARIO,
					R.FECHA_HORA,
					R.CODIGO_SAP,
					T.NOMBRES,
					T.RAZON_COMERCIAL,
					R.NUMERO,
					R.ORGANIZACION_VENTAS,
					R.TEXTO_CABECERA,
					R.TEXTO_COMPENSACION,
					R.TEXTO_REFERENCIA,
					R.ESTADO,
					R.FECHA_HORA_APROBACION,
					R.ID_RC,
					R.ADJUNTO,
					Z.ZONA_VENTAS,
                    Z.ZONA_DESCRIPCION,
					E.EMAIL,
                    T.EMAIL,
					R.USUARIO_APRUEBA
				 ORDER BY
				 R.FECHA_HORA";
      $Query = GenerarArray( $sql, "C" );
      echo json_encode( $Query );
    }
    break;
  case 'S_DETALLE_RC':
    {
      $sql = "SELECT 
					  R.ID_RC,
					  R.NUMERO,
					  R.IMPORTE,
					  R.DESCUENTO,
					  R.CUENTA,
					  R.FECHA_VALOR,
					  R.DOCUMENTO,
					  R.CENTRO_BENEFICIO,
					  R.TIPO,
					  R.REF_FACT,
					  R.REF_DOC,
					  R.TIPO_DOC,
					  R.TEXTO,
					  R.TIPO_VALOR
					FROM T_RECIBOS_DETALLE_NEW R 
					WHERE 
					  R.ID_RC = '" . $_POST[ 'id' ] . "'";
      $Query = GenerarArray( $sql, "C" );
      echo json_encode( $Query );
    }
    break;
  case 'I_CARTERA_RC':
    {
      $cliente = $_POST[ "cliente" ];
      $asignados = $_POST[ "asignados" ];
      $cuentas = $_POST[ "cuentas" ];
      $documentos = $_POST[ "documentos" ];
      $usuario = $_SESSION[ 'ses_Login' ];
      $sociedad = $_POST[ "Sociedad" ];
      $TxtReferencia = $_POST[ 'referencia' ];
      $TxtCabecera = $_POST[ 'TextoCabecera' ];
      $TxtCompensa = $_POST[ 'TextoCompensa' ];
      $IDRC = 0;
      $SQL1 = '';

      $sp = mssql_init( 'P_RC_ENC_I' );
      mssql_bind( $sp, '@CODIGO_SAP', $cliente, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@USUARIO', $usuario, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@SOCIEDAD', $sociedad, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@TXT_REFERENCIA', $TxtReferencia, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@TXT_CABECERA', $TxtCabecera, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@TXT_COMPENSACION', $TxtCompensa, SQLVARCHAR, false, false );
      mssql_bind( $sp, '@ID_OUT', $IDRC, SQLINT4, true, false );
      $r = mssql_execute( $sp );

      if ( $IDRC > 0 ) {
        //ABONOS
        for ( $i = 0; $i <= count( $cuentas ) - 1; $i++ ) {
          $datos = $cuentas[ $i ];
          $cb = '';
          if ( $sociedad == '1000' ) {
            if ( $datos[ 'Cuenta' ] == '2815050503' ) {
              $cb = '1V002';
            }
          } else {
            if ( $datos[ 'Cuenta' ] == '2815051601' ) {
              $cb = '2V002';
            }
          }
          $SQL1 .= " INSERT INTO T_RECIBOS_DETALLE_NEW(ID_RC,
															  IMPORTE,
															  DESCUENTO,
															  CUENTA,
															  FECHA_VALOR,
															  DOCUMENTO,
															  CENTRO_BENEFICIO,
															  TIPO,
															  ID_MULTICASH,
															  TIPO_DOC,
															  TEXTO)
							                           VALUES('" . $IDRC . "',
													          '" . $datos[ 'Valor' ] . "',
															  0,
															  '" . $datos[ 'Cuenta' ] . "',
															  '" . $datos[ 'FechaValor' ] . "',
															  '',
															  '" . $cb . "',
															  'C',
															  '" . $datos[ 'Id' ] . "',
															  '" . $datos[ 'Tipo' ] . "',
															  '" . $datos[ 'Referencia' ] . "');";

          if ( $datos[ 'Id' ] != '' ) {
            $SQL1 .= " UPDATE T_RECIBOS_MULTICASH SET ESTADO = 1 WHERE ID = " . $datos[ 'Id' ];
            $SQL1 .= " UPDATE T_DOCFI SET ZESTADO = 1 WHERE NUMERO_DOCUMENTO = '" . $datos[ 'Id' ] . "' AND SOCIEDAD = '" . $sociedad . "'";
          }
        }
        //FACTURAS
        for ( $i = 0; $i <= count( $documentos ) - 1; $i++ ) {
          $datos = $documentos[ $i ];
          $SQL1 .= " INSERT INTO T_RECIBOS_DETALLE_NEW(ID_RC,
															  IMPORTE,
															  DESCUENTO,
															  CUENTA,
															  FECHA_VALOR,
															  DOCUMENTO,
															  CENTRO_BENEFICIO,
															  TIPO,
															  REF_DOC,
															  REF_FACT,
															  TIPO_DOC,
															  TEXTO,
															  TIPO_VALOR)
							                           VALUES('" . $IDRC . "',
													          '" . $datos[ 'vlrFila' ] . "',
															  '" . $datos[ 'vlrDesc' ] . "',
															  '',
															  '" . date( 'Y-m-d' ) . "',
															  '" . $datos[ 'NumDoc' ] . "',
															  '',
															  'F',
															  '" . $datos[ 'RefDoc' ] . "',
															  '" . $datos[ 'ReFact' ] . "',
															  '" . $datos[ 'TipoDoc' ] . "',
															  '" . $datos[ 'ReFact' ] . "',
															  '" . $datos[ 'TipoVal' ] . "');";
        }
        //echo $SQL1;
        if ( mssql_query( $SQL1 ) ) {
          echo $IDRC;
        } else {
          echo 0;
        }
      }

    }
    break;
  case 'D_RC':
    {
      $id = $_POST[ 'id' ];
      $sql = "SELECT 
					 D.ID_MULTICASH,
					 E.ORGANIZACION_VENTAS AS SOCIEDAD 
					FROM T_RECIBOS_DETALLE_NEW D 
					INNER JOIN T_RECIBOS_NEW E ON E.ID_RC = D.ID_RC
					WHERE 
					 D.ID_RC = " . $id;
      $q = mssql_query( $sql );
      $query = '';
      while ( $e = mssql_fetch_array( $q ) ) {
        if ( $e[ 'ID_MULTICASH' ] > 0 ) {
          $query .= " UPDATE T_RECIBOS_MULTICASH SET ESTADO = 0 WHERE ID = " . $e[ 'ID_MULTICASH' ] . ";";
          $query .= " UPDATE T_DOCFI SET ZESTADO = 0 WHERE NUMERO_DOCUMENTO = '" . $e[ 'ID_MULTICASH' ] . "' AND SOCIEDAD = '" . $e[ 'SOCIEDAD' ] . "'";
        }
      }
      $query .= " DELETE FROM T_RECIBOS_NEW WHERE ID_RC = " . $id . ";";
      if ( mssql_query( $query ) ) {
        echo 0;
      } else {
        echo 1;
      }
    }
    break;
  case 'G_MULTICASH':
    {
      function cambiarFormatoFecha_mdy( $fecha ) {
        list( $dia, $mes, $anio ) = explode( "/", $fecha );
        return $mes . "/" . $dia . "/" . $anio;
      }
      $sp = mssql_init( 'P_SUBIR_MULTICASH' );
      mssql_bind( $sp, '@SOCIEDAD', mb_strtoupper( $_SESSION[ "ses_NumOrg" ], "UTF-8" ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@CUENTA', mb_strtoupper( $_POST[ "Cuenta" ], "UTF-8" ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@NUMERO', mb_strtoupper( $_POST[ "Numero" ], "UTF-8" ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@VALOR', mb_strtoupper( $_POST[ "Importe" ], "UTF-8" ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@TEXTO', mb_strtoupper( $_POST[ "Texto" ], "UTF-8" ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@FECHAC', mb_strtoupper( cambiarFormatoFecha_mdy( $_POST[ "FechaC" ] ), "UTF-8" ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@FECHAV', mb_strtoupper( cambiarFormatoFecha_mdy( $_POST[ "FechaV" ] ), "UTF-8" ), SQLVARCHAR, false, false );mssql_bind( $sp, '@REFERENCIA', mb_strtoupper( $_POST[ "Ref" ], "UTF-8" ), SQLVARCHAR, false, false );
      $r = mssql_execute( $sp );
      if ( $r ) {
        echo 0;
      } else {
        echo 1;
      }
    }
    break;
  case 'S_MULTICASH':
    {
      $stado = 1;
      $sp = mssql_init( 'P_CONSULTAR_MULTICASH' );
      mssql_bind( $sp, '@ANIO', $_POST[ 'anio' ], SQLINT4, false, false );
      mssql_bind( $sp, '@MES', $_POST[ 'mes' ], SQLINT4, false, false );
      mssql_bind( $sp, '@DIA', $_POST[ 'dia' ], SQLINT4, false, false );
      mssql_bind( $sp, '@SOCIEDAD', $_SESSION[ "ses_NumOrg" ], SQLVARCHAR, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_free_result( $r );
      mssql_close();
    }
    break;
  case "SUBIR_FILE":
    {
      $upload_folder = '../../RecibosCaja';
      $id = $_POST[ 'id' ];
      $nombre_archivo = $_FILES[ 'archivo' ][ 'name' ];
      $tipo_archivo = $_FILES[ 'archivo' ][ 'type' ];
      $tipo_archivo = explode( "/", $tipo_archivo );

      if ( $tipo_archivo[ 1 ] == "pdf" ) {
        $tipo_archivo = $_FILES[ 'archivo' ][ 'type' ];
        $tamano_archivo = $_FILES[ 'archivo' ][ 'size' ];
        $tmp_archivo = $_FILES[ 'archivo' ][ 'tmp_name' ];
        $archivador = $upload_folder . '/' . $id . '.pdf';
        if ( !move_uploaded_file( $tmp_archivo, $archivador ) ) {
          echo "false";
        } else {
          echo "true";
          $sql = "UPDATE T_RECIBOS_NEW SET ADJUNTO = 1 WHERE ID_RC=" . $id;
          mssql_query( $sql );
          mssql_close();
        }
      } else {
        echo "El archivo debe ser de tipo PDF.";
      }
    }
    break;
  case "U_RC":
    {
      $id = $_POST[ 'id' ];
      $sql = "UPDATE T_RECIBOS_NEW SET ADJUNTO = 0 WHERE ID_RC=" . $id;
      if ( mssql_query( $sql ) ) {
        echo 1;
      } else {
        echo 0;
      }
    }
    break;
  case 'S_ZONAS_EMAIL':
    {
      $org = 0;
      if ( $_SESSION[ 'ses_NumOrg' ] == '1000' ) {
        $org = 1;
      } else {
        $org = 2;
      }
      $sql = "SELECT 
		             Z.ZONA_VENTAS,
					 V.ZONA_DESCRIPCION,
					 Z.EMAIL 
				   FROM T_ZONAS_EMAIL Z 
				   LEFT JOIN T_ZONAS_VENTAS V ON Z.ZONA_VENTAS = V.ZONA_VENTAS
				   WHERE 
				     SUBSTRING(Z.ZONA_VENTAS,0,2) =" . $org . " ORDER BY Z.ZONA_VENTAS";
      $q = GenerarArray( $sql, "C" );
      echo json_encode( $q );
    }
    break;
  case 'U_ZONA_EMAIL':
    {
      $sql = "UPDATE T_ZONAS_EMAIL SET EMAIL = '" . strtolower( $_POST[ 'email' ] ) . "' WHERE ZONA_VENTAS = '" . $_POST[ 'zona' ] . "'";
      mssql_query( $sql );
    }
    break;
  case 'I_ZONA_EMAIL':
    {
      $sql = "INSERT INTO T_ZONAS_EMAIL (ZONA_VENTAS,EMAIL)VALUES('" . $_POST[ 'zona' ] . "','" . strtolower( $_POST[ 'email' ] ) . "')";
      mssql_query( $sql );
    }
    break;
  case 'D_ZONA_EMAIL':
    {
      $sql = "DELETE FROM T_ZONAS_EMAIL WHERE ZONA_VENTAS = '" . $_POST[ 'zona' ] . "'";
      mssql_query( $sql );
    }
    break;
  case 'S_COND_DCTO':
    {
      $sp = mssql_init( 'P_CONDICIONES_DCTO_S' );
      mssql_bind( $sp, '@CODIGO_SAP', $_POST[ "codigo" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@SOCIEDAD', $_POST[ "sociedad" ], SQLVARCHAR, false, false );
      $r = mssql_execute( $sp );
      echo json_encode( GenerarArray( $r, 'SP' ) );
      mssql_free_result( $r );
      mssql_close();

    }
    break;
  case 'B_CLIENTE_RC':
    {
      $sql = "select 
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
                isnull(t.email,'') as email,
                isnull(t.telefono1,'-') as telefonos,
                isnull(t.cupo_credito,0) as cupo_credito,
                t.direccion,
                isnull(t.ciudad,'N/A') as ciudad,
                o.oficina_ventas as bodega,
                f.descripcion as bodega_desc,
                o.lista,
                o.condicion_pago, 
                isnull(v.nombres,'NA') as vendedor,
                isnull(l.nombres,'NA') as televendedor,
                o.institucional,
                isnull(e.email,'') as email_zona,
                isnull(g.grupo,'') as grupo,
                isnull(g.descripcion,'') as desc_grupo,
                z.zona_ventas,
                z.zona_descripcion
            from t_terceros t
            inner join t_terceros_organizacion  o on o.codigo_sap  = t.codigo_sap 
            inner join t_oficinas_ventas        f on f.oficina_ventas = o.oficina_ventas
            left  join t_zonas_ventas           z on z.zona_ventas = o.zona_ventas 
            left join  t_terceros               v on v.codigo_sap  = o.codigo_vendedor
            left join  t_terceros               l on l.codigo_sap  = o.codigo_televendedor
            left join  t_zonas_email            e on e.zona_ventas = o.zona_ventas
            left join  t_terceros_grupos1       g on g.grupo = o.grupo1
            where
            o.organizacion_ventas = '" . ( $_SESSION[ "ses_NumOrg" ] ) . "' and 
            o.canal_distribucion  = 10";
      $datos = array();
      $q = GenerarArray( $sql, '' );

      //while($row = mssql_fetch_array($q)){
      foreach ( $q as $row ) {

        $datos[] = array(
          'nombres' => ( $row[ "nombres" ] ),
          'razon_comercial' => ( $row[ "razon_comercial" ] ),
          'codigo_sap' => $row[ "codigo_sap" ],
          'nit' => $row[ "nit" ],
          'email' => ( $row[ "email" ] ),
          'telefonos' => $row[ "telefonos" ],
          'cupo_credito' => $row[ "cupo_credito" ],
          'direccion' => ( $row[ "direccion" ] ),
          'ciudad' => ( $row[ "ciudad" ] ),
          'bodega' => $row[ "bodega" ],
          'bodega_desc' => ( $row[ "bodega_desc" ] ),
          'lista' => $row[ "lista" ],
          'condicion_pago' => $row[ "condicion_pago" ],
          'vendedor' => ( $row[ "vendedor" ] ),
          'televendedor' => ( $row[ "televendedor" ] ),
          'institucional' => $row[ "institucional" ],
          'email_zona' => $row[ "email_zona" ],
          'grupo' => $row[ "grupo" ],
          'desc_grupo' => $row[ "desc_grupo" ],
          'zona_ventas' => $row[ "zona_ventas" ],
          'zona_descripcion' => $row[ "zona_descripcion" ]
        );
      } //while

      echo json_encode( $datos );
    }
    break;
  case 'I_CONDICION_ESPECIAL':
    {
      $id = 0;
      $sp = mssql_init( 'P_CONDICION_ESPECIAL_I' );
      mssql_bind( $sp, '@CODIGO', $_POST[ "codigo" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@SOCIEDAD', $_SESSION[ "ses_NumOrg" ], SQLVARCHAR, false, false );
      mssql_bind( $sp, '@DIAS', $_POST[ "dias" ], SQLINT4, false, false );
      mssql_bind( $sp, '@DESCUENTO', $_POST[ "dcto" ], SQLINT4, false, false );
      mssql_bind( $sp, '@USUARIO', utf8_decode( $_SESSION[ 'ses_Login' ] ), SQLVARCHAR, false, false );
      mssql_bind( $sp, '@ID', $id, SQLINT4, true, false );
      $r = mssql_execute( $sp );
      echo $id;
      mssql_close();
    }
    break;
  case 'S_CONDICION_ESPECIAL':
    {
      $sql = "select 
			c.id,
			c.sociedad,
			c.codigo_sap,
			c.descuento,
			c.dias,
			c.status,
			t.nombres,
			t.razon_comercial,
			c.sujeto_cump
		  from t_condiciones_especiales_cartera c 
		  inner join t_terceros t on t.codigo_sap = c.codigo_sap
			where 
			c.status = 1 and 
			c.sociedad = '" . $_SESSION[ "ses_NumOrg" ] . "'";
      $q = GenerarArray( $sql, "C" );
      echo json_encode( $q );
    }
    break;
  case 'A_CONDICION_ESPECIAL':
    {
      $sql = "UPDATE T_CONDICIONES_ESPECIALES_CARTERA SET 
	         STATUS = 0, 
			 USR_APRUEBA ='" . utf8_decode( $_SESSION[ 'ses_Login' ] ) . "',
			 FECHA_APRUEBA = GETDATE()
			WHERE 
			 ID = " . $_POST[ 'id' ];
      if ( mssql_query( $sql ) ) {
        echo 1;
      } else {
        echo 0;
      }
    }
    break;
  case 'S_CONDICION_LISTAS':
    {
      $sql = "select 
				  lista,
				  dias,
				  descuento,
				  sujeto_ppto,
				  oficina_ventas
				from t_condiciones_listas_cartera
				where 
				  oficina_ventas = '" . $_POST[ 'oficina' ] . "'
				order by 
				  lista,
				  dias asc";
      $q = GenerarArray( $sql, '' );
      echo json_encode( $q );
    }
    break;
  case 'S_VALIDA_DOC':
    {
      // $sql = "select id_rc from t_recibos_detalle_new d where d.documento ='".$_POST['doc']."'";
      $sql = "select
	         d.id_rc 
		   from t_recibos_detalle_new d 
		   inner join t_recibos_new r on r.id_rc = d.id_rc 
		   where 
		     d.documento           = '" . $_POST[ 'doc' ] . "' and 
			 r.organizacion_ventas = '" . $_SESSION[ 'ses_NumOrg' ] . "'";
      $q = GenerarArray( $sql, '' );
      echo json_encode( $q );
    }
    break;
  case 'B_DOCUMENTO_RC':
    {
      $sql = "SELECT 
				D.ID_RC,
				D.ID_MULTICASH,
				R.USUARIO,
				R.FECHA_HORA,
				R.FECHA_HORA_APROBACION
			FROM T_RECIBOS_DETALLE_NEW D 
			INNER JOIN T_RECIBOS_NEW R ON R.ID_RC = D.ID_RC
			WHERE 
			    D.ID_MULTICASH = '" . $_POST[ 'documento' ] . "'";
      $q = GenerarArray( $sql, '' );
      echo json_encode( $q );

    }
    break;
  case 'S_INFORME_RC':
    {
      $sql1 = "select 
				  isnull(r.usuario_aprueba,'N/A') as usuario_aprueba,
				  r.id_rc,
				  r.fecha_hora,
				  r.fecha_hora_aprobacion,
				  case 
					when (  
						   (datepart(hour,r.fecha_hora) <= 11) and ( datediff(hour,r.fecha_hora,isnull(r.fecha_hora_aprobacion,getdate()))<=12 )     
						  ) then 0
					when (
						   (datepart(hour,r.fecha_hora) >= 11) and ( datediff(hour,r.fecha_hora,isnull(r.fecha_hora_aprobacion,getdate()))<=24 )
						  ) then 0
					else 1
				  end  as recibos_extemporaneos
				from t_recibos_new r
				where 
				  cast (r.fecha_hora as date) between cast ('" . $_POST[ 'fhIni' ] . "' as date) and cast ('" . $_POST[ 'fhFin' ] . "' as date) and
				  r.organizacion_ventas = '" . $_SESSION[ "ses_NumOrg" ] . "'
				order by 
				r.usuario_aprueba";

      $sql2 = "select 
					  isnull(r.usuario_aprueba,'N/A') as usuario_aprueba,
					  count(*) as recibos_totales,
					  sum(case 
						when (  
							   (datepart(hour,r.fecha_hora) <= 11) and ( datediff(hour,r.fecha_hora,isnull(r.fecha_hora_aprobacion,getdate()))<=12 )     
							  ) then 0
						when (
							   (datepart(hour,r.fecha_hora) >= 11) and ( datediff(hour,r.fecha_hora,isnull(r.fecha_hora_aprobacion,getdate()))<=24 )
							  ) then 0
						else 1
					  end  )as recibos_extemporaneos
					from t_recibos_new r
					where 
					  cast (r.fecha_hora as date) between cast ('" . $_POST[ 'fhIni' ] . "' as date) and cast ('" . $_POST[ 'fhFin' ] . "' as date) and
					  r.organizacion_ventas = '" . $_SESSION[ "ses_NumOrg" ] . "'
					group by
					r.usuario_aprueba";


      $q1 = GenerarArray( $sql1, '' );
      $q2 = GenerarArray( $sql2, '' );

      $datos = array(
        'detalle' => $q1,
        'consolidado' => $q2
      );
      echo json_encode( $datos );

    }
    break;
  case 'COMPENSAR_DOCUMENTOS':
    $fhIni = $_POST[ 'fhIni' ];
    $fhFin = $_POST[ 'fhFin' ];
    $doc = $_POST[ 'doc' ];
    $sql = "UPDATE D
				SET D.ZESTADO = 1
				FROM T_DOCFI D
					 INNER JOIN T_DOCFI_DET L ON L.NUMERO_DOCUMENTO = D.NUMERO_DOCUMENTO AND
					 D.SOCIEDAD = L.SOCIEDAD AND L.CLAVE_CONTABLE = '50'
				WHERE D.SOCIEDAD = '" . $_SESSION[ "ses_NumOrg" ] . "' AND
					  CAST (D.FECHA_DOCUMENTO AS DATE) BETWEEN '$fhIni' AND '$fhFin' AND
					  D.CLASE_DOCUMENTO = 'ZR' AND
					  ISNULL(D.ZESTADO, 0) = 0 AND
					  l.CUENTA_MAYOR NOT IN ('1100050200', '1110050300', '1110051100', '1120100400', '1110050200',
											 '1110051300', '1110050600', '1110050800', '4210050501', '5305950101', '5305050501' )  ";
		if($doc!=''){
			$sql.=" AND D.NUMERO_DOCUMENTO = '$doc'";
		}
	 if ( mssql_query( $sql ) ) {
      echo json_encode( array(
        'estatus' => true,
        'msg' => 'Documento(s) compensados correctamente!.'
      ) );
    } else {
      echo json_encode( array(
        'estatus' => false,
        'msg' => 'Error al intentar realizar la compensación'
      ) );
    }
    break;
}

?>
