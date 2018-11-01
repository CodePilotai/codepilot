import path from 'path'
import { Observable } from 'rxjs'
import createTmpDirectory from './create-tmp-directory'
import githubApiGet from './github-api-get'
import githubResponseMeta from './github-response-meta'

export default function githubApiCodeSearch({
  hostAddress,
  query,
  page,
  token
}) {
  return Observable.combineLatest(
    createTmpDirectory('github-code-files'),
    search()
  ).flatMap(([tmpDirectory, response]) =>
    response.body.items.map(item => {
      const context = {
        html_url: item.html_url,
        repo: {
          url: item.repository.html_url,
          name: item.repository.name,
          description: item.repository.description,
          isFork: item.repository.fork,
          owner: {
            url: item.repository.owner.html_url,
            // Will be "User" or "Organization"
            type: item.repository.owner.type,
            name: item.repository.owner.login
          }
        }
      }

      return {
        ...item,
        ...getUrls(),
        ...getFileInfo(),
        context,
        tmpDirectory,
        responseMeta: githubResponseMeta(response)
      }

      function getUrls() {
        const urlPartials = item.html_url.split('/')
        const downloadPartial = hostAddress
          ? `${hostAddress}/raw/${urlPartials[3]}/${urlPartials[4]}/${
              urlPartials[6]
            }`
          : `https://raw.githubusercontent.com/${urlPartials[3]}/${
              urlPartials[4]
            }/${urlPartials[6]}`

        return {
          downloadUrl: encodeURI(`${downloadPartial}/${item.path}`),
          packageJsonUrl: encodeURI(`${downloadPartial}/package.json`)
        }
      }

      function getFileInfo() {
        const fileName = item.name.replace(/[:~#%*{}\\<>?/+|"]/g, '')
        const filePath = item.path.replace(/[:~#%*{}\\<>?+|"]/g, '')
        const localPath = path.join(
          tmpDirectory,
          context.repo.owner.name,
          context.repo.name,
          filePath
        )

        return {
          localPath,
          name: fileName,
          path: filePath,
          localDirectory: localPath.slice(0, localPath.length - name.length),
          packagePath: path.join(
            tmpDirectory,
            context.repo.owner.name,
            context.repo.name,
            'package.json'
          )
        }
      }
    })
  )

  function search() {
    return Observable.fromPromise(
      githubApiGet({
        hostAddress: hostAddress,
        endpoint: `search/code?page=${page}&per_page=15`,
        params: {
          q: query
        },
        token: token,
        source: 'GitHub Code'
      })
    ).catch(error => {
      const responseMeta = githubResponseMeta(error.response)
      console.warn(`Error fetching results from GitHub Code API.`, responseMeta)
      return Observable.throw({ responseMeta })
    })
  }
}
