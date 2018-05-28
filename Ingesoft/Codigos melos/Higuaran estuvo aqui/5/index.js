///////////////////////////VARIABLES DECLARATION/////////////////////////////////
const customCenter =  new google.maps.LatLng(40.702649,-73.993746);
const nyu_coordinates = new google.maps.LatLng(40.7290549,-73.9965233);
const PAN_ZOOM = 15;
var map;
var geocoder;
var markers = [];
var informationWindow;
var heatmap, isHeatMap = false;

var rawNeighborhoods;
var neighborhoodsLatitude = [];
var neighborhoodsLongitude = [];
var neighborhoodsLatLng = [];
var neighborhoodsNames = [];
var neighborhoodsBorough = [];

var rawGeoShapes;
var geoShapeBOROCD = [];
var geoShapeBorough = [];
var geoShapeDistrictNumber = [];
var geoShapeHabitable = [];
var geoShapePolygons=[];
var geoShapeType=[];

var rawHousing;
var housingBorough = [];
var housingLatLng = [];
var housingExtLowInc = [];
var housingDetails = [];

var rawCrimes;
var totalCrimesByBorough;
var crimesBorough = [];
var crimesDescription = [];
var crimesLatLng = [];
var crimesDate = [];

var IveDoneThis=false;
var sortedDistances = [];
//FOR DATA VISUALIZATION
var locationPolygon=[];
var distancesFromNYU=[];//Closeness for GeoShape
var extremeLowIncomeUnitsByDistrict=[8,161,0,116,186,0,0,607,187,712,183,0,0,1353,0,434,0,929,401,463,0,0,0,630,170,0,186,1,0,332,1116,0,0,0,38,0,475,51,265,559,112,0,0,0,0,0,45,47,105,213,0,478,75,0,58,0,540,0,725,348,13,354,0,160,0,0,727,0,67,0,17];
var crimesByDistrict = [5,32,0,16,14,13,13,15,15,23,9,0,9,29,6,22,0,21,15,26,18,10,0,20,10,2,26,17,20,25,23,14,14,0,24,0,22,12,23,13,20,2,13,0,7,7,46,5,16,35,1,40,15,0,33,26,9,0,40,23,14,10,9,18,19,17,26,8,15,12,13];
var CbyDistrict=[];
var ELIUbyDistrict=[];

var museumsLatLng=[];
var museumsNames=[];
var galleriesLatLng=[];

var gauge1,gauge2,gauge3;
///////////////////////MANDATORY DATASETS////////////////////////////////////////
const URLGeoJSON = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const URLNeighborhoods = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const URLCrimes = "https://data.cityofnewyork.us/resource/9s4h-37hy.json?cmplnt_fr_dt=2015-12-31T00:00:00.000&$where=latitude IS NOT NULL&$limit=1075";
const URLHousing = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
///////////////////////OPTIONAL DATASETS/////////////////////////////////////////
const URLMuseums = "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.geojson";
const URLGalleries = "https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.geojson";
const URLTabulationNeighborhoods = "https://data.cityofnewyork.us/resource/q2z5-ai38.geojson";
//////////////////////STYLE CONSTANTS////////////////////////////////////////////
const MANHATTAN_COLOR = "#FF595E";
const BROOKLYN_COLOR = "#FFBF00";
const QUEENS_COLOR = "#177E89";
const BRONX_COLOR = "#83B692";
const STATEN_ISLAND_COLOR = "#6A4C93";
const NON_HABITABLE_DISTRICT_COLOR = "#2DE1C2";
//////////////////////CALLBACK MAP FUNCTION//////////////////////////////////////
initMap();

function initMap() {
    informationWindow = new google.maps.InfoWindow({
        content: "..." //Content is just initialized.
    });

    //directionsService = new google.maps.DirectionsService(); //For getting distances from centroids.
    //directionsRenderer = new google.maps.DirectionsRenderer();

    //Map instance
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10.9, //Map's zoom
        center: customCenter,
        mapTypeId: 'roadmap'
    });

    var nyu_marker = new google.maps.Marker({
        position: nyu_coordinates,
        map: map,
        icon: 'https://i.imgur.com/Aq2dcbf.png',
        animation: google.maps.Animation.BOUNCE,
        zIndex: 3000 //Its zIndex is big enough so it'll remain on the top of map visualization.
    });

    assignInfoWindow(nyu_marker, '<h4>' + "NYU Stern Business School" + '</h4>');
    updateAllDatasets();
}

