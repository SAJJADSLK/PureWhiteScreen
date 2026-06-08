import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Zap, Loader2, Download, X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ConversionResult {
  id: string;
  format: 'webp' | 'avif' | 'png' | 'jpg';
  status: 'processing' | 'completed' | 'error';
  progress: number;
  originalSize: number;
  convertedSize?: number;
  quality: number;
  error?: string;
}

export default function FormatOptimizer() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [conversions, setConversions] = useState<ConversionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(80);
  const [copiedId, setCopiedId] = useState<string | null>(null);
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

  const convertFormat = async (format: 'webp' | 'avif' | 'png' | 'jpg') => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    const conversionId = `${Date.now()}-${Math.random()}`;
    const newConversion: ConversionResult = {
      id: conversionId,
      format,
      status: 'processing',
      progress: 0,
      originalSize: uploadedImage.size,
      quality: selectedQuality,
    };

    setConversions(prev => [...prev, newConversion]);
    setIsProcessing(true);

    try {
      // Simulate conversion with progress updates
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setConversions(prev =>
          prev.map(c =>
            c.id === conversionId ? { ...c, progress: i } : c
          )
        );
      }

      // Simulate converted file size based on format
      const compressionRatio = {
        webp: 0.55,
        avif: 0.45,
        png: 0.85,
        jpg: 0.65,
      }[format];

      const convertedSize = Math.floor(uploadedImage.size * compressionRatio);

      setConversions(prev =>
        prev.map(c =>
          c.id === conversionId
            ? { ...c, status: 'completed', progress: 100, convertedSize }
            : c
        )
      );

      toast.success(`Converted to ${format.toUpperCase()}!`);
    } catch (error) {
      setConversions(prev =>
        prev.map(c =>
          c.id === conversionId
            ? { ...c, status: 'error', error: 'Conversion failed' }
            : c
        )
      );
      toast.error('Conversion failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadConverted = (conversionId: string) => {
    toast.info('Download feature coming soon');
  };

  const copyConversionCode = (conversionId: string, format: string) => {
    const code = `<picture>
  <source srcset="image.${format}" type="image/${format}">
  <img src="image.jpg" alt="Description">
</picture>`;
    navigator.clipboard.writeText(code);
    setCopiedId(conversionId);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Code copied to clipboard');
  };

  const removeConversion = (conversionId: string) => {
    setConversions(prev => prev.filter(c => c.id !== conversionId));
  };

  const calculateSavings = (original: number, converted: number) => {
    return (((original - converted) / original) * 100).toFixed(1);
  };

  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2);
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
          <h1 className="text-4xl font-bold text-white mb-2">Format Optimizer</h1>
          <p className="text-slate-400">Convert images to WebP, AVIF, and more with side-by-side comparison</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload & Controls */}
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

            {/* Quality Slider */}
            <div className="mt-6 bg-slate-800 rounded-lg p-4">
              <label className="text-white font-semibold block mb-3">Quality: {selectedQuality}%</label>
              <input
                type="range"
                min="10"
                max="100"
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-slate-400 mt-2">Higher quality = larger file size</p>
            </div>

            {/* Format Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => convertFormat('webp')}
                disabled={!uploadedImage || isProcessing}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Convert to WebP
              </button>

              <button
                onClick={() => convertFormat('avif')}
                disabled={!uploadedImage || isProcessing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Convert to AVIF
              </button>

              <button
                onClick={() => convertFormat('png')}
                disabled={!uploadedImage || isProcessing}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Convert to PNG
              </button>

              <button
                onClick={() => convertFormat('jpg')}
                disabled={!uploadedImage || isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Convert to JPG
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
                    Size: {formatBytes(uploadedImage?.size || 0)} MB
                  </p>
                </div>

                {/* Conversions */}
                <AnimatePresence>
                  {conversions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3"
                    >
                      <h3 className="text-white font-semibold">Conversions</h3>
                      {conversions.map(conversion => (
                        <motion.div
                          key={conversion.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-slate-800 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {conversion.status === 'processing' && (
                                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                              )}
                              <span className="text-white font-medium">
                                {conversion.format.toUpperCase()} @ {conversion.quality}%
                              </span>
                            </div>
                            <button
                              onClick={() => removeConversion(conversion.id)}
                              className="text-slate-400 hover:text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${conversion.progress}%` }}
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                            />
                          </div>

                          {conversion.status === 'completed' && conversion.convertedSize && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">
                                  {formatBytes(conversion.convertedSize)} MB
                                </span>
                                <span className="text-green-400 font-semibold">
                                  {calculateSavings(conversion.originalSize, conversion.convertedSize)}% smaller
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => downloadConverted(conversion.id)}
                                  className="flex-1 text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1 text-sm"
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </button>
                                <button
                                  onClick={() => copyConversionCode(conversion.id, conversion.format)}
                                  className="flex-1 text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 text-sm"
                                >
                                  {copiedId === conversion.id ? (
                                    <>
                                      <Check className="w-4 h-4" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4" />
                                      Copy Code
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
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
                  <p className="text-sm mt-2">Compare formats and optimize for web</p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Format Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h4 className="text-white font-semibold mb-2">WebP</h4>
            <p className="text-sm text-slate-400">
              Modern format with superior compression. ~55% smaller than original. Supported by most browsers.
            </p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <h4 className="text-white font-semibold mb-2">AVIF</h4>
            <p className="text-sm text-slate-400">
              Next-gen format with best compression. ~45% smaller than original. Excellent quality at low bitrates.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
