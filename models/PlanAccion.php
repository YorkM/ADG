<?php
include('funciones.php');
session_start();
conectar();

switch ($_POST['op']) {
    case "I_PLAN_ACCION":
        $id = insertWhidthReturnId($_POST, 'T_PROCESO_PLAN_ACCION', true);

        if ($id > 0) echo json_encode(array('ok' => true, 'id' => $id));
        else echo json_encode(array('ok' => false, 'id' => 0));
        break;

    case "I_DETALLE_PLAN_ACCION":
        $datos = json_decode($_POST["planArray"], true);

        if (!empty($datos)) {
            $valores = [];

            foreach ($datos as $fila) {
                $id_plan = intval($fila["idPlan"]);
                $accion = $fila["accion"];
                $fecha_inicio = $fila["fechaInicio"];
                $fecha_final = $fila["fechaFinal"];
                $responsable = $fila["responsable"];

                $valores[] = "($id_plan, '$accion', '$fecha_inicio', '$fecha_final', '$responsable')";
            }

            if (!empty($valores)) {
                $sql = "INSERT INTO T_DETALLE_PROCESO_PLAN_ACCION (ID_PROCESO, ACCIONES, FECHA_INICIO, FECHA_FINAL, RESPONSABLE) VALUES " . implode(",", $valores);

                $result = mssql_query($sql);

                if ($result) echo json_encode(array('ok' => true, 'msg' => "Se insertaron los datos correctamente"));
                else echo json_encode(array('ok' => false, 'msg' => "Error al insertar los datos"));
            } else echo json_encode("No hay datos");
        }
        break;

    case "G_PLANES_ACCION":
        $sql = "SELECT * FROM T_PROCESO_PLAN_ACCION";
        $resultado = GenerarArray($sql, '');

        if ($resultado) echo json_encode(array('ok' => true, 'data' => $resultado));
        else echo json_encode(array('ok' => false, 'data' => []));
        break;

    case "G_DETALLES_PLANES_ACCION":
        $id = $_POST['id'];
        $sql = "SELECT * FROM T_DETALLE_PROCESO_PLAN_ACCION WHERE ID_PROCESO = $id";
        $resultado = GenerarArray($sql, '');

        if ($resultado) echo json_encode(array('ok' => true, 'data' => $resultado));
        else echo json_encode(array('ok' => false, 'data' => []));
        break;

    case "U_DETALLE_PLAN":
        $datos = json_decode($_POST["datos"], true);

        if (!empty($datos)) {
            $errores = [];
            foreach ($datos as $fila) {
                $id = intval($fila["id"]);
                $indice = $fila["indice"];
                $avance = $fila["avance"];
                $resultado = $fila["resultado"];
                $estado = $fila["estado"];

                // Validar que ID es correcto antes de actualizar
                if ($id <= 0) {
                    $errores[] = "ID inválido: $id";
                    continue;
                }

                $sql = "UPDATE T_DETALLE_PROCESO_PLAN_ACCION 
                            SET INDICE = '$indice', 
                                RESULTADOS = '$resultado', 
                                AVANCE = '$avance', 
                                ESTADO = '$estado' 
                            WHERE ID = $id";

                $result = mssql_query($sql);
                if (!$result) {
                    $errores[] = "Error al actualizar ID $id";
                }
            }

            if (empty($errores)) {
                echo json_encode(['ok' => true, 'msg' => "Se actualizaron los datos correctamente"]);
            } else {
                echo json_encode(['ok' => false, 'msg' => "Algunas filas no se actualizaron", 'errores' => $errores]);
            }
        } else {
            echo json_encode(["ok" => false, "msg" => "No hay datos"]);
        }
        break;
}
