// @ts-check

import replace from '@rollup/plugin-replace'
import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import packages from './package.json' assert { type: 'json' }

const banner = `/*! ${packages.name} v${packages.version} @license ${packages.license} */`

const baseConfig = {
  input: {
    [packages.name]: './src/index.ts',
  },
  plugins: [
    esbuild(),
  ],
  external: [
    ...Object.keys(packages.dependencies),
    'fs',
    'fs/promises',
  ],
  treeshake: {
    moduleSideEffects: false,
  },
}

export default defineConfig([{
  ...baseConfig,
  output: [
    { format: 'esm', dir: 'dist', entryFileNames: '[name].mjs', banner },
    { format: 'cjs', dir: 'dist', entryFileNames: '[name].cjs.js', banner },
  ],
}, {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    replace({
      preventAssignment: true,
      values: { 'typeof document': JSON.stringify('object') },
    }),
  ],
  output: [
    { format: 'esm', dir: 'dist', entryFileNames: '[name].browser.mjs', banner },
    { format: 'cjs', dir: 'dist', entryFileNames: '[name].browser.cjs.js', banner },
    { format: 'iife', name: 'isomorphicImageHash', dir: 'dist', entryFileNames: '[name].js', banner },
  ],
}])
