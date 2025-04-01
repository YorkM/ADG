const agregarAcciones = () => {
    const contenedor = document.getElementById("contenedorAcciones");
    const nuevoCampo = `
        <div class="campo">
            <input type="text" class="form-control form-control-sm" placeholder="">
            <span class="eliminar" onclick="this.parentElement.remove()">❌</span>
        </div>`;
    contenedor.insertAdjacentHTML("beforeend", nuevoCampo);
}

// EJECUCIÓN DE FUNCIONALIDADES
$(function () {
    $('#btnAgregarAcciones').click(function () {
        agregarAcciones();
    });
});