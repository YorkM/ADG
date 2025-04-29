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
                $accion = utf8_decode( $fila["accion"]);
                $fecha_inicio = $fila["fechaInicio"];
                $fecha_final = $fila["fechaFinal"];
                $responsable = utf8_decode($fila["responsable"]);

                $valores[] = "(
                $id_plan,
                '$accion',
                '$fecha_inicio',
                '$fecha_final',
                '$responsable'
                )";
            }

            if (!empty($valores)) {
                $sql = "INSERT INTO T_DETALLE_PROCESO_PLAN_ACCION (
                ID_PROCESO, 
                ACCIONES, 
                FECHA_INICIO, 
                FECHA_FINAL, 
                RESPONSABLE) 
                VALUES " . implode(",", $valores);

                $result = mssql_query($sql);

                if ($result) echo json_encode(array('ok' => true, 'msg' => "Se insertaron los datos correctamente"));
                else echo json_encode(array('ok' => false, 'msg' => "Error al insertar los datos"));
            } else echo json_encode("No hay datos");
        }
        break;

    case "G_PLANES_ACCION":
        $fecha_desde = $_POST['fechaDesde'];
        $fecha_hasta = $_POST['fechaHasta'];

        $sql = "SELECT P.SOCIEDAD, P.PROCESO, I.PROCESO AS PROCESO_T, P.PERIODO, P.META,
                P.RANGO_INICIAL, P.RANGO_FINAL, P.OBJETIVOS, P.CAUSA_RAIZ, P.INDICADOR
                FROM T_PROCESO_PLAN_ACCION P
                INNER JOIN T_CAL_PROCESOS_INDICADORES I ON P.PROCESO = I.ID 
                WHERE CAST(FECHA_REGISTRO AS DATE) 
                BETWEEN CAST('$fecha_desde' AS DATE)
                AND CAST('$fecha_hasta' AS DATE)";
                
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
                $resultado = utf8_decode($fila["resultado"]);
                $estado = utf8_decode($fila["estado"]);
                $usuario = $fila["usuario"];
                $explicacion = utf8_decode($fila["explicacion"]);

                if ($id <= 0) {
                    $errores[] = "ID inválido: $id";
                    continue;
                }

                $sql = "UPDATE T_DETALLE_PROCESO_PLAN_ACCION 
                            SET INDICE = '$indice', 
                                RESULTADOS = '$resultado', 
                                AVANCE = '$avance', 
                                ESTADO = '$estado', 
                                USUARIO = '$usuario', 
                                FECHA_REGISTRO = GETDATE(), 
                                EXPLICACION = '$explicacion' 
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

    case "G_DIAS_MES":
        $sql = "SELECT CASE WHEN DAY(GETDATE()) > 5 THEN 'FALSE' ELSE 'TRUE' END AS DIAS_MES";
        $resultado = GenerarArray($sql, '');

        echo json_encode($resultado);
        break;

    case "G_PROCESOS":
        $sql = GenerarArray("SELECT * FROM T_CAL_PROCESOS_INDICADORES", '');
        echo json_encode($sql);
        break;

    case "G_REPORTE":
        $proceso = $_POST['proceso'];
        $query = "SELECT
                    COUNT(DISTINCT P.ID) AS cantidad_procesos,
                    COUNT(D.ID) AS cantidad_total_acciones,
                    ISNULL(CAST(AVG(D.AVANCE) AS DECIMAL(20, 2)), 0) AS promedio_avance_acciones,
                    ISNULL(CAST(AVG(D.INDICE) AS DECIMAL(20, 2)), 0) AS promedio_participacion,

                    ISNULL(SUM(CASE WHEN D.ESTADO = 'COMPLETADO' THEN 1 ELSE 0 END), 0) AS acciones_completadas,
                    ISNULL(SUM(CASE WHEN D.ESTADO = 'EN PROCESO' THEN 1 ELSE 0 END), 0) AS acciones_en_proceso,
                    ISNULL(SUM(CASE WHEN D.ESTADO = 'NO INICIADO' THEN 1 ELSE 0 END), 0) AS acciones_no_iniciadas,
                    ISNULL(SUM(CASE WHEN D.ESTADO = 'INCOMPLETO' THEN 1 ELSE 0 END), 0) AS acciones_incompletas,
                    ISNULL(SUM(CASE WHEN D.ESTADO = 'REPROGRAMADO' THEN 1 ELSE 0 END), 0) AS acciones_reprogramadas,

                    ISNULL(CAST(ROUND((SUM(CASE WHEN D.ESTADO = 'COMPLETADO' THEN 1 ELSE 0 END) * 100.0) / COUNT(D.ID), 2) AS DECIMAL(20, 2)), 0) AS porcentaje_completado,    
                    ISNULL(CAST(ROUND((SUM(CASE WHEN D.ESTADO = 'EN PROCESO' THEN 1 ELSE 0 END) * 100.0) / COUNT(D.ID), 2) AS DECIMAL(20, 2)), 0) AS porcentaje_en_proceso,
                    ISNULL(CAST(ROUND((SUM(CASE WHEN D.ESTADO = 'NO INICIADO' THEN 1 ELSE 0 END) * 100.0) / COUNT(D.ID), 2) AS DECIMAL(20, 2)), 0) AS porcentaje_no_iniciado,
                    ISNULL(CAST(ROUND((SUM(CASE WHEN D.ESTADO = 'INCOMPLETO' THEN 1 ELSE 0 END) * 100.0) / COUNT(D.ID), 2) AS DECIMAL(20, 2)), 0) AS porcentaje_incompleto,
                    ISNULL(CAST(ROUND((SUM(CASE WHEN D.ESTADO = 'REPROGRAMADO' THEN 1 ELSE 0 END) * 100.0) / COUNT(D.ID), 2) AS DECIMAL(20, 2)), 0) AS porcentaje_reprogramado

                FROM T_PROCESO_PLAN_ACCION P
                LEFT JOIN T_DETALLE_PROCESO_PLAN_ACCION D ON P.ID = D.ID_PROCESO";
        
        if ($proceso != '') {
            $query .= " WHERE P.PROCESO = '$proceso'";
        }
        $sql = GenerarArray($query, '');
        echo json_encode($sql);
        break;
}