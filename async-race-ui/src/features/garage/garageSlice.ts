import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GarageState, Car } from '../../types/index';
import type { AppDispatch, RootState } from '../../app/store';
import { carApi } from '../../api/carApi';
import { saveRaceWinnerAction } from './winnersSlice';

const abortControllers: Record<number, AbortController> = {};

const initialState: GarageState = {
  cars: [],
  totalCount: 0,
  page: 1,
  loading: false,
  error: null,
  createName: '',
  createColor: '#000000',
  updateName: '',
  updateColor: '#000000',
  selectedCarId: null,
  raceWinner: null, 
  isRaceActive: false,
};

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setCars: (state, action: PayloadAction<{ cars: Car[]; totalCount: number }>) => {
      state.cars = action.payload.cars;
      state.totalCount = action.payload.totalCount;
    },
    setRaceWinner: (state, action: PayloadAction<string | null>) => {
      state.raceWinner = action.payload;
    },
    setRaceActive: (state, action: PayloadAction<boolean>) => {
      state.isRaceActive = action.payload;
    },
    updateCarEngine: (state, action: PayloadAction<{ id: number; status: 'started' | 'stopped' | 'drive' | 'broken' | 'finished'; speed?: number }>) => {
      const car = state.cars.find(c => c.id === action.payload.id);
      if (car) {
        car.engineStatus = action.payload.status;
        if (action.payload.speed !== undefined) {
          car.speed = action.payload.speed;
        }
      }
    },
    resetAllEngines: (state) => {
      state.cars.forEach(car => {
        car.engineStatus = 'stopped';
        car.speed = 0;
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setCreateFields: (state, action: PayloadAction<{ name: string; color: string }>) => {
      state.createName = action.payload.name;
      state.createColor = action.payload.color;
    },
    setUpdateFields: (state, action: PayloadAction<{ name: string; color: string }>) => {
     state.updateName = action.payload.name;
     state.updateColor = action.payload.color;
  },
    selectCar: (state, action: PayloadAction<Car | null>) => {
      if (action.payload) {
        state.selectedCarId = action.payload.id;
        state.updateName = action.payload.name;
        state.updateColor = action.payload.color;
      } else {
        state.selectedCarId = null;
        state.updateName = '';
        state.updateColor = '#000000';
      }
    },
  },
});

export const {
  setCars,
  setLoading,
  setError,
  setPage,
  setCreateFields,
  setUpdateFields,
  selectCar,
  updateCarEngine,
  resetAllEngines,
  setRaceWinner,
  setRaceActive,
} = garageSlice.actions;

export default garageSlice.reducer;

