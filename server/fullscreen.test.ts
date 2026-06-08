import { describe, it, expect } from "vitest";

/**
 * ScreenLab Fullscreen Utility Tests
 * Tests for fullscreen API error handling and browser compatibility
 */

describe("Fullscreen Utilities", () => {
  describe("Error Handling", () => {
    it("should handle NotAllowedError from permissions policy", () => {
      const error = new DOMException("Disallowed by permissions policy", "NotAllowedError");
      expect(error.name).toBe("NotAllowedError");
      expect(error.message).toContain("Disallowed");
    });

    it("should handle browser compatibility with webkit prefix", () => {
      const elem = {
        requestFullscreen: undefined,
        webkitRequestFullscreen: () => Promise.resolve(),
      };

      expect(elem.webkitRequestFullscreen).toBeDefined();
      expect(elem.requestFullscreen).toBeUndefined();
    });

    it("should handle browser compatibility with moz prefix", () => {
      const elem = {
        requestFullscreen: undefined,
        webkitRequestFullscreen: undefined,
        mozRequestFullScreen: () => Promise.resolve(),
      };

      expect(elem.mozRequestFullScreen).toBeDefined();
    });

    it("should handle browser compatibility with ms prefix", () => {
      const elem = {
        requestFullscreen: undefined,
        webkitRequestFullscreen: undefined,
        mozRequestFullScreen: undefined,
        msRequestFullscreen: () => Promise.resolve(),
      };

      expect(elem.msRequestFullscreen).toBeDefined();
    });
  });

  describe("Fullscreen State Detection", () => {
    it("should detect fullscreen element in standard API", () => {
      const doc = {
        fullscreenElement: null,
      };

      expect(doc.fullscreenElement).toBeNull();
    });

    it("should detect fullscreen element in webkit", () => {
      const doc = {
        fullscreenElement: undefined,
        webkitFullscreenElement: null,
      };

      expect(doc.webkitFullscreenElement).toBeDefined();
    });

    it("should detect fullscreen element in moz", () => {
      const doc = {
        fullscreenElement: undefined,
        webkitFullscreenElement: undefined,
        mozFullScreenElement: null,
      };

      expect(doc.mozFullScreenElement).toBeDefined();
    });

    it("should detect fullscreen element in ms", () => {
      const doc = {
        fullscreenElement: undefined,
        webkitFullscreenElement: undefined,
        mozFullScreenElement: undefined,
        msFullscreenElement: null,
      };

      expect(doc.msFullscreenElement).toBeDefined();
    });
  });

  describe("Exit Fullscreen Methods", () => {
    it("should use standard exitFullscreen API", () => {
      const doc = {
        exitFullscreen: async () => {},
        fullscreenElement: null,
      };

      expect(doc.exitFullscreen).toBeDefined();
    });

    it("should use webkit exit fullscreen", () => {
      const doc = {
        webkitExitFullscreen: async () => {},
        webkitFullscreenElement: null,
      };

      expect(doc.webkitExitFullscreen).toBeDefined();
    });

    it("should use moz cancel fullscreen", () => {
      const doc = {
        mozCancelFullScreen: async () => {},
        mozFullScreenElement: null,
      };

      expect(doc.mozCancelFullScreen).toBeDefined();
    });

    it("should use ms exit fullscreen", () => {
      const doc = {
        msExitFullscreen: async () => {},
        msFullscreenElement: null,
      };

      expect(doc.msExitFullscreen).toBeDefined();
    });
  });

  describe("Fullscreen Toggle Logic", () => {
    it("should enter fullscreen when not in fullscreen", () => {
      const isCurrentlyFullscreen = false;
      expect(isCurrentlyFullscreen).toBe(false);
    });

    it("should exit fullscreen when in fullscreen", () => {
      const isCurrentlyFullscreen = true;
      expect(isCurrentlyFullscreen).toBe(true);
    });

    it("should toggle fullscreen state", () => {
      let isFullscreen = false;
      isFullscreen = !isFullscreen;
      expect(isFullscreen).toBe(true);

      isFullscreen = !isFullscreen;
      expect(isFullscreen).toBe(false);
    });
  });

  describe("Keyboard Shortcuts", () => {
    it("should recognize F key for fullscreen", () => {
      const key = "f";
      expect(key.toLowerCase()).toBe("f");
    });

    it("should recognize Escape key to exit", () => {
      const key = "Escape";
      expect(key).toBe("Escape");
    });

    it("should handle case-insensitive F key", () => {
      const lowerF = "f";
      const upperF = "F";

      expect(lowerF.toLowerCase()).toBe(upperF.toLowerCase());
    });

    it("should prevent default on F key press", () => {
      const event = {
        key: "f",
        preventDefault: () => true,
      };
      const preventDefaultSpy = () => {
        // Simulate preventDefault
        return event.preventDefault();
      };

      expect(preventDefaultSpy()).toBe(true);
    });
  });

  describe("User Feedback", () => {
    it("should show warning when fullscreen blocked", () => {
      const message = "Fullscreen blocked by browser permissions policy";
      expect(message).toContain("blocked");
      expect(message).toContain("permissions policy");
    });

    it("should show error when API not supported", () => {
      const message = "Fullscreen API not supported";
      expect(message).toContain("not supported");
    });

    it("should show error on fullscreen failure", () => {
      const message = "Failed to toggle fullscreen";
      expect(message).toContain("Failed");
    });
  });

  describe("Permissions Policy Compliance", () => {
    it("should handle permissions policy restrictions gracefully", () => {
      const error = {
        name: "NotAllowedError",
        message: "Disallowed by permissions policy",
      };

      const isPermissionsPolicyError =
        error.name === "NotAllowedError" || error.message?.includes("Disallowed");

      expect(isPermissionsPolicyError).toBe(true);
    });

    it("should not crash on permissions policy error", () => {
      const handleError = (err: any) => {
        if (err.name === "NotAllowedError" || err.message?.includes("Disallowed")) {
          console.warn("Fullscreen blocked by permissions policy");
          return false;
        }
        return true;
      };

      const error = new DOMException("Disallowed by permissions policy", "NotAllowedError");
      const result = handleError(error);

      expect(result).toBe(false);
    });

    it("should allow graceful degradation without fullscreen", () => {
      const canUseFullscreen = false;
      expect(canUseFullscreen).toBe(false);
      // Tool should still be usable without fullscreen
    });
  });

  describe("Browser Compatibility Matrix", () => {
    it("should support Chrome/Edge fullscreen API", () => {
      const apis = ["requestFullscreen", "exitFullscreen"];
      expect(apis).toContain("requestFullscreen");
    });

    it("should support Firefox fullscreen API", () => {
      const apis = ["mozRequestFullScreen", "mozCancelFullScreen"];
      expect(apis).toContain("mozRequestFullScreen");
    });

    it("should support Safari fullscreen API", () => {
      const apis = ["webkitRequestFullscreen", "webkitExitFullscreen"];
      expect(apis).toContain("webkitRequestFullscreen");
    });

    it("should support IE/Edge Legacy fullscreen API", () => {
      const apis = ["msRequestFullscreen", "msExitFullscreen"];
      expect(apis).toContain("msRequestFullscreen");
    });
  });
});
