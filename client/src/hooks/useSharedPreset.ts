import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { getShareTokenFromUrl } from '@/lib/presetUtils';
import { toast } from 'sonner';

interface UseSharedPresetResult {
  config: Record<string, unknown> | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to load shared preset from URL query parameter
 * Fetches preset config using share token if present in URL
 */
export function useSharedPreset(): UseSharedPresetResult {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const shareToken = getShareTokenFromUrl();

  // Query for shared preset
  const { data: sharedPreset, isLoading: isQueryLoading, error: queryError } = trpc.presets.getByShareToken.useQuery(
    { shareToken: shareToken || '' },
    { enabled: !!shareToken }
  );

  useEffect(() => {
    if (!shareToken) {
      setConfig(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(isQueryLoading);

    if (queryError) {
      setError(new Error(queryError.message || 'Failed to load shared preset'));
      toast.error('Failed to load shared preset');
    } else if (sharedPreset && sharedPreset.config) {
      setConfig(sharedPreset.config as Record<string, unknown>);
      toast.success(`Loaded shared preset: ${sharedPreset.name}`);
    }
  }, [shareToken, sharedPreset, isQueryLoading, queryError]);

  return {
    config: config as Record<string, unknown> | null,
    isLoading: isLoading || isQueryLoading,
    error,
  };
}