export const fetchCars = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { page } = getState().garage;
  dispatch(setLoading(true));
  try {
    const data = await carApi.getCars(page);
    dispatch(setCars(data));
    dispatch(setError(null));
  } catch {
    dispatch(setError('Failed to fetch cars from server.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createCarAction = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { createName, createColor } = getState().garage;
  const trimmedName = createName.trim();

  if (!trimmedName || trimmedName.length > 20) {
    alert('Invalid car name! (Must be 1-20 characters)');
    return;
  }

  try {
    await carApi.createCar({ name: trimmedName, color: createColor });
    dispatch(setCreateFields({ name: '', color: '#000000' }));
    dispatch(fetchCars());
  } catch {
    dispatch(setError('Failed to create a new car.'));
  }
};

export const deleteCarAction = (id: number) => async (dispatch: AppDispatch) => {
  try {
    await carApi.deleteCar(id);
    dispatch(fetchCars());
  } catch {
    dispatch(setError('Failed to delete the car.'));
  }
};

export const selectCarAction = (id: number, name: string, color: string) => (dispatch: AppDispatch) => {
  dispatch(selectCar({ id, name, color }));
};

export const updateCarAction = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { selectedCarId, updateName, updateColor } = getState().garage;
  if (!selectedCarId) return;

  const trimmedName = updateName.trim();
  if (!trimmedName) {
    alert('Car name cannot be empty!');
    return;
  }

  try {
    await carApi.updateCar(selectedCarId, { name: trimmedName, color: updateColor });
    dispatch(selectCar(null));
    dispatch(fetchCars());
  } catch {
    dispatch(setError('Failed to update the car.'));
  }
};

export const startEngineAction = (id: number) => async (dispatch: AppDispatch) => {
  try {
    if (abortControllers[id]) abortControllers[id].abort();
    const controller = new AbortController();
    abortControllers[id] = controller;

    const { velocity, distance } = await carApi.toggleEngine(id, 'started');
    const speed = distance / velocity; 
    
    dispatch(updateCarEngine({ id, status: 'started', speed }));
    dispatch(updateCarEngine({ id, status: 'drive' }));
    
    const driveStatus = await carApi.startDriveMode(id, controller.signal);
    
    if (driveStatus && driveStatus.success) {
      dispatch(updateCarEngine({ id, status: 'finished' }));
    } else {
      dispatch(updateCarEngine({ id, status: 'broken' }));
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') return;
    dispatch(updateCarEngine({ id, status: 'broken' }));
  } finally {
    delete abortControllers[id];
  }
};

export const stopEngineAction = (id: number) => async (dispatch: AppDispatch) => {
  try {
    if (abortControllers[id]) {
      abortControllers[id].abort();
      delete abortControllers[id];
    }
    await carApi.toggleEngine(id, 'stopped');
    dispatch(updateCarEngine({ id, status: 'stopped', speed: 0 }));
  } catch {
    dispatch(setError('Failed to stop the engine.'));
  }
};

export const startRaceAction = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { cars, isRaceActive } = getState().garage;
  if (isRaceActive) return;

  const hasActiveCars = cars.some(car => car.engineStatus && car.engineStatus !== 'stopped');
  if (hasActiveCars) return;

  dispatch(setRaceWinner(null));
  dispatch(setRaceActive(true));
  
  const racePromises = cars.map(car => dispatch(startEngineAction(car.id)));
  
  await Promise.all(racePromises);

  const currentStore = getState().garage;
  if (!currentStore.isRaceActive) return;

  const finishedCars = currentStore.cars.filter(car => car.engineStatus === 'finished');

  if (finishedCars.length > 0) {
    const winnerCar = finishedCars.reduce((min, current) => 
      (current.speed || Infinity) < (min.speed || Infinity) ? current : min, 
      finishedCars[0]
    );

    const timeInSeconds = ((winnerCar.speed || 0) / 1000).toFixed(2);
    dispatch(setRaceWinner(`${winnerCar.name} went first (${timeInSeconds}s)!`));
    dispatch(saveRaceWinnerAction(winnerCar.id, winnerCar.speed || 0));
  }

  dispatch(setRaceActive(false));
};

export const resetRaceAction = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const { cars } = getState().garage;

  dispatch(setRaceActive(false));
  dispatch(setRaceWinner(null));
  dispatch(resetAllEngines());

  cars.forEach(car => {
    if (abortControllers[car.id]) {
      abortControllers[car.id].abort();
      delete abortControllers[car.id];
    }
    dispatch(stopEngineAction(car.id));
  });
};

export const generateCarsAction = () => async (dispatch: AppDispatch) => {
  const brands = ['Tesla', 'BMW', 'Mercedes', 'Audi', 'Toyota', 'Ford', 'Porsche', 'Chevrolet', 'Hyundai', 'Lexus'];
  const models = ['Model S', 'X5', 'E-Class', 'A6', 'Camry', 'Mustang', '911 Carrera', 'Corvette', 'Elantra', 'RX'];

  dispatch(setLoading(true));

  try {
    for (let i = 0; i < 10; i++) {
      const chunkPromises = Array.from({ length: 10 }).map(() => {
        const randomBrand = brands[Math.floor(Math.random() * brands.length)];
        const randomModel = models[Math.floor(Math.random() * models.length)];
        const name = `${randomBrand} ${randomModel}`;
        const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        
        return carApi.createCar({ name, color });
      });

      await Promise.all(chunkPromises);
    }

    dispatch(fetchCars());
  } catch {
    dispatch(setError('Failed to generate cars.'));
  } finally {
    dispatch(setLoading(false));
  }
};