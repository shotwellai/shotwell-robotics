# Shotwell Robotics

The company website for Shotwell's construction robotics work, with a dedicated product section for its drywall application robot and quality-check robot.

**Production:** https://shotwellrobotics.com

## Local preview

This is a static HTML, CSS, and JavaScript site. No build step or package installation is required. Serve the directory over HTTP so the self-hosted Three.js modules load:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Then visit http://localhost:8766.

## Editing

- `index.html`: page content, navigation, metadata, and contact links.
- `styles.css`: responsive layout and visual styles.
- `script.js`: mobile navigation and footer year.
- `robots.js`: procedural solid robot models, materials and lighting, responsive cameras, automatic rotation, and reduced-motion handling.
- `assets/`: Shotwell branding, Lucide icons, and self-hosted Three.js modules.

The contact links open an email draft to `hello@shotwellrobotics.com`. There is no form backend, analytics, tracking, or collection of submissions on this site. Fonts load from Google Fonts. The page presents robotics as in development, without claims of deployed products or customer results. Renderings are conceptual hardware studies, not CAD models or final industrial designs; they imply no dimensions or performance specifications.

All robot visuals are solid 3D geometry with shaded materials and soft ground shadows. The two products share a wheeled base and telescoping mast; the drywall robot adds an articulated application arm, while the quality-check robot adds a camera and LiDAR. Product views rotate automatically through a full turn and support mouse-drag orbit, resuming rotation after dragging. One-finger touch gestures remain available for page scrolling. Automatic movement is disabled for reduced-motion preferences, and offscreen or hidden-page scenes are not rendered.

## Deployment

GitHub Pages publishes the root of `main`. Push a commit to deploy; check the repository's Actions tab for the Pages build. `.nojekyll` disables Jekyll processing. `CNAME` sets the canonical domain to `shotwellrobotics.com`.

DNS is managed at Porkbun:

| Name | Type | Value |
| --- | --- | --- |
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| www | CNAME | shotwellai.github.io |

GitHub Pages provisions the HTTPS certificate and redirects `www` to the canonical apex domain. No API keys are needed to edit or deploy the site, and credentials must never be committed.

## Assets and attribution

- Robot renderings: procedural geometry in `robots.js`; no robot photographs or external 3D assets.
- Three.js 0.180.0: MIT license included in `assets/vendor/three/LICENSE`. The vendored files are `build/three.module.js`, `build/three.core.js`, and `examples/jsm/controls/OrbitControls.js` from the published npm package.
- Construction photograph: [Ben Koorengevel on Unsplash](https://unsplash.com/photos/construction-of-several-high-rise-buildings-is-underway-gROCANC38BU), under the [Unsplash License](https://unsplash.com/license). The hero illustrates a construction environment, not a Shotwell deployment.
- Shotwell logo and favicon: existing company brand assets from `shotwellai/website`.
- Typefaces: Outfit and IBM Plex Mono via Google Fonts.
- Interface icons: [Lucide](https://lucide.dev), with its ISC license included in `assets/icons/LICENSE`.

## Checks before publishing

Check desktop and mobile layouts, navigation with keyboard and touch, contact links, image loading, and horizontal overflow. Verify both product WebGL views render, remain in frame throughout rotation, resume after dragging, and respect reduced-motion preferences. Confirm `https://shotwellrobotics.com` and `https://www.shotwellrobotics.com` resolve after any DNS changes.
