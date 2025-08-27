
function ValidarColCsv(csvval) {

	let sw = true;

	if (parseInt(csvval[0].split(';').length) != 2) {

		sw = false;
	}

	return sw;

}


function ObtenerDatosZonaVenta(zona_venta) { 

	x = new Array();

	$.ajax({
		url: "../models/ZonaVentas.php",
		global: false,
		type: "POST",
		data: ({ op: "ObtenerDatosZonaVenta", zona_venta: zona_venta }),
		beforeSend: function () {
			$("input,button,select").attr("disabled", true);
		},
		dataType: "json",
		async: false,
		success: function (data) {
			x = data;
			//resolve(data);
			$("input,button,select").attr("disabled", false);
		}
	}).fail(function (data) {
		$("input,button,select").attr("disabled", false);
		x = data;
		// reject(data);
	});


	return x;
}



function guardarZonaVentasCsv(zona_ventas, zona_descripcion, tipo, fila) {


	$.ajax({
		url: "../models/ZonaVentas.php",
		type: "POST",
		data: ({
			op: "guardarZonaVentasCsv",
			zona_ventas: zona_ventas,
			zona_descripcion: zona_descripcion,
			tipo: tipo
		}),
		beforeSend: function () {
			//$("input,button,select").attr("disabled",true);  
		},
		dataType: "json",
		async: true,
		success: function (data) {
			console.log(data);
			if (data.length > 0) {

				d = data[0];

				if (!d.error) {

					fila.find("td").addClass("alert-success");
					n_mod_insert--;

				} else {

					fila.find("td").addClass("alert-danger");
				}

			}

		}
	}).fail(function (data) {
		console.error(data);
	});

}

function InsertarZonaVentas() {

	let zona_ventas = $("#codigo_zona").val();
	let zona_descripcion = $("#descripcion").val();

	let n_seg_p = 'N';
	let n_cal_p = 'N';
	let tipo = 'I';

	if ($("#n_seg_p").is(":checked")) {
		n_seg_p = 'S';
	}

	if ($("#n_cal_p").is(":checked")) {
		n_cal_p = 'S';
	}

	const datos_zona = ObtenerDatosZonaVenta(zona_ventas);

	if (datos_zona.length > 0) {
		tipo = 'M';
	}

	$.ajax({
		url: "../models/ZonaVentas.php",
		type: "POST",
		data: ({
			op: "InsertarZonaVentas",
			zona_ventas: zona_ventas,
			zona_descripcion: zona_descripcion,
			n_seg_p: n_seg_p,
			n_cal_p: n_cal_p,
			tipo: tipo
		}),
		beforeSend: function () {
			$("input,button,select").attr("disabled", true);
		},
		dataType: "json",
		async: true,
		success: function (data) {
			console.log(data);
			if (data.length > 0) {

				d = data[0];

				if (!d.error) {

					Swal.fire("Ok", d.mesnaje, "success");
					limpiar();

				} else {
					Swal.fire("Ok", d.mesnaje, "error");
				}

			} else {

				Swal.fire("Ok", d.mesnaje, "error");
			}
			$("input,button,select").attr("disabled", false);
		}
	}).fail(function (data) {
		console.error(data);
		$("input,button,select").attr("disabled", false);
		Swal.fire("Ok", "Error grave en el procesamiento de la información", "error");
	});

}


function valirdarEstadoCondicion(zona) {

	x = null;

	$.ajax({
		url: "../models/ZonaVentas.php",
		type: "POST",
		data: ({
			op: "valirdarEstadoCondicion",
			zona: zona
		}),
		dataType: "json",
		async: false,
		success: function (data) {
			x = data[0].existe;
			console.log(x);

		}
	}).fail(function (data) {
		console.error(data);

	});

	return x;
}


function EliminarZonaVentas(zona, ob) {

	let existe = valirdarEstadoCondicion(zona);

	if (!existe) {

		$.ajax({
			url: "../models/ZonaVentas.php",
			type: "POST",
			data: ({
				op: "EliminarZonaVentas",
				zona: zona
			}),
			beforeSend: function () {

				$(ob).attr("disabled", true);
			},
			dataType: "json",
			async: true,
			success: function (data) {
				if (!data[0].error) {

					Swal.fire("Ok", data[0].mensaje, "success");
					$(ob).parent().parent().remove();
					listarZonasVentas();

				} else {

					Swal.fire("Error", data[0].mensaje, "error");
				}
				$(ob).attr("disabled", false);
			}
		}).fail(function (data) {
			console.error(data);
			$(ob).attr("disabled", false);
		});

	} else {
		Swal.fire("Error", "La condicion de pago existe asiganada a terceros y no se puede eliminar", "error");
	}
}


