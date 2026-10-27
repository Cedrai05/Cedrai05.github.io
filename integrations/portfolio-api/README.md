# 블로그 API

이 디렉터리의 티스토리 수집 코드는 글 이관 후 제거했습니다.

공개 목록과 본문은 이 저장소의 `posts.js`, `content/catalog.json`, `content/posts/`에 있습니다.
보호글 열람은 `Cedrai05/cedrai-portfolio`의 `app/api/native-blog/`와 `lib/native-blog.ts`에서 처리합니다.
보호글 원문·첨부파일·비밀번호 검증값은 Vercel 비공개 Blob에만 보관합니다.

소유자 백업을 변환하는 도구는 `tools/migrate-tistory.py`입니다. Python 환경에 `beautifulsoup4`를 설치하고
`--backup`, `--owner`, `--catalog`, `--public`, `--private` 경로를 명시해 실행합니다.
`--private`와 `--owner`는 공개 저장소 밖에 두어야 합니다.
