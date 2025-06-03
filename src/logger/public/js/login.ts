const isLoggedIn = async () => {
    const response = await fetch('/api/authUser', {
        headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    if (result.result) {
        window.location.href = '/home';
    }

    return result;
};

const login = async () => {
    const isLoggedInResult = await isLoggedIn();
    if (!isLoggedInResult.result) {
        const params = new URLSearchParams(document.location.search);
        const codeFromURL = params.get('code');

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: codeFromURL }),
            credentials: 'include',
        });

        if (response.redirected) {
            window.location.href = response.url;
        }
    }
};

login();