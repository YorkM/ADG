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
    case "I_PRESUPUESTO_EVENTO_ZONA":
        $id_evento = intval($_POST['idEvento']);    
        $zona_ventas = $_POST['ZONA_VENTAS'];    
        $zona_descrip = $_POST['ZONA_DESCRIPCION'];    
        $presupuesto = intval($_POST['valorPresupuesto']);    
        $sql = mssql_query("INSERT INTO T_ZONA_PRESUPUESTO_EVENTO (ID_EVENTO, ZONA_VENTAS, ZONA_DESCRIPCION, PRESUPUESTO) VALUES ($id_evento, '$zona_ventas', '$zona_descrip', $presupuesto)");
        if ($sql) echo json_encode(array('ok' => true, 'msg' => "Se inserto correctamente"));
        else echo json_encode(array('ok' => false, 'msg' => "Error al insertar"));
        break;

    case "U_PRESUPUESTO_EVENTO_ZONA":
        $id_evento = intval($_POST['idEvento']);    
        $zona_ventas = $_POST['ZONA_VENTAS'];    
        $presupuesto = intval($_POST['valorPresupuesto']);    
        $sql = mssql_query("UPDATE T_ZONA_PRESUPUESTO_EVENTO SET PRESUPUESTO = $presupuesto WHERE ZONA_VENTAS = '$zona_ventas' AND ID_EVENTO = $id_evento");
        if ($sql) echo json_encode(array('ok' => true, 'msg' => "Se actualizo correctamente"));
        else echo json_encode(array('ok' => false, 'msg' => "Error al actualizar"));
        break;

    case "D_PRESUPUESTO_EVENTO_ZONA":
        $id_evento = intval($_POST['idEvento']);    
        $zona_ventas = $_POST['ZONA_VENTAS'];    
        $sql = mssql_query("UPDATE T_ZONA_PRESUPUESTO_EVENTO SET PRESUPUESTO = 0 WHERE ZONA_VENTAS = '$zona_ventas' AND ID_EVENTO = $id_evento");
        if ($sql) echo json_encode(array('ok' => true, 'msg' => "Se actualizo correctamente"));
        else echo json_encode(array('ok' => false, 'msg' => "Error al actualizar"));
        break;
}