import { useState, useEffect, useCallback } from 'react';
import { useSound } from 'use-sound';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isBreak: boolean;
  sessions: number;
}

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes in seconds
const LONG_BREAK = 15 * 60; // 15 minutes in seconds
const SESSIONS_BEFORE_LONG_BREAK = 4;

export const PomodoroTimer = () => {
  const [timerState, setTimerState] = useState<TimerState>({
    minutes: Math.floor(WORK_TIME / 60),
    seconds: WORK_TIME % 60,
    isRunning: false,
    isBreak: false,
    sessions: 0,
  });

  const [playAlarm] = useSound('/sounds/alarm.mp3', { volume: 0.5 });
  const [playTick] = useSound('/sounds/tick.mp3', { volume: 0.2 });

  const resetTimer = useCallback((isBreak: boolean) => {
    const time = isBreak
      ? timerState.sessions % SESSIONS_BEFORE_LONG_BREAK === 0
        ? LONG_BREAK
        : SHORT_BREAK
      : WORK_TIME;

    setTimerState((prev) => ({
      ...prev,
      minutes: Math.floor(time / 60),
      seconds: time % 60,
      isRunning: false,
      isBreak,
    }));
  }, [timerState.sessions]);

  const toggleTimer = () => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  };

  const skipTimer = () => {
    const nextIsBreak = !timerState.isBreak;
    if (nextIsBreak) {
      setTimerState((prev) => ({
        ...prev,
        sessions: prev.sessions + 1,
      }));
    }
    resetTimer(nextIsBreak);
  };

  useEffect(() => {
    let interval: number | undefined;

    if (timerState.isRunning) {
      interval = window.setInterval(() => {
        setTimerState((prev) => {
          const totalSeconds = prev.minutes * 60 + prev.seconds - 1;

          if (totalSeconds < 0) {
            playAlarm();
            const nextIsBreak = !prev.isBreak;
            if (nextIsBreak) {
              setTimerState((p) => ({
                ...p,
                sessions: p.sessions + 1,
              }));
            }
            resetTimer(nextIsBreak);
            return prev;
          }

          if (totalSeconds % 60 === 0) {
            playTick();
          }

          return {
            ...prev,
            minutes: Math.floor(totalSeconds / 60),
            seconds: totalSeconds % 60,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerState.isRunning, resetTimer, playAlarm, playTick]);

  const progress = useCallback(() => {
    const total = timerState.isBreak
      ? timerState.sessions % SESSIONS_BEFORE_LONG_BREAK === 0
        ? LONG_BREAK
        : SHORT_BREAK
      : WORK_TIME;
    const current = timerState.minutes * 60 + timerState.seconds;
    return ((total - current) / total) * 100;
  }, [timerState]);

  return (
    <div className="pomodoro-timer glass">
      <div className="timer-header">
        <h2>Pomodoro Timer</h2>
        <div className="timer-stats">
          <div className="stat">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Sessions: {timerState.sessions}</span>
          </div>
          <div className="stat">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <span>Focus Time: {Math.floor(timerState.sessions * WORK_TIME / 60)}m</span>
          </div>
        </div>
      </div>

      <div className="timer-display">
        <div className="timer-circle">
          <svg viewBox="0 0 100 100" className="timer-svg">
            <circle
              className="timer-background"
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              className="timer-progress"
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: `${progress()} 283`,
              }}
            />
          </svg>
          <div className="timer-time">
            {String(timerState.minutes).padStart(2, '0')}:
            {String(timerState.seconds).padStart(2, '0')}
          </div>
        </div>
        <div className="timer-mode">
          {timerState.isBreak
            ? timerState.sessions % SESSIONS_BEFORE_LONG_BREAK === 0
              ? 'Long Break'
              : 'Short Break'
            : 'Focus Time'}
        </div>
      </div>

      <div className="timer-controls">
        <button
          className="btn"
          onClick={toggleTimer}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {timerState.isRunning ? (
              <>
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </>
            ) : (
              <polygon points="5 3 19 12 5 21 5 3"/>
            )}
          </svg>
          {timerState.isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={skipTimer}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 12 19 12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
          Skip
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => resetTimer(timerState.isBreak)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Reset
        </button>
      </div>

      <div className="timer-tips">
        <h3>Tips</h3>
        <ul>
          <li>Work for 25 minutes, then take a 5-minute break</li>
          <li>After 4 sessions, take a longer 15-minute break</li>
          <li>Stay focused during work sessions</li>
          <li>Use breaks to stretch and rest your eyes</li>
        </ul>
      </div>
    </div>
  );
}; 