import { useState, useEffect } from 'react'

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      // Switch between work and break
      setIsBreak(!isBreak)
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const reset = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(25 * 60)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pomodoro Timer</h1>

      {/* Timer Display */}
      <div className="bg-slate-800 p-12 rounded-lg text-center mb-6">
        <div className="text-7xl font-bold font-mono mb-4">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <p className="text-xl text-gray-300">{isBreak ? '☕ Break Time' : '🎯 Work Time'}</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center mb-8">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded font-semibold transition"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="bg-slate-700 hover:bg-slate-600 px-8 py-3 rounded font-semibold transition"
        >
          Reset
        </button>
      </div>

      {/* Info */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="font-bold mb-3">How Pomodoro Works:</h3>
        <ul className="space-y-2 text-gray-300">
          <li>✓ Work for 25 minutes</li>
          <li>✓ Take a 5-minute break</li>
          <li>✓ Repeat 4 times</li>
          <li>✓ Take a 15-minute break</li>
        </ul>
      </div>

      {/* AdSense Ad */}
      <div className="mt-8 flex justify-center">
        <ins className="adsbygoogle"
          style={{ display: 'block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-3811332485680799"
          data-ad-slot="3333333333"
          data-ad-format="horizontal"></ins>
      </div>
    </div>
  )
}
