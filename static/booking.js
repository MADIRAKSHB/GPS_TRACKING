let map;
let marker;
let polyline;
let path = [];
let firstLoad = true;

// Custom vehicle icon
const vehicleIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

function initMap() {
    map = L.map('map').setView([11.0, 77.0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    marker = L.marker([11.0, 77.0], { icon: vehicleIcon })
        .addTo(map)
        .bindPopup("🚗 Vehicle Location");

    polyline = L.polyline(path, { color: 'lime', weight: 4 }).addTo(map);
}

async function fetchGPS() {
    try {
        const response = await fetch('/api/gps');
        const data = await response.json();

        const lat = parseFloat(data.lat);
        const lon = parseFloat(data.lon);

        if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {

            // Update sidebar UI
            document.getElementById("lat").innerText = lat.toFixed(6);
            document.getElementById("lon").innerText = lon.toFixed(6);
            document.getElementById("status").innerText = "🟢 LIVE - Vehicle Moving";
            document.getElementById("status").className = "status online";

            const newLatLng = [lat, lon];

            // Add path trail (movement history)
            path.push(newLatLng);
            polyline.setLatLngs(path);

            // Smooth movement animation
            marker.setLatLng(newLatLng);

            // Auto follow vehicle
            if (firstLoad) {
                map.setView(newLatLng, 17);
                firstLoad = false;
            } else {
                map.panTo(newLatLng, { animate: true, duration: 1 });
            }
        } else {
            document.getElementById("status").innerText = "🔴 No GPS Signal";
            document.getElementById("status").className = "status offline";
        }

    } catch (error) {
        console.error("Error fetching GPS:", error);
        document.getElementById("status").innerText = "⚠️ Server Disconnected";
        document.getElementById("status").className = "status offline";
    }
}

// Initialize
window.onload = function () {
    initMap();
    fetchGPS();
    setInterval(fetchGPS, 3000); // every 3 sec live tracking
};