function UpdateConfigZona(zona, campo, ob) {
	i = $(ob).find("i");
	//verifico que estado tiene actualmente antes de actualizar
	if (i.hasClass("fa-check")) { estado = false; } else { estado = true };
	//estado false asi deberia qde quedar despues de actualizar
	$.ajax({
		url: "../models/ZonaVentas.php",
		type: "POST",
		data: ({
			op: "updateConfigZona",
			zona: zona,
			estado: estado,
			campo: campo
		}),
		dataType: "json",
		async: true,
		success: function (data) {
			console.log(data);
			if (!data.error) {
				if (i != undefined) {
					if (i.hasClass("fa-check")) {
						i.removeClass("fa-check");
					} else {
						i.addClass("fa fa-check  p-2 m-2 checked_icon text-success");
					}
				} else { console.error("i undefined") }
			}
		}
	}).fail(function (data) {
		console.error(data);

	});

}

function ToggleChack(ob, zona, op) {
	UpdateConfigZona(zona, op, ob);
}


function listarZonasVentas() {

	let dato = $("#busqueda").val();
	let ofi = $("#oficina").val();

	$.ajax({
		url: "../models/ZonaVentas.php",
		type: "POST",
		data: ({
			op: "ListarZonasVentas",
			dato: dato,
			ofi: ofi
		}),
		beforeSend: function () {
			$("#result").html('<div class="alert alert-danger">Cargando...</div>');
		},
		dataType: "json",
		async: true,
		success: function (data) {

			if (data.length > 0) {

				let tb = '<div class="tabla-estilo-wrapper">' +
					'<table class="tabla-estilo" >' +
					'<thead class="sticky-top"  >' +
					'<tr>' +
					'<th colspan="5">&nbsp</th>' +
					'<th colspan="6" class="table-warning text-center">VISITAS OPTIMAS</th>' +
					'<th colspan="6" class="table-success text-center">LLAMADAS OPTIMAS</th>' +
					'</tr>' +
					'<tr>' +
					'<th>Zona</th>' +
					'<th>Zona descripción</th>' +
					'<th class="text-center alert-warning" align="center"><label onClick="Swal.fire(\'No participa en seg de presupuesto<br> (NO SE MUESTRA EN EL 0108)\');"><u>Config_1</u></label></th>' +
					'<th class="text-center alert-info"" align="center"><label onClick="Swal.fire(\'\No afecta el valor del presupuesto<br> (SE MUESTRA EN EL 0108 , PERO NO AFECTA EL VALOR DEL PRESUPUESTO)\');"><u>Config_2</u></th>' +
					'<th class="text-center alert-danger"" align="center"><label onClick="Swal.fire(\'No seguimiento presupuesto<br> (NO SE TOMA EN CUENTA 0108,0109,0122)\');"><u>Config_3</u></label></th>' +
					'<th class="text-center" align="center">AA</th>' +
					'<th class="text-center" align="center">A</th>' +
					'<th class="text-center" align="center">B</th>' +
					'<th class="text-center" align="center">C</th>' +
					'<th class="text-center" align="center">D</th>' +
					'<th class="text-center" align="center">E</th>' +
					'<th class="text-center" align="center">AA</th>' +
					'<th class="text-center" align="center">A</th>' +
					'<th class="text-center" align="center">B</th>' +
					'<th class="text-center" align="center">C</th>' +
					'<th class="text-center" align="center">D</th>' +
					'<th class="text-center" align="center">E</th>' +
					'<th>&nbsp;</th>' +
					'</tr>' +
					'</thead>' +
					'<tbody>';

				data.forEach(res => {
					if (res.n_seg_p == 'S') {
						check_n_seg_p = '<i class="fa fa-check p-2 m-2 checked_icon text-dark"></i>';
					} else {
						check_n_seg_p = '<i class="checked_icon"> &nbsp;</i>';
					}

					if (res.n_cal_p == 'S') {
						check_n_cal_p = '<i class="fa fa-check p-2 m-2 checked_icon text-dark"></i>';
					} else {
						check_n_cal_p = '<i class="checked_icon"> &nbsp;</i>';
					}

					if (res.n_seg_v == 'N') {
						check_n_seg_v = '<i class="fa fa-check p-2 m-2 checked_icon text-dark"></i>';
					} else {
						check_n_seg_v = '<i class="checked_icon"> &nbsp;</i>';
					}

					tb += '<tr class="tr_lsit_zonas">' +
						'<td>' + res.zona_ventas + '</td>' +
						'<td align="center" ><b>' + res.zona_descripcion + '</b></td>' +
						'<td class="alert-warning" onclick="ToggleChack(this,' + res.zona_ventas + ',' + 1 + ')">' + check_n_seg_p + '</td>' +
						'<td class="alert-primary" onclick="ToggleChack(this,' + res.zona_ventas + ',' + 2 + ')">' + check_n_cal_p + '</td>' +
						'<td class="alert-danger" onclick="ToggleChack(this,' + res.zona_ventas + ',' + 3 + ')">' + check_n_seg_v + '</td>' +
						//clasificacion segun categorias
						'<td class="table-warning"><input type="text" class="form-control " value ="' + res.v_aa + '" onKeyPress="return vnumeros(event)" onBlur="AddCategoriaZona(\'V_AA\',\'' + res.zona_ventas + '\',this.value)"/></td>' +
						'<td class="table-warning"><input type="text" class="form-control" value ="' + res.v_a + '" onKeyPress="return vnumeros(event)" onBlur="AddCategoriaZona(\'V_A\',\'' + res.zona_ventas + '\',this.value)"/></td>' +
						'<td class="table-warning"><input type="text" class="form-control" value ="' + res.v_b + '" onKeyPress="return vnumeros(event)" onBlur="AddCategoriaZona(\'V_B\',\'' + res.zona_ventas + '\',this.value)"/></td>' +
						'<td class="table-warning"><input type="text" class="form-control" value ="' + res.v_c + '" onKeyPress="return vnumeros(event)" onBlur="AddCategoriaZona(\'V_C\',\'' + res.zona_ventas + '\',this.value)"/></td>' +
						'<td class="table-warning"><input type="text" class="form-control" value ="' + res.v_d + '" onKeyPress="return vnumeros(event)" onBlur="AddCategoriaZona(\'V_D\',\'' + res.zona_ventas + '\',this.value)"/></td>' +
						'<td class="table-warning"><input type="text" class="form-control" value ="' + res.v_e + '" onKeyPress="return vnumeros(event)" onBlur="AddCategoriaZona(\'V_E\',\'' + res.zona_ventas + '\',this.value)"/></td>' +
						'<td class="table-success"><input type="text" class="form-control" value ="' + res.t_aa + '" onKeyPress="return vnumeros(event)" onBlur="AddCategoriaZona(\'T_AA\',\'' + res.zona_ventas + '\',this.value)"/></td>' +
						'<td class="table-success"><input type="text" class="form-control" value ="' + res.t_a + '" onKeyPress="return vnumeros(event)" onBlur="AddCategoriaZona(\'T_A\',\'' + res.zona_ventas + '\',this.value)"/></td>' +
						'<td class="table-success"><input type="text" class="form-control" value ="' + res.t_b + '" onKeyPress="return vnumeros(event)" onBlur="AddCategoriaZona(\'T_B\',\'' + res.zona_ventas + '\',this.value)"/></td>' +
						'<td class="table-success"><input type="text" class="form-control" value ="' + res.t_c + '" onKeyPress="return vnumeros(event)" onBlur="AddCategoriaZona(\'T_C\',\'' + res.zona_ventas + '\',this.value)"/></td>' +
						'<td class="table-success"><input type="text" class="form-control" value ="' + res.t_d + '" onKeyPress="return vnumeros(event)" onBlur="AddCategoriaZona(\'T_D\',\'' + res.zona_ventas + '\',this.value)"/></td>' +
						'<td class="table-success"><input type="text" class="form-control" value ="' + res.t_e + '" onKeyPress="return vnumeros(event)" onBlur="AddCategoriaZona(\'T_E\',\'' + res.zona_ventas + '\',this.value)"/></td>' +
						//clasificacion segun categorias
						'<td><button class="btn btn-default" onclick="EliminarZonaVentas(\'' + res.zona_ventas + '\')"><i class="fa fa-trash text-danger"></i></button></td>' +
						'</tr>';

				});
				tb += '</tbody>';
				tb += '</table>';
				tb += '</div>';
				$("#result").html(tb);
			} else { $("#result").html('<div class="alert alert-danger">Sin resultados</div>'); }

		}
	}).fail(function (data) { $("#result").html(data.responseText); });


}


