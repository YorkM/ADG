 let hot = '';
 const consultar = async () => {
   showLoadingSwalAlert2('Consultando información en SAP...', false, true);
   let anio = $("#anios").val();
   let sociedad = $("#Organizacion").val();
   const resp = await enviarPeticion({
     link: "../models/ventasMaterialAnio.php",
     op: "s_mentas_materiales",
     anio: anio,
     sociedad: sociedad
   });
   $("#contResultados").html(`<br><div class="alert alert-warning"><i class="fa-solid fa-circle-info"></i> ${resp.length} registros encontados</div>`);
   console.log(resp.length);
   let colWidthsArr = [];
   let colHeadersArr = [];
   let columnsArr = [];
   const example = document.getElementById("handsontable");
   colHeadersArr = ['OFICINA', 'AÑO', 'MES', 'MATERIAL', 'DESCRIPCION', 'GRUPO ARTICULO', 'UND VENDIDAS', 'VENTAS', 'EAN'];
   colWidthsArr = [80, 80, 60, 200, 500, 200, 100, 150, 150];
   columnsArr = [{
       data: "REGIONAL",
       type: "text",
       readOnly: true
     },
     {
       data: "ANIO",
       type: "text",
       readOnly: true
     },
     {
       data: "MES",
       type: "text",
       readOnly: true
     },
     {
       data: "MATERIAL",
       type: "text",
       readOnly: true
     },
     {
       data: "REFERENCIA",
       type: "text",
       readOnly: true
     },
     {
       data: "GRUPOARTICULO",
       type: "text",
       readOnly: true
     },
     {
       data: "UNIDADESVENDIDAS",
       type: "numeric",
       readOnly: true,
       className: 'text-center',
       validator: function (value, callback) {
         // Comprobar si el valor es un número entero
         if (Number.isInteger(Number(value))) {
           callback(true); // Valor válido.
         } else {
           callback(false); // Valor no válido
         }
       },
     },
     {
       data: 'VENTAS', // Aquí debes colocar el nombre del campo o la propiedad de los datos
       type: 'numeric',
       readOnly: true,
       className: 'text-center',
       validator: function (value, callback) {
         // Validar si el valor es un número entero
         if (Number.isInteger(Number(value))) {
           callback(true); // Valor válido
         } else {
           callback(false); // Valor no válido
         }
       },
       renderer: function (instance, td, row, col, prop, value, cellProperties) {
         // Verificar que el valor es numérico antes de formatear
         const formattedValue = value !== undefined && value !== null
           ? '$' + new Intl.NumberFormat('es-ES', {
             style: 'decimal',
             minimumFractionDigits: 0, // Sin decimales
             maximumFractionDigits: 0 // Sin decimales
           }).format(value)
           : ''; // Si no hay valor, dejar la celda vacía

         td.innerHTML = formattedValue; // Coloca el valor formateado en la celda
         return td;
       }
     },
     {
       data: "EAN",
       type: "text",
       readOnly: true
     },
   ]
   hot = new Handsontable(example, {
     data: resp,
     height: $(window).height() - 10,
     colWidths: colWidthsArr,
     colHeaders: colHeadersArr,
     columns: columnsArr,
     //cell: customConfigArray,
     afterChange: async function (changes, source) {},
     dropdownMenu: true,
     hiddenColumns: {
       indicators: true,
     },
     contextMenu: true,
     multiColumnSorting: true,
     filters: true,
     rowHeaders: true,
     manualRowMove: true,
     autoWrapCol: true,
     autoWrapRow: true,
     licenseKey: "non-commercial-and-evaluation",
   });
   $("#handsontable").addClass("full-screen");
   dissminSwal();
 }

 $(function () {
   $('#btnExport').on('click', async function () {
     try {
       const data = hot.getData();
       const headers = hot.getColHeader();
       const exportData = [headers, ...data];
       const worksheet = XLSX.utils.aoa_to_sheet(exportData);
       const workbook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
       XLSX.writeFile(workbook, 'datos.xlsx');
     } catch (error) {
       console.error('Error durante la exportación:', error);
     }
   });


   carga_anios('anios');
   $("#btnConsultar").click(async () => {
     await consultar();
   });
 })
