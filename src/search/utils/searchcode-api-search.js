import path from 'path'
import { Observable } from 'rxjs'
import request from 'superagent'
import createTmpDirectory from './create-tmp-directory'
import detectLanguage from '@helpers/detect-language'

export default function searchcodeApiSearch({ query }) {
  return Observable.combineLatest(
    createTmpDirectory('searchcode-files'),
    search()
  ).flatMap(([tmpDirectory, response]) =>
    response.body.results.map(file => {
      const baseDirectory = path.join(
        tmpDirectory,
        file.repo.replace(/\W+/g, '-'),
        file.location
      )
      const localPath = path.join(baseDirectory, file.filename)
      return {
        ...file,
        source: 'Searchcode',
        type: 'file',
        key: localPath,
        path: localPath,
        baseDirectory,
        relativePath: file.location,
        downloadUrl: `https://searchcode.com/codesearch/raw/${file.id}/`,
        language: detectLanguage({ language: file.language, path: localPath })
      }
    })
  )

  function search() {
    return Observable.fromPromise(
      request
        .get('https://searchcode.com/api/codesearch_I/')
        .query({ q: query.text })
        .then(response => {
          if (!response.text || response.text === 'null') {
            console.warn(`Error fetching results from Searchcode API.`)
            return { body: { results: [] } }
          }
          return response
        })
        .catch(error => {
          console.warn(`Error fetching results from Searchcode API.`, error)
          return { body: { results: [] } }
        })
    )
  }
}
