import { useState } from 'react'

export default function WhiteScreen() {
  const [brightness, setBrightness] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const screen = (
    <div
      className="w-full h-screen bg-white transition-all"
      style={{ opacity: brightness / 100 }}
    ></div>
  )

  if (isFullscreen) {
    return screen
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">White Screen</h1>

      {/* Controls */}
      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Brightness: {brightness}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={toggleFullscreen}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded font-semibold transition"
          >
            Launch Fullscreen
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="border-2 border-slate-700 rounded-lg overflow-hidden bg-slate-950">
        <div
          className="w-full h-64 bg-white transition-all"
          style={{ opacity: brightness / 100 }}
        ></div>
      </div>

      {/* AdSense Ad */}
      <div className="mt-8 flex justify-center">
        <ins className="adsbygoogle"
          style={{ display: 'block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-3811332485680799"
          data-ad-slot="1111111111"
          data-ad-format="horizontal"></ins>
      </div>
    </div>
  )
}
