const seeStatisticsButton: HTMLElement | null =
  document.getElementById("seeStatistics");
if (seeStatisticsButton) {
  seeStatisticsButton.addEventListener("click", () => {
    const statisticsDiv = document.getElementById("statistics");
    if (statisticsDiv!.classList.contains("d-none")) {
      statisticsDiv!.classList.remove("d-none");
      seeStatisticsButton.innerText = "Hide statistics";
    } else {
      statisticsDiv!.classList.add("d-none");
      seeStatisticsButton.innerText = "Show statistics";
    }
  });
}
