const shortMessages = document.getElementsByClassName('shortMessage') as HTMLCollectionOf<HTMLElement>;
const expandedMessageDivs = document.getElementsByClassName('expandedMessageDiv') as HTMLCollectionOf<HTMLElement>;
const messageContents = document.getElementsByClassName('messageContent') as HTMLCollectionOf<HTMLElement>;
const messageCloseButtons = document.getElementsByClassName('messageCloseButton') as HTMLCollectionOf<HTMLElement>;

for (let i = 0; i < shortMessages.length; i++) {
    expandedMessageDivs[i].classList.add('hidden');
    shortMessages[i].addEventListener('click', async () => {
        const result = await fetch('/api/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageid: shortMessages[i].dataset.messageid }),
        });

        const message = await result.json();
        messageContents[i].innerText = message.content;
        expandedMessageDivs[i].classList.remove('hidden');
    });

    messageCloseButtons[i].addEventListener('click', () => {
        expandedMessageDivs[i].classList.add('hidden');
    });
};
