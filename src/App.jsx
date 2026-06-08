import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Footer from './components/Footer'
import ExitIntentPopup from './components/ExitIntentPopup'
import { updatePageMetadata, addStructuredData } from './lib/seoOptimization'
import { getToolLandingPageConfig } from './lib/toolLandingPages'

// Import all tools
import WhiteScreen from './pages/tools/WhiteScreen'
import RingLight from './pages/tools/RingLight'
import Pomodoro from './pages/tools/Pomodoro'
import ColorScreen from './pages/tools/ColorScreen'
import BlackScreen from './pages/tools/BlackScreen'
import GreenScreen from './pages/tools/GreenScreen'
import DeadPixelTest from './pages/tools/DeadPixelTest'
import BrokenScreen from './pages/tools/BrokenScreen'
import CRTEffect from './pages/tools/CRTEffect'
import GrayBalance from './pages/tools/GrayBalance'
import BrightnessCalibration from './pages/tools/BrightnessCalibration'
import MatrixRain from './pages/tools/MatrixRain'
import NeonSign from './pages/tools/NeonSign'
import Starfield from './pages/tools/Starfield'
import HackerTyper from './pages/tools/HackerTyper'
import FakeWindowsUpdate from './pages/tools/FakeWindowsUpdate'
import Teleprompter from './pages/tools/Teleprompter'
import SoundMixer from './pages/tools/SoundMixer'
import FocusMode from './pages/tools/FocusMode'
import FormatOptimizer from './pages/tools/FormatOptimizer'
import BatchProcessor from './pages/tools/BatchProcessor'
import AIImageEnhancements from './pages/tools/AIImageEnhancements'
import Forest from './pages/tools/ambient/Forest'
import Ocean from './pages/tools/ambient/Ocean'
import Fireplace from './pages/tools/ambient/Fireplace'
import NorthernLights from './pages/tools/ambient/NorthernLights'

const TOOLS = [
  { id: 'white-screen', name: 'White Screen', component: WhiteScreen, icon: '⚪' },
  { id: 'ring-light', name: 'Ring Light', component: RingLight, icon: '💡' },
  { id: 'pomodoro', name: 'Pomodoro Timer', component: Pomodoro, icon: '⏱️' },
  { id: 'color-screen', name: 'Color Screen', component: ColorScreen, icon: '🎨' },
  { id: 'black-screen', name: 'Black Screen', component: BlackScreen, icon: '⬛' },
  { id: 'green-screen', name: 'Green Screen', component: GreenScreen, icon: '💚' },
  { id: 'dead-pixel', name: 'Dead Pixel Test', component: DeadPixelTest, icon: '🔴' },
  { id: 'broken-screen', name: 'Broken Screen', component: BrokenScreen, icon: '💥' },
  { id: 'crt-effect', name: 'CRT Effect', component: CRTEffect, icon: '📺' },
  { id: 'gray-balance', name: 'Gray Balance', component: GrayBalance, icon: '⚖️' },
  { id: 'brightness', name: 'Brightness Calibration', component: BrightnessCalibration, icon: '🔆' },
  { id: 'matrix', name: 'Matrix Rain', component: MatrixRain, icon: '🟢' },
  { id: 'neon', name: 'Neon Sign', component: NeonSign, icon: '✨' },
  { id: 'starfield', name: 'Starfield', component: Starfield, icon: '⭐' },
  { id: 'hacker', name: 'Hacker Typer', component: HackerTyper, icon: '⌨️' },
  { id: 'windows-update', name: 'Fake Windows Update', component: FakeWindowsUpdate, icon: '🪟' },
  { id: 'teleprompter', name: 'Teleprompter', component: Teleprompter, icon: '📝' },
  { id: 'sound-mixer', name: 'Sound Mixer', component: SoundMixer, icon: '🔊' },
  { id: 'focus-mode', name: 'Focus Mode', component: FocusMode, icon: '🎯' },
  { id: 'format-optimizer', name: 'Format Optimizer', component: FormatOptimizer, icon: '🎬' },
  { id: 'batch-processor', name: 'Batch Processor', component: BatchProcessor, icon: '📦' },
  { id: 'ai-enhance', name: 'AI Image Enhancements', component: AIImageEnhancements, icon: '🤖' },
  { id: 'forest', name: 'Forest Ambient', component: Forest, icon: '🌲' },
  { id: 'ocean', name: 'Ocean Ambient', component: Ocean, icon: '🌊' },
  { id: 'fireplace', name: 'Fireplace Ambient', component: Fireplace, icon: '🔥' },
  { id: 'northern-lights', name: 'Northern Lights', component: NorthernLights, icon: '🌌' },
]

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showExitIntent, setShowExitIntent] = useState(false)

  // Handle page changes and SEO
  useEffect(() => {
    const tool = TOOLS.find(t => t.id === currentPage)
    if (tool) {
      const config = getToolLandingPageConfig(tool.id)
      if (config) {
        updatePageMetadata({
          title: config.title,
          description: config.description,
          keywords: config.keywords,
        })
        addStructuredData({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: config.title,
          description: config.description,
          url: `https://www.purewhitescreen.online/tools/${tool.id}`,
        })
      }
    }
  }, [currentPage])

  // Exit intent popup
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        setShowExitIntent(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  const renderPage = () => {
    if (currentPage === 'home') {
      return <Home onSelectTool={setCurrentPage} tools={TOOLS} />
    }

    const tool = TOOLS.find(t => t.id === currentPage)
    if (tool) {
      const Component = tool.component
      return <Component />
    }

    return <Home onSelectTool={setCurrentPage} tools={TOOLS} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} tools={TOOLS} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />

      {/* AdSense Banner Ads */}
      <div className="flex justify-center py-8 px-4">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-3811332485680799"
          data-ad-slot="1234567890"
          data-ad-format="horizontal"
        ></ins>
      </div>

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <ExitIntentPopup onClose={() => setShowExitIntent(false)} />
      )}

      <script>
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </script>
    </div>
  )
}
