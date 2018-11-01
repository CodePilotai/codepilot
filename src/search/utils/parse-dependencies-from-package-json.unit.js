import { Observable } from 'rxjs'
import parseDependenciesFromPackageJson from './parse-dependencies-from-package-json'

describe('@search/utils/parse-dependencies-for-package-json', () => {
  it('works with valid package.json contents', done => {
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
    Observable.of(
      `
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
    `
    )
      .pipe(parseDependenciesFromPackageJson)
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

  it('fails with invalid package.json content', done => {
    Observable.of('bad content')
      .pipe(parseDependenciesFromPackageJson)
      .subscribe({
        error(error) {
          try {
            expect(error.name).toEqual('SyntaxError')
          } catch (error) {
            done.fail(error)
          }
          done()
        }
      })
  })
})
