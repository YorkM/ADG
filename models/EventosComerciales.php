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
}