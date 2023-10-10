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

    const label = document.querySelector("label");
    label.textContent = `Displaying ${getAllEpisodes().length}/${getAllEpisodes().length} episodes`;
  })
}

window.onload = setup;

function searchEpisode (value) {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  const label = document.querySelector("label");

  const filteredEpisodes = getAllEpisodes().filter(episode =>
    episode.name.toLowerCase().includes(value.toLowerCase()) || episode.summary.toLowerCase().includes(value.toLowerCase())
  );

  return makePageForEpisodes(filteredEpisodes),
  label.textContent = `Displaying ${filteredEpisodes.length}/${getAllEpisodes().length} episodes`;
}

const input = document.querySelector("#input");
input.addEventListener("input", () => searchEpisode(input.value));
