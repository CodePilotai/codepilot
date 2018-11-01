import path from 'path'
import fs from 'graceful-fs'
import createTmpDirectory from './create-tmp-directory'
import downloadFile from './download-file'

require('jest-playback').setup(__dirname)

describe('@search/utils/download-file', () => {
  let testFilePath
  beforeEach(done => {
    createTmpDirectory('test').subscribe({
      next: dir => {
        testFilePath = path.join(dir, 'test')
        done()
      }
    })
  })

  it('warns when it fails to download a file', done => {
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(error => {
        try {
          expect(error.message).toMatch('Error downloading file')
        } catch (error) {
          done.fail(error)
        }
      })
    downloadFile('invalid-url', testFilePath).subscribe({
      complete() {
        try {
          expect(consoleWarn).toHaveBeenCalled()
        } catch (error) {
          done.fail(error)
        }
        consoleWarn.mockRestore()
        done()
      }
    })
  })

  it('emits an error when it fails to download a file with failOnError', () => {
    downloadFile('invalid-url', testFilePath, {
      emitError: true
    }).subscribe({
      error(error) {
        expect(error.message).toMatch('Error downloading file')
      }
    })
  })

  it('successfully downloads a file with a valid URL', done => {
    const next = jest.fn(downloadPath => {
      try {
        expect(downloadPath).toEqual(testFilePath)
        expect(fs.existsSync(downloadPath)).toEqual(true)
        expect(
          fs.readFileSync(downloadPath, { encoding: 'utf8' })
        ).toMatchSnapshot()
      } catch (error) {
        done.fail(error)
      }
    })
    downloadFile('https://jsonplaceholder.typicode.com/todos/1', testFilePath, {
      emitError: true
    }).subscribe({
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
})
