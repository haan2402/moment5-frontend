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
 * 
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
 * 
 * @param {Object[]} data data, tar ut array av kurserna, filtrerar ut endast kurserna, sorterar upp efter antal sökande och tar ut topp 6 mest sökta kurserna
 * @param {string} data[].name
 * @param {string} data[].applicantsTotal
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
 * 
 * @param {Object[]} data data, tar ut array av programmen, filtrerar ut endast programmen, sorterar upp efter antal sökande och tar ut topp 5 mest sökta programmen
 * @param {string} data[].name
 * @param {string} data[].applicantsTotal
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


