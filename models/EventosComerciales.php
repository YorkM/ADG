<?php
include('funciones.php');
session_start();
conectar();

function materialesTransito($anio, $mes)
{
    $sociedad = $_SESSION['ses_NumOrg'];

    $sql = "SELECT 
            --A.AEDAT AS FECHA,
            --A.EBELN AS OC,
            --A.EBELP AS POSICION,
            A.WERKS AS CENTRO,
            LTRIM(A.MATNR, '0') AS MATERIAL,
           -- A.MENGE AS CANTIDAD_OC,
            --COALESCE(SUM(C.MENGE), 0) AS CANTIDAD_ING,
            --(A.MENGE - COALESCE(SUM(C.MENGE), 0)) AS CANTIDAD_PENDIENTE
           ROUND( CAST( (SUM(A.MENGE) - COALESCE(SUM(C.MENGE), 0)) AS DECIMAL(18,0)) ,0) AS TRANSITO
        FROM EKPO A
        INNER JOIN EKKO B ON A.EBELN = B.EBELN
        LEFT  JOIN EKBE C ON A.EBELN = C.EBELN  AND A.EBELP = C.EBELP AND C.BEWTP = 'E'
        WHERE 
            YEAR(A.AEDAT) = '$anio'  
            AND MONTH(A.AEDAT) = '$mes'  
            AND B.BUKRS = '$sociedad'
            AND A.LOEKZ <> 'X' --Indicador de borrado
            -- AND A.EBELN = '4000012804'  
            -- AND A.MATKL = 'BICO0331' 
        GROUP BY 
            --A.AEDAT,
            --A.EBELN,
            --A.EBELP,
            A.WERKS,
            LTRIM(A.MATNR, '0')
          --  A.MENGE
        HAVING  (SUM(A.MENGE) - COALESCE(SUM(C.MENGE), 0))  > 0
       ";
    return json_encode(generarArrayHana($sql, ''));
}

