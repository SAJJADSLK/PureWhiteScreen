import { useState } from 'react'

export default function RingLight() {
  const [brightness, setBrightness] = useState(80)
  const [temperature, setTemperature] = useState(3500)
  const [size, setSize] = useState(200)

  const getColor = () => {
    if (temperature < 3000) return '#FFB366'
    if (temperature < 4000) return '#FFD699'
    if (temperature < 5000) return '#FFFFFF'
    return '#D4E4FF'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Virtual Ring Light</h1>

      {/* Controls */}
      <div className="bg-slate-800 p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
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

        <div>
          <label className="block text-sm font-semibold mb-2">Temperature: {temperature}K</label>
          <input
            type="range"
            min="2700"
            max="6500"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Size: {size}px</label>
          <input
            type="range"
            min="100"
            max="400"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="bg-slate-950 p-8 rounded-lg flex justify-center items-center min-h-96">
        <div
          className="rounded-full border-8 border-yellow-300 flex items-center justify-center"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: getColor(),
            opacity: brightness / 100,
            boxShadow: `0 0 ${size * 0.3}px ${getColor()}`,
          }}
        >
          <div className="w-16 h-16 bg-slate-950 rounded-full"></div>
        </div>
      </div>

      {/* AdSense Ad */}
      <div className="mt-8 flex justify-center">
        <ins className="adsbygoogle"
          style={{ display: 'block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-3811332485680799"
          data-ad-slot="2222222222"
          data-ad-format="horizontal"></ins>
      </div>
    </div>
  )
}
