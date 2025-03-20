import {
    esquemaTablaConvenios,
    esquemaTablaInventarios,
    esquemaTablaOrdenesCompras,
    esquemaTablaPresupuestoCompras,
    esquemaTablaPresupuestoVentas,
    esquemaTablaRebate,
    esquemaTablaVentas
}
    from '../lib/js/helpers/EsquemasDatos.js';

const confirmAlert = async (title, text) => {
    const result = await Swal.fire({
        title: `${title}`,
        text: `${text}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    });

    return result;
}

const cargarEstructuraTabla = (esquema) => {
    const tbody = document.querySelector("#tablaInfo tbody");
    const tabla = $('#seleccionarTabla').val();
    $('#nombreTabla').html(``);
    tbody.innerHTML = ``;

    const types = {
        "datetime": "Fecha y hora",
        "date": "Fecha",
        "int": "Número",
        "varchar": "Texto",
        "char": "Texto",
        "numeric": "Número",
        "decimal": "Número",
        "money": "Moneda",
    }

    const tablas = {
        "1": "CONVENIOS",
        "2": "INVENTARIOS",
        "3": "ORDENES DE COMPRAS",
        "4": "PRESUPUESTO COMPRAS",
        "5": "PRESUPUESTO VENTAS",
        "6": "REBATE",
        "7": "VENTAS"
    }

    $('#nombreTabla').html(tablas[tabla]);

    esquema.forEach((columna, index) => {
        const fila = document.createElement("tr");

        const celdaNumero = document.createElement("td");
        celdaNumero.textContent = index + 1;
        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = columna.name;
        const celdaTipo = document.createElement("td");
        celdaTipo.textContent = types[columna.type];
        const celdaLongitud = document.createElement("td");
        celdaLongitud.textContent = columna.maxLength ? columna.maxLength : "-";

        fila.appendChild(celdaNumero);
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaTipo);
        fila.appendChild(celdaLongitud);
        tbody.appendChild(fila);
    });
}

const procesarArchivo = async (esquema) => {
    const fileInput = document.getElementById("archivo");
    const tableBody = document.getElementById("tableBody");
    const tableHeader = document.getElementById("tableHeader");
    const errorMessages = document.getElementById("errorMessages");
    $('#campoBandera').val("0");

    if (!fileInput.files.length) {
        Swal.fire("Campo requerido", "Debe seleccionar el archivo a procesar", "warning");
        return;
    }

    showLoadingSwalAlert2("Cargando los datos...", false, true);

    setTimeout(() => {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                const text = event.target.result;
                const rows = text.split("\n").map(row => row.split(",").map(cell => cell.trim()));

                if (rows.length < 2) {
                    Swal.fire("Carga de archivo", "El archivo CSV está vacío o no tiene suficientes datos", "error");
                    return;
                }

                const csvHeaders = rows[0];
                const expectedHeaders = esquema.map(col => col.name);

                if (csvHeaders.join(",") !== expectedHeaders.join(",")) {
                    setTimeout(() => {
                        Swal.fire("Carga de archivo", "El archivo CSV no tiene los encabezados correctos", "error");                        
                    }, 200);
                    return;
                }

                tableHeader.innerHTML = `<th>No.</th>` + expectedHeaders.map(header => `<th>${header.replace(/\_/g, " ")}</th>`).join("");

                let errors = [];
                tableBody.innerHTML = "";

                for (let i = 1; i < rows.length; i++) {
                    let rowData = [];
                    if (rows[i].length > 1) rowData = rows[i];

                    let validRow = true;
                    let rowHTML = `<tr><td>${i}</td>`;

                    rowData.forEach((value, index) => {
                        const column = esquema[index];
                        if (!validateValue(value, column)) {
                            errors.push(`Error en la columna "${column.name}": En la fila número "${i}"`);
                        }
                        rowHTML += `<td>${value}</td>`;
                    });

                    rowHTML += "</tr>";

                    if (validRow) {
                        tableBody.innerHTML += rowHTML;
                    }
                }

                if (errors.length) {
                    errorMessages.innerText = errors.join("\n");
                    $('#campoBandera').val(errors.length);
                }
            } catch (error) {
                console.error("Error procesando el archivo:", error);
                Swal.fire("Error", "Ocurrió un problema al procesar el archivo", "error");
            } finally {
                dissminSwal();
            }
        };

        reader.readAsText(file);
    }, 200);
};

const validateValue = (value, column) => {
    if (value === "" || value === "NULL") return true;

    switch (column.type) {
        case "int":
            return /^-?\d+$/.test(value);

        case "datetime":
            return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value);

        case "date":
            return /^\d{4}-\d{2}-\d{2}$/.test(value);

        case "varchar":
        case "char":
            return value.length <= column.maxLength;

        case "numeric":
        case "money":
        case "decimal":
            return /^-?\d+(\.\d+)?$/.test(value);

        default:
            return false;
    }
};

const cargarDatos = async () => {
    const tabla = $('#seleccionarTabla').val();
    if (!tabla) {
        Swal.fire("Campo requerido", "Debe seleccionar una tabla para procesar archivo", "warning");
        return;
    }

    const esquemas = {
        "1": esquemaTablaConvenios,
        "2": esquemaTablaInventarios,
        "3": esquemaTablaOrdenesCompras,
        "4": esquemaTablaPresupuestoCompras,
        "5": esquemaTablaPresupuestoVentas,
        "6": esquemaTablaRebate,
        "7": esquemaTablaVentas
    };

    if (esquemas[tabla]) {
        await procesarArchivo(esquemas[tabla]);
    }      
}

const mostrarInformacion = () => {
    const tabla = $('#seleccionarTabla').val();
    if (!tabla) {
        Swal.fire("Campo requerido", "Debe seleccionar una tabla para obtener información", "warning");
        return;
    }

    if (tabla === "1") {
        cargarEstructuraTabla(esquemaTablaConvenios);
        $('#modalTablaInfo').modal('show');
    }

    if (tabla === "2") {
        cargarEstructuraTabla(esquemaTablaInventarios);
        $('#modalTablaInfo').modal('show');
    }

    if (tabla === "3") {
        cargarEstructuraTabla(esquemaTablaOrdenesCompras);
        $('#modalTablaInfo').modal('show');
    }

    if (tabla === "4") {
        cargarEstructuraTabla(esquemaTablaPresupuestoCompras);
        $('#modalTablaInfo').modal('show');
    }

    if (tabla === "5") {
        cargarEstructuraTabla(esquemaTablaPresupuestoVentas);
        $('#modalTablaInfo').modal('show');
    }

    if (tabla === "6") {
        cargarEstructuraTabla(esquemaTablaRebate);
        $('#modalTablaInfo').modal('show');
    }

    if (tabla === "7") {
        cargarEstructuraTabla(esquemaTablaVentas);
        $('#modalTablaInfo').modal('show');
    }
}

const guardarDatosConvenios = async () => {
    try {
        const contenidoTabla = $("#tablaDatos tbody tr").length;
        if (contenidoTabla < 1) {
            Swal.fire("Guardar datos", "Debe cargar la información para guardar", "warning");
            return;
        }

        let datos = [];

        $("#tablaDatos tbody tr").each(function () {
            let fila = $(this).find("td");

            let data = {
                FECHA: fila.eq(1).text(),
                ID_CONVENIO: fila.eq(2).text(),
                EAN: fila.eq(3).text(),
                MATERIAL: fila.eq(4).text(),
                DESCRIPCION: fila.eq(5).text(),
                NIT_PROVEEDOR: fila.eq(6).text(),
                NOMBRE_PROVEEDOR: fila.eq(7).text(),
                GRUPO_ARTICULO: fila.eq(8).text(),
                CATEGORIA: fila.eq(9).text(),
                SUBCATEGORIA: fila.eq(10).text(),
                GRUPO_TERAPEUTICO: fila.eq(11).text(),
                PRINCIPIO_ACTIVO: fila.eq(12).text(),
                GRUPO_COMPRAS: fila.eq(13).text(),
                FECHA_INICIAL: fila.eq(14).text(),
                FECHA_FINAL: fila.eq(15).text(),
                PERIODO_LIQUIDACION: fila.eq(16).text(),
                TIPO_ROTACION: fila.eq(17).text(),
                CONTEMPLACIONES: fila.eq(18).text(),
                CLASIFICACION: fila.eq(19).text(),
                PCJ_REBATE_BACORDE: fila.eq(20).text(),
                PCJ_REBATE_COM_TRIM: fila.eq(21).text(),
                PCJ_REBATE_MANEJO_LINEA: fila.eq(22).text(),
                PCJ_REBATE_ROTCION: fila.eq(23).text(),
                PCJ_REBATE_INFO: fila.eq(24).text(),
                PCJ_REBATE_NO_DEV: fila.eq(25).text(),
                PCJ_REBATE_DIN_COM: fila.eq(26).text(),
                PCJ_REBATE_DIAS_INV: fila.eq(27).text(),
                PCJ_REBATE_IMPACTOS: fila.eq(28).text(),
                PCJ_REBATE_AVERIAS: fila.eq(29).text(),
                PCJ_REBATE_LOGISTICA: fila.eq(30).text(),
                OBJETIVO_IMPACTOS_Q1: fila.eq(31).text(),
                OBJETIVO_COMPRAS: fila.eq(32).text(),
                OBJ_MANEJO_LINEA: fila.eq(33).text(),
                OBJ_IMPACTOS_Q4: fila.eq(34).text(),
                OBJ_COMPRAS_Q1: fila.eq(35).text(),
                OBJ_COMPRAS_Q2: fila.eq(36).text(),
                OBJ_COMPRAS_Q4: fila.eq(37).text(),
                OBJ_ROTACION_Q1: fila.eq(38).text(),
                OBJ_ROTACION_Q2: fila.eq(39).text(),
                OBJ_ROTACION_Q3: fila.eq(40).text(),
                OBJ_ROTACION_Q4: fila.eq(41).text(),
                USUARIO: $('#login_user').val()
            };
            datos.push(data);
        });

        const result = await confirmAlert("Guardar datos", "Se guardarán los datos cargados... ¿Está seguro de seguir?");
        if (!result.isConfirmed) return;

        showLoadingSwalAlert2('Guardando los datos...', false, true);

        const resp = await enviarPeticion({
            op: "I_DATOS_CONVENIO",
            datos: JSON.stringify(datos),
            link: "../models/BusinessIntelligence.php"
        });

        dissminSwal();
        limpiarVista();
        Swal.fire("Guardar datos", "Lo datos se guardaron correctamente", "success");

    } catch (error) {
        console.log(error);
    }
}

const guardarDatosInventarios = async () => {
    try {
        const contenidoTabla = $("#tablaDatos tbody tr").length;
        if (contenidoTabla < 1) {
            Swal.fire("Guardar datos", "Debe cargar la información para guardar", "warning");
            return;
        }

        let datos = [];

        $("#tablaDatos tbody tr").each(function () {
            let fila = $(this).find("td");

            let data = {
                OFICINA_VENTAS: fila.eq(1).text(),
                FECHA: fila.eq(2).text(),
                DIA: fila.eq(3).text(),
                MES: fila.eq(4).text(),
                ANIO: fila.eq(5).text(),
                EAN: fila.eq(6).text(),
                MATERIAL: fila.eq(7).text(),
                DESCRIPCION: fila.eq(8).text(),
                LIBRE_UTILIZACION: fila.eq(9).text(),
                VLR_LIBRE_UTILIZACION: fila.eq(10).text(),
                CENTRO: fila.eq(11).text(),
                NIT_PROVEEDOR: fila.eq(12).text(),
                NOMBRE_PROVEEDOR: fila.eq(13).text(),
                GRUPO_ARTICULO: fila.eq(14).text(),
                RAPELS: fila.eq(15).text(),
                CATEGORIA: fila.eq(16).text(),
                SUBCATEGORIA: fila.eq(17).text(),
                GRUPO_TERAPEUTICO: fila.eq(18).text(),
                PRINCIPIO_ACTIVO: fila.eq(19).text(),
                UBICACION: fila.eq(20).text(),
                LOTE: fila.eq(21).text(),
                FECHA_VENCIMIENTO: fila.eq(22).text(),
                ULTIMA_FECHA_INGRESO: fila.eq(23).text(),
                FECHA_ACTUAL: fila.eq(24).text(),
                TIEMPO_OBSOLESENCIA: fila.eq(25).text(),
                EXCLUSIONES: fila.eq(26).text(),
                CATEGORIA_RAPELS: fila.eq(27).text(),
                PROMEDIO_VTAS_UND: fila.eq(28).text(),
                PROMEDIO_VTAS_COTOS: fila.eq(29).text(),
                PCJ_PART_ROT: fila.eq(30).text(),
                PCJ_ACUM_ROT: fila.eq(31).text(),
                DIAS_INVENT: fila.eq(32).text(),
                INVENT_OPTIMO_UND: fila.eq(33).text(),
                INVENT_OPTIMO_VLRS: fila.eq(34).text(),
                EXCESO_UND: fila.eq(35).text(),
                EXCESO_VLRS: fila.eq(36).text(),
                RANGO: fila.eq(37).text(),
                CLASIFICACION_ROTACION: fila.eq(38).text(),
                GRUPO_COMPRAS: fila.eq(39).text(),
                NULA_ROTACION: fila.eq(40).text(),
                DIAS_CONVENIOS: fila.eq(41).text(),
                CLASIFICACION_REBATE: fila.eq(42).text(),
                POLITICA_DEV: fila.eq(43).text(),
                TIPO_OFERTA: fila.eq(44).text(),
                USUARIO: $('#login_user').val()
            };
            datos.push(data);
        });

        console.log(datos);

        const result = await confirmAlert("Guardar datos", "Se guardarán los datos cargados... ¿Está seguro de seguir?");
        if (!result.isConfirmed) return;

        const resp = await enviarPeticion({
            op: "I_DATOS_INVENTARIO",
            datos: JSON.stringify(datos),
            link: "../models/BusinessIntelligence.php"
        });

        limpiarVista();
        Swal.fire("Guardar datos", "Lo datos se guardaron correctamente", "success");

    } catch (error) {
        console.log(error);
    }
}

const guardarDatosCompras = async () => {
    try {
        const contenidoTabla = $("#tablaDatos tbody tr").length;
        if (contenidoTabla < 1) {
            Swal.fire("Guardar datos", "Debe cargar la información para guardar", "warning");
            return;
        }

        let datos = [];

        $("#tablaDatos tbody tr").each(function () {
            let fila = $(this).find("td");

            let data = {
                FECHA_OC: fila.eq(1).text(),
                DIA: fila.eq(2).text(),
                MES: fila.eq(3).text(),
                ANIO: fila.eq(4).text(),
                DIA_SEMANA: fila.eq(5).text(),
                EAN: fila.eq(6).text(),
                MATERIAL: fila.eq(7).text(),
                DESCRIPCION: fila.eq(8).text(),
                TIPO_PRODUCTO: fila.eq(9).text(),
                NIT_PROVEEDOR: fila.eq(10).text(),
                NOMBRE_PROVEEDOR: fila.eq(11).text(),
                GRUPO_ARTICULO: fila.eq(12).text(),
                CATEGORIA: fila.eq(13).text(),
                GRUPO_TERAPEUTICO: fila.eq(14).text(),
                SUBCATEGORIA: fila.eq(15).text(),
                PRINCIPIO_ACTIVO: fila.eq(16).text(),
                DESCUENTO_COMERCIAL: fila.eq(17).text(),
                SUBTOTAL: fila.eq(18).text(),
                IVA: fila.eq(19).text(),
                RT_FUENTE: fila.eq(20).text(),
                ICA: fila.eq(21).text(),
                R_IVA: fila.eq(22).text(),
                COSTOS_UND: fila.eq(23).text(),
                TOTAL_PAGAR: fila.eq(24).text(),
                ORGANIZACION: fila.eq(25).text(),
                CENTRO: fila.eq(26).text(),
                GRUPO_COMPRAS: fila.eq(27).text(),
                FAMILIA_PRODUCTO: fila.eq(28).text(),
                UNIDADES_BARCORDER: fila.eq(29).text(),
                VLR_BARCORDER: fila.eq(30).text(),
                USUARIO: $('#login_user').val(),
            };
            datos.push(data);
        });

        const result = await confirmAlert("Guardar datos", "Se guardarán los datos cargados... ¿Está seguro de seguir?");
        if (!result.isConfirmed) return;

        const resp = await enviarPeticion({
            op: "I_DATOS_COMPRAS",
            datos: JSON.stringify(datos),
            link: "../models/BusinessIntelligence.php"
        });

        limpiarVista();
        Swal.fire("Guardar datos", "Lo datos se guardaron correctamente", "success");

    } catch (error) {
        console.log(error);
    }
}

const guardarDatosPresupuestoCompras = async () => {
    try {
        const contenidoTabla = $("#tablaDatos tbody tr").length;
        if (contenidoTabla < 1) {
            Swal.fire("Guardar datos", "Debe cargar la información para guardar", "warning");
            return;
        }

        let datos = [];

        $("#tablaDatos tbody tr").each(function () {
            let fila = $(this).find("td");

            let data = {
                OFICINA_VENTAS: fila.eq(1).text(),
                FECHA: fila.eq(2).text(),
                DIA: fila.eq(3).text(),
                MES: fila.eq(4).text(),
                ANIO: fila.eq(5).text(),
                DIA_SEMANA: fila.eq(6).text(),
                EAN: fila.eq(7).text(),
                MATERIAL: fila.eq(8).text(),
                DESCRIPCION: fila.eq(9).text(),
                FAMILIA_PRODUCTO: fila.eq(10).text(),
                ESTADO_STATUS: fila.eq(11).text(),
                NIT_PROVEEDOR: fila.eq(12).text(),
                NOMBRE_PROVEEDOR: fila.eq(13).text(),
                GRUPO_ARTICULO: fila.eq(14).text(),
                CATEGORIA: fila.eq(15).text(),
                SUBCATEGORIA: fila.eq(16).text(),
                GRUPO_TERAPEUTICO: fila.eq(17).text(),
                PRINCIPIO_ACTIVO: fila.eq(18).text(),
                CLASIFICACION_ROTACION: fila.eq(19).text(),
                GRUPO_COMPRAS: fila.eq(20).text(),
                LIBRE_UTILIZACION: fila.eq(21).text(),
                VALOR_LIBRE_UTILIZACION: fila.eq(22).text(),
                PROMEDIO_ROTACION_UND: fila.eq(23).text(),
                PROMEDIO_ROTACION_VLR: fila.eq(24).text(),
                VENTA_DIARIA: fila.eq(25).text(),
                VENTA_OPTIMA: fila.eq(26).text(),
                VLR_PRESUPUESTO: fila.eq(27).text(),
                PROMEDIO_VTAS_EVENTOS: fila.eq(28).text(),
                PCJ_PARTIC_EVENTO: fila.eq(29).text(),
                PCJ_PARTIC_MERCADO: fila.eq(30).text(),
                ESTACIONALIDAD_TEMPORADA: fila.eq(31).text(),
                FRECUENCIA_TELEFERIAS: fila.eq(32).text(),
                FRECUENCIA_EVENTOS: fila.eq(33).text(),
                FRECUENCIA_COMPRAS: fila.eq(34).text(),
                PROMEDIO_IMPACTOS: fila.eq(35).text(),
                PROMEDIO_POBLACIONES: fila.eq(36).text(),
                ESTIMACION_DEMANDA: fila.eq(37).text(),
                TIPO_OFERTA: fila.eq(38).text(),
                USUARIO: $('#login_user').val(),
            };
            datos.push(data);
        });


        const result = await confirmAlert("Guardar datos", "Se guardarán los datos cargados... ¿Está seguro de seguir?");
        if (!result.isConfirmed) return;

        const resp = await enviarPeticion({
            op: "I_DATOS_PRESUPUESTO_COMPRAS",
            datos: JSON.stringify(datos),
            link: "../models/BusinessIntelligence.php"
        });

        limpiarVista();
        Swal.fire("Guardar datos", "Lo datos se guardaron correctamente", "success");

    } catch (error) {
        console.log(error);
    }
}

const guardarDatosPresupuestoVentas = async () => {
    try {
        const contenidoTabla = $("#tablaDatos tbody tr").length;
        if (contenidoTabla < 1) {
            Swal.fire("Guardar datos", "Debe cargar la información para guardar", "warning");
            return;
        }

        let datos = [];

        $("#tablaDatos tbody tr").each(function () {
            let fila = $(this).find("td");

            let data = {
                BODEGA: fila.eq(1).text(),
                ID_PRESUPUESTO: fila.eq(2).text(),
                FECHA_INICIAL: fila.eq(3).text(),
                FECHA_FINAL: fila.eq(4).text(),
                MES: fila.eq(5).text(),
                ANIO: fila.eq(6).text(),
                PRESUPUESTO_VALOR: fila.eq(7).text(),
                CUOTA_IMPACTOS: fila.eq(8).text(),
                CUOTA_REFERENCIAS: fila.eq(9).text(),
                CUOTA_VOLUMEN: fila.eq(10).text(),
                ID_TIPO_PPTO: fila.eq(11).text(),
                TIPO_PRESUPUESTO: fila.eq(12).text(),
                PERIOCIDAD: fila.eq(13).text(),
                NIT_CLIENTE: fila.eq(14).text(),
                TIPO_DOCUMENTO: fila.eq(15).text(),
                CODIGO_SAP: fila.eq(16).text(),
                NOMBRES_CLIENTE: fila.eq(17).text(),
                RAZON_COMERCIAL: fila.eq(18).text(),
                CIUDAD: fila.eq(19).text(),
                DEPARTAMENTO: fila.eq(20).text(),
                NIT_VENDEDOR: fila.eq(21).text(),
                CODIGO_SAP_VENDEDOR: fila.eq(22).text(),
                NOMBRE_VENDEDOR: fila.eq(23).text(),
                TELEVENDEDOR: fila.eq(24).text(),
                CODIGO_ZONA: fila.eq(25).text(),
                DESCRIPCION_ZONA: fila.eq(26).text(),
                GRUPO1: fila.eq(27).text(),
                GRUPO2: fila.eq(28).text(),
                NIT_LABORATORIO: fila.eq(29).text(),
                GRUPO_ARTICULO: fila.eq(30).text(),
                RAPELS: fila.eq(31).text(),
                NOMBRE_LABORATORIO: fila.eq(32).text(),
                CATEGORIA: fila.eq(33).text(),
                SUBCATEGORIA: fila.eq(34).text(),
                GRUPO_TERAPEUTICO: fila.eq(35).text(),
                PRINCIPIO_ACTIVO: fila.eq(36).text(),
                USUARIO: $('#login_user').val()
            };
            datos.push(data);
        });

        const result = await confirmAlert("Guardar datos", "Se guardarán los datos cargados... ¿Está seguro de seguir?");
        if (!result.isConfirmed) return;

        const resp = await enviarPeticion({
            op: "I_DATOS_PRESUPUESTO_VENTAS",
            datos: JSON.stringify(datos),
            link: "../models/BusinessIntelligence.php"
        });

        limpiarVista();
        Swal.fire("Guardar datos", "Lo datos se guardaron correctamente", "success");

    } catch (error) {
        console.log(error);
    }
}

const guardarDatosRebate = async () => {
    try {
        const contenidoTabla = $("#tablaDatos tbody tr").length;
        if (contenidoTabla < 1) {
            Swal.fire("Guardar datos", "Debe cargar la información para guardar", "warning");
            return;
        }

        let datos = [];

        $("#tablaDatos tbody tr").each(function () {
            let fila = $(this).find("td");

            let data = {
                BODEGA: fila.eq(1).text(),
                ID_PPTO_REBATE: fila.eq(2).text(),
                FECHA_INICIAL: fila.eq(3).text(),
                FECHA_FINAL: fila.eq(4).text(),
                MES: fila.eq(5).text(),
                ANIO: fila.eq(6).text(),
                PRESUPUESTO_VALOR: fila.eq(7).text(),
                CUOTA_IMPACTOS: fila.eq(8).text(),
                CUOTA_REFERENCIAS: fila.eq(9).text(),
                CUOTA_VOLUMEN: fila.eq(10).text(),
                ID_TIPO_REBATE: fila.eq(11).text(),
                TIPO_PRESUPUESTO_REBATE: fila.eq(12).text(),
                PERIOCIDAD: fila.eq(13).text(),
                PCJ_NOTA_GANAR: fila.eq(14).text(),
                NIT_CLIENTE: fila.eq(15).text(),
                TIPO_DOCUMENTO: fila.eq(16).text(),
                CODIGO_SAP: fila.eq(17).text(),
                NOMBRES_CLIENTE: fila.eq(18).text(),
                RAZON_COMERCIAL: fila.eq(19).text(),
                CIUDAD: fila.eq(20).text(),
                DEPARTAMENTO: fila.eq(21).text(),
                NIT_VENDEDOR: fila.eq(22).text(),
                CODIGO_SAP_VENDEDOR: fila.eq(23).text(),
                NOMBRE_VENDEDOR: fila.eq(24).text(),
                TELEVENDEDOR: fila.eq(25).text(),
                CODIGO_ZONA: fila.eq(26).text(),
                DESCRIPCION_ZONA: fila.eq(27).text(),
                GRUPO1: fila.eq(28).text(),
                GRUPO2: fila.eq(29).text(),
                NIT_LABORATORIO: fila.eq(30).text(),
                GRUPO_ARTICULO: fila.eq(31).text(),
                RAPELS: fila.eq(32).text(),
                NOMBRE_LABORATORIO: fila.eq(33).text(),
                CATEGORIA: fila.eq(34).text(),
                SUBCATEGORIA: fila.eq(35).text(),
                GRUPO_TERAPEUTICO: fila.eq(36).text(),
                PRINCIPIO_ACTIVO: fila.eq(37).text(),
                USUARIO: $('#login_user').val(),
            };
            datos.push(data);
        });

        const result = await confirmAlert("Guardar datos", "Se guardarán los datos cargados... ¿Está seguro de seguir?");
        if (!result.isConfirmed) return;

        const resp = await enviarPeticion({
            op: "I_DATOS_REBATE",
            datos: JSON.stringify(datos),
            link: "../models/BusinessIntelligence.php"
        });

        limpiarVista();
        Swal.fire("Guardar datos", "Lo datos se guardaron correctamente", "success");

    } catch (error) {
        console.log(error);
    }
}

const guardarDatosVentas = async () => {
    try {
        const contenidoTabla = $("#tablaDatos tbody tr").length;
        if (contenidoTabla < 1) {
            Swal.fire("Guardar datos", "Debe cargar la información para guardar", "warning");
            return;
        }

        let datos = [];

        $("#tablaDatos tbody tr").each(function () {
            let fila = $(this).find("td");

            let data = {
                BODEGA: fila.eq(1).text(),
                FECHA_VTA: fila.eq(2).text(),
                HORA_PEDIDO: fila.eq(3).text(),
                HORA_FACTURACION: fila.eq(4).text(),
                FECHA_DESPACHO: fila.eq(5).text(),
                ANIO: fila.eq(6).text(),
                MES: fila.eq(7).text(),
                DIA_SEMANA: fila.eq(8).text(),
                TIPO_DOCUMENTO: fila.eq(9).text(),
                NUMERO_DOCUMENTO: fila.eq(10).text(),
                DOCUMENTO_REFERENCIA: fila.eq(11).text(),
                MATERIAL: fila.eq(12).text(),
                DESCRIPCION_MATERIAL: fila.eq(13).text(),
                CODIGO_CUM: fila.eq(14).text(),
                TIPO_MATERIAL: fila.eq(15).text(),
                CANTIDAD: fila.eq(16).text(),
                COSTO_UNITARIO: fila.eq(17).text(),
                COSTO_TOTAL: fila.eq(18).text(),
                VALOR_UNITARIO: fila.eq(19).text(),
                TOTAL_VENTA_BRUTA: fila.eq(20).text(),
                PORCENTAJE_IVA: fila.eq(21).text(),
                VALOR_IVA: fila.eq(22).text(),
                DTO1: fila.eq(23).text(),
                DTO2: fila.eq(24).text(),
                DTO3: fila.eq(25).text(),
                VALOR_DCTO: fila.eq(26).text(),
                VALOR_DCTO_TOTAL: fila.eq(27).text(),
                VENTA_NETA: fila.eq(28).text(),
                VALOR_UTILIDAD: fila.eq(29).text(),
                MARGEN_UTILIDAD: fila.eq(30).text(),
                TIPO_VENTA: fila.eq(31).text(),
                LISTA_PRECIOS: fila.eq(32).text(),
                NIT_LABORATORIO: fila.eq(33).text(),
                GRUPO_ARTICULO: fila.eq(34).text(),
                RAPELS: fila.eq(35).text(),
                NOMBRE_LABORATORIO: fila.eq(36).text(),
                CATEGORIA: fila.eq(37).text(),
                SUBCATEGORIA: fila.eq(38).text(),
                GRUPO_TERAPEUTICO: fila.eq(39).text(),
                PRINCIPIO_ACTIVO: fila.eq(40).text(),
                NIT_REAL: fila.eq(41).text(),
                RESPONSABLE_PAGO: fila.eq(42).text(),
                CODIGO_SAP: fila.eq(43).text(),
                NOMBRE_CLIENTE: fila.eq(44).text(),
                RAZON_SOCIAL: fila.eq(45).text(),
                DIRECCION: fila.eq(46).text(),
                BARRIO: fila.eq(47).text(),
                TELEFONO: fila.eq(48).text(),
                ID_CIUDAD: fila.eq(49).text(),
                CIUDAD: fila.eq(50).text(),
                ID_DPTO: fila.eq(51).text(),
                DEPARTAMENTO: fila.eq(52).text(),
                LATITUD: fila.eq(53).text(),
                LONGITUD: fila.eq(54).text(),
                CODIGO_BRICKS: fila.eq(55).text(),
                USUARIO_FACT: fila.eq(56).text(),
                DESCRIPCION_USUARIO_FACT: fila.eq(57).text(),
                NIT_VENDEDOR: fila.eq(58).text(),
                CODIGO_SAP_VENDEDOR: fila.eq(59).text(),
                NOMBRE_VENDEDOR: fila.eq(60).text(),
                CODIGO_ZONA: fila.eq(61).text(),
                DESCRIPCION_ZONA: fila.eq(62).text(),
                CODIGO_TIPO: fila.eq(63).text(),
                TIPO_TERCERO: fila.eq(64).text(),
                CLASE_PEDIDO: fila.eq(65).text(),
                DESCRIPCION_CLASE_PEDIDO: fila.eq(66).text(),
                GRUPO_CLIENTES: fila.eq(67).text(),
                SUBGRUPO_CLIENTES: fila.eq(68).text(),
                USUARIO_PEDIDO: fila.eq(69).text(),
                EAN: fila.eq(70).text(),
                PLAN_REBATE: fila.eq(71).text(),
                PORCENTAJE_REBATE: fila.eq(72).text(),
                COORDINADOR_VENTAS: fila.eq(73).text(),
                USUARIO: $('#login_user').val()
            };
            datos.push(data);
        });

        const result = await confirmAlert("Guardar datos", "Se guardarán los datos cargados... ¿Está seguro de seguir?");
        if (!result.isConfirmed) return;

        const resp = await enviarPeticion({
            op: "I_DATOS_VENTAS",
            datos: JSON.stringify(datos),
            link: "../models/BusinessIntelligence.php"
        });

        limpiarVista();
        Swal.fire("Guardar datos", "Lo datos se guardaron correctamente", "success");

    } catch (error) {
        console.log(error);
    }
}

const limpiarVista = () => {
    $('#seleccionarTabla').val("");
    $('#archivo').val("");
    document.getElementById("tableBody").innerHTML = ``;
    document.getElementById("tableHeader").innerHTML = ``;
    document.getElementById("errorMessages").innerHTML = ``;
}

// EJECUCIÓN DE FUNCIONALIDADES
$(function () {
    $('#btnCargarDatos').click(async function () {
        await cargarDatos();
    });

    $('#btnInformacion').click(function () {
        mostrarInformacion();
    });

    $('#btnGuardarDatos').click(async () => {
        const tabla = $('#seleccionarTabla').val();
        const bandera = $('#campoBandera').val();   

        if (!tabla) {
            Swal.fire("Guardar datos", "No hay datos procesados para guardar", "warning");
            return;
        }

        if (parseInt(bandera) > 0) {
            Swal.fire("Guardar datos", "Hay errores en los datos... corregir antes de guardar", "warning");
            return;
        }

        if (tabla === "1") await guardarDatosConvenios();
        if (tabla === "2") await guardarDatosInventarios();
        if (tabla === "3") await guardarDatosCompras();
        if (tabla === "4") await guardarDatosPresupuestoCompras();
        if (tabla === "5") await guardarDatosPresupuestoVentas();
        if (tabla === "6") await guardarDatosRebate();
        if (tabla === "7") await guardarDatosVentas();
    });

    $('#archivo').click(() => {
        $(this).val("");
        document.getElementById("tableBody").innerHTML = ``;
        document.getElementById("tableHeader").innerHTML = ``;
        document.getElementById("errorMessages").innerHTML = ``;
    });

    $('#seleccionarTabla').change(() => {
        $('#archivo').val("");
        document.getElementById("tableBody").innerHTML = ``;
        document.getElementById("tableHeader").innerHTML = ``;
        document.getElementById("errorMessages").innerHTML = ``;
    });

    $('#btnLimpiarDatos').click(function () {
        limpiarVista();
    });
});