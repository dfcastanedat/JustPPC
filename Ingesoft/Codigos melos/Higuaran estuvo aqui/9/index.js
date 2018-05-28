//Funcion import Safety JSON
const URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$where=cmplnt_fr_dt=%222015-12-31T00:00:00%22";

var safetyData = [];
function getSafetyData(URL){
var data = $.get(URL, function(){
  console.log(URL)
})
  .done( function(){
    //Success
    //console.log(data);
    safetyData = data.responseJSON;
  })
  .fail( function(error){
    console.error(error);
  })
}
//getSafetyData(URL);


//Funcion import Housing JSON
const HousingURL = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";

var housingData = [];
function getHousingData(HousingURL){
var data = $.get(HousingURL, function(){
  console.log(HousingURL)
})
  .done( function(){
    //Success
    //console.log(data);
    housingData = data.responseJSON.data;
  })
  .fail( function(error){
    console.error(error);
  })
}
//getHousingData(HousingURL);


//Funcion import Museums JSON
const MuseumsURL = "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD";

var museumsData = [];
function getMuseumsData(MuseumsURL){
var data = $.get(MuseumsURL, function(){
  console.log(MuseumsURL)
})
  .done( function(){
    //Success
    //console.log(data);
    museumsData = data.responseJSON.data;
  })
  .fail( function(error){
    console.error(error);
  })
}
//getMuseumsData(MuseumsURL);

$(document).ready( function(){
  getSafetyData(URL);
  getHousingData(HousingURL);
  getMuseumsData(MuseumsURL);
  $("#updateButton").on("click", countCrimes);
})

//Funciones------------------------------------------------------------------------
var times=0;
function countCrimes(){
  var statenIsland = 0;
  var queens = 0;
  var bronx = 0;
  var manhattan = 0;
  var brooklyn = 0;
  //conteo crimenes por distritos
  for (var c = 0; c < safetyData.length; c++) {
    var prueba = safetyData[c].boro_nm;
    if (prueba=="STATEN ISLAND"){
      statenIsland=statenIsland+1;
    }else if (prueba=="QUEENS") {
      queens=queens+1;
    }else if (prueba=="BRONX") {
      bronx=bronx+1;
    }else if (prueba=="MANHATTAN") {
      manhattan=manhattan+1;
    }else if (prueba=="BROOKLYN") {
      brooklyn=brooklyn+1;
    }
  }
  //ordenarDatos
  var arreglo = [];
  arreglo.push(statenIsland,queens,bronx,manhattan,brooklyn);
  for (var i = 0 ; i < arreglo.length - 1 ; i++) {
      var min = i;

      //buscar numero menor
      for (var j = i + 1 ; j < arreglo.length ; j++) {
          if (arreglo[j] < arreglo[min]) {
              min = j;
          }
      }

      if (i != min) {
          //permutar los valores
          var aux = arreglo[i];
          arreglo[i] = arreglo[min];
          arreglo[min] = aux;
      }
  }
  //manejo tabla
  tableReference = $("#bodyRanking")[0];
  var newRow;
  var district;
  var distance;
  var safety;
  var rank;
  var vari;

  if (times==0) {
    for (var i = 0; i < arreglo.length; i++) {
      newRow = tableReference.insertRow(tableReference.rows.length);
      district = newRow.insertCell();
      distance = newRow.insertCell();
      safety = newRow.insertCell();
      rank = newRow.insertCell();

      if (arreglo[i]==statenIsland){
        district.innerHTML = "<h6>Staten Island</h6>";
      }else if (arreglo[i]==queens) {
        district.innerHTML = "<h6>Queens</h6>";
      }else if (arreglo[i]==bronx) {
        district.innerHTML = "<h6>Bronx</h6>";
      }else if (arreglo[i]==manhattan) {
        district.innerHTML = "<h6>Manhattan</h6>";
      }else if (arreglo[i]==brooklyn) {
        district.innerHTML = "<h6>Brooklyn</h6>";
      }
      distance.innerHTML = "<h6>Distance</h6>";
      safety.innerHTML = arreglo[i];
      rank.innerHTML = i+1;
      times++;
    }
  }


}