////////////////////////OBTAINING MANDATORY DATA/////////////////////////////////
function getAllMandatoryDataInOrder() {//set all mandatory data
    var first = $.get(URLGeoJSON, function(){})//FIRST GEO DATA
        .done(function() {
            rawGeoShapes = JSON.parse(first.responseText);

            for (var i = 0; i < 71; i++) { //We get the Borough Name with its code in JSON file.
                var tempDistrictNumber = rawGeoShapes.features[i].properties.BoroCD.toString().substring(1);
                geoShapeBOROCD.push(rawGeoShapes.features[i].properties.BoroCD);
                if(rawGeoShapes.features[i].geometry.coordinates.length!=1){//IF IT'S MULTYPOLYGON
                  geoShapeType.push("MultiPolygon");
                  tempCoordinatesMatrix=[];
                  for (var j = 0; j < rawGeoShapes.features[i].geometry.coordinates.length; j++) {//Accedemos a cada arreglo
                    var tempCoordinatesArray=[];
                    for (var k = 0; k < rawGeoShapes.features[i].geometry.coordinates[j].length; k++) {//Accedemos a cada par de coordenadas
                      for (var l = 0; l < rawGeoShapes.features[i].geometry.coordinates[j][k].length; l++) {//Accedemos a cada number
                        tempCoordinatesArray.push(new google.maps.LatLng(rawGeoShapes.features[i].geometry.coordinates[j][k][l][1],rawGeoShapes.features[i].geometry.coordinates[j][k][l][0]));
                      }
                    }tempCoordinatesMatrix.push(tempCoordinatesArray)
                  }geoShapePolygons.push(tempCoordinatesMatrix);
                } else{
                  geoShapeType.push("Polygon");
                  for (j = 0; j < rawGeoShapes.features[i].geometry.coordinates.length; j++) {//Accedemos a cada arreglo
                    tempCoordinatesArray=[];
                    for (k = 0; k < rawGeoShapes.features[i].geometry.coordinates[j].length; k++) {//Accedemos a cada par de coordenadas
                        tempCoordinatesArray.push(new google.maps.LatLng(rawGeoShapes.features[i].geometry.coordinates[j][k][1],rawGeoShapes.features[i].geometry.coordinates[j][k][0]));
                    }
                  }geoShapePolygons.push(tempCoordinatesArray);
                }

                switch (rawGeoShapes.features[i].properties.BoroCD.toString().charAt(0)) {
                    case "1":
                        geoShapeBorough[i] = "Manhattan";
                        geoShapeDistrictNumber[i] = tempDistrictNumber; //And here we get the District Number
                        geoShapeHabitable[i] = true;
                        if (geoShapeDistrictNumber[i] > 12) geoShapeHabitable[i] = false;
                        break;
                    case "2":
                        geoShapeBorough[i] = "Bronx";
                        geoShapeDistrictNumber[i] = tempDistrictNumber;
                        geoShapeHabitable[i] = true;
                        if (geoShapeDistrictNumber[i] > 12) geoShapeHabitable[i] = false;
                        break;
                    case "3":
                        geoShapeBorough[i] = "Brooklyn";
                        geoShapeDistrictNumber[i] = tempDistrictNumber;
                        geoShapeHabitable[i] = true;
                        if (geoShapeDistrictNumber[i] > 18) geoShapeHabitable[i] = false;
                        break;
                    case "4":
                        geoShapeBorough[i] = "Queens";
                        geoShapeDistrictNumber[i] = tempDistrictNumber;
                        geoShapeHabitable[i] = true;
                        if (geoShapeDistrictNumber[i] > 14) geoShapeHabitable[i] = false;
                        break;
                    case "5":
                        geoShapeBorough[i] = "Staten Island";
                        geoShapeDistrictNumber[i] = tempDistrictNumber;
                        geoShapeHabitable[i] = true;
                        if (geoShapeDistrictNumber[i] > 3) geoShapeHabitable[i] = false;
                        break;
                    default: //Do nothing, thanks.
                }
            }

            //LOAD POLYGONS AND DISPLAY THEM BY DEFAULT
            for (var i = 0; i < geoShapePolygons.length; i++) {
              switch (geoShapeType[i]) {
                case "Polygon":
                  var polygon = new google.maps.Polygon(stylePolygon(geoShapeBorough[i],geoShapeHabitable[i]));
                  polygon.setPath(geoShapePolygons[i]);
                  locationPolygon.push(polygon);//Store the object

                  var position = getPolygonCenter(polygon);
                  distancesFromNYU.push(calculateDistanceToNYU(position));
                  break;

                case "MultiPolygon":
                  var tempPolygons=[];

                  for (var j = 0; j < geoShapePolygons[i].length; j++) {
                    var polygon = new google.maps.Polygon(stylePolygon(geoShapeBorough[i],geoShapeHabitable[i],i));
                    polygon.setPath(geoShapePolygons[i][j]);
                    tempPolygons.push(polygon);
                  }
                  locationPolygon.push(tempPolygons);

                  var position = getAverageMultiPolygon(tempPolygons);
                  distancesFromNYU.push(calculateDistanceToNYU(position));//DATA FOR CLOSENESS IS READY TO USE.
                  break;
                default:
              }
            }

            displayAllPolygons();

            for (i = 0; i < 71; i++) {
              distancesFromNYU[i] = [distancesFromNYU[i],geoShapeBOROCD[i],i];
              crimesByDistrict[i] = [crimesByDistrict[i],geoShapeBOROCD[i],i];
              extremeLowIncomeUnitsByDistrict[i] = [extremeLowIncomeUnitsByDistrict[i],geoShapeBOROCD[i],i];

              if(geoShapeType[i]=="Polygon" && geoShapeHabitable[i]){
                const dis = distancesFromNYU[i][0], saf = crimesByDistrict[i][0], aff = extremeLowIncomeUnitsByDistrict[i][0];
                google.maps.event.addListener(locationPolygon[i], 'click', function (event) {
                 updateLiquidCharts(dis,saf,aff);
               });
             }else if(geoShapeType[i]=="MultiPolygon" && geoShapeHabitable[i]){
               const dis = distancesFromNYU[i][0], saf = crimesByDistrict[i][0], aff = extremeLowIncomeUnitsByDistrict[i][0];
               for (var j = 0; j < locationPolygon[i].length; j++) {
                 google.maps.event.addListener(locationPolygon[i][j], 'click', function (event) {
                  updateLiquidCharts(dis,saf,aff);
                });
               }
             }
            }

            var closeConfig = liquidFillGaugeDefaultSettings();
            closeConfig.maxValue = 27;
            closeConfig.textVertPosition = 0.5;
            closeConfig.waveAnimateTime = 1000;
            closeConfig.displayPercent = false;
            gauge1 = loadLiquidFillGauge("Closeness", 0.00001, closeConfig);
            var crimeConfig = liquidFillGaugeDefaultSettings();
            crimeConfig.circleColor = "#FF7777";
            crimeConfig.textColor = "#FF4444";
            crimeConfig.waveTextColor = "#FFAAAA";
            crimeConfig.waveColor = "#FFDDDD";
            crimeConfig.maxValue = 46;
            crimeConfig.circleThickness = 0.5;
            crimeConfig.textVertPosition = 0.5;
            crimeConfig.waveAnimateTime = 1000;
            crimeConfig.displayPercent = false;
            gauge2 = loadLiquidFillGauge("Safety", 0.00001, crimeConfig);
            var affordConfig = liquidFillGaugeDefaultSettings();
            affordConfig.circleColor = "#57AFA7";
            affordConfig.textColor = "#33D6C5";
            affordConfig.waveTextColor = "#6AE1D4";
            affordConfig.waveColor = "#57AFA7";
            affordConfig.maxValue = 1353;
            affordConfig.circleThickness = 0.2;
            affordConfig.circleFillGap = 0.2;
            affordConfig.textVertPosition = 0.5;
            affordConfig.waveAnimateTime = 2000;
            affordConfig.waveHeight = 0.2;
            affordConfig.waveCount = 1;
            affordConfig.displayPercent = false;
            gauge3 = loadLiquidFillGauge("Affordability", 0.00001, affordConfig);
            /////////////////////END OF FIRST DATASET LOAD//////////////////////

            var second = $.get(URLNeighborhoods, function() {})
                .done(function() {
                    rawNeighborhoods = second.responseJSON.data;
                    for (var i = 0; i < rawNeighborhoods.length; i++) {
                        neighborhoodsLongitude[i] = parseFloat(rawNeighborhoods[i][9].substring(7, rawNeighborhoods.toString().lastIndexOf(" ")));
                        neighborhoodsLatitude[i] = parseFloat(rawNeighborhoods[i][9].substring(rawNeighborhoods[i][9].toString().lastIndexOf(" "), rawNeighborhoods[i][9].toString().lastIndexOf(")")));
                        neighborhoodsLatLng[i] = new google.maps.LatLng(neighborhoodsLatitude[i],neighborhoodsLongitude[i]);
                        neighborhoodsNames[i] = rawNeighborhoods[i][10];
                        neighborhoodsBorough[i] = rawNeighborhoods[i][16];
                    }/////////////END OF SECOND DATASET LOAD////////////////////

                    var third = $.get(URLCrimes, function(){})
                      .done(function() {
                          rawCrimes = third.responseJSON;

                          for (var i = 0; i < rawCrimes.length; i++) {
                              crimesBorough[i] = rawCrimes[i]['boro_nm'];
                              crimesDescription[i] = rawCrimes[i]['ofns_desc'];
                              crimesLatLng[i] = new google.maps.LatLng(rawCrimes[i]['latitude'],rawCrimes[i]['longitude']);
                              crimesDate[i] = rawCrimes[i]['cmplnt_fr_dt'];
                          }

                          //DATA FOR SAFETY CHART
                          totalCrimesByBorough = [];
                          for (var i = 0; i < 5; i++) {
                              totalCrimesByBorough[i] = 0;
                          }
                          for (var i = 0; i < crimesBorough.length; i++) {
                              switch (crimesBorough[i]) {
                                  case "MANHATTAN": //235
                                      totalCrimesByBorough[0]++;
                                      break;
                                  case "BROOKLYN": //309 MOST INSECURE
                                      totalCrimesByBorough[1]++;
                                      break;
                                  case "QUEENS": //227
                                      totalCrimesByBorough[2]++;
                                      break;
                                  case "BRONX": //239
                                      totalCrimesByBorough[3]++;
                                      break;
                                  case "STATEN ISLAND": //65 SAFEST
                                      totalCrimesByBorough[4]++;
                                      break;
                                  default:
                              }
                          }/////////////////END OF THIRD DATASET////////////////

                          var four = $.get(URLHousing,function(){})
                              .done(function() {
                                  rawHousing = four.responseJSON.data;

                                  for (var i = 0; i < rawHousing.length; i++) {
                                      if(rawHousing[i][23]!=undefined&&rawHousing[i][24]!=undefined){//If it has LatLng...
                                        housingBorough.push(rawHousing[i][15]);
                                        housingLatLng.push(new google.maps.LatLng(rawHousing[i][23],rawHousing[i][24]));
                                        housingExtLowInc.push(Number(rawHousing[i][31]));
                                        housingDetails.push(/*Project'sName*/ rawHousing[i][9] + "," + /*Street'sName*/ rawHousing[i][14] + "," + /*Construction'sType*/ rawHousing[i][28]);
                                      }
                                  }
                                  //////////END OF FOURTH DATASET///////////////

                                  updateAllTables();

                                  var five = $.get(URLMuseums, function() {})
                                      .done(function() {
                                        for (var i = 0; i < 130; i++) {
                                          museumsLatLng[i] = new google.maps.LatLng(five.responseJSON.features[i].geometry.coordinates[1],five.responseJSON.features[i].geometry.coordinates[0]);
                                          museumsNames[i] = five.responseJSON.features[i].properties.name;
                                        }
                                        var six = $.get(URLGalleries, function() {})
                                            .done(function() {
                                              for (var i = 0; i < 917; i++) {
                                                galleriesLatLng[i] = new google.maps.LatLng(six.responseJSON.features[i].geometry.coordinates[1],six.responseJSON.features[i].geometry.coordinates[0]);
                                              }
                                            });
                                      });
                              });
                      });
                });
        });
}

