import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface EmailVerificationFlowProps {
  email?: string;
  token?: string;
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
}

type VerificationStep = 'input' | 'sent' | 'verifying' | 'success' | 'error';

/**
 * Email Verification Flow Component
 * Handles:
 * 1. Email input and validation
 * 2. Verification email sending
 * 3. Token verification from URL
 * 4. Status display
 */
export function EmailVerificationFlow({
  email: initialEmail,
  token: initialToken,
  onSuccess,
  onError,
}: EmailVerificationFlowProps) {
  const [step, setStep] = useState<VerificationStep>('input');
  const [email, setEmail] = useState(initialEmail || '');
  const [token, setToken] = useState(initialToken || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<{
    verified: boolean;
    expiresAt?: string;
  } | null>(null);

  // Auto-verify if token is provided in URL
  useEffect(() => {
    if (initialToken) {
      verifyToken(initialToken);
    }
  }, [initialToken]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendVerificationEmail = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/email/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification email');
      }

      setToken(data.token || '');
      setStep('sent');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification email';
      setError(errorMessage);
      setStep('error');
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async (tokenToVerify: string) => {
    setIsLoading(true);
    setStep('verifying');
    setError('');

    try {
      const response = await fetch('/api/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setVerificationStatus({
        verified: true,
        expiresAt: data.expiresAt,
      });
      setEmail(data.email);
      setStep('success');
      onSuccess?.(data.email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      setStep('error');
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const checkVerificationStatus = async (tokenToCheck: string) => {
    try {
      const response = await fetch(`/api/email/status/${tokenToCheck}`);
      const data = await response.json();

      if (data.success) {
        setVerificationStatus({
          verified: data.verified,
          expiresAt: data.expiresAt,
        });

        if (data.verified) {
          setStep('success');
          onSuccess?.(data.email);
        }
      }
    } catch (err) {
      console.error('Failed to check verification status:', err);
    }
  };

  const handleResendEmail = () => {
    setStep('input');
    setToken('');
    setError('');
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'input' && (
        <motion.div
          key="input"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-gray-400 mb-6">
              Enter your email to receive a verification link
            </p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendVerificationEmail()}
                className="w-full px-4 py-2 bg-[oklch(0.12_0.02_270)] border border-[oklch(0.2_0.02_270)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                disabled={isLoading}
              />

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={sendVerificationEmail}
                disabled={isLoading || !email}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Verification Email'
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {step === 'sent' && (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 max-w-md mx-auto">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Email Sent!</h2>
              <p className="text-gray-400 mb-4">
                We've sent a verification link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Check your inbox and click the verification link to confirm your email address.
              </p>

              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="w-full"
              >
                Resend Email
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {step === 'verifying' && (
        <motion.div
          key="verifying"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 max-w-md mx-auto">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-white mb-2">Verifying...</h2>
              <p className="text-gray-400">
                Please wait while we verify your email address.
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {step === 'success' && (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 max-w-md mx-auto">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-gray-400 mb-2">
                Thank you for verifying your email: <strong>{email}</strong>
              </p>
              {verificationStatus?.expiresAt && (
                <p className="text-xs text-gray-500">
                  Expires: {new Date(verificationStatus.expiresAt).toLocaleString()}
                </p>
              )}

              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-4">
                  You can now access exclusive features and receive updates about new tools.
                </p>
                <Button onClick={() => (window.location.href = '/')} className="w-full">
                  Back to Home
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {step === 'error' && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 max-w-md mx-auto">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
              <p className="text-gray-400 mb-4">{error}</p>

              <Button
                onClick={handleResendEmail}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
