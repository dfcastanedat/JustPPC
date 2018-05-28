const urlGIS = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json";
const urlGeo = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson"
const urlCrimesOpt = "https://data.cityofnewyork.us/resource/9s4h-37hy.json"
  const urlHouse = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json"
const urlGeoCr = "https://data.cityofnewyork.us/resource/9s4h-37hy.geojson?$where=cmplnt_fr_dt=%222015-12-31T00:00:00%22"
const urlCrimes = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$where=cmplnt_fr_dt=%222015-12-31T00:00:00%22"

var map;
var jsonGIS;
var jsonGeo;
var jsonCrimes;
var jsonHouse;
var jsonGeoCr;
var nInput;

var mainIdTable = {
  "DistrictID1":[],
  "DistrictID2":[],
  "DistrictID3":[],
  "DistrictID4":[],
  "DistrictID5":[],
  "DistrictID6":[],
  "DistrictID7":[],
  "DistrictID8":[],
  "DistrictID9":[],
  "DistrictID10":[],
  "DistrictID11":[],
  "DistrictID12":[],
  "DistrictID13":[],
  "DistrictID14":[],
  "DistrictID15":[],
  "DistrictID16":[],
  "DistrictID17":[],
  "DistrictID18":[],
  "DistrictID19":[],
  "DistrictID20":[],
  "DistrictID21":[],
  "DistrictID22":[],
  "DistrictID23":[],
  "DistrictID24":[],
  "DistrictID25":[],
  "DistrictID26":[],
  "DistrictID27":[],
  "DistrictID28":[],
  "DistrictID29":[],
  "DistrictID30":[],
  "DistrictID31":[],
  "DistrictID32":[],
  "DistrictID33":[],
  "DistrictID34":[],
  "DistrictID35":[],
  "DistrictID36":[],
  "DistrictID37":[],
  "DistrictID38":[],
  "DistrictID39":[],
  "DistrictID40":[],
  "DistrictID41":[],
  "DistrictID42":[],
  "DistrictID43":[],
  "DistrictID44":[],
  "DistrictID45":[],
  "DistrictID46":[],
  "DistrictID47":[],
  "DistrictID48":[],
  "DistrictID49":[],
  "DistrictID50":[],
  "DistrictID51":[],
  "DistrictID52":[],
  "DistrictID53":[],
  "DistrictID54":[],
  "DistrictID55":[],
  "DistrictID56":[],
  "DistrictID57":[],
  "DistrictID58":[],
  "DistrictID59":[],
  "DistrictID60":[],
  "DistrictID61":[],
  "DistrictID62":[],
  "DistrictID63":[],
  "DistrictID64":[],
  "DistrictID65":[],
  "DistrictID66":[],
  "DistrictID67":[],
  "DistrictID68":[],
  "DistrictID69":[],
  "DistrictID70":[],
  "DistrictID71":[]
}

$(document).ready(function(){

  $.getJSON(urlGIS, function(dataOriginal){
    jsonGIS = dataOriginal;
    console.log('Gis');
    console.log(dataOriginal);
  })
  $.getJSON(urlGeo, function(dataOriginal){
    console.log('Geo');
    jsonGeo = dataOriginal;
    console.log(dataOriginal);
  })
  $.getJSON(urlCrimes, function(dataOriginal){
    console.log('Crimes');
    jsonCrimes = dataOriginal;
    console.log(dataOriginal);
  })
  $.getJSON(urlHouse, function(dataOriginal){
    console.log('housing');
    jsonHouse = dataOriginal;
    console.log(dataOriginal);
  })
  $.getJSON(urlGeoCr, function(dataOriginal){
    console.log('GeoCrimes');
    jsonGeoCr = dataOriginal;
    console.log(dataOriginal);
  })

    $(".button-collapse").sideNav();
    $("#displayNeighborhoodDatan").on("click", neighborhoodData);
    $("#displayDistrictButton").on("click", districtBorder);
    $("#displayCriminalButtonA").on("click", getNACrimes);
    $("#displayCriminalButtonVA").on("click", getNVACrimes);
    $("#displayCriminalButtonEA").on("click", getNEACrimes);
    $("#displayNeighborhoodData").on("click",neighborhoodData);
    $("#displayDistanceButton").on("click", getNDistance);
    $("#resetMap").on("click", resetMap);
    //$().on("", setInterval);
    $("#displayAffordableButton").on("click", getNHousing);
    $("#tableDistrictButton").on("click", nextTime);
    $("#tableCriminalButton").on("click", nextTime);
    $("#tableDistanceButton").on("click", nextTime);
    $("#tableAffordableButton").on("click", nextTime);

      updateNeighborhoodTable();

})


