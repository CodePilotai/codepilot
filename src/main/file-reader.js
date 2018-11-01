import fs from 'fs'
let latestReadStream

export default function fileReader(options, sender) {
  const { file } = options

  if (!file || !file.path) {
    handleError(file)
    return
  }

  let content = ''

  if (latestReadStream) {
    latestReadStream.destroy()
  }

  latestReadStream = fs
    .createReadStream(file.path)
    .on('data', chunk => {
      content += chunk
    })
    .on('end', () => {
      latestReadStream = null
      sender.send('file-reader-data', {
        file,
        text: content
      })
    })
    .on('error', handleError)

  function handleError() {
    latestReadStream.destroy()
    latestReadStream = null
    sender.send('file-reader-error', {
      file: file,
      text: 'Could not read the file.'
    })
  }
}
