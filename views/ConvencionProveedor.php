<?php session_start(); ?>
<!doctype html>
<html>

<head>
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Last-Modified" content="0">
  <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <link rel="shortcut icon" href="">
  <meta charset="utf-8">
  <title>Convencion</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DynaPuff:wght@500&display=swap" rel="stylesheet">
  <link href="../resources/fontawesome-free-6.1.2-web/css/fontawesome.min.css" rel="stylesheet" />
  <link href="../resources/fontawesome-free-6.1.2-web/css/v5-font-face.min.css" rel="stylesheet" />
  <link href="../resources/fontawesome-free-6.1.2-web/css/regular.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="../resources/select2-bootstrap4-theme/select2-bootstrap4.css">
  <link type="text/css" rel="stylesheet" href="../resources/bootstrap/bootstrap-5.0.2-dist/css/bootstrap.min.css">
  <link type="text/css" rel="stylesheet" href="../resources/plugins/jquery-ui/jquery-ui.css?<?php echo (rand()); ?>" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@8/dist/sweetalert2.min.css" id="theme-styles">
  <link title="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" />
  <link href="../resources/niceadmin/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="../resources/niceadmin/assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="../resources/niceadmin/assets/vendor/quill/quill.snow.css" rel="stylesheet">
  <link href="../resources/niceadmin/assets/vendor/quill/quill.bubble.css" rel="stylesheet">
  <link href="../resources/niceadmin/assets/vendor/remixicon/remixicon.css" rel="stylesheet">
  <link rel="stylesheet" href="../resources/select2/css/select2.css">
  <style>
    .table-list-zonas,
    .table-list-grupos tr td {
      font-size: 0.9rem;
    }

    html {
      font-size: 0.9rem;
      font-family: 'DynaPuff'
    }
    .select2-container{
		   z-index: 9999;
	  }
    .swal2-container {
    z-index: 999999; /* Ajusta este valor según sea necesario */
}


    .carousel-control-next {
      color: #5C5C5C;
      cursor: pointer;
    }

    .carousel-control-prev {
      color: #5C5C5C !important;
      cursor: pointer !important;
    }

    .input-monto {
      padding: 4px;
      border-radius: 5px;
      border: 1px solid #D4DEFF;
      outline-color: none;
      outline: none;
    }

    .data-seguimiento thead th {
      position: sticky;
      top: 0;
      background-color: #D4DEFF;
    }

    .puesto-1 {
      position: sticky;
      top: 0;
    }
    .table-zonas-monto-edit-monto tbody tr td{
      font-size: 0.8rem;
      
    }

    .table-zonas-monto-edit-monto tbody tr td input:focus{
      width: 200px;
    }
  </style>
</head>

