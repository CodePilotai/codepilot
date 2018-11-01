# Our design system

This guide serves to help us maintain consistent design and behavior within our app, while simultaneously making it easier to prototype quickly.

## Table of contents

1.  What problem are we trying to solve?
2.  What's the design system in our app?
3.  Tools in our design system
4.  Tips for maintaining consistency and clarity

## What problem are we trying to solve?

> "Cosmos is a Greek word for the order of the universe. It is, in a way, the opposite of Chaos. It implies the deep interconnectedness of all things. It conveys awe for the intricate and subtle way in which the universe is put together." - Carl Sagan

You are gods. And this codebase is your universe. If you say, let there be `background: orange`, there _will_ be an orange background. You make all the rules. You know the rules.

And that's the difference between Cosmos and Chaos: **rules**. And what makes good rules is **consistency**. They're predictable and as simple as possible.

Now let's bring this back to code. CSS frameworks like Bootstrap come with lots of rules in their documentation. If you follow the rules, your site will be consistent in how it looks and works.

One of Bootstrap's rules is you must combine these exact elements and classes to create a dismissible warning alert that fades out when the user closes it:

```html
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  <strong>Warning!</strong> There are validation errors in the fields below.
</div>
```

If you change _any_ details - misusing an element or class - something breaks. Maybe the alert won't dismiss. Or the alert button won't show up. Or the alert might have the wrong color. Or it won't fade out. Or maybe the padding will be a little bit off.

Either way, it won't look/work like the other alerts on your site, causing inconsistency. This creates bugs and confuses users and other developers (including yourself, in the future).

After enough inconsistencies, they become overwhelming. You don't want to show up to work anymore. You're afraid to change anything, in fear that it might break something else. You don't have simple rules to follow anymore. You become this person:

