import { Observable } from 'rxjs'
// This is the node module that I (Cameron) created as nothing else available
// returned a promise. That being said, it could still use some work as it does
// not allow us to do anything other than search. Documentation for the module
// can be found here:
// https://github.com/CameronAdams777/youtube-search-promise#javascript-usage
import youtubeSearch from 'youtube-search-promise'
export default function youtubeApiSearch({ query, apiKey }) {
  return Observable.fromPromise(search(query, apiKey))
}

function search(query, apiKey) {
  // Parameters sent to 'youtube-search-promise' to dictate
  // what results we get back. In this case, we are sending our
  // api key as well as the max number of results that we want
  // to receive and nothing else.
  //
  // We are alotted a total of 1 million 'units' per day
  // and each result should be worth about 9 'units'. That means
  // we should be allowed something like 4000 searches per day
  // which should be okay for now. We will need auth for more functionality
  // down the road and therefore this should be fine for now. More information
  // for rate limits and quotas can be found here however:
  // https://developers.google.com/youtube/v3/getting-started#quota
  //
  // You can find a list of video category ids here:
  // https://gist.github.com/dgp/1b24bf2961521bd75d6c

  let params = {
    maxResults: 25,
    safeSearch: 'strict',
    type: 'video',
    key: apiKey
  }
  return youtubeSearch(query + '| dev | code', params).catch(error => {
    console.warn(`Error fetching results from YouTube API.`, error)
    return []
  })
}
