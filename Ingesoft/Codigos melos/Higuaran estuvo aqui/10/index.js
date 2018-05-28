var URLs = ["https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD",
    "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson",
    "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD", "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD", "https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD"];

var borough = {
    1: "Manhattan",
    2: "Brooklyn",
    3: "Queens",
    4: "The Bronx",
    5: "Staten Island"
};
var neighborhood = new Map();
var districts = new Map();
var crimes = new Map();
var housing = new Map();
var museums = [];
var galleries = [];
var nDistricts = [];
var galleriesPerDistricts = [];
var musPerDistricts = [];
var crimesPerDistricts = [];
var affPerDistricts = [];
var pond = [];



var filledSaf = false;
var filledDis = false;
var filledAff = false;
$.when(getData().then(initMap()));



(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 48)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
 /**   $('body').scrollspy({
    target: '#mainNav',
    offset: 54
  });**/

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);


})(jQuery);







window.onload=getData;

function getDataFromURL(urlKey){
	
	
	if(urlKey == URLs.length){
	    $.ajax({
                    url: "https://data.cityofnewyork.us/resource/9s4h-37hy.json?$where=latitude > 0 AND cmplnt_fr_dt between '2015-12-31T00:00:00' AND '2016-01-01T00:00:00'",
                    type: "GET",
                    data: {
                        "$limit" : 1000,
                        "$$app_token" : "Vg0cQjNWhod6SuG8NbjRHr6DO"
                    }
                }).done(function(data) {
                    $.each( data, function( key, val) {
                        if(val.lat_lon !== null)
                            crimes.set(val.cmplnt_num, [val.boro_nm, val.ofns_desc, val.lat_lon, val.cmplnt_fr_dt]);    
                    
                    });
                }).fail(function(error){
                    console.log(error);
                });
	}else{
	    $.getJSON(URLs[urlKey], function(data){
	    switch(urlKey){
	        case 0:
	            $.each( data.data, function( key, val) {
                    neighborhood.set(key, [val[11], val[12], val[9]]); 
                });

                break;
            case 1:
                $.each( data.features, function( key, val) {
                    districts.set(val.properties.BoroCD,val.geometry); 
                });
	            break;
            case 2:
                $.each( data.data, function( key, val) {
                    if(val[16] !== null && val[0] !== null)
                        housing.set(val[8], [val[17], val[23], val[24], val[31], val[9]]); 
                });
                break;
            case 3:
                $.each(data.data, function(key, val){
                    museums.push([val[9], val[8]]);
                });
                break;
            case 4:
                $.each(data.data, function(key, val){
                    galleries.push([val[8], val[9]]);
                });
	    }
            
	})
	.done( function(){
	})
	.fail( function(error){
		console.error(error);
	});
	}
	
	
}

function getData(){
    for(var i = 0; i <= URLs.length; i++){
        getDataFromURL(i);
    }
}

function drawTableDis() {
    
    if(!filledDis){
        var tbl = document.getElementById("tableDis");
     
            for (var r = 0; r < 10; r++) {
                var row = document.createElement("tr");
    	     
                    var cell = document.createElement("td");
                    var cellText = document.createTextNode(r+1);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    cellText = document.createTextNode(borough[Math.floor(nDistricts[r][0]/100)] + " CB " + nDistricts[r][0]%100);
                    var cell2 = document.createElement("td");
                    cell2.appendChild(cellText);
                    row.appendChild(cell2);
    	            tbl.appendChild(row);
            }
        filledDis = true;
    }
            

       
}

function drawTableSafe() {
    
    if(!filledSaf){
            var tbl = document.getElementById("tableSaf");
     
            for (var r = 0; r < 10; r++) {
                var row = document.createElement("tr");
    	     
                    var cell = document.createElement("td");
                    var cellText = document.createTextNode(r+1);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    cellText = document.createTextNode(borough[Math.floor(crimesPerDistricts[r][0]/100)] + " CB " + crimesPerDistricts[r][0]%100);
                    var cell2 = document.createElement("td");
                    cell2.appendChild(cellText);
                    row.appendChild(cell2);
    	            tbl.appendChild(row);
            }
        filledSaf = true;
    }
    
       
}


function drawTableAff() {
    
    if(!filledAff){
            var tbl = document.getElementById("tableAff");
     
            for (var r = 0; r < 10; r++) {
                var row = document.createElement("tr");
    	     
                    var cell = document.createElement("td");
                    var cellText = document.createTextNode(r+1);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    cellText = document.createTextNode(borough[Math.floor(affPerDistricts[r][0]/100)] + " CB " + affPerDistricts[r][0]%100);
                    var cell2 = document.createElement("td");
                    cell2.appendChild(cellText);
                    row.appendChild(cell2);
    	            tbl.appendChild(row);
            }
        filledAff = true;
    }
    
       
}