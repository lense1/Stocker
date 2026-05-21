# 🛒 Stock+er (스토커)

> **AI 가격 최적화 기반 식품 이커머스 플랫폼**
>
> 네이버 쇼핑 실시간 최저가 크롤링과 검색 트렌드 데이터를 결합한 GAM/XGBoost AI 모델이
> 재고 상태에 따라 판매가를 자동으로 최적화하는 **식품 전문 온라인 마켓**입니다.

---

## 📌 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Stock+er (스토커) |
| DB명 | `stocker` (MySQL) |
| 배포 링크 | 없음 |
| 결제 수단 | Toss Payments |
| 이미지 스토리지 | Cloudinary |

---

## 🛠 기술 스택

### Frontend
- **React 18.3**, React Router v7
- **styled-components** — 컴포넌트 단위 스타일링
- **recharts** — 관리자 대시보드 차트
- **react-quill** — 상품 상세 리치 텍스트 편집기
- **axios**, **lucide-react**, **react-datepicker**

### Backend
- **Python FastAPI** — REST API 서버 (port 8000)
- **SQLAlchemy** — ORM
- **MySQL** — 메인 데이터베이스
- **JWT** (HS256, Access 60분 / Refresh 14일) — 인증
- **Gmail SMTP** — 이메일 인증
- **Selenium + Chrome** — 네이버 쇼핑 카탈로그 최저가 크롤링
- **Cloudinary** — 상품 이미지 업로드

### AI 서버 (별도 FastAPI)
- **GAM (Generalized Additive Model)** — 가격별 판매량 예측 (메인)
- **XGBoost / Neural Network** — 보조 예측 모델
- **Naver 검색광고 API** — 최근 4주 키워드 클릭수 수집
- **Naver Shopping Insight API** — 카테고리별 검색량 수집

### 외부 API / 소셜 로그인
- **Google OAuth2**, **Kakao OAuth2**, **Naver OAuth2**
- **Toss Payments** — 결제 승인/취소
- **Naver 쇼핑 카탈로그** — Selenium 크롤링으로 경쟁사 최저가 추적

---

## 🏗 시스템 아키텍처

```
[ React Frontend : 3000 ]
          ↓  REST (JWT)
[ FastAPI Backend : 8000 ]
   ├─ MySQL (stocker)
   ├─ Cloudinary          ← 상품 이미지
   ├─ Gmail SMTP          ← 이메일 인증
   ├─ Toss Payments API   ← 결제
   ├─ Google/Kakao/Naver  ← 소셜 로그인
   └─ Selenium Chrome     ← 네이버 쇼핑 크롤링

[ AI FastAPI 서버 (별도) ]
   ├─ GAM / XGBoost / NN 모델
   ├─ Naver 검색광고 API    ← 키워드 클릭수
   └─ Naver Shopping Insight API ← 카테고리 검색량
```

---

## 📁 프로젝트 구조

```
Stock+er/
├── frontend/                        # React SPA (port 3000)
│   └── src/
│       ├── pages/
│       │   ├── consumer/            # 소비자 화면
│       │   │   ├── Home.js
│       │   │   ├── AllProductsPage.js
│       │   │   ├── ProductDetailPage.js
│       │   │   ├── AILowestPricePage.js  # AI 최저가 예측 페이지
│       │   │   ├── CartPage.js
│       │   │   ├── CheckoutPage.js
│       │   │   ├── Login.js / Signup.js
│       │   │   ├── SocialLoginCallback.js
│       │   │   ├── Orders.js / Profile.js
│       │   │   └── Payment(Success/Fail)Page.js
│       │   └── admin/               # 관리자 화면
│       │       ├── Dashboard.js
│       │       ├── products/ (목록/등록/수정)
│       │       ├── price/ (가격조회/카탈로그매칭/AI이력)
│       │       ├── inventory/ (실시간재고/입고/이력)
│       │       └── statistics/ (매출/AI가격 통계)
│       ├── components/              # 공통 컴포넌트
│       ├── api/                     # axios API 모듈
│       ├── context/AuthContext.jsx  # 전역 인증 상태
│       └── routes/                  # AdminRoute, ConsumerRouter
│
├── backend/                         # FastAPI 백엔드 (port 8000)
│   └── app/
│       ├── api/v1/endpoints/
│       │   ├── auth.py              # 이메일 회원가입/로그인
│       │   ├── google_auth.py       # 구글 소셜 로그인
│       │   ├── kakao_auth.py        # 카카오 소셜 로그인
│       │   ├── naver_auth.py        # 네이버 소셜 로그인
│       │   ├── product.py           # 소비자 상품 조회
│       │   ├── cart.py              # 장바구니
│       │   ├── order.py / order_read.py  # 주문
│       │   ├── admin_product.py     # 관리자 상품/재고/이미지
│       │   ├── admin_price.py       # 관리자 가격/AI이력
│       │   ├── admin_dashboard.py   # 관리자 대시보드
│       │   └── home.py             # 홈 데이터
│       ├── services/
│       │   ├── admin_product_service.py      # 상품 CRUD, 재고 관리
│       │   ├── admin_price_service.py        # 가격 이력 조회/수동 변경
│       │   ├── admin_price_simulator_service.py # 가격 시뮬레이터
│       │   ├── ai_pricing_scheduler.py       # AI 자동 가격 스케줄러
│       │   ├── naver_crawler_service.py      # Selenium 최저가 크롤링
│       │   ├── payment_service.py            # Toss Payments 연동
│       │   ├── cart_service.py
│       │   ├── order_service.py
│       │   ├── cloudinary_service.py
│       │   └── mail_service.py              # Gmail SMTP 이메일 인증
│       ├── ai/
│       │   ├── inference.py         # AI 최적 가격 결정 메인 함수
│       │   ├── loader.py            # GAM 모델 로드
│       │   └── utils/               # Naver API 유틸
│       ├── models/                  # SQLAlchemy DB 모델
│       └── core/
│           ├── config.py            # 환경변수 설정
│           ├── enums.py             # 상태 열거형 정의
│           └── security.py         # JWT 인증
│
└── ai/                              # AI 독립 서버 (별도 포트)
    ├── app/
    │   ├── routers/predict.py       # /predict_week 엔드포인트
    │   └── services/prediction.py   # 7일 가격별 판매량 예측
    ├── models/
    │   ├── gam_model.pkl            # GAM 메인 예측 모델
    │   ├── xgb_model.pkl            # XGBoost 보조 모델
    │   └── nn_model.pkl             # Neural Network 모델
    ├── training/                    # 모델 학습 Jupyter Notebook
    └── utils/
        ├── naver_searchad_relkeyword.py   # 네이버 검색광고 API
        └── naver_shoppinginsite_search.py # 네이버 쇼핑인사이트 API
```

