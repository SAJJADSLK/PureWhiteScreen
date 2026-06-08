import { useState } from 'react'

export default function ColorScreen() {
  const [color, setColor] = useState('#FF0000')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const colors = [
    { name: 'Red', value: '#FF0000' },
    { name: 'Green', value: '#00FF00' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Purple', value: '#FF00FF' },
    { name: 'Cyan', value: '#00FFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
  ]

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
      className="w-full h-screen transition-colors"
      style={{ backgroundColor: color }}
    ></div>
  )

  if (isFullscreen) {
    return screen
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Color Screen</h1>

      {/* Color Picker */}
      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Pick a Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-20 h-12 rounded cursor-pointer"
          />
          <span className="ml-4 text-gray-300">{color}</span>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold mb-3">Quick Colors:</p>
          <div className="grid grid-cols-4 gap-2">
            {colors.map(c => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className="p-3 rounded transition hover:scale-110"
                style={{ backgroundColor: c.value, border: color === c.value ? '3px solid white' : 'none' }}
                title={c.name}
              ></button>
            ))}
          </div>
        </div>

        <button
          onClick={toggleFullscreen}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded font-semibold transition"
        >
          Launch Fullscreen
        </button>
      </div>

      {/* Preview */}
      <div className="border-2 border-slate-700 rounded-lg overflow-hidden">
        <div
          className="w-full h-64 transition-colors"
          style={{ backgroundColor: color }}
        ></div>
      </div>

      {/* AdSense Ad */}
      <div className="mt-8 flex justify-center">
        <ins className="adsbygoogle"
          style={{ display: 'block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-3811332485680799"
          data-ad-slot="4444444444"
          data-ad-format="horizontal"></ins>
      </div>
    </div>
  )
}