function AddCategoriaZona(categoria, zona, cant) {
	$.ajax({
		url: "../models/ZonaVentas.php",
		type: "POST",
		data: ({
			op: "U_CATEGORIAS_ZONAS",
			categoria: categoria,
			zona: zona,
			cant: cant
		}),
		beforeSend: function () {

		},
		dataType: "json",
		async: true,
		success: function (data) {
			if (!data[0].error) {
				$.notify({// options
					icon: 'glyphicon glyphicon-warning-sign',
					title: '<strong>Correcto</strong></br>',
					message: '¡Categoria ' + categoria + ' de zona ' + zona + ' actualizada!',
					url: '',
					target: '_blank'
				}, {// settings	
					delay: 5000,
					type: 'success',
					animate: {
						enter: 'animated fadeInDown',
						exit: 'animated fadeOutUp'
					},
				});
			} else {
				Swal.fire("Error", data[0].mensaje, "error");
			}
		}
	});
}


function limpiar() {

	$("#table_csv").html("");
	$("#codigo_zona").val("");
	$("#descripcion").val("");
	$("#n_seg_p").attr("checked", false);
	$("#n_cal_p").attr("checked", false);
	$("#csv").val("");
	$("#busqueda").val("");
	$("#n_mod_insert").val(0);
	n_mod_insert = 0;

}

