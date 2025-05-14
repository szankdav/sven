const searchButton = document.getElementById('searchButton');

searchButton?.addEventListener('click', async (event) => {
    event.preventDefault();
    const searchInputValue = (document.getElementById('searchInput') as HTMLInputElement).value;
    const result = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: searchInputValue })
    });
    const page = await result.json();
    if (page === 0) {
        // eslint-disable-next-line no-alert
        alert('No match!');
    } else {
        window.location.href = `/authors/${page}`;
    }
});

// const navbarToggleButton = document.getElementsByClassName('navbar-toggler');

// document.documentElement.addEventListener('click', () => {
//     const navbarCollapse = document.querySelector('.show');
//     console.log(navbarCollapse);
//     if (navbarCollapse) {
//         (navbarToggleButton[0] as HTMLButtonElement).click();
//     }
// });