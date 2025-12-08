# el-impostor

<img src="./frontend/public/images/main-page-image-2.jpg" alt="El Impostor" width="300" />

A real-time multiplayer game where players identify the impostor using Socket.io and React.

## Setup & Installation

### Prerequisites
- Node.js 16+ installed

### Backend Setup
```bash
cd backend
npm install
npm start
```
The server will run on `http://localhost:4000`

### Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
The frontend will automatically open at `http://localhost:5173`

## How to Play
1. Create a room with a name and list the cards (one per line) - must match number of players
2. Other players join the room using the same Room ID and their name
3. Start a round - each player gets the same card, but one is randomly selected as the impostor
4. Vote to identify who you think is the impostor
5. The player with the most votes is eliminated - check if they were the impostor!
6. Continue for multiple rounds

## Architecture
- **Backend**: Express + Socket.io for real-time game state management
- **Frontend**: React + TypeScript + Vite for fast development
- **Communication**: WebSocket-based bidirectional communication

## Project Evolution & Knowledge Base

### v1.0.0 - Full Release (December 2025)

#### Core Features Implemented
- **Real-time Multiplayer Gaming**: Socket.io integration for instant game state synchronization
- **Awards System**: 
  - Most Detected Impostor (player who identified the most impostors)
  - Most Undetected Impostor (impostor with most successful rounds)
  - Top Detective (player with most correct votes)
- **Game Statistics**: Win/loss tracking, round history, per-player stats
- **About Page**: Project information with easter egg
- **Instructions Page**: Comprehensive how-to-play guide with game rules and mechanics
- **Favicon Integration**: Custom branding with favicon.ico support

#### Deployment & Infrastructure
- **Custom Domain**: el-impostor.ptorresg.cl (frontend) and el-impostor-api.ptorresg.cl (backend)
- **DNS Configuration**: Cloudflare CNAME records for domain routing
- **Hosting**: Railway platform for backend and frontend deployment
- **Local Development**: Environment detection in config.js (localhost:4000 for local, HTTPS for production)

#### State Management & Bug Fixes
- **ChangeNotifier Pattern**: Replaced callback-based state with Provider ChangeNotifier for reliable event handling
- **Socket.io Synchronization**: Fixed round-start event propagation where impostors' cards weren't displaying to the correct player
- **Vote Update Sync**: Ensured all players receive vote count updates in real-time without race conditions
- **Room Auto-Cleanup**: 5-minute interval cleanup with 30-minute inactivity timeout for orphaned rooms

#### Frontend Features
- **Two-row Button Layout**: Organized game navigation with increased card width for proper alignment
- **Dynamic Routing**: View management for Lobby, Instructions, About, Game, EndGame screens
- **Image Assets**: Placeholder system for game images and statistics visualization
- **Configuration System**: Runtime backend URL detection via config.js

#### Technical Stack
- **Backend**: Node.js v18+ with Express 4.18.2 and Socket.io 4.7.2
- **Web Frontend**: React 18.2 with TypeScript 5.1 and Vite 5.0 (HMR for fast development)
- **Communication**: WebSocket bidirectional communication with automatic reconnection
- **Database**: In-memory room storage with auto-cleanup mechanism

#### Testing & Validation
- ✅ Backend Socket.io event handling (create-room, join-room, submit-cards, start-game, start-next-round, vote, end-round, end-game)
- ✅ Awards calculation across multiple rounds
- ✅ Easter eggs functioning
- ✅ Domain DNS propagation and HTTPS routing
- ✅ Cross-device multiplayer gameplay (web, mobile, desktop)
- ✅ Favicon display on localhost and production

### Development Workflow
- **Local Backend**: `cd backend && npm install && npm start` (runs on :4000)
- **Local Frontend**: `cd frontend && npm install && npm run dev` (runs on :5173 with HMR)
- **Production Deployment**: Push to main branch triggers automatic Railway deployment

## Support the Project
If you like the project, you can support it by inviting me a **Limonada Menta Jengibre**:

[Buy a "Limonada Menta Jengibre"](https://buymeacoffee.com/pabtorres)