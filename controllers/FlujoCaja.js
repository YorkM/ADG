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
// SETEAR FECHA ACTUAL A CAMPOS FILTROS
const setearFechas = () => {
   const fecha = new Date();
   return fecha.toISOString().split('T')[0];
}
// FUNCIÓN PARA CARGAR LOS CONCEPTOS
const getConceptos = async () => {
   try {
      const { data } = await enviarPeticion({ op: "G_CONCEPTOS", link: "../models/FlujoCaja.php" });
      if (data.length) {
         let conceptos = `<option value="">-- Seleccione el concepto --</option>`;
         data.forEach(item => conceptos += `<option value="${item.ID}">${item.TEXTO}</option>`);
         $('#concepto').html(conceptos);
      }
   } catch (error) {
      console.log(error);
   }
}
// FUNCIÓN PARA AGREGAR UN NUEVO CONCEPTO
const guardarConcepto = async () => {
   const concepto = $('#newConcepto').val();
   if (!concepto) {
      Swal.fire("Agregar concepto", "El campo concepto es obligatorio", "error");
      return;
   }

   try {
      const resp = await enviarPeticion({ op: "I_CONCEPTO", link: "../models/FlujoCaja.php", concepto });
      if (resp.ok) {
         $('#agregarConcepto').modal("hide");
         $('#newConcepto').val("");
         getConceptos();
         Swal.fire("Agregar concepto", "El concepto ha sido agregado correctamente", "success");
      }
   } catch (error) {
      console.log(error);
   }
}
// FUNCIÓN PARA AGREGAR UN NUEVO CONCEPTO
const guardarMovimiento = async () => {
   const fecha = $('#fechaM').val();
   const FC = fecha.split('-');
   const dia = FC[2];
   const mes = FC[1];
   const anio = FC[0];
   const organizacion = $('#numOrg').val();
   const usuario = $('#login_user').val();
   const tipoM = $('#tipoM').val();
   const concepto = $('#concepto').val();
   const monto = $('#monto').val().replace(/^\$|\.|,/g, "");
   const descripcion = $('#descripcion').val();

   if (!fecha || !tipoM || !concepto || !monto) {
      Swal.fire("Guardar movimiento", "Los campos... Fecha Movimiento - Tipo Movimiento - Concepto - Monto/Valor, Son obligatorios", "error");
      return;
   }

   const result = await confirmAlert("Guardar movimiento", "Se guardarán los datos ingresados en los campos... ¿Han sido verificados antes?");
   if (!result.isConfirmed) return;

   try {
      const resp = await enviarPeticion({ 
         op: "I_MOVIMIENTO", 
         link: "../models/FlujoCaja.php",
         organizacion,
         descripcion,
         concepto,
         usuario, 
         fecha,
         tipoM, 
         monto,
         dia,
         mes,
         anio
      });

      if (resp.ok) {
         $('#fechaM').val("");       
         $('#tipoM').val("");       
         $('#concepto').val("");       
         $('#monto').val("");       
         $('#descripcion').val(""); 
         getMovimientos();
         getBimestreFlujoCaja();      
         Swal.fire("Agregar movimiento", "El movimiento ha sido agregado correctamente", "success");
      }     
   } catch (error) {
      console.log(error);
   }
}
// FUNCIÓN PARA OBTENER LOS MOVIMIENTOS
const getMovimientos = async () => {
   try {
      const { data } =  await enviarPeticion({ op: "G_MOVIMIENTOS", link: "../models/FlujoCaja.php" });    
      let elementos = ``;
      let textColor = "";
      let textColor2 = "";
      let signo = "";
      if (data.length) {
         data.forEach(item => {
            textColor = (item.TIPO_M === "INGRESO") ? "success" : "danger";
            textColor2 = (item.TIPO_M === "INGRESO") ? "#198754 " : "#dc3545 ";
            signo = (item.TIPO_M === "INGRESO") ? "+" : "-";

            if (parseInt(item.DIA) < 10) item.DIA = `0${item.DIA}`;
            if (parseInt(item.MES) < 10) item.MES = `0${item.MES}`;
            
            elementos += `
            <tr>
               <td class="no-wrap size-14 text-center">${item.DIA}</td>
               <td class="no-wrap size-14 text-center">${item.MES}</td>
               <td class="no-wrap size-14 text-center">${item.ANIO}</td>
               <td class="no-wrap size-14 text-center">${item.ORGANIZACION}</td>
               <td class="no-wrap text-center"><span style="font-size: 10px; background-color: ${textColor2}; color: white; padding: 3px 6px; border-radius: 4px; display: inline-block; width: 4rem; font-weight: bold;">${item.TIPO_M}</span></td>
               <td class="no-wrap size-13">${item.TEXTO}</td>
               <td class="no-wrap text-center size-15 fw-bold text-${textColor}">${signo} ${formatNum(item.VALOR, "$")}</td>
               <td class="no-wrap size-13">${item.DESCRIPCION}</td>
               <td class="no-wrap text-center"><button class="btn btn-warning btn-sm shadow-sm editar" title="Editar movimiento"><i class="fa-solid fa-pen-to-square"></i></button></td>
            </tr>`;
         }); 

         $('#tablaProyeccion').on('click', '.editar', function () {
            console.log($(this).parent());
         });
      } else {
         elementos = `<td colspan="8" class="lead text-center">No hay movimientos guardados</td>`;
      }      
      $('#tablaProyeccion tbody').html(elementos);
   } catch (error) {
      console.log(error);
   }
}
// FUNCIÓN PARA OBTENER LOS MOVIMIENTOS
const getBimestreFlujoCaja = async () => {
   try {
      const { data } =  await enviarPeticion({ op: "G_BIMESTRES", link: "../models/FlujoCaja.php" });
      let elementos = ``;
      let textColor = "";
      if (data.length) {
         data.forEach(item => {    
            textColor = (item.FLUJO_CAJA_NETO  < 0) ? "text-danger fw-bold" : "";        
            elementos += `
            <tr>
               <td class="size-13 text-center no-wrap">${item.BIMESTRE}</td>
               <td class="size-14 text-center no-wrap">${formatNum(item.TOTAL_INGRESOS, "$")}</td>
               <td class="size-14 text-center no-wrap">${formatNum(item.TOTAL_EGRESOS, "$")}</td>
               <td class="size-14 text-center no-wrap ${textColor}">${formatNum(item.FLUJO_CAJA_NETO, "$")}</td>
               <td class="size-14 text-center no-wrap">${formatNum(item.PROM_INGRESOS_DIA, "$")}</td>
               <td class="size-14 text-center no-wrap">${formatNum(item.PROM_EGRESOS_DIA, "$")}</td>
               <td class="size-14 text-center no-wrap">${item.DIAS_CON_MOVIMIENTO}</td>
               <td class="size-14 text-center no-wrap">${item.NUM_INGRESOS}</td>
               <td class="size-14 text-center no-wrap">${item.NUM_EGRESOS}</td>
               <td class="size-14 text-center no-wrap">${item.PORCENTAJE_EGRESOS_SOBRE_INGRE}%</td>
            </tr>`;
         }); 
      } else {
         elementos = `<td colspan="8" class="lead text-center">No hay datos disponibles</td>`;
      }      
      $('#tablaProyeccion2 tbody').html(elementos);
   } catch (error) {
      console.log(error);
   }
}

// EJECUCIÓN DE LAS FUNCIONALIDADES AL CARGAR EL DOM
$(function () {
   $('#fechaInicio').val(setearFechas());
   $('#fechaFinal').val(setearFechas());

   getConceptos();

   getMovimientos();

   getBimestreFlujoCaja()

   $('#btnConcepto').click(function () {
      $('#agregarConcepto').modal("show");
   });

   $('#btnGuardar').click(function () {
      guardarMovimiento();
   });

   $('#newConcepto, #descripcion').on('input', function () {
      this.value = this.value.toUpperCase();
   });

   $('#monto').on('input', function () {
      let value = $(this).val().replace(/[^0-9]/g, '');
      if (value) value = parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 0 });
      if (value) $(this).val("$" + value);
      else $(this).val("");
   });

   $('#guardarConcepto').click(function () {     
      guardarConcepto();
   });
});