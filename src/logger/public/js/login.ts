/* eslint-disable no-console */
const logos = [...document.getElementsByClassName('discordLogo')];

// Elmentünk kezdőpozíciókat minden képhez egy új tömbbe
const positions = logos.map((logo) => ({
    posX: Math.random() * (window.innerWidth - (logo as HTMLImageElement).width),
    posY: Math.random() * (window.innerHeight - (logo as HTMLImageElement).height),
    // Két random szám, amit a pozíciókhoz fogunk hozzáadni folyamatosan, így fog változni a pozíció
    dirX: (Math.random() - 0.5) * 6, // sebesség x irányban
    dirY: (Math.random() - 0.5) * 6, // sebesség y irányban
    angle: 0
}));

function updatePosition() {
    logos.forEach((logo, index) => {
        const position = positions[index];
        position.posX += position.dirX;
        position.posY += position.dirY;
        // Folyamatosan növeljük az értéket, emiatt fog forogni
        position.angle += 2;

        // Ablak szélén pattanj vissza - ha a pozíció értéke túllógna a kijelző szélességén, megszorozzuk -1-el a dir értéket,
        // így a a pozíció értékünk elkezd csökkenni, hiszen egy negatív számot fogunk folyamatosan hozzáadni. +/- pedig ugyebár - 
        if (position.posX <= 0 || position.posX >= window.innerWidth - (logo as HTMLImageElement).width) position.dirX *= -1;
        if (position.posY <= 0 || position.posY >= window.innerHeight - (logo as HTMLImageElement).height) position.dirY *= -1;

        // transform értékeit módosítjuk
        // eslint-disable-next-line no-param-reassign
        (logo as HTMLImageElement).style.transform = `translate(${position.posX}px, ${position.posY}px) rotate(${position.angle}deg)`;
    });
    // A requestAnimationFrame() egy JavaScript alapú animációs ciklus, ami másodpercenként kb. 60-szor fut,
    // és minden egyes híváskor közvetlenül frissítjük az elemet 
    requestAnimationFrame(updatePosition);
}

updatePosition();

const errorMessage = document.getElementById('error') as HTMLElement;
const loggedIn = document.getElementById('loggedIn') as HTMLElement;
const usernameSpan = document.getElementById('username') as HTMLElement;
const servernameSpan = document.getElementById('server') as HTMLElement;
const alreadyLoggedIn = document.getElementById('alreadyLoggedIn') as HTMLElement;
const loggedInUserNameSpan = document.getElementById('loggedInUserName') as HTMLElement;
const loggedInUserServerSpan = document.getElementById('loggedInUserServer') as HTMLElement;

const login = async () => {
    const params = new URLSearchParams(document.location.search);
    const codeFromURL = params.get('code');
    try {
        if (!codeFromURL) {
            console.log('No code');
        }
        const result = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: codeFromURL }),
            credentials: 'include',
        });

        if (result.status === 401) {
            errorMessage.style.display = 'unset';
            return;
        }

        const { username, server } = await result.json();
        console.log(username);
        console.log(server);
        usernameSpan.innerText = username;
        servernameSpan.innerText = server.name;
        loggedIn.style.display = 'unset';
    } catch (error) {
        console.log(error);
    }
};

const checkStatus = async () => {
    const result = await fetch('/status', {
        headers: { 'Content-Type': 'application/json' },
    });

    if (result.status === 200) {
        const { username, server } = await result.json();
        console.log(username);
        console.log(server);
        loggedInUserNameSpan.innerText = username;
        loggedInUserServerSpan.innerText = server.name;
        alreadyLoggedIn.style.display = 'unset';
    } else if (result.status === 404) {
        await login();
    } else {
        console.log(result.status);
    }
};

checkStatus();