function nextTime(){
  alert('Feature Will Be Available In Upcoming Updates');
}

// function fillMainTable(){
//  fill table .../DO/...
// }

function updateNeighborhoodTable(){
  tableR=$("#tableContent")[0]
  var newRow, borough, district;
  $.getJSON(urlGIS, function(dataOriginal){
    for (var i = 0; i < dataOriginal.data.length; i++) {
      newRow = tableR.insertRow(tableR.rows.length)
      district = newRow.insertCell(0);
      borough = newRow.insertCell(1);
      borough.innerHTML = dataOriginal.data[i][10]
      district.innerHTML = dataOriginal.data[i][dataOriginal.data[i].length-1]
    }
  })
}

function neighborhoodManagement(nInput){
  $('#displayNeighborhoodData').before('<h4>'+ nInput.innerHTML +'</h4>');
}

function neighborhoodData(){
  var input, filter, table, tr, td, i;
  input = document.getElementById("neighborhoodInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("neighborhoodTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        neighborhoodManagement(td);
      }
    }
  }
}

function neighborhoodInputFunction() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("neighborhoodInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("neighborhoodTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// Google Maps

function onGoogleMapResponse(){
  var NYUStern = {lat: 40.7291, lng: -73.9965};
  map = new google.maps.Map(document.getElementById('googleMapDisplay'), {
    zoom: 12,
    center: NYUStern
  });
}

function addStdMarker(coordinates){
  var marker = new google.maps.Marker({
    position: coordinates,
    map: map,
  });
  marker.setMap(map);
}

function resetMap(){
  var NYUStern = {lat: 40.7291, lng: -73.9965};
  map = new google.maps.Map(document.getElementById('googleMapDisplay'), {
    zoom: 12,
    center: NYUStern
  });
}
// Function polygonCenter taken from : https://gist.github.com/jeremejazz/9407568
 function polygonCenter(poly) {
    var lowx,
        highx,
        lowy,
        highy,
        lats = [],
        lngs = [],
        vertices = poly.getPath();
    for(var i=0; i<vertices.length; i++) {
      lngs.push(vertices.getAt(i).lng());
      lats.push(vertices.getAt(i).lat());
    }
    lats.sort();
    lngs.sort();
    lowx = lats[0];
    highx = lats[vertices.length - 1];
    lowy = lngs[0];
    highy = lngs[vertices.length - 1];
    center_x = lowx + ((highx-lowx) / 2);
    center_y = lowy + ((highy - lowy) / 2);
    return (new google.maps.LatLng(center_x, center_y));
  }
// End of polygonCenter

function districtBorder(){
  map = new google.maps.Map(document.getElementById('googleMapDisplay'), {
    zoom: 12,
    center: {lat: 40.7291, lng: -73.9965}
  });
        map.setZoom(10);
        map.data.loadGeoJson(urlGeo);
        map.data.setStyle({
        fillColor:'#43a047',
        strokeWeight: 1
    });
}

// Criminal Functions

 function getNACrimes(){
   map.setZoom(10);
   alert("Black: Run the heck out!, Red: Dangerous, Orange: A little Dangerous, Green: Safe! (Click Again The Option if you only clicked once)")
   var nCrimes = 0;
   for (var i = 0; i < jsonGeo.features.length; i++) {
     for (var j = 0; j < 250; j++) { //jsonGeoCr.features.length
       if (jsonGeoCr.features[j].geometry != null) {
         if (isInside(i,j)) {
           nCrimes++;
         }
       }
     }
     var polyArray = [];
     for (var k = 0; k < jsonGeo.features[i].geometry.coordinates[0].length; k++) {
       polyArray.push(new google.maps.LatLng(jsonGeo.features[i].geometry.coordinates[0][k][1],
         jsonGeo.features[i].geometry.coordinates[0][k][0]));
     }
     var districtArea = new google.maps.Polygon({paths:polyArray});
     addMarker(polygonCenter(districtArea),nCrimes);
   }
 }

 function getNVACrimes(){
   map.setZoom(11);
   alert("Black: Run the heck out!, Red: Dangerous, Orange: A little Dangerous, Green: Safe! (Click Again The Option if you only clicked once)")
   var nCrimes = 0;
   for (var i = 0; i < jsonGeo.features.length; i++) {
     for (var j = 0; j < 500; j++) { //jsonGeoCr.features.length
       if (jsonGeoCr.features[j].geometry != null) {
         if (isInside(i,j)) {
           nCrimes++;
         }
       }
     }
     var polyArray = [];
     for (var k = 0; k < jsonGeo.features[i].geometry.coordinates[0].length; k++) {
       polyArray.push(new google.maps.LatLng(jsonGeo.features[i].geometry.coordinates[0][k][1],
         jsonGeo.features[i].geometry.coordinates[0][k][0]));
     }
     var districtArea = new google.maps.Polygon({paths:polyArray});
     addMarker(polygonCenter(districtArea),nCrimes);
   }
 }

 function getNEACrimes(){
   map.setZoom(11);
   alert("Black: Run the heck out!, Red: Dangerous, Orange: A little Dangerous, Green: Safe! (Click Again The Option if you only clicked once)")
   var nCrimes = 0;
   for (var i = 0; i < jsonGeo.features.length; i++) {
     for (var j = 0; j < jsonGeoCr.features.length; j++) { //jsonGeoCr.features.length
       if (jsonGeoCr.features[j].geometry != null) {
         if (isInside(i,j)) {
           nCrimes++;
         }
       }
     }
     var polyArray = [];
     for (var k = 0; k < jsonGeo.features[i].geometry.coordinates[0].length; k++) {
       polyArray.push(new google.maps.LatLng(jsonGeo.features[i].geometry.coordinates[0][k][1],
         jsonGeo.features[i].geometry.coordinates[0][k][0]));
     }
     var districtArea = new google.maps.Polygon({paths:polyArray});
     addMarker(polygonCenter(districtArea),nCrimes);
   }
 }

 function getCircle(nCrimes) {
   if (nCrimes>500) {
     return {
       path: google.maps.SymbolPath.CIRCLE,
       fillColor: '#212121',
       fillOpacity: nCrimes/800,
       scale: nCrimes/32,
       strokeColor: 'black',
       strokeWeight: .7
     };
   } else if (nCrimes>200 && nCrimes<=500) {
     return {
       path: google.maps.SymbolPath.CIRCLE,
       fillColor: 'red',
       fillOpacity: nCrimes/500,
       scale: nCrimes/22,
       strokeColor: 'black',
       strokeWeight: .5
     };
   } else if (nCrimes>75 && nCrimes<=200) {
     return {
       path: google.maps.SymbolPath.CIRCLE,
       fillColor: 'orange',
       fillOpacity: nCrimes/270,
       scale: nCrimes/10,
       strokeColor: 'black',
       strokeWeight: .5
     };
   } else {
     return {
       path: google.maps.SymbolPath.CIRCLE,
       fillColor: 'green',
       fillOpacity: nCrimes/120,
       scale: nCrimes/3,
       strokeColor: 'white',
       strokeWeight: .5
     };
   }
 }

 function isInside(i,j){
   var polyArray = [];
   for (var k = 0; k < jsonGeo.features[i].geometry.coordinates[0].length; k++) {
     polyArray.push(new google.maps.LatLng(jsonGeo.features[i].geometry.coordinates[0][k][1],
       jsonGeo.features[i].geometry.coordinates[0][k][0]));
   }
   var areaAllowed = new google.maps.Polygon({paths:polyArray});
   var maker = new google.maps.LatLng(jsonGeoCr.features[j].geometry.coordinates[1],
      jsonGeoCr.features[j].geometry.coordinates[0]);
   return google.maps.geometry.poly.containsLocation(maker, areaAllowed);
 }

 function addMarker(coordinates ,nCrimes){
   var marker = new google.maps.Marker({
     position: coordinates,
     map: map,
     icon: getCircle(nCrimes)
   });
   marker.setMap(map);
 }

// End of Criminal Functions

//Distance Functions

  function getNDistance(){
    var NYUStern = new google.maps.LatLng( 40.7291, -73.9965);
    var distance = 0;
    alert("Click At Any White Section of the Map to Know the Distance From The NYU Stern School.")
    map = new google.maps.Map(document.getElementById('googleMapDisplay'), {
      zoom: 12,
      center: {lat: 40.7291, lng: -73.9965}
    });
    map.setZoom(12);
    map.data.loadGeoJson(urlGeo);
    map.data.setStyle({
      fillColor:'#e0e0e0',
      strokeWeight: 1
    });
    addStdMarker(NYUStern);
    google.maps.event.addListener(map.data, 'click', function (event) {
      addDistanceMarker(event.latLng, NYUStern);
    });
  }

  function addDistanceMarker(coordinates, initMark){
    var distanceMiles = google.maps.geometry.spherical.computeDistanceBetween(initMark, coordinates);
    var marker = new google.maps.Marker({
      position: coordinates,
      map: map,
      icon: getDistCircle(),
      label: ""+(distanceMiles/1000).toFixed(1)+"Km"
    });
    marker.setMap(map);
  }

  function getDistCircle() {
      return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'white',
        fillOpacity: 1,
        scale: 25,
        strokeColor: 'black',
        strokeWeight: .5
      };
  }

