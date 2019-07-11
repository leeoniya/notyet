/**
* Copyright (c) 2019, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* notnow.js
* Lazy image & media loader
* https://github.com/leeoniya/notnow (v0.1.0)
*/

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.notnow = factory());
}(this, function () { 'use strict';

	function notnow(opts) {
		opts = opts || {};

		var target = opts.target || document.body;
		var lazyClass = "." + (opts.class || "lazy");
		var mutations = opts.mutations || false;
		var willLoad = opts.willLoad;
		var threshold = "threshold" in opts ? opts.threshold : 200 + "px 0%";
		var dataAttrs = ["srcset", "src", "poster"];

		var win = window;
		var IO = "IntersectionObserver";
		var IOentry = IO + "Entry";
		var supportsIO = IO in win && IOentry in win && "isIntersecting" in win[IOentry].prototype;

		function queryDOM(selector, root) {
			return root.querySelectorAll(selector);
		}

		var pending = new Set();
		var loaded = new Set();
	/*
		let isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

		if (isIE11)
			NodeList.prototype.forEach = Array.prototype.forEach;
	*/
		queryDOM(lazyClass, target).forEach(function (el) { return pending.add(el); });

		// load instantly
		if (!supportsIO || /baidu|(?:google|bing|yandex|duckduck)bot/i.test(navigator.userAgent)) {
			pending.forEach(load);
			return;
		}

		function load(el) {
			willLoad && willLoad(el);

			if (el.dataset.bg)
				{ el.style.backgroundImage = "url(" + el.dataset.bg + ")"; }
			else {
				flipAttrs(el);

				var nodeName = el.nodeName;

				if (nodeName == "PICTURE" || nodeName == "VIDEO")
					{ queryDOM("source, img", el).forEach(flipAttrs); }

				el.autoplay && win.requestAnimationFrame(function () { return el.load(); });
			}

			pending.delete(el);
			loaded.add(el);
		}

		function flipAttrs(el) {
			dataAttrs.forEach(function (dataAttr) {
				if (dataAttr in el.dataset)
					{ el[dataAttr] = el.dataset[dataAttr]; }
			});
		}

		var iO = new win[IO](function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					var el = entry.target;
					load(el);
					unwatch(el);

					if (!pending.size == 0 && !mutations)
						{ iO.disconnect(); }
				}
			});
		}, {rootMargin: threshold});

		pending.forEach(watch);

		function watch(el) {
			iO.observe(el);
		}

		function unwatch(el) {
			iO.unobserve(el);
		}

		function isInTarg(node) {
			return node == target || target.contains(node);
		}

		if (mutations) {
			var mO = new MutationObserver(function () {
				queryDOM(lazyClass, target).forEach(function (el) {
					if (!loaded.has(el) && !pending.has(el)) {
						pending.add(el);
						watch(el);
					}
				});

				// detect detached nodes
				loaded.forEach(function (el) {
					if (!isInTarg(el)) {
						loaded.remove(el);
						unwatch(el);
					}
				});
			});

			mO.observe(target, {
				childList: true,
				subtree: true,
			//	characterData: false,		// needed?
			});
		}
	}

	return notnow;

}));
