## NotYet

Lazy image & media loader _(MIT Licensed)_

---
### Introduction

NotYet is a lazy image & media loader created from Jeremy Wagner's excellent [yall.js](https://github.com/malchata/yall.js), but significantly refactored and exposes a different API.

**Features** (inherited from yall.js)

- Tiny (~1.5k min)
- Can lazy-load images, backgrounds, videos & iframes
- Supports SEO by instantly loading for common bot user-agents
- Requires IntersectionObserver
- Can use MutationObserver to track DOM changes

**Differences**

- No mutation of `classList` or `className` [Issue #59](https://github.com/malchata/yall.js/issues/59)
- Backgrounds are lazy-loaded by setting `.lazy` and `data-bg` instead of `.lazy-bg` (NotYet will set `element.style.backgroundImage` rather than `classList`).
- If IntersectionObserver is absent, falls back to instant loading [Issue #51](https://github.com/malchata/yall.js/issues/51)
- `.lazy` should be set on `<picture>` rather than a child `<img>` fallback element. Note that by default `<picture>` is an [inline element](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements#Elements) which will not vertically expand to the size of its contents; simply set it to something like `picture { display: inline-block }` in your base stylesheet.
- No event binding pass-through (https://github.com/malchata/yall.js#events)
- `willLoad(element)` event
- No use of requestIdleCallback - this use case does not benefit much from it
- Can be isolated to specific container elements
- Fewer configurable options
- Smaller devDeps (13.9 MB vs 35.4 MB)

---
### API

```html
<body>
    <img class="lazy" src="placeholder.jpg" data-src="1x.jpg" data-srcset="2x.jpg 2x, 1x.jpg 1x">

    <picture class="lazy">
        <source data-srcset="2x.webp 2x, 1x.webp 1x" type="image/webp">
        <img src="placeholder.jpg" data-src="1x.jpg" data-srcset="2x.jpg 2x, 1x.jpg 1x">
    </picture>

    <video class="lazy" data-poster="placeholder.jpg" controls preload="none">
      <source src="video.webm" type="video/webm">
      <source src="video.mp4" type="video/mp4">
    </video>

    <iframe class="lazy" data-src="iframe.html"></iframe>

    <div class="lazy" data-bg="background.jpg"></div>
</body>
```

```js
document.addEventListener("DOMContentLoaded", () => {
    notyet({
        target: document.body,
        mutations: true,
        class: "lazy",
        threshold: 200,
        willLoad: el => {
            console.log(el);
        }
    });
});
```