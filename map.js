const lati = document.getElementById('lati')
const long = document.getElementById('long')

lati.innerText = 29.91807;
long.innerText = 78.11797;

let map = L.map('map').setView([29.91807, 78.11797], 18);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let marker = L.marker([29.91807, 78.11797], { draggable: true }).addTo(map);

marker.on('dragend', function(e) {
    var coords = e.target.getLatLng();
    lati.innerText = coords.lat.toFixed(5);
    long.innerText = coords.lng.toFixed(5);
});