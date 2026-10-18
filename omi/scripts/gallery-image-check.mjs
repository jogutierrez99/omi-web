import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const load = createRequire(import.meta.url);
const ts = load('typescript');
const React = load('react');
const { renderToStaticMarkup } = load('react-dom/server');
const source = fs.readFileSync(new URL('../src/components/gallery/GalleryMedia.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
const component = { exports: {} };
vm.runInThisContext(`(function(require, module, exports) { ${compiled}\n})`)(load, component, component.exports);
const html = renderToStaticMarkup(React.createElement(component.exports.GalleryMedia, { item: {
  id: 'image-test', type: 'image', src: '/media/galeria/omi-familia.jpg', title: 'Imagen de prueba',
  description: 'Descripción accesible de prueba', width: 1280, height: 720,
} }));
assert.match(html, /<img/);
assert.match(html, /alt="Descripción accesible de prueba"/);
assert.match(html, /Ampliar Imagen de prueba/);
assert.doesNotMatch(html, /<video/);
console.log('PASS: image variant renders Next Image, alt text and expand action without video controls. No sample content added.');
