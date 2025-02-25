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
        console.log(data);
        chartCourses(data);
        chartPrograms(data);

    } catch(error) {
        console.error(error);
    }
}

/**
 * Skapar stapeldiagram med de 6 mest sökta programmen
 * @function
 */
function chartCourses(data) {
    const popularCourses = data 
    .filter(item => item.type === "Kurs")
    .sort((a, b) => parseInt(b.applicantsTotal) - parseInt(a.applicantsTotal))
    .slice(0, 6);

    const courseName = popularCourses.map(course => course.name);
    const numberOfApplicants = popularCourses.map(course => parseInt(course.applicantsTotal));
   
    const chartsBar = document.getElementById('bar-chart');

    new Chart(chartsBar, {
        type: 'bar',
        data: {
            labels: courseName,
            datasets: [{
                label: 'Antal sökande',
                data: numberOfApplicants,
                borderWidth: 1,
                backgroundColor: ['Red','Blue','Yellow','Green','Orange','Purple']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}