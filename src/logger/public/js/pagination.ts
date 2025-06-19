const paginationNav = document.querySelector('nav[aria-label="Pagination"]');

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

const getCurrentPageNumber = (): number => {
  const segments: string[] = window.location.pathname
    .split('/')
    .filter(Boolean);
  const lastSegment: number = parseInt(segments[segments.length - 1], 10);
  return Number.isNaN(lastSegment) ? 1 : lastSegment;
};

const hidePagination = (): void => {
  paginationNav?.classList.add('hidden');
};

const updatePagination = (currentPage: number): void => {
  let firstPageInPagination: number | null = null;
  let secondPageInPagination: number | null = null;
  let thirdPageInPagination: number | null = null;

  if (maxPageNumber <= 1) {
    hidePagination();
    return;
  }

  if (maxPageNumber === 2) {
    firstPageInPagination = 1;
    secondPageInPagination = 2;
  } else if (maxPageNumber >= 3){
    if (currentPage === 1) {
      firstPageInPagination = 1;
      secondPageInPagination = 2;
      thirdPageInPagination = 3;
    } else if (currentPage === maxPageNumber) {
      firstPageInPagination = maxPageNumber - 2;
      secondPageInPagination = maxPageNumber - 1;
      thirdPageInPagination = maxPageNumber;
    } else {
      firstPageInPagination = currentPage - 1;
      secondPageInPagination = currentPage;
      thirdPageInPagination = currentPage + 1;
    }
  }

    const pageButtons = [
    { button: firstPageNumberButton, pageNumber: firstPageInPagination },
    { button: secondPageNumberButton, pageNumber: secondPageInPagination },
    { button: thirdPageNumberButton, pageNumber: thirdPageInPagination },
  ];

  pageButtons.forEach(({ button, pageNumber }) => {
    if(button){
      if(pageNumber !== null){
        // eslint-disable-next-line no-param-reassign
        button.innerText = pageNumber.toString();
        // eslint-disable-next-line no-param-reassign
        button.href = `${pageNumber}`;
        button.classList.remove('hidden');
      } else {
        button.classList.add('hidden');
      }
    };
  });

  if (previousButton) {
    previousButton.href = `${currentPage - 1}`;
    previousButton.classList.toggle('disabled:opacity-50', currentPage <= 1);
    previousButton.classList.toggle('pointer-events-none', currentPage <= 1); 
    previousButton.setAttribute('aria-disabled', (currentPage <= 1).toString());
    previousButton.tabIndex = currentPage <= 1 ? -1 : 0; 
  }

  if (nextButton) {
    nextButton.href = `${currentPage + 1}`;
    nextButton.classList.toggle('disabled:opacity-50', currentPage >= maxPageNumber);
    nextButton.classList.toggle('pointer-events-none', currentPage >= maxPageNumber); 
    nextButton.setAttribute('aria-disabled', (currentPage >= maxPageNumber).toString());
    nextButton.tabIndex = currentPage >= maxPageNumber ? -1 : 0; 
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = getCurrentPageNumber();
  updatePagination(currentPage);

  previousButton?.addEventListener('click', (event) => {
    event.preventDefault();
    if (currentPage > 1) {
      window.location.href = `${currentPage - 1}`;
    }
  });

  nextButton?.addEventListener('click', (event) => {
    event.preventDefault();
    if (currentPage < maxPageNumber) {
      window.location.href = `${currentPage + 1}`;
    }
  });
});
