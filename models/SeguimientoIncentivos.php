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
        $cuotaValor = $_POST["cuotaValor"];
        $cuotaImpactos = $_POST["cuotaImpactos"];
        $tipoSeguimiento = $_POST["tipoSeguimiento"];
        $fechaInicio = $_POST["fechaInicio"];
        $fechaFinal = $_POST["fechaFinal"];

        $query = "INSERT INTO T_SEGUIMIENTO_INCENTIVOS (ORGANIZACION_VENTAS, OFICINA_VENTAS, PROVEEDOR, CUOTA_VALOR, CUOTA_IMPACTOS, TIPO_SEGUIMIENTO, FECHA_INICIO, FECHA_FINAL) VALUES ('$orgVentas', '$oficinaVentas', '$proveedor', '$cuotaValor', '$cuotaImpactos', '$tipoSeguimiento', '$fechaInicio', '$fechaFinal')";

        $resultado = mssql_query ($query);
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

    case "G_DATOS_SEGUIMIENTO":
        $grupoArticulo = $_POST['grupoArticulo'];
        $organizacion = $_POST['organizacion'];
        $fechaInicio = $_POST['fechaInicio'];
        $fechaFinal = $_POST['fechaFinal'];
        $zona = $_POST['zona'];

        $query = "SELECT 
                    ZV.ZONA_DESCRIPCION,
                    VF.ZONA_VENTAS, 
                    SUM(VF.CANTIDAD) AS CANTIDAD,
                    SUM(VF.P_NETO) AS TOTAL_NETO,
                    SUM(VF.P_NETO_IVA) AS TOTAL_NETO_IVA,
                    SUM(VF.P_FACTURA_NETO) AS TOTAL_NETO_FACT,
                    COUNT(DISTINCT VF.CODIGO_SAP) AS IMPACTOS
                FROM V_FACTURACION VF
                INNER JOIN T_ZONAS_VENTAS ZV ON VF.ZONA_VENTAS = ZV.ZONA_VENTAS
                WHERE CAST(FECHA_PEDIDO AS DATE) 
                    BETWEEN  CAST('$fechaInicio' AS DATE) 
                    AND CAST('$fechaFinal' AS DATE)
                    AND GRUPO_ARTICULOS = '$grupoArticulo'
                    AND ORGANIZACION_VENTAS = '$organizacion'
                    AND VF.ZONA_VENTAS LIKE '$zona%'
                GROUP BY 
                    VF.ZONA_VENTAS,
                    ZV.ZONA_DESCRIPCION";
        $resultado = GenerarArray($query, "");
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

    case "U_DATOS_NOTA":
        $idSeguimiento = intval($_POST["idSeguimiento"]);      
        $numeroNota = $_POST["numeroNota"];      
        $valorNota = $_POST["valorNota"];      

        $query = "UPDATE T_SEGUIMIENTO_INCENTIVOS SET NUMERO_NOTA = '$numeroNota', VALOR_NOTA = '$valorNota' WHERE ID = $idSeguimiento";

        $resultado = mssql_query ($query);
        if ($resultado) echo json_encode(['ok' => true, 'msg' => "Se actualizaron los datos correctamente"]);
        else echo json_encode(['ok' => false, 'msg' => "Error al actualizar los datos"]);
        break;
}