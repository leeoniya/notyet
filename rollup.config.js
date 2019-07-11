const fs = require('fs');

import cjs from 'rollup-plugin-cjs-es';
import buble from 'rollup-plugin-buble';
import { terser } from 'rollup-plugin-terser';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const ver = "v" + pkg.version;
const urlVer = "https://github.com/leeoniya/notnow (" + ver + ")";
const banner = [
	"/**",
	"* Copyright (c) " + new Date().getFullYear() + ", Leon Sorokin",
	"* All rights reserved. (MIT Licensed)",
	"*",
	"* notnow.js",
	"* Lazy image & media loader",
	"* " + urlVer,
	"*/",
	"",
].join("\n");

export default [
	{
		input: './src/notnow.js',
		output: {
			name: 'notnow',
			file: './dist/notnow.umd.js',
			format: 'umd',
			banner,
		},
		plugins: [
			cjs({nested: true, cache: false}),
			buble(),
		]
	},
	{
		input: './src/notnow.js',
		output: {
			name: 'notnow',
			file: './dist/notnow.cjs.js',
			format: 'cjs',
			banner,
		},
		plugins: [
			cjs({nested: true, cache: false}),
			buble(),
		]
	},
	{
		input: './src/notnow.js',
		output: {
			name: 'notnow',
			file: './dist/notnow.min.js',
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