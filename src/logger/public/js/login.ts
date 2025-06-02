const isLoggedIn = async () => {
    const response = await fetch('/isloggedin', {
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.redirected) {
        window.location.href = response.url;
    }

    return response.json();
};

const login = async () => {
    const isLoggedInResult = await isLoggedIn();
    if (!isLoggedInResult.result) {
        const params = new URLSearchParams(document.location.search);
        const codeFromURL = params.get('code');

        const response = await fetch('/', {
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