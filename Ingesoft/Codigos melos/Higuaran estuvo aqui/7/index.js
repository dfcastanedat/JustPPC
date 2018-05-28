
var map;
var boroughs = {
	"Bronx" : ["District 1", "District 2", "District 3", "District 4", "District 5", "District 6", "District 7", "District 8", "District 9", "District 10", "District 11", "District 12"],
	"Brooklyn" : ["District 1", "District 2", "District 3", "District 4", "District 5", "District 6", "District 7", "District 8", "District 9", "District 10", "District 11", "District 12", "District 13", "District 14", "District 15", "District 16", "District 17", "District 18"],
	"Manhattan" : ["District 1", "District 2", "District 3", "District 4", "District 5", "District 6", "District 7", "District 8", "District 9", "District 10", "District 11", "District 12"],
	"Queens" : ["District 1", "District 2", "District 3", "District 4", "District 5", "District 6", "District 7", "District 8", "District 9", "District 10", "District 11", "District 12", "District 13", "District 14"],
	"Staten" : ["District 1", "District 2", "District 3"]
};
//-----------------NY Districts geoshapes---------------------------------------------------------------------------------------------
var json;
var dist = [];
function updateDistricts(){
	var URL = "http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
  	var data = $.get(URL, function(){
  	})
  		.done( function(){
  			//Success
        var text = data.responseText;
        json = JSON.parse(text);
        getCoords();
  		})
  		.fail( function(error){
  			console.error(error);
  		});
}
function getCoords() {
    var cont = 70;
    var coord = [];
    for (var i = 0; i < 71; i++) {
      if (i==14 || i == 18 || i == 20 || i == 26 || i ==28 || i == 47 || i == 52 || i == 55 || i == 58 || i == 59 ||
          i == 63 || i == 65 || i == 66 || i == 67) {
        for (var k = 0; k < json.features[i].geometry.coordinates.length; k++) {
          coords = [];
          for (var j = 0; j < json.features[i].geometry.coordinates[k][0].length; j++) {
              coords[j] = {lat: json.features[i].geometry.coordinates[k][0][j][1],
              lng: json.features[i].geometry.coordinates[k][0][j][0]};
          }
          cont++;
          dist[cont] = coords;
        }
      } else {
        coords = [];
        for (var l = 0; l < json.features[i].geometry.coordinates[0].length; l++) {
            coords[l] = {lat: json.features[i].geometry.coordinates[0][l][1],
            lng: json.features[i].geometry.coordinates[0][l][0]};
        }
        dist[i] = coords;
      }
    }
}
//-----------------Crimes in NY---------------------------------------------------------------------------------------------
var dataCrimes = [];
function updateCrimesBrx() {
    var URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=boro_nm,latitude,longitude,law_cat_cd,ofns_desc&$where=boro_nm=\"BRONX\" AND cmplnt_fr_dt>=\"2016-12-01T00:00:00\"&$order=cmplnt_num";
    dataCrimes[0] = $.get(URL, console.log(URL))
      .done(function () {
          console.log(dataCrimes[0]);
          updateCrimeBro();
          updateDataChart(1, 0);
      })
      .fail(function (error) {
          console.log(error);
      });
}
function updateCrimeBro() {
    URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=boro_nm,latitude,longitude,law_cat_cd&$where=boro_nm=\"BROOKLYN\" AND cmplnt_fr_dt>=\"2016-12-01T00:00:00\"&$order=cmplnt_num";
    dataCrimes[1] = $.get(URL, console.log(URL))
      .done(function () {
          //console.log(dataCrimes[4]);
          updateCrimeMan();
      })
      .fail(function (error) {
          console.log(error);
      });
}
function updateCrimeMan() {
    URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=boro_nm,latitude,longitude,law_cat_cd&$where=boro_nm=\"MANHATTAN\" AND cmplnt_fr_dt>=\"2016-12-01T00:00:00\"&$order=cmplnt_num";
    dataCrimes[2] = $.get(URL, console.log(URL))
      .done(function () {
          //console.log(dataCrimes[4]);
          updateCrimeQue();
      })
      .fail(function (error) {
          console.log(error);
      });
}
function updateCrimeQue() {
    URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=boro_nm,latitude,longitude,law_cat_cd&$where=boro_nm=\"QUEENS\" AND cmplnt_fr_dt>=\"2016-12-01T00:00:00\"&$order=cmplnt_num";
    dataCrimes[3] = $.get(URL, console.log(URL))
      .done(function () {
          //console.log(dataCrimes[4]);
          updateCrimeSta();
      })
      .fail(function (error) {
          console.log(error);
      });
}
function updateCrimeSta() {
    URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=boro_nm,latitude,longitude,law_cat_cd&$where=boro_nm=\"STATEN ISLAND\" AND cmplnt_fr_dt>=\"2016-12-01T00:00:00\"&$order=cmplnt_num";
    dataCrimes[4] = $.get(URL, console.log(URL))
      .done(function () {
          //console.log(dataCrimes[4]);
          getCrimes();
      })
      .fail(function (error) {
          console.log(error);
      });
}
var allCenters = [];
function getCrimes() {
  for (var j = 0; j < 5; j++) {
    var centers = [];
    var level = [];
    for (var i = 0; i < dataCrimes[j].responseJSON.length; i++) {
      centers[i] = {lat: parseFloat (dataCrimes[j].responseJSON[i].latitude),
        lng: parseFloat(dataCrimes[j].responseJSON[i].longitude)};
      level[i] = dataCrimes[j].responseJSON[i].law_cat_cd;
    }
    allCenters[j] = {centers, level};
  }
}
var dataC = [];
var dataChart = [[],[],[],[],[]];
function updateDataChart(i, num) {
    var URL;
  if (num < 5) {
    if (i == 32) {
      for (var j = 0; j < 31; j++) {
        dataChart[num][j] = [dataC[j].responseJSON[0].cmplnt_fr_dt, dataC[j].responseJSON.length];
      }
      dataC = [];
      updateDataChart(1, num+1);
    } else {
      switch (num) {
          case 0:
            boro = "BRONX";
            break;
          case 1:
            boro = "BROOKLYN";
            break;
          case 2:
            boro = "MANHATTAN";
            break;
          case 3:
            boro = "QUEENS";
            break;
          case 4:
            boro = "STATEN ISLAND";
            break;
        }
        if (i<10) {
          URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=cmplnt_fr_dt&$where=boro_nm=\"" + boro + "\" AND cmplnt_fr_dt=\"2016-12-0" + i + "T00:00:00\"";
        } else {
          URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=cmplnt_fr_dt&$where=boro_nm=\"" + boro + "\" AND cmplnt_fr_dt=\"2016-12-" + i + "T00:00:00\"";
        }
        dataC[i-1] = $.get(URL)
          .done(function () {
            //console.log(dataC[i-1]);
            updateDataChart(i+1, num);
          })
          .fail(function (error) {
              console.log(error);
          });
    }
  }
}

