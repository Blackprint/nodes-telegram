[![NPM](https://img.shields.io/npm/v/bp-your-nodes.svg)](https://www.npmjs.com/package/bp-your-nodes)
[![Build Status](https://github.com/blackprint/template-js/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/blackprint/template-js/actions/workflows/build.yml)

## Your project name
Description here

## Import this nodes from URL
Please specify the version to avoid breaking changes.

```js
Blackprint.loadModuleFromURL([
  'https://cdn.jsdelivr.net/npm/bp-your-nodes@0.0.1/dist/nodes-rename-me.mjs'
], {
  // Turn this on if you want to load .sf.js, and .sf.css
  // only with single .mjs
  loadBrowserInterface: true // set to "false" for Node.js/Deno
});
```

## Development URL
You can use this link to load unpublished nodes and still under development on GitHub.
> `https://cdn.jsdelivr.net/gh/your-username/repo-name@dist/nodes-rename-me.mjs?1`

Please append `/url-here?random-number` if your browser still using the cached files after the repository was updated.

### License
MIT