import createTmpDirectory from './create-tmp-directory'

describe('@search/utils/create-tmp-directory', () => {
  it('creates a tmp directory', done => {
    const next = jest.fn(tmpDir => {
      try {
        expect(tmpDir).toContain('test')
      } catch (error) {
        done.fail(error)
      }
    })
    createTmpDirectory('test').subscribe({
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