//End of Distance Functions

//Housing Functions

function addHousingMarker(coordinates, ElIncome){
  var marker = new google.maps.Marker({
    position: coordinates,
    map: map,
    icon: getHousingCircle(ElIncome),
    //label: ""+ElIncome+""
  });
  //console.log(marker);
  marker.setMap(map);
}

function getNHousing(){
  var NYUStern = new google.maps.LatLng( 40.7291, -73.9965);
  var ELIncome = 0;
  alert("Black: Not Affordable at All!, Red: Not Very Affordable, Orange: Somewhat Affordable, Yellow: Affordable, Green: Very Affordable (Click Again The Button if you only clicked once)")
  for (var i = 0; i < jsonGeo.features.length; i++) {
    ELIncome = Number(0);
    for (var j = 0; j < jsonHouse.data.length; j++) { //jsonGeoCr.features.length
      if (jsonHouse.data[j][23] != null) {
        if (isInsideHousing(i,j)) {
          ELIncome = Number(ELIncome) + Number(jsonHouse.data[j][31]);
        }
      }
    }
    var polyArray = [];
    for (var k = 0; k < jsonGeo.features[i].geometry.coordinates[0].length; k++) {
      polyArray.push(new google.maps.LatLng(jsonGeo.features[i].geometry.coordinates[0][k][1],
        jsonGeo.features[i].geometry.coordinates[0][k][0]));
    }
    var districtArea = new google.maps.Polygon({paths:polyArray});
    addHousingMarker(polygonCenter(districtArea), ELIncome);
  }
  map.setZoom(11);
  map.data.loadGeoJson(urlGeo);
  map.data.setStyle({
    fillColor:'#e0e0e0',
    strokeWeight: 1
  });
}

