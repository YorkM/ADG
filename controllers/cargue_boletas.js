

function limpiar(){
	$("#archivo").val('');
	$("#div_tabla").html('');	
	$("#registrar_excel").prop("disabled",true);
	$("#imprimir").prop("disabled",true);
}

function PDF_Boletas(){
	/*let selecion = $("#archivoexc").val();
	if(selecion == 1){
	 var url='../resources/pdf/PDF_Boleta.php';
	$("#ModalBody").html('<iframe width="100%" height="100%" id="tickets" src="'+url+'" />');
	$("#ModalBoletas").modal("show");
	}else{
	var url='../resources/pdf/PDF_Boleta_tranferencistas.php';
	$("#ModalBody").html('<iframe width="100%" height="100%" id="tickets" src="'+url+'" />');
	$("#ModalBoletas").modal("show");
	}*/
	
	
	let url =  $("#archivoexc").val()==1 ? '../resources/pdf/PDF_Boleta.php':'../resources/pdf/PDF_Boleta_tranferencistas.php'; 
	
	$("#ModalBody").html('<iframe width="100%" height="100%" id="tickets" src="'+url+'" />');
	$("#ModalBoletas").modal("show");
	
}






function guardarBoletas_C(datos) {
	
	
	//esto es una promesa
	return new Promise((resolve,reject)=>{

		$.ajax({
			url: '../models/cargue_boletas.php',
			type: 'POST',
			dataType: "json",
			data: {
				op: "boletas_clientes",
				datos: JSON.stringify(datos)
			},
			async:true,
			success:function(data){
				
			//console.log(data);	
				
				resolve(data)
				
			}
		})
		.fail(function(data){
			console.error(data);
			reject(data);
		});	


	});

}

function guardarBoletas_T(datos) {

	//esto es una promesa
	return new Promise((resolve,reject)=>{

		$.ajax({
			url: '../models/cargue_boletas.php',
			type: 'POST',
			dataType: "json",
			data: {
				op: "boletas_transfer",
				datos: JSON.stringify(datos)
			},
			async:true,
			success:function(data){
				
				resolve(data)

			}
		})
		.fail(function(data){
			console.error(data);
			reject(data);
		});	

	});
}


//Funcion para escoger el tipo archivo

