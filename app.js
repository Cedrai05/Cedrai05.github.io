(() => {
  const posts = window.BLOG_POSTS;
  const categories = window.BLOG_CATEGORIES;
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

  const dateText = (date) => date.replaceAll("-", ".");
  const postUrl = (slug) => `?post=${encodeURIComponent(slug)}`;

  function renderFilters() {
    $("#category-filters").innerHTML = ["전체", ...categories].map((category) => `<button type="button" data-category="${escapeHTML(category)}" aria-pressed="${state.category === category}">${escapeHTML(category)}</button>`).join("");
  }

  function renderPosts() {
    const query = state.query.trim().toLocaleLowerCase("ko");
    const matches = posts.filter((post) => (state.category === "전체" || post.category === state.category) && (!query || [post.title, post.summary, post.category, ...post.tags].join(" ").toLocaleLowerCase("ko").includes(query)));
    $("#entry-total").textContent = `${String(posts.length).padStart(2, "0")} ENTRIES`;
    $("#result-label").textContent = state.category === "전체" ? "ALL ENTRIES" : state.category.toUpperCase();
    $("#result-count").textContent = `${String(matches.length).padStart(2, "0")} RESULTS`;
    $("#post-list").innerHTML = matches.map((post, index) => `<a class="post-row" href="${postUrl(post.slug)}" aria-label="${escapeHTML(post.title)} 읽기"><span class="post-number">${String(index + 1).padStart(2, "0")}</span><div class="post-content"><span class="post-category">↳ ${escapeHTML(post.category.toUpperCase())}</span><h3>${escapeHTML(post.title)}</h3><p>${escapeHTML(post.summary)}</p></div><div class="post-meta"><span>${dateText(post.date)}</span><span>${escapeHTML(post.readTime)}</span></div><span class="post-arrow">↗</span></a>`).join("");
    $("#empty-state").hidden = matches.length > 0;
    renderFilters();
  }

  function renderRoute() {
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
    if (!post) {
      document.title = "글을 찾을 수 없습니다 / Cédrai";
      article.innerHTML = `<a class="article-back" href="./">← BACK TO ARCHIVE</a><h1>기록을 찾을 수 없습니다.</h1><p class="article-summary">주소를 확인하거나 아카이브로 돌아가 주세요.</p>`;
      return;
    }
    document.title = `${post.title} / Cédrai`;
    article.innerHTML = `<a class="article-back" href="./#archive">← BACK TO ARCHIVE</a><div class="article-category">↳ ${escapeHTML(post.category.toUpperCase())}</div><h1>${escapeHTML(post.title)}</h1><p class="article-summary">${escapeHTML(post.summary)}</p><div class="article-meta"><span>${dateText(post.date)}</span><span>${escapeHTML(post.readTime)}</span><span>${escapeHTML(post.tags.join(" · "))}</span></div><div class="article-body">${post.content}</div><div class="article-footer"><a href="./#archive">← ALL ENTRIES</a><a href="https://www.cedrai.info/" target="_blank" rel="noopener noreferrer">PORTFOLIO ↗</a></div>`;
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
  renderPosts();
  renderRoute();
})();