///////////////////////OBTAINING OPTIONAL DATA///////////////////////////////////
function getAllOptionalDataInOrder(){

}

function getDataFromAir(URL) {

}
////////////////////////DISPLAYING METHODS///////////////////////////////////////
function stylePolygon(borough, isHabitable){
  var color;
  switch (borough) {
    case "Manhattan":
      color = MANHATTAN_COLOR;
      break;
      case "Bronx":
        color = BRONX_COLOR;
        break;
        case "Brooklyn":
          color = BROOKLYN_COLOR;
          break;
          case "Queens":
            color = QUEENS_COLOR;
            break;
            case "Staten Island":
              color = STATEN_ISLAND_COLOR;
              break;
    default:
  }

  if(isHabitable){
    return /** @type {google.maps.Data.StyleOptions} */ ({
      fillColor: color,
      fillOpacity: 0,
      strokeColor: color,
      strokeWeight: 3,
    })
  }else {
    return /** @type {google.maps.Data.StyleOptions} */ ({
      fillColor: NON_HABITABLE_DISTRICT_COLOR,
      fillOpacity: 0.3,
      strokeWeight: 0
    })
  }
}

/*function stylePolygon2(){
  map.data.setStyle(function(feature){
    map.data.addListener('mouseover', function(event) { //If mouse is over any district, animate it
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {
            strokeWeight: 3
        });
    });

    map.data.addListener('click', function(event) {
        console.log(event.feature.getGeometry().getType()+" "+event.feature.getProperty('BoroCD'));
    });

    map.data.addListener('mouseout', function(event) { //If mouse is not over any district, don't animate it
        map.data.revertStyle();
    });
  })
}*/

function displayNeighborhoods() {
    if (neighborhoodsLatLng[0] != null) { //If there's entries. Otherwise there'll be an error.
        clearMarkers(); //Took from google maps Documentation.
        for (var i = 0; i < 299; i++) {
            var position = neighborhoodsLatLng[i];
            var options;

            var profileContent = '<div class="content">' +
                                '  <div class="container">' +
                                '    <div class="row">' +
                                '      <h6 class="title">' + neighborhoodsNames[i] + '</h6>' +
                                '    </div>' +
                                '      <ul>' +
                                '        <li id="list">Borough: ' + neighborhoodsBorough[i] + '</li>' +
                                '      </ul>' +
                                '    </div>' +
                                '  </div>' +
                                '</div>';

            switch (neighborhoodsBorough[i]) {
                case "Manhattan":
                    icon = 'https://i.imgur.com/r3rAzAs.png';
                    if (neighborhoodsNames[i] == "Marble Hill") icon = 'https://i.imgur.com/gehgVsr.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon
                    };
                    break;
                case "Brooklyn":
                    icon = 'https://i.imgur.com/zjACwHT.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon
                    };
                    break;
                case "Queens":
                    icon = 'https://i.imgur.com/76oqq5j.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon
                    };
                    break;
                case "Bronx":
                    icon = 'https://i.imgur.com/gehgVsr.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon
                    };
                    break;
                case "Staten Island":
                    icon = 'https://i.imgur.com/mXWAvc9.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon
                    };
                    break;
                default:
            }

            addMarkerWithTimeout(options, 2*i, profileContent); //Add markers with velocityTimeOut.
        }
    }
}

