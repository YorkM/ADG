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

const agregarAcciones = () => {
    const contenedor = document.getElementById("contenedorAcciones");
    const nuevoCampo = `
        <div class="row justify-content-center align-items-center mt-2 py-2" style="background-color: whitesmoke;">
            <div class="col-md-10">
                <div class="row">
                    <div class="col">
                        <input type="text" class="form-control form-control-sm accion" placeholder="Acción">
                    </div>
                    <div class="col">
                        <input type="date" class="form-control form-control-sm fecha-inicio" placeholder="Fecha Inicio">
                    </div>
                    <div class="col">
                        <input type="date" class="form-control form-control-sm fecha-final" placeholder="Fecha Final">
                    </div>
                    <div class="col">
                        <input type="text" class="form-control form-control-sm responsable" placeholder="Responsable">
                    </div>
                </div>
            </div>
            <div class="col-md-2 text-center">
                <button class="btn btn-outline-danger btn-sm btn-eliminar" onclick="this.parentElement.parentElement.remove()">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        </div>`;
    contenedor.insertAdjacentHTML("beforeend", nuevoCampo);
}

const getPlanesAccion = async () => {
    try {
        $('#contenedorTablaPlanes').html(``);

        const { data } = await enviarPeticion({ op: "G_PLANES_ACCION", link: "../models/PlanAccion.php" });

        let tabla = `
             <h2 class="text-center mt-2 mb-4" style="color: #055160; font-weight: 400;">Listado plan mensual de acciones</h2>
             <table id="tablaDatos" class="table table-sm table-bordered table-hover" style="width: 100%;">
                <thead class="table-info">
                    <tr>
                        <th>Proceso</th>
                        <th>Periodo</th>
                        <th>Meta %</th>
                        <th>Rango Inicial %</th>
                        <th>Rango Final %</th>
                        <th>Objetivos</th>
                        <th>Causa Raíz</th>
                        <th>Indicador</th>
                        <th class="text-center">Acción</th>
                    </tr>
                </thead>
                <tbody id="tableBody">`;

        if (data.length) {
            data.forEach(item => {
                tabla += `
                    <tr>
                        <td class="align-tds">${item.PROCESO}</td>
                        <td class="align-tds">${item.PERIODO}</td>
                        <td class="align-tds">${item.META}</td>
                        <td class="align-tds">${item.RANGO_INICIAL}</td>
                        <td class="align-tds">${item.RANGO_FINAL}</td>
                        <td class="align-tds">${item.OBJETIVOS}</td>
                        <td class="align-tds">${item.CAUSA_RAIZ}</td>
                        <td class="align-tds">${item.INDICADOR}</td>
                        <td class="text-center">
                            <button class="btn-accion-style btn-accion" data-item="${item.ID}">
                                <i class="fa-solid fa-circle-plus"></i>
                            </button>
                        </td>
                    </tr>`;
            });

            tabla += `
                </tbody>
            </table>`;

            $('#contenedorTablaPlanes').html(tabla);
            $('#tablaDatos').on('click', '.btn-accion', async function () {
                const id = $(this).attr('data-item');
                $('#idPlan').val(id);
                await getDetallePlanesAccion(id);
                $('#modalPlanes').modal('show');
            });
        }
    } catch (error) {
        console.log(error);
    }
}

const getDetallePlanesAccion = async (id) => {
    try {
        $('#tablaDetallePlan').html(``);

        const { data } = await enviarPeticion({ op: "G_DETALLES_PLANES_ACCION", link: "../models/PlanAccion.php", id });

        let tabla = `
             <table id="tablaDatosDetalle" class="table table-sm table-bordered table-hover" style="width: 100%;">
                <thead class="table-info">
                    <tr>
                        <th>Acciones</th>
                        <th>Fecha inicio</th>
                        <th>Fecha final</th>
                        <th>Responsable</th>
                    </tr>
                </thead>
                <tbody id="tableBody">`;

        if (data.length) {
            data.forEach(item => {
                tabla += `
                    <tr data-id="${item.ID}">
                        <td>
                            <p style="display: inline; width: 50%; color: #055160;">${item.ACCIONES}</p>
                            <input type="text" class="form-control form-control-sm w-input" value="${item.INDICE}" id="" placeholder="Indice">
                        </td>
                        <td>
                            <p style="display: inline; width: 50%; color: #055160;">${item.FECHA_INICIO}</p>
                            <input type="text" class="form-control form-control-sm w-input" value="${item.AVANCE}" id="" placeholder="Avance">
                        </td>
                        <td>
                            <p style="display: inline; width: 50%; color: #055160;">${item.FECHA_FINAL}</p>
                            <input type="text" class="form-control form-control-sm w-input" value="${item.RESULTADOS}" id="" placeholder="Resultado">
                        </td>
                        <td>
                            <p style="display: inline; width: 50%; color: #055160;">${item.RESPONSABLE}</p>
                            <input type="text" class="form-control form-control-sm w-input" value="${item.ESTADO}" id="" placeholder="Estado">
                        </td>
                    </tr>`;
            });

            tabla += `
                </tbody>
            </table>`;

            $('#tablaDetallePlan').html(tabla);
        }
    } catch (error) {
        console.log(error);
    }
}

