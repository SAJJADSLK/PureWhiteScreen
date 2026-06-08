import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import SessionStats from "@/components/SessionStats";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"stats" | "about">("stats");

  const tabs = [
    { id: "stats", label: "Session Stats", icon: BarChart3 },
    { id: "about", label: "About", icon: SettingsIcon },
  ];

  const mockStats = [
    {
      toolName: "Pomodoro",
      usageCount: 24,
      totalTime: 86400,
      lastUsed: new Date(),
    },
    {
      toolName: "Focus Mode",
      usageCount: 18,
      totalTime: 64800,
      lastUsed: new Date(),
    },
    {
      toolName: "Color Screen",
      usageCount: 12,
      totalTime: 3600,
      lastUsed: new Date(),
    },
    {
      toolName: "Ring Light",
      usageCount: 8,
      totalTime: 7200,
      lastUsed: new Date(),
    },
    {
      toolName: "Teleprompter",
      usageCount: 6,
      totalTime: 10800,
      lastUsed: new Date(),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.1_0.02_270)] via-[oklch(0.12_0.02_270)] to-[oklch(0.1_0.02_270)] pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="text-cyan-400" size={32} />
            <h1 className="text-4xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-white/60">Manage your ScreenLab preferences and view your usage statistics</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2 mb-8 border-b border-white/10"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${
                  isActive ? "text-cyan-400" : "text-white/60 hover:text-white/80"
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "stats" && (
            <div className="space-y-6">
              <SessionStats stats={mockStats} />
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6">
              {/* About Cards */}
              <Card className="bg-white/5 border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">About ScreenLab</h3>
                <p className="text-white/70 leading-relaxed">
                  ScreenLab is a premium screen utility and creative toolkit designed to transform any screen into a professional studio. With 20+ tools for lighting, productivity, creative work, and ambient spaces, ScreenLab provides everything you need for content creation, focus sessions, and creative exploration.
                </p>
              </Card>

              {/* Features */}
              <Card className="bg-white/5 border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Screen Utilities", desc: "Color screens, dead pixel test, brightness calibration" },
                    { title: "Creator Studio", desc: "Ring light, green screen, teleprompter, neon signs" },
                    { title: "Focus Tools", desc: "Pomodoro timer, sound mixer, distraction-free mode" },
                    { title: "Ambient Spaces", desc: "Fireplace, ocean, forest, northern lights" },
                    { title: "Fun Effects", desc: "Matrix rain, starfield, CRT effect" },
                    { title: "Presets", desc: "Save and share your favorite configurations" },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <p className="font-medium text-cyan-400">{feature.title}</p>
                      <p className="text-sm text-white/60 mt-1">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Version Info */}
              <Card className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Version</p>
                    <p className="text-2xl font-bold text-white mt-1">1.0.0</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Status</p>
                    <p className="text-lg font-semibold text-green-400 mt-1">Active</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
