import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { 
    setCreateFields, 
    setUpdateFields,
    startRaceAction,
    resetRaceAction, 
    createCarAction, 
    updateCarAction,
    generateCarsAction 
} from './garageSlice';

export default function GarageControls() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.garage);

  return (
    <div className="card p-3 mb-4 bg-white shadow-sm">
      {/* Create Row */}
      <div className="d-flex gap-2 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Car name"
          value={state.createName}
          onChange={(e) => dispatch(setCreateFields({ name: e.target.value, color: state.createColor }))}
        />
        <input
          type="color"
          className="form-control-color"
          value={state.createColor}
          onChange={(e) => dispatch(setCreateFields({ name: state.createName, color: e.target.value }))}
        />
        <button 
  className="btn btn-success px-4"
  onClick={() => dispatch(createCarAction())}
>
  Create
</button>
      </div>

      {/* Update Row */}
      <div className="d-flex gap-2 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Select a car to update"
          disabled={!state.selectedCarId}
          value={state.updateName}
          onChange={(e) => dispatch(setUpdateFields({ name: e.target.value, color: state.updateColor }))}
        />
        <input
          type="color"
          className="form-control-color"
          disabled={!state.selectedCarId}
          value={state.updateColor}
          onChange={(e) => dispatch(setUpdateFields({ name: state.updateName, color: e.target.value }))}
        />
        <button 
  className="btn btn-warning px-4" 
  disabled={!state.selectedCarId}
  onClick={() => dispatch(updateCarAction())}
>
  Update
</button>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-2 mb-md-0">
        <button 
    type="button" 
    className="btn btn-primary fw-bold px-4"
    onClick={() => dispatch(startRaceAction())}
>
      RACE
  </button>
  <button 
    type="button" 
    className="btn btn-secondary fw-bold px-4"
    onClick={() => dispatch(resetRaceAction())}
  >
    RESET
  </button>
        <button 
  className="btn btn-info text-white fw-bold" 
  onClick={() => dispatch(generateCarsAction())}
>
  GENERATE CARS
</button>
      </div>
    </div>
  );
}