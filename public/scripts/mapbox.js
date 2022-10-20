mapboxgl.accessToken =
  "pk.eyJ1IjoibW9hdGhlbG1hcm1vcmkiLCJhIjoiY2wzMDA1cWJyMDhnODNkcHNvdDViM2Q3cyJ9._K-EYN_vO_TaDPiepCFxyA";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: theCampground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// create the popup of the marker
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
`
    <h3>${theCampground.title}</h3>
    <p>${theCampground.location}</P>
`
);

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker().setLngLat(theCampground.geometry.coordinates).setPopup(popup).addTo(map);

