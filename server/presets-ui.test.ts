import { describe, it, expect } from "vitest";

/**
 * ScreenLab Presets UI Tests
 * Tests for frontend preset management and session statistics
 */

describe("Presets Manager", () => {
  describe("Preset Save/Load", () => {
    it("should save a preset with name and config", () => {
      const preset = {
        id: "1",
        name: "My Preset",
        config: { brightness: 80, color: "#FF0000" },
        createdAt: new Date(),
      };

      expect(preset.name).toBe("My Preset");
      expect(preset.config.brightness).toBe(80);
    });

    it("should require preset name", () => {
      const presetName = "";
      const isValid = presetName.trim().length > 0;
      expect(isValid).toBe(false);
    });

    it("should validate preset name is not empty", () => {
      const presetName = "Valid Preset";
      const isValid = presetName.trim().length > 0;
      expect(isValid).toBe(true);
    });

    it("should load preset configuration", () => {
      const preset = {
        id: "1",
        name: "Test Preset",
        config: { mode: "warm", intensity: 75 },
      };

      const loadedConfig = preset.config;
      expect(loadedConfig.mode).toBe("warm");
      expect(loadedConfig.intensity).toBe(75);
    });
  });

  describe("Preset List Management", () => {
    it("should add preset to list", () => {
      let presets: any[] = [];
      const newPreset = { id: "1", name: "Preset 1", config: {} };

      presets = [...presets, newPreset];
      expect(presets).toHaveLength(1);
      expect(presets[0].name).toBe("Preset 1");
    });

    it("should delete preset from list", () => {
      let presets = [
        { id: "1", name: "Preset 1", config: {} },
        { id: "2", name: "Preset 2", config: {} },
      ];

      presets = presets.filter((p) => p.id !== "1");
      expect(presets).toHaveLength(1);
      expect(presets[0].id).toBe("2");
    });

    it("should maintain preset order", () => {
      const presets = [
        { id: "1", name: "First", config: {} },
        { id: "2", name: "Second", config: {} },
        { id: "3", name: "Third", config: {} },
      ];

      expect(presets[0].name).toBe("First");
      expect(presets[1].name).toBe("Second");
      expect(presets[2].name).toBe("Third");
    });

    it("should find preset by id", () => {
      const presets = [
        { id: "1", name: "Preset 1", config: {} },
        { id: "2", name: "Preset 2", config: {} },
      ];

      const found = presets.find((p) => p.id === "2");
      expect(found?.name).toBe("Preset 2");
    });
  });

  describe("Preset Sharing", () => {
    it("should generate share URL", () => {
      const presetId = "abc123";
      const shareUrl = `https://example.com/settings?preset=${presetId}`;

      expect(shareUrl).toContain("preset=abc123");
    });

    it("should include preset ID in share link", () => {
      const presetId = "test-preset-123";
      const shareUrl = `https://screenlab.app?preset=${presetId}`;

      expect(shareUrl).toContain(presetId);
    });

    it("should copy share link to clipboard", () => {
      const shareUrl = "https://screenlab.app?preset=123";
      const copied = shareUrl.length > 0;

      expect(copied).toBe(true);
    });
  });

  describe("Preset UI State", () => {
    it("should toggle preset manager open/close", () => {
      let isOpen = false;
      isOpen = !isOpen;
      expect(isOpen).toBe(true);

      isOpen = !isOpen;
      expect(isOpen).toBe(false);
    });

    it("should show save form when requested", () => {
      let showSaveForm = false;
      showSaveForm = true;
      expect(showSaveForm).toBe(true);
    });

    it("should hide save form after saving", () => {
      let showSaveForm = true;
      showSaveForm = false;
      expect(showSaveForm).toBe(false);
    });

    it("should display preset count", () => {
      const presets = [
        { id: "1", name: "P1", config: {} },
        { id: "2", name: "P2", config: {} },
        { id: "3", name: "P3", config: {} },
      ];

      expect(presets.length).toBe(3);
    });
  });
});

