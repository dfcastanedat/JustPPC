var map; //GOOGLE MAPS MAIN MAP



var NYULatLng = {lat: 40.729584, lng: -73.995935};
var polygons = {};


var markerNYU;
var infoWindow;
var line;
var districts = {
};


var curDisFeature = 0;
var curDis = 0;

//

//google maps districts shape 
var url1 = "http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
//Neighborhood names and Geometries
var url2 = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
// Affordability dataset
var url3 = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";


function test(){
    
    
    console.log(polygons);
    console.log(districts);
}

function googleMapsInit(){
    //Initialize map
map = new google.maps.Map(document.getElementById('map'),
{
    
  zoom: 10.2,
  zoomControl: false,
  center: {lat: 40.729262,  lng: -73.996480},
  disableDefaultUI: true,
  draggableCursor: "auto",
  draggingCursor: "auto",
//gestureHandling: "auto",
  //draggable: false,
  //keyboardShortcuts: false,
  mapTypeControl: false,
  fullscreenControl: false,
  //
  
  styles: [
      {
          "featureType" : "road.highway",
        "stylers": [
      { "visibility": "off" }
    ]
      },
      {
          
          "elementType" : "labels.icon",
        "stylers": [
      { "visibility": "off" }
    ]
      },
       {
          "featureType" : "poi",
        "stylers": [
      { "visibility": "off" }
    ]
      }
      
      
      ,
       {
          "featureType" : "water",
        "stylers": [
      {         "color": "#242d44"}
    ]
      },{
          "stylers":[{"lightness" : 0}]
          
      }
      
      ]
  



});

markerNYU = new google.maps.Marker(
  {
    position:
NYULatLng,
    map: map,
    title: 'NYU Stern School of Business',
    icon : {url:"https://material.io/tools/icons/static/icons/twotone-layers-24px.svg", scaledSize: new google.maps.Size(30,30)}
    

  }
);
infowindow = new google.maps.InfoWindow({
  content: "<h5>NYU Stern School of Business</h5>"
});

line = new google.maps.Polyline({
path:[ NYULatLng,NYULatLng],
map:map,
strokeOpacity: 0.5,
strokeWeight: 2

});

markerNYU.addListener('click', function(){
  infowindow.open(map, markerNYU);
    
    
});

markerNYU.addListener('mouseover', function(){
  
  markerNYU.setAnimation( google.maps.Animation.BOUNCE);

});
markerNYU.addListener('mouseout', function(){
  
  markerNYU.setAnimation(null);

});

map.data.setStyle({strokeWeight: 0 }); // Style of map



  
  loadData();

  
  styleMap();


   map.data.addListener('click', function(e){
     map.data.overrideStyle(curDisFeature.feature, {strokeWeight: 0.3, fillOpacity: 0.2});
     map.data.overrideStyle(e.feature, {strokeWeight: 2, fillOpacity: 0.5});
     line.setPath([NYULatLng, e.feature.getProperty("Shape_Center")]);
     curDisFeature = e;
     updateDistrict(e);
    console.log(e);
  /*markerTest = new google.maps.Marker(
    {
      position:
      e.feature.getProperty("Shape_Center"),
      map: map,
      title: 'PRUEBA : BRONX 07'

    }
  );*/

   });

   




}


function nearest(pos, i)
{
     var topnear = [];

  map.data.forEach(function(f){
    top10near.push({id: f.getId(), center: f.getProperty("Shape_Center")});
  });

  topnear.sort(function(a,b){

    return distanceToDistrict(a.center, pos) - distanceToDistrict(b.center, pos);


  });


    return topnear[i];
    
    
}

function distanceToDistrict(origin, district){
    return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(origin),
    new google.maps.LatLng(district));
}



function distanceToNYU(pos){
    return distanceToDistrict(NYULatLng, pos);
  


}

function boroughName(borocd){
  borocd = Math.floor(borocd/100);
  var color;
  switch(borocd) {

    case(1):

    color = 'Manhattan';
    break;
case(2):
color = 'Bronx';
break;
case(3):
color = 'Brooklyn';
break;
case(4):
color = 'Queens';
break;
case(5):
color = 'Staten Island';
break;
default:
color = '';
break;
  }

  return color;


}



