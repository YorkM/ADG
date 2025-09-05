const idRol = parseInt($('#Rol').val());
// FUNCIÓN CONFIRM ACCIONES
const confirmAlert = async (title, text) => {
  const result = await Swal.fire({
    title: `${title}`,
    text: `${text}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
  });
  return result;
}
// TEMPLATES TDS AUTORIZACIONES
const templateTds = (item, sw) => `
<tr>
  <td class="size-14 vertical no-wrap">${item.LOG_ID}</td>
  <td class="size-14 vertical no-wrap">${item.MANDT}</td>
  <td class="size-14 vertical no-wrap">${item.KOSTL}</td>
  <td class="size-14 vertical no-wrap">${item.HKONT}</td>
  <td class="size-13 vertical no-wrap">${item.ESTADO}</td>
  <td class="size-14 vertical no-wrap">${item.ERDAT}</td>
  <td class="size-14 vertical no-wrap">${item.ERZET}</td>
  <td class="size-13 vertical no-wrap">${item.ERNAM}</td>
  <td class="size-14 vertical no-wrap">${item.BUKRS}</td>
  <td class="size-14 vertical no-wrap">${item.PRESUPUESTO}</td>
  <td class="size-14 vertical no-wrap">${item.EJECUTADO}</td>
  ${(sw === 1) && `<td class="text-center"><button class="btn btn-outline-primary btn-sm btn-actualizar" data-id="${item.LOG_ID}" 
  style="padding: 2px 6px;" title="Autorizar"><i class="fa-solid fa-pen-to-square"></i></button></td>`}
</tr>`;
// FUNCIÓN OBTENER AUTORIZACIONES PENDIENTES
const getAutorizacionesPendientes = async () => {
  try {
    const { data } = await enviarPeticion({ op: "G_AUTORIZACIONES_PENDIENTES", link: "../models/Autorizaciones.php" });

    if (data.length) {
      let elementos = ``;
      data.forEach(item => elementos += templateTds(item, 1));
      $('#tablaAutorizaciones tbody').html(elementos);
    } else {
      const msgHtml = `<td colspan="12" class="lead text-center">No hay datos disponibles</td>`;
      $('#tablaAutorizaciones tbody').html(msgHtml);
    }

    $('#tablaAutorizaciones').on('click', '.btn-actualizar', async function () {
      if (idRol === 1 || idRol === 73) {
        const idAutorizar = $(this).attr('data-id');
        const result = await confirmAlert("Autorizar Item", "¿Está seguro de autorizar el item?... Después de aceptar no se podrá reversar la acción");
        if (!result.isConfirmed) return;
  
        const resp = await enviarPeticion({ op: "U_AUTORIZACION", link: "../models/Autorizaciones.php", idAutorizar });
        if (resp.ok) {
          Swal.fire("Excelente", "El item ha sido autorizado correctamente", "success");
          getAutorizacionesPendientes();
          getAutorizaciones();
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}
// FUNCIÓN OBTENER AUTORIZACIONES
const getAutorizaciones = async () => {
  try {
    const { data } = await enviarPeticion({ op: "G_AUTORIZACIONES", link: "../models/Autorizaciones.php" });

    if (data.length) {
      let elementos = ``;
      data.forEach(item => elementos += templateTds(item, 2));
      $('#tablaAutorizaciones2 tbody').html(elementos);
    } else {
      const msgHtml = `<td colspan="11" class="lead text-center">No hay datos disponibles</td>`;
      $('#tablaAutorizaciones2 tbody').html(msgHtml);
    }

  } catch (error) {
    console.log(error);
  }
}

// EJECUCIÓN DE FUNCIONALIDADES
$(function () {
  getAutorizacionesPendientes();
  getAutorizaciones();
});