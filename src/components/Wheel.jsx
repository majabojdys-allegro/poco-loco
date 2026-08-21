import React, { useRef, useEffect, useCallback } from 'react';
import { CHARACTER_IMAGES } from '../constants/members';
import './Wheel.css';

const WHEEL_SIZE = 440;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = CENTER - 16;

function assignSegmentColors(n, colors) {
  if (n === 0) return [];
  const k = colors.length;
  const result = [];
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < k; c++) {
      const candidate = colors[(i + c) % k];
      const prevOk = candidate !== result[i - 1];
      const wrapOk = i < n - 1 || candidate !== result[0];
      if (prevOk && wrapOk) {
        result.push(candidate);
        break;
      }
    }
  }
  return result;
}

function drawWheel(canvas, members, currentAngle, segmentColors) {
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
  const assignedColors = assignSegmentColors(n, segmentColors);

  members.forEach((member, i) => {
    const startAngle = currentAngle + i * arc;
    const endAngle = startAngle + arc;
    const color = assignedColors[i];

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

  // Small center dot
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fill();
}

export default function Wheel({ members, onSpinEnd, spinTrigger, setIsSpinning, currentSpeaker, boostRef, stopRef, segmentColors, centerImage, characterImages }) {
  const canvasRef = useRef(null);
  const angleRef = useRef(-Math.PI / 2); // start at top
  const rafRef = useRef(null);
  const isSpinningRef = useRef(false);
  const membersRef = useRef(members);
  const segmentColorsRef = useRef(segmentColors);
  const spinStateRef = useRef({ startAngle: 0, totalSpin: 0, duration: 0, startTime: 0, winnerIndex: -1 });

  // Keep membersRef in sync
  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  // Keep segmentColorsRef in sync and redraw on color change
  useEffect(() => {
    segmentColorsRef.current = segmentColors;
    if (canvasRef.current) {
      drawWheel(canvasRef.current, membersRef.current, angleRef.current, segmentColorsRef.current);
    }
  }, [segmentColors]);

  const draw = useCallback(() => {
    if (canvasRef.current) {
      drawWheel(canvasRef.current, membersRef.current, angleRef.current, segmentColorsRef.current);
    }
  }, []);

  // Redraw when members change
  useEffect(() => {
    draw();
  }, [members, draw]);

  const doSpin = useCallback(() => {
    const currentMembers = membersRef.current;
    if (isSpinningRef.current || currentMembers.length === 0) return;

    // Spin a random amount — winner is determined by where the wheel stops
    const extraRotations = (6 + Math.random() * 4) * Math.PI * 2;
    const randomExtra = Math.random() * Math.PI * 2;
    const totalSpin = extraRotations + randomExtra;

    const startAngle = angleRef.current;
    const duration = 4000 + Math.random() * 1500;
    const startTime = performance.now();

    spinStateRef.current = { startAngle, totalSpin, duration, startTime };

    isSpinningRef.current = true;
    setIsSpinning(true);

    function frame(now) {
      const state = spinStateRef.current;
      const elapsed = now - state.startTime;
      const progress = Math.min(elapsed / state.duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      angleRef.current = state.startAngle + state.totalSpin * eased;
      drawWheel(canvasRef.current, membersRef.current, angleRef.current, segmentColorsRef.current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        angleRef.current = state.startAngle + state.totalSpin;
        drawWheel(canvasRef.current, membersRef.current, angleRef.current, segmentColorsRef.current);
        isSpinningRef.current = false;
        setIsSpinning(false);

        // Determine winner from final wheel angle (pointer is on the right = angle 0)
        const n = membersRef.current.length;
        const arc = (Math.PI * 2) / n;
        const finalAngle = angleRef.current;
        const normalized = ((-finalAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const winnerIndex = Math.floor(normalized / arc) % n;
        onSpinEnd(membersRef.current[winnerIndex]);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [onSpinEnd, setIsSpinning]);

  const doBoost = useCallback(() => {
    if (!isSpinningRef.current) return;
    const state = spinStateRef.current;
    const now = performance.now();
    const elapsed = now - state.startTime;
    const progress = Math.min(elapsed / state.duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    // Restart animation from current position with extra spin
    const currentAngle = state.startAngle + state.totalSpin * eased;
    const extraSpin = (2 + Math.random() * 2) * Math.PI * 2;
    spinStateRef.current = {
      ...state,
      startAngle: currentAngle,
      totalSpin: state.totalSpin * (1 - eased) + extraSpin,
      duration: 3000 + Math.random() * 1000,
      startTime: now,
    };
  }, []);

  const doStop = useCallback(() => {
    if (!isSpinningRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    isSpinningRef.current = false;
    setIsSpinning(false);
    drawWheel(canvasRef.current, membersRef.current, angleRef.current, segmentColorsRef.current);

    const n = membersRef.current.length;
    const arc = (Math.PI * 2) / n;
    const normalized = ((-angleRef.current) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const winnerIndex = Math.floor(normalized / arc) % n;
    onSpinEnd(membersRef.current[winnerIndex]);
  }, [onSpinEnd, setIsSpinning]);

  // Expose boost function via ref
  useEffect(() => {
    if (boostRef) boostRef.current = doBoost;
  }, [boostRef, doBoost]);

  // Expose stop function via ref
  useEffect(() => {
    if (stopRef) stopRef.current = doStop;
  }, [stopRef, doStop]);

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
      <div className="wheel-pointer">◀</div>
      <canvas
        ref={canvasRef}
        width={WHEEL_SIZE}
        height={WHEEL_SIZE}
        className="wheel-canvas"
      />
      {!currentSpeaker && (
        <div className="wheel-character wheel-character--center">
          <img
            src={centerImage}
            alt="center"
            className="wheel-character-img"
          />
        </div>
      )}
      {currentSpeaker && characterImages[currentSpeaker.id] && (
        <div className={`wheel-character wheel-character--id-${currentSpeaker.id}`}>
          <img
            src={characterImages[currentSpeaker.id]}
            alt={currentSpeaker.name}
            className="wheel-character-img"
          />
        </div>
      )}
    </div>
  );
}
