# 청년이슈 자동화 시스템 설정 가이드

## 1. Gemini API 키 발급

1. https://makersuite.google.com/app/apikey 방문
2. "Create API Key" 클릭
3. API 키 복사

## 2. 환경 변수 설정

`.env.local` 파일에 Gemini API 키 입력:

```
GEMINI_API_KEY=your_actual_api_key_here
```

## 3. 로컬 테스트 실행

```bash
# 의존성 설치 (이미 완료됨)
npm install

# 스크립트 실행
npx tsx src/scripts/fetch-and-summarize-issues.ts
```

## 4. 결과 확인

- `src/data/issues.ts` 파일이 자동 생성/업데이트됨
- 프론트엔드에서 실시간으로 반영됨

```bash
npm run dev
```

## 5. GitHub Actions 설정 (선택사항)

### Repository Secrets 설정

1. GitHub 저장소 설정 → Secrets and variables → Actions
2. "New repository secret" 클릭
3. Name: `GEMINI_API_KEY`, Value: API 키 입력
4. 저장

### 자동 실행

- 매주 월요일 00:00 UTC (한국 시간 09:00)에 자동 실행
- 또는 Actions 탭에서 "Weekly Issue Sync" 워크플로우 수동 실행 가능

## 6. 주의사항

- `.env.local`은 절대 git에 커밋하지 않기 (.gitignore에 등록됨)
- Gemini API는 하루 60개 요청 무료 (주 1회 ~10개 요청으로 충분)
- 기사 수집이 실패하면 로그를 확인하고 키워드 조정

## 7. 문제 해결

### "GEMINI_API_KEY is not set" 에러
→ .env.local 파일에 유효한 API 키가 있는지 확인

### "Cannot find module 'tsx'" 에러
→ `npm install` 다시 실행

### 기사가 0개 수집됨
→ Google News RSS 서버 상태 확인
→ 키워드 필터링 조건 조정 (news-fetcher.ts의 YOUTH_KEYWORDS 수정)

---

## 자동화 동작 흐름

```
1. GitHub Actions 트리거 (매주 월요일 00:00 UTC)
   ↓
2. fetch-and-summarize-issues.ts 실행
   ↓
3. 기사 수집 (Google News RSS)
   ↓
4. 키워드 필터링 (청년 관련만)
   ↓
5. Gemini API로 요약 & 분석
   ↓
6. issues.ts 파일 자동 생성
   ↓
7. Git commit & push
   ↓
8. 프론트엔드 자동 반영 (배포 후)
```
