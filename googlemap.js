// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

var map, heatmap;
var markers = [];

var data;
processData([
  {
    id: '1',
    brin: '676576',
    bevoegdGezag: 0,
    name: 'Mooie school',
    address: {
      zipcode: '1065 CH'
    },
    geo: {
      latitude: 52.3589661,
      longitude: 4.823281,
    },
    totaalAantalLeerlingen: 1,
    fteDirectie: 1.533,
    fteLeerkrachten: 1.533,
    fteInOpleiding: 1.533,
    fteOndersteunend: 1.533,
    fteOnbekend: 1.533,
    bekostigingPersoneel: 1.533,
    bekostigingDirectie: 1.533,
    bekostigingOverig: 1.533,
  },
  {
    address: '2511 CL',
    geo: {
      latitude: 52.0786467,
      longitude: 4.3144497
    }
  }
  ,
  {
    address: '3824 DK',
    geo: {
      latitude: 52.1947546,
      longitude: 5.3777556
    }
  }
  ,
  {
    address: '1223 GK',
    geo: {
      latitude: 52.2308983,
      longitude: 5.1991128
    }
  }
  ,
  {
    address: '1316 LG',
    geo: {
      latitude: 52.3850857,
      longitude: 5.2258091
    }
  }
  ,
  {
    address: '1087 MN',
    geo: {
      latitude: 52.347334,
      longitude: 5.0077305
    }
  }
]);

function processData(rawData, callback) {
  var newData = rawData.filter(item => {
    return item.geo && item.geo != null
  });
  console.log(newData);
  data = newData;
  if (callback) {
    callback();
  }
}


var url = 'http://818e3c4a.ngrok.io';
var schoolResource = url + '/schools?start=0&size=10';

function fetchSchools() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', schoolResource);
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      processData(JSON.parse(xhr.responseText), initMap);
    } else {
      console.error('Request error', xhr.status);
    }
  };
}
//fetchSchools();

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 52.2, lng: 5.5},
    mapTypeId: 'terrain'
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(data),
    map: map
  });

  addMarkers(data);
}

function addMarkers(markerData) {
  markerData.map(item => addMarker(item));
}

function isInfoWindowOpen(infoWindow) {
  var map = infoWindow.getMap();
  return (map !== null && typeof map !== "undefined");
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function toggleMarkers(e) {
  if (e.checked) {
    showMarkers();
  } else {
    clearMarkers();
  }
  //heatmap.setMap(heatmap.getMap() ? null : map);
}

// Adds a marker to the map and push to the array.
function addMarker(item) {

  var infoContent = '';

  if (item.address) {
    infoContent += '<h1>' + item.address + '</h1>';
  }
  if (item.name) {
    infoContent += '<p>' + item.name + '</p>';
  }
  if (item.website) {
    infoContent += '<a href="' + item.website + '">' + item.website + '</a>';
  }

  var infowindow = new google.maps.InfoWindow({
    content: infoContent
  });

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(item.geo.latitude, item.geo.longitude),
    map: map,
    title: item.address
  });

  marker.addListener('click', function () {
    if (isInfoWindowOpen(infowindow)) {
      infowindow.close();
    } else {
      infowindow.open(map, marker);
    }
  });

  markers.push(marker);


//    var marker = new google.maps.Marker({
//      position: location,
//      map: map
//    });
//    markers.push(marker);
}


// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ];
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

// Heatmap data: 500 Points
function getPoints(pointData) {
  return pointData.map(item => new google.maps.LatLng(item.geo.latitude, item.geo.longitude));
}