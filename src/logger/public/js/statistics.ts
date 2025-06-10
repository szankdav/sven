const seeStatisticsButton: HTMLElement | null =
  document.getElementById('seeStatistics');
const statisticsDiv: HTMLElement | null = document.getElementById('statistics');
if (seeStatisticsButton && statisticsDiv) {
  seeStatisticsButton.addEventListener('click', () => {
    const isHidden = statisticsDiv.classList.toggle('hidden');
    seeStatisticsButton.innerText = isHidden ? 'Show statistics' : 'Hide statistics';
  });
};
