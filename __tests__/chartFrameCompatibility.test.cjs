const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const React = require('react');
const { renderToString } = require('react-dom/server');
const ts = require('typescript');

test('Victory Frame renders its border with the installed Skia path API', async () => {
  const skiaRoot = path.dirname(require.resolve('@shopify/react-native-skia/package.json'));
  const init = require(require.resolve('canvaskit-wasm/bin/full/canvaskit.js', { paths: [skiaRoot] }));
  const wasmBinary = fs.readFileSync(require.resolve('canvaskit-wasm/bin/full/canvaskit.wasm', { paths: [skiaRoot] }));
  const engine = await init({ wasmBinary });
  const { JsiSkApi } = require(path.join(skiaRoot, 'lib/commonjs/skia/web/JsiSkia.js'));
  const Skia = JsiSkApi(engine);
  const frameSource = path.resolve(path.dirname(require.resolve('victory-native')), '../src/cartesian/components/Frame.tsx');
  const code = ts.transpileModule(fs.readFileSync(frameSource, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
  }).outputText;
  const exports = {};
  const drawnPaths = [];
  // Replace UI elements, but exercise Victory's actual Frame and real Skia WASM.
  vm.runInNewContext(code, {
    exports,
    require(id) {
      if (id === 'react') return React;
      if (id === 'react-native') return { StyleSheet: { hairlineWidth: 1 } };
      if (id.endsWith('/axisDefaults')) return {};
      if (id === '@shopify/react-native-skia') return {
        Skia,
        Group: ({ children }) => React.createElement(React.Fragment, null, children),
        Path: ({ path: border }) => { drawnPaths.push(border); return null; },
        Line: () => null,
      };
      throw new Error(`Unexpected import: ${id}`);
    },
  });
  const scale = Object.assign((n) => n, { domain: () => [0, 100] });
  renderToString(React.createElement(exports.Frame, {
    xScale: scale, yScale: scale, lineWidth: 1, lineColor: '#000',
  }));
  assert.equal(drawnPaths.length, 1);
  const bounds = drawnPaths[0].getBounds();
  assert.deepEqual([bounds.x, bounds.y, bounds.width, bounds.height], [0, 0, 100, 100]);
});
