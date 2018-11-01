# How to handle split testing

What if we want to create two different versions of an element/component? For example, maybe we want to test whether people are more likely to click on a button that's blue or orange?

## Creating a new split test

Under `split-tests`, create a new file:

``` js
// src/split-tests/search-button-background.js
import splitTest from './_split-test'

export default splitTest({
  // Provide a unique key for the test
  key: __filename,
  // Provide the hypothesis values you're testing
  hypotheses: ['blue', 'orange']
})
```

This file will export one of your hypotheses (chosen randomly), with a name and value. For example:

``` js
{
  name: 'orange',
  value: 'orange'
}
```

In this case, the name (our short description of the hypothesis) is the same as the value (what's used in the code).

When you want these to be different, your list of hypotheses can be an object instead of an array:

``` js
// src/split-tests/search-button-background.js
import splitTest from './_split-test'

export default splitTest({
  // Provide a unique key for the test
  key: __filename,
  // Provide the hypothesis values you're testing
  hypotheses: {
    blue: '#235e86',
    orange: '#863723'
  }
})
```

In this case, the property key (e.g. `blue`, `orange`) is the name of the hypothesis and the property value is -- well, the value.

Now in another file, you can import this hypothesis with:

``` js
import searchButtonBackgroundTest from '@split-tests/search-button-background'
```

And `searchButtonBackgroundTest` will contain either:

``` js
{
  name: 'blue',
  value: '#235e86'
}
```

or:

``` js
{
  name: 'orange',
  value: '#863723'
}
```

## Using split test values in HTML

In this example, we want to change the color of a specific button. In order to make our test value available in the HTML of a Vue template, we have to register it as data:

``` js
computed: {
  searchButtonBackground: () => searchButtonBackgroundTest.value
}
```

Then we can reference it by its name in our template:

``` html
<AppButton
  ...
  :style="{ background: searchButtonBackground }"
/>
```

## Tracking split test hypotheses in Application Insights

Before we explore more advanced split testing strategies, you probably want to know how we track the effects of our split tests on user behavior. Well, guess what? You don't have to! All split tests and their values are automatically added to all telemetry. 😎

## Using split test values for groups of changes in HTML, JS, and CSS

Test values won't always be CSS values. They might instead represent _groups_ of changes. For example, if we notice no one is clicking on the search button, we might come up with these hypotheses:

- The button doesn't stand out enough
- The button doesn't look like a button
- The button text is confusing

When you just have a few changes, you can create hypothesis values that are objects with multiple sub-values:

``` js
hypotheses: {
  'Longer text': {
    instructions: `
      <p>Ever find yourself looking for code you wrote before?</p>
      <p>Using CodePilot.ai, you can search code in your local folders. Don't worry, none of your code leaves your computer. And local search is always free.</p>
      <p>Tip: Choose the folder that contains all your code projects.</p>
      <p>Tip: Clone projects that you want to search locally.</p>
    `,
    buttonText: 'Select my code folder'
  },
  'Shorter text': {
    instructions: `<p>By using our free local search service, you can search your local folders for code. But don't worry, your code never leaves your machine. We care about your privacy.</p>`,
    buttonText: 'Select folder'
  }
}
```

When _most_ of a component will be changing, however, it's best to create a completely separate component dynamically choose one with Vue's `<component>` and a computed property:

``` html
<component :is="OnboardingFormatComponent">
```

``` js
computed: {
  OnboardingFormatComponent () {
    if (onboardingFormatTest.name === 'single-page') {
      return OnboardingSinglePageWizardStart
    } else {
      return OnboardingMultiPageWizardStart
    }
  }
}
```

## Special concerns for split testing

Note that for every split test, we add complexity and technical debt to our application. With _too many_ tests going on at once, it becomes difficult to predict if there might be variations that could break the user experience. It also becomes difficult to make changes to components, because you have to make sure the changes won't interfere with any split tests.

That's why it's best to not have too many tests happening simultaneously, or for an split test to last longer than a single sprint. When responding to the data collected by a test, we must also make sure to clean up and simplify again. Remove all split testing code and simply update the default behavior and styles to the variation(s) that performed the best.
