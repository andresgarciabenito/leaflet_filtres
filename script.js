var map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 9);
//map.locate({setView: true, maxZoom: 17});
	
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//en el clusters almaceno todos los markers. se agregan con markers.addLayer(element)
var markers = L.markerClusterGroup();

var temp_data_markers= [];
var data_markers = [];

function onMapLoad() {

	console.log("Mapa cargado");

	 /*
	FASE 3.1
		1) Relleno el data_markers con una petición a la api
		2) Añado de forma dinámica en el select los posibles tipos de restaurantes
		3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
	*/

    //FASE 3.1
		//1) Relleno el data_markers con una petición a la api
		$(document).ready(function () {

			$.ajax({
				type: "GET",
				url: "restaurants.json",
				data: "data",
				dataType: "json",
				success: function (kind) {
					
					$.each(kind, function (index, item) { 
						temp_data_markers.push(item.kind_food);
					});

					//2) Añado de forma dinámica en el select los posibles tipos de restaurantes
					data_markers=Array.from(new Set(temp_data_markers));
					for(var i=0; i<data_markers.length;i++){
						$("#kind_food_selector").html( $("#kind_food_selector").html()+`
					<option>${data_markers[i]}</option>
					`);}
					

					console.log(temp_data_markers);
					console.log(data_markers);
				}
			});


		});
		//3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
		render_to_map(data_markers, 'all');
}

$('#kind_food_selector').on('change', function() {
	console.log(this.value);
  render_to_map(data_markers, this.value);
  
  
});


function render_to_map(data_markers,filter){
	/*
	FASE 3.2
		1) Limpio todos los marcadores
		2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	*/	
	
	
	$(document).ready(function () {

		//1) Limpio todos los marcadores
		markers.clearLayers();

		//2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
		$.ajax({
			type: "GET",
			url: "restaurants.json",
			data: "data",
			dataType: "json",
			success: function (data){
				
				//data_marker (son las 3 opciones) y filter (seleccion actual)
				//Evaluar que marcadores cumplen el filtro

				$.each(data, function (index, item) { 
			
					if(filter==item.kind_food){
					
					var marker = L.marker([item.lat, item.lng]).addTo(map);
					
					markers.addLayer(marker);
				
					marker.bindPopup(`Restaurante: ${item.name}<br> Dirección: ${item.address}<br> Tipo: ${item.kind_food}`).openPopup();	
					
					map.setView([41.397328, 2.154476]);
					map.setZoom(13);
					}
					
				});
			}

		});
	});	

}