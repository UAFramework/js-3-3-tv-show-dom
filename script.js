window.onload = setup;

function setup() {
  fetchEpisodesData()
    .then(() => {
      makePageForEpisodes(allEpisodesArray);
      createEpisodesDropList(allEpisodesArray);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

let allEpisodesArray;
async function fetchEpisodesData() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    allEpisodesArray = await response.json();
    return allEpisodesArray;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  return episodeList.map(episode => {
    const div = document.createElement("div");
    div.classList.add("episode");
    div.setAttribute("id", `${episode.number < 10
      ? "S0"+episode.season+"E0"+episode.number 
      : "S0"+episode.season+"E"+episode.number}`);

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
    label.textContent = `Displaying ${episodeList.length}/${allEpisodesArray.length} episodes`;
  })
}

function searchEpisodeByKeyword (value) {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  const label = document.querySelector("label");

  const filteredEpisodes = allEpisodesArray.filter(episode =>
    episode.name.toLowerCase().includes(value.toLowerCase()) || episode.summary.toLowerCase().includes(value.toLowerCase())
  );

  return makePageForEpisodes(filteredEpisodes),
  label.textContent = `Displaying ${filteredEpisodes.length}/${allEpisodesArray.length} episodes`;
}

function createEpisodesDropList (episodeList) {
  return episodeList.map(episode => {
    const select = document.querySelector("select");

    const option = document.createElement("option");
    option.value = `${episode.number < 10
      ? "S0"+episode.season+"E0"+episode.number 
      : "S0"+episode.season+"E"+episode.number}`;

    option.textContent = `${episode.number < 10
      ? "S0"+episode.season+"E0"+episode.number 
      : "S0"+episode.season+"E"+episode.number} - ${episode.name}`;
    
    select.appendChild(option);

    //First attempt with anchors
    // const episodeLink = document.createElement("a");
    // episodeLink.href = `#${episode.number < 10
    //   ? "S0"+episode.season+"E0"+episode.number 
    //   : "S0"+episode.season+"E"+episode.number}`;

    // episodeLink.textContent = `${episode.number < 10
    //   ? "S0"+episode.season+"E0"+episode.number 
    //   : "S0"+episode.season+"E"+episode.number} - ${episode.name}`;    
    });
}

// ----------
// Adding event listeners
const input = document.querySelector("#input");
input.addEventListener("input", () => searchEpisodeByKeyword(input.value));

const select = document.querySelector("select");
select.addEventListener("change", () => {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  const filteredEpisode = allEpisodesArray.filter(episode => {
    const episodeId = `${episode.number < 10
      ? "S0"+episode.season+"E0"+episode.number 
      : "S0"+episode.season+"E"+episode.number}`;
    return episodeId === select.value;
  })
  makePageForEpisodes(filteredEpisode);
})

const returnAllEpisodesButton = document.querySelector("#returnAllEpisodes");
returnAllEpisodesButton.addEventListener("click", () => {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  select.value = "disabledOption";
  input.value = "";

  makePageForEpisodes(allEpisodesArray);
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