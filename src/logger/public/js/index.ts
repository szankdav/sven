const usernameInNavbar = document.getElementById('username') as HTMLElement;

const searchInput = (document.getElementById('searchInput') as HTMLInputElement);
const searchResults = document.getElementById('searchResults') as HTMLUListElement;

if (searchInput) {
    searchInput.addEventListener('focusout', () => {
        searchResults.classList.remove('show');
    });


    searchInput.addEventListener('keyup', async () => {
        const searchInputValue = (document.getElementById('searchInput') as HTMLInputElement).value;
        const result = await fetch('/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ authorName: searchInputValue })
        });

        const matchingAuthors = await result.json();

        if (matchingAuthors.length === 0) {
            searchResults.innerHTML = '';
            const li = document.createElement('li');
            li.innerText = 'No author found!';
            searchResults.append(li);
        } else {
            searchResults.innerHTML = '';
            for (let i = 0; i < matchingAuthors.length; i++) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.innerText = matchingAuthors[i].name;
                a.href = `/messages/author/${matchingAuthors[i].id}`;
                li.append(a);
                searchResults.append(li);
            }
            searchResults.classList.add('show');
        }
    });
}

// const navbarToggleButton = document.getElementsByClassName('navbar-toggler');

// document.documentElement.addEventListener('click', () => {
//     const navbarCollapse = document.querySelector('.show');
//     console.log(navbarCollapse);
//     if (navbarCollapse) {
//         (navbarToggleButton[0] as HTMLButtonElement).click();
//     }
// });

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