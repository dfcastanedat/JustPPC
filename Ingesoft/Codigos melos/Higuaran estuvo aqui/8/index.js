const GOOGLE_KEY = "AIzaSyDw-mlKd5KwCG8cflcvVpDhooXk8rRK-_c";
const INFO_URL_DISTRICTS = " https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=";
const INFO_EX_DISTRICTS = "*&outSR=4326&f=geojson";
const INFO_URL_NAMES = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const INFO_URL_HOUSING = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
const CRIMENES = "https://data.cityofnewyork.us/resource/9s4h-37hy.json";
const Museums = "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD";
const Galery = "https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD";
var map;
var Clear = 0;
var nyu = {lat:40.7291, lng:-73.9965}
var lt = 40.7291;
var ln = -73.9965;
var directionsRenderer, data , data1, data2, data3, data4,data5, dataRow, polygon, firstCoord, next,coord;
var datos = [], localidades = [], tableRows =[] ,BoroDc =[], NamesDraw = [], HousingDraw = [], Housing = [], Crime = [];
var principalDistric =[Bronx =[] , Brooklyn = [] , Manhattan=[], Queens=[], StatenIsland = []];
var principalcrimen =[Bronx =[] , Brooklyn = [] , Manhattan=[], Queens=[], StatenIsland = []];
var Distric_housing =[ Manhattan =[] , Bronx= [] , Brooklyn =[], Queens=[], StatenIsland = []];
var State_Distric = [ Manhattan =[] , Bronx= [] , Brooklyn =[], Queens=[], StatenIsland = []];
var Best = [ Manhattan =[] , Bronx= [] , Brooklyn =[], Queens=[], StatenIsland = []];
var Best_low = [];
var Museos = [];
var Galerys = [];
var States = ["Manhattan", "Bronx", "Brooklyn", "Queens", "StatenIsland" ];
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: nyu
  });
  var marker = new google.maps.Marker({
    position: nyu,
    map: map,
    title: 'NYU'
  });
  updateDataDistricts();
  updateDataNeighbor();
  updateDatahousing();
  getDataCrime();
  setTimeout(function(){
  Best_Top()},2000);
  getdataMuseums();
  
}
//updates ----------------------------------------------------------------------
function updateDatahousing(){
  var URL_HOUSING = INFO_URL_HOUSING;
  getdataHousing(URL_HOUSING);
}
function updateDataDistricts(){
  var URL_DISTRICTS = INFO_URL_DISTRICTS + INFO_EX_DISTRICTS;
  getdataDistricts(URL_DISTRICTS);
}
function updateDataNeighbor(){
  var URL_NAMES = INFO_URL_NAMES;
  getDataNeighbor(URL_NAMES);
}
//gets -------------------------------------------------------------------------
function getdataDistricts(URL_DISTRICTS){
  data2 = $.get(URL_DISTRICTS , function(){
    var j, lat , long, count;
    count = 0;
  dataRow = data2.responseText;
  dataRow = dataRow.split("],[");
  for (var i = 0; i < dataRow.length-1; i++) {
    polygon = [];
    firstCoord = dataRow[i].indexOf("[[[");
    coord = dataRow[i].slice(firstCoord+1,dataRow[i].length);
    coord = coord.split(",");
    if (coord[0].indexOf("[") != -1){
      coord[0] = coord[0].slice(coord[0].indexOf("[")+2);
    }
    if (coord[1].indexOf("]") != -1){
      coord[1] = coord[1].slice(0,coord[1].indexOf("]"));
    }
    la = parseFloat(coord[0]);
    lon = parseFloat(coord[1]);
    polygon.push({lat:lon,lng:la})
    if (i == 0 ){j = 1;}
    else{j = i+1}
    for(;dataRow[j].length < 50; j++){
      coord = dataRow[j].split(",");
      if (coord[0].indexOf("[") != -1){
        coord[0] = coord[0].slice(coord[0].indexOf("["));
      }
      if (coord[1].indexOf("]") != -1){
        coord[1] = coord[1].slice(0,coord[1].indexOf("]"));
      }
      la = parseFloat(coord[0]);
      lon = parseFloat(coord[1]);
      polygon.push({lat:lon,lng:la})
    }
    next = dataRow[j].indexOf("]]]");
    coord = dataRow[j].slice(0,next);
    coord = coord.split(",");
    var ind = dataRow[j].indexOf("BoroCD");
    var ind2 = dataRow[j].indexOf("BoroCD");
    ind = dataRow[j].slice(ind+8,ind+9);
    ind2 = dataRow[j].slice(ind2+9,ind2+11);
    BoroDc.push([ind, ind2]);
    if (coord[0].indexOf("[") != -1){
      coord[0] = coord[0].slice(coord[0].indexOf("["));
    }
    if (coord[1].indexOf("]") != -1){
      coord[1] = coord[1].slice(0,coord[1].indexOf("]"));
    }
    la = parseFloat(coord[0]);
    lon =  parseFloat(coord[1]);
    polygon.push({lat:lon,lng:la})
    localidades.push([polygon , BoroDc[count]]);
    for (var i = 0; i < localidades.length; i++) {
      if (localidades[i][1][0] === "1") {
        State_Distric[0][parseInt(localidades[i][1][1])] = localidades[i];
      }else if (localidades[i][1][0] === "2") {
        State_Distric[1][parseInt(localidades[i][1][1])] = localidades[i];
      }else if (localidades[i][1][0] === "3") {
        State_Distric[2][parseInt(localidades[i][1][1])] = localidades[i];
      }else if (localidades[i][1][0] === "4") {
        State_Distric[3][parseInt(localidades[i][1][1])] = localidades[i];
      }else if (localidades[i][1][0] === "5") {
        State_Distric[4][parseInt(localidades[i][1][1])] = localidades[i];
      }else {
        console.log("error");
      }
    }
    count++;
    i = j+1;
  }
  console.log(State_Distric);
})
}
function getdataMuseums(){
  data4 = $.get(Museums,function(){
    for (var i = 0; i < data4.responseJSON.data.length; i++) {
      Museos.push([data4.responseJSON.data[i][8],data4.responseJSON.data[i][9]])
    }
    var ini = 0;
    var end = 0;
    for (var i = 0; i < Museos.length; i++) {
       ini = Museos[i][0].indexOf("(");
       end = Museos[i][0].indexOf(")");
       Museos[i][0] = Museos[i][0].slice(ini+1, end);
       Museos[i][0] = Museos[i][0].split(" ");
    }
    console.log(Museos);
    getDataGalery();
  })
}

