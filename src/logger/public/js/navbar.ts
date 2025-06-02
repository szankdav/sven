const usernameInNavbar = document.getElementById('username') as HTMLElement;

const whoAmI = async () => {
    const result = await fetch('/whoami', {
        headers: { 'Content-Type': 'application/json' },
    });

    if (result.status === 200) {
        const { username } = await result.json();
        usernameInNavbar.innerText = username;
        usernameInNavbar.style.fontStyle = 'italic';
        usernameInNavbar.style.fontWeight = 'bold';
    }
};

whoAmI();