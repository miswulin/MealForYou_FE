# 🥗 MealForYou_FE (프론트엔드)
## 🎯 프로젝트 개요
MealForYou는 사용자의 식재료 관리 효율을 극대화하고, 개인의 니즈에 맞춘 식재료 온라인 구매를 지원하여 집밥 요리를 편리하게 만들어주는 올인원 키친 솔루션입니다.

## ⚙️ 1. 기술 스택 (Technology Stack)
프론트엔드 개발에 사용된 주요 언어 및 라이브러리 목록입니다.

| 분류 | 스택 | 설명 |
|------|------|------|
| 개발 언어 | **JavaScript (ES6+)** | 현대적 JS 문법 기반 개발 |
| 프레임워크 | **React** | 사용자 인터페이스 구축 |
| 빌드/번들러 | **Vite** | 빠른 개발환경 및 번들링 |
| 상태 관리 | **Zustand** | 유연하고 간단한 전역 상태 관리 |
| 통신 | **Axios** | 백엔드 API와의 비동기 통신 |
| 스타일링 | **Tailwind CSS** | Utility-first 디자인 시스템 |

---
## 🤝 2. 협업 및 Git 컨벤션
- 버전 관리 및 협업 도구
  - 버전 관리: Git
  - 원격 저장소: GitHub

Git Flow 전략
- **main 브랜치 직접 커밋 금지 (엄격)**  
- 기본 개발 브랜치: `dev`  
- 기능 개발은 `feat/` 접두사, 버그 수정은 `fix/` 접두사로 브랜치 생성 후 PR

✍️ 커밋 메시지 컨벤션
Angular Commit Convention 기반 Prefix 사용:

- `feat:` 새로운 기능 추가  
- `fix:` 버그 수정  
- `refactor:` 리팩터링 (기능 변경 없음)  
- `style:` 코드 스타일/포맷 변경  
- `docs:` 문서 변경  
- `chore:` 빌드/설정/의존성 변경
  
## 📁 3. 프로젝트 폴더 구조

```
MealForYou_FE/
│
├── src/                     # 소스 코드
│   ├── api/                 # API 호출 모듈
│   │   ├── auth.js          # 인증 관련 API
│   │   ├── cart.js          # 장바구니 관련 API
│   │   ├── dishes.js        # 메뉴 관련 API
│   │   ├── member.js        # 회원 관련 API
│   │   ├── order.js         # 주문 관련 API
│   │   └── payment.js       # 결제 관련 API
│   │
│   ├── assets/              # 에셋 파일
│   │   ├── images/          # 이미지 파일
│   │   └── *.svg            # SVG 아이콘들
│   │
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── common/          # 공통 컴포넌트
│   │   ├── layout/          # 레이아웃 컴포넌트
│   │   └── ui/              # UI 컴포넌트
│   │
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── Cart/            # 장바구니 페이지
│   │   ├── Home/            # 홈 페이지
│   │   ├── Login/           # 로그인 페이지
│   │   ├── MenuList/        # 메뉴리스트 페이지
│   │   ├── MyPage/          # 마이 페이지
│   │   ├── OnboardingTest/  # 선호식단 페이지
│   │   ├── Order/           # 주문 페이지
│   │   ├── Productdetail/   # 상세 페이지
│   │   ├── Search/          # 검색 페이지
│   │   ├── Signup/          # 회원가입 페이지
│   │   └── Wishlist/        # 위시리스트
│   │
│   ├── styles/              # 전역 스타일
│   ├── utils/               # 유틸리티 함수
│   ├── App.jsx              # 앱 루트 컴포넌트
│   └── main.jsx             # 진입점
│
├── .github/                 # GitHub 관련 설정
│   ├── workflows/           # GitHub Actions 워크플로우
│   └── ISSUE_TEMPLATE/      # 이슈 템플릿
│
├── .gitignore               # Git 무시 파일
├── package.json             # 프로젝트 설정 및 의존성
├── package-lock.json        # 정확한 의존성 버전
└── README.md                # 프로젝트 설명 문서
```
## 🙋 4. 팀원 소개

| 이름 | 역할 | 담당 기능 | 연락처 / GitHub |
|------|------|----------|-----------------|
| [김지원] | 프론트엔드 개발 | 상세페이지, 주문, 장바구니, 결제 | [GitHub ID] |
| [정규은] | 프론트엔드 개발 | 로그인, 회원가입, 홈, 검색, 메뉴리스트, 선호식단 | [GitHub ID] |
| [주채빈] | 프론트엔드 개발 | 관심 페이지, 마이페이지 | [GitHub ID] |

---
<!--
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
-->
