# SurroMother.com

**The independent surrogacy navigator.** Plain-language guidance, a 48-country law tracker, a 51-jurisdiction US state guide and free tools for both sides of every surrogacy journey, with lead funnels, sponsorship, supporter pledges, monthly contests and hiring.

- Live site: `https://surromother.com` (GitHub Pages, custom domain set in the `CNAME` file)
- GitHub Pages address: `https://webworksa1.github.io/surromother-com/` (redirects to the domain)
- Phase-wise build prompts: `PROMPTS.md` · Idea, market and 39-site competitor research: `RESEARCH.md`

## What's inside

| Area | Pages |
|---|---|
| Audiences | `index.html`, `intended-parents.html`, `become-a-surrogate.html` |
| Lead funnels (no ads) | `get-matched.html` (intended parents, 3 steps, lead score 0-100), `apply.html` (surrogate pre-screen with instant verdict, then contact), `partners.html` (professionals) |
| Tools | `tools/cost-calculator.html`, `tools/due-date-calculator.html`, `tools/journey-timeline.html`, `tools/agency-checklist.html`, `tools/compare.html`, `laws/` (tracker), `laws/us-states.html` |
| Content | 14 guides in `guides/`, 48 country pages in `laws/`, `videos.html` (16 verified YouTube videos), `news.html`, `faq.html`, `glossary.html`, `resources.html`, `search.html` |
| Monetisation | AdSense on every content page, `advertise.html`, `support.html` (pledges + payment links), `contests.html` (monthly Family Stories Award), `careers.html` |
| Trust and legal | `about.html`, `editorial-policy.html`, `privacy.html`, `terms.html`, `disclaimer.html` (disclaimers + trademark and copyright disclosure), `contact.html` |

Every page carries the top bar "Contact, if you are interested in this website / domain name / sponsorship / advertisement / partnership" linking to `https://web.works/contact`.

## How the site is built

Plain Jekyll, built by GitHub Pages itself (free plan, branch `main`, folder `/`). No Actions, servers or databases are required.

| Path | What it is |
|---|---|
| `_config.yml` | Site URL and base path, owner link, law review date |
| `_layouts/default.html` | Shell: owner bar, header, footer, SEO meta, JSON-LD, AdSense (only when `ads: true`), cookie notice |
| `_layouts/guide.html`, `_layouts/country.html` | Guide pages; country pages generated from `_data/countries.json` |
| `_includes/` | Header, footer, lead bands, support strip, guide card |
| `_data/countries.json` | **The law tracker.** Edit a country here and its page, the tracker table, the comparison tool and search update on the next build |
| `_data/news.json`, `_data/glossary.json` | News list (refreshed by the optional workflow) and glossary terms |
| `assets/js/config.js` | **Edit me:** form relay, payment links, prizes, reply time |
| `assets/js/main.js` · `tools.js` | Forms, lead scoring, widgets, search · calculators, pre-screen, timeline, checklist, comparison |
| `automation/` | Optional daily news workflow + script |

**Add a country:** append an object to `_data/countries.json` (copy an existing one) and create `laws/<slug>.html` with the same front matter as the others (`layout: country`, `slug: <slug>`, title, description).
**Add a guide:** copy any file in `guides/`, change the front matter and the HTML body.

## Publish on GitHub Pages

Settings → Pages → Build and deployment → Source **Deploy from a branch** → Branch **main**, folder **/ (root)**. Every commit to `main` rebuilds the site in about a minute.

## Daily automation (optional, one time)

Copy `automation/auto-update.yml` to `.github/workflows/auto-update.yml` (Add file → Create new file). Each day it refreshes `_data/news.json` from Google News RSS, commits it and triggers a Pages rebuild. In the browser, the tip of the day, contest theme, countdown and news list already update themselves.

## Forms

All forms post to FormSubmit's AJAX endpoint. The owner inbox is assembled at runtime from the encoded `relay` key in `assets/js/config.js` and never appears as plain text in any page.

1. **The first submission triggers a one-time FormSubmit activation email. Click "Activate"**, or later submissions are not delivered.
2. After activation FormSubmit shows a random alias string. Paste it into `formAlias` in `config.js`.
3. Each submission includes the form type, a 0-100 lead score and tier for parents and surrogates, the jurisdiction note shown to the visitor, first landing page, referrer, UTM tags and pages viewed.

## Donations

Paste PayPal.me / Stripe Payment Link / Buy Me a Coffee / Ko-fi / Razorpay / UPI URLs into `payments` in `config.js`. Until then the Support page runs in pledge mode.

## Custom domain (needed for AdSense approval)

The repo is set up for `surromother.com` (`CNAME` file; `url: "https://surromother.com"` and `baseurl: ""` in `_config.yml`).

1. DNS at the registrar: A records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; CNAME `www` → `webworksa1.github.io`.
2. Settings → Pages → confirm the custom domain shows a green check, then tick **Enforce HTTPS**.
3. To run without the domain instead: delete `CNAME`, set `url: "https://webworksa1.github.io"` and `baseurl: "/surromother-com"`.

## AdSense

- The Auto-ads tag for `ca-pub-6620975821265271` is in the `<head>` of every content page; the `google-adsense-account` meta tag is on every page. It is left off `get-matched.html`, `apply.html`, `partners.html`, `thank-you.html` and `404.html` so ads never sit inside a conversion flow.
- `ads.txt` is at the root. Apply once `https://surromother.com/ads.txt` resolves.
- After approval: enable Auto ads and the Google-certified consent message for EEA/UK/CH.

## Compliance notes (read before selling leads)

- SurroMother is positioned as an information and advertising platform, not an agency. It never offers payment to surrogates and never promises a match.
- Canada's Assisted Human Reproduction Act s.6 prohibits paying, or accepting payment for, arranging a surrogate's services, and advertising either (up to C$500,000 and/or 10 years). India's Surrogacy (Regulation) Act 2021 s.38 bans advertising commercial surrogacy. Get advice from a Canadian AHR lawyer before charging anyone per surrogacy lead.
- Forms show jurisdiction-specific notices; surrogates in prohibited countries see their result but no contact form.

## Trademark / copyright

See `disclaimer.html`. "SurroMother" is used as the descriptive name of this website and domain; no affiliation with any business using a similar name. All illustrations are original SVG; videos are embedded through YouTube's own player; news links go to the original publishers.
