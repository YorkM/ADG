<?php
session_start();
require_once('funciones.php');
$conn = conectar();

// CONVERTIR LA FECHA A FORMATO YMD
function convertirFechaYmd($fecha) {
   return date("Ymd", strtotime($fecha));
}
// BUSCAR GRUPOS DE ARTICULOS DE CONVENIO
function grupoConvenios($id) {
   $sql = "SELECT GRUPO_ARTICULO FROM T_CONVENIOS_COMPRAS_GRUPOS WHERE ID_CONVENIO = $id";
   $datos = '';

   $q = mssql_query($sql);
   while ($row = mssql_fetch_array($q)) {
      $datos .= "'" . trim($row['GRUPO_ARTICULO']) . "',";
   }

   return trim($datos, ',');
}
// FUNCIÓN PARA BÚSQUEDA DE COMPRAS EN SAP
function buscarComprasSAP($org, $anio, $id) {
   $grupos = grupoConvenios($id);

   $sql = "select 
   a.werks as centro,
   year(a.budat) AS anio,
   month(a.budat) as mes,
   (sum(g.netpr * a.menge )*100) as val_neto_compras
   from ekbe as a 
   left join mara as b on a.mandt = b.mandt and a.matnr = b.matnr
   left join ekko as e on e.mandt = a.mandt and e.ebeln = a.ebeln
   left join ekpo as g on g.mandt = a.mandt and g.ebeln = a.ebeln and g.ebelp = a.ebelp
   left join makt as c on c.mandt = a.mandt and c.matnr = a.matnr
   left join t023t as d on d.mandt = b.mandt and d.matkl = b.matkl
   left join matdoc as k on k.mandt = a.mandt and k.mblnr = a.belnr and k.mjahr = a.gjahr
   left join mlan as p on  p.mandt = a.mandt and p.matnr = a.matnr and p.aland = 'CO'
   where
   a.mandt   =  '400'    and
   k.header_counter = 1  and
   a.bewtp   = 'E' and
   k.bwart   = '101'      and                   
   d.matkl in( " . $grupos . " ) and
   year( a.budat ) = '$anio'";

   if ($org != '*') $sql .= " and e.bukrs = '" . $org . "'";

   $sql .= " group by
   a.werks,
   year( a.budat ),
   month( a.budat )
   order by 
   month( a.budat )";
   return generarArrayHana($sql);
}
// FUNCIÓN PARA BÚSQUEDA DE VENTAS EN SAP
function buscarVentasSAP($org, $anio, $id) {
   $grupos = grupoConvenios($id);

   $sql = " select
    a.werks as centro,
	year(a.erdat) as anio,
	month(a.erdat) as mes,
	sum(   case when b.fkart like 'ZN%' then (a.netwr*100)*-1 else (a.netwr*100) end ) as val_neto_ventas,
	COUNT(DISTINCT b.kunag) as impactos
   from vbrp as a 
   inner join vbrk as b on  a.mandt = b.mandt and a.vbeln = b.vbeln and (b.fkart like 'ZF%' or b.fkart like 'ZN%')
   left outer join vbak as c on c.mandt = a.mandt and  c.vbeln = a.aubel
   inner join kna1   as d on d.kunnr = b.kunag
   inner join but000 as e on e.partner = b.kunag
   inner join tvkbt  as f on f.vkbur = c.vkbur and f.spras='S'
   left  join tvboT  as g on g.bonus = a.bonus and g.spras='S'
   where 
	year(a.erdat) = '$anio' and 
	a.MATKL in( " . $grupos . " )";

   if ($org != '*') {
      $sql .= "  and a.vkorg_auft   = '" . $org . "'";
   }

   $sql .= " group by
    a.werks,
	year(a.erdat),
	month(a.erdat)
   order by 
    month(a.erdat),
	year(a.erdat)";

   return generarArrayHana($sql);
}

