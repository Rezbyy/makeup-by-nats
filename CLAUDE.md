# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Viewing the Site

No build step. Open any HTML file directly in a browser, or use VS Code Live Server (right-click → Open with Live Server) for auto-reload at `http://127.0.0.1:5500`.

## Architecture

Pure static site — 6 HTML pages, one CSS file, one JS file. No framework, no bundler, no package.json.

```
index.html        # Homepage
about.html        # My Story / team
services.html     # Four service details + process steps
gallery.html      # Filterable masonry grid + before/after slider
bridal.html       # Testimonials, FAQ accordion, enquiry form
contact.html      # Contact cards + lightweight enquiry form
assets/css/style.css   # All styles — single file
assets/js/main.js      # All interactivity — single file
```

External CDNs loaded via `<script>` at the bottom of every page:
- **GSAP + ScrollTrigger** (cdnjs) — parallax on hero/CTA backgrounds, staggered card entrances
- **Swiper.js** (jsdelivr) — testimonial carousel on homepage and bridal page
- **Google Fonts** — Cormorant Garamond (headings) + Montserrat (body)

## CSS Conventions

All design tokens live in `:root` at the top of `style.css`. Key variables:
- `--black`, `--white`, `--cream`, `--nude`, `--gold`, `--gold-light`
- `--font-heading` (Cormorant Garamond), `--font-body` (Montserrat)
- `--section-pad: 120px` — standard vertical section padding
- `--t` — standard transition shorthand

Scroll-reveal system: add class `.reveal`, `.reveal-left`, `.reveal-right`, or `.reveal-scale` to any element. JS (`IntersectionObserver`) appends `.visible` when the element enters the viewport. Stagger via `.delay-1` through `.delay-6`.

## JS Conventions

`main.js` runs on every page and self-guards with `querySelector` null checks before initialising each feature, so unused features on a given page are silently skipped.

Key data attributes driven by JS:
- `data-target="150" data-suffix="+"` → animated counter on scroll
- `data-filter="western"` on `.gallery-grid-item` → filter button system
- `data-category` is the matching attribute on gallery items
- `data-size="tall"` / `data-size="wide"` → CSS grid span overrides on gallery items

GSAP is used only if `typeof gsap !== 'undefined'` — graceful fallback if CDN fails.

## Shared Page Structure

Every page follows the same shell:
1. `.loader` overlay (removed after 1.4 s on `window load`)
2. `<nav class="nav">` — becomes `.scrolled` (solid black) after 60 px scroll
3. `.nav-mobile` — full-screen overlay, toggled by `.nav-hamburger`
4. Page-specific content
5. Shared `<footer class="footer">`
6. Three `<script>` tags: GSAP, Swiper, then `assets/js/main.js`

The nav `active` class is set by JS matching `window.location.pathname` against each link's `href`.

## Placeholder Content to Replace

All placeholder values are marked consistently so they're easy to grep:

| What | Current value | Where |
|---|---|---|
| All images | `picsum.photos/seed/…` | Every HTML file |
| Email | `hello@makeupbynats.com` | All footers + contact.html |
| Phone | `+64 — — — — — —` | All footers + contact.html |
| Location | `New Zealand` | All footers + contact.html |
| Social links | `href="#"` | All footers |
| Team names | "Senior MUA", "Assistant MUA" | about.html |

Social icon labels in the footer use plain text (`Ig`, `Fb`, `Tk`) — swap for SVG icons or a font icon library when social URLs are confirmed.
