import React, { useState, useCallback, useRef } from 'react';
import { INITIAL_MEMBERS } from './constants/members';
import Wheel from './components/Wheel';
import MemberList from './components/MemberList';
import WinnerModal from './components/WinnerModal';
import AudioPlayer from './components/AudioPlayer';
import SugarSkull from './components/SugarSkull';
import { useTimer } from './hooks/useTimer';
import './App.css';

export default function App() {
  const [members, setMembers] = useState(
    INITIAL_MEMBERS.map((m) => ({ ...m, absent: false, done: false }))
  );
  const [phase, setPhase] = useState('idle'); // 'idle' | 'spinning' | 'speaking' | 'finished'
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [speakingTimes, setSpeakingTimes] = useState([]);
  const [showWinner, setShowWinner] = useState(false);

  const { reset: resetTimer, getElapsed } = useTimer(
    phase === 'speaking',
    setTimerSeconds
  );

  const activeMembers = members.filter((m) => !m.absent && !m.done);

  const handleSpinEnd = useCallback(
    (winner) => {
      setCurrentSpeaker(winner);
      setPhase('speaking');
      resetTimer();
    },
    [resetTimer]
  );

  const handleSpin = useCallback(() => {
    if (phase === 'speaking' && currentSpeaker) {
      // Record time for current speaker
      const elapsed = getElapsed();
      const updatedTimes = [
        ...speakingTimes,
        { id: currentSpeaker.id, name: currentSpeaker.name, time: elapsed },
      ];
      setSpeakingTimes(updatedTimes);

      // Mark member as done
      const updatedMembers = members.map((m) =>
        m.id === currentSpeaker.id ? { ...m, done: true } : m
      );
      setMembers(updatedMembers);
      setCurrentSpeaker(null);
      setTimerSeconds(0);

      const remaining = updatedMembers.filter((m) => !m.absent && !m.done);
      if (remaining.length === 0) {
        setPhase('finished');
        setShowWinner(true);
        return;
      }
    }

    // Trigger the wheel to spin
    setPhase('spinning');
    setSpinTrigger((t) => t + 1);
  }, [phase, currentSpeaker, speakingTimes, members, getElapsed]);

  const handleToggleAbsent = useCallback((id) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id && !m.done ? { ...m, absent: !m.absent } : m))
    );
  }, []);

  const handleReset = useCallback(() => {
    setMembers(INITIAL_MEMBERS.map((m) => ({ ...m, absent: false, done: false })));
    setPhase('idle');
    setIsSpinning(false);
    setCurrentSpeaker(null);
    setTimerSeconds(0);
    setSpeakingTimes([]);
    setShowWinner(false);
  }, []);

  const winnerData = React.useMemo(() => {
    if (speakingTimes.length === 0) return null;
    return speakingTimes.reduce((best, cur) => (cur.time > best.time ? cur : best));
  }, [speakingTimes]);

  const isLastSpeaker = phase === 'speaking' && activeMembers.length === 1;

  const getButtonLabel = () => {
    if (isSpinning) return 'Spinning...';
    if (phase === 'speaking') return isLastSpeaker ? 'Finish!' : 'Spin next!';
    return 'Spin!';
  };

  const isButtonDisabled = isSpinning || activeMembers.length === 0;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <img src="/assets/images/skull1.png" className="title-skull title-skull-left" alt="skull" />
          <span className="title-space"> </span>
          <span className="l0">P</span>
          <span className="l1">O</span>
          <span className="l2">C</span>
          <span className="l3">O</span>
          <span className="title-space"> </span>
          <span className="l4">L</span>
          <span className="l5">O</span>
          <span className="l6">C</span>
          <span className="l7">O</span>
          <span className="title-space"> </span>
          <img src="/assets/images/skull1.png" className="title-skull title-skull-right" alt="skull" />
        </h1>
        <div className="audio-corner">
          <AudioPlayer />
        </div>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <MemberList
            members={members}
            onToggle={handleToggleAbsent}
            currentSpeaker={currentSpeaker}
            timerSeconds={timerSeconds}
            speakingTimes={speakingTimes}
          />
        </div>

        <div className="center-panel">
          <Wheel
            members={activeMembers}
            onSpinEnd={handleSpinEnd}
            spinTrigger={spinTrigger}
            setIsSpinning={setIsSpinning}
            currentSpeaker={currentSpeaker}
          />

          <div className="controls">
            {activeMembers.length === 0 && phase === 'idle' && (
              <p className="hint">Wszyscy są nieobecni lub skończyli wypowiedź.</p>
            )}
            {phase !== 'finished' && (
              <button
                className="spin-btn"
                onClick={handleSpin}
                disabled={isButtonDisabled}
              >
                {getButtonLabel()}
              </button>
            )}
          </div>
        </div>

        {/* Empty right column to balance the grid */}
        <div className="right-panel" />
      </main>

      {showWinner && winnerData && (
        <WinnerModal
          winner={winnerData}
          allTimes={speakingTimes}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
