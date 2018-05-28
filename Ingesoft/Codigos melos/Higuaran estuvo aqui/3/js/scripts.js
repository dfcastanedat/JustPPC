// Mandatory datasets

const neighborhoodNamesGIS = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const NYDistrictsGeoshapes = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const CrimesInNY = "https://data.cityofnewyork.us/resource/9s4h-37hy.json";
const NYCityHousing = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";

// Optional datasets

const NYCityMuseums = "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD";
const NYCityPopulation = "https://data.cityofnewyork.us/api/views/37cg-gxjd/rows.json?accessType=DOWNLOAD";

var housingData;
var crimesData;
var museumsData;
var populationData;
var centroidsData;

// map insertion
var clicked;

function initMap() {
     var university = {lat: 40.7291, lng: -73.9965};
     var map = new google.maps.Map(document.getElementById('Gmap'), {
          zoom: 10.3,
          center: university,
          disableDefaultUI: true,
          disableDoubleClickZoom: false,
          styles:
          [
               {
                    "elementType": "geometry",
                    "stylers": [
                         {
                              "color": "#ebe3cd"
                         }
                    ]
               },
               {
                    "elementType": "labels.text.fill",
                    "stylers": [
                         {
                              "color": "#523735"
                         }
                    ]
               },
               {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                         {
                              "color": "#f5f1e6"
                         }
                    ]
               },
               {
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [
                         {
                              "color": "#c9b2a6"
                         }
                    ]
               },
               {
                    "featureType": "administrative.land_parcel",
                    "stylers": [
                         {
                              "visibility": "off"
                         }
                    ]
               },
               {
                    "featureType": "administrative.land_parcel",
                    "elementType": "geometry.stroke",
                    "stylers": [
                         {
                              "color": "#dcd2be"
                         }
                    ]
               },
               {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [
                         {
                              "color": "#ae9e90"
                         }
                    ]
               },
               {
                    "featureType": "administrative.neighborhood",
                    "stylers": [
                         {
                              "visibility": "off"
                         }
                    ]
               },
               {
                    "featureType": "landscape.natural",
                    "elementType": "geometry",
                    "stylers": [
                         {
                              "color": "#dfd2ae"
                         }
                    ]
               },
               {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                         {
                              "color": "#dfd2ae"
                         }
                    ]
               },
               {
                    "featureType": "poi",
                    "elementType": "labels.text",
                    "stylers": [
                         {
                              "visibility": "off"
                         }
                    ]
               },
               {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                         {
                              "color": "#93817c"
                         }
                    ]
               },
               {
                    "featureType": "poi.business",
                    "stylers": [
                         {
                              "visibility": "off"
                         }
                    ]
               },
               {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [
                         {
                              "color": "#a5b076"
                         }
                    ]
               },
               {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [
                         {
                              "color": "#447530"
                         }
                    ]
               },
               {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                         {
                              "color": "#f5f1e6"
                         }
                    ]
               },
               {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [
                         {
                              "visibility": "off"
                         }
                    ]
               },
               {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                         {
                              "visibility": "off"
                         }
                    ]
               },
               {
                    "featureType": "road.arterial",
                    "stylers": [
                         {
                              "visibility": "off"
                         }
                    ]
               },
               {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [
                         {
                              "color": "#fdfcf8"
                         }
                    ]
               },
               {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [
                         {
                              "color": "#f8c967"
                         }
                    ]
               },
               {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                         {
                              "color": "#e9bc62"
                         }
                    ]
               },
               {
                    "featureType": "road.highway",
                    "elementType": "labels",
                    "stylers": [
                         {
                              "visibility": "off"
                         }
                    ]
               },
               {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "geometry",
                    "stylers": [
                         {
                              "color": "#e98d58"
                         }
                    ]
               },
               {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "geometry.stroke",
                    "stylers": [
                         {
                              "color": "#db8555"
                         }
                    ]
               },
               {
                    "featureType": "road.local",
                    "stylers": [
                         {
                              "visibility": "off"
                         }
                    ]
               },
               {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [
                         {
                              "color": "#806b63"
                         }
                    ]
               },
               {
                    "featureType": "transit",
                    "stylers": [
                         {
                              "visibility": "off"
                         }
                    ]
               },
               {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [
                         {
                              "color": "#dfd2ae"
                         }
                    ]
               },
               {
                    "featureType": "transit.line",
                    "elementType": "labels.text.fill",
                    "stylers": [
                         {
                              "color": "#8f7d77"
                         }
                    ]
               },
               {
                    "featureType": "transit.line",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                         {
                              "color": "#ebe3cd"
                         }
                    ]
               },
               {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [
                         {
                              "color": "#dfd2ae"
                         }
                    ]
               },
               {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                         {
                              "color": "#b9d3c2"
                         }
                    ]
               },
               {
                    "featureType": "water",
                    "elementType": "labels.text",
                    "stylers": [
                         {
                              "visibility": "off"
                         }
                    ]
               },
               {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                         {
                              "color": "#92998d"
                         }
                    ]
               }
          ]
     });
     var marker = new google.maps.Marker({
          position: university,
          map: map,
          icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=NYU|640d94|000000"
     });
     map.addListener('center_changed', function() {
          window.setTimeout(function() {
               map.panTo(marker.getPosition());
               map.setZoom(10.3);
          }, 10000);
     });

     map.addListener('zoom_changed', function() {
          window.setTimeout(function() {
               map.panTo(marker.getPosition());
               map.setZoom(10.3);
          }, 10000);
     });

     map.data.addListener('click', function(event) {
          clicked = event.feature.getProperty('BoroCD');
          console.log(clicked);
          if(clicked % 100 < 20){
               changeCharts(clicked);
               map.data.revertStyle();
               map.data.overrideStyle(event.feature,{
                    strokeWeight: 1,
                    fillOpacity: 0.8
               });
          }else{
               console.log("black");
          }
     });

     map.data.addListener('mouseover', function(event) {
          map.data.revertStyle();
          map.data.overrideStyle(event.feature,{
               strokeWeight: 0.8,
               fillOpacity: 0.8
          });
     });

     map.data.loadGeoJson(NYDistrictsGeoshapes);

     map.data.setStyle(function(feature){
          var color;
          var opacity = 0.6;
          var borders = 0.4;
          if(feature.getProperty("BoroCD") > 100 && feature.getProperty("BoroCD") < 120 ){
               color = "#fbf926";
          }else if(feature.getProperty("BoroCD") > 200 && feature.getProperty("BoroCD") < 220 ){
               color = "#6ded2c";
          }else if(feature.getProperty("BoroCD") > 300 && feature.getProperty("BoroCD") < 320 ){
               color = "#2cb9ed";
          }else if(feature.getProperty("BoroCD") > 400 && feature.getProperty("BoroCD") < 420 ){
               color = "#ff1818";
          }else if(feature.getProperty("BoroCD") > 500 && feature.getProperty("BoroCD") < 520 ){
               color = "#f58136";
          }else{
               color = "#000000";
               opacity = 0;
               borders = 0;
          }
          return ({
               fillOpacity: opacity,
               fillColor: color,
               strokeWeight: borders
          });
     });

}

