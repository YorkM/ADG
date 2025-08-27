<?php
include('funciones.php');
session_start();
conectar();
switch ($_POST['op']) {
    case "G_CONCEPTOS":
        $query = "SELECT * FROM T_CONCEPTOS_FLUJO_CAJA";
        $resultado = GenerarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    case "G_SALDOS_BANCOS":
        $anio = $_POST['anio'];
        $organizacion = $_POST['organizacion'];
        $fechaSAP = $_POST['fechaSAP'];


        $cuentasArray = $organizacion === "2000"
            ? ['1110050200', '1110050300', '1110050600', '1110050800', '1110051100', '1110051300', '1120100400']
            : ['1110050100', '1110050500', '1110050700', '1110050900'];

        $cuentas = "'" . implode("','", $cuentasArray) . "'";
        
        $query = "SELECT CASE BSCHL WHEN '40' THEN 'INGRESOS' ELSE 'EGRESOS' END AS tipo,   
        BSCHL AS clave, SUM(WRBTR) * 100 AS importe FROM BSEG 
        WHERE GJAHR = '$anio' AND BUKRS = '$organizacion' AND 
        BSCHL IN('40', '50') AND VALUT = '20250810' AND 
        HKONT IN($cuentas)
        GROUP BY BSCHL";

        $resultado = generarArrayHana($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    case "V_SALDOS_BANCOS":
        $organizacion = $_POST['organizacion'];

        $query = "SELECT * FROM T_MOVIMIENTOS_FLUJO_CAJA 
        WHERE CONCEPTO_FK IN ('10', '11') 
        AND FECHA = CAST(GETDATE() AS DATE) AND ORGANIZACION = '$organizacion'";

        $resultado = generarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    case "I_CONCEPTO":
        $concepto = utf8_decode($_POST['concepto']);

        $query = "INSERT INTO T_CONCEPTOS_FLUJO_CAJA (TEXTO, DESCRIPCION) VALUES ('$concepto', '')";
        $resultado = mssql_query($query);
        if ($resultado) echo json_encode(['ok' => true, 'msg' => "Concepto agregado"]);
        else echo json_encode(['ok' => false, 'msg' => "Error al agregar concepto"]);
        break;

    case "I_MOVIMIENTO":
        $fecha = $_POST['fecha'];
        $dia = intval($_POST['dia']);
        $mes = intval($_POST['mes']);
        $anio = intval($_POST['anio']);
        $tipoM = $_POST['tipoM'];
        $tipoP = $_POST['tipoP'];
        $concepto = utf8_decode($_POST['concepto']);
        $monto = $_POST['monto'];
        $descripcion = utf8_decode($_POST['descripcion']);
        $organizacion = $_POST['organizacion'];
        $usuario = $_POST['usuario']; 

        $query = "INSERT INTO T_MOVIMIENTOS_FLUJO_CAJA (ORGANIZACION, FECHA, DIA, MES, ANIO, TIPO_MOVIMIENTO, TIPO_PRESUPUESTO, CONCEPTO_FK, VALOR, USUARIO, FECHA_REGISTRO, DESCRIPCION)
        VALUES ('$organizacion', '$fecha', $dia, $mes, $anio, '$tipoM', '$tipoP', $concepto, '$monto', '$usuario', GETDATE(), '$descripcion')";

        $resultado = mssql_query($query);
        if ($resultado) echo json_encode(['ok' => true, 'msg' => "Movimiento agregado"]);
        else echo json_encode(['ok' => false, 'msg' => "Error al agregar moviemiento"]);
        break;

    case "I_MOVIMIENTO_AUTO":
        $fecha = $_POST['fecha'];
        $dia = intval($_POST['dia']);
        $mes = intval($_POST['mes']);
        $anio = intval($_POST['anio']);
        $monto = $_POST['montoIngresoSaldoBanco'];
        $monto2 = $_POST['montoEgresoSaldoBanco'];
        $organizacion = $_POST['organizacion'];
        $usuario = $_POST['usuario']; 

        $query = "INSERT INTO T_MOVIMIENTOS_FLUJO_CAJA (ORGANIZACION, FECHA, DIA, MES, ANIO, TIPO_MOVIMIENTO, TIPO_PRESUPUESTO, CONCEPTO_FK, VALOR, USUARIO, FECHA_REGISTRO, DESCRIPCION)
        VALUES ('$organizacion', '$fecha', $dia, $mes, $anio, '1', '1', '10', '$monto', '$usuario', GETDATE(), 'SALDO BANCO SAP')";
        $resultado = mssql_query($query);

        $query2 = "INSERT INTO T_MOVIMIENTOS_FLUJO_CAJA (ORGANIZACION, FECHA, DIA, MES, ANIO, TIPO_MOVIMIENTO, TIPO_PRESUPUESTO, CONCEPTO_FK, VALOR, USUARIO, FECHA_REGISTRO, DESCRIPCION)
        VALUES ('$organizacion', '$fecha', $dia, $mes, $anio, '2', '1', '11', '$monto2', '$usuario', GETDATE(), 'SALIDA SALDO BANCO SAP')";
        $resultado2 = mssql_query($query2);

        if ($resultado && $resultado2) echo json_encode(['ok' => true, 'msg' => "Movimientos autos agregados"]);
        else echo json_encode(['ok' => false, 'msg' => "Error al agregar movimentos auto"]);
        break;

    case "G_MOVIMIENTOS":
        $organizacion = $_POST['organizacion'];
        $fechaInicio = $_POST['fechaInicio'];
        $fechaFinal = $_POST['fechaFinal'];

        $query = "SELECT MC.DIA, MC.MES, MC.ANIO, MC.ORGANIZACION, CC.TEXTO, MC.VALOR, MC.DESCRIPCION, MC.FECHA,
        CASE WHEN MC.TIPO_MOVIMIENTO = '1' THEN 'INGRESO' ELSE 'EGRESO' END AS TIPO_M 
        FROM T_MOVIMIENTOS_FLUJO_CAJA MC
        INNER JOIN T_CONCEPTOS_FLUJO_CAJA CC ON MC.CONCEPTO_FK = CC.ID
        WHERE MC.ORGANIZACION = '$organizacion'
        AND CAST(MC.FECHA AS DATE) BETWEEN '$fechaInicio' AND '$fechaFinal'
        ORDER BY MC.FECHA ASC";

        $resultado = GenerarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    case "G_BIMESTRES":
        $anio = intval($_POST['anio']);
        $query = "WITH BASE AS (
        SELECT 
            CASE 
            WHEN MONTH(FECHA) IN (1,2) THEN 'ENERO - FEBRERO'
            WHEN MONTH(FECHA) IN (3,4) THEN 'MARZO - ABRIL'
            WHEN MONTH(FECHA) IN (5,6) THEN 'MAYO - JUNIO'
            WHEN MONTH(FECHA) IN (7,8) THEN 'JULIO - AGOSTO'
            WHEN MONTH(FECHA) IN (9,10) THEN 'SEPTIEMBRE - OCTUBRE'
            ELSE 'NOVIEMBRE - DICIEMBRE' END AS BIMESTRE,
            FECHA, TIPO_MOVIMIENTO, VALOR
        FROM T_MOVIMIENTOS_FLUJO_CAJA
        WHERE YEAR(FECHA) = $anio)

        SELECT
        BIMESTRE,        
        -- Se obtiene el total de los ingresos y egresos
        SUM(CASE WHEN TIPO_MOVIMIENTO = '1' THEN VALOR ELSE 0 END) AS TOTAL_INGRESOS,
        SUM(CASE WHEN TIPO_MOVIMIENTO = '2' THEN VALOR ELSE 0 END) AS TOTAL_EGRESOS,        
        -- Cálculo del Flujo neto
        SUM(CASE WHEN TIPO_MOVIMIENTO = '1' THEN VALOR ELSE 0 END) - 
        SUM(CASE WHEN TIPO_MOVIMIENTO = '2' THEN VALOR ELSE 0 END) AS FLUJO_CAJA_NETO,
        -- Promedios diarios (basado en días con movimiento)
        ROUND(
            SUM(CASE WHEN TIPO_MOVIMIENTO = '1' THEN VALOR ELSE 0 END) * 1.0 / 
            NULLIF(COUNT(DISTINCT FECHA), 0), 2) AS PROM_INGRESOS_DIA,

        ROUND(
            SUM(CASE WHEN TIPO_MOVIMIENTO = '2' THEN VALOR ELSE 0 END) * 1.0 / 
            NULLIF(COUNT(DISTINCT FECHA), 0), 2) AS PROM_EGRESOS_DIA,
        -- Frecuencia de movimiwntos por bimestre
        COUNT(DISTINCT FECHA) AS DIAS_CON_MOVIMIENTO,
        COUNT(CASE WHEN TIPO_MOVIMIENTO = '1' THEN 1 END) AS NUM_INGRESOS,
        COUNT(CASE WHEN TIPO_MOVIMIENTO = '2' THEN 1 END) AS NUM_EGRESOS,
        -- Porcentaje de egresos respecto a ingresos
        ROUND(
            CASE 
            WHEN SUM(CASE WHEN TIPO_MOVIMIENTO = '1' THEN VALOR ELSE 0 END) = 0 THEN 0
            ELSE 
                100.0 * SUM(CASE WHEN TIPO_MOVIMIENTO = '2' THEN VALOR ELSE 0 END) /
                SUM(CASE WHEN TIPO_MOVIMIENTO = '1' THEN VALOR ELSE 0 END)
            END, 2) AS PORCENTAJE_EGRESOS_SOBRE_INGRESOS

        FROM BASE
        GROUP BY BIMESTRE
        ORDER BY 
        CASE 
            WHEN BIMESTRE = 'ENERO - FEBRERO' THEN 1
            WHEN BIMESTRE = 'MARZO - ABRIL' THEN 2
            WHEN BIMESTRE = 'MAYO - JUNIO' THEN 3
            WHEN BIMESTRE = 'JULIO - AGOSTO' THEN 4
            WHEN BIMESTRE = 'SEPTIEMBRE - OCTUBRE' THEN 5
            ELSE 6
        END";

        $resultado = GenerarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    case "G_DIAS":
        $anio = intval($_POST['anio']);
        $query = "WITH BASE AS (
            SELECT FECHA, TIPO_MOVIMIENTO, VALOR
            FROM T_MOVIMIENTOS_FLUJO_CAJA
            WHERE YEAR(FECHA) = $anio)

        SELECT
            CONVERT(VARCHAR, FECHA, 23) AS DIA,

            SUM(CASE WHEN TIPO_MOVIMIENTO = '1' THEN VALOR ELSE 0 END) AS TOTAL_INGRESOS,
            SUM(CASE WHEN TIPO_MOVIMIENTO = '2' THEN VALOR ELSE 0 END) AS TOTAL_EGRESOS,

            SUM(CASE WHEN TIPO_MOVIMIENTO = '1' THEN VALOR ELSE 0 END) - 
            SUM(CASE WHEN TIPO_MOVIMIENTO = '2' THEN VALOR ELSE 0 END) AS FLUJO_CAJA_NETO,

            COUNT(CASE WHEN TIPO_MOVIMIENTO = '1' THEN 1 END) AS NUM_INGRESOS,
            COUNT(CASE WHEN TIPO_MOVIMIENTO = '2' THEN 1 END) AS NUM_EGRESOS,

            ROUND(
                CASE 
                WHEN SUM(CASE WHEN TIPO_MOVIMIENTO = '1' THEN VALOR ELSE 0 END) = 0 THEN 0
                ELSE 
                    100.0 * SUM(CASE WHEN TIPO_MOVIMIENTO = '2' THEN VALOR ELSE 0 END) /
                    SUM(CASE WHEN TIPO_MOVIMIENTO = '1' THEN VALOR ELSE 0 END)
                END, 2
            ) AS PORCENTAJE_EGRESOS_SOBRE_INGRESOS

        FROM BASE
        -- WHERE FECHA BETWEEN '2025-08-09' AND '2025-08-09'
        GROUP BY FECHA
        ORDER BY FECHA";

        $resultado = GenerarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;

    case "G_REAL_PROYECTADO":
        $anio = intval($_POST['anio']);
        $query = "WITH DATOS AS (
        SELECT 
            FECHA,
            CASE TIPO_MOVIMIENTO WHEN 1 THEN 'INGRESO' ELSE 'EGRESO' END AS TIPO,
            SUM(VALOR) AS VALOR,
            TIPO_PRESUPUESTO
        FROM T_MOVIMIENTOS_FLUJO_CAJA
        WHERE YEAR(FECHA) = $anio
        GROUP BY FECHA, TIPO_MOVIMIENTO, TIPO_PRESUPUESTO)

        SELECT 
        D1.FECHA,
        COALESCE(R.INGRESO, 0) AS INGRESO_REAL,
        COALESCE(P.INGRESO, 0) AS INGRESO_PROYECTADO,
        COALESCE(R.EGRESO, 0) AS EGRESO_REAL,
        COALESCE(P.EGRESO, 0) AS EGRESO_PROYECTADO
        FROM
        (SELECT DISTINCT FECHA FROM DATOS) D1
        LEFT JOIN (
        SELECT FECHA, 
                SUM(CASE WHEN TIPO = 'INGRESO' THEN VALOR ELSE 0 END) AS INGRESO,
                SUM(CASE WHEN TIPO = 'EGRESO' THEN VALOR ELSE 0 END) AS EGRESO
        FROM DATOS WHERE TIPO_PRESUPUESTO = 1
        GROUP BY FECHA
        ) R ON R.FECHA = D1.FECHA
        LEFT JOIN (
        SELECT FECHA, 
                SUM(CASE WHEN TIPO = 'INGRESO' THEN VALOR ELSE 0 END) AS INGRESO,
                SUM(CASE WHEN TIPO = 'EGRESO' THEN VALOR ELSE 0 END) AS EGRESO
        FROM DATOS WHERE TIPO_PRESUPUESTO = 2
        GROUP BY FECHA
        ) P ON P.FECHA = D1.FECHA
        ORDER BY D1.FECHA;";

        $resultado = GenerarArray($query, "");
        if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
        else echo json_encode(['ok' => false, 'data' => []]);
        break;
}