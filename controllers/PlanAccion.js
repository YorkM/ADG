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

const getProcesos = async () => {
    try {
        const resp = await enviarPeticion({ op: "G_PROCESOS", link: "../models/PlanAccion.php" });
        let elements = `<option value="">Seleccione un Proceso</option>`;
        if (resp.length) {
            resp.forEach(elem => {
                elements += `<option value="${elem.PROCESO.trim()}">${elem.PROCESO}</option>`;
            });
        }
        $("#proceso").html(elements);
    } catch (error) {
        console.log(error);
    }
}  

const agregarAcciones = () => {
    const contenedor = document.getElementById("contenedorAcciones");
    const nuevoCampo = `
        <div class="row justify-content-center align-items-center mt-2 py-2" style="background-color: whitesmoke;">
            <div class="col-md-10">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label>Acciones concretas</label>
                            <input type="text" class="form-control form-control-sm accion" placeholder="Acciones concretas">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label>Fecha Inicio</label>
                            <input type="date" class="form-control form-control-sm validar fecha-inicio" placeholder="Fecha Inicio">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label>Fecha Final</label>
                            <input type="date" class="form-control form-control-sm fecha-final" placeholder="Fecha Final">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label>Responsable</label>
                            <input type="text" class="form-control form-control-sm responsable" placeholder="Responsable">
                        </div>
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

    const fechaInicio = document.querySelectorAll(".validar");
    const fechaActual = new Date().toISOString().split("T")[0];
    fechaInicio.forEach(item => {
        item.min = fechaActual;
    });
    
    // .min = fechaActual;   
}

const getPlanesAccion = async () => {
    try {
        $('#contenedorTablaPlanes').html(``);

        const { data } = await enviarPeticion({ op: "G_PLANES_ACCION", link: "../models/PlanAccion.php" });

        let tabla = `
             <h3 class="text-center mt-2 mb-4" style="color: #055160; font-weight: 400;">Listado plan mensual de acciones</h3>
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
        } else $('#contenedorTablaPlanes').html(`<p style="text-align: center; font-size: x-large;">No hay planes disponibles</p>`);
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
                            <p class="text-primary font-weight-bold">${item.ACCIONES}</p>
                            <div class="form-group mt-2">
                                <label class="bg-label" for="indice-${item.ID}">Índice</label>
                                <input type="text" id="indice-${item.ID}" class="form-control form-control-sm w-input" 
                                    value="${item.INDICE}" placeholder="Índice de acción concreta">
                            </div>
                        </td>

                        <td>
                            <p class="text-primary font-weight-bold">${item.FECHA_INICIO}</p>
                            <div class="form-group mt-2">
                                <label class="bg-label" for="avance-${item.ID}">Avance</label>
                                <input type="text" id="avance-${item.ID}" class="form-control form-control-sm w-input" 
                                    value="${item.AVANCE}" placeholder="Avance">
                            </div>
                        </td>

                        <td>
                            <p class="text-primary font-weight-bold">${item.FECHA_FINAL}</p>
                            <div class="form-group mt-2">
                                <label class="bg-label" for="resultado-${item.ID}">Resultado</label>
                                <input type="text" id="resultado-${item.ID}" class="form-control form-control-sm w-input" 
                                    value="${item.RESULTADOS}" placeholder="Resultado">
                            </div>
                        </td>

                        <td>
                            <p class="text-primary font-weight-bold">${item.RESPONSABLE}</p>
                            <div class="form-group mt-2">
                                <label class="bg-label" for="estado-${item.ID}">Estado</label>
                                <input type="text" id="estado-${item.ID}" class="form-control form-control-sm w-input" 
                                    value="${item.ESTADO}" placeholder="Estado">
                            </div>
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
    const usuario = $('#usuario_ses').val();
    const idPlan = $('#idPlan').val();
    let filasValidas = true;
    let datosCapturados = [];
    
    const resp = await enviarPeticion({ op: "G_DIAS_MES", link: "../models/PlanAccion.php" });
    if (resp[0].DIAS_MES === "FALSE") {
        Swal.fire("Guardar acciones", "Ya pasaron los primeros 5 días del mes... Por lo tanto no es posible realizar esta acción", "warning");
        return;
    }

    $('#tablaDatosDetalle tbody tr').each(function () {
        let id = $(this).data('id');
        let inputs = $(this).find('input');

        let filaData = {
            id: id,
            indice: inputs.eq(0).val().trim(),
            avance: inputs.eq(1).val().trim(),
            resultado: inputs.eq(2).val().trim(),
            estado: inputs.eq(3).val().trim(),
            usuario
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
        Swal.fire("Guardar acciones", "Se deben diligenciar todos los campos antes de guardar", "error");
    } else {
        const result = await confirmAlert("Guardar acciones", "Se guardarán los datos ingresados en cada campo... ¿Se verificarón los datos antes de guardar?");
        if (!result.isConfirmed) return;

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
        const usuario = $('#usuario_ses').val();
        const organizacion = $('#org_ses').val();
        const data = $("#formulario").serializeArrayAll();
        const dataRequest = formatearArrayRequest(data);
        dataRequest.USUARIO = usuario;
        dataRequest.SOCIEDAD = organizacion;
        dataRequest.op = "I_PLAN_ACCION";
        dataRequest.link = "../models/PlanAccion.php";

        const resp = await enviarPeticion({ op: "G_DIAS_MES", link: "../models/PlanAccion.php" });
        if (resp[0].DIAS_MES === "FALSE") {
            Swal.fire("Guardar plan de acción", "Ya pasaron los primeros 5 días del mes... Por lo tanto no es posible realizar esta acción", "warning");
            return;
        }

        const camposVacios = data.some(obj =>
            Object.values(obj).some(valor => valor === "" || valor === null || valor === undefined)
        );

        if (camposVacios) {
            setTimeout(() => {
                Swal.fire("Guardar plan de acción", "Se deben diligenciar todos los campos de formulario", "error");
            }, 100);
            return;
        }

        const allAccion = document.querySelectorAll('.accion');
        const allFechaIni = document.querySelectorAll('.fecha-inicio');
        const allFechaFin = document.querySelectorAll('.fecha-final');
        const allResponsables = document.querySelectorAll('.responsable');

        if (!allAccion.length) {
            Swal.fire("Guardar plan de acciones", "No hay acciones asociadas al plan... Se debe agregar al menos una", "error");
            return;
        }        

        let planArray = [];

        allAccion.forEach((item, index) => {
            const accion = item.value?.trim() || "";
            const fechaInicio = allFechaIni[index]?.value?.trim() || "";
            const fechaFinal = allFechaFin[index]?.value?.trim() || "";
            const responsable = allResponsables[index]?.value?.trim() || "";

            if (accion && fechaInicio && fechaFinal && responsable) {
                planArray.push({
                    accion,
                    fechaInicio,
                    fechaFinal,
                    responsable
                });
            }
        });

        if (planArray.length === 0) {
            Swal.fire("Guardar plan de acción", "Todos los campos de las acciones son obligatorios", "error");
            return;
        }

        const result = await confirmAlert("Guardar plan de acción", "Se guardarán los datos del plan de acción... ¿Se verificaron correctamente los datos?");
        if (!result.isConfirmed) return;

        const { id, ok } = await enviarPeticion(dataRequest);
        if (ok) {
            planArray = planArray.map(item => {
                let objAcciones = {
                    accion: item.accion,
                    fechaInicio: item.fechaInicio,
                    fechaFinal: item.fechaFinal,
                    responsable: item.responsable,
                    idPlan: id
                }
                return objAcciones;
            });
        }

        const resp2 = await enviarPeticion({
            op: "I_DETALLE_PLAN_ACCION",
            link: "../models/PlanAccion.php",
            planArray: JSON.stringify(planArray)
        });

        if (resp2.ok) {
            setTimeout(() => {
                Swal.fire("Guardar plan de acción", "Se guardaron los datos del plan de acción correctamente", "success");
            }, 100);
            $('#formulario').trigger('reset');
            $('#contenedorAcciones').html(``);
        }

        await getPlanesAccion();

    } catch (error) {
        console.log(error);
    }
}

// EJECUCIÓN DE FUNCIONALIDADES
$(function () {    
    getProcesos();

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