var map;
var markers = [];
var cnt = {lat: 40.7291, lng: -73.9965};
var paths = [];
var flag = false;

function getDataMap(){
    
    console.log(crimes);
    
    map.data.forEach(function(bound){
        
        
        crimes.forEach(function(crime){
            
            var curPosition = new google.maps.LatLng(crime[2].coordinates[1],crime[2].coordinates[0]);

            
            if(bound.getProperty('Bounds').contains(curPosition)){
                crimesPerDistricts.forEach(function(element){
                    if(element[0] == bound.getProperty('BoroCD')){
                        element[1]++;
                        return;
                    }
                });
            }
        });
        
        galleries.forEach(function(crime){
            var curPosition = new google.maps.LatLng(parseFloat(crime[1].substr(26,18)),parseFloat(crime[1].substr(7,18)));

            
            if(bound.getProperty('Bounds').contains(curPosition)){
                galleriesPerDistricts.forEach(function(element){
                    if(element[0] == bound.getProperty('BoroCD')){
                        element[1]++;
                        return;
                    }
                });
            }
        });
        
        museums.forEach(function(crime){
            
          var curPosition = new google.maps.LatLng(parseFloat(crime[1].substr(26,18)),parseFloat(crime[1].substr(7,18)));

            
            if(bound.getProperty('Bounds').contains(curPosition)){
                musPerDistricts.forEach(function(element){
                    if(element[0] == bound.getProperty('BoroCD')){
                        element[1]++;
                        return;
                    }
                });
            }
        });
        
        
        housing.forEach(function(house){
            
            var curPosition = new google.maps.LatLng(parseFloat(house[1]) ,parseFloat(house[2]));
            if(bound.getProperty('Bounds').contains(curPosition)){
                affPerDistricts.forEach(function(element){
                    if(element[0] == bound.getProperty('BoroCD')){
                        element[1] = Math.max(element[1], parseInt(house[3]));
                        return;
                    }
                });
            }
        });
        
        
        flag = true;
    });
    
    
    
    
    musPerDistricts = musPerDistricts.sort(function(a, b) {
        return b[1]-a[1];
    });

    
    galleriesPerDistricts = galleriesPerDistricts.sort(function(a, b) {
        return b[1]-a[1];
    });
    
    crimesPerDistricts = crimesPerDistricts.sort(function(a, b) {
        return a[1]-b[1];
    });
    
    
    affPerDistricts = affPerDistricts.sort(function(a, b) {
        return b[1]-a[1];
    });
    
    
    var cnt = 0;
    crimesPerDistricts.forEach(function(district){
         pond.forEach(function(element){
             if(element[0] == district[0]){
                 element[1] = 71-cnt;
             }
         });
         cnt++;
    });
    cnt = 0;
    affPerDistricts.forEach(function(district){
         pond.forEach(function(element){
             if(element[0] == district[0]){
                 element[1] = 71-cnt;
             }
         });
         cnt++;
    });
    cnt = 0;
    nDistricts.forEach(function(district){
         pond.forEach(function(element){
             if(element[0] == district[0]){
                 element[1] = 71-cnt;
             }
         });
         cnt++;
    });
    pond = pond.sort(function(a,b){
        return b[1]-a[1];
    });
    
}


function initMap() {
    map = new google.maps.Map(document.getElementById('mapa'), {
        center: cnt,
        zoom: 10
    });


     
    google.maps.event.addListener(map.data,'addfeature',function(e){
        
        if(nDistricts.size != 71){
            var bounds=new google.maps.LatLngBounds();
    
            e.feature.getGeometry().forEachLatLng(function(path) { bounds.extend(path); } );
    
            e.feature.setProperty('Bounds', bounds);
            nDistricts.push([e.feature.getProperty('BoroCD'), calcDistance2(bounds.getCenter())]);
            crimesPerDistricts.push([e.feature.getProperty('BoroCD'), 0]);
            galleriesPerDistricts.push([e.feature.getProperty('BoroCD'),0]);
            musPerDistricts.push([e.feature.getProperty('BoroCD'),0]);
            affPerDistricts.push([e.feature.getProperty('BoroCD'), 0]);
            pond.push([e.feature.getProperty('BoroCD'), 0]);
        }else if(!flag){
            getDataMap();
        }
    });



    map.data.loadGeoJson('https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');
   
    
    var marker = new google.maps.Marker({
        position: cnt,
        map: map,
        title: 'NYU Stern School of Business'
    });
    
    initStyle();
}


