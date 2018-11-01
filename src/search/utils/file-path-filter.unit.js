import filePathFilter from './file-path-filter'

describe('@search/utils/file-path-filter', () => {
  it('filters out .lock files', () => {
    const shouldInclude = filePathFilter('./yarn.lock')
    expect(shouldInclude).toEqual(false)
  })

  it('filters out .min. files', () => {
    const shouldInclude = filePathFilter('./app.min.js')
    expect(shouldInclude).toEqual(false)
  })

  it('filters out .dll files', () => {
    const shouldInclude = filePathFilter('./lib.dll')
    expect(shouldInclude).toEqual(false)
  })

  it('filters out .exe files', () => {
    const shouldInclude = filePathFilter('./lib.exe')
    expect(shouldInclude).toEqual(false)
  })

  it('filters out files in dist directories', () => {
    const shouldInclude = filePathFilter('./dist/app.js')
    expect(shouldInclude).toEqual(false)
  })

  it('filters out files in cache directories', () => {
    const shouldInclude = filePathFilter('./cache/app.js')
    expect(shouldInclude).toEqual(false)
  })

  it('filters out files in tmp directories', () => {
    const shouldInclude = filePathFilter('./tmp/app.js')
    expect(shouldInclude).toEqual(false)
  })
})
