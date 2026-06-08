import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Zap, Loader2, Download, X } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancementResult {
  id: string;
  type: 'background-removal' | 'low-light' | 'upscaling';
  status: 'processing' | 'completed' | 'error';
  progress: number;
  originalSize: number;
  enhancedSize?: number;
  error?: string;
}

export default function AIImageEnhancements() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [enhancements, setEnhancements] = useState<EnhancementResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      toast.success('Image uploaded');
    } else {
      toast.error('Please select an image file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      toast.success('Image uploaded');
    }
  };

  const applyEnhancement = async (type: 'background-removal' | 'low-light' | 'upscaling') => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    const enhancementId = `${Date.now()}-${Math.random()}`;
    const newEnhancement: EnhancementResult = {
      id: enhancementId,
      type,
      status: 'processing',
      progress: 0,
      originalSize: uploadedImage.size,
    };

    setEnhancements(prev => [...prev, newEnhancement]);
    setIsProcessing(true);

    try {
      // Simulate AI processing with progress updates
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setEnhancements(prev =>
          prev.map(e =>
            e.id === enhancementId ? { ...e, progress: i } : e
          )
        );
      }

      // Simulate enhanced file size
      const enhancedSize = Math.floor(uploadedImage.size * (0.6 + Math.random() * 0.2));

      setEnhancements(prev =>
        prev.map(e =>
          e.id === enhancementId
            ? { ...e, status: 'completed', progress: 100, enhancedSize }
            : e
        )
      );

      toast.success(`${type.replace('-', ' ')} completed!`);
    } catch (error) {
      setEnhancements(prev =>
        prev.map(e =>
          e.id === enhancementId
            ? { ...e, status: 'error', error: 'Processing failed' }
            : e
        )
      );
      toast.error('Enhancement failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadEnhanced = (enhancementId: string) => {
    toast.info('Download feature coming soon');
  };

  const removeEnhancement = (enhancementId: string) => {
    setEnhancements(prev => prev.filter(e => e.id !== enhancementId));
  };

  const getEnhancementLabel = (type: string) => {
    const labels: Record<string, string> = {
      'background-removal': 'Background Removal',
      'low-light': 'Low-Light Enhancement',
      'upscaling': '4x Super-Resolution Upscaling',
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">AI Image Enhancements</h1>
          <p className="text-slate-400">Professional-grade image processing powered by AI</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1"
          >
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-cyan-400/50 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-400 transition-colors bg-slate-800/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Upload Image</h3>
              <p className="text-sm text-slate-400">Drop or click to select</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Enhancement Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => applyEnhancement('background-removal')}
                disabled={!uploadedImage || isProcessing}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Remove Background
              </button>

              <button
                onClick={() => applyEnhancement('low-light')}
                disabled={!uploadedImage || isProcessing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Low-Light Enhancement
              </button>

              <button
                onClick={() => applyEnhancement('upscaling')}
                disabled={!uploadedImage || isProcessing}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                4x Upscaling
              </button>
            </div>
          </motion.div>

          {/* Preview & Results */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {preview ? (
              <div className="space-y-6">
                {/* Original Image */}
                <div className="bg-slate-800 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Original Image</h3>
                  <img
                    src={preview}
                    alt="Original"
                    className="w-full rounded-lg max-h-96 object-contain"
                  />
                  <p className="text-sm text-slate-400 mt-3">
                    Size: {((uploadedImage?.size || 0) / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Enhancements List */}
                <AnimatePresence>
                  {enhancements.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3"
                    >
                      <h3 className="text-white font-semibold">Enhancements</h3>
                      {enhancements.map(enhancement => (
                        <motion.div
                          key={enhancement.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-slate-800 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {enhancement.status === 'processing' && (
                                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                              )}
                              <span className="text-white font-medium">
                                {getEnhancementLabel(enhancement.type)}
                              </span>
                            </div>
                            <button
                              onClick={() => removeEnhancement(enhancement.id)}
                              className="text-slate-400 hover:text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${enhancement.progress}%` }}
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                            />
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">
                              {enhancement.status === 'completed'
                                ? `${enhancement.enhancedSize ? ((enhancement.enhancedSize / 1024 / 1024).toFixed(2)) : '0'} MB`
                                : `${enhancement.progress}%`}
                            </span>
                            {enhancement.status === 'completed' && (
                              <button
                                onClick={() => downloadEnhanced(enhancement.id)}
                                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700 p-12 text-center">
                <div className="text-slate-400">
                  <p className="text-lg">Upload an image to get started</p>
                  <p className="text-sm mt-2">Supports PNG, JPG, WebP, and more</p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h4 className="text-white font-semibold mb-2">Background Removal</h4>
            <p className="text-sm text-slate-400">
              AI-powered background removal with precise edge detection
            </p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <h4 className="text-white font-semibold mb-2">Low-Light Enhancement</h4>
            <p className="text-sm text-slate-400">
              Enhance dark images while preserving details and reducing noise
            </p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <h4 className="text-white font-semibold mb-2">4x Upscaling</h4>
            <p className="text-sm text-slate-400">
              Super-resolution upscaling with AI to enhance image quality
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
