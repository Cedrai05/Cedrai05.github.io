// 티스토리 글 목록은 포트폴리오의 /api/blog-feed에서 실시간으로 읽습니다.
window.BLOG_CATEGORIES = ["개발", "CTF/Wargame", "Bug Bounty", "블로그/기술문서", "논문/컨퍼런스", "공모전/자격증"];
window.BLOG_TOPIC_GROUPS = {
  "CTF/Wargame": ["BTLO", "CTF", "Dreamhack"],
  "블로그/기술문서": ["Forensic", "Linux", "Reversing", "Web-hacking", "seKUrity"],
  "논문/컨퍼런스": ["Forensic", "Linux", "Reversing", "Web-hacking"],
};
// 원본 카테고리에 분야가 없거나 미분류 상태인 글만 직접 지정합니다.
window.BLOG_POST_OVERRIDES = {
  "tistory-28": { topic: "Forensic" }, // 디지털 포렌식 현황과 대응 방안 정리
  "tistory-43": { category: "CTF/Wargame", topic: "Dreamhack" }, // Track_the_file
};
window.BLOG_POSTS = [];
