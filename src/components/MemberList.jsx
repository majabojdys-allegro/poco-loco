import React from 'react';
import './MemberList.css';

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}.${ss}`;
}

export default function MemberList({ members, onToggle, currentSpeaker, timerSeconds, speakingTimes }) {
  return (
    <div className="member-list">
      <h2 className="member-list-title">Zespół</h2>
      <div className="member-tiles">
        {members.map((m) => {
          const isCurrentSpeaker = currentSpeaker?.id === m.id;
          const pastTime = speakingTimes.find((t) => t.id === m.id);

          return (
            <button
              key={m.id}
              className={[
                'member-tile',
                m.absent ? 'absent' : '',
                m.done ? 'done' : '',
                isCurrentSpeaker ? 'speaking' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => !m.done && onToggle(m.id)}
              disabled={m.done}
            >
              <span className="member-name">{m.name}</span>
              {isCurrentSpeaker && (
                <span className="member-timer live">{formatTime(timerSeconds)}</span>
              )}
              {pastTime && (
                <span className="member-timer done-time">{formatTime(pastTime.time)}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
