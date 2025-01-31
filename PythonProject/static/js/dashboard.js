document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    const map = L.map('map').setView([20.5937, 78.9629], 5);

    // Add tile layer with custom style (white land, blue water)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '',
        maxZoom: 19,
        className: 'custom-tiles'
    }).addTo(map);

    // Feature group for drawn items
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Draw Control Setup
    const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
        draw: {
            polygon: {
                shapeOptions: { color: '#2ecc71' }
            },
            rectangle: {
                shapeOptions: { color: '#2ecc71' }
            },
            circle: {
                shapeOptions: { color: '#2ecc71' }
            },
            polyline: false,
            circlemarker: false,
            marker: true
        }
    });
    map.addControl(drawControl);

    // Handle drawing events
    map.on('draw:created', function(e) {
        const layer = e.layer;
        const shapeType = e.layerType;

        // Prompt user for zone details
        const zoneName = prompt("Mark the Area:");
        const zoneType = prompt("Determine the Zone (safe/danger):").toLowerCase();

        if (zoneName && zoneType) {
            // Set color based on zone type
            const color = zoneType === 'safe' ? '#2ecc71' : '#e74c3c';

            // Apply color if shape supports it
            if (['polygon', 'rectangle', 'circle'].includes(shapeType)) {
                layer.setStyle({
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.3
                });
            }

            // Add popup
            layer.bindPopup(`
                <b>${zoneName}</b><br>
                Type: ${zoneType.toUpperCase()}
            `).openPopup();

            // Save zone properties
            layer.properties = {
                name: zoneName,
                type: zoneType,
                created: new Date().toISOString()
            };

            drawnItems.addLayer(layer);
            saveZones();
        }
    });

    // Save and load zones
    function saveZones() {
        const zones = [];
        drawnItems.eachLayer(layer => {
            zones.push({
                name: layer.properties.name,
                type: layer.properties.type,
                created: layer.properties.created,
                geoJSON: layer.toGeoJSON()
            });
        });
        localStorage.setItem('savedZones', JSON.stringify(zones));
    }

    function loadSavedZones() {
        const savedZones = localStorage.getItem('savedZones');
        if (savedZones) {
            JSON.parse(savedZones).forEach(zone => {
                const layer = L.geoJSON(zone.geoJSON).getLayers()[0];
                const color = zone.type === 'safe' ? '#2ecc71' : '#e74c3c';

                if (!(layer instanceof L.Marker)) {
                    layer.setStyle({
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.3
                    });
                }

                layer.properties = {
                    name: zone.name,
                    type: zone.type,
                    created: zone.created
                };

                layer.bindPopup(`
                    <b>${zone.name}</b><br>
                    Type: ${zone.type.toUpperCase()}
                `);

                drawnItems.addLayer(layer);
            });
        }
    }

    // Button handlers
    document.getElementById('clearZonesBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all zones?')) {
            drawnItems.clearLayers();
            localStorage.removeItem('savedZones');
        }
    });

    document.getElementById('saveZonesBtn').addEventListener('click', function() {
        saveZones();
        alert('Zones saved successfully!');
    });

    // Update datetime
    function updateDateTime() {
        fetch('/get_time')
            .then(response => response.json())
            .then(data => {
                document.getElementById('currentDateTime').textContent = data.datetime;
            })
            .catch(error => console.error('Error fetching time:', error));
    }

    // Modal handlers
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.getElementById('loginBtn');
    const showRegisterLink = document.getElementById('showRegister');
    const cancelBtns = document.querySelectorAll('.cancel-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
    }

    cancelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    // Initialize
    loadSavedZones();
    setInterval(updateDateTime, 1000);
    updateDateTime();
});