import Redis from "ioredis";

export const redis = new Redis(
  process.env.REDIS_URL ?? "redis://localhost:6379",
);

export const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get(key);
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
};

export const setCache = async <T>(
  key: string,
  value: T,
  ttlSeconds: number,
): Promise<void> => {
  const data = JSON.stringify(value);
  await redis.set(key, data, "EX", ttlSeconds);
};