---

## ✨ 주요 기능

### 👤 소비자 (Consumer)

| 기능 | 설명 |
|------|------|
| 회원가입 | 이메일 인증 코드 발송 후 가입 확정 |
| 소셜 로그인 | Google / Kakao / Naver OAuth2 |
| 홈 | 추천 상품, 배너, 카테고리 탐색 |
| 전체 상품 | 카테고리·키워드 필터, 페이지네이션 |
| 상품 상세 | 가격, 재고, 상세 이미지, 장바구니 추가 |
| **AI 최저가 예측** | 키워드 기반 향후 7일 가격대별 판매량 예측 차트 |
| 장바구니 | 상품 추가/수량 조절/삭제 |
| 결제 | Toss Payments 연동 (성공/실패 처리) |
| 주문 내역 | 주문 상태, 상세 조회 |
| 프로필 | 개인정보 수정, 배송지 관리 |

### 🔧 관리자 (Admin)

**대시보드**
- 오늘 매출 / 주문 수 / 시간대별 주문 분포
- 카테고리별 매출, 판매 상품 순위

**상품 관리**
- 상품 목록 (키워드/카테고리/날짜 필터, 페이지네이션)
- 상품 등록 (이미지 업로드 → Cloudinary, 리치 텍스트 상세 설명)
- 상품 수정 / 판매 상태 변경 (판매예정/판매중/중지/품절/종료)
- AI 가격 자동화 설정 (최소가/최대가/회당 조정폭 설정)

**가격 관리**
- **가격 조회 & 이력**: 상품별 AI/수동 가격 변경 이력 그래프
- **카탈로그 매칭**: 네이버 쇼핑 카탈로그 연결 → 경쟁사 최저가 자동 추적
- **AI 가격 변경 이력**: AI가 변경한 가격 내역, 예상 판매량·수익 확인

**재고 관리**
- **실시간 재고 현황**: 현재 재고/안전재고/상태 일괄 조회 및 수정
- **입고 등록**: 입고 수량 등록, 재고 이력 자동 기록
- **재고 변동 이력**: 입고/주문출고/취소반품/조정/폐기 내역

**통계**
- 매출 통계 (기간별, 카테고리별, 시간대별)
- AI 가격 통계 (AI 적용 횟수, 가격 변화율 분포)

---

## 🤖 AI 가격 최적화 로직

### 입력 데이터
```
- 키워드 (상품명 정규화)
- 현재 판매가 / 최소가 / 최대가
- 현재 재고 / 안전재고
- 네이버 최근 4주 클릭수 비율 (검색광고 API)
- 네이버 쇼핑 카탈로그 최저가 (Selenium 크롤링)
- 악성재고 여부 (입고일로부터 90일 초과)
```

### 재고 상태별 가격 전략

| 재고 상태 | 전략 |
|-----------|------|
| **악성재고** (90일 초과) | 최저가 방향으로 인하 → 빠른 소진 우선 |
| **재고 많음** (안전재고 × 2 초과) | 최대 매출 후보 선택 |
| **재고 보통** | 최대 수익 후보 선택 (가격 상·하향 모두 검토) |
| **재고 부족** | 가격 인상 방향만 선택 → 수익 극대화 |

