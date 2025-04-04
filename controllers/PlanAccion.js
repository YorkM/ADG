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
                            <input type="text" class="form-control accion" placeholder="Acciones concretas">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label>Fecha Inicio</label>
                            <input type="date" class="form-control fecha-inicio" placeholder="Fecha Inicio">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label>Fecha Final</label>
                            <input type="date" class="form-control fecha-final" placeholder="Fecha Final">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label>Responsable</label>
                            <input type="text" class="form-control responsable" placeholder="Responsable">
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

    const fechaInicio = document.querySelectorAll(".fecha-inicio");
    const fechaActual = new Date().toISOString().split("T")[0];
    fechaInicio.forEach(item => {
        item.min = fechaActual;
    });

    const fechaFinal = document.querySelectorAll(".fecha-final");
    fechaFinal.forEach(item => {
        item.min = fechaActual;
    });
}

const getPlanesAccion = async () => {
    try {
        const fechaDesde = $('#desde').val();
        const fechaHasta = $('#hasta').val();
        $('#contenedorTablaPlanes').html(``);

        const { data } = await enviarPeticion({
            op: "G_PLANES_ACCION",
            link: "../models/PlanAccion.php",
            fechaDesde,
            fechaHasta
        });

        let tabla = `
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
                        <td class="align-tds">${item.OBJETIVOS.toUpperCase()}</td>
                        <td class="align-tds">${item.CAUSA_RAIZ.toUpperCase()}</td>
                        <td class="align-tds">${item.INDICADOR.toUpperCase()}</td>
                        <td class="text-center">
                            <button class="btn btn-primary btn-sm btn-accion" data-item="${item.ID}">
                                <i class="fa-solid fa-circle-plus 2xl"></i>
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
        } else $('#contenedorTablaPlanes').html(`
                <p style="text-align: center; font-size: x-large;">
                    No hay planes disponibles para las fechas seleccionadas
                </p>`);
    } catch (error) {
        console.log(error);
    }
}

const getDiasMes = async () => {
    const resp = await enviarPeticion({ 
        op: "G_DIAS_MES", 
        link: "../models/PlanAccion.php" 
    });

    if (resp[0].DIAS_MES === "TRUE") {
        $('#alert1').removeClass('d-flex').addClass('d-none');
        $('#alert2').removeClass('d-flex').addClass('d-none');
    } else {
        $('#alert1').addClass('d-flex').removeClass('d-none');
        $('#alert2').addClass('d-flex').removeClass('d-none');
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
                    <tr>
                        <td style="background-color: #E9EFEC; font-weight: 500">${item.ACCIONES.toUpperCase()}</td>
                        <td style="background-color: #E9EFEC; font-weight: 500">${item.FECHA_INICIO}</td>
                        <td style="background-color: #E9EFEC; font-weight: 500">${item.FECHA_FINAL}</td>
                        <td style="background-color: #E9EFEC; font-weight: 500">${item.RESPONSABLE.toUpperCase()}</td>
                    </tr>                    
                    <tr data-id="${item.ID}">
                        <td>
                            <div class="form-group mt-2 m-none">
                                <label class="bg-label" for="indice-${item.ID}">Índice</label>
                                <input type="text" id="indice-${item.ID}" class="form-control w-input" 
                                    value="${item.INDICE}" placeholder="Índice de acción concreta">
                            </div>                           
                        </td>                       
                        <td>                           
                            <div class="form-group mt-2 m-none">
                                <label class="bg-label" for="avance-${item.ID}">Avance</label>
                                <input type="text" id="avance-${item.ID}" class="form-control w-input" 
                                    value="${item.AVANCE}" placeholder="Avance">
                            </div>                            
                        </td>                       
                        <td>                           
                            <div class="form-group mt-2 m-none">
                                <label class="bg-label" for="resultado-${item.ID}">Resultado</label>
                                <input type="text" id="resultado-${item.ID}" class="form-control w-input" 
                                    value="${item.RESULTADOS}" placeholder="Resultado">
                            </div>                           
                        </td>                       
                        <td>                           
                             <div class="form-group mt-2 m-none">
                                <label class="bg-label" for="estado-${item.ID}">Estado</label>
                                <input type="text" id="estado-${item.ID}" class="form-control w-input" 
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
    const rows = document.querySelectorAll('tr[data-id]');
    const datos = [];
    let hayErrores = false;

    const resp = await enviarPeticion({ op: "G_DIAS_MES", link: "../models/PlanAccion.php" });
    if (resp[0].DIAS_MES === "FALSE") {
        Swal.fire(
            "Guardar acciones", 
            "Ya pasaron los primeros 5 días del mes... Por lo tanto no es posible realizar esta acción", 
            "warning");
        return;
    }

    rows.forEach(row => {
        const id = row.getAttribute('data-id');
        const indice = document.querySelector(`#indice-${id}`)?.value.trim();
        const avance = document.querySelector(`#avance-${id}`)?.value.trim();
        const resultado = document.querySelector(`#resultado-${id}`)?.value.trim();
        const estado = document.querySelector(`#estado-${id}`)?.value.trim();

        if (!indice || !avance || !resultado || !estado) {
            hayErrores = true;
            // row.style.backgroundColor = '#F95454';
        } else {
            row.style.backgroundColor = '';
            datos.push({
                id,
                indice,
                avance,
                resultado: resultado.toUpperCase(),
                estado: estado.toUpperCase(),
                usuario
            });
        }
    });

    if (hayErrores) {
        Swal.fire(
            "Guardar acciones", 
            "Se deben diligenciar todos los campos antes de guardar", 
            "error");
    } else {
        const result = await confirmAlert(
            "Guardar acciones", 
            "Se guardarán los datos ingresados en cada campo... ¿Se verificarón los datos antes de guardar?");
        if (!result.isConfirmed) return;

        const { ok } = await enviarPeticion({ 
            op: "U_DETALLE_PLAN", 
            link: "../models/PlanAccion.php", 
            datos: JSON.stringify(datos) });

        if (ok) {
            setTimeout(() => {
                Swal.fire(
                    "Guardar acciones", 
                    "Se guardaron las acciones correctamente", 
                    "success");
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
            Swal.fire(
                "Guardar plan de acción", 
                "Ya pasaron los primeros 5 días del mes... Por lo tanto no es posible realizar esta acción", 
                "warning");
            return;
        }

        const camposVacios = data.some(obj =>
            Object.values(obj).some(valor => valor === "" || valor === null || valor === undefined)
        );

        if (camposVacios) {
            setTimeout(() => {
                Swal.fire(
                    "Guardar plan de acción", 
                    "Se deben diligenciar todos los campos de formulario", 
                    "error");
            }, 100);
            return;
        }

        const allAccion = document.querySelectorAll('.accion');
        const allFechaIni = document.querySelectorAll('.fecha-inicio');
        const allFechaFin = document.querySelectorAll('.fecha-final');
        const allResponsables = document.querySelectorAll('.responsable');

        if (!allAccion.length) {
            Swal.fire(
                "Guardar plan de acciones", 
                "No hay acciones asociadas al plan... Se debe agregar al menos una", 
                "error");
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
                    accion: accion.toUpperCase(),
                    fechaInicio,
                    fechaFinal,
                    responsable: responsable.toUpperCase()
                });
            }
        });

        if (planArray.length === 0) {
            Swal.fire(
                "Guardar plan de acción", 
                "Todos los campos de las acciones son obligatorios", 
                "error");
            return;
        }

        const result = await confirmAlert(
            "Guardar plan de acción", 
            "Se guardarán los datos del plan de acción... ¿Se verificaron correctamente los datos?");
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
                Swal.fire(
                    "Guardar plan de acción", 
                    "Se guardaron los datos del plan de acción correctamente", 
                    "success");
            }, 100);
            $('#formulario').trigger('reset');
            $('#contenedorAcciones').html(``);
        }

        await getPlanesAccion();

    } catch (error) {
        console.log(error);
    }
}

const filtrar = (filtro) => {    
    const filas = document.querySelectorAll('#tablaDatos tbody tr');

    filas.forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        const coincide = Array.from(celdas).some(td => td.textContent.toLowerCase().includes(filtro));

        fila.style.display = coincide ? '' : 'none';
    });
}

// EJECUCIÓN DE FUNCIONALIDADES
$(function () {
    const fechaActual = new Date().toISOString().split('T')[0];
    document.querySelector('#desde').value = fechaActual;
    document.querySelector('#hasta').value = fechaActual;

    $('#desde, #hasta').change(function () {
        getPlanesAccion();
    });

    $('#buscar').keyup(function () {
        const filtro = this.value.toLowerCase();
        filtrar(filtro);
    });


    getDiasMes();

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