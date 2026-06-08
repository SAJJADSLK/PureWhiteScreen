import { useEffect, useRef } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';

export interface SessionData {
  sessionId: string;
  userId?: string | undefined;
  startTime: number;
  lastActivityTime: number;
  toolsUsed: string[];
  totalDuration: number;
  pageViews: number;
}

/**
 * Hook to track user sessions and activity
 */
export function useSessionTracking() {
  const { user } = useAuth();
  const sessionRef = useRef<SessionData | null>(null);
  const activityTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Initialize session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionRef.current = {
      sessionId,
      userId: user?.id ? String(user.id) : undefined,
      startTime: Date.now(),
      lastActivityTime: Date.now(),
      toolsUsed: [],
      totalDuration: 0,
      pageViews: 1,
    };

    // Store session in localStorage
    try {
      localStorage.setItem('current_session', JSON.stringify(sessionRef.current));
    } catch (e) {
      console.warn('Failed to store session', e);
    }

    // Track activity
    const handleActivity = () => {
      if (sessionRef.current) {
        sessionRef.current.lastActivityTime = Date.now();

        // Clear existing timeout
        if (activityTimeoutRef.current) {
          clearTimeout(activityTimeoutRef.current);
        }

        // Save session after activity
        try {
          localStorage.setItem('current_session', JSON.stringify(sessionRef.current));
        } catch (e) {
          console.warn('Failed to update session', e);
        }
      }
    };

    // Add event listeners
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('mousemove', handleActivity);

    // Cleanup
    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('mousemove', handleActivity);

      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }

      // Save final session data
      if (sessionRef.current) {
        sessionRef.current.totalDuration = Date.now() - sessionRef.current.startTime;
        try {
          localStorage.setItem('session_history', JSON.stringify([sessionRef.current]));
        } catch (e) {
          console.warn('Failed to save session history', e);
        }
      }
    };
  }, [user?.id]);

  /**
   * Track tool usage
   */
  const trackToolUsage = (toolName: string) => {
    if (sessionRef.current && !sessionRef.current.toolsUsed.includes(toolName)) {
      sessionRef.current.toolsUsed.push(toolName);
      try {
        localStorage.setItem('current_session', JSON.stringify(sessionRef.current));
      } catch (e) {
        console.warn('Failed to update tool usage', e);
      }
    }
  };

  /**
   * Track page view
   */
  const trackPageView = () => {
    if (sessionRef.current) {
      sessionRef.current.pageViews += 1;
      try {
        localStorage.setItem('current_session', JSON.stringify(sessionRef.current));
      } catch (e) {
        console.warn('Failed to update page views', e);
      }
    }
  };

  /**
   * Get current session data
   */
  const getSessionData = (): SessionData | null => {
    return sessionRef.current;
  };

  /**
   * Get session history
   */
  const getSessionHistory = (): SessionData[] => {
    try {
      const history = localStorage.getItem('session_history');
      return history ? JSON.parse(history) : [];
    } catch (e) {
      console.warn('Failed to retrieve session history', e);
      return [];
    }
  };

  /**
   * Clear session data
   */
  const clearSessionData = () => {
    try {
      localStorage.removeItem('current_session');
      localStorage.removeItem('session_history');
    } catch (e) {
      console.warn('Failed to clear session data', e);
    }
  };

  return {
    trackToolUsage,
    trackPageView,
    getSessionData,
    getSessionHistory,
    clearSessionData,
  };
}

/**
 * Get session statistics
 */
export function getSessionStats(sessions: SessionData[]) {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalDuration: 0,
      averageSessionDuration: 0,
      uniqueTools: 0,
      totalToolUsage: 0,
      mostUsedTool: null,
    };
  }

  const totalDuration = sessions.reduce((sum, s) => sum + s.totalDuration, 0);
  const allTools = sessions.flatMap(s => s.toolsUsed);
  const toolCounts = allTools.reduce((acc, tool) => {
    acc[tool] = (acc[tool] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostUsedTool = Object.entries(toolCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || null;

  return {
    totalSessions: sessions.length,
    totalDuration,
    averageSessionDuration: totalDuration / sessions.length,
    uniqueTools: Object.keys(toolCounts).length,
    totalToolUsage: allTools.length,
    mostUsedTool,
  };
}
