"use strict";

//element till navigeringsmenyn i mobilläge
let openButton = document.getElementById("open-menu");
let closeButton = document.getElementById("close-menu");

//skapar två eventlyssnare för öppna och stänga knappen i hambugermenyn
openButton.addEventListener('click', toggleMenu);
closeButton.addEventListener('click', toggleMenu);

//skapar en funktion för att sedan toggla mellan öppna och stänga i hamburger menyn
function toggleMenu() {
    let navEl = document.getElementById("nav-menu");

    //hämtar styling
    let style = window.getComputedStyle(navEl);

    if(style.display === "none") {
        navEl.style.display = "block";
    } else {
        navEl.style.display = "none"
    }
}

/**
 * Hämta statistik på antagning från JSON-filen och konverterar den
 * @async
 * @function getCourses hämtar data från API
 * @throws {Error} Om det är problem med nätverksanslutning
 */

window.onload = () => {
    getCourses();
}

async function getCourses() {
    try {
        const response = await fetch("https://studenter.miun.se/~mallar/dt211g/");
        if(!response.ok) {
            throw new Error('Problem med nätverksanslutning')
        }
        const data = await response.json();
        chartCourses(data);
        chartPrograms(data);

    } catch(error) {
        console.error(error);
    }
}

/**
 * Skapar stapeldiagram med de 6 mest sökta kurserna
 * @function - hämtar datan och filtrerar, sorterar och med slice tar ut topp 6 kurserna
 * @param {Object} data - data, tar ut array av kurserna, filtrerar ut endast kurserna, sorterar upp efter antal sökande och tar ut topp 6 mest sökta kurserna
 * @param {string} - name, tar ut namnet på kursen
 * @param {string} - applicantstotal tar ut totalt sökande, summerar till heltal
 * @return - kontrollerar att elementet, om inte slutar funktionen
 */
function chartCourses(data) {
    const chartsBar = document.getElementById('bar-chart');
    if(!chartsBar) return;

    const popularCourses = data 
    .filter(item => item.type === "Kurs")
    .sort((a, b) => parseInt(b.applicantsTotal) - parseInt(a.applicantsTotal))
    .slice(0, 6);

    const courseName = popularCourses.map(course => course.name);
    const numberOfApplicants = popularCourses.map(course => parseInt(course.applicantsTotal));

    new Chart(chartsBar, {
        type: 'bar',
        data: {
            labels: courseName,
            datasets: [{
                label: 'Antal sökande',
                data: numberOfApplicants,
                borderWidth: 1,
                backgroundColor: ['#BB8FCE','#F1948A','#85C1E9','#82E0AA','#F4D03F', '#F5B041'],
                borderColor: 'Black'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            layout: {
                padding: 20
            }
        }
    });
}

/**
 * Skapar stapeldiagram med de 5 mest sökta programmen
 * @function - hämtar datan och filtrerar, sorterar och med slice tar ut topp 5 programmen
 * @param {Object} data - data, tar ut array av programmen, filtrerar ut endast programmen, sorterar upp efter antal sökande och tar ut topp 5 mest sökta programmen
 * @param {string} - name, tar ut namnet på programmen
 * @param {string} - applicantstotal tar ut totalt sökande, summerar till heltal
 * @return - kontrollerar att elementet, om inte slutar funktionen
 */
function chartPrograms(data) {
    const pieBar = document.getElementById('pie-chart');
    if (!pieBar) return;

    const popularPrograms = data 
    .filter(item => item.type === "Program")
    .sort((a, b) => parseInt(b.applicantsTotal) - parseInt(a.applicantsTotal))
    .slice(0, 5);

    const programName = popularPrograms.map(program => program.name);
    const numberOfApplicant = popularPrograms.map(program => parseInt(program.applicantsTotal));

    new Chart(pieBar, {
        type: 'pie',
        data: {
            labels: programName,
            datasets: [{
                label: 'Antal sökande',
                data: numberOfApplicant,
                borderWidth: 1,
                backgroundColor: ['#BB8FCE','#F1948A','#85C1E9','#82E0AA','#F4D03F'],
                borderColor: 'Black'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            layout: {
                padding: 20
            }
        }
    });
}

/**
 * Hämtar in data från Leafletjs API och lägger in karta
 * @param {map} - lagt till Kalix koordinater där start markeringen på kartan är
 * @param {L} - använt Leafletjs guide för att hämta in karta till min sida
 * @param {marker} - lagt till markering för Kalix och adderar till kartan
 */
const map = L.map('map').setView([66.0, 23.0], 14);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const marker = L.marker([66.0, 23.0]).addTo(map);

/**
 * Gör funktion för att kunna söka efter plats och uppdatera kartan
 * @function - hämtar först in value från mitt input fält där man söker efter stad, sedan hämtar jag från nominatim API, konverterar til json, där jag lägger in Searchresults för att få in den sökta platsen
 * @fetch - för att hämta in data från json filen, och tar ut lattitud och longitud, använder setView och L.marker för att uppdatera plats
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
                L.marker([lat, lon]).addTo(map);;
            }
        })
        .catch(error => console.error("Nätverksfel, kunde inte hämta plats", error));
}

/**
 * Eventlyssnare för att kunna använda sökknappen och få den nya platsen man sökt på
 */
const searchButton = document.getElementById('search-btn')
    if(searchButton) {
        searchButton.addEventListener("click", getCoordinates);
    }