// data manipulation

var finalData = [];

var prueba = {
     101:['Manhatan','MN-01',0,0,0,0,0,0],
     102:['Manhatan','MN-02',0,0,0,0,0,0],
     103:['Manhatan','MN-03',0,0,0,0,0,0],
     104:['Manhatan','MN-04',0,0,0,0,0,0],
     105:['Manhatan','MN-05',0,0,0,0,0,0],
     106:['Manhatan','MN-06',0,0,0,0,0,0],
     107:['Manhatan','MN-07',0,0,0,0,0,0],
     108:['Manhatan','MN-08',0,0,0,0,0,0],
     109:['Manhatan','MN-09',0,0,0,0,0,0],
     110:['Manhatan','MN-10',0,0,0,0,0,0],
     111:['Manhatan','MN-11',0,0,0,0,0,0],
     112:['Manhatan','MN-12',0,0,0,0,0,0],

     201:['Bronx','BX-01',0,0,0,0,0,0],
     202:['Bronx','BX-02',0,0,0,0,0,0],
     203:['Bronx','BX-03',0,0,0,0,0,0],
     204:['Bronx','BX-04',0,0,0,0,0,0],
     205:['Bronx','BX-05',0,0,0,0,0,0],
     206:['Bronx','BX-06',0,0,0,0,0,0],
     207:['Bronx','BX-07',0,0,0,0,0,0],
     208:['Bronx','BX-08',0,0,0,0,0,0],
     209:['Bronx','BX-09',0,0,0,0,0,0],
     210:['Bronx','BX-10',0,0,0,0,0,0],
     211:['Bronx','BX-11',0,0,0,0,0,0],
     212:['Bronx','BX-12',0,0,0,0,0,0],

     301:['Brooklin','BK-01',0,0,0,0,0,0],
     302:['Brooklin','BK-02',0,0,0,0,0,0],
     303:['Brooklin','BK-03',0,0,0,0,0,0],
     304:['Brooklin','BK-04',0,0,0,0,0,0],
     305:['Brooklin','BK-05',0,0,0,0,0,0],
     306:['Brooklin','BK-06',0,0,0,0,0,0],
     307:['Brooklin','BK-07',0,0,0,0,0,0],
     308:['Brooklin','BK-08',0,0,0,0,0,0],
     309:['Brooklin','BK-09',0,0,0,0,0,0],
     310:['Brooklin','BK-10',0,0,0,0,0,0],
     311:['Brooklin','BK-11',0,0,0,0,0,0],
     312:['Brooklin','BK-12',0,0,0,0,0,0],
     313:['Brooklin','BK-13',0,0,0,0,0,0],
     314:['Brooklin','BK-14',0,0,0,0,0,0],
     315:['Brooklin','BK-15',0,0,0,0,0,0],
     316:['Brooklin','BK-16',0,0,0,0,0,0],
     317:['Brooklin','BK-17',0,0,0,0,0,0],
     318:['Brooklin','BK-18',0,0,0,0,0,0],

     401:['Queens','QN-01',0,0,0,0,0,0],
     402:['Queens','QN-02',0,0,0,0,0,0],
     403:['Queens','QN-03',0,0,0,0,0,0],
     404:['Queens','QN-04',0,0,0,0,0,0],
     405:['Queens','QN-05',0,0,0,0,0,0],
     406:['Queens','QN-06',0,0,0,0,0,0],
     407:['Queens','QN-07',0,0,0,0,0,0],
     408:['Queens','QN-08',0,0,0,0,0,0],
     409:['Queens','QN-09',0,0,0,0,0,0],
     410:['Queens','QN-10',0,0,0,0,0,0],
     411:['Queens','QN-11',0,0,0,0,0,0],
     412:['Queens','QN-12',0,0,0,0,0,0],
     413:['Queens','QN-13',0,0,0,0,0,0],
     414:['Queens','QN-14',0,0,0,0,0,0],

     501:['Staten Island','SI-01',0,0,0,0,0,0],
     502:['Staten Island','SI-02',0,0,0,0,0,0],
     503:['Staten Island','SI-03',0,0,0,0,0,0],

}



