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


window.onload = () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    console.log(fragment);
    const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

    if (!accessToken) {
        (document.getElementById('error') as HTMLElement).style.display = 'unset';
        return;
    }

    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
        .then(result => result.json())
        .then(response => {
            const { username, discriminator } = response;
            console.log(response);
            (document.getElementById('username') as HTMLElement).innerText = username;
            (document.getElementById('login') as HTMLElement).style.display = 'unset';
        })
        .catch(console.error);
};