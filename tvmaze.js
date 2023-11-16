"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodesList = $("#episodesList");
const $searchForm = $("#searchForm");

const TV_MAZE_BASE_URL = "http://api.tvmaze.com";
const MISSING_IMAGE_URL = "https://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  //console.log("Search param is ", term);

  const query = new URLSearchParams({
    q: term
  });

  const response = await fetch(`${TV_MAZE_BASE_URL}/search/shows/?${query}`);
  const showsDataFromAPI = await response.json();

  const showsInfo = [];
  for (let showSearchResult of showsDataFromAPI) {
    console.log(showSearchResult);
    const showInfoObj = {
      id: showSearchResult.show.id,
      name: showSearchResult.show.name,
      summary: showSearchResult.show.summary,
    };

    //console.log("obj.show.image = ", obj.show.image);

    if (showSearchResult.show.image === null) {
      showInfoObj["image"] = MISSING_IMAGE_URL;
    } else {
      showInfoObj["image"] = showSearchResult.show.image.medium;
    }
    showsInfo.push(showInfoObj);
  }

  //image: obj.show.image.medium
  //console.log("Search result is ", resource, "data=", data);
  //console.log("showInfo = ", showInfo);
  return showsInfo;

}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src= "${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  //$episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const episodeResponse =
    await fetch(`${TV_MAZE_BASE_URL}/shows/${id}/episodes`);
  const episodeDataFromAPI = await episodeResponse.json();

  const episodesInfo = []
  for (const episodeSearchResult of episodeDataFromAPI){
    const episodeInfoObj = {
      id: episodeSearchResult.id,
      name: episodeSearchResult.name,
      season: episodeSearchResult.season,
      number: episodeSearchResult.number
    }
    episodesInfo.push(episodeInfoObj);
  }
  console.log("episodesInfo = ", episodesInfo);

  return episodesInfo;
}

/** Write a clear docstring for this function... */

function displayEpisodes(episodes) {
  for (let episode of episodes){
    console.log(episode);
    $episodesList.append(`<li>${episode.name} (season ${episode.season}
        , number ${episode.number})</li>`);
  }
}

// add other functions that will be useful / match our structure & design