function getDataFromHousing(){
     housingData = $.getJSON(NYCityHousing,function(){
          console.log(housingData);
     })
     .done(function(){
          getDataFromCentroids();
     })
     .fail(function(error){
          console.error(error);
     });
}

function getDataFromCentroids(){
     centroidsData = $.getJSON(neighborhoodNamesGIS,function(){
          console.log(centroidsData);
     })
     .done(function(){
          getDataFromCrimes();
     })
     .fail(function(error){
          console.error(error);
     });
}

function getDataFromCrimes(){
     crimesData = $.getJSON(CrimesInNY,function(){
          console.log(crimesData);
     })
     .done(function(){
          getDataFromMuseums();
     })
     .fail(function(error){
          console.error(error);
     });
}

function getDataFromMuseums(){
     museumsData = $.getJSON(NYCityMuseums,function(){
          console.log(museumsData);
     })
     .done(function(){
          getDataFromPopulation();
     })
     .fail(function(error){
          console.error(error);
     });
}

function getDataFromPopulation(){
     populationData = $.getJSON(NYCityPopulation,function(){
          console.log(populationData);
     })
     .done(function(){
          initMetrics();
     })
     .fail(function(error){
          console.error(error);
     });
}

function changeCharts(Boro) {
     document.getElementById("currentDistrict").innerHTML = prueba[Boro][1];
     updateGauge1(Boro/10);
     updateGauge2(Boro/10 + 10);
     updateGauge3(Boro/10 + 40);
}