function displayCrimes() {
    if (crimesLatLng[0] != null) { //If there's entries. Otherwise there'll be an error.
        clearMarkers();
        for (var i = 0; i < 1000; i++) {
            var position = crimesLatLng[i];
            var options;

            var profileContent = '<div class="content">' +
                                '  <div class="container">' +
                                '    <div class="row">' +
                                '      <h6 class="title">' + crimesDescription[i] + '</h6>' +
                                '    </div>' +
                                '    <div class="row">' +
                                '      <ul>' +
                                '        <li>Date: ' + crimesDate[i] + '</li>' +
                                '        <li>Borough: ' + crimesBorough[i] + '</li>' +
                                '      </ul>' +
                                '    </div>' +
                                '  </div>' +
                                '</div>';

            switch (crimesBorough[i]) {
                case "MANHATTAN":
                    icon = 'https://i.imgur.com/tbJGDlY.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon
                    } //, animation: google.maps.Animation.DROP};//google.maps.Animation.BOUNCE
                    break;
                case "BROOKLYN":
                    icon = 'https://i.imgur.com/EBfTKmJ.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon
                    } //, animation: google.maps.Animation.DROP};
                    break;
                case "QUEENS":
                    icon = 'https://i.imgur.com/3O2iWHc.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon
                    } //,animation: google.maps.Animation.DROP};
                    break;
                case "BRONX":
                    icon = 'https://i.imgur.com/3CqMNaC.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon
                    } //, animation: google.maps.Animation.DROP};
                    break;
                case "STATEN ISLAND":
                    icon = 'https://i.imgur.com/iFZ9Evv.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon
                    } //, animation: google.maps.Animation.DROP};
                    break;
                default:
            }

            addMarkerWithTimeout(options, i * 1, profileContent);
        }
    }
}

function displayHousing() {
    clearMarkers();

    for (var i = 0; i < 2917; i++) {
        if ( /*housingExtLowInc[i]>=0 &&*/ housingLatLng[i] != null) { //This line is needed because some housing Objects don't have Location Object.
            var position = housingLatLng[i];
            var options;
            var rawContent = housingDetails[i].split(",");

            var profileContent = '<div class="content">'+
                                  '  <div class="container">'+
                                  '    <div class="row">'+
                                  '      <h6 class="title">'+rawContent[0]+'</h6>'+
                                  '    </div>'+
                                  '    <div class="row">'+
                                  '      <p>'+ "This housing offer has: "+ housingExtLowInc[i] +" Extremely Low Income Units." +'</p>'+
                                  '    </div>'+
                                  '    <div class="row">'+
                                  '      <ul>'+
                                  '        <li>Street: '+rawContent[1]+'</li>'+
                                  '        <li>Borough: '+housingBorough[i]+'</li>'+
                                  '        <li>Construction Type: '+rawContent[2]+'</li>'+
                                  '      </ul>'+
                                  '    </div>'+
                                  '  </div>'+
                                  '</div>';

            switch (housingBorough[i]) {
                case "Manhattan":
                    icon = 'https://i.imgur.com/pzsrAI7.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon,
                        zIndex: i
                    };
                    break;
                case "Brooklyn":
                    icon = 'https://i.imgur.com/5zkbHp4.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon,
                        zIndex: i
                    };
                    break;
                case "Queens":
                    icon = 'https://i.imgur.com/b2DK7lZ.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon,
                        zIndex: i
                    };
                    break;
                case "Bronx":
                    icon = 'https://i.imgur.com/RqNeLpE.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon,
                        zIndex: i
                    };
                    break;
                case "Staten Island":
                    icon = 'https://i.imgur.com/ttFqY7x.png';
                    options = {
                        position: position,
                        map: map,
                        icon: icon,
                        zIndex: i
                    };
                    break;
                default:
            }

            addMarkerWithTimeout(options, i / 2, profileContent); //Add markers
        }
    }
}

function displayHeatMap() { //Inspired on Google Maps Documentation on this: https://developers.google.com/maps/documentation/javascript/examples/layer-heatmap?hl=es-419
    if (!isHeatMap && crimesLatLng[0] != null) {
        isHeatMap = true;
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: crimesLatLng,
            map: map
        });
        heatmap.set('radius', 17);
    }
}

function displayTabulationNeighborhoods() {
  map.data.loadGeoJson(URLTabulationNeighborhoods);

  map.data.setStyle(function(feature) {
    return{
      fillOpacity: 0,
      strokeWeight: 1,
      strokeColor: '#928C6F',
      zIndex: 0
    }
  });
}

function displayMuseums() {
    clearMarkers(); //Took from google maps Documentation.
    for (var i = 0; i < 130; i++) {
        var position = museumsLatLng[i];
        //console.log(museumsNames[i]);
        var options = {
            position: position,
            map: map,
            icon: 'https://i.imgur.com/rR092N4.png'
        };

        var profileContent =  '<div class="content">' +
                              '  <div class="container">' +
                              '    <div class="row">' +
                              '      <h3 class="title">' + museumsNames[i] + '</h3>' +
                              '    </div>' +
                              '    </div>' +
                              '  </div>' +
                              '</div>';

        addMarkerWithTimeout(options, 2*i, profileContent); //Add markers with velocityTimeOut.
    }


}
////////////////////AUXILIAR FUNCTIONS FOR DISPLAYING////////////////////////////
function addMarkerWithTimeout(options, timeout, content) { //Multiple markers animation example from Google Maps documentation: https://developers.google.com/maps/documentation/javascript/examples/marker-animations-iteration?hl=es-419, functions: clearMarkers() and addMarkerWithTimeout() were taken from there.
    window.setTimeout(function() {
        var tempMarker = new google.maps.Marker(options);
        assignInfoWindow(tempMarker, content); //Every marker shares the same InfoWindow.
        markers.push(tempMarker);

    }, timeout);
}

function assignInfoWindow(marker, informationWindowContent) {

    google.maps.event.addListener(marker, 'click', function() { //If marker is clicked...
        map.panTo(this.getPosition());
        smoothZoomIn(map, PAN_ZOOM, map.getZoom());
        informationWindow.open(map, marker);
        informationWindow.setContent(informationWindowContent, marker.getPosition()); //informationWindow shows up on the marker.
    });

    google.maps.event.addListener(marker, 'dblclick', function() {
        zoomOut();
    })
}

