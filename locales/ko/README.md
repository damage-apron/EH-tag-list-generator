# EH-tag-list-generator

이 파일은 AI 번역으로 작성되어 부정확한 내용이 포함될 수 있습니다.
차이가 있을 경우 일본어 원문을 우선합니다.

---

## 언어 및 현지화

- 현지화 문서는 `locales` 아래에서 관리합니다.
- 번역에는 AI를 사용합니다.
- 현지화 버전은 참고용이며, 불일치가 있는 경우 일본어 원문을 우선합니다.

### 언어별 README

- 일본어(원문): [README.md](../../README.md)
- English (localized): [locales/en/README.md](../en/README.md)
- 中文(本地化): [locales/zh/README.md](../zh/README.md)
- 한국어(로컬라이즈): [locales/ko/README.md](../ko/README.md)

## 개요

EH 태그 정보를 수집·정리하여 배포하기 쉬운 JSON / JSONC 형식으로 출력하는 TypeScript 기반 생성 도구입니다.

이 도구는 `tag1`부터 `tag4`까지의 단계적 처리로 카테고리별 태그 데이터를 만들고, 최종적으로 통합 데이터를 생성합니다.

실행하면 태그 번역 작업에 활용할 수 있는 통합 JSON / JSONC 데이터를 얻을 수 있습니다.

## 설치

사전 조건:

- Node.js 20 이상 권장
- npm

사전 준비:

- 이 리포지토리 전체를 다운로드(또는 `git clone`)하여 로컬 PC에 배치하세요.
- `LICENSE` 등이 있는 프로젝트 루트 폴더에서 아래 명령을 실행하세요(VS Code 터미널 또는 PowerShell / 명령 프롬프트 모두 가능).

설정:

```bash
npm install
```

## 사용 방법

생성 처리를 실행합니다.

```bash
npm run main
```

`npm run main`은 다음을 실행합니다.

1. TypeScript 빌드 (`tsc -b`)
2. 생성 스크립트 실행 (`node dist/main.js`)

`node dist/main.js`의 마지막 단계에서 `data/jsonc` 아래의 모든 `.jsonc` 파일을 스캔하여 `data/json` 아래의 `.json` 파일로 자동 변환해 출력합니다.

## 프로그램 구성

### `src/main.ts`

- 전체 실행 흐름을 관리하는 엔트리 포인트
- `Tag1`부터 `Tag4`까지 순서대로 실행
- 최종 통합 데이터 `data/jsonc/data1.jsonc` 생성
- `data/jsonc` 아래의 `.jsonc`를 일괄 `.json`으로 변환

### `src/tag1.ts`

- ehwiki 카테고리 API에서 태그 ID와 제목을 수집
- 페이지네이션 (`cmcontinue`)을 따라 전체 항목을 수집
- 카테고리별 초기 데이터 (`*_1.json`) 생성

### `src/tag2.ts`

- `tag1`의 ID 목록을 기반으로 API에서 각 페이지 본문을 수집
- `pageids`를 50개 단위로 묶어서 요청
- 성공 데이터와 실패 ID를 정리해 `*_2.json` 생성

### `src/tag3.ts`

- wiki 본문에서 일본어명을 추출하고 정규화(HTML 엔티티 디코드, 전각 괄호 정규화 등)
- `tag3`: 일반 카테고리용 추출
- `tag3Creator`: Creator 카테고리에서 artist / circle 분리 판정
- 추출 결과를 `*_3.json`으로 출력

### `src/tag4.ts`

- 원본 제목과 번역 결과를 대조해 `title -> 일본어명` 사전 생성
- 실패 ID를 수집하면서 키 정렬된 최종 카테고리 데이터 (`*_4.json`) 생성

## 출력

주요 출력 경로는 `data` 아래입니다.

- `data/*_1.json`부터 `data/*_4.json`: 각 처리 단계의 중간 산출물
- `data/jsonc/data1.jsonc`: 최종 통합 데이터 (JSONC)
- `data/json/*.json`: `data/jsonc` 아래 모든 `.jsonc`에서 자동 변환된 JSON

실제 변환 데이터는 공개 리포지토리 [EH-tag-list](https://github.com/damage-apron/EH-tag-list/)에서 배포합니다.

## 개발

빌드만 실행하는 경우:

```bash
tsc -b
```

## 라이선스

MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE)를 참고하세요.

## 주의사항

- 출력 파일이 이미 존재하면 일부 동일 파일은 건너뜁니다.
- 원본 데이터 사양이 변경되면 출력 내용도 달라질 수 있습니다.
