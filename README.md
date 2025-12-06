# el-impostor

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

## Support the Project
If you like the project, you can support it by inviting me a **Limonada Menta Jengibre**:

[Buy a "Limonada Menta Jengibre"](https://buymeacoffee.com/pabtorres)