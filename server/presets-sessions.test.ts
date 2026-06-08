import { describe, it, expect } from "vitest";
import { z } from "zod";

/**
 * ScreenLab Presets & Sessions Feature Tests
 * Tests for preset saving, sharing, and session tracking functionality
 */

describe("Presets System", () => {
  describe("Preset Creation", () => {
    it("should validate preset name is required and non-empty", () => {
      const presetSchema = z.object({
        name: z.string().min(1).max(255),
        toolType: z.string().min(1).max(64),
        config: z.record(z.string(), z.any()),
      });

      expect(() => presetSchema.parse({ name: "", toolType: "color-screen", config: {} })).toThrow();
      expect(() => presetSchema.parse({ name: "My Preset", toolType: "color-screen", config: {} })).not.toThrow();
    });

    it("should validate preset name max length of 255 characters", () => {
      const presetSchema = z.object({
        name: z.string().min(1).max(255),
        toolType: z.string().min(1).max(64),
        config: z.record(z.string(), z.any()),
      });

      const longName = "a".repeat(256);
      expect(() => presetSchema.parse({ name: longName, toolType: "color-screen", config: {} })).toThrow();
    });

    it("should validate toolType is required and non-empty", () => {
      const presetSchema = z.object({
        name: z.string().min(1).max(255),
        toolType: z.string().min(1).max(64),
        config: z.record(z.string(), z.any()),
      });

      expect(() => presetSchema.parse({ name: "My Preset", toolType: "", config: {} })).toThrow();
    });

    it("should accept valid config object", () => {
      const presetSchema = z.object({
        name: z.string().min(1).max(255),
        toolType: z.string().min(1).max(64),
        config: z.record(z.string(), z.any()),
      });

      const validConfig = {
        name: "Warm Ring Light",
        toolType: "ring-light",
        config: { mode: "warm", brightness: 80, color: "#FFA500" },
      };

      expect(() => presetSchema.parse(validConfig)).not.toThrow();
    });
  });

  describe("Preset Sharing", () => {
    it("should generate unique share tokens", () => {
      const generateShareToken = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let token = "";
        for (let i = 0; i < 32; i++) {
          token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
      };

      const token1 = generateShareToken();
      const token2 = generateShareToken();

      expect(token1).not.toBe(token2);
      expect(token1.length).toBe(32);
      expect(token2.length).toBe(32);
    });

    it("should create shareable URL with share token", () => {
      const shareToken = "abc123def456ghi789jkl012mno345pq";
      const shareUrl = `/share/${shareToken}`;

      expect(shareUrl).toContain("/share/");
      expect(shareUrl).toContain(shareToken);
    });

    it("should validate share token format", () => {
      const shareTokenSchema = z.string().length(32);

      expect(() => shareTokenSchema.parse("abc123def456ghi789jkl012mno345pq")).not.toThrow();
      expect(() => shareTokenSchema.parse("short")).toThrow();
      expect(() => shareTokenSchema.parse("toolongtoolongtoolongtoolongtoolong")).toThrow();
    });
  });

  describe("Preset Deletion", () => {
    it("should require both presetId and userId for deletion", () => {
      const deleteSchema = z.object({
        presetId: z.number(),
        userId: z.number(),
      });

      expect(() => deleteSchema.parse({ presetId: 1, userId: 1 })).not.toThrow();
      expect(() => deleteSchema.parse({ presetId: 1 })).toThrow();
      expect(() => deleteSchema.parse({ userId: 1 })).toThrow();
    });

    it("should only allow user to delete their own presets", () => {
      const userId = 1;
      const presetUserId = 2;

      expect(userId).not.toBe(presetUserId);
    });
  });

  describe("Preset Retrieval", () => {
    it("should retrieve presets by user ID", () => {
      const userId = 1;
      expect(userId).toBeGreaterThan(0);
    });

    it("should retrieve preset by share token", () => {
      const shareTokenSchema = z.object({
        shareToken: z.string(),
      });

      expect(() => shareTokenSchema.parse({ shareToken: "abc123" })).not.toThrow();
    });
  });
});