### 모델 구성
```
GAM  (gam_model.pkl)  ← 가격 × 클릭수비율 × 요일로 판매량 예측 (메인)
XGBoost (xgb_model.pkl) ← 보조 예측
NN   (nn_model.pkl)   ← 보조 예측
```

### 가격 결정 흐름
```
1. 키워드 정규화 (브랜드명/수량 표현/특수문자 제거)
2. 네이버 API → 최근 4주 클릭수 비율 계산
3. ±100원 단위 가격 후보 생성 (최소가~최대가 범위 내)
4. 각 후보별 GAM 예측 판매량 × 가격 = 예상 수익 계산
5. 재고 상태 분기 → 전략에 맞는 최적 가격 선택
6. 반환: 변경 가격, 변경률, 예상 판매량, 예상 수익, 잔여재고
```

### AI 자동화 스케줄러 (현재 비활성)
> `ai_pricing_scheduler.py` — 10분 간격 전 상품 자동 가격 갱신 로직 구현 완료, 운영 적용 시 `main.py`의 주석 해제 필요

---

## 🗄 DB 테이블 구조

| 테이블 | 설명 |
|--------|------|
| `member` | 회원 (로컬/소셜, USER/ADMIN 역할) |
| `product` | 상품 (AI 가격 설정, 최소/최대가, 재고, 유통기한 포함) |
| `catalog_product` | 네이버 카탈로그 매핑 (외부 최저가 연동) |
| `category` / `brand` | 카테고리, 브랜드 |
| `cart` / `cart_item` | 장바구니 |
| `orders` / `order_item` | 주문 / 주문 상품 |
| `order_shipping` | 배송지 정보 |
| `payment` | 결제 (Toss, READY/APPROVED/FAILED/CANCELED) |
| `product_price_history` | 가격 변경 이력 (AI/MANUAL/SYSTEM/INITIAL 구분) |
| `inventory_log` | 재고 변동 이력 (입고/주문출고/취소반품/조정/폐기) |
| `refresh_token` | JWT Refresh Token |
| `email_verification` | 이메일 인증 코드 (5분 만료) |

---

## ⚙️ 로컬 실행 방법

### 사전 요구사항
- Python 3.11+, Conda
- Node.js 18+
- MySQL 8.x
- Google Chrome (Selenium 크롤링용)

### 1. MySQL DB 생성
```sql
CREATE DATABASE stocker DEFAULT CHARACTER SET utf8mb4;
```

### 2. 백엔드 실행
```bash
cd backend
cp .env.example .env
# .env에 API 키 및 DB 설정 입력
conda env create -f environment.yml
conda activate stocker-ai
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
> 서버 최초 실행 시 `Base.metadata.create_all()` + `seed_master_data()`로 테이블 및 기초 데이터 자동 생성

### 3. AI 서버 실행
```bash
cd ai
conda env create -f environment.yml
conda activate stocker-ai
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

### 4. 프론트엔드 실행
```bash
cd frontend
npm install
npm start
# port 3000, proxy → backend :8000
```

---

## 🔑 필수 환경변수 (.env)

| 항목 | 설명 |
|------|------|
| `DATABASE_URL` | MySQL 접속 URL |
| `JWT_SECRET_KEY` | JWT 서명 키 |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth2 |
| `KAKAO_REST_API_KEY/SECRET` | Kakao OAuth2 |
| `NAVER_CLIENT_ID/SECRET` | Naver OAuth2 |
| `TOSS_SECRET_KEY` | Toss Payments 시크릿 키 |
| `CLOUDINARY_*` | 이미지 업로드 설정 |
| `SMTP_USERNAME/PASSWORD` | Gmail SMTP (이메일 인증) |
| `API_KEY / API_SECRET / CUSTOMER_ID` | 네이버 검색광고 API |
| `CLIENT_ID / CLIENT_SECRET` | 네이버 Shopping Insight API |

---

## 📝 개발 시 참고 사항

- **AI 자동 스케줄러 비활성**: `backend/app/main.py`의 `lifespan` 블록이 주석 처리됨 — 운영 적용 시 해제 필요
- **Selenium 크롤러 Windows 전용**: `naver_crawler_service.py`의 Chrome 경로(`C:\chrometemp`, `C:\Program Files\...`)가 하드코딩 — 타 OS 배포 시 경로 수정 필요
- **악성재고 기준**: 입고일로부터 **90일** 경과 시 자동 판단
- **가격 이력 구분**: `PriceChangeSource.AI / MANUAL / SYSTEM / INITIAL` 열거형으로 변경 주체 명확히 기록
- **Naver 카탈로그 CAPTCHA**: 크롤링 중 캡차 감지 시 15초 대기 후 재시도 로직 내장 (`CAPTCHA_RETRY_SECONDS = 15`)
