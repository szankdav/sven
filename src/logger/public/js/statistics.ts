document.addEventListener('DOMContentLoaded', () => {
  const seeStatisticsBtn = document.getElementById('seeStatistics');
  const statisticsSection = document.getElementById('statistics');

  if (seeStatisticsBtn && statisticsSection) {
    seeStatisticsBtn.addEventListener('click', () => {
      statisticsSection.classList.toggle('hidden');
      // Optional: Change button text
      if (statisticsSection.classList.contains('hidden')) {
        seeStatisticsBtn.innerHTML = `
                        <svg class="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                        </svg>
                        Show Statistics
                    `;
      } else {
        seeStatisticsBtn.innerHTML = `
                        <svg class="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3.5-7.5a.75.75 0 000 1.5h7a.75.75 0 000-1.5h-7z" clip-rule="evenodd" />
                        </svg>
                        Hide Statistics
                    `;
      }
    });
  }
});
