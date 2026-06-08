import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Copy, Trash2, Share2, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface PresetsManagerProps {
  currentConfig: Record<string, unknown>;
  onLoadPreset: (config: Record<string, unknown>) => void;
  toolName: string;
}

export default function PresetsManager({
  currentConfig,
  onLoadPreset,
  toolName,
}: PresetsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);

  // Fetch user presets
  const { data: presets = [], isLoading } = trpc.presets.list.useQuery(undefined, {
    enabled: isOpen,
  }) as { data: Array<{ id: number; name: string; config: Record<string, unknown>; createdAt: Date }>; isLoading: boolean };

  // Save preset mutation
  const utils = trpc.useUtils();
  const savePresetMutation = trpc.presets.create.useMutation({
    onSuccess: (data) => {
      if (data) {
        toast.success(`Preset "${data.name}" saved`);
      }
      setPresetName("");
      setShowSaveForm(false);
      // Invalidate presets list to refetch
      utils.presets.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save preset");
    },
  });



  // Delete preset mutation
  const deletePresetMutation = trpc.presets.delete.useMutation({
    onSuccess: () => {
      toast.success("Preset deleted");
      // Invalidate presets list to refetch
      utils.presets.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete preset");
    },
  });

  // Share preset mutation
  const sharePresetMutation = trpc.presets.share.useMutation({
    onSuccess: (data) => {
      if (data?.shareToken) {
        const shareUrl = `${window.location.origin}?preset=${data.shareToken}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate share link");
    },
  });

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast.error("Please enter a preset name");
      return;
    }

    savePresetMutation.mutate({
      name: presetName,
      toolType: toolName,
      config: currentConfig,
    });
  };

  const handleLoadPreset = (presetId: string) => {
    // Find preset in list and load its config
    const preset = presets.find((p: any) => String(p.id) === presetId);
    if (preset) {
      onLoadPreset(preset.config);
      toast.success(`Preset "${preset.name}" loaded`);
    }
  };

  const handleDeletePreset = (presetId: string) => {
    deletePresetMutation.mutate({ presetId: parseInt(presetId, 10) });
  };

  const handleSharePreset = (presetId: string) => {
    sharePresetMutation.mutate({ presetId: parseInt(presetId, 10) });
  };

  const isLoading_any =
    savePresetMutation.isPending ||
    deletePresetMutation.isPending ||
    sharePresetMutation.isPending;

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="gap-2"
        disabled={isLoading_any}
      >
        <Save size={16} />
        Presets
        {presets.length > 0 && (
          <span className="ml-1 text-xs bg-cyan-500/30 px-2 py-0.5 rounded-full">
            {presets.length}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 w-72 bg-[oklch(0.12_0.02_270)] border border-[oklch(0.2_0.02_270)] rounded-lg shadow-xl z-50"
          >
            <div className="p-4 space-y-4">
              {/* Save Form */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">Save Current Configuration</h3>
                {!showSaveForm ? (
                  <Button
                    onClick={() => setShowSaveForm(true)}
                    variant="default"
                    size="sm"
                    className="w-full"
                    disabled={isLoading_any}
                  >
                    <Save size={14} className="mr-2" />
                    Save as Preset
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="Preset name..."
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="text-sm"
                      disabled={isLoading_any}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSavePreset}
                        size="sm"
                        className="flex-1"
                        disabled={isLoading_any}
                      >
                        {savePresetMutation.isPending && <Loader2 size={14} className="mr-1 animate-spin" />}
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setShowSaveForm(false);
                          setPresetName("");
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled={isLoading_any}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Presets List */}
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={16} className="animate-spin text-cyan-400" />
                </div>
              ) : presets.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-white/60">No presets yet</p>
                  <p className="text-xs text-white/40 mt-1">Save your first preset above</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <h3 className="text-sm font-semibold text-white">Your Presets</h3>
                  {presets.map((preset: any) => (
                    <motion.div
                      key={String(preset.id)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="p-2 rounded bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{preset.name}</p>
                          <p className="text-xs text-white/40">
                            {new Date(preset.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleLoadPreset(String(preset.id))}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Load preset"
                            disabled={isLoading_any}
                          >
                            <Copy size={14} className="text-cyan-400" />
                          </button>
                          <button
                            onClick={() => handleSharePreset(String(preset.id))}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Share preset"
                            disabled={isLoading_any}
                          >
                            <Share2 size={14} className="text-purple-400" />
                          </button>
                          <button
                            onClick={() => handleDeletePreset(String(preset.id))}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Delete preset"
                            disabled={isLoading_any}
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
