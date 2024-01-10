//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", handleSearch);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  const selectElem = document.getElementById("episodeSelect");
  selectElem.innerHTML = "<option value='-1'>Select an episode</option>";

  episodeList.forEach((episode, index) => {
    displayEpisode(episode);
    const option = document.createElement("option");
    const { season, number, name } = episode;
    const formattedSeason = season.toString().padStart(2, "0");
    const formattedEpisode = number.toString().padStart(2, "0");
    const episodeCode = `S${formattedSeason}E${formattedEpisode}`;
    option.value = index.toString();
    option.textContent = `${episodeCode} - ${name}`;
    selectElem.appendChild(option);
  });
}

function displayEpisode(episode) {
  const { season, number, name, image, summary, id } = episode;
  const formattedSeason = season.toString().padStart(2, "0");
  const formattedEpisode = number.toString().padStart(2, "0");
  const episodeCode = `S${formattedSeason}E${formattedEpisode}`;
  const listItem = document.createElement("li");
  listItem.className = "episode-item";
  listItem.innerHTML = `
    <h3 class="episode-title">${episodeCode}: ${name}</h3>
    <img class="episode-image" src="${image.medium}" alt="${name}">
    <p class="episode-summary">${summary}</p>
    <p class="source-link">Data sourced from <a href="${id}" target="_blank">TVMaze.com</a></p>
  `;
  const rootElem = document.getElementById("root");
  rootElem.appendChild(listItem);
}

function handleSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.toLowerCase();

  const filteredEpisodes = getAllEpisodes().filter((episode) => {
    const episodeName = episode.name.toLowerCase();
    const episodeSummary = episode.summary.toLowerCase();
    return (
      episodeName.includes(searchTerm) || episodeSummary.includes(searchTerm)
    );
  });

  makePageForEpisodes(filteredEpisodes);
  updateSearchCount(filteredEpisodes.length);
}

function updateSearchCount(count) {
  const searchCountElem = document.getElementById("searchCount");
  searchCountElem.textContent = `Matching episodes: ${count}`;
}

function handleSelectChange() {
  const selectElem = document.getElementById("episodeSelect");
  const selectedIndex = parseInt(selectElem.value);

  if (selectedIndex !== -1) {
    const selectedEpisode = getAllEpisodes()[selectedIndex];
    makePageForEpisodes([selectedEpisode]);
  } else {
    makePageForEpisodes(getAllEpisodes());
  }
}

window.onload = setup;
