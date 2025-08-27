<?php

ini_set('display_errors', 0);
error_reporting(E_ALL);

// Capturador de errores personalizado
set_error_handler(function ($severity, $message, $file, $line) {
    // Si el error es lo suficientemente severo, detenemos la ejecución
    if (!(error_reporting() & $severity)) {
        return;
    }
    http_response_code(500 ); // Código de error del servidor
    echo json_encode([
        'ok' => false,
        'msg' => "Error interno del servidor.",
        'error_details' => [
            'message' => $message,
            'file' => $file,
            'line' => $line
        ]
    ]);
    exit;
});

ob_clean();
header('Content-Type: application/json');
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
        else echo json_encode(array('ok' => false, 'data' => []));
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
        if ($resultado) 
            echo json_encode(array('ok' => true, 'data' => $resultado));
        else 
            echo json_encode(array('ok' => false, 'data' => []));
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

       case "GUARDAR_LAB_CONFIRMADO":
    // --- 1. Validación de Datos ---
    // Verificamos que SlcLabConfirmado fue enviado y es un array no vacío.
    if (empty($_POST['SlcLabConfirmado']) || !is_array($_POST['SlcLabConfirmado'])) {
        echo json_encode(['ok' => false, 'msg' => 'Debe seleccionar al menos un laboratorio.']);
        exit;
    }

    // --- 2. Recolección de Datos ---
    // Los datos que son comunes a todos los registros
    $id_evento            = intval($_POST['id_evento']);
    $nombre_stand         = addslashes(trim($_POST['nombreStand']));
    $contacto_ejecutivo   = addslashes(trim($_POST['contactoEjecutivo']));
    $responsable          = addslashes(trim($_POST['responsable']));
    $tipo_stand           = addslashes(trim($_POST['tipoStand']));
    $tipo_cobro           = addslashes(trim($_POST['tipoCobro']));
    $valor_participacion  = isset($_POST['valorParticipacion']) ? floatval(preg_replace('/[^\d]/', '', $_POST['valorParticipacion'])) : 0.00;
    $premio               = isset($_POST['premio']) ? floatval(preg_replace('/[^\d]/', '', $_POST['premio'])) : 0.00;
    $valor_total          = isset($_POST['valorTotal']) ? floatval(preg_replace('/[^\d]/', '', $_POST['valorTotal'])) : 0.00;
    $usuario_creacion     = $_SESSION['ses_Usuario']; // Asumo que la sesión existe

    // El array de laboratorios seleccionados
    $laboratorios_seleccionados = $_POST['SlcLabConfirmado'];

    // --- 3. Transacción e Inserción Múltiple ---
    mssql_query("BEGIN TRANSACTION");

    $errores = 0; // Un contador para rastrear si alguna inserción falla

    // Iteramos sobre cada laboratorio seleccionado
    foreach ($laboratorios_seleccionados as $codigo_sap) {
        // Limpiamos el código SAP para seguridad
        $grupo_articulo = addslashes(trim($codigo_sap));

        // Construimos el SQL para esta inserción específica
        $sql = "INSERT INTO T_LAB_CONFIRMADOS (
                    id_evento, grupo_articulo, nombre_stand, contacto_ejecutivo, 
                    responsable, tipo_stand, valor_participacion, premio, 
                    valor_total, tipo_cobro, usuario_creacion
                ) VALUES (
                    $id_evento, '$grupo_articulo', '$nombre_stand', '$contacto_ejecutivo',
                    '$responsable', '$tipo_stand', $valor_participacion, $premio,
                    $valor_total, '$tipo_cobro', '$usuario_creacion'
                )";

        $result = mssql_query($sql);

        // Si esta inserción falla, incrementamos el contador de errores
        if (!$result) {
            $errores++;
            // Opcional: Registrar el error específico para depuración
            error_log("Error insertando lab " . $grupo_articulo . ": " . mssql_get_last_message());
        }
    }

    // --- 4. Finalizar la Transacción ---
    // Si no hubo ningún error en el bucle, confirmamos todos los cambios.
    if ($errores == 0) {
        mssql_query("COMMIT TRANSACTION");
        echo json_encode(['ok' => true, 'msg' => 'Todos los laboratorios han sido guardados exitosamente.']);
    } else {
        // Si hubo al menos un error, revertimos TODAS las inserciones.
        mssql_query("ROLLBACK TRANSACTION");
        echo json_encode(['ok' => false, 'msg' => 'Error: No se pudieron guardar algunos laboratorios. Ningún registro fue guardado.']);
    }
    break;
    
    case "LISTAR_EVENTOS":
            if (!isset($_POST['anioEvento'])) {
        header("Content-Type: application/json");
        echo json_encode(["error" => "El año del evento es un parámetro requerido."]);
        exit; 
    }
        $sql = "
            SELECT  
                E.ID,
                E.ORGANIZACION_VENTAS,
                E.OFICINA_VENTAS,
                E.NOMBRE,
                E.FECHA_INICIO,
                E.ESTADO,
                CLIENTES_CONVOCATORIA = ISNULL((SELECT COUNT(*) FROM T_CLIENTES_CONVOCATORIA C WHERE C.ID_EVENTO = E.ID),0),
                CLIENTES_ASISTENTES   = ISNULL((SELECT DISTINCT COUNT(V.CODIGO_CLIENTE) FROM V_EVENTOS_SEGUIMIENTO_CONSOLIDADO V WHERE V.ID_EVENTO = E.ID),0),
                PRESUPUESTO           = ISNULL((SELECT SUM(P.PRESUPUESTO) FROM T_PRESUPUESTO_EVENTO P WHERE P.ID_EVENTO = E.ID),0),
                VENTAS                = ISNULL((SELECT SUM(V.VALOR_FACTURADO) FROM V_EVENTOS_SEGUIMIENTO_CONSOLIDADO V WHERE V.ID_EVENTO = E.ID),0)
            FROM T_EVENTOS_CONVOCATORIA E
            WHERE 
                YEAR(E.FECHA_INICIO) = '" . $_POST['anioEvento'] . "'";

            // Filtrar por organización si existe la sesión
            if (isset($_SESSION['ses_NumOrg'])) {
            $sql .= " AND E.ORGANIZACION_VENTAS = '" . $_SESSION['ses_NumOrg'] . "'";
            }

            // Filtrar por oficina si aplica
            if ($_POST['oficina'] != '1000' && $_POST['oficina'] != '2000') {
            $sql .= " AND E.OFICINA_VENTAS = '" . $_POST['oficina'] . "'";
            }

            // Filtrar por estado del evento
            if (!empty($_POST['estEvento'])) {
            $sql .= " AND E.ESTADO = '" . $_POST['estEvento'] . "'";
            }

            $sql .= " ORDER BY E.FECHA_INICIO DESC";

            // Ejecutar la primera consulta
            $q = mssql_query($sql);
            if (!$q) {
                header("Content-Type: application/json");
                echo json_encode(array("error" => "Error en la consulta: " . mssql_get_last_message()));
                exit;
            }

            $datos = array();
            while ($row = mssql_fetch_array($q)) {
            // Formatear fecha para mostrar mejor
            $fecha_inicio = "";
            if ($row["FECHA_INICIO"]) {
                $fecha_inicio = date("d/m/Y", strtotime($row["FECHA_INICIO"]));
            }
            
            // Formatear valores numéricos
            $presupuesto = number_format($row["PRESUPUESTO"], 0, ',', '.');
            $ventas = number_format($row["VENTAS"], 0, ',', '.');
            
            // Agregar los datos del evento
            $datos[] = array(
                "id" => $row["ID"],
                "organizacion_ventas" => $row["ORGANIZACION_VENTAS"],
                "oficina_ventas" => $row["OFICINA_VENTAS"],
                "nombre_integracion" => utf8_encode($row["NOMBRE"]),
                "fecha_inicio" => $fecha_inicio,
                "clientes_convocatoria" => $row["CLIENTES_CONVOCATORIA"],
                "clientes_asistentes" => $row["CLIENTES_ASISTENTES"],
                "presupuesto" => $presupuesto,
                "ventas" => $ventas,
                "estado" => $row["ESTADO"]
            );
            }

            // Estructura de respuesta que espera el JavaScript
            $response = array(
            "data" => $datos,
            "total" => count($datos)
            );


            header("Content-Type: application/json");
            echo json_encode($response, JSON_UNESCAPED_UNICODE);
            exit();
        break;