[![Dangerous game of Jenga](https://i.imgur.com/Syd3w3O.jpg)](https://pixabay.com/en/jenga-balance-sensitivity-stability-1941500/)

Because, perhaps unusually for gods, the rules you're making are for _you_. You're not just the gods, but inhabitants of this universe.

That comes with a lot of responsibility. Imagine if in real life, everyone had to power to redefine how gravity works. One day, Steve sees his glass of water from across the room and decides, "You know, I don't really want to get up. What if I just defined a new rule where glasses of water will fall towards you if stare at them and squint your eyes for 3 seconds."

Suddenly, world-wide panic. People everywhere are being attacked by glasses of water and no one knows why. Some people suggest the theory that maybe the water became offended after looking at it the wrong way. Then one day an astronomer is watching Pluto, a dwarf planet full of water and encased in glassy ice and rock. She squints, then stares for just a second too long.

Before it's too late, someone finds the offending line of code in the universe, does a `git blame`, and everyone gets upset with Steve for committing directly to master without a PR.

Let's learn from Steve's mistake. In this case, he not only committed directly to master, but he didn't think of the bigger picture. He made a local exception to a rule, without asking important questions like:

* _Should_ glasses of water be in charge of defining their own gravity? Or should that work the same everywhere?
* What could be affected by this change?
* Could this cause any unexpected (i.e. inconsistent) behavior?
* What problem are we trying to solve? Is this really the best solution (i.e. simplest long-term)?

These are great questions to ask ourselves when developing features -- and _each other_ when reviewing PRs. Far more important than getting the feature done today, is making sure we'll still want to build features tomorrow.

## What's the design system in our app?

Our design system is our Vue components. The `App`-prefixed components are its building blocks. We'll put _a lot_ of thought into these building blocks, like buttons and links, so that we when we use them to develop features, we can focus our brainpower on the feature.

Unlike the Bootstrap example:

```html
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  <strong>Warning!</strong> There are validation errors in the fields below.
</div>
```

We can write components so that they're impossible to misuse:

```html
<AppAlert type="warning">
  There are validation errors in the fields below.
</AppAlert>
```

This hypothetical component can do the same work as the Bootstrap example, but all the implementation details are hidden. All you have to remember is that you're displaying an alert and that this alert is a warning.

We can even make the `type` prop required, so that you see an error in the console if you forget it. We can also add a `validate` function to the prop, so that if the value isn't valid (e.g. `"asdf", "1", etc)`, we throw an error.

**If we're smart when we build the components, we're allowed to be dumb when we use them.**

Because the `App`-prefixed components are so basic, we're globally importing them everywhere, so that you don't have to worry about registering them.

## Tools in our design system

### Components

See our [Vue docs](../../README.md#vue) for an overview of our components. Beyond what's there, we're also following the [official Vue Style Guide](https://vue-style-guide-dev.surge.sh/v2/guide/style-guide.html) (currently pre-release) to follow best practices in our components. Most notably, there are two special **component prefixes** we're using:

#### [`App`-prefixed components](https://vue-style-guide-dev.surge.sh/v2/guide/style-guide.html#Generic-component-names)

These components typically do little more than apply styling and conventions specific to our app. They never connect to our global Vuex state, instead accepting all data through props.

They're base components that are often reused many times throughout our app and for that reason, **these are the only components that are globally registered**. Instead of importing and listing them as a dependency in the `components` option, we can simply use the PascalCase version of their filename in any component template.

When prototyping features, these are the building blocks we'll use to focus on _what_ we're building, rather than reinventing the same elements and styles across multiple components.

#### [`The`-prefixed components](https://vue-style-guide-dev.surge.sh/v2/guide/style-guide.html#Single-instance-component-names)

The definite article communicates that these components are _not_ reusable. That means there can only exist a single active instance in the entire application. Some indications of a single-instance component:

* If an element inside the component is given a unique id, it cannot be reused.
* If the component's primary purpose is to visually represent a unique piece of global state (e.g. `state.search.results` or `state.interface.viewable`).

We generally want to avoid too many of these single-instance components, except in cases where there really should only be one instance of the component from the user's perspective. For example, more than one primary search input would probably confuse users.

### CSS

See our [CSS docs](../../README.md#css) for an overview of our CSS tools and conventions.

## Tips for maintaining consistency and clarity

### Creating new classes

Given the fact that we use TailwindCSS, try not to create any new classes unless really needed.

If you have to create new classes mind the following suggestions.

Pay attention to the names you give classes. Make sure they clearly describe what you're naming and that nothing else within the component could have that name. (This also applies to naming anything else in programming! 🙂)

If you're creating a class that you _might_ want to reuse in another component later, stop and ask a few questions. As an example, we'll use the specific example of a `list-of-links` class.

* Do I _actually_ want this list to look different from all other lists?
* If I created another list of links in another component, would it share these same styles?
* What's the larger problem I'm trying to solve?

Questions like this will make it easier for you figure out where, what, and how to add new classes.

### Creating new components

Here's a golden rule (well, more of a guideline): if I asked you to list all the data/state and coordination a component is in charge of, you should be able to answer quickly, in a single sentence, from memory. If you can't, this is a sign that the component has grown too complex, so it might be time to break out into one or more new components.

Also, if you find yourself wanting to use the same code over and over again, this is a good sign that you really want a new base component.

### What deserves to be a global style?

Things that don't have to do with the specific logic or structure of our app. These will typically be raw elements and generic classes for managing layout.

Global styles should be stored in `src/renderer/assets/styles`. You can make use of Tailwind’s `@apply` there.

### When should styles be modularized (specific to the component)?

Always, unless they meet the criteria for a global style like above.

### What variables do we put in `branding.scss` vs component-specific CSS?

Anything that we _might_ want to reuse across different components goes in branding.scss. Anything else can be defined in variables at the top of the `<style>` tag in Vue components.

### What kinds of values is it safe to use in a CSS property?

We want to build styles so that changing a single value will always change _all the things_ that are relevant. That means whenever possible, values are inherited from variables in `branding.scss`. That means before making something a specific color, size, etc, ask "Why?" Why is it different? What kind of thing is it? And how can we ensure that all of the related things will always share that characteristic?

### Theming

To support themes, we rely on using CSS Variables. This is why the variables inside branding.scss are constructed as follows:

```scss
$exmaple-variable-name: var(--example-variable-name, $default-value);
```

This somewhat prevents us from using Sass functions like `darken`, since it requires the argument to be a color value. To omit this limitation, one should create a new variable that utilises that function. For example:

```scss
$exmaple-darker-color: var(--example-darker-color, darken($example-color, 20%));
```

The CSS variables names should match the Sass variable names. Themes are based on a JSON file – keys should match the CSS variable names. Check out the Atom inspired theme here: `src/themes/atom-dark.json`.
