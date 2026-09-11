(function () {
  "use strict";

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const editorRoot = document.createElement("div");
  editorRoot.className = "portfolio-editor";
  editorRoot.innerHTML = `
    <button class="edit-fab" type="button" data-editor-action="open" aria-haspopup="dialog">
      <span aria-hidden="true">✎</span> 사이트 편집
    </button>
    <div class="editor-overlay" data-editor-action="close" hidden></div>
    <aside class="editor-panel" role="dialog" aria-modal="true" aria-labelledby="editor-title" hidden></aside>
    <div class="editor-toast" role="status" aria-live="polite"></div>
    <input class="editor-file-input" type="file" accept=".js,.json,application/json,text/javascript" hidden>
  `;
  document.body.appendChild(editorRoot);

  const panel = editorRoot.querySelector(".editor-panel");
  const overlay = editorRoot.querySelector(".editor-overlay");
  const toast = editorRoot.querySelector(".editor-toast");
  const fileInput = editorRoot.querySelector(".editor-file-input");

  const profileFields = [
    ["name", "이름"],
    ["role", "직무"],
    ["status", "상태 배지"],
    ["monogram", "프로필 영역 문구"]
  ];
  const contactFields = [
    ["email", "이메일"],
    ["phone", "전화번호"],
    ["location", "지역"],
    ["military", "병역"]
  ];

  const inputField = (label, value, attributes, wide = false) => `
    <label class="editor-field${wide ? " wide" : ""}">
      <span>${escapeHTML(label)}</span>
      <input type="text" value="${escapeHTML(value)}" ${attributes}>
    </label>`;

  const itemEditor = (item, groupIndex, itemIndex) => `
    <article class="editor-item">
      <div class="editor-item-head">
        <strong>${String(itemIndex + 1).padStart(2, "0")}</strong>
        <div class="editor-item-actions">
          <button type="button" data-editor-action="move-up" data-group="${groupIndex}" data-item="${itemIndex}" aria-label="위로 이동">↑</button>
          <button type="button" data-editor-action="move-down" data-group="${groupIndex}" data-item="${itemIndex}" aria-label="아래로 이동">↓</button>
          <button class="danger" type="button" data-editor-action="remove-item" data-group="${groupIndex}" data-item="${itemIndex}">삭제</button>
        </div>
      </div>
      ${inputField("제목", item.title, `data-item-field="title" data-group="${groupIndex}" data-item="${itemIndex}"`, true)}
      ${inputField("기간·발급기관·숙련도", item.meta, `data-item-field="meta" data-group="${groupIndex}" data-item="${itemIndex}"`, true)}
      <label class="editor-field wide">
        <span>상세 설명</span>
        <textarea rows="3" data-item-field="description" data-group="${groupIndex}" data-item="${itemIndex}">${escapeHTML(item.description)}</textarea>
      </label>
    </article>`;

  function renderEditor() {
    const resume = window.PORTFOLIO_DATA.resume;
    panel.innerHTML = `
      <header class="editor-header">
        <div><p>PORTFOLIO EDITOR</p><h2 id="editor-title">사이트 편집</h2></div>
        <button class="editor-close" type="button" data-editor-action="close" aria-label="편집 창 닫기">×</button>
      </header>

      <div class="editor-notice">
        <strong>입력 내용은 이 브라우저에 자동 저장됩니다.</strong>
        <p>방문자에게도 보이게 하려면 아래에서 <b>content.js 내보내기</b> 후 GitHub의 같은 파일을 교체해 주세요.</p>
      </div>

      <section class="editor-section">
        <div class="editor-section-title"><span>01</span><div><p>PROFILE</p><h3>기본 이력 정보</h3></div></div>
        <label class="editor-field wide">
          <span>이력서 소개</span>
          <textarea rows="3" data-resume-main="intro">${escapeHTML(resume.intro)}</textarea>
        </label>
        <div class="editor-field-grid">
          ${profileFields.map(([key, label]) => inputField(label, resume[key], `data-resume-main="${key}"`)).join("")}
          ${contactFields.map(([key, label]) => inputField(label, resume.contacts[key], `data-contact="${key}"`)).join("")}
        </div>
      </section>

      ${resume.groups.map((group, groupIndex) => `
        <section class="editor-section editor-resume-group">
          <div class="editor-section-title">
            <span>0${groupIndex + 2}</span>
            <div><p>${escapeHTML(group.eyebrow)}</p><h3>${escapeHTML(group.label)}</h3></div>
            <button class="editor-add" type="button" data-editor-action="add-item" data-group="${groupIndex}">+ 항목 추가</button>
          </div>
          <div class="editor-items">
            ${group.items.length ? group.items.map((item, itemIndex) => itemEditor(item, groupIndex, itemIndex)).join("") : '<p class="editor-empty">아직 항목이 없습니다.</p>'}
          </div>
        </section>`).join("")}

      
      <section class="editor-section"><div class="editor-section-title"><span>05</span><div><p>HOBBIES</p><h3>취미 팝업 6칸</h3></div></div>${window.PORTFOLIO_DATA.hobbies.items.map((hobby,hi)=>`<div class="editor-hobby"><h4>${escapeHTML(hobby.title)}</h4>${Array.from({length:6},(_,di)=>{const d=hobby.details?.[di]||{};return `<div class="editor-field-grid"><label class="editor-field"><span>사진 URL ${String(di+1).padStart(2,"0")}</span><input type="text" value="${escapeHTML(d.image)}" data-hobby-detail-field="image" data-hobby="${hi}" data-detail="${di}"></label><label class="editor-field"><span>제목</span><input type="text" value="${escapeHTML(d.title)}" data-hobby-detail-field="title" data-hobby="${hi}" data-detail="${di}"></label><label class="editor-field wide"><span>내용</span><textarea rows="2" data-hobby-detail-field="description" data-hobby="${hi}" data-detail="${di}">${escapeHTML(d.description)}</textarea></label></div>`}).join("")}</div>`).join("")}</section>
      <footer class="editor-footer">
        <button class="editor-button primary" type="button" data-editor-action="download">content.js 내보내기</button>
        <button class="editor-button" type="button" data-editor-action="import">파일 불러오기</button>
        <a class="editor-button" href="https://github.com/KIMKUMO/Portfolio/edit/main/content.js" target="_blank" rel="noopener">GitHub에서 게시</a>
        <button class="editor-button danger" type="button" data-editor-action="reset">초기화</button>
      </footer>`;
  }

  function saveAndRender(message) {
    try {
      localStorage.setItem(window.PORTFOLIO_STORAGE_KEY, JSON.stringify(window.PORTFOLIO_DATA));
    } catch (error) {
      notify("브라우저 저장 공간에 저장하지 못했습니다.");
      return;
    }
    window.renderPortfolio();
    if (message) notify(message);
  }

  let toastTimer;
  function notify(message) {
    clearTimeout(toastTimer);
    
          if (target.dataset.hobbyDetailField) {
      const hobby = window.PORTFOLIO_DATA.hobbies.items[Number(target.dataset.hobby)];
      hobby.details = hobby.details || Array.from({length: 6}, () => ({image: "", title: "", description: ""}));
      hobby.details[Number(target.dataset.detail)][target.dataset.hobbyDetailField] = target.value;
    }
  <section class="editor-section"><div class="editor-section-title"><span>05</span><div><p>HOBBIES</p><h3>취미 팝업 6칸</h3></div></div>${window.PORTFOLIO_DATA.hobbies.items.map((hobby,hi)=>`<div class="editor-hobby"><h4>${escapeHTML(hobby.title)}</h4>${Array.from({length:6},(_,di)=>{const d=hobby.details?.[di]||{};return `<div class="editor-field-grid"><label class="editor-field"><span>사진 URL ${String(di+1).padStart(2,"0")}</span><input type="text" value="${escapeHTML(d.image)}" data-hobby-detail-field="image" data-hobby="${hi}" data-detail="${di}"></label><label class="editor-field"><span>제목</span><input type="text" value="${escapeHTML(d.title)}" data-hobby-detail-field="title" data-hobby="${hi}" data-detail="${di}"></label><label class="editor-field wide"><span>내용</span><textarea rows="2" data-hobby-detail-field="description" data-hobby="${hi}" data-detail="${di}">${escapeHTML(d.description)}</textarea></label></div>`}).join("")}</div>`).join("")}</section>
      toast.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function openEditor() {
    renderEditor();
    panel.hidden = false;
    overlay.hidden = false;
    document.body.classList.add("editor-is-open");
    requestAnimationFrame(() => {
      panel.classList.add("open");
      overlay.classList.add("open");
      panel.querySelector("input, textarea, button")?.focus();
    });
  }

  function closeEditor() {
    panel.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("editor-is-open");
    setTimeout(() => {
      panel.hidden = true;
      overlay.hidden = true;
      editorRoot.querySelector(".edit-fab").focus();
    }, 220);
  }

  editorRoot.addEventListener("input", (event) => {
    const target = event.target;
    const resume = window.PORTFOLIO_DATA.resume;
    if (target.dataset.resumeMain) resume[target.dataset.resumeMain] = target.value;
    if (target.dataset.contact) resume.contacts[target.dataset.contact] = target.value;
    if (target.dataset.itemField) {
      resume.groups[Number(target.dataset.group)].items[Number(target.dataset.item)][target.dataset.itemField] = target.value;
    }
    if (target.dataset.hobbyDetailField) {
      const hobby = window.PORTFOLIO_DATA.hobbies.items[Number(target.dataset.hobby)];
      hobby.details = hobby.details || Array.from({length: 6}, () => ({image: "", title: "", description: ""}));
      hobby.details[Number(target.dataset.detail)][target.dataset.hobbyDetailField] = target.value;
    }
    saveAndRender();
  });

  editorRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-editor-action]");
    if (!button) return;
    const action = button.dataset.editorAction;
    const groupIndex = Number(button.dataset.group);
    const itemIndex = Number(button.dataset.item);
    const groups = window.PORTFOLIO_DATA.resume.groups;

    if (action === "open") openEditor();
    if (action === "close") closeEditor();
    if (action === "add-item") {
      const group = groups[groupIndex];
      const defaults = {
        career: { title: "새 경력", meta: "참여 기간", description: "담당 업무와 주요 성과를 입력해 주세요." },
        certificate: { title: "새 자격증", meta: "발급 기관 · 취득일", description: "관련 역량을 입력해 주세요." },
        skill: { title: "새 기술", meta: "숙련도 또는 사용 기간", description: "활용 경험과 강점을 입력해 주세요." }
      };
      group.items.push(clone(defaults[group.key] || defaults.skill));
      saveAndRender("항목을 추가했습니다.");
      renderEditor();
      panel.scrollTop = panel.scrollHeight;
    }
    if (action === "remove-item") {
      groups[groupIndex].items.splice(itemIndex, 1);
      saveAndRender("항목을 삭제했습니다.");
      renderEditor();
    }
    if (action === "move-up" && itemIndex > 0) {
      const items = groups[groupIndex].items;
      [items[itemIndex - 1], items[itemIndex]] = [items[itemIndex], items[itemIndex - 1]];
      saveAndRender();
      renderEditor();
    }
    if (action === "move-down" && itemIndex < groups[groupIndex].items.length - 1) {
      const items = groups[groupIndex].items;
      [items[itemIndex + 1], items[itemIndex]] = [items[itemIndex], items[itemIndex + 1]];
      saveAndRender();
      renderEditor();
    }
    if (action === "download") {
      const content = `window.PORTFOLIO_DATA = ${JSON.stringify(window.PORTFOLIO_DATA, null, 2)};\n`;
      const url = URL.createObjectURL(new Blob([content], { type: "text/javascript;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "content.js";
      link.click();
      URL.revokeObjectURL(url);
      notify("content.js를 내려받았습니다.");
    }
    if (action === "import") fileInput.click();
    if (action === "reset" && confirm("이 브라우저에서 수정한 내용을 모두 지우고 공개된 기본 내용으로 되돌릴까요?")) {
      window.PORTFOLIO_DATA = clone(window.DEFAULT_PORTFOLIO_DATA);
      localStorage.removeItem(window.PORTFOLIO_STORAGE_KEY);
      window.renderPortfolio();
      renderEditor();
      notify("기본 내용으로 되돌렸습니다.");
    }
  });

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const jsonText = text.trim().startsWith("{")
        ? text.trim()
        : text.replace(/^.*?window\.PORTFOLIO_DATA\s*=\s*/s, "").replace(/;\s*$/, "");
      const nextData = JSON.parse(jsonText);
      if (!nextData.resume?.groups || !Array.isArray(nextData.resume.groups)) throw new Error("invalid data");
      window.PORTFOLIO_DATA = nextData;
      saveAndRender("파일 내용을 불러왔습니다.");
      renderEditor();
    } catch (error) {
      notify("올바른 content.js 또는 JSON 파일인지 확인해 주세요.");
    } finally {
      fileInput.value = "";
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closeEditor();
  });
})();