case "M_LAB_CONF_PASSPORT":

    
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);



    $id_evento = intval($_POST['id_evento']);

    // Validar id_evento
    if ($id_evento <= 0) {
        
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode([
            "ok" => false,
            "msg" => "ID de evento inválido.",
            "error_details" => [
                "message" => "El ID del evento no es válido.",
                "file" => __FILE__,
                "line" => __LINE__
            ]
        ]);
        exit;
    }

    $sql = "
            SELECT
                T.id,
                T.id_evento,
                CAST(T.grupo_articulo AS VARCHAR(50)) AS grupo_articulo,
                CAST(T.nombre_stand AS VARCHAR(255)) AS nombre_stand,
                CAST(T.contacto_ejecutivo AS VARCHAR(100)) AS contacto_ejecutivo,
                CAST(T.responsable AS VARCHAR(255)) AS responsable,
                CAST(T.tipo_stand AS VARCHAR(50)) AS tipo_stand,
                T.valor_participacion,
                T.premio,
                T.valor_total,
                CAST(T.tipo_cobro AS VARCHAR(255)) AS tipo_cobro
            FROM T_LAB_CONFIRMADOS T
            WHERE T.id_evento = $id_evento
            ORDER BY T.nombre_stand, T.responsable
        ";
    

     echo json_encode(generarArray($sql, ''));
    break;

            case "ACTUALIZAR_LAB_CONFIRMADO":
    
        if (empty($_POST['id_lab_confirmado'])) {
            echo json_encode(['ok' => false, 'msg' => 'No se especificó el ID del registro a actualizar.']);
            exit;
        }

    
            $id_lab_confirmado    = intval($_POST['id_lab_confirmado']);
            $grupo_articulo       = addslashes(trim($_POST['SlcLabConfirmado']));
            $nombre_stand         = addslashes(trim($_POST['nombreStand']));
            $contacto_ejecutivo   = addslashes(trim($_POST['contactoEjecutivo']));
            $responsable          = addslashes(trim($_POST['responsable']));
            $tipo_stand           = addslashes(trim($_POST['tipoStand']));
            $tipo_cobro           = addslashes(trim($_POST['tipoCobro']));
            
            
            $valor_participacion  = isset($_POST['valorParticipacion']) ? floatval(preg_replace('/[^\d]/', '', $_POST['valorParticipacion'])) : 0.00;
            $premio               = isset($_POST['premio']) ? floatval(preg_replace('/[^\d]/', '', $_POST['premio'])) : 0.00;
            $valor_total          = isset($_POST['valorTotal']) ? floatval(preg_replace('/[^\d]/', '', $_POST['valorTotal'])) : 0.00;

            
            mssql_query("BEGIN TRANSACTION");

            $sql = "UPDATE T_LAB_CONFIRMADOS SET
                        grupo_articulo = '$grupo_articulo',
                        nombre_stand = '$nombre_stand',
                        contacto_ejecutivo = '$contacto_ejecutivo',
                        responsable = '$responsable',
                        tipo_stand = '$tipo_stand',
                        valor_participacion = $valor_participacion,
                        premio = $premio,
                        valor_total = $valor_total,
                        tipo_cobro = '$tipo_cobro'
                    WHERE
                        id = $id_lab_confirmado";

            $result = mssql_query($sql);

            if ($result) {
                mssql_query("COMMIT TRANSACTION");
                echo json_encode(['ok' => true, 'msg' => 'Registro actualizado exitosamente.']);
            } else {
                mssql_query("ROLLBACK TRANSACTION");
                $error_msg = mssql_get_last_message();
                error_log("Error en SQL (UPDATE): " . $error_msg);
                echo json_encode(['ok' => false, 'msg' => 'Error al actualizar el registro en la base de datos.']);
            }
    break;
