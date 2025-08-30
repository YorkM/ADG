<?php
include 'funciones.php';
session_start();

$conn = conectarHanaSap2();

switch ($_POST['op']) {
   case 'G_AUTORIZACIONES_PENDIENTES':
      $query = "SELECT * FROM ZFIT_AUTH_PRES WHERE ESTADO = 'P'";
      $resultado = generarArrayHana2($query, "");

      if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
      else echo json_encode(['ok' => false, 'data' => []]);
      break;

   case 'G_AUTORIZACIONES':
      $query = "SELECT * FROM ZFIT_AUTH_PRES WHERE ESTADO = 'A'";
      $resultado = generarArrayHana2($query, "");

      if ($resultado) echo json_encode(['ok' => true, 'data' => $resultado]);
      else echo json_encode(['ok' => false, 'data' => []]);
      break;

   case 'U_AUTORIZACION':
      $idAutorizar = $_POST['idAutorizar'];

      $query = "UPDATE ZFIT_AUTH_PRES SET ESTADO = 'A' WHERE LOG_ID = '$idAutorizar'";
      $update = odbc_exec($conn, $query);

      if ($update) echo json_encode(['ok' => true, 'msg' => "Item aurizado correctamente"]);
      else echo json_encode(['ok' => false, 'msg' => "Error al autorizar el item"]);
      break;
}