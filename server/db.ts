import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, presets, sessions, Preset, InsertPreset, Session, InsertSession } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Preset queries
export async function createPreset(preset: InsertPreset): Promise<Preset | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create preset: database not available");
    return null;
  }

  try {
    const result = await db.insert(presets).values(preset);
    const insertId = (result as any)[0]?.insertId;
    if (insertId) {
      const rows = await db.select().from(presets).where(eq(presets.id, insertId));
      return rows[0] || null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create preset:", error);
    return null;
  }
}

export async function getUserPresets(userId: number): Promise<Preset[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get presets: database not available");
    return [];
  }

  try {
    return await db.select().from(presets).where(eq(presets.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get presets:", error);
    return [];
  }
}

export async function getPresetByShareToken(shareToken: string): Promise<Preset | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get preset: database not available");
    return null;
  }

  try {
    const result = await db.select().from(presets).where(eq(presets.shareToken, shareToken)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get preset by share token:", error);
    return null;
  }
}

export async function deletePreset(presetId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete preset: database not available");
    return false;
  }

  try {
    await db.delete(presets).where(and(eq(presets.id, presetId), eq(presets.userId, userId)));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete preset:", error);
    return false;
  }
}

// Session queries
export async function createSession(session: InsertSession): Promise<Session | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create session: database not available");
    return null;
  }

  try {
    const result = await db.insert(sessions).values(session);
    const insertId = (result as any)[0]?.insertId;
    if (insertId) {
      const rows = await db.select().from(sessions).where(eq(sessions.id, insertId));
      return rows[0] || null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create session:", error);
    return null;
  }
}

export async function getUserSessions(userId: number, limit: number = 50): Promise<Session[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get sessions: database not available");
    return [];
  }

  try {
    return await db.select().from(sessions).where(eq(sessions.userId, userId)).limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get sessions:", error);
    return [];
  }
}

export async function getSessionStats(userId: number): Promise<{ toolType: string; totalTime: number; count: number }[] | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get session stats: database not available");
    return null;
  }

  try {
    const userSessions = await db.select().from(sessions).where(eq(sessions.userId, userId));
    const stats: { [key: string]: { totalTime: number; count: number } } = {};

    userSessions.forEach((session) => {
      if (!stats[session.toolType]) {
        stats[session.toolType] = { totalTime: 0, count: 0 };
      }
      stats[session.toolType].totalTime += session.duration;
      stats[session.toolType].count += 1;
    });

    return Object.entries(stats).map(([toolType, data]) => ({
      toolType,
      totalTime: data.totalTime,
      count: data.count,
    }));
  } catch (error) {
    console.error("[Database] Failed to get session stats:", error);
    return null;
  }
}