case "ELIMINAR_LAB_CONFIRMADO":
   

    if (empty($_POST['ids_a_eliminar'])) {
        echo json_encode(['ok' => false, 'msg' => 'No se especificaron registros para eliminar.']);
        exit;
    }

    
    $ids_cadena = $_POST['ids_a_eliminar'];

    
    $ids_array = explode(',', $ids_cadena);

    $ids_limpios = array_map('intval', $ids_array);

   
    $ids_para_sql = implode(',', $ids_limpios);

   
    if (empty($ids_para_sql)) {
        echo json_encode(['ok' => false, 'msg' => 'Los IDs proporcionados no son válidos.']);
        exit;
    }

   
    $sql_check = "SELECT COUNT(*) as 'conteo' FROM T_LAB_CONFIRMADOS WHERE id IN (" . $ids_para_sql . ")";
    $query_check = mssql_query($sql_check);
    $resultado_check = mssql_fetch_assoc($query_check);

    if ($resultado_check['conteo'] == 0) {
        echo json_encode(['ok' => false, 'msg' => 'Los registros que intentas eliminar ya no existen.']);
        exit;
    }

    
    mssql_query("BEGIN TRANSACTION");

   
    $sql_delete = "DELETE FROM T_LAB_CONFIRMADOS WHERE id IN (" . $ids_para_sql . ")";
    $result_delete = mssql_query($sql_delete);

    if ($result_delete) {
       
        mssql_query("COMMIT TRANSACTION");
        echo json_encode(['ok' => true, 'msg' => 'Los registros han sido eliminados exitosamente.']);
    } else {
        
        mssql_query("ROLLBACK TRANSACTION");
        $error_msg = mssql_get_last_message();
        error_log("Error en SQL (DELETE Múltiple): " . $error_msg);
        echo json_encode(['ok' => false, 'msg' => 'Error al intentar eliminar los registros.']);
    }
    break;
    case "S_PRESUPUESTO_MERCADEO":
		
		//Evento onblur
		
		$idEvento = $_POST['idEvento'];
        $sql = "
		
        
        SELECT 
				E.ID,
				E.ID_TIPO,
                E.ID_EVENTO,
				T.DESCRIPCION AS DESC_TIPO,
				E.ID_CATEGORIA,
				C.DESCRIPCION AS DESC_CAT,
				E.CANTIDAD,
				E.VUNITARIO AS VALOR_UNITARIO,
				E.PRESUPUESTO,
				E.EJECUTADO,
				E.PROVEEDOR,
				E.FACTURA
            FROM T_MERC_PRESUPUESTO_EVENTOS E 
            INNER JOIN T_MERC_TIPO_PRES_EVENTO T ON T.ID = E.ID_TIPO
            INNER JOIN T_MERC_CAT_PRES_EVENTO C ON C.ID = E.ID_CATEGORIA
            WHERE 
				E.ID_EVENTO = $idEvento
			ORDER BY 
			    E.ID_TIPO,
				E.ID_CATEGORIA";
		//echo $sql;
		//exit();
        echo json_encode(generarArray($sql, ''));

    break;
		
