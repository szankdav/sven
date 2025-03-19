let pageURL: string;

const setNavLinkActive = (): void => {
  let activePage: string[] = window.location.href.split("/");
  activePage = activePage.filter(Boolean);
  const navLinks: HTMLCollectionOf<Element> =
    document.getElementsByClassName("nav-link");

  for (const navLink of navLinks) {
    if (
      activePage.includes((navLink as HTMLElement).textContent!.toLowerCase())
    ) {
      navLink.classList.add("active");
      pageURL = `/${(navLink as HTMLElement).textContent!.toLowerCase()}`;
    } else {
      navLink.classList.remove("active");
    }
  }
};

const previousButton = document.getElementById(
  "previousButton",
) as HTMLAnchorElement | null;
const nextButton = document.getElementById(
  "nextButton",
) as HTMLAnchorElement | null;
const firstPageNumberButton = document.getElementById(
  "firstPageNumberButton",
) as HTMLAnchorElement | null;
const secondPageNumberButton = document.getElementById(
  "secondPageNumberButton",
) as HTMLAnchorElement | null;
const thirdPageNumberButton = document.getElementById(
  "thirdPageNumberButton",
) as HTMLAnchorElement | null;

const maxNum: string | undefined = nextButton?.dataset.maxpages;
const maxPageNumber: number = !isNaN(Number(maxNum)) ? Number(maxNum) : 1;

const getCurrentPage = (): number => {
  const segments: string[] = window.location.pathname
    .split("/")
    .filter(Boolean);
  const lastSegment: number = parseInt(segments[segments.length - 1], 10);
  return isNaN(lastSegment) ? 1 : lastSegment;
};

const updatePagination = (pageNumber: number): void => {
  if (maxPageNumber <= 1) {
    hidePagination();
    return;
  } else if (maxPageNumber === 2) {
    pageNumber = Math.max(1, Math.min(pageNumber, maxPageNumber));

    firstPageNumberButton!.innerText =
      pageNumber > 1 ? (pageNumber - 1).toString() : "1";
    secondPageNumberButton!.innerText =
      pageNumber === 1 ? (pageNumber + 1).toString() : pageNumber.toString();
    thirdPageNumberButton?.classList.add("d-none");
    firstPageNumberButton!.href = `${pageURL}/${firstPageNumberButton?.innerText}`;
    secondPageNumberButton!.href = `${pageURL}/${secondPageNumberButton?.innerText}`;
    previousButton!.href =
      pageNumber > 1 ? `${pageURL}/${pageNumber - 1}` : "#";
    nextButton!.href =
      pageNumber < maxPageNumber ? `${pageURL}/${pageNumber + 1}` : "#";

    previousButton?.classList.toggle("disabled", pageNumber === 1);
    nextButton?.classList.toggle("disabled", pageNumber === maxPageNumber);
  } else {
    pageNumber = Math.max(1, Math.min(pageNumber, maxPageNumber));

    firstPageNumberButton!.innerText =
      pageNumber > 1 ? (pageNumber - 1).toString() : "1";
    secondPageNumberButton!.innerText =
      pageNumber === 1 ? (pageNumber + 1).toString() : pageNumber.toString();
    thirdPageNumberButton!.innerText =
      pageNumber === 1
        ? (pageNumber + 2).toString()
        : pageNumber < maxPageNumber
          ? (pageNumber + 1).toString()
          : "";

    if (pageNumber === maxPageNumber) {
      thirdPageNumberButton?.classList.add("d-none");
    }
    firstPageNumberButton!.href = `${pageURL}/${firstPageNumberButton?.innerText}`;
    secondPageNumberButton!.href = `${pageURL}/${secondPageNumberButton?.innerText}`;
    thirdPageNumberButton!.href = `${pageURL}/${thirdPageNumberButton?.innerText}`;

    previousButton!.href =
      pageNumber > 1 ? `${pageURL}/${pageNumber - 1}` : "#";
    nextButton!.href =
      pageNumber < maxPageNumber ? `${pageURL}/${pageNumber + 1}` : "#";

    previousButton?.classList.toggle("disabled", pageNumber === 1);
    nextButton?.classList.toggle("disabled", pageNumber === maxPageNumber);
  }
};

const hidePagination = (): void => {
  previousButton?.classList.add("d-none");
  firstPageNumberButton?.classList.add("d-none");
  secondPageNumberButton?.classList.add("d-none");
  thirdPageNumberButton?.classList.add("d-none");
  nextButton?.classList.add("d-none");
};

document.addEventListener("DOMContentLoaded", () => {
  setNavLinkActive();
  let pageNumber = getCurrentPage();
  updatePagination(pageNumber);

  previousButton?.addEventListener("click", (event) => {
    event.preventDefault();
    if (pageNumber > 1) {
      window.location.href = `${pageURL}/${pageNumber - 1}`;
    }
  });

  nextButton?.addEventListener("click", (event) => {
    event.preventDefault();
    if (pageNumber < maxPageNumber) {
      window.location.href = `${pageURL}/${pageNumber + 1}`;
    }
  });
});
