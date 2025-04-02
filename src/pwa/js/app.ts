if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/serviceWorker.js')
        .then((res) => console.info('service worker registered'))
        .catch((err) => console.error('service worker not registered', err));
    });
  }
  
  const spanElement = document.getElementById('toggleSpan');
  const toggleButton = document.getElementById('toggle');
  toggleButton!.addEventListener('click', () => {
    const isToggled = spanElement!.classList.toggle('toggled');
    spanElement!.innerText = isToggled ? 'Offline' : 'Online';
  });
  