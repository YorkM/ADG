<?php
include('funciones.php');
session_start();
conectarBI();
switch ($_POST['op']) {
    case "I_DATOS_CONVENIO":
        $datos = json_decode($_POST["datos"], true);

        if (!empty($datos)) {
            $valores = [];

            foreach ($datos as $fila) {
                $fecha = $fila["FECHA"];
                $id_convenio = intval($fila["ID_CONVENIO"]);
                $ean = utf8_decode(addslashes($fila["EAN"]));
                $material = utf8_decode(addslashes($fila["MATERIAL"]));
                $descripcion = utf8_decode(addslashes($fila["DESCRIPCION"]));
                $nit_proveedor = utf8_decode(addslashes($fila["NIT_PROVEEDOR"]));
                $nombre_proveedor = utf8_decode(addslashes($fila["NOMBRE_PROVEEDOR"]));
                $grupo_articulo = utf8_decode(addslashes($fila["GRUPO_ARTICULO"]));
                $categoria = utf8_decode(addslashes($fila["CATEGORIA"]));
                $subcategoria = utf8_decode(addslashes($fila["SUBCATEGORIA"]));
                $grupo_terapeutico = utf8_decode(addslashes($fila["GRUPO_TERAPEUTICO"]));
                $principio_activo = utf8_decode(addslashes($fila["PRINCIPIO_ACTIVO"]));
                $grupo_compras = utf8_decode(addslashes($fila["GRUPO_COMPRAS"]));
                $fecha_inicial = $fila["FECHA_INICIAL"];
                $fecha_final = $fila["FECHA_FINAL"];
                $periodo_liquidacion = utf8_decode(addslashes($fila["PERIODO_LIQUIDACION"]));
                $tipo_rotacion = utf8_decode(addslashes($fila["TIPO_ROTACION"]));
                $contemplaciones = utf8_decode(addslashes($fila["CONTEMPLACIONES"]));
                $clasificacion = utf8_decode(addslashes($fila["CLASIFICACION"]));
                $pcj_rebate_bacorde = floatval($fila["PCJ_REBATE_BACORDE"]);
                $pcj_rebate_com_trim = floatval($fila["PCJ_REBATE_COM_TRIM"]);
                $pcj_rebate_manejo_linea = floatval($fila["PCJ_REBATE_MANEJO_LINEA"]);
                $pcj_rebate_rotacion = floatval($fila["PCJ_REBATE_ROTCION"]);
                $pcj_rebate_info = floatval($fila["PCJ_REBATE_INFO"]);
                $pcj_rebate_no_dev = floatval($fila["PCJ_REBATE_NO_DEV"]);
                $pcj_rebate_din_com = floatval($fila["PCJ_REBATE_DIN_COM"]);
                $pcj_rebate_dias_inv = floatval($fila["PCJ_REBATE_DIAS_INV"]);
                $pcj_rebate_impactos = floatval($fila["PCJ_REBATE_IMPACTOS"]);
                $pcj_rabate_averias = floatval($fila["PCJ_REBATE_AVERIAS"]);
                $pcj_rebate_logistica = floatval($fila["PCJ_REBATE_LOGISTICA"]);
                $objetivo_impactos_q1 = $fila["OBJETIVO_IMPACTOS_Q1"];
                $objetivo_compras = $fila["OBJETIVO_COMPRAS"];
                $obj_manejo_linea = utf8_decode(addslashes($fila["OBJ_MANEJO_LINEA"]));
                $obj_impactos_q4 = $fila["OBJ_IMPACTOS_Q4"];
                $obj_compras_q1 = $fila["OBJ_COMPRAS_Q1"];
                $obj_compras_q2 = $fila["OBJ_COMPRAS_Q2"];
                $obj_compras_q4 = $fila["OBJ_COMPRAS_Q4"];
                $obj_rotacion_q1 = $fila["OBJ_ROTACION_Q1"];
                $obj_rotacion_q2 = $fila["OBJ_ROTACION_Q2"];
                $obj_rotacion_q3 = $fila["OBJ_ROTACION_Q3"];
                $obj_rotacion_q4 = $fila["OBJ_ROTACION_Q4"];
                $usuario = $fila["USUARIO"];

                $valores[] = "('$fecha', $id_convenio, '$ean', '$material', '$descripcion', '$nit_proveedor', '$nombre_proveedor', '$grupo_articulo', '$categoria', '$subcategoria', '$grupo_terapeutico', '$principio_activo', '$grupo_compras', '$fecha_inicial', '$fecha_final', '$periodo_liquidacion', '$tipo_rotacion', '$contemplaciones', '$clasificacion', '$pcj_rebate_bacorde', '$pcj_rebate_com_trim', '$pcj_rebate_manejo_linea', '$pcj_rebate_rotacion', '$pcj_rebate_info', '$pcj_rebate_no_dev', '$pcj_rebate_din_com', '$pcj_rebate_dias_inv', '$pcj_rebate_impactos', '$pcj_rabate_averias', '$pcj_rebate_logistica', '$objetivo_impactos_q1', '$objetivo_compras', '$obj_manejo_linea', '$obj_impactos_q4', '$obj_compras_q1', '$obj_compras_q2', '$obj_compras_q4', '$obj_rotacion_q1', '$obj_rotacion_q2', '$obj_rotacion_q3', '$obj_rotacion_q4', '$usuario')";
            }

            if (!empty($valores)) {
                $sql = "INSERT INTO T_BI_CONVENIOS (FECHA, ID_CONVENIO, EAN, MATERIAL, DESCRIPCION, NIT_PROVEEDOR, NOMBRE_PROVEEDOR, GRUPO_ARTICULO, CATEGORIA, SUBCATEGORIA, GRUPO_TERAPEUTICO, PRINCIPIO_ACTIVO, GRUPO_COMPRAS, FECHA_INICIAL, FECHA_FINAL, PERIODO_LIQUIDACION, TIPO_ROTACION, CONTEMPLACIONES, CLASIFICACION, PCJ_REBATE_BACORDE, PCJ_REBATE_COM_TRIM, PCJ_REBATE_MANEJO_LINEA, PCJ_REBATE_ROTCION, PCJ_REBATE_INFO, PCJ_REBATE_NO_DEV, PCJ_REBATE_DIN_COM, PCJ_REBATE_DIAS_INV, PCJ_REBATE_IMPACTOS, PCJ_REBATE_AVERIAS, PCJ_REBATE_LOGISTICA, OBJETIVO_IMPACTOS_Q1, OBJETIVO_COMPRAS, OBJ_MANEJO_LINEA, OBJ_IMPACTOS_Q4, OBJ_COMPRAS_Q1, OBJ_COMPRAS_Q2, OBJ_COMPRAS_Q4, OBJ_ROTACION_Q1, OBJ_ROTACION_Q2, OBJ_ROTACION_Q3, OBJ_ROTACION_Q4, USUARIO) VALUES " . implode(",", $valores);

                $result = mssql_query($sql);
                if ($result) echo json_encode(array('ok' => true, 'msg' => "Se insertaron los datos correctamente"));
                else echo json_encode(array('ok' => false, 'msg' => "Error al insertar los datos"));
            } else echo json_encode("No hay datos");
        }
        break;
        
    case "I_DATOS_INVENTARIO":
        $datos = json_decode($_POST["datos"], true);

        if (!empty($datos)) {
            $valores = [];

            foreach ($datos as $fila) {
                $ofi_ventas = utf8_decode(addslashes($fila["OFICINA_VENTAS"]));
                $fecha = $fila["FECHA"];
                $dia = intval($fila["DIA"]);
                $mes = intval($fila["MES"]);
                $anio = intval($fila["ANIO"]);
                $ean = utf8_decode(addslashes($fila["EAN"]));
                $material = utf8_decode(addslashes($fila["MATERIAL"]));
                $descripcion = utf8_decode(addslashes($fila["DESCRIPCION"]));
                $libre_utilizacion = intval($fila["LIBRE_UTILIZACION"]);
                $vlr_libre_utilizacion = floatval($fila["VLR_LIBRE_UTILIZACION"]);
                $centro = utf8_decode(addslashes($fila["CENTRO"]));
                $nit_proveedor = utf8_decode(addslashes($fila["NIT_PROVEEDOR"]));
                $nombre_proveedor = utf8_decode(addslashes($fila["NOMBRE_PROVEEDOR"]));
                $grupo_articulo = utf8_decode(addslashes($fila["GRUPO_ARTICULO"]));
                $rapels = utf8_decode(addslashes($fila["RAPELS"]));
                $categoria = utf8_decode(addslashes($fila["CATEGORIA"]));
                $subcategoria = utf8_decode(addslashes($fila["SUBCATEGORIA"]));
                $grupo_terapeutico = utf8_decode(addslashes($fila["GRUPO_TERAPEUTICO"]));
                $principio_activo = utf8_decode(addslashes($fila["PRINCIPIO_ACTIVO"]));
                $ubicacion = utf8_decode(addslashes($fila["UBICACION"]));
                $lote = utf8_decode(addslashes($fila["LOTE"]));
                $fecha_vencimiento = $fila["FECHA_VENCIMIENTO"];
                $ultima_fecha_ingreso = $fila["ULTIMA_FECHA_INGRESO"];
                $fecha_actual = $fila["FECHA_ACTUAL"];
                $tiempo_obsolesencia = intval($fila["TIEMPO_OBSOLESENCIA"]);
                $exclusiones = utf8_decode(addslashes($fila["EXCLUSIONES"]));
                $categoria_rapels = utf8_decode(addslashes($fila["CATEGORIA_RAPELS"]));
                $promedio_vtas_und = intval($fila["PROMEDIO_VTAS_UND"]);
                $promedio_vtas_cotos = intval($fila["PROMEDIO_VTAS_COTOS"]);
                $pcj_part_rot = floatval($fila["PCJ_PART_ROT"]);
                $pcj_acum_rot = floatval($fila["PCJ_ACUM_ROT"]);
                $dias_invent = intval($fila["DIAS_INVENT"]);
                $invent_optimo_und = intval($fila["INVENT_OPTIMO_UND"]);
                $invent_optimo_vlrs = intval($fila["INVENT_OPTIMO_VLRS"]);
                $exceso_und = intval($fila["EXCESO_UND"]);
                $exceso_vlrs = intval($fila["EXCESO_VLRS"]);
                $rango = utf8_decode(addslashes($fila["RANGO"]));
                $clasificacion_rotacion = utf8_decode(addslashes($fila["CLASIFICACION_ROTACION"]));
                $grupo_compras = utf8_decode(addslashes($fila["GRUPO_COMPRAS"]));
                $nula_rotacion = utf8_decode(addslashes($fila["NULA_ROTACION"]));
                $dias_convenios = intval($fila["DIAS_CONVENIOS"]);
                $clasificacion_rebate = utf8_decode(addslashes($fila["CLASIFICACION_REBATE"]));
                $politica_dev = utf8_decode(addslashes($fila["POLITICA_DEV"]));
                $tipo_oferta = utf8_decode(addslashes($fila["TIPO_OFERTA"]));
                $usuario = $fila["USUARIO"];

                $valores[] = "('$ofi_ventas', '$fecha', $dia, $mes, $anio, '$ean', '$material', '$descripcion', $libre_utilizacion, $vlr_libre_utilizacion, '$centro', '$nit_proveedor', '$nombre_proveedor', '$grupo_articulo', '$rapels', '$categoria', '$subcategoria', '$grupo_terapeutico', '$principio_activo', '$ubicacion', '$lote', '$fecha_vencimiento', '$ultima_fecha_ingreso', '$fecha_actual', $tiempo_obsolesencia, '$exclusiones', '$categoria_rapels', $promedio_vtas_und, $promedio_vtas_cotos, $pcj_part_rot, $pcj_acum_rot, $dias_invent, $invent_optimo_und, $invent_optimo_vlrs, $exceso_und, $exceso_vlrs, '$rango', '$clasificacion_rotacion', '$grupo_compras', '$nula_rotacion', '$dias_convenios', '$clasificacion_rebate', '$politica_dev', '$tipo_oferta', '$usuario')";
            }

            if (!empty($valores)) {
                $sql = "INSERT INTO T_BI_INVENTARIOS (OFICINA_VENTAS, FECHA, DIA, MES, ANIO, EAN, MATERIAL, DESCRIPCION, LIBRE_UTILIZACION, VLR_LIBRE_UTILIZACION, CENTRO, NIT_PROVEEDOR, NOMBRE_PROVEEDOR, GRUPO_ARTICULO, RAPELS, CATEGORIA, SUBCATEGORIA, GRUPO_TERAPEUTICO, PRINCIPIO_ACTIVO, UBICACION, LOTE, FECHA_VENCIMIENTO, ULTIMA_FECHA_INGRESO, FECHA_ACTUAL, TIEMPO_OBSOLESENCIA, EXCLUSIONES, CATEGORIA_RAPELS, PROMEDIO_VTAS_UND, PROMEDIO_VTAS_COTOS, PCJ_PART_ROT, PCJ_ACUM_ROT, DIAS_INVENT, INVENT_OPTIMO_UND, INVENT_OPTIMO_VLRS, EXCESO_UND, EXCESO_VLRS, RANGO, CLASIFICACION_ROTACION, GRUPO_COMPRAS, NULA_ROTACION, DIAS_CONVENIOS, CLASIFICACION_REBATE, POLITICA_DEV, TIPO_OFERTA, USUARIO) VALUES " . implode(",", $valores);

                $result = mssql_query($sql);
                if ($result) echo json_encode(array('ok' => true, 'msg' => "Se insertaron los datos correctamente"));
                else echo json_encode(array('ok' => false, 'msg' => "Error al insertar los datos"));
            } else echo json_encode("No hay datos");
        }
        break;

    case "I_DATOS_COMPRAS":
        $datos = json_decode($_POST["datos"], true);

        if (!empty($datos)) {
            $valores = [];

            foreach ($datos as $fila) {
                $fecha_oc = $fila["FECHA_OC"];
                $dia = intval($fila["DIA"]);
                $mes = intval($fila["MES"]);
                $anio = intval($fila["ANIO"]);
                $dia_semana = intval($fila["DIA_SEMANA"]);
                $ean = utf8_decode(addslashes($fila["EAN"]));
                $material = utf8_decode(addslashes($fila["MATERIAL"]));
                $descripcion = utf8_decode(addslashes($fila["DESCRIPCION"]));
                $tipo_producto = utf8_decode(addslashes($fila["TIPO_PRODUCTO"]));
                $nit_proveedor = utf8_decode(addslashes($fila["NIT_PROVEEDOR"]));
                $nombre_proveedor = utf8_decode(addslashes($fila["NOMBRE_PROVEEDOR"]));
                $grupo_articulo = utf8_decode(addslashes($fila["GRUPO_ARTICULO"]));
                $categoria = utf8_decode(addslashes($fila["CATEGORIA"]));
                $grupo_terapeutico = utf8_decode(addslashes($fila["GRUPO_TERAPEUTICO"]));
                $subcategoria = utf8_decode(addslashes($fila["SUBCATEGORIA"]));
                $principio_activo = utf8_decode(addslashes($fila["PRINCIPIO_ACTIVO"]));
                $descuento_comercial = intval($fila["DESCUENTO_COMERCIAL"]);
                $subtotal = $fila["SUBTOTAL"];
                $iva = intval($fila["IVA"]);
                $rt_fuente = intval($fila["RT_FUENTE"]);
                $ica = intval($fila["ICA"]);
                $r_iva = intval($fila["R_IVA"]);
                $total_pagar = intval($fila["TOTAL_PAGAR"]);
                $costos_und = intval($fila["COSTOS_UND"]);
                $organizacion = utf8_decode(addslashes($fila["ORGANIZACION"]));
                $centro = intval($fila["CENTRO"]);
                $grupo_compras = utf8_decode(addslashes($fila["GRUPO_COMPRAS"]));
                $familia_producto = utf8_decode(addslashes($fila["FAMILIA_PRODUCTO"]));
                $unidades_barcoder = intval($fila["UNIDADES_BARCORDER"]);
                $vlr_barcoder = intval($fila["VLR_BARCORDER"]);
                $usuario = $fila["USUARIO"];
                
                $valores[] = "('$fecha_oc', $dia, $mes, $anio, $dia_semana, '$ean', '$material', '$descripcion', '$tipo_producto', '$nit_proveedor', '$nombre_proveedor', '$grupo_articulo', '$categoria', '$grupo_terapeutico', '$subcategoria', '$principio_activo', $descuento_comercial, '$subtotal', $iva, $rt_fuente, $ica, $r_iva, $total_pagar, $costos_und, '$organizacion', $centro, '$grupo_compras', '$familia_producto', $unidades_barcoder, $vlr_barcoder, '$usuario')";
            }

            if (!empty($valores)) {
                $sql = "INSERT INTO T_BI_ORDENES_COMPRAS (FECHA_OC, DIA, MES, ANIO, DIA_SEMANA, EAN, MATERIAL, DESCRIPCION, TIPO_PRODUCTO, NIT_PROVEEDOR, NOMBRE_PROVEEDOR, GRUPO_ARTICULO, CATEGORIA, GRUPO_TERAPEUTICO, SUBCATEGORIA, PRINCIPIO_ACTIVO, DESCUENTO_COMERCIAL, SUBTOTAL, IVA, RT_FUENTE, ICA, R_IVA, COSTOS_UND, TOTAL_PAGAR, ORGANIZACION, CENTRO, GRUPO_COMPRAS, FAMILIA_PRODUCTO, UNIDADES_BARCORDER,VLR_BARCORDER, USUARIO) VALUES " . implode(",", $valores);

                $result = mssql_query($sql);
                if ($result) echo json_encode(array('ok' => true, 'msg' => "Se insertaron los datos correctamente"));
                else echo json_encode(array('ok' => false, 'msg' => "Error al insertar los datos"));
            } else echo json_encode("No hay datos");
        }
        break;

    case "I_DATOS_PRESUPUESTO_COMPRAS":
        $datos = json_decode($_POST["datos"], true);

        if (!empty($datos)) {
            $valores = [];

            foreach ($datos as $fila) {
                $ofi_ventas = utf8_decode(addslashes($fila["OFICINA_VENTAS"]));
                $fecha = $fila["FECHA"];
                $dia = intval($fila["DIA"]);
                $mes = intval($fila["MES"]);
                $anio = intval($fila["ANIO"]);
                $dia_semana = intval($fila["DIA_SEMANA"]);
                $ean = utf8_decode(addslashes($fila["EAN"]));
                $material = utf8_decode(addslashes($fila["MATERIAL"]));
                $descripcion = utf8_decode(addslashes($fila["DESCRIPCION"]));
                $familia_producto = utf8_decode(addslashes($fila["FAMILIA_PRODUCTO"]));
                $estado_status = utf8_decode(addslashes($fila["ESTADO_STATUS"]));
                $nit_proveedor = utf8_decode(addslashes($fila["NIT_PROVEEDOR"]));
                $nombre_proveedor = utf8_decode(addslashes($fila["NOMBRE_PROVEEDOR"]));
                $grupo_articulo = utf8_decode(addslashes($fila["GRUPO_ARTICULO"]));
                $categoria = utf8_decode(addslashes($fila["CATEGORIA"]));
                $subcategoria = utf8_decode(addslashes($fila["SUBCATEGORIA"]));
                $grupo_terapeutico = utf8_decode(addslashes($fila["GRUPO_TERAPEUTICO"]));
                $principio_activo = utf8_decode(addslashes($fila["PRINCIPIO_ACTIVO"]));
                $clasificacion_rotacion = utf8_decode(addslashes($fila["CLASIFICACION_ROTACION"]));
                $grupo_compras = utf8_decode(addslashes($fila["GRUPO_COMPRAS"]));
                $libre_utilizacion = intval($fila["LIBRE_UTILIZACION"]);
                $valor_libre_utilizacion = floatval($fila["VALOR_LIBRE_UTILIZACION"]);
                $promedio_rotacion_und = intval($fila["PROMEDIO_ROTACION_UND"]);
                $promedio_rotacion_vlr = floatval($fila["PROMEDIO_ROTACION_VLR"]);
                $venta_diaria = floatval($fila["VENTA_DIARIA"]);
                $venta_optima = intval($fila["VENTA_OPTIMA"]);
                $vlr_presupuesto = floatval($fila["VLR_PRESUPUESTO"]);
                $promedio_vtas_eventos = floatval($fila["PROMEDIO_VTAS_EVENTOS"]);
                $pcj_partic_evento = floatval($fila["PCJ_PARTIC_EVENTO"]);
                $pcj_partic_mercado = floatval($fila["PCJ_PARTIC_MERCADO"]);
                $estacionalidad_temporada = utf8_decode(addslashes($fila["ESTACIONALIDAD_TEMPORADA"]));
                $frecuencia_teleferias = utf8_decode(addslashes($fila["FRECUENCIA_TELEFERIAS"]));
                $frecuencia_eventos = utf8_decode(addslashes($fila["FRECUENCIA_EVENTOS"]));
                $frecuencia_compras = utf8_decode(addslashes($fila["FRECUENCIA_COMPRAS"]));
                $promedio_impactos = intval($fila["PROMEDIO_IMPACTOS"]);
                $promedio_poblaciones = intval($fila["PROMEDIO_POBLACIONES"]);
                $estimacion_demanda = utf8_decode(addslashes($fila["ESTIMACION_DEMANDA"]));
                $tipo_oferta = utf8_decode(addslashes($fila["TIPO_OFERTA"]));
                $usuario = $fila["USUARIO"];

                $valores[] = "('$ofi_ventas', '$fecha', $dia, $mes, $anio, $dia_semana, '$ean', '$material', '$descripcion', '$familia_producto', '$estado_status', '$nit_proveedor', '$nombre_proveedor', '$grupo_articulo', '$categoria', '$subcategoria', '$grupo_terapeutico', '$principio_activo', '$clasificacion_rotacion', '$grupo_compras', $libre_utilizacion, $valor_libre_utilizacion, $promedio_rotacion_und, $promedio_rotacion_vlr, $venta_diaria, $venta_optima, $vlr_presupuesto, $promedio_vtas_eventos, $pcj_partic_evento, $pcj_partic_mercado, '$estacionalidad_temporada', '$frecuencia_teleferias', '$frecuencia_eventos', '$frecuencia_compras', $promedio_impactos, $promedio_poblaciones, '$estimacion_demanda', '$tipo_oferta', '$usuario')";
            }

            if (!empty($valores)) {
                $sql = "INSERT INTO T_BI_PRESUPUESTO_COMPRAS (OFICINA_VENTAS, FECHA, DIA, MES, ANIO, DIA_SEMANA, EAN, MATERIAL, DESCRIPCION, FAMILIA_PRODUCTO, ESTADO_STATUS, NIT_PROVEEDOR, NOMBRE_PROVEEDOR, GRUPO_ARTICULO, CATEGORIA, SUBCATEGORIA, GRUPO_TERAPEUTICO, PRINCIPIO_ACTIVO, CLASIFICACION_ROTACION, GRUPO_COMPRAS, LIBRE_UTILIZACION, VALOR_LIBRE_UTILIZACION, PROMEDIO_ROTACION_UND, PROMEDIO_ROTACION_VLR, VENTA_DIARIA, VENTA_OPTIMA, VLR_PRESUPUESTO, PROMEDIO_VTAS_EVENTOS, PCJ_PARTIC_EVENTO, PCJ_PARTIC_MERCADO, ESTACIONALIDAD_TEMPORADA, FRECUENCIA_TELEFERIAS, FRECUENCIA_EVENTOS, FRECUENCIA_COMPRAS, PROMEDIO_IMPACTOS, PROMEDIO_POBLACIONES,ESTIMACION_DEMANDA, TIPO_OFERTA, USUARIO) VALUES " . implode(",", $valores);

                $result = mssql_query($sql);
                if ($result) echo json_encode(array('ok' => true, 'msg' => "Se insertaron los datos correctamente"));
                else echo json_encode(array('ok' => false, 'msg' => "Error al insertar los datos"));
            } else echo json_encode("No hay datos");
        }
        break;

    case "I_DATOS_PRESUPUESTO_VENTAS":
        $datos = json_decode($_POST["datos"], true);

        if (!empty($datos)) {
            $valores = [];

            foreach ($datos as $fila) {
                $bodega = utf8_decode(addslashes($fila["BODEGA"]));
                $id_presupuesto = intval($fila["ID_PRESUPUESTO"]);
                $fecha_inicial = $fila["FECHA_INICIAL"];
                $fecha_final = $fila["FECHA_FINAL"];
                $mes = intval($fila["MES"]);
                $anio = intval($fila["ANIO"]);
                $presupuesto_valor = floatval($fila["PRESUPUESTO_VALOR"]);
                $cuota_impactos = intval($fila["CUOTA_IMPACTOS"]);
                $cuota_referencias = intval($fila["CUOTA_REFERENCIAS"]);
                $cuota_volumen = intval($fila["CUOTA_VOLUMEN"]);
                $id_tipo_ppto = intval($fila["ID_TIPO_PPTO"]);
                $tipo_presupuesto = utf8_decode(addslashes($fila["TIPO_PRESUPUESTO"]));
                $periocidad = utf8_decode(addslashes($fila["PERIOCIDAD"]));
                $nit_cliente = utf8_decode(addslashes($fila["NIT_CLIENTE"]));
                $tipo_documento = utf8_decode(addslashes($fila["TIPO_DOCUMENTO"]));
                $codigo_sap = utf8_decode(addslashes($fila["CODIGO_SAP"]));
                $nombres_cliente = utf8_decode(addslashes($fila["NOMBRES_CLIENTE"]));
                $razon_comercial = utf8_decode(addslashes($fila["RAZON_COMERCIAL"]));
                $ciudad = utf8_decode(addslashes($fila["CIUDAD"]));
                $departamento = utf8_decode(addslashes($fila["DEPARTAMENTO"]));
                $nit_vendedor = utf8_decode(addslashes($fila["NIT_VENDEDOR"]));
                $codigo_sap_vendedor = utf8_decode(addslashes($fila["CODIGO_SAP_VENDEDOR"]));
                $nombre_vendedor = utf8_decode(addslashes($fila["NOMBRE_VENDEDOR"]));
                $televendedor = utf8_decode(addslashes($fila["TELEVENDEDOR"]));
                $codigo_zona = utf8_decode(addslashes($fila["CODIGO_ZONA"]));
                $descripcion_zona = utf8_decode(addslashes($fila["DESCRIPCION_ZONA"]));
                $grupo1 = utf8_decode(addslashes($fila["GRUPO1"]));
                $grupo2 = utf8_decode(addslashes($fila["GRUPO2"]));
                $nit_laboratorio = utf8_decode(addslashes($fila["NIT_LABORATORIO"]));
                $grupo_articulo = utf8_decode(addslashes($fila["GRUPO_ARTICULO"]));
                $rapels = utf8_decode(addslashes($fila["RAPELS"]));
                $nombre_laboratorio = utf8_decode(addslashes($fila["NOMBRE_LABORATORIO"]));
                $categoria = utf8_decode(addslashes($fila["CATEGORIA"]));
                $subcategoria = utf8_decode(addslashes($fila["SUBCATEGORIA"]));
                $grupo_terapeutico = utf8_decode(addslashes($fila["GRUPO_TERAPEUTICO"]));
                $principio_activo = utf8_decode(addslashes($fila["PRINCIPIO_ACTIVO"]));
                $usuario = $fila["USUARIO"];

                $valores[] = "('$bodega', $id_presupuesto, '$fecha_inicial', '$fecha_final', $mes, $anio, $presupuesto_valor, $cuota_impactos, $cuota_referencias, $cuota_volumen, $id_tipo_ppto, '$tipo_presupuesto', '$periocidad', '$nit_cliente', '$tipo_documento', '$codigo_sap', '$nombres_cliente', '$razon_comercial', '$ciudad', '$departamento', '$nit_vendedor', '$codigo_sap_vendedor', '$nombre_vendedor', '$televendedor', '$codigo_zona', '$descripcion_zona', '$grupo1', '$grupo2', '$nit_laboratorio', '$grupo_articulo', '$rapels', '$nombre_laboratorio', '$categoria', '$subcategoria', '$grupo_terapeutico', '$principio_activo', '$usuario')";
            }

            if (!empty($valores)) {
                $sql = "INSERT INTO T_BI_PRESUPUESTO_VENTAS (BODEGA, ID_PRESUPUESTO, FECHA_INICIAL, FECHA_FINAL, MES, ANIO, PRESUPUESTO_VALOR, CUOTA_IMPACTOS, CUOTA_REFERENCIAS, CUOTA_VOLUMEN, ID_TIPO_PPTO, TIPO_PRESUPUESTO, PERIOCIDAD, NIT_CLIENTE, TIPO_DOCUMENTO, CODIGO_SAP, NOMBRES_CLIENTE, RAZON_COMERCIAL, CIUDAD, DEPARTAMENTO, NIT_VENDEDOR, CODIGO_SAP_VENDEDOR, NOMBRE_VENDEDOR, TELEVENDEDOR, CODIGO_ZONA,DESCRIPCION_ZONA, GRUPO1, GRUPO2, NIT_LABORATORIO, GRUPO_ARTICULO, RAPELS, NOMBRE_LABORATORIO, CATEGORIA, SUBCATEGORIA, GRUPO_TERAPEUTICO, PRINCIPIO_ACTIVO, USUARIO) VALUES " . implode(",", $valores);

                $result = mssql_query($sql);
                if ($result) echo json_encode(array('ok' => true, 'msg' => "Se insertaron los datos correctamente"));
                else echo json_encode(array('ok' => false, 'msg' => "Error al insertar los datos"));
            } else echo json_encode("No hay datos");
        }
        break;

    case "I_DATOS_REBATE":
        $datos = json_decode($_POST["datos"], true);

        if (!empty($datos)) {
            $valores = [];

            foreach ($datos as $fila) {
                $bodega = utf8_decode(addslashes($fila["BODEGA"]));
                $id_ppto_rebate = intval($fila["ID_PPTO_REBATE"]);
                $fecha_inicial = $fila["FECHA_INICIAL"];
                $fecha_final = $fila["FECHA_FINAL"];
                $mes = intval($fila["MES"]);
                $anio = intval($fila["ANIO"]);
                $presupuesto_valor = floatval($fila["PRESUPUESTO_VALOR"]);
                $cuota_impactos = intval($fila["CUOTA_IMPACTOS"]);
                $cuota_referencias = intval($fila["CUOTA_REFERENCIAS"]);
                $cuota_volumen = intval($fila["CUOTA_VOLUMEN"]);
                $id_tipo_rebate = intval($fila["ID_TIPO_REBATE"]);
                $tipo_presupuesto_rebate = utf8_decode(addslashes($fila["TIPO_PRESUPUESTO_REBATE"]));
                $periocidad = utf8_decode(addslashes($fila["PERIOCIDAD"]));
                $pcj_nota_ganar = floatval($fila["PCJ_NOTA_GANAR"]);
                $nit_cliente = utf8_decode(addslashes($fila["NIT_CLIENTE"]));
                $tipo_documento = utf8_decode(addslashes($fila["TIPO_DOCUMENTO"]));
                $codigo_sap = utf8_decode(addslashes($fila["CODIGO_SAP"]));
                $nombres_cliente = utf8_decode(addslashes($fila["NOMBRES_CLIENTE"]));
                $razon_comercial = utf8_decode(addslashes($fila["RAZON_COMERCIAL"]));
                $ciudad = utf8_decode(addslashes($fila["CIUDAD"]));
                $departamento = utf8_decode(addslashes($fila["DEPARTAMENTO"]));
                $nit_vendedor = utf8_decode(addslashes($fila["NIT_VENDEDOR"]));
                $codigo_sap_vendedor = utf8_decode(addslashes($fila["CODIGO_SAP_VENDEDOR"]));
                $nombre_vendedor = utf8_decode(addslashes($fila["NOMBRE_VENDEDOR"]));
                $televendedor = utf8_decode(addslashes($fila["TELEVENDEDOR"]));
                $codigo_zona = utf8_decode(addslashes($fila["CODIGO_ZONA"]));
                $descripcion_zona = utf8_decode(addslashes($fila["DESCRIPCION_ZONA"]));
                $grupo1 = utf8_decode(addslashes($fila["GRUPO1"]));
                $grupo2 = utf8_decode(addslashes($fila["GRUPO2"]));
                $nit_laboratorio = utf8_decode(addslashes($fila["NIT_LABORATORIO"]));
                $grupo_articulo = utf8_decode(addslashes($fila["GRUPO_ARTICULO"]));
                $rapels = utf8_decode(addslashes($fila["RAPELS"]));
                $nombre_laboratorio = utf8_decode(addslashes($fila["NOMBRE_LABORATORIO"]));
                $categoria = utf8_decode(addslashes($fila["CATEGORIA"]));
                $subcategoria = utf8_decode(addslashes($fila["SUBCATEGORIA"]));
                $grupo_terapeutico = utf8_decode(addslashes($fila["GRUPO_TERAPEUTICO"]));
                $principio_activo = utf8_decode(addslashes($fila["PRINCIPIO_ACTIVO"]));
                $usuario = $fila["USUARIO"];       

                $valores[] = "('$bodega', $id_ppto_rebate, '$fecha_inicial', '$fecha_final', $mes, $anio, $presupuesto_valor, $cuota_impactos, $cuota_referencias, $cuota_volumen, $id_tipo_rebate, '$tipo_presupuesto_rebate', '$periocidad', $pcj_nota_ganar, '$nit_cliente', '$tipo_documento', '$codigo_sap', '$nombres_cliente', '$razon_comercial', '$ciudad', '$departamento', '$nit_vendedor', '$codigo_sap_vendedor', '$nombre_vendedor', '$televendedor', '$codigo_zona', '$descripcion_zona', '$grupo1', '$grupo2', '$nit_laboratorio', '$grupo_articulo', '$rapels', '$nombre_laboratorio', '$categoria', '$subcategoria', '$grupo_terapeutico', '$principio_activo', '$usuario')";
            }

            if (!empty($valores)) {
                $sql = "INSERT INTO T_BI_REBATE (BODEGA, ID_PPTO_REBATE, FECHA_INICIAL, FECHA_FINAL, MES, ANIO, PRESUPUESTO_VALOR, CUOTA_IMPACTOS, CUOTA_REFERENCIAS, CUOTA_VOLUMEN, ID_TIPO_REBATE, TIPO_PRESUPUESTO_REBATE, PERIOCIDAD, PCJ_NOTA_GANAR, NIT_CLIENTE, TIPO_DOCUMENTO, CODIGO_SAP, NOMBRES_CLIENTE, RAZON_COMERCIAL, CIUDAD, DEPARTAMENTO, NIT_VENDEDOR, CODIGO_SAP_VENDEDOR, NOMBRE_VENDEDOR, TELEVENDEDOR,CODIGO_ZONA, DESCRIPCION_ZONA, GRUPO1, GRUPO2, NIT_LABORATORIO, GRUPO_ARTICULO, RAPELS, NOMBRE_LABORATORIO, CATEGORIA, SUBCATEGORIA, GRUPO_TERAPEUTICO, PRINCIPIO_ACTIVO, USUARIO) VALUES " . implode(",", $valores);

                $result = mssql_query($sql);
                if ($result) echo json_encode(array('ok' => true, 'msg' => "Se insertaron los datos correctamente"));
                else echo json_encode(array('ok' => false, 'msg' => "Error al insertar los datos"));
            } else echo json_encode("No hay datos");
        }
        break;

    case "I_DATOS_VENTAS":
        $datos = json_decode($_POST["datos"], true);

        if (!empty($datos)) {
            $valores = [];

            foreach ($datos as $fila) {
                $bodega = utf8_decode(addslashes($fila["BODEGA"]));
                $fecha_vta = $fila["FECHA_VTA"];
                $hora_pedido = $fila["HORA_PEDIDO"];
                $hora_facturacion = $fila["HORA_FACTURACION"];
                $fecha_despacho = $fila["FECHA_DESPACHO"];
                $anio = intval($fila["ANIO"]);
                $mes = intval($fila["MES"]);
                $dia_semana = utf8_decode(addslashes($fila["DIA_SEMANA"]));
                $tipo_documento = utf8_decode(addslashes($fila["TIPO_DOCUMENTO"]));
                $numero_documento = utf8_decode(addslashes($fila["NUMERO_DOCUMENTO"]));
                $documento_referencia = utf8_decode(addslashes($fila["DOCUMENTO_REFERENCIA"]));
                $material = utf8_decode(addslashes($fila["MATERIAL"]));
                $descripcion_material = utf8_decode(addslashes($fila["DESCRIPCION_MATERIAL"]));
                $codigo_cum = utf8_decode(addslashes($fila["CODIGO_CUM"]));
                $tipo_material = utf8_decode(addslashes($fila["TIPO_MATERIAL"]));
                $cantidad = intval($fila["CANTIDAD"]);
                $costo_unitario = intval($fila["COSTO_UNITARIO"]);
                $costo_total = intval($fila["COSTO_TOTAL"]);
                $valor_unitario = intval($fila["VALOR_UNITARIO"]);
                $total_venta_bruta = intval($fila["TOTAL_VENTA_BRUTA"]);
                $porcentaje_iva = floatval($fila["PORCENTAJE_IVA"]);
                $valor_iva = intval($fila["VALOR_IVA"]);
                $dto1 = intval($fila["DTO1"]);
                $dto2 = intval($fila["DTO2"]);
                $dto3 = intval($fila["DTO3"]);
                $valor_dcto = intval($fila["VALOR_DCTO"]);
                $valor_dcto_total = intval($fila["VALOR_DCTO_TOTAL"]);
                $venta_neta = intval($fila["VENTA_NETA"]);
                $valor_utilidad = intval($fila["VALOR_UTILIDAD"]);
                $margen_utilidad = intval($fila["MARGEN_UTILIDAD"]);
                $tipo_venta = utf8_decode(addslashes($fila["TIPO_VENTA"]));
                $lista_precios = utf8_decode(addslashes($fila["LISTA_PRECIOS"]));
                $nit_laboratorio = utf8_decode(addslashes($fila["NIT_LABORATORIO"]));
                $grupo_articulo = utf8_decode(addslashes($fila["GRUPO_ARTICULO"]));
                $rapels = utf8_decode(addslashes($fila["RAPELS"]));
                $nombre_laboratorio = utf8_decode(addslashes($fila["NOMBRE_LABORATORIO"]));
                $categoria = utf8_decode(addslashes($fila["CATEGORIA"]));
                $subcategoria = utf8_decode(addslashes($fila["SUBCATEGORIA"]));
                $grupo_terapeutico = utf8_decode(addslashes($fila["GRUPO_TERAPEUTICO"]));
                $principio_activo = utf8_decode(addslashes($fila["PRINCIPIO_ACTIVO"]));             
                $nit_real = utf8_decode(addslashes($fila["NIT_REAL"]));             
                $responsable_pago = utf8_decode(addslashes($fila["RESPONSABLE_PAGO"]));             
                $codigo_sap = utf8_decode(addslashes($fila["CODIGO_SAP"]));
                $nombre_cliente = utf8_decode(addslashes($fila["NOMBRE_CLIENTE"]));
                $razon_social = utf8_decode(addslashes($fila["RAZON_SOCIAL"]));
                $direccion = addslashes($fila["DIRECCION"]);
                $barrio = addslashes($fila["BARRIO"]);
                $telefono = addslashes($fila["TELEFONO"]);
                $id_ciudad = intval($fila["ID_CIUDAD"]);
                $ciudad = addslashes($fila["CIUDAD"]);
                $id_dpto = intval($fila["ID_DPTO"]);
                $departamento = addslashes($fila["DEPARTAMENTO"]);
                $latitud = addslashes($fila["LATITUD"]);
                $longitud = addslashes($fila["LONGITUD"]);
                $codigo_bricks = intval($fila["CODIGO_BRICKS"]);
                $usuario_fact = addslashes($fila["USUARIO_FACT"]);
                $descripcion_usuario_fact = addslashes($fila["DESCRIPCION_USUARIO_FACT"]);
                $nit_vendedor = utf8_decode(addslashes($fila["NIT_VENDEDOR"]));
                $codigo_sap_vendedor = utf8_decode(addslashes($fila["CODIGO_SAP_VENDEDOR"]));
                $nombre_vendedor = utf8_decode(addslashes($fila["NOMBRE_VENDEDOR"]));
                $codigo_zona = utf8_decode(addslashes($fila["CODIGO_ZONA"]));
                $descripcion_zona = utf8_decode(addslashes($fila["DESCRIPCION_ZONA"]));
                $codigo_tipo = intval($fila["CODIGO_TIPO"]);
                $tipo_tercero = utf8_decode(addslashes($fila["TIPO_TERCERO"]));
                $clase_pedido = utf8_decode(addslashes($fila["CLASE_PEDIDO"]));
                $descripcion_clase_pedido = utf8_decode(addslashes($fila["DESCRIPCION_CLASE_PEDIDO"]));
                $grupo_clientes = utf8_decode(addslashes($fila["GRUPO_CLIENTES"]));
                $subgrupo_clientes = utf8_decode(addslashes($fila["SUBGRUPO_CLIENTES"]));
                $usuario_pedido = utf8_decode(addslashes($fila["USUARIO_PEDIDO"]));
                $ean = utf8_decode(addslashes($fila["EAN"]));
                $plan_rebate = utf8_decode(addslashes($fila["PLAN_REBATE"]));
                $porcentaje_rebate = intval($fila["PORCENTAJE_REBATE"]);
                $coordinador_ventas = utf8_decode(addslashes($fila["COORDINADOR_VENTAS"]));
                $usuario = $fila["USUARIO"];

                $valores[] = "('$bodega', '$fecha_vta', '$hora_pedido', '$hora_facturacion', '$fecha_despacho', $anio, $mes, '$dia_semana', '$tipo_documento', '$numero_documento', '$documento_referencia', '$material', '$descripcion_material', '$codigo_cum', '$tipo_material', $cantidad, $costo_unitario, $costo_total, $valor_unitario, $total_venta_bruta, $porcentaje_iva, $valor_iva, $dto1, $dto2, $dto3, $valor_dcto, $valor_dcto_total, $venta_neta, $valor_utilidad, $margen_utilidad, '$tipo_venta', '$lista_precios', '$nit_laboratorio', '$grupo_articulo', '$rapels', '$nombre_laboratorio', '$categoria', '$subcategoria', '$grupo_terapeutico', '$principio_activo', '$nit_real', '$responsable_pago', '$codigo_sap', '$nombre_cliente', '$razon_social', '$direccion', '$barrio', '$telefono', $id_ciudad, '$ciudad', $id_dpto, '$departamento', '$latitud', '$longitud', $codigo_bricks, '$usuario_fact', '$descripcion_usuario_fact', '$nit_vendedor', '$codigo_sap_vendedor', '$nombre_vendedor', '$codigo_zona', '$descripcion_zona', $codigo_tipo, '$tipo_tercero', '$clase_pedido', '$descripcion_clase_pedido', '$grupo_clientes', '$subgrupo_clientes', '$usuario_pedido', '$ean', '$plan_rebate', '$porcentaje_rebate', '$coordinador_ventas', '$usuario')";
            }

            if (!empty($valores)) {
                $sql = "INSERT INTO T_BI_VENTAS (BODEGA, FECHA_VTA, HORA_PEDIDO, HORA_FACTURACION, FECHA_DESPACHO, ANIO, MES, DIA_SEMANA, TIPO_DOCUMENTO, NUMERO_DOCUMENTO, DOCUMENTO_REFERENCIA, MATERIAL, DESCRIPCION_MATERIAL, CODIGO_CUM, TIPO_MATERIAL, CANTIDAD, COSTO_UNITARIO, COSTO_TOTAL, VALOR_UNITARIO, TOTAL_VENTA_BRUTA, PORCENTAJE_IVA, VALOR_IVA, DTO1, DTO2, DTO3, VALOR_DCTO, VALOR_DCTO_TOTAL, VENTA_NETA, VALOR_UTILIDAD, MARGEN_UTILIDAD, TIPO_VENTA, LISTA_PRECIOS, NIT_LABORATORIO, GRUPO_ARTICULO, RAPELS, NOMBRE_LABORATORIO, CATEGORIA, SUBCATEGORIA, GRUPO_TERAPEUTICO, PRINCIPIO_ACTIVO, NIT_REAL, RESPONSABLE_PAGO, CODIGO_SAP, NOMBRE_CLIENTE, RAZON_SOCIAL, DIRECCION, BARRIO, TELEFONO, ID_CIUDAD, CIUDAD, ID_DPTO, DEPARTAMENTO, LATITUD, LONGITUD, CODIGO_BRICKS, USUARIO_FACT, DESCRIPCION_USUARIO_FACT, NIT_VENDEDOR, CODIGO_SAP_VENDEDOR, NOMBRE_VENDEDOR, CODIGO_ZONA, DESCRIPCION_ZONA, CODIGO_TIPO, TIPO_TERCERO, CLASE_PEDIDO, DESCRIPCION_CLASE_PEDIDO, GRUPO_CLIENTES, SUBGRUPO_CLIENTES, USUARIO_PEDIDO, EAN, PLAN_REBATE, PORCENTAJE_REBATE, COORDINADOR_VENTAS, USUARIO) VALUES " . implode(",", $valores);

                $result = mssql_query($sql);
                if ($result) echo json_encode(array('ok' => true, 'msg' => "Se insertaron los datos correctamente"));
                else echo json_encode(array('ok' => false, 'msg' => "Error al insertar los datos"));
            } else echo json_encode("No hay datos");
        }
        break;
}