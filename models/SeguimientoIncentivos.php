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
}