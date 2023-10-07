//You can edit ALL of the code here
function formatEpisodeCode(season, episode) {
  return `S${season.toString().padStart(2, "0")}E${episode
    .toString()
    .padStart(2, "0")}`;
}

function setup() {
  const rootDiv = document.getElementById("root");
  const allEpisodes = getAllEpisodes();

  allEpisodes.forEach((episode) => {
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

window.onload = setup;
