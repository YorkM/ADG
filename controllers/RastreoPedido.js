function enter(e) {
	if (e.key === 'Enter') trazabilidad();
}

function regresar() {
	$("#tbBuscarRastreo").show();
	$("#tbRastreo").hide();
}

const formatDate = (dateString) => {
	const processedDateString = dateString.replace(/:(\d{3})([AP]M)/, " $2");
	const date = new Date(processedDateString);
	const options = {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true
	};
	return new Intl.DateTimeFormat("es-ES", options).format(date);
}

function convertirMinutosAHoras(minutos) {
	if (isNaN(minutos) || minutos < 0) return "00:00";
  
	const horas = Math.floor(minutos / 60);
	const mins = minutos % 60;
  
	return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

const trazabilidad = async () => {
	let numero = $("#numero").val();
	try {
		if (numero !== "") {
			showLoadingSwalAlert2('Cargando los datos...', false, true);

			const resp = await enviarPeticion({
				op: "TRAZABILIDAD",
				link: "../models/RastreoPedido.php",
				numero
			});

			if (resp.length) {
				resp.forEach(item => {
					// CLIENTE
					$("#txt_org").text(item.ORG);
					$("#txt_bodega").text(item.BODEGA);
					// CLIENTE
					$("#txt_cliente").text(`${item.NOMBRES} - ${item.RAZON_COMERCIAL}`);
					$("#txt_dir").text(item.DIRECCION);
					$("#txt_nit").text(item.NIT);
					$("#txt_cod").text(item.CODIGO_SAP);
					$("#txt_depa").text(item.DEPARTAMENTO);
					$("#txt_ciud").text(item.CIUDAD);
					// PEDIDO
					$("#txt_pedido").text(item.NUMERO);
					$("#txt_usr_ped").text(item.USUARIO);
					$("#txt_fh_ped").text((item.FECHA_PEDIDO.trim()) && formatDate(item.FECHA_PEDIDO));
					$("#txt_fh_ot").text((item.FECHA_OT.trim()) && formatDate(item.FECHA_OT));
					$("#txt_usr_ot").text(item.USUARIO_OT);
					$("#txtDifPedido").text((item.DIF_PEDIDO) && `${item.DIF_PEDIDO} Mntos - ${convertirMinutosAHoras(parseInt(item.DIF_PEDIDO))} Hrs`);
					// SEPARACIÓN
					$("#txt_usr_sep").text(item.USUARIO_SEPARA);
					$("#txt_fhini_sep").text((item.INI_SEP.trim()) && formatDate(item.INI_SEP));
					$("#txt_fhfin_sep").text((item.FIN_SEP.trim()) && formatDate(item.FIN_SEP));
					$("#txt_num_ot").text(item.NUMERO_OT);
					$("#difSepa").text((item.DIF_SEPA && item.INI_SEP.trim() && item.FIN_SEP.trim()) && `${item.DIF_SEPA} Mntos - ${convertirMinutosAHoras(parseInt(item.DIF_SEPA))} Hrs`);
					// FACTURACIÓN
					$("#txt_usr_fact").text(item.USUARIO_FACT);
					$("#txt_fhini_fact").text((item.INI_FACT.trim()) && formatDate(item.INI_FACT));
					$("#txt_fhfin_fact").text((item.FIN_FACT.trim()) && formatDate(item.FIN_FACT));
					$("#txt_num_fact").text(item.NUMERO_FACT);
					$("#difFact").text((item.DIF_FACT && item.INI_FACT.trim() && item.FIN_FACT.trim()) && `${item.DIF_FACT} Mntos - ${convertirMinutosAHoras(parseInt(item.DIF_FACT))} Hrs`);
					// ENTREGA
					$("#txt_usr_ent").text(item.USUARIO_DESP);
					$("#txt_fhini_ent").text((item.INI_TRANS.trim()) && formatDate(item.INI_TRANS));
					$("#txt_fhfin_ent").text((item.FIN_TRANS.trim()) && formatDate(item.FIN_TRANS));
					$("#difEntre").text((item.DIF_TRANS) && `${item.DIF_TRANS} Mntos - ${convertirMinutosAHoras(parseInt(item.DIF_TRANS))} Hrs`);
					$("#txt_guia").text(item.GUIA);
					$("#txt_nota").text(item.NOTA_ENTREGA);
					// EMPAQUE
					$("#txt_usr_emp").text(item.USUARIO_EMPAQUE);
					$("#txt_fhini_emp").text((item.FINI_EMPAQUE.trim()) && formatDate(item.FINI_EMPAQUE));
					$("#txt_fhfin_emp").text((item.FFIN_EMPAQUE.trim()) && formatDate(item.FFIN_EMPAQUE));
					$("#difEmpa").text((item.DIF_EMPA) && `${item.DIF_EMPA} Mntos - ${convertirMinutosAHoras(parseInt(item.DIF_EMPA))} Hrs`);
					$("#txt_n_bolsas").text(item.N_BOLSAS);
					$("#txt_n_paquete").text(item.N_PAQUETES);
					$("#txt_n_cajas").text(item.N_CAJAS);
				});
				$("#tbBuscarRastreo").hide();
				$("#tbRastreo").show();
			} else {
				setTimeout(() => {
					Swal.fire('😢 Oops!!', 'El número de pedido que está intentando buscar no existe, verifique e intente nuevamente', 'warning');					
				}, 100);
			}
		} else {
			setTimeout(() => {
				Swal.fire('😢 Oops!!', 'Debe ingresar un número para iniciar la búsqueda', 'warning');
			}, 100);
		}
	} catch (error) {
		console.log(error);
	} finally {
		dissminSwal();
	}
}

$(function () {
	$("#numero").val('').focus();
	$("#tbRastreo").hide();

	document.getElementById('numero').addEventListener('keydown', enter);
});