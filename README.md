# Cédrai / Field Notes

[Cédrai 포트폴리오](https://www.cedrai.info/)의 디자인을 이어받은 GitHub Pages용 기술 블로그입니다. 개발, CTF/Wargame, BugbBounty, 블로그/기술문서, 논문/컨퍼런스, 공모전/자격증의 여섯 카테고리로 구성했습니다. 글은 티스토리에서 읽어오므로 새 글을 올려도 GitHub 저장소를 다시 수정할 필요가 없습니다.

## GitHub Pages란?

GitHub Pages는 저장소의 정적 파일을 웹사이트로 공개하는 GitHub의 호스팅 기능입니다. `사용자명.github.io` 저장소를 만들면 `https://사용자명.github.io/` 주소를 사용할 수 있습니다. 다른 저장소 이름을 쓰면 주소에 저장소 이름이 추가됩니다. 정적 HTML, CSS, JavaScript 블로그에는 별도 서버가 필요 없습니다.

공식 문서: [Quickstart](https://docs.github.com/en/pages/quickstart), [배포 소스 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [사용자 정의 도메인](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## 배포

1. GitHub 계정 `rinhye05`에서 공개 저장소 `rinhye05.github.io`를 만듭니다.
2. 이 폴더의 파일을 저장소 루트에 올리고 `main` 브랜치에 반영합니다.
3. 저장소 **Settings → Pages → Build and deployment**에서 **Deploy from a branch**, `main`, `/(root)`를 선택합니다.
4. 배포가 끝나면 `https://rinhye05.github.io/`에서 확인합니다.

별도 빌드 단계나 패키지 설치가 필요하지 않습니다. 프로젝트 저장소로 배포해도 상대 경로를 사용하므로 정상 동작합니다.

## 티스토리 연동

글 목록은 포트폴리오의 [`/api/blog-feed`](https://www.cedrai.info/api/blog-feed)에서 매번 새로 읽습니다. 페이지를 다시 열거나 활성화하면 갱신하며, 열어둔 페이지는 1분마다 갱신합니다. 티스토리의 분류를 블로그의 여섯 카테고리로 변환하는 코드는 포트폴리오 저장소의 `app/api/blog-feed/route.ts`에 있습니다. 새 카테고리를 추가하면 이 매핑도 검토하세요.

드림핵·CTF 문제 풀이는 **CTF/Wargame**, 개념·도구·강의 실습·리눅스·전공 공부 기록은 **블로그/기술문서**로 분류합니다. 취약점 이름만으로 버그바운티 활동으로 분류하거나, 프로그래밍·리눅스 주제만으로 개발 활동으로 분류하지 않습니다. 개발과 BugbBounty는 해당 활동이 제목이나 원본 카테고리에 명확하게 표시된 글에만 적용하며, 판단이 불분명한 글은 블로그/기술문서로 둡니다.

공개글은 [`/api/blog-post`](https://www.cedrai.info/api/blog-post?id=113)를 통해 본문을 불러와 블로그 안에 표시합니다. 이미지는 원문을 읽을 때마다 티스토리의 현재 주소를 사용합니다. 보호글은 **제목과 날짜만** 목록에 표시하고 클릭하면 티스토리 원문으로 이동합니다. 보호글 본문과 비밀번호는 이 저장소에 넣지 않습니다.

이 연동은 포트폴리오의 Vercel 서버가 동작해야 합니다. 티스토리 화면 구조가 바뀌면 두 API의 글 추출 코드를 수정해야 할 수 있습니다.

## 포트폴리오 연결

블로그의 상단, 프로필, 하단에는 포트폴리오와 프로젝트 페이지 링크가 있습니다. 포트폴리오 저장소 `rinhye05/cedrai-portfolio`의 **BLOG** 메뉴와 `/blog` 주소도 `https://rinhye05.github.io/`로 연결했습니다. `cedrai.info` 도메인은 기존 포트폴리오에 연결되어 있으므로 블로그에 같은 도메인을 설정하지 마세요. 블로그 전용 `blog.cedrai.info`를 쓰려면 별도 DNS 설정과 Pages의 사용자 정의 도메인 설정이 필요합니다.
