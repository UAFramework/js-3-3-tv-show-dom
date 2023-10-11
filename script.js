//You can edit ALL of the code here
const rootDiv = document.getElementById("root");
const episodes = getAllEpisodes();
var filteredEpisodes = episodes;
const searchInput = document.getElementById("search");
const select = document.getElementById("select");

function formatEpisodeCode(season, episode) {
  return `S${season.toString().padStart(2, "0")}E${episode
    .toString()
    .padStart(2, "0")}`;
}

function showEpisodes(episodes) {
  rootDiv.innerHTML = "";
  episodes.forEach((episode) => {
    const episodeCode = formatEpisodeCode(episode.season, episode.number);
    const episodeName = episode.name;
    const episodeImage = episode.image.medium;
    const episodeSummary = episode.summary;

    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <h3>${episodeCode}: ${episodeName}</h3>
      <img src="${episodeImage}" alt="${episodeName}">
      <p>${episodeSummary}</p>
    `;

    rootDiv.appendChild(listItem);
  });
}

function showEpisodesCount(episodes, filtered) {
  const episodesCountDiv = document.getElementById("episodes-count");
  episodesCountDiv.innerHTML = `Displaying ${filtered.length}/${episodes.length} episodes`;
}

function fillSelect() {
  let option = document.createElement("option");
  option.text = 'All';
  option.value = 'All';
  select.add(option);
  episodes.map((episode) => {
    let option = document.createElement("option");
    let episodeCode = formatEpisodeCode(episode.season, episode.number);
    option.text = `${episodeCode} - ${episode.name}`;
    option.value = episodeCode;
    select.add(option);
  });
}

searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.toLowerCase();
  filteredEpisodes = episodes.filter((episode) => {
    return (
      episode.name.toLowerCase().includes(searchText) ||
      episode.summary.toLowerCase().includes(searchText)
    );
  });

  showEpisodes(filteredEpisodes);
  showEpisodesCount(episodes, filteredEpisodes);
});

select.addEventListener("change", function() {
  var selectedOption = select.options[select.selectedIndex];
  var targetSectionId = selectedOption.value;

  if (selectedOption.value === 'All') {
    filteredEpisodes = episodes;
  } else {
    filteredEpisodes = episodes.filter((episode) => {
      return targetSectionId === formatEpisodeCode(episode.season, episode.number);
    });
  }

  showEpisodes(filteredEpisodes);
  showEpisodesCount(episodes, filteredEpisodes);
});

function preparePage() {
  showEpisodes(episodes);
  showEpisodesCount(episodes, filteredEpisodes);
  fillSelect();
}

window.onload = preparePage;
