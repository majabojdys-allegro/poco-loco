import React from 'react';
import './Timer.css';

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}.${ss}`;
}

export default function Timer({ seconds, speakerName }) {
  return (
    <div className="timer">
      <div className="timer-speaker">{speakerName || '—'}</div>
      <div className="timer-display">{formatTime(seconds)}</div>
      <div className="timer-label">czas wypowiedzi</div>
    </div>
  );
}
