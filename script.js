//You can edit ALL of the code here
const rootDiv = document.getElementById("root");
const searchInput = document.getElementById("search");
const movieSelect = document.getElementById("movie-select");
const select = document.getElementById("select");
const allValue = "All";
const shows = getAllShows();

let defaultUrl = `https://api.tvmaze.com/shows/${shows[0].id}/episodes`;
let episodes = [];
let filteredEpisodes = [];

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
  select.innerHTML = "";
  let option = document.createElement("option");
  option.text = allValue;
  option.value = allValue;
  select.add(option);

  episodes.map((episode) => {
    let option = document.createElement("option");
    let episodeCode = formatEpisodeCode(episode.season, episode.number);
    option.text = `${episodeCode} - ${episode.name}`;
    option.value = episodeCode;
    select.add(option);
  });
}

function fillMovieSelect(movieSelectedValue = null) {
  movieSelect.innerHTML = "";
  shows.map((movie) => {
    let option = document.createElement("option");
    option.text = movie.name;
    option.value = movie.id;
    if (movieSelectedValue && movieSelectedValue == movie.id) {
      option.selected = true;
    }
    movieSelect.add(option);
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

select.addEventListener("change", function () {
  var selectedOption = select.options[select.selectedIndex];
  var targetSectionId = selectedOption.value;

  if (selectedOption.value === allValue) {
    filteredEpisodes = episodes;
  } else {
    filteredEpisodes = episodes.filter((episode) => {
      return (
        targetSectionId === formatEpisodeCode(episode.season, episode.number)
      );
    });
  }

  showEpisodes(filteredEpisodes);
  showEpisodesCount(episodes, filteredEpisodes);
});

movieSelect.addEventListener("change", function () {
  let selectedOption = movieSelect.options[movieSelect.selectedIndex];
  let targetId = selectedOption.value;
  let url = `https://api.tvmaze.com/shows/${targetId}/episodes`;

  fetchData(url, targetId);
});

function preparePage(movieSelectedValue = null) {
  showEpisodes(episodes);
  showEpisodesCount(episodes, filteredEpisodes);
  fillMovieSelect(movieSelectedValue);
  fillSelect();
}

function fetchData(url, movieSelectedValue = null) {
  fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network problems");
    }
    return response.json();
  })
  .then((data) => {
    episodes = data;
    filteredEpisodes = episodes;
    preparePage(movieSelectedValue);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
}

window.onload = fetchData(defaultUrl);
