import path from 'path'
import { spawn } from 'child_process'
import { rgPath } from 'vscode-ripgrep'

// These or at least many of them will likely be configurable
// as settings in the future.
const max = {
  results: 500,
  lineLength: 500,
  resultsPerFile: 100,
  directoryDepth: 1000,
  fileSize: '500K'
}

export default query => {
  let rgArgs = [
    '--max-count',
    query.resultsPerFile || max.resultsPerFile,
    '--max-filesize',
    max.fileSize,
    '--maxdepth',
    max.directoryDepth,
    '--max-columns',
    max.lineLength,
    '--color',
    'never',
    '--column',
    '--line-number',
    '--smart-case'
  ]

  // Hard-coding in some ignore globs for now, will eventually
  // be a setting.
  ;[
    // Non-source file extensions
    '*.lock',
    '*.min.*',
    // Non-source folders
    'dist',
    'cache',
    'tmp',
    // Non-code folders
    'Movies',
    'Music',
    'Pictures',
    // Windows system folders
    'AppData',
    'Windows',
    // macOS/Linux system folders
    'var',
    'etc',
    'usr',
    'net',
    'opt',
    'sbin',
    'bin',
    'cores',
    'System',
    'Library',
    'Application Support',
    'Caches',
    'Volumes',
    'Network',
    'User Information',
    'Volumes'
  ].forEach(glob => {
    rgArgs.push('--glob', '!**/' + glob)
  })

  if (query.includeGlob) {
    rgArgs.push('--glob', query.includeGlob)
  }
  if (query.excludeGlob) {
    rgArgs.push('--glob', '!' + query.excludeGlob)
  }

  if (!query.useRegex && query.matchWholeWord) {
    rgArgs.push('--word-regexp')
  }

  if (query.useRegex) {
    rgArgs.push('--regexp', query.text)
  } else {
    rgArgs.push('--fixed-strings')
  }

  if (query.rgArgs) {
    rgArgs.push(...query.rgArgs)
  }

  rgArgs.push('--', query.text, './')

  return Promise.all(
    query.directories.map(directory =>
      runLocalSearch(
        {
          ...query,
          directory
        },
        rgArgs
      )
    )
  ).then(allResults =>
    allResults.reduce(
      (sum, directoryResults) => ({
        results: sum.results.concat(directoryResults.results)
      }),
      { results: [] }
    )
  )
}

function runLocalSearch(query, rgArgs) {
  return new Promise((resolve, reject) => {
    const searchData = {
      results: []
    }

    const binaryPath =
      process.env.NODE_ENV === 'production'
        ? process.env.SPECTRON
          ? path.resolve(__dirname, '../../node_modules/vscode-ripgrep/bin/rg')
          : rgPath
              .replace(/\basar\b/, 'asar.unpacked')
              .replace('/dist_electron/', '/node_modules/vscode-ripgrep/')
        : path.resolve(require.resolve('vscode-ripgrep'), '../../bin/rg')

    const searchProcess = spawn(binaryPath, rgArgs, { cwd: query.directory })

    let stdout = ''
    searchProcess.stdout.on('data', data => {
      stdout += data.toString()
      if (stdout.trim().split('\n').length >= max.results) {
        searchProcess.kill()
      }
    })

    searchProcess.stderr.on('data', data => {
      data = data.toString()
      if (searchData.error) {
        searchData.error.message += data
      } else {
        searchData.error = {
          source: 'ripgrep',
          message: data
        }
      }
    })

    searchProcess.on('error', error => {
      console.error(error)
      const message = 'Error running ripgrep: ' + error
      searchData.error = {
        source: 'codepilot',
        message
      }
    })

    searchProcess.on('close', exitCode => {
      resolveSearchData()
    })

    function resolveSearchData() {
      searchData.results = parseResults(query, stdout)
      if (searchData.error) {
        const ripgrepErrorMessages = searchData.error.message.trim().split('\n')
        const errorIgnoreRegex = new RegExp(
          // If messages contain these strings,
          // we filter them out so they're never
          // passed on to the frontend.
          '(?:' +
            [
              'process cannot access the file',
              'no files were searched',
              'bad file descriptor',
              'not a directory',
              'access is denied',
              'permission denied',
              'error parsing glob'
            ].join('|') +
            ')',
          // Match case-insensitively
          'i'
        )
        // Filter out the errors we know aren't fatal.
        searchData.error.message = ripgrepErrorMessages
          .filter(message => {
            return !errorIgnoreRegex.test(message)
          })
          .join('\n')
        // Set the error to null if all errors
        // have been filtered out.
        if (!searchData.error.message) {
          searchData.error = null
        }
      }
      resolve(searchData)
    }
  })
}

function parseResults(query, stdout) {
  stdout = stdout.trim()

  if (!stdout) {
    return []
  }

  const lines = stdout.split('\n')
  const results = lines
    .map(line => parseResult(query, line))
    .filter(result => !/omitted long line/i.test(result.file.line.body))

  if (results.length > max.results) {
    results.length = max.results
  }
  return results
}

function parseResult(query, line) {
  const infoChunks = line.split(':')
  const relativePath = infoChunks.shift()
  let context

  if (query.fileContexts) {
    if (query.fileContexts[path.join(query.directory, relativePath)]) {
      context = query.fileContexts[path.join(query.directory, relativePath)]
    }
  }
  const result = {
    type: 'file',
    file: {
      source: query.source || 'Local',
      baseDirectory: query.directory,
      path: path.join(query.directory, relativePath),
      relativePath,
      line: {
        number: parseInt(infoChunks.shift()),
        column: parseInt(infoChunks.shift()),
        body: infoChunks.join(':').trim(),
        match: query.text
      },
      context: context
    }
  }

  result.key = [
    result.type,
    result.file.path,
    result.file.line.number,
    result.file.line.column
  ].join(':')

  return result
}
