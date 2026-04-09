# Polymarket Live Sports Trading Terminal - 제품 기획서

## 프로젝트 개요

Polymarket 위에 구축하는 웹 기반 트레이딩 터미널. 라이브 스포츠 트레이더가 멀티 게임을 동시 모니터링하며 TP/SL 자동 실행할 수 있는 프로 도구.

### 타겟 유저

- **1순위**: 라이브 스포츠 스윙 트레이더 (4개 경기 동시 모니터링, 뒷정보 파악, TP/SL 자동 매매)
- **2순위**: 전문 트레이더를 따라하고 싶은 카피 트레이더 (고래 움직임 + 오즈 변동 한 화면)

### 경쟁 분석

| 차원 | PolyGun (텔레그램, 7K+) | Betmoar (Discord, 웹) | **우리** |
|------|------------------------|----------------------|---------|
| 핵심 유저 | 라이브 스포츠 스윙 트레이더 | 정보 기반 분석 트레이더 | 둘 다 |
| TP/SL | 미구현 | 미구현 (보안상 보류) | **핵심 킬피처** |
| 멀티게임 뷰 | 없음 (텔레그램 한계) | 없음 | **핵심 킬피처** |
| 고래 추적 | Copy Trade (체결 품질 문제) | Holders 탭 (분석만) | 통합 뷰 |
| 라이브 스코어 | 없음 | 없음 | 외부 API 연동 |

---

## 기술 제약 요약 (Polymarket API 기반)

| 기능 | API 지원 여부 | 대응 방안 |
|------|-------------|----------|
| 실시간 오즈 스트리밍 | **WebSocket 지원** | `wss://ws-subscriptions-clob.polymarket.com` |
| 주문 제출/취소 | **전체 지원** (GTC, GTD, FOK, FAK) | CLOB API |
| TP/SL | **미지원** | 자체 서버에서 가격 모니터링 + 자동 주문 제출 |
| 라이브 스코어/경기 데이터 | **미지원** (마켓 메타데이터만) | 외부 스포츠 API 연동 필요 |
| 유저 인증 | **OAuth 없음** (지갑 서명만) | WalletConnect 또는 Privy 등 임베디드 월렛 |
| 타인 포지션 조회 | **공개 API** (주소만 있으면 조회) | Data API |
| 오더북 | **전체 지원** (depth, spread, midpoint) | CLOB API |
| 스포츠 마켓 특이사항 | **경기 시작 시 리밋오더 자동 취소** | TP/SL은 마켓오더(FOK)로 제출해야 함 |

### 주요 API 엔드포인트

| Service | URL |
|---------|-----|
| CLOB API | `https://clob.polymarket.com` |
| Gamma API | `https://gamma-api.polymarket.com` |
| Data API | `https://data-api.polymarket.com` |
| WebSocket (Market) | `wss://ws-subscriptions-clob.polymarket.com/ws/market` |

### Rate Limits

| Endpoint | Limit |
|----------|-------|
| General | 15,000 req / 10s |
| Gamma /events | 500 req / 10s |
| Gamma /markets | 300 req / 10s |
| CLOB order posting (burst) | 3,500 req / 10s |

---

## 화면 구성

