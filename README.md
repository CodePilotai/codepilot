# *** NOTICE: Looking for help addressing vulnerabilities due to outdated packages

# CodePilot.ai

This and others READMEs in the repo serve as living documents and the source of truth for our development practices.

* [Design](src/renderer/design.md)
* [Split Testing](src/split-tests/README.md)
* [Unit Testing](test/unit/README.md)
* [End to End testing](test/e2e/README.md)
* [Services](src/services/README.md)
* [Search](src/search/README.md)
* [State](src/renderer/state/README.md)
* [Renderer](src/renderer/README.md)

## Build Setup

``` bash
# Install dependencies
# If you don't have yarn installed: `npm install --global yarn`
yarn install

# Launch and serve with live reload at localhost:9080
yarn dev
````
## Build application
| Command               | Analytics  | Stripe     | NODE_ENV    | PROJECT_PHASE |
| --------------------- | ---------- | ---------- | ----------- | ------------- |
| yarn dev              | test       | test       | development |
| yarn build            | test       | test       | production  |
| yarn build:staging    | test       | test       | production  | staging       |
| yarn build:production | production | production | production  | production    |
```
# Run unit tests
yarn test:unit

# Run end-to-end tests
yarn test:e2e

# Lint all JS/Vue component files in `src/`
yarn lint
```

## Production Configuration

To configure this app for production, add production keys for all services in `services.config.js`.

## Development

### Commits

#### Format

Describe the change you made. If someone on a different development team (i.e. not familiar with our app) read your commit history, they should at least have a vague idea of what you did.

To make describing your changes easier, more frequent, smaller commits are generally better. These can be made any time you know (or at least think you know 😉) the app works and all tests pass, even if a feature isn't completely finished. For example:

1. add hotkey button to welcome page
2. make input pop up when hotkey button clicked
3. update hotkey input to collect user-defined hotkey when in focus
4. sync hotkey input to vuex state
5. save hotkey vuex state in electron settings

Note that no one does this perfectly. Those are the commits I wish I had made, rather than the commits I really made. 😅 At the very least though, it's good to avoid including more than one feature in a single commit, unless they're tightly coupled.

A few other notes:

- Capitalization does *not* matter in commits - do whatever you're comfortable with.
- Commits should generally be kept to a single sentence, but it can be a long sentence if you want. It's OK if you go over the limit for a commit title and spill into Git's commit description field.

#### Imperative vs past tense

Some people have strong opinions about whether to use the imperative (e.g. `add`, `fix`) or past tense (e.g. `added`, `fixed`). I (Chris) personally don't care, since both are easily understandable when browsing commit history.

#### Referencing issues/PRs

If a commit closes an open issue, add `, fixes #123` to the end of a commit, `123` being the GitHub id of the issue. You can also use `, replaces #123` to reference pull requests we'll be closing.

### Features

To ensure frequent communication, all features will be done in feature branches (we can even disable pushing to `master`). Here's a good process for starting a new feature:

#### Start a new feature

``` sh
git fetch origin # Make sure your local origin is up-to-date
git checkout master # Move to the master branch
git reset --hard origin/master # Ensure your local master matches GitHub's
git checkout -b my-feature-branch # Check out your feature branch
```

#### Rebase frequently

As you develop, it's a good idea to **rebase after every commit** to address conflicts as soon as they arise:

``` sh
git fetch origin # Make sure your local origin is up-to-date
git checkout my-feature-branch # If you're not already there
git rebase origin/master # Rebase against GitHub's master branch
```

#### Resolve rebase conflicts

**If you encounter conflicts**, you'll see `CONFLICT` in the output of the last command for each conflicting file. At the end, you'll also see:

```
When you have resolved this problem, run "git rebase --continue".
If you prefer to skip this patch, run "git rebase --skip" instead.
To check out the original branch and stop rebasing, run "git rebase --abort".
```