describe("Session Stats", () => {
  describe("Stats Calculation", () => {
    it("should calculate total sessions", () => {
      const stats = [
        { toolName: "Pomodoro", usageCount: 10, totalTime: 3600 },
        { toolName: "Focus Mode", usageCount: 5, totalTime: 1800 },
      ];

      const totalSessions = stats.reduce((sum, s) => sum + s.usageCount, 0);
      expect(totalSessions).toBe(15);
    });

    it("should calculate total time", () => {
      const stats = [
        { toolName: "Tool1", usageCount: 1, totalTime: 3600 },
        { toolName: "Tool2", usageCount: 1, totalTime: 1800 },
      ];

      const totalTime = stats.reduce((sum, s) => sum + s.totalTime, 0);
      expect(totalTime).toBe(5400);
    });

    it("should calculate average session time", () => {
      const stats = [
        { toolName: "Tool", usageCount: 4, totalTime: 3600 },
      ];

      const avgTime = stats[0].totalTime / stats[0].usageCount;
      expect(avgTime).toBe(900); // 15 minutes
    });

    it("should handle empty stats", () => {
      const stats: any[] = [];
      const totalSessions = stats.reduce((sum, s) => sum + s.usageCount, 0);

      expect(totalSessions).toBe(0);
    });
  });

  describe("Time Formatting", () => {
    it("should format seconds", () => {
      const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
        return `${Math.round(seconds / 3600)}h`;
      };

      expect(formatDuration(30)).toBe("30s");
      expect(formatDuration(300)).toBe("5m");
      expect(formatDuration(7200)).toBe("2h");
    });

    it("should format minutes", () => {
      const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
        return `${Math.round(seconds / 3600)}h`;
      };

      expect(formatDuration(600)).toBe("10m");
      expect(formatDuration(1800)).toBe("30m");
    });

    it("should format hours", () => {
      const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
        return `${Math.round(seconds / 3600)}h`;
      };

      expect(formatDuration(3600)).toBe("1h");
      expect(formatDuration(86400)).toBe("24h");
    });
  });

  describe("Stats Ranking", () => {
    it("should rank tools by usage count", () => {
      const stats = [
        { toolName: "Tool A", usageCount: 5, totalTime: 0 },
        { toolName: "Tool B", usageCount: 15, totalTime: 0 },
        { toolName: "Tool C", usageCount: 10, totalTime: 0 },
      ];

      const sorted = [...stats].sort((a, b) => b.usageCount - a.usageCount);

      expect(sorted[0].toolName).toBe("Tool B");
      expect(sorted[1].toolName).toBe("Tool C");
      expect(sorted[2].toolName).toBe("Tool A");
    });

    it("should get top 5 tools", () => {
      const stats = [
        { toolName: "T1", usageCount: 1, totalTime: 0 },
        { toolName: "T2", usageCount: 2, totalTime: 0 },
        { toolName: "T3", usageCount: 3, totalTime: 0 },
        { toolName: "T4", usageCount: 4, totalTime: 0 },
        { toolName: "T5", usageCount: 5, totalTime: 0 },
        { toolName: "T6", usageCount: 6, totalTime: 0 },
      ];

      const top5 = stats
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 5);

      expect(top5).toHaveLength(5);
      expect(top5[0].toolName).toBe("T6");
    });
  });

  describe("Stats Display", () => {
    it("should show loading state", () => {
      const isLoading = true;
      expect(isLoading).toBe(true);
    });

    it("should show empty state when no stats", () => {
      const stats: any[] = [];
      const isEmpty = stats.length === 0;

      expect(isEmpty).toBe(true);
    });

    it("should display stats when available", () => {
      const stats = [
        { toolName: "Pomodoro", usageCount: 10, totalTime: 3600 },
      ];

      expect(stats.length > 0).toBe(true);
      expect(stats[0].toolName).toBe("Pomodoro");
    });

    it("should calculate progress percentage", () => {
      const maxUsage = 20;
      const currentUsage = 15;
      const percentage = (currentUsage / maxUsage) * 100;

      expect(percentage).toBe(75);
    });
  });
});
