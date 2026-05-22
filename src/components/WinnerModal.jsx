import React from 'react';
import './WinnerModal.css';

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}.${ss}`;
}

export default function WinnerModal({ winner, allTimes, onReset }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-trophy">🏆</div>
        <h1 className="modal-title">The winner is</h1>
        <h2 className="modal-winner">{winner.name}</h2>
        <p className="modal-time">czas wypowiedzi: {formatTime(winner.time)}</p>

        <div className="modal-scores">
          <h3>Podsumowanie czasów</h3>
          <ul>
            {allTimes
              .slice()
              .sort((a, b) => b.time - a.time)
              .map((entry, i) => (
                <li key={entry.id} className={entry.id === winner.id ? 'winner-row' : ''}>
                  <span className="rank">{i + 1}.</span>
                  <span className="name">{entry.name}</span>
                  <span className="time">{formatTime(entry.time)}</span>
                </li>
              ))}
          </ul>
        </div>

        <button className="modal-reset-btn" onClick={onReset}>
          Nowa runda 🔄
        </button>
      </div>
    </div>
  );
}
