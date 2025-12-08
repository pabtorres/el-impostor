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

### v1.1.0 - Gameplay Enhancements & Resilience (December 2025)

#### New Features
- **Starting Player Indicator**: Shows which player should speak first each round
  - Players shuffled into random order at game start
  - Rotates through players each round for fair turn order
  - Configurable toggle in waiting room (admin can enable/disable)
- **Impostor Auto-Vote**: Impostor can click "Vote random" on themselves to cast a random vote
  - Prevents impostors from refusing to vote
  - Enables hidden voting strategy for impostors
- **DEV MODE: Quick Start**: Fast QA testing with auto-generated 3-player rooms with bot players
  - Bots auto-vote after 2 seconds
  - Skips manual card setup for rapid iteration
  - Limited to 3 test rooms max to prevent resource abuse
- **Admin Transition**: Auto-transfers admin rights when room creator disconnects
  - Next remaining player becomes admin
  - Prevents game from being stuck in "waiting for admin" state
  - Enables game continuation if players drop connection

#### Bug Fixes & Resilience Improvements
- **Fixed impostor self-vote rejection**: Backend now correctly handles impostor self-votes with random target assignment
- **Player order initialization**: Added safety check for rooms missing playerOrder (backward compatibility)
- **Dev mode stats initialization**: Fixed crash when creating test rooms without stats object
- **Admin disconnection handling**: Room now remains playable with automatic admin reassignment
- **Vote validation**: Improved vote processing order to prevent race conditions

#### QA & Testing Features
- **Comprehensive debug logging**: Added `[DEBUG]`, `[BOT]`, and `[ADMIN TRANSFER]` logs for tracing game state
- **Dev mode resource limits**: Maximum 3 concurrent test rooms to guard resources
- **Auto-cleanup enhanced**: Rooms clean up after 30 minutes of inactivity
- **Console visibility**: Frontend logs reveal component renders and room-state changes

#### UI/UX Improvements
- **Starting player display**: Blue info box showing current starting player during active rounds
- **Admin options panel**: Grouped game options in waiting room (currently: toggle starting player indicator)
- **Button responsiveness**: Improved card width (600px) for proper multi-button alignment
- **Feature toggles**: Players can customize gameplay experience (e.g., disable starting player indicator if preferred)

#### Performance & Stability
- **Reduced server memory pressure**: Dev mode room limit prevents uncontrolled growth
- **Faster QA iteration**: Bot players eliminate manual testing setup time
- **Backward compatibility**: Old rooms without new features continue to work seamlessly
- **Error handling**: Enhanced error messages and graceful fallbacks

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