function makeTopDistance(){

 var top10near = [];

  map.data.forEach(function(f){
    top10near.push({id: f.getId(), center: f.getProperty("Shape_Center")});
  });

  top10near.sort(function(a,b){

    return distanceToNYU(a.center) - distanceToNYU(b.center);


  });

  var tableReference =  $("#topTable")[0];
  var newRow;
  var place;
  var borough;
  var district;
  var distance;
  
    newRow = tableReference.insertRow(tableReference.rows.length);
    place = newRow.insertCell(0);
    borough = newRow.insertCell(1);
    district = newRow.insertCell(2);
    distance = newRow.insertCell(3);
    place.innerHTML = "n°" ;
    borough.innerHTML = "Borough";
    district.innerHTML = "District";
    distance.innerHTML = "Distance";
    
         
  for(var i = 0; i< 30; i++){


    //map.data.overrideStyle(map.data.getFeatureById(top10near[i].id), {strokeWeight: 3, fillOpacity: 0.8 , fillColor: "purple"});
    newRow = tableReference.insertRow(tableReference.rows.length);
    place = newRow.insertCell(0);
    borough = newRow.insertCell(1);
    district = newRow.insertCell(2);
    distance = newRow.insertCell(3);
    place.innerHTML = "<h4> " +(i+1).toString() +"</h4> " ;
    borough.innerHTML = boroughName(top10near[i].id);
    district.innerHTML = top10near[i].id%100;
    distance.innerHTML = Math.round(distanceToNYU(top10near[i].center)*100) /100 + " mts";
  }




}



function updateDistrict(e){

  //TO-DO
  var code = document.getElementById("districtCode");
  
  
  var borough = document.getElementById("Borough");
  var eli = document.getElementById("eli");
  var vli = document.getElementById("vli");
  var li = document.getElementById("li");
  var distance = document.getElementById("distance");

code.innerHTML = "Community Board: " + borocdToIndex(e.feature.getId());


borough.innerHTML = "Borough: " + boroughName(e.feature.getId());

eli.innerHTML = "<p></h4>Extremely low income maximum:</h4> " + districts[borocdToIndex(e.feature.getId())]["ELI"]["max"] + " units</p>" +"<p></h5>Extremely low income average:</h5> " + districts[borocdToIndex(e.feature.getId())]["ELI"]["avg"] + " units</p>";

vli.innerHTML = "<p></h5>Very low income maximum:</h5> " + districts[borocdToIndex(e.feature.getId())]["VLI"]["max"] + " units</p>" +"<p></h5>Very low income average:</h5> " + districts[borocdToIndex(e.feature.getId())]["VLI"]["avg"] + " units</p>";

li.innerHTML = "<p></h5>Low income maximum:</h5> " + districts[borocdToIndex(e.feature.getId())]["ELI"]["max"] + " units</p>" +"<p></h5>Low income average:</h5> " + districts[borocdToIndex(e.feature.getId())]["VLI"]["avg"] + " units</p>";



distance.innerHTML = "Distance (in mts) towards NYU Stern School of Business: " + parseInt(distanceToNYU(e.feature.getProperty("Shape_Center")));



}
function styleMap(){

  map.data.setStyle(function(feature){
    var code = Math.floor(feature.getProperty('BoroCD')/100);
var color;
     switch(code) {

case(1):

color = 'blue';
break;
case(2):
color = 'red';
break;
case(3):
color = 'green';
break;
case(4):
color = 'orange';
break;
case(5):
color = 'purple';
break;
default:
color = 'black';
break;
     }
     return ({fillColor: color , fillOpacity: 0.2 , strokeWeight: 0.3, strokeColor: "black", strokeOpacity: 0.5});
   }
 );

}



