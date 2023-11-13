window.onload = setup;

function setup() {
  const allShows = getAllShows();
  const slicedArray = sliceArrayForPage (1, allShows);
  makePageForShows(slicedArray);
  createShowsDroplist(slicedArray);
  setPagination (allShows);
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

  return showList.map(show => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    
    select.appendChild(option);
  });
}

function makePageForShows (showList) {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  return showList.map(show => {
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
      input.style.display = "none";
      input.value = "";
      selectSeasons.style.display = "block";
      document.querySelector(`label[for="${selectSeasons.id}"]`).style.display = "block";
      loadMoreButton.style.display = "none"

      const paginationContainer = document.querySelector("#pagination");
      paginationContainer.replaceChildren();

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
    if (show.summary.length > 200) {
      const shortSummary = show.summary.slice(0, 200);
      const secontPartSummary = show.summary.slice(200);

      p.innerHTML = shortSummary + "...";
      
      const readMore = document.createElement("span");
      readMore.textContent = "Read more";
      readMore.classList.add("readMore");

      function readMoreEventHandler () {
        p.innerHTML = shortSummary + secontPartSummary;
        readMore.textContent = "Read less";
        p.appendChild(readMore);
        readMore.removeEventListener("click", readMoreEventHandler);
        readMore.addEventListener("click", readLessEventHandler);
      }

      function readLessEventHandler () {
        p.innerHTML = shortSummary + "...";
        readMore.textContent = "Read more";
        p.appendChild(readMore);
        readMore.removeEventListener("click", readLessEventHandler);
        readMore.addEventListener("click", readMoreEventHandler);
      }

      readMore.addEventListener("click", readMoreEventHandler);
      
      p.appendChild(readMore);
    } else {
        p.innerHTML = show.summary;
    }

    const castList = document.createElement("div");
    castList.classList.add("castList");

    const showCast = document.createElement("p");
    showCast.textContent = "Show cast";
    castList.appendChild(showCast);

    const showCastClickListener = () => {
      showCast.removeEventListener("click", showCastClickListener);
      showCast.textContent = "*click on actor's name to display all shows in which he/she appeared";
      showCast.classList.add('disabled-hover');

      fetchCastData(show.id)
      .then(() => {
        castForSpecificShow.map((actor, index) => {
          const actorSpan = document.createElement("span");
          index !== castForSpecificShow.length - 1 ?
            actorSpan.textContent = `${actor.person.name}, ` :
            actorSpan.textContent = actor.person.name;

          actorSpan.addEventListener("click", () => {
            const paginationContainer = document.querySelector("#pagination");
            paginationContainer.replaceChildren();
            fetchShowsWhereAppearedActor(actor.person.id)
            .then(() => {
              let arrayOfShowsId = showsWhereAppearedActor.map(show => {
                const partsOfUrl = show["_links"].show.href.split("/");
                return +partsOfUrl[partsOfUrl.length - 1];
              });
              const allShows = getAllShows();
              let filteredShows = allShows.filter(show => arrayOfShowsId.includes(show.id));
              makePageForShows(filteredShows);
              createShowsDroplist(filteredShows);
              const showHead = document.querySelector("#showHead");
              showHead.textContent = `Shows with ${actor.person.name}`;
            })
            .catch(error => {
              console.error("Error:", error);
            });
          });

          castList.appendChild(actorSpan);
        });
      })
      .catch(error => {
        console.error("Error:", error);
      });
    }

    showCast.addEventListener("click", showCastClickListener);
    
    const asideBlock = document.createElement("aside");
    asideBlock.innerHTML = `<b>Rated:</b> ${show.rating.average}
      <br><br><b>Genres</b>: ${show.genres.join(" | ")}
      <br><br><b>Status</b>: ${show.status}
      <br><br><b>Runtime</b>: ${show.runtime}`;

    div.append(h2, img, p, asideBlock, castList);
    rootElem.appendChild(div);
  })
}

