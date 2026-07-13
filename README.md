# Async Race 🏎️

Welcome to the Async Race application! This is a frontend web application built with React, Redux Toolkit, and TypeScript, designed to manage a virtual garage, animate car races with simulated engine breakdowns, and maintain a tournament leaderboard.

## Features

- **Garage Management:** Add, update, and remove cars with custom names and colors.
- **Race Simulation:** Start and reset races for all cars on the track simultaneously with real-time UI animations.
- **Engine Control:** Individually start/stop car engines with breakdown safety handling (handling simulated 500 server errors).
- **Leaderboard (Winners View):** Keeps track of tournament winners, managing total wins and best times with server-side pagination and sorting capabilities.
- **Pagination:** Smooth 7-item pagination for the garage and 10-item pagination for the leaderboard.

## Tech Stack

- React.js (Vite)
- Redux Toolkit (State Management & Async Thunks)
- TypeScript
- Bootstrap (UI Styling)

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed, and the backend server running locally on `http://localhost:3000`.

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone <https://github.com/Mari26/async-race-project.git>