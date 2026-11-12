# SurroMother.com — Phase-wise Build Prompts

Use these prompts in order with any capable AI coding assistant to rebuild, extend or audit the site. Each phase has a goal, a copy-paste prompt and an acceptance checklist. The live site in this repository is the result of running Phases 0–9.

Constants used throughout:
- Domain: `surromother.com` · Brand: **SurroMother** · Tagline: "The independent surrogacy navigator"
- AdSense publisher: `ca-pub-6620975821265271`
- Owner bar link: `https://web.works/contact`
- Owner inbox: stored only as an encoded relay key in `assets/js/config.js`; never written in plain text anywhere.
- Hosting: GitHub Pages, free plan, repository `WEBWORKSA1/surromother-com`, branch `main`, folder `/ (root)`.

---

## Phase 0 — Positioning and compliance guardrails

**Prompt**
> You are the product lead for SurroMother.com, an independent surrogacy education and decision-tools website. It is NOT a surrogacy agency, clinic or law firm and never arranges surrogacy, never offers anyone payment to become a surrogate and never promises a match. Write a one-page positioning statement and a compliance checklist covering: Google AdSense program policies (original content, no misleading claims, clear navigation, privacy policy, cookie consent, no ads inside forms), Canada's Assisted Human Reproduction Act s.6 (no paying surrogates, no paid arranging or advertising of arranging), India's Surrogacy (Regulation) Act 2021 s.38 (no commercial surrogacy advertising), UK Surrogacy Arrangements Act 1985 (no commercial agencies), consumer-protection rules on testimonials (no invented reviews), and medical/legal information disclaimers. Output the checklist as Markdown with a pass/fail column.

**Accept when** the checklist exists and every later phase references it.

---

## Phase 1 — Information architecture

**Prompt**
> Design the sitemap for SurroMother.com with three audiences (intended parents, prospective gestational surrogates, professionals) and these required sections: home; intended-parents hub; become-a-surrogate hub; 14 long-form guides; global law tracker with one page per country (40+ countries) and a US state guide; tools (cost calculator, surrogate eligibility pre-screen, embryo-transfer due-date calculator, journey timeline planner, agency question checklist, country comparison); videos; auto-updating news; FAQ; glossary; resources; lead funnels (get-matched for parents, apply for surrogates, partners for professionals); support/donations; contests and prizes; careers; advertise/sponsorship; about; contact; editorial policy; privacy; terms; disclaimer with trademark/copyright disclosure; search; 404; thank-you. A thin bar on top of every page must read "Contact, if you are interested in this website / domain name / sponsorship / advertisement / partnership" and link to https://web.works/contact. Output a table: URL, purpose, primary CTA, ads on/off.

**Accept when** every funnel page (get-matched, apply, partners, thank-you, 404) is marked ads-off and every content page ads-on.

---

## Phase 2 — Design system

**Prompt**
> Create a warm, trustworthy, editorial design system for a sensitive family-building topic. Palette: deep aubergine #3A1F3D, coral CTA #E2674A, peach #F7D9C9, cream background #FBF7F2, sand #F1E6DA, sage #5E8C77, gold #C9952F, ink #241A26. Type: Fraunces (display) + Figtree (body) from Google Fonts. Signature mark: two arcs forming a cradle. Components: owner bar, sticky header with mega-menu and mobile drawer, hero with audience split, stat strip, cards, status badges (compensated / altruistic / unregulated / prohibited / varies), multi-step form with progress bar, result panels, tables that scroll on mobile, accordions, video facade (thumbnail first, iframe on click), cookie notice, sticky mobile CTA. Deliver one CSS file using custom properties, mobile-first, WCAG AA contrast, prefers-reduced-motion respected.

**Accept when** Lighthouse accessibility ≥ 95 and no horizontal scroll at 360 px.

---

## Phase 3 — Site build on GitHub Pages' own Jekyll (free plan)

**Prompt**
> Structure the repository as a plain Jekyll site that GitHub Pages builds by itself from `main` / root, with no Actions or servers: `_config.yml` (`url`, `baseurl`, owner link, `jekyll-sitemap` plugin); `_layouts/default.html` (shell), `_layouts/guide.html` and `_layouts/country.html` (one page per country, driven by `_data/countries.json` through small front-matter stub files); `_includes/` (header, footer, lead bands, news list); `_data/` (countries, news, glossary). Generate with Liquid: `search.json`, `robots.txt`, `site.webmanifest` and public JSON copies in `/data/` for client-side tools; add `ads.txt` (`google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`). Every page gets: canonical URL, meta description, Open Graph, JSON-LD (Organization, WebSite with SearchAction, BreadcrumbList, Article/FAQPage where relevant), the `google-adsense-account` meta tag, and the AdSense script `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271` except on ads-off pages (`ads: false` in front matter).

**Accept when** GitHub Pages builds without errors and serves every URL in the Phase 1 table.

---

## Phase 4 — Lead generation engine

**Prompt**
> Write `assets/js/main.js` with: (1) a generic multi-step form controller (progress bar, per-step validation, back/next, keyboard friendly); (2) form delivery through FormSubmit's AJAX endpoint where the inbox address is decoded at runtime from `window.SM_CONFIG.relay` (base64 of the reversed address) or replaced by `formAlias` once activated — the address must never appear in HTML, page text or source as plain text; (3) honeypot spam trap; (4) lead scoring 0–100 for intended parents (embryo readiness, timeline, budget fit for chosen destination, services needed, phone given) and for surrogates (eligibility verdict, location in a compensated-surrogacy jurisdiction, availability); (5) capture of first landing page, referrer and UTM tags in localStorage (wrapped in try/catch) and appended to every submission; (6) jurisdiction notices: when a visitor selects Canada, the UK, Australia, New Zealand, India, Ireland, Brazil, Israel, South Africa, Thailand, Vietnam or a prohibited country, show a plain-language note on what is lawful there; (7) redirect to `thank-you.html?f=<form>` or inline success; (8) "Email us" links that build a mailto at click time only.

