# Services

These services are all built to be executed in a forked process (e.g. in `src/renderer/state/modules/interface.js`). The advantage is that these expensive operations will not block the main thread use by the UI, preventing interface freezes.

Each service is its own mini-application, compiled separately from the rest of the app. That means you can reference dependencies, but you should never have to reference source files outside of the `src/services` directory. If you want to create multiple files for a service, create a folder by the same name and add any other files there.

## Refactor Ideas

- It might be useful to develop a service wrapper in `index.js`, allowing services to be created and consumed in a normal promise interface, created by a key passed to the promise function to share/split processes. I (Chris) have never done this before, but I think it should be manageable.

## Optimization Ideas

- Turn code highlighting into a stream that chunks work into ~50 lines at a time, so earlier code is prioritized rather than waiting for the entire file to finish. However, as long as the language is sometimes detected from the file content, there's a risk of some parts of a file being highlighted using a different syntax.
- Move from highlight.js to prism.js (perhaps via node-prismjs), as it's supposed to be faster.
