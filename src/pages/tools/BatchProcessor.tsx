import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Trash2, Download, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface BatchFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export default function BatchProcessor() {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preset, setPreset] = useState('resize-web');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    { id: 'resize-web', name: 'Resize for Web (1200px)', config: { width: 1200, format: 'webp' } },
    { id: 'resize-mobile', name: 'Resize for Mobile (600px)', config: { width: 600, format: 'webp' } },
    { id: 'compress', name: 'Maximum Compression', config: { quality: 0.7, format: 'webp' } },
    { id: 'social-square', name: 'Social Media Square (1:1)', config: { size: 1080, format: 'jpg' } },
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Please select image files');
      return;
    }

    const batchFiles: BatchFile[] = imageFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: 'pending',
    }));

    setFiles(prev => [...prev, ...batchFiles]);
    toast.success(`Added ${imageFiles.length} file(s)`);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const processBatch = async () => {
    if (files.length === 0) {
      toast.error('No files to process');
      return;
    }

    setIsProcessing(true);
    const selectedPreset = presets.find(p => p.id === preset);

    for (const batchFile of files) {
      if (batchFile.status === 'completed') continue;

      try {
        setFiles(prev =>
          prev.map(f =>
            f.id === batchFile.id ? { ...f, status: 'processing' } : f
          )
        );

        // Simulate processing with progress updates
        for (let i = 0; i <= 100; i += 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setFiles(prev =>
            prev.map(f =>
              f.id === batchFile.id ? { ...f, progress: i } : f
            )
          );
        }

        setFiles(prev =>
          prev.map(f =>
            f.id === batchFile.id ? { ...f, status: 'completed', progress: 100 } : f
          )
        );
      } catch (error) {
        setFiles(prev =>
          prev.map(f =>
            f.id === batchFile.id
              ? { ...f, status: 'error', error: 'Processing failed' }
              : f
          )
        );
      }
    }

    setIsProcessing(false);
    toast.success('Batch processing complete!');
  };

  const downloadAsZip = () => {
    // Placeholder for ZIP download functionality
    toast.info('ZIP download feature coming soon');
  };

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Batch Processor</h1>
          <p className="text-slate-400">Process 50+ images at once with your chosen preset</p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-cyan-400/50 rounded-xl p-12 text-center cursor-pointer hover:border-cyan-400 transition-colors bg-slate-800/50"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Drop files here or click to upload</h3>
            <p className="text-slate-400">Supports PNG, JPG, WebP, and more</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </motion.div>

        {/* Preset Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <label className="block text-white font-semibold mb-3">Select Preset</label>
          <div className="grid grid-cols-2 gap-3">
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                className={`p-3 rounded-lg transition-all ${
                  preset === p.id
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Files ({files.length})</h3>
                <button
                  onClick={clearCompleted}
                  className="text-sm text-slate-400 hover:text-slate-300"
                >
                  Clear completed
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {files.map(batchFile => (
                  <motion.div
                    key={batchFile.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-slate-800 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white truncate">{batchFile.file.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {batchFile.status === 'completed' ? '✓' : batchFile.status === 'error' ? '✗' : `${batchFile.progress}%`}
                        </span>
                        <button
                          onClick={() => removeFile(batchFile.id)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${batchFile.progress}%` }}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4"
        >
          <Button
            onClick={processBatch}
            disabled={files.length === 0 || isProcessing}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Process Batch'}
          </Button>

          <Button
            onClick={downloadAsZip}
            disabled={!files.some(f => f.status === 'completed')}
            className="flex-1 bg-slate-700 text-white font-bold py-3 hover:bg-slate-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Download ZIP
          </Button>
        </motion.div>

        {/* Stats */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            <Card className="bg-slate-800 border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{files.length}</div>
              <div className="text-sm text-slate-400">Total Files</div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {files.filter(f => f.status === 'completed').length}
              </div>
              <div className="text-sm text-slate-400">Completed</div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {files.filter(f => f.status === 'processing').length}
              </div>
              <div className="text-sm text-slate-400">Processing</div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