const guardarAcciones = async () => {
    const idPlan = $('#idPlan').val();
    let filasValidas = true;
    let datosCapturados = [];

    $('#tablaDatosDetalle tbody tr').each(function () {
        let id = $(this).data('id');
        let inputs = $(this).find('input');

        let filaData = {
            id: id,
            indice: inputs.eq(0).val().trim(),
            avance: inputs.eq(1).val().trim(),
            resultado: inputs.eq(2).val().trim(),
            estado: inputs.eq(3).val().trim()
        };

        let filaValida = Object.values(filaData).every(valor => valor !== "");

        if (!filaValida) {
            filasValidas = false;
            $(this).addClass('error');
        } else {
            $(this).removeClass('error');
        }

        datosCapturados.push(filaData);
    });

    if (!filasValidas) {
        Swal.fire("Guardar acciones", "Hay campos vacíos en la tabla. Completa todos los campos antes de guardar", "error");
    } else {
        const { ok } = await enviarPeticion({ op: "U_DETALLE_PLAN", link: "../models/PlanAccion.php", datos: JSON.stringify(datosCapturados) });
        if (ok) {
            setTimeout(() => {
                Swal.fire("Guardar acciones", "Se guardaron las acciones correctamente", "success");
            }, 100);
            await getDetallePlanesAccion(idPlan);
        }
    }
}

const guardarPlanAccion = async () => {
    try {
        const result = await confirmAlert("Guardar plan de acción", "Se guardarán los datos del plan de acción... ¿Se verificaron correctamente los datos?");
        if (!result.isConfirmed) return;

        const usuario = $('#usuario_ses').val();
        const data = $("#formulario").serializeArrayAll();
        const dataRequest = formatearArrayRequest(data);
        dataRequest.USUARIO = usuario;
        dataRequest.op = "I_PLAN_ACCION";
        dataRequest.link = "../models/PlanAccion.php";

        const allAccion = document.querySelectorAll('.accion');
        const allFechaIni = document.querySelectorAll('.fecha-inicio');
        const allFechaFin = document.querySelectorAll('.fecha-final');
        const allResponsables = document.querySelectorAll('.responsable');

        $('#formulario').trigger('reset');
        $('#contenedorAcciones').html(``);

        showLoadingSwalAlert2("Guardando los datos...", false, true);

        const { id, ok } = await enviarPeticion(dataRequest);
        console.log(id);

        let planArray = [];

        if (ok) {
            allAccion.forEach((item, index) => {
                planArray.push({
                    idPlan: id,
                    accion: item.value,
                    fechaInicio: allFechaIni[index]?.value || "",
                    fechaFinal: allFechaFin[index]?.value || "",
                    responsable: allResponsables[index]?.value || ""
                });
            });

            const { ok } = await enviarPeticion({ op: "I_DETALLE_PLAN_ACCION", link: "../models/PlanAccion.php", planArray: JSON.stringify(planArray) });
            if (ok) {
                setTimeout(() => {
                    Swal.fire("Guardar plan de acción", "Se guardaron los datos del plan de acción correctamente", "success");
                }, 100);
            }
            await getPlanesAccion();
        }

    } catch (error) {
        console.log(error);
    } finally {
        dissminSwal();
    }
}

// EJECUCIÓN DE FUNCIONALIDADES
$(function () {
    getPlanesAccion();

    $("#meta, #rangoIni, #rangoFin").on("input", function () {
        this.value = this.value.replace(/\D/g, "");
    });

    $('#btnAgregarAcciones').click(function () {
        agregarAcciones();
    });

    $('#btnGuardarPlan').click(async function () {
        await guardarPlanAccion();
    });

    $('#guardarAcciones').click(async function () {
        await guardarAcciones();
    });
});