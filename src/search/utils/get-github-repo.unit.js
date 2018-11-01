require('jest-playback').setup(__dirname)

jest.mock('@state/store', () => ({
  dispatch: jest.fn()
}))

describe('@search/utils/get-github-repo', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('returns object with owner, name, and fullName when all fetches fail', done => {
    jest.doMock('./get-github-repo-from-github-graphql', () => () =>
      require('rxjs').Observable.throw()
    )
    const next = jest.fn(repo => {
      try {
        expect(repo).toEqual({
          owner: 'foo',
          name: 'bar',
          fullName: 'foo/bar'
        })
      } catch (error) {
        done.fail(error)
      }
    })
    require('./get-github-repo')
      .default({
        owner: 'foo',
        name: 'bar'
      })
      .subscribe({
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

  it('returns the github-graphql object', done => {
    jest.doMock('./get-github-repo-from-github-graphql', () => () =>
      require('rxjs').Observable.of({ description: 'repo from github-graphql' })
    )
    const next = jest.fn(repo => {
      try {
        expect(repo).toEqual({
          owner: 'foo',
          name: 'bar',
          fullName: 'foo/bar',
          description: 'repo from github-graphql'
        })
      } catch (error) {
        done.fail(error)
      }
    })
    require('./get-github-repo')
      .default({
        owner: 'foo',
        name: 'bar'
      })
      .subscribe({
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
