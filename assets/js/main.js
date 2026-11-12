/* SurroMother.com core script: navigation, consent, attribution, forms, lead scoring, small widgets. */
(function () {
  "use strict";
  var C = window.SM_CONFIG || {};
  var BASE = window.SM_BASE || "/";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  window.SM = { store: store, $: $, $$: $$ };

  /* ---------------- navigation ---------------- */
  var nav = $("[data-nav]");
  var toggle = $("[data-nav-toggle]");
  function closeMenus(except) {
    $$(".nav-item.open").forEach(function (li) {
      if (li !== except) { li.classList.remove("open"); var b = $("[data-menu-btn]", li); if (b) b.setAttribute("aria-expanded", "false"); }
    });
  }
  $$("[data-menu-btn]").forEach(function (btn) {
    var li = btn.closest(".nav-item");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = !li.classList.contains("open");
      closeMenus(li);
      li.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    if (window.matchMedia("(hover:hover) and (min-width:1081px)").matches) {
      var t;
      li.addEventListener("mouseenter", function () { clearTimeout(t); closeMenus(li); li.classList.add("open"); btn.setAttribute("aria-expanded", "true"); });
      li.addEventListener("mouseleave", function () { t = setTimeout(function () { li.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }, 160); });
    }
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".nav-item")) closeMenus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeMenus(); setNav(false); } });
  var scrim;
  function setNav(open) {
    if (!toggle) return;
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open && !scrim) { scrim = document.createElement("div"); scrim.className = "nav-scrim"; scrim.addEventListener("click", function () { setNav(false); }); document.body.appendChild(scrim); }
    if (!open && scrim) { scrim.remove(); scrim = null; }
  }
  if (toggle) toggle.addEventListener("click", function () { setNav(!document.body.classList.contains("nav-open")); });

  /* ---------------- cookie notice ---------------- */
  var cookie = $("[data-cookie]");
  if (cookie && !store.get("sm-consent")) {
    cookie.hidden = false;
    $("[data-cookie-ok]", cookie).addEventListener("click", function () { store.set("sm-consent", "all"); cookie.hidden = true; });
    $("[data-cookie-min]", cookie).addEventListener("click", function () {
      store.set("sm-consent", "essential"); cookie.hidden = true;
      try { (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1; } catch (e) { /* ignore */ }
    });
  }
  if (store.get("sm-consent") === "essential") { try { (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1; } catch (e) { /* ignore */ } }

  /* ---------------- sticky mobile CTA ---------------- */
  var sticky = $("[data-sticky-cta]");
  if (sticky) {
    var onScroll = function () {
      var nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 700;
      sticky.hidden = !(window.scrollY > 640 && !nearEnd);
    };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  /* ---------------- YouTube facade ---------------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-yt]");
    if (!b) return;
    var id = b.getAttribute("data-yt");
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
    f.title = b.getAttribute("aria-label") || "Video";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    f.allowFullscreen = true;
    b.innerHTML = ""; b.appendChild(f); b.removeAttribute("data-yt");
  });
  $$("[data-video-tabs]").forEach(function (bar) {
    bar.addEventListener("click", function (e) {
      var t = e.target.closest(".tab"); if (!t) return;
      $$(".tab", bar).forEach(function (x) { x.setAttribute("aria-pressed", x === t ? "true" : "false"); });
      var cat = t.getAttribute("data-cat");
      $$("[data-vcat]").forEach(function (card) { card.hidden = cat !== "all" && card.getAttribute("data-vcat") !== cat; });
    });
  });

  /* ---------------- attribution ---------------- */
  (function () {
    var a = store.get("sm-attr");
    var q = new URLSearchParams(location.search);
    if (!a) {
      a = { landing: location.pathname, referrer: document.referrer || "direct", first_seen: new Date().toISOString().slice(0, 10) };
    }
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach(function (k) { if (q.get(k)) a[k] = q.get(k); });
    a.pages = (a.pages || 0) + 1;
    store.set("sm-attr", a);
  })();

  /* ---------------- jurisdiction notes ---------------- */
  var J = {
    altruistic: ["CA", "GB", "AU", "NZ", "IN", "BR", "ZA", "VN", "TH", "NL", "CY", "PT", "CU"],
    prohibited: ["ES", "FR", "DE", "IT", "CH", "AT", "SE", "NO", "FI", "SK", "CN", "KH", "NP", "MY"],
    residents: ["GR", "IL", "KZ", "RU", "AE"]
  };
  var SPECIAL = {
    CA: "Canada allows altruistic surrogacy only. Under the Assisted Human Reproduction Act, paying a surrogate, or paying anyone to arrange a surrogate's services, is a federal offence. Surrogates may be reimbursed for receipted expenses. SurroMother never offers or arranges payment.",
    IN: "India allows only altruistic surrogacy for eligible Indian married couples (and some widowed or divorced women) with official certificates. Commercial surrogacy, and advertising it, are criminal offences.",
    GB: "In the UK a surrogate can receive reasonable expenses only, agreements are not enforceable, and intended parents apply for a parental order after the birth.",
    AU: "Australia allows altruistic surrogacy only. Commercial surrogacy is a crime, and residents of NSW, Queensland and the ACT also commit an offence by arranging it overseas.",
    IT: "Italy criminalises surrogacy, including when Italian citizens arrange it abroad. Please speak to an Italian lawyer before taking any step."
  };
  function jurisNote(code, name, role) {
    if (!code) return "";
    if (SPECIAL[code]) return SPECIAL[code];
    if (J.prohibited.indexOf(code) > -1) return "Surrogacy is not permitted in " + name + ". Using it abroad can create serious legal and recognition problems at home. We can share general information only; please consult a family lawyer in " + name + " first.";
    if (J.altruistic.indexOf(code) > -1) return "In " + name + " surrogacy is lawful only on an altruistic basis: a surrogate may be reimbursed for documented expenses but not paid. Arranging or advertising paid surrogacy can be an offence.";
    if (J.residents.indexOf(code) > -1) return "In " + name + " surrogacy is limited to residents or citizens who meet specific conditions.";
    if (code === "US" && role === "surrogate") return "US law varies by state. Most states allow compensated gestational surrogacy; Louisiana restricts it and a few states treat contracts as void. We'll take your state into account.";
    if (code === "US") return "US law varies by state. Check where your surrogate lives and where the baby will be born in our US state guide.";
    return "";
  }
  window.SM.jurisNote = jurisNote; window.SM.J = J;
  $$("[data-juris]").forEach(function (sel) {
    var note = $(sel.getAttribute("data-juris"));
    var role = sel.getAttribute("data-role") || "parent";
    var upd = function () {
      var o = sel.options[sel.selectedIndex];
      var txt = jurisNote(sel.value, o ? o.text : "", role);
      if (note) { note.textContent = txt; var box = note.closest(".jnote") || note.parentElement; box.classList.toggle("show", !!txt); }
      var nameField = sel.form && sel.form.querySelector('input[name="' + sel.name + '_name"]');
      if (nameField) nameField.value = o && sel.value ? o.text : "";
      var flag = sel.form && sel.form.querySelector('input[name="jurisdiction_note"]');
      if (flag) flag.value = txt;
    };
    sel.addEventListener("change", upd); upd();
  });

  /* ---------------- lead scoring ---------------- */
  function scoreParents(d) {
    var s = 0, dest = d.destination || "", b = d.budget || "";
    s += ({ "Yes, tested and frozen": 25, "IVF in progress": 15, "Need donor eggs": 10, "Not yet": 8 })[d.embryos] || 0;
    s += ({ "Within 3 months": 25, "3-6 months": 18, "6-12 months": 10, "Just researching": 3 })[d.timeline] || 0;
    var big = b === "US$200,000+" || b === "US$150,000-200,000", mid = b === "US$100,000-150,000", low = b === "US$60,000-100,000";
    if (dest === "United States") s += big ? 25 : mid ? 12 : 3;
    else if (dest === "Canada" || dest === "United Kingdom") s += (big || mid || low) ? 20 : 8;
    else if (dest === "Mexico" || dest === "Colombia") s += (big || mid || low) ? 18 : 6;
    else s += b && b !== "Not sure yet" ? 10 : 6;
    var services = (d.services || "").split(",").filter(Boolean).length;
    s += services >= 3 ? 10 : services ? 5 : 0;
    if (d.phone) s += 10;
    if (J.prohibited.indexOf(d.residence) > -1) s = Math.min(s, 40);
    return Math.max(0, Math.min(100, s));
  }
  function scoreSurrogate(d) {
    var s = ({ likely: 50, possible: 30, unlikely: 5 })[d.verdict_key] || 0;
    if (d.residence === "US") s += (d.us_state === "LA" ? 5 : 25);
    else if (J.altruistic.indexOf(d.residence) > -1) s += 10;
    s += ({ "Right away": 15, "In 1-3 months": 10, "Later this year": 5 })[d.start] || 0;
    if (d.phone) s += 10;
    return Math.max(0, Math.min(100, s));
  }
  function tier(n) { return n >= 70 ? "Hot" : n >= 45 ? "Warm" : "Nurture"; }

  /* ---------------- forms ---------------- */
  function inbox() {
    if (C.formAlias) return C.formAlias;
    try { return atob(C.relay || "").split("").reverse().join(""); } catch (e) { return ""; }
  }
  function endpoint() { return "https://formsubmit.co/ajax/" + inbox(); }
  function fieldOk(el) {
    if (el.disabled || el.type === "hidden" || el.closest("[hidden]")) return true;
    if (el.type === "radio") {
      var group = $$('input[name="' + el.name + '"]', el.form);
      if (!group.some(function (r) { return r.required; })) return true;
      return group.some(function (r) { return r.checked; });
    }
    if (el.type === "checkbox") return !el.required || el.checked;
    var v = (el.value || "").trim();
    if (el.required && !v) return false;
    if (v && el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return false;
    if (v && el.type === "number") { var n = +v; if (isNaN(n) || (el.min !== "" && n < +el.min) || (el.max !== "" && n > +el.max)) return false; }
    return true;
  }
  function validate(scope) {
    var bad = [];
    $$("input, select, textarea", scope).forEach(function (el) {
      if (el.classList.contains("hp")) return;
      var ok = fieldOk(el);
      var target = el.type === "radio" || el.type === "checkbox" ? el.closest("label") : el;
      if (target) target.classList.toggle("field-err", !ok);
      if (!ok) bad.push(el);
    });
    if (bad.length) { bad[0].focus({ preventScroll: false }); }
    return !bad.length;
  }
  function serialize(form) {
    var d = {};
    new FormData(form).forEach(function (v, k) {
      if (k === "_honey") return;
      if (d[k] !== undefined) d[k] = d[k] + "," + v; else d[k] = v;
    });
    return d;
  }
  function msg(form, text, cls) {
    var m = $(".form-msg", form); if (!m) return;
    m.textContent = text; m.className = "form-msg " + (cls || "");
  }

  /* multi-step */
  $$("form[data-steps]").forEach(function (form) {
    var steps = $$(".step", form), i = 0;
    var prog = $$(".progress li", form), back = $("[data-back]", form), next = $("[data-next]", form), submit = $("[data-submit]", form);
    var label = $(".step-label", form);
    function show(n) {
      i = n;
      steps.forEach(function (s, k) { s.hidden = k !== i; });
      prog.forEach(function (p, k) { p.classList.toggle("on", k <= i); });
      if (back) back.hidden = i === 0;
      if (next) next.hidden = i === steps.length - 1;
      if (submit) submit.hidden = i !== steps.length - 1;
      if (label) label.textContent = "Step " + (i + 1) + " of " + steps.length;
      var lg = $("legend", steps[i]);
      if (n > 0 && lg) { form.scrollIntoView({ behavior: "smooth", block: "start" }); }
    }
    if (next) next.addEventListener("click", function () { if (validate(steps[i])) show(i + 1); });
    if (back) back.addEventListener("click", function () { show(i - 1); });
    form.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.tagName === "INPUT" && i < steps.length - 1) { e.preventDefault(); if (next) next.click(); }
    });
    show(0);
  });

  $$("form[data-sm-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.dataset.busy) return;
      var hp = $(".hp", form);
      if (hp && hp.value) { msg(form, "Thank you.", "ok"); return; }
      if (!validate(form)) { msg(form, "Please check the highlighted fields.", "err"); return; }
      var type = form.getAttribute("data-sm-form");
      var d = serialize(form);
      var attr = store.get("sm-attr") || {};
      var subject = "[SurroMother] " + (form.getAttribute("data-subject") || type);
      if (type === "parents") {
        d.lead_score = scoreParents(d); d.lead_tier = tier(d.lead_score);
        subject += ": " + d.lead_tier + " (" + d.lead_score + ") " + (d.residence_name || "") + " to " + (d.destination || "?");
      }
      if (type === "surrogate") {
        d.lead_score = scoreSurrogate(d); d.lead_tier = tier(d.lead_score);
        subject += ": " + d.lead_tier + " (" + d.lead_score + ") " + (d.verdict || "") + ", " + (d.residence_name || "");
      }
      if (type === "pledge") subject += ": " + (d.amount || "") + " " + (d.currency || "") + " " + (d.frequency || "");
      var payload = Object.assign({}, d, {
        _subject: subject, _template: "table", _captcha: "false", form_type: type,
        page: location.pathname, submitted_at: new Date().toISOString(),
        first_landing: attr.landing || "", referrer: attr.referrer || "", first_seen: attr.first_seen || "",
        utm_source: attr.utm_source || "", utm_medium: attr.utm_medium || "", utm_campaign: attr.utm_campaign || "", pages_viewed: attr.pages || ""
      });
      if (d.email) payload._replyto = d.email;
      form.dataset.busy = "1";
      var btn = $('[type="submit"]', form); if (btn) btn.disabled = true;
      msg(form, "Sending...", "");
      fetch(endpoint(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error("send failed");
          store.set("sm-last", { type: type, score: d.lead_score || null, name: (d.name || "").split(" ")[0] });
          var redirect = form.getAttribute("data-redirect");
          if (redirect) { location.href = BASE + redirect; return; }
          msg(form, form.getAttribute("data-inline-success") || "Thank you. We'll be in touch " + (C.replyTime || "soon") + ".", "ok");
          form.reset();
        })
        .catch(function () { msg(form, "We couldn't send that just now. Please check your connection and try again in a minute.", "err"); })
        .then(function () { delete form.dataset.busy; if (btn) btn.disabled = false; });
    });
  });

  /* contact links that reveal the inbox only when clicked */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-mail]");
    if (!a) return;
    var addr = C.formAlias && C.formAlias.indexOf("@") > -1 ? C.formAlias : (function () { try { return atob(C.relay || "").split("").reverse().join(""); } catch (x) { return ""; } })();
    if (!addr) return;
    e.preventDefault();
    location.href = "mailto:" + addr + "?subject=" + encodeURIComponent(a.getAttribute("data-mail") || "SurroMother enquiry");
  });

  /* prefill selects/inputs from ?topic= or data-prefill */
  (function () {
    var q = new URLSearchParams(location.search);
    $$("[data-prefill]").forEach(function (el) {
      var v = q.get(el.getAttribute("data-prefill")); if (!v) return;
      var opt = $$("option", el).filter(function (o) { return o.value === v; })[0];
      if (opt) el.value = v; else if (el.tagName !== "SELECT") el.value = v;
    });
  })();

  /* ---------------- small widgets ---------------- */
  function dayOfYear(d) { var s = new Date(d.getFullYear(), 0, 0); return Math.floor((d - s) / 864e5); }
  $$("[data-tips]").forEach(function (el) {
    try { var tips = JSON.parse(el.getAttribute("data-tips")); el.textContent = tips[dayOfYear(new Date()) % tips.length]; } catch (e) { /* keep server text */ }
  });
  $$("[data-theme-list]").forEach(function (el) {
    try { var th = JSON.parse(el.getAttribute("data-theme-list")); var now = new Date(); el.textContent = th[now.getMonth() % th.length]; } catch (e) { /* keep */ }
  });
  $$("[data-month-name]").forEach(function (el) { el.textContent = new Date().toLocaleString("en", { month: "long", year: "numeric" }); });
  $$("[data-countdown]").forEach(function (el) {
    function tick() {
      var now = new Date(), end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      var s = Math.max(0, Math.floor((end - now) / 1000));
      var parts = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
      $$("b", el).forEach(function (b, k) { b.textContent = String(parts[k]).padStart(2, "0"); });
    }
    tick(); setInterval(tick, 1000);
  });
  $$("[data-prizes]").forEach(function (el) {
    (C.prizes || []).forEach(function (p, k) { var li = document.createElement("li"); li.innerHTML = "<strong>" + ["1st", "2nd", "3rd"][k] + ":</strong> "; li.appendChild(document.createTextNode(p)); el.appendChild(li); });
  });
  $$("[data-reply-time]").forEach(function (el) { el.textContent = C.replyTime || "soon"; });

  /* live news refresh */
  $$("[data-news]").forEach(function (list) {
    var max = +list.getAttribute("data-news") || 8;
    fetch(BASE + "data/news.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.items || !j.items.length) return;
      list.innerHTML = "";
      j.items.slice(0, max).forEach(function (it) {
        var li = document.createElement("li");
        var t = document.createElement("time"); t.dateTime = it.date; t.textContent = it.date ? new Date(it.date + "T12:00:00").toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" }) : "";
        var d = document.createElement("div");
        var a = document.createElement("a"); a.href = it.url; a.target = "_blank"; a.rel = "noopener"; a.textContent = it.title;
        var s = document.createElement("span"); s.className = "src"; s.textContent = it.source;
        d.appendChild(a); d.appendChild(s); li.appendChild(t); li.appendChild(d); list.appendChild(li);
      });
      var up = document.querySelector("[data-news-updated]"); if (up && j.updated) up.textContent = j.updated;
    }).catch(function () { /* keep server-rendered list */ });
  });

  /* filterable tables */
  $$("[data-filter-table]").forEach(function (wrap) {
    var rows = $$("tbody tr", wrap), q = $("[data-f-q]", wrap), st = $("[data-f-status]", wrap), rg = $("[data-f-region]", wrap), fo = $("[data-f-foreign]", wrap), count = $("[data-f-count]", wrap);
    function run() {
      var n = 0, term = q ? q.value.trim().toLowerCase() : "";
      rows.forEach(function (r) {
        var ok = (!term || r.textContent.toLowerCase().indexOf(term) > -1) &&
          (!st || !st.value || r.dataset.status === st.value) &&
          (!rg || !rg.value || r.dataset.region === rg.value) &&
          (!fo || !fo.checked || r.dataset.foreign === "1");
        r.hidden = !ok; if (ok) n++;
      });
      if (count) count.textContent = n + " of " + rows.length + " shown";
    }
    [q, st, rg, fo].forEach(function (el) { if (el) el.addEventListener("input", run); if (el) el.addEventListener("change", run); });
    var qs = new URLSearchParams(location.search);
    if (st && qs.get("status")) st.value = qs.get("status");
    run();
  });

  /* support tiers + payment links */
  $$("[data-support]").forEach(function (box) {
    var amt = $('input[name="amount"]', box), tierField = $('input[name="tier"]', box);
    $$(".tier", box).forEach(function (t) {
      t.addEventListener("click", function () {
        $$(".tier", box).forEach(function (x) { x.setAttribute("aria-pressed", x === t ? "true" : "false"); });
        if (amt) amt.value = t.getAttribute("data-amount");
        if (tierField) tierField.value = t.getAttribute("data-tier");
      });
    });
    var P = C.payments || {}, wrap = $("[data-paylinks]", box), names = { paypal: "PayPal", stripe: "Card (Stripe)", buymeacoffee: "Buy Me a Coffee", kofi: "Ko-fi", razorpay: "Razorpay", upi: "UPI" };
    var any = false;
    Object.keys(names).forEach(function (k) {
      if (!P[k]) return; any = true;
      var a = document.createElement("a"); a.className = "btn btn-plum btn-sm"; a.href = P[k]; a.target = "_blank"; a.rel = "noopener"; a.textContent = "Give with " + names[k]; wrap.appendChild(a);
    });
    var note = $("[data-pledge-note]", box); if (note && any) note.textContent = "Prefer to pledge first or give by bank transfer? Use the form and we'll reply with details.";
  });

  /* thank-you personalisation */
  var ty = $("[data-thanks]");
  if (ty) {
    var f = new URLSearchParams(location.search).get("f") || "", last = store.get("sm-last") || {};
    var copy = {
      parents: "Your consultation request is in. We'll review it and reply " + (C.replyTime || "soon") + " with next steps and, if you agreed, introductions to professionals who fit your plan.",
      surrogate: "Your pre-screen is in. We'll reply " + (C.replyTime || "soon") + " with what your result means where you live and the options that are lawful for you.",
      partner: "Thanks for reaching out. Our partnerships team will reply " + (C.replyTime || "soon") + " with listing and sponsorship details."
    };
    if (copy[f]) ty.textContent = copy[f];
    var nm = $("[data-thanks-name]"); if (nm && last.name) nm.textContent = ", " + last.name;
  }

  /* site search */
  var sbox = $("[data-search]");
  if (sbox) {
    var input = $("input", sbox), out = $("[data-search-results]"), idx = [];
    var run = function () {
      var q = input.value.trim().toLowerCase(); out.innerHTML = "";
      if (q.length < 2) return;
      var terms = q.split(/\s+/);
      var hits = idx.map(function (it) {
        var hay = (it.t + " " + it.d + " " + it.k).toLowerCase(), sc = 0;
        terms.forEach(function (t) { if (hay.indexOf(t) > -1) sc += it.t.toLowerCase().indexOf(t) > -1 ? 3 : 1; });
        return { it: it, sc: sc };
      }).filter(function (h) { return h.sc >= terms.length; }).sort(function (a, b) { return b.sc - a.sc; }).slice(0, 40);
      if (!hits.length) { out.innerHTML = "<li>No results. Try another word, or browse the <a href='" + BASE + "guides/'>guides</a>.</li>"; return; }
      hits.forEach(function (h) {
        var li = document.createElement("li");
        var k = document.createElement("span"); k.className = "k"; k.textContent = h.it.k;
        var a = document.createElement("a"); a.href = h.it.u; a.textContent = h.it.t;
        var p = document.createElement("p"); p.className = "small mb0"; p.textContent = h.it.d;
        li.appendChild(k); li.appendChild(a); li.appendChild(p); out.appendChild(li);
      });
    };
    fetch(BASE + "search.json").then(function (r) { return r.json(); }).then(function (j) {
      idx = j; var q0 = new URLSearchParams(location.search).get("q"); if (q0) input.value = q0; run();
    });
    input.addEventListener("input", run);
    sbox.addEventListener("submit", function (e) { e.preventDefault(); run(); });
  }
})();