<body>
  <input type="hidden" id="Ses_oficina" value="<?php if (!empty($_SESSION["ses_OfcVentas"])) {
                                                  echo  $_SESSION["ses_OfcVentas"];
                                                } else {
                                                  echo '';
                                                }  ?>" readonly />
  <input type="hidden" id="Ses_rol" value="<?php if (!empty($_SESSION["ses_RolesId"])) {
                                              echo  $_SESSION["ses_RolesId"];
                                            } else {
                                              echo '';
                                            }  ?>" readonly />
  <input type="hidden" id="Ses_org" value="<?php if(empty($_SESSION["ses_NumOrg"])){ echo '0'; }else{ echo $_SESSION["ses_NumOrg"];} ?>" />
  <input type="hidden" id="id_prov_mes" value="0" readonly>

  <div class="modal fade" id="ModalAddGrupo" tabindex="-1"   >
    <div class="modal-dialog modal-xl" style="z-index: 999; height: 100vh ">
      <div class="modal-content" >
        <div class="modal-header">
          <h5 class="modal-title">Agregar laboratorio / grupos articulos</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" >
    
              <!-- Bordered Tabs Justified -->
              <ul class="nav nav-tabs nav-tabs-bordered d-flex" id="borderedTabJustified" role="tablist">
                <li class="nav-item flex-fill" role="presentation">
                  <button class="nav-link w-100 active" 
                  id="home-tab" 
                  data-bs-toggle="tab" 
                  data-bs-target="#bordered-justified-home" 
                  type="button" 
                  role="tab" 
                  aria-controls="home" 
                  aria-selected="true"><i class="bi bi-columns-gap text-primary"></i> &nbsp;Agregar grupo</button>
                </li>
              </ul>
              <div class="tab-content pt-2" id="borderedTabJustifiedContent mb-3">
                <div class="tab-pane fade show active mb-3" id="bordered-justified-home" role="tabpanel" aria-labelledby="home-tab">
                   <div class="row">
                    <div class="col-3">
                      <h5>Selecciona el laboratorios</h5>
                      <div id="list_lab_prov_mes"></div>
                    </div>
                    <div class="col-5">
                      <h5>Zonas y montos</h5>
                      <div id="list_zonas_proveedor_mes" style="max-height: 80vh;overflow: auto;" ></div>
                    </div>
                    <div class="col-4">
                        <h5>Selecciona los grupos de articulos</h5>
                        <select id="list_grupos_prov_mes" style="width: 100%;" multiple class="form-select"></select>
                    </div>
                   </div>
                </div>
                <div class="tab-pane fade" id="bordered-justified-profile" role="tabpanel" aria-labelledby="profile-tab">
                  Nesciunt totam et. Consequuntur magnam aliquid eos nulla dolor iure eos quia. Accusantium distinctio omnis et atque fugiat. Itaque doloremque aliquid sint quasi quia distinctio similique. Voluptate nihil recusandae mollitia dolores. Ut laboriosam voluptatum dicta.
                </div>
              </div><!-- End Bordered Tabs Justified -->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary"  id="add_grupo_prov_mes" >Guardar</button>
        </div>
      </div>
    </div>
  </div><!-- End Extra Large Modal-->

<div class="modal fade" id="ModalEditMontoProvMes" tabindex="-1"   >
    <div class="modal-dialog modal-xl" style="z-index: 999; height: 95vh !important ; width:100vw !important ">
      <div class="modal-content" >
        <div class="modal-header">
          <h5 class="modal-title">Modificar monto </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="overflow-y: auto;">
        <input type="hidden" id="temp" value=""  readonly >
        <h4>Zonas y montos proveedor del mes</h4>    
        <div id="list_lab_zonas_prov_mes" class="table-table-responsive-xl"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
</div>