function initStyle(){
    map.data.revertStyle();
    map.data.setStyle(function(feature) {
                var boroCD = feature.getProperty('BoroCD');
                if(boroCD%100 > 18){
                    return ({
                        visible: false
                        
                    });
                }
            });
}

function resetMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}


function drawDistr() {
    map.setZoom(10);
    map.setCenter(cnt);
    map.data.loadGeoJson('https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');
    map.data.setStyle(function(feature) {
        var boroCD = feature.getProperty('BoroCD');

        if((boroCD > 218 && boroCD[0] == 2) || (boroCD > 112 && boroCD[0] == 1) || (boroCD > 314 && boroCD[0] == 3) || (boroCD > 412 || boroCD[0] == 4)
        || (boroCD > 53 && boroCD[0] == 5)){
            return ({
                visible: false
            });

        }
    });
}


function drawHousing(distr){
    resetMarkers();
    housing.forEach(function(val) {
        if(val[0] !== null && parseInt(val[0][0]) == distr){
            var marker = new google.maps.Marker({
            position: {lat: parseFloat(val[1]),lng: parseFloat(val[2])},
            map: map,
            title: val[4]
        });
        markers.push(marker);

        }
    });
}

function calcDistance(pnt){
    var lat1 = pnt.lat;
    var lat2 = cnt.lat;
    var lon1 = pnt.lng;
    var lon2 = cnt.lng;
    
    var R = 6371;
    var dLat = (lat2-lat1) * (Math.PI/180);
    var dLon = (lon2-lon1) * (Math.PI/180);
    var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;

}

function calcDistance2(pnt){
    var lat1 = pnt.lat();
    var lat2 = cnt.lat;
    var lon1 = pnt.lng();
    var lon2 = cnt.lng;
    
    var R = 6371;
    var dLat = (lat2-lat1) * (Math.PI/180);
    var dLon = (lon2-lon1) * (Math.PI/180);
    var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;

}

function drawHousingDist(dist){
    resetMarkers();
    housing.forEach(function(val) {
        if(calcDistance({lat: parseFloat(val[1]), lng: parseFloat(val[2])}) <= dist){
            var marker = new google.maps.Marker({
            position: {lat: parseFloat(val[1]),lng: parseFloat(val[2])},
            map: map,
            title: val[4]
        });
        markers.push(marker);
            
        }
    });
    
}


function drawTopTen(array){
    map.data.forEach(function(ft){
        var boroCD = ft.getProperty('BoroCD');
        if(array.includes(boroCD)){
            map.data.overrideStyle(ft, {fillColor: 'green'});
        }
    });
}


function drawDistrDist(){
    initStyle();
    nDistricts = nDistricts.sort(function(a, b) {
                return a[1]-b[1];
        });
    var arrayAux = [];
    var cont = 0;
    for(var i = 0; i < nDistricts.length && cont < 10; i++){
        var boroCD = nDistricts[i][0];
        if(boroCD%100 <= 18){
            arrayAux[cont] = boroCD;
            cont++;
        }
    }
    drawTopTen(arrayAux);
    
    drawTableDis();
}


function drawDistrSafe(){

    initStyle();
    
    var arrayAux = [];
    var cont = 0;
    for(var i = 0; i < crimesPerDistricts.length && cont < 10; i++){
        var boroCD = crimesPerDistricts[i][0];
        if(boroCD%100 <= 18){
            arrayAux[cont] = boroCD;
            cont++;
        }
    }
    
    drawTopTen(arrayAux);

    drawTableSafe();

}


function drawDistrAff(){
    initStyle();

    var arrayAux = [];
    var cont = 0;
    for(var i = 0; i < affPerDistricts.length && cont < 10; i++){
        var boroCD = affPerDistricts[i][0];
        if(boroCD%100 <= 18){
            arrayAux[cont] = boroCD;
            cont++;
        }
    }
    
    drawTopTen(arrayAux);
    drawTableAff();


}

