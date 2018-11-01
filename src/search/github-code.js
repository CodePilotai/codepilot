import fs from 'graceful-fs'
import { Observable } from 'rxjs'
import githubApiCodeSearch from './utils/github-api-code-search'
import getGithubRepo from './utils/get-github-repo'
import codeSearchQuery from './utils/code-search-query'
import downloadFile from './utils/download-file'
import readFile from './utils/read-file'
import addDependencies from './utils/add-dependencies'
import getMatchedLines from './utils/get-matched-lines'
import filePathFilter from './utils/file-path-filter'
import fileContentFilter from './utils/file-content-filter'

export default query => {
  return (
    // ===
    // Initial fetch of results
    // ===

    githubApiCodeSearch({
      hostAddress: query.hostAddress,
      query: codeSearchQuery(query),
      page: query.page,
      token: query.hostAddress
        ? query.apiTokens.githubEnterpriseToken
        : query.apiTokens.githubToken
    })
      // ===
      // Initial filtering of results
      // ===

      .filter(file => filePathFilter(file.relativePath))

      // ===
      // Get extra info/resources for each result
      // ===

      .flatMap(
        file =>
          getGithubRepo({
            hostAddress: query.hostAddress,
            owner: file.context.repo.owner.name,
            name: file.context.repo.name,
            token: query.hostAddress
              ? query.apiTokens.githubEnterpriseToken
              : query.apiTokens.githubToken
          }),
        (file, repo) => ({
          ...file,
          repo,
          accessToken: `bearer ${
            query.hostAddress
              ? query.apiTokens.githubEnterpriseToken
              : query.apiTokens.githubToken
          }`
        })
      )
      .delayWhen(file =>
        downloadFile(file.downloadUrl, file.localPath, {
          headers: {
            Authorization: file.accessToken
          }
        })
      )
      .filter(file => fs.existsSync(file.localPath))
      .flatMap(
        file => readFile(file.localPath, { maxLength: 100000 }),
        (file, body) => ({
          ...file,
          body,
          lines: getMatchedLines(body, query.text).map(line => ({
            file: {
              ...file,
              line
            }
          }))
        })
      )
      .pipe(addDependencies)

      // ===
      // Filter based on extra info/resources
      // ===

      .filter(file => fileContentFilter(file.body))
      .distinct(file => file.body)

      // ===
      // Final mapping of results
      // ===

      .map(file => ({
        results: {
          ...file,
          type: 'file',
          baseDirectory: file.localDirectory,
          key: file.localPath,
          source: 'GitHub Code',
          path: file.localPath,
          relativePath: file.path
        }
      }))

      // ===
      // Error handling
      // ===

      .catch(error =>
        Observable.of({
          responseMeta: error.responseMeta
        })
      )
  )
}
