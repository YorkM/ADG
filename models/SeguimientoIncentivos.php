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
        INNER JOIN T_GRUPOS_ARTICULOS GA 
        ON SI.PROVEEDOR = GA.GRUPO_ARTICULO
        WHERE SI.ORGANIZACION_VENTAS = '$organizacion'";
        $resultado = GenerarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    // case "G_DATOS_SEGUIMIENTO":
    //     $grupoArticulo = $_POST['grupoArticulo'];
    //     $organizacion = $_POST['organizacion'];
    //     $fechaInicio = $_POST['fechaInicio'];
    //     $fechaFinal = $_POST['fechaFinal'];
    //     $zona = $_POST['zona'];

    //     $query = "SELECT 
    //                 ZV.ZONA_DESCRIPCION,
    //                 VF.ZONA_VENTAS, 
    //                 SUM(VF.CANTIDAD) AS CANTIDAD,
    //                 SUM(VF.P_NETO) AS TOTAL_NETO,
    //                 SUM(VF.P_NETO_IVA) AS TOTAL_NETO_IVA,
    //                 SUM(VF.P_FACTURA_NETO) AS TOTAL_NETO_FACT,
    //                 COUNT(DISTINCT VF.CODIGO_SAP) AS IMPACTOS
    //             FROM V_FACTURACION VF
    //             INNER JOIN T_ZONAS_VENTAS ZV ON VF.ZONA_VENTAS = ZV.ZONA_VENTAS
    //             WHERE CAST(FECHA_PEDIDO AS DATE) 
    //                 BETWEEN  CAST('$fechaInicio' AS DATE) 
    //                 AND CAST('$fechaFinal' AS DATE)
    //                 AND GRUPO_ARTICULOS IN ($grupoArticulo)
    //                 AND ORGANIZACION_VENTAS = '$organizacion'
    //                 AND VF.ZONA_VENTAS LIKE '$zona%'
    //             GROUP BY 
    //                 VF.ZONA_VENTAS,
    //                 ZV.ZONA_DESCRIPCION";
    //     $resultado = GenerarArray($query, "");
    //     if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
    //     else echo json_encode(['ok' => false, 'data' => []]);
    //     break;

    case "G_DATOS_SEGUIMIENTO":      
        $grupoArticulo = $_POST['grupoArticulo'];
        $organizacion = $_POST['organizacion'];
        $fechaInicio = $_POST['fechaInicio'];
        $fechaFinal = $_POST['fechaFinal'];
        $zona = $_POST['zona'];

        $query = "select
                    a.bzirk_auft as zona,
                    trim(REPLACE_REGEXPR('([^a-zA-Z0-9-])' IN h.bztxt WITH '' OCCURRENCE ALL)) as zona_descripcion,
                    cast(sum(case when b.fkart like 'ZN%' then a.fkimg *-1 else a.fkimg end) as decimal(18,0)) as cantidad,
                    cast(sum(case when b.fkart like 'ZN%' then (a.wavwr*100)*-1 else (a.wavwr*100) end) as decimal(18,0)) as costo_interno,
                    cast(sum(case when b.fkart like 'ZN%' then (a.netwr*100)*-1 else (a.netwr*100) end) as decimal(18,0)) as valor_neto,
                    count(distinct d.kunnr) as impactos	
                from vbrp as a 
                inner join vbrk as b on  a.mandt = b.mandt and a.vbeln = b.vbeln and (b.fkart like 'ZF%' or b.fkart like 'ZN%')
                left outer join vbak as c on c.mandt = a.mandt and  c.vbeln = a.aubel
                inner join kna1   as d on d.kunnr = b.kunag
                inner join but000 as e on e.partner = b.kunag
                inner join tvkbt  as f on f.vkbur = c.vkbur and f.spras='S'
                inner join t023t  as g on g.matkl = a.matkl and g.spras='S'
                left  join t171t  as h on h.bzirk = a.bzirk_auft and h.mandt = '400'
                where 
                    a.erdat between '20250601' and '20250625' and 
                    a.vkorg_auft = '2000' and 
                    a.matkl in('FAM00970') and 
                    a.bzirk_auft like '21%'
                group by 
                a.bzirk_auft,
                h.bztxt";
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
        $query = "SELECT 
                      GA.DESCRIPCION1 AS LABORATORIO ,
                      CONCAT('INCENTIVO FDV', ' ', MONTH(SI.FECHA_INICIO), ' ', YEAR(SI.FECHA_INICIO)) AS CONCEPTO,
                      MONTH(SI.FECHA_INICIO) AS MES,
                      YEAR(SI.FECHA_INICIO) AS ANIO,
                      SI.NUMERO_NOTA AS DOCUMENTO,
                      SI.VALOR_NOTA AS VALOR_FINAL
                  FROM T_SEGUIMIENTO_INCENTIVOS SI
                  INNER JOIN T_GRUPOS_ARTICULOS GA 
                  ON SI.PROVEEDOR = GA.GRUPO_ARTICULO
                  WHERE SI.ORGANIZACION_VENTAS = '$organizacion'
                  AND VALOR_NOTA IS NOT NULL";
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
