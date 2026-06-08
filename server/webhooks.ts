import { router, publicProcedure, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

/**
 * Webhook event types
 */
export enum WebhookEventType {
  USER_SIGNUP = 'user.signup',
  USER_LOGIN = 'user.login',
  TOOL_USED = 'tool.used',
  SESSION_COMPLETED = 'session.completed',
  PRESET_CREATED = 'preset.created',
  PRESET_SHARED = 'preset.shared',
  FEEDBACK_SUBMITTED = 'feedback.submitted',
  EXPORT_COMPLETED = 'export.completed',
}

/**
 * Webhook payload schema
 */
const WebhookPayloadSchema = z.object({
  event: z.enum([
    WebhookEventType.USER_SIGNUP,
    WebhookEventType.USER_LOGIN,
    WebhookEventType.TOOL_USED,
    WebhookEventType.SESSION_COMPLETED,
    WebhookEventType.PRESET_CREATED,
    WebhookEventType.PRESET_SHARED,
    WebhookEventType.FEEDBACK_SUBMITTED,
    WebhookEventType.EXPORT_COMPLETED,
  ]),
  userId: z.string().optional(),
  timestamp: z.number(),
  data: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Webhook subscription schema
 */
const WebhookSubscriptionSchema = z.object({
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).min(1, 'At least one event must be selected'),
  active: z.boolean().default(true),
});

/**
 * Webhook storage (in-memory for demo, replace with database)
 */
const webhookSubscriptions = new Map<string, any>();

/**
 * Send webhook event to subscribers
 */
async function sendWebhookEvent(event: WebhookEventType, data?: any) {
  const payload = {
    event,
    timestamp: Date.now(),
    data,
  };

  // Send to all subscribed webhooks
  const subscriptions = Array.from(webhookSubscriptions.values());
  for (const subscription of subscriptions) {
    if (subscription.active && subscription.events.includes(event)) {
      try {
        await fetch(subscription.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': generateSignature(payload),
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error(`Failed to send webhook to ${subscription.url}:`, error);
      }
    }
  }
}

/**
 * Generate webhook signature for verification
 */
function generateSignature(payload: any): string {
  // In production, use HMAC with a secret key
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Webhook router
 */
export const webhookRouter = router({
  /**
   * Subscribe to webhook events
   */
  subscribe: protectedProcedure
    .input(WebhookSubscriptionSchema)
    .mutation(async ({ input, ctx }) => {
      const webhookId = `webhook_${ctx.user.id}_${Date.now()}`;

      webhookSubscriptions.set(webhookId, {
        ...input,
        userId: ctx.user.id,
        createdAt: Date.now(),
      });

      return {
        webhookId,
        message: 'Webhook subscription created successfully',
      };
    }),

  /**
   * List webhook subscriptions
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const userWebhooks: any[] = [];

    const entries = Array.from(webhookSubscriptions.entries());
    for (const [id, subscription] of entries) {
      if (subscription.userId === ctx.user.id) {
        userWebhooks.push({
          id,
          ...subscription,
        });
      }
    }

    return userWebhooks;
  }),

  /**
   * Update webhook subscription
   */
  update: protectedProcedure
    .input(
      z.object({
        webhookId: z.string(),
        data: WebhookSubscriptionSchema.partial(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const subscription = webhookSubscriptions.get(input.webhookId);

      if (!subscription) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Webhook not found',
        });
      }

      if (subscription.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this webhook',
        });
      }

      const updated = {
        ...subscription,
        ...input.data,
      };

      webhookSubscriptions.set(input.webhookId, updated);

      return {
        webhookId: input.webhookId,
        message: 'Webhook updated successfully',
      };
    }),

  /**
   * Delete webhook subscription
   */
  delete: protectedProcedure
    .input(z.object({ webhookId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const subscription = webhookSubscriptions.get(input.webhookId);

      if (!subscription) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Webhook not found',
        });
      }

      if (subscription.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this webhook',
        });
      }

      webhookSubscriptions.delete(input.webhookId);

      return {
        message: 'Webhook deleted successfully',
      };
    }),

  /**
   * Test webhook delivery
   */
  test: protectedProcedure
    .input(z.object({ webhookId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const subscription = webhookSubscriptions.get(input.webhookId);

      if (!subscription) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Webhook not found',
        });
      }

      if (subscription.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to test this webhook',
        });
      }

      try {
        const testPayload = {
          event: 'test.event',
          timestamp: Date.now(),
          data: {
            message: 'This is a test webhook delivery',
          },
        };

        const response = await fetch(subscription.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': generateSignature(testPayload),
          },
          body: JSON.stringify(testPayload),
        });

        return {
          success: response.ok,
          statusCode: response.status,
          message: response.ok ? 'Webhook test successful' : 'Webhook test failed',
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * Get webhook events
   */
  getEvents: publicProcedure.query(() => {
    return Object.values(WebhookEventType).map((event) => ({
      value: event,
      label: event
        .split('.')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
    }));
  }),
});

/**
 * Export webhook event sender for use in other routers
 */
export { sendWebhookEvent };
