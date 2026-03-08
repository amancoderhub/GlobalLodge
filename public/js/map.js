if (listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2) {
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        center: listing.geometry.coordinates,
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 9
    });

    const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking</p>`)
        )
        .addTo(map);
} else {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.style.display = 'none';
    }
}
