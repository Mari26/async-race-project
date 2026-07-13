import type { Car, EngineResponse, DriveResponse } from '../types/index';

const BASE_URL = 'http://localhost:3000';

export const carApi = {
  /**
   * Fetches a paginated list of cars from the garage.
   * @param page - The current page number.
   * @param limit - Number of items per page (defaults to 7 as per requirements).
   */
  getCars: async (page: number, limit = 7): Promise<{ cars: Car[]; totalCount: number }> => {
    const response = await fetch(`${BASE_URL}/garage?_page=${page}&_limit=${limit}`);
    const cars = await response.json();
    const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
    return { cars, totalCount };
  },

  /**
   * Creates a new car entry in the garage database.
   * @param car - Object containing the car's name and hex color code.
   */
  createCar: async (car: Omit<Car, 'id'>): Promise<Car> => {
    const response = await fetch(`${BASE_URL}/garage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car),
    });
    return response.json();
  },

  /**
   * Deletes a car from the garage database by its ID.
   * @param id - The unique identifier of the car.
   */
  deleteCar: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/garage/${id}`, { method: 'DELETE' });
  },

  /**
   * Updates an existing car's name and color.
   */
  async updateCar(id: number, car: { name: string; color: string }): Promise<Car> {
    const response = await fetch(`${BASE_URL}/garage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car),
    });
    if (!response.ok) throw new Error('Failed to update car');
    return response.json();
  },

  /**
   * Fetches a specific car by its ID.
   * Required to look up name and color for the winners list.
   */
  getCar: async (id: number): Promise<Car> => {
    const response = await fetch(`${BASE_URL}/garage/${id}`);
    if (!response.ok) throw new Error('Failed to fetch car details');
    return response.json();
  },

  /**
   * Toggles the car engine status between started and stopped.
   * @param id - The unique identifier of the car.
   * @param status - Engine status action ('started' or 'stopped').
   */
  toggleEngine: async (id: number, status: 'started' | 'stopped'): Promise<EngineResponse> => {
    const response = await fetch(`${BASE_URL}/engine?id=${id}&status=${status}`, { method: 'PATCH' });
    return response.json();
  },

  /**
   * Switches the engine into drive mode to start moving.
   * Throws an error if the server returns a 500 status (engine breakdown simulation).
   * @param id - The unique identifier of the car.
   * @param signal - An AbortSignal to cancel the request if necessary.
   */
  startDriveMode: async (id: number, signal?: AbortSignal): Promise<DriveResponse> => {
    const response = await fetch(`${BASE_URL}/engine?id=${id}&status=drive`, { 
      method: 'PATCH',
      signal 
    });
    
    if (response.status === 500) {
      throw new Error('Engine broken down');
    }
    
    return response.json();
  },

  /**
   * Fetches a paginated and sorted list of winners.
   * @param page - Current page number.
   * @param limit - Items per page (defaults to 10 for winners).
   * @param sort - Field to sort by ('id' | 'wins' | 'time').
   * @param order - Order direction ('asc' | 'desc').
   */
  getWinners: async (
    page: number, 
    limit = 10, 
    sort: 'id' | 'wins' | 'time' = 'id', 
    order: 'asc' | 'desc' = 'asc' 
  ): Promise<{ winners: { id: number; wins: number; time: number }[]; totalCount: number }> => {
    const response = await fetch(
      `${BASE_URL}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`
    );
    const winners = await response.json();
    const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
    return { winners, totalCount };
  },

  /**
   * Fetches a single winner record to check existence.
   */
  getWinner: async (id: number): Promise<{ id: number; wins: number; time: number } | null> => {
    const response = await fetch(`${BASE_URL}/winners/${id}`);
    if (response.status === 404) return null;
    return response.json();
  },

  /**
   * Creates a new winner record.
   */
  createWinner: async (winner: { id: number; wins: number; time: number }): Promise<void> => {
    await fetch(`${BASE_URL}/winners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winner),
    });
  },

  /**
   * Updates an existing winner's score and best time.
   */
  updateWinner: async (id: number, winner: { wins: number; time: number }): Promise<void> => {
    await fetch(`${BASE_URL}/winners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winner),
    });
  },

  /**
   * Deletes a winner record (needed when a car is removed from the garage).
   */
  deleteWinner: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/winners/${id}`, { method: 'DELETE' });
  }
};