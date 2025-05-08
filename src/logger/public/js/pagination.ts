let pageURL: string;

const setNavLinkActive = (): void => {
  let activePage: string[] = window.location.href.split('/');
  activePage = activePage.filter(Boolean);
  const navLinks: HTMLCollectionOf<Element> =
    document.getElementsByClassName('nav-link');

  Array.from(navLinks).forEach((navLink: HTMLElement | unknown) => {
    if (
      activePage.includes((navLink as HTMLElement).textContent!.toLowerCase())
    ) {
      (navLink as HTMLElement).classList.add('active');
      pageURL = `/${(navLink as HTMLElement).textContent!.toLowerCase()}`;
    } else {
      (navLink as HTMLElement).classList.remove('active');
    }
  });

  // for (const navLink of navLinks) {
  //   if (
  //     activePage.includes((navLink as HTMLElement).textContent!.toLowerCase())
  //   ) {
  //     navLink.classList.add('active');
  //     pageURL = `/${(navLink as HTMLElement).textContent!.toLowerCase()}`;
  //   } else {
  //     navLink.classList.remove('active');
  //   }
  // }
};

const previousButton = document.getElementById(
  'previousButton',
) as HTMLAnchorElement | null;
const nextButton = document.getElementById(
  'nextButton',
) as HTMLAnchorElement | null;
const firstPageNumberButton = document.getElementById(
  'firstPageNumberButton',
) as HTMLAnchorElement | null;
const secondPageNumberButton = document.getElementById(
  'secondPageNumberButton',
) as HTMLAnchorElement | null;
const thirdPageNumberButton = document.getElementById(
  'thirdPageNumberButton',
) as HTMLAnchorElement | null;

const maxNum: string | undefined = nextButton?.dataset.maxpages;
const maxPageNumber: number = !Number.isNaN(Number(maxNum)) ? Number(maxNum) : 1;

const getCurrentPage = (): number => {
  const segments: string[] = window.location.pathname
    .split('/')
    .filter(Boolean);
  const lastSegment: number = parseInt(segments[segments.length - 1], 10);
  return Number.isNaN(lastSegment) ? 1 : lastSegment;
};

const hidePagination = (): void => {
  previousButton?.classList.add('d-none');
  firstPageNumberButton?.classList.add('d-none');
  secondPageNumberButton?.classList.add('d-none');
  thirdPageNumberButton?.classList.add('d-none');
  nextButton?.classList.add('d-none');
};

const updatePagination = (pageNumber: number): void => {
  if (maxPageNumber <= 1) {
    hidePagination();
    
  } else if (maxPageNumber === 2) {
    const updatedPageNumber = Math.max(1, Math.min(pageNumber, maxPageNumber));

    firstPageNumberButton!.innerText =
    updatedPageNumber > 1 ? (updatedPageNumber - 1).toString() : '1';
    secondPageNumberButton!.innerText =
    updatedPageNumber === 1 ? (updatedPageNumber + 1).toString() : updatedPageNumber.toString();
    thirdPageNumberButton?.classList.add('d-none');
    firstPageNumberButton!.href = `${pageURL}/${firstPageNumberButton?.innerText}`;
    secondPageNumberButton!.href = `${pageURL}/${secondPageNumberButton?.innerText}`;
    previousButton!.href =
    updatedPageNumber > 1 ? `${pageURL}/${updatedPageNumber - 1}` : '#';
    nextButton!.href =
    updatedPageNumber < maxPageNumber ? `${pageURL}/${updatedPageNumber + 1}` : '#';

    previousButton?.classList.toggle('disabled', updatedPageNumber === 1);
    nextButton?.classList.toggle('disabled', updatedPageNumber === maxPageNumber);
  } else {
    const updatedPageNumber = Math.max(1, Math.min(pageNumber, maxPageNumber));

    firstPageNumberButton!.innerText =
    updatedPageNumber > 1 ? (updatedPageNumber - 1).toString() : '1';
    secondPageNumberButton!.innerText =
    updatedPageNumber === 1 ? (updatedPageNumber + 1).toString() : updatedPageNumber.toString();
    // thirdPageNumberButton!.innerText =
    // updatedPageNumber === 1
    //     ? (updatedPageNumber + 2).toString()
    //     : updatedPageNumber < maxPageNumber
    //       ? (updatedPageNumber + 1).toString()
    //       : '';

    let thirdPageText = '';
    if (updatedPageNumber === 1) {
      thirdPageText = (updatedPageNumber + 2).toString();
    } else if (updatedPageNumber < maxPageNumber) {
      thirdPageText = (updatedPageNumber + 1).toString();
    }

    thirdPageNumberButton!.innerText = thirdPageText;

    if (updatedPageNumber === maxPageNumber) {
      thirdPageNumberButton?.classList.add('d-none');
    }
    firstPageNumberButton!.href = `${pageURL}/${firstPageNumberButton?.innerText}`;
    secondPageNumberButton!.href = `${pageURL}/${secondPageNumberButton?.innerText}`;
    thirdPageNumberButton!.href = `${pageURL}/${thirdPageNumberButton?.innerText}`;

    previousButton!.href =
    updatedPageNumber > 1 ? `${pageURL}/${updatedPageNumber - 1}` : '#';
    nextButton!.href =
    updatedPageNumber < maxPageNumber ? `${pageURL}/${updatedPageNumber + 1}` : '#';

    previousButton?.classList.toggle('disabled', updatedPageNumber === 1);
    nextButton?.classList.toggle('disabled', updatedPageNumber === maxPageNumber);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  setNavLinkActive();
  const pageNumber = getCurrentPage();
  updatePagination(pageNumber);

  previousButton?.addEventListener('click', (event) => {
    event.preventDefault();
    if (pageNumber > 1) {
      window.location.href = `${pageURL}/${pageNumber - 1}`;
    }
  });

  nextButton?.addEventListener('click', (event) => {
    event.preventDefault();
    if (pageNumber < maxPageNumber) {
      window.location.href = `${pageURL}/${pageNumber + 1}`;
    }
  });
});
