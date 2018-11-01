import fs from 'graceful-fs'
import path from 'path'
import { Observable } from 'rxjs'
import detectLanguage from '@helpers/detect-language'
import uniqBy from 'lodash/uniqBy'
import githubApiCommitSearch from './utils/github-api-commit-search'
import githubApiGet from './utils/github-api-get'
import downloadFile from './utils/download-file'
import parseDependencies from './utils/parse-dependencies'

export default query => {
  return (
    // ===
    // Initial fetch of results
    // ===

    githubApiCommitSearch({
      query: query.text,
      token: query.apiTokens.githubToken
    })
      // ===
      // Initial filtering of results
      // ===

      // Filter out commits with the same SHA
      .distinct(commit => commit.sha)

      // ===
      // Get extra info/resources for each result
      // ===

      .flatMap(
        // Get detailed information for each commit
        commit =>
          Observable.fromPromise(
            githubApiGet({
              endpoint: commit.apiUrl,
              token: query.apiTokens.githubToken,
              source: 'GitHub Commits'
            }).catch(() => ({ body: { files: [] } }))
          ),
        (commit, response) => ({
          ...commit,
          files: uniqBy(
            response.body.files.map(commitFilesMapper(commit.localDirectory)),
            'path'
          )
        })
      )
      // Filter out commits with no accessible files
      // Filter out files that don’t have the `raw_url` property set
      .map(commit => ({
        ...commit,
        files: commit.files
          .filter(file => file.raw_url)
          // Filter out files without any changes which
          // at this point mean those would be empty files
          .filter(file => file.changes)
      }))
      .filter(commit => commit.files.length)
      // Wait for all files to be downloaded and saved as temporary files
      .delayWhen(commit =>
        Observable.forkJoin(
          downloadFile(commit.packageJsonUrl, commit.packagePath),
          Observable
            // Create a stream for each file inside the commit
            .from(commit.files)
            // Download and save the file
            .delayWhen(file => downloadFile(file.raw_url, file.path))
        )
      )
      .flatMap(
        commit => parseDependencies(commit.packagePath),
        (commit, dependencyData) => ({ ...commit, ...dependencyData })
      )

      // ===
      // Filter based on extra info/resources
      // ===

      // Filter out any files that haven't correctly downloaded.
      .map(commit => ({
        ...commit,
        files: commit.files.filter(file => fs.existsSync(file.path))
      }))
      // If the previous returned no existing files, remove the commit
      .filter(commit => commit.files.length)

      // ===
      // Final mapping of results
      // ===

      .map(commit => ({ results: commit }))

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

function commitFilesMapper(localDirectory) {
  return file => {
    const trueFileName = file.filename.substring(
      file.filename.lastIndexOf('/') + 1,
      file.filename.length
    )
    const commitLocalPath = path.join(localDirectory, trueFileName)
    return {
      ...file,
      path: commitLocalPath,
      language: detectLanguage({ path: commitLocalPath }),
      type: 'commit',
      source: 'GitHub Commits'
    }
  }
}
