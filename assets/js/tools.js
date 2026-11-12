/* SurroMother.com tools: cost calculator, eligibility pre-screen, due date, timeline, checklist, comparison. */
(function () {
  "use strict";
  var SM = window.SM || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var BASE = window.SM_BASE || "/";
  function fmt(n) { return "US$" + (Math.round(n / 500) * 500).toLocaleString("en-US"); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function fmtDate(d) { return d.toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }

  /* ================= COST CALCULATOR ================= */
  var COST = {
    us_premium: { name: "United States: California and other premium states", comp: true, ins: true, indep: true,
      items: { agency: [25000, 45000], comp1: [60000, 80000], comp2: [70000, 95000], allow: [10000, 22000], ivf_own: [15000, 30000], ivf_donor: [35000, 60000], medical: [8000, 15000], legal: [12000, 25000], ins_ok: [3000, 8000], ins_pol: [25000, 40000], escrow: [1500, 3500], psych: [2000, 5000], travel: [3000, 8000], travel_intl: [8000, 20000], immig: [2000, 6000] } },
    us_other: { name: "United States: other surrogacy-friendly states", comp: true, ins: true, indep: true,
      items: { agency: [20000, 40000], comp1: [50000, 65000], comp2: [60000, 80000], allow: [8000, 18000], ivf_own: [15000, 28000], ivf_donor: [32000, 55000], medical: [7000, 14000], legal: [10000, 22000], ins_ok: [3000, 8000], ins_pol: [22000, 38000], escrow: [1500, 3000], psych: [2000, 4500], travel: [2500, 7000], travel_intl: [8000, 18000], immig: [2000, 6000] } },
    canada: { name: "Canada (altruistic: expenses only)", comp: false, ins: false, indep: true,
      items: { agency: [5000, 12000], reimb: [15000, 30000], ivf_own: [12000, 25000], ivf_donor: [25000, 45000], medical: [4000, 9000], legal: [5000, 10000], ins_life: [800, 2500], escrow: [500, 1500], psych: [1000, 3000], travel: [1000, 4000], travel_intl: [6000, 15000], immig: [1500, 5000] } },
    uk: { name: "United Kingdom (altruistic: reasonable expenses)", comp: false, ins: false, indep: true,
      items: { agency: [3000, 12000], reimb: [13000, 25000], ivf_own: [9000, 25000], ivf_donor: [15000, 35000], medical: [3000, 8000], legal: [2000, 10000], ins_life: [500, 1500], escrow: [0, 500], psych: [800, 2500], travel: [1000, 4000], travel_intl: [5000, 12000], immig: [1500, 5000] } },
    mexico: { name: "Mexico (state-dependent, court-based parentage)", comp: false, ins: false, indep: false,
      items: { agency: [15000, 30000], reimb: [15000, 25000], ivf_own: [8000, 15000], ivf_donor: [12000, 22000], medical: [3000, 6000], legal: [6000, 15000], ins_life: [5000, 15000], escrow: [500, 1500], psych: [500, 1500], travel: [3000, 8000], travel_intl: [6000, 15000], immig: [2000, 6000] } },
    colombia: { name: "Colombia (unregulated; ban bill pending)", comp: false, ins: false, indep: false,
      items: { agency: [15000, 28000], reimb: [12000, 22000], ivf_own: [8000, 14000], ivf_donor: [12000, 20000], medical: [3000, 6000], legal: [5000, 12000], ins_life: [5000, 15000], escrow: [500, 1500], psych: [500, 1500], travel: [3000, 8000], travel_intl: [6000, 15000], immig: [2000, 6000] } },
    georgia: { name: "Georgia (married heterosexual couples only)", comp: false, ins: false, indep: false,
      items: { agency: [10000, 20000], reimb: [18000, 25000], ivf_own: [6000, 12000], ivf_donor: [9000, 16000], medical: [2000, 4000], legal: [3000, 8000], ins_life: [3000, 10000], escrow: [500, 1500], psych: [500, 1500], travel: [2000, 6000], travel_intl: [5000, 12000], immig: [2000, 6000] } }
  };
  var LABELS = {
    agency: "Agency, programme or coordination", indep: "Independent journey support (attorney-led matching, coordination)",
    comp: "Surrogate base compensation", allow: "Surrogate allowances and expense reimbursements",
    reimb: "Surrogate expenses / support payments (as permitted locally)",
    ivf: "IVF and embryo creation", medical: "Surrogate screening, transfer and monitoring", legal: "Legal: agreements, parentage order, birth registration",
    ins: "Insurance", escrow: "Escrow and payment administration", psych: "Psychological screening and counselling",
    travel: "Travel and accommodation", immig: "Citizenship, passport and home-country recognition", cont: "Contingency reserve (10%)"
  };
  var calc = $("[data-cost-calc]");
  if (calc) {
    var form = $("form", calc), out = $("[data-cost-out]", calc);
    var q = new URLSearchParams(location.search);
    if (q.get("d") && COST[q.get("d") === "us" ? "us_other" : q.get("d")]) form.dest.value = q.get("d") === "us" ? "us_other" : q.get("d");
    var runCost = function () {
      var key = form.dest.value, D = COST[key], it = D.items;
      $$("[data-only-comp]", form).forEach(function (x) { x.hidden = !D.comp; });
      $$("[data-only-ins]", form).forEach(function (x) { x.hidden = !D.ins; });
      $$("[data-only-indep]", form).forEach(function (x) { x.hidden = !D.indep; });
      var rows = [];
      var indep = D.indep && form.journey.value === "independent";
      rows.push([indep ? LABELS.indep : LABELS.agency, indep ? [Math.round(it.agency[0] * 0.2), Math.round(it.agency[1] * 0.35)] : it.agency]);
      if (D.comp) {
        rows.push([LABELS.comp, form.experienced.checked ? it.comp2 : it.comp1]);
        rows.push([LABELS.allow, it.allow]);
      } else rows.push([LABELS.reimb, it.reimb]);
      var emb = form.embryos.value;
      if (emb !== "ready") rows.push([LABELS.ivf + (emb === "donor" ? " (donor eggs)" : " (own eggs)"), emb === "donor" ? it.ivf_donor : it.ivf_own]);
      rows.push([LABELS.medical, it.medical]);
      rows.push([LABELS.legal, it.legal]);
      if (D.ins) rows.push([LABELS.ins + (form.insurance.value === "policy" ? " (separate surrogacy policy)" : " (deductibles on surrogacy-friendly plan)"), form.insurance.value === "policy" ? it.ins_pol : it.ins_ok]);
      else rows.push([key === "canada" || key === "uk" ? "Life and disability cover for the surrogate" : "Medical and maternity reserve (delivery, NICU)", it.ins_life]);
      rows.push([LABELS.escrow, it.escrow]);
      rows.push([LABELS.psych, it.psych]);
      var intl = form.intl.checked;
      rows.push([LABELS.travel + (intl ? " (international)" : ""), intl ? it.travel_intl : it.travel]);
      if (intl) rows.push([LABELS.immig, it.immig]);
      var lo = 0, hi = 0;
      rows.forEach(function (r) { lo += r[1][0]; hi += r[1][1]; });
      if (form.contingency.checked) { var c = [lo * 0.1, hi * 0.1]; rows.push([LABELS.cont, c]); lo += c[0]; hi += c[1]; }
      var max = Math.max.apply(null, rows.map(function (r) { return r[1][1]; }));
      out.innerHTML = "";
      var head = el("div");
      head.appendChild(el("p", "eyebrow", "Indicative total"));
      head.appendChild(el("p", "result-total", fmt(lo) + " to " + fmt(hi)));
      head.appendChild(el("p", "result-sub", D.name + ". Midpoint about " + fmt((lo + hi) / 2) + ". Figures compiled from published agency, clinic and non-profit pricing, November 2026."));
      out.appendChild(head);
      var ul = el("ul", "bar-list");
      rows.forEach(function (r) {
        var li = el("li"), top = el("div", "bar-top");
        top.appendChild(el("span", "", r[0])); top.appendChild(el("b", "", r[1][1] === 0 ? "US$0" : fmt(r[1][0]) + " to " + fmt(r[1][1])));
        var bar = el("div", "bar"), i = el("i");
        i.style.left = (r[1][0] / max * 100) + "%"; i.style.width = Math.max(1.5, (r[1][1] - r[1][0]) / max * 100) + "%";
        if (r[1][0] === r[1][1]) { i.style.left = "0"; i.style.width = (r[1][1] / max * 100) + "%"; }
        bar.appendChild(i); li.appendChild(top); li.appendChild(bar); ul.appendChild(li);
      });
      out.appendChild(ul);
      var warn = { canada: "Paying a surrogate or a matching intermediary is a federal offence in Canada; reimbursements must match receipts.", uk: "UK surrogates may receive reasonable expenses only. Agreements are unenforceable and a parental order is needed after birth.", mexico: "Legal footing differs by state; parentage usually needs a court step. Get advice in Mexico and at home.", colombia: "There is no surrogacy statute and a 2026 bill would ban the practice. Plan for legal change.", georgia: "Open to married heterosexual couples only; waits have lengthened and the government has proposed banning access for foreigners." };
      if (warn[key]) { var n = el("aside", "note note-warn"); n.appendChild(el("p", "", warn[key])); out.appendChild(n); }
      if (intl && key.indexOf("us") === 0) { var n2 = el("aside", "note note-info"); n2.appendChild(el("p", "", "Non-US intended parents: August 2026 executive orders created uncertainty about US citizenship documents for some commercial-surrogacy births. Speak to an immigration lawyer before transfer.")); out.appendChild(n2); }
      var sum = $('input[name="estimate"]', calc); if (sum) sum.value = D.name + ": " + fmt(lo) + " to " + fmt(hi) + " | embryos: " + emb + " | intl: " + (intl ? "yes" : "no");
      var dst = $('input[name="destination"]', calc); if (dst) dst.value = D.name;
    };
    form.addEventListener("input", runCost); form.addEventListener("change", runCost); runCost();
  }

  /* ================= ELIGIBILITY PRE-SCREEN ================= */
  var quiz = $("[data-quiz]");
  if (quiz) {
    var qf = $("form", quiz), result = $("[data-quiz-result]"), contact = $("[data-quiz-contact]");
    var unitSel = qf.units;
    var syncUnits = function () {
      $$("[data-metric]", qf).forEach(function (x) { x.hidden = unitSel.value !== "metric"; });
      $$("[data-imperial]", qf).forEach(function (x) { x.hidden = unitSel.value !== "imperial"; });
    };
    unitSel.addEventListener("change", syncUnits); syncUnits();
    var resSel = qf.residence, stateRow = $("[data-us-state]", qf);
    var syncState = function () { stateRow.hidden = resSel.value !== "US"; };
    resSel.addEventListener("change", syncState); syncState();
    qf.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = $$("[required]", qf).filter(function (x) { return !x.closest("[hidden]") && !(x.type === "radio" ? $$('input[name="' + x.name + '"]', qf).some(function (r) { return r.checked; }) : x.value.trim()); });
      $$(".field-err", qf).forEach(function (x) { x.classList.remove("field-err"); });
      if (bad.length) { bad.forEach(function (x) { (x.type === "radio" ? x.closest("label") : x).classList.add("field-err"); }); bad[0].focus(); return; }
      var v = function (n) { var r = $$('[name="' + n + '"]', qf).filter(function (x) { return x.type !== "radio" || x.checked; })[0]; return r ? r.value : ""; };
      var age = +v("age"), births = v("births"), raising = v("raising"), smoke = v("nicotine"), csec = +v("csections"), deliveries = +v("deliveries");
      var last = v("last_birth"), bf = v("breastfeeding"), screen = v("screening");
      var comps = $$('input[name="complications"]:checked', qf).map(function (x) { return x.value; });
      var bmi;
      if (unitSel.value === "metric") { var h = +v("height_cm") / 100, w = +v("weight_kg"); bmi = w / (h * h); }
      else { var hin = (+v("height_ft")) * 12 + (+v("height_in")), lb = +v("weight_lb"); bmi = 703 * lb / (hin * hin); }
      bmi = Math.round(bmi * 10) / 10;
      var code = resSel.value, cname = resSel.options[resSel.selectedIndex].text, J = SM.J || { prohibited: [], altruistic: [], residents: [] };
      var hard = [], soft = [];
      if (births !== "yes") hard.push("Clinics require at least one previous full-term pregnancy and delivery.");
      if (age < 21) hard.push("Most programmes require surrogates to be at least 21.");
      if (age > 45) hard.push("Most clinics set an upper age limit of 40-45.");
      else if (age > 40) soft.push("Some clinics accept surrogates aged 41-45; many cap at 40.");
      if (smoke === "yes") hard.push("Nicotine or drug use in the past year is a standard exclusion.");
      if (!isFinite(bmi) || bmi <= 0) soft.push("We couldn't calculate your BMI; a clinic will measure it at screening.");
      else if (bmi > 35) hard.push("Your BMI (" + bmi + ") is above the range most clinics accept (usually 19-32, sometimes up to 35).");
      else if (bmi > 32) soft.push("Your BMI (" + bmi + ") is above some clinics' limit of 32; others accept up to 35.");
      else if (bmi < 18.5) soft.push("Your BMI (" + bmi + ") is below the typical range; a clinic will advise.");
      if (csec > 3) hard.push("More than three caesarean deliveries is usually an exclusion.");
      else if (csec === 3) soft.push("Some clinics accept three previous caesareans; many prefer two or fewer.");
      if (deliveries > 5) hard.push("More than five previous deliveries is usually an exclusion.");
      else if (deliveries === 5) soft.push("Five previous deliveries is at the limit for many clinics.");
      if (comps.indexOf("none") === -1 && comps.length) {
        var serious = comps.filter(function (c) { return c === "Preeclampsia" || c === "Placenta problems" || c === "Severe bleeding after birth"; });
        (serious.length ? hard : soft).push("Previous " + comps.join(", ").toLowerCase() + " needs a doctor's review; " + (serious.length ? "these are often exclusions." : "some clinics accept this after review."));
      }
      if (raising !== "yes") soft.push("Many programmes prefer surrogates who are raising a child of their own.");
      if (last === "lt6") soft.push("Clinics usually want 6-12 months after your last delivery (often 12 after a caesarean). You can still prepare now.");
      if (bf === "yes") soft.push("You'll need to have stopped breastfeeding before starting medications.");
      if (screen !== "yes") soft.push("Medical, psychological and background screening is standard and required by reputable programmes.");
      var lawNote = SM.jurisNote ? SM.jurisNote(code, cname, "surrogate") : "";
      var prohibited = J.prohibited.indexOf(code) > -1, altruistic = J.altruistic.indexOf(code) > -1;
      if (code === "US" && qf.us_state.value === "LA") soft.push("Louisiana restricts compensated surrogacy; many programmes cannot work with Louisiana residents.");
      var key = prohibited ? "unlikely" : hard.length ? "unlikely" : soft.length ? "possible" : "likely";
      var titles = { likely: "You look like a strong candidate", possible: "You may qualify, with some questions", unlikely: prohibited ? "Surrogacy isn't permitted where you live" : "You may not qualify right now" };
      var bodies = {
        likely: "Based on common clinic guidelines, nothing in your answers rules you out. Final eligibility always depends on medical records, a clinic exam and psychological screening.",
        possible: "Some answers need a closer look. Many people in your position are accepted after a records review.",
        unlikely: prohibited ? "We can't connect you with surrogacy programmes in a country where it is prohibited. Read our guides to understand the law, and speak to a local lawyer if your circumstances change." : "Based on typical guidelines, one or more answers would usually rule out surrogacy for now. This is not medical advice, and some situations change over time."
      };
      result.hidden = false; result.innerHTML = "";
      var box = el("div", "verdict " + ({ likely: "v-good", possible: "v-maybe", unlikely: "v-no" })[key]);
      box.appendChild(el("p", "eyebrow", "Your pre-screen result"));
      box.appendChild(el("h3", "", titles[key]));
      box.appendChild(el("p", "", bodies[key]));
      var all = hard.concat(soft);
      if (all.length) { var ul = el("ul", "reasons"); all.forEach(function (r) { ul.appendChild(el("li", "", r)); }); box.appendChild(ul); }
      if (bmi && isFinite(bmi)) box.appendChild(el("p", "small mb0", "Calculated BMI: " + bmi));
      result.appendChild(box);
      if (lawNote) { var n = el("aside", "note " + (prohibited ? "note-warn" : altruistic ? "note-gold" : "note-info")); n.appendChild(el("p", "", lawNote)); result.appendChild(n); }
      var cf = $("form", contact);
      var set = function (n, val) { var f = $('input[name="' + n + '"]', cf); if (f) f.value = val; };
      set("verdict", titles[key]); set("verdict_key", key); set("reasons", all.join(" | ") || "none");
      set("age", age); set("bmi", bmi); set("residence", code); set("residence_name", cname); set("us_state", code === "US" ? qf.us_state.value : "");
      set("births", births); set("deliveries", deliveries); set("csections", csec); set("raising_child", raising); set("nicotine", smoke);
      set("complications", comps.join(", ")); set("last_birth", last); set("breastfeeding", bf); set("jurisdiction_note", lawNote);
      contact.hidden = prohibited;
      var cta = $("[data-quiz-cta]", contact);
      if (cta) cta.textContent = key === "likely" ? "Great. Where should we send your next steps?" : key === "possible" ? "Want a human to look at your answers?" : "Questions about your result?";
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ================= DUE DATE ================= */
  var dd = $("[data-duedate]");
  if (dd) {
    var df = $("form", dd), dout = $("[data-duedate-out]", dd);
    var t0 = new Date(); df.transfer.value = df.transfer.value || t0.toISOString().slice(0, 10);
    var runDD = function () {
      if (!df.transfer.value) return;
      var tr = new Date(df.transfer.value + "T12:00:00"), day = +df.embryo.value, gaAt = 14 + day;
      var at = function (gaDays) { var d = new Date(tr); d.setDate(d.getDate() + gaDays - gaAt); return d; };
      var due = at(280);
      var today = new Date(); today.setHours(12, 0, 0, 0);
      var ga = Math.floor((today - tr) / 864e5) + gaAt;
      dout.innerHTML = "";
      dout.appendChild(el("p", "eyebrow", "Estimated due date"));
      dout.appendChild(el("p", "result-total", fmtDate(due)));
      dout.appendChild(el("p", "result-sub", ga >= gaAt && ga <= 294 ? "Today is about " + Math.floor(ga / 7) + " weeks " + (ga % 7) + " days of pregnancy (gestational age)." : "Day-" + day + " embryo: due date is transfer date + " + (266 - day) + " days."));
      var ms = [["Pregnancy blood test (beta hCG)", gaAt + (day === 3 ? 11 : day === 6 ? 8 : 9)], ["First ultrasound (about 6 weeks)", 45], ["Heartbeat confirmation (7-8 weeks)", 52], ["Typical release to obstetrician (9-10 weeks)", 66], ["Non-invasive prenatal testing possible (10 weeks)", 70], ["Anatomy scan (about 20 weeks)", 140], ["Glucose screening (24-28 weeks)", 175], ["Third trimester begins (28 weeks)", 196], ["Full term (37 weeks)", 259], ["Due date (40 weeks)", 280]];
      var ol = el("ol", "timeline");
      ms.forEach(function (m) { var li = el("li"); var t = el("time", "", fmtDate(at(m[1]))); li.appendChild(t); li.appendChild(el("span", "", m[0])); ol.appendChild(li); });
      dout.appendChild(ol);
      dout.appendChild(el("p", "small", "Clinics set their own test and scan schedules. This is an estimate, not medical advice."));
    };
    df.addEventListener("input", runDD); df.addEventListener("change", runDD); runDD();
  }

  /* ================= JOURNEY TIMELINE ================= */
  var tl = $("[data-timeline]");
  if (tl) {
    var tf = $("form", tl), tout = $("[data-timeline-out]", tl);
    var now = new Date(); tf.start.value = tf.start.value || (now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0"));
    var runTL = function () {
      var p = tf.path.value, emb = tf.embryos.value === "yes";
      var match = { agency: 3, altruistic: 12, international: 2, known: 0.5 }[p];
      var post = p === "international" ? 2 : 0.75;
      var phases = [["Research and consultations", 0, 1.5, false]];
      var t = 1.5;
      if (!emb) phases.push(["IVF and embryo creation", t, 2.5, true]);
      phases.push(["Finding and matching with a surrogate", t, match, false]);
      t += Math.max(match, emb ? 0 : 2.5);
      phases.push(["Medical and psychological screening", t, 1.5, true]); t += 1.5;
      phases.push(["Legal agreements (separate lawyers)", t, 1, false]); t += 1;
      phases.push(["Medication and embryo transfer", t, 1.25, true]); t += 1.25;
      phases.push(["Pregnancy", t, 9, false]); t += 9;
      phases.push(["Birth, parentage and travel documents", t, post, true]); t += post;
      var start = new Date(tf.start.value + "-01T12:00:00");
      var addM = function (m) { var d = new Date(start); d.setDate(d.getDate() + Math.round(m * 30.44)); return d; };
      tout.innerHTML = "";
      tout.appendChild(el("p", "eyebrow", "Estimated time to bring your baby home"));
      tout.appendChild(el("p", "result-total", Math.round(t) + " months"));
      tout.appendChild(el("p", "result-sub", "From " + addM(0).toLocaleDateString("en", { month: "long", year: "numeric" }) + " to about " + addM(t).toLocaleDateString("en", { month: "long", year: "numeric" }) + ". Typical durations; a failed transfer usually adds 2-3 months."));
      var g = el("div", "gantt");
      phases.forEach(function (ph) {
        var row = el("div", "g-row"); row.appendChild(el("span", "", ph[0]));
        var tr = el("div", "g-track"), b = el("div", "g-bar" + (ph[3] ? " alt" : ""));
        b.style.left = (ph[1] / t * 100) + "%"; b.style.width = Math.max(4, ph[2] / t * 100) + "%";
        b.textContent = addM(ph[1]).toLocaleDateString("en", { month: "short", year: "2-digit" });
        tr.appendChild(b); row.appendChild(tr); g.appendChild(row);
      });
      tout.appendChild(g);
    };
    tf.addEventListener("input", runTL); tf.addEventListener("change", runTL); runTL();
  }

  /* ================= CHECKLIST ================= */
  var ck = $("[data-checklist]");
  if (ck) {
    var boxes = $$('input[type="checkbox"]', ck), meter = $(".meter i", ck), lbl = $("[data-ck-count]", ck);
    var saved = (SM.store && SM.store.get("sm-checklist")) || {};
    boxes.forEach(function (b) { b.checked = !!saved[b.id]; });
    var upd = function () {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      meter.style.width = (n / boxes.length * 100) + "%"; lbl.textContent = n + " of " + boxes.length + " answered";
      var s = {}; boxes.forEach(function (b) { if (b.checked) s[b.id] = 1; }); if (SM.store) SM.store.set("sm-checklist", s);
    };
    ck.addEventListener("change", upd); upd();
    var pr = $("[data-print]"); if (pr) pr.addEventListener("click", function () { window.print(); });
    var rs = $("[data-reset]"); if (rs) rs.addEventListener("click", function () { boxes.forEach(function (b) { b.checked = false; }); upd(); });
  }

  /* ================= COMPARE ================= */
  var cmp = $("[data-compare]");
  if (cmp) {
    var sels = $$("select", cmp), cout = $("[data-compare-out]", cmp), DATA = null;
    var FIELDS = [["Status", "status"], ["Paying a surrogate", "compensation"], ["Foreign intended parents", "foreigners"], ["Same-sex couples", "same_sex"], ["Single parents", "singles"], ["Legal parenthood", "parentage"], ["Key law", "key_law"], ["Latest change", "recent"], ["Risk level", "risk"], ["Indicative cost", "cost"]];
    var runCmp = function () {
      if (!DATA) return;
      var picked = sels.map(function (s) { return DATA.countries.filter(function (c) { return c.slug === s.value; })[0]; }).filter(Boolean);
      cout.innerHTML = "";
      if (!picked.length) { cout.appendChild(el("p", "muted", "Choose at least one country.")); return; }
      var wrap = el("div", "table-wrap"), tb = el("table", "compare-table"), thead = el("thead"), hr = el("tr");
      hr.appendChild(el("th", "", ""));
      picked.forEach(function (c) { var th = el("th"); var a = el("a", "", c.name); a.href = BASE + "laws/" + c.slug + ".html"; th.appendChild(a); hr.appendChild(th); });
      thead.appendChild(hr); tb.appendChild(thead);
      var tbody = el("tbody");
      FIELDS.forEach(function (f) {
        var tr = el("tr"); tr.appendChild(el("th", "", f[0]));
        picked.forEach(function (c) {
          var td = el("td");
          if (f[1] === "status") { td.appendChild(el("span", "badge st-" + c.status, DATA.status_labels[c.status])); }
          else td.textContent = c[f[1]] || "Not published";
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      tb.appendChild(tbody); wrap.appendChild(tb); cout.appendChild(wrap);
      cout.appendChild(el("p", "small", "Law reviewed " + DATA.reviewed + ". Summary only; not legal advice."));
    };
    fetch(BASE + "data/countries.json").then(function (r) { return r.json(); }).then(function (j) {
      DATA = j;
      var opts = j.countries.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
      sels.forEach(function (s, k) {
        var o0 = el("option", "", k === 0 ? "Choose a country" : "Add a country (optional)"); o0.value = ""; s.appendChild(o0);
        opts.forEach(function (c) { var o = el("option", "", c.name); o.value = c.slug; s.appendChild(o); });
      });
      var q = new URLSearchParams(location.search).get("c");
      sels[0].value = q || "united-states"; sels[1].value = q === "canada" ? "united-states" : "canada"; sels[2].value = "mexico";
      runCmp();
    });
    sels.forEach(function (s) { s.addEventListener("change", runCmp); });
  }
})();
