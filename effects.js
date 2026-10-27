(() => {
  const menuButton = document.querySelector("#menu-toggle");
  const navigation = document.querySelector("#header-navigation");
  function closeMenu() {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "메뉴 열기");
    menuButton.textContent = "☰";
  }
  menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    menuButton.textContent = open ? "✕" : "☰";
  });
  navigation.addEventListener("click", (event) => { if (event.target.closest("a, button")) closeMenu(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener("click", (event) => { if (!event.target.closest(".site-header")) closeMenu(); });

  const output = document.querySelector("#hero-typed");
  const phrases = ["Computer Engineering", "CTF", "Forensic", "Web Hacking", "Reversing", "Security", "Python"];
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timer = null;
  let phraseIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  function stopTyping() {
    clearTimeout(timer);
    timer = null;
  }
  function tick() {
    timer = null;
    if (document.hidden || document.querySelector("#home-view").hidden || motion.matches) return;
    const phrase = phrases[phraseIndex];
    characterIndex += deleting ? -1 : 1;
    output.textContent = phrase.slice(0, characterIndex);
    let delay = deleting ? 55 : 100;
    if (!deleting && characterIndex === phrase.length) {
      deleting = true;
      delay = 2200;
    } else if (deleting && characterIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }
    timer = setTimeout(tick, delay);
  }
  function startTyping() {
    stopTyping();
    if (motion.matches) {
      output.textContent = phrases[0];
      return;
    }
    if (document.hidden || document.querySelector("#home-view").hidden) return;
    output.textContent = phrases[phraseIndex].slice(0, characterIndex);
    timer = setTimeout(tick, 600);
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopTyping(); else startTyping(); });
  motion.addEventListener("change", startTyping);
  window.addEventListener("pagehide", stopTyping);
  window.addEventListener("pageshow", startTyping);
  startTyping();
})();