### Screen 1: Live Multi-Game Dashboard (메인 화면)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Sports] NBA  NFL  NHL  UFC  Soccer  │  My Positions (3)  │ 💰 $2,340  │
├─────────────────────┬───────────────────┬───────────────────────┤
│   GAME PANEL 1      │   GAME PANEL 2    │                       │
│ ┌─────────────────┐ │ ┌───────────────┐ │   POSITION MANAGER    │
│ │ LAL vs BOS      │ │ │ KC vs BUF     │ │                       │
│ │ Q3 4:32  82-76  │ │ │ 3Q 7:21      │ │  ┌─────────────────┐  │
│ │                 │ │ │  21-17       │ │  │ LAL Win         │  │
│ │ LAL: 0.62 ▲    │ │ │ KC: 0.55 ▼   │ │  │ Avg: 0.45       │  │
│ │ BOS: 0.38 ▼    │ │ │ BUF: 0.45 ▲  │ │  │ Now: 0.62       │  │
│ │ [오즈 차트~~~~] │ │ │ [오즈 차트~~]│ │  │ PnL: +$170      │  │
│ │                 │ │ │              │ │  │                 │  │
│ │ 🐋 $50K LAL Buy│ │ │              │ │  │ TP: [0.85] ✅   │  │
│ │ 📊 Vol: $1.2M  │ │ │              │ │  │ SL: [0.40] ✅   │  │
│ │                 │ │ │              │ │  │ [SELL NOW]      │  │
│ │ [BUY LAL][BUY B│OS]│[BUY KC][BUY B│UF]│  └─────────────────┘  │
│ └─────────────────┘ │ └───────────────┘ │  ┌─────────────────┐  │
│   GAME PANEL 3      │   GAME PANEL 4    │  │ KC Win          │  │
│ ┌─────────────────┐ │ ┌───────────────┐ │  │ Avg: 0.30       │  │
│ │ TOR vs FLA      │ │ │ ARS vs BAR    │ │  │ Now: 0.55       │  │
│ │ 2P 12:05  2-1  │ │ │ 67' 1-1      │ │  │ PnL: +$250      │  │
│ │                 │ │ │              │ │  │                 │  │
│ │ TOR: 0.35 ▼    │ │ │ ARS: 0.48    │ │  │ TP: [0.80]  ✅  │  │
│ │ FLA: 0.65 ▲    │ │ │ BAR: 0.32    │ │  │ SL: [0.25]  ✅  │  │
│ │ [오즈 차트~~~~] │ │ │ Draw: 0.20   │ │  │ [SELL NOW]      │  │
│ │                 │ │ │ [오즈 차트~~]│ │  └─────────────────┘  │
│ └─────────────────┘ │ └───────────────┘ │                       │
├─────────────────────┴───────────────────┴───────────────────────┤
│ 🐋 WHALE FEED (실시간)                                          │
│ SwissMiss bought LAL Win $25K @ 0.58 · 2min ago                │
│ primm sold BUF Win $12K @ 0.47 · 5min ago                      │
│ Marcus177 bought TOR Win $8K @ 0.33 · 8min ago                 │
└─────────────────────────────────────────────────────────────────┘
```

### Game Panel 상세

```
┌──────────────────────────────────┐
│ 🏀 LAL vs BOS                   │
│ Q3 4:32  Score: 82-76           │  ← 외부 스포츠 API
│ LeBron: 28pts 8reb (hot)        │  ← 주요 선수 스탯
│ Injury: Tatum questionable      │  ← 부상 정보
│──────────────────────────────────│
│ LAL Win: 0.62 ▲(+0.15)         │  ← Polymarket WebSocket
│ ┌────────────────────────────┐  │
│ │  오즈 변동 미니 차트        │  │  ← price_history API
│ │  (최근 30분, 1분 캔들)      │  │
│ │  고래 매수 포인트 마커 🐋   │  │
│ └────────────────────────────┘  │
│                                  │
│ 📊 Spread: 0.02  Vol: $1.2M    │  ← CLOB spread/book API
│ 🐋 Top: SwissMiss +$2.7M (LAL) │  ← Data API positions
│ 📈 Smart Money: 72% LAL        │  ← 계산: 상위 PnL 지갑 방향
│                                  │
│ Amount: [$100    ] Shares: 161  │
│ [BUY LAL 0.62] [BUY BOS 0.38]  │  ← CLOB POST /order
│ [+ Set TP/SL after buy]        │
└──────────────────────────────────┘
```

### Position Manager 상세 (우측 패널)

```
┌──────────────────────────────────┐
│ 📋 MY POSITIONS                  │
│──────────────────────────────────│
│ ┌──────────────────────────────┐ │
│ │ LAL Win                      │ │
│ │ 100 shares @ avg 0.45        │ │
│ │ Current: 0.62  PnL: +$17.00 │ │
│ │                              │ │
│ │ ⚡ TP/SL Settings            │ │
│ │ ┌──────────┬───────────────┐ │ │
│ │ │ Take     │ Price: [0.85] │ │ │
│ │ │ Profit   │ Sell:  [100%] │ │ │
│ │ │          │ Type: [Limit] │ │ │
│ │ ├──────────┼───────────────┤ │ │
│ │ │ Stop     │ Price: [0.40] │ │ │
│ │ │ Loss     │ Sell:  [100%] │ │ │
│ │ │          │ Type: [Market]│ │ │  ← FOK 오더로 즉시 체결
│ │ └──────────┴───────────────┘ │ │
│ │                              │ │
│ │ Status: 🟢 Monitoring        │ │  ← 서버가 WebSocket 감시 중
│ │ [EDIT] [CANCEL TP/SL] [SELL] │ │
│ └──────────────────────────────┘ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ KC Win                       │ │
│ │ 200 shares @ avg 0.30        │ │
│ │ Current: 0.55  PnL: +$50.00 │ │
│ │ TP: 0.80 | SL: 0.25         │ │
│ │ Status: 🟢 Monitoring        │ │
│ └──────────────────────────────┘ │
│                                  │
│ Total PnL: +$67.00              │
│ Active TP/SL: 4 orders          │
└──────────────────────────────────┘
```

---

## 핵심 기능 명세

### Feature 1: TP/SL Engine (킬 피처)

#### 작동 원리

```
[유저 브라우저]                    [우리 서버]                 [Polymarket]
     │                                │                           │
     │  1. TP: 0.85, SL: 0.40 설정   │                           │
     │ ──────────────────────────────> │                           │
     │                                │  2. WebSocket 구독         │
     │                                │ ─────────────────────────> │
     │                                │  3. price_change 수신      │
     │                                │ <───────────────────────── │
     │                                │                           │
     │                                │  (가격이 0.85 도달)        │
     │                                │  4. FOK SELL 주문 제출     │
     │                                │ ─────────────────────────> │
     │                                │  5. 체결 확인              │
     │  6. 알림: "LAL Win TP 체결"    │ <───────────────────────── │
     │ <────────────────────────────── │                           │
