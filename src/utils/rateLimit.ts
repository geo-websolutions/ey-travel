// utils/rateLimit.ts
import { admin } from "@/lib/firebaseAdmin";

const db = admin.firestore();

// Different limits for different scenarios
const RATE_LIMITS = {
  DEFAULT: {
    LIMIT: 3,
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
  },
  GOOGLE_SIGN_IN: {
    LIMIT: 3,
    WINDOW_MS: 60 * 60 * 1000,
  },
  FAILED_ATTEMPTS: {
    LIMIT: 3,
    WINDOW_MS: 60 * 60 * 1000,
  },
  GOOGLE_CONNECTION: {
    LIMIT: 3,
    WINDOW_MS: 60 * 60 * 1000,
  },
  EMAIL_SENDING: {
    LIMIT: 3,
    WINDOW_MS: 60 * 60 * 1000,
  },
  TOUR_BOOKING: {
    LIMIT: 3,
    WINDOW_MS: 60 * 60 * 1000,
  },
};

export async function checkRateLimit(ip: string, type: keyof typeof RATE_LIMITS = "DEFAULT") {
  const config = RATE_LIMITS[type];
  const ref = db.collection("rateLimit").doc(`${ip}_${type}`);
  const snap = await ref.get();

  const now = Date.now();
  let timestamps: number[] = [];

  if (snap.exists) {
    timestamps = snap.data()?.timestamps || [];
  }

  // Keep only requests within the window
  const updated = timestamps.filter((t) => now - t < config.WINDOW_MS);

  if (updated.length >= config.LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      reset: Math.ceil((timestamps[0] + config.WINDOW_MS - now) / 1000), // seconds until reset
    };
  }

  updated.push(now);

  // Set with expiry using TTL
  await ref.set({
    timestamps: updated,
    _createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    allowed: true,
    remaining: config.LIMIT - updated.length,
    reset: Math.ceil(config.WINDOW_MS / 1000),
  };
}

// Cleanup old rate limit records (optional Cloud Function)
export async function cleanupOldRateLimits() {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
  const snapshots = await db
    .collection("rateLimit")
    .where("_createdAt", "<", new Date(cutoff))
    .limit(100)
    .get();

  const batch = db.batch();
  snapshots.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`Cleaned up ${snapshots.size} old rate limit records`);
}
