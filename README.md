[![NPM](https://img.shields.io/npm/v/@blackprint/nodes-telegram.svg)](https://www.npmjs.com/package/@blackprint/nodes-telegram)
[![Build Status](https://github.com/Blackprint/nodes-telegram/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/Blackprint/nodes-telegram/actions/workflows/build.yml)

## Blackprint nodes for Telegram
This module is depends on [gramjs](https://github.com/gram-js/gramjs) (MIT License). Please click this [link](https://blackprint.github.io/#page/sketch/1#;openExample:github.com/Blackprint/nodes-telegram) to open examples from the editor.

## Import this nodes from URL
Please specify the version to avoid breaking changes.

```js
Blackprint.loadModuleFromURL([
  'https://cdn.jsdelivr.net/npm/@blackprint/nodes-telegram@0.0.x/dist/nodes-telegram.mjs'
], {
  // Turn this on if you want to load .sf.js, and .sf.css
  // only with single .mjs
  loadBrowserInterface: true // set to "false" for Node.js/Deno
});
```

## Development URL
You can use this link to load unpublished nodes and still under development on GitHub.
https://cdn.jsdelivr.net/gh/Blackprint/nodes-telegram@dist/nodes-telegram.mjs

Replace `dist` with your latest commit hash (from `dist` branch) to avoid cache from CDN.

### License
MIT