```

#### TP/SL 설정 옵션

| 파라미터 | 설명 | 기본값 |
|---------|------|-------|
| Trigger Price | TP/SL 트리거 가격 | - |
| Sell % | 보유 수량 중 몇 % 매도 | 100% |
| Order Type | Limit (지정가) / Market (FOK) | SL=Market, TP=Limit |
| Slippage | 마켓 오더 시 허용 슬리피지 | 2% |

#### 엣지 케이스 처리

| 상황 | 대응 |
|------|------|
| 유동성 부족으로 FOK 실패 | 가격 1% 양보 후 재시도 (최대 3회) → 실패 시 알림 |
| 서버 다운 | 서버 복구 시 즉시 현재가 체크 → 이미 트리거 조건 충족이면 실행 |
| 경기 종료 (마켓 resolve) | TP/SL 자동 해제, 마켓 정산 대기 |
| 가격 갭 (0.60→0.42 점프) | SL 0.45 설정이어도 0.42 시점에 트리거 |

**중요**: 스포츠 마켓은 경기 시작 시 리밋오더 자동 취소됨 → 라이브 중 TP/SL은 반드시 **마켓오더(FOK)** 기반으로 동작해야 함

### Feature 2: Multi-Game Live Panel

#### 데이터 소스 매핑

| UI 요소 | 데이터 소스 | 갱신 주기 |
|---------|-----------|----------|
| 스코어/쿼터/시간 | 외부 스포츠 API (ESPN/SportRadar) | 10초 |
| 오즈 (가격) | Polymarket WebSocket `price_change` | 실시간 |
| 오즈 차트 | Polymarket `price_history` + WebSocket | 실시간 |
| 거래량 | CLOB API `GET /book` | 30초 |
| 고래 거래 | Data API trades + 상위 지갑 목록 | 10초 |
| 부상/로스터 | 외부 스포츠 API | 5분 |
| Smart Money 방향 | Data API positions (상위 PnL 지갑) | 1분 |

#### Game Panel 기능
- 최대 6개 동시 모니터링
- 드래그로 패널 위치 변경
- 카테고리별 필터 (NBA/NFL/NHL/UFC/Soccer)
- "Today's Games" 자동 목록

### Feature 3: Whale Feed (하단 실시간 피드)

#### 구현 방식
1. 사전에 상위 PnL 지갑 100개 목록 구축 (Data API로 공개 조회)
2. 해당 지갑들의 거래를 10초 간격으로 폴링
3. $5K+ 거래만 필터링하여 피드에 표시

#### 표시 정보
```
🐋 SwissMiss (+$2.7M PnL) bought LAL Win
   $25,000 · 40,322 shares @ 0.62 · 2min ago
   [FOLLOW THIS TRADE →]
