import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './app/store';
import { fetchCars, setPage } from './features/garage/garageSlice';
import GarageControls from './features/garage/GarageControls';
import GarageTrack from './features/garage/GarageTrack';
import WinnerModal from './features/garage/WinnerModal';
import WinnersTable from './features/garage/WinnersTable';

export default function App() {
  const [view, setView] = useState<'garage' | 'winners'>('garage');
  
  const dispatch = useDispatch<AppDispatch>();
  const { cars, loading, error, page, totalCount } = useSelector((state: RootState) => state.garage);

  useEffect(() => {
    if (view === 'garage') {
      dispatch(fetchCars());
    }
  }, [dispatch, page, view]);

  const CARS_PER_PAGE = 7;
  const totalPages = Math.ceil(totalCount / CARS_PER_PAGE);

  const handlePrevPage = () => {
    if (page > 1) dispatch(setPage(page - 1));
  };

  const handleNextPage = () => {
    if (page < totalPages) dispatch(setPage(page + 1));
  };

  return (
    <div className="container py-4">
      {/* Header Navigation */}
      <header className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
        <h1 className="h3 fw-bold text-primary mb-0">Async Race 🏎️</h1>
        <div className="btn-group" role="group" aria-label="Navigation views">
          <button
            type="button"
            className={`btn ${view === 'garage' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setView('garage')}
          >
            To Garage
          </button>
          <button
            type="button"
            className={`btn ${view === 'winners' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setView('winners')}
          >
            To Winners
          </button>
        </div>
      </header>

      {/* Dynamic View Content */}
      <main>
        {view === 'garage' ? (
          <div>
            <GarageControls />

            <div className="p-4 bg-light rounded-3 shadow-sm mb-4">
              <h2 className="fw-bold h4 mb-3">Garage Track</h2>
              
              {loading && <div className="text-info animate-pulse mb-3">Loading cars...</div>}
              {error && <div className="text-danger mb-3">{error}</div>}
              
              {!loading && !error && cars.length === 0 && (
                <div className="text-muted py-4 text-center">No Cars available in the garage.</div>
              )}

              {!loading && !error && cars.length > 0 && (
                <div className="d-flex flex-column bg-white p-2 rounded border">
                  {cars.map((car) => (
                    <GarageTrack key={car.id} car={car} />
                  ))}
                </div>
              )}

              {/* Pagination and Status Footer */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted small">
                  Page {page} of {totalPages || 1} • Total cars in garage: {totalCount}
                </div>
                
                {totalCount > CARS_PER_PAGE && (
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-outline-primary px-3"
                      disabled={page === 1 || loading}
                      onClick={handlePrevPage}
                    >
                      &larr; Prev
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary px-3"
                      disabled={page >= totalPages || loading}
                      onClick={handleNextPage}
                    >
                      Next &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <WinnersTable />
        )}

        <WinnerModal />
      </main>
    </div>
  );
}