function getDataGalery(){
  data5 = $.get(Galery,function(){
    for (var i = 0; i < data5.responseJSON.data.length; i++) {
      Galerys.push([data5.responseJSON.data[i][8],data5.responseJSON.data[i][9]])
    }
    var ini = 0;
    var end = 0;
    for (var i = 0; i < Galerys.length; i++) {
       ini = Galerys[i][1].indexOf("(");
       end = Galerys[i][1].indexOf(")");
       Galerys[i][1] = Galerys[i][1].slice(ini+1, end);
       Galerys[i][1] = Galerys[i][1].split(" ");

    }
    console.log(Galerys);
})
}
//LOCALIDADES GUARDA LOS POLIGONOS
function getDataNeighbor(URL_NAMES){
  data1 = $.get(URL_NAMES, function(){
    var star, end, latlong;
    for (i = 0; i < data1.responseJSON.data.length; i++) {
    tableRows.push([data1.responseJSON.data[i][10], data1.responseJSON.data[i][16], data1.responseJSON.data[i][9], i]);
    star =  tableRows[i][2].indexOf("(");
    end =  tableRows[i][2].indexOf(")");
    tableRows[i][2] = tableRows[i][2].slice(star+1,end);
    tableRows[i][2] = tableRows[i][2].split(" ");
    }
    for ( i = 0; i < tableRows.length; i++) {
      NamesDraw.push(tableRows[i][2][0] , tableRows[i][2][1], tableRows[i][0]);
//namesdraw tiene la informacion para dibijar los marcadores
    }
    Neighbor_for_states();
    //console.log(tableRows);
  })
}
function getdataHousing(URL_HOUSING){
  data3 = $.get(URL_HOUSING, function(){
    for (var i = 0; i < data3.responseJSON.data.length; i++) {
      Housing.push([data3.responseJSON.data[i][31],data3.responseJSON.data[i][23],
        data3.responseJSON.data[i][24],data3.responseJSON.data[i][9],data3.responseJSON.data[i][13],data3.responseJSON.data[i][14],data3.responseJSON.data[i][15], data3.responseJSON.data[i][28],data3.responseJSON.data[i][45]
        ,data3.responseJSON.data[i][46],data3.responseJSON.data[i][19] , data3.responseJSON.data[i][20]]);
    }
    for (var i = 0; i < Housing.length; i++) {
      HousingDraw.push(Housing[i][7],Housing[i][6],Housing[i][8]);
      Housing[i][10] = Housing[i][10].split("-")
      //HousingDraw guarda la informacion para dibijar los marcadores
    }
    var Count1 =0, Count2=0, Count3=0,Count4=0,Count5=0;
    for (var i = 0; i < Housing.length; i++) {
      if (Housing[i][10][0] === "BX") {
        Distric_housing[1][Count1] = Housing[i];
        Count1++;
      }else if (Housing[i][10][0] === "BK") {
        Distric_housing[2][Count2] = Housing[i];
        Count2++;
      }else if (Housing[i][10][0] === "MN") {
        Distric_housing[0][Count3] = Housing[i];
        Count3++;
      }else if (Housing[i][10][0] === "QN") {
        Distric_housing[3][Count4] = Housing[i];
        Count4++;
      }else if (Housing[i][10][0] === "SI") {
        Distric_housing[4][Count5] = Housing[i];
        Count5++;
      }else {
        console.error(error);
      }
    }
    console.log(Distric_housing);
    console.log(data);
  })
}
function getDataCrime() {
  $.ajax({
    url:CRIMENES,
    type:"GET",
    data:{
      cmplnt_to_dt:"2015-12-31T00:00:00.000"
    }
  })
  .done(function (data) {
    for (var i = 0; i < data.length; i++) {
      Crime.push([data[i].ky_cd , data[i].boro_nm , data[i].lat_lon, data[i].ofns_desc, data[i].pd_cd  ]);
    }
    console.log(data);
    Crimen_for_states();
  })

}
//draws and random color -------------------------------------------------------
function drawMarkes(lati , long , title){
  var lat;
  la = parseFloat(lati);
  lon = parseFloat(long);
  lat = {lat:lon,lng:la};
  marker = new google.maps.Marker({
  position: lat,
  map: map,
  title: title
  });
}
function drawMarkes1(lati , long , title, icon){
  var lat;
  la = parseFloat(lati);
  lon = parseFloat(long);
  lat = {lat:lon,lng:la};
  marker = new google.maps.Marker({
  position: lat,
  map: map,
  //icon: icon,
  title: title
  });
}
function drawPolygon(polygon,color){
  var parking = new google.maps.Polygon({
   paths: polygon,
   strokeColor: color,
   strokeOpacity: 0.8,
   strokeWeight: 2,
   fillColor: color,
   fillOpacity: 0.35
 });
 parking.setMap(map);
}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
//------------------------------------------------------------------------------
function Neighbor_for_states(){
  var Count1 =0, Count2=0, Count3=0,Count4=0,Count5=0;
  for (var i = 0; i < tableRows.length; i++) {
    if (tableRows[i][1] === "Bronx") {
      principalDistric[0][Count1] = tableRows[i];
      Count1++;
    }else if (tableRows[i][1] === "Brooklyn") {
      principalDistric[1][Count2] = tableRows[i];
      Count2++;
    }else if (tableRows[i][1] === "Manhattan") {
      principalDistric[2][Count3] = tableRows[i];
      Count3++;
    }else if (tableRows[i][1] === "Queens") {
      principalDistric[3][Count4] = tableRows[i];
      Count4++;
    }else if (tableRows[i][1] === "Staten Island") {
      principalDistric[4][Count5] = tableRows[i];
      Count5++;
    }else {
      console.error(error);
    }
  }
  console.log(principalDistric);
}
function Crimen_for_states(){
  var Count1 =0, Count2=0, Count3=0,Count4=0,Count5=0;
  for (var i = 0; i < Crime.length; i++) {
    if (Crime[i][1] === "BRONX") {
      principalcrimen[0][Count1] = Crime[i];
      Count1++;
    }else if (Crime[i][1] === "BROOKLYN") {
      principalcrimen[1][Count2] = Crime[i];
      Count2++;
    }else if (Crime[i][1] === "MANHATTAN") {
      principalcrimen[2][Count3] = Crime[i];
      Count3++;
    }else if (Crime[i][1] === "QUEENS") {
      principalcrimen[3][Count4] = Crime[i];
      Count4++;
    }else if (Crime[i][1] === "STATEN ISLAND") {
      principalcrimen[4][Count5] = Crime[i];
      Count5++;
    }else {
    }
  }
  console.log(principalcrimen);
}
function Best_Top(){
  for (var i = 0; i < State_Distric.length; i++) {
    for (var j = 0; j < State_Distric[i].length; j++) {
      Best[i][j] = [State_Distric[i][j] , 0] ;
    }
  }
  console.log(Best);
  setTimeout(function(){
  for (var i = 0; i < Distric_housing.length; i++) {
    for (var j = 0; j < Distric_housing[i].length; j++) {
      if (parseInt(parseInt(Distric_housing[i][j][10][1])) < Best[i].length){
        Best[i][parseInt(Distric_housing[i][j][10][1])][1] = parseInt(Distric_housing[i][j][0]) + parseInt(Best[i][parseInt(Distric_housing[i][j][10][1])][1]);
        Best[i][parseInt(Distric_housing[i][j][10][1])].push(Distric_housing[i][j]);
      }else {
        console.log("error");
      }
    }
  }
  },1500);
}
function Best_top_low(){
  for (var i = 0; i < Best.length; i++) {
    for (var j = 0; j < Best[i].length;j++) {
      if (Best[i][j][0] === undefined){
      }else {
        Best_low.push(Best[i][j]);
      }
    }
  }
  Best_low.sort(function(a, b){
        var x = b[1];
        var y = a[1];
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });
  for (var i = 0; i < 10; i++) {
    drawPolygon(Best_low[i][0][0], getRandomColor());
  }
  var tableReference = $("#tBody")[0];
  for (var i = 0; i < 10; i++) {
    newRow = tableReference.insertRow(tableReference.rows.length);
    Num_borough = newRow.insertCell();
    Name_state = newRow.insertCell();
    Num_Low = newRow.insertCell();
    Num_borough.innerHTML = parseInt(Best_low[i][0][1][1]);
    if (parseInt(Best_low[i][0][1][0]) == 1){
      Name_state.innerHTML = States[0];
    }else if (parseInt(Best_low[i][0][1][0]) == 2) {
      Name_state.innerHTML = States[1];
    }else if (parseInt(Best_low[i][0][1][0]) == 3) {
      Name_state.innerHTML = States[2];
    }else if (parseInt(Best_low[i][0][1][0]) == 4) {
      Name_state.innerHTML = States[3];
    }else if (parseInt(Best_low[i][0][1][0]) == 5) {
      Name_state.innerHTML = States[4];
    }
    Num_Low.innerHTML = parseInt(Best_low[i][1]);
    for (var j = 2; j < Best_low[i].length; j++) {
      drawMarkes(Best_low[i][j][2],Best_low[i][j][1], Best_low[i][j][3])
    }
 }
  console.log(Best_low);
}
function Best_Top_Dis(){

}

