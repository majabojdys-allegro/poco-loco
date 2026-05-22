import React, { useRef, useEffect, useState } from 'react';
import './AudioPlayer.css';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.3);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = true;

    const tryPlay = () => {
      audio.play().then(() => setReady(true)).catch(() => {});
    };

    if (audio.readyState >= 2) {
      tryPlay();
    } else {
      audio.addEventListener('canplaythrough', tryPlay, { once: true });
    }

    return () => audio.removeEventListener('canplaythrough', tryPlay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const handleMute = () => {
    const newVol = volume > 0 ? 0 : 0.3;
    setVolume(newVol);
    if (audioRef.current) audioRef.current.volume = newVol;
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src="/assets/sounds/background.mp3" preload="auto" />
      <button className="mute-btn" onClick={handleMute} title={volume === 0 ? 'Włącz muzykę' : 'Wycisz'}>
        {volume === 0 ? '🔇' : volume < 0.4 ? '🔉' : '🔊'}
      </button>
      <input
        className="volume-slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolume}
        title={`Głośność: ${Math.round(volume * 100)}%`}
      />
    </div>
  );
}
