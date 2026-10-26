(() => {
  let posts = window.BLOG_POSTS;
  const categories = window.BLOG_CATEGORIES;
  const FEED_URL = "https://www.cedrai.info/api/blog-feed";
  const ARTICLE_URL = "https://www.cedrai.info/api/blog-post";
  const $ = (selector) => document.querySelector(selector);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const state = { category: "전체", query: "" };

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cedrai-blog-theme", theme);
    $("#theme-toggle").textContent = theme === "dark" ? "☀" : "☾";
    $("#theme-toggle").setAttribute("aria-label", theme === "dark" ? "라이트 테마로 전환" : "다크 테마로 전환");
  }
  setTheme(localStorage.getItem("cedrai-blog-theme") || "dark");
  $("#theme-toggle").addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

  const aboutModal = $("#about-modal");
  let aboutTrigger = null;
  function openAbout(event) {
    aboutTrigger = event.currentTarget;
    aboutModal.hidden = false;
    document.body.classList.add("modal-open");
    $(".about-modal__close").focus();
  }
  function closeAbout() {
    aboutModal.hidden = true;
    document.body.classList.remove("modal-open");
    aboutTrigger?.focus();
  }
  $("#about-open").addEventListener("click", openAbout);
  $("#mobile-about").addEventListener("click", openAbout);
  aboutModal.addEventListener("click", (event) => { if (event.target.closest("[data-about-close]")) closeAbout(); });
  aboutModal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAbout();
    if (event.key === "Tab") {
      event.preventDefault();
      $(".about-modal__close").focus();
    }
  });

  const dateText = (date) => (date || "").replaceAll("-", ".");
  const postUrl = (slug) => `?post=${encodeURIComponent(slug)}`;

  function renderFilters() {
    $("#category-filters").innerHTML = ["전체", ...categories].map((category) => `<button type="button" data-category="${escapeHTML(category)}" aria-pressed="${state.category === category}">${escapeHTML(category)}</button>`).join("");
  }

  function renderPosts() {
    const query = state.query.trim().toLocaleLowerCase("ko");
    const matches = posts.filter((post) => (state.category === "전체" || post.category === state.category) && (!query || [post.title, post.summary, post.category, ...(post.tags || [])].join(" ").toLocaleLowerCase("ko").includes(query)));
    $("#entry-total").textContent = `${String(posts.length).padStart(2, "0")} ENTRIES`;
    $("#result-label").textContent = state.category === "전체" ? "ALL ENTRIES" : state.category.toUpperCase();
    $("#result-count").textContent = `${String(matches.length).padStart(2, "0")} RESULTS`;
    $("#post-list").innerHTML = matches.map((post, index) => {
      const href = post.protected ? post.sourceUrl : postUrl(post.slug);
      const external = post.protected ? ' target="_blank" rel="noopener noreferrer"' : "";
      const label = post.protected ? "보호글 · 티스토리에서 열기" : "읽기";
      return `<a class="post-row" href="${escapeHTML(href)}"${external} aria-label="${escapeHTML(post.title)} ${label}"><span class="post-number">${String(index + 1).padStart(2, "0")}</span><div class="post-content"><span class="post-category">↳ ${escapeHTML(post.category.toUpperCase())}${post.protected ? ' <span class="protected-mark">/ PROTECTED</span>' : ""}</span><h3>${escapeHTML(post.title)}</h3>${post.summary ? `<p>${escapeHTML(post.summary)}</p>` : ""}</div><div class="post-meta"><span>${dateText(post.date)}</span><span>${escapeHTML(post.readTime)}</span></div><span class="post-arrow">${post.protected ? "🔒" : "↗"}</span></a>`;
    }).join("");
    $("#empty-state").hidden = matches.length > 0;
    renderFilters();
  }

  async function renderRoute() {
    const slug = new URLSearchParams(location.search).get("post");
    const post = posts.find((item) => item.slug === slug);
    const home = $("#home-view");
    const article = $("#article-view");
    if (!slug) {
      home.hidden = false;
      article.hidden = true;
      document.title = "Cédrai / Field Notes";
      return;
    }
    home.hidden = true;
    article.hidden = false;
    if (!post && !posts.length) {
      article.innerHTML = '<p class="loading-state">TISTORY ARCHIVE SYNCING...</p>';
      return;
    }
    if (!post) {
      document.title = "글을 찾을 수 없습니다 / Cédrai";
      article.innerHTML = `<a class="article-back" href="./">← BACK TO ARCHIVE</a><h1>기록을 찾을 수 없습니다.</h1><p class="article-summary">주소를 확인하거나 아카이브로 돌아가 주세요.</p>`;
      return;
    }
    document.title = `${post.title} / Cédrai`;
    const intro = `<a class="article-back" href="./#archive">← BACK TO ARCHIVE</a><div class="article-category">↳ ${escapeHTML(post.category.toUpperCase())}</div><h1>${escapeHTML(post.title)}</h1><div class="article-meta"><span>${dateText(post.date)}</span><span>${escapeHTML(post.readTime)}</span></div>`;
    if (post.protected) {
      article.innerHTML = `${intro}<p class="article-summary">이 글은 티스토리 보호글입니다.</p><div class="article-footer"><a href="./#archive">← ALL ENTRIES</a><a href="${escapeHTML(post.sourceUrl)}" target="_blank" rel="noopener noreferrer">티스토리 원문 열기 ↗</a></div>`;
      return;
    }
    article.innerHTML = `${intro}<p class="loading-state">TISTORY ARTICLE LOADING...</p>`;
    try {
      const id = post.slug.replace(/^tistory-/, "");
      const response = await fetch(`${ARTICLE_URL}?id=${encodeURIComponent(id)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.content) throw new Error(data.error || "본문을 읽을 수 없습니다.");
      article.innerHTML = `${intro}<div class="article-body">${data.content}</div><div class="article-footer"><a href="./#archive">← ALL ENTRIES</a><a href="${escapeHTML(post.sourceUrl)}" target="_blank" rel="noopener noreferrer">티스토리 원문 ↗</a></div>`;
    } catch (error) {
      article.innerHTML = `${intro}<p class="article-summary">본문을 불러오지 못했습니다. 티스토리 원문에서 확인할 수 있습니다.</p><div class="article-footer"><a href="./#archive">← ALL ENTRIES</a><a href="${escapeHTML(post.sourceUrl)}" target="_blank" rel="noopener noreferrer">티스토리 원문 ↗</a></div>`;
    }
  }

  async function loadFeed() {
    if (!posts.length && !new URLSearchParams(location.search).has("post")) {
      $("#post-list").innerHTML = '<div class="loading-state">TISTORY ARCHIVE SYNCING...</div>';
      $("#empty-state").hidden = true;
    }
    try {
      const response = await fetch(FEED_URL, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.posts)) throw new Error(data.error || "목록을 읽을 수 없습니다.");
      posts = data.posts;
      renderPosts();
      if (new URLSearchParams(location.search).has("post") && !$("#article-view .article-body")) renderRoute();
    } catch (error) {
      if (!posts.length) {
        $("#post-list").innerHTML = '<div class="loading-state">티스토리 글을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.</div>';
        $("#result-count").textContent = "SYNC ERROR";
      }
    }
  }

  $("#category-filters").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderPosts();
  });
  $("#search-input").addEventListener("input", (event) => { state.query = event.target.value; renderPosts(); });
  $("#reset-filters").addEventListener("click", () => { state.category = "전체"; state.query = ""; $("#search-input").value = ""; renderPosts(); $("#search-input").focus(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && !new URLSearchParams(location.search).has("post")) { event.preventDefault(); $("#search-input").focus(); }
    if (event.key === "Escape" && document.activeElement === $("#search-input")) { $("#search-input").blur(); }
  });
  renderRoute();
  renderFilters();
  loadFeed();
  window.addEventListener("focus", () => { if (!document.hidden) loadFeed(); });
  window.setInterval(() => { if (!document.hidden) loadFeed(); }, 60000);
})();
