# Consumer page refactor

이 폴더는 소비자 페이지 기준으로 `styled-components`를 화면 로직 파일과 스타일 파일로 분리한 결과물입니다.

## 포함 범위
- pages/consumer/*
- components/Header.jsx
- components/Footer.jsx
- layout/MainLayout.jsx

## 적용 방식
기존 파일을 같은 경로에 덮어쓰고, 함께 생성된 `*.styles.js|jsx` 파일도 같은 폴더에 추가하면 됩니다.

## 참고
- 관리자 페이지는 제외했습니다.
- App.js 라우팅은 그대로 사용 가능합니다.
- App.css, index.css는 이번 정리 대상에서 제외했습니다.
