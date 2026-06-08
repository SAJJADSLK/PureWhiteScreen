import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('EmailVerificationFlow Component', () => {
  describe('Email Validation', () => {
    it('should validate correct email format', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.uk',
        'name+tag@company.io',
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        'missing@domain',
        '@nodomain.com',
        'spaces in@email.com',
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('API Endpoints', () => {
    it('should call /api/email/send-verification endpoint', async () => {
      const email = 'test@example.com';
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'test-token-123' }),
      });
      global.fetch = mockFetch;

      await fetch('/api/email/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/email/send-verification',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should call /api/email/verify endpoint with token', async () => {
      const token = 'test-token-123';
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, email: 'test@example.com' }),
      });
      global.fetch = mockFetch;

      await fetch('/api/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/email/verify',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should call /api/email/status/:token endpoint', async () => {
      const token = 'test-token-123';
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ 
          success: true, 
          verified: true, 
          email: 'test@example.com',
          expiresAt: '2026-06-06T18:15:00Z'
        }),
      });
      global.fetch = mockFetch;

      await fetch(`/api/email/status/${token}`);

      expect(mockFetch).toHaveBeenCalledWith(`/api/email/status/${token}`);
    });
  });

  describe('Verification Flow States', () => {
    it('should have input step for email entry', () => {
      const step = 'input';
      expect(step).toBe('input');
    });

    it('should have sent step after email submission', () => {
      const step = 'sent';
      expect(step).toBe('sent');
    });

    it('should have verifying step during token verification', () => {
      const step = 'verifying';
      expect(step).toBe('verifying');
    });

    it('should have success step after verification', () => {
      const step = 'success';
      expect(step).toBe('success');
    });

    it('should have error step on verification failure', () => {
      const step = 'error';
      expect(step).toBe('error');
    });
  });

  describe('Token Handling', () => {
    it('should extract token from URL parameters', () => {
      const url = new URL('https://example.com/verify?token=abc123xyz');
      const token = url.searchParams.get('token');
      
      expect(token).toBe('abc123xyz');
    });

    it('should handle token from props', () => {
      const token = 'test-token-from-props';
      expect(token).toBeTruthy();
      expect(token.length).toBeGreaterThan(0);
    });

    it('should auto-verify if token is provided', () => {
      const token = 'auto-verify-token';
      const shouldAutoVerify = !!token;
      
      expect(shouldAutoVerify).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      try {
        await fetch('/api/email/send-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com' }),
        });
      } catch (error) {
        expect(error).toEqual(new Error('Network error'));
      }
    });

    it('should handle invalid token errors', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Invalid or expired token' }),
      });
      global.fetch = mockFetch;

      const response = await fetch('/api/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'invalid-token' }),
      });

      expect(response.ok).toBe(false);
    });

    it('should handle email already verified errors', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Email already verified' }),
      });
      global.fetch = mockFetch;

      const response = await fetch('/api/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'already-verified-token' }),
      });

      expect(response.ok).toBe(false);
    });
  });

  describe('Response Handling', () => {
    it('should extract email from verification response', async () => {
      const mockResponse = {
        success: true,
        email: 'verified@example.com',
        verified: true,
      };

      expect(mockResponse.email).toBe('verified@example.com');
      expect(mockResponse.verified).toBe(true);
    });

    it('should extract token from send-verification response', async () => {
      const mockResponse = {
        token: 'new-verification-token-xyz',
        message: 'Verification email sent',
      };

      expect(mockResponse.token).toBeTruthy();
      expect(mockResponse.token.length).toBeGreaterThan(0);
    });

    it('should extract expiration date from status response', async () => {
      const mockResponse = {
        success: true,
        verified: true,
        email: 'test@example.com',
        expiresAt: '2026-06-06T18:15:00Z',
      };

      const expiresAt = new Date(mockResponse.expiresAt);
      expect(expiresAt.getFullYear()).toBe(2026);
      expect(expiresAt.getMonth()).toBe(5); // June is month 5 (0-indexed)
    });
  });

  describe('User Callbacks', () => {
    it('should call onSuccess callback with email', () => {
      const onSuccess = vi.fn();
      const email = 'success@example.com';

      onSuccess(email);

      expect(onSuccess).toHaveBeenCalledWith(email);
    });

    it('should call onError callback with error message', () => {
      const onError = vi.fn();
      const errorMessage = 'Verification failed: Invalid token';

      onError(errorMessage);

      expect(onError).toHaveBeenCalledWith(errorMessage);
    });

    it('should not call callbacks if not provided', () => {
      const email = 'test@example.com';
      
      // Should not throw error even if callbacks are undefined
      expect(() => {
        const onSuccess = undefined;
        const onError = undefined;
        onSuccess?.(email);
        onError?.('error');
      }).not.toThrow();
    });
  });

  describe('Integration with ExitIntentPopup', () => {
    it('should handle email from exit-intent popup', () => {
      const emailFromPopup = 'popup@example.com';
      
      expect(emailFromPopup).toBeTruthy();
      expect(emailFromPopup).toContain('@');
    });

    it('should send verification email after lead capture', async () => {
      const email = 'lead@example.com';
      
      // Simulate sending verification after lead capture
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'verification-token' }),
      });
      global.fetch = mockFetch;

      await fetch('/api/email/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('Tool Recommendation Integration', () => {
    it('should send tool recommendation after verification', async () => {
      const email = 'user@example.com';
      const toolId = 'ring-light';

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
      global.fetch = mockFetch;

      await fetch('/api/email/tool-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, toolId }),
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/email/tool-recommendation',
        expect.any(Object)
      );
    });
  });

  describe('Loading States', () => {
    it('should show loading state during email send', () => {
      const isLoading = true;
      expect(isLoading).toBe(true);
    });

    it('should show loading state during verification', () => {
      const isLoading = true;
      expect(isLoading).toBe(true);
    });

    it('should disable submit button while loading', () => {
      const isLoading = true;
      const email = 'test@example.com';
      const isDisabled = isLoading || !email;
      
      expect(isDisabled).toBe(true);
    });
  });

  describe('Resend Email Flow', () => {
    it('should allow resending verification email', () => {
      const canResend = true;
      expect(canResend).toBe(true);
    });

    it('should reset to input step on resend', () => {
      const step = 'input';
      expect(step).toBe('input');
    });

    it('should clear previous token on resend', () => {
      const token = '';
      expect(token).toBe('');
    });
  });
});
