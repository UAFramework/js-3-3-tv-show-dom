window.onload = setup;

function setup() {
  const allShows = getAllShows();
  makePageForShows(allShows);
  createShowsDroplist(allShows);
}

let options = {
  isDisplayedShows: true,
  isDisplayedSeasons: false,
  isDisplayedEpisodes: false
}

let allEpisodesArray;
async function fetchEpisodesData(seasonId) {
  try {
    const response = await fetch(`https://api.tvmaze.com/seasons/${seasonId}/episodes`);
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
    div.innerHTML = episode.summary && episode.summary.length !== 0 ? episode.summary : "Description not provided";

    const h3 = document.createElement("h3");
    h3.textContent = `${episode.name} - ${setSeasonAndEpisodeNumber(episode.season, episode.number)}`;

    const img = document.createElement("img");
    img.src = episode.image ? episode.image.medium : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png";

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
  select.replaceChildren();
  select.style.display = "block";
  document.querySelector(`label[for="${select.id}"]`).style.display = "block";

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
  .map(show => {
    const div = document.createElement("div");
    div.classList.add("show");

    const h2 = document.createElement("h2");
    h2.textContent = show.name;

    h2.addEventListener("click", () => {
      options.isDisplayedShows = false;
      options.isDisplayedSeasons = true;
      selectShows.style.display = "none";
      document.querySelector(`label[for="${selectShows.id}"]`).style.display = "none";
      document.querySelector(`label[for="${input.id}"]`).style.display = "none";
      returnAllEpisodesButton.style.visibility = "hidden";
      input.style.display = "none";
      input.value = "";
      selectSeasons.style.display = "block";
      document.querySelector(`label[for="${selectSeasons.id}"]`).style.display = "block";

      rootElem.replaceChildren();

      const showHead = document.querySelector("#showHead");
      showHead.textContent = show.name;

      fetchSeasonesData(show.id)
        .then(() => {
          makePageForSeasons(allSeasonsArray);
          createSeasonesDropList(allSeasonsArray);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    });

    const img = document.createElement("img");
    img.src = show.image ? show.image.medium : "https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png";

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

let allSeasonsArray;
async function fetchSeasonesData(showId) {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/seasons`);
    allSeasonsArray = await response.json();
    return allSeasonsArray;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

function makePageForSeasons (seasonList) {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  return seasonList.map(season => {
    const div = document.createElement("div");
    div.classList.add("season");
    div.setAttribute("id", season.id);
    div.innerHTML = season.summary && season.summary.length !== 0 ? season.summary : "Description not provided";

    const h3 = document.createElement("h3");
    h3.textContent = `Season ${season.number}`;

    h3.addEventListener("click", () => {
      options.isDisplayedSeasons = false;
      options.isDisplayedEpisodes = true;
      document.querySelector(`label[for="${input.id}"]`).style.visibility = "visible";
      returnAllEpisodesButton.style.visibility = "visible";
      input.value = "";
      selectSeasons.value = season.id;

      fetchEpisodesData(season.id)
        .then(() => {
          makePageForEpisodes(allEpisodesArray);
          createEpisodesDropList(allEpisodesArray);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    });

    const img = document.createElement("img");
    img.src = season.image ? season.image.medium : "https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png";

    div.append(h3, img);
    rootElem.appendChild(div);
  })
}

function createSeasonesDropList (seasonList) {
  const select = document.querySelector("#seasonsDroplist");
  select.replaceChildren();

  return seasonList.map(season => {
    const option = document.createElement("option");
    option.value = season.id;
    option.textContent = `Season ${season.number}`;
    
    select.appendChild(option);
    });
}

// ----------
// Adding event listeners
const input = document.querySelector("#input");
input.addEventListener("input", () => {
  if (options.isDisplayedShows) {
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
    selectEpisodes.value = allEpisodesArray[0].id;
    input.value = "";
    makePageForEpisodes(allEpisodesArray);
    createEpisodesDropList(allEpisodesArray);
});

const selectShows = document.querySelector("#showsDroplist");
selectShows.addEventListener("change", () => {
  const filteredShow = getAllShows().filter(show => show.id === +selectShows.value);

  makePageForShows(filteredShow);
});

const returnAllShowsButton = document.querySelector("#returnAllShows");
returnAllShowsButton.addEventListener("click", () => {
  input.value = "";
  selectShows.style.display = "block";
  selectShows.value = getAllShows().sort((a, b) => a.name.localeCompare(b.name))[0].id;
  options.isDisplayedShows = true;
  options.isDisplayedEpisodes = false;
  document.querySelector(`label[for="${selectShows.id}"]`).style.display = "block";
  document.querySelector(`label[for="${input.id}"]`).style.visibility = "hidden";
  document.querySelector(`label[for="${selectEpisodes.id}"]`).style.display = "none";
  selectEpisodes.style.display = "none";
  returnAllEpisodesButton.style.visibility = "hidden";
  input.style.display = "block";
  document.querySelector(`label[for="${input.id}"]`).style.display = "block";
  selectSeasons.style.display = "none";
  document.querySelector(`label[for="${selectSeasons.id}"]`).style.display = "none";

  const showHead = document.querySelector("#showHead");
  showHead.textContent = "";
  
  makePageForShows(getAllShows());
  createShowsDroplist(getAllShows());
});

const selectSeasons = document.querySelector("#seasonsDroplist");
selectSeasons.addEventListener("change", () => {
  if (options.isDisplayedSeasons) {
    const filteredSeason = allSeasonsArray.filter(season => season.id === +selectSeasons.value);
    makePageForSeasons(filteredSeason);
  } else {
    fetchEpisodesData(selectSeasons.value)
      .then(() => {
        makePageForEpisodes(allEpisodesArray);
        createEpisodesDropList(allEpisodesArray);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
});