function zoomOut() {
    if (map != null) {
        //map.setCenter(map.getCenter().getPosition()); // set map center to marker position
        smoothZoomOut(map, 10.9, map.getZoom()); // call smoothZoom, parameters map, final zoomLevel, and starting zoom level
        informationWindow.close();
    }
}

function smoothZoomOut(map, desiredZoom, currentZoom) { //Function took from this StackOverflow post: https://stackoverflow.com/questions/4752340/how-to-zoom-in-smoothly-on-a-marker-in-google-maps
    if (desiredZoom > currentZoom) { //Bigger zoom means more close to the floor.
        map.setCenter(customCenter);
        map.setZoom(desiredZoom);
        return; //STOP!
    } else {
        tempListener = google.maps.event.addListener(map, 'zoom_changed', function(event) {
            google.maps.event.removeListener(tempListener);
            smoothZoomOut(map, desiredZoom, currentZoom - .5);
        });
        setTimeout(function() {
            map.setZoom(currentZoom)
        }, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}

function smoothZoomIn(map, desiredZoom, currentZoom) { //just above's code with a little tweak.
    if (desiredZoom < currentZoom) { //Bigger zoom means more close to the floor.
        map.setZoom(desiredZoom);
        return; //STOP!
    } else {
        tempListener = google.maps.event.addListener(map, 'zoom_changed', function(event) {
            google.maps.event.removeListener(tempListener);
            smoothZoomIn(map, desiredZoom, currentZoom + .5);
        });
        setTimeout(function() {
            map.setZoom(currentZoom)
        }, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null); //Kick markers out of the map.
    }
    markers = []; //Clear the array.
}

function disableHeatMap() {
    if (heatmap) {
        isHeatMap = false;
        heatmap.setMap(null);
    }
}

function toPosition(latitude, longitude) { //just a function to return a valid position for map.
    return new google.maps.LatLng(latitude, longitude);
}
/////////////////////METHODS FOR RANKING DISTRICTS//////////////////////////////
function getDistrict(LatLng) {
  for (var i = 0; i < 71; i++) {
    if(geoShapeType[i]=="Polygon"){
      if(google.maps.geometry.poly.containsLocation(LatLng, locationPolygon[i])) {
        return geoShapeBOROCD[i];
      }
    }else{
      for (var j = 0; j < locationPolygon[i].length; j++) {
        if(google.maps.geometry.poly.containsLocation(LatLng, locationPolygon[i][j])) {
          return geoShapeBOROCD[i];
        }
      }
    }
  }
}

function getPolygonCenter(polygon){//Code from: https://stackoverflow.com/questions/24401240/how-to-get-latlngbounds-of-feature-polygon-geometry-in-google-maps-v3
  var bounds = new google.maps.LatLngBounds();

  polygon.getPath().forEach(function(latLng){
     bounds.extend(latLng);
  });

  return bounds.getCenter();
}

function getAverageMultiPolygon(multiPolygon){
  var max = -1, biggerPolygon=0;
  for (var i = 0; i < multiPolygon.length; i++) {
    if(max<google.maps.geometry.spherical.computeArea(multiPolygon[i].getPath())){//Found onhttps://stackoverflow.com/questions/9037083/calculating-area-of-a-polygon-drawn-on-google-map
      max = google.maps.geometry.spherical.computeArea(multiPolygon[i].getPath());
      biggerPolygon=i;
    }
  }
  return getPolygonCenter(multiPolygon[biggerPolygon]);
}

function getCrossReferenceIndex(borocd){
  return geoShapeBOROCD.indexOf(borocd);
}

function calculateDistanceToNYU(pos){
  return google.maps.geometry.spherical.computeDistanceBetween(pos, nyu_coordinates)/1000/*Meters*/;
}

function calculateClosenessByDistrict(){//This exact method runs while loading
  for (var i = 0; i < geoShapePolygons.length; i++) {
    switch (geoShapeType[i]) {
      case "Polygon":
        var polygon = new google.maps.Polygon(stylePolygon(geoShapeBorough[i],geoShapeHabitable[i]));
        polygon.setPath(geoShapePolygons[i]);
        locationPolygon.push(polygon);//Store the object

        var position = getPolygonCenter(polygon);
        distancesFromNYU[i]= calculateDistanceToNYU(position);
        break;

      case "MultiPolygon":
        var tempPolygons=[];

        for (var j = 0; j < geoShapePolygons[i].length; j++) {
          var polygon = new google.maps.Polygon(stylePolygon(geoShapeBorough[i],geoShapeHabitable[i],i));
          polygon.setPath(geoShapePolygons[i][j]);
          tempPolygons.push(polygon);
        }
        locationPolygon.push(tempPolygons);

        var position = getAverageMultiPolygon(tempPolygons);
        distancesFromNYU[i]= calculateDistanceToNYU(position);
        break;
      default:
    }
  }console.log(distancesFromNYU);
}

function calculateSafetyByDistrict(){//HEAVY METHOD, USE IT WITH CAUTION.
  for (var i = 0; i < 71; i++) {
    CbyDistrict.push(0);
  }
  for (var i = 0; i < crimesLatLng.length; i++) {//2093 ITEMS
      CbyDistrict[getCrossReferenceIndex(getDistrict(crimesLatLng[i]))]+=1;
  }console.log(CbyDistrict);
}

function calculateAffordabilityByDistrict(){//TOO HEAVY METHOD TO BE CALCULATED, USE AT YOUR OWN RISK
  for (var i = 0; i < 71; i++) {
    ELIUbyDistrict.push(0);
  }
  for (var i = 0; i < housingLatLng.length; i++) {//2093 ITEMS
    currentExLowInUnits = housingExtLowInc[i];
    if(currentExLowInUnits!=0){
      ELIUbyDistrict[getCrossReferenceIndex(getDistrict(housingLatLng[i]))]+=currentExLowInUnits;
    }
  }console.log(ELIUbyDistrict);
}

function calculateAllParameters() {
    calculateClosenessByDistrict();
    calculateSafetyByDistrict();
    calculateAffordabilityByDistrict();
    calculateTop3();
}

function updateTop3Table(){
  var sortedDistances = distancesFromNYU.slice();
  sortedDistances.sort(function(a,b){return a[0]-b[0];});

  var sortedCrimes = crimesByDistrict.slice();
  sortedCrimes.sort(function(a,b){return a[0]-b[0];});

  var sortedUnits = extremeLowIncomeUnitsByDistrict.slice();
  sortedUnits.sort(function(a,b){return b[0]-a[0];});

  var sortedOverall = [];

  for (var i = 0; i < 71; i++) {
    sortedOverall[i] = distancesFromNYU[i][1];
  }

  for (i = 0; i < 71; i++) {

    var distanceIndex = -1;
    for (var j = 0; j < 71; j++) {
      if(sortedDistances[j][1]==sortedOverall[i]){
        distanceIndex = j;
        break;
      }
    }
    var crimeIndex = -1;
    for (var k = 0; k < 71; k++) {
      if(sortedCrimes[k][1]==sortedOverall[i]){
        crimeIndex = k;
        break;
      }
    }
    var affordIndex = -1;
    for (var l = 0; l < 71; l++) {
      if(sortedUnits[l][1]==sortedOverall[i]){
        affordIndex = l;
        break;
      }
    }
    const AVG = distanceIndex+crimeIndex+affordIndex;
    sortedOverall[i] = [sortedOverall[i], AVG, sortedDistances[distanceIndex][0], sortedCrimes[crimeIndex][0], sortedUnits[affordIndex][0]];
  }
  sortedOverall.sort(function(a,b){return a[1]-b[1];});

  var tableReference = $("#mainTableBody4")[0];
	var newRow4, dist,safe,affor, d;

  var count = 0,top = 3;
	for(i = 0; i < 71/*sortedDistances.length*/; i++){
    var x = geoShapeBOROCD.indexOf(sortedOverall[i][0]);
    if(count==top) break;
      if(geoShapeHabitable[x]){
        count++;
        newRow4 = tableReference.insertRow(tableReference.rows.length);
    		d = newRow4.insertCell(0);
    		dist = newRow4.insertCell(1);
        safe = newRow4.insertCell(2);
        affor = newRow4.insertCell(3);
    		d.innerHTML = sortedOverall[i][0];
    		dist.innerHTML = sortedOverall[i][2];
        safe.innerHTML = sortedOverall[i][3];
        affor.innerHTML = sortedOverall[i][4];
    }
	}
}

function updateClosenessTable(){
	var tableReference = $("#mainTableBody1")[0];
	var newRow1, distanceToNYU, d;

  var sortedDistances = distancesFromNYU.slice();
  sortedDistances.sort(function(a,b){return a[0]-b[0];});
  var count = 0,top = 10;
	for(var i = 0; i < 71/*sortedDistances.length*/; i++){
    if(count==top) break;
      if(geoShapeHabitable[i]){
        count++;
        newRow1 = tableReference.insertRow(tableReference.rows.length);
    		d = newRow1.insertCell(0);
    		distanceToNYU = newRow1.insertCell(1);
    		d.innerHTML = sortedDistances[i][1];
    		distanceToNYU.innerHTML = sortedDistances[i][0];
    }
	}
}

function updateSafetyTable(){
	var tableReference = $("#mainTableBody2")[0];
	var newRow2, crimes, d;

  var sortedCrimes = crimesByDistrict.slice();
  sortedCrimes.sort(function(a,b){return a[0]-b[0];});

  var count = 0,top = 10;
	for(var i = 0; i < 71/*sortedDistances.length*/; i++){
    if(count==top) break;
    var x = sortedCrimes[i][2];
    if(geoShapeHabitable[x]){
  		newRow2 = tableReference.insertRow(tableReference.rows.length);
      count++;
  		d = newRow2.insertCell(0);
  		crimes = newRow2.insertCell(1);
  		d.innerHTML = sortedCrimes[i][1];
  		crimes.innerHTML = sortedCrimes[i][0];
    }
	}
}

function updateAffordabilityTable(){
	var tableReference = $("#mainTableBody3")[0];
	var newRow3, exLoInUnit, d;

  var sortedUnits = extremeLowIncomeUnitsByDistrict.slice();
  sortedUnits.sort(function(a,b){return b[0]-a[0];});
  var count = 0,top = 10;
	for(var i = 0; i < 71/*sortedDistances.length*/; i++){
    if(count==top) break;
      if(geoShapeHabitable[i]){
        count++;
  		newRow3 = tableReference.insertRow(tableReference.rows.length);
  		d = newRow3.insertCell(0);
  		exLoInUnit = newRow3.insertCell(1);
  		d.innerHTML = sortedUnits[i][1];
  		exLoInUnit.innerHTML = sortedUnits[i][0];
    }
	}
}

function updateAllTables(){
  updateClosenessTable();
  updateSafetyTable();
  updateAffordabilityTable();
  updateTop3Table();
}

function updateAllDatasets() {
    getAllMandatoryDataInOrder();
    getAllOptionalDataInOrder();
}
/////////////////////////DATA VISUALIZATION FUNCTIONS///////////////////////////
function displayLiquidCharts(closeness,safety,affordability) {
  var closeConfig = liquidFillGaugeDefaultSettings();
  closeConfig.maxValue = 27;
  closeConfig.textVertPosition = 0.5;
  closeConfig.waveAnimateTime = 1000;
  closeConfig.displayPercent = false;
  var gauge1 = loadLiquidFillGauge("Closeness", closeness, closeConfig);
  var crimeConfig = liquidFillGaugeDefaultSettings();
  crimeConfig.circleColor = "#FF7777";
  crimeConfig.textColor = "#FF4444";
  crimeConfig.waveTextColor = "#FFAAAA";
  crimeConfig.waveColor = "#FFDDDD";
  crimeConfig.maxValue = 46;
  crimeConfig.circleThickness = 0.5;
  crimeConfig.textVertPosition = 0.5;
  crimeConfig.waveAnimateTime = 1000;
  crimeConfig.displayPercent = false;
  var gauge2= loadLiquidFillGauge("Safety", safety, crimeConfig);
  var affordConfig = liquidFillGaugeDefaultSettings();
  affordConfig.circleColor = "#57AFA7";
  affordConfig.textColor = "#33D6C5";
  affordConfig.waveTextColor = "#6AE1D4";
  affordConfig.waveColor = "#57AFA7";
  affordConfig.maxValue = 1353;
  affordConfig.circleThickness = 0.2;
  affordConfig.circleFillGap = 0.2;
  affordConfig.textVertPosition = 0.5;
  affordConfig.waveAnimateTime = 2000;
  affordConfig.waveHeight = 0.2;
  affordConfig.waveCount = 1;
  affordConfig.displayPercent = false;
  var gauge3 = loadLiquidFillGauge("Affordability", affordability,affordConfig);
}

function updateLiquidCharts(close,saf,afford){
  gauge1.update(close);
  gauge2.update(saf);
  gauge3.update(afford)
}

function liquidFillGaugeDefaultSettings(){
  return {
      minValue: 0, // The gauge minimum value.
      maxValue: 100, // The gauge maximum value.
      circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
      circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
      circleColor: "#178BCA", // The color of the outer circle.
      waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
      waveCount: 1, // The number of full waves per width of the wave circle.
      waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
      waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
      waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
      waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
      waveAnimate: true, // Controls if the wave scrolls or is static.
      waveColor: "#178BCA", // The color of the fill wave.
      waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
      textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
      textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
      valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
      displayPercent: true, // If true, a % symbol is displayed after the value.
      textColor: "#045681", // The color of the value text when the wave does not overlap it.
      waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
  };
}

function loadLiquidFillGauge(elementId, value, config) {
    if(config == null) config = liquidFillGaugeDefaultSettings();

    var gauge = d3.select("#" + elementId);
    var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2;
    var locationX = parseInt(gauge.style("width"))/2 - radius;
    var locationY = parseInt(gauge.style("height"))/2 - radius;
    var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

    var waveHeightScale;
    if(config.waveHeightScaling){
        waveHeightScale = d3.scale.linear()
            .range([0,config.waveHeight,0])
            .domain([0,50,100]);
    } else {
        waveHeightScale = d3.scale.linear()
            .range([config.waveHeight,config.waveHeight])
            .domain([0,100]);
    }

    var textPixels = (config.textSize*radius/2);
    var textFinalValue = parseFloat(value).toFixed(2);
    var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
    var percentText = config.displayPercent?"%":"";
    var circleThickness = config.circleThickness * radius;
    var circleFillGap = config.circleFillGap * radius;
    var fillCircleMargin = circleThickness + circleFillGap;
    var fillCircleRadius = radius - fillCircleMargin;
    var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

    var waveLength = fillCircleRadius*2/config.waveCount;
    var waveClipCount = 1+config.waveCount;
    var waveClipWidth = waveLength*waveClipCount;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    var textRounder = function(value){ return Math.round(value); };
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(1); };
    }
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(2); };
    }

    // Data for building the clip wave area.
    var data = [];
    for(var i = 0; i <= 40*waveClipCount; i++){
        data.push({x: i/(40*waveClipCount), y: (i/(40))});
    }

    // Scales for drawing the outer circle.
    var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);
    var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);

    // Scales for controlling the size of the clipping path.
    var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
    var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);

    // Scales for controlling the position of the clipping path.
    var waveRiseScale = d3.scale.linear()
        // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
        // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.
        .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
        .domain([0,1]);
    var waveAnimateScale = d3.scale.linear()
        .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
        .domain([0,1]);

    // Scale for controlling the position of the text within the gauge.
    var textRiseScaleY = d3.scale.linear()
        .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
        .domain([0,1]);

    // Center the gauge within the parent SVG.
    var gaugeGroup = gauge.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');

    // Draw the outer circle.
    var gaugeCircleArc = d3.svg.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius-circleThickness));
    gaugeGroup.append("path")
        .attr("d", gaugeCircleArc)
        .style("fill", config.circleColor)
        .attr('transform','translate('+radius+','+radius+')');

    // Text where the wave does not overlap.
    var text1 = gaugeGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // The clipping wave area.
    var clipArea = d3.svg.area()
        .x(function(d) { return waveScaleX(d.x); } )
        .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
        .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
    var waveGroup = gaugeGroup.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + elementId);
    var wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea)
        .attr("T", 0);

    // The inner circle with the clipping wave attached.
    var fillCircleGroup = gaugeGroup.append("g")
        .attr("clip-path", "url(#clipWave" + elementId + ")");
        fillCircleGroup.append("circle")
        .attr("cx", radius)
        .attr("cy", radius)
        .attr("r", fillCircleRadius)
        .style("fill", config.waveColor);

    // Text where the wave does overlap.
    var text2 = fillCircleGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.waveTextColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // Make the value count up.
    if(config.valueCountUp){
        var textTween = function(){
            var i = d3.interpolate(this.textContent, textFinalValue);
            return function(t) { this.textContent = textRounder(i(t)) + percentText; }
        };
        text1.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
        text2.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    var waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;
    if(config.waveRise){
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
            .transition()
            .duration(config.waveRiseTime)
            .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
            .each("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
    }

    if(config.waveAnimate) animateWave();

    function animateWave() {
        wave.attr('transform','translate('+waveAnimateScale(wave.attr('T'))+',0)');
        wave.transition()
            .duration(config.waveAnimateTime * (1-wave.attr('T')))
            .ease('linear')
            .attr('transform','translate('+waveAnimateScale(1)+',0)')
            .attr('T', 1)
            .each('end', function(){
                wave.attr('T', 0);
                animateWave(config.waveAnimateTime);
            });
    }

function GaugeUpdater(){
      this.update = function(value){
          var newFinalValue = parseFloat(value).toFixed(2);
          var textRounderUpdater = function(value){ return Math.round(value); };
          if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
              textRounderUpdater = function(value){ return parseFloat(value).toFixed(1); };
          }
          if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
              textRounderUpdater = function(value){ return parseFloat(value).toFixed(2); };
          }

          var textTween = function(){
              var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
              return function(t) { this.textContent = textRounderUpdater(i(t)) + percentText; }
          };

          text1.transition()
              .duration(config.waveRiseTime)
              .tween("text", textTween);
          text2.transition()
              .duration(config.waveRiseTime)
              .tween("text", textTween);

          var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;
          var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);
          var waveRiseScale = d3.scale.linear()
              // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
              // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
              // circle at 100%.
              .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
              .domain([0,1]);
          var newHeight = waveRiseScale(fillPercent);
          var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
          var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);
          var newClipArea;
          if(config.waveHeightScaling){
              newClipArea = d3.svg.area()
                  .x(function(d) { return waveScaleX(d.x); } )
                  .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
                  .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
          } else {
              newClipArea = clipArea;
          }

          var newWavePosition = config.waveAnimate?waveAnimateScale(1):0;
          wave.transition()
              .duration(0)
              .transition()
              .duration(config.waveAnimate?(config.waveAnimateTime * (1-wave.attr('T'))):(config.waveRiseTime))
              .ease('linear')
              .attr('d', newClipArea)
              .attr('transform','translate('+newWavePosition+',0)')
              .attr('T','1')
              .each("end", function(){
                  if(config.waveAnimate){
                      wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                      animateWave(config.waveAnimateTime);
                  }
              });
          waveGroup.transition()
              .duration(config.waveRiseTime)
              .attr('transform','translate('+waveGroupXPosition+','+newHeight+')')
      }
  }

  return new GaugeUpdater();
}

