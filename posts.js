// 이 배열에 새 글을 추가하면 목록, 검색, 카테고리와 상세 화면에 자동 반영됩니다.
window.BLOG_CATEGORIES = ["개발", "CTF/Wargame", "BugbBounty", "블로그/기술문서", "논문/컨퍼런스", "공모전/자격증"];

window.BLOG_POSTS = [
  {
    slug: "github-pages-first-blog",
    title: "GitHub Pages로 기술 블로그 시작하기",
    category: "블로그/기술문서",
    date: "2026-10-26",
    readTime: "5 MIN READ",
    summary: "저장소 생성부터 배포까지, 정적 블로그를 공개하는 데 필요한 흐름을 정리했습니다.",
    tags: ["GitHub Pages", "블로그", "배포"],
    content: `
      <p>GitHub Pages는 GitHub 저장소의 정적 파일을 웹사이트로 공개하는 서비스입니다. 개인 블로그처럼 글을 읽고 탐색하는 사이트에 잘 맞습니다. 이 블로그도 별도 서버 없이 HTML, CSS, JavaScript로 구성했습니다.</p>
      <h2>1. 저장소 이름 정하기</h2>
      <p>개인 사이트 주소를 <code>https://사용자명.github.io/</code>로 사용하려면 저장소 이름을 <code>사용자명.github.io</code>로 만듭니다. 다른 이름의 저장소를 사용하면 주소 끝에 저장소 이름이 붙습니다. 예를 들어 <code>blog</code> 저장소는 <code>https://사용자명.github.io/blog/</code>가 됩니다.</p>
      <h2>2. 파일 올리기</h2>
      <p>저장소의 배포 대상 폴더에 <code>index.html</code>을 두고 스타일과 스크립트 파일을 함께 올립니다. 프로젝트 사이트의 하위 경로에서도 동작하도록 내부 파일 경로는 <code>./styles.css</code>처럼 상대 경로로 쓰는 편이 안전합니다.</p>
      <h2>3. Pages 켜기</h2>
      <ol><li>저장소의 <strong>Settings → Pages</strong>를 엽니다.</li><li><strong>Build and deployment</strong>에서 <strong>Deploy from a branch</strong>를 선택합니다.</li><li>배포 브랜치를 <code>main</code>, 폴더를 <code>/(root)</code>로 지정하고 저장합니다.</li><li>배포가 완료되면 Pages 화면에 표시된 주소로 접속합니다.</li></ol>
      <blockquote><p>정적 파일을 그대로 공개하는 사이트라면 빌드 도구 없이도 시작할 수 있습니다. 빌드가 필요한 프레임워크를 쓰게 되면 GitHub Actions 배포로 확장하면 됩니다.</p></blockquote>
      <h2>4. 글 추가하기</h2>
      <p>이 블로그에서는 <code>posts.js</code>의 <code>BLOG_POSTS</code> 배열에 새 글 객체를 추가합니다. <code>slug</code>, 제목, 카테고리, 날짜, 요약과 본문을 입력하면 검색과 목록에 자동으로 표시됩니다. 카테고리는 미리 정의한 여섯 가지 중 하나를 선택합니다.</p>
      <h2>참고 자료</h2>
      <p><a href="https://docs.github.com/en/pages/quickstart" target="_blank" rel="noopener noreferrer">GitHub Pages Quickstart ↗</a> · <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site" target="_blank" rel="noopener noreferrer">배포 소스 설정 가이드 ↗</a></p>`
  },
  {
    slug: "ctf-writeup-checklist",
    title: "CTF 풀이를 다시 읽을 수 있는 기록으로 남기기",
    category: "CTF/Wargame",
    date: "2026-10-25",
    readTime: "4 MIN READ",
    summary: "정답만 적는 대신, 관찰과 가설, 검증 과정을 남기기 위한 풀이 노트 구조입니다.",
    tags: ["CTF", "Write-up", "학습법"],
    content: `
      <p>CTF 문제를 풀고 나면 플래그보다 풀이 과정이 오래 남습니다. 며칠 뒤 같은 유형을 다시 만났을 때 필요한 것은 어떤 도구를 실행했는지뿐 아니라 <strong>왜 그 도구를 선택했는지</strong>입니다.</p>
      <h2>풀이 노트의 다섯 칸</h2>
      <ol><li><strong>문제 환경</strong> — 문제 유형, 제공 파일, 원격 접속 정보의 형식, 제한 조건을 적습니다. 비밀 키나 실제 플래그는 공개 범위를 확인한 뒤 처리합니다.</li><li><strong>첫 관찰</strong> — 파일 형식, 페이지 동작, 오류 메시지, 눈에 띄는 문자열을 원본 그대로 남깁니다.</li><li><strong>가설</strong> — 무엇이 취약하거나 숨겨져 있다고 생각했는지와 그 근거를 씁니다.</li><li><strong>검증</strong> — 사용한 명령과 결과를 함께 적습니다. 실패한 시도도 방향 전환의 이유가 된다면 남깁니다.</li><li><strong>회고</strong> — 핵심 개념 한 줄, 다음에 먼저 확인할 지점, 참고 문서를 정리합니다.</li></ol>
      <h2>재현성을 높이는 작은 습관</h2>
      <p>스크린샷만 붙이기보다 실행 명령과 예상 출력을 텍스트로 적습니다. 문제 파일의 이름과 해시를 기록하면 나중에 다른 버전과 구분하기 쉽습니다. 풀이를 공개할 때는 대회 규칙과 공개 시점을 먼저 확인합니다.</p>
      <blockquote><p>좋은 Write-up은 성공한 경로만 보여주는 답안보다, 처음 보는 사람이 같은 판단을 따라갈 수 있는 지도에 가깝습니다.</p></blockquote>`
  },
  {
    slug: "small-project-development-loop",
    title: "작은 프로젝트를 끝까지 만드는 개발 루틴",
    category: "개발",
    date: "2026-10-24",
    readTime: "4 MIN READ",
    summary: "기능을 쪼개고 검증 가능한 단위로 만드는 간단한 개발 흐름을 정리했습니다.",
    tags: ["개발", "프로젝트", "Git"],
    content: `
      <p>새 프로젝트를 시작할 때 기능 목록을 길게 만드는 것보다 <strong>첫 번째로 동작하는 화면</strong>을 빠르게 만드는 편이 진행 상황을 확인하기 쉽습니다.</p>
      <h2>작동하는 가장 작은 흐름</h2>
      <p>사용자가 무엇을 입력하고, 시스템이 어떻게 반응하며, 결과를 어디서 확인하는지 한 문장으로 적습니다. 이 흐름을 구현하는 데 꼭 필요한 데이터와 화면만 먼저 만듭니다.</p>
      <h2>한 번에 하나씩 검증하기</h2>
      <ul><li>기능을 추가하기 전에 완료 조건을 한두 개 적습니다.</li><li>변경 후 실제 사용자 흐름을 처음부터 끝까지 실행합니다.</li><li>오류 메시지와 빈 상태도 정상 흐름만큼 꼼꼼히 확인합니다.</li><li>커밋 메시지는 결과가 드러나도록 씁니다.</li></ul>
      <h2>공개하기 전 확인</h2>
      <p>모바일 화면, 키보드 조작, 링크의 목적지, 콘솔 오류를 점검합니다. README에는 실행 방법과 배포 방법을 남겨 다음에 돌아왔을 때도 바로 이어서 작업할 수 있게 합니다.</p>`
  },
  {
    slug: "responsible-bug-bounty-notes",
    title: "Bug Bounty 학습 노트: 범위부터 기록하기",
    category: "BugbBounty",
    date: "2026-10-23",
    readTime: "4 MIN READ",
    summary: "버그 바운티를 공부할 때 프로그램 범위, 재현 단계, 영향도를 어떻게 정리할지 살펴봅니다.",
    tags: ["Bug Bounty", "웹 보안", "보고서"],
    content: `
      <p>버그 바운티 프로그램은 각자 허용하는 테스트 범위와 규칙이 다릅니다. 시작 전에는 대상 도메인, 제외 기능, 금지된 테스트 방식, 보고 경로를 읽고 기록합니다.</p>
      <h2>범위 확인</h2>
      <p>테스트 가능한 자산과 계정, 시간대나 요청량 제한이 있는지 확인합니다. 공개 페이지라고 해서 모든 시스템이 테스트 범위에 포함되는 것은 아닙니다.</p>
      <h2>재현 가능한 보고</h2>
      <ol><li>문제가 발생하는 환경과 전제 조건을 적습니다.</li><li>최소한의 재현 단계와 관찰된 결과를 구분합니다.</li><li>예상되는 정상 동작과 실제 동작의 차이를 설명합니다.</li><li>영향을 받은 데이터의 실제 내용 대신 필요한 최소 증거만 남깁니다.</li></ol>
      <p>좋은 보고서는 기술적 현상과 실제 영향도를 연결합니다. 검증하지 못한 영향은 추측이라고 표시하고, 프로그램에서 정한 공식 채널로 전달합니다.</p>`
  },
  {
    slug: "reading-security-papers",
    title: "보안 논문을 읽을 때 살펴볼 질문들",
    category: "논문/컨퍼런스",
    date: "2026-10-22",
    readTime: "4 MIN READ",
    summary: "초록부터 실험 결과까지, 논문의 주장과 근거를 분리해 읽는 체크리스트입니다.",
    tags: ["논문", "리서치", "보안"],
    content: `
      <p>논문을 처음부터 끝까지 한 번에 읽으려 하면 핵심 질문을 놓치기 쉽습니다. 먼저 연구가 풀려는 문제와 무엇을 새롭게 제안하는지 찾습니다.</p>
      <h2>첫 번째 읽기: 큰 그림</h2>
      <p>제목, 초록, 서론, 그림, 결론을 훑으며 세 가지를 적습니다. <strong>어떤 문제인가?</strong> <strong>기존 방법과 무엇이 다른가?</strong> <strong>결과는 어떤 조건에서 나왔는가?</strong></p>
      <h2>두 번째 읽기: 근거 확인</h2>
      <p>위협 모델, 데이터셋, 비교 대상, 성능 지표를 확인합니다. 표에서 좋은 숫자를 찾는 것만큼 실험 조건과 한계를 읽는 것이 중요합니다.</p>
      <h2>읽고 난 뒤 남길 것</h2>
      <ul><li>핵심 아이디어를 내 말로 세 문장 안에 설명하기</li><li>기억할 그림이나 수식 한 개 고르기</li><li>재현해 보고 싶은 실험과 남은 질문 적기</li></ul>`
  },
  {
    slug: "competition-certification-log",
    title: "대회와 자격증 준비 과정을 기록하는 방법",
    category: "공모전/자격증",
    date: "2026-10-21",
    readTime: "3 MIN READ",
    summary: "결과뿐 아니라 준비 계획, 역할, 배운 점을 포트폴리오 자산으로 남기는 틀입니다.",
    tags: ["공모전", "자격증", "회고"],
    content: `
      <p>대회나 자격증 기록은 이름과 날짜만 적으면 시간이 지나 맥락이 사라집니다. 준비 과정과 내가 맡은 역할을 함께 남기면 다음 도전에 활용하기 좋습니다.</p>
      <h2>시작할 때</h2>
      <p>공식 일정과 평가 기준을 확인하고, 목표를 측정 가능한 단위로 나눕니다. 팀 활동이라면 역할과 책임 범위를 분명히 정리합니다.</p>
      <h2>진행 중</h2>
      <p>매주 진행한 작업, 막힌 지점, 수정한 계획을 짧게 기록합니다. 결과물의 버전과 출처를 함께 보관하면 나중에 설명하기 쉽습니다.</p>
      <h2>마친 뒤</h2>
      <p>성과를 과장하지 않고 사실대로 적습니다. 실제로 만든 것, 확인 가능한 결과, 다음에 개선할 점을 구분하면 포트폴리오에도 자연스럽게 연결됩니다.</p>`
  }
];
