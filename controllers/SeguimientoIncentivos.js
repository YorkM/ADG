const getZonasVentas = async () => {
  const resp = await enviarPeticion({
    op: "G_ZONAS_VENTAS",
    link: "../models/SeguimientoVisitas.php"
  });

  let zonas = `<option value="0">000000 - TODAS</option>`;
  let filtro = $('#oficina').val();

  let zona = filtro.substring(0, 2);
  let zonasFiltradas = '';

  if (zona == 10 || zona == 20) zonasFiltradas = resp.filter(item => item.ZONA_VENTAS.substring(0, 1) === filtro.substring(0, 1));
  else zonasFiltradas = resp.filter(item => item.ZONA_VENTAS.substring(0, 2) === filtro.substring(0, 2));

  zonasFiltradas.forEach(item => {
    zonas += `<option value="${item.ZONA_VENTAS}">${item.ZONA_VENTAS} - ${item.ZONA_DESCRIPCION}</option>`;
  });

  $('#zonaVentas').html(zonas);
}

const filtarZonasVentas = async (filtro) => {
    const resp = await enviarPeticion({
        op: "G_ZONAS_VENTAS",
        link: "../models/SeguimientoVisitas.php"
    });

    let zona = filtro.substring(0, 2);
    let zonasFiltradas = '';

    if (zona == 10 || zona == 20) zonasFiltradas = resp.filter(item => item.ZONA_VENTAS.substring(0, 1) === filtro.substring(0, 1));
    else zonasFiltradas = resp.filter(item => item.ZONA_VENTAS.substring(0, 2) === filtro.substring(0, 2));

    let zonas = `<option value="0">000000 - TODAS</option>`;

    zonasFiltradas.forEach(item => {
        zonas += `<option value="${item.ZONA_VENTAS}">${item.ZONA_VENTAS} - ${item.ZONA_DESCRIPCION}</option>`;
    });

    $('#zonaVentas').html(zonas);
}

const getGruposArticulos = async () => {
    const resp = await enviarPeticion({
        op: "G_GRUPOS_ARTICULOS",
        link: "../models/SeguimientoIncentivos.php"
    });  

    let grupos = `<option value="0">000000 - TODOS</option>`;

    resp.data.forEach(item => {
        grupos += `<option value="${item.GRUPO_ARTICULO}">${item.GRUPO_ARTICULO} - ${item.DESCRIPCION1}</option>`;
    });

    $('#proveedor').html(grupos);
}

// EJECUCIÓN DE FUNCIONALIDADES
$(function () {
    setTimeout(() => {
        $("#zonaVentas, #oficina, #proveedor").select2();
    }, 500);

    const oficinas = OficinasVentas('S');
    $("#oficina").html(oficinas);

    $('#fechaInicial, #fechaFinal').datepicker({
        autoclose: true,
        multidate: false,
        changeMonth: true,
        changeYear: true,
        useCurrent: true,
        dateFormat: 'yy-mm-dd',
        language: 'es'
    }).datepicker("setDate", new Date());

    getZonasVentas();

    getGruposArticulos();

    $('#oficina').change(async function () {
        const filtro = this.value;
        filtarZonasVentas(filtro);
    });
});