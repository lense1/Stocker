# STOCK+er

AI 기반 가격 비교 및 동적 가격 조정을 활용한 쇼핑 플랫폼입니다.  
소비자 페이지와 관리자 페이지를 분리하여 상품 조회, 주문, 결제, 재고/가격 관리 기능을 제공합니다.

- React
- styled-components
- React Router
- Axios

## 주요 기능

### 소비자
- 회원가입 / 로그인 / 소셜 로그인
- 상품 목록 / 상품 상세 조회
- 장바구니 / 주문 / 결제
- 프로필 / 주문 내역 확인

### 관리자
- 상품 등록 / 수정 / 조회
- 가격 조회 / 매칭 관리 / AI 가격 이력
- 실시간 재고 현황 / 입출고 이력
- 판매 통계 / AI 가격변경 성과 / 대시보드

## 폴더 구조
```text
src
├─ api
├─ components
├─ context
├─ layout
├─ pages
│  ├─ consumer
│  └─ admin
├─ routes
└─ styles
```
## 실행 방법

### Frontend
```bash
yarn install
yarn start
```
