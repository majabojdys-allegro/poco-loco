import { useEffect, useRef, useCallback } from 'react';

export function useTimer(isRunning, onTick) {
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const elapsedRef = useRef(0);

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;
    const now = Date.now();
    elapsedRef.current = Math.floor((now - startTimeRef.current) / 1000);
    onTick(elapsedRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [onTick]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedRef.current * 1000;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, tick]);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;
    elapsedRef.current = 0;
    onTick(0);
  }, [onTick]);

  const getElapsed = useCallback(() => elapsedRef.current, []);

  return { reset, getElapsed };
}