//-----------------Change de center of the map---------------------------------------------------------------------------------------------
function onGoogleMapResponse(){
	map = new google.maps.Map(document.getElementById('googleMapContainer'), {
		zoom: 10,
    mapTypeId: 'hybrid'

	});
	var country = "NY Stern";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
}
function onNY(){
	var country = "New York";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
  map.setZoom(10);
}
function onBronx(){
	var country = "The Bronx";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
  map.setZoom(12);
}
function onBrooklyn(){
	var country = "Brooklyn";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
  map.setZoom(11);
}
function onManhattan(){
	var country = "Manhattan";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
  map.setZoom(11);
}
function onQueens(){
	var country = "Queens";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
  map.setZoom(10);
}
function onStaten(){
	var country = "Staten Island";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
  map.setZoom(11);
}
//-----------------Show the districts of the borough---------------------------------------------------------------------------------------------
var button = document.getElementById("close");
var table=document.getElementById("newTable");
function displayBronx() {
  $("#newTable tr").remove();
	for (var i = 0; i < boroughs["Bronx"].length ; i++) {
		var row = table.insertRow();
    row.id = i+1;
		var cell = row.insertCell(0);
		cell.innerHTML = boroughs["Bronx"][i];
	}
	button.style.visibility = "visible";
  var dibujo = new google.maps.Polygon();
  function bounds(coords) {
    dibujo = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
  }

  $("#1").hover(function() {
    bounds(dist[17]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#2").hover(function() {
    bounds([dist[77], dist[78], dist[79]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
      dibujo.setMap(null);
        dibujo.setMap(null);
  });
  $("#3").hover(function() {
    bounds(dist[23]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#4").hover(function() {
    bounds(dist[13]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#5").hover(function() {
    bounds(dist[29]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#6").hover(function() {
    bounds(dist[30]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#7").hover(function() {
    bounds(dist[15]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#8").hover(function() {
    bounds(dist[42]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#9").hover(function() {
    bounds(dist[19]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#10").hover(function() {
    bounds([dist[91], dist[92], dist[93], dist[94], dist[95], dist[96], dist[97], dist[98], dist[99], dist[100], dist[101], dist[102], dist[103],
      dist[104], dist[105], dist[106], dist[107], dist[108], dist[109], dist[110], dist[111], dist[112]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#11").hover(function() {
    bounds(dist[21]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#12").hover(function() {
    bounds(dist[27]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
}
function displayBrooklyn() {
  $("#newTable tr").remove();
	for (var i = 0; i < boroughs["Brooklyn"].length ; i++) {
		var row = table.insertRow();
    row.id = i+1;
		var cell = row.insertCell(0);
		cell.innerHTML = boroughs["Brooklyn"][i];
	}
	button.style.visibility = "visible";
  var dibujo = new google.maps.Polygon();
  function bounds(coords) {
    dibujo = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
  }
  $("#1").hover(function() {
    bounds(dist[48]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#2").hover(function() {
    bounds(dist[70]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#3").hover(function() {
    bounds(dist[49]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#4").hover(function() {
    bounds(dist[10]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#5").hover(function() {
    bounds(dist[51]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#6").hover(function() {
    bounds(dist[60]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#7").hover(function() {
    bounds(dist[61]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#8").hover(function() {
    bounds(dist[24]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#9").hover(function() {
    bounds(dist[8]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#10").hover(function() {
    bounds(dist[5]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#11").hover(function() {
    bounds(dist[0]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#12").hover(function() {
    bounds(dist[6]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#13").hover(function() {
    bounds(dist[4]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#14").hover(function() {
    bounds(dist[3]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#15").hover(function() {
    bounds(dist[56]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#16").hover(function() {
    bounds(dist[7]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#17").hover(function() {
    bounds(dist[54]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#18").hover(function() {
    bounds([dist[113], dist[114], dist[115]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
}
function displayManhattan() {
  $("#newTable tr").remove();
	for (var i = 0; i < boroughs["Manhattan"].length ; i++) {
		var row = table.insertRow();
    row.id = i+1;
		var cell = row.insertCell(0);
		cell.innerHTML = boroughs["Manhattan"][i];
	}
	button.style.visibility = "visible";
  var dibujo = new google.maps.Polygon();
  function bounds(coords) {
    dibujo = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
  }

  $("#1").hover(function() {
    bounds([dist[129], dist[130], dist[131], dist[132]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#2").hover(function() {
    bounds(dist[64]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#3").hover(function() {
    bounds(dist[36]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#4").hover(function() {
    bounds(dist[9]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#5").hover(function() {
    bounds(dist[46]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#6").hover(function() {
    bounds([dist[89], dist[90]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#7").hover(function() {
    bounds(dist[40]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#8").hover(function() {
    bounds([dist[124], dist[125], dist[126]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#9").hover(function() {
    bounds(dist[37]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#10").hover(function() {
    bounds(dist[39]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#11").hover(function() {
    bounds([dist[127], dist[128]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#12").hover(function() {
    bounds(dist[38]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
}
function displayQueens() {
  $("#newTable tr").remove();
	for (var i = 0; i < boroughs["Queens"].length ; i++) {
		var row = table.insertRow();
    row.id = i+1;
		var cell = row.insertCell(0);
		cell.innerHTML = boroughs["Queens"][i];
	}
	button.style.visibility = "visible";
  var dibujo = new google.maps.Polygon();
  function bounds(coords) {
    dibujo = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
  }

  $("#1").hover(function() {
    bounds([dist[118], dist[119]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#2").hover(function() {
    bounds(dist[12]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#3").hover(function() {
    bounds(dist[34]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#4").hover(function() {
    bounds(dist[68]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#5").hover(function() {
    bounds(dist[62]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#6").hover(function() {
    bounds(dist[69]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#7").hover(function() {
    bounds([dist[80], dist[81]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#8").hover(function() {
    bounds(dist[44]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#9").hover(function() {
    bounds(dist[31]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#10").hover(function() {
    bounds([dist[86], dist[87], dist[88]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#11").hover(function() {
    bounds(dist[45]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#12").hover(function() {
    bounds(dist[1]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#13").hover(function() {
    bounds(dist[32]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#14").hover(function() {
    bounds([dist[82], dist[83], dist[84], dist[85]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
}
function displayStaten() {
  $("#newTable tr").remove();
	for (var i = 0; i < boroughs["Staten"].length ; i++) {
		var row = table.insertRow();
    row.id = i+1;
		var cell = row.insertCell(0);
		cell.innerHTML = boroughs["Staten"][i];
	}
	button.style.visibility = "visible";
  var dibujo = new google.maps.Polygon();
  function bounds(coords) {
    dibujo = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
  }

  $("#1").hover(function() {
    bounds([dist[116], dist[117]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#2").hover(function() {
    bounds([dist[120], dist[121], dist[122], dist[123]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
  $("#3").hover(function() {
    bounds([dist[71], dist[72], dist[73], dist[74], dist[75], dist[76]]);
    dibujo.setMap(map);
  }, function() {
    dibujo.setMap(null);
  });
}
//-----------------Show the crimes in the map and in the chart---------------------------------------------------------------------------------------------
var color;
var circles = [];
function crimesBronx() {
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var i = 0; i < 1000; i++) {
    if (allCenters[0].level[i] == "FELONY") {
      color = '#FF0000'
    }else if (allCenters[0].level[i] == "MISDEMEANOR") {
      color = '#FF4D00'
    }else {
      color = '#FFFF00'
    }
    circles[i] = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: allCenters[0].centers[i],
      radius: 40
    });
  }
  chart(0);
}
function aspectsBronx() {
  $("#aspects tr").remove();
  for (var i in circles) {
    circles[i].setMap(null);
  }
  svg.selectAll("*").remove();
  var aspTable = document.getElementById("aspects");
	var row = aspTable.insertRow();
  row.id = 21;
	var cell = row.insertCell(0);
	cell.innerHTML = "Crimes";

  $("#21").on("click", crimesBronx);
}
function crimesBrooklyn() {
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var i = 0; i < 1000; i++) {
    if (allCenters[1].level[i] == "FELONY") {
      color = '#FF0000'
    }else if (allCenters[1].level[i] == "MISDEMEANOR") {
      color = '#FF4D00'
    }else {
      color = '#FFFF00'
    }
    circles[i] = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: allCenters[1].centers[i],
      radius: 40
    });
  }
  chart(1);
}
function aspectsBrooklyn() {
  $("#aspects tr").remove();
  for (var i in circles) {
    circles[i].setMap(null);
  }
  svg.selectAll("*").remove();
  var aspTable = document.getElementById("aspects");
	var row = aspTable.insertRow();
  row.id = 21;
	var cell = row.insertCell(0);
	cell.innerHTML = "Crimes";

  $("#21").on("click", crimesBrooklyn);
}
function crimesManhattan() {
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var i = 0; i < 1000; i++) {
    if (allCenters[2].level[i] == "FELONY") {
      color = '#FF0000'
    }else if (allCenters[2].level[i] == "MISDEMEANOR") {
      color = '#FF4D00'
    }else {
      color = '#FFFF00'
    }
    circles[i] = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: allCenters[2].centers[i],
      radius: 40
    });
  }
  chart(2);
}
function aspectsManhattan() {
  $("#aspects tr").remove();
  for (var i in circles) {
    circles[i].setMap(null);
  }
  svg.selectAll("*").remove();
  var aspTable = document.getElementById("aspects");
	var row = aspTable.insertRow();
  row.id = 21;
	var cell = row.insertCell(0);
	cell.innerHTML = "Crimes";

  $("#21").on("click", crimesManhattan);
}
function crimesQueens() {
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var i = 0; i < 1000; i++) {
    if (allCenters[3].level[i] == "FELONY") {
      color = '#FF0000'
    }else if (allCenters[3].level[i] == "MISDEMEANOR") {
      color = '#FF4D00'
    }else {
      color = '#FFFF00'
    }
    circles[i] = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: allCenters[3].centers[i],
      radius: 40
    });
  }
  chart(3);
}
function aspectsQueens() {
  $("#aspects tr").remove();
  for (var i in circles) {
    circles[i].setMap(null);
  }
  svg.selectAll("*").remove();
  var aspTable = document.getElementById("aspects");
	var row = aspTable.insertRow();
  row.id = 21;
	var cell = row.insertCell(0);
	cell.innerHTML = "Crimes";

  $("#21").on("click", crimesQueens);
}
function crimesStaten() {
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var i = 0; i < 1000; i++) {
    if (allCenters[4].level[i] == "FELONY") {
      color = '#FF0000'
    }else if (allCenters[4].level[i] == "MISDEMEANOR") {
      color = '#FF4D00'
    }else {
      color = '#FFFF00'
    }
    circles[i] = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: allCenters[4].centers[i],
      radius: 40
    });
  }
  chart(4);
}
function aspectsStaten() {
  $("#aspects tr").remove();
  for (var i in circles) {
    circles[i].setMap(null);
  }
  svg.selectAll("*").remove();
  var aspTable = document.getElementById("aspects");
	var row = aspTable.insertRow();
  row.id = 21;
	var cell = row.insertCell(0);
	cell.innerHTML = "Crimes";

  $("#21").on("click", crimesStaten);
}
var svg = d3.select("svg");
function chart(num) {
  svg.selectAll("*").remove();
    margin = {top: 10, right: 20, bottom: 30, left: 30};
    width  = 1200- margin.right - margin.left;
    height = 400- margin.top - margin.bottom;
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");

    var x = d3.scaleTime()
  		.rangeRound([0, width]);

  	var y = d3.scaleLinear()
  		.rangeRound([height, 0]);

    var line = d3.line()
  		.x(function(data) { return x(data.date); })
  		.y(function(data) { return y(data.close); })

  	var data = dataChart[num].map(function(data){
  		return{
  			date: parseTime(data[0]),
  			close: parseFloat(data[1])
  		};
  	});
  	x.domain(d3.extent(data, function(d) {return d.date; }));
  	y.domain(d3.extent(data, function(d) {return d.close; }));

    g.append("g")
  		.attr("transform", "translate(0," + height + ")")
  		.call(d3.axisBottom(x));

  	g.append("g")
  		.call(d3.axisLeft(y))
  		.append("text")
  		.attr("fill", "#000")
  		.attr("transform", "rotate(-90)")
  		.attr("y", 6)
  		.attr("dy" , "0.7em")
  		.text("Crimes on December, 2016")

    g.append("path")
  		.datum(data)
  		.attr("fill", "none")
  		.attr("stroke", "steelblue")
  		.attr("stroke-width", 1.5)
  		.attr("d", line);
}


function hide() {
  $("#newTable tr").remove();
  $("#aspects tr").remove();
  for (var i in circles) {
    circles[i].setMap(null);
  }
    svg.selectAll("*").remove();
	button.style.visibility = "hidden";
}

$(document).ready(updateDistricts);
$(document).ready(updateCrimesBrx);
$(document).ready( function() {
	button.style.visibility = "hidden";
	$("#close").on("click", hide);
	$("#close").on("click", onNY);
	$("#T").on("click", onBronx);
	$("#T").on("click", displayBronx);
	$("#T").on("click", aspectsBronx);
  $("#B").on("click", onBrooklyn);
	$("#B").on("click", displayBrooklyn);
	$("#B").on("click", aspectsBrooklyn);
  $("#M").on("click", onManhattan);
	$("#M").on("click", displayManhattan);
	$("#M").on("click", aspectsManhattan);
  $("#Q").on("click", onQueens);
	$("#Q").on("click", displayQueens);
  $("#Q").on("click", aspectsQueens);
  $("#S").on("click", onStaten);
	$("#S").on("click", displayStaten);
	$("#S").on("click", aspectsStaten);
})
