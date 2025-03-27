<?php
include('funciones.php');
session_start();
conectar();
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
        $sql = "SELECT * FROM T_PRESUPUESTO_EVENTO WHERE ID_EVENTO = $id_evento";
        $resultado = GenerarArray($sql, '');
        if ($resultado) echo json_encode(array('ok' => true, 'data' => $resultado));
        else echo json_encode(array('ok' => false, 'data' => []));
        break;

    case "G_PRESUPUESTO_EVENTO_ZONA":
        $oficina = intval($_POST['oficina']);
        $id_evento = intval($_POST['idEvento']);
        $sql = "SELECT ZV.ZONA_VENTAS,
       ZV.ZONA_DESCRIPCION,
       ISNULL(ZP.PRESUPUESTO, 0) AS PRESUPUESTO
        FROM T_ZONAS_VENTAS ZV
            LEFT JOIN T_ZONA_PRESUPUESTO_EVENTO ZP ON ZV.ZONA_VENTAS = ZP.ZONA_VENTAS
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
}
