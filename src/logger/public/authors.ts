const authorRows: HTMLCollectionOf<Element> =
  document.getElementsByClassName("authorRow");
for (let i = 0; i < authorRows.length; i++) {
  authorRows[i].addEventListener("click", () => {
    window.location.href = `/messages/author/${(authorRows[i] as HTMLElement).dataset.id}`;
  });
}
