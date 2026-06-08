export default function Navigation({ currentPage, onNavigate }) {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition"
          >
            <div className="w-8 h-8 bg-white rounded"></div>
            <span>Pure White Screen</span>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8">
            <button
              onClick={() => onNavigate('home')}
              className={`transition ${currentPage === 'home' ? 'text-blue-400' : 'hover:text-blue-400'}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('white-screen')}
              className={`transition ${currentPage === 'white-screen' ? 'text-blue-400' : 'hover:text-blue-400'}`}
            >
              White Screen
            </button>
            <button
              onClick={() => onNavigate('ring-light')}
              className={`transition ${currentPage === 'ring-light' ? 'text-blue-400' : 'hover:text-blue-400'}`}
            >
              Ring Light
            </button>
            <button
              onClick={() => onNavigate('pomodoro')}
              className={`transition ${currentPage === 'pomodoro' ? 'text-blue-400' : 'hover:text-blue-400'}`}
            >
              Pomodoro
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 hover:bg-slate-800 rounded">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
