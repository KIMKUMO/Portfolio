(function () {
  "use strict";

  const root = document.getElementById("app");
  const storageKey = "steadyPlannerPortfolioDataV4";
  window.DEFAULT_PORTFOLIO_DATA = JSON.parse(JSON.stringify(window.PORTFOLIO_DATA));

  try {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) window.PORTFOLIO_DATA = JSON.parse(savedData);
  } catch (error) {
    console.warn("저장된 포트폴리오 데이터를 불러오지 못했습니다.", error);
  }

  const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const pad = (index) => String(index + 1).padStart(2, "0");
  const lines = (items) => items.map(escapeHTML).join("<br>");
  const contactLabels = {
    email: "이메일",
    phone: "전화",
    location: "지역",
    military: "병역",
    university: "학력"
  };

  const resumeStart = (meta) => {
    const match = /^\s*(\d{4})(?:\s*[.\-/]\s*(0?[1-9]|1[0-2])\b|\s*년\s*(0?[1-9]|1[0-2])\s*월)?/.exec(meta ?? "");
    return match ? Number(match[1]) * 100 + Number(match[2] ?? match[3] ?? 0) : 0;
  };

  const resumeItem = (item) => `
    <h4>${escapeHTML(item.title)}</h4>
    ${item.meta && item.meta !== "숙련도 또는 사용 기간" ? `<p class="resume-meta">${escapeHTML(item.meta)}</p>` : ""}
    ${item.description ? `<p class="resume-item-description">${escapeHTML(item.description)}</p>` : ""}`;

  const projectTitle = (title) => title === "제로 게이트" ? "제로 게이트 : 헌터즈" : title;

  const projectGalleryItems = (items) => {
    const defaults = window.DEFAULT_PORTFOLIO_DATA.projects.items;
    if (!Array.isArray(items)) return defaults;
    const savedByTitle = new Map(items.map((item) => [projectTitle(item.title), item]));
    const defaultTitles = new Set(defaults.map((item) => item.title));
    const updated = defaults.map((item) => {
      const saved = savedByTitle.get(item.title);
      if (!saved) return item;
      const period = item.title === "보드게임 페스타" && saved.period === "2023년" ? item.period : saved.period || item.period;
      return { ...item, ...saved, title: item.title, period, details: { ...item.details, ...saved.details } };
    });
    return updated.concat(items.filter((item) => !defaultTitles.has(projectTitle(item.title))));
  };

  const projectGalleryCard = (item) => {
    const details = item.details || {};
    const [role, savedPeriod] = (item.role || "").split(/\s*·\s*(?=\d{4}(?:\.|년|\b))/);
    const displayRole = role.replace(/^팀원\s*·.*$/, "팀원");
    const tasks = [
      details.planning,
      details.development,
      ...(Array.isArray(details.tasks) ? details.tasks : [])
    ].filter(Boolean).join(" · ");
    const facts = [
      ["담당업무", tasks],
      ["결과", details.result],
      ["회고", details.lesson]
    ];

    return `
      <article class="experience-card glow-card${item.image ? "" : " experience-card-text"}">
        ${item.image ? `<img class="experience-image${item.imageFit === "contain" ? " experience-image-contained" : ""}" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)} 플레이 화면" loading="lazy" decoding="async">` : ""}
        <div class="experience-copy">
          <p class="experience-role">${escapeHTML(displayRole || "—")}</p>
          <p class="experience-period">${escapeHTML(item.period || savedPeriod || "—")}</p>
          <h3>${escapeHTML(item.title)}</h3>
          <p class="experience-summary">${escapeHTML(item.description || details.overview || item.keyExperience || item.CoreExperience)}</p>
          <dl class="experience-facts">${facts.map(([label, value]) => `
            <div><dt>${label}</dt><dd>${escapeHTML(value || "—")}</dd></div>`).join("")}</dl>
        </div>
      </article>`;
  };

  const portfolioCard = (item, index) => {
    const tag = item.link ? "a" : "article";
    const link = item.link ? ` href="${escapeHTML(item.link)}" target="_blank" rel="noopener"` : "";
    const imageClass = item.image ? " has-image" : "";
    return `
      <${tag} class="portfolio-card glow-card"${link}>
        <div class="portfolio-visual${imageClass}" data-portfolio-image="${index}" aria-hidden="true">
          <span>${pad(index)}</span><i></i><i></i><i></i>
        </div>
        <div class="portfolio-info">
          <span class="status-badge ${escapeHTML(item.tone || "violet")}">${escapeHTML(item.type)}</span>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.description)}</p>
          <span class="view-link">${item.link ? "VIEW CASE" : "LINK READY"}<b aria-hidden="true">↗</b></span>
        </div>
      </${tag}>`;
  };

  const renderPortfolio = () => {
    const data = window.PORTFOLIO_DATA;
    if (!data || !root) {
      document.body.innerHTML = '<p class="load-error">content.js 파일을 확인해 주세요.</p>';
      return;
    }

    document.title = data.site.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.content = data.site.description;

    const isTimelineGroup = (group) => group.key === "career" || group.key === "education";
    const resumeTimeline = data.resume.groups.filter(isTimelineGroup)
      .flatMap((group) => group.items.map((item) => ({ item, label: group.label, start: resumeStart(item.meta) })))
      .sort((a, b) => b.start - a.start);
    const resumeSideGroups = data.resume.groups.filter((group) => !isTimelineGroup(group))
      .sort((a, b) => Number(b.key === "skill") - Number(a.key === "skill"));

  root.innerHTML = `
    <main id="main">
      <header class="site-header">
        <a class="brand" href="page.html?section=main" aria-label="메인으로 이동">
          <span class="brand-mark" aria-hidden="true">T</span>
          <span>${escapeHTML(data.site.brand)}</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="page.html?section=main">메인</a>
          <a href="page.html?section=resume">이력서</a>
          <a href="page.html?section=experience">프로젝트 경험</a>
          <a href="page.html?section=portfolio">포트폴리오</a>
          <a href="page.html?section=hobby">취미</a>
        </nav>
        <a class="header-cta" href="#portfolio">작업 보기</a>
      </header>

      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-slides" aria-hidden="true">
          ${data.hero.slides.map((slide, index) => `<div class="hero-slide${index === 0 ? " is-active" : ""}" data-hero-slide="${index}">${slide.video ? `<video src="${escapeHTML(slide.video)}" poster="${escapeHTML(slide.image)}" autoplay muted loop playsinline preload="auto"></video>` : ""}</div>`).join("")}
        </div>
        <div class="hero-captions">
          ${data.hero.slides.map((slide, index) => `
            <div class="hero-caption${index === 0 ? " is-active" : ""}"${index === 0 ? "" : " aria-hidden=\"true\""}>
              <img class="hero-caption-logo" src="${escapeHTML(slide.logo)}" alt="${escapeHTML(projectTitle(slide.title))}">
              <div class="hero-caption-details">${slide.details.map((detail) => `<p>${escapeHTML(detail)}</p>`).join("")}</div>
            </div>`).join("")}
        </div>
        <div class="hero-content">
          <p class="eyebrow">${escapeHTML(data.hero.eyebrow)}</p>
          <h1 id="hero-title">${data.hero.firstLine ? `${escapeHTML(data.hero.firstLine)}<br>` : ""}<span>${escapeHTML(data.hero.highlight)}</span> ${escapeHTML(data.hero.lastWord)}</h1>
          <p class="hero-copy">${escapeHTML(data.hero.description)}</p>
          <div class="hero-actions">
            <a class="button primary" href="#story">소개 읽기 <b aria-hidden="true">↘</b></a>
            
          </div>
        </div>
        <a class="scroll-cue" href="#story" aria-label="소개로 스크롤"><span>SCROLL</span><i aria-hidden="true"></i></a>
      </section>

      <section id="story" class="story section-shell" aria-labelledby="story-title">
        <div class="story-heading">
          ${data.story.eyebrow ? `<p class="eyebrow">${escapeHTML(data.story.eyebrow)}</p>` : ""}
          <h2 id="story-title">${lines(data.story.titleLines)}</h2>
        </div>
        <div class="story-copy">
          <span class="quote-mark" aria-hidden="true">“</span>
          ${data.story.paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
          <div class="story-line"><i></i><span>STEADY PROGRESS</span></div>
        </div>
      </section>

      <section id="resume" class="section-shell section-block" aria-labelledby="resume-title">
        <header class="resume-overview">
          <div class="resume-identity">
            <img class="resume-avatar" src="assets/KakaoTalk_20260911_125731636.jpg" width="72" height="72" alt="">
            <div>
              <p class="resume-kicker">이력서</p>
              <h2 id="resume-title">${escapeHTML(data.resume.name)}</h2>
              <p class="resume-role">${escapeHTML(data.resume.role)}</p>
            </div>
          </div>
          <dl class="resume-contacts">
            ${Object.entries(data.resume.contacts).map(([key, value]) => `
              <div><dt>${escapeHTML(contactLabels[key] || key.toUpperCase())}</dt><dd>${escapeHTML(value)}</dd></div>`).join("")}
          </dl>
        </header>
        <div class="resume-columns">
          <section class="resume-history" aria-labelledby="resume-history-title">
            <h3 id="resume-history-title">경력과 교육</h3>
            ${resumeTimeline.length ? `<ol class="resume-timeline">
              ${resumeTimeline.map(({ item, label, start }) => `
                <li>
                  <span class="resume-year">${start ? Math.floor(start / 100) : ""}</span>
                  <div>
                    <p class="resume-kind">${escapeHTML(label)}</p>
                    ${resumeItem(item)}
                  </div>
                </li>`).join("")}
            </ol>` : '<p class="resume-empty">아직 등록된 경력이나 교육이 없습니다.</p>'}
          </section>
          ${resumeSideGroups.length ? `<aside class="resume-side glow-card" aria-label="기술과 자격증">
            ${resumeSideGroups.map((group) => `
              <section class="resume-group">
                <h3>${escapeHTML(group.label)}</h3>
                ${group.items.length ? `<ul class="resume-items">
                  ${group.items.map((item) => `<li>${resumeItem(item)}</li>`).join("")}
                </ul>` : '<p class="resume-empty">아직 등록된 항목이 없습니다.</p>'}
              </section>`).join("")}
          </aside>` : ""}
        </div>
      </section>

      <section id="experience" class="section-shell section-block" aria-labelledby="experience-title">
        <header class="section-header">
          <div><p class="eyebrow">02 · PROJECT EXPERIENCE</p><h2 id="experience-title">프로젝트 경험</h2></div>
          <p>${escapeHTML(data.projects.intro)}</p>
        </header>
        <div class="experience-gallery">
          ${projectGalleryItems(data.projects.items).map(projectGalleryCard).join("")}
        </div>
      </section>

      <section id="portfolio" class="section-shell section-block" aria-labelledby="portfolio-title">
        <header class="section-header">
          <div><p class="eyebrow">03 · SELECTED WORK</p><h2 id="portfolio-title">포트폴리오</h2></div>
          <p>${escapeHTML(data.portfolio.intro)}</p>
        </header>
        <div class="portfolio-grid">${data.portfolio.items.map(portfolioCard).join("")}</div>
      </section>

      <section id="hobby" class="section-shell section-block" aria-labelledby="hobby-title">
        <header class="section-header">
          <div><p class="eyebrow">04 · OFF THE CLOCK</p><h2 id="hobby-title">취미</h2></div>
          <p>${escapeHTML(data.hobbies.intro)}</p>
        </header>
        <div class="hobby-grid">
          ${data.hobbies.items.map((item, index) => `
            <button type="button" class="hobby-feature glow-card" data-hobby-index="${index}" aria-haspopup="dialog" aria-label="${escapeHTML(item.title)} 상세 정보 보기">
              <span class="hobby-number">${pad(index)}</span>
              <div><p class="mini-label">${escapeHTML(item.label)}</p><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p></div>
            </button>`).join("")}
        </div>
      </section>

      <footer class="site-footer section-shell">
        <div><p class="eyebrow">${escapeHTML(data.footer.eyebrow)}</p><h2>${escapeHTML(data.footer.titleLines[0])}<br><span>${escapeHTML(data.footer.titleLines[1])}</span></h2></div>
        <address class="footer-contact">
          <strong>김재원</strong>
          <span>이메일 : <a href="mailto:ky74123@gmail.com">ky74123@gmail.com</a></span>
        </address>
        <p class="copyright">${escapeHTML(data.site.copyright)}</p>
      </footer>
      <div class="hobby-modal" data-hobby-modal hidden></div>
    </main>`;

  document.querySelectorAll("[data-hero-slide]").forEach((element) => {
    const slide = data.hero.slides[Number(element.dataset.heroSlide)];
    element.style.backgroundImage = `url("${slide.image}")`;
  });

  document.querySelectorAll("[data-portfolio-image]").forEach((element) => {
    const item = data.portfolio.items[Number(element.dataset.portfolioImage)];

  root.addEventListener("click", (event) => {
    const close = event.target.closest("[data-quick-close]");
    if (close) { const modal = close.closest(".hobby-modal"); if (modal) { modal.hidden = true; modal.innerHTML = ""; } return; }
    const hobbyButton=event.target.closest("[data-hobby-index]");
    if(hobbyButton){const item=window.PORTFOLIO_DATA.hobbies.items[Number(hobbyButton.dataset.hobbyIndex)];const modal=root.querySelector("[data-hobby-modal]");if(item&&modal){modal.innerHTML=`<div class="hobby-modal-backdrop" data-quick-close></div><article class="hobby-modal-dialog" role="dialog"><button class="hobby-modal-close" data-quick-close>×</button><h3>${escapeHTML(item.title)}</h3><div class="hobby-detail-grid">${(item.details||[]).map((d,i)=>`<article class="hobby-detail-slot">${d.image?`<img src="${escapeHTML(d.image)}" alt="">`:""}<div class="hobby-detail-copy"><span>${pad(i)}</span><h4>${escapeHTML(d.title)}</h4><p>${escapeHTML(d.description)}</p></div></article>`).join("")}</div></article>`;modal.hidden=false;modal.classList.add("open");}}
  });  
    if (item && item.image) element.style.backgroundImage = `linear-gradient(rgba(0,0,0,.24),rgba(0,0,0,.58)),url("${item.image}")`;
  });

  };

  window.PORTFOLIO_STORAGE_KEY = storageKey;
  window.renderPortfolio = renderPortfolio;
  renderPortfolio();

  let lastHobbyTrigger = null;
  const closeHobbyModal = (restoreFocus = true) => { const modal = root.querySelector("[data-hobby-modal]"); if (!modal || modal.hidden) return; modal.classList.remove("open"); document.body.classList.remove("hobby-modal-is-open"); window.setTimeout(() => { modal.hidden = true; modal.innerHTML = ""; if (restoreFocus && lastHobbyTrigger && lastHobbyTrigger.isConnected) lastHobbyTrigger.focus(); }, 180); };
  const openHobbyModal = (index, trigger) => { const item = window.PORTFOLIO_DATA.hobbies.items[index]; const modal = root.querySelector("[data-hobby-modal]"); if (!item || !modal) return; lastHobbyTrigger = trigger; const details = Array.isArray(item.details) ? item.details : []; modal.innerHTML = `<div class="hobby-modal-backdrop" data-hobby-close></div><article class="hobby-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="hobby-modal-title"><button type="button" class="hobby-modal-close" data-hobby-close aria-label="팝업 닫기">×</button><p class="mini-label">${escapeHTML(item.label)}</p><h3 id="hobby-modal-title">${escapeHTML(item.title)}</h3><p class="hobby-modal-intro">${escapeHTML(item.description)}</p><div class="hobby-detail-grid">${details.map((detail, i) => `<article class="hobby-detail-slot">${detail.image ? `<img src="${escapeHTML(detail.image)}" alt="">` : `<div class="hobby-detail-placeholder">PHOTO ${pad(i)}</div>`}<div class="hobby-detail-copy"><span>${pad(i)}</span><h4>${escapeHTML(detail.title || `자리 ${pad(i)} 제목`)}</h4><p>${escapeHTML(detail.description || "")}</p></div></article>`).join("")}</div></article>`; modal.hidden = false; document.body.classList.add("hobby-modal-is-open"); window.requestAnimationFrame(() => { modal.classList.add("open"); modal.querySelector(".hobby-modal-close").focus(); }); };
  root.addEventListener("click", (event) => { const trigger = event.target.closest("[data-hobby-index]"); if (trigger) { openHobbyModal(Number(trigger.dataset.hobbyIndex), trigger); return; } if (event.target.closest("[data-hobby-close]")) closeHobbyModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeHobbyModal(); });
})();