Build three funnels: `get-matched.html` (intended parents, 3 steps), `apply.html` (surrogate pre-screen with instant eligibility verdict, then contact step), `partners.html` (professionals). Add newsletter, contact, sponsorship, careers, contest-entry and supporter-pledge forms that reuse the same engine.

**Accept when** every form posts successfully after the one-time FormSubmit activation, and a search of the built site for the inbox address returns zero hits.

---

## Phase 5 — Tools

**Prompt**
> Implement `assets/js/tools.js`: (a) Surrogacy cost calculator with destinations (US premium state, US other friendly state, Canada, UK, Mexico, Colombia, Georgia), journey type (agency/independent), embryo status (ready / need IVF own eggs / need donor eggs), surrogate insurance (surrogacy-friendly plan / needs policy), experienced surrogate toggle, international travel toggle and contingency reserve; output itemised low–high ranges, a total and a bar chart, plus a "Email me this estimate" lead capture. (b) Embryo-transfer due-date calculator (day-3 +263 days, day-5 +261, day-6 +260) with milestones (beta test, first scan, OB release, anatomy scan, third trimester, full term). (c) Journey timeline planner producing a dated Gantt from a start month. (d) Agency question checklist with progress saved locally and print view. (e) Country comparison (pick up to three from `/data/countries.json`). (f) Law tracker table with search, status filter, region filter and "open to foreign intended parents" filter. Label every money figure "indicative" with the data date.

**Accept when** every tool works offline after first load and handles bad input without errors.

---

## Phase 6 — Content for AdSense approval and SEO

**Prompt**
> Write 14 original long-form guides (900–1,600 words each, plain language, sourced, reviewed-date stamp, FAQ block): what surrogacy is; the process for intended parents; costs; choosing an agency and red flags; independent vs agency; international surrogacy and citizenship; requirements to become a surrogate; how surrogate compensation and reimbursement work by jurisdiction; the surrogate's medical journey; contracts and parentage; LGBTQ+ and single parents; insurance; emotional health and telling your child; altruistic surrogacy in Canada, the UK and Australia. Also write 40+ country summaries (status, compensation, foreign access, same-sex couples, singles, parentage route, key law, most recent change, risk level, official sources), a 51-jurisdiction US summary, a 60-term glossary, 30 FAQs, and an editorial policy. Never invent statistics, testimonials or quotes; cite official sources; add "information, not legal or medical advice" notes.

**Accept when** each guide passes a plagiarism check, has at least two outbound authoritative links and an internal link to a tool and a funnel.

---

## Phase 7 — Monetisation layers

**Prompt**
> Add: AdSense Auto ads via the head script (no manual units until approval); `ads.txt`; Support page with one-time/monthly pledge tiers, "where the money goes" (operations, promotion, marketing, hiring, contests/prizes), payment-link slots in `config.js` (PayPal, Stripe, Buy Me a Coffee, Ko-fi, Razorpay, UPI) and pledge-mode fallback; Contests page with a monthly "Family Stories Award" (themes rotate automatically, live countdown to month end, prizes from config, official rules, no purchase necessary, entry form); Careers page (medical reviewer RN/MD, family-law reviewer, writers, translators, community ambassadors, partnerships lead) with application form; Advertise page with packages (sponsored guide, newsletter sponsor, directory listing, homepage feature, tool sponsorship) and enquiry form; Partners page for professionals. Every page carries the top owner bar.

**Accept when** all monetisation forms deliver and nothing promises surrogate payment.

---

## Phase 8 — Automation ("self-updating")

**Prompt**
> Create `automation/fetch_news.py` that pulls the latest surrogacy-law and surrogacy-news headlines from Google News RSS (several queries, 30-day window, de-duplicated, newest first, max 14) into `_data/news.json`. Create a GitHub Actions workflow (`.github/workflows/auto-update.yml`) that runs daily: run the news fetcher, commit `_data/news.json` with a bot identity, and request a GitHub Pages rebuild. In the browser, rotate the tip of the day, contest theme and countdown automatically, and refresh the news list from `/data/news.json`.

**Accept when** a manual "Run workflow" commits fresh news and the live site shows it within minutes.

---

## Phase 9 — QA, publish, AdSense submission

**Prompt**
> Build the site (GitHub Pages or a local `jekyll build`), then crawl every generated HTML file and verify: no broken internal links; every page has the owner bar, title, meta description, canonical and one H1; AdSense script present on content pages and absent on funnels; no plain-text inbox address anywhere in the repository; forms validate; layout works at 360 px, 768 px and 1280 px. Push to `main`, enable GitHub Pages (Deploy from branch → main → /root). Point `surromother.com` DNS at GitHub Pages (A 185.199.108.153, .109.153, .110.153, .111.153; CNAME www → webworksa1.github.io), add the custom domain in Settings → Pages (this creates the `CNAME` file), enforce HTTPS, set `url: "https://surromother.com"` and `baseurl: ""` in `_config.yml`, then submit the domain in AdSense.

**Accept when** the live URL returns 200 for every sitemap entry and `https://surromother.com/ads.txt` resolves.

---

## Phase 10 — Growth backlog (after launch)

- Spanish, French and Hindi versions of the five highest-traffic pages.
- Verified-professional directory with licence checks (paid listings).
- Monthly "State of Surrogacy Law" PDF report as an email lead magnet.
- Webinar series with clinics and attorneys (sponsored).
- Programmatic pages: "surrogacy for [nationality] intended parents" built from the country data.
- Review platform for agencies with moderated, verified reviews only.
