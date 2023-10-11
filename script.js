window.onload = setup;

function setup() {
  fetchEpisodesData(getAllShows().sort((a, b) => a.name.localeCompare(b.name))[0].id)
    .then(() => {
      makePageForEpisodes(allEpisodesArray);
      createEpisodesDropList(allEpisodesArray);
      createShowsDroplist(getAllShows());
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

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

  return episodeList.map(episode => {
    const div = document.createElement("div");
    div.classList.add("episode");
    div.setAttribute("id", setSeasonAndEpisodeNumber(episode.season, episode.number));

    const h3 = document.createElement("h3");
    h3.textContent = `${episode.name} - ${setSeasonAndEpisodeNumber(episode.season, episode.number)}`;

    const img = document.createElement("img");
    img.src = episode.image.medium;

    const p = document.createElement("p");
    p.textContent = episode.summary;

    div.append(h3, img, p);
    rootElem.appendChild(div);

    const label = document.querySelector("#inputLabel");
    label.textContent = `Displaying ${episodeList.length}/${allEpisodesArray.length} episodes`;
  })
}

function searchEpisodeByKeyword (value) {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  const label = document.querySelector("#inputLabel");

  const filteredEpisodes = allEpisodesArray.filter(episode =>
    episode.name.toLowerCase().includes(value.toLowerCase()) || episode.summary.toLowerCase().includes(value.toLowerCase())
  );

  return makePageForEpisodes(filteredEpisodes),
  label.textContent = `Displaying ${filteredEpisodes.length}/${allEpisodesArray.length} episodes`;
}

function createEpisodesDropList (episodeList) {
  const select = document.querySelector("#episodesDroplist");
  select.replaceChildren();

  return episodeList.map(episode => {
    const option = document.createElement("option");
    option.value = setSeasonAndEpisodeNumber(episode.season, episode.number);
    option.textContent = `${setSeasonAndEpisodeNumber(episode.season, episode.number)} - ${episode.name}`;
    
    select.appendChild(option);
    });
}

function createShowsDroplist (showList) {
  return showList.sort((a, b) => a.name.localeCompare(b.name))
  .map(show => {
    const select = document.querySelector("#showsDroplist");

    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    
    select.appendChild(option);
  });
}

// ----------
// Adding event listeners
const input = document.querySelector("#input");
input.addEventListener("input", () => searchEpisodeByKeyword(input.value));

const selectEpisodes = document.querySelector("#episodesDroplist");
selectEpisodes.addEventListener("change", () => {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  const filteredEpisode = allEpisodesArray.filter(episode => {
    const episodeId = setSeasonAndEpisodeNumber(episode.season, episode.number);
    return episodeId === selectEpisodes.value;
  })
  makePageForEpisodes(filteredEpisode);
})

const returnAllEpisodesButton = document.querySelector("#returnAllEpisodes");
returnAllEpisodesButton.addEventListener("click", () => {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  selectEpisodes.value = setSeasonAndEpisodeNumber(allEpisodesArray[0].season, allEpisodesArray[0].number);
  input.value = "";

  makePageForEpisodes(allEpisodesArray);
})

const selectShows = document.querySelector("#showsDroplist")
selectShows.addEventListener("change", () => {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  allEpisodesArray = fetchEpisodesData(selectShows.value)
    .then(() => {
      makePageForEpisodes(allEpisodesArray);
      createEpisodesDropList(allEpisodesArray);
    })
    .catch(error => {
      console.error("Error:", error);
    });
})

// The way to move through page to selected episode

// function createEpisodesDropList(episodeList) {
//   const select = document.querySelector("#selectEpisodes");

//   select.addEventListener("change", function () {
//     const selectedOption = select.options[select.selectedIndex];
//     const targetSelector = selectedOption.getAttribute("data-target");

//     if (targetSelector) {
//       const targetDiv = document.querySelector(targetSelector);
//       if (targetDiv) {
//         // Scroll to the target div
//         targetDiv.scrollIntoView({ behavior: "smooth" });
//       }
//     }
//   });

//   episodeList.forEach((episode) => {
//     const option = document.createElement("option");
//     const optionValue = episode.number < 10 ? `S0${episode.season}E0${episode.number}` : `S0${episode.season}E${episode.number}`;
//     option.value = optionValue;
//     option.textContent = `${optionValue} - ${episode.name}`;
//     // Set the data-target attribute with the div selector
//     option.setAttribute("data-target", `#${optionValue}`);
//     select.appendChild(option);
//   });
// }