If you run `git status` at this point, you'll see a list of the conflicting files listed under "Unmerged paths". Each file in this list will contain one or more blocks of code that look similar to this:

```
<<<<<<< HEAD:src/renderer/app.vue
    font-size: 1.3em;
=======
    font-size: 1.5em;
<<<<<<< master
```

What it's saying above is that _someone else_ changed the same section of code that you did. Now you have to decide which of your changes to keep, or to combine them. In this case, let's say you want to keep the change from master. You'd change the code above to:

```
    font-size: 1.5em;
```

> NOTE: Do **NOT** try to manually resolve conflicts in `yarn.lock`. Instead, it's best to delete the file (`rm yarn.lock`) and regenerate it (`yarn install`).

When you've resolved all conflicts, you can `git add` the file (in the example above, `git add src/renderer/app.vue`). And when _all_ conflicting files are added and resolved, you can run `git rebase --continue`.

> Note that **you probably shouldn't ever need to run `git rebase --skip`**, because it assumes that master can just overwrite anything you did, which generally isn't safe. It's sort of like Googling with the "I'm feeling lucky" button - you don't really know where you'll end up. 😄

If you make a mistake in the middle of a rebase, you can `git rebase --abort` and try again.

> If you're using VS Code, might want to check out [this overview](https://www.youtube.com/watch?v=AKNYgP0yEOY) of its Git integration, as it can help make complicated tasks like resolving conflicts easier.

#### Check your work

When you're ready to submit your work in a PR, first rebase one more time and review your changes with:

``` sh
git fetch origin # Make sure your local origin is up-to-date
git checkout my-feature-branch # If you're not already there
git diff origin/master # List differences between your branch and master
```

This will give you a chance to catch and clean up any accidental changes, leftover debugging code (e.g. `console.log`), etc. It's essentially giving _yourself_ a code review before someone else does and is a nice courtesy. 🙂

#### Push to your branch

``` sh
git push origin my-feature-branch --force
# The --force will be necessary if you've rebased since your last push
```

And open a pull request on GitHub. Before merging into master, each feature must be reviewed by at least one other team member.

### PR Updates

If you're reviewing a PR and want to make some updates yourself before merging, make sure:

1. You communicate with whoever owns the PR and receive their explicit consent before making changes. Otherwise, they might also make changes and accidentally overwrite your work.
2. This isn't a change the owner of the PR could be guided to make themselves and would learn from. On a team with remote members, PRs are a great opportunity to share expertise, but "just taking over" will lead to siloed knowledge and slower development in the long run.

### PR Merging

GitHub has several ways for us to merge PRs:

- **Rebase & merge**: Preferred for most PRs, with meaningful commits that tell a story and always have the app in a working condition.
- **Squash & merge**: Preferred for bugfix PRs, which will often only have one commit, or multiple meaningless commits, such as: `fix bug, fixes #123`, `ok, really fixed bug now`, `bug even fixed on windows`, etc. Also preferred for PRs that have gone through a lot of iteration/troubleshooting, where the app is not always in a working condition.

### Troubleshooting

If you've been working on the same problem, without success, for more than an hour, reach out for help immediately (even someone who might know less about the problem than you do). It's amazing how much another pair of eyes can help, as well as the opportunity to explain and answer questions on what you're working on.

## Folder Architecture

- `.electron-vue`: Contains the dev server and build config, which should rarely need to be modified. Changes to these files should be made with caution, since they greatly affect everyone's dev experience.

- `build`: Includes assets used during build.

- `src`: Manually edited files should be in here 99% of the time. Any files that go through the build system will be in here.

  - `split-tests`: Where we initialize A/B tests. These randomly chosen value for each test is automatically added a property for all telemetry.
  - `main`: Electron-specific code, where our app is initialized and the main window is created.
  - `renderer`: Mostly Vue-specific code to render the frontend.
    - `assets`: This is where we'll put any images, fonts, or other non-code files that we reference in our JavaScript or Vue components.
    - `components`: Where all of our components live, except the special `app.vue` root component.
    - `directives`: Where all our custom directives live. Any `.js` files in this directory are automatically required by `src/renderer/main.js` to facilitate global registration.
    - `state`: Where we manage all our global state management for the application.
  - `search`: Where our search functions live.
  - `services`: Computationally expensive services that we run in a separate thread, via forked processes. This prevents the operation from blocking the main thread and causing the app to feel slow/laggy.