var BigTable = document.getElementById("sortingTable");

window.onload = getDataFromHousing();

function initNames(){
     for (var dist in prueba) {
          var trow = BigTable.insertRow();
          for (info of prueba[dist]) {
               var tcell = trow.insertCell();
               tcell.innerHTML = info;
          }
     }
}

function initMetrics(){
     initSecurity();
     initCost();
     initDistance();
     initMuseums();
     initPopulation();
     initTops();
     initNames();
}

function initSecurity(){

}

function initCost(){
     var totals = [];
     var workable1 = housingData['responseJSON'];
     var workable2 = workable1['data'];
     for (variable of workable2) {
          for (var dist in prueba){
               if(dist[1]== variable[19]){
                    //33
                    dist[3] = dist[3] + variable[33];
               }
          }
     }
}

function initDistance(){

}

function initMuseums(){

}

function initPopulation(){

}

function initTops(){
     initTopCost();
     initTopDistance();
     initTopSafety();
     initTopAverage();
}

function initTopCost(){

}

function initTopDistance(){

}

function initTopSafety(){

}

function initTopAverage(){

}

//graphics

var transit = d3.transition().duration(600);

var chartcolor = '#82B2BE';
var separatorcolor = '#591D0E';

var gaugesheight = 150;
var gaugeswidth = 200;

var gauge1container = d3.select("#chart1").append("svg").attr("width",gaugeswidth).attr("height",gaugesheight);
var separator1 = gauge1container.append("rect").attr("x",0).attr("y",100).attr("width",200).attr("height",5).attr("fill",separatorcolor);
var gaugechart1 = gauge1container.append("rect").attr("x",0).attr("y",0).attr("width",0).attr("height",100).attr("fill",chartcolor);
var gaugechart1text = gauge1container.append("text").attr("x",0).attr("y",130).attr("font-family","Gloria Hallelujah").attr("font-size","20px").attr("fill",separatorcolor).text("[ 0% ]");

function updateGauge1(input){
     gaugechart1.transition(transit).attr("width",input * 2);
     gaugechart1text.transition(transit).text("[ "+input+"% ]");
}

var gauge2container = d3.select("#chart2").append("svg").attr("width",gaugeswidth).attr("height",gaugesheight);
var separator2 = gauge2container.append("rect").attr("x",0).attr("y",100).attr("width",200).attr("height",5).attr("fill",separatorcolor);
var gaugechart2 = gauge2container.append("rect").attr("x",0).attr("y",0).attr("width",0).attr("height",100).attr("fill",chartcolor);
var gaugechart2text = gauge2container.append("text").attr("x",0).attr("y",130).attr("font-family","Gloria Hallelujah").attr("font-size","20px").attr("fill",separatorcolor).text("[ 0% ]");

function updateGauge2(input){
     gaugechart2.transition(transit).attr("width",input * 2);
     gaugechart2text.transition(transit).text("[ "+input+"% ]");
}

var gauge3container = d3.select("#chart3").append("svg").attr("width",gaugeswidth).attr("height",gaugesheight);
var separator3 = gauge3container.append("rect").attr("x",0).attr("y",100).attr("width",200).attr("height",5).attr("fill",separatorcolor);
var gaugechart3 = gauge3container.append("rect").attr("x",0).attr("y",0).attr("width",0).attr("height",100).attr("fill",chartcolor);
var gaugechart3text = gauge3container.append("text").attr("x",0).attr("y",130).attr("font-family","Gloria Hallelujah").attr("font-size","20px").attr("fill",separatorcolor).text("[ 0% ]");

function updateGauge3(input){
     gaugechart3.transition(transit).attr("width",input * 2);
     gaugechart3text.transition(transit).text("[ "+input+"% ]");
}

var bar1container = d3.select("#top1").append("svg").attr("width",200).attr("height",300);

