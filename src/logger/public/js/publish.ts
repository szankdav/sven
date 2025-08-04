const foremArticlesButton = document.getElementById('foremArticlesButton') as HTMLButtonElement;
const hwswNewsButton = document.getElementById('hwswNewsButton') as HTMLButtonElement;
const foremArticlesDiv = document.getElementById('foremArticles') as HTMLElement;
const hwswNews = document.getElementById('hwswNews') as HTMLElement;
const selectButtons = document.getElementsByClassName('select') as HTMLCollection;
const articlesListWindow = document.getElementById('articlesListWindow') as HTMLElement;
const hwswNewsListWindow = document.getElementById('hwswNewsListWindow') as HTMLElement;
const articlesList = document.getElementById('articlesList') as HTMLElement;
const hwswNewsList = document.getElementById('hwswNewsList') as HTMLElement;

foremArticlesButton.addEventListener('click', () => {
    foremArticlesDiv.classList.toggle('hidden');
    hwswNews.classList.add('hidden');
    foremArticlesButton.disabled = true;
    hwswNewsButton.disabled = false;
});

hwswNewsButton.addEventListener('click', () => {
    hwswNews.classList.toggle('hidden');
    foremArticlesDiv.classList.add('hidden');
    hwswNewsButton.disabled = true;
    foremArticlesButton.disabled = false;
});

const createSpan = (type: string, id: string) => {
    const span = document.createElement('span');
    span.classList.add('text-red-500');
    span.classList.add('font-bold');
    span.classList.add('ml-1');
    span.classList.add('cursor-pointer');
    span.dataset.id = id || '';
    span.dataset.type = type || '';
    span.innerText = 'X';

    return span;
};

const removeSelectedFromList = (publishableDiv: HTMLElement, listWindow: HTMLElement, list:HTMLElement, id: string) => {
    const listItems = list.getElementsByTagName('p');
    Array.from(listItems).forEach(paragraph => {
        if ((paragraph.childNodes[1] as HTMLElement).dataset.id === id) {
            list.removeChild(paragraph);
            document.getElementById(`${publishableDiv.id}-${id}`)?.classList.remove('hidden');
            if (listItems.length === 0) {
                listWindow.classList.add('hidden');
            };
        };
    });
};

const cancelArticlesAndNews = async (span: HTMLSpanElement, publishableDiv: HTMLElement, listWindow: HTMLElement, list: HTMLElement) => {
    const { type, id } = span.dataset;
    const response = await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id }),
        credentials: 'include',
    });

    if (response.status === 200) {
        if (type === 'article' && id) {
            removeSelectedFromList(publishableDiv, listWindow, list, id);
        } else if (type === 'hwswNew' && id) {
            removeSelectedFromList(publishableDiv, listWindow, list, id);
        };
    };
};

const makeSpanClickable = (span: HTMLSpanElement, publishableDiv: HTMLElement, listWindow: HTMLElement, list: HTMLElement) => {
    span.addEventListener('click', async () => {
        cancelArticlesAndNews(span, publishableDiv, listWindow, list);
    });
};

const handleSelectedList = (type: string, id: string, title: string, publishableDiv: HTMLElement, listWindow: HTMLElement, list: HTMLElement) => {
    const span = createSpan(type, id);
    const p = document.createElement('p');
    p.classList.add('m-1');
    p.classList.add('border-b');
    p.classList.add('border-gray-700');
    p.innerText = `${title}`;
    p.append(span);

    makeSpanClickable(span, publishableDiv, listWindow, list);

    listWindow.classList.remove('hidden');
    document.getElementById(`${publishableDiv.id}-${id}`)?.classList.add('hidden');
    list.append(p);
};

const selectArticlesAndNews = async (button: HTMLButtonElement) => {
    const { type, id } = button.dataset;
    const response = await fetch('/api/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id }),
        credentials: 'include',
    });

    if (response.status === 200) {
        const result = await response.json();
        if (type === 'article' && id) {
            handleSelectedList(type, id, result.title, foremArticlesDiv, articlesListWindow, articlesList);
        } else if (type === 'hwswNew' && id) {
            handleSelectedList(type, id, result.title, hwswNews, hwswNewsListWindow, hwswNewsList);
        };
    };
};

Array.from(selectButtons).forEach(button => {
    button.addEventListener('click', async () => {
        await selectArticlesAndNews(button as HTMLButtonElement);
    });
});