<!-- AGREGAR UNA CUOTA -->

  <div class="modal fade" id="modalAgregarMonto" tabindex="-1">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                      <h5 class="modal-title">Agregar monto</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
              <div class="modal-body">
                    <table class="table">
                        <tr>
                          <td>Zona de venta</td>
                          <td><input type="text" class="form-control" readonly id="modalAddMont-zona" ></td>
                        </tr>
                        <tr>
                          <td>Id del evento</td>
                          <td><input type="text" class="form-control" readonly id="modalAddMont-id_enc" value="0" ></td>
                        </tr>
                        <tr>
                           <td>Nombres</td>
                           <td><input type="text" readonly class="form-control" id="modalAddMont-nombre" ></td>
                        </tr>
                        <tr>
                           <td>Cuota </td>
                           <td><input type="text" readonly class="form-control" id="modalAddMont-cuota" ></td>
                        </tr>
                        <tr>
                           <td>Monto </td>
                           <td><input type="number"  class="form-control" id="modalAddMont-monto" ></td>
                        </tr>
                        <tr>
                          <td>Grupos de articulos</td>
                          <td id="modalAddMont-grupos-articulos"></td>
                        </tr>

                    </table> 
              </div>
              <div class="modal-footer">
                      <button type="button" class="btn btn-danger" data-bs-dismiss="modal" >Cerrar</button>
                      <button type="button" class="btn btn-primary" id="guardar-add-monto">Guardar</button>
              </div>
          </div>
        </div>
  </div>


  <div class="container-fluid">
    <div class="">
      <div class="card-body">
        <div class="card-title mb-2 fs-6 text-capitalize alert alert-light p-1" id="des_modulo"> </div>

        <!-- Bordered Tabs -->
        <ul class="nav nav-tabs nav-tabs-bordered alert alert-info p-0" id="borderedTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#bordered-home" type="button" role="tab" aria-controls="home" aria-selected="true"><i class="bi bi-card-checklist"></i>&nbsp;Eventos activos</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#bordered-profile" type="button" role="tab" aria-controls="profile" aria-selected="false"><i class="bi bi-bookmark-plus"></i>&nbsp;Crear Provedor mes</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#bordered-contact" type="button" role="tab" aria-controls="contact" aria-selected="false"><i class="bi bi-compass"></i>&nbsp;Seguimiento</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="ranking-tab" data-bs-toggle="tab" data-bs-target="#bordered-ranking" type="button" role="tab" aria-controls="ranking" aria-selected="false"><i class="fa-solid fa-ranking-star"></i>&nbsp;Ranking</button>
          </li>
          <li class="nav-item" role="presentation" style="display: <?php
            if($_SESSION["ses_RolesId"]!=1  &&  $_SESSION["ses_RolesId"]!=118){
              echo  'none';
            }
          ?>" >
            <button 
            class="nav-link" 
            id="general-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#bordered-general" 
            type="button" 
            role="tab" 
            aria-controls="general" 
            aria-selected="false">
              <i class="fa-solid fa-chart-line"></i>&nbsp;Seg. General</button>
          </li>
        </ul>
        <div class="tab-content pt-2" id="borderedTabContent">
          <div class="tab-pane fade show active" id="bordered-home" role="tabpanel" aria-labelledby="home-tab">
            <div class="row">
              <div class="col">
                <label class="m-1">Título</label>
                <div class="input-group mb-3"> <span class="input-group-text text-primary"> <i class="bi bi-card-text"></i> </span>
                  <input type="text" class="form-control" id="filter_titulo" maxlength="50">
                </div>
              </div>
              <div class="col">
                <label class="m-1">Oficina</label>
                <div class="input-group mb-3">
                  <span class="input-group-text text-primary">
                    <i class="bi bi-geo-alt"></i>
                  </span>
                  <select class="form-select" id="filter_oficina"></select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <label class="m-1">Fecha inicio</label>
                <div class="input-group mb-3"> <span class="input-group-text text-primary"><i class="bi bi-calendar-date"></i></span>
                  <input class="form-control" id="filter_fecha_inicio" readonly>
                </div>
              </div>
              <div class="col">
                <label class="m-1">Fecha final</label>
                <div class="input-group mb-3">
                  <span class="input-group-text text-primary">
                    <i class="bi bi-calendar-date"></i>
                  </span>
                  <input class="form-control" id="filter_fecha_final" readonly>
                </div>
              </div>
            </div>

            <div id="listado_proveedor_mes"></div>

          </div>
          <div class="tab-pane fade" id="bordered-profile" role="tabpanel" aria-labelledby="profile-tab">
            <div class="card shadow p-3" id="pagina1" style="height: 90vh">
              <form class="form" id="form" novalidate>
                <div class="row">
                  <div class="col">
                    <label class="m-1">Título</label>
                    <div class="input-group mb-3"> <span class="input-group-text text-primary"> <i class="bi bi-card-text"></i> </span>
                      <input type="text" class="form-control" id="titulo" name="titulo" minlength="20" maxlength="50" required>
                    </div>
                  </div>
                  <div class="col">
                    <label class="m-1">Oficina</label>
                    <div class="input-group mb-3"> <span class="input-group-text text-primary"> <i class="bi bi-geo-alt"></i> </span>
                      <select class="form-select" id="oficina_creacion" required>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <label class="m-1">Fecha inicio</label>
                    <div class="input-group mb-3"> <span class="input-group-text text-primary"><i class="bi bi-calendar-date"></i></span>
                      <input class="form-control" id="fecha_inicio" name="fecha_inicio" readonly required>
                    </div>
                  </div>
                  <div class="col">
                    <label class="m-1">Fecha final</label>
                    <div class="input-group mb-3"> <span class="input-group-text text-primary"><i class="bi bi-calendar-date"></i></span>
                      <input class="form-control" id="fecha_final" name="fecha_final" readonly required>
                    </div>
                  </div>
                </div>
                <div class="row mb-2">
                  <div class="col text-center">
                    <button style="display: none;" class="btn btn-outline-danger" id="BtnCancelarAddLab" type="button"> Cancelar <i class="bi bi-times fa-1x"></i> </button>
                    <button class="btn btn-outline-primary" id="BtnNext" type="button"> Siguiente <i class="bi bi-arrow-right fa-1x"></i> </button>
                  </div>
                </div>
              </form>
            </div>
            <div id="pagina2" class=" shadow p-3  d-none">
              <div class="d-flex justify-content-center mb-4">
                <div class="card shadow flex-fill mx-2 btn btn-outline-light" id="btn-cargar-csv" style="width: 150px">
                  <div class="card-title text-center text-dark">Cargar CSV</div>
                  <div class="card-body text-center"> <i class="bi bi-file-earmark-arrow-up fa-2xl text-dark"></i> </div>
                  <div class="card-footer text-black-50 text-start"> <span class="text-left">*Debes crear un archivo .CSV separado por ';'.</span><br>
                    <span class="text-left">*La columnas deben ser. Zona(sólo código),grupo de articulo,monto,nombre laboratorio</span>
                  </div>
                </div>
                <div class="card shadow flex-fill mx-2 btn btn-outline-light " id="btn-asistente" style="width: 150px">
                  <div class="card-title text-center text-dark">Asistente</div>
                  <div class="card-body text-center"> <i class="fa-solid fa-wand-magic-sparkles fa-2xl text-dark"></i> </div>
                  <div class="card-footer text-black-50 text-start"> <span class="text-left">*Calcula los promedios trimestrales por zonas por grupos de articulos</span><br>
                    <span class="text-left">*Te guía paso a paso para el montaje del proveedor del mes</span>
                  </div>
                </div>
              </div>
              <div class="row mb-2">
                <div class="col text-center">
                  <button class="btn btn-outline-danger BtnBack" type="button"> <i class="bi bi-arrow-left fa-1x"></i> Atrás </button>
                </div>
              </div>
            </div>
            <div class="card shadow d-none" id="pagina3">
              <div class="card-title p-2">Carga de archivo csv</div>
              <div class="card-body mb-2">
                <div class="mb-3">
                  <div class="input-group mb-3">
                    <input class="form-control" type="file" id="formFile">
                    <button class="btn btn-outline-success"><i class="bi bi-upload"></i>&nbsp; Previsializar</button>
                    <button class="btn btn-outline-warning"><i class="bi bi-eraser"></i>&nbsp; Limpiar</button>
                    <button class="btn btn-outline-danger"><i class="bi bi-save"></i>&nbsp; Guardar</button>
                  </div>
                </div>
              </div>
              <div class="row mb-2">
                <div class="col text-center">
                  <button class="btn btn-outline-danger BtnBack" type="button"> <i class="bi bi-arrow-left fa-1x"></i> Atrás </button>
                </div>
              </div>
              <div class="card-footer">
                <h5>Archivo csv cargado</h5>
                <div id="previw-csv"></div>
              </div>
            </div>
            <div class=" shadow d-none  " id="pagina4">
              <div class="row">
                <div class="col">
                  <div class="card shadow p-1 paso1" style="height: 76vh">
                    <div class="card-title">
                      <div class="d-flex justify-content-between">
                        <div class="text-start fs-5"><b>Paso 1: Selecciona los laboratorios</b></div>
                        <div class="text-end ">
                          <button class="btn btn-sm text-end cerrar-total" type="button"> <i class="bi bi-x fa-2x"></i> </button>
                        </div>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-3">
                          <h5><i class="bi bi-truck"></i> &nbsp;Laboratorio</h5>
                          <select class="form-select" id="list_proveedores" onChange="listarGrupos()">
                          </select>
                        </div>
                        <div class="col-5">
                          <h5><i class="bi bi-columns-gap"></i> &nbsp;Grupo de articulo</h5>
                          <div class="input-group mb-3">
                            <input type="text" placeholder="Nombre laboratorio" class="form-control mb-2" id="nombre_lab">
                            <span class="" id="basic-addon1">
                              <button id="agregar_grupo" type="button" class="btn btn-outline-primary">
                                Agregar&nbsp;<i class="bi bi-arrow-right-short "></i>
                              </button>
                              <button id="seleccionar_todo" type="button" class="btn btn-outline-danger">
                                Seleccionar todos&nbsp;<i class="bi bi-list-check "></i>
                              </button>

                            </span>
                          </div>
                          <select class="form-select mb-3" multiple id="list_grupos">
                          </select>
                          <div class="row">
                            <div class="col">
                            <label>Cuota del proveedor</label>
                            <div class="input-group mb-3">
                                <span class="input-group-text ">
                                <i class="fa-solid fa-dollar-sign"></i>
                                </span>
                                <input type="number" id="cuota_proveedor" class="form-control form-control-sm">
                            </div>
                              
                            </div>
                          </div>
                        </div>
                        <div class="col-4">
                          <h5><i class="bi bi-arrow-left-right"></i> &nbsp;Laboratorio seleccionados</h5>
                          <div id="list_grupos_selected" style="max-height: 300px; overflow: auto"></div>
                        </div>
                      </div>
                    </div>
                    <div class="text-center card-footer ">
                      <button class="btn btn-outline-success" id="paso2"> Siguiente &nbsp; <i class="bi bi-arrow-right-short"></i> </button>
                    </div>
                  </div>
                  <!-- card -->
                  <div class="paso2 " style="display: none">
                    <div class="card shadow" id="div_calculo_montos" style="height: 76vh">
                      <div class="card-title">
                        <div class="d-flex justify-content-between">
                          <div class="text-start fs-5"><b>Paso 2: Seleccionar zonas de ventas</b></div>
                          <div class="text-end ">
                            <button class="btn btn-sm text-end cerrar-total" type="button"> <i class="bi bi-x fs-5 text-black-50"></i> </button>
                          </div>
                        </div>
                      </div>
                      <div class="card-body">
                        <div class="row">
                          <div class="col" id="listado_zonas_ventas" style="height:66vh; overflow: auto"></div>
                          <div class="col" style="height:66vh;">
                            <div id="info_list_grupos_selected" style="height:60vh;overflow: auto"></div>
                          </div>
                          <div class="col" style="height: 70vh; overflow: auto">
                            <label class="mb-2"> Porcentaje de crecimiento</label>
                            <div class="input-group mb-3">
                              <input type="text" class="form-control" id="crecimiento" size="2" maxlength="2" onKeyPress="return vnumeros(event)">
                              <span class="input-group-text" id="basic-addon1">%</span>
                            </div>
                            <button class="btn btn-outline-danger" id="calcular_montos"><i class="bi bi-calculator"></i>&nbsp;Calcular montos</button>
                          </div>
                        </div>
                      </div>
                      <div class="card-footer text-center">
                        <button class="btn btn-outline-danger  atras-paso1"> <i class="bi bi-arrow-left-short"></i>&nbsp; Atras </button>
                      </div>
                    </div>
                    <div class="card shadow ultimo_paso" style="display: none" style="height: 65vh; overflow: auto">
                      <div class="card-title">
                        <div class="d-flex justify-content-between">
                          <div class="text-start fs-5"><b>Paso 3: Validación y edición de montos</b></div>
                          <div class="text-end ">
                            <button class="btn btn-sm  cerrar-paso3 text-end cerrar-total" type="button"> <i class="bi bi-x fa-2x "></i> </button>
                          </div>
                        </div>
                      </div>
                      <div id="zonas_montos" style="height: 65vh; overflow: auto;overflow-x: auto" class="table-responsive-lg"></div>
                      <div class="text-center card-footer ">
                        <button class="btn btn-outline-danger  atras-paso2"> <i class="bi bi-arrow-left-short"></i>&nbsp; Atras </button>
                        <button class="btn btn-outline-success " id="guardar_proveedores"> <b>GUARDAR</b> &nbsp; <i class="bi bi-save2"></i> </button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
						<span class="carousel-control-prev-icon text-dark" aria-hidden="true"></span>
						<span class="visually-hidden"><i class="fa fa-arrow-circle-left"></i>Previous</span>
					  </button>
					  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
						<span class="carousel-control-next-icon" aria-hidden="true"></span>
						<span class="visually-hidden">Next</span>
					  </button>-->
              </div>
            </div>
          </div>
          <div class="tab-pane fade show" id="bordered-contact" role="tabpanel" aria-labelledby="contact-tab">

            <hr>
            <div class="card">

              <div class="row">
                <div class="col-12">
                  <h4 class="text-center">Cumplimiento general</h4>
                  <canvas id="pieChart" style="max-height: 200px;"></canvas>
                </div>
              </div>
            </div>
            <div class="table-responsive-lg" id="seguimiento_proveedor"></div>
          </div>
          <div class="tab-pane fade show" id="bordered-ranking" role="tabpanel" aria-labelledby="ranking-tab">
            <div class="d-flex justify-content-center">
              <div id="ranking" class="card shadow p-3 mt-3" style="width:50vw"></div>
            </div>
          </div>
          <div class="tab-pane fade show" id="bordered-general" role="tabpanel" aria-labelledby="general-tab">
            <div class="row">
              <div class="col">
                 <label>Fecha inicial</label>
                 <div class="input-group mb-3">
                      <span class="input-group-text" >
                         <i class="bi bi-calendar-date"></i>
                      </span>
                      <input type="date" class="form-control"  id="seg-gen-fecha_inicial" >
                  </div>
              </div>
              <div class="col">
                 <label>Fecha inicial</label>
                 <div class="input-group mb-3">
                      <span class="input-group-text" >
                         <i class="bi bi-calendar-date"></i>
                      </span>
                      <input type="date" class="form-control"  id="seg-gen-fecha_final"  >
                  </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                 <label>Organizacion</label>
                 <div class="input-group mb-3">
                      <span class="input-group-text" >
                         <i class="bi bi-pin-map" ></i>
                      </span>
                      <select class="form-select" id="seg-gen-org">
                         
                      </select>
                  </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <button class="btn btn-primary " id="seg-gen-consultar"><i class="bi bi-search" ></i>&nbsp;Consultar</button>
                <button class="btn btn-success " id="seg-gen-excel"><i class="bi bi-file-excel" ></i>&nbsp;Excel</button>
              </div>
            </div>
              <div id="result_general" class="mt-3"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- End Bordered Tabs -->
  </div>
  </div>
  </div>
  <script type="text/javascript" src="../resources/plugins/jquery/jquery.min.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../resources/plugins/jquery-ui/jquery-ui.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../resources/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.min.js?<?php echo (rand()); ?>"></script>
  <script src="../resources/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@8/dist/sweetalert2.min.js"></script>
  <script src="../resources/niceadmin/assets/vendor/chart.js/chart.umd.js"></script>
  <script src="../resources/niceadmin/assets/vendor/echarts/echarts.min.js"></script>
  <script src="../controllers/humana/Storage.js"></script>
  <script type="text/javascript" src="../lib/js/servicios.js?<?php echo (rand()); ?>"></script>
  <script type="text/javascript" src="../lib/js/funciones.js?<?php echo (rand()); ?>"></script>
  <script src="../resources/plugins/fullcalendar-6.1.10/dist/index.global.min.js"></script>
  <script src="../resources/select2/js/select2.full.min.js"></script>
  <script type="text/javascript" src="../controllers/ConvencionProveedor.js?<?php echo (rand()); ?>"></script>
</body>

</html>