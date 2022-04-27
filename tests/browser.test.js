require("@blackprint/engine");

// === For Browser Environment ===
window.sf = require("scarletsframe/dist/scarletsframe.min.js");
window.ResizeObserver = class{};
require("@blackprint/sketch/dist/blackprint.min.js");
require("@blackprint/sketch/dist/blackprint.sf.js");
// === For Browser Environment ===

test('Blackprint.Sketch does exist on window', () => {
  expect(window.Blackprint.Sketch).toBeDefined();
});

// test('Load custom node modules', () => {
// 	require('../dist/nodes-telegram.mjs');
// 	require('../dist/nodes-telegram.sf.mjs');
// });