function borocdToIndex(boroCD){
    
var x = Math.floor(boroCD/100);


var code = ((boroCD -(x*100)) < 10) ? "0" + (boroCD -(x*100)).toString() : (boroCD -(x*100)).toString() ;
if ((boroCD -(x*100)) > 20) return "FA";
switch(x) {
case(1):
// 'Manhattan';
code = "MN-" + code;
break;
case(2):
// 'Bronx';
code = "BX-" + code;
break;
case(3):
// 'Brooklyn';
code = "BK-" + code ;
break;
case(4):
// 'Queens';
code = "QN-" + code;
break;
case(5):
// 'Staten Island';
code = "SI-" + code;
break;

  }

return code;
}
function indexToBoroCD(index){
var x = index.slice(0, 2);
var code = parseInt(index.slice(3,5));

switch(x) {
case("MN"):
// 'Manhattan';
code = 100 + code;
break;
case("BX"):
// 'Bronx';
code = 200 + code;
break;
case("BK"):
// 'Brooklyn';
code = 300 + code ;
break;
case("QN"):
// 'Queens';
code = 400 + code;
break;
case("SI"):
// 'Staten Island';
code = 500 + code;
break;

  }

return code;
}



function geoCenter(geom){

  var bounds = new google.maps.LatLngBounds();


    geom.forEachLatLng(function (pos) {
    bounds.extend(pos);

  });


return {lat: bounds.getCenter().lat(), lng:  bounds.getCenter().lng()};

}


function featureToPolygon(feature){
    
    
    var array =[];
    var innerArray =[];
    
    
        innerArray =[];
        
        if(feature.geometry.type == "Polygon")
        {for(var o in feature.geometry.coordinates[0]){
            innerArray.push({"lng": feature.geometry.coordinates[0][o][0],"lat": feature.geometry.coordinates[0][o][1]});
        }
        
        array.push(new google.maps.Polygon({"paths" : innerArray}));
    
    }
    
    else {
    
        for(var i in feature.geometry.coordinates){
            innerArray =[];
            for(var o in feature.geometry.coordinates[i][0]){
            innerArray.push(
                {
        "lng": feature.geometry.coordinates[i][0][o][0]
        ,"lat": feature.geometry.coordinates[i][0][o][1]});
        }
        array.push(new google.maps.Polygon(
            {"paths" : innerArray}
            )
            );
            
        }
        
    }
    
    
    
    return array;
    
    
}

function polygonFromFeature(feature){
    
    
    
    
    
    var innerArray =[];
    
    
        innerArray =[];
        
        if(feature.geometry.type == "Polygon")
        {for(var o in feature.geometry.coordinates[0]){
            innerArray.push({"lng": feature.geometry.coordinates[0][o][0],"lat": feature.geometry.coordinates[0][o][1]});
        }
        
        new google.maps.Polygon(
            {"paths" : innerArray , map:map , clickable: false, fillColor: "#509050", fillOpacity: 1, strokeOpacity: 0}
            
            );
    
    }
    
    else {
    
        for(var i in feature.geometry.coordinates){
            innerArray =[];
            for(var o in feature.geometry.coordinates[i][0]){
            innerArray.push(
                {
        "lng": feature.geometry.coordinates[i][0][o][0]
        ,"lat": feature.geometry.coordinates[i][0][o][1]});
        }
        new google.maps.Polygon(
            {"paths" : innerArray , map:map , clickable: false, fillColor: "#509050", fillOpacity: 1, strokeOpacity: 0}
        
        
        );
            
        }
        
    }
    
    
    
    
    
    

}



function latlngFromPoint(message){
    
    message = message.substring(7,message.length-1);
    var splitted = message.split(" ");
    return {lng: parseFloat(splitted[0]), lat: parseFloat(splitted[1]) };
    
    
    
}