function searchShowByKeyword (value) {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();
  const paginationContainer = document.querySelector("#pagination");
  paginationContainer.replaceChildren();

  const filteredShows = getAllShows().filter(show =>
    show.name.toLowerCase().includes(value.toLowerCase())
    || show.summary.toLowerCase().includes(value.toLowerCase())
    || show.genres.join(" ").toLowerCase().includes(value.toLowerCase())
  );
  const slicedArray = sliceArrayForPage(pageOptions.currentPage, filteredShows)

  makePageForShows(slicedArray),
  createShowsDroplist(slicedArray),
  setPagination (filteredShows);
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

let castForSpecificShow;
async function fetchCastData(showId) {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/cast`);
    castForSpecificShow = await response.json();
    return castForSpecificShow;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

let showsWhereAppearedActor;
async function fetchShowsWhereAppearedActor(actorId) {
  try {
    const response = await fetch(`https://api.tvmaze.com/people/${actorId}/castcredits`);
    showsWhereAppearedActor = await response.json();
    return showsWhereAppearedActor;
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
      document.querySelector(`label[for="${input.id}"]`).style.display = "block";
      document.querySelector(`label[for="${input.id}"]`).style.visibility = "visible";
      input.style.display = "block";
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

let pageOptions = {
  itemsPerPage: 15,
  currentPage: 1
}
function sliceArrayForPage (currentPage, items) {
  const startIndex = (currentPage - 1) * pageOptions.itemsPerPage;
  const endIndex = startIndex + pageOptions.itemsPerPage;
  return items.slice(startIndex, endIndex);
}

function setPagination (arr) {
  const paginationContainer = document.querySelector("#pagination");
  const totalPages = Math.ceil(arr.length / pageOptions.itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const paginationItem = document.createElement("span");
    paginationItem.textContent = i;
    paginationItem.classList.add("pageButton");
    
    if (i === pageOptions.currentPage) {
      paginationItem.classList.add("activePageButton");
    }

    paginationItem.addEventListener("click", () => {
      const previousActivePages = paginationContainer.querySelectorAll(".activePageButton");
      if (previousActivePages) {
        previousActivePages.forEach(element => {
          element.classList.remove("activePageButton");
        });
      }

      pageOptions.currentPage = i;
      const slicedArray = sliceArrayForPage(i, getAllShows());
      makePageForShows (slicedArray);
      createShowsDroplist (slicedArray);
      paginationItem.classList.add("activePageButton");

    });

    paginationContainer.appendChild(paginationItem);
  }
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
  const paginationContainer = document.querySelector("#pagination");
  paginationContainer.replaceChildren();
  const filteredShow = getAllShows().filter(show => show.id === +selectShows.value);

  makePageForShows(filteredShow);
});

const returnAllShowsButton = document.querySelector("#returnAllShows");
returnAllShowsButton.addEventListener("click", () => {
  input.value = "";
  selectShows.style.display = "block";
  selectShows.value = getAllShows().sort((a, b) => a.name.localeCompare(b.name))[0].id;
  options.isDisplayedShows = true;
  options.isDisplayedSeasons = false;
  options.isDisplayedEpisodes = false;
  pageOptions.currentPage = 1;
  document.querySelector(`label[for="${selectShows.id}"]`).style.display = "block";
  document.querySelector(`label[for="${input.id}"]`).style.visibility = "hidden";
  document.querySelector(`label[for="${input.id}"]`).style.display = "block";
  document.querySelector(`label[for="${selectEpisodes.id}"]`).style.display = "none";
  selectEpisodes.style.display = "none";
  returnAllEpisodesButton.style.visibility = "hidden";
  input.style.display = "block";
  selectSeasons.style.display = "none";
  document.querySelector(`label[for="${selectSeasons.id}"]`).style.display = "none";
  loadMoreButton.style.display = "block"

  const showHead = document.querySelector("#showHead");
  showHead.textContent = "List of All Shows";
  
  const allShows = getAllShows();
  const slicedArray = sliceArrayForPage (1, allShows);
  makePageForShows(slicedArray);
  createShowsDroplist(slicedArray);
  setPagination (allShows);
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

const loadMoreButton = document.querySelector("#loadMoreButton");
loadMoreButton.addEventListener("click", () => {
  const spanElements = document.querySelectorAll(".pageButton");

  const activeSpan = spanElements[pageOptions.currentPage - 1];
  activeSpan.classList.add("activePageButton");

  const loadedSpan = spanElements[pageOptions.currentPage];
  loadedSpan.classList.add("activePageButton");

  const concatedPages = sliceArrayForPage(pageOptions.currentPage, getAllShows()).concat(sliceArrayForPage(pageOptions.currentPage++, getAllShows()));
  
  
  makePageForShows (concatedPages);
  createShowsDroplist (concatedPages);
});