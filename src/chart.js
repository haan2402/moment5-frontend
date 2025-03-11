/**
 * Hämtar in data från Leafletjs API och lägger in karta
 * @constant {Object} map - lagt till Kalix koordinater där start markeringen på kartan är
 */
const map = L.map('map').setView([66.0, 23.0], 14);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const marker = L.marker([66.0, 23.0]).addTo(map);

/**
 * Gör funktion för att kunna söka efter plats och uppdatera kartan
 * 
 * @param {string} searchResult den plats som man söker
 * @returns {void} 
 */
function getCoordinates() {
    const searchResult = document.getElementById('search').value;
    if (!searchResult) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${(searchResult)}`;

    fetch(url) 
        .then(response => response.json())
        .then(data => {
            if(data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;

                map.setView([lat, lon], 14);
                L.marker([lat, lon]).addTo(map);
            }
        })
        .catch(error => console.error("Nätverksfel, kunde inte hämta plats", error));
}

/**
 * Eventlyssnare för att kunna använda sökknappen och få den nya platsen man sökt på
 * @function searchButton
 */
const searchButton = document.getElementById('search-btn')
    if(searchButton) {
        searchButton.addEventListener("click", getCoordinates);
    }
