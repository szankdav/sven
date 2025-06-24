const usernameInNavbar = document.getElementById('discordName') as HTMLElement;
const userAvatarInNavbar = document.getElementById('discordPic') as HTMLImageElement;
const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement;

const getLoggedInUserData = async () => {
    const result = await fetch('/api/userdata', {
        headers: { 'Content-Type': 'application/json' },
    });

    if (result.status === 200) {
        const { username, global_name, userAvatar, userId } = await result.json();
        usernameInNavbar.innerText = `${global_name} (${username})`;
        usernameInNavbar.style.fontStyle = 'italic';
        usernameInNavbar.style.fontWeight = 'bold';
        userAvatarInNavbar.src = `https://cdn.discordapp.com/avatars/${userId}/${userAvatar}.jpg`;
    }
};

if (usernameInNavbar && userAvatarInNavbar) {
    getLoggedInUserData();
};

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

if(logoutButton){
    logoutButton.addEventListener('click', async () => {
        const result = await fetch('/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInNavbar.innerText }),
        });

        if(result.status === 200){
            window.location.href = '/';
        };
    });
};