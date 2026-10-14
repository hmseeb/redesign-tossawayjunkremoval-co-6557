# TossAway Junk Removal — Website

Conversion-focused marketing site for **TossAway Junk Removal**, a junk removal
company serving Greater Salem, Oregon.

- Phone: (503) 428-4945
- Email: tossawayjunkremoval@gmail.com
- Service area: Greater Salem, Oregon

## Stack

Vanilla HTML, CSS and JavaScript — no build step, no dependencies.
Deploy by serving the repository root as a static site.

## Pages

| File | Path |
| --- | --- |
| `index.html` | `/` — hero with above-the-fold quote form, steps, services, reviews, service areas |
| `services.html` | `/services.html` |
| `service-areas.html` | `/service-areas.html` |
| `about.html` | `/about.html` |
| `reviews.html` | `/reviews.html` |
| `contact.html` | `/contact.html` — contact details + booking form |
| `404.html` | not-found page |

## Structure

```
assets/css/styles.css   all styling (design tokens at :root)
assets/js/main.js       nav, sticky header, scroll reveal, form handling
images/source/          original brand photography (logo + company truck)
favicon.svg             favicon
```

## Forms

Both forms (home-page "Quote request" and contact-page "Contact") POST to
LeadrVision at
`https://vision.leadrai.com/api/forms/d4b33eed2d9dee7e3b15d34e94879f57`.

They work without JavaScript (plain POST, visitor returns with `?submitted=1`
and sees the confirmation) and progressively upgrade to a `fetch()` JSON
submission to the same endpoint when JS is available. Each form carries
`_form`, `_page` and a `_gotcha` honeypot field.
