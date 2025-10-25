# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered stock market simulation game built with React + TypeScript + Vite. Players analyze real-time stock data and select which stock they think will perform best. The simulation uses geometric Brownian motion to generate realistic price movements.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (runs TypeScript compiler and Vite build)
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture

### State Management

The application uses **Zustand** for state management with two main stores:

- **`useMarketStore`** (`src/hooks/useMarketStore.ts`): Central state for all market data
  - Manages 5 stocks (SCM, TPL, HSC, HFN, HSG) with price history and real-time metrics
  - Stock mappings: SCM=성규 화학, TPL=태호 석유, HSC=효림 시큐리티, HFN=현빈 금융, HSG=한스타그램
  - Stores: `assets`, `tickMs`, `maxHistory`
  - Key actions: `setAsset()`, `pushPrice()`, `resetAll()`
  - Each asset tracks: price, drift, volatility, history (up to 600 points), and computed metrics (returnPct, volatility, drawdown, efficiency, riskEfficiency)

- **`useNewsStore`** (`src/store/useNewsStore.ts`): Manages news events
  - Stores: `currentEvent`, `newsHistory`, tracking active and past news
  - Key actions: `setCurrentEvent()`, `addToHistory()`, `updateHistoryTime()`
  - Integrates with event scheduler to manage market-moving news

### Market Simulation Engine

Located in `src/engine/marketEngine.ts`:

- Uses **geometric Brownian motion** (GBM): `dS = S*(μ*dt + σ*sqrt(dt)*N(0,1))`
- Updates every 500ms (`tickMs`) via `setInterval`
- Price changes are clamped to ±20% per tick to prevent unrealistic jumps
- `startEngine()` and `stopEngine()` control the simulation loop

### Game Flow (4 Phases)

Managed in `src/App.tsx`:

1. **analysis**: Player analyzes stock charts and AI reports (initial state)
2. **thinking**: 3-second countdown after player clicks "예측 확정하기", must select a stock
3. **evaluating**: 10-second evaluation period where prices continue to move
4. **result**: Show scoring results comparing all stocks' performance

Phase transitions are countdown-driven. Selection timing is captured in `evalStartPrices` and `evalStartLens` to measure performance from that exact moment.

### Analysis & Scoring

- **`src/engine/analysis.ts`**: Provides real-time insights for each stock
  - Computes momentum, volatility, drawdown over last 40 data points
  - Generates signals: "매수우세" (buy), "중립" (neutral), "경계" (caution)
  - Risk levels: "낮음" (low), "보통" (normal), "높음" (high)

- **`src/engine/skillScorer_temp.ts`**: Post-selection performance scoring
  - Calculates comprehensive metrics: returnPct, volatilityPct, maxDrawdownPct, trendStability, efficiency, riskAdjusted
  - Computes weighted score combining return (0.4x), risk-adjusted return (20x), trend stability (20x), efficiency (25x), and drawdown penalty
  - Returns sorted array by score (highest first)

### UI Components

Key components in `src/components/`:

- **`TickerCard`**: Stock card showing name, price ($), and performance badge
- **`ChartPanel`**: Line chart using Chart.js/react-chartjs-2
- **`AiReportBox`**: Displays AI-generated insights from `analyzeAsset()`
- **`NewsBoard`**: Live news feed with event history and stock comments
- **`LiveRanking`**: Shows real-time leaderboard during evaluation phase
- **`ResultPopup`**: Modal showing final scores and metrics breakdown
- **`HelpPanel`**: Instructions for the game

### Styling

- **Tailwind CSS** for styling (config: `tailwind.config.js`)
- **Framer Motion** for animations
- Custom animation classes in `tailwind.config.js`:
  - `animate-fade-in` / `animate-fade-out`: Smooth opacity transitions for popups
  - `animate-bg-transition`: Background color change during evaluation phase
  - `animate-glow`: Yellow glow effect for emphasis

## Key Technical Details

### Stock Data Structure

Each stock (Asset) contains:
- Static: `key`, `name`, `baseDrift`, `baseVol`
- Dynamic: `price`, `drift`, `vol`, `history[]`
- Computed: `returnPct`, `volatility`, `drawdown`, `efficiency`, `riskEfficiency`

Metrics are recalculated on every `pushPrice()` call using the full history window.

### Price History Management

- History is trimmed to `maxHistory` (600 points = 5 minutes at 500ms tick rate)
- Initial history is pre-filled with 120 copies of starting price
- New prices are appended and old ones removed to maintain fixed window

### News & Event System

**Event Scheduler** (`src/logic/eventScheduler.ts`):
- Defines 12 news event templates with varying impacts on different stocks
- Events randomly occur every 15-45 seconds during gameplay
- Each event has a duration and specific impact ranges (%) on stock drift values
- `applyNewsEvent()` temporarily modifies stock drift, `removeNewsEvent()` restores original values

**Stock Comments** (`src/logic/stockComments.ts`):
- Contains stock-specific Korean comments that appear with news events
- Two types: normal comments (평상시 멘트) and event-specific reactions
- Each stock has unique personality through these comments

**NewsBoard Component** (`src/components/NewsBoard.tsx`):
- Displays live news feed in a list format (positioned below stock grid, 2-column width)
- Shows news title, time elapsed, affected stocks, and relevant stock comments
- Maintains history of last 10 news events with real-time countdown updates

## TypeScript Configuration

- Uses TypeScript 5.9.3
- App code: `tsconfig.app.json` (React, DOM, ES2020)
- Tooling: `tsconfig.node.json` (for Vite config)
- Project references configured in root `tsconfig.json`

## Important Implementation Notes

### Ticker Key Consistency
- **Always use the correct TickerKey type**: `"SCM" | "TPL" | "HSC" | "HFN" | "HSG"`
- DO NOT use old ticker names (WTM, BGE, CSI, SHG, MWS) - these will cause TypeScript errors
- When adding news events or comments, ensure ticker keys match exactly

### Korean Text Encoding
- All Korean text in UI is intentional (game is in Korean)
- Stock comments in `stockComments.ts` use Korean with casual/humorous tone
- File encoding issues: If Korean text appears corrupted, the file may need to be rewritten
- Avoid mixing English and Korean in comment strings when possible

### News System Timing
- News events occur randomly every 15-45 seconds
- Event durations are defined per template (5-60 seconds)
- News affects stock drift temporarily - always restore with `removeNewsEvent()`
- News history is limited to 10 items to prevent memory issues

### UI Layout
- NewsBoard occupies 2 grid columns (`col-span-2`) within the stock grid
- Selection popup uses fade-in/out animations with 2-second display time
- "예측 확정하기" button shows 3-second thinking phase, then 10-second evaluation
