import parseDependencies from './parse-dependencies'

jest.mock('./read-file', () => filePath => {
  const { Observable } = require('rxjs')
  if (filePath === 'good/package.json') {
    return Observable.of(`
      {
        "name": "my-proj",
        "version": "v0",
        "dependencies": {
          "dep-1": "v1",
          "dep-2": "v2"
        },
        "devDependencies": {
          "dep-3": "v3",
          "dep-4": "v4"
        }
      }
    `)
  }
  if (filePath === 'bad/package.json') {
    return Observable.of(`bad package.json content`)
  }
  return Observable.of(`bad content`)
})

describe('@search/utils/parse-dependencies', () => {
  it('works with a valid package.json', done => {
    const next = jest.fn(dependencies => {
      try {
        expect(dependencies).toEqual({
          packageName: 'my-proj',
          version: 'v0',
          dependencies: {
            'dep-1': 'v1',
            'dep-2': 'v2'
          },
          devDependencies: {
            'dep-3': 'v3',
            'dep-4': 'v4'
          }
        })
      } catch (error) {
        done.fail(error)
      }
    })
    parseDependencies('good/package.json').subscribe({
      next,
      complete() {
        try {
          expect(next).toHaveBeenCalledTimes(1)
        } catch (error) {
          done.fail(error)
        }
        done()
      }
    })
  })

  it.skip('emits null dependencies with a warning when a parsing error occurs', done => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const next = jest.fn(dependencies => {
      try {
        expect(dependencies).toEqual({
          packageName: null,
          version: null,
          dependencies: null,
          devDependencies: null
        })
      } catch (error) {
        done.fail(error)
      }
    })
    parseDependencies('file-with-no-parser').subscribe({
      next,
      complete() {
        try {
          expect(next).toHaveBeenCalledTimes(1)
          expect(consoleWarn).toBeCalledWith(
            `Dependencies could not be parsed for file: "file-with-no-parser".`,
            `Could not find appropriate dependencies parser.`
          )
          consoleWarn.mockRestore()
        } catch (error) {
          done.fail(error)
        }
        done()
      }
    })
  })

  it.skip('emits null dependencies with a warning when no valid parser exists', done => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const next = jest.fn(dependencies => {
      try {
        expect(dependencies).toEqual({
          packageName: null,
          version: null,
          dependencies: null,
          devDependencies: null
        })
      } catch (error) {
        done.fail(error)
      }
    })
    parseDependencies('bad/package.json').subscribe({
      next,
      complete() {
        try {
          expect(next).toHaveBeenCalledTimes(1)
          expect(consoleWarn.mock.calls[0][0]).toEqual(
            `Dependencies could not be parsed for file: "bad/package.json".`
          )
          expect(consoleWarn.mock.calls[0][1].name).toEqual('SyntaxError')
          consoleWarn.mockRestore()
        } catch (error) {
          done.fail(error)
        }
        done()
      }
    })
  })
})