function getHousingCircle(ELIncome) {
    if (ELIncome>900) {
      return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'green',
        fillOpacity: ELIncome/1300,
        scale: ELIncome/70,
        strokeColor: 'black',
        strokeWeight: .5
      };
    } else if (ELIncome>=900 && ELIncome<300) {
      return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'green',
        fillOpacity: ELIncome/1000,
        scale: ELIncome/50,
        strokeColor: 'black',
        strokeWeight: .5
      };
    } else if (ELIncome<=300 && ELIncome>150) {
      return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'yellow',
        fillOpacity: ELIncome/500,
        scale: ELIncome/13,
        strokeColor: 'black',
        strokeWeight: .5
      };
    } else if (ELIncome<=150 && ELIncome>75) {
      return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'orange',
        fillOpacity: ELIncome/200,
        scale: 17,
        strokeColor: 'black',
        strokeWeight: .5
      };
    } else if (ELIncome<=75 && ELIncome>20) {
      return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: ELIncome/100,
        scale: 16,
        strokeColor: 'black',
        strokeWeight: .5
      };
    } else {
      return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'black',
        fillOpacity: 0.7,
        scale: 15,
        strokeColor: 'black',
        strokeWeight: .5
      };
    }

}

function isInsideHousing(i,j){
  var polyArray = [];
  for (var k = 0; k < jsonGeo.features[i].geometry.coordinates[0].length; k++) {
    polyArray.push(new google.maps.LatLng(jsonGeo.features[i].geometry.coordinates[0][k][1],
      jsonGeo.features[i].geometry.coordinates[0][k][0]));
  }
  var areaAllowed = new google.maps.Polygon({paths:polyArray});
  var maker = new google.maps.LatLng(jsonHouse.data[j][23], jsonHouse.data[j][24]);
  return google.maps.geometry.poly.containsLocation(maker, areaAllowed);
}

//End of Housing Functions
