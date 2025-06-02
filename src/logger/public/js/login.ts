const isLoggedIn = async () => {
    const result = await fetch('/isloggedin', {
        headers: { 'Content-Type': 'application/json' },
    });

    return result.json();
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