//Google Map------------------------------------------------------------------------
  function initMap(){
    //default
    //map options
    var options = {
      zoom:12,
      center: {lat:40.7291,lng:-73.9965}   //lat long New York (NYU Stern School of Business)
    }
    //map options
    var optionsAirport = {
      zoom:11,
      center: {lat:40.7292,lng:-73.9966}   //lat long New York (NYU Stern School of Business)
    }


    //New map Housing
    var map = new google.maps.Map(document.getElementById('map'),options);
    var marker = new google.maps.Marker({
      position:{lat:40.7291,lng:-73.9965},     //lat long NYU Stern School of Business
      icon: 'http://maps.google.com/mapfiles/kml/pal3/icon21.png',
      map:map
    });

    //Si se oprime el boton NY Map
    document.getElementById("icono1").addEventListener("click", function () {
      //New map Housing
      var map = new google.maps.Map(document.getElementById('map'),options);
    });

    //Si se oprime el boton de Housing
    document.getElementById("icono2").addEventListener("click", function () {
      //New map Housing
      var map = new google.maps.Map(document.getElementById('map'),options);
      for (var w = 0; w < housingData.length; w++) {
        var latiHous = parseFloat(housingData[w][23]);
        var longiHous = parseFloat(housingData[w][24]);
        //Agreger marcador
        var marker = new google.maps.Marker({
          position:{lat:latiHous,lng:longiHous},     //lat long NYU Stern School of Business
          icon: 'http://maps.google.com/mapfiles/kml/pal2/icon10.png',
          map:map
        });
      }
    });

    //Si se oprime el boton de Districts
    document.getElementById("icono3").addEventListener("click", function () {

      //New map Districts
      var map = new google.maps.Map(document.getElementById('map'),options);

      //Graficar distritos
      map.data.loadGeoJson('https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');
      //Estilo del mapa, color, grosor linea
      map.data.setStyle({
        fillColor: 'white',   //color poligono
        strokeWeight: 1,       //grosor borde
        strokeColor: 'grey'   //color borde
      });
      //cambia color mientras el cursor esté sobre el area
      map.data.addListener('mouseover', function(event) {
        map.data.overrideStyle(event.feature, {fillColor: 'red'});
      });
      //cambia color cuando el cursor sale del Area
      map.data.addListener('mouseout', function(event) {
        map.data.overrideStyle(event.feature, {fillColor: 'white'});
      });
    });

    //Si se oprime el boton de Safety
    document.getElementById("icono4").addEventListener("click", function () {

      //New map Housing
      var map = new google.maps.Map(document.getElementById('map'),options);
      //Marcar puntos de crimenes
      for (var i = 0; i < safetyData.length; i++) {
        var lati = parseFloat(safetyData[i].latitude);
        var longi = parseFloat(safetyData[i].longitude);

        //Agreger marcador
        var marker = new google.maps.Marker({
          position:{lat:lati,lng:longi},     //lat long NYU Stern School of Business
          icon: 'http://maps.google.com/mapfiles/kml/pal4/icon49.png',
          map:map
        });
      }
    });

    //Si se oprime el boton de Tourism-Mouseums
    document.getElementById("icono5").addEventListener("click", function () {
      //New map Museums
      var map = new google.maps.Map(document.getElementById('map'),options);

      for (var a = 0; a < museumsData.length; a++) {
        var arrLong = museumsData[a][8].substr(7,19);
        var arrLat = museumsData[a][8].substr('26','45');

        var arrLati = arrLat.split(")");

        var longit = parseFloat(arrLong);
        var latit = parseFloat(arrLati[0]);
        //Agreger marcador museos
        var marker = new google.maps.Marker({
          position:{lat:latit,lng:longit},
          icon: 'http://maps.google.com/mapfiles/ms/micons/homegardenbusiness.png',
          map:map
        });
      }


      //Agreger marcador
      var marker = new google.maps.Marker({
        position:{lat:40.689249400,lng:-74.044500400},    //Statue of Liberty
        icon: 'http://maps.google.com/mapfiles/kml/pal4/icon46.png',
        map:map
      });
      var marker = new google.maps.Marker({
        position:{lat:40.782864700,lng:-73.965355100},     //Central Park
        icon: 'http://maps.google.com/mapfiles/kml/pal4/icon46.png',
        map:map
      });
      var marker = new google.maps.Marker({
        position:{lat:40.748817,lng:-73.985428},     //Empire State
        icon: 'http://maps.google.com/mapfiles/kml/pal4/icon46.png',
        map:map
      });
      var marker = new google.maps.Marker({
        position:{lat:40.758896,lng:-73.985130},     //Times Square
        icon: 'http://maps.google.com/mapfiles/kml/pal4/icon46.png',
        map:map
      });
      var marker = new google.maps.Marker({
        position:{lat:40.759487,lng:-73.978356},     //Rockefeller Center
        icon: 'http://maps.google.com/mapfiles/kml/pal4/icon46.png',
        map:map
      });
    });

    //Si se oprime el boton Bicycle
    document.getElementById("icono6").addEventListener("click", function () {

      //New map Housing
      var map = new google.maps.Map(document.getElementById('map'),options);
      var bikeLayer = new google.maps.BicyclingLayer();
      bikeLayer.setMap(map);
    });

    //Si se oprime el boton Transit
    document.getElementById("icono7").addEventListener("click", function () {

      //New map Transit
      var map = new google.maps.Map(document.getElementById('map'),options);
      var transitLayer = new google.maps.TransitLayer();
      transitLayer.setMap(map);

    });

    //Si se oprime el boton Traffic
    document.getElementById("icono8").addEventListener("click", function () {

      //New map Housing
      var map = new google.maps.Map(document.getElementById('map'),options);

      var trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(map);

    });

    //Si se oprime el boton Airport
    document.getElementById("icono9").addEventListener("click", function () {
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;

      //New map Housing
      var map = new google.maps.Map(document.getElementById('map'),optionsAirport);
      //Agreger marcador
      directionsDisplay.setMap(map);

      var request = {
         origin: {lat:40.641311100,lng:-73.778139100},
         destination: {lat:40.7291,lng:-73.9965},
         travelMode: 'DRIVING'
       };
       directionsService.route(request, function(result, status) {
         if (status == 'OK') {
           directionsDisplay.setDirections(result);
         }
       });

    });

    //Si se oprime el boton Distance
    document.getElementById("icono10").addEventListener("click", function () {

      //New map Distance
      var map = new google.maps.Map(document.getElementById('map'),options);

    });

  }



  //Cargar primero todo el cuerpo de la pagina antes que el mapa
  google.maps.event.addDomListener(window,'load',initMap);
