const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const bootstrap = ts.transpileModule(
  fs.readFileSync(path.join(__dirname, '../index.web.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;

function runBootstrap() {
  let resolve, reject, options;
  const ready = new Promise((yes, no) => { resolve = yes; reject = no; });
  const events = [], alerts = [], errors = [];
  vm.runInNewContext(bootstrap, {
    exports: {},
    require(id) {
      if (id === '@expo/metro-runtime') return {};
      if (id === '@shopify/react-native-skia/lib/module/web') {
        return { LoadSkiaWeb(opts) { options = opts; events.push('loading'); return ready; } };
      }
      if (id === 'expo-router/entry') { events.push('router'); return {}; }
      throw new Error(`Unexpected import: ${id}`);
    },
    console: { error(...args) { errors.push(args); } },
    document: {
      createElement: () => ({ setAttribute(name, value) { this[name] = value; } }),
      body: { appendChild(node) { alerts.push(node); } },
    },
  });
  return { resolve, reject, events, alerts, errors, options };
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

test('Router (and chart modules) cannot load before CanvasKit is ready', async () => {
  const run = runBootstrap();
  assert.deepEqual(run.events, ['loading']);
  assert.equal(run.options.locateFile('canvaskit.wasm'), '/canvaskit.wasm');
  run.resolve();
  await flush();
  assert.deepEqual(run.events, ['loading', 'router']);
  assert.equal(run.alerts.length, 0);
});

test('CanvasKit failure leaves Router unloaded and displays an accessible retry message', async () => {
  const run = runBootstrap();
  run.reject(new Error('WASM request failed'));
  await flush();
  assert.deepEqual(run.events, ['loading']);
  assert.equal(run.errors.length, 1);
  assert.equal(run.alerts.length, 1);
  assert.equal(run.alerts[0].role, 'alert');
  assert.match(run.alerts[0].textContent, /reload/i);
});

test('generated CanvasKit asset matches the installed Skia dependency', () => {
  const skiaPath = require.resolve('@shopify/react-native-skia/package.json');
  const source = require.resolve('canvaskit-wasm/bin/full/canvaskit.wasm', {
    paths: [path.dirname(skiaPath)],
  });
  assert.deepEqual(fs.readFileSync(path.join(__dirname, '../public/canvaskit.wasm')), fs.readFileSync(source));
});

test('real CanvasKit initialization fixes the XYWHRect failure', async () => {
  const skiaPath = path.dirname(require.resolve('@shopify/react-native-skia/package.json'));
  const { JsiSkApi } = require(path.join(skiaPath, 'lib/commonjs/skia/web/JsiSkia.js'));
  // Reproduce the reported error when Skia captures an uninitialized engine.
  assert.throws(() => JsiSkApi(undefined).XYWHRect(2, 3, 10, 20), /XYWHRect/);
  const init = require(require.resolve('canvaskit-wasm/bin/full/canvaskit.js', { paths: [skiaPath] }));
  const wasmBinary = fs.readFileSync(require.resolve('canvaskit-wasm/bin/full/canvaskit.wasm', { paths: [skiaPath] }));
  const engine = await init({ wasmBinary });
  const rect = JsiSkApi(engine).XYWHRect(2, 3, 10, 20);
  assert.deepEqual([rect.x, rect.y, rect.width, rect.height], [2, 3, 10, 20]);
});