switch ($_POST['op']) {
    case "G_DETALLE_EVENTO":
        $id_evento = intval($_POST['id']);
        $sql = "SELECT * FROM V_EVENTOS_SEGUIMIENTO_DETALLE WHERE ID_EVENTO = $id_evento";
        $resultado = GenerarArray($sql, '');
        if ($resultado) echo json_encode(array('ok' => true, 'data' => $resultado));
        else echo json_encode(array('ok' => false, 'msg' => "Error al obtener los datos"));
        break;

    case "G_DETALLE_CONSOLIDADOS":
        $codigo_cliente = intval($_POST['codigoCliente']);
        $sql = "SELECT * FROM V_EVENTOS_SEGUIMIENTO_DETALLE WHERE CODIGO_CLIENTE = $codigo_cliente";
        $resultado = GenerarArray($sql, '');
        if ($resultado) echo json_encode(array('ok' => true, 'data' => $resultado));
        else echo json_encode(array('ok' => false, 'msg' => "Error al obtener los datos"));
        break;

    case "G_CONSOLIDADO_EVENTO":
        $id_evento = intval($_POST['id']);
        $sql = "SELECT * FROM V_EVENTOS_SEGUIMIENTO_CONSOLIDADO WHERE ID_EVENTO = $id_evento";
        $resultado = GenerarArray($sql, '');
        if ($resultado) echo json_encode(array('ok' => true, 'data' => $resultado));
        else echo json_encode(array('ok' => false, 'msg' => "Error al obtener los datos"));
        break;

    case "G_ZONA_EVENTO":
        $id_evento = intval($_POST['id']);
        $sql = "SELECT * FROM V_EVENTOS_SEGUIMIENTO_ZONA WHERE ID_EVENTO = $id_evento";
        $resultado = GenerarArray($sql, '');
        if ($resultado) echo json_encode(array('ok' => true, 'data' => $resultado));
        else echo json_encode(array('ok' => false, 'msg' => "Error al obtener los datos"));
        break;

    case "G_CONSOLIDADO_COMPRA_EVENTO":
        $id_evento = intval($_POST['id']);
        $sp = mssql_init("P_EVENTOS_SEGUIMIENTO_COMPRAS");
        mssql_bind($sp, '@ID_EVENTO', $id_evento, SQLINT4, false, false);
        $r  = mssql_execute($sp);
        $anio = '';
        $mes = '';
        while ($row = mssql_fetch_array($r)) {
            $anio = $row['ANIO'];
            $mes = $row['MES'];
            $datos[] = array(
                'id_evento' => $row['ID_EVENTO'],
                'codigo' => $row['CODIGO'],
                'descripcion' => utf8_encode($row['DESCRIPCION']),
                'grupo' => utf8_encode($row['GRUPO_ARTICULOS']),
                'oficina' => $row['OFICINA_VENTAS'],
                'organizacion' => $row['ORGANIZACION_VENTAS'],
                'centro' => $row['CENTRO'],
                'almacen' => $row['ALMACEN'],
                'stock' => $row['STOCK'],
                'cantidad' => $row['CANTIDAD'],
                'pneto_evento' => $row['P_NETO_EVENTO'],
                'cantidad_facturada' => $row['CANTIDAD_FACTURADA'],
                'pneto_facturado' => $row['VALOR_FACTURADO_EVENTO']
            );
        }
        $transito = materialesTransito($anio, $mes);
        echo json_encode([
            'datos' => $datos,
            'transito' => $transito
        ]);
        break;

    case "I_PRESUPUESTO_EVENTO":
        $id_evento = intval($_POST['idEvento']);
        $oficica = $_POST['oficina'];
        $evento_anterior = $_POST['eventoAnterior'];
        $presupuesto = $_POST['presupuesto'];
        $sql = mssql_query("INSERT INTO T_PRESUPUESTO_EVENTO (ID_EVENTO, OFICINA_VENTAS, EVENTO_ANTERIOR, PRESUPUESTO) VALUES ($id_evento, '$oficica', '$evento_anterior', '$presupuesto')");
        if ($sql) echo json_encode(array('ok' => true, 'msg' => "Se inserto el registro correctamente"));
        else echo json_encode(array('ok' => false, 'msg' => "Error al insertar registro"));
        break;

    case "G_PRESUPUESTO_EVENTO":
        $id_evento = intval($_POST['idEvento']);
        $sql = "SELECT PE.ID, PE.ID_EVENTO, PE.OFICINA_VENTAS,
                OV.DESCRIPCION, PE.EVENTO_ANTERIOR, PE.PRESUPUESTO 
                FROM T_PRESUPUESTO_EVENTO PE
                INNER JOIN T_OFICINAS_VENTAS OV ON PE.OFICINA_VENTAS = OV.OFICINA_VENTAS 
                WHERE ID_EVENTO = $id_evento";
        $resultado = GenerarArray($sql, '');
        if ($resultado) echo json_encode(array('ok' => true, 'data' => $resultado));
        else echo json_encode(array('ok' => false, 'data' => []));
        break;

    case "G_PORTAFOLIO_EVENTO":
        $id_evento = intval($_POST['idEvento']);
        $sql = "SELECT * FROM T_PORTAFOLIOS WHERE ID_EVENTO = $id_evento";
        $resultado = GenerarArray($sql, '');
        if ($resultado) echo json_encode(array('ok' => true, 'data' => $resultado));
        else echo json_encode(array('ok' => false, 'data' => []));
        break;

    case "G_PRESUPUESTO_EVENTO_ZONA":
        $oficina = intval($_POST['oficina']);
        $id_evento = intval($_POST['idEvento']);
        $sql = "SELECT 
                    ZV.ZONA_VENTAS,
                    ZV.ZONA_DESCRIPCION,
                    ISNULL(ZP.PRESUPUESTO, 0) AS PRESUPUESTO
                FROM T_ZONAS_VENTAS ZV
                LEFT JOIN T_ZONA_PRESUPUESTO_EVENTO ZP 
                    ON ZV.ZONA_VENTAS = ZP.ZONA_VENTAS 
                    AND (ZP.ID_EVENTO = $id_evento OR ZP.ID_EVENTO IS NULL)
                WHERE ZV.ZONA_VENTAS LIKE '$oficina%'";
        $resultado = GenerarArray($sql, '');
        if ($resultado) echo json_encode(array('ok' => true, 'data' => $resultado));
        else echo json_encode(array('ok' => false, 'data' => []));
        break;

    case "G_PRESUPUESTO_ZONA_BANDERA":
        $oficina = intval($_POST['oficinaSubs']);
        $id_evento = intval($_POST['idEvento']);
        $sql = "SELECT * FROM T_ZONA_PRESUPUESTO_EVENTO WHERE ZONA_VENTAS LIKE '$oficina%' AND ID_EVENTO = '$id_evento'";
        $resultado = GenerarArray($sql, '');
        if ($resultado) echo json_encode(array('ok' => true, 'data' => $resultado));
        else echo json_encode(array('ok' => false, 'data' => []));
        break;

    case "I_PRESUPUESTO_EVENTO_ZONA":
        $datos = json_decode($_POST["datos"], true);

        if (!empty($datos)) {
            $valores = [];

            foreach ($datos as $fila) {
                $id_evento = intval($fila["idEvento"]);
                $zona_ventas = $fila["zonaVentas"];
                $zona_descrip = $fila["zonaDescripcion"];
                $presupuesto = $fila["presupuesto"];

                $valores[] = "($id_evento, '$zona_ventas', '$zona_descrip', '$presupuesto')";
            }

            if (!empty($valores)) {
                $sql = "INSERT INTO T_ZONA_PRESUPUESTO_EVENTO (ID_EVENTO, ZONA_VENTAS, ZONA_DESCRIPCION, PRESUPUESTO) VALUES " . implode(",", $valores);

                $result = mssql_query($sql);
                if ($result) echo json_encode(array('ok' => true, 'msg' => "Se insertaron los datos correctamente"));
                else echo json_encode(array('ok' => false, 'msg' => "Error al insertar los datos"));
            } else echo json_encode("No hay datos");
        }
        break;

    case "U_PRESUPUESTO_EVENTO_ZONA":
        $datos = json_decode($_POST["datos"], true);
        $result = "";

        if (!empty($datos)) {
            foreach ($datos as $fila) {
                $id_evento = intval($fila["idEvento"]);
                $zona_ventas = $fila["zonaVentas"];
                $presupuesto = $fila["presupuesto"];

                $sql = "UPDATE T_ZONA_PRESUPUESTO_EVENTO SET PRESUPUESTO = '$presupuesto' WHERE ZONA_VENTAS = '$zona_ventas' AND ID_EVENTO = $id_evento";
                $result = mssql_query($sql);
            }

            if ($result) echo json_encode(array('ok' => true, 'msg' => "Se actualizaron los datos correctamente"));
            else echo json_encode(array('ok' => false, 'msg' => "Error al actualizar los datos"));
        }
        break;

    case "D_PRESUPUESTO_EVENTO":
        $id_evento = intval($_POST['idEvento']);
        $zona_ventas = $_POST['zonaVentas'];
        $oficina = $_POST['oficina'];

        mssql_query("BEGIN TRANSACTION");

        try {
            $query_zonas = "DELETE FROM T_ZONA_PRESUPUESTO_EVENTO WHERE ZONA_VENTAS LIKE '$zona_ventas%' AND ID_EVENTO = $id_evento";
            $result_zona = mssql_query($query_zonas);
            if (!$result_zona) {
                throw new Exception("Error eliminando registros en T_ZONA_PRESUPUESTO_EVENTO: " . mssql_get_last_message());
            }

            $queryOficina = "DELETE FROM T_PRESUPUESTO_EVENTO WHERE ID_EVENTO = $id_evento AND OFICINA_VENTAS = '$oficina'";
            $resultOficina = mssql_query($queryOficina);
            if (!$resultOficina) {
                throw new Exception("Error eliminando registros en T_PRESUPUESTO_EVENTO: " . mssql_get_last_message());
            }

            mssql_query("COMMIT");

            echo json_encode(array('ok' => true, 'message' => 'Se eliminó correctamente el registro'));
        } catch (Exception $e) {
            mssql_query("ROLLBACK");
            echo json_encode(array('ok' => false, 'message' => 'Error: ' . $e->getMessage()));
        }
        break;

    case "G_FECHA_HORA":
        $id_evento = $_POST['idEvento'];
        $sql = "SELECT
                DATEADD(HOUR, 17, CAST(C.FECHA_FIN AS DATETIME)) AS FIN_EVENTO,
                GETDATE() AS FECHA_ACTUAL, 
                    CASE 
                        WHEN DATEADD(HOUR, 17, CAST(C.FECHA_FIN AS DATETIME)) > GETDATE() 
                        THEN 'TRUE' 
                        ELSE 'FALSE' 
                    END AS ACTIVO
                FROM T_EVENTOS_CONVOCATORIA C
                WHERE C.ID = $id_evento;";
        $resultado = GenerarArray($sql, '');
        echo json_encode($resultado);
        break;

    case "I_DATOS_PORTAFOLIO":
        $datos = json_decode($_POST["datos"], true);

        if (!empty($datos)) {

            mssql_query("BEGIN TRANSACTION");

            $errores = 0;
            $lotes = array_chunk($datos, 1000);

            foreach ($lotes as $lote) {
                $valores = [];

                foreach ($lote as $fila) {
                    $id_evento = intval($fila["idEvento"]);
                    $material = addslashes($fila["material"]);
                    $estatus = addslashes($fila["estatus"]);
                    $usuario = addslashes($fila["usuario"]);

                    $valores[] = "($id_evento, '$material', '$estatus', '$usuario')";
                }

                $sql = "INSERT INTO T_PORTAFOLIOS (ID_EVENTO, CODIGO_MATERIAL, ESTATUS, USUARIO) VALUES " . implode(",", $valores);
                $result = mssql_query($sql);

                if (!$result) {
                    $errores++;
                }
            }

            if ($errores == 0) {
                mssql_query("COMMIT TRANSACTION");
                echo json_encode(array('ok' => true, 'msg' => "Se insertaron los datos correctamente"));
            } else {
                mssql_query("ROLLBACK TRANSACTION");
                echo json_encode(array('ok' => false, 'msg' => "Error al insertar algunos datos"));
            }
        } else {
            echo json_encode(array('ok' => false, 'msg' => "No hay datos"));
        }
        break;

    case "U_REPLACE_PRESUPUESTO":
        $id_evento = intval($_POST["idEvento"]);
        $oficina = addslashes($_POST["oficina"]);
        $zona_ventas = $_POST['zonaVentas'];
        $evento_anterior = $_POST["eventoAnterior"];
        $presupuesto = $_POST["presupuesto"];

        $sql = "UPDATE T_PRESUPUESTO_EVENTO SET EVENTO_ANTERIOR = '$evento_anterior', PRESUPUESTO = '$presupuesto' WHERE ID_EVENTO = $id_evento AND OFICINA_VENTAS = '$oficina'";
        $result_update = mssql_query($sql);

        $delete_zonas = "DELETE FROM T_ZONA_PRESUPUESTO_EVENTO WHERE ZONA_VENTAS LIKE '$zona_ventas%' AND ID_EVENTO = $id_evento";
        $result_zona = mssql_query($delete_zonas);

        if ($result_update && $delete_zonas) echo json_encode(array('ok' => true, 'msg' => "Se actualizaron los datos correctamente"));
        else echo json_encode(array('ok' => false, 'msg' => "Error al actualizar los datos"));
        break;
}