const fs = require('fs');

import cjs from 'rollup-plugin-cjs-es';
import buble from 'rollup-plugin-buble';
import { terser } from 'rollup-plugin-terser';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const ver = "v" + pkg.version;
const urlVer = "https://github.com/leeoniya/notyet (" + ver + ")";
const banner = [
	"/**",
	"* Copyright (c) " + new Date().getFullYear() + ", Leon Sorokin",
	"* All rights reserved. (MIT Licensed)",
	"*",
	"* notyet.js (NotYet)",
	"* Lazy image & media loader",
	"* " + urlVer,
	"*/",
	"",
].join("\n");

export default [
	{
		input: './src/notyet.js',
		output: {
			name: 'notyet',
			file: './dist/notyet.umd.js',
			format: 'umd',
			banner,
		},
		plugins: [
			cjs({nested: true, cache: false}),
			buble(),
		]
	},
	{
		input: './src/notyet.js',
		output: {
			name: 'notyet',
			file: './dist/notyet.cjs.js',
			format: 'cjs',
			banner,
		},
		plugins: [
			cjs({nested: true, cache: false}),
			buble(),
		]
	},
	{
		input: './src/notyet.js',
		output: {
			name: 'notyet',
			file: './dist/notyet.min.js',
			format: 'umd',
			banner: "/*! " + urlVer + " */",
		},
		plugins: [
			cjs({nested: true, cache: false}),
			buble(),
			terser({
				output: {
					comments: /^!/
				}
			}),
		]
	},
]