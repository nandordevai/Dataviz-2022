const margin = 50;
let _planets;
let planets;

function preload() {
    _planets = loadJSON('planets.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    const diameters = Object.values(_planets).map(_ => _.diameter);
    const numPlanets = diameters.length;
    const rMin = min(diameters);
    const rMax = max(diameters);
    planets = Object.values(_planets).map((planet, i) => ({
        name: planet.name,
        r: round(map(planet.diameter, rMin, rMax, 5, 60)),
        x: map(i, 0, numPlanets, margin, width),
        active: false,
        moons: planet.moons.map((_) => ({
            dR: random(-6, 6),
            omega: random(.002, .006),
        })),
    }));
    colorMode(HSL);
}

function draw() {
    background(0, 0, 0, 1);
    noStroke();
    planets.forEach((planet, i) => {
        push();
        translate(planet.x, windowHeight / 2);
        circle(0, 0, planet.r);
        textAlign(CENTER);
        fill(0, 0, 100);
        text(planet.name, 0, 100);
        pop();
        drawMoons(planet);
    });
}

function drawMoons(planet) {
    planet.moons.forEach((moon, i) => {
        push();
        translate(planet.x, windowHeight / 2);
        let r = 2;
        if (!planet.active) {
            const rotation = moon.omega * millis() / 10;
            const phi = p5.Vector.fromAngle(
                map(i, 0, planet.moons.length, 0, 2 * PI) + rotation,
                50 + moon.dR
            );
            translate(phi);
        } else {
            translate(0, -40 - (i * 5));
            r = ((i + 1) % 10) ? 2 : 4;
            if (!((i + 1) % 50)) {
                fill(0, 0, 0);
                stroke(0, 0, 100);
                strokeWeight(2);
            }
        }
        circle(0, 0, r);
        pop();
    });
}

function mouseMoved() {
    planets.forEach((planet) => {
        planet.active = abs(planet.x - mouseX) < 50 ? true : false;
    });
}
