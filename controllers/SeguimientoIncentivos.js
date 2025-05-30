// FUNCIÓN CONFIRMAR ACCIONES
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
// FUNCIÓN LIMPIAR
const limpiar = () => {
    const oficinas = OficinasVentas('S');
    $("#oficina").html(oficinas);
    getGruposArticulos();
    $('#cuotaValores').val("");
    $('#cuotaImpactos').val("");
    $('#seguimiento').val("");
    seteoFechas();
}
// FUNCIÓN SETEO DE FECHAS ACTUALES
const seteoFechas = () => {
    $('#fechaInicial, #fechaFinal').datepicker({
        autoclose: true,
        multidate: false,
        changeMonth: true,
        changeYear: true,
        useCurrent: true,
        dateFormat: 'yy-mm-dd'
    }).datepicker("setDate", new Date());
}
// OBTENER LOS GRUPOS DE ARTICULOS
const getGruposArticulos = async () => {
    const resp = await enviarPeticion({
        op: "G_GRUPOS_ARTICULOS",
        link: "../models/SeguimientoIncentivos.php"
    });

    let grupos = `<option value="">0000 - TODOS</option>`;
    resp.data.forEach(item => {
        grupos += `<option value="${item.GRUPO_ARTICULO}">${item.GRUPO_ARTICULO} - ${item.DESCRIPCION1}</option>`;
    });
    $('#proveedor').html(grupos);
}
// FUNCIÓN GUARDAR DATOS BASE
const guardarDatosBase = async () => {
    const orgVentas = $('#numOrg').val();
    const oficinaVentas = $('#oficina').val();
    const proveedor = $('#proveedor').val().trim();
    const cuotaValor = $('#cuotaValores').val().replace(/^\$|\.|,/g, "");
    const cuotaImpactos = $('#cuotaImpactos').val();
    const tipoSeguimiento = $('#seguimiento').val();
    const fechaInicio = $('#fechaInicial').val();
    const fechaFinal = $('#fechaFinal').val();

    if (oficinaVentas === "2000" || !proveedor || !cuotaValor || !cuotaImpactos || !tipoSeguimiento) {
        Swal.fire("Campos requeridos", "Se deben diligenciar todos los campos para guardar", "error");
        return;
    }

    const result = await confirmAlert("Guardar Datos", "Se guardarán los datos diligenciados... ¿Han sido verificados y confirmados?");
    if (!result.isConfirmed) return;

    const resp = await enviarPeticion({
        op: "I_DATOS_BASE",
        link: "../models/SeguimientoIncentivos.php",
        orgVentas,
        oficinaVentas,
        proveedor,
        cuotaValor,
        cuotaImpactos,
        tipoSeguimiento,
        fechaInicio,
        fechaFinal
    });

    if (resp.ok) {
        Swal.fire("Guardar Datos", "Se guardaron los datos correctamente", "success");
        getDatosBase();
        limpiar();
    }
}
// FUNCIÓN PARA OBTENER LOS DATOS BASE
const getDatosBase = async () => {
    const organizacion = $('#numOrg').val();
    const resp = await enviarPeticion({
        op: "G_DATOS_BASE",
        link: "../models/SeguimientoIncentivos.php",
        organizacion
    });

    let elementos = ``;
    resp.data.forEach(item => {
        elementos += `
            <tr>
                <td class="custom-td-2">${item.ID}</td>
                <td class="custom-td">${item.OFICINA_VENTAS}</td>
                <td class="custom-td">${item.PROVEEDOR}</td>
                <td class="custom-td">${item.DESCRIPCION1}</td>
                <td class="custom-td-2">${formatNum(item.CUOTA_VALOR, "$")}</td>
                <td class="custom-td-2">${item.CUOTA_IMPACTOS}</td>
                <td class="custom-td">${item.TIPO_SEGUIMIENTO}</td>
                <td class="custom-td-2">${item.FECHA_INICIO}</td>
                <td class="custom-td-2">${item.FECHA_FINAL}</td>
                <td>
                    <button class="btn btn-success custom-btn seguimiento">
                        <i class="fa-solid fa-eye custom-fa"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-warning custom-btn editar">
                        <i class="fa-solid fa-pen-to-square custom-fa"></i>
                    </button>
                </td>              
            </tr>`;
    });
    $('#tablaIncentivos tbody').html(elementos);

    $('#tablaIncentivos').on('click', '.seguimiento', function () {
        const fila = $(this).closest('tr').find('td');
        const item = {
            organizacion: $('#numOrg').val(),
            idSeguimiento: fila.eq(0).text(),
            oficina: fila.eq(1).text(),
            grupoArticulo: fila.eq(2).text(),
            descProveedor: fila.eq(3).text(),
            cuota: fila.eq(4).text(),
            impacto: fila.eq(5).text(),
            tipoSeguimiento: fila.eq(6).text(),
            fechaInicio: fila.eq(7).text(),
            fechaFinal: fila.eq(8).text()
        }

        sessionStorage.ItemSeguimiento = JSON.stringify(item);

        gestionarSeguimiento(item);
    });
}
// FUNCIÓN PARA GESTIONAR SEGUIMIENTO
const gestionarSeguimiento = async (item) => {
    try {
        showLoadingSwalAlert2("Cargando los datos... Espere un momento", false, true);

        const { idSeguimiento, organizacion, oficina, grupoArticulo, descProveedor, cuota, impacto, tipoSeguimiento, fechaInicio, fechaFinal } = item;
        let zona = oficina.substring(0, 2);

        $('#seguimientoOculto').val(idSeguimiento);

        const resp = await enviarPeticion({
            op: "G_DATOS_SEGUIMIENTO",
            link: "../models/SeguimientoIncentivos.php",
            organizacion,
            zona,
            grupoArticulo,
            fechaInicio,
            fechaFinal
        });

        const cuotaLimpia = parseFloat(cuota.replace(/^\$|\.|,/g, ""));
        const cuotaActual = resp.data.reduce((acumulado, item) => acumulado + parseFloat(item.TOTAL_NETO_FACT), 0);
        const impactoActual = resp.data.reduce((acumulado, item) => acumulado + parseFloat(item.IMPACTOS), 0);
        const cantidadActual = resp.data.reduce((acumulado, item) => acumulado + parseFloat(item.CANTIDAD), 0);
        const difCuota = cuotaLimpia  - cuotaActual;
        const difImpacto = parseInt(impacto)  - impactoActual;
        const porcCuota = cuotaActual * 100 / cuotaLimpia;
        const porcImpacto = impactoActual * 100 / parseInt(impacto);
        
        $('#nav-profile-tab').attr('disabled', false);
        $('#nav-profile-tab-2').attr('disabled', false);
        $('#nav-profile-tab').click();

        $('#cuota').text(cuota);
        $('#cuotaActual').text(formatNum(cuotaActual, "$"));
        $('#difCuota').text(formatNum(difCuota, "$"));
        $('#porcCuota').text(porcCuota.toFixed(2) + "%");
        $('#impacto').text(impacto);
        $('#impactoActual').text(impactoActual);
        $('#porcImpacto').text(porcImpacto.toFixed(2) + "%");
        $('#difImpacto').text(difImpacto);

        let datosResumen = ``;
        resp.data.forEach(item => {
            datosResumen += `
                <tr>
                    <td class="custom-td-2">${item.ZONA_VENTAS}</td>
                    <td class="custom-td">${item.ZONA_DESCRIPCION}</td>
                    <td class="custom-td-2">${item.CANTIDAD}</td>
                    <td class="custom-td-2">${formatNum(item.TOTAL_NETO_FACT, "$")}</td>
                    <td class="custom-td-2">${item.IMPACTOS}</td>
                </tr>`;
        });
        $('#tablaResumen tbody').html(datosResumen);
        $('#totalResumen').text(formatNum(cuotaActual, "$"));
        $('#totalImpactos').text(impactoActual);
        $('#totalCantidad').text(cantidadActual);
        $('#descProveedor').text(descProveedor);

        $('#contenedorTablaLiquidacion').html(``);
        $('#contenedorTablaLiquidacionZonas').html(``);
        $('#numeroNota').val("");
        $('#valorNota').val("");

        const resp2 = await enviarPeticion({
            op: "G_DATOS_NOTAS",
            link: "../models/SeguimientoIncentivos.php",
            idSeguimiento
        });

        const { NUMERO_NOTA, VALOR_NOTA } = resp2.data[0];

        if (NUMERO_NOTA !== "0" || VALOR_NOTA !== "0") {
            $('#numeroNota').val(NUMERO_NOTA);
            $('#valorNota').val(formatNum(VALOR_NOTA, "$"));

            const liquidacG = (parseFloat(VALOR_NOTA) * 88) / 100;
            const mercadeo  = (parseFloat(VALOR_NOTA) * 5) / 100;
            const gerenciaC = (parseFloat(VALOR_NOTA) * 3) / 100;
            const coordCome = (parseFloat(VALOR_NOTA) * 2) / 100;
            const coordCont = (parseFloat(VALOR_NOTA) * 2) / 100;

            const tablaLiquidacion = `
                <table class="table table-bordered table-sm mx-auto" id="tablaLiquidacion" style="width: 100%;">
                    <thead class="table-info">
                        <tr>
                            <th>Valor Nota</th>
                            <th>Número Nota</th>
                            <th>Liquidación FDV (88%)</th>                            
                            <th>Mercadeo (5%)</th>
                            <th>Gerencia Comercial (3%)</th>
                            <th>Coordinador Contact Center (2%)</th>
                            <th>Coordinador Comercial (2%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${formatNum(VALOR_NOTA, "$")}</td>
                            <td>${NUMERO_NOTA}</td>
                            <td>${formatNum(Math.round(liquidacG), "$")}</td>
                            <td>${formatNum(Math.round(mercadeo), "$")}</td>
                            <td>${formatNum(Math.round(gerenciaC), "$")}</td>
                            <td>${formatNum(Math.round(coordCont), "$")}</td>
                            <td>${formatNum(Math.round(coordCome), "$")}</td>
                        </tr>
                    </tbody>                       
                </table>`;
            $('#contenedorTablaLiquidacion').html(tablaLiquidacion);

            let tablaLiquidacionZonas = `
                <table class="table table-bordered table-sm mx-auto" id="tablaLiquidacionZonas" style="width: 100%;">
                    <thead class="table-info">
                        <tr>
                            <th>Zona</th>
                            <th>Valores</th>
                            <th>% Liquidación</th>                            
                            <th>Valor Zona</th>
                            <th>Valor Cada Uno</th>
                        </tr>
                    </thead>
                    <tbody>`;

            if (tipoSeguimiento === "VALOR NETO") {
                resp.data.forEach(item => {
                    const porcentajeVenta = (parseInt(item.CANTIDAD) / parseInt(impacto)) * 100;
                    const incentivoZona = (liquidacG * porcentajeVenta) / 100;
                    const valorCadaVendedor = incentivoZona / 2;
                    
                    tablaLiquidacionZonas += `
                            <tr>
                                <td class="custom-td">${item.ZONA_VENTAS} - ${item.ZONA_DESCRIPCION}</td>
                                <td class="custom-td-2">${formatNum(item.TOTAL_NETO_FACT, "$")}</td>
                                <td class="custom-td-2">${porcentajeVenta.toFixed(2)}%</td>
                                <td class="custom-td-2">${formatNum(Math.round(incentivoZona), "$")}</td>
                                <td class="custom-td-2">${formatNum(Math.round(valorCadaVendedor), "$")}</td>
                            </tr>`;                
                });
                tablaLiquidacionZonas += `
                        </tbody>                       
                    </table>`;
                $('#contenedorTablaLiquidacionZonas').html(tablaLiquidacionZonas);
            } else {
                resp.data.forEach(item => {
                    const porcentajeVenta = (parseFloat(item.TOTAL_NETO_FACT) / cuotaLimpia) * 100;
                    const incentivoZona = (liquidacG * porcentajeVenta) / 100;
                    const valorCadaVendedor = incentivoZona / 2;
                    
                    tablaLiquidacionZonas += `
                            <tr>
                                <td class="custom-td">${item.ZONA_VENTAS} - ${item.ZONA_DESCRIPCION}</td>
                                <td class="custom-td-2">${item.CANTIDAD}</td>
                                <td class="custom-td-2">${porcentajeVenta.toFixed(2)}%</td>
                                <td class="custom-td-2">${formatNum(Math.round(incentivoZona), "$")}</td>
                                <td class="custom-td-2">${formatNum(Math.round(valorCadaVendedor), "$")}</td>
                            </tr>`;                
                });
                tablaLiquidacionZonas += `
                        </tbody>                       
                    </table>`;
                $('#contenedorTablaLiquidacionZonas').html(tablaLiquidacionZonas);
            }
        } else {
            const texto = `<p class="lead text-center">Liquidación no disponible, aún no se fija el valor de la nota!!!</p>`;
            $('#contenedorTablaLiquidacion').html(texto);
        }
    
    } catch (error) {
        console.error(error);
    } finally {
        dissminSwal();
    }
}
// FUNCIÓN PARA GESTONAR DATOS DE LA NOTA
const gestionarDatosNota = async () => {
    const idSeguimiento = $('#seguimientoOculto').val();
    const numeroNota = $('#numeroNota').val();
    const valorNota = $('#valorNota').val().replace(/^\$|\.|,/g, "");
    
    const item = JSON.parse(sessionStorage.ItemSeguimiento);

    if (!numeroNota || !valorNota) {
        Swal.fire("Campos requeridos", "Se debe diligenciar el número y valor de la nota", "error");
        return;
    }   

    const resp = await enviarPeticion({
        op: "G_DATOS_NOTAS", 
        link: "../models/SeguimientoIncentivos.php", 
        idSeguimiento
    });

    const { NUMERO_NOTA, VALOR_NOTA } = resp.data[0];

    if (NUMERO_NOTA === "0" || VALOR_NOTA === "0") {
        const result = await confirmAlert("Asignar Datos Nota", "Se asignará al seguimiento los datos relacionados a la nota");
        if (!result.isConfirmed) return;

        const confirmUpdate = await enviarPeticion({
            op: "U_DATOS_NOTA", 
            link: "../models/SeguimientoIncentivos.php",
            idSeguimiento,
            numeroNota,
            valorNota
        });
        if (confirmUpdate.ok) {
            $('#numeroNota').val("");
            $('#valorNota').val("");            
            Swal.fire("Asignar Datos Nota", "Se asignaron los datos de la nota correctamente", "success");
            gestionarSeguimiento(item);
        }
    } else {
        const result = await confirmAlert("Actualizar Datos Nota", "Ya existe número y valor de la nota, ¿Está seguro(a) de realizar el cambio de los datos asignados?");
        if (!result.isConfirmed) return;

        const confirmUpdate = await enviarPeticion({
            op: "U_DATOS_NOTA", 
            link: "../models/SeguimientoIncentivos.php",
            idSeguimiento,
            numeroNota,
            valorNota
        });
        if (confirmUpdate.ok) {
            $('#numeroNota').val("");
            $('#valorNota').val("");            
            Swal.fire("Actualizar Datos Nota", "Se actualizaron los datos de la nota correctamente", "success");
            gestionarSeguimiento(item);
        }
    }
}

// EJECUCIÓN DE FUNCIONALIDADES
$(function () {
    getDatosBase();

    setTimeout(() => {
        $("#oficina, #proveedor").select2();
    }, 500);

    const oficinas = OficinasVentas('S');
    $("#oficina").html(oficinas);

    seteoFechas();

    getGruposArticulos();

    $('#cuotaValores, #valorNota').on('input', function () {
        let value = $(this).val().replace(/[^0-9]/g, '');
        if (value) value = parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 0 });
        if (value) $(this).val("$" + value);
        else $(this).val("");
    });

    $("#cuotaImpactos, #numeroNota").on("input", function () {
        this.value = this.value.replace(/\D/g, "");
    });

    $('#nav-profile-tab').attr('disabled', true);
    $('#nav-profile-tab-2').attr('disabled', true);

    $('#guardarDatos').click(function () {
        guardarDatosBase();
    });

    $('#guardarNota').click(function () {
        gestionarDatosNota();
    });
});