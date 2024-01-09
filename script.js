//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach(displayEpisode);
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

window.onload = setup;
