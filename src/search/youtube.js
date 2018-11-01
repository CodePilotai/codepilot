import { Observable } from 'rxjs'
import youtubeApiSearch from './utils/youtube-api-search'

export default ({ query, apiKey = process.env.YOUTUBE_API_KEY }) => {
  // ===
  // Initial fetch of results
  // ===

  return (
    youtubeApiSearch({ query: query.text, apiKey })
      .map(videos =>
        // Initial filtering of results
        videos.filter(video => {
          // Return only videos that we can see the title and id
          // for as we use these to display the video
          return video.title && video.id
        })
      )
      .flatMap(Observable.from)
      // ===
      // Final mapping of results
      // ===
      .map(video => ({
        results: {
          ...video,
          type: 'video',
          source: 'YouTube'
        }
      }))
      .catch(error => {
        console.warn(error)
      })
  )
}