function displayClosestPolygons() {
  clearAllPolygons();
    sortedDistances = distancesFromNYU.slice();
    sortedDistances.sort(function(a,b){return a[0]-b[0];});

    var count = 0, top = 10;
  	for(var i = 0; i < 71; i++){
      if(count==top) break;
      var x = sortedDistances[i][2];
      if (geoShapeType[x]=="Polygon"&&geoShapeHabitable[x]) {
        count++;
        locationPolygon[x].setMap(map);
      }else if (geoShapeType[x]=="MultiPolygon"&&geoShapeHabitable[x]) {
        count++;
        for (var j = 0; j < locationPolygon[x].length; j++) {
          locationPolygon[x][j].setMap(map);
        }
      }
  	}

}

function displaySafestPolygons() {
  clearAllPolygons();
  sortedCrimes = crimesByDistrict.slice();
  sortedCrimes.sort(function(a,b){return a[0]-b[0];});

  var count = 0, top = 10;
	for(var i = 0; i < 71; i++){
    if(count==top) break;
    var x = sortedCrimes[i][2];
    if (geoShapeType[x]=="Polygon" && geoShapeHabitable[x]) {
      count++;
      locationPolygon[x].setMap(map);
    }else if (geoShapeType[x]=="MultiPolygon" && geoShapeHabitable[x]) {
      count++;
      for (var j = 0; j < locationPolygon[x].length; j++) {
        locationPolygon[x][j].setMap(map);
      }
    }
	}
}