function validarDatosForm() {

	sw = true;


	if ($.trim($("#codigo_zona").val()) == '') {
		Swal.fire("Error", "Se debe digitar una zona de ventas", "error");
		sw = false;
	}

	if ($.trim($("#descripcion").val()) == '') {
		Swal.fire("Error", "Se debe digitar una descripción de zona de ventas", "error");
		sw = false;
	}

	return sw;

}


// Devuelve un valor si 'letter' esta incluido en la clave
function getLetterReplacement(letter, replacements) {
	const findKey = Object.keys(replacements).reduce(
		(origin, item, index) => (item.includes(letter) ? item : origin),
		false
	);
	return findKey !== false ? replacements[findKey] : letter;
}


function removeAccents(text) {
	const sustitutions = {
		àáâãäå: "a",
		ÀÁÂÃÄÅ: "A",
		èéêë: "e",
		ÈÉÊË: "E",
		ìíîï: "i",
		ÌÍÎÏ: "I",
		òóôõö: "o",
		ÒÓÔÕÖ: "O",
		ùúûü: "u",
		ÙÚÛÜ: "U",
		ýÿ: "y",
		ÝŸ: "Y",
		ß: "ss",
		ñ: "n",
		Ñ: "N",
		"�": "I",
		"�": "I",
	};

	// Recorre letra por letra en busca de una sustitución
	return text
		.split("")
		.map((letter) => getLetterReplacement(letter, sustitutions))
		.join("");
}

//removeAccents("El bárbaro entró en cólera");
// "El barbaro entro en colera"

var n_mod_insert = 0;

