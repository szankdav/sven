const usernameInNavbar = document.getElementById('discordName') as HTMLElement;
const userAvatarInNavbar = document.getElementById('discordPic') as HTMLImageElement;

const getLoggedInUserName = async () => {
    const result = await fetch('/api/username', {
        headers: { 'Content-Type': 'application/json' },
    });

    if (result.status === 200) {
        const { username, global_name } = await result.json();
        usernameInNavbar.innerText = `${global_name} (${username})`;
        usernameInNavbar.style.fontStyle = 'italic';
        usernameInNavbar.style.fontWeight = 'bold';
    }
};

const getLoggedInUserAvatar = async () => {
    const result = await fetch('/api/useravatar', {
        headers: { 'Content-Type': 'application/json' },
    });

    if (result.status === 200) {
        const userData = await result.json();
        userAvatarInNavbar.src = `https://cdn.discordapp.com/avatars/${userData.userId}/${userData.userAvatar}.jpg`;
    }
};

if (usernameInNavbar) {
    getLoggedInUserName();
};

if (userAvatarInNavbar) {
    getLoggedInUserAvatar();
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