function displayAffordablePolygons() {
  clearAllPolygons();
  sortedUnits = extremeLowIncomeUnitsByDistrict.slice();
  sortedUnits.sort(function(a,b){return b[0]-a[0];});

  var count = 0, top = 10;
  for(var i = 0; i < 71; i++){
    if(count==top) break;
    var x = sortedUnits[i][2];
    if (geoShapeType[x]=="Polygon" && geoShapeHabitable[x]) {
      count++;
      locationPolygon[x].setMap(map);
    }else if (geoShapeType[x]=="MultiPolygon" && geoShapeHabitable[x]) {
      count++;
      for (var j = 0; j < locationPolygon[x].length; j++) {
        locationPolygon[x][j].setMap(map);
      }
    }
  }
}

function displayTop3Polygons() {
  clearAllPolygons();

  var sortedDistances = distancesFromNYU.slice();
  sortedDistances.sort(function(a,b){return a[0]-b[0];});

  var sortedCrimes = crimesByDistrict.slice();
  sortedCrimes.sort(function(a,b){return a[0]-b[0];});

  var sortedUnits = extremeLowIncomeUnitsByDistrict.slice();
  sortedUnits.sort(function(a,b){return b[0]-a[0];});

  var sortedOverall = [];

  for (var i = 0; i < 71; i++) {
    sortedOverall[i] = distancesFromNYU[i][1];
  }

  for (i = 0; i < 71; i++) {

    var distanceIndex = -1;
    for (var j = 0; j < 71; j++) {
      if(sortedDistances[j][1]==sortedOverall[i]){
        distanceIndex = j;
        break;
      }
    }
    var crimeIndex = -1;
    for (var k = 0; k < 71; k++) {
      if(sortedCrimes[k][1]==sortedOverall[i]){
        crimeIndex = k;
        break;
      }
    }
    var affordIndex = -1;
    for (var l = 0; l < 71; l++) {
      if(sortedUnits[l][1]==sortedOverall[i]){
        affordIndex = l;
        break;
      }
    }
    const AVG = distanceIndex+crimeIndex+affordIndex;
    sortedOverall[i] = [sortedOverall[i], AVG, geoShapeBOROCD.indexOf(sortedOverall[i])];
  }

  sortedOverall.sort(function(a,b){return a[1]-b[1];});

  var count = 0, top = 3;
  for(var i = 0; i < 71; i++){
    if(count==top) break;
    var x = sortedOverall[i][2];
    if (geoShapeType[x]=="Polygon" && geoShapeHabitable[x]) {
      count++;
      locationPolygon[x].setMap(map);
    }else if (geoShapeType[x]=="MultiPolygon" && geoShapeHabitable[x]) {
      count++;
      for (var j = 0; j < locationPolygon[x].length; j++) {
        locationPolygon[x][j].setMap(map);
      }
    }
  }
}

