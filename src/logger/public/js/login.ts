for (let i = 0; i < 4; i++) {
    const logoImg = document.createElement('img');
    logoImg.dataset.testid = 'discordImg';
    logoImg.src = '/asserts/discord_logo.png';
    logoImg.alt = 'Discord Logo';
    logoImg.classList.add('discordLogo');
    logoImg.style.width = '5em';
    logoImg.style.position = 'absolute';
    logoImg.style.zIndex = '-1';
    document.body.append(logoImg);
}

/* eslint-disable no-console */
const logos = [...document.getElementsByClassName('discordLogo')];

// Save the start positions for the pngs
const positions = logos.map((logo) => ({
    posX: Math.random() * (window.innerWidth - (logo as HTMLImageElement).width),
    posY: Math.random() * (window.innerHeight - (logo as HTMLImageElement).height),
    // Two random number to increase the position
    dirX: (Math.random() - 0.5) * 6, // speed on x axis
    dirY: (Math.random() - 0.5) * 6, // speed on y axis
    angle: 0
}));

function updatePosition() {
    logos.forEach((logo, index) => {
        const position = positions[index];
        position.posX += position.dirX;
        position.posY += position.dirY;
        // Contanstly increase the amounts for rotating
        position.angle += 2;

        // If we reach the view edge, the png have to bounce back. If the position value bigger, than the innerWidth, multiply it with -1 
        if (position.posX <= 0 || position.posX >= window.innerWidth - (logo as HTMLImageElement).width) position.dirX *= -1;
        if (position.posY <= 0 || position.posY >= window.innerHeight - (logo as HTMLImageElement).height) position.dirY *= -1;

        // eslint-disable-next-line no-param-reassign
        (logo as HTMLImageElement).style.transform = `translate(${position.posX}px, ${position.posY}px) rotate(${position.angle}deg)`;
    });
    // requestAnimationFrame() is a JavaScript-based animation loop that runs about 60 times per second,
    // and each time it is called, we update the element directly
    requestAnimationFrame(updatePosition);
}

updatePosition();

const errorMessage = document.getElementById('error') as HTMLElement;
const loginPageMessage = document.getElementById('loginPageMessage') as HTMLElement;
const loggedIn = document.getElementById('loggedIn') as HTMLElement;
const usernameSpan = document.getElementById('username') as HTMLElement;
const servernameSpan = document.getElementById('server') as HTMLElement;
const alreadyLoggedIn = document.getElementById('alreadyLoggedIn') as HTMLElement;
const loggedInUserNameSpan = document.getElementById('loggedInUserName') as HTMLElement;
const loggedInUserServerSpan = document.getElementById('loggedInUserServer') as HTMLElement;

const displayErrorMessage = () => {
    loginPageMessage.style.color = 'orangered';
    loginPageMessage.style.border = '0.2em solid orangered';
    loginPageMessage.style.borderRadius = '0.5em';
    loginPageMessage.style.boxShadow = '0.5em 0.5em 2em orangered';
    errorMessage.style.display = 'unset';
};

const checkStatus = async () => {
    const result = await fetch('/status', {
        headers: { 'Content-Type': 'application/json' },
    });

    if (result.status === 200) {
        const { username, server } = await result.json();
        loggedInUserNameSpan.innerText = username;
        loggedInUserServerSpan.innerText = server;
        alreadyLoggedIn.style.display = 'unset';
    }

    return result;
};

const login = async () => {
    const loginStatus = await checkStatus();
    if (loginStatus.status === 200) {
        return;
    }

    const params = new URLSearchParams(document.location.search);
    const codeFromURL = params.get('code');

    if (!codeFromURL) {
        displayErrorMessage();
    }

    const result = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeFromURL }),
        credentials: 'include',
    });

    if (result.status !== 200) {
        displayErrorMessage();
        return;
    }

    const { username, server } = await result.json();
    usernameSpan.innerText = username;
    servernameSpan.innerText = server;
    loggedIn.style.display = 'unset';
};

login();