// NO RECOMENDADO - Versión simplificada y menos segura
// NO RECOMENDADO - Versión simplificada y menos segura
case "UPDATE_PRESUPUESTO_MERCADEO":
    $datos = json_decode($_POST["datos"], true);
    $result = false; // Inicializar como false

    if (!empty($datos)) {
        foreach ($datos as $fila) {
            // Saneamiento mínimo
            $id = intval($fila['id']);
            $cantidad = intval($fila['cantidad']);
            $vUnitario = floatval($fila['vUnitario']);
            $presupuesto = floatval($fila['presupuesto']);
            $ejecutado = floatval($fila['ejecutado']);
            // ¡PELIGRO! Sin escapar los strings
            $proveedor = trim($fila['proveedor']);
            $factura = trim($fila['factura']);
            $idUsrModifica = $_SESSION['ses_Id'];
            
            // Construcción de SQL 
            $sql = "UPDATE T_MERC_PRESUPUESTO_EVENTOS 
                    SET CANTIDAD = $cantidad, 
                        VUNITARIO = $vUnitario, 
                        PRESUPUESTO = $presupuesto, 
                        EJECUTADO = $ejecutado, 
                        PROVEEDOR = '$proveedor', 
                        FACTURA = '$factura', 
                        ID_USR_MODIFICA = $idUsrModifica, 
                        FECHA_MODIFICACION = GETDATE()
                    WHERE ID = $id";
            
            $result = mssql_query($sql);
        }

        if ($result) {
            echo json_encode(['ok' => true, 'msg' => 'La última operación fue exitosa.']);
        } else {
            echo json_encode(['ok' => false, 'msg' => 'La última operación falló.']);
        }
    } else {
        echo json_encode(['ok' => false, 'msg' => 'No se recibieron datos.']);
    }
    break;


}