switch ($_POST["op"]) {
   case "G_CONVENIO":
      try {
         $sql = "INSERT INTO T_CONVENIOS_COMPRAS (
                  ORGANIZACION_VENTAS,
                  FECHA_INICIO,
                  FECHA_FIN,
                  DESCRIPCION,
                  REBATE_MES ,
                  REBATE_TRIMESTRE,
                  REBATE_SEMESTRE,
                  REBATE_ANIO,
                  REBATE_CODIFICACION,
                  REBATE_ROTACION,
                  REBATE_INFORMACION,
                  REBATE_DEVOLUCIONES,
                  REBATE_DINAMICA,
                  REBATE_INVENTARIO,
                  REBATE_IMPACTOS,
                  REBATE_LOGISTICA,
                  Q1,
                  Q2,
                  Q3,
                  Q4,
                  OBJETIVO_ANIO,
                  NOTAS,
			         --CAMPOS NUEVOS--
                  Q1_IMPACTOS,
                  Q2_IMPACTOS,
                  Q3_IMPACTOS,
                  Q4_IMPACTOS,
                  IMPACTOS_ANIO,
                  Q1_ROTACION,
                  Q2_ROTACION,
                  Q3_ROTACION,
                  Q4_ROTACION,
                  ROTACION_ANIO,
                  PDF_CONVENIO,
                  CENTRO,
                  TIPO_CONVENIO,
                  EMAIL,
                  PORC_OPCIONAL)
                  VALUES (
                  '" . $_POST['org'] . "',
                  '" . $_POST['fhInicio'] . "',
                  '" . $_POST['fhFinal'] . "',
                  '" . utf8_decode($_POST['descripcion']) . "',
                  '" . $_POST['rebateMes'] . "',
                  '" . $_POST['rebateTrimestre'] . "',
                  '" . $_POST['rebateSemestre'] . "',
                  '" . $_POST['rebateAnio'] . "',
                  '" . $_POST['rebateCodificacion'] . "',
                  '" . $_POST['rebateRotacion'] . "',
                  '" . $_POST['rebateInformacion'] . "',
                  '" . $_POST['rebateDevoluciones'] . "',
                  '" . $_POST['rebateDinamica'] . "',
                  '" . $_POST['rebateInventario'] . "',
                  '" . $_POST['rebateImpactos'] . "',
                  '" . $_POST['rebateLogistica'] . "',
                  '" . $_POST['Q1'] . "',
                  '" . $_POST['Q2'] . "',
                  '" . $_POST['Q3'] . "',
                  '" . $_POST['Q4'] . "',
                  '" . $_POST['objetivoAnio'] . "',
                  '" . utf8_decode($_POST['txtNotas']) . "',
			         '" . $_POST['Q1_IMPACTOS'] . "',
			         '" . $_POST['Q2_IMPACTOS'] . "',
			         '" . $_POST['Q3_IMPACTOS'] . "',
			         '" . $_POST['Q4_IMPACTOS'] . "',
			         '" . $_POST['anioImpactos'] . "',
			         '" . $_POST['Q1_ROTACION'] . "',
			         '" . $_POST['Q2_ROTACION'] . "',
			         '" . $_POST['Q3_ROTACION'] . "',
			         '" . $_POST['Q4_ROTACION'] . "',
			         '" . $_POST['anioRotacion'] . "',
			         '" . $_POST['nombreArchivo'] . "',
			         '" . $_POST['centro'] . "',
			         '" . $_POST['tipoConvenio'] . "',
			         '" . $_POST['email'] . "',
			         '" . $_POST['porcentajeOpcional'] . "');";

         mssql_query($sql);

         $sql = "SELECT SCOPE_IDENTITY() AS id";
         $result = mssql_query($sql);
         $row = mssql_fetch_assoc($result);
         $id = $row['id'];

         $sql = '';
         if (isset($_POST['grupos'])) {
            for ($i = 0; $i < count($_POST['grupos']); $i++) {
               $sql .= " INSERT INTO T_CONVENIOS_COMPRAS_GRUPOS (ID_CONVENIO, GRUPO_ARTICULO) VALUES ($id, '" . trim($_POST['grupos'][$i]) . "');";
            }
         }
         mssql_query($sql);
         mssql_close();

         echo json_encode(['error' => false, 'msg' => 'registro creado correctamente', 'id' => $id]);
         
      } catch (Exception $e) {
         echo json_encode(['error' => true, 'msg' => 'Error al insertar datos: ' . $e->getMessage(), 'id' => 0]);
      }
      break;

   case 'S_CONVENIO':
      $sql = "SELECT 
               C.ID,
               C.ORGANIZACION_VENTAS,
               C.FECHA_INICIO,
               C.FECHA_FIN,
               UPPER(C.DESCRIPCION) AS DESCRIPCION,
               C.REBATE_MES,
               C.REBATE_TRIMESTRE,
               C.REBATE_SEMESTRE,
               C.REBATE_ANIO,
               C.REBATE_CODIFICACION,
               C.REBATE_ROTACION,
               C.REBATE_INFORMACION,
               C.REBATE_DEVOLUCIONES,
               C.REBATE_DINAMICA,
               C.REBATE_INVENTARIO,
               C.REBATE_IMPACTOS,
               C.REBATE_LOGISTICA,
               C.Q1,
               C.Q2,
               C.Q3,
               C.Q4,
               C.OBJETIVO_ANIO,
               UPPER(C.NOTAS) AS NOTAS,
               Q1_IMPACTOS,
               Q2_IMPACTOS,
               Q3_IMPACTOS,
               Q4_IMPACTOS,
               IMPACTOS_ANIO,
               Q1_ROTACION,
               Q2_ROTACION,
               Q3_ROTACION,
               Q4_ROTACION,
               ROTACION_ANIO,
               PDF_CONVENIO,
               CENTRO,
               TIPO_CONVENIO,
               EMAIL
			FROM T_CONVENIOS_COMPRAS AS C";

      $datos = array();
      $q = mssql_query($sql);

      while ($row = mssql_fetch_array($q)) {
         $fini = convertirFechaYmd($row["FECHA_INICIO"]);
         $ffin = convertirFechaYmd($row["FECHA_FIN"]);
         $fecha = new DateTime($row['FECHA_INICIO']);
         $anio = $fecha->format('Y'); 
         $org = trim($row["ORGANIZACION_VENTAS"]);
         $id = $row['ID'];
         $compras = buscarComprasSAP($org, $anio, $id);
         $ventas = buscarVentasSAP($org, $anio, $id);
         $grupos = grupoConvenios($id);

         $datos[] = array(
            "ID" => $row["ID"],
            "ORGANIZACION_VENTAS" => $row["ORGANIZACION_VENTAS"],
            "FECHA_INICIO" => $row["FECHA_INICIO"],
            "FECHA_FIN" => $row["FECHA_FIN"],
            "DESCRIPCION" => utf8_encode($row["DESCRIPCION"]),
            "REBATE_MES" => $row["REBATE_MES"],
            "REBATE_TRIMESTRE" => $row["REBATE_TRIMESTRE"],
            "REBATE_SEMESTRE" => $row["REBATE_SEMESTRE"],
            "REBATE_ANIO" => $row["REBATE_ANIO"],
            "REBATE_CODIFICACION" => $row["REBATE_CODIFICACION"],
            "REBATE_ROTACION" => $row["REBATE_ROTACION"],
            "REBATE_INFORMACION" => $row["REBATE_INFORMACION"],
            "REBATE_DEVOLUCIONES" => $row["REBATE_DEVOLUCIONES"],
            "REBATE_DINAMICA" => $row["REBATE_DINAMICA"],
            "REBATE_INVENTARIO" => $row["REBATE_INVENTARIO"],
            "REBATE_IMPACTOS" => $row["REBATE_IMPACTOS"],
            "REBATE_LOGISTICA" => $row["REBATE_LOGISTICA"],
            "Q1" => $row["Q1"],
            "Q2" => $row["Q2"],
            "Q3" => $row["Q3"],
            "Q4" => $row["Q4"],
            "OBJETIVO_ANIO" => $row["OBJETIVO_ANIO"],
            "NOTAS" => utf8_encode($row["NOTAS"]),
            "Q1_IMPACTOS" => $row["Q1_IMPACTOS"],
            "Q2_IMPACTOS" => $row["Q2_IMPACTOS"],
            "Q3_IMPACTOS" => $row["Q3_IMPACTOS"],
            "Q4_IMPACTOS" => $row["Q4_IMPACTOS"],
            "IMPACTOS_ANIO" => $row["IMPACTOS_ANIO"],
            "Q1_ROTACION" => $row["Q1_ROTACION"],
            "Q2_ROTACION" => $row["Q2_ROTACION"],
            "Q3_ROTACION" => $row["Q3_ROTACION"],
            "Q4_ROTACION" => $row["Q4_ROTACION"],
            "ROTACION_ANIO" => $row["ROTACION_ANIO"],
            "PDF_CONVENIO" => $row["PDF_CONVENIO"],
            "CENTRO" => $row["CENTRO"],
            "TIPO_CONVENIO" => $row["TIPO_CONVENIO"],
            "EMAIL" => $row["EMAIL"],
            "COMPRAS" => $compras,
            "VENTAS" => $ventas,
            "GRUPOS" => $grupos,
            "ANIO" => $anio
         );
      }

      echo json_encode($datos);
      break;

   case 'subirConvenio':
      $ruta = "../../Documentos/ConveniosCompras/";
      $nombre_archivo = $_POST['nombreArchivo'];
      $tipo_archivo = $_FILES['archivo']['type'];
      $tamano_archivo = $_FILES['archivo']['size'];
      $tmp_archivo = $_FILES['archivo']['tmp_name'];
      $fichero_subido = $ruta . basename($nombre_archivo);

      if (move_uploaded_file($_FILES['archivo']['tmp_name'], $fichero_subido)) echo "s";
      else echo "n";
      break;

   case 'D_CONVENIO':
      $sql = "DELETE FROM T_CONVENIOS_COMPRAS WHERE ID = '" . $_POST['id'] . "';
      DELETE FROM T_CONVENIOS_COMPRAS_GRUPOS WHERE ID_CONVENIO ='" . $_POST['id'] . "';";

      if (mssql_query($sql)) {
         echo json_encode(['ok' => true, 'mensaje' => '', 'SQL' => $sql]);
      } else {
         echo json_encode(['ok' => false, 'mensaje' => '', 'SQL' => $sql]);
      }
      break;

   case 'G_CENTROS':
      $sociedad = $_POST['sociedad'];
      $sql = "SELECT CENTRO_SUMINISTRADOR AS CENTRO, CIUDAD FROM T_OFICINAS_VENTAS";

      if ($sociedad !== "*" && $sociedad !== "") {
         $sql .= " WHERE ORGANIZACION_VENTAS = '$sociedad'";
      }

      $sql .= " ORDER BY CENTRO_SUMINISTRADOR DESC";

      $resultado = GenerarArray($sql, "");

      if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
      else echo json_encode(['ok' => false, 'data' => []]);
}