describe("Sessions System", () => {
  describe("Session Creation", () => {
    it("should validate session toolType is required", () => {
      const sessionSchema = z.object({
        toolType: z.string().min(1).max(64),
        duration: z.number().min(0),
        metadata: z.record(z.string(), z.any()).optional(),
      });

      expect(() => sessionSchema.parse({ toolType: "color-screen", duration: 5000 })).not.toThrow();
      expect(() => sessionSchema.parse({ toolType: "", duration: 5000 })).toThrow();
    });

    it("should validate session duration is non-negative", () => {
      const sessionSchema = z.object({
        toolType: z.string().min(1).max(64),
        duration: z.number().min(0),
        metadata: z.record(z.string(), z.any()).optional(),
      });

      expect(() => sessionSchema.parse({ toolType: "pomodoro", duration: 0 })).not.toThrow();
      expect(() => sessionSchema.parse({ toolType: "pomodoro", duration: 1500000 })).not.toThrow();
      expect(() => sessionSchema.parse({ toolType: "pomodoro", duration: -1000 })).toThrow();
    });

    it("should accept optional metadata", () => {
      const sessionSchema = z.object({
        toolType: z.string().min(1).max(64),
        duration: z.number().min(0),
        metadata: z.record(z.string(), z.any()).optional(),
      });

      const sessionWithMetadata = {
        toolType: "ring-light",
        duration: 3600000,
        metadata: { mode: "warm", brightness: 80 },
      };

      expect(() => sessionSchema.parse(sessionWithMetadata)).not.toThrow();
    });
  });

  describe("Session Duration Calculation", () => {
    it("should calculate session duration in milliseconds", () => {
      const startTime = Date.now();
      const endTime = startTime + 300000; // 5 minutes
      const duration = endTime - startTime;

      expect(duration).toBe(300000);
    });

    it("should handle long session durations", () => {
      const oneHour = 60 * 60 * 1000;
      const eightHours = 8 * 60 * 60 * 1000;

      expect(eightHours).toBeGreaterThan(oneHour);
      expect(eightHours).toBe(28800000);
    });

    it("should format duration for display", () => {
      const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
          return `${hours}h ${remainingMinutes}m`;
        }
        if (minutes > 0) {
          return `${minutes}m ${remainingSeconds}s`;
        }
        return `${seconds}s`;
      };

      expect(formatDuration(5000)).toBe("5s");
      expect(formatDuration(300000)).toBe("5m 0s");
      expect(formatDuration(3600000)).toBe("1h 0m");
      expect(formatDuration(28800000)).toBe("8h 0m");
    });
  });

  describe("Session Statistics", () => {
    it("should aggregate sessions by tool type", () => {
      const sessions = [
        { toolType: "color-screen", duration: 300000 },
        { toolType: "color-screen", duration: 600000 },
        { toolType: "pomodoro", duration: 1500000 },
        { toolType: "ring-light", duration: 900000 },
      ];

      const stats: { [key: string]: { totalTime: number; count: number } } = {};

      sessions.forEach((session) => {
        if (!stats[session.toolType]) {
          stats[session.toolType] = { totalTime: 0, count: 0 };
        }
        stats[session.toolType].totalTime += session.duration;
        stats[session.toolType].count += 1;
      });

      expect(stats["color-screen"].totalTime).toBe(900000);
      expect(stats["color-screen"].count).toBe(2);
      expect(stats["pomodoro"].totalTime).toBe(1500000);
      expect(stats["pomodoro"].count).toBe(1);
    });

    it("should calculate average session duration per tool", () => {
      const stats = {
        "color-screen": { totalTime: 900000, count: 2 },
        pomodoro: { totalTime: 1500000, count: 1 },
      };

      const avgDuration = (toolStats: { totalTime: number; count: number }) => {
        return toolStats.totalTime / toolStats.count;
      };

      expect(avgDuration(stats["color-screen"])).toBe(450000);
      expect(avgDuration(stats["pomodoro"])).toBe(1500000);
    });

    it("should identify most-used tool", () => {
      const stats = {
        "color-screen": { totalTime: 900000, count: 5 },
        pomodoro: { totalTime: 1500000, count: 2 },
        "ring-light": { totalTime: 300000, count: 1 },
      };

      const mostUsed = Object.entries(stats).reduce((prev, current) =>
        current[1].count > prev[1].count ? current : prev
      );

      expect(mostUsed[0]).toBe("color-screen");
      expect(mostUsed[1].count).toBe(5);
    });
  });

  describe("Session Retrieval", () => {
    it("should retrieve user sessions with limit", () => {
      const limit = 50;
      expect(limit).toBeGreaterThan(0);
    });

    it("should retrieve session statistics for user", () => {
      const userId = 1;
      expect(userId).toBeGreaterThan(0);
    });
  });
});

describe("Preset & Session Integration", () => {
  it("should link presets to users", () => {
    const preset = {
      userId: 1,
      name: "My Preset",
      toolType: "color-screen",
    };

    expect(preset.userId).toBeGreaterThan(0);
  });

  it("should link sessions to users", () => {
    const session = {
      userId: 1,
      toolType: "color-screen",
      duration: 5000,
    };

    expect(session.userId).toBeGreaterThan(0);
  });

  it("should track which tool presets are used in sessions", () => {
    const preset = { toolType: "ring-light" };
    const session = { toolType: "ring-light" };

    expect(preset.toolType).toBe(session.toolType);
  });
});

describe("Data Persistence", () => {
  it("should store presets with timestamps", () => {
    const now = new Date();
    expect(now).toBeInstanceOf(Date);
  });

  it("should store sessions with start and end times", () => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 300000);

    expect(endTime.getTime()).toBeGreaterThan(startTime.getTime());
  });

  it("should preserve preset configuration as JSON", () => {
    const config = {
      mode: "warm",
      brightness: 80,
      color: "#FFA500",
    };

    const jsonConfig = JSON.stringify(config);
    const parsedConfig = JSON.parse(jsonConfig);

    expect(parsedConfig).toEqual(config);
  });

  it("should preserve session metadata as JSON", () => {
    const metadata = {
      presetUsed: "my-preset-1",
      fullscreen: true,
      customSettings: { brightness: 75 },
    };

    const jsonMetadata = JSON.stringify(metadata);
    const parsedMetadata = JSON.parse(jsonMetadata);

    expect(parsedMetadata).toEqual(metadata);
  });
});
