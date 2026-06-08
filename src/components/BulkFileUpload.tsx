import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface BulkFileUploadProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFormats?: string[];
  onFilesSelected?: (files: File[]) => void;
  onUploadComplete?: (files: UploadedFile[]) => void;
}

export function BulkFileUpload({
  maxFiles = 50,
  maxSize = 100 * 1024 * 1024, // 100MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  onFilesSelected,
  onUploadComplete,
}: BulkFileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (newFiles: File[]) => {
    const validatedFiles: UploadedFile[] = [];
    const errors: string[] = [];

    // Check file count
    if (files.length + newFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
    }

    newFiles.forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
        return;
      }

      // Check file format
      if (!acceptedFormats.includes(file.type)) {
        errors.push(`${file.name} format not supported`);
        return;
      }

      validatedFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'pending',
      });
    });

    if (validatedFiles.length > 0) {
      setFiles((prev) => [...prev, ...validatedFiles]);
      onFilesSelected?.(newFiles.filter((f) => validatedFiles.some((vf) => vf.name === f.name)));
    }

    if (errors.length > 0) {
      console.warn('File validation errors:', errors);
    }
  };

  const uploadFiles = async () => {
    setIsUploading(true);
    const pendingFiles = files.filter((f) => f.status === 'pending');

    for (const file of pendingFiles) {
      try {
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, status: 'uploading' } : f))
        );

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, progress: i } : f))
          );
        }

        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, status: 'success', progress: 100 } : f))
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, status: 'error', error: 'Upload failed' }
              : f
          )
        );
      }
    }

    setIsUploading(false);
    onUploadComplete?.(files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const successCount = files.filter((f) => f.status === 'success').length;
  const errorCount = files.filter((f) => f.status === 'error').length;
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900/50 rounded-lg border border-white/10">
      {/* Upload Area */}
      <motion.div
        className={`relative p-12 border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? 'border-cyan-500 bg-cyan-500/10'
            : 'border-white/20 bg-white/5 hover:border-white/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileInput}
          className="hidden"
          aria-label="Upload files"
        />

        <div className="text-center">
          <Upload className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Drag and drop your files here
          </h3>
          <p className="text-slate-400 mb-4">
            or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-cyan-500 hover:text-cyan-400 underline"
            >
              browse files
            </button>
          </p>
          <p className="text-sm text-slate-500">
            Up to {maxFiles} files, {maxSize / 1024 / 1024}MB each
          </p>
        </div>
      </motion.div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">
              Files ({files.length}/{maxFiles})
            </h4>
            {files.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-slate-400 hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-white/5 rounded border border-white/10">
              <p className="text-sm text-slate-400">Total Size</p>
              <p className="text-lg font-semibold text-white">{formatFileSize(totalSize)}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
              <p className="text-sm text-slate-400">Uploaded</p>
              <p className="text-lg font-semibold text-green-400">{successCount}</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded border border-red-500/20">
              <p className="text-sm text-slate-400">Errors</p>
              <p className="text-lg font-semibold text-red-400">{errorCount}</p>
            </div>
          </div>

          {/* File Items */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file) => (
              <motion.div
                key={file.id}
                className="p-4 bg-white/5 rounded border border-white/10 flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{file.name}</p>
                  <p className="text-sm text-slate-400">{formatFileSize(file.size)}</p>

                  {/* Progress Bar */}
                  {file.status === 'uploading' && (
                    <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Status Icon */}
                <div className="ml-4 flex-shrink-0">
                  {file.status === 'success' && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  )}
                  {file.status === 'uploading' && (
                    <Loader className="w-6 h-6 text-cyan-500 animate-spin" />
                  )}
                  {file.status === 'pending' && (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-400" />
                  )}
                </div>

                {/* Remove Button */}
                {file.status !== 'uploading' && (
                  <button
                    onClick={() => removeFile(file.id)}
                    className="ml-2 p-1 hover:bg-red-500/20 rounded transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-5 h-5 text-slate-400 hover:text-red-400" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Upload Button */}
          {files.some((f) => f.status === 'pending') && (
            <motion.button
              onClick={uploadFiles}
              disabled={isUploading}
              className="mt-6 w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}
