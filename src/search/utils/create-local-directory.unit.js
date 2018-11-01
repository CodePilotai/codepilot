import path from 'path'
import createLocalDirectory from './create-local-directory'
import createTmpDirectory from './create-tmp-directory'

describe('@search/utils/create-local-directory', () => {
  let tmpDir
  beforeEach(done => {
    createTmpDirectory('test').subscribe({
      next: dir => {
        tmpDir = dir
        done()
      }
    })
  })

  it('creates a dir when passed a string path', done => {
    const testDir = path.join(tmpDir, 'test')
    const next = jest.fn(createdDir => {
      try {
        expect(createdDir).toEqual(testDir)
      } catch (error) {
        done.fail(error)
      }
    })
    createLocalDirectory(testDir).subscribe({
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

  it('creates a joined dir when passed multiple string paths', done => {
    const next = jest.fn(createdDir => {
      try {
        expect(createdDir).toEqual(path.join(tmpDir, 'test'))
      } catch (error) {
        done.fail(error)
      }
    })
    createLocalDirectory(tmpDir, 'test').subscribe({
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
