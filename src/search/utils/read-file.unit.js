import readFile from './read-file'

describe('@search/utils/read-file', () => {
  it('correctly reads a file', done => {
    const next = jest.fn(content => {
      try {
        expect(content).toContain(`describe('@search/utils/read-file', () => {`)
      } catch (error) {
        done.fail(error)
      }
    })
    readFile(__filename).subscribe({
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

  it('emits empty content and warns when trying to read a non-existant file', done => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const next = jest.fn(content => {
      try {
        expect(content).toEqual('')
      } catch (error) {
        done.fail(error)
      }
    })
    readFile('non-existant-file').subscribe({
      next,
      complete() {
        try {
          expect(next).toHaveBeenCalledTimes(1)
          expect(consoleWarn).toHaveBeenCalledWith(
            `Could not read file: "non-existant-file".`
          )
          consoleWarn.mockRestore()
        } catch (error) {
          done.fail(error)
        }
        done()
      }
    })
  })

  it('emits an error when trying to read a non-existant file with emitError option', done => {
    readFile('non-existant-file', { emitError: true }).subscribe({
      error(error) {
        try {
          expect(error.message).toEqual(
            `ENOENT: no such file or directory, open 'non-existant-file'`
          )
        } catch (error) {
          done.fail(error)
        }
        done()
      }
    })
  })
})
