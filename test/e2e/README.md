# End-to-End Testing

## Setup

``` bash
# Install dependencies
yarn install

# Run end-to-end tests
yarn e2e

# Before pushing test code, lint all JS files in `e2e`
yarn lint
```

#### File Structure

``` bash
codepilot-vue
|- test
|  |- unit # unit tests
|  |- e2e
|  | |- fixtures/ # contains mock search directories
|  | |- specs/ # contains our e2e tests
|  | |- index.js # entry point to Mocha
|  | |- utils.js # includes beforeEach and afterEach functions that handle the setup/teardown process

```

#### What is an end-to-end test?

It's a test for our full, running app, simulating what the user would do and checking what the user would see. Typically, end-to-end tests are separated into groups of behavior, such as launch, registration, subscribing, searching, etc.

#### Spectron

Our end-to-end tests are using Spectron to give us access to our electron app via `this.app` in our `describe` blocks. Spectron uses ChromeDriver and WebDriverIO. WebDriverIO APIs can be accessed in our `describe` blocks via `this.app.client`.

A few notes:

  - [Docs for `this.app`](https://github.com/electron/electron/blob/master/docs/api/app.md)
  - [Docs for `this.app.client`](https://github.com/electron/electron/blob/master/docs/api/browser-window.md)

#### How to create an end-to-end test

Inside the `specs/` directory, create a new test spec file using the following format `some-behavior.spec.js` where `some-behavior` describes the behavior you wish to test. For example, `registration.spec.js`.

For all of our tests, we use the BDD syntax, where you **describe** the thing you want to test and the behavior **it** should have.

In the newly created `spec.js` file, add a `describe` block that **describes** the thing you want to test.

``` js
const utils = require('../utils')

describe('Registration', function () {
  beforeEach(utils.beforeEach) // Base function that handles the setup process
  afterEach(utils.afterEach) // Base function that handles the teardown process
  // test cases for behavior(s) that registration should have
  ...
})
```

Thereafter, add in the `describe` block as many test cases needed using the following syntax:

``` js
it('shows the `registration complete` notification', function () {
  // add some assertion. For example, expect(foo).to.equal('bar'). Make sure to avoid boolean expectations such as expect(foo === 'bar').to.equal(true).
})
```

##### Putting it all together

``` js
const utils = require('../utils')

describe('Registration', function () {

  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)

  it('shows the `registration complete` notification', function () {
    const {client} = this.app // Accesses WebDriverIO APIs
    return client
      // Click on the registration button
      // click(selector) where selector is the element to click on
      .click('#RegistrationComponent-el')
      // It may take some time for the registration notification to be created
      // so we have to wait until it is created
      // using waitUntil(condition[,timeout][,timeoutMsg][,interval]) see   http://webdriver.io/api/utility/waitUntil.html
      .then(() => client.waitUntil(function () { return client.getText(
      '[data-e2e="RegistrationComponent-registrationNotification"]') }, 3000))
      // When we need a unique attribute for testing, we use the following
      // notation `data-e2e="ComponentName-elementName"`
      // It may be necessary to add a unique attribute to elements that do not yet exist
      // or else the test will fail because client.getText will search for an element
      // by selector and that element has not yet been created

      // Confirm that register notification displays registration message
      .then(message => {
        expect(message).to.equal('Registration complete')
      })
  })
})
```

It should be noted that under certain circumstances, ES2015 arrow functions cannot be used in test cases --
as the context of `this` may be overwritten. For more information see: [electron-vue's end-to-end testing docs ](https://simulatedgreg.gitbooks.io/electron-vue/content/en/end-to-end_testing.html)
