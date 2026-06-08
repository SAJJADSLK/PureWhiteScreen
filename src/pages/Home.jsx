import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, Zap, Palette, Clock, Monitor, Sparkles, Star } from 'lucide-react';
import Testimonials from '../components/Testimonials';

export default function Home({ onSelectTool, tools }) {
  const [hoveredTool, setHoveredTool] = useState(null);

  const features = [
    { icon: Zap, title: 'Lightning Fast', desc: 'Instant loading, no lag' },
    { icon: Palette, title: 'Fully Customizable', desc: 'Adjust colors & effects' },
    { icon: Monitor, title: 'Works Everywhere', desc: 'All devices supported' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 hover:bg-white/20 transition-all">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">26 Professional Tools</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Pure White Screen
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Professional screen utilities for creators, streamers, and professionals. Free, fast, and no signup required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => onSelectTool('white-screen')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2 group"
            >
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-white/30 rounded-lg font-semibold hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-sm">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-blue-400">26</div>
              <div className="text-gray-400">Tools</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-purple-400">100%</div>
              <div className="text-gray-400">Free</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-pink-400">∞</div>
              <div className="text-gray-400">Usage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Why Choose Pure White Screen?</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Everything you need for professional screen utilities in one place
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all">
                <feature.icon className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Explore Our Tools</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            26 professional utilities designed for creators and professionals
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.slice(0, 8).map((tool) => (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/30 transition-all transform hover:scale-105 cursor-pointer text-left"
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{tool.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                  <p className="text-sm text-gray-400">Click to launch</p>
                  <div className="mt-4 flex items-center gap-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Launch</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense Ad */}
      <section className="py-16 px-4 flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-3811332485680799"
          data-ad-slot="9876543210"
          data-ad-format="horizontal"
        ></ins>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-y border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            No signup required. No ads. No tracking. Just pure, simple screen utilities.
          </p>
          <button
            onClick={() => onSelectTool('white-screen')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105"
          >
            Launch Now
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <Testimonials />
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'What is Pure White Screen?',
                a: 'Pure White Screen is a collection of 26+ free screen utility tools for content creators, streamers, and professionals. All tools run directly in your browser with no signup required.'
              },
              {
                q: 'Do I need to create an account?',
                a: 'No! All tools are completely free and work without any account or signup. Just click and use.'
              },
              {
                q: 'Are the tools free to use?',
                a: 'Yes, all tools are 100% free forever. We support the site through Google AdSense.'
              },
              {
                q: 'Can I use these tools for streaming?',
                a: 'Absolutely! Many tools like Ring Light, Color Screen, and Green Screen are perfect for streaming and content creation.'
              },
              {
                q: 'Do you store my data?',
                a: 'No. All tools run completely in your browser. We don\'t store any personal data or tool settings.'
              },
            ].map((item, i) => (
              <details key={i} className="bg-white/5 border border-white/10 p-6 rounded-lg group hover:bg-white/10 transition-all">
                <summary className="font-bold cursor-pointer flex justify-between items-center">
                  {item.q}
                  <span className="group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="text-gray-400 mt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