$(function(){
	
	$("#imprimir").click(function(){
		
		PDF_Boletas();
		$("#div_tabla").val();
	});
	
	 $("#archivoexc").change(function(){
		limpiar(); 
	 })
	
	$("#archivo").change(function(e){
		
	  let selectvalue = $("#archivoexc").val();
	
	   var ext = $("#archivo").val().split(".").pop().toLowerCase();

	   if($.inArray(ext,["csv"]) == -1) {
			alert('Solo se permiten archivos CSV');
			$("#archivo").val('');
			return false;
	   } 		
		console.log(selectvalue);
	  switch(selectvalue){
		 /*CLIENTE */ 
		 case "1":
			  
		   if (e.target.files != undefined) {
			  
			   let reader 		=new FileReader();
			   const archivo	=$("#archivo").val();
			   				
			   reader.onload = function(e) {
					
				 let csvval= e.target.result.split("\n");
				   
				   console.log({csvval});
				   
				   
				 let col='';

				 let tb='<table class="table table-bordered table-striped table-hove table-sm tabla_c ">'+
								'<thead>'+
								   '<tr>'+
										'<th >USUARIO</th>'+
										'<th >CLIENTE</th>'+
										'<th >NÚMERO BOLETAS SAP</th>'+
										'<th >TEXTO</th>'+
					 					
									'</tr>'+
								'</thead>'+
							'<tbody>';
				  csvval.forEach((row)=>{
						
						if(row!=''){

							let col          = row.split(';');
							let codigo_sap 	 =col[0];
							let cliente      =col[1];
							let num_boletas  =col[2];
							let texto      	 =col[3];
							

							 tb+=`<tr>  
									  <td>${codigo_sap}</td>
									  <td>${cliente}</td>
									  <td>${num_boletas}</td>
									  <td>${texto} <button()" class=""><i  style="color:green; float:right" class="fas fa-check"></i></button></td>
									 
								   </tr>`;							
						}
					  
				  });
				  tb+='</tbody>';
				  tb+='</table>';
				   
				  $("#div_tabla").html(tb); 
				   
			   }	
			   reader.readAsText(e.target.files.item(0));
		   }//  if (e.target.files != undefined) {
		   
			$("#registrar_excel").prop("disabled",false)     
		break;
		 /*TRANSFERENCISTAS */ 
		 case "2":
			  
		   if (e.target.files != undefined) {
			  
			   let reader 		=new FileReader();
			   const archivo	=$("#archivo").val();
			   				
			   reader.onload = function(e) {
					
				 let csvval= e.target.result.split("\n");
				   
				 let col='';

				 let tb='<table class="table table-bordered table-striped table-hove table-sm tabla_t">'+
								'<thead>'+
								   '<tr>'+
									    '<th >USUARIO</th>'+
					 					'<th >TRANSFERENCISTA</th>'+
										'<th >LABORATORIO</th>'+
										'<th >NÚMERO BOLETAS</th>'+
									'</tr>'+
								'</thead>'+
							'<tbody>';
				  csvval.forEach((row)=>{
						
						if(row!=''){

							let col = row.split(';');
							let codigo_sap 	 	 =col[0];
							let laboratorio      =col[1];
							let transferencista  =col[2];
							let num_boletas      =col[3];
							
							 tb+=`<tr>  
									  <td>${codigo_sap}</td>
									  <td>${laboratorio}</td>
									  <td>${transferencista}</td>
									  <td>${num_boletas}<button()" class=""><i  style="color:green; float:right" class="fas fa-check"></i></button></td>
								   </tr>`;						
						}
					  
				  });
				  tb+='</tbody>';
				  tb+='</table>';
				   
				  $("#div_tabla").html(tb); 
				   
			   }	
			   reader.readAsText(e.target.files.item(0));
		   }//  if (e.target.files != undefined) {
		   
			$("#registrar_excel").prop("disabled",false)   
		break;
		default: alert("Seleccione un tipo"); limpiar(); break;
	}
});


$("#registrar_excel").click(function(){
		
		var contador = 0;
		let datos =[];
		let total_reg=$("#div_tabla tbody tr").length
		let selectvalue = $("#archivoexc").val();
		
		clase_tabla= selectvalue =='1' ? 'tabla_c' :'tabla_t';
	    
		//console.log({total_reg});
		if (total_reg == 0) {
			return Swal.fire("Error", "La tabla debe de contener datos", "warning");
		}
	
		tabla = $(`.${clase_tabla} tbody tr`);

		tabla.each(function(index,value) {
			
			if(selectvalue=='1'){
				
				datos.push({

					codigo_sap				:$(this).find('td').eq(0).text(),
					cliente					:$(this).find('td').eq(1).text(),
					numero_boletas			:$(this).find('td').eq(2).text(),
					texto					:$(this).find('td').eq(3).text(),

				});

			 }else{
				 
				datos.push({

					codigo_sap				:$(this).find('td').eq(0).text(),
					laboratorio				:$(this).find('td').eq(1).text(),
					transferencista			:$(this).find('td').eq(2).text(),
					numero_boletas			:$(this).find('td').eq(3).text(),

				});
				   
			}

		});
		
		
	if(datos.length>0){
			
			$("#loading").show();
			$("#div_tabla").hide();
			
			if(selectvalue == '1'){
				
				guardarBoletas_C(datos).then(res=>{
				
				//return false;
				
				 
				 
				 if(res.n_errores>0){

					  const errores= res.n_errores;

						html='<ul>';

						errores.forEach(item=>{


							html+='<li>codigo '+item+'</li>';

						})	

						html+='</ul>';

						$("#div_tabla").html(html);

					}else{

						Swal.fire("Ok","Se agregaron los registros","success");
						$("#div_tabla").html('');
						//$("#div_tabla").html(html);
						$("#loading").hide();
						$("#archivo").val("");
						$("#imprimir").prop("disabled",false);
						$("#registrar_excel").prop("disabled",true);
						
					}


			})
			.catch(err=>{
				Swal.fire("Error",err.responseText,"error");
				$("#loading").hide();
				$("#div_tabla").show();
			
			});
				
			}else{
				
				$("#loading").show();
				$("#div_tabla").hide();
				
				guardarBoletas_T(datos).then(res=>{
				
				//return false;

				 if(res.n_errores>0){

					  const errores= res.n_errores;

						html='<ul>';

						errores.forEach(item=>{


							html+='<li>codigo '+item+'</li>';

						})	

						html+='</ul>';

						$("#div_tabla").html(html);

					}else{

						Swal.fire("Ok","Se agregaron los registros","success");
						$("#div_tabla").html('');
						//$("#div_tabla").html(html);
						$("#loading").hide();
						$("#archivo").val("");
						$("#imprimir").prop("disabled",false);
						$("#registrar_excel").prop("disabled",true);
					}


			})
			.catch(err=>{
				Swal.fire("Error",err.responseText,"error");
				$("#loading").hide();
				$("#div_tabla").show();
			
			});
				
		}
		
			
		   
		 }
		
		console.log(datos);
	});

});





	
   
	
	