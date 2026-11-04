# Shotwell Robotics

The company website for Shotwell's construction robotics work.

**Production:** https://shotwellrobotics.com

## Local preview

This is a static HTML, CSS, and JavaScript site. No build step or package installation is required. Open `index.html` directly, or serve the directory:

```sh
python3 -m http.server 8766
```

Then visit http://localhost:8766.

## Editing

- `index.html`: page content, navigation, metadata, and contact links.
- `styles.css`: responsive layout and visual styles.
- `script.js`: mobile navigation and footer year.
- `assets/`: self-hosted photography and Shotwell branding.

The contact links open an email draft to the existing Shotwell address, `hello@shotwell.ai`. There is no form backend, analytics, tracking, or collection of submissions on this site. Fonts load from Google Fonts. The page presents robotics as in development, without claims of deployed products or customer results.

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

- Construction photograph: [Ben Koorengevel on Unsplash](https://unsplash.com/photos/construction-of-several-high-rise-buildings-is-underway-gROCANC38BU), under the [Unsplash License](https://unsplash.com/license). The photograph illustrates a construction environment; it does not depict a Shotwell deployment.
- Shotwell logo and favicon: existing company brand assets from `shotwellai/website`.
- Typefaces: Outfit and IBM Plex Mono via Google Fonts.

## Checks before publishing

Check desktop and mobile layouts, navigation with keyboard and touch, contact links, image loading, and horizontal overflow. Confirm `https://shotwellrobotics.com` and `https://www.shotwellrobotics.com` resolve after any DNS changes.
