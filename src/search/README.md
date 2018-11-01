# Search

I wrote this before I created services and eventually, each search type may be migrated to its own service if they become computationally expensive.

See `src/renderer/state/modules/search.js` for a usage example. As you'll see, individual services are accessed through `index.js`.

The search consists of 3 layers of abstraction:
* Intents (searchIntents),
* Sources,
* Services

### 1. Intents

#### Example intent
```
{
  // key used to create a Vuex getter with results
  key: 'codeResults',
  // Name used to display in the tabs
  name: 'Code',
  // Sources to search through
  sources: [sources.localFiles, sources.githubCode],
  // Available filters
  filters: [
    {
      label: 'Local Files',
      value: true,
      isPro: false,
      trueFilter: () => true,
      falseFilter: result =>
        !(result.type === 'file' && result.source === 'Local')
    }
  ]
}
```

Intents reflect the specific group of needs of the user. Currently used intents:
* Code
* Docs
* Errors
* Learn

Those specify what kind of results the user will expect and ultimately find, based on what problem the user has.

Each **intent** has it’s own set of filters that can be applied to the whole collection of results.

The collection of results is a combination of results from different searches. For example, for _Code_ we might want to run a strict/exact code search, whereas for other intents that might not be required. Such differences between what kind of searches will be done lead us to the next layer -> **Sources**.

### 2. Sources

#### Example source
```
localFiles: {
  // Key used to create a Vuex property where the results will be saved
  storeKey: 'localFiles',
  // Search service to be used in this search
  service: 'ripgrep',
  // A mapping function to apply on the search query
  queryMapper: query => query,
  // A mapping function to apply on the result element
  resultsMapper: flow(
    items => uniqBy(items, result => result.key.replace(/^[^:]+:/, '')),
    groupResultsByFile,
    items => sortBy(items, 'path')
  )
}
```

A **source** is used to declare what kind of search has to be done. It is the bridge between the **intent** and the **service**, which makes it possible to use the same search **service** for multiple searches where each can have a slightly different query by using the `queryMapper` function. It also makes it possible to customize the way the output results are structured thanks to the `resultsMapper` function. When running our search we collect all **unique sources** from the selected **intents** and run those. Each unique search leads to a **service** being called.

### 3. Services

Currently available services:
* 'ripgrep' (local search)
* 'githubCode'
* 'githubIssues'
* 'githubCommit'
* 'stackoverflow'

The heart of all of our searches. A service receives a query, does the search and returns an Rx.js stream with the results.

## Adding new kind of searches in steps

First, make sure that the **service** that will provide us with the results already exists. If not, you have to create a new **service**. It should receive a query as the param and return an Rx.js stream that emits results.

Secondly, create a new source with a unique `storeKey` inside the `search/sources.js` file. Make sure to provide a `resultsMapper` function that will adjust how the result looks like to match the app requirements. If the search requires some changes to the query that is passed to the service, you can use the `queryMapper` property, to modify the query.

Lastly, add the source to the selected intent. Remember that the order in the `sources` array matters in that it will affect the order of how the results are displayed. That’s all!

## Ripgrep caveats

### No output on Windows

We want ripgrep output with no colors to be able to parse it correctly, but `--color never` seems to [work inconsistently](https://github.com/BurntSushi/ripgrep/issues/353) and on Windows, under seemingly random conditions, it will [sometimes](https://github.com/BurntSushi/ripgrep/issues/500) [result](https://github.com/BurntSushi/ripgrep/issues/466) in no output at all.

This is fixed now, but if it happens again, look at the changes you made recently and try them one at a time to see which one triggered the problem - then find a way to structure the arguments differently. Strangely, even _the order of arguments_ can cause or fix the problem.

### Glob support on Windows

Ripgrep has a few [issues](https://github.com/BurntSushi/ripgrep/issues/526) [with](https://github.com/BurntSushi/ripgrep/issues/234) [globs](https://github.com/BurntSushi/ripgrep/issues/530) on Windows. Here are some syntax examples that are known to not work consistently cross-platform, with suggested alternatives:

``` sh
# Bad
--glob *.js

# Good
--glob **/*.js
```

``` sh
# Bad
--glob {glob1,glob1}

# Good
--glob glob1
--glob glob2
```

### Working directory detection on Windows

When we run Ripgrep from Node, there's no stdin. This [isn't handled well](https://github.com/BurntSushi/ripgrep/issues/410) on Windows, so as a workaround, we have to explicitly tell Ripgrep to search the working directory we've set by passing it `./`.

## Optimizations

### Cancelable Searches

Right now, there's no going back once a search is started. To be able to cancel/abort the search, we'd need to implement cancel tokens for promises or migrate to observables with Rx.js.
