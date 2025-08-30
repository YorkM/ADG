<?php
include('funciones.php');
session_start();
conectar();
switch ($_POST['op']) {
    case "I_SOLICITUD":
        $usuario = $_POST['usuario'];
        $id = insertWhidthReturnId($_POST, 'T_WORKFLOW', true);
        if ($id > 0 and $_POST['tipoGasto'] === "2") {
            $update = mssql_query("UPDATE T_WORKFLOW SET ESTADO = 'Q', FECHA_PRELIMINAR = GETDATE(), USUARIO_ADJ_PRELI = '$usuario'  WHERE ID = $id");
        }

        if ($id > 0) echo json_encode(array('ok' => true, 'id' => $id));
        else echo json_encode(array('ok' => false, 'id' => 0));
        break;

    case "I_COMENTARIO":
        $id = insertWhidthReturnId($_POST, 'T_WORKFLOW_COMENTARIOS', true);
        if ($id > 0) echo json_encode(array('ok' => true, 'id' => $id));
        else echo json_encode(array('ok' => false, 'id' => 0));
        break;

    case "I_LOG":
        $idSolicitud = $_POST['idSolicitud'];
        $estado = $_POST['estado'];
        $usuario = $_POST['usuario'];
        $idComentario = $_POST['idComentario'];
        $query = mssql_query("INSERT INTO T_WORKFLOW_LOGS (ID_SOLICITUD, ESTADO, USUARIO, ID_COMENTARIO) VALUES ($idSolicitud, '$estado', '$usuario', $idComentario)");
        if ($query) echo json_encode(array('ok' => true, 'msg' => "Se inserto correctamente el log"));
        else echo json_encode(array('ok' => false, 'msg' => "Error al insertar log"));
        break;

    case "G_USUARIO":
        $sql = GenerarArray("SELECT [LOGIN] as USUARIO, CONCAT(NOMBRES, ' ', APELLIDOS) AS NOMBRE_USUARIO FROM T_USUARIOS tu WHERE ID = {$_POST["idUsuario"]}", '');
        echo json_encode($sql);
        break;

    case "G_INFOTABLAG":
        $sql = GenerarArray("SELECT * FROM T_GASTOS_AUTORIZADOS", '');
        echo json_encode($sql);
        break;

    case "G_SOLICITUDES":
        $fecha_desde = $_POST['fechaDesde'];
        $fecha_hasta = $_POST['fechaHasta'];
        $departamento = $_POST['departamento'];
        $oficina = $_POST['oficina'];
        $sql = "SELECT 
                    WF.ID,
                WF.ORGANIZACION_VENTAS,
                CASE
                    WHEN WF.ORGANIZACION_VENTAS = '2000' THEN 'ROMA'
                    ELSE 'MULTIDROGAS'
                END AS ORGANIZACION_VENTAS_T,
                WF.OFICINA_VENTAS,
                OV.DESCRIPCION AS OFICINA_VENTAS_T,
                WF.CONCEPTO_GASTO,
                WF.TIPO_GASTO,
                WF.USUARIO_SOLICITA,
                WF.FECHA_SOLICITA,
                WF.COMENTARIO_SOLICITA,
                ISNULL(WF.ADJUNTO_SOLICITA_1, '') AS ADJUNTO_SOLICITA_1,
                ISNULL(WF.ADJUNTO_SOLICITA_2, '') AS ADJUNTO_SOLICITA_2,
                ISNULL(WF.ADJUNTO_SOLICITA_3, '') AS ADJUNTO_SOLICITA_3,
                ISNULL(WF.NOTA, '0') AS INDICADORNOTA,
                U.EMAIL,
                D.DESCRIPCION AS DPTO,
                WF.ESTADO,
                CG.CONCEPTO,
                CONCAT(U.NOMBRES, ' ', U.APELLIDOS) AS NOMBRE_USUARIO
                FROM T_WORKFLOW WF
                INNER JOIN T_USUARIOS U ON WF.USUARIO_SOLICITA = U.[LOGIN]
                INNER JOIN T_DPTO D ON U.ID_DPTO = D.ID
                INNER JOIN T_OFICINAS_VENTAS OV ON WF.OFICINA_VENTAS = OV.OFICINA_VENTAS
                INNER JOIN T_CONCEPTOS_GASTOS CG ON WF.CONCEPTO_GASTO = CG.ID
                WHERE CAST(WF.FECHA_SOLICITA AS DATE) between CAST('$fecha_desde' AS DATE) and CAST('$fecha_hasta' AS DATE)";

        if ($departamento != '' ) {
            $sql .= " AND D.DESCRIPCION = '$departamento'";
        }

        if ($oficina != '1000' &&  $oficina != '2000') {
            $sql .= " AND WF.OFICINA_VENTAS = '$oficina'";
        }

        $sql .= "ORDER BY WF.FECHA_SOLICITA ";

        $solicitudes = GenerarArray($sql, '');
        echo json_encode(['data '=> $solicitudes, 'sql' => $sql]);
        break;

    case "I_CONCEPTO":
        $id = insertWhidthReturnId($_POST, 'T_CONCEPTOS_GASTOS', true);
        echo json_encode($id);
        break;

    case "G_CONCEPTOS":
        $sql = GenerarArray("SELECT * FROM T_CONCEPTOS_GASTOS", '');
        echo json_encode($sql);
        break;

    case "G_COMENTARIOS":
        $idSolicitud = $_POST['idSolicitud'];
        $sql = GenerarArray("SELECT * FROM T_WORKFLOW_COMENTARIOS WHERE ID_SOLICITUD = $idSolicitud ORDER BY FECHA ASC", '');
        echo json_encode($sql);
        break;

    case "G_DTPOS":
        $sql = GenerarArray("SELECT * FROM T_DPTO", '');
        echo json_encode($sql);
        break;

    case "G_LOGS":
        $idSolicitud = $_POST['idSolicitud'];
        $sql = GenerarArray("SELECT L.USUARIO, L.ESTADO, L.FECHA_HORA, C.COMENTARIO,
        CONCAT(U.NOMBRES, ' ', U.APELLIDOS) AS NOMBRE_USUARIO
        FROM T_WORKFLOW_LOGS L
        INNER JOIN T_USUARIOS U ON L.USUARIO = U.[LOGIN]
        LEFT JOIN T_WORKFLOW_COMENTARIOS C ON L.ID_COMENTARIO = C.ID
        WHERE L.ID_SOLICITUD = '$idSolicitud' 
        ORDER BY FECHA_HORA ASC", '');
        echo json_encode($sql);
        break;

    case "G_OFICINA":
        $sql = GenerarArray("SELECT ORGANIZACION_VENTAS, OFICINA_VENTAS, DESCRIPCION FROM T_OFICINAS_VENTAS tov WHERE OFICINA_VENTAS = {$_SESSION["ses_OfcVentas"]}", "");
        echo json_encode($sql);
        break;

    case "G_CONTEOESTADOS":
        $datos = GenerarArray("SELECT ESTADO, COUNT(ESTADO) AS CONTEOESTADOS FROM T_WORKFLOW GROUP BY ESTADO", "");
        echo json_encode($datos);
        break;

    case "U_ADJUNTOS":
        $id_sol = $_POST["id_sol"];
        $nombre = $_POST["nombre"];
        $adj = $_POST["adj"];
        $accion = $_POST["accion"];

        if ($accion == "1") $update = mssql_query("UPDATE T_WORKFLOW SET ADJUNTO_SOLICITA_$adj = '$nombre', ADJUNTO_FINALIZA = ADJUNTO_SOLICITA_1  WHERE ID = $id_sol");
        else if ($accion == "2") $update = mssql_query("UPDATE T_WORKFLOW SET ADJUNTO_PAGO = '$nombre' WHERE ID = $id_sol");
        else if ($accion == "3") $update = mssql_query("UPDATE T_WORKFLOW SET ADJUNTO_FINALIZA = '$nombre' WHERE ID = $id_sol");
        else if ($accion == "4") $update = mssql_query("UPDATE T_WORKFLOW SET ADJUNTO_FACTURA = '$nombre' WHERE ID = $id_sol");
        else if ($accion == "5") $update = mssql_query("UPDATE T_WORKFLOW SET ADJUNTO_LEGALIZACION = '$nombre' WHERE ID = $id_sol");
        else $update = mssql_query("UPDATE T_WORKFLOW SET ADJUNTO_SOLICITA_$adj = '$nombre' WHERE ID = $id_sol");

        mssql_query("UPDATE T_WORKFLOW SET ADJUNTO_FINALIZA = ADJUNTO_SOLICITA_1, FECHA_FINALIZA = GETDATE() WHERE ID = '$id_sol'");
        echo json_encode(array('ok' => true));
        break;

    case "G_INFOMODAL":
        $sql = GenerarArray("SELECT * FROM T_WORKFLOW tw WHERE ID =  {$_POST["idSolicitud"]}", "");
        echo json_encode($sql);
        break;

    case "G_ULTIMOCOMENTARIO":
        $sql = GenerarArray("SELECT TOP 1 * FROM T_WORKFLOW_COMENTARIOS WHERE ID_SOLICITUD = {$_POST["idSolicitud"]} ORDER BY ID DESC", "");
        echo json_encode($sql);
        break;

    case "U_ESTADOS":
        $estado = $_POST["estado"];
        $usuariop = $_POST["usuario"];
        $comentariop = isset($_POST["comentario"]) ? utf8_decode($_POST["comentario"]) : "";
        $numeroPreliminar = isset($_POST["numeroPreliminar"]) ? $_POST["numeroPreliminar"] : "";
        $idSolicitud = $_POST["idSolicitud"];        
        $fecha = "";
        $comentario = "";
        $usuario = "";
        $campoVariado = "";
        $valorVariado = "";
        if ($estado == "K" || $estado == "O") {
            $fecha = "FECHA_AUTORIZA";
            $comentario = "COMENTARIO_AUTORIZA";
            $usuario = "USUARIO_AUTORIZA";
            $campoVariado = "ARCHIVO_SELECCIONADO";
            $valorVariado = isset($_POST["campoRadio"]) ? $_POST["campoRadio"] : "";
        }
        if ($estado == "Q") {
            $fechafactura = isset($_POST['fechaFactura']) ? $_POST['fechaFactura'] : "";
            $numeroDocumento = isset($_POST['numeroDocumento']) ? $_POST['numeroDocumento'] : "";
            $razonSocial = isset($_POST['razonSocial']) ? $_POST['razonSocial'] : "";
            $valorFactura = isset($_POST['valorFactura']) ? $_POST['valorFactura'] : "";
            $subTotalFactura = isset($_POST['subTotalFactura']) ? $_POST['subTotalFactura'] : "";
            $iva = isset($_POST['iva']) ? $_POST['iva'] : "";
            $valorLegal = isset($_POST['valorLegal']) ? $_POST['valorLegal'] : "";
            $fecha = "FECHA_PRELIMINAR";
            $usuario = "USUARIO_ADJ_PRELI";
            $result = mssql_query("UPDATE T_WORKFLOW SET ESTADO = '$estado', " . $usuario . " = '$usuariop', " . $fecha . " = GETDATE(), NUMERO_PRELIMINAR = '$numeroPreliminar', FECHA_DOCUMENTO = '$fechafactura', NUMERO_DOCUMENTO = '$numeroDocumento', NIT = '$razonSocial', VALOR_DOCUMENTO = '$valorFactura', IVA_DOCUMENTO = '$iva', SUBTOTAL_DOCUMENTO = '$subTotalFactura', VALOR_LEGALIZACION = '$valorLegal'  WHERE ID = $idSolicitud");
            if ($result) echo json_encode(array("ok" => true));
            else echo json_encode(array("ok" => false));
            die();
        }
        if ($estado == "U") {
            $fecha = "FECHA_FINALIZA";
            $usuario = "USUARIO_FINALIZA";
            $result = mssql_query("UPDATE T_WORKFLOW SET ESTADO = '$estado', " . $usuario . " = '$usuariop', " . $fecha . " = GETDATE() WHERE ID = $idSolicitud");
            if ($result) echo json_encode(array("ok" => true));
            else echo json_encode(array("ok" => false));
            die();
        }
        if ($estado == "T" && isset($_POST['valorAutorizado'])) {
            $valorAutorizado = $_POST['valorAutorizado'];
            $result = mssql_query("UPDATE T_WORKFLOW SET ESTADO = '$estado', VALOR_AUTORIZADO = '$valorAutorizado' WHERE ID = $idSolicitud");
            if ($result) echo json_encode(array("ok" => true));
            else echo json_encode(array("ok" => false));
            die();
        }
        if ($estado == "T") {
            $fecha = "FECHA_AUTORIZA_PRELI";
            $usuario = "USUARIO_AUTORIZA_PRELI";
            $result = mssql_query("UPDATE T_WORKFLOW SET ESTADO = '$estado', " . $usuario . " = '$usuariop', " . $fecha . " = GETDATE() WHERE ID = $idSolicitud");
            if ($result) echo json_encode(array("ok" => true));
            else echo json_encode(array("ok" => false));
            die();
        }
        if ($estado == "R") {
            $comentario_sw = $_POST['comentarioSW'];
            $fecha = "FECHA_RECHAZA";
            $comentario = "COMENTARIO_RECHAZA";
            $usuario = "USUARIO_RECHAZA";
            mssql_query("UPDATE T_WORKFLOW SET ESTADO = '$estado', " . $usuario . " = '$usuariop', " . $fecha . " = GETDATE(), " . $comentario . " = '$comentario_sw' WHERE ID = $idSolicitud");
            echo json_encode(array("ok" => true));
            die();
        }
        if ($estado == "C") {
            $fecha = "FECHA_CAUSA";
            $comentario = "COMENTARIO_CAUSA";
            $usuario = "USUARIO_CAUSA";
            $campoVariado = "DOCUMENTO_CAUSA";
            $valorVariado = $_POST["numeroCausacion"];
        }
        if ($estado == "W") {
            $fecha = "FECHA_COMPENSACION";
            $comentario = "COMENTARIO_COMPENSA";
            $usuario = "USUARIO_COMPENSA";
            $campoVariado = "NUMERO_COMPENSACION";
            $valorVariado = $_POST["numeroCompensacion"];
        }
        if ($estado == "P") {
            $fecha = "FECHA_PAGA";
            $comentario = "COMENTARIO_PAGA";
            $usuario = "USUARIO_PAGA";
            mssql_query("UPDATE T_WORKFLOW SET ESTADO = '$estado', " . $usuario . " = '$usuariop', " . $fecha . " = GETDATE(), " . $comentario . " = '$comentariop' WHERE ID = $idSolicitud");
            echo json_encode(array("ok" => true));
            die();
        }
        if ($estado == "F") {
            $fecha = "FECHA_FINALIZA";
            $comentario = "COMENTARIO_FINALIZA";
            $usuario = "USUARIO_FINALIZA";
            mssql_query("UPDATE T_WORKFLOW SET ESTADO = '$estado', " . $usuario . " = '$usuariop', " . $fecha . " = GETDATE(), " . $comentario . " = '$comentariop' WHERE ID = $idSolicitud");
            echo json_encode(array("ok" => true));
            die();
        }       

        $result = mssql_query("UPDATE T_WORKFLOW SET ESTADO = '$estado', " . $usuario . " = '$usuariop', " . $fecha . " = GETDATE(), " . $comentario . " = '$comentariop', " . $campoVariado . " = '$valorVariado' WHERE ID = $idSolicitud");
        if ($result) echo json_encode(array("ok" => true));
        else echo json_encode(array("ok" => false));
        break;

    case "A_NOTIFICACION":
        $idSolicitud = $_POST["idSolicitud"];
        $update = mssql_query("UPDATE T_WORKFLOW SET NOTA = '1' WHERE ID = $idSolicitud");
        if ($update) echo json_encode(array("ok" => true, "msg" => "Se activó notificacion"));
        else echo json_encode(array("ok" => false, "msg" => "Error al activar notificacion"));
        break;

    case "U_NOTA":
        $idSolicitud = $_POST["idSolicitud"];
        $update = mssql_query("UPDATE T_WORKFLOW SET NOTA = '0' WHERE ID = $idSolicitud");
        if ($update) echo json_encode(array("ok" => true));
        else echo json_encode(array("ok" => false));
        break;

    case "U_SOLICITUD":
        $idSolicitud = $_POST["idSolicitud"];
        $estado = $_POST["estado"];
        $update = mssql_query("UPDATE T_WORKFLOW SET ESTADO = '$estado' WHERE ID = $idSolicitud");
        if ($update) echo json_encode(array("ok" => true, "msg" => "Solicitud restaurada"));
        else echo json_encode(array("ok" => false, "msg" => "Solicitud no se restauro"));
        break;

    case "E_EMAIL":
        require_once('../resources/PhPMailer/Email.php');
        $msg = '';
        $asunto;
        $destino = $_POST["destino"];
        $estado = $_POST["estado"];
        $idSolicitud = $_POST["idSolicitud"];
        $titulo = "Notificación WorkFlow";
        if ($estado === "S" || $estado === "Q") {
            $msg = '
            <!DOCTYPE html>
            <html lang="es">        
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>        
            <body style="font-family: Verdana;">
                <h2>Notificación WorkFlow</h2>
                <h4>Estimado(a) colaborador(a)</h4>
                <p style="font-size: 14px;">
                    Reciba un cordial saludo.<br><br>
                    A través de este mensaje, le notificamos que se ha agregado una nueva solictud.<br>
                    Modulo: <b>WorkFlow</b><br>
                    Número de solicitud: <b>' . $idSolicitud . '</b><br>
                </p>    
            </body>        
            </html>';
            $asunto = "Solicitud rechazada";
        }
        if ($estado === "R") {
            $msg = '
            <!DOCTYPE html>
            <html lang="es">        
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>        
            <body style="font-family: Verdana;">
                <h2>Notificación WorkFlow</h2>
                <h4>Estimado(a) colaborador(a)</h4>
                <p style="font-size: 14px;">
                    Reciba un cordial saludo.<br><br>
                    A través de este mensaje, le notificamos que se ha rechazado su solictud,<br>
                    diríjase al módulo <b>WorkFlow</b> haga las correcciones pertinentes<br>
                    y restaure la solicitud nuevamente.<br><br>
                </p>
                <p style="font-size: 14px;">
                    Número de solicitud: <b>'. $idSolicitud .'</b> haga las correcciones pertinentes<br>
                </p>
                <footer>
                    <small><i>Le deseamos un excelente día.</i></small>
                </footer>
            </body>        
            </html>';
            $asunto = "Solicitud rechazada";
        }
        if ($estado === "P") {
            $msg = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Verdana;">
                <h2>Notificación WorkFlow</h2>
                <h4>Estimado(a) colaborador(a)</h4>
                <p style="font-size: 14px;">
                    Reciba un cordial saludo.<br><br>
                    A través de este mensaje, le notificamos que se ha realizado el pago de la solictud,<br>
                    diríjase al módulo <b>WorkFlow</b> y adjunte la factura(preliminar)<br>
                    para legalización.<br><br>
                </p>
                <p style="font-size: 14px;">                   
                    Número de solicitud: <b>'. $idSolicitud .'</b><br>
                </p>
                <footer>
                    <small><i>Le deseamos un excelente día.</i></small>
                </footer>
            </body>
            </html>';
            $asunto = "Pago de solicitud";
        }
        if ($estado === "L" || $estado === "M" || $estado === "N") {
            $procesada;
            if ($estado === "L") $procesada = "COMPENSADA";
            if ($estado === "M") $procesada = "PAGADA";
            if ($estado === "N") $procesada = "CAUSADA";
            $msg = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Verdana;">
                <h2>Notificación WorkFlow</h2>
                <h4>Estimado(a) colaborador(a)</h4>
                <p style="font-size: 14px;">
                    Reciba un cordial saludo.<br><br>
                    A través de este mensaje, le notificamos que la solictud no ha sido '. $procesada .'<br>
                    diríjase al módulo <b>WorkFlow</b> y realice las correcciones pertinentes y notifique al<br>
                    departamento encargado.<br><br>
                </p>
                <p style="font-size: 14px;">                   
                    Número de solicitud: <b>'. $idSolicitud .'</b><br>
                </p>
                <footer>
                    <small><i>Le deseamos un excelente día.</i></small>
                </footer>
            </body>
            </html>';
            $asunto = "Pago de solicitud";
        }
        if ($estado === "Z") {
            $msg = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Verdana;">
                <h2>Notificación WorkFlow</h2>
                <h4>Estimado(a) colaborador(a)</h4>
                <p style="font-size: 14px;">
                    Reciba un cordial saludo.<br><br>
                    A través de este mensaje, le notificamos que la solictud que había sido<br>
                    rechazada, se le hicieron las correcciones pertinentes y ha sido restaurada<br>
                </p>
                <p style="font-size: 14px;">                   
                    Número de solicitud: <b>'. $idSolicitud .'</b><br>
                </p>
                <footer>
                    <small><i>Le deseamos un excelente día.</i></small>
                </footer>
            </body>
            </html>';
            $asunto = "Pago de solicitud";
        }
        EnviarMail($titulo, $msg, $asunto, $destino);
        break;

    case "G_USEREMAIL": 
        $usuarioSolicitud = $_POST["usuarioSolicitud"];
        $sql = GenerarArray("SELECT  EMAIL FROM T_USUARIOS tu WHERE [LOGIN] = '$usuarioSolicitud'", "");
        echo json_encode($sql);
        break;
}