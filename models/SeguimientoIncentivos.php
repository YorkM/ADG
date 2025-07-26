<?php
include('funciones.php');
session_start();
conectar();
switch ($_POST['op']) {
    case "G_GRUPOS_ARTICULOS":
        $query = "SELECT * FROM T_GRUPOS_ARTICULOS 
        WHERE GRUPO_ARTICULO != '01' 
        AND GRUPO_ARTICULO != '02'
        AND GRUPO_ARTICULO != ''";

        $resultado = GenerarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    case "I_DATOS_BASE":
        $orgVentas = $_POST["orgVentas"];
        $oficinaVentas = $_POST["oficinaVentas"];
        $proveedor = $_POST["proveedor"];
        $proveedorDos = $_POST["proveedorDos"];
        $cuotaValor = $_POST["cuotaValor"];
        $cuotaImpactos = $_POST["cuotaImpactos"];
        $tipoSeguimiento = $_POST["tipoSeguimiento"];
        $fechaInicio = $_POST["fechaInicio"];
        $fechaFinal = $_POST["fechaFinal"];

        $query = "INSERT INTO T_SEGUIMIENTO_INCENTIVOS (ORGANIZACION_VENTAS, OFICINA_VENTAS, PROVEEDOR, PROVEEDOR_2, CUOTA_VALOR, CUOTA_IMPACTOS, TIPO_SEGUIMIENTO, FECHA_INICIO, FECHA_FINAL) VALUES ('$orgVentas', '$oficinaVentas', '$proveedor', '$proveedorDos', '$cuotaValor', '$cuotaImpactos', '$tipoSeguimiento', '$fechaInicio', '$fechaFinal')";

        $resultado = mssql_query($query);
        if ($resultado) echo json_encode(['ok' => true, 'msg' => "Se insertaron los datos correctamente"]);
        else echo json_encode(['ok' => false, 'msg' => "Error al insertar los datos"]);
        break;

    case "G_DATOS_BASE":
        $organizacion = $_POST['organizacion'];

        $query = "SELECT * FROM T_SEGUIMIENTO_INCENTIVOS SI
        INNER JOIN T_GRUPOS_ARTICULOS GA ON SI.PROVEEDOR = GA.GRUPO_ARTICULO
        INNER JOIN T_OFICINAS_VENTAS OV ON SI.OFICINA_VENTAS = OV.OFICINA_VENTAS
        WHERE SI.ORGANIZACION_VENTAS = '$organizacion'
        ORDER BY SI.ID ASC";

        $resultado = GenerarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    case "G_DATOS_SEGUIMIENTO":      
        $grupoArticulo = $_POST['grupoArticulo'];
        $organizacion = $_POST['organizacion'];
        $fechaInicio = $_POST['fechaInicio'];
        $fechaFinal = $_POST['fechaFinal'];
        $zona = $_POST['zona'];

        $query = "SELECT a.bzirk_auft AS zona, 
        TRIM(REPLACE_REGEXPR('[^a-zA-Z0-9\s-]' IN REPLACE_REGEXPR('[/+]' IN h.bztxt WITH '-' OCCURRENCE ALL) WITH '' OCCURRENCE ALL)) AS zona_descripcion,
        CAST(SUM(CASE WHEN b.fkart LIKE 'ZN%' THEN a.fkimg *-1 ELSE a.fkimg END) AS DECIMAL(18,0)) AS cantidad,
        CAST(SUM(CASE WHEN b.fkart LIKE 'ZN%' THEN (a.wavwr * 100) * -1 ELSE (a.wavwr * 100) END) AS DECIMAL(18, 0)) AS costo_interno,
        CAST(SUM(CASE WHEN b.fkart LIKE 'ZN%' THEN (a.netwr * 100) * -1 ELSE (a.netwr * 100) END) AS DECIMAL(18, 0)) AS valor_neto,
        COUNT(DISTINCT d.kunnr) AS impactos	
        FROM vbrp AS a 
        INNER JOIN vbrk AS b ON  a.mandt = b.mandt AND a.vbeln = b.vbeln AND (b.fkart LIKE 'ZF%' OR b.fkart LIKE 'ZN%')
        LEFT OUTER JOIN vbak AS c ON c.mandt = a.mandt AND  c.vbeln = a.aubel
        INNER JOIN kna1   AS d ON d.kunnr = b.kunag
        INNER JOIN but000 AS e ON e.partner = b.kunag
        INNER JOIN tvkbt  AS f ON f.vkbur = c.vkbur AND f.spras='S'
        INNER JOIN t023t  AS g ON g.matkl = a.matkl AND g.spras='S'
        LEFT  JOIN t171t  AS h ON h.bzirk = a.bzirk_auft AND h.mandt = '400'
        WHERE a.erdat BETWEEN '$fechaInicio' AND '$fechaFinal' AND a.vkorg_auft = '$organizacion' 
        AND a.matkl IN ($grupoArticulo) AND a.bzirk_auft LIKE '$zona%'
        GROUP BY a.bzirk_auft, h.bztxt    
        ORDER BY a.bzirk_auft ASC";

        $resultado = generarArrayHana($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    case "G_DATOS_NOTAS":
        $idSeguimiento = intval($_POST['idSeguimiento']);

        $query = "SELECT ISNULL(NUMERO_NOTA, 0) AS NUMERO_NOTA, ISNULL(VALOR_NOTA, 0) AS VALOR_NOTA 
        FROM T_SEGUIMIENTO_INCENTIVOS SI
        INNER JOIN T_GRUPOS_ARTICULOS GA ON SI.PROVEEDOR = GA.GRUPO_ARTICULO
        WHERE ID = $idSeguimiento";

        $resultado = GenerarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    case "G_RESUMEN":
        $organizacion = intval($_POST['organizacion']);

        $query = "SELECT GA.DESCRIPCION1 AS LABORATORIO, CONCAT('INCENTIVO FDV', ' ', MONTH(SI.FECHA_INICIO), ' ', YEAR(SI.FECHA_INICIO)) AS CONCEPTO,
        MONTH(SI.FECHA_INICIO) AS MES, YEAR(SI.FECHA_INICIO) AS ANIO, SI.NUMERO_NOTA AS DOCUMENTO, SI.VALOR_NOTA AS VALOR_FINAL
        FROM T_SEGUIMIENTO_INCENTIVOS SI
        INNER JOIN T_GRUPOS_ARTICULOS GA ON SI.PROVEEDOR = GA.GRUPO_ARTICULO
        WHERE SI.ORGANIZACION_VENTAS = '$organizacion' AND VALOR_NOTA IS NOT NULL";

        $resultado = GenerarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;
        
    case "G_BENEFICIARIOS":
        $oficina = $_POST['oficina'];

        $query = "SELECT U.ID, U.IDENTIFICACION, UPPER(CONCAT(U.NOMBRES, ' ', U.APELLIDOS)) AS NOMBRE, U.ROLES_ID AS ROL, UZ.ZONA_VENTAS
        FROM T_USUARIOS U 
        LEFT JOIN T_USUARIOS_ZONAS UZ ON U.ID = UZ.ID_USUARIO
        WHERE ROLES_ID IN (44, 3, 13, 118) AND OFICINA_VENTAS = '$oficina'
        AND ESTADO = 'A' AND ID NOT IN(7228, 30972)";

        $resultado = GenerarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    case "G_BENEFICIARIOS_2":
        $oficina = $_POST['oficina'];

        $query = "SELECT U.ID, U.IDENTIFICACION, UPPER(CONCAT(U.NOMBRES, ' ', U.APELLIDOS)) AS NOMBRE, U.ROLES_ID AS ROL, UZ.ZONA_VENTAS
        FROM T_USUARIOS U 
        LEFT JOIN T_USUARIOS_ZONAS UZ ON U.ID = UZ.ID_USUARIO
        WHERE ROLES_ID IN (12, 14) 
        AND OFICINA_VENTAS = '$oficina'
        AND ESTADO = 'A' AND ID NOT IN(7228, 30972)";

        $resultado = GenerarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    case "U_DATOS_NOTA":
        $idSeguimiento = intval($_POST["idSeguimiento"]);
        $numeroNota = $_POST["numeroNota"];
        $valorNota = $_POST["valorNota"];

        $query = "UPDATE T_SEGUIMIENTO_INCENTIVOS SET NUMERO_NOTA = '$numeroNota', VALOR_NOTA = '$valorNota' WHERE ID = $idSeguimiento";

        $resultado = mssql_query($query);
        if ($resultado) echo json_encode(['ok' => true, 'msg' => "Se actualizaron los datos correctamente"]);
        else echo json_encode(['ok' => false, 'msg' => "Error al actualizar los datos"]);
        break;

    case "U_DATOS_BASE":
        $idSeguimiento = intval($_POST["idSeguimiento"]);
        $cuotaValor = $_POST["cuotaValor"];
        $cuotaImpacto = $_POST["cuotaImpacto"];
        $fechaInicioEdi = $_POST["fechaInicioEdi"];
        $fechaFinalEdi = $_POST["fechaFinalEdi"];

        $query = "UPDATE T_SEGUIMIENTO_INCENTIVOS 
        SET CUOTA_VALOR = '$cuotaValor', CUOTA_IMPACTOS = '$cuotaImpacto', FECHA_INICIO = '$fechaInicioEdi', FECHA_FINAL = '$fechaFinalEdi' 
        WHERE ID = $idSeguimiento";

        $resultado = mssql_query($query);
        if ($resultado) echo json_encode(['ok' => true, 'msg' => "Se actualizaron los datos correctamente"]);
        else echo json_encode(['ok' => false, 'msg' => "Error al actualizar los datos"]);
        break;
}
