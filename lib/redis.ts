import { Redis } from "ioredis";

export const connection = new Redis({
  host: "localhost",
  port: 6379,
});

export const getValues = async (key: string) => {
  return await connection.get(key);
};

export const setValue = async (key: string, value: string, ttl?: number) => {
  if (ttl) {
    await connection.setex(key, ttl, value);
  } else {
    await connection.set(key, value);
  }
};
