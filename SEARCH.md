# The Life of a CodePilot Search

## 1. Entering a query

When users fill in fields in the search bar, data for these fields is stored by Vuex, inside `state.query` of the `search` module.

**Relevant files:**

* src/renderer/components/the-search-bar.vue
* src/renderer/state/modules/search.js

## 2. Initiating a search

A search is initiated by the `runSearch` action in the `search` module.

**Relevant files:**

* src/renderer/state/modules/search.js#runSearch

### Aborting a search before it begins

If there are certain conditions under which we _don't_ want to a abort a search before it begins, such as when the query text is blank, we can abort here by `return`ing.

**Relevant files:**

* src/renderer/state/modules/search.js#runSearch

### Pre-search preparation

If a search hasn't been aborted, we add `state.query` to our `state.recentQueries` (e.g. used for search suggestions) and also save it as the `state.submittedQuery` (e.g. used for match highlights).

**Relevant files:**

* src/renderer/state/modules/search.js#runSearch

### Starting each search type

Finally, we collect all the different search types we want to run (e.g. `github`, `stackoverflow`, `ripgrep`), then pass the same query to each of these searches through our `runSearchType` function, e.g.:

```js
runSearchType('github')
```

**Relevant files:**

* src/renderer/state/modules/search.js#runSearch

## 3. Normalizing the search query

Now we're in `src/search/index.js`, but before each search actually begins, there's some normalization of the query we have to do. For example:

* Removing extra spaces from the beginning or end of the query text
* Reformatting file globs to work across operating systems (_cough_ Windows _cough_)

**Relevant files:**

* src/search/index.js

## 4. Running the appropriate search function

Finally, we run one of the searches from the `src/search/` directory. Each search currently returns a Rx.js stream. We’re using Rx.js version 5.x. You can learn more about Rx.js [here](http://reactivex.io/rxjs/manual/overview.html). The stream should emit objects that must resolve to an object with at least one property: `results`, which is an array. This object may also contain an `error` object.

**Relevant folders:**

* src/search/

## 5. Saving search results

Whenever results are emitted, we save them by calling a mutation that pushes new results to the Vuex state matching the search type based on the `storeKey`. This should save the search results somewhere in `state.results`.

If the search stream encountered an error, we add it to `state.error`, which is available to the frontend as `searchErrors`.

**Relevant files:**

* src/renderer/state/modules/search.js#runSearch
* src/renderer/state/helpers.js#searchGetters

## 6. Organizing search results into results types

At this point, we can organize results into as many different groups as we want. Each group of results is called a results type. These can include data from one or even multiple sources.

You can add new `searchIntents` to the Vuex `search` module by modifying the `search/intents.js` file.

* `key`: a unique ID for the results type
* `name`: the display name for the results type
* `secondaryLabel`: intent description
* `sources`: list of sources objects that are used within the intent
* `filters`: list of filter objects that can be used with provided sources

All results from the selected intent are later combined into `searchResultsUnfiltered` and after grouping become `searchResultsItemsGroupsUnfiltered`. Then we can apply filters when provided to create `searchResults`.

**Relevant files:**

* src/renderer/state/modules/search.js
* src/renderer/state/helpers.js#searchGetters

## 7. Choosing how to format the list of results

We currently only have one way to format the results: a list of results grouped by the source.

Those results are always passed to the `SearchResultsFormatListGrpup` component found inside `SearchResultsFormatList`. This component has a few additional expectations about results that you'll need to satisfy in your getter for the results.

A group must contain several keys:

* `results`: containing all the results
* `source`: the source of the results
* `status`: the status of the search stream for the source
* `name`: group name
* `shouldLoadMoreResults`: whether there are more results to load

Additionally, every result has the following properties:

* `key`: a unique ID for the result, scoped to the results type
* `branches`: a list of navigable items within that search results (e.g. matching lines in a file, or answers to a question) - note that if a result doesn't really have individual matches or other items within it, it must still contain a `branches` array with one item

Whereas, every branch must also have a `key`.

Once that's done, your results will be navigable with the keyboard and also have the ability to be expanded or collapsed.

**Relevant files:**

* src/renderer/state/modules/search.js
* src/renderer/components/the-search-results.vue
* src/renderer/components/search-results-format-list.vue

## 8. Choosing how to format an individual result in the list

Depending on the result source, we’re using different `SearchResultsItem<TYPE>` components:

* `SearchResultsItemCommit`
* `SearchResultsItemDoc`
* `SearchResultsItemFile`
* `SearchResultsItemIssue`
* `SearchResultsItemPr`
* `SearchResultsItemQuestion`
* `SearchResultsItemVideo`
* `SearchResultsItemWebsite`

These each handle how to display a search result. Yes, that means your results don't already have a `type` property, you should add that either in the originating search function, or in the search results getter (e.g. if results from multiple searches have been merged into a single Frankenresult™).

If you need to define how a new type of result should be displayed and you want it to look the same as the file and question results, but with different content, you can define a new component using the `SearchResultsItem` component (see the other just-mentioned components for examples).

You can _also_ create a completely new kind of result that doesn't inherit from `SearchResultsItem` at all, but in these cases, you'll also have to style everything in this component from scratch, include states such as:

* expanded/unexpanded (if that's even relevant)
* hovered
* selected

**Relevant files:**

* src/renderer/components/search-results-format-list.vue
* src/renderer/components/search-results-format-list-group.vue
* src/renderer/components/search-results-item.vue
* src/renderer/components/search-results-item-sublist.vue
* src/renderer/components/search-results-item-<TYPE>.vue

## 9. Displaying individual results in the view pane

Now we have to decide how the view pane displays each result when selected. We'll start this process in `TheViewPane`. As you'll see there, we already have handlers for different types of results. When you create a new view pane, it's a blank slate: you dictate everything about it, given the `viewable` that contains the result information.

You can also reuse `ViewPaneInfo` to display an info bar at the top of any viewable. This info bar dictates the information it shows _not_ from the `type` of result, but from its `source` (e.g. `Stack Overflow`, `GitHub`, etc). Again, in cases where you've formed results using data from multiple searches, you can define your own `source` in the getter of the search results.

**Relevant files:**

* src/renderer/components/the-view-pane.vue
* src/renderer/components/view-pane-info.vue
* src/renderer/components/view-pane-<TYPE>.vue

## Searching using parsed query data

If you want to perform a conditional search, you can make use of the boolean operators `AND`, `OR`, and `NOT`. Conditional searching allows one to expand or narrow down the search and takes the shape of `x AND y`, `x OR y`, and `x NOT y`. When a conditional search is performed, the `parsed` property is set on the query object during the normalization process. `query.parsed` holds the parsed query data that is generated from `lucene-query-parser` library. `lucene-query-parser` takes any conditional search string as input (for example, `query.text`), and returns an expression tree as output. The expression tree contains three important fields: 1) `left` (the query term left of the boolean operator), 2) `operator` (AND, OR, NOT), and 3) `right` (the query term right of the boolean operator, or, in the case of nested conditional searches, a sub-tree containing its own expression tree). Searches can make use of the generated expression tree by performing a search on the term left of the boolean operator and the term right of the boolean operator. Based on the `operator` used, the search finds an `intersection`, `union`, or a `difference` between left and right query terms.