- `static`: Will include any assets you want to bypass the build process. For example, a `favicon.ico` file will often go here in a typical web application.

- `test`: Contains the configuration for our testing setup. Unit tests are stored next to the files that are being tested.

## Filenames

One note about files: always use kebab-case in filenames, unless the file requires otherwise or is documentation (GitHub treats `README.md` files differently than other files).

Using any uppercase letters can cause issues with Git on case-insensitive filesystems.

``` sh
# Bad
MyComponent.vue
myComponent.vue
Main.js
MAIN.js

# Good
my-component.vue
main.js
```

## HTML

All HTML will exist within Vue components, either:

- in the `<template>` of a `.vue` file, or
- in the `render` function of a [functional component](https://vuejs.org/v2/guide/render-function.html#Functional-Components), optionally using [JSX](https://vuejs.org/v2/guide/render-function.html#JSX)

### In the `<template>` of a [`.vue` file](https://vuejs.org/v2/guide/single-file-components.html)

This will be the case for ~95% of HTML. What you're writing is "normal" HTML, but since Vue has a chance to parse it before the browser does, we can do a few extra things that normally aren't possible in a browser.

For example, any element or component can be self-closing:

``` html
<span class="fa fa-comment"/>
```

The above simply compiles to:

``` html
<span class="fa fa-comment"></span>
```

This feature is especially useful when writing components with long names, but no content:

``` html
<InputProjectDirectory
  title="Change the folder to search"
  description="The folder containing code projects"
  icon="folder-open"
/>
```

### In a [`render` function](https://vuejs.org/v2/guide/render-function.html)

Render functions are _alternatives_ to templates. Components using render functions will be relatively rare, written only when we need either:

  - the full expressive power of JavaScript, or
  - better rendering performance through stateless, [functional components](https://vuejs.org/v2/guide/render-function.html#Functional-Components)

These components can optionally be written using an HTML-like syntax within JavaScript called [JSX](https://vuejs.org/v2/guide/render-function.html#JSX).

### Conventions

These conventions are always open to discussion, should be adhered to unless there's a compelling reason not too.

#### Element and attribute names should be kebab-case

Using PascalCase or camelCase is technically allowed here, but `kebab-case` is more "normal" HTML:

``` html
<!-- Bad -->
<Div
  SomeProp="foo"
  dataBar="test"
>

<!-- Good -->
<div
  some-prop="foo"
  data-bar="test"
>
```

#### Component names should be PascalCase

To easily differentiate components from normal HTML elements in our templates (and JSX), we use PascalCase.

``` html
<!-- Bad -->
<project-directory-input/>
<projectDirectoryInput/>

<!-- Good -->
<InputProjectDirectory/>
```

#### Component names should be multi-word

To avoid conflicts with obscure/future HTML elements, we use at least two words for any component names:

``` html
<!-- Bad -->
<Todo/>
<Todolist/>

<!-- Good -->
<TodoItem/>
<TodoList/>
```

#### Void elements should not be self-closing

Void elements such as `<input>` and `<img>` do not require a closing tag, so should not include a self-closing backslash. For example:

``` html
<!-- Bad -->
<input .../>
<img .../>

<!-- Good -->
<input ...>
<img ...>
```

While technically valid HTML, it could cause confusion within this project, since every other use of `/>` implies a rendered closing tag.

#### Tags with more than one attribute should be multi-line

To improve the readability of our HTML, we borrow a convention from JavaScript. Just as objects with multiple properties are typically multi-line, elements/components with multiple attributes are also multi-line:

``` html
<!-- Bad -->
<InputProjectDirectory title="Change the folder to search" description="The folder containing code projects" icon="folder-open"/>

<!-- Good -->
<InputProjectDirectory
  title="Change the folder to search"
  description="The folder containing code projects"
  icon="folder-open"
/>
```

## JavaScript

The JavaScript we use is compiled by stage 0 Babel, by way of Webpack. Configuration for Babel is in the `.babelrc.js` file at the root of this project and configurations for Webpack are in the `.electron-vue` folder, also at the root.

Babel allows us to write more modern JavaScript without having to worry about what's supported by Node/Chromium. If you're (relatively) new to features such as `const`, `let`, and `=>` (arrow functions), take some time to read about the following features in Babel's ES2015 guide:

- [Arrow functions](https://babeljs.io/learn-es2015/#ecmascript-2015-features-arrows-and-lexical-this)
- [Template literals](https://babeljs.io/learn-es2015/#ecmascript-2015-features-template-strings)
- [Destructuring](https://babeljs.io/learn-es2015/#ecmascript-2015-features-destructuring)
- [Spread operator](https://babeljs.io/learn-es2015/#ecmascript-2015-features-default-rest-spread)
- [`let`/`const`](https://babeljs.io/learn-es2015/#ecmascript-2015-features-let-const)
- [`for`...`of`](https://babeljs.io/learn-es2015/#ecmascript-2015-features-iterators-for-of)

Reading these sections alone will get you 99% of the way to mastering Babel code. It's also a good idea to read about Promises, if you don't yet feel comfortable with them. Here's a [good intro](https://developers.google.com/web/fundamentals/getting-started/primers/promises).

If you have any questions about any features, please don't hesitate to reach out, as it's obviously important that everyone understands our code and feels comfortable modifying it. 🙂

### Vue

Since Vue is such a huge part of our app, I strongly recommend every read through the _Essentials_ of [Vue's guide](https://vuejs.org/v2/guide/).

### Vuex

To wrap your head around our state management, I also recommend reading through [those docs](https://vuex.vuejs.org/en/intro.html), starting at _What is Vuex?_ and stopping before _Application Architecture_. Then skip down and read [_Form Handling_](https://vuex.vuejs.org/en/forms.html) and [_Testing_](https://vuex.vuejs.org/en/testing.html)

### Aliases

While relative paths can be used to import any file in our `src`, we have a few aliases you might find useful in JavaScript:

- `@assets`: src/renderer/assets
- `@branding`: src/renderer/branding.scss
- `@state`: src/renderer/state
- `@search`: src/search
- `@services`: src/services

Using these allows us to restructure our app if we want to and only change a few aliases. It also makes accessing these various parts simpler, since we don't have to remember where a file exists in relation to another component.

### Generators

This project includes generators to speed up common development tasks. Commands include:

```bash
# Generate a new component and adjacent unit test
yarn new component

# Generate a new helper function and adjacent unit test
yarn new helper

# Generate a new end-to-end spec
yarn new e2e

# Generate a new Vuex module and adjacent unit test
yarn new vuex
```

### Conventions

#### Comply with ESLint rules

ESLint can do most of the work for us, in terms of sticking to JavaScript conventions. Right now, this project is configured to use ["Standard"](https://github.com/standard/standard#the-rules) in the root `.eslintrc.js` file.

Standard provides a good base, but is still relatively less opinionated than many other popular configs. The goal is **not** to get everyone writing identical code, but rather to ensure everyone's code is easy to read and modify by everyone else.

The most controversial rule in Standard is about semi-colons: they should be left out, except in very specific situations where you do need them and the linter will warn you.

**No rule in the ESLint config is sacred.** They can be overridden individually, so if there's one you feel is making the team less productive, or if you'd like to add a new rule, don't hesitate to bring it up.

#### Use PascalCase for anything that can have an instance, camelCase for everything else

For Vue components or anything that you'll create an instance of with the `new` keyword, use PascalCase. All other names, including variables, properties, functions, etc should be camelCase.

``` js
// Bad
import mycomponent from 'my-component'
import myComponent from 'my-component'

// Good
import MyComponent from 'my-component'
```

#### Always use prototypes (or plain objects) instead of classes

This is a bit controversial, but I (Chris) have generally found that JavaScript classes only add confusion to most codebases. They often [don't work intuitively](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/apA.md) and also tend to be overused, where even a plain JavaScript object would be more appropriate.

If we ever find they offer unique benefits for a particular use case, we can revisit this.

#### Explicit over implicit

We want to be able to drop into any file and easily tell where everything is coming from. Otherwise, debugging our application and hunting down where to set various values can become difficult.

For example, we could set up Webpack to automatically inject our `branding.scss` variables into every Vue component. That way, we wouldn't have to `~@import 'branding.scss'` so many times. It's tempting to do this once, then twice, then a few more times - and suddenly, it's extremely difficult to tell where things are coming from.

#### Build flexible adapters between parts of our app

In our search, we have a single entry-point in `index.js`. In our state, we define the component-facing API in `helpers.js`. Our aliases also give us the freedom to easily restructure our app if we'd like.

The benefits to these adapter points, is they can translate between different parts of our app. For example, if we run a search with a `type` of `local-files`, we now have a point where we can choose which specific search functions we want to combine to create our results.

## Styles

### TailwindCSS

The application makes heavy use of [TailwindCSS](https://tailwindcss.com/) as our CSS framework of choice. The main difference compared to typical CSS frameworks like Bootstrap is that it’s an utility-first framework that doesn’t come with any predefined _component_ styles. Instead it provides hundreds of utility classes that can be composed together to create components.

For example:
``` html
<button class="bg-blue px-8 py-4 text-white hover:bg-blue-darker rounded">Button</button>
```

The values used by TailwindCSS depend on the configuration that can be found in `src/renderer/tailwind.js`. Changes to the configuration will affect the whole application. Through the usage of TailwindCCS, we rely on the framework to keep the visual harmony in our app. For example, by keeping the paddings, margins and colors the same across the whole application.

> Important: Do not use `@apply` inside Vue components. You can use it inside src/renderer/assets/styles though.

### Handwritten CSS

If something can’t be solved with a combination of TailwindCSS utility classes we fallback to writing our own CSS rules. This this, we use the SCSS modules, which you can activate by adding the `lang="scss"` and `module` attributes to style tags in Vue components. Otherwise, the tag is assumed to just contain normal CSS.

``` html
<style lang="scss" module>
/* ... */
</style>
```

### SCSS

SCSS is just a superset of CSS, meaning any valid CSS is _also_ valid SCSS. This allows you to easily copy properties from other sources, very much in the CodePilot.ai spirit. 😄 It also means you can stick to writing the CSS you're still comfortable with while you're learning to use more advanced SCSS features.

I specifically recommend reading about:

- [Variables](http://sass-lang.com/guide#topic-2)
- [Nesting](http://sass-lang.com/guide#topic-3)
- [Operators](http://sass-lang.com/guide#topic-8)

Those are the features you'll use 99% of the time.

### CSS Modules

As mentioned earlier, every Vue component will be a CSS module. That means class you define are not _actually_ classes. When you write:

``` css
.my-input {

}
```

You're actually defining a property on the `$style` property of the Vue component. The name of the class is also transformed to camelCase, so that you can assign it in a template with:

``` html
<div :class="$style.myInput">
```

The value of `$style.myInput` will be an automatically generated class that contains the name of the component, plus a random hash to eliminate the possibility of style conflicts.

Do you know what that means?! You can _never_ write styles that interfere with another component. You also don't have to come up with clever class names, unique across the entire project. You can use class names like `.input`, `.container`, `.checkbox`, or whatever else makes sense within the scope of the component.

### CSS imports

To import CSS from a Webpack alias or installed package, you must use the `~` prefix. So for example, to import `branding.scss`, which is aliased to `@branding` for convenience, you will write:

``` scss
@import '~@branding';
```

Check out `app.vue` for examples adding styles from packages.

### `branding.scss`

This is where all the shared variables in the application live. You can use these variables in your CSS and even import them into a JS file, as long as you explicitly export them.

Note that to import

### `app.vue`

This is only file in the project that will ever contain global styles. This is also where we import any CSS dependencies we want to build off.

### Adding styles to subcomponents

If you want to add styles to subcomponents, you're in luck! If you add a `class` attribute to a component, like this:

``` html
<MyComponent :class="$style.someClass"/>
```

Then the class you've provided will automatically be added to the root element of the component. If you instead want to add styles to a subcomponent, you can define a prop, such as `inputClass` to pass the class.

In cases where you want to apply special classes for a state, such as "active", "large", or "disabled", it's usually best to define a prop that accepts the state, then optionally applies a class based on that state. For an example, check out the `active` prop on the `app-button` component.

To learn more about class and style bindings, also check out [this page of the Vue docs](https://vuejs.org/v2/guide/class-and-style.html).


## Images, fonts, and other miscellaneous files

These will all go in the `assets` folder and can be accessed from each language's module system.

### Importing assets in JavaScript

``` js
import logo from '@assets/images/logo.png'
```

### Referencing assets in CSS

To access the `@assets` alias from CSS, you have to use the `~` prefix:

``` css
background-image: url('~@assets/images/logo.png')
```

### Referencing assets in HTML

The `~` prefix is also necessary in HTML:

``` html
<img src="~@assets/images/logo.png" alt="Logo">
```

## Themes

  Checklist for working on themes

  1. Add variables to all themes found in `src/themes`. `"variable-name" : value`
  2. Add variable in branding.scss `$variable-name: var(--variable-name)`
  3. Test changes in all themes.

## Tests

To run _all_ the tests:

```
yarn test
```

### Syntax for Behavior-Driven Development (BDD)

For all of our tests, we use the BDD syntax, where you **describe** the thing you want to test and the behavior **it** should have.

``` js
describe('Thing you want to test', () => {
  it('What you expect it to do', () => {
    // ... Setup ...
    expect(...).to.equal(...)
  })
})
```

As for the assertions you can make, expecting a variable or property to have a specific value is just the tip of the iceberg. It's a good idea to skim [the Chai expect docs](http://chaijs.com/api/bdd/) for a more complete picture of your options.

### Prioritization

We can't test _every_ possible detail of our app. We wouldn't even want to, as we'd have to change dozens of tests every time we changed a word. So how do we figure out what's most important to test?

Personally, I (Chris) like to prioritize tests by asking 2 categories of questions:

- __Importance__: How bad would it be if it broke?
- __Urgency__: How likely is it to break?

Let's apply these to a hypothetical component wrapper for font-awesome and other icons:

- Importance: If it broke and icons weren't rendering anymore, it would decrease the quality of the experience and hurt the brand image. For a chain of restaurants, this would probably just be mildly annoying. For an online store, where trust needs to be high, it could permanently alienate customers.

- Urgency: If it's a really simple component that is not frequently changing, it's probably extremely unlikely that it will break. If we're adding new icons all the time and making changes to the interface of the component, there's more risk.

Then I use these answers to generally prioritize tests in this order:

1. When important _and_ urgent, always include robust tests before shipping, erring towards over-testing.
2. When important, but not urgent, write the 20% of tests that will catch 80% of bugs before shipping, but catch the last 20% of bugs before any significant refactors that touch this code.
3. When urgent, but not important, write the 20% of tests that will catch 80% of bugs, _ideally_ before shipping, then only add more if something breaks.
4. When not important and not urgent, don't test.

This is a slight over-simplification because importance and urgency aren't binary, but on a continuum. Their evaluation can also be pretty complex and answers are inevitably subjective. That means these are _tools_ to be used in conversations, not a simple rubric that can be mindlessly followed.

These tools for prioritization can also be used at the micro level: when you know you want to test a feature, figuring out _which parts/levels_ to test. I've seen a lot of tests to check that basic Vue functionality works (e.g. the starting value of a data property is set to the correct value). This is an example of testing something of extremely low urgency, since they _very_ rarely catch any bugs.

I think more often, they lead to developers not wanting to touch code, for fear of having to hunt down and fix breaking tests when nothing's actually broken. Broken tests become just a sign that "we changed some code today." This leads to the opposite of the intended effect, where devs see broken tests during CI and think, "Oh, it's probably nothing. We want to get this feature out, so let's ship to prod and we'll fix the tests later." Inevitably, it turns out something really _was_ broken - you just didn't trust your tests, because they're usually lying.

### Principles

#### If a test never fails, you don't know it works

Whether or not you write the test before implementing a feature or fixing a bug, you **must** at some point have a failing test. Otherwise, you don't know for sure that if the feature breaks, the test will fail.

#### When fixing a bug, always write a test first

If it happened once, it can happen again - unless you guarantee it can't with a test. 🙂

#### Test outcomes, not implementation

It's a good idea to ask yourself the question, "If this test failed, would the thing I'm testing definitely be considered broken?"

For example, if you're testing that a search result has a specific background color when it's selected, what happens when you change that color? Or if you decide to add a border to selected results, instead of changing the background?

Styles are unlikely to break, but state _can_, so test that instead. For example, make sure that when a result is clicked on, that it becomes selected in our state. This is important behavior that is unlikely to change in the future.

#### Avoid boolean expectations

If you have a variable `foo` that you expect to have the value `'bar'`, this isn't a good test:

``` js
expect(foo === 'bar').to.equal(true)
```

If the test fails, it'll just tell you:

```
expected false to be true
```

That's not very helpful. It doesn't give you any hints as to what may have gone wrong. Instead, test against a specific value, like this:

``` js
expect(foo).to.equal('bar')
```

Then if the test fails, it might say:

```
expected "barbarbar" to be "bar"
```

And immediately, you'll be able to get idea of what might have gone wrong.

### Unit Tests

See: [test/unit/README.md](test/unit/README.md)

### End-to-End Tests

See: [test/e2e/README.md ](test/e2e/README.md)

## Electron

### Accessing electron from a Vue instance

We’re using the `vue-cli-plugin-electron-builder` for adding Electron support to our Vue-CLI based setup.

Additionally the `vue-electron` plugin makes electron available on any component instance as `$electron`. For example:

``` html
<!-- In a template -->
<AppButton
  title="CodePilot.ai community on Gitter"
  description="Message our team and other members"
  icon="comments"
  @click="$electron.shell.openExternal('https://gitter.im/codepilot_ai/Lobby')"
/>
```

``` js
// In JavaScript
export default {
  // ...
  methods: {
    setAppTitle () {
      const electronWindow = this.$electron.remote.getCurrentWindow()
      const homeDirectory = this.$electron.remote.app.getPath('home')
      electronWindow.setTitle(
        this.query.projectDirectory.replace(homeDirectory, '~') +
        ' - ' +
        this.$electron.remote.app.getName
      )
    }
  }
}
```

### Accessing electron anywhere else

In any `.js` file, you can access electron with:

``` js
import electron from 'electron'
```

This gives you the exact same object as `$electron` on Vue component instances.

### Tour of the `electron` object

As we use different parts of Electron, in our application, we can store links to documentation and other resources here, so that we can find them quickly.

As a general resource, check out [Cameron's Electron videos](https://www.youtube.com/watch?v=Y8c9b8nZxp8&list=PLkOqyUCsoGE2KwOmt698IxAerJbLLws1a) when you're about to use a new part of Electron, as it's very likely that he explains it more clearly than the actual docs. 😂

Below is also a tree representation of how to access various parts of the electron, with links to API docs:

- [`remote`](https://github.com/electron/electron/blob/master/docs/api/remote.md#remote)

  - [`getCurrentWindow()`](https://github.com/electron/electron/blob/master/docs/api/remote.md#remotegetcurrentwindow): Returns the app's current window (the OS window, not the browser's `window`). See also [`BrowserWindow`](https://github.com/electron/electron/blob/master/docs/api/browser-window.md).

    - [`setTitle(...)`](https://github.com/electron/electron/blob/master/docs/api/browser-window.md#winsettitletitle): Set's the title of the window.

    - [`isVisible()`](https://github.com/electron/electron/blob/master/docs/api/browser-window.md#winisvisible): Returns whether the window is currently visible.

    - [`isFocused()`](https://github.com/electron/electron/blob/master/docs/api/browser-window.md#winisfocused): Returns whether the window is currently focused.

    - [`show()`](https://github.com/electron/electron/blob/master/docs/api/browser-window.md#winshow): Shows the window and gives it focus.

    - [`hide()`](https://github.com/electron/electron/blob/master/docs/api/browser-window.md#winhide): Hides the window.

  - [`app`](https://github.com/electron/electron/blob/master/docs/api/app.md)

    - [`getPath(...)`](https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname): Returns a named path (e.g. `/Users/fritzc` when asked for `'home'`).

  - [`dialog`](https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialog)

    - [`showOpenDialog(...)`](https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialogshowopendialogbrowserwindow-options-callback): Opens an OS-specific dialog to select a file or folder.

  - [`globalShortcut`](https://github.com/electron/electron/blob/master/docs/api/global-shortcut.md#globalshortcut)

    - [`register(...)`](https://github.com/electron/electron/blob/master/docs/api/global-shortcut.md#globalshortcutregisteraccelerator-callback): Registers a global shortcut.
    - [`unregister(...)`](https://github.com/electron/electron/blob/master/docs/api/global-shortcut.md#globalshortcutunregisteraccelerator): Unregisters a global shortcut.

- [`shell`](https://github.com/electron/electron/blob/master/docs/api/shell.md#shell)

  - [`openExternal(...)`](https://github.com/electron/electron/blob/master/docs/api/shell.md#shellopenexternalurl-options-callback): Opens a URL in the default browser.

## Optimization

When we need better performance, here are some specific strategies we can use to make our app faster:

- Convert expensive operations into services that run in a separate thread. See `src/services/README.md` for more info.
- Create more parallel service instances, for better multi-threading.
- Convert simple, stateless components into faster, [functional components](https://vuejs.org/v2/guide/render-function.html#Functional-Components). This is often especially effective for components rendered with `v-for`.
- To speed up startup, we can make components that aren't needed right away [asynchronous components](https://vuejs.org/v2/guide/components.html#Async-Components).

## Configuring dev/prod-specific behavior

In our Webpack configs, we look for a `NODE_ENV` environment variable, then make the value of that variable available in our source as `process.env.NODE_ENV`. During compilation, this is replaced with a hard-coded string, such as `"production"` or `""` if the variable has no value.

For example, this code:

``` js
if (process.env.NODE_ENV === 'production') {
  // Do something special...
}
```

will become:

``` js
if ("production" === 'production') {
  // Do something special...
}
```

This means the _only time_ the value of environment variables is important is during build time. After that, the value is hard-coded into the source.

### How do I specify production-only behavior?

Check if `process.env.NODE_ENV === 'production'`.

### How do I specify development-only behavior?

Check if `process.env.NODE_ENV !== 'production'`.

## The `electron-vue` template

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[e04a5b5](https://github.com/SimulatedGREG/electron-vue/tree/e04a5b5f09f63265939e00c9dc59a612d9da5bc8) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