$(function () {

	limpiar();
	OfcS = OficinasVentas('N');

	$("#oficina").append(OfcS);


	$("#nuevo").click(function () {

		limpiar();

	});

	$("#busqueda").keyup(function () {

		let dato = $.trim($(this).val());

		if (dato.length > 0) {

			listarZonasVentas();

		} else {
			$("#result").html('');
		}

	});

	$("#codigo_zona").focusout(function () {

		let zona = $.trim($(this).val());
		let oficina = $("#oficina").val();
		let ofc_seg = oficina.substring(0, 1);
		let zona_seg = zona.substring(0, 1);


		if (zona.length > 0) {

			if (ofc_seg == zona_seg) {

				let datos_zonas = ObtenerDatosZonaVenta(zona);
				//console.log(datos_zonas);
				if (datos_zonas.length > 0) {

					d = datos_zonas[0];

					$(this).val(d.zona_ventas);
					$("#descripcion").val(d.zona_descripcion);

					if (d.n_seg_p == 'S') {
						$("#n_seg_p").prop("checked", true);
					} else {
						$("#n_seg_p").prop("checked", false);
					}
					if (d.n_cal_p == 'S') {
						$("#n_cal_p").prop("checked", true);
					} else {
						$("#n_cal_p").prop("checked", false);
					}

				} else {

					limpiar();
					$(this).val(zona);
				}

			} else {
				Swal.fire("Error", "La zona digitada no corresponde a la oficina de ventas", "warning");
			}

		}

	})

	$("#csv").change(function (e) {

		let ext = $("#csv").val().split(".").pop().toLowerCase();
		let Rol = $("#Rol").val();

		n_mod_insert = 0;

		if ($.inArray(ext, ["csv"]) == -1) {
			alert('Solo se permiten archivos CSV');
			$("#csv").val('');
			return false;
		}





		if (e.target.files != undefined) {

			var reader = new FileReader("UTF-8");

			reader.onload = function (e) {
				//console.log("reader.onload");
				var csvval = e.target.result.split("\n");

				const valido = ValidarColCsv(csvval);

				if (valido) {
					//console.log("valido");
					let col = '';

					let tb = '<div class="tabla-estilo-wrapper">' +
						'<table class="tabla-estilo" >' +
						'<thead class="sticky-top"  >' +
						'<tr>' +
						'<th>ZONA VENTA</th>' +
						'<th>DESCRIPCION ACTUAL</th>' +
						'<th>DESCRIPCION ARCHIVO</th>' +
						'<th>PROCESO</th>' +
						'</tr>' +
						'</thead>' +
						'<tbody>';


					csvval.forEach((row, index) => {

						if (row != '') {

							const col = row.split(';');

							oficina = $("#oficina").val();
							oficina = oficina.substring(0, 2);

							oficina_zona = col[0].substring(0, 2);


							if (oficina == oficina_zona) {

								const zona_venta_csv = $.trim(col[0]);

								let descripcion_csv = $.trim((col[1].toString()))

								let zona_actual = '';
								let zona_descripcion_actual = '';

								let datos_zonas = ObtenerDatosZonaVenta(zona_venta_csv);

								const d = datos_zonas[0];


								if (datos_zonas.length > 0) {

									zona_actual = $.trim(d.zona_venta);
									zona_descripcion_actual = $.trim(d.zona_descripcion);
								}

								let proceso = '-';
								let color = 'success';

								if (zona_actual == '' && zona_descripcion_actual == '') {

									proceso = 'INSERTAR';
									color = 'danger';
									n_mod_insert++;

								} else {


									if (zona_descripcion_actual != descripcion_csv && descripcion_csv != '') {

										proceso = 'MODIFICAR';
										color = 'warning';
										n_mod_insert++;
									}

								}


								tb += '<tr tabindex="' + (100 + index) + '">' +
									'<td>' + col[0] + '</td>' +
									'<td>' + zona_descripcion_actual + '</td>' +
									'<td>' + descripcion_csv + '</td>' +
									'<td class="bg-' + color + '"><span class="badge text-bg-' + color + '">' + proceso + '</span></td>' +
									'</tr>';

							}

						}
					});

					tb += '</tbody></table></div>';

					$("#table_csv").html(tb);
					$("#n_mod_insert").val(n_mod_insert);

				}
			}

			reader.readAsText(e.target.files.item(0));
		}
	});


	$("#oficina").change(function () {
		limpiar();
		n_mod_insert = 0;
	});


	$("#guardar").click(function () {

		let long_datos_csv = $(".datos_csv tr").length;

		if (long_datos_csv > 0) {


			if (n_mod_insert > 0) {

				$(".datos_csv tr:gt(0)").each(function () {

					let sw = true;
					let fila = $(this);

					let zona_ventas = $.trim(fila.find("td").eq(0).html());
					let zona_descripcion = $.trim(fila.find("td").eq(2).html());

					let cl = fila.find("td").eq(3).attr("class");


					if (zona_ventas == '') { sw = false; }
					if (zona_descripcion == '') { sw = false; }

					let tipo = '';

					if (cl.indexOf("bg-warning") != -1 || cl.indexOf("bg-danger") != -1) {


						if (sw) {

							if (cl.indexOf("bg-warning") != -1) {
								tipo = 'M';
							} else {
								tipo = 'I';
							}

							guardarZonaVentasCsv(zona_ventas, zona_descripcion, tipo, fila);
							$(this).focus();
						}


					}

				});


			} else {
				Swal.fire("Error", "No existen datos para modificar", "error");
			}




		} else {

			const FormularioValido = validarDatosForm();

			if (FormularioValido) {
				InsertarZonaVentas();
			}

			///Swal.fire("Error","No existen datos para guardar","error");

		}

	});


});