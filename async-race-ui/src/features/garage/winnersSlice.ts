import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../../app/store';
import { carApi } from '../../api/carApi';
import type { Car } from '../../types/index';

// Extended type to include full car details for the table view
export interface WinnerRow {
  id: number;
  wins: number;
  time: number;
  car?: Car;
}

interface WinnersState {
  winners: WinnerRow[];
  totalCount: number;
  page: number;
  sort: 'id' | 'wins' | 'time';
  order: 'asc' | 'desc'; 
  loading: boolean;
  error: string | null;
}

const initialState: WinnersState = {
  winners: [],
  totalCount: 0,
  page: 1,
  sort: 'id',
  order: 'asc',
  loading: false,
  error: null,
};

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setWinners: (state, action: PayloadAction<{ winners: WinnerRow[]; totalCount: number }>) => {
      state.winners = action.payload.winners;
      state.totalCount = action.payload.totalCount;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<{ sort: 'id' | 'wins' | 'time'; order: 'asc' | 'desc' }>) => {
      state.sort = action.payload.sort;
      state.order = action.payload.order;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setWinners, setPage, setSortOrder, setLoading, setError } = winnersSlice.actions;
export default winnersSlice.reducer;

// Thunk to fetch winners and concurrently load their name/color details
export const fetchWinners = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { page, sort, order } = getState().winners;
  dispatch(setLoading(true));
  try {
    // asc/desc
    const { winners, totalCount } = await carApi.getWinners(page, 10, sort, order);
    
    // Fetch detailed car specifications (name, color) for each winner row
    const extendedWinners = await Promise.all(
      winners.map(async (winner) => {
        try {
          const car = await carApi.getCar(winner.id);
          return { ...winner, car };
        } catch {
          // Fallback if a car was deleted from garage but persists in winners
          return { 
            ...winner, 
            car: { id: winner.id, name: `Unknown Car (ID: ${winner.id})`, color: '#cccccc' } 
          };
        }
      })
    );

    dispatch(setWinners({ winners: extendedWinners, totalCount }));
    dispatch(setError(null));
  } catch {
    dispatch(setError('Failed to load tournament winners.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk to handle saving or updating a winner when a race finishes
export const saveRaceWinnerAction = (id: number, time: number) => async (dispatch: AppDispatch) => {
  try {
    const existingWinner = await carApi.getWinner(id);
    
    if (existingWinner) {
      const updatedWins = existingWinner.wins + 1;
      // Keep the mathematically lowest time as the best score
      const bestTime = Math.min(existingWinner.time, time);
      await carApi.updateWinner(id, { wins: updatedWins, time: bestTime });
    } else {
      await carApi.createWinner({ id, wins: 1, time });
    }
    dispatch(fetchWinners());
  } catch (error) {
    console.error('Failed to update leaderboard database:', error);
  }
};