# Unit Testing

## Setup

``` bash
# Install dependencies
yarn install

# Run unit tests
yarn unit

# Run a specific unit test
yarn unit src/path/to/unit/test.unit.js

# Run a specific unit test, recording requests for playback
yarn unit:record src/path/to/unit/test.unit.js
```

## File Structure

```bash
codepilot-vue
|- src # Unit tests live next to the file they test, with the .unit.js extension
|- test
   |- unit
      |- __mocks__/  # NPM module mocks
      |- matchers.js # Additional matchers custom to our app
      |- setup.js    # Setup to run before each test file
```

## What is a unit test?

It's when we test a single module/file, outside the context of our app. If every other file in the app were deleted, the unit tests for this module should still work.

## What if something is difficult to unit test?

It's definitely OK to refactor code to be more unit-testable. You can split a function into many smaller functions, or move an expression from a Vue template into a computed property. If there's anything you're not sure about, get a second opinion.

## Jest

We use Jest to run our unit tests. If you're not familiar with it, I recommend first browsing through the existing tests to get a sense for them.

Then at the very least, read about:

* [Jest's matchers](https://facebook.github.io/jest/docs/en/expect.html) for examples of other assertions you can make
* [Testing async code](https://facebook.github.io/jest/docs/en/asynchronous.html)
* [Setup and teardown](https://facebook.github.io/jest/docs/en/setup-teardown.html)

## Vue test utils

If you're testing a Vue component, it's recommended to use Vue test utils.

See an example in `test/unit/app-button.spec.js`. The [`shallow` function](https://github.com/vuejs/vue-test-utils/blob/dev/docs/en/api/shallow.md) renders the Vue component, but not any child components. The `c` variable is short for `component`. On it, you most notably have access to:

- `vnode`: The virtual DOM node rendered by the component. See [its type definition](https://github.com/vuejs/vue/blob/dev/types/vnode.d.ts#L10-L26) for details.
- `element`: The root DOM element rendered by the component.
- `vm`: The component instance.

You also have access to a number of methods, [described in these docs](https://github.com/vuejs/vue-test-utils/tree/dev/docs/en/api/wrapper).

To learn more, browse [the in-progress docs](https://github.com/vuejs/vue-test-utils/tree/dev/docs/en) for Vue's test utils.

## How to create a unit test

### 1. Create the test file

Next to any source file, create a new file of the same name, but with the `.unit.js` extension.

### 2. Write the test

For all of our tests, we use the BDD syntax, where you **describe** the thing you want to test and the behavior **it** should have.

In the newly created `.unit.js` file, add a `describe` block that **describes** the thing you want to test, using the alias reference beginning with `@` as the name of the test:

``` js
import AppIcon from './app-icon'

describe('@components/app-icon', function () {
  // Add test cases for behavior(s) the AppIcon should have
})
```

Then, inside the `describe` block, add as many test cases needed using the following syntax:

``` js
it('renders a span element with search icon', function () {
  // Add some assertions, making sure to avoid boolean expectations such as:
  // expect(foo).toEqual('bar')
})
```

### 3. Putting it all together

``` js
import AppIcon from './app-icon'

describe('@components/app-icon', () => {
  it('renders a span element with search icon', () => {
    const { element } = mount(AppIcon, {
      propsData: {
        icon: 'search'
      }
    })

    expect(element.tagName).toEqual('SPAN')
    expect(element.className).toContain('fa fa-search')
  })
})
```

## Recording requests

We can record requests for a test with:

```bash
# Run a specific unit test, recording requests for playback
yarn unit:record src/path/to/unit/test.unit.js
```

This saves the request responses to the `tests/unit/playbacks` directory. In future tests run with `yarn unit`, these playbacks will be used instead of hitting the APIs directly. This avoids random test failures from hitting API limits and also significantly speeds up tests.
