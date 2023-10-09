//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  return episodeList.map(episode => {
    const div = document.createElement("div");
    div.classList.add("episode");

    const h3 = document.createElement("h3");
    h3.textContent = `${episode.name} - ${episode.number < 10
      ? "S0"+episode.season+"E0"+episode.number 
      : "S0"+episode.season+"E"+episode.number}`;

    const img = document.createElement("img");
    img.src = episode.image.medium;

    const p = document.createElement("p");
    p.textContent = episode.summary;

    div.append(h3, img, p);
    rootElem.appendChild(div);
  })
}

window.onload = setup;
