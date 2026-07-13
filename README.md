# Score: 400/400
**Live Demo:** https://async-race-project.vercel.app

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
   git clone [https://github.com/Mari26/async-race-project.git](https://github.com/Mari26/async-race-project.git)


## Checklist

### 🚀 UI Deployment
- [x] **Deployment Platform:** Successfully deploy the UI on Vercel.

### ✅ Requirements to Commits and Repository
- [x] **Commit guidelines compliance:** All commits follow the specified Conventional Commits format.
- [x] **Checklist included in README.md:** Included and marked.
- [x] **Score calculation:** Mentors can see the self-assessment score at the top.
- [x] **UI Deployment link in README.md:** Placed at the top.

### 🚗 Functional Requirements

#### Basic Structure
- [x] **Two Views:** "Garage" and "Winners" views implemented.
- [x] **Garage View Content:** Displays creation/editing panel, race controls, and garage tracks.
- [x] **Winners View Content:** Displays leaderboard table and pagination.
- [x] **Persistent State:** View state, text inputs, and pagination numbers remain consistent between view switches.

#### Garage View
- [x] **CRUD Operations:** Cars can be created, updated, and deleted dynamically.
- [x] **Color Selection:** RGB palette integrated with the car icons.
- [x] **Random Car Creation:** Button to generate 100 random cars with random names and colors.
- [x] **Car Management Buttons:** Settings and deletion buttons next to each track.
- [x] **Pagination:** Garage section displays exactly 7 cars per page.
- [x] **Empty Garage Handle:** Friendly message shown when no cars are available.
- [x] **Empty Garage Page:** UI automatically falls back to the previous page if the last car on the current page is deleted.

#### 🏆 Winners View
- [x] **Display Winners:** Winning cars are automatically logged into the leaderboard database.
- [x] **Pagination for Winners:** Displays exactly 10 champions per page with navigation.
- [x] **Winners Table:** Contains #, Car Icon, Car Name, Wins count, and Best Time. Increments wins and updates to the best time if the car wins again.
- [x] **Sorting Functionality:** Full backend-driven sorting by Wins and Best Time in ascending/descending order.

#### 🚗 Race Animation
- [x] **Start Engine Animation:** Starts fluid car movement based on velocity endpoint; stops smoothly if a 500 server error occurs.
- [x] **Stop Engine Animation:** Returns the car to its initial starting line.
- [x] **Responsive Animation:** Fluids layout scales properly on screens down to 500px.
- [x] **Start Race Button:** Triggers concurrent race mode for all cars on the current page.
- [x] **Reset Race Button:** Returns all running cars back to the starting grid.
- [x] **Winner Announcement:** Displays a prominent success banner naming the fastest car.
- [x] **Button States:** Dynamic disabling/enabling of control buttons depending on the car's engine state.
- [x] **Actions during the race:** Safe constraints over UI controls during an active race session to maintain structural integrity.

#### 🎨 Prettier and ESLint Configuration
- [x] **Prettier Setup:** Integrated formatting scripts.
- [x] **ESLint Configuration:** Adheres to strict code patterns.