import downloadFile from './download-file'
import parseDependencies from './parse-dependencies'

export default function getDependencies(observable) {
  return observable
    .delayWhen(item =>
      downloadFile(item.packageJsonUrl, item.packagePath, {
        headers: {
          Authorization: item.accessToken
        }
      })
    )
    .flatMap(
      item => parseDependencies(item.packagePath),
      (item, dependencyData) => ({ ...item, ...dependencyData })
    )
}
