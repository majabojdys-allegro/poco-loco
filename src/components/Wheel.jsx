import React, { useRef, useEffect, useCallback } from 'react';
import { SEGMENT_COLORS } from '../constants/members';
import './Wheel.css';

const WHEEL_SIZE = 440;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = CENTER - 16;

function drawWheel(canvas, members, currentAngle) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

  const n = members.length;
  if (n === 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Brak uczestników', CENTER, CENTER);
    return;
  }

  const arc = (Math.PI * 2) / n;

  members.forEach((member, i) => {
    const startAngle = currentAngle + i * arc;
    const endAngle = startAngle + arc;
    const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];

    ctx.beginPath();
    ctx.moveTo(CENTER, CENTER);
    ctx.arc(CENTER, CENTER, RADIUS, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(CENTER, CENTER);
    ctx.rotate(startAngle + arc / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const fontSize = n <= 4 ? 18 : n <= 6 ? 15 : 13;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 5;

    ctx.fillText(member.name, RADIUS - 18, 0, RADIUS * 0.7);
    ctx.restore();
  });

  // Center circle
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, 24, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1a2e';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(CENTER, CENTER, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd700';
  ctx.fill();
}

export default function Wheel({ members, onSpinEnd, spinTrigger, setIsSpinning }) {
  const canvasRef = useRef(null);
  const angleRef = useRef(-Math.PI / 2); // start at top
  const rafRef = useRef(null);
  const isSpinningRef = useRef(false);
  const membersRef = useRef(members);

  // Keep membersRef in sync
  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  const draw = useCallback(() => {
    if (canvasRef.current) {
      drawWheel(canvasRef.current, membersRef.current, angleRef.current);
    }
  }, []);

  // Redraw when members change
  useEffect(() => {
    draw();
  }, [members, draw]);

  const doSpin = useCallback(() => {
    const currentMembers = membersRef.current;
    if (isSpinningRef.current || currentMembers.length === 0) return;

    const n = currentMembers.length;
    const arc = (Math.PI * 2) / n;

    const winnerIndex = Math.floor(Math.random() * n);

    // We want winnerIndex segment to be at the top (pointer at -PI/2).
    // The center of segment i is at: angleRef.current + i*arc + arc/2
    // We want that center to equal -PI/2 after spinning.
    const extraRotations = (6 + Math.floor(Math.random() * 4)) * Math.PI * 2;
    const targetAngle = -Math.PI / 2 - (winnerIndex * arc + arc / 2);
    let delta = targetAngle - angleRef.current + extraRotations;
    // Ensure we always spin forward
    while (delta < extraRotations - Math.PI * 2) delta += Math.PI * 2;

    const startAngle = angleRef.current;
    const totalSpin = delta;
    const duration = 4000 + Math.random() * 1500;
    const startTime = performance.now();

    isSpinningRef.current = true;
    setIsSpinning(true);

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      angleRef.current = startAngle + totalSpin * eased;
      drawWheel(canvasRef.current, membersRef.current, angleRef.current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        angleRef.current = startAngle + totalSpin;
        drawWheel(canvasRef.current, membersRef.current, angleRef.current);
        isSpinningRef.current = false;
        setIsSpinning(false);
        onSpinEnd(currentMembers[winnerIndex]);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [onSpinEnd, setIsSpinning]);

  // Trigger spin when spinTrigger increments
  useEffect(() => {
    if (spinTrigger > 0) {
      doSpin();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinTrigger]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="wheel-container">
      <div className="wheel-pointer">▼</div>
      <canvas
        ref={canvasRef}
        width={WHEEL_SIZE}
        height={WHEEL_SIZE}
        className="wheel-canvas"
      />
    </div>
  );
}
