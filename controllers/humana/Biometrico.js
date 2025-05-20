function SetHora(sl,id){
	
	op='';
	for(var i=0;i<=23;i++){
		

		if(i==sl){
		     op+='<option selected value="'+i+'">'+i+'</option>';
		   }else{
			   op+='<option value="'+i+'">'+i+'</option>';
		   }
		
	}
	$("#"+id).html(op);

}


function validarnumero(e,valor,ob){
	
  if(valor>59){
	 $(ob).val("");
  }	
	
}


function RegiostroBiometrico(){
	
	var oficina    = $("#oficinas").val();
	var fecha_ini  = $("#fecha_i").val();
	var fecha_fin  = $("#fecha_f").val();
	var biometrico = $("#biometrico").val();
	
		  $.ajax({ type    : "POST",
				   url     : "../../models/humana/Biometrico.php",
				   dataType: "json",
				   async   : true,
				   data: {
							op      : "S",
					   		oficina : oficina,
					        fecha_ini:fecha_ini,
					        fecha_fin:fecha_fin,
					        biometrico:biometrico
						},
				 beforeSend:function(){
						div='<div class="alert alert-warning" role="alert">'+
							  'Cargando...'+
							'</div>';
					  $("#result").html(div); 
				 },
				  success: function(data){
					console.log(data)
				   //alert(data);
					 // return false;
					  console.log(data);
					  if(data.length>0){
						 tb='<table class="table" id="tdBiometrico">'+
							  '<thead class="thead-dark">'+
								'<tr>'+
								  '<th scope="col">#Id</th>'+
								  '<th scope="col">Año</th>'+
								  '<th scope="col">Mes</th>'+
								  '<th scope="col">Dia</th>'+
							      '<th scope="col">Hora</th>'+
							      '<th scope="col">Minuto</th>'+
							      '<th scope="col">Handle</th>'+
								 '<th scope="col">Biometrico</th>'+
								 '<th scope="col">Estado</th>'+
								 '<th scope="col">Cedula</th>'+
								 '<th scope="col">Nombres</th>'+
								 '<th scope="col">Cargo</th>'+
								 '<th scope="col">LLegada</th>'+
								'</tr>'+
							  '</thead>'+
							  '<tbody>';
						  
						  for(var i=0;i<data.length;i++){
							  d=data[i];
							  tb+='<tr>'+
								      '<td>'+(d.id)+'</td>'+
								      '<td>'+d.ano+'</td>'+
									  '<td>'+d.mes+'</td>'+
									  '<td>'+d.dia+'</td>'+
									  '<td>'+d.hora+'</td>'+
									  '<td>'+d.minuto+'</td>'+
									  '<td>'+d.fecha+'</td>'+
									  '<td>'+d.biometrico+'</td>'+
									  '<td>'+d.estado+'</td>'+
									  '<td>'+d.cedula+'</td>'+
									  '<td>'+d.nombres+'</td>'+
								      '<td>'+d.cargo+'</td>'+
								      '<td>'+d.llegada+'</td>'+
									  
								'</tr>';
						  }//for
						 
						  $("#result").html(tb);
					  }else{
						  
						  div='<div class="alert alert-danger" role="alert">'+
							  'No se encontraron resultados'+
							'</div>';
					      $("#result").html(div); 
					     }
				  }
				 }).fail(function(data){
			       	      div='<div class="alert alert-danger" role="alert">'+
							  '<b>Error al cargar la información '+data+
							'</b></div>';
					      $("#result").html(div); 
			  			console.log(data);
		  });
}

$(function(){
	
    var option = '';
	var op_b='';
	if($("#Org").val()=='1000'){
	  if($("#Ofc").val()=='1100'){
	     option = '<option class="dropdown-item" href="#" value="1100" selected>Monteria</option>'+
		          '<option class="dropdown-item" href="#" value="1200">Cartagena</option>';	 
	  }else{
		  option = '<option class="dropdown-item" href="#" value="1100" >Monteria</option>'+
		          '<option class="dropdown-item" href="#" value="1200" selected>Cartagena</option>';	 
	  }

		
	}else{
		if($("#Ofc").val()=='2100'){
  	       option = '<option class="dropdown-item" href="#" value="2100" selected>Medellin</option>'+
		            '<option class="dropdown-item" href="#" value="2200">Bogota</option>'+			
					'<option class="dropdown-item" href="#" value="2300">Cali</option>'+			
					'<option class="dropdown-item" href="#" value="2400">Barranquilla</option>';			
		}else{
	  	     option ='<option class="dropdown-item" href="#" value="2100" >Medellin</option>'+
		              '<option class="dropdown-item" href="#" value="2200" selected>Bogota</option>'+
					  '<option class="dropdown-item" href="#" value="2300">Cali</option>'+					
					  '<option class="dropdown-item" href="#" value="2400">Barranquilla</option>';						
		}

	}		
	$("#oficinas").html(option);
	
	
	$("#oficinas").change(function(){
		ofic=$.trim($(this).val());
		switch(ofic){
			   
			case "1100":
				op_b = '<option class="dropdown-item" href="#" value="1">Admon Monteria</option>'+
		               '<option class="dropdown-item" href="#" value="2">Bod Monteria</option>';
			break;
			case "1200":
				op_b = '<option class="dropdown-item" href="#" value="3">Cartagena</option>';
			break;
			case "2100":
			    op_b = '<option class="dropdown-item" href="#" value="7">Admon Medellin (7)</option>'+
				       '<option class="dropdown-item" href="#" value="8">Bodega Medellin (8)</option>';
			break;
			case "2200":
			    op_b = '<option class="dropdown-item" href="#" value="1">Admon Bogota (1)</option>'+
				       '<option class="dropdown-item" href="#" value="2">Bodega Bogota (2)</option>';
			break;
			case "2300":
			    op_b = '<option class="dropdown-item" href="#" value="4">Admon Cali (4)</option>'+
			           '<option class="dropdown-item" href="#" value="3">Bodega Cali (3)</option>';
			break;
			case "2400":
			    op_b = '<option class="dropdown-item" href="#" value="5">Admon Barranquilla (5)</option>'+
			           '<option class="dropdown-item" href="#" value="6">Bodega Barranquilla (6)</option>';
			break;
	   }
		$("#biometrico").html(op_b);
	});
	
	$("#oficinas").trigger("change");
	$("#fecha_i,#fecha_f").val(FechaActual());
	$("#fecha_i,#fecha_f").datepicker({ 
	 	 minDate: 0,
	     multidate: false,
	     changeMonth: true,
	     changeYear: true,
		 monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio', 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
		 monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], 
	     format: 'dd-mm-yyyy',
		 width:100,
		 heigth:100,});
	
	
	$("#btn_buscar").click(function(){
		RegiostroBiometrico();
	});
	$("#btn_exportar").click(function(){
		fnExcelReport('tdBiometrico');
	});
	
	
});