function downloadT(){
  $("table").tableToCSV();
}

function DrawsMuseums() {
  for (var i = 0; i <Museos.length; i++) {
    drawMarkes1(Museos[i][0][0],Museos[i][0][1],Museos[i][1],"descarga.png");
  }
  for (var i = 0; i < Galerys.length; i++) {
     drawMarkes1(Galerys[i][1][0],Galerys[i][1][1],Galerys[i][0],"descarga_art.png");
  }
}

//function of the BOTONS--------------------------------------------------------
function myFunction() {
  checkBox = document.getElementById("micheckbox");
  if (checkBox.checked == true){
    updateDataNames();
  }
}
function myFunction1() {
  checkBox = document.getElementById("micheckbox2");
  if (checkBox.checked == true){
    updateDataDistricts();
  }
}
function myFunction2() {
  checkBox = document.getElementById("micheckbox3");
  if (checkBox.checked == true){
    Best_top_low();
  }
}
function myFunction3() {
  checkBox = document.getElementById("micheckbox4");
  if (checkBox.checked == true){
     DrawsMuseums();
  }
}
function myFunction4() {
  checkBox = document.getElementById("micheckbox5");
  if (checkBox.checked == true){
    downloadT();
  }
}
function myFunction5() {
  checkBox = document.getElementById("micheckbox6");
  if (checkBox.checked == true){
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: nyu
    });
    var marker = new google.maps.Marker({
    position: nyu,
    map: map,
    title: 'NYU'
    });
    if (Best_low.length > 2) {
      for (var i = 2; i < 12; i++) {
      document.getElementById("Mytable").deleteRow(2);
      }
    }

  }
}
