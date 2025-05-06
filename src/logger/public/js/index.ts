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
        alert('No match!');
    } else {
        window.location.href = `/authors/${page}`;
    }
});