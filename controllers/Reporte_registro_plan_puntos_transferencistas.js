$(function(){ 
  $("#select_org").val($("#Org").val());
  $("#select_org2").val($("#Org").val());
  var option = OficinasVentas('N');
  $("#select_Oficina").html(option);
  $("#select_Oficina2").html(option);
   $("#fhIni2").val(FechaActual());
  $("#fhFin2").val(FechaActual());
  var fecha_actual = new Date();
  var mes_actual = fecha_actual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
  var año_actual = fecha_actual.getFullYear();

  // Asegurarse de que el mes tenga dos dígitos
  mes_actual = mes_actual < 10 ? '0' + mes_actual : mes_actual;
 
  $('#fhIni, #fhFin').datepicker({
    format: "dd-mm-yyyy",     // Formato para mostrar día, mes y año
    startView: "days",        // Empieza la vista en días
    minViewMode: "days",      // Modo de vista mínima en días
    language: "es",           // Establece el idioma a español
    autoclose: true           // Cierra el selector automáticamente después de seleccionar
}).datepicker('setDate', new Date(año_actual, mes_actual - 1, 1));


  
});


function PDF_Certificacion(id) {
  // Determinar la URL según el valor de archivoexc
  let baseUrl = '../resources/pdf/PDF_Boleta_pw.php';
  
  // Construir la URL con parámetros GET
  let url = `${baseUrl}?oficina=${encodeURIComponent(oficina)}&id=${encodeURIComponent(id)}`;
  
  // Configurar el iframe con la URL construida
  $("#ModalBody").html('<iframe width="100%" height="100%" id="tickets" src="'+url+'" />');
  
  // Mostrar el modal
  $("#ModalBoletas").modal("show");
}


function Consultar_registros() {
    $.ajax({
        type: "POST",
        encoding: "UTF-8",
        url: "../models/Puntos_pw.php",
        async: true,
        dataType: "json",
        data: { op: 'Consultar_registros', orga: $("#select_org").val(), fecha: $("#fhIni").val() },
        success: function(data) {
            // Limpia el contenido del tbody solo una vez
            $('#registroTable').empty();  // Asegúrate de que el ID coincida

            // Recorre los datos y construye las filas de la tabla
            data.forEach(function(item) {
                var boton = '<a href="../resources/certificaciones_transferencistas/' + item.cedula_trans + '.pdf" ' +
                'class="glyphicon glyphicon-file" ' +
                'style="color: red; text-decoration: none;" ' +
                'title="Descargar PDF" ' +
                'download>' +
                '</a>';
                var row = '<tr>' +
                    '<td>' + item.id + '</td>' +
                    '<td>' + item.laboratorio + '</td>' +
                    '<td>' + item.usuario_trans + '</td>' +
                    '<td>' + item.nombres_trans + '</td>' +
                    '<td>' + item.apellido_trans + '</td>' +
                    '<td>' + item.cedula_trans + '</td>' +
                    '<td>' + item.celular_trans + '</td>' +
                    '<td>' + item.email + '</td>' +
                    '<td>' + item.direccion_trans + '</td>' +
                    '<td>' + item.ciudad_trans + '</td>' +
                    '<td>' + item.fecha_registro + '</td>' +
                    '<td>' + boton + '</td>' +
                    '</tr>';
                
                // Agregar la nueva fila a la tabla
                $('#registroTable').append(row);
            });

            console.log('Datos actualizados en la tabla');  // Verifica que se estén agregando las filas

        },
        error: function(xhr, status, error) {
            console.error("Error: " + error);
        }
    }).fail(function(data) {
        console.error("Fail: ", data);
    });
}
