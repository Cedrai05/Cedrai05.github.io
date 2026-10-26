# Cédrai / Field Notes

[Cédrai 포트폴리오](https://www.cedrai.info/)의 디자인을 이어받은 GitHub Pages용 정적 기술 블로그입니다. 개발, CTF/Wargame, BugbBounty, 블로그/기술문서, 논문/컨퍼런스, 공모전/자격증의 여섯 카테고리로 구성했습니다.

## GitHub Pages란?

GitHub Pages는 저장소의 정적 파일을 웹사이트로 공개하는 GitHub의 호스팅 기능입니다. `사용자명.github.io` 저장소를 만들면 `https://사용자명.github.io/` 주소를 사용할 수 있습니다. 다른 저장소 이름을 쓰면 주소에 저장소 이름이 추가됩니다. 정적 HTML, CSS, JavaScript 블로그에는 별도 서버가 필요 없습니다.

공식 문서: [Quickstart](https://docs.github.com/en/pages/quickstart), [배포 소스 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [사용자 정의 도메인](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## 배포

1. GitHub 계정 `rinhye05`에서 공개 저장소 `rinhye05.github.io`를 만듭니다.
2. 이 폴더의 파일을 저장소 루트에 올리고 `main` 브랜치에 반영합니다.
3. 저장소 **Settings → Pages → Build and deployment**에서 **Deploy from a branch**, `main`, `/(root)`를 선택합니다.
4. 배포가 끝나면 `https://rinhye05.github.io/`에서 확인합니다.

별도 빌드 단계나 패키지 설치가 필요하지 않습니다. 프로젝트 저장소로 배포해도 상대 경로를 사용하므로 정상 동작합니다.

## 새 글 추가

`posts.js`의 `BLOG_POSTS` 배열에 객체를 추가합니다. `slug`는 글 주소의 `?post=` 값으로 쓰이므로 영문 소문자와 하이픈을 권장합니다. `category`는 `BLOG_CATEGORIES`의 여섯 값 중 하나여야 합니다. 본문은 `content`에 HTML 문자열로 작성할 수 있습니다. 이 파일은 저장소 관리자가 직접 편집하는 신뢰된 콘텐츠만 넣어야 합니다.

```js
{
  slug: "my-new-note",
  title: "새 기록 제목",
  category: "개발",
  date: "2026-10-26",
  readTime: "3 MIN READ",
  summary: "목록에 표시할 한 줄 소개",
  tags: ["JavaScript"],
  content: `<p>본문 첫 문단입니다.</p>`
}
```

## 포트폴리오 연결

블로그의 상단, 프로필, 하단에는 포트폴리오와 프로젝트 페이지 링크가 있습니다. 포트폴리오의 기존 **BLOG** 메뉴를 새 블로그로 연결하려면 포트폴리오 저장소 `rinhye05/cedrai-portfolio`의 해당 메뉴 주소를 배포된 GitHub Pages 주소로 바꾸면 됩니다. `cedrai.info` 도메인은 기존 포트폴리오에 연결되어 있으므로 블로그에 같은 도메인을 설정하지 마세요. 블로그 전용 `blog.cedrai.info`를 쓰려면 별도 DNS 설정과 Pages의 사용자 정의 도메인 설정이 필요합니다.
