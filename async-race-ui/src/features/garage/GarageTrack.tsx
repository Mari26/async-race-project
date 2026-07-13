import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import type { Car } from '../../types/index';
import { deleteCarAction, selectCarAction, startEngineAction, stopEngineAction } from './garageSlice';
import CarIcon from './../../components/CarIcon';

interface GarageTrackProps {
  car: Car;
}

export default function GarageTrack({ car }: GarageTrackProps) {
  const dispatch = useDispatch<AppDispatch>();

  const isDriving = car.engineStatus === 'drive';
  const isBroken = car.engineStatus === 'broken';
  const isFinished = car.engineStatus === 'finished';
  const isStarted = car.engineStatus === 'started' || isDriving || isBroken || isFinished;
  
  const carStyle = {
    transform: (isDriving || isBroken || isFinished) ? 'translateX(calc(100cqw - 65px))' : 'translateX(0px)',
    transition: isDriving ? `transform ${car.speed ? car.speed / 1000 : 0}s linear` : 'none',
    zIndex: 2,
  };

  return (
    <div className="row align-items-center border-bottom py-2 g-2 bg-secondary bg-opacity-10 position-relative mx-0">
      {/* Controls Column */}
      <div className="col-auto d-flex flex-column gap-1" style={{ minWidth: '140px' }}>
        <div className="d-flex gap-1">
          <button 
            className="btn btn-sm btn-outline-info flex-grow-1 py-0 px-1 text-nowrap" 
            style={{ fontSize: '11px' }}
            disabled={isStarted}
            onClick={() => dispatch(selectCarAction(car.id, car.name, car.color))}
          >
            Select
          </button>
          <button 
            className="btn btn-sm btn-outline-danger flex-grow-1 py-0 px-1 text-nowrap" 
            style={{ fontSize: '11px' }}
            disabled={isStarted}
            onClick={() => dispatch(deleteCarAction(car.id))}
          >
            Remove
          </button>
        </div>
        <div className="d-flex gap-1">
          <button 
            className="btn btn-sm btn-success py-0 px-2 fw-bold" 
            style={{ fontSize: '11px' }}
            disabled={isStarted}
            onClick={() => dispatch(startEngineAction(car.id))}
          >
            A
          </button>
          <button 
            className="btn btn-sm btn-secondary py-0 px-2 fw-bold" 
            disabled={car.engineStatus === 'stopped' || !car.engineStatus}
            onClick={() => dispatch(stopEngineAction(car.id))}
          >
            B
          </button>
        </div>
      </div>

      {/* Track and Car Column - Added d-block and width to ensure accurate container queries */}
      <div className="col position-relative lane-container d-flex align-items-center" style={{ minHeight: '45px', containerType: 'inline-size' }}>
        {/* Animated Car Icon Wrapper */}
        <div className="car-wrapper position-absolute start-0" style={carStyle}>
          <CarIcon color={car.color} width="65px" />
        </div>

        {/* Translucent Car Name Background */}
        <div className="fw-bold text-uppercase text-secondary tracking-wider fs-5 select-none opacity-25" style={{ zIndex: 1, paddingLeft: '75px' }}>
          {car.name}
        </div>
      </div>

      {/* Finish Line Column */}
      <div className="col-auto border-start border-danger border-3 h-100 d-flex align-items-center px-3 text-danger fw-bold fs-6 bg-dark bg-opacity-10 finish-line" style={{ minHeight: '45px' }}>
        FINISH
      </div>
    </div>
  );
}