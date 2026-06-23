# dashboard — AI Visibility 대시보드

같은 레포의 `../snapshots/*.json`(주간 측정 롤업)을 읽어 시각화하는 Next(App Router) 앱.
별도 데이터 토큰 없음 — 스냅샷이 같은 레포에 있으므로 빌드 시점에 직접 읽는다.
사용자 인증은 **Google codeit.com 도메인 로그인**(next-auth v4).

## 로컬 실행
```bash
cd dashboard
pnpm install
cp .env.example .env.local   # GOOGLE_CLIENT_ID/SECRET, NEXTAUTH_SECRET 채우기
pnpm dev                     # http://localhost:4350
pnpm typecheck
```

## 데이터
- `../snapshots/services.json` + `../snapshots/<app>/index.json`(= `types/snapshot.ts`의 `RollupIndex`)을 `src/data.ts`가 읽음.
- 없으면 `src/fixture.ts` 샘플로 폴백(배지 표시).
- 주간 Action 이 스냅샷 커밋 → Vercel 자동 재배포 → 최신 데이터로 정적 재생성.

## 인증
- `auth.ts`(GoogleProvider, codeit.com 3중 잠금) + `middleware.ts`(미로그인 → `/sign-in`).
- GCP: codeit.com Workspace 프로젝트에 OAuth 클라이언트, redirect URI `<도메인>/api/auth/callback/google`. 동의화면 Internal 권장.

## 배포 (Vercel)
- 엔진 레포 = 별도 Vercel 프로젝트, **Root Directory = 레포 루트**, Build `cd dashboard && pnpm install && pnpm build`, Output `dashboard/.next`.
- (Root 를 레포 루트로 둬야 빌드 시 `../snapshots` 접근 가능)
- env: `GOOGLE_CLIENT_ID`·`GOOGLE_CLIENT_SECRET`·`NEXTAUTH_SECRET`(+커스텀 도메인 시 `NEXTAUTH_URL`).
- ⚠️ Vercel Authentication/IAP 는 켜지 말 것(Google 로그인이 게이트).
