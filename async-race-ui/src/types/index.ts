// 1. Base model representing a single car object in the garage
export interface Car {
  id: number;
  name: string;
  color: string;
  engineStatus?: 'started' | 'stopped' | 'drive' | 'broken' |'finished'; 
  speed?: number;
}

// 2. Server response structure when starting or stopping a car engine
export interface EngineResponse {
  velocity: number;
  distance: number;
}

// 3. Server response structure for the continuous engine drive mode
export interface DriveResponse {
  success: boolean;
}

// 4. Winner model representing data for the Winners view table
export interface Winner {
  id: number;
  wins: number;
  time: number;
  car?: Car; // Optional relation to include car details (name and color) inside the table
}

// 5. Global state interface for the Redux slice to persist view states
export interface GarageState {
  cars: Car[];
  totalCount: number;
  page: number;
  loading: boolean;
  error: string | null;
  // Form control states to ensure inputs do not reset when switching between views
  createName: string;
  createColor: string;
  updateName: string;
  updateColor: string;
  selectedCarId: number | null;
  raceWinner: string | null; isRaceActive: boolean;
}