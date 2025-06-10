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

const searchForAuthors = async () => {
    const searchInputValue = (document.getElementById('searchInput') as HTMLInputElement).value;
    const result = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: searchInputValue })
    });

    const matchingAuthors = await result.json();
    return matchingAuthors;
};

const displaySearchResult = async () => {
    const matchingAuthors = await searchForAuthors();
    if (matchingAuthors.length === 0) {
        searchResults.innerHTML = '';
        const a = document.createElement('a');
        a.classList.add('block');
        a.classList.add('p-2');
        a.classList.add('text-white');
        a.classList.add('hover:bg-gray-700');
        a.classList.add('rounded-md');
        a.classList.add('cursor-pointer');
        a.innerText = 'No author found!';
        searchResults.append(a);
    } else {
        searchResults.innerHTML = '';
        for (let i = 0; i < matchingAuthors.length; i++) {
            const a = document.createElement('a');
            a.classList.add('block');
            a.classList.add('p-2');
            a.classList.add('text-white');
            a.classList.add('hover:bg-gray-700');
            a.classList.add('rounded-md');
            a.classList.add('cursor-pointer');
            a.innerText = matchingAuthors[i].name;
            a.href = `/messages/author/${matchingAuthors[i].id}`;
            searchResults.append(a);
        }
        searchResults.classList.remove('hidden');
    }
};

if (searchInput) {
    searchInput.addEventListener('keyup', debounce(displaySearchResult, 300));
};

document.addEventListener('click', (e: Event) => {
    const targetElement = e.target as HTMLElement;
    if (!searchInput.contains(targetElement) && !searchResults.contains(targetElement)) {
        searchResults.classList.add('hidden');
    }
});

document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        searchResults.classList.add('hidden');
    }
});