function loadData(){



  var data = $.get(url1,function(){} )
              .done(function(){

              
              var features = JSON.parse(data.responseText).features;
              var center = {}, minX, minY, maxX, maxY;
              
              
              for(var i in features){
                //map.data.addGeoJson(feature);
                var center = 0;
                
                districts[ borocdToIndex(features[i].properties.BoroCD) ] =
                {"ELI": {"avg": 0, "cnt": 0, "max": 0} 
                ,
                "VLI": {"avg": 0, "cnt": 0, "max": 0} 
                , 
                "LI": {"avg": 0, "cnt": 0, "max": 0} }
                ;
                if ((features[i].properties.BoroCD) %100 < 20) { 
                    polygons[features[i].properties.BoroCD] =featureToPolygon(features[i]);
                    map.data.addGeoJson(features[i], {idPropertyName: 'BoroCD'} );
                } else polygonFromFeature(features[i]);
              }
              markerNYU.setAnimation(google.maps.Animation.DROP);
    
            //TEST AFTER CREATING FEATURES
             map.data.forEach( function(f){
               var fcenter = geoCenter( f.getGeometry() );
                f.setProperty("Shape_Center", fcenter);
                  //console.log(f.getId());
              });
              
              data = $.get(url2,function(){} ).done(
                  function(){
                      
                      for(var i in data.responseJSON.data){
                          
                          
                          var temp = new google.maps.Marker(
                              
                              {
                                  position: latlngFromPoint(data.responseJSON.data[i][9]),
                                  map: map,
                                  animation: google.maps.Animation.DROP,
                                   icon : {url:"https://material.io/tools/icons/static/icons/twotone-arrow_drop_up-24px.svg", scaledSize: new google.maps.Size(14,14)
    

                                    },
                                    title:data.responseJSON.data[i][10]
                              }
                              );
                          temp.addListener();
                          
                      }
                      
                      
                      
                      
                      
                      
                                 
              data =$.get(url3,function(){} )   .done(function(){

                var count = 0;
                var avg = 0;
                var input = 0;
                
                for(var i = 0; i<data.responseJSON.data.length; i++){
                    console.log(data.responseJSON.data[i][19].length );
                    if(data.responseJSON.data[i][19].length == 5){
                    //Extremely Low Income
                    
                           
                count = districts[data.responseJSON.data[i][19]]["ELI"]["cnt"];
                avg = districts[data.responseJSON.data[i][19]]["ELI"]["avg"];
                input = parseInt(data.responseJSON.data[i][31]);
                    
                  districts[data.responseJSON.data[i][19]]["ELI"]["max"] =
                  Math.max(data.responseJSON.data[i][31],
                  districts[data.responseJSON.data[i][19]]["ELI"]["max"]);
                  
                  
                  districts[data.responseJSON.data[i][19]]["ELI"]["avg"] = 
                  ((avg * count) + input) / (count + 1);

                  districts[data.responseJSON.data[i][19]]["ELI"]["cnt"]++;
                  
                  
                  //Very Low Income
                  
                                             
                count = districts[data.responseJSON.data[i][19]]["VLI"]["cnt"];
                avg = districts[data.responseJSON.data[i][19]]["VLI"]["avg"];
                input = parseInt(data.responseJSON.data[i][32]);    
                    
                        districts[data.responseJSON.data[i][19]]["VLI"]["max"] =
                  Math.max(data.responseJSON.data[i][32],
                  districts[data.responseJSON.data[i][19]]["VLI"]["max"]);
                  
                  districts[data.responseJSON.data[i][19]]["VLI"]["avg"] = 
                 ((avg *count) + input) / (count + 1);

                  districts[data.responseJSON.data[i][19]]["VLI"]["cnt"]++;
                  
                  
                  //Low Income
                  
                  
                                             
                count = districts[data.responseJSON.data[i][19]]["LI"]["cnt"];
                avg = districts[data.responseJSON.data[i][19]]["LI"]["avg"];
                input = parseInt(data.responseJSON.data[i][33]);                    
                    
                    
                  districts[data.responseJSON.data[i][19]]["LI"]["max"] =
                  Math.max(data.responseJSON.data[i][33],
                  districts[data.responseJSON.data[i][19]]["LI"]["max"]);
                  
                  districts[data.responseJSON.data[i][19]]["LI"]["avg"] = 
                ((avg *count) + input) / (count + 1);
                  districts[data.responseJSON.data[i][19]]["LI"]["cnt"]++;
                  
            
                 
                  
                }
                    
                    
                }
                
                console.log("THEN");
                console.log(districts);
                
           

    
              
          }
            )
              .fail(function(error){console.error(error)});

                      
                  }
                  
                  ).fail(function(error){console.error(error)});
  
            













              
                  
                
              }
            )
              .fail(function(error){console.error(error)});

}



function loadAffordData(URL){}




$(document).ready( function(){

  $("#distanceTable").on("click", makeTopDistance);


})
