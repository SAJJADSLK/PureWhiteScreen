/**
 * Accessibility utilities for ScreenLab
 * Provides helpers for ARIA labels, focus management, and semantic HTML
 */

/**
 * Generate ARIA label for tool cards
 */
export function getToolAriaLabel(toolName: string, description: string): string {
  return `${toolName}: ${description}`;
}

/**
 * Generate ARIA label for mode buttons
 */
export function getModeAriaLabel(modeName: string, isActive: boolean): string {
  return `${modeName} mode${isActive ? ' (currently active)' : ''}`;
}

/**
 * Generate ARIA label for timer/countdown
 */
export function getTimerAriaLabel(minutes: number, seconds: number, isRunning: boolean): string {
  const status = isRunning ? 'running' : 'paused';
  return `Timer: ${minutes} minutes ${seconds} seconds, ${status}`;
}

/**
 * Generate ARIA label for slider/range input
 */
export function getSliderAriaLabel(label: string, value: number, min: number, max: number): string {
  return `${label}: ${value} out of ${max}`;
}

/**
 * Generate ARIA label for color picker
 */
export function getColorAriaLabel(r: number, g: number, b: number, hex: string): string {
  return `Color picker: RGB(${r}, ${g}, ${b}), Hex ${hex}`;
}

/**
 * Get keyboard shortcut help text
 */
export function getKeyboardShortcutHelp(): string {
  return `Keyboard shortcuts: F to toggle fullscreen, Escape to exit, Space to pause/resume timers`;
}

/**
 * Generate ARIA live region announcement for tool launch
 */
export function getToolLaunchAnnouncement(toolName: string): string {
  return `${toolName} tool has been launched. Press Tab to navigate to controls.`;
}

/**
 * Generate ARIA label for preset actions
 */
export function getPresetAriaLabel(presetName: string, action: 'save' | 'load' | 'delete' | 'share'): string {
  const actions = {
    save: 'Save preset',
    load: 'Load preset',
    delete: 'Delete preset',
    share: 'Share preset',
  };
  return `${actions[action]}: ${presetName}`;
}

/**
 * Generate ARIA label for social proof/testimonials
 */
export function getTestimonialAriaLabel(authorName: string, role: string): string {
  return `Testimonial from ${authorName}, ${role}`;
}

/**
 * Generate ARIA label for persona cards
 */
export function getPersonaAriaLabel(personaName: string, description: string): string {
  return `${personaName}: ${description}. Click to explore recommended tools.`;
}

/**
 * Generate ARIA label for community links
 */
export function getCommunityLinkAriaLabel(platform: string, action: string): string {
  return `${action} on ${platform}. Opens in new window.`;
}

/**
 * Announce to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Focus management helper
 */
export function focusElement(element: HTMLElement | null, announce?: string): void {
  if (element) {
    element.focus();
    if (announce) {
      announceToScreenReader(announce);
    }
  }
}

/**
 * Trap focus within modal/dialog
 */
export function trapFocus(element: HTMLElement): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement?.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement?.focus();
      e.preventDefault();
    }
  };
}
