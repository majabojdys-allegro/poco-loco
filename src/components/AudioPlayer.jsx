import React, { useRef, useEffect, useState } from 'react';
import './AudioPlayer.css';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.3);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  // Start music on first user interaction anywhere on the page
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!started && audioRef.current) {
        audioRef.current.volume = volume;
        audioRef.current.play().then(() => {
          setPlaying(true);
          setStarted(true);
        }).catch(() => {});
      }
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    return () => document.removeEventListener('click', handleFirstInteraction);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => {
        setPlaying(true);
        setStarted(true);
      }).catch(() => {});
    }
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}assets/sounds/background.mp3`} loop preload="auto" />
      <button className="mute-btn" onClick={togglePlay} title={playing ? 'Pauza' : 'Odtwórz muzykę'}>
        {!playing ? '▶️' : volume === 0 ? '🔇' : volume < 0.4 ? '🔉' : '🔊'}
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
