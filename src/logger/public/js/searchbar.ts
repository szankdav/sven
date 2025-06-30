const searchInput = (document.getElementById('searchInput') as HTMLInputElement);
const searchResults = document.getElementById('searchResults') as HTMLUListElement;

const debounce = <T extends unknown[]>(
    callback: (...args: T) => void,
    delay: number,
) => {
    let timeoutTimer: ReturnType<typeof setTimeout>;
    return (...args: T) => {
        clearTimeout(timeoutTimer);

        timeoutTimer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};

const searchForAuthors = async (searchInputValue: string) => {
    const result = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: searchInputValue })
    });

    const matchingAuthors = await result.json();
    return matchingAuthors;
};

const displaySearchResult = async () => {
    const searchInputValue = (document.getElementById('searchInput') as HTMLInputElement).value;
    if (searchInputValue.length === 0) {
        searchResults.setAttribute('data-show', 'false');
        return;
    };
    const matchingAuthors = await searchForAuthors(searchInputValue);
    if (matchingAuthors.length === 0) {
        searchResults.innerHTML = '';
        const li = document.createElement('li');
        const classes = ['px-4', 'py-2', 'hover:bg-gray-700', 'cursor-pointer', 'text-gray-300', 'hover:text-white', 'transition-colors', 'duration-150'];
        li.classList.add(...classes);
        li.innerText = 'No author found!';
        searchResults.append(li);
        searchResults.setAttribute('data-show', 'true');
    } else {
        searchResults.innerHTML = '';
        for (let i = 0; i < matchingAuthors.length; i++) {
            const li = document.createElement('li');
            const classes = ['px-4', 'py-2', 'hover:bg-gray-700', 'cursor-pointer', 'text-gray-300', 'hover:text-white', 'transition-colors', 'duration-150'];
            li.classList.add(...classes);
            li.innerText = matchingAuthors[i].name;
            li.addEventListener('click', () => {
                window.location.href = `/messages/author/${matchingAuthors[i].id}`;
            });
            searchResults.append(li);
        }
        searchResults.setAttribute('data-show', 'true');
    }
};

if (searchInput) {
    searchInput.addEventListener('keyup', debounce(displaySearchResult, 300));
};

document.addEventListener('click', (e: Event) => {
    if (searchInput) {
        const targetElement = e.target as HTMLElement;
        if (!searchInput.contains(targetElement) && !searchResults.contains(targetElement)) {
            searchResults.setAttribute('data-show', 'false');
        }
    }
});

document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (searchInput) {
        if (event.key === 'Escape') {
            searchResults.setAttribute('data-show', 'false');
        }
    }
});