function volver(){
    window.location='Menu.php';
    load_cat=0;	
}

const cargarModulos=async ()=>{

    try{
        const  grupo = $('#grupo').val();

        if(grupo==''){
            return;
        }

        resp =await enviarPeticion({
            link :"../models/Menu.php",
            grupo,
            op:'CargarModulos'
        });
        let html = '';
        resp.forEach(element => {
            html += `
                <button onclick="CargarPagina('${element.archivo}.php', this)"
                        id="m${element.numero}"
                        class="col mb-3 border border-1 border-light rounded-2 shadow ">
                    <div class="text-center btn-menu">
                        <p class="p-numeros mb-3"><b>${element.numero}</b></p>
                        <img src="../resources/icons_modulos/${element.numero.substring(0,2)}/${element.numero}.png"
                             class="img-fluid mb-2"
                             width="70"
                             height="70"
                             alt="Icon">
                        <p class="mb-0 p-titulo">${element.titulo}</p>
                    </div>
                </button>`;
        });
        $("#list-modulos").html(html);

    }catch(e){
        console.error(e)
    }

}



$(async function(){

    await datosPerfil();
    await cargarModulos();

    setInterval('VerificarSession()',6000);

    setInterval(function(){
		pedidosPendientes()
	},6000)

    
    $("#a_cerrar_all").click(function () {
        id = $("#IdUser").val();
        window.location = "../models/Logout.php?id_get=" + id;
      });

      $("#guardarpass").click(async function(){
        showLoadingSwalAlert2('Guardando cambios',false)
        id=$("#IdUser").val();
        passact	=$.trim($("#passact").val());
       
         if(isNaN(parseInt(id)) || id==0){
            Swal.fire("Error","No se detecto una sesión activa","error")
            return;
         }
         
    
         if(passact==''){
            Swal.fire("Ups","Debe digitar la clave actual","warning")
            return;
         }
    
        //verifico que la nueva contraseña no sea vacia
        if($.trim($("#passnew").val())==""){
            dissminSwal()
            Swal.fire("Ups","Debe digitar la nueva clave","warning")
            return;
        }
    
        if($.trim($("#passconf").val())==""){
            dissminSwal()
            Swal.fire("Ups","Debe digitar confirmar la nueva clave","warning")
            return;
        }
    
    
        if($("#passnew").val()!=$("#passconf").val()){
            dissminSwal()
            Swal.fire("Ups","La nueva clave es diferente a la clave de confirmacion","warning")
          return;
        }
    
        await verificarPassAct(id,passact);
    
        ChangePass();			 
        dissminSwal()			
     });


    if($("#AbrirVentas").val()!=0){
		$("#m0101").trigger("click");
   }
})