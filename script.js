window.onload = setup;

function setup() {
  const allShows = getAllShows();
  makePageForShows(allShows);
  createShowsDroplist(allShows);
}

let isDisplayedShows = true;

let allEpisodesArray;
async function fetchEpisodesData(showId) {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    allEpisodesArray = await response.json();
    return allEpisodesArray;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

function setSeasonAndEpisodeNumber (season, episode) {
  return `${(season < 10 ? "S0"+season : "S"+season)
    +(episode < 10 ? "E0"+episode : "E"+episode)}`
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  return episodeList.map(episode => {
    const div = document.createElement("div");
    div.classList.add("episode");
    div.setAttribute("id", episode.id);
    div.innerHTML = episode.summary;

    const h3 = document.createElement("h3");
    h3.textContent = `${episode.name} - ${setSeasonAndEpisodeNumber(episode.season, episode.number)}`;

    const img = document.createElement("img");
    img.src = episode.image.medium;

    div.append(h3, img);
    rootElem.appendChild(div);

    const label = document.querySelector(`label[for="${input.id}"]`);
    label.textContent = `Displaying ${episodeList.length}/${allEpisodesArray.length} episodes`;
  })
}

function searchEpisodeByKeyword (value) {
  const label = document.querySelector(`label[for="${input.id}"]`);

  const filteredEpisodes = allEpisodesArray.filter(episode =>
    episode.name.toLowerCase().includes(value.toLowerCase()) || episode.summary.toLowerCase().includes(value.toLowerCase())
  );

  return makePageForEpisodes(filteredEpisodes), createEpisodesDropList (filteredEpisodes),
  label.textContent = `Displaying ${filteredEpisodes.length}/${allEpisodesArray.length} episodes`;
}

function createEpisodesDropList (episodeList) {
  const select = document.querySelector("#episodesDroplist");
  if (isDisplayedShows) {
    select.style.display = "none";
    document.querySelector(`label[for="${select.id}"]`).style.display = "none";
  } else {
    select.style.display = "block";
    document.querySelector(`label[for="${select.id}"]`).style.display = "block";
  }
  select.replaceChildren();

  return episodeList.map(episode => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${setSeasonAndEpisodeNumber(episode.season, episode.number)} - ${episode.name}`;
    
    select.appendChild(option);
    });
}

function createShowsDroplist (showList) {
  const select = document.querySelector("#showsDroplist");
  select.replaceChildren();

  return showList.sort((a, b) => a.name.localeCompare(b.name))
  .map(show => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    
    select.appendChild(option);
  });
}

function makePageForShows (showList) {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  return showList.sort((a, b) => a.name.localeCompare(b.name))
  .filter(show => show.image)
  .map(show => {
    const div = document.createElement("div");
    div.classList.add("show");

    const h2 = document.createElement("h2");
    h2.textContent = show.name;

    h2.addEventListener("click", () => {
      isDisplayedShows = false;
      selectShows.style.display = "none";
      document.querySelector(`label[for="${selectShows.id}"]`).style.display = "none";
      document.querySelector(`label[for="${input.id}"]`).style.visibility = "visible";
      returnAllEpisodesButton.style.visibility = "visible";
      input.value = "";

      rootElem.replaceChildren();

      fetchEpisodesData(show.id)
        .then(() => {
          makePageForEpisodes(allEpisodesArray);
          createEpisodesDropList(allEpisodesArray);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    });

    const img = document.createElement("img");
    img.src = show.image.medium;

    const p = document.createElement("p");
    p.innerHTML = show.summary;

    const asideBlock = document.createElement("aside");
    asideBlock.innerHTML = `<b>Rated:</b> ${show.rating.average}
      <br><br><b>Genres</b>: ${show.genres.join(" | ")}
      <br><br><b>Status</b>: ${show.status}
      <br><br><b>Runtime</b>: ${show.runtime}`;

    div.append(h2, img, p, asideBlock);
    rootElem.appendChild(div);
  })
}

function searchShowByKeyword (value) {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  const filteredShows = getAllShows().filter(show =>
    show.name.toLowerCase().includes(value.toLowerCase()) 
    || show.summary.toLowerCase().includes(value.toLowerCase())
    || show.genres.join(" ").toLowerCase().includes(value.toLowerCase())
  );

  return makePageForShows(filteredShows), createShowsDroplist(filteredShows);
}

// ----------
// Adding event listeners
const input = document.querySelector("#input");
input.addEventListener("input", () => {
  if (isDisplayedShows) {
    searchShowByKeyword(input.value);
  } else {
    searchEpisodeByKeyword(input.value);
  }
});

const selectEpisodes = document.querySelector("#episodesDroplist");
selectEpisodes.addEventListener("change", () => {
  const filteredEpisode = allEpisodesArray.filter(episode => episode.id === +selectEpisodes.value);
  makePageForEpisodes(filteredEpisode);
});

const returnAllEpisodesButton = document.querySelector("#returnAllEpisodes");
returnAllEpisodesButton.addEventListener("click", () => {
  if (!isDisplayedShows) {
    selectEpisodes.value = allEpisodesArray[0].id;
    input.value = "";
    makePageForEpisodes(allEpisodesArray);
    createEpisodesDropList(allEpisodesArray);
  }
});

const selectShows = document.querySelector("#showsDroplist");
selectShows.addEventListener("change", () => {
  const filteredShow = getAllShows().filter(show => show.id === +selectShows.value);

  makePageForShows(filteredShow);
});

const returnAllShowsButton = document.querySelector("#returnAllShows").addEventListener("click", () => {
  input.value = "";
  selectShows.style.display = "block";
  selectShows.value = getAllShows().sort((a, b) => a.name.localeCompare(b.name))[0].id;
  isDisplayedShows = true;
  document.querySelector(`label[for="${selectShows.id}"]`).style.display = "block";
  document.querySelector(`label[for="${input.id}"]`).style.visibility = "hidden";
  document.querySelector(`label[for="${selectEpisodes.id}"]`).style.display = "none";
  selectEpisodes.style.display = "none";
  returnAllEpisodesButton.style.visibility = "hidden";
  
  makePageForShows(getAllShows());
  createShowsDroplist(getAllShows());
});