var barchart1bar1 = bar1container.append("rect").attr("x",0).attr("y",0).attr("width",180).attr("height",30).attr("fill",chartcolor);
var barchart1bar1text = barchart1bar1.append("text").attr("x",0).attr("y",0).attr("font-family","Gloria Hallelujah").attr("font-size","15px").attr("fill",separatorcolor).text("District1");
var barchart1bar2 = bar1container.append("rect").attr("x",0).attr("y",30).attr("width",170).attr("height",30).attr("fill",chartcolor);
var barchart1bar2text = barchart1bar2.append("text").attr("x",0).attr("y",0).attr("font-family","Gloria Hallelujah").attr("font-size","15px").attr("fill",separatorcolor).text("District1");
var barchart1bar3 = bar1container.append("rect").attr("x",0).attr("y",60).attr("width",160).attr("height",30).attr("fill",chartcolor);
var barchart1bar3text = barchart1bar3.append("text").attr("x",0).attr("y",0).attr("font-family","Gloria Hallelujah").attr("font-size","15px").attr("fill",separatorcolor).text("District1");
var barchart1bar4 = bar1container.append("rect").attr("x",0).attr("y",90).attr("width",150).attr("height",30).attr("fill",chartcolor);
var barchart1bar4text = barchart1bar4.append("text").attr("x",0).attr("y",0).attr("font-family","Gloria Hallelujah").attr("font-size","15px").attr("fill",separatorcolor).text("District1");
var barchart1bar5 = bar1container.append("rect").attr("x",0).attr("y",120).attr("width",140).attr("height",30).attr("fill",chartcolor);
var barchart1bar5text = barchart1bar5.append("text").attr("x",0).attr("y",0).attr("font-family","Gloria Hallelujah").attr("font-size","15px").attr("fill",separatorcolor).text("District1");
var barchart1bar6 = bar1container.append("rect").attr("x",0).attr("y",150).attr("width",130).attr("height",30).attr("fill",chartcolor);
var barchart1bar6text = barchart1bar6.append("text").attr("x",0).attr("y",0).attr("font-family","Gloria Hallelujah").attr("font-size","15px").attr("fill",separatorcolor).text("District1");
var barchart1bar7 = bar1container.append("rect").attr("x",0).attr("y",180).attr("width",120).attr("height",30).attr("fill",chartcolor);
var barchart1bar7text = barchart1bar7.append("text").attr("x",0).attr("y",0).attr("font-family","Gloria Hallelujah").attr("font-size","15px").attr("fill",separatorcolor).text("District1");
var barchart1bar8 = bar1container.append("rect").attr("x",0).attr("y",210).attr("width",110).attr("height",30).attr("fill",chartcolor);
var barchart1bar8text = barchart1bar8.append("text").attr("x",0).attr("y",0).attr("font-family","Gloria Hallelujah").attr("font-size","15px").attr("fill",separatorcolor).text("District1");
var barchart1bar9 = bar1container.append("rect").attr("x",0).attr("y",240).attr("width",100).attr("height",30).attr("fill",chartcolor);
var barchart1bar9text = barchart1bar9.append("text").attr("x",0).attr("y",0).attr("font-family","Gloria Hallelujah").attr("font-size","15px").attr("fill",separatorcolor).text("District1");
var barchart1bar10 = bar1container.append("rect").attr("x",0).attr("y",270).attr("width",90).attr("height",30).attr("fill",chartcolor);
var barchart1bar10text = barchart1bar10.append("text").attr("x",0).attr("y",0).attr("font-family","Gloria Hallelujah").attr("font-size","15px").attr("fill",separatorcolor).text("District1");

var bar2container = d3.select("#top2").append("svg").attr("width",200).attr("height",200);

var barchart2 = bar2container.append("rect").attr("x",0).attr("y",0).attr("width",100).attr("height",100).attr("fill",chartcolor);

var bar3container = d3.select("#top3").append("svg").attr("width",200).attr("height",200);

var barchart3 = bar3container.append("rect").attr("x",0).attr("y",0).attr("width",100).attr("height",100).attr("fill",chartcolor);

var bar4container = d3.select("#top4").append("svg").attr("width",200).attr("height",200);

var barchart4 = bar4container.append("rect").attr("x",0).attr("y",0).attr("width",100).attr("height",100).attr("fill",chartcolor);

// Data Table