```

---

## Screen 2: Copy Dashboard (2순위)

```
┌─────────────────────────────────────────────────────────────┐
│ 🐋 TOP TRADERS LEADERBOARD          [Sports] [All] [Crypto]│
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ Rank     │ Trader   │ PnL      │ Win Rate │ Live Positions  │
├──────────┼──────────┼──────────┼──────────┼─────────────────┤
│ 1        │SwissMiss │ +$2.79M  │ 68%      │ 12 active       │
│ 2        │primm     │ +$2.58M  │ 71%      │ 8 active        │
│ 3        │Dropper   │ +$753K   │ 64%      │ 5 active        │
├──────────┴──────────┴──────────┴──────────┴─────────────────┤
│                                                             │
│ ▼ SwissMiss Detail                                         │
│ ┌─────────────────────────┬───────────────────────────────┐ │
│ │  LIVE POSITIONS          │  RECENT TRADES + ODDS IMPACT │ │
│ │                         │                               │ │
│ │  LAL Win: $25K (0.62)   │  ┌───────────────────────┐   │ │
│ │  KC Win: $15K (0.55)    │  │ [오즈 차트]            │   │ │
│ │  TOR Win: $8K (0.35)    │  │  ← 매수 시점 마커     │   │ │
│ │                         │  │  ← 오즈 변동 표시     │   │ │
│ │  [COPY ALL]             │  └───────────────────────────┘│ │
│ │  [COPY SINGLE: LAL Win] │  "매수 후 오즈 +0.04 상승"   │ │
│ └─────────────────────────┴───────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**기존 제품 대비 차별점:**
- 고래 매수 시점과 오즈 변동을 **한 차트에** 오버레이
- "이 고래가 샀더니 오즈가 이만큼 움직였다"를 시각적으로 보여줌
- 팔로워가 너무 많은 고래 경고 표시 (오즈 영향도 계산)

---

## 인증 UX 플로우

Polymarket은 OAuth가 없으므로 지갑 서명 기반 인증:

```
1. 유저가 "Connect Wallet" 클릭
2. WalletConnect / Phantom / MetaMask 팝업
3. EIP-712 메시지 서명 (API credential 생성용)
4. 서버가 API Key/Secret/Passphrase 수신
5. 이후 모든 거래는 서버가 HMAC-SHA256으로 대행

※ 유저의 Private Key는 절대 받지 않음
※ API credential만 서버에 저장 (암호화)
※ Read-only 모드도 지원 (지갑 주소만으로 포지션 조회)
```

---

## MVP 범위

### Phase 1 (MVP - 2주)

| 포함 | 제외 |
|------|------|
| 4-패널 라이브 오즈 차트 | 라이브 스코어 (수동 입력 or 링크) |
| TP/SL 엔진 (서버 사이드) | Copy Dashboard |
| 원클릭 매수/매도 | 봇 자동매매 |
| 기본 포지션 관리 | 모바일 최적화 |
| 고래 피드 (상위 20 지갑) | 부상/로스터 피드 |

### Phase 2 (검증 후 - 2주)

| 포함 |
|------|
| 외부 스포츠 API 연동 (라이브 스코어) |
| Copy Dashboard |
| 고래 100+ 지갑 추적 |
| Smart Money Indicator |
| 텔레그램 알림 연동 |

---

## 기술 스택

| 레이어 | 기술 | 이유 |
|--------|------|------|
| Frontend | Next.js + TailwindCSS | 빠른 개발, SSR |
| 차트 | Lightweight Charts (TradingView) | 금융 차트 표준, 무료 |
| 실시간 | Polymarket WebSocket + 자체 WebSocket | 클라이언트에 릴레이 |
| TP/SL 서버 | Node.js 상시 프로세스 | WebSocket 감시 + 주문 실행 |
| DB | PostgreSQL | TP/SL 설정, 유저 데이터 |
| 인증 | WalletConnect + ethers.js | 지갑 서명 기반 |
| 배포 | Vercel (프론트) + Railway (백엔드) | 빠른 배포 |

---

## 리스크 & 대응

| 리스크 | 심각도 | 대응 |
|--------|--------|------|
| TP/SL 서버 다운 시 주문 미실행 | **높음** | 다중 서버 + 헬스체크 + 복구 시 즉시 가격 체크 |
| Polymarket API 변경/차단 | 중간 | Builder 파트너 등록, API 버전 모니터링 |
| 유동성 부족으로 FOK 실패 | 중간 | 슬리피지 허용 + 재시도 로직 + 유저 알림 |
| 스포츠 마켓 리밋오더 자동취소 | **높음** | TP/SL을 리밋이 아닌 FOK로 실행 |
| 고래 지갑 목록 정확도 | 낮음 | Data API PnL 기반 주기적 갱신 |

---

## 고객 피드백 루프

1. **1주차**: TP/SL만 있는 미니멀 웹 출시 → PolyGun/Betmoar 커뮤니티에 공유
2. **피드백 수집**: 어떤 마켓 타입에서 TP/SL을 가장 많이 쓰는지 (스포츠? 크립토 5분? 지정학?)
3. **2주차**: 사용 데이터 기반으로 Live Odds Flow 추가 여부 결정
4. **핵심 메트릭**: DAU, TP/SL 설정 수, 자동 체결 성공률
