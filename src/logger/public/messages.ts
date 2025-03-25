const authorNameTds: HTMLCollectionOf<Element> =
  document.getElementsByClassName('authorName');
for (let i = 0; i < authorNameTds.length; i++) {
  authorNameTds[i].addEventListener('click', () => {
    window.location.href = `/messages/author/${(authorNameTds[i] as HTMLElement).dataset.authorid}`;
  });
}