function displayAllPolygons(){
  for (var i = 0; i < locationPolygon.length; i++) {
    switch (geoShapeType[i]) {
      case "Polygon":
        locationPolygon[i].setMap(map);
        break;
        case "MultiPolygon":
          for (var j = 0; j < locationPolygon[i].length; j++) {
            locationPolygon[i][j].setMap(map);
          }
          break;
      default:
    }
  }
}

function clearAllPolygons(){
  map.data.setStyle(function(feature){return{visible:false}});

  for (var i = 0; i < locationPolygon.length; i++) {
    switch (geoShapeType[i]) {
      case "Polygon":
        locationPolygon[i].setMap(null);
        break;
        case "MultiPolygon":
          for (var j = 0; j < locationPolygon[i].length; j++) {
            locationPolygon[i][j].setMap(null);
          }
          break;
      default:
    }
  }
}

function downloadCSV(csv, filename) {//Took from: https://www.codexworld.com/export-html-table-data-to-csv-using-javascript/
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}
function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);
        csv.push(row.join(","));
    }
    downloadCSV(csv.join("\n"), filename);
}


$(document).ready(function() {
    $("#displayNeighborhoodsButton").on("click", displayNeighborhoods);
    $("#displayCrimesButton").on("click", displayCrimes);
    $("#displayHousingButton").on("click", displayHousing);
    $("#zoomOutButton").on("click", zoomOut);
    $("#heatMapButton").on("click", displayHeatMap);
    $("#noHeatMapButton").on("click", disableHeatMap);
    $("#noMarkers").on("click", clearMarkers);
    $("#districts").on("click", updateAllTables);
    $("#polygons").on("click", displayAllPolygons);
    $("#noPolygons").on("click", clearAllPolygons);
    $("#closest").on("click", displayClosestPolygons);
    $("#safest").on("click", displaySafestPolygons);
    $("#more-affordable").on("click", displayAffordablePolygons);
    $("#neighborhoods").on("click", displayTabulationNeighborhoods);
    $("#museums").on("click", displayMuseums);
    $("#top3").on("click", displayTop3Polygons);
    $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
      });
});
