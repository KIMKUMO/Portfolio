(function () {
  "use strict";

  const root = document.getElementById("app");
  const storageKey = "steadyPlannerPortfolioDataV2";
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
    email: "EMAIL",
    phone: "PHONE",
    location: "LOCATION",
    military: "MILITARY"
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

  root.innerHTML = `
    <main id="main">
      <header class="site-header">
        <a class="brand" href="#main" aria-label="메인으로 이동">
          <span class="brand-mark" aria-hidden="true">T</span>
          <span>${escapeHTML(data.site.brand)}</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#main">메인</a>
          <a href="#resume">이력서</a>
          <a href="#experience">프로젝트 경험</a>
          <a href="#portfolio">포트폴리오</a>
          <a href="#hobby">취미</a>
        </nav>
        <a class="header-cta" href="#portfolio">작업 보기</a>
      </header>

      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-backdrop" aria-hidden="true"></div>
        <div class="hero-content">
          <p class="eyebrow">${escapeHTML(data.hero.eyebrow)}</p>
          <h1 id="hero-title">${escapeHTML(data.hero.firstLine)}<br><span>${escapeHTML(data.hero.highlight)}</span> ${escapeHTML(data.hero.lastWord)}</h1>
          <p class="hero-copy">${escapeHTML(data.hero.description)}</p>
          <div class="hero-actions">
            <a class="button primary" href="#story">소개 읽기 <b aria-hidden="true">↘</b></a>
            <a class="button ghost" href="#resume">이력서 보기</a>
          </div>
        </div>
        <a class="scroll-cue" href="#story" aria-label="소개로 스크롤"><span>SCROLL</span><i aria-hidden="true"></i></a>
      </section>

      <section id="story" class="story section-shell" aria-labelledby="story-title">
        <div class="story-heading">
          <p class="eyebrow">${escapeHTML(data.story.eyebrow)}</p>
          <h2 id="story-title">${lines(data.story.titleLines)}</h2>
        </div>
        <div class="story-copy">
          <span class="quote-mark" aria-hidden="true">“</span>
          ${data.story.paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
          <div class="story-line"><i></i><span>STEADY PROGRESS</span></div>
        </div>
      </section>

      <section id="resume" class="section-shell section-block" aria-labelledby="resume-title">
        <header class="section-header">
          <div><p class="eyebrow">01 · RESUME</p><h2 id="resume-title">이력서</h2></div>
          <p>${escapeHTML(data.resume.intro)}</p>
        </header>
        <div class="resume-layout">
          <article class="resume-profile glow-card">
            <span class="status-badge success">${escapeHTML(data.resume.status)}</span>
            <div class="profile-monogram" aria-hidden="true">${escapeHTML(data.resume.monogram)}</div>
            <div><h3>${escapeHTML(data.resume.name)}</h3><p>${escapeHTML(data.resume.role)}</p></div>
            <dl>
              ${Object.entries(data.resume.contacts).map(([key, value]) => `
                <div><dt>${escapeHTML(contactLabels[key] || key.toUpperCase())}</dt><dd>${escapeHTML(value)}</dd></div>`).join("")}
            </dl>
          </article>
          <div class="resume-groups">
            ${data.resume.groups.map((group) => `
              <section class="resume-category" aria-labelledby="resume-${escapeHTML(group.key)}">
                <header><p class="mini-label">${escapeHTML(group.eyebrow)}</p><h3 id="resume-${escapeHTML(group.key)}">${escapeHTML(group.label)}</h3><span>${String(group.items.length).padStart(2, "0")}</span></header>
                <div class="resume-list">
                  ${group.items.map((item, index) => `
                    <article class="resume-row">
                      <span class="row-index">${pad(index)}</span>
                      <div><p class="resume-meta">${escapeHTML(item.meta)}</p><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.description)}</p></div>
                    </article>`).join("")}
                </div>
              </section>`).join("")}
          </div>
        </div>
      </section>

      <section id="experience" class="section-shell section-block" aria-labelledby="experience-title">
        <header class="section-header">
          <div><p class="eyebrow">02 · PROJECT EXPERIENCE</p><h2 id="experience-title">프로젝트 경험</h2></div>
          <p>${escapeHTML(data.projects.intro)}</p>
        </header>
        <div class="project-grid">
          ${data.projects.items.map((item, index) => `
            <button type="button" class="project-card glow-card" data-project-index="${index}" aria-haspopup="dialog" aria-label="${escapeHTML(item.title)} 상세 설명 보기">
              <div class="card-top"><span class="status-badge ${escapeHTML(item.tone)}">${escapeHTML(item.badge)}</span><span>${pad(index)} / ${String(data.projects.items.length).padStart(2, "0")}</span></div>
              <div class="project-title"><p>${escapeHTML(item.role)}</p><h3>${escapeHTML(item.title)}</h3></div>
              <p>${escapeHTML(item.description)}</p>
              <div class="project-result"><span>KEY EXPERIENCE</span><p>${escapeHTML(item.keyExperience || item.CoreExperience)}</p></div>
              <span class="project-card-cue">상세 보기 <b aria-hidden="true">↗</b></span>
            </button>`).join("")}
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
            <article class="hobby-feature glow-card">
              <span class="hobby-number">${pad(index)}</span>
              <div><p class="mini-label">${escapeHTML(item.label)}</p><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p></div>
            </article>`).join("")}
        </div>
        <div class="game-tags" aria-label="좋아하는 게임 장르">
          ${data.hobbies.tags.map((tag, index) => `<span class="status-badge ${["success", "info", "violet", "pink"][index % 4]}">${escapeHTML(tag)}</span>`).join("")}
        </div>
      </section>

      <footer class="site-footer section-shell">
        <div><p class="eyebrow">${escapeHTML(data.footer.eyebrow)}</p><h2>${escapeHTML(data.footer.titleLines[0])}<br><span>${escapeHTML(data.footer.titleLines[1])}</span></h2></div>
        <a class="button primary" href="#main">처음으로 <b aria-hidden="true">↑</b></a>
        <p class="copyright">${escapeHTML(data.site.copyright)}</p>
      </footer>
      <div class="project-modal" data-project-modal hidden></div>
    </main>`;

  const hero = document.querySelector(".hero-backdrop");
  if (hero && data.site.heroImage) hero.style.backgroundImage = `url("${data.site.heroImage}")`;

  document.querySelectorAll("[data-portfolio-image]").forEach((element) => {
    const item = data.portfolio.items[Number(element.dataset.portfolioImage)];
    if (item && item.image) element.style.backgroundImage = `linear-gradient(rgba(0,0,0,.24),rgba(0,0,0,.58)),url("${item.image}")`;
  });

  };

  window.PORTFOLIO_STORAGE_KEY = storageKey;
  window.renderPortfolio = renderPortfolio;
  renderPortfolio();

  let lastProjectTrigger = null;

  const closeProjectModal = () => {
    const modal = root.querySelector("[data-project-modal]");
    if (!modal || modal.hidden) return;
    modal.classList.remove("open");
    document.body.classList.remove("project-modal-is-open");
    window.setTimeout(() => {
      modal.hidden = true;
      modal.innerHTML = "";
      if (lastProjectTrigger && lastProjectTrigger.isConnected) lastProjectTrigger.focus();
    }, 180);
  };

  const openProjectModal = (index, trigger) => {
    const item = window.PORTFOLIO_DATA.projects.items[index];
    const modal = root.querySelector("[data-project-modal]");
    if (!item || !modal) return;
    const details = item.details || {};
    const tasks = Array.isArray(details.tasks) && details.tasks.length
      ? details.tasks
      : ["프로젝트에서 담당한 업무와 진행 과정을 입력해 주세요."];

    lastProjectTrigger = trigger;
    modal.innerHTML = `
      <div class="project-modal-backdrop" data-project-close></div>
      <article class="project-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
        <button type="button" class="project-modal-close" data-project-close aria-label="팝업 닫기">×</button>
        <div class="project-modal-heading">
          <span class="status-badge ${escapeHTML(item.tone)}">${escapeHTML(item.badge)}</span>
          <p>${escapeHTML(item.role)}</p>
          <h3 id="project-modal-title">${escapeHTML(item.title)}</h3>
        </div>
        <div class="project-modal-content">
          <section><span>PROJECT OVERVIEW</span><p>${escapeHTML(details.overview || item.description)}</p></section>
          <section><span>WHAT I DID</span><ul>${tasks.map((task) => `<li>${escapeHTML(task)}</li>`).join("")}</ul></section>
          <section><span>RESULT</span><p>${escapeHTML(details.result || item.keyExperience || item.CoreExperience)}</p></section>
          <section><span>WHAT I LEARNED</span><p>${escapeHTML(details.lesson || item.keyExperience || item.CoreExperience)}</p></section>
        </div>
      </article>`;
    modal.hidden = false;
    document.body.classList.add("project-modal-is-open");
    window.requestAnimationFrame(() => {
      modal.classList.add("open");
      modal.querySelector(".project-modal-close").focus();
    });
  };

  root.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project-index]");
    if (trigger) {
      openProjectModal(Number(trigger.dataset.projectIndex), trigger);
      return;
    }
    if (event.target.closest("[data-project-close]")) closeProjectModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProjectModal();
  });
})();
