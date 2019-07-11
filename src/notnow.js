function notnow(opts) {
	opts = opts || {};

	const target = opts.target || document.body;
	const lazyClass = "." + (opts.class || "lazy");
	const mutations = opts.mutations || false;
	const willLoad = opts.willLoad;
	const threshold = "threshold" in opts ? opts.threshold : 200 + "px 0%";
	const dataAttrs = ["srcset", "src", "poster"];

	const win = window;
	const IO = "IntersectionObserver";
	const IOentry = IO + "Entry";
	const supportsIO = IO in win && IOentry in win && "isIntersecting" in win[IOentry].prototype;

	function queryDOM(selector, root) {
		return root.querySelectorAll(selector);
	}

	let pending = new Set();
	let loaded = new Set();
/*
	let isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

	if (isIE11)
		NodeList.prototype.forEach = Array.prototype.forEach;
*/
	queryDOM(lazyClass, target).forEach(el => pending.add(el));

	// load instantly
	if (!supportsIO || /baidu|(?:google|bing|yandex|duckduck)bot/i.test(navigator.userAgent)) {
		pending.forEach(load);
		return;
	}

	function load(el) {
		willLoad && willLoad(el);

		if (el.dataset.url)
			el.style.backgroundImage = "url(" + el.dataset.url + ")";
		else {
			flipAttrs(el);

			let nodeName = el.nodeName;

			if (nodeName == "PICTURE" || nodeName == "VIDEO")
				queryDOM("source, img", el).forEach(flipAttrs);

			el.autoplay && win.requestAnimationFrame(() => el.load());
		}

		pending.delete(el);
		loaded.add(el);
	}

	function flipAttrs(el) {
		dataAttrs.forEach(dataAttr => {
			if (dataAttr in el.dataset)
				el[dataAttr] = el.dataset[dataAttr];
		});
	}

	let iO = new win[IO](entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const el = entry.target;
				load(el);
				unwatch(el);

				if (!pending.size == 0 && !mutations)
					iO.disconnect();
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
		let mO = new MutationObserver(() => {
			queryDOM(lazyClass, target).forEach(el => {
				if (!loaded.has(el) && !pending.has(el)) {
					pending.add(el);
					watch(el);
				}
			});

			// detect detached nodes
			loaded.forEach(el => {
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

module.exports = notnow;