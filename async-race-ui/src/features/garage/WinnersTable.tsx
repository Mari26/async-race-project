import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchWinners, setPage, setSortOrder } from './winnersSlice';
import CarIcon from '../../components/CarIcon';

export default function WinnersTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { winners, totalCount, page, sort, order, loading, error } = useSelector(
    (state: RootState) => state.winners
  );

  useEffect(() => {
    dispatch(fetchWinners());
  }, [dispatch, page, sort, order]);

  const WINNERS_PER_PAGE = 10;
  const totalPages = Math.ceil(totalCount / WINNERS_PER_PAGE);

  const handleSort = (field: 'id' | 'wins' | 'time') => {
    if (sort === field) {
      // Toggle direction if clicking the same field
      dispatch(setSortOrder({ sort: field, order: order === 'ASC' ? 'DESC' : 'ASC' }));
    } else {
      // Default to ASC for a new field
      dispatch(setSortOrder({ sort: field, order: 'ASC' }));
    }
    dispatch(setPage(1)); // Reset to first page on sort
  };

  const renderSortIcon = (field: 'id' | 'wins' | 'time') => {
    if (sort !== field) return null;
    return order === 'ASC' ? ' 🔼' : ' 🔽';
  };

  return (
    <div className="p-4 bg-light rounded-3 shadow-sm">
      <h2 className="fw-bold h4 mb-3">Leaderboard Database</h2>

      {loading && <div className="text-info mb-3">Updating podium data...</div>}
      {error && <div className="text-danger mb-3">{error}</div>}

      {!loading && winners.length === 0 && (
        <div className="text-muted py-4 text-center">No champions recorded yet. Run a race to clear the garage tracks!</div>
      )}

      {winners.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover bg-white border align-middle">
            <thead className="table-dark">
              <tr>
                <th style={{ width: '80px' }}>#</th>
                <th style={{ width: '120px' }}>Car Icon</th>
                <th>Car Name</th>
                <th 
                  className="user-select-none" 
                  style={{ cursor: 'pointer', width: '150px' }} 
                  onClick={() => handleSort('wins')}
                >
                  Wins{renderSortIcon('wins')}
                </th>
                <th 
                  className="user-select-none" 
                  style={{ cursor: 'pointer', width: '180px' }} 
                  onClick={() => handleSort('time')}
                >
                  Best Time (s){renderSortIcon('time')}
                </th>
              </tr>
            </thead>
            <tbody>
              {winners.map((row, index) => {
                const globalIndex = (page - 1) * WINNERS_PER_PAGE + index + 1;
                return (
                  <tr key={row.id}>
                    <td className="fw-bold text-secondary">{globalIndex}</td>
                    <td>
                      <CarIcon color={row.car?.color || '#cccccc'} width="50px" />
                    </td>
                    <td className="fw-bold text-uppercase text-dark">
                      {row.car?.name || `Unknown Car (ID: ${row.id})`}
                    </td>
                    <td>
                      <span className="badge bg-primary fs-6 px-3">{row.wins}</span>
                    </td>
                    <td className="font-monospace fw-bold text-success">
                      {(row.time / 1000).toFixed(2)}s
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted small">
          Page {page} of {totalPages || 1} • Total records: {totalCount}
        </div>

        {totalCount > WINNERS_PER_PAGE && (
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-primary px-3"
              disabled={page === 1 || loading}
              onClick={() => dispatch(setPage(page - 1))}
            >
              &larr; Prev
            </button>
            <button
              className="btn btn-sm btn-outline-primary px-3"
              disabled={page >= totalPages || loading}
              onClick={() => dispatch(setPage(page + 1))}
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}