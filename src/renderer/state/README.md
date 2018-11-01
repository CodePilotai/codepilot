# State

## Helpers

These state helpers are the frontend's interface to the Vuex store. Depending on component's concerns, we can import a subset of them.

Why not just automatically inject all of these into every component? Well, then it could be difficult to figure out where a particular part of state is coming from. As our state becomes increasingly complex, the risk would also increase of accidentally using the same name in our component. This way, the component remains traceable, as the necessary `import` will provide a thread back to our helpers file if we ever don't understand where something is coming from.

## Modules

This is where the heavy lifting of most shared application state lives. See more on Vuex modules at:

https://vuex.vuejs.org/en/modules.html
