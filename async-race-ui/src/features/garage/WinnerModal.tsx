import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { setRaceWinner } from './garageSlice';

export default function WinnerModal() {
  const dispatch = useDispatch<AppDispatch>();
  const raceWinner = useSelector((state: RootState) => state.garage.raceWinner);

  if (!raceWinner) return null;

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1} 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow bg-white text-dark rounded-3">
          <div className="modal-body p-5 text-center">
            <div className="display-3 mb-2 text-warning">🏆</div>
            
            <h3 className="h4 fw-bold text-dark mb-3">Race Finished!</h3>
            
            <p className="fs-5 text-primary fw-bold bg-primary bg-opacity-10 py-3 px-4 rounded border border-primary border-opacity-25 mb-4">
              {raceWinner}
            </p>
            
            <button 
              type="button" 
              className="btn btn-outline-secondary px-5 fw-bold"
              onClick={() => dispatch(setRaceWinner(null))}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}