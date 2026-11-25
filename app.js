(() => {
  const C = window.AGENCY_CONFIG, T = window.I18N, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  let lang = "fr", cat = "all", gear = "all", lldOnly = false, mode = "short";
  try { lang = localStorage.getItem("lang") || "fr"; } catch (e) {}
  if (!C.languages.includes(lang)) lang = C.defaultLang;
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rp = () => ({ min: C.rules.minAge, years: C.rules.licenseYears, deposit: C.rules.deposit, km: C.rules.mileage[lang] || C.rules.mileage.fr, cur: C.currency });
  const t = (k, p = {}) => (T[lang]?.[k] ?? T.fr[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => p[x] ?? "");
  const money = n => new Intl.NumberFormat(lang === "en" ? "en-US" : "fr-FR").format(n) + " " + C.currency;
  const wa = txt => `https://wa.me/${C.whatsapp}` + (txt ? `?text=${encodeURIComponent(txt)}` : "");
  const car = id => C.cars.find(c => c.id === id), loc = id => C.locations.find(l => l.id === id);
  const fb = '<svg class="fb" viewBox="0 0 250 100"><path d="M12 74V62q2-6 14-8l32-5q14-20 40-22h50q22 2 36 22l30 6q12 4 14 14v6q0 4-6 4H12z" fill="#CBD5E1"/><circle cx="62" cy="78" r="14" fill="#0F172A"/><circle cx="190" cy="78" r="14" fill="#0F172A"/></svg>';
  const days = () => { const a = new Date($("#from").value), b = new Date($("#to").value); return isNaN(a) || isNaN(b) ? 0 : Math.round((b - a) / 864e5); };
  const cols = () => innerWidth >= 1024 ? 3 : innerWidth >= 768 ? 2 : 1;
  const list = () => C.cars.filter(c => (cat === "all" || (cat === "lld" ? c.lld : c.category === cat)) && (!lldOnly || c.lld) && (gear === "all" || c.transmission === gear));

  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(e => e.textContent = t(e.dataset.i18n, rp()));
    $("#h1").innerHTML = `<span>${t("h1a")}</span><span>${t("h1b")} <em>${t("h1c")}</em></span>`;
    $("#okText").textContent = t("ok_license", rp());
    $("#termList").innerHTML = [1, 2, 3, 4].map(i => `<li>${t("t" + i, rp())}</li>`).join("");
    $("#faqList").innerHTML = [1, 2, 3, 4].map(i => `<details><summary>${t("q" + i)}</summary><p>${t("a" + i)}</p></details>`).join("");
    $("#lang").innerHTML = C.languages.map(l => `<button type="button" data-l="${l}" aria-pressed="${l === lang}">${l.toUpperCase()}</button>`).join("");
    const keep = [$("#qType").value, $("#qGear").value, $("#qDur").value, $("#loc").value, $("#months").value];
    const o = (v, l) => `<option value="${v}">${l}</option>`;
    $("#qType").innerHTML = o("all", t("all_types")) + ["city", "sedan", "family"].map(c => o(c, t(c))).join("");
    $("#qGear").innerHTML = o("all", t("all_gear")) + o("auto", t("auto")) + o("manual", t("manual"));
    $("#qDur").innerHTML = o("short", t("d_short")) + o("lld", t("d_lld"));
    $("#loc").innerHTML = C.locations.map(l => o(l.id, esc(l[lang] || l.fr))).join("");
    $("#months").innerHTML = C.lldMonths.map(m => o(m, t("months_n", { n: m }))).join("");
    [["#qType", 0], ["#qGear", 1], ["#qDur", 2], ["#loc", 3], ["#months", 4]].forEach(([s, i]) => { if (keep[i]) $(s).value = keep[i]; });
    $("#qType").value = cat === "all" || ["city", "sedan", "family"].includes(cat) ? cat : "all";
    $("#lldCta").hidden = false;
    $("#rates").innerHTML = C.cars.filter(c => c.lld).sort((a, b) => a.monthly - b.monthly).map(c => `<li><span>${esc(c.name)}</span><b>${money(c.monthly)} <small>${t("per_month")}</small></b></li>`).join("");
    setMode(mode); renderChips(); renderCars(); calc();
  }

  function renderChips() {
    $("#chips").innerHTML = ["all", "city", "sedan", "family", "lld"].map(c => `<button type="button" data-c="${c}" aria-pressed="${c === cat}">${t(c === "all" ? "f_all" : c)}</button>`).join("");
    const on = gear !== "all" || lldOnly;
    $("#fNote").hidden = !on;
    $("#fNote").innerHTML = on ? `${[gear !== "all" ? t(gear) : "", lldOnly ? t("d_lld") : ""].filter(Boolean).join(" · ")} <button type="button" data-reset>${t("reset")}</button>` : "";
  }

  function renderCars() {
    const cs = list();
    $("#cars").innerHTML = cs.map(c => `
      <article class="car ${c.available ? "" : "off"}">
        <div class="ph"><span class="tag">${t(c.category)}</span><img src="${esc(c.image)}" alt="${esc(c.name)}" loading="lazy"></div>
        <div class="bd"><h3>${esc(c.name)}</h3>
          <ul class="specs"><li>${t(c.transmission)}</li><li>${t(c.fuel)}</li><li>${t("seats", { n: c.seats })}</li><li>${t("ac")}</li></ul>
          <div class="price">${lldOnly && c.lld ? `<strong>${money(c.monthly)}</strong><small>${t("per_month")}</small>` : `<strong>${money(c.price)}</strong><small>${t("per_day")}</small>`}</div>
          ${c.lld && !lldOnly ? `<div class="lldp"><span>${t("lld_from")}</span> <b>${money(c.monthly)}</b> <small>${t("per_month")}</small></div>` : ""}
          <div class="cta"><button class="btn" type="button" data-book="${esc(c.id)}" ${c.available ? "" : "disabled"}>${c.available ? t("book") : t("unavailable")}</button>${c.lld ? `<button class="btn ghost" type="button" data-quote="${esc(c.id)}">${t("quote")}</button>` : ""}</div>
        </div></article>`).join("") + (cs.length ? "" : `<p class="empty">${t("no_res")}</p>`) +
      `<article class="car more"><b>${t("more_t")}</b><p>${t("more_d")}</p><a class="btn wa" target="_blank" rel="noopener" href="${wa(t("more_msg"))}">${t("more_b")}</a></article>`;
    fit();
  }
  function fit() {
    const n = $$("#cars .car:not(.more)").length, c = cols(), r = n % c, m = $("#cars .more");
    if (m) m.style.gridColumn = "span " + (n === 0 ? c : r === 0 ? c : c - r);
  }

  function setMode(m) {
    mode = m; $("#form").dataset.mode = m;
    $$(".tab").forEach(b => b.setAttribute("aria-selected", b.dataset.mode === m));
    const cur = $("#car").value;
    $("#car").innerHTML = `<option value="">${t("choose")}</option>` + C.cars.filter(c => c.available && (m === "short" || c.lld)).map(c => `<option value="${esc(c.id)}">${esc(c.name)} — ${m === "lld" ? money(c.monthly) + " " + t("per_month") : money(c.price) + " " + t("per_day")}</option>`).join("");
    if (cur && car(cur) && (m === "short" || car(cur).lld)) $("#car").value = cur;
    $("#from").required = $("#to").required = m === "short";
    $("#note").textContent = m === "lld" ? t("note_lld") : t("note", rp());
    calc();
  }

  function calc() {
    const c = car($("#car").value), row = (k, v, cl = "") => `<div class="${cl}"><dt>${t(k)}</dt><dd>${v}</dd></div>`;
    if (mode === "lld") {
      const mo = +$("#months").value || 0, ok = c && mo;
      $("#sum").innerHTML = row("monthly", ok ? money(c.monthly) : "—") + row("months", mo ? t("months_n", { n: mo }) : "—") + row("total_lld", ok ? money(c.monthly * mo) : "—", "tot");
      return ok ? { c, mo, total: c.monthly * mo } : null;
    }
    const n = days(), l = loc($("#loc").value), fee = l?.fee || 0, ok = n > 0 && c;
    $("#sum").innerHTML = row("days", n > 0 ? t("days_n", { n }) : "—") + (fee && ok ? row("fee", money(fee)) : "") + row("total", ok ? money(n * c.price + fee) : "—", "tot");
    return ok ? { c, n, l, total: n * c.price + fee } : null;
  }

  document.addEventListener("click", e => {
    const q = s => e.target.closest(s);
    if (q("[data-l]")) { lang = q("[data-l]").dataset.l; try { localStorage.setItem("lang", lang); } catch (x) {} applyLang(); }
    if (q("[data-c]")) { cat = q("[data-c]").dataset.c; lldOnly = false; renderChips(); renderCars(); }
    if (q("[data-reset]")) { gear = "all"; lldOnly = false; cat = "all"; renderChips(); renderCars(); }
    if (q("[data-book]") || q("[data-quote]")) { const b = q("[data-book]") || q("[data-quote]"); setMode(b.dataset.book ? "short" : "lld"); $("#car").value = b.dataset.book || b.dataset.quote; calc(); go(); }
    if (q("[data-mode]")) { setMode(q("[data-mode]").dataset.mode); }
  });
  const go = () => { $("#book").scrollIntoView(); $("#form [name=name]").focus({ preventScroll: true }); };
  $("#lldCta").addEventListener("click", () => { setMode("lld"); go(); });
  $("#quick").addEventListener("submit", e => { e.preventDefault(); cat = $("#qType").value; gear = $("#qGear").value; lldOnly = $("#qDur").value === "lld"; renderChips(); renderCars(); $("#fleet").scrollIntoView(); });
  ["#car", "#loc", "#from", "#to", "#months"].forEach(s => $(s).addEventListener("change", () => { if (s === "#from") $("#to").min = $("#from").value; $("#err").hidden = true; calc(); }));
  addEventListener("resize", fit);
  addEventListener("error", e => { if (e.target.matches?.(".car img")) e.target.outerHTML = fb; }, true);

  $("#form").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target, r = calc(); if (!f.reportValidity()) return;
    if (!r) { $("#err").textContent = $("#car").value ? t("err_dates") : t("err_car"); $("#err").hidden = false; return; }
    const fd = Object.fromEntries(new FormData(f)), d = v => new Date(v).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR");
    const lines = mode === "lld"
      ? [`*${C.name}* — ${t("wa_head_lld")}`, "", `${t("wa_car")}: ${r.c.name}`, `${t("wa_term")}: ${t("months_n", { n: r.mo })}`, `${t("wa_month")}: ${money(r.c.monthly)}`, `${t("wa_total")}: ${money(r.total)}`, fd.company?.trim() ? `${t("wa_co")}: ${fd.company.trim()}` : "", fd.start ? `${t("wa_start")}: ${d(fd.start)}` : ""]
      : [`*${C.name}* — ${t("wa_head")}`, "", `${t("wa_car")}: ${r.c.name}`, `${t("wa_pick")}: ${r.l[lang] || r.l.fr}`, `${t("wa_dates")}: ${d(fd.from)} → ${d(fd.to)}`, `${t("wa_days")}: ${t("days_n", { n: r.n })}`, `${t("wa_total")}: ${money(r.total)}`];
    const msg = [...lines.filter((x, i) => x !== "" || i === 1), "", `${t("wa_client")}: ${fd.name.trim()}`, `${t("wa_tel")}: ${fd.phone.trim()}`].join("\n");
    window.Leads.save({ name: fd.name, phone: fd.phone, car: r.c.name, pickup: mode === "lld" ? "LLD" : (r.l[lang] || r.l.fr), date_from: fd.from || fd.start || null, date_to: fd.to || null, days: r.n || (r.mo * 30), total: r.total, lang });
    window.open(wa(msg), "_blank", "noopener");
  });

  // init
  document.title = C.name + " — " + (lang === "en" ? "Car rental & LLD" : "Location courte & longue durée");
  ["#navWa", "#fab", "#fWa"].forEach(s => $(s).href = wa());
  $("#fWa").textContent = C.whatsappDisplay; $("#fName").textContent = "© " + new Date().getFullYear() + " " + C.name;
  $("#mapBtn").href = C.map.url; $("#dirBtn").href = C.map.directions;
  const now = new Date(), today = new Date(now.getTime() - now.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  $("#from").min = $("#to").min = $("#start").min = today;
  if (C.logo) {
    $("#brand").insertAdjacentHTML("afterbegin", `<img class="logo" src="${esc(C.logo)}" alt="${esc(C.name)}">`);
    $("#fName").insertAdjacentHTML("beforebegin", `<img class="flogo" src="${esc(C.logo)}" alt="">`);
    document.head.insertAdjacentHTML("beforeend", `<link rel="icon" href="${esc(C.logo)}">`);
  }
  applyLang();

  // motion: reveal, nav shrink
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .12 });
  const watch = () => $$(".car:not(.seen),.rv:not(.seen)").forEach((el, i) => { el.classList.add("seen"); el.style.setProperty("--d", (i % 6) * 90 + "ms"); io.observe(el); });
  new MutationObserver(watch).observe($("#cars"), { childList: true }); watch();
  const sc = () => $("#nav").classList.toggle("sc", scrollY > 20); addEventListener("scroll", sc, { passive: true }); sc();
})();
