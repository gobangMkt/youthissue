@AGENTS.md

## 서비스 개요
청년 정책 이슈를 매주 자동 수집·랭킹하여 페르소나별 혜택을 보여주는 서비스.
배포: youthissue.vercel.app

## 코어 기능

### 1. 배치 파이프라인 (매주 월요일 자동)
- 스크립트: `src/scripts/fetch-and-summarize-issues.ts`
- 흐름: RSS 수집 → 본문 스크래핑 → 클러스터링 → Gemini 요약 → `src/data/issues.ts` 생성
- 출력 필드: id, rank, rankChange, isNew, title, category, summary(3줄), checkpoints, personaImpacts, sources

### 2. 랭킹 리스트 (메인 페이지)
- 카테고리 필터: 주거 / 금융 / 취업 / 복지 / 교육
- 정렬: 기사 수 순 / 혜택 많은 순
- TOP 3 featured 카드, 나머지 리스트

### 3. 이슈 상세 페이지 (`/issue/[id]`)
- AI 3줄 요약, 페르소나별 영향(5개), 체크포인트, 소스 링크

### 4. 인사이트 배너
- 데이터 출처: `personaImpacts[].impact` (positive / very_positive 카운트)
- 표시: 페르소나별 유리한 이슈 수 바 차트 + 분포 기반 자동 요약 멘트
- 파일: `src/components/InsightBanner.tsx`

## UI 개발 규칙

UI에 수치·문구를 추가할 때 반드시 확인:
1. **데이터 출처** — 어떤 Issue 필드에서 오는가? 하드코딩인가 동적인가?
2. **실제 채워지는가** — 현재 issues.ts 데이터에서 값이 실제로 존재하는가?
3. **0·빈 배열일 때 말이 되는가** — 엣지케이스에서도 문구가 모순되지 않는가?

위 세 가지를 통과하지 못하면 해당 수치·문구를 추가하지 않는다.

## 페르소나 목록
1인 가구 / 신혼부부 / 취업준비생 / 대학생 / 직장인

## 카테고리 목록
주거 / 금융 / 취업 / 복지 / 교육
