import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Navigation from "./components/Navigation";
import ToolLauncher from "./components/ToolLauncher";
import WhiteScreen from "./pages/tools/WhiteScreen";
import BlackScreen from "./pages/tools/BlackScreen";
import ColorScreen from "./pages/tools/ColorScreen";
import DeadPixelTest from "./pages/tools/DeadPixelTest";
import RingLight from "./pages/tools/RingLight";
import GreenScreen from "./pages/tools/GreenScreen";
import Teleprompter from "./pages/tools/Teleprompter";
import Pomodoro from "./pages/tools/Pomodoro";
import MatrixRain from "./pages/tools/MatrixRain";
import Starfield from "./pages/tools/Starfield";
import CRTEffect from "./pages/tools/CRTEffect";
import NeonSign from "./pages/tools/NeonSign";
import AmbientFireplace from "./pages/tools/ambient/Fireplace";
import AmbientOcean from "./pages/tools/ambient/Ocean";
import AmbientForest from "./pages/tools/ambient/Forest";
import AmbientNorthernLights from "./pages/tools/ambient/NorthernLights";
import SoundMixer from "./pages/tools/SoundMixer";
import GrayBalance from "./pages/tools/GrayBalance";
import BrightnessCalibration from "./pages/tools/BrightnessCalibration";
import FocusMode from "./pages/tools/FocusMode";
import BatchProcessor from "./pages/tools/BatchProcessor";
import AIImageEnhancements from "./pages/tools/AIImageEnhancements";
import FormatOptimizer from "./pages/tools/FormatOptimizer";
import SettingsPage from "./pages/Settings";
import { StickyCtaBar } from "./components/OptimizedCTA";
import { ExitIntentPopup } from "./components/ExitIntentPopup";

function Router() {
  return (
    <main id="main-content" role="main" className="flex-1">
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/settings"} component={SettingsPage} />
        
        {/* Screen Utilities */}
        <Route path={"/white-screen"} component={WhiteScreen} />
        <Route path={"/black-screen"} component={BlackScreen} />
        <Route path={"/color-screen"} component={ColorScreen} />
        <Route path={"/dead-pixel-test"} component={DeadPixelTest} />
        
        {/* Creator Studio */}
        <Route path={"/ring-light"} component={RingLight} />
        <Route path={"/green-screen"} component={GreenScreen} />
        <Route path={"/teleprompter"} component={Teleprompter} />
        
        {/* Focus & Productivity */}
        <Route path={"/pomodoro"} component={Pomodoro} />
        <Route path={"/focus-mode"} component={FocusMode} />
        <Route path={"/sound-mixer"} component={SoundMixer} />
        
        {/* Additional Screen Utilities */}
        <Route path={"/gray-balance"} component={GrayBalance} />
        <Route path={"/brightness-calibration"} component={BrightnessCalibration} />
        
        {/* Viral & Fun */}
        <Route path={"/matrix-rain"} component={MatrixRain} />
        <Route path={"/starfield"} component={Starfield} />
        <Route path={"/crt-effect"} component={CRTEffect} />
        <Route path={"/neon-sign"} component={NeonSign} />
        
        {/* Ambient Spaces */}
        <Route path={"/ambient/fireplace"} component={AmbientFireplace} />
        <Route path={"/ambient/ocean"} component={AmbientOcean} />
        <Route path={"/ambient/forest"} component={AmbientForest} />
        <Route path={"/ambient/northern-lights"} component={AmbientNorthernLights} />
        
        {/* Batch Processing */}
        <Route path={"/batch-processor"} component={BatchProcessor} />
        
        {/* AI Image Enhancements */}
        <Route path={"/ai-enhancements"} component={AIImageEnhancements} />
        
        {/* Format Optimizer */}
        <Route path={"/format-optimizer"} component={FormatOptimizer} />
        
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </main>
  );
}

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {!isFullscreen && (
            <header role="banner">
              <Navigation />
            </header>
          )}
          <Router />
          {!isFullscreen && (
            <>
              <ToolLauncher />
              <StickyCtaBar />
              <ExitIntentPopup />
            </>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
