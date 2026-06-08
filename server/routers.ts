import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  presets: router({
    list: protectedProcedure.query(({ ctx }) => db.getUserPresets(ctx.user.id)),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          toolType: z.string().min(1).max(64),
          config: z.record(z.string(), z.any()),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createPreset({
          userId: ctx.user.id,
          name: input.name,
          toolType: input.toolType,
          config: input.config,
          isPublic: "false",
        })
      ),
    delete: protectedProcedure
      .input(z.object({ presetId: z.number() }))
      .mutation(({ ctx, input }) => db.deletePreset(input.presetId, ctx.user.id)),
    share: protectedProcedure
      .input(z.object({ presetId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const presets = await db.getUserPresets(ctx.user.id);
        const target = presets.find((p) => p.id === input.presetId);
        if (!target) return null;
        const shareToken = nanoid(32);
        return { shareToken, shareUrl: `/share/${shareToken}` };
      }),
    getByShareToken: publicProcedure
      .input(z.object({ shareToken: z.string() }))
      .query(({ input }) => db.getPresetByShareToken(input.shareToken)),
  }),

  sessions: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }).optional())
      .query(({ ctx, input }) => db.getUserSessions(ctx.user.id, input?.limit)),
    create: protectedProcedure
      .input(
        z.object({
          toolType: z.string().min(1).max(64),
          duration: z.number().min(0),
          metadata: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createSession({
          userId: ctx.user.id,
          toolType: input.toolType,
          duration: input.duration,
          metadata: input.metadata,
        })
      ),
    stats: protectedProcedure.query(({ ctx }) => db.getSessionStats(ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
